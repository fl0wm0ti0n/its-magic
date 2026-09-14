# Sprint S0149 - Sprint Plan (US-0141)

## Metadata

| Field | Value |
|---|---|
| story_id | US-0141 |
| bug_id | (none) |
| story_title | Application runtime and pluggable execution backends |
| sprint_id | S0149 |
| delivery_mode | ultra_lean |
| macro_phase | plan (sprint-plan terminal; plan-verify NOT in resolved_phase_plan — skipped; next = sovereign-critic of sprint-plan then execute) |
| current_phase | sprint-plan |
| approach | A1 locked (from R-0138 DQ1–DQ10; DEC-0141 Accepted; architecture critic NB1–NB3 CLOSED) |
| companion_DEC | DEC-0141 (Accepted) |
| research_anchor | R-0138 (DQ1–DQ10 LOCKED; compose R-0135 / R-0130 / R-0129 / R-0128 / R-0085 / R-0068; do not wipe R-0120..R-0138; R-0137 remains BUG-0023) |
| architecture_anchor | docs/engineering/architecture.md # US-0141 |
| orchestrator_run_id | auto-20260913-us0141 |
| parent_orchestrator_run_id | auto-20260913-us0140 |
| fresh_context_marker | tl-US0141-sprintplan-20260914T005000Z-fresh |
| timestamp | 2026-09-14T00:50:00Z (UTC) |
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
| sprint_id_lock | **S0149** is next free after S0148 (BUG-0023). Confirmed no S0149 folder existed before this spawn. Do not reuse S0146 (BUG-0021), S0147 (US-0140), or S0148 (BUG-0023). |
| critic_carry_ins | 0 new blocking; 3 architecture critic NBs us0141arc-* status=resolved non-blocking — routed as awareness into /execute |

## Scope summary

Add one owned application runtime so operators can discover, start, observe, repair, and clean up real applications across local and Docker (core v1) plus typed WSL/SSH/remote-Docker adapters. New package `@its-magic/app-runtime` never imports Pi. Compose US-0140 `RunsStore.process_handles` **additively** (ProcessManager writes; workflow `reserveProcessHandle` remains a claim token). Do **not** nest AppRuntime inside CommandRouter/GateEngine. AppRuntime **owns** restart; Docker HEALTHCHECK is **status-only**. Browser UAT is **US-0142 OUT**. `/auto`/`/quick` drain is **US-0143 OUT**. OS micro-VM is future (`BACKEND_UNSUPPORTED`). Role-runtime / PolicyEngine / config / KernelBridge / isolation loader stay **unamended**. DEC-0038 `compute_strict_proof_hash` tuple stays **UNAMENDED**. Execute owns package files.

Approach A1 (DEC-0141 Accepted): `standalone/packages/app-runtime` (`@its-magic/app-runtime`, private, no Pi imports) + `AppRuntime` facade + `ProcessManager` + `ExecutionBackend` (`name`/`execute`/`health_check`) CLI-first local+docker core + typed WSL/SSH/remote-Docker adapters + stack profiles (port `detect_stack_profile`) + bounded self-debug (`APP_RUNTIME_RESTART_MAX` default 3) + Connect handoff field names (no browser) + 12 `test_us0141_*` on Windows + Linux, fake-model CI, fake backends.

Out of scope: A2 nested `runtime-core/src/runtime/`, A3 two packages `execution-runtime`+`dev-environment`, A4 dockerode-as-facade, A5 kit Python as the runtime, A6 PM2/forever, A7 HEALTHCHECK-owned restart, A8 browser UAT (US-0142), A9 micro-VM, A10 rewrite workflow/GateEngine/PolicyEngine/config/KernelBridge/`noTools`, A11 live Docker/WSL/SSH required in CI, A12 fold into `tool-broker`, A13 unknown backend → silent local, A14 second SQLite, US-0142..US-0148, marking US-0141 DONE, ticking AC checkboxes, reopening US-0133..US-0140, mutating BUG-0021/BUG-0022/BUG-0023 or S0146/S0147/S0148, wiping R-0120..R-0138.

## Execute awareness (architecture critic NBs — 0 blocking)

Sovereign-critic of architecture PASS (`critic-US0141-architecture-20260914T004000Z-fresh`; anti_slop=10; 0 blocking; degraded_mode=false). Consumed architecture proof MATCH before TTL. Route these resolved NBs as execute awareness — do not re-open them as work:

| Finding | Issue key | Execute awareness |
|---|---|---|
| us0141arc-challenger-001 | ik_us0141arc_proof_failclosed_pass | T-003/T-004/T-006/T-009/T-010: fail-closed `BACKEND_*` / `APP_RUNTIME_*` / `PROCESS_*` locked DEC-0141. HEALTHCHECK status-only; AppRuntime owns restart. Unknown backend is **not** local fallback. Never read `.env`. US-0142 browser OUT. `compute_strict_proof_hash` tuple unamended. Status OPEN; R-0138 not R-0137. |
| us0141arc-architect-002 | ik_us0141arc_layer_sprintplan_owns_s0149 | Keep **T-anch..T-010 1:1** from architecture seeds; sprint folder is **S0149** (S0148=BUG-0023 occupied). Architecture owns H1+DEC-0141; execute owns `@its-magic/app-runtime` + additive `process_handles` + 12 tests. Compose US-0140 RunsStore; do not rewrite workflow/GateEngine. US-0142 browser OUT; US-0143 drain OUT. |
| us0141arc-subtractor-003 | ik_us0141arc_scope_yagni_pass | T-anch ceremony overlap acceptable. Do not invent extra tasks. Do not amend isolation loader / `noTools` / KernelBridge / auth-models / PolicyEngine tables / RoleCatalog internals / config loaders. Do not design US-0142+. Do not own credentials or read `.env`. Do not mark US-0141 DONE. Do not reopen US-0133..US-0140. Do not mutate BUG-0021/0022/0023 or S0146/S0147/S0148. 12 markers required. 11 tasks within SPRINT_MAX_TASKS=12. |

## Acceptance criteria (8) — US-0141 (status OPEN, unchecked per US-0045)

Primary acceptance (`docs/product/acceptance.md` US-0141 row): Discover, launch, observe, and repair applications locally or remotely — AppRuntime + ProcessManager + ExecutionBackend + stack profiles + bounded remediation + evidence + Connect/cleanup + chaos (8 ACs).

- **AC-1**: `AppRuntime` discovers stack-aware profiles and supports start, stop, restart, health, and bounded log retrieval. — T-001 (T-010 m1).
- **AC-2**: `ProcessManager` tracks process/container/service identity, command/cwd, ports/URL, readiness, start time, log ring, crash/restart count, and owning run/phase. — T-002 (T-010 m2).
- **AC-3**: `ExecutionBackend` supports local and Docker in core v1 plus WSL and SSH/remote Docker through typed adapters with connectivity diagnostics. — T-003, T-004 (T-010 m3, m4).
- **AC-4**: Supported Node, Python, Go, Java, and .NET projects receive stack-aware test/start behavior; unknown stacks fail or fall back deterministically. — T-005 (T-010 m5).
- **AC-5**: Startup/health failure captures logs, classifies failure, optionally spawns a fresh DEV remediation session, rebuilds/restarts, and stops at a configured retry cap with a deterministic reason. — T-006 (T-010 m6).
- **AC-6**: Test/build commands execute through the selected backend and persist structured exit, duration, stdout, and stderr evidence while summarizing large logs for model context. — T-007 (T-010 m7).
- **AC-7**: App URL/ports and health are safely exposed to browser QA; process cleanup works after success, failure, cancellation, and runtime restart. — T-008 (T-010 m8, m9).
- **AC-8**: Integration and chaos fixtures cover local web app, Docker stack, remote disconnect, process crash, timeout, restart, and unsupported backend. — T-009, T-010 m10–m12.

## Task summaries (11 — T-anch + T-001..T-010)

- **T-anch** (NO-OP / verification): Verify `# US-0141` H1 + DEC-0141 Accepted + A1 + R-0138 DQ1–DQ10 + 12-marker list. Record to `sprints/S0149/t-anch-verification.md`. NO mutation to `architecture.md` / `DEC-0141.md` / R-0138 in /execute.
- **T-001** (AC-1): Create `standalone/packages/app-runtime` (`@its-magic/app-runtime`). `private: true`, `version: 0.0.0`, `type: module`, `engines.node >=22.19.0`, export `./src/index.ts`. AppRuntime facade. No Pi imports. Extend US-0133..0140 Pi-import grep. Do not nest inside `runtime-core/workflow/` or GateEngine. Kit `files` omit `standalone/`.
- **T-002** (AC-2): Additive `process_handles` columns + ProcessManager via `upsertProcessHandle` / `listProcessHandlesForRun`. Workflow `reserveProcessHandle` remains a claim token. Log ring files under `.its-magic/runtime/logs/` + in-memory 256 lines; SQLite stores refs.
- **T-003** (AC-3): `ExecutionBackend` `name()`/`execute()`/`health_check()`. Core v1: `local` + `docker` (`docker-local`) via `child_process.spawn` + CLI-first `docker`/`docker compose`. Thin `DockerClient` (dockerode later-swap, not required). `health_check` before execute.
- **T-004** (AC-3): Typed adapters `wsl` + `ssh`/`remote-docker` + connectivity diagnostics. Missing binary/daemon/distro/SSH → fail-closed `BACKEND_*`. Password SSH unsupported. Compose US-0086 `remote.json` as **input**.
- **T-005** (AC-4): Port `detect_stack_profile` into TS (do not spawn Python). Order: `package.json`→`node`; `pyproject.toml`/`setup.py`→`python`; `go.mod`→`go`; `*.csproj`→`dotnet`; `pom.xml`→`java`. Unknown → `APP_RUNTIME_UNSUPPORTED_STACK` unless `DEV_SERVER_COMMAND` / `start_command`.
- **T-006** (AC-5): Bounded self-debug: capture → classify → optional fresh DEV (`SessionSupervisor.spawn`) → rebuild/restart → cap. `APP_RUNTIME_RESTART_MAX` default 3. Exhaust → `APP_RUNTIME_RESTART_CAP_EXHAUSTED`. HEALTHCHECK status-only; AppRuntime owns restart.
- **T-007** (AC-6): Test/build evidence JSON `{ command, backend, exit_code, duration_ms, stdout_ref, stderr_ref, reason_code? }`. Summarize large logs (head/tail + error lines, 8 KiB model budget).
- **T-008** (AC-7): Connect handoff field names (`connect_endpoint`, `health_path`, `service_id`, `container_id`, `env_refs` names-only). No Playwright/CDP. Cleanup + orphan reap (`PROCESS_ORPHAN_REAPED`). Never read `.env`.
- **T-009** (AC-8): Chaos fixtures with fake backends: crash, timeout, restart, docker stack, remote disconnect (fake).
- **T-010** (AC-1..AC-8): Twelve `test_us0141_*` markers (DEC-0141 §12). Primary `standalone/tests/contract` (`node:test`) Windows + Linux. Fake-model CI. In-memory SQLite. Fake backends. Count stays 12.

Execution order: T-anch → T-001 → T-002 → T-003 → T-004 → T-005 → T-006 → T-007 → T-008 → T-009 → T-010 (acyclic). No split (11 ≤ 12). Not `/quick`.

## AC → Task surjective coverage

| AC | Task(s) |
|---|---|
| AC-1 (AppRuntime lifecycle) | T-001 (T-010 m1) |
| AC-2 (ProcessManager identity) | T-002 (T-010 m2) |
| AC-3 (ExecutionBackend matrix) | T-003, T-004 (T-010 m3, m4) |
| AC-4 (stack profiles) | T-005 (T-010 m5) |
| AC-5 (bounded self-debug) | T-006 (T-010 m6) |
| AC-6 (test/build evidence) | T-007 (T-010 m7) |
| AC-7 (Connect + cleanup) | T-008 (T-010 m8, m9) |
| AC-8 (chaos + unsupported backend) | T-009, T-010 m10–m12 |
| DC / architecture baseline | T-anch |

**Surjectivity check**: 8/8 ACs covered (each AC ≥1 task) + primary acceptance.md US-0141 row covered by AC-1..AC-8 aggregate. T-010 markers m1–m12 attest AC-1..AC-8. No `PLAN_AC_COVERAGE_GAP`. T-anch retained as verification-only.

## Locked 12-marker table (DEC-0141 / architecture)

1. `test_us0141_app_runtime_lifecycle`
2. `test_us0141_process_manager_identity`
3. `test_us0141_backend_local_docker_core`
4. `test_us0141_backend_wsl_ssh_adapters`
5. `test_us0141_stack_profiles`
6. `test_us0141_self_debug_cap`
7. `test_us0141_test_build_evidence`
8. `test_us0141_connect_handoff_no_browser`
9. `test_us0141_cleanup_success_fail_cancel`
10. `test_us0141_chaos_crash_timeout_restart`
11. `test_us0141_chaos_docker_remote_disconnect`
12. `test_us0141_unsupported_backend`

Primary: `standalone/tests/contract` (`node:test`) Windows + Linux. Fake-model CI. In-memory SQLite. No paid model calls. No required live Docker/WSL/SSH. Count stays 12.

## Risks (R1–R6 — accepted)

| Risk | Severity | Mitigation |
|---|---|---|
| R1 Live Docker/WSL/SSH absent on CI hosts | MEDIUM | T-003/T-004/T-009/T-010: fake backends; unavailable codes asserted, not skipped |
| R2 Operators treat US-0098 JSON or HEALTHCHECK as the owner | MEDIUM | T-006/T-008/T-010 m6/m8: AppRuntime owns restart; HEALTHCHECK status-only |
| R3 Log files leak secrets | LOW | T-007/T-008: names-only env; redact Authorization/Cookie; never read `.env` |
| R4 Orphan processes after runtime crash | MEDIUM | T-008/T-010 m9: AppRuntime reaps process/container orphans; workflow `discardOrphans` remains sessions-only |
| R5 npm name bikeshed `app-runtime` vs `execution-runtime` | LOW | T-001: H1/DEC-0141 pins `app-runtime` |
| R6 ToolBroker `itsm_app_*` scope creep | LOW | T-001: optional seed only; PolicyEngine tables unamended |

## Compose guards (UNCHANGED)

| Target | Result |
|---|---|
| US-0140 / DEC-0140 / R-0135 | `RunsStore.process_handles` additive; workflow/GateEngine not rewritten |
| US-0138 / DEC-0138 / R-0130 | consume `APP_RUNTIME_RESTART_MAX`; no new RuntimeConfig domain |
| US-0137 / DEC-0137 / R-0129 | PolicyEngine Layer A consume; Layer B profiles only |
| US-0136 / DEC-0136 / R-0128 | SessionSupervisor `spawn` fresh DEV slot; internals unamended |
| US-0135 / DEC-0135 / R-0127 | never read `.env`; redact logs |
| US-0098 / R-0085 | Connect field names as input; AppRuntime owns execution |
| US-0086 / R-0068 / DEC-0070 | `remote.json` / `REMOTE_*` input routing, not AppRuntime codes |
| US-0065 | port `detect_stack_profile` semantics; Python lib unamended |
| US-0085 | `.env` deny |
| US-0056 / DEC-0038 | `compute_strict_proof_hash` tuple UNAMENDED |
| Kit npm `its-magic` / DEC-0120 | `files` whitelist omit `standalone/` |
| US-0142..US-0148 | OUT OF SCOPE (US-0142 browser; US-0143 drain) |
| US-0133..US-0140 DONE | compose only, do not reopen |
| BUG-0021 DONE | not mutated (`sprints/S0146/`) |
| BUG-0022 OPEN | not mutated |
| BUG-0023 OPEN | not mutated (`sprints/S0148/`) |
| R-0120..R-0138 | not wiped (R-0136/R-0137 intact) |
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
| story_id | US-0141 |
| sprint_id | S0149 |
| orchestrator_run_id | auto-20260913-us0141 |
| parent_orchestrator_run_id | auto-20260913-us0140 |
| delivery_mode | ultra_lean |
| macro_phase | plan |
| fresh_context_marker | tl-US0141-sprintplan-20260914T005000Z-fresh |
| timestamp | 2026-09-14T00:50:00Z (UTC) |
| model_id | cursor-grok-4.6-high (CROSS_MODEL_REVIEW=1 — required) |
| evidence_ref | sprints/S0149/sprint.md, tasks.md, progress.md, uat.json, uat.md, plan-verify.json (SKIPPED), summary.md, qa-findings.md, release-findings.md, closure-verification.md, handoffs/tl_to_dev.md, docs/engineering/state.md, handoffs/resume_brief.md, docs/product/backlog.md ## US-0141 sprint_plan_notes |

Prior phase proof consumed: `rp-auto-20260913-us0141-architecture-techlead-20260914T003000Z-US-0141` / `4B5EBD9D8FF00C4C7CC5CF114B946AFBA684E11998C4C553C59AE5080326A3BF` — RUNTIME_PROOF_VALID (independent `compute_strict_proof_hash` MATCH, consumed 2026-09-14T00:50:00Z before TTL 2026-09-14T01:30:00Z). Sovereign-critic architecture PASS (`rp-auto-20260913-us0141-sovereign-critic-techlead-20260914T004000Z-US-0141` / `581985E343F2274BE2B09E16F505C1E472F5955FCA350F4BD571AD3532428118`; `critic-US0141-architecture-20260914T004000Z-fresh`; anti_slop=10; 0 blocking; degraded_mode=false; findings us0141arc-* informational — routed). MATCH before TTL 2026-09-14T01:40:00Z.

## Runtime proof (DEC-0038)

| Field | Value |
|---|---|
| runtime_proof_id | rp-auto-20260913-us0141-sprint-plan-techlead-20260914T005000Z-US-0141 |
| phase_id | sprint-plan |
| role | tech-lead |
| story_id | US-0141 |
| sprint_id | S0149 |
| orchestrator_run_id | auto-20260913-us0141 |
| delivery_mode | ultra_lean |
| macro_phase | plan |
| model_id | cursor-grok-4.6-high (CROSS_MODEL_REVIEW=1 — required) |
| proof_issued_at | 2026-09-14T00:50:00Z |
| proof_ttl_seconds | 3600 |
| proof_ttl | 2026-09-14T01:50:00Z (UTC) |
| proof_hash | 04696BE6D2E51F966804C58784F8239000011299CECE0ECB13BED846B113555E |
| canonical_payload | `{"orchestrator_run_id":"auto-20260913-us0141","phase_id":"sprint-plan","proof_issued_at":"2026-09-14T00:50:00Z","proof_ttl_seconds":3600,"role":"tech-lead","runtime_proof_id":"rp-auto-20260913-us0141-sprint-plan-techlead-20260914T005000Z-US-0141"}` |

Hash via `scripts.token_cost_lib.compute_strict_proof_hash` (positional, compact sorted-key JSON). Isolation extras (not hashed): `delivery_mode=ultra_lean`, `macro_phase=plan`, `model_id=cursor-grok-4.6-high`, `sprint_id=S0149`, `story_id=US-0141`. hash_recompute_confirmation=true (compute_strict_proof_hash → 04696BE6D2E51F966804C58784F8239000011299CECE0ECB13BED846B113555E).

## Decision gate

| Field | Value |
|---|---|
| decision_gate | false |
| stop_conditions_met | yes |
| missing_acceptance_criteria | none (8/8 slices + primary acceptance row covered, 12 contract-test markers) |
| task_count | 11 (within SPRINT_MAX_TASKS=12, SPRINT_AUTO_SPLIT=1 but no split needed, 1:1 seeds, not /quick, not --bulk) |
| risks_finalized | 6/6 ACCEPTED (R1..R6) |
| approach | A1 locked |
| companion_DEC | DEC-0141 Accepted |
| plan-verify readiness | ultra_lean — plan-verify NOT in resolved_phase_plan, skipped, plan-verify.json is a SKIPPED placeholder (`ultra_lean_not_in_resolved_phase_plan`) |
| sovereign_memory_note | `build_injection_digest_block` returned `(no sovereign memory entries)` (read-only). No `mistakes.jsonl` write. |

## Definition of done (sprint-plan)

- [x] 11 tasks enumerated (T-anch + T-001..T-010) — within SPRINT_MAX_TASKS=12, 1:1 from architecture seeds
- [x] 8/8 ACs surjective + primary acceptance.md US-0141 covered
- [x] All 12 `test_us0141_*` mapped
- [x] Task dependency graph documented
- [x] Execute phase role matrix documented (ultra_lean — /plan-verify skipped, next = sovereign-critic then /execute)
- [x] Compose guards UNCHANGED
- [x] Critic carry-ins (3 non-blocking from architecture sovereign-critic) routed as execute awareness, sprint id locked S0149
- [x] Isolation evidence + runtime proof emitted (model_id=cursor-grok-4.6-high present)
- [x] Sprint-plan checkpoint appended to docs/engineering/state.md
- [x] Sprint-plan handoff prepended to handoffs/tl_to_dev.md
- [x] Sprint-plan PASS prepended to handoffs/resume_brief.md (→ sovereign-critic then /execute, not plan-verify)
- [x] UAT placeholders written (uat.json empty steps, uat.md ACs no results)
- [x] Lifecycle stubs written (summary.md, qa-findings.md, release-findings.md, closure-verification.md)
- [x] Traceability row added (Story=US-0141, Sprint=S0149, Tasks=T-anch+T-001..T-010, Status=PLANNED, Evidence empty)
- [x] Backlog status OPEN (US-0045 — not mutated), acceptance unchecked, sprint_plan_notes appended
- [x] plan-verify.json SKIPPED placeholder (not a QA phase)

## Next scheduled phase

| Field | Value |
|---|---|
| next_scheduled_phase | sovereign-critic (sprint-plan, CROSS_MODEL_REVIEW=1) then /execute (role=dev per US-0069 / DEC-0051, fresh dev subagent per BUG-0006, first canonical phase of build+verify macro per ultra_lean, plan-verify NOT in resolved_phase_plan — skipped) |
| next_scheduled_role | tech-lead (critic of sprint-plan), then dev |
| next_sprint_macro | build+verify (ultra_lean — plan-verify skipped at this boundary) |
| stop_condition | STOP after sprint-plan completes, hand off via artifacts only. Orchestrator MUST spawn sovereign-critic of sprint-plan then /execute in fresh dev subagent per BUG-0006. Do not spawn /execute, /plan-verify, or critic from this subagent. |
