# Sprint S0171 — Task checklist (US-0151)

Seven planned tasks: **T-anch + T-001..T-006**, within `SPRINT_MAX_TASKS=12`.
Execute only in this order. Every box stays open until a fresh `/execute` dev context finishes it.

## Checklist

- [x] **T-anch — locked baseline (all AC):** Read R-0161 and `# US-0151`. Confirm US-0151 is OPEN, AC-1..AC-6 are unchecked, and S0170 is historical. Confirm US-0146, US-0148, US-0149, and US-0150 stay DONE. Confirm CLI discards `resolveOperatorTransport`, daemon `command.submit` returns `{ok:true}` after routing, and TUI reads `:memory:`. Do not mutate product code in this task.
  **Done-when:** the notes match those three gaps and the story is still OPEN.

- [x] **T-001 — keep the resolved transport (AC-1):** In `standalone/apps/cli/src/run.ts` and `standalone/apps/tui/src/index.ts`, use the `OperatorTransport` returned by `resolveOperatorTransport`. Remove production `createRunsStore(":memory:")` fallbacks. The in-process transport receives `host.store`. Keep `dispatchItsmCommand` and the `OperatorCommandFacade` identifier in `run.ts`. Mirror template twins.
  **Done-when:** a production CLI or TUI path cannot open `:memory:`, and the resolved transport object is the one that submits or reads.

- [x] **T-002 — execute and persist (AC-2):** Add one executor in `runtime-core` operator code, with a template twin. Daemon `command.submit` and in-process `submitCommand` call it. Scheduler commands use `runAuto` / `runQuick`. Programmatic lifecycle commands use `runCommand` and then `runStandardLifecycle` when the route is a plan. Return `success`, `gate_block`, or `execution_failure`, and append that outcome on the daemon event log or the host store. `status` stays a snapshot and still appends one event. Do not treat a rendered plan as success.
  **Done-when:** a lifecycle submit persists an event whose disposition is one of those three, and a route-only `{ok:true}` is not the success result.

- [x] **T-003 — auto, quick, resume, crash (AC-3):** The daemon builds one `WorkflowEngine` from the host for the process lifetime. `auto` and `quick` use that engine and the existing stop policy. `resume` calls existing `crashResume` with `host.store` and `readRepoResume`. Do not add a session cache. Fresh role sessions stay on the supervisor the host already has. Mirror template twins.
  **Done-when:** resume across a restarted daemon reads the same host store, and a second engine is not constructed per command.

- [x] **T-004 — ask, index, app, browser (AC-4):** `ask` calls `host.intel.search`. `index` calls `host.intel.refresh` or `status`. Unavailable intelligence returns `INTEL_INDEX_UNAVAILABLE` or `INDEX_UNAVAILABLE`. `app` returns `APP_HEALTH_UNAVAILABLE`. `browser` returns `BROWSER_UNAVAILABLE`. Do not construct `AppRuntime` or a browser driver. Do not add reason codes.
  **Done-when:** ask and index either return intel output or an existing unavailable code, and app and browser never return `{ok:true}`.

- [x] **T-005 — daemon replay on the existing TUI (AC-5):** `buildTuiModel` attaches, replays `/v1/events`, and reads `status.snapshot` through a client `statusSnapshot()` method. Do not add a JSON-RPC method. Protocol version stays 1. Do not change `panels.ts` ids or collapse order. If the daemon cannot be attached, surface `DAEMON_UNREACHABLE` instead of an empty memory timeline. Mirror template twins.
  **Done-when:** the timeline entries are replayed daemon events, and panel ids are unchanged.

- [x] **T-006 — executable entry tests (AC-6):** Add `standalone/tests/contract/us0151.contract.test.ts` with `test_us0151_cli_tui_daemon_share_resolved_transport`, `test_us0151_lifecycle_persists_success_gate_or_failure`, `test_us0151_auto_resume_crash_uses_workflow_and_store`, `test_us0151_ask_index_app_browser_admit_or_fail_closed`, `test_us0151_attach_and_tui_replay_daemon_events`, and `test_us0151_e2e_execute_gate_restart_replay_attach`. Drive `runCliArgv` and `startDaemonServer` with the deterministic local model seam. Cover execute, a gate failure, restart/resume, replay, and CLI/TUI attach. No paid model, no network, no `.env`.
  **Done-when:** all six markers pass under the standalone contract runner.

## Execute boundary

US-0151 stays OPEN. AC boxes stay unchecked. Closure owns the DONE flip.
