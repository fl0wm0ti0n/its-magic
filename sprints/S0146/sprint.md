# Sprint S0146 - Sprint Plan (BUG-0021)

## Metadata

| Field | Value |
|---|---|
| bug_id | BUG-0021 |
| story_id | (none — bug segment) |
| story_title | OpenCode CLI TUI still has no invokable `/auto` after BUG-0020 tui.json (C-limb live-falsified) |
| sprint_id | S0146 |
| delivery_mode | ultra_lean |
| macro_phase | plan (sprint-plan terminal; plan-verify NOT in resolved_phase_plan — skipped; next = sovereign-critic of sprint-plan then execute) |
| current_phase | sprint-plan |
| approach | Axis A locked (from R-0134 DQ1–DQ8; architecture critic NB1–NB3 CLOSED) |
| companion_DEC | none (cite R-0134; compose DEC-0124 / DEC-0125 / DEC-0120 / DEC-0132 / BUG-0018 A* / BUG-0019 E* / BUG-0020 C-limb load path; do not allocate a companion DEC) |
| research_anchor | R-0134 (DQ1–DQ8 LOCKED; compose R-0131 / R-0126 / R-0125 / R-0124; do not wipe) |
| architecture_anchor | docs/engineering/architecture.md # BUG-0021 |
| orchestrator_run_id | auto-20260913-bug0021 |
| parent_orchestrator_run_id | cursor-20260913-BUG0021-intake |
| fresh_context_marker | tl-BUG0021-sprintplan-20260913T124000Z-fresh |
| timestamp | 2026-09-13T12:40:00Z (UTC) |
| model_id | cursor-grok-4.6-high (CROSS_MODEL_REVIEW=1 — required on isolation) |
| model_resolve_fallback | MODEL_RESOLVE_FALLBACK (requested_slug=gpt-5.6-sol-high; host Other Models usage limit) |
| verdict | PASS |
| decision_gate | false |
| SPRINT_MAX_TASKS | 12 |
| SPRINT_AUTO_SPLIT | 1 |
| task_count | 8 (T-anch + T-001..T-007; within 12; no split; 1:1 from architecture seeds) |
| COMPONENT_SCOPE_MODE | 0 |
| USER_GUIDE_MODE | 0 |
| plan-verify | ultra_lean — NOT in resolved_phase_plan; skipped; plan-verify.json written as SKIPPED placeholder only (not a QA phase) |
| backlog_status | OPEN (US-0045 — not mutated; acceptance BUG-0021 unchecked) |
| sprint_id_lock | **S0146** is next free after S0145 (US-0139). Confirmed no S0146 folder existed before this spawn. Do not overwrite S0140–S0145. Do not reuse S0145. |
| critic_carry_ins | 0 new blocking; 3 architecture critic NBs `bug0021arc-*` status=resolved non-blocking — routed as awareness into /execute |

## Scope summary

Close the **CLI TUI listing residual** left after BUG-0020 E2 C-limb: project `.opencode/tui.json` lists `./plugins/its-magic-auto/tui.ts`, sibling keymap strings `slash`/`slashName` `"auto"` exist, `orchestrator.ts` `editor.add({ name: "auto", execute })` → `runAutoLifecycle` is still registered, colliding `auto.md` is absent — but the operator **OpenCode CLI TUI** (`opencode`, not `--pure`) still has **no invokable `/auto`**. Typing `/auto ` (trailing space, not highlighted) sends chat; the model roleplays “Auto mode enabled.” That is **LLM prompt handling**, not lifecycle.

Distinct from **BUG-0015 DONE** (attach present), **BUG-0017 DONE** (peers exist), **BUG-0018 DONE** (markdown-wins STOP — do **not** restore `auto.md`), **BUG-0019 DONE** (E* closed on static `test_bug0019_*`), and **BUG-0020 DONE** (C-limb closed on static `test_bug0020_*`; desktop Command.Info honest token remains). Do **not** reopen S0140 / BUG-0020 ACs.

**Approach Axis A**: reshape the already-listed TUI module so the CLI TUI loader can activate it. Default export `{ id: "its-magic.auto.tui", tui }`; `registerLayer` `name: "its-magic.auto"` / `slashName: "auto"` / `namespace: "palette"`; binding **`ctrl+shift+a`**; `run()` → `api.client.rpc(ITS_MAGIC_AUTO_RPC)` → `runAutoLifecycle`; keep `tui.json` + `editor.add`; additive `OPENCODE_AUTO_CLI_TUI_PLUGIN_LOAD_UNSUPPORTED`; eight `test_bug0021_*`; upgrade **overwrites** reshaped `tui.ts` on C-limb trees and still **prunes** leftover `auto.md`. No companion DEC. `# BUG-0021` supersedes R-0126 / `# BUG-0020` C-limb listing claim (historical bodies UNCHANGED). `tui.json` remains the load **path**, not listing proof.

Out of scope: Cursor `/auto`; `--pure`; BUG-0022; US-0139+ drain; US-0133..US-0148 mutation; reopen 0015/16/17/18/19/0020 ACs / S0140; Axis B/D/E; restore STOP-only `auto.md`; JSON `commands.auto` template; ship kit `cli.json` or plugin-local `its-magic-auto/tui.json`; live OpenCode CLI TUI probe in default CI; companion DEC; rewrite `# BUG-0020`; marking BUG-0021 DONE; ticking acceptance.

## Execute awareness (architecture critic NBs — 0 blocking)

Sovereign-critic of architecture PASS (`tl-BUG0021-critic-architecture-20260913T123600Z-fresh`; anti_slop=10; 0 blocking; degraded_mode=false). Consumed architecture proof MATCH before TTL. Route these resolved NBs as execute awareness — do not re-open them as work:

| Finding | Issue key | Execute awareness |
|---|---|---|
| `bug0021arc-challenger-001` | `ik_bug0021arc_proof_failclosed_pass` | **T-004/T-005/T-007**: LOAD/LISTING/DISPATCH fail-closed; silent skip when `tui()` never runs; `#36505` residual; upgrade overwrite R7. Token `OPENCODE_AUTO_CLI_TUI_PLUGIN_LOAD_UNSUPPORTED` is the listed-but-skipped residual, **not** a reason to restore `auto.md`. |
| `bug0021arc-architect-002` | `ik_bug0021arc_layer_tui_cli_ok` | Keep **T-anch..T-007 1:1** from architecture seeds; sprint folder is **S0146**; architecture owns H1+Axis A; execute owns reshape `{ id, tui }` + `registerLayer` + `api.client.rpc` + 8 tests + overwrite. `index.ts` stays server-only. CLI slash = keymap `slashName`; `GET /api/command` is Command.Info peers. |
| `bug0021arc-subtractor-003` | `ik_bug0021arc_scope_yagni_pass` | T-anch ceremony overlap acceptable. Do not invent companion DEC / restore `auto.md` / JSON `commands.auto` / `cli.json` / plugin-local `tui.json` / live CLI TUI probe / rewrite `# BUG-0020`. Do not mark BUG-0021 DONE. Do not reopen BUG-0020/0019/0018. Do not mutate BUG-0022 / US-0139. 8 markers required. 8 tasks within SPRINT_MAX_TASKS=12. |

## Acceptance criteria (10 slices + primary acceptance row) — BUG-0021 (status OPEN, unchecked per US-0045)

Primary acceptance (`docs/product/acceptance.md` BUG-0021 row + backlog `expected`): Operator can invoke a real OpenCode **slash command** `/auto` (highlighted/listed in CLI TUI command list, not free-text) that starts its-magic plugin `execute` → `runAutoLifecycle` (or fail-closes with documented `OPENCODE_*`). Must not be LLM “Auto mode enabled”. Must not restore STOP-only `auto.md`.

Architecture slices (surjective planning ACs from `# BUG-0021` AC coverage mapping):

- **AC-1**: Operator can invoke listed CLI TUI `/auto` (Axis A `{ id, tui }` + `slashName: "auto"`) — T-001, T-002, T-005 (m1, m2, m6).
- **AC-2**: Invocation starts `runAutoLifecycle` or documented `OPENCODE_*` — T-003, T-004, T-005 (m3, m5).
- **AC-3**: Must not restore STOP-only `auto.md` — T-anch, T-005 (m4).
- **AC-4**: Must not JSON-template `/auto` — T-005 (m4).
- **AC-5**: Plugin `editor.add` execute retained (compose BUG-0018 A*) — T-003, T-005 (m3).
- **AC-6**: Consumer upgrade overwrites reshaped `tui.ts` + still prunes leftover `auto.md` — T-006, T-005 (m8).
- **AC-7**: Active↔template parity — T-007, T-005 (m7).
- **AC-8**: Peers remain listed — T-anch.
- **AC-9**: Tests are loader/keymap/rpc contracts, not `tui.json`-path-only — T-005.
- **AC-10**: `#36505` residual is documented, not a markdown restore — T-004, T-007.

## Task summaries (8 — T-anch + T-001..T-007)

- **T-anch** (NO-OP / verification): Verify `# BUG-0021` H1 + Axis A + R-0134 DQ1–DQ8 + C-limb listing claim superseded + no companion DEC + do not rewrite `# BUG-0020`. Record to `sprints/S0146/t-anch-verification.md`. NO mutation to `architecture.md` / R-0134 in /execute.
- **T-001** (AC-1): Reshape `its-magic-auto/tui.ts` default export `{ id: "its-magic.auto.tui", tui }` (active+template); not `Plugin.define` as TUI default. Tests: marker 1.
- **T-002** (AC-1): `registerLayer` `name: "its-magic.auto"` + `slashName: "auto"` + `namespace: "palette"` + binding `{ key: "ctrl+shift+a", cmd: "its-magic.auto" }`; keep `slash: { name: "auto" }`. Tests: marker 2 (+ m6 compose).
- **T-003** (AC-2, AC-5): `run()` → `api.client.rpc(ITS_MAGIC_AUTO_RPC)` → `runAutoLifecycle`; keep `editor.add`; not SessionPrompt / Command.Info template / LLM chat. Tests: marker 3.
- **T-004** (AC-2, AC-10): Wire `OPENCODE_AUTO_CLI_TUI_PLUGIN_LOAD_UNSUPPORTED` (reuse LISTING/DISPATCH; do not reuse desktop); runbook residual `#36505` when `tui()` never runs. Tests: marker 5.
- **T-005** (AC-1..AC-10): Add 8 `test_bug0021_*` markers; no live OpenCode probe in default CI; do not weaken `test_bug0018_*`/`test_bug0019_*`/`test_bug0020_*` except compose-only C-limb comments. Owns all 8 markers including m4 (`no_auto_md_no_json_template`) and m6 (`slash_list_is_keymap_not_command_info`).
- **T-006** (AC-6): Upgrade `--host opencode|both` **overwrites** reshaped `tui.ts` on C-limb trees; still **prunes** leftover `auto.md`; no general sweeper. Tests: marker 8.
- **T-007** (AC-7, AC-10): Runbook CLI TUI `/auto` recipe + `--pure` out of scope + active↔template parity for reshaped `tui.ts` / token / `BUG0021_PAIRS`. Tests: marker 7.

**8-test surjection (architecture mapping kept; neither m7 nor m8 dropped):** T-001→m1; T-002→m2; T-003→m3; T-004→m5; T-005→m1..m8 (including m4 + m6); T-006→m8; T-007→m7; T-anch→AC-3/AC-8 (no auto.md restore; peers). Architecture did **not** dump both remaining tests onto T-007 — m7 stays T-007, m8 stays T-006.

Execution order: T-anch → T-001 → T-002 → T-003 → T-004 → T-005 → T-006 → T-007 (acyclic; reshape before keymap/rpc; tokens before tests; overwrite before marker 8; docs/parity last). No split (8 ≤ 12). Not `/quick`.

## AC → Task surjective coverage

| AC | Task(s) |
|---|---|
| AC-1 (listed CLI TUI `/auto`) | T-001, T-002, T-005 (m1, m2, m6) |
| AC-2 (invocation → lifecycle / `OPENCODE_*`) | T-003, T-004, T-005 (m3, m5) |
| AC-3 (no restore `auto.md`) | T-anch, T-005 (m4) |
| AC-4 (no JSON `commands.auto` template) | T-005 (m4) |
| AC-5 (plugin `editor.add` execute retained) | T-003, T-005 (m3) |
| AC-6 (upgrade overwrite `tui.ts` + prune) | T-006, T-005 (m8) |
| AC-7 (active↔template parity) | T-007, T-005 (m7) |
| AC-8 (peers remain listed) | T-anch |
| AC-9 (loader/keymap/rpc contracts, not path-only) | T-005 |
| AC-10 (`#36505` residual documented) | T-004, T-007 |
| DC / architecture baseline | T-anch |

**Surjectivity check**: 10/10 ACs covered (each AC ≥1 task) + primary acceptance.md BUG-0021 row covered by AC-1+AC-2+AC-3 aggregate. All 8 `test_bug0021_*` mapped. No `PLAN_AC_COVERAGE_GAP`. T-anch retained as verification-only.

## Locked 8-marker table (R-0134 / architecture)

1. `test_bug0021_tui_default_export_id_tui_shape`
2. `test_bug0021_registerLayer_name_slashName_palette_key`
3. `test_bug0021_run_rpc_to_runAutoLifecycle`
4. `test_bug0021_no_auto_md_no_json_template`
5. `test_bug0021_fail_closed_load_token`
6. `test_bug0021_slash_list_is_keymap_not_command_info`
7. `test_bug0021_active_template_parity`
8. `test_bug0021_upgrade_copies_tui_shape_still_prunes_auto_md`

Static/fixture only — **no live OpenCode CLI TUI probe** in default CI. Preferred file: `tests/bug0021_opencode_cli_tui_plugin_load_test.py`. Do **not** weaken `test_bug0018_*`. Do **not** weaken `test_bug0020_*` except compose-only comments that C-limb file-presence is not the CLI listing proof. Do **not** weaken `test_bug0019_*` except compose-only: keep `slashName: "auto"` / `slash: { name: "auto" }` / `registerLayer` or `keymap.layer`; `Plugin.define` remains on **index.ts**, not as the TUI default.

## Risks (R1–R8 — accepted)

| Risk | Severity | Mitigation |
|---|---|---|
| R1 Operator OpenCode binary predates v2 external TUI plugin activation (`#36505`) | MEDIUM | T-004/T-007: Axis A still required; residual → `OPENCODE_AUTO_CLI_TUI_PLUGIN_LOAD_UNSUPPORTED` + runbook; do **not** restore `auto.md` |
| R2 Binding `ctrl+shift+a` collides with builtin / operator `keybinds` | LOW | T-002: slash listing does not depend on the chord; tests lock the string; operator can rebind |
| R3 `test_bug0019_*` string contracts break if extras are dropped | LOW | T-002: keep `slash: { name: "auto" }` + `slashName` + `registerLayer` or `keymap.layer`; keep `@opencode/plugin/tui` comment |
| R4 `api.client.rpc` vs `context.client.rpc` mismatch | LOW | T-003: DQ4 locks `api.client` for `{ id, tui }`; keep HTTP RPC fallback; DISPATCH token if both fail |
| R5 Operators treat desktop Command.Info `/auto` as in-scope | LOW | T-005 m6 / `# BUG-0020` compose; this bug is CLI TUI only |
| R6 Someone restores `auto.md` / JSON template to fill the slash list | LOW | T-anch + T-005 m4 + keep `test_bug0018_*` |
| R7 Upgrade leaves C-limb `Plugin.define` `tui.ts` in place (copy-if-absent) | MEDIUM | T-006/T-005 m8: assert **overwrite**; reuse `copy_opencode_auto_listing_surface` `copy2` |
| R8 Reason-code stub drift vs US-0126 | LOW | T-004: stub + cross-link only |

## Compose guards (UNCHANGED)

| Target | Result |
|---|---|
| `# BUG-0020` / R-0126 / S0140 | compose — do not rewrite historical bodies; C-limb listing claim superseded by `# BUG-0021` |
| `# BUG-0019` / R-0124 | compose — keep slashName / registerLayer extras |
| `# BUG-0018` / R-0120 / DEC-0124 / DEC-0125 | compose — `auto.md` stays absent; do not restore |
| BUG-0015 / BUG-0016 / BUG-0017 DONE | do not reopen |
| BUG-0022 OPEN | not mutated |
| US-0139 / S0145 | not reused; not mutated |
| US-0133..US-0148 | not mutated |
| US-0045 | Status stays OPEN |
| DEC-0038 `compute_strict_proof_hash` tuple | UNAMENDED |

## Execute phase role (per DEC-0051 / US-0069)

| Phase | Role | Isolation |
|---|---|---|
| /execute | dev (fresh per BUG-0006) | {phase_id:execute, role:dev} |
| /qa | qa (fresh) | {phase_id:qa, role:qa} — ultra_lean may overwrite plan-verify.json inside build+verify |
| /verify-work | qa (fresh) | {phase_id:verify-work, role:qa} |
| /release | release (fresh) | {phase_id:release, role:release} |
| /closure | qe (fresh) | {phase_id:closure, role:qe} |
| /refresh-context | curator (fresh) | {phase_id:refresh-context, role:curator} |

## Isolation evidence (US-0048 / DEC-0029 / US-0104 v2)

| Field | Value |
|---|---|
| phase_id | sprint-plan |
| role | tech-lead |
| story_id | BUG-0021 |
| sprint_id | S0146 |
| orchestrator_run_id | auto-20260913-bug0021 |
| parent_orchestrator_run_id | cursor-20260913-BUG0021-intake |
| delivery_mode | ultra_lean |
| macro_phase | plan |
| fresh_context_marker | tl-BUG0021-sprintplan-20260913T124000Z-fresh |
| timestamp | 2026-09-13T12:40:00Z (UTC) |
| model_id | cursor-grok-4.6-high (CROSS_MODEL_REVIEW=1 — required) |
| model_resolve_fallback | MODEL_RESOLVE_FALLBACK (requested_slug=gpt-5.6-sol-high) |
| evidence_ref | sprints/S0146/sprint.md, tasks.md, progress.md, uat.json, uat.md, plan-verify.json (SKIPPED), handoffs/tl_to_dev.md, docs/engineering/state.md, handoffs/resume_brief.md, docs/product/backlog.md ### BUG-0021 sprint_plan_notes |

Prior phase proof consumed: `rp-auto-20260913-bug0021-architecture-techlead-20260913T121000Z-BUG-0021` / `7621D2D4FCE1EEB34FF8E41F8B26F6069E5D348833F8EEBEF8CD5210DE53A60B` — RUNTIME_PROOF_VALID (independent `compute_strict_proof_hash` MATCH, consumed 2026-09-13T12:40:00Z before TTL 2026-09-13T13:10:00Z). Sovereign-critic architecture PASS (`rp-auto-20260913-bug0021-sovereign-critic-techlead-20260913T123600Z-BUG-0021` / `83E7EEBC715167A882F8A5301DC8FBCB63610CAEEBFB1748A28EC830D127E2BE`; `tl-BUG0021-critic-architecture-20260913T123600Z-fresh`; anti_slop=10; 0 blocking; degraded_mode=false; findings `bug0021arc-*` informational — routed).

## Runtime proof (DEC-0038)

| Field | Value |
|---|---|
| runtime_proof_id | rp-auto-20260913-bug0021-sprint-plan-techlead-20260913T124000Z-BUG-0021 |
| phase_id | sprint-plan |
| role | tech-lead |
| story_id | BUG-0021 |
| sprint_id | S0146 |
| orchestrator_run_id | auto-20260913-bug0021 |
| delivery_mode | ultra_lean |
| macro_phase | plan |
| model_id | cursor-grok-4.6-high (CROSS_MODEL_REVIEW=1 — required) |
| proof_issued_at | 2026-09-13T12:40:00Z |
| proof_ttl_seconds | 3600 |
| proof_ttl | 2026-09-13T13:40:00Z (UTC) |
| proof_hash | 11A440144E6A2350DADBE1C2709BE6A2769E15D1074964211AD11CD7897423DD |
| canonical_payload | `{"orchestrator_run_id":"auto-20260913-bug0021","phase_id":"sprint-plan","proof_issued_at":"2026-09-13T12:40:00Z","proof_ttl_seconds":3600,"role":"tech-lead","runtime_proof_id":"rp-auto-20260913-bug0021-sprint-plan-techlead-20260913T124000Z-BUG-0021"}` |

Hash via `scripts.token_cost_lib.compute_strict_proof_hash` (positional, compact sorted-key JSON). Isolation extras (not hashed): `delivery_mode=ultra_lean`, `macro_phase=plan`, `model_id=cursor-grok-4.6-high`, `model_resolve_fallback=MODEL_RESOLVE_FALLBACK`, `requested_slug=gpt-5.6-sol-high`, `sprint_id=S0146`, `story_id=BUG-0021`. hash_recompute_confirmation=true (compute_strict_proof_hash → 11A440144E6A2350DADBE1C2709BE6A2769E15D1074964211AD11CD7897423DD).

## Decision gate

| Field | Value |
|---|---|
| decision_gate | false |
| stop_conditions_met | yes |
| missing_acceptance_criteria | none (10/10 slices + primary acceptance row covered, 8 contract-test markers) |
| task_count | 8 (within SPRINT_MAX_TASKS=12, SPRINT_AUTO_SPLIT=1 but no split needed, 1:1 seeds, not /quick, not --bulk) |
| risks_finalized | 8/8 ACCEPTED (R1..R8) |
| approach | Axis A locked |
| companion_DEC | none |
| plan-verify readiness | ultra_lean — plan-verify NOT in resolved_phase_plan, skipped, plan-verify.json is a SKIPPED placeholder |
| sovereign_memory_note | assemble_sovereign_memory_digest(...) NOT called |

## Definition of done (sprint-plan)

- [x] 8 tasks enumerated (T-anch + T-001..T-007) — within SPRINT_MAX_TASKS=12, 1:1 from architecture seeds
- [x] 10/10 ACs surjective + primary acceptance.md BUG-0021 covered
- [x] All 8 `test_bug0021_*` mapped (m7 T-007, m8 T-006; T-005 owns all eight)
- [x] Task dependency graph documented
- [x] Execute phase role matrix documented (ultra_lean — /plan-verify skipped, next = sovereign-critic then /execute)
- [x] Compose guards UNCHANGED
- [x] Critic carry-ins (3 non-blocking from architecture sovereign-critic) routed as execute awareness, sprint id locked S0146
- [x] Isolation evidence + runtime proof emitted (model_id=cursor-grok-4.6-high present)
- [x] Sprint-plan checkpoint appended to docs/engineering/state.md
- [x] Sprint-plan handoff prepended to handoffs/tl_to_dev.md
- [x] Sprint-plan PASS prepended to handoffs/resume_brief.md (→ sovereign-critic then /execute, not plan-verify)
- [x] UAT placeholders written (uat.json empty steps, uat.md ACs no results)
- [x] Traceability row added (Story=BUG-0021, Sprint=S0146, Tasks=T-anch+T-001..T-007, Status=PLANNED, Evidence empty)
- [x] Backlog status OPEN (US-0045 — not mutated), acceptance unchecked, sprint_plan_notes appended
- [x] plan-verify.json SKIPPED placeholder (not a QA phase)

## Next scheduled phase

| Field | Value |
|---|---|
| next_scheduled_phase | sovereign-critic (sprint-plan, CROSS_MODEL_REVIEW=1) then /execute (role=dev per US-0069 / DEC-0051, fresh dev subagent per BUG-0006, first canonical phase of build+verify macro per ultra_lean, plan-verify NOT in resolved_phase_plan — skipped) |
| next_scheduled_role | tech-lead (critic of sprint-plan), then dev |
| next_sprint_macro | build+verify (ultra_lean — plan-verify skipped at this boundary) |
| stop_condition | STOP after sprint-plan completes, hand off via artifacts only. Orchestrator MUST spawn sovereign-critic of sprint-plan then /execute in fresh dev subagent per BUG-0006. Do not spawn /execute, /plan-verify, or critic from this subagent. |
