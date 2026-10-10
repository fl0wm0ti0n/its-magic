# UAT — Sprint S0166 / BUG-0032 (AUTONOMY_FLAGS_DRIFT drift-detect + live-wins sync)

- **uat_lifecycle**: populated (DEC-0009 — placeholder → populated at `/qa` for **ultra_lean**; `verified_ready=true` for `/verify-work` → `/release`)
- **sprint_id**: S0166
- **bug_id**: BUG-0032 (P0)
- **story_id**: (none — bug-target)
- **orchestrator_run_id**: auto-20261004-bug0032-qa
- **phase_id**: qa
- **role**: qa
- **delivery_mode**: ultra_lean (plan-verify merged at /qa; no planning-phase QA spawn)
- **macro_phase**: build+verify (first phase of the build+verify macro)
- **fresh_context_marker**: qa-BUG0032-qa-20261004T152000Z-fresh (grep-verified 0 prior occurrences repo-wide in this session)
- **timestamp**: 2026-10-04T15:20:00Z
- **story_status**: OPEN (US-0045 — acceptance/backlog AC-1..AC-7 unchecked until closure)
- **probe_kind**: contract_tests_primary
- **live_opencode_cli_tui_pass_claimed**: false
- **toast_repair_claimed**: false
- **fake_browser_pass_claimed**: false
- **harness_fail_zero_claimed**: false
- **drift_FIXED_claimed**: false (drift-DETECT only, NOT drift-FIX — operator live-wins sync is T-005 / closure evidence, AC-1)
- **Machine-readable**: `sprints/S0166/uat.json`
- **Status**: **PASS** (/qa; ultra_lean merged; contract slice)
- **verified_ready**: true
- **convergence_smoke**: pass (`contract_test_failed=0`)
- **blocking_findings**: 0
- **non_blocking_findings**: 2 (N-1 state.md execute-checkpoint hygiene gap — S0165 precedent; N-2 US-0119 2 pre-existing matrix-ref failures — not weakened/repaired)

## Target bug and acceptance criteria (from backlog `### BUG-0032` L5673-L5692)

- **AC-1**: `.its-magic/config.json` `AUTONOMY_PRESET`/`AUTONOMY_STOP_POLICY` values equal the `.cursor/scratchpad.md` values (live-wins per US-0131/DEC-0131) **OR** a documented operator decision flips the live values to match baseline — either outcome is recorded in the row's closure evidence. — **PASS (contract + remediation documented; operator decision = closure evidence)**
- **AC-2**: `check_intake_template_parity.py --scope=autonomy-flags` exists and exits 0 when the pair is identical; exits 1 (reason code `AUTONOMY_FLAGS_DRIFT`) on any divergence. — **PASS (identity → exit 0 + exact banner; 6 drift/fail-closed fixtures → exit 1 + fixed-order `[AUTONOMY_FLAGS_DRIFT]`)**
- **AC-3**: The drift-detect scope runs in the CI harness (`tests/run-tests.ps1` + `tests/run-tests.sh`) and is invoked by any PR that touches either file without the other (fail-closed). — **PASS (mirrored BUG-0032 block after US-0131 in both harnesses; always-run; fail-closed)**
- **AC-4**: US-0119 default (`AUTONOMY_PRESET=none` = byte-identical pre-US-0119) is unchanged; the 12 per-feature autonomy flags not re-touched; security-hard gates remain hard. — **PASS (marker 8; `none`=empty, `full`=12 flags, `security_hard n/a`, `AUTONOMY_FLAGS_DRIFT` not in stop-matrix)**
- **AC-5**: `INTAKE_AUTONOMY_MODE=0` and `INTAKE_SUBAGENT_FALLBACK=deny` remain in place (config.json L145-L146, L323-L324). — **PASS (marker 8; config values unchanged)**
- **AC-6**: `docs/engineering/runbook.md` carries a remediation entry titled `AUTONOMY_FLAGS_DRIFT` that explains how the operator syncs the two sources. — **PASS (runbook L4283 `## AUTONOMY_FLAGS_DRIFT`, AC-6 verbatim; active+template byte-identical)**
- **AC-7**: `bug_issue_validate.py --repo . --check-acceptance` exits 0 pre-write and post-write. — **PASS (this QA: PRE exit 0 + POST exit 0, both `[BUG_VALIDATION_OK]`)**
- **DC** (baseline integrity — R-0156 DQ1-DQ3 LOCKED + `# BUG-0032` H1 + no companion DEC + siblings HOLD): **PASS** (anchors read verbatim; DEC-0154 NOT allocated; BUG-0034 owns stop-matrix registration; US-0156 DONE / US-0154/0155 OPEN / BUG-0033/0034 OPEN UNTOUCHED)

Primary acceptance (`docs/product/acceptance.md` L223 BUG-0032 row) remains **unchecked** (`- [ ]`). Backlog AC-1..AC-7 remain **unchecked** (closure ownership per US-0045 / BUG-0031 repaired curator 3-allow).

## Executed verification steps and results (all independently re-run by this QA session)

| Step | AC | Description | Result |
|------|----|-------------|--------|
| UAT-1 | AC-1 | Operator live-wins sync (T-005) documented in the runbook; drift-DETECT is the shipped contract; operator decision = closure evidence | **pass** (runbook § `AUTONOMY_FLAGS_DRIFT`; config 20,237b + scratchpad 36,325b unchanged; drift not auto-FIX'd) |
| UAT-2 | AC-2 | `--scope=autonomy-flags` exit 0 identity / exit 1 drift + `AUTONOMY_FLAGS_DRIFT` | **pass** (identity exit 0 + banner; preset/policy/two-key exit 1 fixed-order; 3 malformed fail-closed exit 1) |
| UAT-3 | AC-3 | CI wiring both OS harnesses, always-run, fail-closed | **pass** (run-tests.ps1 L1686-L1693 + run-tests.sh L1554-L1564, after US-0131) |
| UAT-4 | AC-4 | `none` byte-identity + 12 flags + security-hard unchanged | **pass** (marker 8; `none`={}, `full`=12, `security_hard n/a`, token NOT in stop-matrix) |
| UAT-5 | AC-5 | `INTAKE_AUTONOMY_MODE=0` / `INTAKE_SUBAGENT_FALLBACK=deny` unchanged | **pass** (marker 8 + config values intact) |
| UAT-6 | AC-6 | runbook remediation entry titled `AUTONOMY_FLAGS_DRIFT` | **pass** (runbook L4283 AC-6 verbatim; twin byte-identical) |
| UAT-7 | AC-7 | `bug_issue_validate.py --check-acceptance` exit 0 pre + post | **pass** (PRE exit 0 + POST exit 0 this session) |
| UAT-DC | DC | R-0156 / `# BUG-0032` anchors; no DEC; siblings HOLD; no stop-matrix / config / scratchpad mutation | **pass** (anchors verbatim; DEC-0154 NOT allocated; guards #1-#10 held) |
| convergence_smoke | — | 8/8 active + 8/8 template markers green; 4/4 active↔template byte-parity MATCH; US-0131 10/10 | **pass** |

## Contract evidence (this QA session, independently re-run)

- **Active suite**: `python -m pytest tests/bug0032_autonomy_flags_drift_test.py -v` → **8 passed** in 0.87s, fail **0**. Markers: `scope_registration_parity` / `equal_fixture_exit0` / `preset_only_drift_exit1` / `policy_only_drift_exit1` / `two_key_deterministic_order` / `malformed_fail_closed` / `repo_fixture_isolation` / `us0119_security_invariants` — **8/8**.
- **Template suite**: `python -m pytest template/tests/bug0032_autonomy_flags_drift_test.py -v` → **8 passed** in 0.86s, fail **0** — **8/8**.
- **7 fixtures** (`--scope=autonomy-flags --repo <fixture>`): identity=0+banner; preset-drift=1 (PRESET); policy-drift=1 (POLICY); two-key-drift=1 (PRESET→POLICY fixed order); malformed-duplicate/missing/unparseable=1 (fail-closed, no banner).
- **Regressions**: `tests/us0131_contract_test.py` → **10/10**; `tests/us0119_autonomy_preset_test.py` → **8 passed, 2 pre-existing matrix-ref failures** (N-2; orphans BUDGET_EXHAUSTED/DECISION_UNRESOLVED/KERNEL_INCOMPATIBLE/QUALITY_EVIDENCE_FAILED/RESUME_AMBIGUOUS — **not weakened, not repaired**, guard #3). Combined run: **18 passed, 2 failed** (only the two pre-existing).
- **Parity (SHA-256 this session)**: checker `EC5B24C5…58B3D5`; reason_codes.md `4C6F03D5…52BFB`; runbook.md `5D6D6780…F7552`; bug0032 test `BD7117E5…09B29C` — **4/4 active↔template MATCH**.
- **Mandated bridge**: `python scripts/bug_issue_validate.py --repo . --check-acceptance` → **`[BUG_VALIDATION_OK]` exit 0** (PRE + POST).
- **Guards (unchanged)**: `scripts/data/autonomy_stop_matrix.yaml`=8,374b; `.its-magic/config.json`=20,237b; `.cursor/scratchpad.md`=36,325b; stop-matrix `AUTONOMY_FLAGS_DRIFT` NOT registered (BUG-0034 owns).

## Waived live-runtime probe classes

All six classes: **`UAT_PROBE_FORBIDDEN`** (`browser_smoke`, `api_health`, `process_health`, `cli_smoke`, `build`, `manual_operator`). **No live OpenCode PASS. No toast-repair claim. No fake browser PASS. No `drift_FIXED` claim (operator live-wins sync is the operator's action, recorded at closure).**

## Results summary (acceptance linkage)

| AC | UAT step(s) | Result |
|----|-------------|--------|
| AC-1 | UAT-1 | **PASS** (contract + documented remediation; operator decision = closure evidence) |
| AC-2 | UAT-2 | **PASS** (exit 0 banner / exit 1 fixed-order `AUTONOMY_FLAGS_DRIFT`) |
| AC-3 | UAT-3 | **PASS** (both OS harnesses, always-run, fail-closed) |
| AC-4 | UAT-4 | **PASS** (`none` identity + 12 flags + security_hard held) |
| AC-5 | UAT-5 | **PASS** (intake autonomy gates unchanged) |
| AC-6 | UAT-6 | **PASS** (runbook entry titled `AUTONOMY_FLAGS_DRIFT`) |
| AC-7 | UAT-7 | **PASS** (validator exit 0 pre + post) |
| DC | UAT-DC | **PASS** (baseline integrity; siblings HOLD; stop-matrix untouched) |

**Coverage**: 7/7 AC mapped + DC (8 total entries); 9/9 UAT steps pass (7 AC + DC + convergence); `passed + failed == total` per DEC-0009. `live_host_probe_forbidden` holds everywhere.

## Residual (non-blocking)

- **N-1 EXECUTE_CHECKPOINT_MISSING (NON-BLOCKING, hygiene)**: `## Execute checkpoint — BUG-0032 / S0166` absent from `docs/engineering/state.md`. Durable execute evidence intact in `sprints/S0166/{progress,summary,tasks}.md` + `handoffs/dev_to_qa.md`. S0165/BUG-0035 shipped DONE with the **same** absent-checkpoint shape → precedent-confirmed non-blocking. Backfill deferred to orchestrator / refresh-context (curator).
- **N-2 US-0119 2 pre-existing matrix-ref failures (NON-BLOCKING, carried)**: on the stop-matrix surface (out of BUG-0032 scope per R-0156 DQ2); not weakened/repaired; carried forward.

## Next

- **`/verify-work`** (fresh **qa** subagent, fresh marker, fresh proof 6-tuple) to re-certify QA_PASS on a second independent run and set the UAT lifecycle to `verified_ready=true` (already true), then **`/release`** (fresh **release**) → **`/closure`** (fresh **curator**; `qe` unspawnable → DEC-0052 sanctioned alternate) to perform the canonical BUG-0032 DONE flip (backlog `### BUG-0032` → DONE, acceptance L223 → `[x]`, `sprints/S0166/closure-verification.md` + state.md checkpoint + AC-1 operator live-wins decision recorded) per the post-BUG-0031 curator 3-allow flip-path (DENY-FIRST, DEC-0152).
- **Do NOT** mark BUG-0032 DONE. **Do NOT** tick AC-1..AC-7. **Do NOT** auto-FIX the drift (operator action). **Do NOT** register `AUTONOMY_FLAGS_DRIFT` in the stop-matrix (BUG-0034 owns). **Do NOT** mutate backlog/acceptance. **Do NOT** spawn `/release` / `/closure` / `/verify-work` from this qa subagent.
