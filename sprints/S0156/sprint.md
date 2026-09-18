# Sprint S0156 — Sprint Plan (US-0148)

## Metadata

| Field | Value |
|---|---|
| story_id | US-0148 |
| bug_id | BUG-0006 / US-0048 isolation (fresh tech-lead; not a bug-queue drain) |
| story_title | Stable control protocol and recoverable daemon |
| sprint_id | **S0156** (locked — new folder; S0155 = US-0145 DONE; do not reuse) |
| delivery_mode | ultra_lean |
| macro_phase | plan (sprint-plan terminal for plan macro; plan-verify NOT in resolved_phase_plan — skipped; next = /execute dev → build+verify macro) |
| current_phase | sprint-plan |
| approach | A1 (A*) — `@its-magic/protocol` + `apps/daemon` loopback JSON-RPC/WebSocket + `OperatorTransport`/`DaemonTransport` + per-run SQLite event log + restart reconcile + twelve `test_us0148_*`; R-0148 DQ1–DQ10 LOCKED; DEC-0148 Accepted |
| companion_DEC | DEC-0148 (Accepted) |
| research_anchor | R-0148 (DQ1–DQ10 LOCKED) |
| architecture_anchor | docs/engineering/architecture.md # US-0148 |
| orchestrator_run_id | auto-20260917-us0148 |
| parent_orchestrator_run_id | auto-20260917-us0146 |
| fresh_context_marker | tl-US0148-sprintplan-20260917T213000Z-fresh |
| timestamp | 2026-09-17T21:30:00Z (UTC) |
| model_id | inherit (CROSS_MODEL_REVIEW=0) |
| verdict | PASS |
| decision_gate | false |
| SPRINT_MAX_TASKS | 12 |
| SPRINT_AUTO_SPLIT | 1 |
| task_count | 12 (T-anch + T-001..T-011; at cap; no split; 1:1 from architecture seeds) |
| COMPONENT_SCOPE_MODE | 0 |
| USER_GUIDE_MODE | 0 |
| plan-verify | ultra_lean — NOT in resolved_phase_plan; skipped; plan-verify.json optional SKIPPED placeholder only (not a QA phase); reason=`ultra_lean_skipped` |
| backlog_status | OPEN (US-0045 — not mutated; AC-1..AC-8 unchecked) |
| sprint_id_lock | **S0156** for US-0148. S0155 = US-0145 released. |

## Scope summary

Deliver versioned local control protocol (`standalone/packages/protocol`), thin recoverable daemon (`standalone/apps/daemon`) on loopback JSON-RPC + WebSocket `/v1/events`, `DaemonTransport` in `runtime-core/src/daemon-client/`, CLI/TUI default daemon attach with `InProcessTransport` retained for US-0146 contract doubles, per-run SQLite ordered event log with replay, bearer token + controller/observer roles, startup `crashResume` + `reconcileOperationalLedger`, operator doc `docs/engineering/operator/daemon-protocol.md`, and twelve hermetic `test_us0148_*` markers. Compose US-0146 operator facades; US-0136 fresh sessions on resume; US-0135 redaction via `redactEventPayload()`.

Out of scope: US-0145 delivery/deploy in daemon; deferred rich remote clients v1; distributed workers; npm-publish; git push; `.env` reads; kit `cli.json` / plugin `tui.json`; `auto.md` restore; marking US-0148 DONE; ticking AC; reopening US-0133..US-0147 DONE.

## Acceptance criteria (8) — US-0148 (status OPEN, unchecked per US-0045)

Primary acceptance (`docs/product/acceptance.md` US-0148 row): Stable control protocol and recoverable daemon — versioned commands/events, reconnect, local security, reconciliation, protocol tests, and future-client boundary.

- **AC-1**: Versioned command/event schemas cover runtime commands, deltas, approvals, run-state, tool/browser lifecycle, status, cancellation, and errors. — T-001 (T-011 m1,m2).
- **AC-2**: Thin local daemon owns no duplicate workflow rules; delegates to runtime services. — T-002 (T-011 m3).
- **AC-3**: CLI/TUI start or attach, stream ordered events, approve, cancel, disconnect/reconnect without losing canonical state. — T-003, T-004, T-005, T-006 (T-011 m4,m5).
- **AC-4**: Local auth, transport permissions, client identity, redaction, default-deny remote bind. — T-002, T-005, T-007 (T-011 m6,m7).
- **AC-5**: Protocol version mismatch and unsupported commands fail closed with diagnostics. — T-001, T-007 (T-011 m1,m2).
- **AC-6**: Daemon restart reconciles SQLite operational state, cleans orphans per policy, resumes via fresh role sessions only. — T-008 (T-011 m12).
- **AC-7**: Contract tests cover ordering, backpressure, reconnect/replay, concurrent clients, approvals, cancellation, crashes, version negotiation. — T-003, T-004, T-009 (T-011 m5,m8,m9,m10,m11).
- **AC-8**: Protocol documented for deferred clients without shipping them. — T-010 + full `test_us0148_*` matrix (T-011).

## Task summaries (12 — T-anch + T-001..T-011)

- **T-anch** (NO-OP / verification): Verify `# US-0148` H1 + DEC-0148 Accepted + R-0148 DQ1–DQ10 + twelve `test_us0148_*` IDs + path/RPC pins. Record to `sprints/S0156/t-anch-verification.md`. NO mutation to `architecture.md` / `DEC-0148.md` / R-0148 in /execute.
- **T-001** (AC-1, AC-5): `@its-magic/protocol` — schemas, types, `redactEventPayload`, protocol-client surface.
- **T-002** (AC-2, AC-4): `standalone/apps/daemon` JSON-RPC loopback server; `.its-magic/daemon/listen.json` / `client.token`.
- **T-003** (AC-3, AC-7): Per-run SQLite event log + workflow/observability hooks (monotonic `seq`).
- **T-004** (AC-3, AC-7): WebSocket `/v1/events` subscribe + `after_seq` replay; `EVENT_SEQ_GAP` handling.
- **T-005** (AC-3, AC-4): `OperatorTransport` interface + `runtime-core/src/daemon-client/` `DaemonTransport`.
- **T-006** (AC-3): CLI/TUI default `DaemonTransport` when reachable; preserve `InProcessTransport` for `test_us0146_*`; no silent fallback when daemon required.
- **T-007** (AC-4, AC-5): `daemon.hello` versioning/capabilities; controller vs observer attach; `PROTOCOL_*` / `DAEMON_*` reason codes.
- **T-008** (AC-6): Startup `crashResume` + `reconcileOperationalLedger` + orphan PID/token TTL cleanup; `RECONCILE_INCOMPLETE` fail-closed.
- **T-009** (AC-7): Approval routing, cancel delegation, concurrency audit (`client_id`, `client_kind`).
- **T-010** (AC-8): `docs/engineering/operator/daemon-protocol.md` (deferred-client boundary).
- **T-011** (AC-1..AC-8): Twelve `standalone/tests/contract/us0148.contract.test.ts` markers (ephemeral daemon port 0).

Execution order: T-anch → T-001 → T-002 → T-003 → T-004 → T-005 → T-006 → T-007 → T-008 → T-009 → T-010 → T-011 (acyclic). At cap (12 ≤ 12). Not `/quick`.

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
| DC / architecture baseline | T-anch |

**Surjectivity check**: 8/8 ACs covered + primary acceptance.md US-0148 row covered. No `PLAN_AC_COVERAGE_GAP`.

## Locked 12-marker table (DEC-0148 / architecture `# US-0148`)

1. `test_us0148_protocol_version_mismatch_fail_closed`
2. `test_us0148_schema_command_event_roundtrip`
3. `test_us0148_daemon_delegates_no_duplicate_workflow`
4. `test_us0148_cli_attach_ordered_events`
5. `test_us0148_reconnect_replay_after_seq`
6. `test_us0148_loopback_bind_default_deny_remote`
7. `test_us0148_wire_payload_secret_redaction`
8. `test_us0148_event_backpressure_summary_mode`
9. `test_us0148_concurrent_observer_controller_roles`
10. `test_us0148_approval_routing_single_controller`
11. `test_us0148_cancel_propagates_to_runtime`
12. `test_us0148_crash_restart_reconcile_fresh_sessions`

Primary: hermetic `node:test` + ephemeral daemon on port 0; no live remote network.

## Risks (architecture-owned — accepted)

| Risk | Severity | Mitigation |
|---|---|---|
| US-0146 contract break | HIGH | `InProcessTransport` for `test_us0146_*` |
| Event log growth | MEDIUM | Per-run retention cap + evidence refs |
| Windows loopback edge cases | MEDIUM | Explicit `127.0.0.1`; CI matrix |
| Controller attach race | MEDIUM | Single-controller lock + `DAEMON_CONTROLLER_BUSY` |
| Partial restart ledger | MEDIUM | `RECONCILE_INCOMPLETE` + operator doc |
| Secret leak on wire | HIGH | `redactEventPayload` + `test_us0148_wire_payload_secret_redaction` |
| US-0145 scope creep | MEDIUM | No delivery/deploy in daemon |

## Compose guards (UNCHANGED)

| Target | Result |
|---|---|
| US-0133..US-0147 | DONE compose-only (US-0146 clients migrate IN) |
| US-0145 | OUT OF DAEMON |
| BUG-0022 | OPEN not drained |
| US-0045 | Status stays OPEN |
| US-0085 | `.env` deny |
| `.opencode/commands/auto.md` | do not restore |
| DEC-0038 tuple | UNAMENDED |

## Execute phase role (per DEC-0051 / US-0069)

| Phase | Role | Isolation |
|---|---|---|
| /execute | dev (fresh per BUG-0006) | {phase_id:execute, role:dev} |
| /qa | qa (fresh) | {phase_id:qa, role:qa} |
| /verify-work | qa (fresh) | {phase_id:verify-work, role:qa} |
| /release | release (fresh) | {phase_id:release, role:release} |
| /closure | qe (fresh) | {phase_id:closure, role:qe} |
| /refresh-context | curator (fresh) | {phase_id:refresh-context, role:curator} |

## Isolation evidence (US-0048 / DEC-0029 / US-0104 v2)

| Field | Value |
|---|---|
| phase_id | sprint-plan |
| role | tech-lead |
| story_id | US-0148 |
| sprint_id | S0156 |
| orchestrator_run_id | auto-20260917-us0148 |
| parent_orchestrator_run_id | auto-20260917-us0146 |
| delivery_mode | ultra_lean |
| macro_phase | plan |
| drain_story_index | 1 of 3 |
| backlog_drain_stories_remaining_budget | 2 |
| fresh_context_marker | tl-US0148-sprintplan-20260917T213000Z-fresh |
| timestamp | 2026-09-17T21:30:00Z (UTC) |
| model_id | inherit (CROSS_MODEL_REVIEW=0) |
| evidence_ref | sprints/S0156/sprint.md, tasks.md, progress.md, handoffs/tl_to_dev.md, docs/engineering/state.md, handoffs/resume_brief.md, docs/product/backlog.md ## US-0148 |

Consumed architecture proof (independent `compute_strict_proof_hash` MATCH; not STALE at consume 2026-09-17T21:30:00Z):

- Architecture producer: `rp-auto-20260917-us0148-architecture-techlead-20260917T211400Z-US-0148` / `AC546FD44FE347547D9DD92F79C906DC71B2212DD27969336F73F9475C48708D` — RUNTIME_PROOF_VALID before TTL `2026-09-17T22:14:00Z`.

## Runtime proof (DEC-0038)

| Field | Value |
|---|---|
| runtime_proof_id | rp-auto-20260917-us0148-sprint-plan-techlead-20260917T213000Z-US-0148 |
| phase_id | sprint-plan |
| role | tech-lead |
| story_id | US-0148 |
| sprint_id | S0156 |
| orchestrator_run_id | auto-20260917-us0148 |
| delivery_mode | ultra_lean |
| macro_phase | plan |
| model_id | inherit (CROSS_MODEL_REVIEW=0) |
| proof_issued_at | 2026-09-17T21:30:00Z |
| proof_ttl_seconds | 3600 |
| proof_ttl | 2026-09-17T22:30:00Z (UTC) |
| proof_hash | E9CED6541917EAFB8C9727E95E46AC57941165FC2C61017A0F9431E6E1A22A62 |
| canonical_payload | `{"orchestrator_run_id":"auto-20260917-us0148","phase_id":"sprint-plan","proof_issued_at":"2026-09-17T21:30:00Z","proof_ttl_seconds":3600,"role":"tech-lead","runtime_proof_id":"rp-auto-20260917-us0148-sprint-plan-techlead-20260917T213000Z-US-0148"}` |

Hash via `scripts.token_cost_lib.compute_strict_proof_hash` (positional, compact sorted-key JSON). Isolation extras (not hashed): `delivery_mode=ultra_lean`, `macro_phase=plan`, `model_id=inherit`, `sprint_id=S0156`, `story_id=US-0148`, `drain_story_index=1 of 3`. hash_recompute_confirmation=true.

## Decision gate

| Field | Value |
|---|---|
| decision_gate | false |
| stop_conditions_met | yes |
| missing_acceptance_criteria | none (8/8 surjective + twelve contract markers) |
| task_count | 12 (at SPRINT_MAX_TASKS=12; no split; 1:1 seeds) |
| companion_DEC | DEC-0148 Accepted |
| plan-verify readiness | SKIPPED (`ultra_lean_skipped`; CROSS_MODEL_REVIEW=0 — no critic) |

## Definition of done (sprint-plan)

- [x] 12 tasks enumerated (T-anch + T-001..T-011) — at SPRINT_MAX_TASKS=12 cap
- [x] 8/8 ACs surjective + primary acceptance.md US-0148 covered
- [x] All twelve architecture-owned `test_us0148_*` named
- [x] Execute phase role matrix documented
- [x] Compose guards UNCHANGED
- [x] Isolation evidence + runtime proof emitted
- [x] Sprint-plan checkpoint appended to docs/engineering/state.md
- [x] Sprint-plan handoff prepended to handoffs/tl_to_dev.md
- [x] SPRINT_PLAN_PASS prepended to handoffs/resume_brief.md (→ /execute dev)
- [x] Traceability row added (Status=PLANNED)
- [x] Backlog status OPEN; acceptance unchecked
- [x] plan-verify skipped per ultra_lean (no QA spawn)

## Next scheduled phase

| Field | Value |
|---|---|
| next_scheduled_phase | `/execute` (role=dev per US-0069 / DEC-0051, fresh dev subagent per BUG-0006; first canonical phase of build+verify macro; plan-verify NOT in resolved_phase_plan — skipped; CROSS_MODEL_REVIEW=0 — no sovereign-critic) |
| next_scheduled_role | dev |
| next_sprint_macro | build+verify |
| stop_condition | STOP after sprint-plan completes; hand off via artifacts only. Orchestrator MUST spawn `/execute` in fresh dev subagent per BUG-0006. Do not spawn /execute, /plan-verify, or critic from this subagent. |
