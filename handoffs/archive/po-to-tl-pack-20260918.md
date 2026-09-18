# PO to TL archive pack (2026-09-18)

- Rollover trigger: `PO_TO_TL_HOT_MAX_LINES=650, PO_TO_TL_HOT_MAX_SECTIONS=60`
- Source: `handoffs/po_to_tl.md`
- Archived units (oldest first, contiguous prefix): 1
- Retained units in hot file: 14
- First archived heading: `## Research handoff — US-0144 Sovereign memory, reviews, and convergence`
- Last archived heading: `## Research handoff — US-0144 Sovereign memory, reviews, and convergence`
- Verification tuple (mandatory):
  - archived_body_lines=50
  - retained_body_lines=650

---

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

