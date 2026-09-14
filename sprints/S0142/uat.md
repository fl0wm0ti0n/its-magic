# Sprint S0142 — UAT (US-0136) — populated at /verify-work (DEC-0009)

- **uat_lifecycle**: populated (verify-work PASS; DEC-0009 qa_seeded → populated complete)
- **sprint_id**: S0142
- **story_id**: US-0136
- **bug_refs**: (none)
- **phase**: verify-work (build+verify macro)
- **role**: qa (fresh per BUG-0006)
- **orchestrator_run_id**: auto-20260913-us0136
- **parent_run**: auto-20260913-us0135
- **delivery_mode**: ultra_lean
- **macro_phase**: build+verify
- **story_type**: code (standalone role-runtime / CLI/session contract-test slice; FRAMEWORK_KIT_REPO=1)
- **fresh_context_marker**: `qa-US0136-verify-20260913T085500Z-fresh`
- **timestamp**: 2026-09-13T08:55:00Z (UTC)
- **model_id**: cursor-grok-4.6-high (CROSS_MODEL_REVIEW=1 — required)
- **producer_phase_id**: qa (role=qa; **QA_PASS**; `blocking_count=0`)
- **critic_phase_id**: sovereign-critic of qa (tech-lead, composer-2.5-fast; PASS; anti_slop=10; marker `critic-US0136-qa-20260913T084500Z-fresh`)
- **verdict**: **PASS** (verify-work) — UAT 8/8 pass, 0 fail (AC-1..AC-7 → UAT-1..UAT-7 + canonical `convergence_smoke`); live standalone `npm test` **36 passed in 2.70s** (**10/10** `test_us0136_*`); kit pytest **8/8**; 6 live-runtime classes `UAT_PROBE_FORBIDDEN`. Producer consume = qa `083500Z` / `33E3C0EA…`. **No fake browser PASS.**
- **total_steps**: 8 (UAT-1..UAT-7 + canonical `convergence_smoke`)
- **passed**: 8 | **failed**: 0
- **story_status**: OPEN (do not mark US-0136 DONE — US-0045; AC-1..AC-7 unchecked; intake JSON not mutated)
- **blocking_findings**: 0
- **non_blocking_findings**: 3 (NB1..NB3 critic carry-forwards — informational)
- **harness_fail_zero_claimed**: false (slice contract tests + compose are the required evidence)
- **browser_probe_used**: false (no fake browser PASS)
- **contract_test_failed**: 0

## Probe class — CLI / session contract slice

US-0136 is a kit + unpublished standalone workspace CLI/session contract-test slice. Applicable probe: `contract_tests_primary` (10 `test_us0136_*` markers + us0133/us0134/us0135 compose). No web UI. Six live-runtime classes waived with **`UAT_PROBE_FORBIDDEN`**. **No silent browser PASS.** MCP browser sequence not run. No live paid provider. No `.env`. No credentials filled. Did not mutate `sprints/S0126/uat.json`.

Canonical surrogate step `id=convergence_smoke` kept `result=pass` because `contract_test_failed=0` (10/10 node:test + 8/8 kit pytest).

## Target story + acceptance criteria (results)

- **US-0136** — Fresh role sessions and runtime attestation
  - **Primary** (`docs/product/acceptance.md`): phase-role enforcement, isolation proof, orchestrator restrictions, and crash-safe session lifecycle (7 ACs). — **PASS** (surrogate: contract tests); checkbox **unchecked**
  - AC-1: PASS — SessionSupervisor fresh `createSession`; ContinuationContract same-phase `run`/`steer` (UAT-1; markers 1–4, 6, 8)
  - AC-2: PASS — RoleCatalog DEC-0051 + `AUTO_ROLE_*` + extra rows (UAT-2; marker 7)
  - AC-3: PASS — spawn/start/end sidecar + `attestation_hash` (UAT-3; marker 9)
  - AC-4: PASS — additive `standalone_attestation`; DEC-0038 unamended (UAT-4; marker 9)
  - AC-5: PASS — `SESSION_*` / `ATTESTATION_*` / orchestrator deny (UAT-5; markers 6–10)
  - AC-6: PASS — scheduling-only; no Pi in role-runtime (UAT-6; marker 10)
  - AC-7: PASS — PO/DEV, execute/QA cycle, critic, crash, dispose (UAT-7; markers 1–5)

## UAT step results (verify-work)

| Step | AC | Result | Evidence |
|------|----|--------|----------|
| UAT-1 | AC-1 | pass | markers 1–4, 6, 8; SessionSupervisor fresh createSession; ContinuationContract same-phase run/steer |
| UAT-2 | AC-2 | pass | marker 7; RoleCatalog DEC-0051 + AUTO_ROLE_* + extra rows |
| UAT-3 | AC-3 | pass | marker 9; spawn/start/end sidecar + attestation_hash |
| UAT-4 | AC-4 | pass | marker 9; additive standalone_attestation; DEC-0038 unamended |
| UAT-5 | AC-5 | pass | markers 6–10; SESSION_*/ATTESTATION_*/orchestrator deny |
| UAT-6 | AC-6 | pass | marker 10; scheduling-only; no Pi in role-runtime |
| UAT-7 | AC-7 | pass | markers 1–5; PO/DEV, execute/QA cycle, critic, crash, dispose |
| convergence_smoke | surrogate | pass | `contract_test_failed=0`; 6 waived probes `UAT_PROBE_FORBIDDEN` |

## Contract test markers (10) — verify-work live re-run

`cd standalone && npm test` — **36 passed** in 2.70s (**10/10** `test_us0136_*` + us0133 + us0134 + us0135 + unit) (2026-09-13T08:55:00Z).

`python -m pytest tests/us0136_contract_test.py tests/us0135_contract_test.py tests/us0134_contract_test.py tests/us0133_contract_test.py -v` — **8 passed** in 0.64s.

1. `test_us0136_po_dev_distinct_session_ids` — PASS
2. `test_us0136_execute_qa_cycle_new_ids` — PASS
3. `test_us0136_critic_distinct_session` — PASS
4. `test_us0136_crash_orphan_discard` — PASS
5. `test_us0136_session_dispose` — PASS
6. `test_us0136_reused_id_fail_closed` — PASS
7. `test_us0136_role_mismatch_fail_closed` — PASS
8. `test_us0136_transcript_carryover_fail_closed` — PASS
9. `test_us0136_missing_stale_hash_attestation` — PASS
10. `test_us0136_orchestrator_mutation_deny_and_no_pi_imports` — PASS (node:test + kit pytest)

## Waived live-runtime probes

All 6 classes (`browser_smoke`, `api_health`, `process_health`, `cli_smoke`, `build`, `manual_operator`) waived **`UAT_PROBE_FORBIDDEN`**. No fake browser PASS. No credentials filled. No `.env`. Did not mutate `sprints/S0126/uat.json`.

## Isolation + proofs

| Phase | Marker / proof | Result |
|-------|----------------|--------|
| execute | `dev-US0136-execute-20260913T081500Z-fresh` / `E5830B62…` | PASS MATCH not-STALE |
| qa | `qa-US0136-qa-20260913T083500Z-fresh` / `33E3C0EA…` | PASS MATCH not-STALE |
| verify-work | `qa-US0136-verify-20260913T085500Z-fresh` / `1FC1CFD6…` | PASS (this phase) |

## Next

Sovereign-critic of verify-work (if CROSS_MODEL_REVIEW=1) → **`/release`** (fresh **release**) for **`S0142`** / **`US-0136`**. STOP — do not spawn `/release` or `/execute` from this subagent. Do NOT mark US-0136 DONE. Do NOT tick acceptance.
