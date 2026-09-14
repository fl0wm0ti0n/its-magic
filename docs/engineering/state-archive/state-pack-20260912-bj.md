# State archive pack (2026-09-12)

- Rollover trigger: `STATE_HOT_MAX_LINES=1200, STATE_HOT_MAX_CHECKPOINTS=80`
- Source: `docs/engineering/state.md`
- Archived units (oldest first, contiguous prefix): 1
- Retained units in hot file: 16
- First archived heading: `## Discovery checkpoint — BUG-0019 / auto-20260912-bug0019 (role=po)`
- Last archived heading: `## Discovery checkpoint — BUG-0019 / auto-20260912-bug0019 (role=po)`
- Verification tuple (mandatory):
  - archived_body_lines=68
  - preamble_lines=11
  - retained_body_lines=1138

---

## Discovery checkpoint — BUG-0019 / auto-20260912-bug0019 (role=po)

- phase_id=discovery
- role=po
- bug_id=BUG-0019
- story_id=BUG-0019
- sprint_id=none (pending)
- orchestrator_run_id=auto-20260912-bug0019
- parent_orchestrator_run_id=cursor-20260912-BUG0019-intake
- delivery_mode=ultra_lean
- macro_phase=spec (intake DONE; discovery PASS)
- model_id=cursor-grok-4.6 (CROSS_MODEL_REVIEW=1 — required on isolation)
- fresh_context_marker=po-BUG0019-discovery-20260912T174000Z-fresh
- timestamp=2026-09-12T17:48:00Z
- verdict=DISCOVERY_PASS (D1..D10 LOCKED; decision_gate=false)
- backlog_status=OPEN (### BUG-0019 — discovery_notes appended; Status OPEN)
- acceptance_BUG-0019=unchecked (unchanged)
- sibling_boundary=BUG-0018/BUG-0017/BUG-0015/BUG-0016 DONE out of scope; US-0133..US-0148 not mutated; US-0135 not drained; Cursor `/auto` do-not-touch
- research_target=R-0124 (compose R-0123; do not wipe R-0120; R1 listing residual live-falsified)
- next_scheduled_phase=/research (fresh tech-lead)
- stop_condition=STOP after discovery PASS. Orchestrator spawns /research in fresh tech-lead subagent (BUG-0006). Do NOT spawn research from this PO subagent. Do NOT mark BUG-0019 DONE. Do NOT tick acceptance. Do NOT reopen BUG-0018. Do NOT restore STOP-only auto.md.

### Isolation evidence (US-0048 / DEC-0029) — discovery BUG-0019

- phase_id=discovery
- role=po
- model_id=cursor-grok-4.6 (CROSS_MODEL_REVIEW=1 — required)
- fresh_context_marker=po-BUG0019-discovery-20260912T174000Z-fresh (NEW per US-0048 / BUG-0006; not reused from intake marker po-BUG0019-intake-20260912T172600Z-fresh)
- timestamp=2026-09-12T17:48:00Z (UTC)
- orchestrator_run_id=auto-20260912-bug0019
- evidence_ref=docs/product/backlog.md ### BUG-0019 discovery_notes; docs/product/vision.md ## Discovery Notes — BUG-0019; handoffs/po_to_tl.md Discovery handoff BUG-0019; docs/engineering/research.md ## R-0123; .opencode/plugins/orchestrator.ts attach (editor.add name auto); absent .opencode/commands/auto.md and template/.opencode/commands/auto.md; this state checkpoint
- Fresh PO subagent per BUG-0006 / US-0048 isolation; no prior chat history carried forward. Narrow-read only. No .env reads, no credentials, no intake JSON mutation, no /research spawn from this subagent, no Status DONE flip, no acceptance tick, no execute-surface mutation, no R-0124 authorship.

### Strict runtime proof (DEC-0038) — discovery

- runtime_proof_id=rp-auto-20260912-bug0019-discovery-po-20260912T174800Z-BUG-0019
- phase_id=discovery, role=po, story_id=BUG-0019, sprint_id=none
- proof_issued_at=2026-09-12T17:48:00Z
- proof_ttl_seconds=3600, proof_ttl=2026-09-12T18:48:00Z
- proof_hash=507087DABF2962119695939EA44F128729F382B4BA3AE69AEE3BF7E75DA65CD1
- Canonical payload (sorted-key compact JSON per DEC-0038, lowercase keys only): {"delivery_mode":"ultra_lean","macro_phase":"spec","model_id":"cursor-grok-4.6","orchestrator_run_id":"auto-20260912-bug0019","phase_id":"discovery","proof_issued_at":"2026-09-12T17:48:00Z","proof_ttl_seconds":3600,"role":"po","runtime_proof_id":"rp-auto-20260912-bug0019-discovery-po-20260912T174800Z-BUG-0019","sprint_id":"none","story_id":"BUG-0019"}
- hash_recompute_confirmation=true (Python hashlib SHA-256 of exact canonical payload → 507087DABF2962119695939EA44F128729F382B4BA3AE69AEE3BF7E75DA65CD1)

### Discovery locks summary

| ID | Lock |
|----|------|
| D1 | Palette invokable `/auto` + plugin execute / runAutoLifecycle or OPENCODE_* |
| D2 | Listing/discovery gap (not attach, not CRLF, not markdown-wins STOP) |
| D3 | Supersede R-0120 DQ5 / NB1 listing claim; do not reopen BUG-0018 |
| D4 | Forbid STOP-only auto.md restore; empty markdown insufficient if it owns execute |
| D5 | Fix axes A–E; research picks winner |
| D6 | JSON template vs plugin execute is collision risk; prove or reject |
| D7 | Additive test_bug0019_*; do not weaken test_bug0018_*; no STOP auto.md fixture |
| D8 | Cursor / US-0135+ / reopen 0015-0018 / DEC rewrite / host parser out of scope |
| D9 | Done = list + lifecycle (or OPENCODE_*); peers remain listed |
| D10 | Active↔template parity + upgrade delivers listing surface |

### Triad hot-surface verification tuple (DEC-0054) — discovery BUG-0019

- surface=docs/engineering/state.md (isolation + discovery checkpoint append-bottom) + handoffs/po_to_tl.md (discovery handoff append)
- companion=docs/product/backlog.md discovery_notes; docs/product/vision.md ## Discovery Notes — BUG-0019; handoffs/resume_brief.md (prepend)
- pre_write: STATE hot oversize (1222/1200) from orchestrator materialization; post-append `--check` → `STATE_ARCHIVE_REQUIRED` `state` 1290/1200 units=17/80 + `po_to_tl` 686/650 units=17/60
- post_append: `arch_linkage_guard.py --pre` exit 0 → `enforce-triad-hot-surface.py --rollover` `rollover_complete units=2,2` pack_state=`docs/engineering/state-archive/state-pack-20260912-av.md` (archived `## Architecture checkpoint — US-0134` through `## Sovereign-critic checkpoint — architecture US-0134`; archived_body_lines=141; preamble_lines=11; retained_body_lines=1149) pack_po=`handoffs/archive/po-to-tl-pack-20260912-h.md` (archived `## Architecture handoff — US-0132` through `## Intake handoff — BUG-0017`; archived_body_lines=55; retained_body_lines=631) → `arch_linkage_guard.py --post` exit 0; final `--check` PASS
- artifact_ordering: backlog notes append; vision append-bottom; po_to_tl.md append; state.md append-bottom (DEC-0040); resume_brief.md prepend-top
- Active context surface preamble present
- pack_ref=docs/engineering/state-archive/state-pack-20260912-av.md; handoffs/archive/po-to-tl-pack-20260912-h.md

