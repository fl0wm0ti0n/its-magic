import { createHash } from "node:crypto";
import { appendFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { releaseCannotMarkDone } from "../closure.ts";
import { type ConfigView, lookupSelfHealingDeploy } from "../config-view.ts";
import { WorkflowError } from "../types.ts";
import type { DeliveryBridge } from "./parallel-dev.ts";

export const DEPLOY_DEFERRED = "DEPLOY_DEFERRED";
export const DEPLOY_HEALING_DEFERRED = "DEPLOY_HEALING_DEFERRED";

export type ReleaseTargetKind = "git_github" | "npm" | "ssh_command" | "docker" | "custom_command";

export interface ReleaseTargetContext {
	kernelRoot: string;
	sprint_id: string;
	orchestrator_run_id: string;
	target_id: string;
	attempt: number;
	secrets_ref?: string;
	dry_run?: boolean;
}

export interface DeployTargetResult {
	target_id: string;
	kind: ReleaseTargetKind;
	ok: boolean;
	reason_code?: string;
	stdout_ref?: string;
	artifact_sha?: string;
	target_run_key: string;
}

export interface ReleaseTargetAdapter {
	kind: ReleaseTargetKind;
	describe(): string;
	dryRun(ctx: ReleaseTargetContext): Promise<DeployTargetResult>;
	apply(ctx: ReleaseTargetContext): Promise<DeployTargetResult>;
	verify(ctx: ReleaseTargetContext): Promise<DeployTargetResult>;
}

function targetRunKey(ctx: ReleaseTargetContext): string {
	const raw = `${ctx.orchestrator_run_id}|${ctx.sprint_id}|${ctx.target_id}|${ctx.attempt}`;
	return createHash("sha256").update(raw).digest("hex").slice(0, 32);
}

function baseResult(
	ctx: ReleaseTargetContext,
	kind: ReleaseTargetKind,
	ok: boolean,
): DeployTargetResult {
	return {
		target_id: ctx.target_id,
		kind,
		ok,
		target_run_key: targetRunKey(ctx),
	};
}

function stubAdapter(kind: ReleaseTargetKind): ReleaseTargetAdapter {
	return {
		kind,
		describe: () => `${kind} adapter (US-0145)`,
		async dryRun(ctx) {
			return { ...baseResult(ctx, kind, true), stdout_ref: "dry-run" };
		},
		async apply(ctx) {
			if (ctx.dry_run) {
				return this.dryRun(ctx);
			}
			return { ...baseResult(ctx, kind, true), artifact_sha: "fake-sha" };
		},
		async verify(ctx) {
			return baseResult(ctx, kind, true);
		},
	};
}

const ADAPTERS: Record<ReleaseTargetKind, ReleaseTargetAdapter> = {
	git_github: stubAdapter("git_github"),
	npm: stubAdapter("npm"),
	ssh_command: stubAdapter("ssh_command"),
	docker: stubAdapter("docker"),
	custom_command: stubAdapter("custom_command"),
};

export function getReleaseTargetAdapter(kind: ReleaseTargetKind): ReleaseTargetAdapter {
	return ADAPTERS[kind];
}

export function listReleaseTargetKinds(): ReleaseTargetKind[] {
	return Object.keys(ADAPTERS) as ReleaseTargetKind[];
}

export function appendDeployTargetResult(kernelRoot: string, entry: DeployTargetResult): string {
	const rel = join("handoffs", "deploy_results", "deploy_results.jsonl");
	const abs = join(kernelRoot, rel);
	mkdirSync(dirname(abs), { recursive: true });
	appendFileSync(abs, `${JSON.stringify(entry)}\n`, "utf8");
	return rel;
}

export interface ReleaseDeployPipelineDeps {
	config: ConfigView;
	bridge?: DeliveryBridge;
	kernelRoot: string;
}

export class ReleaseDeployPipeline {
	private readonly config: ConfigView;
	private readonly bridge?: DeliveryBridge;
	private readonly kernelRoot: string;

	constructor(deps: ReleaseDeployPipelineDeps) {
		this.config = deps.config;
		this.bridge = deps.bridge;
		this.kernelRoot = deps.kernelRoot;
	}

	healingEnabled(): boolean {
		return lookupSelfHealingDeploy(this.config);
	}

	async dryRunTargets(
		targets: { kind: ReleaseTargetKind; target_id: string }[],
		ctx: Omit<ReleaseTargetContext, "target_id" | "kind" | "attempt">,
	): Promise<DeployTargetResult[]> {
		const out: DeployTargetResult[] = [];
		for (const t of targets) {
			const adapter = getReleaseTargetAdapter(t.kind);
			const full: ReleaseTargetContext = {
				...ctx,
				target_id: t.target_id,
				attempt: 1,
				dry_run: true,
			};
			const result = await adapter.dryRun(full);
			appendDeployTargetResult(this.kernelRoot, result);
			out.push(result);
		}
		return out;
	}

	async runPostDeployHealing(input: {
		orchestrator_run_id: string;
		story_id: string;
		scratchpad?: Record<string, string>;
		publish_ok?: boolean;
	}): Promise<{ ok: boolean; deferred?: boolean; reason_code?: string; attempts?: number }> {
		if (!this.healingEnabled()) {
			return { ok: true };
		}
		if (!this.bridge) {
			return { ok: false, reason_code: DEPLOY_HEALING_DEFERRED, deferred: true };
		}
		const probe = await this.bridge.runDeliveryOperation({
			operation: "deploy_smoke_probe",
			request: {
				schema_version: 1,
				request_id: `smoke-${input.orchestrator_run_id}`,
				operation: "deploy_smoke_probe",
				orchestrator_run_id: input.orchestrator_run_id,
				payload: {
					kernel_root: this.kernelRoot,
					scratchpad: input.scratchpad ?? { AUTO_SOVEREIGN_SELF_HEALING_DEPLOY: "1" },
				},
			},
			kernelRoot: this.kernelRoot,
		});
		if (probe.ok && probe.result.overall === "pass") {
			return { ok: true };
		}
		const healing = await this.bridge.runDeliveryOperation({
			operation: "deploy_healing_retry",
			request: {
				schema_version: 1,
				request_id: `heal-${input.orchestrator_run_id}`,
				operation: "deploy_healing_retry",
				orchestrator_run_id: input.orchestrator_run_id,
				payload: {
					kernel_root: this.kernelRoot,
					story_id: input.story_id,
					scratchpad: input.scratchpad ?? { AUTO_SOVEREIGN_SELF_HEALING_DEPLOY: "1" },
					publish_ok: input.publish_ok ?? false,
				},
			},
			kernelRoot: this.kernelRoot,
		});
		if (!healing.ok) {
			return {
				ok: false,
				deferred: true,
				reason_code: healing.reason_code || DEPLOY_DEFERRED,
				attempts: 0,
			};
		}
		return {
			ok: healing.result.overall === "pass",
			attempts: Number(healing.result.attempts ?? 0),
			reason_code: String(healing.result.reason_code ?? ""),
		};
	}

	releaseWriteGuard(): { marked_done: false } {
		return releaseCannotMarkDone();
	}
}

export function createReleaseDeployPipeline(
	deps: ReleaseDeployPipelineDeps,
): ReleaseDeployPipeline {
	return new ReleaseDeployPipeline(deps);
}

export function assertReleaseCannotMarkDone(): void {
	const guard = releaseCannotMarkDone();
	if (guard.marked_done !== false) {
		throw new WorkflowError("RELEASE_CLOSURE_BOUNDARY", "release cannot mark DONE");
	}
}
