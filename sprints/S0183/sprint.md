# Sprint S0183 — BUG-0038 QA continuation-brief permission repair

## Metadata

| Field | Value |
|---|---|
| sprint_id | **S0183** (`sprints/S0183/` was free; S0182 is US-0158; no sprint reused) |
| bug_id | BUG-0038 — **OPEN/P0**; AC-1..AC-5 unchecked |
| status | PLANNED (bug remains OPEN) |
| current_phase | sprint-plan planning is complete (SPRINT_PLAN_PASS); execute not started |
| delivery_mode | effective plan `[spec, plan, build+verify, ship]`; plan-verify is absent |
| research_anchor | **R-0173** approach **A1** |
| architecture_anchor | `docs/engineering/architecture.md` `# BUG-0038` |
| companion_DEC | none; DEC-0153 remains Accepted and unamended |
| task_count | 6 (T-anch + T-001..T-005; `SPRINT_MAX_TASKS=12`; under cap, no split; not `/quick`) |
| fresh_context_marker | `tl-BUG0038-sprintplan-20261018T142424Z-fresh` |

## Goal

Repair only the active/template QA maps with the existing-path
`handoffs/resume_brief.md` allow, so the shared QA writer can persist its
mandatory DEC-0153 brief at both `qa` and `verify-work` boundaries. Preserve
deny-first ordering, every denial/security-hard boundary, active/template byte
parity, and parent/orchestrator negative authority.

R-0173 A1 and `# BUG-0038` are binding; this sprint does not re-decide them.

## Scope

### In scope (execute)

1. T-anch records the BUG-0038 baseline and authority boundaries without product change.
2. T-001 applies exactly one narrow continuation-brief allow in the active QA map at the deny-first position (AC-1, AC-2).
3. T-002 mirrors that exact map to the template QA map and retains byte parity (AC-1, AC-2).
4. T-003 provides deterministic `PERMISSION_MATRIX_REPAIR_REQUIRES_OPERATOR` without a pair write, automatic repair, or scheduling (AC-5).
5. T-004 adds the five locked `test_bug0038_*` matrix/negative contract markers (AC-3, AC-4, AC-5).
6. T-005 verifies parity and unchanged parent/orchestrator authority, security-hard denials, DEC-0153 ordering, and `RESUME_BRIEF_AUTO_REFRESH=0` (AC-2, AC-3).

### Out of scope

- No work outside T-anch and T-001..T-005. BUG-0038 remains OPEN; AC-1..AC-5 and its acceptance row remain unchecked.
- No companion DEC and no `docs/engineering/decisions.md` edit. DEC-0153 remains accepted and unamended.
- Do not grant parent/orchestrator any continuation-pair, `state.md`, QA-map, matrix, or Task-allowlist write authority. Do not edit `PHASE_ROLE_MATRIX` or `TASK_ALLOWLIST`.
- Do not call `write_resume_pair`, enable `RESUME_BRIEF_AUTO_REFRESH`, use state fallback, or auto-repair a map. `RESUME_BRIEF_STALE` and security-hard denials stay fail-closed.
- Do not change commands, plugins, scratchpad/config, BUG-0035, BUG-0016, or unrelated work items. The inherited BUG-0035 runbook-token failure remains background only.
- Do not read secrets or `.env`; no commit, push, publish, `/auto`, `/plan-verify`, QA, release, or closure from sprint planning.

## Acceptance coverage

| AC | Tasks |
|---|---|
| AC-1 | T-001, T-002 (one QA allow in active/template maps for both QA-owned phases) |
| AC-2 | T-001, T-002, T-005 (deny-first, retained denials, byte parity) |
| AC-3 | T-004, T-005 (negative parent/orchestrator surface) |
| AC-4 | T-004 (matrix-derived pair-writing-role coverage in both trees) |
| AC-5 | T-003, T-004 (operator-only code/diagnostic with no pair write or scheduling) |

Every AC maps to tasks. The six architecture seeds are retained 1:1; no split
is required under the cap of 12.

## Risks and controls

- Broad handoff/all-role authority is forbidden: T-001/T-002 permit only the exact existing brief path, exactly once.
- Duplicate permission or template drift is blocked by exact-one, deny-first, retained-entry, and byte-parity assertions in T-004/T-005.
- A parent fallback violates DEC-0153: T-004/T-005 assert the parent/orchestrator remains negative.
- An unrepairable map must name both QA map paths and `handoffs/resume_brief.md`, write neither pair member, schedule nothing, and require authorized operator action.
- Security-hard denials, `RESUME_BRIEF_AUTO_REFRESH=0`, and `CROSS_MODEL_REVIEW=0` remain unchanged.

## 4-artifact denial — HONORED-NOT-FORCED (dev/qa-owned), NOT blocked

`sprints/S0183/sprint.md` and `sprints/S0183/tasks.md` are the only
tech-lead allow-listed sprint-plan deliverables (`.opencode/agents/tech-lead.md`
L14-L15). The 4 non-allow-listed sprint artifacts are **dev/qa-owned** per the
binding S0163/S0166 precedent (`handoffs/tl_to_dev.md` S0166;
`docs/engineering/state-archive/state-pack-20261010-d.md`), and their isolation-guard
denial is **honored, not forced** — it is **neither a decision_gate nor a blocking
condition**:

- `sprints/S0183/progress.md` — **dev-owned** (created at `/execute`); **NOT** a
  `/sprint-plan` deliverable.
- `sprints/S0183/uat.md` — **qa-owned** (created at `/qa`, ultra_lean merged).
- `sprints/S0183/uat.json` — **qa-owned** (created at `/qa`, ultra_lean merged).
- `sprints/S0183/plan-verify.json` — **qa-owned** (absent; plan-verify is not in
  the effective plan and is skipped).

This child wrote none of them and does not treat their absence as a blocker. The
plan is within the task cap, so `SPRINT_PLAN_PASS` is lawful and this repair
sustains it; the successor DEC-0153 state-first pair is persisted and `/execute`
is authorized.
