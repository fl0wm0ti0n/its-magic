# Release Notes — S0180 / BUG-0036

- **Sprint**: `S0180`
- **Bug**: `BUG-0036` — `/auto` classifies a foreign harness and an expired matching proof before a terminal stale stop. The caller passes `AUTONOMY_STOP_POLICY`. `block` keeps those members terminal. Repair values quarantine the member and schedule the next lawful phase without editing the foreign owner.
- **Release date**: `2026-10-16T20:26:26Z` (UTC)
- **orchestrator_run_id**: `auto-20261016-bug0036`
- **fresh_context_marker**: `release-BUG0036-release-20261016T202626Z-fresh`
- **model_id**: `inherit`
- **implementation_loop_index**: `0`
- **runtime_proof_id**: `rp-auto-20261016-bug0036-release-release-20261016T202626Z-BUG-0036`
- **proof_hash**: `6b5fbb67527ebba6bfa02243671a14cf9e2d458305a2a8b9d486f374ed2a424b`
- **proof_issued_at**: `2026-10-16T20:26:26Z`; **proof_ttl_seconds**: `3600`; **proof_ttl**: `2026-10-16T21:26:26Z`
- **release_version**: none (workflow-only; kit semver unchanged)
- **npm_published**: `false`
- **git_pushed**: `false`

## Verdict

**RELEASE_PASS**. BUG-0036 stays **OPEN**. Closure owns the DONE flip and the acceptance ticks.

- **Publish: NOT PERFORMED** (`RELEASE_PUBLISH_MODE=confirm`; operator confirmation absent; `PUBLISH_CONFIRMATION_REQUIRED`; no npm publish; no registry write; no kit semver bump).
- **Push: NOT PERFORMED** (`SYNC_POLICY_MODE=disabled`; `SYNC_DISABLED`; no git push; no commit).

## What's new

- BUG-0036: a foreign harness and an expired matching proof are classified before a terminal stale stop. `block` stays terminal. Repair values quarantine the member (cap 3) and schedule the next lawful phase without editing the foreign owner. Seven contract markers cover the path.

## What this release records

Repairable blocker class on `/auto` (implementation loop 0):

- `scripts/repairable_blocker_lib.py` and the template twin own the four-part predicate, the policy dispatch, the quarantine record, and the expired-proof spawn request. The library does not read the scratchpad. The caller passes `AUTONOMY_STOP_POLICY`.
- `block` keeps the member terminal. `auto_repair_then_block` blocks an unproven repair. `auto_repair_then_skip` skips that segment. Cap is 3 attempts per orchestrator run and member.
- A foreign harness is a member when this work item's own contract passed and every remaining failure names another owner. A repair value writes a quarantine row and does not edit the foreign owner.
- An expired matching proof on a repair value is a spawn request for a fresh child. The parent writes neither `docs/engineering/state.md` nor `handoffs/resume_brief.md`.
- Missing, conflicting, and unauthorized evidence stay fail-closed. Seven `test_bug0036_*` markers cover that behavior.

This release did not run a live operator session and did not read `.env` (`UAT_PROBE_FORBIDDEN`).

## Gate summary

| Gate | Result |
|------|--------|
| check_in_tests (1) | **PASS** — own contract re-run this release: 7 passed / 0 failed in 0.20s. Cited harness `tests/report.md` `2026-10-16T20:03:04Z` Pass 874 / Fail 8. US-0071 L713–L722 PASS. Triad L723–L726 PASS. The eight fail rows are the pre-existing foreign scratchpad byte mismatch and `README_FEATURE_COVERAGE_GAP:BUG-0029`. Not a fail-closed reason for S0180. `harness_fail_zero_claimed=false`. Lint skipped. Typecheck skipped. |
| qa (2) | **PASS** — `sprints/S0180/qa-findings.md` QA_PASS, no blocking findings. `generated_test_result=pass`, `generated_test_reason_code=ok`. |
| uat (3) | **PASS** — `sprints/S0180/uat.json` 6/6, `uat_lifecycle=populated`, `placeholder_only=false`. Live classes `UAT_PROBE_FORBIDDEN`. |
| isolation (4) | **PASS** — execute/dev, qa/qa, verify-work/qa, plus this release/release marker (`model_id=inherit`) |
| strict_runtime_proof (4b) | **PASS** — execute, qa, and verify-work hashes recomputed MATCH and were inside TTL at `2026-10-16T20:26:26Z`. Own release proof second invocation MATCH. |
| readme_feature_coverage_3f | **foreign, not fail-closed** — `--enforce` exit 1, only gap `README_FEATURE_COVERAGE_GAP:BUG-0029`, `coverage_total=53`. BUG-0036 stays OPEN and is not a coverage subject. This release did not edit the README. |
| project_readme_3g | **PASS** — `kit_repo_skipped=true` |
| publish | **NOT PERFORMED** |
| sync | **NOT PERFORMED** (`SYNC_DISABLED`) |
| backlog | **deferred to `/closure`** — BUG-0036 remains OPEN |

## Run

- `start_command`: `python -m pytest tests/bug0036_repairable_blocker_contract_test.py -q`
- `runtime_mode`: `local`
- `runtime_context_ref`: `docs/engineering/runtime-connectivity.md`
- Deploy commands are already explicit in `docs/engineering/runbook.md`:
  - `DEPLOY_STAGING_COMMAND`: `echo "No staging deploy target configured for this repository"`
  - `DEPLOY_PROD_COMMAND`: `echo "No production deploy target configured for this repository"`
- Operator: pass the live `AUTONOMY_STOP_POLICY` into `scripts/repairable_blocker_lib.py`. `block` stays terminal. Repair values quarantine and continue. See `## Repairable blocker class (BUG-0036)` in `docs/engineering/runbook.md`.

## Connect

- `service_url`: n/a (local contract tests only; no long-running remote service started in this release)
- `service_port`: n/a
- `health_endpoint`: n/a — health signal is the seven-marker contract run, exit 0

## Verify

- `verification_steps`:
  1. `python -m pytest tests/bug0036_repairable_blocker_contract_test.py -q` → 7 pass / 0 fail, exit 0.
  2. Read `tests/report.md` → `2026-10-16T20:03:04Z`, Pass 874 / Fail 8. US-0071 L713–L722 `[PASS]`. Triad L723–L726 `[PASS]`. The eight `[FAIL]` rows are the named foreign set.
  3. Confirm live `AUTONOMY_STOP_POLICY` is still `block` and `RESUME_BRIEF_AUTO_REFRESH` is still 0.
- `expected_health_signal`: seven `test_bug0036_*` markers pass. The kit harness Fail count stays the named foreign set.

## Credentials

- `credential_source_refs`: none. This release did not read `.env` and did not use paid credentials.
- `expected_value_source`: not used. A live operator session stays `UAT_PROBE_FORBIDDEN`.

## Known Issues

- Kit harness `tests/report.md` `2026-10-16T20:03:04Z` is Pass 874 / Fail 8. Those rows are the pre-existing foreign scratchpad byte mismatch and `README_FEATURE_COVERAGE_GAP:BUG-0029`. They are not a fail-closed reason for S0180. This release did not edit those owners.
- BUG-0036 stays **OPEN** until `/closure`. AC-1..AC-5 stay unchecked.

## Next

Fresh `/closure` as **curator**. `qe` is not a spawnable subagent on this Cursor host; DEC-0052 sanctioned alternate is curator. Do not flip BUG-0036 in this phase. This release child does not spawn `/closure`.
