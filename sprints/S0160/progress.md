# Sprint S0160 — Progress (BUG-0027)

**sprint_id**: S0160  
**bug_id**: BUG-0027  
**story_id**: (none)  
**phase**: verify-work (build+verify macro)  
**role**: qa (fresh per BUG-0006)  
**orchestrator_run_id**: auto-20260921-bug0027  
**parent_orchestrator_run_id**: ir-20260921T190544Z-bug0027  
**delivery_mode**: ultra_lean  
**fresh_context_marker**: `qa-BUG0027-verify-20260921T220700Z-fresh`  
**timestamp**: 2026-09-21T22:07:00Z (UTC)  
**model_id**: inherit (CROSS_MODEL_REVIEW=0)  
**status**: VERIFY_PASS (backlog OPEN per US-0045 — not mutated; AC unchecked)

## Consumed qa proof

- `runtime_proof_id`: `rp-auto-20260921-bug0027-qa-qa-20260921T215200Z-BUG-0027`
- `proof_hash`: `4C93C4878501C9E8BF6966FE926733DB2B4DA7F67363E630FD2EEDE52482B6D5`
- Status: **MATCH**; **NOT_STALE** at consume (ttl `2026-09-21T22:52:00Z`; consumed_at `2026-09-21T22:07:00Z`; wall_clock `2026-09-21T22:06:12Z`)

## Consumed execute proof

- `runtime_proof_id`: `rp-auto-20260921-bug0027-execute-dev-20260921T214400Z-BUG-0027`
- `proof_hash`: `0A6D1399F910A2166D137FFCFA632C9D673FB381EA68E4D8A2056D7337590B33`
- Status: **MATCH**; **NOT_STALE** at consume (ttl `2026-09-21T22:44:00Z`; consumed_at `2026-09-21T22:07:00Z`)

## Verify-work runtime proof

- `runtime_proof_id`: `rp-auto-20260921-bug0027-verify-work-qa-20260921T220700Z-BUG-0027`
- `proof_hash`: `98DE3A16D39BF5B73CC5A4929A3DB2D7094C8D4020255B10D36720CB22A79F73`
- `proof_ttl`: `2026-09-21T23:07:00Z`

## Task status

| Task | Status |
|---|---|
| T-anch | DONE (`sprints/S0160/t-anch-verification.md`) |
| T-001 | DONE (IsolationEvidence identity fields + `--append-isolation`) |
| T-002 | DONE (`persistManualPhaseIsolation` + `command.executed` limb) |
| T-003 | DONE (RPC forward; reject `tui-auto`; locked tokens) |
| T-004 | DONE (dev/qa glob widen + fail-closed-before-work) |
| T-005 | DONE (intake `--file`/`--stdin`/`--self-test`; drop from execute/discovery) |
| T-006 | DONE (10 `test_bug0027_*` + harness) |
| T-007 | DONE (US-0125 named-CLI compose-amend + `BUG0027_PAIRS` + upgrade overwrite + runbook stub) |

## Test gate (independent verify-work re-run)

| Suite | Result |
|---|---|
| bug0027 | **10/10** (0.79s) |
| compose us0125 / bug0016 / bug0024 / bug0015 / us0124 / us0122 / bug0018 / bug0019 | **66/66** (3.37s) |
| parity `--scope bug-0027` | **OK** |
| metadata | exit 0 |
| bug_issue_validate `--check-acceptance` | **[BUG_VALIDATION_OK]** |
| UAT | 7/7 populated; `verified_ready=true` |

## Next

`/release` (fresh **release**). Status OPEN; ACs unchecked; do not claim live OpenCode CLI TUI PASS; do not claim toast repair.
