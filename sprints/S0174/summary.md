# Summary — Sprint S0174

## Goal

Standalone CI runs typecheck, lint, and tests beside the kit harness, and a spawned public `itsm` bin proves production composition (R-0164, no new DEC).

## Shipped

Job `standalone-test` is a matrix of `windows-latest` and `ubuntu-latest`. Each leg pins Node `22.19.0`, runs `npm ci` in `standalone/`, then `npm run typecheck && npm run lint && npm test`. Root job `checks` stays on kit `TEST_COMMAND`. `LINT_COMMAND` and `TYPECHECK_COMMAND` stay blank. The same pin is in `docs/engineering/runbook.md` and `template/docs/engineering/runbook.md`. `template/.github/workflows/ci.yml` was not edited.

`standalone/tests/contract/us0154.contract.test.ts` spawns the public `itsm` bin (`standalone/apps/cli/src/index.ts`), `itsm-daemon`, and `itsm-tui`. Passing fixtures show store path `.its-magic/runtime/ops.sqlite`, a non-empty config, and a transport disposition. Empty config exits `RUNTIME_CONFIG_UNAVAILABLE`. Operator-path coverage includes fresh session admission, policy allow and deny, validator failure before work, resume from the sqlite store, daemon attach/replay, and CLI/TUI parity. `FakeBrowserDriver`, `screenshot-placeholder`, `artifact_sha: "fake-sha"`, and no-op `{ok:true}` / `{scheduled:true}` fail the operator-path bucket. Reports split `unit_seam` from `operator_path` and fail on a throwing kernel, empty configuration, `:memory:`, or a discarded transport. Unit fake seams stay.

`docs/product/acceptance.md` records US-0133 through US-0148 as completed library/contract slices and US-0150 through US-0154 as their production-integration follow-up. Phase-9 deferrals are not missing v1 work.

The US-0149 launcher row failed because `standalone/packages/runtime-core/src/operator/operator-executor.ts` used CRLF while its publishable mirror used LF. The source file was normalized to LF so the mirror matches. The US-0149 assertions were not changed.

## Tests

Standalone contract runner, five `test_us0154_*` markers, 5 pass / 0 fail (full harness). Harness `tests/report.md` timestamp **2026-10-12T18:52:56Z**, **Pass 880 / Fail 0**, exit 0 (closure re-run).

## Status

**REFRESH_CONTEXT_PASS** (`curator-US0154-refresh-20261012T185524Z-fresh`). US-0154 **DONE**; AC-1..AC-6 `[x]`; post-flip coverage `coverage_missing=[]`, `coverage_total=50`. Drain head **US-0155** (OPEN); intake skipped (`standalone-cli-ux-intake-20260923T213043Z.json`). Next: `/discovery` (po) for US-0155 after parent validates the refresh pair. Publish/push NOT PERFORMED.
