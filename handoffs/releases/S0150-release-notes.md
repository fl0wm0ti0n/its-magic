# Release Notes — S0150 / US-0142

- **Sprint**: `S0150`
- **Story**: `US-0142` — Owned browser UAT and evidence runtime (`@its-magic/browser-uat` no Pi; compose US-0141 `connectHandoff`; Playwright isolated `launch`+`newContext` + typed CDP `connectOverCDP`/`disconnect`; promote `itsm_browser`; additive `UAT_BROWSER_PROBE_MODE=owned`; fail-closed `BROWSER_*`/`UAT_*`; `BROWSER_RETRY_MAX` default 2; 12 `test_us0142_*`)
- **Release date**: `2026-09-14T05:30:00Z` (UTC)
- **orchestrator_run_id**: `auto-20260913-us0142`
- **delivery_mode**: `ultra_lean`
- **macro_phase**: `ship` (release is phase 1 of 3: release → sovereign-critic (release) → closure per native chain)
- **policy_mode**: `confirm` (`RELEASE_PUBLISH_MODE=confirm`; `RELEASE_PUBLISH_AUTO_CONFIRM=0` → no publish execution)
- **trigger_source**: `auto`
- **branch**: `local` (no push; `SYNC_POLICY_MODE=disabled` per DEC-0018)
- **fresh_context_marker**: `rel-US0142-release-20260914T053000Z-fresh`
- **model_id**: `composer-2.5-fast` (CROSS_MODEL_REVIEW=1 — required)
- **runtime_proof_id**: `rp-auto-20260913-us0142-release-release-20260914T053000Z-US-0142`
- **proof_hash**: `1656F5928BA41EE1941A51D6CE2E5BC8A777910C6897171170405DC7F46EAF9B`
- **proof_ttl**: `2026-09-14T06:30:00Z` (UTC)
- **release_version**: (none — workflow-only release; no semver bump)

## Verdict

**RELEASE_PASS.** All mandatory release gates (1, 2, 3, 4, 4b) green with **scoped pytest 12/12** (`test_us0142_*`) + standalone npm **106/106** qa attestation. Queue row S0150 → `released`. No backlog mutation (closure owns OPEN→DONE + acceptance tick per US-0120 / DEC-0082). No npm / GitHub publish.

Gate-1 evidence: live scoped pytest + US-0071 metadata. **`harness_fail_zero_claimed=false`** — full `tests/run-tests.ps1` was not re-run this pass.

## Summary

US-0142 ships standalone `@its-magic/browser-uat` (approach A1 / R-0139 / DEC-0142):

- `BrowserUAT` facade composing US-0141 `connectHandoff`; ToolBroker delegates to BrowserUAT (no Playwright import in ToolBroker).
- Playwright isolated `launch`+`newContext` + typed CDP `connectOverCDP`/`disconnect` (dedicated profile; default Chrome forbidden).
- Promote `itsm_browser` from STUB; additive `UAT_BROWSER_PROBE_MODE=owned` (kit `cursor` default held).
- Fail-closed `BROWSER_*`/`UAT_*`; `BROWSER_RETRY_MAX` default 2; US-0135 redact compose.
- Exactly 12 `test_us0142_*`; compose us0133–us0141 green (106/106 npm attestation).

FRAMEWORK_KIT_REPO=1 — UAT probe class `contract_tests_primary` + owned-mode hermetic `FakeBrowserDriver`; 6 live-runtime classes waived `UAT_PROBE_FORBIDDEN`. **No fake live-Chrome PASS.** `live_chrome_probed=false`.

## ACs satisfied (QA + verify-work, UAT 9/9)

**8/8 PASS** (live pytest 12/12):

| AC | Description | Status |
|----|-------------|--------|
| AC-1 | Playwright isolated + authorized CDP | PASS |
| AC-2 | Typed `itsm_browser` actions | PASS |
| AC-3 | UAT planner + `owned` + kit forbidden held | PASS |
| AC-4 | Evidence schema + `app_runtime_ref` | PASS |
| AC-5 | Fail-closed + retry cap | PASS |
| AC-6 | Credential deny / no `.env` | PASS |
| AC-7 | Redact headers/cookies/tokens | PASS |
| AC-8 | E2E happy+failure hermetic; no visual-diff | PASS |

## Test results (release — live this pass)

- **Kit python contract**: `python -m pytest tests/us0142_contract_test.py -q` → **12 passed** in 0.06s (**12/12** `test_us0142_*`).
- **Standalone contract + unit**: `cd standalone && npm test` → **106/106** qa attestation (2026-09-14T04:50:00Z; not re-run this pass).
- **Metadata guard**: `python scripts/check-user-visible-metadata.py --repo .` → exit 0.
- **Canonical harness**: **not re-run**; `harness_fail_zero_claimed=false`.

## Gate summary

| Gate | Result |
|------|--------|
| check_in_tests | **PASS** (scoped pytest 12/12 + US-0071 metadata; npm 106/106 attestation; `harness_fail_zero_claimed=false`) |
| qa | PASS (`sprints/S0150/qa-findings.md`; 0 blockers; NB1..NB3 informational) |
| verify_work | PASS (`sprints/S0150/uat.json` verdict=PASS; 8/8 ACs; 9/9 UAT incl `convergence_smoke`; live pytest) |
| uat | PASS (9/9; populated; `contract_tests_primary` + owned-mode hermetic; 6 live-runtime classes `UAT_PROBE_FORBIDDEN`) |
| isolation_evidence | PASS (execute+qa+verify-work+sovereign-critic(verify-work)+release; distinct markers; `model_id` set) |
| strict_runtime_proof | **PASS** (verify-work `rp-auto-20260913-us0142-verify-work-qa-20260914T051000Z-US-0142` TTL `2026-09-14T06:10:00Z` consumed @ `05:30:00Z`; proof_hash recomputed MATCH `31D29ABC8E5B47963DFC7B9CA08125DBD2BFCBFB01D86B76257ECF8FC0684871`; critic of verify-work PASS `DBB585937A87B79F0B3633BDD5A552A1C6AB3112A44A85ACF8B7D41D0D911765`) |
| readme_feature_coverage_3f | FAIL_nonblocking (`README_FEATURE_COVERAGE_ENFORCE=1`; gaps BUG-0021, BUG-0023, US-0135..US-0141 — not blocking OPEN story; precedent S0149) |
| project_readme_3g | skipped (`FRAMEWORK_KIT_REPO=1`) |
| metadata_guard | PASS |
| triad_regression | skipped (no state rollover required this pass) |
| backlog_reconciliation | not performed (closure owns per US-0120 / DEC-0082) |
| publish | skipped (`RELEASE_PUBLISH_MODE=confirm`; `RELEASE_PUBLISH_AUTO_CONFIRM=0`) |
| sync | not_eligible (`SYNC_POLICY_MODE=disabled`) |
| finalization | **PASS** (queue row S0150 = `released`) |

## Run

```powershell
# US-0142 contract (12/12) + us0133..us0141 compose:
python -m pytest tests/us0142_contract_test.py -q
#   Expected: 12 passed (12/12 test_us0142_*)

cd standalone; npm test
#   Expected: 106 passed (12/12 test_us0142_* + us0133..us0141 compose + unit)

python scripts/check-user-visible-metadata.py --repo .
#   Expected: exit 0 (silent PASS)
```

Start command for the shipped pack (browser-uat contract-test kit — not a long-running HTTP service):

```bash
python -m pytest tests/us0142_contract_test.py -q && cd standalone && npm test
```

- **start_command**: `python -m pytest tests/us0142_contract_test.py -q` (operator validation; contract-test kit)
- **runtime_mode**: `local`
- **runtime_context_ref**: `docs/engineering/architecture.md` `# US-0142`; `decisions/DEC-0142.md`; `docs/engineering/runtime-connectivity.md` (local kit — no remote service)

## Connect

- **service_url**: `n/a` (unpublished standalone `@its-magic/browser-uat` contract-test kit — no service endpoint)
- **service_port**: `n/a`
- **health_endpoint**: `n/a` (health = contract tests, not HTTP)

## Verify

1. `python -m pytest tests/us0142_contract_test.py -q` → 12 passed (12/12 `test_us0142_*`)
2. `cd standalone && npm test` → 106 passed (compose us0133–us0141 green)
3. `python scripts/check-user-visible-metadata.py --repo .` → exit 0
4. Spot-check: `standalone/packages/browser-uat` has no Pi imports; kit `files` omit `standalone/`; ToolBroker has no Playwright import; `**/.its-magic/runtime/` gitignored; `live_chrome_probed=false`

**expected_health_signal**: all 12 `test_us0142_*` markers PASS; us0133–us0141 compose green; metadata guard exit 0; backlog US-0142 remains OPEN until `/closure`.

## Credentials

- **credential_source_refs**: `n/a` (no API keys required for contract-test verify; fake-model CI default; AC-6 credential deny hermetic)
- **expected_value_source**: operator local kit checkout; no inline secrets; no `.env` reads

## Known Issues

None blocking.

- **NB-1** (informational): verify-work + qa proofs MATCH; 12/12 independently re-verified; `UAT_PROBE_FORBIDDEN` honest for live Chrome; owned-mode hermetic not live-Chrome PASS; `fake_browser_pass_claimed=false`.
- **NB-2** (informational): sibling browser-uat + connectHandoff compose; ToolBroker→BrowserUAT; US-0143 drain OUT; pixel baseline OUT.
- **NB-3** (informational): Do not mark US-0142 DONE at release; do not tick acceptance; do not reopen US-0133..US-0141; no BUG-0021/0022/0023 mutation; harness Fail:0 not claimed.

## Next

**sovereign-critic (release)** then **`/closure`** (fresh **qe** subagent). Release does **not** spawn sovereign-critic or closure.
