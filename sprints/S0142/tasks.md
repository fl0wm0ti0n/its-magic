# Sprint S0142 - Task checklist (US-0136)

Total tasks: 11 (T-anch + T-001..T-010). SPRINT_MAX_TASKS=12; SPRINT_AUTO_SPLIT=1; no split. T-anch retained as NO-OP verification. Seeds 1:1 from `docs/engineering/architecture.md` `# US-0136`. Sprint id **S0142** (next free after S0141).

**Isolation**: `tl-US0136-sprintplan-20260913T075500Z-fresh` · `model_id=cursor-grok-4.6-high` · `orchestrator_run_id=auto-20260913-us0136`

## Task execution order

1. T-anch (NO-OP / verification)
2. T-001 (`role-runtime` package + Pi import-boundary grep)
3. T-002 (RoleCatalog + DEC-0051 / `AUTO_ROLE_*` + extra catalog rows)
4. T-003 (SessionSupervisor fresh `createSession`; inMemory; no Pi resume APIs)
5. T-004 (ContinuationContract same-phase `run`/`steer` only) — parallel with T-005 after T-003
6. T-005 (sidecar spawn/start/end + `attestation_hash` + `standalone_attestation`) — parallel with T-004 after T-003
7. T-006 (fail-closed `SESSION_*`/`ATTESTATION_*` + reused kit codes)
8. T-007 (TS orchestrator spawn-time tool deny; no Pi import)
9. T-008 (critic/review fresh sessions + `parent_phase_session_id`)
10. T-009 (crash orphan discard + dispose)
11. T-010 (10 `test_us0136_*` Win/Linux fake-model CI)
12. Integration verification

## Critic NB awareness (execute)

- **T-003/T-004/T-006/T-009** (`us0136arc-challenger-001` NB1): DQ2 continuation allow-list; Pi `continueRecent`/`fork` default-deny; crash orphan discard; `SESSION_*`/`ATTESTATION_*` fail-closed inventory; stub `context_pack_hash`/`policy_hash` until US-0139/US-0137.
- **T-anch..T-010** (`us0136arc-architect-002` NB2): keep 1:1 architecture seeds; sprint folder is **S0142**; execute owns `role-runtime` + SessionSupervisor + RoleCatalog + sidecar + 10 tests; architecture owns H1+DEC-0136; `role-runtime` vs `pi-kernel` boundary; sidecar `attestation_hash` ≠ DEC-0038; DEC-0133/0134/0135 compose held; TS orchestrator scheduling-only.
- **T-anch** (`us0136arc-subtractor-003` NB3): verification-only; do not rewrite `# US-0136` / DEC-0136 / R-0128; reject A2–A9; do not amend isolation/`noTools`/KernelBridge/auth-models; do not mark DONE; do not reopen US-0135 or BUG-0020; do not design US-0137+; 10 markers required.

## Task checklist

- [x] **T-anch**: Verify `# US-0136` H1 in `docs/engineering/architecture.md`; DEC-0136 Accepted; approach A1 LOCKED; R-0128 DQ1–DQ10 LOCKED; 10-marker table locked; compose guards (US-0133 isolation/`noTools` unamended; KernelBridge unamended; auth-models unamended; kit `files` omit `standalone/`; US-0137+ out; US-0135/BUG-0020 DONE; R-0120..R-0127 intact); verify `standalone/packages/role-runtime` and `test_us0136_*` do NOT yet exist (or document baseline). Record to `sprints/S0142/t-anch-verification.md`. NO mutation to `architecture.md` / `decisions/DEC-0136.md` / `docs/engineering/research.md` R-0128 in /execute. (DC / architecture baseline; NO-OP)

- [x] **T-001**: Create `standalone/packages/role-runtime`. `package.json`: name `@its-magic/role-runtime`, `private: true`, `version: 0.0.0`, `type: module`, `engines.node >=22.19.0`, export `./src/index.ts`. Workspaces glob `packages/*` already includes it — do **not** add `standalone/` to kit `workspaces`. Owned types: RoleCatalog / SessionSupervisor / sidecar attestation (DEC-0136 §2–§5). **No Pi imports.** `package.json` must not depend on `@earendil-works/pi-*`. Type-only import from `@its-magic/pi-kernel` is allowed (injected `AgentKernel`). Do **not** import Pi modules. Existing Biome `noRestrictedImports` already denies Pi outside `pi-kernel`; extend the US-0133/US-0134/US-0135 grep to also deny Pi inside `role-runtime`. Do **not** add a Biome override for `role-runtime`. Kit `files` continues to omit `standalone/`. Do **not** stub `runtime-core` this story (US-0140). Tests: marker 10 (no-Pi portion). (AC-1)

- [x] **T-002**: Implement typed RoleCatalog inside `role-runtime` (not US-0138 `RuntimeConfig`; not Cursor catalog SOT). `schema_version: 1`. `phases[phase_id]` = `{ canonical_role, allowed_roles[], auto_role_key? }`. Port **DEC-0051** matrix (intake/discovery=`po`; research=`tech-lead` + `AUTO_ROLE_RESEARCH`; architecture/sprint-plan=`tech-lead`; plan-verify=`qa` + `AUTO_ROLE_PLAN_VERIFY`; execute=`dev`; qa/verify-work=`qa`; release=`release`; closure=`qe` + `AUTO_ROLE_CLOSURE`; refresh-context=`curator` + `AUTO_ROLE_REFRESH_CONTEXT`). Extra catalog rows: `sovereign-critic`→`tech-lead`; `security-review`→`security`; `map-codebase`/`ask`→`scout` (`dev` allowed, mutability `none`). Isolation/proof role for critic remains `tech-lead`. `roles[role_id]` mutability: orchestrator/critic/scout=`none`; po/tech-lead/qa/release/qe/curator/security=`owned-artifacts`; dev=`implementation`. Bounded sovereign injection keys: `objective_function`, `review_focus` only. Unknown `phase_id` → `SESSION_UNKNOWN_PHASE`. Unset `AUTO_ROLE_*` → canonical default. Invalid `AUTO_ROLE_*` (not in `allowed_roles`) → `SESSION_UNKNOWN_ROLE` (no unrelated fallback). Wrong role vs catalog → reuse `PHASE_ROLE_MISMATCH`. Missing capability → reuse `PHASE_ROLE_CAPABILITY_MISSING`. Tests: marker 7. (AC-2)

- [x] **T-003**: Implement `SessionSupervisor` constructed with an injected `AgentKernel`. Surface: `spawn(req)`, `end(kernel_session_id)`, `discardOrphans()` (DEC-0136 §3). Production + CI keep the kernel's existing `SessionManager.inMemory(cwd)` (DEC-0133 `agentDir` isolation held — not `~/.pi/agent`, not the target project). Do **not** switch the production factory to `SessionManager.create` / `continueRecent` / `open` / `forkFrom`. Do **not** add `continueRecent` / `fork` / `newSession({ parentSession })` to `AgentKernel`. Supervisor never passes `entries` / `parentSession` / `fork`. Fresh `createSession` per producer phase, review/critic phase, and every execute#N / QA#N rework (`iteration_key` change counts as a new spawn). `SupervisedSession.fresh=true` iff new `createSession` and no continuation contract. Do **not** amend AgentKernel isolation loader, `noTools: "builtin"`, pins, KernelBridge, or auth-models. Tests: markers 1, 2, 8. (AC-1)

- [x] **T-004**: Process-local `ContinuationContract` (`schema_version: 1`, `phase_id`, `role_id`, `kernel_session_id`, `allowed_ops: ["run","steer"]`). Same `KernelSession` / same `sessionId` allow-list: process-local, same-phase `run` / `steer` only (owned `KernelSession`; Pi `followUp` queue is not exposed — map in-session follow-up to `steer`). ContinuationContract is **in-memory only** (never written to backlog/acceptance/decisions). Process restart ⇒ no contract ⇒ `SESSION_CONTINUATION_DENIED`. Default-deny across phase boundaries: Pi `SessionManager.continueRecent` / `forkFrom` / `open` / `inMemory(..., entries)` / `AgentSessionRuntime.fork` / `newSession({ parentSession })`. Missing/expired/mismatched contract, `allowed_ops` including fork/resume, or `phase_id` / `iteration_key` change → `SESSION_CONTINUATION_DENIED`. Tests: markers 2, 6, 8. (AC-1)

- [x] **T-005**: Runtime (not the model) emits three sidecar records per session: **spawn**, **start**, **end**. Bound fields per DEC-0136 §5: `orchestrator_run_id`, `phase_id`/`role_id`, `kernel="pi"`, `kernel_session_id`=`session.sessionId`, `kernel_process_instance`=`${bootUuid}:${pid}` (supervisor boot `crypto.randomUUID()` + `process.pid`), `model_id` (DEC-0135 provenance slug), stub `context_pack_hash` / `policy_hash`, timestamps, `parent_phase_session_id`, `fresh`, `attestation_event`, `attestation_hash` = SHA-256 of canonical sorted-key JSON **without** that field. **Do not extend** `compute_strict_proof_hash` / DEC-0038 tuple. v1 store: in-memory session registry is live SOT; optional gitignored JSONL under standalone OS config run dir (`its-magic/runs/<orchestrator_run_id>/session-attestations.jsonl`) or temp run dir — **never** the project tree. No SQLite. Isolation evidence required fields stay byte-compatible; standalone facts under additive `standalone_attestation`. Python validators ignore unknown keys. Tests: marker 9. (AC-3, AC-4)

- [x] **T-006**: Fail-closed reason-code inventory (DEC-0136 §7). **Reuse** (do not fork semantics): `PHASE_ROLE_MISMATCH`, `PHASE_ROLE_CAPABILITY_MISSING`, `RUNTIME_PROOF_MISSING`, `RUNTIME_PROOF_STALE`, `RUNTIME_PROOF_INVALID`, `PHASE_CONTEXT_ISOLATION_VIOLATION`, `AUTO_ORCHESTRATOR_PHASE_EXECUTION`. **New** (frozen strings): `SESSION_REUSED_ACROSS_PHASE`, `SESSION_CONTINUATION_DENIED`, `SESSION_TRANSCRIPT_CARRYOVER`, `SESSION_UNKNOWN_PHASE`, `SESSION_UNKNOWN_ROLE`, `SESSION_ORCHESTRATOR_TOOLS_DENIED`, `ATTESTATION_MISSING`, `ATTESTATION_HASH_MISMATCH`, `ATTESTATION_KERNEL_SESSION_MISMATCH`. Transcript detector does **not** parse Pi jsonl in workflow code. Enforcement is spawn-path: only `createSession` with empty in-memory manager. Tests inject tainted restore and expect `SESSION_TRANSCRIPT_CARRYOVER`. Missing sidecar when standalone supervisor ran → `ATTESTATION_MISSING`. Hash mismatch → `ATTESTATION_HASH_MISMATCH`. Sidecar `kernel_session_id` ≠ live session → `ATTESTATION_KERNEL_SESSION_MISMATCH`. Stale kit proof → reuse `RUNTIME_PROOF_STALE`. Tests: markers 6, 7, 8, 9. (AC-5)

- [x] **T-007**: TypeScript orchestrator scheduling-only spawn gate inside `role-runtime` (`assertOrchestratorSchedulingOnly`). No orchestrator Pi session in v1. US-0140 owns the lifecycle loop that consumes SessionSupervisor. Do **not** create `runtime-core` this story. If `role_id === "orchestrator"` and tools contain write/bash/edit/`itsm_*` mutation names → `SESSION_ORCHESTRATOR_TOOLS_DENIED`. Actual phase writes by the scheduler → `AUTO_ORCHESTRATOR_PHASE_EXECUTION`. Contract tests assert orchestrator spawn tool allowlist empty. Scheduler/gate module must not import Pi. Do **not** add mutation/`itsm_*` tools. Tests: marker 10. (AC-6)

- [x] **T-008**: SessionSupervisor spawns a **fresh** session for sovereign-critic and role-behavior reviews. Review never substitutes the producer role. Attestation `parent_phase_session_id` = producer `kernel_session_id`; `fresh: true`; distinct `kernel_session_id`. Isolation/proof `role` for sovereign-critic remains `tech-lead`. `model_id` from DEC-0135 critic overlay / pin; same slug → `CROSS_MODEL_DEGRADED_MODE` (compose US-0104 v2). This story does **not** author critic lens content (US-0144). Dispose producer only after end attestation; critic must not `steer` the producer session. Tests: marker 3. (AC-1, AC-7)

- [x] **T-009**: Crash / dispose (session facts only; US-0140 reconstructs next phase): (1) Track live handles (`kernel_session_id` → KernelSession). (2) On restart / crash fixture: any handle without an `end` attestation is an **orphan** → `abort` + `dispose` + drop registry row; do not `continueRecent` / restore `entries`. (3) `end` attestation present **and** kit proof valid ⇒ complete; missing end / process death ⇒ crashed (not complete). Supervisor does not flip backlog Status. (4) Next spawn is always `createSession` (fresh). (5) `dispose()` must be called in tests; after dispose, `sessionId` must not be reused for a later phase. Tests: markers 4, 5. (AC-7)

- [x] **T-010**: Create contract tests covering **exactly 10** markers (DEC-0136 §10). Primary: `standalone/tests/contract` (`node:test`) Windows + Linux. Kit twin as needed for files-omit / no-Pi-in-role-runtime. No paid/model calls. Fake-model CI default **held**.
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
  Marker 8 injects tainted restore (`entries` / parentSession) and expects `SESSION_TRANSCRIPT_CARRYOVER`. Marker 9 covers missing sidecar / hash mismatch / stale kit proof. Marker 10 asserts orchestrator mutation deny + no Pi imports in `role-runtime` + empty loader + fake-model CI default still hold. Existing standalone CI Windows+Linux job covers the suite — do not fold into kit `TEST_COMMAND`. Do **not** weaken `test_us0133_*` / `test_us0134_*` / `test_us0135_*`. (AC-7; coverage for AC-1..AC-6 via markers)

## Integration verification (post T-010)

- [x] Test gate: standalone `npm test` covers 10/10 `test_us0136_*`; kit twin (if present) PASS; compose `test_us0133_*` / `test_us0134_*` / `test_us0135_*` still green
- [x] Import-boundary gate: no Pi imports in `role-runtime`; kit `files` omit `standalone/`
- [x] Isolation gate: AgentKernel empty loader / `noTools: "builtin"` / KernelBridge / auth-models unamended; fake-model CI default held; DEC-0038 tuple unamended
- [x] Scope gate: no `continueRecent`/`fork` on AgentKernel; no SQLite; no `runtime-core`; no live paid CI; no US-0137+ authoring
- [x] Status gate: US-0136 remains OPEN; AC-1..AC-7 unchecked; intake JSON not mutated; US-0133/US-0134/US-0135/BUG-0020 remain DONE

## Files to touch (scope)

### New (create)

- `standalone/packages/role-runtime/` (`package.json`, `src/index.ts`, RoleCatalog / SessionSupervisor / sidecar / orchestrator gate)
- `standalone/tests/contract` `test_us0136_*` (node:test)
- kit twin `tests/us0136_*` as needed (files-omit / no-Pi-in-role-runtime)
- `sprints/S0142/t-anch-verification.md` (execute)

### Edit (scoped)

- existing US-0133/US-0134/US-0135 Pi-import grep — extend to deny Pi inside `role-runtime`
- `.github/workflows/ci.yml` — extend existing standalone Windows+Linux job only if glob would miss new tests; do not fold into kit `TEST_COMMAND`
- optional: gitignore confirm for OS-config JSONL (never commit session-attestations)

### Verify read-only (no mutation)

- `docs/engineering/architecture.md # US-0136`
- `decisions/DEC-0136.md`
- `docs/engineering/research.md ## R-0128` (and R-0120..R-0127 intact)
- `docs/product/backlog.md ## US-0136` Status/ACs (US-0045)
- `docs/product/acceptance.md` US-0136 row
- `handoffs/intake_evidence/US-0133-0148-intake-20260911.json`
- `standalone/packages/pi-kernel` AgentKernel isolation loader / `noTools` / pins (DEC-0133)
- `standalone/packages/kernel-bridge` (DEC-0134 — unamended)
- `standalone/packages/auth-models` (DEC-0135 — unamended)
- US-0135 / S0141 artifacts (DONE — do not reopen)
- BUG-0020 / S0140 artifacts (DONE — do not reopen)

### Compose-guard UNCHANGED (DO NOT TOUCH)

| File / surface | Reason |
|---|---|
| Backlog Status / AC checkboxes | US-0045 — closure only |
| `architecture.md` body beyond T-anch verify | locked in /architecture |
| `decisions/DEC-0136.md` body | locked in /architecture |
| R-0128 / R-0127 / R-0121 / R-0122 / R-0120..R-0126 | do not rewrite; do not wipe |
| `# US-0133` / DEC-0133 / AgentKernel isolation / `noTools` | compose `createSession` inject only |
| `# US-0134` / DEC-0134 / KernelBridge | unamended |
| `# US-0135` / DEC-0135 / auth-models | unamended (`model_id` provenance only) |
| Kit `package.json` `workspaces` | kit is not a workspace root |
| Kit `files` whitelist expansion | omit `standalone/` |
| DEC-0038 `compute_strict_proof_hash` tuple | UNAMENDED — sidecar hash is separate |
| Project tree session-attestations | never; OS-config / temp only |
| SQLite operational store | deferred §27.2 |
| `runtime-core` stub | US-0140 |
| Live paid CI | rejected A9 |
| US-0137..US-0148 bodies | OUT OF SCOPE |
| US-0135 / BUG-0020 | DONE — do not reopen |
| US-0138 `RuntimeConfig` | catalog is not RuntimeConfig this story |
| US-0144 critic lens content | spawn mechanism only this story |

## AC → Task surjective coverage

| AC | Task(s) |
|---|---|
| AC-1 | T-001, T-003, T-004, T-008 (T-010 m1–m4, m6, m8) |
| AC-2 | T-002 (T-010 m7) |
| AC-3 | T-005 (T-010 m9) |
| AC-4 | T-005 |
| AC-5 | T-006, T-007 (T-010 m6–m10) |
| AC-6 | T-007 (T-010 m10) |
| AC-7 | T-008, T-009, T-010 (m1–m5) |
| DC / architecture | T-anch |

**Surjectivity check**: 7/7 ACs covered. No `PLAN_AC_COVERAGE_GAP`.
