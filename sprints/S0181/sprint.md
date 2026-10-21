# Sprint S0181 — US-0157 OpenCode critic hook and owning-child pair repair

## Metadata

| Field | Value |
|---|---|
| sprint_id | **S0181** (`sprints/S0181/` was free; S0176 is BUG-0028; S0177 is BUG-0026; S0178 is BUG-0029; S0179 is US-0162; S0180 is BUG-0036; none reused) |
| story_id | US-0157 — **OPEN**; AC-1..AC-5 unchecked |
| bug_id | (none) |
| status | QA_PASS (story stays OPEN) |
| current_phase | qa complete; verify-work not started |
| delivery_mode | ultra_lean; plan-verify is skipped (`ultra_lean_not_in_resolved_phase_plan`) |
| research_anchor | **R-0171** approach **A1** |
| architecture_anchor | `docs/engineering/architecture.md` `# US-0157` |
| companion_DEC | **none** |
| milestone | none owns US-0157; DEC-0009 activation does not apply |
| task_count | 8 (T-anch + T-001..T-007; `SPRINT_MAX_TASKS=12` from `.cursor/scratchpad.md`; `.cursor/scratchpad.local.md` has no override; `SPRINT_AUTO_SPLIT=1`; 8 is under the cap, so split is not triggered; not `/quick`) |
| component_scope | `COMPONENT_SCOPE_MODE=0` (no required scope metadata) |
| user_guide | `USER_GUIDE_MODE=0` (no user-guide task) |
| fresh_context_marker | `tl-US0157-sprintplan-20261016T212316Z-fresh` |

## Goal

When `CROSS_MODEL_REVIEW=1`, OpenCode `/auto` spawns a fresh tech-lead for `/sovereign-critic` and does not stop because a critic Task role is missing. The phase child that already owns an invalid continuation pair may repair only that pair. The parent stays read-only. Hard security denies stay hard stops.

The design is locked by R-0171 and `# US-0157`. This sprint does not re-decide it.

## Scope

### In scope (execute)

1. T-anch baseline: US-0157 stays OPEN, AC-1..AC-5 stay unchecked, and the OpenCode critic command plus the owning-child repair helper are still the current gaps.
2. T-001: tech-lead mapping text and the byte-identical OpenCode sovereign-critic command (AC-1).
3. T-002: hook spawn uses `tech-lead` and does not emit `PHASE_ROLE_CAPABILITY_MISSING` for a missing critic role (AC-1).
4. T-003: owning-child pair repair; state append at the bottom, then brief prepend; not `write_resume_pair` (AC-2).
5. T-004: parent stays read-only; `RESUME_BRIEF_AUTO_REFRESH` stays 0 (AC-3).
6. T-005: security-hard denies, a real capability miss, and the BUG-0036 `expired_ttl` boundary (AC-4).
7. T-006: `test_us0157_*` contract tests (AC-5).
8. T-007: active and template parity for the OpenCode pairs.

### Out of scope

- No work outside T-anch and T-001..T-007. US-0157 stays OPEN. AC-1..AC-5 stay unchecked.
- Do not author a companion DEC. Do not edit `docs/engineering/decisions.md`. DEC-0153, DEC-0152, and DEC-0051 stay as accepted.
- Do not add a `critic` or `sovereign-critic` Task role. Do not change `PHASE_ROLE_MATRIX`.
- Do not edit `scripts/repairable_blocker_lib.py`, `scripts/data/autonomy_stop_matrix.yaml`, or `test_bug0036_*`.
- Do not call `write_resume_pair`. Do not set `RESUME_BRIEF_AUTO_REFRESH`. Live `AUTONOMY_STOP_POLICY=block` stays.
- Do not change `.cursor/scratchpad.md` or `template/.cursor/scratchpad.md`.
- Do not reopen or edit US-0162, BUG-0026, BUG-0029, or BUG-0036. Do not reopen S0176, S0177, S0178, S0179, or S0180.
- Do not tick AC-1..AC-5. Do not flip US-0157 to DONE. Closure owns that flip.
- Do not read `.env`. No git commit, push, npm publish, `/execute`, or `/plan-verify` from this phase.

## Acceptance coverage

| AC | Tasks |
|---|---|
| AC-1 | T-001, T-002 (mapping and command; hook spawn uses tech-lead; missing critic role does not emit `PHASE_ROLE_CAPABILITY_MISSING`) |
| AC-2 | T-003 (owning child repairs only its own invalid pair, then the flow can continue) |
| AC-3 | T-004 (parent validates only; it does not write `state.md` or `handoffs/resume_brief.md`) |
| AC-4 | T-005 (hard security denies, a real missing allowlisted role, and `expired_ttl` stay outside this repair) |
| AC-5 | T-006 (four `test_us0157_*` markers) |

T-anch records the baseline for every AC and changes no product code. T-007 keeps each OpenCode active/template pair byte-identical. Every AC has a task. Tasks are the eight architecture seeds. No split: 8 tasks, cap 12.

## Risks

- The hook can be read as a new role. The agent name stays `tech-lead` and no permission key is added.
- The command file can be read as a new agent. Front matter stays `agent: tech-lead`.
- The child can repair another writer's pair. Identity match is required, otherwise the parent stops.
- The repair spawn can be treated as the next phase while the pair is invalid. It repeats the same `completed_phase`, and the next phase waits for a valid pair.
- `PHASE_ROLE_CAPABILITY_MISSING` can be softened. The YAML row stays, and a real missing allowlisted role still emits it.
- `expired_ttl` can gain a second repair path. That predicate stays excluded and BUG-0036 files are not edited.
- `write_resume_pair` prepends state. The repair child does not call it.
- Active and template copies can drift. T-007 keeps each listed pair byte-identical.
- A ninth task would trigger `SPRINT_AUTO_SPLIT`. This plan stays at eight.

## Plan-verify

Ultra-lean skips plan-verify (`ultra_lean_not_in_resolved_phase_plan`). The sprint-plan command creates `plan-verify.json` after `/plan-verify`. That phase is not in the resolved plan, so this phase does not write that file and does not spawn `/plan-verify`.

## Proof

- Consumed architecture proof `rp-auto-20261016-us0157-architecture-techlead-20261016T211603Z` / `1bd00ae1d115cf23c14bd2a150db0d7fca7cece6415c664cb5dd686ef9534628` MATCH and in TTL at planning (issued 2026-10-16T21:16:03Z, ttl 2026-10-16T22:16:03Z; recomputed 2026-10-16T21:23:16Z).
- `runtime_proof_id=rp-auto-20261016-us0157-sprint-plan-techlead-20261016T212316Z`
- `proof_hash=cbfd2b9892228d1a1a4ab2cd3d39d3c2d3769db92b3b7a114611e3a167c0e125`
- `proof_issued_at=2026-10-16T21:23:16Z`; `proof_ttl=2026-10-16T22:23:16Z`
- Canonical tuple: `{"orchestrator_run_id":"auto-20261016-us0157","phase_id":"sprint-plan","proof_issued_at":"2026-10-16T21:23:16Z","proof_ttl_seconds":3600,"role":"tech-lead","runtime_proof_id":"rp-auto-20261016-us0157-sprint-plan-techlead-20261016T212316Z"}`
- `hash_recompute_confirmation=true`
- `model_id=inherit`; `model_provenance=provenance=host=cursor;path=.cursor/scratchpad.local.md;step=MODEL_TIER_<PHASE>`
