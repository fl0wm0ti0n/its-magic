# Summary — Sprint S0171

## Goal

CLI, daemon, and TUI submit work on the resolved operator transport, and the US-0150 host executes it (R-0161, no new DEC).

## Done

T-anch and T-001..T-006. Production CLI and TUI keep the `OperatorTransport` from `resolveOperatorTransport` and do not open `:memory:`. One executor in `runtime-core` runs scheduler commands through `runAuto` / `runQuick`, programmatic lifecycle through `runCommand` and `runStandardLifecycle` when the route is a plan, resume through `crashResume` plus `readRepoResume`, and ask/index through `host.intel`. Results are `success`, `gate_block`, or `execution_failure`. The daemon builds one `WorkflowEngine` for the process. App and browser return the existing unavailable codes. TUI timeline is daemon attach, `/v1/events` replay, and `status.snapshot`. Protocol version stays 1. Panel ids stay. Template twins of the touched files match.

## Tests

Six `test_us0151_*` markers passed under the standalone contract runner. Harness `tests/report.md` Timestamp 2026-10-11T18:17:53Z, Pass 880 / Fail 0 (post-closure). QA, verify-work, release, closure, and refresh-context PASS; US-0151 **DONE** (AC-1..AC-6 checked). Drain advanced at refresh (`fresh_context_marker=curator-US0151-refresh-20261011T181953Z-fresh`); next head: **US-0152** `/discovery` (intake skipped).

## Coverage rows

Literal `US-0151` is in the Features catalog of `its_magic/README.md` and the byte-identical `template/its_magic/README.md`, and in `docs/developer/README.md` Architecture notes (`**US-0151**`, architecture `# US-0151`). Affinity `distribution`: root and dev coverage are true. Post-closure report status PASS, `coverage_missing=[]`, `coverage_present` includes US-0151, `coverage_total=47`. `template/docs/developer/README.md` was not changed.
