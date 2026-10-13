import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import type { KernelBridge } from "@its-magic/kernel-bridge";
import {
	POLICY_DEFAULT_DENY,
	POLICY_TRAVERSAL_DENIED,
} from "../../packages/policy-engine/src/index.ts";
import {
	createSessionSupervisor,
	type SessionSupervisor,
} from "../../packages/role-runtime/src/index.ts";
import type {
	AgentKernel,
	KernelEvent,
	KernelSession,
} from "../../packages/role-runtime/src/kernel-port.ts";
import {
	applyClosure,
	CLOSURE_RELEASE_EVIDENCE_MISSING,
	type ConfigView,
	createGateEngine,
	createParallelDevCoordinator,
	createReleaseDeployPipeline,
	createWorkflowEngine,
	DEPLOY_DEFERRED,
	DEPLOY_HEALING_DEFERRED,
	type DeliveryBridge,
	deployTargetsPass,
	deployVerificationPass,
	FAKE_ARTIFACT_SHA,
	getReleaseTargetAdapter,
	isWorkflowError,
	listReleaseTargetKinds,
	PARALLEL_DEV_SELECTION_NO_PASS,
	PARALLEL_DEV_WORKTREE_CREATE_FAILED,
	parallelHookFailsClosed,
	RELEASE_GATE_ORDER,
	RELEASE_PREMATURE,
	RELEASE_TARGET_UNCONFIGURED,
	readRunReleaseEvidence,
	releaseCannotMarkDone,
} from "../../packages/runtime-core/src/index.ts";

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
		autonomy: {
			flags: {
				SOVEREIGN_PARALLEL_DEV: "0",
				AUTO_SOVEREIGN_SELF_HEALING_DEPLOY: "0",
			},
		},
		...overrides,
	};
}

function fakeBridge(state: {
	ops?: string[];
	worktrees?: Array<{ instance_id: string; path: string; status: string }>;
	mergeOk?: boolean;
	smokePass?: boolean;
	healingDeferred?: boolean;
	healingCode?: string;
}): DeliveryBridge {
	return {
		async runDeliveryOperation(input) {
			state.ops?.push(input.operation);
			if (input.operation === "parallel_dev_create_worktrees") {
				return {
					ok: true,
					result: { worktrees: state.worktrees ?? [] },
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
					result: { overall: state.smokePass === false ? "fail" : "pass" },
				};
			}
			if (input.operation === "deploy_healing_retry") {
				if (state.healingDeferred) {
					return { ok: false, reason_code: state.healingCode || DEPLOY_DEFERRED };
				}
				return { ok: true, result: { overall: "pass", attempts: 1 } };
			}
			return { ok: true, result: {} };
		},
	};
}

function kernelBridge(bridge: DeliveryBridge) {
	return {
		async runValidator() {
			return { pass: true };
		},
		async runStatusReconcile() {
			return { pass: true };
		},
		runDeliveryOperation: (input: Parameters<DeliveryBridge["runDeliveryOperation"]>[0]) =>
			bridge.runDeliveryOperation(input),
	} as unknown as Pick<KernelBridge, "runValidator" | "runStatusReconcile"> &
		Partial<Pick<KernelBridge, "runSovereignOperation" | "runDeliveryOperation">>;
}

function tempRoot(prefix: string): string {
	return mkdtempSync(join(tmpdir(), prefix));
}

function readJson(root: string, rel: string): Record<string, unknown> {
	return JSON.parse(readFileSync(join(root, rel), "utf8")) as Record<string, unknown>;
}

function auditLines(root: string): Array<Record<string, unknown>> {
	const text = readFileSync(
		join(root, "handoffs", "deploy_results", "deploy_results.jsonl"),
		"utf8",
	);
	return text
		.trim()
		.split("\n")
		.filter((line) => line.length > 0)
		.map((line) => JSON.parse(line) as Record<string, unknown>);
}

test("test_us0153_arbitration_persists_selected_or_rejected", async () => {
	const skipped = parallelHookFailsClosed({ skipped: true, byte_identical: false });
	assert.equal(skipped.ok, false);
	if (!skipped.ok) {
		assert.equal(skipped.reason_code, PARALLEL_DEV_WORKTREE_CREATE_FAILED);
	}
	const coded = parallelHookFailsClosed({
		skipped: false,
		byte_identical: false,
		reason_code: PARALLEL_DEV_SELECTION_NO_PASS,
	});
	assert.equal(coded.ok, false);

	const offRoot = tempRoot("us0153-off-");
	const off = createWorkflowEngine({
		supervisor: supervisor(),
		config: cfg(),
		kernelRoot: offRoot,
	});
	const offLoop = await off.runExecuteQaLoop({
		orchestrator_run_id: "run-off",
		model_id: "inherit",
		kernelRoot: offRoot,
	});
	assert.equal(offLoop.passed, true);
	assert.equal(existsSafe(join(offRoot, "handoffs", "parallel_dev_pick.json")), false);
	rmSync(offRoot, { recursive: true, force: true });

	const winRoot = tempRoot("us0153-win-");
	const winState = {
		ops: [] as string[],
		worktrees: [{ instance_id: "c0", path: ".its-magic/worktrees/run-win/c0", status: "ok" }],
		mergeOk: true,
	};
	const win = createWorkflowEngine({
		supervisor: supervisor(),
		config: cfg({ autonomy: { flags: { SOVEREIGN_PARALLEL_DEV: "1" } } }),
		kernelRoot: winRoot,
		kernelBridge: kernelBridge(fakeBridge(winState)),
	});
	const selected = await win.runExecuteQaLoop({
		orchestrator_run_id: "run-win",
		model_id: "inherit",
		kernelRoot: winRoot,
	});
	assert.equal(selected.passed, true);
	const pick = readJson(winRoot, "handoffs/parallel_dev_pick.json");
	assert.equal(pick.outcome, "winner_selected");
	assert.equal(pick.candidate_id, "c0");
	assert.equal(pick.pick_ref, "handoffs/parallel_dev_pick.json");
	rmSync(winRoot, { recursive: true, force: true });

	const rejectRoot = tempRoot("us0153-rej-");
	const reject = createWorkflowEngine({
		supervisor: supervisor(),
		config: cfg({ autonomy: { flags: { SOVEREIGN_PARALLEL_DEV: "1" } } }),
		kernelRoot: rejectRoot,
		kernelBridge: kernelBridge(fakeBridge({ ops: [], worktrees: [], mergeOk: false })),
	});
	await assert.rejects(
		() =>
			reject.runExecuteQaLoop({
				orchestrator_run_id: "run-rej",
				model_id: "inherit",
				kernelRoot: rejectRoot,
			}),
		(err: unknown) => {
			assert.equal(isWorkflowError(err), true);
			assert.equal((err as { code: string }).code, PARALLEL_DEV_SELECTION_NO_PASS);
			return true;
		},
	);
	const rejected = readJson(rejectRoot, "handoffs/parallel_dev_pick.json");
	assert.equal(rejected.outcome, "reject_all");
	assert.equal(rejected.reason_code, PARALLEL_DEV_SELECTION_NO_PASS);
	rmSync(rejectRoot, { recursive: true, force: true });
});

test("test_us0153_configured_adapter_or_fail_closed", async () => {
	assert.deepEqual(RELEASE_GATE_ORDER, [
		"check_in_tests",
		"independent_qa",
		"uat_evidence",
		"release_artifacts",
		"fail_closed_reason",
	]);
	const root = tempRoot("us0153-adapt-");
	const missing = createReleaseDeployPipeline({ config: cfg(), kernelRoot: root });
	const unconfigured = await missing.applyConfiguredTargets({
		kernelRoot: root,
		sprint_id: "S0173",
		orchestrator_run_id: "run-missing",
	});
	assert.equal(unconfigured.results[0]?.ok, false);
	assert.equal(unconfigured.results[0]?.reason_code, RELEASE_TARGET_UNCONFIGURED);
	assert.equal(unconfigured.deploy_targets_pass, false);
	const gate = createGateEngine().evaluate({
		tests_pass: true,
		qa_evidence: true,
		uat_pass: true,
		artifact_refs: ["handoffs/dev_to_qa.md"],
		deploy_targets_pass: unconfigured.deploy_targets_pass,
	});
	assert.equal(gate.ok, false);
	if (!gate.ok) {
		assert.equal(gate.code, RELEASE_PREMATURE);
	}

	const stub = await getReleaseTargetAdapter("npm").apply({
		kernelRoot: root,
		sprint_id: "S0173",
		orchestrator_run_id: "run-stub",
		target_id: "stub",
		attempt: 1,
	});
	assert.equal(stub.artifact_sha, FAKE_ARTIFACT_SHA);
	assert.equal(deployTargetsPass([stub]), false);
	const dry = await getReleaseTargetAdapter("docker").dryRun({
		kernelRoot: root,
		sprint_id: "S0173",
		orchestrator_run_id: "run-dry",
		target_id: "dry",
		attempt: 1,
		dry_run: true,
	});
	assert.equal(dry.ok, true);
	assert.equal(listReleaseTargetKinds().length, 5);

	const configured = createReleaseDeployPipeline({
		config: cfg({
			release: {
				targets: [{ kind: "npm", target_id: "fixture", endpoint: "fixture://local" }],
			},
		}),
		kernelRoot: root,
	});
	const applied = await configured.applyConfiguredTargets({
		kernelRoot: root,
		sprint_id: "S0173",
		orchestrator_run_id: "run-cfg",
	});
	assert.equal(applied.deploy_targets_pass, true);
	assert.notEqual(applied.results[0]?.artifact_sha, FAKE_ARTIFACT_SHA);
	assert.equal(deployTargetsPass(applied.results), true);
	rmSync(root, { recursive: true, force: true });
});

test("test_us0153_smoke_verify_repair_closure_use_real_evidence", async () => {
	const here = dirname(fileURLToPath(import.meta.url));
	const engineSrc = readFileSync(
		join(here, "../../packages/runtime-core/src/workflow/workflow-engine.ts"),
		"utf8",
	);
	assert.equal(engineSrc.includes("sprints/S0151/summary.md"), false);
	assert.match(engineSrc, /collectReleaseGateInput/);
	assert.match(engineSrc, /readRunReleaseEvidence/);

	const root = tempRoot("us0153-evidence-");
	mkdirSync(join(root, "sprints", "S0173"), { recursive: true });
	writeFileSync(join(root, "sprints", "S0173", "summary.md"), "current run\n", "utf8");
	mkdirSync(join(root, "handoffs", "run-evidence"), { recursive: true });
	writeFileSync(
		join(root, "handoffs", "run-evidence", "run-evidence.json"),
		`${JSON.stringify({
			tests_pass: true,
			qa_pass: true,
			uat_pass: true,
			premature: false,
			artifact_refs: ["sprints/S0173/summary.md"],
		})}\n`,
		"utf8",
	);
	const evidence = readRunReleaseEvidence(root, "run-evidence");
	assert.equal(evidence.tests_pass, true);
	assert.equal(evidence.uat_pass, true);
	assert.deepEqual(evidence.artifact_refs, ["sprints/S0173/summary.md"]);
	assert.equal(evidence.premature, false);
	assert.equal(readRunReleaseEvidence(root, "missing-run").premature, true);

	const ops: string[] = [];
	const pipeline = createReleaseDeployPipeline({
		config: cfg({
			autonomy: { flags: { AUTO_SOVEREIGN_SELF_HEALING_DEPLOY: "1" } },
			release: {
				targets: [{ kind: "npm", target_id: "fixture", endpoint: "fixture://local" }],
			},
		}),
		kernelRoot: root,
		bridge: fakeBridge({ ops, smokePass: false, healingDeferred: false }),
	});
	const verified = await pipeline.verifyConfiguredTargets({
		kernelRoot: root,
		sprint_id: "S0173",
		orchestrator_run_id: "run-evidence",
	});
	assert.equal(verified.deploy_targets_pass, true);
	assert.equal(verified.artifact_refs.length > 0, true);
	const cited = verified.artifact_refs[0] ?? "";
	assert.equal(cited.includes("S0151"), false);
	assert.equal(readFileSync(join(root, cited), "utf8").includes("fixture://local"), true);
	const verifiedRow = verified.results[0];
	assert.ok(verifiedRow);
	assert.equal(deployVerificationPass(verifiedRow), true);
	const stubVerify = await getReleaseTargetAdapter("npm").verify({
		kernelRoot: root,
		sprint_id: "S0173",
		orchestrator_run_id: "run-stub-verify",
		target_id: "stub",
		attempt: 1,
	});
	assert.equal(deployVerificationPass(stubVerify), false);

	const repaired = await pipeline.runPostDeployHealing({
		orchestrator_run_id: "run-repair",
		story_id: "US-0153",
	});
	assert.equal(repaired.ok, true);
	assert.ok(ops.includes("deploy_smoke_probe"));
	assert.ok(ops.includes("deploy_healing_retry"));

	const disabledOps: string[] = [];
	const disabled = createReleaseDeployPipeline({
		config: cfg(),
		kernelRoot: root,
		bridge: fakeBridge({ ops: disabledOps, smokePass: true }),
	});
	const disabledHealing = await disabled.runPostDeployHealing({
		orchestrator_run_id: "run-off",
		story_id: "US-0153",
	});
	assert.equal(disabledHealing.ok, false);
	assert.equal(disabledOps.includes("deploy_smoke_probe"), false);

	const exhausted = createReleaseDeployPipeline({
		config: cfg({ autonomy: { flags: { AUTO_SOVEREIGN_SELF_HEALING_DEPLOY: "1" } } }),
		kernelRoot: root,
		bridge: fakeBridge({ ops: [], smokePass: false, healingDeferred: true }),
	});
	const deferred = await exhausted.runPostDeployHealing({
		orchestrator_run_id: "run-defer",
		story_id: "US-0153",
	});
	assert.equal(deferred.ok, false);
	assert.equal(deferred.reason_code, DEPLOY_DEFERRED);

	const healingDeferred = createReleaseDeployPipeline({
		config: cfg({ autonomy: { flags: { AUTO_SOVEREIGN_SELF_HEALING_DEPLOY: "1" } } }),
		kernelRoot: root,
		bridge: fakeBridge({
			ops: [],
			smokePass: false,
			healingDeferred: true,
			healingCode: DEPLOY_HEALING_DEFERRED,
		}),
	});
	const healingCode = await healingDeferred.runPostDeployHealing({
		orchestrator_run_id: "run-heal-defer",
		story_id: "US-0153",
	});
	assert.equal(healingCode.reason_code, DEPLOY_HEALING_DEFERRED);

	const premature = createGateEngine().evaluate({
		tests_pass: true,
		qa_evidence: true,
		uat_pass: true,
		artifact_refs: ["sprints/S0173/summary.md"],
		premature: true,
	});
	assert.equal(premature.ok, false);
	if (!premature.ok) {
		assert.equal(premature.code, RELEASE_PREMATURE);
	}
	await assert.rejects(
		() => applyClosure(null),
		(err: unknown) => {
			assert.equal(isWorkflowError(err), true);
			assert.equal((err as { code: string }).code, CLOSURE_RELEASE_EVIDENCE_MISSING);
			return true;
		},
	);
	assert.equal(releaseCannotMarkDone().marked_done, false);
	rmSync(root, { recursive: true, force: true });
});

test("test_us0153_limits_audited_before_worktree_deploy_repair", async () => {
	const root = tempRoot("us0153-limit-");
	const guardSrc = readFileSync(
		join(
			dirname(fileURLToPath(import.meta.url)),
			"../../packages/runtime-core/src/workflow/delivery/resource-guard.ts",
		),
		"utf8",
	);
	assert.equal(guardSrc.includes("max_distributed_workers"), false);
	const ops: string[] = [];
	const coord = createParallelDevCoordinator({
		config: cfg({ autonomy: { flags: { SOVEREIGN_PARALLEL_DEV: "1" } } }),
		supervisor: supervisor(),
		bridge: fakeBridge({ ops, worktrees: [] }),
		kernelRoot: root,
	});
	await assert.rejects(
		() =>
			coord.afterExecutePass({
				orchestrator_run_id: "run-limit",
				story_id: "US-0153",
				model_id: "inherit",
				producer_session_id: "prod",
				kernel_root: root,
				admit_path: "../outside",
			}),
		(err: unknown) => {
			assert.equal(isWorkflowError(err), true);
			assert.equal((err as { code: string }).code, POLICY_TRAVERSAL_DENIED);
			return true;
		},
	);
	assert.equal(ops.includes("parallel_dev_create_worktrees"), false);

	const pipeline = createReleaseDeployPipeline({
		config: cfg({
			autonomy: { flags: { AUTO_SOVEREIGN_SELF_HEALING_DEPLOY: "1" } },
			release: {
				targets: [{ kind: "npm", target_id: "fixture", endpoint: "fixture://local" }],
			},
		}),
		kernelRoot: root,
		bridge: fakeBridge({ ops }),
	});
	const deniedDeploy = await pipeline.applyConfiguredTargets(
		{
			kernelRoot: root,
			sprint_id: "S0173",
			orchestrator_run_id: "run-limit",
		},
		{ admit_path: "" },
	);
	assert.equal(deniedDeploy.deploy_targets_pass, false);
	assert.equal(deniedDeploy.results[0]?.reason_code, POLICY_DEFAULT_DENY);
	const deniedRepair = await pipeline.runPostDeployHealing({
		orchestrator_run_id: "run-limit",
		story_id: "US-0153",
		admit_path: "../outside-repair",
	});
	assert.equal(deniedRepair.ok, false);
	assert.equal(deniedRepair.reason_code, POLICY_TRAVERSAL_DENIED);
	assert.equal(ops.includes("deploy_smoke_probe"), false);

	const lines = auditLines(root);
	const actions = lines
		.filter((line) => line.audit === "delivery_limit")
		.map((line) => line.action);
	assert.ok(actions.includes("worktree_create"));
	assert.ok(actions.includes("deploy"));
	assert.ok(actions.includes("repair"));
	assert.equal(lines.filter((line) => line.audit === "delivery_limit").length >= 3, true);
	rmSync(root, { recursive: true, force: true });
});

test("test_us0153_fixture_success_and_failure_matrix", async () => {
	const us0145 = readFileSync(
		join(dirname(fileURLToPath(import.meta.url)), "us0145.contract.test.ts"),
		"utf8",
	);
	const kept = [
		"test_us0145_parallel_default_off_byte_identical",
		"test_us0145_worktree_isolation_no_main_mutation",
		"test_us0145_resource_guard_fail_closed",
		"test_us0145_qa_arbiter_fresh_session_winner_merge",
		"test_us0145_qa_arbiter_reject_all_evidence",
		"test_us0145_release_target_matrix_dry_run",
		"test_us0145_release_gates_compose_order_unchanged",
		"test_us0145_deploy_target_failure_no_release_pass",
		"test_us0145_smoke_repair_success_bounded",
		"test_us0145_smoke_repair_exhausted_deferred",
		"test_us0145_release_cannot_mark_done",
		"test_us0145_closure_requires_valid_release_envelope",
		"test_us0145_kernel_bridge_delivery_admission",
	];
	for (const name of kept) {
		assert.equal(us0145.includes(`test("${name}"`), true, name);
	}

	const root = tempRoot("us0153-matrix-");
	mkdirSync(join(root, "sprints", "S0173"), { recursive: true });
	const artifact = "sprints/S0173/summary.md";
	writeFileSync(join(root, artifact), "fixture\n", "utf8");
	mkdirSync(join(root, "handoffs", "run-evidence"), { recursive: true });
	writeFileSync(
		join(root, "handoffs", "run-evidence", "run-matrix.json"),
		`${JSON.stringify({
			tests_pass: true,
			qa_pass: true,
			uat_pass: true,
			premature: false,
			artifact_refs: [artifact],
		})}\n`,
		"utf8",
	);
	const ops: string[] = [];
	const engine = createWorkflowEngine({
		supervisor: supervisor(),
		config: cfg({
			autonomy: { flags: { AUTO_SOVEREIGN_SELF_HEALING_DEPLOY: "1" } },
			release: {
				targets: [{ kind: "npm", target_id: "fixture", endpoint: "fixture://local" }],
			},
		}),
		kernelRoot: root,
		kernelBridge: kernelBridge(fakeBridge({ ops, smokePass: true })),
	});
	const success = await engine.collectReleaseGateInput(
		{ orchestrator_run_id: "run-matrix", kernelRoot: root },
		true,
	);
	assert.equal(success.tests_pass, true);
	assert.equal(success.qa_evidence, true);
	assert.equal(success.uat_pass, true);
	assert.equal(success.deploy_targets_pass, true);
	assert.equal(success.premature, false);
	assert.ok(success.artifact_refs.includes(artifact));
	const passed = createGateEngine().evaluate(success);
	assert.equal(passed.ok, true);

	const unavailable = await createReleaseDeployPipeline({
		config: cfg(),
		kernelRoot: root,
	}).applyConfiguredTargets({
		kernelRoot: root,
		sprint_id: "S0173",
		orchestrator_run_id: "run-unavail",
	});
	assert.equal(unavailable.results[0]?.reason_code, RELEASE_TARGET_UNCONFIGURED);
	assert.equal(unavailable.deploy_targets_pass, false);

	const rejected = createParallelDevCoordinator({
		config: cfg({ autonomy: { flags: { SOVEREIGN_PARALLEL_DEV: "1" } } }),
		supervisor: supervisor(),
	});
	const reject = await rejected.runQaArbiter({
		orchestrator_run_id: "run-matrix-rej",
		story_id: "US-0153",
		model_id: "inherit",
		producer_session_id: "prod",
		candidates: [],
	});
	assert.equal(reject.outcome, "reject_all");
	assert.equal(reject.reason_code, PARALLEL_DEV_SELECTION_NO_PASS);

	const stubVerify = await getReleaseTargetAdapter("ssh_command").verify({
		kernelRoot: root,
		sprint_id: "S0173",
		orchestrator_run_id: "run-matrix",
		target_id: "missing-evidence",
		attempt: 1,
	});
	assert.equal(deployVerificationPass(stubVerify), false);

	const exhausted = await createReleaseDeployPipeline({
		config: cfg({ autonomy: { flags: { AUTO_SOVEREIGN_SELF_HEALING_DEPLOY: "1" } } }),
		kernelRoot: root,
		bridge: fakeBridge({ smokePass: false, healingDeferred: true }),
	}).runPostDeployHealing({
		orchestrator_run_id: "run-matrix-defer",
		story_id: "US-0153",
	});
	assert.equal(exhausted.ok, false);
	assert.equal(exhausted.reason_code, DEPLOY_DEFERRED);

	const early = readRunReleaseEvidence(root, "no-such-run");
	assert.equal(early.premature, true);
	const prematureGate = createGateEngine().evaluate({
		tests_pass: true,
		qa_evidence: true,
		uat_pass: true,
		artifact_refs: [artifact],
		premature: true,
	});
	assert.equal(prematureGate.ok, false);
	if (!prematureGate.ok) {
		assert.equal(prematureGate.code, RELEASE_PREMATURE);
	}
	await assert.rejects(
		() =>
			applyClosure({
				release_run_id: "",
				tests_pass: false,
				qa_pass: false,
				uat_pass: false,
				artifact_refs: [],
			}),
		(err: unknown) => {
			assert.equal((err as { code: string }).code, CLOSURE_RELEASE_EVIDENCE_MISSING);
			return true;
		},
	);
	rmSync(root, { recursive: true, force: true });
});

function existsSafe(abs: string): boolean {
	try {
		readFileSync(abs);
		return true;
	} catch {
		return false;
	}
}
