export type { AuthServiceOptions } from "./auth-service.ts";
export { AuthService } from "./auth-service.ts";
export { emptyCatalog, loadStandaloneCatalog } from "./catalog.ts";
export type { DispatchDeps } from "./cli.ts";
export { dispatchItsmCommand } from "./cli.ts";
export {
	AUTH_LIVE_FORBIDDEN,
	AUTH_PATH_IN_PROJECT,
	AUTH_SYNC_FAILED,
	AuthModelsError,
	CATALOG_INVALID,
	CATALOG_SECRET_KEY,
	CROSS_MODEL_DEGRADED_MODE,
	MODEL_OVERRIDE_SLUG_UNKNOWN,
	MODEL_ROLE_SLUG_UNKNOWN,
	MODELS_TEST_LIVE_FORBIDDEN,
} from "./errors.ts";
export {
	applyAuthJsonMode,
	assertAuthPathOutsideProject,
	defaultModelsJson,
	ensureOwnedStore,
	ensureOwnedStoreIfAbsent,
	resolveAuthDir,
	resolveOwnedAuthDir,
} from "./paths.ts";
export {
	buildPromptAfterRefresh,
	containsTokenShape,
	redactAudit,
	redactSecretShaped,
} from "./redact.ts";
export { createModelRouter, modelRouter, normalizeSlug, parseSlug, resolve } from "./router.ts";
export { clampThinkingLevel } from "./thinking.ts";
export type {
	AuthInteraction,
	AuthRuntimePort,
	AuthType,
	ModelResolveProvenance,
	ModelRouter,
	ModelRouterResolveInput,
	ResolveSource,
	StandaloneCatalog,
	ThinkingLevel,
	ThinkingLevelMap,
} from "./types.ts";
export {
	BUILTIN_API_KEY_PROVIDERS,
	BUILTIN_OAUTH_PROVIDERS,
	CHINESE_API_KEY_PROVIDERS,
	CURSOR_ALIAS_SLUGS,
	FAKE_MODEL_SLUG,
	KNOWN_PROVIDER_IDS,
	LOCAL_OPENAI_COMPAT_PROVIDERS,
	QWEN_TOKEN_PLAN_PREFIX,
	THINKING_LEVELS,
} from "./types.ts";
