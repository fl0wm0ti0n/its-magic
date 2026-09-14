# Sprint S0147 - Task checklist (US-0140)

Total tasks: 11 (T-anch + T-001..T-010). SPRINT_MAX_TASKS=12, SPRINT_AUTO_SPLIT=1, no split. T-anch retained as NO-OP verification. Seeds 1:1 from docs/engineering/architecture.md # US-0140. Sprint id S0147 (next free after S0146 occupied by BUG-0021).

**Isolation**: `tl-US0140-sprintplan-20260913T211500Z-fresh` · `model_id=cursor-grok-4.6-high` · `orchestrator_run_id=auto-20260913-us0140`

## Task execution order

1. T-anch (NO-OP / verification)
2. T-001 (packages/runtime-core + nested dirs + Pi import-boundary grep)
3. T-002 (typed phase graph + next-state intent + ultra_lean plan-verify skip)
4. T-003 (CommandRouter 7-step + `/auto`/`/quick` WORKFLOW_ROUTE_DEFERRED)
5. T-004 (SessionSupervisor spawn injection: catalog/policy/config/context/KernelBridge)
6. T-005 (bounded execute↔QA + critic/security hook slot)
7. T-006 (nested GateEngine order + RELEASE_* codes)
8. T-007 (closure exclusive DONE + release-evidence envelope)
9. T-008 (node:sqlite RunsStore + gitignored `.its-magic/runtime/`)
10. T-009 (crash reconcile + discardOrphans + fresh role)
11. T-010 (12 test_us0140_* Win/Linux fake-model)
12. Integration verification

## Critic NB awareness (execute)

- **T-003/T-005/T-006/T-008/T-009/T-010** (us0140arch-challenger-001 NB1): fail-closed WORKFLOW_ROUTE_DEFERRED, WORKFLOW_LOOP_CAP, RELEASE_*, CLOSURE_RELEASE_EVIDENCE_MISSING, RECOVERY_FALSE_COMPLETION locked DEC-0140. US-0143 drain OUT. credentials/.env OUT. compute_strict_proof_hash tuple unamended.
- **T-anch..T-010** (us0140arch-architect-002 NB2): keep 1:1 architecture seeds, sprint folder is S0147 (S0146 occupied by BUG-0021), execute owns runtime-core + nested workflow/runs/recovery + 12 tests, architecture owns H1+DEC-0140, PolicyEngine/config/RoleCatalog/KernelBridge/context-engine compose-only, US-0143 deferred, DEC-0133..0139 compose held.
- **T-anch** (us0140arch-subtractor-003 NB3): verification-only, do not rewrite # US-0140 / DEC-0140 / R-0135, reject A2-A13, do not amend isolation/noTools/KernelBridge/auth-models/PolicyEngine tables/RoleCatalog internals/context-engine ranking, do not mark DONE, do not reopen US-0139 or BUG-0020, do not design US-0141+, do not own credentials or read .env, do not mutate S0145/S0146, 12 markers required.

## Task checklist

- [x] **T-anch**: Verify # US-0140 H1 in docs/engineering/architecture.md, DEC-0140 Accepted, approach A1 LOCKED, R-0135 DQ1-DQ10 LOCKED, 12-marker table locked, compose guards (US-0139 context_pack_hash consume-only, US-0138 DELIVERY_MODE / AUTO_LOOP_MAX_CYCLES consume-only, US-0137 PolicyEngine tables unamended, US-0136 SessionSupervisor inject only, US-0135 credentials OUT, KernelBridge unamended, isolation/noTools unamended, kit files omit standalone/, US-0141+ out, US-0139 DONE, BUG-0020 DONE, BUG-0021 OPEN not mutated, S0146 not reused, R-0120..R-0135 intact). Verify standalone/packages/runtime-core and test_us0140_* do NOT yet exist (or document baseline). Record to sprints/S0147/t-anch-verification.md. NO mutation to architecture.md / decisions/DEC-0140.md / docs/engineering/research.md R-0135 in /execute. (DC / architecture baseline, NO-OP)

- [x] **T-001**: Create standalone/packages/runtime-core. package.json: name @its-magic/runtime-core, private true, version 0.0.0, type module, engines.node >=22.19.0, export ./src/index.ts. Workspaces glob packages/* already includes it. Nested dirs: src/workflow/ (CommandRouter + WorkflowEngine + typed phase graph), src/workflow/gates/ (GateEngine methods, not a sibling package), src/runs/ (SQLite operational store), src/recovery/ (crash reconcile), src/stop-matrix/ (reason-code mirror of kit — consume, do not fork). No Pi imports. package.json must not depend on @earendil-works/pi-*. Type-only / public-API imports from @its-magic/role-runtime, @its-magic/policy-engine, @its-magic/config, @its-magic/context-engine, @its-magic/kernel-bridge are allowed. Those packages must not import workflow internals. Extend the US-0133..US-0139 grep to deny Pi inside runtime-core. Do not add a Biome override. Kit files omit standalone/. Do not create sibling packages/workflow or packages/release-runtime. (AC-1)

- [x] **T-002**: Implement typed TypeScript phase graph with named nodes/edges and a precondition table. Canonical edges: intake → discovery → research → architecture → sprint-plan → plan-verify → execute ↔ qa (bounded) → verify-work → release → closure → refresh-context. ultra_lean: consume US-0138 DELIVERY_MODE; skip plan-verify via an explicit skip edge + skip evidence (do not delete the node). Do not invent US-0143 compressed /auto /quick graphs. Next-state intent schema v1: { schema_version: 1, next_phase, next_role, stop_reason?: completed|decision_gate|missing_input|pause_request|loop_max|error|blocked, skip_reason?, gate_code? }. Phase→role consume DEC-0051 (do not rewrite). Manifest extract is §14.5 v1.x, not this story. Tests: marker 2. (AC-2)

- [x] **T-003**: Owned CommandRouter implements §14.3 seven steps: (1) target/config → (2) preconditions → (3) role/model/tool/context → (4) fresh-session spawn → (5) KernelBridge validators → (6) evidence → (7) next-state intent. No 200-line prompt is the engine. Host Cursor/OpenCode /auto plugins remain scheduling-only (BUG-0006 / DEC-0051). Do not restore STOP-only auto.md. Programmatic commands: intake, discovery, research, architecture, sprint-plan, plan-verify, execute, qa, verify-work, release, closure, refresh-context, ask, memory-audit, map-codebase, security-review. /auto and /quick: accept the names then return fail-closed WORKFLOW_ROUTE_DEFERRED (US-0143 owns drain + compressed routes). Do not omit the names. Do not implement those routes. KernelBridge consume-not-copy: call existing runValidator. Do not copy validators. Do not amend ALLOWED_VALIDATOR_NAMES. Unknown name → KERNEL_VALIDATOR_MISSING. Tests: marker 1, marker 3. (AC-1/AC-2)

- [x] **T-004**: CommandRouter spawn payload consumes: US-0136 RoleCatalog + SessionSupervisor; US-0137 tool allowlist + policy_hash; US-0138 phase/delivery/autonomy flags; US-0139 code_context pack + context_pack_hash; US-0134 KernelBridge locate/handshake/validators. Empty isolation loader + noTools: builtin held. KernelBridge internals unamended. PolicyEngine tables unamended. Config loaders unamended. Context-engine ranking unamended. Fake-model CI held. DEC-0038 tuple UNAMENDED. Tests: marker 3. (AC-2)

- [x] **T-005**: WorkflowEngine owns the execute ↔ qa loop. Cap source consume-only; no new RuntimeConfig domain. Loop enable: lookup AUTO_IMPLEMENTATION_LOOP in resolved.autonomy.flags then resolved.shared then resolved.compat; default "0". Cycle cap: resolved.retryTest.AUTO_LOOP_MAX_CYCLES. Exhaust → native WORKFLOW_LOOP_CAP. Compose aliases (do not collapse): when the execute/QA implementation loop is the source, also record FIX_FAILED; when AUTO_LOOP_MAX_CYCLES is the source, also record BLOCK_RETRY_CAP_EXHAUSTED. stop_reason=loop_max on next-state intent. Decision gates, security-review, and critics spawn supplementary fresh sessions via SessionSupervisor.spawn (compose US-0136). They do not replace the producer role. Critic content remains US-0144 OUT — this story only schedules the hook slot when resolved.sovereign.CROSS_MODEL_REVIEW="1". Tests: markers 4-5. (AC-3)

- [x] **T-006**: Nested runtime-core/src/workflow/gates/ as GateEngine methods. Ordered fail-closed chain (US-0039 KEEP): (1) check-in tests (2) independent QA evidence (3) UAT evidence (uat-planner via existing KernelBridge) (4) documentation / release artifacts (5) fail-closed reason (no bypass). Reason codes: RELEASE_TESTS_FAILED, RELEASE_QA_MISSING, RELEASE_UAT_FAILED, RELEASE_ARTIFACTS_MISSING, RELEASE_PREMATURE. Publish/deploy targets are US-0145 OUT. Release cannot mark DONE. Tests: marker 6. (AC-4)

- [x] **T-007**: Closure is the only writer of backlog Status OPEN→DONE and acceptance checks (US-0045). Release writes release artifacts + release-evidence envelope; it must not call status reconcile as a side effect. Release-evidence envelope v1: { release_run_id, tests_pass, qa_pass, uat_pass, artifact_refs[] }. Closure preconditions: valid release-evidence then KernelBridge validate_closure_verification + status-reconcile. Isolation/runtime-proof rows for the closure phase are written by closure, not by release. Premature closure (no release evidence) → CLOSURE_RELEASE_EVIDENCE_MISSING. Tests: marker 7. (AC-5)

- [x] **T-008**: node:sqlite DatabaseSync inside runtime-core/src/runs/ (zero native addon; engines.node >=22.19.0; :memory: in CI). Thin RunsStore wrapper so execute can swap better-sqlite3 later if Node 22 Stability 1.1 churns. Path: gitignored .its-magic/runtime/ops.sqlite. Execute adds gitignore analog **/.its-magic/runtime/ (compose US-0139 **/.its-magic/context-packs/). Never commit the DB. Schema tables v1: runs, sessions, audit, process_handles, index_meta — operational only. process_handles is a reserved operational table (US-0141 AppRuntime OUT — do not implement process backends here). Reject SQLite as authority for backlog/acceptance/decisions/sprint DONE. If SQLite claims complete and repo artifacts disagree → RECOVERY_FALSE_COMPLETION. Tests: marker 8. (AC-6)

- [x] **T-009**: On runtime restart: (1) READ handoffs/resume_brief.md + docs/engineering/state.md + active work item (repo canonical) (2) READ last SQLite run record (operational only) (3) Reject false completion when SQLite/session claims PASS but repo evidence/backlog/status disagree (RECOVERY_FALSE_COMPLETION) (4) SessionSupervisor.discardOrphans() (compose US-0136; do not rewrite supervisor) (5) Reconstruct next schedulable phase from the typed graph + resume_brief pairing (DEC-0069) (6) Spawn a fresh correct-role session — never restore parent transcripts / old-role conversation. Analog: LangGraph checkpoint at phase boundary. Reject Temporal replay of specialist LLM turns. Stale resume_brief → existing RESUME_BRIEF_STALE (fail-closed, no advance). Tests: marker 9. (AC-7)

- [x] **T-010**: Create contract tests covering exactly 12 markers (DEC-0140). Primary: standalone/tests/contract (node:test) Windows + Linux. Fake-model CI. In-memory SQLite. No paid model calls. No Temporal/LangGraph deps. Count stays 12.
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
  Do not weaken test_us0133_* / test_us0134_* / test_us0135_* / test_us0136_* / test_us0137_* / test_us0138_* / test_us0139_*. (AC-1..AC-8 coverage via markers)

## Integration verification (post T-010)

- [x] Test gate: standalone npm test covers 12/12 test_us0140_* plus compose us0133..us0139 still green
- [x] Import-boundary gate: no Pi imports in packages/runtime-core, kit files omit standalone/
- [x] Isolation gate: AgentKernel empty loader / noTools builtin / KernelBridge / auth-models store / PolicyEngine tables / RoleCatalog internals / context-engine ranking unamended, fake-model CI held, DEC-0038 tuple unamended
- [x] Scope gate: no credentials / .env reads, no /auto /quick drain, no Temporal/LangGraph, no US-0141+ authoring, no sibling packages/workflow
- [x] Status gate: US-0140 remains OPEN, AC-1..AC-8 unchecked, intake JSON not mutated, US-0133..US-0139/BUG-0020 remain DONE, BUG-0021/BUG-0022 not mutated, S0145/S0146 not mutated

## Files to touch (scope)

### New (create)

- standalone/packages/runtime-core/ (package.json, src/index.ts, src/workflow/, src/workflow/gates/, src/runs/, src/recovery/, src/stop-matrix/)
- standalone/tests/contract test_us0140_* (node:test)
- sprints/S0147/t-anch-verification.md (execute)

### Edit (scoped)

- existing US-0133..US-0139 Pi-import grep - extend to runtime-core
- .gitignore analog **/.its-magic/runtime/ (compose US-0139 **/.its-magic/context-packs/)
- .github/workflows/ci.yml - extend existing standalone Windows+Linux job only if glob would miss new tests

### Compose-guard UNCHANGED (DO NOT TOUCH)

| File / surface | Reason |
|---|---|
| Backlog Status / AC checkboxes | US-0045 - closure only |
| architecture.md / DEC-0140.md | locked in /architecture |
| PolicyEngine decision tables | consume allowlist + hash only |
| KernelBridge / isolation / noTools | unamended |
| RoleCatalog internals | inject spawn only |
| context-engine ranking | consume pack + hash only |
| config loaders | consume flags only |
| DEC-0038 tuple | UNAMENDED |
| /auto /quick drain | US-0143 OUT |
| US-0141..US-0148 | OUT OF SCOPE |
| US-0139 / S0145 / BUG-0020 | DONE - do not reopen |
| S0146 / BUG-0021 | OPEN - do not mutate |
| .env / credentials | never read |

## AC -> Task surjective coverage

| AC | Task(s) |
|---|---|
| AC-1 | T-001, T-003 |
| AC-2 | T-002, T-003, T-004 |
| AC-3 | T-005 |
| AC-4 | T-006 |
| AC-5 | T-007 |
| AC-6 | T-008 |
| AC-7 | T-009 |
| AC-8 | T-010 |
| DC / architecture | T-anch |

**Surjectivity check**: 8/8 ACs covered. T-010 markers attest AC-1..AC-8. No PLAN_AC_COVERAGE_GAP.
