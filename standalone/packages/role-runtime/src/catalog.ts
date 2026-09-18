import {
	PHASE_ROLE_MISMATCH,
	RoleRuntimeError,
	SESSION_UNKNOWN_PHASE,
	SESSION_UNKNOWN_ROLE,
} from "./errors.ts";

export type RoleMutability = "none" | "owned-artifacts" | "implementation";

export interface PhaseCatalogEntry {
	canonical_role: string;
	allowed_roles: string[];
	auto_role_key?: string;
}

export interface RoleCatalogEntry {
	objective: string;
	artifact_ownership: string[];
	mutability: RoleMutability;
	bounded_manifest_keys: string[];
}

export interface RoleCatalog {
	schema_version: 1;
	phases: Record<string, PhaseCatalogEntry>;
	roles: Record<string, RoleCatalogEntry>;
}

export const BOUNDED_MANIFEST_KEYS = ["objective_function", "review_focus"] as const;

export const AUTO_ROLE_KEYS = {
	research: "AUTO_ROLE_RESEARCH",
	"plan-verify": "AUTO_ROLE_PLAN_VERIFY",
	closure: "AUTO_ROLE_CLOSURE",
	"refresh-context": "AUTO_ROLE_REFRESH_CONTEXT",
} as const;

const OWNED = "owned-artifacts" as const;

function role(
	objective: string,
	artifact_ownership: string[],
	mutability: RoleMutability,
): RoleCatalogEntry {
	return {
		objective,
		artifact_ownership,
		mutability,
		bounded_manifest_keys: [...BOUNDED_MANIFEST_KEYS],
	};
}

export function createDefaultRoleCatalog(): RoleCatalog {
	return {
		schema_version: 1,
		phases: {
			intake: { canonical_role: "po", allowed_roles: ["po"] },
			discovery: { canonical_role: "po", allowed_roles: ["po"] },
			research: {
				canonical_role: "tech-lead",
				allowed_roles: ["po", "tech-lead"],
				auto_role_key: AUTO_ROLE_KEYS.research,
			},
			architecture: { canonical_role: "tech-lead", allowed_roles: ["tech-lead"] },
			"sprint-plan": { canonical_role: "tech-lead", allowed_roles: ["tech-lead"] },
			"plan-verify": {
				canonical_role: "qa",
				allowed_roles: ["qa", "tech-lead"],
				auto_role_key: AUTO_ROLE_KEYS["plan-verify"],
			},
			execute: { canonical_role: "dev", allowed_roles: ["dev"] },
			qa: { canonical_role: "qa", allowed_roles: ["qa"] },
			"qa-arbiter": { canonical_role: "qa", allowed_roles: ["qa"] },
			"verify-work": { canonical_role: "qa", allowed_roles: ["qa"] },
			release: { canonical_role: "release", allowed_roles: ["release"] },
			closure: {
				canonical_role: "qe",
				allowed_roles: ["qe", "curator"],
				auto_role_key: AUTO_ROLE_KEYS.closure,
			},
			"refresh-context": {
				canonical_role: "curator",
				allowed_roles: ["curator", "po"],
				auto_role_key: AUTO_ROLE_KEYS["refresh-context"],
			},
			"sovereign-critic": { canonical_role: "tech-lead", allowed_roles: ["tech-lead"] },
			"security-review": { canonical_role: "security", allowed_roles: ["security"] },
			"map-codebase": { canonical_role: "scout", allowed_roles: ["scout", "dev"] },
			ask: { canonical_role: "scout", allowed_roles: ["scout", "dev"] },
		},
		roles: {
			orchestrator: role("Schedule phases only; no project writes.", [], "none"),
			po: role("Own product intent artifacts.", ["vision", "backlog", "acceptance"], OWNED),
			"tech-lead": role(
				"Own engineering design artifacts.",
				["architecture", "research", "decisions"],
				OWNED,
			),
			dev: role(
				"Implement in-scope code and sprint artifacts.",
				["sprints", "src"],
				"implementation",
			),
			qa: role("Own verification artifacts.", ["qa-findings", "plan-verify"], OWNED),
			release: role("Own release notes and runbook stamps.", ["release_notes", "runbook"], OWNED),
			qe: role("Own closure verification.", ["closure-verification"], OWNED),
			curator: role("Compact context packs.", ["state", "decisions_index"], OWNED),
			security: role("Own security-review findings.", ["security-review"], OWNED),
			critic: role("Prompt alias for sovereign-critic; spawn role remains tech-lead.", [], "none"),
			scout: role("Read-only map/ask exploration.", [], "none"),
		},
	};
}

export interface ResolveRoleInput {
	phase_id: string;
	role_id?: string;
	env?: NodeJS.ProcessEnv;
	catalog?: RoleCatalog;
}

export interface ResolvedRole {
	phase_id: string;
	role_id: string;
	canonical_role: string;
	mutability: RoleMutability;
	bounded_manifest_keys: readonly string[];
}

export function resolvePhaseRole(input: ResolveRoleInput): ResolvedRole {
	const catalog = input.catalog ?? createDefaultRoleCatalog();
	const phase = catalog.phases[input.phase_id];
	if (!phase) {
		throw new RoleRuntimeError(SESSION_UNKNOWN_PHASE, `Unknown phase_id: ${input.phase_id}`);
	}
	let roleId = input.role_id;
	if (!roleId && phase.auto_role_key) {
		const env = input.env ?? process.env;
		const raw = env[phase.auto_role_key]?.trim();
		if (raw) {
			if (!phase.allowed_roles.includes(raw)) {
				throw new RoleRuntimeError(SESSION_UNKNOWN_ROLE, `Invalid ${phase.auto_role_key}=${raw}`);
			}
			roleId = raw;
		}
	}
	if (!roleId) {
		roleId = phase.canonical_role;
	}
	if (!phase.allowed_roles.includes(roleId)) {
		throw new RoleRuntimeError(
			PHASE_ROLE_MISMATCH,
			`Role ${roleId} is not allowed for phase ${input.phase_id}`,
		);
	}
	const roleEntry = catalog.roles[roleId];
	if (!roleEntry) {
		throw new RoleRuntimeError(SESSION_UNKNOWN_ROLE, `Unknown role_id: ${roleId}`);
	}
	return {
		phase_id: input.phase_id,
		role_id: roleId,
		canonical_role: phase.canonical_role,
		mutability: roleEntry.mutability,
		bounded_manifest_keys: roleEntry.bounded_manifest_keys,
	};
}
