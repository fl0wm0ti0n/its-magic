/**
 * Structural port of `@its-magic/pi-kernel` AgentKernel / KernelSession.
 * Type-only: role-runtime never imports Pi modules (DEC-0136 §2).
 */

export type IsolationMode = "off" | "trusted";

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
	model?: unknown;
	modelRuntime?: unknown;
	projectCwd?: string;
	thinkingLevel?: string;
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
