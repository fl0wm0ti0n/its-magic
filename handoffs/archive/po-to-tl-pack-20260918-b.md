# PO to TL archive pack (2026-09-18)

- Rollover trigger: `PO_TO_TL_HOT_MAX_LINES=650, PO_TO_TL_HOT_MAX_SECTIONS=60`
- Source: `handoffs/po_to_tl.md`
- Archived units (oldest first, contiguous prefix): 1
- Retained units in hot file: 14
- First archived heading: `## Research handoff — US-0146 CLI, TUI, and operational observability`
- Last archived heading: `## Research handoff — US-0146 CLI, TUI, and operational observability`
- Verification tuple (mandatory):
  - archived_body_lines=48
  - retained_body_lines=617

---

## Research handoff — US-0146 CLI, TUI, and operational observability

- **Phase completed**: research. **Role**: tech-lead. **Story**: US-0146 only. **Sprint**: (pending — expected S0153 at `/sprint-plan`). **Verdict**: PASS (`decision_gate=false`).
- **Timestamp (UTC)**: 2026-09-17T18:42:00Z. **Fresh marker**: `tl-US0146-research-20260917T184200Z-fresh`.
- **Orchestrator**: `orchestrator_run_id=auto-20260917-us0146`, parent=`auto-20260913-us0144`, `delivery_mode=ultra_lean`, resolved_phase_plan=`[spec, plan, build+verify, ship]`, macro=`plan` (research = first of research+architecture+sprint-plan), `model_id=inherit` (MODEL_RESOLVE=alias_only; CROSS_MODEL_REVIEW=0), AUTO_QUIET=1, AUTO_FLOW_MODE=full_autonomy, AUTO_SOVEREIGN=0, FRAMEWORK_KIT_REPO=1, EARLY_RESEARCH=0, drain story 1 of 3 (`backlog_drain_stories_remaining_budget=2`).
- **Sibling boundary**: **US-0140..US-0144 DONE** — compose only. **US-0145 / US-0147 / US-0148 OPEN** — OUT OF SCOPE. **BUG-0021 / BUG-0023 DONE** — do not reopen. Do not restore `.opencode/commands/auto.md`. Do not ship kit `cli.json` or plugin-local `its-magic-auto/tui.json`.
- **Research anchor**: `docs/engineering/research.md` **`## R-0143`**. Do not wipe **R-0142** (US-0144). Discovery D1–D10 unchanged on backlog.
- **Approach**: **A1 (A\*)** — sibling `@its-magic/cli` + new `@its-magic/tui` as thin clients; nested `runtime-core/src/operator/` facades (`OperatorCommandFacade`, `OperatorObservabilityService`); auth-only Pi via US-0135 `dispatchItsmCommand`; no WorkflowEngine/CommandRouter/GateEngine rewrite; v1 local in-process reconnect only (not US-0148).
- **Companion DEC**: **DEC-0146** at `/architecture` only — do **not** author/mutate `decisions/DEC-0146.md` this phase. Do **not** author `# US-0146`.

### Closed questions DQ1–DQ10

| DQ | Topic | Resolution | LOCK |
|----|-------|------------|------|
| DQ1 | Package layout | Sibling cli+tui apps; runtime-core `operator/` facades; Pi only on auth/models | LOCKED |
| DQ2 | Command routing | AC-1 vocabulary via facade → PROGRAMMATIC_COMMANDS + `/auto`/`/quick`; auth/models delegate | LOCKED |
| DQ3 | Status AC-2 | Read-only snapshot compose US-0141/0142/0139/0080/0144 + runs/repo pointers | LOCKED |
| DQ4 | Timeline AC-3 | RunsStore audit + repo evidence links; honest divergence | LOCKED |
| DQ5 | TUI AC-4 | Replaceable terminal client; typed panel DTOs; no workflow ownership | LOCKED |
| DQ6 | Metrics AC-5 | US-0080 authoritative; derived counters; no dual-write ledger | LOCKED |
| DQ7 | Approvals AC-6 | Shared OperatorPrompts; Win+Linux; non-interactive fail-closed | LOCKED |
| DQ8 | Logs AC-7 | Bounded summaries + evidence refs; backpressure on streams | LOCKED |
| DQ9 | Reconnect/cancel | In-process OperatorSession; existing stop-matrix cancel; not US-0148 | LOCKED |
| DQ10 | Tests + kit | 9 `test_us0146_*`; kit omit `standalone/`; **R-0143**; S0153 at sprint-plan | LOCKED |

### Architecture seeds (preview)

- `/architecture` authors `# US-0146` + **DEC-0146** Accepted; pins operator module paths, prompt flags, log caps, TUI stack choice.
- `/sprint-plan` materializes **S0153** (≤12 tasks from architecture seeds).
- Do not implement application code this phase.

### Runtime proof (DEC-0038)

- `runtime_proof_id=rp-auto-20260917-us0146-research-techlead-20260917T184200Z-US-0146`
- `proof_hash=75561131E844072FCD975F9A74C3831DF311E87074406C21B014EA42A69ACEDA`
- `proof_ttl=2026-09-17T19:42:00Z`
- Hash via `from scripts.token_cost_lib import compute_strict_proof_hash` (positional; compact sorted-key JSON).
- Canonical hashed payload: `{"orchestrator_run_id":"auto-20260917-us0146","phase_id":"research","proof_issued_at":"2026-09-17T18:42:00Z","proof_ttl_seconds":3600,"role":"tech-lead","runtime_proof_id":"rp-auto-20260917-us0146-research-techlead-20260917T184200Z-US-0146"}`
- Isolation extras (not hashed): `delivery_mode=ultra_lean`, `macro_phase=plan`, `model_id=inherit`, `sprint_id=none`, `story_id=US-0146`, `skipped_phases=[intake]`, `CROSS_MODEL_REVIEW=0`, `native_chain_active=true`, `native_chain_continuing=true`
- `hash_recompute_confirmation=true` (compute_strict_proof_hash → 75561131e844072fcd975f9a74c3831df311e87074406c21b014ea42a69aceda; independently MATCH; **64 hex** verified; stored uppercase)
- Consumed discovery producer proof: `rp-auto-20260917-us0146-discovery-po-20260917T183626Z-US-0146` / `EF26D4E4E08FB368A8E9B879D01901DBD5DC180D9D0EC2A9F5EAA44EEF04F859` — MATCH; not STALE at `2026-09-17T18:42:00Z`

### Isolation + stop

- `phase_id=research`, `role=tech-lead`, `story_id=US-0146`, `model_id=inherit`, `fresh_context_marker=tl-US0146-research-20260917T184200Z-fresh`
- `evidence_ref=docs/engineering/research.md ## R-0143; docs/product/backlog.md ## US-0146 discovery_notes; this handoff; docs/engineering/state.md research checkpoint; handoffs/resume_brief.md`
- **Status**: US-0146 remains **OPEN**. AC-1..AC-8 remain unchecked. **Next**: `/architecture` in fresh **tech-lead** subagent. CROSS_MODEL_REVIEW=0 — do not spawn sovereign-critic. Do not spawn architecture from this research chat. STOP.

