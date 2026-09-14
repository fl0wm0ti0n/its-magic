# Sprint S0135 - Sprint Plan (BUG-0017)

## Metadata

| Field | Value |
|---|---|
| bug_id | BUG-0017 |
| story_id | (none — bug segment) |
| story_title | OpenCode on Linux ignores its-magic slash commands (CRLF breaks YAML frontmatter) |
| sprint_id | S0135 |
| delivery_mode | ultra_lean |
| macro_phase | plan (sprint-plan terminal; /plan-verify merged into build+verify under QA per ultra_lean) |
| current_phase | sprint-plan |
| approach | A* locked (from R-0118 DQ1–DQ6; NB1–NB3 CLOSED) |
| companion_DEC | none (cite R-0118; compose BUG-0008 / US-0084 / DEC-0120) |
| research_anchor | R-0118 (DQ1–DQ6 LOCKED) |
| architecture_anchor | docs/engineering/architecture.md # BUG-0017 |
| orchestrator_run_id | auto-20260911-bug0017 |
| fresh_context_marker | tl-BUG0017-sprint-plan-20260911T192300Z-fresh |
| timestamp | 2026-09-11T19:23:00Z (UTC) |
| model_id | composer-2.5 (CROSS_MODEL_REVIEW=1 — required on isolation) |
| verdict | PASS |
| decision_gate | false |
| SPRINT_MAX_TASKS | 12 |
| SPRINT_AUTO_SPLIT | 1 |
| task_count | 8 (T-anch + T-001..T-007; within 12; no split; 1:1 from architecture seeds) |
| COMPONENT_SCOPE_MODE | 0 |
| USER_GUIDE_MODE | 0 |
| plan-verify | ultra_lean — merged into build+verify under QA; plan-verify.json NOT written here |
| backlog_status | OPEN (US-0045 — not mutated; acceptance BUG-0017 unchecked) |
| critic_carry_ins | 0 new blocking; 3 architecture critic NBs `bug0017arc-*` status=resolved non-blocking — routed as awareness into /execute (below) |

## Scope summary

Restore **Linux OpenCode recognition** of its-magic slash commands (`/auto`, `/intake`, peers) by shipping OpenCode pack text **LF-only**. Root cause: CRLF in `.opencode/commands/*.md` YAML frontmatter breaks OpenCode `parseOption` (empty → silent skip). Same failure class as **BUG-0008** (manifest CRLF), different surface (OpenCode pack markdown/TS/JSON).

**Approach A\***: Scoped `.gitattributes` LF for `.opencode/**` + `template/.opencode/**` `*.{md,ts,json}` + one-time scoped renormalize + extend `guard_installer_publish.py` OpenCode `\r` inventory + 6 `test_bug0017_*` + DQ6 runbook upgrade recipe + release/CI `guard:installer` before GitHub tag (choco path). Reuse `npm run guard:installer` / `prepublishOnly`. No install-time EOL rewrite. No companion DEC. No repo-wide `*.md eol=lf`. No host parser patch.

Out of scope: OpenCode host parser CR-strip; repo-wide `*.md eol=lf`; installer EOL rewrite-on-copy; sibling `guard_opencode_eol.py`; scanning operator-local `model-catalog.local.json`; reopening BUG-0015/BUG-0016; changing slash-command semantics; marking BUG-0017 DONE; ticking acceptance BUG-0017.

## Execute awareness (architecture critic NBs — 0 blocking)

Sovereign-critic of architecture PASS (`critic-BUG0017-architecture-20260911T192100Z-fresh`; anti_slop=10; 0 blocking). Route these resolved NBs as execute awareness — do not re-open them as work:

| Finding | Issue key | Execute awareness |
|---|---|---|
| `bug0017arc-challenger-001` | `ik_bug0017_arc_proof_a_star_pass` | **T-007**: choco/GitHub-zip before-tag must run extended `guard:installer`. **T-002**: scoped renormalize only. **T-006**: DQ6 upgrade recipe. Gap present pre-execute is expected. |
| `bug0017arc-architect-002` | `ik_bug0017_arc_layer_compose_ok` | Keep **T-anch..T-007 1:1** from architecture seeds; architecture owns H1+A* only; execute owns attrs/normalize/guard/tests; T-004/T-005 marker-6 overlap is intentional (parity + tests). |
| `bug0017arc-subtractor-003` | `ik_bug0017_arc_scope_yagni_pass` | T-anch ceremony overlap acceptable. Do not invent companion DEC / install rewrite / repo-wide `*.md` / host parser / sibling guard. Do not mark BUG-0017 DONE. 6 markers required. |

## Acceptance criteria (7 slices + primary acceptance row) — BUG-0017 (status OPEN, unchecked per US-0045)

Primary acceptance (`docs/product/acceptance.md` BUG-0017 row + backlog `expected`): OpenCode on Linux lists/recognizes its-magic slash commands from LF `.opencode/commands/*.md` (YAML frontmatter parses; commands not silently dropped) **and** shipped pack text has no CRLF (D9).

Architecture slices (surjective planning ACs from `# BUG-0017` AC coverage mapping):

- **AC-1**: Linux OpenCode recognizes `/auto`/`/intake`/peers (D1/D9) — attributes + normalize + no-CR pack + tests.
- **AC-2**: Shipped OpenCode pack has no CRLF (guard + normalize + tests).
- **AC-3**: Scoped `.gitattributes` only (DQ1) — no repo-wide `*.md text eol=lf` (marker 1).
- **AC-4**: Publish/CI fail-closed on `\r` (DQ2/DQ5; markers 4–5) + before-tag gate (NB1 / T-007).
- **AC-5**: Active ↔ template OpenCode tracked-text parity (D6; marker 6).
- **AC-6**: Consumer upgrade path documented (DQ6 / NB3) — `its-magic --mode upgrade --host opencode|both`.
- **AC-7**: Compose BUG-0008 / US-0084 unchanged (marker 5 regression) — no weaken of installer/manifest CRLF guards.

## Task summaries (8 — T-anch + T-001..T-007)

- **T-anch** (NO-OP / verification): Verify `# BUG-0017` H1 + approach A* + R-0118 DQ1–DQ6 + NB1–NB3 closed + no companion DEC + compose BUG-0008/US-0084/DEC-0120. Record to `sprints/S0135/t-anch-verification.md`. NO mutation to `architecture.md` / R-0118 in /execute.
- **T-001** (AC-1, AC-3): Add DQ1 `.gitattributes` rows for `.opencode/**` + `template/.opencode/**` `*.{md,ts,json}`; reject repo-wide `*.md`.
- **T-002** (AC-1, AC-2): One-time LF renormalize scoped trees only — `git add --renormalize -- .opencode template/.opencode` (NB2 dirty-tree policy).
- **T-003** (AC-1, AC-2, AC-4): Extend `scripts/guard_installer_publish.py` OpenCode `\r` inventory (DQ2/DQ5); keep BUG-0008/US-0084 checks unchanged.
- **T-004** (AC-5): Template mirror of guard + active↔template OpenCode tracked-text parity gate.
- **T-005** (AC-1..AC-5, AC-7): Add 6 `test_bug0017_*` markers; do not weaken BUG-0008/US-0084.
- **T-006** (AC-6): Runbook DQ6 upgrade recipe (`upgrade --host opencode|both`) + cross-link BUG-0017 (active + template).
- **T-007** (AC-4): Release/CI: `guard:installer` required before GitHub tag (choco zip path; NB1).

Execution order: T-anch → T-001 → T-002 → T-003 → T-004 → T-005 → T-006 → T-007 (acyclic; attrs before renormalize; guard before tests; docs/release last).

## AC → Task surjective coverage

| AC | Task(s) |
|---|---|
| AC-1 (Linux slash commands / D1+D9) | T-001, T-002, T-003, T-005 |
| AC-2 (no CRLF in shipped pack) | T-002, T-003, T-005 |
| AC-3 (scoped attrs only) | T-001, T-005 (marker 1) |
| AC-4 (publish/CI fail-closed + before-tag) | T-003, T-005 (markers 4–5), T-007 |
| AC-5 (active↔template parity) | T-004, T-005 (marker 6) |
| AC-6 (consumer upgrade recipe) | T-006 |
| AC-7 (compose BUG-0008/US-0084) | T-anch, T-005 (marker 5) |
| DC / architecture baseline | T-anch |

**Surjectivity check**: 7/7 ACs covered (each AC ≥1 task) + primary acceptance.md BUG-0017 row covered by AC-1+AC-2 aggregate. No `PLAN_AC_COVERAGE_GAP`. T-anch retained as verification-only.

## Locked 6-marker table (R-0118 / architecture)

1. `test_bug0017_gitattributes_scoped_opencode_eol_lf`
2. `test_bug0017_no_cr_in_active_opencode_pack_text`
3. `test_bug0017_no_cr_in_template_opencode_pack_text`
4. `test_bug0017_guard_installer_publish_rejects_opencode_cr`
5. `test_bug0017_guard_still_enforces_installer_sh_and_manifests`
6. `test_bug0017_active_template_opencode_tracked_text_parity`

Static/fixture only — **no live OpenCode CI probe**.

## Risks (R1–R6 — accepted)

| Risk | Severity | Mitigation |
|---|---|---|
| R1 Windows editors reintroduce CRLF | MEDIUM | T-001 attrs + T-003 guard |
| R2 npm ships template only — active drift | MEDIUM | T-004/T-005 marker 6 |
| R3 Consumers skip upgrade | MEDIUM | T-006 DQ6 runbook |
| R4 Choco tag without guard | MEDIUM | T-007 before-tag gate |
| R5 Dirty-tree renormalize churn | LOW–MEDIUM | T-002 scoped only (NB2) |
| R6 Over-scope node_modules / locals | LOW | Inventory excludes; gitignored locals unscanned |

## Compose guards (UNCHANGED)

| Target | Result |
|---|---|
| BUG-0008 / US-0084 | compose — extend guard; do not weaken |
| DEC-0120 | compose — upgrade path documented; no DEC body amend |
| DEC-0039 | compose — never overwrite locals |
| DEC-0132 | compose — example JSON vs operator local |
| BUG-0015 / BUG-0016 | DONE — do not reopen |
| US-0045 | Status stays OPEN |

## Execute phase role (per DEC-0051 / US-0069)

| Phase | Role | Isolation |
|---|---|---|
| /execute | dev (fresh per BUG-0006) | {phase_id:execute, role:dev} |
| /qa | qa (fresh) | {phase_id:qa, role:qa} — creates plan-verify.json within build+verify per ultra_lean |
| /verify-work | qa (fresh) | {phase_id:verify-work, role:qa} |
| /release | release (fresh) | {phase_id:release, role:release} |
| /closure | qe (fresh) | {phase_id:closure, role:qe} |
| /refresh-context | curator (fresh) | {phase_id:refresh-context, role:curator} |

## Isolation evidence (US-0048 / DEC-0029 / US-0104 v2)

| Field | Value |
|---|---|
| phase_id | sprint-plan |
| role | tech-lead |
| bug_id | BUG-0017 |
| story_id | BUG-0017 |
| sprint_id | S0135 |
| orchestrator_run_id | auto-20260911-bug0017 |
| delivery_mode | ultra_lean |
| macro_phase | plan |
| fresh_context_marker | tl-BUG0017-sprint-plan-20260911T192300Z-fresh |
| timestamp | 2026-09-11T19:23:00Z (UTC) |
| model_id | composer-2.5 (CROSS_MODEL_REVIEW=1 — required) |
| evidence_ref | sprints/S0135/sprint.md, sprints/S0135/tasks.md, sprints/S0135/progress.md, sprints/S0135/uat.json, sprints/S0135/uat.md, handoffs/tl_to_dev.md (BUG-0017 prepend), docs/engineering/state.md (sprint-plan checkpoint + traceability), docs/engineering/architecture.md # BUG-0017 (not mutated), handoffs/resume_brief.md |

Prior phase proof consumed: `rp-auto-20260911-bug0017-architecture-techlead-20260911T192000Z-BUG-0017` / `541A4773D0E994EE9FC1A0DD09E70DBE1D0B262170FB6D63540407CEBBD76B68` — RUNTIME_PROOF_VALID (MATCH before TTL 2026-09-11T20:20:00Z; consumed 2026-09-11T19:23:00Z). Sovereign-critic architecture PASS (`critic-BUG0017-architecture-20260911T192100Z-fresh`; anti_slop=10; 0 blocking; NBs routed).

## Runtime proof (DEC-0038)

| Field | Value |
|---|---|
| runtime_proof_id | rp-auto-20260911-bug0017-sprint-plan-techlead-20260911T192300Z-BUG-0017 |
| phase_id | sprint-plan |
| role | tech-lead |
| story_id | BUG-0017 |
| sprint_id | S0135 |
| orchestrator_run_id | auto-20260911-bug0017 |
| delivery_mode | ultra_lean |
| macro_phase | plan |
| model_id | composer-2.5 (CROSS_MODEL_REVIEW=1 — required) |
| proof_issued_at | 2026-09-11T19:23:00Z |
| proof_ttl_seconds | 3600 |
| proof_ttl | 2026-09-11T20:23:00Z (UTC) |
| proof_hash | 86620B9B243BE83D493E59BAF042EB1AFBFB02F84B996AA041CDDA34BB64CB6B |
| canonical_payload | `{"delivery_mode":"ultra_lean","macro_phase":"plan","model_id":"composer-2.5","orchestrator_run_id":"auto-20260911-bug0017","phase_id":"sprint-plan","proof_issued_at":"2026-09-11T19:23:00Z","proof_ttl_seconds":3600,"role":"tech-lead","runtime_proof_id":"rp-auto-20260911-bug0017-sprint-plan-techlead-20260911T192300Z-BUG-0017","sprint_id":"S0135","story_id":"BUG-0017"}` |

## Decision gate

| Field | Value |
|---|---|
| decision_gate | false |
| stop_conditions_met | yes |
| missing_acceptance_criteria | none (7/7 slices + primary acceptance row covered; 6 contract-test markers) |
| compose_guards | BUG-0008/US-0084/DEC-0120/BUG-0015/0016/US-0045 UNCHANGED |
| dc_check | clean (`# BUG-0017` H1 already added in /architecture) |
| task_count | 8 (within SPRINT_MAX_TASKS=12; SPRINT_AUTO_SPLIT=1 but no split needed; 1:1 seeds) |
| risks_finalized | 6/6 ACCEPTED (R1..R6) |
| approach | A* locked |
| companion_DEC | none |
| plan-verify readiness | ultra_lean — /plan-verify merged into build+verify under QA; plan-verify.json NOT written in this spawn |
| sovereign_memory_note | `assemble_sovereign_memory_digest(...)` NOT called; no mistakes.jsonl write |

## Definition of done (sprint-plan)

- [x] 8 tasks enumerated (T-anch + T-001..T-007) — within SPRINT_MAX_TASKS=12; 1:1 from architecture seeds
- [x] 7/7 ACs surjective + primary acceptance.md BUG-0017 covered
- [x] Task dependency graph documented
- [x] Execute phase role matrix documented (ultra_lean — /plan-verify merged into build+verify under QA)
- [x] Compose guards UNCHANGED
- [x] Critic carry-ins (3 non-blocking from architecture sovereign-critic) routed as execute awareness
- [x] Isolation evidence + runtime proof emitted (model_id=composer-2.5 present)
- [x] Sprint-plan checkpoint appended to `docs/engineering/state.md`
- [x] Sprint-plan handoff prepended to `handoffs/tl_to_dev.md`
- [x] Sprint-plan PASS prepended to `handoffs/resume_brief.md` (-> /execute)
- [x] UAT placeholders written (`uat.json` empty steps, `uat.md` ACs no results)
- [x] Traceability row added (Story=BUG-0017 | Sprint=S0135 | Tasks=T-anch+T-001..T-007 | Status=PLANNED | Evidence empty)
- [x] Backlog status OPEN (US-0045 — not mutated); acceptance unchecked; sprint_plan_notes appended

## Next scheduled phase

| Field | Value |
|---|---|
| next_scheduled_phase | `/execute` (role=dev per US-0069 / DEC-0051; fresh dev subagent per BUG-0006; first canonical phase of `build+verify` macro per ultra_lean; /plan-verify merged into qa per ultra_lean — qa creates plan-verify.json within build+verify). Orchestrator runs sovereign-critic of sprint-plan first (CROSS_MODEL_REVIEW=1). Do not mandate outer driver. |
| next_scheduled_role | dev |
| next_sprint_macro | build+verify (ultra_lean — plan-verify merged into qa) |
| stop_condition | STOP after sprint-plan completes; hand off via artifacts only. Orchestrator owns critic of sprint-plan then `/execute` in fresh dev subagent per BUG-0006. Do not spawn /execute or /plan-verify from this subagent. |
| artifacts_written | sprints/S0135/ (sprint.md, tasks.md, progress.md, uat.json, uat.md), docs/engineering/state.md (sprint-plan checkpoint + traceability), handoffs/tl_to_dev.md (BUG-0017 prepend), handoffs/resume_brief.md (sprint-plan PASS prepend -> /execute), docs/product/backlog.md (sprint_plan_notes append; Status OPEN) |
