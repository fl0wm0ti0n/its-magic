import { appendFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import {
	canonicalizeAgainstWorktree,
	POLICY_DEFAULT_DENY,
	POLICY_TRAVERSAL_DENIED,
} from "@its-magic/policy-engine";
import type { ConfigView } from "../config-view.ts";

export const PARALLEL_DEV_RESOURCE_CAP_EXHAUSTED = "PARALLEL_DEV_RESOURCE_CAP_EXHAUSTED";
export const DELIVERY_WALL_CLOCK_EXCEEDED = "DELIVERY_WALL_CLOCK_EXCEEDED";
export const DELIVERY_TOKEN_BUDGET_EXHAUSTED = "DELIVERY_TOKEN_BUDGET_EXHAUSTED";
export const DELIVERY_CONCURRENT_TEST_CAP = "DELIVERY_CONCURRENT_TEST_CAP";

export interface DeliveryResourceSnapshot {
	active_worktrees: number;
	concurrent_tests: number;
	wall_clock_ms: number;
	token_spend: number;
}

export interface DeliveryResourceLimits {
	max_worktrees: number;
	max_concurrent_tests: number;
	max_wall_clock_ms: number;
	max_token_spend: number;
}

export type DeliveryResourceVerdict = { ok: true } | { ok: false; reason_code: string };

export class DeliveryResourceGuard {
	private readonly limits: DeliveryResourceLimits;

	constructor(config: ConfigView, limits?: DeliveryResourceLimits) {
		this.limits = limits ?? defaultLimits(config);
	}

	check(snapshot: DeliveryResourceSnapshot): DeliveryResourceVerdict {
		if (snapshot.active_worktrees > this.limits.max_worktrees) {
			return { ok: false, reason_code: PARALLEL_DEV_RESOURCE_CAP_EXHAUSTED };
		}
		if (snapshot.concurrent_tests > this.limits.max_concurrent_tests) {
			return { ok: false, reason_code: DELIVERY_CONCURRENT_TEST_CAP };
		}
		if (snapshot.wall_clock_ms > this.limits.max_wall_clock_ms) {
			return { ok: false, reason_code: DELIVERY_WALL_CLOCK_EXCEEDED };
		}
		if (snapshot.token_spend > this.limits.max_token_spend) {
			return { ok: false, reason_code: DELIVERY_TOKEN_BUDGET_EXHAUSTED };
		}
		return { ok: true };
	}
}

function flagOf(config: ConfigView, key: string, fallback: string): string {
	return config.autonomy?.flags?.[key] ?? config.shared?.[key] ?? config.compat?.[key] ?? fallback;
}

function parseIntFlag(raw: string, fallback: number): number {
	const n = Number.parseInt(raw, 10);
	return Number.isFinite(n) ? n : fallback;
}

export function defaultLimits(config: ConfigView): DeliveryResourceLimits {
	return {
		max_worktrees: parseIntFlag(flagOf(config, "AUTO_SOVEREIGN_PARALLEL_MAX_TOTAL", "6"), 6),
		max_concurrent_tests: parseIntFlag(flagOf(config, "AUTO_SOVEREIGN_PARALLEL_N", "3"), 3),
		max_wall_clock_ms:
			parseIntFlag(flagOf(config, "AUTO_SOVEREIGN_PARALLEL_MERGE_TIMEOUT_SEC", "60"), 60) * 1000,
		max_token_spend: parseIntFlag(flagOf(config, "AUTO_TOKEN_BUDGET_MAX", "1000000"), 1_000_000),
	};
}

export function createDeliveryResourceGuard(config: ConfigView): DeliveryResourceGuard {
	return new DeliveryResourceGuard(config);
}

export type DeliveryLimitAction = "worktree_create" | "deploy" | "repair";

export interface DeliveryAuditLine {
	audit: "delivery_limit";
	action: DeliveryLimitAction;
	ok: boolean;
	reason_code?: string;
	path: string;
}

export type DeliveryAdmission =
	| { ok: true; audit_ref: string }
	| { ok: false; reason_code: string; audit_ref: string };

function admitPath(
	path: string | undefined,
	worktreeRoot: string,
): { ok: true } | { ok: false; reason_code: string } {
	if (!path || !worktreeRoot) {
		return { ok: false, reason_code: POLICY_DEFAULT_DENY };
	}
	const canon = canonicalizeAgainstWorktree(path, worktreeRoot, worktreeRoot);
	if (!canon.ok) {
		return {
			ok: false,
			reason_code:
				canon.reason_code === POLICY_TRAVERSAL_DENIED
					? POLICY_TRAVERSAL_DENIED
					: POLICY_DEFAULT_DENY,
		};
	}
	return { ok: true };
}

export function appendDeliveryAudit(kernelRoot: string, line: DeliveryAuditLine): string {
	const rel = join("handoffs", "deploy_results", "deploy_results.jsonl");
	const abs = join(kernelRoot, rel);
	mkdirSync(dirname(abs), { recursive: true });
	appendFileSync(abs, `${JSON.stringify(line)}\n`, "utf8");
	return rel.replace(/\\/g, "/");
}

/** Guard and path policy before worktree create, deploy, or repair. One audit line per check. */
export function admitDeliveryAction(input: {
	config: ConfigView;
	kernelRoot: string;
	action: DeliveryLimitAction;
	path?: string;
	snapshot?: DeliveryResourceSnapshot;
}): DeliveryAdmission {
	if (!input.kernelRoot) {
		return { ok: false, reason_code: POLICY_DEFAULT_DENY, audit_ref: "" };
	}
	const guard = createDeliveryResourceGuard(input.config);
	const cap = guard.check(
		input.snapshot ?? {
			active_worktrees: 0,
			concurrent_tests: 0,
			wall_clock_ms: 0,
			token_spend: 0,
		},
	);
	const policy = admitPath(input.path, input.kernelRoot);
	const ok = cap.ok && policy.ok;
	const reason_code = !cap.ok ? cap.reason_code : !policy.ok ? policy.reason_code : undefined;
	const audit_ref = appendDeliveryAudit(input.kernelRoot, {
		audit: "delivery_limit",
		action: input.action,
		ok,
		reason_code,
		path: input.path ?? "",
	});
	if (!ok) {
		return { ok: false, reason_code: reason_code || POLICY_DEFAULT_DENY, audit_ref };
	}
	return { ok: true, audit_ref };
}
