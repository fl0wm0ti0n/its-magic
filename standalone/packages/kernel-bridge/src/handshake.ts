import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import semver from "semver";
import { resolveArtifactPathsSync } from "./artifacts.ts";
import { locateProjectKernelSync } from "./locate.ts";
import {
	firstPythonReason,
	resolvePythonInterpreter,
	type SpawnFn,
	spawnPythonScript,
} from "./spawn.ts";
import {
	ALL_ARTIFACT_KEYS,
	ALLOWED_VALIDATOR_NAMES,
	type ContractManifest,
	DEFAULT_VALIDATOR_TIMEOUT_MS,
	type KernelBridge,
	KernelBridgeError,
	type LocateResult,
	type SupportedKernelRange,
	VALIDATOR_SCRIPTS,
	type ValidatorResult,
} from "./types.ts";

const RANGE_PATH = join(
	dirname(fileURLToPath(import.meta.url)),
	"..",
	"supported-kernel-range.json",
);

export interface KernelBridgeOptions {
	timeoutMs?: number;
	spawnFn?: SpawnFn;
	pythonInterpreter?: string;
}

export function loadSupportedKernelRange(): SupportedKernelRange {
	const raw = JSON.parse(readFileSync(RANGE_PATH, "utf8")) as SupportedKernelRange;
	if (
		typeof raw.minInclusive !== "string" ||
		typeof raw.maxExclusive !== "string" ||
		raw.includePrerelease !== true
	) {
		throw new KernelBridgeError(
			"KERNEL_CONTRACT_MISMATCH",
			"supported-kernel-range.json is malformed (need minInclusive, maxExclusive, includePrerelease:true)",
		);
	}
	return raw;
}

export function versionInSupportedRange(
	version: string,
	range = loadSupportedKernelRange(),
): boolean {
	const spec = `>=${range.minInclusive} <${range.maxExclusive}`;
	return semver.satisfies(version, spec, { includePrerelease: true });
}

function readVersionFile(kernelRoot: string): string {
	const path = join(kernelRoot, "its_magic", ".its-magic-version");
	if (!existsSync(path)) {
		throw new KernelBridgeError(
			"KERNEL_CONTRACT_MISMATCH",
			"version file missing after locate",
			path,
		);
	}
	return readFileSync(path, "utf8").trim();
}

function assertParseableVersion(version: string): void {
	if (!version || semver.valid(version) === null) {
		throw new KernelBridgeError(
			"KERNEL_CONTRACT_MISMATCH",
			`kernel version empty or unparseable as semver: ${JSON.stringify(version)}`,
			version,
		);
	}
}

function assertVersionInRange(version: string): void {
	if (!versionInSupportedRange(version)) {
		throw new KernelBridgeError(
			"KERNEL_VERSION_UNSUPPORTED",
			`kernel version ${version} is outside >=0.1.3-9 <0.2.0 (includePrerelease)`,
			version,
		);
	}
}

function parseManifest(raw: unknown, versionFile: string): ContractManifest {
	if (!raw || typeof raw !== "object") {
		throw new KernelBridgeError(
			"KERNEL_CONTRACT_MISMATCH",
			"kernel-contract.json root must be an object",
		);
	}
	const obj = raw as Record<string, unknown>;
	if (obj.schema_version !== 1) {
		throw new KernelBridgeError(
			"KERNEL_CONTRACT_MISMATCH",
			`kernel-contract.json schema_version must be 1, got ${String(obj.schema_version)}`,
		);
	}
	if (typeof obj.kernel_version !== "string") {
		throw new KernelBridgeError(
			"KERNEL_CONTRACT_MISMATCH",
			"kernel-contract.json kernel_version must be a string",
		);
	}
	if (obj.kernel_version !== versionFile) {
		throw new KernelBridgeError(
			"KERNEL_CONTRACT_MISMATCH",
			`kernel_version ${obj.kernel_version} does not match version file ${versionFile}`,
		);
	}
	if (!Array.isArray(obj.validators) || obj.validators.some((v) => typeof v !== "string")) {
		throw new KernelBridgeError(
			"KERNEL_CONTRACT_MISMATCH",
			"kernel-contract.json validators must be string[]",
		);
	}
	const validators = obj.validators as string[];
	const unknown = validators.filter((name) => !ALLOWED_VALIDATOR_NAMES.includes(name));
	if (unknown.length > 0) {
		throw new KernelBridgeError(
			"KERNEL_CONTRACT_MISMATCH",
			`kernel-contract.json lists unknown validators: ${unknown.join(",")}`,
		);
	}
	if (!Array.isArray(obj.artifact_keys) || obj.artifact_keys.some((v) => typeof v !== "string")) {
		throw new KernelBridgeError(
			"KERNEL_CONTRACT_MISMATCH",
			"kernel-contract.json artifact_keys must be string[]",
		);
	}
	const artifactKeys = obj.artifact_keys as string[];
	const allowed = new Set<string>(ALL_ARTIFACT_KEYS);
	const badKeys = artifactKeys.filter((k) => !allowed.has(k));
	if (badKeys.length > 0) {
		throw new KernelBridgeError(
			"KERNEL_CONTRACT_MISMATCH",
			`kernel-contract.json lists unknown artifact_keys: ${badKeys.join(",")}`,
		);
	}
	return {
		schema_version: 1,
		kernel_version: obj.kernel_version,
		validators,
		artifact_keys: artifactKeys,
	};
}

function readManifestFile(kernelRoot: string, versionFile: string): ContractManifest {
	const path = join(kernelRoot, "its_magic", "kernel-contract.json");
	if (!existsSync(path)) {
		throw new KernelBridgeError(
			"KERNEL_CONTRACT_MISMATCH",
			"its_magic/kernel-contract.json missing after locate (no silent default)",
			path,
		);
	}
	let parsed: unknown;
	try {
		parsed = JSON.parse(readFileSync(path, "utf8"));
	} catch (err) {
		throw new KernelBridgeError(
			"KERNEL_CONTRACT_MISMATCH",
			`kernel-contract.json malformed JSON: ${err instanceof Error ? err.message : String(err)}`,
			path,
		);
	}
	return parseManifest(parsed, versionFile);
}

function locateFor(kernelRoot?: string, cwd?: string): LocateResult {
	return locateProjectKernelSync({ kernelRoot, cwd });
}

function handshakeThroughManifest(kernelRoot?: string): {
	root: string;
	version: string;
	manifest: ContractManifest;
} {
	const located = locateFor(kernelRoot);
	const version = readVersionFile(located.kernelRoot);
	assertParseableVersion(version);
	assertVersionInRange(version);
	const manifest = readManifestFile(located.kernelRoot, version);
	return { root: located.kernelRoot, version, manifest };
}

function toValidatorResult(
	name: string,
	capture: {
		stdout: string;
		stderr: string;
		exitCode: number | null;
		signal: NodeJS.Signals | string | null;
		error?: NodeJS.ErrnoException;
		timedOut: boolean;
	},
): ValidatorResult {
	if (
		capture.timedOut ||
		capture.error?.code === "ABORT_ERR" ||
		capture.error?.name === "AbortError"
	) {
		return {
			name,
			pass: false,
			exitCode: capture.exitCode,
			reasonCode: firstPythonReason(capture.stderr),
			stdout: capture.stdout,
			stderr: capture.stderr,
			evidence: "VALIDATOR_TIMEOUT",
		};
	}
	if (capture.error) {
		const code = capture.error.code ?? "";
		if (code === "ENOENT") {
			throw new KernelBridgeError(
				"KERNEL_VALIDATOR_MISSING",
				`cannot spawn validator ${name}: ENOENT`,
				capture.error.message,
			);
		}
		return {
			name,
			pass: false,
			exitCode: capture.exitCode,
			reasonCode: firstPythonReason(capture.stderr),
			stdout: capture.stdout,
			stderr: capture.stderr,
			evidence: "VALIDATOR_CRASH",
		};
	}
	if (capture.exitCode === null || capture.signal) {
		return {
			name,
			pass: false,
			exitCode: capture.exitCode,
			reasonCode: firstPythonReason(capture.stderr),
			stdout: capture.stdout,
			stderr: capture.stderr,
			evidence: "VALIDATOR_CRASH",
		};
	}
	const pass = capture.exitCode === 0;
	return {
		name,
		pass,
		exitCode: capture.exitCode,
		reasonCode: pass ? null : firstPythonReason(capture.stderr),
		stdout: capture.stdout,
		stderr: capture.stderr,
		evidence: null,
	};
}

export function createKernelBridge(options: KernelBridgeOptions = {}): KernelBridge {
	const timeoutMs = options.timeoutMs ?? DEFAULT_VALIDATOR_TIMEOUT_MS;
	const spawnFn = options.spawnFn;
	let cachedInterpreter: string | undefined = options.pythonInterpreter;

	const bridge: KernelBridge = {
		async locateProjectKernel(opts) {
			return locateProjectKernelSync(opts);
		},

		async getKernelVersion(kernelRoot) {
			const located = locateFor(kernelRoot);
			const version = readVersionFile(located.kernelRoot);
			assertParseableVersion(version);
			return version;
		},

		async readContractManifest(kernelRoot) {
			return handshakeThroughManifest(kernelRoot).manifest;
		},

		async resolveArtifactPaths(kernelRoot) {
			const { root } = handshakeThroughManifest(kernelRoot);
			return resolveArtifactPathsSync(root);
		},

		async runValidator(name, args = [], kernelRoot) {
			const { root, manifest } = handshakeThroughManifest(kernelRoot);
			resolveArtifactPathsSync(root);

			if (!ALLOWED_VALIDATOR_NAMES.includes(name) || !manifest.validators.includes(name)) {
				throw new KernelBridgeError(
					"KERNEL_VALIDATOR_MISSING",
					`validator ${name} is not allowlisted or not in kernel-contract.json validators[]`,
					name,
				);
			}
			const rel = VALIDATOR_SCRIPTS[name];
			const scriptPath = join(root, rel);
			if (!existsSync(scriptPath)) {
				throw new KernelBridgeError(
					"KERNEL_VALIDATOR_MISSING",
					`validator script missing: ${rel}`,
					scriptPath,
				);
			}

			let interpreter = cachedInterpreter;
			if (!interpreter) {
				try {
					interpreter = await resolvePythonInterpreter(root, spawnFn);
					cachedInterpreter = interpreter;
				} catch (err) {
					if (err instanceof KernelBridgeError) {
						throw err;
					}
					throw new KernelBridgeError(
						"KERNEL_VALIDATOR_MISSING",
						`Python interpreter missing: ${err instanceof Error ? err.message : String(err)}`,
					);
				}
			}

			const capture = await spawnPythonScript({
				interpreter,
				scriptPath,
				args,
				cwd: root,
				timeoutMs,
				spawnFn,
			});
			if (capture.error?.code === "ENOENT") {
				throw new KernelBridgeError(
					"KERNEL_VALIDATOR_MISSING",
					`cannot spawn interpreter or script for ${name}`,
					capture.error.message,
				);
			}
			return toValidatorResult(name, capture);
		},

		async runUatPlanner(args = [], kernelRoot) {
			return bridge.runValidator("uat-planner", args, kernelRoot);
		},

		async runStatusReconcile(args = [], kernelRoot) {
			return bridge.runValidator("status-reconcile", args, kernelRoot);
		},
	};

	return bridge;
}
