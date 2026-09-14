# Sprint S0143 - Sprint Plan (US-0137)

## Metadata

| Field | Value |
|---|---|
| story_id | US-0137 |
| bug_id | (none) |
| story_title | Owned tool broker, policy engine, and security boundary |
| sprint_id | S0143 |
| delivery_mode | ultra_lean |
| macro_phase | plan (sprint-plan terminal; plan-verify NOT in resolved_phase_plan — skipped; next = execute) |
| current_phase | sprint-plan |
| approach | A1 locked (from R-0129 DQ1–DQ10; DEC-0137 Accepted; architecture critic NB1–NB3 CLOSED) |
| companion_DEC | DEC-0137 (Accepted) |
| research_anchor | R-0129 (DQ1–DQ10 LOCKED; compose R-0121 / R-0122 / R-0127 / R-0128; do not wipe R-0120..R-0128) |
| architecture_anchor | docs/engineering/architecture.md # US-0137 |
| orchestrator_run_id | auto-20260913-us0137 |
| parent_orchestrator_run_id | auto-20260913-us0136 |
| fresh_context_marker | tl-US0137-sprintplan-20260913T111500Z-fresh |
| timestamp | 2026-09-13T11:15:00Z (UTC) |
| model_id | cursor-grok-4.6-high (CROSS_MODEL_REVIEW=1 — required on isolation) |
| verdict | PASS |
| decision_gate | false |
| SPRINT_MAX_TASKS | 12 |
| SPRINT_AUTO_SPLIT | 1 |
| task_count | 11 (T-anch + T-001..T-010; within 12; no split; 1:1 from architecture seeds) |
| COMPONENT_SCOPE_MODE | 0 |
| USER_GUIDE_MODE | 0 |
| plan-verify | ultra_lean — NOT in resolved_phase_plan; skipped; plan-verify.json written as SKIPPED placeholder only (not a QA phase; QA may overwrite in build+verify) |
| backlog_status | OPEN (US-0045 — not mutated; AC-1..AC-8 unchecked) |
| sprint_id_lock | **S0143** is next free after S0142 (US-0136). Confirmed no S0143 folder existed before this spawn. |
| critic_carry_ins | 0 new blocking; 3 architecture critic NBs `us0137asc-*` status=resolved non-blocking — routed as awareness into /execute (below) |

## Scope summary

Add **owned standalone PolicyEngine + ToolBroker** so every consequential file/shell/git/test/app/browser/remote/deploy action is mediated by semantic authorization (Layer A). Models cannot bypass phase ownership, secret controls, approvals, or execution-isolation **profiles**. Layer A is **not** an OS sandbox (Layer B = US-0141 OUT). Pi stays behind `packages/pi-kernel`. `policy-engine` and `tool-broker` never import Pi. `defineTool` lives **only** in `pi-kernel`. Production sessions receive role/phase `itsm_*` only. Fake-model CI default, empty resource loader, `noTools: "builtin"`, KernelBridge, auth-models, and role-runtime stay **unamended** except spawn allowlist + real `policy_hash`. DEC-0038 `compute_strict_proof_hash` tuple stays **UNAMENDED**.

**Approach A1** (DEC-0137 Accepted): `standalone/packages/policy-engine` + `standalone/packages/tool-broker` (`@its-magic/policy-engine` / `@its-magic/tool-broker`, private, **no Pi imports**) + thin kernel tool-port wrapping `defineTool` only inside `pi-kernel`; production `itsm_*` via ToolBroker; `noTools: "builtin"` held; PolicyEngine ALLOW\|ASK\|DENY; path/shell/secret/audit; Layer A profiles + fail-closed missing Layer B; real `policy_hash` replacing DEC-0136 stub **value source**; ten `test_us0137_*` on Windows + Linux; fake-model CI default **held**.

Out of scope: A2 fold into `pi-kernel`; A3 fold into `role-runtime`; A4 fold into `runtime-core`; A5 Pi raw tools / drop `noTools`; A6 claim OS sandbox from in-process checks; A7 Cedar/OPA/Cerbos/AgentCore Policy; A8 extend `compute_strict_proof_hash`; A9 amend RoleCatalog as permission matrix; A10 SQLite this story; A11 live paid CI; A12 amend isolation loader / KernelBridge / auth-models; US-0138..US-0148; marking US-0137 DONE; ticking AC checkboxes; reopening US-0133, US-0134, US-0135, US-0136, or BUG-0020; wiping R-0120..R-0129.

## Execute awareness (architecture critic NBs — 0 blocking)

Sovereign-critic of architecture PASS (`critic-US0137-architecture-20260913T110500Z-fresh`; anti_slop=10; 0 blocking; degraded_mode=false). Consumed architecture proof MATCH before TTL. Route these resolved NBs as execute awareness — do not re-open them as work:

| Finding | Issue key | Execute awareness |
|---|---|---|
| `us0137asc-challenger-001` | `ik_us0137arc_proof_failclosed_pass` | **T-003/T-004/T-005/T-006/T-008/T-010**: fail-closed edges locked DEC-0137 §3–§11 — raw Pi tools, path ownership, shell exfil, secret deny, Layer B unavailable, malicious extensions; `compute_strict_proof_hash` tuple unamended. |
| `us0137asc-architect-002` | `ik_us0137arc_layer_policy_broker_ok` | Keep **T-anch..T-010 1:1** from architecture seeds; sprint folder is **S0143**; architecture owns H1+DEC-0137; execute owns `policy-engine` + `tool-broker` bootstrap + kernel tool-port + catalog + 10 tests. PolicyEngine vs RoleCatalog (intent vs permission); `defineTool` only in pi-kernel; US-0141 Layer B deferred; compose DEC-0133/0134/0135/0136 held. |
| `us0137asc-subtractor-003` | `ik_us0137arc_scope_yagni_pass` | T-anch ceremony overlap acceptable. Do not invent extra tasks. Do not amend isolation loader / `noTools` / KernelBridge / auth-models. Do not design US-0138+. Do not claim OS sandbox. Do not mark US-0137 DONE. Do not reopen US-0136, US-0135, or BUG-0020. 10 markers required. 11 tasks within SPRINT_MAX_TASKS=12. |

## Acceptance criteria (8) — US-0137 (status OPEN, unchecked per US-0045)

Primary acceptance (`docs/product/acceptance.md` US-0137 row): Owned tool broker, policy engine, and security boundary — role/path/shell controls, secrets, OS profiles, audit, and security tests (8 ACs).

- **AC-1**: Pi sessions receive only role/phase-specific `itsm_*` tools backed by `ToolBroker`; no raw Pi mutation tool reaches a production session. — T-001, T-008, T-009 (T-010 m1, m2, m10).
- **AC-2**: `PolicyEngine` evaluates role, phase, work item, sprint, worktree, paths, command, backend, autonomy, permission, security class, and approvals to return ALLOW, ASK, or DENY. — T-002.
- **AC-3**: Path ownership prevents PO production edits, QA silent production fixes, release closure, closure release edits, orchestrator phase writes, and curator product-intent rewrites. — T-003 (T-010 m3, m4).
- **AC-4**: Shell actions are parsed/classified, destructive, privileged, network, deploy, package, and git mutations follow explicit policy, and traversal/exfiltration attempts fail safely. — T-004 (T-010 m6, m7).
- **AC-5**: Secret files and values are never injected into LLM context; provider tokens and Authorization/Cookie data are redacted from logs and evidence. — T-005 (T-010 m5, m8).
- **AC-6**: Semantic policy and OS execution isolation are represented as separate layers with trusted-local, isolated-development, and untrusted-repository profiles. — T-006 (T-010 m9).
- **AC-7**: Every consequential action creates a compact audit record with run/session/tool identity, normalized action, policy decision, duration, result, and evidence reference but no secret payload. — T-007.
- **AC-8**: Security tests cover malicious project Pi resources, `.env` reads, path traversal, shell exfiltration, browser redaction, and unavailable isolation backends. — T-010.

## Task summaries (11 — T-anch + T-001..T-010)

- **T-anch** (NO-OP / verification): Verify `# US-0137` H1 + DEC-0137 Accepted + A1 + R-0129 DQ1–DQ10 + 10-marker list. Record to `sprints/S0143/t-anch-verification.md`. NO mutation to `architecture.md` / `DEC-0137.md` / R-0129 in /execute.
- **T-001** (AC-1): Create `standalone/packages/policy-engine` + `standalone/packages/tool-broker` (`@its-magic/policy-engine` / `@its-magic/tool-broker`, `private: true`, `version: 0.0.0`, `type: module`, `engines.node >=22.19.0`, export `./src/index.ts`). **No Pi imports.** Extend US-0133..0136 grep to deny Pi inside both packages. Do **not** add a Biome override. Kit `files` omit `standalone/`.
- **T-002** (AC-2): PolicyEngine owned TypeScript decision tables. Default-deny. Result ALLOW \| ASK \| DENY. Tuple + `security_hard` cannot be relaxed by autonomy. ASK store process-local + optional gitignored JSON; missing approval → DENY.
- **T-003** (AC-3): Path ownership deny matrix (code, not prompt). Canonicalize `path.resolve` + `realpath` vs worktree root. Reject traversal. PO/QA/release/closure/orchestrator/curator denies.
- **T-004** (AC-4): Shell classifier v1 argv / PowerShell token split. Unparseable → `POLICY_SHELL_UNPARSEABLE`. Fail-safe exfil/privileged/destructive/package/git-force denies.
- **T-005** (AC-5): Secret path deny **before** bytes enter tool `content`. Compose US-0135 `redact.ts`. Browser/header helper redacts `Authorization`/`Cookie` without implementing US-0142. Do not read `.env`.
- **T-006** (AC-6): Layer A profiles `trusted-local` \| `isolated-development` \| `untrusted-repository`. Missing Layer B backend → `ISOLATION_BACKEND_UNAVAILABLE`. Do not claim OS sandbox.
- **T-007** (AC-7): Compact audit row + real `policy_hash` (SHA-256 canonical JSON `{ schema_version: 1, policy_snapshot, tool_allowlist, role_catalog_digest }`). Replace DEC-0136 `stubPolicyHash` value source; keep field name. **Do not** extend DEC-0038.
- **T-008** (AC-1): Thin kernel tool-port: additive `ownedTools` on `KernelCreateSessionOptions`. **Only** `pi-kernel` calls `defineTool`. `noTools: "builtin"` held. Builtin names at the port → `POLICY_RAW_PI_TOOL_DENIED`. Empty isolation loader held. `PI_COMPAT_RESOURCES` default-off.
- **T-009** (AC-1): Per-role/phase `itsm_*` catalog. Live: `itsm_read`/`itsm_edit`/`itsm_write`/`itsm_patch`/`itsm_shell`/`itsm_git`. Fail-closed stubs. Orchestrator `[]`. Production catalog **excludes** `itsm_ping`. SessionSupervisor spawn allowlist = ToolBroker name list.
- **T-010** (AC-8): Ten `test_us0137_*` markers (DEC-0137 §11). Primary `standalone/tests/contract` (`node:test`) Windows + Linux. Kit twin as needed. Fake-model CI default **held**. No paid/model calls.

Execution order: T-anch → T-001 → T-002 → {T-003, T-004, T-005} → T-006 → T-007 → T-008 → T-009 → T-010 (acyclic). No split (`SPRINT_AUTO_SPLIT` not triggered; 11 ≤ 12). Not `/quick`.

## AC → Task surjective coverage

| AC | Task(s) |
|---|---|
| AC-1 (itsm_* via ToolBroker; no raw Pi tools) | T-001, T-008, T-009 (T-010 m1, m2, m10) |
| AC-2 (PolicyEngine ALLOW/ASK/DENY) | T-002 |
| AC-3 (path ownership deny matrix) | T-003 (T-010 m3, m4) |
| AC-4 (shell parse/classify + traversal/exfil) | T-004 (T-010 m6, m7) |
| AC-5 (secret deny + redact) | T-005 (T-010 m5, m8) |
| AC-6 (Layer A profiles ≠ Layer B) | T-006 (T-010 m9) |
| AC-7 (compact audit + real policy_hash) | T-007 |
| AC-8 (security tests) | T-010 |
| DC / architecture baseline | T-anch |

**Surjectivity check**: 8/8 ACs covered (each AC ≥1 task) + primary acceptance.md US-0137 row covered by AC-1..AC-8 aggregate. No `PLAN_AC_COVERAGE_GAP`. T-anch retained as verification-only.

## Locked 10-marker table (DEC-0137 §11 / architecture)

1. `test_us0137_no_raw_pi_tools_in_production_session`
2. `test_us0137_role_subset_itsm_tools`
3. `test_us0137_po_src_deny`
4. `test_us0137_qa_silent_fix_deny`
5. `test_us0137_env_read_deny`
6. `test_us0137_path_traversal_deny`
7. `test_us0137_shell_exfil_deny`
8. `test_us0137_browser_header_redaction`
9. `test_us0137_isolation_backend_unavailable`
10. `test_us0137_malicious_pi_extension_and_orchestrator_zero_tools`

Primary: `standalone/tests/contract` (`node:test`) Windows + Linux. Kit twin as needed. No paid/model calls. Fake-model CI default **held**.

## Risks (R1–R6 — accepted)

| Risk | Severity | Mitigation |
|---|---|---|
| R1 `ownedTools` accidentally includes a builtin name | MEDIUM | T-008/T-009: broker prefix `itsm_` only; T-010 m1 no-raw-Pi; `noTools: "builtin"` held; factory `POLICY_RAW_PI_TOOL_DENIED` |
| R2 operators treat Layer A as a sandbox | MEDIUM | T-006: DQ7 reason code + docs; US-0141 owns backends; T-010 m9 `ISOLATION_BACKEND_UNAVAILABLE` |
| R3 ASK store lost on crash | LOW | T-002: missing approval DENY; gitignored JSON optional; SQLite later |
| R4 `stubPolicyHash` callers still hash tools-only | LOW | T-007: replace value source; keep field name; contract test snapshot mismatch |
| R5 PowerShell vs bash classifier gaps | LOW | T-004: unparseable DENY; dual inventory; Win+Linux tests |
| R6 trusted-resource enablement silently loads project extensions | LOW | T-008: default-off; empty loader internals unamended; T-010 m10 malicious-extension fixture |

## Compose guards (UNCHANGED)

| Target | Result |
|---|---|
| US-0133 / DEC-0133 / R-0121 | compose additive `ownedTools` only; do not amend AgentKernel isolation / `noTools` / `# US-0133` |
| US-0134 / DEC-0134 / R-0122 | compose locate-only; KernelBridge **unamended** |
| US-0135 / DEC-0135 / R-0127 | compose `redact.ts`; auth-models **unamended** store |
| US-0136 / DEC-0136 / R-0128 | DONE compose-only; spawn allowlist + `policy_hash` value source only; RoleCatalog not a permission matrix |
| Kit npm `its-magic` / DEC-0120 `files` | compose — omit `standalone/` |
| US-0048 / DEC-0029 | compose — additive sidecar `policy_hash` |
| US-0056 / DEC-0038 | compose — `compute_strict_proof_hash` tuple **UNAMENDED** |
| US-0138..US-0148 | OUT OF SCOPE (US-0141 Layer B OUT) |
| US-0133 / US-0134 / US-0135 / US-0136 | DONE — compose only; do not reopen |
| BUG-0020 / R-0126 | DONE — do not reopen; do not wipe R-0126 |
| R-0120..R-0129 | do not wipe |
| DEC-0137 / `# US-0137` / R-0129 | locked — T-anch verify only |
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
| story_id | US-0137 |
| sprint_id | S0143 |
| orchestrator_run_id | auto-20260913-us0137 |
| delivery_mode | ultra_lean |
| macro_phase | plan |
| fresh_context_marker | tl-US0137-sprintplan-20260913T111500Z-fresh |
| timestamp | 2026-09-13T11:15:00Z (UTC) |
| model_id | cursor-grok-4.6-high (CROSS_MODEL_REVIEW=1 — required) |
| evidence_ref | sprints/S0143/sprint.md, sprints/S0143/tasks.md, sprints/S0143/progress.md, sprints/S0143/uat.json, sprints/S0143/uat.md, sprints/S0143/plan-verify.json (SKIPPED placeholder), handoffs/tl_to_dev.md (US-0137 prepend), docs/engineering/state.md (sprint-plan checkpoint + traceability), docs/engineering/architecture.md # US-0137 (not mutated), decisions/DEC-0137.md (not mutated), handoffs/resume_brief.md |

Prior phase proof consumed: `rp-auto-20260913-us0137-architecture-techlead-20260913T105500Z-US-0137` / `1BA2580EED66FC542D567EEF44EC4C6040854A0DFFCFABEE0087042E7657D97C` — RUNTIME_PROOF_VALID (independent `compute_strict_proof_hash` MATCH; consumed 2026-09-13T11:15:00Z before TTL 2026-09-13T11:55:00Z). Sovereign-critic architecture PASS (`rp-auto-20260913-us0137-sovereign-critic-techlead-20260913T110500Z-US-0137` / `EA78042C178EB8C42093D6E92389CE2E3CB114540E5369707BBC56A1F182F1CE`; `critic-US0137-architecture-20260913T110500Z-fresh`; anti_slop=10; 0 blocking; degraded_mode=false; findings `us0137asc-*` informational — routed).

## Runtime proof (DEC-0038)

| Field | Value |
|---|---|
| runtime_proof_id | rp-auto-20260913-us0137-sprint-plan-techlead-20260913T111500Z-US-0137 |
| phase_id | sprint-plan |
| role | tech-lead |
| story_id | US-0137 |
| sprint_id | S0143 |
| orchestrator_run_id | auto-20260913-us0137 |
| delivery_mode | ultra_lean |
| macro_phase | plan |
| model_id | cursor-grok-4.6-high (CROSS_MODEL_REVIEW=1 — required) |
| proof_issued_at | 2026-09-13T11:15:00Z |
| proof_ttl_seconds | 3600 |
| proof_ttl | 2026-09-13T12:15:00Z (UTC) |
| proof_hash | 90403EE6908313220976FDAFC69EA3E96BCB44EABC525574ED2499E6ABB89CE3 |
| canonical_payload | `{"orchestrator_run_id":"auto-20260913-us0137","phase_id":"sprint-plan","proof_issued_at":"2026-09-13T11:15:00Z","proof_ttl_seconds":3600,"role":"tech-lead","runtime_proof_id":"rp-auto-20260913-us0137-sprint-plan-techlead-20260913T111500Z-US-0137"}` |

Hash via `scripts.token_cost_lib.compute_strict_proof_hash` (positional; compact sorted-key JSON). Isolation extras (not hashed): `delivery_mode=ultra_lean`, `macro_phase=plan`, `model_id=cursor-grok-4.6-high`, `sprint_id=S0143`, `story_id=US-0137`. `hash_recompute_confirmation=true` (compute_strict_proof_hash → 90403EE6908313220976FDAFC69EA3E96BCB44EABC525574ED2499E6ABB89CE3).

## Decision gate

| Field | Value |
|---|---|
| decision_gate | false |
| stop_conditions_met | yes |
| missing_acceptance_criteria | none (8/8 slices + primary acceptance row covered; 10 contract-test markers) |
| compose_guards | US-0133/0134/0135/0136/DEC-0133/0134/0135/0136/kit files/US-0138..US-0148/BUG-0020/R-0120..R-0129/DEC-0137/US-0045 UNCHANGED |
| dc_check | clean (`# US-0137` H1 already added in /architecture; DEC-0137 Accepted) |
| task_count | 11 (within SPRINT_MAX_TASKS=12; SPRINT_AUTO_SPLIT=1 but no split needed; 1:1 seeds; not `/quick`; not `--bulk`) |
| risks_finalized | 6/6 ACCEPTED (R1..R6) |
| approach | A1 locked |
| companion_DEC | DEC-0137 Accepted |
| plan-verify readiness | ultra_lean — plan-verify NOT in resolved_phase_plan; skipped; plan-verify.json is a SKIPPED placeholder (not a QA spawn) |
| sovereign_memory_note | `assemble_sovereign_memory_digest(...)` NOT called; no mistakes.jsonl write |

## Definition of done (sprint-plan)

- [x] 11 tasks enumerated (T-anch + T-001..T-010) — within SPRINT_MAX_TASKS=12; 1:1 from architecture seeds
- [x] 8/8 ACs surjective + primary acceptance.md US-0137 covered
- [x] Task dependency graph documented
- [x] Execute phase role matrix documented (ultra_lean — /plan-verify skipped; next = /execute)
- [x] Compose guards UNCHANGED
- [x] Critic carry-ins (3 non-blocking from architecture sovereign-critic) routed as execute awareness; sprint id locked **S0143**
- [x] Isolation evidence + runtime proof emitted (model_id=cursor-grok-4.6-high present)
- [x] Sprint-plan checkpoint appended to `docs/engineering/state.md`
- [x] Sprint-plan handoff prepended to `handoffs/tl_to_dev.md`
- [x] Sprint-plan PASS prepended to `handoffs/resume_brief.md` (-> /execute)
- [x] UAT placeholders written (`uat.json` empty steps, `uat.md` ACs no results)
- [x] Traceability row added (Story=US-0137 | Sprint=S0143 | Tasks=T-anch+T-001..T-010 | Status=PLANNED | Evidence empty)
- [x] Backlog status OPEN (US-0045 — not mutated); acceptance unchecked; sprint_plan_notes appended
- [x] plan-verify.json SKIPPED placeholder (not a QA phase)

## Next scheduled phase

| Field | Value |
|---|---|
| next_scheduled_phase | `/execute` (role=dev per US-0069 / DEC-0051; fresh dev subagent per BUG-0006; first canonical phase of `build+verify` macro per ultra_lean; plan-verify NOT in resolved_phase_plan — skipped). Orchestrator may run sovereign-critic of sprint-plan first (CROSS_MODEL_REVIEW=1). Do not mandate outer driver. |
| next_scheduled_role | dev |
| next_sprint_macro | build+verify (ultra_lean — plan-verify skipped at this boundary) |
| stop_condition | STOP after sprint-plan completes; hand off via artifacts only. Orchestrator owns critic of sprint-plan (if CROSS_MODEL_REVIEW=1) then `/execute` in fresh dev subagent per BUG-0006. Do not spawn /execute or /plan-verify from this subagent. |
| artifacts_written | sprints/S0143/ (sprint.md, tasks.md, progress.md, summary.md stub, uat.json, uat.md, plan-verify.json SKIPPED placeholder), docs/engineering/state.md (sprint-plan checkpoint + traceability), handoffs/tl_to_dev.md (US-0137 prepend), handoffs/resume_brief.md (sprint-plan PASS prepend -> /execute), docs/product/backlog.md (sprint_plan_notes append; Status OPEN) |
