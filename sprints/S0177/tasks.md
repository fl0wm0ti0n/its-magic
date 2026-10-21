# Sprint S0177 — Task checklist (BUG-0026)

Two planned tasks: **T-anch + T-001**, 1:1 with the `# BUG-0026` seeds, within `SPRINT_MAX_TASKS=12`.
Execute only in this order. Both boxes were ticked by fresh `/execute` `dev-BUG0026-execute-20261015T084528Z-fresh` after each task finished. AC-3 stays unchecked.

## Checklist

- [x] **T-anch — locked baseline (AC-1, AC-2, AC-4, AC-5, AC-6, AC-7):** Read R-0167 and `# BUG-0026`. Confirm BUG-0026 is OPEN and AC-3 is unchecked. Confirm AC-1, AC-2, and AC-4..AC-8 stay checked. Confirm the 2026-09-19 allowlisted `scripts/standalone-supported-kernel-range.json` and `STANDALONE_SUPPORTED_RANGE_MISSING` are held, with no republish and no re-implementation of `load_supported_range`. Cite the already recorded Windows global `its-magic@0.1.5` row (`STANDALONE_BOOTSTRAP_OK` / `STANDALONE_POSTINSTALL_OK`, `.its-magic/bin/itsm` and `itsm.cmd`) and do not copy those tokens into a Linux row. Confirm the eight existing `test_bug0026_*` stay and that the packed-tarball test is not the Linux half. Confirm S0176 is BUG-0028 and this sprint is S0177. Confirm BUG-0028, BUG-0029, BUG-0025, and US-0149 are not mutated. Do not change product code in this task.
  **Done-when:** the notes match those gaps, BUG-0026 is still OPEN, and AC-3 is still unchecked.

- [x] **T-001 — Linux published-global observation and token classification (AC-3, AC-8):** On a Linux host, install published global `its-magic@0.1.5`, or a later published package that still contains `scripts/standalone-supported-kernel-range.json`. In a consumer project run `its-magic --target . --mode upgrade --host both`. Record one of two outcomes only: `STANDALONE_BOOTSTRAP_OK` plus posix `.its-magic/bin/itsm` at mode 0755, or, when both range files are absent, `STANDALONE_SUPPORTED_RANGE_MISSING`. That miss must not be classified as `KERNEL_CONTRACT_MISMATCH`. Do not require `itsm.cmd` on Linux. Do not treat a missing WSL or Docker runtime as a pass. `PYTHON_NOT_FOUND` does not close AC-3. Do not republish. Do not add a contract. Do not edit the loader, the allowlisted range file, BUG-0028, or BUG-0029. Do not reopen BUG-0025 or US-0149. Do not tick AC-3 and do not flip BUG-0026 to DONE.
  **Done-when:** the Linux observation is recorded as bootstrap OK with the posix shim, or as `STANDALONE_SUPPORTED_RANGE_MISSING` distinct from `KERNEL_CONTRACT_MISMATCH`, and BUG-0026 is still OPEN with AC-3 unchecked.

## Execute boundary

BUG-0026 stays OPEN. AC-3 stays unchecked. Closure owns the DONE flip. Do not edit `docs/engineering/decisions.md`. Do not implement in this sprint-plan phase.
