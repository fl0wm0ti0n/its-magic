# Sprint S0160 — Sprint Plan (BUG-0027)

## Metadata

| Field | Value |
|---|---|
| story_id | (none — bug work item) |
| bug_id | **BUG-0027** |
| story_title | OpenCode manual phase commands cannot persist canonical workflow evidence |
| sprint_id | **S0160** (locked — new folder; S0159 = BUG-0024 occupied — do not reuse) |
| delivery_mode | ultra_lean |
| macro_phase | plan (sprint-plan terminal for plan macro; plan-verify NOT in resolved_phase_plan — skipped; next = /execute dev → build+verify macro) |
| current_phase | sprint-plan |
| approach | A1 (A*) Hybrid manual-phase persist — IsolationEvidence identity fields + persistManualPhaseIsolation (not runAutoLifecycle) + reject tui-auto + targeted glob widen + fail-closed + supported validator packs; no companion DEC (R-0151 DQ1–DQ10 LOCKED) |
| companion_DEC | **none** (cite R-0151 / `# BUG-0027` only) |
| research_anchor | R-0151 (DQ1–DQ10 LOCKED) |
| architecture_anchor | docs/engineering/architecture.md # BUG-0027 |
| orchestrator_run_id | auto-20260921-bug0027 |
| parent_orchestrator_run_id | ir-20260921T190544Z-bug0027 |
| fresh_context_marker | tl-BUG0027-sprintplan-20260921T212600Z-fresh |
| timestamp | 2026-09-21T21:26:00Z (UTC) |
| model_id | inherit (CROSS_MODEL_REVIEW=0) |
| verdict | PASS |
| decision_gate | false |
| SPRINT_MAX_TASKS | 12 |
| SPRINT_AUTO_SPLIT | 1 |
| task_count | 8 (T-anch + T-001..T-007; ≤12; no split; 1:1 from architecture seeds) |
| COMPONENT_SCOPE_MODE | 0 |
| USER_GUIDE_MODE | 0 |
| plan-verify | ultra_lean — NOT in resolved_phase_plan; skipped; reason=`ultra_lean_not_in_resolved_phase_plan`; no QA plan-verify spawn |
| backlog_status | OPEN (US-0045 — not mutated; AC-1..AC-6 unchecked) |
| sprint_id_lock | **S0160** for BUG-0027. S0159 = BUG-0024 occupied. |
| segment_work_item_kind | bug |

## Scope summary

Close the **manual OpenCode phase persist residual**: direct slash commands (`/intake`, `/execute`, `/qa`, `/verify-work`) can run a role but cannot persist canonical sprint/handoff artifacts plus IsolationEvidence linked to the current story/bug and sprint. Deliver A1: IsolationEvidence + `persistIsolationViaPython` identity fields (`storyId`/`sprintId`/`orchestratorRunId`/`bugId`); thin `persistManualPhaseIsolation` (not `runAutoLifecycle`); parent `sessionID` from `command.executed`/RPC; reject `tui-auto`; targeted glob widen (dev: `state.md` + `summary.md`; qa: `state.md`) plus fail-closed-before-work; rewrite OpenCode packs to `--file`/`--stdin`/`--self-test`; drop intake validator from execute/discovery; ten `test_bug0027_*`; upgrade overwrite + `BUG0027_PAIRS`; US-0125 named-CLI compose-amend (ACs stay DONE).

Out of scope: reopen BUG-0024 / S0159; claim CLI/TUI `/auto` toast repair; restore STOP-only `auto.md`; JSON `commands.auto`; route manual phases through `runAutoLifecycle`; add `--repo --enforce` to the Python intake CLI; second persist store; fabricate proofs; merge/drain BUG-0022/0026; mutate US-0150 as this bug's implementation; rewrite `.cursor/commands/`; reopen BUG-0016 / US-0125 ACs; wipe R-0150 / R-0140; companion DEC; marking BUG-0027 DONE; ticking AC; npm-publish; git push; `.env` reads; live OpenCode CLI TUI probe in default CI.

## Acceptance criteria (6) — BUG-0027 (status OPEN, unchecked per US-0045)

Primary acceptance (`docs/product/acceptance.md` BUG-0027 row): OpenCode manual phase commands cannot persist canonical workflow evidence.

- **AC-1**: A direct OpenCode phase command (`/intake`, `/execute`, `/qa`, or `/verify-work`) runs its canonical role with the artifact write permissions required by that phase, or fails before work with a precise operator-visible reason code. — T-002, T-004; markers 1, 10
- **AC-2**: A successful manual phase run persists its canonical sprint/handoff artifacts and an isolation checkpoint linked to the current story or bug and sprint; it does not report success while persistence was denied. — T-001, T-002; marker 2
- **AC-3**: The OpenCode lifecycle bridge carries a real parent session and run context (`storyId`, `sprintId`, `orchestratorRunId`) through plugin/RPC dispatch; placeholder identifiers such as `tui-auto` cannot satisfy release evidence. — T-001, T-003; markers 1, 3, 4
- **AC-4**: `/auto` remains BUG-0024 scope. The manual-phase fix neither claims to repair its CLI/TUI dispatch toast nor fabricates strict-proof tuples when the orchestrator is unavailable. — T-anch, T-003; markers 5, 6
- **AC-5**: OpenCode command templates use a supported intake-evidence validation invocation; the invalid `intake_evidence_validate.py --repo . --enforce` invocation is removed from active and template command packs. — T-005; markers 7, 8
- **AC-6**: Contract tests cover direct manual phase execution, denied-persistence failure, context propagation, validator invocation, and active/template parity. — T-006, T-007; markers 1–10

## Task summaries (8 — T-anch + T-001..T-007)

- **T-anch** (NO-OP / verification): Verify `# BUG-0027` H1 + A1 + R-0151 DQ1–DQ10 + no companion DEC + do not rewrite `# BUG-0024` + do not reopen 0024 + do not claim toast repair + do not merge 0022/0026 + do not wipe R-0150/R-0140. Record to `sprints/S0160/t-anch-verification.md`. NO mutation to `architecture.md` / R-0151 in /execute.
- **T-001** (AC-2, AC-3): IsolationEvidence identity fields; `spawnPhase` copy; `persistIsolationViaPython` + `--append-isolation` `--story-id`/`--sprint-id`/`--orchestrator-run-id`/`--bug-id`. Surfaces: `orchestrator.ts` + `opencode_auto_bridge.py` (active + template).
- **T-002** (AC-1, AC-2): `persistManualPhaseIsolation` + `command.executed` limb for `MANUAL_PHASE_COMMAND_NAMES`; optional secondary event; **not** `runAutoLifecycle`; mutex vs double-append. Surfaces: `orchestrator.ts` (active + template).
- **T-003** (AC-3, AC-4): RPC/context forward; reject `tui-auto`; emit locked reason-code tokens; no fabricated proofs. Surfaces: `orchestrator.ts` `runAutoLifecycleRpc` + persist helper.
- **T-004** (AC-1): Permission glob widen (dev: `state.md` + `summary.md`; qa: `state.md`) + fail-closed-before-work; deny-last held. Surfaces: `.opencode/agents/{dev,qa}.md` + template.
- **T-005** (AC-5): Rewrite intake pack to `--file`/`--stdin`/`--self-test`; drop intake validator from execute.md/discovery.md; keep qa/verify-work `bug_issue_validate.py --repo . --check-acceptance`. Surfaces: `.opencode/commands/` + template.
- **T-006** (AC-6 via markers 1–10; also AC-1..AC-5 coverage): Add 10 `test_bug0027_*` markers; no live OpenCode probe in default CI; do not weaken bug0024/us0124 except US-0125 CLI compose-amend. Surfaces: `tests/bug0027_*.py` (+ harness).
- **T-007** (AC-6): US-0125 fixture named-CLI compose-amend + `BUG0027_PAIRS` + upgrade overwrite + runbook one-line validator stub correction. Surfaces: us0125 fixture + parity script + installer + runbook.

Execution order: T-anch → T-001 → T-002 → T-003 → T-004 → T-005 → T-006 → T-007 (acyclic). 8 ≤ 12. Not `/quick`.

## AC → Task surjective coverage

| AC | Task(s) |
|---|---|
| AC-1 | T-002, T-004 (markers 1, 10 via T-006) |
| AC-2 | T-001, T-002 (marker 2 via T-006) |
| AC-3 | T-001, T-003 (markers 1, 3, 4 via T-006) |
| AC-4 | T-anch, T-003 (markers 5, 6 via T-006) |
| AC-5 | T-005 (markers 7, 8 via T-006) |
| AC-6 | T-006, T-007 (markers 1–10) |
| DC / architecture baseline | T-anch |

**Surjectivity check**: 6/6 ACs covered + primary acceptance.md BUG-0027 row covered. No `PLAN_AC_COVERAGE_GAP`.

## Locked contract markers (architecture `# BUG-0027` / DQ8)

1. `test_bug0027_manual_phase_persists_isolation` — AC-1, AC-2, AC-3
2. `test_bug0027_denied_persist_not_success` — AC-2
3. `test_bug0027_rpc_forwards_story_sprint_run` — AC-3
4. `test_bug0027_tui_auto_rejected_as_release_evidence` — AC-3
5. `test_bug0027_no_fabricated_proof_when_orchestrator_unavailable` — AC-4
6. `test_bug0027_auto_tui_toast_not_claimed` — AC-4
7. `test_bug0027_validator_invocation_file_stdin_not_repo_enforce` — AC-5
8. `test_bug0027_non_intake_packs_drop_intake_validator` — AC-5
9. `test_bug0027_active_template_parity` — AC-6
10. `test_bug0027_permission_matrix_phase_writes` — AC-1

Preferred file: `tests/bug0027_opencode_manual_phase_persist_test.py`. **No live OpenCode CLI TUI probe** in default CI (`UAT_PROBE_FORBIDDEN`).

## Locked reason-code tokens (architecture-owned)

| Code | When |
|------|------|
| `OPENCODE_MANUAL_PHASE_WRITE_DENIED` | Required glob still denied — fail **before work** |
| `OPENCODE_MANUAL_PHASE_PERSIST_DENIED` | persist helper non-ok after work — no success claim |
| `OPENCODE_MANUAL_PHASE_PERSIST_NOT_INVOKED` | Persist never ran by STOP |
| `OPENCODE_PLACEHOLDER_PARENT_REJECTED` | `tui-auto` as `parentID` or `orchestratorRunId` |
| `OPENCODE_MANUAL_PHASE_CONTEXT_MISSING` | Real session and/or story/sprint/run ids missing — do not invent |

Do **not** reuse BUG-0024 `OPENCODE_AUTO_TUI_*` tokens for this miss.

## Risks (architecture-owned — accepted)

| Risk | Severity | Mitigation |
|---|---|---|
| R1 `command.executed` does not fire for markdown commands (R-0119) | MEDIUM | Fail-closed `OPENCODE_MANUAL_PHASE_PERSIST_NOT_INVOKED`; optional secondary event; marker 2 |
| R2 Permission widen looks like reopening BUG-0016 | LOW | Additive globs only; deny-last held; marker 10 |
| R3 US-0125 fixture compose-amend looks like reopen | LOW | Additive `test_bug0027_*` own the new CLI; US-0125 ACs stay DONE |
| R4 RPC ID forward confused with BUG-0024 toast work | MEDIUM | Marker 6 asserts toast path unchanged |
| R5 Fabricated proofs under unavailable orchestrator | HIGH | Marker 5; helper refuses `tui-auto` and missing run ids |
| R6 Dual-fire double-append isolation | LOW | Mutex on persist invoker; `/auto` remains distinct |

## Compose guards (UNCHANGED)

| Target | Result |
|---|---|
| BUG-0024 / S0159 | DONE compose-only — do not reopen ACs; do not claim toast repair |
| BUG-0016 | DONE compose-only — additive globs; deny-last held |
| BUG-0022 / BUG-0026 | OPEN — not merged, not drained |
| US-0150 | OPEN — compose/link only; not this bug's implementation |
| US-0125 | DONE — named-CLI compose-amend only; ACs stay DONE |
| R-0151 / # BUG-0027 | held; no companion DEC |
| R-0150 / R-0140 | held — do not wipe |
| auto.md / JSON commands.auto | must not restore / must not add |
| `.cursor/commands/` | OUT |
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
| bug_id | BUG-0027 |
| sprint_id | S0160 |
| orchestrator_run_id | auto-20260921-bug0027 |
| parent_orchestrator_run_id | ir-20260921T190544Z-bug0027 |
| delivery_mode | ultra_lean |
| macro_phase | plan |
| segment_work_item_kind | bug |
| bug_queue_position | 1 of 1 |
| bug_queue_remaining | 0 |
| fresh_context_marker | tl-BUG0027-sprintplan-20260921T212600Z-fresh |
| timestamp | 2026-09-21T21:26:00Z (UTC) |
| model_id | inherit (CROSS_MODEL_REVIEW=0) |
| evidence_ref | sprints/S0160/sprint.md, tasks.md, progress.md, uat.md, uat.json, plan-verify.json, handoffs/tl_to_dev.md, docs/engineering/state.md, handoffs/resume_brief.md, docs/product/backlog.md ### BUG-0027 |

Consumed architecture proof (independent `compute_strict_proof_hash` MATCH; not STALE at consume 2026-09-21T21:26:00Z):

- Architecture producer: `rp-auto-20260921-bug0027-architecture-techlead-20260921T212200Z-BUG-0027` / `766B032B5B6FEBFCC6524E30F4A94DEED4EFBCE14AB73F56D2DCBF893FEFE489` — RUNTIME_PROOF_VALID before TTL `2026-09-21T22:22:00Z`.

## Runtime proof (DEC-0038)

| Field | Value |
|---|---|
| runtime_proof_id | rp-auto-20260921-bug0027-sprint-plan-techlead-20260921T212600Z-BUG-0027 |
| phase_id | sprint-plan |
| role | tech-lead |
| bug_id | BUG-0027 |
| sprint_id | S0160 |
| orchestrator_run_id | auto-20260921-bug0027 |
| delivery_mode | ultra_lean |
| macro_phase | plan |
| model_id | inherit (CROSS_MODEL_REVIEW=0) |
| proof_issued_at | 2026-09-21T21:26:00Z |
| proof_ttl_seconds | 3600 |
| proof_ttl | 2026-09-21T22:26:00Z (UTC) |
| proof_hash | 4513051C77052F22FA52F4C8EC431A9931B8104475E6EA8373C756739574F8C9 |
| canonical_payload | `{"orchestrator_run_id":"auto-20260921-bug0027","phase_id":"sprint-plan","proof_issued_at":"2026-09-21T21:26:00Z","proof_ttl_seconds":3600,"role":"tech-lead","runtime_proof_id":"rp-auto-20260921-bug0027-sprint-plan-techlead-20260921T212600Z-BUG-0027"}` |

Hash via `scripts.token_cost_lib.compute_strict_proof_hash` (positional, compact sorted-key JSON). Isolation extras (not hashed): `delivery_mode=ultra_lean`, `macro_phase=plan`, `model_id=inherit`, `sprint_id=S0160`, `bug_id=BUG-0027`, `skipped_phases=[intake, plan-verify]`. hash_recompute_confirmation=true.

## Decision gate

| Field | Value |
|---|---|
| decision_gate | false |
| stop_conditions_met | yes |
| missing_acceptance_criteria | none (6/6 surjective + 10 contract markers) |
| task_count | 8 (≤ SPRINT_MAX_TASKS=12; no split; 1:1 seeds) |
| companion_DEC | none |
| plan-verify readiness | SKIPPED (`ultra_lean_not_in_resolved_phase_plan`; CROSS_MODEL_REVIEW=0 — no critic) |

## Definition of done (sprint-plan)

- [x] 8 tasks enumerated (T-anch + T-001..T-007) — ≤ SPRINT_MAX_TASKS=12
- [x] 6/6 ACs surjective + primary acceptance.md BUG-0027 covered
- [x] Architecture-owned `test_bug0027_*` markers named
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
