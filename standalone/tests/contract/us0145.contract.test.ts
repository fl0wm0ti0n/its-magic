import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
	createPolicyEngine,
	isParallelDevWorktreePath,
} from "../../packages/policy-engine/src/index.ts";
import {
	DELIVERY_OPERATIONS,
	createKernelBridge,
	type DeliveryOperationName,
} from "../../packages/kernel-bridge/src/index.ts";
import { createSessionSupervisor, type SessionSupervisor } from "../../packages/role-runtime/src/index.ts";
import type { AgentKernel, KernelEvent, KernelSession } from "../../packages/role-runtime/src/kernel-port.ts";
import {
	applyClosure,
	assertReleaseCannotMarkDone,
	CLOSURE_RELEASE_EVIDENCE_MISSING,
	createDeliveryResourceGuard,
	createGateEngine,
	createParallelDevCoordinator,
	createReleaseDeployPipeline,
	createWorkflowEngine,
	DEPLOY_DEFERRED,
	getReleaseTargetAdapter,
	isWorkflowError,
	listReleaseTargetKinds,
	lookupParallelDev,
	PARALLEL_DEV_RESOURCE_CAP_EXHAUSTED,
	PARALLEL_DEV_SELECTION_NO_PASS,
	releaseCannotMarkDone,
	RELEASE_GATE_ORDER,
	RELEASE_PREMATURE,
	type ConfigView,
	type DeliveryBridge,
} from "../../packages/runtime-core/src/index.ts";

const HERE = dirname(fileURLToPath(import.meta.url));
const KIT_ROOT = join(HERE, "..", "..", "..");

class FakeSession implements KernelSession {
	readonly sessionId: string;
	constructor(sessionId: string) {
		this.sessionId = sessionId;
	}
	async run(): Promise<void> {}
	async steer(): Promise<void> {}
	async abort(): Promise<void> {}
	dispose(): void {}
	getRuntimeInfo() {
		return {
			sessionId: this.sessionId,
			piCodingAgentVersion: "0.85.1",
			piAiVersion: "0.85.1",
			isolationMode: "off" as const,
			builtinTools: "disabled" as const,
		};
	}
	subscribe(_handler: (e: KernelEvent) => void): () => void {
		return () => undefined;
	}
}

function supervisor(): SessionSupervisor {
	const kernel: AgentKernel = {
		async createSession() {
			return new FakeSession(`sess-${crypto.randomUUID()}`);
		},
	};
	return createSessionSupervisor({ kernel });
}

function cfg(overrides: Partial<ConfigView> = {}): ConfigView {
	return {
		delivery: { DELIVERY_MODE: "ultra_lean" },
		autonomy: { flags: { SOVEREIGN_PARALLEL_DEV: "0", AUTO_SOVEREIGN_SELF_HEALING_DEPLOY: "0" } },
		...overrides,
	};
}

function fakeBridge(state: {
	mainTouched?: boolean;
	ops?: string[];
	mergeOk?: boolean;
	smokePass?: boolean;
	healingDeferred?: boolean;
}): DeliveryBridge {
	return {
		async runDeliveryOperation(input) {
			state.ops?.push(input.operation);
			if (input.operation === "parallel_dev_create_worktrees") {
				return {
					ok: true,
					result: {
						worktrees: [
							{
								instance_id: "c0",
								path: ".its-magic/worktrees/run-a/c0",
								branch: "us0108-story-0",
								status: "ok",
							},
						],
					},
				};
			}
			if (input.operation === "parallel_dev_merge_winner") {
				if (state.mergeOk === false) {
					return { ok: false, reason_code: PARALLEL_DEV_SELECTION_NO_PASS };
				}
				return { ok: true, result: { success: true, commit_hash: "abc" } };
			}
			if (input.operation === "deploy_smoke_probe") {
				return {
					ok: true,
					result: { overall: state.smokePass === false ? "fail" : "pass", reason_code: "DEPLOY_SMOKE_PROBE_OK" },
				};
			}
			if (input.operation === "deploy_healing_retry") {
				if (state.healingDeferred) {
					return { ok: false, reason_code: DEPLOY_DEFERRED };
				}
				return { ok: true, result: { overall: "pass", attempts: 2, reason_code: "DEPLOY_SMOKE_PROBE_OK" } };
			}
			return { ok: true, result: {} };
		},
	};
}

test("test_us0145_parallel_default_off_byte_identical", () => {
	const off = createParallelDevCoordinator({
		config: cfg(),
		supervisor: supervisor(),
	});
	assert.equal(lookupParallelDev(cfg()), false);
	assert.equal(off.enabled(), false);
	assert.deepEqual(off.noopSnapshot(), { skipped: true, byte_identical: true });
	const onCfg = cfg({ autonomy: { flags: { SOVEREIGN_PARALLEL_DEV: "1" } } });
	assert.equal(lookupParallelDev(onCfg), true);
	const on = createParallelDevCoordinator({
		config: onCfg,
		supervisor: supervisor(),
		bridge: fakeBridge({}),
	});
	assert.equal(on.enabled(), true);
	assert.deepEqual(off.noopSnapshot(), on.noopSnapshot());
});

test("test_us0145_worktree_isolation_no_main_mutation", async () => {
	const root = mkdtempSync(join(tmpdir(), "us0145-wt-"));
	const mainMarker = join(root, "MAIN_TREE_MARKER");
	writeFileSync(mainMarker, "before", "utf8");
	const bridgeState = { mainTouched: false, ops: [] as string[] };
	const coord = createParallelDevCoordinator({
		config: cfg({ autonomy: { flags: { SOVEREIGN_PARALLEL_DEV: "1" } } }),
		supervisor: supervisor(),
		bridge: fakeBridge(bridgeState),
		kernelRoot: root,
	});
	await coord.afterExecutePass({
		orchestrator_run_id: "run-a",
		story_id: "US-0145",
		model_id: "inherit",
		producer_session_id: "prod-1",
		kernel_root: root,
	});
	assert.equal(readFileSync(mainMarker, "utf8"), "before");
	assert.ok(bridgeState.ops?.includes("parallel_dev_create_worktrees"));
	const policy = createPolicyEngine();
	const wtPath = join(root, ".its-magic", "worktrees", "run-a", "c0", "patch.ts");
	assert.equal(isParallelDevWorktreePath(wtPath, root), true);
	const allow = policy.evaluate({
		role_id: "dev",
		phase_id: "execute",
		tool: "itsm_write",
		action: "write",
		paths: [wtPath],
		worktree_root: root,
		cwd: root,
		autonomy: "supervised",
		permission_mode: "default-deny",
		security_class: "standard",
		isolation_profile: "trusted-local",
		approvals: [],
	});
	assert.equal(allow.decision, "ALLOW");
	rmSync(root, { recursive: true, force: true });
});

test("test_us0145_resource_guard_fail_closed", () => {
	const guard = createDeliveryResourceGuard(
		cfg({ autonomy: { flags: { AUTO_SOVEREIGN_PARALLEL_MAX_TOTAL: "1" } } }),
	);
	const verdict = guard.check({
		active_worktrees: 5,
		concurrent_tests: 0,
		wall_clock_ms: 0,
		token_spend: 0,
	});
	assert.equal(verdict.ok, false);
	if (!verdict.ok) {
		assert.equal(verdict.reason_code, PARALLEL_DEV_RESOURCE_CAP_EXHAUSTED);
	}
});

test("test_us0145_qa_arbiter_fresh_session_winner_merge", async () => {
	const bridge = fakeBridge({ mergeOk: true });
	const coord = createParallelDevCoordinator({
		config: cfg({ autonomy: { flags: { SOVEREIGN_PARALLEL_DEV: "1" } } }),
		supervisor: supervisor(),
		bridge,
	});
	const result = await coord.runQaArbiter({
		orchestrator_run_id: "run-qa",
		story_id: "US-0145",
		model_id: "inherit",
		producer_session_id: "prod-qa",
		candidates: [
			{
				candidate_id: "c0",
				worktree_path: ".its-magic/worktrees/run-qa/c0",
				test_report_refs: ["handoffs/dev_to_qa.md"],
				diff_stat_ref: "diff",
				token_cost_ref: "cost",
				model_ids: ["inherit"],
			},
		],
	});
	assert.equal(result.outcome, "winner_selected");
	assert.ok(result.arbiter_session_id);
	assert.notEqual(result.arbiter_session_id, "prod-qa");
	assert.equal(result.pick_ref, "handoffs/parallel_dev_pick.json");
});

test("test_us0145_qa_arbiter_reject_all_evidence", async () => {
	const coord = createParallelDevCoordinator({
		config: cfg({ autonomy: { flags: { SOVEREIGN_PARALLEL_DEV: "1" } } }),
		supervisor: supervisor(),
		bridge: fakeBridge({ mergeOk: false }),
	});
	const empty = await coord.runQaArbiter({
		orchestrator_run_id: "run-reject",
		story_id: "US-0145",
		model_id: "inherit",
		producer_session_id: "prod-r",
		candidates: [],
	});
	assert.equal(empty.outcome, "reject_all");
	assert.equal(empty.reason_code, PARALLEL_DEV_SELECTION_NO_PASS);
});

test("test_us0145_release_target_matrix_dry_run", async () => {
	const root = mkdtempSync(join(tmpdir(), "us0145-deploy-"));
	mkdirSync(join(root, "handoffs", "deploy_results"), { recursive: true });
	const pipeline = createReleaseDeployPipeline({ config: cfg(), kernelRoot: root });
	const kinds = listReleaseTargetKinds();
	assert.equal(kinds.length, 5);
	for (const kind of kinds) {
		assert.equal(getReleaseTargetAdapter(kind).kind, kind);
	}
	const results = await pipeline.dryRunTargets(
		kinds.map((kind, i) => ({ kind, target_id: `t-${i}` })),
		{
			kernelRoot: root,
			sprint_id: "S0155",
			orchestrator_run_id: "run-deploy",
		},
	);
	assert.equal(results.length, 5);
	assert.ok(results.every((r) => r.ok));
	const ledger = readFileSync(join(root, "handoffs", "deploy_results", "deploy_results.jsonl"), "utf8");
	assert.ok(ledger.trim().split("\n").length >= 5);
	rmSync(root, { recursive: true, force: true });
});

test("test_us0145_release_gates_compose_order_unchanged", () => {
	assert.deepEqual(RELEASE_GATE_ORDER, [
		"check_in_tests",
		"independent_qa",
		"uat_evidence",
		"release_artifacts",
		"fail_closed_reason",
	]);
	const engine = createGateEngine();
	const pass = engine.evaluate({
		tests_pass: true,
		qa_evidence: true,
		uat_pass: true,
		artifact_refs: ["x"],
		deploy_targets_pass: true,
		approval_granted: true,
		target_policy_ok: true,
	});
	assert.equal(pass.ok, true);
	const fail = engine.evaluate({
		tests_pass: true,
		qa_evidence: true,
		uat_pass: true,
		artifact_refs: ["x"],
		deploy_targets_pass: false,
	});
	assert.equal(fail.ok, false);
	if (!fail.ok) {
		assert.equal(fail.code, RELEASE_PREMATURE);
		assert.equal(fail.step, "fail_closed_reason");
	}
});

test("test_us0145_deploy_target_failure_no_release_pass", () => {
	const engine = createWorkflowEngine({
		supervisor: supervisor(),
		config: cfg(),
	});
	assert.throws(
		() =>
			engine.writeRelease(
				{
					release_run_id: "rel-fail",
					tests_pass: true,
					qa_pass: true,
					uat_pass: true,
					artifact_refs: ["sprints/S0155/summary.md"],
				},
				{
					tests_pass: true,
					qa_evidence: true,
					uat_pass: true,
					artifact_refs: ["sprints/S0155/summary.md"],
					deploy_targets_pass: false,
				},
			),
		(err: unknown) => {
			assert.equal(isWorkflowError(err), true);
			return true;
		},
	);
});

test("test_us0145_smoke_repair_success_bounded", async () => {
	const root = mkdtempSync(join(tmpdir(), "us0145-heal-"));
	const pipeline = createReleaseDeployPipeline({
		config: cfg({ autonomy: { flags: { AUTO_SOVEREIGN_SELF_HEALING_DEPLOY: "1" } } }),
		kernelRoot: root,
		bridge: fakeBridge({ smokePass: true, healingDeferred: false }),
	});
	const healed = await pipeline.runPostDeployHealing({
		orchestrator_run_id: "run-heal",
		story_id: "US-0145",
	});
	assert.equal(healed.ok, true);
	rmSync(root, { recursive: true, force: true });
});

test("test_us0145_smoke_repair_exhausted_deferred", async () => {
	const root = mkdtempSync(join(tmpdir(), "us0145-defer-"));
	const pipeline = createReleaseDeployPipeline({
		config: cfg({ autonomy: { flags: { AUTO_SOVEREIGN_SELF_HEALING_DEPLOY: "1" } } }),
		kernelRoot: root,
		bridge: fakeBridge({ smokePass: false, healingDeferred: true }),
	});
	const deferred = await pipeline.runPostDeployHealing({
		orchestrator_run_id: "run-defer",
		story_id: "US-0145",
	});
	assert.equal(deferred.ok, false);
	assert.equal(deferred.deferred, true);
	assert.equal(deferred.reason_code, DEPLOY_DEFERRED);
	rmSync(root, { recursive: true, force: true });
});

test("test_us0145_release_cannot_mark_done", () => {
	assertReleaseCannotMarkDone();
	const engine = createWorkflowEngine({ supervisor: supervisor(), config: cfg() });
	const written = engine.writeRelease(
		{
			release_run_id: "rel-us0145",
			tests_pass: true,
			qa_pass: true,
			uat_pass: true,
			artifact_refs: ["sprints/S0155/summary.md"],
		},
		{
			tests_pass: true,
			qa_evidence: true,
			uat_pass: true,
			artifact_refs: ["sprints/S0155/summary.md"],
			deploy_targets_pass: true,
		},
	);
	assert.equal(written.marked_done, false);
	assert.equal(releaseCannotMarkDone().marked_done, false);
});

test("test_us0145_closure_requires_valid_release_envelope", async () => {
	await assert.rejects(
		() => applyClosure(null),
		(err: unknown) => {
			assert.equal(isWorkflowError(err), true);
			assert.equal((err as { code: string }).code, CLOSURE_RELEASE_EVIDENCE_MISSING);
			return true;
		},
	);
});

test("test_us0145_kernel_bridge_delivery_admission", async () => {
	const bridge = await createKernelBridge({ kernelRoot: KIT_ROOT });
	const manifest = await bridge.readContractManifest(KIT_ROOT);
	for (const op of DELIVERY_OPERATIONS) {
		assert.ok(manifest.delivery_operations?.includes(op), op);
	}
	const admitted = DELIVERY_OPERATIONS as readonly DeliveryOperationName[];
	assert.equal(admitted.length, 7);
});
