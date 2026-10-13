# UAT — Sprint S0175 / US-0155

## Result

**PASS.** Contract fixtures cover the interactive daemon client, streamed commands and dispositions, bounded panels, redaction and reconnect, and the daemon protocol. A live external terminal or paid model call is `UAT_PROBE_FORBIDDEN`.

- Contract tests: `node --experimental-strip-types --test --test-name-pattern "test_us0155_" tests/contract/us0155.contract.test.ts` → **5 pass / 0 fail** (3342.1246 ms)
- Harness: `tests/report.md` timestamp **2026-10-12T20:00:16Z**, **Pass 880 / Fail 0**, exit 0
- fresh_context_marker: `qa-US0155-qa-20261012T200043Z-fresh`
- timestamp: 2026-10-12T20:00:43Z
- US-0155 stays OPEN. Backlog AC boxes stay unchecked.

## Steps

| Step | AC | Probe | Result |
|---|---|---|---|
| UAT-1 | AC-1 | TUI is an interactive daemon client and not a second runtime | PASS (`test_us0155_tui_is_daemon_client_not_a_second_runtime`) |
| UAT-2 | AC-2 | Commands, streaming events, diagnostics, approve, cancel, pause, and resume use the admitted runtime | PASS (`test_us0155_commands_stream_diagnostics_approve_cancel_pause_resume`) |
| UAT-3 | AC-3 | Bounded panels cover the operator surfaces and the US-0146 narrow layout stays phase and status | PASS (`test_us0155_bounded_panels_cover_operator_surfaces`) |
| UAT-4 | AC-4 | Keyboard, resize, redaction, reconnect, and non-interactive fallback | PASS (`test_us0155_keyboard_resize_redaction_reconnect_fallback`) |
| UAT-5 | AC-5 | Real daemon protocol without a Pi session outside runtime admission | PASS (`test_us0155_daemon_protocol_without_external_pi_session`) |
| convergence_smoke | — | Waived live external terminal and paid model call plus the green contract file | PASS |

## Live probes

A live external terminal or paid model call is `UAT_PROBE_FORBIDDEN`. No paid credentials and no `.env`. The six live-runtime probe classes stay waived. The suite uses local fixtures only.
