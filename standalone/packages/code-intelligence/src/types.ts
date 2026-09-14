export type BackendHealth = "ok" | "unavailable" | "stale";

export interface ProviderAvailability {
	aft: BackendHealth;
	lsp: BackendHealth;
	embeddings: BackendHealth;
	index: BackendHealth;
}

export interface ProviderStatus {
	backend: "aft-read" | "fake";
	aft_binary_version: string;
	availability: ProviderAvailability;
	reason_codes: string[];
	warm: boolean;
	repo_root: string;
}

export interface IntelHit {
	id: string;
	kind:
		| "exact_symbol"
		| "lexical_exact"
		| "semantic"
		| "graph_edge"
		| "tests"
		| "git_recency"
		| "active_ac"
		| "architecture_decision"
		| "artifact";
	path: string;
	start?: number;
	end?: number;
	snippet: string;
	symbol?: string;
	score: number;
	language?: string;
}

export interface IntelResult {
	hits: IntelHit[];
	reason_codes: string[];
	partial: boolean;
	refreshed?: boolean;
}

export interface OutlineNode {
	name: string;
	kind: string;
	start?: number;
	end?: number;
}

export interface SearchOptions {
	mode?: "lexical" | "semantic" | "both";
}

export interface RefreshResult extends IntelResult {
	changed_paths: string[];
	index_generation: number;
}

export interface CodeIntelligenceProvider {
	status(): ProviderStatus;
	search(query: string, opts?: SearchOptions): IntelResult;
	outline(path: string): IntelResult & { outline: OutlineNode[] };
	symbol(name: string): IntelResult;
	references(symbol: string): IntelResult;
	callers(symbol: string): IntelResult;
	callees(symbol: string): IntelResult;
	impact(symbol: string): IntelResult;
	diagnostics(path?: string): IntelResult;
	refresh(changes?: string[]): RefreshResult;
	invokeRaw(method: string, params?: Record<string, unknown>): IntelResult;
}

export interface IndexedDoc {
	path: string;
	text: string;
	language?: string;
	symbols?: string[];
	callers?: Record<string, string[]>;
	callees?: Record<string, string[]>;
	tests?: string[];
	mtime?: number;
}

export interface ProviderOptions {
	repoRoot: string;
	adapter?: "fake" | "aft";
	agentDir?: string;
	docs?: IndexedDoc[];
	availability?: Partial<ProviderAvailability>;
	binaryPath?: string;
}
