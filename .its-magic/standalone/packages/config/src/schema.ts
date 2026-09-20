import * as z from "zod";

export const SCHEMA_VERSION_SUPPORTED = 1;

export const DeliveryMode = z.enum(["standard", "ultra_lean", "mega_quick"]);
export const TokenProfile = z.enum(["lean", "balanced", "full"]);
export const AutonomyPreset = z.enum(["none", "balanced", "full"]);
export const WorkKindRouting = z.enum(["0", "1"]);
export const WorkKindTieBreak = z.enum(["priority_then_backlog_order", "highest_tier_wins"]);
export const PhaseMode = z.enum(["interactive", "auto"]);
export const PermissionModeConfig = z.enum(["interactive", "auto"]);
export const AutoFlowMode = z.enum(["manual", "auto_until_decision", "full_autonomy"]);
export const StopPolicy = z.enum(["block", "auto_repair_then_block", "auto_repair_then_skip"]);
export const PausePolicy = z.enum(["after_task", "after_phase"]);
export const SecurityClassConfig = z.enum(["standard", "security_hard"]);
export const IsolationProfileConfig = z.enum([
	"trusted-local",
	"isolated-development",
	"untrusted-repository",
]);
export const BrowserMode = z.enum(["off", "isolated", "authorized-cdp"]);
export const Flag01 = z.enum(["0", "1"]);
export const ReworkExhaustedPolicy = z.enum(["block", "downgrade"]);
export const RuntimeProofKind = z.enum(["strict", "lightweight"]);

export const TYPED_KEYS = {
	DELIVERY_MODE: DeliveryMode,
	TOKEN_PROFILE: TokenProfile,
	AUTONOMY_PRESET: AutonomyPreset,
	WORK_KIND_ROUTING: WorkKindRouting,
	WORK_KIND_TIE_BREAK: WorkKindTieBreak,
	PHASE_MODE: PhaseMode,
	PERMISSION_MODE: PermissionModeConfig,
	AUTO_FLOW_MODE: AutoFlowMode,
	AUTONOMY_STOP_POLICY: StopPolicy,
	AUTO_PAUSE_POLICY: PausePolicy,
	SECURITY_CLASS: SecurityClassConfig,
	ISOLATION_PROFILE: IsolationProfileConfig,
	BROWSER_MODE: BrowserMode,
	CROSS_MODEL_REVIEW: Flag01,
	AI_DECISION_LEDGER: Flag01,
	SOVEREIGN_MEMORY: Flag01,
	AUTO_SOVEREIGN: Flag01,
	INTAKE_AUTONOMY_MODE: Flag01,
	INTAKE_MINIMAL_PACK: Flag01,
	INTAKE_ASSUME_STACK_CONTEXT: Flag01,
	WORK_KIND_AUTO_ACCEPT: Flag01,
	CROSS_MODEL_REWORK_EXHAUSTED_POLICY: ReworkExhaustedPolicy,
	RESUME_BRIEF_AUTO_REFRESH: Flag01,
	RUNTIME_PROOF_KIND: RuntimeProofKind,
	SOVEREIGN_DRAIN_AUTO_ACCEPT: Flag01,
	RELEASE_PUBLISH_AUTO_CONFIRM: Flag01,
	CONFIG_STRICT: Flag01,
} as const;

export const HANDLE_TYPED_KEYS = ["secret_name", "credential_handle"] as const;

export const AUTONOMY_FLAG_KEYS = [
	"INTAKE_AUTONOMY_MODE",
	"INTAKE_MINIMAL_PACK",
	"INTAKE_ASSUME_STACK_CONTEXT",
	"WORK_KIND_AUTO_ACCEPT",
	"CROSS_MODEL_REWORK_EXHAUSTED_POLICY",
	"CROSS_MODEL_SKIP_PHASES",
	"RESUME_BRIEF_AUTO_REFRESH",
	"RUNTIME_PROOF_KIND",
	"GOAL_CONVERGENCE_INTERVAL",
	"SOVEREIGN_DRAIN_AUTO_ACCEPT",
	"RELEASE_PUBLISH_AUTO_CONFIRM",
	"AUTONOMY_STOP_POLICY",
] as const;

export const AUTO_ROLE_CONFIG_KEYS = [
	"AUTO_ROLE_RESEARCH",
	"AUTO_ROLE_PLAN_VERIFY",
	"AUTO_ROLE_CLOSURE",
	"AUTO_ROLE_REFRESH_CONTEXT",
] as const;

export const fileConfigSchema = z
	.object({
		schema_version: z.number().int(),
		shared: z.record(z.string(), z.string()).optional(),
		host_overlays: z.record(z.string(), z.unknown()).optional(),
	})
	.strict();

export type FileConfig = z.infer<typeof fileConfigSchema>;

export const runtimeConfigJsonSchema = z.toJSONSchema(fileConfigSchema, {
	target: "draft-2020-12",
});

export const CODE_DEFAULTS: Record<string, string> = {
	DELIVERY_MODE: "standard",
	TOKEN_PROFILE: "balanced",
	AUTONOMY_PRESET: "none",
	WORK_KIND_ROUTING: "0",
	WORK_KIND_TIE_BREAK: "priority_then_backlog_order",
	PHASE_MODE: "interactive",
	PERMISSION_MODE: "interactive",
	AUTO_FLOW_MODE: "manual",
	AUTONOMY_STOP_POLICY: "block",
	AUTO_PAUSE_POLICY: "after_task",
	SECURITY_CLASS: "standard",
	ISOLATION_PROFILE: "trusted-local",
	BROWSER_MODE: "off",
	BROWSER_HANDLE: "",
	DEV_ENVIRONMENT_PROFILE: "",
	DEV_STACK_HANDLE: "",
	REMOTE_TARGET_ID: "",
	REMOTE_BACKEND_HANDLE: "",
	CROSS_MODEL_REVIEW: "0",
	AI_DECISION_LEDGER: "0",
	SOVEREIGN_MEMORY: "0",
	AUTO_SOVEREIGN: "0",
	AUTO_LOOP_MAX_CYCLES: "32",
	AUTO_BLOCK_RETRY_MAX: "3",
	AUTO_OUTER_DRIVER_TIMEOUT_SECONDS: "",
	AUTO_ROLE_RESEARCH: "",
	AUTO_ROLE_PLAN_VERIFY: "",
	AUTO_ROLE_CLOSURE: "",
	AUTO_ROLE_REFRESH_CONTEXT: "",
	AUTO_PHASE_INCLUDE: "",
	AUTO_PHASE_EXCLUDE: "",
	MODEL_CATALOG_HANDLE: "",
	MODEL_ROLE_HANDLE: "",
	MODEL_CRITIC_HANDLE: "",
	THINKING_LEVEL: "",
	CONFIG_STRICT: "0",
	INTAKE_AUTONOMY_MODE: "0",
	INTAKE_MINIMAL_PACK: "0",
	INTAKE_ASSUME_STACK_CONTEXT: "0",
	WORK_KIND_AUTO_ACCEPT: "0",
	CROSS_MODEL_REWORK_EXHAUSTED_POLICY: "block",
	CROSS_MODEL_SKIP_PHASES: "",
	RESUME_BRIEF_AUTO_REFRESH: "0",
	RUNTIME_PROOF_KIND: "strict",
	GOAL_CONVERGENCE_INTERVAL: "3",
	SOVEREIGN_DRAIN_AUTO_ACCEPT: "0",
	RELEASE_PUBLISH_AUTO_CONFIRM: "0",
	DONE: "0",
	AUTO_BACKLOG_DRAIN: "0",
	AUTO_BUG_QUEUE: "0",
	CAVEMAN_COMPRESS_INPUT: "0",
	SOVEREIGN_PARALLEL_DEV: "0",
	UAT_BROWSER_PROBE_MODE: "cursor",
	UAT_BROWSER_FALLBACK_CHAIN: "1",
};

export function isTypedKey(key: string): key is keyof typeof TYPED_KEYS {
	return Object.hasOwn(TYPED_KEYS, key);
}

export function validateTypedValue(key: string, value: string): boolean {
	if (!isTypedKey(key)) {
		return true;
	}
	return TYPED_KEYS[key].safeParse(value).success;
}
