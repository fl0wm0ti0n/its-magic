import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { RECONCILE_INCOMPLETE } from "@its-magic/protocol";
import type { RunsStore } from "../runs/store.ts";
import { WorkflowError } from "../workflow/types.ts";

const STALE_ATTACH_TTL_MS = 60 * 60 * 1000;

export interface ReconcileOperationalLedgerInput {
	projectRoot: string;
	store: RunsStore;
	now?: number;
}

export interface ReconcileOperationalLedgerOk {
	ok: true;
	orphan_pids_cleared: number;
	stale_tokens_cleared: number;
}

export function reconcileOperationalLedger(
	input: ReconcileOperationalLedgerInput,
): ReconcileOperationalLedgerOk {
	const now = input.now ?? Date.now();
	const briefPath = join(input.projectRoot, "handoffs", "resume_brief.md");
	if (!existsSync(briefPath)) {
		throw new WorkflowError(RECONCILE_INCOMPLETE, "resume_brief missing for reconcile");
	}
	const brief = readFileSync(briefPath, "utf8");
	if (/RECONCILE_INCOMPLETE/i.test(brief)) {
		throw new WorkflowError(RECONCILE_INCOMPLETE, "ledger flagged incomplete");
	}
	const tokenPath = join(input.projectRoot, ".its-magic", "daemon", "attach-tokens.json");
	let stale_tokens_cleared = 0;
	if (existsSync(tokenPath)) {
		try {
			const raw = JSON.parse(readFileSync(tokenPath, "utf8")) as Record<
				string,
				{ issued_at: number }
			>;
			for (const [key, meta] of Object.entries(raw)) {
				if (now - meta.issued_at > STALE_ATTACH_TTL_MS) {
					delete raw[key];
					stale_tokens_cleared += 1;
				}
			}
		} catch {
			throw new WorkflowError(RECONCILE_INCOMPLETE, "attach token ledger corrupt");
		}
	}
	return { ok: true, orphan_pids_cleared: 0, stale_tokens_cleared };
}
