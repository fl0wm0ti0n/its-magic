# T-anch verification — BUG-0017 / S0135 (NO-OP)

**sprint_id**: S0135  
**bug_id**: BUG-0017  
**task**: T-anch  
**phase_id**: execute  
**role**: dev  
**orchestrator_run_id**: auto-20260911-bug0017  
**fresh_context_marker**: `dev-BUG0017-execute-20260911T192500Z-fresh`  
**timestamp**: 2026-09-11T19:38:00Z (UTC)  
**model_id**: composer-2.5 (CROSS_MODEL_REVIEW=1)  
**verdict**: PASS (baseline confirmed; NO mutation to architecture.md / R-0118)

## Checks

| Check | Result | Evidence |
|---|---|---|
| `# BUG-0017` H1 in `docs/engineering/architecture.md` | PASS | L2696 `# BUG-0017 — OpenCode pack CRLF / LF normalization (Linux slash commands)` |
| Approach A* LOCKED | PASS | architecture § Approach locked (A* — from R-0118 A1 / DQ1–DQ6); A2–A5 rejected |
| R-0118 DQ1–DQ6 LOCKED | PASS | `docs/engineering/research.md` `## R-0118`; DQ1–DQ6 subsections LOCKED |
| NB1–NB3 closed | PASS | architecture critic NB closures table (choco before-tag / scoped renormalize / DQ6 upgrade) |
| Companion DEC=none | PASS | architecture Decision linkage: none; cite R-0118; compose BUG-0008/US-0084/DEC-0120 |
| Compose BUG-0008 / US-0084 / DEC-0120 | PASS | architecture Decision linkage + compose guards; do not reopen BUG-0015/0016 |
| Pre-execute gap: no OpenCode `.gitattributes` rows | PASS | `.gitattributes` only `*.sh` / `*.manifest` LF |
| Pre-execute gap: OpenCode pack still CRLF | PASS | `.opencode/commands/auto.md` has `\r`; active 26 + template 27 in-scope CRLF files |
| Pre-execute gap: guard not OpenCode-wired | PASS | `scripts/guard_installer_publish.py` scans installer.sh + manifests only |
| `tests/bug0017_*` absent (baseline) | PASS | no `tests/bug0017*` file exists pre-T-005 |
| No architecture.md / R-0118 mutation this task | PASS | read-only verification only |

## Next

T-001 → append DQ1 `.gitattributes` scoped OpenCode LF rows.
