# Release Notes — S0142 / US-0136

- **Sprint**: `S0142`
- **Story**: `US-0136` — Fresh role sessions and runtime attestation (`@its-magic/role-runtime`, RoleCatalog + SessionSupervisor wrapping injected `AgentKernel.createSession`, in-memory ContinuationContract same-phase `run`/`steer`, sidecar spawn/start/end + `attestation_hash`, fail-closed `SESSION_*`/`ATTESTATION_*`, TS orchestrator scheduling-only, 10 `test_us0136_*`)
- **Release date**: `2026-09-13T09:15:00Z` (UTC)
- **orchestrator_run_id**: `auto-20260913-us0136`
- **delivery_mode**: `ultra_lean`
- **macro_phase**: `ship` (release is phase 1 of 3: release → closure → refresh-context per DEC-0082)
- **policy_mode**: `confirm` (`RELEASE_PUBLISH_MODE=confirm`; `RELEASE_PUBLISH_AUTO_CONFIRM=0` → no publish execution)
- **trigger_source**: `auto`
- **branch**: `local` (no push; `SYNC_POLICY_MODE=disabled` per DEC-0018)
- **fresh_context_marker**: `rel-US0136-release-20260913T091500Z-fresh`
- **model_id**: `composer-2.5-fast` (CROSS_MODEL_REVIEW=1 — required)
- **runtime_proof_id**: `rp-auto-20260913-us0136-release-release-20260913T091500Z-US-0136`
- **proof_hash**: `2A1CB96E3D0F6F6FBAB1E0733100B82765F5C3DD9235B8ADC8C0D72797529957`
- **proof_ttl**: `2026-09-13T10:15:00Z` (UTC)
- **release_version**: (none — workflow-only release; no semver bump)

## Verdict

**RELEASE_PASS.** All mandatory release gates (1, 2, 3, 4, 4b) green with **scoped standalone npm test 36/36** (10/10 `test_us0136_*`) + **kit pytest 8/8**. Queue row S0142 → `released`. No backlog mutation (closure owns OPEN→DONE + acceptance tick per US-0120 / DEC-0082). No npm / GitHub / Homebrew / Chocolatey publish.

Gate-1 evidence: live scoped slice + US-0071 metadata. **`harness_fail_zero_claimed=false`** — full `tests/run-tests.ps1` was not re-run this pass.

## Summary

US-0136 ships standalone role-runtime (approach A1 / R-0128 / DEC-0136):

- `@its-magic/role-runtime` private 0.0.0; no Pi deps in role-runtime.
- `SessionSupervisor` wraps injected `AgentKernel.createSession`; in-memory sessions.
- `ContinuationContract` same-phase `run`/`steer`; restart deny.
- Typed `RoleCatalog` (DEC-0051 + `AUTO_ROLE_*` + extra rows).
- Sidecar spawn/start/end + `attestation_hash` (SHA-256 canonical JSON without that field; separate from DEC-0038 tuple).
- Fail-closed `SESSION_*` / `ATTESTATION_*` + reused kit codes.
- `assertOrchestratorSchedulingOnly`; no Pi in gate.
- Exactly 10 `test_us0136_*`; compose us0133/us0134/us0135 green.

FRAMEWORK_KIT_REPO=1 — UAT probe class `contract_tests_primary`; 6 live-runtime classes waived `UAT_PROBE_FORBIDDEN`. No fake browser PASS. No live paid provider CI.

## ACs satisfied (QA + verify-work, UAT 8/8)

**7/7 PASS** (live npm 10/10 + pytest 8/8):

| AC | Description | Status |
|----|-------------|--------|
| AC-1 | SessionSupervisor fresh Pi session per producer/review/execute-QA rework except versioned continuation | PASS (markers 1–4, 6, 8) |
| AC-2 | Typed RoleCatalog canonical map + alternates + bounded sovereign injection | PASS (marker 7) |
| AC-3 | spawn/start/end attestations bound to run/phase/role/kernel/model/hashes/freshness | PASS (marker 9) |
| AC-4 | US-0048/US-0056 compatible; additive sidecar | PASS (marker 9) |
| AC-5 | Fail-closed reused IDs / role mismatch / transcript / missing-stale-hash / orchestrator mutation | PASS (markers 6–10) |
| AC-6 | Orchestrator scheduling-only; no write/shell tools | PASS (marker 10) |
| AC-7 | Isolation tests: PO/DEV, execute/QA cycle, critic, crash, dispose | PASS (markers 1–5) |

## Test results (release — live this pass)

- **Standalone contract + unit**: `cd standalone && npm test` → **36 passed** in 2.75s (**10/10** `test_us0136_*` + us0133 + us0134 + us0135 + unit).
- **Kit + compose contract tests**: `python -m pytest tests/us0136_contract_test.py tests/us0135_contract_test.py tests/us0134_contract_test.py tests/us0133_contract_test.py -v` → **8 passed** in 0.72s.
- **Metadata guard**: `python scripts/check-user-visible-metadata.py --repo .` → exit 0.
- **Canonical harness**: **not re-run**; `harness_fail_zero_claimed=false`.

## Gate summary

| Gate | Result |
|------|--------|
| check_in_tests | **PASS** (scoped npm 36/36 + pytest 8/8 + US-0071 metadata; `harness_fail_zero_claimed=false`) |
| qa | PASS (`sprints/S0142/qa-findings.md`; 0 blockers; NB1..NB3 informational) |
| verify_work | PASS (`sprints/S0142/uat.json` verdict=PASS; 7/7 ACs; 8/8 UAT incl `convergence_smoke`; live npm+pytest) |
| uat | PASS (8/8; populated; `contract_tests_primary`; 6 live-runtime classes `UAT_PROBE_FORBIDDEN`) |
| isolation_evidence | PASS (execute+qa+verify-work+sovereign-critic+release; distinct markers; `model_id` set) |
| strict_runtime_proof | **PASS** (verify-work `rp-auto-20260913-us0136-verify-work-qa-20260913T085500Z-US-0136` TTL `2026-09-13T09:55:00Z` consumed @ `09:15:00Z`; proof_hash recomputed MATCH `1FC1CFD6F02100E19C0C9263892BFAED05C2FCD57D6CE5D628FBF43F4BD62237`; critic of verify-work PASS `BEAF4C06BE4B67435328F416087C70DDE2057C900901CCCA36C15DB90EC0CA15`) |
| readme_feature_coverage_3f | FAIL non-blocking (`README_FEATURE_COVERAGE_GAP:US-0135` — pre-existing; US-0136 OPEN excluded) |
| project_readme_3g | skipped (`FRAMEWORK_KIT_REPO=1`) |
| metadata_guard | PASS |
| triad_regression | PASS (pre-write `--check` PASS; post-append rollover in state.md) |
| backlog_reconciliation | not performed (closure owns per US-0120 / DEC-0082) |
| publish | skipped (`RELEASE_PUBLISH_MODE=confirm`; `RELEASE_PUBLISH_AUTO_CONFIRM=0`) |
| sync | not_eligible (`SYNC_POLICY_MODE=disabled`) |
| finalization | **PASS** (queue row S0142 = `released`) |

## Run

```powershell
# US-0136 contract (10/10) + US-0135/US-0134/US-0133 compose:
cd standalone; npm test
#   Expected: 36 passed (10/10 test_us0136_* + us0133 + us0134 + us0135 + unit)

python -m pytest tests/us0136_contract_test.py tests/us0135_contract_test.py tests/us0134_contract_test.py tests/us0133_contract_test.py -v
#   Expected: 8 passed

python scripts/check-user-visible-metadata.py --repo .
#   Expected: exit 0 (silent PASS)
```

Start command for the shipped pack (role-runtime / CLI/session contract-test kit — not a long-running HTTP service):

```bash
cd standalone && npm test && python -m pytest tests/us0136_contract_test.py tests/us0135_contract_test.py tests/us0134_contract_test.py tests/us0133_contract_test.py -v
```

- **start_command**: `cd standalone && npm test` (operator validation; contract-test kit)
- **runtime_mode**: `local`
- **runtime_context_ref**: `docs/engineering/runbook.md` `### Fresh role sessions and runtime attestation (US-0136 / R-0128 / DEC-0136)`; `docs/engineering/runtime-connectivity.md` (local kit — no remote service)

## Connect

- **service_url**: `n/a` (unpublished standalone role-runtime / CLI/session contract-test kit — no service endpoint)
- **service_port**: `n/a`
- **health_endpoint**: `n/a` (health = contract tests, not HTTP)

## Verify

1. `cd standalone && npm test` → 36 passed (10/10 `test_us0136_*`)
2. `python -m pytest tests/us0136_contract_test.py tests/us0135_contract_test.py tests/us0134_contract_test.py tests/us0133_contract_test.py -v` → 8 passed
3. `python scripts/check-user-visible-metadata.py --repo .` → exit 0
4. Spot-check: `standalone/packages/role-runtime` has no Pi imports; SessionSupervisor wraps injected AgentKernel; sidecar `attestation_hash` ≠ DEC-0038 tuple; kit `files` omit `standalone/`
5. Operators: fresh session per phase/role; RoleCatalog fail-closed; orchestrator scheduling-only

**expected_health_signal**: all 10 `test_us0136_*` markers PASS; us0133/us0134/us0135 compose green; metadata guard exit 0; backlog US-0136 remains OPEN until `/closure`.

## Credentials

- **credential_source_refs**: `n/a` (no API keys required for contract-test verify; fake-model CI default)
- **expected_value_source**: operator local kit checkout; no inline secrets

## Known Issues

None blocking.

- **NB-1** (informational): qa+execute proofs MATCH; SessionSupervisor freshness + ContinuationContract same-phase run/steer + crash orphan + attestation fail-closed locked in tests.
- **NB-2** (informational): role-runtime no Pi; SessionSupervisor wrap injected AgentKernel; sidecar `attestation_hash` ≠ DEC-0038; isolation/`noTools`/KernelBridge/auth-models unamended.
- **NB-3** (informational): Do not mark US-0136 DONE at release; do not tick acceptance; do not reopen US-0135/BUG-0020; no US-0137+; harness Fail:0 not claimed.
- **NB-4** (informational): `README_FEATURE_COVERAGE_GAP:US-0135` — pre-existing readme drift; remediation deferred (not US-0136 scope).

## Evidence refs

- `sprints/S0142/qa-findings.md` (QA_PASS)
- `sprints/S0142/uat.json`, `sprints/S0142/uat.md` (verify-work PASS)
- `sprints/S0142/summary.md`
- `sprints/S0142/release-findings.md`
- `sprints/S0142/verify-work-findings.md`
- `docs/engineering/state.md` (execute / qa / verify-work / sovereign-critic / release checkpoints)

## Next phase

`/closure` (fresh **qe** subagent, ship macro phase 2 of 3 per DEC-0082). Release does **not** spawn closure. Backlog US-0136 remains **OPEN**; acceptance US-0136 remains **unchecked** until closure.
