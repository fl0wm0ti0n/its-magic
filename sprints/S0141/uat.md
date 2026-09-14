# Sprint S0141 — UAT (US-0135) — populated at /verify-work (DEC-0009)

- **uat_lifecycle**: populated (verify-work PASS; DEC-0009 qa_seeded → populated complete)
- **sprint_id**: S0141
- **story_id**: US-0135
- **bug_refs**: (none)
- **phase**: verify-work (build+verify macro)
- **role**: qa (fresh per BUG-0006)
- **orchestrator_run_id**: auto-20260913-us0135
- **parent_run**: auto-20260913-bug0020
- **delivery_mode**: ultra_lean
- **macro_phase**: build+verify
- **story_type**: code (standalone auth + model routing / CLI/contract-test slice; FRAMEWORK_KIT_REPO=1)
- **fresh_context_marker**: `qa-US0135-verify-20260913T053500Z-fresh`
- **timestamp**: 2026-09-13T05:35:00Z (UTC)
- **model_id**: cursor-grok-4.6-high (CROSS_MODEL_REVIEW=1 — required)
- **producer_phase_id**: qa (role=qa; **QA_PASS**; `blocking_count=0`)
- **critic_phase_id**: sovereign-critic of qa (tech-lead, composer-2.5-fast; PASS; anti_slop=10; marker `critic-US0135-qa-20260913T052500Z-fresh`)
- **verdict**: **PASS** (verify-work) — UAT 8/8 pass, 0 fail (AC-1..AC-7 → UAT-1..UAT-7 + canonical `convergence_smoke`); live standalone `npm test` **26 passed in 2.67s** (**10/10** `test_us0135_*`); kit pytest **7/7**; 6 live-runtime classes `UAT_PROBE_FORBIDDEN`. Producer consume = qa `051500Z` / `B69C281F…`. **No fake browser PASS.**
- **total_steps**: 8 (UAT-1..UAT-7 + canonical `convergence_smoke`)
- **passed**: 8 | **failed**: 0
- **story_status**: OPEN (do not mark US-0135 DONE — US-0045; AC-1..AC-7 unchecked; intake JSON not mutated)
- **blocking_findings**: 0
- **non_blocking_findings**: 3 (NB1..NB3 critic carry-forwards — informational)
- **harness_fail_zero_claimed**: false (slice contract tests + compose are the required evidence)
- **browser_probe_used**: false (no fake browser PASS)
- **contract_test_failed**: 0

## Probe class — CLI / auth-models contract slice

US-0135 is a kit + unpublished standalone workspace CLI/auth-models contract-test slice. Applicable probe: `contract_tests_primary` (10 `test_us0135_*` markers + us0133/us0134 compose). No web UI. Six live-runtime classes waived with **`UAT_PROBE_FORBIDDEN`**. **No silent browser PASS.** MCP browser sequence not run. No live paid provider. No `.env`. No credentials filled. Did not mutate `sprints/S0126/uat.json`.

Canonical surrogate step `id=convergence_smoke` kept `result=pass` because `contract_test_failed=0` (10/10 node:test + 7/7 kit pytest).

## Target story + acceptance criteria (results)

- **US-0135** — Standalone authentication and model routing
  - **Primary** (`docs/product/acceptance.md`): Codex OAuth, API/custom providers, role precedence, thinking levels, critic collision, and credential safety (7 ACs). — **PASS** (surrogate: contract tests); checkbox **unchecked**
  - AC-1: PASS — owned OS auth path; InMemory no-disk; no Pi in auth-models (UAT-1; markers 1–3)
  - AC-2: PASS — provider matrix + fake two-role providers (UAT-2; marker 8)
  - AC-3: PASS — 6-step ModelRouter provenance (UAT-3; marker 4)
  - AC-4: PASS — thinking clamp orthogonal to slug/`TOKEN_PROFILE` (UAT-4; marker 5)
  - AC-5: PASS — `CROSS_MODEL_DEGRADED_MODE` (UAT-5; marker 6)
  - AC-6: PASS — diagnostics without tokens; `--live` CI forbidden (UAT-6; marker 7)
  - AC-7: PASS — two-role fake; OAuth refresh redact; fake-model CI held (UAT-7; markers 8–10)

## UAT step results (verify-work)

| Step | AC | Result | Evidence |
|------|----|--------|----------|
| UAT-1 | AC-1 | pass | markers 1–3; owned OS auth path; InMemory no-disk; no Pi in auth-models |
| UAT-2 | AC-2 | pass | marker 8; provider matrix + fake two-role providers |
| UAT-3 | AC-3 | pass | marker 4; 6-step ModelRouter provenance |
| UAT-4 | AC-4 | pass | marker 5; thinking clamp orthogonal to slug/`TOKEN_PROFILE` |
| UAT-5 | AC-5 | pass | marker 6; `CROSS_MODEL_DEGRADED_MODE` |
| UAT-6 | AC-6 | pass | marker 7; diagnostics without tokens; `--live` CI forbidden |
| UAT-7 | AC-7 | pass | markers 8–10; two-role fake; OAuth refresh redact; fake-model CI held |
| convergence_smoke | surrogate | pass | `contract_test_failed=0`; 6 waived probes `UAT_PROBE_FORBIDDEN` |

## Contract test markers (10) — verify-work live re-run

`cd standalone && npm test` — **26 passed** in 2.67s (**10/10** `test_us0135_*` + us0133 + us0134 + unit) (2026-09-13T05:35:00Z).

`python -m pytest tests/us0135_contract_test.py tests/us0134_contract_test.py tests/us0133_contract_test.py -v` — **7 passed** in 0.63s.

1. `test_us0135_owned_auth_path_outside_project` — PASS
2. `test_us0135_inmemory_credential_store_no_disk` — PASS
3. `test_us0135_no_pi_imports_in_auth_models` — PASS (node:test + kit pytest)
4. `test_us0135_model_router_six_step_precedence` — PASS
5. `test_us0135_thinking_orthogonal_to_slug_and_token_profile` — PASS
6. `test_us0135_critic_same_slug_degraded_mode` — PASS
7. `test_us0135_models_test_checkauth_no_token_logs` — PASS
8. `test_us0135_two_roles_different_providers_fake` — PASS
9. `test_us0135_oauth_refresh_not_in_prompt_audit_or_repo` — PASS
10. `test_us0135_fake_model_ci_default_held` — PASS

## Waived live-runtime probes

All 6 classes (`browser_smoke`, `api_health`, `process_health`, `cli_smoke`, `build`, `manual_operator`) waived **`UAT_PROBE_FORBIDDEN`**. No fake browser PASS. No credentials filled. No `.env`. Did not mutate `sprints/S0126/uat.json`.

## Isolation + proofs

| Phase | Marker / proof | Result |
|-------|----------------|--------|
| execute | `dev-US0135-execute-20260913T045500Z-fresh` / `B07A7BE0…` | PASS MATCH not-STALE |
| qa | `qa-US0135-qa-20260913T051500Z-fresh` / `B69C281F…` | PASS MATCH not-STALE |
| verify-work | `qa-US0135-verify-20260913T053500Z-fresh` / `F734761A…` | PASS (this phase) |

## Next

Sovereign-critic of verify-work (if CROSS_MODEL_REVIEW=1) → **`/release`** (fresh **release**) for **`S0141`** / **`US-0135`**. STOP — do not spawn `/release` or `/execute` from this subagent. Do NOT mark US-0135 DONE. Do NOT tick acceptance.
