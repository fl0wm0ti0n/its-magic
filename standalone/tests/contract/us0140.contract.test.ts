import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import type { KernelBridge } from "../../packages/kernel-bridge/src/index.ts";
import {
	ALLOWED_VALIDATOR_NAMES,
	KernelBridgeError,
} from "../../packages/kernel-bridge/src/index.ts";
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
	BLOCK_RETRY_CAP_EXHAUSTED,
	CANONICAL_PHASES,
	CLOSURE_RELEASE_EVIDENCE_MISSING,
	COMMAND_ROUTER_STEPS,
	type ConfigView,
	crashResume,
	createCommandRouter,
	createGateEngine,
	createRunsStore,
	createWorkflowEngine,
	DEFERRED_COMMANDS,
	FIX_FAILED,
	HOST_SCHEDULING_ONLY,
	IN_PROCESS_PRODUCER_FORBIDDEN,
	isRouteOk,
	isWorkflowError,
	KERNEL_VALIDATOR_MISSING,
	PHASE_GRAPH_EDGES,
	PROGRAMMATIC_COMMANDS,
	preconditionsFor,
	RECOVERY_FALSE_COMPLETION,
	RELEASE_ARTIFACTS_MISSING,
	RELEASE_GATE_ORDER,
	RELEASE_PREMATURE,
	RELEASE_QA_MISSING,
	RELEASE_TESTS_FAILED,
	RELEASE_UAT_FAILED,
	RESUME_BRIEF_STALE,
	RUNTIME_GITIGNORE_GLOB,
	releaseCannotMarkDone,
	SCHEDULER_COMMANDS,
	shouldSkipPlanVerify,
	WORKFLOW_LOOP_CAP,
	WORKFLOW_ROUTE_DEFERRED,
	WorkflowError,
} from "../../packages/runtime-core/src/index.ts";

const HERE = dirname(fileURLToPath(import.meta.url));
const STANDALONE_ROOT = join(HERE, "..", "..");
const KIT_ROOT = join(STANDALONE_ROOT, "..");
const CORE_ROOT = join(STANDALONE_ROOT, "packages", "runtime-core");

const FORBIDDEN_IMPORTS = [
	"@earendil-works/pi-",
	"@cortexkit/aft-pi",
	"@cortexkit/aft-opencode",
	"@cortexkit/aft-bridge",
	"@temporalio/",
	"@langchain/",
	"langgraph",
];

function walkFiles(root: string): string[] {
	const out: string[] = [];
	const stack = [root];
	while (stack.length > 0) {
		const dir = stack.pop() as string;
		for (const name of readdirSync(dir, { withFileTypes: true })) {
			if (name.name === "node_modules") {
				continue;
			}
			const path = join(dir, name.name);
			if (name.isDirectory()) {
				stack.push(path);
			} else if (/\.(ts|js|mjs|cjs|json)$/.test(name.name)) {
				out.push(path);
			}
		}
	}
	return out;
}

function assertNoPi(root: string): void {
	const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8")) as {
		dependencies?: Record<string, string>;
		devDependencies?: Record<string, string>;
	};
	const deps = { ...(pkg.dependencies ?? {}), ...(pkg.devDependencies ?? {}) };
	for (const key of Object.keys(deps)) {
		assert.equal(key.startsWith("@earendil-works/pi-"), false, key);
		assert.equal(key.startsWith("@cortexkit/aft-"), false, key);
		assert.equal(key.startsWith("@temporalio/"), false, key);
		assert.equal(key.includes("langgraph"), false, key);
		assert.equal(key.includes("better-sqlite3"), false, key);
	}
	const hits: string[] = [];
	for (const path of walkFiles(root)) {
		const text = readFileSync(path, "utf8");
		for (const needle of FORBIDDEN_IMPORTS) {
			if (text.includes(needle)) {
				hits.push(`${path}:${needle}`);
			}
		}
	}
	assert.deepEqual(hits, []);
}

class FakeSession implements KernelSession {
	readonly sessionId: string;
	disposed = false;
	aborted = false;
	private readonly listeners = new Set<(e: KernelEvent) => void>();

	constructor(sessionId: string) {
		this.sessionId = sessionId;
	}

	async run(): Promise<void> {}
	async steer(): Promise<void> {}
	async abort(): Promise<void> {
		this.aborted = true;
	}
	dispose(): void {
		this.disposed = true;
		this.listeners.clear();
	}
	getRuntimeInfo() {
		return {
			sessionId: this.sessionId,
			piCodingAgentVersion: "0.85.1",
			piAiVersion: "0.85.1",
			isolationMode: "off" as const,
			builtinTools: "disabled" as const,
		};
	}
	subscribe(handler: (e: KernelEvent) => void): () => void {
		this.listeners.add(handler);
		return () => this.listeners.delete(handler);
	}
}

function fakeKernel(): { kernel: AgentKernel; sessions: FakeSession[] } {
	const sessions: FakeSession[] = [];
	const kernel: AgentKernel = {
		async createSession() {
			const session = new FakeSession(`sess-${crypto.randomUUID()}`);
			sessions.push(session);
			return session;
		},
	};
	return { kernel, sessions };
}

function supervisor(): { sv: SessionSupervisor; sessions: FakeSession[] } {
	const { kernel, sessions } = fakeKernel();
	return { sv: createSessionSupervisor({ kernel }), sessions };
}

function cfg(over: ConfigView = {}): ConfigView {
	return {
		delivery: { DELIVERY_MODE: over.delivery?.DELIVERY_MODE ?? "standard" },
		autonomy: { flags: { ...(over.autonomy?.flags ?? {}) } },
		shared: { ...(over.shared ?? {}) },
		compat: { ...(over.compat ?? {}) },
		retryTest: { AUTO_LOOP_MAX_CYCLES: over.retryTest?.AUTO_LOOP_MAX_CYCLES ?? 32 },
		sovereign: { CROSS_MODEL_REVIEW: over.sovereign?.CROSS_MODEL_REVIEW ?? "0" },
		phase: { ...(over.phase ?? {}) },
	};
}

function passBridge(): Pick<KernelBridge, "runValidator" | "runStatusReconcile"> {
	return {
		async runValidator(name) {
			return {
				name,
				pass: true,
				exitCode: 0,
				reasonCode: null,
				stdout: "",
				stderr: "",
				evidence: null,
			};
		},
		async runStatusReconcile() {
			return {
				name: "status-reconcile",
				pass: true,
				exitCode: 0,
				reasonCode: null,
				stdout: "",
				stderr: "",
				evidence: null,
			};
		},
	};
}

function routeInput() {
	return { orchestrator_run_id: "auto-20260913-us0140", model_id: "openai/itsm-fake-ping" };
}

test("test_us0140_command_coverage", async () => {
	assertNoPi(CORE_ROOT);
	const pkg = JSON.parse(readFileSync(join(CORE_ROOT, "package.json"), "utf8")) as {
		name: string;
		private: boolean;
		version: string;
		type: string;
		engines: { node: string };
		exports: Record<string, string>;
	};
	assert.equal(pkg.name, "@its-magic/runtime-core");
	assert.equal(pkg.private, true);
	assert.equal(pkg.version, "0.0.0");
	assert.equal(pkg.type, "module");
	assert.equal(pkg.engines.node, ">=22.19.0");
	assert.equal(pkg.exports["."], "./src/index.ts");
	assert.equal(existsSync(join(CORE_ROOT, "src", "workflow")), true);
	assert.equal(existsSync(join(CORE_ROOT, "src", "workflow", "gates")), true);
	assert.equal(existsSync(join(CORE_ROOT, "src", "runs")), true);
	assert.equal(existsSync(join(CORE_ROOT, "src", "recovery")), true);
	assert.equal(existsSync(join(CORE_ROOT, "src", "stop-matrix")), true);
	assert.equal(existsSync(join(STANDALONE_ROOT, "packages", "workflow")), false);
	assert.equal(existsSync(join(STANDALONE_ROOT, "packages", "release-runtime")), false);
	const biome = readFileSync(join(STANDALONE_ROOT, "biome.json"), "utf8");
	assert.equal(biome.includes("packages/runtime-core"), false);
	const kitFiles = JSON.parse(readFileSync(join(KIT_ROOT, "package.json"), "utf8")) as {
		files?: string[];
	};
	assert.equal(
		(kitFiles.files ?? []).some((f) => f.includes("standalone")),
		false,
	);
	const { sv } = supervisor();
	const router = createCommandRouter({ supervisor: sv, config: cfg() });
	assert.deepEqual(PROGRAMMATIC_COMMANDS, [
		"intake",
		"discovery",
		"research",
		"architecture",
		"sprint-plan",
		"plan-verify",
		"execute",
		"qa",
		"verify-work",
		"release",
		"closure",
		"refresh-context",
		"ask",
		"memory-audit",
		"map-codebase",
		"security-review",
	]);
	assert.deepEqual(DEFERRED_COMMANDS, []);
	assert.deepEqual([...SCHEDULER_COMMANDS], ["/auto", "/quick"]);
	assert.equal(WORKFLOW_ROUTE_DEFERRED, "WORKFLOW_ROUTE_DEFERRED");
	const listed = router.listCommands();
	for (const name of PROGRAMMATIC_COMMANDS) {
		assert.equal(listed.includes(name), true, name);
		const result = await router.route(name, routeInput());
		assert.equal(result.ok, true, name);
	}
	for (const name of SCHEDULER_COMMANDS) {
		assert.equal(listed.includes(name), true, name);
		const scheduled = await router.route(name, routeInput());
		assert.equal(scheduled.ok, true, name);
		assert.equal("implemented" in scheduled && scheduled.implemented, true, name);
		assert.equal("steps" in scheduled, false, `${name} is not 7-step`);
		assert.equal("code" in scheduled && scheduled.code === WORKFLOW_ROUTE_DEFERRED, false, name);
	}
});

test("test_us0140_phase_graph_preconditions", () => {
	assert.deepEqual(
		[...CANONICAL_PHASES],
		[
			"intake",
			"discovery",
			"research",
			"architecture",
			"sprint-plan",
			"plan-verify",
			"execute",
			"qa",
			"verify-work",
			"release",
			"closure",
			"refresh-context",
		],
	);
	assert.equal(
		PHASE_GRAPH_EDGES.some((e) => e.from === "execute" && e.to === "qa" && e.kind === "forward"),
		true,
	);
	assert.equal(
		PHASE_GRAPH_EDGES.some((e) => e.from === "qa" && e.to === "execute" && e.kind === "rework"),
		true,
	);
	assert.equal(CANONICAL_PHASES.includes("plan-verify"), true);
	assert.equal(shouldSkipPlanVerify(cfg({ delivery: { DELIVERY_MODE: "ultra_lean" } })), true);
	assert.equal(shouldSkipPlanVerify(cfg()), false);
	const skip = PHASE_GRAPH_EDGES.find((e) => e.kind === "skip" && e.from === "sprint-plan");
	assert.equal(skip?.to, "execute");
	assert.equal(skip?.skip_reason, "ultra_lean_skip_plan_verify");
	assert.deepEqual(preconditionsFor("discovery"), ["intake"]);
	assert.equal(preconditionsFor("execute").includes("sprint-plan"), true);
	assert.equal(preconditionsFor("execute").includes("plan-verify"), true);
});

test("test_us0140_spawn_only_orchestrator", async () => {
	assert.equal(HOST_SCHEDULING_ONLY, true);
	assert.equal(IN_PROCESS_PRODUCER_FORBIDDEN, true);
	const { sv } = supervisor();
	const router = createCommandRouter({ supervisor: sv, config: cfg() });
	const result = await router.route("execute", routeInput());
	assert.equal(result.ok, true);
	if (isRouteOk(result)) {
		assert.deepEqual(result.steps, [...COMMAND_ROUTER_STEPS]);
		assert.equal(result.fresh, true);
		assert.equal(result.in_process_producer, false);
		assert.equal(result.host_scheduling_only, true);
		assert.equal(result.role_id, "dev");
		assert.equal(result.session.fresh, true);
		assert.equal(typeof result.policy_hash, "string");
		assert.equal(result.policy_hash.length > 0, true);
		assert.equal(typeof result.context_pack_hash, "string");
		assert.equal(result.intent.schema_version, 1);
	}
	for (const peer of [
		"role-runtime",
		"policy-engine",
		"config",
		"context-engine",
		"kernel-bridge",
	]) {
		for (const path of walkFiles(join(STANDALONE_ROOT, "packages", peer))) {
			const text = readFileSync(path, "utf8");
			assert.equal(text.includes("@its-magic/runtime-core"), false, path);
			assert.equal(text.includes("workflow/gates"), false, path);
		}
	}
});

test("test_us0140_bounded_execute_qa", async () => {
	const { sv } = supervisor();
	const engine = createWorkflowEngine({
		supervisor: sv,
		config: cfg({
			autonomy: { flags: { AUTO_IMPLEMENTATION_LOOP: "1" } },
			retryTest: { AUTO_LOOP_MAX_CYCLES: 2 },
		}),
		qaPass: () => false,
	});
	await assert.rejects(
		() => engine.runExecuteQaLoop(routeInput()),
		(err: unknown) => {
			assert.equal(isWorkflowError(err), true);
			const we = err as WorkflowError;
			assert.equal(we.code, WORKFLOW_LOOP_CAP);
			assert.deepEqual([...we.aliases], [FIX_FAILED, BLOCK_RETRY_CAP_EXHAUSTED]);
			assert.equal(we.intent?.stop_reason, "loop_max");
			return true;
		},
	);
	const shared = createWorkflowEngine({
		supervisor: supervisor().sv,
		config: cfg({
			shared: { AUTO_IMPLEMENTATION_LOOP: "1" },
			retryTest: { AUTO_LOOP_MAX_CYCLES: 1 },
		}),
		qaPass: () => false,
	});
	await assert.rejects(() => shared.runExecuteQaLoop(routeInput()), WorkflowError);
});

test("test_us0140_critics_supplement_not_substitute", async () => {
	const { sv } = supervisor();
	const engine = createWorkflowEngine({
		supervisor: sv,
		config: cfg({ sovereign: { CROSS_MODEL_REVIEW: "1" } }),
		qaPass: () => true,
	});
	const loop = await engine.runExecuteQaLoop(routeInput());
	assert.equal(loop.passed, true);
	assert.equal(loop.producer_role, "dev");
	assert.equal(loop.supplementary_roles.includes("tech-lead"), true);
	assert.equal(loop.cycles[0]?.execute.role_id, "dev");
	assert.equal(loop.cycles[0]?.critic?.role_id, "tech-lead");
	assert.equal(loop.cycles[0]?.critic?.fresh, true);
	assert.notEqual(
		loop.cycles[0]?.critic?.kernel_session_id,
		loop.cycles[0]?.execute.session.kernel_session_id,
	);
	const security = await engine.spawnSecurityReview(loop.cycles[0]?.execute as never, routeInput());
	assert.equal(security.role_id, "security");
	assert.equal(security.fresh, true);
	assert.equal(loop.producer_role, "dev");
});

test("test_us0140_release_gate_order", () => {
	const gates = createGateEngine();
	assert.deepEqual(
		[...RELEASE_GATE_ORDER],
		["check_in_tests", "independent_qa", "uat_evidence", "release_artifacts", "fail_closed_reason"],
	);
	const tests = gates.evaluate({
		tests_pass: false,
		qa_evidence: false,
		uat_pass: false,
		artifact_refs: [],
		premature: true,
	});
	assert.equal(tests.ok, false);
	if (!tests.ok) {
		assert.equal(tests.code, RELEASE_TESTS_FAILED);
		assert.equal(tests.step_index, 0);
	}
	const qa = gates.evaluate({
		tests_pass: true,
		qa_evidence: false,
		uat_pass: false,
		artifact_refs: [],
	});
	assert.equal(qa.ok, false);
	if (!qa.ok) {
		assert.equal(qa.code, RELEASE_QA_MISSING);
		assert.equal(qa.step_index, 1);
	}
	const uat = gates.evaluate({
		tests_pass: true,
		qa_evidence: true,
		uat_pass: false,
		artifact_refs: ["notes.md"],
	});
	assert.equal(uat.ok, false);
	if (!uat.ok) {
		assert.equal(uat.code, RELEASE_UAT_FAILED);
		assert.equal(uat.step_index, 2);
	}
	const arts = gates.evaluate({
		tests_pass: true,
		qa_evidence: true,
		uat_pass: true,
		artifact_refs: [],
	});
	assert.equal(arts.ok, false);
	if (!arts.ok) {
		assert.equal(arts.code, RELEASE_ARTIFACTS_MISSING);
		assert.equal(arts.step_index, 3);
	}
	const premature = gates.evaluate({
		tests_pass: true,
		qa_evidence: true,
		uat_pass: true,
		artifact_refs: ["notes.md"],
		premature: true,
	});
	assert.equal(premature.ok, false);
	if (!premature.ok) {
		assert.equal(premature.code, RELEASE_PREMATURE);
		assert.equal(premature.step_index, 4);
	}
	const ok = gates.evaluate({
		tests_pass: true,
		qa_evidence: true,
		uat_pass: true,
		artifact_refs: ["notes.md"],
	});
	assert.equal(ok.ok, true);
});

test("test_us0140_release_not_closure", async () => {
	const { sv } = supervisor();
	const engine = createWorkflowEngine({
		supervisor: sv,
		config: cfg(),
		kernelBridge: passBridge(),
	});
	const gates = {
		tests_pass: true,
		qa_evidence: true,
		uat_pass: true,
		artifact_refs: ["sprints/S0147/summary.md"],
	};
	const written = engine.writeRelease(
		{
			release_run_id: "rel-us0140",
			tests_pass: true,
			qa_pass: true,
			uat_pass: true,
			artifact_refs: ["sprints/S0147/summary.md"],
		},
		gates,
	);
	assert.equal(written.marked_done, false);
	assert.equal(written.status_reconcile_called, false);
	assert.equal(releaseCannotMarkDone().marked_done, false);
	await assert.rejects(
		() => applyClosure(null),
		(err: unknown) => {
			assert.equal(isWorkflowError(err), true);
			assert.equal((err as WorkflowError).code, CLOSURE_RELEASE_EVIDENCE_MISSING);
			return true;
		},
	);
	const closed = await engine.close(written.evidence);
	assert.equal(closed.status_written, "DONE");
	assert.equal(closed.isolation_written_by, "closure");
});

test("test_us0140_sqlite_non_authority", () => {
	const store = createRunsStore(":memory:");
	try {
		assert.deepEqual(store.tableNames().sort(), [
			"audit",
			"index_meta",
			"process_handles",
			"runs",
			"sessions",
		]);
		store.insertRun({
			id: "run-1",
			phase_id: "execute",
			status: "running",
			claimed_complete: 0,
			created_at: "2026-09-13T21:35:00Z",
		});
		store.insertSession({
			id: "sess-1",
			run_id: "run-1",
			role_id: "dev",
			phase_id: "execute",
			created_at: "2026-09-13T21:35:00Z",
		});
		store.audit("run-1", "spawn", "{}", "2026-09-13T21:35:00Z");
		store.reserveProcessHandle("ph-1", "run-1");
		store.setMeta("schema", "1");
		store.claimComplete("run-1");
		assert.throws(
			() =>
				store.assertRepoCanonical({
					backlog_status: "OPEN",
					acceptance_done: false,
					sprint_done: false,
				}),
			(err: unknown) => {
				assert.equal(isWorkflowError(err), true);
				assert.equal((err as WorkflowError).code, RECOVERY_FALSE_COMPLETION);
				return true;
			},
		);
		const gitignore = readFileSync(join(KIT_ROOT, ".gitignore"), "utf8");
		assert.equal(gitignore.includes(RUNTIME_GITIGNORE_GLOB), true);
	} finally {
		store.close();
	}
});

test("test_us0140_crash_resume_fresh_role", async () => {
	const { sv, sessions } = supervisor();
	const prior = await sv.spawn({
		phase_id: "execute",
		role_id: "dev",
		orchestrator_run_id: "auto-20260913-us0140",
		model_id: "openai/itsm-fake-ping",
	});
	const store = createRunsStore(":memory:");
	store.insertRun({
		id: "run-crash",
		phase_id: "execute",
		status: "running",
		claimed_complete: 0,
		created_at: "2026-09-13T21:00:00Z",
	});
	const resumed = await crashResume({
		supervisor: sv,
		store,
		config: cfg(),
		repo: { backlog_status: "OPEN", acceptance_done: false, sprint_done: false },
		brief: { last_completed_phase: "sprint-plan", intended_resume_phase: "execute", stale: false },
		orchestrator_run_id: "auto-20260913-us0140",
		model_id: "openai/itsm-fake-ping",
	});
	assert.equal(resumed.ok, true);
	assert.equal(resumed.fresh, true);
	assert.equal(resumed.orphans_discarded, true);
	assert.equal(resumed.restored_parent_transcript, false);
	assert.equal(resumed.next_phase, "execute");
	assert.equal(resumed.next_role, "dev");
	assert.notEqual(resumed.session.kernel_session_id, prior.kernel_session_id);
	assert.equal(sessions[0]?.aborted, true);
	assert.equal(sessions[0]?.disposed, true);
	await assert.rejects(
		() =>
			crashResume({
				supervisor: sv,
				store,
				config: cfg(),
				repo: { backlog_status: "OPEN", acceptance_done: false, sprint_done: false },
				brief: { stale: true },
				orchestrator_run_id: "auto-20260913-us0140",
				model_id: "openai/itsm-fake-ping",
			}),
		(err: unknown) => {
			assert.equal((err as WorkflowError).code, RESUME_BRIEF_STALE);
			return true;
		},
	);
	store.claimComplete("run-crash");
	await assert.rejects(
		() =>
			crashResume({
				supervisor: sv,
				store,
				config: cfg(),
				repo: { backlog_status: "OPEN", acceptance_done: false, sprint_done: false },
				brief: { last_completed_phase: "execute", intended_resume_phase: "qa", stale: false },
				orchestrator_run_id: "auto-20260913-us0140",
				model_id: "openai/itsm-fake-ping",
			}),
		(err: unknown) => {
			assert.equal((err as WorkflowError).code, RECOVERY_FALSE_COMPLETION);
			return true;
		},
	);
	store.close();
});

test("test_us0140_validator_fail_blocks", async () => {
	const { sv } = supervisor();
	const router = createCommandRouter({
		supervisor: sv,
		config: cfg(),
		kernelBridge: passBridge(),
	});
	await assert.rejects(
		() => router.route("execute", { ...routeInput(), validator_name: "not-a-real-validator" }),
		(err: unknown) => {
			assert.equal(err instanceof KernelBridgeError, true);
			assert.equal((err as KernelBridgeError).code, KERNEL_VALIDATOR_MISSING);
			return true;
		},
	);
	assert.equal(ALLOWED_VALIDATOR_NAMES.includes("not-a-real-validator"), false);
	const failing = createCommandRouter({
		supervisor: supervisor().sv,
		config: cfg(),
		kernelBridge: {
			async runValidator(name) {
				return {
					name,
					pass: false,
					exitCode: 2,
					reasonCode: "VALIDATOR_FAILED",
					stdout: "",
					stderr: "no",
					evidence: null,
				};
			},
		},
	});
	await assert.rejects(
		() =>
			failing.route("closure", {
				...routeInput(),
				validator_name: "validate_closure_verification",
			}),
		WorkflowError,
	);
});

test("test_us0140_qa_uat_fail_blocks", async () => {
	const { sv } = supervisor();
	const engine = createWorkflowEngine({
		supervisor: sv,
		config: cfg(),
		qaPass: () => false,
	});
	const blocked = await engine.runExecuteQaLoop(routeInput());
	assert.equal(blocked.passed, false);
	assert.equal(blocked.intent.stop_reason, "blocked");
	assert.equal(blocked.intent.gate_code, "QA_FAILED");
	const release = engine.evaluateRelease({
		tests_pass: true,
		qa_evidence: false,
		uat_pass: false,
		artifact_refs: [],
	});
	assert.equal(release.ok, false);
	if (!release.ok) {
		assert.equal(release.code, RELEASE_QA_MISSING);
	}
	const uat = engine.evaluateRelease({
		tests_pass: true,
		qa_evidence: true,
		uat_pass: false,
		artifact_refs: ["a.md"],
	});
	assert.equal(uat.ok, false);
	if (!uat.ok) {
		assert.equal(uat.code, RELEASE_UAT_FAILED);
	}
});

test("test_us0140_e2e_standard_lifecycle", async () => {
	const { sv } = supervisor();
	const engine = createWorkflowEngine({
		supervisor: sv,
		config: cfg({ delivery: { DELIVERY_MODE: "ultra_lean" } }),
		kernelBridge: passBridge(),
		qaPass: () => true,
	});
	const phases = await engine.runStandardLifecycle(routeInput());
	assert.equal(phases.length, 12);
	assert.equal(phases[0]?.command, "intake");
	assert.equal(phases[5]?.command, "plan-verify");
	assert.equal(phases[5]?.skip_reason, "ultra_lean_skip_plan_verify");
	assert.equal(phases[11]?.command, "refresh-context");
	for (const row of phases) {
		assert.equal(row.fresh, true);
		assert.equal(row.in_process_producer, false);
		assert.equal(row.intent.schema_version, 1);
	}
	await assert.rejects(
		() => engine.close(null),
		(err: unknown) => {
			assert.equal((err as WorkflowError).code, CLOSURE_RELEASE_EVIDENCE_MISSING);
			return true;
		},
	);
	const evidence = engine.writeRelease(
		{
			release_run_id: "rel-e2e",
			tests_pass: true,
			qa_pass: true,
			uat_pass: true,
			artifact_refs: ["sprints/S0147/summary.md"],
		},
		{
			tests_pass: true,
			qa_evidence: true,
			uat_pass: true,
			artifact_refs: ["sprints/S0147/summary.md"],
		},
	);
	const closed = await engine.close(evidence.evidence);
	assert.equal(closed.ok, true);
	assert.equal(closed.status_written, "DONE");
});
