# Release Notes — S0172 / US-0152

- **Sprint**: `S0172`
- **Story**: `US-0152` — production application and browser UAT integration. The host owns `AppRuntime` and `BrowserUAT`, and release gates use app health plus browser evidence.
- **Release date**: `2026-10-11T19:48:08Z` (UTC)
- **orchestrator_run_id**: `auto-20261011-us0152-release`
- **fresh_context_marker**: `release-US0152-release-20261011T194808Z-fresh`
- **runtime_proof_id**: `rp-auto-20261011-us0152-release-release-20261011T194808Z`
- **proof_hash**: `d49f4d80ced498440b0155bddd22cc10260c1253c97e9c4ec1ffa999f5ac703f`
- **proof_issued_at**: `2026-10-11T19:48:08Z`; **proof_ttl_seconds**: `3600`; **proof_ttl**: `2026-10-11T20:48:08Z`
- **release_version**: none (workflow-only; kit stays `0.1.10`)
- **npm_published**: `false`
- **git_pushed**: `false`

## Verdict

**RELEASE_PASS**. US-0152 stays **OPEN**. Closure owns the DONE flip and the acceptance ticks.

- **Publish: NOT PERFORMED** (`RELEASE_PUBLISH_MODE=confirm`; no npm publish; no registry write; no kit semver bump).
- **Push: NOT PERFORMED** (`SYNC_POLICY_MODE=disabled`; no git push; no commit).

## What this release records

The production host owns application runtime and browser UAT:

- `createRuntimeHost` constructs `createAppRuntime` and `createBrowserUat` with `new PlaywrightIsolatedDriver()`. `dispose` cleans the app and the browser before the store closes.
- Production browser mode returns the existing `BROWSER_UNAVAILABLE` when Chromium cannot load. The `BrowserUAT` default stays `FakeBrowserDriver` for tests that omit a driver.
- `writeShot` writes image bytes for a non-fake driver and `screenshot-placeholder` only for `kind: "fake"`.
- Before `WorkflowEngine.evaluateRelease`, gate input comes from app start/health, a browser probe, and bounded retry. Missing health or an exhausted retry fails the gate. `uat_pass` is false when evidence is missing.
- A redacted screenshot, trace ref, console summary, network summary, final URL, and `app_runtime_ref` persist through `writeEvidence` and `redactEvidencePayload`. `assertEvidenceComplete` blocks a passing row that lacks any of them (`BROWSER_EVIDENCE_GAP`, then `RELEASE_UAT_FAILED`). `screenshot-placeholder` is not evidence.
- `executeOperatorCommand` calls the host app and browser services for `app` and `browser`. Outcomes use the existing codes only. `readAppHealth` reads the same app service.
- Template twins of the touched files match.

This release did not open an external site and did not use paid credentials (`UAT_PROBE_FORBIDDEN`).

## Gate summary

| Gate | Result |
|------|--------|
| check_in_tests (1) | **PASS** — `tests/report.md` `2026-10-11T19:38:28Z` Pass 880 / Fail 0. US-0071 L713–L722 PASS. Triad L725–L726 PASS. Six markers re-run this release: 6 passed / 0 failed, duration_ms 1686.1258. |
| qa (2) | **PASS** — `sprints/S0172/qa-findings.md` QA_PASS, no blocking findings |
| uat (3) | **PASS** — `sprints/S0172/uat.json` 7/7, `uat_lifecycle=populated`. Live external browser probe `UAT_PROBE_FORBIDDEN`. |
| isolation (4) | **PASS** — execute/dev, qa/qa, verify-work/qa, plus this release/release marker |
| strict_runtime_proof (4b) | **PASS** — execute, qa, and verify-work pair hashes recomputed MATCH and are inside TTL; own proof MATCH |
| readme_feature_coverage_3f | **PASS** — coverage_total=47, `coverage_missing=[]`. US-0152 absent while OPEN. |
| project_readme_3g | **PASS** — `kit_repo_skipped=true` |
| publish | **NOT PERFORMED** |
| sync | **NOT PERFORMED** (`SYNC_DISABLED`) |
| backlog | **deferred to `/closure`** — US-0152 remains OPEN |

## Run

- `start_command`: `node --experimental-strip-types --test --test-name-pattern "test_us0152_" tests/contract/us0152.contract.test.ts` (cwd `standalone`)
- `runtime_mode`: `local`
- `runtime_context_ref`: `docs/engineering/runtime-connectivity.md`
- Deploy commands are already explicit in `docs/engineering/runbook.md`:
  - `DEPLOY_STAGING_COMMAND`: `echo "No staging deploy target configured for this repository"`
  - `DEPLOY_PROD_COMMAND`: `echo "No production deploy target configured for this repository"`

## Connect

- `service_url`: n/a (local host services; no long-running HTTP service started in this release)
- `service_port`: n/a
- `health_endpoint`: n/a — health signal is the six-marker contract run, exit 0

## Verify

- `verification_steps`:
  1. `node --experimental-strip-types --test --test-name-pattern "test_us0152_" tests/contract/us0152.contract.test.ts` from `standalone` → 6 pass / 0 fail, exit 0.
  2. Read `tests/report.md` → `2026-10-11T19:38:28Z`, Pass 880 / Fail 0. US-0071 L713–L722 `[PASS]`. Triad L725–L726 `[PASS]`.
  3. `python scripts/validate_readme_feature_coverage.py --repo . --enforce` → exit 0, `coverage_missing=[]`. US-0152 stays out of `coverage_present` while OPEN.
- `expected_health_signal`: six `test_us0152_*` markers pass and the harness report stays Fail 0.

## Credentials

- `credential_source_refs`: none. This release did not read `.env` and did not use paid credentials.
- `expected_value_source`: not used. A live external browser probe stays `UAT_PROBE_FORBIDDEN`.

## Known Issues

- None blocking. US-0152 stays **OPEN** until `/closure`. AC-1..AC-6 stay unchecked.

## Next

Fresh `/closure` as **curator**. Do not flip US-0152 in this phase.
