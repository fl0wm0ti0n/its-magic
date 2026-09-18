# Sprint S0152 - Task checklist (US-0144)

Total tasks: 11 (T-anch + T-001..T-010). SPRINT_MAX_TASKS=12; SPRINT_AUTO_SPLIT=1; no split. T-anch retained as NO-OP verification. Seeds 1:1 from `docs/engineering/architecture.md` `# US-0144`. Sprint id **S0152** locked (existed PLANNED; attested this phase). Do not overwrite S0146–S0151. Do not invent a new sprint id.

**Isolation**: `tl-US0144-sprintplan-20260915T190058Z-fresh` · `model_id=cursor-grok-4.6-high` · `orchestrator_run_id=auto-20260913-us0144`

## Task execution order

1. T-anch (NO-OP / verification)
2. T-001 (typed KernelBridge 9-op admission)
3. T-002 (Python sovereign_runtime_bridge.py dispatcher)
4. T-003 (pre-spawn bootstrap + supervisor ack)
5. T-004 (bounded memory + critic-model / degraded)
6. T-005 (supplementary role reviews)
7. T-006 (ledger sidecar + plan fidelity)
8. T-007 (drain candidate gate + deferral_append/list)
9. T-008 (convergence + caps + partial delivery)
10. T-009 (SOVEREIGN_RUNTIME=0 default-off + exports)
11. T-010 (12 `test_us0144_*` + four flag quadrants)
12. Integration verification

## Critic NB awareness (execute)

- **T-010** (`us0144arc-challenger-001` NB1 — **closed this sprint-plan**): assert Q00/Q10/Q01/Q11 on the primary markers in the Flag-quadrant table. Nine-op set; default-off; `gateDrainCandidate` exclusive for sovereign-generated candidates; never read `.env`.
- **T-anch..T-010** (`us0144arc-architect-002` NB2): keep 1:1 architecture seeds; sprint folder is S0152; execute owns bridge dispatcher + runtime-core lift + 12 tests; architecture owns H1+DEC-0144; do not rewrite GateEngine/`RELEASE_GATE_ORDER` or US-0143 drain.
- **T-anch** (`us0144arc-subtractor-003` NB3): verification-only; do not rewrite `# US-0144` / DEC-0144 / R-0142; do not add a 13th test; do not add sibling package; do not restore `auto.md`; do not mark DONE; do not reopen US-0143; do not design US-0145+; 12 markers required.

## Task checklist

- [x] **T-anch**: Verify `# US-0144` H1 in `docs/engineering/architecture.md`; DEC-0144 Accepted; R-0142 DQ1–DQ10 LOCKED; 9-op closed set including `deferral_append`/`deferral_list`; 12-marker table locked to architecture IDs; flag-quadrant table present; compose guards (US-0143 drain/GateEngine unamended at `SOVEREIGN_RUNTIME=0`; Python schemas unmodified; KernelBridge additive `runSovereignOperation` only; kit `files` omit `standalone/`; US-0145+ out; US-0133..US-0143 DONE; BUG-* not mutated; S0146..S0151 not reused; R-0141 remains US-0143). Verify `scripts/sovereign_runtime_bridge.py` and `test_us0144_*` do NOT yet exist (or document baseline). Record to `sprints/S0152/t-anch-verification.md`. NO mutation to `architecture.md` / `decisions/DEC-0144.md` / `docs/engineering/research.md` R-0142 in /execute. (DC / architecture baseline; NO-OP)

- [x] **T-001**: Add typed `KernelBridge.runSovereignOperation()` admitted only when `kernel-contract.json` `sovereign_operations` lists the closed nine: `memory_digest`, `critic_model`, `role_review_plan`, `decision_session_append`, `deferral_append`, `deferral_list`, `drain_candidate_gate`, `convergence_evaluate`, `partial_delivery_write`. Callers/manifests cannot select executable, arguments, environment, or schema. Handshake + resolved `sovereign` artifact path required. Unknown operation → `KERNEL_SOVEREIGN_OPERATION_MISSING`. Tests: markers 1, 2 (owned by T-010). (AC-1)

- [x] **T-002**: Create `scripts/sovereign_runtime_bridge.py` invoked as `python scripts/sovereign_runtime_bridge.py --operation <allowlisted-name> --request-json <compact-json>`. Request envelope `{schema_version:1,request_id,operation,orchestrator_run_id,payload}`; response `{schema_version:1,request_id,operation,ok,result}` or `{ok:false,reason_code}`. Caps: 16 KiB request / 64 KiB response; 5 s ops (15 s convergence). Malformed JSON, timeout, subprocess failure → `KERNEL_SOVEREIGN_*`. Existing Python sovereign library schemas unmodified (compose only). One in-flight `runSovereignOperation` per `orchestrator_run_id`; overlapping writers fail-closed `KERNEL_SOVEREIGN_FAILED`. Tests: markers 1, 2. (AC-1)

- [x] **T-003**: `CommandRouter.assemblePreSpawnContext()` builds immutable bootstrap **phase context → bounded memory digest → role objective** before `SessionSupervisor.spawn`. `SpawnRequest.bootstrap` carries `{text,context_hash,digest_entry_ids,digest_char_count,role_objective_applied}`. Supervisor attests hash and confirms **one** delivery before producer work. Missing/mismatched ack → `SOVEREIGN_BOOTSTRAP_DELIVERY_FAILED`. No bootstrap on continued sessions. Supplementary sessions receive no producer bootstrap. Q01: SR=1 may assemble bootstrap; CMR=0 means no sovereign producer content after the US-0143 hook. Tests: marker 3. (AC-2)

- [x] **T-004**: `memory_digest` returns `block`, `entry_ids`, `char_count` via `build_injection_digest_block` (never the full store). Disabled memory is zero-I/O. Digest failure with memory enabled blocks spawn. `critic_model` returns `critic_model_id` and `degraded` via `select_critic_model`; same-model is explicit degraded (do not claim cross-model independence). Q00 asserted on marker 4. Q11 asserted on marker 5. Tests: markers 4, 5. (AC-2, AC-4)

- [x] **T-005**: `SovereignRuntime.afterProducerBoundary()` extends `scheduleSupplementaryHooks` without changing scheduling semantics. Fresh Challenger/Architect/Subtractor + `dispatch_role_review` / `list_obligations_for_phase` are supplementary only — never producer replacements. Discriminated `SovereignRuntimeResult` on `HookResult` / `AutoRunResult`. Tests: marker 6. (AC-3)

- [x] **T-006**: Preserve exact 12-field decision ledger (`plan_fidelity` included). Sidecar `handoffs/sovereign_decision_sessions/<run>.jsonl` with deterministic `event_id` (SHA-256 of version+run+decision+session). Canonical ledger append precedes sidecar; missing ledger → `SOVEREIGN_LEDGER_DECISION_NOT_FOUND`; duplicate IDs idempotent; torn tail / fsync fail-closed without repair (`SOVEREIGN_LEDGER_SIDECAR_PARTIAL_WRITE` / `SOVEREIGN_LEDGER_SIDECAR_APPEND_FAILED`). QA reads ledger `plan_fidelity` plus sidecar. Tests: markers 7, 8. (AC-1)

- [x] **T-007**: `advance_sovereign_loop()` may return candidates but never materializes. `SovereignRuntime.gateDrainCandidate()` is the sole materialization path for **US-0144 sovereign-generated** candidates. Explicit `SOVEREIGN_DRAIN_AUTO_ACCEPT=0` beats preset expansion; each candidate records `accept|reject|defer|pending`; absent accept → `SOVEREIGN_DRAIN_OPERATOR_DECISION_REQUIRED` before any story/intake/deferral mutation. `deferral_append` → `{deferral_id}`; `deferral_list` → `{count,deferral_ids}` (ids only). Legacy US-0143 drain unamended when SR=0. Tests: markers 9, 10. (AC-5)

- [x] **T-008**: `convergence_evaluate` consumes `evaluate_convergence` (five-conjunct). Only open **blocking** critic findings block convergence; eligible non-blocking same-run findings may resolve. Smoke surrogates never assert browser success. Return progress, caps, non-convergence reasons, and optional `partial_delivery_ref` through `afterProducerBoundary`. Tests: markers 11, 12. (AC-6, AC-7)

- [x] **T-009**: `SOVEREIGN_RUNTIME=0|1` default `0`. At `0`: no sovereign bridge operation, sidecar file, memory read, critic/model resolution, role-review dispatch, deferral gate, convergence evaluation, or partial-delivery write; existing US-0143 behavior is byte-compatible. Export nested `SovereignRuntime` from runtime-core (no sibling package, no Pi). Tests: markers 4, 12 and flag quadrants. (AC-8)

- [x] **T-010**: Create contract tests covering exactly 12 architecture-owned markers (DEC-0144 / `# US-0144` Test contract). Primary: `standalone/tests/contract` (`node:test`) Windows + Linux. Fake-model CI. Count stays 12. Bind the four flag quadrants (table below). Do not weaken `test_us0143_*` .. `test_us0133_*`. (AC-1..AC-8)

## Locked 12-marker table

| # | Marker (architecture-owned) | AC | Notes |
|---|---|---|---|
| 1 | `test_us0144_kernel_bridge_admission` | AC-1 | Manifest admission; reject unknown op |
| 2 | `test_us0144_bridge_json_timeout_fail_closed` | AC-1 | Malformed JSON, cap, timeout, subprocess |
| 3 | `test_us0144_pre_spawn_context_order` | AC-2 | Order + one-delivery ack; **Q01 primary** |
| 4 | `test_us0144_memory_bounds_default_off` | AC-2, AC-8 | Bounded digest + zero-I/O; **Q00 primary** |
| 5 | `test_us0144_model_collision_degraded` | AC-4 | Pin + degraded; **Q11 primary** |
| 6 | `test_us0144_supplementary_manifest_reviews` | AC-3 | Reviews never replace producers |
| 7 | `test_us0144_ledger_schema_preserved` | AC-1 | 12-field ledger + sidecar pairing |
| 8 | `test_us0144_sidecar_idempotent_torn_write` | AC-1 | Idempotency; torn-write fail-closed |
| 9 | `test_us0144_drain_gate_preset_zero` | AC-5 | Explicit zero beats full preset |
| 10 | `test_us0144_per_candidate_operator_decision` | AC-5 | Every generated candidate needs a decision |
| 11 | `test_us0144_blocking_only_convergence_smoke_truth` | AC-6, AC-7 | Blocking-only; smoke never browser PASS |
| 12 | `test_us0144_caps_progress_partial_delivery_boundaries` | AC-7, AC-8 | Caps/progress/partial; US-0143/GateEngine; **Q10 primary** |

Prior stub aliases (retired — do not ship): `test_us0144_kernel_sovereign_manifest_admission`, `test_us0144_kernel_sovereign_json_timeout_failclosed`, `test_us0144_pre_spawn_context_digest_role_order`, `test_us0144_memory_digest_bounds_and_disabled_zero_io`, `test_us0144_fresh_critic_model_collision_degraded`, `test_us0144_role_manifest_reviews_are_supplementary`, `test_us0144_decision_session_sidecar_preserves_12_field_ledger`, `test_us0144_sidecar_idempotency_and_partial_write_failclosed`, `test_us0144_drain_candidate_gate_explicit_zero_beats_full_preset`, `test_us0144_drain_candidate_requires_per_item_operator_decision`, `test_us0144_convergence_blocking_findings_and_smoke_truthfulness`, `test_us0144_caps_progress_partial_delivery_and_us0143_gateengine_boundaries`.

## Flag-quadrant binding (us0144arc-challenger-001 closed)

| Quadrant | CROSS_MODEL_REVIEW | SOVEREIGN_RUNTIME | Primary marker | Assertion |
|---|---|---|---|---|
| Q00 | 0 | 0 | `test_us0144_memory_bounds_default_off` | No critic session; no bridge; no memory I/O; no sidecar/partial-delivery write |
| Q10 | 1 | 0 | `test_us0144_caps_progress_partial_delivery_boundaries` | US-0143 scheduling-only critic retained; no sovereign bridge/write; GateEngine + legacy drain unamended |
| Q01 | 0 | 1 | `test_us0144_pre_spawn_context_order` | Bootstrap/digest may run; hook not scheduled; no sovereign producer content after the existing hook |
| Q11 | 1 | 1 | `test_us0144_model_collision_degraded` | Full sovereign content after the existing hook (critic pin + degraded); remaining content tests assume this quadrant unless probing envelopes |

Not a thirteenth test. R-0142: only Q11 enables sovereign content after the existing hook.

## Integration verification (post T-010)

- [x] Test gate: standalone npm test covers 12/12 `test_us0144_*` plus compose us0133..us0143 still green
- [x] Import-boundary gate: no Pi imports in `packages/runtime-core`; kit `files` omit `standalone/`; no sibling sovereign package
- [x] Isolation gate: AgentKernel empty loader / `noTools` builtin / KernelBridge validator allowlist / auth-models store / PolicyEngine tables / RoleCatalog internals / config loaders unamended except additive `runSovereignOperation`; fake-model CI held; DEC-0038 tuple unamended; GateEngine `RELEASE_GATE_ORDER` unamended
- [x] Scope gate: no credentials / `.env` reads; no `auto.md` restore; no US-0145+; no GateEngine rewrite; no US-0143 drain rewrite
- [x] Status gate: US-0144 remains OPEN; AC-1..AC-8 unchecked; intake JSON not mutated; US-0133..US-0143 remain DONE; BUG-* not mutated; S0146..S0151 not mutated
- [x] Flag-quadrant gate: Q00/Q10/Q01/Q11 each asserted on the primary marker above

## Files to touch (scope)

### New (create)

- `scripts/sovereign_runtime_bridge.py`
- nested `SovereignRuntime` in `@its-magic/runtime-core` (path execute chooses; architecture: runtime-core composition)
- `standalone/tests/contract` `test_us0144_*` (`node:test`)
- `handoffs/sovereign_decision_sessions/` JSONL (execute; per-run)
- `sprints/S0152/t-anch-verification.md` (execute)

### Edit (scoped)

- `standalone/packages/kernel-bridge` — additive `runSovereignOperation()`
- `its_magic/kernel-contract.json` — additive `sovereign_operations`
- `standalone/packages/runtime-core` — nested SovereignRuntime; pre-spawn bootstrap; `afterProducerBoundary`; `gateDrainCandidate`; config default-off
- `standalone/packages/role-runtime` — only if spawn/bootstrap attestation requires it (keep minimal)
- `.github/workflows/ci.yml` — extend existing standalone Windows+Linux job only if glob would miss new tests

### Compose-guard UNCHANGED (DO NOT TOUCH)

| File / surface | Reason |
|---|---|
| Backlog Status / AC checkboxes | US-0045 — closure only |
| `architecture.md` / `DEC-0144.md` / R-0142 | locked in /architecture |
| Python sovereign library schemas | compose only |
| PolicyEngine decision tables | unamended |
| KernelBridge validator allowlist / isolation / `noTools` | unamended (additive sovereign op only) |
| RoleCatalog internals | inject spawn only |
| DEC-0038 tuple | UNAMENDED |
| GateEngine `RELEASE_GATE_ORDER` | US-0140 DONE — unamended |
| US-0143 CommandRouter drain / `runAuto`/`runQuick` | unamended at SR=0; scheduling-only critic retained |
| US-0145+ | OUT |
| US-0133..US-0143 DONE | do not reopen |
| S0146..S0151 | do not mutate |
| BUG-* | not mutated / not drained |
| `.env` / credentials | never read |
| `.opencode/commands/auto.md` restore | forbidden |

## AC → Task surjective coverage

| AC | Task(s) |
|---|---|
| AC-1 | T-001, T-002, T-006 (T-010 m1, m2, m7, m8) |
| AC-2 | T-003, T-004 (T-010 m3, m4) |
| AC-3 | T-005 (T-010 m6) |
| AC-4 | T-004 (T-010 m5) |
| AC-5 | T-007 (T-010 m9, m10) |
| AC-6 | T-008 (T-010 m11) |
| AC-7 | T-008 (T-010 m12) |
| AC-8 | T-009, T-010 (m1–m12 + Q00/Q10/Q01/Q11) |
| DC / architecture | T-anch |

**Surjectivity check**: 8/8 ACs covered. T-010 markers attest AC-1..AC-8. Four flag quadrants bound. No `PLAN_AC_COVERAGE_GAP`.
