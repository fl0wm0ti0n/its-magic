import assert from "node:assert/strict";
import {
	mkdirSync,
	mkdtempSync,
	readdirSync,
	readFileSync,
	statSync,
	writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
	CONFIG_INVALID,
	CONFIG_LEGACY_INVALID,
	CONFIG_SCHEMA_UNSUPPORTED,
	CONFIG_SECRET_REJECTED,
	CONFIG_UNKNOWN_KEY,
	CONFIG_UNSAFE_RELAXATION,
	injectModelRouterFlags,
	injectPolicyFlags,
	injectRoleFlags,
	LegacyScratchpadAdapter,
	resolveRuntimeConfig,
	runtimeConfigJsonSchema,
} from "../../packages/config/src/index.ts";

const HERE = dirname(fileURLToPath(import.meta.url));
const STANDALONE_ROOT = join(HERE, "..", "..");
const CONFIG_ROOT = join(STANDALONE_ROOT, "packages", "config");

function walkFiles(root: string): string[] {
	const out: string[] = [];
	const stack = [root];
	while (stack.length > 0) {
		const dir = stack.pop() as string;
		for (const name of readdirSync(dir, { withFileTypes: true })) {
			if (name.name === "node_modules") {
				continue;
			}
			const path = join(dir, name.name);
			if (name.isDirectory()) {
				stack.push(path);
			} else if (/\.(ts|js|mjs|cjs|json)$/.test(name.name)) {
				out.push(path);
			}
		}
	}
	return out;
}

function assertNoPi(root: string): void {
	const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8")) as {
		dependencies?: Record<string, string>;
		devDependencies?: Record<string, string>;
	};
	const deps = { ...(pkg.dependencies ?? {}), ...(pkg.devDependencies ?? {}) };
	for (const key of Object.keys(deps)) {
		assert.equal(key.startsWith("@earendil-works/pi-"), false, key);
	}
	const hits: string[] = [];
	for (const path of walkFiles(root)) {
		const text = readFileSync(path, "utf8");
		if (text.includes("@earendil-works/pi-")) {
			hits.push(path);
		}
	}
	assert.deepEqual(hits, []);
}

function fixtureRepo(): string {
	const root = mkdtempSync(join(tmpdir(), "us0138-"));
	mkdirSync(join(root, ".its-magic"), { recursive: true });
	mkdirSync(join(root, ".cursor"), { recursive: true });
	return root;
}

function writeJsonc(path: string, body: string): void {
	mkdirSync(dirname(path), { recursive: true });
	writeFileSync(path, body, "utf8");
}

function kitFile(
	root: string,
	name: "config.json" | "config.local.json" | "config.example.json",
	shared: Record<string, string>,
	extraTop: Record<string, unknown> = {},
): void {
	const sharedLines = Object.entries(shared)
		.map(([k, v]) => `\t\t"${k}": ${JSON.stringify(v)}`)
		.join(",\n");
	writeJsonc(
		join(root, ".its-magic", name),
		`// fixture\n{\n\t"schema_version": 1,\n\t"shared": {\n${sharedLines}\n\t},\n\t"host_overlays": {}\n}\n`,
	);
	void extraTop;
}

function writeScratch(root: string, name: string, lines: string): void {
	writeFileSync(join(root, ".cursor", name), lines, "utf8");
}

function consumersDoNotImportConfig(): void {
	for (const pkg of [
		"policy-engine",
		"auth-models",
		"role-runtime",
		"pi-kernel",
		"kernel-bridge",
	]) {
		const dir = join(STANDALONE_ROOT, "packages", pkg);
		for (const path of walkFiles(dir)) {
			const text = readFileSync(path, "utf8");
			assert.equal(text.includes("@its-magic/config"), false, path);
		}
	}
}

test("test_us0138_cli_one_run_wins", () => {
	assertNoPi(CONFIG_ROOT);
	const root = fixtureRepo();
	kitFile(root, "config.example.json", { DELIVERY_MODE: "standard" });
	kitFile(root, "config.json", { DELIVERY_MODE: "ultra_lean" });
	kitFile(root, "config.local.json", { DELIVERY_MODE: "standard" });
	const result = resolveRuntimeConfig(root, {
		argv: ["--delivery-mode", "mega_quick"],
		env: {},
		materializeMissingShared: false,
	});
	assert.equal(result.ok, true);
	assert.equal(result.config.delivery.DELIVERY_MODE, "mega_quick");
	assert.equal(result.provenance.DELIVERY_MODE?.layer, 1);
	assert.equal(result.provenance.DELIVERY_MODE?.label, "cli");
	assert.equal(result.provenance.DELIVERY_MODE?.source_key, "DELIVERY_MODE");
});

test("test_us0138_local_wins_over_shared", () => {
	const root = fixtureRepo();
	kitFile(root, "config.json", { DELIVERY_MODE: "ultra_lean", TOKEN_PROFILE: "full" });
	kitFile(root, "config.local.json", { DELIVERY_MODE: "mega_quick" });
	const result = resolveRuntimeConfig(root, { argv: [], env: {}, materializeMissingShared: false });
	assert.equal(result.ok, true);
	assert.equal(result.config.delivery.DELIVERY_MODE, "mega_quick");
	assert.equal(result.provenance.DELIVERY_MODE?.label, "kit_local");
	assert.equal(result.config.token.TOKEN_PROFILE, "full");
	assert.equal(result.provenance.TOKEN_PROFILE?.label, "kit_baseline");
});

test("test_us0138_shared_wins_over_legacy", () => {
	const root = fixtureRepo();
	kitFile(root, "config.json", { DELIVERY_MODE: "mega_quick" });
	writeScratch(root, "scratchpad.md", "DELIVERY_MODE=standard\nTOKEN_PROFILE=lean\n");
	const result = resolveRuntimeConfig(root, { argv: [], env: {}, materializeMissingShared: false });
	assert.equal(result.ok, true);
	assert.equal(result.config.delivery.DELIVERY_MODE, "mega_quick");
	assert.equal(result.provenance.DELIVERY_MODE?.label, "kit_baseline");
	assert.equal(result.config.token.TOKEN_PROFILE, "lean");
	assert.equal(result.provenance.TOKEN_PROFILE?.layer, 4);
});

test("test_us0138_legacy_wins_over_defaults", () => {
	const root = fixtureRepo();
	writeScratch(root, "scratchpad.md", "DELIVERY_MODE=ultra_lean\n");
	const result = resolveRuntimeConfig(root, { argv: [], env: {}, materializeMissingShared: false });
	assert.equal(result.ok, true);
	assert.equal(result.config.delivery.DELIVERY_MODE, "ultra_lean");
	assert.equal(result.provenance.DELIVERY_MODE?.label, "cursor_baseline");
});

test("test_us0138_absent_legacy_ok", () => {
	const root = fixtureRepo();
	kitFile(root, "config.json", { DELIVERY_MODE: "standard" });
	const result = resolveRuntimeConfig(root, { argv: [], env: {}, materializeMissingShared: false });
	assert.equal(result.ok, true);
	assert.equal(result.fatal_code, undefined);
	assert.equal(result.config.delivery.DELIVERY_MODE, "standard");
	const parsed = LegacyScratchpadAdapter.parseFile(join(root, ".cursor", "missing.md"));
	assert.equal(parsed.ok, true);
	assert.deepEqual(parsed.values, {});
});

test("test_us0138_malformed_fail_closed", () => {
	const root = fixtureRepo();
	writeScratch(root, "scratchpad.md", '{ "not": "a scratchpad" }\n');
	const legacy = resolveRuntimeConfig(root, { argv: [], env: {}, materializeMissingShared: false });
	assert.equal(legacy.ok, false);
	assert.equal(legacy.fatal_code, CONFIG_LEGACY_INVALID);

	const root2 = fixtureRepo();
	writeJsonc(join(root2, ".its-magic", "config.json"), "{ not json\n");
	const invalid = resolveRuntimeConfig(root2, {
		argv: [],
		env: {},
		materializeMissingShared: false,
	});
	assert.equal(invalid.ok, false);
	assert.equal(invalid.fatal_code, CONFIG_INVALID);
});

test("test_us0138_local_file_preservation", () => {
	const root = fixtureRepo();
	const localPath = join(root, ".its-magic", "config.local.json");
	const scratchPath = join(root, ".cursor", "scratchpad.local.md");
	const localBody = '{\n  "schema_version": 1,\n  "shared": { "DELIVERY_MODE": "ultra_lean" }\n}\n';
	const scratchBody = "TOKEN_PROFILE=lean\n";
	writeFileSync(localPath, localBody, "utf8");
	writeFileSync(scratchPath, scratchBody, "utf8");
	kitFile(root, "config.example.json", { DELIVERY_MODE: "standard" });
	const beforeLocal = statSync(localPath);
	const beforeScratch = statSync(scratchPath);
	const result = resolveRuntimeConfig(root, { argv: [], env: {}, materializeMissingShared: true });
	assert.equal(result.ok, true);
	assert.equal(readFileSync(localPath, "utf8"), localBody);
	assert.equal(readFileSync(scratchPath, "utf8"), scratchBody);
	assert.equal(statSync(localPath).mtimeMs, beforeLocal.mtimeMs);
	assert.equal(statSync(scratchPath).mtimeMs, beforeScratch.mtimeMs);
});

test("test_us0138_existing_repo_identity", () => {
	const root = fixtureRepo();
	kitFile(root, "config.json", { DELIVERY_MODE: "standard", CUSTOM_LEGACY_FLAG: "1" });
	writeScratch(root, "scratchpad.md", "UNKNOWN_SCRATCH_KEY=keep\n");
	const result = resolveRuntimeConfig(root, { argv: [], env: {}, materializeMissingShared: false });
	assert.equal(result.ok, true);
	assert.equal(result.config.shared.CUSTOM_LEGACY_FLAG, "1");
	assert.equal(result.config.compat.UNKNOWN_SCRATCH_KEY, "keep");
	assert.equal(
		result.diagnostics.some((d) => d.startsWith(`${CONFIG_UNKNOWN_KEY}:`)),
		true,
	);
	assert.equal(result.fatal_code, undefined);
});

test("test_us0138_secret_rejected_from_shared", () => {
	const root = fixtureRepo();
	kitFile(root, "config.json", { OPENAI_API: "sk-abcdefghijklmnopqrstuvwxyz1234" });
	const result = resolveRuntimeConfig(root, { argv: [], env: {}, materializeMissingShared: false });
	assert.equal(result.ok, false);
	assert.equal(result.fatal_code, CONFIG_SECRET_REJECTED);
	const joined = result.diagnostics.join("\n");
	assert.equal(joined.includes("sk-abcdefghijklmnopqrstuvwxyz1234"), false);
	assert.equal(joined.includes(CONFIG_SECRET_REJECTED), true);

	const rootHandle = fixtureRepo();
	kitFile(rootHandle, "config.json", {
		secret_name: "openai_prod",
		credential_handle: "vault.main",
	});
	const ok = resolveRuntimeConfig(rootHandle, {
		argv: [],
		env: {},
		materializeMissingShared: false,
	});
	assert.equal(ok.ok, true);
	assert.equal(ok.config.shared.secret_name, "openai_prod");
});

test("test_us0138_security_hard_not_weakened_by_autonomy", () => {
	const root = fixtureRepo();
	kitFile(root, "config.json", { SECURITY_CLASS: "security_hard", AUTONOMY_PRESET: "full" });
	const result = resolveRuntimeConfig(root, { argv: [], env: {}, materializeMissingShared: false });
	assert.equal(result.ok, false);
	assert.equal(result.fatal_code, CONFIG_UNSAFE_RELAXATION);

	const rootOk = fixtureRepo();
	kitFile(rootOk, "config.json", {
		SECURITY_CLASS: "security_hard",
		AUTONOMY_PRESET: "full",
		AUTONOMY_STOP_POLICY: "block",
	});
	const allowed = resolveRuntimeConfig(rootOk, {
		argv: [],
		env: {},
		materializeMissingShared: false,
	});
	assert.equal(allowed.ok, true);
	assert.equal(allowed.config.security.security_class, "security_hard");
	assert.equal(allowed.config.stop.AUTONOMY_STOP_POLICY, "block");
	assert.equal(allowed.config.security.autonomy, "autonomous");
});

test("test_us0138_invalid_version_enum_conflict", () => {
	const rootVer = fixtureRepo();
	writeJsonc(
		join(rootVer, ".its-magic", "config.json"),
		'{ "schema_version": 99, "shared": { "DELIVERY_MODE": "standard" } }\n',
	);
	const ver = resolveRuntimeConfig(rootVer, { argv: [], env: {}, materializeMissingShared: false });
	assert.equal(ver.ok, false);
	assert.equal(ver.fatal_code, CONFIG_SCHEMA_UNSUPPORTED);

	const rootEnum = fixtureRepo();
	kitFile(rootEnum, "config.json", { DELIVERY_MODE: "turbo" });
	const badEnum = resolveRuntimeConfig(rootEnum, {
		argv: [],
		env: {},
		materializeMissingShared: false,
	});
	assert.equal(badEnum.ok, false);
	assert.equal(badEnum.fatal_code, CONFIG_INVALID);

	const rootConflict = fixtureRepo();
	kitFile(rootConflict, "config.json", { DELIVERY_MODE: "standard" });
	const conflict = resolveRuntimeConfig(rootConflict, {
		argv: ["--delivery-mode", "ultra_lean"],
		env: { ITSM_RUNTIME_DELIVERY_MODE: "mega_quick" },
		materializeMissingShared: false,
	});
	assert.equal(conflict.ok, false);
	assert.equal(conflict.fatal_code, CONFIG_INVALID);

	const rootTop = fixtureRepo();
	writeJsonc(
		join(rootTop, ".its-magic", "config.json"),
		'{ "schema_version": 1, "shared": {}, "unexpected": true }\n',
	);
	const top = resolveRuntimeConfig(rootTop, { argv: [], env: {}, materializeMissingShared: false });
	assert.equal(top.ok, false);
	assert.equal(top.fatal_code, CONFIG_INVALID);
});

test("test_us0138_provenance_and_orthogonal_axes", () => {
	consumersDoNotImportConfig();
	const root = fixtureRepo();
	kitFile(root, "config.json", { AUTONOMY_PRESET: "balanced", TOKEN_PROFILE: "full" });
	kitFile(root, "config.local.json", { TOKEN_PROFILE: "lean" });
	writeScratch(root, "scratchpad.md", "WORK_KIND_ROUTING=1\n");
	const result = resolveRuntimeConfig(root, {
		argv: ["--delivery-mode", "mega_quick"],
		env: {},
		materializeMissingShared: false,
	});
	assert.equal(result.ok, true);
	assert.equal(result.config.delivery.DELIVERY_MODE, "mega_quick");
	assert.equal(result.config.token.TOKEN_PROFILE, "lean");
	assert.equal(result.config.autonomy.AUTONOMY_PRESET, "balanced");
	assert.equal(result.config.workKind.WORK_KIND_ROUTING, 1);
	assert.equal(result.provenance.DELIVERY_MODE?.layer, 1);
	assert.equal(result.provenance.TOKEN_PROFILE?.label, "kit_local");
	assert.equal(result.provenance.AUTONOMY_PRESET?.label, "kit_baseline");
	assert.equal(result.provenance.WORK_KIND_ROUTING?.layer, 4);
	for (const key of ["DELIVERY_MODE", "TOKEN_PROFILE", "AUTONOMY_PRESET", "WORK_KIND_ROUTING"]) {
		const row = result.provenance[key];
		assert.ok(row, key);
		assert.equal(typeof row.layer, "number");
		assert.equal(typeof row.label, "string");
		assert.equal(row.source_key, key);
	}
	assert.equal(result.config.security.autonomy, "autonomous");
	assert.equal(result.config.autonomy.flags.WORK_KIND_AUTO_ACCEPT, "1");
	const policy = injectPolicyFlags(result.config);
	assert.equal(policy.autonomy, "autonomous");
	assert.equal(policy.permission_mode, "ask-on-write");
	const models = injectModelRouterFlags(result.config);
	assert.equal(models.tokenProfile, "lean");
	assert.equal(models.thinkingOrthogonal, true);
	const roles = injectRoleFlags(result.config);
	assert.equal(roles.autoRoleKeys.research, "AUTO_ROLE_RESEARCH");
	assert.equal(runtimeConfigJsonSchema.$schema?.includes("2020-12") ?? true, true);
	const biome = readFileSync(join(STANDALONE_ROOT, "biome.json"), "utf8");
	assert.equal(biome.includes("packages/config"), false);
	assert.ok(runtimeConfigJsonSchema);
});
