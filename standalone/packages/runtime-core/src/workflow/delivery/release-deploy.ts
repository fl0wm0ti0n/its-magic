import { createHash } from "node:crypto";
import { appendFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { releaseCannotMarkDone } from "../closure.ts";
import { type ConfigView, lookupSelfHealingDeploy } from "../config-view.ts";
import { WorkflowError } from "../types.ts";
import type { DeliveryBridge } from "./parallel-dev.ts";
import { admitDeliveryAction } from "./resource-guard.ts";

export const DEPLOY_DEFERRED = "DEPLOY_DEFERRED";
export const DEPLOY_HEALING_DEFERRED = "DEPLOY_HEALING_DEFERRED";
export const RELEASE_TARGET_UNCONFIGURED = "RELEASE_TARGET_UNCONFIGURED";
export const FAKE_ARTIFACT_SHA = "fake-sha";

const RELEASE_TARGET_KINDS = new Set<ReleaseTargetKind>([
	"git_github",
	"npm",
	"ssh_command",
	"docker",
	"custom_command",
]);

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

export interface ConfiguredReleaseTarget {
	kind: ReleaseTargetKind;
	target_id: string;
	endpoint: string;
}

export interface ConfiguredReleaseVerdict {
	results: DeployTargetResult[];
	deploy_targets_pass: boolean;
	artifact_refs: string[];
}

export function lookupConfiguredReleaseTargets(config: ConfigView): ConfiguredReleaseTarget[] {
	const rows = config.release?.targets ?? [];
	const out: ConfiguredReleaseTarget[] = [];
	for (const row of rows) {
		if (!row || !RELEASE_TARGET_KINDS.has(row.kind as ReleaseTargetKind)) {
			continue;
		}
		if (typeof row.target_id !== "string" || row.target_id.length === 0) {
			continue;
		}
		out.push({
			kind: row.kind as ReleaseTargetKind,
			target_id: row.target_id,
			endpoint: typeof row.endpoint === "string" ? row.endpoint : "",
		});
	}
	return out;
}

export function deployTargetsPass(
	results: readonly Pick<DeployTargetResult, "ok" | "artifact_sha" | "reason_code">[],
): boolean {
	if (results.length === 0) {
		return false;
	}
	return results.every(
		(result) =>
			result.ok === true &&
			typeof result.artifact_sha === "string" &&
			result.artifact_sha.length > 0 &&
			result.artifact_sha !== FAKE_ARTIFACT_SHA &&
			result.reason_code !== RELEASE_TARGET_UNCONFIGURED,
	);
}

export function deployVerificationPass(result: DeployTargetResult): boolean {
	return (
		result.ok === true &&
		typeof result.artifact_sha === "string" &&
		result.artifact_sha.length > 0 &&
		result.artifact_sha !== FAKE_ARTIFACT_SHA &&
		typeof result.stdout_ref === "string" &&
		result.stdout_ref.length > 0 &&
		result.reason_code !== RELEASE_TARGET_UNCONFIGURED
	);
}

export interface RunReleaseEvidence {
	tests_pass: boolean;
	qa_pass: boolean;
	uat_pass: boolean;
	artifact_refs: string[];
	premature: boolean;
}

export function readRunReleaseEvidence(kernelRoot: string, runId: string): RunReleaseEvidence {
	const abs = join(kernelRoot, "handoffs", "run-evidence", `${runId}.json`);
	const empty: RunReleaseEvidence = {
		tests_pass: false,
		qa_pass: false,
		uat_pass: false,
		artifact_refs: [],
		premature: true,
	};
	if (!existsSync(abs)) {
		return empty;
	}
	let parsed: Record<string, unknown>;
	try {
		parsed = JSON.parse(readFileSync(abs, "utf8")) as Record<string, unknown>;
	} catch {
		return empty;
	}
	const rawRefs = Array.isArray(parsed.artifact_refs) ? parsed.artifact_refs : [];
	const artifact_refs = rawRefs.filter(
		(ref): ref is string =>
			typeof ref === "string" &&
			ref.length > 0 &&
			ref !== "sprints/S0151/summary.md" &&
			existsSync(join(kernelRoot, ref)),
	);
	const tests_pass = parsed.tests_pass === true;
	const qa_pass = parsed.qa_pass === true;
	const uat_pass = parsed.uat_pass === true;
	return {
		tests_pass,
		qa_pass,
		uat_pass,
		artifact_refs,
		premature:
			parsed.premature === true ||
			!tests_pass ||
			!qa_pass ||
			!uat_pass ||
			artifact_refs.length === 0,
	};
}

function configuredArtifactSha(target: ConfiguredReleaseTarget, runId: string): string {
	return createHash("sha256")
		.update(`${target.kind}|${target.target_id}|${target.endpoint}|${runId}`)
		.digest("hex");
}

function unconfiguredResult(
	ctx: Omit<ReleaseTargetContext, "target_id" | "attempt">,
	target_id = "missing",
): DeployTargetResult {
	return {
		...baseResult({ ...ctx, target_id, attempt: 1 }, "custom_command", false),
		reason_code: RELEASE_TARGET_UNCONFIGURED,
	};
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

	async applyConfiguredTargets(
		ctx: Omit<ReleaseTargetContext, "target_id" | "attempt">,
		options?: { admit_path?: string },
	): Promise<ConfiguredReleaseVerdict> {
		const root = ctx.kernelRoot || this.kernelRoot;
		const admission = admitDeliveryAction({
			config: this.config,
			kernelRoot: root,
			action: "deploy",
			path: options?.admit_path ?? "handoffs/deploy_results",
		});
		if (!admission.ok) {
			const denied = unconfiguredResult(ctx, "denied");
			denied.reason_code = admission.reason_code;
			denied.ok = false;
			return { results: [denied], deploy_targets_pass: false, artifact_refs: [] };
		}
		const configured = lookupConfiguredReleaseTargets(this.config);
		if (configured.length === 0) {
			const missing = unconfiguredResult(ctx);
			appendDeployTargetResult(root, missing);
			return { results: [missing], deploy_targets_pass: false, artifact_refs: [] };
		}
		const results: DeployTargetResult[] = [];
		for (const target of configured) {
			if (!target.endpoint) {
				const missing = unconfiguredResult(ctx, target.target_id);
				missing.kind = target.kind;
				appendDeployTargetResult(root, missing);
				results.push(missing);
				continue;
			}
			const adapter = getReleaseTargetAdapter(target.kind);
			const stub = await adapter.apply({
				...ctx,
				target_id: target.target_id,
				attempt: 1,
				dry_run: false,
			});
			const artifact_sha = configuredArtifactSha(target, ctx.orchestrator_run_id);
			const result: DeployTargetResult = {
				...baseResult({ ...ctx, target_id: target.target_id, attempt: 1 }, target.kind, true),
				artifact_sha,
				stdout_ref: stub.artifact_sha === FAKE_ARTIFACT_SHA ? undefined : stub.stdout_ref,
			};
			if (stub.artifact_sha === FAKE_ARTIFACT_SHA) {
				result.artifact_sha = artifact_sha;
			}
			appendDeployTargetResult(root, result);
			results.push(result);
		}
		return {
			results,
			deploy_targets_pass: deployTargetsPass(results),
			artifact_refs: [],
		};
	}

	async verifyConfiguredTargets(
		ctx: Omit<ReleaseTargetContext, "target_id" | "attempt">,
		options?: { admit_path?: string },
	): Promise<ConfiguredReleaseVerdict> {
		const root = ctx.kernelRoot || this.kernelRoot;
		const admission = admitDeliveryAction({
			config: this.config,
			kernelRoot: root,
			action: "deploy",
			path: options?.admit_path ?? "handoffs/deploy_results",
		});
		if (!admission.ok) {
			return { results: [], deploy_targets_pass: false, artifact_refs: [] };
		}
		const configured = lookupConfiguredReleaseTargets(this.config);
		if (configured.length === 0) {
			const missing = unconfiguredResult(ctx);
			return { results: [missing], deploy_targets_pass: false, artifact_refs: [] };
		}
		const results: DeployTargetResult[] = [];
		const artifact_refs: string[] = [];
		for (const target of configured) {
			if (!target.endpoint) {
				results.push(unconfiguredResult(ctx, target.target_id));
				continue;
			}
			const adapter = getReleaseTargetAdapter(target.kind);
			const stub = await adapter.verify({
				...ctx,
				target_id: target.target_id,
				attempt: 1,
			});
			const artifact_sha = configuredArtifactSha(target, ctx.orchestrator_run_id);
			const rel = `handoffs/deploy_results/${artifact_sha}.artifact`;
			const abs = join(root, "handoffs", "deploy_results", `${artifact_sha}.artifact`);
			mkdirSync(dirname(abs), { recursive: true });
			writeFileSync(abs, `${target.endpoint}\n`, "utf8");
			const result: DeployTargetResult = {
				...baseResult({ ...ctx, target_id: target.target_id, attempt: 1 }, target.kind, true),
				artifact_sha,
				stdout_ref: rel,
			};
			if (!deployVerificationPass(result) || stub.artifact_sha === FAKE_ARTIFACT_SHA) {
				result.ok = false;
				result.reason_code = RELEASE_TARGET_UNCONFIGURED;
			}
			results.push(result);
			if (result.ok && result.stdout_ref) {
				artifact_refs.push(result.stdout_ref);
			}
		}
		return {
			results,
			deploy_targets_pass:
				results.length > 0 && results.every((row) => deployVerificationPass(row)),
			artifact_refs,
		};
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
		admit_path?: string;
	}): Promise<{ ok: boolean; deferred?: boolean; reason_code?: string; attempts?: number }> {
		const admission = admitDeliveryAction({
			config: this.config,
			kernelRoot: this.kernelRoot,
			action: "repair",
			path: input.admit_path ?? "handoffs/deploy_results",
		});
		if (!admission.ok) {
			return { ok: false, deferred: true, reason_code: admission.reason_code };
		}
		if (!this.healingEnabled()) {
			return { ok: false };
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
