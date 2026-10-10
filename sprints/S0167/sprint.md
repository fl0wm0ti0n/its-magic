# Sprint S0167 — BUG-0034 PO closure-precondition registry and bounded state disambiguation

## Metadata

| Field | Value |
|---|---|
| sprint_id | **S0167** (next available: S0166 exists; `sprints/S0167/` was absent) |
| bug_id | BUG-0034 — **OPEN**, P1; backlog AC-1..AC-7 and acceptance row remain unchecked |
| status | PLANNED |
| current_phase | sprint-plan complete |
| delivery_mode | ultra_lean; plan-verify is skipped and merged at `/qa` |
| research_anchor | **R-0158** (DQ1-DQ3 locked; consume, do not re-decide) |
| architecture_anchor | `docs/engineering/architecture.md` `# BUG-0034` |
| companion_DEC | none; the registration consumes DEC-0119 taxonomy and creates no new decision |
| task_count | 8 (T-anch + T-001..T-007; within `SPRINT_MAX_TASKS=12`) |
| fresh_context_marker | `tl-BUG0034-sprintplan-20261005T111500Z-fresh` |

## Goal and locked design

Register exactly one `PO_CLOSURE_PRECONDITION_CONFLICT` row beside
`STATE_PHASE_AMBIGUOUS` in `scripts/data/autonomy_stop_matrix.yaml`:

```yaml
code: PO_CLOSURE_PRECONDITION_CONFLICT
stop_class: autonomy_resolvable
auto_repair_kind: disambiguate_state
cap: 3
rationale: Closure preconditions can be selected only from one already-evidenced state; ambiguous or paired-brief evidence remains fail-closed.
```

`disambiguate_state` may select only a single, existing, validated
closure-precondition state. It cannot manufacture a phase or prerequisite,
change backlog/acceptance, edit a brief, use state as fallback evidence, or
schedule a child. `auto_refresh_brief` is prohibited because
`RESUME_BRIEF_AUTO_REFRESH=0`. A non-unique selection is `RESUME_AMBIGUOUS`
(security-hard); syntax failure is `RESUME_BRIEF_UNPARSEABLE`; every other
missing, stale, conflicting, unauthorized, replayed, proof-invalid, or
isolation-invalid pair is `RESUME_BRIEF_STALE` with its predicate retained.
Cap exhaustion is the existing `AUTONOMY_REPAIR_CAP_EXHAUSTED`.

The closure dispatch must resolve the YAML classification and use the existing
`scripts/autonomy_repair_ledger_lib.py` flow and
`handoffs/autonomy_repair_ledger/<orchestrator_run_id>.jsonl`. It counts by
`(orchestrator_run_id, reason_code)`, resolves the matrix cap unless an
authorized positive-integer `AUTONOMY_REPAIR_CAP_OVERRIDE` applies, and emits
`autonomy_relaxed: PO_CLOSURE_PRECONDITION_CONFLICT -> disambiguate_state` only
after a real unique success. No second ledger or PO-specific bypass is allowed.

## Scope

### In scope

1. One active machine row in `scripts/data/autonomy_stop_matrix.yaml`.
2. Byte-identical active/template operator-matrix documentation in
   `docs/engineering/autonomy-stop-matrix.md`.
3. Byte-identical active/template additive BUG-0034/US-0119 row in
   `docs/engineering/reason_codes.md` and no-refresh remediation in
   `docs/engineering/runbook.md`.
4. Existing ledger and closure-dispatch integration, including matrix-cap and
   authorized-override handling, without a parallel ledger.
5. Active/template byte-identical fixture/mock `test_bug0034_*` eight-marker
   contract suite.
6. Regression and invariant guards plus QA/verify-work/release handoff evidence.

### Out of scope / standing guards

- This phase does not implement source, test, matrix, ledger, or runbook work;
  those are execute tasks.
- Do not mutate `.its-magic/config.json`, `.cursor/scratchpad.md`, or `.env`.
- Do not flip BUG-0034 status, tick any backlog/acceptance AC, or author closure
  evidence; closure exclusively owns those actions.
- US-0119 and US-0120 are compose-only: preserve `AUTONOMY_PRESET=none`, all
  twelve feature flags, `INTAKE_AUTONOMY_MODE=0`,
  `INTAKE_SUBAGENT_FALLBACK=deny`, and every `security_hard` row including its
  `n/a`/cap-0 invariant.
- Do not restore TUI/RPC/JSON command-template/localhost surfaces; do not
  publish, push, claim a live-host result, recurse `/auto`, or spawn a child.
- No new DEC is authorized. BUG-0031, BUG-0005, BUG-0032, BUG-0033, US-0119,
  US-0120, and all sibling status/acceptance surfaces remain untouched.

## Acceptance coverage

| Acceptance criterion | Planned task coverage |
|---|---|
| AC-1 matrix row, kind, cap, rationale | T-001, T-002, T-005 |
| AC-2 US-0119 reason-code row and matching kind | T-003, T-005 |
| AC-3 operator remediation | T-003, T-005 |
| AC-4 matrix-resolved ledger cap/override/count/audit | T-004, T-005 |
| AC-5 architecture entry remains additive | T-anch |
| AC-6 eight markers, validator, US-0119/US-0120 regressions | T-005, T-006 |
| AC-7 intake/default/security invariants unchanged | T-006 |
| Handoff evidence and downstream isolation | T-007 |

All numbered criteria have planned coverage; no `PLAN_AC_COVERAGE_GAP` exists.

## Task summaries and execution order

1. **T-anch — locked baseline/no-op:** Read-only verify R-0158, `# BUG-0034`,
   OPEN/unchecked BUG-0034, existing matrix/ledger APIs, active/template pair
   inventory, existing continuation classifications, and compose invariants.
2. **T-001 — machine registry row:** Add the sole locked YAML row beside
   `STATE_PHASE_AMBIGUOUS`; preserve taxonomy, all existing rows, and
   security-hard rows.
3. **T-002 — operator-matrix documentation pair:** Add the row and updated count
   to active/template `autonomy-stop-matrix.md`; prove byte identity.
4. **T-003 — reason-code/runbook documentation pairs:** Add the US-0119
   cross-reference and no-refresh remediation to active/template twins; direct
   pair failures to a fresh authorized child, never a hand edit or parent repair.
5. **T-004 — ledger and closure dispatch:** Resolve the matrix row and effective
   cap in the existing generic ledger/dispatch path; retain per-run/token audit,
   authorized override validation, cap exhaustion, and success-only breadcrumb.
6. **T-005 — eight-marker contract suites:** Author byte-identical active/template
   fixture/mock suites proving the matrix, docs pairs, no-refresh semantics,
   ledger cap/override/audit, and negative classifications.
7. **T-006 — regressions and invariant guards:** Run the planned BUG-0034 suite,
   `bug_issue_validate.py --check-acceptance`, and US-0119/US-0120 regressions;
   prove no security, configuration, intake, or sibling mutation.
8. **T-007 — downstream handoff evidence:** Record execute evidence for fresh QA,
   verify-work, and release consumers; plan-verify remains deferred for
   ultra_lean and no downstream child is spawned by this phase.

## Test contract

The byte-identical active/template `tests/bug0034_autonomy_stop_matrix_test.py`
pair must contain these eight fixture/mock markers (no live probe):

1. `test_bug0034_matrix_row_autonomy_resolvable`
2. `test_bug0034_disambiguate_state_only_no_auto_refresh`
3. `test_bug0034_matrix_cap_three_and_rationale`
4. `test_bug0034_operator_matrix_active_template_parity`
5. `test_bug0034_reason_code_active_template_parity`
6. `test_bug0034_runbook_no_refresh_active_template_parity`
7. `test_bug0034_ledger_matrix_cap_override_audit_and_success_breadcrumb`
8. `test_bug0034_negative_pair_codes_and_compose_invariants`

The final marker covers `RESUME_AMBIGUOUS`,
`RESUME_BRIEF_UNPARSEABLE`, `RESUME_BRIEF_STALE`, disabled refresh, validator,
US-0119/US-0120 regression, and the no-security/no-config/no-intake/no-sibling
mutation proof.

## Completion gate

- [ ] One matrix row has exactly the locked code/class/kind/cap/rationale; no
      security-hard row, taxonomy, or unrelated matrix row changes.
- [ ] Active/template autonomy-matrix, reason-code, and runbook pairs are
      byte-identical and carry the locked documentation/remediation.
- [ ] Existing ledger/closure dispatch resolves matrix cap plus only an
      authorized override; it records this token/kind and never bypasses audit.
- [ ] `autonomy_relaxed` is emitted only after a real uniquely evidenced success;
      failures and cap exhaustion emit no success breadcrumb.
- [ ] Eight active/template `test_bug0034_*` markers pass using fixtures/mocks.
- [ ] Invalid pair semantics remain exact: syntax only is
      `RESUME_BRIEF_UNPARSEABLE`; every other invalid predicate is
      `RESUME_BRIEF_STALE`; ambiguity remains `RESUME_AMBIGUOUS`.
- [ ] US-0119/US-0120 regressions and acceptance validator pass; all locked
      default, intake, security-hard, configuration, and sibling guards hold.
- [ ] BUG-0034 stays OPEN and all ACs remain unchecked pending closure.

## Next phase

`/execute` in a fresh **dev** context for BUG-0034/S0167 only. This sprint-plan
phase neither implements nor runs tests, changes status/acceptance, or spawns.
**STOP.**
