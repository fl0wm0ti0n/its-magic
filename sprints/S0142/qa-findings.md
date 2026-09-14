# QA findings — US-0136 / S0142 / auto-20260913-us0136 (qa)

- **phase_id**: qa, **role**: qa, **story_id**: US-0136 (OPEN — not marked DONE per US-0045), **sprint_id**: S0142
- `orchestrator_run_id=auto-20260913-us0136`, `parent_run=auto-20260913-us0135`, `delivery_mode=ultra_lean`, `macro_phase=build+verify`
- `AUTO_IMPLEMENTATION_LOOP=1` (no blocking findings — do not return to `/execute`)
- `AUTO_QUIET=1`
- `FRAMEWORK_KIT_REPO=1`
- `SECURITY_REVIEW=0`
- `model_id=cursor-grok-4.6-high` (CROSS_MODEL_REVIEW=1 — required on isolation)
- `producer_phase_id=execute`, `producer_role=dev`, `producer_model_id=cursor-grok-4.6-high`
- `critic_phase_id=sovereign-critic` (execute review), `critic_model_id=composer-2.5-fast`, `critic_verdict=PASS`, `anti_slop_aggregate=10`, `open_blocking_findings=0`
- `critic_fresh_context_marker=critic-US0136-execute-20260913T082500Z-fresh`
- `critic_finding_ids=us0136ex-challenger-001, us0136ex-architect-002, us0136ex-subtractor-003` (informational NBs; not AC failures)
- `cross_reviewer_findings.open_blocking_count=0` (`handoffs/sovereign_critic_findings.jsonl`)

- `fresh_context_marker=qa-US0136-qa-20260913T083500Z-fresh` (NEW per US-0048 / BUG-0006; not reused from execute `dev-US0136-execute-20260913T081500Z-fresh` or critic `critic-US0136-execute-20260913T082500Z-fresh`)
- `timestamp (UTC)=2026-09-13T08:35:00Z` (orchestrator-specified)
- **verdict: QA_PASS**
- `plan_verify_verdict=PASS` (ultra_lean deferred — `sprints/S0142/plan-verify.json` SKIPPED placeholder treated as PASS; 7/7 AC surjective in sprint-plan + this remap + primary acceptance row)
- `blocking_count=0`
- `non_blocking_count=3` (execute-critic carry-forwards — informational; not new blockers)
- `story_status=OPEN` (do not mark US-0136 DONE; acceptance US-0136 unchecked; intake JSON not mutated)
- `acceptance_US-0136=NOT ticked`
- `intake_json=NOT mutated`
- `FRAMEWORK_KIT_REPO=1` / unpublished in-tree `standalone/` role-runtime + CLI/session contract-test slice — no web UI; **no fake browser PASS**
- `SECURITY_REVIEW=0`, `CROSS_REPO_OBSERVABILITY=0`, `COMPONENT_SCOPE_MODE=0`, `USER_GUIDE_MODE=0`, `SPEC_PACK_MODE=0`
- `sibling_boundary=US-0137..US-0148 OPEN out of scope; US-0133/US-0134/US-0135 DONE compose-only; BUG-0020 DONE not reopened; R-0120..R-0128 intact`

## Verdict rationale

Fresh QA independently remapped AC-1..AC-7 against architecture `# US-0136` A1 (`standalone/packages/role-runtime` no Pi; SessionSupervisor wrapping injected `AgentKernel.createSession`; RoleCatalog DEC-0051 + `AUTO_ROLE_*`; sidecar spawn/start/end + `attestation_hash`; additive `standalone_attestation`; DEC-0038 unamended; TS orchestrator scheduling-only; fail-closed `SESSION_*`/`ATTESTATION_*`; 10 `test_us0136_*`) + `tasks.md`, treated ultra_lean deferred `plan-verify.json` SKIPPED placeholder as **PASS** (7/7 AC surjective; this pass overwrote with QA PASS, mirror S0141), re-ran `cd standalone && npm test` (**36 passed**; **10/10** `test_us0136_*`; compose us0133/us0134/us0135 + unit) and `python -m pytest tests/us0136_contract_test.py tests/us0135_contract_test.py tests/us0134_contract_test.py tests/us0133_contract_test.py -v` (**8 passed**), confirmed kit `files` omit `standalone/`, no Pi in `role-runtime`, empty loader / `noTools: "builtin"` / KernelBridge / auth-models unamended, and independently recomputed execute proof hash **MATCH** before TTL. Blocking findings: **none**. US-0136 remains OPEN; acceptance unchecked; US-0135 / BUG-0020 not reopened. Critic NBs treated as informational.

## Test plan

| # | Check | Expected |
|---|---|---|
| 1 | Independent AC-1..AC-7 remap vs A1 + tasks | Each AC ≥1 task; primary acceptance covered |
| 2 | Ultra_lean deferred `sprints/S0142/plan-verify.json` | SKIPPED placeholder → PASS if 7/7 surjective |
| 3 | `cd standalone && npm test` | 36/36 PASS (10/10 `test_us0136_*` + compose) |
| 4 | Kit pytest us0136 + us0135 + us0134 + us0133 | 8/8 PASS (marker 10 + compose) |
| 5 | Standalone `npm run typecheck` / `npm run lint` | exit 0 |
| 6 | Kit `files` omit `standalone/`; no Pi in role-runtime | PASS |
| 7 | Isolation / `noTools` / KernelBridge / auth-models unamended; fake-model CI held; DEC-0038 unamended | held |
| 8 | Execute DEC-0038 proof consume | MATCH before TTL |
| 9 | Status OPEN; acceptance unchecked; US-0135/BUG-0020 DONE held | unchanged |
| 10 | UAT probes | `contract_tests_primary` PASS; live classes waived |
| 11 | Emit `convergence_smoke` when `contract_test_failed=0` | present, `result=pass` |

## Independent checks (this qa subagent)

| Check | Command / method | Result |
|---|---|---|
| Execute proof SHA-256 | `compute_strict_proof_hash` 6-field tuple | **MATCH** `E5830B62CFF328EB7733E4D6D95DD8D5BD91AB711CED7CEE7304232009752B6E`; ttl `2026-09-13T09:15:00Z`; consumed_at `2026-09-13T08:35:00Z` — **RUNTIME_PROOF_VALID** |
| Critic of execute proof | `compute_strict_proof_hash` | **MATCH** `A0FAF788E399979D6E9EC59612A8B932699CFCC2E479EFEE769823A17D919EE8`; blocking_count=0; anti_slop=10 |
| Standalone contract + unit | `npm test` in `standalone/` | **36 passed** in 2.69s (fail 0); **10/10** `test_us0136_*` |
| Kit + compose contract tests | `python -m pytest tests/us0136_contract_test.py tests/us0135_contract_test.py tests/us0134_contract_test.py tests/us0133_contract_test.py -v` | **8 passed** in 0.64s |
| Typecheck | `npm run typecheck` in `standalone/` | **exit 0** |
| Lint | `npm run lint` in `standalone/` | **47 files**, no fixes |
| Metadata | `python scripts/check-user-visible-metadata.py --repo .` | **exit 0** |
| UAT probe lib | `python scripts/uat_probe_lib.py --self-test` | **[UAT_PROBE_LIB_SELF_TEST_OK]** |
| Triad hot-surface | `python scripts/enforce-triad-hot-surface.py --check` | pre-write **PASS** (exit 0); post-append STATE_ARCHIVE_REQUIRED 1247/1200 units=15/80 → rollover pack `state-pack-20260913-an.md`; final `--check` **PASS** |
| Template byte pair | `filecmp` `tests/us0136_contract_test.py` | **IDENTICAL** |
| Kit `files` | `package.json` files whitelist | **omits** `standalone/` |
| CI job | `.github/workflows/ci.yml` | `working-directory: standalone`; matrix `ubuntu-latest` + `windows-latest`; Node 22; `npm test` covers `us0136.contract.test.ts` |
| Backlog / acceptance | Status + checkbox spot-check | OPEN; acceptance `- [ ] US-0136`; AC-1..AC-7 `[ ]` |
| LINT_COMMAND / TYPECHECK_COMMAND | blank in kit runbook | **skipped** (kit); standalone lint/typecheck **pass** (not folded into kit TEST_COMMAND) |
| Full harness `tests/run-tests.ps1` | not re-run this pass | **not claimed** — scoped pytest + standalone `npm test` are the required gates |
| No `.env` / no live provider / no `--live` CI | this pass | **held** |

## Blocking findings

None.

## Non-blocking findings (critic NB carry-forwards — informational)

| ID | Topic | QA note |
|---|---|---|
| NB1 / us0136ex-challenger-001 | execute proof MATCH; 10/10 markers; SessionSupervisor freshness + ContinuationContract same-phase run/steer + crash orphan + attestation fail-closed locked in tests | Independently re-verified this pass (36/36 npm test; 8/8 pytest; execute hash MATCH). Does **not** fail any AC. |
| NB2 / us0136ex-architect-002 | role-runtime no Pi; SessionSupervisor wrap injected AgentKernel; sidecar `attestation_hash` ≠ DEC-0038; isolation/`noTools`/KernelBridge/auth-models unamended | This pass overwrote SKIPPED placeholder with PASS `plan-verify.json` and remapped AC-1..AC-7. Execute layering / DEC-0136 held. Not blocking. |
| NB3 / us0136ex-subtractor-003 | no DONE / no US-0137+ / no live paid CI / no isolation loader amend / US-0135/BUG-0020 not reopened | Held this pass. A2–A9 rejected. Not blocking. |

## AC remap (independent — files + tests vs A1)

| AC | Delivered surface | Task(s) / markers | Result |
|---|---|---|---|
| AC-1 Fresh Pi session per producer/review/execute-QA rework except versioned continuation | `SessionSupervisor` wrap `createSession`; inMemory; ContinuationContract same-phase `run`/`steer`; critic fresh + `parent_phase_session_id` | T-001, T-003, T-004, T-008 (T-010 m1–m4, m6, m8) | **PASS** |
| AC-2 Typed RoleCatalog canonical map + alternates + bounded sovereign injection | `createDefaultRoleCatalog`; DEC-0051 + `AUTO_ROLE_*` + extra rows; `SESSION_UNKNOWN_PHASE`/`SESSION_UNKNOWN_ROLE`/`PHASE_ROLE_MISMATCH` | T-002 (T-010 m7) | **PASS** |
| AC-3 spawn/start/end attestations bound to run/phase/role/kernel/model/hashes/freshness | sidecar registry; `attestation_hash` SHA-256 canonical JSON without that field; stub context/policy hashes | T-005 (T-010 m9) | **PASS** |
| AC-4 US-0048/US-0056 compatible; additive sidecar | `attachStandaloneAttestation`; Python validators ignore unknown keys; DEC-0038 tuple unamended | T-005 | **PASS** |
| AC-5 Fail-closed reused IDs / role mismatch / transcript / missing-stale-hash / orchestrator mutation | `SESSION_*` / `ATTESTATION_*` / reused kit codes; `assertOrchestratorSchedulingOnly` | T-006, T-007 (T-010 m6–m10) | **PASS** |
| AC-6 Orchestrator scheduling-only; no write/shell tools | `assertOrchestratorSchedulingOnly`; empty allowlist; no Pi in gate | T-007 (T-010 m10) | **PASS** |
| AC-7 Isolation tests: PO/DEV, execute/QA cycle, critic, crash, dispose | exactly 10 `test_us0136_*`; compose us0133/us0134/us0135 green | T-008, T-009, T-010 (m1–m5) | **PASS** |

**Overall AC gate**: **PASS** (slice) — Status remains OPEN; backlog/acceptance checkboxes **not** ticked (US-0045; `/verify-work` / closure ownership).

## Contract marker results (10/10)

| # | Marker | Harness | Result |
|---|---|---|---|
| 1 | `test_us0136_po_dev_distinct_session_ids` | node:test | PASS |
| 2 | `test_us0136_execute_qa_cycle_new_ids` | node:test | PASS |
| 3 | `test_us0136_critic_distinct_session` | node:test | PASS |
| 4 | `test_us0136_crash_orphan_discard` | node:test | PASS |
| 5 | `test_us0136_session_dispose` | node:test | PASS |
| 6 | `test_us0136_reused_id_fail_closed` | node:test | PASS |
| 7 | `test_us0136_role_mismatch_fail_closed` | node:test | PASS |
| 8 | `test_us0136_transcript_carryover_fail_closed` | node:test | PASS |
| 9 | `test_us0136_missing_stale_hash_attestation` | node:test | PASS |
| 10 | `test_us0136_orchestrator_mutation_deny_and_no_pi_imports` | node:test + kit pytest | PASS |

US-0133 compose (node:test + pytest), US-0134 compose, and US-0135 compose remain green. Timeout unit + event-bridge unit PASS.

## Template byte-identity (US-0136 pair)

| Pair | Result |
|---|---|
| `tests/us0136_contract_test.py` | IDENTICAL |

## Compose / scope gates

| Gate | Result |
|---|---|
| A1 LOCKED (not A2–A9) | HELD |
| Kit `files` omit `standalone/`; kit is not a workspace root | HELD |
| No Pi / `@earendil-works/pi-*` inside `role-runtime`; no Biome override | HELD |
| AgentKernel empty loader / `noTools: "builtin"` / KernelBridge / auth-models unamended | HELD |
| Fake-model CI default held; no live paid CI | HELD |
| DEC-0038 `compute_strict_proof_hash` tuple UNAMENDED (sidecar hash separate) | HELD |
| architecture.md / DEC-0136 / R-0128 not rewritten; R-0120..R-0127 intact | HELD |
| US-0133/US-0134/US-0135 DONE compose-only; BUG-0020 DONE not reopened | HELD |
| US-0137+ OUT OF SCOPE | HELD |
| US-0045 Status OPEN / acceptance unchecked | HELD |
| Exactly 10 `test_us0136_*` markers; `test_us0133_*` / `test_us0134_*` / `test_us0135_*` not weakened | HELD |
| No `.env` read / no intake JSON mutation | HELD |

## UAT / convergence (US-0128)

- Contract slice green (`contract_test_failed=0`); 10/10 markers; typecheck/lint green; kit omit held.
- Canonical `convergence_smoke` recorded as **pass** in `sprints/S0142/uat.json`.
- Six live-runtime probe classes waived `UAT_PROBE_FORBIDDEN` (FRAMEWORK_KIT_REPO=1; unpublished standalone workspace; CLI/session contract-test slice; no live provider; not `browser_smoke`).
- Ultra_lean: QA merged AC checklist into `uat.json` / this file; operator UAT ticks and DONE remain `/verify-work` / closure ownership.
- Full UAT ownership remains with `/verify-work` (do not flip DONE / tick ACs here).
- Did **not** mutate `sprints/S0126/uat.json`.

## UAT probes (FRAMEWORK_KIT_REPO=1 — honest classification)

Applicable probe class: **`contract_tests_primary`** (10 markers + standalone `npm test`). No web UI. No fake browser PASS. Live-runtime / live provider probes **not attempted** (`UAT_PROBE_FORBIDDEN`). Static/fixture + fake-model only. No `.env`. No credentials filled.

Canonical surrogate step **`convergence_smoke`** emitted this pass (`result=pass`) because `contract_test_failed=0`.

| Probe class | Classification | reason_code |
|---|---|---|
| `browser_smoke` | waived / not applicable | `UAT_PROBE_FORBIDDEN` |
| `api_health` | waived / not applicable | `UAT_PROBE_FORBIDDEN` |
| `process_health` | waived / not applicable | `UAT_PROBE_FORBIDDEN` |
| `cli_smoke` | waived (session/CLI contract tests; no live runtime session) | `UAT_PROBE_FORBIDDEN` |
| `build` | waived (standalone typecheck/lint recorded as independent checks, not live-runtime class) | `UAT_PROBE_FORBIDDEN` |
| `manual_operator` | deferred to verify-work / operator | `UAT_PROBE_FORBIDDEN` |

**Runtime browser evidence**: none. MCP browser sequence **not run**. No screenshot. No silent browser PASS.

## Runtime QA evidence (US-0065) — kit + unpublished workspace slice, not generated webapp

- `runtime_startup_command`: n/a (FRAMEWORK_KIT_REPO=1; role-runtime + CLI/session isolation; no app server)
- `runtime_stack_profile`: python (kit) + node (standalone workspace)
- `runtime_mode`: local
- `runtime_health_target`: n/a — no process/endpoint
- `runtime_health_result`: not_applicable
- `runtime_log_summary`: n/a (no app logs)
- `runtime_retry_count`: 0
- `runtime_retry_ledger`: []
- `runtime_final_verdict`: pass
- `runtime_reason_code`: `UAT_PROBE_FORBIDDEN` for browser/runtime-app probes; slice health is contract tests + `convergence_smoke` surrogate
- `runtime_evidence_refs`: pytest 8/8; standalone npm test 36/36; typecheck/lint exit 0; `sprints/S0142/uat.json` `convergence_smoke`

## Generated-test evidence (US-0066)

- `generated_test_stack_profile`: python + node
- `generated_test_command`: `python -m pytest tests/us0136_contract_test.py tests/us0135_contract_test.py tests/us0134_contract_test.py tests/us0133_contract_test.py -v` + `npm test` (cwd `standalone/`)
- `generated_test_result`: pass
- `generated_test_output_ref`: this file § Independent checks (pytest 8 passed in 0.64s; npm test 36 passed in 2.69s)
- `generated_test_paths_ref`: `tests/us0136_contract_test.py`; `standalone/tests/contract/us0136.contract.test.ts`
- `generated_test_reason_code`: none (pass)

## Status confirmation (US-0045)

- backlog `## US-0136` Status: **OPEN**
- acceptance US-0136: **unchecked** (`- [ ] US-0136`)
- AC-1..AC-7: **unchecked**
- US-0133: **DONE** (not reopened)
- US-0134: **DONE** (not reopened)
- US-0135: **DONE** (not reopened)
- BUG-0020: **DONE** (not reopened)
- intake JSON not mutated this phase
- architecture.md `# US-0136` not mutated this phase
- R-0128 / R-0120..R-0127 bodies not mutated this phase

## Producer proof consumed (execute)

- `producer_runtime_proof_id=rp-auto-20260913-us0136-execute-dev-20260913T081500Z-US-0136`
- Canonical hashed payload: `{"orchestrator_run_id":"auto-20260913-us0136","phase_id":"execute","proof_issued_at":"2026-09-13T08:15:00Z","proof_ttl_seconds":3600,"role":"dev","runtime_proof_id":"rp-auto-20260913-us0136-execute-dev-20260913T081500Z-US-0136"}`
- `producer_attested_proof_hash=E5830B62CFF328EB7733E4D6D95DD8D5BD91AB711CED7CEE7304232009752B6E`
- Independent `compute_strict_proof_hash` recompute: **MATCH**
- `producer_proof_ttl=2026-09-13T09:15:00Z`, `consumed_at=2026-09-13T08:35:00Z` (orchestrator stamp before RUNTIME_PROOF_STALE)
- Isolation extras (not hashed): `delivery_mode=ultra_lean`; `macro_phase=build+verify`; `model_id=cursor-grok-4.6-high`; `sprint_id=S0142`; `story_id=US-0136`
- `producer_ttl_stale=false`
- `producer_fresh_context_marker=dev-US0136-execute-20260913T081500Z-fresh`
- Critic consume of same tuple at 2026-09-13T08:25:00Z recorded; this qa consume is independent MATCH-before-TTL
- Critic of execute: `rp-auto-20260913-us0136-sovereign-critic-techlead-20260913T082500Z-US-0136` / `A0FAF788E399979D6E9EC59612A8B932699CFCC2E479EFEE769823A17D919EE8` — independent MATCH; 0 blocking; anti_slop=10; findings `us0136ex-*` informational

## Strict runtime proof (DEC-0038) — qa

- `orchestrator_run_id=auto-20260913-us0136`
- `runtime_proof_id=rp-auto-20260913-us0136-qa-qa-20260913T083500Z-US-0136` (NEW unique — distinct from execute / sprint-plan / critic)
- `phase_id=qa`, `role=qa`, `story_id=US-0136`, `sprint_id=S0142`
- `delivery_mode=ultra_lean`, `macro_phase=build+verify`, `model_id=cursor-grok-4.6-high`
- `proof_issued_at=2026-09-13T08:35:00Z`
- `proof_ttl_seconds=3600`, `proof_ttl=2026-09-13T09:35:00Z` (UTC = issued_at + 3600s)
- `proof_hash=33E3C0EAE8C04E03BD0FC4069BE8FAAAE103AF0B5C677931EBE8FB235B95ADDB` (`compute_strict_proof_hash` positional 6-field)
- Canonical payload: `{"orchestrator_run_id":"auto-20260913-us0136","phase_id":"qa","proof_issued_at":"2026-09-13T08:35:00Z","proof_ttl_seconds":3600,"role":"qa","runtime_proof_id":"rp-auto-20260913-us0136-qa-qa-20260913T083500Z-US-0136"}`
- `hash_recompute_confirmation=true` (compute_strict_proof_hash → 33E3C0EAE8C04E03BD0FC4069BE8FAAAE103AF0B5C677931EBE8FB235B95ADDB)

## Strict runtime proof (DEC-0038) — plan-verify (ultra_lean merged)

- `runtime_proof_id=rp-auto-20260913-us0136-plan-verify-qa-20260913T083500Z-US-0136`
- `phase_id=plan-verify`, `role=qa`
- `proof_issued_at=2026-09-13T08:35:00Z`, `proof_ttl=2026-09-13T09:35:00Z`
- `proof_hash=AD04D486067161E833F690FDC46439C93790187533DC3B014356621646F22DE0`
- Canonical payload: `{"orchestrator_run_id":"auto-20260913-us0136","phase_id":"plan-verify","proof_issued_at":"2026-09-13T08:35:00Z","proof_ttl_seconds":3600,"role":"qa","runtime_proof_id":"rp-auto-20260913-us0136-plan-verify-qa-20260913T083500Z-US-0136"}`
- `hash_recompute_confirmation=true` (compute_strict_proof_hash → AD04D486067161E833F690FDC46439C93790187533DC3B014356621646F22DE0)

## Isolation evidence (US-0048 / DEC-0029 / US-0104 v2)

- `phase_id=qa`, `role=qa`, `model_id=cursor-grok-4.6-high` (CROSS_MODEL_REVIEW=1 — required)
- `fresh_context_marker=qa-US0136-qa-20260913T083500Z-fresh` (NEW per US-0048 / BUG-0006)
- `timestamp=2026-09-13T08:35:00Z` (UTC)
- `evidence_ref=sprints/S0142/qa-findings.md; sprints/S0142/plan-verify.json; sprints/S0142/uat.json; sprints/S0142/uat.md`
- Fresh qa subagent per BUG-0006 / US-0048 isolation; no prior chat history carried forward. Context limited to narrow-read (US-0053). No `.env` reads, no credentials access, no intake-evidence mutation, no backlog Status/AC mutation, no acceptance.md mutation, no architecture.md mutation, no DONE-row mutation, no `/execute` or `/verify-work` spawn from this subagent.

## Next scheduled phase

- `next_scheduled_phase=/verify-work` (role=qa per US-0069 / DEC-0051; fresh qa subagent per BUG-0006 — orchestrator-owned spawn; after sovereign-critic of qa if CROSS_MODEL_REVIEW=1)
- `next_scheduled_role=qa`
- `stop_condition=STOP after qa PASS. Orchestrator spawns sovereign-critic of qa (CROSS_MODEL_REVIEW=1), then /verify-work in a fresh qa subagent (BUG-0006). Do NOT spawn /verify-work or /execute from this subagent. Do NOT mark US-0136 DONE. Do NOT tick acceptance. Do NOT mutate intake JSON. Do NOT mutate architecture.md. Do NOT reopen US-0135 or BUG-0020. Do NOT mutate US-0137+.`
- `artifacts_written=sprints/S0142/qa-findings.md, sprints/S0142/plan-verify.json, sprints/S0142/uat.json, sprints/S0142/uat.md, sprints/S0142/progress.md, sprints/S0142/summary.md, docs/engineering/state.md (qa checkpoint append), handoffs/qa_to_verify.md (prepend), handoffs/resume_brief.md (qa PASS prepend → /verify-work)`
- `handoffs/qa_to_dev.md=NOT written` (no blocking findings; AUTO_IMPLEMENTATION_LOOP does not return to /execute)
