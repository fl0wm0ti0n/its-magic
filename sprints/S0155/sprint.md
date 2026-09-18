# Sprint S0155 — Sprint Plan (US-0145)

## Metadata

| Field | Value |
|---|---|
| story_id | US-0145 |
| bug_id | BUG-0006 / US-0048 isolation (fresh tech-lead; not a bug-queue drain) |
| story_title | Parallel development, release/deploy, self-healing, and closure |
| sprint_id | **S0155** (locked — new folder; S0154 = US-0147 DONE; do not reuse) |
| delivery_mode | ultra_lean |
| macro_phase | plan (sprint-plan terminal for plan macro; plan-verify NOT in resolved_phase_plan — skipped; next = /execute dev → build+verify macro) |
| current_phase | sprint-plan |
| approach | A1 (A*) — nested `workflow/delivery/` + `runDeliveryOperation` bridge + default-off flags + QA arbiter + ReleaseTargetAdapter registry + additive gates + bounded post-deploy healing; R-0145 DQ1–DQ10 LOCKED; DEC-0145 Accepted |
| companion_DEC | DEC-0145 (Accepted) |
| research_anchor | R-0145 (DQ1–DQ10 LOCKED) |
| architecture_anchor | docs/engineering/architecture.md # US-0145 |
| orchestrator_run_id | auto-20260917-us0146 |
| parent_orchestrator_run_id | auto-20260913-us0144 |
| fresh_context_marker | tl-US0145-sprintplan-20260917T224500Z-fresh |
| timestamp | 2026-09-17T22:45:00Z (UTC) |
| model_id | inherit (CROSS_MODEL_REVIEW=0) |
| verdict | PASS |
| decision_gate | false |
| SPRINT_MAX_TASKS | 12 |
| SPRINT_AUTO_SPLIT | 1 |
| task_count | 12 (T-anch + T-001..T-011; at cap; no split; 1:1 from architecture seeds) |
| COMPONENT_SCOPE_MODE | 0 |
| USER_GUIDE_MODE | 0 |
| plan-verify | ultra_lean — NOT in resolved_phase_plan; skipped; plan-verify.json optional SKIPPED placeholder only (not a QA phase); reason=`ultra_lean_skipped` |
| backlog_status | OPEN (US-0045 — not mutated; AC-1..AC-9 unchecked) |
| sprint_id_lock | **S0155** for US-0145. S0154 = US-0147 released. |

## Scope summary

Deliver optional parallel DEV arbitration (`ParallelDevCoordinator`, worktrees under `.its-magic/worktrees/<run_id>/`, QA arbiter session) and typed release/deploy with bounded post-deploy self-healing (`ReleaseDeployPipeline`, `ReleaseTargetAdapter` kinds, deploy results ledger), composing US-0108/US-0109 via `scripts/delivery_runtime_bridge.py` and `KernelBridge.runDeliveryOperation` without rewriting US-0143 drain or amending `RELEASE_GATE_ORDER` literal. Default-off: `SOVEREIGN_PARALLEL_DEV=0`, `AUTO_SOVEREIGN_SELF_HEALING_DEPLOY=0`. Compose US-0140 closure/release ownership, US-0146 observe-only, US-0147 install paths (no deploy install coupling).

Out of scope: US-0148 daemon/protocol; live npm-publish/git-push in tests; `.env` reads; rewriting US-0140..US-0147 DONE packages; kit `cli.json` / plugin `tui.json`; `auto.md` restore; marking US-0145 DONE; ticking AC; reopening US-0140..US-0147 DONE.

## Acceptance criteria (9) — US-0145 (status OPEN, unchecked per US-0045)

Primary acceptance (`docs/product/acceptance.md` US-0145 row): Parallel development, release/deploy, self-healing, and closure — worktree arbitration, resource caps, target gates, bounded repair, and ownership.

- **AC-1**: Parallel DEV creates isolated worktrees with distinct sessions/models, independent tests, and no mutation of the main working tree before arbitration. — T-002, T-003 (T-011 m1,m2).
- **AC-2**: Resource guards cap instances, tokens/cost, CPU/RAM, worktrees, concurrent tests/browsers, and wall-clock time. — T-005 (T-011 m3).
- **AC-3**: A fresh QA arbiter compares candidate evidence, selects or rejects a winner, and performs a controlled merge with conflict/failure evidence. — T-004 (T-011 m4,m5).
- **AC-4**: Typed release targets support git/GitHub, npm, SSH command, Docker, custom command, and existing release-trigger/changelog contracts where configured. — T-006 (T-011 m6).
- **AC-5**: Publish/deploy requires the canonical test, QA, UAT, release-artifact, approval, and target-policy gates and emits auditable target results. — T-006, T-007, T-009 (T-011 m6,m7,m8).
- **AC-6**: Post-deploy smoke captures runtime/browser evidence and may spawn a fresh DEV repair/rebuild/release/redeploy loop under a strict cap. — T-008 (T-011 m9,m10).
- **AC-7**: Exhausted deploy repair records the canonical deferral/reason; no failed deploy is reported as released. — T-008, T-009 (T-011 m8,m10).
- **AC-8**: Successful release transitions to separate closure, which alone reconciles story/acceptance/status and then routes refresh-context. — T-010 (T-011 m11,m12).
- **AC-9**: Tests cover candidate isolation/arbitration, resource exhaustion, target failure, smoke repair success/exhaustion, and release/closure ownership violations. — T-011 (full twelve-marker matrix).

## Task summaries (12 — T-anch + T-001..T-011)

- **T-anch** (NO-OP / verification): Verify `# US-0145` H1 + DEC-0145 Accepted + R-0145 DQ1–DQ10 + twelve `test_us0145_*` IDs + path/bridge pins. Record to `sprints/S0155/t-anch-verification.md`. NO mutation to `architecture.md` / `DEC-0145.md` / R-0145 in /execute.
- **T-001** (foundation): `scripts/delivery_runtime_bridge.py` + `runDeliveryOperation` closed surface on kernel-bridge.
- **T-002** (AC-1): `ParallelDevCoordinator` + WorkflowEngine post-execute hook (`SOVEREIGN_PARALLEL_DEV` default-off).
- **T-003** (AC-1): Worktree bridge ops + PolicyEngine allowlist for `.its-magic/worktrees/`.
- **T-004** (AC-3): QA arbiter session + evidence packages + merge/reject paths.
- **T-005** (AC-2): `DeliveryResourceGuard` + delivery reason codes.
- **T-006** (AC-4, AC-5): `ReleaseTargetAdapter` registry + dry-run/apply/verify + `handoffs/deploy_results/deploy_results.jsonl`.
- **T-007** (AC-5): Additive `ReleaseGateInput` conjuncts (`RELEASE_GATE_ORDER` array frozen).
- **T-008** (AC-6, AC-7): `ReleaseDeployPipeline` + post-deploy healing bridge ops.
- **T-009** (AC-5, AC-7): Deferral/truthfulness (`DEPLOY_DEFERRED`, release evidence fail-closed).
- **T-010** (AC-8): Closure/release ownership guards compose US-0140 (`releaseCannotMarkDone`, `applyClosure`).
- **T-011** (AC-1..AC-9): Twelve `standalone/tests/contract/us0145.contract.test.ts` markers (fake git/target doubles).

Execution order: T-anch → T-001 → T-002 → T-003 → T-004 → T-005 → T-006 → T-007 → T-008 → T-009 → T-010 → T-011 (acyclic). At cap (12 ≤ 12). Not `/quick`.

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
| DC / architecture baseline | T-anch |

**Surjectivity check**: 9/9 ACs covered + primary acceptance.md US-0145 row covered. No `PLAN_AC_COVERAGE_GAP`.

## Locked 12-marker table (DEC-0145 / architecture `# US-0145`)

1. `test_us0145_parallel_default_off_byte_identical`
2. `test_us0145_worktree_isolation_no_main_mutation`
3. `test_us0145_resource_guard_fail_closed`
4. `test_us0145_qa_arbiter_fresh_session_winner_merge`
5. `test_us0145_qa_arbiter_reject_all_evidence`
6. `test_us0145_release_target_matrix_dry_run`
7. `test_us0145_release_gates_compose_order_unchanged`
8. `test_us0145_deploy_target_failure_no_release_pass`
9. `test_us0145_smoke_repair_success_bounded`
10. `test_us0145_smoke_repair_exhausted_deferred`
11. `test_us0145_release_cannot_mark_done`
12. `test_us0145_closure_requires_valid_release_envelope`

Primary: hermetic `node:test` contract doubles; no live npm publish, git push, or paid network.

## Risks (architecture-owned — accepted)

| Risk | Severity | Mitigation |
|---|---|---|
| Git worktree flaky on Windows | HIGH | Fake-git doubles; fail-closed create |
| Gate order regression | HIGH | Golden test on `RELEASE_GATE_ORDER` literal |
| Release marks DONE | HIGH | `test_us0145_release_cannot_mark_done` + `releaseCannotMarkDone` |
| US-0143 drain creep | MEDIUM | Coordinator orthogonal; no CommandRouter edits |
| US-0148 scope creep | MEDIUM | In-process delivery only; daemon OUT |

## Compose guards (UNCHANGED)

| Target | Result |
|---|---|
| US-0140..US-0147 | DONE compose-only (US-0143 drain, US-0146 observe, US-0147 install IN) |
| US-0148 | OUT OF SCOPE |
| BUG-0022 | OPEN not drained |
| US-0045 | Status stays OPEN |
| US-0085 | `.env` deny |
| `.opencode/commands/auto.md` | do not restore |
| DEC-0038 tuple | UNAMENDED |

## Execute phase role (per DEC-0051 / US-0069)

| Phase | Role | Isolation |
|---|---|---|
| /execute | dev (fresh per BUG-0006) | {phase_id:execute, role:dev} |
| /qa | qa (fresh) | {phase_id:qa, role:qa} |
| /verify-work | qa (fresh) | {phase_id:verify-work, role:qa} |
| /release | release (fresh) | {phase_id:release, role:release} |
| /closure | qe (fresh) | {phase_id:closure, role:qe} |
| /refresh-context | curator (fresh) | {phase_id:refresh-context, role:curator} |

## Isolation evidence (US-0048 / DEC-0029 / US-0104 v2)

| Field | Value |
|---|---|
| phase_id | sprint-plan |
| role | tech-lead |
| story_id | US-0145 |
| sprint_id | S0155 |
| orchestrator_run_id | auto-20260917-us0146 |
| parent_orchestrator_run_id | auto-20260913-us0144 |
| delivery_mode | ultra_lean |
| macro_phase | plan |
| drain_story_index | 3 of 3 |
| fresh_context_marker | tl-US0145-sprintplan-20260917T224500Z-fresh |
| timestamp | 2026-09-17T22:45:00Z (UTC) |
| model_id | inherit (CROSS_MODEL_REVIEW=0) |
| evidence_ref | sprints/S0155/sprint.md, tasks.md, progress.md, handoffs/tl_to_dev.md, docs/engineering/state.md, handoffs/resume_brief.md, docs/product/backlog.md ## US-0145 |

Consumed architecture proof (independent `compute_strict_proof_hash` MATCH; not STALE at consume 2026-09-17T22:45:00Z):

- Architecture producer: `rp-auto-20260917-us0146-architecture-techlead-20260917T223000Z-US-0145` / `80F3C316829DD9A44996EE4BD61E4FF3AAC0FCF3DC276D02B7FC9585FDA5FBE9` — RUNTIME_PROOF_VALID before TTL `2026-09-17T23:30:00Z`.

## Runtime proof (DEC-0038)

| Field | Value |
|---|---|
| runtime_proof_id | rp-auto-20260917-us0146-sprint-plan-techlead-20260917T224500Z-US-0145 |
| phase_id | sprint-plan |
| role | tech-lead |
| story_id | US-0145 |
| sprint_id | S0155 |
| orchestrator_run_id | auto-20260917-us0146 |
| delivery_mode | ultra_lean |
| macro_phase | plan |
| model_id | inherit (CROSS_MODEL_REVIEW=0) |
| proof_issued_at | 2026-09-17T22:45:00Z |
| proof_ttl_seconds | 3600 |
| proof_ttl | 2026-09-17T23:45:00Z (UTC) |
| proof_hash | 1D245D8D23B03B11DC8AF39FB6A6E5FCC59562510A2F4AA365D708E9ADF947BC |
| canonical_payload | `{"orchestrator_run_id":"auto-20260917-us0146","phase_id":"sprint-plan","proof_issued_at":"2026-09-17T22:45:00Z","proof_ttl_seconds":3600,"role":"tech-lead","runtime_proof_id":"rp-auto-20260917-us0146-sprint-plan-techlead-20260917T224500Z-US-0145"}` |

Hash via `scripts.token_cost_lib.compute_strict_proof_hash` (positional, compact sorted-key JSON). Isolation extras (not hashed): `delivery_mode=ultra_lean`, `macro_phase=plan`, `model_id=inherit`, `sprint_id=S0155`, `story_id=US-0145`, `drain_story_index=3 of 3`. hash_recompute_confirmation=true.

## Decision gate

| Field | Value |
|---|---|
| decision_gate | false |
| stop_conditions_met | yes |
| missing_acceptance_criteria | none (9/9 surjective + twelve contract markers) |
| task_count | 12 (at SPRINT_MAX_TASKS=12; no split; 1:1 seeds) |
| companion_DEC | DEC-0145 Accepted |
| plan-verify readiness | SKIPPED (`ultra_lean_skipped`; CROSS_MODEL_REVIEW=0 — no critic) |

## Definition of done (sprint-plan)

- [x] 12 tasks enumerated (T-anch + T-001..T-011) — at SPRINT_MAX_TASKS=12 cap
- [x] 9/9 ACs surjective + primary acceptance.md US-0145 covered
- [x] All twelve architecture-owned `test_us0145_*` named
- [x] Execute phase role matrix documented
- [x] Compose guards UNCHANGED
- [x] Isolation evidence + runtime proof emitted
- [x] Sprint-plan checkpoint appended to docs/engineering/state.md
- [x] Sprint-plan handoff prepended to handoffs/tl_to_dev.md
- [x] SPRINT_PLAN_PASS prepended to handoffs/resume_brief.md (→ /execute dev)
- [x] Traceability row added (Status=PLANNED)
- [x] Backlog status OPEN; acceptance unchecked
- [x] plan-verify skipped per ultra_lean (no QA spawn)

## Next scheduled phase

| Field | Value |
|---|---|
| next_scheduled_phase | `/execute` (role=dev per US-0069 / DEC-0051, fresh dev subagent per BUG-0006; first canonical phase of build+verify macro; plan-verify NOT in resolved_phase_plan — skipped; CROSS_MODEL_REVIEW=0 — no sovereign-critic) |
| next_scheduled_role | dev |
| next_sprint_macro | build+verify |
| stop_condition | STOP after sprint-plan completes; hand off via artifacts only. Orchestrator MUST spawn `/execute` in fresh dev subagent per BUG-0006. Do not spawn /execute, /plan-verify, or critic from this subagent. |
