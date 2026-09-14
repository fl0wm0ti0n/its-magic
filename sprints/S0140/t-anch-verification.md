# T-anch verification — BUG-0020 / S0140 (NO-OP)

**sprint_id**: S0140  
**bug_id**: BUG-0020  
**task**: T-anch  
**phase_id**: execute  
**role**: dev  
**orchestrator_run_id**: auto-20260913-bug0020  
**fresh_context_marker**: `dev-BUG0020-execute-20260913T013500Z-fresh`  
**timestamp**: 2026-09-13T01:35:00Z (UTC)  
**model_id**: cursor-grok-4.6-high (CROSS_MODEL_REVIEW=1)  
**verdict**: PASS (baseline confirmed; NO mutation to architecture.md / R-0126)

Fresh execute cycle (do not reuse `dev-BUG0020-execute-20260913T001000Z-fresh` or critic/sprint-plan markers).

## Checks

| Check | Result | Evidence |
|---|---|---|
| `# BUG-0020` H1 in `docs/engineering/architecture.md` | PASS | L2719 `# BUG-0020 — OpenCode still has no invokable auto mode after BUG-0019 TUI keymap` |
| Approach E2 LOCKED | PASS | architecture § Approach locked (E2 — honest host-cannot-do-both on desktop Command.Info; C-limb CLI TUI `/auto` via `tui.json`; desktop-visible listing token). E2-A..E2-G rejected |
| R-0126 DQ1–DQ8 LOCKED | PASS | `docs/engineering/research.md` `## R-0126`; DQ1 desktop Command.Info-only custom `/`; DQ2 `tui.json` CLI-TUI-only (Axis A rejected); DQ3 no execute-only desktop listing API; DQ4 C-limb CLI TUI working start; DQ5 additive desktop listing token; DQ6 eight `test_bug0020_*` + no companion DEC; DQ7 upgrade copy-if-absent / JSONC-merge; DQ8 stricter internal `tui.json` load path. Compose R-0125 / R-0124 (not rewritten) |
| R-0124 E* / `# BUG-0019` operator-picker listing claim superseded | PASS | architecture CF supersede table; historical `# BUG-0019` body + R-0124 body not rewritten; E* remains CLI TUI keymap |
| Companion DEC=none (no DEC-0136) | PASS | architecture Decision linkage: none; cite R-0126; `decisions/DEC-0136.md` absent |
| Compose DEC-0124/0125 bodies UNCHANGED | PASS | T-anch read-only; no `decisions/DEC-0124.md` / `DEC-0125.md` mutation |
| BUG-0015/0016/0017/0018/0019 not reopened | PASS | compose guards held; Status OPEN for BUG-0020 only |
| `tests/bug0020_*` absent (baseline at T-anch) | PASS | no `tests/bug0020*` file exists pre-T-005 of this cycle |
| Colliding `auto.md` still absent (compose 0018 / AC-9 peers) | PASS | `.opencode/commands/auto.md` + template twin absent; `.opencode/agents/auto.md` and `.cursor/commands/auto.md` exist; peers `.opencode/commands/ask.md` / `quick.md` present |
| Plugin execute retained (pre-T-002) | PASS | `.opencode/plugins/orchestrator.ts` has `editor.add({ name: "auto", execute })` → `runAutoLifecycle` |
| Keep `its-magic-auto/{index.ts,tui.ts}` | PASS | active + template twins present; plugin-local `its-magic-auto/tui.json` absent; kit `cli.json` absent |
| No architecture.md / R-0126 mutation this task | PASS | read-only verification only |
| Consumed sprint-plan proof | PASS | `rp-auto-20260913-bug0020-sprint-plan-techlead-20260912T234500Z-BUG-0020` / `48453D60EC7A0FF0E77A2DB134534920099CDB90875EABB07CD2653880427193` independently MATCH (`compute_strict_proof_hash` positional). Producer TTL `2026-09-13T00:45:00Z`. Execute wall-clock after TTL: hash MATCH + sovereign-critic consume-before-TTL at `2026-09-12T23:55:00Z` (`rp-auto-20260913-bug0020-sovereign-critic-techlead-20260912T235500Z-BUG-0020` / `DB2C15AF0BE7FACFFD636D04960751CC84A9F3B5EBA5E7330622663F6412AACA`) + S0140 plan files unchanged. Do not cite clerical `155EFD14…` re-spawn hash. |

## Next

T-001 → add `.opencode/tui.json` + `template/.opencode/tui.json` listing `./plugins/its-magic-auto/tui.ts` (CLI-TUI-only).
