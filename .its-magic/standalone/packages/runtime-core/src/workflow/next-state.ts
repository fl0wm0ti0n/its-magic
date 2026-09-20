import type { StopReason } from "../stop-matrix/codes.ts";
import type { NextStateIntent } from "./types.ts";

export function createNextStateIntent(input: {
	next_phase: string;
	next_role: string;
	stop_reason?: StopReason;
	skip_reason?: string;
	gate_code?: string;
}): NextStateIntent {
	return {
		schema_version: 1,
		next_phase: input.next_phase,
		next_role: input.next_role,
		stop_reason: input.stop_reason,
		skip_reason: input.skip_reason,
		gate_code: input.gate_code,
	};
}
