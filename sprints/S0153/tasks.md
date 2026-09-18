# Sprint S0153 — Task checklist (US-0146)

Total tasks: 12 (T-anch + T-001..T-011). SPRINT_MAX_TASKS=12; SPRINT_AUTO_SPLIT=1; no split (at cap). T-anch retained as NO-OP verification. Seeds 1:1 from `docs/engineering/architecture.md` `# US-0146`. Sprint id **S0153** locked (S0146 = BUG-0021 — do not reuse).

**Isolation**: `tl-US0146-sprintplan-20260917T190000Z-fresh` · `model_id=inherit` · `orchestrator_run_id=auto-20260917-us0146`

## Task execution order

1. T-anch (NO-OP / verification)
2. T-001 (operator/ module skeleton)
3. T-002 (OperatorCommandFacade parity)
4. T-003 (auth/models delegate isolation)
5. T-004 (buildStatusSnapshot)
6. T-005 (buildRunTimeline)
7. T-006 (buildMetricsSnapshot)
8. T-007 (OperatorPrompts)
9. T-008 (bounded logs + OperatorSession)
10. T-009 (@its-magic/cli REPL/argv)
11. T-010 (@its-magic/tui panels)
12. T-011 (nine `test_us0146_*`)

## Task checklist

- [x] **T-anch**: Verify `# US-0146` H1 in `docs/engineering/architecture.md`; DEC-0146 Accepted; R-0143 DQ1–DQ10 LOCKED; nine-marker table locked; module pins present; compose guards (US-0140..US-0144 DONE; US-0145/0147/0148 OUT; no kit cli.json/tui.json; no auto.md restore; kit `files` omit `standalone/`). Record to `sprints/S0153/t-anch-verification.md`. NO mutation to `architecture.md` / `DEC-0146.md` / R-0143 in /execute. (DC / architecture baseline; NO-OP)

- [x] **T-001**: Create `standalone/packages/runtime-core/src/operator/` exports and skeleton types for `OperatorCommandFacade`, `OperatorObservabilityService`, `OperatorPrompts`, `OperatorSession` per architecture module pins. Wire package exports from runtime-core index (additive). (foundation for AC-1..AC-8)

- [x] **T-002**: Implement `OperatorCommandFacade` mapping AC-1 vocabulary: lifecycle tokens → `PROGRAMMATIC_COMMANDS` via `CommandRouter`; `auto`/`quick` → US-0143 `RouteScheduled`; dedicated methods for `ask`, `status`, `resume`, `index`, `app`, `browser`. Interactive REPL parses same tokens as argv. Tests: markers 1 (owned by T-011). (AC-1)

- [x] **T-003**: Route `auth`/`models` only through US-0135 `dispatchItsmCommand` / Pi boundary; remove workflow stub paths from cli for those commands; no Pi imports on observability/TUI paths. Tests: marker 2. (AC-1)

- [x] **T-004**: Implement `OperatorObservabilityService.buildStatusSnapshot()` read-only DTO compose over runs, repo, US-0141 health, US-0139 index, US-0142 browser evidence, US-0080 token-cost, US-0144 sovereign fields when enabled. No dual-write to token ledger. Tests: marker 3. (AC-2)

- [x] **T-005**: Implement `buildRunTimeline()` from `RunsStore` audit + repo evidence; phase/rework ordering; PASS/FAIL/stop reasons; session isolation; evidence refs; honest divergence labels. Tests: marker 4. (AC-3)

- [x] **T-006**: Implement `buildMetricsSnapshot()` composing US-0080 authoritative metrics + derived counters; surface `metrics_stale` / `evidence_missing` on conflict — never silent overwrite. Tests: marker 6. (AC-5)

- [x] **T-007**: Implement shared `OperatorPrompts` for CLI+TUI: interactive keyed choices; min width 40 cols UTF-8 Win/Linux; non-interactive requires `ITS_MAGIC_APPROVE` and pinned `--yes`/`--no` only where safe — else `OPERATOR_INPUT_REQUIRED`. Tests: marker 7. (AC-6)

- [x] **T-008**: Bounded log/event views default 200 lines / 32 KiB visible with `{truncated, total_bytes, evidence_path}` footer; stream backpressure. `OperatorSession` in-process attach/reconnect/cancel mapping to existing stop-matrix / workflow cancel tokens (not US-0148 sockets). Tests: markers 8, 9. (AC-7, AC-8)

- [x] **T-009**: Complete `standalone/apps/cli` thin client: argv + REPL entry delegating to `OperatorCommandFacade` / observability; replace Phase-0 stub messaging for in-scope commands. (AC-1, AC-8)

- [x] **T-010**: Add `standalone/apps/tui` package: readline + ANSI panels consuming typed DTOs only; collapse order cols≤40: phase > status > timeline > tools; **no** `CommandRouter` / `GateEngine` / drain imports in workflow paths. Tests: marker 5. (AC-4, AC-8)

- [x] **T-011**: Create nine hermetic `standalone/tests/contract` markers exactly: `test_us0146_cli_command_parity_programmatic_and_scheduler`, `test_us0146_cli_auth_models_delegate_isolated`, `test_us0146_status_snapshot_compose_read_only`, `test_us0146_run_timeline_evidence_links`, `test_us0146_tui_panels_client_only_boundaries`, `test_us0146_metrics_token_cost_compose_no_conflict`, `test_us0146_approval_prompt_interactive_noninteractive`, `test_us0146_bounded_log_summary_evidence_ref`, `test_us0146_local_reconnect_cancel_narrow_terminal`. Windows + Linux fake-model CI. Do not weaken `test_us0140_*`..`test_us0144_*` compose tests. (AC-1..AC-8)

## Locked 9-marker table

| # | Marker | AC |
|---|---|---|
| 1 | `test_us0146_cli_command_parity_programmatic_and_scheduler` | AC-1 |
| 2 | `test_us0146_cli_auth_models_delegate_isolated` | AC-1 |
| 3 | `test_us0146_status_snapshot_compose_read_only` | AC-2 |
| 4 | `test_us0146_run_timeline_evidence_links` | AC-3 |
| 5 | `test_us0146_tui_panels_client_only_boundaries` | AC-4 |
| 6 | `test_us0146_metrics_token_cost_compose_no_conflict` | AC-5 |
| 7 | `test_us0146_approval_prompt_interactive_noninteractive` | AC-6 |
| 8 | `test_us0146_bounded_log_summary_evidence_ref` | AC-7 |
| 9 | `test_us0146_local_reconnect_cancel_narrow_terminal` | AC-8 |

## Integration verification (post T-011)

- [x] Test gate: standalone npm test covers 9/9 `test_us0146_*` plus compose us0140..us0144 still green
- [x] Import-boundary gate: Pi only on auth/models paths; kit `files` omit `standalone/`; TUI client-only
- [x] Scope gate: no credentials / `.env` reads; no `auto.md` restore; no US-0145+ implementation
- [x] Status gate: US-0146 remains OPEN; AC-1..AC-8 unchecked; US-0140..US-0144 remain DONE

## AC → Task surjective coverage

| AC | Task(s) |
|---|---|
| AC-1 | T-002, T-003, T-009 (T-011 m1, m2) |
| AC-2 | T-004 (T-011 m3) |
| AC-3 | T-005 (T-011 m4) |
| AC-4 | T-010 (T-011 m5) |
| AC-5 | T-006 (T-011 m6) |
| AC-6 | T-007 (T-011 m7) |
| AC-7 | T-008 (T-011 m8) |
| AC-8 | T-008, T-009, T-010, T-011 (m9) |
| DC / architecture | T-anch |

**Surjectivity check**: 8/8 ACs covered. No `PLAN_AC_COVERAGE_GAP`.
