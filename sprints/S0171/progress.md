# Progress — Sprint S0171

Execute finished. US-0151 stays OPEN. AC-1..AC-6 stay unchecked.

- T-anch: done. US-0151 was OPEN. AC-1..AC-6 were unchecked. S0170 is historical. US-0146, US-0148, US-0149, and US-0150 stay DONE. Baseline gaps matched the task: CLI discarded `resolveOperatorTransport`, daemon `command.submit` returned `{ok:true}` after routing, and TUI read `:memory:`.
- T-001: done. CLI and TUI use the resolved transport. Production paths do not open `:memory:`. In-process transport receives `host.store`. `dispatchItsmCommand` and `OperatorCommandFacade` remain in `run.ts`.
- T-002: done. One executor persists `success`, `gate_block`, or `execution_failure`. `status` stays a snapshot and still appends one event. A rendered plan and a route-only `{ok:true}` are not the success result.
- T-003: done. The daemon builds one `WorkflowEngine` for the process. Resume calls `crashResume` with `host.store` and `readRepoResume`. A restarted daemon reads the same store.
- T-004: done. Ask and index use `host.intel` or return `INTEL_INDEX_UNAVAILABLE` / `INDEX_UNAVAILABLE`. App returns `APP_HEALTH_UNAVAILABLE`. Browser returns `BROWSER_UNAVAILABLE`.
- T-005: done. `buildTuiModel` attaches, replays `/v1/events`, and reads `status.snapshot` through `statusSnapshot()`. Unreachable daemon surfaces `DAEMON_UNREACHABLE`. Panel ids are unchanged.
- T-006: done. Six `test_us0151_*` markers passed.
- Coverage row: literal `US-0151` is in the Features catalog of both its_magic READMEs (byte-identical) and in `docs/developer/README.md` Architecture notes. US-0151 stays OPEN. AC boxes stay unchecked.

Next phase remains closure per the release pair. This coverage addendum did not flip US-0151 or tick acceptance boxes.
