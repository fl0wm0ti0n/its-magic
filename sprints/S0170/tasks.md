# Sprint S0170 — Task checklist (US-0150)

Seven planned tasks: **T-anch + T-001..T-006**, within `SPRINT_MAX_TASKS=12`.
Execute only in this order. Every box stays open until a fresh `/execute` dev context finishes it.

## Checklist

- [x] **T-anch — locked baseline (all AC):** Read R-0150, `DEC-0150`, and `# US-0150`. Confirm US-0150 is OPEN, AC-1..AC-6 are unchecked, S0158 is historical, and both production entrypoints already call `createRuntimeHost`. Confirm US-0133 through US-0140 and US-0149 stay DONE. Do not mutate.

- [x] **T-001 — context pack on the host (AC-1):** In `standalone/packages/runtime-host`, construct one context pack by calling existing `codeContext` with hits from the admitted code-intelligence provider. Expose that pack on the host. If intelligence is unavailable, fail with `RUNTIME_SERVICE_UNAVAILABLE` and do not write a fake pack. Do not change the public exports of `context-engine` or `code-intelligence`.
  **Done-when:** a healthy host exposes a `ContextPack` whose `content_hash` came from `codeContext`, and an unavailable provider surfaces `RUNTIME_SERVICE_UNAVAILABLE`.

- [x] **T-002 — host config on daemon reconcile (AC-2):** When `startDaemonServer` has a runtime host, pass that host's resolved config into `crashResume`. Keep `createRuntimeHost` plus `dispose()` in `apps/cli/src/index.ts` and `apps/daemon/src/index.ts`. Leave the supervisor-only fixture path in place for US-0148 tests, and keep it unreachable from those two `index.ts` files.
  **Done-when:** the host-present reconcile path has no literal empty config, and US-0148 contract tests still start.

- [x] **T-003 — fresh custom-tool session (AC-3):** Prove a production `createRuntimeHost` call with no factories creates a session that uses the resolved role, model, and provider, records fresh-session attestation, registers custom tools only, and denies project resources by default. Repair host wiring only if that proof fails. Do not rewrite `pi-kernel` or `role-runtime` contracts.
  **Done-when:** the live session reports builtin tools disabled and attestation is present.

- [x] **T-004 — tool execute or deny (AC-4):** Prove file, edit, shell, git, and intelligence tools either perform the policy-admitted operation with an audit result or return a deterministic denial. Result text must not match `^ok:`. Do not add browser or app tools.
  **Done-when:** one allowed tool run and one denial are both free of `ok:` success text.

- [x] **T-005 — artifact authority (AC-5):** Prove a bridge or validator failure returns `RUNTIME_BRIDGE_UNAVAILABLE` before work is scheduled, config provenance is non-secret, the context pack hash is on the host, and the operational store holds run, session, audit, and index metadata only. `dispose()` may run twice and must not delete repository files.
  **Done-when:** a repository file hash is unchanged across dispose, and the store is not treated as artifact authority.

- [x] **T-006 — production-composition tests (AC-6):** Keep these markers in `standalone/tests/contract/us0150.contract.test.ts`: `test_us0150_runtime_host_resolves_one_config_and_builds_graph`, `test_us0150_cli_and_daemon_use_runtime_host_not_throwing_kernel`, `test_us0150_host_creates_fresh_attested_custom_tool_session`, `test_us0150_admitted_tool_executes_or_denies_without_placeholder_success`, `test_us0150_bridge_validator_and_operational_store_preserve_artifact_authority`, `test_us0150_production_composition_unavailable_services_and_disposal`. The production case calls `createRuntimeHost` with no factories and a deterministic local model seam. No paid credentials and no network.
  **Done-when:** all six markers pass under the standalone contract runner.

## Execute boundary

US-0150 stays OPEN. AC boxes stay unchecked. Closure owns the DONE flip.
