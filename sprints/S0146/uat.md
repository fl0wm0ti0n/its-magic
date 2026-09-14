# Sprint S0146 — UAT (BUG-0021) — populated at /verify-work (DEC-0009)

- **uat_lifecycle**: populated (verify-work PASS; DEC-0009 qa_seeded → populated complete; verified-ready for `/release`)
- **sprint_id**: S0146
- **bug_refs**: BUG-0021
- **phase**: verify-work (build+verify macro)
- **role**: qa (fresh per BUG-0006)
- **orchestrator_run_id**: auto-20260913-bug0021
- **parent_orchestrator_run_id**: cursor-20260913-BUG0021-intake
- **delivery_mode**: ultra_lean
- **macro_phase**: build+verify
- **story_type**: code (OpenCode CLI TUI plugin-load / keymap / rpc contract-test slice; FRAMEWORK_KIT_REPO=1)
- **fresh_context_marker**: `qa-BUG0021-verify-20260913T134500Z-fresh`
- **timestamp**: 2026-09-13T13:45:00Z (UTC)
- **model_id**: cursor-grok-4.6-high (CROSS_MODEL_REVIEW=1 — required)
- **producer_phase_id**: qa (role=qa; **QA_PASS**; `blocking_count=0`)
- **critic_phase_id**: sovereign-critic of qa (tech-lead, composer-2.5; PASS; anti_slop=10; marker `tl-BUG0021-critic-qa-20260913T134100Z-fresh`; degraded_mode=false)
- **verdict**: **PASS** (verify-work) — UAT 11/11 pass, 0 fail (AC-1..AC-10 → UAT-1..UAT-10 + canonical `convergence_smoke`); live pytest compose suite **29 passed in 0.38s** (bug0021 **8/8**; bug0020 **8/8**; bug0019 **7/7**; bug0018 **6/6**); colliding `auto.md` absent; plugin `editor.add` retained; TUI `{ id, tui }` + `slashName: auto`; LOAD token + emit helper. Producer consume = qa `131000Z` / `5919A09DDA19AF51A4651856A5AEF5977D72584FFBB85BD18B9E7B8F92BB5BF7`. **No live OpenCode CLI TUI PASS. No fake browser PASS.**
- **total_steps**: 11 (UAT-1..UAT-10 + canonical `convergence_smoke`)
- **passed**: 11 | **failed**: 0
- **bug_status**: OPEN (do not mark BUG-0021 DONE — US-0045; acceptance BUG-0021 unchecked; intake JSON not mutated)
- **backlog_ACs**: AC-1..AC-10 remain ticked from QA; Status OPEN
- **blocking_findings**: 0
- **non_blocking_findings**: 3 (NB1..NB3 critic of qa carry-forwards — informational)
- **harness_fail_zero_claimed**: false (slice contract tests + compose are the required evidence)
- **browser_probe_used**: false (no fake browser PASS)
- **live_opencode_cli_tui_pass_claimed**: false
- **contract_test_failed**: 0
- **runtime_proof_id**: `rp-auto-20260913-bug0021-verify-work-qa-20260913T134500Z-BUG-0021`
- **proof_hash**: `C03DC931A5515D85234596C86FF270E005D42EA57E91E7924EB62CE2822ACF07`

## Probe class — OpenCode CLI TUI plugin load

BUG-0021 is a kit CLI TUI plugin-load / keymap / rpc contract-test slice. Applicable probe: `contract_tests_primary` (8 markers + BUG-0020/BUG-0019/BUG-0018 compose). User-facing validation: colliding `.opencode/commands/auto.md` remains absent; TUI default export `{ id, tui }` with `registerLayer` `slashName: "auto"` so the CLI TUI loader *would* list `/auto`; plugin `editor.add({ name: "auto", execute })` → `runAutoLifecycle` remains execute owner; listed-but-skipped fail-closed `OPENCODE_AUTO_CLI_TUI_PLUGIN_LOAD_UNSUPPORTED` (not silent miss; not TUI-toast-only; residual `#36505` documented, not a markdown restore). No web UI. Six live-runtime classes waived with **`UAT_PROBE_FORBIDDEN`**. **No silent browser PASS.** MCP browser sequence not run. **No live OpenCode CLI TUI host probe.** No `.env`.

Canonical surrogate step `id=convergence_smoke` kept `result=pass` because `contract_test_failed=0` (8/8 pytest + 8/8 + 7/7 + 6/6 compose).

## Target bug + acceptance criteria (architecture `# BUG-0021` Axis A)

- **BUG-0021** — OpenCode CLI TUI still has no invokable `/auto` after BUG-0020 tui.json
  - **Primary** (`docs/product/acceptance.md`): Operator can invoke a real OpenCode slash command `/auto` that starts plugin execute → `runAutoLifecycle` (or documented `OPENCODE_*`). Must not be LLM “Auto mode enabled”. Must not restore STOP-only `auto.md`. — **PASS** (contract surrogate); checkbox **unchecked**
  - AC-1: PASS — listed CLI TUI `/auto` via `{ id, tui }` + `slashName: "auto"` (UAT-1; live listing `UAT_PROBE_FORBIDDEN`)
  - AC-2: PASS — invocation → lifecycle or `OPENCODE_*` (UAT-2)
  - AC-3: PASS — no restore `auto.md` (UAT-3)
  - AC-4: PASS — no JSON `commands.auto` template (UAT-4)
  - AC-5: PASS — plugin `editor.add` retained (UAT-5)
  - AC-6: PASS — upgrade overwrite `tui.ts` + prune (UAT-6)
  - AC-7: PASS — active↔template parity (UAT-7)
  - AC-8: PASS — peers remain listed (UAT-8)
  - AC-9: PASS — loader/keymap/rpc contracts, not path-only (UAT-9)
  - AC-10: PASS — `#36505` residual documented (UAT-10)

## UAT step results (verify-work)

| Step | AC | Result | Evidence |
|------|----|--------|----------|
| UAT-1 | AC-1 | pass | markers 1+2+6; `{ id, tui }` + `slashName: auto`. Live CLI TUI listing **not claimed**. |
| UAT-2 | AC-2 | pass | markers 3+5; rpc → `runAutoLifecycle`; LOAD token |
| UAT-3 | AC-3 | pass | marker 4; active+template `auto.md` absent |
| UAT-4 | AC-4 | pass | marker 4; no JSON `commands.auto` template; no `cli.json` |
| UAT-5 | AC-5 | pass | marker 3; orchestrator `editor.add` retained; `index.ts` no `editor.add` |
| UAT-6 | AC-6 | pass | marker 8; overwrite reshaped `tui.ts` + prune leftover `auto.md` |
| UAT-7 | AC-7 | pass | marker 7; `--scope=bug-0021` OK |
| UAT-8 | AC-8 | pass | 14 peer `.md`; keep surfaces present |
| UAT-9 | AC-9 | pass | 8 `test_bug0021_*` loader/keymap/rpc contracts |
| UAT-10 | AC-10 | pass | marker 5; `#36505` residual documented; no `auto.md` restore |
| convergence_smoke | surrogate | pass | `contract_test_failed=0`; 6 waived probes `UAT_PROBE_FORBIDDEN` |

## Contract test markers (8) — verify-work live re-run

`python -m pytest tests/bug0021_opencode_cli_tui_plugin_load_test.py tests/bug0020_opencode_desktop_command_info_listing_test.py tests/bug0019_opencode_auto_slash_listing_test.py tests/bug0018_opencode_auto_ownership_test.py -v` — **29 passed** in 0.38s (**8/8** `test_bug0021_*`; **8/8** `test_bug0020_*`; **7/7** `test_bug0019_*`; **6/6** `test_bug0018_*`) (2026-09-13T13:45:00Z).

1. `test_bug0021_tui_default_export_id_tui_shape` — PASS
2. `test_bug0021_registerLayer_name_slashName_palette_key` — PASS
3. `test_bug0021_run_rpc_to_runAutoLifecycle` — PASS
4. `test_bug0021_no_auto_md_no_json_template` — PASS
5. `test_bug0021_fail_closed_load_token` — PASS
6. `test_bug0021_slash_list_is_keymap_not_command_info` — PASS
7. `test_bug0021_active_template_parity` — PASS
8. `test_bug0021_upgrade_copies_tui_shape_still_prunes_auto_md` — PASS

## User-facing validation (this phase)

| Check | Result |
|-------|--------|
| Listed CLI TUI `/auto` (contract `{ id, tui }` + `slashName`) | **PASS** (surrogate) — **not** a live OpenCode CLI TUI PASS |
| Invocation → `runAutoLifecycle` or `OPENCODE_*` | **PASS** (rpc dispatch + LOAD token) |
| No STOP-only `auto.md` restore | **PASS** |
| `#36505` residual documented | **PASS** — token + runbook; not a markdown restore |
| Live OpenCode CLI TUI listing/invoke | **`UAT_PROBE_FORBIDDEN`** — not attempted; no operator evidence |

## Waived live-runtime probes

| Probe class | reason_code |
|---|---|
| `browser_smoke` | `UAT_PROBE_FORBIDDEN` |
| `api_health` | `UAT_PROBE_FORBIDDEN` |
| `process_health` | `UAT_PROBE_FORBIDDEN` |
| `cli_smoke` | `UAT_PROBE_FORBIDDEN` |
| `build` | `UAT_PROBE_FORBIDDEN` |
| `manual_operator` | `UAT_PROBE_FORBIDDEN` |

## Results summary vs acceptance

All 10 architecture ACs map to UAT-1..UAT-10 and passed via `contract_tests_primary`. Primary `docs/product/acceptance.md` BUG-0021 row remains **unchecked** (closure ownership). Status remains **OPEN**. Next: `/release` (fresh release; after sovereign-critic of verify-work).

## QA parity-reconfirm (2026-09-13T14:40:00Z)

- **phase_id**: qa, **role**: qa, **marker**: `qa-BUG0021-qa-parity-20260913T144000Z-fresh`
- **verdict**: QA_PASS — independent pytest **29/29** (0.38s); `--scope bug-0021` OK; runbook twins byte-identical 246049 bytes CRLF
- **UAT**: 11/11 held from verify-work; `convergence_smoke` pass; six live classes `UAT_PROBE_FORBIDDEN`; **no live CLI TUI PASS**; **no fake browser PASS**
- **proof**: `rp-auto-20260913-bug0021-qa-qa-20260913T144000Z-BUG-0021` / `1FDF8443981CD74DDBBA22BEF4569D3ECA017D86FFF6B3BE0C9160957EC1F924` (13:10 qa proof not reused)
- **Status**: OPEN; AC-1..AC-10 remain ticked; acceptance.md unchecked
- **Next**: sovereign-critic (qa) then `/closure` (release already PASS; do not re-release; do not flip DONE)
