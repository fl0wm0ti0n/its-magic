# QA Findings — S0169 / US-0149

- **verdict**: **QA_PASS**
- **phase_id**: qa
- **role**: qa
- **story_id**: US-0149
- **sprint_id**: S0169
- **timestamp**: 2026-10-11T13:45:45Z
- **fresh_context_marker**: `qa-US0149-qa-20261011T134545Z-fresh`
- **CROSS_MODEL_REVIEW**: 0 (model_id omitted)
- **blocking findings**: none
- **status guard**: US-0149 remains **OPEN**. Backlog AC-1..AC-6 stay `[ ]`. `docs/product/acceptance.md` US-0149 stays unchecked. Closure owns the DONE flip. This child did not write `handoffs/resume_brief.md` and did not edit `.cursor/scratchpad.md`.

Consumed as provenance only: execute marker `dev-US0149-execute-20261011T132649Z-fresh`; execute-pair `record_key=auto-20261011-us0149-execute-pair|story|(none)|execute|rp-auto-20261011-us0149-execute-pair-curator-20261011T133218Z`; `proof_hash=f9f199aa4c197edbed4d0b40e59d841cd41046e3136133c6497e7a7e496ec33a`. This context re-ran the contract tests and the harness.

## Test plan

1. Read US-0149 AC-1..AC-6, S0169 tasks/summary, and R-0160 DQ1–DQ8.
2. Run `python -m pytest tests/us0149_path_registration_test.py -q` (eight markers, fake home and fake PATH store).
3. Re-run `powershell -NoProfile -ExecutionPolicy Bypass -File tests/run-tests.ps1` and record Pass/Fail plus the report timestamp.
4. Confirm opt-in default, missing-shim fail-closed, unregister scope, and runbook parity in code and tests.
5. Confirm `write_itsm_shim` and BUG-0026 / BUG-0025 / US-0146 / US-0147 / BUG-0033 were not reopened.
6. Do not probe the live user PATH or HKCU (`UAT_PROBE_FORBIDDEN`).
7. `python scripts/check-user-visible-metadata.py` (exit 0).

## AC checklist

| AC | Expectation | Evidence | Result |
|---|---|---|---|
| AC-1 | Missing `.its-magic/bin/itsm` (and `itsm.cmd` on Windows) returns `ITSM_PATH_SHIM_MISSING` and writes nothing. BUG-0026 stays the materialize owner. | `test_us0149_register_refuses_when_shim_missing`. `_shim_ready` returns before any ledger or PATH write. `write_itsm_shim` body last changed in `1d35b44` (2026-09-18); it is not in the PATH diff. BUG-0026 remains OPEN. | PASS |
| AC-2 | Opt-in only. No flag and no env leaves PATH untouched. User-chosen directory, documented defaults, TTY-only `prompt`. | `test_us0149_register_opt_in_default_off`, `test_us0149_register_user_chosen_dir`. `dispatch_itsm_path_registration` returns `(0, None)` when opt-in is false. Defaults `%LOCALAPPDATA%\its-magic\bin` and `$HOME/.local/bin`. Non-TTY `prompt` returns `ITSM_PATH_REGISTER_FAILED` and does not call the prompt. `installer.ps1` / `installer.sh` forward flags only; neither contains `setx`. | PASS |
| AC-3 | Windows and POSIX place `itsm` and append the chosen directory only when it was absent. macOS uses the POSIX path. | `test_us0149_register_windows_user_path` (fake store, type preserved, second call does not rewrite). `test_us0149_register_posix_profile_snippet` (symlink failure copies mode `0755`, marked snippet, idempotent). Production Windows store is `HKCU\Environment` read-modify-write. Tests inject the fake store. | PASS |
| AC-4 | Unregister deletes only recorded links and removes the PATH directory only when `path_entry_added` is true. Failed writes roll back. | `test_us0149_unregister_removes_only_owned_entry` (unrelated `keep.cmd` and pre-existing PATH entry remain; `uninstall-standalone` on another repo does not reverse the ledger). `test_us0149_register_fail_closed_on_write_error` (`ITSM_PATH_REGISTER_FAILED`, no links, no ledger, store unchanged). | PASS |
| AC-5 | Active and template runbooks share the PATH subsection and name the tokens. README npm `--prefix` block stays. | `test_us0149_runbook_path_section_parity`. Heading `### Global itsm PATH registration (US-0149)` in both runbooks. README and template README still contain `npm install -g --prefix` plus the opt-in pointer. `--scope=model-tier` and `--scope=arch-linkage` fail later on scratchpad, after the runbook pair, so the runbooks match. | PASS |
| AC-6 | Eight `test_us0149_*` markers cover the residual, opt-in path, Win/POSIX, removal, and docs. Launcher tests stay unchanged. | `8 passed in 0.37s`. Harness row `US-0149 path registration contract tests pass` is PASS. `tests/us0149_global_itsm_launcher_test.py` is not in the dirty set. Wired in `tests/run-tests.ps1` and `tests/run-tests.sh`. | PASS |

## Harness

- Command: `powershell -NoProfile -ExecutionPolicy Bypass -File tests/run-tests.ps1`
- `tests/report.md` timestamp **2026-10-11T13:42:10Z**
- **Pass 875 / Fail 5** (exit 1)
- US-0149 path registration row: **PASS**
- `slim auto command contract markers pass`: **PASS** (the earlier sixth fail, `AUTO_BACKLOG_MAX_STORIES=7` vs template `3`, is gone; baseline value is `3`)
- Triad rows `triad check passes on repo` and `triad check idempotent rerun passes`: **PASS**
- User-visible metadata guard: exit 0

The five remaining fails are the same pair, reported by `check_intake_template_parity.py`:

`[INTAKE_TEMPLATE_PARITY_ERROR] mismatch: .cursor/scratchpad.md (36326b) != template/.cursor/scratchpad.md (36325b)`

Rows:

- `check_intake_template_parity --scope=dev-environment passes`
- `check_intake_template_parity --scope=dev-environment passes (US-0099)`
- `check_intake_template_parity --scope=model-tier passes (US-0101)`
- `check_intake_template_parity --scope=model-tier-overrides passes (US-0102)`
- `check_intake_template_parity --scope=arch-linkage passes (US-0129)`

The only byte difference is one CR: active `TOKEN_PROFILE=balanced` ends with CRLF; the template line ends with LF. Assignment text matches, including `AUTO_BACKLOG_MAX_STORIES=3`. This sprint does not own that file. It was not edited here.

Known standalone us0125/us0126 baseline failures are outside this harness Fail count and were not treated as S0169 failures.

## UAT

Live PATH / HKCU probing would mutate the operator machine. Recorded `UAT_PROBE_FORBIDDEN`. The six live-runtime probe classes are waived. Acceptance behavior is covered by the fake-home tests above. UAT result: **PASS** (`sprints/S0169/uat.md`, `sprints/S0169/uat.json`). Full-harness Fail=0 is not claimed.

## Guards held

- BUG-0026 remains OPEN (AC-3 still unchecked). BUG-0025, US-0146, and US-0147 remain DONE. BUG-0033 remains DONE. None were reopened.
- No `.env` read, no commit, no push, no publish, no `/auto`, no subagent spawn.

## Next

Fresh `/verify-work` for US-0149 / S0169. This QA child does not spawn it.
