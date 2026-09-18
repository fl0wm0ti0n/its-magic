# Release Notes — S0157 / BUG-0025

- **Sprint**: `S0157`
- **Bug**: `BUG-0025` — Packaged `its-magic` npm tarball omitted `scripts/standalone_runtime_install_lib.py`; loader now fails closed with `STANDALONE_BOOTSTRAP_FAILED`
- **Story**: (none)
- **Release date**: `2026-09-18T17:38:00Z` (UTC)
- **orchestrator_run_id**: `auto-20260918-bug0025`
- **parent_run**: `cursor-20260918-BUG0025-intake`
- **delivery_mode**: `ultra_lean`
- **macro_phase**: `ship` (release → `/closure` per CROSS_MODEL_REVIEW=0 native chain)
- **policy_mode**: `confirm` (`RELEASE_PUBLISH_MODE=confirm`; operator confirm absent this turn → npm publish deferred)
- **trigger_source**: `auto`
- **branch**: `local` (no push; `SYNC_POLICY_MODE=disabled`)
- **fresh_context_marker**: `release-BUG0025-20260918T173800Z-fresh`
- **model_id**: `omit` (CROSS_MODEL_REVIEW=0)
- **runtime_proof_id**: `rp-auto-20260918-bug0025-release-release-20260918T173800Z-BUG-0025`
- **proof_hash**: `E3FB2CA969A990EBDCE23BC05179FEADF99872C524390D2494219A503DFA4419`
- **proof_ttl**: `2026-09-18T18:38:00Z` (UTC)
- **release_version**: `0.1.4`
- **kit_version**: `0.1.4`

## Verdict

**RELEASE_PASS.** Mandatory release gates (1, 2, 3, 4, 4b) green with **scoped pytest bug0025 6/6** + US-0071 metadata exit 0. Queue row S0157 → `released`. T-009 / AC-6 **deferred-to-operator-confirm** (`PUBLISH_CONFIRMATION_REQUIRED`; `npm_published=false`) — not a release FAIL. No backlog mutation (closure owns OPEN→DONE). No npm / GitHub publish this turn. No git push.

Gate-1: live scoped contract @ release + US-0071 metadata exit 0. **`harness_fail_zero_claimed=false`** (full harness Fail:28 OOS pre-existing).

## Summary

BUG-0025 ships packaging fix for kit **0.1.4**:

- Root `package.json` `files` includes `scripts/standalone_runtime_install_lib.py` (not `scripts/`, not `standalone/`).
- `_load_standalone_runtime_install_lib` fails closed with `[STANDALONE_BOOTSTRAP_FAILED]` when lib missing (no raw `FileNotFoundError` as primary outcome).
- Bootstrap / postinstall catch missing-lib / OSError; supported-range residual fail-closed.
- `guard_installer_publish` requires allowlist entry; US-0133 omit-`standalone/` held; US-0147 compose-only.
- Patch bump `0.1.3` → `0.1.4` + chocolatey/homebrew/`.its-magic-version`/kernel-contract twins.
- Six locked `test_bug0025_*` contract markers.

FRAMEWORK_KIT_REPO=1 — UAT `contract_tests_primary`; 6 live-runtime classes `UAT_PROBE_FORBIDDEN`. **No live Chrome / no live npm publish.** `live_chrome_probed=false`.

Execute draft notes folded from `sprints/S0157/release-notes.md`.

## What's new

- BUG-0025: Include `scripts/standalone_runtime_install_lib.py` in npm pack allowlist; fail-closed standalone bootstrap loader; kit `0.1.4` packaging twins; six `test_bug0025_*` markers.

## ACs satisfied (QA + verify-work, UAT 9/9)

**8/8 PASS** (slice; backlog ACs remain unchecked until `/closure`):

| AC | Status |
|----|--------|
| AC-1 | PASS — npm pack includes standalone_runtime_install_lib.py |
| AC-2 | PASS — package.json files allowlist entry |
| AC-3 | PASS — missing-lib → STANDALONE_BOOTSTRAP_FAILED |
| AC-4 | PASS — wrapper no raw FileNotFoundError |
| AC-5 | PASS — pack + guard allowlist assert |
| AC-6 | PASS (slice) — kit 0.1.4 ready; **T-009 npm publish deferred-to-operator-confirm** |
| AC-7 | PASS — US-0147 compose-only |
| AC-8 | PASS — BUG-0022/0024 untouched |

## Test results (release — live this pass)

- **Scoped contract**: `python -m pytest tests/bug0025_packaging_contract_test.py -v` → **6 passed** fail 0 duration **2.07s**.
- **Metadata guard**: `python scripts/check-user-visible-metadata.py --repo .` → exit 0.
- **Canonical harness**: `tests/report.md` @ 2026-09-18T17:25:01Z Pass:843 Fail:28 OOS; `harness_fail_zero_claimed=false`.

## Gate summary

| Gate | Result |
|------|--------|
| check_in_tests | **PASS** (scoped pytest bug0025 6/6 + US-0071 metadata; harness Fail:28 OOS not claimed zero) |
| qa | PASS (`sprints/S0157/qa-findings.md`; 0 blockers) |
| verify_work | PASS (`sprints/S0157/uat.json` 8/8 ACs; 9/9 UAT; verify-work pytest 6/6) |
| uat | PASS (9/9; `contract_tests_primary`; live Chrome `UAT_PROBE_FORBIDDEN`) |
| isolation_evidence | PASS (execute+qa+verify-work+release; distinct fresh_context_marker; CROSS_MODEL_REVIEW=0) |
| strict_runtime_proof | **PASS** (verify-work `rp-auto-20260918-bug0025-verify-work-qa-20260918T173200Z-BUG-0025` / `5E2F0C655DEEE74EF60A3BB69553486D291466C1F9466D21A90E9BF91F95A75B` consumed @17:38:00Z before TTL 18:32:00Z; qa+execute MATCH) |
| readme_feature_coverage_3f | FAIL_nonblocking (gaps BUG-0021, BUG-0023, US-0135..US-0148) |
| project_readme_3g | skipped (`FRAMEWORK_KIT_REPO=1`) |
| publish | deferred (`RELEASE_PUBLISH_MODE=confirm`; `PUBLISH_CONFIRMATION_REQUIRED`; npm_published=false) |
| sync | not_eligible (`SYNC_POLICY_MODE=disabled`) |
| finalization | **PASS** (queue S0157 = `released`; release_version=0.1.4) |

## Run

```powershell
python -m pytest tests/bug0025_packaging_contract_test.py -v
# Expected: 6 passed

python scripts/check-user-visible-metadata.py --repo .
# Expected: exit 0

python scripts/guard_installer_publish.py
# Expected: exit 0

# After operator confirms publish (not run this release):
# npm publish
# npm install -g its-magic@0.1.4
# its-magic --target <repo> --mode upgrade --host both
```

- **start_command**: `python -m pytest tests/bug0025_packaging_contract_test.py -v`
- **runtime_mode**: `local`
- **runtime_context_ref**: `docs/engineering/runtime-connectivity.md`; `docs/engineering/architecture.md` `# BUG-0025`; `sprints/S0157/release-notes.md`

## Connect

- **service_url**: n/a (packaging/kit contract slice; no long-running HTTP service)
- **service_port**: n/a
- **health_endpoint**: n/a — verify via pytest contract markers + `guard_installer_publish` exit 0

## Verify

1. Run `python -m pytest tests/bug0025_packaging_contract_test.py -v` → 6/6 PASS.
2. Run metadata guard → exit 0.
3. Run `python scripts/guard_installer_publish.py` → exit 0.
4. Spot-check root `package.json` `files` lists `scripts/standalone_runtime_install_lib.py`; version `0.1.4`.
5. Confirm UAT honesty: `probe_kind=contract_tests_primary`; `live_chrome_probed=false`; no fake live-Chrome / live-npm-publish PASS.
6. After operator confirm: `npm view its-magic version` → `0.1.4` and tarball contains the lib path.

- **expected_health_signal**: pytest bug0025 6/6 markers passed; metadata + guard scripts silent exit 0.

## Credentials

- No inline secrets. Kit denies `.env` reads (US-0085).
- npm publish credentials: env-reference-only (`NPM_TOKEN` / operator shell profile / CI secret store) — **not** used this turn (`PUBLISH_CONFIRMATION_REQUIRED`).
- No API tokens required for contract verification.

## Known Issues

- T-009 / AC-6 npm publish of `its-magic@0.1.4` remains **deferred-to-operator-confirm** (`RELEASE_PUBLISH_MODE=confirm`; `npm_published=false`).
- README feature coverage gaps (3f) remain non-blocking for OPEN-bug release.
- Full `tests/run-tests.ps1` harness Fail:28 OOS pre-existing (`harness_fail_zero_claimed=false`).
- BUG-0025 backlog status remains **OPEN** until `/closure`.
- BUG-0022 / BUG-0024 remain OPEN (untouched).

## Evidence refs

- `sprints/S0157/release-findings.md`
- `sprints/S0157/qa-findings.md`
- `sprints/S0157/verify-work-verdict.json`
- `sprints/S0157/uat.json`
- `sprints/S0157/release-notes.md` (execute draft)
- `handoffs/release_queue.md` (S0157 row)
- `handoffs/verify-work-to-release.md` (top section BUG-0025)
