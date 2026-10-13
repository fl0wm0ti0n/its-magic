# UAT — Sprint S0170 / US-0150

## Result

**PASS.** Contract behavior on the deterministic local model seam. A live daemon or paid-model probe is `UAT_PROBE_FORBIDDEN`.

- Contract tests: `node --experimental-strip-types --test --test-name-pattern "test_us0150_" tests/contract/us0150.contract.test.ts` → **6 pass / 0 fail** (1933.826 ms)
- Harness: `tests/report.md` timestamp **2026-10-11T15:26:11Z**, **Pass 880 / Fail 0**, exit 0
- fresh_context_marker: `qa-US0150-qa-20261011T152710Z-fresh`
- timestamp: 2026-10-11T15:27:10Z
- US-0150 stays OPEN. Backlog AC boxes stay unchecked.

## Steps

| Step | AC | Probe | Result |
|---|---|---|---|
| UAT-1 | AC-1 | One host resolves config and exposes a hashed `codeContext` pack | PASS (`test_us0150_runtime_host_resolves_one_config_and_builds_graph`) |
| UAT-2 | AC-2 | CLI and daemon entrypoints use the host; host-present reconcile uses host config | PASS (`test_us0150_cli_and_daemon_use_runtime_host_not_throwing_kernel`) |
| UAT-3 | AC-3 | Production session is fresh, attested, custom-tool only, deny-by-default | PASS (`test_us0150_host_creates_fresh_attested_custom_tool_session`) |
| UAT-4 | AC-4 | An admitted tool executes or denies, with no `ok:` success text | PASS (`test_us0150_admitted_tool_executes_or_denies_without_placeholder_success`) |
| UAT-5 | AC-5 | Bridge failure blocks work; SQLite stays operational; dispose keeps repository files | PASS (`test_us0150_bridge_validator_and_operational_store_preserve_artifact_authority`) |
| UAT-6 | AC-6 | Six `test_us0150_*` markers pass, including a no-factory production session | PASS (`test_us0150_production_composition_unavailable_services_and_disposal`) |
| convergence_smoke | — | Waived live probes plus the green contract file | PASS |

## Live probes

All six live-runtime classes are `UAT_PROBE_FORBIDDEN`. No paid credentials and no network. The production session uses `createFakeModel` / `createFakeModelRuntime` (`itsm-fake-ping`).
