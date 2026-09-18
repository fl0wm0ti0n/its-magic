## Research handoff — US-0144 Sovereign memory, reviews, and convergence

- **Phase completed**: research. **Role**: tech-lead. **Story**: US-0144 only. **Sprint**: (S0152 exists OUT of research authorship; sprint-plan owns it). **Verdict**: PASS (`decision_gate=false`).
- **Timestamp (UTC)**: 2026-09-15T18:43:00Z. **Fresh marker**: `tl-US0144-research-20260915T184300Z-fresh`.
- **Orchestrator**: `orchestrator_run_id=auto-20260913-us0144`, parent=`auto-20260913-us0143`, `delivery_mode=ultra_lean`, resolved_phase_plan=`[spec, plan, build+verify, ship]`, macro=`plan` (research = first of research+architecture+sprint-plan), `model_id=cursor-grok-4.6-high` (CROSS_MODEL_REVIEW=1), AUTO_QUIET=1, FRAMEWORK_KIT_REPO=1, drain story 10 of 10.
- **Sibling boundary**: **US-0143 DONE** — compose RouteScheduled / drain / critic-hook slot only; do not reopen. **US-0133..US-0142 DONE** — compose only; do not reopen. **US-0145..US-0148 OPEN** — OUT OF SCOPE. **BUG-0021 DONE / BUG-0022 OPEN / BUG-0023 DONE / BUG-0024 OPEN** — do not mutate; do not drain bugs. Do not restore `.opencode/commands/auto.md`. Do not ship kit `cli.json` or plugin-local `its-magic-auto/tui.json`. Do not author or mutate DEC-0144 / `# US-0144` / `sprints/S0152/` this phase.
- **Research anchor**: `docs/engineering/research.md` **`## R-0142`** (DQ1–DQ10 LOCKED). Heading not duplicated. Attestation subsection appended only. Discovery D1–D10 not rewritten. Do not wipe **R-0141** (US-0143).
- **Approach**: Nested sovereign-runtime in `@its-magic/runtime-core` + typed `KernelBridge.runSovereignOperation()` composing existing Python libs. Reject general script runner, TS schema ports, sibling package, Pi, prompt-only critic content, US-0145/US-0146, GateEngine/US-0143 drain rewrite.
- **Companion DEC**: **DEC-0144** at `/architecture` only — do **not** author/mutate `decisions/DEC-0144.md` this phase. Do **not** author `# US-0144`.

### Closed questions DQ1–DQ10

| DQ | Topic | Resolution | LOCK |
|----|-------|------------|------|
| DQ1 | Package | Nested sovereign-runtime in `@its-magic/runtime-core` + typed KernelBridge; no sibling; no Pi | LOCKED |
| DQ2 | Lift critic slot | `scheduleSupplementaryHooks` only; preserve CommandRouter drain, `runAuto`/`runQuick`, `RELEASE_GATE_ORDER` | LOCKED |
| DQ3 | Ledger | Python 12-field ledger + append-only session sidecar; QA reads `plan_fidelity` + sidecar; no TS dual-write | LOCKED |
| DQ4 | Memory | `build_injection_digest_block` after phase context before role; never full store; default-off zero-I/O | LOCKED |
| DQ5 | Critic model | Bridge `critic_model` → `select_critic_model`; pinning; explicit degraded same-model | LOCKED |
| DQ6 | Role reviews | `list_obligations_for_phase` + `dispatch_role_review` as supplementary sessions; never replace producer | LOCKED |
| DQ7 | Deferrals | `deferral_append`/`deferral_list` + exclusive `gateDrainCandidate`; `SOVEREIGN_DRAIN_AUTO_ACCEPT=0` | LOCKED |
| DQ8 | Convergence | Consume `evaluate_convergence`; blocking-only critic conjunct; smoke never fake browser PASS | LOCKED |
| DQ9 | Operator-visible | Runtime results/artifacts (`goal_progress`, caps, partial-delivery); CLI/TUI is US-0146 | LOCKED |
| DQ10 | Tests + kit + R-id | 12 `test_us0144_*`; kit `files` omit `standalone/`; **R-0142**; R-0141 held | LOCKED |

### Architecture seeds

- `/architecture` may attest existing `# US-0144` and **DEC-0144** (already on disk; research did not author them). `/sprint-plan` owns S0152.
- Seeds remain architecture-owned (expect T-anch + T-001.. covering the 12 tests; ≤ SPRINT_MAX_TASKS=12).
- Do not implement application code this phase. Do not restore `auto.md`. Do not reopen US-0143. Do not mutate US-0145+ / BUG-*.

### Runtime proof (DEC-0038)

- `runtime_proof_id=rp-auto-20260913-us0144-research-techlead-20260915T184300Z-US-0144`
- `proof_hash=60382EB2AA2C27583B31E6BF2672660A6B52D2A0C78B40545CD1541239C0E71F`
- `proof_ttl=2026-09-15T19:43:00Z`
- Hash via `from scripts.token_cost_lib import compute_strict_proof_hash` (positional; compact sorted-key JSON).
- Canonical hashed payload: `{"orchestrator_run_id":"auto-20260913-us0144","phase_id":"research","proof_issued_at":"2026-09-15T18:43:00Z","proof_ttl_seconds":3600,"role":"tech-lead","runtime_proof_id":"rp-auto-20260913-us0144-research-techlead-20260915T184300Z-US-0144"}`
- Isolation extras (not hashed): `delivery_mode=ultra_lean`, `macro_phase=plan`, `model_id=cursor-grok-4.6-high`, `sprint_id=none`, `story_id=US-0144`, `skipped_phases=[intake]`, `native_chain_active=true`, `native_chain_continuing=true`
- `hash_recompute_confirmation=true` (compute_strict_proof_hash → 60382eb2aa2c27583b31e6bf2672660a6b52d2a0c78b40545cd1541239c0e71f; independently MATCH; **64 hex** verified; stored uppercase)
- Consumed discovery producer proof: `rp-auto-20260913-us0144-discovery-po-20260915T183419Z-US-0144` / `560B4D3028D921EA85B9893CC2D378D74B7F6FA3DA35A2F74A60A334448CBBBC` — RUNTIME_PROOF_VALID (MATCH before TTL `2026-09-15T19:34:19Z`; consumed_at `2026-09-15T18:43:00Z`; independent recompute MATCH)
- Consumed discovery critic proof: `rp-auto-20260913-us0144-sovereign-critic-techlead-20260915T183700Z-US-0144` / `8FBC3E6CA685876B732A307F584BDB8DFFB9B32185E8E8CBAA73BF0A6677A9CE` — RUNTIME_PROOF_VALID (MATCH before TTL `2026-09-15T19:37:00Z`; consumed_at `2026-09-15T18:43:00Z`; independent recompute MATCH)

### Isolation + stop

- `phase_id=research`, `role=tech-lead`, `story_id=US-0144`, `model_id=cursor-grok-4.6-high`, `fresh_context_marker=tl-US0144-research-20260915T184300Z-fresh`
- `evidence_ref=docs/engineering/research.md ## R-0142; docs/product/backlog.md ## US-0144; docs/product/vision.md ## Discovery Notes — US-0144; this handoff; docs/engineering/state.md research checkpoint; handoffs/resume_brief.md`
- **Hot-surface note**: Appended (not prepended) so triad oldest-prefix rollover retains this newest section. Post-append `--rollover --json` `{"boundary":"triad-rollover|state","moved":2,"pack_ref":"docs/engineering/state-archive/state-pack-20260915-b.md","retained_checkpoints":10,"retained_lines":1135}` + `{"boundary":"triad-rollover|po_to_tl","moved":1,"pack_ref":"handoffs/archive/po-to-tl-pack-20260915.md","retained_lines":637,"retained_sections":13}`. `arch_linkage_guard.py` not run (architecture.md not touched). Architecture not rolled this phase.
- **Status**: US-0144 remains **OPEN**. AC-1..AC-8 remain unchecked. **Next**: orchestrator sovereign-critic of research, then `/architecture` in fresh **tech-lead** subagent. Do not spawn critic or architecture from this research chat. STOP.

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

## Architecture handoff — US-0146 CLI, TUI, and operational observability

- **Phase completed**: architecture. **Role**: tech-lead. **Story**: US-0146 only. **Sprint**: (pending — expected S0153 at `/sprint-plan`). **Verdict**: PASS (`decision_gate=false`).
- **Timestamp (UTC)**: 2026-09-17T18:50:00Z. **Fresh marker**: `tl-US0146-architecture-20260917T185000Z-fresh`.
- **Orchestrator**: `orchestrator_run_id=auto-20260917-us0146`, parent=`auto-20260913-us0144`, `delivery_mode=ultra_lean`, resolved_phase_plan=`[spec, plan, build+verify, ship]`, macro=`plan`, `model_id=inherit` (CROSS_MODEL_REVIEW=0), AUTO_QUIET=1, AUTO_FLOW_MODE=full_autonomy, AUTO_SOVEREIGN=0, FRAMEWORK_KIT_REPO=1, drain story 1 of 3 (`backlog_drain_stories_remaining_budget=2`).
- **Sibling boundary**: **US-0140..US-0144 DONE** — compose only. **US-0145 / US-0147 / US-0148 OPEN** — OUT OF SCOPE. **BUG-*** compose only; do not drain BUG-0022. Do not restore `.opencode/commands/auto.md`. No kit `cli.json` or plugin `its-magic-auto/tui.json`.
- **Research consumed**: `docs/engineering/research.md` **`## R-0143`** (A1; DQ1–DQ10 LOCKED). Producer proof `rp-auto-20260917-us0146-research-techlead-20260917T184200Z-US-0146` / `75561131E844072FCD975F9A74C3831DF311E87074406C21B014EA42A69ACEDA` — MATCH; not STALE at consume.
- **Approach**: **A1 (A\*)** Accepted in **`DEC-0146`** + H1 **`# US-0146`**. Sibling cli+tui; `runtime-core/src/operator/` facades; auth-only Pi; in-process `OperatorSession`; log cap 200 lines / 32 KiB; TUI **readline + ANSI**.
- **Tests (architecture-owned)**: nine `test_us0146_*` IDs in `DEC-0146` and `# US-0146` Test contract.
- **Next**: `/sprint-plan` materializes **S0153** (fresh tech-lead). Do **not** spawn sprint-plan from this architecture chat. CROSS_MODEL_REVIEW=0 — no sovereign-critic.

### Runtime proof (DEC-0038)

- `runtime_proof_id=rp-auto-20260917-us0146-architecture-techlead-20260917T185000Z-US-0146`
- `proof_hash=5CD3C53F4B194541E3182C1DC53FE3D0C83FE3BEF986B10B509F922E5ED829F1`
- `proof_ttl=2026-09-17T19:50:00Z`
- Canonical hashed payload: `{"orchestrator_run_id":"auto-20260917-us0146","phase_id":"architecture","proof_issued_at":"2026-09-17T18:50:00Z","proof_ttl_seconds":3600,"role":"tech-lead","runtime_proof_id":"rp-auto-20260917-us0146-architecture-techlead-20260917T185000Z-US-0146"}`
- Consumed research producer proof: `rp-auto-20260917-us0146-research-techlead-20260917T184200Z-US-0146` / `75561131E844072FCD975F9A74C3831DF311E87074406C21B014EA42A69ACEDA` — MATCH; not STALE at `2026-09-17T18:50:00Z`

### Isolation + stop

- `phase_id=architecture`, `role=tech-lead`, `story_id=US-0146`, `model_id=inherit`, `fresh_context_marker=tl-US0146-architecture-20260917T185000Z-fresh`
- `evidence_ref=docs/engineering/architecture.md # US-0146; decisions/DEC-0146.md; docs/engineering/research.md ## R-0143; docs/engineering/state.md architecture checkpoint; handoffs/resume_brief.md`
- **Hot-surface note**: Appended architecture handoff at true end. `arch_linkage_guard.py` --pre/--post around `# US-0146` append. `--rollover --json` archived `architecture-pack-20260917.md` (moved=1; retained_story_sections=21; `# US-0146` at hot end) + state `state-pack-20260917-b.md`. `--check-arch-heading-policy --baseline-h2-count 0` PASS. final `--check` PASS.
- **Status**: US-0146 remains **OPEN**. AC-1..AC-8 remain unchecked. **Next**: `/sprint-plan` in fresh **tech-lead** subagent. STOP.

## Discovery handoff — US-0147 Installation, update, and existing-project adoption

- **Phase completed**: discovery. **Role**: po. **Story**: US-0147 only. **Sprint**: (pending — expected S0154 at `/sprint-plan`). **Verdict**: PASS (`decision_gate=false`).
- **Timestamp (UTC)**: 2026-09-17T20:26:30Z. **Fresh marker**: `po-US0147-discovery-20260917T202630Z-fresh`.
- **Orchestrator**: `orchestrator_run_id=auto-20260917-us0146`, parent=`auto-20260913-us0144`, `delivery_mode=ultra_lean`, resolved_phase_plan=`[spec, plan, build+verify, ship]`, reinstatement_mode=`none`, memory_layer=`pack`, macro=`spec` (intake already DONE — not re-intaken; `handoffs/intake_evidence/US-0133-0148-intake-20260911.json` held, not mutated), `model_id=inherit` (MODEL_RESOLVE=alias_only; CROSS_MODEL_REVIEW=0), AUTO_QUIET=1, AUTO_FLOW_MODE=full_autonomy, AUTO_SOVEREIGN=0, FRAMEWORK_KIT_REPO=1, EARLY_RESEARCH=0, drain story **2 of 3** (`backlog_drain_stories_remaining_budget=1`; AUTO_BACKLOG_MAX_STORIES=3). Selection: US-0146 **DONE** / S0153 released → **US-0147** (OPEN P0). US-0145/US-0148 P1 OUT of this segment.
- **Sibling boundary**: **US-0140..US-0146 DONE** — compose only (US-0146 `itsm`/CLI/TUI wiring IN); do not reopen. **US-0145 / US-0148 OPEN** — OUT OF SCOPE (do not mutate bodies). **BUG-0022 OPEN** — do not drain. Do not build new Cursor/OpenCode adapters. Do not npm-publish, git push, or read `.env`.
- **Gap confirmed (narrow-read)**: Kit installers still template-focused; standalone operator surface exists in-repo (US-0146) but lacks unified product install/update/adoption path with pinned runtime deps, browser prerequisites, kernel-contract metadata, and non-destructive existing-repo detection.

### Discovery locks D1–D10

| ID | Lock |
|----|------|
| **D1** | Extend triple-installer parity + `installer-owned-paths.manifest` (compose US-0008/US-0018) to bootstrap/wire standalone **`itsm`** + runtime from `standalone/`. Installers remain copy/bootstrap orchestrators — **do not** rewrite `.cursor/` or `.opencode/` host trees. |
| **D2** | AC-1 Win/Linux install/update installs CLI/runtime, pinned standalone deps (kernel-contract + US-0134 compose), browser prerequisites (Playwright = architecture DQ), kernel compatibility metadata, rollback guidance. |
| **D3** | AC-2 fresh projects initialize required artifact structures via `template/` — **no** US-0001..US-0132 backlog clone (masterplan §33). |
| **D4** | AC-3 detect/adopt existing its-magic repos (`.its-magic-version`, canonical trees) without rewriting canonical artifacts; scratchpad migration **not** required at first adopt (§13.2 timing → architecture). |
| **D5** | AC-4 Cursor/OpenCode remain compatibility paths; standalone does not require either host; **no** new host adapter work (story boundary). |
| **D6** | AC-5 preservation — never overwrite/copy local config, credentials, browser profiles, project source, or user artifacts into tracked templates (compose US-0018 user-data vs framework split). |
| **D7** | AC-6 compatibility diagnostics: kernel/runtime mismatch, unavailable host capabilities, migration actions, safe rollback — reason codes architecture-locked (US-0134 handshake compose). |
| **D8** | AC-7 operator docs in `docs/engineering/runbook.md` + `template/` parity: fresh setup, auth (US-0135), adoption, coexistence (§3), update, uninstall, troubleshooting. |
| **D9** | AC-8 lifecycle tests `test_us0147_*`: fresh install, upgrade, Cursor-only/OpenCode-only/both adoption, interrupted update, preservation, uninstall on Win/Linux; installer parity tests compose US-0055. |
| **D10** | OUT: US-0145 parallel/deploy; US-0148 daemon/protocol; **new** Cursor/OpenCode adapters; npm-publish; git push; `.env`. Research stub **R-0144** (PO does not author `## R-0144`; **R-0143**=US-0146 — do not wipe). Companion **DEC-0147** + `# US-0147` at `/architecture` only. Expected sprint **S0154**. |

### Research questions DQ1–DQ10 (for `/research` → expect **R-0144**; stub only here)

1. **DQ1**: Standalone packaging — how `standalone/` workspace artifacts (`itsm` bin, pinned Pi/kernel-bridge) ship via kit `files` vs post-install build vs prebuilt bundle; FRAMEWORK_KIT_REPO constraints.
2. **DQ2**: Installer extension vs sibling script — what changes in `installer.ps1`/`installer.sh`/`installer.py` vs new `standalone` install entrypoint; triple parity bar.
3. **DQ3**: Adoption detector — signals for existing Cursor-only, OpenCode-only, both-host repos; fail-closed vs advisory modes.
4. **DQ4**: Fresh init template set — minimal artifact skeleton without historical backlog; relationship to `template/` and US-0133 bootstrap stories.
5. **DQ5**: Preservation matrix — authoritative framework-owned vs user-owned paths; upgrade mode interaction with US-0018; interrupted update recovery.
6. **DQ6**: Kernel/runtime compatibility — `kernel-contract.json` delivery, version handshake, mismatch diagnostics (compose US-0134).
7. **DQ7**: Browser prerequisites — Playwright install strategy Win/Linux; offline/airgap posture; rollback when browser setup fails.
8. **DQ8**: Scratchpad/config coexistence — §13.2 `LegacyScratchpadAdapter` scope for v1 install story vs defer; migration diagnostics without forced rewrite.
9. **DQ9**: Uninstall + rollback — what is removed vs preserved; coexistence with host-installed kit versions.
10. **DQ10**: Tests — `test_us0147_*` matrix covering AC-1..AC-8; CI harness for installer lifecycle. **R-id live-inventory**: allocate **R-0144**; do not wipe **R-0143** (US-0146).

### Design refs

- `docs/product/standalone-its-magic-pi-masterplan.md` §3, §13.2, §32 Phase 8, §37, §39, §43
- Compose: US-0146 **DONE** (`standalone/apps/cli`, `tui`, operator facades); US-0134 kernel-bridge handshake; US-0135 auth; US-0008/US-0018 installers; US-0055 installer QA patterns; `its_magic/kernel-contract.json`
- Intake (read-only): `handoffs/intake_evidence/US-0133-0148-intake-20260911.json` (`standalone-installation-migration` → US-0147)

### Research stub (PO does not author `docs/engineering/research.md`)

- **Expected next R-id**: **R-0144** (`ID_NAMESPACE_BOOTSTRAP=0`; highest existing heading is **R-0143** US-0146).
- Do **not** author `## R-0144` this phase. Do **not** wipe **R-0143**. Do **not** reuse R-0143 for US-0147 body.
- Companion **DEC-0147** + `# US-0147` at `/architecture` only — PO does not author them.
- Expected sprint **S0154** at `/sprint-plan` only (S0153 = US-0146 released — do not reuse).

### Runtime proof (DEC-0038)

- `runtime_proof_id=rp-auto-20260917-us0146-discovery-po-20260917T202630Z-US-0147`
- `proof_hash=E4BFB3F6E8C862AB6870B31EE226FE09254916918EE3638977AE05C0070BDA91`
- `proof_ttl=2026-09-17T21:26:30Z`
- Hash via `from scripts.token_cost_lib import compute_strict_proof_hash` (positional; compact sorted-key JSON).
- Canonical hashed payload: `{"orchestrator_run_id":"auto-20260917-us0146","phase_id":"discovery","proof_issued_at":"2026-09-17T20:26:30Z","proof_ttl_seconds":3600,"role":"po","runtime_proof_id":"rp-auto-20260917-us0146-discovery-po-20260917T202630Z-US-0147"}`
- Isolation extras (not hashed): `delivery_mode=ultra_lean`, `macro_phase=spec`, `model_id=inherit`, `sprint_id=none`, `story_id=US-0147`, `skipped_phases=[intake]`, `CROSS_MODEL_REVIEW=0`, `native_chain_active=true`, `native_chain_continuing=true`, `drain_story_index=2 of 3`
- `hash_recompute_confirmation=true` (compute_strict_proof_hash → e4bfb3f6e8c862ab6870b31ee226fe09254916918ee3638977ae05c0070bda91; independently MATCH; **64 hex** verified; stored uppercase)

### Isolation + stop

- `phase_id=discovery`, `role=po`, `story_id=US-0147`, `model_id=inherit`, `fresh_context_marker=po-US0147-discovery-20260917T202630Z-fresh`
- `evidence_ref=docs/product/backlog.md ## US-0147 discovery_notes; docs/product/vision.md ## Discovery Notes — US-0147; this handoff; docs/engineering/state.md discovery checkpoint; handoffs/resume_brief.md; handoffs/intake_evidence/US-0133-0148-intake-20260911.json (read-only)`
- **Hot-surface note**: Appended at true end. Post-append `--check` STATE_ARCHIVE_REQUIRED po_to_tl 706/650 → `--rollover --json` archived to `handoffs/archive/po-to-tl-pack-20260917-b.md` (moved=1; retained_lines=639). State pre-rollover `state-pack-20260917-j.md`. `arch_linkage_guard.py` not run. final `--check` PASS.
- **Status**: US-0147 remains **OPEN**. AC-1..AC-8 remain unchecked. Acceptance.md US-0147 row unchecked. **Next**: `/research` in fresh **tech-lead** subagent. CROSS_MODEL_REVIEW=0 — do not spawn sovereign-critic. Do not spawn research from this discovery chat. STOP.

## Research handoff — US-0147 Installation, update, and existing-project adoption

- **Phase completed**: research. **Role**: tech-lead. **Story**: US-0147 only. **Sprint**: (pending — expected S0154 at `/sprint-plan`). **Verdict**: PASS (`decision_gate=false`).
- **Timestamp (UTC)**: 2026-09-17T20:30:00Z. **Fresh marker**: `tl-US0147-research-20260917T203000Z-fresh`.
- **Orchestrator**: `orchestrator_run_id=auto-20260917-us0146`, parent=`auto-20260913-us0144`, `delivery_mode=ultra_lean`, resolved_phase_plan=`[spec, plan, build+verify, ship]`, macro=`plan` (research = first of research+architecture+sprint-plan), `model_id=inherit` (MODEL_RESOLVE=alias_only; CROSS_MODEL_REVIEW=0), AUTO_QUIET=1, AUTO_FLOW_MODE=full_autonomy, AUTO_SOVEREIGN=0, FRAMEWORK_KIT_REPO=1, EARLY_RESEARCH=0, drain story **2 of 3** (`backlog_drain_stories_remaining_budget=1`).
- **Sibling boundary**: **US-0140..US-0146 DONE** — compose only (US-0146 install wiring IN). **US-0145 / US-0148 OPEN** — OUT OF SCOPE. **BUG-0022 OPEN** — do not drain. Do not build new Cursor/OpenCode adapters. No npm-publish, git push, or `.env` reads.
- **Research anchor**: `docs/engineering/research.md` **`## R-0144`**. Do not wipe **R-0143** (US-0146 delivered). Discovery D1–D10 unchanged on backlog.
- **Approach**: **A1 (A\*)** — triple-installer + manifest extension; template-mirrored `.its-magic/standalone/` workspace; `bootstrap_standalone_runtime_installer_hook`; `itsm` shim; kernel-bridge preflight + `runtime-metadata.json`; explicit `itsm setup browser`; adoption classifier compose US-0134 locate; no host tree rewrite.
- **Companion DEC**: **DEC-0147** at `/architecture` only — do **not** author/mutate `decisions/DEC-0147.md` this phase. Do **not** author `# US-0147`.

### Closed questions DQ1–DQ10

| DQ | Topic | Resolution | LOCK |
|----|-------|------------|------|
| DQ1 | Standalone packaging | Template mirror + `.its-magic/standalone/`; kit `files` omit root standalone | LOCKED |
| DQ2 | Installer extension | `installer.py` hook + PS1/sh parity; repair via upgrade bootstrap | LOCKED |
| DQ3 | Adoption detector | Three-marker locate + host profiles; fail-closed partial markers | LOCKED |
| DQ4 | Fresh init | Template skeleton; no US-0001..0132 backlog clone | LOCKED |
| DQ5 | Preservation | Manifest refresh vs deny_overwrite; staged rollback | LOCKED |
| DQ6 | Kernel compatibility | Preflight handshake + metadata file | LOCKED |
| DQ7 | Browser prereq | Explicit `itsm setup browser`; no silent CI download | LOCKED |
| DQ8 | Scratchpad coexistence | No forced migration v1; WARN only | LOCKED |
| DQ9 | Uninstall | Remove standalone tree/shims; preserve hosts + user layers | LOCKED |
| DQ10 | Tests + kit | 10 `test_us0147_*`; **R-0144**; S0154 at sprint-plan | LOCKED |

### Architecture seeds (preview)

- `/architecture` authors `# US-0147` + **DEC-0147** Accepted; pins manifest paths, hook order, shim locations, reason codes.
- `/sprint-plan` materializes **S0154** (≤12 tasks from architecture seeds).
- Do not implement application code this phase.

### Runtime proof (DEC-0038)

- `runtime_proof_id=rp-auto-20260917-us0146-research-techlead-20260917T203000Z-US-0147`
- `proof_hash=96C81771F5CE812898410E6F551A0C209475E9F31696EA13B07E7CDB1FC39237`
- `proof_ttl=2026-09-17T21:30:00Z`
- Hash via `from scripts.token_cost_lib import compute_strict_proof_hash` (positional; compact sorted-key JSON).
- Canonical hashed payload: `{"orchestrator_run_id":"auto-20260917-us0146","phase_id":"research","proof_issued_at":"2026-09-17T20:30:00Z","proof_ttl_seconds":3600,"role":"tech-lead","runtime_proof_id":"rp-auto-20260917-us0146-research-techlead-20260917T203000Z-US-0147"}`
- Isolation extras (not hashed): `delivery_mode=ultra_lean`, `macro_phase=plan`, `model_id=inherit`, `sprint_id=none`, `story_id=US-0147`, `skipped_phases=[intake]`, `CROSS_MODEL_REVIEW=0`, `native_chain_active=true`, `native_chain_continuing=true`, `drain_story_index=2 of 3`
- `hash_recompute_confirmation=true` (compute_strict_proof_hash → 96c81771f5ce812898410e6f551a0c209475e9f31696ea13b07e7cdb1fc39237; independently MATCH; **64 hex** verified; stored uppercase)
- Consumed discovery producer proof: `rp-auto-20260917-us0146-discovery-po-20260917T202630Z-US-0147` / `E4BFB3F6E8C862AB6870B31EE226FE09254916918EE3638977AE05C0070BDA91` — MATCH; not STALE at `2026-09-17T20:30:00Z`

### Isolation + stop

- `phase_id=research`, `role=tech-lead`, `story_id=US-0147`, `model_id=inherit`, `fresh_context_marker=tl-US0147-research-20260917T203000Z-fresh`
- `evidence_ref=docs/engineering/research.md ## R-0144; docs/engineering/state.md research checkpoint; handoffs/resume_brief.md; docs/product/backlog.md ## US-0147 discovery_notes (D1–D10 read-only)`
- **Status**: US-0147 remains **OPEN**. AC-1..AC-8 remain unchecked. **Next**: `/architecture` in fresh **tech-lead** subagent. CROSS_MODEL_REVIEW=0 — do not spawn sovereign-critic. STOP before implementation.

## Architecture handoff — US-0147 Installation, update, and existing-project adoption

- **Phase completed**: architecture. **Role**: tech-lead. **Story**: US-0147 only. **Sprint**: (pending — expected S0154 at `/sprint-plan`). **Verdict**: PASS (`decision_gate=false`).
- **Timestamp (UTC)**: 2026-09-17T20:40:00Z. **Fresh marker**: `tl-US0147-architecture-20260917T204000Z-fresh`.
- **Orchestrator**: `orchestrator_run_id=auto-20260917-us0146`, parent=`auto-20260913-us0144`, `delivery_mode=ultra_lean`, resolved_phase_plan=`[spec, plan, build+verify, ship]`, macro=`plan` (architecture = second of research+architecture+sprint-plan), `model_id=inherit` (CROSS_MODEL_REVIEW=0), AUTO_QUIET=1, AUTO_FLOW_MODE=full_autonomy, AUTO_SOVEREIGN=0, FRAMEWORK_KIT_REPO=1, drain story **2 of 3** (`backlog_drain_stories_remaining_budget=1`).
- **Sibling boundary**: **US-0140..US-0146 DONE** — compose only (US-0146 `itsm`/CLI/TUI wiring IN). **US-0145 / US-0148 OPEN** — OUT OF SCOPE (do not mutate bodies). **BUG-0022 OPEN** — do not drain. Do not restore `.opencode/commands/auto.md`. No kit `cli.json` or plugin `its-magic-auto/tui.json`.
- **Architecture anchor**: `docs/engineering/architecture.md` **`# US-0147`**. **Companion DEC**: **DEC-0147** Accepted (`decisions/DEC-0147.md`).
- **Approach**: **A1 (A\*) LOCKED** per **R-0144** DQ1–DQ10. Template mirror `.its-magic/standalone/`; `bootstrap_standalone_runtime_installer_hook`; `itsm` shim; kernel preflight + `runtime-metadata.json`; `classifyProjectAdoptionProfile`; explicit `itsm setup browser`; `uninstall-standalone`.

### Locked design (A1)

- Triple-installer + `installer-owned-paths.manifest` extension; post-install hook order pinned (after host-config refresh, before runbook bootstrap).
- Ten `test_us0147_*` contract markers; expected sprint **S0154** (≤12 tasks from T-anch..T-011 seeds).
- Reason codes: `STANDALONE_BOOTSTRAP_FAILED`, `ADOPT_PARTIAL_MARKERS`, `INSTALL_INTERRUPTED_ROLLBACK_OK`, `INSTALL_BROWSER_OFFLINE`, `SCRATCHPAD_LEGACY_KEYS_PRESENT`, `KIT_VERSION_COEXISTENCE`; compose `KERNEL_*`.

### Runtime proof (DEC-0038)

- `runtime_proof_id=rp-auto-20260917-us0146-architecture-techlead-20260917T204000Z-US-0147`
- `proof_hash=90A68CD12FB24348890E4DCE47CDCE639736C67C6D91F3914542BFF282A366AD`
- `proof_ttl=2026-09-17T21:40:00Z`
- Canonical hashed payload: `{"orchestrator_run_id":"auto-20260917-us0146","phase_id":"architecture","proof_issued_at":"2026-09-17T20:40:00Z","proof_ttl_seconds":3600,"role":"tech-lead","runtime_proof_id":"rp-auto-20260917-us0146-architecture-techlead-20260917T204000Z-US-0147"}`
- `hash_recompute_confirmation=true` (compute_strict_proof_hash → 90A68CD12FB24348890E4DCE47CDCE639736C67C6D91F3914542BFF282A366AD; independently MATCH; **64 hex** verified; stored uppercase)
- Consumed research proof: `rp-auto-20260917-us0146-research-techlead-20260917T203000Z-US-0147` / `96C81771F5CE812898410E6F551A0C209475E9F31696EA13B07E7CDB1FC39237` — MATCH; not STALE at `2026-09-17T20:40:00Z`

### Isolation + stop

- `phase_id=architecture`, `role=tech-lead`, `story_id=US-0147`, `model_id=inherit`, `fresh_context_marker=tl-US0147-architecture-20260917T204000Z-fresh`
- `evidence_ref=docs/engineering/architecture.md # US-0147; decisions/DEC-0147.md; docs/engineering/research.md ## R-0144; docs/engineering/state.md architecture checkpoint; handoffs/resume_brief.md`
- **Hot-surface note**: Appended architecture handoff at true end. Post-append `--rollover --json` archived `architecture-pack-20260917-a.md` + `state-pack-20260917-k.md` + `po-to-tl-pack-20260917-c.md`. `--check-arch-heading-policy --baseline-h2-count 0` PASS. final `--check` PASS.
- **Status**: US-0147 remains **OPEN**. AC-1..AC-8 remain unchecked. **Next**: `/sprint-plan` in fresh **tech-lead** subagent. CROSS_MODEL_REVIEW=0 — do not spawn sovereign-critic. STOP before implementation.

## Sprint-plan handoff — US-0147 Installation, update, and existing-project adoption

- **Phase completed**: sprint-plan. **Role**: tech-lead. **Story**: US-0147 only. **Sprint**: **S0154** (materialized). **Verdict**: PASS (`SPRINT_PLAN_PASS`; `decision_gate=false`).
- **Timestamp (UTC)**: 2026-09-17T20:50:00Z. **Fresh marker**: `tl-US0147-sprintplan-20260917T205000Z-fresh`.
- **Orchestrator**: `orchestrator_run_id=auto-20260917-us0146`, parent=`auto-20260913-us0144`, `delivery_mode=ultra_lean`, resolved_phase_plan=`[spec, plan, build+verify, ship]`, macro=`plan` (sprint-plan terminal for plan macro), `model_id=inherit` (CROSS_MODEL_REVIEW=0), AUTO_QUIET=1, drain story **2 of 3** (`backlog_drain_stories_remaining_budget=1`).
- **Sibling boundary**: **US-0140..US-0146 DONE** — compose only. **US-0145 / US-0148 OPEN** — OUT OF SCOPE. **BUG-0022 OPEN** — not drained. No kit `cli.json` / plugin `tui.json`; no `auto.md` restore.
- **Artifacts**: `sprints/S0154/sprint.md`, `tasks.md` (12 tasks T-anch..T-011), `plan-verify.json` SKIPPED (`ultra_lean_skipped`), UAT placeholders, `handoffs/tl_to_dev.md` prepended.
- **Consumed architecture proof**: `rp-auto-20260917-us0146-architecture-techlead-20260917T204000Z-US-0147` / `90A68CD12FB24348890E4DCE47CDCE639736C67C6D91F3914542BFF282A366AD` — MATCH; not STALE at consume.

### Runtime proof (DEC-0038)

- `runtime_proof_id=rp-auto-20260917-us0146-sprint-plan-techlead-20260917T205000Z-US-0147`
- `proof_hash=71466A385CB3FFA1503D35BAA34BD51CD8A592C2038D8570762DCB32D3EBF9A5`
- `proof_ttl=2026-09-17T21:50:00Z`
- Canonical hashed payload: `{"orchestrator_run_id":"auto-20260917-us0146","phase_id":"sprint-plan","proof_issued_at":"2026-09-17T20:50:00Z","proof_ttl_seconds":3600,"role":"tech-lead","runtime_proof_id":"rp-auto-20260917-us0146-sprint-plan-techlead-20260917T205000Z-US-0147"}`
- `hash_recompute_confirmation=true` (compute_strict_proof_hash → 71466A385CB3FFA1503D35BAA34BD51CD8A592C2038D8570762DCB32D3EBF9A5; independently MATCH; **64 hex** verified)

### Isolation + stop

- **Status**: US-0147 remains **OPEN**. AC-1..AC-8 remain unchecked. **Next**: `/execute` in fresh **dev** subagent (BUG-0006). plan-verify SKIPPED (ultra_lean). CROSS_MODEL_REVIEW=0 — no sovereign-critic. STOP before implementation.

## Discovery handoff — US-0145 Parallel development, release/deploy, self-healing, and closure

- **Phase completed**: discovery. **Role**: po. **Story**: US-0145 only. **Sprint**: (pending — expected S0155 at `/sprint-plan`). **Verdict**: PASS (`decision_gate=false`).
- **Timestamp (UTC)**: 2026-09-17T20:00:00Z. **Fresh marker**: `po-US0145-discovery-20260917T200000Z-fresh`.
- **Orchestrator**: `orchestrator_run_id=auto-20260917-us0146`, parent=`auto-20260913-us0144`, `delivery_mode=ultra_lean`, resolved_phase_plan=`[spec, plan, build+verify, ship]`, reinstatement_mode=`none`, memory_layer=`pack`, macro=`spec` (intake already DONE — not re-intaken; `handoffs/intake_evidence/US-0133-0148-intake-20260911.json` held, not mutated), `model_id=inherit` (MODEL_RESOLVE=alias_only; CROSS_MODEL_REVIEW=0), AUTO_QUIET=1, AUTO_FLOW_MODE=full_autonomy, AUTO_SOVEREIGN=0, FRAMEWORK_KIT_REPO=1, EARLY_RESEARCH=0, drain story **3 of 3** (`backlog_drain_stories_remaining_budget=0`; AUTO_BACKLOG_MAX_STORIES=3). Selection: US-0146/US-0147 **DONE** → **US-0145** (OPEN P1 before US-0148). **US-0148** P1 OUT of this segment.
- **Sibling boundary**: **US-0140..US-0147 DONE** — compose only (US-0143 drain, US-0146 operator surfaces, US-0140 release→closure graph, US-0108/US-0109 Python libs); do not reopen. **US-0148 OPEN** — OUT OF SCOPE (do not mutate body). **BUG-0022 OPEN** — do not drain. Do not restore `.opencode/commands/auto.md`. Do not ship kit `cli.json` or plugin-local `its-magic-auto/tui.json`. No npm-publish, git push, or `.env` reads.
- **Gap confirmed (narrow-read)**: US-0108 `scripts/parallel_dev_arbiter.py` exists but is not orchestrated by standalone runtime; no typed `ReleaseTarget` adapters or deploy result ledger in TS; US-0109 `self_healing_deploy_lib.py` not composed into release path; `closure.ts` already separates release evidence from DONE flip.

### Discovery locks D1–D10

| ID | Lock |
|----|------|
| **D1** | Optional parallel DEV inside runtime workflow composes US-0108 worktree create/list/merge + arbiter evidence via KernelBridge (or thin TS facade). Isolated worktrees + distinct DEV sessions/models; independent tests; **no** main working-tree mutation before QA merge. Parallel mode optional after core lifecycle. **No Pi** on orchestration path. **Do not** rewrite US-0143 CommandRouter drain loop. |
| **D2** | Resource guards (AC-2) cap max instances, tokens/cost, CPU/RAM, worktree count, concurrent tests/browsers, wall-clock timeout — fail-closed with auditable reason codes. |
| **D3** | Fresh QA arbiter (AC-3) compares candidate evidence packages; select or reject winner; controlled merge with conflict/failure evidence; no producer self-arbitration. |
| **D4** | Typed `ReleaseTarget` adapters (AC-4): git/GitHub, npm, SSH command, Docker, custom command; compose existing release-trigger/changelog contracts where configured. |
| **D5** | Publish/deploy (AC-5) requires canonical test, QA, UAT, release-artifact, approval, and target-policy gates; emit auditable per-target results. **GateEngine `RELEASE_GATE_ORDER` unamended** — compose only. |
| **D6** | Post-deploy smoke (AC-6) captures runtime/browser evidence; bounded DEV repair → rebuild/release/redeploy loop (compose US-0109 `self_healing_deploy_lib.py`). |
| **D7** | Exhausted repair (AC-7) records canonical `DEPLOY_DEFERRED`/reason; **never** report failed deploy as released. |
| **D8** | Successful release (AC-8) transitions to **separate closure** only — compose `closure.ts` / US-0045; release phase must not mark DONE or tick acceptance. |
| **D9** | Tests `test_us0145_*` (expect 12 at architecture) cover AC-1..AC-9: isolation/arbitration, resource exhaustion, target failure, smoke repair success/exhaustion, release/closure ownership violations. Kit `files` omit `standalone/`. |
| **D10** | OUT: US-0148 daemon/protocol; US-0146 CLI/TUI polish (observe/trigger only); US-0144 critic *content*; rewrite GateEngine tables; restore `.opencode/commands/auto.md`; kit `cli.json`; plugin-local `its-magic-auto/tui.json`; npm-publish; git push; `.env`. Research stub **R-0145** (PO does not author `## R-0145`; **R-0144**=US-0147 — do not wipe). Companion **DEC-0145** + `# US-0145` at `/architecture` only. Expected sprint **S0155**. |

### Research questions DQ1–DQ10 (for `/research` → expect **R-0145**; stub only here)

1. **DQ1**: Parallel orchestration owner — WorkflowEngine phase hook vs nested `parallel-dev/` module in runtime-core vs KernelBridge-only US-0108 invoke; interaction with US-0143 drain (parallel **optional**, not required for every story).
2. **DQ2**: Worktree lifecycle — compose `parallel_dev_arbiter.py` vs TS port; git availability on Win/Linux; cleanup/orphans; PolicyEngine path rules for worktree roots.
3. **DQ3**: QA arbiter session — evidence package schema (tests, diffs, cost, model ids); merge strategy; reject-all path; fresh session isolation (US-0136 compose).
4. **DQ4**: Resource guard configuration — scratchpad keys vs RuntimeConfig; interaction with US-0080 token-cost and US-0144 caps; fail-closed codes.
5. **DQ5**: `ReleaseTarget` type system — adapter interface, config surface, secrets handling (no `.env` reads), dry-run vs apply, idempotency.
6. **DQ6**: Gate composition — map AC-5 gates onto existing GateEngine + release-trigger/changelog kit scripts; approval/target-policy extensions without reordering `RELEASE_GATE_ORDER`.
7. **DQ7**: Deploy smoke + repair loop — KernelBridge compose of `self_healing_deploy_lib.py`; cap semantics; fresh DEV spawn slot; interaction with US-0142 browser smoke evidence.
8. **DQ8**: Deferral + truthfulness — `DEPLOY_DEFERRED` tuple alignment with US-0107 deferral register; release queue / `release_notes.md` must not claim RELEASE_PASS on deploy fail.
9. **DQ9**: Closure boundary tests — enforce `releaseCannotMarkDone` + `applyClosure` ownership; forbidden paths where release flips DONE or closure runs without release evidence.
10. **DQ10**: Tests — `test_us0145_*` matrix; fake git/target doubles; kit `files` omit `standalone/`. **R-id live-inventory**: allocate **R-0145**; do not wipe **R-0144** (US-0147).

### Design refs

- `docs/product/standalone-its-magic-pi-masterplan.md` §§23, 25, 32 Phase 7, 38
- Compose: US-0108 `parallel_dev_arbiter.py`; US-0109 `self_healing_deploy_lib.py`; US-0140 `closure.ts` / phase graph; US-0143 scheduling; US-0146 operator observe; US-0045 status authority; BUG-0006 / DEC-0051 spawn-only
- Market: [deterministic vs LLM orchestration](https://dreaming.press/posts/deterministic-vs-llm-orchestration-for-multi-agent-systems.html) (policy-bounded recovery); git worktree isolation patterns (inspiration only)
- Intake (read-only): `handoffs/intake_evidence/US-0133-0148-intake-20260911.json` (`parallel-dev-worktrees`, `release-deploy-closure` → US-0145)

### Research stub (PO does not author `docs/engineering/research.md`)

- **Expected next R-id**: **R-0145** (`ID_NAMESPACE_BOOTSTRAP=0`; highest delivered heading is **R-0144** US-0147).
- Do **not** author `## R-0145` this phase. Do **not** wipe **R-0144**. Do **not** reuse R-0144 for US-0145 body.
- Companion **DEC-0145** + `# US-0145` at `/architecture` only — PO does not author them.
- Expected sprint **S0155** at `/sprint-plan` only (S0154 = US-0147 released — do not reuse).

### Runtime proof (DEC-0038)

- `runtime_proof_id=rp-auto-20260917-us0146-discovery-po-20260917T200000Z-US-0145`
- `proof_hash=D65648EBD8A325F98E69B718A2E81A9D04778B92C1C9F3CD690EE6160E21143C`
- `proof_ttl=2026-09-17T21:00:00Z`
- Hash via `from scripts.token_cost_lib import compute_strict_proof_hash` (positional; compact sorted-key JSON).
- Canonical hashed payload: `{"orchestrator_run_id":"auto-20260917-us0146","phase_id":"discovery","proof_issued_at":"2026-09-17T20:00:00Z","proof_ttl_seconds":3600,"role":"po","runtime_proof_id":"rp-auto-20260917-us0146-discovery-po-20260917T200000Z-US-0145"}`
- Isolation extras (not hashed): `delivery_mode=ultra_lean`, `macro_phase=spec`, `model_id=inherit`, `sprint_id=none`, `story_id=US-0145`, `skipped_phases=[intake]`, `CROSS_MODEL_REVIEW=0`, `native_chain_active=true`, `native_chain_continuing=true`, `drain_story_index=3 of 3`, `backlog_drain_stories_remaining_budget=0`
- `hash_recompute_confirmation=true` (compute_strict_proof_hash → d65648ebd8a325f98e69b718a2e81a9d04778b92c1c9f3cd690ee6160e21143c; independently MATCH; **64 hex** verified; stored uppercase)

### Isolation + stop

- `phase_id=discovery`, `role=po`, `story_id=US-0145`, `model_id=inherit`, `fresh_context_marker=po-US0145-discovery-20260917T200000Z-fresh`
- `evidence_ref=docs/product/backlog.md ## US-0145 discovery_notes; docs/product/vision.md ## Discovery Notes — US-0145; this handoff; docs/engineering/state.md discovery checkpoint; handoffs/resume_brief.md; handoffs/intake_evidence/US-0133-0148-intake-20260911.json (read-only)`
- **Hot-surface note**: Appended (not prepended). Post-append `--rollover --json` archived state `state-pack-20260917-o.md` + po_to_tl `po-to-tl-pack-20260917-e.md`. Discovery handoff US-0145 retained at true end. final `--check` PASS.
- **Status**: US-0145 remains **OPEN**. AC-1..AC-9 remain unchecked. Acceptance.md US-0145 row unchecked. **Next**: `/research` in fresh **tech-lead** subagent. CROSS_MODEL_REVIEW=0 — do not spawn sovereign-critic. Do not spawn research from this discovery chat. STOP.

## Research handoff — US-0145 Parallel development, release/deploy, self-healing, and closure

- **Phase completed**: research. **Role**: tech-lead. **Story**: US-0145 only. **Sprint**: (pending — expected S0155 at `/sprint-plan`). **Verdict**: PASS (`decision_gate=false`).
- **Timestamp (UTC)**: 2026-09-17T22:00:00Z. **Fresh marker**: `tl-US0145-research-20260917T220000Z-fresh`.
- **Orchestrator**: `orchestrator_run_id=auto-20260917-us0146`, parent=`auto-20260913-us0144`, `delivery_mode=ultra_lean`, resolved_phase_plan=`[spec, plan, build+verify, ship]`, macro=`plan` (research = first of research+architecture+sprint-plan), `model_id=inherit` (MODEL_RESOLVE=alias_only; CROSS_MODEL_REVIEW=0), AUTO_QUIET=1, AUTO_FLOW_MODE=full_autonomy, AUTO_SOVEREIGN=0, FRAMEWORK_KIT_REPO=1, EARLY_RESEARCH=0, drain story **3 of 3** (`backlog_drain_stories_remaining_budget=0`).
- **Sibling boundary**: **US-0140..US-0147 DONE** — compose only (US-0143 drain, US-0146 observe, US-0140 closure/release graph, US-0108/US-0109 Python libs); do not reopen. **US-0148 OPEN** — OUT OF SCOPE. **BUG-0022 OPEN** — do not drain. No npm-publish, git push, or `.env` reads.
- **Research anchor**: `docs/engineering/research.md` **`## R-0145`** (DQ1–DQ10 LOCKED). Do not wipe **R-0144** (US-0147). Discovery D1–D10 not rewritten.
- **Approach**: **A1 (A\*)** — nested `workflow/delivery/` (`ParallelDevCoordinator` + `ReleaseDeployPipeline`) + `KernelBridge.runDeliveryOperation()` → `scripts/delivery_runtime_bridge.py` composing US-0108/US-0109; WorkflowEngine phase hooks; `ReleaseTarget` registry; GateEngine compose-only (no `RELEASE_GATE_ORDER` amend); closure/release ownership preserved.
- **Companion DEC**: **DEC-0145** at `/architecture` only — do **not** author/mutate `decisions/DEC-0145.md` this phase. Do **not** author `# US-0145`.

### Closed questions DQ1–DQ10

| DQ | Topic | Resolution | LOCK |
|----|-------|------------|------|
| DQ1 | Parallel owner | `ParallelDevCoordinator` in runtime-core; WorkflowEngine post-execute hook; US-0143 drain unchanged | LOCKED |
| DQ2 | Worktrees | Bridge to `parallel_dev_arbiter.py`; `.its-magic/worktrees/`; no TS git port | LOCKED |
| DQ3 | QA arbiter | Fresh `qa-arbiter` session; evidence packages; merge/reject paths | LOCKED |
| DQ4 | Resource guards | `DeliveryResourceGuard`; scratchpad + US-0080 + concurrency caps | LOCKED |
| DQ5 | ReleaseTarget | Adapter registry (git_github, npm, ssh, docker, custom); secrets via config API | LOCKED |
| DQ6 | Gates | Additive `ReleaseGateInput`; order array unamended | LOCKED |
| DQ7 | Smoke/repair | Compose `self_healing_deploy_lib.py`; bounded DEV repair slot | LOCKED |
| DQ8 | Deferral/truth | `DEPLOY_DEFERRED`; no RELEASE_PASS on deploy fail | LOCKED |
| DQ9 | Closure | `releaseCannotMarkDone` + `applyClosure` sole DONE authority | LOCKED |
| DQ10 | Tests + R-id | 12 `test_us0145_*`; **R-0145**; S0155 at sprint-plan | LOCKED |

### Architecture seeds (preview)

- `/architecture` authors `# US-0145` + **DEC-0145** Accepted; pins bridge ops, target kinds, ledger paths, reason codes.
- `/sprint-plan` materializes **S0155** (≤12 tasks from architecture seeds).
- Do not implement application code this phase.

### Runtime proof (DEC-0038)

- `runtime_proof_id=rp-auto-20260917-us0146-research-techlead-20260917T220000Z-US-0145`
- `proof_hash=CBBD28E0CA404A019F3919AA8870EA7FCC2699CC7AD4576F5F9CEA0323F222C6`
- `proof_ttl=2026-09-17T23:00:00Z`
- Hash via `from scripts.token_cost_lib import compute_strict_proof_hash` (positional; compact sorted-key JSON).
- Canonical hashed payload: `{"orchestrator_run_id":"auto-20260917-us0146","phase_id":"research","proof_issued_at":"2026-09-17T22:00:00Z","proof_ttl_seconds":3600,"role":"tech-lead","runtime_proof_id":"rp-auto-20260917-us0146-research-techlead-20260917T220000Z-US-0145"}`
- Isolation extras (not hashed): `delivery_mode=ultra_lean`, `macro_phase=plan`, `model_id=inherit`, `sprint_id=none`, `story_id=US-0145`, `skipped_phases=[intake]`, `CROSS_MODEL_REVIEW=0`, `native_chain_active=true`, `native_chain_continuing=true`, `drain_story_index=3 of 3`
- `hash_recompute_confirmation=true` (compute_strict_proof_hash → CBBD28E0CA404A019F3919AA8870EA7FCC2699CC7AD4576F5F9CEA0323F222C6; independently MATCH; **64 hex** verified; stored uppercase)
- Consumed discovery producer proof: `rp-auto-20260917-us0146-discovery-po-20260917T200000Z-US-0145` / `D65648EBD8A325F98E69B718A2E81A9D04778B92C1C9F3CD690EE6160E21143C` — MATCH at `2026-09-17T22:00:00Z`

### Isolation + stop

- `phase_id=research`, `role=tech-lead`, `story_id=US-0145`, `model_id=inherit`, `fresh_context_marker=tl-US0145-research-20260917T220000Z-fresh`
- `evidence_ref=docs/engineering/research.md ## R-0145; docs/engineering/state.md research checkpoint; handoffs/resume_brief.md; docs/product/backlog.md ## US-0145 discovery_notes (D1–D10 read-only)`
- **Status**: US-0145 remains **OPEN**. AC-1..AC-9 remain unchecked. **Next**: `/architecture` in fresh **tech-lead** subagent. CROSS_MODEL_REVIEW=0 — do not spawn sovereign-critic. STOP before implementation.

## Architecture handoff — US-0145 Parallel development, release/deploy, self-healing, and closure

- **Phase completed**: architecture. **Role**: tech-lead. **Story**: US-0145 only. **Sprint**: (pending — expected S0155 at `/sprint-plan`). **Verdict**: PASS (`decision_gate=false`).
- **Timestamp (UTC)**: 2026-09-17T22:30:00Z. **Fresh marker**: `tl-US0145-architecture-20260917T223000Z-fresh`.
- **Orchestrator**: `orchestrator_run_id=auto-20260917-us0146`, parent=`auto-20260913-us0144`, `delivery_mode=ultra_lean`, resolved_phase_plan=`[spec, plan, build+verify, ship]`, macro=`plan` (architecture = second of research+architecture+sprint-plan), `model_id=inherit` (MODEL_RESOLVE=alias_only; CROSS_MODEL_REVIEW=0), AUTO_QUIET=1, AUTO_FLOW_MODE=full_autonomy, AUTO_SOVEREIGN=0, FRAMEWORK_KIT_REPO=1, EARLY_RESEARCH=0, drain story **3 of 3** (`backlog_drain_stories_remaining_budget=0`).
- **Sibling boundary**: **US-0140..US-0147 DONE** — compose only (US-0143 drain, US-0140 closure, US-0146 observe, US-0108/US-0109 Python libs); do not reopen. **US-0148 OPEN** — OUT OF SCOPE. **BUG-0022 OPEN** — do not drain. No npm-publish, git push, or `.env` reads.
- **Architecture anchor**: `docs/engineering/architecture.md` **`# US-0145`**. **Companion DEC**: **DEC-0145** Accepted (`decisions/DEC-0145.md`).
- **Approach**: **A1 (A\*) LOCKED** — nested `workflow/delivery/` (`ParallelDevCoordinator` + `ReleaseDeployPipeline`) + `KernelBridge.runDeliveryOperation()` → `scripts/delivery_runtime_bridge.py`; WorkflowEngine hooks; `ReleaseTarget` registry; GateEngine compose-only; closure/release ownership preserved.
- **Research consumed**: `rp-auto-20260917-us0146-research-techlead-20260917T220000Z-US-0145` / `CBBD28E0CA404A019F3919AA8870EA7FCC2699CC7AD4576F5F9CEA0323F222C6` — MATCH at `2026-09-17T22:30:00Z` before TTL `2026-09-17T23:00:00Z`.

### Locked design (A1)

- `ParallelDevCoordinator` post-execute hook; default-off `SOVEREIGN_PARALLEL_DEV=0`.
- Worktrees `.its-magic/worktrees/<run_id>/`; bridge to `parallel_dev_arbiter.py`.
- QA arbiter fresh `qa-arbiter` session; twelve `test_us0145_*`.
- Deploy ledger `handoffs/deploy_results/deploy_results.jsonl`; `RELEASE_GATE_ORDER` unamended.
- `releaseCannotMarkDone` + `applyClosure` sole DONE authority.

### Sprint seeds

- T-anch + T-001..T-011 (12 ≤ SPRINT_MAX_TASKS cap). Expected **S0155**. Do not implement delivery code this phase.

### Runtime proof (DEC-0038)

- `runtime_proof_id=rp-auto-20260917-us0146-architecture-techlead-20260917T223000Z-US-0145`
- `proof_hash=80F3C316829DD9A44996EE4BD61E4FF3AAC0FCF3DC276D02B7FC9585FDA5FBE9`
- `proof_ttl=2026-09-17T23:30:00Z`
- Canonical hashed payload: `{"orchestrator_run_id":"auto-20260917-us0146","phase_id":"architecture","proof_issued_at":"2026-09-17T22:30:00Z","proof_ttl_seconds":3600,"role":"tech-lead","runtime_proof_id":"rp-auto-20260917-us0146-architecture-techlead-20260917T223000Z-US-0145"}`
- `hash_recompute_confirmation=true` (compute_strict_proof_hash → 80F3C316829DD9A44996EE4BD61E4FF3AAC0FCF3DC276D02B7FC9585FDA5FBE9; independently MATCH; **64 hex** verified)
- Consumed research proof: `rp-auto-20260917-us0146-research-techlead-20260917T220000Z-US-0145` / `CBBD28E0CA404A019F3919AA8870EA7FCC2699CC7AD4576F5F9CEA0323F222C6` — MATCH

### Isolation + stop

- `phase_id=architecture`, `role=tech-lead`, `story_id=US-0145`, `model_id=inherit`, `fresh_context_marker=tl-US0145-architecture-20260917T223000Z-fresh`
- `evidence_ref=docs/engineering/architecture.md # US-0145; decisions/DEC-0145.md; docs/engineering/research.md ## R-0145; docs/engineering/state.md architecture checkpoint; handoffs/resume_brief.md`
- **Status**: US-0145 remains **OPEN**. AC-1..AC-9 remain unchecked. **Next**: `/sprint-plan` in fresh **tech-lead** subagent. CROSS_MODEL_REVIEW=0 — do not spawn sovereign-critic. Do not spawn sprint-plan from this architecture chat. STOP.

## Discovery handoff — US-0148 Stable control protocol and recoverable daemon

- **Phase completed**: discovery. **Role**: po. **Story**: US-0148 only. **Sprint**: (pending — expected S0156 at `/sprint-plan`). **Verdict**: PASS (`decision_gate=false`).
- **Timestamp (UTC)**: 2026-09-17T21:10:00Z. **Fresh marker**: `po-US0148-discovery-20260917T211000Z-fresh`.
- **Orchestrator**: `orchestrator_run_id=auto-20260917-us0148`, parent=`auto-20260917-us0146`, `delivery_mode=ultra_lean`, resolved_phase_plan=`[spec, plan, build+verify, ship]`, reinstatement_mode=`none`, memory_layer=`pack`, macro=`spec` (intake already DONE — not re-intaken; `handoffs/intake_evidence/US-0133-0148-intake-20260911.json` held, not mutated), `model_id=inherit` (MODEL_RESOLVE=alias_only; CROSS_MODEL_REVIEW=0), AUTO_QUIET=1, AUTO_FLOW_MODE=full_autonomy, AUTO_SOVEREIGN=0, FRAMEWORK_KIT_REPO=1, EARLY_RESEARCH=0, drain story **1 of 3** (`backlog_drain_stories_remaining_budget=2`; AUTO_BACKLOG_MAX_STORIES=3). Fresh `/auto` after prior segment `BACKLOG_MAX_STORIES_REACHED`; sole OPEN portfolio story **US-0148** (P1).
- **Sibling boundary**: **US-0133..US-0147 DONE** — compose only (especially US-0146 CLI/TUI + in-process `OperatorSession`, US-0140 commands, US-0143 scheduling, US-0136 session isolation, `runs/store` SQLite); do not reopen. **BUG-0022 OPEN** — do not drain. Do not build web/Android/watch/VS Code/distributed-worker clients v1. Do not npm-publish, git push, or read `.env`.
- **Gap confirmed (narrow-read)**: Masterplan §29.3 event/command inventory is specified but **no** `standalone/apps/daemon`, **no** versioned `packages/protocol`, **no** local transport; US-0146 delivered operator surfaces with **in-process** reconnect only (explicit deferral to this story); SQLite + repo reconciliation primitives exist but are not daemon-restart orchestrated.

### Discovery locks D1–D10

| ID | Lock |
|----|------|
| **D1** | Thin local daemon (`standalone/apps/daemon` per masterplan §30) + versioned protocol types (sibling `packages/protocol` vs nested = architecture DQ). Daemon owns **zero** workflow rules — delegates to runtime services (`OperatorCommandFacade`, `WorkflowEngine`, etc.). **No Pi** on protocol paths. **Do not** rewrite `CommandRouter` / `GateEngine` tables. |
| **D2** | AC-1 versioned schemas for runtime commands, agent text deltas, approvals, run-state, tool lifecycle, browser evidence, status, cancellation, errors (§29.3 inventory). |
| **D3** | AC-2 transport/session boundary only — no duplicate scheduling, stop-matrix, or sovereign logic in daemon. |
| **D4** | AC-3 CLI/TUI (US-0146) become daemon clients: start/attach, ordered event stream, approvals, cancel, disconnect/reconnect without losing canonical state — supersedes in-process-only reconnect semantics. |
| **D5** | AC-4 loopback transport permissions, client/origin identity, secret redaction on wire; remote exposure **disabled** unless explicitly configured (compose US-0135 redaction). |
| **D6** | AC-5 protocol version negotiation; unsupported commands fail closed with migration diagnostics. |
| **D7** | AC-6 daemon restart reconciles SQLite operational ledger with repository evidence; orphan cleanup per policy; resume only via **fresh** role sessions (compose `recovery/crash-resume`, US-0136). |
| **D8** | AC-7 contract tests `test_us0148_*`: ordering, backpressure, reconnect/replay boundary, concurrent clients, approvals, cancellation, crash/restart, version negotiation. |
| **D9** | AC-8 protocol/operator docs sufficient for deferred clients (web, Android/watch, VS Code, distributed-worker, remote Debian) without shipping them v1. |
| **D10** | OUT: rich remote **clients** v1; distributed workers; new Cursor/OpenCode adapters; restore `.opencode/commands/auto.md`; kit `cli.json`; plugin-local `its-magic-auto/tui.json`; npm-publish; git push; `.env`. Research stub **R-0148** (PO does not author `## R-0148`; **R-0145**=US-0145 — do not wipe). Companion **DEC-0148** + `# US-0148` at `/architecture` only. Expected sprint **S0156**. |

### Research questions DQ1–DQ10 (for `/research` → expect **R-0148**; stub only here)

1. **DQ1**: Local transport — Unix domain socket vs Windows named pipe vs loopback HTTP vs WebSocket; JSON-RPC alignment with masterplan Phase 8.
2. **DQ2**: Package layout — sibling `packages/protocol` vs nested under `runtime-core` vs generated schema-only module.
3. **DQ3**: Ordered event stream — sequencing ids, backpressure, subscriber fan-out, replay cursor after reconnect.
4. **DQ4**: CLI/TUI migration — refactor US-0146 clients off in-process `OperatorSession` without breaking delivered operator tests (compatibility window).
5. **DQ5**: Schema versioning — protocol semver, capability negotiation, deterministic mismatch errors (AC-5).
6. **DQ6**: Restart reconciliation — compose `runs/store` SQLite with repo evidence; orphan process/session cleanup policy; fresh role resume only.
7. **DQ7**: Local authn/z — peer credentials, capability tokens, multi-client ACL; default-deny remote bind.
8. **DQ8**: Secret redaction — event payload filtering compose `auth-models` / operator observability redaction rules.
9. **DQ9**: Concurrent clients — observer vs controller roles; approval routing when multiple TUI/CLI attached.
10. **DQ10**: Tests + kit — `test_us0148_*` matrix covering AC-1..AC-8; kit `files` omit `standalone/` unless architecture proves otherwise. **R-id live-inventory**: allocate **R-0148**; do not wipe **R-0145**.

### Design refs

- `docs/product/standalone-its-magic-pi-masterplan.md` §29.3, §30 (`apps/daemon`, `packages/protocol`), §32 Phase 8, §37, Story 15
- Compose: US-0146 **DONE** (`standalone/apps/cli`, `tui`, `runtime-core/src/operator/`); US-0140 `PROGRAMMATIC_COMMANDS`; US-0143 `/auto`/`/quick`; US-0136 session isolation; `runtime-core` `runs/store` + `recovery/crash-resume`
- Intake (read-only): `handoffs/intake_evidence/US-0133-0148-intake-20260911.json` (`daemon-control-api` → US-0148)

### Research stub (PO does not author `docs/engineering/research.md`)

- **Expected next R-id**: **R-0148** (`ID_NAMESPACE_BOOTSTRAP=0`; highest delivered heading is **R-0145** US-0145).
- Do **not** author `## R-0148` this phase. Do **not** wipe **R-0145**. Do **not** reuse R-0145 for US-0148 body.
- Companion **DEC-0148** + `# US-0148` at `/architecture` only — PO does not author them.
- Expected sprint **S0156** at `/sprint-plan` only (S0155 = US-0145 released — do not reuse).

### Runtime proof (DEC-0038)

- `runtime_proof_id=rp-auto-20260917-us0148-discovery-po-20260917T211000Z-US-0148`
- `proof_hash=F9FCC16A49352472DADA88CEA509768C50E3EDCD5CE614EE53AFE07462CCA4AC`
- `proof_ttl=2026-09-17T22:10:00Z`
- Hash via `from scripts.token_cost_lib import compute_strict_proof_hash` (positional; compact sorted-key JSON).
- Canonical hashed payload: `{"orchestrator_run_id":"auto-20260917-us0148","phase_id":"discovery","proof_issued_at":"2026-09-17T21:10:00Z","proof_ttl_seconds":3600,"role":"po","runtime_proof_id":"rp-auto-20260917-us0148-discovery-po-20260917T211000Z-US-0148"}`
- Isolation extras (not hashed): `delivery_mode=ultra_lean`, `macro_phase=spec`, `model_id=inherit`, `sprint_id=none`, `story_id=US-0148`, `skipped_phases=[intake]`, `CROSS_MODEL_REVIEW=0`, `native_chain_active=true`, `native_chain_continuing=true`, `drain_story_index=1 of 3`
- `hash_recompute_confirmation=true` (compute_strict_proof_hash → f9fcc16a49352472dafa88cea509768c50e3edcd5ce614ee53afe07462cca4ac; independently MATCH; **64 hex** verified; stored uppercase)

### Isolation + stop

- `phase_id=discovery`, `role=po`, `story_id=US-0148`, `model_id=inherit`, `fresh_context_marker=po-US0148-discovery-20260917T211000Z-fresh`
- `evidence_ref=docs/product/backlog.md ## US-0148 discovery_notes; docs/product/vision.md ## Discovery Notes — US-0148; this handoff; docs/engineering/state.md discovery checkpoint; handoffs/resume_brief.md; handoffs/intake_evidence/US-0133-0148-intake-20260911.json (read-only)`
- **Hot-surface note**: Appended at true end. Post-append `--check` STATE_ARCHIVE_REQUIRED po_to_tl 704/650 → `--rollover --json` archived to `handoffs/archive/po-to-tl-pack-20260917-g.md` (moved=2; retained_lines=572). final `--check` PASS.
- **Status**: US-0148 remains **OPEN**. AC-1..AC-8 remain unchecked. Acceptance.md US-0148 row unchecked. **Next**: `/research` in fresh **tech-lead** subagent. CROSS_MODEL_REVIEW=0 — do not spawn sovereign-critic. Do not spawn research from this discovery chat. STOP.

## Architecture handoff — US-0148 Stable control protocol and recoverable daemon

- **Phase completed**: architecture. **Role**: tech-lead. **Story**: US-0148 only. **Sprint**: (pending — expected **S0156** at `/sprint-plan`). **Verdict**: PASS (`decision_gate=false`).
- **Timestamp (UTC)**: 2026-09-17T21:14:00Z. **Fresh marker**: `tl-US0148-architecture-20260917T211400Z-fresh`.
- **Orchestrator**: `orchestrator_run_id=auto-20260917-us0148`, parent=`auto-20260917-us0146`, `delivery_mode=ultra_lean`, resolved_phase_plan=`[spec, plan, build+verify, ship]`, reinstatement_mode=`none`, memory_layer=`pack`, macro=`plan`, `model_id=inherit` (MODEL_RESOLVE=alias_only; CROSS_MODEL_REVIEW=0), AUTO_QUIET=1, AUTO_FLOW_MODE=full_autonomy, AUTO_SOVEREIGN=0, FRAMEWORK_KIT_REPO=1, drain story **1 of 3** (`backlog_drain_stories_remaining_budget=2`; AUTO_BACKLOG_MAX_STORIES=3).
- **Sibling boundary**: **US-0133..US-0147 DONE** — compose only (US-0146 CLI/TUI **migrate** to daemon clients; US-0143 scheduling; US-0140 commands; US-0136 sessions); do not reopen. **BUG-0022 OPEN** — do not drain. No web/Android/watch/VS Code/distributed-worker clients v1. No npm-publish, git push, or `.env` reads.
- **Approach**: **A1 (A\*)** locked — `@its-magic/protocol`, `apps/daemon` (loopback JSON-RPC + WebSocket `/v1/events`), `runtime-core/src/daemon-client/` `DaemonTransport`, SQLite per-run `seq` log, bearer token + controller/observer roles, startup `crashResume` + `reconcileOperationalLedger`, twelve **`test_us0148_*`**, doc **`docs/engineering/operator/daemon-protocol.md`**.

### Architecture locks (DQ1–DQ10 → implementation)

| DQ | Pin |
|----|-----|
| DQ1 | JSON-RPC on `127.0.0.1`/`::1`; `.its-magic/daemon/listen.json` |
| DQ2 | `packages/protocol` + `apps/daemon`; client in `daemon-client/` |
| DQ3 | SQLite event log; `after_seq` replay; lag summary mode |
| DQ4 | `OperatorTransport`; US-0146 tests stay in-process |
| DQ5 | `daemon.hello` + `PROTOCOL_VERSION_MISMATCH` |
| DQ6 | Restart reconcile; fresh role sessions only |
| DQ7 | `client.token` bearer; single controller |
| DQ8 | `redactEventPayload()` on wire |
| DQ9 | Observers + controller approval/cancel rules |
| DQ10 | `us0148.contract.test.ts` + operator protocol doc |

### Sprint seeds (for `/sprint-plan` only)

T-anch + T-001..T-011 per `# US-0148` in `docs/engineering/architecture.md` (≤12 tasks at cap). Expected **S0156**.

### Runtime proof (DEC-0038)

- `runtime_proof_id=rp-auto-20260917-us0148-architecture-techlead-20260917T211400Z-US-0148`
- `proof_hash=AC546FD44FE347547D9DD92F79C906DC71B2212DD27969336F73F9475C48708D`
- `proof_ttl=2026-09-17T22:14:00Z`
- Canonical hashed payload: `{"orchestrator_run_id":"auto-20260917-us0148","phase_id":"architecture","proof_issued_at":"2026-09-17T21:14:00Z","proof_ttl_seconds":3600,"role":"tech-lead","runtime_proof_id":"rp-auto-20260917-us0148-architecture-techlead-20260917T211400Z-US-0148"}`
- `hash_recompute_confirmation=true` (compute_strict_proof_hash → AC546FD44FE347547D9DD92F79C906DC71B2212DD27969336F73F9475C48708D; independently MATCH; **64 hex** verified)
- Consumed research proof: `rp-auto-20260917-us0148-research-techlead-20260917T211200Z-US-0148` / `5F986CEE216B57CFD2DB191C8C4CE1CD9539596DCA6A35AEB9E91CE4729B0A4C` — MATCH

### Isolation + stop

- `phase_id=architecture`, `role=tech-lead`, `story_id=US-0148`, `model_id=inherit`, `fresh_context_marker=tl-US0148-architecture-20260917T211400Z-fresh`
- `evidence_ref=docs/engineering/architecture.md # US-0148; decisions/DEC-0148.md; docs/engineering/research.md ## R-0148; docs/engineering/state.md architecture checkpoint; handoffs/resume_brief.md`
- **Status**: US-0148 remains **OPEN**. AC-1..AC-8 remain unchecked. **Next**: `/sprint-plan` in fresh **tech-lead** subagent. CROSS_MODEL_REVIEW=0 — do not spawn sovereign-critic. Do not spawn sprint-plan from this architecture chat. STOP.
