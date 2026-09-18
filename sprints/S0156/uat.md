# UAT — S0156 / US-0148 (verify-work)

- **uat_lifecycle**: populated (`verified_ready=true` after `/verify-work` PASS)
- **sprint_id**: S0156
- **story_id**: US-0148
- **orchestrator_run_id**: auto-20260917-us0148
- **phase_id**: verify-work
- **role**: qa
- **fresh_context_marker**: qa-US0148-verify-20260917T223000Z-fresh
- **timestamp**: 2026-09-17T22:30:00Z
- **story_status**: OPEN (US-0045 — acceptance/backlog ACs unchecked until closure)
- **probe_kind**: contract_tests_primary
- **live_chrome_probed**: false
- **fake_browser_pass_claimed**: false
- **live_git_push_probed**: false
- **live_npm_publish_probed**: false

## UAT steps

| Step | AC | Description | Result |
|------|-----|-------------|--------|
| UAT-1 | AC-1 | Versioned command/event schemas (runtime, approvals, lifecycle, errors) | **pass** |
| UAT-2 | AC-2 | Thin daemon delegates; no duplicate workflow rules | **pass** |
| UAT-3 | AC-3 | CLI/TUI attach, ordered events, approve/cancel, reconnect | **pass** |
| UAT-4 | AC-4 | Local auth, redaction, default-deny remote bind | **pass** |
| UAT-5 | AC-5 | Protocol mismatch / unsupported commands fail closed | **pass** |
| UAT-6 | AC-6 | Restart reconcile + fresh role sessions | **pass** |
| UAT-7 | AC-7 | Ordering, backpressure, concurrency, approval, cancel, crash tests | **pass** |
| UAT-8 | AC-8 | Operator protocol doc + deferred-client boundary | **pass** |
| convergence_smoke | — | Waived-probe slice surrogate (US-0128) | **pass** |

## Waived live-runtime probe classes

All six classes: **`UAT_PROBE_FORBIDDEN`** (`browser_smoke`, `api_health`, `process_health`, `cli_smoke`, `build`, `manual_operator`).

## Contract evidence (qa live)

- Command: `node --experimental-strip-types --test tests/contract/us0148.contract.test.ts` (cwd `standalone/`)
- Result: **14 passed**, fail **0**, duration_ms **1119.9884** (**12/12** locked `test_us0148_*` + US-0146 compose doubles)
- Compose suite: `npm test` **167/167** PASS, duration_ms **3111.3819**
- No live remote network, npm publish, or git push.

## Results summary

- **Total**: 9
- **Passed**: 9
- **Failed**: 0
- **Verdict**: QA_PASS
- **Strict proof**: `rp-auto-20260917-us0148-qa-qa-20260917T222500Z-US-0148` / `BBE54BEC118319917F07862D641170BBC4FD9A17C5858249BF2C93EE3D307D61`
- **Next**: `/verify-work` (fresh qa subagent; BUG-0006)
