# Sprint S0145 — UAT (US-0139) — populated at /verify-work (DEC-0009)

- **uat_lifecycle**: populated (verify-work PASS; DEC-0009 qa_seeded → populated complete; verified-ready for `/release`)
- **sprint_id**: S0145
- **story_id**: US-0139
- **bug_refs**: (none)
- **phase**: verify-work (build+verify macro)
- **role**: qa (fresh per BUG-0006)
- **orchestrator_run_id**: auto-20260913-us0139
- **parent_run**: auto-20260913-us0138
- **delivery_mode**: ultra_lean
- **macro_phase**: build+verify
- **story_type**: code (standalone `@its-magic/code-intelligence` + `@its-magic/context-engine` contract-test slice; FRAMEWORK_KIT_REPO=1)
- **fresh_context_marker**: `qa-US0139-verify-20260913T185500Z-fresh`
- **timestamp**: 2026-09-13T18:55:00Z (UTC)
- **model_id**: cursor-grok-4.6-high (CROSS_MODEL_REVIEW=1 — required)
- **producer_phase_id**: qa (role=qa; **QA_PASS**; `blocking_count=0`)
- **critic_phase_id**: sovereign-critic of qa (tech-lead, composer-2.5-fast; PASS; anti_slop=10; marker `critic-US0139-qa-20260913T184500Z-fresh`; degraded_mode=false)
- **verdict**: **PASS** (verify-work) — UAT 9/9 pass, 0 fail (AC-1..AC-8 → UAT-1..UAT-8 + canonical `convergence_smoke`); live standalone `npm test` **70 passed in 2.979s** (**12/12** `test_us0139_*`); 6 live-runtime classes `UAT_PROBE_FORBIDDEN`. Producer consume = qa `183500Z` / `8F63959E26C4B802F5A3DE8A8A0B5F34971ABCD03C3A6B9F3150C3AE727C3B72`. **No fake browser PASS.**
- **total_steps**: 9 (UAT-1..UAT-8 + canonical `convergence_smoke`)
- **passed**: 9 | **failed**: 0
- **story_status**: OPEN (do not mark US-0139 DONE — US-0045)
- **acceptance_row**: unchecked (`docs/product/acceptance.md`)
- **backlog_ACs**: AC-1..AC-8 remain ticked from QA; Status OPEN
- **blocking_findings**: 0
- **non_blocking_findings**: 3 (NB1..NB3 critic of qa carry-forwards — informational)
- **harness_fail_zero_claimed**: false (slice contract tests + compose are the required evidence)
- **browser_probe_used**: false (no fake browser PASS)
- **contract_test_failed**: 0
- **runtime_proof_id**: `rp-auto-20260913-us0139-verify-work-qa-20260913T185500Z-US-0139`
- **proof_hash**: `251DD21037AB0965502FCD3D3D4E4819FCB88CA1939BC1F222294EB2DA658D22`

## Probe class — code intelligence / context-engine contract slice

US-0139 is a kit + unpublished standalone workspace code-intelligence / bounded-context contract-test slice. Applicable probe: `contract_tests_primary` (12 `test_us0139_*` markers + us0133..us0138 compose). No web UI. Six live-runtime classes waived with **`UAT_PROBE_FORBIDDEN`**. **No silent browser PASS.** MCP browser sequence not run. No live AFT / paid embeddings. No `.env`. No credentials filled. No intake mutation. Did not mutate `sprints/S0126/uat.json` or `sprints/S0144/uat.json`.

`scripts/uat_probe_lib.py` `classify_step` on AC texts: UAT-1/UAT-2/UAT-4/UAT-5/UAT-6 → `UAT_PROBE_UNRESOLVED`; UAT-3 (`tests`) → `test`; UAT-7 (`tests`) → `test`; UAT-8 (`Tests`) → `test`. Kit `TEST_COMMAND` was **not** executed. Evidence is scoped standalone `npm test`.

Canonical surrogate step `id=convergence_smoke` kept `result=pass` because `contract_test_failed=0` (12/12 node:test).

## Target story + acceptance criteria (results)

- **US-0139** — Persistent code intelligence and bounded context engine
  - **Primary** (`docs/product/acceptance.md`): AFT adapter, indexed retrieval, context fusion/hashes, codebase map, benchmark, and stale recovery (8 ACs). — **PASS** (surrogate: contract tests); checkbox **unchecked**
  - AC-1: PASS — backend-neutral `CodeIntelligenceProvider` (UAT-1; marker 1)
  - AC-2: PASS — AFT read adapter; mutations denied; six `itsm_*` unstub (UAT-2; marker 2)
  - AC-3: PASS — `code_context` ranking + TOKEN_PROFILE caps (UAT-3; marker 3)
  - AC-4: PASS — per-phase exclusion; no `.env`/transcripts/backlog/giant prompts (UAT-4; marker 4)
  - AC-5: PASS — source refs + pack content hash ≠ DEC-0038 (UAT-5; marker 5)
  - AC-6: PASS — derived codebase-map compose + meta.json (UAT-6; marker 6)
  - AC-7: PASS — benchmark 10 metrics; its-indexd OUT (UAT-7; marker 7)
  - AC-8: PASS — incremental refresh + AFT/LSP/embeddings/index degradation (UAT-8; markers 8–12)

## UAT step results (verify-work)

| Step | AC | Result | Evidence |
|------|----|--------|----------|
| UAT-1 | AC-1 | pass | `CodeIntelligenceProvider` interface; fake adapter; marker 1 |
| UAT-2 | AC-2 | pass | nested AFT read; `INTEL_MUTATION_DENIED`; `LIVE_INTEL_TOOLS` |
| UAT-3 | AC-3 | pass | weights + TOKEN_PROFILE caps; `CONTEXT_BUDGET`; marker 3 |
| UAT-4 | AC-4 | pass | assembler exclusion; sovereign digest 1500; no `.env` |
| UAT-5 | AC-5 | pass | `snippet_sha256`; pack `content_hash` ≠ DEC-0038 |
| UAT-6 | AC-6 | pass | compose `materialize_codebase_map.py`; operator maps preserved |
| UAT-7 | AC-7 | pass | 10 bench metrics; fake-model/fake-AFT; its-indexd OUT |
| UAT-8 | AC-8 | pass | markers 8–12; `INTEL_*` partial packs + stale recovery |
| convergence_smoke | surrogate | pass | `contract_test_failed=0`; 6 waived probes `UAT_PROBE_FORBIDDEN` |

## Results summary (AC-1..AC-8)

UAT-1..UAT-8 each map 1:1 to AC-1..AC-8 and all **pass**. Canonical `convergence_smoke` **pass** because `contract_test_failed=0`. Combined: **9 passed / 0 failed** (`passed` + `failed` = `total`). Primary acceptance row remains **unchecked** (closure ownership).

## Contract test markers (12) — verify-work live re-run

`cd standalone && npm test` — **70 passed** in 2.979s (**12/12** `test_us0139_*` + us0133 + us0134 + us0135 + us0136 + us0137 + us0138 + unit) (2026-09-13T18:55:00Z).

1. `test_us0139_provider_interface` — PASS
2. `test_us0139_aft_mutation_denied` — PASS
3. `test_us0139_ranking_bounds_token_profile` — PASS
4. `test_us0139_phase_exclusion` — PASS
5. `test_us0139_pack_hash_and_refs` — PASS
6. `test_us0139_derived_map_compose` — PASS
7. `test_us0139_benchmark_smoke` — PASS
8. `test_us0139_incremental_refresh` — PASS
9. `test_us0139_aft_unavailable_partial_pack` — PASS
10. `test_us0139_lsp_unavailable_partial_pack` — PASS
11. `test_us0139_embeddings_unavailable_partial_pack` — PASS
12. `test_us0139_index_stale_recovery` — PASS

US-0133 compose, US-0134 compose, US-0135 compose, US-0136 compose, US-0137 compose, and US-0138 compose remain green.

## Waived live-runtime classes

| Class | reason_code |
|-------|-------------|
| browser_smoke | UAT_PROBE_FORBIDDEN |
| api_health | UAT_PROBE_FORBIDDEN |
| process_health | UAT_PROBE_FORBIDDEN |
| cli_smoke | UAT_PROBE_FORBIDDEN |
| build | UAT_PROBE_FORBIDDEN |
| manual_operator | UAT_PROBE_FORBIDDEN |

## Honesty

- `harness_fail_zero_claimed`: **false**
- `fake_browser_pass_claimed`: **false**
- `live_paid_provider_claimed`: **false**
- Did not auto-read `.env`. Did not mutate intake evidence.

## Isolation + proofs

| Phase | Marker / proof | Result |
|-------|----------------|--------|
| execute | `dev-US0139-execute-20260913T181500Z-fresh` / `20D1315FCA23127B2F9B960D64FEBE3B596528366237F0113E1E922D44AA70CB` | PASS MATCH not-STALE (ttl 19:15; consumed 18:55) |
| qa | `qa-US0139-qa-20260913T183500Z-fresh` / `8F63959E26C4B802F5A3DE8A8A0B5F34971ABCD03C3A6B9F3150C3AE727C3B72` | PASS MATCH not-STALE (ttl 19:35; consumed 18:55) |
| critic of qa | `critic-US0139-qa-20260913T184500Z-fresh` / `D687A4F80D9FB787BC2F38B85F2714DFF1ABBF69BC7D07B822D0740995AC1211` | PASS MATCH; 0 blocking; anti_slop=10; degraded_mode=false |
| verify-work | `qa-US0139-verify-20260913T185500Z-fresh` / `251DD21037AB0965502FCD3D3D4E4819FCB88CA1939BC1F222294EB2DA658D22` | PASS (this phase) |

## Next

Sovereign-critic of verify-work → **`/release`** (fresh **release**) for **`S0145`** / **`US-0139`**. STOP — do not spawn `/release` or `/execute` from this subagent. Do NOT mark US-0139 DONE. Do NOT tick acceptance.md. Do NOT reopen US-0138 / US-0137 / US-0136 / US-0135 / BUG-0020. Do NOT mutate US-0140+ or BUG-0021.
