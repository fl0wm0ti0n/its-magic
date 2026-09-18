# QA findings — BUG-0025 / S0157 / auto-20260918-bug0025 (qa)

- **phase_id**: qa, **role**: qa, **bug_id**: BUG-0025 (OPEN — not marked DONE per US-0045), **story_id**: (none), **sprint_id**: S0157
- `orchestrator_run_id=auto-20260918-bug0025`, `parent_run=cursor-20260918-BUG0025-intake`, `delivery_mode=ultra_lean`, `macro_phase=build+verify`
- `segment_work_item_kind=bug`, `bug_queue_position=1 of 1`
- `AUTO_IMPLEMENTATION_LOOP=1` (no blocking findings — do not return to `/execute`)
- `AUTO_QUIET=1`
- `FRAMEWORK_KIT_REPO=1`
- `SECURITY_REVIEW=0` (skip — flag not 1)
- `model_id=omit` (CROSS_MODEL_REVIEW=0)
- `producer_phase_id=execute`, `producer_role=dev`, `producer_model_id=omit`
- `CROSS_MODEL_REVIEW=0` — no sovereign-critic of execute or qa this chain segment
- `cross_reviewer_findings.open_blocking_count=0`

- `fresh_context_marker=qa-BUG0025-qa-20260918T172625Z-fresh` (NEW per US-0048 / BUG-0006; not reused from execute `dev-BUG0025-execute-20260918T171834Z-fresh`)
- `timestamp (UTC)=2026-09-18T17:26:25Z` (wall-clock)
- **verdict: QA_PASS**
- `plan_verify_verdict=PASS` (ultra_lean deferred — `sprints/S0157/plan-verify.json` merged at /qa; 8/8 AC surjective in sprint-plan + architecture `# BUG-0025` / R-0149 DQ1–DQ10 + six `test_bug0025_*`)
- `blocking_count=0`
- `non_blocking_count=1` (full `TEST_COMMAND` Fail:28 OOS pre-existing; slice contract green)
- `story_status=OPEN` (do not mark BUG-0025 DONE; intake JSON not mutated)
- `acceptance_BUG-0025=NOT ticked` (`docs/product/acceptance.md` row remains `- [ ] BUG-0025`)
- `backlog_ACs=NOT ticked` (verify-work/closure ownership)
- `intake_json=NOT mutated` (`handoffs/intake_evidence/BUG-0025-intake-20260918T154800Z.json` read-only)
- Packaging / contract-test slice — **no live npm publish / git push / live Chrome**; **no fake live-publish PASS**
- `SECURITY_REVIEW=0`, `CROSS_REPO_OBSERVABILITY=0`, `COMPONENT_SCOPE_MODE=0`, `USER_GUIDE_MODE=0`, `SPEC_PACK_MODE=0`
- `sibling_boundary=US-0147 DONE compose-only; US-0133 omit-standalone/ held; BUG-0022/0024 OPEN untouched; kit version 0.1.4; T-009 publish deferred to /release confirm`

## Verdict rationale

Fresh QA independently remapped AC-1..AC-8 against architecture `# BUG-0025` A1 (`package.json` `files` entry `scripts/standalone_runtime_install_lib.py` + isfile-before-exec → `STANDALONE_BOOTSTRAP_FAILED` + `tests/bug0025_packaging_contract_test.py` six markers + guard allowlist + patch `0.1.4`) + `R-0149` DQ1–DQ10 + `tasks.md`, treated ultra_lean deferred plan-verify as **PASS** (8/8 AC surjective), re-ran pytest bug0025 (**6/6**), us0147 (**10/10**), us0133 (**5/5**), bug0003 completeness (**6/6**), bug0017 scoped (**6**), metadata/triad/guard exit 0, and independently recomputed execute proof hash **MATCH** before TTL (`2026-09-18T18:18:34Z`). Blocking findings: **none**. T-009 npm republish remains **deferred** to `/release` confirm (non-blocking). BUG-0025 remains OPEN; acceptance.md unchecked. POLICY_QA_SILENT_FIX held.

## Test plan

| # | Check | Expected |
|---|---|---|
| 1 | Independent AC-1..AC-8 remap vs A1 + tasks | Each AC ≥1 task; primary acceptance covered |
| 2 | Ultra_lean `sprints/S0157/plan-verify.json` merged at /qa | PASS if 8/8 surjective + 6 markers |
| 3 | pytest `tests/bug0025_packaging_contract_test.py` | 6/6 `test_bug0025_*` PASS |
| 4 | Compose: us0147 / us0133 / bug0003 / bug0017 | green |
| 5 | Execute DEC-0038 proof consume | MATCH before TTL |
| 6 | Status OPEN; acceptance unchecked; backlog ACs unchecked | unchanged |
| 7 | UAT probes | `probe_kind=contract_tests_primary`; live probes `UAT_PROBE_FORBIDDEN` |
| 8 | Emit `convergence_smoke` when `contract_test_failed=0` | present, `result=pass` |
| 9 | T-009 publish disposition | deferred confirm documented (not silent PASS as published) |

## Independent checks (this qa subagent)

| Check | Command / method | Result |
|---|---|---|
| Execute proof SHA-256 | `compute_strict_proof_hash` 6-field tuple | **MATCH** `3E2A70F4BCD3A7E352D6E5E9D6E4A949D12E3D6E95CB39C2B3F99ECFB6B9CE4D`; ttl `2026-09-18T18:18:34Z`; consumed_at `2026-09-18T17:26:25Z` — **RUNTIME_PROOF_VALID** (not STALE) |
| Pytest bug0025 | `python -m pytest tests/bug0025_packaging_contract_test.py -v` | **6 passed** in 2.23s |
| Compose us0147+us0133+bug0003 | pytest batch | **27 passed** in 15.33s (6+10+5+6) |
| Compose bug0017 scoped | `pytest tests/ -k "bug0001 or us0084 or bug0017" --ignore=template` | **6 passed**, 586 deselected |
| Metadata | `python scripts/check-user-visible-metadata.py --repo .` | **exit 0** |
| Triad | `python scripts/enforce-triad-hot-surface.py --check` | **PASS** (exit 0; rollover if required post-append) |
| Guard | `python scripts/guard_installer_publish.py` | **exit 0** (dash -n skipped; Python checks enforced) |
| Full TEST_COMMAND | `tests/run-tests.ps1` | exit 1 — **Fail:28** OOS pre-existing (US-0135, BUG-0009/0010 archival, parity scopes, …); **no bug0025 FAIL** |
| Backlog / acceptance | Status + checkbox spot-check | OPEN; acceptance `- [ ] BUG-0025`; AC-1..AC-8 **unchecked**; BUG-0022/0024 OPEN |
| No `.env` / no intake mutation / no silent publish | this pass | **held** |
| POLICY_QA_SILENT_FIX | no production source patch | **held** |

## Blocking findings

None.

## Non-blocking findings

1. **TEST_COMMAND_OOS_PREEXISTING** — Full harness `tests/report.md` Pass:843 Fail:28. Failures are outside BUG-0025 packaging scope (e.g. US-0135 kit contract, BUG-0009/0010 archival linkage, readme-feature-coverage / intake parity scopes). Slice contract markers green; does not block QA_PASS for this packaging bug. Push eligibility remains gated until OOS failures are addressed separately.

## Deferred (not a QA blocker)

- **T-009 republish** — `RELEASE_PUBLISH_MODE=confirm` / `RELEASE_PUBLISH_AUTO_CONFIRM=0`; dry-run only at execute; `npm_published=false`. `/release` must obtain operator confirm before publishing `its-magic@0.1.4`.

## AC remap (independent — files + tests vs A1 / R-0149)

| AC | Delivered surface | Task(s) / markers | Result |
|---|---|---|---|
| AC-1 npm tarball includes lib | `npm pack` contract + files entry | T-001, T-005 (`test_bug0025_npm_pack_*`) | **PASS** |
| AC-2 files allowlist | `package.json` files string | T-001 (`test_bug0025_package_json_files_*`) | **PASS** |
| AC-3 fail-closed loader | isfile-before-exec → STANDALONE_BOOTSTRAP_FAILED | T-002, T-003 (load/wrapper markers) | **PASS** |
| AC-4 bootstrap present/absent | wrapper + supported-range residual | T-002, T-003, T-004 | **PASS** |
| AC-5 pack + guard contract | bug0025 markers + guard assert | T-005, T-006 | **PASS** |
| AC-6 republish ships fix | version 0.1.4 + notes; **npm publish deferred** | T-007, T-008, T-009 (confirm path) | **PASS** (slice; publish deferred to `/release`) |
| AC-7 US-0147 compose-only | us0147 call-site marker + suite | T-010, T-anch | **PASS** |
| AC-8 distinct BUG-0022/0024 | T-anch / backlog spot-check | T-anch | **PASS** |

**Overall AC gate**: **PASS** (slice) — Status remains OPEN; `docs/product/acceptance.md` BUG-0025 **unchecked** (closure ownership).

## Contract marker results (6/6)

| # | Marker | Harness | Result |
|---|---|---|---|
| 1 | `test_bug0025_package_json_files_lists_standalone_runtime_install_lib` | pytest | PASS |
| 2 | `test_bug0025_npm_pack_includes_standalone_runtime_install_lib` | pytest | PASS |
| 3 | `test_bug0025_load_missing_lib_emits_standalone_bootstrap_failed` | pytest | PASS |
| 4 | `test_bug0025_bootstrap_wrapper_no_raw_filenotfound_traceback` | pytest | PASS |
| 5 | `test_bug0025_guard_installer_publish_requires_allowlist_entry` | pytest | PASS |
| 6 | `test_bug0025_us0147_compose_hook_call_sites_unchanged` | pytest | PASS |

## Compose / scope gates

| Gate | Result |
|---|---|
| A1 LOCKED (files entry + fail-closed loader + pack contract + patch 0.1.4) | HELD |
| US-0133 omit-`standalone/` in files | HELD |
| US-0147 DONE compose-only (no AC reopen) | HELD |
| BUG-0022 / BUG-0024 OPEN not drained | HELD |
| DEC-0038 `compute_strict_proof_hash` tuple UNAMENDED | HELD |
| US-0045 Status OPEN; acceptance.md unchecked; backlog ACs unchecked | HELD |
| Exactly six `test_bug0025_*` markers | HELD |
| No `.env` read / no intake JSON mutation / no POLICY_QA_SILENT_FIX / no silent npm publish / no git push | HELD |
| `harness_fail_zero_claimed=false`; `fake_browser_pass_claimed=false`; `live_chrome_probed=false`; `npm_published=false` | HELD |

## UAT / convergence (US-0128)

- Contract slice green (`contract_test_failed=0`); 6/6 markers; kit omit held.
- Canonical `convergence_smoke` recorded as **pass** in `sprints/S0157/uat.json`.
- Six live-runtime probe classes waived `UAT_PROBE_FORBIDDEN` (FRAMEWORK_KIT_REPO=1; packaging/contract slice; **live Chrome / live npm publish not probed**).
- Full UAT ownership remains with `/verify-work` (do not flip DONE).
- **No fake live-publish / browser PASS.**

## UAT probes (FRAMEWORK_KIT_REPO=1 — honest classification)

Applicable probe class: **`contract_tests_primary`**. Live browser/publish: **`UAT_PROBE_FORBIDDEN`**.

| Probe class | Classification | reason_code |
|---|---|---|
| `browser_smoke` | not probed | `UAT_PROBE_FORBIDDEN` |
| `api_health` | waived | `UAT_PROBE_FORBIDDEN` |
| `process_health` | waived | `UAT_PROBE_FORBIDDEN` |
| `cli_smoke` | waived (contract tests) | `UAT_PROBE_FORBIDDEN` |
| `build` | waived (pack/contract recorded independently) | `UAT_PROBE_FORBIDDEN` |
| `manual_operator` | deferred to verify-work/release | `UAT_PROBE_FORBIDDEN` |

**Runtime browser evidence**: none. MCP `browser_navigate` **not run**.

## Runtime QA evidence (US-0065) — kit packaging slice

- `runtime_startup_command`: n/a (contract tests; no live app server this phase)
- `runtime_stack_profile`: python (pytest packaging/contract)
- `runtime_mode`: local
- `runtime_health_target`: n/a
- `runtime_health_result`: not_applicable
- `runtime_log_summary`: n/a
- `runtime_retry_count`: 0
- `runtime_retry_ledger`: []
- `runtime_final_verdict`: pass
- `runtime_reason_code`: `UAT_PROBE_FORBIDDEN` for live-runtime probes; slice health is contract tests + `convergence_smoke`
- `runtime_evidence_refs`: pytest bug0025 6/6; `sprints/S0157/uat.json` `convergence_smoke`

## Generated-test evidence (US-0066)

- `generated_test_stack_profile`: python
- `generated_test_command`: `python -m pytest tests/bug0025_packaging_contract_test.py` (+ compose batch)
- `generated_test_result`: pass
- `generated_test_output_ref`: this file § Independent checks (bug0025 6 passed 2.23s; compose 27+6)
- `generated_test_paths_ref`: `tests/bug0025_packaging_contract_test.py`
- `generated_test_reason_code`: none (pass)

## Status confirmation (US-0045)

- backlog `### BUG-0025` Status: **OPEN**
- acceptance BUG-0025: **unchecked**
- AC-1..AC-8: **unchecked** (verify-work/closure)
- BUG-0022 / BUG-0024: **OPEN** (not mutated)
- US-0147: **DONE** (not reopened)
- intake evidence: **not mutated**

## Producer proof consumed (execute)

- `producer_runtime_proof_id=rp-auto-20260918-bug0025-execute-dev-20260918T171834Z-BUG-0025`
- Canonical hashed payload: `{"orchestrator_run_id":"auto-20260918-bug0025","phase_id":"execute","proof_issued_at":"2026-09-18T17:18:34Z","proof_ttl_seconds":3600,"role":"dev","runtime_proof_id":"rp-auto-20260918-bug0025-execute-dev-20260918T171834Z-BUG-0025"}`
- `producer_attested_proof_hash=3E2A70F4BCD3A7E352D6E5E9D6E4A949D12E3D6E95CB39C2B3F99ECFB6B9CE4D`
- Independent `compute_strict_proof_hash` recompute: **MATCH**
- `producer_proof_ttl=2026-09-18T18:18:34Z`, `consumed_at=2026-09-18T17:26:25Z` (before RUNTIME_PROOF_STALE)
- `producer_ttl_stale=false`
- `producer_fresh_context_marker=dev-BUG0025-execute-20260918T171834Z-fresh`

## Strict runtime proof (DEC-0038) — qa

- `orchestrator_run_id=auto-20260918-bug0025`
- `runtime_proof_id=rp-auto-20260918-bug0025-qa-qa-20260918T172625Z-BUG-0025`
- `phase_id=qa`, `role=qa`, `bug_id=BUG-0025`, `sprint_id=S0157`
- `proof_issued_at=2026-09-18T17:26:25Z`
- `proof_ttl_seconds=3600`, `proof_ttl=2026-09-18T18:26:25Z`
- `proof_hash=E92C5B23F279866F63FB19BFFA9028578543BCABB7E359420DE93DD218F72D00`
- Canonical payload: `{"orchestrator_run_id":"auto-20260918-bug0025","phase_id":"qa","proof_issued_at":"2026-09-18T17:26:25Z","proof_ttl_seconds":3600,"role":"qa","runtime_proof_id":"rp-auto-20260918-bug0025-qa-qa-20260918T172625Z-BUG-0025"}`
- `hash_recompute_confirmation=true`

## Strict runtime proof (DEC-0038) — plan-verify (ultra_lean merged)

- `runtime_proof_id=rp-auto-20260918-bug0025-plan-verify-qa-20260918T172625Z-BUG-0025`
- `phase_id=plan-verify`, `role=qa`
- `proof_issued_at=2026-09-18T17:26:25Z`, `proof_ttl=2026-09-18T18:26:25Z`
- `proof_hash=81FFCBA2FF68A9C861F8A883E5EE0CA3E7247068F37DCEC9DC2F39F23CC003B7`
- Canonical payload: `{"orchestrator_run_id":"auto-20260918-bug0025","phase_id":"plan-verify","proof_issued_at":"2026-09-18T17:26:25Z","proof_ttl_seconds":3600,"role":"qa","runtime_proof_id":"rp-auto-20260918-bug0025-plan-verify-qa-20260918T172625Z-BUG-0025"}`

## Isolation evidence (US-0048 / DEC-0029 / US-0104 v2)

- `phase_id=qa`, `role=qa`, `model_id=omit` (CROSS_MODEL_REVIEW=0)
- `fresh_context_marker=qa-BUG0025-qa-20260918T172625Z-fresh` (NEW per US-0048 / BUG-0006)
- `timestamp=2026-09-18T17:26:25Z` (UTC wall-clock)
- `evidence_ref=sprints/S0157/qa-findings.md; sprints/S0157/plan-verify.json; sprints/S0157/uat.json`
- Fresh qa subagent per BUG-0006; no `/verify-work` or `/execute` spawn from this subagent.

## Next scheduled phase

- `next_scheduled_phase=/verify-work` (fresh qa subagent per BUG-0006 — orchestrator-owned)
- `next_scheduled_role=qa`
- `stop_condition=STOP after qa PASS. Do NOT mark BUG-0025 DONE. Do NOT tick acceptance. Do NOT npm-publish without /release confirm. Do NOT git push.`
