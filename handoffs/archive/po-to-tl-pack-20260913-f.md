# PO to TL archive pack (2026-09-13)

- Rollover trigger: `PO_TO_TL_HOT_MAX_LINES=650, PO_TO_TL_HOT_MAX_SECTIONS=60`
- Source: `handoffs/po_to_tl.md`
- Archived units (oldest first, contiguous prefix): 1
- Retained units in hot file: 14
- First archived heading: `## Discovery handoff — BUG-0019 OpenCode `/auto` missing from slash list after plugin-only ownership`
- Last archived heading: `## Discovery handoff — BUG-0019 OpenCode `/auto` missing from slash list after plugin-only ownership`
- Verification tuple (mandatory):
  - archived_body_lines=48
  - retained_body_lines=636

---

## Discovery handoff — BUG-0019 OpenCode `/auto` missing from slash list after plugin-only ownership

- **Phase completed**: discovery. **Role**: po. **Bug**: BUG-0019 only. **Sprint**: (pending). **Verdict**: PASS (`decision_gate=false`).
- **Timestamp (UTC)**: 2026-09-12T17:48:00Z. **Fresh marker**: `po-BUG0019-discovery-20260912T174000Z-fresh`.
- **Orchestrator**: `orchestrator_run_id=auto-20260912-bug0019`, `parent_run=cursor-20260912-BUG0019-intake`, `delivery_mode=ultra_lean`, macro=`spec` (intake already DONE — not re-intaken), `model_id=cursor-grok-4.6`, CROSS_MODEL_REVIEW=1.
- **Sibling boundary**: BUG-0018/BUG-0017/BUG-0015/BUG-0016 DONE — out of scope; do not reopen. Do not mutate US-0133..US-0148; do not drain US-0135. Do not prune/touch `.cursor/commands/auto.md` or `.opencode/agents/auto.md`. Cursor `/auto` works — out of scope except do-not-touch.
- **Gap confirmed**: kit `.opencode/commands/auto.md` and `template/.opencode/commands/auto.md` **absent** (BUG-0018 A*); plugin attach present (`editor.add({ name: "auto", execute })` → `runAutoLifecycle`); operator screenshot 2026-09-12: typed `/auto`, no match; peers with markdown files still listed. **R-0120 DQ5** listing claim and **R1 / `# BUG-0018` NB1** live-falsified. Compose **R-0123** (current intake research). Do not wipe R-0120.

### Discovery locks D1–D10

| ID | Lock |
|----|------|
| **D1** | Outcome: OpenCode `/auto` is **invokable from the slash palette (or equivalent host list the operator uses)** AND starts plugin `execute` → `runAutoLifecycle` **or** documented `OPENCODE_*`. Not silent missing-command. Not markdown STOP. |
| **D2** | Gap class: **listing/discovery** of plugin-registered `/auto` vs markdown/JSON command registry. Not missing attach (0015). Not CRLF-all-skip (0017). Not markdown-wins STOP (0018 — collision gone). |
| **D3** | **R-0120 DQ5** (“plugin name+description lists `/auto`”) and **R1 / `# BUG-0018` NB1** are **live-falsified**. Additive `# BUG-0019` must supersede DQ5 listing claim. Do not silently ignore. Do not reopen BUG-0018 ACs. |
| **D4** | **Forbidden listing fix**: restore STOP-only `.opencode/commands/auto.md` (or any markdown body that owns `/auto` as prompt-template and blocks plugin execute). Empty/no-STOP markdown is **not** sufficient if markdown still owns execution (BUG-0018 D4 still true; v2 body is always the prompt template). |
| **D5** | Fix axes (research picks winner): (A) JSON `commands.auto` listing if it appears in TUI **without** stealing execute; (B) markdown listing that does **not** own execute (only if research finds a documented non-colliding path — default assume markdown-wins); (C) different plugin/TUI/API so `editor.add` is consumed by the picker (`command.list` → TUI); (D) dedicated listing file / host config that is not a prompt template; (E) other documented OpenCode listing surface (research may evaluate keymap `slashName` / TUI shim — must prove picker+execute coexistence). |
| **D6** | Same-name JSON `template` vs plugin `execute` is a **collision risk** (commands registry later-replace-earlier; JSON requires `template`). Research must prove coexistence or reject JSON-template `/auto`. |
| **D7** | Additive `test_bug0019_*` (static + mock-ctx listing/ownership). Live OpenCode TUI probe still out of CI unless architecture opts in. Do not weaken `test_bug0018_*` (`auto.md` remains absent). Do not reintroduce STOP-only `auto.md` as a test fixture that recreates 0018. |
| **D8** | Out of scope: Cursor `/auto`; US-0135+; reopen 0015/16/17/18; DEC-0124/0125 body rewrite unless research proves required (prefer additive `# BUG-0019`); host parser patch. |
| **D9** | Done = operator can choose `/auto` in OpenCode list **and** lifecycle starts (or `OPENCODE_*`). Peers remain listed. |
| **D10** | Active `.opencode/` ↔ `template/.opencode/` parity for any listing/ownership change; upgrade `--host opencode|both` must deliver the listing surface (copy/prune as needed). |

### Research questions DQ1–DQ8 (for `/research` → **R-0124**)

1. **DQ1**: Does the TUI slash palette list **only** markdown + JSON (not plugin `editor.add`)? Cite v2 docs + source. Seed: “Only `.md` files are discovered”; live screenshot; GET `/api/command` lists markdown files.
2. **DQ2**: Does `ctx.command.list()` include plugin-added commands? Does the TUI consume that list?
3. **DQ3**: Can JSON `commands.auto` with `template` coexist with plugin `execute`, or does same-name JSON-win (recreate 0018 class)?
4. **DQ4**: Is there a documented command definition that **lists** without providing a prompt `template` that owns execution?
5. **DQ5**: Fail-closed token if `/auto` cannot be listed while plugin execute is registered (new `OPENCODE_*` vs reuse)?
6. **DQ6**: `test_bug0019_*` inventory + companion DEC vs additive `# BUG-0019` superseding R-0120 DQ5.
7. **DQ7**: Consumer upgrade path so already-pruned trees get the listing surface.
8. **DQ8**: Whether `command.reload()` / plugin load order can surface `editor.add` in the picker without a markdown file.

### Runtime proof (DEC-0038)

- `runtime_proof_id=rp-auto-20260912-bug0019-discovery-po-20260912T174800Z-BUG-0019`
- `proof_hash=507087DABF2962119695939EA44F128729F382B4BA3AE69AEE3BF7E75DA65CD1`
- `proof_ttl=2026-09-12T18:48:00Z`
- Canonical payload: `{"delivery_mode":"ultra_lean","macro_phase":"spec","model_id":"cursor-grok-4.6","orchestrator_run_id":"auto-20260912-bug0019","phase_id":"discovery","proof_issued_at":"2026-09-12T17:48:00Z","proof_ttl_seconds":3600,"role":"po","runtime_proof_id":"rp-auto-20260912-bug0019-discovery-po-20260912T174800Z-BUG-0019","sprint_id":"none","story_id":"BUG-0019"}`

### Isolation + stop

- `phase_id=discovery`, `role=po`, `bug_id=BUG-0019`, `fresh_context_marker=po-BUG0019-discovery-20260912T174000Z-fresh`, `model_id=cursor-grok-4.6`
- `evidence_ref=docs/product/backlog.md ### BUG-0019 discovery_notes; docs/product/vision.md ## Discovery Notes — BUG-0019; this handoff; docs/engineering/research.md ## R-0123; .opencode/plugins/orchestrator.ts attach; absent .opencode/commands/auto.md + template/.opencode/commands/auto.md; docs/engineering/state.md discovery checkpoint`
- **Hot-surface note**: Appended (not prepended) so triad oldest-prefix rollover retains this newest section. Pre-write `--check` → `STATE_ARCHIVE_REQUIRED` `state` 1222/1200 (pre-existing from orchestrator materialization). Post-append `--check` → `STATE_ARCHIVE_REQUIRED` `state` 1290/1200 units=17/80 + `po_to_tl` 686/650 units=17/60 → `arch_linkage_guard.py --pre` exit 0 → `--rollover` `rollover_complete units=2,2` pack_state=`docs/engineering/state-archive/state-pack-20260912-av.md` (archived `## Architecture checkpoint — US-0134` through `## Sovereign-critic checkpoint — architecture US-0134`; archived_body_lines=141; retained=1149) pack_po=`handoffs/archive/po-to-tl-pack-20260912-h.md` (archived `## Architecture handoff — US-0132` through `## Intake handoff — BUG-0017`; archived_body_lines=55; retained=631) → `--post` exit 0; final `--check` PASS.
- **Status**: BUG-0019 remains **OPEN**. **Next**: `/research` in fresh **tech-lead** subagent. Do not spawn research from this discovery chat. STOP.

