# Sprint S0178 summary — BUG-0029

## Context pack pointer (refresh-context 2026-10-16)

- Segment **complete**: REFRESH_CONTEXT_PASS @ `2026-10-16T15:03:00Z`; `orchestrator_run_id=auto-20261016-bug0029`; closure pair consumed (no re-flip).
- **BUG-0029 DONE**; **S0178 released**; AC-1..AC-5 checked; `handoffs/releases/S0178-release-notes.md`.
- Harness provenance: `tests/report.md` `2026-10-16T14:52:23Z` Pass 880 / Fail 0; seven `test_bug0029_*` 7/0.
- **BUG-0026** stays OPEN (release-blocked; out of scope for drain). Do not spawn `/auto` from this segment.

- sprint_id: S0178
- bug_id: BUG-0029
- status: REFRESH_CONTEXT_PASS / segment complete (implementation loop 1)
- tasks: T-anch and T-001..T-005 checked
- BUG-0029 **DONE**. AC-1..AC-5 checked. `sprints/S0178/closure-verification.md` CLOSURE_PASS.
- fresh_context_marker: `dev-BUG0029-execute-fix1-20261016T141702Z-fresh`
- Plan-verify is SKIPPED (`ultra_lean_not_in_resolved_phase_plan`).
- No git commit, push, or npm publish. No `.env` read.

## Remediation after RELEASE_FAIL

The kit harness and README feature coverage now pass. Template `.cursor/scratchpad.md` mirrors the live scratchpad, and live `AUTO_BACKLOG_DRAIN` stays `0`. `itsm` help, local auth/models, and bare status are listed for DONE BUG-0028 under Features and Architecture notes. BUG-0028 was not reopened. `tests/report.md` at `2026-10-16T14:15:41Z` is Pass 880 / Fail 0.

## What shipped

`itsm auth login <provider> --type api_key` reads one masked TTY secret, or one stdin line with `--api-key-stdin`. Success prints `{"provider":"<id>","auth":"configured"}` only after `checkAuth` reports a stored credential of the requested type. Cancel, empty, invalid, persist failure, and non-TTY login without the flag exit 1 and do not print that JSON.

## Tests

- Windows: `node --experimental-strip-types --test --test-name-pattern "test_bug0029_" tests/contract/bug0029.contract.test.ts` from `standalone`. 7 pass / 0 fail (duration_ms 148.5945).
- Linux: the same file with Node v24.19.0 at `/home/flow/bug0026-toolchain/node-v24.19.0-linux-x64/bin/node`. 7 pass / 0 fail (duration_ms 251.266733).
- Windows regression: `test_bug0028_` 5 pass / 0 fail (duration_ms 5821.4137).
