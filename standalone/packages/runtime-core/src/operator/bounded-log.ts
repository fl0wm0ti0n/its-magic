import { existsSync, readFileSync, statSync } from "node:fs";
import type { BoundedLogView } from "./types.ts";
import { OPERATOR_LOG_MAX_BYTES, OPERATOR_LOG_MAX_LINES } from "./types.ts";

export function buildBoundedLogView(
	filePath: string,
	opts?: { maxLines?: number; maxBytes?: number },
): BoundedLogView {
	const maxLines = opts?.maxLines ?? OPERATOR_LOG_MAX_LINES;
	const maxBytes = opts?.maxBytes ?? OPERATOR_LOG_MAX_BYTES;
	if (!existsSync(filePath)) {
		return {
			lines: [],
			truncated: false,
			total_bytes: 0,
			evidence_path: filePath,
		};
	}
	const raw = readFileSync(filePath);
	const total_bytes = raw.length;
	const text = raw.toString("utf8");
	const allLines = text.split(/\r?\n/);
	const truncatedByLines = allLines.length > maxLines;
	let visible = truncatedByLines ? allLines.slice(-maxLines) : allLines;
	let body = visible.join("\n");
	let truncated = truncatedByLines;
	if (body.length > maxBytes) {
		body = body.slice(-maxBytes);
		visible = body.split(/\r?\n/);
		truncated = true;
	}
	try {
		statSync(filePath);
	} catch {
		// ignore
	}
	return {
		lines: visible,
		truncated,
		total_bytes,
		evidence_path: filePath,
	};
}
