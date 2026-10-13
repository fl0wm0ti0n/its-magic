# Release Notes — S0175 / US-0155

- **Sprint**: `S0175`
- **Story**: `US-0155` — interactive operator TUI. `runInteractiveTui` is a client of the admitted daemon/operator transport. Pause is argv `["pause"]`. `ITS_MAGIC_TUI_NONINTERACTIVE=1` paints once and returns.
- **Release date**: `2026-10-12T20:23:01Z` (UTC)
- **orchestrator_run_id**: `auto-20261012-us0155-release`
- **fresh_context_marker**: `release-US0155-release-20261012T202301Z-fresh`
- **runtime_proof_id**: `rp-auto-20261012-us0155-release-release-20261012T202301Z`
- **proof_hash**: `5d5d9b1123ed7d7bf98d42a9a8198981563d90a2916099678ed0a62170ba04a1`
- **proof_issued_at**: `2026-10-12T20:23:01Z`; **proof_ttl_seconds**: `3600`; **proof_ttl**: `2026-10-12T21:23:01Z`
- **release_version**: none (workflow-only; kit stays `0.1.10`)
- **npm_published**: `false`
- **git_pushed**: `false`

## Verdict

**RELEASE_PASS**. US-0155 stays **OPEN**. Closure owns the DONE flip and the acceptance ticks.

- **Publish: NOT PERFORMED** (`RELEASE_PUBLISH_MODE=confirm`; no npm publish; no registry write; no kit semver bump).
- **Push: NOT PERFORMED** (`SYNC_POLICY_MODE=disabled`; no git push; no commit).

## What this release records

Interactive `itsm-tui` on the admitted daemon/operator transport (R-0165, no new DEC):

- `runInteractiveTui` uses readline and the existing ANSI renderer inside `@its-magic/tui`. It does not start a second runtime, a workflow engine, or a Pi session. Protocol version stays 1.
- Commands, streaming events, failure diagnostics, and approve/cancel/pause/resume go through `OperatorTransport`. Pause submits argv `["pause"]` on the existing executor. CLI pause uses the same argv.
- Panels for conversation, changed files, app/log health, browser evidence, and model/token/cost sit beside the locked four-panel renderer. Streams past 200 lines or 32 KiB paint `evidence: truncated`. At `cols <= 40`, visible panels stay phase and status.
- Keys submit, approve, deny, cancel, pause, and resume. Resize re-renders. Paint redacts secret-shaped tokens. Reconnect replays from the last sequence. No TTY, or `ITS_MAGIC_TUI_NONINTERACTIVE=1`, prints one layout and returns. A pending approval then returns `OPERATOR_INPUT_REQUIRED`.
- Five `test_us0155_*` markers speak the real daemon protocol. Operator subsection: `## Interactive operator TUI (US-0155)` in `docs/engineering/runbook.md` and `template/docs/engineering/runbook.md`.

This release did not open a live external terminal and did not use paid credentials (`UAT_PROBE_FORBIDDEN`).

## Gate summary

| Gate | Result |
|------|--------|
| check_in_tests (1) | **PASS** — `tests/report.md` `2026-10-12T20:13:03Z` Pass 880 / Fail 0. US-0071 L713–L722 PASS. Triad L725–L726 PASS. Five markers re-run this release: 5 passed / 0 failed, duration_ms 3276.3101. Full harness not re-run. |
| qa (2) | **PASS** — `sprints/S0175/qa-findings.md` QA_PASS, no blocking findings |
| uat (3) | **PASS** — `sprints/S0175/uat.json` 6/6, `uat_lifecycle=populated`. Live external terminal `UAT_PROBE_FORBIDDEN`. |
| isolation (4) | **PASS** — execute/dev, qa/qa, verify-work/qa, plus this release/release marker |
| strict_runtime_proof (4b) | **PASS** — execute, qa, and verify-work pair hashes recomputed MATCH and are inside TTL; own proof MATCH |
| readme_feature_coverage_3f | **PASS** — coverage_total=50, `coverage_missing=[]`. US-0155 absent while OPEN. |
| project_readme_3g | **PASS** — `kit_repo_skipped=true` |
| publish | **NOT PERFORMED** |
| sync | **NOT PERFORMED** (`SYNC_DISABLED`) |
| backlog | **deferred to `/closure`** — US-0155 remains OPEN |

## Run

- `start_command`: `node --experimental-strip-types --test --test-name-pattern "test_us0155_" tests/contract/us0155.contract.test.ts` (cwd `standalone`)
- `runtime_mode`: `local`
- `runtime_context_ref`: `docs/engineering/runtime-connectivity.md`
- Deploy commands are already explicit in `docs/engineering/runbook.md`:
  - `DEPLOY_STAGING_COMMAND`: `echo "No staging deploy target configured for this repository"`
  - `DEPLOY_PROD_COMMAND`: `echo "No production deploy target configured for this repository"`
- Operator: `runInteractiveTui` on the admitted transport. Pause argv `["pause"]`. `ITS_MAGIC_TUI_NONINTERACTIVE=1` paints once and returns (`OPERATOR_INPUT_REQUIRED` when an approval is pending).

## Connect

- `service_url`: n/a (local fixtures only; no long-running remote service started in this release)
- `service_port`: n/a
- `health_endpoint`: n/a — health signal is the five-marker contract run, exit 0

## Verify

- `verification_steps`:
  1. `node --experimental-strip-types --test --test-name-pattern "test_us0155_" tests/contract/us0155.contract.test.ts` from `standalone` → 5 pass / 0 fail, exit 0.
  2. Read `tests/report.md` → `2026-10-12T20:13:03Z`, Pass 880 / Fail 0. US-0071 L713–L722 `[PASS]`. Triad L725–L726 `[PASS]`.
  3. `python scripts/validate_readme_feature_coverage.py --repo . --enforce` → exit 0, `coverage_missing=[]`. US-0155 stays out of `coverage_present` while OPEN.
- `expected_health_signal`: five `test_us0155_*` markers pass and the harness report stays Fail 0.

## Credentials

- `credential_source_refs`: none. This release did not read `.env` and did not use paid credentials.
- `expected_value_source`: not used. A live external terminal stays `UAT_PROBE_FORBIDDEN`.

## Known Issues

- None blocking. US-0155 stays **OPEN** until `/closure`. AC-1..AC-5 stay unchecked.

## Next

Fresh `/closure` as **curator**. Do not flip US-0155 in this phase.
