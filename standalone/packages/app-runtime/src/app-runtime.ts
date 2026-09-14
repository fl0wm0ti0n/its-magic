import { mkdirSync } from "node:fs";
import { connect } from "node:net";
import { tmpdir } from "node:os";
import { join } from "node:path";
import type { ConfigView } from "@its-magic/runtime-core";
import { createRunsStore, type RunsStore } from "@its-magic/runtime-core";
import {
	assertKnownBackend,
	type CommandExists,
	createDefaultBackends,
	resolveBackendId,
} from "./backends.ts";
import {
	APP_RUNTIME_CLEANUP_FAILED,
	APP_RUNTIME_HEALTH_FAILED,
	APP_RUNTIME_PROFILE_UNKNOWN,
	APP_RUNTIME_RESTART_CAP_EXHAUSTED,
	APP_RUNTIME_START_FAILED,
	AppRuntimeError,
	BACKEND_TIMEOUT,
	BACKEND_UNSUPPORTED,
	DEFAULT_RESTART_MAX,
	type FailureClass,
	PROCESS_CRASHED,
	PROCESS_ORPHAN_REAPED,
} from "./codes.ts";
import { persistEvidence, persistText, summarizeLogs } from "./logs.ts";
import { ProcessManager } from "./process-manager.ts";
import { discoverStack } from "./stack-profile.ts";
import type {
	AppRuntimeOptions,
	CleanupResult,
	ConnectHandoff,
	EvidenceRecord,
	ExecuteRequest,
	ExecuteResult,
	ExecutionBackend,
	HealthCheckResult,
	ManagedHandle,
	SelfDebugResult,
	StackDiscovery,
	StartRequest,
} from "./types.ts";

function lookupRestartMax(config?: ConfigView, env?: NodeJS.ProcessEnv, override?: number): number {
	if (typeof override === "number" && Number.isFinite(override) && override > 0) {
		return override;
	}
	const raw =
		env?.APP_RUNTIME_RESTART_MAX ??
		config?.shared?.APP_RUNTIME_RESTART_MAX ??
		config?.compat?.APP_RUNTIME_RESTART_MAX;
	const parsed = raw ? Number.parseInt(raw, 10) : Number.NaN;
	return Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_RESTART_MAX;
}

function classifyFailure(input: {
	exit_code?: number | null;
	reason_code?: string;
	timeout?: boolean;
	connectivity?: boolean;
	health_failed?: boolean;
	unsupported_stack?: boolean;
	unsupported_backend?: boolean;
}): FailureClass {
	if (input.unsupported_backend || input.reason_code === BACKEND_UNSUPPORTED) {
		return "unsupported_backend";
	}
	if (input.unsupported_stack) {
		return "unsupported_stack";
	}
	if (input.timeout || input.reason_code === BACKEND_TIMEOUT) {
		return "timeout";
	}
	if (input.connectivity || input.reason_code?.includes("CONNECTIVITY")) {
		return "connectivity";
	}
	if (input.health_failed || input.reason_code === APP_RUNTIME_HEALTH_FAILED) {
		return "health_failed";
	}
	if (input.reason_code === PROCESS_CRASHED || (input.exit_code != null && input.exit_code !== 0)) {
		return "crash";
	}
	return "start_failed";
}

async function defaultProbe(target: {
	url?: string;
	ports?: number[];
	health_path?: string;
}): Promise<{ ok: boolean; health: string }> {
	if (target.url && target.health_path) {
		const controller = new AbortController();
		const timer = setTimeout(() => controller.abort(), 1500);
		try {
			const res = await fetch(`${target.url.replace(/\/$/, "")}${target.health_path}`, {
				signal: controller.signal,
			});
			clearTimeout(timer);
			return { ok: res.ok, health: res.ok ? "ok" : "failed" };
		} catch {
			clearTimeout(timer);
		}
	}
	const ports = target.ports ?? [];
	for (const port of ports) {
		const ok = await tcpListen("127.0.0.1", port);
		if (ok) {
			return { ok: true, health: "ok" };
		}
	}
	if (!target.url && ports.length === 0) {
		return { ok: false, health: "unknown" };
	}
	return { ok: false, health: "failed" };
}

function tcpListen(host: string, port: number): Promise<boolean> {
	return new Promise((resolve) => {
		const socket = connect({ host, port }, () => {
			socket.end();
			resolve(true);
		});
		socket.setTimeout(400, () => {
			socket.destroy();
			resolve(false);
		});
		socket.on("error", () => resolve(false));
	});
}

export class AppRuntime {
	readonly store: RunsStore;
	readonly processes: ProcessManager;
	private readonly logsDir: string;
	private readonly backends: Record<string, ExecutionBackend>;
	private readonly restartMax: number;
	private readonly now: () => Date;
	private readonly sessionSupervisor?: AppRuntimeOptions["sessionSupervisor"];
	private readonly probe: NonNullable<AppRuntimeOptions["probe"]>;
	private readonly orchestrator_run_id: string;
	private readonly model_id: string;
	private readonly dockerHealth = new Map<string, HealthCheckResult["healthcheck_status"]>();

	constructor(options: AppRuntimeOptions = {}) {
		this.store = options.store ?? createRunsStore(":memory:");
		this.logsDir = options.logsDir ?? join(tmpdir(), "its-magic-runtime-logs");
		mkdirSync(this.logsDir, { recursive: true });
		this.processes = new ProcessManager(this.store, this.logsDir);
		const commandExists: CommandExists = options.commandExists ?? (() => false);
		this.backends = options.backends ?? createDefaultBackends(commandExists);
		this.restartMax = lookupRestartMax(options.config, options.env, options.restartMax);
		this.now = options.now ?? (() => new Date());
		this.sessionSupervisor = options.sessionSupervisor;
		this.probe = options.probe ?? defaultProbe;
		this.orchestrator_run_id = options.orchestrator_run_id ?? "local";
		this.model_id = options.model_id ?? "fake";
	}

	discover(
		cwd: string,
		overrides?: { start_command?: string; DEV_SERVER_COMMAND?: string },
	): StackDiscovery {
		return discoverStack(cwd, overrides);
	}

	backend(id: string): ExecutionBackend {
		assertKnownBackend(id);
		const resolved = resolveBackendId(id);
		const backend = this.backends[resolved] ?? this.backends[id];
		if (!backend) {
			throw new AppRuntimeError(BACKEND_UNSUPPORTED, `no adapter for ${id}`);
		}
		return backend;
	}

	async start(req: StartRequest): Promise<ManagedHandle> {
		let stack: StackDiscovery | undefined;
		try {
			stack = this.discover(req.cwd, {
				start_command: req.command,
			});
		} catch (err) {
			if (req.command) {
				stack = { profile: null, start_command: req.command };
			} else if (err instanceof AppRuntimeError) {
				throw err;
			} else {
				throw new AppRuntimeError(APP_RUNTIME_PROFILE_UNKNOWN);
			}
		}
		const command = req.command ?? stack?.start_command;
		if (!command) {
			throw new AppRuntimeError(APP_RUNTIME_PROFILE_UNKNOWN, "no start command");
		}
		const backendId = resolveBackendId(req.backend ?? "local");
		const backend = this.backend(backendId);
		const health = await backend.health_check();
		if (!health.ok) {
			throw new AppRuntimeError(health.reason_code ?? APP_RUNTIME_START_FAILED);
		}
		let exec: ExecuteResult;
		try {
			exec = await backend.execute({
				command,
				args: req.args,
				cwd: req.cwd,
				signal: req.signal,
				timeoutMs: req.timeoutMs,
				wait: false,
				identity: req.id,
			});
		} catch (err) {
			if (err instanceof AppRuntimeError) {
				throw err;
			}
			throw new AppRuntimeError(APP_RUNTIME_START_FAILED, String(err));
		}
		if (req.signal?.aborted) {
			throw new AppRuntimeError(APP_RUNTIME_CLEANUP_FAILED, "cancelled");
		}
		if (exec.exit_code != null && exec.exit_code !== 0) {
			throw new AppRuntimeError(PROCESS_CRASHED, "start command crashed");
		}
		const handle: ManagedHandle = {
			id: req.id,
			run_id: req.run_id,
			phase_id: req.phase_id,
			backend: backend.name(),
			identity_kind: req.identity_kind ?? (backend.name() === "docker" ? "container" : "process"),
			identity: exec.identity ?? req.id,
			command,
			cwd: req.cwd,
			ports: req.ports ?? [],
			url: req.url ?? (req.ports?.[0] ? `http://127.0.0.1:${req.ports[0]}` : ""),
			health_path: req.health_path ?? "/health",
			readiness: "starting",
			started_at: this.now().toISOString(),
			crash_count: 0,
			restart_count: 0,
			log_ring_ref: "",
			health: "unknown",
			env_refs: req.env_refs ?? [],
		};
		this.processes.track(handle);
		if (exec.stdout) {
			this.processes.appendLog(req.id, exec.stdout);
		}
		if (exec.stderr) {
			this.processes.appendLog(req.id, exec.stderr);
		}
		const probed = await this.probe({
			url: handle.url || undefined,
			ports: handle.ports,
			health_path: handle.health_path,
		});
		if (!probed.ok && (handle.url || handle.ports.length > 0)) {
			this.processes.updateReadiness(handle.id, "unhealthy", probed.health);
			throw new AppRuntimeError(APP_RUNTIME_HEALTH_FAILED);
		}
		this.processes.updateReadiness(handle.id, "ready", probed.ok ? "ok" : handle.health);
		return this.processes.get(handle.id) as ManagedHandle;
	}

	async stop(id: string): Promise<void> {
		await this.processes.stop(id);
	}

	async restart(id: string): Promise<ManagedHandle> {
		const existing = this.processes.get(id);
		if (!existing) {
			throw new AppRuntimeError(APP_RUNTIME_START_FAILED, "unknown handle");
		}
		if (existing.restart_count >= this.restartMax) {
			throw new AppRuntimeError(APP_RUNTIME_RESTART_CAP_EXHAUSTED);
		}
		const snapshot = { ...existing };
		await this.stop(id);
		const started = await this.start({
			id: snapshot.id,
			run_id: snapshot.run_id,
			phase_id: snapshot.phase_id,
			cwd: snapshot.cwd,
			backend: snapshot.backend,
			command: snapshot.command,
			ports: snapshot.ports,
			url: snapshot.url,
			health_path: snapshot.health_path,
			identity_kind: snapshot.identity_kind,
			env_refs: snapshot.env_refs,
		});
		started.restart_count = snapshot.restart_count + 1;
		started.crash_count = snapshot.crash_count;
		this.processes.track(started);
		return started;
	}

	async health(id: string): Promise<{ ok: boolean; health: string; healthcheck_status?: string }> {
		const handle = this.processes.get(id);
		if (!handle) {
			return { ok: false, health: "missing" };
		}
		const probed = await this.probe({
			url: handle.url || undefined,
			ports: handle.ports,
			health_path: handle.health_path,
		});
		const dockerStatus = this.dockerHealth.get(id);
		this.processes.updateReadiness(handle.id, probed.ok ? "ready" : "unhealthy", probed.health);
		return {
			ok: probed.ok,
			health: probed.health,
			healthcheck_status: dockerStatus ?? "none",
		};
	}

	/** HEALTHCHECK is status-only. AppRuntime owns restart. */
	recordHealthcheckStatus(id: string, status: HealthCheckResult["healthcheck_status"]): void {
		this.dockerHealth.set(id, status ?? "none");
	}

	logs(id: string, bound = 256): string[] {
		return this.processes.ring(id).slice(-bound);
	}

	connectHandoff(id: string): ConnectHandoff {
		const handle = this.processes.get(id);
		if (!handle) {
			throw new AppRuntimeError(APP_RUNTIME_HEALTH_FAILED, "no handle for connect");
		}
		return {
			connect_endpoint: handle.url,
			health_path: handle.health_path,
			service_id: handle.identity_kind === "service" ? handle.identity : handle.id,
			container_id: handle.identity_kind === "container" ? handle.identity : "",
			env_refs: handle.env_refs,
			url: handle.url,
			ports: handle.ports,
			health: handle.health,
		};
	}

	async runCommand(
		req: ExecuteRequest & { backend?: string; id?: string },
	): Promise<EvidenceRecord> {
		const backend = this.backend(req.backend ?? "local");
		const health = await backend.health_check();
		if (!health.ok) {
			throw new AppRuntimeError(health.reason_code ?? APP_RUNTIME_START_FAILED);
		}
		const result = await backend.execute(req);
		const id = req.id ?? `cmd-${Date.now()}`;
		const stdout_ref = persistText(this.logsDir, `${id}.stdout.log`, result.stdout);
		const stderr_ref = persistText(this.logsDir, `${id}.stderr.log`, result.stderr);
		const evidence: EvidenceRecord = {
			command: result.command,
			backend: result.backend,
			exit_code: result.exit_code,
			duration_ms: result.duration_ms,
			stdout_ref,
			stderr_ref,
			reason_code: result.reason_code,
		};
		persistEvidence(this.logsDir, id, evidence);
		summarizeLogs(`${result.stdout}\n${result.stderr}`);
		return evidence;
	}

	summarize(text: string): string {
		return summarizeLogs(text);
	}

	async selfDebug(
		id: string,
		opts?: { classify?: FailureClass; spawnDev?: boolean },
	): Promise<SelfDebugResult> {
		const handle = this.processes.get(id);
		if (!handle) {
			throw new AppRuntimeError(APP_RUNTIME_START_FAILED, "unknown handle");
		}
		const classified =
			opts?.classify ??
			classifyFailure({
				health_failed: handle.health !== "ok",
			});
		let attempts = 0;
		let dev_session_id: string | undefined;
		let restartCount = handle.restart_count;
		while (restartCount < this.restartMax) {
			attempts += 1;
			if (opts?.spawnDev !== false && this.sessionSupervisor) {
				const spawned = await this.sessionSupervisor.spawn({
					phase_id: "execute",
					role_id: "dev",
					orchestrator_run_id: this.orchestrator_run_id,
					model_id: this.model_id,
				});
				dev_session_id = spawned.kernel_session_id;
			}
			try {
				const restarted = await this.restart(id);
				restartCount = restarted.restart_count;
				const after = await this.health(id);
				if (after.ok) {
					return {
						attempts,
						restart_count: restartCount,
						classified,
						dev_session_id,
						exhausted: false,
						healthcheck_status: this.dockerHealth.get(id) ?? "none",
					};
				}
			} catch (err) {
				if (err instanceof AppRuntimeError && err.code === APP_RUNTIME_RESTART_CAP_EXHAUSTED) {
					return {
						attempts,
						restart_count: restartCount,
						classified,
						reason_code: APP_RUNTIME_RESTART_CAP_EXHAUSTED,
						dev_session_id,
						exhausted: true,
						healthcheck_status: this.dockerHealth.get(id) ?? "none",
					};
				}
				restartCount += 1;
				const live = this.processes.get(id);
				if (live) {
					live.restart_count = restartCount;
					this.processes.track(live);
				}
			}
		}
		return {
			attempts,
			restart_count: this.processes.get(id)?.restart_count ?? handle.restart_count,
			classified,
			reason_code: APP_RUNTIME_RESTART_CAP_EXHAUSTED,
			dev_session_id,
			exhausted: true,
			healthcheck_status: this.dockerHealth.get(id) ?? "none",
		};
	}

	async cleanup(
		reason: "success" | "failure" | "cancel" | "runtime_restart",
	): Promise<CleanupResult> {
		try {
			const stopped = await this.processes.stopAll();
			const reaped = await this.processes.reapOrphans();
			return {
				stopped,
				reaped,
				reason_code: reason === "cancel" ? APP_RUNTIME_CLEANUP_FAILED : undefined,
			};
		} catch (err) {
			throw new AppRuntimeError(
				APP_RUNTIME_CLEANUP_FAILED,
				err instanceof Error ? err.message : String(err),
			);
		}
	}

	async reapOrphans(): Promise<{ reaped: string[]; reason_code: typeof PROCESS_ORPHAN_REAPED }> {
		const reaped = await this.processes.reapOrphans();
		return { reaped, reason_code: PROCESS_ORPHAN_REAPED };
	}

	getRestartMax(): number {
		return this.restartMax;
	}

	classifyFailure = classifyFailure;
}

export function createAppRuntime(options: AppRuntimeOptions = {}): AppRuntime {
	return new AppRuntime(options);
}
