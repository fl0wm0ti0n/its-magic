import { type Dirent, existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { extname, join, relative } from "node:path";
import { denyMutation } from "./aft/adapter.ts";
import { resolveAftBinary } from "./aft/resolve.ts";
import { AFT_BINARY_VERSION } from "./aft/version.ts";
import {
	INTEL_AFT_UNAVAILABLE,
	INTEL_EMBEDDINGS_UNAVAILABLE,
	INTEL_INDEX_STALE,
	INTEL_INDEX_UNAVAILABLE,
	INTEL_LSP_UNAVAILABLE,
	isAftMutationMethod,
} from "./codes.ts";
import type {
	CodeIntelligenceProvider,
	IndexedDoc,
	IntelHit,
	IntelResult,
	OutlineNode,
	ProviderAvailability,
	ProviderOptions,
	ProviderStatus,
	RefreshResult,
	SearchOptions,
} from "./types.ts";

const SKIP = new Set(["node_modules", ".git", "dist", ".runtime-isolation"]);
const TEXT_EXT = new Set([".ts", ".js", ".py", ".rs", ".go", ".java", ".cs", ".md"]);

function languageOf(path: string): string | undefined {
	const ext = extname(path);
	if (ext === ".ts" || ext === ".js") {
		return "typescript";
	}
	if (ext === ".py") {
		return "python";
	}
	if (ext === ".rs") {
		return "rust";
	}
	if (ext === ".go") {
		return "go";
	}
	return ext.replace(".", "") || undefined;
}

function walkDocs(root: string): IndexedDoc[] {
	const out: IndexedDoc[] = [];
	const stack = [root];
	while (stack.length > 0) {
		const dir = stack.pop() as string;
		let entries: Dirent[] = [];
		try {
			entries = readdirSync(dir, { withFileTypes: true });
		} catch {
			continue;
		}
		for (const ent of entries) {
			if (SKIP.has(ent.name) || ent.name.startsWith(".")) {
				continue;
			}
			const path = join(dir, ent.name);
			if (ent.isDirectory()) {
				stack.push(path);
				continue;
			}
			if (!TEXT_EXT.has(extname(ent.name))) {
				continue;
			}
			try {
				const text = readFileSync(path, "utf8");
				out.push({
					path: relative(root, path).replaceAll("\\", "/"),
					text,
					language: languageOf(path),
					mtime: statSync(path).mtimeMs,
				});
			} catch {
				// skip unreadable files; never read .env (filtered by name prefix and skip)
			}
		}
	}
	return out;
}

function extractSymbols(doc: IndexedDoc): string[] {
	if (doc.symbols && doc.symbols.length > 0) {
		return doc.symbols;
	}
	const names = new Set<string>();
	const re =
		/\b(?:export\s+)?(?:async\s+)?(?:function|class|const|let|def|fn|struct|impl|type)\s+([A-Za-z_][A-Za-z0-9_]*)/g;
	let m: RegExpExecArray | null = re.exec(doc.text);
	while (m) {
		names.add(m[1]);
		m = re.exec(doc.text);
	}
	return [...names];
}

function hit(partial: Omit<IntelHit, "id" | "score"> & { score?: number; id?: string }): IntelHit {
	const id = partial.id ?? `${partial.kind}:${partial.path}:${partial.symbol ?? "body"}`;
	return {
		id,
		kind: partial.kind,
		path: partial.path,
		start: partial.start,
		end: partial.end,
		snippet: partial.snippet.slice(0, 240),
		symbol: partial.symbol,
		score: partial.score ?? 1,
		language: partial.language,
	};
}

function uniqueHits(hits: IntelHit[]): IntelHit[] {
	const seen = new Set<string>();
	const out: IntelHit[] = [];
	for (const h of hits) {
		if (seen.has(h.id)) {
			continue;
		}
		seen.add(h.id);
		out.push(h);
	}
	return out;
}

export class DefaultCodeIntelligenceProvider implements CodeIntelligenceProvider {
	readonly repoRoot: string;
	readonly agentDir?: string;
	private docs: IndexedDoc[];
	private availability: ProviderAvailability;
	private readonly adapterKind: "fake" | "aft";
	private generation = 1;
	private refreshTriggered = false;

	constructor(options: ProviderOptions) {
		this.repoRoot = options.repoRoot;
		this.agentDir = options.agentDir;
		this.adapterKind = options.adapter ?? "fake";
		this.availability = {
			aft: options.availability?.aft ?? (this.adapterKind === "fake" ? "ok" : "ok"),
			lsp: options.availability?.lsp ?? "ok",
			embeddings: options.availability?.embeddings ?? "ok",
			index: options.availability?.index ?? "ok",
		};
		this.docs = options.docs ?? (existsSync(options.repoRoot) ? walkDocs(options.repoRoot) : []);
	}

	setAvailability(next: Partial<ProviderAvailability>): void {
		this.availability = { ...this.availability, ...next };
	}

	status(): ProviderStatus {
		const resolved = resolveAftBinary({});
		const reason_codes = this.collectHealthCodes();
		return {
			backend: this.adapterKind === "aft" && resolved.path ? "aft-read" : "fake",
			aft_binary_version: AFT_BINARY_VERSION,
			availability: { ...this.availability },
			reason_codes,
			warm: true,
			repo_root: this.repoRoot,
		};
	}

	search(query: string, opts: SearchOptions = {}): IntelResult {
		const mode = opts.mode ?? "both";
		const reasons = this.collectHealthCodes();
		if (this.availability.index === "unavailable") {
			return this.partial([], [...reasons, INTEL_INDEX_UNAVAILABLE]);
		}
		const q = query.trim().toLowerCase();
		const hits: IntelHit[] = [];
		for (const doc of this.docs) {
			const symbols = extractSymbols(doc);
			for (const sym of symbols) {
				if (sym.toLowerCase() === q) {
					hits.push(
						hit({
							kind: "exact_symbol",
							path: doc.path,
							snippet: this.snippetAround(doc.text, sym),
							symbol: sym,
							language: doc.language,
							score: 100,
						}),
					);
				}
			}
			if (mode !== "semantic" && doc.text.toLowerCase().includes(q) && q.length > 0) {
				hits.push(
					hit({
						kind: "lexical_exact",
						path: doc.path,
						snippet: this.snippetAround(doc.text, query),
						language: doc.language,
						score: 80,
					}),
				);
			}
			if (mode !== "lexical" && this.availability.embeddings === "ok") {
				const tokens = q.split(/\s+/).filter(Boolean);
				const overlap = tokens.filter((t) => doc.text.toLowerCase().includes(t)).length;
				if (overlap > 0 && tokens.length > 0) {
					hits.push(
						hit({
							kind: "semantic",
							path: doc.path,
							snippet: doc.text.slice(0, 160),
							language: doc.language,
							score: 60 * (overlap / tokens.length),
						}),
					);
				}
			}
		}
		if (mode !== "lexical" && this.availability.embeddings !== "ok") {
			reasons.push(INTEL_EMBEDDINGS_UNAVAILABLE);
		}
		if (this.availability.aft !== "ok") {
			reasons.push(INTEL_AFT_UNAVAILABLE);
		}
		return this.withFallback(uniqueHits(hits), reasons);
	}

	outline(path: string): IntelResult & { outline: OutlineNode[] } {
		const reasons = this.collectHealthCodes();
		if (this.availability.lsp !== "ok") {
			reasons.push(INTEL_LSP_UNAVAILABLE);
		}
		const doc = this.docs.find((d) => d.path === path.replaceAll("\\", "/"));
		const outline: OutlineNode[] = doc
			? extractSymbols(doc).map((name) => ({ name, kind: "symbol" }))
			: [];
		const hits = outline.map((n) =>
			hit({
				kind: "exact_symbol",
				path,
				snippet: n.name,
				symbol: n.name,
				score: 100,
			}),
		);
		const base = this.withFallback(hits, reasons);
		return { ...base, outline };
	}

	symbol(name: string): IntelResult {
		return this.search(name, { mode: "lexical" });
	}

	references(symbol: string): IntelResult {
		const reasons = this.collectHealthCodes();
		const hits: IntelHit[] = [];
		for (const doc of this.docs) {
			if (!doc.text.includes(symbol)) {
				continue;
			}
			hits.push(
				hit({
					kind: "lexical_exact",
					path: doc.path,
					snippet: this.snippetAround(doc.text, symbol),
					symbol,
					language: doc.language,
					score: 80,
				}),
			);
		}
		return this.withFallback(uniqueHits(hits), reasons);
	}

	callers(symbol: string): IntelResult {
		return this.graph(symbol, "callers");
	}

	callees(symbol: string): IntelResult {
		return this.graph(symbol, "callees");
	}

	impact(symbol: string): IntelResult {
		const reasons = this.collectHealthCodes();
		const refs = this.references(symbol).hits;
		const tests = this.docs.filter(
			(d) => /test/i.test(d.path) && (d.text.includes(symbol) || (d.tests ?? []).includes(symbol)),
		);
		const hits = [
			...refs.map((h) => ({ ...h, kind: "graph_edge" as const, score: 50 })),
			...tests.map((d) =>
				hit({
					kind: "tests",
					path: d.path,
					snippet: d.text.slice(0, 160),
					symbol,
					language: d.language,
					score: 40,
				}),
			),
		];
		return this.withFallback(uniqueHits(hits), reasons);
	}

	diagnostics(path?: string): IntelResult {
		const reasons = this.collectHealthCodes();
		if (this.availability.lsp !== "ok") {
			reasons.push(INTEL_LSP_UNAVAILABLE);
		}
		const docs = path ? this.docs.filter((d) => d.path === path) : this.docs;
		const hits = docs
			.filter((d) => /TODO|FIXME/.test(d.text))
			.map((d) =>
				hit({
					kind: "artifact",
					path: d.path,
					snippet: this.snippetAround(d.text, "TODO") || d.text.slice(0, 80),
					language: d.language,
					score: 20,
				}),
			);
		return this.withFallback(hits, reasons);
	}

	refresh(changes?: string[]): RefreshResult {
		this.generation += 1;
		this.refreshTriggered = true;
		if (this.availability.index === "stale") {
			this.availability = { ...this.availability, index: "ok" };
		}
		if (changes && changes.length > 0 && existsSync(this.repoRoot)) {
			for (const rel of changes) {
				const abs = join(this.repoRoot, rel);
				if (!existsSync(abs)) {
					this.docs = this.docs.filter((d) => d.path !== rel.replaceAll("\\", "/"));
					continue;
				}
				try {
					const text = readFileSync(abs, "utf8");
					const path = rel.replaceAll("\\", "/");
					const next: IndexedDoc = {
						path,
						text,
						language: languageOf(path),
						mtime: Date.now(),
					};
					const idx = this.docs.findIndex((d) => d.path === path);
					if (idx >= 0) {
						this.docs[idx] = next;
					} else {
						this.docs.push(next);
					}
				} catch {
					// skip; never read .env
				}
			}
		} else if (existsSync(this.repoRoot)) {
			this.docs = walkDocs(this.repoRoot);
		}
		return {
			hits: this.docs.map((d) =>
				hit({ kind: "artifact", path: d.path, snippet: d.path, score: 1 }),
			),
			reason_codes: this.collectHealthCodes(),
			partial: this.collectHealthCodes().length > 0,
			refreshed: true,
			changed_paths: changes ?? this.docs.map((d) => d.path),
			index_generation: this.generation,
		};
	}

	invokeRaw(method: string, _params?: Record<string, unknown>): IntelResult {
		if (isAftMutationMethod(method)) {
			return denyMutation(method);
		}
		if (this.availability.aft !== "ok") {
			return this.partial([], [INTEL_AFT_UNAVAILABLE]);
		}
		return { hits: [], reason_codes: [], partial: false };
	}

	didTriggerRefresh(): boolean {
		return this.refreshTriggered;
	}

	private graph(symbol: string, dir: "callers" | "callees"): IntelResult {
		const reasons = this.collectHealthCodes();
		const hits: IntelHit[] = [];
		for (const doc of this.docs) {
			const map = dir === "callers" ? doc.callers : doc.callees;
			const edges = map?.[symbol] ?? [];
			for (const other of edges) {
				hits.push(
					hit({
						kind: "graph_edge",
						path: doc.path,
						snippet: `${dir}:${symbol}->${other}`,
						symbol: other,
						language: doc.language,
						score: 50,
					}),
				);
			}
			if (edges.length === 0 && doc.text.includes(symbol)) {
				hits.push(
					hit({
						kind: "graph_edge",
						path: doc.path,
						snippet: this.snippetAround(doc.text, symbol),
						symbol,
						language: doc.language,
						score: 50,
					}),
				);
			}
		}
		return this.withFallback(uniqueHits(hits), reasons);
	}

	private collectHealthCodes(): string[] {
		const codes: string[] = [];
		if (this.availability.aft !== "ok") {
			codes.push(INTEL_AFT_UNAVAILABLE);
		}
		if (this.availability.index === "stale") {
			codes.push(INTEL_INDEX_STALE);
		}
		if (this.availability.index === "unavailable") {
			codes.push(INTEL_INDEX_UNAVAILABLE);
		}
		return codes;
	}

	private withFallback(hits: IntelHit[], reasons: string[]): IntelResult {
		const uniqueReasons = [...new Set(reasons)];
		let next = hits;
		if (next.length === 0) {
			next = this.docs.slice(0, 4).map((d) =>
				hit({
					kind: "artifact",
					path: d.path,
					snippet: d.text.slice(0, 120),
					language: d.language,
					score: 10,
				}),
			);
			if (next.length === 0 && uniqueReasons.length === 0) {
				uniqueReasons.push(INTEL_INDEX_UNAVAILABLE);
			}
		}
		return {
			hits: next,
			reason_codes: uniqueReasons,
			partial: uniqueReasons.length > 0,
		};
	}

	private partial(hits: IntelHit[], reasons: string[]): IntelResult {
		return this.withFallback(hits, reasons);
	}

	private snippetAround(text: string, needle: string): string {
		const idx = text.toLowerCase().indexOf(needle.toLowerCase());
		if (idx < 0) {
			return text.slice(0, 120);
		}
		const start = Math.max(0, idx - 40);
		return text.slice(start, start + 160);
	}
}

export function createCodeIntelligenceProvider(
	options: ProviderOptions,
): DefaultCodeIntelligenceProvider {
	return new DefaultCodeIntelligenceProvider(options);
}
