# Summary — Sprint S0173

## Goal

Parallel arbitration and configured release targets run only when a real service admits them (R-0163, no new DEC). A skipped hook or a stub adapter cannot pass a release.

## Shipped

When `SOVEREIGN_PARALLEL_DEV=1`, `runExecuteQaLoop` keeps `afterExecutePass`. A skipped hook or a `reason_code` fails closed. The loop calls `runQaArbiter` and writes `handoffs/parallel_dev_pick.json` for `winner_selected` and `reject_all`. `reject_all` uses `PARALLEL_DEV_SELECTION_NO_PASS`. When the flag is off, the US-0145 `noopSnapshot` path stays.

Release apply and verify read configured targets (`kind`, `target_id`, `endpoint`) from resolved config. A missing target returns `ok: false` and `RELEASE_TARGET_UNCONFIGURED`, and the gate sets `deploy_targets_pass: false`. `artifact_sha: "fake-sha"` cannot set `deploy_targets_pass` true. `getReleaseTargetAdapter` dry-run success stays for the US-0145 matrix. `RELEASE_GATE_ORDER` is unchanged.

The release phase no longer passes hardcoded booleans or `sprints/S0151/summary.md`. It reads the current run, UAT evidence, and artifact refs. `verify` cites a real artifact ref. Smoke uses `deploy_smoke_probe`. Repair uses `deploy_healing_retry`. Disabled healing is not a deploy pass. Exhausted repair stays `DEPLOY_DEFERRED` or `DEPLOY_HEALING_DEFERRED`. Premature closure stays `RELEASE_PREMATURE` and `CLOSURE_RELEASE_EVIDENCE_MISSING`. `releaseCannotMarkDone` stays.

`DeliveryResourceGuard.check` and the existing path policy run before worktree create, deploy, and repair. A denied path uses `POLICY_TRAVERSAL_DENIED` or `POLICY_DEFAULT_DENY`. Each check appends one audit line to `handoffs/deploy_results/deploy_results.jsonl`. No new cap key. No distributed workers and no remote Debian execution.

Template twins of the touched runtime-core files match.

## Tests

Standalone contract runner, five `test_us0153_*` markers, 5 pass / 0 fail (2026-10-11T20:50:22Z, duration_ms 363.226): `test_us0153_arbitration_persists_selected_or_rejected`, `test_us0153_configured_adapter_or_fail_closed`, `test_us0153_smoke_verify_repair_closure_use_real_evidence`, `test_us0153_limits_audited_before_worktree_deploy_repair`, `test_us0153_fixture_success_and_failure_matrix`.

Harness `tests/report.md` timestamp **2026-10-11T20:49:43Z**, **Pass 880 / Fail 0**, exit 0.

## Status

**REFRESH_CONTEXT_PASS** (`curator-US0153-refresh-20261011T214935Z-fresh`). US-0153 **DONE**; AC-1..AC-5 checked; acceptance row ticked. Post-flip README coverage `coverage_missing=[]`, `coverage_total=49`. Harness `tests/report.md` **2026-10-11T21:47:41Z** Pass **880** / Fail **0**. Drain head **US-0154** (intake skipped — shared intake evidence). Next: `/discovery` (po). US-0154 not started.
