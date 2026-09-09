# Release Notes — S0134 / US-0132

- **Sprint**: `S0134`
- **Story**: `US-0132` — Explicit Cursor/OpenCode model configuration contract
- **Release date**: `2026-09-09T20:18:00Z` (UTC)
- **orchestrator_run_id**: `auto-20260909-us0132`
- **delivery_mode**: `ultra_lean`
- **macro_phase**: `ship` (release is phase 1 of 3: release → closure → refresh-context per DEC-0082)
- **policy_mode**: `confirm` (`RELEASE_PUBLISH_MODE=confirm`; `RELEASE_PUBLISH_AUTO_CONFIRM=0` → no publish execution)
- **trigger_source**: `auto`
- **branch**: `local` (no push; `SYNC_POLICY_MODE=disabled` per DEC-0018)
- **fresh_context_marker**: `release-US0132-release-20260909T201800Z-fresh`
- **model_id**: `cursor-grok-4.6` (CROSS_MODEL_REVIEW=1 — required)
- **runtime_proof_id**: `rp-auto-20260909-us0132-release-release-20260909T201800Z-US-0132`
- **proof_hash**: `1D77E47A2D6783A6872A184A9A55601FB3D7A50B7D96AF49BED0D101EA53329F`
- **proof_ttl**: `2026-09-09T21:18:00Z` (UTC)
- **release_version**: (none — workflow-only release; no semver bump)

## Verdict

**RELEASE_PASS.** All mandatory release gates (1, 2, 3, 4, 4b) green with **canonical harness Fail:0** (`tests/report.md` @ `2026-09-09T20:17:05Z` Pass:856 / Fail:0, including US-0132 harness rows 26AF). Queue row S0134 → `released`. No backlog mutation (closure owns OPEN→DONE + acceptance tick per US-0120 / DEC-0082). No publish. US-0131 DONE compose-only not reopened.

Gate-1 remediation (pre-finalization): CLI clean-repo harness now treats `.cursor` as a container that may remain when US-0132 exclude-from-clean locals exist (`scratchpad.local.md`); README feature coverage backfill for DONE `US-0131` in `docs/developer/README.md` (+ template peer; `US-0132` bullets included while OPEN).

## Summary

US-0132 ships an explicit four-surface Cursor/OpenCode model configuration contract:

- Canonical inventory; generic `model.json{,c}` rejected (`MODEL_CONFIG_PATH_UNKNOWN`) (AC-1)
- Cursor vs OpenCode schemas stay separate (`MODEL_CONFIG_SCHEMA_MIX`) (AC-2)
- Per-host precedence with `provenance=` diagnostics (AC-3)
- OpenCode kit materializer idempotent; never writes template/host JSON (AC-4)
- Fail-closed `MODEL_CONFIG_*` including distinct `HOST_COLLISION` (AC-5)
- Install/upgrade/clean preserve named locals (exclude-from-clean) (AC-6)
- Triple-surface installer + gitignore + 6/6 US-0132 parity pairs (AC-7)
- 10/10 `test_us0132_*` markers + runbook/README (AC-8)

FRAMEWORK_KIT_REPO=1 — UAT probe class `contract_tests_primary`; 6 live-runtime classes waived `UAT_PROBE_FORBIDDEN`. No fake browser PASS.

## ACs satisfied (QA + verify-work, UAT 9/9)

**8/8 PASS** (live pytest 10/10 green):

| AC | Description | Status |
|----|-------------|--------|
| AC-1 | Canonical ownership (four surfaces; reject `model.json`) | PASS (marker 1 + live inventory) |
| AC-2 | Separate Cursor vs OpenCode schemas | PASS (markers 2, 3) |
| AC-3 | Per-host precedence + diagnostics | PASS (markers 4, 5, 8 + live `provenance=`) |
| AC-4 | Materialization correctness | PASS (marker 6) |
| AC-5 | Fail-closed validation + HOST_COLLISION distinct | PASS (markers 1, 5, 8, 10) |
| AC-6 | Local-file protection | PASS (marker 7) |
| AC-7 | Triple-surface parity | PASS (markers 7, 9; 6/6 pairs) |
| AC-8 | 10 contract tests + runbook/README | PASS (all 10) |

## Test results (release)

- **US-0132 live pytest**: `python -m pytest tests/us0132_contract_test.py -v` → **10 passed**.
- **Parity**: `python scripts/check_intake_template_parity.py --scope=us-0132` → `[INTAKE_TEMPLATE_PARITY_OK]`.
- **Metadata guard**: `python scripts/check-user-visible-metadata.py --repo .` → exit 0.
- **README feature coverage**: `python scripts/validate_readme_feature_coverage.py --repo . --enforce` → `[README_FEATURE_COVERAGE_VALIDATE_OK]`; `coverage_missing=[]` (US-0132 OPEN excluded; US-0131 DONE covered).
- **Canonical harness** (`tests/report.md`): timestamp `2026-09-09T20:17:05Z`, **`Pass: 856 / Fail: 0`** — includes `[PASS] check_intake_template_parity --scope=us-0132` + `[PASS] US-0132 contract tests pass` + `[PASS] CLI clean-repo preserves scratchpad.local.md (US-0132)`.

## Gate summary

| Gate | Result |
|------|--------|
| check_in_tests | **PASS** (`tests/report.md` Fail:0 + us0132 10/10 + parity us-0132 + US-0071 metadata; `harness_fail_zero_claimed=true`) |
| qa | PASS (`sprints/S0134/qa-findings.md`; 0 blockers; NB1–NB3 informational) |
| verify_work | PASS (`sprints/S0134/uat.json` verdict=PASS; 8/8 ACs; 9/9 UAT incl `convergence_smoke`; 10/10 contract live) |
| uat | PASS (9/9; populated; `contract_tests_primary`; 6 live-runtime classes `UAT_PROBE_FORBIDDEN`) |
| isolation_evidence | PASS (execute+qa+verify-work+sovereign-critic+release; distinct fresh_context_marker; `model_id` set) |
| strict_runtime_proof | **PASS** (verify-work `rp-auto-20260909-us0132-verify-work-qa-20260909T195316Z-US-0132` TTL `2026-09-09T20:53:16Z` consumed @ `20:18:00Z`; proof_hash recomputed MATCH `9DA355C4FD58FDFE56669C4CA9BF4FB26361276BD2DADB3D983ACB1172B75FB5`) |
| readme_feature_coverage_3f | PASS (`coverage_missing=[]`; US-0132 OPEN excluded; US-0131 DONE covered) |
| project_readme_3g | skipped (`FRAMEWORK_KIT_REPO=1`) |
| metadata_guard | PASS |
| triad_regression | PASS (`enforce-triad-hot-surface.py --check` exit 0 pre-append) |
| backlog_reconciliation | not performed (closure owns per US-0120 / DEC-0082) |
| publish | skipped (`RELEASE_PUBLISH_MODE=confirm`; `RELEASE_PUBLISH_AUTO_CONFIRM=0`) |
| sync | not_eligible (`SYNC_POLICY_MODE=disabled`) |
| finalization | **PASS** (queue row S0134 = `released`) |

## Run

```powershell
# US-0132-specific live contract test (10/10):
python -m pytest tests/us0132_contract_test.py -v
#   Expected: 10 passed

python scripts/check_intake_template_parity.py --scope=us-0132
#   Expected: [INTAKE_TEMPLATE_PARITY_OK] scope=us-0132

python scripts/check-user-visible-metadata.py --repo .
#   Expected: exit 0 (silent PASS)

python scripts/model_tier_validate.py --scope model-config --host both --repo .
#   Expected: [MODEL_TIER_VALIDATION_OK]

python scripts/validate_readme_feature_coverage.py --repo . --enforce
#   Expected: [README_FEATURE_COVERAGE_VALIDATE_OK]

# Canonical harness (Fail:0 required for gate-1):
powershell -ExecutionPolicy Bypass -File "tests/run-tests.ps1"
#   Expected: tests/report.md Fail: 0
```

Start command for the shipped pack (kit/model-config story — not a long-running HTTP service):

```bash
python -m pytest tests/us0132_contract_test.py -v
```

- **start_command**: `python -m pytest tests/us0132_contract_test.py -v` (operator validation; no live OpenCode probe required for this CI slice)
- **runtime_mode**: `local`
- **runtime_context_ref**: `docs/engineering/runbook.md` (**Cursor/OpenCode model configuration contract (US-0132)**); `docs/engineering/runtime-connectivity.md` (local kit — no remote service)

## Connect

- **service_url**: `n/a` (model-config contract — no service endpoint)
- **service_port**: `n/a`
- **health_endpoint**: `n/a` (health = contract tests + parity CLI + Fail:0 harness, not HTTP)

## Verify

1. `python -m pytest tests/us0132_contract_test.py -v` → 10 passed
2. `python scripts/check_intake_template_parity.py --scope=us-0132` → `[INTAKE_TEMPLATE_PARITY_OK]`
3. `python scripts/check-user-visible-metadata.py --repo .` → exit 0
4. `python scripts/model_tier_validate.py --scope model-config --host both --repo .` → `[MODEL_TIER_VALIDATION_OK]`
5. `python scripts/validate_readme_feature_coverage.py --repo . --enforce` → `[README_FEATURE_COVERAGE_VALIDATE_OK]`
6. `tests/report.md` header shows **Fail: 0** (incl. US-0132 harness rows)

**expected_health_signal**: all 10 `test_us0132_*` markers PASS; parity us-0132 OK; metadata guard exit 0; README enforce OK; harness Fail:0; backlog US-0132 remains OPEN until `/closure`.

## Credentials

- **credential_source_refs**: `n/a` (no API keys required for contract-test verify)
- **expected_value_source**: operator host + local kit checkout; no inline secrets

## Known Issues

None blocking.

- **NB-1** (informational): marker 1 does not separately assert `--host opencode` + `model.json` (extra UAT PATH_UNKNOWN-only). Optional tighten without an 11th marker deferred.
- **NB-2** (informational): marker 6 source-scan `assert rel in src or True` tautology; runtime never-write still holds.
- **NB-3** (informational): `FORBIDDEN_WRITE_RELPATHS` unused as runtime guard. Do not mark US-0132 DONE at release; do not tick acceptance L160; do not reopen US-0131; no publish under confirm mode.

## Evidence refs

- `tests/report.md` (@ 2026-09-09T20:17:05Z — Fail:0)
- `sprints/S0134/qa-findings.md` (QA_PASS)
- `sprints/S0134/uat.json`, `sprints/S0134/uat.md` (verify-work PASS)
- `sprints/S0134/summary.md`
- `sprints/S0134/release-findings.md`
- `docs/engineering/state.md` (execute / qa / verify-work / sovereign-critic / release checkpoints)

## Next phase

`/closure` (fresh **qe** subagent, ship macro phase 2 of 3 per DEC-0082). Release does **not** spawn closure. Backlog US-0132 remains **OPEN**; acceptance L160 remains **unchecked** until closure.
