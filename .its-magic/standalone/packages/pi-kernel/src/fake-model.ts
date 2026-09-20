import type { AssistantMessage, Model } from "@earendil-works/pi-ai";
import { AssistantMessageEventStream } from "@earendil-works/pi-ai/utils/event-stream";
import { ITSM_PING_TOOL_NAME } from "./types.ts";

export type FakeRuntimeMode = "ping" | "hang" | "idle";

function emptyUsage() {
	return {
		input: 0,
		output: 0,
		cacheRead: 0,
		cacheWrite: 0,
		totalTokens: 0,
		cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, total: 0 },
	};
}

export function createFakeModel(): Model<"openai-completions"> {
	return {
		id: "itsm-fake-ping",
		name: "itsm-fake-ping",
		api: "openai-completions",
		provider: "openai",
		baseUrl: "http://127.0.0.1:9",
		reasoning: false,
		input: ["text"],
		cost: {
			input: 0,
			output: 0,
			cacheRead: 0,
			cacheWrite: 0,
		},
		contextWindow: 8192,
		maxTokens: 256,
	};
}

function assistantMessage(
	content: AssistantMessage["content"],
	stopReason: AssistantMessage["stopReason"],
): AssistantMessage {
	return {
		role: "assistant",
		content,
		api: "openai-completions",
		provider: "openai",
		model: "itsm-fake-ping",
		usage: emptyUsage(),
		stopReason,
		timestamp: Date.now(),
	};
}

/**
 * Duck-typed ModelRuntime: only streamSimple is required for the Agent streamFn.
 * Extra methods exist so AgentSession extension hooks do not throw.
 */
export function createFakeModelRuntime(mode: FakeRuntimeMode = "ping"): unknown {
	let pingTurns = 0;

	const runtime = {
		streamSimple(_model: unknown, _context: unknown, options?: { signal?: AbortSignal }) {
			const stream = new AssistantMessageEventStream();
			const signal = options?.signal;

			if (mode === "hang") {
				const onAbort = () => {
					const error = assistantMessage([], "aborted");
					error.errorMessage = "aborted";
					stream.push({ type: "error", reason: "aborted", error });
				};
				if (signal?.aborted) {
					onAbort();
				} else {
					signal?.addEventListener("abort", onAbort, { once: true });
				}
				setTimeout(onAbort, 1500);
				return stream;
			}

			queueMicrotask(() => {
				if (signal?.aborted) {
					const error = assistantMessage([], "aborted");
					error.errorMessage = "aborted";
					stream.push({ type: "error", reason: "aborted", error });
					return;
				}
				if (mode === "idle" || pingTurns > 0) {
					const message = assistantMessage([{ type: "text", text: "ok" }], "stop");
					stream.push({ type: "start", partial: message });
					stream.push({ type: "done", reason: "stop", message });
					return;
				}
				pingTurns += 1;
				const toolCall = {
					type: "toolCall" as const,
					id: "call_itsm_ping_1",
					name: ITSM_PING_TOOL_NAME,
					arguments: {},
				};
				const message = assistantMessage([toolCall], "toolUse");
				stream.push({ type: "start", partial: message });
				stream.push({
					type: "toolcall_start",
					contentIndex: 0,
					partial: message,
				});
				stream.push({
					type: "toolcall_end",
					contentIndex: 0,
					toolCall,
					partial: message,
				});
				stream.push({ type: "done", reason: "toolUse", message });
			});
			return stream;
		},
		getModel() {
			return createFakeModel();
		},
		hasConfiguredAuth() {
			return true;
		},
		registerNativeProvider() {},
		unregisterProvider() {},
		registerProvider() {},
	};
	return runtime;
}
