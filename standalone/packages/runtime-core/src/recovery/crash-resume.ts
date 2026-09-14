import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import type { SessionSupervisor, SupervisedSession } from "@its-magic/role-runtime";
import type { RepoCanonical, RunsStore } from "../runs/store.ts";
import { RECOVERY_FALSE_COMPLETION, RESUME_BRIEF_STALE } from "../stop-matrix/codes.ts";
import { type ConfigView, lookupDeliveryMode } from "../workflow/config-view.ts";
import {
	type CanonicalPhase,
	hasNode,
	nextCanonicalPhase,
	roleForPhase,
} from "../workflow/phase-graph.ts";
import { WorkflowError } from "../workflow/types.ts";

export interface ResumeBriefSnapshot {
	last_completed_phase?: string;
	intended_resume_phase?: string;
	stale?: boolean;
	raw?: string;
}

export interface CrashResumeInput {
	supervisor: SessionSupervisor;
	store: RunsStore;
	config: ConfigView;
	repo: RepoCanonical;
	brief: ResumeBriefSnapshot;
	state_md?: string;
	orchestrator_run_id: string;
	model_id: string;
	now?: string;
}

export interface CrashResumeOk {
	ok: true;
	orphans_discarded: true;
	fresh: true;
	session: SupervisedSession;
	next_phase: string;
	next_role: string;
	restored_parent_transcript: false;
}

export function parseResumeBrief(text: string): ResumeBriefSnapshot {
	const last = /last_completed_phase[:*]*\s*`?([a-z0-9/-]+)/i.exec(text)?.[1];
	const next = /intended_resume_phase[:*]*\s*`?([a-z0-9/-]+)/i.exec(text)?.[1];
	const stale =
		/RESUME_BRIEF_STALE/i.test(text) || !last || !next || /stale\s*[:=]\s*true/i.test(text);
	return { last_completed_phase: last, intended_resume_phase: next, stale, raw: text };
}

export function readRepoResume(repoRoot: string): {
	brief: ResumeBriefSnapshot;
	state_md: string;
} {
	const briefPath = join(repoRoot, "handoffs", "resume_brief.md");
	const statePath = join(repoRoot, "docs", "engineering", "state.md");
	if (!existsSync(briefPath)) {
		throw new WorkflowError(RESUME_BRIEF_STALE, "handoffs/resume_brief.md missing");
	}
	const raw = readFileSync(briefPath, "utf8");
	const brief = parseResumeBrief(raw);
	const state_md = existsSync(statePath) ? readFileSync(statePath, "utf8") : "";
	return { brief, state_md };
}

export async function crashResume(input: CrashResumeInput): Promise<CrashResumeOk> {
	if (input.brief.stale) {
		throw new WorkflowError(RESUME_BRIEF_STALE, "resume_brief is stale; no advance");
	}
	input.store.assertRepoCanonical(input.repo);
	const last = input.store.lastRun();
	if (last && (last.claimed_complete === 1 || last.status === "PASS")) {
		const repoDisagrees =
			input.repo.backlog_status !== "DONE" ||
			input.repo.acceptance_done === false ||
			input.repo.sprint_done === false;
		if (repoDisagrees) {
			throw new WorkflowError(
				RECOVERY_FALSE_COMPLETION,
				"SQLite/session claimed PASS but repo evidence disagrees",
			);
		}
	}

	await input.supervisor.discardOrphans();

	const lastPhase = (input.brief.last_completed_phase ?? last?.phase_id ?? "intake") as string;
	let next_phase: string;
	if (input.brief.intended_resume_phase) {
		next_phase = input.brief.intended_resume_phase;
	} else if (hasNode(lastPhase)) {
		next_phase = nextCanonicalPhase(lastPhase as CanonicalPhase, input.config).next;
	} else {
		next_phase = "intake";
	}
	const next_role = roleForPhase(hasNode(next_phase) ? next_phase : "intake");
	const session = await input.supervisor.spawn({
		phase_id: hasNode(next_phase) ? next_phase : "intake",
		role_id: next_role,
		orchestrator_run_id: input.orchestrator_run_id,
		model_id: input.model_id,
		tools: [],
	});
	if (!session.fresh) {
		throw new WorkflowError("SESSION_NOT_FRESH", "crash resume must spawn a fresh role session");
	}
	void lookupDeliveryMode(input.config);
	return {
		ok: true,
		orphans_discarded: true,
		fresh: true,
		session,
		next_phase,
		next_role,
		restored_parent_transcript: false,
	};
}
