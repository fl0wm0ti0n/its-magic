# Sprint S0148 - Sprint Plan (BUG-0023)

## Metadata

| Field | Value |
|---|---|
| bug_id | BUG-0023 |
| story_id | (none — bug segment) |
| story_title | OpenCode CLI TUI listed `/auto` toasts OPENCODE_AUTO_TUI_DISPATCH_UNSUPPORTED (dispatch live-falsified) |
| sprint_id | S0148 |
| delivery_mode | ultra_lean |
| macro_phase | plan (sprint-plan terminal; plan-verify NOT in resolved_phase_plan — skipped; next = sovereign-critic of sprint-plan then execute) |
| current_phase | sprint-plan |
| approach | Axis A locked (from R-0137 DQ1–DQ8; architecture critic NB1–NB3 CLOSED) |
| companion_DEC | none (cite R-0137; compose DEC-0124 / DEC-0125 / DEC-0120 / DEC-0132 / BUG-0018 A* / BUG-0019 E* / BUG-0021 Axis A listing; do not allocate a companion DEC) |
| research_anchor | R-0137 (DQ1–DQ8 LOCKED; compose R-0136 / R-0134 / R-0124; do not wipe; do not reuse R-0135 US-0140 or R-0138 US-0141) |
| architecture_anchor | docs/engineering/architecture.md # BUG-0023 |
| orchestrator_run_id | auto-20260913-bug0023 |
| parent_orchestrator_run_id | cursor-20260913-BUG0023-intake |
| fresh_context_marker | tl-BUG0023-sprintplan-20260914T001500Z-fresh |
| timestamp | 2026-09-14T00:15:00Z (UTC) |
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
| backlog_status | OPEN (US-0045 — not mutated; acceptance BUG-0023 unchecked) |
| sprint_id_lock | **S0148** is next free after S0147 (US-0140). Confirmed no S0148 folder existed before this spawn. Do not overwrite S0140–S0147. Do not reuse S0146 (BUG-0021) or S0147 (US-0140). US-0141 research expected S0148 is **superseded** — US-0141 increments at its own `/sprint-plan`. |
| critic_carry_ins | 0 new blocking; 3 architecture critic NBs `bug0023arc-*` status=resolved non-blocking — routed as awareness into /execute |

## Scope summary

Close the **CLI TUI dispatch residual** left after BUG-0021 Axis A listing: operator OpenCode CLI TUI (`opencode`, not `--pure`) **sees and invokes listed `/auto`**, then toasts title `its-magic /auto` / body **`OPENCODE_AUTO_TUI_DISPATCH_UNSUPPORTED`**. Lifecycle does **not** start (`runAutoLifecycle` not reached). Kit `dispatchRunAutoLifecycle` else-path: no usable `client.rpc(plain JSON).runAutoLifecycle` and invented HTTP `POST /rpc/its-magic.auto/runAutoLifecycle` `{ input }` failed or `client` missing. Orchestrator still `editor.add({ name: "auto", execute })` and optional non-awaited `ctx.rpc.register(plain JSON)` that swallows errors.

Distinct from **BUG-0021 DONE** (listing limb still true — do **not** reopen ACs / S0146), **BUG-0020 DONE** (desktop Command.Info), **BUG-0019 DONE** (tokens defined; live dispatch fail-closed is a **new** falsification), **BUG-0018 DONE** (do **not** restore `auto.md`), **BUG-0022 OPEN** (Cursor inherit — do **not** merge / drain).

**Approach Axis A**: share one branded `Rpc.define` contract (`its-magic.auto` / `runAutoLifecycle`); TUI `api.client.rpc(Defined)` with `OpenCode.make().rpc(Defined)` fallback; server **`await ctx.rpc.register(Defined, { runAutoLifecycle })`**. Keep `{ id, tui }` listing. Keep `editor.add`. Reject markdown/JSON template. Invented POST is **not** the happy path. Eight `test_bug0023_*` mock-invoke (not listing-only / not token-exists-only). Upgrade `--host opencode|both` **overwrites** dispatch-path on already-Axis-A trees and still **prunes** leftover `auto.md`. No companion DEC. `# BUG-0023` supersedes `# BUG-0021` / R-0134 DQ4 “listed `/auto` starts lifecycle” (historical bodies UNCHANGED). Listing remains `# BUG-0021`.

Out of scope: Cursor `/auto`; `--pure`; BUG-0022; US-0140+ / US-0141 mutate; reopen 0015–0021 ACs / S0146; Axis B/D/E/F; restore STOP-only `auto.md`; JSON `commands.auto` template; live OpenCode CLI TUI probe in default CI; companion DEC; rewrite `# BUG-0021` / `# BUG-0019`; marking BUG-0023 DONE; ticking acceptance; silent `localhost:4096`; top-level TUI `import "@opencode/plugin/rpc"`.

## Execute awareness (architecture critic NBs — 0 blocking)

Sovereign-critic of architecture PASS (`tl-BUG0023-critic-architecture-20260914T001000Z-fresh`; anti_slop=10; 0 blocking; degraded_mode=false). Consumed architecture proof MATCH before TTL. Route these resolved NBs as execute awareness — do not re-open them as work:

| Finding | Issue key | Execute awareness |
|---|---|---|
| `bug0023arc-challenger-001` | `ik_bug0023arc_proof_failclosed_pass` | **T-004/T-005/T-007**: DISPATCH is the defect, not success. Honest token only when client/RPC truly absent. Research `bug0023rsc-*` NB closures already locked in `# BUG-0023`. Do **not** treat DISPATCH toast as working fail-closed. |
| `bug0023arc-architect-002` | `ik_bug0023arc_layer_dispatch_rpc_ok` | Keep **T-anch..T-007 1:1** from architecture seeds; sprint folder is **S0148**; architecture owns H1+Axis A; execute owns shared `rpc.ts` + `await ctx.rpc.register` + `client.rpc(Defined)` / `OpenCode.make` fallback + 8 mock-invoke tests + overwrite. Keep `{ id, tui }` listing. Keep `editor.add`. No companion DEC. |
| `bug0023arc-subtractor-003` | `ik_bug0023arc_scope_yagni_pass` | T-anch ceremony overlap acceptable. Do not invent companion DEC / restore `auto.md` / JSON `commands.auto` / invented POST happy path / live CLI TUI probe / rewrite `# BUG-0021`. Do not mark BUG-0023 DONE. Do not reopen BUG-0021/0020/0019/0018. Do not mutate BUG-0022 / US-0141. 8 markers required. 8 tasks within SPRINT_MAX_TASKS=12. |

## Acceptance criteria (9 slices + primary acceptance row) — BUG-0023 (status OPEN, unchecked per US-0045)

Primary acceptance (`docs/product/acceptance.md` BUG-0023 row + backlog `expected`): Listed OpenCode CLI TUI `/auto` **starts** its-magic plugin `execute` / TUI `run()` → **`runAutoLifecycle`** so the phase→role chain begins (or fail-closes with a documented `OPENCODE_*` **only** when the host truly cannot dispatch). Must not be LLM “Auto mode enabled”. Must not restore STOP-only `auto.md`. Must not JSON `commands.auto`+`template`.

Architecture slices (surjective planning ACs from `# BUG-0023` AC coverage mapping):

- **AC-1**: Listed CLI TUI `/auto` starts `runAutoLifecycle` (Axis A `Rpc.define` + `client.rpc(Defined)` + await register) — T-001, T-002, T-003, T-005 (m1, m2, m4).
- **AC-2**: Fail-closed `OPENCODE_*` only when host truly cannot dispatch — T-004, T-005 (m6).
- **AC-3**: Must not restore STOP-only `auto.md` — T-anch, T-005 (m5).
- **AC-4**: Must not JSON-template `/auto` — T-005 (m5).
- **AC-5**: Plugin `editor.add` execute retained (compose BUG-0018 A*) — T-002, T-003, T-005 (m5).
- **AC-6**: Tests mock-invoke, not listing/token-only — T-005.
- **AC-7**: Consumer upgrade overwrites dispatch path + still prunes leftover `auto.md` — T-006, T-005 (m8).
- **AC-8**: Active↔template parity — T-007, T-005 (m7).
- **AC-9**: Invented POST `{ input }` is not the happy path — T-003, T-005 (m3).

## Task summaries (8 — T-anch + T-001..T-007)

- **T-anch** (NO-OP / verification): Verify `# BUG-0023` H1 + Axis A + R-0137 DQ1–DQ8 + `# BUG-0021` dispatch claim superseded + no companion DEC + do not rewrite `# BUG-0021` / `# BUG-0019`. Record to `sprints/S0148/t-anch-verification.md`. NO mutation to `architecture.md` / R-0137 in /execute.
- **T-001** (AC-1): Shared `Rpc.define` contract `rpc.ts` (active+template) `id: "its-magic.auto"` + `runAutoLifecycle`; JSON Schema; specifier `@opencode/plugin/rpc`. Tests: marker 1.
- **T-002** (AC-1, AC-5): `await ctx.rpc.register(Defined, { runAutoLifecycle })` when register exists; keep `editor.add`; drop plain-JSON / non-awaited swallow. Tests: marker 4 (+ m5 compose).
- **T-003** (AC-1, AC-5, AC-9): `dispatchRunAutoLifecycle` → dynamic-import Defined → `client.rpc(Defined).runAutoLifecycle(payload)` + `OpenCode.make` fallback; remove invented POST happy path; keep `{ id, tui }` listing. Tests: markers 2, 3.
- **T-004** (AC-2): DISPATCH honest only when client/RPC truly absent; do not reuse listing/load/desktop/markdown tokens. Tests: marker 6.
- **T-005** (AC-1..AC-9): Add 8 `test_bug0023_*` markers (mock invoke, not string-in-source only); no live OpenCode probe in default CI; do not weaken 0021/0020/0019/0018 except compose-only. Owns all 8 markers including m5 (`keep_editor_add_no_auto_md`).
- **T-006** (AC-7): Upgrade `--host opencode|both` **overwrites** dispatch path (`rpc.ts`/`tui.ts`/orchestrator) on Axis-A trees; still **prunes** leftover `auto.md`. Tests: marker 8.
- **T-007** (AC-8): Runbook CLI TUI dispatch recipe + `--pure` out + active↔template parity + `BUG0023_PAIRS`. Tests: marker 7.

**8-test surjection (architecture mapping kept; neither m7 nor m8 dropped):** T-001→m1; T-002→m4; T-003→m2+m3; T-004→m6; T-005→m1..m8 (including m5); T-006→m8; T-007→m7; T-anch→AC-3 (no auto.md restore). Architecture did **not** dump both remaining tests onto T-007 — m7 stays T-007, m8 stays T-006.

Execution order: T-anch → T-001 → T-002 → T-003 → T-004 → T-005 → T-006 → T-007 (acyclic; shared contract before register/dispatch; tokens before tests; overwrite before marker 8; docs/parity last). No split (8 ≤ 12). Not `/quick`.

## AC → Task surjective coverage

| AC | Task(s) |
|---|---|
| AC-1 (listed CLI TUI `/auto` starts `runAutoLifecycle`) | T-001, T-002, T-003, T-005 (m1, m2, m4) |
| AC-2 (fail-closed only when host cannot dispatch) | T-004, T-005 (m6) |
| AC-3 (no restore `auto.md`) | T-anch, T-005 (m5) |
| AC-4 (no JSON `commands.auto` template) | T-005 (m5) |
| AC-5 (plugin `editor.add` execute retained) | T-002, T-003, T-005 (m5) |
| AC-6 (tests mock-invoke, not listing/token-only) | T-005 |
| AC-7 (upgrade overwrite dispatch path + prune) | T-006, T-005 (m8) |
| AC-8 (active↔template parity) | T-007, T-005 (m7) |
| AC-9 (invented POST not happy path) | T-003, T-005 (m3) |
| DC / architecture baseline | T-anch |

**Surjectivity check**: 9/9 ACs covered (each AC ≥1 task) + primary acceptance.md BUG-0023 row covered by AC-1+AC-2+AC-3 aggregate. All 8 `test_bug0023_*` mapped. No `PLAN_AC_COVERAGE_GAP`. T-anch retained as verification-only.

## Locked 8-marker table (R-0137 / architecture Axis A)

1. `test_bug0023_rpc_define_shared_contract`
2. `test_bug0023_dispatch_mock_invokes_runAutoLifecycle`
3. `test_bug0023_http_fallback_is_client_rpc_not_invented_post`
4. `test_bug0023_orchestrator_await_register_defined_rpc`
5. `test_bug0023_keep_editor_add_no_auto_md`
6. `test_bug0023_dispatch_token_only_when_rpc_absent`
7. `test_bug0023_active_template_parity`
8. `test_bug0023_upgrade_copies_dispatch_still_prunes_auto_md`

Mock invoke / fixture only — **no live OpenCode CLI TUI probe** in default CI. Preferred file: `tests/bug0023_opencode_cli_tui_dispatch_rpc_test.py`. Do **not** weaken `test_bug0021_*` except compose-only comments that `"api.client.rpc" in src` is **not** dispatch proof. Keep `test_bug0020_*` / `test_bug0019_*` / `test_bug0018_*`.

## Risks (R1–R8 — accepted)

| Risk | Severity | Mitigation |
|---|---|---|
| R1 `{ id, tui }` `api.client` has no `.rpc` mixin | MEDIUM | T-003: DQ1 `OpenCode.make` fallback from connected `baseUrl`; DISPATCH only if both fail |
| R2 `@opencode/plugin/rpc` unresolved in file plugins | MEDIUM | T-001/T-003: dynamic import at dispatch time; specifier pinned; DISPATCH if define cannot load — **not** `auto.md` |
| R3 `test_bug0021_*` `"api.client.rpc"` string contract breaks | LOW | T-003: keep `api.client.rpc(Defined)` call site |
| R4 Operators treat DISPATCH toast as working fail-closed | LOW | T-004/T-005/T-007: D1/D9; runbook; mock-invoke tests |
| R5 US-0141 `/research` expected R-0137 / S0148 | LOW | Heading is BUG-0023; US-0141 continues at **R-0138**; this sprint **S0148** is BUG-0023 — US-0141 increments later |
| R6 Silent `localhost:4096` hits a different server | LOW | T-003: no silent default; require resolvable `baseUrl` |
| R7 Top-level rpc import skips `tui()` load | MEDIUM | T-003: dynamic import inside dispatch only |
| R8 Upgrade leaves plain-JSON `tui.ts` (copy-if-absent) | MEDIUM | T-006/T-005 m8: assert **overwrite** |

## Compose guards (UNCHANGED)

| Target | Result |
|---|---|
| `# BUG-0021` / R-0134 / S0146 | compose — do not rewrite historical bodies; dispatch claim superseded by `# BUG-0023`; listing remains `# BUG-0021` |
| `# BUG-0019` / R-0124 | compose — keep slashName / registerLayer extras |
| `# BUG-0018` / R-0120 / DEC-0124 / DEC-0125 | compose — `auto.md` stays absent; do not restore |
| `# BUG-0020` / R-0126 / S0140 | compose — desktop Command.Info not this bug |
| BUG-0015 / BUG-0016 / BUG-0017 DONE | do not reopen |
| BUG-0022 OPEN | not mutated |
| US-0140 / S0147 | not reused; not mutated |
| US-0141 (expected S0148 superseded) | not mutated; increments at its own `/sprint-plan` |
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
| story_id | BUG-0023 |
| sprint_id | S0148 |
| orchestrator_run_id | auto-20260913-bug0023 |
| parent_orchestrator_run_id | cursor-20260913-BUG0023-intake |
| delivery_mode | ultra_lean |
| macro_phase | plan |
| fresh_context_marker | tl-BUG0023-sprintplan-20260914T001500Z-fresh |
| timestamp | 2026-09-14T00:15:00Z (UTC) |
| model_id | cursor-grok-4.6-high (CROSS_MODEL_REVIEW=1 — required) |
| model_resolve_fallback | MODEL_RESOLVE_FALLBACK (requested_slug=gpt-5.6-sol-high) |
| evidence_ref | sprints/S0148/sprint.md, tasks.md, progress.md, uat.json, uat.md, plan-verify.json (SKIPPED), handoffs/tl_to_dev.md, docs/engineering/state.md, handoffs/resume_brief.md, docs/product/backlog.md ### BUG-0023 sprint_plan_notes |

Prior phase proof consumed: `rp-auto-20260913-bug0023-architecture-techlead-20260914T000500Z-BUG-0023` / `A565DE258312BA535F8CF4E9B00E8A17913E8F44960AC83097EC3C093997EF95` — RUNTIME_PROOF_VALID (independent `compute_strict_proof_hash` MATCH, consumed 2026-09-14T00:15:00Z before TTL 2026-09-14T01:05:00Z). Sovereign-critic architecture PASS (`rp-auto-20260913-bug0023-sovereign-critic-techlead-20260914T001000Z-BUG-0023` / `B6E305BCC4C02E091033550DC53E0446E6F908228819A59BB25AAC35F5906D53`; `tl-BUG0023-critic-architecture-20260914T001000Z-fresh`; anti_slop=10; 0 blocking; degraded_mode=false; findings `bug0023arc-*` informational — routed).

## Runtime proof (DEC-0038)

| Field | Value |
|---|---|
| runtime_proof_id | rp-auto-20260913-bug0023-sprint-plan-techlead-20260914T001500Z-BUG-0023 |
| phase_id | sprint-plan |
| role | tech-lead |
| story_id | BUG-0023 |
| sprint_id | S0148 |
| orchestrator_run_id | auto-20260913-bug0023 |
| delivery_mode | ultra_lean |
| macro_phase | plan |
| model_id | cursor-grok-4.6-high (CROSS_MODEL_REVIEW=1 — required) |
| proof_issued_at | 2026-09-14T00:15:00Z |
| proof_ttl_seconds | 3600 |
| proof_ttl | 2026-09-14T01:15:00Z (UTC) |
| proof_hash | 4ADB13DBEB1B57EF96301023AF423D4F71528AAFC0B005028F4E5231D8D80FF1 |
| canonical_payload | `{"orchestrator_run_id":"auto-20260913-bug0023","phase_id":"sprint-plan","proof_issued_at":"2026-09-14T00:15:00Z","proof_ttl_seconds":3600,"role":"tech-lead","runtime_proof_id":"rp-auto-20260913-bug0023-sprint-plan-techlead-20260914T001500Z-BUG-0023"}` |

Hash via `scripts.token_cost_lib.compute_strict_proof_hash` (positional, compact sorted-key JSON). Isolation extras (not hashed): `delivery_mode=ultra_lean`, `macro_phase=plan`, `model_id=cursor-grok-4.6-high`, `model_resolve_fallback=MODEL_RESOLVE_FALLBACK`, `requested_slug=gpt-5.6-sol-high`, `sprint_id=S0148`, `story_id=BUG-0023`. hash_recompute_confirmation=true (compute_strict_proof_hash → 4ADB13DBEB1B57EF96301023AF423D4F71528AAFC0B005028F4E5231D8D80FF1).

## Decision gate

| Field | Value |
|---|---|
| decision_gate | false |
| stop_conditions_met | yes |
| missing_acceptance_criteria | none (9/9 slices + primary acceptance row covered, 8 contract-test markers) |
| task_count | 8 (within SPRINT_MAX_TASKS=12, SPRINT_AUTO_SPLIT=1 but no split needed, 1:1 seeds, not /quick, not --bulk) |
| risks_finalized | 8/8 ACCEPTED (R1..R8) |
| approach | Axis A locked |
| companion_DEC | none |
| plan-verify readiness | ultra_lean — plan-verify NOT in resolved_phase_plan, skipped, plan-verify.json is a SKIPPED placeholder |
| sovereign_memory_note | assemble_sovereign_memory_digest(...) NOT called |

## Definition of done (sprint-plan)

- [x] 8 tasks enumerated (T-anch + T-001..T-007) — within SPRINT_MAX_TASKS=12, 1:1 from architecture seeds
- [x] 9/9 ACs surjective + primary acceptance.md BUG-0023 covered
- [x] All 8 `test_bug0023_*` mapped (m7 T-007, m8 T-006; T-005 owns all eight)
- [x] Task dependency graph documented
- [x] Execute phase role matrix documented (ultra_lean — /plan-verify skipped, next = sovereign-critic then /execute)
- [x] Compose guards UNCHANGED
- [x] Critic carry-ins (3 non-blocking from architecture sovereign-critic) routed as execute awareness, sprint id locked S0148
- [x] Isolation evidence + runtime proof emitted (model_id=cursor-grok-4.6-high present)
- [x] Sprint-plan checkpoint appended to docs/engineering/state.md
- [x] Sprint-plan handoff prepended to handoffs/tl_to_dev.md
- [x] Sprint-plan PASS prepended to handoffs/resume_brief.md (→ sovereign-critic then /execute, not plan-verify)
- [x] UAT placeholders written (uat.json empty steps, uat.md ACs no results)
- [x] Traceability row added (Story=BUG-0023, Sprint=S0148, Tasks=T-anch+T-001..T-007, Status=PLANNED, Evidence empty)
- [x] Backlog status OPEN (US-0045 — not mutated), acceptance unchecked, sprint_plan_notes appended
- [x] plan-verify.json SKIPPED placeholder (not a QA phase)

## Next scheduled phase

| Field | Value |
|---|---|
| next_scheduled_phase | sovereign-critic (sprint-plan, CROSS_MODEL_REVIEW=1) then /execute (role=dev per US-0069 / DEC-0051, fresh dev subagent per BUG-0006, first canonical phase of build+verify macro per ultra_lean, plan-verify NOT in resolved_phase_plan — skipped) |
| next_scheduled_role | tech-lead (critic of sprint-plan), then dev |
| next_sprint_macro | build+verify (ultra_lean — plan-verify skipped at this boundary) |
| stop_condition | STOP after sprint-plan completes, hand off via artifacts only. Orchestrator MUST spawn sovereign-critic of sprint-plan then /execute in fresh dev subagent per BUG-0006. Do not spawn /execute, /plan-verify, or critic from this subagent. |
