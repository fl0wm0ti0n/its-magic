# Sprint S0174 — US-0154 standalone operator-path quality gate

## Metadata

| Field | Value |
|---|---|
| sprint_id | **S0174** (next free id: `sprints/S0173/` exists; `sprints/S0174/` did not) |
| story_id | US-0154 — **OPEN**, P1, user_visible; AC-1..AC-6 unchecked |
| status | PLANNED |
| current_phase | sprint-plan complete |
| delivery_mode | ultra_lean; plan-verify is skipped and is not authored this phase |
| research_anchor | **R-0164** |
| architecture_anchor | `docs/engineering/architecture.md` `# US-0154` |
| companion_DEC | **none** |
| prior_sprint | S0173 closed US-0153. S0174 does not reopen it. |
| task_count | 7 (T-anch + T-001..T-006; `SPRINT_MAX_TASKS=12`; split not triggered) |
| fresh_context_marker | `tl-US0154-plan-20261011T220313Z-fresh` |

## Goal

Make CI require the standalone workspace typecheck, lint, and tests beside the kit harness, and make a spawned public `itsm` bin prove production composition.

The design is locked by R-0164 and `# US-0154`. This sprint does not re-decide it.

- Root CI keeps kit `TEST_COMMAND`. Standalone CI runs typecheck, lint, and tests on Windows and Ubuntu with Node `22.19.0` and `npm ci`.
- The operator-path fixture spawns the public `itsm` bin. An in-process host factory does not count.
- Operator-path E2E covers session admission, policy, validator failure, restart/resume, daemon replay, and CLI/TUI parity.
- Fake drivers, placeholder screenshots, synthetic target success, and no-op command responses cannot pass production acceptance.
- Reports separate unit seams from operator-path evidence and fail closed on a throwing kernel, empty configuration, ephemeral store, or discarded transport.
- Acceptance docs keep US-0133..US-0148 as completed library slices and US-0150..US-0154 as the production follow-up. Phase-9 deferrals are not missing v1 work.

## Scope

### In scope (execute)

1. Extend `.github/workflows/ci.yml` `standalone-test` and document the pin in the runbook and its template twin.
2. Spawn the public `itsm` bin and prove production composition.
3. Operator-path E2E on `itsm`, `itsm-daemon`, and `itsm-tui`.
4. Fixtures that reject fake browser evidence, synthetic release success, and no-op command responses.
5. A report that separates `unit_seam` from `operator_path` and fails closed.
6. An acceptance classification note. The US-0154 checkbox stays open.
7. Five `test_us0154_*` markers in `standalone/tests/contract/us0154.contract.test.ts`.

### Out of scope

- This phase implements nothing.
- Do not fill blank kit `LINT_COMMAND` or `TYPECHECK_COMMAND`.
- Do not fold standalone npm scripts into `TEST_COMMAND`.
- Do not edit `template/.github/workflows/ci.yml` (BUG-0009).
- Do not reopen US-0149, US-0150, US-0151, US-0152, or US-0153.
- Do not start US-0155.
- Do not delete unit fake seams.
- Do not add a README coverage row.
- Do not flip US-0154 or tick AC-1..AC-6.
- Do not read `.env`. No publish, push, or `/auto`.

## Acceptance coverage

| AC | Tasks |
|---|---|
| AC-1 | T-001 |
| AC-2 | T-002 |
| AC-3 | T-003 |
| AC-4 | T-004 |
| AC-5 | T-005 |
| AC-6 | T-006 |

All six ACs have a task. No split: 7 tasks, cap 12.

## Plan-verify

Ultra-lean skips plan-verify. This phase does not write `sprints/S0174/plan-verify.json`. QA may author that file inside build+verify.

## Proof

- `runtime_proof_id=rp-auto-20261011-us0154-plan-techlead-20261011T220313Z`
- `proof_hash=e6aff2058794baf624751427a8dbb96af9525f7cf98835921840a9f0aff77282`
- `proof_issued_at=2026-10-11T22:03:13Z`; `proof_ttl=2026-10-11T23:03:13Z`
- Canonical tuple: `{"orchestrator_run_id":"auto-20261011-us0154-plan","phase_id":"sprint-plan","proof_issued_at":"2026-10-11T22:03:13Z","proof_ttl_seconds":3600,"role":"tech-lead","runtime_proof_id":"rp-auto-20261011-us0154-plan-techlead-20261011T220313Z"}`
- `hash_recompute_confirmation=true`
