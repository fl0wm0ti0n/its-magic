# PO to TL archive pack (2026-09-13)

- Rollover trigger: `PO_TO_TL_HOT_MAX_LINES=650, PO_TO_TL_HOT_MAX_SECTIONS=60`
- Source: `handoffs/po_to_tl.md`
- Archived units (oldest first, contiguous prefix): 1
- Retained units in hot file: 13
- First archived heading: `## Research handoff — BUG-0021 OpenCode CLI TUI still has no invokable `/auto` after BUG-0020 tui.json`
- Last archived heading: `## Research handoff — BUG-0021 OpenCode CLI TUI still has no invokable `/auto` after BUG-0020 tui.json`
- Verification tuple (mandatory):
  - archived_body_lines=47
  - retained_body_lines=632

---

## Research handoff — BUG-0021 OpenCode CLI TUI still has no invokable `/auto` after BUG-0020 tui.json

- **Phase completed**: research. **Role**: tech-lead. **Bug**: BUG-0021 only. **Sprint**: (pending). **Verdict**: PASS (`decision_gate=false`).
- **Timestamp (UTC)**: 2026-09-13T12:00:00Z. **Fresh marker**: `tl-BUG0021-research-20260913T120000Z-fresh`.
- **Orchestrator**: `orchestrator_run_id=auto-20260913-bug0021`, `parent_orchestrator_run_id=cursor-20260913-BUG0021-intake`, `delivery_mode=ultra_lean`, macro=`plan` (research = first of research+architecture+sprint-plan), `model_id=cursor-grok-4.6-high`, `model_resolve_fallback=MODEL_RESOLVE_FALLBACK` (requested_slug=`gpt-5.6-sol-high`; host Other Models usage limit), CROSS_MODEL_REVIEW=1, AUTO_QUIET=1, EARLY_RESEARCH=1.
- **Sibling boundary**: BUG-0020/BUG-0019/BUG-0018/BUG-0017/BUG-0015/BUG-0016 DONE — out of scope; do not reopen ACs / S0140. **BUG-0022 OPEN** — do not mutate. Do not mutate US-0133..US-0148; do not drain US-0139+. Do not prune/touch `.cursor/commands/auto.md` or `.opencode/agents/auto.md`. Do **not** restore `.opencode/commands/auto.md`. Do **not** run `--pure`. Do **not** rewrite historical `# BUG-0020`.
- **Research anchor**: `docs/engineering/research.md` **`## R-0134`** (DQ1–DQ8 LOCKED). Discovery D1–D10 not rewritten. Compose **R-0131** / R-0126 / R-0125 / R-0124 / R-0120 (do not wipe R-0120..R-0133). Do not reuse R-0132 (US-0139) or R-0133 (BUG-0022).
- **Approach**: **Axis A** recommended. Reject Axis B (`Plugin.define` / `cli.json` / directory discovery), Axis D (file-existence-only). Axis C (host-true command not chat) is delivered by A.
- **Companion DEC**: **no**. Additive `# BUG-0021` at `/architecture` only — do **not** author it this phase.

### Closed questions DQ1–DQ8

| DQ | Topic | Resolution | LOCK |
|----|-------|------------|------|
| DQ1 | Loader default export | `tui.json` loader `readV1Plugin` reads only `{ id?, tui }` with `tui()` function; `Plugin.define({ setup })` skipped — sufficient silent-miss | LOCKED |
| DQ2 | `name` vs `id`; key required | Command field is **`name`**; bindings `{ key, cmd, desc }`; recommend `name: "its-magic.auto"`, `slashName: "auto"`, key `ctrl+shift+a` (architecture may bikeshed) | LOCKED |
| DQ3 | Slash list source | CLI slash = keymap `namespace: "palette"` + `slashName`; `GET /api/command` = Command.Info (peers). Peers list; `/auto` does not until TUI module loads | LOCKED |
| DQ4 | `run()` → lifecycle | `tui(api)` `run()` → `api.client.rpc(ITS_MAGIC_AUTO_RPC)` → `runAutoLifecycle`; keep `editor.add`; not SessionPrompt; not LLM chat | LOCKED |
| DQ5 | Fail-closed tokens | Reuse LISTING (keymap missing after `tui()` ran) + DISPATCH; additive `OPENCODE_AUTO_CLI_TUI_PLUGIN_LOAD_UNSUPPORTED` for listed-but-skipped; do not reuse desktop / markdown-collision | LOCKED |
| DQ6 | Tests + DEC | 8 `test_bug0021_*` contract markers (not file-existence-only); **no companion DEC**; `# BUG-0021` supersedes R-0126 C-limb; keep 0018/0019/0020 compose | LOCKED |
| DQ7 | Consumer upgrade | Overwrite reshaped `tui.ts` onto already-C-limb trees; `tui.json` stays; still prune leftover `auto.md`; active↔template + `--host opencode\|both` | LOCKED |
| DQ8 | Axes B/C; `--pure` | Reject B as winner; C delivered by A; `--pure` out of scope; residual host-cannot-load → LOAD token, not `auto.md` | LOCKED |

### Architecture seeds

- Author `# BUG-0021` (additive; do **not** rewrite `# BUG-0020`). **No new DEC.**
- Seeds T-anch + T-001..T-007 (8 ≤ SPRINT_MAX_TASKS=12).
- Do not restore `auto.md`. Do not reopen BUG-0020 ACs. Do not mutate BUG-0022 / US-0139+. Do not implement application code this phase.

### Runtime proof (DEC-0038)

- `runtime_proof_id=rp-auto-20260913-bug0021-research-techlead-20260913T120000Z-BUG-0021`
- `proof_hash=C72C0CBA2BCD33EF7926A7EEA08E2CC4D11154009C27F4ED95CAA482D7146440`
- `proof_ttl=2026-09-13T13:00:00Z`
- Hash via `from scripts.token_cost_lib import compute_strict_proof_hash` (positional; compact sorted-key JSON).
- Canonical hashed payload: `{"orchestrator_run_id":"auto-20260913-bug0021","phase_id":"research","proof_issued_at":"2026-09-13T12:00:00Z","proof_ttl_seconds":3600,"role":"tech-lead","runtime_proof_id":"rp-auto-20260913-bug0021-research-techlead-20260913T120000Z-BUG-0021"}`
- Isolation extras (not hashed): `delivery_mode=ultra_lean`, `macro_phase=plan`, `model_id=cursor-grok-4.6-high`, `model_resolve_fallback=MODEL_RESOLVE_FALLBACK`, `requested_slug=gpt-5.6-sol-high`, `sprint_id=none`, `story_id=BUG-0021`
- `hash_recompute_confirmation=true` (compute_strict_proof_hash → C72C0CBA2BCD33EF7926A7EEA08E2CC4D11154009C27F4ED95CAA482D7146440)
- Consumed discovery proof: `rp-auto-20260913-bug0021-discovery-po-20260913T115000Z-BUG-0021` / `671EB358E9E97D7C953D5B098E7FDC5B97544D2481A38931E6D537DE27A7291A` — RUNTIME_PROOF_VALID (MATCH before TTL `2026-09-13T12:50:00Z`; consumed_at `2026-09-13T12:00:00Z`; independent recompute MATCH)

### Isolation + stop

- `phase_id=research`, `role=tech-lead`, `bug_id=BUG-0021`, `fresh_context_marker=tl-BUG0021-research-20260913T120000Z-fresh`, `model_id=cursor-grok-4.6-high`, `model_resolve_fallback=MODEL_RESOLVE_FALLBACK`
- `evidence_ref=docs/engineering/research.md ## R-0134; docs/product/backlog.md ### BUG-0021 research_notes; this handoff; docs/engineering/state.md research checkpoint; handoffs/resume_brief.md; .opencode/tui.json; .opencode/plugins/its-magic-auto/{index.ts,tui.ts}; .opencode/plugins/orchestrator.ts editor.add; absent .opencode/commands/auto.md`
- **Hot-surface note**: Appended (not prepended) so triad oldest-prefix rollover retains this newest section. Post-append `python scripts/enforce-triad-hot-surface.py --check` → STATE_ARCHIVE_REQUIRED `state` 1437/1200 units=16/80 (`po_to_tl` 646/650 under cap) → `arch_linkage_guard.py --pre` exit 0 → `--rollover --json` `{"boundary":"triad-rollover|state","moved":2,"pack_ref":"docs/engineering/state-archive/state-pack-20260913-ce.md","retained_checkpoints":14,"retained_lines":1170}` (archived `## Verify-work checkpoint — US-0138` through `## Sovereign-critic checkpoint — verify-work US-0138`; archived_body_lines=267; preamble_lines=11; retained_body_lines=1170) → `--post` exit 0; po_to_tl not rolled; architecture not rolled; final `--check` PASS (`state` 1173/1200; `po_to_tl` 646/650).
- **Status**: BUG-0021 remains **OPEN**. Acceptance unchecked. **Next**: `/architecture` in fresh **tech-lead** subagent. Do not spawn architecture from this research chat. STOP.

