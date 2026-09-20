export const INTEL_AFT_UNAVAILABLE = "INTEL_AFT_UNAVAILABLE";
export const INTEL_LSP_UNAVAILABLE = "INTEL_LSP_UNAVAILABLE";
export const INTEL_EMBEDDINGS_UNAVAILABLE = "INTEL_EMBEDDINGS_UNAVAILABLE";
export const INTEL_INDEX_STALE = "INTEL_INDEX_STALE";
export const INTEL_INDEX_UNAVAILABLE = "INTEL_INDEX_UNAVAILABLE";
export const INTEL_MUTATION_DENIED = "INTEL_MUTATION_DENIED";

export const AFT_MUTATION_METHODS = [
	"write",
	"edit",
	"apply_patch",
	"aft_delete",
	"aft_move",
	"aft_transform",
	"aft_refactor",
	"ast_grep_replace",
] as const;

export type AftMutationMethod = (typeof AFT_MUTATION_METHODS)[number];

export function isAftMutationMethod(name: string): name is AftMutationMethod {
	return (AFT_MUTATION_METHODS as readonly string[]).includes(name);
}
