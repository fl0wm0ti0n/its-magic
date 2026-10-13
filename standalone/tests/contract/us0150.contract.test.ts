import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { copyFileSync, mkdirSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { createCodeIntelligenceProvider } from "@its-magic/code-intelligence";
import { looksLikeSecret } from "@its-magic/config";
import { computePackContentHash } from "@its-magic/context-engine";
import type { KernelBridge } from "@its-magic/kernel-bridge";
import { type AgentKernel, getLoaderSnapshot, getRegisteredToolNames } from "@its-magic/pi-kernel";
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

async function host(capture?: { tools: string[] }) {
	return createRuntimeHost({
		projectRoot,
		lifetime: "direct-cli",
		factories: {
			bridge,
			kernel: () => kernel(capture),
			intel: () => admittedIntel(),
			store: () => createRunsStore(":memory:"),
		},
	});
}

function sha256File(path: string): string {
	return createHash("sha256").update(readFileSync(path)).digest("hex");
}

function source(rel: string): string {
	return readFileSync(fileURLToPath(new URL(rel, import.meta.url)), "utf8");
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
	assert.equal(runtime.contextPack.content_hash, computePackContentHash(runtime.contextPack));
	assert.match(runtime.contextPack.content_hash, /^[a-f0-9]{64}$/);
	const hostSrc = source("../../packages/runtime-host/src/index.ts");
	assert.match(hostSrc, /codeContext\(/);
	assert.doesNotMatch(hostSrc, /persistContextPack/);
	await assert.rejects(
		createRuntimeHost({
			projectRoot,
			lifetime: "direct-cli",
			factories: {
				bridge,
				kernel,
				store: () => createRunsStore(":memory:"),
				intel: () =>
					createCodeIntelligenceProvider({
						repoRoot: projectRoot,
						adapter: "fake",
						docs: [],
						availability: { index: "unavailable" },
					}),
			},
		}),
		(error: unknown) =>
			error instanceof RuntimeHostError && error.code === "RUNTIME_SERVICE_UNAVAILABLE",
	);
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
	assert.ok(capture.tools.every((name) => name.startsWith("itsm_")));
	assert.equal(capture.tools.includes("itsm_browser"), false);
	assert.ok(routed.session.kernel_session_id);
	assert.equal(routed.role_id, "scout");
	assert.equal(routed.session.fresh, true);
	const attestations = runtime.supervisor.assertAttestations(routed.session.kernel_session_id);
	assert.equal(attestations.length, 2);
	assert.equal(attestations[0]?.fresh, true);
	assert.equal(attestations[0]?.role_id, "scout");
	assert.equal(attestations[0]?.model_id, "test-model");
	assert.equal(routed.context_pack_hash, runtime.contextPack.content_hash);
	assert.equal(typeof runtime.config.model.catalog_handle, "string");
	const live = runtime.supervisor.getLive(routed.session.kernel_session_id);
	assert.equal(live?.getRuntimeInfo().builtinTools, "disabled");
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
		const serverSrc = source("../../apps/daemon/src/server.ts");
		const resumeAt = serverSrc.indexOf("const resumeConfig");
		const reconcileAt = serverSrc.indexOf("reconcileOperationalLedger({");
		assert.ok(resumeAt >= 0 && reconcileAt > resumeAt);
		const resumeBlock = serverSrc.slice(resumeAt, reconcileAt);
		assert.match(resumeBlock, /deps\.runtime \? deps\.runtime\.config : \{\}/);
		assert.match(resumeBlock, /config: resumeConfig/);
		assert.doesNotMatch(resumeBlock, /config:\s*\{\}/);
		for (const rel of ["../../apps/cli/src/index.ts", "../../apps/daemon/src/index.ts"]) {
			const entry = source(rel);
			assert.match(entry, /createRuntimeHost\(/);
			assert.match(entry, /\.dispose\(/);
			assert.doesNotMatch(entry, /config:\s*\{\}/);
			assert.doesNotMatch(entry, /factories\s*:/);
		}
	} finally {
		rmSync(root, { recursive: true, force: true });
	}
});

test("test_us0150_bridge_validator_and_operational_store_preserve_artifact_authority", async () => {
	const runtime = await host();
	assert.equal(runtime.router.listCommands().includes("qa"), true);
	const tables = runtime.store.tableNames();
	assert.equal(tables.includes("runs"), true);
	assert.equal(tables.includes("sessions"), true);
	assert.equal(tables.includes("audit"), true);
	assert.equal(tables.includes("index_meta"), true);
	const operational = new Set(["runs", "sessions", "audit", "process_handles", "index_meta"]);
	for (const name of tables) {
		assert.equal(operational.has(name), true, name);
	}
	assert.equal(looksLikeSecret(JSON.stringify(runtime.provenance)), false);
	assert.equal(runtime.contextPack.content_hash, computePackContentHash(runtime.contextPack));
	runtime.store.insertRun({
		id: "us0150-false-complete",
		phase_id: "execute",
		status: "PASS",
		claimed_complete: 1,
		created_at: "2026-10-11T00:00:00Z",
	});
	assert.throws(() =>
		runtime.store.assertRepoCanonical({
			backlog_status: "OPEN",
			acceptance_done: false,
			sprint_done: false,
		}),
	);
	const artifact = join(projectRoot, "package.json");
	const before = sha256File(artifact);
	await runtime.dispose();
	await runtime.dispose();
	assert.equal(sha256File(artifact), before);
	assert.equal(runtime.disposed, true);
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
	assert.ok(
		runtime.toolBroker.audit
			.records()
			.some((row) => row.tool === "itsm_read" && row.decision === "ALLOW"),
	);
	const denied = await read.execute("tool-2", { path: "../outside" });
	assert.equal((denied.details as { denied?: boolean }).denied, true);
	assert.doesNotMatch(denied.content[0].text, /^ok:/);
	const devTools = runtime.toolBroker.ownedToolsFor({
		role_id: "dev",
		phase_id: "execute",
		worktree_root: projectRoot,
		cwd: projectRoot,
		run_id: "us0150-run",
		kernel_session_id: "us0150-session",
	});
	for (const name of ["itsm_edit", "itsm_shell", "itsm_git"] as const) {
		const tool = devTools.find((item) => item.name === name);
		assert.ok(tool, name);
		const outcome = await tool.execute("tool-3", {
			path: "package.json",
			command: "status",
		});
		assert.doesNotMatch(outcome.content[0].text, /^ok:/);
		const details = outcome.details as { policy?: string; denied?: boolean };
		assert.ok(details.policy === "ALLOW" || details.denied === true);
	}
	const search = tools.find((tool) => tool.name === "itsm_search");
	assert.ok(search);
	const intel = await search.execute("tool-4", { query: "createRuntimeHost" });
	assert.doesNotMatch(intel.content[0].text, /^ok:/);
	assert.equal(
		[...tools, ...devTools].some(
			(tool) => tool.name === "itsm_browser" || tool.name.startsWith("itsm_app_"),
		),
		false,
	);
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
	await assert.rejects(
		createRuntimeHost({
			projectRoot,
			lifetime: "direct-cli",
			factories: {
				bridge: () =>
					({
						async locateProjectKernel() {
							return { kernelRoot: projectRoot, locateMode: "kit-dev" };
						},
						async getKernelVersion() {
							return "0.1.6";
						},
						async readContractManifest() {
							return { schema_version: 0 };
						},
					}) as unknown as KernelBridge,
			},
		}),
		(error: unknown) =>
			error instanceof RuntimeHostError && error.code === "RUNTIME_BRIDGE_UNAVAILABLE",
	);
	const artifact = join(projectRoot, "package.json");
	const before = sha256File(artifact);
	const runtime = await createRuntimeHost({ projectRoot, lifetime: "direct-cli" });
	assert.equal(runtime.lifetime, "direct-cli");
	assert.equal(runtime.contextPack.content_hash, computePackContentHash(runtime.contextPack));
	assert.equal(looksLikeSecret(JSON.stringify(runtime.provenance)), false);
	const routed = await runtime.router.route("ask", {
		orchestrator_run_id: "us0150-production-pi",
		model_id: "deterministic-local-model",
	});
	assert.equal(routed.ok, true);
	if (!("session" in routed)) {
		assert.fail("ask must create a production Pi session");
	}
	assert.equal(routed.role_id, "scout");
	assert.equal(routed.session.fresh, true);
	const attestations = runtime.supervisor.assertAttestations(routed.session.kernel_session_id);
	assert.ok(attestations.length >= 1);
	assert.equal(attestations[0]?.fresh, true);
	assert.equal(attestations[0]?.model_id, "deterministic-local-model");
	assert.equal(routed.context_pack_hash, runtime.contextPack.content_hash);
	assert.equal(typeof runtime.config.model.catalog_handle, "string");
	const session = runtime.supervisor.getLive(routed.session.kernel_session_id);
	assert.ok(session);
	assert.equal(session.getRuntimeInfo().builtinTools, "disabled");
	const names = getRegisteredToolNames(session);
	assert.ok(names.includes("itsm_read"));
	assert.ok(names.every((name) => name.startsWith("itsm_")));
	assert.equal(names.includes("itsm_browser"), false);
	const loader = getLoaderSnapshot(session);
	assert.equal(loader.extensionCount, 0);
	assert.equal(loader.agentsFileCount, 0);
	assert.equal(loader.skillCount, 0);
	assert.equal(loader.promptCount, 0);
	await runtime.dispose();
	await runtime.dispose();
	assert.equal(runtime.disposed, true);
	assert.equal(sha256File(artifact), before);
});
