import { Type } from "@earendil-works/pi-ai";
import { defineTool } from "@earendil-works/pi-coding-agent";
import {
	ITSM_PING_TOOL_NAME,
	OWNED_TOOL_NAME_RE,
	type OwnedToolDefinition,
	POLICY_RAW_PI_TOOL_DENIED,
	RAW_PI_BUILTIN_TOOLS,
} from "./types.ts";

export class KernelPolicyError extends Error {
	readonly code: string;

	constructor(code: string, message?: string) {
		super(message ?? code);
		this.name = "KernelPolicyError";
		this.code = code;
	}
}

const RAW_PI = new Set<string>(RAW_PI_BUILTIN_TOOLS);

export const itsmPingTool = defineTool({
	name: ITSM_PING_TOOL_NAME,
	label: "Ping",
	description: "Phase 0 spike ping. Returns pong. Placeholder only — full tool catalog is later.",
	parameters: Type.Object({}),
	execute: async () => ({
		content: [{ type: "text", text: "pong" }],
		details: {},
	}),
});

function denyRaw(name: string): never {
	throw new KernelPolicyError(POLICY_RAW_PI_TOOL_DENIED, name);
}

export function wrapOwnedTool(def: OwnedToolDefinition) {
	if (RAW_PI.has(def.name) || !OWNED_TOOL_NAME_RE.test(def.name)) {
		denyRaw(def.name);
	}
	return defineTool({
		name: def.name,
		label: def.label,
		description: def.description,
		parameters: Type.Object({}, { additionalProperties: true }),
		execute: async (toolCallId, params) => {
			const result = await def.execute(toolCallId, params);
			return {
				content: result.content.map((c) => ({ type: "text" as const, text: c.text })),
				details: result.details,
			};
		},
	});
}

export function wrapOwnedTools(defs: OwnedToolDefinition[]) {
	return defs.map(wrapOwnedTool);
}
