# QA Findings — S0181 / US-0157

## Verdict — **QA_PASS**

- **verdict**: **QA_PASS**
- **decision_gate**: false
- **blocking findings**: 0
- **fail-closed reason**: none
- **phase_id**: qa
- **role**: qa
- **story_id**: US-0157
- **bug_id**: (none)
- **sprint_id**: S0181
- **implementation_loop_index**: 0
- **outer_cycle_index**: 6
- **timestamp**: 2026-10-16T22:06:08Z
- **fresh_context_marker**: `qa-US0157-qa-20261016T220608Z-fresh`
- **runtime_proof_id**: `rp-auto-20261016-us0157-qa-qa-20261016T220608Z`
- **proof_hash**: `7c57799ce11109f192f716a00d58f94d45f9ad1b7e32d54ac7a9960a169326e8`
- **proof_issued_at**: 2026-10-16T22:06:08Z
- **proof_ttl_seconds**: 3600
- **model_id**: omit
- **model_provenance**: `provenance=host=cursor;path=.cursor/scratchpad.local.md;step=MODEL_TIER_<PHASE>`
- **CROSS_MODEL_REVIEW**: 0
- **next_scheduled_phase**: verify-work
- **next_scheduled_role**: qa
- **status guard**: US-0157 remains **OPEN**. Backlog AC-1..AC-5 stay `[ ]`. Acceptance row stays `[ ]`. This child did not edit `docs/product/backlog.md`, `docs/product/acceptance.md`, `docs/engineering/decisions.md`, `docs/engineering/architecture.md`, or `decisions/DEC-0153.md`. DEC-0153 stays Accepted and unamended (`git diff -- decisions/DEC-0153.md` is empty). US-0162, BUG-0026, BUG-0029, and BUG-0036 were not edited. No npm publish, git commit, git push, or `.env` read. No critic Task role was added. `RESUME_BRIEF_AUTO_REFRESH` stays 0.

Consumed execute pair (recomputed MATCH via `scripts.token_cost_lib.compute_strict_proof_hash`, second invocation MATCH; in TTL at this write `2026-10-16T22:06:08Z`; proof_ttl `2026-10-16T22:58:54Z`): `record_key=auto-20261016-us0157|story|US-0157|execute|rp-auto-20261016-us0157-execute-dev-20261016T215854Z`; `proof_hash=4ecf894a119a1443b61fce2dbfc64284f1f4899203c1120c7ffb1c55fe5231ce`; `proof_issued_at=2026-10-16T21:58:54Z`; marker `dev-US0157-execute-20261016T215854Z-fresh`.

## Test plan

1. Recompute the execute pair hash and confirm TTL has not elapsed. Stop `RESUME_BRIEF_STALE` on mismatch or elapsed TTL.
2. Re-run `python -m pytest tests/us0157_opencode_critic_pair_contract_test.py -q` and judge AC-1..AC-5 against the four markers, the OpenCode command/agent/plugin pairs, and `scripts/owning_child_pair_repair_lib.py`. Do not tick backlog boxes.
3. Confirm live `AUTONOMY_STOP_POLICY=block` and `RESUME_BRIEF_AUTO_REFRESH=0`. Confirm the YAML rows for `PHASE_ROLE_CAPABILITY_MISSING` and `RESUME_BRIEF_STALE` stay `security_hard`, `auto_repair_kind=n/a`, cap 0. Confirm no critic permission key and no critic entry on `PHASE_ROLE_MATRIX`.
4. Confirm the recorded harness `tests/report.md` `2026-10-16T21:58:06Z` Fail rows are only the eight named foreign failures. Do not edit scratchpad drain flags, the template scratchpad, the README, US-0162, BUG-0026, BUG-0029, or BUG-0036 to clear them.
5. Run `python scripts/check-user-visible-metadata.py --repo .`. Treat blank `LINT_COMMAND` and `TYPECHECK_COMMAND` as skipped.
6. Waive the six live probe classes with `UAT_PROBE_FORBIDDEN` and record the convergence-smoke surrogate because the US-0157 contract file has `contract_test_failed=0`.
7. Leave US-0157 OPEN. Do not spawn `/verify-work` or `/execute`.

## Contract markers

Command: `python -m pytest tests/us0157_opencode_critic_pair_contract_test.py -q`.

Exit 0. **4 passed / 0 failed** in 1.34s. `contract_test_failed=0`.

| Marker | Result |
|---|---|
| `test_us0157_critic_spawns_tech_lead` | PASS |
| `test_us0157_own_pair_repair_continues` | PASS |
| `test_us0157_orchestrator_cannot_write_pair` | PASS |
| `test_us0157_security_denies_stay_hard` | PASS |

`python scripts/check-user-visible-metadata.py --repo .` exit 0. `LINT_COMMAND` and `TYPECHECK_COMMAND` are blank, so both are **skipped**. `SECURITY_REVIEW`, `CROSS_REPO_OBSERVABILITY`, `COMPONENT_SCOPE_MODE`, `SPEC_PACK_MODE`, `USER_GUIDE_MODE`, and `REMOTE_EXECUTION` are 0, so those optional checks add no required overhead.

Kit `TEST_COMMAND` evidence is the execute harness report this pass re-read and did not rewrite: `tests/report.md` Timestamp `2026-10-16T21:58:06Z`, Pass 875 / Fail 8.

## Harness

`tests/report.md` timestamp `2026-10-16T21:58:06Z`. Header `Pass: 875` / `Fail: 8`. This pass did not rewrite the report and does not claim kit Fail 0.

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

Those eight are not a fail-closed reason for S0181. This pass did not edit the scratchpads, the YAML, US-0162, BUG-0026, BUG-0029, BUG-0036, or the README.

## AC checklist

| AC | Expectation | Evidence | Result |
|---|---|---|---|
| AC-1 | When `CROSS_MODEL_REVIEW=1`, OpenCode `/auto` spawns a fresh tech-lead for `/sovereign-critic` and does not emit `PHASE_ROLE_CAPABILITY_MISSING` because no critic Task role exists. | Both sovereign-critic commands set `agent: tech-lead` and point at `.cursor/commands/sovereign-critic.md`. Both auto agent and auto command copies carry the mapping sentence. The permission block stays po, tech-lead, dev, qa, release, curator, and security. `PHASE_ROLE_MATRIX` has no critic key. `planSovereignCriticSpawn` returns `tech-lead` / `/sovereign-critic` when review is 1, spawns nothing when review is 0, and emits `PHASE_ROLE_CAPABILITY_MISSING` only when `tech-lead` itself is absent. Marker `test_us0157_critic_spawns_tech_lead` passed. | PASS |
| AC-2 | A fresh phase child may repair only its own invalid continuation pair, then the flow continues. | `scripts/owning_child_pair_repair_lib.py` is a separate helper. It does not call `write_resume_pair(`. An owning child with a bad hash continues to `qa` with write order `append_state_bottom` then `prepend_brief`. A different `writer_role` stops with no repair spawn and no file write. Marker `test_us0157_own_pair_repair_continues` passed. | PASS |
| AC-3 | The `/auto` orchestrator still does not write or repair `docs/engineering/state.md` or `handoffs/resume_brief.md`. | `parent_consider_pair` for `auto`, `parent`, and `orchestrator` stops, writes neither file, does not set `RESUME_BRIEF_AUTO_REFRESH`, and does not call `write_resume_pair`. Both auto command copies name `validate_resume_pair` and say the parent does not write `docs/engineering/state.md`. Live and template scratchpads still assign `RESUME_BRIEF_AUTO_REFRESH=0`. Marker `test_us0157_orchestrator_cannot_write_pair` passed. DEC-0153 was not amended. | PASS |
| AC-4 | Hard security denies stay hard stops. | `deny_hard_security` for `env_read`, `secrets`, and `credential_theft` returns `performed=false` and `hard_stop=true` and does not read `.env`. A missing allowlisted delivery role and a missing `tech-lead` allow still return `PHASE_ROLE_CAPABILITY_MISSING`. `expired_ttl` stays fail-closed and is not repaired here. The helper does not call `evaluate_expired_proof` or `resolve_matrix_repair`. YAML rows for `PHASE_ROLE_CAPABILITY_MISSING` and `RESUME_BRIEF_STALE` stay `security_hard`, `auto_repair_kind=n/a`, cap 0. Live `AUTONOMY_STOP_POLICY=block`. Marker `test_us0157_security_denies_stay_hard` passed. | PASS |
| AC-5 | Contract tests cover AC-1, AC-2, and AC-3. | The four `test_us0157_*` markers passed, including the three paths AC-5 names and the AC-4 hard-deny marker. US-0157 stays OPEN. AC-5 stays `[ ]`. | PASS |

This QA assessment does not tick the backlog boxes.

## Tasks

T-anch and T-001..T-007 are checked (8). Each AC has a task. T-007 pairs are byte-identical:

| Pair | SHA-256 prefix |
|---|---|
| `.opencode/commands/sovereign-critic.md` | `032c3ec3317139e0` |
| `.opencode/agents/auto.md` | `e172f529c3c9f54a` |
| `.opencode/commands/auto.md` | `2d43f42f8475ce06` |
| `.opencode/plugins/orchestrator.ts` | `8481fb1cbbdcb6ac` |

## UAT

Live probe classes `browser_smoke`, `api_health`, `process_health`, `cli_smoke`, `build`, and `manual_operator` are waived with **`UAT_PROBE_FORBIDDEN`**. No `.env` read. No credential fill. No external browser. No npm publish. Convergence surrogate `id=convergence_smoke` result **pass** because `contract_test_failed=0` on `tests/us0157_opencode_critic_pair_contract_test.py`. The surrogate `evidence_ref` uses the US-0128 contracted token. This pass does not claim kit `tests/report.md` Fail 0. Counts: **6 pass / 0 fail** (five AC steps plus the surrogate).

## Runtime and generated-test evidence

This slice is the framework kit contract harness, not a generated application stack.

- `runtime_startup_command`: `python -m pytest tests/us0157_opencode_critic_pair_contract_test.py -q`
- `runtime_stack_profile`: python
- `runtime_mode`: local
- `runtime_health_target`: four `test_us0157_*` markers
- `runtime_health_result`: 4 passed / 0 failed in 1.34s, exit 0
- `runtime_log_summary`: no critical runtime-log scan; live classes waived; kit harness Fail 8 is the named foreign set
- `runtime_retry_count`: 0
- `runtime_retry_ledger`: none
- `runtime_final_verdict`: pass
- `runtime_reason_code`: contract_tests_primary; live classes `UAT_PROBE_FORBIDDEN`
- `runtime_evidence_refs`: `sprints/S0181/qa-findings.md`, `tests/us0157_opencode_critic_pair_contract_test.py`, `tests/report.md`
- `generated_test_stack_profile`: python
- `generated_test_command`: same as `runtime_startup_command`
- `generated_test_result`: pass
- `generated_test_output_ref`: this file, Contract markers
- `generated_test_paths_ref`: `tests/us0157_opencode_critic_pair_contract_test.py`
- `generated_test_reason_code`: ok

## Guards held

- US-0157 stays OPEN. AC-1..AC-5 stay unchecked.
- US-0162, BUG-0026, BUG-0029, and BUG-0036 were not mutated.
- Live `AUTONOMY_STOP_POLICY` stays `block`. `RESUME_BRIEF_AUTO_REFRESH` stays 0.
- DEC-0153 stays unamended. No critic Task role was added.
- No `.env` read, no commit, no push, no npm publish, no `/auto`, no subagent spawn.
- This QA child did **not** spawn `/verify-work` or `/execute`.

## Next

Fresh `/verify-work` for US-0157 / S0181. The parent may spawn it after validating this pair. This QA child does not spawn it. `next_scheduled_phase=verify-work`. `next_scheduled_role=qa`.
