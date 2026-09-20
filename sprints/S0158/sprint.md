# Sprint S0158 — Sprint Plan (US-0150)

## Metadata

| Field | Value |
|---|---|
| story_id | **US-0150** |
| story_title | Production standalone runtime composition |
| sprint_id | **S0158** |
| delivery_mode | ultra_lean |
| current_phase | qa |
| next_phase | `/verify-work` (fresh verifier) |
| plan-verify | skipped (`ultra_lean_skipped`) |
| approach | A1 (A*) — project-scoped `@its-magic/runtime-host` |
| research_anchor | `R-0150` |
| architecture_anchor | `docs/engineering/architecture.md` `# US-0150` |
| companion_DEC | `DEC-0150` Accepted |
| decision_gate | false |
| SPRINT_MAX_TASKS | 12 |
| task_count | 8 (T-anch + T-001..T-007; no split) |
| backlog_status | OPEN; ACs remain unchecked |

## Scope

Materialize one project-scoped production composition root that resolves configuration, admits the kernel bridge and custom-tool-only Pi kernel, creates real policy-admitted tools and intelligence, constructs the existing command router, and injects that graph into CLI and daemon. The host owns direct-CLI and daemon lifecycle disposal without making operational state authoritative over project artifacts.

Out of scope: lifecycle transport and TUI state (US-0151), application/browser UAT (US-0152), deploy/arbitration (US-0153), operator-path CI (US-0154), US-0149, BUG-0026, phase-9 work, `.env` reads, publishing, and git push.

## Acceptance Coverage

| AC | Task(s) |
|---|---|
| AC-1: one composition root | T-001, T-002, T-003 |
| AC-2: CLI and daemon inject it | T-002, T-005 |
| AC-3: resolved fresh Pi sessions | T-003, T-006 |
| AC-4: real-or-denied tools | T-003, T-006 |
| AC-5: bridge/config/context/store ownership | T-002, T-004, T-006 |
| AC-6: production-composition tests | T-006, T-007 |

All six ACs are covered. No `PLAN_AC_COVERAGE_GAP`.

## Task Summary

1. **T-anch**: Verify `R-0150`, `# US-0150`, and `DEC-0150`; confirm boundaries and no implementation in unrelated stories.
2. **T-001**: Add `@its-magic/runtime-host` package with public host and explicit test-factory interfaces.
3. **T-002**: Resolve canonical project config, operational store, and bridge admission with typed redacted `RUNTIME_*` failures.
4. **T-003**: Compose Pi kernel, real ToolBroker services, intelligence/context, `SessionSupervisor`, and existing `CommandRouter`.
5. **T-004**: Implement project-scoped host lifetime and idempotent disposal; preserve artifact/validator authority.
6. **T-005**: Replace CLI and daemon throwing-kernel/empty-config wiring with host construction and disposal.
7. **T-006**: Add the six architecture-owned `test_us0150_*` production-composition tests.
8. **T-007**: Add dependency-direction and production-vs-test-factory regression checks; run scoped quality gates.

Execution order: T-anch → T-001 → T-002 → T-003 → T-004 → T-005 → T-006 → T-007.

## Next Phase

`/execute` must run in a fresh dev context. The sprint plan does not mark US-0150 DONE or tick acceptance criteria.
