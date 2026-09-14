# Verify-Work Findings — S0146 / BUG-0021

**Phase**: verify-work  
**Role**: qa (fresh subagent)  
**Bug**: BUG-0021 (OpenCode CLI TUI still has no invokable `/auto` after BUG-0020 tui.json — C-limb live-falsified)  
**Sprint**: S0146  
**Orchestrator run**: auto-20260913-bug0021  
**Parent run**: cursor-20260913-BUG0021-intake  
**Verify-work timestamp**: 2026-09-13T13:45:00Z  
**Fresh context marker**: qa-BUG0021-verify-20260913T134500Z-fresh  
**model_id**: cursor-grok-4.6-high (CROSS_MODEL_REVIEW=1)  
**delivery_mode**: ultra_lean  
**macro_phase**: build+verify (verify-work terminal)  
**AUTO_QUIET**: 1  
**FRAMEWORK_KIT_REPO**: 1  
**Verdict**: VERIFY_WORK_PASS  

## Independent verify-work verification

Fresh QA subagent per US-0048 / BUG-0006. Marker is **new** (not reused `qa-BUG0021-qa-20260913T131000Z-fresh`, `dev-BUG0021-execute-20260913T125000Z-fresh`, `tl-BUG0021-critic-execute-20260913T130500Z-fresh`, or `tl-BUG0021-critic-qa-20260913T134100Z-fresh`). Context limited to artifacts/handoffs (narrow-read). Independent re-run of contract + file-absence + TUI `{ id, tui }` + registerLayer + rpc + plugin-attach + LOAD token gates. UAT populated from AC-1..AC-10 + canonical `convergence_smoke`. Six live-runtime classes `UAT_PROBE_FORBIDDEN`. **No fake browser PASS.** **No live OpenCode CLI TUI listing/invoke PASS.** No `.env`. No DONE flip. Consumed qa proof `rp-auto-20260913-bug0021-qa-qa-20260913T131000Z-BUG-0021` / `5919A09DDA19AF51A4651856A5AEF5977D72584FFBB85BD18B9E7B8F92BB5BF7` MATCH before TTL 14:10. Execute proof MATCH before TTL 13:50. Critic of QA PASS (0 blocking; anti_slop=10; `bug0021qa-*`; degraded_mode=false). plan-verify SKIPPED (ultra_lean placeholder overwritten PASS at /qa; not spawned). Discrepancies vs QA: **NONE**.

## Test battery (live)

| Gate | Command / method | Result |
|------|------------------|--------|
| BUG-0021 + BUG-0020 + BUG-0019 + BUG-0018 compose | `python -m pytest tests/bug0021_opencode_cli_tui_plugin_load_test.py tests/bug0020_opencode_desktop_command_info_listing_test.py tests/bug0019_opencode_auto_slash_listing_test.py tests/bug0018_opencode_auto_ownership_test.py -v` | **29 passed** in 0.38s (bug0021 **8/8**; bug0020 **8/8**; bug0019 **7/7**; bug0018 **6/6**) |
| Colliding auto.md | path exists? active + template `.opencode/commands/auto.md` | **absent** |
| Keep surfaces | `.opencode/agents/auto.md`, `.cursor/commands/auto.md` | **present** |
| Remaining markdown commands | `.opencode/commands/*.md` | **14** (no `auto.md`) |
| Plugin attach | `editor.add` + `name: "auto"` + `runAutoLifecycle` | **retained** |
| TUI default export | `.opencode/plugins/its-magic-auto/tui.ts` `export default { id: "its-magic.auto.tui", tui }` | **present**; **not** `Plugin.define` as TUI default |
| registerLayer | `slashName: "auto"` / `ctrl+shift+a` | **present** |
| CLI TUI load path | `.opencode/tui.json` lists `./plugins/its-magic-auto/tui.ts` | **present** (active + template); listing ≠ proof |
| Plugin-local tui.json / kit cli.json | path exists? | **absent** |
| Listing index | `its-magic-auto/index.ts` `editor.add` | **absent** |
| LOAD emit helper | `emitCliTuiPluginLoadUnsupported` | **present** (not TUI-toast-only; after `editor.add`) |
| LOAD token | `OPENCODE_AUTO_CLI_TUI_PLUGIN_LOAD_UNSUPPORTED` | **present** |
| Parity | `python scripts/check_intake_template_parity.py --repo . --scope=bug-0021` | **[INTAKE_TEMPLATE_PARITY_OK]** |
| UAT probe lib | `python scripts/uat_probe_lib.py --self-test` | **[UAT_PROBE_LIB_SELF_TEST_OK]** |
| Metadata | `python scripts/check-user-visible-metadata.py --repo .` | **exit 0** |
| QA proof consume | `compute_strict_proof_hash` 6-field tuple | **MATCH** `5919A09DDA19AF51A4651856A5AEF5977D72584FFBB85BD18B9E7B8F92BB5BF7`; ttl `2026-09-13T14:10:00Z`; consumed_at `2026-09-13T13:45:00Z` — **RUNTIME_PROOF_VALID** |
| Critic of qa proof | `compute_strict_proof_hash` | **MATCH** `B53F556EE36B86503A2377CD5F55993FCFB7FB7AB4DB33A6C0740EAE2901FCC3`; blocking_count=0; anti_slop=10; degraded_mode=false |
| Execute proof consume | `compute_strict_proof_hash` | **MATCH** `8690BA08357FB4BDF15D818DE55350A64AC68D50DCC486EB680DA918EC2F4165`; ttl `2026-09-13T13:50:00Z`; consumed_at `2026-09-13T13:45:00Z` — **RUNTIME_PROOF_VALID** |
| Acceptance row | `docs/product/acceptance.md` | `- [ ] BUG-0021` (not ticked) |
| Backlog | `### BUG-0021` Status | **OPEN**; AC-1..AC-10 remain ticked (QA; not flipped) |

## AC verification (architecture `# BUG-0021` Axis A)

| AC | Description | Result |
|----|-------------|--------|
| AC-1 | Operator can invoke listed CLI TUI `/auto` (Axis A `{ id, tui }` + `slashName: auto`) | **PASS** (UAT-1; live listing `UAT_PROBE_FORBIDDEN`) |
| AC-2 | Invocation starts `runAutoLifecycle` or documented `OPENCODE_*` | **PASS** (UAT-2) |
| AC-3 | Must not restore STOP-only `auto.md` | **PASS** (UAT-3) |
| AC-4 | Must not JSON-template `/auto` | **PASS** (UAT-4) |
| AC-5 | Plugin `editor.add` execute retained (compose BUG-0018 A*) | **PASS** (UAT-5) |
| AC-6 | Consumer upgrade overwrites reshaped `tui.ts` + still prunes leftover `auto.md` | **PASS** (UAT-6) |
| AC-7 | Active↔template parity | **PASS** (UAT-7) |
| AC-8 | Peers remain listed | **PASS** (UAT-8) |
| AC-9 | Tests are loader/keymap/rpc contracts, not `tui.json`-path-only | **PASS** (UAT-9) |
| AC-10 | `#36505` residual is documented, not a markdown restore | **PASS** (UAT-10) |

## User-facing validation

- **Listed CLI TUI `/auto` (contract `{ id, tui }` + `slashName`)**: PASS (surrogate) — **not** a live OpenCode CLI TUI PASS. Live listing/invoke classified **`UAT_PROBE_FORBIDDEN`**.
- **Invocation → `runAutoLifecycle` or `OPENCODE_*`**: PASS — `dispatchRunAutoLifecycle` → `api.client.rpc`; LOAD token + emit helper.
- **STOP-only `auto.md` not restored**: PASS — active + template `.opencode/commands/auto.md` absent; 14 peer commands remain.
- **`#36505` residual documented**: PASS — `OPENCODE_AUTO_CLI_TUI_PLUGIN_LOAD_UNSUPPORTED` + runbook; not a markdown restore.
- **No fake browser PASS**: held (CLI TUI plugin-load contract, not `browser_smoke`).

## UAT summary

- **Total**: 11 (UAT-1..UAT-10 + `convergence_smoke`)
- **Passed**: 11
- **Failed**: 0
- **uat_lifecycle**: populated (DEC-0009; verify-work re-attest; verified-ready for `/release`)
- **Probe class**: `contract_tests_primary`
- **Waived live probes**: 6 × `UAT_PROBE_FORBIDDEN` (`browser_smoke`, `api_health`, `process_health`, `cli_smoke`, `build`, `manual_operator`)
- **convergence_smoke**: pass (`contract_test_failed=0`)
- **harness_fail_zero_claimed**: false
- **live_opencode_cli_tui_pass_claimed**: false

## Isolation compliance gate

| Phase | Marker | Result |
|-------|--------|--------|
| execute | `dev-BUG0021-execute-20260913T125000Z-fresh` | PASS |
| qa | `qa-BUG0021-qa-20260913T131000Z-fresh` | PASS |
| verify-work | `qa-BUG0021-verify-20260913T134500Z-fresh` | PASS (this phase) |

## Runtime proofs (full `rp-auto-…`)

| Phase | runtime_proof_id | proof_hash |
|-------|------------------|------------|
| execute | `rp-auto-20260913-bug0021-execute-dev-20260913T125000Z-BUG-0021` | `8690BA08357FB4BDF15D818DE55350A64AC68D50DCC486EB680DA918EC2F4165` (MATCH; consumed 13:45 before ttl 13:50) |
| qa (consumed) | `rp-auto-20260913-bug0021-qa-qa-20260913T131000Z-BUG-0021` | `5919A09DDA19AF51A4651856A5AEF5977D72584FFBB85BD18B9E7B8F92BB5BF7` (MATCH; consumed 13:45 before ttl 14:10) |
| plan-verify | `rp-auto-20260913-bug0021-plan-verify-qa-20260913T131000Z-BUG-0021` | `A6595B6D869E88143709E744C753610F073AE5FC3FD87B6C315411649A7CE857` (ultra_lean SKIPPED placeholder overwritten PASS; not spawned) |
| critic of qa | `rp-auto-20260913-bug0021-sovereign-critic-techlead-20260913T134100Z-BUG-0021` | `B53F556EE36B86503A2377CD5F55993FCFB7FB7AB4DB33A6C0740EAE2901FCC3` (MATCH; 0 blocking; anti_slop=10; degraded_mode=false) |
| verify-work (issued) | `rp-auto-20260913-bug0021-verify-work-qa-20260913T134500Z-BUG-0021` | `C03DC931A5515D85234596C86FF270E005D42EA57E91E7924EB62CE2822ACF07` |

## Generated-test evidence (US-0066)

- `generated_test_stack_profile`: python
- `generated_test_command`: `python -m pytest tests/bug0021_opencode_cli_tui_plugin_load_test.py tests/bug0020_opencode_desktop_command_info_listing_test.py tests/bug0019_opencode_auto_slash_listing_test.py tests/bug0018_opencode_auto_ownership_test.py -v`
- `generated_test_result`: pass
- `generated_test_output_ref`: this file § Test battery (29 passed in 0.38s)
- `generated_test_paths_ref`: `tests/bug0021_opencode_cli_tui_plugin_load_test.py`; `sprints/S0146/summary.md` Test results
- `generated_test_reason_code`: none (pass)
- FRAMEWORK_KIT_REPO=1 kit contract tests (not generated-app scaffolds); do not fail `TEST_SCAFFOLD_GENERATION_FAILED`

## Status (US-0045)

- backlog Status: **OPEN** (not DONE)
- acceptance BUG-0021: **unchecked**
- AC-1..AC-10: **ticked** (QA; not flipped this phase)
- BUG-0015 / BUG-0016 / BUG-0017 / BUG-0018 / BUG-0019 / BUG-0020: DONE preserved (not reopened)
- BUG-0022: OPEN preserved (not mutated)
- US-0139: not mutated
- intake JSON: not mutated
- architecture.md `# BUG-0021` / `# BUG-0020` / R-0134: not mutated this phase

## Blocking findings

None.

## Non-blocking (informational)

| ID | Note |
|----|------|
| NB1 / bug0021qa-challenger-001 | qa + execute proofs MATCH+not-STALE; 8/8 + 8/8 + 7/7 + 6/6 independently re-verified; `#36505` LOAD residual; no live CLI TUI probe; harness_fail_zero_claimed=false |
| NB2 / bug0021qa-architect-002 | verify-work owns live TUI + acceptance closure; ultra_lean plan-verify PASS overwrite held; execute-critic NBs informational; uat.json 11/11 honest waived probes |
| NB3 / bug0021qa-subtractor-003 | no DONE / no companion DEC / no auto.md restore / no cli.json / no live CLI TUI probe / BUG-0022 / US-0139 untouched |

## Next

Sovereign-critic of verify-work then `/release` (fresh **release** subagent). STOP — do not spawn `/release` from this subagent. Do not mark BUG-0021 DONE. Do not tick acceptance.md. Do not claim live CLI TUI PASS.
