import { mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { DatabaseSync } from "node:sqlite";
import { RECOVERY_FALSE_COMPLETION } from "../stop-matrix/codes.ts";
import { WorkflowError } from "../workflow/types.ts";

export const RUNTIME_DB_REL = ".its-magic/runtime/ops.sqlite";
export const RUNTIME_GITIGNORE_GLOB = "**/.its-magic/runtime/";

export interface RunRecord {
	id: string;
	phase_id: string;
	status: string;
	claimed_complete: number;
	created_at: string;
}

export interface SessionRecord {
	id: string;
	run_id: string;
	role_id: string;
	phase_id: string;
	created_at: string;
}

export interface RepoCanonical {
	backlog_status: string;
	acceptance_done: boolean;
	sprint_done: boolean;
}

export type IdentityKind = "process" | "container" | "service";

export interface ProcessHandleRecord {
	id: string;
	run_id: string | null;
	reserved: number;
	phase_id: string | null;
	backend: string | null;
	identity_kind: IdentityKind | null;
	identity: string | null;
	command: string | null;
	cwd: string | null;
	ports_json: string | null;
	url: string | null;
	readiness: string | null;
	started_at: string | null;
	crash_count: number;
	restart_count: number;
	log_ring_ref: string | null;
}

const PROCESS_HANDLE_COLUMNS: Array<[string, string]> = [
	["phase_id", "TEXT"],
	["backend", "TEXT"],
	["identity_kind", "TEXT"],
	["identity", "TEXT"],
	["command", "TEXT"],
	["cwd", "TEXT"],
	["ports_json", "TEXT"],
	["url", "TEXT"],
	["readiness", "TEXT"],
	["started_at", "TEXT"],
	["crash_count", "INTEGER NOT NULL DEFAULT 0"],
	["restart_count", "INTEGER NOT NULL DEFAULT 0"],
	["log_ring_ref", "TEXT"],
];

const SCHEMA = `
CREATE TABLE IF NOT EXISTS runs (
	id TEXT PRIMARY KEY,
	phase_id TEXT NOT NULL,
	status TEXT NOT NULL,
	claimed_complete INTEGER NOT NULL DEFAULT 0,
	created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS sessions (
	id TEXT PRIMARY KEY,
	run_id TEXT NOT NULL,
	role_id TEXT NOT NULL,
	phase_id TEXT NOT NULL,
	created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS audit (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	run_id TEXT,
	event TEXT NOT NULL,
	payload TEXT,
	created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS process_handles (
	id TEXT PRIMARY KEY,
	run_id TEXT,
	reserved INTEGER NOT NULL DEFAULT 1,
	phase_id TEXT,
	backend TEXT,
	identity_kind TEXT,
	identity TEXT,
	command TEXT,
	cwd TEXT,
	ports_json TEXT,
	url TEXT,
	readiness TEXT,
	started_at TEXT,
	crash_count INTEGER NOT NULL DEFAULT 0,
	restart_count INTEGER NOT NULL DEFAULT 0,
	log_ring_ref TEXT
);
CREATE TABLE IF NOT EXISTS index_meta (
	key TEXT PRIMARY KEY,
	value TEXT
);
`;

export class RunsStore {
	private readonly db: DatabaseSync;
	readonly path: string;

	constructor(path: string = ":memory:") {
		this.path = path;
		if (path !== ":memory:") {
			mkdirSync(dirname(path), { recursive: true });
		}
		this.db = new DatabaseSync(path);
		this.db.exec(SCHEMA);
		this.ensureProcessHandleColumns();
	}

	private ensureProcessHandleColumns(): void {
		const existing = new Set(
			(this.db.prepare("PRAGMA table_info(process_handles)").all() as Array<{ name: string }>).map(
				(row) => row.name,
			),
		);
		for (const [name, ddl] of PROCESS_HANDLE_COLUMNS) {
			if (!existing.has(name)) {
				this.db.exec(`ALTER TABLE process_handles ADD COLUMN ${name} ${ddl}`);
			}
		}
	}

	insertRun(record: RunRecord): void {
		this.db
			.prepare(
				"INSERT INTO runs (id, phase_id, status, claimed_complete, created_at) VALUES (?, ?, ?, ?, ?)",
			)
			.run(record.id, record.phase_id, record.status, record.claimed_complete, record.created_at);
	}

	insertSession(record: SessionRecord): void {
		this.db
			.prepare(
				"INSERT INTO sessions (id, run_id, role_id, phase_id, created_at) VALUES (?, ?, ?, ?, ?)",
			)
			.run(record.id, record.run_id, record.role_id, record.phase_id, record.created_at);
	}

	audit(run_id: string | null, event: string, payload: string, created_at: string): void {
		this.db
			.prepare("INSERT INTO audit (run_id, event, payload, created_at) VALUES (?, ?, ?, ?)")
			.run(run_id, event, payload, created_at);
	}

	listAudit(run_id?: string): Array<{
		run_id: string | null;
		event: string;
		payload: string;
		created_at: string;
	}> {
		if (run_id) {
			return this.db
				.prepare(
					"SELECT run_id, event, payload, created_at FROM audit WHERE run_id = ? ORDER BY id",
				)
				.all(run_id) as Array<{
				run_id: string | null;
				event: string;
				payload: string;
				created_at: string;
			}>;
		}
		return this.db
			.prepare("SELECT run_id, event, payload, created_at FROM audit ORDER BY id")
			.all() as Array<{
			run_id: string | null;
			event: string;
			payload: string;
			created_at: string;
		}>;
	}

	reserveProcessHandle(id: string, run_id: string): void {
		this.db
			.prepare("INSERT INTO process_handles (id, run_id, reserved) VALUES (?, ?, 1)")
			.run(id, run_id);
	}

	upsertProcessHandle(record: ProcessHandleRecord): void {
		this.db
			.prepare(
				`INSERT INTO process_handles (
					id, run_id, reserved, phase_id, backend, identity_kind, identity,
					command, cwd, ports_json, url, readiness, started_at,
					crash_count, restart_count, log_ring_ref
				) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
				ON CONFLICT(id) DO UPDATE SET
					run_id = excluded.run_id,
					reserved = excluded.reserved,
					phase_id = excluded.phase_id,
					backend = excluded.backend,
					identity_kind = excluded.identity_kind,
					identity = excluded.identity,
					command = excluded.command,
					cwd = excluded.cwd,
					ports_json = excluded.ports_json,
					url = excluded.url,
					readiness = excluded.readiness,
					started_at = excluded.started_at,
					crash_count = excluded.crash_count,
					restart_count = excluded.restart_count,
					log_ring_ref = excluded.log_ring_ref`,
			)
			.run(
				record.id,
				record.run_id,
				record.reserved,
				record.phase_id,
				record.backend,
				record.identity_kind,
				record.identity,
				record.command,
				record.cwd,
				record.ports_json,
				record.url,
				record.readiness,
				record.started_at,
				record.crash_count,
				record.restart_count,
				record.log_ring_ref,
			);
	}

	listProcessHandlesForRun(run_id: string): ProcessHandleRecord[] {
		const rows = this.db
			.prepare(
				`SELECT id, run_id, reserved, phase_id, backend, identity_kind, identity,
					command, cwd, ports_json, url, readiness, started_at,
					crash_count, restart_count, log_ring_ref
				FROM process_handles WHERE run_id = ? ORDER BY id`,
			)
			.all(run_id) as Array<Record<string, unknown>>;
		return rows.map(mapProcessHandleRow);
	}

	getProcessHandle(id: string): ProcessHandleRecord | undefined {
		const row = this.db
			.prepare(
				`SELECT id, run_id, reserved, phase_id, backend, identity_kind, identity,
					command, cwd, ports_json, url, readiness, started_at,
					crash_count, restart_count, log_ring_ref
				FROM process_handles WHERE id = ?`,
			)
			.get(id) as Record<string, unknown> | undefined;
		return row ? mapProcessHandleRow(row) : undefined;
	}

	setMeta(key: string, value: string): void {
		this.db.prepare("INSERT OR REPLACE INTO index_meta (key, value) VALUES (?, ?)").run(key, value);
	}

	claimComplete(run_id: string): void {
		this.db
			.prepare("UPDATE runs SET claimed_complete = 1, status = 'PASS' WHERE id = ?")
			.run(run_id);
	}

	lastRun(): RunRecord | undefined {
		const row = this.db
			.prepare(
				"SELECT id, phase_id, status, claimed_complete, created_at FROM runs ORDER BY created_at DESC, id DESC LIMIT 1",
			)
			.get() as RunRecord | undefined;
		return row;
	}

	tableNames(): string[] {
		const rows = this.db
			.prepare("SELECT name FROM sqlite_master WHERE type = 'table' ORDER BY name")
			.all() as Array<{ name: string }>;
		return rows.map((r) => r.name).filter((n) => !n.startsWith("sqlite_"));
	}

	assertRepoCanonical(repo: RepoCanonical): void {
		const last = this.lastRun();
		if (!last) {
			return;
		}
		const sqliteClaimsComplete = last.claimed_complete === 1 || last.status === "PASS";
		const repoDisagrees =
			repo.backlog_status !== "DONE" ||
			repo.acceptance_done === false ||
			repo.sprint_done === false;
		if (sqliteClaimsComplete && repoDisagrees) {
			throw new WorkflowError(
				RECOVERY_FALSE_COMPLETION,
				"SQLite claimed complete but repository artifacts disagree",
			);
		}
	}

	close(): void {
		this.db.close();
	}
}

function mapProcessHandleRow(row: Record<string, unknown>): ProcessHandleRecord {
	const kind = row.identity_kind;
	const identity_kind =
		kind === "process" || kind === "container" || kind === "service" ? kind : null;
	return {
		id: String(row.id),
		run_id: row.run_id == null ? null : String(row.run_id),
		reserved: Number(row.reserved ?? 1),
		phase_id: row.phase_id == null ? null : String(row.phase_id),
		backend: row.backend == null ? null : String(row.backend),
		identity_kind,
		identity: row.identity == null ? null : String(row.identity),
		command: row.command == null ? null : String(row.command),
		cwd: row.cwd == null ? null : String(row.cwd),
		ports_json: row.ports_json == null ? null : String(row.ports_json),
		url: row.url == null ? null : String(row.url),
		readiness: row.readiness == null ? null : String(row.readiness),
		started_at: row.started_at == null ? null : String(row.started_at),
		crash_count: Number(row.crash_count ?? 0),
		restart_count: Number(row.restart_count ?? 0),
		log_ring_ref: row.log_ring_ref == null ? null : String(row.log_ring_ref),
	};
}

export function createRunsStore(path: string = ":memory:"): RunsStore {
	return new RunsStore(path);
}
