# State archive pack (2026-09-11)

- Rollover trigger: `STATE_HOT_MAX_LINES=1200, STATE_HOT_MAX_CHECKPOINTS=80`
- Source: `docs/engineering/state.md`
- Archived units (oldest first, contiguous prefix): 1
- Retained units in hot file: 16
- First archived heading: `## Research checkpoint — BUG-0017 / auto-20260911-bug0017 (role=tech-lead)`
- Last archived heading: `## Research checkpoint — BUG-0017 / auto-20260911-bug0017 (role=tech-lead)`
- Verification tuple (mandatory):
  - archived_body_lines=67
  - preamble_lines=11
  - retained_body_lines=1137

---

## Research checkpoint — BUG-0017 / auto-20260911-bug0017 (role=tech-lead)

- phase_id=research
- role=tech-lead
- bug_id=BUG-0017
- story_id=BUG-0017
- sprint_id=none (pending)
- orchestrator_run_id=auto-20260911-bug0017
- delivery_mode=ultra_lean
- macro_phase=plan
- model_id=composer-2.5 (CROSS_MODEL_REVIEW=1 — required on isolation)
- fresh_context_marker=tl-BUG0017-research-20260911T191000Z-fresh
- timestamp=2026-09-11T19:12:00Z
- verdict=RESEARCH_PASS (DQ1–DQ6 LOCKED; decision_gate=false)
- research_id=R-0118
- discovery_locks=D1–D9 unchanged (not rewritten)
- backlog_status=OPEN (### BUG-0017 — research_notes appended; Status OPEN)
- acceptance_BUG-0017=unchecked (unchanged)
- sibling_boundary=BUG-0015/BUG-0016 DONE out of scope; BUG-0008/US-0084 compose-only
- approach_seed=A1 (attrs + renormalize + extend guard_installer_publish.py + 6 test_bug0017_* + upgrade recipe)
- next_scheduled_phase=/architecture (fresh tech-lead)
- stop_condition=STOP after research PASS. Orchestrator spawns /architecture in fresh tech-lead subagent (BUG-0006). Do NOT spawn architecture from this research subagent. Do NOT mark BUG-0017 DONE. Do NOT tick acceptance.

### Isolation evidence (US-0048 / DEC-0029) — research BUG-0017

- phase_id=research
- role=tech-lead
- model_id=composer-2.5 (CROSS_MODEL_REVIEW=1 — required)
- fresh_context_marker=tl-BUG0017-research-20260911T191000Z-fresh (NEW per US-0048 / BUG-0006; not reused from discovery/critic markers)
- timestamp=2026-09-11T19:12:00Z (UTC)
- orchestrator_run_id=auto-20260911-bug0017
- evidence_ref=docs/product/backlog.md ### BUG-0017 (+ discovery_notes + research_notes); docs/engineering/research.md ## R-0118; .gitattributes; scripts/guard_installer_publish.py; package.json guard:installer/prepublishOnly; installer.py shutil.copy2; template/.opencode + .opencode CRLF inventory; docs/engineering/context/installer-owned-paths.manifest [opencode_install_include_paths]; packaging/chocolatey/tools/chocolateyInstall.ps1; handoffs/po_to_tl.md Discovery handoff BUG-0017; handoffs/resume_brief.md; docs/engineering/state.md (discovery+critic + this checkpoint); https://git-scm.com/docs/gitattributes
- Fresh tech-lead subagent per BUG-0006 / US-0048 isolation; no prior chat history carried forward. Narrow-read only. No .env reads, no credentials, no intake JSON mutation, no /architecture spawn from this subagent, no Status DONE flip.

### Strict runtime proof (DEC-0038) — research

- runtime_proof_id=rp-auto-20260911-bug0017-research-techlead-20260911T191200Z-BUG-0017
- phase_id=research, role=tech-lead, story_id=BUG-0017, sprint_id=none
- proof_issued_at=2026-09-11T19:12:00Z
- proof_ttl_seconds=3600, proof_ttl=2026-09-11T20:12:00Z
- proof_hash=DF94BA041DDCB51ADD0675C7B41DEAD6F14CADB1D1095489E3B5F0E8342B777A
- Canonical payload (sorted-key compact JSON per DEC-0038, lowercase keys only): {"delivery_mode":"ultra_lean","macro_phase":"plan","model_id":"composer-2.5","orchestrator_run_id":"auto-20260911-bug0017","phase_id":"research","proof_issued_at":"2026-09-11T19:12:00Z","proof_ttl_seconds":3600,"role":"tech-lead","runtime_proof_id":"rp-auto-20260911-bug0017-research-techlead-20260911T191200Z-BUG-0017","sprint_id":"none","story_id":"BUG-0017"}
- hash_recompute_confirmation=true (Python hashlib SHA-256 of exact canonical payload → DF94BA041DDCB51ADD0675C7B41DEAD6F14CADB1D1095489E3B5F0E8342B777A)
- Producer discovery proof consumed: rp-auto-20260911-bug0017-discovery-po-20260911T190600Z-BUG-0017 (441F98E3F1A52F467609C749C92452506E959282F99E1CF6FD1A142272F3587D) — RUNTIME_PROOF_VALID at research issue (before ttl 2026-09-11T20:06:00Z)

### DQ locks summary (R-0118)

| DQ | Lock |
|----|------|
| DQ1 | Scoped `.opencode/**/*.{md,ts,json}` + `template/.opencode/**/*.{md,ts,json}` `text eol=lf` |
| DQ2 | Extend `guard_installer_publish.py`; reuse `guard:installer` / `prepublishOnly` |
| DQ3 | No installer EOL rewrite — attrs + renormalize + guard |
| DQ4 | npm template gate + choco GitHub zip inherit LF; no choco EOL filter |
| DQ5 | Guard includes README + `model-catalog.local.example.json` |
| DQ6 | Consumer `upgrade --host opencode\|both` after kit fix |

### Triad hot-surface verification tuple (DEC-0054) — research BUG-0017

- surface=docs/engineering/state.md (isolation + research checkpoint append-bottom)
- companion=docs/engineering/research.md ## R-0118; docs/product/backlog.md research_notes; handoffs/resume_brief.md (prepend); handoffs/po_to_tl.md research handoff (append)
- pre_write: `--check` exit 1 STATE_ARCHIVE_REQUIRED (state 1229/1200; po_to_tl 682/650)
- post_append: `arch_linkage_guard.py --pre` exit 0 → `enforce-triad-hot-surface.py --rollover` units=1,1 packs=`docs/engineering/state-archive/state-pack-20260911-a.md` + `handoffs/archive/po-to-tl-pack-20260911-b.md` → `arch_linkage_guard.py --post` exit 0; final `--check` exit 0 (state hot lines=1151/1200; po_to_tl=590/650)
- artifact_ordering: state.md append-bottom (DEC-0040); resume_brief.md prepend-top; backlog notes append; research.md append; po_to_tl.md append
- Active context surface preamble present
- pack_ref=docs/engineering/state-archive/state-pack-20260911-a.md; docs/engineering/state-archive/state-pack-20260911.md; handoffs/archive/po-to-tl-pack-20260911-b.md


