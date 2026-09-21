# QA findings — BUG-0024 / S0159 / auto-20260921-bug0024 (qa)

- **phase_id**: qa, **role**: qa, **bug_id**: BUG-0024 (OPEN — not marked DONE per US-0045), **story_id**: (none), **sprint_id**: S0159
- `orchestrator_run_id=auto-20260921-bug0024`, `parent_run=cursor-20260913-BUG0024-intake`, `delivery_mode=ultra_lean`, `macro_phase=build+verify`
- `segment_work_item_kind=bug`, `bug_queue_position=1 of 1`
- `AUTO_IMPLEMENTATION_LOOP=1` (no blocking findings — do not return to `/execute`)
- `AUTO_QUIET=1`
- `FRAMEWORK_KIT_REPO=1`
- `SECURITY_REVIEW=0` (skip — flag not 1)
- `model_id=inherit` (CROSS_MODEL_REVIEW=0)
- `producer_phase_id=execute`, `producer_role=dev`, `producer_model_id=inherit`
- `CROSS_MODEL_REVIEW=0` — no sovereign-critic of execute or qa this chain segment
- `cross_reviewer_findings.open_blocking_count=0`

- `fresh_context_marker=qa-BUG0024-qa-20260921T200200Z-fresh` (NEW per US-0048 / BUG-0006; not reused from execute `dev-BUG0024-execute-20260921T195500Z-fresh`)
- `timestamp (UTC)=2026-09-21T20:02:00Z` (wall-clock)
- **verdict: QA_PASS**
- `plan_verify_verdict=PASS` (ultra_lean deferred — `sprints/S0159/plan-verify.json` SKIPPED placeholder overwritten at /qa; 8/8 AC surjective in sprint-plan + architecture `# BUG-0024` / R-0140 DQ1–DQ10 + eight `test_bug0024_*`)
- `blocking_count=0`
- `non_blocking_count=1` (live OpenCode CLI TUI residual — `UAT_PROBE_FORBIDDEN`; slice PASS only)
- `story_status=OPEN` (do not mark BUG-0024 DONE; intake JSON not mutated)
- `acceptance_BUG-0024=NOT ticked` (`docs/product/acceptance.md` row remains `- [ ] BUG-0024`)
- `backlog_ACs=NOT ticked` (verify-work/closure ownership per US-0045 / orchestrator mission)
- `intake_json=NOT mutated` (`handoffs/intake_evidence/BUG-0024-intake-20260914T035000Z.json` read-only)
- OpenCode CLI TUI residual live-dispatch contract-test slice — **no fake browser PASS**; **no live OpenCode CLI TUI PASS**; **do not start OpenCode CLI TUI as AC PASS**
- `SECURITY_REVIEW=0`, `CROSS_REPO_OBSERVABILITY=0`, `COMPONENT_SCOPE_MODE=0`, `USER_GUIDE_MODE=0`, `SPEC_PACK_MODE=0`
- `sibling_boundary=BUG-0023/0021/0020/0019/0018 DONE compose-only; BUG-0022 OPEN / BUG-0027 OPEN not drained; no auto.md restore; no JSON commands.auto`

## Verdict rationale

Fresh QA independently remapped AC-1..AC-8 against architecture `# BUG-0024` A1 (Hybrid residual live-dispatch: peer-branded `@opencode/plugin/rpc` for TUI success; local identity-define load-safe only; stage-distinct `OPENCODE_*`; DISPATCH umbrella-only; keep `{ id, tui }` + `editor.add`; eight `test_bug0024_*`; upgrade overwrite + prune; active↔template parity) + `R-0140` DQ1–DQ10 + `tasks.md`, treated ultra_lean deferred plan-verify as **PASS** (8/8 AC surjective), re-ran pytest bug0024 (**8/8** in 0.55s), compose bug0023+0021+0020+0019+0018 (**37/37** in 0.76s), parity `--scope bug-0024` **[INTAKE_TEMPLATE_PARITY_OK]**, metadata **exit 0**, colliding `auto.md` absent (14 peer markdown commands; keep agents/cursor `auto.md`), and independently recomputed execute proof hash **MATCH** before TTL (`2026-09-21T20:55:00Z`; consumed_at `2026-09-21T20:02:00Z`). Blocking findings: **none**. BUG-0024 remains OPEN; acceptance.md and backlog ACs unchecked. POLICY_QA_SILENT_FIX held.

**Honest live residual**: CI cannot prove live peer-branded `client.rpc(Defined)` against a running OpenCode CLI TUI. AC-1..AC-2 are **slice PASS** via stage-limb markers + code-inspection. Residual `OPENCODE_AUTO_TUI_DISPATCH_UNSUPPORTED` (or stage codes) remains possible on hosts that exhaust limbs until an operator-owned live re-probe after ship. **No live OpenCode CLI TUI PASS.**

## Test plan

| # | Check | Expected |
|---|---|---|
| 1 | Independent AC-1..AC-8 remap vs A1 + tasks | Each AC ≥1 task; primary acceptance covered |
| 2 | Ultra_lean `sprints/S0159/plan-verify.json` merged at /qa | PASS if 8/8 surjective + 8 markers |
| 3 | pytest `tests/bug0024_opencode_cli_tui_live_dispatch_residual_test.py` | 8/8 `test_bug0024_*` PASS |
| 4 | Compose: bug0023 / 0021 / 0020 / 0019 / 0018 | green (8+8+8+7+6=37) |
| 5 | Execute DEC-0038 proof consume | MATCH before TTL |
| 6 | Status OPEN; acceptance unchecked; backlog ACs unchecked | unchanged |
| 7 | UAT probes | `probe_kind=contract_tests_primary`; live probes `UAT_PROBE_FORBIDDEN` |
| 8 | Emit `convergence_smoke` when `contract_test_failed=0` | present, `result=pass` |
| 9 | Do not start OpenCode CLI TUI as AC PASS; no auto.md restore | held |

## Independent checks (this qa subagent)

| Check | Command / method | Result |
|---|---|---|
| Execute proof SHA-256 | `compute_strict_proof_hash` 6-field tuple | **MATCH** `E653C7B8616F101FB996D413493BABE5A8D979ADE3548FB8F2A26A47265DA356`; ttl `2026-09-21T20:55:00Z`; consumed_at `2026-09-21T20:02:00Z` — **RUNTIME_PROOF_VALID** (not STALE) |
| Pytest bug0024 | `python -m pytest tests/bug0024_opencode_cli_tui_live_dispatch_residual_test.py -v` | **8 passed** in 0.55s |
| Compose bug0023..0018 | pytest batch bug0023+0021+0020+0019+0018 | **37 passed** in 0.76s (8+8+8+7+6) |
| Parity | `python scripts/check_intake_template_parity.py --repo . --scope bug-0024` | **[INTAKE_TEMPLATE_PARITY_OK]** |
| Metadata | `python scripts/check-user-visible-metadata.py --repo .` | **exit 0** |
| Colliding auto.md | path exists? | **absent** active + template |
| Keep surfaces | `.opencode/agents/auto.md`, `.cursor/commands/auto.md` | **present** |
| Remaining markdown commands | `.opencode/commands/*.md` | **14** (no `auto.md`) |
| Peer brand + stage limbs | `rpc.ts` / `tui.ts` / orchestrator | `ITS_MAGIC_AUTO_RPC_PEER_BRANDED`; MISSING_CLIENT / RPC_ABSENT / DEFINED_UNBRANDED / MAKE_UNREACHABLE; DISPATCH umbrella; `emitAutoTuiRegisterSkipped` present |
| Backlog / acceptance | Status + checkbox spot-check | OPEN; acceptance `- [ ] BUG-0024`; AC-1..AC-8 **unchecked**; BUG-0022/0027 OPEN |
| LINT_COMMAND / TYPECHECK_COMMAND | blank in runbook | **skipped** |
| Full harness `tests/run-tests.ps1` | not re-run this pass | **not claimed** — scoped slice + compose are the required gates (`harness_fail_zero_claimed=false`) |
| Live OpenCode CLI TUI probe | not attempted (`UAT_PROBE_FORBIDDEN`) | **not claimed** — operator-owned after ship |
| No `.env` / no intake mutation | this pass | **held** |
| POLICY_QA_SILENT_FIX | no production source patch | **held** |

## Blocking findings

None.

## Non-blocking findings

1. **LIVE_OPENCODE_CLI_TUI_RESIDUAL** — CI cannot prove live peer-branded `client.rpc(Defined)` against OpenCode CLI TUI. Residual DISPATCH / stage toasts possible until operator re-probes after ship. AC-1..AC-2 **slice PASS** via eight `test_bug0024_*` markers + code-inspection. **No live CLI TUI PASS.** Does not block QA_PASS for this contract slice.

## AC remap (independent — files + tests vs A1 / R-0140)

| AC | Delivered surface | Task(s) / markers | Result |
|---|---|---|---|
| AC-1 listed CLI TUI `/auto` starts lifecycle or honest stage `OPENCODE_*` | Peer brand + limb order + REGISTER_SKIPPED + stage tokens | T-001..T-004; m1–m5 | **PASS** (slice; mock+code-inspection). Live OpenCode CLI TUI **not** probed. |
| AC-2 DISPATCH not happy path | DISPATCH umbrella-only when limbs exhausted | T-004; m5 | **PASS** |
| AC-3 must not restore STOP-only `auto.md` | active+template `.opencode/commands/auto.md` absent; 14 peer `.md` | T-anch, T-005 m6 | **PASS** |
| AC-4 must not JSON-template `/auto` | no `commands.auto` + `template` | T-005 m6 | **PASS** |
| AC-5 plugin `editor.add` execute retained | orchestrator `editor.add` + register-skipped honesty | T-002, T-005 m6 | **PASS** |
| AC-6 additive tests; CI `UAT_PROBE_FORBIDDEN` for live OpenCode | eight `test_bug0024_*`; no live probe in default CI | T-005 | **PASS** |
| AC-7 upgrade overwrites dispatch path + still prunes `auto.md` | installer overwrite + prune; marker 8 | T-006, T-005 m8 | **PASS** |
| AC-8 active↔template parity | `--scope bug-0024` OK + `BUG0024_PAIRS` | T-007, T-005 m7 | **PASS** |

**Overall AC gate**: **PASS** (slice) — Status remains OPEN; `docs/product/acceptance.md` BUG-0024 **unchecked**; backlog AC-1..AC-8 **unchecked** (verify-work/closure). **No live OpenCode CLI TUI PASS.**

## Contract marker results (8/8)

| # | Marker | Harness | Result |
|---|---|---|---|
| 1 | `test_bug0024_run_missing_api_client_distinct_code` | pytest | PASS |
| 2 | `test_bug0024_local_unbranded_defined_not_happy_path` | pytest | PASS |
| 3 | `test_bug0024_register_skipped_observable` | pytest | PASS |
| 4 | `test_bug0024_make_unreachable_without_baseurl` | pytest | PASS |
| 5 | `test_bug0024_swallowed_rpc_error_not_only_dispatch` | pytest | PASS |
| 6 | `test_bug0024_keep_editor_add_no_auto_md` | pytest | PASS |
| 7 | `test_bug0024_active_template_parity` | pytest | PASS |
| 8 | `test_bug0024_upgrade_copies_dispatch_still_prunes_auto_md` | pytest | PASS |

## Compose / scope gates

| Gate | Result |
|---|---|
| A1 LOCKED (peer brand + stage limbs + DISPATCH umbrella + editor.add + no auto.md) | HELD |
| BUG-0023 / 0021 / 0020 / 0019 / 0018 DONE compose-only (no AC reopen) | HELD (37/37) |
| BUG-0022 / BUG-0027 OPEN not drained | HELD |
| R-0140 / `# BUG-0024` held; companion DEC none | HELD |
| DEC-0038 `compute_strict_proof_hash` tuple UNAMENDED | HELD |
| US-0045 Status OPEN; acceptance.md unchecked; backlog ACs unchecked | HELD |
| Exactly eight `test_bug0024_*` markers | HELD |
| No `.env` read / no intake JSON mutation / no POLICY_QA_SILENT_FIX / no npm publish / no git push | HELD |
| `harness_fail_zero_claimed=false`; `fake_browser_pass_claimed=false`; `live_opencode_cli_tui_pass_claimed=false` | HELD |

## UAT / convergence (US-0128)

- Contract slice green (`contract_test_failed=0`); 8/8 markers; compose 37/37; parity OK.
- Canonical `convergence_smoke` recorded as **pass** in `sprints/S0159/uat.json`.
- Six live-runtime probe classes waived `UAT_PROBE_FORBIDDEN` (FRAMEWORK_KIT_REPO=1; OpenCode CLI TUI residual contract slice; **live OpenCode CLI TUI / live Chrome not probed**).
- Full UAT ownership remains with `/verify-work` (do not flip DONE).
- **No fake live OpenCode / browser PASS.**

## UAT probes (FRAMEWORK_KIT_REPO=1 — honest classification)

Applicable probe class: **`contract_tests_primary`**. Live OpenCode CLI TUI / browser: **`UAT_PROBE_FORBIDDEN`**.

| Probe class | Classification | reason_code |
|---|---|---|
| `browser_smoke` | not probed | `UAT_PROBE_FORBIDDEN` |
| `api_health` | waived | `UAT_PROBE_FORBIDDEN` |
| `process_health` | waived | `UAT_PROBE_FORBIDDEN` |
| `cli_smoke` | waived (contract tests; live OpenCode CLI TUI forbidden) | `UAT_PROBE_FORBIDDEN` |
| `build` | waived (contract/parity recorded independently) | `UAT_PROBE_FORBIDDEN` |
| `manual_operator` | deferred to verify-work/release (live CLI re-probe) | `UAT_PROBE_FORBIDDEN` |

**Runtime browser evidence**: none. MCP `browser_navigate` **not run**. Live OpenCode CLI TUI **not started**.

## Runtime QA evidence (US-0065) — kit OpenCode residual slice

- `runtime_startup_command`: n/a (contract tests; no live OpenCode CLI TUI this phase)
- `runtime_stack_profile`: python (pytest residual live-dispatch contract)
- `runtime_mode`: local
- `runtime_health_target`: n/a
- `runtime_health_result`: not_applicable
- `runtime_log_summary`: n/a
- `runtime_retry_count`: 0
- `runtime_retry_ledger`: []
- `runtime_final_verdict`: pass
- `runtime_reason_code`: `UAT_PROBE_FORBIDDEN` for live-runtime / live OpenCode probes; slice health is contract tests + `convergence_smoke`
- `runtime_evidence_refs`: pytest bug0024 8/8; compose 37/37; `sprints/S0159/uat.json` `convergence_smoke`

## Generated-test evidence (US-0066)

- `generated_test_stack_profile`: python
- `generated_test_command`: `python -m pytest tests/bug0024_opencode_cli_tui_live_dispatch_residual_test.py` (+ compose batch)
- `generated_test_result`: pass
- `generated_test_output_ref`: this file § Independent checks (bug0024 8 passed 0.55s; compose 37 passed 0.76s)
- `generated_test_paths_ref`: `tests/bug0024_opencode_cli_tui_live_dispatch_residual_test.py`; `tests/bug0024_dispatch_harness.mjs`
- `generated_test_reason_code`: none (pass)

## Status confirmation (US-0045)

- backlog `### BUG-0024` Status: **OPEN**
- acceptance BUG-0024: **unchecked**
- AC-1..AC-8: **unchecked** (verify-work/closure)
- BUG-0022 / BUG-0027: **OPEN** (not mutated)
- BUG-0023 / 0021 / 0020 / 0019 / 0018: **DONE** (not reopened)
- intake evidence: **not mutated**

## Producer proof consumed (execute)

- `producer_runtime_proof_id=rp-auto-20260921-bug0024-execute-dev-20260921T195500Z-BUG-0024`
- Canonical hashed payload: `{"orchestrator_run_id":"auto-20260921-bug0024","phase_id":"execute","proof_issued_at":"2026-09-21T19:55:00Z","proof_ttl_seconds":3600,"role":"dev","runtime_proof_id":"rp-auto-20260921-bug0024-execute-dev-20260921T195500Z-BUG-0024"}`
- `producer_attested_proof_hash=E653C7B8616F101FB996D413493BABE5A8D979ADE3548FB8F2A26A47265DA356`
- Independent `compute_strict_proof_hash` recompute: **MATCH**
- `producer_proof_ttl=2026-09-21T20:55:00Z`, `consumed_at=2026-09-21T20:02:00Z` (before RUNTIME_PROOF_STALE)
- `producer_ttl_stale=false`
- `producer_fresh_context_marker=dev-BUG0024-execute-20260921T195500Z-fresh`

## Strict runtime proof (DEC-0038) — qa

- `orchestrator_run_id=auto-20260921-bug0024`
- `runtime_proof_id=rp-auto-20260921-bug0024-qa-qa-20260921T200200Z-BUG-0024`
- `phase_id=qa`, `role=qa`, `bug_id=BUG-0024`, `sprint_id=S0159`
- `proof_issued_at=2026-09-21T20:02:00Z`
- `proof_ttl_seconds=3600`, `proof_ttl=2026-09-21T21:02:00Z`
- `proof_hash=9582B1942C734F2FDAEE4582DC2F54B0CA80066C074170ABFDC3A4DC7D1E657E`
- Canonical payload: `{"orchestrator_run_id":"auto-20260921-bug0024","phase_id":"qa","proof_issued_at":"2026-09-21T20:02:00Z","proof_ttl_seconds":3600,"role":"qa","runtime_proof_id":"rp-auto-20260921-bug0024-qa-qa-20260921T200200Z-BUG-0024"}`
- `hash_recompute_confirmation=true`

## Strict runtime proof (DEC-0038) — plan-verify (ultra_lean merged)

- `runtime_proof_id=rp-auto-20260921-bug0024-plan-verify-qa-20260921T200200Z-BUG-0024`
- `phase_id=plan-verify`, `role=qa`
- `proof_issued_at=2026-09-21T20:02:00Z`, `proof_ttl=2026-09-21T21:02:00Z`
- `proof_hash=2308F89EFBF95B0D32E94E77BD631CA1AFD29FFC6843599238A58170070A0155`
- Canonical payload: `{"orchestrator_run_id":"auto-20260921-bug0024","phase_id":"plan-verify","proof_issued_at":"2026-09-21T20:02:00Z","proof_ttl_seconds":3600,"role":"qa","runtime_proof_id":"rp-auto-20260921-bug0024-plan-verify-qa-20260921T200200Z-BUG-0024"}`

## Isolation evidence (US-0048 / DEC-0029 / US-0104 v2)

- `phase_id=qa`, `role=qa`, `model_id=inherit` (CROSS_MODEL_REVIEW=0)
- `fresh_context_marker=qa-BUG0024-qa-20260921T200200Z-fresh` (NEW per US-0048 / BUG-0006)
- `timestamp=2026-09-21T20:02:00Z` (UTC wall-clock)
- `evidence_ref=sprints/S0159/qa-findings.md; sprints/S0159/plan-verify.json; sprints/S0159/uat.json; handoffs/qa_to_verify.md`
- Fresh qa subagent per BUG-0006; no `/verify-work` or `/execute` spawn from this subagent.

## Next scheduled phase

- `next_scheduled_phase=/verify-work` (fresh qa subagent per BUG-0006 — orchestrator-owned)
- `next_scheduled_role=qa`
- `stop_condition=STOP after qa PASS. Do NOT mark BUG-0024 DONE. Do NOT tick acceptance. Do NOT restore auto.md. Do NOT reopen BUG-0023/0021. Do NOT merge/drain BUG-0022/0027. Do NOT git push.`
