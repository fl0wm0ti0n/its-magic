# Summary — Sprint S0172

## Goal

The production host owns `AppRuntime` and `BrowserUAT`, and release gates use real health and browser evidence (R-0162, no new DEC).

## Shipped

`createRuntimeHost` constructs `createAppRuntime` and `createBrowserUat` with `new PlaywrightIsolatedDriver()`. `dispose` cleans the app and the browser before the store closes. Production browser mode returns existing `BROWSER_UNAVAILABLE` when Chromium cannot load. The `BrowserUAT` default stays `FakeBrowserDriver` for tests that omit a driver. `writeShot` writes image bytes for a non-fake driver and `screenshot-placeholder` only for `kind: "fake"`.

Before `WorkflowEngine.evaluateRelease`, `ReleaseGateInput` comes from app start/health, a browser probe, and bounded retry. `GateEngine` order is unchanged. The existing app restart cap and `BrowserUAT.withRetry` are used. Missing health or an exhausted retry fails the gate. `uat_pass` is false when evidence is missing.

A redacted screenshot, trace ref, console summary, network summary, final URL, and `app_runtime_ref` persist through `writeEvidence` and `redactEvidencePayload`. `assertEvidenceComplete` blocks a passing row that lacks any of them (`BROWSER_EVIDENCE_GAP`, then `RELEASE_UAT_FAILED`). `screenshot-placeholder` is not evidence.

`executeOperatorCommand` calls the host app and browser services for `app` and `browser`. Outcomes use the existing codes only. `readAppHealth` reads the same app service. Template twins of the touched files match.

## Tests

Standalone contract runner, six `test_us0152_*` markers, 6 pass / 0 fail (2026-10-11T19:04Z, duration 1628 ms): `test_us0152_host_owns_app_runtime_and_browser_uat`, `test_us0152_production_driver_is_isolated_or_unavailable`, `test_us0152_gates_use_app_health_browser_probe_and_retry`, `test_us0152_incomplete_evidence_blocks_uat`, `test_us0152_app_and_browser_commands_share_services`, `test_us0152_e2e_launch_gate_and_failure_fixtures`.

Harness `tests/report.md` timestamp **2026-10-11T20:09:04Z**, **Pass 880 / Fail 0** (post-closure full harness).

US-0152 **DONE** at closure (`curator-US0152-closure-20261011T200058Z-fresh`). AC-1..AC-6 checked in backlog and acceptance. `sprints/S0172/closure-verification.md` **CLOSURE_PASS**. Refresh-context **REFRESH_CONTEXT_PASS** (`curator-US0152-refresh-20261011T201055Z-fresh`). Next scheduled phase: **discovery** (po, **US-0153**; intake skipped).

Post-closure `validate_readme_feature_coverage.py --report`: `coverage_present` includes **US-0152**; `coverage_missing=[]`; `coverage_total=48`.
