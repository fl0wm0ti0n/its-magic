# Sprint S0156 — Task checklist (US-0148)

Total tasks: 12 (T-anch + T-001..T-011). SPRINT_MAX_TASKS=12; SPRINT_AUTO_SPLIT=1; no split (at cap). T-anch retained as NO-OP verification. Seeds 1:1 from `docs/engineering/architecture.md` `# US-0148`. Sprint id **S0156** locked (S0155 = US-0145 — do not reuse).

**Isolation**: `tl-US0148-sprintplan-20260917T213000Z-fresh` · `model_id=inherit` · `orchestrator_run_id=auto-20260917-us0148`

## Task execution order

1. T-anch (NO-OP / verification)
2. T-001 (`@its-magic/protocol`)
3. T-002 (daemon JSON-RPC loopback + listen/token files)
4. T-003 (per-run SQLite event log + hooks)
5. T-004 (WebSocket `/v1/events` + replay)
6. T-005 (`OperatorTransport` + `DaemonTransport`)
7. T-006 (CLI/TUI daemon attach migration)
8. T-007 (`daemon.hello` + controller/observer roles)
9. T-008 (crashResume + reconcile + orphan cleanup)
10. T-009 (approval routing + cancel + audit fields)
11. T-010 (operator daemon-protocol doc)
12. T-011 (twelve `test_us0148_*`)

## Task checklist

- [x] **T-anch**: Verify `# US-0148` H1 in `docs/engineering/architecture.md`; DEC-0148 Accepted; R-0148 DQ1–DQ10 LOCKED; twelve-marker table locked; path/RPC pins (`standalone/packages/protocol`, `standalone/apps/daemon`, `runtime-core/src/daemon-client/`, `.its-magic/daemon/*`); compose guards (US-0133..US-0147 DONE; US-0145 OUT; US-0146 in-process doubles IN). Record to `sprints/S0156/t-anch-verification.md`. NO mutation to `architecture.md` / `DEC-0148.md` / R-0148 in /execute. (DC / architecture baseline; NO-OP)

- [x] **T-001**: Create `standalone/packages/protocol` with versioned `RuntimeCommand` / `RuntimeEvent` unions, checked-in JSON Schema (or equivalent), `protocol_version`, `redactEventPayload()`, thin protocol-client surface; no cli/tui imports. (AC-1, AC-5)

- [x] **T-002**: Implement `standalone/apps/daemon` — loopback-only JSON-RPC 2.0 (`127.0.0.1`/`::1` default-deny `0.0.0.0`); methods `daemon.ping`, `daemon.hello`, `run.start`, `run.attach`, `command.submit`, `approval.respond`, `run.cancel`, `status.snapshot`; persist `.its-magic/daemon/listen.json` and `.its-magic/daemon/client.token` (0600-class); delegate to operator/workflow facades only. (AC-2, AC-4)

- [x] **T-003**: Per-run SQLite append-only event table (`run_id`, monotonic `seq`); hook existing workflow/observability emitters; retention cap + evidence refs; no duplicate emitters. (AC-3, AC-7)

- [x] **T-004**: WebSocket `/v1/events` on same listener; bearer auth; subscribe with `after_seq`; replay then live; `EVENT_SEQ_GAP` on gap; `DAEMON_EVENT_LAG_MAX` summary mode. (AC-3, AC-7)

- [x] **T-005**: Define `OperatorTransport` `{ submitCommand, subscribeEvents, attachRun, cancel, respondApproval }`; implement `runtime-core/src/daemon-client/` `DaemonTransport`; `DAEMON_UNREACHABLE` with actionable hint. (AC-3, AC-4)

- [x] **T-006**: Wire CLI/TUI to default `DaemonTransport` when daemon reachable; retain `InProcessTransport` for US-0146 contract doubles; production attach MUST NOT silently fall back when daemon required (AC-3). (AC-3)

- [x] **T-007**: `daemon.hello` negotiates `protocol_version`, `capabilities`, `supported_protocol_range`; controller vs observer on `run.attach`; `PROTOCOL_VERSION_MISMATCH`, `PROTOCOL_COMMAND_UNSUPPORTED`, `DAEMON_CONTROLLER_BUSY`. (AC-4, AC-5)

- [x] **T-008**: Daemon startup runs `crashResume(repo, store)` then `reconcileOperationalLedger()`; orphan child PID and stale attach token TTL cleanup; resume only via fresh `SessionSupervisor` sessions; `RECONCILE_INCOMPLETE` fail-closed. (AC-6)

- [x] **T-009**: One controller + N observers; `APPROVAL_NO_CONTROLLER` when needed; cancel maps to stop-matrix / `OperatorSession.cancel`; audit `client_id` + `client_kind` (`cli`|`tui`|`test`). (AC-7)

- [x] **T-010**: Author `docs/engineering/operator/daemon-protocol.md` — RPC methods, event ordering, security defaults, deferred-client boundary (AC-8). (AC-8)

- [x] **T-011**: Create twelve hermetic `standalone/tests/contract/us0148.contract.test.ts` markers exactly: `test_us0148_protocol_version_mismatch_fail_closed`, `test_us0148_schema_command_event_roundtrip`, `test_us0148_daemon_delegates_no_duplicate_workflow`, `test_us0148_cli_attach_ordered_events`, `test_us0148_reconnect_replay_after_seq`, `test_us0148_loopback_bind_default_deny_remote`, `test_us0148_wire_payload_secret_redaction`, `test_us0148_event_backpressure_summary_mode`, `test_us0148_concurrent_observer_controller_roles`, `test_us0148_approval_routing_single_controller`, `test_us0148_cancel_propagates_to_runtime`, `test_us0148_crash_restart_reconcile_fresh_sessions`. Ephemeral daemon port 0; no live remote network. (AC-1..AC-8)

## Locked 12-marker table

| # | Marker | AC |
|---|---|---|
| 1 | `test_us0148_protocol_version_mismatch_fail_closed` | AC-5 |
| 2 | `test_us0148_schema_command_event_roundtrip` | AC-1 |
| 3 | `test_us0148_daemon_delegates_no_duplicate_workflow` | AC-2 |
| 4 | `test_us0148_cli_attach_ordered_events` | AC-3 |
| 5 | `test_us0148_reconnect_replay_after_seq` | AC-3, AC-7 |
| 6 | `test_us0148_loopback_bind_default_deny_remote` | AC-4 |
| 7 | `test_us0148_wire_payload_secret_redaction` | AC-4 |
| 8 | `test_us0148_event_backpressure_summary_mode` | AC-7 |
| 9 | `test_us0148_concurrent_observer_controller_roles` | AC-7 |
| 10 | `test_us0148_approval_routing_single_controller` | AC-7 |
| 11 | `test_us0148_cancel_propagates_to_runtime` | AC-7 |
| 12 | `test_us0148_crash_restart_reconcile_fresh_sessions` | AC-6 |

## Integration verification (post T-011)

- [x] Test gate: twelve/twelve `test_us0148_*` green; US-0146 `test_us0146_*` still green via in-process path
- [x] Scope gate: loopback default-deny remote; no US-0145 delivery in daemon; no credentials / `.env` reads
- [x] Status gate: US-0148 remains OPEN; AC-1..AC-8 unchecked; US-0133..US-0147 remain DONE

## AC → Task surjective coverage

| AC | Task(s) |
|---|---|
| AC-1 | T-001 (T-011 m1,m2) |
| AC-2 | T-002 (T-011 m3) |
| AC-3 | T-003, T-004, T-005, T-006 (T-011 m4,m5) |
| AC-4 | T-002, T-005, T-007 (T-011 m6,m7) |
| AC-5 | T-001, T-007 (T-011 m1,m2) |
| AC-6 | T-008 (T-011 m12) |
| AC-7 | T-003, T-004, T-009 (T-011 m5,m8–m11) |
| AC-8 | T-010, T-011 (full matrix) |
| DC / architecture | T-anch |

**Surjectivity check**: 8/8 ACs covered. No `PLAN_AC_COVERAGE_GAP`.
