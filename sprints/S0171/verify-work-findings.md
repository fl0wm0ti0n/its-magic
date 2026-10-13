# Verify-work findings — S0171 / US-0151

- **verdict**: **VERIFY_PASS**
- **phase_id**: verify-work
- **role**: qa
- **story_id**: US-0151
- **sprint_id**: S0171
- **timestamp**: 2026-10-11T17:46:10Z
- **fresh_context_marker**: `qa-US0151-vw-20261011T174610Z-fresh`
- **CROSS_MODEL_REVIEW**: 0 (model_id omitted)
- **blocking findings**: none
- **status guard**: US-0151 remains **OPEN**. Backlog AC-1..AC-6 stay `[ ]`. Closure owns the DONE flip. This child did not write `handoffs/resume_brief.md` and did not edit `.cursor/scratchpad.md` or `docs/engineering/architecture.md`. US-0149 and US-0150 were not reopened. US-0152 was not started.

Consumed as provenance only: QA marker `qa-US0151-qa-20261011T172729Z-fresh`; qa-pair `record_key=auto-20261011-us0151-qa-pair|story|(none)|qa|rp-auto-20261011-us0151-qa-pair-curator-20261011T173338Z`; `proof_hash=0396b9f9026130e2d4f7884102f69f2d36634b8d04e9c08301d7d9c24443057d`. This context re-ran the six contract markers and the harness. No paid model was called.

## Test plan

1. Read S0171 `qa-findings.md`, `uat.md`, `uat.json`, and `tasks.md`, plus US-0151 AC-1..AC-6.
2. Re-run the six `test_us0151_*` markers in `standalone/tests/contract/us0151.contract.test.ts` on the deterministic local model seam. No paid credentials and no network.
3. Re-run `powershell -NoProfile -ExecutionPolicy Bypass -File tests/run-tests.ps1` and record Pass/Fail plus the report timestamp.
4. Treat a live paid-model or network probe as `UAT_PROBE_FORBIDDEN`. Existing UAT stays PASS.
5. Leave US-0151 OPEN. Do not tick backlog acceptance boxes. Do not edit `.cursor/scratchpad.md` or `docs/engineering/architecture.md`. Do not write `handoffs/resume_brief.md`.

## Contract markers

Command: `node --experimental-strip-types --test --test-name-pattern "test_us0151_" tests/contract/us0151.contract.test.ts` (cwd `standalone`).

| Marker | Result |
|---|---|
| `test_us0151_cli_tui_daemon_share_resolved_transport` | PASS (309.6556 ms) |
| `test_us0151_lifecycle_persists_success_gate_or_failure` | PASS (75.1359 ms) |
| `test_us0151_auto_resume_crash_uses_workflow_and_store` | PASS (88.3388 ms) |
| `test_us0151_ask_index_app_browser_admit_or_fail_closed` | PASS (610.6123 ms) |
| `test_us0151_attach_and_tui_replay_daemon_events` | PASS (279.0581 ms) |
| `test_us0151_e2e_execute_gate_restart_replay_attach` | PASS (345.1113 ms) |

**6 pass / 0 fail.** Duration 3213.0577 ms. Exit code 0.

## AC checklist

| AC | Expectation | Evidence | Result |
|---|---|---|---|
| AC-1 | CLI, TUI, and daemon use the resolved operator transport. No entrypoint discards it for an isolated in-memory facade or store. | `test_us0151_cli_tui_daemon_share_resolved_transport` passed. CLI keeps `resolveOperatorTransport` and `transport.submitCommand`. CLI and TUI do not call `createRunsStore(":memory:")`. A daemon `status` submit is audited and the TUI timeline carries `daemon-event:` refs. | PASS |
| AC-2 | Lifecycle commands persist run and event state and return success, gate block, or execution failure. A rendered plan or route-only `{ok:true}` is not success. | `test_us0151_lifecycle_persists_success_gate_or_failure` passed. `execute` persisted `success`. `auto` with `AUTO_PAUSE_REQUEST=1` persisted `gate_block`. An unknown command persisted `execution_failure` and returned exit 1. Those bodies have no `ok` and no `plan`. | PASS |
| AC-3 | Auto, quick, resume, and crash recovery use the existing workflow and one engine, with persisted state across a restart. | `test_us0151_auto_resume_crash_uses_workflow_and_store` passed. Daemon source calls `createWorkflowEngine` once. Engine count does not rise across `status` and `execute`. `resume` after a new daemon on the same store path returns `success` and the prior audit rows remain. | PASS |
| AC-4 | Ask and index use admitted intel or an existing unavailable code. App and browser fail closed. | `test_us0151_ask_index_app_browser_admit_or_fail_closed` passed. Admitted intel: `ask` and `index` return `success` with hits. Unavailable index: both return `execution_failure` with `INTEL_INDEX_UNAVAILABLE` or `INDEX_UNAVAILABLE`. `app` returns `APP_HEALTH_UNAVAILABLE`. `browser` returns `BROWSER_UNAVAILABLE`. The executor source has no `AppRuntime` and no browser driver. | PASS |
| AC-5 | Attach and the TUI timeline show daemon-owned replay. Panel ids stay unchanged. | `test_us0151_attach_and_tui_replay_daemon_events` passed. Protocol version is 1. Panel ids and collapse order stay `phase`, `status`, `timeline`, `tools`. Without a daemon, the outcome is `DAEMON_UNREACHABLE`. With a daemon, the timeline replays `success` and `daemon-event:command.submitted`. | PASS |
| AC-6 | End-to-end coverage runs execute, a gate failure, restart/resume, replay, and CLI/TUI attach. | `test_us0151_e2e_execute_gate_restart_replay_attach` passed: `execute` success, `quick` gate block, same engine count, audit survives restart, `resume` success, and the TUI replays both `success` and `gate_block`. | PASS |

## Harness

- Command: `powershell -NoProfile -ExecutionPolicy Bypass -File tests/run-tests.ps1`
- Exit code: **0**
- `tests/report.md` timestamp **2026-10-11T17:44:57Z**
- **Pass 880 / Fail 0**
- Seven linkage rows, all **PASS**: `slim auto command contract markers pass`; `US-0090 caveman-compress contract subtests pass`; `readme_feature_coverage fixtures pass`; `BUG-0010 contract subtests pass`; `BUG-0009 contract subtests pass`; `US-0093 contract subtests pass`; `US-0100 contract subtests pass`
- Triad rows `triad check passes on repo` and `triad check idempotent rerun passes`: **PASS** (this report is the pre-checkpoint repo)

## UAT

A live paid-model or network probe stays `UAT_PROBE_FORBIDDEN`. This phase did not call a paid model and did not use the network. Existing UAT result remains **PASS** (`sprints/S0171/uat.md`, `sprints/S0171/uat.json`). Those files still cite the QA harness timestamp `2026-10-11T17:26:25Z`. This verify-work harness is Pass 880 / Fail 0 at `2026-10-11T17:44:57Z`.

## Guards held

- US-0151 stays OPEN. AC boxes stay unchecked.
- US-0149 and US-0150 were not reopened. US-0152 was not started.
- No `.env` read, no commit, no push, no publish, no `/auto`, no subagent spawn.
- `.cursor/scratchpad.md` was not edited. `docs/engineering/architecture.md` was not edited. `handoffs/resume_brief.md` was not written.

## Triad

- Pre-rollover `docs/engineering/state.md` was **1197** lines, under the inclusive 1200 cap. The verify-work checkpoint would have crossed that cap, so the single oldest checkpoint was archived before the append.
- Archived heading: `## Verify-work checkpoint — BUG-0034 / S0167 / auto-20261006-bug0034-verify-work (role=qa)` (13 lines). Checkpoints left in place include this verify-work checkpoint, the US-0151 qa-pair checkpoint, the US-0151 execute-pair checkpoint, the US-0151 plan checkpoint, the US-0151 discovery checkpoint, the US-0150 closure checkpoint, and the BUG-0033 refresh checkpoint. `docs/engineering/architecture.md` was not rolled.
- Post-append the hot file is **1199** lines. `python scripts/enforce-triad-hot-surface.py --repo . --check` exit **0**.

## Next

Fresh `/release` for US-0151 / S0171. This verify-work child does not spawn it. US-0151 stays OPEN.
