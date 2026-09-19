import {
	UAT_BROWSER_PROBE_MODE_CURSOR,
	UAT_BROWSER_PROBE_MODE_OWNED,
	UAT_PROBE_FORBIDDEN,
	UAT_PROBE_UNRESOLVED,
} from "./codes.ts";
import type { ProbeKind, UatStep } from "./types.ts";

const FORBIDDEN_PATH_TOKENS = [".env", "intake_evidence", "handoffs/intake_evidence"];
const SECRET_FORBIDDEN_TOKENS = ["password", "credential", "api key"];

export const CLASSIFY_KINDS: readonly ProbeKind[] = [
	"process_health",
	"cli_smoke",
	"browser_smoke",
	"api_health",
	"manual_operator",
];

export function kitBrowserProbeMode(raw: string | undefined): string {
	const mode = (raw ?? UAT_BROWSER_PROBE_MODE_CURSOR).trim();
	const known = new Set([
		UAT_BROWSER_PROBE_MODE_CURSOR,
		"http_fallback",
		"playwright_fallback",
		UAT_BROWSER_PROBE_MODE_OWNED,
	]);
	return known.has(mode) ? mode : UAT_BROWSER_PROBE_MODE_CURSOR;
}

export function classifyStep(stepText: string): { kind: ProbeKind | null; reason_code: string } {
	const lower = stepText.toLowerCase();
	if (FORBIDDEN_PATH_TOKENS.some((tok) => lower.includes(tok))) {
		return { kind: null, reason_code: UAT_PROBE_FORBIDDEN };
	}
	if (SECRET_FORBIDDEN_TOKENS.some((tok) => lower.includes(tok))) {
		return { kind: null, reason_code: UAT_PROBE_FORBIDDEN };
	}
	if (/(visually|operator confirms|human judgment|manually verify)/.test(lower)) {
		return { kind: "manual_operator", reason_code: UAT_PROBE_UNRESOLVED };
	}
	if (/(api|health|endpoint|http|rest)/.test(lower)) {
		return { kind: "api_health", reason_code: "" };
	}
	if (/(process|startup|server start|readiness)/.test(lower)) {
		return { kind: "process_health", reason_code: "" };
	}
	if (/(click|navigate|browser|playwright|smoke|ui|button)/.test(lower)) {
		return { kind: "browser_smoke", reason_code: "" };
	}
	if (/(cli|command line|exit code)/.test(lower)) {
		return { kind: "cli_smoke", reason_code: "" };
	}
	if (/(manual|operator|human)/.test(lower)) {
		return { kind: "manual_operator", reason_code: UAT_PROBE_UNRESOLVED };
	}
	return { kind: null, reason_code: UAT_PROBE_UNRESOLVED };
}

export function liftBrowserSmokeForStoryFixtures(step: UatStep, storyId: string): boolean {
	return (
		storyId === "US-0142" &&
		(step.kind === "browser_smoke" || classifyStep(step.text).kind === "browser_smoke")
	);
}
