# Release Notes — S0173 / US-0153

- **Sprint**: `S0173`
- **Story**: `US-0153` — parallel arbitration and configured release targets. A skipped hook or a stub adapter cannot pass a release.
- **Release date**: `2026-10-11T21:35:12Z` (UTC)
- **orchestrator_run_id**: `auto-20261011-us0153-release`
- **fresh_context_marker**: `release-US0153-release-20261011T213512Z-fresh`
- **runtime_proof_id**: `rp-auto-20261011-us0153-release-release-20261011T213512Z`
- **proof_hash**: `ce8455383a8978020eb1d1622141dabf9437f722c7c486bbd563404ce2ea8b28`
- **proof_issued_at**: `2026-10-11T21:35:12Z`; **proof_ttl_seconds**: `3600`; **proof_ttl**: `2026-10-11T22:35:12Z`
- **release_version**: none (workflow-only; kit stays `0.1.10`)
- **npm_published**: `false`
- **git_pushed**: `false`

## Verdict

**RELEASE_PASS**. US-0153 stays **OPEN**. Closure owns the DONE flip and the acceptance ticks.

- **Publish: NOT PERFORMED** (`RELEASE_PUBLISH_MODE=confirm`; no npm publish; no registry write; no kit semver bump).
- **Push: NOT PERFORMED** (`SYNC_POLICY_MODE=disabled`; no git push; no commit).

## What this release records

Parallel arbitration and configured release targets:

- When `SOVEREIGN_PARALLEL_DEV=1`, `runExecuteQaLoop` keeps `afterExecutePass`. A skipped hook or a hook `reason_code` fails closed. The loop calls `runQaArbiter` and writes `handoffs/parallel_dev_pick.json` for `winner_selected` and `reject_all`. `reject_all` uses `PARALLEL_DEV_SELECTION_NO_PASS`. When the flag is off, the no-op path stays.
- Release apply and verify read configured targets (`kind`, `target_id`, `endpoint`). A missing target returns `ok: false` and `RELEASE_TARGET_UNCONFIGURED`, and the gate sets `deploy_targets_pass: false`. `artifact_sha: "fake-sha"` cannot set `deploy_targets_pass` true.
- Smoke uses `deploy_smoke_probe`. Verify cites a real artifact ref. Repair uses `deploy_healing_retry`. Disabled healing is not a deploy pass. Exhausted repair stays `DEPLOY_DEFERRED` or `DEPLOY_HEALING_DEFERRED`. Premature closure stays `RELEASE_PREMATURE` and `CLOSURE_RELEASE_EVIDENCE_MISSING`. `releaseCannotMarkDone` stays.
- `DeliveryResourceGuard.check` and the path policy run before worktree create, deploy, and repair. Denied paths use `POLICY_TRAVERSAL_DENIED` or `POLICY_DEFAULT_DENY` and append one audit line.
- Operator surface: `docs/engineering/runbook.md` and `template/docs/engineering/runbook.md` share `### Parallel arbitration and configured release targets (US-0153)`.

This release did not deploy to a real remote target and did not use paid credentials (`UAT_PROBE_FORBIDDEN`).

## Gate summary

| Gate | Result |
|------|--------|
| check_in_tests (1) | **PASS** — `tests/report.md` `2026-10-11T21:19:17Z` Pass 880 / Fail 0. US-0071 L713–L722 PASS. Triad L725–L726 PASS. Five markers re-run this release: 5 passed / 0 failed, duration_ms 484.0359. Full harness not re-run. |
| qa (2) | **PASS** — `sprints/S0173/qa-findings.md` QA_PASS, no blocking findings |
| uat (3) | **PASS** — `sprints/S0173/uat.json` 6/6, `uat_lifecycle=populated`. Live remote deploy `UAT_PROBE_FORBIDDEN`. |
| isolation (4) | **PASS** — execute/dev, qa/qa, verify-work/qa, plus this release/release marker |
| strict_runtime_proof (4b) | **PASS** — execute, qa, and verify-work pair hashes recomputed MATCH and are inside TTL; own proof MATCH |
| readme_feature_coverage_3f | **PASS** — coverage_total=48, `coverage_missing=[]`. US-0153 absent while OPEN. |
| project_readme_3g | **PASS** — `kit_repo_skipped=true` |
| publish | **NOT PERFORMED** |
| sync | **NOT PERFORMED** (`SYNC_DISABLED`) |
| backlog | **deferred to `/closure`** — US-0153 remains OPEN |

## Run

- `start_command`: `node --experimental-strip-types --test --test-name-pattern "test_us0153_" tests/contract/us0153.contract.test.ts` (cwd `standalone`)
- `runtime_mode`: `local`
- `runtime_context_ref`: `docs/engineering/runtime-connectivity.md`
- Deploy commands are already explicit in `docs/engineering/runbook.md`:
  - `DEPLOY_STAGING_COMMAND`: `echo "No staging deploy target configured for this repository"`
  - `DEPLOY_PROD_COMMAND`: `echo "No production deploy target configured for this repository"`
- Operator flag: `SOVEREIGN_PARALLEL_DEV` (`0` default, `1` arbitrates). Unconfigured targets fail with `RELEASE_TARGET_UNCONFIGURED`. Stub sha `fake-sha` fails closed.

## Connect

- `service_url`: n/a (fixture targets only; no long-running remote service started in this release)
- `service_port`: n/a
- `health_endpoint`: n/a — health signal is the five-marker contract run, exit 0

## Verify

- `verification_steps`:
  1. `node --experimental-strip-types --test --test-name-pattern "test_us0153_" tests/contract/us0153.contract.test.ts` from `standalone` → 5 pass / 0 fail, exit 0.
  2. Read `tests/report.md` → `2026-10-11T21:19:17Z`, Pass 880 / Fail 0. US-0071 L713–L722 `[PASS]`. Triad L725–L726 `[PASS]`.
  3. `python scripts/validate_readme_feature_coverage.py --repo . --enforce` → exit 0, `coverage_missing=[]`. US-0153 stays out of `coverage_present` while OPEN.
- `expected_health_signal`: five `test_us0153_*` markers pass and the harness report stays Fail 0.

## Credentials

- `credential_source_refs`: none. This release did not read `.env` and did not use paid credentials.
- `expected_value_source`: not used. A live remote deploy stays `UAT_PROBE_FORBIDDEN`.

## Known Issues

- None blocking. US-0153 stays **OPEN** until `/closure`. AC-1..AC-5 stay unchecked.

## Next

Fresh `/closure` as **curator**. Do not flip US-0153 in this phase.
