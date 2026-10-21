# Sprint S0178 progress — BUG-0029

- status: **EXECUTE_PASS** (implementation loop 1, after RELEASE_FAIL)
- verdict: release gates cleared; next scheduled phase is qa
- tasks: T-anch and T-001..T-005 are checked
- bug: BUG-0029 remains **OPEN**. AC-1..AC-5 remain unchecked. Closure owns the DONE flip.
- plan-verify: SKIPPED (`ultra_lean_not_in_resolved_phase_plan`)
- fresh_context_marker: `dev-BUG0029-execute-fix1-20261016T141702Z-fresh`
- prior execute marker retained: `dev-BUG0029-execute-20261015T233722Z-fresh`
- This execute child did not spawn `/qa`, `/release`, or `/closure`.

## Remediation (implementation_loop_index=1)

- Consumed release proof `rp-auto-20261016-bug0029-release-release-20261016T002612Z-BUG-0029` is past TTL (issued `2026-10-16T00:26:12Z`, ttl until `2026-10-16T01:26:12Z`). This spawn is a new remediation, not closure.
- Template `.cursor/scratchpad.md` now byte-matches the live scratchpad. Live `AUTO_BACKLOG_DRAIN` stays `0`.
- BUG-0028 coverage is under `## Features` in `its_magic/README.md` and its template mirror, and under `## Architecture notes` in `docs/developer/README.md`. The BUG-0028 backlog row was not edited.
- `tests/report.md` timestamp `2026-10-16T14:15:41Z`: Pass 880 / Fail 0. `python scripts/validate_readme_feature_coverage.py --repo . --enforce` exit 0.

## Task log

- **T-anch** (no product change): BUG-0029 was OPEN and AC-1..AC-5 were unchecked. `runLocalCommand` and the `run.ts` auth branch called login with no `io`. A non-select secret prompt returned `undefined`, and the handler still wrote `{"auth":"configured"}` and returned 0. No `--api-key-stdin` flag existed. `checkAuth` was not the success gate. S0176 is BUG-0028, S0177 is BUG-0026, and this sprint is S0178. BUG-0026, BUG-0028, US-0150, US-0151, US-0154, US-0155, and US-0156 were not mutated.
- **T-001**: `readMaskedTtySecret` in `standalone/packages/auth-models/src/cli.ts` uses raw mode, writes no secret characters, submits on Enter, cancels on Ctrl+C, and restores the previous raw mode. `local-command.ts` and `run.ts` pass it as `io.prompt`. Template twins match. The helper imports neither `@its-magic/runtime-host` nor the pi-kernel barrel.
- **T-002**: `--api-key-stdin` reads one stdin line and strips one trailing newline. `--api-key <value>` and `--api-key=` are rejected without echoing the value. Non-TTY `api_key` login without the flag exits 1 with `AUTH_LOGIN_TTY_REQUIRED` and does not call `service.login`. Help text and both README `itsm` paragraphs name `itsm auth login openai --type api_key --api-key-stdin`. OAuth CI refusal is unchanged.
- **T-003**: Cancel and abort are `AUTH_LOGIN_CANCELLED`. Empty or whitespace-only is `AUTH_LOGIN_EMPTY` and is not passed to the store. A non-sync throw, or `checkAuth` null or the wrong type, is `AUTH_LOGIN_INVALID`. `CredentialSynchronizationError` stays `AUTH_SYNC_FAILED`. Each exits 1 and does not print configured JSON. Stderr is the fixed token only.
- **T-004**: Configured JSON is written only after `checkAuth` returns a stored credential whose `type` is the requested type. `auth list`, `auth logout`, and `auth migrate --from-pi` keep their current stdout and exit codes. `models list` and `models test` stay unchanged.
- **T-005**: `standalone/tests/contract/bug0029.contract.test.ts` has the seven markers. Windows Node v24.19.0: 7 pass / 0 fail (duration_ms 148.5945). Linux Node v24.19.0 under WSL: 7 pass / 0 fail (duration_ms 251.266733). No template copy of the contract file. AC-5 is not ticked. BUG-0029 is not DONE.
