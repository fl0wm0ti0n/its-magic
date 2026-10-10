# State archive pack (2026-10-09)

- Rollover trigger: `STATE_HOT_MAX_LINES=1200, STATE_HOT_MAX_CHECKPOINTS=80`
- Source: `docs/engineering/state.md`
- Archived units (oldest first, contiguous prefix): 1
- Retained units in hot file: 29
- First archived heading: `## Intake checkpoint (2026-10-03T15:36:00Z) — PO_INTAKE_PASS — BUG-0032 / BUG-0033 / BUG-0034 (auto-20261003-po-intake)`
- Last archived heading: `## Intake checkpoint (2026-10-03T15:36:00Z) — PO_INTAKE_PASS — BUG-0032 / BUG-0033 / BUG-0034 (auto-20261003-po-intake)`
- Verification tuple (mandatory):
  - archived_body_lines=44
  - preamble_lines=11
  - retained_body_lines=1185

---

## Intake checkpoint (2026-10-03T15:36:00Z) — PO_INTAKE_PASS — BUG-0032 / BUG-0033 / BUG-0034 (auto-20261003-po-intake)

- **Phase**: intake (register-only; not `/auto`; not a continuation of the prior US-0156/S0162 segment).
- **Role**: product-owner (PO) — explicit operator command "spawn an intake command process to register the Stories/Bugs"; `INTAKE_AUTONOMY_MODE=0`, `INTAKE_SUBAGENT_FALLBACK=deny` (config.json L145-L146, L323-L324) → **inline intake, no subagent spawn**.
- **orchestrator_run_id**: `auto-20261003-po-intake`
- **Verdict**: **PO_INTAKE_PASS** (stop_reason=**intake_pass**; not intake_fail).
- **3-item tuple** (all **OPEN**, all ACs unchecked; next-sequence IDs per `bug_issue_lib.next_bug_id`):
  | ID | Priority | One-line title | Backlog `###` | Acceptance row |
  | --- | --- | --- | --- | --- |
  | **BUG-0032** | **P0** | Scratchpad/config-baseline drift on `AUTONOMY_PRESET` / `AUTONOMY_STOP_POLICY` + `check_intake_template_parity.py --scope=autonomy-flags` drift-detect + `AUTONOMY_FLAGS_DRIFT` runbook entry | `docs/product/backlog.md` L5673 | `docs/product/acceptance.md` (new `- [ ]` row after BUG-0031) |
  | **BUG-0033** | **P1** | Thin→rich command-pair parity: copy `## Fail-safe reason codes` + `## Stop conditions` into `.opencode/commands/{closure,ask,auto,refresh-context,execute}.md` (closure-first); active↔template byte-parity (BUG-0031 precedent) | `docs/product/backlog.md` L5694 | `docs/product/acceptance.md` (new `- [ ]` row after BUG-0032) |
  | **BUG-0034** | **P1** | Register un-registered token `PO_CLOSURE_PRECONDITION_CONFLICT` (grep 0 hits; operator-observed fail-closed) in `scripts/data/autonomy_stop_matrix.yaml` (`autonomy_resolvable`, `auto_repair_kind=disambiguate_state` OR `auto_refresh_brief` — **operator/TL decision gate**) + `docs/engineering/reason_codes.md` US-row + `docs/engineering/runbook.md` remediation + repair-ledger integration | `docs/product/backlog.md` L5716 | `docs/product/acceptance.md` (new `- [ ]` row after BUG-0033) |
- **fresh_context_marker**: **`po-BUG0032-intake-20261003T153600Z-fresh`** (grep-verified 0 prior occurrences repo-wide; BUG-0006 / US-0048 fresh-context contract; distinct from the prior `cur-US0156-S0162-refreshctx-20261003T090000Z-fresh` and `cur-BUG0031-*` / `cur-BUG0022-*` / `cur-BUG0031-*` segment/refresh-context/closure chain markers).
- **Runtime proof (DEC-0038 / US-0056)**:
  - `runtime_proof_id=rp-auto-20261003-po-intake-poi-20261003T153600Z-POINTAKE`
  - `proof_hash=059DF906BE1B6467D4C2D562E3F1DDD421FF56CE11E04941ACE6C54B1AEAF458` (64-hex uppercase; canonical sorted-key JSON SHA-256 over DEC-0038 tuple `{"orchestrator_run_id":"auto-20261003-po-intake","phase_id":"intake","proof_issued_at":"2026-10-03T15:36:00Z","proof_ttl_seconds":3600,"role":"po","runtime_proof_id":"rp-auto-20261003-po-intake-poi-20261003T153600Z-POINTAKE"}`; minted via `scripts/token_cost_lib.compute_strict_proof_hash`).
  - `proof_ttl=2026-10-03T16:36:00Z` (3600s)
  - `hash_recompute_confirmation=true` — MINTED in one invocation → `059DF906…AEAF458`; **independently RECOMPUTED in a second fresh invocation** (plain `hashlib.sha256` of `json.dumps(..., sort_keys=True, separators=(',',':'))` on the same 6-tuple) → identical 64-hex **MATCH**; 64 hex verified; `[0-9A-F]{64}` format check passed; stored uppercase.
- **Validator** (pre-write + post-write):
  - PRE-WRITE `python scripts/bug_issue_validate.py --repo . --check-acceptance` → `[BUG_VALIDATION_OK]` **exit 0** (before any mutation of `docs/product/backlog.md` / `docs/product/acceptance.md` / `handoffs/resume_brief.md` / `docs/engineering/state.md` / `handoffs/po_to_tl.md`).
  - POST-WRITE `python scripts/bug_issue_validate.py --repo . --check-acceptance` → `[BUG_VALIDATION_OK]` **exit 0**; `--print-next-id` → **BUG-0035** (confirming 3 new rows BUG-0032/0033/0034 in ascending order).
  - INTAKE-EVIDENCE `python scripts/intake_evidence_validate.py --file …` → `[INTAKE_EVIDENCE_VALIDATION_OK]` **exit 0** for each of the three JSON bundles.
- **Intake evidence (durable artifacts)**:
  - `handoffs/intake_evidence/BUG-0032-intake-20261003T153600Z.json` (intake_run_id `po-opencode-20261003-BUG0032-intake`; small-intake-pack; INTAKE_WORK_ITEM_KIND=bug; 5 topics covered, distinct-quoted per BUG-0007)
  - `handoffs/intake_evidence/BUG-0033-intake-20261003T153600Z.json` (intake_run_id `po-opencode-20261003-BUG0033-intake`; small-intake-pack; INTAKE_WORK_ITEM_KIND=bug; 5 topics covered, distinct-quoted per BUG-0007)
  - `handoffs/intake_evidence/BUG-0034-intake-20261003T153600Z.json` (intake_run_id `po-opencode-20261003-BUG0034-intake`; small-intake-pack; INTAKE_WORK_ITEM_KIND=bug; 5 topics covered, distinct-quoted per BUG-0007)
- **Handoff surface (this intake)**:
  - `handoffs/resume_brief.md` — PO_INTAKE_PASS top pointer PREPENDED (prior US-0156/S0162 SEGMENT_TERMINAL entry preserved below, not erased).
  - `handoffs/po_to_tl.md` — PO→TL handoff PREPENDED (prior "Architecture handoff — US-0145" entry preserved below, not erased).
  - `docs/engineering/state.md` — this intake-checkpoint block APPENDED at the very bottom (append-bottom, never rewrite, US-0058/DEC-0040).
- **UNTOUCHED (this intake)**: `.its-magic/config.json` (L317-L320 live/baseline values NOT mutated — operator action only); `.cursor/scratchpad.md` (L639-L640 NOT mutated); `.cursor/scratchpad copy.md` (read-only evidence for BUG-0032); `.opencode/commands/*` + template (read-only evidence for BUG-0033); `.cursor/commands/*` + template (read-only evidence for BUG-0033); `scripts/data/autonomy_stop_matrix.yaml` (L174-L231 UNTOUCHED; BUG-0034 is registry registration, done in `/research`/`/architecture`/`/sprint-plan`); `docs/engineering/reason_codes.md` UNTOUCHED; `docs/engineering/runbook.md` UNTOUCHED; `scripts/autonomy_repair_lib.py` (or active surface) UNTOUCHED; `docs/engineering/architecture.md` UNTOUCHED (no `# BUG-0032` / `# BUG-0033` / `# BUG-0034` H1 authored; that is `/architecture`'s job); `docs/engineering/research.md` UNTOUCHED (no R-xxxx allocated; that is `/research`'s job); `docs/engineering/decisions.md` UNTOUCHED (no DEC authored; none needed at intake); `decisions/DEC-*` UNTOUCHED (none authored, none amended); `tests/*` UNTOUCHED (no `test_bug0032_*` / `test_bug0033_*` / `test_bug0034_*` authored; that is sprint-plan/execute's job); `sprints/*` UNTOUCHED (no S0xxx materialized; that is `/sprint-plan`'s job); `package.json` / `installer.{py,sh,ps1}` / `CHANGELOG.md` / `packaging/*` / `.gitignore` / `.env` UNTOUCHED; `.opencode/agents/*` + template / `.cursor/agents/*` + template UNTOUCHED; `.opencode/tui.json` `"plugin": []` (BUG-0030/DEC-0151) UNTOUCHED; `.opencode/plugins/orchestrator.ts` UNTOUCHED; `.tmp_finding.json` / `tmp_proof.json` / `__pycache__/*` UNTOUCHED (pre-existing dirty state). **US-0156 DONE (backlog L5789 `Status: DONE` + AC-1..10 `[x]`; acceptance L185 `[x]`) — HOLD, NOT reopened.** **US-0154-US-0155 OPEN (L5748+) — HOLD, NOT mutated.** **BUG-0016/0021/0023/0024/0025/0030 DONE — HOLD, NOT reopened.** **BUG-0026/0028/0029 OPEN — HOLD, NOT drained, NOT mutated.** **BUG-0022/0027/0031 DONE — HOLD, NOT reopened.** US-0045 / US-0119 / US-0120 / US-0122 / US-0124 / US-0125 / US-0126 ALL UNTOUCHED.
- **Hard guards honored**: no live probe (UAT_PROBE_FORBIDDEN); no npm publish (`npm_published=false`; kit 0.1.10 unchanged); no git push (`SYNC_POLICY_MODE=disabled`); no `.env` read; no subagent spawn (INTAKE_SUBAGENT_FALLBACK=deny); no `/auto` recursion; no role substitution; no bash-bypass of deny-by-default (DEC-0152); intake-boundary terminal per BUG-0006 / US-0048 isolation contract.
- **Stop**: **STOP after PO_INTAKE_PASS.** Three new BUG rows registered (BUG-0032 P0 / BUG-0033 P1 / BUG-0034 P1) — all **OPEN**, all **unchecked** in `docs/product/acceptance.md`. No downstream phase executed. Operator / orchestrator owns the next segment (top candidate **BUG-0032 (P0)** → `/research`; or operator may re-order / batch). Do NOT spawn `/research`, `/architecture`, `/sprint-plan`, `/execute`, `/qa`, `/verify-work`, `/release`, `/closure`, `/close`, `/refresh-context`, or `/auto` from this PO-intake segment (BUG-0006 / US-0048). Do NOT flip any `- [ ]`→`- [x]` (intake = register, not close — US-0045).

### Decision gate (operator / TL — NOT decided by this intake)

For the operator to decide before the next `/research` segment begins:

1. **BUG-0034 repair-kind choice**: `auto_repair_kind=disambiguate_state` (matrix L196-L200, STATE_PHASE_AMBIGUOUS analogue; "pick last-known phase is safe when unambiguous") **OR** `auto_repair_kind=auto_refresh_brief` (matrix L202-L206, RESUME_BRIEF_MISSING analogue; "regenerate brief from state.md is safe when RESUME_BRIEF_AUTO_REFRESH=1") — **TL to decide in BUG-0034's `/research`**. Both are defensible for a PO-closure precondition conflict; both are existing US-0119 matrix values (no new `auto_repair_kind` needed).
2. **Priority ordering**: as registered — **BUG-0032 (P0) → BUG-0033 (P1) → BUG-0034 (P1)**; operator may re-order or batch `/research` runs.
3. **BUG-0033 scope**: closure-first per operator direction; the other four thin/rich pairs (ask, auto, refresh-context, execute) are the same bug (one vertical parity fix across the five named files). The remaining thin/rich pairs (intake, qa, verify-work, discovery, sprint-plan, research, plan-verify, quick, release, architecture) — same story's `/research` audit or follow-up slice — **TL to choose**.

---

