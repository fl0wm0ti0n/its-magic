# Verify-work findings — S0178 / BUG-0029

## Remediation verification — implementation_loop_index 1 — **VERIFY_PASS**

- **verdict**: **VERIFY_PASS**
- **decision_gate**: false
- **phase_id**: verify-work
- **role**: qa
- **bug_id**: BUG-0029
- **sprint_id**: S0178
- **implementation_loop_index**: 1
- **timestamp**: 2026-10-16T14:37:00Z
- **fresh_context_marker**: `qa-BUG0029-vw-fix1-20261016T143700Z-fresh`
- **model_id**: omit
- **model_provenance**: `provenance=host=cursor;path=.cursor/scratchpad.local.md;step=MODEL_TIER_<PHASE>`
- **CROSS_MODEL_REVIEW**: 0
- **blocking findings**: none
- **fail_closed_reason_code**: none
- **status guard**: BUG-0029 remains **OPEN**. Backlog AC-1..AC-5 stay `[ ]`. This child did not edit `docs/product/backlog.md`, `docs/product/acceptance.md`, `docs/engineering/decisions.md`, or `docs/engineering/architecture.md`. BUG-0026 and the BUG-0028 backlog row were not edited. US-0150, US-0151, US-0154, US-0155, and US-0156 were not reopened. No npm publish, git commit, git push, or `.env` read. This child did not spawn `/release` or `/auto`.

Consumed QA pair (recomputed MATCH via `scripts.token_cost_lib.compute_strict_proof_hash`, second invocation MATCH; in TTL at validation `2026-10-16T14:32:59Z` and at this write `2026-10-16T14:37:00Z`; proof_ttl `2026-10-16T15:26:04Z`): `record_key=auto-20261016-bug0029|bug|BUG-0029|qa|rp-auto-20261016-bug0029-qa-qa-20261016T142604Z-BUG-0029-fix1`; `proof_hash=21eddcac75b994e383ca73d7449c0c4ed4eba1211b605b1c762c160a9e087952`; `proof_issued_at=2026-10-16T14:26:04Z`; marker `qa-BUG0029-qa-fix1-20261016T142604Z-fresh`.

### Test plan

1. Recompute the QA pair hash and confirm TTL has not elapsed. Stop `RESUME_BRIEF_STALE` on mismatch or elapsed TTL.
2. Confirm `tests/report.md` `2026-10-16T14:15:41Z` is Pass 880 / Fail 0 and that the eight previously failing harness rows are `[PASS]`. Re-run those commands before relying on the report.
3. Re-run `python scripts/validate_readme_feature_coverage.py --repo . --enforce` and confirm there is no `README_FEATURE_COVERAGE_GAP:BUG-0028`.
4. Re-run the seven `test_bug0029_*` markers on Windows and Linux.
5. Confirm UAT still covers AC-1..AC-5. Leave live global-install probes `UAT_PROBE_FORBIDDEN`.
6. Leave BUG-0029 OPEN. Do not tick AC-1..AC-5. Do not spawn `/release` or `/auto`.

### Harness and README

`tests/report.md` timestamp `2026-10-16T14:15:41Z`. Counted **880** `- [PASS]` rows and **0** `- [FAIL]` rows. Header `Pass: 880` / `Fail: 0`. This pass did not rewrite the report.

| Report line | Row | Report | This re-run |
|---|---|---|---|
| L785 | slim auto command contract markers pass | PASS | `python tests/auto_command_contract_test.py` exit 0, 151 tests OK, including `test_template_scratchpad_baseline_literal_parity_active` |
| L815 | validate_readme_feature_coverage repo --report passes | PASS | `--report` exit 0 |
| L816 | validate_readme_feature_coverage report idempotent | PASS | second `--report` exit 0; SHA-256 of the two captured reports match (`4043E854B184E6917097605FFC9576648BA384448CDAC373A5950BCDCA918FC3`) |
| L843 | check_intake_template_parity --scope=dev-environment passes | PASS | `--scope=dev-environment` exit 0 (`INTAKE_TEMPLATE_PARITY_OK`) |
| L846 | check_intake_template_parity --scope=dev-environment passes (US-0099) | PASS | same command as L843, exit 0 |
| L850 | check_intake_template_parity --scope=model-tier passes (US-0101) | PASS | `--scope=model-tier` exit 0 |
| L853 | check_intake_template_parity --scope=model-tier-overrides passes (US-0102) | PASS | `--scope=model-tier-overrides` exit 0 |
| L855 | check_intake_template_parity --scope=arch-linkage passes (US-0129) | PASS | `--scope=arch-linkage` exit 0 |

`python scripts/validate_readme_feature_coverage.py --repo . --enforce` exit 0. `status=PASS`. `coverage_missing=[]`. `coverage_total=52`. `coverage_present` includes `BUG-0028`. `[README_FEATURE_COVERAGE_VALIDATE_OK]`. No `README_FEATURE_COVERAGE_GAP:BUG-0028`.

### Contract markers

Command: `node --experimental-strip-types --test --test-name-pattern "test_bug0029_" tests/contract/bug0029.contract.test.ts` (cwd `standalone`).

Windows Node v24.19.0, exit 0, **7 pass / 0 fail**, duration_ms 154.4677.

| Marker | Windows | Linux Node v24.19.0 |
|---|---|---|
| `test_bug0029_masked_tty_does_not_echo_or_argv` | PASS (5.0764 ms) | PASS (14.09458 ms) |
| `test_bug0029_api_key_stdin_one_line` | PASS (2.9806 ms) | PASS (14.322927 ms) |
| `test_bug0029_non_tty_without_flag_is_nonzero` | PASS (1.9228 ms) | PASS (0.999878 ms) |
| `test_bug0029_cancel_empty_invalid_persist_never_configured` | PASS (6.6199 ms) | PASS (2.700572 ms) |
| `test_bug0029_success_only_after_check_auth` | PASS (2.4157 ms) | PASS (1.109606 ms) |
| `test_bug0029_list_logout_migrate_unchanged` | PASS (3.609 ms) | PASS (1.413312 ms) |
| `test_bug0029_secret_absent_outside_owned_store` | PASS (8.7128 ms) | PASS (0.860939 ms) |

Linux host: WSL, `/home/flow/bug0026-toolchain/node-v24.19.0-linux-x64/bin/node` v24.19.0, **7 pass / 0 fail**, duration_ms 268.94279, exit 0. `contract_test_failed=0`.

### UAT

UAT-1..UAT-5 still cover AC-1..AC-5. Counts stay **6 pass / 0 fail**, including `convergence_smoke` **pass**. Live probe classes stay **`UAT_PROBE_FORBIDDEN`**. No live global-install probe.

### Next

Fresh `/release` for BUG-0029 / S0178. The parent may spawn it after validating this pair. This child does not spawn it. `next_scheduled_phase=release`. `next_scheduled_role=release`.

## Prior verify-work — 2026-10-16T00:05:15Z — **VERIFY_PASS**

- **verdict**: **VERIFY_PASS**
- **decision_gate**: false
- **phase_id**: verify-work
- **role**: qa
- **bug_id**: BUG-0029
- **sprint_id**: S0178
- **timestamp**: 2026-10-16T00:05:15Z
- **fresh_context_marker**: `qa-BUG0029-vw-20261016T000515Z-fresh`
- **model_id**: omit
- **model_provenance**: `provenance=host=cursor;path=.cursor/scratchpad.local.md;step=MODEL_TIER_<PHASE>`
- **CROSS_MODEL_REVIEW**: 0
- **blocking findings**: none
- **fail_closed_reason_code**: none
- **status guard**: BUG-0029 remains **OPEN**. Backlog AC-1..AC-5 stay `[ ]`. The acceptance row stays `[ ]`. Closure owns the DONE flip. This child did not edit `docs/product/backlog.md`, `docs/product/acceptance.md`, `docs/engineering/decisions.md`, or `docs/engineering/architecture.md`. BUG-0026 and BUG-0028 were not edited. US-0150, US-0151, US-0154, US-0155, and US-0156 were not reopened.

Consumed QA pair (recomputed MATCH at 2026-10-16T00:02:16Z, still inside TTL through 2026-10-16T00:55:00Z): `record_key=auto-20261016-bug0029|bug|BUG-0029|qa|rp-auto-20261016-bug0029-qa-qa-20261015T235500Z-BUG-0029`; `proof_hash=4da3c779d1a9ff50cf54df3cd589f99c7ca885b859b835a845eb9a008f51bc88`; `proof_issued_at=2026-10-15T23:55:00Z`; marker `qa-BUG0029-qa-20261015T235500Z-fresh`. Hash via `scripts.token_cost_lib.compute_strict_proof_hash`. Second invocation MATCH.

## Test plan

1. Recompute the QA pair hash and confirm TTL has not elapsed. Fail closed `RESUME_BRIEF_STALE` on mismatch or elapsed TTL.
2. Narrow-read phase context, S0178 tasks, QA findings, and the UAT placeholders. Read backlog `### BUG-0029` acceptance only. Do not tick boxes.
3. Independently re-run the seven `test_bug0029_*` markers from `standalone` on Windows and on Linux.
4. Assess AC-1..AC-5 against `cli.ts`, `local-command.ts`, `run.ts`, `command-class.ts`, both README `itsm` paragraphs, and the template twins. Do not tick backlog boxes.
5. Treat live browser, API, process, CLI-install, build, and manual-operator probes as `UAT_PROBE_FORBIDDEN`. A live installed-binary probe that would publish or mutate a global install was not run. Record the convergence-smoke surrogate because `contract_test_failed=0`.
6. Leave BUG-0029 OPEN. Do not spawn `/release` or `/auto`.

## Contract markers

Command: `node --experimental-strip-types --test --test-name-pattern "test_bug0029_" tests/contract/bug0029.contract.test.ts` (cwd `standalone`).

Windows Node v24.19.0, exit 0, **7 pass / 0 fail**, duration_ms 152.6454.

| Marker | Windows | Linux Node v24.19.0 |
|---|---|---|
| `test_bug0029_masked_tty_does_not_echo_or_argv` | PASS (4.8059 ms) | PASS (12.153856 ms) |
| `test_bug0029_api_key_stdin_one_line` | PASS (2.7321 ms) | PASS (11.817991 ms) |
| `test_bug0029_non_tty_without_flag_is_nonzero` | PASS (1.8878 ms) | PASS (0.633102 ms) |
| `test_bug0029_cancel_empty_invalid_persist_never_configured` | PASS (5.8874 ms) | PASS (2.34054 ms) |
| `test_bug0029_success_only_after_check_auth` | PASS (2.3045 ms) | PASS (0.938959 ms) |
| `test_bug0029_list_logout_migrate_unchanged` | PASS (4.1622 ms) | PASS (1.221125 ms) |
| `test_bug0029_secret_absent_outside_owned_store` | PASS (4.3372 ms) | PASS (0.76292 ms) |

Linux host: WSL, `/home/flow/bug0026-toolchain/node-v24.19.0-linux-x64/bin/node` v24.19.0, **7 pass / 0 fail**, duration_ms 235.092463, exit 0. `contract_test_failed=0`. No template copy of the contract file exists.

This pass does not claim a fresh full-harness `tests/report.md` Fail=0. Generated-test evidence already recorded in `sprints/S0178/qa-findings.md` and the test scope in `sprints/S0178/summary.md` remains the contract file above.

## AC checklist

Assessment only. Backlog boxes stay `[ ]`.

| AC | Expectation | Evidence | Result |
|---|---|---|---|
| AC-1 | Interactive TTY API-key login returns one masked secret. The secret is not echoed, logged, or placed in argv. Both entry paths pass the helper. | `readMaskedTtySecret` uses `setRawMode(true)`, writes only the prompt, submits on Enter, cancels on Ctrl+C, and restores the previous raw mode in `finally`. `local-command.ts` and the `run.ts` auth branch pass `prompt: (message) => readMaskedTtySecret(message)`. The helper file names neither `@its-magic/runtime-host` nor `@its-magic/pi-kernel`. Select prompts still return an option id. Marker `test_bug0029_masked_tty_does_not_echo_or_argv` passed on Windows and Linux. | PASS |
| AC-2 | `--api-key-stdin` reads one stdin line. Argv forms are rejected. Non-TTY login without the flag is `AUTH_LOGIN_TTY_REQUIRED`. Help and both READMEs name the pipe shape. | The flag takes no value. `--api-key`, `--api-key=`, and `--api-key-stdin <value>` return usage and do not call `service.login`. One trailing newline is stripped. Non-TTY `api_key` login exits 1 before `service.login`. OAuth CI refusal stays `oauth login is not available in CI`. `printCliHelp`, `run.ts` help, and both README `itsm` paragraphs contain `itsm auth login openai --type api_key --api-key-stdin`. | PASS |
| AC-3 | Cancel, empty, invalid, and sync failure exit 1 with a fixed token and never emit configured JSON. | Undefined or aborted secret prompts are `AUTH_LOGIN_CANCELLED`. Empty or whitespace is `AUTH_LOGIN_EMPTY`. A non-sync throw, null `checkAuth`, or the wrong type is `AUTH_LOGIN_INVALID`. `CredentialSynchronizationError` is `AUTH_SYNC_FAILED`. `loginDiagnostic` returns those tokens. Stderr does not print `err.message`. `redactLine` remains a second pass. | PASS |
| AC-4 | Configured JSON is emitted only after stored `api_key` verification. List, logout, and migrate stay unchanged. | After `adapter.login`, `service.checkAuth(provider)` must return a non-null result whose `type` matches the request. Only then the handler writes `{"provider":"<id>","auth":"configured"}` and returns 0. `allowModelNetwork` stays false on `ensureRuntime`. `auth list`, `auth logout`, and `auth migrate --from-pi` keep their current stdout and exit codes. Migration does not call login. | PASS |
| AC-5 | Contract markers cover masked TTY input, stdin input, cancellation, redaction, false-success prevention, and no secret outside the owned store, on Windows and Linux. | The seven markers above passed on Windows Node v24.19.0 and Linux Node v24.19.0. No new PTY dependency. No template copy of the contract file. Backlog AC-5 stays `[ ]`. | PASS |

Template twins of `cli.ts`, `index.ts`, `local-command.ts`, `run.ts`, `command-class.ts`, and `its_magic/README.md` are byte-identical with their `template/` copies. This assessment does not tick the backlog boxes.

## UAT

Live probe classes `browser_smoke`, `api_health`, `process_health`, `cli_smoke`, `build`, and `manual_operator` are waived with **`UAT_PROBE_FORBIDDEN`**. No `.env` read. No credential fill. No external browser. No npm publish. Convergence surrogate `id=convergence_smoke` result **pass** because `contract_test_failed=0` (`sprints/S0178/uat.json`). The surrogate `evidence_ref` uses the US-0128 contracted token. Counts: **6 pass / 0 fail**.

## Guards held

- BUG-0029 stays OPEN. AC-1..AC-5 stay unchecked.
- BUG-0026, BUG-0028, US-0150, US-0151, US-0154, US-0155, and US-0156 were not mutated.
- No `.env` read, no commit, no push, no npm publish, no `/auto`, no subagent spawn.
- This verify-work child did **not** spawn `/release`.

## Next

Fresh `/release` for BUG-0029 / S0178. The parent may spawn it after validating this pair. This child does not spawn it.
