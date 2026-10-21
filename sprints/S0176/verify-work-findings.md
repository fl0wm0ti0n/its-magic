# Verify-work findings — S0176 / BUG-0028

- **verdict**: **VERIFY_PASS**
- **decision_gate**: false
- **phase_id**: verify-work
- **role**: qa
- **bug_id**: BUG-0028
- **sprint_id**: S0176
- **timestamp**: 2026-10-14T20:26:55Z
- **fresh_context_marker**: `qa-BUG0028-vw-20261014T202655Z-fresh`
- **model_id**: omit
- **model_provenance**: `provenance=host=cursor;path=.cursor/scratchpad.local.md;step=MODEL_TIER_<PHASE>`
- **CROSS_MODEL_REVIEW**: 1
- **blocking findings**: none
- **status guard**: BUG-0028 remains **OPEN**. Backlog AC-1..AC-5 stay `[ ]`. Acceptance row stays `[ ]`. Closure owns the DONE flip. This child did not edit `docs/product/backlog.md`, `docs/product/acceptance.md`, `docs/engineering/decisions.md`, or `docs/engineering/architecture.md`.

Consumed QA pair (recomputed MATCH, in TTL at verify-work start `2026-10-14T20:25:45Z`, expires `2026-10-14T20:58:55Z`): `record_key=auto-20261013-bug0028|bug|BUG-0028|qa|rp-auto-20261013-bug0028-qa-qa-20261014T195855Z-BUG-0028`; `proof_hash=bf31b1146e19c04444715cd10374bbf825463836f9889e5cbda39e072c5b52d2`; `proof_issued_at=2026-10-14T19:58:55Z`; marker `qa-BUG0028-qa-20261014T195855Z-fresh`. Hash via `scripts.token_cost_lib.compute_strict_proof_hash`.

## Test plan

1. Confirm the top `handoffs/resume_brief.md` record is the BUG-0028 QA pair and that its proof hash and TTL are valid.
2. Narrow-read `sprints/S0176/qa-findings.md`, `sprints/S0176/uat.md`, `sprints/S0176/uat.json`, and backlog `### BUG-0028` acceptance.
3. Re-run the five `test_bug0028_*` markers from `standalone`.
4. Fill UAT-1..UAT-5 from AC-1..AC-5. Keep the convergence-smoke surrogate. Do not tick backlog boxes.
5. Treat a live installed binary, and the other five live probe classes, as `UAT_PROBE_FORBIDDEN`. Use the contract tests as the evidence.
6. Leave BUG-0028 OPEN. Do not spawn `/release`.

## Contract markers

Command: `node --experimental-strip-types --test --test-name-pattern "test_bug0028_" tests/contract/bug0028.contract.test.ts` (cwd `standalone`).

| Marker | Result |
|---|---|
| `test_bug0028_help_auth_models_skip_host_and_kernel_barrel` | PASS (1458.9162 ms) |
| `test_bug0028_status_bounded_snapshot_no_scan_session_or_ping` | PASS (258.4957 ms) |
| `test_bug0028_workflow_tokens_keep_production_host` | PASS (3443.9187 ms) |
| `test_bug0028_installed_entrypoint_windows_and_linux` | PASS (285.4339 ms) |
| `test_bug0028_operator_doc_lightweight_versus_full_runtime` | PASS (15.7807 ms) |

**5 pass / 0 fail.** Duration 5617.6656 ms. Exit code 0. `contract_test_failed=0`.

The full kit `TEST_COMMAND` (`tests/run-tests.ps1`) was not re-run. This pass does not claim `tests/report.md` Fail=0. The surrogate `evidence_ref` keeps the US-0128 contracted token.

## AC checklist

| AC | Expectation | Evidence | Result |
|---|---|---|---|
| AC-1 | Help, auth, and models finish locally before RuntimeHost, the Pi kernel, code intelligence, ToolBroker, or SQLite. | `test_bug0028_help_auth_models_skip_host_and_kernel_barrel` passed. UAT-1 links AC-1 and records pass. | PASS |
| AC-2 | Bare `status` is a bounded snapshot and does not scan the repository or create a workflow session. | `test_bug0028_status_bounded_snapshot_no_scan_session_or_ping` passed. UAT-2 links AC-2 and records pass. | PASS |
| AC-3 | Workflow tokens, including `/status`, keep production `createRuntimeHost`. | `test_bug0028_workflow_tokens_keep_production_host` passed. UAT-3 links AC-3 and records pass. | PASS |
| AC-4 | Tests show light paths do not construct code intelligence or scan project files, and launcher checks cover Windows and Linux. | `test_bug0028_installed_entrypoint_windows_and_linux` passed. UAT-4 links AC-4 and records pass. A live installed binary was not run. | PASS |
| AC-5 | Operator docs distinguish lightweight inspection and auth commands from full-runtime commands. | `test_bug0028_operator_doc_lightweight_versus_full_runtime` passed. UAT-5 links AC-5 and records pass. | PASS |

## UAT

`sprints/S0176/uat.json` has 6 steps. Each step has a description and `result` of `pass`. `passed` 6 + `failed` 0 equals the step count 6.

`sprints/S0176/uat.md` lists UAT-1..UAT-5 and `convergence_smoke`. UAT-1..UAT-5 link to AC-1..AC-5. The summary links those steps back to backlog acceptance. `uat_lifecycle` is **populated**.

A live installed binary is `UAT_PROBE_FORBIDDEN`. The six live classes `browser_smoke`, `api_health`, `process_health`, `cli_smoke`, `build`, and `manual_operator` are waived with that reason code. `convergence_smoke` result is **pass** because `contract_test_failed=0`.

## Generated-test evidence

This slice is the framework kit contract harness, not a generated application stack.

- `generated_test_stack_profile`: node
- `generated_test_command`: `node --experimental-strip-types --test --test-name-pattern "test_bug0028_" tests/contract/bug0028.contract.test.ts`
- `generated_test_result`: pass (5 / 0, duration_ms 5617.6656)
- `generated_test_output_ref`: this file, Contract markers
- `generated_test_paths_ref`: `standalone/tests/contract/bug0028.contract.test.ts`
- `generated_test_reason_code`: ok
- baseline scope also recorded in `sprints/S0176/summary.md` and `sprints/S0176/qa-findings.md`

## Isolation already present

- execute: `phase_id=execute`, `role=dev`, `model_id=omit`, `fresh_context_marker=dev-BUG0028-execute-20261014T192900Z-fresh`, timestamp 2026-10-14T19:29:00Z. Proof `a7e227b1d956da1dad52a8c6508de69b3213ba712646553eb579c5c7c90a0fad`.
- qa: `phase_id=qa`, `role=qa`, `model_id=omit`, `fresh_context_marker=qa-BUG0028-qa-20261014T195855Z-fresh`, timestamp 2026-10-14T19:58:55Z. Proof `bf31b1146e19c04444715cd10374bbf825463836f9889e5cbda39e072c5b52d2` MATCH and in TTL at start.
- verify-work: this checkpoint, marker `qa-BUG0028-vw-20261014T202655Z-fresh`. Markers are distinct.

## Traceability (DEC-0010)

| Story | Sprint | Tasks | Status | Evidence |
|---|---|---|---|---|
| BUG-0028 | S0176 | T-anch + T-001..T-005 | PASS | `sprints/S0176/uat.json`, `sprints/S0176/uat.md`, `sprints/S0176/verify-work-findings.md` |

Backlog `Status` stays **OPEN**. This traceability Status is the UAT result.

## Guards held

- BUG-0028 stays OPEN. AC boxes stay unchecked.
- BUG-0026, BUG-0029, US-0150, US-0151, US-0154, US-0155, and US-0156 were not mutated.
- No `.env` read, no commit, no push, no npm publish, no `/auto`, no subagent spawn.
- This verify-work child did **not** spawn `/release`.

## Next

Fresh `/release` for BUG-0028 / S0176 waits on this pair. The parent may spawn it after validating the pair. This child does not spawn release. BUG-0028 stays OPEN.
