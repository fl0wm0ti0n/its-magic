import { readFileSync } from "node:fs";
import { CONFIG_LEGACY_INVALID, CONFIG_UNKNOWN_KEY } from "./codes.ts";
import { AUTO_ROLE_CONFIG_KEYS, AUTONOMY_FLAG_KEYS, isTypedKey } from "./schema.ts";

const MODEL_KEY_RE = /^(MODEL_|MODEL_TIER_)/;

export function isModelCatalogKey(key: string): boolean {
	return MODEL_KEY_RE.test(key);
}

const KNOWN_SHARED_KEYS = new Set<string>([
	...Object.keys({
		DELIVERY_MODE: 1,
		TOKEN_PROFILE: 1,
		AUTONOMY_PRESET: 1,
		WORK_KIND_ROUTING: 1,
		WORK_KIND_TIE_BREAK: 1,
		PHASE_MODE: 1,
		PERMISSION_MODE: 1,
		AUTO_FLOW_MODE: 1,
		AUTONOMY_STOP_POLICY: 1,
		AUTO_PAUSE_POLICY: 1,
		SECURITY_CLASS: 1,
		ISOLATION_PROFILE: 1,
		BROWSER_MODE: 1,
		BROWSER_HANDLE: 1,
		DEV_ENVIRONMENT_PROFILE: 1,
		DEV_STACK_HANDLE: 1,
		REMOTE_TARGET_ID: 1,
		REMOTE_BACKEND_HANDLE: 1,
		CROSS_MODEL_REVIEW: 1,
		AI_DECISION_LEDGER: 1,
		SOVEREIGN_MEMORY: 1,
		AUTO_SOVEREIGN: 1,
		AUTO_LOOP_MAX_CYCLES: 1,
		AUTO_BLOCK_RETRY_MAX: 1,
		AUTO_OUTER_DRIVER_TIMEOUT_SECONDS: 1,
		AUTO_PHASE_INCLUDE: 1,
		AUTO_PHASE_EXCLUDE: 1,
		MODEL_CATALOG_HANDLE: 1,
		MODEL_ROLE_HANDLE: 1,
		MODEL_CRITIC_HANDLE: 1,
		THINKING_LEVEL: 1,
		CONFIG_STRICT: 1,
		secret_name: 1,
		credential_handle: 1,
	}),
	...AUTONOMY_FLAG_KEYS,
	...AUTO_ROLE_CONFIG_KEYS,
]);

export interface LegacyParseResult {
	values: Record<string, string>;
	compat: Record<string, string>;
	diagnostics: string[];
	ok: boolean;
	fatal_code?: string;
}

function isMalformedScratchpad(text: string): boolean {
	if (text.includes("\0")) {
		return true;
	}
	const trimmed = text.trimStart();
	if (trimmed.startsWith("{") || trimmed.startsWith("---")) {
		return true;
	}
	for (const raw of text.split(/\r?\n/)) {
		const line = raw.trim();
		if (!line || line.startsWith("#") || line.startsWith("- ") || line.startsWith("<!--")) {
			continue;
		}
		if (line.startsWith("=")) {
			return true;
		}
	}
	return false;
}

export function parseScratchpadText(text: string): Record<string, string> {
	const out: Record<string, string> = {};
	for (const raw of text.split(/\r?\n/)) {
		const line = raw.trim();
		if (!line || line.startsWith("#") || line.startsWith("- ") || line.startsWith("<!--")) {
			continue;
		}
		if (!line.includes("=")) {
			continue;
		}
		const eq = line.indexOf("=");
		const key = line.slice(0, eq).trim();
		const val = line.slice(eq + 1).trim();
		if (key) {
			out[key] = val;
		}
	}
	return out;
}

export const LegacyScratchpadAdapter = {
	parse(text: string, path?: string): LegacyParseResult {
		if (isMalformedScratchpad(text)) {
			const loc = path ? ` at ${path}` : "";
			return {
				values: {},
				compat: {},
				diagnostics: [`${CONFIG_LEGACY_INVALID}: malformed legacy scratchpad${loc}`],
				ok: false,
				fatal_code: CONFIG_LEGACY_INVALID,
			};
		}
		const raw = parseScratchpadText(text);
		return LegacyScratchpadAdapter.map(raw);
	},

	parseFile(path: string): LegacyParseResult {
		let text: string;
		try {
			text = readFileSync(path, "utf8");
		} catch (err) {
			const code = (err as NodeJS.ErrnoException).code;
			if (code === "ENOENT") {
				return { values: {}, compat: {}, diagnostics: [], ok: true };
			}
			return {
				values: {},
				compat: {},
				diagnostics: [`${CONFIG_LEGACY_INVALID}: unreadable ${path}`],
				ok: false,
				fatal_code: CONFIG_LEGACY_INVALID,
			};
		}
		return LegacyScratchpadAdapter.parse(text, path);
	},

	map(raw: Record<string, string>): LegacyParseResult {
		const values: Record<string, string> = {};
		const compat: Record<string, string> = {};
		const diagnostics: string[] = [];
		for (const [key, value] of Object.entries(raw)) {
			if (isModelCatalogKey(key)) {
				continue;
			}
			if (KNOWN_SHARED_KEYS.has(key) || isTypedKey(key)) {
				values[key] = value;
			} else {
				compat[key] = value;
				values[key] = value;
				diagnostics.push(`${CONFIG_UNKNOWN_KEY}: key=${key}`);
			}
		}
		return { values, compat, diagnostics, ok: true };
	},

	mergeLayers(
		example: Record<string, string>,
		baseline: Record<string, string>,
		local: Record<string, string>,
	): Record<string, string> {
		const merged: Record<string, string> = {};
		for (const key of new Set([
			...Object.keys(example),
			...Object.keys(baseline),
			...Object.keys(local),
		])) {
			if (key in local) {
				merged[key] = local[key] as string;
			} else if (key in baseline) {
				merged[key] = baseline[key] as string;
			} else {
				merged[key] = example[key] as string;
			}
		}
		return merged;
	},
};

export { KNOWN_SHARED_KEYS };
