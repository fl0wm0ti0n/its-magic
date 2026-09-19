import type { StopReason } from "../stop-matrix/codes.ts";

export const COMMAND_ROUTER_STEPS = [
	"target_config",
	"preconditions",
	"role_model_tool_context",
	"fresh_session_spawn",
	"kernel_validators",
	"evidence",
	"next_state_intent",
] as const;

export type CommandRouterStep = (typeof COMMAND_ROUTER_STEPS)[number];

export const PROGRAMMATIC_COMMANDS = [
	"intake",
	"discovery",
	"research",
	"architecture",
	"sprint-plan",
	"plan-verify",
	"execute",
	"qa",
	"verify-work",
	"release",
	"closure",
	"refresh-context",
	"ask",
	"memory-audit",
	"map-codebase",
	"security-review",
] as const;

export type ProgrammaticCommand = (typeof PROGRAMMATIC_COMMANDS)[number];

export const SCHEDULER_COMMANDS = ["/auto", "/quick"] as const;

export type SchedulerCommand = (typeof SCHEDULER_COMMANDS)[number];

/** Empty after US-0143 — `/auto`/`/quick` are implemented scheduler commands. */
export const DEFERRED_COMMANDS = [] as const;

export type DeferredCommand = never;

export type RouterCommand = ProgrammaticCommand | SchedulerCommand | string;

export interface IndependentAxes {
	delivery_mode: string;
	token_profile: string;
	voice: string;
	autonomy_preset: string;
	work_kind_routing: "0" | "1";
}

export interface NextStateIntent {
	schema_version: 1;
	next_phase: string;
	next_role: string;
	stop_reason?: StopReason;
	skip_reason?: string;
	gate_code?: string;
}

export interface ReleaseEvidence {
	release_run_id: string;
	tests_pass: boolean;
	qa_pass: boolean;
	uat_pass: boolean;
	artifact_refs: string[];
}

export class WorkflowError extends Error {
	readonly code: string;
	readonly aliases: readonly string[];
	readonly intent?: NextStateIntent;

	constructor(
		code: string,
		message: string,
		aliases: readonly string[] = [],
		intent?: NextStateIntent,
	) {
		super(message);
		this.name = "WorkflowError";
		this.code = code;
		this.aliases = aliases;
		this.intent = intent;
	}
}

export function isWorkflowError(err: unknown): err is WorkflowError {
	return err instanceof WorkflowError;
}
