import { appendFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { redactAudit } from "@its-magic/auth-models";

export interface AuditRow {
	run_id: string;
	phase_id: string;
	kernel_session_id: string;
	tool: string;
	action: string;
	decision: string;
	duration_ms: number;
	result: string;
	evidence_ref?: string;
	reason_code?: string;
}

export class AuditLog {
	private readonly rows: AuditRow[] = [];
	private persistPath: string | null = null;

	setPersistPath(path: string | null): void {
		this.persistPath = path;
	}

	append(row: AuditRow): AuditRow {
		const safe = redactAudit(row) as AuditRow;
		this.rows.push(safe);
		if (this.persistPath) {
			mkdirSync(dirname(this.persistPath), { recursive: true });
			appendFileSync(this.persistPath, `${JSON.stringify(safe)}\n`, "utf8");
		}
		return safe;
	}

	records(): AuditRow[] {
		return [...this.rows];
	}
}

export function createAuditLog(): AuditLog {
	return new AuditLog();
}
