export type { AftResolveResult, AftResolveSource } from "./aft/index.ts";
export { denyMutation, invokeAftSidecar, resolveAftBinary, shutdownAftPool } from "./aft/index.ts";
export { AFT_BINARY_VERSION } from "./aft/version.ts";
export type { BenchMetric, BenchReport } from "./bench.ts";
export {
	fixtureRootFromImportMeta,
	itsIndexdIsOut,
	runCodeIntelBench,
} from "./bench.ts";
export {
	AFT_MUTATION_METHODS,
	INTEL_AFT_UNAVAILABLE,
	INTEL_EMBEDDINGS_UNAVAILABLE,
	INTEL_INDEX_STALE,
	INTEL_INDEX_UNAVAILABLE,
	INTEL_LSP_UNAVAILABLE,
	INTEL_MUTATION_DENIED,
	isAftMutationMethod,
} from "./codes.ts";
export { createCodeIntelligenceProvider, DefaultCodeIntelligenceProvider } from "./provider.ts";
export type {
	BackendHealth,
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
