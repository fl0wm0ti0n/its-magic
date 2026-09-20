import type { KernelBridge } from "@its-magic/kernel-bridge";
import type { SessionSupervisor, SupervisedSession } from "@its-magic/role-runtime";
import { type ConfigView, lookupParallelDev } from "../config-view.ts";
import { WorkflowError } from "../types.ts";
import { createDeliveryResourceGuard } from "./resource-guard.ts";

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
}

export interface ParallelDevHookResult {
	skipped: boolean;
	byte_identical: boolean;
	arbiter_session_id?: string;
	outcome?: "winner_selected" | "reject_all" | "merge_conflict";
	pick_ref?: string;
	reason_code?: string;
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
	private readonly guard;

	constructor(deps: ParallelDevCoordinatorDeps) {
		this.config = deps.config;
		this.supervisor = deps.supervisor;
		this.bridge = deps.bridge;
		this.kernelRoot = deps.kernelRoot;
		this.guard = createDeliveryResourceGuard(deps.config);
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
		const cap = this.guard.check({
			active_worktrees: input.candidates?.length ?? 0,
			concurrent_tests: 0,
			wall_clock_ms: 0,
			token_spend: 0,
		});
		if (!cap.ok) {
			throw new WorkflowError(cap.reason_code, "parallel dev resource guard");
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
		return { skipped: false, byte_identical: false };
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
