# T-anch verification — BUG-0021 / S0146 (NO-OP)

**sprint_id**: S0146  
**bug_id**: BUG-0021  
**task**: T-anch  
**phase_id**: execute  
**role**: dev  
**orchestrator_run_id**: auto-20260913-bug0021  
**fresh_context_marker**: `dev-BUG0021-execute-20260913T125000Z-fresh`  
**timestamp**: 2026-09-13T12:50:00Z (UTC)  
**model_id**: cursor-grok-4.6-high (CROSS_MODEL_REVIEW=1)  
**verdict**: PASS (baseline confirmed; NO mutation to architecture.md / R-0134)

Fresh execute cycle (do not reuse `tl-BUG0021-sprintplan-20260913T124000Z-fresh` or critic/architecture markers).

## Checks

| Check | Result | Evidence |
|---|---|---|
| `# BUG-0021` H1 in `docs/engineering/architecture.md` | PASS | L2715 `# BUG-0021 — OpenCode CLI TUI still has no invokable `/auto` after BUG-0020 tui.json` |
| Axis A LOCKED | PASS | architecture § Approach locked (Axis A — `{ id, tui }` + `registerLayer` `name`/`slashName: "auto"`/`namespace: "palette"`/`ctrl+shift+a`; `run()` → `api.client.rpc`; keep `tui.json` + `editor.add`). Axes B/D/E/F/G rejected; C delivered by A |
| R-0134 DQ1–DQ8 LOCKED | PASS | `docs/engineering/research.md` `## R-0134`; DQ1 loader `{ id, tui }` only; DQ2 `name` + keyed bindings; DQ3 CLI slash = keymap not Command.Info; DQ4 `api.client.rpc`; DQ5 LOAD token; DQ6 eight `test_bug0021_*`; DQ7 overwrite `tui.ts`; DQ8 `tui.json` load path. Compose R-0131 / R-0126 / R-0125 / R-0124 (not rewritten) |
| R-0126 / `# BUG-0020` C-limb listing claim superseded | PASS | architecture CF supersede table; historical `# BUG-0020` body + R-0126 body not rewritten; C-limb remains load path |
| Companion DEC=none | PASS | architecture Decision linkage: none; cite R-0134; no new DEC this execute |
| Compose DEC-0124/0125 bodies UNCHANGED | PASS | T-anch read-only; no `decisions/DEC-0124.md` / `DEC-0125.md` mutation |
| BUG-0015/0016/0017/0018/0019/0020 not reopened | PASS | compose guards held; Status OPEN for BUG-0021 only; BUG-0020 remains DONE |
| BUG-0022 OPEN not mutated; US-0139 / S0145 not reused | PASS | no edits under S0145 / BUG-0022 / US-0139 |
| `tests/bug0021_*` absent at T-anch baseline | PASS | no `tests/bug0021*` file existed pre-T-005 of this cycle (created later in T-005) |
| Colliding `auto.md` still absent (compose 0018 / AC-3/AC-8 peers) | PASS | `.opencode/commands/auto.md` + template twin absent; `.opencode/agents/auto.md` and `.cursor/commands/auto.md` exist; peers `.opencode/commands/ask.md` / `quick.md` present |
| Plugin execute retained (pre-T-003) | PASS | `.opencode/plugins/orchestrator.ts` has `editor.add({ name: "auto", execute })` → `runAutoLifecycle` |
| Keep `its-magic-auto/index.ts` server `Plugin.define` (no `tui` export) | PASS | active + template twins present; plugin-local `its-magic-auto/tui.json` absent; kit `cli.json` absent |
| No architecture.md / R-0134 mutation this task | PASS | read-only verification only |
| Consumed sprint-plan proof | PASS | `rp-auto-20260913-bug0021-sprint-plan-techlead-20260913T124000Z-BUG-0021` / `11A440144E6A2350DADBE1C2709BE6A2769E15D1074964211AD11CD7897423DD` independently MATCH (`compute_strict_proof_hash` positional). Producer TTL `2026-09-13T13:40:00Z`. Consumed critic `rp-auto-20260913-bug0021-sovereign-critic-techlead-20260913T124500Z-BUG-0021` / `A0557CE51629308F1CCC9F6297AEC6033019A2AD2D8BF6B5F3B83BEAEACF4A1E` MATCH before TTL `2026-09-13T13:45:00Z`. |

## Next

T-001 → reshape `.opencode/plugins/its-magic-auto/tui.ts` + template to live default export `{ id: "its-magic.auto.tui", tui }`.
