import { AuthService } from "./auth-service.ts";
import { loadStandaloneCatalog } from "./catalog.ts";
import { AUTH_SYNC_FAILED, AuthModelsError, MODELS_TEST_LIVE_FORBIDDEN } from "./errors.ts";
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
	readStdinLine?: () => Promise<string>;
	stdinIsTTY?: boolean;
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
		if (!provider || provider.startsWith("-")) {
			io.stderr(LOGIN_USAGE);
			return 1;
		}
		const args = parseLoginArgs(rest);
		if (!args.ok) {
			io.stderr(LOGIN_USAGE);
			return 1;
		}
		const type = parseType(rest);
		if (type === "oauth" && ci) {
			io.stderr("oauth login is not available in CI");
			return 1;
		}
		try {
			let stdinSecret: string | undefined;
			if (type === "api_key" && args.stdin) {
				const raw = io.readStdinLine ? await io.readStdinLine() : await readOneStdinLine();
				const secret = stripOneTrailingNewline(raw);
				if (secret.trim() === "") {
					io.stderr(redactLine(AUTH_LOGIN_EMPTY));
					return 1;
				}
				stdinSecret = secret;
			} else if (type === "api_key" && !loginStdinIsTTY(io)) {
				io.stderr(redactLine(AUTH_LOGIN_TTY_REQUIRED));
				return 1;
			}
			await service.login(provider, type, {
				prompt: async (p) => {
					if (p.type === "select" && p.options?.length) {
						io.stdout(p.message);
						io.stdout(p.options.map((o) => o.id).join(", "));
						return p.options[0]?.id;
					}
					if (p.type === "secret") {
						if (p.signal?.aborted) {
							throw new AuthModelsError(AUTH_LOGIN_CANCELLED, AUTH_LOGIN_CANCELLED);
						}
						let secret: string | undefined;
						if (stdinSecret !== undefined) {
							io.stdout(p.message);
							secret = stdinSecret;
						} else {
							secret = io.prompt ? await io.prompt(p.message) : undefined;
						}
						if (secret === undefined) {
							throw new AuthModelsError(AUTH_LOGIN_CANCELLED, AUTH_LOGIN_CANCELLED);
						}
						if (secret.trim() === "") {
							throw new AuthModelsError(AUTH_LOGIN_EMPTY, AUTH_LOGIN_EMPTY);
						}
						return secret;
					}
					io.stdout(p.message);
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
			const stored = await service.checkAuth(provider);
			if (!stored || stored.type !== type) {
				io.stderr(redactLine(AUTH_LOGIN_INVALID));
				return 1;
			}
			io.stdout(JSON.stringify({ provider, auth: "configured" }));
			return 0;
		} catch (err) {
			io.stderr(redactLine(loginDiagnostic(err)));
			return 1;
		}
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

const LOGIN_USAGE = "usage: itsm auth login <provider> [--type oauth|api_key] [--api-key-stdin]";
const AUTH_LOGIN_CANCELLED = "AUTH_LOGIN_CANCELLED";
const AUTH_LOGIN_EMPTY = "AUTH_LOGIN_EMPTY";
const AUTH_LOGIN_INVALID = "AUTH_LOGIN_INVALID";
const AUTH_LOGIN_TTY_REQUIRED = "AUTH_LOGIN_TTY_REQUIRED";

interface MaskedStdin {
	isTTY?: boolean;
	isRaw?: boolean;
	setRawMode(mode: boolean): void;
	setEncoding?(encoding: BufferEncoding): void;
	resume(): void;
	on(event: "data", listener: (chunk: string | Buffer) => void): void;
	off(event: "data", listener: (chunk: string | Buffer) => void): void;
}

interface MaskedStdout {
	isTTY?: boolean;
	write(chunk: string): void;
}

export async function readMaskedTtySecret(
	message: string,
	streams?: { stdin?: MaskedStdin; stdout?: MaskedStdout },
): Promise<string | undefined> {
	const stdin = streams?.stdin ?? (process.stdin as unknown as MaskedStdin);
	const stdout = streams?.stdout ?? (process.stdout as unknown as MaskedStdout);
	if (!stdin.isTTY || !stdout.isTTY) {
		return undefined;
	}
	const previous = Boolean(stdin.isRaw);
	let onData: ((chunk: string | Buffer) => void) | undefined;
	let line = "";
	let settled = false;
	try {
		stdout.write(message.endsWith("\n") ? message : `${message}\n`);
		stdin.setEncoding?.("utf8");
		stdin.setRawMode(true);
		stdin.resume();
		return await new Promise<string | undefined>((resolve) => {
			onData = (chunk) => {
				if (settled) {
					return;
				}
				const text = typeof chunk === "string" ? chunk : chunk.toString("utf8");
				for (const ch of text) {
					if (ch === "\u0003") {
						settled = true;
						resolve(undefined);
						return;
					}
					if (ch === "\r" || ch === "\n") {
						settled = true;
						resolve(line);
						return;
					}
					if (ch === "\u007f" || ch === "\b") {
						line = line.slice(0, -1);
						continue;
					}
					if (ch < " ") {
						continue;
					}
					line += ch;
				}
			};
			stdin.on("data", onData);
		});
	} finally {
		if (onData) {
			stdin.off("data", onData);
		}
		try {
			stdin.setRawMode(previous);
		} catch {
			// A closed terminal still must not stay in raw mode.
		}
	}
}

function parseLoginArgs(rest: string[]): { ok: true; stdin: boolean } | { ok: false } {
	let stdin = false;
	for (let i = 0; i < rest.length; i++) {
		const arg = rest[i] ?? "";
		if (arg === "--type") {
			i += 1;
			continue;
		}
		if (arg === "--api-key" || arg.startsWith("--api-key=") || arg.startsWith("--api-key-stdin=")) {
			return { ok: false };
		}
		if (arg === "--api-key-stdin") {
			const next = rest[i + 1];
			if (next && !next.startsWith("-")) {
				return { ok: false };
			}
			stdin = true;
		}
	}
	return { ok: true, stdin };
}

function loginStdinIsTTY(io: CliIo): boolean {
	if (typeof io.stdinIsTTY === "boolean") {
		return io.stdinIsTTY;
	}
	return Boolean(process.stdin.isTTY);
}

function stripOneTrailingNewline(value: string): string {
	if (value.endsWith("\r\n")) {
		return value.slice(0, -2);
	}
	if (value.endsWith("\n") || value.endsWith("\r")) {
		return value.slice(0, -1);
	}
	return value;
}

function firstLine(text: string): string | null {
	const newline = text.indexOf("\n");
	const carriage = text.indexOf("\r");
	let at = -1;
	if (newline < 0) {
		at = carriage;
	} else if (carriage < 0) {
		at = newline;
	} else {
		at = Math.min(newline, carriage);
	}
	if (at < 0) {
		return null;
	}
	const length = text[at] === "\r" && text[at + 1] === "\n" ? 2 : 1;
	return text.slice(0, at + length);
}

function readOneStdinLine(stdin: NodeJS.ReadableStream = process.stdin): Promise<string> {
	return new Promise((resolve, reject) => {
		let raw = "";
		const onData = (chunk: string | Buffer) => {
			raw += typeof chunk === "string" ? chunk : chunk.toString("utf8");
			const line = firstLine(raw);
			if (line !== null) {
				cleanup();
				resolve(line);
			}
		};
		const onEnd = () => {
			cleanup();
			resolve(raw);
		};
		const onError = (err: unknown) => {
			cleanup();
			reject(err instanceof Error ? err : new Error(AUTH_LOGIN_INVALID));
		};
		const cleanup = () => {
			stdin.off("data", onData);
			stdin.off("end", onEnd);
			stdin.off("error", onError);
		};
		const source = stdin as NodeJS.ReadableStream & {
			setEncoding?: (encoding: BufferEncoding) => void;
			resume?: () => void;
		};
		source.setEncoding?.("utf8");
		stdin.on("data", onData);
		stdin.on("end", onEnd);
		stdin.on("error", onError);
		source.resume?.();
	});
}

function loginDiagnostic(err: unknown): string {
	if (isCredentialSyncFailure(err)) {
		return AUTH_SYNC_FAILED;
	}
	const code = err instanceof AuthModelsError ? err.code : errorCode(err);
	if (
		code === AUTH_LOGIN_CANCELLED ||
		code === AUTH_LOGIN_EMPTY ||
		code === AUTH_LOGIN_INVALID ||
		code === AUTH_SYNC_FAILED
	) {
		return code;
	}
	return AUTH_LOGIN_INVALID;
}

function isCredentialSyncFailure(err: unknown): boolean {
	if (err instanceof AuthModelsError && err.code === AUTH_SYNC_FAILED) {
		return true;
	}
	if (typeof err !== "object" || err === null) {
		return false;
	}
	const name = "name" in err ? String(err.name) : "";
	if (name === "CredentialSynchronizationError" || name === "AuthSyncFailedError") {
		return true;
	}
	return errorCode(err) === AUTH_SYNC_FAILED;
}

function errorCode(err: unknown): string {
	if (typeof err === "object" && err !== null && "code" in err) {
		return String(err.code);
	}
	return "";
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
