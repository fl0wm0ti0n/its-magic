import { AuthService } from "./auth-service.ts";
import { loadStandaloneCatalog } from "./catalog.ts";
import { AuthModelsError, MODELS_TEST_LIVE_FORBIDDEN } from "./errors.ts";
import type { AuthRuntimePort, AuthType, StandaloneCatalog } from "./types.ts";
import {
	BUILTIN_API_KEY_PROVIDERS,
	BUILTIN_OAUTH_PROVIDERS,
	CHINESE_API_KEY_PROVIDERS,
	FAKE_MODEL_SLUG,
	KNOWN_PROVIDER_IDS,
	LOCAL_OPENAI_COMPAT_PROVIDERS,
	QWEN_TOKEN_PLAN_PREFIX,
} from "./types.ts";

export interface CliIo {
	stdout: (line: string) => void;
	stderr: (line: string) => void;
	prompt?: (message: string) => Promise<string | undefined>;
}

export interface DispatchDeps {
	adapter: AuthRuntimePort;
	projectRoot: string;
	env?: NodeJS.ProcessEnv;
	io?: CliIo;
	ci?: boolean;
	credentials?: unknown;
	catalog?: StandaloneCatalog;
	authDirOverride?: string;
}

export async function dispatchItsmCommand(argv: string[], deps: DispatchDeps): Promise<number> {
	const env = deps.env ?? process.env;
	const io = deps.io ?? {
		stdout: (line) => console.log(line),
		stderr: (line) => console.error(line),
	};
	const ci = deps.ci ?? isCi(env);
	const service = new AuthService({
		adapter: deps.adapter,
		projectRoot: deps.projectRoot,
		env,
		authDirOverride: deps.authDirOverride,
	});
	try {
		const [cmd, sub, ...rest] = argv;
		if (cmd === "auth") {
			return await handleAuth(sub, rest, service, io, env, ci);
		}
		if (cmd === "models") {
			return await handleModels(sub, rest, service, io, deps, ci);
		}
		io.stderr("itsm stub — kernel workspace only (no workflow)");
		return 0;
	} catch (err) {
		const code = err instanceof AuthModelsError ? err.code : "AUTH_ERROR";
		const message = err instanceof Error ? err.message : String(err);
		io.stderr(`${code}: ${redactLine(message)}`);
		return 1;
	}
}

async function handleAuth(
	sub: string | undefined,
	rest: string[],
	service: AuthService,
	io: CliIo,
	env: NodeJS.ProcessEnv,
	ci: boolean,
): Promise<number> {
	if (sub === "list") {
		const rows = await service.listConfigured();
		io.stdout(JSON.stringify({ providers: rows }, null, 2));
		return 0;
	}
	if (sub === "login") {
		const provider = rest[0];
		if (!provider) {
			io.stderr("usage: itsm auth login <provider> [--type oauth|api_key]");
			return 1;
		}
		const type = parseType(rest);
		if (type === "oauth" && ci) {
			io.stderr("oauth login is not available in CI");
			return 1;
		}
		await service.login(provider, type, {
			prompt: async (p) => {
				io.stdout(p.message);
				if (p.type === "select" && p.options?.length) {
					io.stdout(p.options.map((o) => o.id).join(", "));
					return p.options[0]?.id;
				}
				return io.prompt ? io.prompt(p.message) : undefined;
			},
			notify: (event) => {
				if (event.type === "auth_url" && event.url) {
					io.stdout(`auth_url ${event.url}`);
				}
				if (event.type === "device_code") {
					if (event.userCode) {
						io.stdout(`device_code ${event.userCode}`);
					}
					if (event.verificationUri) {
						io.stdout(`verification_uri ${event.verificationUri}`);
					}
				}
				if (event.message) {
					io.stdout(event.message);
				}
			},
		});
		io.stdout(JSON.stringify({ provider, auth: "configured" }));
		return 0;
	}
	if (sub === "logout") {
		const provider = rest[0];
		if (!provider) {
			io.stderr("usage: itsm auth logout <provider>");
			return 1;
		}
		await service.logout(provider);
		io.stdout(JSON.stringify({ provider, auth: "missing" }));
		return 0;
	}
	if (sub === "migrate") {
		if (!rest.includes("--from-pi")) {
			io.stderr("usage: itsm auth migrate --from-pi");
			return 1;
		}
		void env;
		const result = service.migrateFromPi();
		io.stdout(JSON.stringify({ migrated: result.copied, dest: "owned-auth-dir" }));
		return 0;
	}
	io.stderr("usage: itsm auth list|login|logout|migrate");
	return 1;
}

async function handleModels(
	sub: string | undefined,
	rest: string[],
	service: AuthService,
	io: CliIo,
	deps: DispatchDeps,
	ci: boolean,
): Promise<number> {
	const catalog = deps.catalog ?? loadStandaloneCatalog(deps.projectRoot);
	if (sub === "list") {
		const slugs = [
			...(catalog.available ?? []),
			FAKE_MODEL_SLUG,
			...KNOWN_PROVIDER_IDS.map((id) => `${id}/default`),
		];
		io.stdout(
			JSON.stringify(
				{
					providers: [
						...BUILTIN_OAUTH_PROVIDERS,
						...BUILTIN_API_KEY_PROVIDERS,
						...CHINESE_API_KEY_PROVIDERS,
						...LOCAL_OPENAI_COMPAT_PROVIDERS,
						`${QWEN_TOKEN_PLAN_PREFIX}*`,
					],
					slugs: [...new Set(slugs)],
				},
				null,
				2,
			),
		);
		return 0;
	}
	if (sub === "test") {
		const slug = rest.find((a) => !a.startsWith("-"));
		const live = rest.includes("--live");
		if (!slug) {
			io.stderr("usage: itsm models test <provider/model> [--live]");
			return 1;
		}
		if (live && ci) {
			throw new AuthModelsError(MODELS_TEST_LIVE_FORBIDDEN, "--live is never allowed in CI");
		}
		const slash = slug.indexOf("/");
		const provider = slash === -1 ? slug : slug.slice(0, slash);
		const model = slash === -1 ? "" : slug.slice(slash + 1);
		const auth = await service.checkAuth(provider);
		const inCatalog =
			(catalog.available ?? []).includes(slug) ||
			KNOWN_PROVIDER_IDS.includes(provider) ||
			provider.startsWith(QWEN_TOKEN_PLAN_PREFIX) ||
			slug === FAKE_MODEL_SLUG;
		const health = auth && inCatalog ? "ok" : "fail";
		const diag = {
			provider,
			model,
			auth: auth ? "configured" : "missing",
			health,
		};
		io.stdout(JSON.stringify(diag));
		return health === "ok" ? 0 : 1;
	}
	io.stderr("usage: itsm models list|test");
	return 1;
}

function parseType(rest: string[]): AuthType {
	const idx = rest.indexOf("--type");
	if (idx >= 0 && rest[idx + 1] === "oauth") {
		return "oauth";
	}
	if (idx >= 0 && rest[idx + 1] === "api_key") {
		return "api_key";
	}
	return "api_key";
}

function isCi(env: NodeJS.ProcessEnv): boolean {
	return env.CI === "true" || env.CI === "1" || env.GITHUB_ACTIONS === "true";
}

function redactLine(line: string): string {
	return line
		.replace(/sk-[A-Za-z0-9_-]+/g, "[redacted]")
		.replace(/Bearer\s+\S+/g, "Bearer [redacted]");
}
