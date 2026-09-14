# Sprint S0143 — UAT (US-0137) — populated at /verify-work (DEC-0009)

- **uat_lifecycle**: populated (verify-work PASS; DEC-0009 qa_seeded → populated complete; verified-ready for `/release`)
- **sprint_id**: S0143
- **story_id**: US-0137
- **bug_refs**: (none)
- **phase**: verify-work (build+verify macro)
- **role**: qa (fresh per BUG-0006)
- **orchestrator_run_id**: auto-20260913-us0137
- **parent_run**: auto-20260913-us0136
- **delivery_mode**: ultra_lean
- **macro_phase**: build+verify
- **story_type**: code (standalone policy-engine / tool-broker / kernel tool-port contract-test slice; FRAMEWORK_KIT_REPO=1)
- **fresh_context_marker**: `qa-US0137-verify-20260913T121500Z-fresh`
- **timestamp**: 2026-09-13T12:15:00Z (UTC)
- **model_id**: cursor-grok-4.6-high (CROSS_MODEL_REVIEW=1 — required)
- **producer_phase_id**: qa (role=qa; **QA_PASS**; `blocking_count=0`)
- **critic_phase_id**: sovereign-critic of qa (tech-lead, composer-2.5-fast; PASS; anti_slop=10; marker `critic-US0137-qa-20260913T120500Z-fresh`)
- **verdict**: **PASS** (verify-work) — UAT 9/9 pass, 0 fail (AC-1..AC-8 → UAT-1..UAT-8 + canonical `convergence_smoke`); live standalone `npm test` **46 passed in 2.91s** (**10/10** `test_us0137_*`); kit pytest **9/9**; 6 live-runtime classes `UAT_PROBE_FORBIDDEN`. Producer consume = qa `115500Z` / `8EBB63CA…`. **No fake browser PASS.**
- **total_steps**: 9 (UAT-1..UAT-8 + canonical `convergence_smoke`)
- **passed**: 9 | **failed**: 0
- **story_status**: OPEN (do not mark US-0137 DONE — US-0045; AC-1..AC-8 unchecked; intake JSON not mutated)
- **blocking_findings**: 0
- **non_blocking_findings**: 3 (NB1..NB3 critic carry-forwards — informational)
- **harness_fail_zero_claimed**: false (slice contract tests + compose are the required evidence)
- **browser_probe_used**: false (no fake browser PASS)
- **contract_test_failed**: 0
- **runtime_proof_id**: `rp-auto-20260913-us0137-verify-work-qa-20260913T121500Z-US-0137`
- **proof_hash**: `1935425E70F1379A9D9AEE780CC1A42A9F54D18F766D5F321DDED8145B8E99E1`

## Probe class — policy / tool-broker contract slice

US-0137 is a kit + unpublished standalone workspace policy-engine / tool-broker contract-test slice. Applicable probe: `contract_tests_primary` (10 `test_us0137_*` markers + us0133/us0134/us0135/us0136 compose). No web UI. Six live-runtime classes waived with **`UAT_PROBE_FORBIDDEN`**. **No silent browser PASS.** MCP browser sequence not run. No live paid provider. No `.env`. No credentials filled. Did not mutate `sprints/S0126/uat.json`.

Canonical surrogate step `id=convergence_smoke` kept `result=pass` because `contract_test_failed=0` (10/10 node:test + 9/9 kit pytest).

## Target story + acceptance criteria (results)

- **US-0137** — Owned tool broker, policy engine, and security boundary
  - **Primary** (`docs/product/acceptance.md`): role/path/shell controls, secrets, OS profiles, audit, and security tests (8 ACs). — **PASS** (surrogate: contract tests); checkbox **unchecked**
  - AC-1: PASS — production `itsm_*` via ToolBroker; `noTools: "builtin"`; orchestrator `[]` (UAT-1; markers 1, 2, 10)
  - AC-2: PASS — PolicyEngine ALLOW\|ASK\|DENY; `security_hard` unrelaxable (UAT-2)
  - AC-3: PASS — PO src / QA silent fix / traversal deny (UAT-3; markers 3, 4, 6)
  - AC-4: PASS — shell exfil + traversal fail-closed (UAT-4; markers 6, 7)
  - AC-5: PASS — `.env` deny before content; header redaction (UAT-5; markers 5, 8)
  - AC-6: PASS — Layer A ≠ Layer B; `ISOLATION_BACKEND_UNAVAILABLE`; no OS-sandbox claim (UAT-6; marker 9)
  - AC-7: PASS — compact audit + real `policy_hash`; DEC-0038 unamended (UAT-7)
  - AC-8: PASS — 10/10 `test_us0137_*`; compose us0133–us0136 green (UAT-8)

## UAT step results (verify-work)

| Step | AC | Result | Evidence |
|------|----|--------|----------|
| UAT-1 | AC-1 | pass | markers 1, 2, 10; ownedTools itsm_* only; noTools builtin; orchestrator [] |
| UAT-2 | AC-2 | pass | PolicyEngine ALLOW\|ASK\|DENY; security_hard unrelaxable |
| UAT-3 | AC-3 | pass | markers 3, 4, 6; PO src / QA silent fix / traversal |
| UAT-4 | AC-4 | pass | markers 6, 7; shell exfil + traversal fail-closed |
| UAT-5 | AC-5 | pass | markers 5, 8; secret path deny + header redaction |
| UAT-6 | AC-6 | pass | marker 9; ISOLATION_BACKEND_UNAVAILABLE; no OS sandbox claim |
| UAT-7 | AC-7 | pass | ToolBroker computePolicyHash; DEC-0038 unamended |
| UAT-8 | AC-8 | pass | markers 1–10; 10/10 test_us0137_* |
| convergence_smoke | surrogate | pass | `contract_test_failed=0`; 6 waived probes `UAT_PROBE_FORBIDDEN` |

## Contract test markers (10) — verify-work live re-run

`cd standalone && npm test` — **46 passed** in 2.91s (**10/10** `test_us0137_*` + us0133 + us0134 + us0135 + us0136 + unit) (2026-09-13T12:15:00Z).

`python -m pytest tests/us0137_contract_test.py tests/us0136_contract_test.py tests/us0135_contract_test.py tests/us0134_contract_test.py tests/us0133_contract_test.py -v` — **9 passed** in 0.76s.

1. `test_us0137_no_raw_pi_tools_in_production_session` — PASS
2. `test_us0137_role_subset_itsm_tools` — PASS
3. `test_us0137_po_src_deny` — PASS
4. `test_us0137_qa_silent_fix_deny` — PASS
5. `test_us0137_env_read_deny` — PASS
6. `test_us0137_path_traversal_deny` — PASS
7. `test_us0137_shell_exfil_deny` — PASS
8. `test_us0137_browser_header_redaction` — PASS
9. `test_us0137_isolation_backend_unavailable` — PASS
10. `test_us0137_malicious_pi_extension_and_orchestrator_zero_tools` — PASS

US-0133 compose, US-0134 compose, US-0135 compose, and US-0136 compose remain green.

## Waived live-runtime probes

All 6 classes (`browser_smoke`, `api_health`, `process_health`, `cli_smoke`, `build`, `manual_operator`) waived **`UAT_PROBE_FORBIDDEN`**. No fake browser PASS. No credentials filled. No `.env`. Did not mutate `sprints/S0126/uat.json`.

## Isolation + proofs

| Phase | Marker / proof | Result |
|-------|----------------|--------|
| execute | `dev-US0137-execute-20260913T113500Z-fresh` / `5C187C56…` | PASS MATCH not-STALE |
| qa | `qa-US0137-qa-20260913T115500Z-fresh` / `8EBB63CA…` | PASS MATCH not-STALE |
| verify-work | `qa-US0137-verify-20260913T121500Z-fresh` / `1935425E…` | PASS (this phase) |

## Next

Sovereign-critic of verify-work (if CROSS_MODEL_REVIEW=1) → **`/release`** (fresh **release**) for **`S0143`** / **`US-0137`**. STOP — do not spawn `/release` or `/execute` from this subagent. Do NOT mark US-0137 DONE. Do NOT tick acceptance.
