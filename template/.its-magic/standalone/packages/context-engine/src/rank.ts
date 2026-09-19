import type { IntelHit } from "@its-magic/code-intelligence";
import {
	CONTEXT_BUDGET,
	MMR_LAMBDA,
	RANK_WEIGHTS,
	TOKEN_PROFILE_CAPS,
	type TokenProfile,
} from "./codes.ts";
import { type ContextPack, hashSnippet, type SourceRef, withContentHash } from "./pack.ts";

export interface RankCandidate extends IntelHit {
	tokens?: number;
}

export interface RankInput {
	task: string;
	hits: RankCandidate[];
	token_profile: TokenProfile;
	exclude_set_hash: string;
	reason_codes?: string[];
}

function tokenEstimate(hit: RankCandidate): number {
	if (typeof hit.tokens === "number") {
		return hit.tokens;
	}
	return Math.max(1, Math.ceil((hit.snippet?.length ?? 0) / 4));
}

function weightOf(kind: RankCandidate["kind"]): number {
	return RANK_WEIGHTS[kind as keyof typeof RANK_WEIGHTS] ?? 10;
}

/**
 * Deterministic weighted rank + greedy pack until the first cap.
 * Giant prompt bodies never enter the ranker.
 */
export function codeContext(input: RankInput): ContextPack {
	const caps = TOKEN_PROFILE_CAPS[input.token_profile];
	const eligible = input.hits.filter((h) => {
		if (/\/commands\/|\.cursor\/commands|AGENTS\.md$/i.test(h.path) && tokenEstimate(h) > 4000) {
			return false;
		}
		return tokenEstimate(h) <= 8000;
	});
	const ranked = [...eligible].sort((a, b) => {
		const dw = weightOf(b.kind) - weightOf(a.kind);
		if (dw !== 0) {
			return dw;
		}
		if (b.score !== a.score) {
			return b.score - a.score;
		}
		return a.id.localeCompare(b.id);
	});

	const selected: RankCandidate[] = [];
	const dropped: string[] = [];
	const usedPaths = new Set<string>();
	let tokens = 0;
	const reasons = [...(input.reason_codes ?? [])];

	for (const cand of ranked) {
		if (selected.length >= caps.hits) {
			dropped.push(cand.id);
			continue;
		}
		const redundancy = usedPaths.has(cand.path) ? 1 : 0;
		const mmr = MMR_LAMBDA * weightOf(cand.kind) - (1 - MMR_LAMBDA) * redundancy * 100;
		if (redundancy === 1 && mmr < weightOf(cand.kind) * 0.5) {
			dropped.push(cand.id);
			continue;
		}
		const nextTokens = tokens + tokenEstimate(cand);
		const nextFiles = usedPaths.has(cand.path) ? usedPaths.size : usedPaths.size + 1;
		if (nextTokens > caps.tokens || nextFiles > caps.files) {
			dropped.push(cand.id);
			continue;
		}
		selected.push(cand);
		tokens = nextTokens;
		usedPaths.add(cand.path);
	}

	if (dropped.length > 0 && !reasons.includes(CONTEXT_BUDGET)) {
		reasons.push(CONTEXT_BUDGET);
	}

	const source_refs: SourceRef[] = selected.map((h) => {
		const ref: SourceRef = {
			kind: h.kind,
			path: h.path,
			snippet_sha256: hashSnippet(h.snippet),
		};
		if (typeof h.start === "number") {
			ref.start = h.start;
		}
		if (typeof h.end === "number") {
			ref.end = h.end;
		}
		return ref;
	});

	return withContentHash({
		schema_version: 1,
		token_profile: input.token_profile,
		source_refs,
		ranked_ids: selected.map((h) => h.id),
		exclude_set_hash: input.exclude_set_hash,
		reason_codes: reasons,
		dropped_ids: dropped,
	});
}
