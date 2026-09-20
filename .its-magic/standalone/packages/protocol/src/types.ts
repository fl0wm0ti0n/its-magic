import type { PROTOCOL_VERSION } from "./codes.ts";

export type AttachRole = "controller" | "observer";
export type ClientKind = "cli" | "tui" | "test";

export type RuntimeCommandKind =
	| "command.submit"
	| "approval.respond"
	| "run.cancel"
	| "run.start"
	| "run.attach";

export interface RuntimeCommandBase {
	kind: RuntimeCommandKind;
	protocol_version: typeof PROTOCOL_VERSION;
	run_id?: string;
}

export interface CommandSubmitPayload extends RuntimeCommandBase {
	kind: "command.submit";
	argv: string[];
	client_id?: string;
	client_kind?: ClientKind;
}

export interface ApprovalRespondPayload extends RuntimeCommandBase {
	kind: "approval.respond";
	approval_id: string;
	choice: string;
}

export interface RunCancelPayload extends RuntimeCommandBase {
	kind: "run.cancel";
}

export interface RunStartPayload extends RuntimeCommandBase {
	kind: "run.start";
	orchestrator_run_id?: string;
}

export interface RunAttachPayload extends RuntimeCommandBase {
	kind: "run.attach";
	role: AttachRole;
	client_id?: string;
	client_kind?: ClientKind;
}

export type RuntimeCommand =
	| CommandSubmitPayload
	| ApprovalRespondPayload
	| RunCancelPayload
	| RunStartPayload
	| RunAttachPayload;

export interface RuntimeEvent {
	run_id: string;
	seq: number;
	kind: string;
	protocol_version: number;
	payload?: Record<string, unknown>;
	summary?: boolean;
	evidence_ref?: string;
}

export interface DaemonHelloResult {
	protocol_version: number;
	supported_protocol_range: { min: number; max: number };
	capabilities: string[];
	server_id: string;
}

export interface ListenMetadata {
	host: string;
	port: number;
	protocol_version: number;
}
