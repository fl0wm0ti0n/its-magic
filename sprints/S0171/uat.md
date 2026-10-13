# UAT — Sprint S0171 / US-0151

## Result

**PASS.** Contract behavior on the deterministic local model seam. A live paid-model or network probe is `UAT_PROBE_FORBIDDEN`.

- Contract tests: `node --experimental-strip-types --test --test-name-pattern "test_us0151_" tests/contract/us0151.contract.test.ts` → **6 pass / 0 fail** (37058.5339 ms)
- Harness: `tests/report.md` timestamp **2026-10-11T17:26:25Z**, **Pass 880 / Fail 0**, exit 0
- fresh_context_marker: `qa-US0151-qa-20261011T172729Z-fresh`
- timestamp: 2026-10-11T17:27:29Z
- US-0151 stays OPEN. Backlog AC boxes stay unchecked.

## Steps

| Step | AC | Probe | Result |
|---|---|---|---|
| UAT-1 | AC-1 | CLI, TUI, and daemon use the resolved transport and do not open an isolated memory store | PASS (`test_us0151_cli_tui_daemon_share_resolved_transport`) |
| UAT-2 | AC-2 | Lifecycle commands persist events and return success, gate block, or execution failure | PASS (`test_us0151_lifecycle_persists_success_gate_or_failure`) |
| UAT-3 | AC-3 | Auto, quick, resume, and crash recovery use the existing workflow and host store | PASS (`test_us0151_auto_resume_crash_uses_workflow_and_store`) |
| UAT-4 | AC-4 | Ask and index call admitted intel or fail closed; app and browser fail closed | PASS (`test_us0151_ask_index_app_browser_admit_or_fail_closed`) |
| UAT-5 | AC-5 | Attach and TUI timeline show daemon replay | PASS (`test_us0151_attach_and_tui_replay_daemon_events`) |
| UAT-6 | AC-6 | Entry-function tests cover execute, gate failure, restart/resume, replay, and attach | PASS (`test_us0151_e2e_execute_gate_restart_replay_attach`) |
| convergence_smoke | — | Waived live probes plus the green contract file | PASS |

## Live probes

All six live-runtime classes are `UAT_PROBE_FORBIDDEN`. No paid credentials and no network. The suite uses the deterministic local model seam.
