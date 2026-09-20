import assert from "node:assert/strict";
import {
	existsSync,
	mkdirSync,
	mkdtempSync,
	readFileSync as readCli,
	readdirSync,
	readFileSync,
	rmSync,
	writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { renderPanelLayout, selectVisiblePanels } from "../../apps/tui/src/panels.ts";
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
	createCommandRouter,
	createOperatorCommandFacade,
	createOperatorObservabilityService,
	createOperatorPrompts,
	createOperatorSession,
	createRunsStore,
	createWorkflowEngine,
	isRouteScheduled,
	OPERATOR_INPUT_REQUIRED,
	OPERATOR_LOG_MAX_LINES,
	OperatorCommandFacade,
	PROGRAMMATIC_COMMANDS,
	SCHEDULER_COMMANDS,
} from "../../packages/runtime-core/src/index.ts";

const HERE = dirname(fileURLToPath(import.meta.url));
const STANDALONE_ROOT = join(HERE, "..", "..");
const KIT_ROOT = join(STANDALONE_ROOT, "..");
const CORE_ROOT = join(STANDALONE_ROOT, "packages", "runtime-core");
const CLI_ROOT = join(STANDALONE_ROOT, "apps", "cli");
const TUI_ROOT = join(STANDALONE_ROOT, "apps", "tui");
const YAML_PATH = join(KIT_ROOT, "scripts", "data", "autonomy_stop_matrix.yaml");

const MARKERS = [
	"test_us0146_cli_command_parity_programmatic_and_scheduler",
	"test_us0146_cli_auth_models_delegate_isolated",
	"test_us0146_status_snapshot_compose_read_only",
	"test_us0146_run_timeline_evidence_links",
	"test_us0146_tui_panels_client_only_boundaries",
	"test_us0146_metrics_token_cost_compose_no_conflict",
	"test_us0146_approval_prompt_interactive_noninteractive",
	"test_us0146_bounded_log_summary_evidence_ref",
	"test_us0146_local_reconnect_cancel_narrow_terminal",
] as const;

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

class FakeSession implements KernelSession {
	readonly sessionId: string;
	disposed = false;
	constructor(sessionId: string) {
		this.sessionId = sessionId;
	}
	async run(): Promise<void> {}
	async steer(): Promise<void> {}
	async abort(): Promise<void> {}
	dispose(): void {
		this.disposed = true;
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

function tempRepo(): string {
	const root = mkdtempSync(join(tmpdir(), "us0146-"));
	mkdirSync(join(root, "handoffs"), { recursive: true });
	mkdirSync(join(root, "docs", "engineering"), { recursive: true });
	writeFileSync(
		join(root, "handoffs", "resume_brief.md"),
		"story_id: US-0146\nsprint_id: S0153\nintended_resume_phase: execute\nlast_completed_phase: sprint-plan\n",
	);
	writeFileSync(join(root, "docs", "engineering", "state.md"), "# state\n");
	return root;
}

test("test_us0146_cli_command_parity_programmatic_and_scheduler", async () => {
	const sv = supervisor();
	const router = createCommandRouter({ supervisor: sv, config: {}, kernelRoot: KIT_ROOT });
	const facade = createOperatorCommandFacade({ router });
	for (const cmd of PROGRAMMATIC_COMMANDS.slice(0, 3)) {
		const parsed = OperatorCommandFacade.parseArgv([cmd], {
			orchestrator_run_id: "auto-20260917-us0146",
			model_id: "inherit",
			yamlPath: YAML_PATH,
			kernelRoot: KIT_ROOT,
		});
		assert.equal(parsed.kind, "programmatic");
		const slash = OperatorCommandFacade.parseArgv([`/${cmd}`], {
			orchestrator_run_id: "auto-20260917-us0146",
			model_id: "inherit",
			yamlPath: YAML_PATH,
			kernelRoot: KIT_ROOT,
		});
		assert.equal(slash.kind, "programmatic");
	}
	const autoParsed = OperatorCommandFacade.parseArgv(["auto"], {
		orchestrator_run_id: "auto-20260917-us0146",
		model_id: "inherit",
		yamlPath: YAML_PATH,
		kernelRoot: KIT_ROOT,
	});
	assert.equal(autoParsed.kind, "scheduler");
	const scheduled = await facade.routeArgv(["auto"], {
		orchestrator_run_id: "auto-20260917-us0146",
		model_id: "inherit",
		yamlPath: YAML_PATH,
		kernelRoot: KIT_ROOT,
	});
	assert.equal(isRouteScheduled(scheduled), true);
	assert.deepEqual([...SCHEDULER_COMMANDS], ["/auto", "/quick"]);
});

test("test_us0146_cli_auth_models_delegate_isolated", () => {
	const cliIndex = readCli(join(CLI_ROOT, "src", "index.ts"), "utf8");
	const cliRun = readCli(join(CLI_ROOT, "src", "run.ts"), "utf8");
	assert.equal(cliIndex.includes("itsm stub"), false);
	assert.equal(cliRun.includes("dispatchItsmCommand"), true);
	assert.equal(cliRun.includes("auth") && cliRun.includes("models"), true);
	assert.equal(cliRun.includes("OperatorCommandFacade"), true);
	const operatorHits = walkFiles(join(CORE_ROOT, "src", "operator")).filter((p) =>
		readFileSync(p, "utf8").includes("@its-magic/pi-kernel"),
	);
	assert.deepEqual(operatorHits, []);
});

test("test_us0146_status_snapshot_compose_read_only", () => {
	const root = tempRepo();
	const store = createRunsStore(":memory:");
	const svc = createOperatorObservabilityService({ projectRoot: root, store });
	const snap = svc.buildStatusSnapshot("auto-20260917-us0146");
	assert.equal(snap.read_only, true);
	assert.equal(snap.schema_version, 1);
	assert.equal(snap.story_id, "US-0146");
	assert.equal(snap.sprint_id, "S0153");
	assert.ok(snap.evidence_refs.length > 0);
	assert.throws(() => svc.appendTokenCostRow(), /TOKEN_COST_LEDGER_WRITE_FORBIDDEN/);
	rmSync(root, { recursive: true, force: true });
});

test("test_us0146_run_timeline_evidence_links", () => {
	const store = createRunsStore(":memory:");
	const now = new Date().toISOString();
	store.audit(
		"run-1",
		"phase_transition",
		JSON.stringify({
			phase_id: "execute",
			role_id: "dev",
			evidence_refs: ["handoffs/dev_to_qa.md"],
		}),
		now,
	);
	store.audit(
		"run-1",
		"phase_transition",
		JSON.stringify({
			phase_id: "execute",
			role_id: "dev",
			stop_reason: "FIX_FAILED",
			evidence_refs: ["sprints/S0153/progress.md"],
		}),
		now,
	);
	const root = tempRepo();
	const svc = createOperatorObservabilityService({ projectRoot: root, store });
	const timeline = svc.buildRunTimeline("run-1");
	assert.equal(timeline.length, 2);
	assert.equal(timeline[0].phase_id, "execute");
	assert.equal(timeline[1].attempt, 2);
	assert.ok(timeline[1].evidence_refs.includes("sprints/S0153/progress.md"));
	rmSync(root, { recursive: true, force: true });
});

test("test_us0146_tui_panels_client_only_boundaries", () => {
	const forbidden: string[] = [];
	for (const path of walkFiles(join(TUI_ROOT, "src"))) {
		const text = readFileSync(path, "utf8");
		if (
			text.includes("CommandRouter") ||
			text.includes("GateEngine") ||
			text.includes("createWorkflowEngine")
		) {
			forbidden.push(path);
		}
	}
	assert.deepEqual(forbidden, []);
	const layout = renderPanelLayout(
		{
			phase: { phase_id: "execute", role_id: "dev" },
			status: {
				schema_version: 1,
				orchestrator_run_id: null,
				story_id: "US-0146",
				sprint_id: "S0153",
				phase_id: "execute",
				role_id: "dev",
				model_id: null,
				backend_id: null,
				app_health: { ok: true },
				index_health: { ok: true },
				browser_summary: { probe_count: 0, evidence_refs: [] },
				token_cost: { metric_source: "us-0080", total_tokens: null, evidence_ref: null },
				sovereign: null,
				evidence_refs: [],
				read_only: true,
			},
			timeline: [],
			tools: { names: [] },
		},
		80,
	);
	assert.ok(layout.includes("Phase"));
});

test("test_us0146_metrics_token_cost_compose_no_conflict", () => {
	const root = tempRepo();
	const store = createRunsStore(":memory:");
	store.audit(null, "phase_start", "{}", new Date().toISOString());
	const svc = createOperatorObservabilityService({ projectRoot: root, store });
	const metrics = svc.buildMetricsSnapshot();
	assert.equal(metrics.read_only, true);
	assert.equal(metrics.authoritative.metric_source, "us-0080");
	assert.equal(metrics.evidence_missing, true);
	assert.equal(metrics.metrics_stale, true);
	rmSync(root, { recursive: true, force: true });
});

test("test_us0146_approval_prompt_interactive_noninteractive", async () => {
	const prompts = createOperatorPrompts({ interactive: false, terminalCols: 40 });
	await assert.rejects(
		() =>
			prompts.choose({
				message: "Approve release?",
				choices: [
					{ id: "yes", label: "Yes", default: true },
					{ id: "no", label: "No" },
				],
			}),
		(err: Error) => err.message === OPERATOR_INPUT_REQUIRED,
	);
	const approved = createOperatorPrompts({
		interactive: false,
		env: { ITS_MAGIC_APPROVE: "1" },
		terminalCols: 40,
	});
	const choice = await approved.choose({
		message: "Approve?",
		choices: [
			{ id: "yes", label: "Yes", default: true },
			{ id: "no", label: "No" },
		],
	});
	assert.equal(choice, "yes");
	assert.ok(prompts.wrapLine("x".repeat(100)).includes("\n"));
});

test("test_us0146_bounded_log_summary_evidence_ref", () => {
	const root = tempRepo();
	const logPath = join(root, "handoffs", "app.log");
	const line = "event\n".repeat(OPERATOR_LOG_MAX_LINES + 5);
	writeFileSync(logPath, line);
	const store = createRunsStore(":memory:");
	const svc = createOperatorObservabilityService({ projectRoot: root, store });
	const view = svc.buildBoundedLogSummary(logPath);
	assert.equal(view.truncated, true);
	assert.equal(view.evidence_path, logPath);
	assert.ok(view.total_bytes > 0);
	assert.equal(view.lines.length <= OPERATOR_LOG_MAX_LINES, true);
	rmSync(root, { recursive: true, force: true });
});

test("test_us0146_local_reconnect_cancel_narrow_terminal", () => {
	const sv = supervisor();
	const engine = createWorkflowEngine({ supervisor: sv, config: {}, env: {} });
	const session = createOperatorSession({ onCancel: () => undefined });
	session.attach(engine, "sess-local");
	assert.equal(session.getState().attached, true);
	session.detach();
	assert.equal(session.getState().attached, false);
	session.attach(engine, "sess-local");
	const re = session.reconnect();
	assert.equal(re.attached, true);
	const cancel = session.cancel();
	assert.equal(cancel.cancel_requested, true);
	const narrow = selectVisiblePanels(40);
	assert.deepEqual(narrow, ["phase", "status"]);
	const wide = selectVisiblePanels(120);
	assert.ok(wide.length > narrow.length);
});

test("us0146 marker inventory", () => {
	for (const marker of MARKERS) {
		assert.equal(marker.startsWith("test_us0146_"), true);
	}
	assert.equal(existsSync(join(CORE_ROOT, "src", "operator", "operator-command-facade.ts")), true);
	assert.equal(existsSync(join(TUI_ROOT, "package.json")), true);
	const kitFiles = JSON.parse(readFileSync(join(KIT_ROOT, "package.json"), "utf8")) as {
		files?: string[];
	};
	assert.equal(
		(kitFiles.files ?? []).some(
			(f) => String(f) === "standalone" || String(f).startsWith("standalone/"),
		),
		false,
	);
});
