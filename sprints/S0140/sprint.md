# Sprint S0140 - Sprint Plan (BUG-0020)

## Metadata

| Field | Value |
|---|---|
| bug_id | BUG-0020 |
| story_id | (none — bug segment) |
| story_title | OpenCode still has no invokable auto mode after BUG-0019 TUI keymap (Command.Info picker live-falsifies E*) |
| sprint_id | S0140 |
| delivery_mode | ultra_lean |
| macro_phase | plan (sprint-plan terminal; plan-verify NOT in resolved_phase_plan — skipped; next = execute) |
| current_phase | sprint-plan |
| approach | E2 locked (from R-0126 DQ1–DQ8; architecture critic NB1–NB3 CLOSED) |
| companion_DEC | none (cite R-0126; compose DEC-0124 / DEC-0125 / DEC-0120 / DEC-0132 / BUG-0018 A* / BUG-0019 E* CLI TUI; do not allocate DEC-0136) |
| research_anchor | R-0126 (DQ1–DQ8 LOCKED; compose R-0125 / R-0124) |
| architecture_anchor | docs/engineering/architecture.md # BUG-0020 |
| orchestrator_run_id | auto-20260913-bug0020 |
| fresh_context_marker | tl-BUG0020-sprintplan-20260912T234500Z-fresh |
| timestamp | 2026-09-12T23:45:00Z (UTC) |
| model_id | cursor-grok-4.6 (CROSS_MODEL_REVIEW=1 — required on isolation) |
| verdict | PASS |
| decision_gate | false |
| SPRINT_MAX_TASKS | 12 |
| SPRINT_AUTO_SPLIT | 1 |
| task_count | 8 (T-anch + T-001..T-007; within 12; no split; 1:1 from architecture seeds) |
| COMPONENT_SCOPE_MODE | 0 |
| USER_GUIDE_MODE | 0 |
| plan-verify | ultra_lean — NOT in resolved_phase_plan; skipped; plan-verify.json written as deferred/skipped placeholder only (not a QA phase; QA may overwrite in build+verify) |
| backlog_status | OPEN (US-0045 — not mutated; acceptance BUG-0020 unchecked) |
| sprint_id_lock | **S0140** is next free after S0139. Confirmed no S0140 folder existed before this spawn. |
| critic_carry_ins | 0 new blocking; 3 architecture critic NBs `bug0020arc-*` status=resolved non-blocking — routed as awareness into /execute (below) |

## Scope summary

Close the **operator-picker listing residual** left after BUG-0019 E*: sibling `.opencode/plugins/its-magic-auto/{index.ts,tui.ts}` TUI keymap `slash`/`slashName` `"auto"` is present, `orchestrator.ts` `editor.add({ name: "auto", execute })` → `runAutoLifecycle` is still registered, colliding `auto.md` is absent — but the **desktop/GUI Command.Info composer** that lists `/ask` still has **no `/auto`**. Distinct from **BUG-0015 DONE** (attach present), **BUG-0017 DONE** (peers exist), **BUG-0018 DONE** (markdown-wins STOP — do **not** restore `auto.md`), and **BUG-0019 DONE** (E* closed on static `test_bug0019_*`; listing surface live-falsified as CLI TUI keymap ≠ desktop Command.Info). Do **not** reopen S0139 ACs.

**Approach E2**: Honest host-cannot-do-both on desktop Command.Info. Keep `editor.add` → `runAutoLifecycle`. **C-limb**: CLI TUI `/auto` via shipping `.opencode/tui.json` listing `./plugins/its-magic-auto/tui.ts` so the existing keymap actually loads. **Desktop-visible** `OPENCODE_AUTO_DESKTOP_COMMAND_INFO_LISTING_UNSUPPORTED` when the operator Command.Info picker cannot list execute-only `/auto` while execute is registered — **not** silent miss. Eight `test_bug0020_*` contract tests. Upgrade copy-if-absent / JSONC-merge `tui.json` + still prune leftover `auto.md`. No companion DEC. `# BUG-0020` supersedes R-0124 E* / `# BUG-0019` operator-picker listing claim (historical bodies UNCHANGED). E* remains valid **CLI TUI keymap**.

Out of scope: Cursor `/auto`; US-0135+; reopen 0015/16/17/18/19 ACs; Axis A/B/C-sole/D; restore STOP-only `auto.md`; JSON `commands.auto` template; ship kit `cli.json` or plugin-local `its-magic-auto/tui.json`; invent a desktop execute-only Command.Info listing API; live OpenCode desktop CI probe; companion DEC; token-only with no C-limb; marking BUG-0020 DONE; ticking acceptance.

## Execute awareness (architecture critic NBs — 0 blocking)

Sovereign-critic of architecture PASS (`critic-BUG0020-architecture-20260912T233500Z-fresh`; anti_slop=9; 0 blocking). Consumed architecture proof MATCH before TTL. Route these resolved NBs as execute awareness — do not re-open them as work:

| Finding | Issue key | Execute awareness |
|---|---|---|
| `bug0020arc-challenger-001` | `ik_bug0020_arc_proof_e2_locked` | **T-001/T-003/T-004/T-005**: execute owns `tui.json` ship + `emitDesktopCommandInfoListingUnsupported` + 8 tests. R1 operator-stays-on-desktop is accepted: C-limb CLI TUI `/auto` + runbook + desktop fail-closed token satisfy D1 documented-equivalent. Failure modes: restoring `auto.md` recreates 0018; JSON template is 0018-class; TUI-toast-only emission; silent desktop miss; claiming `tui.json` feeds Command.Info. |
| `bug0020arc-architect-002` | `ik_bug0020_arc_layer_sprintplan_owns` | Keep **T-anch..T-007 1:1** from architecture seeds; sprint folder is **S0140**; architecture owns H1+E2; execute owns surfaces (`tui.json`, emit helper, 8 tests, upgrade merge). Residual: exact desktop notification channel order is execute-owned within the locked helper. |
| `bug0020arc-subtractor-003` | `ik_bug0020_arc_scope_yagni_pass` | T-anch ceremony overlap acceptable. Do not invent companion DEC / restore `auto.md` / JSON `commands.auto` / `cli.json` / plugin-local `tui.json` / live desktop probe / desktop execute-only API. Do not mark BUG-0020 DONE. Do not reopen BUG-0019/0018/0017/0015/0016. 8 markers required. |

## Acceptance criteria (10 slices + primary acceptance row) — BUG-0020 (status OPEN, unchecked per US-0045)

Primary acceptance (`docs/product/acceptance.md` BUG-0020 row + backlog `expected`): Operator can **start its-magic auto on OpenCode** the way they start it on Cursor — preferably `/auto` in the picker they actually use, **or** another documented host-true control — **and** that start runs plugin execute → `runAutoLifecycle` **or** fail-closes with a documented `OPENCODE_*`. Must not silent missing. Must not markdown STOP. Must not restore STOP-only `auto.md`.

Architecture slices (surjective planning ACs from `# BUG-0020` AC coverage mapping):

- **AC-1**: Operator can start auto on OpenCode (documented equivalent / C-limb CLI TUI `/auto` after `tui.json` load) — T-001, T-005 (m5, m6).
- **AC-2**: Invocation starts `runAutoLifecycle` or documented `OPENCODE_*` — T-002, T-003, T-005 (m3, m6).
- **AC-3**: Desktop picker is not a silent miss (`OPENCODE_AUTO_DESKTOP_COMMAND_INFO_LISTING_UNSUPPORTED`) — T-003, T-004, T-005 (m1, m4), T-007.
- **AC-4**: Must not restore STOP-only `auto.md` — T-002, T-005 (m2).
- **AC-5**: Must not JSON-template `/auto` — T-002, T-005 (m2).
- **AC-6**: Plugin `editor.add` execute retained (compose BUG-0018 A*) — T-002, T-005 (m3).
- **AC-7**: Consumer upgrade copies/merges `tui.json` + still prunes `auto.md` — T-006, T-005 (m8).
- **AC-8**: Active↔template parity — T-007, T-005 (m7).
- **AC-9**: Peers remain listed — T-anch, T-002.
- **AC-10**: Tests are picker/token contracts, not slash-string existence — T-005.

## Task summaries (8 — T-anch + T-001..T-007)

- **T-anch** (NO-OP / verification): Verify `# BUG-0020` H1 + approach E2 + R-0126 DQ1–DQ8 + E* picker claim superseded + no companion DEC. Record to `sprints/S0140/t-anch-verification.md`. NO mutation to `architecture.md` / R-0126 in /execute.
- **T-001** (AC-1): Add `.opencode/tui.json` (active+template) listing `./plugins/its-magic-auto/tui.ts`; CLI-TUI-only comment; keep existing `tui.ts` keymap; do not restore `auto.md`.
- **T-002** (AC-2, AC-4, AC-5, AC-6, AC-9): Retain `orchestrator.ts` `editor.add({ name: "auto", execute })` → `runAutoLifecycle`; do **not** restore `auto.md`; do **not** add JSON `commands.auto` template; do **not** ship `cli.json`.
- **T-003** (AC-2, AC-3): Wire `emitDesktopCommandInfoListingUnsupported` + `OPENCODE_AUTO_DESKTOP_COMMAND_INFO_LISTING_UNSUPPORTED` (not TUI-toast-only; not Command.Info `auto` template).
- **T-004** (AC-3): Add token to plugin `REASON_CODES` + runbook stub (US-0126 cross-link); document desktop vs CLI TUI.
- **T-005** (AC-1..AC-10): Add 8 `test_bug0020_*` markers; no live OpenCode probe; do not weaken `test_bug0018_*`; compose-only `test_bug0019_*` comments.
- **T-006** (AC-7): Upgrade `--host opencode|both` copy-if-absent / JSONC-merge `tui.json` + token wiring; still **prunes** leftover `auto.md`; installer-owned-paths named rows.
- **T-007** (AC-3, AC-8): Runbook CLI TUI `/auto` vs desktop token+CLI recipe + active↔template parity for `tui.json` / token / runbook / `BUG0020_PAIRS`.

Execution order: T-anch → T-001 → T-002 → T-003 → T-004 → T-005 → T-006 → T-007 (acyclic; `tui.json` before emit wiring; tokens before tests; copy+merge before marker 8; docs/parity last).

## AC → Task surjective coverage

| AC | Task(s) |
|---|---|
| AC-1 (operator can start auto — C-limb CLI TUI) | T-001, T-005 (m5, m6) |
| AC-2 (invocation → lifecycle / `OPENCODE_*`) | T-002, T-003, T-005 (m3, m6) |
| AC-3 (desktop picker not silent miss) | T-003, T-004, T-005 (m1, m4), T-007 |
| AC-4 (no restore `auto.md`) | T-002, T-005 (m2) |
| AC-5 (no JSON `commands.auto` template) | T-002, T-005 (m2) |
| AC-6 (plugin `editor.add` execute retained) | T-002, T-005 (m3) |
| AC-7 (upgrade copy/merge `tui.json` + prune) | T-006, T-005 (m8) |
| AC-8 (active↔template parity) | T-007, T-005 (m7) |
| AC-9 (peers remain listed) | T-anch, T-002 |
| AC-10 (picker/token contracts, not slash-string existence) | T-005 |
| DC / architecture baseline | T-anch |

**Surjectivity check**: 10/10 ACs covered (each AC ≥1 task) + primary acceptance.md BUG-0020 row covered by AC-1+AC-2+AC-3+AC-4 aggregate. No `PLAN_AC_COVERAGE_GAP`. T-anch retained as verification-only.

## Locked 8-marker table (R-0126 / architecture)

1. `test_bug0020_desktop_command_info_picker_contract`
2. `test_bug0020_no_command_info_auto_template`
3. `test_bug0020_plugin_editor_add_auto_execute_retained`
4. `test_bug0020_desktop_listing_fail_closed_token`
5. `test_bug0020_cli_tui_working_start_load_path`
6. `test_bug0020_tui_run_still_dispatches_lifecycle`
7. `test_bug0020_active_template_parity`
8. `test_bug0020_upgrade_copies_surface_still_prunes_auto_md`

Static/fixture only — **no live OpenCode desktop probe**. Preferred file: `tests/bug0020_opencode_desktop_command_info_listing_test.py`. Do **not** weaken `test_bug0018_*`. Do **not** weaken `test_bug0019_*` except compose-only comments that E* is not the desktop picker fix and that project `.opencode/tui.json` is now the CLI load path (plugin-local `its-magic-auto/tui.json` remains forbidden).

## Risks (R1–R7 — accepted)

| Risk | Severity | Mitigation |
|---|---|---|
| R1 Operator stays on desktop and never opens CLI TUI | HIGH | T-004/T-007 D1 documented equivalent; runbook explicit CLI recipe; do not fake Command.Info `/auto`; desktop-visible token (not silent) |
| R2 Desktop-visible fail-closed has no documented toast API from a server plugin | MEDIUM | T-003 locked emission order (session notice / setup session-error); TUI toast-only forbidden; marker 4 |
| R3 Internal `tui.json` vs public directory-discovery disagreement | MEDIUM | T-001 ship `tui.json` for CLI TUI load; marker 5 forbids claiming it feeds desktop |
| R4 Upgrade overwrites operator `tui.json` theme/keybinds | MEDIUM | T-006 copy-if-absent + JSONC merge of plugin spec only; marker 8 |
| R5 Someone restores `auto.md` / JSON template to fill the picker | LOW | T-002 D4/D6 + marker 2 + keep `test_bug0018_*` |
| R6 Cursor `/auto` mistaken for this bug | LOW | Out of scope (D8); do not prune `.cursor/commands/auto.md` |
| R7 Reason-code stub drift vs US-0126 | LOW | T-004 stub + cross-link only |

## Compose guards (UNCHANGED)

| Target | Result |
|---|---|
| DEC-0124 / DEC-0125 bodies | compose — do not amend |
| `# BUG-0019` historical body / R-0124 body | compose — do not rewrite; `# BUG-0020` supersedes E* picker claim |
| `# BUG-0018` historical body / R-0120 body | compose — do not rewrite |
| DEC-0120 | compose — upgrade path documented |
| DEC-0132 preserve paths | compose — `tui.json` is framework, merge-safe vs operator theme |
| BUG-0015 / BUG-0016 / BUG-0017 / BUG-0018 / BUG-0019 | DONE — do not reopen |
| `.cursor/commands/auto.md` / `.opencode/agents/auto.md` | do not touch |
| `tests/bug0018_*` | do not weaken (`auto.md` remains absent) |
| `tests/bug0019_*` | compose-only comments; markers unchanged |
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
| bug_id | BUG-0020 |
| story_id | BUG-0020 |
| sprint_id | S0140 |
| orchestrator_run_id | auto-20260913-bug0020 |
| delivery_mode | ultra_lean |
| macro_phase | plan |
| fresh_context_marker | tl-BUG0020-sprintplan-20260912T234500Z-fresh |
| timestamp | 2026-09-12T23:45:00Z (UTC) |
| model_id | cursor-grok-4.6 (CROSS_MODEL_REVIEW=1 — required) |
| evidence_ref | sprints/S0140/sprint.md, sprints/S0140/tasks.md, sprints/S0140/progress.md, sprints/S0140/uat.json, sprints/S0140/uat.md, sprints/S0140/plan-verify.json (deferred/skipped placeholder), handoffs/tl_to_dev.md (BUG-0020 prepend), docs/engineering/state.md (sprint-plan checkpoint + traceability), docs/engineering/architecture.md # BUG-0020 (not mutated), handoffs/resume_brief.md |

Prior phase proof consumed: `rp-auto-20260913-bug0020-architecture-techlead-20260912T232500Z-BUG-0020` / `92D10D4743D65A2F7AF276A45749FB57DFA15593254213488026D10171C2EC87` — RUNTIME_PROOF_VALID (MATCH before TTL 2026-09-13T00:25:00Z; independent Python `compute_strict_proof_hash` recompute byte-identical; consumed 2026-09-12T23:45:00Z). Sovereign-critic architecture PASS (`critic-BUG0020-architecture-20260912T233500Z-fresh`; anti_slop=9; 0 blocking; NBs `bug0020arc-*` routed).

## Runtime proof (DEC-0038)

| Field | Value |
|---|---|
| runtime_proof_id | rp-auto-20260913-bug0020-sprint-plan-techlead-20260912T234500Z-BUG-0020 |
| phase_id | sprint-plan |
| role | tech-lead |
| story_id | BUG-0020 |
| sprint_id | S0140 |
| orchestrator_run_id | auto-20260913-bug0020 |
| delivery_mode | ultra_lean |
| macro_phase | plan |
| model_id | cursor-grok-4.6 (CROSS_MODEL_REVIEW=1 — required) |
| proof_issued_at | 2026-09-12T23:45:00Z |
| proof_ttl_seconds | 3600 |
| proof_ttl | 2026-09-13T00:45:00Z (UTC) |
| proof_hash | 48453D60EC7A0FF0E77A2DB134534920099CDB90875EABB07CD2653880427193 |
| canonical_payload | `{"orchestrator_run_id":"auto-20260913-bug0020","phase_id":"sprint-plan","proof_issued_at":"2026-09-12T23:45:00Z","proof_ttl_seconds":3600,"role":"tech-lead","runtime_proof_id":"rp-auto-20260913-bug0020-sprint-plan-techlead-20260912T234500Z-BUG-0020"}` |

Hash via `scripts.token_cost_lib.compute_strict_proof_hash` (compact sorted-key JSON). Isolation extras (not hashed): `delivery_mode=ultra_lean`, `macro_phase=plan`, `model_id=cursor-grok-4.6`, `sprint_id=S0140`, `story_id=BUG-0020`.

## Decision gate

| Field | Value |
|---|---|
| decision_gate | false |
| stop_conditions_met | yes |
| missing_acceptance_criteria | none (10/10 slices + primary acceptance row covered; 8 contract-test markers) |
| compose_guards | DEC-0124/0125/0120/0132/BUG-0015/0016/0017/0018/0019/US-0045 UNCHANGED |
| dc_check | clean (`# BUG-0020` H1 already added in /architecture) |
| task_count | 8 (within SPRINT_MAX_TASKS=12; SPRINT_AUTO_SPLIT=1 but no split needed; 1:1 seeds; not `/quick`; not `--bulk`) |
| risks_finalized | 7/7 ACCEPTED (R1..R7) |
| approach | E2 locked |
| companion_DEC | none |
| plan-verify readiness | ultra_lean — plan-verify NOT in resolved_phase_plan; skipped; plan-verify.json is a deferred/skipped placeholder (not a QA spawn) |
| sovereign_memory_note | `assemble_sovereign_memory_digest(...)` NOT called; no mistakes.jsonl write |

## Definition of done (sprint-plan)

- [x] 8 tasks enumerated (T-anch + T-001..T-007) — within SPRINT_MAX_TASKS=12; 1:1 from architecture seeds
- [x] 10/10 ACs surjective + primary acceptance.md BUG-0020 covered
- [x] Task dependency graph documented
- [x] Execute phase role matrix documented (ultra_lean — /plan-verify skipped; next = /execute)
- [x] Compose guards UNCHANGED
- [x] Critic carry-ins (3 non-blocking from architecture sovereign-critic) routed as execute awareness
- [x] Isolation evidence + runtime proof emitted (model_id=cursor-grok-4.6 present)
- [x] Sprint-plan checkpoint appended to `docs/engineering/state.md`
- [x] Sprint-plan handoff prepended to `handoffs/tl_to_dev.md`
- [x] Sprint-plan PASS prepended to `handoffs/resume_brief.md` (-> /execute)
- [x] UAT placeholders written (`uat.json` empty steps, `uat.md` ACs no results)
- [x] Traceability row added (Story=BUG-0020 | Sprint=S0140 | Tasks=T-anch+T-001..T-007 | Status=PLANNED | Evidence empty)
- [x] Backlog status OPEN (US-0045 — not mutated); acceptance unchecked; sprint_plan_notes appended
- [x] plan-verify.json deferred/skipped placeholder (not a QA phase)

## Next scheduled phase

| Field | Value |
|---|---|
| next_scheduled_phase | `/execute` (role=dev per US-0069 / DEC-0051; fresh dev subagent per BUG-0006; first canonical phase of `build+verify` macro per ultra_lean; plan-verify NOT in resolved_phase_plan — skipped). Orchestrator may run sovereign-critic of sprint-plan first (CROSS_MODEL_REVIEW=1). Do not mandate outer driver. |
| next_scheduled_role | dev |
| next_sprint_macro | build+verify (ultra_lean — plan-verify skipped at this boundary) |
| stop_condition | STOP after sprint-plan completes; hand off via artifacts only. Orchestrator owns critic of sprint-plan (if CROSS_MODEL_REVIEW=1) then `/execute` in fresh dev subagent per BUG-0006. Do not spawn /execute or /plan-verify from this subagent. |
| artifacts_written | sprints/S0140/ (sprint.md, tasks.md, progress.md, uat.json, uat.md, plan-verify.json placeholder), docs/engineering/state.md (sprint-plan checkpoint + traceability), handoffs/tl_to_dev.md (BUG-0020 prepend), handoffs/resume_brief.md (sprint-plan PASS prepend -> /execute), docs/product/backlog.md (sprint_plan_notes append; Status OPEN) |
