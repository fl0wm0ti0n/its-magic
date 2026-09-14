# Sprint S0138 - Sprint Plan (US-0134)

## Metadata

| Field | Value |
|---|---|
| story_id | US-0134 |
| bug_id | (none) |
| story_title | Existing kernel bridge and compatibility handshake |
| sprint_id | S0138 |
| delivery_mode | ultra_lean |
| macro_phase | plan (sprint-plan terminal; plan-verify NOT in resolved_phase_plan — skipped; next = execute) |
| current_phase | sprint-plan |
| approach | A1 locked (from R-0122 DQ1–DQ10; DEC-0134 Accepted; architecture critic NB1–NB3 CLOSED) |
| companion_DEC | DEC-0134 (Accepted) |
| research_anchor | R-0122 (DQ1–DQ10 LOCKED; do not wipe R-0120 / R-0121) |
| architecture_anchor | docs/engineering/architecture.md # US-0134 |
| orchestrator_run_id | auto-20260912-us0134 |
| parent_orchestrator_run_id | auto-20260912-us0133 |
| fresh_context_marker | tl-US0134-sprintplan-20260912T125500Z-fresh |
| timestamp | 2026-09-12T12:55:00Z (UTC) |
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
| sprint_id_lock | **S0138** is next free after S0137. Architecture critic NB2 preview `sprints/S0138/*` honored. |
| critic_carry_ins | 0 new blocking; 3 architecture critic NBs `us0134asc-*` status=resolved non-blocking — routed as awareness into /execute (below) |

## Scope summary

Add a **host-neutral TypeScript `KernelBridge`** so the standalone runtime consumes shipped Python validators and canonical repository artifacts as authoritative contracts. Locate is a three-marker parent walk. Compatibility is an explicit runtime→kernel range (`includePrerelease` so kit `0.1.3-9` is in-range). Fail-closed with exactly four `KERNEL_*` handshake codes. No TypeScript rewrite of validator semantics. No `its-magic-kernel/` extraction. Kit npm `its-magic` stays installer/template.

**Approach A1** (DEC-0134 Accepted): `standalone/packages/kernel-bridge` (`@its-magic/kernel-bridge`, private, no Pi). Three-marker parent walk + `--kernel-root`. DEC-0045 version file + additive `its_magic/kernel-contract.json`. Runtime `supported-kernel-range.json` + `semver@7.8.5` `includePrerelease`. Spawn real Python (probe then resolved interpreter). Thin `runUatPlanner` / `runStatusReconcile` wrappers. Ten `test_us0134_*` on Windows + Linux against temp fixture copies.

Out of scope: A2 extract `its-magic-kernel/`; A3 reimplement validators in TypeScript; A4 filename / kit `package.json` inference; A5 reuse OpenCode US-0125 plugin as the standalone bridge; `OPENCODE_*` on the standalone path; amending AgentKernel / `# US-0133` / DEC-0133; wrapping all 40+ `scripts/*.py`; RuntimeConfig range (US-0138); US-0135 auth/models; US-0136 SessionSupervisor; US-0137 ToolBroker; US-0140 lifecycle; US-0142 TypeScript UAT planner; live-provider CI; marking US-0134 DONE; ticking AC checkboxes; reopening BUG-0018; wiping R-0120 / R-0121.

## Execute awareness (architecture critic NBs — 0 blocking)

Sovereign-critic of architecture PASS (`critic-US0134-architecture-20260912T125000Z-fresh`; anti_slop=10; 0 blocking). Route these resolved NBs as execute awareness — do not re-open them as work:

| Finding | Issue key | Execute awareness |
|---|---|---|
| `us0134asc-challenger-001` | `ik_us0134_asc_proof_pass` | **T-002 / T-004 / T-008 / T-009**: R1 `includePrerelease` + fixtures `0.1.3-9` in-range / `0.1.2` unsupported; R2 probe then resolved `python.exe` (never keep `py -3` as the validator process); R3 missing `kernel-contract.json` fail-closed `KERNEL_CONTRACT_MISMATCH` (no silent default); handshake order locate→version→range→manifest→artifacts→validator. |
| `us0134asc-architect-002` | `ik_us0134_asc_layer_compose_ok` | Keep **T-anch..T-009 1:1** from architecture seeds. Sprint folder is **S0138**. Architecture owns H1+DEC-0134 + status schema; execute owns `kernel-bridge` bootstrap + fixtures + installer include-list. US-0125 remains parallel OpenCode host. `apps/cli` imports KernelBridge types only — never spawn Python itself. |
| `us0134asc-subtractor-003` | `ik_us0134_asc_scope_yagni_pass` | T-anch ceremony overlap acceptable. Do not extract `its-magic-kernel/`. Do not rewrite validators in TS. Do not wrap all kit scripts. Do not design US-0135+. Do not mark US-0134 DONE. Do not wipe R-0120/R-0121. 10 markers required. |

## Acceptance criteria (6) — US-0134 (status OPEN, unchecked per US-0045)

Primary acceptance (`docs/product/acceptance.md` US-0134 row): Existing kernel bridge and compatibility handshake — authoritative Python validators, artifact memory, version range, and fail-closed bridge (6 ACs).

- **AC-1**: `KernelBridge` locates the project kernel, resolves canonical artifact paths, reports its version/contract manifest, and invokes named validators and reconciliation helpers. — T-001, T-005, T-007, T-009.
- **AC-2**: Runtime-to-kernel compatibility is checked against an explicit supported contract range rather than inferred from filenames. — T-002, T-009.
- **AC-3**: Missing, unsupported, or mismatched kernels fail closed with `KERNEL_NOT_FOUND`, `KERNEL_VERSION_UNSUPPORTED`, `KERNEL_VALIDATOR_MISSING`, or `KERNEL_CONTRACT_MISMATCH`. — T-003.
- **AC-4**: Validator PASS advances the caller and validator FAIL/crash blocks it with captured reason code and evidence; shipped validator semantics are not reimplemented in v1. — T-004, T-005, T-007.
- **AC-5**: Repository backlog, acceptance, decisions, sprints, handoffs, release, traceability, work-pack, and sovereign artifacts remain canonical project memory. — T-006.
- **AC-6**: Contract fixtures verify supported and unsupported kernel versions plus artifact-schema compatibility on Windows and Linux. — T-008.

## Task summaries (10 — T-anch + T-001..T-009)

- **T-anch** (NO-OP / verification): Verify `# US-0134` H1 + DEC-0134 Accepted + A1 + R-0122 DQ1–DQ10 + 10-marker list. Record to `sprints/S0138/t-anch-verification.md`. NO mutation to `architecture.md` / `DEC-0134.md` / R-0122 in /execute.
- **T-001** (AC-1): Create `standalone/packages/kernel-bridge` (`@its-magic/kernel-bridge`, `private: true`, `version: 0.0.0`, `type: module`, `engines.node >=22.19.0`, export `./src/index.ts`). Implement `locateProjectKernel` three-marker parent walk + `kernelRoot` / `--kernel-root` override (override must still pass markers). Cap 16. `locateMode` `kit-dev` \| `consumer`. No Pi imports.
- **T-002** (AC-2): DEC-0045 `getKernelVersion()` + additive `its_magic/kernel-contract.json` (+ template twin) + runtime `supported-kernel-range.json` `{ minInclusive: "0.1.3-9", maxExclusive: "0.2.0", includePrerelease: true }`. Pin exact `semver@7.8.5` + `@types/semver@7.8.0` on `kernel-bridge` only. `includePrerelease: true`. Manifest `kernel_version` must match version file.
- **T-003** (AC-3): Ordered fail-closed handshake: locate → unparseable version → range → manifest/mismatch → required artifacts → validator missing. Exactly four `KERNEL_*` codes. `KernelBridgeError`. Validator FAIL/timeout/crash is `ValidatorResult`, not a fifth code.
- **T-004** (AC-4): Python discovery then spawn the resolved interpreter path (never keep Windows `py -3` as the validator process). `cwd`=kernel root; `windowsHide: true`; `shell: false`; 60s timeout + `AbortSignal`; UTF-8 capture 1 MiB. Timeout/crash → `VALIDATOR_TIMEOUT` / `VALIDATOR_CRASH` evidence.
- **T-005** (AC-1, AC-4): Allowlist `runValidator(name, args)`. Unknown name / missing script / missing interpreter → `KERNEL_VALIDATOR_MISSING`. Manifest `validators[]` intersects allowlist. Exit 0 PASS; non-zero FAIL with first `[A-Z][A-Z0-9_]+` from stderr (raw Python codes, no `OPENCODE_*`).
- **T-006** (AC-5): `resolveArtifactPaths` required ten keys vs optional (`work_packs`, `sovereign`; release/traceability per DEC-0134 §7). No SQLite. No Pi session history. Missing required path → `KERNEL_CONTRACT_MISMATCH`.
- **T-007** (AC-1, AC-4): `runUatPlanner` → `runValidator('uat-planner')` → `scripts/uat_probe_lib.py`. `runStatusReconcile` → `runValidator('status-reconcile')` → new read-only `scripts/status_reconcile_validate.py` (DEC-0134 §8 schema; no curator writes; mutation tests).
- **T-008** (AC-6): Ten `test_us0134_*` markers (DEC-0134 §10) against **temp fixture copies**. Kernel tests: `standalone/tests/contract` (`node:test`). Kit pytest `tests/us0134_contract_test.py` (+ template twin) for files-omit + no-Pi-in-bridge. Handshake + PASS/FAIL hit real Python. Unit tests may mock spawn for timeout mapping only. Existing standalone CI Windows+Linux job covers the suite — do not fold into kit `TEST_COMMAND`.
- **T-009** (AC-1, AC-2): Compose US-0125 (parallel host) + US-0133 (locate-path only; do not amend AgentKernel). Kit `files` omit-guard remains. Installer include-list adds missing allowlist scripts + libs (`bug_issue_validate` + `bug_issue_lib`, `pack_json_validate`, `ledger_validate` + `decision_ledger_lib`, `model_tier_validate` + `model_tier_lib`, `status_reconcile_validate`). Ship `its_magic/kernel-contract.json`. Runbook upgrade recipe: `its-magic --mode upgrade` copies manifest + scripts; old trees without JSON fail-closed mismatch.

Execution order: T-anch → T-001 → T-002 → T-003 → T-004 → T-005 → T-006 → T-007 → T-008 → T-009 (acyclic). No split (`SPRINT_AUTO_SPLIT` not triggered). Not `/quick`.

## AC → Task surjective coverage

| AC | Task(s) |
|---|---|
| AC-1 (locate / invoke / helpers / ship) | T-001, T-005, T-007, T-009 |
| AC-2 (explicit range) | T-002, T-009 |
| AC-3 (four KERNEL_* handshake) | T-003 |
| AC-4 (Python SOT spawn + PASS/FAIL) | T-004, T-005, T-007 |
| AC-5 (canonical artifact map) | T-006 |
| AC-6 (fixtures Win/Linux) | T-008 |
| DC / architecture baseline | T-anch |

**Surjectivity check**: 6/6 ACs covered (each AC ≥1 task) + primary acceptance.md US-0134 row covered by AC-1..AC-6 aggregate. No `PLAN_AC_COVERAGE_GAP`. T-anch retained as verification-only.

## Locked 10-marker table (DEC-0134 §10 / architecture)

1. `test_us0134_locate_three_marker_and_kernel_root`
2. `test_us0134_kernel_not_found_empty_walk`
3. `test_us0134_supported_version_0_1_3_9_in_range`
4. `test_us0134_unsupported_version_0_1_2`
5. `test_us0134_contract_mismatch_bad_manifest_or_missing_backlog`
6. `test_us0134_validator_missing`
7. `test_us0134_validator_pass_advances`
8. `test_us0134_validator_fail_blocks_with_python_reason`
9. `test_us0134_validator_crash_or_timeout`
10. `test_us0134_kit_files_omit_standalone_and_no_pi_in_kernel_bridge`

Fixture classes: `supported`, `unsupported-version`, `contract-mismatch`, `validator-missing`, `validator-crash` / timeout, `not-found`. Primary tests against **temp fixture copies** (not in-tree mutation of this kit’s version file). No paid/model calls.

## Risks (R1–R6 — accepted)

| Risk | Severity | Mitigation |
|---|---|---|
| R1 npm semver prerelease footgun | MEDIUM | T-002 `includePrerelease: true`; T-008 `0.1.3-9` in-range / `0.1.2` unsupported |
| R2 Windows `py -3` launcher vs interpreter kill | MEDIUM | T-004 probe then resolved `python.exe`; T-008 crash/timeout fixture |
| R3 Missing `kernel-contract.json` on already-installed consumers | MEDIUM | T-002 fail-closed mismatch; T-009 installer copy + runbook upgrade |
| R4 Thin status checker mistaken for curator writes | LOW | T-007 read-only schema; mutation tests |
| R5 Locate false-positive on incomplete trees | LOW | T-001 three-marker AND |
| R6 Pi import leak into `kernel-bridge` | LOW | T-001 no Pi deps; T-008 grep; no Biome override for kernel-bridge |

## Compose guards (UNCHANGED)

| Target | Result |
|---|---|
| Kit npm `its-magic` / DEC-0120 `files` | compose — omit `standalone/`; no kernel-bridge in tarball |
| US-0133 / DEC-0133 / R-0121 | compose locate-path only; do not amend AgentKernel / `# US-0133` |
| US-0125 / DEC-0125 | parallel OpenCode host; no `OPENCODE_*` on standalone path |
| DEC-0045 | `.its-magic-version` path unchanged; not the whole contract |
| US-0135..US-0148 | OUT OF SCOPE |
| BUG-0018 / R-0120 | DONE — do not reopen; do not wipe R-0120 |
| DEC-0134 / `# US-0134` / R-0122 | locked — T-anch verify only |
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
| story_id | US-0134 |
| sprint_id | S0138 |
| orchestrator_run_id | auto-20260912-us0134 |
| delivery_mode | ultra_lean |
| macro_phase | plan |
| fresh_context_marker | tl-US0134-sprintplan-20260912T125500Z-fresh |
| timestamp | 2026-09-12T12:55:00Z (UTC) |
| model_id | cursor-grok-4.6 (CROSS_MODEL_REVIEW=1 — required) |
| evidence_ref | sprints/S0138/sprint.md, sprints/S0138/tasks.md, sprints/S0138/progress.md, sprints/S0138/uat.json, sprints/S0138/uat.md, handoffs/tl_to_dev.md (US-0134 prepend), docs/engineering/state.md (sprint-plan checkpoint + traceability), docs/engineering/architecture.md # US-0134 (not mutated), decisions/DEC-0134.md (not mutated), handoffs/resume_brief.md |

Prior phase proof consumed: `rp-auto-20260912-us0134-architecture-techlead-20260912T124500Z-US-0134` / `D7686414BA2C17E2053CD7DA5279B56F6B56F9D814CCD46D021A12A870CE2704` — RUNTIME_PROOF_VALID (MATCH before TTL 2026-09-12T13:45:00Z; consumed 2026-09-12T12:55:00Z). Sovereign-critic architecture PASS (`critic-US0134-architecture-20260912T125000Z-fresh`; anti_slop=10; 0 blocking; NBs routed).

## Runtime proof (DEC-0038)

| Field | Value |
|---|---|
| runtime_proof_id | rp-auto-20260912-us0134-sprint-plan-techlead-20260912T125500Z-US-0134 |
| phase_id | sprint-plan |
| role | tech-lead |
| story_id | US-0134 |
| sprint_id | S0138 |
| orchestrator_run_id | auto-20260912-us0134 |
| delivery_mode | ultra_lean |
| macro_phase | plan |
| model_id | cursor-grok-4.6 (CROSS_MODEL_REVIEW=1 — required) |
| proof_issued_at | 2026-09-12T12:55:00Z |
| proof_ttl_seconds | 3600 |
| proof_ttl | 2026-09-12T13:55:00Z (UTC) |
| proof_hash | FEFE3644C154CB5BFF798CE4E0FAFE0032E7DCC1E60045C5EFECE17ED7A0E1B5 |
| canonical_payload | `{"delivery_mode":"ultra_lean","macro_phase":"plan","model_id":"cursor-grok-4.6","orchestrator_run_id":"auto-20260912-us0134","phase_id":"sprint-plan","proof_issued_at":"2026-09-12T12:55:00Z","proof_ttl_seconds":3600,"role":"tech-lead","runtime_proof_id":"rp-auto-20260912-us0134-sprint-plan-techlead-20260912T125500Z-US-0134","sprint_id":"S0138","story_id":"US-0134"}` |

## Decision gate

| Field | Value |
|---|---|
| decision_gate | false |
| stop_conditions_met | yes |
| missing_acceptance_criteria | none (6/6 slices + primary acceptance row covered; 10 contract-test markers) |
| compose_guards | kit files / US-0133 / US-0125 / US-0135..US-0148 / BUG-0018 / R-0120 / R-0121 / DEC-0134 / US-0045 UNCHANGED |
| dc_check | clean (`# US-0134` H1 already added in /architecture; DEC-0134 Accepted) |
| task_count | 10 (within SPRINT_MAX_TASKS=12; SPRINT_AUTO_SPLIT=1 but no split needed; 1:1 seeds) |
| risks_finalized | 6/6 ACCEPTED (R1..R6) |
| approach | A1 locked |
| companion_DEC | DEC-0134 Accepted |
| plan-verify readiness | ultra_lean — plan-verify NOT in resolved_phase_plan; skipped; plan-verify.json NOT written in this spawn |
| sovereign_memory_note | `assemble_sovereign_memory_digest(...)` NOT called; no mistakes.jsonl write |

## Definition of done (sprint-plan)

- [x] 10 tasks enumerated (T-anch + T-001..T-009) — within SPRINT_MAX_TASKS=12; 1:1 from architecture seeds
- [x] 6/6 ACs surjective + primary acceptance.md US-0134 covered
- [x] Task dependency graph documented
- [x] Execute phase role matrix documented (ultra_lean — /plan-verify skipped; next = /execute)
- [x] Compose guards UNCHANGED
- [x] Critic carry-ins (3 non-blocking from architecture sovereign-critic) routed as execute awareness; sprint id locked **S0138**
- [x] Isolation evidence + runtime proof emitted (model_id=cursor-grok-4.6 present)
- [x] Sprint-plan checkpoint appended to `docs/engineering/state.md`
- [x] Sprint-plan handoff prepended to `handoffs/tl_to_dev.md`
- [x] Sprint-plan PASS prepended to `handoffs/resume_brief.md` (-> /execute)
- [x] UAT placeholders written (`uat.json` empty steps, `uat.md` ACs no results)
- [x] Traceability row added (Story=US-0134 | Sprint=S0138 | Tasks=T-anch+T-001..T-009 | Status=PLANNED | Evidence empty)
- [x] Backlog status OPEN (US-0045 — not mutated); acceptance unchecked; sprint_plan_notes appended

## Next scheduled phase

| Field | Value |
|---|---|
| next_scheduled_phase | `/execute` (role=dev per US-0069 / DEC-0051; fresh dev subagent per BUG-0006; first canonical phase of `build+verify` macro per ultra_lean; plan-verify NOT in resolved_phase_plan — skipped). Orchestrator may run sovereign-critic of sprint-plan first (CROSS_MODEL_REVIEW=1). Do not mandate outer driver. |
| next_scheduled_role | dev |
| next_sprint_macro | build+verify (ultra_lean — plan-verify skipped at this boundary) |
| stop_condition | STOP after sprint-plan completes; hand off via artifacts only. Orchestrator owns critic of sprint-plan (if CROSS_MODEL_REVIEW=1) then `/execute` in fresh dev subagent per BUG-0006. Do not spawn /execute or /plan-verify from this subagent. |
| artifacts_written | sprints/S0138/ (sprint.md, tasks.md, progress.md, uat.json, uat.md), docs/engineering/state.md (sprint-plan checkpoint + traceability), handoffs/tl_to_dev.md (US-0134 prepend), handoffs/resume_brief.md (sprint-plan PASS prepend -> /execute), docs/product/backlog.md (sprint_plan_notes append; Status OPEN) |
