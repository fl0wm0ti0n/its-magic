# Sprint S0177 progress — BUG-0026

- status: **VERIFY_PASS**
- verdict: verify-work complete; release has not started
- tasks: T-anch and T-001 finished
- bug: BUG-0026 remains **OPEN**. AC-3 remains unchecked. AC-1, AC-2, AC-4..AC-8 remain checked.
- plan-verify: SKIPPED (`ultra_lean_not_in_resolved_phase_plan`)
- fresh_context_marker: `dev-BUG0026-execute-20261015T084528Z-fresh`
- linux_outcome: `STANDALONE_BOOTSTRAP_OK` plus posix `.its-magic/bin/itsm` mode 0755
- This execute child did not spawn `/qa`, did not run `/verify-work`, and did not close the bug.

## QA — Linux re-observation

Finished 2026-10-15T08:56:25Z. Marker `qa-BUG0026-qa-20261015T085625Z-fresh`. Verdict **QA_PASS**. `decision_gate=false`.

- Consumed execute proof `9fd4bf3e08dfc5a00422860c5858b8b1f241732ed388a269b7a8bb94b52f3486` MATCH and in TTL.
- Eight `test_bug0026_*` markers: 8 pass / 0 fail (4.84s).
- Debian 13 WSL2 re-observation matches the execute success residue. QA did not re-run the upgrade and did not republish.
- UAT 9 pass / 0 fail. BUG-0026 stays OPEN. AC-3 stays unchecked.
- This QA child did not spawn `/verify-work`.

## T-anch — locked baseline

Finished. No product-code change.

- Backlog `### BUG-0026` is **OPEN**. AC-3 is `[ ]`. AC-1, AC-2, and AC-4..AC-8 are `[x]`.
- Allowlisted range file `scripts/standalone-supported-kernel-range.json` is present. Git history for that path is `3d9d5f0` at `2026-09-19T12:48:36+02:00`, subject `Release its-magic 0.1.5 (BUG-0026 packaging fix)`. It was not republished and `load_supported_range` was not re-implemented.
- `STANDALONE_SUPPORTED_RANGE_MISSING` remains the miss token in `scripts/standalone_runtime_install_lib.py`.
- Windows row, cited and not copied into the Linux row: 2026-09-19 global `its-magic@0.1.5` emitted `STANDALONE_BOOTSTRAP_OK` / `STANDALONE_POSTINSTALL_OK` and materialized `.its-magic/bin/itsm` and `itsm.cmd`.
- Eight existing tests remain in `tests/bug0026_packaged_range_contract_test.py`: `test_bug0026_allowlist_ships_equivalent_range_without_private_workspace`, `test_bug0026_packaged_range_matches_kernel_bridge_source`, `test_bug0026_npm_pack_contains_range_fallback_and_omits_standalone_workspace`, `test_bug0026_published_layout_preflight_uses_packaged_range`, `test_bug0026_published_layout_materializes_itsm_shim`, `test_bug0026_packed_tarball_upgrade_materializes_itsm_shim`, `test_bug0026_incomplete_runtime_payload_fails_closed`, `test_bug0026_missing_range_is_not_false_kernel_contract_mismatch`.
- `test_bug0026_packed_tarball_upgrade_materializes_itsm_shim` is the packed-tarball test. It is not the Linux half.
- `sprints/S0176/sprint.md` is BUG-0028. This sprint is S0177.
- BUG-0028, BUG-0029, BUG-0025, and US-0149 were not mutated. `docs/engineering/decisions.md` was not edited.

## T-001 — Linux published-global observation

Finished. One outcome recorded.

- Host: Debian 13 on WSL2, `Linux 6.18.33.2-microsoft-standard-WSL2 x86_64`. Docker is not installed. The Debian distro was installed and stopped; it was started for this observation. This is a real Linux host, not a missing-runtime pass.
- The distro had no Linux `node` or `python3`, and `sudo` requires a password. User-local Linux Node.js v24.19.0 and CPython 3.12.15 (`sys.platform=linux`) were placed on a Linux-only PATH. The Windows `npm` on `/mnt/c` was not used.
- Install: `npm install -g its-magic@0.1.5` with that Linux npm. Package version `0.1.5`. `scripts/standalone-supported-kernel-range.json` is present in the installed package. npm 11 reported that the package postinstall script was not run (`allow-scripts`). The required observation is the consumer CLI command below, which was run explicitly.
- Consumer project: `/home/flow/bug0026-consumer-s0177` (outside this kit repo).
- Command: `its-magic --target . --mode upgrade --host both`. Exit 0.
- Tokens present: `HOST_CONFIG_POSTINSTALL_OK`, `STANDALONE_BOOTSTRAP_OK`, `STANDALONE_POSTINSTALL_OK`.
- Tokens absent from that output: `KERNEL_CONTRACT_MISMATCH`, `STANDALONE_SUPPORTED_RANGE_MISSING`, `STANDALONE_BOOTSTRAP_FAILED`, `PYTHON_NOT_FOUND`.
- Shim: `.its-magic/bin/itsm` is a regular file, mode `0755`, first line `#!/usr/bin/env sh`. `itsm.cmd` is absent. `itsm.cmd` was not required.
- No republish. No new contract. The loader, the allowlisted range file, BUG-0028, and BUG-0029 were not edited. BUG-0025 and US-0149 were not reopened.
- AC-3 was not ticked. BUG-0026 was not flipped to DONE.

## Verify-work — Linux re-observation

Finished 2026-10-15T09:07:04Z. Marker `qa-BUG0026-vw-20261015T090704Z-fresh`. Verdict **VERIFY_PASS**. `decision_gate=false`.

- Consumed QA proof `8e764bb06d76659824e92774772bc0d26602874df30a367585b7579992901187` MATCH and in TTL.
- Eight `test_bug0026_*` markers: 8 pass / 0 fail (4.14s).
- Debian 13 WSL2 re-observation matches the execute success residue. This phase did not re-run the upgrade and did not republish.
- UAT stays 9 pass / 0 fail. BUG-0026 stays OPEN. AC-3 stays unchecked.
- This verify-work child did not spawn `/release`.
