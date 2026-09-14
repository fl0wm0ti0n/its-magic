export type LocateMode = "kit-dev" | "consumer";

export type KernelHandshakeCode =
	| "KERNEL_NOT_FOUND"
	| "KERNEL_VERSION_UNSUPPORTED"
	| "KERNEL_VALIDATOR_MISSING"
	| "KERNEL_CONTRACT_MISMATCH";

export const KERNEL_HANDSHAKE_CODES: readonly KernelHandshakeCode[] = [
	"KERNEL_NOT_FOUND",
	"KERNEL_VERSION_UNSUPPORTED",
	"KERNEL_VALIDATOR_MISSING",
	"KERNEL_CONTRACT_MISMATCH",
] as const;

export class KernelBridgeError extends Error {
	readonly code: KernelHandshakeCode;
	readonly evidence?: string;

	constructor(code: KernelHandshakeCode, message: string, evidence?: string) {
		super(message);
		this.name = "KernelBridgeError";
		this.code = code;
		this.evidence = evidence;
	}
}

export interface LocateResult {
	kernelRoot: string;
	locateMode: LocateMode;
}

export interface ContractManifest {
	schema_version: 1;
	kernel_version: string;
	validators: string[];
	artifact_keys: string[];
}

export type ArtifactKey =
	| "vision"
	| "backlog"
	| "acceptance"
	| "architecture"
	| "decisions_index"
	| "research"
	| "state"
	| "decisions_dir"
	| "sprints"
	| "handoffs"
	| "release_queue"
	| "release_notes"
	| "traceability"
	| "work_packs"
	| "sovereign";

export interface ValidatorResult {
	name: string;
	pass: boolean;
	exitCode: number | null;
	reasonCode: string | null;
	stdout: string;
	stderr: string;
	evidence: string | null;
}

export interface KernelBridge {
	locateProjectKernel(opts?: { cwd?: string; kernelRoot?: string }): Promise<LocateResult>;
	getKernelVersion(kernelRoot?: string): Promise<string>;
	readContractManifest(kernelRoot?: string): Promise<ContractManifest>;
	resolveArtifactPaths(kernelRoot?: string): Promise<Record<ArtifactKey, string | null>>;
	runValidator(name: string, args?: string[], kernelRoot?: string): Promise<ValidatorResult>;
	runUatPlanner(args?: string[], kernelRoot?: string): Promise<ValidatorResult>;
	runStatusReconcile(args?: string[], kernelRoot?: string): Promise<ValidatorResult>;
}

export interface SupportedKernelRange {
	minInclusive: string;
	maxExclusive: string;
	includePrerelease: boolean;
}

export const REQUIRED_ARTIFACT_KEYS: readonly ArtifactKey[] = [
	"vision",
	"backlog",
	"acceptance",
	"architecture",
	"decisions_index",
	"research",
	"state",
	"decisions_dir",
	"sprints",
	"handoffs",
] as const;

export const OPTIONAL_ARTIFACT_KEYS: readonly ArtifactKey[] = [
	"release_queue",
	"release_notes",
	"traceability",
	"work_packs",
	"sovereign",
] as const;

export const ALL_ARTIFACT_KEYS: readonly ArtifactKey[] = [
	...REQUIRED_ARTIFACT_KEYS,
	...OPTIONAL_ARTIFACT_KEYS,
] as const;

export const VALIDATOR_SCRIPTS: Readonly<Record<string, string>> = {
	intake_evidence_validate: "scripts/intake_evidence_validate.py",
	bug_issue_validate: "scripts/bug_issue_validate.py",
	pack_json_validate: "scripts/pack_json_validate.py",
	validate_closure_verification: "scripts/validate_closure_verification.py",
	ledger_validate: "scripts/ledger_validate.py",
	model_tier_validate: "scripts/model_tier_validate.py",
	"uat-planner": "scripts/uat_probe_lib.py",
	"status-reconcile": "scripts/status_reconcile_validate.py",
};

export const ALLOWED_VALIDATOR_NAMES: readonly string[] = Object.freeze(
	Object.keys(VALIDATOR_SCRIPTS),
);

export const DEFAULT_VALIDATOR_TIMEOUT_MS = 60_000;
export const MAX_CAPTURE_BYTES = 1024 * 1024;

export function isKernelBridgeError(err: unknown): err is KernelBridgeError {
	return err instanceof KernelBridgeError;
}
