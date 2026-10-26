---
description: "its-magic discovery: collect UX and product references."
agent: po
---

# /discovery

phase_id: discovery
role: po

## Artifacts
- docs/product/vision.md
- handoffs/po_to_tl.md

## Persist
If required writes are denied, stop with OPENCODE_MANUAL_PHASE_WRITE_DENIED before work. persistManualPhaseIsolation writes IsolationEvidence.

## Continuation + terminal-state reconcile contract (BUG-0044 / DEC-0156, composes on DEC-0153 / DEC-0038)

Before emitting this phase's STOP reason, this completed phase child MUST:
1. Reconcile its owned lifecycle artifacts to the terminal state for THIS phase
   (the per-phase table in `docs/engineering/architecture.md` `# BUG-0044` Lock 3).
2. Append the state-bottom checkpoint (the canonical continuation-pair JSON record)
   to `docs/engineering/state.md` (state-first; append-never-rewrite, DEC-0040).
3. Compute the strict 6-tuple proof hash via
   `token_cost_lib.compute_strict_proof_hash(orchestrator_run_id, runtime_proof_id,
   phase_id, role, proof_issued_at, proof_ttl_seconds)`.
4. Prepend the byte-identical brief-top record to `handoffs/resume_brief.md`
   (temp-file-plus-replace; cross-file atomicity deliberately NOT claimed).
5. Re-read BOTH sides and assert byte-identical + `validate_resume_pair(writer_role=<own role>)`
   -> `ok=true` (via `opencode_auto_bridge.phase_boundary_self_check`) BEFORE STOP.

The pair key is `orchestrator_run_id|work_item_kind|bug_id|completed_phase|runtime_proof_id`;
both sides agree on all 20 `PAIR_LOCKED_FIELDS` + strict-proof fields. The parent stays
spawn-only (validate + spawn only; it never writes either artifact, never mints a proof, and
`RESUME_BRIEF_AUTO_REFRESH=0` is absolute). A missing/conflicting pair is a deterministic
fail-closed stop (`RESUME_BRIEF_STALE` / `RESUME_BRIEF_UNPARSEABLE`, predicate retained; no
state-alone fallback, no auto-refresh, no silent continue). This child does NOT spawn the next
phase.

STOP
