# PO to TL archive pack (2026-09-18)

- Rollover trigger: `PO_TO_TL_HOT_MAX_LINES=650, PO_TO_TL_HOT_MAX_SECTIONS=60`
- Source: `handoffs/po_to_tl.md`
- Archived units (oldest first, contiguous prefix): 1
- Retained units in hot file: 14
- First archived heading: `## Discovery handoff — US-0146 CLI, TUI, and operational observability`
- Last archived heading: `## Discovery handoff — US-0146 CLI, TUI, and operational observability`
- Verification tuple (mandatory):
  - archived_body_lines=66
  - retained_body_lines=632

---

## Discovery handoff — US-0146 CLI, TUI, and operational observability

- **Phase completed**: discovery. **Role**: po. **Story**: US-0146 only. **Sprint**: (pending — expected S0153 at `/sprint-plan`). **Verdict**: PASS (`decision_gate=false`).
- **Timestamp (UTC)**: 2026-09-17T18:36:26Z. **Fresh marker**: `po-US0146-discovery-20260917T183210Z-fresh`.
- **Orchestrator**: `orchestrator_run_id=auto-20260917-us0146`, parent=`auto-20260913-us0144`, `delivery_mode=ultra_lean`, resolved_phase_plan=`[spec, plan, build+verify, ship]`, reinstatement_mode=`none`, memory_layer=`pack`, macro=`spec` (intake already DONE — not re-intaken; `handoffs/intake_evidence/US-0133-0148-intake-20260911.json` held, not mutated), `model_id=inherit` (MODEL_RESOLVE=alias_only; CROSS_MODEL_REVIEW=0), AUTO_QUIET=1, AUTO_FLOW_MODE=full_autonomy, AUTO_SOVEREIGN=0, FRAMEWORK_KIT_REPO=1, EARLY_RESEARCH=0, drain story 1 of 3 (`backlog_drain_stories_remaining_budget=2`; AUTO_BACKLOG_MAX_STORIES=3). Selection: AUTO_STORY_SELECTION=`priority_then_backlog_order` chose **US-0146** (OPEN P0). US-0147 next P0. US-0145/US-0148 P1 OUT of this segment.
- **Sibling boundary**: **US-0140..US-0144 DONE** — compose only; do not reopen. **US-0145 / US-0147 / US-0148 OPEN** — OUT OF SCOPE (do not mutate bodies). **BUG-0021 DONE / BUG-0023 DONE** OpenCode TUI listing — do not reopen. **BUG-0022 OPEN** — do not drain. Do not restore `.opencode/commands/auto.md`. Do not ship kit `cli.json` or plugin-local `its-magic-auto/tui.json`.
- **Gap confirmed (narrow-read)**: `@its-magic/cli` is a Phase-0 stub (`auth`/`models` only). No `standalone/apps/tui`. Kit `bin/its-magic.js` is installer CLI, not `itsm`. Cursor `/auto` is host scheduling-only. Runtime services (CommandRouter, AppRuntime, BrowserUAT, index, sovereign operator-visible results, US-0080 token-cost) exist to consume.

### Discovery locks D1–D10

| ID | Lock |
|----|------|
| **D1** | Sibling `@its-magic/cli` (`standalone/apps/cli`, complete the stub) + new `@its-magic/tui` (`standalone/apps/tui`) consume runtime services. **No Pi** on new command paths (US-0135 auth adapter compose only). **Do not** nest CLI/TUI in `@its-magic/runtime-core`. **Do not** rewrite WorkflowEngine / CommandRouter / GateEngine. Observability package vs compose-in-clients = architecture DQ (prefer compose US-0080 + runtime status APIs). |
| **D2** | Command set vs AC-1: `itsm` interactive + direct `auto`, `intake`, `ask`, `status`, `resume`, `models`, `auth`, `index`, `app`, `browser` plus US-0140 `PROGRAMMATIC_COMMANDS` slash equivalents and US-0143 `/auto`/`/quick`. Compose US-0135 `dispatchItsmCommand` for `auth`/`models`. Kit installer bin stays US-0147. |
| **D3** | Status (AC-2) presents project, work item, sprint, phase, role, model, backend, app health, index, browser, token, and cost. Compose US-0141 / US-0142 / US-0139 / US-0080 / US-0144 read-only. |
| **D4** | Chronological run timeline (AC-3) shows phase/rework transitions, PASS/FAIL/stop reasons, session isolation, and evidence links. Client of runtime/repo evidence — does not own workflow. |
| **D5** | TUI is **client-only** and replaceable (AC-4): conversation, phase, timeline, tool, changed-file, app/log, browser-evidence, model/cost panels. No workflow logic. No graphical IDE/web/mobile in v1. |
| **D6** | Metrics (AC-5) compose US-0080 token/cache/cost — no conflicting accounting — plus phase duration, tool calls, index latency, files, tests, browser probes, retries, context-pack size. |
| **D7** | Approval and failure prompts are actionable, accessible, and usable in interactive and non-interactive terminals on **Windows and Linux** (AC-6). |
| **D8** | Large logs/event streams stay responsive via bounded summaries + evidence refs (AC-7). AC-8 reconnect is local client re-attach to a running runtime, **not** the US-0148 daemon protocol. |
| **D9** | Tests `test_us0146_*` cover command parity, cancellation, local reconnect, status accuracy, and narrow-terminal behavior. Kit `files` omit `standalone/` unless architecture later proves otherwise. |
| **D10** | OUT: US-0145 parallel/deploy; US-0147 install/migration; US-0148 daemon/protocol; graphical clients; restore `.opencode/commands/auto.md`; kit `cli.json`; plugin-local `its-magic-auto/tui.json`; npm-publish; git push; `.env`. Research stub **R-0143** (PO does not author `## R-0143`; **R-0142**=US-0144 — do not wipe). Companion **DEC-0146** + `# US-0146` at `/architecture` only. Expected sprint **S0153**. |

### Research questions DQ1–DQ10 (for `/research` → expect **R-0143**; stub only here)

1. **DQ1**: Package layout — complete `@its-magic/cli` + add `@its-magic/tui` as sibling apps vs nested clients in runtime-core. D-lock prefers sibling apps consuming services; no Pi on new paths; architecture confirms whether CLI keeps the US-0135 `pi-kernel` AuthRuntimeAdapter import.
2. **DQ2**: Command routing — how CLI/TUI invoke US-0140 `PROGRAMMATIC_COMMANDS` and US-0143 `/auto`/`/quick` without rewriting CommandRouter / WorkflowEngine. Slash-equivalent mapping vs AC-1 names (`status`, `resume`, `index`, `app`, `browser`).
3. **DQ3**: Status aggregation — compose US-0141 AppRuntime health, US-0142 browser, US-0139 index, US-0080 tokens/cost, US-0144 caps/progress into one AC-2 surface without dual-write accounting.
4. **DQ4**: Timeline source of truth — runtime SQLite ops store vs repository evidence vs both; evidence-link format; rework numbering.
5. **DQ5**: TUI stack — Pi TUI primitives vs owned replaceable client; panel contract; no workflow ownership; narrow-terminal behavior.
6. **DQ6**: Metrics — consume US-0080 `token_cost` evidence vs new counters; conflict-avoidance; which fields live in CLI vs existing `handoffs/token_cost_runs/`.
7. **DQ7**: Approval/failure UX — interactive vs non-interactive; Windows vs Linux terminals; accessibility; mapping to existing stop-matrix / decision-gate prompts.
8. **DQ8**: Bounded log/stream summaries — reuse US-0141 log-ring summarization vs CLI-owned caps; evidence-ref pointers.
9. **DQ9**: Local reconnect / cancellation — in-process attach vs US-0148 daemon; cancel maps to existing stop-matrix; test doubles for AC-8 reconnect without shipping protocol.
10. **DQ10**: Tests — `test_us0146_*` covering AC-1..AC-8. Kit `files` omit `standalone/` unless architecture proves otherwise. **R-id live-inventory**: allocate **R-0143**; do not wipe R-0142 (US-0144).

### Design refs

- `docs/product/standalone-its-magic-pi-masterplan.md` §§28, 29.1–29.2, 32 Phase 8, 37 (DoD 10/12)
- Compose: US-0140 / DEC-0140 command names; US-0143 / DEC-0143 `/auto`/`/quick`; US-0141 / DEC-0141 app health; US-0142 / DEC-0142 browser evidence; US-0144 / DEC-0144 operator-visible caps (CLI/TUI was DQ9 OUT); US-0135 auth/models; US-0139 index; US-0080 / DEC-0062 token-cost; BUG-0006 / DEC-0051 spawn-only; BUG-0021/BUG-0023 DONE OpenCode TUI (do not reopen)
- Market: local operator CLIs (Claude Code / Aider / OpenCode TUI) as **inspiration only** — this story owns a standalone `itsm` client, not host restore
- Intake (read-only): `handoffs/intake_evidence/US-0133-0148-intake-20260911.json` (`cli-tui-observability` → US-0146)

### Research stub (PO does not author `docs/engineering/research.md`)

- **Expected next R-id**: **R-0143** (`ID_NAMESPACE_BOOTSTRAP=0`; highest existing heading is **R-0142** US-0144).
- Do **not** author `## R-0143` this phase. Do **not** wipe R-0142 (US-0144). Do **not** reuse R-0142.
- Companion **DEC-0146** + `# US-0146` at `/architecture` only — PO does not author them.
- Expected sprint **S0153** at `/sprint-plan` only (S0152 = US-0144 released — do not reuse).

### Runtime proof (DEC-0038)

- `runtime_proof_id=rp-auto-20260917-us0146-discovery-po-20260917T183626Z-US-0146`
- `proof_hash=EF26D4E4E08FB368A8E9B879D01901DBD5DC180D9D0EC2A9F5EAA44EEF04F859`
- `proof_ttl=2026-09-17T19:36:26Z`
- Hash via `from scripts.token_cost_lib import compute_strict_proof_hash` (positional; compact sorted-key JSON).
- Canonical hashed payload: `{"orchestrator_run_id":"auto-20260917-us0146","phase_id":"discovery","proof_issued_at":"2026-09-17T18:36:26Z","proof_ttl_seconds":3600,"role":"po","runtime_proof_id":"rp-auto-20260917-us0146-discovery-po-20260917T183626Z-US-0146"}`
- Isolation extras (not hashed): `delivery_mode=ultra_lean`, `macro_phase=spec`, `model_id=inherit`, `sprint_id=none`, `story_id=US-0146`, `skipped_phases=[intake]`, `CROSS_MODEL_REVIEW=0`, `native_chain_active=true`, `native_chain_continuing=true`
- `hash_recompute_confirmation=true` (compute_strict_proof_hash → ef26d4e4e08fb368a8e9b879d01901dbd5dc180d9d0ec2a9f5eaa44eef04f859; independently MATCH; **64 hex** verified; stored uppercase)

### Isolation + stop

- `phase_id=discovery`, `role=po`, `story_id=US-0146`, `model_id=inherit`, `fresh_context_marker=po-US0146-discovery-20260917T183210Z-fresh`
- `evidence_ref=docs/product/backlog.md ## US-0146 discovery_notes; docs/product/vision.md ## Discovery Notes — US-0146; this handoff; docs/engineering/state.md discovery checkpoint; handoffs/resume_brief.md; handoffs/intake_evidence/US-0133-0148-intake-20260911.json (read-only)`
- **Hot-surface note**: Appended (not prepended) so triad oldest-prefix rollover retains this newest section. Post-append `--check` STATE_ARCHIVE_REQUIRED `po_to_tl` 704/650 → `--rollover --json` `{"boundary":"triad-rollover|po_to_tl","moved":2,"pack_ref":"handoffs/archive/po-to-tl-pack-20260917.md","retained_lines":610,"retained_sections":12}` (archived `## Architecture handoff — BUG-0023` through `## Research handoff — US-0141`; archived_body_lines=94). State.md not rolled (1152/1200). `arch_linkage_guard.py` not run (architecture.md not touched). Architecture not rolled this phase. final `--check` PASS. Discovery handoff retained at true end of `po_to_tl.md`. **Status**: US-0146 remains **OPEN**. AC-1..AC-8 remain unchecked. Acceptance.md US-0146 row unchecked. **Next**: `/research` in fresh **tech-lead** subagent. CROSS_MODEL_REVIEW=0 — do not spawn sovereign-critic. Do not spawn research from this discovery chat. STOP.

