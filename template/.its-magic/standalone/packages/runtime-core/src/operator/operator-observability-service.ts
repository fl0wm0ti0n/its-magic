import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import type { RunsStore } from "../runs/store.ts";
import { parseResumeBrief, readRepoResume } from "../recovery/crash-resume.ts";
import { lookupSovereignRuntime } from "../workflow/config-view.ts";
import type { ConfigView } from "../workflow/config-view.ts";
import { buildBoundedLogView } from "./bounded-log.ts";
import type {
	BoundedLogView,
	OperatorMetricsSnapshot,
	OperatorStatusSnapshot,
	OperatorTimelineEntry,
} from "./types.ts";

export interface OperatorObservabilityPorts {
	readAppHealth?: () => { ok: boolean; reason_code?: string };
	readIndexHealth?: () => { ok: boolean; stale?: boolean; reason_code?: string };
	readBrowserSummary?: () => { probe_count: number; evidence_refs: string[] };
}

export interface OperatorObservabilityDeps {
	projectRoot: string;
	store: RunsStore;
	config?: ConfigView;
	ports?: OperatorObservabilityPorts;
	/** When true, observability will not write token_cost_runs (always read-only). */
	readOnlyTokenLedger?: boolean;
}

function latestTokenCostEvidence(projectRoot: string): {
	metric_source: string;
	total_tokens: number | null;
	evidence_ref: string | null;
} {
	const dir = join(projectRoot, "handoffs", "token_cost_runs");
	if (!existsSync(dir)) {
		return { metric_source: "us-0080", total_tokens: null, evidence_ref: null };
	}
	const files = readdirSync(dir)
		.filter((f) => f.endsWith(".md") || f.endsWith(".jsonl"))
		.sort();
	const latest = files.at(-1);
	if (!latest) {
		return { metric_source: "us-0080", total_tokens: null, evidence_ref: null };
	}
	const path = join(dir, latest);
	const text = readFileSync(path, "utf8");
	const match = /total_tokens[:=]\s*(\d+)/i.exec(text);
	return {
		metric_source: "us-0080",
		total_tokens: match ? Number.parseInt(match[1], 10) : null,
		evidence_ref: path,
	};
}

function parseStorySprint(projectRoot: string): { story_id: string | null; sprint_id: string | null } {
	const briefPath = join(projectRoot, "handoffs", "resume_brief.md");
	if (!existsSync(briefPath)) {
		return { story_id: null, sprint_id: null };
	}
	const text = readFileSync(briefPath, "utf8");
	const story = /story_id[:*]*\s*([A-Z]+-\d+)/i.exec(text)?.[1] ?? null;
	const sprint = /sprint_id[:*]*\s*(S\d+)/i.exec(text)?.[1] ?? null;
	return { story_id: story, sprint_id: sprint };
}

export class OperatorObservabilityService {
	private readonly projectRoot: string;
	private readonly store: RunsStore;
	private readonly config: ConfigView;
	private readonly ports: OperatorObservabilityPorts;
	readonly readOnlyTokenLedger: boolean;
	private tokenLedgerWriteAttempted = false;

	constructor(deps: OperatorObservabilityDeps) {
		this.projectRoot = deps.projectRoot;
		this.store = deps.store;
		this.config = deps.config ?? {};
		this.ports = deps.ports ?? {};
		this.readOnlyTokenLedger = deps.readOnlyTokenLedger ?? true;
	}

	/** Guard: observability never appends token ledger rows. */
	appendTokenCostRow(): never {
		this.tokenLedgerWriteAttempted = true;
		throw new Error("TOKEN_COST_LEDGER_WRITE_FORBIDDEN");
	}

	wasTokenLedgerWriteAttempted(): boolean {
		return this.tokenLedgerWriteAttempted;
	}

	buildStatusSnapshot(orchestrator_run_id?: string | null): OperatorStatusSnapshot {
		const { story_id, sprint_id } = parseStorySprint(this.projectRoot);
		const token = latestTokenCostEvidence(this.projectRoot);
		const sovereignEnabled = lookupSovereignRuntime(this.config) === "1";
		let resumePhase: string | null = null;
		try {
			const { brief } = readRepoResume(this.projectRoot);
			resumePhase = brief.intended_resume_phase ?? null;
		} catch {
			resumePhase = null;
		}
		const app = this.ports.readAppHealth?.() ?? { ok: false, reason_code: "APP_HEALTH_UNAVAILABLE" };
		const index =
			this.ports.readIndexHealth?.() ?? { ok: false, stale: true, reason_code: "INDEX_UNAVAILABLE" };
		const browser =
			this.ports.readBrowserSummary?.() ?? { probe_count: 0, evidence_refs: [] };
		return {
			schema_version: 1,
			orchestrator_run_id: orchestrator_run_id ?? null,
			story_id,
			sprint_id,
			phase_id: resumePhase,
			role_id: null,
			model_id: null,
			backend_id: null,
			app_health: app,
			index_health: index,
			browser_summary: browser,
			token_cost: token,
			sovereign: sovereignEnabled ? { enabled: true } : null,
			evidence_refs: [
				"handoffs/resume_brief.md",
				token.evidence_ref ?? "handoffs/token_cost_runs/",
			].filter(Boolean),
			read_only: true,
		};
	}

	buildRunTimeline(run_id?: string): OperatorTimelineEntry[] {
		const audit = this.store.listAudit(run_id);
		const phaseAttempts = new Map<string, number>();
		const entries: OperatorTimelineEntry[] = [];
		for (const row of audit) {
			let payload: Record<string, unknown> = {};
			try {
				payload = JSON.parse(row.payload) as Record<string, unknown>;
			} catch {
				payload = { raw: row.payload };
			}
			const phase_id = String(payload.phase_id ?? payload.phase ?? "unknown");
			const attempt = (phaseAttempts.get(phase_id) ?? 0) + 1;
			phaseAttempts.set(phase_id, attempt);
			entries.push({
				ts: row.created_at,
				phase_id,
				role: String(payload.role_id ?? payload.role ?? "unknown"),
				outcome: row.event,
				stop_reason: payload.stop_reason ? String(payload.stop_reason) : undefined,
				session_id: payload.session_id ? String(payload.session_id) : undefined,
				attempt,
				evidence_refs: Array.isArray(payload.evidence_refs)
					? payload.evidence_refs.map(String)
					: ["handoffs/resume_brief.md"],
				divergence_label:
					payload.repo_divergent === true ? "audit_repo_divergent" : undefined,
			});
		}
		return entries;
	}

	buildMetricsSnapshot(): OperatorMetricsSnapshot {
		const token = latestTokenCostEvidence(this.projectRoot);
		const audit = this.store.listAudit();
		const derived = {
			phase_transitions: audit.filter((r) => r.event.includes("phase")).length,
			tool_calls: audit.filter((r) => r.event.includes("tool")).length,
			retries: audit.filter((r) => /retry/i.test(r.event)).length,
		};
		const evidence_missing = token.evidence_ref === null;
		const metrics_stale = evidence_missing && derived.phase_transitions > 0;
		return {
			schema_version: 1,
			authoritative: {
				metric_source: token.metric_source,
				total_tokens: token.total_tokens,
				total_cost_usd: null,
				evidence_ref: token.evidence_ref,
			},
			derived,
			metrics_stale,
			evidence_missing,
			read_only: true,
		};
	}

	buildBoundedLogSummary(logPath: string): BoundedLogView {
		return buildBoundedLogView(logPath);
	}

	readResumeBrief(): ReturnType<typeof parseResumeBrief> {
		const { brief } = readRepoResume(this.projectRoot);
		return brief;
	}
}

export function createOperatorObservabilityService(
	deps: OperatorObservabilityDeps,
): OperatorObservabilityService {
	return new OperatorObservabilityService(deps);
}
