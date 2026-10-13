# Sprint S0170 — US-0150 production standalone runtime composition

## Metadata

| Field | Value |
|---|---|
| sprint_id | **S0170** (next free id: `sprints/S0169/` exists; `sprints/S0170/` did not) |
| story_id | US-0150 — **OPEN**, P0; AC-1..AC-6 unchecked |
| status | PLANNED |
| current_phase | sprint-plan complete |
| delivery_mode | ultra_lean; plan-verify is a PENDING stub for the later QA phase |
| research_anchor | **R-0150** (extended in place on 2026-10-11; heading unchanged) |
| architecture_anchor | `docs/engineering/architecture.md` `# US-0150` |
| companion_DEC | **none created** (`DEC-0150` already Accepted; composition root stays locked) |
| prior_sprint | S0158 implemented the host; release and closure stayed blocked. S0170 does not reopen S0158. |
| task_count | 7 (T-anch + T-001..T-006; `SPRINT_MAX_TASKS=12`; split not triggered) |
| fresh_context_marker | `tl-US0150-plan-20261011T144420Z-fresh` |

## Goal

Make the existing project-scoped `@its-magic/runtime-host` the production composition that CLI and daemon already construct, with host config on daemon reconcile and one hashed context pack from the delivered context engine.

The design is locked by R-0150, DEC-0150, and `# US-0150`. This sprint does not re-decide it.

- One host per project. Direct CLI disposes it in `finally`. The daemon owns it until shutdown.
- Host-present `crashResume` uses the config that host already resolved.
- The host builds one `ContextPack` through existing `codeContext`, or fails with `RUNTIME_SERVICE_UNAVAILABLE`.
- Production `createRuntimeHost` takes no test factories. The offline suite uses a deterministic local model seam.
- SQLite stays operational metadata. Repository artifacts stay authoritative.

## Scope

### In scope (execute)

1. Host-owned context pack in `standalone/packages/runtime-host` via existing `codeContext`.
2. Host-present daemon reconcile in `standalone/apps/daemon/src/server.ts` uses `runtime.config`.
3. Keep `createRuntimeHost` in `standalone/apps/cli/src/index.ts` and `standalone/apps/daemon/src/index.ts`.
4. Six `test_us0150_*` markers in `standalone/tests/contract/us0150.contract.test.ts`, including one production call with no factories.

### Out of scope

- This phase implements nothing.
- Do not recreate the runtime-host package or rewrite US-0133 through US-0140 public contracts.
- Do not edit US-0148 assertions except where a host-present config change forces a fixture to keep those tests green.
- Do not start US-0151, US-0152, US-0153, US-0154, or US-0155.
- Do not implement PATH registration, BUG-0026, or phase-9 deferred clients.
- Do not reopen US-0149 or S0158.
- Do not flip US-0150 or tick AC-1..AC-6.
- Do not read `.env`. No publish, push, or `/auto`.

## Acceptance coverage

| AC | Tasks |
|---|---|
| AC-1 | T-001, T-006 |
| AC-2 | T-002, T-006 |
| AC-3 | T-003, T-006 |
| AC-4 | T-004, T-006 |
| AC-5 | T-005, T-006 |
| AC-6 | T-006 |

All six ACs have a task. No split: 7 tasks, cap 12.

## Plan-verify

`sprints/S0170/plan-verify.json` is **PENDING**. Ultra-lean skips plan-verify at plan time. QA overwrites it inside build+verify.

## Proof

- `runtime_proof_id=rp-auto-20261011-us0150-plan-techlead-20261011T144420Z`
- `proof_hash=4b5ac7319cd7651cd0b3fca50110cfe5f516571c6cedb238be041df0b86fadf6`
- `proof_issued_at=2026-10-11T14:44:20Z`; `proof_ttl=2026-10-11T15:44:20Z`
- Canonical tuple: `{"orchestrator_run_id":"auto-20261011-us0150-plan","phase_id":"sprint-plan","proof_issued_at":"2026-10-11T14:44:20Z","proof_ttl_seconds":3600,"role":"tech-lead","runtime_proof_id":"rp-auto-20261011-us0150-plan-techlead-20261011T144420Z"}`
- `hash_recompute_confirmation=true`
