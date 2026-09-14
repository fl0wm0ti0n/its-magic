# Sprint S0142 - Sprint Plan (US-0136)

## Metadata

| Field | Value |
|---|---|
| story_id | US-0136 |
| bug_id | (none) |
| story_title | Enforce phase-role isolation with runtime-generated proof |
| sprint_id | S0142 |
| delivery_mode | ultra_lean |
| macro_phase | plan (sprint-plan terminal; plan-verify NOT in resolved_phase_plan — skipped; next = execute) |
| current_phase | sprint-plan |
| approach | A1 locked (from R-0128 DQ1–DQ10; DEC-0136 Accepted; architecture critic NB1–NB3 CLOSED) |
| companion_DEC | DEC-0136 (Accepted) |
| research_anchor | R-0128 (DQ1–DQ10 LOCKED; compose R-0121 / R-0122 / R-0127; do not wipe R-0120..R-0127) |
| architecture_anchor | docs/engineering/architecture.md # US-0136 |
| orchestrator_run_id | auto-20260913-us0136 |
| parent_orchestrator_run_id | auto-20260913-us0135 |
| fresh_context_marker | tl-US0136-sprintplan-20260913T075500Z-fresh |
| timestamp | 2026-09-13T07:55:00Z (UTC) |
| model_id | cursor-grok-4.6-high (CROSS_MODEL_REVIEW=1 — required on isolation) |
| verdict | PASS |
| decision_gate | false |
| SPRINT_MAX_TASKS | 12 |
| SPRINT_AUTO_SPLIT | 1 |
| task_count | 11 (T-anch + T-001..T-010; within 12; no split; 1:1 from architecture seeds) |
| COMPONENT_SCOPE_MODE | 0 |
| USER_GUIDE_MODE | 0 |
| plan-verify | ultra_lean — NOT in resolved_phase_plan; skipped; plan-verify.json written as deferred/skipped placeholder only (not a QA phase; QA may overwrite in build+verify) |
| backlog_status | OPEN (US-0045 — not mutated; AC-1..AC-7 unchecked) |
| sprint_id_lock | **S0142** is next free after S0141 (US-0135). Confirmed no S0142 folder existed before this spawn. |
| critic_carry_ins | 0 new blocking; 3 architecture critic NBs `us0136arc-*` status=resolved non-blocking — routed as awareness into /execute (below) |

## Scope summary

Add **owned standalone role-runtime** so every producer phase, review/critic phase, and execute/QA rework iteration runs in a genuinely fresh, correctly authorized Pi session. Role separation is a runtime fact (SessionSupervisor + RoleCatalog + spawn/start/end attestations), not prompt trust. Pi stays behind `packages/pi-kernel`. `role-runtime` never imports Pi. Fake-model CI default, empty resource loader, `noTools: "builtin"`, KernelBridge, and auth-models stay **unamended**. DEC-0038 `compute_strict_proof_hash` tuple stays **UNAMENDED**.

**Approach A1** (DEC-0136 Accepted): `standalone/packages/role-runtime` (`@its-magic/role-runtime`, private, **no Pi imports**) + SessionSupervisor wrapping injected `AgentKernel.createSession` only; production/CI `SessionManager.inMemory`; `continueRecent`/`fork` default-deny; process-local ContinuationContract same-phase `run`/`steer` only; RoleCatalog ports DEC-0051 / `AUTO_ROLE_*` + extra catalog rows; sidecar spawn/start/end + `attestation_hash`; additive `standalone_attestation`; fail-closed `SESSION_*`/`ATTESTATION_*` + reused kit codes; TypeScript orchestrator spawn-time tool deny; fresh critic/review sessions + `parent_phase_session_id` lineage; crash orphan discard + `dispose`; ten `test_us0136_*` on Windows + Linux; fake-model CI default **held**.

Out of scope: A2 fold into `runtime-core`; A3 Pi imports in `role-runtime`; A4 persist jsonl + `continueRecent`/`fork`; A5 orchestrator Pi session (`itsm_ping`); A6 extend `compute_strict_proof_hash`; A7 SQLite this story; A8 amend isolation / `noTools` / KernelBridge / auth-models; A9 live paid CI; US-0137..US-0148; marking US-0136 DONE; ticking AC checkboxes; reopening US-0133, US-0134, US-0135, or BUG-0020; wiping R-0120..R-0127.

## Execute awareness (architecture critic NBs — 0 blocking)

Sovereign-critic of architecture PASS (`critic-US0136-architecture-20260913T074500Z-fresh`; anti_slop=10; 0 blocking). Consumed architecture proof MATCH before TTL. Route these resolved NBs as execute awareness — do not re-open them as work:

| Finding | Issue key | Execute awareness |
|---|---|---|
| `us0136arc-challenger-001` | `ik_us0136arc_proof_failclosed_pass` | **T-003/T-004/T-006/T-009**: DQ2 continuation allow-list; Pi `continueRecent`/`fork` default-deny; crash orphan discard; `SESSION_*`/`ATTESTATION_*` fail-closed inventory; stub `context_pack_hash`/`policy_hash` until US-0139/US-0137. |
| `us0136arc-architect-002` | `ik_us0136arc_layer_role_runtime_ok` | Keep **T-anch..T-010 1:1** from architecture seeds; sprint folder is **S0142**; architecture owns H1+DEC-0136; execute owns `role-runtime` bootstrap + SessionSupervisor + RoleCatalog + sidecar + 10 tests. `role-runtime` vs `pi-kernel` boundary; sidecar `attestation_hash` ≠ DEC-0038 envelope; compose DEC-0133/0134/0135 held; TS orchestrator scheduling-only. |
| `us0136arc-subtractor-003` | `ik_us0136arc_scope_yagni_pass` | T-anch ceremony overlap acceptable. Do not invent extra tasks. Do not amend isolation loader / `noTools` / KernelBridge / auth-models. Do not design US-0137+. Do not mark US-0136 DONE. Do not reopen US-0135 or BUG-0020. 10 markers required. 11 tasks within SPRINT_MAX_TASKS=12. |

## Acceptance criteria (7) — US-0136 (status OPEN, unchecked per US-0045)

Primary acceptance (`docs/product/acceptance.md` US-0136 row): Fresh role sessions and runtime attestation — phase-role enforcement, isolation proof, orchestrator restrictions, and crash-safe session lifecycle (7 ACs).

- **AC-1**: `SessionSupervisor` creates a fresh Pi session for every producer phase, review phase, and execute/QA rework iteration except explicitly versioned continuation contracts. — T-001, T-003, T-004, T-008 (T-010 m1–m4, m6, m8).
- **AC-2**: A typed RoleCatalog enforces the canonical phase-to-role mapping, permitted alternates, role objectives, artifact ownership, and bounded sovereign role-manifest injection. — T-002 (T-010 m7).
- **AC-3**: The runtime emits spawn/start/end attestations bound to run, phase, role, kernel session/process, model, context hash, policy hash, timestamps, and freshness. — T-005 (T-010 m9).
- **AC-4**: Existing US-0048/US-0056 evidence remains compatible, with standalone fields added as sidecar data when required. — T-005 (additive `standalone_attestation`; DEC-0038 unamended).
- **AC-5**: Reused session IDs, role mismatch, prior-role transcript carry-over, missing/stale proof, hash mismatch, or orchestrator phase mutation fail closed with deterministic reasons. — T-006, T-007 (T-010 m6–m10).
- **AC-6**: The orchestrator has scheduling capabilities only and cannot receive project source-write or unrestricted-shell tools. — T-007 (T-010 m10).
- **AC-7**: Isolation tests cover PO/DEV separation, each execute/QA cycle, critic sessions, crash recovery, and session disposal. — T-008, T-009, T-010 (m1–m5).

## Task summaries (11 — T-anch + T-001..T-010)

- **T-anch** (NO-OP / verification): Verify `# US-0136` H1 + DEC-0136 Accepted + A1 + R-0128 DQ1–DQ10 + 10-marker list. Record to `sprints/S0142/t-anch-verification.md`. NO mutation to `architecture.md` / `DEC-0136.md` / R-0128 in /execute.
- **T-001** (AC-1): Create `standalone/packages/role-runtime` (`@its-magic/role-runtime`, `private: true`, `version: 0.0.0`, `type: module`, `engines.node >=22.19.0`, export `./src/index.ts`). **No Pi imports.** Extend US-0133/US-0134/US-0135 grep to deny Pi inside `role-runtime`. Do **not** add a Biome override. Kit `files` omit `standalone/`.
- **T-002** (AC-2): RoleCatalog `schema_version: 1`; port DEC-0051 matrix + `AUTO_ROLE_RESEARCH|PLAN_VERIFY|CLOSURE|REFRESH_CONTEXT`; extra rows `sovereign-critic`→`tech-lead`, `security-review`→`security`, `map-codebase`/`ask`→`scout`; bounded keys `objective_function`, `review_focus` only. Unset AUTO_ROLE → default; invalid → `SESSION_UNKNOWN_ROLE`.
- **T-003** (AC-1): SessionSupervisor wraps injected `AgentKernel.createSession` only. Production/CI `SessionManager.inMemory`. Do not add `continueRecent`/`fork`/`newSession({ parentSession })` to `AgentKernel`. Never pass `entries`.
- **T-004** (AC-1): Process-local ContinuationContract (`schema_version: 1`, `allowed_ops: ["run","steer"]`). Same-phase in-session follow-up only. execute#N / QA#N / critic / crash / `iteration_key` change = fresh. Missing/mismatched → `SESSION_CONTINUATION_DENIED`.
- **T-005** (AC-3/AC-4): Sidecar spawn/start/end; `kernel_session_id`=`session.sessionId`; `kernel_process_instance`=`${bootUuid}:${pid}`; stub `context_pack_hash`/`policy_hash`; `attestation_hash` = SHA-256 canonical JSON without that field. Additive `standalone_attestation`. **Do not** extend DEC-0038.
- **T-006** (AC-5): Fail-closed inventory: reuse `PHASE_ROLE_MISMATCH` / `PHASE_ROLE_CAPABILITY_MISSING` / `RUNTIME_PROOF_*` / `PHASE_CONTEXT_ISOLATION_VIOLATION` / `AUTO_ORCHESTRATOR_PHASE_EXECUTION`; add frozen `SESSION_*` / `ATTESTATION_*` (DEC-0136 §7).
- **T-007** (AC-6): `assertOrchestratorSchedulingOnly` in `role-runtime` at spawn; no mutation/`itsm_*` tools; no orchestrator Pi session in v1; scheduler/gate module must not import Pi. `SESSION_ORCHESTRATOR_TOOLS_DENIED`.
- **T-008** (AC-1/AC-7): Fresh critic/review sessions; `parent_phase_session_id` lineage only (not transcript import); isolation/proof role for sovereign-critic remains `tech-lead`. Critic must not `steer` the producer session.
- **T-009** (AC-7): Crash orphan discard: handle without `end` attestation → `abort` + `dispose` + drop registry; next spawn always `createSession`. After dispose, `sessionId` must not be reused for a later phase.
- **T-010** (AC-7): Ten `test_us0136_*` markers (DEC-0136 §10). Primary `standalone/tests/contract` (`node:test`) Windows + Linux. Kit twin as needed. Fake-model CI default **held**. No paid/model calls.

Execution order: T-anch → T-001 → T-002 → T-003 → {T-004, T-005} → T-006 → T-007 → T-008 → T-009 → T-010 (acyclic). No split (`SPRINT_AUTO_SPLIT` not triggered; 11 ≤ 12). Not `/quick`.

## AC → Task surjective coverage

| AC | Task(s) |
|---|---|
| AC-1 (fresh sessions + continuation) | T-001, T-003, T-004, T-008 (T-010 m1–m4, m6, m8) |
| AC-2 (RoleCatalog) | T-002 (T-010 m7) |
| AC-3 (spawn/start/end attestations) | T-005 (T-010 m9) |
| AC-4 (sidecar compatible with US-0048/US-0056) | T-005 |
| AC-5 (fail-closed reasons) | T-006, T-007 (T-010 m6–m10) |
| AC-6 (orchestrator scheduling-only) | T-007 (T-010 m10) |
| AC-7 (PO/DEV, execute/QA, critic, crash, dispose) | T-008, T-009, T-010 (m1–m5) |
| DC / architecture baseline | T-anch |

**Surjectivity check**: 7/7 ACs covered (each AC ≥1 task) + primary acceptance.md US-0136 row covered by AC-1..AC-7 aggregate. No `PLAN_AC_COVERAGE_GAP`. T-anch retained as verification-only.

## Locked 10-marker table (DEC-0136 §10 / architecture)

1. `test_us0136_po_dev_distinct_session_ids`
2. `test_us0136_execute_qa_cycle_new_ids`
3. `test_us0136_critic_distinct_session`
4. `test_us0136_crash_orphan_discard`
5. `test_us0136_session_dispose`
6. `test_us0136_reused_id_fail_closed`
7. `test_us0136_role_mismatch_fail_closed`
8. `test_us0136_transcript_carryover_fail_closed`
9. `test_us0136_missing_stale_hash_attestation`
10. `test_us0136_orchestrator_mutation_deny_and_no_pi_imports`

Primary: `standalone/tests/contract` (`node:test`) Windows + Linux. Kit twin as needed. No paid/model calls. Fake-model CI default **held**.

## Risks (R1–R6 — accepted)

| Risk | Severity | Mitigation |
|---|---|---|
| R1 Pi 0.85.1 `AgentSessionRuntime.fork` / `continueRecent` accidentally wired later | MEDIUM | T-003: do not add those methods to `AgentKernel`; T-010 m8/m6 grep + deny tests |
| R2 `inMemory(..., entries)` restore used as “resume” | MEDIUM | T-003 supervisor never passes entries; T-010 m8 `SESSION_TRANSCRIPT_CARRYOVER` fixture |
| R3 stub `context_pack_hash` / `policy_hash` mistaken for US-0139/US-0137 completeness | LOW | T-005 document stubs; later stories replace hash *values* without renaming fields |
| R4 `kernel_process_instance` pid recycle | LOW | T-005 boot UUID + pid |
| R5 RoleCatalog confused with PolicyEngine | LOW | T-002 role = intent; US-0137 = permission (out of scope) |
| R6 amending DEC-0133 loader while adding supervisor options | LOW | T-003 D8; T-010 asserts empty loader + fake-model default still hold |

## Compose guards (UNCHANGED)

| Target | Result |
|---|---|
| US-0133 / DEC-0133 / R-0121 | compose `createSession` inject only; do not amend AgentKernel isolation / `noTools` / `# US-0133` |
| US-0134 / DEC-0134 / R-0122 | compose locate-only; KernelBridge **unamended** |
| US-0135 / DEC-0135 / R-0127 | compose `model_id` provenance only; auth-models **unamended** |
| Kit npm `its-magic` / DEC-0120 `files` | compose — omit `standalone/` |
| US-0048 / DEC-0029 | compose — additive `standalone_attestation` |
| US-0056 / DEC-0038 | compose — `compute_strict_proof_hash` tuple **UNAMENDED** |
| US-0069 / DEC-0051 | compose — ported into RoleCatalog |
| US-0106 | compose — `objective_function` / `review_focus` keys only |
| US-0104 | compose — critic spawn mechanism here; lens content US-0144 |
| US-0137..US-0148 | OUT OF SCOPE |
| US-0133 / US-0134 / US-0135 | DONE — compose only; do not reopen |
| BUG-0020 / R-0126 | DONE — do not reopen; do not wipe R-0126 |
| R-0120..R-0128 | do not wipe |
| DEC-0136 / `# US-0136` / R-0128 | locked — T-anch verify only |
| US-0045 | Status stays OPEN |

## Execute phase role (per DEC-0051 / US-0069)

| Phase | Role | Isolation |
|---|---|---|
| /execute | dev (fresh per BUG-0006) | {phase_id:execute, role:dev} |
| /qa | qa (fresh) | {phase_id:qa, role:qa} — ultra_lean may create/overwrite plan-verify.json inside build+verify; this sprint-plan does **not** run /plan-verify |
| /verify-work | qa (fresh) | {phase_id:verify-work, role:qa} |
| /release | release (fresh) | {phase_id:release, role:release} |
| /closure | qe (fresh) | {phase_id:closure, role:qe} |
| /refresh-context | curator (fresh) | {phase_id:refresh-context, role:curator} |

## Isolation evidence (US-0048 / DEC-0029 / US-0104 v2)

| Field | Value |
|---|---|
| phase_id | sprint-plan |
| role | tech-lead |
| story_id | US-0136 |
| sprint_id | S0142 |
| orchestrator_run_id | auto-20260913-us0136 |
| delivery_mode | ultra_lean |
| macro_phase | plan |
| fresh_context_marker | tl-US0136-sprintplan-20260913T075500Z-fresh |
| timestamp | 2026-09-13T07:55:00Z (UTC) |
| model_id | cursor-grok-4.6-high (CROSS_MODEL_REVIEW=1 — required) |
| evidence_ref | sprints/S0142/sprint.md, sprints/S0142/tasks.md, sprints/S0142/progress.md, sprints/S0142/uat.json, sprints/S0142/uat.md, sprints/S0142/plan-verify.json (deferred/skipped placeholder), handoffs/tl_to_dev.md (US-0136 prepend), docs/engineering/state.md (sprint-plan checkpoint + traceability), docs/engineering/architecture.md # US-0136 (not mutated), decisions/DEC-0136.md (not mutated), handoffs/resume_brief.md |

Prior phase proof consumed: `rp-auto-20260913-us0136-architecture-techlead-20260913T073500Z-US-0136` / `3814A075FD13922FD3E8B344CDA11F02BC832845C35245F2D2B5A0B07587E3CD` — RUNTIME_PROOF_VALID (independent `compute_strict_proof_hash` MATCH; consumed 2026-09-13T07:55:00Z before TTL 2026-09-13T08:35:00Z). Sovereign-critic architecture PASS (`rp-auto-20260913-us0136-sovereign-critic-techlead-20260913T074500Z-US-0136` / `B312C8FAFAA551E913692A427FE468DFA9C7E7C4EB3DE5CB1A3406B7F4D151EB`; `critic-US0136-architecture-20260913T074500Z-fresh`; anti_slop=10; 0 blocking; findings `us0136arc-*` informational — routed).

## Runtime proof (DEC-0038)

| Field | Value |
|---|---|
| runtime_proof_id | rp-auto-20260913-us0136-sprint-plan-techlead-20260913T075500Z-US-0136 |
| phase_id | sprint-plan |
| role | tech-lead |
| story_id | US-0136 |
| sprint_id | S0142 |
| orchestrator_run_id | auto-20260913-us0136 |
| delivery_mode | ultra_lean |
| macro_phase | plan |
| model_id | cursor-grok-4.6-high (CROSS_MODEL_REVIEW=1 — required) |
| proof_issued_at | 2026-09-13T07:55:00Z |
| proof_ttl_seconds | 3600 |
| proof_ttl | 2026-09-13T08:55:00Z (UTC) |
| proof_hash | ADE16B3E4FC3F643CE7B79049DDB1C829A55B0D4F89F0D1E0CD9BA655FAF0A10 |
| canonical_payload | `{"orchestrator_run_id":"auto-20260913-us0136","phase_id":"sprint-plan","proof_issued_at":"2026-09-13T07:55:00Z","proof_ttl_seconds":3600,"role":"tech-lead","runtime_proof_id":"rp-auto-20260913-us0136-sprint-plan-techlead-20260913T075500Z-US-0136"}` |

Hash via `scripts.token_cost_lib.compute_strict_proof_hash` (positional; compact sorted-key JSON). Isolation extras (not hashed): `delivery_mode=ultra_lean`, `macro_phase=plan`, `model_id=cursor-grok-4.6-high`, `sprint_id=S0142`, `story_id=US-0136`. `hash_recompute_confirmation=true` (compute_strict_proof_hash → ADE16B3E4FC3F643CE7B79049DDB1C829A55B0D4F89F0D1E0CD9BA655FAF0A10).

## Decision gate

| Field | Value |
|---|---|
| decision_gate | false |
| stop_conditions_met | yes |
| missing_acceptance_criteria | none (7/7 slices + primary acceptance row covered; 10 contract-test markers) |
| compose_guards | US-0133/0134/0135/DEC-0133/0134/0135/kit files/US-0137..US-0148/BUG-0020/R-0120..R-0128/DEC-0136/US-0045 UNCHANGED |
| dc_check | clean (`# US-0136` H1 already added in /architecture; DEC-0136 Accepted) |
| task_count | 11 (within SPRINT_MAX_TASKS=12; SPRINT_AUTO_SPLIT=1 but no split needed; 1:1 seeds; not `/quick`; not `--bulk`) |
| risks_finalized | 6/6 ACCEPTED (R1..R6) |
| approach | A1 locked |
| companion_DEC | DEC-0136 Accepted |
| plan-verify readiness | ultra_lean — plan-verify NOT in resolved_phase_plan; skipped; plan-verify.json is a deferred/skipped placeholder (not a QA spawn) |
| sovereign_memory_note | `assemble_sovereign_memory_digest(...)` NOT called; no mistakes.jsonl write |

## Definition of done (sprint-plan)

- [x] 11 tasks enumerated (T-anch + T-001..T-010) — within SPRINT_MAX_TASKS=12; 1:1 from architecture seeds
- [x] 7/7 ACs surjective + primary acceptance.md US-0136 covered
- [x] Task dependency graph documented
- [x] Execute phase role matrix documented (ultra_lean — /plan-verify skipped; next = /execute)
- [x] Compose guards UNCHANGED
- [x] Critic carry-ins (3 non-blocking from architecture sovereign-critic) routed as execute awareness; sprint id locked **S0142**
- [x] Isolation evidence + runtime proof emitted (model_id=cursor-grok-4.6-high present)
- [x] Sprint-plan checkpoint appended to `docs/engineering/state.md`
- [x] Sprint-plan handoff prepended to `handoffs/tl_to_dev.md`
- [x] Sprint-plan PASS prepended to `handoffs/resume_brief.md` (-> /execute)
- [x] UAT placeholders written (`uat.json` empty steps, `uat.md` ACs no results)
- [x] Traceability row added (Story=US-0136 | Sprint=S0142 | Tasks=T-anch+T-001..T-010 | Status=PLANNED | Evidence empty)
- [x] Backlog status OPEN (US-0045 — not mutated); acceptance unchecked; sprint_plan_notes appended
- [x] plan-verify.json deferred/skipped placeholder (not a QA phase)

## Next scheduled phase

| Field | Value |
|---|---|
| next_scheduled_phase | `/execute` (role=dev per US-0069 / DEC-0051; fresh dev subagent per BUG-0006; first canonical phase of `build+verify` macro per ultra_lean; plan-verify NOT in resolved_phase_plan — skipped). Orchestrator may run sovereign-critic of sprint-plan first (CROSS_MODEL_REVIEW=1). Do not mandate outer driver. |
| next_scheduled_role | dev |
| next_sprint_macro | build+verify (ultra_lean — plan-verify skipped at this boundary) |
| stop_condition | STOP after sprint-plan completes; hand off via artifacts only. Orchestrator owns critic of sprint-plan (if CROSS_MODEL_REVIEW=1) then `/execute` in fresh dev subagent per BUG-0006. Do not spawn /execute or /plan-verify from this subagent. |
| artifacts_written | sprints/S0142/ (sprint.md, tasks.md, progress.md, uat.json, uat.md, plan-verify.json placeholder), docs/engineering/state.md (sprint-plan checkpoint + traceability), handoffs/tl_to_dev.md (US-0136 prepend), handoffs/resume_brief.md (sprint-plan PASS prepend -> /execute), docs/product/backlog.md (sprint_plan_notes append; Status OPEN) |
