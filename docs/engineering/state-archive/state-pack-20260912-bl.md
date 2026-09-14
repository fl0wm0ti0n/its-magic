# State archive pack (2026-09-12)

- Rollover trigger: `STATE_HOT_MAX_LINES=1200, STATE_HOT_MAX_CHECKPOINTS=80`
- Source: `docs/engineering/state.md`
- Archived units (oldest first, contiguous prefix): 1
- Retained units in hot file: 16
- First archived heading: `## Research checkpoint — BUG-0019 / auto-20260912-bug0019 (role=tech-lead)`
- Last archived heading: `## Research checkpoint — BUG-0019 / auto-20260912-bug0019 (role=tech-lead)`
- Verification tuple (mandatory):
  - archived_body_lines=69
  - preamble_lines=11
  - retained_body_lines=1149

---

## Research checkpoint — BUG-0019 / auto-20260912-bug0019 (role=tech-lead)

- phase_id=research
- role=tech-lead
- bug_id=BUG-0019
- story_id=BUG-0019
- sprint_id=none (pending)
- orchestrator_run_id=auto-20260912-bug0019
- parent_orchestrator_run_id=cursor-20260912-BUG0019-intake
- delivery_mode=ultra_lean
- macro_phase=plan (research = first of research+architecture+sprint-plan)
- model_id=cursor-grok-4.6 (CROSS_MODEL_REVIEW=1 — required on isolation)
- fresh_context_marker=tl-BUG0019-research-20260912T175500Z-fresh
- timestamp=2026-09-12T17:58:00Z
- verdict=RESEARCH_PASS (DQ1..DQ8 LOCKED; winning axis E*; decision_gate=false)
- backlog_status=OPEN (### BUG-0019 — research_notes appended; Status OPEN)
- acceptance_BUG-0019=unchecked (unchanged)
- sibling_boundary=BUG-0018/BUG-0017/BUG-0015/BUG-0016 DONE out of scope; US-0133..US-0148 not mutated; US-0135 not drained; Cursor `/auto` do-not-touch; STOP-only auto.md not restored; DEC-0124/0125 bodies UNCHANGED
- research_anchor=R-0124 (compose R-0123 / R-0120; do not wipe)
- winning_axis=E* (TUI keymap slash listing + retained plugin editor.add execute)
- next_scheduled_phase=/architecture (fresh tech-lead)
- stop_condition=STOP after research PASS. Orchestrator spawns /architecture in fresh tech-lead subagent (BUG-0006). Do NOT spawn architecture from this research subagent. Do NOT mark BUG-0019 DONE. Do NOT tick acceptance. Do NOT reopen BUG-0018. Do NOT restore STOP-only auto.md.

### Isolation evidence (US-0048 / DEC-0029) — research BUG-0019

- phase_id=research
- role=tech-lead
- model_id=cursor-grok-4.6 (CROSS_MODEL_REVIEW=1 — required)
- fresh_context_marker=tl-BUG0019-research-20260912T175500Z-fresh (NEW per US-0048 / BUG-0006; not reused from po-BUG0019-discovery-20260912T174000Z-fresh or critic-BUG0019-discovery-20260912T175000Z-fresh)
- timestamp=2026-09-12T17:58:00Z (UTC)
- orchestrator_run_id=auto-20260912-bug0019
- evidence_ref=docs/engineering/research.md ## R-0124; docs/product/backlog.md ### BUG-0019 research_notes; handoffs/po_to_tl.md Research handoff BUG-0019; .opencode/plugins/orchestrator.ts attach (editor.add name auto); absent .opencode/commands/auto.md and template/.opencode/commands/auto.md; tests/bug0018_*; this state checkpoint
- Fresh tech-lead subagent per BUG-0006 / US-0048 isolation; no prior chat history carried forward. Narrow-read only. No .env reads, no credentials, no /architecture spawn from this subagent, no Status DONE flip, no acceptance tick, no execute-surface mutation, no auto.md restore.

### Strict runtime proof (DEC-0038) — research

- runtime_proof_id=rp-auto-20260912-bug0019-research-techlead-20260912T175800Z-BUG-0019
- phase_id=research, role=tech-lead, story_id=BUG-0019, sprint_id=none
- proof_issued_at=2026-09-12T17:58:00Z
- proof_ttl_seconds=3600, proof_ttl=2026-09-12T18:58:00Z
- proof_hash=D67B1BF49AF607EC472297AD62B949798D51ED92B5CE85B0068CAABB009F3854
- Canonical payload (sorted-key compact JSON per DEC-0038, lowercase keys only): {"delivery_mode":"ultra_lean","macro_phase":"plan","model_id":"cursor-grok-4.6","orchestrator_run_id":"auto-20260912-bug0019","phase_id":"research","proof_issued_at":"2026-09-12T17:58:00Z","proof_ttl_seconds":3600,"role":"tech-lead","runtime_proof_id":"rp-auto-20260912-bug0019-research-techlead-20260912T175800Z-BUG-0019","sprint_id":"none","story_id":"BUG-0019"}
- hash_recompute_confirmation=true (Python hashlib SHA-256 of exact canonical payload → D67B1BF49AF607EC472297AD62B949798D51ED92B5CE85B0068CAABB009F3854)
- consumed_discovery_proof=rp-auto-20260912-bug0019-discovery-po-20260912T174800Z-BUG-0019 / 507087DABF2962119695939EA44F128729F382B4BA3AE69AEE3BF7E75DA65CD1 — RUNTIME_PROOF_VALID MATCH before TTL 2026-09-12T18:48:00Z (recomputed at research issue 2026-09-12T17:58:00Z)

### Research locks summary

| ID | Lock |
|----|------|
| DQ1 | TUI markdown/JSON = Command.Info (template required); editor.add not a list source; keymap slash is separate |
| DQ2 | command.list() / GET /api/command = Command.Info; TUI does not consume editor.add — reject Axis C listing |
| DQ3 | JSON commands.auto+template = 0018-class JSON-win — reject Axis A |
| DQ4 | No md/JSON list-without-template; documented path = TUI keymap slash+run() |
| DQ5 | Additive OPENCODE_AUTO_SLASH_LISTING_UNSUPPORTED; do not reuse MARKDOWN_COLLISION for listing-miss |
| DQ6 | 7 test_bug0019_*; no companion DEC; # BUG-0019 supersedes R-0120 DQ5 / NB1 |
| DQ7 | Upgrade copy-on-add delivers TUI listing files to already-pruned trees; still prune leftover auto.md |
| DQ8 | command.reload() does not list editor.add without markdown — reject as listing fix |
| D5 winner | Axis E* (TUI keymap slash listing + retained plugin execute) |

### Triad hot-surface verification tuple (DEC-0054) — research BUG-0019

- surface=docs/engineering/state.md (isolation + research checkpoint append-bottom) + handoffs/po_to_tl.md (research handoff append)
- companion=docs/product/backlog.md research_notes; docs/engineering/research.md ## R-0124; handoffs/resume_brief.md (prepend)
- pre_write: `--check` exit 1 STATE_ARCHIVE_REQUIRED state 1215/1200 units=16/80 + po_to_tl 672/650 units=16/60
- post_append: `arch_linkage_guard.py --pre` exit 0 → `enforce-triad-hot-surface.py --rollover` `rollover_complete units=1,1` pack_state=`docs/engineering/state-archive/state-pack-20260912-ax.md` (archived `## Sovereign-critic checkpoint — sprint-plan US-0134`; archived_body_lines=66; preamble_lines=11; retained_body_lines=1149) pack_po=`handoffs/archive/po-to-tl-pack-20260912-i.md` (archived `## Discovery handoff — BUG-0017`; archived_body_lines=45; retained_body_lines=627) → `arch_linkage_guard.py --post` exit 0; final `--check` PASS
- artifact_ordering: research.md append; backlog notes append; po_to_tl.md append; state.md append-bottom (DEC-0040); resume_brief.md prepend-top
- Active context surface preamble present
- pack_ref=docs/engineering/state-archive/state-pack-20260912-ax.md; handoffs/archive/po-to-tl-pack-20260912-i.md

