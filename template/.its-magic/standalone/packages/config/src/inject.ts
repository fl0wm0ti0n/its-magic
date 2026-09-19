import type { ThinkingLevel } from "@its-magic/auth-models";
import type {
	Autonomy,
	IsolationProfile,
	PermissionMode,
	SecurityClass,
} from "@its-magic/policy-engine";
import type { RuntimeConfig } from "./types.ts";

const AUTO_ROLE_KEYS = {
	research: "AUTO_ROLE_RESEARCH",
	"plan-verify": "AUTO_ROLE_PLAN_VERIFY",
	closure: "AUTO_ROLE_CLOSURE",
	"refresh-context": "AUTO_ROLE_REFRESH_CONTEXT",
} as const;

export interface PolicyInjectFlags {
	autonomy: Autonomy;
	permission_mode: PermissionMode;
	security_class: SecurityClass;
	isolation_profile: IsolationProfile;
}

export interface ModelRouterInjectFlags {
	tokenProfile: "lean" | "balanced" | "full";
	thinkingOrthogonal: true;
	thinkingLevel?: ThinkingLevel;
	catalogHandle: string;
	roleHandle: string;
	criticHandle: string;
}

export interface RoleInjectFlags {
	AUTO_ROLE_RESEARCH: string;
	AUTO_ROLE_PLAN_VERIFY: string;
	AUTO_ROLE_CLOSURE: string;
	AUTO_ROLE_REFRESH_CONTEXT: string;
	autoRoleKeys: typeof AUTO_ROLE_KEYS;
}

export function injectPolicyFlags(config: RuntimeConfig): PolicyInjectFlags {
	return {
		autonomy: config.security.autonomy,
		permission_mode: config.security.permission_mode,
		security_class: config.security.security_class,
		isolation_profile: config.security.isolation_profile,
	};
}

export function injectModelRouterFlags(config: RuntimeConfig): ModelRouterInjectFlags {
	return {
		tokenProfile: config.token.TOKEN_PROFILE,
		thinkingOrthogonal: true,
		thinkingLevel: (config.model.thinking_level || undefined) as ThinkingLevel | undefined,
		catalogHandle: config.model.catalog_handle,
		roleHandle: config.model.role_handle,
		criticHandle: config.model.critic_handle,
	};
}

export function injectRoleFlags(config: RuntimeConfig): RoleInjectFlags {
	return {
		AUTO_ROLE_RESEARCH: config.phase.AUTO_ROLE_RESEARCH,
		AUTO_ROLE_PLAN_VERIFY: config.phase.AUTO_ROLE_PLAN_VERIFY,
		AUTO_ROLE_CLOSURE: config.phase.AUTO_ROLE_CLOSURE,
		AUTO_ROLE_REFRESH_CONTEXT: config.phase.AUTO_ROLE_REFRESH_CONTEXT,
		autoRoleKeys: AUTO_ROLE_KEYS,
	};
}
