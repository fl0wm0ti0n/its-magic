# QA Findings — S0175 / US-0155

- **verdict**: **QA_PASS**
- **phase_id**: qa
- **role**: qa
- **story_id**: US-0155
- **sprint_id**: S0175
- **timestamp**: 2026-10-12T20:00:43Z
- **fresh_context_marker**: `qa-US0155-qa-20261012T200043Z-fresh`
- **CROSS_MODEL_REVIEW**: 0 (model_id omitted)
- **blocking findings**: none
- **status guard**: US-0155 remains **OPEN**. Backlog AC-1..AC-5 stay `[ ]`. Closure owns the DONE flip. This child did not write `handoffs/resume_brief.md` and did not edit `.cursor/scratchpad.md` or `docs/engineering/architecture.md`. Earlier stories were not reopened.

Consumed as provenance only: execute marker `dev-US0155-execute-20261012T194605Z-fresh`; execute-pair `record_key=auto-20261012-us0155-execute-pair|story|(none)|execute|rp-auto-20261012-us0155-execute-pair-curator-20261012T194955Z`; `proof_hash=37038faf443c38ec5a6a5d5713acdf40968652a8692ad864419367a6c112d63a`. This context re-ran the five contract markers and the harness.

## Test plan

1. Read US-0155 AC-1..AC-5, S0175 tasks, and the top of `handoffs/dev_to_qa.md`.
2. Check that the interactive TUI is a daemon/operator client and does not import a Pi session or a workflow engine; that one daemon run shows a streamed event, a failure reason code, an approval, a cancel, a pause disposition, and a resume disposition; that required panels render and large streams truncate; that a secret-shaped token is absent from painted output; that reconnect replays from the last sequence; that the non-interactive path exits without waiting for a key; and that the daemon-protocol marker does not create a Pi session outside runtime admission. Confirm US-0146 panel collapse still returns only phase and status at `cols <= 40`.
3. Re-run the five `test_us0155_*` markers in `standalone/tests/contract/us0155.contract.test.ts`. No paid credentials and no `.env`.
4. Re-run `powershell -NoProfile -ExecutionPolicy Bypass -File tests/run-tests.ps1` and record Pass/Fail plus the report timestamp.
5. Treat a live external terminal or paid model call as `UAT_PROBE_FORBIDDEN`. Cover behavior with the contract fixtures.
6. Leave US-0155 OPEN. Do not tick backlog acceptance boxes. Do not edit `.cursor/scratchpad.md` or `docs/engineering/architecture.md`. Do not write `handoffs/resume_brief.md`. Leave the eleven architecture linkage stubs untouched.

## Contract markers

Command: `node --experimental-strip-types --test --test-name-pattern "test_us0155_" tests/contract/us0155.contract.test.ts` (cwd `standalone`).

| Marker | Result |
|---|---|
| `test_us0155_tui_is_daemon_client_not_a_second_runtime` | PASS (309.7409 ms) |
| `test_us0155_commands_stream_diagnostics_approve_cancel_pause_resume` | PASS (419.2799 ms) |
| `test_us0155_bounded_panels_cover_operator_surfaces` | PASS (34.2108 ms) |
| `test_us0155_keyboard_resize_redaction_reconnect_fallback` | PASS (729.5424 ms) |
| `test_us0155_daemon_protocol_without_external_pi_session` | PASS (407.1492 ms) |

**5 pass / 0 fail.** Duration 3342.1246 ms. Exit code 0.

## AC checklist

| AC | Expectation | Evidence | Result |
|---|---|---|---|
| AC-1 | The TUI uses compatible interactive primitives while remaining a client of the daemon/operator transport, not a second runtime or workflow engine. | TUI sources define `runInteractiveTui`, call `resolveOperatorTransport`, and use `node:readline` plus `renderPanelLayout`. They do not match `@earendil-works/pi-coding-agent`, `pi-ai`, `pi-tui`, `WorkflowEngine`, or `createRunsStore`. `buildTuiModel` still attaches as `observer` and waits 200ms. A non-TTY run paints `Phase` and does not paint `DAEMON_UNREACHABLE`. | PASS |
| AC-2 | The operator can submit commands, see streaming events and failure diagnostics, and approve, cancel, pause, or resume through the admitted runtime. | Protocol version stays 1 and `DAEMON_RPC_METHODS` is unchanged. One daemon session shows `run.attached` then `command.submitted`, `execution_failure` with `UNKNOWN_COMMAND`, `gate_block` with `AUTO_PAUSE_REQUEST` and `pause_request`, resume `disposition=success`, then `approval.requested`, `approval.responded`, and `run.cancelled`. CLI argv `["pause"]` returns the same pause reason. | PASS |
| AC-3 | Panels cover conversation, phase/role, timeline, tools, changed files, app/log health, browser evidence, and model/token/cost, with bounded rendering. | A wide layout renders those surfaces from runtime data, including `itsm_read`, `hello operator`, `src/app.ts`, `APP_HEALTH_UNAVAILABLE`, `probes=2`, `fake-local`, and `tokens=12`. Streams past 200 lines or 32 KiB paint `evidence: truncated`. At `cols <= 40`, `selectVisiblePanels` returns only phase and status. `TuiPanelId` and `TUI_COLLAPSE_ORDER` stay the US-0146 four-panel set. | PASS |
| AC-4 | Keyboard, resize, redaction, reconnect, and non-interactive fallback work on Windows and Linux. | Keys map to submit, approve, deny, cancel, pause, and resume, and a keyed session exercises them. Resize to 30 columns drops conversation and a later resize restores phase. Token `sk-abcdefgH123456` is absent and `[redacted]` is present. A sequence hole reconnects with an integer `after_seq`. Non-TTY plus `ITS_MAGIC_TUI_NONINTERACTIVE=1` prints one layout and returns `OPERATOR_INPUT_REQUIRED` when an approval is pending. The marker accepts `win32`, `linux`, and `darwin`. | PASS |
| AC-5 | Integration tests exercise the real daemon protocol without creating a Pi session outside runtime admission. | The marker and the TUI sources do not import `@earendil-works/pi-coding-agent`. The daemon session asserts event order, deny, cancel, pause, resume, redaction, reconnect, and the narrow versus wide panel sets. The host kernel factory is admitted only through `createRuntimeHost`. | PASS |

## Harness

- Command: `powershell -NoProfile -ExecutionPolicy Bypass -File tests/run-tests.ps1`
- Exit code: **0**
- `tests/report.md` timestamp **2026-10-12T20:00:16Z**
- **Pass 880 / Fail 0**
- Architecture linkage row `check_intake_template_parity --scope=arch-linkage passes (US-0129)`: **PASS**. `US-0129 contract tests pass`: **PASS**. The eleven architecture linkage stubs in `docs/engineering/architecture.md` were not edited.
- Triad rows `triad check passes on repo` and `triad check idempotent rerun passes`: **PASS** (this report is the pre-checkpoint repo)

## UAT

A live external terminal or paid model call is `UAT_PROBE_FORBIDDEN`. The contract fixtures cover the daemon client, command stream, bounded panels, redaction and reconnect, and the daemon protocol. No paid credentials and no `.env`. UAT result: **PASS** (`sprints/S0175/uat.md`, `sprints/S0175/uat.json`).

## Guards held

- US-0155 stays OPEN. AC boxes stay unchecked.
- US-0146 panel collapse stays intact. Earlier stories were not reopened.
- No `.env` read, no commit, no push, no publish, no `/auto`, no subagent spawn.
- `.cursor/scratchpad.md` was not edited. `docs/engineering/architecture.md` was not edited. `handoffs/resume_brief.md` was not written.

## Next

Fresh `/verify-work` for US-0155 / S0175. This QA child does not spawn it.
