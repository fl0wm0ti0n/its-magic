# Sprint S0139 - Sprint Plan (BUG-0019)

## Metadata

| Field | Value |
|---|---|
| bug_id | BUG-0019 |
| story_id | (none — bug segment) |
| story_title | OpenCode slash palette has no `/auto` after plugin-only ownership (BUG-0018 residual listing) |
| sprint_id | S0139 |
| delivery_mode | ultra_lean |
| macro_phase | plan (sprint-plan terminal; plan-verify NOT in resolved_phase_plan — skipped; next = execute) |
| current_phase | sprint-plan |
| approach | E1 / E* locked (from R-0124 DQ1–DQ8; architecture critic NB1–NB3 CLOSED) |
| companion_DEC | none (cite R-0124; compose DEC-0124 / DEC-0125 / DEC-0120 / DEC-0132 / BUG-0018 A*; do not allocate DEC-0135) |
| research_anchor | R-0124 (DQ1–DQ8 LOCKED; compose R-0123 / R-0120) |
| architecture_anchor | docs/engineering/architecture.md # BUG-0019 |
| orchestrator_run_id | auto-20260912-bug0019 |
| fresh_context_marker | tl-BUG0019-sprintplan-20260912T182500Z-fresh |
| timestamp | 2026-09-12T18:30:00Z (UTC) |
| model_id | cursor-grok-4.6 (CROSS_MODEL_REVIEW=1 — required on isolation) |
| verdict | PASS |
| decision_gate | false |
| SPRINT_MAX_TASKS | 12 |
| SPRINT_AUTO_SPLIT | 1 |
| task_count | 8 (T-anch + T-001..T-007; within 12; no split; 1:1 from architecture seeds) |
| COMPONENT_SCOPE_MODE | 0 |
| USER_GUIDE_MODE | 0 |
| plan-verify | ultra_lean — NOT in resolved_phase_plan; skipped; plan-verify.json written as deferred/skipped placeholder only (not a QA phase; QA may overwrite in build+verify) |
| backlog_status | OPEN (US-0045 — not mutated; acceptance BUG-0019 unchecked) |
| sprint_id_lock | **S0139** is next free after S0138. Confirmed no S0139 folder existed before this spawn. |
| critic_carry_ins | 0 new blocking; 3 architecture critic NBs `bug0019arc-*` status=resolved non-blocking — routed as awareness into /execute (below) |

## Scope summary

Close the **listing residual** left after BUG-0018 A*: colliding `.opencode/commands/auto.md` is gone and plugin `editor.add({ name: "auto", execute })` → `runAutoLifecycle` is still registered, but the OpenCode TUI slash palette does **not** list `/auto`. Distinct from **BUG-0015 DONE** (missing attach), **BUG-0017 DONE** (CRLF hid all commands), and **BUG-0018 DONE** (markdown-wins STOP — collision/STOP fix remains correct; do **not** reopen).

**Approach E1 / E\***: TUI keymap `slash`/`slashName` `"auto"` lists `/auto`; `run()` → `context.client` / plugin RPC → `runAutoLifecycle`; keep `editor.add`; additive sibling `.opencode/plugins/its-magic-auto/{index.ts,tui.ts}` (keep flat `orchestrator.ts`); no `cli.json`; tokens `OPENCODE_AUTO_SLASH_LISTING_UNSUPPORTED` + `OPENCODE_AUTO_TUI_DISPATCH_UNSUPPORTED`; seven `test_bug0019_*`; upgrade copy listing files + still prune leftover `auto.md`. No companion DEC. `# BUG-0019` supersedes R-0120 DQ5 / `# BUG-0018` NB1 (historical bodies UNCHANGED).

Out of scope: Cursor `/auto`; US-0135+; reopen 0015/16/17/18; Axis A/B/C/D (E2–E5); restore STOP-only `auto.md`; JSON `commands.auto` template; convert `orchestrator.ts` into a package (E6); companion DEC-0135 (E7); kit `cli.json`/`tui.json` by default; live OpenCode CI probe; `.cursor/commands/auto.md`; `.opencode/agents/auto.md`; marking BUG-0019 DONE; ticking acceptance.

## Execute awareness (architecture critic NBs — 0 blocking)

Sovereign-critic of architecture PASS (`critic-BUG0019-architecture-20260912T182000Z-fresh`; anti_slop=9; 0 blocking). Consumed architecture proof MATCH before TTL. Route these resolved NBs as execute awareness — do not re-open them as work:

| Finding | Issue key | Execute awareness |
|---|---|---|
| `bug0019arc-challenger-001` | `ik_bug0019_arc_proof_e1_star` | **T-001/T-003/T-005**: execute owns `its-magic-auto/` + invoke wiring + tests. Failure modes: restoring `auto.md` recreates 0018; JSON template is 0018-class; silent missing-command without listing token; duplicate `editor.add` in `index.ts`; premature DONE. |
| `bug0019arc-architect-002` | `ik_bug0019_arc_layer_sprintplan_owns` | Keep **T-anch..T-007 1:1** from architecture seeds; sprint folder is **S0139**; architecture owns H1+E*; execute owns surfaces. Residual: exact client invoke path / optional orchestrator RPC wrapper is execute-owned. |
| `bug0019arc-subtractor-003` | `ik_bug0019_arc_scope_yagni_pass` | T-anch ceremony overlap acceptable. Do not invent companion DEC / restore `auto.md` / JSON `commands.auto` / convert orchestrator.ts / `cli.json` / live probe. Do not mark BUG-0019 DONE. Do not reopen BUG-0018/0017/0015/0016. 7 markers required. |

## Acceptance criteria (7 slices + primary acceptance row) — BUG-0019 (status OPEN, unchecked per US-0045)

Primary acceptance (`docs/product/acceptance.md` BUG-0019 row + backlog `expected`): Operator can **select/invoke `/auto`** in OpenCode (picker or equivalent host list) **and** invocation starts plugin `execute` → `runAutoLifecycle` **or** fail-closes with documented `OPENCODE_*`. Must not return to silent markdown STOP. Must not restore STOP-only `auto.md` as the listing fix.

Architecture slices (surjective planning ACs from `# BUG-0019` AC coverage mapping; extra architecture rows folded into AC-3 / AC-7):

- **AC-1**: Operator can select `/auto` in OpenCode list (TUI keymap slash) — T-001, T-005 (m4).
- **AC-2**: Invocation starts `runAutoLifecycle` or documented `OPENCODE_*` — T-003, T-004, T-005 (m5).
- **AC-3**: Must not restore STOP-only `auto.md`; peers remain listed — T-002, T-005 (m1), T-anch.
- **AC-4**: Must not JSON-template `/auto` — T-002, T-005 (m3).
- **AC-5**: Plugin `editor.add` execute retained (compose BUG-0018 A*) — T-002, T-005 (m2).
- **AC-6**: Fail-closed listing token `OPENCODE_AUTO_SLASH_LISTING_UNSUPPORTED` (not silent miss) — T-001, T-004, T-005 (m4).
- **AC-7**: Consumer upgrade copies listing + still prunes `auto.md`; active↔template parity — T-006, T-007, T-005 (m6, m7).

## Task summaries (8 — T-anch + T-001..T-007)

- **T-anch** (NO-OP / verification): Verify `# BUG-0019` H1 + approach E1/E* + R-0124 DQ1–DQ8 + DQ5/NB1 superseded + no companion DEC. Record to `sprints/S0139/t-anch-verification.md`. NO mutation to `architecture.md` / R-0124 in /execute.
- **T-001** (AC-1, AC-6): Add sibling `.opencode/plugins/its-magic-auto/{index.ts,tui.ts}` (active+template); keymap `slash`/`slashName` `"auto"`; fail-closed listing token if keymap API missing. `index.ts` must **not** `editor.add({ name: "auto" })`.
- **T-002** (AC-3, AC-4, AC-5): Retain `orchestrator.ts` `editor.add({ name: "auto", execute })` → `runAutoLifecycle`; do **not** restore `auto.md`; do **not** add JSON `commands.auto` template; keep peer markdown commands.
- **T-003** (AC-2): Wire TUI `run()` → `context.client` / plugin RPC → `runAutoLifecycle` (not Command.Info template); dispatch fail-closed `OPENCODE_AUTO_TUI_DISPATCH_UNSUPPORTED`.
- **T-004** (AC-2, AC-6): Add `OPENCODE_AUTO_SLASH_LISTING_UNSUPPORTED` (+ dispatch sibling) to plugin `REASON_CODES` + runbook stub (US-0126 cross-link).
- **T-005** (AC-1..AC-7): Add 7 `test_bug0019_*` markers; no live OpenCode probe; do not weaken `test_bug0018_*`.
- **T-006** (AC-7): Upgrade `--host opencode|both` **copies** new TUI files and still **prunes** leftover `auto.md`; installer-owned-paths named rows if required.
- **T-007** (AC-7): Runbook upgrade recipe + active↔template parity for listing package / runbook stub / installer paths / parity-script pair.

Execution order: T-anch → T-001 → T-002 → T-003 → T-004 → T-005 → T-006 → T-007 (acyclic; listing package before invoke wiring; tokens before tests; copy+prune before marker 7; docs/parity last).

## AC → Task surjective coverage

| AC | Task(s) |
|---|---|
| AC-1 (operator can select `/auto`) | T-001, T-005 (m4) |
| AC-2 (invocation → lifecycle / `OPENCODE_*`) | T-003, T-004, T-005 (m5) |
| AC-3 (no restore `auto.md`; peers remain listed) | T-002, T-005 (m1), T-anch |
| AC-4 (no JSON `commands.auto` template) | T-002, T-005 (m3) |
| AC-5 (plugin `editor.add` execute retained) | T-002, T-005 (m2) |
| AC-6 (listing fail-closed token, not silent miss) | T-001, T-004, T-005 (m4) |
| AC-7 (upgrade copy+prune + active↔template parity) | T-006, T-007, T-005 (m6, m7) |
| DC / architecture baseline | T-anch |

**Surjectivity check**: 7/7 ACs covered (each AC ≥1 task) + primary acceptance.md BUG-0019 row covered by AC-1+AC-2+AC-3+AC-6 aggregate. No `PLAN_AC_COVERAGE_GAP`. T-anch retained as verification-only.

## Locked 7-marker table (R-0124 / architecture)

1. `test_bug0019_no_restored_opencode_auto_md`
2. `test_bug0019_plugin_editor_add_auto_execute_retained`
3. `test_bug0019_no_json_commands_auto_template`
4. `test_bug0019_tui_slash_auto_listing_surface`
5. `test_bug0019_tui_run_dispatches_lifecycle_not_template`
6. `test_bug0019_active_template_listing_parity`
7. `test_bug0019_upgrade_copies_listing_surface`

Static/fixture only — **no live OpenCode TUI probe**. Preferred file: `tests/bug0019_opencode_auto_slash_listing_test.py`. Do **not** weaken `test_bug0018_*`.

## Risks (R1–R6 — accepted)

| Risk | Severity | Mitigation |
|---|---|---|
| R1 TUI `run()` cannot reach server `runAutoLifecycle` | MEDIUM | T-003 locked client/RPC invoke; `OPENCODE_AUTO_TUI_DISPATCH_UNSUPPORTED`; never markdown/JSON template |
| R2 Host TUI discovery wants package layout / `tui.json` | MEDIUM | T-001 additive sibling `index.ts`+`tui.ts`; no `cli.json`; listing token if keymap never registers; do not convert orchestrator.ts |
| R3 Keymap `slash.name=auto` collides with future Command.Info `/auto` | LOW | T-002 keep `auto.md` absent; forbid JSON `commands.auto`; 0018 prune remains |
| R4 Already-pruned consumers miss new TUI files | LOW | T-006 copy-on-upgrade + T-005 m7 |
| R5 Cursor `/auto` mistaken for this bug | LOW | Out of scope (D8); do not prune `.cursor/commands/auto.md` |
| R6 Reason-code stub drift vs US-0126 | LOW | T-004 stub + cross-link only |

## Compose guards (UNCHANGED)

| Target | Result |
|---|---|
| DEC-0124 / DEC-0125 bodies | compose — do not amend |
| `# BUG-0018` historical body / R-0120 body | compose — do not rewrite; `# BUG-0019` supersedes DQ5/NB1 |
| DEC-0120 | compose — upgrade path documented |
| DEC-0132 preserve paths | compose — new plugin files are framework, not operator locals |
| BUG-0015 / BUG-0016 / BUG-0017 / BUG-0018 | DONE — do not reopen |
| `.cursor/commands/auto.md` / `.opencode/agents/auto.md` | do not touch |
| `tests/bug0018_*` | do not weaken (`auto.md` remains absent) |
| US-0045 | Status stays OPEN |

## Execute phase role (per DEC-0051 / US-0069)

| Phase | Role | Isolation |
|---|---|---|
| /execute | dev (fresh per BUG-0006) | {phase_id:execute, role:dev} |
| /qa | qa (fresh) | {phase_id:qa, role:qa} — ultra_lean may create/overwrite plan-verify.json inside build+verify; this sprint-plan does **not** run /plan-verify |
| /verify-work | qa (fresh) | {phase_id:verify-work, role:qa} |
| /release | release (fresh) | {phase_id:release, role:release} |
| /closure | qe (fresh) | {phase_id:closure, role:qe} |
| /refresh-context | curator (fresh) | {phase_id:refresh-context, role:curator} |

## Isolation evidence (US-0048 / DEC-0029 / US-0104 v2)

| Field | Value |
|---|---|
| phase_id | sprint-plan |
| role | tech-lead |
| bug_id | BUG-0019 |
| story_id | BUG-0019 |
| sprint_id | S0139 |
| orchestrator_run_id | auto-20260912-bug0019 |
| delivery_mode | ultra_lean |
| macro_phase | plan |
| fresh_context_marker | tl-BUG0019-sprintplan-20260912T182500Z-fresh |
| timestamp | 2026-09-12T18:30:00Z (UTC) |
| model_id | cursor-grok-4.6 (CROSS_MODEL_REVIEW=1 — required) |
| evidence_ref | sprints/S0139/sprint.md, sprints/S0139/tasks.md, sprints/S0139/progress.md, sprints/S0139/uat.json, sprints/S0139/uat.md, sprints/S0139/plan-verify.json (deferred/skipped placeholder), handoffs/tl_to_dev.md (BUG-0019 prepend), docs/engineering/state.md (sprint-plan checkpoint + traceability), docs/engineering/architecture.md # BUG-0019 (not mutated), handoffs/resume_brief.md |

Prior phase proof consumed: `rp-auto-20260912-bug0019-architecture-techlead-20260912T181500Z-BUG-0019` / `467370D2B9622A20D2659B59116522D4E7D8F42B65253A936F40A0A72C729970` — RUNTIME_PROOF_VALID (MATCH before TTL 2026-09-12T19:15:00Z; consumed 2026-09-12T18:30:00Z). Sovereign-critic architecture PASS (`critic-BUG0019-architecture-20260912T182000Z-fresh`; anti_slop=9; 0 blocking; NBs routed).

## Runtime proof (DEC-0038)

| Field | Value |
|---|---|
| runtime_proof_id | rp-auto-20260912-bug0019-sprint-plan-techlead-20260912T183000Z-BUG-0019 |
| phase_id | sprint-plan |
| role | tech-lead |
| story_id | BUG-0019 |
| sprint_id | S0139 |
| orchestrator_run_id | auto-20260912-bug0019 |
| delivery_mode | ultra_lean |
| macro_phase | plan |
| model_id | cursor-grok-4.6 (CROSS_MODEL_REVIEW=1 — required) |
| proof_issued_at | 2026-09-12T18:30:00Z |
| proof_ttl_seconds | 3600 |
| proof_ttl | 2026-09-12T19:30:00Z (UTC) |
| proof_hash | CE7CBD5F51EA25108B6C877ED94B2A9189CD1D9DADA761B70A1A4ACAF200A6D0 |
| canonical_payload | `{"delivery_mode":"ultra_lean","macro_phase":"plan","model_id":"cursor-grok-4.6","orchestrator_run_id":"auto-20260912-bug0019","phase_id":"sprint-plan","proof_issued_at":"2026-09-12T18:30:00Z","proof_ttl_seconds":3600,"role":"tech-lead","runtime_proof_id":"rp-auto-20260912-bug0019-sprint-plan-techlead-20260912T183000Z-BUG-0019","sprint_id":"S0139","story_id":"BUG-0019"}` |

## Decision gate

| Field | Value |
|---|---|
| decision_gate | false |
| stop_conditions_met | yes |
| missing_acceptance_criteria | none (7/7 slices + primary acceptance row covered; 7 contract-test markers) |
| compose_guards | DEC-0124/0125/0120/0132/BUG-0015/0016/0017/0018/US-0045 UNCHANGED |
| dc_check | clean (`# BUG-0019` H1 already added in /architecture) |
| task_count | 8 (within SPRINT_MAX_TASKS=12; SPRINT_AUTO_SPLIT=1 but no split needed; 1:1 seeds; not `/quick`; not `--bulk`) |
| risks_finalized | 6/6 ACCEPTED (R1..R6) |
| approach | E1 / E* locked |
| companion_DEC | none |
| plan-verify readiness | ultra_lean — plan-verify NOT in resolved_phase_plan; skipped; plan-verify.json is a deferred/skipped placeholder (not a QA spawn) |
| sovereign_memory_note | `assemble_sovereign_memory_digest(...)` NOT called; no mistakes.jsonl write |

## Definition of done (sprint-plan)

- [x] 8 tasks enumerated (T-anch + T-001..T-007) — within SPRINT_MAX_TASKS=12; 1:1 from architecture seeds
- [x] 7/7 ACs surjective + primary acceptance.md BUG-0019 covered
- [x] Task dependency graph documented
- [x] Execute phase role matrix documented (ultra_lean — /plan-verify skipped; next = /execute)
- [x] Compose guards UNCHANGED
- [x] Critic carry-ins (3 non-blocking from architecture sovereign-critic) routed as execute awareness
- [x] Isolation evidence + runtime proof emitted (model_id=cursor-grok-4.6 present)
- [x] Sprint-plan checkpoint appended to `docs/engineering/state.md`
- [x] Sprint-plan handoff prepended to `handoffs/tl_to_dev.md`
- [x] Sprint-plan PASS prepended to `handoffs/resume_brief.md` (-> /execute)
- [x] UAT placeholders written (`uat.json` empty steps, `uat.md` ACs no results)
- [x] Traceability row added (Story=BUG-0019 | Sprint=S0139 | Tasks=T-anch+T-001..T-007 | Status=PLANNED | Evidence empty)
- [x] Backlog status OPEN (US-0045 — not mutated); acceptance unchecked; sprint_plan_notes appended
- [x] plan-verify.json deferred/skipped placeholder (not a QA phase)

## Next scheduled phase

| Field | Value |
|---|---|
| next_scheduled_phase | `/execute` (role=dev per US-0069 / DEC-0051; fresh dev subagent per BUG-0006; first canonical phase of `build+verify` macro per ultra_lean; plan-verify NOT in resolved_phase_plan — skipped). Orchestrator may run sovereign-critic of sprint-plan first (CROSS_MODEL_REVIEW=1). Do not mandate outer driver. |
| next_scheduled_role | dev |
| next_sprint_macro | build+verify (ultra_lean — plan-verify skipped at this boundary) |
| stop_condition | STOP after sprint-plan completes; hand off via artifacts only. Orchestrator owns critic of sprint-plan (if CROSS_MODEL_REVIEW=1) then `/execute` in fresh dev subagent per BUG-0006. Do not spawn /execute or /plan-verify from this subagent. |
| artifacts_written | sprints/S0139/ (sprint.md, tasks.md, progress.md, uat.json, uat.md, plan-verify.json placeholder), docs/engineering/state.md (sprint-plan checkpoint + traceability), handoffs/tl_to_dev.md (BUG-0019 prepend), handoffs/resume_brief.md (sprint-plan PASS prepend -> /execute), docs/product/backlog.md (sprint_plan_notes append; Status OPEN) |
