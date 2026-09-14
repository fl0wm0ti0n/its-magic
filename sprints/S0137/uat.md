# Sprint S0137 — UAT (US-0133) — populated at /verify-work (DEC-0009)

- **uat_lifecycle**: populated (verify-work PASS; DEC-0009 qa_seeded → populated complete)
- **sprint_id**: S0137
- **story_id**: US-0133
- **phase**: verify-work (build+verify macro)
- **role**: qa (fresh per BUG-0006)
- **orchestrator_run_id**: auto-20260912-us0133
- **delivery_mode**: ultra_lean
- **macro_phase**: build+verify
- **story_type**: code (unpublished standalone Pi kernel / contract-test slice; FRAMEWORK_KIT_REPO=1)
- **fresh_context_marker**: `qa-US0133-verifywork-20260912T122000Z-fresh`
- **timestamp**: 2026-09-12T12:20:00Z (UTC)
- **model_id**: cursor-grok-4.6 (CROSS_MODEL_REVIEW=1 — required)
- **producer_phase_id**: qa (role=qa; **QA_PASS**; `blocking_count=0`)
- **critic_phase_id**: sovereign-critic of qa (tech-lead, composer-2.5-fast; PASS; anti_slop=10; marker `critic-US0133-qa-20260912T121500Z-fresh`)
- **verdict**: **PASS** (verify-work) — UAT 7/7 pass, 0 fail (AC-1..AC-6 → UAT-1..UAT-6 + canonical `convergence_smoke`); live pytest **5 passed** in 0.59s + standalone `npm test` **6 passed** in 2.70s (**10/10** `test_us0133_*`); kit omit-guard PASS
- **total_steps**: 7 (UAT-1..UAT-6 + canonical `convergence_smoke`)
- **passed**: 7 | **failed**: 0
- **story_status**: OPEN (do not mark US-0133 DONE — US-0045; acceptance US-0133 unchecked; intake JSON not mutated)
- **blocking_findings**: 0
- **non_blocking_findings**: 3 (NB1..NB3 critic carry-forwards — informational)
- **harness_fail_zero_claimed**: false (slice contract tests are the required evidence)
- **browser_probe_used**: false (no fake browser PASS)

## Probe class — unpublished standalone Pi kernel

US-0133 is a kit + unpublished `standalone/` workspace / contract-test slice. Applicable probe: `contract_tests_primary` (10 markers). User-facing validation: in-tree workspace behind owned `AgentKernel`; custom-tool-only production sessions; default empty resource loader; Phase 0 spike GO. No web UI. Six live-runtime classes waived with **`UAT_PROBE_FORBIDDEN`**. **No silent browser PASS.** MCP browser sequence not run. No live provider. No `.env`.

Canonical surrogate step `id=convergence_smoke` kept `result=pass` because `contract_test_failed=0` (10/10).

## Target story + acceptance criteria (architecture `# US-0133` A1)

- **US-0133** — Standalone repository and replaceable Pi kernel
  - **Primary** (`docs/product/acceptance.md`): workspace, adapter boundary, custom-tool-only sessions, resource isolation, and hard-proof spike (6 ACs). — **PASS** (verify-work); checkbox **unchecked**
  - AC-1: PASS — standalone workspace / CI / pins (UAT-1)
  - AC-2: PASS — AgentKernel + import boundary (UAT-2)
  - AC-3: PASS — custom-tool-only + abort (UAT-3)
  - AC-4: PASS — default resource isolation (UAT-4)
  - AC-5: PASS — contract tests (UAT-5)
  - AC-6: PASS — Phase 0 spike / no branding (UAT-6)

## UAT step results (verify-work)

| Step | AC | Result | Evidence |
|------|----|--------|----------|
| UAT-1 | AC-1 | pass | markers 1+3; typecheck/lint exit 0; CI Windows+Linux `working-directory: standalone`; kit `files` omit `standalone/` |
| UAT-2 | AC-2 | pass | markers 4+5; AgentKernel methods; no Pi imports outside `packages/pi-kernel` |
| UAT-3 | AC-3 | pass | markers 6+8; `noTools: "builtin"` + `itsm_ping`; abort idle |
| UAT-4 | AC-4 | pass | marker 7; empty loader even when trusted; planted fixture ignored |
| UAT-5 | AC-5 | pass | 10/10 `test_us0133_*`; event-bridge unit PASS |
| UAT-6 | AC-6 | pass | marker 10; spike GO 1/2/3/5; unpublished name; no OS-sandbox claim |
| convergence_smoke | surrogate | pass | `contract_test_failed=0`; 6 waived probes `UAT_PROBE_FORBIDDEN` |

## Contract test markers (10) — verify-work live re-run

`python -m pytest tests/us0133_contract_test.py -v` — **5 passed** in 0.59s.

`npm test` (cwd `standalone/`) — **6 passed** in 2.70s (fail 0). Combined **10/10** `test_us0133_*` at 2026-09-12T12:20:00Z.

1. `test_us0133_standalone_workspace_layout` — PASS
2. `test_us0133_kit_npm_files_omit_standalone` — PASS
3. `test_us0133_pi_packages_pinned_exact` — PASS
4. `test_us0133_agentkernel_methods` — PASS
5. `test_us0133_no_pi_imports_outside_pi_kernel` — PASS
6. `test_us0133_production_session_custom_tools_only` — PASS
7. `test_us0133_default_resource_loader_empty` — PASS
8. `test_us0133_session_id_stable_and_abort` — PASS
9. `test_us0133_audit_event_order_with_fake_model` — PASS
10. `test_us0133_phase0_spike_gng_no_branding` — PASS

## User-facing validation (this phase)

| Check | Result |
|-------|--------|
| Standalone workspace unpublished (surrogate) | **PASS** — `@its-magic/standalone` private; kit `files` omit `standalone/`; omit-guard exit 0 |
| Pi behind owned AgentKernel | **PASS** — methods present; Pi imports only inside `packages/pi-kernel` |
| Custom-tool-only + isolation | **PASS** — `itsm_ping` only; empty loader; planted extensions ignored |
| Spike GO without branding lock | **PASS** — items 1/2/3/5 GO; no OS-sandbox claim |

## Waived probes (honest live-runtime)

| Probe | reason_code |
|-------|-------------|
| browser_smoke | `UAT_PROBE_FORBIDDEN` (kit/workspace slice; no web UI) |
| api_health | `UAT_PROBE_FORBIDDEN` (no runtime HTTP API) |
| process_health | `UAT_PROBE_FORBIDDEN` (no runtime app server) |
| cli_smoke | `UAT_PROBE_FORBIDDEN` (CLI stub; no live provider) |
| build | `UAT_PROBE_FORBIDDEN` (typecheck/lint recorded as independent checks) |
| manual_operator | `UAT_PROBE_FORBIDDEN` (operator ticks remain /closure; no live provider host) |

## Isolation compliance gate (US-0048 / DEC-0029)

| Phase | Marker | Result |
|-------|--------|--------|
| execute | `dev-US0133-execute-20260912T113500Z-fresh` | PASS |
| qa | `qa-US0133-qa-20260912T121000Z-fresh` | PASS |
| verify-work | `qa-US0133-verifywork-20260912T122000Z-fresh` | PASS (this phase) |

## Runtime proofs (full `rp-auto-…` — not truncated `p-auto`)

| Phase | runtime_proof_id | proof_hash |
|-------|------------------|------------|
| execute | `rp-auto-20260912-us0133-execute-dev-20260912T120000Z-US-0133` | `7CCDCD239FCA9184792C4C63C9113F32EEE83AA639E0FAA1621190CF39B19EB0` (MATCH; ttl 13:00) |
| qa (consumed) | `rp-auto-20260912-us0133-qa-qa-20260912T121000Z-US-0133` | `0A9912547B61709D18F21711B278D2A42B426F90743818E8EA9F119A2F3CBB61` (MATCH; consumed 12:20 before ttl 13:10) |
| plan-verify | `rp-auto-20260912-us0133-plan-verify-qa-20260912T121000Z-US-0133` | `195D95BC3BC0BB9D8335D350E55AD1016BC61F73035AE50E34FAD66AD17F1517` |
| verify-work (issued) | `rp-auto-20260912-us0133-verify-work-qa-20260912T122000Z-US-0133` | `4CA5BD3BA33936863A0B8C4A9D089C64C140FA1E2FD51F6DF1E5C283D332BC57` |

## Results summary vs acceptance

| Bucket | Count |
|--------|-------|
| PASS | 7 |
| FAIL | 0 |
| Total steps | 7 |

All six acceptance criteria (AC-1..AC-6) map to UAT-1..UAT-6 and **PASS**. Canonical `convergence_smoke` **PASS**. Backlog Status remains **OPEN** (US-0045); acceptance US-0133 unchecked. Machine-readable: `sprints/S0137/uat.json`.

## Next

- Sovereign-critic of verify-work (if CROSS_MODEL_REVIEW=1) → **`/release`** (fresh **release**) for **`S0137`** / **`US-0133`**
- STOP — do not spawn `/release` from this subagent. Do NOT mark US-0133 DONE. Do NOT tick acceptance.
