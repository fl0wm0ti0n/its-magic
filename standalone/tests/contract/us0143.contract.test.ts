import assert from "node:assert/strict";
import { existsSync, mkdtempSync, readdirSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { ALLOWED_VALIDATOR_NAMES } from "../../packages/kernel-bridge/src/index.ts";
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
	AC6_NONRELAXABLE_TERMINALS,
	BUDGET_EXHAUSTED,
	CANONICAL_PHASES,
	type ConfigView,
	createCommandRouter,
	createRunsStore,
	createWorkflowEngine,
	DECISION_UNRESOLVED,
	DEFERRED_COMMANDS,
	expandPresetBeforeRun,
	isNonRelaxableStop,
	isRouteScheduled,
	isWorkflowError,
	KERNEL_INCOMPATIBLE,
	loadStopMatrix,
	MEGA_QUICK_PLAN,
	PROGRAMMATIC_COMMANDS,
	QUALITY_EVIDENCE_FAILED,
	RECOVERY_FALSE_COMPLETION,
	RELEASE_GATE_ORDER,
	RESUME_AMBIGUOUS,
	resolveDeliveryRoute,
	SCHEDULER_COMMANDS,
	WORK_KIND_DELIVERY_MODE_CONFLICT,
	WORK_KIND_ROUTING_OFF,
	WORKFLOW_LOOP_CAP,
	WORKFLOW_ROUTE_DEFERRED,
	type WorkflowError,
} from "../../packages/runtime-core/src/index.ts";

const HERE = dirname(fileURLToPath(import.meta.url));
const STANDALONE_ROOT = join(HERE, "..", "..");
const KIT_ROOT = join(STANDALONE_ROOT, "..");
const CORE_ROOT = join(STANDALONE_ROOT, "packages", "runtime-core");
const YAML_PATH = join(KIT_ROOT, "scripts", "data", "autonomy_stop_matrix.yaml");

const MARKERS = [
	"test_us0143_auto_route_implemented",
	"test_us0143_quick_route_implemented",
	"test_us0143_standard_lifecycle_auto",
	"test_us0143_compressed_ultra_lean_mega_quick",
	"test_us0143_axis_independence",
	"test_us0143_l8_precedence_start_from",
	"test_us0143_work_kind_conflict",
	"test_us0143_preset_expand_stop_matrix",
	"test_us0143_drain_caps_operator_authority",
	"test_us0143_nonrelaxable_terminals",
	"test_us0143_audit_ledger_mid_resume",
	"test_us0143_autonomy_disabled",
] as const;

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
		delivery: over.delivery,
		token: over.token,
		workKind: over.workKind,
		autonomy: {
			AUTONOMY_PRESET: over.autonomy?.AUTONOMY_PRESET,
			flags: {
				AUTO_BUG_QUEUE: "0",
				AUTO_IMPLEMENTATION_LOOP: "1",
				AUTO_BACKLOG_MAX_STORIES: "10",
				AUTO_EXECUTE_MAX_ITEMS: "10",
				...(over.autonomy?.flags ?? {}),
			},
		},
		shared: { ...(over.shared ?? {}) },
		compat: { ...(over.compat ?? {}) },
		retryTest: {
			AUTO_LOOP_MAX_CYCLES: over.retryTest?.AUTO_LOOP_MAX_CYCLES ?? 32,
			AUTO_BLOCK_RETRY_MAX: over.retryTest?.AUTO_BLOCK_RETRY_MAX ?? 3,
		},
		sovereign: { CROSS_MODEL_REVIEW: over.sovereign?.CROSS_MODEL_REVIEW ?? "0" },
		phase: { ...(over.phase ?? {}) },
	};
}

function routeInput(extra: Record<string, unknown> = {}) {
	return {
		orchestrator_run_id: "auto-20260913-us0143",
		model_id: "openai/itsm-fake-ping",
		yamlPath: YAML_PATH,
		...extra,
	};
}

function engine(over: ConfigView = {}) {
	const { sv } = supervisor();
	return createWorkflowEngine({
		supervisor: sv,
		config: cfg(over),
		env: {},
	});
}

test("test_us0143_auto_route_implemented", async () => {
	assertNoPi(CORE_ROOT);
	assert.equal(existsSync(join(STANDALONE_ROOT, "packages", "auto-scheduler")), false);
	assert.equal(existsSync(join(KIT_ROOT, ".opencode", "commands", "auto.md")), false);
	const kitFiles = JSON.parse(readFileSync(join(KIT_ROOT, "package.json"), "utf8")) as {
		files?: string[];
	};
	assert.equal(
		(kitFiles.files ?? []).some(
			(f) => String(f) === "standalone" || String(f).startsWith("standalone/"),
		),
		false,
	);
	assert.deepEqual([...SCHEDULER_COMMANDS], ["/auto", "/quick"]);
	assert.deepEqual([...DEFERRED_COMMANDS], []);
	assert.equal(WORKFLOW_ROUTE_DEFERRED, "WORKFLOW_ROUTE_DEFERRED");
	assert.equal(
		(ALLOWED_VALIDATOR_NAMES as readonly string[]).includes("work_kind_classify"),
		false,
	);
	const { sv } = supervisor();
	const router = createCommandRouter({ supervisor: sv, config: cfg(), env: {} });
	assert.equal(router.listCommands().includes("/auto"), true);
	const result = await router.route("/auto", routeInput());
	assert.equal(isRouteScheduled(result), true);
	assert.equal(result.ok, true);
	assert.equal("implemented" in result && result.implemented, true);
	assert.equal("steps" in result, false);
	assert.equal("code" in result && result.code === WORKFLOW_ROUTE_DEFERRED, false);
	if (isRouteScheduled(result)) {
		assert.equal(result.command, "/auto");
		assert.equal(result.in_process_producer, false);
		assert.equal(result.host_scheduling_only, true);
		assert.deepEqual([...result.plan], [...CANONICAL_PHASES]);
		assert.equal(result.axes.work_kind_routing, "0");
	}
});

test("test_us0143_quick_route_implemented", async () => {
	const { sv } = supervisor();
	const router = createCommandRouter({ supervisor: sv, config: cfg(), env: {} });
	assert.equal(router.listCommands().includes("/quick"), true);
	const result = await router.route("/quick", routeInput({ acCount: 2 }));
	assert.equal(isRouteScheduled(result), true);
	if (isRouteScheduled(result)) {
		assert.equal(result.command, "/quick");
		assert.equal(result.implemented, true);
		assert.equal(result.in_process_producer, false);
		assert.equal(result.host_scheduling_only, true);
		assert.deepEqual([...result.plan], [...MEGA_QUICK_PLAN]);
		assert.equal(result.plan.includes("execute"), true);
		assert.equal(result.plan.includes("qa"), true);
		assert.equal(result.plan.includes("verify-work"), true);
	}
	await assert.rejects(
		() => router.route("/quick", routeInput({ acCount: 8 })),
		(err: unknown) =>
			isWorkflowError(err) && (err as WorkflowError).code === "DELIVERY_MODE_INELIGIBLE",
	);
});

test("test_us0143_standard_lifecycle_auto", async () => {
	const wf = engine({
		delivery: { DELIVERY_MODE: "standard" },
		sovereign: { CROSS_MODEL_REVIEW: "1" },
		autonomy: { AUTONOMY_PRESET: "balanced" },
	});
	const scheduled = await wf.runCommand("/auto", routeInput());
	assert.equal(isRouteScheduled(scheduled), true);
	if (isRouteScheduled(scheduled)) {
		assert.deepEqual([...scheduled.plan], [...CANONICAL_PHASES]);
		assert.equal(scheduled.plan.includes("execute"), true);
		assert.equal(scheduled.plan.includes("qa"), true);
		assert.equal(scheduled.plan.includes("verify-work"), true);
		assert.equal(scheduled.plan.includes("release"), true);
	}
	const ran = await wf.runAuto(routeInput());
	assert.equal(ran.passed, true);
	assert.equal(ran.command, "/auto");
	assert.equal(ran.critic_content, false);
	assert.equal(ran.critic_scheduled, true);
	assert.equal(ran.scheduled.plan.includes("execute"), true);
	assert.equal(ran.scheduled.plan.includes("verify-work"), true);
	assert.deepEqual(
		[...RELEASE_GATE_ORDER],
		["check_in_tests", "independent_qa", "uat_evidence", "release_artifacts", "fail_closed_reason"],
	);
});

test("test_us0143_compressed_ultra_lean_mega_quick", async () => {
	const lean = engine({ delivery: { DELIVERY_MODE: "ultra_lean" } });
	const leanRoute = await lean.runCommand("/auto", routeInput());
	assert.equal(isRouteScheduled(leanRoute), true);
	if (isRouteScheduled(leanRoute)) {
		assert.equal(leanRoute.skip_reason, "ultra_lean_skip_plan_verify");
		assert.equal(leanRoute.plan.includes("execute"), true);
		assert.equal(leanRoute.plan.includes("qa"), true);
		assert.equal(leanRoute.plan.includes("verify-work"), true);
		assert.equal(leanRoute.plan.includes("plan-verify"), true);
	}
	const quick = engine({ delivery: { DELIVERY_MODE: "mega_quick" } });
	const mega = await quick.runCommand("/auto", routeInput({ acCount: 1 }));
	assert.equal(isRouteScheduled(mega), true);
	if (isRouteScheduled(mega)) {
		assert.deepEqual([...mega.plan], [...MEGA_QUICK_PLAN]);
	}
	const forced = await quick.runQuick(routeInput({ acCount: 1 }));
	assert.equal(forced.passed, true);
	assert.deepEqual([...forced.scheduled.plan], [...MEGA_QUICK_PLAN]);
	assert.equal(forced.scheduled.plan.includes("execute"), true);
	assert.equal(forced.scheduled.plan.includes("qa"), true);
	assert.equal(forced.scheduled.plan.includes("verify-work"), true);
	assert.equal(forced.scheduled.plan.includes("release"), true);
});

test("test_us0143_axis_independence", async () => {
	const { sv } = supervisor();
	const router = createCommandRouter({
		supervisor: sv,
		config: cfg({
			delivery: { DELIVERY_MODE: "standard" },
			token: { TOKEN_PROFILE: "lean" },
			workKind: { WORK_KIND_ROUTING: "1" },
			autonomy: { AUTONOMY_PRESET: "full" },
			shared: {
				CAVEMAN_MODE: "1",
				CAVEMAN_LEVEL: "high",
				CAVEMAN_COMPRESS_INPUT: "1",
			},
		}),
		env: {},
	});
	const result = await router.route("/auto", routeInput());
	assert.equal(isRouteScheduled(result), true);
	if (isRouteScheduled(result)) {
		assert.equal(result.axes.delivery_mode, "standard");
		assert.equal(result.axes.token_profile, "lean");
		assert.equal(result.axes.autonomy_preset, "full");
		assert.equal(result.axes.work_kind_routing, "1");
		assert.equal(result.axes.voice.includes("CAVEMAN_MODE=1"), true);
		assert.equal(result.axes.voice.includes("CAVEMAN_COMPRESS_INPUT=1"), true);
		assert.deepEqual([...result.plan], [...CANONICAL_PHASES]);
	}
	const other = resolveDeliveryRoute({
		command: "/auto",
		config: cfg({
			delivery: { DELIVERY_MODE: "standard" },
			token: { TOKEN_PROFILE: "full" },
			autonomy: { AUTONOMY_PRESET: "none" },
			shared: { CAVEMAN_MODE: "0", CAVEMAN_COMPRESS_INPUT: "0" },
			workKind: { WORK_KIND_ROUTING: "0" },
		}),
	});
	assert.deepEqual([...other.plan], [...CANONICAL_PHASES]);
	assert.equal(other.axes.token_profile, "full");
	assert.equal(other.axes.autonomy_preset, "none");
	assert.equal(other.axes.work_kind_routing, "0");
});

test("test_us0143_l8_precedence_start_from", () => {
	const off = resolveDeliveryRoute({
		command: "/auto",
		config: cfg({ workKind: { WORK_KIND_ROUTING: "0" } }),
	});
	assert.equal(off.reason_code, WORK_KIND_ROUTING_OFF);
	assert.equal(off.delivery_mode, "standard");
	assert.deepEqual([...off.plan], [...CANONICAL_PHASES]);

	const start = resolveDeliveryRoute({
		command: "/auto",
		config: cfg({ delivery: { DELIVERY_MODE: "standard" }, workKind: { WORK_KIND_ROUTING: "1" } }),
		startFrom: "execute",
		backlogRecommendedDeliveryMode: "mega_quick",
	});
	assert.equal(start.plan[0], "execute");
	assert.equal(start.plan.includes("qa"), true);
	assert.equal(start.plan.includes("intake"), false);

	const explicit = resolveDeliveryRoute({
		command: "/auto",
		config: cfg({
			delivery: { DELIVERY_MODE: "ultra_lean" },
			workKind: { WORK_KIND_ROUTING: "1" },
		}),
		backlogRecommendedDeliveryMode: "mega_quick",
	});
	assert.equal(explicit.delivery_mode, "ultra_lean");
	assert.equal(explicit.skip_reason, "ultra_lean_skip_plan_verify");

	const autoPhase = resolveDeliveryRoute({
		command: "/auto",
		config: cfg({
			workKind: { WORK_KIND_ROUTING: "1" },
			autonomy: { flags: { AUTO_PHASE_PLAN: '["spec","plan"]' } },
		}),
		backlogRecommendedDeliveryMode: "mega_quick",
	});
	assert.equal(autoPhase.delivery_mode, "standard");
	assert.deepEqual([...autoPhase.plan], [...CANONICAL_PHASES]);
});

test("test_us0143_work_kind_conflict", () => {
	const conflict = resolveDeliveryRoute({
		command: "/auto",
		config: cfg({
			delivery: { DELIVERY_MODE: "ultra_lean" },
			workKind: { WORK_KIND_ROUTING: "1" },
		}),
		backlogRecommendedDeliveryMode: "standard",
	});
	assert.equal(conflict.conflict_code, WORK_KIND_DELIVERY_MODE_CONFLICT);
	assert.equal(conflict.reason_code, WORK_KIND_DELIVERY_MODE_CONFLICT);
	assert.equal(conflict.delivery_mode, "ultra_lean");
	assert.equal(conflict.skip_reason, "ultra_lean_skip_plan_verify");
});

test("test_us0143_preset_expand_stop_matrix", () => {
	const expanded = expandPresetBeforeRun(
		cfg({ autonomy: { AUTONOMY_PRESET: "full", flags: { INTAKE_AUTONOMY_MODE: "0" } } }),
	);
	assert.equal(expanded.INTAKE_AUTONOMY_MODE, "0");
	assert.equal(expanded.AUTONOMY_STOP_POLICY, "auto_repair_then_skip");
	const rows = loadStopMatrix({ yamlPath: YAML_PATH });
	const yamlHard = new Set(rows.filter((r) => r.stop_class === "security_hard").map((r) => r.code));
	assert.equal(yamlHard.has("RESUME_BRIEF_STALE"), true);
	assert.equal(yamlHard.has("AUTO_SCHEDULER_CONFLICT"), true);
	assert.equal(yamlHard.has("SECURITY_REVIEW_CRITICAL_FINDING"), true);
	for (const code of AC6_NONRELAXABLE_TERMINALS) {
		assert.equal(yamlHard.has(code), true, code);
		assert.equal(isNonRelaxableStop(code, rows, "full"), true, code);
	}
});

test("test_us0143_drain_caps_operator_authority", async () => {
	const wf = engine({
		autonomy: {
			AUTONOMY_PRESET: "balanced",
			flags: {
				AUTO_BACKLOG_MAX_STORIES: "2",
				AUTO_EXECUTE_MAX_ITEMS: "2",
				AUTO_BUG_QUEUE: "0",
				AUTO_QUIET: "1",
			},
		},
	});
	const two = await wf.runAuto(
		routeInput({
			items: [
				{ id: "US-A", kind: "story" },
				{ id: "US-B", kind: "story" },
				{ id: "BUG-0024", kind: "bug" },
			],
		}),
	);
	assert.equal(two.items_processed, 2);
	assert.equal(two.bugs_drained, 0);
	await assert.rejects(
		() =>
			wf.runAuto(
				routeInput({
					items: [
						{ id: "US-A", kind: "story" },
						{ id: "US-B", kind: "story" },
						{ id: "US-C", kind: "story" },
					],
				}),
			),
		(err: unknown) => isWorkflowError(err) && (err as WorkflowError).code === WORKFLOW_LOOP_CAP,
	);
	const paused = await engine({
		autonomy: { AUTONOMY_PRESET: "full", flags: { AUTO_PAUSE_REQUEST: "1" } },
	}).runAuto(routeInput());
	assert.equal(paused.passed, false);
	assert.deepEqual(paused.codes, ["AUTO_PAUSE_REQUEST"]);
	const none = await engine({ autonomy: { AUTONOMY_PRESET: "none" } }).runAuto(
		routeInput({ approvalGranted: false }),
	);
	assert.equal(none.passed, false);
	assert.deepEqual(none.codes, ["APPROVAL_REQUIRED"]);
});

test("test_us0143_nonrelaxable_terminals", async () => {
	const rows = loadStopMatrix({ yamlPath: YAML_PATH });
	const full = "full";
	assert.equal(isNonRelaxableStop("PHASE_CONTEXT_ISOLATION_VIOLATION", rows, full), true);
	const cases: Array<{ code: string; extra: Record<string, unknown> }> = [
		{
			code: DECISION_UNRESOLVED,
			extra: { items: [{ id: "d", kind: "story", decisionUnresolved: true }] },
		},
		{
			code: KERNEL_INCOMPATIBLE,
			extra: { items: [{ id: "k", kind: "story", kernelIncompatible: true }] },
		},
		{
			code: QUALITY_EVIDENCE_FAILED,
			extra: { items: [{ id: "q", kind: "story", qualityFailed: true }] },
		},
		{ code: BUDGET_EXHAUSTED, extra: { tokenBudgetRemaining: 0 } },
		{ code: RESUME_AMBIGUOUS, extra: { resume: true, brief: { stale: true } } },
	];
	for (const row of cases) {
		const wf = engine({ autonomy: { AUTONOMY_PRESET: "full" } });
		await assert.rejects(
			() => wf.runAuto(routeInput(row.extra)),
			(err: unknown) => isWorkflowError(err) && (err as WorkflowError).code === row.code,
			row.code,
		);
	}
});

test("test_us0143_audit_ledger_mid_resume", async () => {
	const ledgerRoot = mkdtempSync(join(tmpdir(), "us0143-ledger-"));
	const store = createRunsStore(":memory:");
	try {
		store.insertRun({
			id: "run-crash",
			phase_id: "execute",
			status: "running",
			claimed_complete: 0,
			created_at: "2026-09-14T07:00:00Z",
		});
		const wf = engine({ autonomy: { AUTONOMY_PRESET: "balanced" } });
		const ran = await wf.runAuto(
			routeInput({
				store,
				ledgerRoot,
				resume: true,
				now: "2026-09-14T07:50:00Z",
				brief: {
					last_completed_phase: "sprint-plan",
					intended_resume_phase: "execute",
					stale: false,
				},
				repo: { backlog_status: "OPEN", acceptance_done: false, sprint_done: false },
			}),
		);
		assert.equal(ran.passed, true);
		assert.equal(ran.resumed, true);
		assert.equal(typeof ran.ledger_path, "string");
		const text = readFileSync(ran.ledger_path as string, "utf8");
		assert.equal(text.includes("phase_selection"), true);
		assert.equal(text.includes("resume_choice"), true);
		assert.equal(text.includes("repair_kind"), true);
		assert.equal(text.includes("cap_remaining"), true);
		assert.equal(text.includes("delivery_mode"), true);
		assert.equal(text.includes("orchestrator_run_id"), true);
		store.claimComplete("run-crash");
		assert.throws(
			() =>
				store.assertRepoCanonical({
					backlog_status: "OPEN",
					acceptance_done: false,
					sprint_done: false,
				}),
			(err: unknown) =>
				isWorkflowError(err) && (err as WorkflowError).code === RECOVERY_FALSE_COMPLETION,
		);
	} finally {
		store.close();
		rmSync(ledgerRoot, { recursive: true, force: true });
	}
});

test("test_us0143_autonomy_disabled", async () => {
	const expanded = expandPresetBeforeRun(cfg({ autonomy: { AUTONOMY_PRESET: "none" } }));
	assert.deepEqual(expanded, {});
	const rows = loadStopMatrix({ yamlPath: YAML_PATH });
	for (const code of AC6_NONRELAXABLE_TERMINALS) {
		assert.equal(isNonRelaxableStop(code, rows, "none"), true, code);
	}
	const wf = engine({ autonomy: { AUTONOMY_PRESET: "none" } });
	const denied = await wf.runAuto(routeInput({ approvalGranted: false }));
	assert.equal(denied.passed, false);
	const routed = await wf.runCommand("/auto", routeInput());
	assert.equal(isRouteScheduled(routed), true);
	assert.equal(MARKERS.length, 12);
	for (const marker of MARKERS) {
		assert.equal(marker.startsWith("test_us0143_"), true);
	}
	for (const name of PROGRAMMATIC_COMMANDS) {
		assert.equal(typeof name, "string");
	}
});
