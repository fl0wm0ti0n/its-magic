# QA Findings — S0172 / US-0152

- **verdict**: **QA_PASS**
- **phase_id**: qa
- **role**: qa
- **story_id**: US-0152
- **sprint_id**: S0172
- **timestamp**: 2026-10-11T19:26:09Z
- **fresh_context_marker**: `qa-US0152-qa-20261011T192609Z-fresh`
- **CROSS_MODEL_REVIEW**: 0 (model_id omitted)
- **blocking findings**: none
- **status guard**: US-0152 remains **OPEN**. Backlog AC-1..AC-6 stay `[ ]`. Closure owns the DONE flip. This child did not write `handoffs/resume_brief.md` and did not edit `.cursor/scratchpad.md` or `docs/engineering/architecture.md`. US-0149, US-0150, and US-0151 were not reopened. US-0153 was not started.

Consumed as provenance only: execute marker `dev-US0152-execute-20261011T191205Z-fresh`; execute-pair `record_key=auto-20261011-us0152-execute-pair|story|(none)|execute|rp-auto-20261011-us0152-execute-pair-curator-20261011T191408Z`; `proof_hash=82bb742649fefb5ae5ef3332a594dad1ec611aaa7f5724872be7d3ec3f414219`. This context re-ran the six contract markers and the harness.

## Test plan

1. Read US-0152 AC-1..AC-6, S0172 tasks, and the top of `handoffs/dev_to_qa.md`.
2. Check that the production host owns `AppRuntime` and `BrowserUAT` with `PlaywrightIsolatedDriver`; that `FakeBrowserDriver` and `screenshot-placeholder` stay test-only; that gates fail when health or evidence is missing; and that `itsm app` and `itsm browser` call the host services and do not return `{ok:true}` when the service did not run.
3. Re-run the six `test_us0152_*` markers in `standalone/tests/contract/us0152.contract.test.ts`. No paid credentials and no `.env`.
4. Re-run `powershell -NoProfile -ExecutionPolicy Bypass -File tests/run-tests.ps1` and record Pass/Fail plus the report timestamp.
5. Treat a live browser against an external site as `UAT_PROBE_FORBIDDEN`. Cover behavior with the contract fixtures, which use a local loopback server and image bytes and do not claim an external network probe.
6. Leave US-0152 OPEN. Do not tick backlog acceptance boxes. Do not edit `.cursor/scratchpad.md` or `docs/engineering/architecture.md`. Do not write `handoffs/resume_brief.md`. Leave the architecture linkage stubs untouched.

## Contract markers

Command: `node --experimental-strip-types --test --test-name-pattern "test_us0152_" tests/contract/us0152.contract.test.ts` (cwd `standalone`).

| Marker | Result |
|---|---|
| `test_us0152_host_owns_app_runtime_and_browser_uat` | PASS (12.6989 ms) |
| `test_us0152_production_driver_is_isolated_or_unavailable` | PASS (25.6598 ms) |
| `test_us0152_gates_use_app_health_browser_probe_and_retry` | PASS (4.0104 ms) |
| `test_us0152_incomplete_evidence_blocks_uat` | PASS (6.5837 ms) |
| `test_us0152_app_and_browser_commands_share_services` | PASS (213.5348 ms) |
| `test_us0152_e2e_launch_gate_and_failure_fixtures` | PASS (27.6046 ms) |

**6 pass / 0 fail.** Duration 1659.9379 ms. Exit code 0.

## AC checklist

| AC | Expectation | Evidence | Result |
|---|---|---|---|
| AC-1 | Runtime composition creates and owns `AppRuntime` and `BrowserUAT`. Workflow and operator routes use them. | `createRuntimeHost` constructs `createAppRuntime` and `createBrowserUat` with `new PlaywrightIsolatedDriver()`. `dispose` runs app cleanup, then browser teardown, then store close. CLI passes `host.app` and `host.browser`. Daemon passes the same objects as services. The host instance's driver is `PlaywrightIsolatedDriver`. | PASS |
| AC-2 | Production browser mode uses isolated Playwright or fails closed with `BROWSER_UNAVAILABLE`. Fake driver and text placeholders are test-only. | Host source does not reference `FakeBrowserDriver`. A host driver `launch()` rejects with `BROWSER_UNAVAILABLE`. A `BrowserUAT` constructed without a driver stays `FakeBrowserDriver` and writes `screenshot-placeholder`. A non-fake driver writes PNG bytes. | PASS |
| AC-3 | App start/health, browser probes, and bounded retry feed execute, QA, UAT, and release. Missing health or exhausted retry fails the gate. | `prepareReleaseGate` runs before `evaluateRelease`. Gate order is unchanged. Missing health uses the existing restart cap and sets `uat_pass` false (`RELEASE_UAT_FAILED`). An exhausted browser retry sets `uat_pass` false. No new cap key. | PASS |
| AC-4 | Redacted screenshot, trace, console, network, final URL, and app-runtime evidence are required. A text placeholder is not evidence. | `writeEvidence` redacts a bearer secret to `[redacted]`. `assertEvidenceComplete` throws `BROWSER_EVIDENCE_GAP` when the screenshot is `screenshot-placeholder`. A passing row that lacks evidence fails the release gate with `RELEASE_UAT_FAILED`. | PASS |
| AC-5 | `itsm app` and `itsm browser` call the host services and return existing unavailable, authorization, and cleanup codes. They do not return `{ok:true}` when the service did not run. | CLI health, app, browser, start, cleanup, and unapproved account calls returned `APP_HEALTH_UNAVAILABLE`, `BROWSER_UNAVAILABLE`, `APP_RUNTIME_START_FAILED`, `APP_RUNTIME_CLEANUP_FAILED`, and `BROWSER_CREDENTIAL_FORBIDDEN`. Those bodies have no `ok` field. `readHostAppHealth` reads the host app. | PASS |
| AC-6 | Fixtures prove local launch through gate success, plus crash, failed assertion, authorization refusal, and evidence-gap failure. | A local `127.0.0.1` server and a non-fake byte driver produced a PNG shot and `uat_pass` true. Crash, assertion failure, authorization refusal, and a placeholder evidence gap each set `uat_pass` false. The gap path returns `RELEASE_UAT_FAILED`. The success path does not use `FakeBrowserDriver` or `screenshot-placeholder`. | PASS |

## Harness

- Command: `powershell -NoProfile -ExecutionPolicy Bypass -File tests/run-tests.ps1`
- Exit code: **0**
- `tests/report.md` timestamp **2026-10-11T19:25:11Z**
- **Pass 880 / Fail 0**
- Architecture linkage row `check_intake_template_parity --scope=arch-linkage passes (US-0129)`: **PASS**. `US-0129 contract tests pass`: **PASS**. The eleven architecture linkage stubs at the bottom of `docs/engineering/architecture.md` were not edited.
- Triad rows `triad check passes on repo` and `triad check idempotent rerun passes`: **PASS** (this report is the pre-checkpoint repo)

## UAT

A live browser against an external site is `UAT_PROBE_FORBIDDEN`. The contract fixtures cover launch, evidence, and the failure cases on a local loopback server without an external network probe and without paid credentials. UAT result: **PASS** (`sprints/S0172/uat.md`, `sprints/S0172/uat.json`).

## Guards held

- US-0152 stays OPEN. AC boxes stay unchecked.
- US-0149, US-0150, and US-0151 were not reopened. US-0153 was not started.
- No `.env` read, no commit, no push, no publish, no `/auto`, no subagent spawn.
- `.cursor/scratchpad.md` was not edited. `docs/engineering/architecture.md` was not edited. `handoffs/resume_brief.md` was not written.

## Next

Fresh `/verify-work` for US-0152 / S0172. This QA child does not spawn it.
