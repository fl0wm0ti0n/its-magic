# Sprint S0157 — Task checklist (BUG-0025)

Total tasks: 11 (T-anch + T-001..T-010). SPRINT_MAX_TASKS=12; SPRINT_AUTO_SPLIT=1; no split (11 ≤ 12). T-anch retained as NO-OP verification. Seeds 1:1 from `docs/engineering/architecture.md` `# BUG-0025`. Sprint id **S0157** locked (S0156 = US-0148 — do not reuse).

**Isolation**: `tl-BUG0025-sprintplan-20260918T170500Z-fresh` · `model_id=inherit` · `orchestrator_run_id=auto-20260918-bug0025`

## Task execution order

1. T-anch (NO-OP / verification)
2. T-001 (`package.json` `files` entry)
3. T-002 (loader isfile-before-exec)
4. T-003 (bootstrap / postinstall wrapper fail-closed)
5. T-004 (supported-range residual fail-closed)
6. T-005 (`tests/bug0025_packaging_contract_test.py`)
7. T-006 (optional `guard_installer_publish` allowlist assert)
8. T-007 (patch version bump + packaging twins)
9. T-008 (release notes / runbook pointer)
10. T-009 (republish via release path)
11. T-010 (compose regression: us0147 / bug0001/0003 / US-0084 / US-0133)

## Task checklist

- [x] **T-anch**: Verify `# BUG-0025` H1 in `docs/engineering/architecture.md`; R-0149 DQ1–DQ10 LOCKED; companion DEC **none**; A1 pins (`files` string, isfile-before-exec, test file, optional guard, patch republish); compose guards (US-0147 DONE compose-only; BUG-0022/0024 OPEN not drained; US-0133 omit-`standalone/` held). Record to `sprints/S0157/t-anch-verification.md`. NO mutation to `architecture.md` / R-0149 in /execute. (DC / architecture baseline; NO-OP)

- [x] **T-001**: Add exactly `"scripts/standalone_runtime_install_lib.py"` to root `package.json` `files`. Do not add `scripts/`, do not add `standalone/`, do not remove existing intake/materialize/remote_config/guard/doc_profile peers. (AC-1, AC-2)

- [x] **T-002**: In `installer.py` `_load_standalone_runtime_install_lib`: if `not os.path.isfile(lib_path)` → raise/print `[STANDALONE_BOOTSTRAP_FAILED]` before `spec_from_file_location` / `exec_module` (mirror `_load_doc_profile_lib`). No raw `FileNotFoundError` as operator-visible outcome. (AC-3, AC-4)

- [x] **T-003**: Ensure `bootstrap_standalone_runtime_installer_hook` / `run_standalone_postinstall` catch missing-lib path and exit **1** with **`STANDALONE_BOOTSTRAP_FAILED`** printed. Keep US-0147 reason-code family and call sites. (AC-3, AC-4)

- [x] **T-004**: When package-root `standalone/.../supported-kernel-range.json` is absent, fail-closed into `STANDALONE_BOOTSTRAP_FAILED` / existing `KERNEL_*`. Do **not** add `standalone/` to `files`. (AC-4)

- [x] **T-005**: Author `tests/bug0025_packaging_contract_test.py` with markers: `test_bug0025_package_json_files_lists_standalone_runtime_install_lib`, `test_bug0025_npm_pack_includes_standalone_runtime_install_lib`, `test_bug0025_load_missing_lib_emits_standalone_bootstrap_failed`, `test_bug0025_bootstrap_wrapper_no_raw_filenotfound_traceback`, `test_bug0025_us0147_compose_hook_call_sites_unchanged`, and optionally `test_bug0025_guard_installer_publish_requires_allowlist_entry` if T-006 extends guard. (AC-1, AC-3, AC-4, AC-5, AC-7)

- [x] **T-006**: Optional: extend `scripts/guard_installer_publish.py` to assert allowlist entry (and/or packed path). Keep US-0133 omit-`standalone/` authoritative. If skipped, note in T-005 marker 5 skip. (AC-5)

- [x] **T-007**: Patch-bump kit version (e.g. `0.1.3` → `0.1.4`) and sync packaging twins as existing release path requires (`package.json`, chocolatey/homebrew/.its-magic-version as applicable). Prefer bump over same-line `0.1.3` republish. (AC-6)

- [x] **T-008**: Release notes / runbook troubleshooting pointer: upgrade command for operators still on `0.1.3`; optional semver quirk `0.1.3-11`→`0.1.3` note only. (AC-6)

- [x] **T-009**: Republish via existing release-all / `RELEASE_PUBLISH_MODE` so `npm install -g its-magic@0.1.4` (or `@latest`) includes the lib. Honor confirm mode (no silent publish if confirm required). (AC-6)

- [x] **T-010**: Confirm `test_us0147_*` + BUG-0001/0003 / US-0084 / US-0133 guards still green (additive-only regression). (AC-7)

## Locked contract marker table

| # | Marker | AC |
|---|---|---|
| 1 | `test_bug0025_package_json_files_lists_standalone_runtime_install_lib` | AC-2 |
| 2 | `test_bug0025_npm_pack_includes_standalone_runtime_install_lib` | AC-1, AC-5 |
| 3 | `test_bug0025_load_missing_lib_emits_standalone_bootstrap_failed` | AC-3 |
| 4 | `test_bug0025_bootstrap_wrapper_no_raw_filenotfound_traceback` | AC-3, AC-4 |
| 5 | `test_bug0025_guard_installer_publish_requires_allowlist_entry` | AC-5 (optional) |
| 6 | `test_bug0025_us0147_compose_hook_call_sites_unchanged` | AC-7 |

## Integration verification (post T-010)

- [x] Test gate: bug0025 markers green; `test_us0147_*` / bug0001/0003 / US-0084 / US-0133 still green
- [x] Scope gate: no `standalone/` in `files`; no US-0147 feature reopen; BUG-0022/0024 untouched
- [x] Status gate: BUG-0025 remains OPEN; AC-1..AC-8 unchecked until closure

## AC → Task surjective coverage

| AC | Task(s) |
|---|---|
| AC-1 | T-001, T-005 |
| AC-2 | T-001 |
| AC-3 | T-002, T-003 |
| AC-4 | T-002, T-003, T-004 |
| AC-5 | T-005, T-006 |
| AC-6 | T-007, T-008, T-009 |
| AC-7 | T-010, T-anch |
| AC-8 | T-anch |
| DC / architecture | T-anch |

**Surjectivity check**: 8/8 ACs covered. No `PLAN_AC_COVERAGE_GAP`.
