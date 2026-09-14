# Sprint S0148 — UAT (BUG-0023) — populated at /verify-work (DEC-0009)

- **uat_lifecycle**: populated (verify-work PASS; DEC-0009 qa_seeded → populated complete; verified-ready for `/release`)
- **sprint_id**: S0148
- **bug_refs**: BUG-0023
- **phase**: verify-work (build+verify macro)
- **role**: qa (fresh per BUG-0006)
- **orchestrator_run_id**: auto-20260913-bug0023
- **parent_orchestrator_run_id**: cursor-20260913-BUG0023-intake
- **delivery_mode**: ultra_lean
- **macro_phase**: build+verify
- **story_type**: code (OpenCode CLI TUI dispatch Rpc.define contract-test slice; FRAMEWORK_KIT_REPO=1)
- **fresh_context_marker**: `qa-BUG0023-verify-work-20260914T005500Z-fresh`
- **timestamp**: 2026-09-14T00:55:00Z (UTC)
- **model_id**: cursor-grok-4.6-high (CROSS_MODEL_REVIEW=1 — required; MODEL_RESOLVE_FALLBACK catalog `gpt-5.6-sol-high` → Task slug `cursor-grok-4.6-high`)
- **producer_phase_id**: qa (role=qa; **QA_PASS**; `blocking_count=0`)
- **critic_phase_id**: sovereign-critic of qa (tech-lead, composer-2.5; **CRITIC_PASS**; anti_slop=10; marker `tl-BUG0023-critic-qa-20260914T005000Z-fresh`; degraded_mode=false)
- **verdict**: **PASS** (verify-work) — UAT 10/10 pass, 0 fail (AC-1..AC-9 → UAT-1..UAT-9 + canonical `convergence_smoke`); independent pytest **37 passed in 0.77s**; 6 live-runtime classes `UAT_PROBE_FORBIDDEN`. Producer consume = qa `004500Z` / `AC810B53913132F5B0A5F256DC3689AF80F95EFD065682A24443C4A8A180E850`. **No fake browser PASS.** **No live OpenCode CLI TUI PASS.**
- **total_steps**: 10 (UAT-1..UAT-9 + canonical `convergence_smoke`)
- **passed**: 10 | **failed**: 0
- **bug_status**: OPEN (do not mark BUG-0023 DONE — US-0045; acceptance BUG-0023 unchecked)
- **acceptance_row**: unchecked (`docs/product/acceptance.md` `- [ ] BUG-0023`)
- **backlog_ACs**: AC-1..AC-9 remain ticked from QA (slice; independently re-verified this pass)
- **blocking_findings**: 0
- **non_blocking_findings**: 4 (NB1..NB3 critic of qa + NB4 residual live DISPATCH — informational)
- **live_opencode_cli_tui_pass_claimed**: false
- **harness_fail_zero_claimed**: false
- **browser_probe_used**: false (no fake browser PASS)
- **contract_test_failed**: 0
- **runtime_proof_id**: `rp-auto-20260913-bug0023-verify-work-qa-20260914T005500Z-BUG-0023`
- **proof_hash**: `A2735C5DFBC97091CAEFC2A29D4EA2E481F9E3C9F593BF0DC8FA8B93AA2B5580`

## Probe class — OpenCode CLI TUI dispatch contract slice

BUG-0023 is a kit CLI TUI dispatch / `Rpc.define` contract-test slice. Applicable probe: `contract_tests_primary` (8 `test_bug0023_*` markers + bug0021/0020/0019/0018 compose). No web UI. Six live-runtime classes waived with **`UAT_PROBE_FORBIDDEN`**. **No silent browser PASS.** MCP browser sequence not run. No live OpenCode CLI TUI invoke. No `.env`. No credentials filled. No intake mutation. Did not mutate `sprints/S0126/uat.json` or `sprints/S0146/uat.json` or `sprints/S0147/uat.json`.

`scripts/uat_probe_lib.py` `classify_step` on AC texts: UAT-1/UAT-2/UAT-3/UAT-4/UAT-5/UAT-7/UAT-8/UAT-9 → `UAT_PROBE_UNRESOLVED`; UAT-6 (`Tests mock-invoke`) → `test`. Kit `TEST_COMMAND` was **not** executed. Evidence is scoped pytest compose.

Canonical surrogate step `id=convergence_smoke` kept `result=pass` because `contract_test_failed=0` (8/8 `test_bug0023_*` + compose 37/37).

## Target bug + acceptance criteria (architecture `# BUG-0023` Axis A)

- **BUG-0023** — OpenCode CLI TUI listed `/auto` toasts OPENCODE_AUTO_TUI_DISPATCH_UNSUPPORTED (dispatch live-falsified)
  - **Primary** (`docs/product/acceptance.md`): Listed OpenCode CLI TUI `/auto` starts plugin execute / TUI `run()` → `runAutoLifecycle` (or documented `OPENCODE_*` only when host truly cannot dispatch). Must not restore STOP-only `auto.md`. Must not JSON-template `/auto`. — **PASS** (slice; mock+inspection); checkbox **unchecked**
  - [x] AC-1: Listed CLI TUI `/auto` starts `runAutoLifecycle` (Rpc.define + client.rpc(Defined) + await register) — **slice PASS** (mock+inspection). Live CLI TUI not probed; residual DISPATCH possible until operator re-probe.
  - [x] AC-2: Fail-closed `OPENCODE_*` only when host truly cannot dispatch
  - [x] AC-3: Must not restore STOP-only `auto.md`
  - [x] AC-4: Must not JSON-template `/auto`
  - [x] AC-5: Plugin `editor.add` execute retained
  - [x] AC-6: Tests mock-invoke, not listing/token-only
  - [x] AC-7: Consumer upgrade overwrites dispatch path + still prunes leftover `auto.md`
  - [x] AC-8: Active↔template parity
  - [x] AC-9: Invented POST `{ input }` is not the happy path

## UAT step results (verify-work)

| Step | AC | Result | Evidence |
|------|----|--------|----------|
| UAT-1 | AC-1 | pass | markers 1+2+4; mock invoke; live TUI `UAT_PROBE_FORBIDDEN` |
| UAT-2 | AC-2 | pass | marker 6 |
| UAT-3 | AC-3 | pass | marker 5; auto.md absent; 14 peer md |
| UAT-4 | AC-4 | pass | marker 5; no JSON template |
| UAT-5 | AC-5 | pass | markers 4+5; editor.add retained |
| UAT-6 | AC-6 | pass | marker 2; mock harness invoke; classify_step=`test` (kit TEST_COMMAND not executed) |
| UAT-7 | AC-7 | pass | marker 8 |
| UAT-8 | AC-8 | pass | marker 7; `--scope bug-0023` OK |
| UAT-9 | AC-9 | pass | marker 3; invented POST absent |
| convergence_smoke | surrogate | pass | `contract_test_failed=0`; 6 waived `UAT_PROBE_FORBIDDEN` |

## Results summary (AC-1..AC-9)

UAT-1..UAT-9 each map 1:1 to AC-1..AC-9 and all **pass**. Canonical `convergence_smoke` **pass** because `contract_test_failed=0`. Combined: **10 passed / 0 failed** (`passed` + `failed` = `total`). Primary acceptance row remains **unchecked** (closure ownership). Status remains **OPEN**.

## Contract test markers (8) — verify-work live re-run

`python -m pytest tests/bug0023_opencode_cli_tui_dispatch_rpc_test.py tests/bug0021_opencode_cli_tui_plugin_load_test.py tests/bug0020_opencode_desktop_command_info_listing_test.py tests/bug0019_opencode_auto_slash_listing_test.py tests/bug0018_opencode_auto_ownership_test.py -v` — **37 passed** in 0.77s (bug0023 **8/8**; bug0021 **8/8**; bug0020 **8/8**; bug0019 **7/7**; bug0018 **6/6**) (2026-09-14T00:55:00Z).

1. `test_bug0023_rpc_define_shared_contract` — PASS
2. `test_bug0023_dispatch_mock_invokes_runAutoLifecycle` — PASS
3. `test_bug0023_http_fallback_is_client_rpc_not_invented_post` — PASS
4. `test_bug0023_orchestrator_await_register_defined_rpc` — PASS
5. `test_bug0023_keep_editor_add_no_auto_md` — PASS
6. `test_bug0023_dispatch_token_only_when_rpc_absent` — PASS
7. `test_bug0023_active_template_parity` — PASS
8. `test_bug0023_upgrade_copies_dispatch_still_prunes_auto_md` — PASS

Compose: bug0021 **8/8**, bug0020 **8/8**, bug0019 **7/7**, bug0018 **6/6**.

Parity: `python scripts/check_intake_template_parity.py --repo . --scope bug-0023` → `[INTAKE_TEMPLATE_PARITY_OK]`.

Live OpenCode CLI TUI listing/invoke remains **`UAT_PROBE_FORBIDDEN`**. Do not start OpenCode CLI TUI as AC PASS. No fake browser PASS. Operator-owned live re-probe after ship.
