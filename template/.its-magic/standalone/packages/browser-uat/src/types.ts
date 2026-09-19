import type { ConnectHandoff } from "@its-magic/app-runtime";
import type { ITSM_BROWSER_ACTIONS } from "./codes.ts";

export type BrowserBackend = "isolated" | "cdp";
export type ItsmBrowserAction = (typeof ITSM_BROWSER_ACTIONS)[number];
export type ProbeKind =
	| "process_health"
	| "cli_smoke"
	| "browser_smoke"
	| "api_health"
	| "manual_operator";

export type { ConnectHandoff } from "@its-magic/app-runtime";

export const CONNECT_HANDOFF_FIELDS = [
	"connect_endpoint",
	"health_path",
	"service_id",
	"container_id",
	"env_refs",
	"url",
	"ports",
	"health",
] as const;

export interface ConnectHandoffPort {
	connectHandoff(id: string): ConnectHandoff;
}

export interface BrowserSession {
	id: string;
	backend: BrowserBackend;
	closed: boolean;
	disconnected: boolean;
	alive: boolean;
	headless?: boolean;
	url?: string;
	cookiesIsolated: boolean;
}

export interface LaunchIsolatedRequest {
	headless?: boolean;
}

export interface CdpAttachRequest {
	endpoint?: string;
	userDataDir?: string;
	approved?: boolean;
}

export interface BrowserDriver {
	kind: "fake" | "playwright" | "unavailable";
	launch(req?: LaunchIsolatedRequest): Promise<BrowserSession>;
	newContext(session: BrowserSession): Promise<BrowserSession>;
	close(session: BrowserSession): Promise<void>;
	connectOverCDP(req: CdpAttachRequest): Promise<BrowserSession>;
	disconnect(session: BrowserSession): Promise<void>;
}

export interface BrowserActionRequest {
	action: ItsmBrowserAction;
	url?: string;
	selector?: string;
	text?: string;
	value?: string;
	path?: string;
	timeoutMs?: number;
	account_ref?: string;
	operator_approved?: boolean;
}

export interface BrowserEvidenceRefs {
	screenshots: string[];
	console_summary?: string;
	network_summary?: string;
	navigation_url?: string;
}

export interface ProbeRecord {
	passed: boolean;
	reason_code: string;
	probe_kind?: ProbeKind;
	snapshot_summary: string;
	trace_ref: string;
	duration_ms: number;
	browser_backend: BrowserBackend;
	app_runtime_ref: string;
	console_errors: string[];
	failed_requests: string[];
	final_url: string;
	browser_evidence_refs: BrowserEvidenceRefs;
	har_content?: "omit";
}

export interface BrowserUatOptions {
	driver?: BrowserDriver;
	connect?: ConnectHandoffPort;
	evidenceDir?: string;
	retryMax?: number;
	env?: NodeJS.ProcessEnv;
	now?: () => Date;
	probeMode?: "owned" | "cursor";
}

export interface UatStep {
	text: string;
	kind?: ProbeKind;
}
