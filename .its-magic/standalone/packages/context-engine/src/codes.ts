export const CONTEXT_EXCLUSION = "CONTEXT_EXCLUSION";
export const CONTEXT_BUDGET = "CONTEXT_BUDGET";

export const RANK_WEIGHTS = {
	exact_symbol: 100,
	lexical_exact: 80,
	semantic: 60,
	graph_edge: 50,
	tests: 40,
	git_recency: 30,
	active_ac: 25,
	architecture_decision: 20,
	artifact: 10,
} as const;

export const MMR_LAMBDA = 0.7;

export type TokenProfile = "lean" | "balanced" | "full";

export const TOKEN_PROFILE_CAPS: Record<
	TokenProfile,
	{ tokens: number; files: number; hits: number }
> = {
	lean: { tokens: 6000, files: 8, hits: 16 },
	balanced: { tokens: 12000, files: 16, hits: 32 },
	full: { tokens: 24000, files: 32, hits: 64 },
};

export const SOVEREIGN_DIGEST_TOKEN_CAP = 1500;
