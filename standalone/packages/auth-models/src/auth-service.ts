import { copyFileSync, existsSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { AUTH_SYNC_FAILED, AuthModelsError } from "./errors.ts";
import { ensureOwnedStoreIfAbsent, resolveAuthDir } from "./paths.ts";
import { buildPromptAfterRefresh, redactAudit } from "./redact.ts";
import type { AuthInteraction, AuthRuntimePort, AuthType } from "./types.ts";
import { KNOWN_PROVIDER_IDS } from "./types.ts";

export interface AuthServiceOptions {
	adapter: AuthRuntimePort;
	projectRoot: string;
	env?: NodeJS.ProcessEnv;
	authDirOverride?: string;
}

export class AuthService {
	private readonly adapter: AuthRuntimePort;
	private readonly projectRoot: string;
	private readonly env: NodeJS.ProcessEnv;
	private readonly authDirOverride?: string;
	private ready = false;

	constructor(opts: AuthServiceOptions) {
		this.adapter = opts.adapter;
		this.projectRoot = opts.projectRoot;
		this.env = opts.env ?? process.env;
		this.authDirOverride = opts.authDirOverride;
	}

	authDir(): string {
		return resolveAuthDir({
			projectRoot: this.projectRoot,
			override: this.authDirOverride,
			env: this.env,
		});
	}

	storePaths(): { authPath: string; modelsPath: string } {
		const dir = this.authDir();
		const files = ensureOwnedStoreIfAbsent(dir);
		return { authPath: files.authPath, modelsPath: files.modelsPath };
	}

	async ensureRuntime(credentials?: unknown): Promise<void> {
		if (this.ready && credentials === undefined) {
			return;
		}
		const paths = this.storePaths();
		try {
			await this.adapter.createRuntime({
				authPath: paths.authPath,
				modelsPath: paths.modelsPath,
				credentials,
				allowModelNetwork: false,
			});
			this.ready = true;
		} catch (err) {
			rethrowSync(err);
		}
	}

	async listConfigured(): Promise<{ providerId: string; type: AuthType }[]> {
		await this.ensureRuntime();
		const out: { providerId: string; type: AuthType }[] = [];
		for (const providerId of KNOWN_PROVIDER_IDS) {
			const auth = await this.adapter.checkAuth(providerId);
			if (auth) {
				out.push({ providerId, type: auth.type });
			}
		}
		return out;
	}

	async login(providerId: string, type: AuthType, interaction: AuthInteraction): Promise<void> {
		await this.ensureRuntime();
		try {
			await this.adapter.login(providerId, type, interaction);
		} catch (err) {
			rethrowSync(err);
		}
	}

	async logout(providerId: string): Promise<void> {
		await this.ensureRuntime();
		try {
			await this.adapter.logout(providerId);
		} catch (err) {
			rethrowSync(err);
		}
	}

	async checkAuth(
		providerId: string,
		opts?: { refresh?: boolean },
	): Promise<{ type: AuthType } | null> {
		await this.ensureRuntime();
		try {
			return await this.adapter.checkAuth(providerId, opts);
		} catch (err) {
			rethrowSync(err);
		}
	}

	registerProvider(name: string, config: unknown): void {
		this.adapter.registerProvider(name, config);
	}

	migrateFromPi(): { copied: boolean; dest: string } {
		const destDir = this.authDir();
		const dest = join(destDir, "auth.json");
		if (existsSync(dest)) {
			return { copied: false, dest };
		}
		const source = join(
			this.env.HOME || this.env.USERPROFILE || homedir(),
			".pi",
			"agent",
			"auth.json",
		);
		if (!existsSync(source)) {
			ensureOwnedStoreIfAbsent(destDir);
			return { copied: false, dest };
		}
		ensureOwnedStoreIfAbsent(destDir);
		copyFileSync(source, dest);
		return { copied: true, dest };
	}

	isolationAfterRefresh(stubbedRefresh: unknown): { prompt: string; audit: unknown } {
		const audit = redactAudit(stubbedRefresh);
		return { prompt: buildPromptAfterRefresh(stubbedRefresh), audit };
	}
}

function rethrowSync(err: unknown): never {
	if (err instanceof AuthModelsError) {
		throw err;
	}
	const code =
		typeof err === "object" && err !== null && "code" in err ? String(err.code) : undefined;
	if (
		code === AUTH_SYNC_FAILED ||
		(err instanceof Error && err.message.includes(AUTH_SYNC_FAILED))
	) {
		throw new AuthModelsError(
			AUTH_SYNC_FAILED,
			err instanceof Error ? err.message : AUTH_SYNC_FAILED,
		);
	}
	throw err;
}
