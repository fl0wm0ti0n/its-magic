# Sprint S0149 — UAT (US-0141) — populated at /verify-work (DEC-0009)

- **uat_lifecycle**: populated (verify-work PASS; DEC-0009 qa_seeded → populated complete; verified-ready for `/release`)
- **sprint_id**: S0149
- **story_id**: US-0141
- **bug_refs**: (none)
- **phase**: verify-work (build+verify macro)
- **role**: qa (fresh per BUG-0006)
- **orchestrator_run_id**: auto-20260913-us0141
- **parent_run**: auto-20260913-us0140
- **delivery_mode**: ultra_lean
- **macro_phase**: build+verify
- **story_type**: code (standalone `@its-magic/app-runtime` contract-test slice; FRAMEWORK_KIT_REPO=1)
- **fresh_context_marker**: `qa-US0141-verify-20260914T015000Z-fresh`
- **timestamp**: 2026-09-14T01:50:00Z (UTC)
- **model_id**: cursor-grok-4.6-high (CROSS_MODEL_REVIEW=1 — required)
- **producer_phase_id**: qa (role=qa; **QA_PASS**; `blocking_count=0`)
- **critic_phase_id**: sovereign-critic of qa (tech-lead, composer-2.5-fast; PASS; anti_slop=10; marker `critic-US0141-qa-20260914T014000Z-fresh`; degraded_mode=false)
- **verdict**: **PASS** (verify-work) — UAT 9/9 pass, 0 fail (AC-1..AC-8 → UAT-1..UAT-8 + canonical `convergence_smoke`); live pytest **12 passed in 0.06s** (**12/12** `test_us0141_*`); 6 live-runtime classes `UAT_PROBE_FORBIDDEN`. Producer consume = qa `013000Z` / `755D5C2BDA224F3B0720376B0EE10D918D459B73CCD6151990F500687760460D`. **No fake browser PASS.**
- **total_steps**: 9 (UAT-1..UAT-8 + canonical `convergence_smoke`)
- **passed**: 9 | **failed**: 0
- **story_status**: OPEN (do not mark US-0141 DONE — US-0045)
- **acceptance_row**: unchecked (`docs/product/acceptance.md`)
- **backlog_ACs**: AC-1..AC-8 remain **unchecked** (closure/QE); Status OPEN
- **blocking_findings**: 0
- **non_blocking_findings**: 3 (NB1..NB3 critic of qa carry-forwards — informational)
- **harness_fail_zero_claimed**: false (slice contract tests + compose are the required evidence)
- **browser_probe_used**: false (no fake browser PASS; US-0142)
- **contract_test_failed**: 0
- **runtime_proof_id**: `rp-auto-20260913-us0141-verify-work-qa-20260914T015000Z-US-0141`
- **proof_hash**: `71E1071FD11CF3E3C0A5B92976EC5CA0676B50495D8DAC48548CB9AFACF1D677`

## Probe class — app-runtime contract slice

US-0141 is a kit + unpublished standalone workspace AppRuntime/ExecutionBackend contract-test slice. Applicable probe: `contract_tests_primary` (12 `test_us0141_*` markers + us0133..us0140 compose). No web UI driver this story. Six live-runtime classes waived with **`UAT_PROBE_FORBIDDEN`**. Browser UAT is **US-0142 OUT**. **No silent browser PASS.** MCP browser sequence not run. No live paid CI. No `.env`. No credentials filled. No intake mutation. Did not mutate `sprints/S0126/uat.json` or `sprints/S0147/uat.json` or `sprints/S0148/uat.json`.

`scripts/uat_probe_lib.py` `classify_step` on AC texts: UAT-1/UAT-2/UAT-3/UAT-5/UAT-6/UAT-7/UAT-8 → `UAT_PROBE_UNRESOLVED`; UAT-4 (`test`) → `test`. Kit `TEST_COMMAND` was **not** executed. Evidence is scoped pytest (this pass) + standalone `npm test` (qa attestation).

Canonical surrogate step `id=convergence_smoke` kept `result=pass` because `contract_test_failed=0` (12/12 pytest this pass).

## Target story + acceptance criteria (results)

- **US-0141** — Application runtime and pluggable execution backends
  - **Primary** (`docs/product/acceptance.md`): Discover, launch, observe, and repair applications locally or remotely. — **PASS** (surrogate: contract tests); checkbox **unchecked**
  - AC-1: PASS — AppRuntime lifecycle (UAT-1; marker 1)
  - AC-2: PASS — ProcessManager identity + additive `process_handles` (UAT-2; marker 2)
  - AC-3: PASS — local+docker core + WSL/SSH adapters (UAT-3; markers 3–4)
  - AC-4: PASS — stack profiles Node/Python/Go/Java/.NET (UAT-4; marker 5)
  - AC-5: PASS — bounded self-debug + restart cap (UAT-5; marker 6)
  - AC-6: PASS — test/build evidence + summarize (UAT-6; marker 7)
  - AC-7: PASS — Connect handoff no browser + cleanup (UAT-7; markers 8–9)
  - AC-8: PASS — chaos fixtures + `BACKEND_UNSUPPORTED` (UAT-8; markers 10–12)

## UAT step results (verify-work)

| Step | AC | Result | Evidence |
|------|----|--------|----------|
| UAT-1 | AC-1 | pass | AppRuntime start/stop/restart/health/logs; marker 1 |
| UAT-2 | AC-2 | pass | ProcessManager identity; additive `process_handles`; marker 2 |
| UAT-3 | AC-3 | pass | local+docker core + WSL/SSH `BACKEND_*`; markers 3–4 |
| UAT-4 | AC-4 | pass | stack profiles; classify `test` not executed as kit TEST_COMMAND; marker 5 |
| UAT-5 | AC-5 | pass | restart cap 3; HEALTHCHECK status-only; marker 6 |
| UAT-6 | AC-6 | pass | structured evidence JSON; marker 7 |
| UAT-7 | AC-7 | pass | Connect names; no Playwright/CDP; US-0142; markers 8–9 |
| UAT-8 | AC-8 | pass | chaos fake backends; `BACKEND_UNSUPPORTED`; markers 10–12 |
| convergence_smoke | surrogate | pass | `contract_test_failed=0`; 6 waived probes `UAT_PROBE_FORBIDDEN` |

## Results summary (AC-1..AC-8)

UAT-1..UAT-8 each map 1:1 to AC-1..AC-8 and all **pass**. Canonical `convergence_smoke` **pass** because `contract_test_failed=0`. Combined: **9 passed / 0 failed** (`passed` + `failed` = `total`). Primary acceptance row remains **unchecked** (closure ownership). Backlog AC-1..AC-8 remain **unchecked** (closure/QE).

## Contract test markers (12) — verify-work live re-run

`python -m pytest tests/us0141_contract_test.py -q` — **12 passed** in 0.06s. Standalone `npm test` **94/94** remains qa attestation (2026-09-14T01:30:00Z; not re-run this pass).

1. `test_us0141_app_runtime_lifecycle` — PASS
2. `test_us0141_process_manager_identity` — PASS
3. `test_us0141_backend_local_docker_core` — PASS
4. `test_us0141_backend_wsl_ssh_adapters` — PASS
5. `test_us0141_stack_profiles` — PASS
6. `test_us0141_self_debug_cap` — PASS
7. `test_us0141_test_build_evidence` — PASS
8. `test_us0141_connect_handoff_no_browser` — PASS
9. `test_us0141_cleanup_success_fail_cancel` — PASS
10. `test_us0141_chaos_crash_timeout_restart` — PASS
11. `test_us0141_chaos_docker_remote_disconnect` — PASS
12. `test_us0141_unsupported_backend` — PASS

## Waived live-runtime probes

| Probe class | reason_code |
|---|---|
| `browser_smoke` | `UAT_PROBE_FORBIDDEN` (US-0142) |
| `api_health` | `UAT_PROBE_FORBIDDEN` |
| `process_health` | `UAT_PROBE_FORBIDDEN` |
| `cli_smoke` | `UAT_PROBE_FORBIDDEN` |
| `build` | `UAT_PROBE_FORBIDDEN` |
| `manual_operator` | `UAT_PROBE_FORBIDDEN` |

**Runtime browser evidence**: none. No screenshot. No silent browser PASS. `harness_fail_zero_claimed=false`.

## Isolation + proofs

| Phase | Marker / proof | Result |
|-------|----------------|--------|
| execute | `dev-US0141-execute-20260914T011000Z-fresh` / `9DFBA0B223F144A2223498DF3220B35658BAF41CD6ED4B3E9D917F58F0DBAC6F` | PASS MATCH not-STALE (ttl 02:10; consumed 01:50) |
| qa | `qa-US0141-qa-20260914T013000Z-fresh` / `755D5C2BDA224F3B0720376B0EE10D918D459B73CCD6151990F500687760460D` | PASS MATCH not-STALE (ttl 02:30; consumed 01:50) |
| critic of qa | `critic-US0141-qa-20260914T014000Z-fresh` / `6A64E36A6BA1B937ABB17C432610B75E59EF0C29FAF08CA6AB532AEB54CEAF2C` | PASS MATCH; 0 blocking; anti_slop=10; degraded_mode=false |
| verify-work | `qa-US0141-verify-20260914T015000Z-fresh` / `71E1071FD11CF3E3C0A5B92976EC5CA0676B50495D8DAC48548CB9AFACF1D677` | PASS (this phase) |

## Next

Sovereign-critic of verify-work → **`/release`** (fresh **release**) for **`S0149`** / **`US-0141`**. STOP — do not spawn `/release` or `/execute` from this subagent. Do NOT mark US-0141 DONE. Do NOT tick acceptance.md. Do NOT tick backlog ACs. Do NOT reopen US-0133..US-0140. Do NOT mutate US-0142+ or BUG-0021 or BUG-0022 or BUG-0023. Do NOT mutate S0146/S0147/S0148.
