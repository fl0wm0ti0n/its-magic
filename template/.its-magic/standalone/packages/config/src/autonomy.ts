import { AUTONOMY_FLAG_KEYS } from "./schema.ts";

export const PRESET_DEFINITIONS: Record<string, Record<string, string>> = {
	none: {},
	balanced: {
		WORK_KIND_AUTO_ACCEPT: "1",
		CROSS_MODEL_REWORK_EXHAUSTED_POLICY: "downgrade",
		CROSS_MODEL_SKIP_PHASES: "",
		RESUME_BRIEF_AUTO_REFRESH: "1",
		RUNTIME_PROOF_KIND: "lightweight",
		GOAL_CONVERGENCE_INTERVAL: "3",
		SOVEREIGN_DRAIN_AUTO_ACCEPT: "1",
		AUTONOMY_STOP_POLICY: "auto_repair_then_block",
	},
	full: {
		INTAKE_AUTONOMY_MODE: "1",
		INTAKE_MINIMAL_PACK: "1",
		INTAKE_ASSUME_STACK_CONTEXT: "1",
		WORK_KIND_AUTO_ACCEPT: "1",
		CROSS_MODEL_REWORK_EXHAUSTED_POLICY: "downgrade",
		CROSS_MODEL_SKIP_PHASES: "",
		RESUME_BRIEF_AUTO_REFRESH: "1",
		RUNTIME_PROOF_KIND: "lightweight",
		GOAL_CONVERGENCE_INTERVAL: "1",
		SOVEREIGN_DRAIN_AUTO_ACCEPT: "1",
		RELEASE_PUBLISH_AUTO_CONFIRM: "1",
		AUTONOMY_STOP_POLICY: "auto_repair_then_skip",
	},
};

export function expandAutonomyPreset(
	preset: string,
	overrides: Record<string, string>,
): Record<string, string> {
	const base = PRESET_DEFINITIONS[preset];
	if (!base) {
		throw new Error(`invalid AUTONOMY_PRESET=${preset}`);
	}
	const result = { ...base };
	for (const key of AUTONOMY_FLAG_KEYS) {
		if (key in overrides) {
			result[key] = overrides[key] as string;
		}
	}
	return result;
}
