export const BROWSER_UNAVAILABLE = "BROWSER_UNAVAILABLE";
export const BROWSER_CDP_UNAUTHORIZED = "BROWSER_CDP_UNAUTHORIZED";
export const BROWSER_CDP_DEFAULT_PROFILE_FORBIDDEN = "BROWSER_CDP_DEFAULT_PROFILE_FORBIDDEN";
export const BROWSER_CRASHED = "BROWSER_CRASHED";
export const BROWSER_WAIT_TIMEOUT = "BROWSER_WAIT_TIMEOUT";
export const BROWSER_ASSERTION_FAILED = "BROWSER_ASSERTION_FAILED";
export const BROWSER_CONSOLE_ERROR = "BROWSER_CONSOLE_ERROR";
export const BROWSER_NETWORK_FAILED = "BROWSER_NETWORK_FAILED";
export const BROWSER_EVIDENCE_GAP = "BROWSER_EVIDENCE_GAP";
export const BROWSER_CREDENTIAL_FORBIDDEN = "BROWSER_CREDENTIAL_FORBIDDEN";
export const BROWSER_RETRY_CAP_EXHAUSTED = "BROWSER_RETRY_CAP_EXHAUSTED";

export const UAT_PROBE_PASS = "UAT_PROBE_PASS";
export const UAT_PROBE_FAILED = "UAT_PROBE_FAILED";
export const UAT_PROBE_TIMEOUT = "UAT_PROBE_TIMEOUT";
export const UAT_PROBE_UNRESOLVED = "UAT_PROBE_UNRESOLVED";
export const UAT_PROBE_FORBIDDEN = "UAT_PROBE_FORBIDDEN";
export const UAT_BROWSER_UNAVAILABLE = "UAT_BROWSER_UNAVAILABLE";
export const UAT_BROWSER_PROBE_FAILED = "UAT_BROWSER_PROBE_FAILED";
export const UAT_BROWSER_PROBE_TIMEOUT = "UAT_BROWSER_PROBE_TIMEOUT";

export const DEFAULT_RETRY_MAX = 2;
export const BROWSER_RETRY_MAX_KEY = "BROWSER_RETRY_MAX";
export const UAT_BROWSER_PROBE_MODE_OWNED = "owned";
export const UAT_BROWSER_PROBE_MODE_CURSOR = "cursor";
export const EVIDENCE_DIR_REL = ".its-magic/runtime/browser-evidence";

export const ITSM_BROWSER_ACTIONS = [
	"open",
	"navigate",
	"snapshot",
	"click",
	"type",
	"select",
	"wait",
	"screenshot",
	"console",
	"network",
	"download",
	"upload",
	"accessibility",
] as const;

export class BrowserUatError extends Error {
	readonly reason_code: string;
	constructor(reason_code: string, message?: string) {
		super(message ?? reason_code);
		this.name = "BrowserUatError";
		this.reason_code = reason_code;
	}
}

export function isBrowserUatError(err: unknown): err is BrowserUatError {
	return err instanceof BrowserUatError;
}
