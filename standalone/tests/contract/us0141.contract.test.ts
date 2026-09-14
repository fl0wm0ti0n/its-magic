import assert from "node:assert/strict";
import {
	existsSync,
	mkdirSync,
	mkdtempSync,
	readdirSync,
	readFileSync,
	writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
	APP_RUNTIME_RESTART_CAP_EXHAUSTED,
	APP_RUNTIME_UNSUPPORTED_STACK,
	AppRuntimeError,
	BACKEND_CONNECTIVITY_FAILED,
	BACKEND_DOCKER_UNAVAILABLE,
	BACKEND_TIMEOUT,
	BACKEND_UNKNOWN,
	BACKEND_UNSUPPORTED,
	BACKEND_WSL_UNAVAILABLE,
	createAppRuntime,
	DEFAULT_LOG_BUDGET_BYTES,
	DEFAULT_RESTART_MAX,
	type DockerClient,
	detectStackProfile,
	type ExecuteRequest,
	type ExecuteResult,
	type ExecutionBackend,
	type HealthCheckResult,
	isAppRuntimeError,
	LAYER_B_PROFILES,
	PROCESS_CRASHED,
	PROCESS_ORPHAN_REAPED,
	redactLogLine,
} from "../../packages/app-runtime/src/index.ts";
import { createRunsStore, RUNTIME_GITIGNORE_GLOB } from "../../packages/runtime-core/src/index.ts";

const HERE = dirname(fileURLToPath(import.meta.url));
const STANDALONE_ROOT = join(HERE, "..", "..");
const KIT_ROOT = join(STANDALONE_ROOT, "..");
const APP_ROOT = join(STANDALONE_ROOT, "packages", "app-runtime");
const CORE_ROOT = join(STANDALONE_ROOT, "packages", "runtime-core");

const FORBIDDEN_IMPORTS = [
	"@earendil-works/pi-",
	"@cortexkit/aft-pi",
	"@cortexkit/aft-opencode",
	"@cortexkit/aft-bridge",
	"@temporalio/",
	"@langchain/",
	"langgraph",
	"playwright",
	"puppeteer",
	"chrome-remote-interface",
];

const MARKERS = [
	"test_us0141_app_runtime_lifecycle",
	"test_us0141_process_manager_identity",
	"test_us0141_backend_local_docker_core",
	"test_us0141_backend_wsl_ssh_adapters",
	"test_us0141_stack_profiles",
	"test_us0141_self_debug_cap",
	"test_us0141_test_build_evidence",
	"test_us0141_connect_handoff_no_browser",
	"test_us0141_cleanup_success_fail_cancel",
	"test_us0141_chaos_crash_timeout_restart",
	"test_us0141_chaos_docker_remote_disconnect",
	"test_us0141_unsupported_backend",
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
	assert.equal(pkg.name, "@its-magic/app-runtime");
	const deps = { ...(pkg.dependencies ?? {}), ...(pkg.devDependencies ?? {}) };
	for (const key of Object.keys(deps)) {
		assert.equal(key.startsWith("@earendil-works/pi-"), false, key);
		assert.equal(key.startsWith("@cortexkit/aft-"), false, key);
		assert.equal(key.includes("dockerode"), false, key);
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
		if (text.includes("readFileSync") && text.includes(".env") && !text.includes("never")) {
			hits.push(`${path}:dotenv-read`);
		}
	}
	assert.deepEqual(hits, []);
}

class ScriptedBackend implements ExecutionBackend {
	crashNext = false;
	timeoutNext = false;
	disconnectNext = false;
	private readonly id: string;
	private readonly health: HealthCheckResult;
	constructor(id: string, health: HealthCheckResult) {
		this.id = id;
		this.health = health;
	}
	name(): string {
		return this.id;
	}
	async health_check(): Promise<HealthCheckResult> {
		if (this.disconnectNext) {
			return { ok: false, backend: this.id, reason_code: BACKEND_CONNECTIVITY_FAILED };
		}
		return this.health;
	}
	async execute(req: ExecuteRequest): Promise<ExecuteResult> {
		if (this.timeoutNext) {
			throw new AppRuntimeError(BACKEND_TIMEOUT, "scripted timeout");
		}
		if (this.crashNext) {
			return {
				command: req.command,
				backend: this.id,
				exit_code: 1,
				duration_ms: 5,
				stdout: "",
				stderr: "crash",
				identity: req.identity ?? this.id,
				reason_code: PROCESS_CRASHED,
			};
		}
		return {
			command: req.command,
			backend: this.id,
			exit_code: req.wait === false ? null : 0,
			duration_ms: 12,
			stdout: "started Authorization: secret-token Cookie: a=b",
			stderr: "",
			identity: req.identity ?? `${this.id}-1`,
		};
	}
}

function fakeDockerClient(opts: { binary?: boolean; daemon?: boolean } = {}): DockerClient {
	return {
		binaryPresent: () => opts.binary !== false,
		daemonReachable: async () => opts.daemon !== false && opts.binary !== false,
		run: async (args, req) => ({
			command: ["docker", ...args].join(" "),
			backend: "docker",
			exit_code: 0,
			duration_ms: 8,
			stdout: "ok",
			stderr: "",
			identity: req?.identity ?? "container-1",
		}),
		healthcheckStatus: async () => "unhealthy",
	};
}

function runtime(extra?: {
	backends?: Record<string, ExecutionBackend>;
	probeOk?: boolean;
	restartMax?: number;
	spawnDev?: boolean;
}) {
	const local = new ScriptedBackend("local", { ok: true, backend: "local" });
	const docker = new ScriptedBackend("docker", { ok: true, backend: "docker" });
	const wsl = new ScriptedBackend("wsl", {
		ok: false,
		backend: "wsl",
		reason_code: BACKEND_WSL_UNAVAILABLE,
	});
	const ssh = new ScriptedBackend("ssh", { ok: true, backend: "ssh" });
	const remote = new ScriptedBackend("remote-docker", { ok: true, backend: "remote-docker" });
	const micro = new ScriptedBackend("micro-vm", {
		ok: false,
		backend: "micro-vm",
		reason_code: BACKEND_UNSUPPORTED,
	});
	micro.execute = async () => {
		throw new AppRuntimeError(BACKEND_UNSUPPORTED);
	};
	const logsDir = mkdtempSync(join(tmpdir(), "itsm-us0141-XXXXXX"));
	const store = createRunsStore(":memory:");
	let probeOk = extra?.probeOk ?? true;
	const spawned: string[] = [];
	const app = createAppRuntime({
		store,
		logsDir,
		restartMax: extra?.restartMax,
		backends: extra?.backends ?? {
			local,
			docker,
			wsl,
			ssh,
			"remote-docker": remote,
			"micro-vm": micro,
			sandbox: micro,
		},
		probe: async () => ({ ok: probeOk, health: probeOk ? "ok" : "failed" }),
		sessionSupervisor:
			extra?.spawnDev === false
				? undefined
				: {
						spawn: async () => {
							const id = `dev-${spawned.length + 1}`;
							spawned.push(id);
							return { kernel_session_id: id };
						},
					},
		commandExists: () => false,
		now: () => new Date("2026-09-14T01:10:00Z"),
	});
	return {
		app,
		store,
		local,
		docker,
		wsl,
		ssh,
		remote,
		micro,
		spawned,
		setProbeOk: (v: boolean) => {
			probeOk = v;
		},
		logsDir,
	};
}

test("test_us0141_app_runtime_lifecycle", async () => {
	assertNoPi(APP_ROOT);
	const pkg = JSON.parse(readFileSync(join(APP_ROOT, "package.json"), "utf8"));
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
	assert.equal(biome.includes("packages/app-runtime"), false);
	assert.equal(existsSync(join(STANDALONE_ROOT, "packages", "execution-runtime")), false);
	const dir = mkdtempSync(join(tmpdir(), "itsm-us0141-stack-XXXXXX"));
	writeFileSync(join(dir, "package.json"), '{"name":"demo"}', "utf8");
	const { app } = runtime();
	const discovered = app.discover(dir);
	assert.equal(discovered.profile, "node");
	const handle = await app.start({
		id: "p1",
		run_id: "run-1",
		phase_id: "execute",
		cwd: dir,
		command: "node server.js",
		ports: [3000],
		url: "http://127.0.0.1:3000",
	});
	assert.equal(handle.readiness, "ready");
	const health = await app.health("p1");
	assert.equal(health.ok, true);
	const restarted = await app.restart("p1");
	assert.equal(restarted.restart_count, 1);
	app.processes.appendLog("p1", "line-1");
	const logs = app.logs("p1", 256);
	assert.ok(logs.length >= 1);
	assert.ok(logs.length <= 256);
	await app.stop("p1");
	assert.equal(app.processes.get("p1"), undefined);
});

test("test_us0141_process_manager_identity", async () => {
	const { app, store } = runtime();
	store.reserveProcessHandle("ph-claim", "run-2");
	const handle = await app.start({
		id: "ph-claim",
		run_id: "run-2",
		phase_id: "qa",
		cwd: ".",
		command: "node app.js",
		ports: [8080],
		url: "http://127.0.0.1:8080",
		identity_kind: "process",
		env_refs: ["DEV_SERVER_PORT"],
	});
	assert.equal(handle.identity_kind, "process");
	assert.equal(handle.command, "node app.js");
	assert.equal(handle.cwd, ".");
	assert.deepEqual(handle.ports, [8080]);
	assert.equal(handle.url, "http://127.0.0.1:8080");
	assert.equal(handle.readiness, "ready");
	assert.equal(handle.started_at, "2026-09-14T01:10:00.000Z");
	assert.ok(handle.log_ring_ref);
	assert.equal(handle.crash_count, 0);
	assert.equal(handle.restart_count, 0);
	assert.equal(handle.run_id, "run-2");
	assert.equal(handle.phase_id, "qa");
	const listed = store.listProcessHandlesForRun("run-2");
	assert.equal(listed.length, 1);
	assert.equal(listed[0]?.id, "ph-claim");
	assert.equal(listed[0]?.reserved, 0);
	assert.equal(listed[0]?.backend, "local");
	app.processes.recordCrash("ph-claim");
	assert.equal(app.processes.get("ph-claim")?.crash_count, 1);
	const gitignore = readFileSync(join(KIT_ROOT, ".gitignore"), "utf8");
	assert.equal(gitignore.includes(RUNTIME_GITIGNORE_GLOB), true);
});

test("test_us0141_backend_local_docker_core", async () => {
	const local = new ScriptedBackend("local", { ok: true, backend: "local" });
	const docker = new ScriptedBackend("docker", { ok: true, backend: "docker" });
	const { app } = runtime({
		backends: {
			local,
			docker,
			wsl: docker,
			ssh: docker,
			"remote-docker": docker,
			"micro-vm": docker,
		},
	});
	const localHealth = await app.backend("local").health_check();
	assert.equal(localHealth.ok, true);
	const dockerHealth = await app.backend("docker").health_check();
	assert.equal(dockerHealth.ok, true);
	const evidence = await app.runCommand({
		command: "node",
		args: ["-e", "process.exit(0)"],
		backend: "local",
		id: "build-1",
		wait: true,
	});
	assert.equal(evidence.backend, "local");
	assert.equal(evidence.exit_code, 0);
	assert.ok(typeof evidence.duration_ms === "number");
	assert.ok(evidence.stdout_ref);
	assert.ok(evidence.stderr_ref);
	const missing = new ScriptedBackend("docker", {
		ok: false,
		backend: "docker",
		reason_code: BACKEND_DOCKER_UNAVAILABLE,
	});
	const unavailable = createAppRuntime({
		store: createRunsStore(":memory:"),
		backends: { local, docker: missing },
		commandExists: () => false,
		probe: async () => ({ ok: true, health: "ok" }),
	});
	await assert.rejects(
		() => unavailable.runCommand({ command: "docker compose up", backend: "docker" }),
		(err: unknown) => {
			assert.equal(isAppRuntimeError(err), true);
			assert.equal((err as AppRuntimeError).code, BACKEND_DOCKER_UNAVAILABLE);
			return true;
		},
	);
	const client = fakeDockerClient({ binary: false });
	assert.equal(client.binaryPresent(), false);
	assert.equal(await client.healthcheckStatus("c1"), "unhealthy");
});

test("test_us0141_backend_wsl_ssh_adapters", async () => {
	const { app, wsl, ssh } = runtime();
	const wslHealth = await app.backend("wsl").health_check();
	assert.equal(wslHealth.ok, false);
	assert.equal(wslHealth.reason_code, BACKEND_WSL_UNAVAILABLE);
	await assert.rejects(
		() => app.runCommand({ command: "echo", backend: "wsl" }),
		(err: unknown) => (err as AppRuntimeError).code === BACKEND_WSL_UNAVAILABLE,
	);
	const sshHealth = await app.backend("ssh").health_check();
	assert.equal(sshHealth.ok, true);
	ssh.disconnectNext = true;
	const remote = app.backend("remote-docker");
	assert.equal(remote.name(), "remote-docker");
	wsl.timeoutNext = true;
	assert.equal(typeof wsl.name(), "string");
});

test("test_us0141_stack_profiles", () => {
	const root = mkdtempSync(join(tmpdir(), "itsm-us0141-profiles-XXXXXX"));
	const nodeDir = join(root, "node");
	mkdirSync(nodeDir);
	writeFileSync(join(nodeDir, "package.json"), "{}", "utf8");
	assert.equal(detectStackProfile(nodeDir), "node");
	const pyDir = join(root, "py");
	mkdirSync(pyDir);
	writeFileSync(join(pyDir, "pyproject.toml"), "[project]\n", "utf8");
	assert.equal(detectStackProfile(pyDir), "python");
	const goDir = join(root, "go");
	mkdirSync(goDir);
	writeFileSync(join(goDir, "go.mod"), "module x\n", "utf8");
	assert.equal(detectStackProfile(goDir), "go");
	const csDir = join(root, "cs");
	mkdirSync(csDir);
	writeFileSync(join(csDir, "App.csproj"), "<Project></Project>", "utf8");
	assert.equal(detectStackProfile(csDir), "dotnet");
	const javaDir = join(root, "java");
	mkdirSync(javaDir);
	writeFileSync(join(javaDir, "pom.xml"), "<project></project>", "utf8");
	assert.equal(detectStackProfile(javaDir), "java");
	const unknown = join(root, "unknown");
	mkdirSync(unknown);
	assert.equal(detectStackProfile(unknown), null);
	const { app } = runtime();
	assert.throws(
		() => app.discover(unknown),
		(err: unknown) => (err as AppRuntimeError).code === APP_RUNTIME_UNSUPPORTED_STACK,
	);
	const fallback = app.discover(unknown, { DEV_SERVER_COMMAND: "my-server" });
	assert.equal(fallback.start_command, "my-server");
	assert.equal(fallback.profile, null);
});

test("test_us0141_self_debug_cap", async () => {
	const { app, spawned, setProbeOk } = runtime({ restartMax: 3, spawnDev: true });
	assert.equal(app.getRestartMax(), DEFAULT_RESTART_MAX);
	const handle = await app.start({
		id: "dbg",
		run_id: "run-dbg",
		phase_id: "execute",
		cwd: ".",
		command: "node app.js",
		ports: [9],
		url: "http://127.0.0.1:9",
	});
	app.recordHealthcheckStatus("dbg", "unhealthy");
	const statusOnly = await app.health("dbg");
	assert.equal(statusOnly.healthcheck_status, "unhealthy");
	assert.equal(handle.restart_count, 0);
	setProbeOk(false);
	const result = await app.selfDebug("dbg", { classify: "health_failed", spawnDev: true });
	assert.equal(result.exhausted, true);
	assert.equal(result.reason_code, APP_RUNTIME_RESTART_CAP_EXHAUSTED);
	assert.equal(result.classified, "health_failed");
	assert.ok(result.restart_count >= 3);
	assert.ok(spawned.length >= 1);
	assert.equal(result.healthcheck_status, "unhealthy");
});

test("test_us0141_test_build_evidence", async () => {
	const { app, logsDir } = runtime();
	const evidence = await app.runCommand({
		command: "npm",
		args: ["test"],
		backend: "local",
		id: "tbe",
		wait: true,
	});
	assert.equal(evidence.command.includes("npm"), true);
	assert.equal(evidence.backend, "local");
	assert.equal(typeof evidence.exit_code, "number");
	assert.equal(typeof evidence.duration_ms, "number");
	assert.ok(existsSync(evidence.stdout_ref));
	assert.ok(existsSync(evidence.stderr_ref));
	const big = `${"ok\n".repeat(4000)}error boom\n${"z\n".repeat(4000)}`;
	const summary = app.summarize(big);
	assert.ok(Buffer.byteLength(summary, "utf8") <= DEFAULT_LOG_BUDGET_BYTES);
	assert.equal(summary.includes("error boom"), true);
	const persisted = readFileSync(join(logsDir, "evidence-tbe.json"), "utf8");
	const parsed = JSON.parse(persisted) as { stdout_ref: string; stderr_ref: string };
	assert.equal(typeof parsed.stdout_ref, "string");
});

test("test_us0141_connect_handoff_no_browser", async () => {
	const { app } = runtime();
	await app.start({
		id: "web",
		run_id: "run-web",
		phase_id: "execute",
		cwd: ".",
		command: "node server.js",
		ports: [4173],
		url: "http://127.0.0.1:4173",
		health_path: "/health",
		identity_kind: "service",
		env_refs: ["DEV_SERVER_PORT"],
	});
	const handoff = app.connectHandoff("web");
	assert.equal(handoff.connect_endpoint, "http://127.0.0.1:4173");
	assert.equal(handoff.health_path, "/health");
	assert.equal(handoff.service_id, "web");
	assert.equal(typeof handoff.container_id, "string");
	assert.deepEqual(handoff.env_refs, ["DEV_SERVER_PORT"]);
	assert.deepEqual(handoff.ports, [4173]);
	assert.equal(handoff.health, "ok");
	const src = walkFiles(APP_ROOT)
		.map((p) => readFileSync(p, "utf8"))
		.join("\n");
	assert.equal(src.includes("playwright"), false);
	assert.equal(src.includes("puppeteer"), false);
	assert.equal(/chrome-remote-interface|CDP\b/.test(src), false);
	const redacted = redactLogLine("Authorization: Bearer abc Cookie: sess=1");
	assert.equal(redacted.includes("abc"), false);
	assert.equal(redacted.includes("[redacted]"), true);
});

test("test_us0141_cleanup_success_fail_cancel", async () => {
	const { app } = runtime();
	await app.start({
		id: "c1",
		run_id: "run-c",
		phase_id: "execute",
		cwd: ".",
		command: "node a.js",
	});
	const success = await app.cleanup("success");
	assert.deepEqual(success.stopped, ["c1"]);
	await app.start({
		id: "c2",
		run_id: "run-c",
		phase_id: "execute",
		cwd: ".",
		command: "node b.js",
	});
	const fail = await app.cleanup("failure");
	assert.ok(fail.stopped.includes("c2"));
	const ac = new AbortController();
	ac.abort();
	await assert.rejects(
		() =>
			app.start({
				id: "c3",
				run_id: "run-c",
				phase_id: "execute",
				cwd: ".",
				command: "node c.js",
				signal: ac.signal,
			}),
		(err: unknown) => isAppRuntimeError(err),
	);
	await app.start({
		id: "c4",
		run_id: "run-c",
		phase_id: "execute",
		cwd: ".",
		command: "node d.js",
	});
	const restartCleanup = await app.cleanup("runtime_restart");
	assert.ok(restartCleanup.stopped.includes("c4"));
	await app.start({
		id: "orphan",
		run_id: "run-c",
		phase_id: "execute",
		cwd: ".",
		command: "node e.js",
	});
	const live = app.processes.get("orphan");
	if (live) {
		live.readiness = "stopped";
	}
	const reaped = await app.reapOrphans();
	assert.equal(reaped.reason_code, PROCESS_ORPHAN_REAPED);
	assert.ok(reaped.reaped.includes("orphan"));
});

test("test_us0141_chaos_crash_timeout_restart", async () => {
	const { app, local } = runtime({ restartMax: 3 });
	local.crashNext = true;
	await assert.rejects(
		() =>
			app.start({
				id: "crash",
				run_id: "run-chaos",
				phase_id: "execute",
				cwd: ".",
				command: "node boom.js",
			}),
		(err: unknown) => (err as AppRuntimeError).code === PROCESS_CRASHED,
	);
	local.crashNext = false;
	local.timeoutNext = true;
	await assert.rejects(
		() =>
			app.start({
				id: "to",
				run_id: "run-chaos",
				phase_id: "execute",
				cwd: ".",
				command: "node slow.js",
			}),
		(err: unknown) => (err as AppRuntimeError).code === BACKEND_TIMEOUT,
	);
	local.timeoutNext = false;
	const handle = await app.start({
		id: "rst",
		run_id: "run-chaos",
		phase_id: "execute",
		cwd: ".",
		command: "node app.js",
		ports: [1],
		url: "http://127.0.0.1:1",
	});
	handle.restart_count = 3;
	app.processes.track(handle);
	await assert.rejects(
		() => app.restart("rst"),
		(err: unknown) => (err as AppRuntimeError).code === APP_RUNTIME_RESTART_CAP_EXHAUSTED,
	);
});

test("test_us0141_chaos_docker_remote_disconnect", async () => {
	const { app, docker, remote } = runtime();
	const stack = await app.start({
		id: "dck",
		run_id: "run-d",
		phase_id: "execute",
		cwd: ".",
		backend: "docker",
		command: "docker compose up",
		identity_kind: "container",
		ports: [80],
		url: "http://127.0.0.1:80",
	});
	assert.equal(stack.identity_kind, "container");
	docker.disconnectNext = true;
	await assert.rejects(
		() => app.runCommand({ command: "docker compose ps", backend: "docker" }),
		(err: unknown) =>
			(err as AppRuntimeError).code === BACKEND_CONNECTIVITY_FAILED ||
			(err as AppRuntimeError).code === BACKEND_DOCKER_UNAVAILABLE,
	);
	remote.disconnectNext = true;
	const remoteHealth = await app.backend("remote-docker").health_check();
	assert.equal(remoteHealth.reason_code, BACKEND_CONNECTIVITY_FAILED);
	await assert.rejects(
		() => app.runCommand({ command: "docker info", backend: "remote-docker" }),
		(err: unknown) => (err as AppRuntimeError).code === BACKEND_CONNECTIVITY_FAILED,
	);
});

test("test_us0141_unsupported_backend", async () => {
	const { app } = runtime();
	assert.equal(LAYER_B_PROFILES.untrusted_repo, "micro-vm");
	await assert.rejects(
		() => app.runCommand({ command: "firecracker", backend: "micro-vm" }),
		(err: unknown) => (err as AppRuntimeError).code === BACKEND_UNSUPPORTED,
	);
	assert.throws(
		() => app.backend("not-a-backend"),
		(err: unknown) => (err as AppRuntimeError).code === BACKEND_UNKNOWN,
	);
	const health = await app.backend("micro-vm").health_check();
	assert.equal(health.ok, false);
	assert.equal(health.reason_code, BACKEND_UNSUPPORTED);
	assert.notEqual(health.reason_code, undefined);
	const src = readFileSync(join(APP_ROOT, "src", "app-runtime.ts"), "utf8");
	assert.equal(src.includes("fallback to local"), false);
	const self = readFileSync(join(HERE, "us0141.contract.test.ts"), "utf8");
	for (const marker of MARKERS) {
		assert.equal(self.includes(`test("${marker}"`), true, marker);
	}
	assert.equal(existsSync(join(CORE_ROOT, "src", "runs", "store.ts")), true);
});
