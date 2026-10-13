# Release Notes — S0174 / US-0154

- **Sprint**: `S0174`
- **Story**: `US-0154` — standalone operator-path quality gate. Installed `itsm` paths and CI are authoritative. A skipped fake or a unit seam cannot pass production acceptance.
- **Release date**: `2026-10-12T18:38:50Z` (UTC)
- **orchestrator_run_id**: `auto-20261012-us0154-release`
- **fresh_context_marker**: `release-US0154-release-20261012T183850Z-fresh`
- **runtime_proof_id**: `rp-auto-20261012-us0154-release-release-20261012T183850Z`
- **proof_hash**: `1de4694752e897a0d0970508d5ad180e28bacfdae077f07d123fa2dac0c3be89`
- **proof_issued_at**: `2026-10-12T18:38:50Z`; **proof_ttl_seconds**: `3600`; **proof_ttl**: `2026-10-12T19:38:50Z`
- **release_version**: none (workflow-only; kit stays `0.1.10`)
- **npm_published**: `false`
- **git_pushed**: `false`

## Verdict

**RELEASE_PASS**. US-0154 stays **OPEN**. Closure owns the DONE flip and the acceptance ticks.

- **Publish: NOT PERFORMED** (`RELEASE_PUBLISH_MODE=confirm`; no npm publish; no registry write; no kit semver bump).
- **Push: NOT PERFORMED** (`SYNC_POLICY_MODE=disabled`; no git push; no commit).

## What this release records

Standalone CI and a spawned public `itsm` bin:

- Job `standalone-test` is a matrix of `windows-latest` and `ubuntu-latest`. Each leg pins Node `22.19.0`, runs `npm ci` in `standalone/`, then `npm run typecheck && npm run lint && npm test`. Root job `checks` stays on kit `TEST_COMMAND`. `LINT_COMMAND` and `TYPECHECK_COMMAND` stay blank. `template/.github/workflows/ci.yml` was not edited.
- Contract tests spawn the public `itsm` bin (`standalone/apps/cli/src/index.ts`), `itsm-daemon`, and `itsm-tui`. A passing child shows store path `.its-magic/runtime/ops.sqlite`, a non-empty config, and a transport disposition. Empty config exits `RUNTIME_CONFIG_UNAVAILABLE`.
- Operator-path coverage includes fresh session admission, policy allow and deny, validator failure before work, resume from the sqlite store, daemon attach/replay, and CLI/TUI parity.
- `FakeBrowserDriver`, `screenshot-placeholder`, `artifact_sha: "fake-sha"`, and no-op `{ok:true}` / `{scheduled:true}` fail the operator-path bucket. Reports split `unit_seam` from `operator_path` and fail on a throwing kernel, empty configuration, `:memory:`, or a discarded transport.
- Acceptance text records US-0133 through US-0148 as completed library/contract slices and US-0150 through US-0154 as the production-integration follow-up. Phase-9 deferrals are not missing v1 work. The US-0154 checkbox stays open.
- The Node `22.19.0` pin is already in `docs/engineering/runbook.md` and `template/docs/engineering/runbook.md` (`## Standalone workspace CI pin (US-0154)`). This release did not add another operator subsection.

This release did not deploy to a real remote target and did not use paid credentials (`UAT_PROBE_FORBIDDEN`).

## Gate summary

| Gate | Result |
|------|--------|
| check_in_tests (1) | **PASS** — `tests/report.md` `2026-10-12T18:29:11Z` Pass 880 / Fail 0. US-0071 L713–L722 PASS. Triad L725–L726 PASS. Five markers re-run this release: 5 passed / 0 failed, duration_ms 12459.941. Full harness not re-run. |
| qa (2) | **PASS** — `sprints/S0174/qa-findings.md` QA_PASS, no blocking findings |
| uat (3) | **PASS** — `sprints/S0174/uat.json` 7/7, `uat_lifecycle=populated`. Live external deploy `UAT_PROBE_FORBIDDEN`. |
| isolation (4) | **PASS** — execute/dev, qa/qa, verify-work/qa, plus this release/release marker |
| strict_runtime_proof (4b) | **PASS** — execute, qa, and verify-work pair hashes recomputed MATCH and are inside TTL; own proof MATCH |
| readme_feature_coverage_3f | **PASS** — coverage_total=49, `coverage_missing=[]`. US-0154 absent while OPEN. |
| project_readme_3g | **PASS** — `kit_repo_skipped=true` |
| publish | **NOT PERFORMED** |
| sync | **NOT PERFORMED** (`SYNC_DISABLED`) |
| backlog | **deferred to `/closure`** — US-0154 remains OPEN |

## Run

- `start_command`: `node --experimental-strip-types --test --test-name-pattern "test_us0154_" tests/contract/us0154.contract.test.ts` (cwd `standalone`)
- `runtime_mode`: `local`
- `runtime_context_ref`: `docs/engineering/runtime-connectivity.md`
- Deploy commands are already explicit in `docs/engineering/runbook.md`:
  - `DEPLOY_STAGING_COMMAND`: `echo "No staging deploy target configured for this repository"`
  - `DEPLOY_PROD_COMMAND`: `echo "No production deploy target configured for this repository"`
- Operator pin: Node `22.19.0` on job `standalone-test` (`npm ci`, then `npm run typecheck && npm run lint && npm test`). Root `LINT_COMMAND` and `TYPECHECK_COMMAND` stay blank.

## Connect

- `service_url`: n/a (local fixtures only; no long-running remote service started in this release)
- `service_port`: n/a
- `health_endpoint`: n/a — health signal is the five-marker contract run, exit 0

## Verify

- `verification_steps`:
  1. `node --experimental-strip-types --test --test-name-pattern "test_us0154_" tests/contract/us0154.contract.test.ts` from `standalone` → 5 pass / 0 fail, exit 0.
  2. Read `tests/report.md` → `2026-10-12T18:29:11Z`, Pass 880 / Fail 0. US-0071 L713–L722 `[PASS]`. Triad L725–L726 `[PASS]`.
  3. `python scripts/validate_readme_feature_coverage.py --repo . --enforce` → exit 0, `coverage_missing=[]`. US-0154 stays out of `coverage_present` while OPEN.
- `expected_health_signal`: five `test_us0154_*` markers pass and the harness report stays Fail 0.

## Credentials

- `credential_source_refs`: none. This release did not read `.env` and did not use paid credentials.
- `expected_value_source`: not used. A live external deploy stays `UAT_PROBE_FORBIDDEN`.

## Known Issues

- None blocking. US-0154 stays **OPEN** until `/closure`. AC-1..AC-6 stay unchecked.

## Next

Fresh `/closure` as **curator**. Do not flip US-0154 in this phase.
