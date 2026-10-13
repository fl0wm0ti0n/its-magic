# Release Notes — S0171 / US-0151

- **Sprint**: `S0171`
- **Story**: `US-0151` — executable lifecycle on the resolved operator transport. CLI, daemon, and TUI submit work, and the US-0150 host executes it.
- **Release date**: `2026-10-11T17:54:48Z` (UTC)
- **orchestrator_run_id**: `auto-20261011-us0151-release`
- **fresh_context_marker**: `release-US0151-release-20261011T175448Z-fresh`
- **runtime_proof_id**: `rp-auto-20261011-us0151-release-release-20261011T175448Z`
- **proof_hash**: `e43bfab2433c89345d56a2d2807dbc907b2b64da29d0ffe3963972f2163406e9`
- **proof_issued_at**: `2026-10-11T17:54:48Z`; **proof_ttl_seconds**: `3600`; **proof_ttl**: `2026-10-11T18:54:48Z`
- **release_version**: none (workflow-only; kit stays `0.1.10`)
- **npm_published**: `false`
- **git_pushed**: `false`

## Verdict

**RELEASE_PASS**. US-0151 stays **OPEN**. Closure owns the DONE flip and the acceptance ticks.

- **Publish: NOT PERFORMED** (`RELEASE_PUBLISH_MODE=confirm`; no npm publish; no registry write; no kit semver bump).
- **Push: NOT PERFORMED** (`SYNC_POLICY_MODE=disabled`; no git push; no commit).

## What this release records

CLI, daemon, and TUI submit on one resolved operator transport:

- Production CLI and TUI keep the `OperatorTransport` from `resolveOperatorTransport` and do not open `:memory:`.
- One executor in `runtime-core` runs scheduler commands through `runAuto` / `runQuick`, programmatic lifecycle through `runCommand` and `runStandardLifecycle` when the route is a plan, resume through `crashResume` plus `readRepoResume`, and ask/index through `host.intel`.
- Results are `success`, `gate_block`, or `execution_failure`. A rendered plan or route-only `{ok:true}` is not success.
- The daemon builds one `WorkflowEngine` for the process.
- App and browser return the existing unavailable codes (`APP_HEALTH_UNAVAILABLE`, `BROWSER_UNAVAILABLE`).
- TUI timeline is daemon attach, `/v1/events` replay, and `status.snapshot`. Protocol version stays 1. Panel ids stay.
- Template twins of the touched files match.

This release did not call a paid model and did not use the network (`UAT_PROBE_FORBIDDEN`).

## Gate summary

| Gate | Result |
|------|--------|
| check_in_tests (1) | **PASS** — `tests/report.md` `2026-10-11T17:44:57Z` Pass 880 / Fail 0. US-0071 L713–L722 PASS. Triad L725–L726 PASS. Six markers re-run this release: 6 passed / 0 failed, duration_ms 3092.0535. |
| qa (2) | **PASS** — `sprints/S0171/qa-findings.md` QA_PASS, no blocking findings |
| uat (3) | **PASS** — `sprints/S0171/uat.json` 7/7, `uat_lifecycle=populated`. Live paid-model and network probe `UAT_PROBE_FORBIDDEN`. |
| isolation (4) | **PASS** — execute/dev, qa/qa, verify-work/qa, plus this release/release marker |
| strict_runtime_proof (4b) | **PASS** — execute, qa, and verify-work pair hashes recomputed MATCH and are not expired; qa-pair and verify-pair are inside TTL; own proof MATCH |
| readme_feature_coverage_3f | **PASS** — coverage_total=46, `coverage_missing=[]`. US-0151 absent while OPEN. |
| project_readme_3g | **PASS** — `kit_repo_skipped=true` |
| publish | **NOT PERFORMED** |
| sync | **NOT PERFORMED** (`SYNC_DISABLED`) |
| backlog | **deferred to `/closure`** — US-0151 remains OPEN |

## Run

- `start_command`: `node --experimental-strip-types --test --test-name-pattern "test_us0151_" tests/contract/us0151.contract.test.ts` (cwd `standalone`)
- `runtime_mode`: `local`
- `runtime_context_ref`: `docs/engineering/runtime-connectivity.md`
- Deploy commands are already explicit in `docs/engineering/runbook.md`:
  - `DEPLOY_STAGING_COMMAND`: `echo "No staging deploy target configured for this repository"`
  - `DEPLOY_PROD_COMMAND`: `echo "No production deploy target configured for this repository"`

## Connect

- `service_url`: n/a (local operator transport; no long-running HTTP service started in this release)
- `service_port`: n/a
- `health_endpoint`: n/a — health signal is the six-marker contract run, exit 0

## Verify

- `verification_steps`:
  1. `node --experimental-strip-types --test --test-name-pattern "test_us0151_" tests/contract/us0151.contract.test.ts` from `standalone` → 6 pass / 0 fail, exit 0.
  2. Read `tests/report.md` → `2026-10-11T17:44:57Z`, Pass 880 / Fail 0. US-0071 L713–L722 `[PASS]`. Triad L725–L726 `[PASS]`.
  3. `python scripts/validate_readme_feature_coverage.py --repo . --enforce` → exit 0, `coverage_missing=[]`. US-0151 stays out of `coverage_present` while OPEN.
- `expected_health_signal`: six `test_us0151_*` markers pass and the harness report stays Fail 0.

## Credentials

- `credential_source_refs`: none. This release did not read `.env` and did not use paid credentials.
- `expected_value_source`: not used. A live paid-model or network probe stays `UAT_PROBE_FORBIDDEN`.

## Known Issues

- None blocking. US-0151 stays **OPEN** until `/closure`. AC-1..AC-6 stay unchecked.

## Next

Fresh `/closure` as **curator**. Do not flip US-0151 in this phase.
