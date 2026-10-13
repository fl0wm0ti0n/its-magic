import assert from "node:assert/strict";
import { copyFileSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { createServer } from "node:http";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import {
	assertEvidenceComplete,
	BROWSER_CREDENTIAL_FORBIDDEN,
	BROWSER_EVIDENCE_GAP,
	BROWSER_UNAVAILABLE,
	type BrowserDriver,
	type BrowserSession,
	createBrowserUat,
	FakeBrowserDriver,
	PlaywrightIsolatedDriver,
	UAT_PROBE_PASS,
	writeEvidence,
} from "@its-magic/browser-uat";
import { createCodeIntelligenceProvider } from "@its-magic/code-intelligence";
import type { KernelBridge } from "@its-magic/kernel-bridge";
import type { AgentKernel } from "@its-magic/pi-kernel";
import {
	createOperatorCommandFacade,
	createOperatorObservabilityService,
	createRunsStore,
	createWorkflowEngine,
	executeOperatorCommand,
	OPERATOR_RUN_ID,
	type OperatorCommandResult,
	RELEASE_GATE_ORDER,
	RELEASE_UAT_FAILED,
} from "@its-magic/runtime-core";
import { createRuntimeHost, type RuntimeHost, readHostAppHealth } from "@its-magic/runtime-host";
import { runCliArgv } from "../../apps/cli/src/run.ts";
import { startDaemonServer } from "../../apps/daemon/src/server.ts";

const projectRoot = fileURLToPath(new URL("../../..", import.meta.url));

function source(rel: string): string {
	return readFileSync(fileURLToPath(new URL(rel, import.meta.url)), "utf8");
}

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
				sessionId: "us0152-session",
				async run() {},
				async steer() {},
				async abort() {},
				dispose() {},
				getRuntimeInfo() {
					return {
						sessionId: "us0152-session",
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

function tempProjectRoot(): string {
	const root = mkdtempSync(join(tmpdir(), "itsm-us0152-"));
	mkdirSync(join(root, ".its-magic"), { recursive: true });
	mkdirSync(join(root, "handoffs"), { recursive: true });
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
	return root;
}

async function host(root: string): Promise<RuntimeHost> {
	return createRuntimeHost({
		projectRoot: root,
		lifetime: "direct-cli",
		env: {},
		factories: {
			bridge,
			kernel,
			intel: () => admittedIntel(),
			store: () => createRunsStore(":memory:"),
		},
	});
}

class ByteDriver implements BrowserDriver {
	kind: "playwright" = "playwright";
	readonly launches: number[] = [];

	async launch(): Promise<BrowserSession> {
		this.launches.push(1);
		return {
			id: "byte-1",
			backend: "isolated",
			closed: false,
			disconnected: false,
			alive: true,
			headless: true,
			cookiesIsolated: true,
		};
	}

	async newContext(session: BrowserSession): Promise<BrowserSession> {
		return session;
	}

	async close(): Promise<void> {}

	async connectOverCDP(): Promise<BrowserSession> {
		throw new Error("cdp-unused");
	}

	async disconnect(): Promise<void> {}
}

function handoff(url: string) {
	return {
		connect_endpoint: url,
		health_path: "/health",
		service_id: "app-1",
		container_id: "",
		env_refs: [] as string[],
		url,
		ports: [1],
		health: "ok",
	};
}

function healthyApp(url: string) {
	const calls = { start: 0, health: 0, restart: 0 };
	return {
		calls,
		async start() {
			calls.start += 1;
			return { id: "app-1", url };
		},
		async health() {
			calls.health += 1;
			return { ok: true, health: "ok" };
		},
		async restart() {
			calls.restart += 1;
			return { id: "app-1", url };
		},
		getRestartMax() {
			return 3;
		},
		logs() {
			return ["ready"];
		},
		async cleanup() {
			return {};
		},
		snapshotHealth() {
			return { ok: true };
		},
	};
}

function gateEngine(
	root: string,
	app: ReturnType<typeof healthyApp>,
	browser: ReturnType<typeof createBrowserUat>,
) {
	return createWorkflowEngine({
		supervisor: runtimeSupervisor(),
		config: {},
		app,
		browser,
		evidenceRoot: root,
	});
}

function runtimeSupervisor(): RuntimeHost["supervisor"] {
	return {
		async discardOrphans() {
			return [];
		},
		async spawn() {
			throw new Error("spawn-unused");
		},
	} as unknown as RuntimeHost["supervisor"];
}

async function captureCli(
	argv: string[],
	runtime: RuntimeHost,
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
			env: { ITS_MAGIC_IN_PROCESS: "0", ITS_MAGIC_REQUIRE_DAEMON: "0" },
		});
		return { code, body: JSON.parse(logs.at(-1) ?? "{}") as OperatorCommandResult };
	} finally {
		console.log = original;
	}
}

test("test_us0152_host_owns_app_runtime_and_browser_uat", async () => {
	const hostSrc = source("../../packages/runtime-host/src/index.ts");
	assert.match(hostSrc, /createAppRuntime\(/);
	assert.match(hostSrc, /createBrowserUat\(\{[\s\S]*new PlaywrightIsolatedDriver\(\)/);
	assert.doesNotMatch(hostSrc, /FakeBrowserDriver/);
	const disposeAt = hostSrc.indexOf("const dispose");
	const dispose = hostSrc.slice(disposeAt, hostSrc.indexOf("return {", disposeAt));
	const cleanupAt = dispose.indexOf(".cleanup(");
	const teardownAt = dispose.indexOf(".teardown(");
	const closeAt = dispose.indexOf(".close(");
	assert.ok(cleanupAt >= 0 && teardownAt > cleanupAt && closeAt > teardownAt);

	const root = tempProjectRoot();
	try {
		const runtime = await host(root);
		assert.equal(typeof runtime.app.cleanup, "function");
		assert.ok(runtime.browser.driver instanceof PlaywrightIsolatedDriver);
		assert.equal(runtime.browser.driver.kind, "playwright");
		const events: string[] = [];
		const cleanup = runtime.app.cleanup.bind(runtime.app);
		runtime.app.cleanup = async (reason) => {
			events.push("app");
			return cleanup(reason);
		};
		const teardown = runtime.browser.teardown.bind(runtime.browser);
		runtime.browser.teardown = async () => {
			events.push("browser");
			return teardown();
		};
		const close = runtime.store.close.bind(runtime.store);
		runtime.store.close = () => {
			events.push("store");
			return close();
		};
		await runtime.dispose();
		assert.deepEqual(events, ["app", "browser", "store"]);
		assert.equal(runtime.disposed, true);

		const daemonSrc = source("../../apps/daemon/src/server.ts");
		const cliSrc = source("../../apps/cli/src/run.ts");
		assert.match(daemonSrc, /app: deps\.runtime\?\.app/);
		assert.match(daemonSrc, /browser: deps\.runtime\?\.browser/);
		assert.match(daemonSrc, /appService: deps\.runtime\?\.app/);
		assert.match(daemonSrc, /browserService: deps\.runtime\?\.browser/);
		assert.match(cliSrc, /app: host\.app/);
		assert.match(cliSrc, /browser: host\.browser/);
		assert.equal(daemonSrc.split("createWorkflowEngine(").length - 1, 1);
	} finally {
		rmSync(root, { recursive: true, force: true, maxRetries: 3 });
	}
});

test("test_us0152_production_driver_is_isolated_or_unavailable", async () => {
	const defaults = createBrowserUat();
	assert.ok(defaults.driver instanceof FakeBrowserDriver);
	assert.equal(defaults.driver.kind, "fake");

	const root = tempProjectRoot();
	try {
		const runtime = await host(root);
		assert.ok(runtime.browser.driver instanceof PlaywrightIsolatedDriver);
		await assert.rejects(
			() => runtime.browser.driver.launch(),
			(err: unknown) => {
				assert.equal((err as { reason_code?: string }).reason_code, BROWSER_UNAVAILABLE);
				return true;
			},
		);
		const fakeDir = mkdtempSync(join(tmpdir(), "itsm-us0152-fake-"));
		const fake = createBrowserUat({ driver: new FakeBrowserDriver(), evidenceDir: fakeDir });
		await fake.perform({ action: "snapshot", url: "http://127.0.0.1/" });
		const fakeShot = fakeDir && join(fakeDir, ".its-magic", "runtime", "browser-evidence");
		const fakeText = readFileSync(join(fakeShot, `${fake.session?.id}-shot.txt`), "utf8");
		assert.equal(fakeText, "screenshot-placeholder");

		const byteDir = mkdtempSync(join(tmpdir(), "itsm-us0152-byte-"));
		const bytes = createBrowserUat({ driver: new ByteDriver(), evidenceDir: byteDir });
		await bytes.perform({ action: "snapshot", url: "http://127.0.0.1/" });
		const shot = readFileSync(
			join(byteDir, ".its-magic", "runtime", "browser-evidence", "byte-1-shot.png"),
		);
		assert.equal(shot[0], 0x89);
		assert.equal(shot.subarray(1, 4).toString("utf8"), "PNG");
		assert.equal(shot.toString("utf8").includes("screenshot-placeholder"), false);
		rmSync(fakeDir, { recursive: true, force: true });
		rmSync(byteDir, { recursive: true, force: true });
		await runtime.dispose();
	} finally {
		rmSync(root, { recursive: true, force: true, maxRetries: 3 });
	}
});

test("test_us0152_gates_use_app_health_browser_probe_and_retry", async () => {
	assert.deepEqual(
		[...RELEASE_GATE_ORDER],
		["check_in_tests", "independent_qa", "uat_evidence", "release_artifacts", "fail_closed_reason"],
	);
	const workflow = source("../../packages/runtime-core/src/workflow/workflow-engine.ts");
	assert.match(workflow, /rememberPhaseEvidence\("execute"\)/);
	assert.match(workflow, /rememberPhaseEvidence\("qa"\)/);
	assert.match(workflow, /rememberPhaseEvidence\("uat"\)/);
	assert.match(workflow, /prepareReleaseGate\(/);
	assert.match(workflow, /getRestartMax\(/);
	assert.match(workflow, /withRetry\(/);
	assert.doesNotMatch(workflow, /UAT_RETRY_MAX|BROWSER_GATE_CAP|APP_UAT_CAP/);

	const root = tempProjectRoot();
	try {
		let restarts = 0;
		const app = {
			async start() {
				return { id: "missing", url: "http://127.0.0.1/" };
			},
			async health() {
				return { ok: false, health: "missing" };
			},
			async restart() {
				restarts += 1;
				return { id: "missing" };
			},
			getRestartMax() {
				return 2;
			},
			logs() {
				return [];
			},
			async cleanup() {
				return {};
			},
		};
		const browser = createBrowserUat({
			driver: new ByteDriver(),
			evidenceDir: root,
			connect: { connectHandoff: () => handoff("http://127.0.0.1/") },
		});
		const engine = createWorkflowEngine({
			supervisor: runtimeSupervisor(),
			config: {},
			app,
			browser,
			evidenceRoot: root,
		});
		engine.rememberPhaseEvidence("execute");
		engine.rememberPhaseEvidence("qa");
		engine.rememberPhaseEvidence("uat");
		const missing = await engine.prepareReleaseGate({
			tests_pass: true,
			qa_evidence: true,
			uat_pass: true,
			artifact_refs: ["sprints/S0172/summary.md"],
		});
		assert.equal(missing.uat_pass, false);
		assert.equal(restarts, 2);
		assert.equal(engine.phaseEvidence.execute, false);
		assert.equal(engine.phaseEvidence.qa, false);
		assert.equal(engine.phaseEvidence.uat, false);
		assert.equal(engine.phaseEvidence.release, false);
		const blocked = engine.evaluateRelease(missing);
		assert.equal(blocked.ok, false);
		if (!blocked.ok) {
			assert.equal(blocked.code, RELEASE_UAT_FAILED);
		}

		const capped = createBrowserUat({
			driver: new ByteDriver(),
			evidenceDir: root,
			retryMax: 0,
		});
		capped.withRetry = async () => {
			throw Object.assign(new Error("cap"), { reason_code: "BROWSER_RETRY_CAP_EXHAUSTED" });
		};
		const healthy = healthyApp("http://127.0.0.1/");
		const retryEngine = gateEngine(root, healthy, capped);
		const exhausted = await retryEngine.prepareReleaseGate({
			tests_pass: true,
			qa_evidence: true,
			uat_pass: true,
			artifact_refs: ["sprints/S0172/summary.md"],
		});
		assert.equal(exhausted.uat_pass, false);
		assert.equal(healthy.calls.start, 1);
	} finally {
		rmSync(root, { recursive: true, force: true, maxRetries: 3 });
	}
});

test("test_us0152_incomplete_evidence_blocks_uat", async () => {
	const root = tempProjectRoot();
	try {
		assert.throws(
			() =>
				assertEvidenceComplete({
					passed: true,
					reason_code: UAT_PROBE_PASS,
					snapshot_summary: "a11y",
					trace_ref: "trace.zip",
					duration_ms: 1,
					browser_backend: "isolated",
					app_runtime_ref: "app-1",
					console_errors: [],
					failed_requests: [],
					final_url: "http://127.0.0.1/",
					browser_evidence_refs: {
						screenshots: ["screenshot-placeholder"],
						console_summary: "console.json",
						network_summary: "network.json",
						navigation_url: "http://127.0.0.1/",
					},
				}),
			(err: unknown) => {
				assert.equal((err as { reason_code?: string }).reason_code, BROWSER_EVIDENCE_GAP);
				return true;
			},
		);
		const url = "http://127.0.0.1/";
		const browser = createBrowserUat({
			driver: new ByteDriver(),
			evidenceDir: root,
			connect: { connectHandoff: () => handoff(url) },
		});
		await browser.perform({
			action: "navigate",
			url,
		});
		browser.bindAppRuntime("app-1");
		const written = writeEvidence(root, {
			passed: true,
			reason_code: UAT_PROBE_PASS,
			snapshot_summary: "a11y:document",
			trace_ref: join(root, "trace.zip"),
			duration_ms: 4,
			browser_backend: "isolated",
			app_runtime_ref: "app-1",
			console_errors: ["Bearer sk-live-secret12"],
			failed_requests: [],
			final_url: url,
			browser_evidence_refs: {
				screenshots: [join(root, ".its-magic", "runtime", "browser-evidence", "byte-1-shot.png")],
				console_summary: join(root, ".its-magic", "runtime", "browser-evidence", "console.json"),
				network_summary: join(root, ".its-magic", "runtime", "browser-evidence", "network.json"),
				navigation_url: url,
			},
		});
		assert.equal(JSON.stringify(written).includes("sk-live-secret12"), false);
		assert.match(JSON.stringify(written), /\[redacted\]/);
		assert.equal(written.app_runtime_ref, "app-1");
		assert.ok(written.trace_ref);
		assert.equal(written.final_url, url);
		assert.ok(written.browser_evidence_refs.console_summary);
		assert.ok(written.browser_evidence_refs.network_summary);
		assertEvidenceComplete(written);
		const gap = createWorkflowEngine({
			supervisor: runtimeSupervisor(),
			config: {},
			app: healthyApp(url),
			browser,
			evidenceRoot: root,
		});
		const failed = gap.evaluateRelease({
			tests_pass: true,
			qa_evidence: true,
			uat_pass: false,
			artifact_refs: ["sprints/S0172/summary.md"],
		});
		assert.equal(failed.ok, false);
		if (!failed.ok) {
			assert.equal(failed.code, RELEASE_UAT_FAILED);
		}
	} finally {
		rmSync(root, { recursive: true, force: true, maxRetries: 3 });
	}
});

test("test_us0152_app_and_browser_commands_share_services", async () => {
	const executor = source("../../packages/runtime-core/src/operator/operator-executor.ts");
	assert.doesNotMatch(executor, /ok:\s*true/);
	assert.doesNotMatch(executor, /AppRuntime/);
	assert.doesNotMatch(executor, /createBrowser|CdpAdapter|IsolatedDriver/);
	const cli = source("../../apps/cli/src/run.ts");
	const daemon = source("../../apps/daemon/src/server.ts");
	assert.match(cli, /readHostAppHealth\(host\.app\)/);
	assert.match(daemon, /readHostAppHealth\(deps\.runtime\?\.app\)/);

	const root = tempProjectRoot();
	try {
		const runtime = await host(root);
		assert.deepEqual(readHostAppHealth(runtime.app), runtime.app.snapshotHealth("operator-app"));
		const daemonServer = await startDaemonServer({
			projectRoot: root,
			runtime,
			skipStartupReconcile: true,
		});
		let healthCalls = 0;
		const health = runtime.app.health.bind(runtime.app);
		runtime.app.health = async (id) => {
			healthCalls += 1;
			return health(id);
		};
		let launches = 0;
		const launch = runtime.browser.driver.launch.bind(runtime.browser.driver);
		runtime.browser.driver.launch = async (req) => {
			launches += 1;
			return launch(req);
		};
		runtime.app.snapshotHealth = () => ({ ok: false, reason_code: "APP_RUNTIME_HEALTH_FAILED" });
		const status = await captureCli(["status"], runtime);
		assert.equal(status.body.snapshot?.app_health.reason_code, "APP_RUNTIME_HEALTH_FAILED");
		const app = await captureCli(["app"], runtime);
		const browser = await captureCli(["browser"], runtime);
		assert.ok(healthCalls > 0);
		assert.ok(launches > 0);
		assert.equal(app.body.reason_code, "APP_HEALTH_UNAVAILABLE");
		assert.equal(browser.body.reason_code, BROWSER_UNAVAILABLE);
		assert.equal("ok" in app.body, false);
		assert.equal("ok" in browser.body, false);
		assert.notEqual(app.body.disposition, "success");
		assert.notEqual(browser.body.disposition, "success");

		const started = await captureCli(["app", "start"], runtime);
		assert.equal(started.body.reason_code, "APP_RUNTIME_START_FAILED");
		assert.equal("ok" in started.body, false);
		const cleaned = await captureCli(["app", "cleanup", "cancel"], runtime);
		assert.equal(cleaned.body.reason_code, "APP_RUNTIME_CLEANUP_FAILED");
		const denied = await captureCli(["browser", "account_ref=acct"], runtime);
		assert.equal(denied.body.reason_code, BROWSER_CREDENTIAL_FORBIDDEN);
		await daemonServer.close();
	} finally {
		rmSync(root, { recursive: true, force: true, maxRetries: 3 });
	}
});

test("test_us0152_e2e_launch_gate_and_failure_fixtures", async () => {
	const root = tempProjectRoot();
	const server = createServer((_req, res) => {
		res.writeHead(200, { "content-type": "text/html" });
		res.end("<html><body>ok</body></html>");
	});
	await new Promise<void>((resolve) => {
		server.listen(0, "127.0.0.1", () => resolve());
	});
	const addr = server.address();
	const port = typeof addr === "object" && addr ? addr.port : 0;
	const url = `http://127.0.0.1:${port}/`;
	try {
		const driver = new ByteDriver();
		assert.equal(driver instanceof FakeBrowserDriver, false);
		const browser = createBrowserUat({
			driver,
			evidenceDir: root,
			connect: { connectHandoff: () => handoff(url) },
		});
		const app = healthyApp(url);
		const engine = gateEngine(root, app, browser);
		const passed = await engine.prepareReleaseGate({
			tests_pass: true,
			qa_evidence: true,
			uat_pass: true,
			artifact_refs: ["sprints/S0172/summary.md"],
		});
		assert.equal(passed.uat_pass, true);
		assert.equal(app.calls.start, 1);
		const verdict = engine.evaluateRelease(passed);
		assert.equal(verdict.ok, true);
		engine.rememberPhaseEvidence("execute");
		engine.rememberPhaseEvidence("qa");
		engine.rememberPhaseEvidence("uat");
		assert.equal(engine.phaseEvidence.execute, true);
		assert.equal(engine.phaseEvidence.qa, true);
		assert.equal(engine.phaseEvidence.uat, true);
		assert.equal(engine.phaseEvidence.release, true);
		const shot = readFileSync(
			join(root, ".its-magic", "runtime", "browser-evidence", "byte-1-shot.png"),
		);
		assert.equal(shot.subarray(1, 4).toString("utf8"), "PNG");
		assert.equal(shot.toString("utf8").includes("screenshot-placeholder"), false);

		const runtime = await host(root);
		const facade = createOperatorCommandFacade({ router: runtime.router });
		const observability = createOperatorObservabilityService({
			projectRoot: root,
			store: runtime.store,
			ports: { readAppHealth: () => readHostAppHealth(runtime.app) },
		});
		const command = await executeOperatorCommand(["browser", url], OPERATOR_RUN_ID, {
			projectRoot: root,
			store: runtime.store,
			engine,
			observability,
			facade,
			supervisor: runtime.supervisor,
			config: {},
			browserService: browser,
			appService: app,
		});
		assert.equal(command.disposition, "success", command.reason_code ?? "no-reason");
		assert.equal("ok" in command, false);
		assert.equal(driver.launches.length > 0, true);

		const crashed = createWorkflowEngine({
			supervisor: runtimeSupervisor(),
			config: {},
			app: {
				...healthyApp(url),
				async start() {
					throw Object.assign(new Error("crash"), { code: "PROCESS_CRASHED" });
				},
			},
			browser,
			evidenceRoot: root,
		});
		const crashGate = await crashed.prepareReleaseGate({
			tests_pass: true,
			qa_evidence: true,
			uat_pass: true,
			artifact_refs: ["sprints/S0172/summary.md"],
		});
		assert.equal(crashGate.uat_pass, false);
		const crashVerdict = crashed.evaluateRelease(crashGate);
		assert.equal(crashVerdict.ok, false);
		if (!crashVerdict.ok) {
			assert.equal(crashVerdict.code, RELEASE_UAT_FAILED);
		}

		const asserting = createBrowserUat({
			driver: new ByteDriver(),
			evidenceDir: mkdtempSync(join(tmpdir(), "itsm-us0152-assert-")),
		});
		asserting.perform = async () => {
			throw Object.assign(new Error("assert"), { reason_code: "BROWSER_ASSERTION_FAILED" });
		};
		const assertEngine = gateEngine(root, healthyApp(url), asserting);
		const assertGate = await assertEngine.prepareReleaseGate({
			tests_pass: true,
			qa_evidence: true,
			uat_pass: true,
			artifact_refs: ["sprints/S0172/summary.md"],
		});
		assert.equal(assertGate.uat_pass, false);

		const locked = createBrowserUat({
			driver: new ByteDriver(),
			evidenceDir: mkdtempSync(join(tmpdir(), "itsm-us0152-auth-")),
		});
		const authEngine = gateEngine(root, healthyApp(url), locked);
		const originalPerform = locked.perform.bind(locked);
		locked.perform = (req) => originalPerform({ ...req, action: "type", account_ref: "acct" });
		const authGate = await authEngine.prepareReleaseGate({
			tests_pass: true,
			qa_evidence: true,
			uat_pass: true,
			artifact_refs: ["sprints/S0172/summary.md"],
		});
		assert.equal(authGate.uat_pass, false);

		const gapBrowser = createBrowserUat({
			driver: new ByteDriver(),
			evidenceDir: mkdtempSync(join(tmpdir(), "itsm-us0152-gap-")),
			connect: { connectHandoff: () => handoff(url) },
		});
		const gapEngine = gateEngine(root, healthyApp(url), gapBrowser);
		gapBrowser.perform = async () => {
			const row = {
				passed: true,
				reason_code: UAT_PROBE_PASS,
				snapshot_summary: "gap",
				trace_ref: "",
				duration_ms: 1,
				browser_backend: "isolated" as const,
				app_runtime_ref: "",
				console_errors: [],
				failed_requests: [],
				final_url: "",
				browser_evidence_refs: { screenshots: ["screenshot-placeholder"] },
			};
			assert.throws(
				() => assertEvidenceComplete(row),
				(err: unknown) => {
					assert.equal((err as { reason_code?: string }).reason_code, BROWSER_EVIDENCE_GAP);
					return true;
				},
			);
			return row;
		};
		const gapGate = await gapEngine.prepareReleaseGate({
			tests_pass: true,
			qa_evidence: true,
			uat_pass: true,
			artifact_refs: ["sprints/S0172/summary.md"],
		});
		assert.equal(gapGate.uat_pass, false);
		const gapVerdict = gapEngine.evaluateRelease(gapGate);
		assert.equal(gapVerdict.ok, false);
		if (!gapVerdict.ok) {
			assert.equal(gapVerdict.code, RELEASE_UAT_FAILED);
		}
		await runtime.dispose();
	} finally {
		await new Promise<void>((resolve, reject) => {
			server.close((err) => (err ? reject(err) : resolve()));
		});
		rmSync(root, { recursive: true, force: true, maxRetries: 3 });
	}
});
