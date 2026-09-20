/** Consume-only view of US-0138 RuntimeConfig. Not a new domain. */

export interface ConfigView {
	delivery?: { DELIVERY_MODE?: string };
	token?: { TOKEN_PROFILE?: string };
	workKind?: { WORK_KIND_ROUTING?: 0 | 1 | string };
	autonomy?: { AUTONOMY_PRESET?: string; flags?: Record<string, string> };
	shared?: Record<string, string>;
	compat?: Record<string, string>;
	retryTest?: { AUTO_LOOP_MAX_CYCLES?: number; AUTO_BLOCK_RETRY_MAX?: number };
	sovereign?: {
		CROSS_MODEL_REVIEW?: string;
		SOVEREIGN_RUNTIME?: string;
		SOVEREIGN_MEMORY?: string;
		SOVEREIGN_DRAIN_AUTO_ACCEPT?: string;
	};
	phase?: Record<string, string>;
}

function flagOf(config: ConfigView, key: string, fallback = ""): string {
	return (
		config.autonomy?.flags?.[key] ??
		config.shared?.[key] ??
		config.compat?.[key] ??
		config.phase?.[key] ??
		fallback
	);
}

function parseIntFlag(raw: string | undefined, fallback: number): number {
	if (raw === undefined || raw === "") {
		return fallback;
	}
	const n = Number.parseInt(raw, 10);
	return Number.isFinite(n) ? n : fallback;
}

export function lookupImplementationLoop(config: ConfigView): boolean {
	const raw = flagOf(config, "AUTO_IMPLEMENTATION_LOOP", "0");
	return raw === "1";
}

export function lookupLoopCap(config: ConfigView): number {
	const cap = config.retryTest?.AUTO_LOOP_MAX_CYCLES;
	return typeof cap === "number" && Number.isFinite(cap) ? cap : 32;
}

export function lookupCrossModelReview(config: ConfigView): boolean {
	return config.sovereign?.CROSS_MODEL_REVIEW === "1";
}

export function lookupSovereignRuntime(config: ConfigView): boolean {
	const raw =
		config.sovereign?.SOVEREIGN_RUNTIME ??
		config.autonomy?.flags?.SOVEREIGN_RUNTIME ??
		config.shared?.SOVEREIGN_RUNTIME ??
		"0";
	return raw === "1";
}

export function lookupSovereignMemory(config: ConfigView): boolean {
	const raw =
		config.sovereign?.SOVEREIGN_MEMORY ??
		config.autonomy?.flags?.SOVEREIGN_MEMORY ??
		config.shared?.SOVEREIGN_MEMORY ??
		"0";
	return raw === "1";
}

export function lookupDeliveryMode(config: ConfigView): string {
	return config.delivery?.DELIVERY_MODE ?? "standard";
}

export function lookupTokenProfile(config: ConfigView): string {
	return config.token?.TOKEN_PROFILE ?? config.shared?.TOKEN_PROFILE ?? "balanced";
}

export function lookupVoice(config: ConfigView): string {
	const shared = config.shared ?? {};
	const mode = shared.CAVEMAN_MODE ?? "0";
	const level = shared.CAVEMAN_LEVEL ?? "";
	const compress = shared.CAVEMAN_COMPRESS_INPUT ?? "0";
	return `CAVEMAN_MODE=${mode};CAVEMAN_LEVEL=${level};CAVEMAN_COMPRESS_INPUT=${compress}`;
}

export function lookupAutonomyPreset(config: ConfigView): string {
	return config.autonomy?.AUTONOMY_PRESET ?? config.shared?.AUTONOMY_PRESET ?? "none";
}

export function lookupWorkKindRouting(config: ConfigView): "0" | "1" {
	const raw = config.workKind?.WORK_KIND_ROUTING ?? flagOf(config, "WORK_KIND_ROUTING", "0");
	return raw === 1 || raw === "1" ? "1" : "0";
}

export function lookupBacklogMaxStories(config: ConfigView): number {
	return parseIntFlag(flagOf(config, "AUTO_BACKLOG_MAX_STORIES", "10"), 10);
}

export function lookupBacklogOnBlock(config: ConfigView): "stop" | "skip" {
	return flagOf(config, "AUTO_BACKLOG_ON_BLOCK", "skip") === "stop" ? "stop" : "skip";
}

export function lookupExecuteMaxItems(config: ConfigView): number {
	return parseIntFlag(flagOf(config, "AUTO_EXECUTE_MAX_ITEMS", "1"), 1);
}

export function lookupBlockRetryMax(config: ConfigView): number {
	const cap = config.retryTest?.AUTO_BLOCK_RETRY_MAX;
	if (typeof cap === "number" && Number.isFinite(cap)) {
		return cap;
	}
	return parseIntFlag(flagOf(config, "AUTO_BLOCK_RETRY_MAX", "3"), 3);
}

export function lookupPauseRequest(config: ConfigView): boolean {
	return flagOf(config, "AUTO_PAUSE_REQUEST", "0") === "1";
}

export function lookupQuiet(config: ConfigView): boolean {
	return flagOf(config, "AUTO_QUIET", "0") === "1";
}

export function lookupBugQueue(config: ConfigView): boolean {
	return flagOf(config, "AUTO_BUG_QUEUE", "0") === "1";
}

export function lookupBugMaxItems(config: ConfigView): number {
	return parseIntFlag(flagOf(config, "AUTO_BUG_MAX_ITEMS", "0"), 0);
}

export function lookupComponentScopeMode(config: ConfigView): boolean {
	return flagOf(config, "COMPONENT_SCOPE_MODE", "0") === "1";
}

export function lookupAutoPhaseKeys(config: ConfigView): boolean {
	const keys = [
		"AUTO_PHASE_PLAN",
		"AUTO_PHASE_EXCLUDE",
		"AUTO_PHASE_INCLUDE",
		"AUTO_PHASE_PROFILE",
	];
	return keys.some((key) => flagOf(config, key, "").trim().length > 0);
}

export function collectAutonomyOverrides(config: ConfigView): Record<string, string> {
	return { ...(config.autonomy?.flags ?? {}) };
}

export function lookupParallelDev(config: ConfigView): boolean {
	return flagOf(config, "SOVEREIGN_PARALLEL_DEV", "0") === "1";
}

export function lookupSelfHealingDeploy(config: ConfigView): boolean {
	return flagOf(config, "AUTO_SOVEREIGN_SELF_HEALING_DEPLOY", "0") === "1";
}
