import assert from "node:assert/strict";
import { copyFileSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { createCodeIntelligenceProvider } from "@its-magic/code-intelligence";
import type { KernelBridge } from "@its-magic/kernel-bridge";
import type { AgentKernel } from "@its-magic/pi-kernel";
import { DAEMON_RPC_METHODS, PROTOCOL_VERSION } from "@its-magic/protocol";
import {
	createRunsStore,
	OPERATOR_RUN_ID,
	type OperatorCommandResult,
} from "@its-magic/runtime-core";
import { createRuntimeHost, type RuntimeHost } from "@its-magic/runtime-host";
import { runCliArgv } from "../../apps/cli/src/run.ts";
import { startDaemonServer } from "../../apps/daemon/src/server.ts";
import { buildTuiModel } from "../../apps/tui/src/index.ts";
import { TUI_COLLAPSE_ORDER as panelOrder } from "../../apps/tui/src/panels.ts";

const projectRoot = fileURLToPath(new URL("../../..", import.meta.url));

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
				sessionId: "us0151-session",
				async run() {},
				async steer() {},
				async abort() {},
				dispose() {},
				getRuntimeInfo() {
					return {
						sessionId: "us0151-session",
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

function tempProjectRoot(): string {
	const root = mkdtempSync(join(tmpdir(), "itsm-us0151-"));
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

async function host(
	root: string,
	intel = admittedIntel(),
	fileStore = false,
): Promise<RuntimeHost> {
	return createRuntimeHost({
		projectRoot: root,
		lifetime: "daemon",
		factories: {
			bridge,
			kernel,
			intel: () => intel,
			store: fileStore ? (path) => createRunsStore(path) : () => createRunsStore(":memory:"),
		},
	});
}

async function captureCli(
	argv: string[],
	runtime: RuntimeHost,
	env?: NodeJS.ProcessEnv,
): Promise<{ code: number; body: OperatorCommandResult }> {
	const logs: string[] = [];
	const original = console.log;
	console.log = (...args: unknown[]) => {
		logs.push(args.map((item) => String(item)).join(" "));
	};
	try {
		const code = await runCliArgv(argv, {
			projectRoot: runtime.projectRoot,
			host: runtime,
			env: { ITS_MAGIC_IN_PROCESS: "0", ITS_MAGIC_REQUIRE_DAEMON: "0", ...env },
		});
		const raw = logs.at(-1) ?? "{}";
		return { code, body: JSON.parse(raw) as OperatorCommandResult };
	} finally {
		console.log = original;
	}
}

test("test_us0151_cli_tui_daemon_share_resolved_transport", async () => {
	const cli = source("../../apps/cli/src/run.ts");
	const tui = source("../../apps/tui/src/index.ts");
	assert.match(cli, /const transport = await resolveOperatorTransport/);
	assert.match(cli, /transport\.submitCommand/);
	assert.match(cli, /dispatchItsmCommand/);
	assert.match(cli, /OperatorCommandFacade/);
	assert.doesNotMatch(cli, /createRunsStore\(":memory:"\)/);
	assert.doesNotMatch(tui, /createRunsStore\(":memory:"\)/);
	assert.match(tui, /const transport = await resolveOperatorTransport/);
	assert.match(tui, /statusSnapshot\(/);
	assert.deepEqual([...panelOrder], ["phase", "status", "timeline", "tools"]);

	const root = tempProjectRoot();
	try {
		const runtime = await host(root);
		const daemon = await startDaemonServer({
			projectRoot: root,
			runtime,
			skipStartupReconcile: true,
		});
		const submitted = await captureCli(["status"], runtime);
		assert.equal(submitted.code, 0);
		assert.equal(submitted.body.command, "status");
		assert.equal("ok" in submitted.body, false);
		assert.ok(submitted.body.snapshot);
		const audited = runtime.store.listAudit(OPERATOR_RUN_ID);
		assert.equal(audited.length, 1);
		assert.equal(audited[0]?.event, "command.submitted");
		const model = await buildTuiModel(root);
		assert.ok(model.timeline.length >= 1);
		assert.ok(model.timeline.every((entry) => entry.outcome !== "DAEMON_UNREACHABLE"));
		assert.ok(
			model.timeline.some((entry) =>
				entry.evidence_refs.some((ref) => ref.startsWith("daemon-event:")),
			),
		);
		await daemon.close();
	} finally {
		rmSync(root, { recursive: true, force: true, maxRetries: 3 });
	}
});

test("test_us0151_lifecycle_persists_success_gate_or_failure", async () => {
	const root = tempProjectRoot();
	try {
		const runtime = await host(root);
		const daemon = await startDaemonServer({
			projectRoot: root,
			runtime,
			skipStartupReconcile: true,
		});
		const executed = await captureCli(["execute"], runtime);
		assert.equal(executed.body.disposition, "success");
		assert.equal("ok" in executed.body, false);
		assert.equal("plan" in executed.body, false);
		const successAudit = runtime.store
			.listAudit(OPERATOR_RUN_ID)
			.map((row) => JSON.parse(row.payload) as { disposition?: string });
		assert.ok(successAudit.some((row) => row.disposition === "success"));

		runtime.config.shared.AUTO_PAUSE_REQUEST = "1";
		const blocked = await captureCli(["auto"], runtime);
		assert.equal(blocked.body.disposition, "gate_block");
		assert.equal("ok" in blocked.body, false);
		assert.notEqual(blocked.body.disposition, "success");

		const failed = await captureCli(["not-a-command"], runtime);
		assert.equal(failed.code, 1);
		assert.equal(failed.body.disposition, "execution_failure");
		assert.equal("ok" in failed.body, false);
		const dispositions = runtime.store
			.listAudit(OPERATOR_RUN_ID)
			.map((row) => (JSON.parse(row.payload) as { disposition?: string }).disposition)
			.filter((item) => item !== undefined);
		assert.ok(dispositions.includes("success"));
		assert.ok(dispositions.includes("gate_block"));
		assert.ok(dispositions.includes("execution_failure"));
		await daemon.close();
	} finally {
		rmSync(root, { recursive: true, force: true, maxRetries: 3 });
	}
});

test("test_us0151_auto_resume_crash_uses_workflow_and_store", async () => {
	const serverSrc = source("../../apps/daemon/src/server.ts");
	const submitAt = serverSrc.indexOf('method === "command.submit"');
	const approvalAt = serverSrc.indexOf('method === "approval.respond"');
	const submitBlock = serverSrc.slice(submitAt, approvalAt);
	assert.match(submitBlock, /executeOperatorCommand/);
	assert.doesNotMatch(submitBlock, /createWorkflowEngine/);
	assert.match(serverSrc, /crashResume/);
	assert.match(serverSrc, /readRepoResume/);
	assert.equal(serverSrc.split("createWorkflowEngine(").length - 1, 1);

	const root = tempProjectRoot();
	try {
		const first = await host(root, admittedIntel(), true);
		const daemon = await startDaemonServer({
			projectRoot: root,
			runtime: first,
			skipStartupReconcile: true,
		});
		const before = daemon.workflowEngineCount();
		await captureCli(["status"], first);
		await captureCli(["execute"], first);
		assert.equal(daemon.workflowEngineCount(), before);
		const storePath = first.store.path;
		const beforeAudit = first.store.listAudit(OPERATOR_RUN_ID).length;
		assert.ok(beforeAudit >= 2);
		await daemon.close();

		const second = await host(root, admittedIntel(), true);
		assert.equal(second.store.path, storePath);
		assert.equal(second.store.listAudit(OPERATOR_RUN_ID).length, beforeAudit);
		const restarted = await startDaemonServer({
			projectRoot: root,
			runtime: second,
			skipStartupReconcile: true,
		});
		const resumed = await captureCli(["resume"], second);
		assert.equal(resumed.body.disposition, "success");
		assert.equal(resumed.body.command, "resume");
		assert.equal("ok" in resumed.body, false);
		assert.ok(second.store.listAudit(OPERATOR_RUN_ID).length > beforeAudit);
		await restarted.close();
	} finally {
		rmSync(root, { recursive: true, force: true, maxRetries: 3 });
	}
});

test("test_us0151_ask_index_app_browser_admit_or_fail_closed", async () => {
	const executor = source("../../packages/runtime-core/src/operator/operator-executor.ts");
	assert.doesNotMatch(executor, /AppRuntime/);
	assert.doesNotMatch(executor, /createBrowser|CdpAdapter|IsolatedDriver/);

	const root = tempProjectRoot();
	try {
		const intel = admittedIntel();
		const runtime = await host(root, intel);
		const daemon = await startDaemonServer({
			projectRoot: root,
			runtime,
			skipStartupReconcile: true,
		});
		const asked = await captureCli(["ask", "createRuntimeHost"], runtime);
		assert.equal(asked.body.disposition, "success");
		assert.ok((asked.body.hits?.length ?? 0) > 0);
		const indexed = await captureCli(["index"], runtime);
		assert.equal(indexed.body.disposition, "success");

		intel.setAvailability({ index: "unavailable" });
		const askDown = await captureCli(["ask", "createRuntimeHost"], runtime);
		const indexDown = await captureCli(["index"], runtime);
		for (const body of [askDown.body, indexDown.body]) {
			assert.equal(body.disposition, "execution_failure");
			assert.ok(
				body.reason_code === "INTEL_INDEX_UNAVAILABLE" || body.reason_code === "INDEX_UNAVAILABLE",
			);
			assert.equal("ok" in body, false);
		}

		const app = await captureCli(["app"], runtime);
		const browser = await captureCli(["browser"], runtime);
		assert.equal(app.body.reason_code, "APP_HEALTH_UNAVAILABLE");
		assert.equal(browser.body.reason_code, "BROWSER_UNAVAILABLE");
		assert.equal("ok" in app.body, false);
		assert.equal("ok" in browser.body, false);
		assert.notEqual(app.body.disposition, "success");
		assert.notEqual(browser.body.disposition, "success");
		await daemon.close();
	} finally {
		rmSync(root, { recursive: true, force: true, maxRetries: 3 });
	}
});

test("test_us0151_attach_and_tui_replay_daemon_events", async () => {
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
	const panels = source("../../apps/tui/src/panels.ts");
	assert.match(panels, /export type TuiPanelId = "phase" \| "status" \| "timeline" \| "tools"/);
	assert.match(
		panels,
		/TUI_COLLAPSE_ORDER: readonly TuiPanelId\[] = \["phase", "status", "timeline", "tools"\]/,
	);

	const empty = tempProjectRoot();
	try {
		const missing = await buildTuiModel(empty);
		assert.equal(missing.timeline[0]?.outcome, "DAEMON_UNREACHABLE");
		assert.ok(missing.status.evidence_refs.includes("DAEMON_UNREACHABLE"));
	} finally {
		rmSync(empty, { recursive: true, force: true, maxRetries: 3 });
	}

	const root = tempProjectRoot();
	try {
		const runtime = await host(root);
		const daemon = await startDaemonServer({
			projectRoot: root,
			runtime,
			skipStartupReconcile: true,
		});
		const executed = await captureCli(["execute"], runtime);
		assert.equal(executed.body.disposition, "success");
		const model = await buildTuiModel(root);
		assert.ok(model.timeline.some((entry) => entry.outcome === "success"));
		assert.ok(
			model.timeline.some((entry) =>
				entry.evidence_refs.includes("daemon-event:command.submitted"),
			),
		);
		assert.equal(model.phase.phase_id, model.status.phase_id);
		await daemon.close();
	} finally {
		rmSync(root, { recursive: true, force: true, maxRetries: 3 });
	}
});

test("test_us0151_e2e_execute_gate_restart_replay_attach", async () => {
	const root = tempProjectRoot();
	try {
		const first = await host(root, admittedIntel(), true);
		const daemon = await startDaemonServer({
			projectRoot: root,
			runtime: first,
			skipStartupReconcile: true,
		});
		const engines = daemon.workflowEngineCount();
		const executed = await captureCli(["execute"], first);
		assert.equal(executed.body.disposition, "success");
		assert.equal("ok" in executed.body, false);
		first.config.shared.AUTO_PAUSE_REQUEST = "1";
		const blocked = await captureCli(["quick"], first);
		assert.equal(blocked.body.disposition, "gate_block");
		assert.equal(daemon.workflowEngineCount(), engines);
		const before = first.store.listAudit(OPERATOR_RUN_ID).length;
		await daemon.close();

		const second = await host(root, admittedIntel(), true);
		const restarted = await startDaemonServer({
			projectRoot: root,
			runtime: second,
			skipStartupReconcile: true,
		});
		assert.equal(second.store.listAudit(OPERATOR_RUN_ID).length, before);
		const resumed = await captureCli(["resume"], second);
		assert.equal(resumed.body.disposition, "success");
		const model = await buildTuiModel(root);
		assert.ok(model.timeline.some((entry) => entry.outcome === "success"));
		assert.ok(model.timeline.some((entry) => entry.outcome === "gate_block"));
		assert.equal(
			model.timeline.some((entry) => entry.outcome === "DAEMON_UNREACHABLE"),
			false,
		);
		await restarted.close();
	} finally {
		rmSync(root, { recursive: true, force: true, maxRetries: 3 });
	}
});
