# Sprint S0175 — Task checklist (US-0155)

Six planned tasks: **T-anch + T-001..T-005**, within `SPRINT_MAX_TASKS=12`.
Execute only in this order. Every box stays open until a fresh `/execute` dev context finishes it.

## Checklist

- [x] **T-anch — locked baseline (all AC):** Read R-0165 and `# US-0155`. Confirm US-0155 is OPEN, AC-1..AC-5 are unchecked, and S0174 is historical. Confirm US-0149 through US-0154 stay DONE and US-0146 is not rewritten. Confirm `buildTuiModel` attaches as an observer, waits 200ms, and prints once, and that `panels.ts` still exports only phase, status, timeline, and tools. Do not mutate product code in this task.
  **Done-when:** the notes match those gaps and the story is still OPEN.
  **Confirmed:** US-0155 is OPEN and AC-1..AC-5 are unchecked. S0174 is historical. US-0149 through US-0154 are DONE. US-0156 is DONE. US-0146 is DONE and was not rewritten. `buildTuiModel` attaches as `observer`, waits 200ms, and prints once. `panels.ts` still exports only phase, status, timeline, and tools.

- [x] **T-001 — interactive client, not a second runtime (AC-1):** Add `runInteractiveTui` in `standalone/apps/tui` using Node readline and the existing ANSI renderer. It must call `resolveOperatorTransport` and must not construct `WorkflowEngine`, a second runs store, or import `@earendil-works/pi-coding-agent`, `pi-ai`, or `pi-tui`. Leave `buildTuiModel` as the one-shot observer used by the US-0151 test. Mirror the touched files under `template/.its-magic/standalone/apps/tui`. Add `test_us0155_tui_is_daemon_client_not_a_second_runtime`.
  **Done-when:** the marker fails if the TUI imports a Pi session or a workflow engine, and passes when the interactive entry is only a transport client.

- [x] **T-002 — shared command path (AC-2):** On the interactive path, submit admitted argv through `submitCommand`, keep `subscribeEvents` open, and show `execution_failure` and `gate_block` reason codes. Approve via `respondApproval` after attach as `controller`. Cancel via `cancel`. Resume via argv `["resume"]`. Pause via argv `["pause"]` mapped in the existing executor onto the workflow stop that returns `pause_request` / `AUTO_PAUSE_REQUEST`, so the CLI uses the same argv. Do not add an RPC method and do not change `DAEMON_RPC_METHODS`. Add `test_us0155_commands_stream_diagnostics_approve_cancel_pause_resume`.
  **Done-when:** one daemon run shows a streamed event, a failure reason code, an approval, a cancel, a pause disposition, and a resume disposition.

- [x] **T-003 — bounded panels (AC-3):** Add `interactive-panels.ts` that composes `renderPanelLayout` and renders conversation, changed files, app/log health, browser evidence, and model/token/cost. Do not change the `TuiPanelId` union or `TUI_COLLAPSE_ORDER` in `panels.ts`. Cap visible text at `OPERATOR_LOG_MAX_LINES` (200) and `OPERATOR_LOG_MAX_BYTES` (32 KiB) with an evidence footer when truncated. At `cols <= 40`, `selectVisiblePanels` still returns only phase and status. Add `test_us0155_bounded_panels_cover_operator_surfaces`.
  **Done-when:** each required panel renders from runtime data, a large stream truncates, and the US-0146 narrow layout still returns phase and status.

- [x] **T-004 — keyboard, resize, redaction, reconnect, fallback (AC-4):** Bind keys for submit, approve, deny, cancel, pause, and resume. Re-render on resize. Pass every painted payload through `redactEventPayload`. Reconnect with `after_seq` and re-attach when `EVENT_SEQ_GAP` is reported. When stdin is not a TTY, or `ITS_MAGIC_TUI_NONINTERACTIVE=1`, print one layout and exit; an approval in that mode returns `OPERATOR_INPUT_REQUIRED`. Cover Windows and Linux. Add `test_us0155_keyboard_resize_redaction_reconnect_fallback`.
  **Done-when:** a secret-shaped token is absent from painted output, a reconnect replays from the last sequence, and the non-interactive path exits without waiting for a key.

- [x] **T-005 — daemon protocol proof (AC-5):** Add `test_us0155_daemon_protocol_without_external_pi_session` in `standalone/tests/contract/us0155.contract.test.ts`. The test starts the real daemon and asserts event ordering, approval and cancel, reconnect, redaction, and the responsive panel sets. The test must not create a Pi session outside runtime admission. No paid model. No `.env`.
  **Done-when:** the marker passes against the daemon protocol and fails if the TUI or the test imports a Pi coding-agent session.

## Execute boundary

US-0155 stays OPEN. AC boxes stay unchecked. Closure owns the DONE flip. Do not rewrite US-0146. Do not add a README coverage row.
