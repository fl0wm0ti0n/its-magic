# Release Notes — S0176 / BUG-0028

- **Sprint**: `S0176`
- **Bug**: `BUG-0028` — lightweight `itsm` help, auth, models, and bare status no longer construct the full runtime. Workflow commands, including `/status`, still admit `createRuntimeHost`.
- **Release date**: `2026-10-14T21:07:42Z` (UTC)
- **orchestrator_run_id**: `auto-20261013-bug0028`
- **fresh_context_marker**: `release-BUG0028-release-20261014T210742Z-fresh`
- **model_id**: `inherit`
- **runtime_proof_id**: `rp-auto-20261013-bug0028-release-release-20261014T210742Z-BUG-0028`
- **proof_hash**: `5b6179bd2d740349350250637e17f292d1db0f55ecf55d93eeda7bf73392d77e`
- **proof_issued_at**: `2026-10-14T21:07:42Z`; **proof_ttl_seconds**: `3600`; **proof_ttl**: `2026-10-14T22:07:42Z`
- **release_version**: none (workflow-only; kit stays `0.1.10`)
- **npm_published**: `false`
- **git_pushed**: `false`

## Verdict

**RELEASE_PASS**. BUG-0028 stays **OPEN**. Closure owns the DONE flip and the acceptance ticks.

- **Publish: NOT PERFORMED** (`RELEASE_PUBLISH_MODE=confirm`; no npm publish; no registry write; no kit semver bump).
- **Push: NOT PERFORMED** (`SYNC_POLICY_MODE=disabled`; no git push; no commit).

## What this release records

Lightweight inspection and auth on `itsm` (R-0166, no new DEC):

- No-argument `itsm`, help (`--help` and `-h`), `auth`, and `models` classify before any static import of the workflow runner. They do not construct RuntimeHost, the Pi kernel, code intelligence, ToolBroker, or SQLite.
- Bare `status` is a bounded read-only snapshot. It does not scan the repository, open a workflow session, ping the daemon, or call `resolveOperatorTransport`.
- Workflow commands, including `ask`, `resume`, `pause`, `index`, `app`, `browser`, and `/status`, still admit production `createRuntimeHost`.
- Five `test_bug0028_*` markers cover that split, plus Windows and Linux launcher files and the operator-doc paragraph.

This release did not run a live installed binary and did not use paid credentials (`UAT_PROBE_FORBIDDEN`).

## Gate summary

| Gate | Result |
|------|--------|
| check_in_tests (1) | **PASS** — `TEST_COMMAND` exit 0. `tests/report.md` `2026-10-14T21:06:12Z` Pass 880 / Fail 0. US-0071 L713–L722 PASS. Triad L725–L726 PASS. Five markers re-run this release: 5 passed / 0 failed, duration_ms 5427.8777. |
| qa (2) | **PASS** — `sprints/S0176/qa-findings.md` QA_PASS, no blocking findings |
| uat (3) | **PASS** — `sprints/S0176/uat.json` 6/6, `uat_lifecycle=populated`. Live installed binary `UAT_PROBE_FORBIDDEN`. |
| isolation (4) | **PASS** — execute/dev, qa/qa, verify-work/qa, plus this release/release marker (`model_id=inherit`) |
| strict_runtime_proof (4b) | **PASS** — execute, qa, and verify-work hashes recomputed MATCH. Verify-work is inside TTL at issue. Each hop consumed the previous proof inside that proof's TTL. |
| readme_feature_coverage_3f | **PASS** — coverage_total=51, `coverage_missing=[]`. BUG-0028 absent while OPEN. |
| project_readme_3g | **PASS** — `kit_repo_skipped=true` |
| publish | **NOT PERFORMED** |
| sync | **NOT PERFORMED** (`SYNC_DISABLED`) |
| backlog | **deferred to `/closure`** — BUG-0028 remains OPEN |

## Run

- `start_command`: `node --experimental-strip-types --test --test-name-pattern "test_bug0028_" tests/contract/bug0028.contract.test.ts` (cwd `standalone`)
- `runtime_mode`: `local`
- `runtime_context_ref`: `docs/engineering/runtime-connectivity.md`
- Deploy commands are already explicit in `docs/engineering/runbook.md`:
  - `DEPLOY_STAGING_COMMAND`: `echo "No staging deploy target configured for this repository"`
  - `DEPLOY_PROD_COMMAND`: `echo "No production deploy target configured for this repository"`
- Operator: no-argument `itsm`, help, auth, models, and bare `itsm status` stay on the lightweight path. Workflow commands, including `/status`, still call `createRuntimeHost`. See `## Lightweight itsm inspection (BUG-0028)` in `docs/engineering/runbook.md`.

## Connect

- `service_url`: n/a (local fixtures only; no long-running remote service started in this release)
- `service_port`: n/a
- `health_endpoint`: n/a — health signal is the five-marker contract run, exit 0

## Verify

- `verification_steps`:
  1. `node --experimental-strip-types --test --test-name-pattern "test_bug0028_" tests/contract/bug0028.contract.test.ts` from `standalone` → 5 pass / 0 fail, exit 0.
  2. Read `tests/report.md` → `2026-10-14T21:06:12Z`, Pass 880 / Fail 0. US-0071 L713–L722 `[PASS]`. Triad L725–L726 `[PASS]`.
  3. `python scripts/validate_readme_feature_coverage.py --repo . --enforce` → exit 0, `coverage_missing=[]`. BUG-0028 stays out of `coverage_present` while OPEN.
- `expected_health_signal`: five `test_bug0028_*` markers pass and the harness report stays Fail 0.

## Credentials

- `credential_source_refs`: none. This release did not read `.env` and did not use paid credentials.
- `expected_value_source`: not used. A live installed binary stays `UAT_PROBE_FORBIDDEN`.

## Known Issues

- None blocking. BUG-0028 stays **OPEN** until `/closure`. AC-1..AC-5 stay unchecked.

## Next

Fresh `/closure` as **curator**. `qe` is not a spawnable subagent on this Cursor host; S0175 used curator as the sanctioned closure alternate. Do not flip BUG-0028 in this phase. This release child does not spawn `/closure`.
