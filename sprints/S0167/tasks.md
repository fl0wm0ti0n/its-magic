# Sprint S0167 — Task checklist (BUG-0034)

Eight planned tasks: T-anch + T-001..T-007, within `SPRINT_MAX_TASKS=12`.
Execute only in the listed order. Every task is `[ ]` PLANNED; this plan claims
no implementation, test execution, QA, release, or closure result.

## Checklist

- [ ] **T-anch — locked baseline/no-op (DC):** Read-only consume R-0158 and
  `# BUG-0034`; verify BUG-0034 OPEN/unchecked, the existing matrix/ledger and
  continuation-code shapes, pair inventory, and compose invariants. No mutation.
- [ ] **T-001 — matrix registration (AC-1):** Add exactly
  `PO_CLOSURE_PRECONDITION_CONFLICT` beside `STATE_PHASE_AMBIGUOUS` as
  `autonomy_resolvable` / `disambiguate_state` / cap `3` with the locked
  rationale. Preserve every security-hard and taxonomy invariant.
- [ ] **T-002 — operator-matrix active/template pair (AC-1, AC-5):** Add the
  same row and revised count to both `autonomy-stop-matrix.md` surfaces and
  assert byte identity.
- [ ] **T-003 — reason-code and runbook active/template pairs (AC-2, AC-3,
  AC-7):** Register the US-0119 repair-kind row and remediation that selects
  only a unique evidenced state, forbids refresh/fallback/reconciler/hand edit,
  and requires a fresh authorized child for invalid pairs.
- [ ] **T-004 — generic ledger and dispatch integration (AC-4):** Use the
  resolved matrix cap and authorized positive integer override in the existing
  ledger/closure path; preserve `(run, reason_code)` accounting, cap exhaustion,
  audit fields, and success-only breadcrumb. No parallel PO route.
- [ ] **T-005 — eight-marker active/template fixtures (AC-1..AC-6):** Author
  the planned byte-identical `test_bug0034_*` pair and fixtures for matrix/docs
  parity, no-refresh classifications, ledger cap/override/audit/breadcrumb, and
  negative continuation evidence.
- [ ] **T-006 — regression/invariant gate (AC-6, AC-7):** Run planned BUG-0034,
  US-0119, US-0120, and acceptance-validator checks; demonstrate the twelve
  flags, preset default, intake settings, security-hard rows, configuration,
  and sibling status/AC surfaces are untouched.
- [ ] **T-007 — QA/verify/release handoff evidence:** Persist the execute
  evidence and explicit fresh-role handoff expectations. Plan-verify is deferred
  to `/qa` for ultra_lean; this task does not spawn anything.

## Planned evidence / guard checklist

- [ ] YAML row and active/template operator documentation express the same lock.
- [ ] Reason-code/runbook twins are byte-identical and reject every prohibited
      refresh/reconciliation/manual-parent path.
- [ ] Existing ledger path uses matrix cap/authorized override and emits no
      success breadcrumb for ambiguity, invalid evidence, failure, or exhaustion.
- [ ] All eight active/template marker groups pass using fixtures/mocks only.
- [ ] Syntax maps only to `RESUME_BRIEF_UNPARSEABLE`; all other invalid/stale/
      missing/conflicting/unauthorized/replay/proof predicates map to
      `RESUME_BRIEF_STALE`; ambiguity remains `RESUME_AMBIGUOUS`.
- [ ] No config/scratchpad/.env access or mutation; no status/acceptance flip;
      no security-hard, US-0119, US-0120, twelve-flag, or intake-setting change.
- [ ] No TUI/RPC/JSON command-template/localhost restoration, live-host claim,
      publish, push, `/auto`, or child spawn.

## Execute evidence

_Pending — a fresh `/execute` dev context owns source/test/matrix/runbook work
and records commands/results. This planning artifact makes no execution claim._
