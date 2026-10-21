# Release Notes — S0177 / BUG-0026

- **Sprint**: `S0177`
- **Bug**: `BUG-0026` — Debian 13 WSL2 published-global `its-magic@0.1.5` upgrade observation. Recorded tokens include `STANDALONE_BOOTSTRAP_OK`. Posix `.its-magic/bin/itsm` mode `0755`.
- **Release date**: `2026-10-15T09:27:02Z` (UTC) — **blocked, not finalized**
- **orchestrator_run_id**: `auto-20261015-bug0026`
- **fresh_context_marker**: `release-BUG0026-release-20261015T092702Z-fresh`
- **model_id**: `inherit`
- **runtime_proof_id**: `rp-auto-20261015-bug0026-release-release-20261015T092702Z-BUG-0026`
- **proof_hash**: `07f2097c44fd2e36c5628d9980e70706d2f29e07a66866b36f95414ce8116e56`
- **proof_issued_at**: `2026-10-15T09:27:02Z`; **proof_ttl_seconds**: `3600`; **proof_ttl**: `2026-10-15T10:27:02Z`
- **release_version**: none (not finalized)
- **npm_published**: `false`
- **git_pushed**: `false`

## Verdict

**RELEASE_FAIL** / queue **blocked**. BUG-0026 stays **OPEN**. AC-3 stays unchecked. Closure is not scheduled.

- **Fail-closed:** `RELEASE_TEST_FAILED`; `README_FEATURE_COVERAGE_BLOCKED`; `README_FEATURE_COVERAGE_GAP:BUG-0028`.
- **Publish: NOT PERFORMED** (`RELEASE_PUBLISH_MODE=confirm`; no npm publish; no registry write; no kit semver bump).
- **Push: NOT PERFORMED** (`SYNC_POLICY_MODE=disabled`; no git push; no commit).

## What this release records

Sprint evidence only. The recorded Debian 13 WSL2 consumer shows published global `its-magic@0.1.5`, `STANDALONE_BOOTSTRAP_OK`, and a posix shim at mode `0755`. This phase did not republish and did not re-run the upgrade. UAT is 9 pass / 0 fail. Eight `test_bug0026_*` markers passed again (3.92s). The kit harness did not.

## Gate summary

| Gate | Result |
|------|--------|
| check_in_tests (1) | **FAIL** — `TEST_COMMAND` exit 1. `tests/report.md` `2026-10-15T09:24:56Z` Pass 872 / Fail 8. US-0071 L713–L722 PASS. Triad L723–L726 PASS. Eight `test_bug0026_*` markers this release: 8 passed / 0 failed, 3.92s. Reason `RELEASE_TEST_FAILED`. |
| qa (2) | **PASS** — `sprints/S0177/qa-findings.md` QA_PASS, no blocking findings. Does not clear gate 1. |
| uat (3) | **PASS** — `sprints/S0177/uat.json` 9/0, `uat_lifecycle=populated`. Does not clear gate 1. |
| readme_feature_coverage_3f | **FAIL** — `README_FEATURE_COVERAGE_GAP:BUG-0028` (`root_h2=Features`, `dev_h2=Architecture notes`). |
| project_readme_3g | **PASS** — `kit_repo_skipped=true` |
| isolation (4) | **PASS** — execute/dev, qa/qa, verify-work/qa, plus this release/release marker (`model_id=inherit`) |
| strict_runtime_proof (4b) | **PASS** — verify-work hash MATCH and inside TTL at issue. Execute and QA hashes MATCH and were inside TTL at issue. |
| publish | **NOT PERFORMED** |
| sync | **NOT PERFORMED** (`SYNC_DISABLED`) |
| backlog | **not reconciled** — BUG-0026 remains OPEN |
| finalization (5) | **NOT RUN** |

## Run

- `start_command`: `python -m pytest tests/bug0026_packaged_range_contract_test.py -q --tb=line`
- `runtime_mode`: `local`
- `runtime_context_ref`: `docs/engineering/runtime-connectivity.md`
- Deploy commands are already explicit in `docs/engineering/runbook.md`:
  - `DEPLOY_STAGING_COMMAND`: `echo "No staging deploy target configured for this repository"`
  - `DEPLOY_PROD_COMMAND`: `echo "No production deploy target configured for this repository"`

## Connect

- `service_url`: n/a (local observation only; no long-running remote service started in this release)
- `service_port`: n/a
- `health_endpoint`: n/a — the kit health signal is `tests/report.md` Fail 0, which this run did not reach

## Verify

- `verification_steps`:
  1. `python -m pytest tests/bug0026_packaged_range_contract_test.py -q --tb=line` → 8 pass / 0 fail, exit 0.
  2. Read `tests/report.md` → `2026-10-15T09:24:56Z`, Pass 872 / Fail 8. This is not a release pass.
  3. `python scripts/validate_readme_feature_coverage.py --repo . --enforce` → exit 1, `README_FEATURE_COVERAGE_GAP:BUG-0028`.
- `expected_health_signal`: harness Fail 0 and README coverage exit 0. Neither is true on this run.

## Credentials

- `credential_source_refs`: none. This release did not read `.env` and did not use paid credentials.
- `expected_value_source`: not used. No republish.

## Known Issues

- `RELEASE_TEST_FAILED`. Eight harness rows failed (L785, L815, L816, L843, L846, L850, L853, L855 in `tests/report.md`).
- `README_FEATURE_COVERAGE_BLOCKED` with `README_FEATURE_COVERAGE_GAP:BUG-0028`.
- BUG-0026 stays **OPEN** until a later RELEASE_PASS and `/closure`. AC-3 stays unchecked.

## Next

Do not spawn `/closure`. `next_scheduled_phase=none`. `next_scheduled_role=none`. After the harness and the BUG-0028 README gap are green, rerun `/release`. `qe` is not spawnable; curator is the DEC-0052 sanctioned closure alternate only after RELEASE_PASS.
