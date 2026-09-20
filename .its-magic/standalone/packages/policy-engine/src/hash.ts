import { createHash } from "node:crypto";

export function canonicalJson(value: unknown): string {
	return JSON.stringify(sortKeys(value));
}

function sortKeys(value: unknown): unknown {
	if (Array.isArray(value)) {
		return value.map(sortKeys);
	}
	if (value && typeof value === "object") {
		const obj = value as Record<string, unknown>;
		const out: Record<string, unknown> = {};
		for (const key of Object.keys(obj).sort()) {
			out[key] = sortKeys(obj[key]);
		}
		return out;
	}
	return value;
}

export function sha256Canonical(value: unknown): string {
	return createHash("sha256").update(canonicalJson(value), "utf8").digest("hex").toUpperCase();
}

export interface PolicyHashInput {
	policy_snapshot: unknown;
	tool_allowlist: string[];
	role_catalog_digest: string;
}

/** Real policy_hash (DEC-0137 §10). Does not extend DEC-0038. */
export function computePolicyHash(input: PolicyHashInput): string {
	return sha256Canonical({
		schema_version: 1,
		policy_snapshot: input.policy_snapshot,
		tool_allowlist: input.tool_allowlist,
		role_catalog_digest: input.role_catalog_digest,
	});
}

export const DEFAULT_POLICY_SNAPSHOT = {
	schema_version: 1 as const,
	default_deny: true as const,
	security_hard_unrelaxable: true as const,
};
