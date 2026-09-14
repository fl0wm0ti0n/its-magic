# Release Notes — S0146 / BUG-0021

- **Sprint**: `S0146`
- **Bug**: `BUG-0021` — OpenCode CLI TUI still has no invokable `/auto` after BUG-0020 tui.json (Axis A: reshape `tui.ts` to `{ id, tui }` + `registerLayer` `slashName: "auto"` + rpc → `runAutoLifecycle`; keep `editor.add`; LOAD token + `#36505` residual)
- **Release date**: `2026-09-13T14:15:00Z` (UTC)
- **orchestrator_run_id**: `auto-20260913-bug0021`
- **delivery_mode**: `ultra_lean`
- **macro_phase**: `ship` (release is phase 1 of 3: release → sovereign-critic (release) → closure per native chain)
- **policy_mode**: `confirm` (`RELEASE_PUBLISH_MODE=confirm`; `RELEASE_PUBLISH_AUTO_CONFIRM=0` → no publish execution)
- **trigger_source**: `auto`
- **branch**: `local` (no push; `SYNC_POLICY_MODE=disabled` per DEC-0018)
- **fresh_context_marker**: `rel-BUG0021-release-20260913T141500Z-fresh`
- **model_id**: `composer-2.5-fast` (CROSS_MODEL_REVIEW=1 — required; catalog `roles.release` hit)
- **runtime_proof_id**: `rp-auto-20260913-bug0021-release-release-20260913T141500Z-BUG-0021`
- **proof_hash**: `A2ABBD7C9D50F937024ED4E829DD6323DEEE6D2D43B9B8C5DD4317FDBAF39EEB`
- **proof_ttl**: `2026-09-13T15:15:00Z` (UTC)
- **release_version**: (none — workflow-only release; no semver bump)

## Verdict

**RELEASE_PASS.** All mandatory release gates (1, 2, 3, 4, 4b) green with **scoped pytest 29/29** (bug0021 **8/8**; bug0020 **8/8**; bug0019 **7/7**; bug0018 **6/6**). Queue row S0146 → `released`. No backlog Status mutation (closure owns OPEN→DONE + acceptance tick per US-0120 / DEC-0082). No npm / GitHub / Homebrew / Chocolatey publish.

Gate-1 evidence: live scoped slice + US-0071 metadata. **`harness_fail_zero_claimed=false`** — full `tests/run-tests.ps1` was not re-run this pass.

## Summary

BUG-0021 ships Axis A CLI TUI plugin-load reshape (approach D5 / R-0134):

- `.opencode/plugins/its-magic-auto/tui.ts` default export `{ id: "its-magic.auto.tui", tui }` (not `Plugin.define` as TUI default).
- `registerLayer` with `name` / `slashName: "auto"` / `namespace: "palette"` / `ctrl+shift+a`.
- `run()` → `api.client.rpc(ITS_MAGIC_AUTO_RPC)` → `runAutoLifecycle`.
- Keep `.opencode/tui.json` listing (load path ≠ listing proof); keep plugin `editor.add({ name: "auto", execute })`.
- Additive `OPENCODE_AUTO_CLI_TUI_PLUGIN_LOAD_UNSUPPORTED` + `emitCliTuiPluginLoadUnsupported` (not TUI-toast-only; after `editor.add`).
- Colliding `.opencode/commands/auto.md` remains absent; no JSON `commands.auto` template; upgrade overwrites reshaped `tui.ts` and still prunes leftover `auto.md`.
- Residual [opencode#36505](https://github.com/anomalyco/opencode/issues/36505) documented in runbook — **not** a markdown restore.

FRAMEWORK_KIT_REPO=1 — UAT probe class `contract_tests_primary`; 6 live-runtime classes waived `UAT_PROBE_FORBIDDEN`. **No live OpenCode CLI TUI listing/invoke PASS.** No fake browser PASS.

## ACs satisfied (QA + verify-work, UAT 11/11)

**10/10 PASS** (live pytest 8/8 + compose 8/8 + 7/7 + 6/6):

| AC | Description | Status |
|----|-------------|--------|
| AC-1 | Listed CLI TUI `/auto` via `{ id, tui }` + `slashName: "auto"` | PASS (contract; live listing `UAT_PROBE_FORBIDDEN`) |
| AC-2 | Invocation → `runAutoLifecycle` or documented `OPENCODE_*` | PASS |
| AC-3 | Must not restore STOP-only `auto.md` | PASS |
| AC-4 | Must not JSON-template `/auto` | PASS |
| AC-5 | Plugin `editor.add` execute retained | PASS |
| AC-6 | Consumer upgrade overwrites reshaped `tui.ts` + still prunes `auto.md` | PASS |
| AC-7 | Active↔template parity | PASS |
| AC-8 | Peers remain listed | PASS |
| AC-9 | Tests are loader/keymap/rpc contracts, not path-only | PASS |
| AC-10 | `#36505` residual documented, not a markdown restore | PASS |

## Test results (release — live this pass)

- **BUG-0021 + compose live pytest**: `python -m pytest tests/bug0021_opencode_cli_tui_plugin_load_test.py tests/bug0020_opencode_desktop_command_info_listing_test.py tests/bug0019_opencode_auto_slash_listing_test.py tests/bug0018_opencode_auto_ownership_test.py -v` → **29 passed** in 0.37s (bug0021 **8/8**; bug0020 **8/8**; bug0019 **7/7**; bug0018 **6/6**).
- **Parity**: `python scripts/check_intake_template_parity.py --repo . --scope=bug-0021` → `[INTAKE_TEMPLATE_PARITY_OK]`.
- **Metadata guard**: `python scripts/check-user-visible-metadata.py --repo .` → exit 0.
- **Canonical harness**: **not re-run**; `harness_fail_zero_claimed=false`.

## Gate summary

| Gate | Result |
|------|--------|
| check_in_tests | **PASS** (scoped 29/29 + US-0071 metadata; `harness_fail_zero_claimed=false`) |
| qa | PASS (`sprints/S0146/qa-findings.md`; 0 blockers; NB1..NB3 informational) |
| verify_work | PASS (`sprints/S0146/uat.json` verdict=PASS; 10/10 ACs; 11/11 UAT incl `convergence_smoke`; 29/29 contract live) |
| uat | PASS (11/11; populated; `contract_tests_primary`; 6 live-runtime classes `UAT_PROBE_FORBIDDEN`) |
| isolation_evidence | PASS (execute archived + qa + verify-work + sovereign-critic(verify-work) + release; distinct markers; `model_id` set) |
| strict_runtime_proof | **PASS** (verify-work `rp-auto-20260913-bug0021-verify-work-qa-20260913T134500Z-BUG-0021` TTL `2026-09-13T14:45:00Z` consumed @ `14:15:00Z`; proof_hash recomputed MATCH `C03DC931A5515D85234596C86FF270E005D42EA57E91E7924EB62CE2822ACF07`; critic of verify-work PASS `2211F95E8EB5215630A015A9D811B9C130A5DF0FE8DB00D72B3FF4C214631695`) |
| readme_feature_coverage_3f | skipped (`README_FEATURE_COVERAGE_ENFORCE=0`) |
| project_readme_3g | skipped (`FRAMEWORK_KIT_REPO=1`) |
| metadata_guard | PASS |
| triad_regression | skipped (no state rollover required this pass) |
| backlog_reconciliation | not performed (closure owns per US-0120 / DEC-0082) |
| publish | skipped (`RELEASE_PUBLISH_MODE=confirm`; `RELEASE_PUBLISH_AUTO_CONFIRM=0`) |
| sync | not_eligible (`SYNC_POLICY_MODE=disabled`) |
| finalization | **PASS** (queue row S0146 = `released`) |

## Run

```powershell
# BUG-0021 CLI TUI plugin-load contract (8/8) + BUG-0020 compose (8/8) + BUG-0019 (7/7) + BUG-0018 (6/6):
python -m pytest tests/bug0021_opencode_cli_tui_plugin_load_test.py tests/bug0020_opencode_desktop_command_info_listing_test.py tests/bug0019_opencode_auto_slash_listing_test.py tests/bug0018_opencode_auto_ownership_test.py -v
#   Expected: 29 passed (bug0021 8/8; bug0020 8/8; bug0019 7/7; bug0018 6/6)

python scripts/check_intake_template_parity.py --repo . --scope=bug-0021
#   Expected: [INTAKE_TEMPLATE_PARITY_OK]

python scripts/check-user-visible-metadata.py --repo .
#   Expected: exit 0 (silent PASS)
```

Start command for the shipped pack (OpenCode CLI TUI plugin-load / keymap / rpc contract-test kit — not a long-running HTTP service):

```bash
python -m pytest tests/bug0021_opencode_cli_tui_plugin_load_test.py tests/bug0020_opencode_desktop_command_info_listing_test.py tests/bug0019_opencode_auto_slash_listing_test.py tests/bug0018_opencode_auto_ownership_test.py -v
```

- **start_command**: `python -m pytest tests/bug0021_opencode_cli_tui_plugin_load_test.py tests/bug0020_opencode_desktop_command_info_listing_test.py tests/bug0019_opencode_auto_slash_listing_test.py tests/bug0018_opencode_auto_ownership_test.py -v` (operator validation; live OpenCode CLI TUI probe not required for this CI slice)
- **runtime_mode**: `local`
- **runtime_context_ref**: `docs/engineering/runbook.md` `### OpenCode CLI TUI `/auto` after tui.json listing (BUG-0021 / R-0134)`; `docs/engineering/architecture.md` `# BUG-0021`

## Connect

- **service_url**: `n/a` (OpenCode CLI TUI plugin-load / contract-test kit — no service endpoint)
- **service_port**: `n/a`
- **health_endpoint**: `n/a` (health = contract tests, not HTTP)

## Verify

1. `python -m pytest tests/bug0021_opencode_cli_tui_plugin_load_test.py tests/bug0020_opencode_desktop_command_info_listing_test.py tests/bug0019_opencode_auto_slash_listing_test.py tests/bug0018_opencode_auto_ownership_test.py -v` → 29 passed (8+8+7+6)
2. `python scripts/check_intake_template_parity.py --repo . --scope=bug-0021` → `[INTAKE_TEMPLATE_PARITY_OK]`
3. `python scripts/check-user-visible-metadata.py --repo .` → exit 0
4. Spot-check: `.opencode/commands/auto.md` absent (active + template); `.opencode/tui.json` lists `./plugins/its-magic-auto/tui.ts`; `tui.ts` exports `{ id, tui }` + `slashName: "auto"`; plugin `editor.add({ name: "auto", execute })` retained; `OPENCODE_AUTO_CLI_TUI_PLUGIN_LOAD_UNSUPPORTED` + runbook `#36505`; keep `.opencode/agents/auto.md` and `.cursor/commands/auto.md`
5. Consumers: `its-magic --mode upgrade --host opencode|both` overwrites reshaped `tui.ts` and still prunes leftover `auto.md`; restart OpenCode CLI TUI (`opencode`, **not** `--pure`) for operator `/auto` listing — or documented `OPENCODE_*` if binary predates v2 external TUI plugin activation

**expected_health_signal**: all 8 `test_bug0021_*` markers PASS; bug0020/0019/0018 compose green; metadata guard exit 0; colliding `auto.md` absent; LOAD token present; backlog BUG-0021 remains OPEN until `/closure`.

## Credentials

- **credential_source_refs**: `n/a` (no API keys required for contract-test verify; no live provider)
- **expected_value_source**: operator OpenCode host + local kit checkout; no inline secrets

## Known Issues

None blocking.

- **NB-1** (informational): Axis A reshape fixes loader contract; **live operator OpenCode CLI TUI `/auto` listing not probed in CI** (`UAT_PROBE_FORBIDDEN`). Residual [opencode#36505](https://github.com/anomalyco/opencode/issues/36505) → `OPENCODE_AUTO_CLI_TUI_PLUGIN_LOAD_UNSUPPORTED` on listed-but-skipped binaries; **do not** restore `auto.md`.
- **NB-2** (informational): `tui.json` listing is load path, not proof; desktop Command.Info token from BUG-0020 remains; qa/verify-work critic NBs informational.
- **NB-3** (informational): Do not mark BUG-0021 DONE at release; do not tick acceptance; do not reopen BUG-0020; do not mutate BUG-0022 / US-0139 / US-0140; no companion DEC; harness Fail:0 not claimed.

## Evidence refs

- `sprints/S0146/qa-findings.md` (QA_PASS)
- `sprints/S0146/uat.json`, `sprints/S0146/uat.md` (verify-work PASS)
- `sprints/S0146/summary.md`
- `sprints/S0146/release-findings.md`
- `sprints/S0146/verify-work-verdict.json`
- `docs/engineering/state.md` (execute archived + qa + verify-work + sovereign-critic / release checkpoints)

## Next phase

**sovereign-critic (release)** then **`/closure`** (fresh **qe** subagent, ship macro phase 2 of 3 per DEC-0082). Release does **not** spawn closure. Backlog BUG-0021 remains **OPEN**; acceptance BUG-0021 remains **unchecked** until closure.
