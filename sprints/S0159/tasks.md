# Sprint S0159 — Task checklist (BUG-0024)

Total tasks: 8 (T-anch + T-001..T-007). SPRINT_MAX_TASKS=12; SPRINT_AUTO_SPLIT=1; no split (8 ≤ 12). T-anch retained as NO-OP verification. Seeds 1:1 from `docs/engineering/architecture.md` `# BUG-0024`. Sprint id **S0159** locked (S0158 = US-0150 — do not reuse).

**Isolation**: `tl-BUG0024-sprintplan-20260921T194900Z-fresh` · `model_id=inherit` · `orchestrator_run_id=auto-20260921-bug0024`

## Task execution order

1. T-anch (NO-OP / verification)
2. T-001 (peer-brand signal on `rpc.ts`)
3. T-002 (orchestrator register-skipped honesty + `editor.add`)
4. T-003 (`dispatchRunAutoLifecycle` limb order + stage tokens)
5. T-004 (DISPATCH umbrella-only; no silent localhost)
6. T-005 (8 `test_bug0024_*` markers)
7. T-006 (upgrade overwrite + prune `auto.md`)
8. T-007 (runbook + parity + `BUG0024_PAIRS`)

## Task checklist

- [x] **T-anch**: Verify `# BUG-0024` H1 in `docs/engineering/architecture.md`; A1 Hybrid residual live-dispatch; R-0140 DQ1–DQ10 LOCKED; `# BUG-0023` live claim superseded; companion DEC **none**; do not rewrite `# BUG-0023`/`# BUG-0021`; do not reopen 0023/0021; do not merge BUG-0022; do not drain BUG-0027. Record to `sprints/S0159/t-anch-verification.md`. NO mutation to `architecture.md` / R-0140 in /execute. (DC / architecture baseline; NO-OP)

- [x] **T-001**: Peer-brand signal on `ITS_MAGIC_AUTO_RPC` in `.opencode/plugins/its-magic-auto/rpc.ts` (+ template twin); keep local identity-define for orchestrator load; TUI happy path requires brand true. (AC-1)

- [x] **T-002**: In `.opencode/plugins/orchestrator.ts` (+ template): keep `await ctx.rpc.register(ITS_MAGIC_AUTO_RPC, { runAutoLifecycle })` when register exists; keep `editor.add({ name: "auto", execute })`; emit `OPENCODE_AUTO_TUI_REGISTER_SKIPPED` when register absent (observable; not silent success). (AC-1, AC-5)

- [x] **T-003**: Rewrite `dispatchRunAutoLifecycle` limb order + stage tokens (`OPENCODE_AUTO_TUI_MISSING_CLIENT` / `RPC_ABSENT` / `DEFINED_UNBRANDED` / `MAKE_UNREACHABLE` / swallowed-rpc stage); keep `{ id, tui }` listing; never SessionPrompt / Command.Info template / invented POST. (AC-1)

- [x] **T-004**: `OPENCODE_AUTO_TUI_DISPATCH_UNSUPPORTED` only as umbrella when limbs exhausted; never silent `localhost:4096`; do not reuse listing/load/desktop/markdown tokens. Document in runbook stub. (AC-1, AC-2)

- [x] **T-005**: Author `tests/bug0024_opencode_cli_tui_live_dispatch_residual_test.py` (+ harness) with 8 markers; no live OpenCode probe in default CI; do not weaken `test_bug0023_*` / `0021` / `0020` / `0019` / `0018` except compose-only. (AC-3, AC-4, AC-5, AC-6, AC-7, AC-8 via markers)

- [x] **T-006**: Upgrade `--host opencode|both` **overwrites** live dispatch path (`tui.ts` / `rpc.ts` / orchestrator register limb) on Axis-A trees; still **prunes** leftover `auto.md`; installer-owned-paths as required. (AC-7)

- [x] **T-007**: Runbook live-dispatch residual recipe + stage-code table + `--pure` out; active↔template parity; additive `BUG0024_PAIRS` in `check_intake_template_parity.py`. (AC-8)

## Locked contract marker table

| # | Marker | AC |
|---|---|---|
| 1 | `test_bug0024_run_missing_api_client_distinct_code` | AC-1 |
| 2 | `test_bug0024_local_unbranded_defined_not_happy_path` | AC-1 |
| 3 | `test_bug0024_register_skipped_observable` | AC-1 |
| 4 | `test_bug0024_make_unreachable_without_baseurl` | AC-1 |
| 5 | `test_bug0024_swallowed_rpc_error_not_only_dispatch` | AC-1, AC-2 |
| 6 | `test_bug0024_keep_editor_add_no_auto_md` | AC-3, AC-4, AC-5 |
| 7 | `test_bug0024_active_template_parity` | AC-8 |
| 8 | `test_bug0024_upgrade_copies_dispatch_still_prunes_auto_md` | AC-7 |

## Integration verification (post T-007)

- [x] Test gate: bug0024 markers green; compose bug0023/0021/0020/0019/0018 still green (QA 2026-09-21T20:02:00Z — bug0024 8/8; compose 37/37)
- [x] Scope gate: no `auto.md` restore; no JSON `commands.auto`; BUG-0022/0027 untouched; BUG-0023/0021 not reopened (QA verified)
- [x] Status gate: BUG-0024 remains OPEN; AC-1..AC-8 unchecked until verify-work/closure (US-0045 held)

## AC → Task surjective coverage

| AC | Task(s) |
|---|---|
| AC-1 | T-001, T-002, T-003, T-004 (+ T-005 m1–m5) |
| AC-2 | T-004, T-005 (m5) |
| AC-3 | T-anch, T-005 (m6) |
| AC-4 | T-005 (m6) |
| AC-5 | T-002, T-005 (m6) |
| AC-6 | T-005 |
| AC-7 | T-006, T-005 (m8) |
| AC-8 | T-007, T-005 (m7) |
| DC / architecture | T-anch |

**Surjectivity check**: 8/8 ACs covered. No `PLAN_AC_COVERAGE_GAP`.
