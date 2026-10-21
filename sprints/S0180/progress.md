# Sprint S0180 progress — BUG-0036

- status: **QA_PASS**
- verdict: QA_PASS; decision_gate=false; next_scheduled_phase=verify-work; next_scheduled_role=qa
- harness: `tests/report.md` 2026-10-16T20:03:04Z Pass 874 / Fail 8 (foreign scratchpad byte mismatch and `README_FEATURE_COVERAGE_GAP:BUG-0029` only). Own contract 7 passed.
- tasks: T-anch and T-001..T-006 checked (7)
- bug: BUG-0036 remains **OPEN**. AC-1..AC-5 remain unchecked. Closure owns the DONE flip.
- plan-verify: skipped (`ultra_lean_not_in_resolved_phase_plan`); no `plan-verify.json`

## T-anch baseline (before product edits)

- BUG-0036 OPEN. AC-1..AC-5 unchecked in `docs/product/backlog.md` and the acceptance row.
- `scripts/repairable_blocker_lib.py`, `template/scripts/repairable_blocker_lib.py`, and `tests/bug0036_repairable_blocker_contract_test.py` were absent.
- `RESUME_BRIEF_STALE` in `scripts/data/autonomy_stop_matrix.yaml` was `security_hard`, `auto_repair_kind=n/a`, cap 0. `execute_harness_blocked_out_of_scope` was not a YAML code.
- Live and template scratchpads assigned `AUTONOMY_STOP_POLICY=block` and `RESUME_BRIEF_AUTO_REFRESH=0`.
- S0176 is BUG-0028, S0177 is BUG-0026, S0178 is BUG-0029, S0179 is US-0162, S0180 is BUG-0036.
- No product code in T-anch. BUG-0026, BUG-0029, and US-0162 were not edited.

## Implementation

- T-001..T-004: `scripts/repairable_blocker_lib.py` and the template twin. Predicate, three-value dispatch, cap 3, foreign-harness quarantine, expired-proof spawn request, fail-closed predicates, US-0092 deny. The library does not read the scratchpad and does not call the matrix repair helpers.
- T-005: `tests/bug0036_repairable_blocker_contract_test.py`. Seven `test_bug0036_*` markers. `python -m pytest tests/bug0036_repairable_blocker_contract_test.py -q` → 7 passed.
- T-006: both `auto.md` copies call `classify_before_terminal_stale` before the terminal stale vocabulary. Both matrix docs carry the same overlay. YAML and both scratchpads were not edited. Contract re-run stayed green.
