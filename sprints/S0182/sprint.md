# Sprint S0182 — US-0158 OpenCode `/auto` recoverable stops

## Metadata

| Field | Value |
|---|---|
| sprint_id | **S0182** (`sprints/S0182/` was free; S0176 is BUG-0028; S0177 is BUG-0026; S0178 is BUG-0029; S0179 is US-0162; S0180 is BUG-0036; S0181 is US-0157; none reused) |
| story_id | US-0158 — **OPEN**; AC-1..AC-5 unchecked |
| bug_id | (none) |
| status | PLANNED (story stays OPEN) |
| current_phase | sprint-plan complete; execute not started |
| delivery_mode | ultra_lean; plan-verify is skipped (`ultra_lean_not_in_resolved_phase_plan`) |
| research_anchor | **R-0172** approach **A1** |
| architecture_anchor | `docs/engineering/architecture.md` `# US-0158` |
| companion_DEC | **none** |
| milestone | none owns US-0158; DEC-0009 activation does not apply |
| task_count | 8 (T-anch + T-001..T-007; `SPRINT_MAX_TASKS=12` from `.cursor/scratchpad.md`; `.cursor/scratchpad.local.md` has no override; `SPRINT_AUTO_SPLIT=1`; 8 is under the cap, so split is not triggered; not `/quick`) |
| component_scope | `COMPONENT_SCOPE_MODE=0` (no required scope metadata) |
| user_guide | `USER_GUIDE_MODE=0` (no user-guide task) |
| fresh_context_marker | `tl-US0158-sprintplan-20261016T225357Z-fresh` |

## Goal

OpenCode `/auto` continues the same run for exactly four recoverable classes: a blocker, an AI error, an aborted phase, and a permission dead-end. The operator is not asked to restart the session for those classes. Security-hard denies, quality and UAT failure, and exhausted budget stay terminal. The parent stays read-only.

The design is locked by R-0172 and `# US-0158`. This sprint does not re-decide it.

## Scope

### In scope (execute)

1. T-anch baseline: US-0158 stays OPEN, AC-1..AC-5 stay unchecked, and the four-class continue path is still the current gap.
2. T-001: optional `--recoverable-class` branch; an absent flag keeps today's JSON (AC-1).
3. T-002: lifecycle honors `continue_same_phase` once; no session-restart prompt (AC-1, AC-2).
4. T-003: abort-shaped wait, `ai_error`, and blocker subcode guards (AC-1).
5. T-004: permission dead-end keeps the seven roles and the US-0157 tech-lead hook (AC-1, AC-4).
6. T-005: security, quality, and budget stay terminal; parent write lock (AC-3, AC-4).
7. T-006: `test_us0158_*` contract tests (AC-5).
8. T-007: active and template parity.

### Out of scope

- No work outside T-anch and T-001..T-007. US-0158 stays OPEN. AC-1..AC-5 stay unchecked.
- Do not author a companion DEC. Do not edit `docs/engineering/decisions.md`. DEC-0153, DEC-0152, and DEC-0119 stay as accepted.
- Do not edit `scripts/data/autonomy_stop_matrix.yaml`. Do not add a `critic` or `sovereign-critic` Task role. Do not change `PHASE_ROLE_MATRIX`.
- Do not call `write_resume_pair`. Do not set `RESUME_BRIEF_AUTO_REFRESH`. Live `AUTONOMY_STOP_POLICY=block` stays.
- Do not change `.cursor/scratchpad.md` or `template/.cursor/scratchpad.md`.
- Do not reopen or edit US-0157, US-0162, BUG-0026, BUG-0029, or BUG-0036. Do not reopen S0176, S0177, S0178, S0179, S0180, or S0181.
- Do not tick AC-1..AC-5. Do not flip US-0158 to DONE. Closure owns that flip.
- Do not read `.env`. No git commit, push, npm publish, `/execute`, or `/plan-verify` from this phase.

## Acceptance coverage

| AC | Tasks |
|---|---|
| AC-1 | T-001, T-002, T-003, T-004 (optional class flag; one `continue_same_phase` respawn; abort, `ai_error`, and blocker guards; permission dead-end) |
| AC-2 | T-002 (agent and command text do not ask the operator to restart the session for the four classes) |
| AC-3 | T-005 (security-hard denies, including `.env` and secrets, stay `hard_stop`) |
| AC-4 | T-004, T-005 (seven roles and the US-0157 tech-lead hook stay; the parent does not write `state.md` or `handoffs/resume_brief.md`; `RESUME_BRIEF_AUTO_REFRESH` stays 0) |
| AC-5 | T-006 (six `test_us0158_*` markers) |

T-anch records the baseline for every AC and changes no product code. T-007 keeps each active/template pair byte-identical. Every AC has a task. Tasks are the eight architecture seeds. No split: 8 tasks, cap 12.

## Risks

- `continue_same_phase` can look like a softened `security_hard` row. YAML rows stay `n/a` and cap 0, and the guards force `hard_stop`.
- The optional flag can change today's JSON for `blocked` and `error`. The flag is opt-in, and an absent flag keeps the current branch.
- `next_phase === phaseId` can break the respawn. Only `continue_same_phase` skips that break.
- Abort-shaped wait can turn every wait failure into a continue. Only `AbortError`, `abort`, and `aborted` map to `phase_aborted`.
- A second failure can loop. One attempt per `(phaseId, class)`, then the original reason code.
- The parent can write a pair during the respawn. The decision fields stay false and `write_resume_pair` is not called.
- The permission class can add a role or a second critic spawn. Denied names are not added and the critic hook stays US-0157.
- `qa_fail` under `AUTO_IMPLEMENTATION_LOOP=1` can be swallowed. Those reasons are excluded.
- Active and template copies can drift. T-007 keeps each listed pair byte-identical.
- A ninth task would trigger `SPRINT_AUTO_SPLIT`. This plan stays at eight.

## Plan-verify

Ultra-lean skips plan-verify (`ultra_lean_not_in_resolved_phase_plan`). The sprint-plan command creates `plan-verify.json` after `/plan-verify`. That phase is not in the resolved plan, so this phase does not write that file and does not spawn `/plan-verify`.

## Proof

- Consumed architecture proof `rp-auto-20261016-us0158-architecture-techlead-20261016T224712Z` / `b547318d412148ac5216ba4bd6d7cd0b0ca226f536eb99dfa35cd83a68082b2f` MATCH and in TTL at planning (issued 2026-10-16T22:47:12Z, ttl 2026-10-16T23:47:12Z; recomputed 2026-10-16T22:53:57Z).
- `runtime_proof_id=rp-auto-20261016-us0158-sprint-plan-techlead-20261016T225357Z`
- `proof_hash=c6172727b50eecc9f46afe03ed6ab1434f3f75cf334fef51e8e7cf8998be9072`
- `proof_issued_at=2026-10-16T22:53:57Z`; `proof_ttl=2026-10-16T23:53:57Z`
- Canonical tuple: `{"orchestrator_run_id":"auto-20261016-us0158","phase_id":"sprint-plan","proof_issued_at":"2026-10-16T22:53:57Z","proof_ttl_seconds":3600,"role":"tech-lead","runtime_proof_id":"rp-auto-20261016-us0158-sprint-plan-techlead-20261016T225357Z"}`
- `hash_recompute_confirmation=true`
- `model_id=inherit`; `model_provenance=provenance=host=cursor;path=.cursor/scratchpad.local.md;step=MODEL_TIER_<PHASE>`
