import assert from "node:assert/strict";
import {
	existsSync,
	mkdirSync,
	mkdtempSync,
	readdirSync,
	readFileSync,
	writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
	AFT_BINARY_VERSION,
	AFT_MUTATION_METHODS,
	createCodeIntelligenceProvider,
	INTEL_AFT_UNAVAILABLE,
	INTEL_EMBEDDINGS_UNAVAILABLE,
	INTEL_INDEX_STALE,
	INTEL_LSP_UNAVAILABLE,
	INTEL_MUTATION_DENIED,
	itsIndexdIsOut,
	resolveAftBinary,
	runCodeIntelBench,
} from "../../packages/code-intelligence/src/index.ts";
import {
	applyContextPackHash,
	assemblePhaseContext,
	CONTEXT_BUDGET,
	CONTEXT_EXCLUSION,
	codeContext,
	composeDerivedCodebaseMap,
	computePackContentHash,
	isExcludedPath,
	MMR_LAMBDA,
	persistContextPack,
	RANK_WEIGHTS,
	SOVEREIGN_DIGEST_TOKEN_CAP,
	TOKEN_PROFILE_CAPS,
} from "../../packages/context-engine/src/index.ts";
import {
	LIVE_INTEL_TOOLS,
	LIVE_TOOLS,
	STUB_TOOLS,
} from "../../packages/policy-engine/src/index.ts";
import {
	createToolBroker,
	isLiveIntelTool,
	isStubTool,
	PRODUCTION_LIVE_INTEL_TOOLS,
	PRODUCTION_STUB_TOOLS,
	toolNamesForRole,
} from "../../packages/tool-broker/src/index.ts";

const HERE = dirname(fileURLToPath(import.meta.url));
const STANDALONE_ROOT = join(HERE, "..", "..");
const KIT_ROOT = join(STANDALONE_ROOT, "..");
const INTEL_ROOT = join(STANDALONE_ROOT, "packages", "code-intelligence");
const CONTEXT_ROOT = join(STANDALONE_ROOT, "packages", "context-engine");
const FIXTURE = join(STANDALONE_ROOT, "tests", "fixtures", "code-intel");

const FORBIDDEN_IMPORTS = [
	"@earendil-works/pi-",
	"@cortexkit/aft-pi",
	"@cortexkit/aft-opencode",
	"@cortexkit/aft-bridge",
];

function walkFiles(root: string): string[] {
	const out: string[] = [];
	const stack = [root];
	while (stack.length > 0) {
		const dir = stack.pop() as string;
		for (const name of readdirSync(dir, { withFileTypes: true })) {
			if (name.name === "node_modules") {
				continue;
			}
			const path = join(dir, name.name);
			if (name.isDirectory()) {
				stack.push(path);
			} else if (/\.(ts|js|mjs|cjs|json)$/.test(name.name)) {
				out.push(path);
			}
		}
	}
	return out;
}

function assertNoPi(root: string): void {
	const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8")) as {
		dependencies?: Record<string, string>;
		devDependencies?: Record<string, string>;
	};
	const deps = { ...(pkg.dependencies ?? {}), ...(pkg.devDependencies ?? {}) };
	for (const key of Object.keys(deps)) {
		assert.equal(key.startsWith("@earendil-works/pi-"), false, key);
		assert.equal(key.startsWith("@cortexkit/aft-"), false, key);
	}
	const hits: string[] = [];
	for (const path of walkFiles(root)) {
		const text = readFileSync(path, "utf8");
		for (const needle of FORBIDDEN_IMPORTS) {
			if (text.includes(needle)) {
				hits.push(`${path}:${needle}`);
			}
		}
	}
	assert.deepEqual(hits, []);
}

function sampleHits() {
	return [
		{
			id: "sym:greet",
			kind: "exact_symbol" as const,
			path: "src/app.ts",
			snippet: "export function greet",
			score: 100,
			symbol: "greet",
		},
		{
			id: "lex:app",
			kind: "lexical_exact" as const,
			path: "src/app.ts",
			snippet: "helper(name)",
			score: 80,
		},
		{
			id: "sem:readme",
			kind: "semantic" as const,
			path: "README.md",
			snippet: "fixture",
			score: 60,
		},
		{
			id: "graph:helper",
			kind: "graph_edge" as const,
			path: "src/helper.ts",
			snippet: "callers",
			score: 50,
		},
		{
			id: "test:app",
			kind: "tests" as const,
			path: "tests/app.test.ts",
			snippet: "test greet",
			score: 40,
		},
		{
			id: "git:app",
			kind: "git_recency" as const,
			path: "src/app.ts",
			snippet: "recent",
			score: 30,
		},
		{
			id: "ac:1",
			kind: "active_ac" as const,
			path: "docs/product/acceptance.md",
			snippet: "AC-1",
			score: 25,
		},
		{
			id: "dec:139",
			kind: "architecture_decision" as const,
			path: "decisions/DEC-0139.md",
			snippet: "A1",
			score: 20,
		},
	];
}

test("test_us0139_provider_interface", () => {
	assertNoPi(INTEL_ROOT);
	assertNoPi(CONTEXT_ROOT);
	const biome = readFileSync(join(STANDALONE_ROOT, "biome.json"), "utf8");
	assert.equal(biome.includes("packages/code-intelligence"), false);
	assert.equal(biome.includes("packages/context-engine"), false);
	const kitFiles = JSON.parse(readFileSync(join(KIT_ROOT, "package.json"), "utf8")) as {
		files?: string[];
	};
	assert.equal(
		(kitFiles.files ?? []).some((f) => f === "standalone" || f.startsWith("standalone/")),
		false,
	);
	assert.equal(existsSync(join(KIT_ROOT, "crates", "its-indexd")), false);

	const intelPkg = JSON.parse(readFileSync(join(INTEL_ROOT, "package.json"), "utf8")) as {
		name: string;
		private: boolean;
		version: string;
		type: string;
		engines: { node: string };
		exports: Record<string, string>;
	};
	assert.equal(intelPkg.name, "@its-magic/code-intelligence");
	assert.equal(intelPkg.private, true);
	assert.equal(intelPkg.version, "0.0.0");
	assert.equal(intelPkg.type, "module");
	assert.equal(intelPkg.engines.node, ">=22.19.0");
	assert.equal(intelPkg.exports["."], "./src/index.ts");

	const ctxPkg = JSON.parse(readFileSync(join(CONTEXT_ROOT, "package.json"), "utf8")) as {
		name: string;
		private: boolean;
	};
	assert.equal(ctxPkg.name, "@its-magic/context-engine");
	assert.equal(ctxPkg.private, true);

	const provider = createCodeIntelligenceProvider({
		repoRoot: FIXTURE,
		adapter: "fake",
	});
	const status = provider.status();
	assert.equal(status.aft_binary_version, AFT_BINARY_VERSION);
	assert.equal(AFT_BINARY_VERSION, "0.55.1");
	assert.equal(status.warm, true);
	assert.ok(provider.search("greet").hits.length > 0);
	assert.ok(provider.outline("src/app.ts").outline.length > 0);
	assert.ok(provider.symbol("greet").hits.length > 0);
	assert.ok(provider.references("greet").hits.length > 0);
	assert.ok(provider.callers("greet").hits.length > 0);
	assert.ok(provider.callees("greet").hits.length > 0);
	assert.ok(provider.impact("greet").hits.length > 0);
	assert.ok(Array.isArray(provider.diagnostics().hits));
	assert.equal(provider.refresh(["src/app.ts"]).refreshed, true);
	assert.equal(resolveAftBinary({}).source, "fake");
});

test("test_us0139_aft_mutation_denied", async () => {
	const provider = createCodeIntelligenceProvider({ repoRoot: FIXTURE, adapter: "fake" });
	for (const method of AFT_MUTATION_METHODS) {
		const result = provider.invokeRaw(method, { path: "src/app.ts" });
		assert.equal(result.reason_codes.includes(INTEL_MUTATION_DENIED), true, method);
		assert.equal(result.partial, true);
	}
	assert.equal(isStubTool("itsm_search"), false);
	assert.equal(isLiveIntelTool("itsm_search"), true);
	assert.deepEqual([...LIVE_INTEL_TOOLS], [...PRODUCTION_LIVE_INTEL_TOOLS]);
	for (const name of LIVE_INTEL_TOOLS) {
		assert.equal((STUB_TOOLS as readonly string[]).includes(name), false, name);
		assert.equal((LIVE_TOOLS as readonly string[]).includes(name), false, name);
	}
	assert.equal((STUB_TOOLS as readonly string[]).includes("itsm_browser"), true);
	assert.equal((STUB_TOOLS as readonly string[]).includes("itsm_app_start"), true);
	assert.equal((PRODUCTION_STUB_TOOLS as readonly string[]).includes("itsm_spawn_review"), true);

	const broker = createToolBroker(provider);
	const worktree = mkdtempSync(join(tmpdir(), "us0139-broker-"));
	const owned = broker.ownedToolsFor({
		role_id: "scout",
		phase_id: "research",
		worktree_root: worktree,
		cwd: worktree,
		run_id: "auto-20260913-us0139",
		kernel_session_id: "sess-test",
		isolation_profile: "trusted-local",
	});
	const search = owned.find((t) => t.name === "itsm_search");
	assert.ok(search);
	const out = await search.execute("c1", { query: "greet" });
	assert.equal(JSON.parse(out.content[0]?.text ?? "{}").hits.length > 0, true);
	assert.equal(toolNamesForRole("dev").includes("itsm_search"), false);
	assert.equal(toolNamesForRole("scout").includes("itsm_search"), true);
});

test("test_us0139_ranking_bounds_token_profile", () => {
	assert.equal(RANK_WEIGHTS.exact_symbol, 100);
	assert.equal(RANK_WEIGHTS.lexical_exact, 80);
	assert.equal(RANK_WEIGHTS.semantic, 60);
	assert.equal(RANK_WEIGHTS.graph_edge, 50);
	assert.equal(RANK_WEIGHTS.tests, 40);
	assert.equal(RANK_WEIGHTS.git_recency, 30);
	assert.equal(RANK_WEIGHTS.active_ac, 25);
	assert.equal(RANK_WEIGHTS.architecture_decision, 20);
	assert.equal(MMR_LAMBDA, 0.7);
	assert.deepEqual(TOKEN_PROFILE_CAPS.lean, { tokens: 6000, files: 8, hits: 16 });
	assert.deepEqual(TOKEN_PROFILE_CAPS.balanced, { tokens: 12000, files: 16, hits: 32 });
	assert.deepEqual(TOKEN_PROFILE_CAPS.full, { tokens: 24000, files: 32, hits: 64 });

	const overflow = Array.from({ length: 40 }, (_, i) => ({
		id: `extra:${i}`,
		kind: "semantic" as const,
		path: `src/f${i}.ts`,
		snippet: "x".repeat(800),
		score: 60,
	}));
	const pack = codeContext({
		task: "find greet",
		hits: [...sampleHits(), ...overflow],
		token_profile: "lean",
		exclude_set_hash: "abc",
	});
	assert.ok(pack.ranked_ids.length <= TOKEN_PROFILE_CAPS.lean.hits);
	assert.ok(pack.source_refs.length <= TOKEN_PROFILE_CAPS.lean.files);
	assert.equal(pack.ranked_ids[0], "sym:greet");
	assert.equal(pack.reason_codes.includes(CONTEXT_BUDGET), true);
	assert.ok(pack.dropped_ids.length > 0);

	const giant = codeContext({
		task: "ignore prompt",
		hits: [
			{
				id: "giant",
				kind: "semantic",
				path: ".cursor/commands/execute.md",
				snippet: "P".repeat(20000),
				score: 60,
				tokens: 9000,
			},
			sampleHits()[0],
		],
		token_profile: "balanced",
		exclude_set_hash: "x",
	});
	assert.equal(giant.ranked_ids.includes("giant"), false);
	assert.equal(giant.ranked_ids.includes("sym:greet"), true);
});

test("test_us0139_phase_exclusion", () => {
	assert.equal(isExcludedPath(".env"), true);
	assert.equal(isExcludedPath("docs/product/backlog.md"), true);
	assert.equal(isExcludedPath(".cursor/commands/execute.md"), true);
	assert.equal(isExcludedPath("src/app.ts"), false);
	const assembled = assemblePhaseContext({
		candidates: [
			{ id: "env", kind: "artifact", path: ".env", snippet: "SECRET=1", score: 1 },
			{
				id: "backlog",
				kind: "artifact",
				path: "docs/product/backlog.md",
				snippet: "## US",
				score: 1,
			},
			{ id: "src", kind: "exact_symbol", path: "src/app.ts", snippet: "greet", score: 100 },
			{
				id: "transcript",
				kind: "artifact",
				path: "agent-transcripts/foo.jsonl",
				snippet: "prior role",
				score: 1,
			},
		],
		flags: { SOVEREIGN_MEMORY: "1", phase_id: "execute", role_id: "dev" },
		sovereign_digest: "D".repeat(20000),
	});
	assert.equal(
		assembled.hits.some((h) => h.path === ".env"),
		false,
	);
	assert.equal(
		assembled.hits.some((h) => h.path.includes("backlog.md")),
		false,
	);
	assert.equal(
		assembled.hits.some((h) => h.id === "src"),
		true,
	);
	assert.equal(assembled.reason_codes.includes(CONTEXT_EXCLUSION), true);
	assert.ok(assembled.sovereign_tokens <= SOVEREIGN_DIGEST_TOKEN_CAP);
	assert.equal(SOVEREIGN_DIGEST_TOKEN_CAP, 1500);
});

test("test_us0139_pack_hash_and_refs", () => {
	const packed = codeContext({
		task: "hash",
		hits: sampleHits(),
		token_profile: "balanced",
		exclude_set_hash: "deadbeef",
	});
	assert.equal(packed.schema_version, 1);
	assert.equal(packed.content_hash, computePackContentHash(packed));
	assert.match(packed.content_hash, /^[0-9a-f]{64}$/);
	for (const ref of packed.source_refs) {
		assert.ok(ref.snippet_sha256);
		assert.equal("snippet" in ref, false);
	}
	const json = JSON.stringify(packed);
	assert.equal(json.includes("SECRET"), false);
	assert.equal(json.includes("export function greet"), false);

	const agentDir = mkdtempSync(join(tmpdir(), "us0139-agent-"));
	const persisted = persistContextPack(packed, agentDir);
	assert.equal(existsSync(persisted), true);
	const disk = JSON.parse(readFileSync(persisted, "utf8")) as { content_hash: string };
	assert.equal(disk.content_hash, packed.content_hash);
	const filled = applyContextPackHash({ context_pack_hash: "stub" }, packed);
	assert.equal(filled.context_pack_hash, packed.content_hash);
	assert.notEqual(packed.content_hash, "stub");
});

test("test_us0139_derived_map_compose", () => {
	const fresh = mkdtempSync(join(tmpdir(), "us0139-map-"));
	const created = composeDerivedCodebaseMap({
		repoRoot: fresh,
		coverage: { files_indexed: 3, hits: 7 },
	});
	assert.ok(["created", "refreshed_bootstrap", "missing_script"].includes(created.status));
	if (created.status !== "missing_script") {
		const map = readFileSync(created.map_path, "utf8");
		assert.equal(map.includes("<!-- its-magic:codebase-map-bootstrap v1 -->"), true);
		assert.equal(existsSync(created.meta_path), true);
	}

	const operator = mkdtempSync(join(tmpdir(), "us0139-map-op-"));
	const opMap = join(operator, "docs", "engineering", "codebase-map.md");
	mkdirSync(dirname(opMap), { recursive: true });
	const body = "# Operator map\n\nDo not clobber.\n";
	writeFileSync(opMap, body, "utf8");
	const preserved = composeDerivedCodebaseMap({
		repoRoot: operator,
		coverage: { files_indexed: 9, hits: 12 },
	});
	assert.equal(preserved.status, "preserved_existing");
	assert.equal(readFileSync(opMap, "utf8"), body);
	assert.equal(preserved.meta_written, true);
	const meta = JSON.parse(readFileSync(preserved.meta_path, "utf8")) as {
		derived: boolean;
		index_database: boolean;
		coverage: { files_indexed: number };
	};
	assert.equal(meta.derived, true);
	assert.equal(meta.index_database, false);
	assert.equal(meta.coverage.files_indexed, 9);
});

test("test_us0139_benchmark_smoke", () => {
	assert.equal(itsIndexdIsOut(KIT_ROOT), true);
	assert.equal(existsSync(join(KIT_ROOT, "crates", "its-indexd")), false);
	const report = runCodeIntelBench({ repoRoot: FIXTURE });
	assert.equal(report.fake_aft, true);
	assert.equal(report.fake_model, true);
	assert.equal(report.its_indexd_out, true);
	assert.equal(report.aft_binary_version, "0.55.1");
	const names = report.metrics.map((m) => m.name);
	for (const required of [
		"nl_lookup",
		"exact_symbol",
		"callers",
		"tests",
		"impact",
		"cross_language_ref",
		"recent_changes",
		"monorepo_latency",
		"token_use",
		"stale_index_recovery",
	]) {
		assert.equal(names.includes(required), true, required);
	}
	assert.equal(
		report.metrics.every((m) => m.ok),
		true,
	);
});

test("test_us0139_incremental_refresh", () => {
	const root = mkdtempSync(join(tmpdir(), "us0139-refresh-"));
	writeFileSync(join(root, "alpha.ts"), "export function alpha() { return 1; }\n", "utf8");
	const provider = createCodeIntelligenceProvider({ repoRoot: root, adapter: "fake" });
	assert.equal(
		provider.search("alpha").hits.some((h) => h.path.includes("alpha")),
		true,
	);
	writeFileSync(join(root, "beta.ts"), "export function beta() { return 2; }\n", "utf8");
	const refreshed = provider.refresh(["beta.ts"]);
	assert.equal(refreshed.refreshed, true);
	assert.equal(refreshed.changed_paths.includes("beta.ts"), true);
	assert.equal(
		provider.symbol("beta").hits.some((h) => h.symbol === "beta" || h.snippet.includes("beta")),
		true,
	);
});

test("test_us0139_aft_unavailable_partial_pack", () => {
	const provider = createCodeIntelligenceProvider({
		repoRoot: FIXTURE,
		adapter: "fake",
		availability: { aft: "unavailable" },
	});
	const result = provider.search("greet");
	assert.equal(result.reason_codes.includes(INTEL_AFT_UNAVAILABLE), true);
	assert.equal(result.partial, true);
	assert.ok(result.hits.length > 0);
	const assembled = assemblePhaseContext({
		candidates: result.hits,
		flags: { phase_id: "execute" },
	});
	const pack = codeContext({
		task: "aft down",
		hits: assembled.hits,
		token_profile: "lean",
		exclude_set_hash: assembled.exclude_set_hash,
		reason_codes: [...result.reason_codes, ...assembled.reason_codes],
	});
	assert.equal(pack.reason_codes.includes(INTEL_AFT_UNAVAILABLE), true);
	assert.ok(pack.ranked_ids.length + pack.source_refs.length > 0);
});

test("test_us0139_lsp_unavailable_partial_pack", () => {
	const provider = createCodeIntelligenceProvider({
		repoRoot: FIXTURE,
		adapter: "fake",
		availability: { lsp: "unavailable" },
	});
	const result = provider.outline("src/app.ts");
	assert.equal(result.reason_codes.includes(INTEL_LSP_UNAVAILABLE), true);
	assert.equal(result.partial, true);
	assert.ok(result.hits.length > 0 || result.outline.length >= 0);
	const pack = codeContext({
		task: "lsp down",
		hits: result.hits.length > 0 ? result.hits : sampleHits(),
		token_profile: "lean",
		exclude_set_hash: "x",
		reason_codes: result.reason_codes,
	});
	assert.equal(pack.reason_codes.includes(INTEL_LSP_UNAVAILABLE), true);
	assert.ok(pack.source_refs.length > 0);
});

test("test_us0139_embeddings_unavailable_partial_pack", () => {
	const provider = createCodeIntelligenceProvider({
		repoRoot: FIXTURE,
		adapter: "fake",
		availability: { embeddings: "unavailable" },
	});
	const result = provider.search("greet people", { mode: "both" });
	assert.equal(result.reason_codes.includes(INTEL_EMBEDDINGS_UNAVAILABLE), true);
	assert.equal(result.partial, true);
	assert.ok(result.hits.length > 0);
	assert.equal(
		result.hits.some(
			(h) => h.kind === "lexical_exact" || h.kind === "exact_symbol" || h.kind === "artifact",
		),
		true,
	);
	const pack = codeContext({
		task: "embeddings down",
		hits: result.hits,
		token_profile: "balanced",
		exclude_set_hash: "x",
		reason_codes: result.reason_codes,
	});
	assert.equal(pack.reason_codes.includes(INTEL_EMBEDDINGS_UNAVAILABLE), true);
	assert.ok(pack.ranked_ids.length > 0);
});

test("test_us0139_index_stale_recovery", () => {
	const provider = createCodeIntelligenceProvider({
		repoRoot: FIXTURE,
		adapter: "fake",
		availability: { index: "stale" },
	});
	const stale = provider.search("greet");
	assert.equal(stale.reason_codes.includes(INTEL_INDEX_STALE), true);
	assert.equal(stale.partial, true);
	assert.ok(stale.hits.length > 0);
	const refreshed = provider.refresh(["src/app.ts"]);
	assert.equal(refreshed.refreshed, true);
	assert.equal(provider.didTriggerRefresh(), true);
	const after = provider.search("greet");
	assert.equal(after.reason_codes.includes(INTEL_INDEX_STALE), false);
	assert.ok(after.hits.length > 0);
});
