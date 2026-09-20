# Sprint S0158 — Task Checklist (US-0150)

Total tasks: 8 (T-anch + T-001..T-007). `SPRINT_MAX_TASKS=12`; no split. Source: `R-0150`, `# US-0150`, and `DEC-0150`.

## Tasks

- [x] **T-anch**: Verify the A1 decision, six-AC coverage, and compose guards. Do not modify `R-0150`, `DEC-0150`, or completed US-0133 through US-0140 contracts.
- [x] **T-001**: Create `standalone/packages/runtime-host` and export typed `RuntimeHost`, `RuntimeHostOptions`, and explicit test-factory interfaces. Enforce outer-layer dependency direction. (AC-1)
- [x] **T-002**: Implement canonical project-root/config resolution, operational-store opening, and kernel-bridge admission. Return redacted `RUNTIME_CONFIG_UNAVAILABLE` or `RUNTIME_BRIDGE_UNAVAILABLE` failures before scheduling work. (AC-1, AC-2, AC-5)
- [x] **T-003**: Compose custom-tool-only Pi kernel, deny-by-default resources, SessionSupervisor, real policy-admitted ToolBroker implementations, intelligence/context services, and the existing CommandRouter. (AC-1, AC-3, AC-4)
- [x] **T-004**: Implement project-scoped `direct-cli` and `daemon` lifetimes plus idempotent `dispose()`; preserve repository artifacts and validators as canonical. (AC-5)
- [x] **T-005**: Change CLI and daemon entrypoints to obtain one RuntimeHost and dispose direct CLI hosts in `finally`. Remove throwing kernels, literal empty config, and production placeholder paths. (AC-2)
- [x] **T-006**: Add `test_us0150_runtime_host_resolves_one_config_and_builds_graph`, `test_us0150_cli_and_daemon_use_runtime_host_not_throwing_kernel`, `test_us0150_host_creates_fresh_attested_custom_tool_session`, `test_us0150_admitted_tool_executes_or_denies_without_placeholder_success`, `test_us0150_bridge_validator_and_operational_store_preserve_artifact_authority`, and `test_us0150_production_composition_unavailable_services_and_disposal`. (AC-3, AC-4, AC-5, AC-6)
- [x] **T-007**: Add package dependency-direction and production-vs-test-factory regressions; run standalone typecheck, lint, and scoped tests. (AC-6)

## Guards

- No process-global RuntimeHost singleton.
- Test factories remain explicit; no fake tool, fake intelligence, or throwing kernel can be selected by a production entrypoint.
- Do not implement US-0151 through US-0154 work in this sprint.
- Do not mutate US-0149, BUG-0026, acceptance checkboxes, or backlog status.

## Completion Gate

All six `test_us0150_*` markers pass together with standalone typecheck and lint. `US-0150` remains OPEN until later QA, release, and closure phases.
