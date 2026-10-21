# QA Findings — S0178 / BUG-0029

## Remediation pass — implementation_loop_index 1 — **QA_PASS**

- **verdict**: **QA_PASS**
- **decision_gate**: false
- **blocking findings**: 0
- **phase_id**: qa
- **role**: qa
- **bug_id**: BUG-0029
- **sprint_id**: S0178
- **implementation_loop_index**: 1
- **timestamp**: 2026-10-16T14:26:04Z
- **fresh_context_marker**: `qa-BUG0029-qa-fix1-20261016T142604Z-fresh`
- **model_id**: omit
- **model_provenance**: `provenance=host=cursor;path=.cursor/scratchpad.local.md;step=MODEL_TIER_<PHASE>`
- **CROSS_MODEL_REVIEW**: 0
- **status guard**: BUG-0029 remains **OPEN**. Backlog AC-1..AC-5 stay `[ ]`. This child did not edit `docs/product/backlog.md`, `docs/product/acceptance.md`, `docs/engineering/decisions.md`, or `docs/engineering/architecture.md`. BUG-0026 and the BUG-0028 backlog row were not edited. US-0150, US-0151, US-0154, US-0155, and US-0156 were not reopened. No npm publish, git commit, git push, or `.env` read.

Consumed execute pair (recomputed MATCH via `scripts.token_cost_lib.compute_strict_proof_hash`, second invocation MATCH; in TTL at QA start `2026-10-16T14:22:54Z` and at this write `2026-10-16T14:26:04Z`; proof_ttl `2026-10-16T15:17:02Z`): `record_key=auto-20261016-bug0029|bug|BUG-0029|execute|rp-auto-20261016-bug0029-execute-dev-20261016T141702Z-BUG-0029-fix1`; `proof_hash=a44e8f8aea09d4075f6555a1ccc381bb6de2ab0edb0514b124322f391ecb5cd3`; `proof_issued_at=2026-10-16T14:17:02Z`; marker `dev-BUG0029-execute-fix1-20261016T141702Z-fresh`.

## Test plan

1. Recompute the execute pair hash and confirm TTL has not elapsed. Stop `RESUME_BRIEF_STALE` on mismatch or elapsed TTL.
2. Confirm `tests/report.md` `2026-10-16T14:15:41Z` is Pass 880 / Fail 0, and that the eight previously failing harness rows are `[PASS]`.
3. Re-run those eight underlying commands, `python scripts/validate_readme_feature_coverage.py --repo . --enforce`, and the scratchpad byte compare. Confirm live `AUTO_BACKLOG_DRAIN` stays `0` and BUG-0028 coverage exists without editing the BUG-0028 backlog row.
4. Re-run the seven `test_bug0029_*` markers on Windows and Linux.
5. Leave BUG-0029 OPEN. Do not tick AC-1..AC-5. Do not spawn `/verify-work` or `/execute`.

## Harness confirmation

`tests/report.md` timestamp `2026-10-16T14:15:41Z`. QA counted **880** `- [PASS]` rows and **0** `- [FAIL]` rows. Header `Pass: 880` / `Fail: 0`. This pass did not rewrite the report.

| Report line | Row | Report | QA re-run |
|---|---|---|---|
| L785 | slim auto command contract markers pass | PASS | `python tests/auto_command_contract_test.py` exit 0, 151 tests OK, including `test_template_scratchpad_baseline_literal_parity_active` |
| L815 | validate_readme_feature_coverage repo --report passes | PASS | `--report` exit 0 |
| L816 | validate_readme_feature_coverage report idempotent | PASS | second `--report` exit 0; SHA-256 of the two reports match |
| L843 | check_intake_template_parity --scope=dev-environment passes | PASS | `--scope=dev-environment` exit 0 (`INTAKE_TEMPLATE_PARITY_OK`) |
| L846 | check_intake_template_parity --scope=dev-environment passes (US-0099) | PASS | same command as L843, exit 0 |
| L850 | check_intake_template_parity --scope=model-tier passes (US-0101) | PASS | `--scope=model-tier` exit 0 |
| L853 | check_intake_template_parity --scope=model-tier-overrides passes (US-0102) | PASS | `--scope=model-tier-overrides` exit 0 |
| L855 | check_intake_template_parity --scope=arch-linkage passes (US-0129) | PASS | `--scope=arch-linkage` exit 0 |

## README coverage and scratchpad

`python scripts/validate_readme_feature_coverage.py --repo . --enforce` exit 0. `status=PASS`. `coverage_missing=[]`. `coverage_total=52`. `coverage_present` includes `BUG-0028`. `[README_FEATURE_COVERAGE_VALIDATE_OK]`.

BUG-0028 text is under `## Features` in `its_magic/README.md` (line 100, between the Features heading and `## Setup`) and in `template/its_magic/README.md`, and under `## Architecture notes` in `docs/developer/README.md` (line 112). Backlog `### BUG-0028` remains `Status: DONE`. This pass did not edit that row.

Live `.cursor/scratchpad.md` and `template/.cursor/scratchpad.md` are byte-identical: 36334 bytes, SHA-256 `0e25e5c40737bb1abf3ac317ddd3b97ce6b289a0cdb922b432b2265b07fdd19f`. Both set `AUTO_BACKLOG_DRAIN=0`, `AUTO_BUG_QUEUE=1`, `AUTO_BUG_TARGET=all-open`.

`python scripts/check-user-visible-metadata.py --repo .` exit 0. `LINT_COMMAND` and `TYPECHECK_COMMAND` are blank, so both are **skipped**. `SECURITY_REVIEW`, `CROSS_REPO_OBSERVABILITY`, `COMPONENT_SCOPE_MODE`, `SPEC_PACK_MODE`, `USER_GUIDE_MODE`, and `REMOTE_EXECUTION` are 0, so those optional checks add no required overhead.

## Contract markers

Command: `node --experimental-strip-types --test --test-name-pattern "test_bug0029_" tests/contract/bug0029.contract.test.ts` (cwd `standalone`).

Windows Node v24.19.0, exit 0, **7 pass / 0 fail**, duration_ms 174.1134.

| Marker | Windows | Linux Node v24.19.0 |
|---|---|---|
| `test_bug0029_masked_tty_does_not_echo_or_argv` | PASS (5.692 ms) | PASS (14.721706 ms) |
| `test_bug0029_api_key_stdin_one_line` | PASS (3.2041 ms) | PASS (17.286706 ms) |
| `test_bug0029_non_tty_without_flag_is_nonzero` | PASS (3.1171 ms) | PASS (1.113286 ms) |
| `test_bug0029_cancel_empty_invalid_persist_never_configured` | PASS (7.8301 ms) | PASS (2.804645 ms) |
| `test_bug0029_success_only_after_check_auth` | PASS (3.0818 ms) | PASS (1.038757 ms) |
| `test_bug0029_list_logout_migrate_unchanged` | PASS (3.5541 ms) | PASS (1.285324 ms) |
| `test_bug0029_secret_absent_outside_owned_store` | PASS (9.7231 ms) | PASS (1.421417 ms) |

Linux host: WSL. Bare `node` is not on the default PATH. The pinned `/home/flow/bug0026-toolchain/node-v24.19.0-linux-x64/bin/node` v24.19.0 ran **7 pass / 0 fail**, duration_ms 473.786894, exit 0. `contract_test_failed=0`.

## UAT

Live probe classes `browser_smoke`, `api_health`, `process_health`, `cli_smoke`, `build`, and `manual_operator` stay waived with **`UAT_PROBE_FORBIDDEN`** in `sprints/S0178/uat.json`. No `.env` read. No credential fill. No external browser. Convergence surrogate `id=convergence_smoke` remains **pass** because `contract_test_failed=0`. This remediation pass did not rewrite `uat.json`. Counts stay **6 pass / 0 fail**.

## Runtime and generated-test evidence

This slice is the framework kit contract harness, not a generated application stack.

- `runtime_startup_command`: `node --experimental-strip-types --test --test-name-pattern "test_bug0029_" tests/contract/bug0029.contract.test.ts`
- `runtime_stack_profile`: node
- `runtime_mode`: local
- `runtime_health_target`: seven `test_bug0029_*` markers on Windows and Linux, plus the eight previously failing harness rows
- `runtime_health_result`: Windows 7 pass / 0 fail (duration_ms 174.1134); Linux 7 pass / 0 fail (duration_ms 473.786894); harness report Pass 880 / Fail 0; README `--enforce` exit 0
- `runtime_log_summary`: no critical runtime-log scan; live classes waived
- `runtime_retry_count`: 0
- `runtime_retry_ledger`: none
- `runtime_final_verdict`: pass
- `runtime_reason_code`: contract_tests_primary; live classes `UAT_PROBE_FORBIDDEN`
- `runtime_evidence_refs`: `sprints/S0178/qa-findings.md`, `tests/report.md`, `standalone/tests/contract/bug0029.contract.test.ts`
- `generated_test_stack_profile`: node
- `generated_test_command`: same as `runtime_startup_command`
- `generated_test_result`: pass
- `generated_test_output_ref`: this file, Contract markers
- `generated_test_paths_ref`: `standalone/tests/contract/bug0029.contract.test.ts`
- `generated_test_reason_code`: ok

## Guards held

- BUG-0029 stays OPEN. AC-1..AC-5 stay unchecked.
- BUG-0026, the BUG-0028 backlog row, US-0150, US-0151, US-0154, US-0155, and US-0156 were not mutated.
- No `.env` read, no commit, no push, no npm publish, no `/auto`, no subagent spawn.
- This QA child did **not** spawn `/verify-work` or `/execute`.

## Next

Fresh `/verify-work` for BUG-0029 / S0178. The parent may spawn it after validating this pair. This QA child does not spawn it. `next_scheduled_phase=verify-work`. `next_scheduled_role=qa`.

## Prior QA pass — 2026-10-15T23:55:00Z — **QA_PASS**

- **verdict**: **QA_PASS**
- **decision_gate**: false
- **phase_id**: qa
- **role**: qa
- **bug_id**: BUG-0029
- **sprint_id**: S0178
- **timestamp**: 2026-10-15T23:55:00Z
- **fresh_context_marker**: `qa-BUG0029-qa-20261015T235500Z-fresh`
- **model_id**: omit
- **model_provenance**: `provenance=host=cursor;path=.cursor/scratchpad.local.md;step=MODEL_TIER_<PHASE>`
- **CROSS_MODEL_REVIEW**: 0
- **blocking findings**: none
- **status guard**: BUG-0029 remains **OPEN**. Backlog AC-1..AC-5 stay `[ ]`. Closure owns the DONE flip. This child did not edit `docs/product/backlog.md`, `docs/product/acceptance.md`, `docs/engineering/decisions.md`, or `docs/engineering/architecture.md`. BUG-0026 and BUG-0028 were not edited. US-0150, US-0151, US-0154, US-0155, and US-0156 were not reopened.

Consumed execute pair (recomputed MATCH, in TTL at QA start 2026-10-15T23:52:23Z and still in TTL at this write 2026-10-15T23:55:26Z): `record_key=auto-20261016-bug0029|bug|BUG-0029|execute|rp-auto-20261016-bug0029-execute-dev-20261015T233722Z-BUG-0029`; `proof_hash=40fff8bc1786f7caba40f909fd2ffc21b38c8a83f9cf94c0ddc380863cb48abe`; `proof_issued_at=2026-10-15T23:37:22Z`; `proof_ttl=2026-10-16T00:37:22Z`; marker `dev-BUG0029-execute-20261015T233722Z-fresh`. Hash via `scripts.token_cost_lib.compute_strict_proof_hash`.

## Test plan

1. Recompute the execute pair hash and confirm TTL has not elapsed. Fail closed `RESUME_BRIEF_STALE` on mismatch or elapsed TTL.
2. Read S0178 tasks, the top BUG-0029 section of `handoffs/dev_to_qa.md`, architecture `# BUG-0029`, and backlog `### BUG-0029` acceptance only.
3. Re-run the seven `test_bug0029_*` markers from `standalone` on Windows and on Linux, matching the execute evidence.
4. Check AC-1..AC-5 against `cli.ts`, `local-command.ts`, `run.ts`, `command-class.ts`, both README `itsm` paragraphs, and the template twins. Do not tick backlog boxes.
5. Treat live browser, API, process, CLI-install, build, and manual-operator probes as `UAT_PROBE_FORBIDDEN` for this ultra-lean contract slice. Record the convergence-smoke surrogate.
6. Leave BUG-0029 OPEN. Do not spawn `/verify-work` or `/execute`.

## Contract markers

Command: `node --experimental-strip-types --test --test-name-pattern "test_bug0029_" tests/contract/bug0029.contract.test.ts` (cwd `standalone`).

Windows Node v24.19.0, exit 0, **7 pass / 0 fail**, duration_ms 164.1031.

| Marker | Windows | Linux Node v24.19.0 |
|---|---|---|
| `test_bug0029_masked_tty_does_not_echo_or_argv` | PASS (4.9089 ms) | PASS (11.696902 ms) |
| `test_bug0029_api_key_stdin_one_line` | PASS (3.0026 ms) | PASS (12.334805 ms) |
| `test_bug0029_non_tty_without_flag_is_nonzero` | PASS (2.1121 ms) | PASS (0.634482 ms) |
| `test_bug0029_cancel_empty_invalid_persist_never_configured` | PASS (6.6071 ms) | PASS (2.293591 ms) |
| `test_bug0029_success_only_after_check_auth` | PASS (2.6975 ms) | PASS (0.916709 ms) |
| `test_bug0029_list_logout_migrate_unchanged` | PASS (3.6698 ms) | PASS (1.447452 ms) |
| `test_bug0029_secret_absent_outside_owned_store` | PASS (4.1793 ms) | PASS (0.728551 ms) |

Linux host: WSL, `/home/flow/bug0026-toolchain/node-v24.19.0-linux-x64/bin/node` v24.19.0, **7 pass / 0 fail**, duration_ms 245.328972, exit 0. `contract_test_failed=0`. No template copy of the contract file exists.

`LINT_COMMAND` and `TYPECHECK_COMMAND` are blank in the runbook, so both are **skipped**. The full kit `TEST_COMMAND` (`tests/run-tests.ps1`) was not re-run. This pass does not claim `tests/report.md` Fail=0. `python scripts/check-user-visible-metadata.py --repo .` exited 0. `SECURITY_REVIEW`, `CROSS_REPO_OBSERVABILITY`, `COMPONENT_SCOPE_MODE`, `SPEC_PACK_MODE`, `USER_GUIDE_MODE`, and `REMOTE_EXECUTION` are 0, so those optional checks add no required overhead.

## AC checklist

| AC | Expectation | Evidence | Result |
|---|---|---|---|
| AC-1 | Interactive TTY API-key login returns one masked secret. The secret is not echoed, logged, or placed in argv. Both entry paths pass the helper. | `readMaskedTtySecret` uses `setRawMode(true)`, writes only the prompt, submits on Enter, cancels on Ctrl+C, and restores the previous raw mode in `finally`. `local-command.ts` and the `run.ts` auth branch pass `prompt: (message) => readMaskedTtySecret(message)`. The helper file names neither `@its-magic/runtime-host` nor `@its-magic/pi-kernel`. Select prompts still return an option id and are not stored as the key. | PASS |
| AC-2 | `--api-key-stdin` reads one stdin line. Argv forms are rejected. Non-TTY login without the flag is `AUTH_LOGIN_TTY_REQUIRED`. Help and both READMEs name the pipe shape. | The flag takes no value. `--api-key`, `--api-key=`, and `--api-key-stdin <value>` return usage and do not call `service.login`. One trailing newline is stripped. Non-TTY `api_key` login exits 1 before `service.login`. OAuth CI refusal stays `oauth login is not available in CI`. `printCliHelp`, `run.ts` help, and both README `itsm` paragraphs contain `itsm auth login openai --type api_key --api-key-stdin`. | PASS |
| AC-3 | Cancel, empty, invalid, and sync failure exit 1 with a fixed token and never emit configured JSON. | Undefined or aborted secret prompts are `AUTH_LOGIN_CANCELLED`. Empty or whitespace is `AUTH_LOGIN_EMPTY` and is not stored. A non-sync throw, null `checkAuth`, or the wrong type is `AUTH_LOGIN_INVALID`. `CredentialSynchronizationError` is `AUTH_SYNC_FAILED`. `loginDiagnostic` returns those tokens. Stderr does not print `err.message`. `redactLine` remains a second pass. | PASS |
| AC-4 | Configured JSON is emitted only after stored `api_key` verification. List, logout, and migrate stay unchanged. | After `adapter.login`, `service.checkAuth(provider)` must return a non-null result whose `type` matches the request. Only then the handler writes `{"provider":"<id>","auth":"configured"}` and returns 0. `allowModelNetwork` stays false. `auth list`, `auth logout`, `auth migrate --from-pi`, `models list`, and `models test` keep their current stdout and exit codes. Migration does not call login. | PASS |
| AC-5 | Contract markers cover masked TTY input, stdin input, cancellation, redaction, false-success prevention, and no secret outside the owned store, on Windows and Linux. | The seven markers above passed on Windows Node v24.19.0 and Linux Node v24.19.0. The owned store is the `authDirOverride` path. Project files and a sibling decoy do not contain the secret. No new PTY dependency. Backlog AC-5 stays `[ ]`. | PASS |

Template twins of `cli.ts`, `index.ts`, `local-command.ts`, `run.ts`, `command-class.ts`, and `its_magic/README.md` are byte-identical with their `template/` copies. This QA assessment does not tick the backlog boxes.

## UAT

Live probe classes `browser_smoke`, `api_health`, `process_health`, `cli_smoke`, `build`, and `manual_operator` are waived with **`UAT_PROBE_FORBIDDEN`**. No `.env` read. No credential fill. No external browser. Convergence surrogate `id=convergence_smoke` result **pass** because `contract_test_failed=0` (`sprints/S0178/uat.json`). The surrogate `evidence_ref` uses the US-0128 contracted token. This pass does not claim a fresh full-harness Fail=0 and does not claim verify-work PASS. Counts: **6 pass / 0 fail** (five AC steps plus the surrogate).

## Runtime and generated-test evidence

This slice is the framework kit contract harness, not a generated application stack.

- `runtime_startup_command`: `node --experimental-strip-types --test --test-name-pattern "test_bug0029_" tests/contract/bug0029.contract.test.ts`
- `runtime_stack_profile`: node
- `runtime_mode`: local
- `runtime_health_target`: seven `test_bug0029_*` markers on Windows and Linux
- `runtime_health_result`: Windows 7 pass / 0 fail (duration_ms 164.1031); Linux 7 pass / 0 fail (duration_ms 245.328972); both exit 0
- `runtime_log_summary`: no critical runtime-log scan; live classes waived
- `runtime_retry_count`: 0
- `runtime_retry_ledger`: none
- `runtime_final_verdict`: pass
- `runtime_reason_code`: contract_tests_primary; live classes `UAT_PROBE_FORBIDDEN`
- `runtime_evidence_refs`: `sprints/S0178/qa-findings.md`, `standalone/tests/contract/bug0029.contract.test.ts`
- `generated_test_stack_profile`: node
- `generated_test_command`: same as `runtime_startup_command`
- `generated_test_result`: pass
- `generated_test_output_ref`: this file, Contract markers
- `generated_test_paths_ref`: `standalone/tests/contract/bug0029.contract.test.ts`
- `generated_test_reason_code`: ok

## Guards held

- BUG-0029 stays OPEN. AC-1..AC-5 stay unchecked.
- BUG-0026, BUG-0028, US-0150, US-0151, US-0154, US-0155, and US-0156 were not mutated.
- No `.env` read, no commit, no push, no npm publish, no `/auto`, no subagent spawn.
- This QA child did **not** spawn `/verify-work` or `/execute`.

## Next

Fresh `/verify-work` for BUG-0029 / S0178. The parent may spawn it after validating this pair. This QA child does not spawn it.
