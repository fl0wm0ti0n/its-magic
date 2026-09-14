# PO to TL archive pack (2026-09-13)

- Rollover trigger: `PO_TO_TL_HOT_MAX_LINES=650, PO_TO_TL_HOT_MAX_SECTIONS=60`
- Source: `handoffs/po_to_tl.md`
- Archived units (oldest first, contiguous prefix): 1
- Retained units in hot file: 13
- First archived heading: `## Discovery handoff — BUG-0021 OpenCode CLI TUI still has no invokable `/auto` after BUG-0020 tui.json`
- Last archived heading: `## Discovery handoff — BUG-0021 OpenCode CLI TUI still has no invokable `/auto` after BUG-0020 tui.json`
- Verification tuple (mandatory):
  - archived_body_lines=63
  - retained_body_lines=613

---

## Discovery handoff — BUG-0021 OpenCode CLI TUI still has no invokable `/auto` after BUG-0020 tui.json

- **Phase completed**: discovery. **Role**: po. **Bug**: BUG-0021 only. **Sprint**: (pending). **Verdict**: PASS (`decision_gate=false`).
- **Timestamp (UTC)**: 2026-09-13T11:50:00Z. **Fresh marker**: `po-BUG0021-discovery-20260913T115000Z-fresh`.
- **Orchestrator**: `orchestrator_run_id=auto-20260913-bug0021`, `parent_orchestrator_run_id=cursor-20260913-BUG0021-intake`, `delivery_mode=ultra_lean`, macro=`spec` (intake already DONE — not re-intaken), `model_id=cursor-grok-4.6-high`, `model_resolve_fallback=MODEL_RESOLVE_FALLBACK` (requested_slug=`gpt-5.6-sol-high`; host Other Models usage limit), CROSS_MODEL_REVIEW=1, AUTO_QUIET=1, EARLY_RESEARCH=1.
- **Sibling boundary**: BUG-0020/BUG-0019/BUG-0018/BUG-0017/BUG-0015/BUG-0016 DONE — out of scope; do not reopen ACs / S0140. **BUG-0022 OPEN** — do not mutate. Do not mutate US-0133..US-0148; do not drain US-0139+. Do not prune/touch `.cursor/commands/auto.md` or `.opencode/agents/auto.md`. Cursor `/auto` works — out of scope except do-not-touch. Do **not** restore `.opencode/commands/auto.md`. Do **not** run `--pure`.
- **Gap confirmed**: C-limb files present (`.opencode/tui.json` + template twin listing `"./plugins/its-magic-auto/tui.ts"`; `.opencode/plugins/its-magic-auto/{index.ts,tui.ts}` keymap `slash`/`slashName` `"auto"`; `Plugin.define({ setup })`; command `id` not `name`; keyless bindings; `orchestrator.ts` `editor.add` → `runAutoLifecycle`). **Absent**: `.opencode/commands/auto.md`. Peer markdown commands remain. Operator OpenCode **CLI TUI** (`opencode`, not `--pure`) still has no `/auto`. Typing `/auto ` (not recognized as command) sends chat; model: `+ Thought: Confirming auto mode intent` then `Auto mode enabled. Describe the task you want handled.` — **LLM prompt**, not `runAutoLifecycle`, not OpenCode `--auto`. Live Context7 `/anomalyco/opencode` (this spawn): TUI loader reads **only** default export `{ id, tui }`; `registerLayer` uses command **`name`** + bindings `{ key, cmd }`; `GET /api/command` = Command.Info. Kit module shape mismatches. **R-0126 / `# BUG-0020` C-limb** “CLI TUI `/auto` via tui.json works” **live-falsified**. Compose **R-0131**. Do not wipe R-0120..R-0126, R-0133.

### Discovery locks D1–D10

| ID | Lock |
|----|------|
| **D1** | Outcome: listed OpenCode CLI TUI `/auto` (highlighted/listed, not free-text) starts plugin `execute`/`run()` → `runAutoLifecycle` **or** documented `OPENCODE_*`. Not LLM “Auto mode enabled”. Not markdown STOP. |
| **D2** | Gap class: BUG-0020 C-limb (CLI TUI via `tui.json`) **live-falsified**. Distinct from 0015/0017/0018/0019/0020 desktop DONE. |
| **D3** | Additive `# BUG-0021` supersedes R-0126 / `# BUG-0020` “CLI TUI `/auto` via tui.json works”. Do **not** rewrite historical `# BUG-0020` body. Do **not** reopen BUG-0020 ACs / S0140. |
| **D4** | **Forbidden**: restore STOP-only `.opencode/commands/auto.md`; JSON `commands.auto`+`template` unless `/research` **proves** plugin execute still wins. |
| **D5** | Fix axes (research picks winner; **must live-fetch OpenCode docs/source**): (A) fix TUI plugin to live `{ id, tui }` + `registerLayer` (`name`/`slashName`, bindings `{ key, cmd }`); (B) other CLI listing API; (C) host-true real command not chat; (D) reject file-existence-only as a winning product axis. |
| **D6** | Same-name JSON `template` vs plugin `execute` remains 0018-class until proven otherwise. |
| **D7** | Additive `test_bug0021_*` must **not** be `tui.json`-path-only / slash-string-only. Prefer live OpenCode CLI TUI probe **or** a contract test that the host would load `{ id, tui }` + `registerLayer` and that `run()` reaches `runAutoLifecycle` (or documented `OPENCODE_*`). Keep `test_bug0020_*` / `test_bug0019_*` / `test_bug0018_*` compose. |
| **D8** | Out of scope: Cursor `/auto`; BUG-0022; US-0135+; reopen 0015–0020 ACs; `--pure`; restore `auto.md`. |
| **D9** | Done = listed `/auto` **and** lifecycle starts (or `OPENCODE_*`). Peers remain listed. Not LLM Auto mode. |
| **D10** | Active `.opencode/` ↔ `template/.opencode/` parity for TUI module/`tui.json`/ownership change; upgrade `--host opencode|both` must deliver the chosen surface. |

### Research questions DQ1–DQ8 (for `/research` → **R-0134**)

1. **DQ1**: Does the CLI TUI loader consume only default export `{ id, tui }` (named exports / `Plugin.define({ setup })` ignored)? Cite live `tui-plugins.md`. Is kit default export sufficient to explain silent missing `/auto`?
2. **DQ2**: Do command `id` vs `name` and keyless bindings silently drop slash listing? What host-true `key` for `/auto` without colliding builtins?
3. **DQ3**: CLI slash list source — keymap `slashName` (`namespace: "palette"`) vs `GET /api/command` Command.Info? Why do peers list and `/auto` does not?
4. **DQ4**: Host-true `run()` → `runAutoLifecycle` path (RPC vs keymap.run vs `editor.add` execute). Not SessionPrompt. Not LLM chat.
5. **DQ5**: Fail-closed tokens: reuse `OPENCODE_AUTO_SLASH_LISTING_UNSUPPORTED` / `OPENCODE_AUTO_TUI_DISPATCH_UNSUPPORTED` / desktop token vs new CLI-TUI-specific `OPENCODE_*` when `tui.json` is present but slash still missing (silent miss vs LLM chat).
6. **DQ6**: `test_bug0021_*` inventory + companion DEC vs additive `# BUG-0021`; no file-existence-only tests; keep 0020/0019/0018 compose.
7. **DQ7**: Consumer upgrade path for already-C-limb trees (`tui.json` shipped; `tui.ts` shape change); leftover `auto.md` still prune.
8. **DQ8**: Other CLI listing APIs if Axis A still does not list; host-true real command not chat (Axes B/C); `--pure` out of scope.

### Design refs

- Live Context7 `/anomalyco/opencode`: `packages/opencode/specs/tui-plugins.md`; `packages/opencode/specs/v2/tui-command-shim.md`; `GET /api/command` = Command.Info
- Kit: `.opencode/tui.json`; `.opencode/plugins/its-magic-auto/{index.ts,tui.ts}`; `.opencode/plugins/orchestrator.ts` `editor.add`; absent `.opencode/commands/auto.md`
- Compose: `docs/engineering/research.md` **R-0131** / R-0126 / R-0125 / R-0124 / R-0120 (do not wipe R-0120..R-0126, R-0133; do not reuse R-0132)
- Intake: `handoffs/intake_evidence/BUG-0021-intake-20260913.json`

### Research stub (PO does not author `docs/engineering/research.md`)

- **Expected next R-id**: **R-0134** (deterministic continuation; `ID_NAMESPACE_BOOTSTRAP=0`; highest existing heading is **R-0133** BUG-0022).
- **Do not** author `## R-0131` (already taken). **Do not** author `## R-0134` this phase — tech-lead owns allocation at `/research`. Do not wipe R-0120..R-0126, R-0133. Do not reuse R-0132 (US-0139).

### Runtime proof (DEC-0038)

- `runtime_proof_id=rp-auto-20260913-bug0021-discovery-po-20260913T115000Z-BUG-0021`
- `proof_hash=671EB358E9E97D7C953D5B098E7FDC5B97544D2481A38931E6D537DE27A7291A`
- `proof_ttl=2026-09-13T12:50:00Z`
- Hash via `from scripts.token_cost_lib import compute_strict_proof_hash` (positional; compact sorted-key JSON).
- Canonical hashed payload: `{"orchestrator_run_id":"auto-20260913-bug0021","phase_id":"discovery","proof_issued_at":"2026-09-13T11:50:00Z","proof_ttl_seconds":3600,"role":"po","runtime_proof_id":"rp-auto-20260913-bug0021-discovery-po-20260913T115000Z-BUG-0021"}`
- Isolation extras (not hashed): `delivery_mode=ultra_lean`, `macro_phase=spec`, `model_id=cursor-grok-4.6-high`, `model_resolve_fallback=MODEL_RESOLVE_FALLBACK`, `requested_slug=gpt-5.6-sol-high`, `sprint_id=none`, `story_id=BUG-0021`
- `hash_recompute_confirmation=true` (compute_strict_proof_hash → 671EB358E9E97D7C953D5B098E7FDC5B97544D2481A38931E6D537DE27A7291A)

### Isolation + stop

- `phase_id=discovery`, `role=po`, `bug_id=BUG-0021`, `fresh_context_marker=po-BUG0021-discovery-20260913T115000Z-fresh`, `model_id=cursor-grok-4.6-high`, `model_resolve_fallback=MODEL_RESOLVE_FALLBACK`
- `evidence_ref=docs/product/backlog.md ### BUG-0021 discovery_notes; docs/product/vision.md ## Discovery Notes — BUG-0021; this handoff; docs/engineering/research.md ## R-0131; .opencode/tui.json; .opencode/plugins/its-magic-auto/{index.ts,tui.ts}; .opencode/plugins/orchestrator.ts editor.add; absent .opencode/commands/auto.md; docs/engineering/state.md discovery checkpoint`
- **Hot-surface note**: Appended (not prepended) so triad oldest-prefix rollover retains this newest section. Concurrent US-0139 architecture handoff was already newest; this section re-appended to true end. Post-append `python scripts/enforce-triad-hot-surface.py --rollover --json` -> boundary triad-rollover|po_to_tl moved=2 pack_ref=handoffs/archive/po-to-tl-pack-20260913-l.md retained_lines=602 retained_sections=13 (archived Architecture handoff US-0135 through Discovery handoff US-0136; archived_body_lines=106; retained_body_lines=602). State not rolled. Architecture not rolled. Final `--check` PASS (state 1200/1200; po_to_tl 599/650).
- **Status**: BUG-0021 remains **OPEN**. Acceptance unchecked. **Next**: `/research` in fresh **tech-lead** subagent (orchestrator may insert sovereign-critic of discovery first: CROSS_MODEL_REVIEW=1). Do not spawn research from this discovery chat. STOP.

