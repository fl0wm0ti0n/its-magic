# QA Findings — S0180 / BUG-0036

## Verdict — **QA_PASS**

- **verdict**: **QA_PASS**
- **decision_gate**: false
- **blocking findings**: 0
- **fail-closed reason**: none
- **phase_id**: qa
- **role**: qa
- **bug_id**: BUG-0036
- **story_id**: (none)
- **sprint_id**: S0180
- **implementation_loop_index**: 0
- **outer_cycle_index**: 6
- **timestamp**: 2026-10-16T20:12:30Z
- **fresh_context_marker**: `qa-BUG0036-qa-20261016T201230Z-fresh`
- **runtime_proof_id**: `rp-auto-20261016-bug0036-qa-qa-20261016T201230Z-BUG-0036`
- **proof_hash**: `c3961929ae3ab728c0f3fc934bd486c2f8c823865ed0b33b9cb76e797c2af201`
- **proof_issued_at**: 2026-10-16T20:12:30Z
- **proof_ttl_seconds**: 3600
- **model_id**: omit
- **model_provenance**: `provenance=host=cursor;path=.cursor/scratchpad.local.md;step=MODEL_TIER_<PHASE>`
- **CROSS_MODEL_REVIEW**: 0
- **next_scheduled_phase**: verify-work
- **next_scheduled_role**: qa
- **status guard**: BUG-0036 remains **OPEN**. Backlog AC-1..AC-5 stay `[ ]`. Acceptance row stays `[ ]`. This child did not edit `docs/product/backlog.md`, `docs/product/acceptance.md`, `docs/engineering/decisions.md`, or `docs/engineering/architecture.md`. DEC-0153, DEC-0119, and DEC-0078 stay Accepted and unamended (`git diff` on `decisions/DEC-0153.md`, `decisions/DEC-0119.md`, and `decisions/DEC-0078.md` is empty). BUG-0026, BUG-0029, and US-0162 were not edited. No npm publish, git commit, git push, or `.env` read.

Consumed execute pair (recomputed MATCH via `scripts.token_cost_lib.compute_strict_proof_hash`, second invocation MATCH; in TTL at this write `2026-10-16T20:12:30Z`; proof_ttl `2026-10-16T21:04:44Z`): `record_key=auto-20261016-bug0036|bug|BUG-0036|execute|rp-auto-20261016-bug0036-execute-dev-20261016T200444Z-BUG-0036`; `proof_hash=0088e9cfee2aeb4ae6392656f7529d48290a12577bd4ab1b5be53dcf673a21de`; `proof_issued_at=2026-10-16T20:04:44Z`; marker `dev-BUG0036-execute-20261016T200444Z-fresh`.

## Test plan

1. Recompute the execute pair hash and confirm TTL has not elapsed. Stop `RESUME_BRIEF_STALE` on mismatch or elapsed TTL.
2. Re-run `python -m pytest tests/bug0036_repairable_blocker_contract_test.py -q` and judge AC-1..AC-5 against the seven markers, the library, both `auto.md` copies, and the matrix overlay. Do not tick backlog boxes.
3. Confirm live `AUTONOMY_STOP_POLICY=block` and `RESUME_BRIEF_AUTO_REFRESH=0`. Confirm the YAML `RESUME_BRIEF_STALE` row stays `security_hard`, `auto_repair_kind=n/a`, cap 0, and that `execute_harness_blocked_out_of_scope` is absent from the YAML.
4. Confirm the recorded harness `tests/report.md` `2026-10-16T20:03:04Z` Fail rows are only the eight named foreign failures. Do not edit scratchpad drain flags, the template scratchpad, the README, BUG-0026, BUG-0029, or US-0162 to clear them.
5. Run `python scripts/check-user-visible-metadata.py --repo .`. Treat blank `LINT_COMMAND` and `TYPECHECK_COMMAND` as skipped.
6. Waive the six live probe classes with `UAT_PROBE_FORBIDDEN` and record the convergence-smoke surrogate because the BUG-0036 contract file has `contract_test_failed=0`.
7. Leave BUG-0036 OPEN. Do not spawn `/verify-work` or `/execute`.

## Contract markers

Command: `python -m pytest tests/bug0036_repairable_blocker_contract_test.py -q`.

Exit 0. **7 passed / 0 failed** in 0.14s. `contract_test_failed=0`.

| Marker | Result |
|---|---|
| `test_bug0036_foreign_harness_repair_continues` | PASS |
| `test_bug0036_foreign_harness_block_stops` | PASS |
| `test_bug0036_expired_proof_repair_spawns_child` | PASS |
| `test_bug0036_expired_proof_block_stays_stale` | PASS |
| `test_bug0036_bad_evidence_fail_closed` | PASS |
| `test_bug0036_later_member_same_rule` | PASS |
| `test_bug0036_us0092_denies_not_performed` | PASS |

`python scripts/check-user-visible-metadata.py --repo .` exit 0. `LINT_COMMAND` and `TYPECHECK_COMMAND` are blank, so both are **skipped**. `SECURITY_REVIEW`, `CROSS_REPO_OBSERVABILITY`, `COMPONENT_SCOPE_MODE`, `SPEC_PACK_MODE`, `USER_GUIDE_MODE`, and `REMOTE_EXECUTION` are 0, so those optional checks add no required overhead.

## Harness

`tests/report.md` timestamp `2026-10-16T20:03:04Z`. Header `Pass: 874` / `Fail: 8`. This pass did not rewrite the report and does not claim kit Fail 0.

The eight `[FAIL]` rows are the pre-existing foreign set named by execute:

| Row | Classification |
|---|---|
| slim auto command contract markers pass | scratchpad byte mismatch `AUTO_BACKLOG_DRAIN` / `AUTO_BACKLOG_MAX_STORIES` |
| check_intake_template_parity `--scope=dev-environment` | same scratchpad byte mismatch |
| check_intake_template_parity `--scope=dev-environment` (US-0099) | same scratchpad byte mismatch |
| check_intake_template_parity `--scope=model-tier` (US-0101) | same scratchpad byte mismatch |
| check_intake_template_parity `--scope=model-tier-overrides` (US-0102) | same scratchpad byte mismatch |
| check_intake_template_parity `--scope=arch-linkage` (US-0129) | same scratchpad byte mismatch |
| validate_readme_feature_coverage repo `--report` | `README_FEATURE_COVERAGE_GAP:BUG-0029` |
| validate_readme_feature_coverage report idempotent | `README_FEATURE_COVERAGE_GAP:BUG-0029` |

Those eight are not a fail-closed reason for S0180. This pass did not edit the scratchpads, the YAML, BUG-0026, BUG-0029, US-0162, or the README.

## AC checklist

| AC | Expectation | Evidence | Result |
|---|---|---|---|
| AC-1 | When repair is possible the flow continues. Under `block` the same members stay terminal. | `evaluate_foreign_harness` writes a quarantine row and sets `schedules=true` on `auto_repair_then_block` and `auto_repair_then_skip`. `policy==block` returns the terminal stop `execute_harness_blocked_out_of_scope` and writes no quarantine. Markers `test_bug0036_foreign_harness_repair_continues` and `test_bug0036_foreign_harness_block_stops` passed. | PASS |
| AC-2 | Foreign harness failures, `execute_harness_blocked_out_of_scope`, and `RESUME_BRIEF_STALE` after an expired matching proof are in scope together. | Foreign-harness path above. `evaluate_expired_proof` on a repair value returns `spawn_child` with `parent_writes_state=false`, `parent_writes_brief=false`, and `calls_write_resume_pair=false`. Under `block` it returns `RESUME_BRIEF_STALE` and schedules nothing. Markers `test_bug0036_expired_proof_repair_spawns_child` and `test_bug0036_expired_proof_block_stays_stale` passed. | PASS |
| AC-3 | Hardness is the existing `AUTONOMY_STOP_POLICY` values. The stop is not absolute when repair is possible. | `POLICIES` is `block`, `auto_repair_then_block`, `auto_repair_then_skip`. Cap is `ATTEMPT_CAP=3`. The library does not read the scratchpad. Live and template scratchpads still assign `AUTONOMY_STOP_POLICY=block` and `RESUME_BRIEF_AUTO_REFRESH=0`. No new scratchpad key. | PASS |
| AC-4 | The locked `test_bug0036_*` shape is covered. | The seven markers above passed. BUG-0036 stays OPEN. AC-4 stays `[ ]`. | PASS |
| AC-5 | A later member joins only through the four-part predicate plus a repair descriptor. Bad evidence stays fail-closed. Env reads, npm publish, and git push are not performed. | `class_membership` requires the four parts, consistent authorized evidence, and an allowed descriptor. `evaluate_later_member` refuses the two session stop ids. `evaluate_fail_closed` keeps skip off. `deny_us0092` returns `performed=false` for `env_read`, `npm_publish`, and `git_push`. Markers `test_bug0036_bad_evidence_fail_closed`, `test_bug0036_later_member_same_rule`, and `test_bug0036_us0092_denies_not_performed` passed. | PASS |

This QA assessment does not tick the backlog boxes.

## Wiring and locks

- `scripts/repairable_blocker_lib.py` and `template/scripts/repairable_blocker_lib.py` are byte-identical (SHA-256 prefix `cc1b3eebf93e1781`).
- `docs/engineering/autonomy-stop-matrix.md` and the template copy are byte-identical (SHA-256 prefix `ad65c55ea06f40ef`). The overlay is `## Repairable blocker overlay (BUG-0036)`.
- `.cursor/commands/auto.md` and the template copy are byte-identical (SHA-256 prefix `e1f7c4b871ec6d76`). Both call `classify_before_terminal_stale` before the terminal stale stop. The parent stays spawn-only.
- `scripts/data/autonomy_stop_matrix.yaml` `RESUME_BRIEF_STALE` stays `security_hard`, `auto_repair_kind=n/a`, cap 0. `execute_harness_blocked_out_of_scope` is not a YAML code.
- The library text does not contain `scratchpad`, `resolve_matrix_repair`, `attempt_repair`, or `.env`. `calls_write_resume_pair` is present only as a false result field.
- DEC-0153, DEC-0119, and DEC-0078 files have no working-tree diff.

## UAT

Live probe classes `browser_smoke`, `api_health`, `process_health`, `cli_smoke`, `build`, and `manual_operator` are waived with **`UAT_PROBE_FORBIDDEN`**. No `.env` read. No credential fill. No external browser. No npm publish. Convergence surrogate `id=convergence_smoke` result **pass** because `contract_test_failed=0` on `tests/bug0036_repairable_blocker_contract_test.py`. The surrogate `evidence_ref` uses the US-0128 contracted token. This pass does not claim kit `tests/report.md` Fail 0. Counts: **6 pass / 0 fail** (five AC steps plus the surrogate).

## Runtime and generated-test evidence

This slice is the framework kit contract harness, not a generated application stack.

- `runtime_startup_command`: `python -m pytest tests/bug0036_repairable_blocker_contract_test.py -q`
- `runtime_stack_profile`: python
- `runtime_mode`: local
- `runtime_health_target`: seven `test_bug0036_*` markers
- `runtime_health_result`: 7 passed / 0 failed in 0.14s, exit 0
- `runtime_log_summary`: no critical runtime-log scan; live classes waived; kit harness Fail 8 is the named foreign set
- `runtime_retry_count`: 0
- `runtime_retry_ledger`: none
- `runtime_final_verdict`: pass
- `runtime_reason_code`: contract_tests_primary; live classes `UAT_PROBE_FORBIDDEN`
- `runtime_evidence_refs`: `sprints/S0180/qa-findings.md`, `tests/bug0036_repairable_blocker_contract_test.py`, `tests/report.md`
- `generated_test_stack_profile`: python
- `generated_test_command`: same as `runtime_startup_command`
- `generated_test_result`: pass
- `generated_test_output_ref`: this file, Contract markers
- `generated_test_paths_ref`: `tests/bug0036_repairable_blocker_contract_test.py`
- `generated_test_reason_code`: ok

## Guards held

- BUG-0036 stays OPEN. AC-1..AC-5 stay unchecked.
- BUG-0026, BUG-0029, and US-0162 were not mutated.
- Live `AUTONOMY_STOP_POLICY` stays `block`. `RESUME_BRIEF_AUTO_REFRESH` stays 0.
- No `.env` read, no commit, no push, no npm publish, no `/auto`, no subagent spawn.
- This QA child did **not** spawn `/verify-work` or `/execute`.

## Next

Fresh `/verify-work` for BUG-0036 / S0180. The parent may spawn it after validating this pair. This QA child does not spawn it. `next_scheduled_phase=verify-work`. `next_scheduled_role=qa`.
