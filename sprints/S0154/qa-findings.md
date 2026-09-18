# QA findings — US-0147 / S0154 / auto-20260917-us0146 (qa)

- **phase_id**: qa, **role**: qa, **story_id**: US-0147 (OPEN — not marked DONE per US-0045), **sprint_id**: S0154
- `orchestrator_run_id=auto-20260917-us0146`, `parent_run=auto-20260913-us0144`, `delivery_mode=ultra_lean`, `macro_phase=build+verify`
- `drain_story_index=2 of 3`, `backlog_drain_stories_remaining_budget=1`
- `AUTO_IMPLEMENTATION_LOOP=1` (no blocking findings — do not return to `/execute`)
- `AUTO_QUIET=1`
- `FRAMEWORK_KIT_REPO=1`
- `SECURITY_REVIEW=0`
- `model_id=inherit` (CROSS_MODEL_REVIEW=0)
- `producer_phase_id=execute`, `producer_role=dev`, `producer_model_id=inherit`
- `CROSS_MODEL_REVIEW=0` — no sovereign-critic of execute or qa this chain segment
- `cross_reviewer_findings.open_blocking_count=0`

- `fresh_context_marker=qa-US0147-qa-20260917T211000Z-fresh` (NEW per US-0048 / BUG-0006; not reused from execute `dev-US0147-execute-20260917T205500Z-fresh`)
- `timestamp (UTC)=2026-09-17T21:10:00Z` (wall-clock)
- **verdict: QA_PASS**
- `plan_verify_verdict=PASS` (ultra_lean deferred — `sprints/S0154/plan-verify.json` SKIPPED placeholder overwritten; 8/8 AC surjective in sprint-plan + DEC-0147 / R-0144 DQ1–DQ10 + ten `test_us0147_*`)
- `blocking_count=0`
- `non_blocking_count=0`
- `story_status=OPEN` (do not mark US-0147 DONE; intake JSON not mutated)
- `acceptance_US-0147=NOT ticked` (`docs/product/acceptance.md` row remains `- [ ] US-0147`)
- `backlog_ACs=NOT ticked` (verify-work/closure ownership)
- `intake_json=NOT mutated`
- FRAMEWORK_KIT_REPO=1 installer/adoption slice — **browser setup is explicit gate only**; **no live Chrome probed**; **no fake live-Chrome/browser PASS**
- `SECURITY_REVIEW=0`, `CROSS_REPO_OBSERVABILITY=0`, `COMPONENT_SCOPE_MODE=0`, `USER_GUIDE_MODE=0`, `SPEC_PACK_MODE=0`
- `sibling_boundary=US-0145/US-0148 OPEN out of scope; US-0133..US-0146 DONE compose-only; BUG-* not mutated; no kit cli.json/tui.json; no auto.md restore`

## Verdict rationale

Fresh QA independently remapped AC-1..AC-8 against architecture `# US-0147` A1 (triple-installer parity + template `.its-magic/standalone/` mirror + `bootstrap_standalone_runtime_installer_hook` + adoption classifier + kernel preflight + `runtime-metadata.json` + explicit `itsm setup browser`; ten hermetic `test_us0147_*`) + `DEC-0147` + `R-0144` DQ1–DQ10 + `tasks.md`, treated ultra_lean deferred `plan-verify.json` SKIPPED placeholder as **PASS** (8/8 AC surjective), re-ran pytest `tests/us0147_contract_test.py` (**10/10** `test_us0147_*`, 0.13s), re-ran full standalone `npm test` (**140 passed**, fail 0, duration_ms 3235.5157), confirmed installer lib + manifest + template mirror surfaces, metadata checker exit 0, triad pre-write exit 0, and independently recomputed execute proof hash **MATCH** before TTL (`2026-09-17T21:55:00Z`). Blocking findings: **none**. US-0147 remains OPEN; acceptance.md unchecked. POLICY_QA_SILENT_FIX held. **Live Chrome was not probed.**

## Test plan

| # | Check | Expected |
|---|---|---|
| 1 | Independent AC-1..AC-8 remap vs A1 + DEC-0147 + tasks | Each AC ≥1 task; primary acceptance covered |
| 2 | Ultra_lean deferred `sprints/S0154/plan-verify.json` | SKIPPED placeholder → PASS if 8/8 surjective + 10 markers |
| 3 | pytest `tests/us0147_contract_test.py` | 10/10 `test_us0147_*` PASS |
| 4 | full standalone `npm test` | 140/140 PASS (compose regression) |
| 5 | Triple-installer hook + adoption + rollback + kernel preflight | held per contract markers |
| 6 | Execute DEC-0038 proof consume | MATCH before TTL |
| 7 | Status OPEN; acceptance unchecked; backlog ACs unchecked | unchanged |
| 8 | UAT probes | `probe_kind=contract_tests_primary`; live browser `UAT_PROBE_FORBIDDEN` |
| 9 | Emit `convergence_smoke` when `contract_test_failed=0` | present, `result=pass` |

## Independent checks (this qa subagent)

| Check | Command / method | Result |
|---|---|---|
| Execute proof SHA-256 | `compute_strict_proof_hash` 6-field tuple | **MATCH** `4130FD8893FD5035C4A1927F18B4BA0D0026C35CA31D22F08E183D7E9A10EB4A`; ttl `2026-09-17T21:55:00Z`; consumed_at `2026-09-17T21:10:00Z` — **RUNTIME_PROOF_VALID** (not STALE) |
| Pytest contract | `python -m pytest tests/us0147_contract_test.py -v` | **10 passed** in 0.13s |
| Standalone contract + unit | `npm test` in `standalone/` | **140 passed** fail 0 duration_ms 3235.5157 |
| Metadata | `python scripts/check-user-visible-metadata.py --repo .` | **exit 0** |
| Triad pre-write | `python scripts/enforce-triad-hot-surface.py --check` | **PASS** (exit 0) |
| Installer lib + manifest | `scripts/standalone_runtime_install_lib.py`, `installer-owned-paths.manifest` | **present** |
| Triple installers | `installer.py`, `installer.ps1`, `installer.sh` hook wiring | **present** (spot-check via tests) |
| Template mirror | `template/.its-magic/standalone/` | **present** (spot-check via tests) |
| DEC-0147 Accepted + R-0144 LOCKED | decisions + research anchors | **held** (not mutated this pass) |
| Backlog / acceptance | Status + checkbox spot-check | OPEN; acceptance `- [ ] US-0147`; AC-1..AC-8 **unchecked** |
| No `.env` / no live paid CI / no live Chrome | this pass | **held** |
| POLICY_QA_SILENT_FIX | no production source patch | **held** |

## Blocking findings

None.

## Non-blocking findings

None (CROSS_MODEL_REVIEW=0 — no execute-critic NB carry-forward).

## AC remap (independent — files + tests vs A1 / DEC-0147)

| AC | Delivered surface | Task(s) / markers | Result |
|---|---|---|---|
| AC-1 install/update Win+Linux | triple installers + hook + staging rollback | T-001, T-002, T-005, T-008, T-011 | **PASS** |
| AC-2 fresh init skeleton | fresh-init without backlog clone | T-004, T-011 (`test_us0147_fresh_install_manifest_parity`) | **PASS** |
| AC-3 adopt existing repos | `classifyProjectAdoptionProfile` + partial markers | T-003, T-011 (adopt_* tests) | **PASS** |
| AC-4 host coexistence | cursor/opencode/both adopt paths | T-003, T-011 | **PASS** |
| AC-5 deny_overwrite preservation | upgrade + uninstall preservation tests | T-004, T-005, T-011 | **PASS** |
| AC-6 diagnostics / kernel mismatch | kernel preflight fail-closed | T-006, T-011 (`test_us0147_kernel_mismatch_fail_closed`) | **PASS** |
| AC-7 operator docs | runbook sections | T-010, T-011 (`test_us0147_runbook_sections_present`) | **PASS** |
| AC-8 lifecycle tests | install/upgrade/adoption/rollback/uninstall matrix | T-011 (full pytest suite) | **PASS** |

**Overall AC gate**: **PASS** (slice) — Status remains OPEN; `docs/product/acceptance.md` US-0147 **unchecked** (closure ownership).

## Contract marker results (10/10)

| # | Marker | Harness | Result |
|---|---|---|---|
| 1 | `test_us0147_fresh_install_manifest_parity` | pytest | PASS |
| 2 | `test_us0147_upgrade_preserves_user_layers` | pytest | PASS |
| 3 | `test_us0147_adopt_cursor_only_repo` | pytest | PASS |
| 4 | `test_us0147_adopt_opencode_only_repo` | pytest | PASS |
| 5 | `test_us0147_adopt_both_hosts_repo` | pytest | PASS |
| 6 | `test_us0147_interrupted_update_rollback` | pytest | PASS |
| 7 | `test_us0147_kernel_mismatch_fail_closed` | pytest | PASS |
| 8 | `test_us0147_browser_setup_explicit_gate` | pytest | PASS |
| 9 | `test_us0147_uninstall_preserves_hosts` | pytest | PASS |
| 10 | `test_us0147_runbook_sections_present` | pytest | PASS |

## Compose / scope gates

| Gate | Result |
|---|---|
| A1 LOCKED (triple-installer + template mirror + adoption classifier) | HELD |
| Explicit `itsm setup browser` gate (no silent browser install) | HELD |
| US-0146 operator slice compose-only (no rewrite) | HELD |
| Fake-model CI / contract hermetic; no live paid CI; no required live Chrome | HELD |
| DEC-0038 `compute_strict_proof_hash` tuple UNAMENDED | HELD |
| US-0145/US-0148 OUT; US-0133..US-0146 DONE compose-only | HELD |
| US-0045 Status OPEN; acceptance.md unchecked; backlog ACs unchecked | HELD |
| Exactly ten `test_us0147_*` markers | HELD |
| No `.env` read / no intake JSON mutation / no POLICY_QA_SILENT_FIX production patch / auto.md not restored / no kit cli.json or tui.json | HELD |
| `harness_fail_zero_claimed=false`; `fake_browser_pass_claimed=false`; `live_chrome_probed=false` | HELD |

## UAT / convergence (US-0128)

- Contract slice green (`contract_test_failed=0`); 10/10 markers; kit omit held.
- Canonical `convergence_smoke` recorded as **pass** in `sprints/S0154/uat.json`.
- Six live-runtime probe classes waived `UAT_PROBE_FORBIDDEN` (FRAMEWORK_KIT_REPO=1; installer/adoption slice; **live Chrome not probed**).
- Full UAT ownership remains with `/verify-work` (do not flip DONE).
- **No fake live-Chrome/browser PASS.**

## UAT probes (FRAMEWORK_KIT_REPO=1 — honest classification)

Applicable probe class: **`contract_tests_primary`**. Live browser: **`UAT_PROBE_FORBIDDEN`**.

| Probe class | Classification | reason_code |
|---|---|---|
| `browser_smoke` | not probed | `UAT_PROBE_FORBIDDEN` |
| `api_health` | waived | `UAT_PROBE_FORBIDDEN` |
| `process_health` | waived | `UAT_PROBE_FORBIDDEN` |
| `cli_smoke` | waived (contract tests) | `UAT_PROBE_FORBIDDEN` |
| `build` | waived (standalone tests recorded independently) | `UAT_PROBE_FORBIDDEN` |
| `manual_operator` | deferred to verify-work | `UAT_PROBE_FORBIDDEN` |

**Runtime browser evidence**: none. MCP `browser_navigate` **not run**.

## Runtime QA evidence (US-0065) — kit installer slice

- `runtime_startup_command`: n/a (contract tests; no live app server this phase)
- `runtime_stack_profile`: python + node (pytest + standalone workspace)
- `runtime_mode`: local
- `runtime_health_target`: n/a
- `runtime_health_result`: not_applicable
- `runtime_log_summary`: n/a
- `runtime_retry_count`: 0
- `runtime_retry_ledger`: []
- `runtime_final_verdict`: pass
- `runtime_reason_code`: `UAT_PROBE_FORBIDDEN` for live-runtime probes; slice health is contract tests + `convergence_smoke`
- `runtime_evidence_refs`: pytest 10/10; `sprints/S0154/uat.json` `convergence_smoke`

## Generated-test evidence (US-0066)

- `generated_test_stack_profile`: python + node
- `generated_test_command`: `python -m pytest tests/us0147_contract_test.py`; `cd standalone && npm test`
- `generated_test_result`: pass
- `generated_test_output_ref`: this file § Independent checks (pytest 10 passed 0.13s; npm 140 passed duration_ms 3235.5157)
- `generated_test_paths_ref`: `tests/us0147_contract_test.py`; `standalone/tests/contract/*.test.ts`
- `generated_test_reason_code`: none (pass)

## Status confirmation (US-0045)

- backlog `## US-0147` Status: **OPEN**
- acceptance US-0147: **unchecked**
- AC-1..AC-8: **unchecked** (verify-work/closure)
- US-0133..US-0146: **DONE** (not reopened)
- US-0145/US-0148+: **OPEN** (not mutated)
- BUG-*: not mutated

## Producer proof consumed (execute)

- `producer_runtime_proof_id=rp-auto-20260917-us0146-execute-dev-20260917T205500Z-US-0147`
- Canonical hashed payload: `{"orchestrator_run_id":"auto-20260917-us0146","phase_id":"execute","proof_issued_at":"2026-09-17T20:55:00Z","proof_ttl_seconds":3600,"role":"dev","runtime_proof_id":"rp-auto-20260917-us0146-execute-dev-20260917T205500Z-US-0147"}`
- `producer_attested_proof_hash=4130FD8893FD5035C4A1927F18B4BA0D0026C35CA31D22F08E183D7E9A10EB4A`
- Independent `compute_strict_proof_hash` recompute: **MATCH**
- `producer_proof_ttl=2026-09-17T21:55:00Z`, `consumed_at=2026-09-17T21:10:00Z` (before RUNTIME_PROOF_STALE)
- `producer_ttl_stale=false`
- `producer_fresh_context_marker=dev-US0147-execute-20260917T205500Z-fresh`

## Strict runtime proof (DEC-0038) — qa

- `orchestrator_run_id=auto-20260917-us0146`
- `runtime_proof_id=rp-auto-20260917-us0146-qa-qa-20260917T211000Z-US-0147`
- `phase_id=qa`, `role=qa`, `story_id=US-0147`, `sprint_id=S0154`
- `proof_issued_at=2026-09-17T21:10:00Z`
- `proof_ttl_seconds=3600`, `proof_ttl=2026-09-17T22:10:00Z`
- `proof_hash=7E4E7E06144D91A7AAF7575922B9BB89E764465E12DCEEFC002B781B9096272E`
- Canonical payload: `{"orchestrator_run_id":"auto-20260917-us0146","phase_id":"qa","proof_issued_at":"2026-09-17T21:10:00Z","proof_ttl_seconds":3600,"role":"qa","runtime_proof_id":"rp-auto-20260917-us0146-qa-qa-20260917T211000Z-US-0147"}`
- `hash_recompute_confirmation=true`

## Strict runtime proof (DEC-0038) — plan-verify (ultra_lean merged)

- `runtime_proof_id=rp-auto-20260917-us0146-plan-verify-qa-20260917T211000Z-US-0147`
- `phase_id=plan-verify`, `role=qa`
- `proof_issued_at=2026-09-17T21:10:00Z`, `proof_ttl=2026-09-17T22:10:00Z`
- `proof_hash=A4A8AC207D43E2C72383A1F0DE96364E04DFE687D98EE590ED1A922BCBA7A8FC`
- Canonical payload: `{"orchestrator_run_id":"auto-20260917-us0146","phase_id":"plan-verify","proof_issued_at":"2026-09-17T21:10:00Z","proof_ttl_seconds":3600,"role":"qa","runtime_proof_id":"rp-auto-20260917-us0146-plan-verify-qa-20260917T211000Z-US-0147"}`

## Isolation evidence (US-0048 / DEC-0029 / US-0104 v2)

- `phase_id=qa`, `role=qa`, `model_id=inherit` (CROSS_MODEL_REVIEW=0)
- `fresh_context_marker=qa-US0147-qa-20260917T211000Z-fresh` (NEW per US-0048 / BUG-0006)
- `timestamp=2026-09-17T21:10:00Z` (UTC wall-clock)
- `evidence_ref=sprints/S0154/qa-findings.md; sprints/S0154/plan-verify.json; sprints/S0154/uat.json`
- Fresh qa subagent per BUG-0006; no `/verify-work` or `/execute` spawn from this subagent.

## Next scheduled phase

- `next_scheduled_phase=/verify-work` (fresh qa subagent per BUG-0006 — orchestrator-owned)
- `next_scheduled_role=qa`
- `stop_condition=STOP after qa PASS. Do NOT mark US-0147 DONE. Do NOT tick acceptance. Do NOT npm-publish. Do NOT git push.`
