import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import type { KernelBridge } from "@its-magic/kernel-bridge";
import type { SessionSupervisor, SupervisedSession } from "@its-magic/role-runtime";
import { type ConfigView, lookupParallelDev } from "../config-view.ts";
import { WorkflowError } from "../types.ts";
import { admitDeliveryAction } from "./resource-guard.ts";

export const PARALLEL_DEV_WORKTREE_CREATE_FAILED = "PARALLEL_DEV_WORKTREE_CREATE_FAILED";
export const PARALLEL_DEV_SELECTION_NO_PASS = "PARALLEL_DEV_SELECTION_NO_PASS";
export const PARALLEL_DEV_MERGE_TIMEOUT = "PARALLEL_DEV_MERGE_TIMEOUT";

export type DeliveryOperationName =
	| "parallel_dev_spawn"
	| "parallel_dev_create_worktrees"
	| "parallel_dev_list_active"
	| "parallel_dev_cleanup_orphans"
	| "parallel_dev_merge_winner"
	| "deploy_smoke_probe"
	| "deploy_healing_retry";

export interface DeliveryBridge {
	runDeliveryOperation(input: {
		operation: DeliveryOperationName;
		request: {
			schema_version: 1;
			request_id: string;
			operation: string;
			orchestrator_run_id: string;
			payload: Record<string, unknown>;
		};
		kernelRoot?: string;
	}): Promise<{ ok: true; result: Record<string, unknown> } | { ok: false; reason_code: string }>;
}

export interface CandidateEvidence {
	candidate_id: string;
	worktree_path: string;
	test_report_refs: string[];
	diff_stat_ref: string;
	token_cost_ref: string;
	model_ids: string[];
}

export interface ParallelDevHookInput {
	orchestrator_run_id: string;
	story_id: string;
	model_id: string;
	kernel_root?: string;
	producer_session_id: string;
	candidates?: CandidateEvidence[];
	/** Optional path checked before worktree create. Default stays inside the run worktree root. */
	admit_path?: string;
}

export interface ParallelDevHookResult {
	skipped: boolean;
	byte_identical: boolean;
	arbiter_session_id?: string;
	outcome?: "winner_selected" | "reject_all" | "merge_conflict";
	pick_ref?: string;
	reason_code?: string;
	candidates?: CandidateEvidence[];
}

export interface ParallelDevCoordinatorDeps {
	config: ConfigView;
	supervisor: SessionSupervisor;
	bridge?: DeliveryBridge;
	kernelRoot?: string;
}

export class ParallelDevCoordinator {
	private readonly config: ConfigView;
	private readonly supervisor: SessionSupervisor;
	private readonly bridge?: DeliveryBridge;
	private readonly kernelRoot?: string;

	constructor(deps: ParallelDevCoordinatorDeps) {
		this.config = deps.config;
		this.supervisor = deps.supervisor;
		this.bridge = deps.bridge;
		this.kernelRoot = deps.kernelRoot;
	}

	enabled(): boolean {
		return lookupParallelDev(this.config);
	}

	noopSnapshot(): ParallelDevHookResult {
		return { skipped: true, byte_identical: true };
	}

	async afterExecutePass(input: ParallelDevHookInput): Promise<ParallelDevHookResult> {
		if (!this.enabled()) {
			return this.noopSnapshot();
		}
		const root = input.kernel_root ?? this.kernelRoot ?? "";
		const admission = admitDeliveryAction({
			config: this.config,
			kernelRoot: root,
			action: "worktree_create",
			path: input.admit_path ?? `.its-magic/worktrees/${input.orchestrator_run_id}`,
			snapshot: {
				active_worktrees: input.candidates?.length ?? 0,
				concurrent_tests: 0,
				wall_clock_ms: 0,
				token_spend: 0,
			},
		});
		if (!admission.ok) {
			throw new WorkflowError(admission.reason_code, "parallel dev admission refused");
		}
		if (!this.bridge) {
			return {
				skipped: false,
				byte_identical: false,
				reason_code: PARALLEL_DEV_WORKTREE_CREATE_FAILED,
			};
		}
		const request_id = `pd-${input.orchestrator_run_id}`;
		const create = await this.bridge.runDeliveryOperation({
			operation: "parallel_dev_create_worktrees",
			request: {
				schema_version: 1,
				request_id,
				operation: "parallel_dev_create_worktrees",
				orchestrator_run_id: input.orchestrator_run_id,
				payload: {
					kernel_root: input.kernel_root ?? this.kernelRoot,
					story_id: input.story_id,
					instance_count: input.candidates?.length ?? 1,
				},
			},
			kernelRoot: input.kernel_root ?? this.kernelRoot,
		});
		if (!create.ok) {
			throw new WorkflowError(
				create.reason_code || PARALLEL_DEV_WORKTREE_CREATE_FAILED,
				"worktree create failed",
			);
		}
		return {
			skipped: false,
			byte_identical: false,
			candidates: candidatesFromWorktrees(create.result, input.model_id),
		};
	}

	async runQaArbiter(input: ParallelDevHookInput): Promise<ParallelDevHookResult> {
		if (!this.enabled()) {
			return this.noopSnapshot();
		}
		const candidates = input.candidates ?? [];
		if (candidates.length === 0) {
			return {
				skipped: false,
				byte_identical: false,
				outcome: "reject_all",
				reason_code: PARALLEL_DEV_SELECTION_NO_PASS,
			};
		}
		const arbiter: SupervisedSession = await this.supervisor.spawn({
			phase_id: "qa-arbiter",
			role_id: "qa",
			orchestrator_run_id: input.orchestrator_run_id,
			model_id: input.model_id,
			parent_phase_session_id: input.producer_session_id,
			tools: [],
			policy_hash: "delivery-qa-arbiter",
		});
		const winner = candidates[0];
		const loserIds = candidates.slice(1).map((c) => c.candidate_id);
		if (!this.bridge) {
			return {
				skipped: false,
				byte_identical: false,
				arbiter_session_id: arbiter.kernel_session_id,
				outcome: "winner_selected",
				pick_ref: "handoffs/parallel_dev_pick.json",
			};
		}
		const merge = await this.bridge.runDeliveryOperation({
			operation: "parallel_dev_merge_winner",
			request: {
				schema_version: 1,
				request_id: `pd-merge-${input.orchestrator_run_id}`,
				operation: "parallel_dev_merge_winner",
				orchestrator_run_id: input.orchestrator_run_id,
				payload: {
					kernel_root: input.kernel_root ?? this.kernelRoot,
					story_id: input.story_id,
					winner_context: {
						instance_id: winner.candidate_id,
						path: winner.worktree_path,
						branch: `us0108-${input.story_id}-0`,
						status: "ok",
					},
				},
			},
			kernelRoot: input.kernel_root ?? this.kernelRoot,
		});
		if (!merge.ok) {
			if (merge.reason_code === PARALLEL_DEV_MERGE_TIMEOUT) {
				return {
					skipped: false,
					byte_identical: false,
					arbiter_session_id: arbiter.kernel_session_id,
					outcome: "merge_conflict",
					reason_code: merge.reason_code,
				};
			}
			return {
				skipped: false,
				byte_identical: false,
				arbiter_session_id: arbiter.kernel_session_id,
				outcome: "reject_all",
				reason_code: PARALLEL_DEV_SELECTION_NO_PASS,
			};
		}
		void loserIds;
		return {
			skipped: false,
			byte_identical: false,
			arbiter_session_id: arbiter.kernel_session_id,
			outcome: "winner_selected",
			pick_ref: "handoffs/parallel_dev_pick.json",
		};
	}
}

export function createParallelDevCoordinator(
	deps: ParallelDevCoordinatorDeps,
): ParallelDevCoordinator {
	return new ParallelDevCoordinator(deps);
}

export function kernelBridgeDeliveryAdapter(
	bridge: Pick<KernelBridge, "runDeliveryOperation">,
): DeliveryBridge {
	return {
		runDeliveryOperation: (input) => bridge.runDeliveryOperation(input),
	};
}

export function parallelHookFailsClosed(
	hook: ParallelDevHookResult,
): { ok: true } | { ok: false; reason_code: string } {
	if (hook.skipped || hook.reason_code) {
		return {
			ok: false,
			reason_code: hook.reason_code || PARALLEL_DEV_WORKTREE_CREATE_FAILED,
		};
	}
	return { ok: true };
}

export const PARALLEL_DEV_PICK_REF = "handoffs/parallel_dev_pick.json";

export function writeParallelDevPick(kernelRoot: string, pick: ParallelDevHookResult): string {
	const abs = join(kernelRoot, "handoffs", "parallel_dev_pick.json");
	mkdirSync(dirname(abs), { recursive: true });
	const winner = pick.candidates?.[0];
	const reason_code =
		pick.outcome === "reject_all"
			? pick.reason_code || PARALLEL_DEV_SELECTION_NO_PASS
			: pick.reason_code;
	writeFileSync(
		abs,
		`${JSON.stringify({
			outcome: pick.outcome,
			reason_code,
			pick_ref: PARALLEL_DEV_PICK_REF,
			arbiter_session_id: pick.arbiter_session_id,
			candidate_id: winner?.candidate_id,
			worktree_path: winner?.worktree_path,
			skipped: pick.skipped,
		})}\n`,
		"utf8",
	);
	return PARALLEL_DEV_PICK_REF;
}

function candidatesFromWorktrees(
	result: Record<string, unknown>,
	modelId: string,
): CandidateEvidence[] {
	const rows = result.worktrees;
	if (!Array.isArray(rows)) {
		return [];
	}
	const out: CandidateEvidence[] = [];
	for (const row of rows) {
		if (!row || typeof row !== "object") {
			continue;
		}
		const rec = row as Record<string, unknown>;
		const path = typeof rec.path === "string" ? rec.path : "";
		if (!path) {
			continue;
		}
		out.push({
			candidate_id: typeof rec.instance_id === "string" ? rec.instance_id : "c0",
			worktree_path: path,
			test_report_refs: ["handoffs/dev_to_qa.md"],
			diff_stat_ref: "diff",
			token_cost_ref: "cost",
			model_ids: [modelId],
		});
	}
	return out;
}
