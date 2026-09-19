import { resolvePhaseRole } from "@its-magic/role-runtime";
import { type ConfigView, lookupDeliveryMode } from "./config-view.ts";
import type { NextStateIntent } from "./types.ts";

export const CANONICAL_PHASES = [
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
] as const;

export type CanonicalPhase = (typeof CANONICAL_PHASES)[number];

export interface PhaseEdge {
	from: CanonicalPhase;
	to: CanonicalPhase;
	kind: "forward" | "rework" | "skip";
	skip_reason?: string;
}

export interface PhasePrecondition {
	phase: CanonicalPhase;
	requires: CanonicalPhase[];
}

const FORWARD: Array<[CanonicalPhase, CanonicalPhase]> = [
	["intake", "discovery"],
	["discovery", "research"],
	["research", "architecture"],
	["architecture", "sprint-plan"],
	["sprint-plan", "plan-verify"],
	["plan-verify", "execute"],
	["execute", "qa"],
	["qa", "verify-work"],
	["verify-work", "release"],
	["release", "closure"],
	["closure", "refresh-context"],
];

export const PHASE_GRAPH_EDGES: PhaseEdge[] = [
	...FORWARD.map(([from, to]) => ({ from, to, kind: "forward" as const })),
	{ from: "qa", to: "execute", kind: "rework" },
	{
		from: "sprint-plan",
		to: "execute",
		kind: "skip",
		skip_reason: "ultra_lean_skip_plan_verify",
	},
];

export const PHASE_PRECONDITIONS: PhasePrecondition[] = CANONICAL_PHASES.map((phase, index) => ({
	phase,
	requires: CANONICAL_PHASES.slice(0, index) as CanonicalPhase[],
}));

export function hasNode(phase: string): phase is CanonicalPhase {
	return (CANONICAL_PHASES as readonly string[]).includes(phase);
}

export function preconditionsFor(phase: CanonicalPhase): CanonicalPhase[] {
	const row = PHASE_PRECONDITIONS.find((p) => p.phase === phase);
	return row ? [...row.requires] : [];
}

export function shouldSkipPlanVerify(config: ConfigView): boolean {
	return lookupDeliveryMode(config) === "ultra_lean";
}

export function nextCanonicalPhase(
	current: CanonicalPhase,
	config: ConfigView,
): { next: CanonicalPhase; skip?: PhaseEdge } {
	if (current === "sprint-plan" && shouldSkipPlanVerify(config)) {
		const skip = PHASE_GRAPH_EDGES.find((e) => e.kind === "skip" && e.from === "sprint-plan");
		return { next: "execute", skip };
	}
	if (current === "refresh-context") {
		return { next: "refresh-context" };
	}
	const forward = PHASE_GRAPH_EDGES.find((e) => e.kind === "forward" && e.from === current);
	if (!forward) {
		return { next: current };
	}
	return { next: forward.to };
}

export function roleForPhase(phase: string, env?: NodeJS.ProcessEnv): string {
	return resolvePhaseRole({ phase_id: phase, env }).role_id;
}

export function intentForTransition(
	current: CanonicalPhase,
	config: ConfigView,
	stop_reason?: NextStateIntent["stop_reason"],
	gate_code?: string,
): NextStateIntent {
	const { next, skip } = nextCanonicalPhase(current, config);
	return {
		schema_version: 1,
		next_phase: next,
		next_role: roleForPhase(next),
		stop_reason,
		skip_reason: skip?.skip_reason,
		gate_code,
	};
}
