# State archive pack (2026-09-13)

- Rollover trigger: `STATE_HOT_MAX_LINES=1200, STATE_HOT_MAX_CHECKPOINTS=80`
- Source: `docs/engineering/state.md`
- Archived units (oldest first, contiguous prefix): 1
- Retained units in hot file: 15
- First archived heading: `## Discovery checkpoint — BUG-0020 / auto-20260913-bug0020 (role=po)`
- Last archived heading: `## Discovery checkpoint — BUG-0020 / auto-20260913-bug0020 (role=po)`
- Verification tuple (mandatory):
  - archived_body_lines=71
  - preamble_lines=11
  - retained_body_lines=1189

---

## Discovery checkpoint — BUG-0020 / auto-20260913-bug0020 (role=po)

- phase_id=discovery
- role=po
- bug_id=BUG-0020
- story_id=BUG-0020
- sprint_id=none (pending)
- orchestrator_run_id=auto-20260913-bug0020
- parent_orchestrator_run_id=cursor-20260913-BUG0020-intake
- delivery_mode=ultra_lean
- macro_phase=spec (intake DONE; discovery PASS)
- model_id=cursor-grok-4.6 (CROSS_MODEL_REVIEW=1 — required on isolation)
- AUTO_QUIET=1
- fresh_context_marker=po-BUG0020-discovery-20260912T224500Z-fresh
- timestamp=2026-09-12T22:45:00Z
- verdict=DISCOVERY_PASS (D1..D10 LOCKED; decision_gate=false)
- backlog_status=OPEN (### BUG-0020 — discovery_notes appended; Status OPEN)
- acceptance_BUG-0020=unchecked (unchanged)
- sibling_boundary=BUG-0019/BUG-0018/BUG-0017/BUG-0015/BUG-0016 DONE out of scope; US-0133..US-0148 not mutated; US-0135 not drained; Cursor `/auto` do-not-touch
- research_target=R-0126 (compose R-0125; do not wipe R-0120..R-0125; R-0124 E* listing claim live-falsified)
- next_scheduled_phase=/research (fresh tech-lead)
- stop_condition=STOP after discovery PASS. Orchestrator spawns /research in fresh tech-lead subagent (BUG-0006). Do NOT spawn research from this PO subagent. Do NOT mark BUG-0020 DONE. Do NOT tick acceptance. Do NOT reopen BUG-0019..BUG-0015. Do NOT restore STOP-only auto.md. Do NOT author R-0126. Do NOT write architecture # BUG-0020.

### Isolation evidence (US-0048 / DEC-0029) — discovery BUG-0020

- phase_id=discovery
- role=po
- model_id=cursor-grok-4.6 (CROSS_MODEL_REVIEW=1 — required)
- fresh_context_marker=po-BUG0020-discovery-20260912T224500Z-fresh (NEW per US-0048 / BUG-0006; not reused from intake marker po-BUG0020-intake-20260912T223500Z-fresh)
- timestamp=2026-09-12T22:45:00Z (UTC)
- orchestrator_run_id=auto-20260913-bug0020
- evidence_ref=docs/product/backlog.md ### BUG-0020 discovery_notes; docs/product/vision.md ## Discovery Notes — BUG-0020; handoffs/po_to_tl.md Discovery handoff BUG-0020; docs/engineering/research.md ## R-0125; .opencode/plugins/orchestrator.ts editor.add (name auto); .opencode/plugins/its-magic-auto/{index.ts,tui.ts} present; absent .opencode/commands/auto.md, .opencode/tui.json, .opencode/cli.json (and template twins); this state checkpoint
- Fresh PO subagent per BUG-0006 / US-0048 isolation; no prior chat history carried forward. Narrow-read only. No .env reads, no credentials, no intake JSON mutation, no /research spawn from this subagent, no Status DONE flip, no acceptance tick, no execute-surface mutation, no R-0126 authorship, no architecture # BUG-0020.

### Strict runtime proof (DEC-0038) — discovery

- runtime_proof_id=rp-auto-20260913-bug0020-discovery-po-20260912T224500Z-BUG-0020
- phase_id=discovery, role=po, story_id=BUG-0020, sprint_id=none
- proof_issued_at=2026-09-12T22:45:00Z
- proof_ttl_seconds=3600, proof_ttl=2026-09-12T23:45:00Z
- proof_hash=935A9B7B69DBCBD3A07B4014322814A53C312D9A6A63415A0E6BCAB7FDF030F3
- Hash via `from scripts.token_cost_lib import compute_strict_proof_hash` (compact sorted-key JSON; not `compute_proof_hash.py` default spaces).
- Canonical hashed payload: {"orchestrator_run_id":"auto-20260913-bug0020","phase_id":"discovery","proof_issued_at":"2026-09-12T22:45:00Z","proof_ttl_seconds":3600,"role":"po","runtime_proof_id":"rp-auto-20260913-bug0020-discovery-po-20260912T224500Z-BUG-0020"}
- Isolation extras (not hashed): delivery_mode=ultra_lean; macro_phase=spec; model_id=cursor-grok-4.6; sprint_id=none; story_id=BUG-0020
- hash_recompute_confirmation=true (compute_strict_proof_hash → 935A9B7B69DBCBD3A07B4014322814A53C312D9A6A63415A0E6BCAB7FDF030F3)

### Discovery locks summary

| ID | Lock |
|----|------|
| D1 | Operator-used surface (Command.Info `/` next to `/ask`, or documented equivalent) starts execute → runAutoLifecycle or OPENCODE_* |
| D2 | Wrong-surface listing (CLI TUI keymap vs desktop Command.Info); not attach/CRLF/STOP/0019-static-E* |
| D3 | Supersede R-0124 E* picker claim via additive # BUG-0020; do not reopen BUG-0019 ACs / S0139 |
| D4 | Forbid STOP-only auto.md / Command.Info template ownership; empty markdown insufficient; JSON template is 0018-class unless research proves execute wins |
| D5 | Fix axes A–E (tui.json-if-desktop / desktop execute-only API / visible non-slash / other coexistence / reject E*); research live-fetches OpenCode docs/source |
| D6 | JSON template vs plugin execute remains 0018-class until proven otherwise |
| D7 | Additive test_bug0020_* not file-existence-only; keep test_bug0018_*; do not weaken test_bug0019_* except compose-only |
| D8 | Cursor / US-0135+ / reopen 0015-0019 ACs / DEC rewrite / host parser / unpublished-upgrade-for-this-repo out of scope |
| D9 | Done = start auto on OpenCode (preferably `/auto` in picker, or equivalent) + lifecycle (or OPENCODE_*); peers remain listed |
| D10 | Active↔template parity including tui.json; upgrade --host opencode\|both delivers chosen surface |

### Triad hot-surface verification tuple (DEC-0054) — discovery BUG-0020

- surface=docs/engineering/state.md (isolation + discovery checkpoint append-bottom) + handoffs/po_to_tl.md (discovery handoff append-newest)
- companion=docs/product/backlog.md discovery_notes; docs/product/vision.md ## Discovery Notes — BUG-0020
- pre_write: `--check` → `STATE_ARCHIVE_REQUIRED` `state` 1255/1200 units=17/80 + `po_to_tl` 689/650 units=17/60
- post_append: `arch_linkage_guard.py --pre` exit 0 → `enforce-triad-hot-surface.py --rollover` `rollover_complete units=1,2` pack_state=`docs/engineering/state-archive/state-pack-20260912-bn.md` (archived `## Architecture checkpoint — BUG-0019 / auto-20260912-bug0019 (role=tech-lead)`; archived_body_lines=79; preamble_lines=11; retained_body_lines=1176) pack_po=`handoffs/archive/po-to-tl-pack-20260912-k.md` (archived `## Architecture handoff — BUG-0017 OpenCode Linux slash commands (CRLF YAML frontmatter)` through `## Intake handoff — US-0133..US-0148 standalone its-magic agent`; archived_body_lines=88; retained_body_lines=601) → `arch_linkage_guard.py --post` exit 0; tuple fill then final `--check` PASS (`state` 1178/1200 units=16/80; `po_to_tl` 601/650 units=15/60)
- artifact_ordering: backlog notes append; vision append-bottom; po_to_tl.md append-newest; state.md append-bottom (DEC-0040)
- Active context surface preamble present
- pack_ref=docs/engineering/state-archive/state-pack-20260912-bn.md; handoffs/archive/po-to-tl-pack-20260912-k.md

