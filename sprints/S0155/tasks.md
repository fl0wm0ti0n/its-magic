# Sprint S0155 — Task checklist (US-0145)

Total tasks: 12 (T-anch + T-001..T-011). SPRINT_MAX_TASKS=12; SPRINT_AUTO_SPLIT=1; no split (at cap). T-anch retained as NO-OP verification. Seeds 1:1 from `docs/engineering/architecture.md` `# US-0145`. Sprint id **S0155** locked (S0154 = US-0147 — do not reuse).

**Isolation**: `tl-US0145-sprintplan-20260917T224500Z-fresh` · `model_id=inherit` · `orchestrator_run_id=auto-20260917-us0146`

## Task execution order

1. T-anch (NO-OP / verification)
2. T-001 (delivery bridge + kernel surface)
3. T-002 (ParallelDevCoordinator + WorkflowEngine hook)
4. T-003 (worktree ops + PolicyEngine allowlist)
5. T-004 (QA arbiter session + evidence)
6. T-005 (DeliveryResourceGuard)
7. T-006 (ReleaseTargetAdapter registry + ledger)
8. T-007 (additive ReleaseGateInput)
9. T-008 (ReleaseDeployPipeline + healing)
10. T-009 (deferral/truthfulness)
11. T-010 (closure/release ownership guards)
12. T-011 (twelve `test_us0145_*`)

## Task checklist

- [x] **T-anch**: Verify `# US-0145` H1 in `docs/engineering/architecture.md`; DEC-0145 Accepted; R-0145 DQ1–DQ10 LOCKED; twelve-marker table locked; path/module pins (`workflow/delivery/*`, `delivery_runtime_bridge.py`, `runDeliveryOperation`, `.its-magic/worktrees/`, deploy ledger); compose guards (US-0140..US-0147 DONE; US-0148 OUT; default-off flags; no `RELEASE_GATE_ORDER` amend). Record to `sprints/S0155/t-anch-verification.md`. NO mutation to `architecture.md` / `DEC-0145.md` / R-0145 in /execute. (DC / architecture baseline; NO-OP)

- [x] **T-001**: Implement `scripts/delivery_runtime_bridge.py` dispatching to `parallel_dev_arbiter.py` / `self_healing_deploy_lib.py`; add closed `KernelBridge.runDeliveryOperation(op, payload)` surface mirroring sovereign bridge pattern. (foundation)

- [x] **T-002**: Add `standalone/packages/runtime-core/src/workflow/delivery/parallel-dev.ts` `ParallelDevCoordinator`; wire WorkflowEngine post-execute hook after execute PASS; `SOVEREIGN_PARALLEL_DEV=0` default-off byte-identical path. (AC-1)

- [x] **T-003**: Bridge ops `parallel_dev_create_worktrees`, `parallel_dev_list_active`, `parallel_dev_cleanup_orphans`, `parallel_dev_merge_winner`, `parallel_dev_spawn`; roots `.its-magic/worktrees/<run_id>/`; PolicyEngine allowlist additive; `PARALLEL_DEV_WORKTREE_CREATE_FAILED` fail-closed. (AC-1)

- [x] **T-004**: Fresh `qa-arbiter` role-runtime session; evidence packages; winner merge vs `reject_all` / merge conflict paths; `handoffs/parallel_dev_pick.json` v1. (AC-3)

- [x] **T-005**: `standalone/packages/runtime-core/src/workflow/delivery/resource-guard.ts` `DeliveryResourceGuard`; scratchpad + US-0080 caps; reason codes `PARALLEL_DEV_RESOURCE_CAP_EXHAUSTED`, `DELIVERY_WALL_CLOCK_EXCEEDED`, `DELIVERY_TOKEN_BUDGET_EXHAUSTED`, `DELIVERY_CONCURRENT_TEST_CAP`. (AC-2)

- [x] **T-006**: `release-deploy.ts` `ReleaseTargetKind` + `ReleaseTargetAdapter` registry (`git_github`, `npm`, `ssh_command`, `docker`, `custom_command`); dryRun/apply/verify; append `DeployTargetResult` to `handoffs/deploy_results/deploy_results.jsonl`. (AC-4, AC-5)

- [x] **T-007**: Extend `ReleaseGateInput` additively with `deploy_targets_pass`, `approval_granted`, `target_policy_ok` inside `createGateEngine().evaluate()` without amending `RELEASE_GATE_ORDER` array literal. (AC-5)

- [x] **T-008**: `ReleaseDeployPipeline.runPostDeployHealing()`; bridge ops `deploy_smoke_probe`, `deploy_healing_retry`; bounded repair loop; compose US-0142 browser read APIs when configured. (AC-6, AC-7)

- [x] **T-009**: Wire `DEPLOY_DEFERRED` / `DEPLOY_HEALING_DEFERRED`; `writeReleaseEvidence` fail-closed when required targets not OK; no `RELEASE_PASS` while deferred; US-0146 `deploy_state=deferred` metadata path. (AC-5, AC-7)

- [x] **T-010**: Enforce `releaseCannotMarkDone()` on release writers; `applyClosure()` sole DONE authority; compose US-0140 closure envelope rules. (AC-8)

- [x] **T-011**: Create twelve hermetic `standalone/tests/contract/us0145.contract.test.ts` markers exactly: `test_us0145_parallel_default_off_byte_identical`, `test_us0145_worktree_isolation_no_main_mutation`, `test_us0145_resource_guard_fail_closed`, `test_us0145_qa_arbiter_fresh_session_winner_merge`, `test_us0145_qa_arbiter_reject_all_evidence`, `test_us0145_release_target_matrix_dry_run`, `test_us0145_release_gates_compose_order_unchanged`, `test_us0145_deploy_target_failure_no_release_pass`, `test_us0145_smoke_repair_success_bounded`, `test_us0145_smoke_repair_exhausted_deferred`, `test_us0145_release_cannot_mark_done`, `test_us0145_closure_requires_valid_release_envelope`. Fake git/target doubles only. (AC-1..AC-9)

## Locked 12-marker table

| # | Marker | AC |
|---|---|---|
| 1 | `test_us0145_parallel_default_off_byte_identical` | AC-1 |
| 2 | `test_us0145_worktree_isolation_no_main_mutation` | AC-1 |
| 3 | `test_us0145_resource_guard_fail_closed` | AC-2 |
| 4 | `test_us0145_qa_arbiter_fresh_session_winner_merge` | AC-3 |
| 5 | `test_us0145_qa_arbiter_reject_all_evidence` | AC-3 |
| 6 | `test_us0145_release_target_matrix_dry_run` | AC-4 |
| 7 | `test_us0145_release_gates_compose_order_unchanged` | AC-5 |
| 8 | `test_us0145_deploy_target_failure_no_release_pass` | AC-5, AC-7 |
| 9 | `test_us0145_smoke_repair_success_bounded` | AC-6 |
| 10 | `test_us0145_smoke_repair_exhausted_deferred` | AC-6, AC-7 |
| 11 | `test_us0145_release_cannot_mark_done` | AC-8, AC-9 |
| 12 | `test_us0145_closure_requires_valid_release_envelope` | AC-8, AC-9 |

## Integration verification (post T-011)

- [ ] Test gate: twelve/twelve `test_us0145_*` green; US-0146/0147 compose tests still green
- [ ] Bridge gate: closed `runDeliveryOperation` op set matches architecture table
- [ ] Scope gate: no credentials / `.env` reads; no US-0148 daemon; no `RELEASE_GATE_ORDER` literal change
- [ ] Status gate: US-0145 remains OPEN; AC-1..AC-9 unchecked; US-0140..US-0147 remain DONE

## AC → Task surjective coverage

| AC | Task(s) |
|---|---|
| AC-1 | T-002, T-003 (T-011 m1,m2) |
| AC-2 | T-005 (T-011 m3) |
| AC-3 | T-004 (T-011 m4,m5) |
| AC-4 | T-006 (T-011 m6) |
| AC-5 | T-006, T-007, T-009 (T-011 m6,m7,m8) |
| AC-6 | T-008 (T-011 m9,m10) |
| AC-7 | T-008, T-009 (T-011 m8,m10) |
| AC-8 | T-010 (T-011 m11,m12) |
| AC-9 | T-011 (full matrix) |
| DC / architecture | T-anch |

**Surjectivity check**: 9/9 ACs covered. No `PLAN_AC_COVERAGE_GAP`.
