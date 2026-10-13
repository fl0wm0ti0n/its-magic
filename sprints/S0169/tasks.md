# Sprint S0169 — Task checklist (US-0149)

Seven planned tasks: **T-anch + T-001..T-006**, within `SPRINT_MAX_TASKS=12`.
Execute only in this order. T-anch and T-001..T-006 are done. QA, release, and
closure are not claimed here.

## Checklist

- [x] **T-anch — locked baseline (all AC):** Read R-0160 and `# US-0149`. Confirm US-0149 is OPEN, AC-1..AC-6 are unchecked, `installer.py` has no PATH-registration flag, and `write_itsm_shim` still owns `.its-magic/bin/itsm`. Do not mutate.

- [x] **T-001 — shim gate (AC-1):** `register_itsm_user_path` returns failure `ITSM_PATH_SHIM_MISSING` when `.its-magic/bin/itsm` is absent (and `itsm.cmd` on Windows) and writes no ledger and no PATH entry. Do not edit BUG-0026 or `write_itsm_shim`.
  **Done-when:** a missing shim cannot change PATH state.

- [x] **T-002 — opt-in surface (AC-2):** Add `--register-itsm-path` and `ITS_MAGIC_REGISTER_ITSM_PATH` / `ITS_MAGIC_ITSM_PATH_DIR`. Default off, no prompt. `prompt` only on a TTY; non-TTY fail-closes. Defaults are `%LOCALAPPDATA%\its-magic\bin` and `$HOME/.local/bin`. `installer.ps1` and `installer.sh` forward flags only.
  **Done-when:** a normal install without the flag leaves PATH untouched.

- [x] **T-003 — place shim and append PATH (AC-3):** POSIX symlink (copy fallback mode `0755`); Windows copy of the shim files. Append the chosen directory on the Windows user PATH store and the POSIX marked snippet. Do not reorder existing entries. macOS uses the POSIX path.
  **Done-when:** Windows and POSIX stores gain the directory only when it was absent, and the chosen directory contains `itsm`.

- [x] **T-004 — unregister and rollback (AC-4):** Ledger fields `dir`, `path_entry_added`, `link_names`, `link_target`. Unregister deletes only those links and removes the PATH directory only when `path_entry_added` is true. `--unregister-itsm-path` always reverses the ledger. `uninstall-standalone` does so only when `link_target` is inside the target repo. A write failure rolls back the link and leaves no new PATH entry (`ITSM_PATH_REGISTER_FAILED`).
  **Done-when:** unrelated PATH entries survive, and a failed write is not partial.

- [x] **T-005 — docs (AC-5):** Add the same PATH subsection to `docs/engineering/runbook.md` and `template/docs/engineering/runbook.md` (flag, defaults, prompt, platforms, removal, `ITSM_PATH_SHIM_MISSING` → BUG-0026). Optional matching pointer in `README.md` and `template/README.md` only. Do not delete the npm `--prefix` block.
  **Done-when:** the two runbook sections match and name the tokens.

- [x] **T-006 — contract tests (AC-6):** Add `tests/us0149_path_registration_test.py` with the eight R-0160 markers. Use a fake home and a fake PATH store. Wire the file into `tests/run-tests.ps1` and `tests/run-tests.sh`. Do not change `tests/us0149_global_itsm_launcher_test.py`.
  **Done-when:** the eight markers pass and the launcher file is unchanged.

## Execute evidence

Fresh `/execute` dev context completed T-anch and T-001..T-006. Eight `test_us0149_*` markers in `tests/us0149_path_registration_test.py` passed. Harness `tests/report.md` timestamp `2026-10-11T13:25:18Z`, Pass 874 / Fail 6. The US-0149 path row passed. The six fails are scratchpad active/template drift (`AUTO_BACKLOG_MAX_STORIES`), not this sprint. US-0149 stays OPEN. AC boxes stay unchecked. `fresh_context_marker=dev-US0149-execute-20261011T132649Z-fresh`.
