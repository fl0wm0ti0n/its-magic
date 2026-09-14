# PO to TL archive pack (2026-09-13)

- Rollover trigger: `PO_TO_TL_HOT_MAX_LINES=650, PO_TO_TL_HOT_MAX_SECTIONS=60`
- Source: `handoffs/po_to_tl.md`
- Archived units (oldest first, contiguous prefix): 1
- Retained units in hot file: 14
- First archived heading: `## Research handoff — US-0139 Persistent code intelligence and bounded context engine`
- Last archived heading: `## Research handoff — US-0139 Persistent code intelligence and bounded context engine`
- Verification tuple (mandatory):
  - archived_body_lines=50
  - retained_body_lines=634

---

## Research handoff — US-0139 Persistent code intelligence and bounded context engine

- **Phase completed**: research. **Role**: tech-lead. **Story**: US-0139 only. **Sprint**: (pending). **Verdict**: PASS (`decision_gate=false`).
- **Timestamp (UTC)**: 2026-09-13T17:15:00Z. **Fresh marker**: `tl-US0139-research-20260913T171500Z-fresh`.
- **Orchestrator**: `orchestrator_run_id=auto-20260913-us0139`, parent=`auto-20260913-us0138`, `delivery_mode=ultra_lean`, macro=`plan` (research = first of research+architecture+sprint-plan), `model_id=cursor-grok-4.6-high`, CROSS_MODEL_REVIEW=1, AUTO_QUIET=1, EARLY_RESEARCH=1, FRAMEWORK_KIT_REPO=1, drain story 5 of 10.
- **Sibling boundary**: **US-0140..US-0148** OPEN — OUT OF SCOPE this segment (do not mutate). **BUG-0021** OPEN — OUT (R-0131 already allocated; do not reuse). **US-0133** / **US-0134** / **US-0135** / **US-0136** / **US-0137** / **US-0138** DONE — compose only; do not reopen. **BUG-0020** DONE — do not reopen.
- **Research anchor**: `docs/engineering/research.md` **`## R-0132`** (DQ1–DQ10 LOCKED). Discovery D1–D10 not rewritten. Do not wipe R-0120..R-0131. Do not reuse R-0130 (US-0138) or R-0131 (BUG-0021).
- **Approach**: **A1 (A\*)** recommended. Reject A2 (`runtime-core` fold), A3 (sibling public `aft-adapter` this story), A4 (load `@cortexkit/aft-pi`), A5 (in-process AFT), A6 (`its-indexd` now), A7 (learned ranking / LLM compression), A8 (extend DEC-0038), A9 (rewrite `materialize_codebase_map.py`), A10 (new RuntimeConfig context domain), A11 (SQLite pack persist), A12 (rewrite PolicyEngine/config/auth/KernelBridge/`noTools`), A13 (fail-closed empty pack).
- **Companion DEC**: **DEC-0139** Required → Accepted in `/architecture`. Do **not** create `decisions/DEC-0139.md` this phase. Do **not** author `# US-0139`. Recommend architecture H1 **`# US-0139`** (not `## US-`).

### Closed questions DQ1–DQ10

| DQ | Topic | Resolution | LOCK |
|----|-------|------------|------|
| DQ1 | Package + inject | `code-intelligence` + `context-engine` (no Pi); nested AFT read adapter; ToolBroker injects provider | LOCKED |
| DQ2 | AFT process | Sidecar warm process per repo root; read allowlist; `INTEL_MUTATION_DENIED`; fake adapter CI | LOCKED |
| DQ3 | Ranking + budget | Deterministic weights; TOKEN_PROFILE caps; no new RuntimeConfig domain | LOCKED |
| DQ4 | Exclusion | context-engine assembler owns exclude; HOT/WARM/COLD compose; fill US-0136 pack-hash stub | LOCKED |
| DQ5 | Hash + refs | Owned pack envelope SHA-256; do not extend DEC-0038; never secrets/full source | LOCKED |
| DQ6 | codebase-map | Compose `materialize_codebase_map.py`; derived map not index DB | LOCKED |
| DQ7 | Benchmark | Harness + fixtures; `its-indexd` OUT pending evidence | LOCKED |
| DQ8 | Degradation | Partial pack + `INTEL_*`/`CONTEXT_*`; incremental `refresh(changes)` | LOCKED |
| DQ9 | Kernel compose | Unstub existing `itsm_*`; empty loader + `noTools` + KernelBridge + policy tables held | LOCKED |
| DQ10 | Tests | 12 `test_us0139_*` Win+Linux fake-model + fake-AFT | LOCKED |

### Architecture seeds

- Author `# US-0139` + **DEC-0139** (Accepted).
- Seeds T-anch + T-001..T-010 (11 ≤ SPRINT_MAX_TASKS=12).
- Do not expand US-0140+ ACs. Do not amend isolation loader internals / `noTools` / KernelBridge / auth-models / PolicyEngine tables / config loaders. Do not implement application packages this phase.

### Runtime proof (DEC-0038)

- `runtime_proof_id=rp-auto-20260913-us0139-research-techlead-20260913T171500Z-US-0139`
- `proof_hash=D93CCEC8331FF46E4379CCAC53672D45C25DC79F44D241DC4FFF2724FCF2B465`
- `proof_ttl=2026-09-13T18:15:00Z`
- Hash via `from scripts.token_cost_lib import compute_strict_proof_hash` (positional; compact sorted-key JSON).
- Canonical hashed payload: `{"orchestrator_run_id":"auto-20260913-us0139","phase_id":"research","proof_issued_at":"2026-09-13T17:15:00Z","proof_ttl_seconds":3600,"role":"tech-lead","runtime_proof_id":"rp-auto-20260913-us0139-research-techlead-20260913T171500Z-US-0139"}`
- Isolation extras (not hashed): `delivery_mode=ultra_lean`, `macro_phase=plan`, `model_id=cursor-grok-4.6-high`, `sprint_id=none`, `story_id=US-0139`
- `hash_recompute_confirmation=true` (compute_strict_proof_hash → D93CCEC8331FF46E4379CCAC53672D45C25DC79F44D241DC4FFF2724FCF2B465)
- Consumed discovery proof: `rp-auto-20260913-us0139-discovery-po-20260913T165500Z-US-0139` / `C49A557A4028330D420A97DFEC8D53472F3BF26BCDAB948D13A4C9270FCCE881` — RUNTIME_PROOF_VALID (MATCH before TTL `2026-09-13T17:55:00Z`; consumed_at `2026-09-13T17:15:00Z`; independent recompute MATCH)
- Consumed critic proof: `rp-auto-20260913-us0139-sovereign-critic-techlead-20260913T170500Z-US-0139` / `9C5FDD68B6EB59577B6CF4E5CBE6E7969CE418AA4D700B65F0CB0C994FDE28CB` — RUNTIME_PROOF_VALID (MATCH before TTL `2026-09-13T18:05:00Z`)

### Isolation + stop

- `phase_id=research`, `role=tech-lead`, `story_id=US-0139`, `model_id=cursor-grok-4.6-high`, `fresh_context_marker=tl-US0139-research-20260913T171500Z-fresh`
- `evidence_ref=docs/engineering/research.md ## R-0132; docs/product/backlog.md ## US-0139 research_notes; docs/engineering/state.md research checkpoint; docs/engineering/decisions.md ## DEC-0139 Required stub; handoffs/resume_brief.md`
- **Hot-surface note**: Appended (not prepended) so triad oldest-prefix rollover retains this newest section. Post-append `--check` → STATE_ARCHIVE_REQUIRED `state` 1299/1200 → `arch_linkage_guard.py --pre` exit 0 → `--rollover` `rollover_complete units=2` pack_state=`docs/engineering/state-archive/state-pack-20260913-cb.md` (archived `## Execute checkpoint — US-0138 / S0144` through `## Sovereign-critic checkpoint — execute US-0138`; archived_body_lines=153; preamble_lines=11; retained_body_lines=1146) → `--post` exit 0; architecture not rolled; po_to_tl not rolled; final `--check` PASS (`state` 1146/1200).
- **Status**: US-0139 remains **OPEN**. **Next**: sovereign-critic of research, then `/architecture` in fresh **tech-lead** subagent. Do not spawn architecture or critic from this research chat. STOP.

