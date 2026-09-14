import assert from "node:assert/strict";
import {
	existsSync,
	mkdirSync,
	mkdtempSync,
	readdirSync,
	readFileSync,
	writeFileSync,
} from "node:fs";
import { createServer } from "node:http";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { DEFAULT_RESTART_MAX } from "../../packages/app-runtime/src/index.ts";
import {
	assertEvidenceComplete,
	BROWSER_CDP_DEFAULT_PROFILE_FORBIDDEN,
	BROWSER_CDP_UNAUTHORIZED,
	BROWSER_CREDENTIAL_FORBIDDEN,
	BROWSER_RETRY_CAP_EXHAUSTED,
	BROWSER_UNAVAILABLE,
	BROWSER_WAIT_TIMEOUT,
	classifyStep,
	createBrowserUat,
	DEFAULT_RETRY_MAX,
	EVIDENCE_DIR_REL,
	FakeBrowserDriver,
	ITSM_BROWSER_ACTIONS,
	isDefaultChromeUserDataDir,
	kitBrowserProbeMode,
	PlaywrightCdpAdapter,
	PlaywrightIsolatedDriver,
	UAT_BROWSER_PROBE_FAILED,
	UAT_BROWSER_PROBE_MODE_CURSOR,
	UAT_BROWSER_PROBE_MODE_OWNED,
	UAT_PROBE_FORBIDDEN,
	UAT_PROBE_PASS,
	UnavailableBrowserDriver,
} from "../../packages/browser-uat/src/index.ts";
import {
	createPolicyEngine,
	POLICY_DEFAULT_DENY,
	POLICY_STUB_TOOL_DENIED,
	PROMOTED_LIVE_TOOLS,
	STUB_TOOLS,
} from "../../packages/policy-engine/src/index.ts";
import { createToolBroker, toolNamesForRole } from "../../packages/tool-broker/src/index.ts";

const HERE = dirname(fileURLToPath(import.meta.url));
const STANDALONE_ROOT = join(HERE, "..", "..");
const KIT_ROOT = join(STANDALONE_ROOT, "..");
const PKG_ROOT = join(STANDALONE_ROOT, "packages", "browser-uat");

const FORBIDDEN_IMPORTS = ["@earendil-works/pi-", "@cortexkit/aft-pi", "@its-magic/pi-kernel"];

const MARKERS = [
	"test_us0142_isolated_launch_context",
	"test_us0142_cdp_connect_disconnect",
	"test_us0142_cdp_unauthorized_and_default_profile",
	"test_us0142_itsm_browser_typed_actions",
	"test_us0142_uat_planner_browser_smoke",
	"test_us0142_kit_forbidden_unweakened",
	"test_us0142_evidence_schema_connect_ref",
	"test_us0142_redact_headers_cookies_tokens",
	"test_us0142_credential_deny_no_env",
	"test_us0142_fail_closed_retry_cap",
	"test_us0142_e2e_happy_uat_gate",
	"test_us0142_e2e_failure_and_exploratory_spec",
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
		name?: string;
	};
	assert.equal(pkg.name, "@its-magic/browser-uat");
	const deps = { ...(pkg.dependencies ?? {}), ...(pkg.devDependencies ?? {}) };
	for (const key of Object.keys(deps)) {
		assert.equal(key.startsWith("@earendil-works/pi-"), false, key);
		assert.equal(key.startsWith("@cortexkit/aft-"), false, key);
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

function fakeConnect(id = "svc-1") {
	return {
		connectHandoff(handleId: string) {
			return {
				connect_endpoint: "http://127.0.0.1:3456/",
				health_path: "/health",
				service_id: handleId || id,
				container_id: "",
				env_refs: ["TEST_ACCOUNT"],
				url: "http://127.0.0.1:3456/",
				ports: [3456],
				health: "ok",
			};
		},
	};
}

test("test_us0142_isolated_launch_context", async () => {
	assertNoPi(PKG_ROOT);
	const pkg = JSON.parse(readFileSync(join(PKG_ROOT, "package.json"), "utf8"));
	assert.equal(pkg.private, true);
	assert.equal(pkg.version, "0.0.0");
	assert.equal(pkg.type, "module");
	assert.equal(pkg.engines.node, ">=22.19.0");
	assert.equal(pkg.exports["."], "./src/index.ts");
	const kitPkg = JSON.parse(readFileSync(join(KIT_ROOT, "package.json"), "utf8"));
	for (const entry of kitPkg.files ?? []) {
		assert.notEqual(entry, "standalone");
		assert.equal(String(entry).startsWith("standalone/"), false);
	}
	assert.equal(JSON.stringify(kitPkg.workspaces ?? []).includes("standalone"), false);
	const biome = readFileSync(join(STANDALONE_ROOT, "biome.json"), "utf8");
	assert.equal(biome.includes("packages/browser-uat"), false);
	const driver = new FakeBrowserDriver();
	const uat = createBrowserUat({ driver });
	const session = await uat.openIsolated({ headless: true });
	assert.equal(session.backend, "isolated");
	assert.equal(session.headless, true);
	assert.equal(session.cookiesIsolated, true);
	assert.equal(driver.launches[0]?.headless, true);
	assert.equal(driver.contexts.length, 1);
	await uat.teardown();
	assert.equal(session.closed, true);
	assert.equal(driver.closed.length, 1);
	const live = new PlaywrightIsolatedDriver();
	await assert.rejects(
		() => live.launch({ headless: true }),
		(err: unknown) => {
			assert.equal((err as { reason_code?: string }).reason_code, BROWSER_UNAVAILABLE);
			return true;
		},
	);
});

test("test_us0142_cdp_connect_disconnect", async () => {
	const driver = new FakeBrowserDriver();
	const uat = createBrowserUat({ driver });
	const session = await uat.attachCdp({
		endpoint: "http://127.0.0.1:9222",
		userDataDir: "C:/profiles/its-magic-dedicated",
		approved: true,
	});
	assert.equal(session.backend, "cdp");
	assert.equal(session.alive, true);
	await uat.teardown();
	assert.equal(session.disconnected, true);
	assert.equal(session.alive, true);
	assert.equal(session.closed, false);
	assert.equal(driver.disconnected.length, 1);
	assert.equal(driver.closed.length, 0);
	const live = new PlaywrightCdpAdapter();
	await assert.rejects(
		() =>
			live.connectOverCDP({
				endpoint: "http://127.0.0.1:9222",
				userDataDir: "/tmp/its-magic-dedicated",
				approved: true,
			}),
		(err: unknown) => {
			assert.equal((err as { reason_code?: string }).reason_code, BROWSER_UNAVAILABLE);
			return true;
		},
	);
});

test("test_us0142_cdp_unauthorized_and_default_profile", async () => {
	const driver = new FakeBrowserDriver();
	const uat = createBrowserUat({ driver });
	await assert.rejects(
		() => uat.attachCdp({}),
		(err: unknown) => {
			assert.equal((err as { reason_code?: string }).reason_code, BROWSER_CDP_UNAUTHORIZED);
			return true;
		},
	);
	await assert.rejects(
		() =>
			uat.attachCdp({
				endpoint: "http://127.0.0.1:9222",
				userDataDir: "C:/Users/flow/AppData/Local/Google/Chrome/User Data",
				approved: true,
			}),
		(err: unknown) => {
			assert.equal(
				(err as { reason_code?: string }).reason_code,
				BROWSER_CDP_DEFAULT_PROFILE_FORBIDDEN,
			);
			return true;
		},
	);
	assert.equal(
		isDefaultChromeUserDataDir("C:/Users/flow/AppData/Local/Google/Chrome/User Data"),
		true,
	);
	assert.equal(driver.launches.length, 0);
});

test("test_us0142_itsm_browser_typed_actions", async () => {
	assert.deepEqual(
		[...ITSM_BROWSER_ACTIONS],
		[
			"open",
			"navigate",
			"snapshot",
			"click",
			"type",
			"select",
			"wait",
			"screenshot",
			"console",
			"network",
			"download",
			"upload",
			"accessibility",
		],
	);
	assert.equal((STUB_TOOLS as readonly string[]).includes("itsm_browser"), true);
	assert.equal((PROMOTED_LIVE_TOOLS as readonly string[]).includes("itsm_browser"), true);
	assert.equal(toolNamesForRole("qa").includes("itsm_browser"), true);
	assert.equal(toolNamesForRole("dev").includes("itsm_browser"), false);
	assert.equal(toolNamesForRole("orchestrator").includes("itsm_browser"), false);
	const engine = createPolicyEngine();
	const root = mkdtempSync(join(tmpdir(), "us0142-pol-"));
	const allow = engine.evaluate({
		role_id: "qa",
		phase_id: "qa",
		worktree_root: root,
		cwd: root,
		autonomy: "supervised",
		permission_mode: "default-deny",
		security_class: "standard",
		isolation_profile: "trusted-local",
		tool: "itsm_browser",
		action: "snapshot",
	});
	assert.equal(allow.decision, "ALLOW");
	assert.notEqual(allow.reason_code, POLICY_STUB_TOOL_DENIED);
	const denyDev = engine.evaluate({
		role_id: "dev",
		phase_id: "execute",
		worktree_root: root,
		cwd: root,
		autonomy: "supervised",
		permission_mode: "default-deny",
		security_class: "standard",
		isolation_profile: "trusted-local",
		tool: "itsm_browser",
		action: "snapshot",
	});
	assert.equal(denyDev.decision, "DENY");
	assert.equal(denyDev.reason_code, POLICY_DEFAULT_DENY);
	const dir = mkdtempSync(join(tmpdir(), "us0142-act-"));
	const uat = createBrowserUat({ driver: new FakeBrowserDriver(), evidenceDir: dir });
	await uat.openIsolated({ headless: true });
	for (const action of ITSM_BROWSER_ACTIONS) {
		const rec = await uat.perform({ action, url: "http://127.0.0.1/" });
		assert.equal(
			rec.snapshot_summary.includes("a11y") || rec.snapshot_summary.includes("dom"),
			true,
		);
		assert.equal(rec.snapshot_summary.includes("toHaveScreenshot"), false);
	}
	const broker = createToolBroker(undefined, uat);
	const owned = broker.ownedToolsFor({
		role_id: "qa",
		phase_id: "qa",
		worktree_root: root,
		cwd: root,
		run_id: "auto-20260913-us0142",
		kernel_session_id: "sess",
		isolation_profile: "trusted-local",
	});
	const tool = owned.find((t) => t.name === "itsm_browser");
	assert.ok(tool);
	const out = await tool.execute("c1", { action: "snapshot" });
	assert.equal(JSON.stringify(out.details).includes("toHaveScreenshot"), false);
});

test("test_us0142_uat_planner_browser_smoke", () => {
	assert.equal(kitBrowserProbeMode(undefined), UAT_BROWSER_PROBE_MODE_CURSOR);
	assert.equal(kitBrowserProbeMode("owned"), UAT_BROWSER_PROBE_MODE_OWNED);
	assert.equal(kitBrowserProbeMode("nope"), UAT_BROWSER_PROBE_MODE_CURSOR);
	const classified = classifyStep("click submit button on home page");
	assert.equal(classified.kind, "browser_smoke");
	const uat = createBrowserUat({
		driver: new FakeBrowserDriver(),
		probeMode: "owned",
		connect: fakeConnect(),
	});
	const result = uat.executeOwnedUat([{ text: "click submit button on home page" }], {
		storyId: "US-0142",
		connectId: "svc-1",
	});
	assert.equal(result.passed, true);
	assert.equal(result.reason_code, UAT_PROBE_PASS);
	assert.equal(result.probe_results[0]?.passed, true);
	assert.ok(result.probe_results[0]?.browser_evidence_refs);
});

test("test_us0142_kit_forbidden_unweakened", () => {
	assert.equal(classifyStep("read secrets from .env file").reason_code, UAT_PROBE_FORBIDDEN);
	assert.equal(classifyStep("enter password in login form").reason_code, UAT_PROBE_FORBIDDEN);
	const kit = readFileSync(join(KIT_ROOT, "scripts", "uat_probe_lib.py"), "utf8");
	assert.equal(kit.includes('UAT_BROWSER_PROBE_MODE", "cursor"'), true);
	assert.equal(kit.includes('"owned"'), true);
	const uat = createBrowserUat({ driver: new FakeBrowserDriver() });
	const denied = uat.executeOwnedUat([{ text: "read secrets from .env file" }], {
		storyId: "US-0142",
	});
	assert.equal(denied.probe_results[0]?.reason_code, UAT_PROBE_FORBIDDEN);
	assert.equal(denied.probe_results[0]?.passed, false);
});

test("test_us0142_evidence_schema_connect_ref", async () => {
	const dir = mkdtempSync(join(tmpdir(), "us0142-ev-"));
	const uat = createBrowserUat({
		driver: new FakeBrowserDriver(),
		connect: fakeConnect("web-1"),
		evidenceDir: dir,
	});
	await uat.openIsolated({ headless: true });
	const rec = await uat.perform({ action: "navigate", url: "http://127.0.0.1:3456/" });
	rec.app_runtime_ref = uat.bindAppRuntime("web-1");
	assert.ok(rec.browser_evidence_refs.screenshots.length > 0);
	assert.ok(rec.snapshot_summary);
	assert.ok(Array.isArray(rec.console_errors));
	assert.ok(Array.isArray(rec.failed_requests));
	assert.equal(rec.final_url, "http://127.0.0.1:3456/");
	assert.ok(rec.trace_ref);
	assert.ok(rec.duration_ms >= 0);
	assert.equal(rec.browser_backend, "isolated");
	assert.equal(rec.app_runtime_ref, "web-1");
	assert.equal(rec.har_content, "omit");
	assert.equal(rec.browser_evidence_refs.navigation_url, "http://127.0.0.1:3456/");
	assert.equal(EVIDENCE_DIR_REL.includes("browser-evidence"), true);
	assert.equal(existsSync(join(KIT_ROOT, ".gitignore")), true);
	assert.equal(
		readFileSync(join(KIT_ROOT, ".gitignore"), "utf8").includes("**/.its-magic/runtime/"),
		true,
	);
});

test("test_us0142_redact_headers_cookies_tokens", () => {
	const uat = createBrowserUat({ driver: new FakeBrowserDriver() });
	const headers = uat.redactHeaders({
		Authorization: "Bearer sk-live-secret",
		Cookie: "sid=abc",
		"Set-Cookie": "sid=abc",
		Accept: "text/html",
	});
	assert.equal(headers.Authorization, "[redacted]");
	assert.equal(headers.Cookie, "[redacted]");
	assert.equal(headers["Set-Cookie"], "[redacted]");
	assert.equal(headers.Accept, "text/html");
	const form = uat.redactForm({ password: "hunter2", username: "qa" });
	assert.equal(form.password, "[redacted]");
	assert.equal(form.username, "qa");
});

test("test_us0142_credential_deny_no_env", async () => {
	const dir = mkdtempSync(join(tmpdir(), "us0142-cred-"));
	writeFileSync(join(dir, ".env"), "SECRET=nope\n", "utf8");
	mkdirSync(join(dir, "src"), { recursive: true });
	writeFileSync(join(dir, "src", "secrets.txt"), "password=nope\n", "utf8");
	const uat = createBrowserUat({ driver: new FakeBrowserDriver(), evidenceDir: dir });
	await assert.rejects(
		() => uat.perform({ action: "type", path: ".env", text: "SECRET" }, dir),
		(err: unknown) => {
			const code = (err as { reason_code?: string }).reason_code;
			assert.equal(code === UAT_PROBE_FORBIDDEN || code === BROWSER_CREDENTIAL_FORBIDDEN, true);
			return true;
		},
	);
	await assert.rejects(
		() =>
			uat.perform(
				{ action: "type", path: join("src", "secrets.txt"), text: "password from repo" },
				dir,
			),
		(err: unknown) => {
			const code = (err as { reason_code?: string }).reason_code;
			assert.equal(code === UAT_PROBE_FORBIDDEN || code === BROWSER_CREDENTIAL_FORBIDDEN, true);
			return true;
		},
	);
});

test("test_us0142_fail_closed_retry_cap", async () => {
	assert.equal(DEFAULT_RETRY_MAX, 2);
	assert.notEqual(DEFAULT_RETRY_MAX, DEFAULT_RESTART_MAX);
	const uat = createBrowserUat({
		driver: new FakeBrowserDriver(),
		retryMax: 2,
	});
	await assert.rejects(
		() =>
			uat.withRetry(async () => {
				throw Object.assign(new Error("crash"), { reason_code: BROWSER_WAIT_TIMEOUT });
			}, BROWSER_WAIT_TIMEOUT),
		(err: unknown) => {
			assert.equal((err as { reason_code?: string }).reason_code, BROWSER_RETRY_CAP_EXHAUSTED);
			return true;
		},
	);
	await assert.rejects(
		() => uat.attachCdp({}),
		(err: unknown) => {
			assert.equal((err as { reason_code?: string }).reason_code, BROWSER_CDP_UNAUTHORIZED);
			return true;
		},
	);
	const missing = new UnavailableBrowserDriver();
	await assert.rejects(
		() => missing.launch(),
		(err: unknown) => {
			assert.equal((err as { reason_code?: string }).reason_code, BROWSER_UNAVAILABLE);
			return true;
		},
	);
	const gap = createBrowserUat({ driver: new FakeBrowserDriver() });
	const incomplete = gap.executeOwnedUat([{ text: "click go" }], {
		storyId: "US-0142",
		fail: true,
	});
	assert.equal(incomplete.passed, false);
	assert.equal(incomplete.reason_code, UAT_BROWSER_PROBE_FAILED);
	assert.notEqual(incomplete.reason_code, UAT_PROBE_PASS);
	assert.throws(() => {
		assertEvidenceComplete({
			passed: true,
			reason_code: UAT_PROBE_PASS,
			snapshot_summary: "",
			trace_ref: "",
			duration_ms: 0,
			browser_backend: "isolated",
			app_runtime_ref: "",
			console_errors: [],
			failed_requests: [],
			final_url: "",
			browser_evidence_refs: { screenshots: [] },
		});
	});
});

test("test_us0142_e2e_happy_uat_gate", async () => {
	const dir = mkdtempSync(join(tmpdir(), "us0142-e2e-"));
	const server = createServer((_req, res) => {
		res.writeHead(200, { "content-type": "text/html" });
		res.end("<html><body><button>ok</button></body></html>");
	});
	await new Promise<void>((resolve) => {
		server.listen(0, "127.0.0.1", () => resolve());
	});
	const addr = server.address();
	const port = typeof addr === "object" && addr ? addr.port : 0;
	const url = `http://127.0.0.1:${port}/`;
	try {
		const uat = createBrowserUat({
			driver: new FakeBrowserDriver(),
			connect: fakeConnect("app-1"),
			evidenceDir: dir,
		});
		await uat.openIsolated({ headless: true });
		await uat.perform({ action: "navigate", url });
		uat.bindAppRuntime("app-1");
		const gate = uat.executeOwnedUat([{ text: "click the ok button" }], {
			storyId: "US-0142",
			connectId: "app-1",
		});
		assert.equal(gate.passed, true);
		assert.equal(gate.reason_code, UAT_PROBE_PASS);
		assert.equal(gate.probe_results[0]?.app_runtime_ref, "app-1");
	} finally {
		await new Promise<void>((resolve, reject) => {
			server.close((err) => (err ? reject(err) : resolve()));
		});
	}
});

test("test_us0142_e2e_failure_and_exploratory_spec", () => {
	const src = walkFiles(PKG_ROOT)
		.map((p) => readFileSync(p, "utf8"))
		.join("\n");
	assert.equal(src.includes("toHaveScreenshot"), false);
	const uat = createBrowserUat({ driver: new FakeBrowserDriver() });
	const fail = uat.executeOwnedUat([{ text: "click broken control" }], {
		storyId: "US-0142",
		fail: true,
	});
	assert.equal(fail.passed, false);
	assert.equal(fail.reason_code, UAT_BROWSER_PROBE_FAILED);
	const exploratory = classifyStep("click submit button on home page");
	assert.equal(exploratory.kind, "browser_smoke");
	assert.equal(MARKERS.length, 12);
	for (const marker of MARKERS) {
		assert.equal(marker.startsWith("test_us0142_"), true);
	}
});
