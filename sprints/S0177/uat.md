# UAT — Sprint S0177 / BUG-0026

- **verdict**: PASS
- **phase**: verify-work (re-attest, run `auto-20261023-bug0026-verify-work`)
- **timestamp**: 2026-10-24T09:38:56Z
- **fresh_context_marker**: `qa-BUG0026-verifywork-20261024T093856Z-fresh`
- **counts**: 9 pass / 0 fail
- **bug status**: BUG-0026 stays OPEN. AC-3 stays unchecked. Closure owns the DONE flip.
- **re-release-cycle note**: All 9 steps re-confirmed at the verify-work phase boundary. Contract re-run 8/8 green (5.83s). `cli_smoke` re-observed read-only only — the upgrade command was not run again. Consumed QA pair hash `95cd78d9…ae0f4c` integrity-verified as provenance (out-of-TTL, no stale-proof waiver). No republish, no DEC, no commit/push.

## Target

BUG-0026 (OPEN). Primary acceptance row in `docs/product/acceptance.md` stays unchecked.

## Steps

| Step | AC | Result | Evidence |
|---|---|---|---|
| UAT-1 | AC-1 | pass | Installed `its-magic@0.1.5` contains the allowlisted range file. `test_bug0026_allowlist_ships_equivalent_range_without_private_workspace` passed. |
| UAT-2 | AC-2 | pass | Windows 2026-09-19 `itsm` plus `itsm.cmd` row cited and not copied. Linux residue has no `itsm.cmd`. |
| UAT-3 | AC-3 | pass | Debian 13 WSL2 re-observation: posix `.its-magic/bin/itsm` mode 0755, `#!/usr/bin/env sh`. Backlog AC-3 stays unchecked. |
| UAT-4 | AC-4 | pass | Eight existing `test_bug0026_*` passed. No new contract. |
| UAT-5 | AC-5 | pass | BUG-0025 was not reopened. |
| UAT-6 | AC-6 | pass | US-0149 was not reopened. |
| UAT-7 | AC-7 | pass | BUG-0028 and BUG-0029 were not edited. |
| UAT-8 | AC-8 | pass | `test_bug0026_missing_range_is_not_false_kernel_contract_mismatch` passed. Linux residue is the success path. |
| convergence_smoke | — | pass | `contract_test_failed=0`. Five live classes waived `UAT_PROBE_FORBIDDEN`. `cli_smoke` re-observed. Full harness Fail=0 not claimed. |

## Probe classes

- `cli_smoke`: pass. Read-only Debian 13 consumer re-observation. The upgrade command was not run again.
- `browser_smoke`, `api_health`, `process_health`, `build`, `manual_operator`: `UAT_PROBE_FORBIDDEN`.
