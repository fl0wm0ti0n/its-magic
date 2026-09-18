import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { DEFAULT_VALIDATOR_TIMEOUT_MS, KernelBridgeError, MAX_CAPTURE_BYTES } from "./types.ts";

const PY3_PROBE = "import sys; raise SystemExit(0 if sys.version_info[0]==3 else 1)";
const PY3_EXECUTABLE = "import sys; print(sys.executable)";

export interface SpawnCapture {
	stdout: string;
	stderr: string;
	exitCode: number | null;
	signal: NodeJS.Signals | string | null;
	error?: NodeJS.ErrnoException;
	timedOut: boolean;
}

export type SpawnFn = (
	command: string,
	args: string[],
	opts: { cwd: string; timeoutMs: number; windowsHide: boolean; env?: NodeJS.ProcessEnv },
) => Promise<SpawnCapture>;

function decodeLimited(chunks: Buffer[]): string {
	const buf = Buffer.concat(chunks);
	const sliced = buf.length > MAX_CAPTURE_BYTES ? buf.subarray(0, MAX_CAPTURE_BYTES) : buf;
	return sliced.toString("utf8");
}

function isTimeoutError(err: NodeJS.ErrnoException | undefined, timedOut: boolean): boolean {
	if (timedOut) {
		return true;
	}
	if (!err) {
		return false;
	}
	const code = err.code ?? "";
	return code === "ABORT_ERR" || code === "ERR_TIMEOUT" || err.name === "AbortError";
}

export const defaultSpawn: SpawnFn = (command, args, opts) => {
	return new Promise((resolvePromise) => {
		const stdoutChunks: Buffer[] = [];
		const stderrChunks: Buffer[] = [];
		let timedOut = false;
		let settled = false;
		const finish = (capture: SpawnCapture) => {
			if (settled) {
				return;
			}
			settled = true;
			resolvePromise(capture);
		};

		let child: ReturnType<typeof spawn>;
		try {
			child = spawn(command, args, {
				cwd: opts.cwd,
				windowsHide: opts.windowsHide,
				shell: false,
				timeout: opts.timeoutMs,
				signal: AbortSignal.timeout(opts.timeoutMs),
				stdio: ["ignore", "pipe", "pipe"],
				env: opts.env,
			});
		} catch (err) {
			const error = err as NodeJS.ErrnoException;
			finish({
				stdout: "",
				stderr: "",
				exitCode: null,
				signal: null,
				error,
				timedOut: isTimeoutError(error, false),
			});
			return;
		}

		child.stdout?.on("data", (chunk: Buffer) => {
			stdoutChunks.push(chunk);
		});
		child.stderr?.on("data", (chunk: Buffer) => {
			stderrChunks.push(chunk);
		});
		const timer = setTimeout(() => {
			timedOut = true;
		}, opts.timeoutMs);
		child.on("error", (err: NodeJS.ErrnoException) => {
			clearTimeout(timer);
			finish({
				stdout: decodeLimited(stdoutChunks),
				stderr: decodeLimited(stderrChunks),
				exitCode: null,
				signal: null,
				error: err,
				timedOut: isTimeoutError(err, timedOut),
			});
		});
		child.on("close", (code, signal) => {
			clearTimeout(timer);
			finish({
				stdout: decodeLimited(stdoutChunks),
				stderr: decodeLimited(stderrChunks),
				exitCode: code,
				signal,
				timedOut,
			});
		});
	});
};

function splitCommand(spec: string): string[] {
	const trimmed = spec.trim();
	if (!trimmed) {
		return [];
	}
	if (existsSync(trimmed)) {
		return [trimmed];
	}
	return trimmed.split(/\s+/).filter((part) => part.length > 0);
}

function discoveryCandidates(): string[][] {
	const envKeys = ["ITS_MAGIC_PYTHON", "PYTHON", "PYTHON_BIN"] as const;
	const fromEnv: string[][] = [];
	for (const key of envKeys) {
		const raw = process.env[key];
		if (raw?.trim()) {
			fromEnv.push(splitCommand(raw));
		}
	}
	const platform =
		process.platform === "win32"
			? [["py", "-3"], ["python"], ["python3"]]
			: [["python3"], ["python"]];
	return [...fromEnv, ...platform];
}

async function probeCandidate(
	cmd: string[],
	spawnFn: SpawnFn,
	cwd: string,
): Promise<string | null> {
	if (cmd.length === 0) {
		return null;
	}
	const probe = await spawnFn(cmd[0], [...cmd.slice(1), "-c", PY3_PROBE], {
		cwd,
		timeoutMs: 15_000,
		windowsHide: true,
	});
	if (probe.timedOut || probe.error || probe.exitCode !== 0) {
		return null;
	}
	const exe = await spawnFn(cmd[0], [...cmd.slice(1), "-c", PY3_EXECUTABLE], {
		cwd,
		timeoutMs: 15_000,
		windowsHide: true,
	});
	if (exe.timedOut || exe.error || exe.exitCode !== 0) {
		return null;
	}
	const path = exe.stdout.trim().split(/\r?\n/).filter(Boolean).at(-1) ?? "";
	if (!path) {
		return null;
	}
	return path;
}

export async function resolvePythonInterpreter(
	cwd: string,
	spawnFn: SpawnFn = defaultSpawn,
): Promise<string> {
	for (const cmd of discoveryCandidates()) {
		const resolved = await probeCandidate(cmd, spawnFn, cwd);
		if (resolved) {
			return resolved;
		}
	}
	throw new KernelBridgeError(
		"KERNEL_VALIDATOR_MISSING",
		"Python 3 interpreter not found (probe failed for ITS_MAGIC_PYTHON/PYTHON/PYTHON_BIN and platform fallbacks)",
	);
}

export function firstPythonReason(stderr: string): string | null {
	const match = stderr.match(/[A-Z][A-Z0-9_]+/);
	return match ? match[0] : null;
}

export async function spawnPythonScript(opts: {
	interpreter: string;
	scriptPath: string;
	args: string[];
	cwd: string;
	timeoutMs?: number;
	spawnFn?: SpawnFn;
}): Promise<SpawnCapture> {
	const spawnFn = opts.spawnFn ?? defaultSpawn;
	const timeoutMs = opts.timeoutMs ?? DEFAULT_VALIDATOR_TIMEOUT_MS;
	return spawnFn(opts.interpreter, [opts.scriptPath, ...opts.args], {
		cwd: opts.cwd,
		timeoutMs,
		windowsHide: true,
	});
}

export { DEFAULT_VALIDATOR_TIMEOUT_MS };
