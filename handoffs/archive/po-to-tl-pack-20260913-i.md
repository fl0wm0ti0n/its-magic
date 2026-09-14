# PO to TL archive pack (2026-09-13)

- Rollover trigger: `PO_TO_TL_HOT_MAX_LINES=650, PO_TO_TL_HOT_MAX_SECTIONS=60`
- Source: `handoffs/po_to_tl.md`
- Archived units (oldest first, contiguous prefix): 1
- Retained units in hot file: 13
- First archived heading: `## Research handoff — BUG-0020 OpenCode still has no invokable auto mode after BUG-0019 TUI keymap`
- Last archived heading: `## Research handoff — BUG-0020 OpenCode still has no invokable auto mode after BUG-0019 TUI keymap`
- Verification tuple (mandatory):
  - archived_body_lines=43
  - retained_body_lines=616

---

## Research handoff — BUG-0020 OpenCode still has no invokable auto mode after BUG-0019 TUI keymap

- **Phase completed**: research. **Role**: tech-lead. **Bug**: BUG-0020 only. **Sprint**: (pending). **Verdict**: PASS (`decision_gate=false`).
- **Timestamp (UTC)**: 2026-09-12T22:58:00Z. **Fresh marker**: `tl-BUG0020-research-20260912T231000Z-fresh`.
- **Orchestrator**: `orchestrator_run_id=auto-20260913-bug0020`, parent=`cursor-20260913-BUG0020-intake`, `delivery_mode=ultra_lean`, macro=`plan` (research = first of research+architecture+sprint-plan), `model_id=cursor-grok-4.6`, CROSS_MODEL_REVIEW=1, AUTO_QUIET=1.
- **Research anchor**: `docs/engineering/research.md` **`## R-0126`** (DQ1–DQ8 LOCKED). Discovery D1–D10 not rewritten. Compose R-0125 / R-0124 (do not wipe). R-0124 E* picker claim live-falsified — superseded by additive `# BUG-0020` (architecture), not by rewriting R-0124.
- **Sibling boundary**: BUG-0019/BUG-0018/BUG-0017/BUG-0015/BUG-0016 DONE — out of scope; do not reopen ACs / S0139. Do not mutate US-0133..US-0148; do not drain US-0135. Do not restore STOP-only `auto.md`. Do not prune/touch `.cursor/commands/auto.md` or `.opencode/agents/auto.md`. Do not rewrite DEC-0124/DEC-0125.

### Closed questions DQ1–DQ8

| DQ | Topic | Resolution | LOCK |
|----|-------|------------|------|
| DQ1 | Desktop composer slash source | Command.Info (`sync.data.command` / `GET /api/command`) + app builtins; plugin `editor.add` and TUI keymap are **not** consumed | LOCKED |
| DQ2 | `tui.json` → desktop? | CLI TUI only — reject Axis A as desktop listing; `tui.json` may still load CLI TUI working-start | LOCKED |
| DQ3 | Execute-only desktop listing API | None — Command.Info `template` required; reject Axis B | LOCKED |
| DQ4 | Desktop-visible non-slash start | No kit button/slot API; C-limb = documented CLI TUI `/auto` after `tui.json` load | LOCKED |
| DQ5 | Fail-closed token | Additive `OPENCODE_AUTO_DESKTOP_COMMAND_INFO_LISTING_UNSUPPORTED`; do not reuse TUI-keymap-missing or markdown-collision | LOCKED |
| DQ6 | Tests + DEC | 8 `test_bug0020_*` contract tests; **no companion DEC**; `# BUG-0020` supersedes R-0124 E* picker claim; do not weaken `test_bug0018_*` / `test_bug0019_*` | LOCKED |
| DQ7 | Consumer upgrade | Copy-on-add delivers `tui.json`/token wiring to already-E* trees; still prune leftover `auto.md`; do not restore `auto.md` | LOCKED |
| DQ8 | Operator host load path | Desktop = Command.Service not `tui.json`; CLI TUI working-start prefers internal “must list in `tui.json`” | LOCKED |

### Architecture seeds

- **E2 / Axis E (recommended)**: Reject E* as the listing fix for the operator Command.Info picker. Honest host-cannot-do-both on desktop list+execute-only `/auto`. Keep `editor.add` → `runAutoLifecycle`. C-limb: documented CLI TUI `/auto` made loadable via `.opencode/tui.json`. Desktop-visible fail-closed token. 8 `test_bug0020_*`. **No companion DEC.** Cite **R-0126**; additive `# BUG-0020` supersedes R-0124 E* picker claim. Do **not** restore STOP-only `auto.md`. Do **not** JSON `commands.auto`+`template`.
- Reject Axis A (`tui.json` as desktop listing); Axis B (no execute-only desktop API); Axis C as sole winner (no desktop plugin UI API); Axis D (JSON/md 0018-class).

### Runtime proof (DEC-0038)

- `runtime_proof_id=rp-auto-20260913-bug0020-research-techlead-20260912T225800Z-BUG-0020`
- `proof_hash=CD22980C635030A79DAC0705CFA0DEF87C64CF10A3279DEC46E97BCBE7C74CC8`
- `proof_ttl=2026-09-12T23:58:00Z`
- Hash via `scripts.token_cost_lib.compute_strict_proof_hash` (compact sorted-key JSON; not `compute_proof_hash.py` default spaces).
- Canonical hashed payload: `{"orchestrator_run_id":"auto-20260913-bug0020","phase_id":"research","proof_issued_at":"2026-09-12T22:58:00Z","proof_ttl_seconds":3600,"role":"tech-lead","runtime_proof_id":"rp-auto-20260913-bug0020-research-techlead-20260912T225800Z-BUG-0020"}`
- Isolation extras (not hashed): `delivery_mode=ultra_lean`, `macro_phase=plan`, `model_id=cursor-grok-4.6`, `sprint_id=none`, `story_id=BUG-0020`
- Consumed discovery proof: `rp-auto-20260913-bug0020-discovery-po-20260912T224500Z-BUG-0020` / `935A9B7B69DBCBD3A07B4014322814A53C312D9A6A63415A0E6BCAB7FDF030F3` — RUNTIME_PROOF_VALID (MATCH before TTL `2026-09-12T23:45:00Z`)

### Isolation + stop

- `phase_id=research`, `role=tech-lead`, `bug_id=BUG-0020`, `fresh_context_marker=tl-BUG0020-research-20260912T231000Z-fresh`, `model_id=cursor-grok-4.6`
- `evidence_ref=docs/engineering/research.md ## R-0126; docs/product/backlog.md ### BUG-0020 research_notes; docs/engineering/state.md research checkpoint; .opencode/plugins/orchestrator.ts attach; .opencode/plugins/its-magic-auto/{index.ts,tui.ts}; absent .opencode/commands/auto.md + .opencode/tui.json + .opencode/cli.json; tests/bug0018_* / tests/bug0019_*`
- **Hot-surface note**: Appended (not prepended) so triad oldest-prefix rollover retains this newest section. Post-append `--check` → `STATE_ARCHIVE_REQUIRED` `state` 1259/1200 units=17/80 (`po_to_tl` under cap) → `arch_linkage_guard.py --pre` exit 0 → `--rollover` `rollover_complete units=1` pack_state=`docs/engineering/state-archive/state-pack-20260912-bp.md` (archived `## Sprint-plan checkpoint — BUG-0019 / S0139 / auto-20260912-bug0019 (role=tech-lead)`; archived_body_lines=67; preamble_lines=11; retained_body_lines=1192) → `--post` exit 0; tuple fill then final `--check` PASS (`state` 1194/1200 units=16/80; `po_to_tl` 640/650 units=16/60).
- **Status**: BUG-0020 remains **OPEN**. **Next**: `/architecture` in fresh **tech-lead** subagent. Do not spawn architecture from this research chat. STOP.

