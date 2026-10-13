# QA Findings — S0171 / US-0151

- **verdict**: **QA_PASS**
- **phase_id**: qa
- **role**: qa
- **story_id**: US-0151
- **sprint_id**: S0171
- **timestamp**: 2026-10-11T17:27:29Z
- **fresh_context_marker**: `qa-US0151-qa-20261011T172729Z-fresh`
- **CROSS_MODEL_REVIEW**: 0 (model_id omitted)
- **blocking findings**: none
- **status guard**: US-0151 remains **OPEN**. Backlog AC-1..AC-6 stay `[ ]`. Closure owns the DONE flip. This child did not write `handoffs/resume_brief.md` and did not edit `.cursor/scratchpad.md` or `docs/engineering/architecture.md`. US-0149 and US-0150 were not reopened. US-0152 was not started.

Consumed as provenance only: execute marker `dev-US0151-execute-20261011T165840Z-fresh`; execute-pair `record_key=auto-20261011-us0151-execute-pair|story|(none)|execute|rp-auto-20261011-us0151-execute-pair-curator-20261011T191502Z`; `proof_hash=2162f5c3338e966c718ca9646123961251b766310657f2f5bfc4a7bbe20ff0fa`. This context re-ran the six contract markers and the harness.

## Test plan

1. Read US-0151 AC-1..AC-6, S0171 tasks, and the top of `handoffs/dev_to_qa.md`.
2. Check that CLI and TUI keep `resolveOperatorTransport` and do not open a production `:memory:` store; lifecycle submit persists `success`, `gate_block`, or `execution_failure`; a rendered plan or route-only `{ok:true}` is not success; one workflow engine exists per daemon process; `ask`/`index` use host intel or an existing unavailable code; `app` returns `APP_HEALTH_UNAVAILABLE`; `browser` returns `BROWSER_UNAVAILABLE`; TUI replays daemon events; panel ids stay unchanged.
3. Re-run the six `test_us0151_*` markers in `standalone/tests/contract/us0151.contract.test.ts` on the deterministic local model seam. No paid credentials and no network.
4. Re-run `powershell -NoProfile -ExecutionPolicy Bypass -File tests/run-tests.ps1` and record Pass/Fail plus the report timestamp. Expect the seven architecture-linkage rows to pass.
5. Treat a live paid-model or network probe as `UAT_PROBE_FORBIDDEN`. Cover behavior with the existing local-model-seam tests.
6. Leave US-0151 OPEN. Do not tick backlog acceptance boxes. Do not edit `.cursor/scratchpad.md` or `docs/engineering/architecture.md`. Do not write `handoffs/resume_brief.md`.

## Contract markers

Command: `node --experimental-strip-types --test --test-name-pattern "test_us0151_" tests/contract/us0151.contract.test.ts` (cwd `standalone`).

| Marker | Result |
|---|---|
| `test_us0151_cli_tui_daemon_share_resolved_transport` | PASS (339.3289 ms) |
| `test_us0151_lifecycle_persists_success_gate_or_failure` | PASS (106.537 ms) |
| `test_us0151_auto_resume_crash_uses_workflow_and_store` | PASS (101.3843 ms) |
| `test_us0151_ask_index_app_browser_admit_or_fail_closed` | PASS (15076.2702 ms) |
| `test_us0151_attach_and_tui_replay_daemon_events` | PASS (279.5544 ms) |
| `test_us0151_e2e_execute_gate_restart_replay_attach` | PASS (340.5543 ms) |

**6 pass / 0 fail.** Duration 37058.5339 ms. Exit code 0.

## AC checklist

| AC | Expectation | Evidence | Result |
|---|---|---|---|
| AC-1 | CLI, TUI, and daemon use the resolved operator transport. No entrypoint discards it for an isolated in-memory facade or store. | `runCliArgv` keeps `const transport = await resolveOperatorTransport` and calls `transport.submitCommand`. `buildTuiModel` keeps the same resolver. Neither file calls `createRunsStore(":memory:")`. The in-process transport submits with `deps.store`. Template twins of the touched files match. | PASS |
| AC-2 | Lifecycle commands persist run and event state and return success, gate block, or execution failure. A rendered plan or route-only `{ok:true}` is not success. | `execute` persisted `success`. `auto` with `AUTO_PAUSE_REQUEST=1` persisted `gate_block`. An unknown command persisted `execution_failure` and returned exit 1. Those bodies have no `ok` and no `plan`. Daemon `command.submit` calls `executeOperatorCommand` and returns that outcome. | PASS |
| AC-3 | Auto, quick, resume, and crash recovery use the existing workflow and one engine, with persisted state across a restart. | `startDaemonServer` calls `createWorkflowEngine` once. `workflowEngineCount()` does not rise across `status` and `execute`. `resume` after a new daemon on the same store path reads the prior audit rows and returns `success`. | PASS |
| AC-4 | Ask and index use admitted intel or an existing unavailable code. App and browser fail closed. | Admitted intel: `ask` and `index` return `success` with hits. Unavailable index: both return `execution_failure` with `INTEL_INDEX_UNAVAILABLE` or `INDEX_UNAVAILABLE`. `app` returns `APP_HEALTH_UNAVAILABLE`. `browser` returns `BROWSER_UNAVAILABLE`. The executor source has no `AppRuntime` and no browser driver. | PASS |
| AC-5 | Attach and the TUI timeline show daemon-owned replay. Panel ids stay unchanged. | With a daemon, timeline entries carry `daemon-event:` refs and are not `DAEMON_UNREACHABLE`. Without a daemon, the outcome is `DAEMON_UNREACHABLE`. Protocol version is 1. Panel ids and collapse order stay `phase`, `status`, `timeline`, `tools`. | PASS |
| AC-6 | End-to-end coverage runs execute, a gate failure, restart/resume, replay, and CLI/TUI attach. | `test_us0151_e2e_execute_gate_restart_replay_attach` passed: `execute` success, `quick` gate block, same engine count, audit survives restart, `resume` success, and the TUI replays both `success` and `gate_block`. | PASS |

## Harness

- Command: `powershell -NoProfile -ExecutionPolicy Bypass -File tests/run-tests.ps1`
- Exit code: **0**
- `tests/report.md` timestamp **2026-10-11T17:26:25Z**
- **Pass 880 / Fail 0**
- Seven linkage rows, all **PASS**: `slim auto command contract markers pass`; `US-0090 caveman-compress contract subtests pass`; `readme_feature_coverage fixtures pass`; `BUG-0010 contract subtests pass`; `BUG-0009 contract subtests pass`; `US-0093 contract subtests pass`; `US-0100 contract subtests pass`
- Triad rows `triad check passes on repo` and `triad check idempotent rerun passes`: **PASS** (this report is the pre-checkpoint repo)

## UAT

A live paid-model or network probe is `UAT_PROBE_FORBIDDEN`. Acceptance behavior is covered by the local-model-seam contract tests above. UAT result: **PASS** (`sprints/S0171/uat.md`, `sprints/S0171/uat.json`).

## Guards held

- US-0151 stays OPEN. AC boxes stay unchecked.
- US-0149 and US-0150 were not reopened. US-0152 was not started.
- No `.env` read, no commit, no push, no publish, no `/auto`, no subagent spawn.
- `.cursor/scratchpad.md` was not edited. `docs/engineering/architecture.md` was not edited. `handoffs/resume_brief.md` was not written.

## Next

Fresh `/verify-work` for US-0151 / S0171. This QA child does not spawn it.
