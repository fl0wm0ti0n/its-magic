# UAT — Sprint S0178 / BUG-0029

## Remediation verification — implementation_loop_index 1 — **VERIFY_PASS**

- **verdict**: **VERIFY_PASS**
- **phase_id**: verify-work
- **role**: qa
- **implementation_loop_index**: 1
- **uat_lifecycle**: populated
- **timestamp**: 2026-10-16T14:37:00Z
- **fresh_context_marker**: `qa-BUG0029-vw-fix1-20261016T143700Z-fresh`
- **bug status**: BUG-0029 stays **OPEN**. AC-1..AC-5 stay unchecked in `docs/product/backlog.md`. The acceptance row stays unchecked. Closure owns the DONE flip.

UAT-1..UAT-5 still map to AC-1..AC-5. `convergence_smoke` stays **pass** because `contract_test_failed=0`. Counts stay **6 pass / 0 fail**. Live probe classes `browser_smoke`, `api_health`, `process_health`, `cli_smoke`, `build`, and `manual_operator` stay **`UAT_PROBE_FORBIDDEN`**. No live global-install probe. No `.env` read.

Independent re-run this pass:

- `python scripts/validate_readme_feature_coverage.py --repo . --enforce` exit **0**. `coverage_missing=[]`. `coverage_total=52`. `BUG-0028` is present. No `README_FEATURE_COVERAGE_GAP:BUG-0028`.
- `tests/report.md` `2026-10-16T14:15:41Z` is **Pass 880 / Fail 0** (880 `[PASS]`, 0 `[FAIL]`). Rows L785, L815, L816, L843, L846, L850, L853, and L855 are `[PASS]`. This pass did not rewrite the report. The underlying commands were re-run: `python tests/auto_command_contract_test.py` exit 0 (151 OK, including `test_template_scratchpad_baseline_literal_parity_active`); README `--report` twice exit 0 with identical SHA-256; intake parity scopes `dev-environment`, `model-tier`, `model-tier-overrides`, and `arch-linkage` exit 0.
- `test_bug0029_*` from `standalone`: Windows Node v24.19.0 **7 pass / 0 fail** (duration_ms 154.4677); Linux Node v24.19.0 **7 pass / 0 fail** (duration_ms 268.94279).

## Prior verify-work — 2026-10-16T00:05:15Z — **VERIFY_PASS**

- **verdict**: **VERIFY_PASS**
- **phase_id**: verify-work
- **role**: qa
- **uat_lifecycle**: populated
- **timestamp**: 2026-10-16T00:05:15Z
- **fresh_context_marker**: `qa-BUG0029-vw-20261016T000515Z-fresh`
- **bug status**: BUG-0029 stays **OPEN**. AC-1..AC-5 stay unchecked in `docs/product/backlog.md`. The acceptance row stays unchecked. Closure owns the DONE flip.

## Target

BUG-0029 (OPEN). Primary acceptance row in `docs/product/acceptance.md` stays unchecked.

## Steps

| Step | AC | Description | Result |
|---|---|---|---|
| UAT-1 | AC-1 | API-key login obtains a secret from an interactive TTY without echoing it, logging it, or placing it in command-line arguments. | pass |
| UAT-2 | AC-2 | A documented non-interactive `--api-key-stdin` path accepts one secret from standard input and rejects non-TTY interactive login without pretending success. | pass |
| UAT-3 | AC-3 | Cancelled, empty, invalid, or persistence-failed login exits non-zero with a deterministic redacted diagnostic and never emits `{"auth":"configured"}`. | pass |
| UAT-4 | AC-4 | Login verifies stored credentials through the runtime before emitting configured success; `auth list`, logout, and Pi migration retain their existing behavior. | pass |
| UAT-5 | AC-5 | Cross-platform tests cover masked TTY input, stdin input, cancellation, redaction, false-success prevention, and no secret outside the owned auth store. | pass |
| convergence_smoke | — | Convergence smoke surrogate — waived-probe slice with green contract-test harness. | pass |

## Results summary

Remediation verification (implementation_loop_index 1): Windows Node v24.19.0 **7 pass / 0 fail** (duration_ms 154.4677); Linux Node v24.19.0 **7 pass / 0 fail** (duration_ms 268.94279). UAT counts: **6 pass / 0 fail** (five acceptance steps plus `convergence_smoke`). `contract_test_failed=0`. Live probe classes stay `UAT_PROBE_FORBIDDEN`. README `--enforce` exit 0. Cited harness `tests/report.md` `2026-10-16T14:15:41Z` is Pass 880 / Fail 0 after the eight previously failing commands were re-run.

Prior pass on 2026-10-16T00:05:15Z: Windows Node v24.19.0 **7 pass / 0 fail** (duration_ms 152.6454); Linux Node v24.19.0 **7 pass / 0 fail** (duration_ms 235.092463). That pass did not claim a fresh full-harness Fail=0.

Acceptance mapping: UAT-1 → AC-1, UAT-2 → AC-2, UAT-3 → AC-3, UAT-4 → AC-4, UAT-5 → AC-5. Backlog boxes stay `[ ]`. Evidence: `sprints/S0178/uat.json`, `sprints/S0178/verify-work-findings.md`.
