# Sprint S0171 — US-0151 executable lifecycle and operator transport

## Metadata

| Field | Value |
|---|---|
| sprint_id | **S0171** (next free id: `sprints/S0170/` exists; `sprints/S0171/` did not) |
| story_id | US-0151 — **OPEN**, P0; AC-1..AC-6 unchecked |
| status | PLANNED |
| current_phase | sprint-plan complete |
| delivery_mode | ultra_lean; plan-verify is a PENDING stub for the later QA phase |
| research_anchor | **R-0161** |
| architecture_anchor | `docs/engineering/architecture.md` `# US-0151` |
| companion_DEC | **none** |
| prior_sprint | S0170 closed US-0150. S0171 does not reopen it. |
| task_count | 7 (T-anch + T-001..T-006; `SPRINT_MAX_TASKS=12`; split not triggered) |
| fresh_context_marker | `tl-US0151-plan-20261011T162642Z-fresh` |

## Goal

Make CLI, daemon, and TUI submit work through the transport they already resolve, and make that runtime execute admitted work.

The design is locked by R-0161 and `# US-0151`. This sprint does not re-decide it.

- Keep the resolved `OperatorTransport`. Production paths do not open `:memory:`.
- Daemon `command.submit` and the in-process transport call one executor on the US-0150 host.
- The executor uses existing `WorkflowEngine`, `crashResume`, and `host.intel`.
- Results are success, gate block, or execution failure. A rendered plan or `{ok:true}` is not success.
- TUI timeline is daemon replay. App and browser stay fail-closed for US-0152.

## Scope

### In scope (execute)

1. CLI and TUI use the resolved transport and the host store.
2. One executor for lifecycle, resume, ask, and index.
3. Daemon event replay for attach and TUI, with panel ids unchanged.
4. Six `test_us0151_*` markers in `standalone/tests/contract/us0151.contract.test.ts`.
5. Template twins of touched `standalone/` files stay aligned.

### Out of scope

- This phase implements nothing.
- Do not redesign the US-0148 protocol or the US-0146 panel language.
- Do not rewrite `WorkflowEngine` stop policy.
- Do not implement `AppRuntime` or a browser driver.
- Do not start US-0152, US-0153, US-0154, or US-0155.
- Do not reopen US-0149, US-0150, US-0146, or US-0148.
- Do not implement PATH registration or BUG-0026.
- Do not flip US-0151 or tick AC-1..AC-6.
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

`sprints/S0171/plan-verify.json` is **PENDING**. Ultra-lean skips plan-verify at plan time. QA overwrites it inside build+verify.

## Proof

- `runtime_proof_id=rp-auto-20261011-us0151-plan-techlead-20261011T162642Z`
- `proof_hash=756c68acb9e8264e46cf871bd9072d8b0f3fbe71c1a70a5ab430ef04183015ac`
- `proof_issued_at=2026-10-11T16:26:42Z`; `proof_ttl=2026-10-11T17:26:42Z`
- Canonical tuple: `{"orchestrator_run_id":"auto-20261011-us0151-plan","phase_id":"sprint-plan","proof_issued_at":"2026-10-11T16:26:42Z","proof_ttl_seconds":3600,"role":"tech-lead","runtime_proof_id":"rp-auto-20261011-us0151-plan-techlead-20261011T162642Z"}`
- `hash_recompute_confirmation=true`
