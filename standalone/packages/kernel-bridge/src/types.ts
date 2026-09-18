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

export type KernelSovereignCode =
	| "KERNEL_SOVEREIGN_OPERATION_MISSING"
	| "KERNEL_SOVEREIGN_REQUEST_INVALID"
	| "KERNEL_SOVEREIGN_RESPONSE_INVALID"
	| "KERNEL_SOVEREIGN_TIMEOUT"
	| "KERNEL_SOVEREIGN_FAILED";

export const KERNEL_SOVEREIGN_CODES: readonly KernelSovereignCode[] = [
	"KERNEL_SOVEREIGN_OPERATION_MISSING",
	"KERNEL_SOVEREIGN_REQUEST_INVALID",
	"KERNEL_SOVEREIGN_RESPONSE_INVALID",
	"KERNEL_SOVEREIGN_TIMEOUT",
	"KERNEL_SOVEREIGN_FAILED",
] as const;

export type KernelBridgeErrorCode = KernelHandshakeCode | KernelSovereignCode | KernelDeliveryCode;

export type KernelDeliveryCode =
	| "KERNEL_DELIVERY_OPERATION_MISSING"
	| "KERNEL_DELIVERY_REQUEST_INVALID"
	| "KERNEL_DELIVERY_RESPONSE_INVALID"
	| "KERNEL_DELIVERY_TIMEOUT"
	| "KERNEL_DELIVERY_FAILED";

export const KERNEL_DELIVERY_CODES: readonly KernelDeliveryCode[] = [
	"KERNEL_DELIVERY_OPERATION_MISSING",
	"KERNEL_DELIVERY_REQUEST_INVALID",
	"KERNEL_DELIVERY_RESPONSE_INVALID",
	"KERNEL_DELIVERY_TIMEOUT",
	"KERNEL_DELIVERY_FAILED",
] as const;

export class KernelBridgeError extends Error {
	readonly code: KernelBridgeErrorCode;
	readonly evidence?: string;

	constructor(code: KernelBridgeErrorCode, message: string, evidence?: string) {
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

export const SOVEREIGN_OPERATIONS = [
	"memory_digest",
	"critic_model",
	"role_review_plan",
	"decision_session_append",
	"deferral_append",
	"deferral_list",
	"drain_candidate_gate",
	"convergence_evaluate",
	"partial_delivery_write",
] as const;

export type SovereignOperationName = (typeof SOVEREIGN_OPERATIONS)[number];

export const SOVEREIGN_BRIDGE_SCRIPT = "scripts/sovereign_runtime_bridge.py";
export const SOVEREIGN_REQUEST_MAX_BYTES = 16 * 1024;
export const SOVEREIGN_RESPONSE_MAX_BYTES = 64 * 1024;
export const SOVEREIGN_OP_TIMEOUT_MS = 5_000;
export const SOVEREIGN_CONVERGENCE_TIMEOUT_MS = 15_000;

export const DELIVERY_OPERATIONS = [
	"parallel_dev_spawn",
	"parallel_dev_create_worktrees",
	"parallel_dev_list_active",
	"parallel_dev_cleanup_orphans",
	"parallel_dev_merge_winner",
	"deploy_smoke_probe",
	"deploy_healing_retry",
] as const;

export type DeliveryOperationName = (typeof DELIVERY_OPERATIONS)[number];

export const DELIVERY_BRIDGE_SCRIPT = "scripts/delivery_runtime_bridge.py";
export const DELIVERY_REQUEST_MAX_BYTES = 16 * 1024;
export const DELIVERY_RESPONSE_MAX_BYTES = 64 * 1024;
export const DELIVERY_OP_TIMEOUT_MS = 15_000;

export interface DeliveryRequestEnvelope {
	schema_version: 1;
	request_id: string;
	operation: string;
	orchestrator_run_id: string;
	payload: Record<string, unknown>;
}

export type DeliveryOperationResult =
	| {
			schema_version: 1;
			request_id: string;
			operation: string;
			ok: true;
			result: Record<string, unknown>;
	  }
	| {
			schema_version: 1;
			request_id: string;
			operation: string;
			ok: false;
			reason_code: string;
	  };

export interface DeliveryOperationInput {
	operation: DeliveryOperationName;
	request: DeliveryRequestEnvelope;
	kernelRoot?: string;
}

export interface ContractManifest {
	schema_version: 1;
	kernel_version: string;
	validators: string[];
	artifact_keys: string[];
	sovereign_operations?: string[];
	delivery_operations?: string[];
}

export interface SovereignRequestEnvelope {
	schema_version: 1;
	request_id: string;
	operation: string;
	orchestrator_run_id: string;
	payload: Record<string, unknown>;
}

export type SovereignOperationResult =
	| {
			schema_version: 1;
			request_id: string;
			operation: string;
			ok: true;
			result: Record<string, unknown>;
	  }
	| {
			schema_version: 1;
			request_id: string;
			operation: string;
			ok: false;
			reason_code: string;
	  };

export interface SovereignOperationInput {
	operation: SovereignOperationName;
	request: SovereignRequestEnvelope;
	kernelRoot?: string;
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
	runSovereignOperation(input: SovereignOperationInput): Promise<SovereignOperationResult>;
	runDeliveryOperation(input: DeliveryOperationInput): Promise<DeliveryOperationResult>;
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
