# Release Notes — S0170 / US-0150

- **Sprint**: `S0170`
- **Story**: `US-0150` — production standalone runtime composition. `createRuntimeHost` is the composition both CLI and daemon entrypoints construct.
- **Release date**: `2026-10-11T15:46:35Z` (UTC)
- **orchestrator_run_id**: `auto-20261011-us0150-release`
- **fresh_context_marker**: `release-US0150-release-20261011T154635Z-fresh`
- **runtime_proof_id**: `rp-auto-20261011-us0150-release-release-20261011T154635Z`
- **proof_hash**: `de5d239fc42e58fdef3bda981021b44867f82f95bdb3a1a899e51977daf511cd`
- **proof_issued_at**: `2026-10-11T15:46:35Z`; **proof_ttl_seconds**: `3600`; **proof_ttl**: `2026-10-11T16:46:35Z`
- **release_version**: none (workflow-only; kit stays `0.1.10`)
- **npm_published**: `false`
- **git_pushed**: `false`

## Verdict

**RELEASE_PASS**. US-0150 stays **OPEN**. Closure owns the DONE flip and the acceptance ticks.

- **Publish: NOT PERFORMED** (`RELEASE_PUBLISH_MODE=confirm`; no npm publish; no registry write; no kit semver bump).
- **Push: NOT PERFORMED** (`SYNC_POLICY_MODE=disabled`; no git push; no commit).

## What this release records

`createRuntimeHost` is the one composition root:

- CLI (`apps/cli/src/index.ts`) and daemon (`apps/daemon/src/index.ts`) construct that host and call `dispose()`.
- One resolved config. A hashed `codeContext` pack. Unavailable intelligence fails with `RUNTIME_SERVICE_UNAVAILABLE` and writes no pack.
- Host-present daemon reconcile passes that host config into crash resume. The supervisor-only empty-config branch is not the production entrypoint path.
- A production call with no factories creates a fresh attested custom-tool session on the deterministic local model seam.
- Admitted tools execute or deny. Result text does not use `ok:` success text.
- `dispose()` is idempotent and does not delete repository files. The operational store stays run/session/audit/index metadata.

This release did not start a daemon and did not call a paid model (`UAT_PROBE_FORBIDDEN`).

## Gate summary

| Gate | Result |
|------|--------|
| check_in_tests (1) | **PASS** — `tests/report.md` `2026-10-11T15:39:14Z` Pass 880 / Fail 0. US-0071 L713–L722 PASS. Triad L725–L726 PASS. Six markers re-run this release: 6 passed / 0 failed, duration_ms 1988.9537. |
| qa (2) | **PASS** — `sprints/S0170/qa-findings.md` QA_PASS, no blocking findings |
| uat (3) | **PASS** — `sprints/S0170/uat.json` 7/7, `uat_lifecycle=populated`. Live daemon and paid-model probe `UAT_PROBE_FORBIDDEN`. |
| isolation (4) | **PASS** — execute/dev, qa/qa, verify-work/qa, plus this release/release marker |
| strict_runtime_proof (4b) | **PASS** — execute, qa, and verify-work pair hashes recomputed MATCH and in TTL; own proof MATCH |
| readme_feature_coverage_3f | **PASS** — coverage_total=45, `coverage_missing=[]`. US-0150 absent while OPEN. |
| project_readme_3g | **PASS** — `kit_repo_skipped=true` |
| publish | **NOT PERFORMED** |
| sync | **NOT PERFORMED** (`SYNC_DISABLED`) |
| backlog | **deferred to `/closure`** — US-0150 remains OPEN |

## Run

- `start_command`: `node --experimental-strip-types --test --test-name-pattern "test_us0150_" tests/contract/us0150.contract.test.ts` (cwd `standalone`)
- `runtime_mode`: `local`
- `runtime_context_ref`: `docs/engineering/runtime-connectivity.md`
- Deploy commands are already explicit in `docs/engineering/runbook.md`:
  - `DEPLOY_STAGING_COMMAND`: `echo "No staging deploy target configured for this repository"`
  - `DEPLOY_PROD_COMMAND`: `echo "No production deploy target configured for this repository"`

## Connect

- `service_url`: n/a (local composition; no long-running HTTP service in this release)
- `service_port`: n/a
- `health_endpoint`: n/a — health signal is the six-marker contract run, exit 0

## Verify

- `verification_steps`:
  1. `node --experimental-strip-types --test --test-name-pattern "test_us0150_" tests/contract/us0150.contract.test.ts` from `standalone` → 6 pass / 0 fail, exit 0.
  2. Read `tests/report.md` → `2026-10-11T15:39:14Z`, Pass 880 / Fail 0. US-0071 L713–L722 `[PASS]`. Triad L725–L726 `[PASS]`.
  3. `python scripts/validate_readme_feature_coverage.py --repo . --enforce` → exit 0, `coverage_missing=[]`. US-0150 stays out of `coverage_present` while OPEN.
- `expected_health_signal`: six `test_us0150_*` markers pass and the harness report stays Fail 0.

## Credentials

- `credential_source_refs`: none. This release did not read `.env` and did not use paid credentials.
- `expected_value_source`: not used. A live daemon or paid-model probe stays `UAT_PROBE_FORBIDDEN`.

## Known Issues

- None blocking. US-0150 stays **OPEN** until `/closure`. AC-1..AC-6 stay unchecked.

## Next

Fresh `/closure` as **curator**. Do not flip US-0150 in this phase.
