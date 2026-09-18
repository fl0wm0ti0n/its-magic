import type { RouteInput, RouteResult } from "../workflow/command-router.ts";
import type { ProgrammaticCommand, SchedulerCommand } from "../workflow/types.ts";

export const OPERATOR_LOG_MAX_LINES = 200;
export const OPERATOR_LOG_MAX_BYTES = 32 * 1024;
export const OPERATOR_MIN_TERMINAL_COLS = 40;
export const OPERATOR_INPUT_REQUIRED = "OPERATOR_INPUT_REQUIRED";

export type OperatorDedicatedCommand =
	| "ask"
	| "status"
	| "resume"
	| "index"
	| "app"
	| "browser";

export type OperatorAuthCommand = "auth" | "models";

export type OperatorParsedToken =
	| { kind: "auth"; argv: string[] }
	| { kind: "programmatic"; command: ProgrammaticCommand; routeInput: RouteInput }
	| { kind: "scheduler"; command: SchedulerCommand; routeInput: RouteInput }
	| { kind: "dedicated"; command: OperatorDedicatedCommand; routeInput: RouteInput }
	| { kind: "unknown"; token: string };

export interface OperatorStatusSnapshot {
	schema_version: 1;
	orchestrator_run_id: string | null;
	story_id: string | null;
	sprint_id: string | null;
	phase_id: string | null;
	role_id: string | null;
	model_id: string | null;
	backend_id: string | null;
	app_health: { ok: boolean; reason_code?: string };
	index_health: { ok: boolean; stale?: boolean; reason_code?: string };
	browser_summary: { probe_count: number; evidence_refs: string[] };
	token_cost: {
		metric_source: string;
		total_tokens: number | null;
		evidence_ref: string | null;
	};
	sovereign: Record<string, unknown> | null;
	evidence_refs: string[];
	read_only: true;
}

export interface OperatorTimelineEntry {
	ts: string;
	phase_id: string;
	role: string;
	outcome: string;
	stop_reason?: string;
	session_id?: string;
	attempt?: number;
	evidence_refs: string[];
	divergence_label?: string;
}

export interface OperatorMetricsSnapshot {
	schema_version: 1;
	authoritative: {
		metric_source: string;
		total_tokens: number | null;
		total_cost_usd: number | null;
		evidence_ref: string | null;
	};
	derived: {
		phase_transitions: number;
		tool_calls: number;
		retries: number;
	};
	metrics_stale: boolean;
	evidence_missing: boolean;
	read_only: true;
}

export interface BoundedLogView {
	lines: string[];
	truncated: boolean;
	total_bytes: number;
	evidence_path: string | null;
}

export interface OperatorSessionState {
	attached: boolean;
	session_id: string | null;
	cancel_requested: boolean;
}

export type OperatorRouteOutcome = RouteResult;
