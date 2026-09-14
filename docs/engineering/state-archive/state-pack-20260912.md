# State archive pack (2026-09-12)

- Rollover trigger: `STATE_HOT_MAX_LINES=1200, STATE_HOT_MAX_CHECKPOINTS=80`
- Source: `docs/engineering/state.md`
- Archived units (oldest first, contiguous prefix): 1
- Retained units in hot file: 16
- First archived heading: `## Architecture checkpoint — BUG-0017 / auto-20260911-bug0017 (role=tech-lead)`
- Last archived heading: `## Architecture checkpoint — BUG-0017 / auto-20260911-bug0017 (role=tech-lead)`
- Verification tuple (mandatory):
  - archived_body_lines=68
  - preamble_lines=11
  - retained_body_lines=1171

---

## Architecture checkpoint — BUG-0017 / auto-20260911-bug0017 (role=tech-lead)

- phase_id=architecture
- role=tech-lead
- bug_id=BUG-0017
- story_id=BUG-0017
- sprint_id=none (pending — materialize at /sprint-plan)
- orchestrator_run_id=auto-20260911-bug0017
- delivery_mode=ultra_lean
- macro_phase=plan
- model_id=composer-2.5 (CROSS_MODEL_REVIEW=1 — required on isolation)
- fresh_context_marker=tl-BUG0017-architecture-20260911T191500Z-fresh
- timestamp=2026-09-11T19:20:00Z
- verdict=ARCHITECTURE_PASS (approach A* LOCKED; decision_gate=false)
- architecture_anchor=docs/engineering/architecture.md # BUG-0017
- research_anchor=R-0118 (DQ1–DQ6 LOCKED; cited; not rewritten)
- companion_dec=none (compose BUG-0008 / US-0084 / DEC-0120)
- approach=A* (= R-0118 A1): DQ1 attrs + D4 renormalize + extend guard_installer_publish.py + 6 test_bug0017_* + DQ6 runbook; reject A2/A3/A4/A5
- critic_nb_closures=NB1 choco tag→guard:installer before zip (T-007); NB2 dirty-tree scoped renormalize (T-002); NB3 DQ6 upgrade recipe (T-006)
- task_seeds=T-anch + T-001..T-007 (8 ≤ SPRINT_MAX_TASKS=12; no auto-split)
- backlog_status=OPEN (### BUG-0017 — architecture_notes appended; Status OPEN)
- acceptance_BUG-0017=unchecked (unchanged)
- sibling_boundary=BUG-0015/BUG-0016 DONE out of scope; BUG-0008/US-0084 compose-only
- next_scheduled_phase=/sprint-plan (fresh tech-lead; orchestrator may insert sovereign-critic of architecture first)
- stop_condition=STOP after architecture PASS. Orchestrator spawns sovereign-critic then /sprint-plan in fresh tech-lead subagent (BUG-0006). Do NOT spawn sprint-plan from this architecture subagent. Do NOT mark BUG-0017 DONE. Do NOT tick acceptance. Do NOT mutate .gitattributes/guard/normalize in this phase.

### Isolation evidence (US-0048 / DEC-0029) — architecture BUG-0017

- phase_id=architecture
- role=tech-lead
- model_id=composer-2.5 (CROSS_MODEL_REVIEW=1 — required)
- fresh_context_marker=tl-BUG0017-architecture-20260911T191500Z-fresh (NEW per US-0048 / BUG-0006; not reused from research/critic markers)
- timestamp=2026-09-11T19:20:00Z (UTC)
- orchestrator_run_id=auto-20260911-bug0017
- evidence_ref=docs/product/backlog.md ### BUG-0017 (+ research_notes + architecture_notes); docs/engineering/research.md ## R-0118; docs/engineering/architecture.md # BUG-0017; .gitattributes; scripts/guard_installer_publish.py; handoffs/po_to_tl.md Research handoff BUG-0017; handoffs/resume_brief.md; docs/engineering/state.md (research+critic + this checkpoint); sovereign-critic research NBs (NB1–NB3)
- Fresh tech-lead subagent per BUG-0006 / US-0048 isolation; no prior chat history carried forward. Narrow-read only. No .env reads, no credentials, no intake JSON mutation, no /sprint-plan spawn from this subagent, no Status DONE flip, no companion DEC authored, no execute-surface mutation (.gitattributes/guard/normalize deferred to execute).

### Strict runtime proof (DEC-0038) — architecture

- runtime_proof_id=rp-auto-20260911-bug0017-architecture-techlead-20260911T192000Z-BUG-0017
- phase_id=architecture, role=tech-lead, story_id=BUG-0017, sprint_id=none
- proof_issued_at=2026-09-11T19:20:00Z
- proof_ttl_seconds=3600, proof_ttl=2026-09-11T20:20:00Z
- proof_hash=541A4773D0E994EE9FC1A0DD09E70DBE1D0B262170FB6D63540407CEBBD76B68
- Canonical payload (sorted-key compact JSON per DEC-0038, lowercase keys only): {"delivery_mode":"ultra_lean","macro_phase":"plan","model_id":"composer-2.5","orchestrator_run_id":"auto-20260911-bug0017","phase_id":"architecture","proof_issued_at":"2026-09-11T19:20:00Z","proof_ttl_seconds":3600,"role":"tech-lead","runtime_proof_id":"rp-auto-20260911-bug0017-architecture-techlead-20260911T192000Z-BUG-0017","sprint_id":"none","story_id":"BUG-0017"}
- hash_recompute_confirmation=true (Python hashlib SHA-256 of exact canonical payload → 541A4773D0E994EE9FC1A0DD09E70DBE1D0B262170FB6D63540407CEBBD76B68)
- Producer research proof consumed: rp-auto-20260911-bug0017-research-techlead-20260911T191200Z-BUG-0017 (DF94BA041DDCB51ADD0675C7B41DEAD6F14CADB1D1095489E3B5F0E8342B777A) — RUNTIME_PROOF_VALID at architecture issue (before ttl 2026-09-11T20:12:00Z)

### Approach + seeds summary

| Item | Lock |
|------|------|
| Approach | A* (= R-0118 A1) |
| Companion DEC | none |
| Seeds | T-anch, T-001..T-007 (8) |
| Rejected | A2 install rewrite; A3 repo-wide *.md; A4 host parser; A5 sibling guard |

### Triad hot-surface verification tuple (DEC-0054) — architecture BUG-0017

- surface=docs/engineering/architecture.md (# BUG-0017 H1 append) + docs/engineering/state.md (isolation + architecture checkpoint append-bottom)
- companion=docs/product/backlog.md architecture_notes; handoffs/resume_brief.md (prepend); handoffs/po_to_tl.md architecture handoff (append); handoffs/tl_to_dev.md architecture handoff (prepend)
- baseline_h2_count=0 (pre-mutate; heading policy PASS — H2 story count unchanged)
- pre_write: STATE/ARCH hot oversize triggered rollover
- post_append: arch_linkage_guard.py --pre exit 0 → enforce-triad-hot-surface.py --rollover units=1,1 packs=docs/engineering/state-archive/state-pack-20260911-c.md + docs/engineering/architecture-archive/architecture-pack-20260911.md → arch_linkage_guard.py --post exit 0; final --check exit 0; --check-arch-heading-policy --baseline-h2-count 0 exit 0; materialize_codebase_map.py --trigger architecture → [CODEBASE_MAP_OK] preserved_existing
- artifact_ordering: architecture.md append H1; state.md append-bottom (DEC-0040); resume_brief.md prepend-top; backlog notes append; po_to_tl.md append; tl_to_dev.md prepend
- Active context surface preamble present
- pack_ref=docs/engineering/state-archive/state-pack-20260911-c.md; docs/engineering/architecture-archive/architecture-pack-20260911.md

