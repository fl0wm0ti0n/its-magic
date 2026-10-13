# Sprint S0172 — Task checklist (US-0152)

Seven planned tasks: **T-anch + T-001..T-006**, within `SPRINT_MAX_TASKS=12`.
Execute only in this order. Every box stays open until a fresh `/execute` dev context finishes it.

## Checklist

- [x] **T-anch — locked baseline (all AC):** Read R-0162 and `# US-0152`. Confirm US-0152 is OPEN, AC-1..AC-6 are unchecked, and S0171 is historical. Confirm US-0141, US-0142, US-0149, US-0150, and US-0151 stay DONE. Confirm `createRuntimeHost` does not own `AppRuntime` or `BrowserUAT`, `app` returns `APP_HEALTH_UNAVAILABLE`, `browser` returns `BROWSER_UNAVAILABLE`, and `writeShot` writes `screenshot-placeholder`. Do not mutate product code in this task.
  **Done-when:** the notes match those gaps and the story is still OPEN.

- [x] **T-001 — host owns both services (AC-1):** In `standalone/packages/runtime-host/src/index.ts`, construct `createAppRuntime` and `createBrowserUat` on the host. Pass `new PlaywrightIsolatedDriver()` into the browser. `dispose` runs app cleanup and `BrowserUAT.teardown` before the store closes. Workflow and operator routes receive those same objects. Mirror the template twin.
  **Done-when:** a production host exposes both services, and dispose cleans them up.

- [x] **T-002 — Playwright or unavailable (AC-2):** Production browser mode uses `PlaywrightIsolatedDriver` and returns existing `BROWSER_UNAVAILABLE` when Chromium cannot load. Leave the `BrowserUAT` class default of `FakeBrowserDriver` for tests that omit a driver. Change `writeShot` so a non-fake driver writes image bytes and only `kind: "fake"` writes `screenshot-placeholder`. Mirror template twins.
  **Done-when:** the operator path cannot select the fake driver, and a text placeholder is not a production screenshot.

- [x] **T-003 — gates use health, probes, and retry (AC-3):** Before `WorkflowEngine.evaluateRelease`, set `ReleaseGateInput` from app start/health, a browser probe, and bounded retry. Keep `GateEngine` order. Use the existing app restart cap and `BrowserUAT.withRetry`. Do not add a cap key. A missing health result or an exhausted retry fails the gate. Mirror template twins.
  **Done-when:** execute, QA, UAT, and release read those results from repository evidence, and `uat_pass` is false when the evidence is missing.

- [x] **T-004 — redacted evidence blocks gaps (AC-4):** Persist a redacted screenshot, trace ref, console summary, network summary, final URL, and `app_runtime_ref` through existing `writeEvidence` and `redactEvidencePayload`. `assertEvidenceComplete` blocks a passing row that lacks any of them (`BROWSER_EVIDENCE_GAP`, then `RELEASE_UAT_FAILED`). Do not count `screenshot-placeholder` as evidence. Mirror template twins.
  **Done-when:** a complete probe writes those fields redacted, and an incomplete probe cannot pass UAT.

- [x] **T-005 — app and browser commands (AC-5):** Replace the hardcoded `app` and `browser` failures in `executeOperatorCommand` with calls to the host services. Return existing unavailable, authorization, and cleanup codes (`APP_HEALTH_UNAVAILABLE`, `APP_RUNTIME_START_FAILED`, `APP_RUNTIME_HEALTH_FAILED`, `APP_RUNTIME_CLEANUP_FAILED`, `BROWSER_UNAVAILABLE`, `BROWSER_CREDENTIAL_FORBIDDEN`, `BROWSER_EVIDENCE_GAP`). Wire `readAppHealth` to the same app service. Do not add reason codes. Do not return `{ok:true}` when the service did not run. Mirror template twins.
  **Done-when:** `itsm app` and `itsm browser` return one of those outcomes from the host services.

- [x] **T-006 — fixture tests (AC-6):** Add `standalone/tests/contract/us0152.contract.test.ts` with `test_us0152_host_owns_app_runtime_and_browser_uat`, `test_us0152_production_driver_is_isolated_or_unavailable`, `test_us0152_gates_use_app_health_browser_probe_and_retry`, `test_us0152_incomplete_evidence_blocks_uat`, `test_us0152_app_and_browser_commands_share_services`, and `test_us0152_e2e_launch_gate_and_failure_fixtures`. Cover local launch through gate success, plus crash, failed assertion, authorization refusal, and evidence-gap failure. The success path must not use `FakeBrowserDriver` or `screenshot-placeholder`. No paid model, no network claim, no `.env`.
  **Done-when:** all six markers pass under the standalone contract runner.

## Execute boundary

US-0152 stays OPEN. AC boxes stay unchecked. Closure owns the DONE flip.
