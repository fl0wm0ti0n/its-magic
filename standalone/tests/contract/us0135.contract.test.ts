import assert from "node:assert/strict";
import {
	existsSync,
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
	AUTH_PATH_IN_PROJECT,
	AuthModelsError,
	type AuthRuntimePort,
	type AuthType,
	assertAuthPathOutsideProject,
	CROSS_MODEL_DEGRADED_MODE,
	clampThinkingLevel,
	containsTokenShape,
	dispatchItsmCommand,
	ensureOwnedStore,
	FAKE_MODEL_SLUG,
	MODEL_OVERRIDE_SLUG_UNKNOWN,
	MODEL_ROLE_SLUG_UNKNOWN,
	MODELS_TEST_LIVE_FORBIDDEN,
	resolve as resolveModel,
	resolveOwnedAuthDir,
	type StandaloneCatalog,
} from "../../packages/auth-models/src/index.ts";
import {
	createAgentKernel,
	createAuthRuntimeAdapter,
	createFakeModel,
	createFakeModelRuntime,
	createInMemoryCredentialStore,
	getLoaderSnapshot,
	getProductionFactorySpec,
} from "../../packages/pi-kernel/src/index.ts";

const HERE = dirname(fileURLToPath(import.meta.url));
const STANDALONE_ROOT = join(HERE, "..", "..");
const AUTH_MODELS_ROOT = join(STANDALONE_ROOT, "packages", "auth-models");
const PI_KERNEL_SRC = join(STANDALONE_ROOT, "packages", "pi-kernel", "src");

function tmp(prefix: string): string {
	return mkdtempSync(join(tmpdir(), prefix));
}

function fakeAdapter(
	auth: Record<string, AuthType | null> = { openai: "api_key" },
): AuthRuntimePort {
	return {
		async createRuntime() {},
		async login() {},
		async logout() {},
		async checkAuth(providerId) {
			const type = auth[providerId];
			return type ? { type } : null;
		},
		registerProvider() {},
		getModel(provider, model) {
			return { provider, model };
		},
	};
}

function captureIo(): {
	stdout: string[];
	stderr: string[];
	io: { stdout: (s: string) => void; stderr: (s: string) => void };
} {
	const stdout: string[] = [];
	const stderr: string[] = [];
	return {
		stdout,
		stderr,
		io: {
			stdout: (s) => stdout.push(s),
			stderr: (s) => stderr.push(s),
		},
	};
}

function walkTs(root: string): string[] {
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

test("test_us0135_owned_auth_path_outside_project", () => {
	const project = tmp("us0135-proj-");
	mkdirSync(join(project, "src"));
	const owned = resolveOwnedAuthDir({
		APPDATA: join(tmpdir(), "us0135-appdata"),
		XDG_CONFIG_HOME: join(tmpdir(), "us0135-xdg"),
		HOME: join(tmpdir(), "us0135-home"),
		USERPROFILE: join(tmpdir(), "us0135-home"),
	});
	assert.equal(owned.includes("its-magic"), true);
	assertAuthPathOutsideProject(owned, project);
	assert.throws(
		() => assertAuthPathOutsideProject("./auth.json", project),
		(err: unknown) => err instanceof AuthModelsError && err.code === AUTH_PATH_IN_PROJECT,
	);
	assert.throws(
		() => assertAuthPathOutsideProject(join(project, ".env"), project),
		(err: unknown) => err instanceof AuthModelsError && err.code === AUTH_PATH_IN_PROJECT,
	);
	assert.throws(
		() => assertAuthPathOutsideProject(join(project, "secrets"), project),
		(err: unknown) => err instanceof AuthModelsError && err.code === AUTH_PATH_IN_PROJECT,
	);
	const storeDir = tmp("us0135-store-");
	const files = ensureOwnedStore(storeDir);
	assert.equal(existsSync(files.authPath), true);
	assert.equal(existsSync(files.modelsPath), true);
	if (process.platform !== "win32") {
		assert.equal(statSync(files.authPath).mode & 0o777, 0o600);
	}
	assert.equal(readFileSync(files.authPath, "utf8").includes("sk-"), false);
});

test("test_us0135_inmemory_credential_store_no_disk", async () => {
	const probe = tmp("us0135-nodisk-");
	const adapter = createAuthRuntimeAdapter();
	await adapter.createRuntime({
		authPath: join(probe, "auth.json"),
		modelsPath: join(probe, "models.json"),
		credentials: createInMemoryCredentialStore(),
		allowModelNetwork: false,
	});
	const names = existsSync(probe) ? readdirSync(probe) : [];
	assert.deepEqual(names, []);
	assert.equal(existsSync(join(probe, "auth.json")), false);
});

test("test_us0135_no_pi_imports_in_auth_models", () => {
	const pkg = JSON.parse(readFileSync(join(AUTH_MODELS_ROOT, "package.json"), "utf8")) as {
		name: string;
		private: boolean;
		version: string;
		dependencies?: Record<string, string>;
		devDependencies?: Record<string, string>;
	};
	assert.equal(pkg.name, "@its-magic/auth-models");
	assert.equal(pkg.private, true);
	assert.equal(pkg.version, "0.0.0");
	const deps = { ...(pkg.dependencies ?? {}), ...(pkg.devDependencies ?? {}) };
	for (const key of Object.keys(deps)) {
		assert.equal(key.startsWith("@earendil-works/pi-"), false, key);
		assert.notEqual(key, "@its-magic/pi-kernel");
	}
	const hits: string[] = [];
	for (const path of walkTs(AUTH_MODELS_ROOT)) {
		const text = readFileSync(path, "utf8");
		if (text.includes("@earendil-works/pi-") || text.includes("@its-magic/pi-kernel")) {
			hits.push(path);
		}
	}
	assert.deepEqual(hits, []);
	const biome = readFileSync(join(STANDALONE_ROOT, "biome.json"), "utf8");
	assert.equal(biome.includes("packages/auth-models"), false);
});

test("test_us0135_model_router_six_step_precedence", () => {
	const catalog: StandaloneCatalog = {
		schema_version: 1,
		phases: { execute: "openai/phase-model" },
		roles: { dev: "anthropic/role-model" },
		critic: { model: "google/critic-model" },
		tiers: { balanced: "openrouter/tier-model" },
		default: "openai/default-model",
		available: [
			"openai/cli-model",
			"openai/phase-model",
			"anthropic/role-model",
			"google/critic-model",
			"openrouter/tier-model",
			"openai/default-model",
			FAKE_MODEL_SLUG,
		],
	};
	const cli = resolveModel({
		argvSlug: "openai/cli-model",
		phase: "execute",
		role: "dev",
		catalog,
	});
	assert.equal(cli.provenance.source, "cli");
	assert.equal(cli.slug, "openai/cli-model");
	const phase = resolveModel({ phase: "execute", role: "dev", catalog });
	assert.equal(phase.provenance.source, "phase-local");
	assert.equal(phase.slug, "openai/phase-model");
	const role = resolveModel({ role: "dev", catalog });
	assert.equal(role.provenance.source, "role-catalog");
	assert.equal(role.slug, "anthropic/role-model");
	const critic = resolveModel({
		criticResolve: true,
		catalog,
		producerSlug: "openai/other",
	});
	assert.equal(critic.provenance.source, "critic-overlay");
	assert.equal(critic.slug, "google/critic-model");
	assert.equal(critic.provenance.criticPin, true);
	const noCritic = { ...catalog, critic: undefined };
	const tier = resolveModel({ catalog: noCritic });
	assert.equal(tier.provenance.source, "tier-catalog");
	const empty: StandaloneCatalog = { schema_version: 1 };
	const fallback = resolveModel({ catalog: empty });
	assert.equal(fallback.provenance.source, "runtime-default");
	assert.equal(fallback.slug, FAKE_MODEL_SLUG);
	for (const row of [cli, phase, role, critic, tier, fallback]) {
		assert.ok(row.provenance.provider);
		assert.ok(row.provenance.model);
		assert.ok(row.provenance.thinkingLevel);
		assert.equal(typeof row.provenance.degradedMode, "boolean");
		assert.equal(typeof row.provenance.thinkingClamped, "boolean");
	}
	assert.throws(
		() => resolveModel({ argvSlug: "fast", catalog }),
		(err: unknown) => err instanceof AuthModelsError && err.code === MODEL_OVERRIDE_SLUG_UNKNOWN,
	);
	assert.throws(
		() => resolveModel({ argvSlug: "openai/missing", catalog }),
		(err: unknown) => err instanceof AuthModelsError && err.code === MODEL_OVERRIDE_SLUG_UNKNOWN,
	);
	assert.throws(
		() => resolveModel({ role: "ghost", catalog: { ...catalog, roles: { ghost: "openai/nope" } } }),
		(err: unknown) => err instanceof AuthModelsError && err.code === MODEL_ROLE_SLUG_UNKNOWN,
	);
});

test("test_us0135_thinking_orthogonal_to_slug_and_token_profile", async () => {
	const catalog: StandaloneCatalog = {
		schema_version: 1,
		roles: {
			dev: { slug: "openai/itsm-fake-ping", thinking: "high" },
			qa: { slug: "openai/itsm-fake-ping", thinking: "off" },
		},
		available: [FAKE_MODEL_SLUG],
		thinkingLevelMaps: {
			[FAKE_MODEL_SLUG]: {
				off: true,
				minimal: true,
				low: true,
				medium: true,
				high: null,
				xhigh: null,
				max: null,
			},
		},
	};
	const prev = process.env.TOKEN_PROFILE;
	process.env.TOKEN_PROFILE = "aggressive";
	try {
		const high = resolveModel({
			role: "dev",
			catalog,
			tokenProfile: process.env.TOKEN_PROFILE,
		});
		const off = resolveModel({
			role: "qa",
			catalog,
			tokenProfile: process.env.TOKEN_PROFILE,
		});
		assert.equal(high.slug, off.slug);
		assert.equal(high.provenance.thinkingClamped, true);
		assert.equal(high.thinkingLevel, "medium");
		assert.equal(off.thinkingLevel, "off");
		const forced = clampThinkingLevel("off", { off: null, medium: true });
		assert.equal(forced.thinkingForced, true);
		assert.notEqual(forced.level, "off");
		const session = await createAgentKernel().createSession({
			thinkingLevel: "high",
			model: createFakeModel(),
			modelRuntime: createFakeModelRuntime("idle"),
		});
		try {
			assert.ok(session.sessionId);
		} finally {
			session.dispose();
		}
	} finally {
		if (prev === undefined) {
			delete process.env.TOKEN_PROFILE;
		} else {
			process.env.TOKEN_PROFILE = prev;
		}
	}
});

test("test_us0135_critic_same_slug_degraded_mode", () => {
	const catalog: StandaloneCatalog = {
		schema_version: 1,
		critic: { model: "openai/same" },
		available: ["openai/same", "anthropic/other"],
	};
	const same = resolveModel({
		criticResolve: true,
		producerSlug: "openai/same",
		catalog,
	});
	assert.equal(same.provenance.degradedMode, true);
	assert.equal(same.provenance.degradedReason, CROSS_MODEL_DEGRADED_MODE);
	assert.equal(same.slug, "openai/same");
	const distinct = resolveModel({
		criticResolve: true,
		producerSlug: "anthropic/other",
		catalog,
	});
	assert.equal(distinct.provenance.degradedMode, false);
	assert.notEqual(distinct.provenance.degradedReason, CROSS_MODEL_DEGRADED_MODE);
});

test("test_us0135_models_test_checkauth_no_token_logs", async () => {
	const project = tmp("us0135-cli-");
	const authDir = tmp("us0135-cli-auth-");
	const cap = captureIo();
	const code = await dispatchItsmCommand(["models", "test", "openai/itsm-fake-ping"], {
		adapter: fakeAdapter({ openai: "api_key" }),
		projectRoot: project,
		authDirOverride: authDir,
		ci: true,
		io: cap.io,
		catalog: { schema_version: 1, available: [FAKE_MODEL_SLUG] },
	});
	assert.equal(code, 0);
	const joined = [...cap.stdout, ...cap.stderr].join("\n");
	assert.equal(containsTokenShape(joined), false);
	assert.equal(joined.includes("sk-"), false);
	assert.equal(joined.toLowerCase().includes("authorization"), false);
	const diag = JSON.parse(cap.stdout.join("")) as {
		provider: string;
		model: string;
		auth: string;
		health: string;
	};
	assert.equal(diag.provider, "openai");
	assert.equal(diag.model, "itsm-fake-ping");
	assert.equal(diag.auth, "configured");
	assert.equal(diag.health, "ok");
	const live = captureIo();
	const liveCode = await dispatchItsmCommand(
		["models", "test", "openai/itsm-fake-ping", "--live"],
		{
			adapter: fakeAdapter(),
			projectRoot: project,
			authDirOverride: authDir,
			ci: true,
			io: live.io,
		},
	);
	assert.equal(liveCode, 1);
	assert.match(live.stderr.join("\n"), new RegExp(MODELS_TEST_LIVE_FORBIDDEN));
});

test("test_us0135_two_roles_different_providers_fake", () => {
	const catalog: StandaloneCatalog = {
		schema_version: 1,
		roles: {
			dev: "openai/itsm-fake-a",
			qa: "anthropic/itsm-fake-b",
		},
		available: ["openai/itsm-fake-a", "anthropic/itsm-fake-b"],
	};
	const dev = resolveModel({ role: "dev", catalog });
	const qa = resolveModel({ role: "qa", catalog });
	assert.equal(dev.provenance.provider, "openai");
	assert.equal(qa.provenance.provider, "anthropic");
	assert.notEqual(dev.slug, qa.slug);
	const adapter = fakeAdapter({ openai: "api_key", anthropic: "api_key" });
	adapter.registerProvider("fake-openai", { api: "openai-completions" });
	adapter.registerProvider("fake-anthropic", { api: "openai-completions" });
	assert.ok(adapter.getModel("openai", "itsm-fake-a"));
});

test("test_us0135_oauth_refresh_not_in_prompt_audit_or_repo", async () => {
	const { AuthService } = await import("../../packages/auth-models/src/index.ts");
	const project = tmp("us0135-oauth-");
	const authDir = tmp("us0135-oauth-auth-");
	const service = new AuthService({
		adapter: fakeAdapter({ "openai-codex": "oauth" }),
		projectRoot: project,
		authDirOverride: authDir,
	});
	const leak = {
		Authorization: "Bearer sk-live-secret-value",
		Cookie: "sid=super-secret",
		access: "access-token-value",
		refresh: "refresh-token-value",
		note: "ok",
	};
	const isolated = service.isolationAfterRefresh(leak);
	const prompt = isolated.prompt;
	const auditText = JSON.stringify(isolated.audit);
	assert.equal(containsTokenShape(prompt), false);
	assert.equal(containsTokenShape(auditText), false);
	assert.equal(prompt.includes("sk-"), false);
	assert.equal(auditText.includes("sk-"), false);
	assert.equal(auditText.includes("Bearer"), false);
	assert.equal(/access-token-value|refresh-token-value/.test(auditText), false);
	const planted = join(project, "audit.json");
	writeFileSync(planted, auditText, "utf8");
	assert.equal(containsTokenShape(readFileSync(planted, "utf8")), false);
});

test("test_us0135_fake_model_ci_default_held", async () => {
	const spec = getProductionFactorySpec();
	assert.equal(spec.noTools, "builtin");
	const kernelSrc = readFileSync(join(PI_KERNEL_SRC, "kernel.ts"), "utf8");
	assert.equal(kernelSrc.includes("noTools: spec.noTools"), true);
	assert.equal(kernelSrc.includes("createFakeModel"), true);
	const isolation = readFileSync(join(PI_KERNEL_SRC, "isolation.ts"), "utf8");
	assert.equal(isolation.includes("extensions: []"), true);
	assert.equal(/additionalExtensionPaths\s*:/.test(isolation), false);
	const session = await createAgentKernel().createSession();
	try {
		const snap = getLoaderSnapshot(session);
		assert.equal(snap.extensionCount, 0);
		assert.equal(session.getRuntimeInfo().builtinTools, "disabled");
	} finally {
		session.dispose();
	}
});
