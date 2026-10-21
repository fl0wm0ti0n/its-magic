# Release Notes — S0181 / US-0157

- **Sprint**: `S0181`
- **Story**: `US-0157` — When `CROSS_MODEL_REVIEW=1`, OpenCode `/auto` spawns a fresh tech-lead for `/sovereign-critic`. The owning child may repair only its own invalid continuation pair. The parent does not write the pair. Hard security denies stay hard stops.
- **Release date**: `2026-10-16T22:19:06Z` (UTC)
- **orchestrator_run_id**: `auto-20261016-us0157`
- **fresh_context_marker**: `release-US0157-release-20261016T221906Z-fresh`
- **model_id**: `inherit`
- **implementation_loop_index**: `0`
- **runtime_proof_id**: `rp-auto-20261016-us0157-release-release-20261016T221906Z`
- **proof_hash**: `2959e6494d4f5d3d5eebea6eca9038bb31ffe20a9817df1c8a050dd35fc0358d`
- **proof_issued_at**: `2026-10-16T22:19:06Z`; **proof_ttl_seconds**: `3600`; **proof_ttl**: `2026-10-16T23:19:06Z`
- **release_version**: none (workflow-only; kit semver unchanged)
- **npm_published**: `false`
- **git_pushed**: `false`

## Verdict

**RELEASE_PASS**. US-0157 stays **OPEN**. Closure owns the DONE flip and the acceptance ticks.

- **Publish: NOT PERFORMED** (`RELEASE_PUBLISH_MODE=confirm`; operator confirmation absent; `PUBLISH_CONFIRMATION_REQUIRED`; no npm publish; no registry write; no kit semver bump).
- **Push: NOT PERFORMED** (`SYNC_POLICY_MODE=disabled`; `SYNC_DISABLED`; no git push; no commit).

## What's new

- US-0157: OpenCode `/auto` with `CROSS_MODEL_REVIEW=1` spawns a fresh tech-lead for `/sovereign-critic`. The owning child repairs only its own invalid pair. The parent does not write the pair. Four contract markers cover the path.

## What this release records

OpenCode critic hook and owning-child pair repair (implementation loop 0):

- `.opencode/commands/sovereign-critic.md` and the template twin set `agent: tech-lead` and point at `.cursor/commands/sovereign-critic.md`. `CROSS_MODEL_REVIEW=0` spawns nothing. No critic Task role was added. `PHASE_ROLE_MATRIX` is unchanged.
- `scripts/owning_child_pair_repair_lib.py` is the owning-child repair helper. It appends one checkpoint at the bottom of `docs/engineering/state.md`, then prepends `handoffs/resume_brief.md`. It does not call `write_resume_pair`. One repair attempt. The writer must already match this child.
- The parent calls `validate_resume_pair` only. It does not write either pair file and it does not set `RESUME_BRIEF_AUTO_REFRESH`.
- Hard security denies stay hard stops. `expired_ttl` stays fail-closed. Live `AUTONOMY_STOP_POLICY=block` and `RESUME_BRIEF_AUTO_REFRESH=0` were not changed.
- Four `test_us0157_*` markers cover that behavior.

This release did not run a live operator session and did not read `.env` (`UAT_PROBE_FORBIDDEN`).

## Gate summary

| Gate | Result |
|------|--------|
| check_in_tests (1) | **PASS** — own contract re-run this release: 4 passed / 0 failed in 1.28s. Cited harness `tests/report.md` `2026-10-16T21:58:06Z` Pass 875 / Fail 8. US-0071 L713–L722 PASS. Triad L723–L726 PASS. The eight fail rows are the pre-existing foreign scratchpad byte mismatch and `README_FEATURE_COVERAGE_GAP:BUG-0029`. Not a fail-closed reason for S0181. `harness_fail_zero_claimed=false`. Lint skipped. Typecheck skipped. |
| qa (2) | **PASS** — `sprints/S0181/qa-findings.md` QA_PASS, no blocking findings. `generated_test_result=pass`, `generated_test_reason_code=ok`. |
| uat (3) | **PASS** — `sprints/S0181/uat.json` 6/6, `uat_lifecycle=populated`, `placeholder_only=false`. Live classes `UAT_PROBE_FORBIDDEN`. |
| isolation (4) | **PASS** — execute/dev, qa/qa, verify-work/qa, plus this release/release marker (`model_id=inherit`) |
| strict_runtime_proof (4b) | **PASS** — execute, qa, and verify-work hashes recomputed MATCH and were inside TTL at `2026-10-16T22:19:06Z`. Own release proof second invocation MATCH. |
| readme_feature_coverage_3f | **foreign, not fail-closed** — `--enforce` exit 1, gaps `README_FEATURE_COVERAGE_GAP:BUG-0029` and `README_FEATURE_COVERAGE_GAP:BUG-0036`, `coverage_total=54`. US-0157 stays OPEN and is not a coverage subject. This release did not edit the README. |
| project_readme_3g | **PASS** — `kit_repo_skipped=true` |
| publish | **NOT PERFORMED** |
| sync | **NOT PERFORMED** (`SYNC_DISABLED`) |
| backlog | **deferred to `/closure`** — US-0157 remains OPEN |

## Run

- `start_command`: `python -m pytest tests/us0157_opencode_critic_pair_contract_test.py -q`
- `runtime_mode`: `local`
- `runtime_context_ref`: `docs/engineering/runtime-connectivity.md`
- Deploy commands are already explicit in `docs/engineering/runbook.md`:
  - `DEPLOY_STAGING_COMMAND`: `echo "No staging deploy target configured for this repository"`
  - `DEPLOY_PROD_COMMAND`: `echo "No production deploy target configured for this repository"`
- Operator: when `CROSS_MODEL_REVIEW=1`, OpenCode `/auto` spawns tech-lead for `/sovereign-critic`. The owning child repairs only its own pair. See `## OpenCode critic and owning-child pair repair (US-0157)` in `docs/engineering/runbook.md`.

## Connect

- `service_url`: n/a (local contract tests only; no long-running remote service started in this release)
- `service_port`: n/a
- `health_endpoint`: n/a — health signal is the four-marker contract run, exit 0

## Verify

- `verification_steps`:
  1. `python -m pytest tests/us0157_opencode_critic_pair_contract_test.py -q` → 4 pass / 0 fail, exit 0.
  2. Read `tests/report.md` → `2026-10-16T21:58:06Z`, Pass 875 / Fail 8. US-0071 L713–L722 `[PASS]`. Triad L723–L726 `[PASS]`. The eight `[FAIL]` rows are the named foreign set.
  3. Confirm live `AUTONOMY_STOP_POLICY` is still `block` and `RESUME_BRIEF_AUTO_REFRESH` is still 0.
- `expected_health_signal`: four `test_us0157_*` markers pass. The kit harness Fail count stays the named foreign set.

## Credentials

- `credential_source_refs`: none. This release did not read `.env` and did not use paid credentials.
- `expected_value_source`: not used. A live operator session stays `UAT_PROBE_FORBIDDEN`.

## Known Issues

- Kit harness `tests/report.md` `2026-10-16T21:58:06Z` is Pass 875 / Fail 8. Those rows are the pre-existing foreign scratchpad byte mismatch and `README_FEATURE_COVERAGE_GAP:BUG-0029`. They are not a fail-closed reason for S0181. This release did not edit those owners.
- Live README enforce also reports `README_FEATURE_COVERAGE_GAP:BUG-0036` (`coverage_total=54`). BUG-0036 is DONE and is a foreign coverage subject. This release did not edit the README or BUG-0036.
- US-0157 stays **OPEN** until `/closure`. AC-1..AC-5 stay unchecked.

## Next

Fresh `/closure` as **curator**. `qe` is not a spawnable subagent on this Cursor host; DEC-0052 sanctioned alternate is curator. Do not flip US-0157 in this phase. This release child does not spawn `/closure`.
