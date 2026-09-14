# T-anch verification — BUG-0018 / S0136 (NO-OP)

**sprint_id**: S0136  
**bug_id**: BUG-0018  
**task**: T-anch  
**phase_id**: execute  
**role**: dev  
**orchestrator_run_id**: auto-20260912-bug0018  
**fresh_context_marker**: `dev-BUG0018-execute-20260912T102000Z-fresh`  
**timestamp**: 2026-09-12T10:20:00Z (UTC)  
**model_id**: cursor-grok-4.6 (CROSS_MODEL_REVIEW=1)  
**verdict**: PASS (baseline confirmed; NO mutation to architecture.md / R-0120)

## Checks

| Check | Result | Evidence |
|---|---|---|
| `# BUG-0018` H1 in `docs/engineering/architecture.md` | PASS | L2600 `# BUG-0018 — OpenCode markdown `/auto` wins over plugin execute` |
| Approach A* LOCKED | PASS | architecture § Approach locked (A* — Plugin-only `/auto`); A2–A7 rejected |
| R-0120 DQ1–DQ8 LOCKED | PASS | `docs/engineering/research.md` `## R-0120`; DQ1–DQ8 subsections LOCKED |
| CF1 superseded | PASS | architecture `# BUG-0015` CF1 supersede table; historical `# BUG-0015` CF1 cell not rewritten |
| Companion DEC=none | PASS | architecture Decision linkage: none; cite R-0120; compose DEC-0124/0125/0120/0132 |
| Compose DEC-0124/0125 bodies UNCHANGED | PASS | T-anch read-only; no `decisions/DEC-0124.md` / `DEC-0125.md` mutation |
| BUG-0015/0016/0017 not reopened | PASS | compose guards held; Status OPEN for BUG-0018 only |
| `tests/bug0018_*` absent (baseline) | PASS | no `tests/bug0018*` file exists pre-T-005 |
| Colliding `auto.md` still present (pre-T-001) | PASS | `.opencode/commands/auto.md` + `template/.opencode/commands/auto.md` exist |
| Keep surfaces present | PASS | `.opencode/agents/auto.md` and `.cursor/commands/auto.md` exist (do not touch) |
| No architecture.md / R-0120 mutation this task | PASS | read-only verification only |

## Next

T-001 → delete colliding `.opencode/commands/auto.md` (active + template).
