# UAT — Sprint S0176 / BUG-0028

## Result

**PASS.** Contract fixtures cover lightweight help, auth, and models, the bounded status snapshot, production workflow admission, Windows and Linux launcher files, and the operator-doc split. A live installed binary is `UAT_PROBE_FORBIDDEN`.

- Contract tests: `node --experimental-strip-types --test --test-name-pattern "test_bug0028_" tests/contract/bug0028.contract.test.ts` (cwd `standalone`) → **5 pass / 0 fail** (5617.6656 ms)
- UAT steps: **6 passed / 0 failed**
- fresh_context_marker: `qa-BUG0028-vw-20261014T202655Z-fresh`
- timestamp: 2026-10-14T20:26:55Z
- BUG-0028 stays OPEN. Backlog AC-1..AC-5 stay unchecked.

## Steps

| Step | AC | Probe | Result |
|---|---|---|---|
| UAT-1 | AC-1 | Help, auth, and models finish locally before RuntimeHost, the Pi kernel, code intelligence, ToolBroker, or SQLite | PASS (`test_bug0028_help_auth_models_skip_host_and_kernel_barrel`) |
| UAT-2 | AC-2 | Bare `itsm status` is a bounded read-only snapshot and does not scan the repository or create a workflow session | PASS (`test_bug0028_status_bounded_snapshot_no_scan_session_or_ping`) |
| UAT-3 | AC-3 | Workflow tokens, including `/status`, keep production `createRuntimeHost` admission | PASS (`test_bug0028_workflow_tokens_keep_production_host`) |
| UAT-4 | AC-4 | Light paths do not construct code intelligence or scan project files; launcher files cover Windows and Linux | PASS (`test_bug0028_installed_entrypoint_windows_and_linux`) |
| UAT-5 | AC-5 | Operator docs distinguish lightweight inspection and auth commands from full-runtime commands | PASS (`test_bug0028_operator_doc_lightweight_versus_full_runtime`) |
| convergence_smoke | — | Waived live probes plus the green contract file | PASS |

## Live probes

A live installed `itsm` binary is `UAT_PROBE_FORBIDDEN`. The six live-runtime probe classes (`browser_smoke`, `api_health`, `process_health`, `cli_smoke`, `build`, `manual_operator`) stay waived. No `.env` read. The suite uses the contract file only. Full kit harness Fail=0 is not claimed.

## Summary

UAT-1 maps to AC-1, UAT-2 to AC-2, UAT-3 to AC-3, UAT-4 to AC-4, and UAT-5 to AC-5. All five acceptance steps passed. `convergence_smoke` passed because `contract_test_failed=0`. Passed 6 + failed 0 = 6 steps. Backlog acceptance for `### BUG-0028` stays unchecked. Closure owns the DONE flip.
