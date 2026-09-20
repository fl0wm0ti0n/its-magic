import { mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { DatabaseSync } from "node:sqlite";
import {
	DAEMON_EVENT_LAG_MAX,
	PROTOCOL_VERSION,
	type RuntimeEvent,
	redactEventPayload,
} from "@its-magic/protocol";

const DEFAULT_RETENTION = 10_000;
export const EVENT_LAG_THRESHOLD = 50;

export class DaemonEventStore {
	private readonly db: DatabaseSync;

	constructor(dbPath: string) {
		mkdirSync(dirname(dbPath), { recursive: true });
		this.db = new DatabaseSync(dbPath);
		this.db.exec(`
			CREATE TABLE IF NOT EXISTS run_events (
				run_id TEXT NOT NULL,
				seq INTEGER NOT NULL,
				kind TEXT NOT NULL,
				payload_json TEXT NOT NULL,
				PRIMARY KEY (run_id, seq)
			);
		`);
	}

	append(run_id: string, kind: string, payload: Record<string, unknown> = {}): RuntimeEvent {
		const row = this.db
			.prepare("SELECT COALESCE(MAX(seq), 0) AS m FROM run_events WHERE run_id = ?")
			.get(run_id) as { m: number };
		const seq = row.m + 1;
		const event: RuntimeEvent = {
			run_id,
			seq,
			kind,
			protocol_version: PROTOCOL_VERSION,
			payload: redactEventPayload(payload),
		};
		this.db
			.prepare("INSERT INTO run_events (run_id, seq, kind, payload_json) VALUES (?, ?, ?, ?)")
			.run(run_id, seq, kind, JSON.stringify(event.payload ?? {}));
		const count = this.db
			.prepare("SELECT COUNT(*) AS c FROM run_events WHERE run_id = ?")
			.get(run_id) as { c: number };
		if (count.c > DEFAULT_RETENTION) {
			this.db
				.prepare(
					"DELETE FROM run_events WHERE run_id = ? AND seq < (SELECT MAX(seq) - ? FROM run_events WHERE run_id = ?)",
				)
				.run(run_id, DEFAULT_RETENTION, run_id);
		}
		return event;
	}

	listAfter(run_id: string, after_seq: number): RuntimeEvent[] {
		const rows = this.db
			.prepare(
				"SELECT seq, kind, payload_json FROM run_events WHERE run_id = ? AND seq > ? ORDER BY seq ASC",
			)
			.all(run_id, after_seq) as Array<{ seq: number; kind: string; payload_json: string }>;
		return rows.map((r) => ({
			run_id,
			seq: r.seq,
			kind: r.kind,
			protocol_version: PROTOCOL_VERSION,
			payload: JSON.parse(r.payload_json) as Record<string, unknown>,
		}));
	}

	close(): void {
		this.db.close();
	}

	summaryIfLagged(run_id: string, clientLag: number): RuntimeEvent | undefined {
		if (clientLag <= EVENT_LAG_THRESHOLD) {
			return undefined;
		}
		return {
			run_id,
			seq: -1,
			kind: DAEMON_EVENT_LAG_MAX,
			protocol_version: PROTOCOL_VERSION,
			summary: true,
			evidence_ref: `daemon-events:${run_id}:lag`,
			payload: { lag: clientLag },
		};
	}
}
