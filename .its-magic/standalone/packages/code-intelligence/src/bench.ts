import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { AFT_BINARY_VERSION } from "./aft/version.ts";
import { createCodeIntelligenceProvider } from "./provider.ts";
import type { IndexedDoc, IntelResult } from "./types.ts";

export interface BenchMetric {
	name: string;
	ok: boolean;
	latency_ms: number;
	hit_count: number;
	token_estimate: number;
}

export interface BenchReport {
	metrics: BenchMetric[];
	aft_binary_version: string;
	fake_model: true;
	fake_aft: true;
	its_indexd_out: true;
}

const FIXTURE_DOCS: IndexedDoc[] = [
	{
		path: "src/app.ts",
		text: "export function greet(name: string) { return helper(name); }\n",
		language: "typescript",
		symbols: ["greet"],
		callees: { greet: ["helper"] },
	},
	{
		path: "src/helper.ts",
		text: "export function helper(name: string) { return name; }\n",
		language: "typescript",
		symbols: ["helper"],
		callers: { helper: ["greet"] },
	},
	{
		path: "src/lib.rs",
		text: "pub fn greet(name: &str) -> String { name.to_string() }\n",
		language: "rust",
		symbols: ["greet"],
	},
	{
		path: "src/util.py",
		text: "def greet(name):\n    return name\n",
		language: "python",
		symbols: ["greet"],
	},
	{
		path: "tests/app.test.ts",
		text: "import { greet } from '../src/app.ts';\ntest('greet', () => greet('x'));\n",
		language: "typescript",
		symbols: ["greet"],
		tests: ["greet"],
	},
	{
		path: "packages/a/index.ts",
		text: "export const pkgA = 1;\n",
		language: "typescript",
		symbols: ["pkgA"],
	},
	{
		path: "packages/b/index.ts",
		text: "export const pkgB = 2;\n",
		language: "typescript",
		symbols: ["pkgB"],
	},
];

function estimateTokens(result: IntelResult): number {
	return result.hits.reduce((n, h) => n + Math.ceil(h.snippet.length / 4), 0);
}

function timeCall(name: string, fn: () => IntelResult): BenchMetric {
	const started = Date.now();
	const result = fn();
	return {
		name,
		ok: result.hits.length > 0,
		latency_ms: Date.now() - started,
		hit_count: result.hits.length,
		token_estimate: estimateTokens(result),
	};
}

export function itsIndexdIsOut(repoRoot: string): boolean {
	return !existsSync(join(repoRoot, "crates", "its-indexd"));
}

export function runCodeIntelBench(options?: {
	repoRoot?: string;
	docs?: IndexedDoc[];
}): BenchReport {
	const provider = createCodeIntelligenceProvider({
		repoRoot: options?.repoRoot ?? "/tmp/code-intel-fixture",
		adapter: "fake",
		docs: options?.docs ?? FIXTURE_DOCS,
	});
	const metrics: BenchMetric[] = [
		timeCall("nl_lookup", () => provider.search("greet people by name", { mode: "both" })),
		timeCall("exact_symbol", () => provider.symbol("greet")),
		timeCall("callers", () => provider.callers("helper")),
		timeCall("tests", () => provider.impact("greet")),
		timeCall("impact", () => provider.impact("greet")),
		timeCall("cross_language_ref", () => provider.references("greet")),
		timeCall("recent_changes", () => {
			provider.refresh(["src/app.ts"]);
			return provider.search("greet");
		}),
		timeCall("monorepo_latency", () => provider.search("pkgA")),
		timeCall("token_use", () => provider.search("greet")),
		timeCall("stale_index_recovery", () => {
			provider.setAvailability({ index: "stale" });
			const before = provider.search("greet");
			provider.refresh(["src/app.ts"]);
			return before.reason_codes.includes("INTEL_INDEX_STALE") ? provider.search("greet") : before;
		}),
	];
	return {
		metrics,
		aft_binary_version: AFT_BINARY_VERSION,
		fake_model: true,
		fake_aft: true,
		its_indexd_out: true,
	};
}

export function fixtureRootFromImportMeta(metaUrl: string): string {
	return join(dirname(fileURLToPath(metaUrl)), "..", "..", "tests", "fixtures", "code-intel");
}
