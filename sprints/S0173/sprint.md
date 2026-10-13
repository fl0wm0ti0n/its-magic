# Sprint S0173 — US-0153 real parallel delivery and release execution

## Metadata

| Field | Value |
|---|---|
| sprint_id | **S0173** (next free id: `sprints/S0172/` exists; `sprints/S0173/` did not) |
| story_id | US-0153 — **OPEN**, P1; AC-1..AC-5 unchecked |
| status | PLANNED |
| current_phase | sprint-plan complete |
| delivery_mode | ultra_lean; plan-verify is a PENDING stub for the later QA phase |
| research_anchor | **R-0163** |
| architecture_anchor | `docs/engineering/architecture.md` `# US-0153` |
| companion_DEC | **none** |
| prior_sprint | S0172 closed US-0152. S0173 does not reopen it. |
| task_count | 6 (T-anch + T-001..T-005; `SPRINT_MAX_TASKS=12`; split not triggered) |
| fresh_context_marker | `tl-US0153-plan-20261011T202311Z-fresh` |

## Goal

Make parallel candidate arbitration and configured release targets run only when a real service admits them, and keep a stub adapter from passing a release.

The design is locked by R-0163 and `# US-0153`. This sprint does not re-decide it.

- When parallel dev is on, the workflow calls `runQaArbiter` after worktrees exist and writes `handoffs/parallel_dev_pick.json`.
- Release apply and verify use configured targets. An unconfigured target fails closed.
- `artifact_sha: "fake-sha"` is not a release pass.
- Smoke, verify, repair, and closure read real run, UAT, and artifact evidence.
- Resource and policy checks run before worktree create, deploy, and repair, and each check is audited.

## Scope

### In scope (execute)

1. Workflow arbitration after parallel worktrees, with a persisted selected or rejected pick.
2. Configured release adapters. Unconfigured targets and stub success fail closed. US-0145 dry-run stays.
3. Deploy smoke, verify, repair caps, ownership, and closure prerequisites fed by real evidence.
4. Resource and policy limits before worktree, deploy, and repair, with an audit line.
5. Five `test_us0153_*` markers in `standalone/tests/contract/us0153.contract.test.ts`.
6. Template twins of touched `standalone/` files stay aligned.

### Out of scope

- This phase implements nothing.
- Do not redesign the US-0145 pipeline or `RELEASE_GATE_ORDER`.
- Do not reopen US-0149, US-0150, US-0151, or US-0152.
- Do not start US-0154 or US-0155.
- No distributed workers and no remote always-on Debian execution.
- Do not flip US-0153 or tick AC-1..AC-5.
- Do not read `.env`. No publish, push, or `/auto`.

## Acceptance coverage

| AC | Tasks |
|---|---|
| AC-1 | T-001, T-005 |
| AC-2 | T-002, T-005 |
| AC-3 | T-003, T-005 |
| AC-4 | T-004, T-005 |
| AC-5 | T-005 |

All five ACs have a task. No split: 6 tasks, cap 12.

## Plan-verify

`sprints/S0173/plan-verify.json` is **PENDING**. Ultra-lean skips plan-verify at plan time. QA overwrites it inside build+verify.

## Proof

- `runtime_proof_id=rp-auto-20261011-us0153-plan-techlead-20261011T202311Z`
- `proof_hash=8e76ff0bac99740aea48e49b9d43026e787932573c4f1f13a852261a95b7d516`
- `proof_issued_at=2026-10-11T20:23:11Z`; `proof_ttl=2026-10-11T21:23:11Z`
- Canonical tuple: `{"orchestrator_run_id":"auto-20261011-us0153-plan","phase_id":"sprint-plan","proof_issued_at":"2026-10-11T20:23:11Z","proof_ttl_seconds":3600,"role":"tech-lead","runtime_proof_id":"rp-auto-20261011-us0153-plan-techlead-20261011T202311Z"}`
- `hash_recompute_confirmation=true`
