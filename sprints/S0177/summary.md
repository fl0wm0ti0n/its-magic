# Sprint S0177 summary — BUG-0026

- sprint_id: S0177
- bug_id: BUG-0026
- status: EXECUTE_PASS (re-attest; re-release cycle `auto-20261023-bug0026-execute`)
- tasks: T-anch (baseline hold) and T-001 (one fresh Linux published-global observation) finished
- BUG-0026 remains OPEN. AC-3 remains unchecked. Closure owns the DONE flip.
- fresh_context_marker: `dev-BUG0026-execute-20261023T140947Z-fresh`
- runtime_proof_id: `rp-auto-20261023-bug0026-execute-dev-20261023T140947Z-BUG-0026`; proof_hash `30d2784461bdbc1a63d94da2448d2b6fb70735fe49a9bcc59e5433e00874a1f1`; issued `2026-10-23T14:09:47Z`; ttl 3600s
- Linux outcome (FRESH): `STANDALONE_BOOTSTRAP_OK` and posix `.its-magic/bin/itsm` at mode 0755 on Debian 13 WSL2 (`Linux 6.18.33.2-microsoft-standard-WSL2 x86_64`). Published global `its-magic@0.1.5` contains `scripts/standalone-supported-kernel-range.json` (88 bytes). Consumer command `its-magic --target . --mode upgrade --host both` exited 0 (upgrade v0.1.4 -> v0.1.5). `HOST_CONFIG_POSTINSTALL_OK`, `STANDALONE_POSTINSTALL_OK` were emitted. `KERNEL_CONTRACT_MISMATCH`, `STANDALONE_SUPPORTED_RANGE_MISSING`, `STANDALONE_BOOTSTRAP_FAILED`, and `PYTHON_NOT_FOUND` were not emitted. `.its-magic/bin/itsm` recreated mode 0755, shebang `#!/usr/bin/env sh`; `itsm.cmd` absent on this Linux host.
- T-anch held the 2026-09-19 allowlisted range file and `STANDALONE_SUPPORTED_RANGE_MISSING`. No product-code change. `load_supported_range` not re-implemented; the eight `test_bug0026_*` remain the contract scope. The packed-tarball test is not the Linux half. The recorded Windows `itsm.cmd` row was cited and not copied here.
- Prior-cycle release blockers confirmed fixed: `tests/report.md` `2026-10-23T13:39:31Z Pass=884 Fail=0`; `validate_readme_feature_coverage.py --repo . --enforce` exit 0, `coverage_missing=[]`, `coverage_total=57`.
- Scoped test: `python -m pytest tests/bug0026_packaged_range_contract_test.py -q --tb=line` -> 8 passed in 4.33s, exit 0.
- No git commit, push, or npm publish.

## Re-attest execute — auto-20261023-bug0026-execute (role=dev)

**EXECUTE_PASS** (2026-10-23T14:09:47Z UTC). `decision_gate=false`. Re-attest of the execute phase after prior release blockers were fixed; re-attests, does not re-implement/republish/DEC. T-anch baseline hold + T-001 one fresh Linux published-global observation (Debian 13 WSL2, published `its-magic@0.1.5`, upgrade command exit 0, bootstrap + postinstall OK tokens, no mismatch/missing/failed/not-found tokens, posix shim mode 0755, no `itsm.cmd`). AC-3 not ticked; BUG-0026 not flipped; status-guard surfaces untouched; no `.env` read; this child did not spawn `/qa`. Proof `runtime_proof_id` + `fresh_context_marker` verified 0 prior occurrences; strict six-tuple hash `30d2784461bdbc1a63d94da2448d2b6fb70735fe49a9bcc59e5433e00874a1f1` MATCH via lib + independent recomputation. `next_scheduled_phase=qa`; `next_scheduled_role=qa`.

## Verify-work

**VERIFY_PASS** (`qa-BUG0026-vw-20261015T090704Z-fresh`). UAT stays populated at 9 pass / 0 fail. Debian 13 WSL2 re-observation matches the recorded success residue: posix `.its-magic/bin/itsm` mode 0755. The upgrade command was not run again. BUG-0026 stays OPEN. AC-3 stays unchecked. `next_scheduled_phase=release`.

## Generated-test evidence

Framework kit contract harness, not a generated application stack.

- baseline scope: `tests/bug0026_packaged_range_contract_test.py` (eight `test_bug0026_*` markers)
- command: `python -m pytest tests/bug0026_packaged_range_contract_test.py -q --tb=line`
- result (re-attest 2026-10-23): pass, 8 / 0, 4.33s, exit 0
- result (verify-work 2026-10-15): pass, 8 / 0, 4.14s, exit 0
- output ref: `sprints/S0177/verify-work-findings.md`
- paths ref: `tests/bug0026_packaged_range_contract_test.py`
- reason code: ok
