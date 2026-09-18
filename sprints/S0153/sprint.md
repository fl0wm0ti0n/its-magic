# Sprint S0153 — Sprint Plan (US-0146)

## Metadata

| Field | Value |
|---|---|
| story_id | US-0146 |
| bug_id | BUG-0006 / US-0048 isolation (fresh tech-lead; not a bug-queue drain) |
| story_title | CLI, TUI, and operational observability |
| sprint_id | **S0153** (locked — new folder; do not reuse S0146=BUG-0021) |
| delivery_mode | ultra_lean |
| macro_phase | plan (sprint-plan terminal for plan macro; plan-verify NOT in resolved_phase_plan — skipped; next = /execute dev) |
| current_phase | sprint-plan |
| approach | A1 (A*) — sibling cli+tui + `runtime-core/src/operator/` facades (R-0143 DQ1–DQ10 LOCKED; DEC-0146 Accepted) |
| companion_DEC | DEC-0146 (Accepted) |
| research_anchor | R-0143 (DQ1–DQ10 LOCKED) |
| architecture_anchor | docs/engineering/architecture.md # US-0146 |
| orchestrator_run_id | auto-20260917-us0146 |
| parent_orchestrator_run_id | auto-20260913-us0144 |
| fresh_context_marker | tl-US0146-sprintplan-20260917T190000Z-fresh |
| timestamp | 2026-09-17T19:00:00Z (UTC) |
| model_id | inherit (CROSS_MODEL_REVIEW=0) |
| verdict | PASS |
| decision_gate | false |
| SPRINT_MAX_TASKS | 12 |
| SPRINT_AUTO_SPLIT | 1 |
| task_count | 12 (T-anch + T-001..T-011; at cap; no split; 1:1 from architecture seeds) |
| COMPONENT_SCOPE_MODE | 0 |
| USER_GUIDE_MODE | 0 |
| plan-verify | ultra_lean — NOT in resolved_phase_plan; skipped; plan-verify.json SKIPPED placeholder only (not a QA phase); reason=`ultra_lean_skipped` |
| backlog_status | OPEN (US-0045 — not mutated; AC-1..AC-8 unchecked) |
| sprint_id_lock | **S0153** for US-0146. Do not reuse S0146 (BUG-0021). S0152 = US-0144 DONE. |

## Scope summary

Deliver sibling operator surfaces `@its-magic/cli` (`standalone/apps/cli`) and new `@its-magic/tui` (`standalone/apps/tui`) as thin clients of nested `standalone/packages/runtime-core/src/operator/` facades: `OperatorCommandFacade`, `OperatorObservabilityService`, `OperatorPrompts`, `OperatorSession`. Compose US-0140 `CommandRouter` / `PROGRAMMATIC_COMMANDS`, US-0143 `/auto`/`/quick` `RouteScheduled`, US-0141 app health, US-0142 browser evidence read APIs, US-0139 index, US-0080 token-cost evidence (read-only), US-0144 sovereign DTO fields when enabled. Pi only on `auth`/`models` via US-0135 `dispatchItsmCommand`. Nine hermetic `test_us0146_*`. Log cap 200 lines / 32 KiB visible. TUI readline + ANSI; narrow-terminal collapse order: phase > status > timeline > tools.

Out of scope: WorkflowEngine / CommandRouter / GateEngine rewrite; US-0148 daemon protocol; kit `cli.json` / plugin `tui.json`; `.opencode/commands/auto.md` restore; US-0145 parallel/deploy; US-0147 install/migration bodies; `.env` reads; npm-publish; git push; marking US-0146 DONE; ticking AC; reopening US-0140..US-0144 DONE.

## Acceptance criteria (8) — US-0146 (status OPEN, unchecked per US-0045)

Primary acceptance (`docs/product/acceptance.md` US-0146 row): CLI, TUI, and operational observability — operator commands, status/timeline, panels, metrics, responsive logs, and cross-platform integration tests.

- **AC-1**: `itsm` interactive and direct commands for auto, intake, ask, status, resume, models, auth, index, app, browser + lifecycle slash equivalents. — T-002, T-003, T-009, T-011.
- **AC-2**: Status presents project, work item, sprint, phase, role, model, backend, app health, index, browser, token, and cost. — T-004, T-011.
- **AC-3**: Chronological run timeline with phase/rework transitions, PASS/FAIL/stop reasons, session isolation, and evidence links. — T-005, T-011.
- **AC-4**: TUI is a runtime client with panels (conversation, phase, timeline, tool, changed-file, app/log, browser-evidence, model/cost) without workflow ownership. — T-010, T-011.
- **AC-5**: Metrics compose US-0080 without conflicting accounting. — T-006, T-011.
- **AC-6**: Approval and failure prompts usable interactively and non-interactively on Windows and Linux (min width 40). — T-007, T-011.
- **AC-7**: Large logs/event streams stay responsive via bounded summaries and evidence references. — T-008, T-011.
- **AC-8**: Integration tests cover command parity, cancellation, local reconnect, status accuracy, and narrow-terminal behavior. — T-008, T-009, T-010, T-011.

## Task summaries (12 — T-anch + T-001..T-011)

- **T-anch** (NO-OP / verification): Verify `# US-0146` H1 + DEC-0146 Accepted + R-0143 DQ1–DQ10 + nine `test_us0146_*` IDs + module pins. Record to `sprints/S0153/t-anch-verification.md`. NO mutation to `architecture.md` / `DEC-0146.md` / R-0143 in /execute.
- **T-001** (AC-1..AC-8 foundation): `operator/` module exports + facade/observability/prompts/session skeleton paths per architecture.
- **T-002** (AC-1): `OperatorCommandFacade` programmatic + US-0143 scheduler parity; REPL argv mapping.
- **T-003** (AC-1): `auth`/`models` delegate isolation via `dispatchItsmCommand` only; no Pi on workflow paths.
- **T-004** (AC-2): `buildStatusSnapshot()` read-only compose (US-0141/0142/0139/0080/0144).
- **T-005** (AC-3): `buildRunTimeline()` + evidence links and honest divergence labels.
- **T-006** (AC-5): `buildMetricsSnapshot()` + stale/missing flags; no token ledger dual-write.
- **T-007** (AC-6): `OperatorPrompts` interactive/non-interactive; `ITS_MAGIC_APPROVE` / pinned `--yes`/`--no`; else `OPERATOR_INPUT_REQUIRED`.
- **T-008** (AC-7, AC-8): Bounded log views (200 lines / 32 KiB) + `OperatorSession` attach/reconnect/cancel in-process.
- **T-009** (AC-1, AC-8): Complete `@its-magic/cli` REPL/argv entry (stub → functional thin client).
- **T-010** (AC-4, AC-8): New `@its-magic/tui` panels + narrow layout (cols≤40 collapse order).
- **T-011** (AC-1..AC-8): Nine contract tests `test_us0146_*` in `standalone/tests/contract`.

Execution order: T-anch → T-001 → T-002 → T-003 → T-004 → T-005 → T-006 → T-007 → T-008 → T-009 → T-010 → T-011 (acyclic). At cap (12 ≤ 12). Not `/quick`.

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
| AC-8 | T-008, T-009, T-010, T-011 (m9 + integration) |
| DC / architecture baseline | T-anch |

**Surjectivity check**: 8/8 ACs covered + primary acceptance.md US-0146 row covered. No `PLAN_AC_COVERAGE_GAP`.

## Locked 9-marker table (DEC-0146 / architecture `# US-0146`)

1. `test_us0146_cli_command_parity_programmatic_and_scheduler`
2. `test_us0146_cli_auth_models_delegate_isolated`
3. `test_us0146_status_snapshot_compose_read_only`
4. `test_us0146_run_timeline_evidence_links`
5. `test_us0146_tui_panels_client_only_boundaries`
6. `test_us0146_metrics_token_cost_compose_no_conflict`
7. `test_us0146_approval_prompt_interactive_noninteractive`
8. `test_us0146_bounded_log_summary_evidence_ref`
9. `test_us0146_local_reconnect_cancel_narrow_terminal`

Primary: `standalone/tests/contract` (`node:test`) Windows + Linux. Kit `files` omit `standalone/`.

## Risks (R1–R5 — accepted)

| Risk | Severity | Mitigation |
|---|---|---|
| R1 Router table fork in CLI | HIGH | Facade-only entry; `test_us0146_cli_command_parity_*` |
| R2 TUI imports workflow internals | HIGH | Import ban; `test_us0146_tui_panels_client_only_boundaries` |
| R3 Metrics ledger dual-write | MEDIUM | Read-only observability; `test_us0146_metrics_token_cost_compose_no_conflict` |
| R4 OpenCode host confusion | MEDIUM | Standalone surface distinct; no plugin `tui.json` |
| R5 US-0145/0147/0148 scope creep | MEDIUM | Explicit OUT in DEC-0146 |

## Compose guards (UNCHANGED)

| Target | Result |
|---|---|
| US-0140..US-0144 | DONE compose-only; do not reopen |
| US-0145 / US-0147 / US-0148 | OUT OF SCOPE |
| BUG-* | not mutated / not drained |
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
| story_id | US-0146 |
| sprint_id | S0153 |
| orchestrator_run_id | auto-20260917-us0146 |
| parent_orchestrator_run_id | auto-20260913-us0144 |
| delivery_mode | ultra_lean |
| macro_phase | plan |
| fresh_context_marker | tl-US0146-sprintplan-20260917T190000Z-fresh |
| timestamp | 2026-09-17T19:00:00Z (UTC) |
| model_id | inherit (CROSS_MODEL_REVIEW=0) |
| evidence_ref | sprints/S0153/sprint.md, tasks.md, progress.md, uat.json, uat.md, plan-verify.json (SKIPPED), summary.md, qa-findings.md, release-findings.md, closure-verification.md, handoffs/tl_to_dev.md, docs/engineering/state.md, handoffs/resume_brief.md, docs/product/backlog.md ## US-0146 |

Consumed architecture proof (independent `compute_strict_proof_hash` MATCH; not STALE at consume 2026-09-17T19:00:00Z):

- Architecture producer: `rp-auto-20260917-us0146-architecture-techlead-20260917T185000Z-US-0146` / `5CD3C53F4B194541E3182C1DC53FE3D0C83FE3BEF986B10B509F922E5ED829F1` — RUNTIME_PROOF_VALID before TTL `2026-09-17T19:50:00Z`.

## Runtime proof (DEC-0038)

| Field | Value |
|---|---|
| runtime_proof_id | rp-auto-20260917-us0146-sprint-plan-techlead-20260917T190000Z-US-0146 |
| phase_id | sprint-plan |
| role | tech-lead |
| story_id | US-0146 |
| sprint_id | S0153 |
| orchestrator_run_id | auto-20260917-us0146 |
| delivery_mode | ultra_lean |
| macro_phase | plan |
| model_id | inherit (CROSS_MODEL_REVIEW=0) |
| proof_issued_at | 2026-09-17T19:00:00Z |
| proof_ttl_seconds | 3600 |
| proof_ttl | 2026-09-17T20:00:00Z (UTC) |
| proof_hash | EBCD4602E5B769D72298C7305EB819963A9DD9EC55A075634E35B1F055118524 |
| canonical_payload | `{"orchestrator_run_id":"auto-20260917-us0146","phase_id":"sprint-plan","proof_issued_at":"2026-09-17T19:00:00Z","proof_ttl_seconds":3600,"role":"tech-lead","runtime_proof_id":"rp-auto-20260917-us0146-sprint-plan-techlead-20260917T190000Z-US-0146"}` |

Hash via `scripts.token_cost_lib.compute_strict_proof_hash` (positional, compact sorted-key JSON). Isolation extras (not hashed): `delivery_mode=ultra_lean`, `macro_phase=plan`, `model_id=inherit`, `sprint_id=S0153`, `story_id=US-0146`. hash_recompute_confirmation=true.

## Decision gate

| Field | Value |
|---|---|
| decision_gate | false |
| stop_conditions_met | yes |
| missing_acceptance_criteria | none (8/8 surjective + nine contract markers) |
| task_count | 12 (at SPRINT_MAX_TASKS=12; no split; 1:1 seeds) |
| companion_DEC | DEC-0146 Accepted |
| plan-verify readiness | SKIPPED placeholder (`ultra_lean_skipped`; CROSS_MODEL_REVIEW=0 — no critic) |

## Definition of done (sprint-plan)

- [x] 12 tasks enumerated (T-anch + T-001..T-011) — at SPRINT_MAX_TASKS=12 cap
- [x] 8/8 ACs surjective + primary acceptance.md US-0146 covered
- [x] All nine architecture-owned `test_us0146_*` named
- [x] Execute phase role matrix documented
- [x] Compose guards UNCHANGED
- [x] Isolation evidence + runtime proof emitted
- [x] Sprint-plan checkpoint appended to docs/engineering/state.md
- [x] Sprint-plan handoff prepended to handoffs/tl_to_dev.md
- [x] SPRINT_PLAN_PASS prepended to handoffs/resume_brief.md (→ /execute dev)
- [x] UAT placeholders written
- [x] Lifecycle stubs written
- [x] Traceability row added (Status=PLANNED)
- [x] Backlog status OPEN; acceptance unchecked
- [x] plan-verify.json SKIPPED placeholder

## Next scheduled phase

| Field | Value |
|---|---|
| next_scheduled_phase | `/execute` (role=dev per US-0069 / DEC-0051, fresh dev subagent per BUG-0006; first canonical phase of build+verify macro; plan-verify NOT in resolved_phase_plan — skipped; CROSS_MODEL_REVIEW=0 — no sovereign-critic) |
| next_scheduled_role | dev |
| next_sprint_macro | build+verify |
| stop_condition | STOP after sprint-plan completes; hand off via artifacts only. Orchestrator MUST spawn `/execute` in fresh dev subagent per BUG-0006. Do not spawn /execute, /plan-verify, or critic from this subagent. |
