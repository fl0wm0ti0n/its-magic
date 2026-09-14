import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import {
	BROWSER_EVIDENCE_GAP,
	BrowserUatError,
	EVIDENCE_DIR_REL,
	UAT_BROWSER_PROBE_FAILED,
	UAT_PROBE_PASS,
} from "./codes.ts";
import { redactEvidencePayload } from "./redact.ts";
import type { BrowserBackend, ProbeRecord } from "./types.ts";

export function evidenceDir(root: string): string {
	return join(root, EVIDENCE_DIR_REL);
}

export function writeEvidence(root: string, record: ProbeRecord): ProbeRecord {
	const safe = redactEvidencePayload(record) as ProbeRecord;
	safe.har_content = "omit";
	const dir = evidenceDir(root);
	mkdirSync(dir, { recursive: true });
	const file = join(dir, `probe-${Date.now()}.json`);
	writeFileSync(file, JSON.stringify(safe, null, 2), "utf8");
	return safe;
}

export function assertEvidenceComplete(record: ProbeRecord): void {
	const refs = record.browser_evidence_refs;
	const hasShot = (refs.screenshots?.length ?? 0) > 0;
	const hasNav = Boolean(refs.navigation_url || record.final_url);
	const hasSnap = Boolean(record.snapshot_summary);
	const hasTrace = Boolean(record.trace_ref);
	const hasDuration = Number.isFinite(record.duration_ms);
	const hasBackend = record.browser_backend === "isolated" || record.browser_backend === "cdp";
	const hasRef = Boolean(record.app_runtime_ref);
	if (
		record.passed &&
		(!hasShot || !hasNav || !hasSnap || !hasTrace || !hasDuration || !hasBackend || !hasRef)
	) {
		throw new BrowserUatError(BROWSER_EVIDENCE_GAP);
	}
}

export function uatProbeRow(record: ProbeRecord): Record<string, unknown> {
	if (record.passed) {
		try {
			assertEvidenceComplete(record);
		} catch {
			return {
				passed: false,
				reason_code: UAT_BROWSER_PROBE_FAILED,
				browser_evidence_refs: record.browser_evidence_refs,
				snapshot_summary: record.snapshot_summary,
				trace_ref: record.trace_ref,
				duration_ms: record.duration_ms,
				browser_backend: record.browser_backend,
				app_runtime_ref: record.app_runtime_ref,
			};
		}
	}
	return {
		passed: record.passed,
		reason_code: record.passed ? UAT_PROBE_PASS : record.reason_code,
		browser_evidence_refs: record.browser_evidence_refs,
		snapshot_summary: record.snapshot_summary,
		trace_ref: record.trace_ref,
		duration_ms: record.duration_ms,
		browser_backend: record.browser_backend as BrowserBackend,
		app_runtime_ref: record.app_runtime_ref,
		console_errors: record.console_errors,
		failed_requests: record.failed_requests,
		final_url: record.final_url,
		har_content: "omit",
	};
}
