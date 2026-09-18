import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import semver from "semver";
import { resolveArtifactPathsSync } from "./artifacts.ts";
import { locateProjectKernelSync } from "./locate.ts";
import {
	defaultSpawn,
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
	DELIVERY_BRIDGE_SCRIPT,
	DELIVERY_OP_TIMEOUT_MS,
	DELIVERY_OPERATIONS,
	DELIVERY_REQUEST_MAX_BYTES,
	DELIVERY_RESPONSE_MAX_BYTES,
	type DeliveryOperationInput,
	type DeliveryOperationName,
	type DeliveryOperationResult,
	type DeliveryRequestEnvelope,
	type KernelBridge,
	KernelBridgeError,
	type LocateResult,
	SOVEREIGN_BRIDGE_SCRIPT,
	SOVEREIGN_CONVERGENCE_TIMEOUT_MS,
	SOVEREIGN_OP_TIMEOUT_MS,
	SOVEREIGN_OPERATIONS,
	SOVEREIGN_REQUEST_MAX_BYTES,
	SOVEREIGN_RESPONSE_MAX_BYTES,
	type SovereignOperationInput,
	type SovereignOperationName,
	type SovereignOperationResult,
	type SovereignRequestEnvelope,
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
	let sovereign_operations: string[] | undefined;
	if (obj.sovereign_operations !== undefined) {
		if (
			!Array.isArray(obj.sovereign_operations) ||
			obj.sovereign_operations.some((v) => typeof v !== "string")
		) {
			throw new KernelBridgeError(
				"KERNEL_CONTRACT_MISMATCH",
				"kernel-contract.json sovereign_operations must be string[]",
			);
		}
		const allowedOps = new Set<string>(SOVEREIGN_OPERATIONS);
		const unknownOps = (obj.sovereign_operations as string[]).filter((op) => !allowedOps.has(op));
		if (unknownOps.length > 0) {
			throw new KernelBridgeError(
				"KERNEL_CONTRACT_MISMATCH",
				`kernel-contract.json lists unknown sovereign_operations: ${unknownOps.join(",")}`,
			);
		}
		sovereign_operations = obj.sovereign_operations as string[];
	}
	let delivery_operations: string[] | undefined;
	if (obj.delivery_operations !== undefined) {
		if (
			!Array.isArray(obj.delivery_operations) ||
			obj.delivery_operations.some((v) => typeof v !== "string")
		) {
			throw new KernelBridgeError(
				"KERNEL_CONTRACT_MISMATCH",
				"kernel-contract.json delivery_operations must be string[]",
			);
		}
		const allowedDelivery = new Set<string>(DELIVERY_OPERATIONS);
		const unknownDelivery = (obj.delivery_operations as string[]).filter(
			(op) => !allowedDelivery.has(op),
		);
		if (unknownDelivery.length > 0) {
			throw new KernelBridgeError(
				"KERNEL_CONTRACT_MISMATCH",
				`kernel-contract.json lists unknown delivery_operations: ${unknownDelivery.join(",")}`,
			);
		}
		delivery_operations = obj.delivery_operations as string[];
	}
	return {
		schema_version: 1,
		kernel_version: obj.kernel_version,
		validators,
		artifact_keys: artifactKeys,
		sovereign_operations,
		delivery_operations,
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
	const inFlight = new Set<string>();
	const deliveryInFlight = new Set<string>();

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

		async runSovereignOperation(input) {
			return runSovereignOperationImpl(input, {
				spawnFn,
				pythonInterpreter: cachedInterpreter,
				setInterpreter: (value) => {
					cachedInterpreter = value;
				},
				inFlight,
			});
		},

		async runDeliveryOperation(input) {
			return runDeliveryOperationImpl(input, {
				spawnFn,
				pythonInterpreter: cachedInterpreter,
				setInterpreter: (value) => {
					cachedInterpreter = value;
				},
				inFlight: deliveryInFlight,
			});
		},
	};

	return bridge;
}

const SOVEREIGN_ENV_KEYS = [
	"PATH",
	"PATHEXT",
	"SYSTEMROOT",
	"SYSTEMDRIVE",
	"WINDIR",
	"COMSPEC",
	"HOME",
	"USERPROFILE",
	"HOMEDRIVE",
	"HOMEPATH",
	"TEMP",
	"TMP",
	"TMPDIR",
	"LANG",
	"LC_ALL",
	"PYTHONIOENCODING",
	"PYTHONUTF8",
	"ITS_MAGIC_PYTHON",
	"PYTHON",
	"PYTHON_BIN",
	"ProgramFiles",
	"ProgramW6432",
	"ProgramFiles(x86)",
] as const;

function sovereignChildEnv(): NodeJS.ProcessEnv {
	const env: NodeJS.ProcessEnv = {};
	for (const key of SOVEREIGN_ENV_KEYS) {
		const value = process.env[key];
		if (value !== undefined) {
			env[key] = value;
		}
	}
	env.PYTHONUTF8 = "1";
	env.PYTHONIOENCODING = "utf-8";
	return env;
}

function assertSovereignRequest(
	operation: SovereignOperationName,
	request: SovereignRequestEnvelope,
): string {
	if (
		!request ||
		request.schema_version !== 1 ||
		typeof request.request_id !== "string" ||
		!request.request_id ||
		typeof request.operation !== "string" ||
		typeof request.orchestrator_run_id !== "string" ||
		!request.orchestrator_run_id ||
		!request.payload ||
		typeof request.payload !== "object" ||
		Array.isArray(request.payload)
	) {
		throw new KernelBridgeError(
			"KERNEL_SOVEREIGN_REQUEST_INVALID",
			"sovereign request envelope is malformed",
		);
	}
	if (request.operation !== operation) {
		throw new KernelBridgeError(
			"KERNEL_SOVEREIGN_REQUEST_INVALID",
			"request.operation does not match admitted operation",
		);
	}
	const compact = JSON.stringify(request);
	if (Buffer.byteLength(compact, "utf8") > SOVEREIGN_REQUEST_MAX_BYTES) {
		throw new KernelBridgeError(
			"KERNEL_SOVEREIGN_REQUEST_INVALID",
			`sovereign request exceeds ${SOVEREIGN_REQUEST_MAX_BYTES} bytes`,
		);
	}
	return compact;
}

function parseSovereignResponse(
	stdout: string,
	requestId: string,
	operation: string,
): SovereignOperationResult {
	let parsed: unknown;
	try {
		parsed = JSON.parse(stdout);
	} catch (err) {
		throw new KernelBridgeError(
			"KERNEL_SOVEREIGN_RESPONSE_INVALID",
			`sovereign response is not JSON: ${err instanceof Error ? err.message : String(err)}`,
		);
	}
	if (!parsed || typeof parsed !== "object") {
		throw new KernelBridgeError(
			"KERNEL_SOVEREIGN_RESPONSE_INVALID",
			"sovereign response root must be an object",
		);
	}
	const obj = parsed as Record<string, unknown>;
	if (
		obj.schema_version !== 1 ||
		obj.request_id !== requestId ||
		obj.operation !== operation ||
		typeof obj.ok !== "boolean"
	) {
		throw new KernelBridgeError(
			"KERNEL_SOVEREIGN_RESPONSE_INVALID",
			"sovereign response envelope mismatch",
		);
	}
	if (obj.ok === true) {
		if (!obj.result || typeof obj.result !== "object" || Array.isArray(obj.result)) {
			throw new KernelBridgeError(
				"KERNEL_SOVEREIGN_RESPONSE_INVALID",
				"sovereign ok response missing result object",
			);
		}
		return {
			schema_version: 1,
			request_id: requestId,
			operation,
			ok: true,
			result: obj.result as Record<string, unknown>,
		};
	}
	if (typeof obj.reason_code !== "string" || !obj.reason_code) {
		throw new KernelBridgeError(
			"KERNEL_SOVEREIGN_RESPONSE_INVALID",
			"sovereign fail response missing reason_code",
		);
	}
	return {
		schema_version: 1,
		request_id: requestId,
		operation,
		ok: false,
		reason_code: obj.reason_code,
	};
}

async function runSovereignOperationImpl(
	input: SovereignOperationInput,
	ctx: {
		spawnFn?: SpawnFn;
		pythonInterpreter?: string;
		setInterpreter: (value: string) => void;
		inFlight: Set<string>;
	},
): Promise<SovereignOperationResult> {
	if (!(SOVEREIGN_OPERATIONS as readonly string[]).includes(input.operation)) {
		throw new KernelBridgeError(
			"KERNEL_SOVEREIGN_OPERATION_MISSING",
			`unknown sovereign operation: ${String(input.operation)}`,
			String(input.operation),
		);
	}
	const compact = assertSovereignRequest(input.operation, input.request);
	const { root, manifest } = handshakeThroughManifest(input.kernelRoot);
	const artifacts = resolveArtifactPathsSync(root);
	if (!artifacts.sovereign) {
		throw new KernelBridgeError(
			"KERNEL_SOVEREIGN_FAILED",
			"resolved sovereign artifact path is required",
			"sovereign",
		);
	}
	const admitted = manifest.sovereign_operations ?? [];
	if (!admitted.includes(input.operation)) {
		throw new KernelBridgeError(
			"KERNEL_SOVEREIGN_OPERATION_MISSING",
			`operation ${input.operation} is not in kernel-contract.json sovereign_operations`,
			input.operation,
		);
	}
	const scriptPath = join(root, SOVEREIGN_BRIDGE_SCRIPT);
	if (!existsSync(scriptPath)) {
		throw new KernelBridgeError(
			"KERNEL_SOVEREIGN_FAILED",
			`sovereign bridge script missing: ${SOVEREIGN_BRIDGE_SCRIPT}`,
			scriptPath,
		);
	}
	const runId = input.request.orchestrator_run_id;
	if (ctx.inFlight.has(runId)) {
		throw new KernelBridgeError(
			"KERNEL_SOVEREIGN_FAILED",
			`overlapping runSovereignOperation for ${runId}`,
			runId,
		);
	}
	ctx.inFlight.add(runId);
	try {
		let interpreter = ctx.pythonInterpreter;
		if (!interpreter) {
			interpreter = await resolvePythonInterpreter(root, ctx.spawnFn);
			ctx.setInterpreter(interpreter);
		}
		const timeoutMs =
			input.operation === "convergence_evaluate"
				? SOVEREIGN_CONVERGENCE_TIMEOUT_MS
				: SOVEREIGN_OP_TIMEOUT_MS;
		const spawnImpl = ctx.spawnFn ?? defaultSpawn;
		const capture = await spawnImpl(
			interpreter,
			[scriptPath, "--operation", input.operation, "--request-json", compact],
			{
				cwd: root,
				timeoutMs,
				windowsHide: true,
				env: sovereignChildEnv(),
			},
		);
		if (capture.timedOut) {
			throw new KernelBridgeError(
				"KERNEL_SOVEREIGN_TIMEOUT",
				`sovereign operation ${input.operation} timed out`,
				input.operation,
			);
		}
		const stdoutBytes = Buffer.byteLength(capture.stdout, "utf8");
		if (stdoutBytes > SOVEREIGN_RESPONSE_MAX_BYTES) {
			throw new KernelBridgeError(
				"KERNEL_SOVEREIGN_RESPONSE_INVALID",
				`sovereign response exceeds ${SOVEREIGN_RESPONSE_MAX_BYTES} bytes`,
			);
		}
		if (capture.error?.code === "ENOENT") {
			throw new KernelBridgeError(
				"KERNEL_SOVEREIGN_FAILED",
				"cannot spawn sovereign bridge interpreter or script",
				capture.error.message,
			);
		}
		if (capture.error && !capture.stdout.trim()) {
			throw new KernelBridgeError(
				"KERNEL_SOVEREIGN_FAILED",
				`sovereign subprocess failed: ${capture.error.message}`,
			);
		}
		if (!capture.stdout.trim()) {
			throw new KernelBridgeError(
				"KERNEL_SOVEREIGN_FAILED",
				"sovereign subprocess produced empty stdout",
				capture.stderr,
			);
		}
		const result = parseSovereignResponse(
			capture.stdout.trim().split(/\r?\n/).filter(Boolean).at(-1) ?? capture.stdout,
			input.request.request_id,
			input.operation,
		);
		if (!result.ok && result.reason_code.startsWith("KERNEL_SOVEREIGN_")) {
			throw new KernelBridgeError(
				result.reason_code as "KERNEL_SOVEREIGN_FAILED",
				`sovereign operation ${input.operation} failed`,
				result.reason_code,
			);
		}
		if (capture.exitCode !== 0 && capture.exitCode !== null && result.ok) {
			throw new KernelBridgeError(
				"KERNEL_SOVEREIGN_FAILED",
				`sovereign subprocess exit ${String(capture.exitCode)} with ok envelope`,
			);
		}
		return result;
	} finally {
		ctx.inFlight.delete(runId);
	}
}

function assertDeliveryRequest(
	operation: DeliveryOperationName,
	request: DeliveryRequestEnvelope,
): string {
	if (
		!request ||
		request.schema_version !== 1 ||
		typeof request.request_id !== "string" ||
		!request.request_id ||
		typeof request.operation !== "string" ||
		typeof request.orchestrator_run_id !== "string" ||
		!request.orchestrator_run_id ||
		!request.payload ||
		typeof request.payload !== "object" ||
		Array.isArray(request.payload)
	) {
		throw new KernelBridgeError(
			"KERNEL_DELIVERY_REQUEST_INVALID",
			"delivery request envelope is malformed",
		);
	}
	if (request.operation !== operation) {
		throw new KernelBridgeError(
			"KERNEL_DELIVERY_REQUEST_INVALID",
			"request.operation does not match admitted operation",
		);
	}
	const compact = JSON.stringify(request);
	if (Buffer.byteLength(compact, "utf8") > DELIVERY_REQUEST_MAX_BYTES) {
		throw new KernelBridgeError(
			"KERNEL_DELIVERY_REQUEST_INVALID",
			`delivery request exceeds ${DELIVERY_REQUEST_MAX_BYTES} bytes`,
		);
	}
	return compact;
}

function parseDeliveryResponse(
	stdout: string,
	requestId: string,
	operation: string,
): DeliveryOperationResult {
	let parsed: unknown;
	try {
		parsed = JSON.parse(stdout);
	} catch (err) {
		throw new KernelBridgeError(
			"KERNEL_DELIVERY_RESPONSE_INVALID",
			`delivery response is not JSON: ${err instanceof Error ? err.message : String(err)}`,
		);
	}
	if (!parsed || typeof parsed !== "object") {
		throw new KernelBridgeError(
			"KERNEL_DELIVERY_RESPONSE_INVALID",
			"delivery response root must be an object",
		);
	}
	const obj = parsed as Record<string, unknown>;
	if (
		obj.schema_version !== 1 ||
		obj.request_id !== requestId ||
		obj.operation !== operation ||
		typeof obj.ok !== "boolean"
	) {
		throw new KernelBridgeError(
			"KERNEL_DELIVERY_RESPONSE_INVALID",
			"delivery response envelope mismatch",
		);
	}
	if (obj.ok === true) {
		if (!obj.result || typeof obj.result !== "object" || Array.isArray(obj.result)) {
			throw new KernelBridgeError(
				"KERNEL_DELIVERY_RESPONSE_INVALID",
				"delivery ok response missing result object",
			);
		}
		return {
			schema_version: 1,
			request_id: requestId,
			operation,
			ok: true,
			result: obj.result as Record<string, unknown>,
		};
	}
	if (typeof obj.reason_code !== "string" || !obj.reason_code) {
		throw new KernelBridgeError(
			"KERNEL_DELIVERY_RESPONSE_INVALID",
			"delivery fail response missing reason_code",
		);
	}
	return {
		schema_version: 1,
		request_id: requestId,
		operation,
		ok: false,
		reason_code: obj.reason_code,
	};
}

async function runDeliveryOperationImpl(
	input: DeliveryOperationInput,
	ctx: {
		spawnFn?: SpawnFn;
		pythonInterpreter?: string;
		setInterpreter: (value: string) => void;
		inFlight: Set<string>;
	},
): Promise<DeliveryOperationResult> {
	if (!(DELIVERY_OPERATIONS as readonly string[]).includes(input.operation)) {
		throw new KernelBridgeError(
			"KERNEL_DELIVERY_OPERATION_MISSING",
			`unknown delivery operation: ${String(input.operation)}`,
			String(input.operation),
		);
	}
	const compact = assertDeliveryRequest(input.operation, input.request);
	const { root, manifest } = handshakeThroughManifest(input.kernelRoot);
	const admitted = manifest.delivery_operations ?? [];
	if (!admitted.includes(input.operation)) {
		throw new KernelBridgeError(
			"KERNEL_DELIVERY_OPERATION_MISSING",
			`operation ${input.operation} is not in kernel-contract.json delivery_operations`,
			input.operation,
		);
	}
	const scriptPath = join(root, DELIVERY_BRIDGE_SCRIPT);
	if (!existsSync(scriptPath)) {
		throw new KernelBridgeError(
			"KERNEL_DELIVERY_FAILED",
			`delivery bridge script missing: ${DELIVERY_BRIDGE_SCRIPT}`,
			scriptPath,
		);
	}
	const runId = `${input.request.orchestrator_run_id}:${input.operation}`;
	if (ctx.inFlight.has(runId)) {
		throw new KernelBridgeError(
			"KERNEL_DELIVERY_FAILED",
			`overlapping runDeliveryOperation for ${runId}`,
			runId,
		);
	}
	ctx.inFlight.add(runId);
	try {
		let interpreter = ctx.pythonInterpreter;
		if (!interpreter) {
			interpreter = await resolvePythonInterpreter(root, ctx.spawnFn);
			ctx.setInterpreter(interpreter);
		}
		const spawnImpl = ctx.spawnFn ?? defaultSpawn;
		const capture = await spawnImpl(
			interpreter,
			[scriptPath, "--operation", input.operation, "--request-json", compact],
			{
				cwd: root,
				timeoutMs: DELIVERY_OP_TIMEOUT_MS,
				windowsHide: true,
				env: sovereignChildEnv(),
			},
		);
		if (capture.timedOut) {
			throw new KernelBridgeError(
				"KERNEL_DELIVERY_TIMEOUT",
				`delivery operation ${input.operation} timed out`,
				input.operation,
			);
		}
		const stdoutBytes = Buffer.byteLength(capture.stdout, "utf8");
		if (stdoutBytes > DELIVERY_RESPONSE_MAX_BYTES) {
			throw new KernelBridgeError(
				"KERNEL_DELIVERY_RESPONSE_INVALID",
				`delivery response exceeds ${DELIVERY_RESPONSE_MAX_BYTES} bytes`,
			);
		}
		if (capture.error?.code === "ENOENT") {
			throw new KernelBridgeError(
				"KERNEL_DELIVERY_FAILED",
				"cannot spawn delivery bridge interpreter or script",
				capture.error.message,
			);
		}
		if (capture.error && !capture.stdout.trim()) {
			throw new KernelBridgeError(
				"KERNEL_DELIVERY_FAILED",
				`delivery subprocess failed: ${capture.error.message}`,
			);
		}
		if (!capture.stdout.trim()) {
			throw new KernelBridgeError(
				"KERNEL_DELIVERY_FAILED",
				"delivery subprocess produced empty stdout",
				capture.stderr,
			);
		}
		const result = parseDeliveryResponse(
			capture.stdout.trim().split(/\r?\n/).filter(Boolean).at(-1) ?? capture.stdout,
			input.request.request_id,
			input.operation,
		);
		if (!result.ok && result.reason_code.startsWith("KERNEL_DELIVERY_")) {
			throw new KernelBridgeError(
				result.reason_code as "KERNEL_DELIVERY_FAILED",
				`delivery operation ${input.operation} failed`,
				result.reason_code,
			);
		}
		if (capture.exitCode !== 0 && capture.exitCode !== null && result.ok) {
			throw new KernelBridgeError(
				"KERNEL_DELIVERY_FAILED",
				`delivery subprocess exit ${String(capture.exitCode)} with ok envelope`,
			);
		}
		return result;
	} finally {
		ctx.inFlight.delete(runId);
	}
}
