# Verify-work findings — S0177 / BUG-0026

- **verdict**: **VERIFY_PASS**
- **decision_gate**: false
- **phase_id**: verify-work
- **role**: qa
- **bug_id**: BUG-0026
- **sprint_id**: S0177
- **timestamp**: 2026-10-15T09:07:04Z
- **fresh_context_marker**: `qa-BUG0026-vw-20261015T090704Z-fresh`
- **model_id**: omit
- **model_provenance**: `provenance=host=cursor;path=.cursor/scratchpad.local.md;step=MODEL_TIER_<PHASE>`
- **CROSS_MODEL_REVIEW**: 0
- **blocking findings**: none
- **fail_closed_reason_code**: none
- **status guard**: BUG-0026 remains **OPEN**. Backlog AC-3 stays `[ ]`. Acceptance row stays `[ ]`. AC-1, AC-2, and AC-4..AC-8 stay `[x]`. Closure owns the DONE flip. This child did not edit `docs/product/backlog.md`, `docs/product/acceptance.md`, `docs/engineering/decisions.md`, or `docs/engineering/architecture.md`.

Consumed QA pair (recomputed MATCH, in TTL at verify-work start `2026-10-15T09:04:31Z`, expires `2026-10-15T09:56:25Z`): `record_key=auto-20261015-bug0026|bug|BUG-0026|qa|rp-auto-20261015-bug0026-qa-qa-20261015T085625Z-BUG-0026`; `proof_hash=8e764bb06d76659824e92774772bc0d26602874df30a367585b7579992901187`; `proof_issued_at=2026-10-15T08:56:25Z`; marker `qa-BUG0026-qa-20261015T085625Z-fresh`. Hash via `scripts.token_cost_lib.compute_strict_proof_hash`. Independent hashlib MATCH.

## Test plan

1. Recompute the top QA pair hash and confirm TTL has not elapsed. Fail closed `RESUME_BRIEF_STALE` on mismatch or elapsed TTL.
2. Confirm the work is T-anch and T-001 only. Confirm BUG-0026 is OPEN and AC-3 is unchecked.
3. Re-run the eight existing `test_bug0026_*` markers. Do not add a contract.
4. Re-observe the recorded Debian 13 WSL2 consumer read-only. A missing Linux runtime is not a pass. Do not republish and do not re-run the upgrade.
5. Confirm UAT is populated at 9 pass / 0 fail. Do not tick AC-3. Do not flip BUG-0026 to DONE.
6. Leave BUG-0026 OPEN. Do not spawn `/release`.

## Scope

Tasks in `sprints/S0177/tasks.md` are **T-anch** and **T-001** only. Both are checked. No further task was added. S0176 is BUG-0028 (`sprints/S0176/sprint.md` title). This sprint is S0177.

T-anch holds: allowlisted `scripts/standalone-supported-kernel-range.json` git `3d9d5f0` at `2026-09-19T12:48:36+02:00`. `STANDALONE_SUPPORTED_RANGE_MISSING` remains the miss token in `scripts/standalone_runtime_install_lib.py`. The eight existing markers remain. `test_bug0026_packed_tarball_upgrade_materializes_itsm_shim` is the packed-tarball test and is not the Linux half. The recorded Windows `itsm` plus `itsm.cmd` row is cited and was not copied. No product-code change in this phase.

## Contract markers

Command: `python -m pytest tests/bug0026_packaged_range_contract_test.py -q --tb=line`

| Marker | Result |
|---|---|
| `test_bug0026_allowlist_ships_equivalent_range_without_private_workspace` | PASS |
| `test_bug0026_packaged_range_matches_kernel_bridge_source` | PASS |
| `test_bug0026_npm_pack_contains_range_fallback_and_omits_standalone_workspace` | PASS |
| `test_bug0026_published_layout_preflight_uses_packaged_range` | PASS |
| `test_bug0026_published_layout_materializes_itsm_shim` | PASS |
| `test_bug0026_packed_tarball_upgrade_materializes_itsm_shim` | PASS |
| `test_bug0026_incomplete_runtime_payload_fails_closed` | PASS |
| `test_bug0026_missing_range_is_not_false_kernel_contract_mismatch` | PASS |

**8 pass / 0 fail.** Duration 4.14s. Exit code 0. `contract_test_failed=0`. The packed-tarball marker stayed in the suite and is not the Linux half.

The full kit `TEST_COMMAND` (`tests/run-tests.ps1`) was not re-run. This pass does not claim `tests/report.md` Fail=0.

## Linux re-observation

The Debian distro was installed and stopped. It was started for this read-only check. This is a real Linux host. It is not a missing-runtime pass. This phase did not run `npm install`, did not re-run `its-magic --target . --mode upgrade --host both`, and did not republish. `npm prefix -g` and `npm ls -g its-magic` wrote debug logs `2026-10-15T09_05_24_955Z` and `2026-10-15T09_05_25_040Z` only.

| Check | Observed |
|---|---|
| Host | Debian GNU/Linux 13 (trixie), `Linux BigOne 6.18.33.2-microsoft-standard-WSL2 #1 SMP PREEMPT_DYNAMIC Thu Jun 18 21:54:43 UTC 2026 x86_64` |
| Toolchain | `/home/flow/bug0026-toolchain/node-v24.19.0-linux-x64` Node `v24.19.0`; CPython `/home/flow/bug0026-toolchain/python/bin/python3.12` version `3.12.15`, `sys.platform=linux` |
| Global package | `its-magic@0.1.5` under that Linux prefix. `scripts/standalone-supported-kernel-range.json` is present. npm log `2026-10-15T08_42_11_067Z` argv `install --global its-magic@0.1.5` |
| Consumer | `/home/flow/bug0026-consumer-s0177` |
| Shim | `.its-magic/bin/itsm` regular file, mode `0755`, first line `#!/usr/bin/env sh`, mtime `2026-10-15 10:42:41 +0200` |
| `itsm.cmd` | absent |
| Standalone residue | `.its-magic/standalone/runtime-metadata.json` records `supported_range` `minInclusive=0.1.3-9`, `maxExclusive=0.2.0`. npm log `2026-10-15T08_42_40_326Z` argv `ci --ignore-scripts` |

Execute artifacts (`sprints/S0177/progress.md`, `handoffs/dev_to_qa.md`, the execute checkpoint) record exit 0 and tokens `HOST_CONFIG_POSTINSTALL_OK`, `STANDALONE_BOOTSTRAP_OK`, and `STANDALONE_POSTINSTALL_OK`, and record the absence of `KERNEL_CONTRACT_MISMATCH`, `STANDALONE_SUPPORTED_RANGE_MISSING`, and `PYTHON_NOT_FOUND`. The shim mtime aligns with that `npm ci` log. The host residue matches that success path. The stdout token was not re-executed.

## AC checklist

| AC | Expectation | Evidence | Result |
|---|---|---|---|
| AC-1 | Published package includes a supported-range source the installer can load. | Installed `its-magic@0.1.5` contains `scripts/standalone-supported-kernel-range.json`. Allowlist contract passed. Backlog box stays `[x]`. | PASS |
| AC-2 | Windows published-global bootstrap is already recorded. Do not copy that row into the Linux row. | 2026-09-19 Windows `itsm` plus `itsm.cmd` row cited in progress. Linux residue has no `itsm.cmd`. | PASS |
| AC-3 | Linux published-global bootstrap OK, or `STANDALONE_SUPPORTED_RANGE_MISSING` distinct from a false kernel mismatch. | Debian 13 observation above. Backlog AC-3 stays `[ ]`. This verify-work pass does not tick it. | PASS |
| AC-4 | Existing pack allowlist stays. No new contract. | Eight existing markers passed. No contract file added. | PASS |
| AC-5 | Do not reopen BUG-0025. | No BUG-0025 edit. | PASS |
| AC-6 | Do not reopen US-0149. | No US-0149 edit. | PASS |
| AC-7 | Do not edit BUG-0028 or BUG-0029. | No edit to those bugs. | PASS |
| AC-8 | A true kernel mismatch stays `KERNEL_CONTRACT_MISMATCH`. A missing range is a different token. | `test_bug0026_missing_range_is_not_false_kernel_contract_mismatch` passed. The Linux residue is the success path, not a false mismatch. | PASS |

## UAT

`sprints/S0177/uat.json` stays **populated** from QA. `steps` is non-empty. Each step has a description and `result` of `pass`. `passed` 9 + `failed` 0 equals `total` 9. `sprints/S0177/uat.md` lists UAT-1..UAT-8 and `convergence_smoke`, with a summary that links those steps to acceptance. This phase did not rewrite those files and did not tick AC-3.

`cli_smoke` was re-observed on the recorded Debian host (read-only). `browser_smoke`, `api_health`, `process_health`, `build`, and `manual_operator` stay waived with **`UAT_PROBE_FORBIDDEN`**. No `.env` read. No credential fill. No republish. Convergence surrogate `id=convergence_smoke` result **pass** because `contract_test_failed=0`. This pass does not claim a fresh full-harness Fail=0.

## Generated-test evidence

This slice is the framework kit contract harness, not a generated application stack.

- `generated_test_stack_profile`: python
- `generated_test_command`: `python -m pytest tests/bug0026_packaged_range_contract_test.py -q --tb=line`
- `generated_test_result`: pass (8 / 0, 4.14s, exit 0)
- `generated_test_output_ref`: this file, Contract markers
- `generated_test_paths_ref`: `tests/bug0026_packaged_range_contract_test.py`
- `generated_test_reason_code`: ok
- baseline scope also recorded in `sprints/S0177/summary.md` and `sprints/S0177/qa-findings.md`

## Isolation already present

- execute: `phase_id=execute`, `role=dev`, `model_id=omit`, `fresh_context_marker=dev-BUG0026-execute-20261015T084528Z-fresh`, timestamp 2026-10-15T08:45:28Z. Proof `9fd4bf3e08dfc5a00422860c5858b8b1f241732ed388a269b7a8bb94b52f3486`.
- qa: `phase_id=qa`, `role=qa`, `model_id=omit`, `fresh_context_marker=qa-BUG0026-qa-20261015T085625Z-fresh`, timestamp 2026-10-15T08:56:25Z. Proof `8e764bb06d76659824e92774772bc0d26602874df30a367585b7579992901187` MATCH and in TTL at start.
- verify-work: this checkpoint, marker `qa-BUG0026-vw-20261015T090704Z-fresh`. Markers are distinct.

## Traceability (DEC-0010)

| Story | Sprint | Tasks | Status | Evidence |
|---|---|---|---|---|
| BUG-0026 | S0177 | T-anch + T-001 | PASS | `sprints/S0177/uat.json`, `sprints/S0177/uat.md`, `sprints/S0177/verify-work-findings.md` |

Backlog `Status` stays **OPEN**. This traceability Status is the UAT result. AC-3 stays unchecked.

## Guards held

- BUG-0026 stays OPEN. AC-3 stays unchecked. The acceptance row stays unchecked.
- BUG-0028, BUG-0029, BUG-0025, and US-0149 were not edited. The loader and the allowlisted range file were not edited.
- No `.env` read, no commit, no push, no npm publish, no `/auto`, no subagent spawn.
- This verify-work child did **not** spawn `/release`.

## Next

Fresh `/release` for BUG-0026 / S0177 waits on this pair. The parent may spawn it after validating the pair. This child does not spawn release. BUG-0026 stays OPEN. AC-3 stays unchecked. BUG-0029 stays out of this phase.
