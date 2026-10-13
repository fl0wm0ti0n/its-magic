# UAT — Sprint S0173 / US-0153

## Result

**PASS.** Contract fixtures cover parallel arbitration, configured release targets, real evidence, and audited limits. A live deploy to a real remote target is `UAT_PROBE_FORBIDDEN`.

- Contract tests: `node --experimental-strip-types --test --test-name-pattern "test_us0153_" tests/contract/us0153.contract.test.ts` → **5 pass / 0 fail** (482.1815 ms)
- Harness: `tests/report.md` timestamp **2026-10-11T21:03:37Z**, **Pass 880 / Fail 0**, exit 0
- fresh_context_marker: `qa-US0153-qa-20261011T210523Z-fresh`
- timestamp: 2026-10-11T21:05:23Z
- US-0153 stays OPEN. Backlog AC boxes stay unchecked.

## Steps

| Step | AC | Probe | Result |
|---|---|---|---|
| UAT-1 | AC-1 | Parallel execute/QA keeps the worktree result and persists the selected or rejected pick | PASS (`test_us0153_arbitration_persists_selected_or_rejected`) |
| UAT-2 | AC-2 | Configured adapter passes; unconfigured target and stub `fake-sha` fail closed | PASS (`test_us0153_configured_adapter_or_fail_closed`) |
| UAT-3 | AC-3 | Smoke, verify, repair, and closure consume real run, UAT, and artifact evidence | PASS (`test_us0153_smoke_verify_repair_closure_use_real_evidence`) |
| UAT-4 | AC-4 | Guard and policy checks are audited before worktree, deploy, and repair | PASS (`test_us0153_limits_audited_before_worktree_deploy_repair`) |
| UAT-5 | AC-5 | Fixture success plus unavailable target, rejected candidate, failed verification, exhausted repair, and premature closure | PASS (`test_us0153_fixture_success_and_failure_matrix`) |
| convergence_smoke | — | Waived live remote deploy plus the green contract file | PASS |

## Live probes

A live deploy to a real remote target is `UAT_PROBE_FORBIDDEN`. No paid credentials and no `.env`. The six live-runtime probe classes stay waived. The suite uses local fixtures only.
