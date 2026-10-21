# UAT — Sprint S0180 / BUG-0036

- **verdict**: **VERIFY_PASS**
- **phase_id**: verify-work
- **role**: qa
- **uat_lifecycle**: populated
- **timestamp**: 2026-10-16T20:19:08Z
- **fresh_context_marker**: `qa-BUG0036-vw-20261016T201908Z-fresh`
- **bug status**: BUG-0036 stays **OPEN**. AC-1..AC-5 stay unchecked in `docs/product/backlog.md`. The acceptance row stays unchecked. Closure owns the DONE flip.
- **results**: 6 pass / 0 fail (UAT-1..UAT-5 plus `convergence_smoke`). Live probe classes waived `UAT_PROBE_FORBIDDEN`. `contract_test_failed=0`. Kit harness Fail 8 is the named foreign set and is not a S0180 fail-closed reason.

## Target

BUG-0036 (OPEN). Primary acceptance row in `docs/product/acceptance.md` stays unchecked.

## Steps

| Step | AC | Description | Result |
|---|---|---|---|
| UAT-1 | AC-1 | When repair is possible the automatic flow continues; under `block` the same members stay terminal. | pass |
| UAT-2 | AC-2 | Foreign harness failures, `execute_harness_blocked_out_of_scope`, and `RESUME_BRIEF_STALE` after an expired proof are in scope together. | pass |
| UAT-3 | AC-3 | Hardness is the existing `AUTONOMY_STOP_POLICY` values and the stop is not absolute when repair is possible. | pass |
| UAT-4 | AC-4 | Contract tests cover the locked `test_bug0036_*` shape. | pass |
| UAT-5 | AC-5 | A later member of this class follows the same predicate, and env reads, npm publish, and git push are not performed. | pass |
| convergence_smoke | — | Convergence smoke surrogate — waived-probe slice with green contract-test harness. | pass |

## Results summary

Independent re-run: `python -m pytest tests/bug0036_repairable_blocker_contract_test.py -q` **7 passed / 0 failed** in 0.12s. UAT counts: **6 pass / 0 fail**. `contract_test_failed=0`. Live probe classes `browser_smoke`, `api_health`, `process_health`, `cli_smoke`, `build`, and `manual_operator` stay `UAT_PROBE_FORBIDDEN`. Cited harness `tests/report.md` `2026-10-16T20:03:04Z` is Pass 874 / Fail 8. Those eight rows are the pre-existing foreign scratchpad byte mismatch and `README_FEATURE_COVERAGE_GAP:BUG-0029`. They are not a fail-closed reason for S0180.

R-0170 A1 holds: `AUTONOMY_STOP_POLICY` is reused, the live value is `block`, no new scratchpad key was added, `RESUME_BRIEF_AUTO_REFRESH` stays 0, and DEC-0153 stays Accepted. Quarantine and expired-proof repair run only on a repair value. `block` stays terminal.

Acceptance mapping: UAT-1 → AC-1, UAT-2 → AC-2, UAT-3 → AC-3, UAT-4 → AC-4, UAT-5 → AC-5. Backlog boxes stay `[ ]`. Evidence: `sprints/S0180/uat.json`, `sprints/S0180/qa-findings.md`.
