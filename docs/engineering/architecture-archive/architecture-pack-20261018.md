# Architecture archive pack (2026-10-18)

- Rollover trigger: `ARCH_HOT_MAX_LINES=3000, ARCH_HOT_MAX_STORY_SECTIONS=120`
- Source: `docs/engineering/architecture.md`
- Archived units (oldest first, contiguous prefix): 1
- Retained units in hot file: 40
- First archived heading: `# US-0146 — CLI, TUI, and operational observability`
- Last archived heading: `# US-0146 — CLI, TUI, and operational observability`
- Verification tuple (mandatory):
  - archived_body_lines=114
  - preamble_lines=1
  - retained_body_lines=2948

---

# US-0146 — CLI, TUI, and operational observability

## Overview

US-0146 delivers sibling operator surfaces `@its-magic/cli` and new `@its-magic/tui` as thin clients of nested `runtime-core/src/operator/` facades. `DEC-0146` and `R-0143` are authoritative. **Approach A1 (A\*)** is locked. Compose US-0140 `CommandRouter` / `PROGRAMMATIC_COMMANDS`, US-0143 `/auto`/`/quick` `RouteScheduled`, US-0141 `AppRuntime` health, US-0142 browser evidence read APIs, US-0139 index, US-0080 token-cost evidence (read-only), and US-0144 sovereign DTO fields when enabled. No `WorkflowEngine`, `CommandRouter`, or `GateEngine` rewrite. No US-0148 daemon protocol, no kit `cli.json` / plugin `tui.json`, no `.opencode/commands/auto.md` restore, no `.env` access.

**Research anchor**: **R-0143** (DQ1–DQ10 LOCKED). **Companion DEC**: **DEC-0146** (Accepted — authored THIS phase). **baseline_h2_count (pre-mutate)**: `0`.
**Fresh context marker**: `tl-US0146-architecture-20260917T185000Z-fresh`
**Orchestrator run id**: `auto-20260917-us0146`
**Timestamp**: 2026-09-17T18:50:00Z (UTC)
**Verdict**: PASS
**Next**: `/sprint-plan` **S0153** (fresh **tech-lead**). CROSS_MODEL_REVIEW=0 — do **not** spawn sovereign-critic from this subagent. Status remains OPEN. AC-1..AC-8 remain unchecked.

## Locked design (A1)

| DQ | Lock |
|----|------|
| DQ1 | Sibling `standalone/apps/cli` + `standalone/apps/tui`; `runtime-core/src/operator/` facades; Pi only on `auth`/`models` |
| DQ2 | `OperatorCommandFacade` → `CommandRouter` / programmatic + scheduler paths; REPL argv parity |
| DQ3 | `OperatorObservabilityService.buildStatusSnapshot()` — read-only compose of runs, repo, app, index, browser, token-cost, sovereign |
| DQ4 | `buildRunTimeline()` — `RunsStore` audit + repo evidence; honest divergence labels |
| DQ5 | TUI client-only; **readline + ANSI** panels; typed DTO subscriptions |
| DQ6 | `buildMetricsSnapshot()` — US-0080 authoritative + derived counters; no `token_cost_runs` append from CLI/TUI |
| DQ7 | `OperatorPrompts` — Win/Linux width ≥40; `ITS_MAGIC_APPROVE` / pinned `--yes`/`--no`; else `OPERATOR_INPUT_REQUIRED` |
| DQ8 | Log/event cap **200 lines** / **32 KiB** visible + evidence footer; stream backpressure |
| DQ9 | In-process `OperatorSession` attach/reconnect/cancel; not US-0148 |
| DQ10 | Nine `test_us0146_*`; kit omits `standalone/`; **R-0143**; expected sprint **S0153** |

### Module pins

- `standalone/packages/runtime-core/src/operator/operator-command-facade.ts` — command + scheduler delegation
- `standalone/packages/runtime-core/src/operator/operator-observability-service.ts` — status, timeline, metrics
- `standalone/packages/runtime-core/src/operator/operator-prompts.ts` — shared approval UX
- `standalone/packages/runtime-core/src/operator/operator-session.ts` — in-process attach/reconnect/cancel handle
- `standalone/apps/cli` — complete stub; REPL + argv entry
- `standalone/apps/tui` — new package; panel layout + narrow-terminal collapse order: phase > status > timeline > tools

### Risks (architecture-owned)

| Risk | Mitigation |
|------|------------|
| Router table fork in CLI | Facade-only entry; contract parity test |
| TUI imports workflow internals | Package import ban in `test_us0146_tui_panels_client_only_boundaries` |
| Metrics ledger dual-write | Read-only observability service; US-0080 producers unchanged |
| OpenCode host confusion | BUG-0021/0023 DONE — standalone surface distinct; no plugin `tui.json` |
| US-0145/0147/0148 scope creep | Explicit OUT; compose boundaries in DEC-0146 |

## AC coverage

| AC | Architecture owner | Tests |
|----|-------------------|-------|
| AC-1 | DQ2 facade + auth delegate | `test_us0146_cli_command_parity_programmatic_and_scheduler`, `test_us0146_cli_auth_models_delegate_isolated` |
| AC-2 | DQ3 status snapshot | `test_us0146_status_snapshot_compose_read_only` |
| AC-3 | DQ4 timeline | `test_us0146_run_timeline_evidence_links` |
| AC-4 | DQ5 TUI client | `test_us0146_tui_panels_client_only_boundaries` |
| AC-5 | DQ6 metrics | `test_us0146_metrics_token_cost_compose_no_conflict` |
| AC-6 | DQ7 prompts | `test_us0146_approval_prompt_interactive_noninteractive` |
| AC-7 | DQ8 bounded logs | `test_us0146_bounded_log_summary_evidence_ref` |
| AC-8 | DQ9 session + DQ10 harness | `test_us0146_local_reconnect_cancel_narrow_terminal` |

## Test contract

1. `test_us0146_cli_command_parity_programmatic_and_scheduler` — AC-1 argv + slash mapping; `/auto`/`/quick` scheduled.
2. `test_us0146_cli_auth_models_delegate_isolated` — AC-1 `auth`/`models` use `dispatchItsmCommand` only; workflow stub removed.
3. `test_us0146_status_snapshot_compose_read_only` — AC-2 fields; no dual-write token ledger.
4. `test_us0146_run_timeline_evidence_links` — AC-3 ordering, rework, evidence refs.
5. `test_us0146_tui_panels_client_only_boundaries` — AC-4 no `CommandRouter` import in tui workflow path.
6. `test_us0146_metrics_token_cost_compose_no_conflict` — AC-5 US-0080 authority + derived counters.
7. `test_us0146_approval_prompt_interactive_noninteractive` — AC-6 Win/Linux width + non-interactive fail-closed.
8. `test_us0146_bounded_log_summary_evidence_ref` — AC-7 truncation + pointer.
9. `test_us0146_local_reconnect_cancel_narrow_terminal` — AC-8 attach/detach, cancel, cols≤40 layout.

## Sprint seeds

- T-anch: DEC-0146 and this `# US-0146` section.
- T-001: `operator/` module exports + facade skeleton.
- T-002: `OperatorCommandFacade` programmatic + scheduler parity.
- T-003: `auth`/`models` delegate isolation (US-0135).
- T-004: `buildStatusSnapshot` compose (US-0141/0142/0139/0080/0144).
- T-005: `buildRunTimeline` + evidence links.
- T-006: `buildMetricsSnapshot` + stale/missing flags.
- T-007: `OperatorPrompts` interactive/non-interactive.
- T-008: bounded logs + `OperatorSession` attach/cancel.
- T-009: `@its-magic/cli` REPL/argv completion.
- T-010: `@its-magic/tui` panels + narrow layout.
- T-011: nine contract tests (`test_us0146_*`).

AC coverage is surjective across T-001..T-011; sprint-plan owns **S0153** materialization (≤12 tasks; reconcile T-anch..T-011 to cap). ultra_lean: plan-verify skipped after sprint-plan.

## Template parity (FRAMEWORK_KIT_REPO=1)

- Kit `package.json` `files` continue to omit `standalone/`; do not add standalone to kit workspaces.
- No kit `cli.json`; no plugin-local `its-magic-auto/tui.json`; no `auto.md` restore.
- `template/` mirrors command/docs policy only when sprint/execute explicitly requires — not in this architecture phase.

## Isolation evidence (US-0048 / DEC-0029)

- `phase_id=architecture`, `role=tech-lead`, `story_id=US-0146`, `sprint_id=none` (S0153 expected at sprint-plan)
- `delivery_mode=ultra_lean`, `macro_phase=plan`
- `model_id=inherit` (CROSS_MODEL_REVIEW=0)
- `fresh_context_marker=tl-US0146-architecture-20260917T185000Z-fresh`, `timestamp=2026-09-17T18:50:00Z` (UTC)
- `evidence_ref=docs/engineering/research.md ## R-0143; docs/product/backlog.md ## US-0146; docs/engineering/architecture.md (this # US-0146); decisions/DEC-0146.md; docs/engineering/decisions.md; handoffs/resume_brief.md; handoffs/po_to_tl.md`
- Fresh tech-lead subagent per BUG-0006; narrow-read only. No `.env`. US-0140..US-0144 DONE compose-only not reopened. US-0145/US-0147/US-0148 OUT. BUG-* not mutated. No `/sprint-plan` spawn from this subagent.

## Strict runtime proof (mirror)

- `runtime_proof_id=rp-auto-20260917-us0146-architecture-techlead-20260917T185000Z-US-0146`
- Canonical hashed payload (DEC-0038, `compute_strict_proof_hash` positional): `{"orchestrator_run_id":"auto-20260917-us0146","phase_id":"architecture","proof_issued_at":"2026-09-17T18:50:00Z","proof_ttl_seconds":3600,"role":"tech-lead","runtime_proof_id":"rp-auto-20260917-us0146-architecture-techlead-20260917T185000Z-US-0146"}`
- Isolation extras (not hashed): `delivery_mode=ultra_lean`, `macro_phase=plan`, `model_id=inherit`, `sprint_id=none`, `story_id=US-0146`
- `proof_hash=5CD3C53F4B194541E3182C1DC53FE3D0C83FE3BEF986B10B509F922E5ED829F1`
- `proof_ttl=2026-09-17T19:50:00Z`
- `hash_recompute_confirmation=true` (compute_strict_proof_hash → 5CD3C53F4B194541E3182C1DC53FE3D0C83FE3BEF986B10B509F922E5ED829F1; independently MATCH; **64 hex** verified)
- Consumed research proof: `rp-auto-20260917-us0146-research-techlead-20260917T184200Z-US-0146` / `75561131E844072FCD975F9A74C3831DF311E87074406C21B014EA42A69ACEDA` — RUNTIME_PROOF_VALID MATCH before TTL `2026-09-17T19:42:00Z` (consumed_at `2026-09-17T18:50:00Z`; not STALE)

