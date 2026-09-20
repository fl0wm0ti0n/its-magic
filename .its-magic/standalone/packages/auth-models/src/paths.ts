import { chmodSync, mkdirSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { isAbsolute, join, relative, resolve, sep } from "node:path";
import { AUTH_PATH_IN_PROJECT, AuthModelsError } from "./errors.ts";

export const AUTH_JSON = "auth.json";
export const MODELS_JSON = "models.json";
export const MODELS_STORE_JSON = "models-store.json";
export const CONFIG_DIR_NAME = "its-magic";

export function resolveOwnedAuthDir(env: NodeJS.ProcessEnv = process.env): string {
	if (process.platform === "win32") {
		const appData = env.APPDATA?.trim();
		if (!appData) {
			return join(env.USERPROFILE || homedir(), "AppData", "Roaming", CONFIG_DIR_NAME);
		}
		return join(appData, CONFIG_DIR_NAME);
	}
	if (process.platform === "darwin") {
		return join(env.HOME || homedir(), "Library", "Application Support", CONFIG_DIR_NAME);
	}
	const xdg = env.XDG_CONFIG_HOME?.trim();
	if (xdg) {
		return join(xdg, CONFIG_DIR_NAME);
	}
	return join(env.HOME || homedir(), ".config", CONFIG_DIR_NAME);
}

export function expandUser(raw: string, env: NodeJS.ProcessEnv = process.env): string {
	if (raw === "~" || raw.startsWith("~/") || raw.startsWith("~\\")) {
		return join(env.HOME || env.USERPROFILE || homedir(), raw.slice(2));
	}
	return raw;
}

export function isPathInside(child: string, parent: string): boolean {
	const rel = relative(resolve(parent), resolve(child));
	return rel === "" || (!rel.startsWith("..") && !isAbsolute(rel));
}

export function assertAuthPathOutsideProject(
	authPath: string,
	projectRoot: string,
	env: NodeJS.ProcessEnv = process.env,
): string {
	const expanded = expandUser(authPath, env);
	if (!isAbsolute(expanded)) {
		throw new AuthModelsError(
			AUTH_PATH_IN_PROJECT,
			"Auth path must be absolute and outside the project",
		);
	}
	const resolved = resolve(expanded);
	const project = resolve(projectRoot);
	if (isPathInside(resolved, project)) {
		throw new AuthModelsError(AUTH_PATH_IN_PROJECT, "Auth path must stay outside the project");
	}
	const norm = resolved.split(sep).join("/").toLowerCase();
	if (norm.endsWith("/.env") || norm.includes("/.env.") || /(^|\/)\.env$/.test(norm)) {
		throw new AuthModelsError(AUTH_PATH_IN_PROJECT, "Project .env is not an auth store");
	}
	return resolved;
}

export function resolveAuthDir(opts: {
	projectRoot: string;
	override?: string;
	env?: NodeJS.ProcessEnv;
}): string {
	const env = opts.env ?? process.env;
	const raw = opts.override ?? env.ITSM_AUTH_PATH?.trim();
	if (raw) {
		return assertAuthPathOutsideProject(raw, opts.projectRoot, env);
	}
	const owned = resolveOwnedAuthDir(env);
	return assertAuthPathOutsideProject(owned, opts.projectRoot, env);
}

export function applyAuthJsonMode(authJsonPath: string): void {
	if (process.platform === "win32") {
		return;
	}
	chmodSync(authJsonPath, 0o600);
}

export function defaultModelsJson(): Record<string, unknown> {
	return {
		ollama: {
			baseUrl: "http://127.0.0.1:11434/v1",
			api: "openai-completions",
		},
		lmstudio: {
			baseUrl: "http://127.0.0.1:1234/v1",
			api: "openai-completions",
		},
		vllm: {
			baseUrl: "http://127.0.0.1:8000/v1",
			api: "openai-completions",
		},
	};
}

export function ensureOwnedStore(authDir: string): {
	authPath: string;
	modelsPath: string;
	modelsStorePath: string;
} {
	mkdirSync(authDir, { recursive: true });
	const authPath = join(authDir, AUTH_JSON);
	const modelsPath = join(authDir, MODELS_JSON);
	const modelsStorePath = join(authDir, MODELS_STORE_JSON);
	writeFileSync(authPath, "{}\n", { encoding: "utf8", flag: "wx" });
	applyAuthJsonMode(authPath);
	writeFileSync(modelsPath, `${JSON.stringify(defaultModelsJson(), null, 2)}\n`, {
		encoding: "utf8",
		flag: "wx",
	});
	writeFileSync(modelsStorePath, "{}\n", { encoding: "utf8", flag: "wx" });
	return { authPath, modelsPath, modelsStorePath };
}

export function ensureOwnedStoreIfAbsent(authDir: string): {
	authPath: string;
	modelsPath: string;
	modelsStorePath: string;
} {
	mkdirSync(authDir, { recursive: true });
	const authPath = join(authDir, AUTH_JSON);
	const modelsPath = join(authDir, MODELS_JSON);
	const modelsStorePath = join(authDir, MODELS_STORE_JSON);
	try {
		writeFileSync(authPath, "{}\n", { encoding: "utf8", flag: "wx" });
		applyAuthJsonMode(authPath);
	} catch (err) {
		if (!isExistErr(err)) {
			throw err;
		}
		applyAuthJsonMode(authPath);
	}
	try {
		writeFileSync(modelsPath, `${JSON.stringify(defaultModelsJson(), null, 2)}\n`, {
			encoding: "utf8",
			flag: "wx",
		});
	} catch (err) {
		if (!isExistErr(err)) {
			throw err;
		}
	}
	try {
		writeFileSync(modelsStorePath, "{}\n", { encoding: "utf8", flag: "wx" });
	} catch (err) {
		if (!isExistErr(err)) {
			throw err;
		}
	}
	return { authPath, modelsPath, modelsStorePath };
}

function isExistErr(err: unknown): boolean {
	return typeof err === "object" && err !== null && "code" in err && err.code === "EEXIST";
}
