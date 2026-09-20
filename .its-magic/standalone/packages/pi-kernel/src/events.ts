import type { KernelEvent } from "./types.ts";

export interface PiLikeSessionEvent {
	type: string;
	toolName?: string;
}

/**
 * Owned event-bridge: map Pi session events onto the AC-5 KernelEvent subset.
 * Extra Pi events (message_*, turn_*, queue_update) are ignored.
 */
export function mapPiEventToKernelEvent(
	sessionId: string,
	event: PiLikeSessionEvent,
): KernelEvent | undefined {
	switch (event.type) {
		case "agent_start":
			return { type: "agent_start", sessionId };
		case "tool_execution_start":
			return {
				type: "tool_execution_start",
				sessionId,
				toolName: event.toolName ?? "",
			};
		case "tool_execution_end":
			return {
				type: "tool_execution_end",
				sessionId,
				toolName: event.toolName ?? "",
			};
		case "agent_end":
			return { type: "agent_end", sessionId };
		default:
			return undefined;
	}
}

export const AUDIT_EVENT_ORDER = [
	"agent_start",
	"tool_execution_start",
	"tool_execution_end",
	"agent_end",
] as const;

export function assertAuditEventOrder(types: string[]): boolean {
	const filtered = types.filter((t) => (AUDIT_EVENT_ORDER as readonly string[]).includes(t));
	const firstFour = filtered.slice(0, 4);
	return (
		firstFour.length === 4 &&
		firstFour[0] === "agent_start" &&
		firstFour[1] === "tool_execution_start" &&
		firstFour[2] === "tool_execution_end" &&
		firstFour[3] === "agent_end"
	);
}
