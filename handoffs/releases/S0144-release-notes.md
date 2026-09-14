# Release Notes — S0144 / US-0138

- **Sprint**: `S0144`
- **Story**: `US-0138` — Typed runtime configuration and legacy migration adapter (`@its-magic/config` no Pi; Zod `RuntimeConfig` v1 JSONC `.its-magic/` analog; TS `LegacyScratchpadAdapter`; public 5-layer resolve with provenance; `CONFIG_*` fail-closed; secret names/handles only; US-0119 preset expansion with `security_hard` unrelaxable; inject-only PolicyEngine/ModelRouter/RoleCatalog flags; 12 `test_us0138_*`)
- **Release date**: `2026-09-13T15:55:00Z` (UTC)
- **orchestrator_run_id**: `auto-20260913-us0138`
- **delivery_mode**: `ultra_lean`
- **macro_phase**: `ship` (release is phase 1 of 3: release → sovereign-critic (release) → closure per native chain)
- **policy_mode**: `confirm` (`RELEASE_PUBLISH_MODE=confirm`; `RELEASE_PUBLISH_AUTO_CONFIRM=0` → no publish execution)
- **trigger_source**: `auto`
- **branch**: `local` (no push; `SYNC_POLICY_MODE=disabled` per DEC-0018)
- **fresh_context_marker**: `rel-US0138-release-20260913T155500Z-fresh`
- **model_id**: `composer-2.5-fast` (CROSS_MODEL_REVIEW=1 — required)
- **runtime_proof_id**: `rp-auto-20260913-us0138-release-release-20260913T155500Z-US-0138`
- **proof_hash**: `4F19A3919D77F0C2046185960C20128682EEBAACDAA088A787002EA38870493C`
- **proof_ttl**: `2026-09-13T16:55:00Z` (UTC)
- **release_version**: (none — workflow-only release; no semver bump)

## Verdict

**RELEASE_PASS.** All mandatory release gates (1, 2, 3, 4, 4b) green with **scoped standalone npm test 58/58** (12/12 `test_us0138_*`) + **kit pytest 10/10**. Queue row S0144 → `released`. No backlog mutation (closure owns OPEN→DONE + acceptance tick per US-0120 / DEC-0082). No npm / GitHub / Homebrew / Chocolatey publish.

Gate-1 evidence: live scoped slice + US-0071 metadata. **`harness_fail_zero_claimed=false`** — full `tests/run-tests.ps1` was not re-run this pass.

## Summary

US-0138 ships standalone `@its-magic/config` (approach A1 / R-0130 / DEC-0138):

- Zod `RuntimeConfig` v1 JSONC `.its-magic/` analog; no Pi deps.
- Public 5-layer resolve: CLI > local > shared > legacy > defaults + provenance.
- `LegacyScratchpadAdapter` absent-OK; malformed fail-closed; migration hints.
- `CONFIG_*` fail-closed; secrets rejected; names/handles only.
- US-0119 preset expansion; `security_hard` unrelaxable.
- Inject-only PolicyEngine/ModelRouter/SessionSupervisor flags.
- Exactly 12 `test_us0138_*`; compose us0133–us0137 green.

FRAMEWORK_KIT_REPO=1 — UAT probe class `contract_tests_primary`; 6 live-runtime classes waived `UAT_PROBE_FORBIDDEN`. No fake browser PASS. No live paid provider CI.

## ACs satisfied (QA + verify-work, UAT 7/7)

**6/6 PASS** (live npm 12/12 + pytest 10/10):

| AC | Description | Status |
|----|-------------|--------|
| AC-1 | Versioned typed `RuntimeConfig` covers delivery, token, work-kind, phase, model, autonomy, stop, retry/test, browser, dev-environment, remote, security/compliance, sovereign | PASS |
| AC-2 | Precedence CLI > local > shared > legacy > defaults + provenance | PASS |
| AC-3 | `LegacyScratchpadAdapter` absent-OK, malformed fail-closed, migration hints | PASS |
| AC-4 | Secrets rejected from shared config; names/handles only | PASS |
| AC-5 | Invalid version/type/enum/conflict fail-closed; `security_hard` unrelaxable | PASS |
| AC-6 | Tests cover every layer, absent legacy, malformed, local preservation, existing-repo identity | PASS |

## Test results (release — live this pass)

- **Standalone contract + unit**: `cd standalone && npm test` → **58 passed** in 3.06s (**12/12** `test_us0138_*` + us0133 + us0134 + us0135 + us0136 + us0137 + unit).
- **Kit + compose contract tests**: `python -m pytest tests/us0138_contract_test.py tests/us0137_contract_test.py tests/us0136_contract_test.py tests/us0135_contract_test.py tests/us0134_contract_test.py tests/us0133_contract_test.py -v` → **10 passed** in 0.96s.
- **Metadata guard**: `python scripts/check-user-visible-metadata.py --repo .` → exit 0.
- **Canonical harness**: **not re-run**; `harness_fail_zero_claimed=false`.

## Gate summary

| Gate | Result |
|------|--------|
| check_in_tests | **PASS** (scoped npm 58/58 + pytest 10/10 + US-0071 metadata; `harness_fail_zero_claimed=false`) |
| qa | PASS (`sprints/S0144/qa-findings.md`; 0 blockers; NB1..NB3 informational) |
| verify_work | PASS (`sprints/S0144/uat.json` verdict=PASS; 6/6 ACs; 7/7 UAT incl `convergence_smoke`; live npm+pytest) |
| uat | PASS (7/7; populated; `contract_tests_primary`; 6 live-runtime classes `UAT_PROBE_FORBIDDEN`) |
| isolation_evidence | PASS (execute+qa+verify-work+sovereign-critic+release; distinct markers; `model_id` set) |
| strict_runtime_proof | **PASS** (verify-work `rp-auto-20260913-us0138-verify-work-qa-20260913T153500Z-US-0138` TTL `2026-09-13T16:35:00Z` consumed @ `15:55:00Z`; proof_hash recomputed MATCH `AD011E773148A0FD1564E67F52F46D7B4A5737118995E690952FE2E484F5B4D1`; critic of verify-work PASS `5CD7F3958CCB6FDF2C8AA1F41D875BDD3E37251D04064ACED4BD3CEAB334FD20`) |
| readme_feature_coverage_3f | FAIL non-blocking (`README_FEATURE_COVERAGE_GAP:US-0135` — pre-existing; US-0138 OPEN excluded) |
| project_readme_3g | skipped (`FRAMEWORK_KIT_REPO=1`) |
| metadata_guard | PASS |
| triad_regression | PASS (pre-write `--check` PASS; post-append rollover recorded in state.md) |
| backlog_reconciliation | not performed (closure owns per US-0120 / DEC-0082) |
| publish | skipped (`RELEASE_PUBLISH_MODE=confirm`; `RELEASE_PUBLISH_AUTO_CONFIRM=0`) |
| sync | not_eligible (`SYNC_POLICY_MODE=disabled`) |
| finalization | **PASS** (queue row S0144 = `released`) |

## Run

```powershell
# US-0138 contract (12/12) + US-0137/US-0136/US-0135/US-0134/US-0133 compose:
cd standalone; npm test
#   Expected: 58 passed (12/12 test_us0138_* + us0133 + us0134 + us0135 + us0136 + us0137 + unit)

python -m pytest tests/us0138_contract_test.py tests/us0137_contract_test.py tests/us0136_contract_test.py tests/us0135_contract_test.py tests/us0134_contract_test.py tests/us0133_contract_test.py -v
#   Expected: 10 passed

python scripts/check-user-visible-metadata.py --repo .
#   Expected: exit 0 (silent PASS)
```

Start command for the shipped pack (typed config contract-test kit — not a long-running HTTP service):

```bash
cd standalone && npm test && python -m pytest tests/us0138_contract_test.py tests/us0137_contract_test.py tests/us0136_contract_test.py tests/us0135_contract_test.py tests/us0134_contract_test.py tests/us0133_contract_test.py -v
```

- **start_command**: `cd standalone && npm test` (operator validation; contract-test kit)
- **runtime_mode**: `local`
- **runtime_context_ref**: `docs/engineering/architecture.md` `# US-0138`; `decisions/DEC-0138.md`; `docs/engineering/runtime-connectivity.md` (local kit — no remote service)

## Connect

- **service_url**: `n/a` (unpublished standalone `@its-magic/config` contract-test kit — no service endpoint)
- **service_port**: `n/a`
- **health_endpoint**: `n/a` (health = contract tests, not HTTP)

## Verify

1. `cd standalone && npm test` → 58 passed (12/12 `test_us0138_*`)
2. `python -m pytest tests/us0138_contract_test.py tests/us0137_contract_test.py tests/us0136_contract_test.py tests/us0135_contract_test.py tests/us0134_contract_test.py tests/us0133_contract_test.py -v` → 10 passed
3. `python scripts/check-user-visible-metadata.py --repo .` → exit 0
4. Spot-check: `standalone/packages/config` has no Pi imports; kit `files` omit `standalone/`; consumers do not import `@its-magic/config`
5. Operators: 5-layer resolve fail-closed; `CONFIG_SECRET_REJECTED`; `security_hard` unrelaxable; DEC-0039 locals preserved

**expected_health_signal**: all 12 `test_us0138_*` markers PASS; us0133–us0137 compose green; metadata guard exit 0; backlog US-0138 remains OPEN until `/closure`.

## Credentials

- **credential_source_refs**: `n/a` (no API keys required for contract-test verify; fake-model CI default)
- **expected_value_source**: operator local kit checkout; no inline secrets

## Known Issues

None blocking.

- **NB-1** (informational): verify-work + qa proofs MATCH; 12/12 + 10/10 independently re-verified; CONFIG_* fail-closed; secret reject + security_hard unrelaxable; DEC-0039 local preservation.
- **NB-2** (informational): inject-only compose; consumers do not import config; PolicyEngine/KernelBridge/auth-models/RoleCatalog/host_runtime_config_lib.py held.
- **NB-3** (informational): Do not mark US-0138 DONE at release; do not tick acceptance; do not reopen US-0137/US-0136/US-0135/BUG-0020; no US-0139+; harness Fail:0 not claimed.
- **NB-4** (informational): `README_FEATURE_COVERAGE_GAP:US-0135` — pre-existing readme drift; remediation deferred (not US-0138 scope).

## Evidence refs

- `sprints/S0144/qa-findings.md` (QA_PASS)
- `sprints/S0144/uat.json`, `sprints/S0144/uat.md` (verify-work PASS)
- `sprints/S0144/summary.md`
- `sprints/S0144/release-findings.md`
- `sprints/S0144/verify-work-findings.md`
- `docs/engineering/state.md` (execute / qa / verify-work / sovereign-critic / release checkpoints)

## Next phase

**sovereign-critic (release)** then **`/closure`** (fresh **qe** subagent). Release does **not** spawn closure or sovereign-critic. Backlog US-0138 remains **OPEN**; acceptance US-0138 remains **unchecked** until closure.
