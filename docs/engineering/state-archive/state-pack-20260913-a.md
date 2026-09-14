# State archive pack (2026-09-13)

- Rollover trigger: `STATE_HOT_MAX_LINES=1200, STATE_HOT_MAX_CHECKPOINTS=80`
- Source: `docs/engineering/state.md`
- Archived units (oldest first, contiguous prefix): 2
- Retained units in hot file: 14
- First archived heading: `## Sovereign-critic checkpoint — discovery BUG-0020 / auto-20260913-bug0020 (role=tech-lead critic)`
- Last archived heading: `## Research checkpoint — BUG-0020 / auto-20260913-bug0020 (role=tech-lead)`
- Verification tuple (mandatory):
  - archived_body_lines=148
  - preamble_lines=11
  - retained_body_lines=1145

---

## Sovereign-critic checkpoint — discovery BUG-0020 / auto-20260913-bug0020 (role=tech-lead critic)

- phase_id=sovereign-critic
- role=tech-lead (critic)
- bug_id=BUG-0020 (Status OPEN — not flipped DONE)
- story_id=BUG-0020
- sprint_id=none (pending)
- orchestrator_run_id=auto-20260913-bug0020
- delivery_mode=ultra_lean
- macro_phase=spec
- reviewed_phase_id=discovery
- producer_role=po
- producer_model_id=cursor-grok-4.6
- critic_model_id=composer-2.5-fast
- degraded_mode=false
- model_id=composer-2.5-fast (CROSS_MODEL_REVIEW=1 — required on isolation)
- fresh_context_marker=critic-BUG0020-discovery-20260912T225500Z-fresh
- timestamp=2026-09-12T22:55:00Z
- verdict=PASS
- blocking_count=0
- anti_slop_aggregate=9
- lenses=challenger+architect+subtractor (all three)
- finding_ids=bug0020dsc-challenger-001,bug0020dsc-architect-002,bug0020dsc-subtractor-003
- issue_keys=ik_bug0020_dsc_wrong_surface_proof,ik_bug0020_dsc_layer_research_owns_r0126,ik_bug0020_dsc_scope_no_reopen_0019
- discovery_confirmed=DISCOVERY_PASS; D1..D10 LOCKED; decision_gate=false; research_target=R-0126 (compose R-0125; do not wipe R-0120..R-0125)
- backlog_status=OPEN (### BUG-0020 — Status OPEN; discovery_notes present; acceptance unchecked)
- sibling_boundary=BUG-0019 DONE not reopened (acceptance [x] held); BUG-0018/0017/0015/0016 DONE out of scope; US-0135+ not drained; Cursor `/auto` do-not-touch
- producer_runtime_proof_id=rp-auto-20260913-bug0020-discovery-po-20260912T224500Z-BUG-0020
- producer_proof_hash=935A9B7B69DBCBD3A07B4014322814A53C312D9A6A63415A0E6BCAB7FDF030F3 (MATCH)
- producer_proof_ttl=2026-09-12T23:45:00Z
- proof_consume=RUNTIME_PROOF_VALID at 2026-09-12T22:55:00Z before ttl (hash MATCH)
- producer_proof_hash_recomputed=true (critic independent Python compute_strict_proof_hash — byte-identical MATCH)
- producer_fresh_context_marker=po-BUG0020-discovery-20260912T224500Z-fresh
- independent_checks=proof SHA-256 MATCH+not-STALE; Status OPEN; acceptance unchecked; BUG-0019 DONE [x] not reopened; auto.md absent (active+template); tui.json/cli.json absent; its-magic-auto/{index.ts,tui.ts} present; orchestrator.ts BUG-0015 attach present; gap class wrong-surface listing (Command.Info picker != CLI TUI keymap) per R-0125; R-0124 E* picker claim live-falsified — D3 supersede deferred to research/architecture; no /research spawn from critic (BUG-0006); sovereign_critic_validate.py --enforce PASS; US-0127 auto_resolve_nonblocking_for_run resolved 3 informational rows
- next_scheduled_phase=research
- next_scheduled_role=tech-lead
- stop_condition=STOP after sovereign-critic PASS. Orchestrator MUST Task-spawn /research in fresh tech-lead subagent (BUG-0006). Do NOT spawn /research from this critic. Do NOT mark BUG-0020 DONE. Do NOT tick acceptance. Do NOT reopen BUG-0019. Do NOT restore STOP-only auto.md.

### Isolation evidence (US-0048 / DEC-0029 / US-0104 v2) — sovereign-critic of discovery BUG-0020

- phase_id=sovereign-critic
- role=tech-lead
- model_id=composer-2.5-fast (CROSS_MODEL_REVIEW=1 — required)
- fresh_context_marker=critic-BUG0020-discovery-20260912T225500Z-fresh (NEW per US-0048 / BUG-0006; not reused from po-BUG0020-discovery-20260912T224500Z-fresh)
- timestamp=2026-09-12T22:55:00Z (UTC)
- orchestrator_run_id=auto-20260913-bug0020
- evidence_ref=handoffs/sovereign_critic_findings.jsonl (bug0020dsc-challenger-001, bug0020dsc-architect-002, bug0020dsc-subtractor-003) + docs/product/backlog.md ### BUG-0020 discovery_notes + docs/product/vision.md ## Discovery Notes — BUG-0020 + docs/product/acceptance.md BUG-0020 + handoffs/intake_evidence/BUG-0020-intake-20260913.json + handoffs/po_to_tl.md Discovery handoff BUG-0020 + absent .opencode/commands/auto.md + template/.opencode/commands/auto.md + absent .opencode/tui.json + .opencode/cli.json + .opencode/plugins/orchestrator.ts attach + .opencode/plugins/its-magic-auto/{index.ts,tui.ts} + docs/engineering/research.md ## R-0125 + docs/engineering/state.md (producer discovery checkpoint + this checkpoint)
- Fresh tech-lead critic subagent per BUG-0006 / US-0048 isolation; three-lens jury; narrow-read only. No .env reads, no credentials, no BUG-0020 Status mutation, no BUG-0019 reopen, no intake JSON mutation, no /research spawn from this subagent.
- Producer proof consumed: rp-auto-20260913-bug0020-discovery-po-20260912T224500Z-BUG-0020 (935A9B7B69DBCBD3A07B4014322814A53C312D9A6A63415A0E6BCAB7FDF030F3) — RUNTIME_PROOF_VALID; consumed at 2026-09-12T22:55:00Z before ttl 2026-09-12T23:45:00Z.

### Strict runtime proof (DEC-0038) — sovereign-critic

- runtime_proof_id=rp-auto-20260913-bug0020-sovereign-critic-techlead-20260912T225500Z-BUG-0020
- phase_id=sovereign-critic, role=tech-lead, story_id=BUG-0020, sprint_id=none
- proof_issued_at=2026-09-12T22:55:00Z
- proof_ttl_seconds=3600
- proof_ttl=2026-09-12T23:55:00Z
- proof_hash=B531AD53B6265C3AFFB02205A4841ED5AB41C881AAC67DFC1F0810164A4B7A99
- Canonical hashed payload: {"orchestrator_run_id":"auto-20260913-bug0020","phase_id":"sovereign-critic","proof_issued_at":"2026-09-12T22:55:00Z","proof_ttl_seconds":3600,"role":"tech-lead","runtime_proof_id":"rp-auto-20260913-bug0020-sovereign-critic-techlead-20260912T225500Z-BUG-0020"}
- Isolation extras (not hashed): delivery_mode=ultra_lean; macro_phase=spec; model_id=composer-2.5-fast; sprint_id=none; story_id=BUG-0020

### Non-blocking carry-forwards (informational; auto-resolved US-0127)

- NB1 (challenger / bug0020dsc-challenger-001): proof MATCH+not-STALE; Status OPEN; wrong-surface listing gap confirmed; D10 consumer upgrade + D4 empty-body insufficient + D6 JSON-template collision owned by R-0126.
- NB2 (architect / bug0020dsc-architect-002): research owns R-0126 DQ1-DQ8; architecture later owns fix-axis winner + test_bug0020_*; execute owns implementation.
- NB3 (subtractor / bug0020dsc-subtractor-003): Do not spawn /research from critic (BUG-0006); no DEC-0124/0125 body rewrite in discovery; no DONE flip; no BUG-0019 reopen; no auto.md restore.

### Triad hot-surface verification tuple (DEC-0054) — sovereign-critic discovery BUG-0020

- surface=docs/engineering/state.md (isolation + critic checkpoint append-bottom)
- companion=handoffs/sovereign_critic_findings.jsonl (3 lens rows appended)
- pre_write: `--check` → `STATE_ARCHIVE_REQUIRED` state over cap
- post_append: `arch_linkage_guard.py --pre` exit 0 → `enforce-triad-hot-surface.py --rollover` `rollover_complete units=1` pack_state=`docs/engineering/state-archive/state-pack-20260912-bo.md` (archived `## Sovereign-critic checkpoint — architecture BUG-0019 / auto-20260912-bug0019 (role=tech-lead critic)`; archived_body_lines=66; preamble_lines=11; retained_body_lines=1188) → `arch_linkage_guard.py --post` exit 0; final `--check` PASS (`state` 1188/1200 units=16/80)
- artifact_ordering: sovereign_critic_findings.jsonl append; state.md append-bottom (DEC-0040)
- Active context surface preamble present
- pack_ref=docs/engineering/state-archive/state-pack-20260912-bo.md

## Research checkpoint — BUG-0020 / auto-20260913-bug0020 (role=tech-lead)

- phase_id=research
- role=tech-lead
- bug_id=BUG-0020
- story_id=BUG-0020
- sprint_id=none (pending)
- orchestrator_run_id=auto-20260913-bug0020
- parent_orchestrator_run_id=cursor-20260913-BUG0020-intake
- delivery_mode=ultra_lean
- macro_phase=plan (research PASS; architecture remaining)
- model_id=cursor-grok-4.6 (CROSS_MODEL_REVIEW=1 — required on isolation)
- AUTO_QUIET=1
- fresh_context_marker=tl-BUG0020-research-20260912T231000Z-fresh
- timestamp=2026-09-12T22:58:00Z
- verdict=RESEARCH_PASS (DQ1..DQ8 LOCKED; winning axis E2; decision_gate=false; no companion DEC)
- backlog_status=OPEN (### BUG-0020 — research_notes appended; Status OPEN)
- acceptance_BUG-0020=unchecked (unchanged)
- sibling_boundary=BUG-0019/BUG-0018/BUG-0017/BUG-0015/BUG-0016 DONE out of scope; US-0133..US-0148 not mutated; US-0135 not drained; Cursor `/auto` do-not-touch
- research_anchor=R-0126 (compose R-0125 / R-0124; do not wipe R-0120..R-0125; R-0124 E* picker claim live-falsified)
- next_scheduled_phase=/architecture (fresh tech-lead)
- stop_condition=STOP after research PASS. Orchestrator spawns /architecture in fresh tech-lead subagent (BUG-0006). Do NOT spawn architecture from this tech-lead subagent. Do NOT mark BUG-0020 DONE. Do NOT tick acceptance. Do NOT reopen BUG-0019..BUG-0015. Do NOT restore STOP-only auto.md. Do NOT allocate a companion DEC.

### Isolation evidence (US-0048 / DEC-0029) — research BUG-0020

- phase_id=research
- role=tech-lead
- model_id=cursor-grok-4.6 (CROSS_MODEL_REVIEW=1 — required)
- fresh_context_marker=tl-BUG0020-research-20260912T231000Z-fresh (NEW per US-0048 / BUG-0006; not reused from po-BUG0020-discovery-20260912T224500Z-fresh)
- timestamp=2026-09-12T22:58:00Z (UTC)
- orchestrator_run_id=auto-20260913-bug0020
- evidence_ref=docs/engineering/research.md ## R-0126; docs/product/backlog.md ### BUG-0020 research_notes; handoffs/po_to_tl.md Research handoff BUG-0020; .opencode/plugins/orchestrator.ts editor.add (name auto); .opencode/plugins/its-magic-auto/{index.ts,tui.ts} present; absent .opencode/commands/auto.md, .opencode/tui.json, .opencode/cli.json (and template twins); this state checkpoint
- Fresh tech-lead subagent per BUG-0006 / US-0048 isolation; no prior chat history carried forward. Narrow-read + live OpenCode docs/source. No .env reads, no credentials, no Status DONE flip, no acceptance tick, no execute-surface mutation, no architecture # BUG-0020 authorship.

### Strict runtime proof (DEC-0038) — research

- runtime_proof_id=rp-auto-20260913-bug0020-research-techlead-20260912T225800Z-BUG-0020
- phase_id=research, role=tech-lead, story_id=BUG-0020, sprint_id=none
- proof_issued_at=2026-09-12T22:58:00Z
- proof_ttl_seconds=3600, proof_ttl=2026-09-12T23:58:00Z
- proof_hash=CD22980C635030A79DAC0705CFA0DEF87C64CF10A3279DEC46E97BCBE7C74CC8
- Hash via `from scripts.token_cost_lib import compute_strict_proof_hash` (compact sorted-key JSON; not `compute_proof_hash.py` default spaces).
- Canonical hashed payload: {"orchestrator_run_id":"auto-20260913-bug0020","phase_id":"research","proof_issued_at":"2026-09-12T22:58:00Z","proof_ttl_seconds":3600,"role":"tech-lead","runtime_proof_id":"rp-auto-20260913-bug0020-research-techlead-20260912T225800Z-BUG-0020"}
- Isolation extras (not hashed): delivery_mode=ultra_lean; macro_phase=plan; model_id=cursor-grok-4.6; sprint_id=none; story_id=BUG-0020
- hash_recompute_confirmation=true (compute_strict_proof_hash → CD22980C635030A79DAC0705CFA0DEF87C64CF10A3279DEC46E97BCBE7C74CC8)
- Consumed discovery proof: rp-auto-20260913-bug0020-discovery-po-20260912T224500Z-BUG-0020 / 935A9B7B69DBCBD3A07B4014322814A53C312D9A6A63415A0E6BCAB7FDF030F3 — RUNTIME_PROOF_VALID MATCH at 2026-09-12T22:58:00Z before ttl 2026-09-12T23:45:00Z (independent Python recompute byte-identical)

### Research locks summary

| ID | Lock |
|----|------|
| DQ1 | Desktop custom `/` = Command.Info + builtins; keymap/`editor.add` not consumed |
| DQ2 | `tui.json` CLI-TUI-only; reject Axis A as desktop listing |
| DQ3 | No execute-only desktop listing API; reject Axis B |
| DQ4 | No desktop plugin button/slot API; C-limb = documented CLI TUI `/auto` |
| DQ5 | Additive `OPENCODE_AUTO_DESKTOP_COMMAND_INFO_LISTING_UNSUPPORTED`; do not reuse TUI-keymap-missing or markdown-collision |
| DQ6 | 8 `test_bug0020_*`; no companion DEC; `# BUG-0020` supersedes R-0124 E* picker claim |
| DQ7 | Upgrade copy-on-add `tui.json`/token wiring; still prune leftover `auto.md` |
| DQ8 | Operator host = Command.Service; CLI working-start prefers internal `tui.json` list |
| D5 | Winning axis **E2** |

### Triad hot-surface verification tuple (DEC-0054) — research BUG-0020

- surface=docs/engineering/state.md (isolation + research checkpoint append-bottom) + handoffs/po_to_tl.md (research handoff append-newest)
- companion=docs/product/backlog.md research_notes; docs/engineering/research.md ## R-0126
- pre_write: `--check` → `STATE_ARCHIVE_REQUIRED` `state` 1259/1200 units=17/80; `po_to_tl` under cap
- post_append: `arch_linkage_guard.py --pre` exit 0 → `enforce-triad-hot-surface.py --rollover` `rollover_complete units=1` pack_state=`docs/engineering/state-archive/state-pack-20260912-bp.md` (archived `## Sprint-plan checkpoint — BUG-0019 / S0139 / auto-20260912-bug0019 (role=tech-lead)`; archived_body_lines=67; preamble_lines=11; retained_body_lines=1192) → `arch_linkage_guard.py --post` exit 0; tuple fill then final `--check` PASS (`state` 1194/1200 units=16/80; `po_to_tl` 640/650 units=16/60)
- artifact_ordering: research.md append; backlog notes append; po_to_tl.md append-newest; state.md append-bottom (DEC-0040)
- Active context surface preamble present
- pack_ref=docs/engineering/state-archive/state-pack-20260912-bp.md

