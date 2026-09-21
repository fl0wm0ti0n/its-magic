import assert from "node:assert/strict";
import { copyFileSync, mkdirSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import type { KernelBridge } from "@its-magic/kernel-bridge";
import { type AgentKernel, getRegisteredToolNames } from "@its-magic/pi-kernel";
import { createRunsStore } from "@its-magic/runtime-core";
import { createRuntimeHost, RuntimeHostError } from "@its-magic/runtime-host";
import { runCliArgv } from "../../apps/cli/src/run.ts";
import { startDaemonServer } from "../../apps/daemon/src/server.ts";

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

function kernel(capture?: { tools: string[] }): AgentKernel {
	return {
		async createSession(options) {
			capture?.tools.push(...(options?.ownedTools?.map((tool) => tool.name) ?? []));
			return {
				sessionId: "us0150-session",
				async run() {},
				async steer() {},
				async abort() {},
				dispose() {},
				getRuntimeInfo() {
					return {
						sessionId: "us0150-session",
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
	};
}

async function host(capture?: { tools: string[] }) {
	return createRuntimeHost({
		projectRoot,
		lifetime: "direct-cli",
		factories: {
			bridge,
			kernel: () => kernel(capture),
			store: () => createRunsStore(":memory:"),
		},
	});
}

function tempProjectRoot(): string {
	const root = mkdtempSync(join(tmpdir(), "itsm-us0150-"));
	mkdirSync(join(root, ".its-magic"), { recursive: true });
	copyFileSync(
		join(projectRoot, ".its-magic", "config.example.json"),
		join(root, ".its-magic", "config.example.json"),
	);
	copyFileSync(
		join(projectRoot, ".its-magic", "config.json"),
		join(root, ".its-magic", "config.json"),
	);
	return root;
}

test("test_us0150_runtime_host_resolves_one_config_and_builds_graph", async () => {
	const runtime = await host();
	assert.equal(runtime.projectRoot, projectRoot);
	assert.equal(runtime.config.schema_version, 1);
	assert.equal(runtime.store.path, ":memory:");
	await runtime.dispose();
});

test("test_us0150_host_creates_fresh_attested_custom_tool_session", async () => {
	const capture = { tools: [] as string[] };
	const runtime = await host(capture);
	const routed = await runtime.router.route("ask", {
		orchestrator_run_id: "us0150-run",
		model_id: "test-model",
	});
	assert.equal(routed.ok, true);
	if (!("session" in routed)) {
		assert.fail("ask must create a session");
	}
	assert.ok(capture.tools.length > 0);
	assert.ok(routed.session.kernel_session_id);
	assert.equal(runtime.supervisor.assertAttestations(routed.session.kernel_session_id).length, 2);
	await runtime.dispose();
});

test("test_us0150_cli_and_daemon_use_runtime_host_not_throwing_kernel", async () => {
	const root = tempProjectRoot();
	try {
		const runtime = await createRuntimeHost({
			projectRoot: root,
			lifetime: "daemon",
			factories: { bridge, kernel, store: () => createRunsStore(":memory:") },
		});
		assert.equal(await runCliArgv(["status"], { projectRoot: root, host: runtime }), 0);
		const daemon = await startDaemonServer({
			projectRoot: root,
			runtime,
			skipStartupReconcile: true,
		});
		await daemon.close();
		assert.equal(runtime.disposed, true);
	} finally {
		rmSync(root, { recursive: true, force: true });
	}
});

test("test_us0150_bridge_validator_and_operational_store_preserve_artifact_authority", async () => {
	const runtime = await host();
	assert.equal(runtime.router.listCommands().includes("qa"), true);
	assert.equal(runtime.store.tableNames().includes("runs"), true);
	await runtime.dispose();
});

test("test_us0150_admitted_tool_executes_or_denies_without_placeholder_success", async () => {
	const runtime = await host();
	const tools = runtime.toolBroker.ownedToolsFor({
		role_id: "scout",
		phase_id: "ask",
		worktree_root: projectRoot,
		cwd: projectRoot,
		run_id: "us0150-run",
		kernel_session_id: "us0150-session",
	});
	const read = tools.find((tool) => tool.name === "itsm_read");
	assert.ok(read);
	const result = await read.execute("tool-1", { path: "package.json" });
	assert.equal((result.details as { policy?: string }).policy, "ALLOW");
	assert.doesNotMatch(result.content[0].text, /^ok:/);
	await runtime.dispose();
});

test("test_us0150_production_composition_unavailable_services_and_disposal", async () => {
	await assert.rejects(
		createRuntimeHost({
			projectRoot,
			lifetime: "direct-cli",
			factories: {
				bridge: () => {
					throw new Error("secret bridge detail");
				},
			},
		}),
		(error: unknown) =>
			error instanceof RuntimeHostError &&
			error.code === "RUNTIME_BRIDGE_UNAVAILABLE" &&
			error.message === "RUNTIME_BRIDGE_UNAVAILABLE",
	);
	await assert.rejects(
		createRuntimeHost({
			projectRoot,
			lifetime: "direct-cli",
			factories: {
				bridge,
				kernel: () => {
					throw new Error("kernel detail");
				},
			},
		}),
		(error: unknown) =>
			error instanceof RuntimeHostError &&
			error.code === "RUNTIME_KERNEL_ADMISSION_FAILED" &&
			error.message === "RUNTIME_KERNEL_ADMISSION_FAILED",
	);
	await assert.rejects(
		createRuntimeHost({
			projectRoot,
			lifetime: "direct-cli",
			factories: {
				bridge,
				intel: () => {
					throw new Error("intel detail");
				},
			},
		}),
		(error: unknown) =>
			error instanceof RuntimeHostError &&
			error.code === "RUNTIME_SERVICE_UNAVAILABLE" &&
			error.message === "RUNTIME_SERVICE_UNAVAILABLE",
	);
	const runtime = await createRuntimeHost({ projectRoot, lifetime: "direct-cli" });
	assert.equal(runtime.lifetime, "direct-cli");
	const routed = await runtime.router.route("ask", {
		orchestrator_run_id: "us0150-production-pi",
		model_id: "deterministic-local-model",
	});
	assert.equal(routed.ok, true);
	if (!("session" in routed)) {
		assert.fail("ask must create a production Pi session");
	}
	const session = runtime.supervisor.getLive(routed.session.kernel_session_id);
	assert.ok(session);
	assert.equal(session.getRuntimeInfo().builtinTools, "disabled");
	assert.ok(getRegisteredToolNames(session).includes("itsm_read"));
	await runtime.dispose();
	await runtime.dispose();
	assert.equal(runtime.disposed, true);
});
