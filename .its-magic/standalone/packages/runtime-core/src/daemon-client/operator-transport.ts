import type { AttachRole, ClientKind, RuntimeEvent } from "@its-magic/protocol";

export interface AttachRunInput {
	run_id: string;
	role: AttachRole;
	client_id?: string;
	client_kind?: ClientKind;
}

export interface SubmitCommandInput {
	run_id: string;
	argv: string[];
	client_id?: string;
	client_kind?: ClientKind;
}

export interface RespondApprovalInput {
	run_id: string;
	approval_id: string;
	choice: string;
}

export interface CancelRunInput {
	run_id: string;
	client_id?: string;
	client_kind?: ClientKind;
}

export interface SubscribeEventsInput {
	run_id: string;
	after_seq: number;
	onEvent: (event: RuntimeEvent) => void;
	onGap?: (expected: number, got: number) => void;
	onLagSummary?: (evidence_ref: string) => void;
}

export interface OperatorTransport {
	readonly kind: "daemon" | "in_process";
	submitCommand(input: SubmitCommandInput): Promise<Record<string, unknown>>;
	subscribeEvents(input: SubscribeEventsInput): Promise<{ unsubscribe: () => void }>;
	attachRun(input: AttachRunInput): Promise<Record<string, unknown>>;
	cancel(input: CancelRunInput): Promise<Record<string, unknown>>;
	respondApproval(input: RespondApprovalInput): Promise<Record<string, unknown>>;
}
