# Release Notes — S0140 / BUG-0020

- **Sprint**: `S0140`
- **Bug / Story**: `BUG-0020` — OpenCode desktop Command.Info still has no invokable `/auto` after BUG-0019 TUI keymap (E2: C-limb CLI TUI via `tui.json` + desktop fail-closed token)
- **Release date**: `2026-09-13T01:10:00Z` (UTC)
- **orchestrator_run_id**: `auto-20260913-bug0020`
- **delivery_mode**: `ultra_lean`
- **macro_phase**: `ship` (release is phase 1 of 3: release → closure → refresh-context per DEC-0082)
- **policy_mode**: `confirm` (`RELEASE_PUBLISH_MODE=confirm`; `RELEASE_PUBLISH_AUTO_CONFIRM=0` → no publish execution)
- **trigger_source**: `auto`
- **branch**: `local` (no push; `SYNC_POLICY_MODE=disabled` per DEC-0018)
- **fresh_context_marker**: `rel-BUG0020-release-20260913T011000Z-fresh`
- **model_id**: `cursor-grok-4.6` (CROSS_MODEL_REVIEW=1 — required)
- **runtime_proof_id**: `rp-auto-20260913-bug0020-release-release-20260913T011000Z-BUG-0020`
- **proof_hash**: `2EF491A4B04834A6B2978071626A3912E7C1165BED813089005A1FE38776431F`
- **proof_ttl**: `2026-09-13T02:10:00Z` (UTC)
- **release_version**: (none — workflow-only release; no semver bump)

## Verdict

**RELEASE_PASS.** All mandatory release gates (1, 2, 3, 4, 4b) green with **scoped pytest 21/21** (bug0020 8/8 + bug0019 7/7 + bug0018 6/6). Queue row S0140 → `released`. No backlog mutation (closure owns OPEN→DONE + acceptance tick per US-0120 / DEC-0082). No npm / GitHub / Homebrew / Chocolatey publish.

Gate-1 evidence: live scoped slice + US-0071 metadata. **`harness_fail_zero_claimed=false`** — full `tests/run-tests.ps1` was not re-run this pass; stale `tests/report.md` @ `2026-09-12T13:47:25Z` (S0138) is not claimed as this sprint's Fail:0.

## Summary

BUG-0020 ships honest host-cannot-do-both on desktop Command.Info (approach E2 / R-0126):

- Project `.opencode/tui.json` (+ template) lists `./plugins/its-magic-auto/tui.ts` so CLI TUI `/auto` actually loads (AC-1).
- Plugin `editor.add({ name: "auto", execute })` → `runAutoLifecycle` retained; TUI `run()` still dispatches (AC-2, AC-6).
- Desktop picker is not a silent miss: `emitDesktopCommandInfoListingUnsupported` + `OPENCODE_AUTO_DESKTOP_COMMAND_INFO_LISTING_UNSUPPORTED` (not TUI-toast-only) (AC-3).
- Colliding `.opencode/commands/auto.md` remains absent; no JSON `commands.auto` + `template`; no kit `cli.json`; no plugin-local `its-magic-auto/tui.json` (AC-4, AC-5).
- Upgrade `--host opencode|both` copy-if-absent / JSONC-merge `tui.json` and still prunes leftover `auto.md` (AC-7).
- Active↔template `--scope=bug-0020` OK; peers remain listed; 8 picker/token contract markers (AC-8, AC-9, AC-10).

FRAMEWORK_KIT_REPO=1 — UAT probe class `contract_tests_primary`; 6 live-runtime classes waived `UAT_PROBE_FORBIDDEN`. **No live OpenCode desktop PASS.** Desktop equivalent = CLI TUI `/auto` after `tui.json` load + documented desktop listing token. No fake browser PASS.

## ACs satisfied (QA + verify-work, UAT 11/11)

**10/10 PASS** (live pytest 8/8 + compose 7/7 + 6/6):

| AC | Description | Status |
|----|-------------|--------|
| AC-1 | Operator can start auto (C-limb CLI TUI `/auto` after `tui.json` load) | PASS (markers 5+6) |
| AC-2 | Invocation starts `runAutoLifecycle` or documented `OPENCODE_*` | PASS (markers 3+6) |
| AC-3 | Desktop picker is not a silent miss | PASS (markers 1+4) |
| AC-4 | Must not restore STOP-only `auto.md` | PASS (marker 2) |
| AC-5 | Must not JSON-template `/auto` | PASS (marker 2) |
| AC-6 | Plugin `editor.add` execute retained | PASS (marker 3) |
| AC-7 | Consumer upgrade copies/merges `tui.json` + still prunes `auto.md` | PASS (marker 8) |
| AC-8 | Active↔template parity | PASS (marker 7) |
| AC-9 | Peers remain listed | PASS (14 peer `.md`; keep surfaces) |
| AC-10 | Tests are picker/token contracts, not slash-string existence | PASS (8 `test_bug0020_*`) |

## Test results (release)

- **BUG-0020 + BUG-0019 + BUG-0018 live pytest**: `python -m pytest tests/bug0020_opencode_desktop_command_info_listing_test.py tests/bug0019_opencode_auto_slash_listing_test.py tests/bug0018_opencode_auto_ownership_test.py -v` → **21 passed** in 0.25s (bug0020 **8/8**; bug0019 **7/7**; bug0018 **6/6**).
- **Parity**: `python scripts/check_intake_template_parity.py --repo . --scope=bug-0020` → `[INTAKE_TEMPLATE_PARITY_OK]`.
- **Metadata guard**: `python scripts/check-user-visible-metadata.py --repo .` → exit 0.
- **README feature coverage**: `python scripts/validate_readme_feature_coverage.py --repo . --enforce` → `[README_FEATURE_COVERAGE_VALIDATE_OK]`; `coverage_missing=[]` (BUG-0020 OPEN excluded; BUG-0019 DONE covered).
- **Canonical harness**: **not re-run**; `harness_fail_zero_claimed=false`. Stale `tests/report.md` @ `2026-09-12T13:47:25Z` belongs to S0138 and is not this sprint's Fail:0 evidence.

## Gate summary

| Gate | Result |
|------|--------|
| check_in_tests | **PASS** (scoped 21/21 + US-0071 metadata; `harness_fail_zero_claimed=false`) |
| qa | PASS (`sprints/S0140/qa-findings.md`; 0 blockers; NB1..NB3 informational) |
| verify_work | PASS (`sprints/S0140/uat.json` verdict=PASS; 10/10 ACs; 11/11 UAT incl `convergence_smoke`; 21/21 contract live) |
| uat | PASS (11/11; populated; `contract_tests_primary`; 6 live-runtime classes `UAT_PROBE_FORBIDDEN`) |
| isolation_evidence | PASS (execute+qa+verify-work+sovereign-critic+release; distinct markers; `model_id` set) |
| strict_runtime_proof | **PASS** (verify-work `rp-auto-20260913-bug0020-verify-work-qa-20260913T005000Z-BUG-0020` TTL `2026-09-13T01:50:00Z` consumed @ `01:10:00Z`; proof_hash recomputed MATCH `45380038515C7B9905698BC1D89139AA9E202A8255810BA581DDEE6766EBE1B0`; critic of verify-work PASS `critic-BUG0020-verifywork-20260913T010000Z-fresh`) |
| readme_feature_coverage_3f | PASS (`coverage_missing=[]`; BUG-0020 OPEN excluded; BUG-0019 DONE covered) |
| project_readme_3g | skipped (`FRAMEWORK_KIT_REPO=1`) |
| metadata_guard | PASS |
| triad_regression | PASS (pre-write oversize rolled over; post-append `--check` recorded in state.md) |
| backlog_reconciliation | not performed (closure owns per US-0120 / DEC-0082) |
| publish | skipped (`RELEASE_PUBLISH_MODE=confirm`; `RELEASE_PUBLISH_AUTO_CONFIRM=0`) |
| sync | not_eligible (`SYNC_POLICY_MODE=disabled`) |
| finalization | **PASS** (queue row S0140 = `released`) |

## Run

```powershell
# BUG-0020 desktop Command.Info / CLI TUI contract (8/8) + BUG-0019 compose (7/7) + BUG-0018 compose (6/6):
python -m pytest tests/bug0020_opencode_desktop_command_info_listing_test.py tests/bug0019_opencode_auto_slash_listing_test.py tests/bug0018_opencode_auto_ownership_test.py -v
#   Expected: 21 passed (bug0020 8/8; bug0019 7/7; bug0018 6/6)

python scripts/check_intake_template_parity.py --repo . --scope=bug-0020
#   Expected: [INTAKE_TEMPLATE_PARITY_OK]

python scripts/check-user-visible-metadata.py --repo .
#   Expected: exit 0 (silent PASS)

python scripts/validate_readme_feature_coverage.py --repo . --enforce
#   Expected: [README_FEATURE_COVERAGE_VALIDATE_OK]
```

Start command for the shipped pack (OpenCode CLI TUI load path / desktop fail-closed kit — not a long-running HTTP service):

```bash
python -m pytest tests/bug0020_opencode_desktop_command_info_listing_test.py tests/bug0019_opencode_auto_slash_listing_test.py tests/bug0018_opencode_auto_ownership_test.py -v
```

- **start_command**: `python -m pytest tests/bug0020_opencode_desktop_command_info_listing_test.py tests/bug0019_opencode_auto_slash_listing_test.py tests/bug0018_opencode_auto_ownership_test.py -v` (operator validation; live OpenCode desktop probe not required for this CI slice)
- **runtime_mode**: `local`
- **runtime_context_ref**: `docs/engineering/runbook.md` `### OpenCode desktop Command.Info `/auto` listing (BUG-0020 / R-0126)`; `docs/engineering/runtime-connectivity.md` (local kit — no remote service)

## Connect

- **service_url**: `n/a` (OpenCode CLI TUI load path / desktop fail-closed / contract-test kit — no service endpoint)
- **service_port**: `n/a`
- **health_endpoint**: `n/a` (health = contract tests, not HTTP)

## Verify

1. `python -m pytest tests/bug0020_opencode_desktop_command_info_listing_test.py tests/bug0019_opencode_auto_slash_listing_test.py tests/bug0018_opencode_auto_ownership_test.py -v` → 21 passed (8+7+6)
2. `python scripts/check_intake_template_parity.py --repo . --scope=bug-0020` → `[INTAKE_TEMPLATE_PARITY_OK]`
3. `python scripts/check-user-visible-metadata.py --repo .` → exit 0
4. `python scripts/validate_readme_feature_coverage.py --repo . --enforce` → `[README_FEATURE_COVERAGE_VALIDATE_OK]`
5. Spot-check: `.opencode/commands/auto.md` absent (active + template); `.opencode/tui.json` lists `./plugins/its-magic-auto/tui.ts`; plugin `editor.add({ name: "auto", execute })` retained; `emitDesktopCommandInfoListingUnsupported` + `OPENCODE_AUTO_DESKTOP_COMMAND_INFO_LISTING_UNSUPPORTED`; keep `.opencode/agents/auto.md` and `.cursor/commands/auto.md`
6. Consumers: `its-magic --mode upgrade --host opencode|both` copy-if-absent / JSONC-merge `tui.json` and still prunes leftover `auto.md`. Desktop Command.Info still will not list execute-only `/auto` — start from **CLI TUI** `/auto` (`opencode`, not `--pure`).

**expected_health_signal**: all 8 `test_bug0020_*` markers PASS; bug0019 compose 7/7; bug0018 compose 6/6; metadata guard exit 0; README enforce OK; colliding `auto.md` absent; `tui.json` lists tui.ts; desktop token present; backlog BUG-0020 remains OPEN until `/closure`.

## Credentials

- **credential_source_refs**: `n/a` (no API keys required for contract-test verify; no live provider)
- **expected_value_source**: operator OpenCode host + local kit checkout; no inline secrets

## Known Issues

None blocking.

- **NB-1** (informational): desktop operator must use CLI TUI C-limb; leftover consumer `auto.md` / unlink-fail is owned by runbook DQ8 + `OPENCODE_AUTO_MARKDOWN_COLLISION` — operator delete then re-upgrade.
- **NB-2** (informational): qa owned plan-verify + AC remap; leftover check does not delete; `tui.json` does not feed Command.Info.
- **NB-3** (informational): Do not mark BUG-0020 DONE at release; do not tick acceptance; do not reopen BUG-0019/BUG-0018/BUG-0017/BUG-0015/BUG-0016; no companion DEC; no live OpenCode desktop probe; harness Fail:0 not claimed.

## Evidence refs

- `sprints/S0140/qa-findings.md` (QA_PASS)
- `sprints/S0140/uat.json`, `sprints/S0140/uat.md` (verify-work PASS)
- `sprints/S0140/summary.md`
- `sprints/S0140/release-findings.md`
- `sprints/S0140/verify-work-verdict.json`
- `docs/engineering/state.md` (execute / qa / verify-work / sovereign-critic / release checkpoints)

## Sibling spawn note

Parallel `/release` spawn `023500Z` (`rel-BUG0020-release-20260913T023500Z-fresh`, `model_id=composer-2.5-fast`) also **RELEASE_PASS**, consuming verify-work `rp-auto-20260913-bug0020-verify-work-qa-20260913T021500Z-BUG-0020` / `90F11B7E1D3F5B803B29A64F2BE9F45BB76DDB760B234F1111E778C224431DE4` before TTL 03:15. This spawn’s producer is the orchestrator-specified `005000Z` tuple. Queue S0140 remains `released`. Critic of `023500Z` already PASS → `/closure`.

## Next phase

`/closure` (fresh **qe** subagent, ship macro phase 2 of 3 per DEC-0082). Release does **not** spawn closure. Backlog BUG-0020 remains **OPEN**; acceptance BUG-0020 remains **unchecked** until closure.
