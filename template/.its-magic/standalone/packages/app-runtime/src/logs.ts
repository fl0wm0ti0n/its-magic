import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { DEFAULT_LOG_BUDGET_BYTES, DEFAULT_LOG_RING } from "./codes.ts";

const HEADER_RE = /^(authorization|cookie)\s*[:=]\s*(?!\[redacted\])\S+/gim;

export function redactLogLine(line: string): string {
	return line
		.replace(/Bearer\s+\S+/gi, "Bearer [redacted]")
		.replace(/Authorization:\s*\S+/gi, "Authorization: [redacted]")
		.replace(/Cookie:\s*\S+/gi, "Cookie: [redacted]")
		.replace(HEADER_RE, (m) => `${m.split(/[:=]/)[0]}: [redacted]`);
}

export function summarizeLogs(
	text: string,
	budgetBytes: number = DEFAULT_LOG_BUDGET_BYTES,
): string {
	const redacted = redactLogLine(text);
	const lines = redacted.split(/\r?\n/);
	const errors = lines.filter((l) => /error|fatal|exception/i.test(l));
	const head = lines.slice(0, 20);
	const tail = lines.length > 40 ? lines.slice(-20) : [];
	const parts = [
		head.join("\n"),
		errors.length ? `\n--- errors ---\n${errors.slice(0, 20).join("\n")}` : "",
		tail.length ? `\n--- tail ---\n${tail.join("\n")}` : "",
	];
	let out = parts.join("");
	if (Buffer.byteLength(out, "utf8") > budgetBytes) {
		out = out.slice(0, budgetBytes);
	}
	return out;
}

export class LogRing {
	private readonly lines: string[] = [];
	private readonly max: number;
	constructor(max = DEFAULT_LOG_RING) {
		this.max = max;
	}

	push(line: string): void {
		this.lines.push(redactLogLine(line));
		if (this.lines.length > this.max) {
			this.lines.splice(0, this.lines.length - this.max);
		}
	}

	snapshot(): string[] {
		return [...this.lines];
	}

	persist(logsDir: string, handleId: string): string {
		mkdirSync(logsDir, { recursive: true });
		const ref = join(logsDir, `${handleId}.log`);
		writeFileSync(ref, this.lines.join("\n"), "utf8");
		return ref;
	}
}

export function persistText(logsDir: string, name: string, text: string): string {
	mkdirSync(logsDir, { recursive: true });
	const ref = join(logsDir, name);
	writeFileSync(ref, redactLogLine(text), "utf8");
	return ref;
}

export function persistEvidence(logsDir: string, id: string, payload: unknown): string {
	mkdirSync(logsDir, { recursive: true });
	const ref = join(logsDir, `evidence-${id}.json`);
	writeFileSync(ref, JSON.stringify(payload), "utf8");
	return ref;
}
