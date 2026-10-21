# Sprint S0177 summary — BUG-0026

- sprint_id: S0177
- bug_id: BUG-0026
- status: VERIFY_PASS
- tasks: T-anch and T-001 finished
- BUG-0026 remains OPEN. AC-3 remains unchecked. Closure owns the DONE flip.
- fresh_context_marker: `dev-BUG0026-execute-20261015T084528Z-fresh`
- Linux outcome: `STANDALONE_BOOTSTRAP_OK` and posix `.its-magic/bin/itsm` at mode 0755 on Debian 13 WSL2 (`Linux 6.18.33.2-microsoft-standard-WSL2 x86_64`). Published global `its-magic@0.1.5` contains `scripts/standalone-supported-kernel-range.json`. Consumer command `its-magic --target . --mode upgrade --host both` exited 0. `STANDALONE_POSTINSTALL_OK` was also emitted. `KERNEL_CONTRACT_MISMATCH`, `STANDALONE_SUPPORTED_RANGE_MISSING`, and `PYTHON_NOT_FOUND` were not emitted. `itsm.cmd` is absent on this Linux host.
- T-anch held the 2026-09-19 allowlisted range file and `STANDALONE_SUPPORTED_RANGE_MISSING`. No product-code change. The packed-tarball test is not the Linux half. The recorded Windows `itsm.cmd` row was cited and not copied here.
- No git commit, push, or npm publish.

## Verify-work

**VERIFY_PASS** (`qa-BUG0026-vw-20261015T090704Z-fresh`). UAT stays populated at 9 pass / 0 fail. Debian 13 WSL2 re-observation matches the recorded success residue: posix `.its-magic/bin/itsm` mode 0755. The upgrade command was not run again. BUG-0026 stays OPEN. AC-3 stays unchecked. `next_scheduled_phase=release`.

## Generated-test evidence

Framework kit contract harness, not a generated application stack.

- baseline scope: `tests/bug0026_packaged_range_contract_test.py` (eight `test_bug0026_*` markers)
- command: `python -m pytest tests/bug0026_packaged_range_contract_test.py -q --tb=line`
- result: pass, 8 / 0, 4.14s, exit 0
- output ref: `sprints/S0177/verify-work-findings.md`
- paths ref: `tests/bug0026_packaged_range_contract_test.py`
- reason code: ok
