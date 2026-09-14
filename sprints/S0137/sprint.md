# Sprint S0137 - Sprint Plan (US-0133)

## Metadata

| Field | Value |
|---|---|
| story_id | US-0133 |
| bug_id | (none) |
| story_title | Standalone repository and replaceable Pi kernel |
| sprint_id | S0137 |
| delivery_mode | ultra_lean |
| macro_phase | plan (sprint-plan terminal; plan-verify NOT in resolved_phase_plan — skipped; next = execute) |
| current_phase | sprint-plan |
| approach | A1 locked (from R-0121 DQ1–DQ10; DEC-0133 Accepted; architecture critic NB1–NB3 CLOSED) |
| companion_DEC | DEC-0133 (Accepted) |
| research_anchor | R-0121 (DQ1–DQ10 LOCKED; do not wipe R-0120) |
| architecture_anchor | docs/engineering/architecture.md # US-0133 |
| orchestrator_run_id | auto-20260912-us0133 |
| parent_orchestrator_run_id | auto-20260912-bug0018 |
| fresh_context_marker | tl-US0133-sprintplan-20260912T112500Z-fresh |
| timestamp | 2026-09-12T11:25:00Z (UTC) |
| model_id | cursor-grok-4.6 (CROSS_MODEL_REVIEW=1 — required on isolation) |
| verdict | PASS |
| decision_gate | false |
| SPRINT_MAX_TASKS | 12 |
| SPRINT_AUTO_SPLIT | 1 |
| task_count | 10 (T-anch + T-001..T-009; within 12; no split; 1:1 from architecture seeds) |
| COMPONENT_SCOPE_MODE | 0 |
| USER_GUIDE_MODE | 0 |
| plan-verify | ultra_lean — NOT in resolved_phase_plan; skipped; plan-verify.json NOT written here |
| backlog_status | OPEN (US-0045 — not mutated; AC-1..AC-6 unchecked) |
| sprint_id_lock | **S0137** is next free after S0136. Critic NB2 preview `sprints/S0133/*` is stale (S0133 = historical US-0131). |
| critic_carry_ins | 0 new blocking; 3 architecture critic NBs `us0133asc-*` status=resolved non-blocking — routed as awareness into /execute (below) |

## Scope summary

Bootstrap an **in-tree TypeScript workspace** and prove Pi sits behind an owned `AgentKernel`: custom-tool-only production sessions, default resource isolation, no Pi imports outside `packages/pi-kernel`. Kit npm `its-magic` stays installer/template. Phase 0 for this story is kernel items **1, 2, 3, 5** only. No OS-sandbox claim. No branding lock.

**Approach A1** (DEC-0133 Accepted): in-tree `standalone/` npm workspaces (not kit `its-magic` publish). Real `packages/pi-kernel` AgentKernel. Empty `DefaultResourceLoader` overrides + `noTools: "builtin"` + owned `itsm_ping` allowlist. Pin `@earendil-works/pi-coding-agent@0.85.1` + `@earendil-works/pi-ai@0.85.1`. Node `>=22.19.0`. npm + Biome + tsc. No-network CI. Fake-model seam = inject no-network `Model`. Evidence `standalone/docs/phase0-kernel-spike.md`.

Out of scope: A2 new git repo; A3 fold Pi into kit `files`; A4 project-trust-only loader; A5 builtin-off without empty loader; KernelBridge (US-0134); ToolBroker/policy (US-0137); auth/models (US-0135); SessionSupervisor (US-0136); typed config (US-0138); lifecycle (US-0140); OS/container isolation (US-0141); §30 stub farm; vitest/pnpm/bun; live-provider CI as AC-5 gate; public branding lock; reopening BUG-0018; wiping R-0120; marking US-0133 DONE; ticking AC checkboxes.

## Execute awareness (architecture critic NBs — 0 blocking)

Sovereign-critic of architecture PASS (`critic-US0133-architecture-20260912T112000Z-fresh`; anti_slop=10; 0 blocking). Route these resolved NBs as execute awareness — do not re-open them as work:

| Finding | Issue key | Execute awareness |
|---|---|---|
| `us0133asc-challenger-001` | `ik_us0133_asc_proof_pass` | **T-004 / T-005 / T-007**: R2 planted `.pi/extensions`+`AGENTS.md` fixture; R3 fake `Model` inject (fallback documented in T-009); R6 kit `files` omit-guard. Trusted still uses empty loader (US-0137). |
| `us0133asc-architect-002` | `ik_us0133_asc_layer_compose_ok` | Keep **T-anch..T-009 1:1** from architecture seeds. Sprint folder is **S0137** (not S0133). Architecture owns H1+DEC-0133 only; execute owns `standalone/` bootstrap + contract tests. KernelBridge/ToolBroker held out. |
| `us0133asc-subtractor-003` | `ik_us0133_asc_scope_yagni_pass` | T-anch ceremony overlap acceptable. Phase 0 items **1/2/3/5** only. Do not invent §30 stub farm / companion DEC rewrite / OS-sandbox claim / branding lock. Do not mark US-0133 DONE. Do not wipe R-0120. 10 markers required. |

## Acceptance criteria (6) — US-0133 (status OPEN, unchecked per US-0045)

Primary acceptance (`docs/product/acceptance.md` US-0133 row): Standalone repository and replaceable Pi kernel — workspace, adapter boundary, custom-tool-only sessions, resource isolation, and hard-proof spike (6 ACs).

- **AC-1**: A new standalone workspace provides the planned app/package/test structure, CI, formatting, linting, type checking, and pinned tested Pi SDK dependencies. — T-001, T-002, T-008.
- **AC-2**: `AgentKernel` supports create, run, steer, abort, dispose, and runtime-info operations; no Pi imports exist outside `packages/pi-kernel`. — T-003, T-006.
- **AC-3**: Production sessions disable Pi built-in tools and expose only owned custom tools while preserving reliable event streaming and abort behavior. — T-005.
- **AC-4**: Project-local Pi extensions, packages, prompts, and `AGENTS.md` enforcement are not auto-loaded by default; trusted compatibility mode remains explicit and policy-controlled. — T-004.
- **AC-5**: Contract tests prove fresh session creation, stable session identifiers, custom-tool-only execution, event ordering required by audit, abort, and default resource isolation. — T-007.
- **AC-6**: The Phase 0 spike records exact dependency versions and a go/no-go result without locking product branding. — T-002, T-009.

## Task summaries (10 — T-anch + T-001..T-009)

- **T-anch** (NO-OP / verification): Verify `# US-0133` H1 + DEC-0133 Accepted + A1 + R-0121 DQ1–DQ10 + 10-marker list. Record to `sprints/S0137/t-anch-verification.md`. NO mutation to `architecture.md` / `DEC-0133.md` / R-0121 in /execute.
- **T-001** (AC-1): Create `standalone/` npm workspaces root (`private: true`, `engines.node >=22.19.0`, scripts typecheck/lint/format/test, Biome + tsc). Stub `apps/cli` (code-name bin `itsm`, no workflow). Real `packages/pi-kernel` package skeleton. `tests/{unit,contract}` dirs. Kit `package.json` `files` omit `standalone/`; extend `guard_installer_publish.py` fail-closed if `standalone` appears in kit `files` or tarball inventory. Do **not** add `standalone/` to kit `workspaces`.
- **T-002** (AC-1, AC-6): Pin `@earendil-works/pi-coding-agent@0.85.1` + `@earendil-works/pi-ai@0.85.1` in `standalone/` (exact). Node `>=22.19.0`.
- **T-003** (AC-2): Implement AgentKernel types + mapping inside `packages/pi-kernel` only (`createSession`/`run`/`steer`/`abort`/`dispose`/`getRuntimeInfo`/`subscribe` → `createAgentSession` / `session.{prompt,steer,abort,dispose,sessionId,subscribe}`). Owned `KernelEvent` / `KernelRuntimeInfo` per DEC-0133 §4.
- **T-004** (AC-4): Production isolation loader: empty `DefaultResourceLoader` overrides + runtime-owned `agentDir`; `PI_COMPAT_RESOURCES=off` default; `trusted` recorded on `isolationMode` but factory still uses empty loader (US-0137 owns trusted resource enablement).
- **T-005** (AC-3): Production factory: `noTools: "builtin"` + `customTools: [itsm_ping]` + `tools: ["itsm_ping"]`. Abort → idle; no further `tool_execution_start`. Placeholder only — ToolBroker = US-0137.
- **T-006** (AC-2): Import-boundary: Biome `noRestrictedImports` on every workspace package except `pi-kernel` **plus** fail-closed grep for `@earendil-works/pi-` outside `standalone/packages/pi-kernel/**`.
- **T-007** (AC-5): Ten `test_us0133_*` markers (DEC-0133 §8) including planted-extension fixture + fake-model event order. Kernel tests: `standalone/tests/contract` (`node:test`). Kit pytest `tests/us0133_contract_test.py` (+ template twin) at least for files-omit + import-boundary grep. No live provider. Optional `PI_SPIKE_LIVE` not required for GO.
- **T-008** (AC-1): CI Windows + Linux job with `working-directory: standalone` (Node 22). Do **not** fold standalone tests into kit `TEST_COMMAND`.
- **T-009** (AC-6): `standalone/docs/phase0-kernel-spike.md` — exact installed versions + GO/NO-GO for items **1, 2, 3, 5** only. No branding lock. No OS-sandbox claim. Record which fake-model seam shipped.

Execution order: T-anch → T-001 → T-002 → T-003 → T-004 → T-005 → T-006 → T-007 → T-008 → T-009 (acyclic). No split (`SPRINT_AUTO_SPLIT` not triggered). Not `/quick`.

## AC → Task surjective coverage

| AC | Task(s) |
|---|---|
| AC-1 (workspace / CI / pins) | T-001, T-002, T-008 |
| AC-2 (AgentKernel + import boundary) | T-003, T-006 |
| AC-3 (custom-tool-only + abort) | T-005 |
| AC-4 (resource isolation) | T-004 |
| AC-5 (contract tests) | T-007 |
| AC-6 (spike evidence / no branding) | T-002, T-009 |
| DC / architecture baseline | T-anch |

**Surjectivity check**: 6/6 ACs covered (each AC ≥1 task) + primary acceptance.md US-0133 row covered by AC-1..AC-6 aggregate. No `PLAN_AC_COVERAGE_GAP`. T-anch retained as verification-only.

## Locked 10-marker table (DEC-0133 §8 / architecture)

1. `test_us0133_standalone_workspace_layout`
2. `test_us0133_kit_npm_files_omit_standalone`
3. `test_us0133_pi_packages_pinned_exact`
4. `test_us0133_agentkernel_methods`
5. `test_us0133_no_pi_imports_outside_pi_kernel`
6. `test_us0133_production_session_custom_tools_only`
7. `test_us0133_default_resource_loader_empty`
8. `test_us0133_session_id_stable_and_abort`
9. `test_us0133_audit_event_order_with_fake_model`
10. `test_us0133_phase0_spike_gng_no_branding`

No-network CI. Plant a fixture `.pi/extensions` + `AGENTS.md` under a temp project cwd and assert the production factory still yields empty extensions/agentsFiles (R2). Fake-model inject for marker 9.

## Risks (R1–R6 — accepted)

| Risk | Severity | Mitigation |
|---|---|---|
| R1 SDK churn 0.85→0.86 | MEDIUM | T-002 exact pin + T-009 spike evidence |
| R2 `AGENTS.md` / `~/.pi/agent` leak if loader omitted | MEDIUM | T-004 production factory requires loader; T-007 planted-fixture |
| R3 fake-model seam missing | MEDIUM | T-007 inject `model`; T-009 records fallback if 0.85.1 cannot stub |
| R4 OS-sandbox claim | LOW | D8; T-009 cites pi.dev/security; no claim |
| R5 branding lock | LOW | unpublished `private: true` name; T-009 AC-6 evidence |
| R6 later `files` whitelist drift | LOW | T-001 guard + marker 2 |

## Compose guards (UNCHANGED)

| Target | Result |
|---|---|
| Kit npm `its-magic` / DEC-0120 `files` | compose — omit `standalone/`; no Pi in tarball |
| US-0134 KernelBridge | document parent walk only; do not implement |
| US-0137 ToolBroker | `itsm_ping` placeholder only |
| US-0135..US-0148 | OUT OF SCOPE |
| BUG-0018 / R-0120 | DONE — do not reopen; do not wipe R-0120 |
| DEC-0133 / `# US-0133` / R-0121 | locked — T-anch verify only |
| US-0045 | Status stays OPEN |

## Execute phase role (per DEC-0051 / US-0069)

| Phase | Role | Isolation |
|---|---|---|
| /execute | dev (fresh per BUG-0006) | {phase_id:execute, role:dev} |
| /qa | qa (fresh) | {phase_id:qa, role:qa} — ultra_lean may create plan-verify.json inside build+verify; this sprint-plan does **not** run /plan-verify |
| /verify-work | qa (fresh) | {phase_id:verify-work, role:qa} |
| /release | release (fresh) | {phase_id:release, role:release} |
| /closure | qe (fresh) | {phase_id:closure, role:qe} |
| /refresh-context | curator (fresh) | {phase_id:refresh-context, role:curator} |

## Isolation evidence (US-0048 / DEC-0029 / US-0104 v2)

| Field | Value |
|---|---|
| phase_id | sprint-plan |
| role | tech-lead |
| story_id | US-0133 |
| sprint_id | S0137 |
| orchestrator_run_id | auto-20260912-us0133 |
| delivery_mode | ultra_lean |
| macro_phase | plan |
| fresh_context_marker | tl-US0133-sprintplan-20260912T112500Z-fresh |
| timestamp | 2026-09-12T11:25:00Z (UTC) |
| model_id | cursor-grok-4.6 (CROSS_MODEL_REVIEW=1 — required) |
| evidence_ref | sprints/S0137/sprint.md, sprints/S0137/tasks.md, sprints/S0137/progress.md, sprints/S0137/uat.json, sprints/S0137/uat.md, handoffs/tl_to_dev.md (US-0133 prepend), docs/engineering/state.md (sprint-plan checkpoint + traceability), docs/engineering/architecture.md # US-0133 (not mutated), decisions/DEC-0133.md (not mutated), handoffs/resume_brief.md |

Prior phase proof consumed: `rp-auto-20260912-us0133-architecture-techlead-20260912T111500Z-US-0133` / `825C6B9EDE5BDC0BFE3911BFA93B3A6AFE2E14BFE2523F4528B07B121897A5B7` — RUNTIME_PROOF_VALID (MATCH before TTL 2026-09-12T12:15:00Z; consumed 2026-09-12T11:25:00Z). Sovereign-critic architecture PASS (`critic-US0133-architecture-20260912T112000Z-fresh`; anti_slop=10; 0 blocking; NBs routed).

## Runtime proof (DEC-0038)

| Field | Value |
|---|---|
| runtime_proof_id | rp-auto-20260912-us0133-sprint-plan-techlead-20260912T112500Z-US-0133 |
| phase_id | sprint-plan |
| role | tech-lead |
| story_id | US-0133 |
| sprint_id | S0137 |
| orchestrator_run_id | auto-20260912-us0133 |
| delivery_mode | ultra_lean |
| macro_phase | plan |
| model_id | cursor-grok-4.6 (CROSS_MODEL_REVIEW=1 — required) |
| proof_issued_at | 2026-09-12T11:25:00Z |
| proof_ttl_seconds | 3600 |
| proof_ttl | 2026-09-12T12:25:00Z (UTC) |
| proof_hash | A702E976CD3B489CF0CE3F0CD02482BF19088CB5F02DA183606CD811C322A0C3 |
| canonical_payload | `{"delivery_mode":"ultra_lean","macro_phase":"plan","model_id":"cursor-grok-4.6","orchestrator_run_id":"auto-20260912-us0133","phase_id":"sprint-plan","proof_issued_at":"2026-09-12T11:25:00Z","proof_ttl_seconds":3600,"role":"tech-lead","runtime_proof_id":"rp-auto-20260912-us0133-sprint-plan-techlead-20260912T112500Z-US-0133","sprint_id":"S0137","story_id":"US-0133"}` |

## Decision gate

| Field | Value |
|---|---|
| decision_gate | false |
| stop_conditions_met | yes |
| missing_acceptance_criteria | none (6/6 slices + primary acceptance row covered; 10 contract-test markers) |
| compose_guards | kit files / US-0134 / US-0137 / US-0135..US-0148 / BUG-0018 / R-0120 / DEC-0133 / US-0045 UNCHANGED |
| dc_check | clean (`# US-0133` H1 already added in /architecture; DEC-0133 Accepted) |
| task_count | 10 (within SPRINT_MAX_TASKS=12; SPRINT_AUTO_SPLIT=1 but no split needed; 1:1 seeds) |
| risks_finalized | 6/6 ACCEPTED (R1..R6) |
| approach | A1 locked |
| companion_DEC | DEC-0133 Accepted |
| plan-verify readiness | ultra_lean — plan-verify NOT in resolved_phase_plan; skipped; plan-verify.json NOT written in this spawn |
| sovereign_memory_note | `assemble_sovereign_memory_digest(...)` NOT called; no mistakes.jsonl write |

## Definition of done (sprint-plan)

- [x] 10 tasks enumerated (T-anch + T-001..T-009) — within SPRINT_MAX_TASKS=12; 1:1 from architecture seeds
- [x] 6/6 ACs surjective + primary acceptance.md US-0133 covered
- [x] Task dependency graph documented
- [x] Execute phase role matrix documented (ultra_lean — /plan-verify skipped; next = /execute)
- [x] Compose guards UNCHANGED
- [x] Critic carry-ins (3 non-blocking from architecture sovereign-critic) routed as execute awareness; sprint id locked **S0137**
- [x] Isolation evidence + runtime proof emitted (model_id=cursor-grok-4.6 present)
- [x] Sprint-plan checkpoint appended to `docs/engineering/state.md`
- [x] Sprint-plan handoff prepended to `handoffs/tl_to_dev.md`
- [x] Sprint-plan PASS prepended to `handoffs/resume_brief.md` (-> /execute)
- [x] UAT placeholders written (`uat.json` empty steps, `uat.md` ACs no results)
- [x] Traceability row added (Story=US-0133 | Sprint=S0137 | Tasks=T-anch+T-001..T-009 | Status=PLANNED | Evidence empty)
- [x] Backlog status OPEN (US-0045 — not mutated); acceptance unchecked; sprint_plan_notes appended

## Next scheduled phase

| Field | Value |
|---|---|
| next_scheduled_phase | `/execute` (role=dev per US-0069 / DEC-0051; fresh dev subagent per BUG-0006; first canonical phase of `build+verify` macro per ultra_lean; plan-verify NOT in resolved_phase_plan — skipped). Orchestrator may run sovereign-critic of sprint-plan first (CROSS_MODEL_REVIEW=1). Do not mandate outer driver. |
| next_scheduled_role | dev |
| next_sprint_macro | build+verify (ultra_lean — plan-verify skipped at this boundary) |
| stop_condition | STOP after sprint-plan completes; hand off via artifacts only. Orchestrator owns critic of sprint-plan (if CROSS_MODEL_REVIEW=1) then `/execute` in fresh dev subagent per BUG-0006. Do not spawn /execute or /plan-verify from this subagent. |
| artifacts_written | sprints/S0137/ (sprint.md, tasks.md, progress.md, uat.json, uat.md), docs/engineering/state.md (sprint-plan checkpoint + traceability), handoffs/tl_to_dev.md (US-0133 prepend), handoffs/resume_brief.md (sprint-plan PASS prepend -> /execute), docs/product/backlog.md (sprint_plan_notes append; Status OPEN) |
