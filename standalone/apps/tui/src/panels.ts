import type { OperatorStatusSnapshot, OperatorTimelineEntry } from "@its-magic/runtime-core";

export type TuiPanelId = "phase" | "status" | "timeline" | "tools";

export const TUI_COLLAPSE_ORDER: readonly TuiPanelId[] = [
	"phase",
	"status",
	"timeline",
	"tools",
];

export interface TuiPanelModel {
	phase: { phase_id: string | null; role_id: string | null };
	status: OperatorStatusSnapshot;
	timeline: OperatorTimelineEntry[];
	tools: { names: string[] };
}

export function selectVisiblePanels(cols: number): TuiPanelId[] {
	if (cols > 40) {
		return [...TUI_COLLAPSE_ORDER];
	}
	return ["phase", "status"];
}

export function renderPanelLayout(model: TuiPanelModel, cols: number): string {
	const visible = selectVisiblePanels(cols);
	const lines: string[] = [];
	for (const id of visible) {
		switch (id) {
			case "phase":
				lines.push(`\x1b[1mPhase\x1b[0m ${model.phase.phase_id ?? "—"} / ${model.phase.role_id ?? "—"}`);
				break;
			case "status":
				lines.push(
					`\x1b[1mStatus\x1b[0m story=${model.status.story_id ?? "—"} sprint=${model.status.sprint_id ?? "—"}`,
				);
				break;
			case "timeline":
				lines.push(
					`\x1b[1mTimeline\x1b[0m ${model.timeline.length} events`,
				);
				break;
			case "tools":
				lines.push(`\x1b[1mTools\x1b[0m ${model.tools.names.join(", ") || "—"}`);
				break;
			default:
				break;
		}
	}
	return lines.join("\n");
}
