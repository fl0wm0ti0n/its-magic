# State archive pack (2026-09-13)

- Rollover trigger: `STATE_HOT_MAX_LINES=1200, STATE_HOT_MAX_CHECKPOINTS=80`
- Source: `docs/engineering/state.md`
- Archived units (oldest first, contiguous prefix): 2
- Retained units in hot file: 14
- First archived heading: `## Architecture checkpoint — BUG-0020 / auto-20260913-bug0020 (role=tech-lead)`
- Last archived heading: `## Sovereign-critic checkpoint — architecture BUG-0020 / auto-20260913-bug0020 (role=tech-lead critic)`
- Verification tuple (mandatory):
  - archived_body_lines=148
  - preamble_lines=11
  - retained_body_lines=1163

---

## Architecture checkpoint — BUG-0020 / auto-20260913-bug0020 (role=tech-lead)

- phase_id=architecture
- role=tech-lead
- bug_id=BUG-0020
- story_id=BUG-0020
- sprint_id=none (pending — materialize at /sprint-plan)
- orchestrator_run_id=auto-20260913-bug0020
- parent_orchestrator_run_id=cursor-20260913-BUG0020-intake
- delivery_mode=ultra_lean
- macro_phase=plan (architecture PASS; sprint-plan remaining)
- model_id=cursor-grok-4.6 (CROSS_MODEL_REVIEW=1 — required on isolation)
- AUTO_QUIET=1
- fresh_context_marker=tl-BUG0020-architecture-20260912T232500Z-fresh
- timestamp=2026-09-12T23:25:00Z
- verdict=ARCHITECTURE_PASS (E2 LOCKED; decision_gate=false; no companion DEC)
- backlog_status=OPEN (### BUG-0020 — architecture_notes appended; Status OPEN)
- acceptance_BUG-0020=unchecked (unchanged)
- sibling_boundary=BUG-0019/BUG-0018/BUG-0017/BUG-0015/BUG-0016 DONE out of scope; US-0133..US-0148 not mutated; US-0135 not drained; Cursor `/auto` do-not-touch
- architecture_anchor=docs/engineering/architecture.md # BUG-0020
- research_anchor=R-0126 (compose R-0125 / R-0124; do not wipe; no R-0127)
- approach=E2 (keep editor.add; C-limb CLI TUI /auto via tui.json; desktop-visible OPENCODE_AUTO_DESKTOP_COMMAND_INFO_LISTING_UNSUPPORTED; 8 test_bug0020_*)
- seeds=T-anch + T-001..T-007 (8 ≤ SPRINT_MAX_TASKS=12)
- next_scheduled_phase=/sprint-plan (fresh tech-lead)
- stop_condition=STOP after architecture PASS. Orchestrator spawns /sprint-plan in fresh tech-lead subagent (BUG-0006; may insert sovereign-critic of architecture first). Do NOT spawn sprint-plan from this tech-lead subagent. Do NOT mark BUG-0020 DONE. Do NOT tick acceptance. Do NOT reopen BUG-0019..BUG-0015. Do NOT restore STOP-only auto.md. Do NOT allocate a companion DEC.

### Isolation evidence (US-0048 / DEC-0029) — architecture BUG-0020

- phase_id=architecture
- role=tech-lead
- model_id=cursor-grok-4.6 (CROSS_MODEL_REVIEW=1 — required)
- fresh_context_marker=tl-BUG0020-architecture-20260912T232500Z-fresh (NEW per US-0048 / BUG-0006; not reused from tl-BUG0020-research-20260912T231000Z-fresh)
- timestamp=2026-09-12T23:25:00Z (UTC)
- orchestrator_run_id=auto-20260913-bug0020
- evidence_ref=docs/engineering/architecture.md # BUG-0020; docs/product/backlog.md ### BUG-0020 architecture_notes; docs/engineering/decisions.md compact index (no companion DEC); docs/engineering/research.md ## R-0126; handoffs/po_to_tl.md Architecture handoff BUG-0020; .opencode/plugins/orchestrator.ts editor.add (name auto); .opencode/plugins/its-magic-auto/{index.ts,tui.ts} present; absent .opencode/commands/auto.md, .opencode/tui.json, .opencode/cli.json (execute will ship tui.json); this state checkpoint
- Fresh tech-lead subagent per BUG-0006 / US-0048 isolation; no prior chat history carried forward. Narrow-read only. No .env reads, no credentials, no Status DONE flip, no acceptance tick, no execute-surface mutation, no /sprint-plan spawn.

### Strict runtime proof (DEC-0038) — architecture

- runtime_proof_id=rp-auto-20260913-bug0020-architecture-techlead-20260912T232500Z-BUG-0020
- phase_id=architecture, role=tech-lead, story_id=BUG-0020, sprint_id=none
- proof_issued_at=2026-09-12T23:25:00Z
- proof_ttl_seconds=3600, proof_ttl=2026-09-13T00:25:00Z
- proof_hash=92D10D4743D65A2F7AF276A45749FB57DFA15593254213488026D10171C2EC87
- Hash via `from scripts.token_cost_lib import compute_strict_proof_hash` (compact sorted-key JSON; not `compute_proof_hash.py` default spaces).
- Canonical hashed payload: {"orchestrator_run_id":"auto-20260913-bug0020","phase_id":"architecture","proof_issued_at":"2026-09-12T23:25:00Z","proof_ttl_seconds":3600,"role":"tech-lead","runtime_proof_id":"rp-auto-20260913-bug0020-architecture-techlead-20260912T232500Z-BUG-0020"}
- Isolation extras (not hashed): delivery_mode=ultra_lean; macro_phase=plan; model_id=cursor-grok-4.6; sprint_id=none; story_id=BUG-0020
- hash_recompute_confirmation=true (compute_strict_proof_hash → 92D10D4743D65A2F7AF276A45749FB57DFA15593254213488026D10171C2EC87)
- Consumed research proof: rp-auto-20260913-bug0020-research-techlead-20260912T225800Z-BUG-0020 / CD22980C635030A79DAC0705CFA0DEF87C64CF10A3279DEC46E97BCBE7C74CC8 — RUNTIME_PROOF_VALID MATCH at 2026-09-12T23:25:00Z before ttl 2026-09-12T23:58:00Z (independent Python recompute byte-identical)

### Architecture locks summary

| ID | Lock |
|----|------|
| E2 | Honest host-cannot-do-both on desktop Command.Info; keep editor.add; C-limb CLI TUI /auto via tui.json; desktop-visible listing token |
| tui.json | Ship `$schema` + `plugin: ["./plugins/its-magic-auto/tui.ts"]`; CLI-TUI-only; no cli.json; no plugin-local tui.json |
| Token | OPENCODE_AUTO_DESKTOP_COMMAND_INFO_LISTING_UNSUPPORTED (no bikeshed; not TUI-toast-only) |
| Tests | 8 test_bug0020_* contract tests; keep test_bug0018_*; compose-only test_bug0019_* |
| Upgrade | Copy-if-absent / JSONC-merge tui.json; still prune leftover auto.md |
| DEC | none — cite R-0126 |

### Triad hot-surface verification tuple (DEC-0054) — architecture BUG-0020

- surface=docs/engineering/architecture.md (# BUG-0020 H1 append before US-0090 tail) + docs/engineering/state.md (isolation + architecture checkpoint append-bottom) + handoffs/po_to_tl.md (architecture handoff append-newest)
- companion=docs/product/backlog.md architecture_notes; docs/engineering/decisions.md compact index (no DEC file)
- pre_write: `--check` PASS; `baseline_h2_count=0`
- post_append: `arch_linkage_guard.py --pre` exit 0 → `enforce-triad-hot-surface.py --rollover` `rollover_complete units=1,1,2` pack_state=`docs/engineering/state-archive/state-pack-20260912-br.md` (archived `## Sovereign-critic checkpoint — execute BUG-0019 / S0139 / auto-20260912-bug0019 (role=tech-lead critic)`; archived_body_lines=68; preamble_lines=11; retained_body_lines=1144) pack_po=`handoffs/archive/po-to-tl-pack-20260912-l.md` (archived `## Intake handoff — BUG-0018 OpenCode markdown /auto wins over plugin execute`; archived_body_lines=22; retained_body_lines=645) pack_arch=`docs/engineering/architecture-archive/architecture-pack-20260912-b.md` (archived `# US-0127` through `# US-0128`; archived_body_lines=263; preamble_lines=1; retained_body_lines=2975) → `arch_linkage_guard.py --post` exit 0; heading policy `--check-arch-heading-policy --baseline-h2-count 0` PASS; `materialize_codebase_map.py --trigger architecture` `[CODEBASE_MAP_OK] preserved_existing`; final `--check` PASS (`state` 1145/1200 units=15/80; `po_to_tl` 646/650 units=16/60; `architecture` 2975/3000 units=21/120)
- artifact_ordering: architecture.md H1 append; backlog notes append; decisions.md index prepend; po_to_tl.md append-newest; state.md append-bottom (DEC-0040)
- Active context surface preamble present
- pack_ref=docs/engineering/state-archive/state-pack-20260912-br.md; handoffs/archive/po-to-tl-pack-20260912-l.md; docs/engineering/architecture-archive/architecture-pack-20260912-b.md

## Sovereign-critic checkpoint — architecture BUG-0020 / auto-20260913-bug0020 (role=tech-lead critic)

- phase_id=sovereign-critic
- role=tech-lead (critic)
- bug_id=BUG-0020 (Status OPEN — not flipped DONE)
- story_id=BUG-0020
- sprint_id=none (pending — materialize at /sprint-plan)
- orchestrator_run_id=auto-20260913-bug0020
- delivery_mode=ultra_lean
- macro_phase=plan
- reviewed_phase_id=architecture
- producer_role=tech-lead
- producer_model_id=cursor-grok-4.6
- critic_model_id=composer-2.5-fast
- degraded_mode=false
- model_id=composer-2.5-fast (CROSS_MODEL_REVIEW=1 — required on isolation)
- fresh_context_marker=critic-BUG0020-architecture-20260912T233500Z-fresh
- timestamp=2026-09-12T23:35:00Z
- verdict=PASS
- blocking_count=0
- anti_slop_aggregate=9
- lenses=challenger+architect+subtractor (all three)
- finding_ids=bug0020arc-challenger-001,bug0020arc-architect-002,bug0020arc-subtractor-003
- issue_keys=ik_bug0020_arc_proof_e2_locked,ik_bug0020_arc_layer_sprintplan_owns,ik_bug0020_arc_scope_yagni_pass
- architecture_confirmed=ARCHITECTURE_PASS; E2 LOCKED; decision_gate=false; no companion DEC; cite R-0126
- backlog_status=OPEN (### BUG-0020 — Status OPEN; architecture_notes present; acceptance unchecked)
- sibling_boundary=BUG-0019 DONE not reopened (acceptance [x] held); BUG-0018/0017/0015/0016 DONE out of scope; US-0135+ not drained; Cursor `/auto` do-not-touch
- producer_runtime_proof_id=rp-auto-20260913-bug0020-architecture-techlead-20260912T232500Z-BUG-0020
- producer_proof_hash=92D10D4743D65A2F7AF276A45749FB57DFA15593254213488026D10171C2EC87 (MATCH)
- producer_proof_ttl=2026-09-13T00:25:00Z
- proof_consume=RUNTIME_PROOF_VALID at 2026-09-12T23:35:00Z before ttl (hash MATCH)
- producer_proof_hash_recomputed=true (critic independent Python compute_strict_proof_hash — byte-identical MATCH)
- producer_fresh_context_marker=tl-BUG0020-architecture-20260912T232500Z-fresh
- independent_checks=proof SHA-256 MATCH+not-STALE; Status OPEN; acceptance unchecked; BUG-0019 DONE [x] not reopened; # BUG-0018/# BUG-0019 historical bodies not rewritten; no companion DEC file; E2 locked (editor.add retained + C-limb tui.json + desktop token); 8 test_bug0020_* seeds T-anch+T-001..T-007; auto.md absent (active+template); tui.json absent (execute will ship); its-magic-auto/{index.ts,tui.ts} present; orchestrator.ts BUG-0015 attach present; consumed research proof MATCH CD22980C635030A79DAC0705CFA0DEF87C64CF10A3279DEC46E97BCBE7C74CC8; no /sprint-plan spawn from critic (BUG-0006); sovereign_critic_validate.py --enforce PASS; US-0127 auto_resolve_nonblocking_for_run resolved 3 informational rows
- next_scheduled_phase=sprint-plan
- next_scheduled_role=tech-lead
- stop_condition=STOP after sovereign-critic PASS. Orchestrator MUST Task-spawn /sprint-plan in fresh tech-lead subagent (BUG-0006). Do NOT spawn /sprint-plan from this critic. Do NOT mark BUG-0020 DONE. Do NOT tick acceptance. Do NOT reopen BUG-0019. Do NOT restore STOP-only auto.md.

### Isolation evidence (US-0048 / DEC-0029 / US-0104 v2) — sovereign-critic of architecture BUG-0020

- phase_id=sovereign-critic
- role=tech-lead
- model_id=composer-2.5-fast (CROSS_MODEL_REVIEW=1 — required)
- fresh_context_marker=critic-BUG0020-architecture-20260912T233500Z-fresh (NEW per US-0048 / BUG-0006; not reused from tl-BUG0020-architecture-20260912T232500Z-fresh)
- timestamp=2026-09-12T23:35:00Z (UTC)
- orchestrator_run_id=auto-20260913-bug0020
- evidence_ref=handoffs/sovereign_critic_findings.jsonl (bug0020arc-challenger-001, bug0020arc-architect-002, bug0020arc-subtractor-003) + docs/engineering/architecture.md # BUG-0020 + docs/product/backlog.md ### BUG-0020 architecture_notes + docs/product/acceptance.md BUG-0020 + handoffs/po_to_tl.md Architecture handoff BUG-0020 + absent .opencode/commands/auto.md + absent .opencode/tui.json + .opencode/plugins/orchestrator.ts attach + .opencode/plugins/its-magic-auto/{index.ts,tui.ts} + docs/engineering/research.md ## R-0126 + docs/engineering/state.md (producer architecture checkpoint + this checkpoint)
- Fresh tech-lead critic subagent per BUG-0006 / US-0048 isolation; three-lens jury; narrow-read only. No .env reads, no credentials, no BUG-0020 Status mutation, no BUG-0019 reopen, no intake JSON mutation, no /sprint-plan spawn from this subagent.
- Producer proof consumed: rp-auto-20260913-bug0020-architecture-techlead-20260912T232500Z-BUG-0020 (92D10D4743D65A2F7AF276A45749FB57DFA15593254213488026D10171C2EC87) — RUNTIME_PROOF_VALID; consumed at 2026-09-12T23:35:00Z before ttl 2026-09-13T00:25:00Z.

### Strict runtime proof (DEC-0038) — sovereign-critic

- runtime_proof_id=rp-auto-20260913-bug0020-sovereign-critic-techlead-20260912T233500Z-BUG-0020
- phase_id=sovereign-critic, role=tech-lead, story_id=BUG-0020, sprint_id=none
- proof_issued_at=2026-09-12T23:35:00Z
- proof_ttl_seconds=3600
- proof_ttl=2026-09-13T00:35:00Z
- proof_hash=3DA2F277B00C10136376479B8FEC5556538BD55121A300BDE3Cdda94462CF34F
- Canonical hashed payload: {"orchestrator_run_id":"auto-20260913-bug0020","phase_id":"sovereign-critic","proof_issued_at":"2026-09-12T23:35:00Z","proof_ttl_seconds":3600,"role":"tech-lead","runtime_proof_id":"rp-auto-20260913-bug0020-sovereign-critic-techlead-20260912T233500Z-BUG-0020"}
- Isolation extras (not hashed): delivery_mode=ultra_lean; macro_phase=plan; model_id=composer-2.5-fast; sprint_id=none; story_id=BUG-0020

### Non-blocking carry-forwards (informational; auto-resolved US-0127)

- NB1 (challenger / bug0020arc-challenger-001): proof MATCH+not-STALE; E2 locked; R1 operator-stays-on-desktop tension non-blocking — C-limb CLI TUI /auto + runbook + desktop fail-closed token satisfy D1 documented-equivalent.
- NB2 (architect / bug0020arc-architect-002): sprint-plan owns T-anch..T-007 materialization; execute owns tui.json ship + emitDesktopCommandInfoListingUnsupported wiring + 8 tests; architecture does not spawn sprint-plan.
- NB3 (subtractor / bug0020arc-subtractor-003): Do not spawn /sprint-plan from critic (BUG-0006); no DEC-0124/0125 body rewrite; no DONE flip; no BUG-0019 reopen; no auto.md restore.

### Triad hot-surface verification tuple (DEC-0054) — sovereign-critic architecture BUG-0020

- surface=docs/engineering/state.md (isolation + critic checkpoint append-bottom)
- companion=handoffs/sovereign_critic_findings.jsonl (3 lens rows appended)
- pre_write: `--check` → `STATE_ARCHIVE_REQUIRED` `state` 1221/1200 units=16/80
- post_append: `arch_linkage_guard.py --pre` exit 0 → `enforce-triad-hot-surface.py --rollover` `rollover_complete units=1` pack_state=`docs/engineering/state-archive/state-pack-20260912-bs.md` (archived `## QA checkpoint — BUG-0019 / S0139 / auto-20260912-bug0019 (role=qa)`; archived_body_lines=62; preamble_lines=11; retained_body_lines=1159) → `arch_linkage_guard.py --post` exit 0; final `--check` PASS (`state` 1159/1200 units=15/80)
- artifact_ordering: sovereign_critic_findings.jsonl append; state.md append-bottom (DEC-0040)
- Active context surface preamble present
- pack_ref=docs/engineering/state-archive/state-pack-20260912-bs.md

