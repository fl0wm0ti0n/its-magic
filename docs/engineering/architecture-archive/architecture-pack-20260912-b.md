# Architecture archive pack (2026-09-12)

- Rollover trigger: `ARCH_HOT_MAX_LINES=3000, ARCH_HOT_MAX_STORY_SECTIONS=120`
- Source: `docs/engineering/architecture.md`
- Archived units (oldest first, contiguous prefix): 2
- Retained units in hot file: 21
- First archived heading: `# US-0127 — Convergence critic conjunct: blocking-only semantics plus non-blocking auto-resolve at phase PASS`
- Last archived heading: `# US-0128 — Convergence smoke surrogate for contract-test and waived-probe UAT slices`
- Verification tuple (mandatory):
  - archived_body_lines=263
  - preamble_lines=1
  - retained_body_lines=2975

---

# US-0127 — Convergence critic conjunct: blocking-only semantics plus non-blocking auto-resolve at phase PASS

## Overview

**US-0127** is a sovereign-loop convergence drift fix. `_critic_jsonl_has_open` in `scripts/sovereign_convergence_lib.py` (lines 318–331) treats every `status=open` row as unmet and defaults `blocking=True` when the key is absent — so ~280 informational `status=open, blocking=false` PASS concurrence rows currently block `CONVERGENCE_CROSS_REVIEWER_OPEN` despite US-0110 L3 conjunct-3 requiring "no open **blocking** cross-reviewer findings". The fix aligns the helper with `sovereign_critic_lib.read_open_blocking(repo)` (DEC-0104 §11) and DEC-0110 §10, auto-resolves non-blocking findings at `/sovereign-critic` PASS, and ships an operator-only hygiene CLI plus contract tests and runbook/reason-code docs.

This is an **additive code + docs + parity + contract-test** change: one convergence lib helper narrows from "any open" to "open+blocking" (AC-1), one auto-resolve hook fires at `/sovereign-critic` PASS with zero blocking findings (AC-2), one new `scripts/sovereign_critic_hygiene.py` (+ template mirror) with `--report` / `--resolve-nonblocking-for-run` / `--dry-run` / `--self-test` / `--all-phases` and 6 deterministic reason codes (AC-3), 13 `test_us0127_*` markers in `tests/us0127_contract_test.py` (+ template mirror) (AC-4), runbook `### Blocking-only conjunct-3 semantics (US-0127)` + `### Hygiene CLI (US-0127)` subsections + `reason_codes.md` `## US-0127` section (active + template byte-identical) (AC-5), and `SOVEREIGN_CRITIC_PAIRS` additive extension + `--scope=sovereign-critic` parity CLI extension (AC-6). No new DEC (see Companion DEC below).

**Research anchor**: **R-0110** (DQ1–DQ8 LOCKED). **Companion DEC**: **none** (align with DEC-0110 §10 / DEC-0104 §11; new DEC would duplicate governance).

**Fresh context marker**: `tl-US0127-architecture-20260825T184100Z-fresh`
**Orchestrator run id**: `auto-20260825-01`
**Timestamp**: 2026-08-25T18:41:00Z (UTC)
**Verdict**: PASS
**Next**: `/sprint-plan` (after critic)

## Approach locked (A1 — from R-0110 DQ1–DQ8)

**Approach A1** (locked): Narrow `_critic_jsonl_has_open` to delegate to `sovereign_critic_lib.read_open_blocking(repo)` (or inline its exact two-clause AND `obj.get("blocking") and obj.get("status") == "open"`). Change `_eval_critic_resolved` dispatch (DQ6): when `handoffs/sovereign_critic_findings.jsonl` exists and is non-empty, the JSONL blocking-only predicate is authoritative and `_qa_findings_has_open_critic` is NOT consulted; when JSONL absent, fall back to the unchanged QA-markdown grep heuristic; when neither deployed, informational skip per US-0110 L3 degrade matrix. Add an auto-resolve hook at the end of `/sovereign-critic` (after `reconcile_findings` + JSONL append + isolation evidence, before `## Stop conditions`): when `read_open_blocking(repo) == []`, call `auto_resolve_nonblocking_for_run(repo, orchestrator_run_id, phase_id)` which iterates same-run same-phase `status=open, blocking=false` rows and sets `status=resolved` via `sovereign_critic_lib.resolve_finding` (idempotent; audit trail preserved; `SOVEREIGN_CRITIC_AUTORESOLVE_FAILED` is non-blocking informational). Ship `scripts/sovereign_critic_hygiene.py` (+ template mirror) as operator-only surface with `--report` / `--resolve-nonblocking-for-run <id>` / `--dry-run` / `--confirm` / `--self-test` / `--all-phases` / `--phase-id <id>` and 6 reason codes. 13 `test_us0127_*` markers. Runbook subsections + reason_codes.md section (active + template byte-identical). `SOVEREIGN_CRITIC_PAIRS` additive row for the hygiene script; `--scope=sovereign-critic` parity CLI extended.

|| Option | Summary | Verdict |
|--------|---------|---------|
| **A1** | **Narrow helper + JSONL-authoritative dispatch + auto-resolve hook + hygiene CLI + 13 markers + runbook/reason-code docs + parity** | **Preferred** — additive; composes read-only with US-0104/US-0110/US-0107; AC-1..AC-6 provable via static + fixture contract tests; no new DEC. |
| A2 (rejected) | Widen `read_open_blocking` to accept a non-blocking flag | **Rejected** — violates compose-do-not-amend on US-0104 `read_open_blocking` signature (DQ7). |
| A3 (rejected) | Drop `_critic_jsonl_has_open` entirely and inline `read_open_blocking` at every call site | **Rejected** — diverges from the single-helper pattern; harder to regression-test. |
| A4 (rejected) | Auto-resolve via a background scheduler instead of at `/sovereign-critic` PASS | **Rejected** — adds concurrency risk (R1) without operator benefit; PASS-bounded hook is deterministic. |
| A5 (rejected) | Hygiene CLI as a `--scope` on an existing script | **Rejected** — breaks the one-script-per-concern pattern. |
| A6 (rejected) | Companion DEC-0127 locking the `(orchestrator_run_id, phase_id)` scope key | **Rejected** — R-0110 recommends no DEC; scope key is already implied by the 15-field schema (R-0092) + US-0104 `reconcile_findings` per-run partitioning; new DEC would duplicate DEC-0104/DEC-0110 governance. |
## Components

### Convergence lib fix (DQ1+DQ6 LOCKED — AC-1)

`scripts/sovereign_convergence_lib.py` (+ `template/scripts/sovereign_convergence_lib.py` byte-identical mirror): replace `_critic_jsonl_has_open` body with a delegate to `sovereign_critic_lib.read_open_blocking(repo)` (import; do not redefine). Change `_eval_critic_resolved` dispatch: JSONL authoritative when present; QA-markdown fallback when JSONL absent; informational skip when neither deployed. `_qa_findings_has_open_critic` and `_qa_has_cross_reviewer_section` predicates unchanged (compose read-only on US-0104 derived surfaces).

### Auto-resolve hook (DQ1 LOCKED — AC-2)

`.cursor/commands/sovereign-critic.md` (+ template mirror): add a single conditional call at the end of the command after `reconcile_findings` + JSONL append + isolation evidence, before `## Stop conditions`: `if read_open_blocking(repo) == []: auto_resolve_nonblocking_for_run(repo, orchestrator_run_id, phase_id)`. `auto_resolve_nonblocking_for_run` helper added to `sovereign_critic_lib.py` (additive; does not amend `read_open_blocking`/`resolve_finding` signatures). Scope key = `(orchestrator_run_id, phase_id)` pair on the finding row. Idempotent re-run via `resolve_finding` no-op. `SOVEREIGN_CRITIC_AUTORESOLVE_FAILED` is non-blocking informational (PASS verdict stands).

### Hygiene CLI (DQ2+DQ5 LOCKED — AC-3)

New `scripts/sovereign_critic_hygiene.py` (+ `template/scripts/sovereign_critic_hygiene.py` byte-identical mirror). Surface inventory: `--report`, `--resolve-nonblocking-for-run <orchestrator_run_id>`, `--dry-run`, `--confirm`, `--self-test`, `--all-phases`, `--phase-id <phase_id>`. 6 reason codes (`HYGIENE_RESOLVE_CONFIRM_REQUIRED` exit 2, `HYGIENE_RESOLVE_NO_CANDIDATES` exit 0 info, `HYGIENE_RESOLVE_PARTIAL` exit 3, `HYGIENE_RESOLVE_FAILED` exit 4, `HYGIENE_REPORT_EMPTY` exit 0 info, `HYGIENE_RESOLVE_PHASE_SCOPE_REQUIRED` exit 2). Operator-only posture — `/auto` orchestrator does NOT call it during a run.

### Contract tests (DQ3 LOCKED — AC-4)

`tests/us0127_contract_test.py` (+ `template/tests/us0127_contract_test.py` byte-identical mirror). 13 markers: 10 from DQ3 (open+nonblocking PASS, open+blocking FAIL, auto-resolve idempotent, audit-trail preserved, skip when blocking open, scope-key run/phase, hygiene --report, hygiene --dry-run, hygiene confirm-required, hygiene --self-test) + 2 compose regression guards (marker 11 `test_us0127_compose_us0104_read_open_blocking_unchanged`, marker 12 `test_us0127_compose_us0110_conjunct3_contract`) + marker 13 `test_us0127_validate_rejects_missing_blocking` (R2 validator regression guard, accepted per Q1).

### Operator docs (DQ4 LOCKED — AC-5)

`docs/engineering/runbook.md` + `template/docs/engineering/runbook.md` (byte-identical): new `### Blocking-only conjunct-3 semantics (US-0127)` subsection after `### Evaluate convergence` (L2792) and before `### Interpret goal_progress block` (L2811); new `### Hygiene CLI (US-0127)` subsection after `#### Parity enforcement` (L2915) and before `#### Related artifacts` (L2923). `docs/engineering/reason_codes.md` + template mirror: new `## US-0127: Convergence critic conjunct hygiene (DEC-0110 §10 / DEC-0104 §11)` section after the US-0110 section (L77–L107) with the 6 hygiene reason codes + `SOVEREIGN_CRITIC_AUTORESOLVE_FAILED` (info) + clarifying note that `CONVERGENCE_CROSS_REVIEWER_OPEN` now requires `blocking=true` (description amendment only; no US-0110 reason-code renumbering).

### Template parity (DQ5 LOCKED — AC-6)

`docs/engineering/runbook.md` § `#### Parity enforcement` pair table (L2921): `SOVEREIGN_CRITIC_PAIRS` additive row `scripts/sovereign_critic_hygiene.py` ↔ `template/scripts/sovereign_critic_hygiene.py`. `SOVEREIGN_CONVERGENCE_PAIRS` existing rows confirmed (no new row — convergence lib mirror already present). `scripts/check_intake_template_parity.py` `--scope=sovereign-critic` extended to include the hygiene script pair; `--scope=sovereign-convergence` unchanged.

## Companion DEC = none

**No companion DEC required.** US-0127 is an implementation-drift fix aligning `_critic_jsonl_has_open` with the already-governed US-0110 L3 conjunct-3 contract (DEC-0110 §10) and `read_open_blocking` predicate (DEC-0104 §11). The five-conjunct structure, degrade matrix, findings JSONL schema, and reason-code inventory are unchanged. Auto-resolve + hygiene CLI are additive operator surfaces consistent with DEC-0110 §10 "evaluate_convergence reads composed surfaces" and DEC-0104 §11 "findings JSONL is the canonical register". A new DEC would duplicate governance already captured in DEC-0104 / DEC-0110. The `(orchestrator_run_id, phase_id)` scope key is already implied by the 15-field schema (R-0092) + US-0104 `reconcile_findings` per-run partitioning. (Per R-0110 §Companion DEC recommendation.)

## Risks finalized (R1–R6)

- **R1 (HIGH)**: Auto-resolve rewrites JSONL in place — concurrent `/sovereign-critic` + hygiene CLI writes could clobber rows. Mitigation: document operator-only-when-quiet contract in runbook `### Hygiene CLI (US-0127)` subsection (Q3 accepted: no advisory lock; `/auto` is single-threaded per repo; `resolve_finding` already uses read-all + rewrite-all).
- **R2 (MEDIUM)**: `_critic_jsonl_has_open` removal could mask a future regression where `blocking` key is absent. Mitigation: marker 13 `test_us0127_validate_rejects_missing_blocking` (validator regression guard; Q1 accepted: 13 markers).
- **R3 (MEDIUM)**: Hygiene CLI `--resolve-nonblocking-for-run` with `--confirm` could resolve rows from a different phase if `--phase-id` omitted. Mitigation: `--all-phases` flag + `HYGIENE_RESOLVE_PHASE_SCOPE_REQUIRED` reason code (Q2 accepted).
- **R4 (LOW–MEDIUM)**: Runbook section anchor drift. Mitigation: tests grep h2/h3 titles, not line numbers.
- **R5 (LOW)**: Template parity gap. Mitigation: `--scope=sovereign-critic` parity CLI extension + `SOVEREIGN_CRITIC_PAIRS` additive row.
- **R6 (LOW)**: `CONVERGENCE_CROSS_REVIEWER_OPEN` description amendment misread as US-0110 schema change. Mitigation: clarifying note in `reason_codes.md` "compose amendment to description only; code semantics already require `blocking=true` per DEC-0110 §10".
## Compose, do not amend (verified 8/8)

| Story | Surface | Verification |
|-------|---------|--------------|
| US-0104 | `sovereign_critic_lib.read_open_blocking` / `resolve_finding` / findings JSONL schema / `build_qa_cross_reviewer_block` / `sovereign_critic_validate.py` | compose read-only — US-0127 consumes read-only; no signature/schema/reconciliation/lens changes (DQ7) |
| US-0110 | five-conjunct structure / degrade matrix / `CONVERGENCE_CROSS_REVIEWER_OPEN` reason code | compose read-only — only `_critic_jsonl_has_open` helper narrows; conjunct name/order/shape unchanged (DQ8) |
| US-0107 | deferral register / drain-generate / sovereign loop stop matrix | compose read-only — untouched; `zero_deferrals` conjunct upstream of `critic_resolved` (DQ8) |
| US-0045 | canonical closure (DONE/acceptance/release) | compose read-only — US-0127 does not mutate backlog Status/ACs |
| US-0048 / BUG-0006 | fresh-context isolation | compose read-only — architecture subagent fresh; no prior chat carried |
| US-0053 / DEC-0035 | narrow-read phase context | compose read-only — started at phase-context.md + US-0127 anchor; no full-file reads |
| US-0103 / DEC-0103 | AI Decision Ledger | compose read-only — architecture phase does not write ledger entries |
| US-0056 | runtime proof | compose read-only — architecture issues its own proof; producer proof consumed before TTL |

## Sprint seeds (8 tasks within SPRINT_MAX_TASKS=12 — for `/sprint-plan` refinement)

- **T-anch** (architecture.md `# US-0127` anchor — RESOLVED in THIS phase + compose-do-not-amend verification; NO-OP / verification)
- **T-001** (AC-1 — `scripts/sovereign_convergence_lib.py` `_critic_jsonl_has_open` -> delegate to `read_open_blocking` + `_eval_critic_resolved` JSONL-authoritative dispatch per DQ6; + template mirror)
- **T-002** (AC-2 — `.cursor/commands/sovereign-critic.md` auto-resolve hook at PASS + `sovereign_critic_lib.auto_resolve_nonblocking_for_run` helper; + template mirror)
- **T-003** (AC-3 — new `scripts/sovereign_critic_hygiene.py` + `template/scripts/sovereign_critic_hygiene.py` with `--report` / `--resolve-nonblocking-for-run` / `--dry-run` / `--confirm` / `--self-test` / `--all-phases` / `--phase-id` + 6 reason codes)
- **T-004** (AC-4 — `tests/us0127_contract_test.py` 13 markers + `template/tests/us0127_contract_test.py` mirror)
- **T-005** (AC-5 — runbook `### Blocking-only conjunct-3 semantics (US-0127)` + `### Hygiene CLI (US-0127)` subsections + `reason_codes.md` `## US-0127` section; active + template byte-identical)
- **T-006** (AC-6 — `SOVEREIGN_CRITIC_PAIRS` additive row + `check_intake_template_parity.py --scope=sovereign-critic` extension)
- **T-007** (R2 — validator regression guard marker 13 `test_us0127_validate_rejects_missing_blocking` + confirm `sovereign_critic_validate.py --enforce` rejects missing `blocking`)

Execution order: T-anch -> T-001 -> T-002 -> T-003 -> T-004 -> T-005 -> T-006 -> T-007 (acyclic; T-001 first since it is the root-cause fix; T-002 depends on T-001's predicate; T-003/T-004 build on T-002; T-005/T-006 are docs/parity; T-007 is the validator regression guard).

## Isolation evidence (US-0048 / DEC-0029)

- `phase_id=architecture`, `role=tech-lead`, `story_id=US-0127`, `sprint_id=(pending — created at sprint-plan)`, `orchestrator_run_id=auto-20260825-01`
- `delivery_mode=ultra_lean`, `macro_phase=plan` (architecture — second canonical phase of `plan` macro per US-0096 / DEC-0082)
- `model_id=glm-5.2-high` (CROSS_MODEL_REVIEW=1 — required; isolation MUST include model_id)
- `fresh_context_marker=tl-US0127-architecture-20260825T184100Z-fresh`, `timestamp=2026-08-25T18:41:00Z` (UTC)
- `evidence_ref=docs/product/backlog.md (## US-0127 L4402–L4436 narrow-read), docs/engineering/research.md (## R-0110 L10203–L10353 narrow-read), docs/engineering/phase-context.md, handoffs/po_to_tl.md, docs/engineering/architecture.md (grep ^# US- anchors + US-0126 section L1747–L2051 boundary read), docs/engineering/state.md (top narrow-read for drain-advance prose shape)`
- Tech-lead subagent spawned fresh per BUG-0006 / US-0048 isolation; no prior chat history carried forward. Context limited to the narrow-read files listed above (US-0053 / US-0096 Tranche A). No MCP / browser / shell side-effects beyond narrow-read grep + read tool calls + python SHA-256 computation for the strict runtime proof + powershell line-count computations + the artifact writes listed in this phase. No `.env` reads, no credentials access, no intake-evidence mutation.
- `assemble_sovereign_memory_digest(...)` NOT called (US-0127 is a drift-fix story; existing digest context sufficient per R-0110).
- No write to `mistakes.jsonl` in architecture phase.
- Prior phase strict proof consumed: `rp-auto-20260825-01-research-tech-lead-20260825T183641Z-US-0127-reattest` (from `docs/engineering/research.md` R-0110 producer consumed tuple, unchanged).
- Current architecture-phase strict proof recorded below.

## Strict runtime proof (mirror)

- `runtime_proof_id=rp-auto-20260825-01-architecture-tech-lead-20260825T184100Z-US-0127`
- Canonical payload (sorted-key JSON per DEC-0038, lowercase keys): `{"delivery_mode":"ultra_lean","macro_phase":"plan","model_id":"glm-5.2-high","orchestrator_run_id":"auto-20260825-01","phase_id":"architecture","proof_issued_at":"2026-08-25T18:41:00Z","proof_ttl_seconds":3600,"role":"tech-lead","runtime_proof_id":"rp-auto-20260825-01-architecture-tech-lead-20260825T184100Z-US-0127","sprint_id":"(pending)","story_id":"US-0127"}`
- `proof_hash=DF773DDFBA1021C5DBD44F0470469BD76A909C1373FC528BAEA65070CB9A179C` (SHA-256)
- `proof_ttl_seconds=3600`, `proof_ttl=2026-08-25T19:41:00Z` (UTC)

## Decision gate + next scheduled phase

- `decision_gate=false` (no DECISION_GATE; no hard stop; companion DEC: none per R-0110 recommendation; approach A1 locked; sprint seeds T-anch + T-001..T-007 within SPRINT_MAX_TASKS=12; risks R1–R6 finalized; compose-do-not-amend verified 8/8; Q1/Q2/Q3 accepted per research recommendations: 13 markers / yes --all-phases / no advisory lock)
- `next_scheduled_phase=/sprint-plan` (role=tech-lead per US-0069 / DEC-0051 phase->role matrix default; third canonical phase of `plan` macro per ultra_lean; research + architecture + sprint-plan merged into `plan` macro — after sovereign-critic of architecture)
- `next_scheduled_role=tech-lead`
- `stop_condition=STOP after architecture completes; hand off via artifacts only to sovereign-critic of architecture, then /sprint-plan in fresh tech-lead subagent (BUG-0006). Do not spawn /sprint-plan from this subagent. Do not mark US-0127 DONE. Do not tick acceptance. Do not mutate intake JSON. Do not amend US-0104/US-0110/US-0107 surfaces.`

# US-0128 — Convergence smoke surrogate for contract-test and waived-probe UAT slices

## Overview

**US-0128** is a sovereign-loop convergence drift fix for the `smoke_green` conjunct (DEC-0110 §10). `_eval_smoke_green` in `scripts/sovereign_convergence_lib.py` (lines 459–470) PASSes only when `_report_passes(repo / REPORT_PATH)` AND `_uat_smoke_passes(uat)` both hold. `_uat_smoke_passes` (lines 443–456) requires at least one step whose `id`/`probe_kind`/`probe_type`/`expected` contains the substring "smoke" (via `_step_is_smoke`, lines 435–440) with `result` in `pass|passed|ok`. For ultra_lean/docs/contract-test slices (e.g., S0126 US-0126), the active `uat.json` documents all 6 live-runtime probe classes as `UAT_PROBE_FORBIDDEN` in `waived_probes[]` and emits NO smoke-named step — the slice is green (`tests/report.md` Fail:0, `contract_test_failed=0`, all steps PASS) but `_uat_smoke_passes` returns `False`, so `smoke_green` FAILs with `CONVERGENCE_SMOKE_PROBE_FAIL`, blocking `SOVEREIGN_GOAL_MODE=goal_convergence` for docs/contract-test slices despite there being no live runtime to smoke.

The fix: add a surrogate evaluation branch to `_eval_smoke_green` that PASSes when (a) `tests/report.md` Fail:0, (b) active `uat.json` exists, (c) all 6 canonical live-runtime probe classes (`browser_smoke`, `api_health`, `process_health`, `cli_smoke`, `build`, `manual_operator`) are waived with `reason_code=UAT_PROBE_FORBIDDEN`, (d) `contract_test_failed=0` (top-level authoritative; derived from `contract_test_passed == contract_test_total` fallback), and (e) a canonical surrogate step exists (`id=convergence_smoke` preferred, or tail step with `probe_kind=contract_tests_primary` and `result=pass`). Legacy path unchanged: a real smoke-named step PASS still satisfies the conjunct (precedence case 1). `CONVERGENCE_SMOKE_PROBE_FAIL` retained for real smoke step failures and US-0109 deploy smoke. New `CONVERGENCE_SMOKE_SURROGATE_MISSING` for surrogate prerequisites unmet (cases 4–8). US-0109 deploy smoke precedence is orthogonal and unchanged (case 9).

This is an **additive code + docs + parity + contract-test** change: one surrogate branch inside `_eval_smoke_green` (AC-1), canonical `convergence_smoke` uat step emitted by `/qa` and `/verify-work` for ultra_lean/docs/contract-test slices (AC-2), fail-closed `CONVERGENCE_SMOKE_SURROGATE_MISSING` reason code (AC-3), additive `### Convergence smoke surrogate (US-0128)` subsections in `.cursor/commands/qa.md` and `.cursor/commands/verify-work.md` (+ template mirrors) (AC-4), 11 `test_us0128_*` markers in `tests/us0128_contract_test.py` (+ template mirror) (AC-5), runbook `### Smoke surrogate for waived-probe UAT slices (US-0128)` subsection + `reason_codes.md` `## US-0128` section (active + template byte-identical) (AC-6), and `SOVEREIGN_CONVERGENCE_PAIRS` additive rows for `qa.md` ↔ `template/.cursor/commands/qa.md` and `verify-work.md` ↔ `template/.cursor/commands/verify-work.md` plus `--scope=sovereign-convergence` extension (AC-6). No new DEC (see Companion DEC below).

**Research anchor**: **R-0111** (DQ1–DQ8 LOCKED). **Companion DEC**: **none** (align with DEC-0110 §10 smoke-green definition and DEC-0078 UAT probe contract; new DEC would duplicate governance).

**Fresh context marker**: `tl-US0128-architecture-2026-08-26T195500Z-fresh`
**Orchestrator run id**: `auto-20260826-01`
**Timestamp**: 2026-08-26T19:55:00Z (UTC)
**Verdict**: PASS
**Next**: `/sprint-plan` (after critic)

## Approach locked (A1 — from R-0111 DQ1–DQ8)

**Approach A1** (locked): Add a surrogate evaluation branch to `_eval_smoke_green` in `scripts/sovereign_convergence_lib.py` (+ `template/scripts/sovereign_convergence_lib.py` byte-identical mirror). Implementation: check legacy path first via `_uat_smoke_passes(uat)`; if PASS, return PASS (precedence case 1). If legacy FAIL, evaluate surrogate prerequisites: (a) `tests/report.md` Fail:0 via `_report_passes`, (b) active `uat.json` exists, (c) `waived_probes[]` contains all 6 canonical live-runtime probe classes (`browser_smoke`, `api_health`, `process_health`, `cli_smoke`, `build`, `manual_operator`) with `reason_code=UAT_PROBE_FORBIDDEN`, (d) `contract_test_failed == 0` (top-level authoritative; derived from `contract_test_passed == contract_test_total` when top-level absent; fail closed with `CONVERGENCE_SMOKE_SURROGATE_MISSING` when neither present), (e) surrogate step exists (`id=convergence_smoke` with `result=pass` preferred, OR tail step with `probe_kind=contract_tests_primary` and `result=pass`). If surrogate prerequisites met, return PASS. If surrogate prerequisites unmet, return FAIL with `CONVERGENCE_SMOKE_SURROGATE_MISSING` (no smoke step exists) OR `CONVERGENCE_SMOKE_PROBE_FAIL` (smoke step exists but failed — case 2). `ConjunctResult(name="smoke_green", …)` shape unchanged — the surrogate branch is an additional PASS path inside the same conjunct. Update `.cursor/commands/qa.md` and `.cursor/commands/verify-work.md` (+ template mirrors) with additive `### Convergence smoke surrogate (US-0128)` subsections under `## Self-verify UAT probes (US-0092 / DEC-0078)` after `### Browser UAT self-test (US-0093)` and before `## Steps`; emission rule: for ultra_lean/docs/contract-test slices where all 6 live-runtime probe classes are waived with `UAT_PROBE_FORBIDDEN`, `/qa` and `/verify-work` MUST emit a `convergence_smoke` step in `sprints/Sxxxx/uat.json` `steps[]` with `probe_kind=contract_tests_primary`, `result=pass` (when `contract_test_failed=0`), and document the surrogate basis in `waived_probes[]` (6 entries, `UAT_PROBE_FORBIDDEN`). 11 `test_us0128_*` markers in `tests/us0128_contract_test.py` (+ template mirror). Runbook `### Smoke surrogate for waived-probe UAT slices (US-0128)` subsection after `### Blocking-only conjunct-3 semantics (US-0127)` and before `### Interpret goal_progress block`; `reason_codes.md` `## US-0128: Convergence smoke surrogate (DEC-0110 §10 smoke-green)` section after the US-0127 section and before `## US-0104`. `SOVEREIGN_CONVERGENCE_PAIRS` additive rows for `qa.md` ↔ `template/.cursor/commands/qa.md` and `verify-work.md` ↔ `template/.cursor/commands/verify-work.md`; `--scope=sovereign-convergence` extended to include the two new command-mirror pairs. US-0109 deploy smoke precedence orthogonal and unchanged (case 9).

|| Option | Summary | Verdict |
|--------|---------|---------|
| **A1** | **Surrogate branch in `_eval_smoke_green` + `convergence_smoke` uat step + `CONVERGENCE_SMOKE_SURROGATE_MISSING` + qa.md/verify-work.md additive subsections + 11 markers + runbook/reason-code docs + `SOVEREIGN_CONVERGENCE_PAIRS` +2 command rows** | **Preferred** — additive; composes read-only with US-0109/US-0126/US-0110/US-0127; AC-1..AC-6 provable via static + fixture contract tests; no new DEC. |
| A2 (rejected) | Use `id=convergence_surrogate` (does not contain "smoke") so surrogate branch is the sole PASS path | **Rejected** — loses defense-in-depth; R-0111 DQ2/Q3 recommends `id=convergence_smoke` so `_step_is_smoke` legacy path also converges on PASS, documenting the waived-probe contract via the surrogate branch (Q3 accepted: `convergence_smoke`). |
| A3 (rejected) | Relax `_uat_smoke_passes` to accept any `probe_kind=contract_tests_primary` step as smoke | **Rejected** — conflates contract-test probes with smoke probes; weakens the smoke conjunct for webapp slices that emit contract-test steps without a real smoke step. |
| A4 (rejected) | Auto-emit a synthetic smoke step from the convergence lib when waived_probes are complete | **Rejected** — convergence lib is read-only on `uat.json`; the step emission owner is `/qa`/`/verify-work` (DQ5). Lib-side synthesis violates separation of concerns. |
| A5 (rejected) | Drop the surrogate step requirement and PASS on waived_probes + green harness alone | **Rejected** — removes the operator-traceability hook (marker/evidence_ref) and the explicit gate that documents the waived-probe contract; R-0111 DQ2 requires the surrogate step as the canonical emission. |
| A6 (rejected) | Companion DEC-0128 locking the 6-class canonical waived-probe inventory as normative | **Rejected** — R-0111 §Companion DEC recommendation: no DEC; the 6-class inventory is already implied by the probe catalog in `.cursor/commands/verify-work.md` (line 113–114) minus `test`, and the S0126 fixture is the canonical reference. New DEC would duplicate DEC-0110 §10 / DEC-0078 governance. |

## Components

### Surrogate eval branch (DQ1+DQ3+DQ4 LOCKED — AC-1)

`scripts/sovereign_convergence_lib.py` (+ `template/scripts/sovereign_convergence_lib.py` byte-identical mirror): add a surrogate branch inside `_eval_smoke_green` (lines 459–470). Legacy `_uat_smoke_passes` (lines 443–456) and `_step_is_smoke` (lines 435–440) unchanged. Surrogate predicate reads `waived_probes[]` (6 canonical classes with `UAT_PROBE_FORBIDDEN`), `contract_test_failed` (top-level authoritative; derived fallback from `contract_test_passed == contract_test_total`), and surrogate step (`id=convergence_smoke` OR tail `probe_kind=contract_tests_primary` with `result=pass`). `ConjunctResult(name="smoke_green", …)` shape unchanged — surrogate is an additional PASS path inside the same conjunct.

### Canonical uat step (DQ2+DQ5 LOCKED — AC-2)

`.cursor/commands/qa.md` + `.cursor/commands/verify-work.md` (+ `template/.cursor/commands/qa.md` + `template/.cursor/commands/verify-work.md` byte-identical mirrors): additive `### Convergence smoke surrogate (US-0128)` subsection inside `## Self-verify UAT probes (US-0092 / DEC-0078)`, after `### Browser UAT self-test (US-0093)`, before `## Steps`. Emission rule: for ultra_lean/docs/contract-test slices where all 6 live-runtime probe classes are waived with `UAT_PROBE_FORBIDDEN`, `/qa`/`/verify-work` MUST emit `{"id": "convergence_smoke", "description": "Convergence smoke surrogate — waived-probe slice with green contract-test harness", "result": "pass", "marker": "test_us0128_convergence_smoke_surrogate", "evidence_ref": "tests/report.md Fail:0 + uat.json waived_probes[] (6 classes, UAT_PROBE_FORBIDDEN)", "probe_kind": "contract_tests_primary"}` in `sprints/Sxxxx/uat.json` `steps[]` when `contract_test_failed=0`; emit `result=fail` when `contract_test_failed>0` (convergence lib surfaces `CONVERGENCE_SMOKE_SURROGATE_MISSING`). No change to existing `## Self-verify UAT probes` prose, `### Browser UAT self-test` block, or `## Steps` numbering.

### Fail-closed reason code (DQ3+DQ4 LOCKED — AC-3)

`docs/engineering/reason_codes.md` (+ `template/docs/engineering/reason_codes.md` byte-identical mirror): new `## US-0128: Convergence smoke surrogate (DEC-0110 §10 smoke-green)` section after the US-0127 section and before `## US-0104`. Add `CONVERGENCE_SMOKE_SURROGATE_MISSING` (blocked_by=yes) — "smoke green — surrogate prerequisites unmet for waived-probe slice (no smoke step + incomplete waivers or harness red)". Add clarifying note on the US-0110 `CONVERGENCE_SMOKE_PROBE_FAIL` row (description only, not a schema change): "reserved for real smoke step failures and US-0109 deploy smoke; surrogate path uses `CONVERGENCE_SMOKE_SURROGATE_MISSING`". `CONVERGENCE_SMOKE_PROBE_FAIL` description unchanged.

### Contract tests (DQ6 LOCKED — AC-5)

`tests/us0128_contract_test.py` (+ `template/tests/us0128_contract_test.py` byte-identical mirror). 11 markers (Q1 accepted: 11 markers per research recommendation — defense in depth on US-0109/US-0110/US-0127 compose):

1. `test_us0128_surrogate_passes_when_all_six_waived_and_green` — 6 waived_probes (UAT_PROBE_FORBIDDEN) + `contract_test_failed=0` + `convergence_smoke` step `result=pass` + `tests/report.md` Fail:0 → `_eval_smoke_green` returns `status=pass`, no reason code.
2. `test_us0128_surrogate_missing_when_no_step` — 6 waived + green but NO `convergence_smoke` step and no `probe_kind=contract_tests_primary` tail pass → `status=fail, reason_code=CONVERGENCE_SMOKE_SURROGATE_MISSING`.
3. `test_us0128_surrogate_missing_when_harness_fail` — 6 waived + `contract_test_failed>0` + no smoke step → `status=fail, reason_code=CONVERGENCE_SMOKE_SURROGATE_MISSING` (NOT PROBE_FAIL — no smoke step exists).
4. `test_us0128_surrogate_missing_when_partial_waivers` — only 3 of 6 waived + no smoke step → surrogate does NOT activate; `reason_code=CONVERGENCE_SMOKE_SURROGATE_MISSING`.
5. `test_us0128_real_smoke_step_pass_wins_over_surrogate` — real smoke-named step `result=pass` → `_eval_smoke_green` PASS via legacy path (surrogate not consulted); waived_probes irrelevant.
6. `test_us0128_real_smoke_step_fail_uses_probe_fail_not_surrogate_missing` — real smoke-named step `result=fail` → `reason_code=CONVERGENCE_SMOKE_PROBE_FAIL` (NOT SURROGATE_MISSING — smoke step exists and failed).
7. `test_us0128_compose_us0109_deploy_smoke_unchanged` — US-0109 deploy smoke path semantics unchanged; surrogate branch does not activate when deploy smoke applies (regression guard vs `tests/us0109_contract_test.py`).
8. `test_us0128_template_parity_convergence_lib_and_commands` — `scripts/sovereign_convergence_lib.py` ↔ `template/scripts/sovereign_convergence_lib.py` byte-identical after AC-1 fix; `.cursor/commands/qa.md` ↔ `template/.cursor/commands/qa.md` and `.cursor/commands/verify-work.md` ↔ `template/.cursor/commands/verify-work.md` byte-identical after DQ5 subsection add.
9. `test_us0128_compose_us0110_five_conjunct_unchanged` — `_eval_smoke_green` still emits `ConjunctResult(name="smoke_green", …)` with the same shape; `tests/us0110_contract_test.py` 8/8 still pass (no conjunct renumbering, no schema change). The surrogate branch is an additional PASS path inside the same conjunct.
10. `test_us0128_compose_us0127_critic_conjunct_unchanged` — `_eval_critic_resolved` (US-0127) unchanged; `tests/us0127_contract_test.py` 13/13 still pass. US-0128 touches `smoke_green` only, not `critic_resolved`.
11. `test_us0128_compose_us0126_waived_probe_fixture_reference_only` — `sprints/S0126/uat.json` is read as a reference fixture for `waived_probes[]` shape; US-0126 DONE product scope and S0126 release artifacts are NOT mutated by US-0128 (regression guard).

**Total**: 11 markers (8 + 3 compose regression). Accepted per Q1 (research recommendation: 11, defense in depth on US-0109/US-0110/US-0127 compose).

### Operator docs (DQ7 LOCKED — AC-6)

`docs/engineering/runbook.md` + `template/docs/engineering/runbook.md` (byte-identical): new `### Smoke surrogate for waived-probe UAT slices (US-0128)` subsection inside `## Goal-Based Convergence (US-0110 / DEC-0110)`, after `### Blocking-only conjunct-3 semantics (US-0127)`, before `### Interpret goal_progress block`. Document: (a) surrogate eligibility (all 6 live-runtime probe classes waived with `UAT_PROBE_FORBIDDEN`); (b) surrogate step contract (`convergence_smoke` id preferred, or `probe_kind=contract_tests_primary` tail with `result=pass`); (c) `contract_test_failed=0` requirement (top-level authoritative, derived fallback); (d) precedence (real smoke step wins; deploy smoke US-0109 unchanged; partial waivers fail closed); (e) remediation for `CONVERGENCE_SMOKE_SURROGATE_MISSING` (emit `convergence_smoke` step in `/qa`/`/verify-work`; ensure 6 waived_probes; fix failing contract tests). `docs/engineering/reason_codes.md` + template mirror: new `## US-0128` section per AC-3 above.

### Template parity (DQ8 LOCKED — AC-6)

`docs/engineering/runbook.md` § `### Parity enforcement` pair table and `scripts/check_intake_template_parity.py` `SOVEREIGN_CONVERGENCE_PAIRS` (lines 538–547): additive rows:
- `scripts/sovereign_convergence_lib.py` ↔ `template/scripts/sovereign_convergence_lib.py` (existing — confirm byte-identity after AC-1 surrogate branch add; guarded by marker 8)
- `scripts/sovereign_convergence_validate.py` ↔ `template/scripts/sovereign_convergence_validate.py` (existing — unchanged)
- `.cursor/commands/qa.md` ↔ `template/.cursor/commands/qa.md` (**new** — US-0128 DQ5 surrogate subsection)
- `.cursor/commands/verify-work.md` ↔ `template/.cursor/commands/verify-work.md` (**new** — US-0128 DQ5 surrogate subsection)

`SOVEREIGN_CRITIC_PAIRS` unchanged (no critic surface touched by US-0128). `scripts/check_intake_template_parity.py` `--scope=sovereign-convergence` extended to include the two new command-mirror pairs (additive); `--scope=sovereign-critic` unchanged; `all` scope auto-includes the new pairs via existing `SCOPES["all"]` concatenation.

## Companion DEC = none

**No companion DEC required.** US-0128 is an additive surrogate branch inside the already-governed US-0110 `smoke_green` conjunct (DEC-0110 §10). The five-conjunct structure, conjunct name/order, `ConjunctResult` shape, and `CONVERGENCE_SMOKE_PROBE_FAIL` reason code are unchanged. The new `CONVERGENCE_SMOKE_SURROGATE_MISSING` reason code is additive and falls under the US-0110 §10 smoke-green definition (the conjunct now has two PASS paths: real smoke step, or surrogate for waived-probe slices). The command contract edits (qa.md, verify-work.md) are additive subsections under the existing `## Self-verify UAT probes (US-0092 / DEC-0078)` block, governed by DEC-0078. A new DEC would duplicate governance already captured in DEC-0110 §10 (smoke-green definition) and DEC-0078 (UAT probe contract). The 6-class canonical waived-probe inventory is already implied by the probe catalog in `.cursor/commands/verify-work.md` (line 113–114) minus `test`, and the S0126 fixture is the canonical reference. Locks suffice. (Per R-0111 §Companion DEC recommendation.)

## Risks finalized (R1–R7)

- **R1 (HIGH)**: Surrogate path could mask a real smoke regression if `waived_probes[]` is over-broad (e.g., a webapp slice incorrectly waives `browser_smoke`). Mitigation: surrogate path activates ONLY when ALL 6 live-runtime probe classes are waived AND no smoke-named step exists AND `contract_test_failed=0`. A webapp slice with a real smoke step uses the legacy path (DQ4 case 1/2 — real smoke step wins). Marker 5 guards "real smoke step pass wins over surrogate"; marker 7 guards "US-0109 deploy smoke unchanged".
- **R2 (MEDIUM)**: `contract_test_failed` field absent in older uat.json fixtures (pre-S0126). Mitigation: derive from `contract_test_passed == contract_test_total` when top-level absent (DQ3); fail closed with `CONVERGENCE_SMOKE_SURROGATE_MISSING` when neither present (DQ4 case 8). Document in runbook DQ7 subsection.
- **R3 (MEDIUM)**: Partial-waiver case (some of 6 waived, some not) is ambiguous — could mean a probe was forgotten. Mitigation: fail closed `CONVERGENCE_SMOKE_SURROGATE_MISSING` (DQ4 case 6). Document in runbook. Marker 4 guards.
- **R4 (LOW–MEDIUM)**: Runbook section anchor drift — `### Blocking-only conjunct-3 semantics (US-0127)` could shift before US-0128 ships. Mitigation: marker greps h2 `## Goal-Based Convergence (US-0110 / DEC-0110)` + h3 `### Smoke surrogate for waived-probe UAT slices (US-0128)` by text, not line number.
- **R5 (LOW)**: Template parity gap — command mirrors (`qa.md`, `verify-work.md`) not in `SOVEREIGN_CONVERGENCE_PAIRS`. Mitigation: DQ8 additive rows + `--scope=sovereign-convergence` extension + marker 8 byte-identity guard.
- **R6 (LOW)**: Surrogate step `id=convergence_smoke` contains "smoke" → `_step_is_smoke` picks it up, so `_uat_smoke_passes` returns True independently of the surrogate branch. This is intentional (defense in depth) but could confuse a future reader. Mitigation: runbook DQ7 subsection explicitly documents that the surrogate step IS a smoke step and the surrogate branch is the documented gate that also checks waived_probes + contract_test_failed.
- **R7 (LOW)**: S0126 fixture does NOT carry `probe_kind` on `steps[]` — the tail fallback (DQ2) cannot match S0126 as-is. Mitigation: S0126 is a reference fixture for `waived_probes[]` shape only; new slices emit the explicit `convergence_smoke` step (preferred path). Marker 11 guards S0126 not mutated. The tail fallback is for future slices that emit `probe_kind` on contract-test steps without an explicit `convergence_smoke` id.

## Compose, do not amend (verified 8/8)

| Story | Surface | Verification |
|-------|---------|--------------|
| US-0109 | deploy smoke post-publish path / `DEPLOY_SMOKE_*` reason codes | ✓ compose — surrogate path applies to `/qa`/`/verify-work` UAT slice only; deploy smoke step emitted by `/release` unchanged; marker 7 regression guard |
| US-0126 | `sprints/S0126/uat.json` waived-probe fixture / S0126 release artifacts | ✓ compose — reference fixture for `waived_probes[]` shape only; US-0126 DONE product scope NOT reopened; marker 11 regression guard |
| US-0127 | `_eval_critic_resolved` / `read_open_blocking` / hygiene CLI / `SOVEREIGN_CRITIC_PAIRS` | ✓ compose — US-0128 touches `smoke_green` only, not `critic_resolved`; marker 10 regression guard; `SOVEREIGN_CRITIC_PAIRS` unchanged |
| US-0110 | five-conjunct structure / degrade matrix / `CONVERGENCE_SMOKE_PROBE_FAIL` | ✓ compose — surrogate branch is an additional PASS path inside `smoke_green`; conjunct name/order/shape unchanged; marker 9 regression guard; `CONVERGENCE_SMOKE_SURROGATE_MISSING` is additive |
| US-0104 | critic findings JSONL / `read_open_blocking` / `resolve_finding` | ✓ compose — US-0128 does not touch critic surfaces |
| US-0045 | canonical closure (DONE/acceptance/release) | ✓ compose — US-0128 does not mutate backlog Status/ACs; architecture appends `# US-0128` section only |
| US-0048 / BUG-0006 | fresh-context isolation | ✓ compose — architecture subagent fresh; no prior chat carried |
| US-0056 | runtime proof | ✓ compose — architecture issues its own proof; producer proof consumed before TTL |

## Sprint seeds (8 tasks within SPRINT_MAX_TASKS=12 — for `/sprint-plan` refinement)

- **T-anch** (architecture.md `# US-0128` anchor — RESOLVED in THIS phase + compose-do-not-amend verification; NO-OP / verification)
- **T-001** (AC-1 — `scripts/sovereign_convergence_lib.py` `_eval_smoke_green` surrogate branch per DQ1+DQ3+DQ4 (legacy path first; surrogate prerequisites: 6 waived_probes UAT_PROBE_FORBIDDEN + `contract_test_failed=0` + surrogate step); + `template/scripts/sovereign_convergence_lib.py` byte-identical mirror)
- **T-002** (AC-2+AC-4 — `.cursor/commands/qa.md` + `.cursor/commands/verify-work.md` additive `### Convergence smoke surrogate (US-0128)` subsections under `## Self-verify UAT probes (US-0092 / DEC-0078)` after `### Browser UAT self-test (US-0093)` before `## Steps`; emission rule for `convergence_smoke` step; + `template/.cursor/commands/qa.md` + `template/.cursor/commands/verify-work.md` byte-identical mirrors)
- **T-003** (AC-3 — `docs/engineering/reason_codes.md` new `## US-0128: Convergence smoke surrogate (DEC-0110 §10 smoke-green)` section with `CONVERGENCE_SMOKE_SURROGATE_MISSING` + clarifying note on US-0110 `CONVERGENCE_SMOKE_PROBE_FAIL` row; + `template/docs/engineering/reason_codes.md` byte-identical mirror)
- **T-004** (AC-5 — `tests/us0128_contract_test.py` 11 markers + `template/tests/us0128_contract_test.py` byte-identical mirror)
- **T-005** (AC-6 — runbook `### Smoke surrogate for waived-probe UAT slices (US-0128)` subsection after `### Blocking-only conjunct-3 semantics (US-0127)` before `### Interpret goal_progress block`; + `template/docs/engineering/runbook.md` byte-identical mirror)
- **T-006** (AC-6 — `SOVEREIGN_CONVERGENCE_PAIRS` additive rows for `qa.md` ↔ `template/.cursor/commands/qa.md` and `verify-work.md` ↔ `template/.cursor/commands/verify-work.md` + `check_intake_template_parity.py --scope=sovereign-convergence` extension)
- **T-007** (R1+R3 — regression guards: marker 5 `test_us0128_real_smoke_step_pass_wins_over_surrogate` + marker 7 `test_us0128_compose_us0109_deploy_smoke_unchanged` + marker 4 `test_us0128_surrogate_missing_when_partial_waivers` — verify surrogate path does not mask real smoke regressions or partial waivers)

Execution order: T-anch -> T-001 -> T-002 -> T-003 -> T-004 -> T-005 -> T-006 -> T-007 (acyclic; T-001 first since it is the root-cause fix; T-002 depends on T-001's surrogate predicate; T-003/T-004 build on T-002's contract; T-005/T-006 are docs/parity; T-007 is the R1/R3 regression guard).

## Isolation evidence (US-0048 / DEC-0029)

- `phase_id=architecture`, `role=tech-lead`, `story_id=US-0128`, `sprint_id=(pending — created at sprint-plan)`, `orchestrator_run_id=auto-20260826-01`
- `delivery_mode=ultra_lean`, `macro_phase=plan` (architecture — second canonical phase of `plan` macro per US-0096 / DEC-0082)
- `model_id=glm-5.2-high` (CROSS_MODEL_REVIEW=1 — required; isolation MUST include model_id)
- `fresh_context_marker=tl-US0128-architecture-2026-08-26T195500Z-fresh`, `timestamp=2026-08-26T19:55:00Z` (UTC)
- `evidence_ref=docs/product/backlog.md (## US-0128 L4440–L4474 narrow-read), docs/engineering/research.md (## R-0111 L10365–L10514 narrow-read), docs/product/vision.md (## Discovery Notes — US-0128 L2072–L2099 narrow-read), docs/engineering/phase-context.md, handoffs/po_to_tl.md, docs/engineering/architecture.md (grep ^# US- anchors + US-0127 section L1852–L1970 boundary read for insertion point + US-0091 L1972 boundary), docs/engineering/state.md (research checkpoint L1112–L1192 narrow-read for producer proof tuple + isolation evidence shape)`
- Tech-lead subagent spawned fresh per BUG-0006 / US-0048 isolation; no prior chat history carried forward. Context limited to the narrow-read files listed above (US-0053 / US-0096 Tranche A). No MCP / browser / shell side-effects beyond narrow-read grep + read tool calls + python SHA-256 computation for the strict runtime proof + powershell line-count computations + the artifact writes listed in this phase. No `.env` reads, no credentials access, no intake-evidence mutation.
- `assemble_sovereign_memory_digest(...)` NOT called (US-0128 is a drift-fix story; existing digest context sufficient per R-0111).
- No write to `mistakes.jsonl` in architecture phase.
- Prior phase strict proof consumed: `rp-auto-20260826-01-research-tech-lead-2026-08-26T194816Z-US-0128` (proof_hash `BFE452C73D2921AE65A67C989CD397415F0D821CE87801AB33F915DB41240308` — independently recomputed MATCH via Python 3.12 hashlib sorted-key compact lowercase-keys JSON; consumed at 2026-08-26T19:55:00Z before RUNTIME_PROOF_STALE ttl 2026-08-26T20:48:16Z).
- Current architecture-phase strict proof recorded below.

## Strict runtime proof (mirror)

- `runtime_proof_id=rp-auto-20260826-01-architecture-tech-lead-2026-08-26T195500Z-US-0128`
- Canonical payload (sorted-key compact JSON per DEC-0038, lowercase keys): `{"delivery_mode":"ultra_lean","macro_phase":"plan","model_id":"glm-5.2-high","orchestrator_run_id":"auto-20260826-01","phase_id":"architecture","proof_issued_at":"2026-08-26T19:55:00Z","proof_ttl_seconds":3600,"role":"tech-lead","runtime_proof_id":"rp-auto-20260826-01-architecture-tech-lead-2026-08-26T195500Z-US-0128","sprint_id":"pending","story_id":"US-0128"}`
- `proof_hash=FF499010B78C4FB7855E9D6F4482227AD7B258230671D67E4E2B42571A68A969` (SHA-256)
- `proof_ttl_seconds=3600`, `proof_ttl=2026-08-26T20:55:00Z` (UTC)

## Decision gate + next scheduled phase

- `decision_gate=false` (no DECISION_GATE; no hard stop; companion DEC: none per R-0111 recommendation; approach A1 locked; sprint seeds T-anch + T-001..T-007 within SPRINT_MAX_TASKS=12; risks R1–R7 finalized; compose-do-not-amend verified 8/8; Q1 accepted per research recommendation: 11 markers / `id=convergence_smoke` / `CONVERGENCE_SMOKE_SURROGATE_MISSING` in new US-0128 reason-code section + clarifying note on US-0110 `CONVERGENCE_SMOKE_PROBE_FAIL` row)
- `next_scheduled_phase=/sprint-plan` (role=tech-lead per US-0069 / DEC-0051 phase->role matrix default; third canonical phase of `plan` macro per ultra_lean; research + architecture + sprint-plan merged into `plan` macro — after sovereign-critic of architecture)
- `next_scheduled_role=tech-lead`
- `stop_condition=STOP after architecture completes; hand off via artifacts only to sovereign-critic of architecture, then /sprint-plan in fresh tech-lead subagent (BUG-0006). Do not spawn /sprint-plan from this subagent. Do not mark US-0128 DONE. Do not tick acceptance L156. Do not mutate intake JSON. Do not reopen US-0127. Do not amend US-0104/US-0110/US-0109/US-0126 surfaces. Do not mutate US-0129/US-0130.`

