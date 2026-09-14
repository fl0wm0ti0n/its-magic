# Release Notes — S0149 / US-0141

- **Sprint**: `S0149`
- **Story**: `US-0141` — Application runtime and pluggable execution backends (`@its-magic/app-runtime` no Pi; AppRuntime + ProcessManager + CLI-first local/docker + WSL/SSH/remote-Docker adapters; additive `process_handles`; bounded self-debug `APP_RUNTIME_RESTART_MAX` default 3; Connect handoff no browser; 12 `test_us0141_*`)
- **Release date**: `2026-09-14T02:10:00Z` (UTC)
- **orchestrator_run_id**: `auto-20260913-us0141`
- **delivery_mode**: `ultra_lean`
- **macro_phase**: `ship` (release is phase 1 of 3: release → sovereign-critic (release) → closure per native chain)
- **policy_mode**: `confirm` (`RELEASE_PUBLISH_MODE=confirm`; `RELEASE_PUBLISH_AUTO_CONFIRM=0` → no publish execution)
- **trigger_source**: `auto`
- **branch**: `local` (no push; `SYNC_POLICY_MODE=disabled` per DEC-0018)
- **fresh_context_marker**: `rel-US0141-release-20260914T021000Z-fresh`
- **model_id**: `composer-2.5-fast` (CROSS_MODEL_REVIEW=1 — required)
- **runtime_proof_id**: `rp-auto-20260913-us0141-release-release-20260914T021000Z-US-0141`
- **proof_hash**: `272CB66024D6B3DC8C967C15B057D14F5605466B4D6B2251D233D3015B04AE18`
- **proof_ttl**: `2026-09-14T03:10:00Z` (UTC)
- **release_version**: (none — workflow-only release; no semver bump)

## Verdict

**RELEASE_PASS.** All mandatory release gates (1, 2, 3, 4, 4b) green with **scoped pytest 12/12** (`test_us0141_*`) + standalone npm **94/94** qa attestation. Queue row S0149 → `released`. No backlog mutation (closure owns OPEN→DONE + acceptance tick per US-0120 / DEC-0082). No npm / GitHub publish.

Gate-1 evidence: live scoped pytest + US-0071 metadata. **`harness_fail_zero_claimed=false`** — full `tests/run-tests.ps1` was not re-run this pass.

## Summary

US-0141 ships standalone `@its-magic/app-runtime` (approach A1 / R-0138 / DEC-0141):

- `AppRuntime` facade + `ProcessManager` + `ExecutionBackend` local/docker core + WSL/SSH adapters.
- Additive `RunsStore.process_handles` compose (US-0140); `reserveProcessHandle` remains claim token.
- Stack profiles Node/Python/Go/Java/.NET; unknown fail/fallback deterministic.
- Bounded self-debug `APP_RUNTIME_RESTART_MAX` default 3; HEALTHCHECK status-only.
- Connect handoff field names (US-0098); no Playwright/CDP (US-0142 OUT).
- Cleanup/orphan reap; fake backends; `BACKEND_UNSUPPORTED` fail-closed.
- Exactly 12 `test_us0141_*`; compose us0133–us0140 green (94/94 npm attestation).

FRAMEWORK_KIT_REPO=1 — UAT probe class `contract_tests_primary`; 6 live-runtime classes waived `UAT_PROBE_FORBIDDEN`. No fake browser PASS.

## ACs satisfied (QA + verify-work, UAT 9/9)

**8/8 PASS** (live pytest 12/12):

| AC | Description | Status |
|----|-------------|--------|
| AC-1 | AppRuntime lifecycle discover/start/stop/restart/health/logs | PASS |
| AC-2 | ProcessManager identity + additive `process_handles` | PASS |
| AC-3 | local+docker core + WSL/SSH adapters | PASS |
| AC-4 | Stack profiles Node/Python/Go/Java/.NET + unknown fail/fallback | PASS |
| AC-5 | Bounded self-debug + restart cap | PASS |
| AC-6 | Test/build evidence + summarize | PASS |
| AC-7 | Connect handoff no browser + cleanup | PASS |
| AC-8 | Chaos fixtures + `BACKEND_UNSUPPORTED` | PASS |

## Test results (release — live this pass)

- **Kit python contract**: `python -m pytest tests/us0141_contract_test.py -q` → **12 passed** in 0.06s (**12/12** `test_us0141_*`).
- **Standalone contract + unit**: `cd standalone && npm test` → **94/94** qa attestation (2026-09-14T01:30:00Z; not re-run this pass).
- **Metadata guard**: `python scripts/check-user-visible-metadata.py --repo .` → exit 0.
- **Canonical harness**: **not re-run**; `harness_fail_zero_claimed=false`.

## Gate summary

| Gate | Result |
|------|--------|
| check_in_tests | **PASS** (scoped pytest 12/12 + US-0071 metadata; npm 94/94 attestation; `harness_fail_zero_claimed=false`) |
| qa | PASS (`sprints/S0149/qa-findings.md`; 0 blockers; NB1..NB3 informational) |
| verify_work | PASS (`sprints/S0149/uat.json` verdict=PASS; 8/8 ACs; 9/9 UAT incl `convergence_smoke`; live pytest) |
| uat | PASS (9/9; populated; `contract_tests_primary`; 6 live-runtime classes `UAT_PROBE_FORBIDDEN`) |
| isolation_evidence | PASS (execute+qa+verify-work+sovereign-critic(verify-work)+release; distinct markers; `model_id` set) |
| strict_runtime_proof | **PASS** (verify-work `rp-auto-20260913-us0141-verify-work-qa-20260914T015000Z-US-0141` TTL `2026-09-14T02:50:00Z` consumed @ `02:10:00Z`; proof_hash recomputed MATCH `71E1071FD11CF3E3C0A5B92976EC5CA0676B50495D8DAC48548CB9AFACF1D677`; critic of verify-work PASS `ED54B156939BBC4EABE4E8FF60A29629D5B4AD2DB38CE48326C6D33AA08AAB3F`) |
| readme_feature_coverage_3f | FAIL_nonblocking (`README_FEATURE_COVERAGE_ENFORCE=1`; gaps BUG-0021, BUG-0023, US-0135..US-0140 — not blocking OPEN story; precedent S0148) |
| project_readme_3g | skipped (`FRAMEWORK_KIT_REPO=1`) |
| metadata_guard | PASS |
| triad_regression | skipped (no state rollover required this pass) |
| backlog_reconciliation | not performed (closure owns per US-0120 / DEC-0082) |
| publish | skipped (`RELEASE_PUBLISH_MODE=confirm`; `RELEASE_PUBLISH_AUTO_CONFIRM=0`) |
| sync | not_eligible (`SYNC_POLICY_MODE=disabled`) |
| finalization | **PASS** (queue row S0149 = `released`) |

## Run

```powershell
# US-0141 contract (12/12) + us0133..us0140 compose:
python -m pytest tests/us0141_contract_test.py -q
#   Expected: 12 passed (12/12 test_us0141_*)

cd standalone; npm test
#   Expected: 94 passed (12/12 test_us0141_* + us0133..us0140 compose + unit)

python scripts/check-user-visible-metadata.py --repo .
#   Expected: exit 0 (silent PASS)
```

Start command for the shipped pack (app-runtime contract-test kit — not a long-running HTTP service):

```bash
python -m pytest tests/us0141_contract_test.py -q && cd standalone && npm test
```

- **start_command**: `python -m pytest tests/us0141_contract_test.py -q` (operator validation; contract-test kit)
- **runtime_mode**: `local`
- **runtime_context_ref**: `docs/engineering/architecture.md` `# US-0141`; `decisions/DEC-0141.md`; `docs/engineering/runtime-connectivity.md` (local kit — no remote service)

## Connect

- **service_url**: `n/a` (unpublished standalone `@its-magic/app-runtime` contract-test kit — no service endpoint)
- **service_port**: `n/a`
- **health_endpoint**: `n/a` (health = contract tests, not HTTP)

## Verify

1. `python -m pytest tests/us0141_contract_test.py -q` → 12 passed (12/12 `test_us0141_*`)
2. `cd standalone && npm test` → 94 passed (compose us0133–us0140 green)
3. `python scripts/check-user-visible-metadata.py --repo .` → exit 0
4. Spot-check: `standalone/packages/app-runtime` has no Pi imports; kit `files` omit `standalone/`; no Playwright/dockerode; `**/.its-magic/runtime/` gitignored

**expected_health_signal**: all 12 `test_us0141_*` markers PASS; us0133–us0140 compose green; metadata guard exit 0; backlog US-0141 remains OPEN until `/closure`.

## Credentials

- **credential_source_refs**: `n/a` (no API keys required for contract-test verify; fake-model CI default)
- **expected_value_source**: operator local kit checkout; no inline secrets

## Known Issues

None blocking.

- **NB-1** (informational): verify-work + qa proofs MATCH; 12/12 independently re-verified; `UAT_PROBE_FORBIDDEN` honest; AC-7 not browser_smoke; no fake browser PASS.
- **NB-2** (informational): sibling app-runtime + RunsStore compose; ProcessManager writes vs `reserveProcessHandle` claim; US-0142/US-0143 OUT.
- **NB-3** (informational): Do not mark US-0141 DONE at release; do not tick acceptance; do not reopen US-0133..US-0140; no BUG-0021/0022/0023 mutation; harness Fail:0 not claimed.

## Next

**sovereign-critic (release)** then **`/closure`** (fresh **qe** subagent). Release does **not** spawn sovereign-critic or closure.
