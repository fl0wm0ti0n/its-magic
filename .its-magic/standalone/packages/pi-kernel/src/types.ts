export type IsolationMode = "off" | "trusted";

export type ThinkingLevel = "off" | "minimal" | "low" | "medium" | "high" | "xhigh" | "max";

export interface KernelRuntimeInfo {
	sessionId: string;
	piCodingAgentVersion: string;
	piAiVersion: string;
	isolationMode: IsolationMode;
	builtinTools: "disabled";
}

export type KernelEvent =
	| { type: "agent_start"; sessionId: string }
	| { type: "tool_execution_start"; sessionId: string; toolName: string }
	| { type: "tool_execution_end"; sessionId: string; toolName: string }
	| { type: "agent_end"; sessionId: string };

export interface OwnedToolDefinition {
	name: string;
	label: string;
	description: string;
	parameters: unknown;
	execute: (
		toolCallId: string,
		params: unknown,
	) => Promise<{ content: Array<{ type: string; text: string }>; details: object }>;
}

export interface KernelCreateSessionOptions {
	isolationMode?: IsolationMode;
	/** Injected no-network Model (tests). Typed unknown so workflow code never imports Pi. */
	model?: unknown;
	/** Injected no-network ModelRuntime (tests). */
	modelRuntime?: unknown;
	/** Target project cwd. US-0133 production loader ignores this (R2 / empty isolation dir). */
	projectCwd?: string;
	/** Session thinking level. Orthogonal to slug and TOKEN_PROFILE. */
	thinkingLevel?: ThinkingLevel;
	/**
	 * Additive owned-tool structs (US-0137). Undefined → kernel-contract itsm_ping fallback.
	 * Empty array → production orchestrator zero tools. Pi builtins at this port fail closed.
	 */
	ownedTools?: OwnedToolDefinition[];
}

export interface KernelSession {
	readonly sessionId: string;
	run(text: string): Promise<void>;
	steer(text: string): Promise<void>;
	abort(): Promise<void>;
	dispose(): void;
	getRuntimeInfo(): KernelRuntimeInfo;
	subscribe(handler: (e: KernelEvent) => void): () => void;
}

export interface AgentKernel {
	createSession(options?: KernelCreateSessionOptions): Promise<KernelSession>;
}

export const ITSM_PING_TOOL_NAME = "itsm_ping" as const;
export const PI_COMPAT_RESOURCES_ENV = "PI_COMPAT_RESOURCES" as const;
export const PINNED_PI_CODING_AGENT = "0.85.1" as const;
export const PINNED_PI_AI = "0.85.1" as const;
export const BUILTIN_MUTATION_TOOLS = ["read", "bash", "edit", "write"] as const;
export const RAW_PI_BUILTIN_TOOLS = [
	"read",
	"bash",
	"edit",
	"write",
	"powershell",
	"grep",
	"find",
	"ls",
] as const;
export const POLICY_RAW_PI_TOOL_DENIED = "POLICY_RAW_PI_TOOL_DENIED";
export const OWNED_TOOL_NAME_RE = /^itsm_[a-z0-9_]+$/;
