# QA findings — US-0146 / S0153 / auto-20260917-us0146 (qa)

- **phase_id**: qa, **role**: qa, **story_id**: US-0146 (OPEN — not marked DONE per US-0045), **sprint_id**: S0153
- `orchestrator_run_id=auto-20260917-us0146`, `parent_run=auto-20260913-us0144`, `delivery_mode=ultra_lean`, `macro_phase=build+verify`
- `AUTO_IMPLEMENTATION_LOOP=1` (no blocking findings — do not return to `/execute`)
- `AUTO_QUIET=1`
- `FRAMEWORK_KIT_REPO=1`
- `SECURITY_REVIEW=0`
- `model_id=inherit` (CROSS_MODEL_REVIEW=0)
- `producer_phase_id=execute`, `producer_role=dev`, `producer_model_id=inherit`
- `CROSS_MODEL_REVIEW=0` — no sovereign-critic of execute or qa this chain segment
- `cross_reviewer_findings.open_blocking_count=0`

- `fresh_context_marker=qa-US0146-qa-20260917T193000Z-fresh` (NEW per US-0048 / BUG-0006; not reused from execute `dev-US0146-execute-20260917T191500Z-fresh`)
- `timestamp (UTC)=2026-09-17T19:30:00Z` (wall-clock)
- **verdict: QA_PASS**
- `plan_verify_verdict=PASS` (ultra_lean deferred — `sprints/S0153/plan-verify.json` SKIPPED placeholder overwritten; 8/8 AC surjective in sprint-plan + DEC-0146 / R-0143 DQ1–DQ10 + nine `test_us0146_*`)
- `blocking_count=0`
- `non_blocking_count=0`
- `story_status=OPEN` (do not mark US-0146 DONE; intake JSON not mutated)
- `acceptance_US-0146=NOT ticked` (`docs/product/acceptance.md` row remains `- [ ] US-0146`)
- `backlog_ACs=NOT ticked` (verify-work/closure ownership)
- `intake_json=NOT mutated`
- FRAMEWORK_KIT_REPO=1 / unpublished in-tree `standalone/` operator slice — **not browser-owned**; **no live Chrome probed**; **no fake live-Chrome/browser PASS**
- `SECURITY_REVIEW=0`, `CROSS_REPO_OBSERVABILITY=0`, `COMPONENT_SCOPE_MODE=0`, `USER_GUIDE_MODE=0`, `SPEC_PACK_MODE=0`
- `sibling_boundary=US-0145..US-0148 OPEN out of scope; US-0133..US-0144 DONE compose-only; BUG-* not mutated; no kit cli.json/tui.json; no auto.md restore`

## Verdict rationale

Fresh QA independently remapped AC-1..AC-8 against architecture `# US-0146` A1 (sibling `@its-magic/cli` + `@its-magic/tui` thin clients of `runtime-core/src/operator/` facades; Pi only on `auth`/`models`; nine `test_us0146_*`; log cap 200 lines / 32 KiB; in-process `OperatorSession`) + `DEC-0146` + `R-0143` DQ1–DQ10 + `tasks.md`, treated ultra_lean deferred `plan-verify.json` SKIPPED placeholder as **PASS** (8/8 AC surjective), re-ran scoped standalone `node --experimental-strip-types --test tests/contract/us0146.contract.test.ts` (**10 passed** incl. marker inventory, **9/9** `test_us0146_*`, fail 0, duration_ms 420.8343), re-ran full standalone `npm test` (**140 passed**, fail 0, duration_ms 3281.7135), confirmed operator module surfaces (`OperatorCommandFacade`, `OperatorObservabilityService`, `OperatorPrompts`, `OperatorSession`, `bounded-log`), metadata checker exit 0, triad pre-write exit 0, and independently recomputed execute proof hash **MATCH** before TTL (`2026-09-17T20:15:00Z`). Blocking findings: **none**. US-0146 remains OPEN; acceptance.md unchecked. POLICY_QA_SILENT_FIX held. **Live Chrome was not probed.**

## Test plan

| # | Check | Expected |
|---|---|---|
| 1 | Independent AC-1..AC-8 remap vs A1 + DEC-0146 + tasks | Each AC ≥1 task; primary acceptance covered |
| 2 | Ultra_lean deferred `sprints/S0153/plan-verify.json` | SKIPPED placeholder → PASS if 8/8 surjective + 9 markers |
| 3 | scoped standalone `us0146.contract.test.ts` | 9/9 `test_us0146_*` PASS |
| 4 | full standalone `npm test` | 140/140 PASS (compose regression) |
| 5 | Pi boundary (`auth`/`models` only) + TUI client-only | held per contract markers |
| 6 | Execute DEC-0038 proof consume | MATCH before TTL |
| 7 | Status OPEN; acceptance unchecked; backlog ACs unchecked | unchanged |
| 8 | UAT probes | `probe_kind=contract_tests_primary`; live browser `UAT_PROBE_FORBIDDEN` |
| 9 | Emit `convergence_smoke` when `contract_test_failed=0` | present, `result=pass` |

## Independent checks (this qa subagent)

| Check | Command / method | Result |
|---|---|---|
| Execute proof SHA-256 | `compute_strict_proof_hash` 6-field tuple | **MATCH** `BD51976EB4FA13C40374644DDA75183AEE6352E292FE86584A09AFAB2C8298F0`; ttl `2026-09-17T20:15:00Z`; consumed_at `2026-09-17T19:30:00Z` — **RUNTIME_PROOF_VALID** (not STALE) |
| Scoped standalone contract | `node --experimental-strip-types --test tests/contract/us0146.contract.test.ts` | **10 passed** fail 0 duration_ms 420.8343 (**9/9** `test_us0146_*` + inventory) |
| Standalone contract + unit | `npm test` in `standalone/` | **140 passed** fail 0 duration_ms 3281.7135 |
| Metadata | `python scripts/check-user-visible-metadata.py --repo .` | **exit 0** |
| Triad pre-write | `python scripts/enforce-triad-hot-surface.py --check` | **PASS** (exit 0) |
| Operator module | `standalone/packages/runtime-core/src/operator/*` | **present** (facade, observability, prompts, session, bounded-log) |
| CLI + TUI apps | `standalone/apps/cli`, `standalone/apps/tui` | **present** (thin client wiring) |
| DEC-0146 Accepted + R-0143 LOCKED | decisions + research anchors | **held** (not mutated this pass) |
| Backlog / acceptance | Status + checkbox spot-check | OPEN; acceptance `- [ ] US-0146`; AC-1..AC-8 **unchecked** |
| No `.env` / no live paid CI / no live Chrome | this pass | **held** |
| POLICY_QA_SILENT_FIX | no production source patch | **held** |

## Blocking findings

None.

## Non-blocking findings

None (CROSS_MODEL_REVIEW=0 — no execute-critic NB carry-forward).

## AC remap (independent — files + tests vs A1 / DEC-0146)

| AC | Delivered surface | Task(s) / markers | Result |
|---|---|---|---|
| AC-1 command parity + lifecycle | `OperatorCommandFacade`; REPL/argv; US-0143 scheduler | T-002, T-003, T-009 (T-011 m1, m2) | **PASS** |
| AC-2 status snapshot | `buildStatusSnapshot()` read-only compose | T-004 (T-011 m3) | **PASS** |
| AC-3 run timeline | `buildRunTimeline()` + evidence links | T-005 (T-011 m4) | **PASS** |
| AC-4 TUI panels client-only | `@its-magic/tui` panels; no workflow ownership | T-010 (T-011 m5) | **PASS** |
| AC-5 metrics / token-cost | `buildMetricsSnapshot()`; no dual-write | T-006 (T-011 m6) | **PASS** |
| AC-6 prompts interactive/non-interactive | `OperatorPrompts`; `OPERATOR_INPUT_REQUIRED` | T-007 (T-011 m7) | **PASS** |
| AC-7 bounded logs | 200 lines / 32 KiB + evidence ref | T-008 (T-011 m8) | **PASS** |
| AC-8 session reconnect/cancel/narrow | `OperatorSession` in-process; cols≤40 collapse | T-008, T-009, T-010 (T-011 m9) | **PASS** |

**Overall AC gate**: **PASS** (slice) — Status remains OPEN; `docs/product/acceptance.md` US-0146 **unchecked** (closure ownership).

## Contract marker results (9/9)

| # | Marker | Harness | Result |
|---|---|---|---|
| 1 | `test_us0146_cli_command_parity_programmatic_and_scheduler` | node:test | PASS |
| 2 | `test_us0146_cli_auth_models_delegate_isolated` | node:test | PASS |
| 3 | `test_us0146_status_snapshot_compose_read_only` | node:test | PASS |
| 4 | `test_us0146_run_timeline_evidence_links` | node:test | PASS |
| 5 | `test_us0146_tui_panels_client_only_boundaries` | node:test | PASS |
| 6 | `test_us0146_metrics_token_cost_compose_no_conflict` | node:test | PASS |
| 7 | `test_us0146_approval_prompt_interactive_noninteractive` | node:test | PASS |
| 8 | `test_us0146_bounded_log_summary_evidence_ref` | node:test | PASS |
| 9 | `test_us0146_local_reconnect_cancel_narrow_terminal` | node:test | PASS |

## Compose / scope gates

| Gate | Result |
|---|---|
| A1 LOCKED (sibling cli+tui; nested `operator/` facades) | HELD |
| Pi only on `auth`/`models` via `dispatchItsmCommand` | HELD |
| No US-0148 daemon protocol in v1; in-process session only | HELD |
| Log caps 200 lines / 32 KiB pinned | HELD |
| Fake-model CI / contract hermetic; no live paid CI; no required live Chrome | HELD |
| DEC-0038 `compute_strict_proof_hash` tuple UNAMENDED | HELD |
| US-0145+ OUT; US-0140..US-0144 DONE compose-only | HELD |
| US-0045 Status OPEN; acceptance.md unchecked; backlog ACs unchecked | HELD |
| Exactly nine `test_us0146_*` markers | HELD |
| No `.env` read / no intake JSON mutation / no POLICY_QA_SILENT_FIX production patch / auto.md not restored / no kit cli.json or tui.json | HELD |
| `harness_fail_zero_claimed=false`; `fake_browser_pass_claimed=false`; `live_chrome_probed=false` | HELD |

## UAT / convergence (US-0128)

- Contract slice green (`contract_test_failed=0`); 9/9 markers; kit omit held.
- Canonical `convergence_smoke` recorded as **pass** in `sprints/S0153/uat.json`.
- Six live-runtime probe classes waived `UAT_PROBE_FORBIDDEN` (FRAMEWORK_KIT_REPO=1; unpublished standalone workspace; **this story is NOT browser-owned**; **live Chrome not probed**).
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

## Runtime QA evidence (US-0065) — kit + unpublished workspace slice

- `runtime_startup_command`: n/a (contract tests; no live app server this phase)
- `runtime_stack_profile`: node (standalone workspace)
- `runtime_mode`: local
- `runtime_health_target`: n/a
- `runtime_health_result`: not_applicable
- `runtime_log_summary`: n/a
- `runtime_retry_count`: 0
- `runtime_retry_ledger`: []
- `runtime_final_verdict`: pass
- `runtime_reason_code`: `UAT_PROBE_FORBIDDEN` for live-runtime probes; slice health is contract tests + `convergence_smoke`
- `runtime_evidence_refs`: scoped node:test 9/9; `sprints/S0153/uat.json` `convergence_smoke`

## Generated-test evidence (US-0066)

- `generated_test_stack_profile`: node
- `generated_test_command`: `cd standalone && node --experimental-strip-types --test tests/contract/us0146.contract.test.ts`
- `generated_test_result`: pass
- `generated_test_output_ref`: this file § Independent checks (10 passed fail 0 duration_ms 420.8343)
- `generated_test_paths_ref`: `standalone/tests/contract/us0146.contract.test.ts`
- `generated_test_reason_code`: none (pass)

## Status confirmation (US-0045)

- backlog `## US-0146` Status: **OPEN**
- acceptance US-0146: **unchecked**
- AC-1..AC-8: **unchecked** (verify-work/closure)
- US-0133..US-0144: **DONE** (not reopened)
- US-0145+: **OPEN** (not mutated)
- BUG-*: not mutated

## Producer proof consumed (execute)

- `producer_runtime_proof_id=rp-auto-20260917-us0146-execute-dev-20260917T191500Z-US-0146`
- Canonical hashed payload: `{"orchestrator_run_id":"auto-20260917-us0146","phase_id":"execute","proof_issued_at":"2026-09-17T19:15:00Z","proof_ttl_seconds":3600,"role":"dev","runtime_proof_id":"rp-auto-20260917-us0146-execute-dev-20260917T191500Z-US-0146"}`
- `producer_attested_proof_hash=BD51976EB4FA13C40374644DDA75183AEE6352E292FE86584A09AFAB2C8298F0`
- Independent `compute_strict_proof_hash` recompute: **MATCH**
- `producer_proof_ttl=2026-09-17T20:15:00Z`, `consumed_at=2026-09-17T19:30:00Z` (before RUNTIME_PROOF_STALE)
- `producer_ttl_stale=false`
- `producer_fresh_context_marker=dev-US0146-execute-20260917T191500Z-fresh`

## Strict runtime proof (DEC-0038) — qa

- `orchestrator_run_id=auto-20260917-us0146`
- `runtime_proof_id=rp-auto-20260917-us0146-qa-qa-20260917T193000Z-US-0146`
- `phase_id=qa`, `role=qa`, `story_id=US-0146`, `sprint_id=S0153`
- `proof_issued_at=2026-09-17T19:30:00Z`
- `proof_ttl_seconds=3600`, `proof_ttl=2026-09-17T20:30:00Z`
- `proof_hash=1F0CF1A5E1712239744730E9988EBD66077C3F536BDC56C9773762E156462BA9`
- Canonical payload: `{"orchestrator_run_id":"auto-20260917-us0146","phase_id":"qa","proof_issued_at":"2026-09-17T19:30:00Z","proof_ttl_seconds":3600,"role":"qa","runtime_proof_id":"rp-auto-20260917-us0146-qa-qa-20260917T193000Z-US-0146"}`
- `hash_recompute_confirmation=true`

## Strict runtime proof (DEC-0038) — plan-verify (ultra_lean merged)

- `runtime_proof_id=rp-auto-20260917-us0146-plan-verify-qa-20260917T193000Z-US-0146`
- `phase_id=plan-verify`, `role=qa`
- `proof_issued_at=2026-09-17T19:30:00Z`, `proof_ttl=2026-09-17T20:30:00Z`
- `proof_hash=266E3591159E7F273BF02B775F868EF90E58FAE32CA24568DD1DFD15064E897F`
- Canonical payload: `{"orchestrator_run_id":"auto-20260917-us0146","phase_id":"plan-verify","proof_issued_at":"2026-09-17T19:30:00Z","proof_ttl_seconds":3600,"role":"qa","runtime_proof_id":"rp-auto-20260917-us0146-plan-verify-qa-20260917T193000Z-US-0146"}`

## Isolation evidence (US-0048 / DEC-0029 / US-0104 v2)

- `phase_id=qa`, `role=qa`, `model_id=inherit` (CROSS_MODEL_REVIEW=0)
- `fresh_context_marker=qa-US0146-qa-20260917T193000Z-fresh` (NEW per US-0048 / BUG-0006)
- `timestamp=2026-09-17T19:30:00Z` (UTC wall-clock)
- `evidence_ref=sprints/S0153/qa-findings.md; sprints/S0153/plan-verify.json; sprints/S0153/uat.json`
- Fresh qa subagent per BUG-0006; no `/verify-work` or `/execute` spawn from this subagent.

## Next scheduled phase

- `next_scheduled_phase=/verify-work` (fresh qa subagent per BUG-0006 — orchestrator-owned)
- `next_scheduled_role=qa`
- `stop_condition=STOP after qa PASS. Do NOT mark US-0146 DONE. Do NOT tick acceptance. Do NOT npm-publish. Do NOT git push.`
