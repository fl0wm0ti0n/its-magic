# PO to TL archive pack (2026-09-17)

- Rollover trigger: `PO_TO_TL_HOT_MAX_LINES=650, PO_TO_TL_HOT_MAX_SECTIONS=60`
- Source: `handoffs/po_to_tl.md`
- Archived units (oldest first, contiguous prefix): 2
- Retained units in hot file: 12
- First archived heading: `## Architecture handoff — US-0143 Delivery routing and full-autonomy scheduler`
- Last archived heading: `## Discovery handoff — US-0144 Sovereign memory, reviews, and convergence`
- Verification tuple (mandatory):
  - archived_body_lines=132
  - retained_body_lines=572

---

## Architecture handoff — US-0143 Delivery routing and full-autonomy scheduler

- **Phase completed**: architecture. **Role**: tech-lead. **Story**: US-0143 only. **Sprint**: (pending `/sprint-plan` — expected S0151; S0150=US-0142; S0149=US-0141; S0148=BUG-0023). **Verdict**: PASS (`decision_gate=false`).
- **Timestamp (UTC)**: 2026-09-14T07:10:00Z (proof_issued_at). **Fresh marker**: `tl-US0143-architecture-20260914T071000Z-fresh`.
- **Orchestrator**: `orchestrator_run_id=auto-20260913-us0143`, parent=`auto-20260913-us0142`, `delivery_mode=ultra_lean`, resolved_phase_plan=`[spec, plan, build+verify, ship]`, macro=`plan` (architecture = second of research+architecture+sprint-plan; sprint-plan continues later via orchestrator spawn), `model_id=cursor-grok-4.6-high` (CROSS_MODEL_REVIEW=1), AUTO_QUIET=1, EARLY_RESEARCH=1 (consumed **R-0141**; **no new R-id**), FRAMEWORK_KIT_REPO=1, drain story 9 of 10.
- **Sibling boundary**: **US-0141 DONE / US-0142 DONE** — compose only; do not reopen. **US-0133..US-0140 DONE** — compose only; do not reopen. **US-0144..US-0148 OPEN** — OUT OF SCOPE (US-0144 critic content). **BUG-0021 DONE / BUG-0022 OPEN / BUG-0023 DONE / BUG-0024 OPEN** — do not mutate; do not drain bugs. Do not restore `.opencode/commands/auto.md`. Do not ship kit `cli.json` or plugin-local `its-magic-auto/tui.json`. Do not create `sprints/S0151/` this phase. Do not spawn `/sprint-plan` from this architecture chat.
- **Architecture anchor**: `docs/engineering/architecture.md` **`# US-0143`**. **Companion DEC**: **DEC-0143** Accepted (`decisions/DEC-0143.md`).
- **Approach**: **A1 (A\*) LOCKED**. Reject A2–A15.
- **Research consumed**: `rp-auto-20260913-us0143-research-techlead-20260914T065000Z-US-0143` / `27986466F2DEE28D145CB9892C2A3AFBD4E41B2F9E9F88F133008BEB43F94042` — RUNTIME_PROOF_VALID MATCH at proof_issued_at `2026-09-14T07:10:00Z` before TTL `2026-09-14T07:50:00Z`; critic PASS `rp-auto-20260913-us0143-sovereign-critic-techlead-20260914T070000Z-US-0143` / `242D01E83A4DFE451C679C02C23593A16DD0F6313282F87A8DA846987E187D31`; anti_slop=10; 0 blocking; immutable R-0141; NBs `us0143rsc-*` closed in H1.

### Locked design (A1)

- Lift `WORKFLOW_ROUTE_DEFERRED` in `@its-magic/runtime-core` CommandRouter. `SCHEDULER_COMMANDS=["/auto","/quick"]`. `DEFERRED_COMMANDS` empty after this story. `RouteScheduled` (`ok: true`, `implemented: true`, plan + independent axes). 7-step unamended for canonical phases.
- Nested `workflow/delivery-router.ts`. No sibling auto-scheduler. No Pi.
- WorkflowEngine owns §14.4 drain (`runAuto` / `runQuick`). GateEngine `RELEASE_GATE_ORDER` unamended.
- Independent axes: `DELIVERY_MODE` / `TOKEN_PROFILE` / CAVEMAN-voice / `AUTONOMY_PRESET` / `WORK_KIND`. Consume US-0118/0119/0095/0096. L8 TS adapter. YAML stop-matrix consume. `expandAutonomyPreset` before run.
- Compressed: `ultra_lean` skip-plan-verify held; `mega_quick`/`/quick` nodes `execute` → `qa` → `verify-work` → `release` → `closure` → `refresh-context` (tests+acceptance+GateEngine non-skippable).
- AC-6 non-relaxable even under `full`: `DECISION_UNRESOLVED`, `KERNEL_INCOMPATIBLE`, `QUALITY_EVIDENCE_FAILED`, `BUDGET_EXHAUSTED`, `RESUME_AMBIGUOUS` + existing YAML `security_hard`.
- Dual-write ledger. Mid-resume `discardOrphans` + fresh role. Critic-hook slot only (US-0144 content OUT).
- 12 `test_us0143_*`. Compose-amend `test_us0140_command_coverage`. Kit `files` omit `standalone/`. Do not restore `auto.md`.
- OUT: US-0144 content, restore `.opencode/commands/auto.md`, kit cli.json, plugin-local tui.json, drain BUG-0024.

### Sprint seeds

- T-anch + T-001..T-010 (11 ≤ SPRINT_MAX_TASKS=12). Expected **S0151**. Do not restore `auto.md`. Do not mutate BUG-0021/0022/0023/0024. Do not reopen US-0133..US-0142. Do not mutate US-0144+. Do not implement drain code this phase.

### Runtime proof (DEC-0038)

- `runtime_proof_id=rp-auto-20260913-us0143-architecture-techlead-20260914T071000Z-US-0143`
- `proof_hash=6FF1DB37B91284FDE90C5EC7058FF518605D49525BD8FACECB5AC570284F26E5`
- `proof_ttl=2026-09-14T08:10:00Z`
- Hash via `from scripts.token_cost_lib import compute_strict_proof_hash` (positional; compact sorted-key JSON).
- Canonical hashed payload: `{"orchestrator_run_id":"auto-20260913-us0143","phase_id":"architecture","proof_issued_at":"2026-09-14T07:10:00Z","proof_ttl_seconds":3600,"role":"tech-lead","runtime_proof_id":"rp-auto-20260913-us0143-architecture-techlead-20260914T071000Z-US-0143"}`
- Isolation extras (not hashed): `delivery_mode=ultra_lean`, `macro_phase=plan`, `model_id=cursor-grok-4.6-high`, `sprint_id=none`, `story_id=US-0143`, `skipped_phases=[intake]`, `native_chain_active=true`, `native_chain_continuing=true`
- `hash_recompute_confirmation=true` (compute_strict_proof_hash → 6FF1DB37B91284FDE90C5EC7058FF518605D49525BD8FACECB5AC570284F26E5; independently MATCH; **64 hex** verified)
- Consumed research proof: `rp-auto-20260913-us0143-research-techlead-20260914T065000Z-US-0143` / `27986466F2DEE28D145CB9892C2A3AFBD4E41B2F9E9F88F133008BEB43F94042` — RUNTIME_PROOF_VALID (MATCH before TTL `2026-09-14T07:50:00Z`; consumed_at `2026-09-14T07:10:00Z`; independent recompute MATCH)
- Consumed critic proof: `rp-auto-20260913-us0143-sovereign-critic-techlead-20260914T070000Z-US-0143` / `242D01E83A4DFE451C679C02C23593A16DD0F6313282F87A8DA846987E187D31` — RUNTIME_PROOF_VALID (MATCH before TTL `2026-09-14T08:00:00Z`)

### Isolation + stop

- `phase_id=architecture`, `role=tech-lead`, `story_id=US-0143`, `model_id=cursor-grok-4.6-high`, `fresh_context_marker=tl-US0143-architecture-20260914T071000Z-fresh`
- `evidence_ref=docs/engineering/architecture.md # US-0143; decisions/DEC-0143.md; docs/engineering/research.md ## R-0141; docs/product/backlog.md ## US-0143; docs/engineering/state.md architecture checkpoint; handoffs/resume_brief.md`
- **Status**: US-0143 remains **OPEN**. AC-1..AC-8 remain unchecked. **Next**: orchestrator sovereign-critic of architecture, then `/sprint-plan` expected **S0151** in fresh **tech-lead** subagent. Do not spawn sprint-plan or critic from this architecture chat. STOP.

## Discovery handoff — US-0144 Sovereign memory, reviews, and convergence

- **Phase completed**: discovery. **Role**: po. **Story**: US-0144 only. **Sprint**: (pending — expected S0152 at `/sprint-plan`). **Verdict**: PASS (`decision_gate=false`).
- **Timestamp (UTC)**: 2026-09-14T09:50:00Z. **Fresh marker**: `po-US0144-discovery-20260914T095000Z-fresh`.
- **Orchestrator**: `orchestrator_run_id=auto-20260913-us0144`, parent=`auto-20260913-us0143`, `delivery_mode=ultra_lean`, resolved_phase_plan=`[spec, plan, build+verify, ship]`, macro=`spec` (intake already DONE — not re-intaken; `handoffs/intake_evidence/US-0133-0148-intake-20260911.json` held, not mutated), `model_id=cursor-grok-4.6-high` (CROSS_MODEL_REVIEW=1), AUTO_QUIET=1, FRAMEWORK_KIT_REPO=1, drain story 10 of 10 (final drain slot; after this segment BACKLOG_MAX_STORIES_REACHED).
- **Sibling boundary**: **US-0143 DONE** — compose RouteScheduled / drain / critic-hook slot only; do not reopen. **US-0133..US-0142 DONE** — compose only; do not reopen. **US-0145..US-0148 OPEN** — OUT OF SCOPE (do not mutate). **BUG-0021 DONE / BUG-0022 OPEN / BUG-0023 DONE / BUG-0024 OPEN** — do not mutate; do not drain bugs. Do not restore `.opencode/commands/auto.md`. Do not ship kit `cli.json` or plugin-local `its-magic-auto/tui.json`.
- **Gap confirmed (narrow-read)**: US-0143 WorkflowEngine schedules supplementary critic sessions when `CROSS_MODEL_REVIEW=1` but records `critic_content: false`. Python sovereign libs exist (ledger/critic/memory/manifest/loop/convergence) and are compose-only. Remaining deferred critic/memory/convergence *content* is not yet in `@its-magic/runtime-core`. GateEngine `RELEASE_GATE_ORDER` must stay unamended. `build_injection_digest_block` this spawn returned `(no sovereign memory entries)` (read-only; `SOVEREIGN_MEMORY=1`).

### Discovery locks D1–D10

| ID | Lock |
|----|------|
| **D1** | Implement remaining deferred critic/memory/convergence surfaces **inside** `@its-magic/runtime-core` (existing Python libs compose). **No** sibling package unless architecture later proves it. **No Pi**. Do **not** rewrite GateEngine tables. Do **not** rewrite US-0143 CommandRouter drain. |
| **D2** | Autonomous decisions append model/session/run-aware entries to existing US-0103 ledger (`handoffs/sovereign_decisions/<orchestrator_run_id>.jsonl`). QA verifies plan fidelity. 12-field schema unamended (additive identifiers only). |
| **D3** | Sovereign memory remains repository-owned (`docs/engineering/sovereign-memory/`). Only ranked size-capped digest via `build_injection_digest_block` enters each relevant session. Never inject the full store. Compose US-0105. |
| **D4** | US-0106 role-manifest obligations and US-0104 Challenger/Architect/Subtractor lenses execute as **fresh** review sessions; never replace producer roles. Lift `critic_content: false` through US-0143 `scheduleSupplementaryHooks`. |
| **D5** | Different producer/critic models when available; configured critic pinning; explicit degraded same-model semantics (do not claim cross-model independence). Compose US-0104 L8 + masterplan §12.5/§22.4. |
| **D6** | Deferral processing and drain-generate preserve mandatory operator decision gates and append-only evidence. Compose US-0107. `SOVEREIGN_DRAIN_AUTO_ACCEPT=0` held. |
| **D7** | Convergence is evaluated by **code and evidence** (`evaluate_convergence`). Only blocking open critic findings block critic convergence (US-0127). Eligible non-blocking same-run findings can resolve. Approved smoke surrogates never claim fake browser PASS (US-0128). Models cannot self-declare success. |
| **D8** | Goal progress, partial delivery, token/cost caps, iteration caps, and non-convergence reasons are operator-visible. |
| **D9** | Tests `test_us0144_*` (expect 12): producer/critic separation, model collision, memory bounds, deferrals, convergence success/failure, current critic/smoke fixes. Kit `files` omit `standalone/`. |
| **D10** | OUT: US-0145 parallel/deploy; US-0146 CLI/TUI; restore `.opencode/commands/auto.md`; kit `cli.json`; plugin-local `its-magic-auto/tui.json`; npm-publish; git push; `.env`. Do not mutate US-0143 DONE, US-0145+, BUG-0024. Research stub **R-0142** (PO does not author `## R-0142`; **R-0141**=US-0143 — do not reuse/wipe). Companion **DEC-0144** + `# US-0144` at `/architecture` only. Expected sprint **S0152**. |

### Research questions DQ1–DQ10 (for `/research` → expect **R-0142**; stub only here)

1. **DQ1**: Package — nested sovereign-runtime in `@its-magic/runtime-core` + KernelBridge to Python libs vs sibling package vs Pi. D-lock prefers compose-in-place; architecture confirms. No Pi.
2. **DQ2**: How to lift `critic_content: false` without rewriting US-0143 CommandRouter drain, WorkflowEngine `runAuto`/`runQuick`, or GateEngine tables.
3. **DQ3**: Ledger — KernelBridge consume `decision_ledger_lib.py` vs TS dual-write. Additive model/session/run identifiers without 12-field schema rewrite. QA plan-fidelity cross-check path.
4. **DQ4**: Memory injection — consume `build_injection_digest_block` via KernelBridge vs TS port. Char cap / top-N+top-K. Never full store. Spawn order: phase-context → digest → role instructions.
5. **DQ5**: Critic model selection — consume `select_critic_model` + pinning; degraded same-model; three-lens fresh sessions; findings JSONL compose US-0104 (no schema wipe).
6. **DQ6**: Role-manifest review graph — dispatch US-0106 `review_obligations` as supplementary sessions without substituting producer; `cross_model_policy` ordering vs `/sovereign-critic`.
7. **DQ7**: Deferral/drain-generate — consume `sovereign_loop_lib` (`append_deferral` / `list_open_deferrals` / drain-generate gate). Mandatory per-candidate `decision_gate`. `SOVEREIGN_DRAIN_AUTO_ACCEPT=0`.
8. **DQ8**: Convergence — consume `evaluate_convergence` (US-0110 five-conjunct) + US-0127 `read_open_blocking` + US-0128 smoke surrogate. Code-evaluated; not model-declared.
9. **DQ9**: Operator-visible `goal_progress` / `sovereign_partial_delivery.md` / token-cost caps / iteration caps / non-convergence reasons — which surfaces now vs US-0146 CLI/TUI.
10. **DQ10**: Tests — 12 `test_us0144_*` covering AC-1..AC-8. Kit `files` omit `standalone/`. No `auto.md` restore. **R-id live-inventory**: allocate **R-0142**; do not wipe R-0141 (US-0143).

### Design refs

- `docs/product/standalone-its-magic-pi-masterplan.md` §§22, 24, 32 Phase 7, 38
- Compose: US-0143 / DEC-0143 / R-0141 (`critic_content: false` slot); US-0103 / DEC-0103; US-0104 / DEC-0104; US-0105 / DEC-0105; US-0106 / DEC-0106; US-0107 / DEC-0107; US-0110 / DEC-0110; US-0127; US-0128; BUG-0006 / DEC-0051 spawn-only
- Market: [MultiCritique independent critics](https://aclanthology.org/2025.findings-emnlp.78); [bounded memory control](https://arxiv.org/html/2601.11653); [origin-bound memory authority](https://ar5iv.labs.arxiv.org/html/2606.24322)
- Intake (read-only): `handoffs/intake_evidence/US-0133-0148-intake-20260911.json` (`sovereign-runtime` → US-0144)

### Research stub (PO does not author `docs/engineering/research.md`)

- **Expected next R-id**: **R-0142** (`ID_NAMESPACE_BOOTSTRAP=0`; highest existing heading is **R-0141** US-0143).
- Do **not** author `## R-0142` this phase. Do **not** wipe R-0141 (US-0143). Do **not** reuse R-0141.
- Companion **DEC-0144** + `# US-0144` at `/architecture` only — PO does not author them.
- Expected sprint **S0152** at `/sprint-plan` only.

### Runtime proof (DEC-0038)

- `runtime_proof_id=rp-auto-20260913-us0144-discovery-po-20260914T095000Z-US-0144`
- `proof_hash=04F2563AD77B0D0E519ADDF46FF3AA25445C58DF5BCD30FEB933929D7C4A0594`
- `proof_ttl=2026-09-14T10:50:00Z`
- Hash via `from scripts.token_cost_lib import compute_strict_proof_hash` (positional; compact sorted-key JSON).
- Canonical hashed payload: `{"orchestrator_run_id":"auto-20260913-us0144","phase_id":"discovery","proof_issued_at":"2026-09-14T09:50:00Z","proof_ttl_seconds":3600,"role":"po","runtime_proof_id":"rp-auto-20260913-us0144-discovery-po-20260914T095000Z-US-0144"}`
- Isolation extras (not hashed): `delivery_mode=ultra_lean`, `macro_phase=spec`, `model_id=cursor-grok-4.6-high`, `sprint_id=none`, `story_id=US-0144`, `skipped_phases=[intake]`, `native_chain_active=true`, `native_chain_continuing=true`
- `hash_recompute_confirmation=true` (compute_strict_proof_hash → 04f2563ad77b0d0e519addf46ff3aa25445c58df5bcd30feb933929d7c4a0594; independently MATCH; **64 hex** verified; stored uppercase)

### Isolation + stop

- `phase_id=discovery`, `role=po`, `story_id=US-0144`, `model_id=cursor-grok-4.6-high`, `fresh_context_marker=po-US0144-discovery-20260914T095000Z-fresh`
- `evidence_ref=docs/product/backlog.md ## US-0144 discovery_notes; docs/product/vision.md ## Discovery Notes — US-0144; this handoff; docs/engineering/state.md discovery checkpoint; handoffs/resume_brief.md; handoffs/intake_evidence/US-0133-0148-intake-20260911.json (read-only)`
- **Hot-surface note**: Appended (not prepended) so triad oldest-prefix rollover retains this newest section. Post-append `--rollover --json` `{"boundary":"triad-rollover|state","moved":1,"pack_ref":"docs/engineering/state-archive/state-pack-20260914-k.md","retained_checkpoints":14,"retained_lines":1137}` + `{"boundary":"triad-rollover|po_to_tl","moved":1,"pack_ref":"handoffs/archive/po-to-tl-pack-20260914.md","retained_lines":614,"retained_sections":13}`. `arch_linkage_guard.py` not run (architecture.md not touched). Architecture not rolled this phase. final `--check` PASS. Discovery handoff retained at true end of `po_to_tl.md`. **Status**: US-0144 remains **OPEN**. AC-1..AC-8 remain unchecked. **Next**: orchestrator sovereign-critic of discovery, then `/research` in fresh **tech-lead** subagent. Do not spawn research or critic from this discovery chat. STOP.

### Discovery proof renewal (2026-09-15)

- The discovery content and D1-D10 locks above were independently retained; no backlog, acceptance, vision, or sibling artifact was changed.
- `runtime_proof_id=rp-auto-20260913-us0144-discovery-po-20260915T082247Z-US-0144`
- `proof_hash=E10567592D0A91E77490B9E37FA2417555437F711D64407543FC309EEF1E8D2F`
- `proof_issued_at=2026-09-15T08:22:47Z`, `proof_ttl_seconds=3600`, `proof_ttl=2026-09-15T09:22:47Z`
- Canonical hashed payload: `{"orchestrator_run_id":"auto-20260913-us0144","phase_id":"discovery","proof_issued_at":"2026-09-15T08:22:47Z","proof_ttl_seconds":3600,"role":"po","runtime_proof_id":"rp-auto-20260913-us0144-discovery-po-20260915T082247Z-US-0144"}`
- `hash_recompute_confirmation=true` (`compute_strict_proof_hash` returned `e10567592d0a91e77490b9e37fa2417555437f711d64407543fc309eef1e8d2f`).
- Next: orchestrator sovereign-critic of discovery, then `/research` in a fresh tech-lead subagent. STOP.

### Discovery proof renewal (2026-09-15T18:34:19Z) — TTL refresh only

- Stale proof `rp-auto-20260913-us0144-discovery-po-20260915T082247Z-US-0144` / `E10567592D0A91E77490B9E37FA2417555437F711D64407543FC309EEF1E8D2F` expired `2026-09-15T09:22:47Z`. D1–D10 locks, backlog Status OPEN, and AC ticks unchanged. R-0142 / DEC-0144 / S0152 / architecture `# US-0144` not mutated.
- `runtime_proof_id=rp-auto-20260913-us0144-discovery-po-20260915T183419Z-US-0144`
- `proof_hash=560B4D3028D921EA85B9893CC2D378D74B7F6FA3DA35A2F74A60A334448CBBBC`
- `proof_issued_at=2026-09-15T18:34:19Z`, `proof_ttl_seconds=3600`, `proof_ttl=2026-09-15T19:34:19Z`
- `model_id=cursor-grok-4.6-high`, `fresh_context_marker=po-US0144-discovery-renewal-20260915T183419Z-fresh`
- Canonical hashed payload: `{"orchestrator_run_id":"auto-20260913-us0144","phase_id":"discovery","proof_issued_at":"2026-09-15T18:34:19Z","proof_ttl_seconds":3600,"role":"po","runtime_proof_id":"rp-auto-20260913-us0144-discovery-po-20260915T183419Z-US-0144"}`
- `hash_recompute_confirmation=true` (`compute_strict_proof_hash` MATCH independent hashlib SHA-256; 64 hex `560B4D3028D921EA85B9893CC2D378D74B7F6FA3DA35A2F74A60A334448CBBBC`).
- `native_chain_active=true`, `native_chain_continuing=true`, `drain_advance_action=not_applicable`.
- **Next**: orchestrator MUST spawn sovereign-critic of discovery, then `/research` R-0142. Do not spawn critic or research from this PO chat. STOP.

