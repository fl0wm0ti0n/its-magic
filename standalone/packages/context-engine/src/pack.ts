import { createHash } from "node:crypto";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import type { TokenProfile } from "./codes.ts";

export interface SourceRef {
	kind: string;
	path: string;
	start?: number;
	end?: number;
	snippet_sha256: string;
}

export interface ContextPack {
	schema_version: 1;
	token_profile: TokenProfile;
	source_refs: SourceRef[];
	ranked_ids: string[];
	exclude_set_hash: string;
	content_hash: string;
	reason_codes: string[];
	dropped_ids: string[];
}

export function canonicalJson(value: unknown): string {
	return JSON.stringify(sortKeys(value));
}

function sortKeys(value: unknown): unknown {
	if (Array.isArray(value)) {
		return value.map(sortKeys);
	}
	if (value && typeof value === "object") {
		const obj = value as Record<string, unknown>;
		const out: Record<string, unknown> = {};
		for (const key of Object.keys(obj).sort()) {
			out[key] = sortKeys(obj[key]);
		}
		return out;
	}
	return value;
}

export function sha256Utf8(text: string): string {
	return createHash("sha256").update(text, "utf8").digest("hex");
}

export function hashSnippet(snippet: string): string {
	return sha256Utf8(snippet);
}

export function computePackContentHash(
	pack: Omit<ContextPack, "content_hash"> | ContextPack,
): string {
	return sha256Utf8(
		canonicalJson({
			schema_version: pack.schema_version,
			token_profile: pack.token_profile,
			source_refs: pack.source_refs,
			ranked_ids: pack.ranked_ids,
			exclude_set_hash: pack.exclude_set_hash,
		}),
	);
}

export function withContentHash(pack: Omit<ContextPack, "content_hash">): ContextPack {
	const content_hash = computePackContentHash(pack);
	return { ...pack, content_hash };
}

export function persistContextPack(pack: ContextPack, agentDir: string): string {
	const dir = join(agentDir, "context-packs");
	mkdirSync(dir, { recursive: true });
	const path = join(dir, `${pack.content_hash}.json`);
	writeFileSync(path, `${canonicalJson(pack)}\n`, "utf8");
	return path;
}

export function applyContextPackHash<T extends { context_pack_hash?: string }>(
	attestation: T,
	pack: ContextPack,
): T {
	return { ...attestation, context_pack_hash: pack.content_hash };
}
