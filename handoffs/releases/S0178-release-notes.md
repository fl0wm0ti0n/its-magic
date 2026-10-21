# Release Notes — S0178 / BUG-0029

- **Sprint**: `S0178`
- **Bug**: `BUG-0029` — `itsm auth login <provider> --type api_key` reads one masked TTY secret, or one stdin line with `--api-key-stdin`. Success prints configured JSON only after `checkAuth` reports a stored credential of the requested type.
- **Release date**: `2026-10-16T14:54:00Z` (UTC)
- **orchestrator_run_id**: `auto-20261016-bug0029`
- **fresh_context_marker**: `release-BUG0029-release-fix1-20261016T145400Z-fresh`
- **model_id**: `inherit`
- **implementation_loop_index**: `1`
- **runtime_proof_id**: `rp-auto-20261016-bug0029-release-release-20261016T145400Z-BUG-0029-fix1`
- **proof_hash**: `40328d3ec669b480e982a18759cf1198c8acefc5e7308fba87d581e86db2f270`
- **proof_issued_at**: `2026-10-16T14:54:00Z`; **proof_ttl_seconds**: `3600`; **proof_ttl**: `2026-10-16T15:54:00Z`
- **release_version**: none (workflow-only; kit semver unchanged)
- **npm_published**: `false`
- **git_pushed**: `false`

## Verdict

**RELEASE_PASS**. BUG-0029 stays **OPEN**. Closure owns the DONE flip and the acceptance ticks. This remediation pass follows the `2026-10-16T00:26:12Z` RELEASE_FAIL. That earlier proof id was not reused.

- **Publish: NOT PERFORMED** (`RELEASE_PUBLISH_MODE=confirm`; operator confirmation absent; `PUBLISH_CONFIRMATION_REQUIRED`; no npm publish; no registry write; no kit semver bump).
- **Push: NOT PERFORMED** (`SYNC_POLICY_MODE=disabled`; `SYNC_DISABLED`; no git push; no commit).

## What's new

- BUG-0029: masked TTY or `--api-key-stdin` login exits 0 with configured JSON only after a stored credential of the requested type is confirmed. Cancel, empty, invalid, persist failure, and non-TTY login without the flag exit 1 and do not print that JSON. Seven contract markers cover the path.

## What this release records

API-key login on `itsm` (implementation loop 1):

- `itsm auth login <provider> --type api_key` reads one masked TTY secret.
- `--api-key-stdin` reads one line from standard input.
- Success prints `{"provider":"<id>","auth":"configured"}` only after `checkAuth` reports a stored credential of the requested type.
- Cancel, empty, invalid, persist failure, and non-TTY login without the flag exit 1 and do not print that JSON.
- Seven `test_bug0029_*` markers cover that behavior.

This release did not run a live installed binary and did not use paid credentials (`UAT_PROBE_FORBIDDEN`).

## Gate summary

| Gate | Result |
|------|--------|
| check_in_tests (1) | **PASS** — fresh `TEST_COMMAND` exit 0, elapsed_ms 620631. `tests/report.md` `2026-10-16T14:52:23Z` Pass 880 / Fail 0. US-0071 L713–L722 PASS. Triad L723–L726 PASS. Seven markers re-run this release: 7 passed / 0 failed, duration_ms 156.2917. |
| qa (2) | **PASS** — `sprints/S0178/qa-findings.md` QA_PASS, no blocking findings. `generated_test_result=pass`, `generated_test_reason_code=ok`. |
| uat (3) | **PASS** — `sprints/S0178/uat.json` 6/6, `uat_lifecycle=populated`, `placeholder_only=false`. Live classes `UAT_PROBE_FORBIDDEN`. |
| isolation (4) | **PASS** — execute/dev, qa/qa, verify-work/qa, plus this release/release marker (`model_id=inherit`) |
| strict_runtime_proof (4b) | **PASS** — execute, qa, and verify-work hashes recomputed MATCH and were inside TTL at `2026-10-16T14:54:00Z`. Own release proof second invocation MATCH. |
| readme_feature_coverage_3f | **PASS** — `--enforce` exit 0, `coverage_missing=[]`, `coverage_total=52` |
| project_readme_3g | **PASS** — `kit_repo_skipped=true` |
| publish | **NOT PERFORMED** |
| sync | **NOT PERFORMED** (`SYNC_DISABLED`) |
| backlog | **deferred to `/closure`** — BUG-0029 remains OPEN |

## Run

- `start_command`: `node --experimental-strip-types --test --test-name-pattern "test_bug0029_" tests/contract/bug0029.contract.test.ts` (cwd `standalone`)
- `runtime_mode`: `local`
- `runtime_context_ref`: `docs/engineering/runtime-connectivity.md`
- Deploy commands are already explicit in `docs/engineering/runbook.md`:
  - `DEPLOY_STAGING_COMMAND`: `echo "No staging deploy target configured for this repository"`
  - `DEPLOY_PROD_COMMAND`: `echo "No production deploy target configured for this repository"`
- Operator: `itsm auth login <provider> --type api_key` uses a masked TTY secret, or `--api-key-stdin` for one stdin line. See `## API-key login (BUG-0029)` in `docs/engineering/runbook.md`.

## Connect

- `service_url`: n/a (local fixtures only; no long-running remote service started in this release)
- `service_port`: n/a
- `health_endpoint`: n/a — health signal is the seven-marker contract run, exit 0

## Verify

- `verification_steps`:
  1. `node --experimental-strip-types --test --test-name-pattern "test_bug0029_" tests/contract/bug0029.contract.test.ts` from `standalone` → 7 pass / 0 fail, exit 0.
  2. Read `tests/report.md` → `2026-10-16T14:52:23Z`, Pass 880 / Fail 0. US-0071 L713–L722 `[PASS]`. Triad L723–L726 `[PASS]`.
  3. `python scripts/validate_readme_feature_coverage.py --repo . --enforce` → exit 0, `coverage_missing=[]`, `coverage_total=52`.
- `expected_health_signal`: seven `test_bug0029_*` markers pass and the harness report stays Fail 0.

## Credentials

- `credential_source_refs`: none. This release did not read `.env` and did not use paid credentials.
- `expected_value_source`: not used. A live installed binary stays `UAT_PROBE_FORBIDDEN`.

## Known Issues

- None blocking. BUG-0029 stays **OPEN** until `/closure`. AC-1..AC-5 stay unchecked.

## Next

Fresh `/closure` as **curator**. `qe` is not a spawnable subagent on this Cursor host; DEC-0052 sanctioned alternate is curator. Do not flip BUG-0029 in this phase. This release child does not spawn `/closure`.
