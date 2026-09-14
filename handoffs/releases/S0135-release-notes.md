# Release Notes — S0135 / BUG-0017

- **Sprint**: `S0135`
- **Bug / Story**: `BUG-0017` — OpenCode on Linux ignores its-magic slash commands (CRLF breaks YAML frontmatter)
- **Release date**: `2026-09-11T20:18:30Z` (UTC)
- **orchestrator_run_id**: `auto-20260911-bug0017`
- **delivery_mode**: `ultra_lean`
- **macro_phase**: `ship` (release is phase 1 of 3: release → closure → refresh-context per DEC-0082)
- **policy_mode**: `confirm` (`RELEASE_PUBLISH_MODE=confirm`; `RELEASE_PUBLISH_AUTO_CONFIRM=0` → no publish execution)
- **trigger_source**: `auto`
- **branch**: `local` (no push; `SYNC_POLICY_MODE=disabled` per DEC-0018)
- **fresh_context_marker**: `rel-BUG0017-release-20260911T195400Z-fresh`
- **model_id**: `composer-2.5` (CROSS_MODEL_REVIEW=1 — required)
- **runtime_proof_id**: `rp-auto-20260911-bug0017-release-release-20260911T201830Z-BUG-0017`
- **proof_hash**: `EFFA303CA150F1727598673F4B15ECC55C617A9E94EADD3D194DF5361D024CC9`
- **proof_ttl**: `2026-09-11T21:18:30Z` (UTC)
- **release_version**: (none — workflow-only release; no semver bump)

## Verdict

**RELEASE_PASS.** All mandatory release gates (1, 2, 3, 4, 4b) green with **canonical harness Fail:0** (`tests/report.md` @ `2026-09-11T20:18:29Z` Pass:857 / Fail:0, including BUG-0017 harness row 26AG). Queue row S0135 → `released`. No backlog mutation (closure owns OPEN→DONE + acceptance tick per US-0120 / DEC-0082). No publish.

Gate-1 remediation (pre-finalization): wired 26AG BUG-0017 EOL contract into `tests/run-tests.ps1` / `tests/run-tests.sh`; restored kit-active CI packaging jobs (`npm-test`/`brew-test`/`choco-test`) lost in JSONC commit; synced Homebrew formula url+version to npm `0.1.3-8`; synced template model-catalog cursor-only example to active for US-0102 parity.

## Summary

BUG-0017 ships OpenCode pack LF / Linux slash-command recognition (approach A* / R-0118):

- Scoped `.gitattributes` LF for `.opencode/**` + `template/.opencode/**` `*.{md,ts,json}` — never repo-wide `*.md` (AC-3).
- One-time LF normalize of in-scope OpenCode pack text (AC-1, AC-2).
- Extended `scripts/guard_installer_publish.py` OpenCode `\r` inventory + `npm run guard:installer` / `prepublishOnly` fail-closed (AC-4); BUG-0008/US-0084 compose held (AC-7).
- Active↔template OpenCode tracked-text + guard/test/runbook parity (AC-5).
- Six additive `test_bug0017_*` markers (AC contract surface).
- Consumer DQ6 upgrade recipe: `its-magic --mode upgrade --host opencode|both` (AC-6).
- Before-tag gate: run `npm run guard:installer` before GitHub tags consumed by chocolatey (NB1).

FRAMEWORK_KIT_REPO=1 — UAT probe class `contract_tests_primary`; 6 live-runtime classes waived `UAT_PROBE_FORBIDDEN`. No fake browser PASS.

## ACs satisfied (QA + verify-work, UAT 8/8)

**7/7 PASS** (live pytest 6/6 green):

| AC | Description | Status |
|----|-------------|--------|
| AC-1 | Linux OpenCode recognizes `/auto` / `/intake` peers | PASS (markers 1–4 + LF spot-check) |
| AC-2 | Shipped OpenCode pack has no CRLF | PASS (markers 2–4 + guard) |
| AC-3 | Scoped `.gitattributes` only (no repo-wide `*.md`) | PASS (marker 1) |
| AC-4 | Publish/CI fail-closed on CR + before-tag `guard:installer` | PASS (markers 4–5 + runbook/choco) |
| AC-5 | Active↔template OpenCode tracked-text parity | PASS (marker 6) |
| AC-6 | Consumer upgrade recipe (DQ6) | PASS (runbook) |
| AC-7 | Compose BUG-0008 / US-0084 unchanged | PASS (marker 5) |

## Test results (release)

- **BUG-0017 live pytest**: `python -m pytest tests/bug0017_opencode_eol_test.py -v` → **6 passed**.
- **Guard**: `npm run guard:installer` → **PASS**.
- **Metadata guard**: `python scripts/check-user-visible-metadata.py --repo . --json` → `OK` / `violations: []`.
- **README feature coverage**: `python scripts/validate_readme_feature_coverage.py --repo . --enforce` → `[README_FEATURE_COVERAGE_VALIDATE_OK]`; `coverage_missing=[]` (BUG-0017 OPEN excluded).
- **Canonical harness** (`tests/report.md`): timestamp `2026-09-11T20:18:29Z`, **`Pass: 857 / Fail: 0`** — includes `[PASS] BUG-0017 OpenCode EOL contract tests pass`.

## Gate summary

| Gate | Result |
|------|--------|
| check_in_tests | **PASS** (`tests/report.md` Fail:0 + bug0017 6/6 + guard:installer + US-0071 metadata; `harness_fail_zero_claimed=true`) |
| qa | PASS (`sprints/S0135/qa-findings.md`; 0 blockers; NB1..NB3 informational) |
| verify_work | PASS (`sprints/S0135/uat.json` verdict=PASS; 7/7 ACs; 8/8 UAT incl `convergence_smoke`; 6/6 contract live) |
| uat | PASS (8/8; populated; `contract_tests_primary`; 6 live-runtime classes `UAT_PROBE_FORBIDDEN`) |
| isolation_evidence | PASS (execute+qa+verify-work+sovereign-critic+release; distinct markers; `model_id` set) |
| strict_runtime_proof | **PASS** (verify-work `rp-auto-20260911-bug0017-verify-work-qa-20260911T195200Z-BUG-0017` TTL `2026-09-11T20:52:00Z` consumed @ `20:18:30Z`; proof_hash recomputed MATCH `EFC002B0895C4FC2AB4285FBAFED9E55BADC57F5B8EC43BBF676D5184E514C02`) |
| readme_feature_coverage_3f | PASS (`coverage_missing=[]`; BUG-0017 OPEN excluded) |
| project_readme_3g | skipped (`FRAMEWORK_KIT_REPO=1`) |
| metadata_guard | PASS |
| triad_regression | PASS (`enforce-triad-hot-surface.py --check` exit 0) |
| backlog_reconciliation | not performed (closure owns per US-0120 / DEC-0082) |
| publish | skipped (`RELEASE_PUBLISH_MODE=confirm`; `RELEASE_PUBLISH_AUTO_CONFIRM=0`) |
| sync | not_eligible (`SYNC_POLICY_MODE=disabled`) |
| finalization | **PASS** (queue row S0135 = `released`) |

## Run

```powershell
# BUG-0017-specific live EOL contract test (6/6):
python -m pytest tests/bug0017_opencode_eol_test.py -v
#   Expected: 6 passed

npm run guard:installer
#   Expected: PASS (OpenCode CR inventory enforced)

python scripts/check-user-visible-metadata.py --repo .
#   Expected: exit 0 (silent PASS)

python scripts/validate_readme_feature_coverage.py --repo . --enforce
#   Expected: [README_FEATURE_COVERAGE_VALIDATE_OK]

# Canonical harness (Fail:0 required for gate-1):
powershell -ExecutionPolicy Bypass -File "tests/run-tests.ps1"
#   Expected: tests/report.md Fail: 0
```

Start command for the shipped pack (kit/OpenCode EOL story — not a long-running HTTP service):

```bash
# Validate OpenCode pack LF / guard inventory:
python -m pytest tests/bug0017_opencode_eol_test.py -v
```

- **start_command**: `python -m pytest tests/bug0017_opencode_eol_test.py -v` (operator validation; live Linux OpenCode probe not required for this CI slice)
- **runtime_mode**: `local`
- **runtime_context_ref**: `docs/engineering/runbook.md` `### OpenCode pack LF / Linux slash commands (BUG-0017 / R-0118)`; `docs/engineering/runtime-connectivity.md` (local kit — no remote service)

## Connect

- **service_url**: `n/a` (OpenCode pack EOL / gitattributes / publish-guard kit — no service endpoint)
- **service_port**: `n/a`
- **health_endpoint**: `n/a` (health = contract tests + `guard:installer` + Fail:0 harness, not HTTP)

## Verify

1. `python -m pytest tests/bug0017_opencode_eol_test.py -v` → 6 passed
2. `npm run guard:installer` → PASS
3. `python scripts/check-user-visible-metadata.py --repo .` → exit 0
4. `python scripts/validate_readme_feature_coverage.py --repo . --enforce` → `[README_FEATURE_COVERAGE_VALIDATE_OK]`
5. `tests/report.md` header shows **Fail: 0** (incl. BUG-0017 26AG row)
6. Spot-check: `.opencode/commands/auto.md` has no CR; `.gitattributes` has six scoped OpenCode LF rows (no repo-wide `*.md`)
7. Consumers with pre-existing CRLF trees: `its-magic --mode upgrade --host opencode|both` (DQ6)

**expected_health_signal**: all 6 `test_bug0017_*` markers PASS; guard:installer PASS; metadata guard exit 0; README enforce OK; harness Fail:0; backlog BUG-0017 remains OPEN until `/closure`.

## Credentials

- **credential_source_refs**: `n/a` (no API keys required for contract-test verify)
- **expected_value_source**: operator OpenCode host + local kit checkout; no inline secrets

## Known Issues

None blocking.

- **NB-1** (informational): Before any GitHub tag whose zip is consumed by chocolatey, run `npm run guard:installer` and require PASS (no choco EOL post-process).
- **NB-2** (informational): Kit fix alone does not heal already-installed CRLF trees — DQ6 upgrade `--host opencode|both` required.
- **NB-3** (informational): Do not mark BUG-0017 DONE at release; do not tick acceptance; do not reopen BUG-0015/BUG-0016; no live OpenCode CI probe; no companion DEC.

## Evidence refs

- `tests/report.md` (@ 2026-09-11T20:18:29Z — Fail:0)
- `sprints/S0135/qa-findings.md` (QA_PASS)
- `sprints/S0135/uat.json`, `sprints/S0135/uat.md` (verify-work PASS)
- `sprints/S0135/summary.md`
- `sprints/S0135/release-findings.md`
- `docs/engineering/state.md` (execute / qa / verify-work / sovereign-critic / release checkpoints)

## Next phase

`/closure` (fresh **qe** subagent, ship macro phase 2 of 3 per DEC-0082). Release does **not** spawn closure. Backlog BUG-0017 remains **OPEN**; acceptance BUG-0017 remains **unchecked** until closure.
