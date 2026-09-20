import type { IntelHit } from "@its-magic/code-intelligence";
import { CONTEXT_EXCLUSION, SOVEREIGN_DIGEST_TOKEN_CAP } from "./codes.ts";
import { sha256Utf8 } from "./pack.ts";

export interface AssemblerFlags {
	AUTO_PHASE_INCLUDE?: string;
	AUTO_PHASE_EXCLUDE?: string;
	SOVEREIGN_MEMORY?: "0" | "1";
	phase_id?: string;
	role_id?: string;
}

export interface AssemblerInput {
	candidates: IntelHit[];
	flags?: AssemblerFlags;
	sovereign_digest?: string;
}

const DEFAULT_EXCLUDE_PATTERNS = [
	/(^|\/)\.env(\.|$)/i,
	/(^|\/)credentials(\.|$)/i,
	/(^|\/)secrets?(\.|$)/i,
	/agent-transcripts\//i,
	/handoffs\/archive\//i,
	/docs\/product\/backlog\.md$/i,
	/docs\/engineering\/state-archive\//i,
	/\.cursor\/commands\//i,
	/\.opencode\/commands\//i,
	/AGENTS\.md$/i,
];

export function isExcludedPath(path: string, flags: AssemblerFlags = {}): boolean {
	const normalized = path.replaceAll("\\", "/");
	if (normalized === ".env" || normalized.endsWith("/.env") || /(^|\/)\.env\./.test(normalized)) {
		return true;
	}
	for (const re of DEFAULT_EXCLUDE_PATTERNS) {
		if (re.test(normalized)) {
			return true;
		}
	}
	const extra = (flags.AUTO_PHASE_EXCLUDE ?? "")
		.split(",")
		.map((s) => s.trim())
		.filter(Boolean);
	for (const pat of extra) {
		if (normalized.includes(pat)) {
			return true;
		}
	}
	return false;
}

export function assemblePhaseContext(input: AssemblerInput): {
	hits: IntelHit[];
	exclude_set_hash: string;
	reason_codes: string[];
	sovereign_tokens: number;
} {
	const flags = input.flags ?? {};
	const excluded: string[] = [];
	const include = (flags.AUTO_PHASE_INCLUDE ?? "")
		.split(",")
		.map((s) => s.trim())
		.filter(Boolean);
	const hits: IntelHit[] = [];
	for (const cand of input.candidates) {
		if (isExcludedPath(cand.path, flags)) {
			excluded.push(cand.path);
			continue;
		}
		if (include.length > 0 && !include.some((p) => cand.path.includes(p))) {
			excluded.push(cand.path);
			continue;
		}
		hits.push(cand);
	}

	let sovereign_tokens = 0;
	if (flags.SOVEREIGN_MEMORY === "1" && input.sovereign_digest) {
		const digest = input.sovereign_digest.slice(0, SOVEREIGN_DIGEST_TOKEN_CAP * 4);
		sovereign_tokens = Math.min(SOVEREIGN_DIGEST_TOKEN_CAP, Math.ceil(digest.length / 4));
		hits.push({
			id: "sovereign:digest",
			kind: "artifact",
			path: "docs/engineering/sovereign-memory/digest.md",
			snippet: digest,
			score: 15,
		});
	}

	const reason_codes = excluded.length > 0 ? [CONTEXT_EXCLUSION] : [];
	const exclude_set_hash = sha256Utf8(JSON.stringify([...excluded].sort()));
	return { hits, exclude_set_hash, reason_codes, sovereign_tokens };
}
