# Sprint S0136 - Sprint Plan (BUG-0018)

## Metadata

| Field | Value |
|---|---|
| bug_id | BUG-0018 |
| story_id | (none — bug segment) |
| story_title | OpenCode markdown `/auto` wins over plugin execute (STOP, no OPENCODE_* code) |
| sprint_id | S0136 |
| delivery_mode | ultra_lean |
| macro_phase | plan (sprint-plan terminal; plan-verify NOT in resolved_phase_plan — skipped; next = execute) |
| current_phase | sprint-plan |
| approach | A* locked (from R-0120 DQ1–DQ8; architecture critic NB1–NB3 CLOSED) |
| companion_DEC | none (cite R-0120; compose DEC-0124 / DEC-0125 / DEC-0120 / DEC-0132) |
| research_anchor | R-0120 (DQ1–DQ8 LOCKED; compose R-0119 / R-0114) |
| architecture_anchor | docs/engineering/architecture.md # BUG-0018 |
| orchestrator_run_id | auto-20260912-bug0018 |
| fresh_context_marker | tl-BUG0018-sprintplan-20260912T101000Z-fresh |
| timestamp | 2026-09-12T10:10:00Z (UTC) |
| model_id | cursor-grok-4.6 (CROSS_MODEL_REVIEW=1 — required on isolation) |
| verdict | PASS |
| decision_gate | false |
| SPRINT_MAX_TASKS | 12 |
| SPRINT_AUTO_SPLIT | 1 |
| task_count | 8 (T-anch + T-001..T-007; within 12; no split; 1:1 from architecture seeds) |
| COMPONENT_SCOPE_MODE | 0 |
| USER_GUIDE_MODE | 0 |
| plan-verify | ultra_lean — NOT in resolved_phase_plan; skipped; plan-verify.json NOT written here |
| backlog_status | OPEN (US-0045 — not mutated; acceptance BUG-0018 unchecked) |
| critic_carry_ins | 0 new blocking; 3 architecture critic NBs `bug0018arc-*` status=resolved non-blocking — routed as awareness into /execute (below) |

## Scope summary

Close the **same-name markdown vs plugin-execute collision** on OpenCode: `.opencode/commands/auto.md` (LF STOP-only) still owns `/auto` while plugin `editor.add({ name: "auto", execute })` → `runAutoLifecycle` is registered but never invoked. Distinct from **BUG-0015 DONE** (missing attach) and **BUG-0017 DONE** (CRLF so commands were not offered).

**Approach A\***: Plugin-only `/auto`. Remove colliding `.opencode/commands/auto.md` (active + template). Keep plugin execute → `runAutoLifecycle` as the sole `/auto` owner. Targeted upgrade `--host opencode|both` prune of leftover consumer `auto.md`. Fail-closed `OPENCODE_AUTO_MARKDOWN_COLLISION`. Six `test_bug0018_*`. Compose-only if-present / inventory 15→14 / bug0017 plant-path. No companion DEC. `# BUG-0018` supersedes `# BUG-0015` CF1 (historical cell + DEC-0124/0125 bodies UNCHANGED).

Out of scope: Symptom B Cursor Task-unavailable; BUG-0015/0016/0017 reopen; Axis B/C/D; general “delete files not in template” sweeper; live OpenCode CI probe; Cursor `.cursor/commands/auto.md`; `.opencode/agents/auto.md`; plugin deleting leftover files; marking BUG-0018 DONE; ticking acceptance.

## Execute awareness (architecture critic NBs — 0 blocking)

Sovereign-critic of architecture PASS (`critic-BUG0018-architecture-20260912T100500Z-fresh`; anti_slop=10; 0 blocking). Route these resolved NBs as execute awareness — do not re-open them as work:

| Finding | Issue key | Execute awareness |
|---|---|---|
| `bug0018arc-challenger-001` | `ik_bug0018_arc_proof_arch_pass` | **T-001/T-003/T-005**: execute owns delete + prune + tests. **R1** listing residual: plugin `add` + attach-missing fail-closed (no live probe). **R2** leftover: DQ8 prune + marker 4. **R6** unlink fail: print `OPENCODE_AUTO_MARKDOWN_COLLISION`. |
| `bug0018arc-architect-002` | `ik_bug0018_arc_layer_compose_ok` | Keep **T-anch..T-007 1:1** from architecture seeds; architecture owns H1+A* only; execute owns surfaces (delete/plugin/installer/compose tests/runbook). |
| `bug0018arc-subtractor-003` | `ik_bug0018_arc_scope_yagni_pass` | T-anch ceremony overlap acceptable. Do not invent companion DEC / Axis B extra slash / empty-body leftover / `command.executed` primary / general sweeper. Do not mark BUG-0018 DONE. Do not reopen BUG-0015/0016/0017. 6 markers required. |

## Acceptance criteria (7 slices + primary acceptance row) — BUG-0018 (status OPEN, unchecked per US-0045)

Primary acceptance (`docs/product/acceptance.md` BUG-0018 row + backlog `expected`): `/auto` invokes plugin `editor.add({ name: "auto", execute })` → `runAutoLifecycle` so the phase→role chain starts, **or** the host fail-closes with a documented `OPENCODE_*` reason code. Markdown `auto.md` must not be the sole runtime owner of `/auto` when plugin execute is registered.

Architecture slices (surjective planning ACs from `# BUG-0018` AC coverage mapping):

- **AC-1**: `/auto` invokes plugin execute → `runAutoLifecycle` (or documented `OPENCODE_*`) — T-001, T-002, T-005.
- **AC-2**: Markdown not sole runtime owner when plugin execute registered — delete `auto.md` + marker 1.
- **AC-3**: Slash listing preserved — plugin `name`+`description` (match current markdown description) + marker 2.
- **AC-4**: Consumer upgrade does not leave colliding `auto.md` — targeted prune + marker 4 + runbook.
- **AC-5**: No silent STOP — `OPENCODE_AUTO_MARKDOWN_COLLISION` (installer print + plugin leftover defense + stub) + marker 6.
- **AC-6**: Active ↔ template parity for ownership change — T-001, T-002, T-005 (m3), T-007.
- **AC-7**: Compose BUG-0015 attach unchanged + compose-only inventory/if-present/plant-path — T-002, T-004, T-005 (m5).

## Task summaries (8 — T-anch + T-001..T-007)

- **T-anch** (NO-OP / verification): Verify `# BUG-0018` H1 + approach A* + R-0120 DQ1–DQ8 + CF1 superseded + no companion DEC. Record to `sprints/S0136/t-anch-verification.md`. NO mutation to `architecture.md` / R-0120 in /execute.
- **T-001** (AC-1, AC-2): Delete colliding `.opencode/commands/auto.md` (active + template); keep other commands, `.opencode/agents/auto.md`, Cursor `.cursor/commands/auto.md`.
- **T-002** (AC-1, AC-3, AC-5, AC-7): Keep plugin `editor.add({ name: "auto", execute })` → `runAutoLifecycle`; add `OPENCODE_AUTO_MARKDOWN_COLLISION`; leftover-file fail-closed in `runAutoLifecycle` (plugin must **not** delete the file).
- **T-003** (AC-4, AC-5): Targeted prune of consumer `.opencode/commands/auto.md` on `upgrade --host opencode|both`; print `[OPENCODE_AUTO_MARKDOWN_COLLISION]` if unlink fails; no general sweeper.
- **T-004** (AC-2, AC-6, AC-7): Compose inventory/parity/plant-path: drop `auto` from US-0125 expected set (15→14 / remaining 13); drop `BUG0015_PAIRS` auto.md pair; bug0017 plant → `intake.md`; if-present named tests.
- **T-005** (AC-1..AC-7): Add 6 `test_bug0018_*` markers; no live OpenCode probe.
- **T-006** (AC-4, AC-5): Runbook: upgrade prune recipe + `OPENCODE_AUTO_MARKDOWN_COLLISION` stub (US-0126 cross-link).
- **T-007** (AC-6): Active↔template parity for plugin / runbook stub / installer prune helper paths touched.

Execution order: T-anch → T-001 → T-002 → T-003 → T-004 → T-005 → T-006 → T-007 (acyclic; delete before compose inventory; plugin token before tests; prune before marker 4; docs/parity last).

## AC → Task surjective coverage

| AC | Task(s) |
|---|---|
| AC-1 (`/auto` → plugin execute / `OPENCODE_*`) | T-001, T-002, T-005 |
| AC-2 (markdown not sole owner) | T-001, T-004, T-005 (m1) |
| AC-3 (slash listing preserved) | T-002, T-005 (m2) |
| AC-4 (consumer prune leftover `auto.md`) | T-003, T-005 (m4), T-006 |
| AC-5 (no silent STOP / collision token) | T-002, T-003, T-005 (m6), T-006 |
| AC-6 (active↔template parity) | T-001, T-002, T-004, T-005 (m3), T-007 |
| AC-7 (compose BUG-0015 attach + inventory) | T-002, T-004, T-005 (m5) |
| DC / architecture baseline | T-anch |

**Surjectivity check**: 7/7 ACs covered (each AC ≥1 task) + primary acceptance.md BUG-0018 row covered by AC-1+AC-2+AC-5 aggregate. No `PLAN_AC_COVERAGE_GAP`. T-anch retained as verification-only.

## Locked 6-marker table (R-0120 / architecture)

1. `test_bug0018_no_colliding_opencode_auto_md`
2. `test_bug0018_plugin_editor_add_auto_execute`
3. `test_bug0018_active_template_opencode_auto_ownership_parity`
4. `test_bug0018_upgrade_prunes_consumer_auto_md`
5. `test_bug0018_compose_bug0015_attach_api_unchanged`
6. `test_bug0018_markdown_collision_reason_code_stub`

Static/fixture only — **no live OpenCode CI probe**. Preferred file: `tests/bug0018_opencode_auto_ownership_test.py`.

## Risks (R1–R6 — accepted)

| Risk | Severity | Mitigation |
|---|---|---|
| R1 Host lists only markdown files → `/auto` hidden | MEDIUM | T-002 plugin `add` + D9; attach-missing fail-closed; no live probe |
| R2 Consumer leftover `auto.md` after kit-only fix | MEDIUM | T-003 prune + T-005 m4 + T-006 runbook |
| R3 us0125/bug0015/bug0017 tests fail on absence | LOW | T-004 compose-only if-present + inventory/plant-path |
| R4 Symptom B mistaken for this bug | LOW | Out of scope (D8) |
| R5 Reason-code stub drift vs US-0126 | LOW | T-006 stub + cross-link only |
| R6 Prune unlink fails (permissions) | LOW | Print `OPENCODE_AUTO_MARKDOWN_COLLISION`; operator delete |

## Compose guards (UNCHANGED)

| Target | Result |
|---|---|
| DEC-0124 / DEC-0125 bodies | compose — do not amend |
| `# BUG-0015` CF1 historical cell | compose — do not rewrite; `# BUG-0018` supersedes |
| DEC-0120 | compose — upgrade path documented |
| DEC-0132 preserve paths | compose — `auto.md` is not a preserve path |
| BUG-0015 / BUG-0016 / BUG-0017 | DONE — do not reopen |
| `.cursor/commands/auto.md` / `.opencode/agents/auto.md` | do not touch |
| US-0045 | Status stays OPEN |

## Execute phase role (per DEC-0051 / US-0069)

| Phase | Role | Isolation |
|---|---|---|
| /execute | dev (fresh per BUG-0006) | {phase_id:execute, role:dev} |
| /qa | qa (fresh) | {phase_id:qa, role:qa} — ultra_lean may create plan-verify.json inside build+verify; this sprint-plan does **not** run /plan-verify |
| /verify-work | qa (fresh) | {phase_id:verify-work, role:qa} |
| /release | release (fresh) | {phase_id:release, role:release} |
| /closure | qe (fresh) | {phase_id:closure, role:qe} |
| /refresh-context | curator (fresh) | {phase_id:refresh-context, role:curator} |

## Isolation evidence (US-0048 / DEC-0029 / US-0104 v2)

| Field | Value |
|---|---|
| phase_id | sprint-plan |
| role | tech-lead |
| bug_id | BUG-0018 |
| story_id | BUG-0018 |
| sprint_id | S0136 |
| orchestrator_run_id | auto-20260912-bug0018 |
| delivery_mode | ultra_lean |
| macro_phase | plan |
| fresh_context_marker | tl-BUG0018-sprintplan-20260912T101000Z-fresh |
| timestamp | 2026-09-12T10:10:00Z (UTC) |
| model_id | cursor-grok-4.6 (CROSS_MODEL_REVIEW=1 — required) |
| evidence_ref | sprints/S0136/sprint.md, sprints/S0136/tasks.md, sprints/S0136/progress.md, sprints/S0136/uat.json, sprints/S0136/uat.md, handoffs/tl_to_dev.md (BUG-0018 prepend), docs/engineering/state.md (sprint-plan checkpoint + traceability), docs/engineering/architecture.md # BUG-0018 (not mutated), handoffs/resume_brief.md |

Prior phase proof consumed: `rp-auto-20260912-bug0018-architecture-techlead-20260912T100000Z-BUG-0018` / `076F4C6E4744AB44B4751AF821572EB7082C8103EBD0091C9BC6EAB88351AA0B` — RUNTIME_PROOF_VALID (MATCH before TTL 2026-09-12T11:00:00Z; consumed 2026-09-12T10:10:00Z). Sovereign-critic architecture PASS (`critic-BUG0018-architecture-20260912T100500Z-fresh`; anti_slop=10; 0 blocking; NBs routed).

## Runtime proof (DEC-0038)

| Field | Value |
|---|---|
| runtime_proof_id | rp-auto-20260912-bug0018-sprint-plan-techlead-20260912T101000Z-BUG-0018 |
| phase_id | sprint-plan |
| role | tech-lead |
| story_id | BUG-0018 |
| sprint_id | S0136 |
| orchestrator_run_id | auto-20260912-bug0018 |
| delivery_mode | ultra_lean |
| macro_phase | plan |
| model_id | cursor-grok-4.6 (CROSS_MODEL_REVIEW=1 — required) |
| proof_issued_at | 2026-09-12T10:10:00Z |
| proof_ttl_seconds | 3600 |
| proof_ttl | 2026-09-12T11:10:00Z (UTC) |
| proof_hash | 56DAA01EAC3125E806C6A10A1EBBD140CFAF20782B68776F56A71D1B9351CC28 |
| canonical_payload | `{"delivery_mode":"ultra_lean","macro_phase":"plan","model_id":"cursor-grok-4.6","orchestrator_run_id":"auto-20260912-bug0018","phase_id":"sprint-plan","proof_issued_at":"2026-09-12T10:10:00Z","proof_ttl_seconds":3600,"role":"tech-lead","runtime_proof_id":"rp-auto-20260912-bug0018-sprint-plan-techlead-20260912T101000Z-BUG-0018","sprint_id":"S0136","story_id":"BUG-0018"}` |

## Decision gate

| Field | Value |
|---|---|
| decision_gate | false |
| stop_conditions_met | yes |
| missing_acceptance_criteria | none (7/7 slices + primary acceptance row covered; 6 contract-test markers) |
| compose_guards | DEC-0124/0125/0120/0132/BUG-0015/0016/0017/US-0045 UNCHANGED |
| dc_check | clean (`# BUG-0018` H1 already added in /architecture) |
| task_count | 8 (within SPRINT_MAX_TASKS=12; SPRINT_AUTO_SPLIT=1 but no split needed; 1:1 seeds) |
| risks_finalized | 6/6 ACCEPTED (R1..R6) |
| approach | A* locked |
| companion_DEC | none |
| plan-verify readiness | ultra_lean — plan-verify NOT in resolved_phase_plan; skipped; plan-verify.json NOT written in this spawn |
| sovereign_memory_note | `assemble_sovereign_memory_digest(...)` NOT called; no mistakes.jsonl write |

## Definition of done (sprint-plan)

- [x] 8 tasks enumerated (T-anch + T-001..T-007) — within SPRINT_MAX_TASKS=12; 1:1 from architecture seeds
- [x] 7/7 ACs surjective + primary acceptance.md BUG-0018 covered
- [x] Task dependency graph documented
- [x] Execute phase role matrix documented (ultra_lean — /plan-verify skipped; next = /execute)
- [x] Compose guards UNCHANGED
- [x] Critic carry-ins (3 non-blocking from architecture sovereign-critic) routed as execute awareness
- [x] Isolation evidence + runtime proof emitted (model_id=cursor-grok-4.6 present)
- [x] Sprint-plan checkpoint appended to `docs/engineering/state.md`
- [x] Sprint-plan handoff prepended to `handoffs/tl_to_dev.md`
- [x] Sprint-plan PASS prepended to `handoffs/resume_brief.md` (-> /execute)
- [x] UAT placeholders written (`uat.json` empty steps, `uat.md` ACs no results)
- [x] Traceability row added (Story=BUG-0018 | Sprint=S0136 | Tasks=T-anch+T-001..T-007 | Status=PLANNED | Evidence empty)
- [x] Backlog status OPEN (US-0045 — not mutated); acceptance unchecked; sprint_plan_notes appended

## Next scheduled phase

| Field | Value |
|---|---|
| next_scheduled_phase | `/execute` (role=dev per US-0069 / DEC-0051; fresh dev subagent per BUG-0006; first canonical phase of `build+verify` macro per ultra_lean; plan-verify NOT in resolved_phase_plan — skipped). Orchestrator may run sovereign-critic of sprint-plan first (CROSS_MODEL_REVIEW=1). Do not mandate outer driver. |
| next_scheduled_role | dev |
| next_sprint_macro | build+verify (ultra_lean — plan-verify skipped at this boundary) |
| stop_condition | STOP after sprint-plan completes; hand off via artifacts only. Orchestrator owns critic of sprint-plan (if CROSS_MODEL_REVIEW=1) then `/execute` in fresh dev subagent per BUG-0006. Do not spawn /execute or /plan-verify from this subagent. |
| artifacts_written | sprints/S0136/ (sprint.md, tasks.md, progress.md, uat.json, uat.md), docs/engineering/state.md (sprint-plan checkpoint + traceability), handoffs/tl_to_dev.md (BUG-0018 prepend), handoffs/resume_brief.md (sprint-plan PASS prepend -> /execute), docs/product/backlog.md (sprint_plan_notes append; Status OPEN) |
