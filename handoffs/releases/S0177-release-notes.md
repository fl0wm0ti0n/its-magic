# Release Notes — S0177 / BUG-0026

## Re-attestation (release2) — 2026-10-24T10:06:41Z (UTC)

**RELEASE_PASS** — fresh independent release child of re-release cycle `auto-20261023-bug0026-release`. The Oct-15 `RELEASE_FAIL` below is retained as history only.

- **Sprint**: `S0177`; **Bug**: `BUG-0026` (OPEN; not a DONE flip)
- **Release date**: `2026-10-24T10:06:41Z` (UTC) — **finalized, queue `blocked → released`**
- **orchestrator_run_id**: `auto-20261023-bug0026-release`
- **fresh_context_marker**: `release-BUG0026-release2-20261024T100641Z-fresh` (0 prior occurrences at mint)
- **model_id**: `zelisko_llm/qwen3.8-27b`
- **runtime_proof_id**: `rp-auto-20261023-bug0026-release-release-20261024T100641Z-BUG-0026`
- **proof_hash**: `8a92de7f66b2fbc08da87459e78840aab9e52de1d5ccadf6b7c271e9a757ca4c` (strict 6-tuple; lib + independent compact sorted-key SHA-256 MATCH)
- **proof_issued_at**: `2026-10-24T10:06:41Z`; **proof_ttl_seconds**: `3600`; **proof_ttl_expiry**: `2026-10-24T11:06:41Z`
- **release_version**: none (workflow-only release; no kit semver bump)
- **npm_published**: `false` (publish NOT PERFORMED — `RELEASE_PUBLISH_MODE=confirm`)
- **git_pushed**: `false` (push NOT PERFORMED — `SYNC_POLICY_MODE=disabled`)

### Gate summary (fresh this release)

| Gate | Result |
|------|--------|
| check_in_tests (1) | **PASS** — `tests/run-tests.ps1` exit 0; `tests/report.md` `2026-10-24T10:05:47Z` **Pass 884 / Fail 0**; US-0071 L713–L722 PASS; triad L725–L726 PASS; scoped 8/8 in 4.46s. |
| qa (2) | **PASS** — cited from `sprints/S0177/qa-findings.md` RE-ATTEST record (QA_PASS, 0 blocking). |
| uat (3) | **PASS** — cited from `sprints/S0177/uat.json` 9/9, `phase_id=verify-work`. |
| readme_feature_coverage_3f | **PASS** — 57/57, `gaps=[]` (Oct-15 BUG-0028 gap closed). |
| project_readme_3g | **PASS** — `kit_repo_skipped=true`. |
| isolation (4) | **PASS** — 4 distinct markers (execute/dev, qa/qa, verify-work/qa, release/release). |
| strict_runtime_proof (4b) | **PASS** — verify-work pair IN-TTL at issue + two-method MATCH; own proof two-method MATCH. |
| validator AC gate | **PASS** — `[BUG_VALIDATION_OK]` exit 0. |
| publish | **NOT PERFORMED** (`RELEASE_PUBLISH_MODE=confirm`) |
| sync | **NOT PERFORMED** (`SYNC_DISABLED`) |
| backlog | **not flipped** — BUG-0026 remains OPEN; AC-3 unchecked (closure owns flip) |
| finalization (5) | **RUN** — queue `released`; `CHANGELOG.md` `[Unreleased]`/`### Fixed` BUG-0026 bullet; legacy `handoffs/release_notes.md` finalized note prepended |

### Consumed verify-work pair

IN-TTL at release issue and integrity-verified: record_key `auto-20261023-bug0026-verify-work|bug|BUG-0026|verify-work|rp-auto-20261023-bug0026-verify-work-qa-20261024T093856Z-BUG-0026`; strict 6-tuple `435104b2db05f4c26fec27e87005e7450c11eba4d5b37f17dc9709651ea303c8` two-method MATCH; state-bottom ↔ brief-top byte-identical; 20 PAIR_LOCKED_FIELDS; `validate_resume_pair(writer_role=qa)` ok=true; expiry `2026-10-24T10:38:56Z` after issue `2026-10-24T10:06:41Z`. Provenance chain execute `30d2784461bdbc1a63d94da2448d2b6fb70735fe49a9bcc59e5433e00874a1f1` / qa `95cd78d9aa441ba17fbe9f9c22c000c9dbe7a73ca19a2e4a5664bad929ae0f4c` integrity-verified, out-of-TTL at issue, provenance-only.

### Stop

`STOP_AFTER_RELEASE_PASS`. Parent may validate the release pair and spawn `/closure` (curator; DEC-0052 sanctioned alternate). This release child does not spawn it. `next_scheduled_phase=closure`; `next_scheduled_role=curator`.

---

## (history) 2026-10-15T09:27:02Z — RELEASE_FAIL

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
