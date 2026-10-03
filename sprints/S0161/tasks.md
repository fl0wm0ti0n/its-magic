# Sprint S0161 - Task Checklist (BUG-0030)

Total tasks: 6 (T-anch + T-001..T-005). This is within
`SPRINT_MAX_TASKS=12`; no split is required.

## Execution Order

1. T-anch - Verify planning constraints
2. T-001 - Add the documented `/auto` command
3. T-002 - Retire the managed private TUI/RPC route
4. T-003 - Migrate installer upgrade behavior
5. T-004 - Add contract and parity coverage
6. T-005 - Add opt-in real-host smoke proof and runbook

## Checklist

- [x] **T-anch**: Verify `R-0152`, `DEC-0151`, `# BUG-0030`, OpenCode
  `1.18.32`, and all non-reopen guards. Record the check in the sprint summary.
  Do not modify architecture, research, backlog status, or acceptance. (baseline)
- [x] **T-001**: Create `.opencode/commands/auto.md` and its template twin with
  valid YAML frontmatter `agent: auto` and the canonical spawn-only prompt. The
  body must not be STOP-only. (AC-1, AC-2)
- [x] **T-002**: Remove the managed legacy TUI/RPC `/auto` path from the active
  and template configurations and managed plugin assets without changing
  BUG-0027 manual-persistence behavior. (AC-3, AC-5)
- [x] **T-003**: Make Python, Bash, and PowerShell upgrades install the managed
  command and remove only framework-owned legacy TUI/RPC configuration and
  assets. Preserve unrelated `tui.json` keys and plugins. (AC-5)
- [x] **T-004**: Add `test_bug0030_*` coverage for Markdown frontmatter/body,
  prohibited private route tokens, installer migration, and active/template
  parity. (AC-2, AC-3, AC-4, AC-5)
- [x] **T-005**: Add an opt-in real-host 1.18.32 smoke check and runbook recipe
  that proves `/auto` selects `auto` and admits the command prompt. It must not
  claim provider completion or lifecycle completion. (AC-1, AC-4)

## Completion Gate

- [x] Scoped BUG-0030 contracts pass (`5 passed, 1 skipped`); command
  registration host smoke passed, while the credentialed session-admission
  smoke is intentionally opt-in.
- [x] BUG-0027 contracts remain green (`10 passed`); superseded BUG-0024 route
  contracts are explicitly skipped rather than asserting the removed route.
- [x] Active/template parity passes.
- [ ] BUG-0030 remains OPEN; acceptance is unchanged until later lifecycle
  phases complete.
