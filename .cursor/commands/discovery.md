---
description: "its-magic discovery: collect design/UX inspiration and scope updates."
---

Kernel pointer: `.cursor/rules/core.mdc`. Do not paste the kernel lines into this file.

# /discovery

## Subagents
- po

## Execution model
- Run `/discovery` in a fresh PO subagent context.
- After writing outputs, stop and hand off to `/research` in a new
  subagent/chat.

## Inputs

- **Narrow-read (US-0053 / US-0096 Tranche A)**: Start at docs/engineering/phase-context.md
  and the story section anchor in vision/architecture/decisions when a heading exists; forbid
  full-file reads when a section heading exists.
- Design/UX references
- Competitive/market notes

## Outputs (artifacts)
- `docs/product/vision.md`
- `docs/product/backlog.md`
- `handoffs/po_to_tl.md`

## Stop conditions
- Missing references
- Decision gate triggered

## Steps
1. Capture references and UX notes in vision.
2. Add new stories or updates to backlog.
3. Refresh the PO -> TL handoff.
4. Triad hot-surface gate (DEC-0054) when `handoffs/po_to_tl.md` is mutated:
   - run `python scripts/enforce-triad-hot-surface.py --rollover` then `--check`
     from repository root,
   - on failure stop with `STATE_ARCHIVE_REQUIRED` or
     `ARTIFACT_HOT_SURFACE_OVERSIZE`,
   - record verification tuple fields when rollover occurred (see runbook).

5. Default minimal-read posture: start at `docs/engineering/phase-context.md`,
   then vision/backlog/tail of `handoffs/po_to_tl.md` per runbook table; escalate
   only to a named archive `pack_ref` when unresolved (`CONTEXT_BUDGET_EXCEEDED`
   on unbounded reads).

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
