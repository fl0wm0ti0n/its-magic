# Sprint S0176 — BUG-0028 lightweight `itsm` commands

## Metadata

| Field | Value |
|---|---|
| sprint_id | **S0176** (expected by `# BUG-0028`; `sprints/S0176/` did not exist; S0175 is not reused) |
| bug_id | BUG-0028 — **OPEN**; AC-1..AC-5 unchecked |
| story_id | (none) |
| status | EXECUTE_PASS |
| current_phase | execute complete |
| delivery_mode | ultra_lean; plan-verify is skipped (`ultra_lean_not_in_resolved_phase_plan`) and is not authored this phase |
| research_anchor | **R-0166** |
| architecture_anchor | `docs/engineering/architecture.md` `# BUG-0028` |
| companion_DEC | **none** |
| milestone | none owns BUG-0028; DEC-0009 activation does not apply |
| task_count | 6 (T-anch + T-001..T-005; `SPRINT_MAX_TASKS=12`; `SPRINT_AUTO_SPLIT=1`; split not triggered; not `/quick`) |
| component_scope | `COMPONENT_SCOPE_MODE=0` (no required scope metadata) |
| user_guide | `USER_GUIDE_MODE=0` (no user-guide task) |
| fresh_context_marker | `tl-BUG0028-sprintplan-20261013T215051Z-fresh` |

## Goal

Classify help, local auth/models, and bare `status` before any static import of the workflow runner, and keep every other token on production `createRuntimeHost`.

The design is locked by R-0166 and `# BUG-0028`. This sprint does not re-decide it.

## Scope

### In scope (execute)

1. `command-class.ts` plus a dynamic dispatch in `index.ts`.
2. Bounded `status-snapshot.ts` for the bare `status` token.
3. `@its-magic/pi-kernel/auth-runtime` subpath for `auth list` / `auth login` / `auth logout` and `models test`.
4. Five `test_bug0028_*` markers.
5. Operator README parity for lightweight versus full-runtime commands.

### Out of scope

- This phase implements nothing.
- Do not merge BUG-0029. Login prompting stays BUG-0029.
- Do not change US-0150, US-0151, or US-0155. Do not mutate BUG-0026, US-0154, or US-0156.
- Do not edit `docs/engineering/decisions.md`.
- Do not add a second host, a stub kernel, or a `walkDocs` cache.
- Do not hand-edit `.its-magic/bin/itsm` or `itsm.cmd`.
- Do not add a wall-clock SLA. The contract is absence of the heavy graph.
- Do not flip BUG-0028 or tick AC-1..AC-5.
- Do not read `.env`. No publish, push, commit, `/auto`, `/execute`, or `/plan-verify`.

## Acceptance coverage

| AC | Tasks |
|---|---|
| AC-1 | T-001, T-003, T-004 |
| AC-2 | T-002, T-004 |
| AC-3 | T-001, T-004 |
| AC-4 | T-004 |
| AC-5 | T-004, T-005 |

All five ACs have a task. Tasks are 1:1 with the six architecture seeds. No split: 6 tasks, cap 12.

## Plan-verify

Ultra-lean skips plan-verify (`ultra_lean_not_in_resolved_phase_plan`). This phase does not write `sprints/S0176/plan-verify.json` and does not spawn `/plan-verify`.

## Proof

- Consumed architecture proof `rp-auto-20261013-bug0028-architecture-techlead-20261013T212410Z-BUG-0028` / `446431c17f61a431371e47e39429bd2efb64b27d1151b25557f191252d568de8` MATCH and in TTL at planning.
- `runtime_proof_id=rp-auto-20261013-bug0028-sprint-plan-techlead-20261013T215051Z-BUG-0028`
- `proof_hash=af927213740a84cd697ae2ddb964182e10289e88c2ab51fb081756c6c6d5ea35`
- `proof_issued_at=2026-10-13T21:50:51Z`; `proof_ttl=2026-10-13T22:50:51Z`
- Canonical tuple: `{"orchestrator_run_id":"auto-20261013-bug0028","phase_id":"sprint-plan","proof_issued_at":"2026-10-13T21:50:51Z","proof_ttl_seconds":3600,"role":"tech-lead","runtime_proof_id":"rp-auto-20261013-bug0028-sprint-plan-techlead-20261013T215051Z-BUG-0028"}`
- `hash_recompute_confirmation=true`
- `model_id=inherit`; `model_provenance=provenance=host=cursor;path=.cursor/scratchpad.local.md;step=MODEL_TIER_<PHASE>`
