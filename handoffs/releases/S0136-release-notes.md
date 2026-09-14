# Release Notes — S0136 / BUG-0018

- **Sprint**: `S0136`
- **Bug / Story**: `BUG-0018` — OpenCode markdown `/auto` wins over plugin execute (STOP, no OPENCODE_* code)
- **Release date**: `2026-09-12T10:55:00Z` (UTC)
- **orchestrator_run_id**: `auto-20260912-bug0018`
- **delivery_mode**: `ultra_lean`
- **macro_phase**: `ship` (release is phase 1 of 3: release → closure → refresh-context per DEC-0082)
- **policy_mode**: `confirm` (`RELEASE_PUBLISH_MODE=confirm`; `RELEASE_PUBLISH_AUTO_CONFIRM=0` → no publish execution)
- **trigger_source**: `auto`
- **branch**: `local` (no push; `SYNC_POLICY_MODE=disabled` per DEC-0018)
- **fresh_context_marker**: `rel-BUG0018-release-20260912T105500Z-fresh`
- **model_id**: `cursor-grok-4.6` (CROSS_MODEL_REVIEW=1 — required)
- **runtime_proof_id**: `rp-auto-20260912-bug0018-release-release-20260912T105500Z-BUG-0018`
- **proof_hash**: `791DEF823E5A7B4985951D258DAC56B57CB7491A8ADA0B6914ACE4B52545ACD7`
- **proof_ttl**: `2026-09-12T11:55:00Z` (UTC)
- **release_version**: (none — workflow-only release; no semver bump)

## Verdict

**RELEASE_PASS.** All mandatory release gates (1, 2, 3, 4, 4b) green with **canonical harness Fail:0** (`tests/report.md` @ `2026-09-12T10:37:55Z` Pass:858 / Fail:0, including BUG-0018 harness row 26AH). Queue row S0136 → `released`. No backlog mutation (closure owns OPEN→DONE + acceptance tick per US-0120 / DEC-0082). No publish.

Gate-1 / 3f remediation (pre-finalization): wired 26AH BUG-0018 auto-ownership contract into `tests/run-tests.ps1` / `tests/run-tests.sh`; added README coverage for DONE BUG-0017 (3f gap) plus operator BUG-0018 sections; synced Homebrew stable formula url+version to npm `0.1.3-9`.

## Summary

BUG-0018 ships plugin-only OpenCode `/auto` (approach A* / R-0120):

- Deleted colliding `.opencode/commands/auto.md` (active + template) so markdown cannot own `/auto` (AC-1, AC-2).
- Plugin `editor.add({ name: "auto", execute })` → `runAutoLifecycle` remains sole runtime owner; slash listing preserved (AC-1, AC-3).
- Targeted installer prune of leftover consumer `auto.md` on `upgrade --host opencode|both` (AC-4); plugin leftover check does **not** delete.
- Fail-closed token `OPENCODE_AUTO_MARKDOWN_COLLISION` (plugin + runbook stub); no silent STOP (AC-5).
- Active↔template plugin / runbook / tests parity (AC-6).
- Compose BUG-0015 attach unchanged; us0125 inventory 14; bug0017 plant `intake.md` (AC-7).
- Six additive `test_bug0018_*` markers (AC contract surface).

FRAMEWORK_KIT_REPO=1 — UAT probe class `contract_tests_primary`; 6 live-runtime classes waived `UAT_PROBE_FORBIDDEN`. No fake browser PASS.

## ACs satisfied (QA + verify-work, UAT 8/8)

**7/7 PASS** (live pytest 6/6 green):

| AC | Description | Status |
|----|-------------|--------|
| AC-1 | `/auto` invokes plugin execute → `runAutoLifecycle` (or documented `OPENCODE_*`) | PASS (markers 1–2) |
| AC-2 | Markdown not sole runtime owner when plugin execute is registered | PASS (marker 1; auto.md absent) |
| AC-3 | Slash listing preserved via plugin name+description | PASS (marker 2) |
| AC-4 | Consumer upgrade `--host opencode\|both` prunes leftover `auto.md` | PASS (marker 4 + runbook recipe) |
| AC-5 | No silent STOP — `OPENCODE_AUTO_MARKDOWN_COLLISION` fail-closed | PASS (marker 6) |
| AC-6 | Active ↔ template parity for ownership change | PASS (marker 3; 3/3 IDENTICAL) |
| AC-7 | Compose BUG-0015 attach unchanged | PASS (marker 5 + compose 24/24) |

## Test results (release)

- **BUG-0018 live pytest**: `python -m pytest tests/bug0018_opencode_auto_ownership_test.py tests/us0125_contract_test.py tests/bug0015_contract_test.py tests/bug0017_opencode_eol_test.py -v` → **30 passed** (bug0018 **6/6**).
- **Parity**: `python scripts/check_intake_template_parity.py --repo . --scope=bug-0015` → `[INTAKE_TEMPLATE_PARITY_OK]`.
- **Metadata guard**: `python scripts/check-user-visible-metadata.py --repo .` → exit 0.
- **README feature coverage**: `python scripts/validate_readme_feature_coverage.py --repo . --enforce` → `[README_FEATURE_COVERAGE_VALIDATE_OK]`; `coverage_missing=[]` (BUG-0018 OPEN excluded).
- **Canonical harness** (`tests/report.md`): timestamp `2026-09-12T10:37:55Z`, **`Pass: 858 / Fail: 0`** — includes `[PASS] BUG-0018 OpenCode auto ownership contract tests pass`.

## Gate summary

| Gate | Result |
|------|--------|
| check_in_tests | **PASS** (`tests/report.md` Fail:0 + bug0018 6/6 + compose 30/30 + US-0071 metadata; `harness_fail_zero_claimed=true`) |
| qa | PASS (`sprints/S0136/qa-findings.md`; 0 blockers; NB1..NB3 informational) |
| verify_work | PASS (`sprints/S0136/uat.json` verdict=PASS; 7/7 ACs; 8/8 UAT incl `convergence_smoke`; 6/6 contract live) |
| uat | PASS (8/8; populated; `contract_tests_primary`; 6 live-runtime classes `UAT_PROBE_FORBIDDEN`) |
| isolation_evidence | PASS (execute+qa+verify-work+sovereign-critic+release; distinct markers; `model_id` set) |
| strict_runtime_proof | **PASS** (verify-work `rp-auto-20260912-bug0018-verify-work-qa-20260912T104500Z-BUG-0018` TTL `2026-09-12T11:45:00Z` consumed @ `10:55:00Z`; proof_hash recomputed MATCH `AFB58F6DEC7505290F0A796066820A3A12689EF9682B56B967F695C26837E5BE`) |
| readme_feature_coverage_3f | PASS (`coverage_missing=[]`; BUG-0018 OPEN excluded; BUG-0017 DONE covered) |
| project_readme_3g | skipped (`FRAMEWORK_KIT_REPO=1`) |
| metadata_guard | PASS |
| triad_regression | PASS (`enforce-triad-hot-surface.py --check` exit 0) |
| backlog_reconciliation | not performed (closure owns per US-0120 / DEC-0082) |
| publish | skipped (`RELEASE_PUBLISH_MODE=confirm`; `RELEASE_PUBLISH_AUTO_CONFIRM=0`) |
| sync | not_eligible (`SYNC_POLICY_MODE=disabled`) |
| finalization | **PASS** (queue row S0136 = `released`) |

## Run

```powershell
# BUG-0018-specific live auto-ownership contract test (6/6) + compose:
python -m pytest tests/bug0018_opencode_auto_ownership_test.py tests/us0125_contract_test.py tests/bug0015_contract_test.py tests/bug0017_opencode_eol_test.py -v
#   Expected: 30 passed (bug0018 6/6)

python scripts/check_intake_template_parity.py --repo . --scope=bug-0015
#   Expected: [INTAKE_TEMPLATE_PARITY_OK]

python scripts/check-user-visible-metadata.py --repo .
#   Expected: exit 0 (silent PASS)

python scripts/validate_readme_feature_coverage.py --repo . --enforce
#   Expected: [README_FEATURE_COVERAGE_VALIDATE_OK]

# Canonical harness (Fail:0 required for gate-1):
powershell -ExecutionPolicy Bypass -File "tests/run-tests.ps1"
#   Expected: tests/report.md Fail: 0
```

Start command for the shipped pack (kit/OpenCode ownership story — not a long-running HTTP service):

```bash
# Validate plugin-only /auto ownership:
python -m pytest tests/bug0018_opencode_auto_ownership_test.py -v
```

- **start_command**: `python -m pytest tests/bug0018_opencode_auto_ownership_test.py -v` (operator validation; live OpenCode probe not required for this CI slice)
- **runtime_mode**: `local`
- **runtime_context_ref**: `docs/engineering/runbook.md` `### OpenCode markdown `/auto` vs plugin execute (BUG-0018 / R-0120)`; `docs/engineering/runtime-connectivity.md` (local kit — no remote service)

## Connect

- **service_url**: `n/a` (OpenCode plugin-only `/auto` / prune / contract-test kit — no service endpoint)
- **service_port**: `n/a`
- **health_endpoint**: `n/a` (health = contract tests + Fail:0 harness, not HTTP)

## Verify

1. `python -m pytest tests/bug0018_opencode_auto_ownership_test.py -v` → 6 passed
2. Compose: `python -m pytest tests/bug0018_opencode_auto_ownership_test.py tests/us0125_contract_test.py tests/bug0015_contract_test.py tests/bug0017_opencode_eol_test.py -v` → 30 passed
3. `python scripts/check_intake_template_parity.py --repo . --scope=bug-0015` → `[INTAKE_TEMPLATE_PARITY_OK]`
4. `python scripts/check-user-visible-metadata.py --repo .` → exit 0
5. `python scripts/validate_readme_feature_coverage.py --repo . --enforce` → `[README_FEATURE_COVERAGE_VALIDATE_OK]`
6. `tests/report.md` header shows **Fail: 0** (incl. BUG-0018 26AH row)
7. Spot-check: `.opencode/commands/auto.md` absent (active + template); plugin `editor.add({ name: "auto", execute })` retained; keep `.opencode/agents/auto.md` and `.cursor/commands/auto.md`
8. Consumers with leftover `auto.md`: `its-magic --mode upgrade --host opencode|both` (DQ8)

**expected_health_signal**: all 6 `test_bug0018_*` markers PASS; compose 30/30; metadata guard exit 0; README enforce OK; harness Fail:0; colliding `auto.md` absent; backlog BUG-0018 remains OPEN until `/closure`.

## Credentials

- **credential_source_refs**: `n/a` (no API keys required for contract-test verify)
- **expected_value_source**: operator OpenCode host + local kit checkout; no inline secrets

## Known Issues

None blocking.

- **NB-1** (informational): Leftover consumer `auto.md` / unlink-fail is owned by runbook DQ8 + `OPENCODE_AUTO_MARKDOWN_COLLISION` — operator delete then re-upgrade.
- **NB-2** (informational): qa owned plan-verify + AC remap; execute compose/parity held.
- **NB-3** (informational): Do not mark BUG-0018 DONE at release; do not tick acceptance; do not reopen BUG-0015/BUG-0016/BUG-0017; no companion DEC; no live OpenCode CI probe.

## Evidence refs

- `tests/report.md` (@ 2026-09-12T10:37:55Z — Fail:0)
- `sprints/S0136/qa-findings.md` (QA_PASS)
- `sprints/S0136/uat.json`, `sprints/S0136/uat.md` (verify-work PASS)
- `sprints/S0136/summary.md`
- `sprints/S0136/release-findings.md`
- `sprints/S0136/verify-work-verdict.json`
- `docs/engineering/state.md` (execute / qa / verify-work / sovereign-critic / release checkpoints)

## Next phase

`/closure` (fresh **qe** subagent, ship macro phase 2 of 3 per DEC-0082). Release does **not** spawn closure. Backlog BUG-0018 remains **OPEN**; acceptance BUG-0018 remains **unchecked** until closure.
