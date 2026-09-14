import { createHash } from "node:crypto";
import { appendFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import {
	ATTESTATION_HASH_MISMATCH,
	ATTESTATION_KERNEL_SESSION_MISMATCH,
	ATTESTATION_MISSING,
	RoleRuntimeError,
	RUNTIME_PROOF_INVALID,
	RUNTIME_PROOF_MISSING,
	RUNTIME_PROOF_STALE,
} from "./errors.ts";

export type AttestationEvent = "spawn" | "start" | "end";

export interface SidecarAttestation {
	orchestrator_run_id: string;
	phase_id: string;
	role_id: string;
	kernel: "pi";
	kernel_session_id: string;
	kernel_process_instance: string;
	model_id: string;
	context_pack_hash: string;
	policy_hash: string;
	created_at: string;
	started_at?: string;
	ended_at?: string;
	parent_phase_session_id: string | null;
	fresh: boolean;
	attestation_event: AttestationEvent;
	degraded_mode?: boolean;
	attestation_hash: string;
}

export interface KitProof {
	runtime_proof_id?: string;
	proof_issued_at?: string;
	proof_ttl?: string;
	proof_ttl_seconds?: number;
	proof_hash?: string;
}

export function canonicalJson(value: unknown): string {
	return JSON.stringify(sortKeys(value));
}

function sortKeys(value: unknown): unknown {
	if (Array.isArray(value)) {
		return value.map(sortKeys);
	}
	if (value && typeof value === "object") {
		const obj = value as Record<string, unknown>;
		const out: Record<string, unknown> = {};
		for (const key of Object.keys(obj).sort()) {
			out[key] = sortKeys(obj[key]);
		}
		return out;
	}
	return value;
}

export function sha256Canonical(value: unknown): string {
	return createHash("sha256").update(canonicalJson(value), "utf8").digest("hex").toUpperCase();
}

export function stubContextPackHash(): string {
	return sha256Canonical({ artifacts: [], handoffs: [] });
}

export function stubPolicyHash(tools: string[]): string {
	return sha256Canonical({ catalog_schema_version: 1, tools });
}

export function computeAttestationHash(
	record: Omit<SidecarAttestation, "attestation_hash">,
): string {
	return sha256Canonical(record);
}

export function withAttestationHash(
	record: Omit<SidecarAttestation, "attestation_hash">,
): SidecarAttestation {
	return { ...record, attestation_hash: computeAttestationHash(record) };
}

export function verifyAttestationHash(record: SidecarAttestation): void {
	const { attestation_hash, ...rest } = record;
	const expected = computeAttestationHash(rest);
	if (attestation_hash !== expected) {
		throw new RoleRuntimeError(ATTESTATION_HASH_MISMATCH);
	}
}

export class AttestationRegistry {
	private readonly bySession = new Map<string, SidecarAttestation[]>();
	private persistPath: string | null = null;

	setPersistPath(path: string | null): void {
		this.persistPath = path;
	}

	append(record: SidecarAttestation): void {
		verifyAttestationHash(record);
		const list = this.bySession.get(record.kernel_session_id) ?? [];
		list.push(record);
		this.bySession.set(record.kernel_session_id, list);
		if (this.persistPath) {
			mkdirSync(dirname(this.persistPath), { recursive: true });
			appendFileSync(this.persistPath, `${JSON.stringify(record)}\n`, "utf8");
		}
	}

	records(kernel_session_id: string): SidecarAttestation[] {
		return [...(this.bySession.get(kernel_session_id) ?? [])];
	}

	all(): SidecarAttestation[] {
		return [...this.bySession.values()].flat();
	}

	hasEvent(kernel_session_id: string, event: AttestationEvent): boolean {
		return (this.bySession.get(kernel_session_id) ?? []).some((r) => r.attestation_event === event);
	}

	drop(kernel_session_id: string): void {
		this.bySession.delete(kernel_session_id);
	}
}

export function assertSidecarPresent(
	registry: AttestationRegistry,
	kernel_session_id: string,
	liveSessionId?: string,
): SidecarAttestation[] {
	const rows = registry.records(kernel_session_id);
	if (rows.length === 0) {
		throw new RoleRuntimeError(ATTESTATION_MISSING);
	}
	for (const row of rows) {
		verifyAttestationHash(row);
		if (liveSessionId && row.kernel_session_id !== liveSessionId) {
			throw new RoleRuntimeError(ATTESTATION_KERNEL_SESSION_MISMATCH);
		}
	}
	return rows;
}

export function assertKitProof(proof: KitProof | undefined, now: Date = new Date()): void {
	if (!proof) {
		throw new RoleRuntimeError(RUNTIME_PROOF_MISSING);
	}
	const hash = proof.proof_hash?.trim() ?? "";
	if (!/^[0-9a-fA-F]{64}$/.test(hash)) {
		throw new RoleRuntimeError(RUNTIME_PROOF_INVALID);
	}
	if (proof.proof_ttl) {
		const ttl = Date.parse(proof.proof_ttl);
		if (Number.isNaN(ttl) || ttl <= now.getTime()) {
			throw new RoleRuntimeError(RUNTIME_PROOF_STALE);
		}
	} else if (proof.proof_issued_at && proof.proof_ttl_seconds != null) {
		const issued = Date.parse(proof.proof_issued_at);
		if (Number.isNaN(issued)) {
			throw new RoleRuntimeError(RUNTIME_PROOF_INVALID);
		}
		if (issued + proof.proof_ttl_seconds * 1000 <= now.getTime()) {
			throw new RoleRuntimeError(RUNTIME_PROOF_STALE);
		}
	} else {
		throw new RoleRuntimeError(RUNTIME_PROOF_MISSING);
	}
}

export function attachStandaloneAttestation<T extends Record<string, unknown>>(
	evidence: T,
	sidecar: SidecarAttestation,
): T & { standalone_attestation: SidecarAttestation } {
	return { ...evidence, standalone_attestation: sidecar };
}

export function attestationJsonlPath(runDir: string, orchestrator_run_id: string): string {
	return join(runDir, "its-magic", "runs", orchestrator_run_id, "session-attestations.jsonl");
}
