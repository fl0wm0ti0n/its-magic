# Release Notes — S0138 / US-0134

- **Sprint**: `S0138`
- **Story**: `US-0134` — Existing kernel bridge and compatibility handshake
- **Release date**: `2026-09-12T13:45:00Z` (UTC)
- **orchestrator_run_id**: `auto-20260912-us0134`
- **delivery_mode**: `ultra_lean`
- **macro_phase**: `ship` (release is phase 1 of 3: release → closure → refresh-context per DEC-0082)
- **policy_mode**: `confirm` (`RELEASE_PUBLISH_MODE=confirm`; `RELEASE_PUBLISH_AUTO_CONFIRM=0` → no publish execution)
- **trigger_source**: `auto`
- **branch**: `local` (no push; `SYNC_POLICY_MODE=disabled` per DEC-0018)
- **fresh_context_marker**: `rel-US0134-release-20260912T134500Z-fresh`
- **model_id**: `cursor-grok-4.6` (CROSS_MODEL_REVIEW=1 — required)
- **runtime_proof_id**: `rp-auto-20260912-us0134-release-release-20260912T134500Z-US-0134`
- **proof_hash**: `A6350DAA60031FC7A2060E9CD089DCAE7908F1F0285FB6606ABE746093EDF226`
- **proof_ttl**: `2026-09-12T14:45:00Z` (UTC)
- **release_version**: (none — workflow-only release; no semver bump)

## Verdict

**RELEASE_PASS.** All mandatory release gates (1, 2, 3, 4, 4b) green with **canonical harness Fail:0** (`tests/report.md` @ `2026-09-12T13:47:25Z` Pass:860 / Fail:0, including US-0134 harness row 26AJ). Queue row S0138 → `released`. No backlog mutation (closure owns OPEN→DONE + acceptance tick per US-0120 / DEC-0082). No npm / GitHub / Homebrew / Chocolatey publish.

Gate-1/3f remediation (pre-finalization): kit harness **26AJ** wires `tests/us0134_contract_test.py`; US-0133 DONE README coverage backfilled; state hot-surface rollover `state-pack-20260912-ar.md`; re-ran kit harness to Fail:0.

## Summary

US-0134 ships in-tree unpublished `@its-magic/kernel-bridge` (approach A1 / DEC-0134 / R-0122):

- Three-marker locate + `--kernel-root`; `kit-dev` | `consumer`; no Pi in kernel-bridge (AC-1).
- Explicit `supported-kernel-range.json` (`>=0.1.3-9 <0.2.0`, `includePrerelease`) + DEC-0045 version file + `its_magic/kernel-contract.json` (AC-2).
- Fail-closed four `KERNEL_*` codes only; FAIL/timeout/crash stay `ValidatorResult` (AC-3).
- Probe then resolved `sys.executable`; 60s timeout; `windowsHide`; `shell: false`; Python validators remain SOT (AC-4).
- Required ten artifact keys vs optional `work_packs`/`sovereign`; missing required → `KERNEL_CONTRACT_MISMATCH` (AC-5).
- Ten `test_us0134_*` markers (9 standalone `node:test` + 1 kit pytest); CI Windows+Linux `working-directory: standalone` (AC-6).
- Kit `files` omit `standalone/`; installer include-list + runbook upgrade recipe; US-0125/US-0133 compose-only.

FRAMEWORK_KIT_REPO=1 — UAT probe class `contract_tests_primary`; 6 live-runtime classes waived `UAT_PROBE_FORBIDDEN`. No fake browser PASS.

## ACs satisfied (QA + verify-work, UAT 7/7)

**6/6 PASS** (live kit pytest 6/6 + standalone npm test 16/16 = 10/10 `test_us0134_*` plus US-0133 compose):

| AC | Description | Status |
|----|-------------|--------|
| AC-1 | KernelBridge locate + artifacts + manifest + named validators | PASS (markers 1+6+7+8+10) |
| AC-2 | Explicit supported contract range (not filenames) | PASS (markers 3+4) |
| AC-3 | Fail-closed four `KERNEL_*` codes | PASS (markers 2+4+5+6) |
| AC-4 | Python SOT PASS/FAIL/crash; no TS rewrite | PASS (markers 7+8+9) |
| AC-5 | Canonical artifact memory | PASS (marker 5) |
| AC-6 | Contract fixtures Win/Linux | PASS (10/10) |

## Test results (release)

- **US-0134 + US-0133 kit pytest**: `python -m pytest tests/us0134_contract_test.py tests/us0133_contract_test.py -v` → **6 passed** in 0.63s.
- **Standalone**: `npm test` (cwd `standalone/`) → **16 passed** in 2.74s (fail 0).
- **Combined markers**: **10/10** `test_us0134_*`.
- **Standalone typecheck/lint**: `npm run typecheck` / `npm run lint` → exit 0.
- **Kit omit-guard**: `python scripts/guard_installer_publish.py` → exit 0.
- **Metadata guard**: `python scripts/check-user-visible-metadata.py --repo .` → exit 0.
- **README feature coverage**: `python scripts/validate_readme_feature_coverage.py --repo . --enforce` → `[README_FEATURE_COVERAGE_VALIDATE_OK]`; `coverage_missing=[]` (US-0134 OPEN excluded; US-0133 DONE covered).
- **Canonical harness** (`tests/report.md`): timestamp `2026-09-12T13:47:25Z`, **`Pass: 860 / Fail: 0`** — includes `[PASS] US-0134 kit contract tests pass`.

## Gate summary

| Gate | Result |
|------|--------|
| check_in_tests | **PASS** (`tests/report.md` Fail:0 + us0134+us0133 kit 6/6 + standalone npm 16/16 + US-0071 metadata; `harness_fail_zero_claimed=true`) |
| qa | PASS (`sprints/S0138/qa-findings.md`; 0 blockers; NB1..NB3 informational) |
| verify_work | PASS (`sprints/S0138/uat.json` verdict=PASS; 6/6 ACs; 7/7 UAT incl `convergence_smoke`; 10/10 contract live) |
| uat | PASS (7/7; populated; `contract_tests_primary`; 6 live-runtime classes `UAT_PROBE_FORBIDDEN`) |
| isolation_evidence | PASS (execute+qa+verify-work+sovereign-critic+release; distinct markers; `model_id` set) |
| strict_runtime_proof | **PASS** (verify-work `rp-auto-20260912-us0134-verify-work-qa-20260912T133500Z-US-0134` TTL `2026-09-12T14:35:00Z` consumed @ `13:45:00Z`; proof_hash recomputed MATCH `1AAC2D0CAE8BC51BC24BC258D536D23CBBCA1B49D4AEEB8D977BBE94534F009A`) |
| readme_feature_coverage_3f | PASS (`coverage_missing=[]`; US-0134 OPEN excluded; US-0133 DONE covered) |
| project_readme_3g | skipped (`FRAMEWORK_KIT_REPO=1`) |
| metadata_guard | PASS |
| triad_regression | PASS (`state-pack-20260912-ar.md`; `--check` exit 0; harness triad PASS) |
| backlog_reconciliation | not performed (closure owns per US-0120 / DEC-0082) |
| publish | skipped (`RELEASE_PUBLISH_MODE=confirm`; `RELEASE_PUBLISH_AUTO_CONFIRM=0`) |
| sync | not_eligible (`SYNC_POLICY_MODE=disabled`) |
| finalization | **PASS** (queue row S0138 = `released`) |

## Run

```powershell
# US-0134 kit contract (marker 10) + US-0133 compose:
python -m pytest tests/us0134_contract_test.py tests/us0133_contract_test.py -v
#   Expected: 6 passed

# Standalone contract + unit (markers 1–9 + US-0133 + timeout unit):
cd standalone
npm test
npm run typecheck
npm run lint
#   Expected: 16 passed / fail 0; typecheck/lint exit 0

python scripts/guard_installer_publish.py
#   Expected: exit 0 (kit files omit standalone/)

python scripts/check-user-visible-metadata.py --repo .
#   Expected: exit 0 (silent PASS)

python scripts/validate_readme_feature_coverage.py --repo . --enforce
#   Expected: [README_FEATURE_COVERAGE_VALIDATE_OK]

# Canonical harness (Fail:0 required for gate-1):
powershell -ExecutionPolicy Bypass -File "tests/run-tests.ps1"
#   Expected: tests/report.md Fail: 0 (26AJ US-0134 kit row; standalone npm test is not in kit TEST_COMMAND)
```

Start command for the shipped pack (unpublished in-tree workspace — not a long-running HTTP service):

```bash
python -m pytest tests/us0134_contract_test.py tests/us0133_contract_test.py -v
cd standalone && npm test
```

- **start_command**: `python -m pytest tests/us0134_contract_test.py tests/us0133_contract_test.py -v` (kit); `npm test` in `standalone/` (kernel-bridge markers). No live provider required.
- **runtime_mode**: `local`
- **runtime_context_ref**: `docs/engineering/runbook.md` `### KernelBridge consume contract + upgrade (US-0134 / R-0122 / DEC-0134)`; `docs/engineering/runtime-connectivity.md` (local kit — no remote service)

## Connect

- **service_url**: `n/a` (unpublished `standalone/` KernelBridge / contract-test kit — no service endpoint)
- **service_port**: `n/a`
- **health_endpoint**: `n/a` (health = contract tests + Fail:0 harness, not HTTP)

## Verify

1. `python -m pytest tests/us0134_contract_test.py tests/us0133_contract_test.py -v` → 6 passed
2. `cd standalone && npm test` → 16 passed (fail 0)
3. Combined: 10/10 `test_us0134_*`
4. `cd standalone && npm run typecheck && npm run lint` → exit 0
5. `python scripts/guard_installer_publish.py` → exit 0
6. `python scripts/check-user-visible-metadata.py --repo .` → exit 0
7. `python scripts/validate_readme_feature_coverage.py --repo . --enforce` → `[README_FEATURE_COVERAGE_VALIDATE_OK]`
8. `tests/report.md` header shows **Fail: 0** (incl. US-0134 26AJ row)
9. Spot-check: kit `package.json` `files` omits `standalone/`; no Pi imports under `standalone/packages/kernel-bridge/`

**expected_health_signal**: all 10 `test_us0134_*` markers PASS; kit omit-guard exit 0; metadata guard exit 0; README enforce OK; harness Fail:0; backlog US-0134 remains OPEN until `/closure`.

## Credentials

- **credential_source_refs**: `n/a` (no API keys required for contract-test verify; no live provider)
- **expected_value_source**: local kit checkout + Node 22 for `standalone/`; no inline secrets

## Known Issues

None blocking.

- **NB-1** (informational): R1 includePrerelease + R2 resolved interpreter + R3 fail-closed manifest independently re-verified; handshake order explicit.
- **NB-2** (informational): qa owned plan-verify + AC remap; kernel-bridge separate from pi-kernel; US-0125 parallel.
- **NB-3** (informational): Do not mark US-0134 DONE at release; do not tick acceptance; do not reopen US-0133 or BUG-0018; no extract; no TS rewrite; R-0120/R-0121 intact; do not drain-advance.

## Evidence refs

- `tests/report.md` (@ 2026-09-12T13:47:25Z — Fail:0)
- `sprints/S0138/qa-findings.md` (QA_PASS)
- `sprints/S0138/uat.json`, `sprints/S0138/uat.md` (verify-work PASS)
- `sprints/S0138/summary.md`
- `sprints/S0138/release-findings.md`
- `sprints/S0138/verify-work-verdict.json`
- `docs/engineering/state.md` (execute / qa / verify-work / sovereign-critic / release checkpoints)
- `docs/engineering/state-archive/state-pack-20260912-ar.md`

## Next phase

`/closure` (fresh **qe** subagent, ship macro phase 2 of 3 per DEC-0082). Release does **not** spawn closure. Backlog US-0134 remains **OPEN**; acceptance US-0134 remains **unchecked** until closure. Operator stops after S0138 ship — do not drain-advance.
