import assert from "node:assert/strict";
import { test } from "node:test";
import {
	assertAuditEventOrder,
	ITSM_PING_TOOL_NAME,
	mapPiEventToKernelEvent,
} from "../../packages/pi-kernel/src/index.ts";

test("owned event-bridge maps Pi events and ignores extras", () => {
	const sessionId = "sess-1";
	assert.deepEqual(mapPiEventToKernelEvent(sessionId, { type: "agent_start" }), {
		type: "agent_start",
		sessionId,
	});
	assert.deepEqual(
		mapPiEventToKernelEvent(sessionId, {
			type: "tool_execution_start",
			toolName: ITSM_PING_TOOL_NAME,
		}),
		{ type: "tool_execution_start", sessionId, toolName: ITSM_PING_TOOL_NAME },
	);
	assert.equal(mapPiEventToKernelEvent(sessionId, { type: "message_update" }), undefined);
	assert.equal(mapPiEventToKernelEvent(sessionId, { type: "turn_start" }), undefined);
	assert.equal(mapPiEventToKernelEvent(sessionId, { type: "queue_update" }), undefined);
	assert.ok(
		assertAuditEventOrder([
			"agent_start",
			"tool_execution_start",
			"tool_execution_end",
			"agent_end",
		]),
	);
});
