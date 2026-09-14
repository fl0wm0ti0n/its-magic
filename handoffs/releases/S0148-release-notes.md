# Release Notes — S0148 / BUG-0023

- **Sprint**: `S0148`
- **Bug**: `BUG-0023` — OpenCode CLI TUI listed `/auto` toasts `OPENCODE_AUTO_TUI_DISPATCH_UNSUPPORTED` (Axis A: shared `Rpc.define` `rpc.ts`; `await ctx.rpc.register`; TUI `client.rpc(Defined)` + `OpenCode.make` fallback; invented POST removed; upgrade overwrites `rpc.ts`/`tui.ts`/orchestrator; no `auto.md` restore)
- **Release date**: `2026-09-14T01:05:00Z` (UTC)
- **orchestrator_run_id**: `auto-20260913-bug0023`
- **delivery_mode**: `ultra_lean`
- **macro_phase**: `ship` (release is phase 1 of 3: release → sovereign-critic (release) → closure per native chain)
- **policy_mode**: `confirm` (`RELEASE_PUBLISH_MODE=confirm`; `RELEASE_PUBLISH_AUTO_CONFIRM=0` → no publish execution)
- **trigger_source**: `auto`
- **branch**: `local` (no push; `SYNC_POLICY_MODE=disabled` per DEC-0018)
- **fresh_context_marker**: `rel-BUG0023-release-20260914T010500Z-fresh`
- **model_id**: `composer-2.5-fast` (CROSS_MODEL_REVIEW=1 — required; catalog `roles.release` → Task slug `composer-2.5-fast`; MODEL_RESOLVE_FALLBACK)
- **producer_model_id**: `composer-2.5-fast`
- **runtime_proof_id**: `rp-auto-20260913-bug0023-release-release-20260914T010500Z-BUG-0023`
- **proof_hash**: `22EEF81C0AE735C983DDB4248FAD6A8D9ADDD12DD2A7D7AA2D7A9AFB6AB7E9F8`
- **proof_ttl**: `2026-09-14T02:05:00Z` (UTC)
- **release_version**: (none — workflow-only release; no semver bump)
- **npm_published**: `false`

## Verdict

**RELEASE_PASS.** All mandatory release gates (1, 2, 3, 4, 4b) green with **scoped pytest 37/37** (bug0023 **8/8**; bug0021 **8/8**; bug0020 **8/8**; bug0019 **7/7**; bug0018 **6/6**). Queue row S0148 → `released`. No backlog Status mutation (closure owns OPEN→DONE + acceptance tick per US-0120 / DEC-0082). No npm / GitHub / Homebrew / Chocolatey publish.

Gate-1 evidence: live scoped slice + US-0071 metadata + parity `--scope bug-0023`. **`harness_fail_zero_claimed=false`** — full `tests/run-tests.ps1` was not re-run this pass.

## Summary

BUG-0023 ships Axis A CLI TUI dispatch (approach A / R-0137):

- Shared `.opencode/plugins/its-magic-auto/rpc.ts` `Rpc.define({ id: "its-magic.auto", methods: { runAutoLifecycle } })`.
- Orchestrator **static**-imports `rpc.ts` and **`await ctx.rpc.register(ITS_MAGIC_AUTO_RPC, { runAutoLifecycle: runAutoLifecycleRpc })`** when register exists; keep `editor.add`.
- TUI **dynamic**-imports `rpc.ts` inside `dispatchRunAutoLifecycle` then `api.client.rpc(Defined).runAutoLifecycle(payload)` (not `{ input }`).
- `OpenCode.make({ baseUrl }).rpc(Defined)` fallback when `.rpc` missing; no silent `localhost:4096` default.
- Invented `POST /rpc/its-magic.auto/runAutoLifecycle` `{ input }` is **not** the happy path.
- `OPENCODE_AUTO_TUI_DISPATCH_UNSUPPORTED` only when client/RPC **truly** cannot dispatch.
- Colliding `.opencode/commands/auto.md` remains absent; keep `.opencode/agents/auto.md` + `.cursor/commands/auto.md`.
- Consumer upgrade: `its-magic --mode upgrade --host opencode|both` **overwrites** `rpc.ts`, `tui.ts`, orchestrator register path **and still prunes** leftover `auto.md`.

FRAMEWORK_KIT_REPO=1 — UAT probe class `contract_tests_primary`; 6 live-runtime classes waived `UAT_PROBE_FORBIDDEN`. **No live OpenCode CLI TUI invoke PASS.** No fake browser PASS.

## ACs satisfied (QA + verify-work, UAT 10/10)

**9/9 PASS** (live pytest 8/8 + compose 8/8 + 8/8 + 7/7 + 6/6):

| AC | Description | Status |
|----|-------------|--------|
| AC-1 | Listed CLI TUI `/auto` starts `runAutoLifecycle` | PASS (slice; mock+inspection; live CLI TUI `UAT_PROBE_FORBIDDEN`) |
| AC-2 | Fail-closed `OPENCODE_*` only when host cannot dispatch | PASS |
| AC-3 | Must not restore STOP-only `auto.md` | PASS |
| AC-4 | Must not JSON-template `/auto` | PASS |
| AC-5 | Plugin `editor.add` execute retained | PASS |
| AC-6 | Tests mock-invoke, not listing/token-only | PASS |
| AC-7 | Upgrade overwrites dispatch path + prunes leftover `auto.md` | PASS |
| AC-8 | Active↔template parity | PASS |
| AC-9 | Invented POST `{ input }` is not the happy path | PASS |

## Test results (release — live this pass)

- **BUG-0023 + compose live pytest**: `python -m pytest tests/bug0023_opencode_cli_tui_dispatch_rpc_test.py tests/bug0021_opencode_cli_tui_plugin_load_test.py tests/bug0020_opencode_desktop_command_info_listing_test.py tests/bug0019_opencode_auto_slash_listing_test.py tests/bug0018_opencode_auto_ownership_test.py -v` → **37 passed** in 0.79s (bug0023 **8/8**; bug0021 **8/8**; bug0020 **8/8**; bug0019 **7/7**; bug0018 **6/6**).
- **Parity**: `python scripts/check_intake_template_parity.py --repo . --scope bug-0023` → `[INTAKE_TEMPLATE_PARITY_OK]`.
- **Metadata guard**: `python scripts/check-user-visible-metadata.py --repo .` → exit 0.
- **Canonical harness**: **not re-run**; `harness_fail_zero_claimed=false`.

## Gate summary

| Gate | Result |
|------|--------|
| check_in_tests | **PASS** (scoped 37/37 + US-0071 metadata + parity; `harness_fail_zero_claimed=false`) |
| qa | PASS (`sprints/S0148/qa-findings.md`; 0 blockers; NB1..NB4 informational) |
| verify_work | PASS (`sprints/S0148/uat.json` verdict=PASS; 9/9 ACs; 10/10 UAT incl `convergence_smoke`; 37/37 contract live) |
| uat | PASS (10/10; populated; `contract_tests_primary`; 6 live-runtime classes `UAT_PROBE_FORBIDDEN`) |
| isolation_evidence | PASS (execute + qa + verify-work + sovereign-critic(verify-work) + release; distinct markers; `model_id` set) |
| strict_runtime_proof | **PASS** (verify-work `rp-auto-20260913-bug0023-verify-work-qa-20260914T005500Z-BUG-0023` TTL `2026-09-14T01:55:00Z` consumed @ `01:05:00Z`; proof_hash recomputed MATCH `A2735C5DFBC97091CAEFC2A29D4EA2E481F9E3C9F593BF0DC8FA8B93AA2B5580`; critic of verify-work PASS `25E0038A8239D6FC0F13261CB01137A2A251A202EDEE3DF547C4CB33188103E5`) |
| readme_feature_coverage_3f | FAIL_nonblocking (`README_FEATURE_COVERAGE_ENFORCE=1`; gaps BUG-0021, US-0135..US-0140) |
| project_readme_3g | skipped (`FRAMEWORK_KIT_REPO=1`) |
| metadata_guard | PASS |
| triad_regression | skipped (no state rollover required this pass) |
| backlog_reconciliation | not performed (closure owns per US-0120 / DEC-0082) |
| publish | skipped (`RELEASE_PUBLISH_MODE=confirm`; `RELEASE_PUBLISH_AUTO_CONFIRM=0`; `npm_published=false`) |
| sync | not_eligible (`SYNC_POLICY_MODE=disabled`) |
| finalization | **PASS** (queue row S0148 = `released`) |

## Run

```powershell
# BUG-0023 CLI TUI dispatch contract (8/8) + BUG-0021 compose (8/8) + BUG-0020 (8/8) + BUG-0019 (7/7) + BUG-0018 (6/6):
python -m pytest tests/bug0023_opencode_cli_tui_dispatch_rpc_test.py tests/bug0021_opencode_cli_tui_plugin_load_test.py tests/bug0020_opencode_desktop_command_info_listing_test.py tests/bug0019_opencode_auto_slash_listing_test.py tests/bug0018_opencode_auto_ownership_test.py -v
#   Expected: 37 passed (bug0023 8/8; bug0021 8/8; bug0020 8/8; bug0019 7/7; bug0018 6/6)

python scripts/check_intake_template_parity.py --repo . --scope bug-0023
#   Expected: [INTAKE_TEMPLATE_PARITY_OK]

python scripts/check-user-visible-metadata.py --repo .
#   Expected: exit 0 (silent PASS)
```

Start command for the shipped pack (OpenCode CLI TUI dispatch Rpc.define contract-test kit — not a long-running HTTP service):

```bash
python -m pytest tests/bug0023_opencode_cli_tui_dispatch_rpc_test.py tests/bug0021_opencode_cli_tui_plugin_load_test.py tests/bug0020_opencode_desktop_command_info_listing_test.py tests/bug0019_opencode_auto_slash_listing_test.py tests/bug0018_opencode_auto_ownership_test.py -v
```

- **start_command**: `python -m pytest tests/bug0023_opencode_cli_tui_dispatch_rpc_test.py tests/bug0021_opencode_cli_tui_plugin_load_test.py tests/bug0020_opencode_desktop_command_info_listing_test.py tests/bug0019_opencode_auto_slash_listing_test.py tests/bug0018_opencode_auto_ownership_test.py -v` (operator validation; live OpenCode CLI TUI probe not required for this CI slice)
- **runtime_mode**: `local`
- **runtime_context_ref**: `docs/engineering/runbook.md` `### OpenCode CLI TUI /auto dispatch after listing (BUG-0023 / R-0137)`; `docs/engineering/architecture.md` `# BUG-0023`

## Connect

- **service_url**: `n/a` (OpenCode CLI TUI dispatch / contract-test kit — no service endpoint)
- **service_port**: `n/a`
- **health_endpoint**: `n/a` (health = contract tests, not HTTP)

## Verify

1. `python -m pytest tests/bug0023_opencode_cli_tui_dispatch_rpc_test.py tests/bug0021_opencode_cli_tui_plugin_load_test.py tests/bug0020_opencode_desktop_command_info_listing_test.py tests/bug0019_opencode_auto_slash_listing_test.py tests/bug0018_opencode_auto_ownership_test.py -v` → 37 passed (8+8+8+7+6)
2. `python scripts/check_intake_template_parity.py --repo . --scope bug-0023` → `[INTAKE_TEMPLATE_PARITY_OK]`
3. `python scripts/check-user-visible-metadata.py --repo .` → exit 0
4. Spot-check: `.opencode/commands/auto.md` absent (active + template); `rpc.ts` `Rpc.define` id `its-magic.auto`; `tui.ts` dynamic import + `client.rpc(Defined)`; invented POST URL/body absent; orchestrator `await ctx.rpc.register` + `editor.add` retained; keep `.opencode/agents/auto.md` and `.cursor/commands/auto.md`
5. Consumers: `its-magic --mode upgrade --host opencode|both` overwrites `rpc.ts`, `tui.ts`, orchestrator register path and still prunes leftover `auto.md`; restart OpenCode CLI TUI (`opencode`, **not** `--pure`) for operator `/auto` invoke — or documented `OPENCODE_AUTO_TUI_DISPATCH_UNSUPPORTED` only if client/RPC truly absent

**expected_health_signal**: all 8 `test_bug0023_*` markers PASS; bug0021/0020/0019/0018 compose green; metadata guard exit 0; colliding `auto.md` absent; backlog BUG-0023 remains OPEN until `/closure`.

## Credentials

- **credential_source_refs**: `n/a` (no API keys required for contract-test verify; no live provider)
- **expected_value_source**: operator OpenCode host + local kit checkout; no inline secrets

## Known Issues

None blocking.

- **NB-1** (informational): Axis A dispatch fixes Rpc.define contract; **live operator OpenCode CLI TUI `/auto` invoke not probed in CI** (`UAT_PROBE_FORBIDDEN`). Residual `OPENCODE_AUTO_TUI_DISPATCH_UNSUPPORTED` possible until operator re-probe after ship.
- **NB-2** (informational): BUG-0021 listing limb remains; compose BUG-0021/0020/0019/0018 held; qa/verify-work critic NBs informational.
- **NB-3** (informational): Do not mark BUG-0023 DONE at release; do not tick acceptance; do not reopen BUG-0021; do not drain BUG-0022; do not mutate US-0141; no companion DEC; harness Fail:0 not claimed.

## Evidence refs

- `sprints/S0148/qa-findings.md` (QA_PASS)
- `sprints/S0148/uat.json`, `sprints/S0148/uat.md` (verify-work PASS)
- `sprints/S0148/summary.md`
- `sprints/S0148/release-findings.md`
- `sprints/S0148/verify-work-findings.md`
- `docs/engineering/state.md` (execute + qa + verify-work + sovereign-critic / release checkpoints)
- `docs/engineering/runbook.md` `### OpenCode CLI TUI /auto dispatch after listing (BUG-0023 / R-0137)`

## Next phase

**sovereign-critic (release)** then **`/closure`** (fresh **curator** subagent — Task has no qe type, ship macro phase 2 of 3 per DEC-0082). Release does **not** spawn closure. Backlog BUG-0023 remains **OPEN**; acceptance BUG-0023 remains **unchecked** until closure.
