# Sprint S0160 — Task checklist (BUG-0027)

Total tasks: 8 (T-anch + T-001..T-007). SPRINT_MAX_TASKS=12; SPRINT_AUTO_SPLIT=1; no split (8 ≤ 12). T-anch retained as NO-OP verification. Seeds 1:1 from `docs/engineering/architecture.md` `# BUG-0027`. Sprint id **S0160** locked (S0159 = BUG-0024 — do not reuse).

**Isolation**: `tl-BUG0027-sprintplan-20260921T212600Z-fresh` · `model_id=inherit` · `orchestrator_run_id=auto-20260921-bug0027`

## Task execution order

1. T-anch (NO-OP / verification)
2. T-001 (IsolationEvidence identity fields + `--append-isolation`)
3. T-002 (`persistManualPhaseIsolation` + `command.executed` limb)
4. T-003 (RPC/context forward; reject `tui-auto`; locked tokens)
5. T-004 (permission glob widen + fail-closed-before-work)
6. T-005 (validator pack rewrite / drop)
7. T-006 (10 `test_bug0027_*` markers)
8. T-007 (US-0125 CLI compose-amend + `BUG0027_PAIRS` + upgrade + runbook)

## Task checklist

- [x] **T-anch**: Verify `# BUG-0027` H1 in `docs/engineering/architecture.md`; A1 Hybrid manual-phase persist; R-0151 DQ1–DQ10 LOCKED; companion DEC **none**; do not rewrite `# BUG-0024`; do not reopen 0024; do not claim toast repair; do not merge BUG-0022/0026; do not wipe R-0150/R-0140. Record to `sprints/S0160/t-anch-verification.md`. NO mutation to `architecture.md` / R-0151 in /execute. (DC / architecture baseline; NO-OP)

- [x] **T-001**: IsolationEvidence identity fields (`storyId`/`sprintId`/`orchestratorRunId`/`bugId`); `spawnPhase` copy; `persistIsolationViaPython` + `--append-isolation` `--story-id`/`--sprint-id`/`--orchestrator-run-id`/`--bug-id` in `.opencode/plugins/orchestrator.ts` + `scripts/opencode_auto_bridge.py` (+ template twins). (AC-2, AC-3)

- [x] **T-002**: `persistManualPhaseIsolation` + `command.executed` limb for `MANUAL_PHASE_COMMAND_NAMES`; optional secondary `tool.execute.after` / `session.idle`; **not** `runAutoLifecycle`; mutex vs double-append. Surfaces: `orchestrator.ts` (active + template). (AC-1, AC-2)

- [x] **T-003**: RPC/context forward in `runAutoLifecycleRpc`; reject `tui-auto` (`OPENCODE_PLACEHOLDER_PARENT_REJECTED`); emit locked reason-code tokens; no fabricated proofs (`OPENCODE_MANUAL_PHASE_CONTEXT_MISSING`). (AC-3, AC-4)

- [x] **T-004**: Permission glob widen (dev: `docs/engineering/state.md` + `sprints/S*/summary.md`; qa: `docs/engineering/state.md`) + fail-closed-before-work (`OPENCODE_MANUAL_PHASE_WRITE_DENIED`); deny-last held. Surfaces: `.opencode/agents/{dev,qa}.md` + template. (AC-1)

- [x] **T-005**: Rewrite intake pack to `--file`/`--stdin`/`--self-test`; drop intake validator from execute.md/discovery.md; keep qa/verify-work `bug_issue_validate.py --repo . --check-acceptance`. Surfaces: `.opencode/commands/` + template. `.cursor/commands/` OUT. (AC-5)

- [x] **T-006**: Author `tests/bug0027_opencode_manual_phase_persist_test.py` (+ harness) with 10 markers; no live OpenCode probe in default CI; do not weaken `test_bug0024_*` / `test_us0124_*` except US-0125 CLI compose-amend. (AC-6; markers also cover AC-1..AC-5)

- [x] **T-007**: US-0125 fixture named-CLI compose-amend (ACs stay DONE) + additive `BUG0027_PAIRS` in `check_intake_template_parity.py` + upgrade `--host opencode|both` overwrite of touched OpenCode paths + runbook one-line validator stub correction. (AC-6)

## Locked contract marker table

| # | Marker | AC |
|---|---|---|
| 1 | `test_bug0027_manual_phase_persists_isolation` | AC-1, AC-2, AC-3 |
| 2 | `test_bug0027_denied_persist_not_success` | AC-2 |
| 3 | `test_bug0027_rpc_forwards_story_sprint_run` | AC-3 |
| 4 | `test_bug0027_tui_auto_rejected_as_release_evidence` | AC-3 |
| 5 | `test_bug0027_no_fabricated_proof_when_orchestrator_unavailable` | AC-4 |
| 6 | `test_bug0027_auto_tui_toast_not_claimed` | AC-4 |
| 7 | `test_bug0027_validator_invocation_file_stdin_not_repo_enforce` | AC-5 |
| 8 | `test_bug0027_non_intake_packs_drop_intake_validator` | AC-5 |
| 9 | `test_bug0027_active_template_parity` | AC-6 |
| 10 | `test_bug0027_permission_matrix_phase_writes` | AC-1 |

## Integration verification (post T-007)

- [x] Test gate: bug0027 markers green; compose bug0024/us0124/us0125 still green (except named US-0125 CLI compose-amend)
- [x] Scope gate: no `auto.md` restore; no JSON `commands.auto`; BUG-0022/0026 untouched; BUG-0024 not reopened; toast path unamended
- [x] Status gate: BUG-0027 remains OPEN; AC-1..AC-6 unchecked until verify-work/closure (US-0045 held)

## AC → Task surjective coverage

| AC | Task(s) |
|---|---|
| AC-1 | T-002, T-004 (+ T-006 m1, m10) |
| AC-2 | T-001, T-002 (+ T-006 m2) |
| AC-3 | T-001, T-003 (+ T-006 m1, m3, m4) |
| AC-4 | T-anch, T-003 (+ T-006 m5, m6) |
| AC-5 | T-005 (+ T-006 m7, m8) |
| AC-6 | T-006, T-007 |
| DC / architecture | T-anch |

**Surjectivity check**: 6/6 ACs covered. No `PLAN_AC_COVERAGE_GAP`.
