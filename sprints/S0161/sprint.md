# Sprint S0161 - Sprint Plan (BUG-0030)

## Metadata

| Field | Value |
|---|---|
| bug_id | BUG-0030 |
| sprint_id | S0161 |
| status | PLANNED |
| current_phase | sprint-plan |
| delivery_mode | ultra_lean |
| approach | A1 - documented OpenCode 1.18.32 Markdown command |
| research_anchor | R-0152 |
| architecture_anchor | docs/engineering/architecture.md # BUG-0030 |
| companion_DEC | DEC-0151 Accepted |
| task_count | 6 (T-anch + T-001..T-005; <= SPRINT_MAX_TASKS=12) |
| plan-verify | skipped: ultra_lean; not in resolved phase plan |

## Scope

Replace the private OpenCode TUI/RPC `/auto` route with the documented
`.opencode/commands/auto.md` route. The command selects `agent: auto` and sends
the canonical spawn-only orchestration prompt. Remove the managed legacy TUI/RPC
route, preserve unrelated user configuration during upgrades, and prove command
registration and prompt admission against the pinned `opencode 1.18.32` host.

## Acceptance Coverage

| AC | Task coverage |
|---|---|
| AC-1 | T-001, T-005 |
| AC-2 | T-001, T-004 |
| AC-3 | T-002, T-004 |
| AC-4 | T-004, T-005 |
| AC-5 | T-002, T-003, T-004 |
| Architecture baseline | T-anch |

All five acceptance criteria are covered. BUG-0030 remains OPEN and all
acceptance checkboxes remain unchecked.

## Task Summaries

1. **T-anch**: Verify R-0152, DEC-0151, the exact OpenCode 1.18.32 pin, and
   the BUG-0023/0024/0027 non-reopen boundary. Do not edit architecture or
   research from execute.
2. **T-001**: Add active and template `.opencode/commands/auto.md` with
   `agent: auto` and a non-STOP spawn-only orchestration prompt.
3. **T-002**: Retire the legacy private `/auto` TUI/RPC route from managed
   active/template configuration while preserving BUG-0027 manual persistence.
4. **T-003**: Update all three installers so upgrades install the managed
   command and remove only managed legacy TUI/RPC assets or TUI configuration.
5. **T-004**: Add command, negative-route, installer-migration, and
   active/template parity contracts for BUG-0030.
6. **T-005**: Add an opt-in real-host OpenCode 1.18.32 smoke check proving
   `/auto` selects agent `auto` and admits the canonical prompt; document the
   exact runbook procedure without claiming model or lifecycle completion.

## Guards

- Do not use `@opencode/plugin` v2 APIs, private RPC, `client.rpc`,
  `ctx.rpc.register`, or an invented localhost endpoint.
- Do not add a JSON command template or a STOP-only `auto.md` body.
- Do not reopen BUG-0023, BUG-0024, or BUG-0027; do not modify their acceptance.
- Do not alter `.cursor/commands/auto.md`, read `.env`, publish npm packages,
  push Git, mark BUG-0030 DONE, or tick acceptance checkboxes.

## Execution Order

T-anch -> T-001 -> T-002 -> T-003 -> T-004 -> T-005.

## Next Phase

`/execute` in a fresh `dev` context. The developer must complete all contracts
before handing off to QA.
