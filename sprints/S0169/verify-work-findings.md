# Verify-work findings — S0169 / US-0149

- **verdict**: **VERIFY_PASS**
- **phase_id**: verify-work
- **role**: qa
- **story_id**: US-0149
- **sprint_id**: S0169
- **timestamp**: 2026-10-11T14:02:38Z
- **fresh_context_marker**: `qa-US0149-vw-20261011T140238Z-fresh`
- **CROSS_MODEL_REVIEW**: 0 (model_id omitted)
- **blocking findings**: none
- **status guard**: US-0149 remains **OPEN**. Backlog AC-1..AC-6 stay `[ ]`. `docs/product/acceptance.md` US-0149 stays unchecked. Closure owns the DONE flip. This child did not write `handoffs/resume_brief.md` and did not edit `.cursor/scratchpad.md`.

Consumed as provenance only: QA marker `qa-US0149-qa-20261011T134545Z-fresh`; qa-pair `record_key=auto-20261011-us0149-qa-pair|story|(none)|qa|rp-auto-20261011-us0149-qa-pair-curator-20261011T135129Z`; `proof_hash=c7cd03b241c66aa47ca6b0632f0b52fc5723702831012b08e4714241e50b3f92`. This context re-ran the contract tests and the harness.

## Test plan

1. Read US-0149 AC-1..AC-6, S0169 tasks, QA findings, and the populated UAT.
2. Re-run `python -m pytest tests/us0149_path_registration_test.py -q` (eight markers, fake home and fake PATH store).
3. Re-run `powershell -NoProfile -ExecutionPolicy Bypass -File tests/run-tests.ps1` and record Pass/Fail plus the report timestamp.
4. Confirm the five prior scratchpad-parity rows pass after the parent restored the template bytes. Do not edit `.cursor/scratchpad.md`.
5. Confirm opt-in default, missing-shim fail-closed, unregister scope, and runbook parity in code and tests.
6. Confirm BUG-0026 stays OPEN and BUG-0025 / US-0146 / US-0147 / BUG-0033 stay DONE.
7. Do not probe the live user PATH or HKCU (`UAT_PROBE_FORBIDDEN`).

## AC checklist

| AC | Expectation | Evidence | Result |
|---|---|---|---|
| AC-1 | Missing `.its-magic/bin/itsm` (and `itsm.cmd` on Windows) returns `ITSM_PATH_SHIM_MISSING` and writes nothing. BUG-0026 stays the materialize owner. | `test_us0149_register_refuses_when_shim_missing`. `_shim_ready` returns before any ledger or PATH write. BUG-0026 remains OPEN (AC-3 still unchecked). | PASS |
| AC-2 | Opt-in only. No flag and no env leaves PATH untouched. User-chosen directory, documented defaults, TTY-only `prompt`. | `test_us0149_register_opt_in_default_off`, `test_us0149_register_user_chosen_dir`. `dispatch_itsm_path_registration` returns `(0, None)` when opt-in is false. Defaults `%LOCALAPPDATA%\its-magic\bin` and `$HOME/.local/bin`. `installer.ps1` / `installer.sh` forward flags only. `installer.ps1` has no `setx`. | PASS |
| AC-3 | Windows and POSIX place `itsm` and append the chosen directory only when it was absent. macOS uses the POSIX path. | `test_us0149_register_windows_user_path`. `test_us0149_register_posix_profile_snippet`. Production Windows store is `HKCU\Environment` read-modify-write. Tests inject the fake store. | PASS |
| AC-4 | Unregister deletes only recorded links and removes the PATH directory only when `path_entry_added` is true. Failed writes roll back. | `test_us0149_unregister_removes_only_owned_entry`. `test_us0149_register_fail_closed_on_write_error`. `uninstall_standalone` calls unregister with `only_if_inside` the target repo. | PASS |
| AC-5 | Active and template runbooks share the PATH subsection and name the tokens. README npm `--prefix` block stays. | `test_us0149_runbook_path_section_parity`. Heading `### Global itsm PATH registration (US-0149)` in both runbooks. README and template README still contain `npm install -g --prefix`. | PASS |
| AC-6 | Eight `test_us0149_*` markers cover the residual, opt-in path, Win/POSIX, removal, and docs. | `8 passed in 0.39s`. Harness row `US-0149 path registration contract tests pass` is PASS. | PASS |

## Harness

- Command: `powershell -NoProfile -ExecutionPolicy Bypass -File tests/run-tests.ps1`
- Exit code: **0**
- `tests/report.md` timestamp **2026-10-11T14:01:36Z**
- **Pass 880 / Fail 0**
- US-0149 path registration row: **PASS**
- Prior scratchpad-parity rows, now **PASS**:
  - `check_intake_template_parity --scope=dev-environment passes`
  - `check_intake_template_parity --scope=dev-environment passes (US-0099)`
  - `check_intake_template_parity --scope=model-tier passes (US-0101)`
  - `check_intake_template_parity --scope=model-tier-overrides passes (US-0102)`
  - `check_intake_template_parity --scope=arch-linkage passes (US-0129)`
- `.cursor/scratchpad.md` was not edited in this phase.

Contract tests, separate from the harness row: `python -m pytest tests/us0149_path_registration_test.py -q` → **8 passed in 0.39s**.

## UAT

Live PATH / HKCU probing would mutate the operator machine. Recorded `UAT_PROBE_FORBIDDEN`. The six live-runtime probe classes stay waived. This phase did not register anything on the operator PATH. Existing UAT result remains **PASS** (`sprints/S0169/uat.md`, `sprints/S0169/uat.json`). Those files still cite the QA harness (Pass 875 / Fail 5). This verify-work harness is Pass 880 / Fail 0.

## Guards held

- BUG-0026 remains OPEN. BUG-0025, US-0146, and US-0147 remain DONE. BUG-0033 remains DONE. None were reopened.
- No `.env` read, no commit, no push, no publish, no `/auto`, no subagent spawn.
- `handoffs/resume_brief.md` was not written by this child.

## Triad

- Pre-append `python scripts/enforce-triad-hot-surface.py --repo . --rollover` saw `docs/engineering/state.md` at exactly 1200 lines and archived nothing. The cap is inclusive.
- After this checkpoint was appended (1214 lines), `--rollover` archived **1** unit only: `docs/engineering/state-archive/state-pack-20261011-a.md`. First and last archived heading are the oldest checkpoint, the BUG-0032 / S0166 verify-work FAIL record. The QA-pair, execute-pair, plan, discovery, drain-advance, and BUG-0033 refresh checkpoints stay in the hot file.
- Post-rollover `python scripts/enforce-triad-hot-surface.py --repo . --check` exit **0**. `docs/engineering/state.md` is **1123** lines.

## Next

Fresh `/release` for US-0149 / S0169. This verify-work child does not spawn it. US-0149 stays OPEN.
