# PO to TL archive pack (2026-09-13)

- Rollover trigger: `PO_TO_TL_HOT_MAX_LINES=650, PO_TO_TL_HOT_MAX_SECTIONS=60`
- Source: `handoffs/po_to_tl.md`
- Archived units (oldest first, contiguous prefix): 2
- Retained units in hot file: 13
- First archived heading: `## Intake handoff — BUG-0022 `/auto` Task-spawns inherit parent chat model instead of role_catalog`
- Last archived heading: `## Architecture handoff — US-0139 Persistent code intelligence and bounded context engine`
- Verification tuple (mandatory):
  - archived_body_lines=51
  - retained_body_lines=633

---

## Intake handoff — BUG-0022 `/auto` Task-spawns inherit parent chat model instead of role_catalog

- **Phase completed**: intake (`/intake bug`). **Role**: po. **Bug**: BUG-0022. **Sprint**: (pending). **Verdict**: PASS (`decision_gate=false`).
- **Timestamp**: 2026-09-13T11:37:00Z. **Fresh marker**: `po-BUG0022-intake-20260913T113700Z-fresh`.
- **Writer**: `writer_id=po-cursor-20260913-BUG0022-intake`, `intake_run_id=cursor-20260913-BUG0022-intake`.
- **Routing**: argv `/intake bug` wins over scratchpad `INTAKE_WORK_ITEM_KIND=story`. `selected_pack=small-intake-pack`. `INTAKE_GUIDED_MODE=1`. `WORK_KIND_ROUTING=0` (classifier skipped). `INTAKE_SUBAGENT_FALLBACK=deny`. Next id confirmed `python scripts/bug_issue_validate.py --print-next-id` → **BUG-0022** before write.
- **Evidence**:
  - `handoffs/intake_evidence/BUG-0022-intake-20260913.json` — `[INTAKE_EVIDENCE_VALIDATION_OK]` (pre-write; revalidated after `research_id` R-0133)
  - `python scripts/bug_issue_validate.py --backlog docs/product/backlog.md --check-acceptance` — `[BUG_VALIDATION_OK]`
  - `python scripts/intake_bug_resume_brief_refresh.py --bug-id BUG-0022 --validate-file` — `[INTAKE_RESUME_BRIEF_VALIDATE_OK]`; `intended_resume_phase=discovery`; `resolved_start_phase=discovery`; `resolution_source=resume_brief`; `bug_id=BUG-0022`. In-place `--resume-brief` upsert skipped: historical `## Latest orchestration pointer*` headings would be clobbered; canonical DEC-0069 block prepended via `build_latest_pointer_markdown` (US-0139 / BUG-0021 / prior history retained).
- **Research**: **R-0133** (`docs/engineering/research.md`) — intake-time Cursor docs: `model: inherit` = parent; explicit slug runs regardless. `model_tier_lib.py` / `sovereign_critic_lib.py` **present** (operator missing-file claim live-falsified). Compose **US-0101/US-0102/DEC-0087/DEC-0104**. Live-falsify “role_catalog already active.” Do not wipe **R-0132** (US-0139).
- **Operator ask**: `/auto` must pass `Task.model` from `role_catalog`, not parent inherit. Quotes mapped 1:1 (BUG-0007 distinct): parent inherit vs catalog; scratchpad flags vs isolation parent+hardcoded critic; orchestrator did not pass resolver/critic slugs; missing-file claim (fact-checked present); treat as orchestration bug / pass Task.model from role_catalog.
- **Root cause (intake)**: spawn path used inherit for every producer; critic=`composer-2.5-fast` (catalog **release**, not **critic**). Resolver exists but was not applied to Task `model:`. Copy-to-local.json is insufficient. Role-key alignment (`sa` vs `tech-lead`, missing `qe`/`curator` catalog keys, no closure in `PHASE_LOGICAL_ROLE`) is a follow-on.
- **Duplicate check**: Persist **NEW BUG-0022**. Do **not** reopen US-0101/US-0102 DONE. Do **not** merge **BUG-0021 OPEN** (OpenCode CLI TUI listing). Do **not** reopen BUG-0020 DONE. Do not restore OpenCode `auto.md`. Do not mutate US-0133..US-0148. Do not drain US-0139+.
- **Decomposition**: **single_bug** — operator already invoked `/intake bug` (treat as **accept**).
- **Alternatives**: (1) persist BUG-0022; pass Task.model from role_catalog — **recommended**; (2) reopen US-0102 — **reject**; (3) merge BUG-0021 — **reject**; (4) copy local.json only — **insufficient**.
- **Scope for `/discovery`**: lock spawn wiring (`resolve_model_for_phase` / `select_critic_model` → Task `model:`); fail-closed vs attested fallback; critic `roles.critic`; phase→role catalog keys. Do not reopen US-0101/0102 ACs. Do not merge BUG-0021.
- **Risks**: R1 — agent frontmatter `inherit` on `po.mdc`/`release.mdc` overrides even if Task passes a slug (medium); R2 — silent `MODEL_FALLBACK=inherit` hides lookup misses (high); R3 — critic hardcoded to release slug while `roles.critic` unused (high); R4 — file-existence tests for catalog/resolver close the bug without changing spawn (high).
- **Isolation**: `phase_id=intake`; `role=po`; `bug_id=BUG-0022`; `fresh_context_marker=po-BUG0022-intake-20260913T113700Z-fresh`; `timestamp=2026-09-13T11:37:00Z`; `model_id=cursor-grok-4.6` (this intake is itself an instance of the bug); `evidence_ref=docs/product/backlog.md ### BUG-0022, docs/product/acceptance.md BUG-0022 row, handoffs/intake_evidence/BUG-0022-intake-20260913.json, docs/engineering/research.md ## R-0133, this handoff`.
- **Hot-surface note**: Appended (not prepended) so triad oldest-prefix rollover retains this newest section (same policy as BUG-0021 intake). Post-append `--check` → STATE_ARCHIVE_REQUIRED `state` 1230/1200 + `po_to_tl` 664/650 → `arch_linkage_guard.py --pre` exit 0 → `--rollover` `{"boundary":"triad-rollover|state","moved":1,"pack_ref":"docs/engineering/state-archive/state-pack-20260913-cc.md","retained_checkpoints":12,"retained_lines":1130}` (archived `## QA checkpoint — US-0138 / S0144`) + `{"boundary":"triad-rollover|po_to_tl","moved":1,"pack_ref":"handoffs/archive/po-to-tl-pack-20260913-k.md","retained_lines":615,"retained_sections":13}` (archived `## Research handoff — US-0135`; archived_body_lines=49; retained_body_lines=615) → `--post` exit 0; architecture not rolled; Intake did not append `docs/engineering/state.md`. Final `--check` PASS (`state` 1130/1200; `po_to_tl` 615/650).
- **Status**: OPEN per US-0045. **BUG-0021 remains OPEN**. **US-0139 remains OPEN**. **Next**: `/discovery` (fresh **po**) for **BUG-0022**, or `/auto bug-target=BUG-0022`. Do not run discovery/architecture/execute from this intake chat. STOP.

## Architecture handoff — US-0139 Persistent code intelligence and bounded context engine

- **Phase completed**: architecture. **Role**: tech-lead. **Story**: US-0139 only. **Sprint**: (pending — materialize S0145 at `/sprint-plan`). **Verdict**: PASS (`decision_gate=false`).
- **Timestamp (UTC)**: 2026-09-13T17:35:00Z. **Fresh marker**: `tl-US0139-architecture-20260913T173500Z-fresh`.
- **Orchestrator**: `orchestrator_run_id=auto-20260913-us0139`, parent=`auto-20260913-us0138`, `delivery_mode=ultra_lean`, macro=`plan` (architecture = second of research+architecture+sprint-plan), `model_id=cursor-grok-4.6-high`, CROSS_MODEL_REVIEW=1, AUTO_QUIET=1, EARLY_RESEARCH=1 (consumed from R-0132; **no new R-id**).
- **Architecture anchor**: `docs/engineering/architecture.md` **`# US-0139`**. Research **`R-0132`** (DQ1–DQ10 unchanged). Discovery D1–D10 unchanged. Companion **DEC-0139 Accepted**.
- **Approach**: **A1 (A\*)** LOCKED — `@its-magic/code-intelligence` + `@its-magic/context-engine` (no Pi) + nested AFT **read** adapter sidecar (`AFT_BINARY_VERSION=0.55.1`; fake adapter in CI) + ToolBroker unstub existing `itsm_search`/`outline`/`symbol`/`references`/`callers`/`impact` (`LIVE_INTEL_TOOLS`; do not rewrite PolicyEngine tables) + deterministic rank + TOKEN_PROFILE caps (lean 6k/8/16, balanced 12k/16/32, full 24k/32/64) + assembler exclusion + pack source-refs + SHA-256 content hash (do not extend DEC-0038) + compose `materialize_codebase_map.py` + `codebase-map.meta.json` + benchmark harness with `its-indexd` OUT + partial-pack `INTEL_*`/`CONTEXT_*` + 12 `test_us0139_*`. Seeds T-anch + T-001..T-010 (11 ≤ 12). **Execute owns packages.**
- **Rejected**: A2–A13 per R-0132 / DEC-0139.
- **Pins**: rank weights exact_symbol 100 … architecture_decision 20; `MMR_LAMBDA=0.7`; sovereign digest 1500 tokens; `INTEL_MUTATION_DENIED` on AFT writes.
- **Sibling boundary**: US-0140..US-0148 OPEN — OUT OF SCOPE. US-0133/0134/0135/0136/0137/0138 DONE — compose only; do not reopen. BUG-0020 DONE — do not reopen. BUG-0021 OPEN — not mutated. Do not create `standalone/packages/code-intelligence` or `context-engine` or `sprints/S0145/` this phase. Do not spawn `/sprint-plan` from this architecture chat.

### Runtime proof (DEC-0038)

- `runtime_proof_id=rp-auto-20260913-us0139-architecture-techlead-20260913T173500Z-US-0139`
- `proof_hash=93664305B6847E244901E87027891EA2EC9FA4E23F9A66B5CC5BC00293C0F51C`
- `proof_ttl=2026-09-13T18:35:00Z`
- Hash via `from scripts.token_cost_lib import compute_strict_proof_hash` (compact sorted-key JSON).
- Canonical hashed payload: `{"orchestrator_run_id":"auto-20260913-us0139","phase_id":"architecture","proof_issued_at":"2026-09-13T17:35:00Z","proof_ttl_seconds":3600,"role":"tech-lead","runtime_proof_id":"rp-auto-20260913-us0139-architecture-techlead-20260913T173500Z-US-0139"}`
- Isolation extras (not hashed): `delivery_mode=ultra_lean`, `macro_phase=plan`, `model_id=cursor-grok-4.6-high`, `sprint_id=none`, `story_id=US-0139`
- Consumed research proof: `rp-auto-20260913-us0139-research-techlead-20260913T171500Z-US-0139` / `D93CCEC8331FF46E4379CCAC53672D45C25DC79F44D241DC4FFF2724FCF2B465` — RUNTIME_PROOF_VALID (MATCH before TTL `2026-09-13T18:15:00Z`)
- Consumed critic proof: `rp-auto-20260913-us0139-sovereign-critic-techlead-20260913T172500Z-US-0139` / `6BCC5D7C6567AD1A31DCC5426699D9E2430245EAE400B4F0C7F5D24FD3791F65` — MATCH; anti_slop=10; 0 blocking; degraded_mode=false

### Isolation + stop

- `phase_id=architecture`, `role=tech-lead`, `story_id=US-0139`, `fresh_context_marker=tl-US0139-architecture-20260913T173500Z-fresh`, `model_id=cursor-grok-4.6-high`
- `evidence_ref=docs/engineering/architecture.md # US-0139; decisions/DEC-0139.md; docs/engineering/research.md ## R-0132; docs/product/backlog.md ## US-0139; docs/engineering/state.md architecture checkpoint; handoffs/resume_brief.md`
- **Hot-surface note**: Appended newest H1 `# US-0139` (not `## US-`); `baseline_h2_count=0`; heading policy PASS (after=0). Post-append `--check` → STATE_ARCHIVE_REQUIRED `state` 1207/1200 + `architecture` 3129/3000 → `arch_linkage_guard.py --pre` exit 0 → `--rollover` pack_state=`docs/engineering/state-archive/state-pack-20260913-cd.md` (archived qa-critic US-0138; moved=1; retained_body_lines=1132) pack_arch=`docs/engineering/architecture-archive/architecture-pack-20260913-d.md` (archived `# US-0133`; retained_lines=2997) → `--post` exit 0. Then po_to_tl 708/650 → `--pre` exit 0 → `--rollover` pack_po=`handoffs/archive/po-to-tl-pack-20260913-l.md` (archived US-0135 architecture + US-0136 discovery; moved=2; retained_body_lines=602) → final `--check` PASS (`state` 1198/1200; `architecture` 2997/3000; `po_to_tl` 602/650). `[CODEBASE_MAP_OK] preserved_existing`.
- **Status**: US-0139 remains **OPEN**. **Next**: sovereign-critic of architecture, then `/sprint-plan` S0145 in fresh **tech-lead** subagent. ultra_lean: plan-verify skipped after sprint-plan. Do not spawn sprint-plan from this architecture chat. STOP.

