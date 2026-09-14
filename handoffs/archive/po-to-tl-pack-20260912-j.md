# PO to TL archive pack (2026-09-12)

- Rollover trigger: `PO_TO_TL_HOT_MAX_LINES=650, PO_TO_TL_HOT_MAX_SECTIONS=60`
- Source: `handoffs/po_to_tl.md`
- Archived units (oldest first, contiguous prefix): 1
- Retained units in hot file: 15
- First archived heading: `## Research handoff — BUG-0017 OpenCode Linux slash commands (CRLF YAML frontmatter)`
- Last archived heading: `## Research handoff — BUG-0017 OpenCode Linux slash commands (CRLF YAML frontmatter)`
- Verification tuple (mandatory):
  - archived_body_lines=38
  - retained_body_lines=616

---

## Research handoff — BUG-0017 OpenCode Linux slash commands (CRLF YAML frontmatter)

- **Phase completed**: research. **Role**: tech-lead. **Bug**: BUG-0017 only. **Sprint**: (pending). **Verdict**: PASS (`decision_gate=false`).
- **Timestamp (UTC)**: 2026-09-11T19:12:00Z. **Fresh marker**: `tl-BUG0017-research-20260911T191000Z-fresh`.
- **Orchestrator**: `orchestrator_run_id=auto-20260911-bug0017`, `delivery_mode=ultra_lean`, macro=`plan`, `model_id=composer-2.5`, CROSS_MODEL_REVIEW=1.
- **Research anchor**: `docs/engineering/research.md` **`## R-0118`** (DQ1–DQ6 LOCKED). Discovery D1–D9 not rewritten.
- **Sibling boundary**: BUG-0015/BUG-0016 DONE — out of scope. Compose BUG-0008 / US-0084 / DEC-0120 only.

### Closed questions DQ1–DQ6

| DQ | Topic | Resolution | LOCK |
|----|-------|------------|------|
| DQ1 | `.gitattributes` globs | `.opencode/**/*.{md,ts,json}` + `template/.opencode/**/*.{md,ts,json}` `text eol=lf`; reject repo-wide `*.md` | LOCKED |
| DQ2 | Guard wiring | Extend `guard_installer_publish.py`; reuse `npm run guard:installer` / `prepublishOnly`; reject new sibling | LOCKED |
| DQ3 | Installer EOL | Attributes + one-time renormalize + guard only; no install-time rewrite (`shutil.copy2`) | LOCKED |
| DQ4 | npm / chocolatey | npm `template/` is hard gate; choco GitHub zip inherits git LF; no choco EOL post-process | LOCKED |
| DQ5 | README + example JSON | Include pack README + `template/.opencode/model-catalog.local.example.json` in guard inventory | LOCKED |
| DQ6 | Consumer path | Kit fix + `its-magic --mode upgrade --host opencode\|both`; kit-only insufficient for installed CRLF trees | LOCKED |

### Architecture seeds

- **A1 (recommended)**: DQ1 attrs + D4 renormalize + extend guard + 6 `test_bug0017_*` + runbook upgrade recipe. Default: no new DEC (compose BUG-0008/US-0084/DEC-0120).
- Reject A2 install-time EOL rewrite; A3 repo-wide `*.md eol=lf`; A4 host parser patch.

### Runtime proof (DEC-0038)

- `runtime_proof_id=rp-auto-20260911-bug0017-research-techlead-20260911T191200Z-BUG-0017`
- `proof_hash=DF94BA041DDCB51ADD0675C7B41DEAD6F14CADB1D1095489E3B5F0E8342B777A`
- `proof_ttl=2026-09-11T20:12:00Z`
- Canonical payload: `{"delivery_mode":"ultra_lean","macro_phase":"plan","model_id":"composer-2.5","orchestrator_run_id":"auto-20260911-bug0017","phase_id":"research","proof_issued_at":"2026-09-11T19:12:00Z","proof_ttl_seconds":3600,"role":"tech-lead","runtime_proof_id":"rp-auto-20260911-bug0017-research-techlead-20260911T191200Z-BUG-0017","sprint_id":"none","story_id":"BUG-0017"}`

### Isolation + stop

- `phase_id=research`, `role=tech-lead`, `bug_id=BUG-0017`, `fresh_context_marker=tl-BUG0017-research-20260911T191000Z-fresh`, `model_id=composer-2.5`
- `evidence_ref=docs/engineering/research.md ## R-0118; docs/product/backlog.md ### BUG-0017 research_notes; docs/engineering/state.md research checkpoint; handoffs/resume_brief.md; .gitattributes; scripts/guard_installer_publish.py`
- **Hot-surface note**: Appended (not prepended) so triad oldest-prefix rollover retains this newest section.
- **Status**: BUG-0017 remains **OPEN**. **Next**: `/architecture` in fresh **tech-lead** subagent. Do not spawn architecture from this research chat. STOP.

