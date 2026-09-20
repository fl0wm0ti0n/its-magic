import { type ChildProcess, spawn, spawnSync } from "node:child_process";
import {
	APP_RUNTIME_START_FAILED,
	AppRuntimeError,
	BACKEND_CONNECTIVITY_FAILED,
	BACKEND_DOCKER_UNAVAILABLE,
	BACKEND_SSH_UNAVAILABLE,
	BACKEND_TIMEOUT,
	BACKEND_UNAVAILABLE,
	BACKEND_UNKNOWN,
	BACKEND_UNSUPPORTED,
	BACKEND_WSL_UNAVAILABLE,
	LAYER_B_PROFILES,
} from "./codes.ts";
import type {
	DockerClient,
	ExecuteRequest,
	ExecuteResult,
	ExecutionBackend,
	HealthCheckResult,
} from "./types.ts";

export type CommandExists = (name: string) => boolean;

const DEFAULT_TIMEOUT_MS = 15_000;

function splitCommand(command: string, args?: string[]): { cmd: string; argv: string[] } {
	if (args && args.length > 0) {
		return { cmd: command, argv: args };
	}
	const parts = command.trim().split(/\s+/);
	return { cmd: parts[0] ?? command, argv: parts.slice(1) };
}

function envWithoutDotenvFile(env?: NodeJS.ProcessEnv): NodeJS.ProcessEnv {
	return { ...(env ?? process.env) };
}

export async function spawnBounded(
	command: string,
	args: string[],
	req: ExecuteRequest,
	backend: string,
): Promise<ExecuteResult> {
	const started = Date.now();
	const timeoutMs = req.timeoutMs ?? DEFAULT_TIMEOUT_MS;
	const wait = req.wait !== false;
	return new Promise((resolve, reject) => {
		let stdout = "";
		let stderr = "";
		let settled = false;
		const child: ChildProcess = spawn(command, args, {
			cwd: req.cwd,
			env: envWithoutDotenvFile(req.env),
			stdio: ["ignore", "pipe", "pipe"],
			shell: false,
			windowsHide: true,
			signal: req.signal,
		});
		child.stdout?.on("data", (chunk: Buffer) => {
			stdout += chunk.toString("utf8");
		});
		child.stderr?.on("data", (chunk: Buffer) => {
			stderr += chunk.toString("utf8");
		});
		const timer = setTimeout(() => {
			if (settled) {
				return;
			}
			child.kill("SIGTERM");
			settled = true;
			reject(new AppRuntimeError(BACKEND_TIMEOUT, `${backend} timed out`));
		}, timeoutMs);
		const finish = (exit_code: number | null, reason_code?: string) => {
			if (settled) {
				return;
			}
			settled = true;
			clearTimeout(timer);
			resolve({
				command: [command, ...args].join(" "),
				backend,
				exit_code,
				duration_ms: Date.now() - started,
				stdout,
				stderr,
				pid: child.pid,
				identity: req.identity ?? String(child.pid ?? ""),
				reason_code,
			});
		};
		child.on("error", (err) => {
			clearTimeout(timer);
			if (settled) {
				return;
			}
			settled = true;
			reject(
				new AppRuntimeError(
					APP_RUNTIME_START_FAILED,
					err instanceof Error ? err.message : String(err),
				),
			);
		});
		if (!wait) {
			child.once("spawn", () => finish(null));
			return;
		}
		child.on("close", (code) => finish(code));
	});
}

export class LocalBackend implements ExecutionBackend {
	name(): string {
		return "local";
	}
	async health_check(): Promise<HealthCheckResult> {
		return { ok: true, backend: "local" };
	}
	async execute(req: ExecuteRequest): Promise<ExecuteResult> {
		const { cmd, argv } = splitCommand(req.command, req.args);
		return spawnBounded(cmd, argv, req, "local");
	}
}

export class CliDockerClient implements DockerClient {
	private readonly commandExists: CommandExists;
	constructor(commandExists: CommandExists) {
		this.commandExists = commandExists;
	}
	binaryPresent(): boolean {
		return this.commandExists("docker");
	}
	async daemonReachable(): Promise<boolean> {
		if (!this.binaryPresent()) {
			return false;
		}
		try {
			const result = await spawnBounded(
				"docker",
				["info"],
				{ command: "docker", args: ["info"], timeoutMs: 5000 },
				"docker",
			);
			return result.exit_code === 0;
		} catch {
			return false;
		}
	}
	async run(args: string[], req: ExecuteRequest = { command: "docker" }): Promise<ExecuteResult> {
		return spawnBounded("docker", args, { ...req, command: "docker", args }, "docker");
	}
	async healthcheckStatus(_containerId: string): Promise<HealthCheckResult["healthcheck_status"]> {
		return "none";
	}
}

export class DockerBackend implements ExecutionBackend {
	private readonly client: DockerClient;
	constructor(client: DockerClient) {
		this.client = client;
	}
	name(): string {
		return "docker";
	}
	async health_check(): Promise<HealthCheckResult> {
		if (!this.client.binaryPresent()) {
			return { ok: false, backend: "docker", reason_code: BACKEND_DOCKER_UNAVAILABLE };
		}
		if (!(await this.client.daemonReachable())) {
			return { ok: false, backend: "docker", reason_code: BACKEND_DOCKER_UNAVAILABLE };
		}
		return { ok: true, backend: "docker", healthcheck_status: "none" };
	}
	async execute(req: ExecuteRequest): Promise<ExecuteResult> {
		const health = await this.health_check();
		if (!health.ok) {
			throw new AppRuntimeError(health.reason_code ?? BACKEND_UNAVAILABLE);
		}
		const args = req.args ?? ["compose", "version"];
		return this.client.run(args, req);
	}
	async readHealthcheckStatus(
		containerId: string,
	): Promise<HealthCheckResult["healthcheck_status"]> {
		return this.client.healthcheckStatus(containerId);
	}
}

export class WslBackend implements ExecutionBackend {
	private readonly commandExists: CommandExists;
	private readonly distro: string;
	constructor(commandExists: CommandExists, distro = "Ubuntu") {
		this.commandExists = commandExists;
		this.distro = distro;
	}
	name(): string {
		return "wsl";
	}
	async health_check(): Promise<HealthCheckResult> {
		if (!this.commandExists("wsl") && !this.commandExists("wsl.exe")) {
			return { ok: false, backend: "wsl", reason_code: BACKEND_WSL_UNAVAILABLE };
		}
		return { ok: true, backend: "wsl" };
	}
	async execute(req: ExecuteRequest): Promise<ExecuteResult> {
		const health = await this.health_check();
		if (!health.ok) {
			throw new AppRuntimeError(health.reason_code ?? BACKEND_WSL_UNAVAILABLE);
		}
		const bin = this.commandExists("wsl.exe") ? "wsl.exe" : "wsl";
		const argv = ["-d", this.distro];
		if (req.cwd) {
			argv.push("--cd", req.cwd);
		}
		argv.push("--", req.command, ...(req.args ?? []));
		return spawnBounded(bin, argv, { ...req, command: bin, args: argv }, "wsl");
	}
}

export class SshBackend implements ExecutionBackend {
	private readonly commandExists: CommandExists;
	private readonly target: string;
	constructor(commandExists: CommandExists, target = "user@localhost") {
		this.commandExists = commandExists;
		this.target = target;
	}
	name(): string {
		return "ssh";
	}
	async health_check(): Promise<HealthCheckResult> {
		if (!this.commandExists("ssh") && !this.commandExists("ssh.exe")) {
			return { ok: false, backend: "ssh", reason_code: BACKEND_SSH_UNAVAILABLE };
		}
		return { ok: true, backend: "ssh" };
	}
	async execute(req: ExecuteRequest): Promise<ExecuteResult> {
		if (req.env?.SSH_PASSWORD || req.env?.PASSWORD) {
			throw new AppRuntimeError(BACKEND_SSH_UNAVAILABLE, "password SSH unsupported");
		}
		const health = await this.health_check();
		if (!health.ok) {
			throw new AppRuntimeError(health.reason_code ?? BACKEND_SSH_UNAVAILABLE);
		}
		const bin = this.commandExists("ssh.exe") ? "ssh.exe" : "ssh";
		const argv = [
			"-o",
			"BatchMode=yes",
			"-o",
			"ConnectTimeout=5",
			this.target,
			req.command,
			...(req.args ?? []),
		];
		return spawnBounded(bin, argv, { ...req, command: bin, args: argv }, "ssh");
	}
}

export class RemoteDockerBackend implements ExecutionBackend {
	private readonly commandExists: CommandExists;
	private readonly context: string | undefined;
	constructor(commandExists: CommandExists, context?: string) {
		this.commandExists = commandExists;
		this.context = context;
	}
	name(): string {
		return "remote-docker";
	}
	async health_check(): Promise<HealthCheckResult> {
		if (!this.commandExists("docker") && !this.commandExists("ssh")) {
			return { ok: false, backend: "remote-docker", reason_code: BACKEND_CONNECTIVITY_FAILED };
		}
		if (!this.commandExists("docker")) {
			return { ok: false, backend: "remote-docker", reason_code: BACKEND_DOCKER_UNAVAILABLE };
		}
		return { ok: true, backend: "remote-docker" };
	}
	async execute(req: ExecuteRequest): Promise<ExecuteResult> {
		const health = await this.health_check();
		if (!health.ok) {
			throw new AppRuntimeError(health.reason_code ?? BACKEND_CONNECTIVITY_FAILED);
		}
		const args = this.context
			? ["--context", this.context, ...(req.args ?? ["info"])]
			: (req.args ?? ["info"]);
		return spawnBounded(
			"docker",
			args,
			{ ...req, command: "docker", args, env: req.env },
			"remote-docker",
		);
	}
}

export class UnsupportedBackend implements ExecutionBackend {
	private readonly id: string;
	constructor(id = "micro-vm") {
		this.id = id;
	}
	name(): string {
		return this.id;
	}
	async health_check(): Promise<HealthCheckResult> {
		return { ok: false, backend: this.id, reason_code: BACKEND_UNSUPPORTED };
	}
	async execute(): Promise<ExecuteResult> {
		throw new AppRuntimeError(BACKEND_UNSUPPORTED, `${this.id} is not a v1 backend`);
	}
}

export function defaultCommandExists(name: string): boolean {
	try {
		const which = process.platform === "win32" ? "where" : "which";
		const result = spawnSync(which, [name], { stdio: "ignore", windowsHide: true });
		return result.status === 0;
	} catch {
		return false;
	}
}

export function createDefaultBackends(
	commandExists: CommandExists = defaultCommandExists,
	dockerClient?: DockerClient,
): Record<string, ExecutionBackend> {
	const client = dockerClient ?? new CliDockerClient(commandExists);
	return {
		local: new LocalBackend(),
		docker: new DockerBackend(client),
		"docker-local": new DockerBackend(client),
		wsl: new WslBackend(commandExists),
		ssh: new SshBackend(commandExists),
		"remote-docker": new RemoteDockerBackend(commandExists),
		"micro-vm": new UnsupportedBackend("micro-vm"),
		sandbox: new UnsupportedBackend("sandbox"),
	};
}

export function resolveBackendId(raw: string): string {
	if (raw in LAYER_B_PROFILES) {
		return LAYER_B_PROFILES[raw as keyof typeof LAYER_B_PROFILES];
	}
	if (raw === "docker-local") {
		return "docker";
	}
	return raw;
}

export function assertKnownBackend(id: string): void {
	const resolved = resolveBackendId(id);
	const known = new Set(["local", "docker", "wsl", "ssh", "remote-docker", "micro-vm", "sandbox"]);
	if (!known.has(resolved)) {
		throw new AppRuntimeError(BACKEND_UNKNOWN, `unknown backend ${id}`);
	}
}
