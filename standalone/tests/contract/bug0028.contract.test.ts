import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import {
	copyFileSync,
	mkdirSync,
	mkdtempSync,
	readFileSync,
	rmSync,
	statSync,
	utimesSync,
	writeFileSync,
} from "node:fs";
import { join } from "node:path";
import test from "node:test";
import { fileURLToPath, pathToFileURL } from "node:url";
import { classifyCommand } from "../../apps/cli/src/command-class.ts";
import { localSubcommandNeedsAuthRuntime } from "../../apps/cli/src/local-command.ts";
import { readStatusSnapshot } from "../../apps/cli/src/status-snapshot.ts";

const standaloneRoot = fileURLToPath(new URL("../..", import.meta.url));
const repoRoot = fileURLToPath(new URL("../../..", import.meta.url));
const cliDir = join(standaloneRoot, "apps", "cli", "src");
const cliEntry = join(cliDir, "index.ts");
const templateCliDir = join(repoRoot, "template", ".its-magic", "standalone", "apps", "cli", "src");
const workRoot = join(standaloneRoot, ".bug0028-tmp");

const HEAVY = [
	"@its-magic/runtime-host",
	"@its-magic/pi-kernel",
	"@its-magic/code-intelligence",
	"@its-magic/tool-broker",
	"@its-magic/kernel-bridge",
	"node:sqlite",
];

const PHASE_TOKENS = [
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
	"memory-audit",
	"map-codebase",
	"security-review",
];

const SCHEDULER_TOKENS = ["auto", "quick", "/auto", "/quick"];

interface Spawned {
	code: number | null;
	stdout: string;
	stderr: string;
	trace: string;
}

function read(path: string): string {
	return readFileSync(path, "utf8");
}

function staticSpecifiers(source: string): string[] {
	const specs: string[] = [];
	const re = /(?:^|\n)import\s[\s\S]*?\sfrom\s+["']([^"']+)["']/g;
	for (const match of source.matchAll(re)) {
		const spec = match[1];
		if (spec) {
			specs.push(spec);
		}
	}
	return specs;
}

function dedicatedCommands(): string[] {
	const source = read(
		join(standaloneRoot, "packages", "runtime-core", "src", "operator", "operator-command-facade.ts"),
	);
	const match = /const DEDICATED_COMMANDS[^=]*=\s*\[([\s\S]*?)\]/.exec(source);
	assert.ok(match, "DEDICATED_COMMANDS missing");
	return [...match[1].matchAll(/"([a-z-]+)"/g)].map((item) => item[1] ?? "");
}

function writeHooks(): { registerPath: string; hookPath: string; hostPath: string; runPath: string; authPath: string } {
	mkdirSync(workRoot, { recursive: true });
	const registerPath = join(workRoot, "register.mjs");
	const hookPath = join(workRoot, "hook.mjs");
	const hostPath = join(workRoot, "host-stub.mjs");
	const runPath = join(workRoot, "run-stub.mjs");
	const authPath = join(workRoot, "auth-stub.mjs");
	writeFileSync(
		registerPath,
		`import { register } from "node:module";
import { pathToFileURL } from "node:url";
register(pathToFileURL(process.env.BUG0028_HOOK).href, { parentURL: import.meta.url });
`,
	);
	writeFileSync(
		hookPath,
		`import { appendFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
const heavy = new Set(${JSON.stringify(HEAVY)});
function note(line) {
  if (process.env.BUG0028_TRACE) appendFileSync(process.env.BUG0028_TRACE, line + "\\n");
}
export async function resolve(specifier, context, nextResolve) {
  const parent = context.parentURL ?? "";
  if (specifier === "@its-magic/pi-kernel/auth-runtime" && process.env.BUG0028_STUB_AUTH === "1") {
    note("AUTH_RUNTIME");
    return { url: pathToFileURL(process.env.BUG0028_AUTH_URL).href, shortCircuit: true };
  }
  if (process.env.BUG0028_FORBID_AUTH === "1" && specifier === "@its-magic/pi-kernel/auth-runtime") {
    note("FORBIDDEN " + specifier);
    throw new Error("FORBIDDEN_HEAVY " + specifier);
  }
  if (specifier === "@its-magic/runtime-host" && process.env.BUG0028_STUB_HOST === "1") {
    note("IMPORT_HOST");
    return { url: pathToFileURL(process.env.BUG0028_HOST_URL).href, shortCircuit: true };
  }
  if (
    process.env.BUG0028_STUB_RUN === "1" &&
    (specifier === "./run.ts" || specifier.endsWith("/run.ts")) &&
    parent.includes("index.ts")
  ) {
    note("IMPORT_RUN");
    return { url: pathToFileURL(process.env.BUG0028_RUN_URL).href, shortCircuit: true };
  }
  const kernelFile = specifier.endsWith("kernel.ts") || specifier.includes("/kernel.ts");
  if (process.env.BUG0028_FORBID_HEAVY === "1" && (heavy.has(specifier) || kernelFile)) {
    note("FORBIDDEN " + specifier);
    throw new Error("FORBIDDEN_HEAVY " + specifier);
  }
  if (specifier === "node:sqlite" || specifier.endsWith("status-snapshot.ts") || specifier.endsWith("local-command.ts")) {
    note("IMPORT " + specifier);
  }
  return nextResolve(specifier, context);
}
`,
	);
	writeFileSync(
		hostPath,
		`import { appendFileSync } from "node:fs";
export async function createRuntimeHost(options) {
  appendFileSync(process.env.BUG0028_TRACE, "HOST " + JSON.stringify(options) + "\\n");
  return {
    projectRoot: options.projectRoot,
    lifetime: options.lifetime,
    dispose: async () => appendFileSync(process.env.BUG0028_TRACE, "DISPOSE\\n"),
  };
}
`,
	);
	writeFileSync(
		runPath,
		`import { appendFileSync } from "node:fs";
export async function runCliArgv(argv) {
  appendFileSync(process.env.BUG0028_TRACE, "RUN " + JSON.stringify(argv) + "\\n");
  return 0;
}
`,
	);
	writeFileSync(
		authPath,
		`import { appendFileSync } from "node:fs";
export function createAuthRuntimeAdapter() {
  appendFileSync(process.env.BUG0028_TRACE, "AUTH_ADAPTER\\n");
  return {
    createRuntime: async () => {},
    login: async () => {},
    logout: async () => {},
    checkAuth: async () => null,
    registerProvider: () => {},
    getModel: () => null,
  };
}
`,
	);
	return { registerPath, hookPath, hostPath, runPath, authPath };
}

const hooks = writeHooks();

function childEnv(root: string, trace: string, flags: Record<string, string>): NodeJS.ProcessEnv {
	const env: NodeJS.ProcessEnv = { ...process.env, COLUMNS: "100" };
	delete env.ITS_MAGIC_CONFIG_ROOT;
	delete env.ITS_MAGIC_REQUIRE_DAEMON;
	delete env.ITSM_PROJECT_ROOT;
	env.BUG0028_TRACE = trace;
	env.BUG0028_HOOK = hooks.hookPath;
	env.BUG0028_HOST_URL = hooks.hostPath;
	env.BUG0028_RUN_URL = hooks.runPath;
	env.BUG0028_AUTH_URL = hooks.authPath;
	env.BUG0028_FORBID_HEAVY = "1";
	env.BUG0028_FORBID_AUTH = "1";
	env.BUG0028_STUB_HOST = "0";
	env.BUG0028_STUB_RUN = "0";
	env.BUG0028_STUB_AUTH = "0";
	env.HOME = root;
	env.USERPROFILE = root;
	env.APPDATA = join(root, "AppData");
	for (const [key, value] of Object.entries(flags)) {
		env[key] = value;
	}
	return env;
}

function spawnNode(
	entry: string,
	args: string[],
	cwd: string,
	env: NodeJS.ProcessEnv,
	timeoutMs = 20_000,
): Promise<Spawned> {
	const trace = env.BUG0028_TRACE ?? "";
	writeFileSync(trace, "");
	return new Promise((resolve, reject) => {
		const child = spawn(
			process.execPath,
			["--experimental-strip-types", "--import", pathToFileURL(hooks.registerPath).href, entry, ...args],
			{ cwd, env, windowsHide: true },
		);
		let stdout = "";
		let stderr = "";
		const timer = setTimeout(() => {
			child.kill();
			reject(new Error(`timeout ${args.join(" ")}`));
		}, timeoutMs);
		child.stdout.setEncoding("utf8");
		child.stderr.setEncoding("utf8");
		child.stdout.on("data", (chunk: string) => {
			stdout += chunk;
		});
		child.stderr.on("data", (chunk: string) => {
			stderr += chunk;
		});
		child.on("error", (error) => {
			clearTimeout(timer);
			reject(error);
		});
		child.on("exit", (code) => {
			clearTimeout(timer);
			resolve({ code, stdout, stderr, trace: read(trace) });
		});
	});
}

function fileExists(path: string): boolean {
	try {
		return statSync(path).isFile();
	} catch (error) {
		if (error instanceof Error && "code" in error && error.code === "ENOENT") {
			return false;
		}
		throw error;
	}
}

function tempProject(prefix: string): { parent: string; project: string; auth: string } {
	const parent = mkdtempSync(join(workRoot, prefix));
	const project = join(parent, "project");
	const auth = join(parent, "auth");
	mkdirSync(project, { recursive: true });
	mkdirSync(auth, { recursive: true });
	return { parent, project, auth };
}

function lightEnv(parent: string, auth: string, trace: string): NodeJS.ProcessEnv {
	return childEnv(parent, trace, { ITSM_AUTH_PATH: auth });
}

function assertNoHeavy(spawned: Spawned): void {
	assert.equal(spawned.trace.includes("FORBIDDEN"), false, spawned.trace + spawned.stderr);
	assert.equal(spawned.stderr.includes("FORBIDDEN_HEAVY"), false, spawned.stderr);
	assert.equal(spawned.trace.includes("IMPORT_HOST"), false, spawned.trace);
	assert.equal(spawned.trace.includes("IMPORT_RUN"), false, spawned.trace);
	assert.equal(spawned.stdout.includes("ops.sqlite"), false, spawned.stdout);
}

test("test_bug0028_help_auth_models_skip_host_and_kernel_barrel", async () => {
	const index = read(cliEntry);
	const classifier = read(join(cliDir, "command-class.ts"));
	const local = read(join(cliDir, "local-command.ts"));
	const authRuntime = read(join(standaloneRoot, "packages", "pi-kernel", "src", "auth-runtime.ts"));
	const indexImports = staticSpecifiers(index);
	assert.deepEqual(indexImports, ["./command-class.ts"]);
	assert.deepEqual(staticSpecifiers(classifier), []);
	assert.deepEqual(staticSpecifiers(local), ["./command-class.ts"]);
	assert.equal(staticSpecifiers(authRuntime).some((spec) => /kernel\.ts|\/index\.ts|\.\/index|\.\/kernel/.test(spec)), false);
	assert.match(local, /await import\("@its-magic\/pi-kernel\/auth-runtime"\)/);
	assert.equal(staticSpecifiers(local).includes("@its-magic/pi-kernel/auth-runtime"), false);
	assert.equal(localSubcommandNeedsAuthRuntime(["auth", "list"]), true);
	assert.equal(localSubcommandNeedsAuthRuntime(["auth", "login"]), true);
	assert.equal(localSubcommandNeedsAuthRuntime(["auth", "logout"]), true);
	assert.equal(localSubcommandNeedsAuthRuntime(["models", "test"]), true);
	assert.equal(localSubcommandNeedsAuthRuntime(["models", "list"]), false);
	assert.equal(localSubcommandNeedsAuthRuntime(["auth", "migrate"]), false);
	assert.equal(classifyCommand([]), "help");
	assert.equal(classifyCommand(["help"]), "help");
	assert.equal(classifyCommand(["--help"]), "help");
	assert.equal(classifyCommand(["-h"]), "help");
	assert.equal(classifyCommand(["auth", "list"]), "local");
	assert.equal(classifyCommand(["models", "list"]), "local");

	const { parent, project, auth } = tempProject("light-");
	const trace = join(parent, "trace.txt");
	try {
		for (const args of [[], ["help"], ["--help"], ["-h"]]) {
			const spawned = await spawnNode(cliEntry, args, project, lightEnv(parent, auth, trace));
			assert.equal(spawned.code, 0, spawned.stderr);
			assert.match(spawned.stdout, /itsm - its-magic operator CLI/);
			assertNoHeavy(spawned);
			assert.equal(spawned.trace.includes("AUTH_RUNTIME"), false, spawned.trace);
		}
		const listed = await spawnNode(cliEntry, ["models", "list"], project, lightEnv(parent, auth, trace));
		assert.equal(listed.code, 0, listed.stderr);
		assert.match(listed.stdout, /"slugs"/);
		assertNoHeavy(listed);
		assert.equal(listed.trace.includes("AUTH_RUNTIME"), false, listed.trace);
		const migrated = await spawnNode(
			cliEntry,
			["auth", "migrate", "--from-pi"],
			project,
			lightEnv(parent, auth, trace),
		);
		assert.equal(migrated.code, 0, migrated.stderr);
		assertNoHeavy(migrated);
		assert.equal(migrated.trace.includes("AUTH_RUNTIME"), false, migrated.trace);
		const adapterEnv = lightEnv(parent, auth, trace);
		adapterEnv.BUG0028_STUB_AUTH = "1";
		adapterEnv.BUG0028_FORBID_AUTH = "0";
		for (const args of [
			["auth", "list"],
			["auth", "login", "openai"],
			["auth", "logout", "openai"],
			["models", "test", "openai/default"],
		]) {
			const spawned = await spawnNode(cliEntry, args, project, adapterEnv);
			assert.equal(spawned.trace.includes("AUTH_RUNTIME"), true, args.join(" ") + spawned.trace);
			assert.equal(spawned.trace.includes("AUTH_ADAPTER"), true, spawned.trace);
			assert.equal(spawned.trace.includes("FORBIDDEN"), false, spawned.trace);
			assert.equal(spawned.trace.includes("IMPORT_HOST"), false, spawned.trace);
			assert.equal(spawned.stderr.includes("kernel.ts"), false, spawned.stderr);
		}
		assert.equal(fileExists(join(project, ".its-magic", "runtime", "ops.sqlite")), false);
	} finally {
		rmSync(parent, { recursive: true, force: true });
	}
});

test("test_bug0028_status_bounded_snapshot_no_scan_session_or_ping", async () => {
	const source = read(join(cliDir, "status-snapshot.ts"));
	for (const banned of [
		"createRuntimeHost",
		"walkDocs",
		"createOperatorSession",
		"createWorkflowEngine",
		"resolveOperatorTransport",
		"isDaemonReachable",
		"daemon.ping",
		"ops.sqlite",
	]) {
		assert.equal(source.includes(banned), false, banned);
	}
	assert.equal(classifyCommand(["status"]), "status");
	assert.equal(classifyCommand(["status", "--help"]), "status");
	assert.equal(classifyCommand(["/status"]), "workflow");

	const missing = readStatusSnapshot(join(workRoot, "missing-status-root"));
	assert.equal(missing.story_id, null);
	assert.equal(missing.sprint_id, null);
	assert.equal(missing.phase_id, null);
	assert.equal(missing.token_cost.total_tokens, null);
	assert.equal(missing.sovereign, null);
	assert.equal(missing.read_only, true);
	assert.equal(missing.schema_version, 1);

	const { parent, project, auth } = tempProject("status-");
	const trace = join(parent, "trace.txt");
	try {
		mkdirSync(join(project, "handoffs"));
		mkdirSync(join(project, "handoffs", "resume_brief.md"));
		const thrown = readStatusSnapshot(project);
		assert.equal(thrown.story_id, null);
		assert.equal(thrown.sprint_id, null);
		assert.equal(thrown.phase_id, null);
		assert.equal(thrown.token_cost.total_tokens, null);
		rmSync(join(project, "handoffs", "resume_brief.md"), { recursive: true, force: true });
		writeFileSync(join(project, "handoffs", "resume_brief.md"), "this brief has no fields\n");
		const malformed = readStatusSnapshot(project);
		assert.equal(malformed.story_id, null);
		assert.equal(malformed.phase_id, null);
		assert.equal(malformed.token_cost.total_tokens, null);
		assert.equal(malformed.token_cost.evidence_ref, null);

		writeFileSync(
			join(project, "handoffs", "resume_brief.md"),
			"story_id: US-0001\nsprint_id: S0176\nintended_resume_phase: execute\n",
		);
		mkdirSync(join(project, "handoffs", "token_cost_runs"));
		const emptyTokens = readStatusSnapshot(project);
		assert.equal(emptyTokens.story_id, "US-0001");
		assert.equal(emptyTokens.sprint_id, "S0176");
		assert.equal(emptyTokens.phase_id, "execute");
		assert.equal(emptyTokens.token_cost.total_tokens, null);
		writeFileSync(join(project, "handoffs", "token_cost_runs", "torn.md"), "   \n");
		const torn = readStatusSnapshot(project);
		assert.equal(torn.story_id, "US-0001");
		assert.equal(torn.token_cost.total_tokens, null);
		const older = join(project, "handoffs", "token_cost_runs", "older.md");
		const newer = join(project, "handoffs", "token_cost_runs", "newer.md");
		writeFileSync(older, "total_tokens: 1\n");
		writeFileSync(newer, "total_tokens: 42\n");
		const now = Date.now() / 1000;
		utimesSync(older, now - 20, now - 20);
		utimesSync(newer, now + 5, now + 5);
		const latest = readStatusSnapshot(project);
		assert.equal(latest.token_cost.total_tokens, 42);
		assert.equal(latest.app_health.reason_code, "APP_HEALTH_UNAVAILABLE");
		assert.equal(latest.index_health.reason_code, "INDEX_UNAVAILABLE");
		assert.equal(latest.browser_summary.probe_count, 0);
		assert.equal(latest.sovereign, null);
		assert.equal("store_path" in latest, false);
		assert.equal("transport" in latest, false);

		mkdirSync(join(project, "docs"), { recursive: true });
		writeFileSync(join(project, "docs", "walk-me.txt"), "BUG0028_SCAN_MARKER");
		for (const args of [["status"], ["status", "--help"]]) {
			const spawned = await spawnNode(cliEntry, args, project, lightEnv(parent, auth, trace));
			assert.equal(spawned.code, 0, spawned.stderr);
			assert.equal(spawned.stdout.includes("BUG0028_SCAN_MARKER"), false);
			assert.match(spawned.stdout, /"schema_version": 1/);
			assert.match(spawned.stdout, /"read_only": true/);
			assert.equal(spawned.stdout.includes("store_path"), false);
			assert.equal(spawned.stdout.includes("itsm - its-magic operator CLI"), false);
			assertNoHeavy(spawned);
			const body = JSON.parse(spawned.stdout) as { token_cost: { total_tokens: number } };
			assert.equal(body.token_cost.total_tokens, 42);
		}
		assert.equal(fileExists(join(project, ".its-magic", "runtime", "ops.sqlite")), false);
	} finally {
		rmSync(parent, { recursive: true, force: true });
	}
});

test("test_bug0028_workflow_tokens_keep_production_host", async () => {
	const index = read(cliEntry);
	const runner = read(join(cliDir, "run.ts"));
	assert.match(index, /await import\("@its-magic\/runtime-host"\)/);
	assert.match(index, /createRuntimeHost\(\{ projectRoot: process\.cwd\(\), lifetime: "direct-cli" \}\)/);
	assert.match(index, /return await runCliArgv\(argv,/);
	assert.match(index, /finally\s*\{[\s\S]*host\.dispose\(\)/);
	assert.equal(index.includes("probePolicy"), false);
	const hostGate = runner.indexOf("deps.host?.store");
	const probeCall = runner.indexOf("split.policyProbe ? await probePolicy");
	assert.ok(hostGate >= 0 && probeCall > hostGate);

	const dedicated = dedicatedCommands();
	assert.deepEqual(dedicated, ["ask", "status", "resume", "pause", "index", "app", "browser"]);
	for (const token of dedicated) {
		if (token === "status") {
			assert.equal(classifyCommand([token]), "status");
			continue;
		}
		assert.equal(classifyCommand([token]), "workflow", token);
	}
	for (const token of [...SCHEDULER_TOKENS, ...PHASE_TOKENS, "/status", "/ask"]) {
		assert.equal(classifyCommand([token]), "workflow", token);
	}
	assert.equal(classifyCommand(["--policy-probe", "ask"]), "workflow");
	assert.equal(classifyCommand(["--policy-probe", "status"]), "status");
	assert.equal(classifyCommand(["--policy-probe"]), "help");
	assert.equal(classifyCommand(["--bogus", "status"]), "workflow");
	assert.equal(classifyCommand(["status", "--help"]), "status");

	const { parent, project } = tempProject("flow-");
	const trace = join(parent, "trace.txt");
	const workflowEnv = childEnv(parent, trace, {
		BUG0028_STUB_HOST: "1",
		BUG0028_STUB_RUN: "1",
		BUG0028_FORBID_HEAVY: "0",
		BUG0028_FORBID_AUTH: "1",
	});
	try {
		const tokens = [
			...dedicated.filter((token) => token !== "status"),
			...SCHEDULER_TOKENS,
			...PHASE_TOKENS,
			"/status",
		];
		for (const token of tokens) {
			const spawned = await spawnNode(cliEntry, [token], project, workflowEnv);
			assert.equal(spawned.code, 0, `${token}\n${spawned.stderr}`);
			assert.match(spawned.trace, /IMPORT_HOST/, token);
			assert.match(spawned.trace, /"lifetime":"direct-cli"/, token);
			assert.match(spawned.trace, new RegExp(`RUN \\["${token.replace("/", "\\/")}"\\]`), token);
			const hostAt = spawned.trace.indexOf("HOST ");
			const runAt = spawned.trace.indexOf("RUN ");
			const disposeAt = spawned.trace.indexOf("DISPOSE");
			assert.ok(hostAt >= 0 && runAt > hostAt && disposeAt > runAt, spawned.trace);
		}
		const probed = await spawnNode(cliEntry, ["--policy-probe", "ask"], project, workflowEnv);
		assert.equal(probed.code, 0, probed.stderr);
		assert.match(probed.trace, /IMPORT_HOST/);
		assert.match(probed.trace, /RUN \["--policy-probe","ask"\]/);
		assert.ok(probed.trace.indexOf("HOST ") < probed.trace.indexOf("RUN "));
		const helpProbe = await spawnNode(cliEntry, ["--policy-probe"], project, lightEnv(parent, join(parent, "auth"), trace));
		assert.equal(helpProbe.code, 0, helpProbe.stderr);
		assert.match(helpProbe.stdout, /itsm - its-magic operator CLI/);
		assert.equal(helpProbe.trace.includes("IMPORT_HOST"), false, helpProbe.trace);
		assert.equal(helpProbe.trace.includes("RUN "), false, helpProbe.trace);
		const statusProbe = await spawnNode(
			cliEntry,
			["--policy-probe", "status"],
			project,
			lightEnv(parent, join(parent, "auth"), trace),
		);
		assert.equal(statusProbe.code, 0, statusProbe.stderr);
		assert.match(statusProbe.stdout, /"schema_version": 1/);
		assert.equal(statusProbe.trace.includes("IMPORT_HOST"), false, statusProbe.trace);
	} finally {
		rmSync(parent, { recursive: true, force: true });
	}
});

test("test_bug0028_installed_entrypoint_windows_and_linux", async () => {
	const index = read(cliEntry);
	const classifier = read(join(cliDir, "command-class.ts"));
	for (const source of [index, classifier]) {
		const specs = staticSpecifiers(source);
		assert.equal(specs.some((spec) => spec.includes("run.ts")), false, specs.join(","));
		assert.equal(specs.some((spec) => spec.includes("@its-magic/runtime-host")), false);
		assert.equal(specs.some((spec) => spec === "@its-magic/pi-kernel" || spec.endsWith("/pi-kernel")), false);
	}
	for (const name of ["index.ts", "command-class.ts", "local-command.ts", "status-snapshot.ts"]) {
		assert.equal(read(join(templateCliDir, name)), read(join(cliDir, name)), name);
	}
	const kernelExport = JSON.parse(read(join(standaloneRoot, "packages", "pi-kernel", "package.json"))) as {
		exports: Record<string, string>;
	};
	const templateExport = JSON.parse(
		read(join(repoRoot, "template", ".its-magic", "standalone", "packages", "pi-kernel", "package.json")),
	) as { exports: Record<string, string> };
	assert.equal(kernelExport.exports["./auth-runtime"], "./src/auth-runtime.ts");
	assert.deepEqual(templateExport.exports, kernelExport.exports);

	const locator = read(join(repoRoot, "bin", "itsm.js"));
	assert.match(locator, /spawnSync/);
	assert.match(locator, /ITSM_NODE_VERSION_UNSUPPORTED/);
	assert.equal(locator.includes("process.platform"), false);
	assert.equal(locator.includes("walkDocs"), false);
	const linuxLauncher = read(join(repoRoot, ".its-magic", "bin", "itsm"));
	const windowsLauncher = read(join(repoRoot, ".its-magic", "bin", "itsm.cmd"));
	assert.match(linuxLauncher, /#!\/usr\/bin\/env sh/);
	assert.match(linuxLauncher, /ITSM_NODE_VERSION_UNSUPPORTED/);
	assert.match(linuxLauncher, /exec node --experimental-strip-types/);
	assert.match(linuxLauncher, /standalone\/apps\/cli\/src\/index\.ts/);
	assert.match(windowsLauncher, /@echo off/);
	assert.match(windowsLauncher, /ITSM_NODE_VERSION_UNSUPPORTED/);
	assert.match(windowsLauncher, /node --experimental-strip-types/);
	assert.match(windowsLauncher, /standalone\\apps\\cli\\src\\index\.ts|standalone\/apps\/cli\/src\/index\.ts/);

	const parent = mkdtempSync(join(workRoot, "entry-"));
	const project = join(parent, "project");
	const src = join(project, ".its-magic", "standalone", "apps", "cli", "src");
	mkdirSync(src, { recursive: true });
	for (const name of ["index.ts", "command-class.ts", "local-command.ts", "status-snapshot.ts"]) {
		copyFileSync(join(cliDir, name), join(src, name));
	}
	const missing = join(parent, "missing");
	mkdirSync(missing, { recursive: true });
	try {
		const help = await spawnNode(
			join(repoRoot, "bin", "itsm.js"),
			["--help"],
			missing,
			childEnv(parent, join(parent, "trace.txt"), { ITSM_PROJECT_ROOT: project, BUG0028_FORBID_HEAVY: "1" }),
		);
		assert.equal(help.code, 0, help.stderr);
		assert.match(help.stdout, /itsm - its-magic operator CLI/);
		assert.equal(help.trace.includes("FORBIDDEN"), false, help.trace);
		const absent = await spawnNode(
			join(repoRoot, "bin", "itsm.js"),
			[],
			missing,
			childEnv(parent, join(parent, "missing-trace.txt"), { ITSM_PROJECT_ROOT: missing }),
		);
		assert.notEqual(absent.code, 0);
		assert.match(`${absent.stdout}\n${absent.stderr}`, /ITSM_RUNTIME_NOT_FOUND/);
	} finally {
		rmSync(parent, { recursive: true, force: true });
	}
});

test("test_bug0028_operator_doc_lightweight_versus_full_runtime", () => {
	const active = read(join(repoRoot, "its_magic", "README.md"));
	const template = read(join(repoRoot, "template", "its_magic", "README.md"));
	const paragraph = (text: string): string => {
		const start = text.indexOf("No-argument `itsm`");
		assert.ok(start >= 0, "lightweight paragraph missing");
		const end = text.indexOf("\n\n", start);
		assert.ok(end > start);
		return text.slice(start, end);
	};
	const activeParagraph = paragraph(active);
	const templateParagraph = paragraph(template);
	assert.equal(activeParagraph, templateParagraph);
	assert.match(activeParagraph, /No-argument `itsm`/);
	assert.match(activeParagraph, /`itsm help`/);
	assert.match(activeParagraph, /`--help`/);
	assert.match(activeParagraph, /`-h`/);
	assert.match(activeParagraph, /`itsm auth`/);
	assert.match(activeParagraph, /`itsm models`/);
	assert.match(activeParagraph, /bare `itsm status`/);
	assert.match(activeParagraph, /lightweight inspection and auth commands/);
	assert.match(activeParagraph, /Workflow\s+commands/);
	assert.match(activeParagraph, /`createRuntimeHost`/);
	assert.match(activeParagraph, /`ask`/);
	assert.match(activeParagraph, /`resume`/);
	assert.match(activeParagraph, /`pause`/);
	assert.match(activeParagraph, /`index`/);
	assert.match(activeParagraph, /`app`/);
	assert.match(activeParagraph, /`browser`/);
});

test.after(() => {
	rmSync(workRoot, { recursive: true, force: true });
});
