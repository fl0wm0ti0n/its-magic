import {
	InMemoryCredentialStore,
	type AuthInteraction as PiAuthInteraction,
	type AuthType as PiAuthType,
} from "@earendil-works/pi-ai";
import { CredentialSynchronizationError, ModelRuntime } from "@earendil-works/pi-coding-agent";

export type AuthType = "oauth" | "api_key";

export interface AuthInteraction {
	prompt: (p: {
		type: "text" | "secret" | "select" | "manual_code";
		message: string;
		options?: { id: string; label: string }[];
		signal?: AbortSignal;
	}) => Promise<string | undefined>;
	notify: (event: {
		type: "info" | "auth_url" | "device_code" | "progress";
		url?: string;
		userCode?: string;
		verificationUri?: string;
		message?: string;
	}) => void;
	signal?: AbortSignal;
}

export interface AuthRuntimeAdapter {
	createRuntime(opts: {
		authPath: string;
		modelsPath: string;
		credentials?: unknown;
		allowModelNetwork?: boolean;
	}): Promise<void>;
	login(providerId: string, type: AuthType, interaction: AuthInteraction): Promise<void>;
	logout(providerId: string): Promise<void>;
	checkAuth(providerId: string, opts?: { refresh?: boolean }): Promise<{ type: AuthType } | null>;
	registerProvider(name: string, config: unknown): void;
	getModel(provider: string, model: string): unknown | null;
}

export class AuthSyncFailedError extends Error {
	readonly code = "AUTH_SYNC_FAILED";

	constructor(cause?: unknown) {
		super("AUTH_SYNC_FAILED");
		this.name = "AuthSyncFailedError";
		if (cause instanceof Error) {
			this.cause = cause;
		}
	}
}

export function createInMemoryCredentialStore(): unknown {
	return new InMemoryCredentialStore();
}

class PiAuthRuntimeAdapter implements AuthRuntimeAdapter {
	private runtime?: ModelRuntime;

	async createRuntime(opts: {
		authPath: string;
		modelsPath: string;
		credentials?: unknown;
		allowModelNetwork?: boolean;
	}): Promise<void> {
		const credentials = opts.credentials ?? undefined;
		this.runtime = await ModelRuntime.create({
			...(credentials
				? { credentials: credentials as InMemoryCredentialStore }
				: { authPath: opts.authPath, modelsPath: opts.modelsPath }),
			allowModelNetwork: opts.allowModelNetwork ?? false,
			refreshOnCreate: false,
		});
	}

	async login(providerId: string, type: AuthType, interaction: AuthInteraction): Promise<void> {
		const runtime = this.requireRuntime();
		try {
			await runtime.login(
				providerId,
				type as PiAuthType,
				interaction as unknown as PiAuthInteraction,
			);
		} catch (err) {
			wrapSync(err);
		}
	}

	async logout(providerId: string): Promise<void> {
		const runtime = this.requireRuntime();
		try {
			await runtime.logout(providerId);
		} catch (err) {
			wrapSync(err);
		}
	}

	async checkAuth(
		providerId: string,
		_opts?: { refresh?: boolean },
	): Promise<{ type: AuthType } | null> {
		const runtime = this.requireRuntime();
		try {
			const result = await runtime.checkAuth(providerId);
			if (!result?.type) {
				return null;
			}
			return { type: result.type };
		} catch (err) {
			wrapSync(err);
		}
	}

	registerProvider(name: string, config: unknown): void {
		const runtime = this.requireRuntime();
		runtime.registerProvider(name, config as never);
	}

	getModel(provider: string, model: string): unknown | null {
		const runtime = this.requireRuntime();
		return runtime.getModel(provider, model) ?? null;
	}

	private requireRuntime(): ModelRuntime {
		if (!this.runtime) {
			throw new Error("AuthRuntimeAdapter.createRuntime must be called first");
		}
		return this.runtime;
	}
}

export function createAuthRuntimeAdapter(): AuthRuntimeAdapter {
	return new PiAuthRuntimeAdapter();
}

function wrapSync(err: unknown): never {
	if (err instanceof CredentialSynchronizationError) {
		throw new AuthSyncFailedError(err);
	}
	throw err;
}
