# UAT — Sprint S0174 / US-0154

## Result

**PASS.** Contract fixtures cover the public `itsm` bin, operator-path E2E, fake-evidence rejection, fail-closed seam reports, and the library-slice acceptance note. A live external deploy or paid model call is `UAT_PROBE_FORBIDDEN`.

- Contract tests: `node --experimental-strip-types --test --test-name-pattern "test_us0154_" tests/contract/us0154.contract.test.ts` → **5 pass / 0 fail** (12338.3508 ms)
- Harness: `tests/report.md` timestamp **2026-10-12T18:13:21Z**, **Pass 880 / Fail 0**, exit 0
- fresh_context_marker: `qa-US0154-qa-20261012T181402Z-fresh`
- timestamp: 2026-10-12T18:14:02Z
- US-0154 stays OPEN. Backlog AC boxes stay unchecked.

## Steps

| Step | AC | Probe | Result |
|---|---|---|---|
| UAT-1 | AC-1 | Standalone CI typecheck, lint, and tests sit beside the kit, with Node `22.19.0` and `npm ci` | PASS (workflow `standalone-test` and runbook pin) |
| UAT-2 | AC-2 | A spawned public `itsm` bin reaches production composition | PASS (`test_us0154_public_itsm_reaches_production_composition`) |
| UAT-3 | AC-3 | Operator-path E2E covers session admission, policy, validator failure, restart/resume, daemon replay, and CLI/TUI parity | PASS (`test_us0154_operator_e2e_session_policy_validator_resume_replay_parity`) |
| UAT-4 | AC-4 | Fake drivers, placeholder screenshots, synthetic target success, and no-op responses do not pass production acceptance | PASS (`test_us0154_production_rejects_fake_browser_and_synthetic_release`) |
| UAT-5 | AC-5 | Reports separate unit seams from operator-path evidence and fail closed | PASS (`test_us0154_report_separates_seams_and_fails_closed`) |
| UAT-6 | AC-6 | Acceptance docs record library slices versus the production follow-up, and phase-9 deferrals are not missing v1 work | PASS (`test_us0154_acceptance_records_library_slices_and_production_followup`) |
| convergence_smoke | — | Waived live external deploy and paid model call plus the green contract file | PASS |

## Live probes

A live external deploy or paid model call is `UAT_PROBE_FORBIDDEN`. No paid credentials and no `.env`. The six live-runtime probe classes stay waived. The suite uses local fixtures only.
