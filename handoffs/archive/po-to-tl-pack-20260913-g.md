# PO to TL archive pack (2026-09-13)

- Rollover trigger: `PO_TO_TL_HOT_MAX_LINES=650, PO_TO_TL_HOT_MAX_SECTIONS=60`
- Source: `handoffs/po_to_tl.md`
- Archived units (oldest first, contiguous prefix): 2
- Retained units in hot file: 13
- First archived heading: `## Research handoff — BUG-0019 OpenCode slash palette has no `/auto` after plugin-only ownership`
- Last archived heading: `## Architecture handoff — BUG-0019 OpenCode slash palette has no `/auto` after plugin-only ownership`
- Verification tuple (mandatory):
  - archived_body_lines=67
  - retained_body_lines=632

---

## Research handoff — BUG-0019 OpenCode slash palette has no `/auto` after plugin-only ownership

- **Phase completed**: research. **Role**: tech-lead. **Bug**: BUG-0019 only. **Sprint**: (pending). **Verdict**: PASS (`decision_gate=false`).
- **Timestamp (UTC)**: 2026-09-12T17:58:00Z. **Fresh marker**: `tl-BUG0019-research-20260912T175500Z-fresh`.
- **Orchestrator**: `orchestrator_run_id=auto-20260912-bug0019`, parent=`cursor-20260912-BUG0019-intake`, `delivery_mode=ultra_lean`, macro=`plan` (research = first of research+architecture+sprint-plan), `model_id=cursor-grok-4.6`, CROSS_MODEL_REVIEW=1.
- **Research anchor**: `docs/engineering/research.md` **`## R-0124`** (DQ1–DQ8 LOCKED). Discovery D1–D10 not rewritten. Compose R-0123 / R-0120 (do not wipe). R-0120 DQ5 listing claim live-falsified — superseded by additive `# BUG-0019` (architecture), not by rewriting R-0120.
- **Sibling boundary**: BUG-0018/BUG-0017/BUG-0015/BUG-0016 DONE — out of scope; do not reopen. Do not mutate US-0133..US-0148; do not drain US-0135. Do not restore STOP-only `auto.md`. Do not prune/touch `.cursor/commands/auto.md` or `.opencode/agents/auto.md`. Do not rewrite DEC-0124/DEC-0125.

### Closed questions DQ1–DQ8

| DQ | Topic | Resolution | LOCK |
|----|-------|------------|------|
| DQ1 | TUI slash list source | Markdown+JSON Command.Info (`template` required) + separate TUI keymap `slash`; plugin `editor.add` is **not** a list source | LOCKED |
| DQ2 | `command.list()` vs TUI | `list()` / `GET /api/command` = Command.Info; TUI does not consume `editor.add` — reject Axis C listing | LOCKED |
| DQ3 | JSON `commands.auto`+`template` | Same registry as markdown; JSON-win = 0018 class — reject Axis A | LOCKED |
| DQ4 | List without prompt `template` | No markdown/JSON path; documented path = TUI keymap `slash`+`run()` | LOCKED |
| DQ5 | Fail-closed token | Reuse attach-missing + `OPENCODE_AUTO_MARKDOWN_COLLISION`; additive `OPENCODE_AUTO_SLASH_LISTING_UNSUPPORTED` | LOCKED |
| DQ6 | Tests + DEC | 7 `test_bug0019_*`; **no companion DEC**; `# BUG-0019` supersedes R-0120 DQ5 / NB1; do not weaken `test_bug0018_*` | LOCKED |
| DQ7 | Consumer upgrade | Copy-on-add delivers TUI listing files to already-pruned trees; still prune leftover `auto.md`; do not restore `auto.md` | LOCKED |
| DQ8 | `command.reload()` / load order | Reload does not list `editor.add` without markdown — reject as listing fix | LOCKED |

### Architecture seeds

- **E1 / Axis E\* (recommended)**: Project-local TUI/CLI plugin keymap layer `slash: { name: "auto" }` (or `slashName: "auto"`) lists `/auto`; `run()` dispatches to existing plugin `execute` → `runAutoLifecycle`; keep `editor.add`; 7 `test_bug0019_*`; additive listing fail-closed token. **No companion DEC.** Cite **R-0124**; additive `# BUG-0019` supersedes R-0120 DQ5 / `# BUG-0018` NB1 residual. Do **not** restore STOP-only `auto.md`.
- Reject Axis A JSON-template `/auto`; Axis B markdown listing; Axis C `command.list`→TUI for `editor.add`; Axis D markdown/JSON listing-only file.

### Runtime proof (DEC-0038)

- `runtime_proof_id=rp-auto-20260912-bug0019-research-techlead-20260912T175800Z-BUG-0019`
- `proof_hash=D67B1BF49AF607EC472297AD62B949798D51ED92B5CE85B0068CAABB009F3854`
- `proof_ttl=2026-09-12T18:58:00Z`
- Canonical payload: `{"delivery_mode":"ultra_lean","macro_phase":"plan","model_id":"cursor-grok-4.6","orchestrator_run_id":"auto-20260912-bug0019","phase_id":"research","proof_issued_at":"2026-09-12T17:58:00Z","proof_ttl_seconds":3600,"role":"tech-lead","runtime_proof_id":"rp-auto-20260912-bug0019-research-techlead-20260912T175800Z-BUG-0019","sprint_id":"none","story_id":"BUG-0019"}`
- Consumed discovery proof: `rp-auto-20260912-bug0019-discovery-po-20260912T174800Z-BUG-0019` / `507087DABF2962119695939EA44F128729F382B4BA3AE69AEE3BF7E75DA65CD1` — RUNTIME_PROOF_VALID (MATCH before TTL `2026-09-12T18:48:00Z`)

### Isolation + stop

- `phase_id=research`, `role=tech-lead`, `bug_id=BUG-0019`, `fresh_context_marker=tl-BUG0019-research-20260912T175500Z-fresh`, `model_id=cursor-grok-4.6`
- `evidence_ref=docs/engineering/research.md ## R-0124; docs/product/backlog.md ### BUG-0019 research_notes; docs/engineering/state.md research checkpoint; handoffs/resume_brief.md; .opencode/plugins/orchestrator.ts attach; absent .opencode/commands/auto.md + template/.opencode/commands/auto.md; tests/bug0018_*`
- **Hot-surface note**: Appended (not prepended) so triad oldest-prefix rollover retains this newest section. Post-append `--check` → `STATE_ARCHIVE_REQUIRED` `state` 1215/1200 units=16/80 + `po_to_tl` 672/650 units=16/60 → `arch_linkage_guard.py --pre` exit 0 → `--rollover` `rollover_complete units=1,1` pack_state=`docs/engineering/state-archive/state-pack-20260912-ax.md` pack_po=`handoffs/archive/po-to-tl-pack-20260912-i.md` → `--post` exit 0; final `--check` PASS.
- **Status**: BUG-0019 remains **OPEN**. **Next**: `/architecture` in fresh **tech-lead** subagent. Do not spawn architecture from this research chat. STOP.

## Architecture handoff — BUG-0019 OpenCode slash palette has no `/auto` after plugin-only ownership

- **Phase completed**: architecture. **Role**: tech-lead. **Bug**: BUG-0019 only. **Sprint**: (pending — materialize at `/sprint-plan`). **Verdict**: PASS (`decision_gate=false`).
- **Timestamp (UTC)**: 2026-09-12T18:15:00Z. **Fresh marker**: `tl-BUG0019-architecture-20260912T181000Z-fresh`.
- **Orchestrator**: `orchestrator_run_id=auto-20260912-bug0019`, parent=`cursor-20260912-BUG0019-intake`, `delivery_mode=ultra_lean`, macro=`plan` (architecture = second of research+architecture+sprint-plan), `model_id=cursor-grok-4.6`, CROSS_MODEL_REVIEW=1.
- **Architecture anchor**: `docs/engineering/architecture.md` **`# BUG-0019`**. Research **`R-0124`** (DQ1–DQ8 unchanged). Discovery D1–D10 unchanged.
- **Approach**: **E1 / E\*** LOCKED — TUI keymap `slash`/`slashName` `"auto"` lists `/auto`; `run()` → `context.client` / plugin RPC → `runAutoLifecycle`; keep `editor.add`; additive sibling `.opencode/plugins/its-magic-auto/{index.ts,tui.ts}` (keep flat `orchestrator.ts`); **no `cli.json`**; token **`OPENCODE_AUTO_SLASH_LISTING_UNSUPPORTED`** (no bikeshed) + dispatch sibling `OPENCODE_AUTO_TUI_DISPATCH_UNSUPPORTED`; 7 `test_bug0019_*`; upgrade copy listing files + still prune leftover `auto.md`. Additive `# BUG-0019` supersedes R-0120 DQ5 / `# BUG-0018` NB1 (historical bodies UNCHANGED). **No companion DEC** (do not allocate DEC-0135).
- **Layout**: additive sibling package (simplest OpenCode actually discovers per v2 CLI docs). Reject convert-`orchestrator.ts`.
- **Rejected**: E2 Axis A JSON-template; E3 Axis B restore `auto.md`; E4 Axis C `command.list`→TUI; E5 Axis D md/JSON listing-only; E6 convert orchestrator package; E7 DEC-0135.
- **Task seeds**: T-anch + T-001..T-007 (8; under `SPRINT_MAX_TASKS=12`) — refine into next free sprint id at `/sprint-plan`.
- **Sibling boundary**: BUG-0018/0017/0015/0016 DONE — out of scope; do not reopen. Do not mutate US-0133..US-0148; do not drain US-0135. Do not restore STOP-only `auto.md`. Do not prune/touch `.cursor/commands/auto.md` or `.opencode/agents/auto.md`. Do not rewrite DEC-0124/DEC-0125. Do not spawn `/sprint-plan` from this architecture chat.

### Runtime proof (DEC-0038)

- `runtime_proof_id=rp-auto-20260912-bug0019-architecture-techlead-20260912T181500Z-BUG-0019`
- `proof_hash=467370D2B9622A20D2659B59116522D4E7D8F42B65253A936F40A0A72C729970`
- `proof_ttl=2026-09-12T19:15:00Z`
- Canonical payload: `{"delivery_mode":"ultra_lean","macro_phase":"plan","model_id":"cursor-grok-4.6","orchestrator_run_id":"auto-20260912-bug0019","phase_id":"architecture","proof_issued_at":"2026-09-12T18:15:00Z","proof_ttl_seconds":3600,"role":"tech-lead","runtime_proof_id":"rp-auto-20260912-bug0019-architecture-techlead-20260912T181500Z-BUG-0019","sprint_id":"none","story_id":"BUG-0019"}`
- Consumed research proof: `rp-auto-20260912-bug0019-research-techlead-20260912T175800Z-BUG-0019` / `D67B1BF49AF607EC472297AD62B949798D51ED92B5CE85B0068CAABB009F3854` — RUNTIME_PROOF_VALID (MATCH before TTL `2026-09-12T18:58:00Z`)

### Isolation + stop

- `phase_id=architecture`, `role=tech-lead`, `bug_id=BUG-0019`, `fresh_context_marker=tl-BUG0019-architecture-20260912T181000Z-fresh`, `model_id=cursor-grok-4.6`
- `evidence_ref=docs/engineering/architecture.md # BUG-0019; docs/product/backlog.md ### BUG-0019 architecture_notes; docs/engineering/decisions.md compact index (no DEC-0135); docs/engineering/state.md architecture checkpoint; handoffs/resume_brief.md; .opencode/plugins/orchestrator.ts attach; absent .opencode/commands/auto.md + template twin; tests/bug0018_*`
- **Status**: BUG-0019 remains **OPEN**. **Next**: `/sprint-plan` in fresh **tech-lead** subagent (orchestrator may insert sovereign-critic of architecture first). Do not spawn sprint-plan from this architecture chat. STOP.

