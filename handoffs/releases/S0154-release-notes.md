# Release Notes — S0154 / US-0147

- **Sprint**: `S0154`
- **Story**: `US-0147` — Installation, update, and existing-project adoption (triple-installer parity; `standalone_runtime_install_lib`; ten `test_us0147_*`)
- **Release date**: `2026-09-17T21:30:00Z` (UTC)
- **orchestrator_run_id**: `auto-20260917-us0146`
- **delivery_mode**: `ultra_lean`
- **macro_phase**: `ship` (release → `/closure` per CROSS_MODEL_REVIEW=0 native chain)
- **policy_mode**: `confirm` (`RELEASE_PUBLISH_MODE=confirm`; operator confirm absent this turn → publish skipped)
- **trigger_source**: `auto`
- **branch**: `local` (no push; `SYNC_POLICY_MODE=disabled`)
- **fresh_context_marker**: `rel-US0147-release-20260917T213000Z-fresh`
- **model_id**: `inherit` (CROSS_MODEL_REVIEW=0)
- **runtime_proof_id**: `rp-auto-20260917-us0146-release-release-20260917T213000Z-US-0147`
- **proof_hash**: `1FBC06A2499FA7614F9336AD60FA6061161C8752C6789026B6FEBF2D801F890B`
- **proof_ttl**: `2026-09-17T22:30:00Z` (UTC)
- **release_version**: (none — workflow-only release)

## Verdict

**RELEASE_PASS.** Mandatory release gates (1, 2, 3, 4, 4b) green with **pytest 10/10** (`test_us0147_*`) + standalone npm **140/140** qa attestation. Queue row S0154 → `released`. No backlog mutation (closure owns OPEN→DONE). No npm / GitHub publish.

Gate-1: live scoped contract @ release + US-0071 metadata exit 0. **`harness_fail_zero_claimed=false`**.

## Summary

US-0147 ships standalone install/update/adoption into consumer repos (A1 / R-0144 / DEC-0147):

- `scripts/standalone_runtime_install_lib.py` — adoption classifier, bootstrap hook, staging rollback, kernel preflight, browser explicit gate, uninstall.
- Triple installers (`installer.py` / `.ps1` / `.sh`) wire `bootstrap_standalone_runtime_installer_hook`.
- `installer-owned-paths.manifest` + `template/.its-magic/standalone/` mirror; runbook operator sections.
- Exactly ten `test_us0147_*`; compose US-0146 held (140/140 npm attestation).

FRAMEWORK_KIT_REPO=1 — UAT `contract_tests_primary`; 6 live-runtime classes `UAT_PROBE_FORBIDDEN`. **No live Chrome.** `live_chrome_probed=false`.

## ACs satisfied (QA + verify-work, UAT 9/9)

**8/8 PASS** (live pytest 10/10 @ release):

| AC | Status |
|----|--------|
| AC-1 | PASS — Win/Linux install/update + rollback |
| AC-2 | PASS — fresh init without backlog clone |
| AC-3 | PASS — adopt existing its-magic repos |
| AC-4 | PASS — cursor/opencode/both coexistence |
| AC-5 | PASS — deny_overwrite preserves user layers |
| AC-6 | PASS — kernel mismatch diagnostics fail-closed |
| AC-7 | PASS — runbook + explicit browser setup gate |
| AC-8 | PASS — lifecycle markers (10/10) |

## Test results (release — live this pass)

- **Scoped kit contract**: `python -m pytest tests/us0147_contract_test.py -q` → **10 passed** in 0.13s (10/10 `test_us0147_*`).
- **Standalone contract + unit**: `cd standalone && npm test` → **140/140** qa attestation (2026-09-17T21:10:00Z; not re-run this pass).
- **Metadata guard**: `python scripts/check-user-visible-metadata.py --repo .` → exit 0.
- **Canonical harness**: not re-run; `harness_fail_zero_claimed=false`.

## Gate summary

| Gate | Result |
|------|--------|
| check_in_tests | **PASS** (pytest 10/10 + US-0071 metadata; npm 140/140 attestation) |
| qa | PASS (`sprints/S0154/qa-findings.md`; 0 blockers) |
| verify_work | PASS (`sprints/S0154/uat.json` 8/8 ACs; 9/9 UAT; verify-work pytest 10/10) |
| uat | PASS (9/9; `contract_tests_primary`; live Chrome `UAT_PROBE_FORBIDDEN`) |
| isolation_evidence | PASS (execute+qa+verify-work+release; distinct markers; CROSS_MODEL_REVIEW=0) |
| strict_runtime_proof | **PASS** (verify-work `rp-auto-20260917-us0146-verify-work-qa-20260917T212000Z-US-0147` / `D53214A54301469C6CACC27988350CC3FD3739F1E99738DBCBFE9B6974E70310` consumed @21:30:00Z before TTL 22:20:00Z; qa+execute MATCH) |
| readme_feature_coverage_3f | FAIL_nonblocking (gaps BUG-0021, BUG-0023, US-0135..US-0146 — precedent S0153) |
| project_readme_3g | skipped (`FRAMEWORK_KIT_REPO=1`) |
| publish | skipped (`RELEASE_PUBLISH_MODE=confirm`; no operator confirm) |
| sync | not_eligible (`SYNC_POLICY_MODE=disabled`) |
| finalization | **PASS** (queue S0154 = `released`) |

## Run

```powershell
python -m pytest tests/us0147_contract_test.py -q
# Expected: 10 passed (10/10 test_us0147_*)

cd standalone; npm test
# Expected: 140 passed (compose + US-0146 held)

python scripts/check-user-visible-metadata.py --repo .
# Expected: exit 0
```

- **start_command**: `python -m pytest tests/us0147_contract_test.py -q`
- **runtime_mode**: `local`
- **runtime_context_ref**: `docs/engineering/runbook.md` ## Standalone install, update, and adoption (US-0147); `decisions/DEC-0147.md`; `docs/engineering/runtime-connectivity.md`

## Connect

- **service_url**: `n/a` (installer kit; no HTTP service)
- **service_port**: `n/a`
- **health_endpoint**: `n/a`

## Verify

1. Run pytest `tests/us0147_contract_test.py` → 10/10 `test_us0147_*` PASS.
2. Run `cd standalone && npm test` → 140/140 (or re-attest qa timestamp).
3. Run metadata guard → exit 0.
4. Spot-check triple installers call `bootstrap_standalone_runtime_installer_hook`; browser via `itsm setup browser` only.
5. Confirm UAT honesty: `probe_kind=contract_tests_primary`; `live_chrome_probed=false`.

- **expected_health_signal**: pytest 10/10 markers passed; metadata script silent exit 0.

## Credentials

- No inline secrets. Kit denies `.env` reads (US-0085). No API tokens required for contract verification.
- Env-ref only if publish later enabled: see `docs/engineering/release-targets.json` (`*Env` fields).

## Known Issues

- README feature coverage gaps (3f) remain non-blocking for OPEN story release.
- Full `tests/run-tests.ps1` harness not claimed (`harness_fail_zero_claimed=false`).
- US-0147 backlog status remains **OPEN** until `/closure`.
- Publish pending operator confirm (`RELEASE_PUBLISH_MODE=confirm`).

## Evidence refs

- `sprints/S0154/release-findings.md`
- `sprints/S0154/qa-findings.md`
- `sprints/S0154/uat.json`
- `sprints/S0154/uat.md`
- `sprints/S0154/summary.md`
- `sprints/S0154/verify-work-verdict.json`
- `handoffs/release_queue.md`
- `docs/engineering/state.md`
