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
