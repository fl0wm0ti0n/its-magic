import type {
	Autonomy,
	IsolationProfile,
	PermissionMode,
	SecurityClass,
} from "@its-magic/policy-engine";

export type ProvenanceLayer = 1 | 2 | 3 | 4 | 5;

export type ProvenanceLabel =
	| "cli"
	| "kit_local"
	| "kit_baseline"
	| "cursor_local"
	| "cursor_baseline"
	| "kit_example"
	| "code_defaults";

export interface Provenance {
	layer: ProvenanceLayer;
	label: ProvenanceLabel;
	path?: string;
	source_key: string;
}

export interface RuntimeConfig {
	schema_version: 1;
	delivery: { DELIVERY_MODE: "standard" | "ultra_lean" | "mega_quick" };
	token: { TOKEN_PROFILE: "lean" | "balanced" | "full" };
	workKind: {
		WORK_KIND_ROUTING: 0 | 1;
		WORK_KIND_TIE_BREAK: "priority_then_backlog_order" | "highest_tier_wins";
	};
	phase: {
		PHASE_MODE: "interactive" | "auto";
		AUTO_PHASE_INCLUDE: string;
		AUTO_PHASE_EXCLUDE: string;
		AUTO_ROLE_RESEARCH: string;
		AUTO_ROLE_PLAN_VERIFY: string;
		AUTO_ROLE_CLOSURE: string;
		AUTO_ROLE_REFRESH_CONTEXT: string;
	};
	model: {
		catalog_handle: string;
		role_handle: string;
		critic_handle: string;
		thinking_level: string;
	};
	autonomy: {
		AUTONOMY_PRESET: "none" | "balanced" | "full";
		AUTO_FLOW_MODE: "manual" | "auto_until_decision" | "full_autonomy";
		flags: Record<string, string>;
	};
	stop: {
		AUTONOMY_STOP_POLICY: "block" | "auto_repair_then_block" | "auto_repair_then_skip";
		AUTO_PAUSE_POLICY: "after_task" | "after_phase";
	};
	retryTest: {
		AUTO_BLOCK_RETRY_MAX: number;
		AUTO_LOOP_MAX_CYCLES: number;
		AUTO_OUTER_DRIVER_TIMEOUT_SECONDS: string;
	};
	security: {
		security_class: SecurityClass;
		permission_mode: PermissionMode;
		isolation_profile: IsolationProfile;
		autonomy: Autonomy;
	};
	sovereign: {
		CROSS_MODEL_REVIEW: "0" | "1";
		AI_DECISION_LEDGER: "0" | "1";
		SOVEREIGN_MEMORY: "0" | "1";
		AUTO_SOVEREIGN: "0" | "1";
	};
	browser: { mode: "off" | "isolated" | "authorized-cdp"; handle: string };
	devEnvironment: { profile_name: string; stack_handle: string };
	remote: { target_id: string; backend_handle: string };
	shared: Record<string, string>;
	host_overlays: Record<string, unknown>;
	compat: Record<string, string>;
}

export interface ResolveRuntimeConfigOptions {
	argv?: string[];
	env?: NodeJS.Dict<string>;
	configRoot?: string;
	materializeMissingShared?: boolean;
}

export interface ResolveRuntimeConfigResult {
	config: RuntimeConfig;
	provenance: Record<string, Provenance>;
	diagnostics: string[];
	ok: boolean;
	fatal_code?: string;
}
