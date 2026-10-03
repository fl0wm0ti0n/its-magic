# Sprint S0162 — US-0156 OpenCode `/auto` parity

## Metadata

| Field | Value |
|---|---|
| sprint_id | S0162 |
| story_id | US-0156 |
| status | EXECUTED |
| current_phase | execute |
| delivery_mode | ultra_lean |
| approach | A1 (A*) — command-owned sequential fresh-Task lifecycle |
| research_anchor | R-0153 |
| architecture_anchor | `docs/engineering/architecture.md` `# US-0156` |
| companion_DEC | DEC-0152 Accepted |
| task_count | 10 (T-anch + T-001..T-009; <= SPRINT_MAX_TASKS=12) |
| plan-verify | skipped: ultra_lean; not in the resolved phase plan |

## Scope

Deliver the documented OpenCode Markdown-command `/auto` route as one scheduling-only parent lifecycle. It must resolve an eligible work item and one effective phase plan before each fresh role Task, use durable child evidence and the canonical Stop-Matrix to decide every boundary, and fail closed on invalid resolution, scheduling, policy, or provenance. The parent never performs phase artifact work itself.

The route remains `.opencode/commands/auto.md` with `agent: auto`. The retired TUI/RPC path stays retired. Explicit `bug-target` takes scheduler precedence; otherwise eligible OPEN stories are selected in dependency order when backlog drain is enabled. Direct manual phase persistence remains separate from `/auto` child completion.

## Acceptance coverage

| Acceptance criterion | Task coverage |
|---|---|
| AC-1 Native in-chat auto-chain | T-005, T-006, T-008 |
| AC-2 Continuous multi-phase loop | T-001, T-004, T-005, T-008 |
| AC-3 Backlog drain | T-003, T-004, T-005, T-008 |
| AC-4 Bug-queue targeting | T-003, T-008 |
| AC-5 Start-from/resume | T-001, T-002, T-004, T-008 |
| AC-6 Phase-selection policy | T-001, T-002, T-004, T-006, T-008 |
| AC-7 DoD and prerequisite boundaries | T-008, T-009 |
| AC-8 Normal-host parity and retired-route exclusion | T-005, T-007, T-008 |
| AC-9 Tests and release-pack evidence | T-008, T-009 |
| AC-10 Boundary and template parity | T-005, T-007, T-008, T-009 |
| Architecture baseline | T-anch |

All ten acceptance criteria are covered. US-0156 remains OPEN and its acceptance checkbox remains unchecked until the lifecycle closure owner acts.

## Task summaries

1. **T-anch** — Verify R-0153, DEC-0152, the BUG-0030 Markdown-command ownership boundary, and the completed BUG-0027 prerequisite. Confirm the remaining US-0156 DoD and all out-of-scope guards without editing status or acceptance artifacts.
2. **T-001** — Add typed, read-only continuation resolution and remove every `fallback_execute` branch in the OpenCode bridge/support path.
3. **T-002** — Implement validated `start-from` → `resume_brief` → `state.md` precedence, one effective-plan intersection, and the locked reason-coded failure outcomes.
4. **T-003** — Implement explicit bug-target selection, dependency-eligible OPEN-story drain selection, scheduler mutex, cursor, and cap accounting.
5. **T-004** — Consume typed Stop-Matrix continuation actions only and persist idempotent continuation provenance at phase and segment boundaries.
6. **T-005** — Extend active/template Markdown command and `auto` agent instructions into the finite sequential, fresh-Task-only parent algorithm; preserve the documented `agent: auto` route.
7. **T-006** — Keep `persistManualPhaseIsolation` distinct from `/auto` child evidence and integrate child isolation references without fabricating proof or allowing the parent to write phase artifacts.
8. **T-007** — Preserve deny-by-default by placing broad role-permission denies before specific owned-path and auto-Task allows; keep security read-only.
9. **T-008** — Add the architecture-owned `test_us0156_*` contracts, active/template parity, installer-overwrite coverage, and operator runbook guidance.
10. **T-009** — Run the targeted US-0156 suite and compose regressions for BUG-0027, BUG-0030, and permission policy; record evidence for QA without claiming desktop, `--pure`, or provider-complete execution.

## Locked reason codes and contracts

- New architecture-owned codes: `OPENCODE_AUTO_RESOLUTION_FAILED`, `OPENCODE_AUTO_RESUME_AMBIGUOUS`, `OPENCODE_AUTO_PHASE_PLAN_INVALID`, `OPENCODE_AUTO_CONTINUATION_CONFLICT`, and `OPENCODE_AUTO_DEPENDENCY_BLOCKED`.
- Reuse existing `AUTO_SCHEDULER_CONFLICT`, Stop-Matrix, proof, and cap codes; do not rename or weaken them.
- The required contracts are the nine markers in the architecture test contract: command ownership, sequential fresh Tasks, no fallback, precedence, scheduler/mutex, Stop-Matrix/caps, provenance idempotence, DoD/parity, and permission-specific paths overriding broad deny.

## Guards

- Do not restore TUI/RPC dispatch, `client.rpc`, `ctx.rpc.register`, JSON command templates, or an invented localhost endpoint.
- Do not recursively invoke `/auto`; do not let the parent edit phase artifacts or treat a completed child as permission to bypass Stop-Matrix.
- Do not weaken role isolation, quality/UAT/release gates, caps, secret boundaries, or manual-persistence failure behavior.
- Do not reopen BUG-0030 or BUG-0027; BUG-0022 remains a DoD prerequisite. BUG-0028 and BUG-0029 remain independently OPEN and must not be merged or closed by this story. BUG-0026 is out of scope.
- Do not claim Desktop Command.Info, `opencode --pure`, standalone `itsm`, live provider completion, npm publication, git push, or `.env` access.
- Do not mark US-0156 DONE or tick backlog/acceptance boxes during execute.

## Execution order

T-anch → T-001 → T-002 → T-003 → T-004 → T-005 → T-006 → T-007 → T-008 → T-009.

## Next phase

`/execute` complete (EXECUTE_PASS). A fresh `qa` context records QA findings before
verify-work / release / closure. US-0156 remains OPEN; its acceptance row stays
unchecked until the lifecycle closure owner acts.
