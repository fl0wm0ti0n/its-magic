# QA Findings — S0176 / BUG-0028

- **verdict**: **QA_PASS**
- **decision_gate**: false
- **phase_id**: qa
- **role**: qa
- **bug_id**: BUG-0028
- **sprint_id**: S0176
- **timestamp**: 2026-10-14T19:58:55Z
- **fresh_context_marker**: `qa-BUG0028-qa-20261014T195855Z-fresh`
- **model_id**: omit
- **model_provenance**: `provenance=host=cursor;path=.cursor/scratchpad.local.md;step=MODEL_TIER_<PHASE>`
- **CROSS_MODEL_REVIEW**: 1
- **blocking findings**: none
- **status guard**: BUG-0028 remains **OPEN**. Backlog AC-1..AC-5 stay `[ ]`. Closure owns the DONE flip. This child did not edit `docs/product/backlog.md`, `docs/engineering/decisions.md`, or `docs/engineering/architecture.md`. BUG-0029 login behavior was not changed. Sibling stories were not mutated.

Consumed execute pair (recomputed MATCH, in TTL at QA start): `record_key=auto-20261013-bug0028|bug|BUG-0028|execute|rp-auto-20261013-bug0028-execute-dev-20261014T192900Z-BUG-0028`; `proof_hash=a7e227b1d956da1dad52a8c6508de69b3213ba712646553eb579c5c7c90a0fad`; `proof_issued_at=2026-10-14T19:29:00Z`; `proof_ttl=2026-10-14T20:29:00Z`; marker `dev-BUG0028-execute-20261014T192900Z-fresh`. Hash via `scripts.token_cost_lib.compute_strict_proof_hash`.

## Test plan

1. Confirm the top `handoffs/resume_brief.md` record is the BUG-0028 execute pair and that its proof hash and TTL are valid.
2. Read S0176 tasks and progress, the top BUG-0028 section of `handoffs/dev_to_qa.md`, and backlog `### BUG-0028` acceptance only.
3. Re-run the five `test_bug0028_*` markers from `standalone`.
4. Check AC-1..AC-5 against `index.ts`, `command-class.ts`, `local-command.ts`, `status-snapshot.ts`, `auth-runtime.ts`, `run.ts`, the Windows and Linux launchers, and both operator READMEs. Do not tick backlog boxes.
5. Treat live browser, API, process, CLI-install, build, and manual-operator probes as `UAT_PROBE_FORBIDDEN` for this ultra-lean contract slice. Record the convergence-smoke surrogate.
6. Leave BUG-0028 OPEN. Do not spawn `/verify-work`.

## Contract markers

Command: `node --experimental-strip-types --test --test-name-pattern "test_bug0028_" tests/contract/bug0028.contract.test.ts` (cwd `standalone`).

| Marker | Result |
|---|---|
| `test_bug0028_help_auth_models_skip_host_and_kernel_barrel` | PASS (1487.2774 ms) |
| `test_bug0028_status_bounded_snapshot_no_scan_session_or_ping` | PASS (300.7731 ms) |
| `test_bug0028_workflow_tokens_keep_production_host` | PASS (3545.6474 ms) |
| `test_bug0028_installed_entrypoint_windows_and_linux` | PASS (295.7427 ms) |
| `test_bug0028_operator_doc_lightweight_versus_full_runtime` | PASS (1.3256 ms) |

**5 pass / 0 fail.** Duration 5749.4224 ms. Exit code 0. `contract_test_failed=0`.

`LINT_COMMAND` and `TYPECHECK_COMMAND` are blank in the runbook, so both are **skipped**. The full kit `TEST_COMMAND` (`tests/run-tests.ps1`) was not re-run. This pass does not claim `tests/report.md` Fail=0.

## AC checklist

| AC | Expectation | Evidence | Result |
|---|---|---|---|
| AC-1 | Help, auth, and models finish locally before RuntimeHost, the Pi kernel, code intelligence, ToolBroker, or SQLite. | `index.ts` statically imports only `./command-class.ts`. Help calls `printCliHelp` and returns. `local-command.ts` dynamically imports `@its-magic/auth-models`, and imports `@its-magic/pi-kernel/auth-runtime` only for `auth list`, `auth login`, `auth logout`, and `models test`. `models list` and `auth migrate` do not. `auth-runtime.ts` has no static import of `kernel.ts` or `./index.ts`. Spawns with the heavy-import forbid did not record `IMPORT_HOST`, `FORBIDDEN`, or `ops.sqlite`. | PASS |
| AC-2 | Bare `status` is a bounded snapshot. A missing or malformed resume brief does not call `createRuntimeHost`. | `status-snapshot.ts` reads `handoffs/resume_brief.md` and the latest token-cost file with `node:fs`. The source does not name `createRuntimeHost`, `walkDocs`, `createOperatorSession`, `createWorkflowEngine`, `resolveOperatorTransport`, `daemon.ping`, or `ops.sqlite`. Missing, thrown, and malformed briefs return null story, sprint, phase, and token fields. A planted project file was not printed. The snapshot has `schema_version: 1`, `read_only: true`, and no `store_path`. | PASS |
| AC-3 | Workflow tokens, including `/status`, still admit production `createRuntimeHost`. `--policy-probe` runs only after admission. | The workflow branch dynamically imports `createRuntimeHost({ projectRoot: process.cwd(), lifetime: "direct-cli" })`, calls `runCliArgv` with the original argv, and `host.dispose()` in `finally`. `classifyCommand(["/status"])` is `workflow`. In `run.ts`, `probePolicy` is reached only after `deps.host?.store`. `--policy-probe` alone stays help. `--policy-probe status` stays the snapshot. `--policy-probe ask` imports the host before `RUN`. | PASS |
| AC-4 | Tests cover Windows and Linux installed entrypoints, and the light paths do not construct code intelligence or scan project files. | `test_bug0028_installed_entrypoint_windows_and_linux` checks `bin/itsm.js`, `.its-magic/bin/itsm` (Linux `#!/usr/bin/env sh` and `exec node`), and `.its-magic/bin/itsm.cmd` (Windows `@echo off` and `node`). The classifier and `index.ts` do not statically import `run.ts`, `@its-magic/runtime-host`, or the pi-kernel barrel. Template CLI twins match. The status spawn does not print a scan marker. | PASS |
| AC-5 | Operator docs distinguish lightweight commands from full-runtime commands. | `its_magic/README.md` and `template/its_magic/README.md` share one paragraph. It names no-argument `itsm`, help, auth, models, and bare `itsm status` as lightweight inspection and auth commands, and names workflow commands (`ask`, `resume`, `pause`, `index`, `app`, `browser`) as the `createRuntimeHost` path. | PASS |

## UAT

Live probe classes `browser_smoke`, `api_health`, `process_health`, `cli_smoke`, `build`, and `manual_operator` are waived with **`UAT_PROBE_FORBIDDEN`**. No `.env` read. No credential fill. No external browser. Convergence surrogate `id=convergence_smoke` result **pass** because `contract_test_failed=0` (`sprints/S0176/uat.json`). The surrogate `evidence_ref` uses the US-0128 contracted token. This pass does not claim a fresh full-harness Fail=0.

## Runtime and generated-test evidence

This slice is the framework kit contract harness, not a generated application stack.

- `runtime_startup_command`: `node --experimental-strip-types --test --test-name-pattern "test_bug0028_" tests/contract/bug0028.contract.test.ts`
- `runtime_stack_profile`: node
- `runtime_mode`: local
- `runtime_health_target`: five `test_bug0028_*` markers
- `runtime_health_result`: 5 pass / 0 fail, exit 0
- `runtime_log_summary`: no critical runtime-log scan; live classes waived
- `runtime_retry_count`: 0
- `runtime_retry_ledger`: none
- `runtime_final_verdict`: pass
- `runtime_reason_code`: contract_tests_primary; live classes `UAT_PROBE_FORBIDDEN`
- `runtime_evidence_refs`: `sprints/S0176/qa-findings.md`, `standalone/tests/contract/bug0028.contract.test.ts`
- `generated_test_stack_profile`: node
- `generated_test_command`: same as `runtime_startup_command`
- `generated_test_result`: pass
- `generated_test_output_ref`: this file, Contract markers
- `generated_test_paths_ref`: `standalone/tests/contract/bug0028.contract.test.ts`
- `generated_test_reason_code`: ok

## Guards held

- BUG-0028 stays OPEN. AC-1..AC-5 stay unchecked.
- BUG-0029 login prompting was not edited. BUG-0026, US-0150, US-0151, US-0154, US-0155, and US-0156 were not mutated.
- No `.env` read, no commit, no push, no npm publish, no `/auto`, no subagent spawn.
- This QA child did **not** spawn `/verify-work`.

## Next

Fresh `/verify-work` for BUG-0028 / S0176. The parent may spawn it after validating this pair. This QA child does not spawn it.
