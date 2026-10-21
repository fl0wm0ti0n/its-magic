# Sprint S0180 — BUG-0036 repairable `/auto` blockers

## Metadata

| Field | Value |
|---|---|
| sprint_id | **S0180** (`sprints/S0180/` was free; S0176 is BUG-0028; S0177 is BUG-0026; S0178 is BUG-0029; S0179 is US-0162; none reused) |
| bug_id | BUG-0036 — **OPEN**; AC-1..AC-5 unchecked |
| story_id | (none) |
| status | QA_PASS |
| current_phase | qa complete; verify-work not started |
| delivery_mode | ultra_lean; plan-verify is skipped (`ultra_lean_not_in_resolved_phase_plan`) |
| research_anchor | **R-0170** approach **A1** |
| architecture_anchor | `docs/engineering/architecture.md` `# BUG-0036` |
| companion_DEC | **none** |
| milestone | none owns BUG-0036; DEC-0009 activation does not apply |
| task_count | 7 (T-anch + T-001..T-006; `SPRINT_MAX_TASKS=12` from `.cursor/scratchpad.md`; `.cursor/scratchpad.local.md` has no override; `SPRINT_AUTO_SPLIT=1`; 7 is under the cap, so split is not triggered; not `/quick`) |
| component_scope | `COMPONENT_SCOPE_MODE=0` (no required scope metadata) |
| user_guide | `USER_GUIDE_MODE=0` (no user-guide task) |
| fresh_context_marker | `tl-BUG0036-sprintplan-20261016T193237Z-fresh` |

## Goal

`/auto` treats this class of blocker as repairable when `AUTONOMY_STOP_POLICY` is `auto_repair_then_block` or `auto_repair_then_skip`, and keeps the same members terminal when the live value is `block`. The class sits beside the stop matrix. It adds no YAML row.

The design is locked by R-0170 and `# BUG-0036`. This sprint does not re-decide it.

## Scope

### In scope (execute)

1. T-anch baseline: BUG-0036 stays OPEN, AC-1..AC-5 stay unchecked, and the helper, contract file, and matrix overlay are still absent.
2. T-001: predicate helper and `AUTONOMY_STOP_POLICY` dispatch (AC-1, AC-3).
3. T-002: foreign-harness quarantine without foreign-owner edits (AC-1, AC-2).
4. T-003: expired-proof child spawn; parent stays non-author; `RESUME_BRIEF_AUTO_REFRESH` stays 0 (AC-2).
5. T-004: fail-closed predicates and the US-0092 deny list (AC-5).
6. T-005: `test_bug0036_*` contract tests (AC-4).
7. T-006: active and template command plus matrix overlay (AC-1..AC-5).

### Out of scope

- No work outside T-anch and T-001..T-006. BUG-0036 stays OPEN. AC-1..AC-5 stay unchecked.
- Do not author a companion DEC. Do not edit `docs/engineering/decisions.md`. DEC-0119, DEC-0153, and DEC-0078 stay accepted and unamended.
- Do not add a YAML row. `scripts/data/autonomy_stop_matrix.yaml` stays unchanged. `RESUME_BRIEF_STALE` stays `security_hard`, `auto_repair_kind=n/a`, cap 0. `execute_harness_blocked_out_of_scope` stays out of the YAML.
- Do not call `resolve_matrix_repair` or `attempt_repair` for this class.
- Do not add a scratchpad key. Live `AUTONOMY_STOP_POLICY=block` stays. `RESUME_BRIEF_AUTO_REFRESH` stays 0. `.cursor/scratchpad.md` and `template/.cursor/scratchpad.md` stay unchanged.
- Do not edit BUG-0026, BUG-0029, or US-0162. Do not tick US-0162 acceptance. Do not clear the foreign harness by editing scratchpad drain flags or the README.
- The spawn-only parent writes neither `state.md` nor `handoffs/resume_brief.md`. The repair child does not call `write_resume_pair`.
- `.env` reads, npm publish, and git push stay outside this class at every policy value.
- Do not tick AC-1..AC-5. Do not flip BUG-0036 to DONE. Closure owns that flip.
- No git commit, push, npm publish, `/execute`, or `/plan-verify` from this phase.

## Acceptance coverage

| AC | Tasks |
|---|---|
| AC-1 | T-001, T-002, T-006 (repair value continues the flow; `block` stays terminal) |
| AC-2 | T-002, T-003 (foreign harness, `execute_harness_blocked_out_of_scope`, expired-proof `RESUME_BRIEF_STALE`) |
| AC-3 | T-001 (`block`, `auto_repair_then_block`, `auto_repair_then_skip` on the existing key) |
| AC-4 | T-005 (seven `test_bug0036_*` markers) |
| AC-5 | T-004, T-005 (predicate plus repair descriptor; synthetic later member; US-0092 deny) |

T-anch records the baseline for every AC and changes no product code. Every AC has a task. Tasks are the seven architecture seeds. No split: 7 tasks, cap 12.

## Risks

- A repair value also enables older autonomy-resolvable repairs. That is the existing meaning of `AUTONOMY_STOP_POLICY`.
- The overlay can be read as a softened `security_hard` row. The YAML row stays `n/a` and cap 0, and the helper never calls `resolve_matrix_repair` for these members.
- An expired-proof repair can be read as a parent write. The parent only spawns. The child appends `state.md` at the bottom, then prepends the brief.
- A foreign-harness repair can be read as an edit to BUG-0029 or the drain flags. The quarantine row records the owner and leaves those files unchanged.
- Skip can be read as applying to a bad pair or a US-0092 deny. Those predicates are outside the class.
- A later stop can be read as joining a two-name list. Membership is the four-part predicate plus a repair descriptor.
- `write_resume_pair` prepends state. The repair child does not call it.
- A scratchpad edit would break template byte parity. This sprint leaves both scratchpads unchanged.
- The cap is three attempts per `(orchestrator_run_id, member)`, then block or skip.

## Plan-verify

Ultra-lean skips plan-verify (`ultra_lean_not_in_resolved_phase_plan`). The sprint-plan command creates `plan-verify.json` after `/plan-verify`. That phase is not in the resolved plan, so this phase does not write that file and does not spawn `/plan-verify`.

## Proof

- Consumed architecture proof `rp-auto-20261016-bug0036-architecture-techlead-20261016T192539Z-BUG-0036` / `b32bdd07a7efcb148e99e129db6663694082c69e961f89eb25392775db1e1894` MATCH and in TTL at planning (issued 2026-10-16T19:25:39Z, ttl 2026-10-16T20:25:39Z; recomputed 2026-10-16T19:32:37Z).
- `runtime_proof_id=rp-auto-20261016-bug0036-sprint-plan-techlead-20261016T193237Z-BUG-0036`
- `proof_hash=63d3966f5c8d4f5aa9e65d373a73757a12803bfc7f44692cbdd647a3e7d932fb`
- `proof_issued_at=2026-10-16T19:32:37Z`; `proof_ttl=2026-10-16T20:32:37Z`
- Canonical tuple: `{"orchestrator_run_id":"auto-20261016-bug0036","phase_id":"sprint-plan","proof_issued_at":"2026-10-16T19:32:37Z","proof_ttl_seconds":3600,"role":"tech-lead","runtime_proof_id":"rp-auto-20261016-bug0036-sprint-plan-techlead-20261016T193237Z-BUG-0036"}`
- `hash_recompute_confirmation=true` (second invocation MATCH)
- `model_id=inherit`; `model_provenance=provenance=host=cursor;path=.cursor/scratchpad.local.md;step=MODEL_TIER_<PHASE>`
