# Sprint S0180 summary — BUG-0036

## Context pack pointer (refresh-context 2026-10-16)

- Segment **complete**: REFRESH_CONTEXT_PASS @ `2026-10-16T20:34:04Z`; `orchestrator_run_id=auto-20261016-bug0036`; closure pair consumed (no re-flip).
- **BUG-0036 DONE**; **S0180 released**; AC-1..AC-5 checked; `sprints/S0180/closure-verification.md`; `handoffs/releases/S0180-release-notes.md` (if present).
- Harness provenance: `tests/report.md` `2026-10-16T20:03:04Z` Pass 874 / Fail 8 (foreign set); seven `test_bug0036_*` 7/0.
- **BUG-0026** stays OPEN (not drained this segment). Do not spawn `/auto` from this pair.

- sprint_id: S0180
- bug_id: BUG-0036
- status: **REFRESH_CONTEXT_PASS / segment complete** (`/closure` PASS 2026-10-16T20:32:22Z)
- tasks: T-anch and T-001..T-006 checked
- BUG-0036 **DONE**. AC-1..AC-5 checked. Release PASS; closure curator (DEC-0052).
- plan-verify: skipped (`ultra_lean_not_in_resolved_phase_plan`)
- No git commit, push, or npm publish. No `.env` read.

## What shipped

`scripts/repairable_blocker_lib.py` and the template twin own the four-part predicate, `AUTONOMY_STOP_POLICY` dispatch, the quarantine record, and the expired-proof spawn request. The library does not read the scratchpad. The caller passes the policy value.

`block` keeps members terminal. `auto_repair_then_block` blocks an unproven repair. `auto_repair_then_skip` skips that segment. Cap is 3 attempts per orchestrator run and member in `handoffs/repairable_blocker_ledger/<orchestrator_run_id>.jsonl` (names only).

A foreign harness (`execute_harness_blocked_out_of_scope`) is a member when the active work item's own contract passed and every remaining failure names another owner. A repair value writes a quarantine row and schedules the next lawful phase. It does not edit the foreign owner. `block` stays terminal.

An expired matching proof on a repair value is a spawn request for a fresh child of that pair's writer role. The parent writes neither `docs/engineering/state.md` nor `handoffs/resume_brief.md` and does not call `write_resume_pair`. The child appends state at the bottom, then prepends the brief. `block` stays `RESUME_BRIEF_STALE` and schedules nothing.

Missing, conflicting, and unauthorized evidence stay fail-closed at every hardness. A later member joins only through the predicate plus a repair descriptor. Env reads, npm publish, and git push are not performed.

Both `auto.md` copies call `classify_before_terminal_stale` before the terminal stale stop. The parent stays spawn-only. Both autonomy matrix docs carry the same overlay. The YAML row and both scratchpad assignments were not changed.

## Tests

- `python -m pytest tests/bug0036_repairable_blocker_contract_test.py -q`: 7 passed / 0 failed.
- `python scripts/check-user-visible-metadata.py --repo .`: exit 0.
- `powershell -NoProfile -ExecutionPolicy Bypass -File tests/run-tests.ps1`: exit 1. `tests/report.md` Timestamp 2026-10-16T20:03:04Z Pass 874 / Fail 8.

The eight failures are the pre-existing foreign set, not S0180 regressions:

- `slim auto command contract markers pass` — `test_template_scratchpad_baseline_literal_parity_active` only (`AUTO_BACKLOG_DRAIN` 1 vs 0, `AUTO_BACKLOG_MAX_STORIES` 50 vs 3)
- `check_intake_template_parity` scopes `dev-environment`, `dev-environment` (US-0099), `model-tier` (US-0101), `model-tier-overrides` (US-0102), and `arch-linkage` (US-0129)
- `validate_readme_feature_coverage repo --report` and the idempotent rerun: `README_FEATURE_COVERAGE_GAP:BUG-0029`

S0180's own contract is green. This phase did not edit the scratchpads, the YAML, BUG-0026, BUG-0029, US-0162, or the README. A respawn cannot clear those eight failures inside this bug.
