# Sprint S0152 — UAT (US-0144) — populated at /verify-work (DEC-0009)

- **uat_lifecycle**: populated (verify-work PASS; DEC-0009 qa_seeded → populated complete; `verified_ready=true` for `/release`)
- **sprint_id**: S0152
- **story_id**: US-0144
- **bug_refs**: (none)
- **phase**: verify-work (build+verify macro)
- **role**: qa (fresh per BUG-0006)
- **orchestrator_run_id**: auto-20260913-us0144
- **parent_run**: auto-20260913-us0143
- **delivery_mode**: ultra_lean
- **macro_phase**: build+verify
- **story_type**: code (standalone `@its-magic/runtime-core` sovereign-runtime contract-test slice; FRAMEWORK_KIT_REPO=1; **NOT browser-owned**)
- **fresh_context_marker**: `qa-US0144-verify-20260915T210715Z-fresh`
- **timestamp**: 2026-09-15T21:07:15Z (UTC wall-clock)
- **model_id**: inherit (MODEL_RESOLVE=alias_only; CROSS_MODEL_REVIEW=0)
- **producer_phase_id**: qa (role=qa; **QA_PASS**; `blocking_count=0`)
- **critic_phase_id**: skipped (CROSS_MODEL_REVIEW=0)
- **verdict**: **PASS** (verify-work) — UAT 9/9 pass, 0 fail (AC-1..AC-8 → UAT-1..UAT-8 + canonical `convergence_smoke`); live scoped node:test **12 passed** fail 0 duration_ms 1049.7823 (**12/12** `test_us0144_*`); npm **130/130** qa attestation; 6 live-runtime classes `UAT_PROBE_FORBIDDEN`. **Live Chrome not probed. No fake live-Chrome PASS.**
- **total_steps**: 9 (UAT-1..UAT-8 + canonical `convergence_smoke`)
- **passed**: 9 | **failed**: 0
- **story_status**: OPEN (do not mark US-0144 DONE — US-0045)
- **acceptance_row**: unchecked (`docs/product/acceptance.md`)
- **backlog_ACs**: AC-1..AC-8 remain **unchecked** (closure/QE); Status OPEN
- **blocking_findings**: 0
- **non_blocking_findings**: 0
- **harness_fail_zero_claimed**: false
- **fake_browser_pass_claimed**: false
- **live_chrome_probed**: false
- **probe_kind**: `contract_tests_primary`
- **live browser**: `UAT_PROBE_FORBIDDEN`
- **contract_test_failed**: 0
- **verified_ready**: true
- **runtime_proof_id**: `rp-auto-20260913-us0144-verify-work-qa-20260915T210715Z-US-0144`
- **proof_hash**: `61E4026FF127F64499AED99769B88B0F855DE4FB6B7ED5E100319F0D70E49B8C`
- **proof_issued_at**: 2026-09-15T21:07:15Z
- **proof_ttl**: 2026-09-15T22:07:15Z

## Probe class — sovereign-runtime contract slice

US-0144 is a kit + unpublished standalone workspace SovereignRuntime/KernelBridge contract-test slice. Applicable probe: `contract_tests_primary` (12 `test_us0144_*` markers). **This story is NOT browser-owned.** Six live-runtime classes waived with **`UAT_PROBE_FORBIDDEN`**. Live Chrome / Cursor MCP not probed. No `.env`. No credentials filled. No intake mutation.

Canonical surrogate step `id=convergence_smoke` kept `result=pass` because `contract_test_failed=0` (12/12 this pass).

## Target story + acceptance criteria (results)

- **US-0144** — Sovereign memory, reviews, and convergence
  - **Primary** (`docs/product/acceptance.md`): Sovereign memory, reviews, and convergence — decision ledger, bounded memory, critics, deferrals, evidence-based convergence, and contract tests (8 ACs). — **PASS** (surrogate: contract tests); checkbox **unchecked**
  - AC-1: PASS — ledger + plan fidelity (UAT-1; markers 1–2, 7–8)
  - AC-2: PASS — bounded memory + default-off (UAT-2; markers 3–4; Q00)
  - AC-3: PASS — supplementary reviews (UAT-3; marker 6)
  - AC-4: PASS — critic pin + degraded (UAT-4; marker 5; Q11)
  - AC-5: PASS — drain gate + operator decision (UAT-5; markers 9–10)
  - AC-6: PASS — blocking-only convergence + smoke truth (UAT-6; marker 11)
  - AC-7: PASS — caps/progress/partial (UAT-7; marker 12; Q10)
  - AC-8: PASS — 12 markers + default-off (UAT-8; m1–m12)

## UAT step results (verify-work)

| Step | AC | Result | Evidence |
|------|----|--------|----------|
| UAT-1 | AC-1 | pass | KernelBridge + bridge + ledger/sidecar; markers 1–2, 7–8 |
| UAT-2 | AC-2 | pass | pre-spawn + memory bounds Q00; markers 3–4 |
| UAT-3 | AC-3 | pass | supplementary reviews; marker 6 |
| UAT-4 | AC-4 | pass | model collision degraded Q11; marker 5 |
| UAT-5 | AC-5 | pass | drain gate + per-candidate; markers 9–10 |
| UAT-6 | AC-6 | pass | blocking-only + smoke truth; marker 11 |
| UAT-7 | AC-7 | pass | caps/progress/partial Q10; marker 12 |
| UAT-8 | AC-8 | pass | 12/12 this pass; npm 130/130 qa attestation; default-off |
| convergence_smoke | surrogate | pass | `contract_test_failed=0`; 6 waived probes `UAT_PROBE_FORBIDDEN` |

## Results summary (AC-1..AC-8)

UAT-1..UAT-8 each map 1:1 to AC-1..AC-8 and all **pass**. Canonical `convergence_smoke` **pass** because `contract_test_failed=0`. Combined: **9 passed / 0 failed**. Primary acceptance row remains **unchecked** (closure ownership). Backlog AC-1..AC-8 remain **unchecked** (closure/QE). `verified_ready=true`.

## Contract test markers (12) — verify-work live re-run

`node --experimental-strip-types --test tests/contract/us0144.contract.test.ts` — **12 passed** fail 0 duration_ms 1049.7823. Standalone `npm test` — **130/130** qa attestation (2026-09-15T21:00:53Z; not re-run this pass).

1. `test_us0144_kernel_bridge_admission` — PASS
2. `test_us0144_bridge_json_timeout_fail_closed` — PASS
3. `test_us0144_pre_spawn_context_order` — PASS (Q01)
4. `test_us0144_memory_bounds_default_off` — PASS (Q00)
5. `test_us0144_model_collision_degraded` — PASS (Q11)
6. `test_us0144_supplementary_manifest_reviews` — PASS
7. `test_us0144_ledger_schema_preserved` — PASS
8. `test_us0144_sidecar_idempotent_torn_write` — PASS
9. `test_us0144_drain_gate_preset_zero` — PASS
10. `test_us0144_per_candidate_operator_decision` — PASS
11. `test_us0144_blocking_only_convergence_smoke_truth` — PASS
12. `test_us0144_caps_progress_partial_delivery_boundaries` — PASS (Q10)

## Next

Orchestrator MUST spawn `/release` in a fresh release subagent (BUG-0006). CROSS_MODEL_REVIEW=0 — no critic. Do NOT spawn `/release` from this verify-work. Do NOT mark US-0144 DONE. Do NOT tick acceptance or backlog ACs.
