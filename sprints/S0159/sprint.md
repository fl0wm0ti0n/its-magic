# Sprint S0159 — Sprint Plan (BUG-0024)

## Metadata

| Field | Value |
|---|---|
| story_id | (none — bug work item) |
| bug_id | **BUG-0024** |
| story_title | OpenCode CLI TUI listed `/auto` still toasts OPENCODE_AUTO_TUI_DISPATCH_UNSUPPORTED after BUG-0023 Axis A (live dispatch falsified) |
| sprint_id | **S0159** (locked — new folder; S0158 = US-0150 occupied; do not reuse) |
| delivery_mode | ultra_lean |
| macro_phase | plan (sprint-plan terminal for plan macro; plan-verify NOT in resolved_phase_plan — skipped; next = /execute dev → build+verify macro) |
| current_phase | sprint-plan |
| approach | A1 (A*) Hybrid residual live-dispatch — peer-branded Defined + stage-distinct OPENCODE_* + Axis A client/make; no auto.md; no companion DEC (R-0140 DQ1–DQ10 LOCKED) |
| companion_DEC | **none** (cite R-0140 / `# BUG-0024` only) |
| research_anchor | R-0140 (DQ1–DQ10 LOCKED) |
| architecture_anchor | docs/engineering/architecture.md # BUG-0024 |
| orchestrator_run_id | auto-20260921-bug0024 |
| parent_orchestrator_run_id | cursor-20260913-BUG0024-intake |
| fresh_context_marker | tl-BUG0024-sprintplan-20260921T194900Z-fresh |
| timestamp | 2026-09-21T19:49:00Z (UTC) |
| model_id | inherit (CROSS_MODEL_REVIEW=0) |
| verdict | PASS |
| decision_gate | false |
| SPRINT_MAX_TASKS | 12 |
| SPRINT_AUTO_SPLIT | 1 |
| task_count | 8 (T-anch + T-001..T-007; ≤12; no split; 1:1 from architecture seeds) |
| COMPONENT_SCOPE_MODE | 0 |
| USER_GUIDE_MODE | 0 |
| plan-verify | ultra_lean — NOT in resolved_phase_plan; skipped; reason=`ultra_lean_not_in_resolved_phase_plan`; no QA plan-verify spawn |
| backlog_status | OPEN (US-0045 — not mutated; AC-1..AC-8 unchecked) |
| sprint_id_lock | **S0159** for BUG-0024. S0158 = US-0150 occupied. |
| segment_work_item_kind | bug |

## Scope summary

Close the **live CLI TUI dispatch residual** left after BUG-0023 Axis A shipped files: operator OpenCode CLI TUI (`opencode`, not `--pure`) **sees and invokes listed `/auto`**, then still toasts title `its-magic /auto` / body **`OPENCODE_AUTO_TUI_DISPATCH_UNSUPPORTED`**. Lifecycle does **not** start. Deliver A1: peer-branded `@opencode/plugin/rpc` for TUI success; local identity-define load-safe only; stage-distinct `OPENCODE_*`; DISPATCH umbrella only when limbs exhausted; keep `{ id, tui }` + `editor.add`; eight `test_bug0024_*`; upgrade overwrite + prune; active↔template parity.

Out of scope: reopen BUG-0023 / BUG-0021 / BUG-0020 / BUG-0019 / BUG-0018 ACs / S0148; restore STOP-only `auto.md`; JSON `commands.auto` template; merge/drain BUG-0022; drain BUG-0027; Cursor `/auto` as done definition; `--pure`; live OpenCode CLI TUI probe in default CI; companion DEC; marking BUG-0024 DONE; ticking AC; npm-publish; git push; `.env` reads.

## Acceptance criteria (8) — BUG-0024 (status OPEN, unchecked per US-0045)

Primary acceptance (`docs/product/acceptance.md` BUG-0024 row): OpenCode CLI TUI listed `/auto` still toasts OPENCODE_AUTO_TUI_DISPATCH_UNSUPPORTED after BUG-0023 Axis A (live dispatch falsified).

- **AC-1**: Listed CLI TUI `/auto` starts `runAutoLifecycle` (or honest `OPENCODE_*` only when the host truly cannot dispatch). — T-001..T-004; markers 1–5
- **AC-2**: `OPENCODE_AUTO_TUI_DISPATCH_UNSUPPORTED` toast is not the happy path (DISPATCH umbrella-only). — T-004; marker 5
- **AC-3**: Must not restore STOP-only `.opencode/commands/auto.md`. — T-anch, T-005 m6
- **AC-4**: Must not JSON-template `/auto` (`commands.auto` + `template`). — T-005 m6
- **AC-5**: Plugin `editor.add` execute retained (compose BUG-0018 A*). — T-002, T-005 m6
- **AC-6**: Additive tests would have caught this live miss; CI remains `UAT_PROBE_FORBIDDEN` for live OpenCode CLI. — T-005
- **AC-7**: Consumer upgrade overwrites the live dispatch path + still prunes leftover `auto.md`. — T-006, T-005 m8
- **AC-8**: Active↔template parity. — T-007, T-005 m7

## Task summaries (8 — T-anch + T-001..T-007)

- **T-anch** (NO-OP / verification): Verify `# BUG-0024` H1 + A1 + R-0140 DQ1–DQ10 + `# BUG-0023` live claim superseded + no companion DEC + do not rewrite `# BUG-0023`/`# BUG-0021` + do not reopen 0023/0021 + do not merge 0022 + do not drain 0027. Record to `sprints/S0159/t-anch-verification.md`. NO mutation to `architecture.md` / R-0140 in /execute.
- **T-001** (AC-1): Peer-brand signal on `ITS_MAGIC_AUTO_RPC`; keep local identity-define for orchestrator load; TUI happy path requires brand. Surfaces: `rpc.ts` (active + template).
- **T-002** (AC-1, AC-5): Orchestrator: keep await register + `editor.add`; emit `OPENCODE_AUTO_TUI_REGISTER_SKIPPED` when register absent. Surfaces: `orchestrator.ts` (active + template).
- **T-003** (AC-1): `dispatchRunAutoLifecycle` limb order + stage tokens (missing-client / rpc-absent / Defined-unbranded / make-unreachable / swallowed-rpc); keep `{ id, tui }`. Surfaces: `tui.ts` (active + template).
- **T-004** (AC-1, AC-2): DISPATCH umbrella only when limbs exhausted; never silent localhost; do not reuse listing/load/desktop/markdown tokens. Surfaces: `tui.ts` + runbook.
- **T-005** (AC-3..AC-8 via markers): Add 8 `test_bug0024_*` markers; no live OpenCode probe in default CI; do not weaken 0023/0021/0020/0019/0018 except compose-only. Surfaces: `tests/bug0024_*.py` (+ harness).
- **T-006** (AC-7): Upgrade `--host opencode|both` **overwrites** live dispatch path on Axis-A trees; still **prunes** leftover `auto.md`. Surfaces: installer.py/sh/ps1 + owned-paths.
- **T-007** (AC-8): Runbook live-dispatch residual recipe + stage-code table + `--pure` out + active↔template parity + `BUG0024_PAIRS`. Surfaces: runbook + template + `check_intake_template_parity.py`.

Execution order: T-anch → T-001 → T-002 → T-003 → T-004 → T-005 → T-006 → T-007 (acyclic). 8 ≤ 12. Not `/quick`.

## AC → Task surjective coverage

| AC | Task(s) |
|---|---|
| AC-1 | T-001, T-002, T-003, T-004 (markers 1–5 via T-005) |
| AC-2 | T-004, T-005 (m5) |
| AC-3 | T-anch, T-005 (m6) |
| AC-4 | T-005 (m6) |
| AC-5 | T-002, T-005 (m6) |
| AC-6 | T-005 |
| AC-7 | T-006, T-005 (m8) |
| AC-8 | T-007, T-005 (m7) |
| DC / architecture baseline | T-anch |

**Surjectivity check**: 8/8 ACs covered + primary acceptance.md BUG-0024 row covered. No `PLAN_AC_COVERAGE_GAP`.

## Locked contract markers (architecture `# BUG-0024` / DQ8)

1. `test_bug0024_run_missing_api_client_distinct_code` — AC-1
2. `test_bug0024_local_unbranded_defined_not_happy_path` — AC-1
3. `test_bug0024_register_skipped_observable` — AC-1
4. `test_bug0024_make_unreachable_without_baseurl` — AC-1
5. `test_bug0024_swallowed_rpc_error_not_only_dispatch` — AC-1 / AC-2
6. `test_bug0024_keep_editor_add_no_auto_md` — AC-3 / AC-4 / AC-5
7. `test_bug0024_active_template_parity` — AC-8
8. `test_bug0024_upgrade_copies_dispatch_still_prunes_auto_md` — AC-7

Preferred file: `tests/bug0024_opencode_cli_tui_live_dispatch_residual_test.py`. **No live OpenCode CLI TUI probe** in default CI (`UAT_PROBE_FORBIDDEN`).

## Risks (architecture-owned — accepted)

| Risk | Severity | Mitigation |
|---|---|---|
| R1 Stage-code proliferation vs AC-2 DISPATCH semantics | MEDIUM | Closed set of five stage + one umbrella; DISPATCH last |
| R2 Peer `@opencode/plugin/rpc` absent on consumer hosts | MEDIUM | Distinct Defined-unbranded; orchestrator still loads via local define |
| R3 Register-skipped confuses operators | LOW | Document as honest residual; runbook |
| R4 Tests overfit mock and miss live again | MEDIUM | Markers target BUG-0023 gap; UAT_PROBE_FORBIDDEN held |
| R5 Upgrade leaves pre-BUG-0024 `tui.ts` (copy-if-absent) | MEDIUM | Marker 8 asserts **overwrite** |
| R6 Accidental reopen of BUG-0023/0021 | LOW | Sibling boundary + non-goals; compose-only tests |

## Compose guards (UNCHANGED)

| Target | Result |
|---|---|
| BUG-0023 / BUG-0021 / BUG-0020 / BUG-0019 / BUG-0018 | DONE compose-only — do not reopen ACs / S0148 |
| BUG-0022 / BUG-0027 | OPEN — not merged, not drained |
| R-0140 / # BUG-0024 | held; no companion DEC |
| auto.md / JSON commands.auto | must not restore / must not add |
| US-0045 | Status stays OPEN; AC unchecked |
| US-0085 | `.env` deny |
| DEC-0038 tuple | UNAMENDED |

## Execute phase role (per DEC-0051 / US-0069)

| Phase | Role | Isolation |
|---|---|---|
| /execute | dev (fresh per BUG-0006) | {phase_id:execute, role:dev} |
| /qa | qa (fresh) | {phase_id:qa, role:qa} |
| /verify-work | qa (fresh) | {phase_id:verify-work, role:qa} |
| /release | release (fresh) | {phase_id:release, role:release} |
| /closure | qe (fresh) | {phase_id:closure, role:qe} |
| /refresh-context | curator (fresh) | {phase_id:refresh-context, role:curator} |

## Isolation evidence (US-0048 / DEC-0029 / US-0104 v2)

| Field | Value |
|---|---|
| phase_id | sprint-plan |
| role | tech-lead |
| story_id | (none) |
| bug_id | BUG-0024 |
| sprint_id | S0159 |
| orchestrator_run_id | auto-20260921-bug0024 |
| parent_orchestrator_run_id | cursor-20260913-BUG0024-intake |
| delivery_mode | ultra_lean |
| macro_phase | plan |
| segment_work_item_kind | bug |
| bug_queue_position | 1 of 1 |
| bug_queue_remaining | 0 |
| fresh_context_marker | tl-BUG0024-sprintplan-20260921T194900Z-fresh |
| timestamp | 2026-09-21T19:49:00Z (UTC) |
| model_id | inherit (CROSS_MODEL_REVIEW=0) |
| evidence_ref | sprints/S0159/sprint.md, tasks.md, progress.md, uat.md, uat.json, handoffs/tl_to_dev.md, docs/engineering/state.md, handoffs/resume_brief.md, docs/product/backlog.md ### BUG-0024 |

Consumed architecture proof (independent `compute_strict_proof_hash` MATCH; not STALE at consume 2026-09-21T19:49:00Z):

- Architecture producer: `rp-auto-20260921-bug0024-architecture-techlead-20260921T194300Z-BUG-0024` / `5EEEC943224DB73B7A19D222A2178522BFCFF3F00FAC3A1316973A3F464A8915` — RUNTIME_PROOF_VALID before TTL `2026-09-21T20:43:00Z`.

## Runtime proof (DEC-0038)

| Field | Value |
|---|---|
| runtime_proof_id | rp-auto-20260921-bug0024-sprint-plan-techlead-20260921T194900Z-BUG-0024 |
| phase_id | sprint-plan |
| role | tech-lead |
| bug_id | BUG-0024 |
| sprint_id | S0159 |
| orchestrator_run_id | auto-20260921-bug0024 |
| delivery_mode | ultra_lean |
| macro_phase | plan |
| model_id | inherit (CROSS_MODEL_REVIEW=0) |
| proof_issued_at | 2026-09-21T19:49:00Z |
| proof_ttl_seconds | 3600 |
| proof_ttl | 2026-09-21T20:49:00Z (UTC) |
| proof_hash | 4DBB29FE1B5F6E671A28156768AFCE8A1976F8494BBCC2B997C9DCA265AB163C |
| canonical_payload | `{"orchestrator_run_id":"auto-20260921-bug0024","phase_id":"sprint-plan","proof_issued_at":"2026-09-21T19:49:00Z","proof_ttl_seconds":3600,"role":"tech-lead","runtime_proof_id":"rp-auto-20260921-bug0024-sprint-plan-techlead-20260921T194900Z-BUG-0024"}` |

Hash via `scripts.token_cost_lib.compute_strict_proof_hash` (positional, compact sorted-key JSON). Isolation extras (not hashed): `delivery_mode=ultra_lean`, `macro_phase=plan`, `model_id=inherit`, `sprint_id=S0159`, `bug_id=BUG-0024`, `skipped_phases=[intake, plan-verify]`. hash_recompute_confirmation=true.

## Decision gate

| Field | Value |
|---|---|
| decision_gate | false |
| stop_conditions_met | yes |
| missing_acceptance_criteria | none (8/8 surjective + 8 contract markers) |
| task_count | 8 (≤ SPRINT_MAX_TASKS=12; no split; 1:1 seeds) |
| companion_DEC | none |
| plan-verify readiness | SKIPPED (`ultra_lean_not_in_resolved_phase_plan`; CROSS_MODEL_REVIEW=0 — no critic) |

## Definition of done (sprint-plan)

- [x] 8 tasks enumerated (T-anch + T-001..T-007) — ≤ SPRINT_MAX_TASKS=12
- [x] 8/8 ACs surjective + primary acceptance.md BUG-0024 covered
- [x] Architecture-owned `test_bug0024_*` markers named
- [x] Execute phase role matrix documented
- [x] Compose guards UNCHANGED
- [x] Isolation evidence + runtime proof emitted
- [x] Sprint-plan checkpoint appended to docs/engineering/state.md
- [x] Sprint-plan handoff prepended to handoffs/tl_to_dev.md
- [x] SPRINT_PLAN_PASS prepended to handoffs/resume_brief.md (→ /execute dev)
- [x] Traceability row added (Status=PLANNED; Evidence empty)
- [x] UAT placeholders created (uat.md + uat.json)
- [x] Backlog status OPEN; acceptance unchecked
- [x] plan-verify skipped per ultra_lean (`ultra_lean_not_in_resolved_phase_plan`)

## Next scheduled phase

| Field | Value |
|---|---|
| next_scheduled_phase | `/execute` (role=dev per US-0069 / DEC-0051, fresh dev subagent per BUG-0006; first canonical phase of build+verify macro; plan-verify NOT in resolved_phase_plan — skipped; CROSS_MODEL_REVIEW=0 — no sovereign-critic) |
| next_scheduled_role | dev |
| next_sprint_macro | build+verify |
| stop_condition | STOP after sprint-plan completes; hand off via artifacts only. Orchestrator MUST spawn `/execute` in fresh dev subagent per BUG-0006. Do not spawn /execute, /plan-verify, or critic from this subagent. |
