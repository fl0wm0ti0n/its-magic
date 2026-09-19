export type AuthType = "oauth" | "api_key";

export type ThinkingLevel = "off" | "minimal" | "low" | "medium" | "high" | "xhigh" | "max";

export const THINKING_LEVELS: readonly ThinkingLevel[] = [
	"off",
	"minimal",
	"low",
	"medium",
	"high",
	"xhigh",
	"max",
];

export type ResolveSource =
	| "cli"
	| "phase-local"
	| "role-catalog"
	| "critic-overlay"
	| "tier-catalog"
	| "runtime-default";

export interface AuthInteraction {
	prompt: (p: {
		type: "text" | "secret" | "select" | "manual_code";
		message: string;
		options?: { id: string; label: string }[];
		signal?: AbortSignal;
	}) => Promise<string | undefined>;
	notify: (event: {
		type: "info" | "auth_url" | "device_code" | "progress";
		url?: string;
		userCode?: string;
		verificationUri?: string;
		message?: string;
	}) => void;
	signal?: AbortSignal;
}

export interface AuthRuntimePort {
	createRuntime(opts: {
		authPath: string;
		modelsPath: string;
		credentials?: unknown;
		allowModelNetwork?: boolean;
	}): Promise<void>;
	login(providerId: string, type: AuthType, interaction: AuthInteraction): Promise<void>;
	logout(providerId: string): Promise<void>;
	checkAuth(providerId: string, opts?: { refresh?: boolean }): Promise<{ type: AuthType } | null>;
	registerProvider(name: string, config: unknown): void;
	getModel(provider: string, model: string): unknown | null;
}

export interface ModelResolveProvenance {
	source: ResolveSource;
	slug: string;
	provider: string;
	model: string;
	thinkingLevel: ThinkingLevel;
	criticPin: boolean;
	degradedMode: boolean;
	thinkingClamped: boolean;
	thinkingForced?: boolean;
	degradedReason?: string;
}

export type ThinkingLevelMap = Partial<Record<ThinkingLevel, boolean | null>>;

export interface StandaloneCatalog {
	schema_version: number;
	tiers?: { cheap?: string; balanced?: string; strong?: string };
	roles?: Record<string, string | { slug: string; thinking?: ThinkingLevel }>;
	phases?: Record<string, string | { slug: string; thinking?: ThinkingLevel }>;
	critic?: { model?: string };
	thinking?: Record<string, ThinkingLevel>;
	default?: string;
	available?: string[];
	thinkingLevelMaps?: Record<string, ThinkingLevelMap>;
}

export interface ModelRouterResolveInput {
	argvSlug?: string;
	phase?: string;
	role?: string;
	criticResolve?: boolean;
	criticOverlaySlug?: string;
	producerSlug?: string;
	catalog: StandaloneCatalog;
	runtimeDefaultSlug?: string;
	requestedThinking?: ThinkingLevel;
	tokenProfile?: string;
}

export interface ModelRouter {
	resolve(input: ModelRouterResolveInput): {
		slug: string;
		thinkingLevel: ThinkingLevel;
		provenance: ModelResolveProvenance;
	};
}

export const FAKE_MODEL_SLUG = "openai/itsm-fake-ping";
export const CURSOR_ALIAS_SLUGS = new Set(["fast", "inherit"]);

export const BUILTIN_OAUTH_PROVIDERS = ["openai-codex"] as const;
export const BUILTIN_API_KEY_PROVIDERS = ["openai", "anthropic", "google", "openrouter"] as const;
export const CHINESE_API_KEY_PROVIDERS = [
	"deepseek",
	"kimi-coding",
	"zai",
	"zai-coding-cn",
	"minimax",
	"minimax-cn",
] as const;
export const QWEN_TOKEN_PLAN_PREFIX = "qwen-token-plan";
export const LOCAL_OPENAI_COMPAT_PROVIDERS = ["ollama", "lmstudio", "vllm"] as const;

export const KNOWN_PROVIDER_IDS: readonly string[] = [
	...BUILTIN_OAUTH_PROVIDERS,
	...BUILTIN_API_KEY_PROVIDERS,
	...CHINESE_API_KEY_PROVIDERS,
	...LOCAL_OPENAI_COMPAT_PROVIDERS,
];
