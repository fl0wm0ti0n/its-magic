export type PolicyDecision = "ALLOW" | "ASK" | "DENY";
export type Autonomy = "supervised" | "autonomous";
export type PermissionMode = "default-deny" | "ask-on-write";
export type SecurityClass = "standard" | "security_hard";
export type IsolationProfile = "trusted-local" | "isolated-development" | "untrusted-repository";
export type ShellClass =
	| "safe-read"
	| "build-test"
	| "local-process"
	| "package-install"
	| "git-mutation"
	| "destructive-fs"
	| "network-deploy"
	| "privileged";

export interface PolicyRequest {
	role_id: string;
	phase_id: string;
	work_item_id?: string;
	sprint_id?: string;
	worktree_root: string;
	cwd: string;
	paths?: string[];
	command?: string;
	backend?: string;
	autonomy: Autonomy;
	permission_mode: PermissionMode;
	security_class: SecurityClass;
	approvals?: string[];
	isolation_profile: IsolationProfile;
	tool: string;
	action: string;
	artifact_ownership?: string[];
}

export interface PolicyResult {
	decision: PolicyDecision;
	reason_code?: string;
	shell_class?: ShellClass;
	isolation_profile?: IsolationProfile;
	backend?: string;
}

export interface PolicySnapshot {
	schema_version: 1;
	default_deny: true;
	security_hard_unrelaxable: true;
}

export const RAW_PI_TOOL_NAMES = [
	"read",
	"bash",
	"edit",
	"write",
	"powershell",
	"grep",
	"find",
	"ls",
] as const;

export const LIVE_TOOLS = [
	"itsm_read",
	"itsm_edit",
	"itsm_write",
	"itsm_patch",
	"itsm_shell",
	"itsm_git",
] as const;

export const LIVE_INTEL_TOOLS = [
	"itsm_search",
	"itsm_outline",
	"itsm_symbol",
	"itsm_references",
	"itsm_callers",
	"itsm_impact",
] as const;

export const STUB_TOOLS = [
	"itsm_app_start",
	"itsm_app_stop",
	"itsm_app_logs",
	"itsm_app_health",
	"itsm_deploy",
	"itsm_browser",
	"itsm_test",
	"itsm_validate",
	"itsm_spawn_review",
] as const;

/** US-0142: live handlers promoted off stub deny. Catalog list above is unamended (us0139). */
export const PROMOTED_LIVE_TOOLS = ["itsm_browser"] as const;

export const LIVE_WRITE_TOOLS = [
	"itsm_edit",
	"itsm_write",
	"itsm_patch",
	"itsm_shell",
	"itsm_git",
] as const;

export const ITSM_NAME_RE = /^itsm_[a-z0-9_]+$/;
