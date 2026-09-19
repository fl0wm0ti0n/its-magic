import { appendFileSync, existsSync, mkdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { expandAutonomyPreset } from "@its-magic/config";
import { locateProjectKernelSync } from "@its-magic/kernel-bridge";
import {
	AC6_NONRELAXABLE_TERMINALS,
	BUDGET_EXHAUSTED,
	DECISION_UNRESOLVED,
	DELIVERY_MODE_INELIGIBLE,
	DELIVERY_MODE_SWITCH_MID_STORY,
	KERNEL_INCOMPATIBLE,
	MEGA_QUICK_AC_TOO_BROAD,
	MEGA_QUICK_ARCHITECTURE_REQUIRED,
	MEGA_QUICK_BUG_SEGMENT,
	MEGA_QUICK_GATE_ESCALATION,
	MEGA_QUICK_MULTI_COMPONENT,
	MEGA_QUICK_SPRINT_EXISTS,
	MEGA_QUICK_STORY_OVERRIDE,
	QUALITY_EVIDENCE_FAILED,
	RESUME_AMBIGUOUS,
	WORK_KIND_DELIVERY_MODE_CONFLICT,
	WORK_KIND_ROUTING_OFF,
} from "../stop-matrix/codes.ts";
import {
	type ConfigView,
	collectAutonomyOverrides,
	lookupAutonomyPreset,
	lookupAutoPhaseKeys,
	lookupComponentScopeMode,
	lookupDeliveryMode,
	lookupTokenProfile,
	lookupVoice,
	lookupWorkKindRouting,
} from "./config-view.ts";
import { CANONICAL_PHASES, type CanonicalPhase, shouldSkipPlanVerify } from "./phase-graph.ts";
import type { IndependentAxes, SchedulerCommand } from "./types.ts";
import { WorkflowError } from "./types.ts";

export const MEGA_QUICK_PLAN: CanonicalPhase[] = [
	"execute",
	"qa",
	"verify-work",
	"release",
	"closure",
	"refresh-context",
];

export const ULTRA_LEAN_SKIP_REASON = "ultra_lean_skip_plan_verify";

export interface StopMatrixRow {
	code: string;
	stop_class: "security_hard" | "autonomy_resolvable" | string;
	auto_repair_kind: string;
	cap: number;
}

export interface DeliveryRouteInput {
	command: SchedulerCommand;
	config: ConfigView;
	startFrom?: string;
	previousDeliveryMode?: string;
	backlogWorkKind?: string;
	backlogRecommendedDeliveryMode?: string;
	acCount?: number;
	hasCompanionDec?: boolean;
	activeSprint?: boolean;
	itemKind?: "story" | "bug";
	componentCount?: number;
	gateEscalation?: boolean;
	kernelRoot?: string;
	yamlPath?: string;
}

export interface DeliveryRouteResult {
	delivery_mode: string;
	plan: CanonicalPhase[];
	axes: IndependentAxes;
	reason_code?: string;
	conflict_code?: "WORK_KIND_DELIVERY_MODE_CONFLICT";
	skip_reason?: string;
	in_process_producer: false;
	host_scheduling_only: true;
}

export function collectIndependentAxes(config: ConfigView): IndependentAxes {
	return {
		delivery_mode: lookupDeliveryMode(config),
		token_profile: lookupTokenProfile(config),
		voice: lookupVoice(config),
		autonomy_preset: lookupAutonomyPreset(config),
		work_kind_routing: lookupWorkKindRouting(config),
	};
}

export function expandPresetBeforeRun(config: ConfigView): Record<string, string> {
	return expandAutonomyPreset(lookupAutonomyPreset(config), collectAutonomyOverrides(config));
}

export function planForDeliveryMode(mode: string, config?: ConfigView): CanonicalPhase[] {
	if (mode === "mega_quick") {
		return [...MEGA_QUICK_PLAN];
	}
	const full = [...CANONICAL_PHASES];
	if (mode === "ultra_lean" || (config && shouldSkipPlanVerify(config))) {
		return full;
	}
	return full;
}

function intersectStartFrom(plan: CanonicalPhase[], startFrom?: string): CanonicalPhase[] {
	if (!startFrom) {
		return plan;
	}
	const idx = plan.indexOf(startFrom as CanonicalPhase);
	if (idx >= 0) {
		return plan.slice(idx);
	}
	if ((CANONICAL_PHASES as readonly string[]).includes(startFrom)) {
		const fromFull = CANONICAL_PHASES.indexOf(startFrom as CanonicalPhase);
		return CANONICAL_PHASES.slice(fromFull).filter((p) => plan.includes(p) || p === startFrom);
	}
	return plan;
}

export interface MegaQuickEligibility {
	itemKind?: "story" | "bug";
	acCount?: number;
	hasCompanionDec?: boolean;
	activeSprint?: boolean;
	storyOverride?: string;
	componentCount?: number;
	componentScopeMode?: boolean;
	gateEscalation?: boolean;
}

export function evaluateMegaQuickEligibility(input: MegaQuickEligibility): string | undefined {
	if (input.itemKind === "bug") {
		return MEGA_QUICK_BUG_SEGMENT;
	}
	if ((input.acCount ?? 0) > 3) {
		return MEGA_QUICK_AC_TOO_BROAD;
	}
	if (input.hasCompanionDec) {
		return MEGA_QUICK_ARCHITECTURE_REQUIRED;
	}
	if (input.activeSprint) {
		return MEGA_QUICK_SPRINT_EXISTS;
	}
	if (input.storyOverride && input.storyOverride !== "mega_quick" && input.storyOverride !== "") {
		return MEGA_QUICK_STORY_OVERRIDE;
	}
	if ((input.componentScopeMode ?? false) && (input.componentCount ?? 1) > 1) {
		return MEGA_QUICK_MULTI_COMPONENT;
	}
	if (input.gateEscalation) {
		return MEGA_QUICK_GATE_ESCALATION;
	}
	return undefined;
}

/**
 * L8 adapter — ports scripts/work_kind_routing_lib.py precedence.
 * Python remains kit SOT. Canonical node sets are architecture-pinned (DEC-0143 §5).
 */
export function resolveDeliveryRoute(input: DeliveryRouteInput): DeliveryRouteResult {
	const axes = collectIndependentAxes(input.config);
	if (
		input.previousDeliveryMode &&
		input.previousDeliveryMode !== axes.delivery_mode &&
		!input.startFrom
	) {
		throw new WorkflowError(
			DELIVERY_MODE_SWITCH_MID_STORY,
			"DELIVERY_MODE must not switch mid-story",
		);
	}

	if (input.command === "/quick") {
		const ineligible = evaluateMegaQuickEligibility({
			itemKind: input.itemKind,
			acCount: input.acCount,
			hasCompanionDec: input.hasCompanionDec,
			activeSprint: input.activeSprint,
			storyOverride: input.backlogRecommendedDeliveryMode,
			componentCount: input.componentCount,
			componentScopeMode: lookupComponentScopeMode(input.config),
			gateEscalation: input.gateEscalation,
		});
		if (ineligible) {
			throw new WorkflowError(DELIVERY_MODE_INELIGIBLE, `mega_quick ineligible: ${ineligible}`, [
				ineligible,
			]);
		}
		return {
			delivery_mode: "mega_quick",
			plan: intersectStartFrom([...MEGA_QUICK_PLAN], input.startFrom),
			axes,
			in_process_producer: false,
			host_scheduling_only: true,
		};
	}

	const routingOn = axes.work_kind_routing === "1";
	const explicitMode = input.config.delivery?.DELIVERY_MODE;
	const hasAutoPhase = lookupAutoPhaseKeys(input.config);
	let delivery_mode = axes.delivery_mode;
	let reason_code: string | undefined;
	let conflict_code: "WORK_KIND_DELIVERY_MODE_CONFLICT" | undefined;

	if (!routingOn) {
		reason_code = WORK_KIND_ROUTING_OFF;
		delivery_mode = explicitMode ?? "standard";
	} else if (explicitMode) {
		if (
			input.backlogRecommendedDeliveryMode &&
			input.backlogRecommendedDeliveryMode !== explicitMode
		) {
			conflict_code = WORK_KIND_DELIVERY_MODE_CONFLICT;
			reason_code = WORK_KIND_DELIVERY_MODE_CONFLICT;
		}
		delivery_mode = explicitMode;
	} else if (hasAutoPhase) {
		delivery_mode = "standard";
	} else if (input.backlogRecommendedDeliveryMode) {
		delivery_mode = input.backlogRecommendedDeliveryMode;
		reason_code = "WORK_KIND_ROUTING_APPLIED";
	} else {
		delivery_mode = "standard";
	}

	if (delivery_mode === "mega_quick") {
		const ineligible = evaluateMegaQuickEligibility({
			itemKind: input.itemKind,
			acCount: input.acCount,
			hasCompanionDec: input.hasCompanionDec,
			activeSprint: input.activeSprint,
			storyOverride: explicitMode ? "" : input.backlogRecommendedDeliveryMode,
			componentCount: input.componentCount,
			componentScopeMode: lookupComponentScopeMode(input.config),
			gateEscalation: input.gateEscalation,
		});
		if (ineligible) {
			throw new WorkflowError(DELIVERY_MODE_INELIGIBLE, `mega_quick ineligible: ${ineligible}`, [
				ineligible,
			]);
		}
	}

	if (input.startFrom) {
		reason_code = reason_code ?? "START_FROM";
	}

	const plan = intersectStartFrom(
		planForDeliveryMode(delivery_mode, input.config),
		input.startFrom,
	);
	const skip_reason =
		delivery_mode === "ultra_lean" || shouldSkipPlanVerify(input.config)
			? ULTRA_LEAN_SKIP_REASON
			: undefined;
	return {
		delivery_mode,
		plan,
		axes,
		reason_code,
		conflict_code,
		skip_reason,
		in_process_producer: false,
		host_scheduling_only: true,
	};
}

export function parseStopMatrixYaml(text: string): StopMatrixRow[] {
	const rows: StopMatrixRow[] = [];
	let current: Partial<StopMatrixRow> | undefined;
	for (const raw of text.split(/\r?\n/)) {
		const line = raw.trimEnd();
		if (!line.trim() || line.trimStart().startsWith("#")) {
			continue;
		}
		const stripped = line.trim();
		if (stripped.startsWith("- code:")) {
			if (current?.code) {
				rows.push(current as StopMatrixRow);
			}
			current = {
				code:
					stripped
						.split(":", 2)[1]
						?.trim()
						.replace(/^["']|["']$/g, "") ?? "",
				stop_class: "",
				auto_repair_kind: "",
				cap: 0,
			};
			continue;
		}
		if (!current) {
			continue;
		}
		if (stripped.startsWith("stop_class:")) {
			current.stop_class =
				stripped
					.split(":", 2)[1]
					?.trim()
					.replace(/^["']|["']$/g, "") ?? "";
		} else if (stripped.startsWith("auto_repair_kind:")) {
			current.auto_repair_kind =
				stripped
					.split(":", 2)[1]
					?.trim()
					.replace(/^["']|["']$/g, "") ?? "";
		} else if (stripped.startsWith("cap:")) {
			const cap = Number.parseInt(stripped.split(":", 2)[1]?.trim() ?? "0", 10);
			current.cap = Number.isFinite(cap) ? cap : 0;
		}
	}
	if (current?.code) {
		rows.push(current as StopMatrixRow);
	}
	return rows;
}

export function locateStopMatrixPath(opts?: {
	cwd?: string;
	kernelRoot?: string;
	yamlPath?: string;
}): string {
	if (opts?.yamlPath) {
		return opts.yamlPath;
	}
	const located = locateProjectKernelSync({ cwd: opts?.cwd, kernelRoot: opts?.kernelRoot });
	return join(located.kernelRoot, "scripts", "data", "autonomy_stop_matrix.yaml");
}

export function loadStopMatrix(opts?: {
	cwd?: string;
	kernelRoot?: string;
	yamlPath?: string;
}): StopMatrixRow[] {
	const path = locateStopMatrixPath(opts);
	if (!existsSync(path)) {
		throw new WorkflowError(KERNEL_INCOMPATIBLE, `stop matrix missing at ${path}`);
	}
	return parseStopMatrixYaml(readFileSync(path, "utf8"));
}

export function securityHardCodes(rows: StopMatrixRow[]): Set<string> {
	const hard = new Set<string>(AC6_NONRELAXABLE_TERMINALS);
	for (const row of rows) {
		if (row.stop_class === "security_hard") {
			hard.add(row.code);
		}
	}
	return hard;
}

export function isNonRelaxableStop(code: string, rows: StopMatrixRow[], preset = "full"): boolean {
	void preset;
	if ((AC6_NONRELAXABLE_TERMINALS as readonly string[]).includes(code)) {
		return true;
	}
	const row = rows.find((r) => r.code === code);
	return row?.stop_class === "security_hard";
}

export function assertCannotRelax(code: string, rows: StopMatrixRow[], preset: string): void {
	if (isNonRelaxableStop(code, rows, preset)) {
		throw new WorkflowError(code, `AC-6 / security_hard ${code} is not relaxable under ${preset}`);
	}
}

export const AC6_TERMINAL_SET = new Set<string>([
	...AC6_NONRELAXABLE_TERMINALS,
	DECISION_UNRESOLVED,
	KERNEL_INCOMPATIBLE,
	QUALITY_EVIDENCE_FAILED,
	BUDGET_EXHAUSTED,
	RESUME_AMBIGUOUS,
]);

export interface RepairLedgerEntry {
	phase_selection?: string;
	retries?: number;
	skips?: string[];
	stop_reason?: string;
	resume_choice?: string;
	repair_kind?: string;
	cap_remaining?: number;
	reason_code?: string;
	axes?: IndependentAxes;
	event?: string;
}

export function appendRepairLedger(
	orchestratorRunId: string,
	entry: RepairLedgerEntry,
	opts?: { root?: string; now?: string },
): string {
	const root = opts?.root;
	const dir = root
		? join(root, "handoffs", "autonomy_repair_ledger")
		: join(process.cwd(), "handoffs", "autonomy_repair_ledger");
	mkdirSync(dir, { recursive: true });
	const path = join(dir, `${orchestratorRunId}.jsonl`);
	const row = {
		...entry,
		orchestrator_run_id: orchestratorRunId,
		created_at: opts?.now ?? new Date().toISOString(),
	};
	appendFileSync(path, `${JSON.stringify(row)}\n`, "utf8");
	return path;
}
