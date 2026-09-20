import { existsSync } from "node:fs";
import { join } from "node:path";
import { redactAudit, redactSecretShaped } from "@its-magic/auth-models";
import type {
	Autonomy,
	IsolationProfile,
	PermissionMode,
	SecurityClass,
} from "@its-magic/policy-engine";
import { isModelCatalogKey, KNOWN_SHARED_KEYS, LegacyScratchpadAdapter } from "./adapter.ts";
import { expandAutonomyPreset } from "./autonomy.ts";
import {
	CONFIG_INVALID,
	CONFIG_KEY_SHADOWED,
	CONFIG_LEGACY_INVALID,
	CONFIG_MIGRATION_HINT,
	CONFIG_SCHEMA_UNSUPPORTED,
	CONFIG_SECRET_REJECTED,
	CONFIG_UNKNOWN_KEY,
	CONFIG_UNSAFE_RELAXATION,
} from "./codes.ts";
import { looksLikeExecutableLoader, looksLikeYamlSot, stripJsonc } from "./jsonc.ts";
import { materializeSharedFromExample, readUtf8 } from "./materialize.ts";
import {
	AUTONOMY_FLAG_KEYS,
	CODE_DEFAULTS,
	fileConfigSchema,
	SCHEMA_VERSION_SUPPORTED,
	validateTypedValue,
} from "./schema.ts";
import { rejectSecretShaped } from "./secrets.ts";
import type {
	Provenance,
	ProvenanceLabel,
	ProvenanceLayer,
	ResolveRuntimeConfigOptions,
	ResolveRuntimeConfigResult,
	RuntimeConfig,
} from "./types.ts";

const CLI_FLAG_TO_KEY: Record<string, string> = {
	"--delivery-mode": "DELIVERY_MODE",
	"--token-profile": "TOKEN_PROFILE",
	"--autonomy-preset": "AUTONOMY_PRESET",
	"--work-kind": "WORK_KIND_ROUTING",
	"--config-strict": "CONFIG_STRICT",
};

const ENV_PIN_TO_KEY: Record<string, string> = {
	ITSM_RUNTIME_DELIVERY_MODE: "DELIVERY_MODE",
	ITSM_RUNTIME_TOKEN_PROFILE: "TOKEN_PROFILE",
	ITSM_RUNTIME_AUTONOMY_PRESET: "AUTONOMY_PRESET",
	ITSM_RUNTIME_WORK_KIND: "WORK_KIND_ROUTING",
	ITSM_RUNTIME_CONFIG_STRICT: "CONFIG_STRICT",
};

const OVERRIDE_KEY_RE = /^[A-Z][A-Z0-9_]*$/;
const ORTHOGONAL = new Set([
	"DELIVERY_MODE",
	"TOKEN_PROFILE",
	"AUTONOMY_PRESET",
	"WORK_KIND_ROUTING",
]);

function kitPaths(
	repoRoot: string,
	configRoot?: string,
): {
	kitDir: string;
	example: string;
	baseline: string;
	local: string;
} {
	const kitDir = configRoot ?? join(repoRoot, ".its-magic");
	return {
		kitDir,
		example: join(kitDir, "config.example.json"),
		baseline: join(kitDir, "config.json"),
		local: join(kitDir, "config.local.json"),
	};
}

function cursorPaths(repoRoot: string): { example: string; baseline: string; local: string } {
	return {
		example: join(repoRoot, ".cursor", "scratchpad.local.example.md"),
		baseline: join(repoRoot, ".cursor", "scratchpad.md"),
		local: join(repoRoot, ".cursor", "scratchpad.local.md"),
	};
}

function emptyConfig(): RuntimeConfig {
	return {
		schema_version: 1,
		delivery: { DELIVERY_MODE: "standard" },
		token: { TOKEN_PROFILE: "balanced" },
		workKind: { WORK_KIND_ROUTING: 0, WORK_KIND_TIE_BREAK: "priority_then_backlog_order" },
		phase: {
			PHASE_MODE: "interactive",
			AUTO_PHASE_INCLUDE: "",
			AUTO_PHASE_EXCLUDE: "",
			AUTO_ROLE_RESEARCH: "",
			AUTO_ROLE_PLAN_VERIFY: "",
			AUTO_ROLE_CLOSURE: "",
			AUTO_ROLE_REFRESH_CONTEXT: "",
		},
		model: { catalog_handle: "", role_handle: "", critic_handle: "", thinking_level: "" },
		autonomy: { AUTONOMY_PRESET: "none", AUTO_FLOW_MODE: "manual", flags: {} },
		stop: { AUTONOMY_STOP_POLICY: "block", AUTO_PAUSE_POLICY: "after_task" },
		retryTest: {
			AUTO_BLOCK_RETRY_MAX: 3,
			AUTO_LOOP_MAX_CYCLES: 32,
			AUTO_OUTER_DRIVER_TIMEOUT_SECONDS: "",
		},
		security: {
			security_class: "standard",
			permission_mode: "ask-on-write",
			isolation_profile: "trusted-local",
			autonomy: "supervised",
		},
		sovereign: {
			CROSS_MODEL_REVIEW: "0",
			AI_DECISION_LEDGER: "0",
			SOVEREIGN_MEMORY: "0",
			AUTO_SOVEREIGN: "0",
		},
		browser: { mode: "off", handle: "" },
		devEnvironment: { profile_name: "", stack_handle: "" },
		remote: { target_id: "", backend_handle: "" },
		shared: {},
		host_overlays: {},
		compat: {},
	};
}

function fail(
	diagnostics: string[],
	code: string,
	detail: string,
	config?: RuntimeConfig,
): ResolveRuntimeConfigResult {
	const row = redactDiagnostic(`${code}: ${detail}`);
	diagnostics.push(row);
	return {
		config: config ?? emptyConfig(),
		provenance: {},
		diagnostics: diagnostics.map(redactDiagnostic),
		ok: false,
		fatal_code: code,
	};
}

function redactDiagnostic(text: string): string {
	return String(redactSecretShaped(String(redactAudit(text) ?? text)));
}

interface LoadedKit {
	shared: Record<string, string>;
	overlays: Record<string, unknown>;
	unknown: string[];
}

function loadKitFile(
	path: string,
	diagnostics: string[],
): { ok: true; data: LoadedKit | null } | { ok: false; code: string; detail: string } {
	if (!existsSync(path)) {
		return { ok: true, data: null };
	}
	if (looksLikeExecutableLoader(path)) {
		return { ok: false, code: CONFIG_INVALID, detail: `executable loader rejected at ${path}` };
	}
	let raw: string;
	try {
		raw = readUtf8(path);
	} catch {
		return { ok: false, code: CONFIG_INVALID, detail: `unreadable ${path}` };
	}
	if (looksLikeYamlSot(raw)) {
		return { ok: false, code: CONFIG_INVALID, detail: `YAML SOT rejected at ${path}` };
	}
	let parsed: unknown;
	try {
		parsed = JSON.parse(stripJsonc(raw));
	} catch (err) {
		return {
			ok: false,
			code: CONFIG_INVALID,
			detail: `malformed JSON at ${path}: ${(err as Error).message}`,
		};
	}
	if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
		return { ok: false, code: CONFIG_INVALID, detail: `root must be object at ${path}` };
	}
	const result = fileConfigSchema.safeParse(parsed);
	if (!result.success) {
		const issue = result.error.issues[0];
		const pathKey = issue?.path.join(".") ?? "";
		if (pathKey === "schema_version" && issue?.code === "invalid_type") {
			return { ok: false, code: CONFIG_INVALID, detail: `schema_version must be int at ${path}` };
		}
		if (issue?.code === "unrecognized_keys") {
			return {
				ok: false,
				code: CONFIG_INVALID,
				detail: `unknown top-level keys at ${path}`,
			};
		}
		return {
			ok: false,
			code: CONFIG_INVALID,
			detail: `invalid file at ${path}: ${issue?.message}`,
		};
	}
	const ver = result.data.schema_version;
	if (ver !== SCHEMA_VERSION_SUPPORTED) {
		return {
			ok: false,
			code: CONFIG_SCHEMA_UNSUPPORTED,
			detail: `schema_version=${ver} unsupported (supported=${SCHEMA_VERSION_SUPPORTED})`,
		};
	}
	const sharedIn = result.data.shared ?? {};
	const shared: Record<string, string> = {};
	const unknown: string[] = [];
	for (const [key, value] of Object.entries(sharedIn)) {
		if (isModelCatalogKey(key)) {
			continue;
		}
		if (typeof value !== "string") {
			return {
				ok: false,
				code: CONFIG_INVALID,
				detail: `shared values must be string at ${path} key=${key}`,
			};
		}
		if (rejectSecretShaped(key, value)) {
			return { ok: false, code: CONFIG_SECRET_REJECTED, detail: `key=${key}` };
		}
		if (!validateTypedValue(key, value)) {
			return { ok: false, code: CONFIG_INVALID, detail: `enum/type mismatch key=${key}` };
		}
		if (!KNOWN_SHARED_KEYS.has(key)) {
			unknown.push(key);
			diagnostics.push(`${CONFIG_UNKNOWN_KEY}: key=${key}`);
		}
		shared[key] = value;
	}
	return {
		ok: true,
		data: {
			shared,
			overlays: (result.data.host_overlays ?? {}) as Record<string, unknown>,
			unknown,
		},
	};
}

function parseCliAndEnv(
	argv: string[],
	env: NodeJS.Dict<string>,
): { ok: true; values: Record<string, string> } | { ok: false; code: string; detail: string } {
	const fromArgv: Record<string, string> = {};
	const fromEnv: Record<string, string> = {};
	for (let i = 0; i < argv.length; i += 1) {
		const tok = argv[i] as string;
		if (tok === "--runtime-override" || tok.startsWith("--runtime-override=")) {
			const raw = tok.includes("=") ? tok.slice("--runtime-override=".length) : argv[i + 1];
			if (!tok.includes("=")) {
				i += 1;
			}
			if (!raw || !raw.includes("=")) {
				return { ok: false, code: CONFIG_INVALID, detail: "invalid --runtime-override KEY=VAL" };
			}
			const eq = raw.indexOf("=");
			const key = raw.slice(0, eq);
			const val = raw.slice(eq + 1);
			if (!OVERRIDE_KEY_RE.test(key)) {
				return { ok: false, code: CONFIG_INVALID, detail: `invalid override key=${key}` };
			}
			fromArgv[key] = val;
			continue;
		}
		if (tok === "--config-strict") {
			const nxt = argv[i + 1];
			if (nxt === "0" || nxt === "1") {
				fromArgv.CONFIG_STRICT = nxt;
				i += 1;
			} else {
				fromArgv.CONFIG_STRICT = "1";
			}
			continue;
		}
		if (tok.startsWith("--config-strict=")) {
			fromArgv.CONFIG_STRICT = tok.slice("--config-strict=".length);
			continue;
		}
		const mapped = CLI_FLAG_TO_KEY[tok];
		if (mapped) {
			const val = argv[i + 1];
			if (val === undefined || val.startsWith("--")) {
				return { ok: false, code: CONFIG_INVALID, detail: `missing value for ${tok}` };
			}
			fromArgv[mapped] = val;
			i += 1;
		}
	}
	for (const [envKey, configKey] of Object.entries(ENV_PIN_TO_KEY)) {
		const val = env[envKey];
		if (val !== undefined && val !== "") {
			fromEnv[configKey] = val;
		}
	}
	for (const [envKey, val] of Object.entries(env)) {
		if (!envKey.startsWith("ITSM_RUNTIME_") || val === undefined || val === "") {
			continue;
		}
		if (envKey in ENV_PIN_TO_KEY) {
			continue;
		}
		const key = envKey.slice("ITSM_RUNTIME_".length);
		if (!OVERRIDE_KEY_RE.test(key)) {
			return { ok: false, code: CONFIG_INVALID, detail: `invalid env override key=${key}` };
		}
		fromEnv[key] = val;
	}
	const merged: Record<string, string> = {};
	const keys = new Set([...Object.keys(fromArgv), ...Object.keys(fromEnv)]);
	for (const key of keys) {
		const a = fromArgv[key];
		const e = fromEnv[key];
		if (a !== undefined && e !== undefined && a !== e) {
			return { ok: false, code: CONFIG_INVALID, detail: `argv/env disagreement key=${key}` };
		}
		merged[key] = (a ?? e) as string;
		if (!validateTypedValue(key, merged[key] as string)) {
			return { ok: false, code: CONFIG_INVALID, detail: `enum/type mismatch key=${key}` };
		}
		if (rejectSecretShaped(key, merged[key] as string)) {
			return { ok: false, code: CONFIG_SECRET_REJECTED, detail: `key=${key}` };
		}
	}
	void ORTHOGONAL;
	return { ok: true, values: merged };
}

function loadLegacyLayer(path: string): {
	present: boolean;
	result: ReturnType<typeof LegacyScratchpadAdapter.parse>;
} {
	if (!existsSync(path)) {
		return { present: false, result: { values: {}, compat: {}, diagnostics: [], ok: true } };
	}
	return { present: true, result: LegacyScratchpadAdapter.parseFile(path) };
}

function stopRank(policy: string): number {
	if (policy === "block") {
		return 2;
	}
	if (policy === "auto_repair_then_block") {
		return 1;
	}
	return 0;
}

function applyLayer(
	values: Record<string, string>,
	provenance: Record<string, Provenance>,
	layer: Record<string, string>,
	meta: { layer: ProvenanceLayer; label: ProvenanceLabel; path?: string },
	diagnostics: string[],
): string | undefined {
	for (const [key, value] of Object.entries(layer)) {
		if (isModelCatalogKey(key)) {
			continue;
		}
		if (rejectSecretShaped(key, value)) {
			return CONFIG_SECRET_REJECTED;
		}
		if (!validateTypedValue(key, value)) {
			diagnostics.push(`${CONFIG_INVALID}: enum/type mismatch key=${key}`);
			return CONFIG_INVALID;
		}
		const prev = values[key];
		if (key === "SECURITY_CLASS" && prev === "security_hard" && value === "standard") {
			diagnostics.push(`${CONFIG_UNSAFE_RELAXATION}: key=${key}`);
			return CONFIG_UNSAFE_RELAXATION;
		}
		if (key === "AUTONOMY_STOP_POLICY" && prev && stopRank(value) < stopRank(prev)) {
			if (values.SECURITY_CLASS === "security_hard" || layer.SECURITY_CLASS === "security_hard") {
				diagnostics.push(`${CONFIG_UNSAFE_RELAXATION}: key=${key}`);
				return CONFIG_UNSAFE_RELAXATION;
			}
		}
		values[key] = value;
		provenance[key] = {
			layer: meta.layer,
			label: meta.label,
			path: meta.path,
			source_key: key,
		};
	}
	return undefined;
}

function as01Int(raw: string | undefined, fallback: number): number {
	if (raw === undefined || raw === "") {
		return fallback;
	}
	const n = Number.parseInt(raw, 10);
	if (!Number.isFinite(n) || String(n) !== raw.trim()) {
		return Number.NaN;
	}
	return n;
}

function buildRuntimeConfig(
	values: Record<string, string>,
	overlays: Record<string, unknown>,
	compat: Record<string, string>,
	provenance: Record<string, Provenance>,
): RuntimeConfig | { error: string; detail: string } {
	const routing = values.WORK_KIND_ROUTING ?? "0";
	if (routing !== "0" && routing !== "1") {
		return { error: CONFIG_INVALID, detail: "enum/type mismatch key=WORK_KIND_ROUTING" };
	}
	const retryMax = as01Int(values.AUTO_BLOCK_RETRY_MAX, 3);
	const loopMax = as01Int(values.AUTO_LOOP_MAX_CYCLES, 32);
	if (Number.isNaN(retryMax) || Number.isNaN(loopMax)) {
		return { error: CONFIG_INVALID, detail: "invalid integer retry/test cap" };
	}
	const preset = (values.AUTONOMY_PRESET ?? "none") as RuntimeConfig["autonomy"]["AUTONOMY_PRESET"];
	const autonomy: Autonomy = preset === "none" ? "supervised" : "autonomous";
	const permCfg = values.PERMISSION_MODE ?? "interactive";
	const permission_mode: PermissionMode = permCfg === "auto" ? "default-deny" : "ask-on-write";
	const security_class: SecurityClass =
		values.SECURITY_CLASS === "security_hard" ? "security_hard" : "standard";
	const isolation_profile: IsolationProfile =
		(values.ISOLATION_PROFILE as IsolationProfile | undefined) ?? "trusted-local";
	const flags: Record<string, string> = {};
	try {
		const overrides: Record<string, string> = {};
		for (const key of AUTONOMY_FLAG_KEYS) {
			const origin = provenance[key];
			if (key in values && origin && origin.label !== "code_defaults") {
				overrides[key] = values[key] as string;
			}
		}
		const expanded = expandAutonomyPreset(preset, overrides);
		const presetOrigin = provenance.AUTONOMY_PRESET;
		for (const [k, v] of Object.entries(expanded)) {
			flags[k] = v;
			values[k] = v;
			if (!provenance[k] || provenance[k]?.label === "code_defaults") {
				provenance[k] = presetOrigin ?? {
					layer: 5,
					label: "code_defaults",
					source_key: k,
				};
			}
		}
	} catch {
		return { error: CONFIG_INVALID, detail: "enum/type mismatch key=AUTONOMY_PRESET" };
	}
	if (security_class === "security_hard") {
		const stop = flags.AUTONOMY_STOP_POLICY ?? values.AUTONOMY_STOP_POLICY ?? "block";
		if (stop !== "block") {
			return {
				error: CONFIG_UNSAFE_RELAXATION,
				detail: "security_hard cannot be autonomy_resolvable",
			};
		}
		if (values.SECURITY_HARD_AUTONOMY_RESOLVABLE === "1" || values.AUTONOMY_RESOLVABLE === "1") {
			return {
				error: CONFIG_UNSAFE_RELAXATION,
				detail: "security_hard cannot be autonomy_resolvable",
			};
		}
	}
	return {
		schema_version: 1,
		delivery: {
			DELIVERY_MODE: (values.DELIVERY_MODE ??
				"standard") as RuntimeConfig["delivery"]["DELIVERY_MODE"],
		},
		token: {
			TOKEN_PROFILE: (values.TOKEN_PROFILE ??
				"balanced") as RuntimeConfig["token"]["TOKEN_PROFILE"],
		},
		workKind: {
			WORK_KIND_ROUTING: routing === "1" ? 1 : 0,
			WORK_KIND_TIE_BREAK: (values.WORK_KIND_TIE_BREAK ??
				"priority_then_backlog_order") as RuntimeConfig["workKind"]["WORK_KIND_TIE_BREAK"],
		},
		phase: {
			PHASE_MODE: (values.PHASE_MODE ?? "interactive") as RuntimeConfig["phase"]["PHASE_MODE"],
			AUTO_PHASE_INCLUDE: values.AUTO_PHASE_INCLUDE ?? "",
			AUTO_PHASE_EXCLUDE: values.AUTO_PHASE_EXCLUDE ?? "",
			AUTO_ROLE_RESEARCH: values.AUTO_ROLE_RESEARCH ?? "",
			AUTO_ROLE_PLAN_VERIFY: values.AUTO_ROLE_PLAN_VERIFY ?? "",
			AUTO_ROLE_CLOSURE: values.AUTO_ROLE_CLOSURE ?? "",
			AUTO_ROLE_REFRESH_CONTEXT: values.AUTO_ROLE_REFRESH_CONTEXT ?? "",
		},
		model: {
			catalog_handle: values.MODEL_CATALOG_HANDLE ?? "",
			role_handle: values.MODEL_ROLE_HANDLE ?? "",
			critic_handle: values.MODEL_CRITIC_HANDLE ?? "",
			thinking_level: values.THINKING_LEVEL ?? "",
		},
		autonomy: {
			AUTONOMY_PRESET: preset,
			AUTO_FLOW_MODE: (values.AUTO_FLOW_MODE ??
				"manual") as RuntimeConfig["autonomy"]["AUTO_FLOW_MODE"],
			flags,
		},
		stop: {
			AUTONOMY_STOP_POLICY: (flags.AUTONOMY_STOP_POLICY ??
				values.AUTONOMY_STOP_POLICY ??
				"block") as RuntimeConfig["stop"]["AUTONOMY_STOP_POLICY"],
			AUTO_PAUSE_POLICY: (values.AUTO_PAUSE_POLICY ??
				"after_task") as RuntimeConfig["stop"]["AUTO_PAUSE_POLICY"],
		},
		retryTest: {
			AUTO_BLOCK_RETRY_MAX: retryMax,
			AUTO_LOOP_MAX_CYCLES: loopMax,
			AUTO_OUTER_DRIVER_TIMEOUT_SECONDS: values.AUTO_OUTER_DRIVER_TIMEOUT_SECONDS ?? "",
		},
		security: {
			security_class,
			permission_mode,
			isolation_profile,
			autonomy,
		},
		sovereign: {
			CROSS_MODEL_REVIEW: (values.CROSS_MODEL_REVIEW ?? "0") as "0" | "1",
			AI_DECISION_LEDGER: (values.AI_DECISION_LEDGER ?? "0") as "0" | "1",
			SOVEREIGN_MEMORY: (values.SOVEREIGN_MEMORY ?? "0") as "0" | "1",
			AUTO_SOVEREIGN: (values.AUTO_SOVEREIGN ?? "0") as "0" | "1",
		},
		browser: {
			mode: (values.BROWSER_MODE ?? "off") as RuntimeConfig["browser"]["mode"],
			handle: values.BROWSER_HANDLE ?? "",
		},
		devEnvironment: {
			profile_name: values.DEV_ENVIRONMENT_PROFILE ?? "",
			stack_handle: values.DEV_STACK_HANDLE ?? "",
		},
		remote: {
			target_id: values.REMOTE_TARGET_ID ?? "",
			backend_handle: values.REMOTE_BACKEND_HANDLE ?? "",
		},
		shared: { ...values },
		host_overlays: overlays,
		compat,
	};
}

export function resolveRuntimeConfig(
	repoRoot: string,
	options: ResolveRuntimeConfigOptions = {},
): ResolveRuntimeConfigResult {
	const diagnostics: string[] = [];
	const env = options.env ?? {};
	const argv = options.argv ?? [];
	const configRoot =
		options.configRoot ??
		(typeof env.ITS_MAGIC_CONFIG_ROOT === "string" && env.ITS_MAGIC_CONFIG_ROOT
			? env.ITS_MAGIC_CONFIG_ROOT
			: undefined);
	const paths = kitPaths(repoRoot, configRoot);
	if (options.materializeMissingShared !== false) {
		materializeSharedFromExample(paths.kitDir);
	}

	const cli = parseCliAndEnv(argv, env);
	if (!cli.ok) {
		return fail(diagnostics, cli.code, cli.detail);
	}

	const localFile = loadKitFile(paths.local, diagnostics);
	if (!localFile.ok) {
		return fail(diagnostics, localFile.code, localFile.detail);
	}
	const sharedFile = loadKitFile(paths.baseline, diagnostics);
	if (!sharedFile.ok) {
		return fail(diagnostics, sharedFile.code, sharedFile.detail);
	}
	const exampleFile = loadKitFile(paths.example, diagnostics);
	if (!exampleFile.ok) {
		return fail(diagnostics, exampleFile.code, exampleFile.detail);
	}

	const cursor = cursorPaths(repoRoot);
	const legacyLocal = loadLegacyLayer(cursor.local);
	const legacyBase = loadLegacyLayer(cursor.baseline);
	const legacyExample = loadLegacyLayer(cursor.example);
	for (const layer of [legacyLocal, legacyBase, legacyExample]) {
		if (layer.present && !layer.result.ok) {
			return fail(
				diagnostics,
				layer.result.fatal_code ?? CONFIG_LEGACY_INVALID,
				layer.result.diagnostics[0] ?? CONFIG_LEGACY_INVALID,
			);
		}
	}

	const legacyMerged = LegacyScratchpadAdapter.mergeLayers(
		legacyExample.result.values,
		legacyBase.result.values,
		legacyLocal.result.values,
	);
	const legacyMapped = LegacyScratchpadAdapter.map(legacyMerged);
	diagnostics.push(...legacyMapped.diagnostics);
	const migrationKeys = Object.keys(legacyMapped.values).filter((k) => !isModelCatalogKey(k));
	if (migrationKeys.length > 0) {
		diagnostics.push(`${CONFIG_MIGRATION_HINT}: keys=${migrationKeys.sort().join(",")}`);
	}

	const kitLocal = localFile.data?.shared ?? {};
	const kitBase = sharedFile.data?.shared ?? {};
	const kitExample = exampleFile.data?.shared ?? {};
	const overlays = {
		...(exampleFile.data?.overlays ?? {}),
		...(sharedFile.data?.overlays ?? {}),
		...(localFile.data?.overlays ?? {}),
	};

	const cursorLocalOnly = legacyLocal.result.values;
	const strict =
		cli.values.CONFIG_STRICT === "1" || kitLocal.CONFIG_STRICT === "1" || env.CONFIG_STRICT === "1";
	for (const key of new Set([...Object.keys(kitLocal), ...Object.keys(cursorLocalOnly)])) {
		if (key in kitLocal && key in cursorLocalOnly && kitLocal[key] !== cursorLocalOnly[key]) {
			const msg = `${CONFIG_KEY_SHADOWED}: key=${key} kit_local wins`;
			diagnostics.push(msg);
			if (strict) {
				return fail(diagnostics, CONFIG_KEY_SHADOWED, `key=${key}`);
			}
		}
	}
	if (strict) {
		const unknown = diagnostics.filter((d) => d.startsWith(`${CONFIG_UNKNOWN_KEY}:`));
		if (unknown.length > 0) {
			return fail(diagnostics, CONFIG_UNKNOWN_KEY, "strict unknown keys");
		}
	}

	const values: Record<string, string> = {};
	const provenance: Record<string, Provenance> = {};
	const publicOrder: Array<{
		data: Record<string, string>;
		layer: ProvenanceLayer;
		label: ProvenanceLabel;
		path?: string;
	}> = [
		{ data: CODE_DEFAULTS, layer: 5, label: "code_defaults" },
		{ data: kitExample, layer: 5, label: "kit_example", path: paths.example },
		{ data: legacyBase.result.values, layer: 4, label: "cursor_baseline", path: cursor.baseline },
		{ data: cursorLocalOnly, layer: 4, label: "cursor_local", path: cursor.local },
		{ data: kitBase, layer: 3, label: "kit_baseline", path: paths.baseline },
		{ data: kitLocal, layer: 2, label: "kit_local", path: paths.local },
		{ data: cli.values, layer: 1, label: "cli" },
	];

	for (const item of publicOrder) {
		const code = applyLayer(values, provenance, item.data, item, diagnostics);
		if (code === CONFIG_SECRET_REJECTED) {
			return fail(diagnostics, CONFIG_SECRET_REJECTED, "secret-shaped value");
		}
		if (code) {
			return fail(diagnostics, code, diagnostics.at(-1) ?? code);
		}
	}

	for (const [key, value] of Object.entries(legacyMapped.compat)) {
		if (!(key in kitLocal) && !(key in kitBase) && !(key in cli.values)) {
			values[key] = values[key] ?? value;
		}
	}

	const built = buildRuntimeConfig(values, overlays, legacyMapped.compat, provenance);
	if ("error" in built) {
		return fail(diagnostics, built.error, built.detail);
	}

	return {
		config: built,
		provenance,
		diagnostics: diagnostics.map(redactDiagnostic),
		ok: true,
	};
}
