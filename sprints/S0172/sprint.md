# Sprint S0172 — US-0152 production application and browser UAT integration

## Metadata

| Field | Value |
|---|---|
| sprint_id | **S0172** (next free id: `sprints/S0171/` exists; `sprints/S0172/` did not) |
| story_id | US-0152 — **OPEN**, P1; AC-1..AC-6 unchecked |
| status | PLANNED |
| current_phase | sprint-plan complete |
| delivery_mode | ultra_lean; plan-verify is a PENDING stub for the later QA phase |
| research_anchor | **R-0162** |
| architecture_anchor | `docs/engineering/architecture.md` `# US-0152` |
| companion_DEC | **none** |
| prior_sprint | S0171 closed US-0151. S0172 does not reopen it. |
| task_count | 7 (T-anch + T-001..T-006; `SPRINT_MAX_TASKS=12`; split not triggered) |
| fresh_context_marker | `tl-US0152-plan-20261011T183005Z-fresh` |

## Goal

Make the production composition own `AppRuntime` and `BrowserUAT`, and make execute, QA, UAT, and release use real health and browser evidence.

The design is locked by R-0162 and `# US-0152`. This sprint does not re-decide it.

- `createRuntimeHost` constructs both services. `dispose` cleans them up.
- Production browser mode is `PlaywrightIsolatedDriver` or `BROWSER_UNAVAILABLE`.
- `FakeBrowserDriver` and `screenshot-placeholder` stay test-only.
- Gates read repository evidence. Incomplete evidence blocks UAT.
- `itsm app` and `itsm browser` call those same services.

## Scope

### In scope (execute)

1. Host ownership of `AppRuntime` and `BrowserUAT`, including cleanup.
2. Production Playwright driver, with the fake driver and text placeholder left test-only.
3. Execute, QA, UAT, and release gates fed by app health, browser probes, and bounded retry.
4. Redacted screenshot, trace, console, network, final URL, and app-runtime evidence.
5. `itsm app` and `itsm browser` outcomes for unavailable, authorization, and cleanup.
6. Six `test_us0152_*` markers in `standalone/tests/contract/us0152.contract.test.ts`.
7. Template twins of touched `standalone/` files stay aligned.

### Out of scope

- This phase implements nothing.
- Do not redesign US-0141 or US-0142 package boundaries.
- Do not rewrite `GateEngine` order.
- Do not reopen US-0149, US-0150, or US-0151.
- Do not start US-0153, US-0154, or US-0155.
- Pixel baselines and micro-VM isolation stay deferred.
- Do not flip US-0152 or tick AC-1..AC-6.
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

`sprints/S0172/plan-verify.json` is **PENDING**. Ultra-lean skips plan-verify at plan time. QA overwrites it inside build+verify.

## Proof

- `runtime_proof_id=rp-auto-20261011-us0152-plan-techlead-20261011T183005Z`
- `proof_hash=8e86f4dcb0753dcd06d6d94b06ad9060821370cf80fa3e6e044912c7b1a168ba`
- `proof_issued_at=2026-10-11T18:30:05Z`; `proof_ttl=2026-10-11T19:30:05Z`
- Canonical tuple: `{"orchestrator_run_id":"auto-20261011-us0152-plan","phase_id":"sprint-plan","proof_issued_at":"2026-10-11T18:30:05Z","proof_ttl_seconds":3600,"role":"tech-lead","runtime_proof_id":"rp-auto-20261011-us0152-plan-techlead-20261011T183005Z"}`
- `hash_recompute_confirmation=true`
