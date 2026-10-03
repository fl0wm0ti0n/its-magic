# S0161 Summary - BUG-0030

## Delivered

BUG-0030 now routes `/auto` through OpenCode's documented Markdown command
surface and the existing `auto` agent. The retired private TUI/RPC path is
removed from active/template configuration and upgrade migration.

## QA Status

Deterministic checks and the credentialed `session.command("auto")` proof pass.
The real host selected `auto` and durably admitted the canonical prompt.

## Status

- **Release**: S0161 = `released` (2026-09-27T14:35:00Z); RELEASE_PASS gates 1/2/3/4a/4b green.
- **Bug**: **BUG-0030 DONE** (backlog AC-1..AC-5 `[x]`; acceptance row `[x]` — closed 2026-09-27T15:05Z by qa CLOSURE_PASS).
- **Refresh-context**: REFRESH_CONTEXT_PASS (curator, 2026-09-27T15:10:00Z; proof `EAE1586A…` MATCH; segment terminal).

## Closure (2026-09-27T15:05:00Z, role qa, /closure)

CLOSURE_PASS for BUG-0030. Pre-mutation validator bridge `python scripts/bug_issue_validate.py
--repo . --check-acceptance` -> `[BUG_VALIDATION_OK]` exit 0; post-mutation re-run exit 0.
Release proof `rp-auto-20260927-bug0030-release-release-20260927T143000Z-BUG-0030` consumed
within its TTL (15:30:00Z) with independent hash recompute MATCH.

Persistence (orchestrator-enforced per permission model):
- `docs/product/backlog.md` ### BUG-0030: `Status: DONE`; AC-1..AC-5 `[x]`.
- `docs/product/acceptance.md` L218 BUG-0030 row: `- [ ]` -> `- [x]`.
- `docs/engineering/state.md`: closure checkpoint append-bottom (qa / S0161 / CLOSURE_PASS).
- `sprints/S0161/closure-verification.md`: CLOSURE_PASS record.

NB1 residual: full provider-lifecycle completion remains operator UAT after ship; live
OpenCode CLI TUI probe `UAT_PROBE_FORBIDDEN`; publish deferred (`npm_published=false`; kit
0.1.9); no git push (`SYNC_DISABLED`). Next: `/refresh-context` (fresh curator).
