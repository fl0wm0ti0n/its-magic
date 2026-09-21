# QA findings — BUG-0027 / S0160 / auto-20260921-bug0027 (qa)

- **phase_id**: qa, **role**: qa, **bug_id**: BUG-0027 (OPEN — not marked DONE per US-0045), **story_id**: (none), **sprint_id**: S0160
- `orchestrator_run_id=auto-20260921-bug0027`, `parent_run=ir-20260921T190544Z-bug0027`, `delivery_mode=ultra_lean`, `macro_phase=build+verify`
- `segment_work_item_kind=bug`, `bug_queue_position=1 of 1`
- `AUTO_IMPLEMENTATION_LOOP=1` (no blocking findings — do not return to `/execute`)
- `AUTO_QUIET=1`
- `FRAMEWORK_KIT_REPO=1`
- `SECURITY_REVIEW=0` (skip — flag not 1)
- `model_id=inherit` (CROSS_MODEL_REVIEW=0)
- `producer_phase_id=execute`, `producer_role=dev`, `producer_model_id=inherit`
- `CROSS_MODEL_REVIEW=0` — no sovereign-critic of execute or qa this chain segment
- `cross_reviewer_findings.open_blocking_count=0`

- `fresh_context_marker=qa-BUG0027-qa-20260921T215200Z-fresh` (NEW per US-0048 / BUG-0006; not reused from execute `dev-BUG0027-execute-20260921T214400Z-fresh`)
- `timestamp (UTC)=2026-09-21T21:52:00Z` (wall-clock)
- **verdict: QA_PASS**
- `plan_verify_verdict=PASS` (ultra_lean deferred — `sprints/S0160/plan-verify.json` SKIPPED placeholder overwritten at /qa; 6/6 AC surjective in sprint-plan + architecture `# BUG-0027` / R-0151 DQ1–DQ10 + ten `test_bug0027_*`)
- `blocking_count=0`
- `non_blocking_count=1` (live OpenCode host residual — `UAT_PROBE_FORBIDDEN`; slice PASS only)
- `story_status=OPEN` (do not mark BUG-0027 DONE; intake JSON not mutated)
- `acceptance_BUG-0027=NOT ticked` (`docs/product/acceptance.md` row remains `- [ ] BUG-0027`)
- `backlog_ACs=NOT ticked` (verify-work/closure ownership per US-0045 / orchestrator mission)
- `intake_json=NOT mutated` (`handoffs/intake_evidence/BUG-0027-intake-20260921T190544Z.json` read-only)
- OpenCode manual-phase persist contract-test slice — **no fake browser PASS**; **no live OpenCode CLI TUI PASS**; **do not start OpenCode CLI TUI as AC PASS**; **do not claim toast repair**
- `SECURITY_REVIEW=0`, `CROSS_REPO_OBSERVABILITY=0`, `COMPONENT_SCOPE_MODE=0`, `USER_GUIDE_MODE=0`, `SPEC_PACK_MODE=0`
- `sibling_boundary=BUG-0024 DONE compose-only (do not reopen; do not claim toast repair); BUG-0016 DONE compose-only; BUG-0022 OPEN / BUG-0026 OPEN not drained; US-0150 OPEN compose/link only; US-0125 DONE named-CLI compose-amend (ACs stay DONE); no auto.md restore; no JSON commands.auto; R-0151 / R-0150 / R-0140 held`

## Verdict rationale

Fresh QA independently remapped AC-1..AC-6 against architecture `# BUG-0027` A1 (Hybrid manual-phase persist: IsolationEvidence identity fields; `persistManualPhaseIsolation` not `runAutoLifecycle`; RPC ID forward; reject `tui-auto`; targeted glob widen; fail-closed tokens; OpenCode pack validator rewrite; ten `test_bug0027_*`; `BUG0027_PAIRS` + upgrade overwrite; US-0125 named-CLI compose-amend) + `R-0151` DQ1–DQ10 + `tasks.md`, treated ultra_lean deferred plan-verify as **PASS** (6/6 AC surjective), re-ran pytest bug0027 (**10/10** in 0.87s), compose us0125+bug0016+bug0024+bug0015+us0124+us0122+bug0018+bug0019 (**66/66** in 3.44s), parity `--scope bug-0027` **[INTAKE_TEMPLATE_PARITY_OK]**, metadata **exit 0**, `bug_issue_validate.py --repo . --check-acceptance` **[BUG_VALIDATION_OK]**, colliding `auto.md` absent (14 peer markdown commands; keep agents/cursor `auto.md`), and independently recomputed execute proof hash **MATCH** before TTL (`2026-09-21T22:44:00Z`; consumed_at `2026-09-21T21:52:00Z`). Blocking findings: **none**. BUG-0027 remains OPEN; acceptance.md and backlog ACs unchecked. POLICY_QA_SILENT_FIX held.

**Honest live residual**: CI cannot prove live `command.executed` / `persistManualPhaseIsolation` against a running OpenCode CLI/TUI host (R-0119). AC-1..AC-3 are **slice PASS** via ten markers + code-inspection. Residual `OPENCODE_MANUAL_PHASE_PERSIST_NOT_INVOKED` remains possible on hosts that never fire `command.executed` until an operator-owned live re-probe after ship. **No live OpenCode PASS. No toast-repair claim.**

## Test plan

| # | Check | Expected |
|---|---|---|
| 1 | Independent AC-1..AC-6 remap vs A1 + tasks | Each AC ≥1 task; primary acceptance covered |
| 2 | Ultra_lean `sprints/S0160/plan-verify.json` merged at /qa | PASS if 6/6 surjective + 10 markers |
| 3 | pytest `tests/bug0027_opencode_manual_phase_persist_test.py` | 10/10 `test_bug0027_*` PASS |
| 4 | Compose: us0125 / bug0016 / bug0024 / bug0015 / us0124 / us0122 / bug0018 / bug0019 | green |
| 5 | Execute DEC-0038 proof consume | MATCH before TTL |
| 6 | Status OPEN; acceptance unchecked; backlog ACs unchecked | unchanged |
| 7 | UAT probes | `probe_kind=contract_tests_primary`; live probes `UAT_PROBE_FORBIDDEN` |
| 8 | Emit `convergence_smoke` when `contract_test_failed=0` | present, `result=pass` |
| 9 | Do not start OpenCode as AC PASS; no auto.md restore; no toast repair | held |

## Independent checks (this qa subagent)

| Check | Command / method | Result |
|---|---|---|
| Execute proof SHA-256 | `compute_strict_proof_hash` 6-field tuple | **MATCH** `0A6D1399F910A2166D137FFCFA632C9D673FB381EA68E4D8A2056D7337590B33`; ttl `2026-09-21T22:44:00Z`; consumed_at `2026-09-21T21:52:00Z` — **RUNTIME_PROOF_VALID** (not STALE) |
| Pytest bug0027 | `python -m pytest tests/bug0027_opencode_manual_phase_persist_test.py -v` | **10 passed** in 0.87s |
| Compose us0125..bug0019 | pytest batch us0125+bug0016+bug0024+bug0015+us0124+us0122+bug0018+bug0019 | **66 passed** in 3.44s (11+7+8+7+12+8+6+7) |
| Parity | `python scripts/check_intake_template_parity.py --repo . --scope bug-0027` | **[INTAKE_TEMPLATE_PARITY_OK]** |
| Metadata | `python scripts/check-user-visible-metadata.py --repo .` | **exit 0** |
| Bug/acceptance validator | `python scripts/bug_issue_validate.py --repo . --check-acceptance` | **[BUG_VALIDATION_OK]** |
| Colliding auto.md | path exists? | **absent** active + template `.opencode/commands/auto.md` |
| Keep surfaces | `.opencode/agents/auto.md`, `.cursor/commands/auto.md` | **present** |
| Remaining markdown commands | `.opencode/commands/*.md` | **14** (no `auto.md`) |
| IsolationEvidence + persist helper | orchestrator.ts inspection | identity fields `storyId`/`sprintId`/`orchestratorRunId`/`bugId`; `persistManualPhaseIsolation`; `spawnPhase` copies IDs; `--story-id`/`--sprint-id`/`--orchestrator-run-id`/`--bug-id` on bridge |
| RPC + placeholder reject | `runAutoLifecycleRpc` | forwards IDs; `tui-auto` → `OPENCODE_PLACEHOLDER_PARENT_REJECTED`; missing session → `OPENCODE_MANUAL_PHASE_CONTEXT_MISSING`; no `tui-auto` default |
| Permission matrix | `.opencode/agents/{dev,qa}.md` | dev allows `state.md` + `summary.md`; qa allows `state.md`; `"**": deny` last |
| Validator packs | `.opencode/commands/{intake,execute,discovery,qa,verify-work}.md` | intake `--file`/`--stdin`/`--self-test`; execute/discovery drop intake validator; qa/verify-work keep `bug_issue_validate.py --repo . --check-acceptance`; no `intake_evidence_validate.py --repo . --enforce` in active OpenCode packs |
| Backlog / acceptance | Status + checkbox spot-check | OPEN; acceptance `- [ ] BUG-0027`; AC-1..AC-6 **unchecked**; BUG-0024 DONE; BUG-0022/0026 OPEN; US-0125 `[x]` held |
| Companion DEC | `docs/engineering/decisions.md` | **none** for BUG-0027 |
| LINT_COMMAND / TYPECHECK_COMMAND | blank in runbook | **skipped** |
| Full harness `tests/run-tests.ps1` | not re-run this pass | **not claimed** — scoped slice + compose are the required gates (`harness_fail_zero_claimed=false`) |
| Live OpenCode CLI TUI / command.executed probe | not attempted (`UAT_PROBE_FORBIDDEN`) | **not claimed** — operator-owned after ship |
| No `.env` / no intake mutation | this pass | **held** |
| POLICY_QA_SILENT_FIX | no production source patch | **held** |

## Blocking findings

None.

## Non-blocking findings

1. **LIVE_OPENCODE_MANUAL_PHASE_RESIDUAL** — CI cannot prove live `command.executed` / `persistManualPhaseIsolation` against a running OpenCode CLI/TUI host (R-0119). Residual `OPENCODE_MANUAL_PHASE_PERSIST_NOT_INVOKED` possible until operator re-probes after ship. AC-1..AC-3 **slice PASS** via ten `test_bug0027_*` markers + code-inspection. **No live OpenCode PASS. No toast-repair claim.** Does not block QA_PASS for this contract slice.

## AC remap (independent — files + tests vs A1 / R-0151)

| AC | Delivered surface | Task(s) / markers | Result |
|---|---|---|---|
| AC-1 direct phase runs with required writes or fail-closed before work | `persistManualPhaseIsolation` + `command.executed` limb; glob widen; `OPENCODE_MANUAL_PHASE_WRITE_DENIED` | T-002, T-004; m1, m10 | **PASS** (slice; mock+code-inspection). Live OpenCode **not** probed. |
| AC-2 persist canonical artifacts + linked isolation; no success while denied | IsolationEvidence IDs; persist helper non-ok → `OPENCODE_MANUAL_PHASE_PERSIST_DENIED` | T-001, T-002; m2 | **PASS** |
| AC-3 real parent session + story/sprint/run; `tui-auto` rejected | RPC forward; `OPENCODE_PLACEHOLDER_PARENT_REJECTED`; `OPENCODE_MANUAL_PHASE_CONTEXT_MISSING` | T-001, T-003; m1, m3, m4 | **PASS** |
| AC-4 `/auto` remains BUG-0024; no toast claim; no fabricated proofs | toast path unamended; marker 5/6; no invented proof tuples | T-anch, T-003; m5, m6 | **PASS** |
| AC-5 supported intake validator; `--repo . --enforce` removed | intake `--file`/`--stdin`/`--self-test`; execute/discovery drop intake validator | T-005; m7, m8 | **PASS** |
| AC-6 contract tests cover persist, deny, context, validator, parity | ten `test_bug0027_*`; `BUG0027_PAIRS`; US-0125 named-CLI compose-amend (ACs stay DONE) | T-006, T-007; m1–m10 | **PASS** |

**Overall AC gate**: **PASS** (slice) — Status remains OPEN; `docs/product/acceptance.md` BUG-0027 **unchecked**; backlog AC-1..AC-6 **unchecked** (verify-work/closure). **No live OpenCode PASS. No toast-repair claim.**

## Contract marker results (10/10)

| # | Marker | Harness | Result |
|---|---|---|---|
| 1 | `test_bug0027_manual_phase_persists_isolation` | pytest | PASS |
| 2 | `test_bug0027_denied_persist_not_success` | pytest | PASS |
| 3 | `test_bug0027_rpc_forwards_story_sprint_run` | pytest | PASS |
| 4 | `test_bug0027_tui_auto_rejected_as_release_evidence` | pytest | PASS |
| 5 | `test_bug0027_no_fabricated_proof_when_orchestrator_unavailable` | pytest | PASS |
| 6 | `test_bug0027_auto_tui_toast_not_claimed` | pytest | PASS |
| 7 | `test_bug0027_validator_invocation_file_stdin_not_repo_enforce` | pytest | PASS |
| 8 | `test_bug0027_non_intake_packs_drop_intake_validator` | pytest | PASS |
| 9 | `test_bug0027_active_template_parity` | pytest | PASS |
| 10 | `test_bug0027_permission_matrix_phase_writes` | pytest | PASS |

## Compose / scope gates

| Gate | Result |
|---|---|
| A1 LOCKED (IsolationEvidence IDs + persistManualPhaseIsolation + reject tui-auto + glob widen + validator packs) | HELD |
| BUG-0024 / S0159 DONE compose-only (no AC reopen; no toast-repair claim) | HELD (8/8) |
| BUG-0016 DONE compose-only (additive globs; deny-last held) | HELD (7/7) |
| US-0125 DONE named-CLI compose-amend (ACs stay `[x]`) | HELD (11/11) |
| us0124 / us0122 / bug0015 / bug0018 / bug0019 compose | HELD (12+8+7+6+7) |
| BUG-0022 / BUG-0026 OPEN not drained | HELD |
| US-0150 OPEN compose/link only | HELD |
| R-0151 / `# BUG-0027` held; companion DEC none; R-0150 / R-0140 held | HELD |
| DEC-0038 `compute_strict_proof_hash` tuple UNAMENDED | HELD |
| US-0045 Status OPEN; acceptance.md unchecked; backlog ACs unchecked | HELD |
| Exactly ten `test_bug0027_*` markers | HELD |
| No `.env` read / no intake JSON mutation / no POLICY_QA_SILENT_FIX / no npm publish / no git push | HELD |
| `harness_fail_zero_claimed=false`; `fake_browser_pass_claimed=false`; `live_opencode_cli_tui_pass_claimed=false`; `toast_repair_claimed=false` | HELD |

## UAT / convergence (US-0128)

- Contract slice green (`contract_test_failed=0`); 10/10 markers; compose 66/66; parity OK.
- Canonical `convergence_smoke` recorded as **pass** in `sprints/S0160/uat.json`.
- Six live-runtime probe classes waived `UAT_PROBE_FORBIDDEN` (FRAMEWORK_KIT_REPO=1; OpenCode manual-phase persist contract slice; **live OpenCode CLI TUI / live Chrome not probed**).
- Full UAT ownership remains with `/verify-work` (do not flip DONE).
- **No fake live OpenCode / browser PASS.**

## UAT probes (FRAMEWORK_KIT_REPO=1 — honest classification)

Applicable probe class: **`contract_tests_primary`**. Live OpenCode CLI TUI / browser: **`UAT_PROBE_FORBIDDEN`**.

| Probe class | Classification | reason_code |
|---|---|---|
| `browser_smoke` | not probed | `UAT_PROBE_FORBIDDEN` |
| `api_health` | waived | `UAT_PROBE_FORBIDDEN` |
| `process_health` | waived | `UAT_PROBE_FORBIDDEN` |
| `cli_smoke` | waived (contract tests; live OpenCode forbidden) | `UAT_PROBE_FORBIDDEN` |
| `build` | waived (contract/parity recorded independently) | `UAT_PROBE_FORBIDDEN` |
| `manual_operator` | deferred to verify-work/release (live CLI re-probe) | `UAT_PROBE_FORBIDDEN` |

**Runtime browser evidence**: none. MCP `browser_navigate` **not run**. Live OpenCode CLI TUI **not started**.

## Runtime QA evidence (US-0065) — kit OpenCode manual-phase persist slice

- `runtime_startup_command`: n/a (contract tests; no live OpenCode this phase)
- `runtime_stack_profile`: python (pytest manual-phase persist contract)
- `runtime_mode`: local
- `runtime_health_target`: n/a
- `runtime_health_result`: not_applicable
- `runtime_log_summary`: n/a
- `runtime_retry_count`: 0
- `runtime_retry_ledger`: []
- `runtime_final_verdict`: pass
- `runtime_reason_code`: `UAT_PROBE_FORBIDDEN` for live-runtime / live OpenCode probes; slice health is contract tests + `convergence_smoke`
- `runtime_evidence_refs`: pytest bug0027 10/10; compose 66/66; `sprints/S0160/uat.json` `convergence_smoke`

## Generated-test evidence (US-0066)

- `generated_test_stack_profile`: python
- `generated_test_command`: `python -m pytest tests/bug0027_opencode_manual_phase_persist_test.py` (+ compose batch)
- `generated_test_result`: pass
- `generated_test_output_ref`: this file § Independent checks (bug0027 10 passed 0.87s; compose 66 passed 3.44s)
- `generated_test_paths_ref`: `tests/bug0027_opencode_manual_phase_persist_test.py`; `tests/bug0027_persist_harness.mjs`
- `generated_test_reason_code`: none (pass)

## Status confirmation (US-0045)

- backlog `### BUG-0027` Status: **OPEN**
- acceptance BUG-0027: **unchecked**
- AC-1..AC-6: **unchecked** (verify-work/closure)
- BUG-0024: **DONE** (not reopened)
- BUG-0022 / BUG-0026: **OPEN** (not mutated)
- US-0125: **DONE** (ACs stay `[x]`; named-CLI compose-amend only)
- intake evidence: **not mutated**

## Producer proof consumed (execute)

- `producer_runtime_proof_id=rp-auto-20260921-bug0027-execute-dev-20260921T214400Z-BUG-0027`
- Canonical hashed payload: `{"orchestrator_run_id":"auto-20260921-bug0027","phase_id":"execute","proof_issued_at":"2026-09-21T21:44:00Z","proof_ttl_seconds":3600,"role":"dev","runtime_proof_id":"rp-auto-20260921-bug0027-execute-dev-20260921T214400Z-BUG-0027"}`
- `producer_attested_proof_hash=0A6D1399F910A2166D137FFCFA632C9D673FB381EA68E4D8A2056D7337590B33`
- Independent `compute_strict_proof_hash` recompute: **MATCH**
- `producer_proof_ttl=2026-09-21T22:44:00Z`, `consumed_at=2026-09-21T21:52:00Z` (before RUNTIME_PROOF_STALE)
- `producer_ttl_stale=false`
- `producer_fresh_context_marker=dev-BUG0027-execute-20260921T214400Z-fresh`

## Strict runtime proof (DEC-0038) — qa

- `orchestrator_run_id=auto-20260921-bug0027`
- `runtime_proof_id=rp-auto-20260921-bug0027-qa-qa-20260921T215200Z-BUG-0027`
- `phase_id=qa`, `role=qa`, `bug_id=BUG-0027`, `sprint_id=S0160`
- `proof_issued_at=2026-09-21T21:52:00Z`
- `proof_ttl_seconds=3600`, `proof_ttl=2026-09-21T22:52:00Z`
- `proof_hash=4C93C4878501C9E8BF6966FE926733DB2B4DA7F67363E630FD2EEDE52482B6D5`
- Canonical payload: `{"orchestrator_run_id":"auto-20260921-bug0027","phase_id":"qa","proof_issued_at":"2026-09-21T21:52:00Z","proof_ttl_seconds":3600,"role":"qa","runtime_proof_id":"rp-auto-20260921-bug0027-qa-qa-20260921T215200Z-BUG-0027"}`
- `hash_recompute_confirmation=true`

## Strict runtime proof (DEC-0038) — plan-verify (ultra_lean merged)

- `runtime_proof_id=rp-auto-20260921-bug0027-plan-verify-qa-20260921T215200Z-BUG-0027`
- `phase_id=plan-verify`, `role=qa`
- `proof_issued_at=2026-09-21T21:52:00Z`, `proof_ttl=2026-09-21T22:52:00Z`
- `proof_hash=6E70023DA9FFB5E66AE08F2F0D9C6A42FB06470AFA5D7408155B8D4F8E73847A`
- Canonical payload: `{"orchestrator_run_id":"auto-20260921-bug0027","phase_id":"plan-verify","proof_issued_at":"2026-09-21T21:52:00Z","proof_ttl_seconds":3600,"role":"qa","runtime_proof_id":"rp-auto-20260921-bug0027-plan-verify-qa-20260921T215200Z-BUG-0027"}`

## Isolation evidence (US-0048 / DEC-0029 / US-0104 v2)

- `phase_id=qa`, `role=qa`, `model_id=inherit` (CROSS_MODEL_REVIEW=0)
- `fresh_context_marker=qa-BUG0027-qa-20260921T215200Z-fresh` (NEW per US-0048 / BUG-0006)
- `timestamp=2026-09-21T21:52:00Z` (UTC wall-clock)
- `evidence_ref=sprints/S0160/qa-findings.md; sprints/S0160/plan-verify.json; sprints/S0160/uat.json; handoffs/qa_to_verify.md`
- Fresh qa subagent per BUG-0006; no `/verify-work` or `/execute` spawn from this subagent.

## Next scheduled phase

- `next_scheduled_phase=/verify-work` (fresh qa subagent per BUG-0006 — orchestrator-owned)
- `next_scheduled_role=qa`
- `stop_condition=STOP after qa PASS. Do NOT mark BUG-0027 DONE. Do NOT tick acceptance. Do NOT restore auto.md. Do NOT reopen BUG-0024. Do NOT claim toast repair. Do NOT merge/drain BUG-0022/0026. Do NOT git push.`
