import { createHash } from "node:crypto";
import type {
	KernelBridge,
	SovereignOperationResult,
	SovereignRequestEnvelope,
} from "@its-magic/kernel-bridge";
import type { SpawnBootstrap } from "@its-magic/role-runtime";
import { type ConfigView, lookupSovereignRuntime } from "./config-view.ts";
import { WorkflowError } from "./types.ts";

export const SOVEREIGN_DRAIN_OPERATOR_DECISION_REQUIRED =
	"SOVEREIGN_DRAIN_OPERATOR_DECISION_REQUIRED";

export type SovereignRuntimeResult =
	| {
			ok: true;
			evidence: {
				critic: { critic_model_id: string; degraded: boolean };
				role_reviews: Array<Record<string, unknown>>;
				convergence: Record<string, unknown>;
				goal_progress: Record<string, unknown>;
				caps: Record<string, unknown>;
				partial_delivery_ref?: string;
			};
	  }
	| { ok: false; reason_code: string; remediation: string };

export interface DrainCandidate {
	candidate_id: string;
	operator_decision?: "accept" | "reject" | "defer" | "pending";
	title?: string;
}

export interface GateDrainResult {
	candidate_id: string;
	decision_gate: true;
	operator_decision: string;
	materialize: boolean;
}

export interface SovereignRuntimeDeps {
	config: ConfigView;
	kernelBridge?: Partial<Pick<KernelBridge, "runSovereignOperation">>;
	kernelRoot?: string;
	requestId?: () => string;
}

export class SovereignRuntime {
	private readonly config: ConfigView;
	private readonly kernelBridge?: Partial<Pick<KernelBridge, "runSovereignOperation">>;
	private readonly kernelRoot?: string;
	private readonly requestId: () => string;
	readonly calls: string[] = [];

	constructor(deps: SovereignRuntimeDeps) {
		this.config = deps.config;
		this.kernelBridge = deps.kernelBridge;
		this.kernelRoot = deps.kernelRoot;
		this.requestId = deps.requestId ?? (() => crypto.randomUUID());
	}

	enabled(): boolean {
		return lookupSovereignRuntime(this.config);
	}

	private async call(
		operation: Parameters<KernelBridge["runSovereignOperation"]>[0]["operation"],
		runId: string,
		payload: Record<string, unknown>,
	): Promise<SovereignOperationResult> {
		if (!this.enabled()) {
			throw new WorkflowError(
				"KERNEL_SOVEREIGN_FAILED",
				"sovereign operation invoked while SOVEREIGN_RUNTIME=0",
			);
		}
		if (!this.kernelBridge?.runSovereignOperation) {
			throw new WorkflowError("KERNEL_SOVEREIGN_FAILED", "KernelBridge missing for sovereign op");
		}
		this.calls.push(operation);
		const request: SovereignRequestEnvelope = {
			schema_version: 1,
			request_id: this.requestId(),
			operation,
			orchestrator_run_id: runId,
			payload,
		};
		return this.kernelBridge.runSovereignOperation({
			operation,
			request,
			kernelRoot: this.kernelRoot,
		});
	}

	async afterProducerBoundary(input: {
		orchestrator_run_id: string;
		producer_model_id: string;
		phase_id: string;
		producer_role: string;
		producer_evidence_ref?: string;
		iteration?: number;
		token_budget_remaining?: number;
		scratchpad?: Record<string, string>;
	}): Promise<SovereignRuntimeResult | undefined> {
		if (!this.enabled()) {
			return undefined;
		}
		if (this.config.sovereign?.CROSS_MODEL_REVIEW !== "1") {
			return undefined;
		}
		const scratchpad = {
			CROSS_MODEL_REVIEW: "1",
			SOVEREIGN_RUNTIME: "1",
			...(input.scratchpad ?? {}),
		};
		const criticOp = await this.call("critic_model", input.orchestrator_run_id, {
			producer_model_id: input.producer_model_id,
			phase_id: input.phase_id,
			scratchpad,
			repo_root: this.kernelRoot,
		});
		if (!criticOp.ok) {
			return {
				ok: false,
				reason_code: criticOp.reason_code,
				remediation: "select_critic_model failed; do not claim cross-model independence",
			};
		}
		const reviewsOp = await this.call("role_review_plan", input.orchestrator_run_id, {
			phase_id: input.phase_id,
			producer_role: input.producer_role,
			producer_evidence_ref: input.producer_evidence_ref ?? "",
			scratchpad,
			repo_root: this.kernelRoot,
		});
		if (!reviewsOp.ok) {
			return {
				ok: false,
				reason_code: reviewsOp.reason_code,
				remediation: "role-review plan failed; reviews remain supplementary",
			};
		}
		const convOp = await this.call("convergence_evaluate", input.orchestrator_run_id, {
			orchestrator_run_id: input.orchestrator_run_id,
			iteration: input.iteration ?? 0,
			scratchpad,
			repo_root: this.kernelRoot,
		});
		if (!convOp.ok) {
			return {
				ok: false,
				reason_code: convOp.reason_code,
				remediation: "evaluate_convergence failed closed",
			};
		}
		const converged = convOp.result.converged === true;
		const caps = {
			iteration: input.iteration ?? 0,
			token_budget_remaining: input.token_budget_remaining,
			non_convergence_reasons: convOp.result.unmet_conditions ?? [],
		};
		const goal_progress = {
			converged,
			unmet_conditions: convOp.result.unmet_conditions ?? [],
			blocked_by: convOp.result.blocked_by ?? [],
		};
		let partial_delivery_ref: string | undefined;
		if (!converged) {
			const partial = await this.call("partial_delivery_write", input.orchestrator_run_id, {
				orchestrator_run_id: input.orchestrator_run_id,
				goal_text: String(input.producer_evidence_ref ?? ""),
				scratchpad,
				repo_root: this.kernelRoot,
			});
			if (partial.ok && typeof partial.result.path === "string") {
				partial_delivery_ref = partial.result.path;
			}
		}
		const critic = {
			critic_model_id: String(criticOp.result.critic_model_id ?? ""),
			degraded: criticOp.result.degraded === true,
		};
		const role_reviews = Array.isArray(reviewsOp.result.dispatches)
			? (reviewsOp.result.dispatches as Array<Record<string, unknown>>)
			: [];
		const smoke = convOp.result.smoke_browser_claimed;
		if (smoke === true) {
			return {
				ok: false,
				reason_code: "SOVEREIGN_SMOKE_BROWSER_CLAIM_FORBIDDEN",
				remediation: "smoke surrogates never assert browser success",
			};
		}
		return {
			ok: true,
			evidence: {
				critic,
				role_reviews,
				convergence: {
					...convOp.result,
					blocking_only: true,
					smoke_browser_claimed: false,
				},
				goal_progress,
				caps,
				partial_delivery_ref,
			},
		};
	}

	async gateDrainCandidate(input: {
		orchestrator_run_id: string;
		candidate: DrainCandidate;
		auto_accept?: string;
		preset_auto_accept?: string;
		scratchpad?: Record<string, string>;
	}): Promise<GateDrainResult> {
		if (!this.enabled()) {
			throw new WorkflowError(
				"KERNEL_SOVEREIGN_FAILED",
				"gateDrainCandidate is exclusive to SOVEREIGN_RUNTIME=1 sovereign-generated candidates",
			);
		}
		const explicit =
			input.auto_accept ??
			this.config.sovereign?.SOVEREIGN_DRAIN_AUTO_ACCEPT ??
			this.config.autonomy?.flags?.SOVEREIGN_DRAIN_AUTO_ACCEPT ??
			"0";
		const effective = explicit === "0" ? "0" : (input.preset_auto_accept ?? explicit);
		const operator_decision = input.candidate.operator_decision ?? "pending";
		const op = await this.call("drain_candidate_gate", input.orchestrator_run_id, {
			candidate_id: input.candidate.candidate_id,
			operator_decision,
			auto_accept: effective,
			preset_auto_accept: input.preset_auto_accept ?? "",
			scratchpad: input.scratchpad ?? { SOVEREIGN_RUNTIME: "1" },
			repo_root: this.kernelRoot,
		});
		if (!op.ok) {
			throw new WorkflowError(op.reason_code, "drain_candidate_gate failed");
		}
		const materialize = op.result.materialize === true;
		if (!materialize) {
			throw new WorkflowError(
				SOVEREIGN_DRAIN_OPERATOR_DECISION_REQUIRED,
				`candidate ${input.candidate.candidate_id} requires operator accept`,
			);
		}
		return {
			candidate_id: String(op.result.candidate_id ?? input.candidate.candidate_id),
			decision_gate: true,
			operator_decision: String(op.result.operator_decision ?? operator_decision),
			materialize: true,
		};
	}

	advanceCandidates(bundle: { candidates?: DrainCandidate[] } | undefined): DrainCandidate[] {
		return [...(bundle?.candidates ?? [])];
	}
}

export function createSovereignRuntime(deps: SovereignRuntimeDeps): SovereignRuntime {
	return new SovereignRuntime(deps);
}

export function bootstrapHash(text: string): string {
	return createHash("sha256").update(text, "utf8").digest("hex").toUpperCase();
}

export function composeBootstrapText(parts: {
	phaseContext: string;
	digestBlock?: string;
	roleObjective: string;
}): string {
	const chunks = [parts.phaseContext];
	if (parts.digestBlock) {
		chunks.push(parts.digestBlock);
	}
	chunks.push(parts.roleObjective);
	return chunks.join("\n\n");
}

export function toSpawnBootstrap(input: {
	text: string;
	digest_entry_ids: string[];
	digest_char_count: number;
	role_objective_applied: boolean;
}): SpawnBootstrap {
	return {
		text: input.text,
		context_hash: bootstrapHash(input.text),
		digest_entry_ids: input.digest_entry_ids,
		digest_char_count: input.digest_char_count,
		role_objective_applied: input.role_objective_applied,
	};
}
