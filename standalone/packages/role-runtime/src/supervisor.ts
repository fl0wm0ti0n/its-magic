import { randomUUID } from "node:crypto";
import {
	AttestationRegistry,
	assertKitProof,
	assertSidecarPresent,
	attestationJsonlPath,
	type SidecarAttestation,
	stubContextPackHash,
	stubPolicyHash,
	withAttestationHash,
} from "./attestation.ts";
import { createDefaultRoleCatalog, type RoleCatalog, resolvePhaseRole } from "./catalog.ts";
import {
	PHASE_ROLE_CAPABILITY_MISSING,
	RoleRuntimeError,
	SESSION_CONTINUATION_DENIED,
	SESSION_REUSED_ACROSS_PHASE,
	SESSION_TRANSCRIPT_CARRYOVER,
} from "./errors.ts";
import type { AgentKernel, KernelSession } from "./kernel-port.ts";
import { assertOrchestratorSchedulingOnly } from "./orchestrator-gate.ts";
import type {
	ContinuationContract,
	SessionSupervisorApi,
	SessionSupervisorOptions,
	SpawnRequest,
	SupervisedSession,
} from "./types.ts";

interface LiveHandle {
	session: KernelSession;
	phase_id: string;
	role_id: string;
	model_id: string;
	iteration_key?: string;
	contract: ContinuationContract;
	created_at: string;
	parent_phase_session_id: string | null;
	fresh: boolean;
	orchestrator_run_id: string;
	degraded_mode: boolean;
	tools: string[];
	policy_hash: string;
}

const ALLOWED_OPS = new Set(["run", "steer"]);
const MUTATION_TOOLS = new Set(["write", "bash", "edit", "read"]);
const LIVE_WRITE_ITSM = new Set([
	"itsm_edit",
	"itsm_write",
	"itsm_patch",
	"itsm_shell",
	"itsm_git",
]);

function iso(now: Date): string {
	return now.toISOString();
}

function hasTaintedRestore(req: SpawnRequest): boolean {
	return req.entries !== undefined || req.parentSession !== undefined || req.fork !== undefined;
}

function validateContractShape(contract: ContinuationContract): void {
	if (contract.schema_version !== 1) {
		throw new RoleRuntimeError(SESSION_CONTINUATION_DENIED, "schema_version must be 1");
	}
	if (!Array.isArray(contract.allowed_ops) || contract.allowed_ops.length === 0) {
		throw new RoleRuntimeError(SESSION_CONTINUATION_DENIED, "allowed_ops required");
	}
	for (const op of contract.allowed_ops) {
		if (!ALLOWED_OPS.has(op)) {
			throw new RoleRuntimeError(SESSION_CONTINUATION_DENIED, `op ${op} is not allowed`);
		}
	}
}

class BoundSession implements SupervisedSession {
	readonly kernelSession: KernelSession;
	readonly kernel_session_id: string;
	readonly fresh: boolean;
	readonly phase_id: string;
	readonly role_id: string;
	readonly contract: ContinuationContract;

	constructor(handle: LiveHandle, fresh: boolean) {
		this.kernelSession = handle.session;
		this.kernel_session_id = handle.session.sessionId;
		this.fresh = fresh;
		this.phase_id = handle.phase_id;
		this.role_id = handle.role_id;
		this.contract = handle.contract;
	}

	async run(text: string): Promise<void> {
		if (!this.contract.allowed_ops.includes("run")) {
			throw new RoleRuntimeError(SESSION_CONTINUATION_DENIED, "run not in allowed_ops");
		}
		await this.kernelSession.run(text);
	}

	async steer(text: string): Promise<void> {
		if (!this.contract.allowed_ops.includes("steer")) {
			throw new RoleRuntimeError(SESSION_CONTINUATION_DENIED, "steer not in allowed_ops");
		}
		await this.kernelSession.steer(text);
	}
}

export class SessionSupervisor implements SessionSupervisorApi {
	private readonly kernel: AgentKernel;
	private readonly env: NodeJS.ProcessEnv;
	private readonly catalog: RoleCatalog;
	private readonly now: () => Date;
	private readonly bootUuid: string;
	private readonly persistDir: string | null;
	private readonly live = new Map<string, LiveHandle>();
	private readonly usedByPhase = new Map<string, string>();
	readonly attestations = new AttestationRegistry();

	constructor(options: SessionSupervisorOptions) {
		this.kernel = options.kernel;
		this.env = options.env ?? process.env;
		this.catalog = createDefaultRoleCatalog();
		this.now = options.now ?? (() => new Date());
		this.bootUuid = options.bootUuid ?? randomUUID();
		this.persistDir = options.persistDir ?? null;
	}

	get kernel_process_instance(): string {
		return `${this.bootUuid}:${process.pid}`;
	}

	async spawn(req: SpawnRequest): Promise<SupervisedSession> {
		if (hasTaintedRestore(req)) {
			throw new RoleRuntimeError(SESSION_TRANSCRIPT_CARRYOVER);
		}
		if (req.kitProof) {
			assertKitProof(req.kitProof, this.now());
		}
		const resolved = resolvePhaseRole({
			phase_id: req.phase_id,
			role_id: req.role_id,
			env: this.env,
			catalog: this.catalog,
		});
		if (resolved.role_id === "orchestrator") {
			assertOrchestratorSchedulingOnly(req.tools);
		} else if (resolved.mutability === "none") {
			for (const tool of req.tools ?? []) {
				if (MUTATION_TOOLS.has(tool) || LIVE_WRITE_ITSM.has(tool)) {
					throw new RoleRuntimeError(PHASE_ROLE_CAPABILITY_MISSING, tool);
				}
			}
		}
		if (req.continuation) {
			return this.continueSession(req, resolved.role_id);
		}
		return this.freshSession(req, resolved.role_id);
	}

	async end(kernel_session_id: string): Promise<void> {
		const handle = this.live.get(kernel_session_id);
		if (!handle) {
			assertSidecarPresent(this.attestations, kernel_session_id);
			return;
		}
		this.emit("end", handle, { ended_at: iso(this.now()) });
		await handle.session.abort();
		handle.session.dispose();
		this.live.delete(kernel_session_id);
	}

	async discardOrphans(): Promise<void> {
		for (const [id, handle] of [...this.live.entries()]) {
			if (!this.attestations.hasEvent(id, "end")) {
				await handle.session.abort();
				handle.session.dispose();
				this.live.delete(id);
				this.attestations.drop(id);
			}
		}
	}

	getLive(kernel_session_id: string): KernelSession | undefined {
		return this.live.get(kernel_session_id)?.session;
	}

	assertAttestations(kernel_session_id: string): SidecarAttestation[] {
		const live = this.live.get(kernel_session_id)?.session.sessionId;
		return assertSidecarPresent(this.attestations, kernel_session_id, live ?? kernel_session_id);
	}

	private continueSession(req: SpawnRequest, role_id: string): SupervisedSession {
		const contract = req.continuation as ContinuationContract;
		validateContractShape(contract);
		const handle = this.live.get(contract.kernel_session_id);
		if (!handle) {
			throw new RoleRuntimeError(SESSION_CONTINUATION_DENIED, "no live contract");
		}
		if (contract.phase_id !== req.phase_id || handle.phase_id !== req.phase_id) {
			throw new RoleRuntimeError(SESSION_CONTINUATION_DENIED, "phase mismatch");
		}
		if (contract.role_id !== role_id || handle.role_id !== role_id) {
			throw new RoleRuntimeError(SESSION_CONTINUATION_DENIED, "role mismatch");
		}
		if (handle.iteration_key !== req.iteration_key) {
			throw new RoleRuntimeError(SESSION_CONTINUATION_DENIED, "iteration_key change");
		}
		if (handle.contract.kernel_session_id !== contract.kernel_session_id) {
			throw new RoleRuntimeError(SESSION_CONTINUATION_DENIED, "session mismatch");
		}
		return new BoundSession(handle, false);
	}

	private async freshSession(req: SpawnRequest, role_id: string): Promise<SupervisedSession> {
		const session = await this.kernel.createSession(
			req.ownedTools !== undefined ? { ownedTools: req.ownedTools } : undefined,
		);
		const id = session.sessionId;
		const priorPhase = this.usedByPhase.get(id);
		if (priorPhase && priorPhase !== req.phase_id) {
			session.dispose();
			throw new RoleRuntimeError(SESSION_REUSED_ACROSS_PHASE);
		}
		if (priorPhase === req.phase_id && !this.live.has(id)) {
			session.dispose();
			throw new RoleRuntimeError(SESSION_REUSED_ACROSS_PHASE);
		}
		this.usedByPhase.set(id, req.phase_id);
		const parent = req.parent_phase_session_id ?? null;
		let degraded = false;
		if (parent) {
			const producer = [...this.live.values()].find((h) => h.session.sessionId === parent);
			if (producer && producer.model_id === req.model_id) {
				degraded = true;
			}
		}
		const contract: ContinuationContract = {
			schema_version: 1,
			phase_id: req.phase_id,
			role_id,
			kernel_session_id: id,
			allowed_ops: ["run", "steer"],
		};
		const created_at = iso(this.now());
		const tools = [...(req.tools ?? [])];
		const handle: LiveHandle = {
			session,
			phase_id: req.phase_id,
			role_id,
			model_id: req.model_id,
			iteration_key: req.iteration_key,
			contract,
			created_at,
			parent_phase_session_id: parent,
			fresh: true,
			orchestrator_run_id: req.orchestrator_run_id,
			degraded_mode: degraded,
			tools,
			policy_hash: req.policy_hash ?? stubPolicyHash(tools),
		};
		if (this.persistDir) {
			this.attestations.setPersistPath(
				attestationJsonlPath(this.persistDir, req.orchestrator_run_id),
			);
		}
		this.live.set(id, handle);
		this.emit("spawn", handle, {});
		this.emit("start", handle, { started_at: iso(this.now()) });
		return new BoundSession(handle, true);
	}

	private emit(
		event: "spawn" | "start" | "end",
		handle: LiveHandle,
		extra: { started_at?: string; ended_at?: string },
	): void {
		const record = withAttestationHash({
			orchestrator_run_id: handle.orchestrator_run_id,
			phase_id: handle.phase_id,
			role_id: handle.role_id,
			kernel: "pi",
			kernel_session_id: handle.session.sessionId,
			kernel_process_instance: this.kernel_process_instance,
			model_id: handle.model_id,
			context_pack_hash: stubContextPackHash(),
			policy_hash: handle.policy_hash,
			created_at: handle.created_at,
			started_at: extra.started_at,
			ended_at: extra.ended_at,
			parent_phase_session_id: handle.parent_phase_session_id,
			fresh: handle.fresh,
			attestation_event: event,
			degraded_mode: handle.degraded_mode || undefined,
		});
		this.attestations.append(record);
	}
}

export function createSessionSupervisor(options: SessionSupervisorOptions): SessionSupervisor {
	return new SessionSupervisor(options);
}
