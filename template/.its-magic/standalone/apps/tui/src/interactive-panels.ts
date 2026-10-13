import { redactEventPayload } from "@its-magic/protocol";
import {
	OPERATOR_LOG_MAX_BYTES,
	OPERATOR_LOG_MAX_LINES,
	type OperatorStatusSnapshot,
} from "@its-magic/runtime-core";
import { renderPanelLayout, type TuiPanelModel } from "./panels.ts";

export interface SurfaceEvent {
	seq: number;
	kind: string;
	payload?: Record<string, unknown>;
}

export interface BoundedText {
	lines: string[];
	truncated: boolean;
	footer: string | null;
}

export function boundOperatorText(lines: string[]): BoundedText {
	const flat = lines.flatMap((line) => line.split(/\r?\n/));
	let visible =
		flat.length > OPERATOR_LOG_MAX_LINES ? flat.slice(-OPERATOR_LOG_MAX_LINES) : [...flat];
	let truncated = flat.length > OPERATOR_LOG_MAX_LINES;
	let body = visible.join("\n");
	if (Buffer.byteLength(body) > OPERATOR_LOG_MAX_BYTES) {
		body = Buffer.from(body)
			.subarray(Buffer.byteLength(body) - OPERATOR_LOG_MAX_BYTES)
			.toString("utf8");
		visible = body.split(/\r?\n/);
		truncated = true;
	}
	return {
		lines: visible,
		truncated,
		footer: truncated
			? `evidence: truncated lines<=${OPERATOR_LOG_MAX_LINES} bytes<=${OPERATOR_LOG_MAX_BYTES}`
			: null,
	};
}

function asStrings(value: unknown): string[] {
	if (typeof value === "string" && value.trim()) {
		return [value];
	}
	if (!Array.isArray(value)) {
		return [];
	}
	return value.filter((item): item is string => typeof item === "string" && item.trim() !== "");
}

function collect(status: OperatorStatusSnapshot, events: SurfaceEvent[]) {
	const conversation: string[] = [];
	const changedFiles: string[] = [];
	const appLog: string[] = [];
	const toolNames: string[] = [];
	const diagnostics: string[] = [];
	for (const event of events) {
		const payload = event.payload ?? {};
		const kind = event.kind.toLowerCase();
		const toolName =
			(typeof payload.tool_name === "string" && payload.tool_name) ||
			(typeof payload.tool === "string" && payload.tool) ||
			"";
		if (toolName || kind.includes("tool")) {
			if (toolName) {
				toolNames.push(toolName);
			}
		}
		if (
			kind.includes("message") ||
			kind.includes("agent") ||
			kind.includes("assistant") ||
			typeof payload.text === "string" ||
			typeof payload.message === "string"
		) {
			conversation.push(
				...asStrings(payload.text),
				...asStrings(payload.message),
				...asStrings(payload.content),
			);
		}
		changedFiles.push(...asStrings(payload.changed_files), ...asStrings(payload.files));
		if (typeof payload.path === "string" && kind.includes("file")) {
			changedFiles.push(payload.path);
		}
		appLog.push(...asStrings(payload.log), ...asStrings(payload.lines));
		const disposition = typeof payload.disposition === "string" ? payload.disposition : "";
		const reason = typeof payload.reason_code === "string" ? payload.reason_code : "";
		const stop = typeof payload.stop_reason === "string" ? payload.stop_reason : "";
		if (
			disposition === "execution_failure" ||
			disposition === "gate_block" ||
			reason === "AUTO_PAUSE_REQUEST" ||
			stop === "pause_request"
		) {
			diagnostics.push([disposition, reason, stop].filter(Boolean).join(" "));
		}
	}
	const app = status.app_health;
	const browser = status.browser_summary;
	const cost = status.token_cost;
	return {
		toolNames,
		conversation,
		changedFiles,
		diagnostics,
		sections: [
			`Conversation ${conversation.join(" | ") || "—"}`,
			`Changed files ${changedFiles.join(", ") || "—"}`,
			`App/log ok=${app.ok} ${app.reason_code ?? "—"} ${appLog.join(" | ")}`.trim(),
			`Browser probes=${browser.probe_count} ${browser.evidence_refs.join(", ") || "—"}`,
			`Model/token/cost model=${status.model_id ?? "—"} source=${cost.metric_source} tokens=${
				cost.total_tokens ?? "—"
			}`,
		],
	};
}

export function renderInteractiveLayout(
	model: TuiPanelModel,
	cols: number,
	events: SurfaceEvent[],
	extraDiagnostics: string[] = [],
): string {
	const safeEvents = events.map((event) => ({
		...event,
		payload: event.payload ? redactEventPayload(event.payload) : undefined,
	}));
	const surface = collect(model.status, safeEvents);
	const rendered: TuiPanelModel = {
		...model,
		tools: { names: [...new Set([...model.tools.names, ...surface.toolNames])] },
	};
	const locked = renderPanelLayout(rendered, cols);
	if (cols <= 40) {
		return redactEventPayload(locked);
	}
	const extras = [...surface.sections];
	for (const line of [...surface.diagnostics, ...extraDiagnostics]) {
		if (line.trim()) {
			extras.push(`Diagnostics ${line}`);
		}
	}
	const bounded = boundOperatorText(extras);
	const parts = [locked, ...bounded.lines];
	if (bounded.footer) {
		parts.push(bounded.footer);
	}
	return redactEventPayload(parts.join("\n"));
}
