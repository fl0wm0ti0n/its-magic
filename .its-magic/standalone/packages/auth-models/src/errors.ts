export const AUTH_PATH_IN_PROJECT = "AUTH_PATH_IN_PROJECT";
export const AUTH_SYNC_FAILED = "AUTH_SYNC_FAILED";
export const AUTH_LIVE_FORBIDDEN = "AUTH_LIVE_FORBIDDEN";
export const MODEL_OVERRIDE_SLUG_UNKNOWN = "MODEL_OVERRIDE_SLUG_UNKNOWN";
export const MODEL_ROLE_SLUG_UNKNOWN = "MODEL_ROLE_SLUG_UNKNOWN";
export const CATALOG_SECRET_KEY = "CATALOG_SECRET_KEY";
export const CATALOG_INVALID = "CATALOG_INVALID";
export const MODELS_TEST_LIVE_FORBIDDEN = "MODELS_TEST_LIVE_FORBIDDEN";
/** Compose US-0130 / US-0104 — reuse; do not invent AUTH_CROSS_MODEL_*. */
export const CROSS_MODEL_DEGRADED_MODE = "CROSS_MODEL_DEGRADED_MODE";

export class AuthModelsError extends Error {
	readonly code: string;

	constructor(code: string, message?: string) {
		super(message ?? code);
		this.name = "AuthModelsError";
		this.code = code;
	}
}
