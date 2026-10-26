#!/usr/bin/env node
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
	createOperatorSession,
	OPERATOR_RUN_ID,
	type OperatorStatusSnapshot,
	type OperatorTimelineEntry,
	resolveOperatorTransport,
} from "@its-magic/runtime-core";
import { runInteractiveTui } from "./interactive.ts";
import type { TuiPanelModel } from "./panels.ts";

export { actionForKey, openInteractiveTui, runInteractiveTui } from "./interactive.ts";
export { boundOperatorText, renderInteractiveLayout } from "./interactive-panels.ts";
export { renderPanelLayout, selectVisiblePanels, TUI_COLLAPSE_ORDER } from "./panels.ts";

const DAEMON_UNREACHABLE = "DAEMON_UNREACHABLE";

function unreachableModel(): TuiPanelModel {
	const status: OperatorStatusSnapshot = {
		schema_version: 1,
		orchestrator_run_id: null,
		story_id: null,
		sprint_id: null,
		phase_id: null,
		role_id: null,
		model_id: null,
		backend_id: null,
		app_health: { ok: false, reason_code: DAEMON_UNREACHABLE },
		index_health: { ok: false, stale: true, reason_code: DAEMON_UNREACHABLE },
		browser_summary: { probe_count: 0, evidence_refs: [] },
		token_cost: { metric_source: "us-0080", total_tokens: null, evidence_ref: null },
		sovereign: null,
		evidence_refs: [DAEMON_UNREACHABLE],
		read_only: true,
	};
	const timeline: OperatorTimelineEntry[] = [
		{
			ts: new Date().toISOString(),
			phase_id: "unknown",
			role: "unknown",
			outcome: DAEMON_UNREACHABLE,
			evidence_refs: [DAEMON_UNREACHABLE],
		},
	];
	return {
		phase: { phase_id: null, role_id: null },
		status,
		timeline,
		tools: { names: [] },
	};
}

function timelineFromEvent(event: {
	seq: number;
	kind: string;
	payload?: Record<string, unknown>;
}): OperatorTimelineEntry {
	const payload = event.payload ?? {};
	const disposition = typeof payload.disposition === "string" ? payload.disposition : undefined;
	const command = typeof payload.command === "string" ? payload.command : undefined;
	return {
		ts: typeof payload.ts === "string" ? payload.ts : "",
		phase_id: command ?? event.kind,
		role: typeof payload.role_id === "string" ? payload.role_id : "daemon",
		outcome: disposition ?? event.kind,
		stop_reason: typeof payload.reason_code === "string" ? payload.reason_code : undefined,
		attempt: event.seq,
		evidence_refs: [`daemon-event:${event.kind}`],
	};
}

export async function buildTuiModel(projectRoot: string): Promise<TuiPanelModel> {
	const transport = await resolveOperatorTransport({
		projectRoot,
		session: createOperatorSession(),
		preferDaemon: process.env.ITS_MAGIC_IN_PROCESS !== "1",
		requireDaemon: process.env.ITS_MAGIC_REQUIRE_DAEMON === "1",
		client_kind: "tui",
	});
	if (transport.kind !== "daemon") {
		return unreachableModel();
	}
	try {
		await transport.attachRun({
			run_id: OPERATOR_RUN_ID,
			role: "observer",
			client_kind: "tui",
		});
		const events: Array<{ seq: number; kind: string; payload?: Record<string, unknown> }> = [];
		const subscription = await transport.subscribeEvents({
			run_id: OPERATOR_RUN_ID,
			after_seq: 0,
			onEvent: (event) => {
				events.push(event);
			},
		});
		await new Promise((resolve) => setTimeout(resolve, 200));
		subscription.unsubscribe();
		const status = await transport.statusSnapshot();
		return {
			phase: { phase_id: status.phase_id, role_id: status.role_id },
			status,
			timeline: events.map(timelineFromEvent),
			tools: { names: [] },
		};
	} catch {
		return unreachableModel();
	}
}

function isDirectRun(): boolean {
	const entry = process.argv[1];
	if (!entry) {
		return false;
	}
	return fileURLToPath(import.meta.url) === resolve(entry);
}

if (isDirectRun()) {
	const cols = Number.parseInt(process.env.COLUMNS ?? "80", 10) || 80;
	const result = await runInteractiveTui({
		projectRoot: process.cwd(),
		cols,
		input: process.stdin,
		output: process.stdout,
		isTTY: process.stdin.isTTY === true,
		env: process.env,
	});
	if (result.reason_code) {
		process.exitCode = result.exit_code;
	}
}
