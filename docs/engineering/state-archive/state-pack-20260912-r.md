# State archive pack (2026-09-12)

- Rollover trigger: `STATE_HOT_MAX_LINES=1200, STATE_HOT_MAX_CHECKPOINTS=80`
- Source: `docs/engineering/state.md`
- Archived units (oldest first, contiguous prefix): 1
- Retained units in hot file: 16
- First archived heading: `## Research checkpoint — BUG-0018 / auto-20260912-bug0018 (role=tech-lead)`
- Last archived heading: `## Research checkpoint — BUG-0018 / auto-20260912-bug0018 (role=tech-lead)`
- Verification tuple (mandatory):
  - archived_body_lines=68
  - preamble_lines=11
  - retained_body_lines=1148

---

## Research checkpoint — BUG-0018 / auto-20260912-bug0018 (role=tech-lead)

- phase_id=research
- role=tech-lead
- bug_id=BUG-0018
- story_id=BUG-0018
- sprint_id=none (pending)
- orchestrator_run_id=auto-20260912-bug0018
- delivery_mode=ultra_lean
- macro_phase=plan (research = first canonical phase of plan)
- model_id=cursor-grok-4.6 (CROSS_MODEL_REVIEW=1 — required on isolation)
- fresh_context_marker=tl-BUG0018-research-20260912T094000Z-fresh
- timestamp=2026-09-12T09:50:00Z
- verdict=RESEARCH_PASS (R-0120 DQ1..DQ8 LOCKED; winning axis A; companion_dec=no; decision_gate=false)
- backlog_status=OPEN (### BUG-0018 — research_notes appended; Status OPEN)
- acceptance_BUG-0018=unchecked (unchanged)
- sibling_boundary=BUG-0015/BUG-0016/BUG-0017 DONE out of scope; Symptom B Cursor Task-unavailable not a bug
- research_anchor=R-0120 (compose R-0119 / R-0114; do not wipe)
- winning_axis=A (plugin-only `/auto`; remove colliding `auto.md`; plugin editor.add remains sole owner)
- companion_dec=no (additive `# BUG-0018` supersedes `# BUG-0015` CF1; DEC-0124/0125 bodies UNCHANGED)
- next_scheduled_phase=/architecture (fresh tech-lead)
- stop_condition=STOP after research PASS. Orchestrator spawns sovereign-critic of research then /architecture in fresh tech-lead subagent (BUG-0006). Do NOT spawn architecture from this tech-lead subagent. Do NOT mark BUG-0018 DONE. Do NOT tick acceptance.

### Isolation evidence (US-0048 / DEC-0029) — research BUG-0018

- phase_id=research
- role=tech-lead
- model_id=cursor-grok-4.6 (CROSS_MODEL_REVIEW=1 — required)
- fresh_context_marker=tl-BUG0018-research-20260912T094000Z-fresh (NEW per US-0048 / BUG-0006; not reused from po-BUG0018-discovery-20260912T091900Z-fresh or critic-BUG0018-discovery-20260912T093200Z-fresh)
- timestamp=2026-09-12T09:50:00Z (UTC)
- orchestrator_run_id=auto-20260912-bug0018
- evidence_ref=docs/engineering/research.md ## R-0120; docs/product/backlog.md ### BUG-0018 research_notes; docs/product/acceptance.md BUG-0018 row; handoffs/po_to_tl.md Research handoff BUG-0018; handoffs/resume_brief.md; .opencode/commands/auto.md (LF STOP-only, colliding); .opencode/plugins/orchestrator.ts (BUG-0015 attach present); installer.py upgrade copy-only; docs/engineering/architecture.md # BUG-0015 CF1 (supersede, do not reopen)
- Fresh tech-lead subagent per BUG-0006 / US-0048 isolation; no prior chat history carried forward. Narrow-read only. No .env reads, no credentials, no intake JSON mutation, no /architecture spawn from this subagent, no Status DONE flip, no acceptance tick, no execute-surface mutation, no DEC-0124/0125 body rewrite.
- Producer proof consumed: rp-auto-20260912-bug0018-discovery-po-20260912T092800Z-BUG-0018 (0786CBA6FFED9208970ABE0E22C1CC72683D8B5B0EF2F4076191947E55F2D543) — RUNTIME_PROOF_VALID; consumed at 2026-09-12T09:50:00Z before ttl 2026-09-12T10:28:00Z.

### Strict runtime proof (DEC-0038) — research

- runtime_proof_id=rp-auto-20260912-bug0018-research-techlead-20260912T095000Z-BUG-0018
- phase_id=research, role=tech-lead, story_id=BUG-0018, sprint_id=none
- proof_issued_at=2026-09-12T09:50:00Z
- proof_ttl_seconds=3600, proof_ttl=2026-09-12T10:50:00Z
- proof_hash=6E62DB20F5F4B898E086B6DD8385E3874A5A6DC43C896314F81F6C8D65E3AA0A
- Canonical payload (sorted-key compact JSON per DEC-0038, lowercase keys only): {"delivery_mode":"ultra_lean","macro_phase":"plan","model_id":"cursor-grok-4.6","orchestrator_run_id":"auto-20260912-bug0018","phase_id":"research","proof_issued_at":"2026-09-12T09:50:00Z","proof_ttl_seconds":3600,"role":"tech-lead","runtime_proof_id":"rp-auto-20260912-bug0018-research-techlead-20260912T095000Z-BUG-0018","sprint_id":"none","story_id":"BUG-0018"}
- hash_recompute_confirmation=true (Python hashlib SHA-256 of exact canonical payload → 6E62DB20F5F4B898E086B6DD8385E3874A5A6DC43C896314F81F6C8D65E3AA0A)

### DQ locks summary

| ID | Lock |
|----|------|
| DQ1 | Markdown owns `/auto` when `auto.md` exists; plugin execute does not override |
| DQ2 | reload/later-add do not beat markdown; reject Axis C |
| DQ3 | command.executed not primary for markdown templates |
| DQ4 | CommandDraft add-only; reject Axis D |
| DQ5 | Plugin listing preserves `/auto`; reject Axis B |
| DQ6 | ATTACH_UNSUPPORTED + additive MARKDOWN_COLLISION (no silent STOP) |
| DQ7 | 6 test_bug0018_*; no companion DEC; `# BUG-0018` supersedes CF1 |
| DQ8 | Targeted prune of leftover consumer `auto.md` (upgrade copy-only insufficient) |

### Triad hot-surface verification tuple (DEC-0054) — research BUG-0018

- surface=docs/engineering/state.md (isolation + research checkpoint append-bottom) + handoffs/po_to_tl.md (research handoff append)
- companion=docs/product/backlog.md research_notes; docs/engineering/research.md ## R-0120; handoffs/resume_brief.md (prepend); handoffs/sovereign_decisions/auto-20260912-bug0018.jsonl
- pre_write: `--check` exit 1 STATE_ARCHIVE_REQUIRED (state 1240/1200; po_to_tl 691/650)
- post_append: `arch_linkage_guard.py --pre` → `enforce-triad-hot-surface.py --rollover` units=1,2 pack_state=`docs/engineering/state-archive/state-pack-20260912-b.md` (archived `## Sprint-plan checkpoint — BUG-0017`); pack_po=`handoffs/archive/po-to-tl-pack-20260912.md` (archived US-0118 + BUG-0015/0016 intake); `arch_linkage_guard.py --post`; final `--check` exit 0
- artifact_ordering: research.md append; backlog notes append; po_to_tl.md append; state.md append-bottom (DEC-0040); resume_brief.md prepend-top
- Active context surface preamble present
- pack_ref=docs/engineering/state-archive/state-pack-20260912-b.md; handoffs/archive/po-to-tl-pack-20260912.md

