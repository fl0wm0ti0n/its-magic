export const APP_RUNTIME_PROFILE_UNKNOWN = "APP_RUNTIME_PROFILE_UNKNOWN";
export const APP_RUNTIME_START_FAILED = "APP_RUNTIME_START_FAILED";
export const APP_RUNTIME_HEALTH_FAILED = "APP_RUNTIME_HEALTH_FAILED";
export const APP_RUNTIME_RESTART_CAP_EXHAUSTED = "APP_RUNTIME_RESTART_CAP_EXHAUSTED";
export const APP_RUNTIME_UNSUPPORTED_STACK = "APP_RUNTIME_UNSUPPORTED_STACK";
export const APP_RUNTIME_CLEANUP_FAILED = "APP_RUNTIME_CLEANUP_FAILED";

export const BACKEND_UNKNOWN = "BACKEND_UNKNOWN";
export const BACKEND_UNAVAILABLE = "BACKEND_UNAVAILABLE";
export const BACKEND_DOCKER_UNAVAILABLE = "BACKEND_DOCKER_UNAVAILABLE";
export const BACKEND_WSL_UNAVAILABLE = "BACKEND_WSL_UNAVAILABLE";
export const BACKEND_SSH_UNAVAILABLE = "BACKEND_SSH_UNAVAILABLE";
export const BACKEND_UNSUPPORTED = "BACKEND_UNSUPPORTED";
export const BACKEND_CONNECTIVITY_FAILED = "BACKEND_CONNECTIVITY_FAILED";
export const BACKEND_TIMEOUT = "BACKEND_TIMEOUT";

export const PROCESS_CRASHED = "PROCESS_CRASHED";
export const PROCESS_ORPHAN_REAPED = "PROCESS_ORPHAN_REAPED";

export const DEFAULT_RESTART_MAX = 3;
export const DEFAULT_LOG_RING = 256;
export const DEFAULT_LOG_BUDGET_BYTES = 8192;

export const FAILURE_CLASSES = [
	"start_failed",
	"health_failed",
	"crash",
	"timeout",
	"connectivity",
	"unsupported_stack",
	"unsupported_backend",
] as const;

export type FailureClass = (typeof FAILURE_CLASSES)[number];

export const LAYER_B_PROFILES = {
	trusted_local: "local",
	isolated_dev: "docker",
	untrusted_repo: "micro-vm",
} as const;

export class AppRuntimeError extends Error {
	readonly code: string;
	constructor(code: string, message?: string) {
		super(message ?? code);
		this.name = "AppRuntimeError";
		this.code = code;
	}
}

export function isAppRuntimeError(err: unknown): err is AppRuntimeError {
	return err instanceof AppRuntimeError;
}
