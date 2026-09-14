# Sprint S0151 - Sprint Plan (US-0143)

## Metadata

| Field | Value |
|---|---|
| story_id | US-0143 |
| bug_id | (none) |
| story_title | Delivery routing and full-autonomy scheduler |
| sprint_id | S0151 |
| delivery_mode | ultra_lean |
| macro_phase | plan (sprint-plan terminal; plan-verify NOT in resolved_phase_plan — skipped; next = sovereign-critic of sprint-plan then execute) |
| current_phase | sprint-plan |
| approach | A1 locked (from R-0141 DQ1–DQ10; DEC-0143 Accepted; architecture critic NB1–NB3 CLOSED) |
| companion_DEC | DEC-0143 (Accepted) |
| research_anchor | R-0141 (DQ1–DQ10 LOCKED; compose R-0135 / R-0106 / R-0107 / R-0081 / R-0082; do not wipe R-0120..R-0141; R-0139 remains US-0142; R-0138 remains US-0141; R-0140 remains BUG-0024) |
| architecture_anchor | docs/engineering/architecture.md # US-0143 |
| orchestrator_run_id | auto-20260913-us0143 |
| parent_orchestrator_run_id | auto-20260913-us0142 |
| fresh_context_marker | tl-US0143-sprintplan-20260914T073000Z-fresh |
| timestamp | 2026-09-14T07:30:00Z (UTC) |
| model_id | cursor-grok-4.6-high (CROSS_MODEL_REVIEW=1 — required on isolation) |
| verdict | PASS |
| decision_gate | false |
| SPRINT_MAX_TASKS | 12 |
| SPRINT_AUTO_SPLIT | 1 |
| task_count | 11 (T-anch + T-001..T-010, within 12, no split, 1:1 from architecture seeds) |
| COMPONENT_SCOPE_MODE | 0 |
| USER_GUIDE_MODE | 0 |
| plan-verify | ultra_lean — NOT in resolved_phase_plan; skipped; plan-verify.json written as SKIPPED placeholder only (not a QA phase); reason=`ultra_lean_not_in_resolved_phase_plan` |
| backlog_status | OPEN (US-0045 — not mutated; AC-1..AC-8 unchecked) |
| sprint_id_lock | **S0151** is next free after S0150 (US-0142). Confirmed no S0151 folder existed before this spawn. Do not reuse S0146 (BUG-0021), S0147 (US-0140), S0148 (BUG-0023), S0149 (US-0141), or S0150 (US-0142). |
| critic_carry_ins | 0 new blocking; 3 architecture critic NBs us0143arc-* status=resolved non-blocking — routed as awareness into /execute |

## Scope summary

Lift deferred `/auto` and `/quick` so operators can run bounded standard, lean, quick, resume, and backlog-drain workflows in **runtime state**. Implementation lives **inside** existing `@its-magic/runtime-core`. Nested helper `workflow/delivery-router.ts`. CommandRouter returns implemented `RouteScheduled` (not 7-step for the scheduler command itself). WorkflowEngine owns the §14.4 `while run active` drain loop (`runAuto` / `runQuick`). GateEngine `RELEASE_GATE_ORDER` stays **unamended**. Host Cursor/OpenCode remain **scheduling-only**. **No Pi**. **No** sibling auto-scheduler. **No** prompt-only scheduler. **No** `.opencode/commands/auto.md` restore. Kit `files` omit `standalone/`. Five axes stay independent. AC-6 terminals stay non-relaxable even under `AUTONOMY_PRESET=full`. US-0144 critic *content* is OUT (hooks compose only). DEC-0038 `compute_strict_proof_hash` tuple stays **UNAMENDED**. Execute owns code files.

Approach A1 (DEC-0143 Accepted): in-place CommandRouter lift inside `@its-magic/runtime-core` + nested DeliveryRouter + WorkflowEngine-owned drain + YAML stop-matrix consume + TS L8 adapter + independent axes + 12 `test_us0143_*` on Windows + Linux, fake-model CI, in-memory SQLite.

Out of scope: A2 sibling `packages/auto-scheduler`, A3 prompt-only / restore `auto.md`, A4 rewrite GateEngine tables, A5 fork stop-matrix YAML writer, A6 LangGraph/Temporal as engine, A7 fold into role-runtime, A8 amend KernelBridge allowlist, A9 US-0144 critic content, A10 CLI/TUI (US-0146), A11 silent mid-story `DELIVERY_MODE` switch, A12 weaken `security_hard` under `full`, A13 SQLite as stop/DONE SOT, A14 keep `WORKFLOW_ROUTE_DEFERRED` as happy path, A15 LLM work-kind / stop-relaxability classifier, US-0144..US-0148, marking US-0143 DONE, ticking AC checkboxes, reopening US-0133..US-0142, mutating BUG-0021/BUG-0022/BUG-0023/BUG-0024 or S0146/S0147/S0148/S0149/S0150, wiping R-0120..R-0141.

## Execute awareness (architecture critic NBs — 0 blocking)

Sovereign-critic of architecture PASS (`critic-US0143-architecture-20260914T072000Z-fresh`; anti_slop=10; 0 blocking; degraded_mode=false). Consumed architecture proof MATCH before TTL. Route these resolved NBs as execute awareness — do not re-open them as work:

| Finding | Issue key | Execute awareness |
|---|---|---|
| us0143arc-challenger-001 | ik_us0143arc_proof_failclosed_pass | T-001/T-003/T-007/T-010: AC-6 terminals locked (`DECISION_UNRESOLVED`, `KERNEL_INCOMPATIBLE`, `QUALITY_EVIDENCE_FAILED`, `BUDGET_EXHAUSTED`, `RESUME_AMBIGUOUS` + existing `security_hard`). Compose-amend `test_us0140_command_coverage` when `DEFERRED_COMMANDS` emptied. L8 TS adapter golden vs Python kit SOT. `RouteScheduled` vs 7-step for scheduler commands. `AUTONOMY_PRESET=full` cannot relax AC-6. Never read `.env`. Status OPEN; R-0141 not R-0139. |
| us0143arc-architect-002 | ik_us0143arc_layer_sprintplan_owns_next | Keep **T-anch..T-010 1:1** from architecture seeds; sprint folder is **S0151** (S0150=US-0142 occupied). Architecture owns H1+DEC-0143; execute owns runtime-core lift + `delivery-router.ts` + 12 tests. Do not rewrite GateEngine/`RELEASE_GATE_ORDER`. US-0144 content OUT. |
| us0143arc-subtractor-003 | ik_us0143arc_scope_yagni_pass | T-anch ceremony overlap acceptable. Do not invent extra tasks. Do not add sibling auto-scheduler. Do not restore `auto.md`. Do not amend isolation loader / `noTools` / KernelBridge / PolicyEngine tables / RoleCatalog internals / config loaders. Do not design US-0144+. Do not drain BUG-0024. Do not own credentials or read `.env`. Do not mark US-0143 DONE. Do not reopen US-0133..US-0142. Do not mutate BUG-0021/0022/0023/0024 or S0146/S0147/S0148/S0149/S0150. 12 markers required. 11 tasks within SPRINT_MAX_TASKS=12. |

## Acceptance criteria (8) — US-0143 (status OPEN, unchecked per US-0045)

Primary acceptance (`docs/product/acceptance.md` US-0143 row): Delivery routing and full-autonomy scheduler — standard/lean/quick routes, work-kind, phase precedence, drain, hard stops, ledgers, and tests (8 ACs).

- **AC-1**: `/auto` resolves target work, work kind, delivery mode, phase plan, role/model/policy, evidence, critic hooks, bounded repair, release/closure/refresh, and optional next-item drain in runtime state. — T-001, T-005, T-009 (T-010 m1–m2).
- **AC-2**: Standard, ultra-lean, and mega-quick lifecycle shapes preserve mandatory tests and acceptance evidence; delivery mode, token profile, response voice, autonomy preset, and work-kind are independent axes. — T-002, T-004 (T-010 m3–m5).
- **AC-3**: Explicit phase/start-from and delivery overrides take documented precedence over deterministic work-kind recommendations. — T-003 (T-010 m6, m7).
- **AC-4**: Autonomy presets expand to explicit settings before execution; the canonical stop matrix and reason codes come from the existing kernel/manifest rather than divergent prompt logic. — T-002, T-007 (T-010 m8).
- **AC-5**: Backlog/story/bug drain, bulk execution, retry/skip/repair, quiet mode, pause, and operator approvals obey configured caps and preserve operator authority. — T-005, T-006 (T-010 m9).
- **AC-6**: Security-hard gates, unresolved decisions, incompatible kernel, failed mandatory quality evidence, budget exhaustion, and ambiguous resume remain non-relaxable terminal conditions. — T-007 (T-010 m10).
- **AC-7**: Audit/repair ledgers make phase selection, retries, skips, stop reasons, and resume choices reproducible. — T-008 (T-010 m11).
- **AC-8**: Tests cover standard and compressed routes, mid-process resume, multi-item drain, work-kind conflicts, all terminal conditions, and behavior with autonomy disabled. — T-010 (m12; plus m1–m11 coverage).

## Task summaries (11 — T-anch + T-001..T-010)

- **T-anch** (NO-OP / verification): Verify `# US-0143` H1 + DEC-0143 Accepted + A1 + R-0141 DQ1–DQ10 + 12-marker list. Record to `sprints/S0151/t-anch-verification.md`. NO mutation to `architecture.md` / `DEC-0143.md` / R-0141 in /execute.
- **T-001** (AC-1): Lift `DEFERRED_COMMANDS` (`[]` or removed); `SCHEDULER_COMMANDS = ["/auto","/quick"]`; `CommandRouter.route` → `RouteScheduled`; compose-amend `test_us0140_command_coverage`. Keep `WORKFLOW_ROUTE_DEFERRED` unused for these two names. Nested `delivery-router.ts`. No Pi. No sibling package.
- **T-002** (AC-2): ConfigView consume-only lookups for five independent axes + `expandAutonomyPreset` before `runAuto`/`runQuick`. No new RuntimeConfig domain.
- **T-003** (AC-3): TS L8 `resolveDeliveryRoute` + `WORK_KIND_DELIVERY_MODE_CONFLICT` + golden vectors vs Python kit SOT. KernelBridge allowlist unamended.
- **T-004** (AC-2): Compressed graphs: `ultra_lean` skip `plan-verify` held; `mega_quick`/`/quick` nodes `execute` → `qa` → `verify-work` → `release` → `closure` → `refresh-context`; tests+acceptance+GateEngine non-skippable.
- **T-005** (AC-1/AC-5): WorkflowEngine `runAuto`/`runQuick` §14.4 `while run active`. Reuse `runExecuteQaLoop` + unamended `evaluateRelease`.
- **T-006** (AC-5): Drain/bulk/retry/skip/quiet/pause/approval caps from resolved config. Bug-queue axis default-off (`AUTO_BUG_QUEUE=0` this run — do not drain BUG-0024).
- **T-007** (AC-4/AC-6): YAML stop-matrix consume + AC-6 additive `security_hard`. `full` cannot relax AC-6.
- **T-008** (AC-7): Dual-write `RunsStore.audit` + `handoffs/autonomy_repair_ledger/<orchestrator_run_id>.jsonl`. Mid-resume `discardOrphans`. SQLite not stop/DONE SOT.
- **T-009** (AC-1): Critic-hook slot only (`scheduleSupplementaryHooks` when `CROSS_MODEL_REVIEW=1`). US-0144 content OUT.
- **T-010** (AC-1..AC-8): Twelve `test_us0143_*` markers (DEC-0143 §9). Primary `standalone/tests/contract` (`node:test`) Windows + Linux. Fake-model CI. In-memory SQLite. Count stays 12.

Execution order: T-anch → T-001 → T-002 → T-003 → T-004 → T-005 → T-006 → T-007 → T-008 → T-009 → T-010 (acyclic). No split (11 ≤ 12). Not `/quick`.

## AC → Task surjective coverage

| AC | Task(s) |
|---|---|
| AC-1 (lift + drain + critic hooks) | T-001, T-005, T-009 (T-010 m1–m2) |
| AC-2 (axes + compressed graphs) | T-002, T-004 (T-010 m3–m5) |
| AC-3 (L8 precedence) | T-003 (T-010 m6–m7) |
| AC-4 (preset expand + stop matrix) | T-002, T-007 (T-010 m8) |
| AC-5 (drain caps / operator authority) | T-005, T-006 (T-010 m9) |
| AC-6 (non-relaxable terminals) | T-007 (T-010 m10) |
| AC-7 (ledger + mid-resume) | T-008 (T-010 m11) |
| AC-8 (contract tests) | T-010 (m12; plus m1–m11) |
| DC / architecture baseline | T-anch |

**Surjectivity check**: 8/8 ACs covered (each AC ≥1 task) + primary acceptance.md US-0143 row covered by AC-1..AC-8 aggregate. T-010 markers m1–m12 attest AC-1..AC-8. No `PLAN_AC_COVERAGE_GAP`. T-anch retained as verification-only.

## Locked 12-marker table (DEC-0143 / architecture)

1. `test_us0143_auto_route_implemented`
2. `test_us0143_quick_route_implemented`
3. `test_us0143_standard_lifecycle_auto`
4. `test_us0143_compressed_ultra_lean_mega_quick`
5. `test_us0143_axis_independence`
6. `test_us0143_l8_precedence_start_from`
7. `test_us0143_work_kind_conflict`
8. `test_us0143_preset_expand_stop_matrix`
9. `test_us0143_drain_caps_operator_authority`
10. `test_us0143_nonrelaxable_terminals`
11. `test_us0143_audit_ledger_mid_resume`
12. `test_us0143_autonomy_disabled`

Primary: `standalone/tests/contract` (`node:test`) Windows + Linux. Fake-model CI. In-memory SQLite. No paid model calls. Count stays 12.

## Risks (R1–R6 — accepted)

| Risk | Severity | Mitigation |
|---|---|---|
| R1 `test_us0140_command_coverage` breaks when deferred is lifted | MEDIUM | T-001/T-010 m1–m2: compose-amend; keep US-0140 ACs DONE |
| R2 mega_quick node list bikeshed vs kit `["quick"]` macro | MEDIUM | T-004/T-010 m4: H1 pins nodes; tests+acceptance+GateEngine non-skippable |
| R3 Dual-write ledger drift vs repo artifacts | LOW | T-008/T-010 m11: SQLite non-authority; `RECOVERY_FALSE_COMPLETION` |
| R4 Operators treat `AUTONOMY_PRESET=full` as permission to skip hard stops | MEDIUM | T-007/T-010 m10: YAML `security_hard`; AC-6 non-relaxable |
| R5 L8 TS adapter drifts from Python kit SOT | LOW | T-003/T-010 m6–m7: golden vectors; Python remains kit SOT |
| R6 Drain accidentally picks BUG-0024 | LOW | T-006/T-010 m9: `AUTO_BUG_QUEUE=0`; sibling boundary tests |

## Compose guards (UNCHANGED)

| Target | Result |
|---|---|
| US-0140 / DEC-0140 / R-0135 | lift deferred only; 7-step unamended; GateEngine unamended; compose-amend coverage test |
| US-0118 / DEC-0118 / R-0106 | TS adapter + golden vectors; KernelBridge allowlist unamended |
| US-0119 / DEC-0119 / R-0107 | consume YAML; do not fork writer; do not weaken `security_hard` |
| US-0095 / DEC-0078 / R-0081 | native chain consume |
| US-0096 / DEC-0082 / R-0082 | ultra_lean skip-plan-verify held; mega_quick nodes pinned |
| US-0070 / DEC-0052 | phase policy consume |
| BUG-0006 / DEC-0051 | host scheduling-only; no in-process producer |
| US-0087 | bug-queue axis present; this run `AUTO_BUG_QUEUE=0` |
| US-0085 | `.env` deny |
| US-0056 / DEC-0038 | `compute_strict_proof_hash` tuple UNAMENDED |
| Kit npm `its-magic` / DEC-0120 | `files` whitelist omit `standalone/` |
| US-0141 / US-0142 | DONE compose only; not reopened |
| US-0144..US-0148 | OUT OF SCOPE (US-0144 content) |
| US-0133..US-0142 DONE | compose only, do not reopen |
| BUG-0021 DONE | not mutated (`sprints/S0146/`) |
| BUG-0022 OPEN | not mutated |
| BUG-0023 DONE | not mutated (`sprints/S0148/`) |
| BUG-0024 OPEN | not mutated / not drained (`R-0140`) |
| R-0120..R-0141 | not wiped (R-0138/R-0139/R-0140 intact) |
| US-0045 | Status stays OPEN |

## Execute phase role (per DEC-0051 / US-0069)

| Phase | Role | Isolation |
|---|---|---|
| /execute | dev (fresh per BUG-0006) | {phase_id:execute, role:dev} |
| /qa | qa (fresh) | {phase_id:qa, role:qa} — ultra_lean may overwrite plan-verify.json inside build+verify |
| /verify-work | qa (fresh) | {phase_id:verify-work, role:qa} |
| /release | release (fresh) | {phase_id:release, role:release} |
| /closure | qe (fresh) | {phase_id:closure, role:qe} |
| /refresh-context | curator (fresh) | {phase_id:refresh-context, role:curator} |

## Isolation evidence (US-0048 / DEC-0029 / US-0104 v2)

| Field | Value |
|---|---|
| phase_id | sprint-plan |
| role | tech-lead |
| story_id | US-0143 |
| sprint_id | S0151 |
| orchestrator_run_id | auto-20260913-us0143 |
| parent_orchestrator_run_id | auto-20260913-us0142 |
| delivery_mode | ultra_lean |
| macro_phase | plan |
| fresh_context_marker | tl-US0143-sprintplan-20260914T073000Z-fresh |
| timestamp | 2026-09-14T07:30:00Z (UTC) |
| model_id | cursor-grok-4.6-high (CROSS_MODEL_REVIEW=1 — required) |
| evidence_ref | sprints/S0151/sprint.md, tasks.md, progress.md, uat.json, uat.md, plan-verify.json (SKIPPED), summary.md, qa-findings.md, release-findings.md, closure-verification.md, handoffs/tl_to_dev.md, docs/engineering/state.md, handoffs/resume_brief.md, docs/product/backlog.md ## US-0143 sprint_plan_notes |

Prior phase proof consumed: `rp-auto-20260913-us0143-architecture-techlead-20260914T071000Z-US-0143` / `6FF1DB37B91284FDE90C5EC7058FF518605D49525BD8FACECB5AC570284F26E5` — RUNTIME_PROOF_VALID (independent `compute_strict_proof_hash` MATCH, consumed 2026-09-14T07:30:00Z before TTL 2026-09-14T08:10:00Z). Sovereign-critic architecture PASS (`rp-auto-20260913-us0143-sovereign-critic-techlead-20260914T072000Z-US-0143` / `D82C4ED7A5FFA6B6E63139AE250850C13B1945A6FDC20BB64394B76DA2E7E65F`; `critic-US0143-architecture-20260914T072000Z-fresh`; anti_slop=10; 0 blocking; degraded_mode=false; findings us0143arc-* informational — routed). MATCH before TTL 2026-09-14T08:20:00Z.

Sovereign memory: `SOVEREIGN_MEMORY=1`; `build_injection_digest_block` returned `(no sovereign memory entries)` (read-only). No `mistakes.jsonl` write.

## Runtime proof (DEC-0038)

| Field | Value |
|---|---|
| runtime_proof_id | rp-auto-20260913-us0143-sprint-plan-techlead-20260914T073000Z-US-0143 |
| phase_id | sprint-plan |
| role | tech-lead |
| story_id | US-0143 |
| sprint_id | S0151 |
| orchestrator_run_id | auto-20260913-us0143 |
| delivery_mode | ultra_lean |
| macro_phase | plan |
| model_id | cursor-grok-4.6-high (CROSS_MODEL_REVIEW=1 — required) |
| proof_issued_at | 2026-09-14T07:30:00Z |
| proof_ttl_seconds | 3600 |
| proof_ttl | 2026-09-14T08:30:00Z (UTC) |
| proof_hash | 63708536512D56BA8B5497D2C082299E4376DD495B12388125500454CACF46BE |
| canonical_payload | `{"orchestrator_run_id":"auto-20260913-us0143","phase_id":"sprint-plan","proof_issued_at":"2026-09-14T07:30:00Z","proof_ttl_seconds":3600,"role":"tech-lead","runtime_proof_id":"rp-auto-20260913-us0143-sprint-plan-techlead-20260914T073000Z-US-0143"}` |

Hash via `scripts.token_cost_lib.compute_strict_proof_hash` (positional, compact sorted-key JSON). Isolation extras (not hashed): `delivery_mode=ultra_lean`, `macro_phase=plan`, `model_id=cursor-grok-4.6-high`, `sprint_id=S0151`, `story_id=US-0143`. hash_recompute_confirmation=true (compute_strict_proof_hash → 63708536512D56BA8B5497D2C082299E4376DD495B12388125500454CACF46BE).

## Decision gate

| Field | Value |
|---|---|
| decision_gate | false |
| stop_conditions_met | yes |
| missing_acceptance_criteria | none (8/8 slices + primary acceptance row covered, 12 contract-test markers) |
| task_count | 11 (within SPRINT_MAX_TASKS=12, SPRINT_AUTO_SPLIT=1 but no split needed, 1:1 seeds, not /quick, not --bulk) |
| risks_finalized | 6/6 ACCEPTED (R1..R6) |
| approach | A1 locked |
| companion_DEC | DEC-0143 Accepted |
| plan-verify readiness | ultra_lean — plan-verify NOT in resolved_phase_plan, skipped, plan-verify.json is a SKIPPED placeholder (`ultra_lean_not_in_resolved_phase_plan`) |
| sovereign_memory_note | `build_injection_digest_block` returned `(no sovereign memory entries)` (read-only). No `mistakes.jsonl` write. |

## Definition of done (sprint-plan)

- [x] 11 tasks enumerated (T-anch + T-001..T-010) — within SPRINT_MAX_TASKS=12, 1:1 from architecture seeds
- [x] 8/8 ACs surjective + primary acceptance.md US-0143 covered
- [x] All 12 `test_us0143_*` mapped
- [x] Task dependency graph documented
- [x] Execute phase role matrix documented (ultra_lean — /plan-verify skipped, next = sovereign-critic then /execute)
- [x] Compose guards UNCHANGED
- [x] Critic carry-ins (3 non-blocking from architecture sovereign-critic) routed as execute awareness, sprint id locked S0151
- [x] Isolation evidence + runtime proof emitted (model_id=cursor-grok-4.6-high present)
- [x] Sprint-plan checkpoint appended to docs/engineering/state.md
- [x] Sprint-plan handoff prepended to handoffs/tl_to_dev.md
- [x] Sprint-plan PASS prepended to handoffs/resume_brief.md (→ sovereign-critic then /execute, not plan-verify)
- [x] UAT placeholders written (uat.json empty steps, uat.md ACs no results)
- [x] Lifecycle stubs written (summary.md, qa-findings.md, release-findings.md, closure-verification.md)
- [x] Traceability row added (Story=US-0143, Sprint=S0151, Tasks=T-anch+T-001..T-010, Status=PLANNED, Evidence empty)
- [x] Backlog status OPEN (US-0045 — not mutated), acceptance unchecked, sprint_plan_notes appended
- [x] plan-verify.json SKIPPED placeholder (not a QA phase)

## Next scheduled phase

| Field | Value |
|---|---|
| next_scheduled_phase | sovereign-critic (sprint-plan, CROSS_MODEL_REVIEW=1) then /execute (role=dev per US-0069 / DEC-0051, fresh dev subagent per BUG-0006, first canonical phase of build+verify macro per ultra_lean, plan-verify NOT in resolved_phase_plan — skipped) |
| next_scheduled_role | tech-lead (critic of sprint-plan), then dev |
| next_sprint_macro | build+verify (ultra_lean — plan-verify skipped at this boundary) |
| stop_condition | STOP after sprint-plan completes, hand off via artifacts only. Orchestrator MUST spawn sovereign-critic of sprint-plan then /execute in fresh dev subagent per BUG-0006. Do not spawn /execute, /plan-verify, or critic from this subagent. |
