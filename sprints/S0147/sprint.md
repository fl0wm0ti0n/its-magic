# Sprint S0147 - Sprint Plan (US-0140)

## Metadata

| Field | Value |
|---|---|
| story_id | US-0140 |
| bug_id | (none) |
| story_title | Canonical lifecycle and gate orchestrator |
| sprint_id | S0147 |
| delivery_mode | ultra_lean |
| macro_phase | plan (sprint-plan terminal, plan-verify NOT in resolved_phase_plan - skipped, next = sovereign-critic of sprint-plan then execute) |
| current_phase | sprint-plan |
| approach | A1 locked (from R-0135 DQ1-DQ10, DEC-0140 Accepted, architecture critic NB1-NB3 CLOSED) |
| companion_DEC | DEC-0140 (Accepted) |
| research_anchor | R-0135 (DQ1-DQ10 LOCKED, compose R-0132 / R-0130 / R-0129 / R-0128 / R-0122 / R-0121, do not wipe R-0120..R-0135) |
| architecture_anchor | docs/engineering/architecture.md # US-0140 |
| orchestrator_run_id | auto-20260913-us0140 |
| parent_orchestrator_run_id | auto-20260913-us0139 |
| fresh_context_marker | tl-US0140-sprintplan-20260913T211500Z-fresh |
| timestamp | 2026-09-13T21:15:00Z (UTC) |
| model_id | cursor-grok-4.6-high (CROSS_MODEL_REVIEW=1 - required on isolation) |
| verdict | PASS |
| decision_gate | false |
| SPRINT_MAX_TASKS | 12 |
| SPRINT_AUTO_SPLIT | 1 |
| task_count | 11 (T-anch + T-001..T-010, within 12, no split, 1:1 from architecture seeds) |
| COMPONENT_SCOPE_MODE | 0 |
| USER_GUIDE_MODE | 0 |
| plan-verify | ultra_lean - NOT in resolved_phase_plan, skipped, plan-verify.json written as SKIPPED placeholder only (not a QA phase) |
| backlog_status | OPEN (US-0045 - not mutated, AC-1..AC-8 unchecked) |
| sprint_id_lock | S0147 is next free after S0146 (BUG-0021 occupies sprints/S0146/). Confirmed no S0147 folder existed before this spawn. Do not reuse S0146. |
| critic_carry_ins | 0 new blocking, 3 architecture critic NBs us0140arch-* status=resolved non-blocking - routed as awareness into /execute |

## Scope summary

Add one owned workflow engine so operators can run intake through refresh with fresh specialist sessions and authoritative validators without Cursor or OpenCode as the only host. New package `@its-magic/runtime-core` never imports Pi. Nested `workflow/` (CommandRouter + WorkflowEngine + typed phase graph + nested GateEngine), `runs/` (`node:sqlite` operational store), `recovery/`, and `stop-matrix/` (consume kit reason codes — do not fork). Host Cursor/OpenCode orchestrators remain scheduling-only (BUG-0006 / DEC-0051). `/auto` and `/quick` are US-0143 OUT (fail-closed `WORKFLOW_ROUTE_DEFERRED` stub). Role-runtime / PolicyEngine / config / context-engine / KernelBridge stay unamended. DEC-0038 `compute_strict_proof_hash` tuple stays UNAMENDED. Execute owns package files.

Approach A1 (DEC-0140 Accepted): `standalone/packages/runtime-core` (`@its-magic/runtime-core`, private, no Pi imports) + nested GateEngine methods + typed TS graph + CommandRouter 7-step + KernelBridge consume-not-copy + `/auto`/`/quick` stub + `node:sqlite` `DatabaseSync` ops DB (gitignored `.its-magic/runtime/ops.sqlite`) + crash resume `discardOrphans` + fresh correct-role spawn (compose US-0136) + 12 `test_us0140_*` on Windows + Linux, fake-model CI held.

Out of scope: A2 sibling `packages/workflow`, A3 fold into role-runtime, A4 Temporal, A5 LangGraph as engine, A6 copy Python validators, A7 SQLite as DONE authority, A8 `/auto`/`/quick` drain (US-0143), A9 merge release+closure, A10 rewrite PolicyEngine/config/auth/KernelBridge/noTools/context-engine, A11 better-sqlite3 required v1, A12 bun:sqlite/sql.js SOT, A13 resume old Pi session, US-0141..US-0148, marking US-0140 DONE, ticking AC checkboxes, reopening US-0133..US-0139 or BUG-0020, mutating BUG-0021/BUG-0022 or S0145/S0146, wiping R-0120..R-0135.

## Execute awareness (architecture critic NBs - 0 blocking)

Sovereign-critic of architecture PASS (critic-US0140-architecture-20260913T210500Z-fresh, anti_slop=10, 0 blocking, degraded_mode=false). Consumed architecture proof MATCH before TTL. Route these resolved NBs as execute awareness - do not re-open them as work:

| Finding | Issue key | Execute awareness |
|---|---|---|
| us0140arch-challenger-001 | ik_us0140arch_proof_failclosed_pass | T-003/T-005/T-006/T-008/T-009/T-010: fail-closed WORKFLOW_ROUTE_DEFERRED, WORKFLOW_LOOP_CAP, RELEASE_*, CLOSURE_RELEASE_EVIDENCE_MISSING, RECOVERY_FALSE_COMPLETION locked DEC-0140. US-0143 drain OUT. credentials/.env OUT. compute_strict_proof_hash tuple unamended. |
| us0140arch-architect-002 | ik_us0140arch_layer_sprintplan_owns_next | Keep T-anch..T-010 1:1 from architecture seeds, sprint folder is S0147 (S0146 occupied by BUG-0021), architecture owns H1+DEC-0140, execute owns runtime-core + nested workflow/runs/recovery/stop-matrix + 12 tests. PolicyEngine/config/RoleCatalog/KernelBridge/context-engine compose-only. US-0143 deferred. |
| us0140arch-subtractor-003 | ik_us0140arch_scope_yagni_pass | T-anch ceremony overlap acceptable. Do not invent extra tasks. Do not amend isolation loader / noTools / KernelBridge / auth-models / PolicyEngine tables / RoleCatalog internals / context-engine ranking. Do not design US-0141+. Do not own credentials or read .env. Do not mark US-0140 DONE. Do not reopen US-0139 or BUG-0020. Do not mutate S0145/S0146. 12 markers required. 11 tasks within SPRINT_MAX_TASKS=12. |

## Acceptance criteria (8) - US-0140 (status OPEN, unchecked per US-0045)

Primary acceptance (docs/product/acceptance.md US-0140 row): Canonical lifecycle and gate orchestrator - full phase graph, rework, release/closure ownership, artifact state, crash resume, and E2E gates (8 ACs).

- **AC-1**: Programmatic commands cover intake, discovery, research, architecture, sprint-plan, plan-verify, execute, QA, verify-work, release, closure, refresh-context, ask, memory-audit, map-codebase, and security-review. - T-001, T-003 (T-010 m1).
- **AC-2**: The standard phase graph enforces canonical preconditions, role/model/tool/context resolution, fresh-session spawn, validators, evidence, and next-state intent. - T-002, T-003, T-004 (T-010 m2, m3).
- **AC-3**: Execute/QA rework is bounded; decision gates, security hooks, and critics supplement rather than substitute the owning producer role. - T-005 (T-010 m4, m5).
- **AC-4**: Release gate order preserves check-in tests, independent QA, UAT, documentation/release artifacts, and fail-closed reason semantics. - T-006 (T-010 m6).
- **AC-5**: Release and closure are separate: release cannot mark stories DONE, and closure requires valid release evidence before reconciling backlog, acceptance, status, isolation, and closure verification. - T-007 (T-010 m7).
- **AC-6**: Repository artifacts remain canonical while SQLite stores operational run/session/audit/process/index metadata only. - T-008 (T-010 m8).
- **AC-7**: Runtime restart reconciles repo and operational state, rejects falsely claimed completion, discards orphan sessions, and resumes by spawning a fresh correct-role session. - T-009 (T-010 m9).
- **AC-8**: End-to-end fixtures prove a standard lifecycle from intake through closure/refresh and show validator failure, QA/UAT failure, and premature closure block progression. - T-010 m10-m12.

## Task summaries (11 - T-anch + T-001..T-010)

- **T-anch** (NO-OP / verification): Verify # US-0140 H1 + DEC-0140 Accepted + A1 + R-0135 DQ1-DQ10 + 12-marker list. Record to sprints/S0147/t-anch-verification.md. NO mutation to architecture.md / DEC-0140.md / R-0135 in /execute.
- **T-001** (AC-1): Create standalone/packages/runtime-core (@its-magic/runtime-core). private true, version 0.0.0, type module, engines.node >=22.19.0, export ./src/index.ts. Nested src/workflow/, src/workflow/gates/, src/runs/, src/recovery/, src/stop-matrix/. No Pi imports. Extend US-0133..0139 grep. Do not add a Biome override. Kit files omit standalone/.
- **T-002** (AC-2): Typed phase graph + next-state intent v1 + ultra_lean plan-verify skip edge (do not delete the node). Canonical intake→…→refresh-context; execute↔qa bounded.
- **T-003** (AC-1/AC-2): CommandRouter 7-step + programmatic command names + `/auto`/`/quick` fail-closed WORKFLOW_ROUTE_DEFERRED. Host scheduling-only. KernelBridge runValidator consume-not-copy.
- **T-004** (AC-2): SessionSupervisor spawn injection: RoleCatalog + policy allowlist/policy_hash + config flags + context pack/context_pack_hash + KernelBridge. Empty loader + noTools builtin held.
- **T-005** (AC-3): Bounded execute↔QA + critic/security hook slot. Cap source consume-only (AUTO_IMPLEMENTATION_LOOP then AUTO_LOOP_MAX_CYCLES). Exhaust WORKFLOW_LOOP_CAP. Critics supplement not substitute. Critic content US-0144 OUT.
- **T-006** (AC-4): Nested GateEngine order + RELEASE_* codes (RELEASE_TESTS_FAILED, RELEASE_QA_MISSING, RELEASE_UAT_FAILED, RELEASE_ARTIFACTS_MISSING, RELEASE_PREMATURE). Publish/deploy targets US-0145 OUT.
- **T-007** (AC-5): Closure exclusive DONE + release-evidence envelope v1. Premature closure CLOSURE_RELEASE_EVIDENCE_MISSING. Release cannot mark DONE.
- **T-008** (AC-6): node:sqlite RunsStore + gitignored **/.its-magic/runtime/. Tables v1: runs, sessions, audit, process_handles, index_meta. SQLite never DONE authority. RECOVERY_FALSE_COMPLETION when SQLite claims complete and repo disagrees.
- **T-009** (AC-7): Crash reconcile + discardOrphans + fresh correct-role spawn. Compose US-0136. Never restore parent transcripts. Stale brief RESUME_BRIEF_STALE.
- **T-010** (AC-1..AC-8): Twelve test_us0140_* markers (DEC-0140). Primary standalone/tests/contract (node:test) Windows + Linux. Fake-model CI held. In-memory SQLite.

Execution order: T-anch -> T-001 -> T-002 -> T-003 -> T-004 -> T-005 -> T-006 -> T-007 -> T-008 -> T-009 -> T-010 (acyclic). No split (11 <= 12). Not /quick.

## AC -> Task surjective coverage

| AC | Task(s) |
|---|---|
| AC-1 (programmatic commands + package) | T-001, T-003 |
| AC-2 (graph + spawn + next-state) | T-002, T-003, T-004 |
| AC-3 (bounded execute↔QA + supplementary hooks) | T-005 |
| AC-4 (release gate order) | T-006 |
| AC-5 (release ≠ closure) | T-007 |
| AC-6 (SQLite operational only) | T-008 |
| AC-7 (crash resume fresh role) | T-009 |
| AC-8 (E2E + fail paths) | T-010 |
| DC / architecture baseline | T-anch |

**Surjectivity check**: 8/8 ACs covered (each AC >=1 task) + primary acceptance.md US-0140 row covered by AC-1..AC-8 aggregate. T-010 markers m1-m12 attest AC-1..AC-8. No PLAN_AC_COVERAGE_GAP. T-anch retained as verification-only.

## Locked 12-marker table (DEC-0140 / architecture)

1. test_us0140_command_coverage
2. test_us0140_phase_graph_preconditions
3. test_us0140_spawn_only_orchestrator
4. test_us0140_bounded_execute_qa
5. test_us0140_critics_supplement_not_substitute
6. test_us0140_release_gate_order
7. test_us0140_release_not_closure
8. test_us0140_sqlite_non_authority
9. test_us0140_crash_resume_fresh_role
10. test_us0140_validator_fail_blocks
11. test_us0140_qa_uat_fail_blocks
12. test_us0140_e2e_standard_lifecycle

Primary: standalone/tests/contract (node:test) Windows + Linux. Fake-model CI held. In-memory SQLite. No paid model calls. No Temporal/LangGraph deps. Count stays 12.

## Risks (R1-R6 - accepted)

| Risk | Severity | Mitigation |
|---|---|---|
| R1 node:sqlite Stability 1.1 API churn on Node 22 | MEDIUM | T-008/T-010: thin RunsStore; tests use :memory:; optional better-sqlite3 later |
| R2 Dual-SOT vs kit /auto Python if CommandRouter silently diverges | MEDIUM | T-003/T-010: consume KernelBridge validators; /auto stubbed until US-0143; stop-matrix nested mirror not a second writer |
| R3 Operators treat SQLite run PASS as story DONE | LOW | T-007/T-008/T-010 m7/m8: RECOVERY_FALSE_COMPLETION |
| R4 Crash resume reuses a live Pi session | MEDIUM | T-009/T-010 m9: mandatory discardOrphans + fresh spawn |
| R5 GateEngine grows into US-0145 deploy adapters | LOW | T-006: no packages/release-runtime this story |
| R6 AUTO_IMPLEMENTATION_LOOP key path bikeshed | LOW | T-005/T-010: flags→shared→compat lookup locked; consume-only; no new domain |

## Compose guards (UNCHANGED)

| Target | Result |
|---|---|
| US-0139 / DEC-0139 / R-0132 | code_context pack + context_pack_hash consume-only; ranking unamended |
| US-0138 / DEC-0138 / R-0130 | DELIVERY_MODE + retryTest.AUTO_LOOP_MAX_CYCLES + autonomy flags consume-only; loaders unamended; no new domain |
| US-0137 / DEC-0137 / R-0129 | PolicyEngine / ToolBroker / policy_hash consume allowlist + hash; tables unamended |
| US-0136 / DEC-0136 / R-0128 | SessionSupervisor spawn/end/discardOrphans / RoleCatalog inject; internals unamended |
| US-0135 / DEC-0135 / R-0127 | auth-models / credentials OUT; never read .env |
| US-0134 / DEC-0134 / R-0122 | KernelBridge runValidator consume; allowlist unamended |
| US-0133 / DEC-0133 / R-0121 | AgentKernel, isolation loader, noTools, fake-model CI unamended |
| US-0069 / DEC-0051 / BUG-0006 | phase→role + spawn-only; host scheduling-only |
| US-0045 | backlog Status authority; closure exclusive DONE |
| US-0039 | release gate chain; nested GateEngine consume semantics |
| US-0056 / DEC-0038 | compute_strict_proof_hash tuple UNAMENDED |
| DEC-0069 | resume_brief + state pairing; crash resume step 1 + 5 |
| Kit npm its-magic / DEC-0120 | files whitelist omit standalone/ |
| US-0141..US-0148 | OUT OF SCOPE (US-0143 /auto /quick drain) |
| US-0133..US-0139 DONE | compose only, do not reopen |
| BUG-0020 DONE | do not reopen |
| BUG-0021 OPEN | not mutated (sprints/S0146/ occupied) |
| BUG-0022 OPEN | not mutated |
| US-0045 | Status stays OPEN |

## Execute phase role (per DEC-0051 / US-0069)

| Phase | Role | Isolation |
|---|---|---|
| /execute | dev (fresh per BUG-0006) | {phase_id:execute, role:dev} |
| /qa | qa (fresh) | {phase_id:qa, role:qa} - ultra_lean may overwrite plan-verify.json inside build+verify |
| /verify-work | qa (fresh) | {phase_id:verify-work, role:qa} |
| /release | release (fresh) | {phase_id:release, role:release} |
| /closure | qe (fresh) | {phase_id:closure, role:qe} |
| /refresh-context | curator (fresh) | {phase_id:refresh-context, role:curator} |

## Isolation evidence (US-0048 / DEC-0029 / US-0104 v2)

| Field | Value |
|---|---|
| phase_id | sprint-plan |
| role | tech-lead |
| story_id | US-0140 |
| sprint_id | S0147 |
| orchestrator_run_id | auto-20260913-us0140 |
| delivery_mode | ultra_lean |
| macro_phase | plan |
| fresh_context_marker | tl-US0140-sprintplan-20260913T211500Z-fresh |
| timestamp | 2026-09-13T21:15:00Z (UTC) |
| model_id | cursor-grok-4.6-high (CROSS_MODEL_REVIEW=1 - required) |
| evidence_ref | sprints/S0147/sprint.md, tasks.md, progress.md, uat.json, uat.md, plan-verify.json (SKIPPED), handoffs/tl_to_dev.md, docs/engineering/state.md, handoffs/resume_brief.md |

Prior phase proof consumed: rp-auto-20260913-us0140-architecture-techlead-20260913T205500Z-US-0140 / 006C9A41ABF30BCA3A313E8E3B0367CF7E17BA97759F3060BED8B60918DE50CC - RUNTIME_PROOF_VALID (independent compute_strict_proof_hash MATCH, consumed 2026-09-13T21:15:00Z before TTL 2026-09-13T21:55:00Z). Sovereign-critic architecture PASS (rp-auto-20260913-us0140-sovereign-critic-techlead-20260913T210500Z-US-0140 / C8B88DCD0B57CE0D3A4FD66C282E51F1510D6FC3E53DC2DD48FCCCDE8C3439F6, critic-US0140-architecture-20260913T210500Z-fresh, anti_slop=10, 0 blocking, degraded_mode=false, findings us0140arch-* informational - routed). MATCH before TTL 2026-09-13T22:05:00Z.

## Runtime proof (DEC-0038)

| Field | Value |
|---|---|
| runtime_proof_id | rp-auto-20260913-us0140-sprint-plan-techlead-20260913T211500Z-US-0140 |
| phase_id | sprint-plan |
| role | tech-lead |
| story_id | US-0140 |
| sprint_id | S0147 |
| orchestrator_run_id | auto-20260913-us0140 |
| delivery_mode | ultra_lean |
| macro_phase | plan |
| model_id | cursor-grok-4.6-high (CROSS_MODEL_REVIEW=1 - required) |
| proof_issued_at | 2026-09-13T21:15:00Z |
| proof_ttl_seconds | 3600 |
| proof_ttl | 2026-09-13T22:15:00Z (UTC) |
| proof_hash | 8DF26AFE6649AB65A7B3F5CF3F350743B88384CFA36B7172E5D0C74198D62E6D |
| canonical_payload | `{"orchestrator_run_id":"auto-20260913-us0140","phase_id":"sprint-plan","proof_issued_at":"2026-09-13T21:15:00Z","proof_ttl_seconds":3600,"role":"tech-lead","runtime_proof_id":"rp-auto-20260913-us0140-sprint-plan-techlead-20260913T211500Z-US-0140"}` |

Hash via scripts.token_cost_lib.compute_strict_proof_hash (positional, compact sorted-key JSON). Isolation extras (not hashed): delivery_mode=ultra_lean, macro_phase=plan, model_id=cursor-grok-4.6-high, sprint_id=S0147, story_id=US-0140. hash_recompute_confirmation=true (compute_strict_proof_hash -> 8DF26AFE6649AB65A7B3F5CF3F350743B88384CFA36B7172E5D0C74198D62E6D).

## Decision gate

| Field | Value |
|---|---|
| decision_gate | false |
| stop_conditions_met | yes |
| missing_acceptance_criteria | none (8/8 slices + primary acceptance row covered, 12 contract-test markers) |
| task_count | 11 (within SPRINT_MAX_TASKS=12, SPRINT_AUTO_SPLIT=1 but no split needed, 1:1 seeds, not /quick, not --bulk) |
| risks_finalized | 6/6 ACCEPTED (R1..R6) |
| approach | A1 locked |
| companion_DEC | DEC-0140 Accepted |
| plan-verify readiness | ultra_lean - plan-verify NOT in resolved_phase_plan, skipped, plan-verify.json is a SKIPPED placeholder |
| sovereign_memory_note | assemble_sovereign_memory_digest(...) NOT called |

## Definition of done (sprint-plan)

- [x] 11 tasks enumerated (T-anch + T-001..T-010) - within SPRINT_MAX_TASKS=12, 1:1 from architecture seeds
- [x] 8/8 ACs surjective + primary acceptance.md US-0140 covered
- [x] Task dependency graph documented
- [x] Execute phase role matrix documented (ultra_lean - /plan-verify skipped, next = sovereign-critic then /execute)
- [x] Compose guards UNCHANGED
- [x] Critic carry-ins (3 non-blocking from architecture sovereign-critic) routed as execute awareness, sprint id locked S0147
- [x] Isolation evidence + runtime proof emitted (model_id=cursor-grok-4.6-high present)
- [x] Sprint-plan checkpoint appended to docs/engineering/state.md
- [x] Sprint-plan handoff prepended to handoffs/tl_to_dev.md
- [x] Sprint-plan PASS prepended to handoffs/resume_brief.md (-> sovereign-critic then /execute)
- [x] UAT placeholders written (uat.json empty steps, uat.md ACs no results)
- [x] Traceability row added (Story=US-0140, Sprint=S0147, Tasks=T-anch+T-001..T-010, Status=PLANNED, Evidence empty)
- [x] Backlog status OPEN (US-0045 - not mutated), acceptance unchecked, sprint_plan_notes appended
- [x] plan-verify.json SKIPPED placeholder (not a QA phase)

## Next scheduled phase

| Field | Value |
|---|---|
| next_scheduled_phase | sovereign-critic (sprint-plan, CROSS_MODEL_REVIEW=1) then /execute (role=dev per US-0069 / DEC-0051, fresh dev subagent per BUG-0006, first canonical phase of build+verify macro per ultra_lean, plan-verify NOT in resolved_phase_plan - skipped) |
| next_scheduled_role | tech-lead (critic of sprint-plan), then dev |
| next_sprint_macro | build+verify (ultra_lean - plan-verify skipped at this boundary) |
| stop_condition | STOP after sprint-plan completes, hand off via artifacts only. Orchestrator MUST spawn sovereign-critic of sprint-plan then /execute in fresh dev subagent per BUG-0006. Do not spawn /execute, /plan-verify, or critic from this subagent. |
