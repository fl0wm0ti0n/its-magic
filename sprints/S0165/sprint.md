# Sprint S0165 — BUG-0035 phase-child-owned paired continuation repair

## Metadata

| Field | Value |
|---|---|
| sprint_id | **S0165** (new and locked; S0164 is BUG-0031) |
| bug_id | BUG-0035 — **OPEN**, P0; all seven acceptance criteria remain unchecked |
| status | PLANNED |
| current_phase | sprint-plan complete |
| delivery_mode | ultra_lean |
| approach | A1 (A*) — completed canonical phase child writes a state-first, exact, paired continuation record; spawn-only parent remains read/validate/spawn-only |
| research_anchor | R-0157 |
| architecture_anchor | `docs/engineering/architecture.md` `# BUG-0035` |
| companion_DEC | **DEC-0153 Accepted** (required normative writer/permission contract) |
| task_count | 8 (T-anch + T-001..T-007; within `SPRINT_MAX_TASKS=12`) |
| plan-verify | skipped — ultra_lean plan; no planning-phase QA spawn |
| fresh_context_marker | `tl-BUG0035-sprintplan-20261003T230038Z-fresh` |

## Goal and locked design

Repair the research-to-architecture continuation ownership deadlock without weakening
fail-closed behavior. The completed, canonical phase child alone receives the exact
additional permission `"handoffs/resume_brief.md": allow`; it first persists its
canonical state record, validates the matching continuation tuple, then atomically
updates the resume latest-pointer block. The parent remains permanently edit-denied.

The pair key is exactly
`orchestrator_run_id|work_item_kind|bug_id|completed_phase|runtime_proof_id`.
Both records must match on writer/role, resolution source, effective plan,
skipped/completed phases, next phase/role, cursor, budget, stop reason, fresh marker,
and every strict-proof field. Exact canonical replay is a no-op. Any changed same-key
field, reused proof/marker/session, missing or malformed side, conflict, invalid proof,
or unauthorized writer stops with `RESUME_BRIEF_STALE` (syntax only:
`RESUME_BRIEF_UNPARSEABLE`). No state fallback, parent repair, reconciler, next spawn,
or `RESUME_BRIEF_AUTO_REFRESH=0` bypass is allowed.

## Scope

### In scope

1. The single exact active/template tech-lead permission allow with deny-first ordering
   and byte parity; the auto parent stays `edit: deny`.
2. A state-first continuation-pair writer/validator at the canonical auto-bridge
   delivery surface, with active/template parity and deterministic validation.
3. Existing paired continuation instructions only: OpenCode/Cursor research,
   architecture, and auto command surfaces plus the auto-orchestration reference.
4. Active/template runbook remediation explaining failed-predicate preservation and
   fresh-authorized-child recovery.
5. Fixture/mock-only `test_bug0035_*` coverage for the seven architecture groups.

### Out of scope / standing guards

- No broad `handoffs/**`, wildcard, all-role, parent, or JSON-template permission grant.
- Do not change `auto.md` ownership so the parent writes artifacts; do not add a
  parent-owned or independent bridge writer, autonomous reconciler, state fallback,
  TUI/RPC/localhost surface, config or
  scratchpad change.
- Do not mutate BUG-0035 status, backlog ACs, or the acceptance row; closure remains
  the only canonical completion owner.
- BUG-0005, BUG-0034, DEC-0069, DEC-0038, DEC-0152, and US-0156 are compose-only.
- No live-host claim, npm publish, git push, `.env` read, `/auto` recursion, or child
  spawn from this plan or its implementation tests.

## Acceptance coverage

| Acceptance criterion | Planned task coverage |
|---|---|
| AC-1 authorized/auditable lawful phase-child pair | T-001, T-002, T-004, T-006 m1 |
| AC-2 least-privilege child; parent stays non-authoring | T-001, T-002, T-006 m2 |
| AC-3 deterministic pair consistency and reason-code failure | T-002, T-003, T-006 m3–m5 |
| AC-4 lawful research→architecture continuation can schedule architecture | T-002, T-004, T-006 m1 |
| AC-5 malformed/conflicting/unauthorized evidence remains fail-closed | T-002, T-003, T-006 m4–m6 |
| AC-6 success/deadlock/negative contract coverage | T-006, T-007 |
| AC-7 active/template alignment and operator remediation | T-001, T-004, T-005, T-007 |
| DC: architecture/DEC baseline and sibling integrity | T-anch |

All seven numbered criteria are covered; no `PLAN_AC_COVERAGE_GAP` exists.

## Task summaries and execution order

1. **T-anch** — Read-only verification of R-0157, `# BUG-0035`, DEC-0153, current
   parent/child maps, bridge, instruction pairs, and regression boundaries.
2. **T-001** — Add exactly the one tech-lead resume-brief allow in active and template
   maps; assert byte parity and deny-first placement.
3. **T-002** — Implement the state-first continuation-pair writer/validator at the
   canonical active bridge surface: exact tuple/key validation, atomic brief update,
   authorization/proof/marker checks, and no-op exact replay.
4. **T-003** — Mirror T-002 to the template bridge and preserve byte parity; prove all
   negative paths remain hard stops with the locked reason-code distinction.
5. **T-004** — Align the existing active/template OpenCode/Cursor research,
   architecture, and auto command instructions plus the auto-orchestration reference
   with the child-owned pair and parent read-only contract.
6. **T-005** — Add identical active/template runbook remediation: report the failed
   predicate and record key, preserve evidence, acquire a fresh authorized child, and
   independently re-resolve; prohibit hand edits, refresh, fallback, and spawn.
7. **T-006** — Author active fixture/mock contract tests with the seven named
   `test_bug0035_*` groups below.
8. **T-007** — Mirror tests into `template/`, assert all required active/template
   parity, and run BUG-0035 plus US-0156/BUG-0005 compose regressions and the bug
   validator.

## Test contract

`tests/bug0035_continuation_pair_test.py` and its byte-identical template mirror must
provide these seven groups (fixtures/mocks only; no live OpenCode claim):

1. `test_bug0035_lawful_child_pair_allows_architecture` — state-first lawful research
   pair yields the sole schedulable architecture continuation.
2. `test_bug0035_parent_remains_edit_denied` — parent cannot author state or brief;
   no broad role grant is introduced.
3. `test_bug0035_fresh_marker_and_strict_proof_required` — unique valid child marker
   and proof are required on both sides.
4. `test_bug0035_missing_or_malformed_pair_stops` — syntax maps to
   `RESUME_BRIEF_UNPARSEABLE`; absent-required evidence maps to
   `RESUME_BRIEF_STALE`; neither spawns.
5. `test_bug0035_tuple_conflict_stops` — differing same-key tuple values, phase/role,
   or next target are `RESUME_BRIEF_STALE` and cannot schedule.
6. `test_bug0035_unauthorized_replay_and_idempotence` — unauthorized writer, reused
   proof/marker/session, and changed replay stop; exact canonical replay is a no-op.
7. `test_bug0035_active_template_parity_and_runbook_remediation` — permission,
   bridge, instruction/reference, runbook, and test mirrors remain aligned and the
   remediation forbids fallback/hand-edit/auto-refresh.

## Completion gate

- [ ] One exact `handoffs/resume_brief.md` tech-lead allow exists in each parity map;
  broad deny remains before allows, and `auto` remains edit-denied.
- [ ] State is written before a fully validated, atomic brief update; incomplete pairs
  cannot continue.
- [ ] The exact key and all locked tuple/proof/isolation fields are validated.
- [ ] Only exact canonical replay is a no-op; all invalid, stale, conflict, reuse, and
  authorization cases fail closed without a spawn.
- [ ] The seven BUG-0035 contract groups and US-0156/BUG-0005 compose regressions pass.
- [ ] Active/template bridge, permissions, instructions/reference, runbook, and tests
  are byte-identical where paired.
- [ ] `python scripts/bug_issue_validate.py --repo . --check-acceptance` exits 0.
- [ ] BUG-0035 remains OPEN and all seven ACs remain unchecked pending lifecycle
  verification and closure.

## Next phase

`/execute` in a fresh **dev** context. The planning phase does not implement, spawn,
run plan-verify, alter status/acceptance, or authorize continuation by itself. **STOP.**
