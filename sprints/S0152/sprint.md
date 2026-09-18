# Sprint S0152 - Sprint Plan (US-0144)

## Metadata

| Field | Value |
|---|---|
| story_id | US-0144 |
| bug_id | BUG-0006 / US-0048 isolation (fresh tech-lead; not a bug-queue drain) |
| story_title | Sovereign runtime composition |
| sprint_id | **S0152** (locked — folder existed PLANNED; this phase attests/refines body; do not invent a new id) |
| delivery_mode | ultra_lean |
| macro_phase | plan (sprint-plan terminal; plan-verify NOT in resolved_phase_plan — skipped; next = sovereign-critic of sprint-plan then execute) |
| current_phase | sprint-plan |
| approach | Nested `SovereignRuntime` in `@its-magic/runtime-core` (R-0142 DQ1–DQ10 LOCKED; DEC-0144 Accepted attested) |
| companion_DEC | DEC-0144 (Accepted — attested; heading not duplicated this phase) |
| research_anchor | R-0142 (DQ1–DQ10 LOCKED; 9-op KernelBridge including `deferral_append`/`deferral_list`; R-0141 remains US-0143) |
| architecture_anchor | docs/engineering/architecture.md # US-0144 |
| orchestrator_run_id | auto-20260913-us0144 |
| parent_orchestrator_run_id | auto-20260913-us0143 |
| fresh_context_marker | tl-US0144-sprintplan-20260915T190058Z-fresh |
| timestamp | 2026-09-15T19:00:58Z (UTC) |
| model_id | cursor-grok-4.6-high (CROSS_MODEL_REVIEW=1 — required on isolation) |
| verdict | PASS |
| decision_gate | false |
| SPRINT_MAX_TASKS | 12 |
| SPRINT_AUTO_SPLIT | 1 |
| task_count | 11 (T-anch + T-001..T-010, within 12, no split, 1:1 from architecture seeds) |
| COMPONENT_SCOPE_MODE | 0 |
| USER_GUIDE_MODE | 0 |
| plan-verify | ultra_lean — NOT in resolved_phase_plan; skipped; plan-verify.json written as SKIPPED placeholder only (not a QA phase); reason=`ultra_lean_skipped` (alias `ultra_lean_not_in_resolved_phase_plan`) |
| backlog_status | OPEN (US-0045 — not mutated; AC-1..AC-8 unchecked) |
| sprint_id_lock | **S0152** attested in place. Do not reuse S0146 (BUG-0021), S0147 (US-0140), S0148 (BUG-0023), S0149 (US-0141), S0150 (US-0142), or S0151 (US-0143). |
| critic_carry_ins | 0 blocking; 3 architecture critic NBs us0144arc-* status=resolved non-blocking — NB1 flag-quadrant→marker binding closed this phase; NB2/NB3 routed as execute awareness |

## Scope summary

Implement the opt-in sovereign runtime contract from DEC-0144 / R-0142 inside `@its-magic/runtime-core`. Closed 9-op `KernelBridge.runSovereignOperation()`: `memory_digest`, `critic_model`, `role_review_plan`, `decision_session_append`, `deferral_append`, `deferral_list`, `drain_candidate_gate`, `convergence_evaluate`, `partial_delivery_write`. Fixed dispatcher `scripts/sovereign_runtime_bridge.py`. Default `SOVEREIGN_RUNTIME=0`: no sovereign bridge call, memory read, sidecar write, sovereign review, convergence evaluation, or sovereign candidate gate. US-0143 `CROSS_MODEL_REVIEW=1` scheduling-only critic session remains unchanged while sovereign runtime is disabled. `gateDrainCandidate()` is exclusive only for US-0144 sovereign-generated candidates. Twelve hermetic `test_us0144_*` (architecture-owned IDs). Four `CROSS_MODEL_REVIEW` × `SOVEREIGN_RUNTIME` quadrants live inside those twelve — not a thirteenth test. Execute owns code files.

Out of scope: sibling sovereign package; Pi; arbitrary KernelBridge script runner; TypeScript ports of Python sovereign schemas; GateEngine `RELEASE_GATE_ORDER` rewrite; US-0143 CommandRouter / `runAuto` / `runQuick` / drain rewrite; US-0145 parallel/deploy; US-0146 CLI/TUI; `.opencode/commands/auto.md` restore; kit `files` include `standalone/`; `.env` reads; marking US-0144 DONE; ticking AC checkboxes; reopening US-0143 / US-0133..US-0142; mutating BUG-*.

## Execute awareness (architecture critic NBs — 0 blocking)

Sovereign-critic of architecture PASS (`critic-US0144-architecture-20260915T185540Z-fresh`; anti_slop=10; 0 blocking; degraded_mode=false). Consumed architecture proof MATCH before TTL. Route these resolved NBs as execute awareness — do not re-open them as work:

| Finding | Issue key | Execute awareness |
|---|---|---|
| us0144arc-challenger-001 | ik_us0144arc_proof_failclosed_pass | T-010: bind and assert the four `CROSS_MODEL_REVIEW`×`SOVEREIGN_RUNTIME` quadrants on the named markers in the Flag-quadrant binding table (closed this sprint-plan). Nine-op set; default-off; `gateDrainCandidate` exclusive for sovereign-generated candidates; `KERNEL_SOVEREIGN_*` fail-closed; torn sidecar fail-closed; blocking-only convergence. Never read `.env`. Status OPEN. |
| us0144arc-architect-002 | ik_us0144arc_layer_sprintplan_owns_next | Keep **T-anch..T-010 1:1** from architecture seeds; sprint folder is **S0152**. Architecture owns H1+DEC-0144; execute owns `sovereign_runtime_bridge.py` + runtime-core lift + 12 tests. Do not rewrite GateEngine/`RELEASE_GATE_ORDER` or US-0143 drain. |
| us0144arc-subtractor-003 | ik_us0144arc_scope_yagni_pass | T-anch ceremony overlap acceptable. Do not invent extra tasks or a 13th flag-combo test. Do not add a sibling package. Do not restore `auto.md`. Do not mark US-0144 DONE. Do not reopen US-0143. Do not design US-0145+. 12 markers required. 11 tasks within SPRINT_MAX_TASKS=12. |

## Acceptance criteria (8) — US-0144 (status OPEN, unchecked per US-0045)

Primary acceptance (`docs/product/acceptance.md` US-0144 row): Sovereign memory, reviews, and convergence — decision ledger, bounded memory, critics, deferrals, evidence-based convergence, and contract tests (8 ACs).

- **AC-1**: Autonomous decisions append model/session/run-aware entries to the existing decision ledger and QA can verify plan fidelity. — T-001, T-002, T-006 (T-010 m1, m2, m7, m8).
- **AC-2**: Sovereign memory remains repository-owned and only a ranked, size-capped digest enters each relevant session. — T-003, T-004 (T-010 m3, m4).
- **AC-3**: Role-manifest obligations and Challenger/Architect/Subtractor critic lenses execute as fresh review sessions without replacing producer roles. — T-005 (T-010 m6).
- **AC-4**: Different producer/critic models are used when available, with configured critic pinning and explicit degraded same-model semantics. — T-004 (T-010 m5; Q11).
- **AC-5**: Deferral processing and drain-generate preserve mandatory operator decision gates and append-only evidence. — T-007 (T-010 m9, m10).
- **AC-6**: Convergence is evaluated by code and evidence; only blocking open critic findings block critic convergence, eligible non-blocking same-run findings can resolve, and approved smoke surrogates never claim fake browser PASS. — T-008 (T-010 m11).
- **AC-7**: Goal progress, partial delivery, token/cost caps, iteration caps, and non-convergence reasons are operator-visible. — T-008 (T-010 m12).
- **AC-8**: Contract tests cover producer/critic separation, model collision, memory bounds, deferrals, convergence success/failure, and current critic/smoke fixes. — T-009, T-010 (m1–m12 + four flag quadrants).

## Task summaries (11 — T-anch + T-001..T-010)

- **T-anch** (NO-OP / verification): Verify `# US-0144` H1 + DEC-0144 Accepted + R-0142 DQ1–DQ10 + 9-op set + 12-marker list + flag-quadrant table. Record to `sprints/S0152/t-anch-verification.md`. NO mutation to `architecture.md` / `DEC-0144.md` / R-0142 in /execute.
- **T-001** (AC-1): Typed, manifest-admitted `KernelBridge.runSovereignOperation()` for exactly the nine operations. Additive `sovereign_operations` in `kernel-contract.json`. No arbitrary executable/args/schema selection.
- **T-002** (AC-1): Fixed `scripts/sovereign_runtime_bridge.py` dispatcher and closed envelopes; existing sovereign Python library schemas unmodified.
- **T-003** (AC-2): Immutable pre-spawn bootstrap (phase context → bounded digest → role objective) and supervisor one-delivery attestation.
- **T-004** (AC-2, AC-4): Bounded memory digest plus pinned critic-model / degraded-mode operation.
- **T-005** (AC-3): Supplementary role-review dispatch and structured hook result (never producer replacement).
- **T-006** (AC-1): Append-only decision-session sidecar with fail-closed ledger pairing and QA plan-fidelity evidence.
- **T-007** (AC-5): Sovereign-generated candidate decision gate plus `deferral_append`/`deferral_list`. Explicit `SOVEREIGN_DRAIN_AUTO_ACCEPT=0` beats preset.
- **T-008** (AC-6, AC-7): Code-evaluated convergence, cap state, and partial delivery evidence. Smoke surrogates never assert browser success.
- **T-009** (AC-8): Default-off configuration, exports, and compatibility matrix (`SOVEREIGN_RUNTIME=0`).
- **T-010** (AC-1..AC-8): Twelve hermetic architecture-owned `test_us0144_*` plus the four flag-quadrant bindings.

Execution order: T-anch → T-001 → T-002 → T-003 → T-004 → T-005 → T-006 → T-007 → T-008 → T-009 → T-010 (acyclic). No split (11 ≤ 12). Not `/quick`.

## AC → Task surjective coverage

| AC | Task(s) |
|---|---|
| AC-1 (ledger + sidecar + plan fidelity) | T-001, T-002, T-006 (T-010 m1, m2, m7, m8) |
| AC-2 (bounded digest pre-spawn) | T-003, T-004 (T-010 m3, m4) |
| AC-3 (supplementary reviews) | T-005 (T-010 m6) |
| AC-4 (critic pin + degraded) | T-004 (T-010 m5) |
| AC-5 (deferral + drain gate) | T-007 (T-010 m9, m10) |
| AC-6 (blocking-only convergence / smoke truth) | T-008 (T-010 m11) |
| AC-7 (caps / progress / partial delivery) | T-008 (T-010 m12) |
| AC-8 (contract tests + default-off matrix) | T-009, T-010 (m1–m12 + Q00/Q10/Q01/Q11) |
| DC / architecture baseline | T-anch |

**Surjectivity check**: 8/8 ACs covered (each AC ≥1 task) + primary acceptance.md US-0144 row covered by AC-1..AC-8 aggregate. T-010 markers m1–m12 attest AC-1..AC-8. No `PLAN_AC_COVERAGE_GAP`. T-anch retained as verification-only.

## Locked 12-marker table (DEC-0144 / architecture `# US-0144`)

Reconciled from prior S0152 stub names to architecture-owned IDs (sprint-plan may reconcile; execute must use these exact IDs):

1. `test_us0144_kernel_bridge_admission`
2. `test_us0144_bridge_json_timeout_fail_closed`
3. `test_us0144_pre_spawn_context_order`
4. `test_us0144_memory_bounds_default_off`
5. `test_us0144_model_collision_degraded`
6. `test_us0144_supplementary_manifest_reviews`
7. `test_us0144_ledger_schema_preserved`
8. `test_us0144_sidecar_idempotent_torn_write`
9. `test_us0144_drain_gate_preset_zero`
10. `test_us0144_per_candidate_operator_decision`
11. `test_us0144_blocking_only_convergence_smoke_truth`
12. `test_us0144_caps_progress_partial_delivery_boundaries`

Primary: `standalone/tests/contract` (`node:test`) Windows + Linux. Fake-model CI. Count stays 12. No thirteenth flag-combo test.

## Flag-quadrant binding (closes us0144arc-challenger-001 residual)

Four `CROSS_MODEL_REVIEW` × `SOVEREIGN_RUNTIME` combinations live **inside** the twelve markers. T-010 must assert each quadrant on its **primary** marker (other tests may assume Q11 unless named):

| Quadrant | CROSS_MODEL_REVIEW | SOVEREIGN_RUNTIME | Primary marker | Required assertion |
|---|---|---|---|---|
| Q00 | 0 | 0 | `test_us0144_memory_bounds_default_off` | No critic session scheduled; no sovereign bridge call; no memory I/O; no sidecar/partial-delivery write. |
| Q10 | 1 | 0 | `test_us0144_caps_progress_partial_delivery_boundaries` | US-0143 scheduling-only critic session retained; no sovereign bridge/write; GateEngine `RELEASE_GATE_ORDER` and legacy drain byte-compatible. |
| Q01 | 0 | 1 | `test_us0144_pre_spawn_context_order` | Pre-spawn bootstrap/digest may run (SR=1); US-0143 hook is **not** scheduled (CMR=0); no sovereign **producer content after the existing hook**. |
| Q11 | 1 | 1 | `test_us0144_model_collision_degraded` | Full sovereign content after the existing hook (critic pin + explicit degraded). Remaining content tests (m6–m12) run in this quadrant unless they specifically probe fail-closed envelopes. |

R-0142 lock: only `CROSS_MODEL_REVIEW=1 && SOVEREIGN_RUNTIME=1` enables sovereign content after the existing hook. `SOVEREIGN_RUNTIME=0` adds no bridge/content/write. Count stays 12.

## Risks (R1–R6 — accepted)

| Risk | Severity | Mitigation |
|---|---|---|
| R1 Marker-name drift vs DEC-0144 IDs | MEDIUM | T-010 uses architecture-owned IDs; prior stub aliases retired |
| R2 Flag quadrant under-tested (critic residual) | MEDIUM | T-010 Q00/Q10/Q01/Q11 table; no 13th test |
| R3 US-0143 drain accidentally rewritten | HIGH | T-007/T-009/T-010 m12: `gateDrainCandidate` exclusive for sovereign-generated candidates; Q10 asserts legacy drain unamended |
| R4 Sidecar dual-write repairs torn tails | MEDIUM | T-006/T-010 m8: fail-closed; no repair/truncate |
| R5 Smoke surrogate claimed as browser PASS | HIGH | T-008/T-010 m11: blocking-only + smoke truthfulness |
| R6 Arbitrary KernelBridge script runner | HIGH | T-001/T-002/T-010 m1–m2: closed 9-op + fixed path |

## Compose guards (UNCHANGED)

| Target | Result |
|---|---|
| US-0143 / DEC-0143 / R-0141 | DONE compose-only; scheduling-only critic slot lifted for content; drain/GateEngine unamended at SR=0 |
| Python sovereign schemas | compose via bridge; do not port or rewrite |
| KernelBridge locate/handshake/validator | additive `runSovereignOperation` only; no general script runner |
| DEC-0038 tuple | UNAMENDED |
| Kit npm `its-magic` / DEC-0120 | `files` whitelist omit `standalone/` |
| US-0145..US-0148 | OUT OF SCOPE |
| US-0133..US-0143 DONE | compose only, do not reopen |
| BUG-* | not mutated / not drained |
| US-0045 | Status stays OPEN |
| US-0085 | `.env` deny |
| `.opencode/commands/auto.md` | do not restore |

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
| story_id | US-0144 |
| sprint_id | S0152 |
| orchestrator_run_id | auto-20260913-us0144 |
| parent_orchestrator_run_id | auto-20260913-us0143 |
| delivery_mode | ultra_lean |
| macro_phase | plan |
| fresh_context_marker | tl-US0144-sprintplan-20260915T190058Z-fresh |
| timestamp | 2026-09-15T19:00:58Z (UTC) |
| model_id | cursor-grok-4.6-high (CROSS_MODEL_REVIEW=1 — required) |
| evidence_ref | sprints/S0152/sprint.md, tasks.md, progress.md, uat.json, uat.md, plan-verify.json (SKIPPED), summary.md, qa-findings.md, release-findings.md, closure-verification.md, handoffs/tl_to_dev.md, docs/engineering/state.md, handoffs/resume_brief.md, docs/product/backlog.md ## US-0144 |

Prior phase proofs consumed (independent `compute_strict_proof_hash` MATCH; not STALE at consume 2026-09-15T19:00:58Z):

- Architecture producer: `rp-auto-20260913-us0144-architecture-techlead-20260915T185104Z-US-0144` / `EA5C872E25AF1F03D79F10C7BF371E55993C7440A4A802BFD6E89505C8548BCD` — RUNTIME_PROOF_VALID before TTL `2026-09-15T19:51:04Z`.
- Architecture critic: `rp-auto-20260913-us0144-sovereign-critic-techlead-20260915T185540Z-US-0144` / `46611DA8682735C7EEBF308F513C065B08A10AD28BD26E32359FCA8B24E4B476` — MATCH; anti_slop=10; 0 blocking; degraded_mode=false; findings us0144arc-* informational — NB1 closed this phase. MATCH before TTL `2026-09-15T19:55:40Z`.

Sovereign memory: `SOVEREIGN_MEMORY=1`; `build_injection_digest_block` returned `(no sovereign memory entries)` (read-only). No `mistakes.jsonl` write. No `.env` reads.

## Runtime proof (DEC-0038)

| Field | Value |
|---|---|
| runtime_proof_id | rp-auto-20260913-us0144-sprint-plan-techlead-20260915T190058Z-US-0144 |
| phase_id | sprint-plan |
| role | tech-lead |
| story_id | US-0144 |
| sprint_id | S0152 |
| orchestrator_run_id | auto-20260913-us0144 |
| delivery_mode | ultra_lean |
| macro_phase | plan |
| model_id | cursor-grok-4.6-high (CROSS_MODEL_REVIEW=1 — required) |
| proof_issued_at | 2026-09-15T19:00:58Z |
| proof_ttl_seconds | 3600 |
| proof_ttl | 2026-09-15T20:00:58Z (UTC) |
| proof_hash | 066EE36FB0930C2329F33590FD2508B233596EC59437D35EEA4BF4EE64C5E60D |
| canonical_payload | `{"orchestrator_run_id":"auto-20260913-us0144","phase_id":"sprint-plan","proof_issued_at":"2026-09-15T19:00:58Z","proof_ttl_seconds":3600,"role":"tech-lead","runtime_proof_id":"rp-auto-20260913-us0144-sprint-plan-techlead-20260915T190058Z-US-0144"}` |

Hash via `scripts.token_cost_lib.compute_strict_proof_hash` (positional, compact sorted-key JSON). Isolation extras (not hashed): `delivery_mode=ultra_lean`, `macro_phase=plan`, `model_id=cursor-grok-4.6-high`, `sprint_id=S0152`, `story_id=US-0144`. hash_recompute_confirmation=true (compute_strict_proof_hash → 066EE36FB0930C2329F33590FD2508B233596EC59437D35EEA4BF4EE64C5E60D).

## Decision gate

| Field | Value |
|---|---|
| decision_gate | false |
| stop_conditions_met | yes |
| missing_acceptance_criteria | none (8/8 slices + primary acceptance row covered, 12 contract-test markers, 4 flag quadrants bound) |
| task_count | 11 (within SPRINT_MAX_TASKS=12, SPRINT_AUTO_SPLIT=1 but no split needed, 1:1 seeds, not /quick, not --bulk) |
| risks_finalized | 6/6 ACCEPTED (R1..R6) |
| companion_DEC | DEC-0144 Accepted |
| plan-verify readiness | ultra_lean — plan-verify NOT in resolved_phase_plan, skipped, plan-verify.json is a SKIPPED placeholder (`ultra_lean_skipped`) |
| sovereign_memory_note | `build_injection_digest_block` returned `(no sovereign memory entries)` (read-only). No `mistakes.jsonl` write. |

## Definition of done (sprint-plan)

- [x] 11 tasks enumerated (T-anch + T-001..T-010) — within SPRINT_MAX_TASKS=12, 1:1 from architecture seeds
- [x] 8/8 ACs surjective + primary acceptance.md US-0144 covered
- [x] All 12 architecture-owned `test_us0144_*` named
- [x] Four flag quadrants bound to specific markers (us0144arc-challenger-001 residual closed)
- [x] Task dependency graph documented
- [x] Execute phase role matrix documented (ultra_lean — /plan-verify skipped, next = sovereign-critic then /execute)
- [x] Compose guards UNCHANGED
- [x] Critic carry-ins routed; sprint id locked S0152
- [x] Isolation evidence + runtime proof emitted (model_id=cursor-grok-4.6-high present)
- [x] Sprint-plan checkpoint appended to docs/engineering/state.md
- [x] Sprint-plan handoff prepended to handoffs/tl_to_dev.md
- [x] Sprint-plan PASS prepended to handoffs/resume_brief.md (→ sovereign-critic then /execute, not plan-verify)
- [x] UAT placeholders written (uat.json empty steps, uat.md ACs no results)
- [x] Lifecycle stubs written (summary.md, qa-findings.md, release-findings.md, closure-verification.md)
- [x] Traceability row added (Story=US-0144, Sprint=S0152, Tasks=T-anch+T-001..T-010, Status=PLANNED, Evidence empty)
- [x] Backlog status OPEN (US-0045 — not mutated), acceptance unchecked
- [x] plan-verify.json SKIPPED placeholder (not a QA phase)

## Next scheduled phase

| Field | Value |
|---|---|
| next_scheduled_phase | sovereign-critic (sprint-plan, CROSS_MODEL_REVIEW=1) then /execute (role=dev per US-0069 / DEC-0051, fresh dev subagent per BUG-0006, first canonical phase of build+verify macro per ultra_lean, plan-verify NOT in resolved_phase_plan — skipped) |
| next_scheduled_role | tech-lead (critic of sprint-plan), then dev |
| next_sprint_macro | build+verify (ultra_lean — plan-verify skipped at this boundary) |
| stop_condition | STOP after sprint-plan completes, hand off via artifacts only. Orchestrator MUST spawn sovereign-critic of sprint-plan then /execute in fresh dev subagent per BUG-0006. Do not spawn /execute, /plan-verify, or critic from this subagent. |
