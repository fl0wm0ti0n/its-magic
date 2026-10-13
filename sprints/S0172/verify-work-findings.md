# Verify-work findings — S0172 / US-0152

- **verdict**: **VERIFY_PASS**
- **phase_id**: verify-work
- **role**: qa
- **story_id**: US-0152
- **sprint_id**: S0172
- **timestamp**: 2026-10-11T19:42:00Z
- **fresh_context_marker**: `qa-US0152-vw-20261011T194200Z-fresh`
- **CROSS_MODEL_REVIEW**: 0 (model_id omitted)
- **blocking findings**: none
- **status guard**: US-0152 remains **OPEN**. Backlog AC-1..AC-6 stay `[ ]`. Closure owns the DONE flip. This child did not write `handoffs/resume_brief.md` and did not edit `.cursor/scratchpad.md` or `docs/engineering/architecture.md`. US-0149, US-0150, and US-0151 were not reopened. US-0153 was not started.

Consumed as provenance only: QA marker `qa-US0152-qa-20261011T192609Z-fresh`; qa-pair `record_key=auto-20261011-us0152-qa-pair|story|(none)|qa|rp-auto-20261011-us0152-qa-pair-curator-20261011T192756Z`; `proof_hash=f79c4b0bcd14eebe4efaf3de0c0213e03b77b4c26e8fa1d93527c3fd36bf86a5`. This context re-ran the six contract markers and the harness. No external site was opened and no paid credentials were used.

## Test plan

1. Read S0172 `qa-findings.md`, `uat.md`, `uat.json`, and `tasks.md`, plus US-0152 AC-1..AC-6.
2. Re-run the six `test_us0152_*` markers in `standalone/tests/contract/us0152.contract.test.ts`. No paid credentials and no `.env`.
3. Re-run `powershell -NoProfile -ExecutionPolicy Bypass -File tests/run-tests.ps1` and record Pass/Fail plus the report timestamp.
4. Treat a live browser against an external site as `UAT_PROBE_FORBIDDEN`. Existing UAT stays PASS.
5. Leave US-0152 OPEN. Do not tick backlog acceptance boxes. Do not edit `.cursor/scratchpad.md` or `docs/engineering/architecture.md`. Do not write `handoffs/resume_brief.md`. Leave the eleven architecture linkage stubs untouched.

## Contract markers

Command: `node --experimental-strip-types --test --test-name-pattern "test_us0152_" tests/contract/us0152.contract.test.ts` (cwd `standalone`).

| Marker | Result |
|---|---|
| `test_us0152_host_owns_app_runtime_and_browser_uat` | PASS (11.55 ms) |
| `test_us0152_production_driver_is_isolated_or_unavailable` | PASS (24.5036 ms) |
| `test_us0152_gates_use_app_health_browser_probe_and_retry` | PASS (4.3663 ms) |
| `test_us0152_incomplete_evidence_blocks_uat` | PASS (8.1484 ms) |
| `test_us0152_app_and_browser_commands_share_services` | PASS (203.748 ms) |
| `test_us0152_e2e_launch_gate_and_failure_fixtures` | PASS (24.962 ms) |

**6 pass / 0 fail.** Duration 1590.3912 ms. Exit code 0.

## AC checklist

| AC | Expectation | Evidence | Result |
|---|---|---|---|
| AC-1 | Runtime composition creates and owns `AppRuntime` and `BrowserUAT`. Workflow and operator routes use them. | `test_us0152_host_owns_app_runtime_and_browser_uat` passed. Tasks T-001 is done. QA evidence: `createRuntimeHost` constructs both services with `PlaywrightIsolatedDriver`, and dispose cleans them up before the store closes. | PASS |
| AC-2 | Production browser mode uses isolated Playwright or fails closed with `BROWSER_UNAVAILABLE`. Fake driver and text placeholders are test-only. | `test_us0152_production_driver_is_isolated_or_unavailable` passed. QA evidence: the host driver rejects with `BROWSER_UNAVAILABLE` when Chromium cannot load, and only `kind: "fake"` writes `screenshot-placeholder`. | PASS |
| AC-3 | App start/health, browser probes, and bounded retry feed execute, QA, UAT, and release. Missing health or exhausted retry fails the gate. | `test_us0152_gates_use_app_health_browser_probe_and_retry` passed. QA evidence: missing health and exhausted browser retry set `uat_pass` false. No new cap key. | PASS |
| AC-4 | Redacted screenshot, trace, console, network, final URL, and app-runtime evidence are required. A text placeholder is not evidence. | `test_us0152_incomplete_evidence_blocks_uat` passed. QA evidence: a placeholder screenshot throws `BROWSER_EVIDENCE_GAP` and the release gate returns `RELEASE_UAT_FAILED`. | PASS |
| AC-5 | `itsm app` and `itsm browser` call the host services and return existing unavailable, authorization, and cleanup codes. They do not return `{ok:true}` when the service did not run. | `test_us0152_app_and_browser_commands_share_services` passed. QA evidence: those calls returned the existing unavailable, start, cleanup, and authorization codes, with no `ok` field. | PASS |
| AC-6 | Fixtures prove local launch through gate success, plus crash, failed assertion, authorization refusal, and evidence-gap failure. | `test_us0152_e2e_launch_gate_and_failure_fixtures` passed. QA evidence: a local `127.0.0.1` fixture reached `uat_pass` true, and the four failure paths set `uat_pass` false. The success path does not use `FakeBrowserDriver` or `screenshot-placeholder`. | PASS |

## Harness

- Command: `powershell -NoProfile -ExecutionPolicy Bypass -File tests/run-tests.ps1`
- Exit code: **0**
- `tests/report.md` timestamp **2026-10-11T19:38:28Z**
- **Pass 880 / Fail 0**
- Architecture linkage row `check_intake_template_parity --scope=arch-linkage passes (US-0129)`: **PASS**. `US-0129 contract tests pass`: **PASS**. The eleven architecture linkage stubs at the bottom of `docs/engineering/architecture.md` were not edited.
- Triad rows `triad check passes on repo` and `triad check idempotent rerun passes`: **PASS** (this report is the pre-checkpoint repo)

## UAT

A live browser against an external site stays `UAT_PROBE_FORBIDDEN`. This phase did not open an external site and did not use paid credentials. Existing UAT result remains **PASS** (`sprints/S0172/uat.md`, `sprints/S0172/uat.json`). Those files still cite the QA harness timestamp `2026-10-11T19:25:11Z`. This verify-work harness is Pass 880 / Fail 0 at `2026-10-11T19:38:28Z`.

## Guards held

- US-0152 stays OPEN. AC boxes stay unchecked.
- US-0149, US-0150, and US-0151 were not reopened. US-0153 was not started.
- No `.env` read, no commit, no push, no publish, no `/auto`, no subagent spawn.
- `.cursor/scratchpad.md` was not edited. `docs/engineering/architecture.md` was not edited. `handoffs/resume_brief.md` was not written.

## Triad

- Pre-rollover `docs/engineering/state.md` was **1197** lines, under the inclusive 1200 cap. The verify-work checkpoint would have crossed that cap, so the single oldest checkpoint was archived before the append.
- Archived heading: `## QA checkpoint - BUG-0033 / S0168 / auto-20261010-bug0033-qa2 (role=qa) -- **QA_PASS** (re-QA after gatefix4 B-1 remediation: full 12/12 battery; harness Fail=0 exit gate MET; BUG-0033 remains OPEN)` (12 lines) to `docs/engineering/state-archive/state-pack-20261011-v.md`. Checkpoints left in place include this verify-work checkpoint, the US-0152 qa-pair checkpoint, the US-0152 execute-pair checkpoint, the US-0152 plan checkpoint, the US-0152 discovery checkpoint, the US-0151 closure checkpoint, and the BUG-0033 refresh checkpoint. `docs/engineering/architecture.md` was not rolled.
- Post-append the hot file is **1200** lines. `python scripts/enforce-triad-hot-surface.py --repo . --check` exit **0**.

## Next

Fresh `/release` for US-0152 / S0172. This verify-work child does not spawn it. US-0152 stays OPEN.
