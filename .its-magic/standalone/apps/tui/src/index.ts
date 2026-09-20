#!/usr/bin/env node
import {
	createOperatorObservabilityService,
	createOperatorSession,
	createRunsStore,
	resolveOperatorTransport,
} from "@its-magic/runtime-core";
import { renderPanelLayout, type TuiPanelModel } from "./panels.ts";

export { renderPanelLayout, selectVisiblePanels, TUI_COLLAPSE_ORDER } from "./panels.ts";

export async function buildTuiModel(projectRoot: string): Promise<TuiPanelModel> {
	await resolveOperatorTransport({
		projectRoot,
		session: createOperatorSession(),
		preferDaemon: process.env.ITS_MAGIC_IN_PROCESS !== "1",
		client_kind: "tui",
	});
	const store = createRunsStore(":memory:");
	const observability = createOperatorObservabilityService({ projectRoot, store });
	const status = observability.buildStatusSnapshot();
	return {
		phase: { phase_id: status.phase_id, role_id: status.role_id },
		status,
		timeline: observability.buildRunTimeline(),
		tools: { names: [] },
	};
}

const cols = Number.parseInt(process.env.COLUMNS ?? "80", 10) || 80;
const model = await buildTuiModel(process.cwd());
process.stdout.write(`${renderPanelLayout(model, cols)}\n`);
