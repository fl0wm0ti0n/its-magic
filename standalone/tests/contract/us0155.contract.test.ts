import assert from "node:assert/strict";
import {
	copyFileSync,
	mkdirSync,
	mkdtempSync,
	readdirSync,
	readFileSync,
	rmSync,
	writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { PassThrough } from "node:stream";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { createCodeIntelligenceProvider } from "@its-magic/code-intelligence";
import type { KernelBridge } from "@its-magic/kernel-bridge";
import type { AgentKernel } from "@its-magic/pi-kernel";
import { DAEMON_RPC_METHODS, PROTOCOL_VERSION } from "@its-magic/protocol";
import {
	createRunsStore,
	OPERATOR_INPUT_REQUIRED,
	OPERATOR_LOG_MAX_BYTES,
	OPERATOR_LOG_MAX_LINES,
	OPERATOR_RUN_ID,
	type OperatorStatusSnapshot,
} from "@its-magic/runtime-core";
import { createRuntimeHost, type RuntimeHost } from "@its-magic/runtime-host";
import { runCliArgv } from "../../apps/cli/src/run.ts";
import { startDaemonServer } from "../../apps/daemon/src/server.ts";
import { actionForKey, openInteractiveTui, runInteractiveTui } from "../../apps/tui/src/index.ts";
import { renderInteractiveLayout } from "../../apps/tui/src/interactive-panels.ts";
import { selectVisiblePanels, type TuiPanelModel } from "../../apps/tui/src/panels.ts";

const projectRoot = fileURLToPath(new URL("../../..", import.meta.url));
const tuiSrc = fileURLToPath(new URL("../../apps/tui/src/", import.meta.url));
const SECRET = "sk-abcdefgH123456";

function bridge(): KernelBridge {
	return {
		async locateProjectKernel() {
			return { kernelRoot: projectRoot, locateMode: "kit-dev" };
		},
		async getKernelVersion() {
			return "0.1.6";
		},
		async readContractManifest() {
			return { schema_version: 1 } as Awaited<ReturnType<KernelBridge["readContractManifest"]>>;
		},
	} as KernelBridge;
}

function kernel(): AgentKernel {
	return {
		async createSession() {
			return {
				sessionId: "us0155-session",
				async run() {},
				async steer() {},
				async abort() {},
				dispose() {},
				getRuntimeInfo() {
					return {
						sessionId: "us0155-session",
						piCodingAgentVersion: "test",
						piAiVersion: "test",
						isolationMode: "off",
						builtinTools: "disabled",
					};
				},
				subscribe() {
					return () => {};
				},
			};
		},
	} as AgentKernel;
}

function admittedIntel() {
	return createCodeIntelligenceProvider({
		repoRoot: projectRoot,
		adapter: "fake",
		docs: [
			{
				path: "src/runtime.ts",
				text: "export function createRuntimeHost() { return 1; }\n",
				language: "typescript",
			},
		],
	});
}

function source(rel: string): string {
	return readFileSync(fileURLToPath(new URL(rel, import.meta.url)), "utf8");
}

function tuiSources(): string {
	return readdirSync(tuiSrc)
		.filter((name) => name.endsWith(".ts"))
		.map((name) => readFileSync(join(tuiSrc, name), "utf8"))
		.join("\n");
}

function tempProjectRoot(): string {
	const root = mkdtempSync(join(tmpdir(), "itsm-us0155-"));
	mkdirSync(join(root, ".its-magic"), { recursive: true });
	mkdirSync(join(root, "handoffs"), { recursive: true });
	mkdirSync(join(root, "docs", "engineering"), { recursive: true });
	copyFileSync(
		join(projectRoot, ".its-magic", "config.example.json"),
		join(root, ".its-magic", "config.example.json"),
	);
	copyFileSync(
		join(projectRoot, ".its-magic", "config.json"),
		join(root, ".its-magic", "config.json"),
	);
	writeFileSync(
		join(root, "handoffs", "resume_brief.md"),
		"last_completed_phase: sprint-plan\nintended_resume_phase: execute\n",
	);
	writeFileSync(join(root, "docs", "engineering", "state.md"), "# state\n");
	return root;
}

async function host(root: string): Promise<RuntimeHost> {
	return createRuntimeHost({
		projectRoot: root,
		lifetime: "daemon",
		factories: {
			bridge,
			kernel,
			intel: () => admittedIntel(),
			store: () => createRunsStore(":memory:"),
		},
	});
}

function sampleModel(status?: Partial<OperatorStatusSnapshot>): TuiPanelModel {
	const base: OperatorStatusSnapshot = {
		schema_version: 1,
		orchestrator_run_id: OPERATOR_RUN_ID,
		story_id: "US-0155",
		sprint_id: "S0175",
		phase_id: "execute",
		role_id: "dev",
		model_id: "fake-local",
		backend_id: "local",
		app_health: { ok: false, reason_code: "APP_HEALTH_UNAVAILABLE" },
		index_health: { ok: true },
		browser_summary: { probe_count: 2, evidence_refs: ["evidence/shot.png"] },
		token_cost: { metric_source: "us-0080", total_tokens: 12, evidence_ref: null },
		sovereign: null,
		evidence_refs: [],
		read_only: true,
		...status,
	};
	return {
		phase: { phase_id: base.phase_id, role_id: base.role_id },
		status: base,
		timeline: [],
		tools: { names: [] },
	};
}

async function waitFor(label: string, predicate: () => boolean, timeoutMs = 5000): Promise<void> {
	const start = Date.now();
	while (Date.now() - start < timeoutMs) {
		if (predicate()) {
			return;
		}
		await new Promise((resolve) => setTimeout(resolve, 25));
	}
	throw new Error(`timeout: ${label}`);
}

async function withDaemon(
	fn: (ctx: {
		root: string;
		runtime: RuntimeHost;
		daemon: Awaited<ReturnType<typeof startDaemonServer>>;
	}) => Promise<void>,
): Promise<void> {
	const root = tempProjectRoot();
	const runtime = await host(root);
	const daemon = await startDaemonServer({
		projectRoot: root,
		runtime,
		skipStartupReconcile: true,
	});
	try {
		await fn({ root, runtime, daemon });
	} finally {
		await daemon.close();
		rmSync(root, { recursive: true, force: true, maxRetries: 3 });
	}
}

test("test_us0155_tui_is_daemon_client_not_a_second_runtime", async () => {
	const src = tuiSources();
	const index = source("../../apps/tui/src/index.ts");
	const build = index.slice(
		index.indexOf("export async function buildTuiModel"),
		index.indexOf("function isDirectRun"),
	);
	assert.match(src, /function runInteractiveTui/);
	assert.match(src, /resolveOperatorTransport/);
	assert.match(src, /node:readline/);
	assert.match(src, /renderPanelLayout/);
	assert.match(build, /role: "observer"/);
	assert.match(build, /setTimeout\(resolve, 200\)/);
	assert.doesNotMatch(src, /@earendil-works\/pi-coding-agent/);
	assert.doesNotMatch(src, /pi-ai|pi-tui/);
	assert.doesNotMatch(src, /WorkflowEngine|createWorkflowEngine|createRunsStore/);
	assert.match(
		source("../../apps/tui/src/panels.ts"),
		/export type TuiPanelId = "phase" \| "status" \| "timeline" \| "tools"/,
	);
	await withDaemon(async ({ root }) => {
		const once = await runInteractiveTui({
			projectRoot: root,
			isTTY: false,
			env: { ITS_MAGIC_TUI_NONINTERACTIVE: "1" },
			cols: 100,
		});
		assert.equal(once.noninteractive, true);
		assert.match(once.painted, /Phase/);
		assert.doesNotMatch(once.painted, /DAEMON_UNREACHABLE/);
	});
});

test("test_us0155_commands_stream_diagnostics_approve_cancel_pause_resume", async () => {
	assert.equal(PROTOCOL_VERSION, 1);
	assert.deepEqual(
		[...DAEMON_RPC_METHODS],
		[
			"daemon.ping",
			"daemon.hello",
			"run.start",
			"run.attach",
			"command.submit",
			"approval.respond",
			"run.cancel",
			"status.snapshot",
		],
	);
	await withDaemon(async ({ root, runtime, daemon }) => {
		const logs: string[] = [];
		const original = console.log;
		console.log = (...args: unknown[]) => {
			logs.push(args.map((item) => String(item)).join(" "));
		};
		let pausedCli: { command?: string; reason_code?: string; stop_reason?: string };
		try {
			await runCliArgv(["pause"], {
				projectRoot: root,
				host: runtime,
				env: { ITS_MAGIC_IN_PROCESS: "0" },
			});
			pausedCli = JSON.parse(logs.at(-1) ?? "{}") as typeof pausedCli;
		} finally {
			console.log = original;
		}
		assert.equal(pausedCli.command, "pause");
		assert.equal(pausedCli.reason_code, "AUTO_PAUSE_REQUEST");
		assert.equal(pausedCli.stop_reason, "pause_request");

		const session = await openInteractiveTui({ projectRoot: root, isTTY: true, cols: 100 });
		await session.ready;
		await session.submit(["not-a-command"]);
		await waitFor("failure", () => session.painted().includes("UNKNOWN_COMMAND"));
		assert.match(session.painted(), /execution_failure/);
		await session.submit(["pause"]);
		await waitFor("pause", () => session.painted().includes("AUTO_PAUSE_REQUEST"));
		assert.match(session.painted(), /gate_block/);
		assert.match(session.painted(), /pause_request/);
		await session.resume();
		await waitFor("resume", () =>
			session
				.events()
				.some(
					(event) =>
						event.payload?.command === "resume" && event.payload?.disposition === "success",
				),
		);
		daemon.requestApproval(OPERATOR_RUN_ID, "appr-155");
		await waitFor("approval requested", () =>
			session.events().some((event) => event.kind === "approval.requested"),
		);
		await session.approve();
		await waitFor("approval responded", () =>
			session.events().some((event) => event.kind === "approval.responded"),
		);
		await session.cancel();
		await waitFor("cancel", () => session.events().some((event) => event.kind === "run.cancelled"));
		const order = session.events().map((event) => event.kind);
		const attached = order.indexOf("run.attached");
		const submitted = order.lastIndexOf("command.submitted");
		assert.ok(attached >= 0);
		assert.ok(submitted > attached);
		assert.ok(order.indexOf("approval.requested") < order.indexOf("approval.responded"));
		assert.ok(order.indexOf("approval.responded") < order.indexOf("run.cancelled"));
		await session.close();
	});
});

test("test_us0155_bounded_panels_cover_operator_surfaces", async () => {
	const events = [
		{
			seq: 1,
			kind: "agent.message",
			payload: { text: "hello operator" },
		},
		{
			seq: 2,
			kind: "files.changed",
			payload: { changed_files: ["src/app.ts"] },
		},
		{
			seq: 3,
			kind: "tool.call",
			payload: { tool_name: "itsm_read" },
		},
	];
	const wide = renderInteractiveLayout(sampleModel(), 100, events);
	assert.match(wide, /Phase/);
	assert.match(wide, /Status/);
	assert.match(wide, /Timeline/);
	assert.match(wide, /Tools/);
	assert.match(wide, /itsm_read/);
	assert.match(wide, /Conversation hello operator/);
	assert.match(wide, /Changed files src\/app.ts/);
	assert.match(wide, /App\/log/);
	assert.match(wide, /APP_HEALTH_UNAVAILABLE/);
	assert.match(wide, /Browser probes=2/);
	assert.match(wide, /evidence\/shot.png/);
	assert.match(wide, /Model\/token\/cost/);
	assert.match(wide, /fake-local/);
	assert.match(wide, /tokens=12/);
	assert.deepEqual(selectVisiblePanels(40), ["phase", "status"]);
	const narrow = renderInteractiveLayout(sampleModel(), 40, events);
	assert.match(narrow, /Phase/);
	assert.match(narrow, /Status/);
	assert.doesNotMatch(narrow, /Conversation|Timeline|Tools|Changed files|Browser|Model\/token/);
	const many = Array.from(
		{ length: OPERATOR_LOG_MAX_LINES + 25 },
		(_, index) => `row-${index}`,
	).join("\n");
	const truncated = renderInteractiveLayout(sampleModel(), 120, [
		{ seq: 4, kind: "agent.message", payload: { text: many } },
	]);
	assert.match(truncated, /evidence: truncated/);
	assert.ok(truncated.split("\n").length <= OPERATOR_LOG_MAX_LINES + 8);
	const huge = "x".repeat(OPERATOR_LOG_MAX_BYTES + 100);
	const bytes = renderInteractiveLayout(sampleModel(), 120, [
		{ seq: 5, kind: "agent.message", payload: { text: huge } },
	]);
	assert.match(bytes, /evidence: truncated/);
	assert.equal(bytes.includes("x".repeat(OPERATOR_LOG_MAX_BYTES + 50)), false);
	await withDaemon(async ({ root }) => {
		const session = await openInteractiveTui({ projectRoot: root, isTTY: true, cols: 100 });
		await session.ready;
		await waitFor("runtime app panel", () => session.painted().includes("App/log"));
		session.resize(40);
		assert.doesNotMatch(session.painted(), /Conversation/);
		assert.match(session.painted(), /Phase/);
		await session.close();
	});
});

test("test_us0155_keyboard_resize_redaction_reconnect_fallback", async () => {
	assert.equal(actionForKey({ name: "return" }), "submit");
	assert.equal(actionForKey({ name: "y", ctrl: true }), "approve");
	assert.equal(actionForKey({ name: "n", ctrl: true }), "deny");
	assert.equal(actionForKey({ name: "x", ctrl: true }), "cancel");
	assert.equal(actionForKey({ name: "p", ctrl: true }), "pause");
	assert.equal(actionForKey({ name: "r", ctrl: true }), "resume");
	assert.ok(
		process.platform === "win32" || process.platform === "linux" || process.platform === "darwin",
	);
	const redacted = renderInteractiveLayout(sampleModel(), 100, [
		{ seq: 1, kind: "agent.message", payload: { text: `see ${SECRET}`, token: SECRET } },
	]);
	assert.equal(redacted.includes(SECRET), false);
	assert.match(redacted, /\[redacted\]/);

	await withDaemon(async ({ root, daemon }) => {
		const input = new PassThrough();
		const session = await openInteractiveTui({
			projectRoot: root,
			input,
			isTTY: true,
			cols: 100,
		});
		await session.ready;
		input.write("not-a-command\r");
		await waitFor("keyed submit", () => session.painted().includes("UNKNOWN_COMMAND"));
		daemon.requestApproval(OPERATOR_RUN_ID, "appr-key");
		await waitFor("pending", () =>
			session.events().some((event) => event.kind === "approval.requested"),
		);
		input.write("\x19");
		await waitFor("keyed approve", () =>
			session.events().some((event) => event.kind === "approval.responded"),
		);
		input.write("\x0e");
		input.write("\x18");
		await waitFor("keyed cancel", () =>
			session.events().some((event) => event.kind === "run.cancelled"),
		);
		input.write("\x10");
		await waitFor("keyed pause", () => session.painted().includes("pause_request"));
		input.write("\x12");
		await waitFor("keyed resume", () =>
			session.events().some((event) => event.payload?.command === "resume"),
		);
		session.resize(30);
		assert.doesNotMatch(session.painted(), /Conversation/);
		session.resize(100);
		assert.match(session.painted(), /Phase/);
		await session.submit(["not-a-command", SECRET]);
		await waitFor("secret submitted", () =>
			session.events().some((event) => event.payload?.command === "not-a-command"),
		);
		assert.equal(session.painted().includes(SECRET), false);
		const before = session.reconnects().length;
		daemon.appendSeqHole(OPERATOR_RUN_ID);
		await waitFor("reconnect", () => session.reconnects().length > before);
		assert.ok(session.reconnects().every((item) => Number.isInteger(item.after_seq)));
		await session.close();

		daemon.requestApproval(OPERATOR_RUN_ID, "appr-fallback");
		const fallback = await runInteractiveTui({
			projectRoot: root,
			isTTY: false,
			env: { ITS_MAGIC_TUI_NONINTERACTIVE: "1" },
			cols: 80,
		});
		assert.equal(fallback.noninteractive, true);
		assert.equal(fallback.reason_code, OPERATOR_INPUT_REQUIRED);
		assert.ok(fallback.frames >= 1);
		assert.match(fallback.painted, /Phase/);
	});
});

test("test_us0155_daemon_protocol_without_external_pi_session", async () => {
	const self = source("./us0155.contract.test.ts");
	const src = tuiSources();
	assert.doesNotMatch(self, /@earendil-works\/pi-coding-agent/);
	assert.doesNotMatch(src, /@earendil-works\/pi-coding-agent|pi-ai|pi-tui/);
	assert.equal(PROTOCOL_VERSION, 1);
	await withDaemon(async ({ root, daemon }) => {
		const session = await openInteractiveTui({ projectRoot: root, isTTY: true, cols: 100 });
		await session.ready;
		await session.submit(["status"]);
		await session.submit(["not-a-command", SECRET]);
		daemon.requestApproval(OPERATOR_RUN_ID, "appr-proto");
		await waitFor("proto approval", () =>
			session.events().some((event) => event.kind === "approval.requested"),
		);
		await session.deny();
		await session.cancel();
		await session.pause();
		await session.resume();
		await waitFor("proto resume", () =>
			session.events().some((event) => event.payload?.command === "resume"),
		);
		const order = session.events().map((event) => event.kind);
		assert.ok(order.indexOf("run.attached") >= 0);
		assert.ok(order.indexOf("command.submitted") > order.indexOf("run.attached"));
		assert.ok(order.indexOf("approval.requested") < order.indexOf("approval.responded"));
		assert.ok(order.includes("run.cancelled"));
		assert.equal(session.painted().includes(SECRET), false);
		assert.match(session.painted(), /\[redacted\]|UNKNOWN_COMMAND/);
		daemon.appendSeqHole(OPERATOR_RUN_ID);
		await waitFor("proto reconnect", () => session.reconnects().length > 0);
		const wide = session.painted();
		assert.match(wide, /App\/log|Phase/);
		session.resize(40);
		assert.deepEqual(selectVisiblePanels(40), ["phase", "status"]);
		assert.doesNotMatch(session.painted(), /Conversation/);
		session.resize(96);
		assert.ok(selectVisiblePanels(96).length > selectVisiblePanels(40).length);
		await session.close();
	});
});
