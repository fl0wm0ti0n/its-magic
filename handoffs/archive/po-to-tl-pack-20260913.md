# PO to TL archive pack (2026-09-13)

- Rollover trigger: `PO_TO_TL_HOT_MAX_LINES=650, PO_TO_TL_HOT_MAX_SECTIONS=60`
- Source: `handoffs/po_to_tl.md`
- Archived units (oldest first, contiguous prefix): 2
- Retained units in hot file: 15
- First archived heading: `## Discovery handoff — BUG-0018 OpenCode markdown `/auto` wins over plugin execute`
- Last archived heading: `## Research handoff — BUG-0018 OpenCode markdown `/auto` wins over plugin execute`
- Verification tuple (mandatory):
  - archived_body_lines=91
  - retained_body_lines=616

---

## Discovery handoff — BUG-0018 OpenCode markdown `/auto` wins over plugin execute

- **Phase completed**: discovery. **Role**: po. **Bug**: BUG-0018 only. **Sprint**: (pending). **Verdict**: PASS (`decision_gate=false`).
- **Timestamp (UTC)**: 2026-09-12T09:28:00Z. **Fresh marker**: `po-BUG0018-discovery-20260912T091900Z-fresh`.
- **Orchestrator**: `orchestrator_run_id=auto-20260912-bug0018`, `delivery_mode=ultra_lean`, macro=`spec` (intake already DONE — not re-intaken), `model_id=cursor-grok-4.6`, CROSS_MODEL_REVIEW=1.
- **Sibling boundary**: BUG-0015/BUG-0016/BUG-0017 DONE — out of scope; do not reopen. Symptom B Cursor Task-unavailable is **not a bug** (BUG-0006 / US-0095 `NATIVE_CHAIN_UNAVAILABLE`).
- **Gap confirmed**: LF STOP-only `.opencode/commands/auto.md`; plugin BUG-0015 attach present (`command.transform` → `editor.add({ name: "auto", execute })` → `runAutoLifecycle`); live host runs markdown STOP; `execute` never called; no `OPENCODE_*`. `# BUG-0015` CF1 live-falsified.

### Discovery locks D1–D10

| ID | Lock |
|----|------|
| **D1** | Outcome: `/auto` invokes plugin execute → `runAutoLifecycle` **or** documented `OPENCODE_*` fail-closed. Markdown must not be sole runtime owner when plugin execute is registered. |
| **D2** | Gap class: host-precedence / same-name registry merge. Not missing attach (BUG-0015). Not CRLF (BUG-0017). |
| **D3** | Supersede architecture `# BUG-0015` CF1 with evidence-based ownership. Do not silently ignore. Do not reopen BUG-0015 ACs. |
| **D4** | Thin `auto.md` stays STOP-only / no spawn literals (DEC-0125 DQ5 / BUG-0006). Empty/no-STOP body is **not** sufficient if markdown still owns execution. |
| **D5** | Fix axis (research picks winner): (A) plugin-only `/auto` (remove/rename colliding `auto.md`); (B) markdown renamed/non-colliding + plugin keeps `auto`; (C) later `editor.add` / `command.reload()` if later add wins; (D) documented host override if one exists. |
| **D6** | Do not treat `command.executed` as primary fix unless research proves it fires for markdown-template commands. |
| **D7** | Additive `test_bug0018_*` (static + mock-ctx). No live OpenCode CI probe. Do not amend `test_bug0015_*` / `test_us0124_*` / `test_us0125_*` except compose-only asserts. |
| **D8** | Out of scope: Cursor Task-unavailable / no BUG-0019; no reopen BUG-0015/0016/0017; no Cursor Task port; no DEC-0124/0125 body rewrite unless research proves contract change (prefer additive `# BUG-0018`). |
| **D9** | Done = OpenCode `/auto` starts `runAutoLifecycle` / spawn chain **or** documented `OPENCODE_*` (not silent markdown STOP); slash listing preserved. |
| **D10** | Active `.opencode/` ↔ `template/.opencode/` parity for any ownership change; installer/upgrade must not leave consumers with colliding markdown that still wins. |

### Research questions DQ1–DQ8 (for `/research` → **R-0120**)

1. **DQ1**: Exact OpenCode same-name merge when markdown `auto.md` and plugin `editor.add({ name: "auto", execute })` both exist (override vs dual-fire vs markdown-wins). Cite current v2 docs + source.
2. **DQ2**: Load order — does markdown load after plugin transforms? Does `command.reload()` after transform change the winner?
3. **DQ3**: Does `command.executed` fire for markdown-template commands? If not, secondary attach is dead for `/auto`.
4. **DQ4**: CommandEditor capabilities — add-only vs update/remove; can a plugin replace a same-name markdown command?
5. **DQ5**: Slash discoverability if `auto.md` is removed/renamed — does plugin `editor.add` still list `/auto`?
6. **DQ6**: Fail-closed reason-code if the host cannot let plugin execute win (new code vs reuse `OPENCODE_PLUGIN_DISPATCH_ATTACH_UNSUPPORTED`)?
7. **DQ7**: `test_bug0018_*` inventory + companion DEC vs additive `# BUG-0018` superseding CF1.
8. **DQ8**: Consumer upgrade path so installed colliding `auto.md` does not keep winning after the kit fix.

### Runtime proof (DEC-0038)

- `runtime_proof_id=rp-auto-20260912-bug0018-discovery-po-20260912T092800Z-BUG-0018`
- `proof_hash=0786CBA6FFED9208970ABE0E22C1CC72683D8B5B0EF2F4076191947E55F2D543`
- `proof_ttl=2026-09-12T10:28:00Z`
- Canonical payload: `{"delivery_mode":"ultra_lean","macro_phase":"spec","model_id":"cursor-grok-4.6","orchestrator_run_id":"auto-20260912-bug0018","phase_id":"discovery","proof_issued_at":"2026-09-12T09:28:00Z","proof_ttl_seconds":3600,"role":"po","runtime_proof_id":"rp-auto-20260912-bug0018-discovery-po-20260912T092800Z-BUG-0018","sprint_id":"none","story_id":"BUG-0018"}`

### Isolation + stop

- `phase_id=discovery`, `role=po`, `bug_id=BUG-0018`, `fresh_context_marker=po-BUG0018-discovery-20260912T091900Z-fresh`, `model_id=cursor-grok-4.6`
- `evidence_ref=docs/product/backlog.md ### BUG-0018 discovery_notes; docs/product/acceptance.md BUG-0018; docs/product/vision.md ## Discovery Notes — BUG-0018; handoffs/intake_evidence/BUG-0018-intake-20260912.json; .opencode/commands/auto.md; .opencode/plugins/orchestrator.ts attach; docs/engineering/research.md ## R-0119; architecture.md # BUG-0015 CF1; docs/engineering/state.md discovery checkpoint; handoffs/resume_brief.md`
- **Hot-surface note**: Appended (not prepended) so triad oldest-prefix rollover retains this newest section (same policy as BUG-0018 intake). Post-append `--check` → `STATE_ARCHIVE_REQUIRED` `state` 1239/1200 → `--rollover` `rollover_complete units=1` → `docs/engineering/state-archive/state-pack-20260912.md`; po_to_tl under cap (no po rollover); final `--check` PASS.
- **Status**: BUG-0018 remains **OPEN**. **Next**: `/research` in fresh **tech-lead** subagent. Do not spawn research from this discovery chat. STOP.

## Research handoff — BUG-0018 OpenCode markdown `/auto` wins over plugin execute

- **Phase completed**: research. **Role**: tech-lead. **Bug**: BUG-0018 only. **Sprint**: (pending). **Verdict**: PASS (`decision_gate=false`).
- **Timestamp (UTC)**: 2026-09-12T09:50:00Z. **Fresh marker**: `tl-BUG0018-research-20260912T094000Z-fresh`.
- **Orchestrator**: `orchestrator_run_id=auto-20260912-bug0018`, `delivery_mode=ultra_lean`, macro=`plan`, `model_id=cursor-grok-4.6`, CROSS_MODEL_REVIEW=1.
- **Research anchor**: `docs/engineering/research.md` **`## R-0120`** (DQ1–DQ8 LOCKED). Discovery D1–D10 not rewritten. Compose R-0119 / R-0114 (do not wipe).
- **Sibling boundary**: BUG-0015/BUG-0016/BUG-0017 DONE — out of scope. Symptom B Cursor Task-unavailable is **not a bug**.

### Closed questions DQ1–DQ8

| DQ | Topic | Resolution | LOCK |
|----|-------|------------|------|
| DQ1 | Same-name merge | Markdown template owns `/auto` when `auto.md` exists; plugin `execute` does not override (live markdown-wins; add-only transform) | LOCKED |
| DQ2 | Load order / reload | Later `editor.add` / `command.reload()` do not beat markdown — reject Axis C | LOCKED |
| DQ3 | `command.executed` | Not proven for markdown templates; shipped secondary subscribe did not start lifecycle — not primary | LOCKED |
| DQ4 | CommandEditor | `add` only; cannot replace/remove markdown; reject Axis D | LOCKED |
| DQ5 | Slash listing without `auto.md` | Plugin `name`+`description` lists `/auto`; reject Axis B extra slash name | LOCKED |
| DQ6 | Fail-closed code | Reuse `OPENCODE_PLUGIN_DISPATCH_ATTACH_UNSUPPORTED` for missing attach; additive `OPENCODE_AUTO_MARKDOWN_COLLISION` if leftover `auto.md` | LOCKED |
| DQ7 | Tests + DEC | 6 `test_bug0018_*`; compose-only if-present relax of bug0015/us0125 `auto.md` asserts; **no companion DEC**; `# BUG-0018` supersedes CF1 | LOCKED |
| DQ8 | Consumer upgrade | Upgrade is copy-only — must **prune** leftover consumer `auto.md`; kit-only insufficient | LOCKED |

### Architecture seeds

- **A1 / Axis A (recommended)**: Remove colliding `.opencode/commands/auto.md` (active + template); keep plugin `editor.add({ name: "auto", execute })` → `runAutoLifecycle`; targeted upgrade prune; 6 `test_bug0018_*`; compose-only if-present test relaxations. **No companion DEC.** Cite **R-0120**; supersede `# BUG-0015` CF1 in additive `# BUG-0018`.
- Reject Axis B renamed markdown; Axis C later-add/reload; Axis D undocumented host override.

### Runtime proof (DEC-0038)

- `runtime_proof_id=rp-auto-20260912-bug0018-research-techlead-20260912T095000Z-BUG-0018`
- `proof_hash=6E62DB20F5F4B898E086B6DD8385E3874A5A6DC43C896314F81F6C8D65E3AA0A`
- `proof_ttl=2026-09-12T10:50:00Z`
- Canonical payload: `{"delivery_mode":"ultra_lean","macro_phase":"plan","model_id":"cursor-grok-4.6","orchestrator_run_id":"auto-20260912-bug0018","phase_id":"research","proof_issued_at":"2026-09-12T09:50:00Z","proof_ttl_seconds":3600,"role":"tech-lead","runtime_proof_id":"rp-auto-20260912-bug0018-research-techlead-20260912T095000Z-BUG-0018","sprint_id":"none","story_id":"BUG-0018"}`
- Consumed discovery proof: `rp-auto-20260912-bug0018-discovery-po-20260912T092800Z-BUG-0018` / `0786CBA6FFED9208970ABE0E22C1CC72683D8B5B0EF2F4076191947E55F2D543` — RUNTIME_PROOF_VALID (MATCH before TTL `2026-09-12T10:28:00Z`)

### Isolation + stop

- `phase_id=research`, `role=tech-lead`, `bug_id=BUG-0018`, `fresh_context_marker=tl-BUG0018-research-20260912T094000Z-fresh`, `model_id=cursor-grok-4.6`
- `evidence_ref=docs/engineering/research.md ## R-0120; docs/product/backlog.md ### BUG-0018 research_notes; docs/engineering/state.md research checkpoint; handoffs/resume_brief.md; .opencode/commands/auto.md; .opencode/plugins/orchestrator.ts; installer.py upgrade copy-only`
- **Hot-surface note**: Appended (not prepended) so triad oldest-prefix rollover retains this newest section.
- **Status**: BUG-0018 remains **OPEN**. **Next**: `/architecture` in fresh **tech-lead** subagent. Do not spawn architecture from this research chat. STOP.

---

