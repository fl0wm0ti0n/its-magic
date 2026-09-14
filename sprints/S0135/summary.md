# Sprint S0135 — Context Pack / Refresh Summary (BUG-0017)

**sprint_id**: S0135  
**bug_id**: BUG-0017 (Status **DONE**)  
**phase_id**: refresh-context  
**role**: curator  
**orchestrator_run_id**: auto-20260911-bug0017  
**delivery_mode**: ultra_lean  
**macro_phase**: ship (terminal)  
**fresh_context_marker**: `cur-BUG0017-refresh-20260911T202900Z-fresh`  
**timestamp**: 2026-09-11T20:29:00Z (UTC)  
**model_id**: composer-2.5 (CROSS_MODEL_REVIEW=1)  
**verdict**: REFRESH_CONTEXT_PASS  
**segment_closed**: true  

## Segment outcome

| Gate | Result |
|---|---|
| Release | PASS — queue S0135=released; notes `handoffs/releases/S0135-release-notes.md` |
| Closure | PASS — Status OPEN→DONE; acceptance BUG-0017 [x] |
| Sovereign-critic (closure) | PASS — `critic-BUG0017-closure-20260911T202800Z-fresh` |
| Refresh-context | PASS — this pack; retrospective `S0135.md`; R-0118 delivered |

## Runtime proof (refresh-context)

- **runtime_proof_id**: `rp-auto-20260911-bug0017-refresh-context-curator-20260911T202900Z-BUG-0017`
- **proof_hash**: `9D9185FAE3585892A18A9BEB8952A072D5871EEB492B8E5A2038475AAE85DD40`
- **proof_ttl**: 2026-09-11T21:29:00Z

## Drain state

Portfolio **0 OPEN** stories / **0 OPEN** bugs (`drain_terminated=true`). Orchestrator owns sovereign-critic of refresh-context then `advance_sovereign_loop` — curator STOP.

## Prior execute summary (historical)

---

# Sprint S0135 — Execute Summary (BUG-0017) [historical]

**sprint_id**: S0135  
**bug_id**: BUG-0017 (Status was **OPEN** at execute — now **DONE**)  
**phase_id**: execute  
**role**: dev  
**orchestrator_run_id**: auto-20260911-bug0017  
**delivery_mode**: ultra_lean  
**macro_phase**: build+verify  
**fresh_context_marker**: `dev-BUG0017-execute-20260911T192500Z-fresh`  
**timestamp**: 2026-09-11T19:45:00Z (UTC)  
**model_id**: composer-2.5 (CROSS_MODEL_REVIEW=1)  
**verdict**: EXECUTE_PASS  

## Tasks completed

| Task | Result |
|---|---|
| T-anch | PASS — `# BUG-0017` / A* / R-0118 DQ1–DQ6 / NB1–NB3 / no companion DEC / pre-execute CRLF gap confirmed (`sprints/S0135/t-anch-verification.md`); NO architecture/R-0118 mutation |
| T-001 | PASS — DQ1 six `.gitattributes` scoped OpenCode LF rows; no repo-wide `*.md` |
| T-002 | PASS — scoped LF normalize of `.opencode/**` + `template/.opencode/**` in-scope text + `git add --renormalize` (NB2); WT LF on Windows |
| T-003 | PASS — `scripts/guard_installer_publish.py` OpenCode `\r` inventory (commands/agents/plugins/README + template example JSON); BUG-0008/US-0084 unchanged |
| T-004 | PASS — template guard mirror byte-identical; active↔template OpenCode tracked-text parity ready |
| T-005 | PASS — `tests/bug0017_opencode_eol_test.py` (+ template mirror) with exactly 6 `test_bug0017_*` markers |
| T-006 | PASS — runbook DQ6 upgrade recipe (`upgrade --host opencode\|both`) + BUG-0017/R-0118 section (active + template) |
| T-007 | PASS — before-tag `guard:installer` note in runbook + `packaging/chocolatey/tools/chocolateyInstall.ps1` comment (NB1); no choco EOL post-process |

## Test results

```
python -m pytest tests/bug0017_opencode_eol_test.py -v
→ 6 passed

npm run guard:installer
→ PASS (dash skipped on Windows PATH; Python CRLF + token + OpenCode inventory enforced)
```

## Files changed (summary)

- `.gitattributes` — DQ1 rows
- `.opencode/**` + `template/.opencode/**` in-scope `*.{md,ts,json}` — LF normalize
- `scripts/guard_installer_publish.py` + `template/scripts/` mirror
- `tests/bug0017_opencode_eol_test.py` + `template/tests/` mirror
- `docs/engineering/runbook.md` + template — DQ6 + before-tag
- `packaging/chocolatey/tools/chocolateyInstall.ps1` — before-tag comment
- `sprints/S0135/*` progress/summary/t-anch + tasks ticks

## Next

`/qa` (fresh qa subagent). BUG-0017 remains OPEN; acceptance unchecked.
