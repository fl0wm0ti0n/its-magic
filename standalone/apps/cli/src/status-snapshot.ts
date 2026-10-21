import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

export interface StatusTokenCost {
	metric_source: string;
	total_tokens: number | null;
	evidence_ref: string | null;
}

export interface StatusSnapshot {
	schema_version: 1;
	orchestrator_run_id: null;
	story_id: string | null;
	sprint_id: string | null;
	phase_id: string | null;
	role_id: null;
	model_id: null;
	backend_id: null;
	app_health: { ok: false; reason_code: "APP_HEALTH_UNAVAILABLE" };
	index_health: { ok: false; stale: true; reason_code: "INDEX_UNAVAILABLE" };
	browser_summary: { probe_count: 0; evidence_refs: string[] };
	token_cost: StatusTokenCost;
	sovereign: null;
	evidence_refs: string[];
	read_only: true;
}

const NULL_TOKEN: StatusTokenCost = {
	metric_source: "us-0080",
	total_tokens: null,
	evidence_ref: null,
};

function nullSnapshot(): StatusSnapshot {
	return {
		schema_version: 1,
		orchestrator_run_id: null,
		story_id: null,
		sprint_id: null,
		phase_id: null,
		role_id: null,
		model_id: null,
		backend_id: null,
		app_health: { ok: false, reason_code: "APP_HEALTH_UNAVAILABLE" },
		index_health: { ok: false, stale: true, reason_code: "INDEX_UNAVAILABLE" },
		browser_summary: { probe_count: 0, evidence_refs: [] },
		token_cost: { ...NULL_TOKEN },
		sovereign: null,
		evidence_refs: ["handoffs/resume_brief.md", "handoffs/token_cost_runs/"],
		read_only: true,
	};
}

function fieldToken(text: string, key: string): string | null {
	const match = new RegExp(
		`${key}[\\s\`*:]*\\**\\s*\`?([^\\s\`*;]+)`,
		"i",
	).exec(text);
	if (!match?.[1]) {
		return null;
	}
	const value = match[1].replace(/^[`*]+|[`*]+$/g, "");
	if (!value || value === "(none)" || value === "none") {
		return null;
	}
	return value;
}

function readBrief(projectRoot: string): {
	ok: boolean;
	story_id: string | null;
	sprint_id: string | null;
	phase_id: string | null;
} {
	const briefPath = join(projectRoot, "handoffs", "resume_brief.md");
	try {
		if (!existsSync(briefPath)) {
			return { ok: false, story_id: null, sprint_id: null, phase_id: null };
		}
		const text = readFileSync(briefPath, "utf8");
		if (!/(story_id|sprint_id|intended_resume_phase)/i.test(text)) {
			return { ok: false, story_id: null, sprint_id: null, phase_id: null };
		}
		const story = fieldToken(text, "story_id");
		const sprint = fieldToken(text, "sprint_id");
		const phase = fieldToken(text, "intended_resume_phase");
		return {
			ok: true,
			story_id: story && /^(?:US|BUG)-\d+$/i.test(story) ? story.toUpperCase() : null,
			sprint_id: sprint && /^S\d+$/i.test(sprint) ? sprint.toUpperCase() : null,
			phase_id: phase,
		};
	} catch {
		return { ok: false, story_id: null, sprint_id: null, phase_id: null };
	}
}

function readTokenCost(projectRoot: string): StatusTokenCost {
	const dir = join(projectRoot, "handoffs", "token_cost_runs");
	try {
		if (!existsSync(dir)) {
			return { ...NULL_TOKEN };
		}
		const names = readdirSync(dir).filter((name) => name.endsWith(".md") || name.endsWith(".jsonl"));
		if (names.length === 0) {
			return { ...NULL_TOKEN };
		}
		let latest = names[0] ?? "";
		let latestMtime = statSync(join(dir, latest)).mtimeMs;
		for (const name of names.slice(1)) {
			const mtime = statSync(join(dir, name)).mtimeMs;
			if (mtime > latestMtime || (mtime === latestMtime && name > latest)) {
				latest = name;
				latestMtime = mtime;
			}
		}
		const path = join(dir, latest);
		const text = readFileSync(path, "utf8");
		if (!text.trim()) {
			return { ...NULL_TOKEN };
		}
		const match = /total_tokens[:=]\s*(\d+)/i.exec(text);
		if (!match) {
			return { ...NULL_TOKEN };
		}
		return {
			metric_source: "us-0080",
			total_tokens: Number.parseInt(match[1] ?? "", 10),
			evidence_ref: path,
		};
	} catch {
		return { ...NULL_TOKEN };
	}
}

export function readStatusSnapshot(projectRoot: string): StatusSnapshot {
	const brief = readBrief(projectRoot);
	if (!brief.ok) {
		return nullSnapshot();
	}
	const token = readTokenCost(projectRoot);
	const snapshot = nullSnapshot();
	snapshot.story_id = brief.story_id;
	snapshot.sprint_id = brief.sprint_id;
	snapshot.phase_id = brief.phase_id;
	snapshot.token_cost = token;
	snapshot.evidence_refs = [
		"handoffs/resume_brief.md",
		token.evidence_ref ?? "handoffs/token_cost_runs/",
	];
	return snapshot;
}

export function printStatusSnapshot(projectRoot: string): number {
	console.log(JSON.stringify(readStatusSnapshot(projectRoot), null, 2));
	return 0;
}
