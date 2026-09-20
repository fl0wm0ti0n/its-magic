import type { KitProof } from "./attestation.ts";
import type { AgentKernel, KernelSession, OwnedToolDefinition } from "./kernel-port.ts";

export interface ContinuationContract {
	schema_version: 1;
	phase_id: string;
	role_id: string;
	kernel_session_id: string;
	allowed_ops: Array<"run" | "steer">;
}

export interface SpawnBootstrap {
	text: string;
	context_hash: string;
	digest_entry_ids: string[];
	digest_char_count: number;
	role_objective_applied: boolean;
}

export interface BootstrapAck {
	session_id: string;
	bootstrap_context_hash: string;
	bootstrap_delivered: true;
}

export interface SpawnRequest {
	phase_id: string;
	role_id?: string;
	orchestrator_run_id: string;
	model_id: string;
	parent_phase_session_id?: string | null;
	continuation?: ContinuationContract;
	tools?: string[];
	iteration_key?: string;
	kitProof?: KitProof;
	/** Production spawn records ToolBroker-computed hash; stubPolicyHash must not run in production. */
	policy_hash?: string;
	ownedTools?: OwnedToolDefinition[];
	/** Immutable pre-spawn bootstrap. Fresh producer sessions only. */
	bootstrap?: SpawnBootstrap;
	/** Test-only tainted restore. Production never sets these. */
	entries?: unknown;
	parentSession?: unknown;
	fork?: unknown;
}

export interface SupervisedSession {
	readonly kernelSession: KernelSession;
	readonly kernel_session_id: string;
	readonly fresh: boolean;
	readonly phase_id: string;
	readonly role_id: string;
	readonly contract: ContinuationContract;
	readonly bootstrap_ack?: BootstrapAck;
	run(text: string): Promise<void>;
	steer(text: string): Promise<void>;
}

export interface SessionSupervisorApi {
	spawn(req: SpawnRequest): Promise<SupervisedSession>;
	end(kernel_session_id: string): Promise<void>;
	discardOrphans(): Promise<void>;
}

export interface SessionSupervisorOptions {
	kernel: AgentKernel;
	env?: NodeJS.ProcessEnv;
	persistDir?: string | null;
	now?: () => Date;
	bootUuid?: string;
}
