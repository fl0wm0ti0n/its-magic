import { mkdirSync } from "node:fs";
import type { IdentityKind, ProcessHandleRecord, RunsStore } from "@its-magic/runtime-core";
import { PROCESS_ORPHAN_REAPED } from "./codes.ts";
import { LogRing } from "./logs.ts";
import type { ManagedHandle } from "./types.ts";

const RING_MAX = 256;

export class ProcessManager {
	private readonly live = new Map<string, ManagedHandle>();
	private readonly rings = new Map<string, LogRing>();
	private readonly store: RunsStore;
	private readonly logsDir: string;

	constructor(store: RunsStore, logsDir: string) {
		this.store = store;
		this.logsDir = logsDir;
		mkdirSync(this.logsDir, { recursive: true });
	}

	get(id: string): ManagedHandle | undefined {
		return this.live.get(id);
	}

	ring(id: string): string[] {
		return this.rings.get(id)?.snapshot() ?? [];
	}

	appendLog(id: string, line: string): void {
		let ring = this.rings.get(id);
		if (!ring) {
			ring = new LogRing(RING_MAX);
			this.rings.set(id, ring);
		}
		ring.push(line);
		const handle = this.live.get(id);
		if (handle) {
			handle.log_ring_ref = ring.persist(this.logsDir, id);
			this.persist(handle);
		}
	}

	track(handle: ManagedHandle): ManagedHandle {
		this.live.set(handle.id, handle);
		if (!this.rings.has(handle.id)) {
			this.rings.set(handle.id, new LogRing(RING_MAX));
		}
		handle.log_ring_ref = this.rings.get(handle.id)?.persist(this.logsDir, handle.id) ?? "";
		this.persist(handle);
		return handle;
	}

	recordCrash(id: string): number {
		const handle = this.require(id);
		handle.crash_count += 1;
		this.persist(handle);
		return handle.crash_count;
	}

	recordRestart(id: string): number {
		const handle = this.require(id);
		handle.restart_count += 1;
		this.persist(handle);
		return handle.restart_count;
	}

	updateReadiness(id: string, readiness: string, health: string): void {
		const handle = this.require(id);
		handle.readiness = readiness;
		handle.health = health;
		this.persist(handle);
	}

	listForRun(run_id: string): ProcessHandleRecord[] {
		return this.store.listProcessHandlesForRun(run_id);
	}

	async stop(id: string): Promise<void> {
		const handle = this.live.get(id);
		if (!handle) {
			return;
		}
		if (handle.child) {
			try {
				handle.child.kill("SIGTERM");
			} catch {
				/* already gone */
			}
		}
		handle.readiness = "stopped";
		this.persist(handle);
		this.live.delete(id);
	}

	async stopAll(): Promise<string[]> {
		const ids = [...this.live.keys()];
		for (const id of ids) {
			await this.stop(id);
		}
		return ids;
	}

	async reapOrphans(): Promise<string[]> {
		const reaped: string[] = [];
		for (const [id, handle] of [...this.live.entries()]) {
			if (handle.readiness !== "ready" && handle.readiness !== "starting") {
				await this.stop(id);
				reaped.push(id);
			}
		}
		return reaped;
	}

	orphanReason(): typeof PROCESS_ORPHAN_REAPED {
		return PROCESS_ORPHAN_REAPED;
	}

	private require(id: string): ManagedHandle {
		const handle = this.live.get(id);
		if (!handle) {
			throw new Error(`process handle ${id} not tracked`);
		}
		return handle;
	}

	private persist(handle: ManagedHandle): void {
		this.store.upsertProcessHandle({
			id: handle.id,
			run_id: handle.run_id,
			reserved: 0,
			phase_id: handle.phase_id,
			backend: handle.backend,
			identity_kind: handle.identity_kind as IdentityKind,
			identity: handle.identity,
			command: handle.command,
			cwd: handle.cwd,
			ports_json: JSON.stringify(handle.ports),
			url: handle.url,
			readiness: handle.readiness,
			started_at: handle.started_at,
			crash_count: handle.crash_count,
			restart_count: handle.restart_count,
			log_ring_ref: handle.log_ring_ref,
		});
	}
}
