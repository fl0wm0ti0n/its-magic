# PO to TL archive pack (2026-09-12)

- Rollover trigger: `PO_TO_TL_HOT_MAX_LINES=650, PO_TO_TL_HOT_MAX_SECTIONS=60`
- Source: `handoffs/po_to_tl.md`
- Archived units (oldest first, contiguous prefix): 1
- Retained units in hot file: 15
- First archived heading: `## Discovery handoff — BUG-0017 OpenCode Linux slash commands (CRLF YAML frontmatter)`
- Last archived heading: `## Discovery handoff — BUG-0017 OpenCode Linux slash commands (CRLF YAML frontmatter)`
- Verification tuple (mandatory):
  - archived_body_lines=45
  - retained_body_lines=627

---

## Discovery handoff — BUG-0017 OpenCode Linux slash commands (CRLF YAML frontmatter)

- **Phase completed**: discovery. **Role**: po. **Bug**: BUG-0017 only. **Sprint**: (pending). **Verdict**: PASS (`decision_gate=false`).
- **Timestamp (UTC)**: 2026-09-11T19:06:00Z. **Fresh marker**: `po-BUG0017-discovery-20260911T190300Z-fresh`.
- **Orchestrator**: `orchestrator_run_id=auto-20260911-bug0017`, `delivery_mode=ultra_lean`, macro=`spec` (intake already DONE — not re-intaken), `model_id=composer-2.5`, CROSS_MODEL_REVIEW=1.
- **Sibling boundary**: BUG-0015/BUG-0016 DONE — out of scope. BUG-0008 = same CRLF failure class, different surface (manifest vs OpenCode pack).
- **Gap confirmed**: `.gitattributes` LF only for `*.sh`/`*.manifest`; `.opencode/commands/auto.md` + active/template OpenCode commands/agents/plugins text are CRLF.

### Discovery locks D1–D9

| ID | Lock |
|----|------|
| **D1** | Primary: `.opencode/commands/**/*.md` must ship **LF** (Linux YAML frontmatter / slash commands). |
| **D2** | Scope: commands + agents + plugins `*.{md,ts}` + pack README; exclude `node_modules`. |
| **D3** | `.gitattributes`: scoped `.opencode/**` + `template/.opencode/**` only; **reject** repo-wide `*.md eol=lf`. |
| **D4** | One-time LF normalize active + template in-scope files. |
| **D5** | Publish/install CR-byte fail-closed guard (extend BUG-0008 guard or sibling — wiring → DQ). |
| **D6** | Active ↔ template OpenCode pack parity (LF + parity gate). |
| **D7** | Additive `test_bug0017_*` no-`\r` assertions; do not weaken BUG-0008/US-0084. |
| **D8** | Out of scope: host parser patch; BUG-0015/0016 reopen; command semantics; force-LF all markdown. |
| **D9** | Done = Linux OpenCode recognizes `/auto`/`/intake`/peers + shipped pack has no CRLF. |

### Research questions DQ1–DQ6 (for `/research` → **R-0118**)

1. **DQ1**: Exact `.gitattributes` pathspec / `**` syntax git honors for nested `.opencode` trees.
2. **DQ2**: Extend `guard_installer_publish.py` vs new OpenCode EOL guard + prepublish/CI hook placement.
3. **DQ3**: Installer copy path — rewrite EOL on install vs attributes+guard only.
4. **DQ4**: npm tarball / chocolatey packaging coverage for pack LF.
5. **DQ5**: Include `model-catalog.local.example.json` + pack README in guard inventory?
6. **DQ6**: Consumer upgrade/renormalize recipe vs kit-only fix for already-installed CRLF packs.

### Runtime proof (DEC-0038)

- `runtime_proof_id=rp-auto-20260911-bug0017-discovery-po-20260911T190600Z-BUG-0017`
- `proof_hash=441F98E3F1A52F467609C749C92452506E959282F99E1CF6FD1A142272F3587D`
- `proof_ttl=2026-09-11T20:06:00Z`
- Canonical payload: `{"delivery_mode":"ultra_lean","macro_phase":"spec","model_id":"composer-2.5","orchestrator_run_id":"auto-20260911-bug0017","phase_id":"discovery","proof_issued_at":"2026-09-11T19:06:00Z","proof_ttl_seconds":3600,"role":"po","runtime_proof_id":"rp-auto-20260911-bug0017-discovery-po-20260911T190600Z-BUG-0017","sprint_id":"none","story_id":"BUG-0017"}`

### Isolation + stop

- `phase_id=discovery`, `role=po`, `bug_id=BUG-0017`, `fresh_context_marker=po-BUG0017-discovery-20260911T190300Z-fresh`, `model_id=composer-2.5`
- `evidence_ref=docs/product/backlog.md ### BUG-0017 discovery_notes; docs/product/acceptance.md BUG-0017; handoffs/intake_evidence/BUG-0017-intake-20260911.json; .gitattributes; .opencode/commands/auto.md; docs/engineering/state.md discovery checkpoint; handoffs/resume_brief.md`
- **Hot-surface note**: Appended (not prepended) so triad oldest-prefix rollover retains this newest section (same policy as BUG-0017 intake).
- **Status**: BUG-0017 remains **OPEN**. **Next**: `/research` in fresh **tech-lead** subagent. Do not spawn research from this discovery chat. STOP.

