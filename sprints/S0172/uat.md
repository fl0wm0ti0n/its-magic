# UAT — Sprint S0172 / US-0152

## Result

**PASS.** Contract fixtures cover application health and browser evidence without an external network probe. A live browser against an external site is `UAT_PROBE_FORBIDDEN`.

- Contract tests: `node --experimental-strip-types --test --test-name-pattern "test_us0152_" tests/contract/us0152.contract.test.ts` → **6 pass / 0 fail** (1659.9379 ms)
- Harness: `tests/report.md` timestamp **2026-10-11T19:25:11Z**, **Pass 880 / Fail 0**, exit 0
- fresh_context_marker: `qa-US0152-qa-20261011T192609Z-fresh`
- timestamp: 2026-10-11T19:26:09Z
- US-0152 stays OPEN. Backlog AC boxes stay unchecked.

## Steps

| Step | AC | Probe | Result |
|---|---|---|---|
| UAT-1 | AC-1 | Host owns `AppRuntime` and `BrowserUAT` | PASS (`test_us0152_host_owns_app_runtime_and_browser_uat`) |
| UAT-2 | AC-2 | Production driver is isolated Playwright or `BROWSER_UNAVAILABLE` | PASS (`test_us0152_production_driver_is_isolated_or_unavailable`) |
| UAT-3 | AC-3 | Gates use app health, browser probes, and bounded retry | PASS (`test_us0152_gates_use_app_health_browser_probe_and_retry`) |
| UAT-4 | AC-4 | Incomplete redacted evidence blocks UAT; a text placeholder is not evidence | PASS (`test_us0152_incomplete_evidence_blocks_uat`) |
| UAT-5 | AC-5 | `itsm app` and `itsm browser` share those services | PASS (`test_us0152_app_and_browser_commands_share_services`) |
| UAT-6 | AC-6 | Fixture covers launch-through-gate plus crash, assertion, authorization, and evidence-gap failures | PASS (`test_us0152_e2e_launch_gate_and_failure_fixtures`) |
| convergence_smoke | — | Waived external-browser probe plus the green contract file | PASS |

## Live probes

A live browser against an external site is `UAT_PROBE_FORBIDDEN`. No paid credentials and no `.env`. The suite uses a local `127.0.0.1` server, PNG evidence bytes, and the production fail-closed `BROWSER_UNAVAILABLE` path when Chromium cannot load.
