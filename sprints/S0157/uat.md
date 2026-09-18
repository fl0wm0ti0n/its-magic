# UAT — Sprint S0157 / BUG-0025 (verify-work populated; verified_ready)

- **uat_lifecycle**: populated (DEC-0009 — `verified_ready=true`; populated→verified transition at `/release`)
- **sprint_id**: S0157
- **bug_id**: BUG-0025
- **story_id**: (none)
- **orchestrator_run_id**: auto-20260918-bug0025
- **phase_id**: verify-work
- **role**: qa
- **fresh_context_marker**: qa-BUG0025-verify-20260918T173200Z-fresh
- **timestamp**: 2026-09-18T17:32:00Z
- **story_status**: OPEN (US-0045 — acceptance/backlog ACs unchecked until closure)
- **probe_kind**: contract_tests_primary
- **live_chrome_probed**: false
- **fake_browser_pass_claimed**: false
- **live_npm_publish_probed**: false
- **Machine-readable**: `sprints/S0157/uat.json`
- **Status**: **PASS** (verify-work; T-009 publish deferred to `/release`)
- **verified_ready**: true

## Target acceptance criteria (from backlog `### BUG-0025`)

- **AC-1**: Packaged `its-magic` npm tarball includes `scripts/standalone_runtime_install_lib.py`
- **AC-2**: Root `package.json` `files` allowlist lists that path
- **AC-3**: `_load_standalone_runtime_install_lib` fails closed with `STANDALONE_BOOTSTRAP_FAILED`
- **AC-4**: standalone bootstrap completes when lib present, or `STANDALONE_BOOTSTRAP_FAILED` when absent
- **AC-5**: Contract test proves `npm pack` contains lib; optional `guard_installer_publish`
- **AC-6**: Republish ships the packaging fix (kit **0.1.4** ready; **npm publish deferred** to `/release` confirm)
- **AC-7**: Do not reopen US-0147 ACs beyond shipping missing packaged file(s) + fail-closed loader + pack contract
- **AC-8**: Distinct from BUG-0022 / BUG-0024

## Executed verification steps and results

| Step | AC | Description | Result |
|------|-----|-------------|--------|
| UAT-1 | AC-1 | npm pack includes standalone_runtime_install_lib.py | **pass** |
| UAT-2 | AC-2 | package.json files allowlist entry | **pass** |
| UAT-3 | AC-3 | missing-lib → STANDALONE_BOOTSTRAP_FAILED | **pass** |
| UAT-4 | AC-4 | wrapper no raw FileNotFoundError | **pass** |
| UAT-5 | AC-5 | pack + guard allowlist assert | **pass** |
| UAT-6 | AC-6 | 0.1.4 ready; T-009 publish deferred | **pass** (deferred publish) |
| UAT-7 | AC-7 | US-0147 compose-only | **pass** |
| UAT-8 | AC-8 | BUG-0022/0024 untouched | **pass** |
| convergence_smoke | — | Waived-probe slice surrogate (US-0128) | **pass** |

## Waived live-runtime probe classes

All six classes: **`UAT_PROBE_FORBIDDEN`** (`browser_smoke`, `api_health`, `process_health`, `cli_smoke`, `build`, `manual_operator`).

## Contract evidence (verify-work live)

- Command: `python -m pytest tests/bug0025_packaging_contract_test.py -v`
- Result: **6 passed** in **2.12s**, fail **0**
- Prior QA compose attestation retained (us0147/us0133/bug0003/bug0017); not re-blocking this pass
- Full `TEST_COMMAND`: Fail:28 OOS pre-existing noted at QA (non-blocking for this slice)

## Results summary (acceptance linkage)

| AC | UAT step(s) | Result |
|----|-------------|--------|
| AC-1 | UAT-1 | pass |
| AC-2 | UAT-2 | pass |
| AC-3 | UAT-3 | pass |
| AC-4 | UAT-4 | pass |
| AC-5 | UAT-5 | pass |
| AC-6 | UAT-6 | pass (publish deferred) |
| AC-7 | UAT-7 | pass |
| AC-8 | UAT-8 | pass |

Story acceptance row in `docs/product/acceptance.md` remains **unchecked** (`- [ ] BUG-0025`) until closure.

## Verdict summary

| Bucket | Count |
|--------|-------|
| PASS | 9 |
| FAIL | 0 |
| SKIP | 0 |
| PENDING | 0 |
| Total | 9 |

## Deferred

- **T-009**: npm republish of `its-magic@0.1.4` awaits `/release` operator confirm (`RELEASE_PUBLISH_MODE=confirm`).

## Next

- **`/release`** (fresh **release**) for **S0157** / **BUG-0025**
