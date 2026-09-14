# Release Notes — S0141 / US-0135

- **Sprint**: `S0141`
- **Story**: `US-0135` — Standalone authentication and model routing (`@its-magic/auth-models`, owned OS credential store, pi-kernel `AuthRuntimeAdapter`, 6-step ModelRouter, thinking clamp, critic degraded mode, `itsm auth` / `models list` / `models test`)
- **Release date**: `2026-09-13T05:55:00Z` (UTC)
- **orchestrator_run_id**: `auto-20260913-us0135`
- **delivery_mode**: `ultra_lean`
- **macro_phase**: `ship` (release is phase 1 of 3: release → closure → refresh-context per DEC-0082)
- **policy_mode**: `confirm` (`RELEASE_PUBLISH_MODE=confirm`; `RELEASE_PUBLISH_AUTO_CONFIRM=0` → no publish execution)
- **trigger_source**: `auto`
- **branch**: `local` (no push; `SYNC_POLICY_MODE=disabled` per DEC-0018)
- **fresh_context_marker**: `rel-US0135-release-20260913T055500Z-fresh`
- **model_id**: `composer-2.5-fast` (CROSS_MODEL_REVIEW=1 — required)
- **runtime_proof_id**: `rp-auto-20260913-us0135-release-release-20260913T055500Z-US-0135`
- **proof_hash**: `FDA768E5894FBC79316ED0E3A76A943FA782368B772E9B78F9AFFB5E55DE1543`
- **proof_ttl**: `2026-09-13T06:55:00Z` (UTC)
- **release_version**: (none — workflow-only release; no semver bump)

## Verdict

**RELEASE_PASS.** All mandatory release gates (1, 2, 3, 4, 4b) green with **scoped standalone npm test 26/26** (10/10 `test_us0135_*`) + **kit pytest 7/7**. Queue row S0141 → `released`. No backlog mutation (closure owns OPEN→DONE + acceptance tick per US-0120 / DEC-0082). No npm / GitHub / Homebrew / Chocolatey publish.

Gate-1 evidence: live scoped slice + US-0071 metadata. **`harness_fail_zero_claimed=false`** — full `tests/run-tests.ps1` was not re-run this pass.

## Summary

US-0135 ships standalone auth-models + model routing (approach A1 / R-0127 / DEC-0135):

- `@its-magic/auth-models` private 0.0.0; no Pi imports in auth-models.
- Owned OS credential dir (XDG / `%APPDATA%` / macOS Application Support `its-magic/`); 0600-class; `AUTH_PATH_IN_PROJECT`; InMemory no-disk for tests.
- pi-kernel `AuthRuntimeAdapter`; additive `thinkingLevel`; isolation/`noTools`/KernelBridge unamended.
- Provider matrix + owned `models.json` local OpenAI-compat template.
- ModelRouter 6-step precedence + provenance; Cursor aliases fail-closed.
- Thinking inject + clamp/provenance; `TOKEN_PROFILE` ignored.
- Critic pin; same-slug → `CROSS_MODEL_DEGRADED_MODE` (not hard stop).
- `itsm auth` list/login/logout/migrate; `models list`; `models test` (`--live` never CI).
- 10/10 `test_us0135_*`; kit twin marker 3; compose us0133/us0134 green.

FRAMEWORK_KIT_REPO=1 — UAT probe class `contract_tests_primary`; 6 live-runtime classes waived `UAT_PROBE_FORBIDDEN`. No fake browser PASS. No live paid provider CI.

## ACs satisfied (QA + verify-work, UAT 8/8)

**7/7 PASS** (live npm 10/10 + pytest 7/7):

| AC | Description | Status |
|----|-------------|--------|
| AC-1 | CLI auth list/config (Codex OAuth + API-key); owned credential location outside project | PASS (markers 1–3) |
| AC-2 | Provider matrix (built-in, Chinese, local OpenAI-compat, custom gateway) via Pi adapters | PASS (marker 8) |
| AC-3 | 6-step model resolution with provenance | PASS (marker 4) |
| AC-4 | Thinking independent of slug and token profile | PASS (marker 5) |
| AC-5 | Critic pin; same-slug `CROSS_MODEL_DEGRADED_MODE` | PASS (marker 6) |
| AC-6 | `itsm auth` / `models list` / `models test` diagnostics without tokens | PASS (marker 7) |
| AC-7 | Two roles different providers; OAuth refresh never exposes tokens | PASS (markers 8–10) |

## Test results (release — live this pass)

- **Standalone contract + unit**: `cd standalone && npm test` → **26 passed** in 2.71s (**10/10** `test_us0135_*` + us0133 + us0134 + unit).
- **Kit + compose contract tests**: `python -m pytest tests/us0135_contract_test.py tests/us0134_contract_test.py tests/us0133_contract_test.py -v` → **7 passed** in 0.66s.
- **Metadata guard**: `python scripts/check-user-visible-metadata.py --repo .` → exit 0.
- **README feature coverage**: `python scripts/validate_readme_feature_coverage.py --repo . --enforce` → `[README_FEATURE_COVERAGE_VALIDATE_OK]`; `coverage_missing=[]` (gate3f remediation BUG-0020 readme).
- **Canonical harness**: **not re-run**; `harness_fail_zero_claimed=false`.

## Gate summary

| Gate | Result |
|------|--------|
| check_in_tests | **PASS** (scoped npm 26/26 + pytest 7/7 + US-0071 metadata; `harness_fail_zero_claimed=false`) |
| qa | PASS (`sprints/S0141/qa-findings.md`; 0 blockers; NB1..NB3 informational) |
| verify_work | PASS (`sprints/S0141/uat.json` verdict=PASS; 7/7 ACs; 8/8 UAT incl `convergence_smoke`; live npm+pytest) |
| uat | PASS (8/8; populated; `contract_tests_primary`; 6 live-runtime classes `UAT_PROBE_FORBIDDEN`) |
| isolation_evidence | PASS (execute+qa+verify-work+sovereign-critic+release; distinct markers; `model_id` set) |
| strict_runtime_proof | **PASS** (verify-work `rp-auto-20260913-us0135-verify-work-qa-20260913T053500Z-US-0135` TTL `2026-09-13T06:35:00Z` consumed @ `05:55:00Z`; proof_hash recomputed MATCH `F734761A3CB9137695BC648CD9B870979E83622A0094F29B579993E8F55CF32E`; critic of verify-work PASS `44C88BEA4946FA0830916C4589DA16344E41AAED7B67328539D86CBFCC0A7B66`) |
| readme_feature_coverage_3f | PASS (`coverage_missing=[]`; gate3f_remediation_BUG0020_readme) |
| project_readme_3g | skipped (`FRAMEWORK_KIT_REPO=1`) |
| metadata_guard | PASS |
| triad_regression | PASS (pre-write `--check` PASS; post-append rollover in state.md) |
| backlog_reconciliation | not performed (closure owns per US-0120 / DEC-0082) |
| publish | skipped (`RELEASE_PUBLISH_MODE=confirm`; `RELEASE_PUBLISH_AUTO_CONFIRM=0`) |
| sync | not_eligible (`SYNC_POLICY_MODE=disabled`) |
| finalization | **PASS** (queue row S0141 = `released`) |

## Run

```powershell
# US-0135 contract (10/10) + US-0134/US-0133 compose:
cd standalone; npm test
#   Expected: 26 passed (10/10 test_us0135_* + us0133 + us0134 + unit)

python -m pytest tests/us0135_contract_test.py tests/us0134_contract_test.py tests/us0133_contract_test.py -v
#   Expected: 7 passed

python scripts/check-user-visible-metadata.py --repo .
#   Expected: exit 0 (silent PASS)
```

Start command for the shipped pack (CLI/auth-models contract-test kit — not a long-running HTTP service):

```bash
cd standalone && npm test && python -m pytest tests/us0135_contract_test.py tests/us0134_contract_test.py tests/us0133_contract_test.py -v
```

- **start_command**: `cd standalone && npm test` (operator validation; contract-test kit)
- **runtime_mode**: `local`
- **runtime_context_ref**: `docs/engineering/runbook.md` `### Standalone authentication and model routing (US-0135 / R-0127 / DEC-0135)`; `docs/engineering/runtime-connectivity.md` (local kit — no remote service)

## Connect

- **service_url**: `n/a` (unpublished standalone auth-models / CLI contract-test kit — no service endpoint)
- **service_port**: `n/a`
- **health_endpoint**: `n/a` (health = contract tests, not HTTP)

## Verify

1. `cd standalone && npm test` → 26 passed (10/10 `test_us0135_*`)
2. `python -m pytest tests/us0135_contract_test.py tests/us0134_contract_test.py tests/us0133_contract_test.py -v` → 7 passed
3. `python scripts/check-user-visible-metadata.py --repo .` → exit 0
4. Spot-check: `standalone/packages/auth-models` has no Pi imports; owned OS auth path outside project; `AuthRuntimeAdapter` in pi-kernel; kit `files` omit `standalone/`
5. Operators: configure credentials via `itsm auth`; resolve models via 6-step router; `--live` never CI

**expected_health_signal**: all 10 `test_us0135_*` markers PASS; us0133/us0134 compose green; metadata guard exit 0; backlog US-0135 remains OPEN until `/closure`.

## Credentials

- **credential_source_refs**: `n/a` (no API keys required for contract-test verify; fake-model CI default)
- **expected_value_source**: operator local kit checkout; owned OS credential dir per runbook; no inline secrets

## Known Issues

None blocking.

- **NB-1** (informational): qa+execute proofs MATCH; AUTH_PATH_IN_PROJECT / OAuth refresh / critic degraded / fake-model CI locked in tests.
- **NB-2** (informational): auth-models no Pi; CLI handlers in auth-models; AuthRuntimeAdapter additive; isolation/noTools/KernelBridge unamended.
- **NB-3** (informational): Do not mark US-0135 DONE at release; do not tick acceptance; do not reopen BUG-0020; no US-0136+; harness Fail:0 not claimed.

## Evidence refs

- `sprints/S0141/qa-findings.md` (QA_PASS)
- `sprints/S0141/uat.json`, `sprints/S0141/uat.md` (verify-work PASS)
- `sprints/S0141/summary.md`
- `sprints/S0141/release-findings.md`
- `sprints/S0141/verify-work-findings.md`
- `docs/engineering/state.md` (execute / qa / verify-work / sovereign-critic / release checkpoints)

## Next phase

`/closure` (fresh **qe** subagent, ship macro phase 2 of 3 per DEC-0082). Release does **not** spawn closure. Backlog US-0135 remains **OPEN**; acceptance US-0135 remains **unchecked** until closure.
