# Sprint S0178 — BUG-0029 API-key login

## Metadata

| Field | Value |
|---|---|
| sprint_id | **S0178** (`sprints/S0178/` was free; S0176 is BUG-0028; S0177 is BUG-0026; neither reused) |
| bug_id | BUG-0029 — **OPEN**; AC-1..AC-5 unchecked |
| story_id | (none) |
| status | EXECUTE_PASS |
| current_phase | execute complete; qa not started |
| delivery_mode | ultra_lean; plan-verify is skipped (`ultra_lean_not_in_resolved_phase_plan`) |
| research_anchor | **R-0168** |
| architecture_anchor | `docs/engineering/architecture.md` `# BUG-0029` |
| companion_DEC | **none** |
| milestone | none owns BUG-0029; DEC-0009 activation does not apply |
| task_count | 6 (T-anch + T-001..T-005; `SPRINT_MAX_TASKS=12` from `.cursor/scratchpad.md`; `.cursor/scratchpad.local.md` has no override; `SPRINT_AUTO_SPLIT=1`; split not triggered; not `/quick`) |
| component_scope | `COMPONENT_SCOPE_MODE=0` (no required scope metadata) |
| user_guide | `USER_GUIDE_MODE=0` (no user-guide task) |
| fresh_context_marker | `tl-BUG0029-sprintplan-20261015T231717Z-fresh` |

## Goal

`itsm auth login openai --type api_key` accepts one secret or fails honestly. Success is `{"provider":"<id>","auth":"configured"}` only after `checkAuth` reports a stored `api_key`. Cancel, empty, invalid, persist failure, and non-TTY login without `--api-key-stdin` exit non-zero and never emit that JSON.

The design is locked by R-0168 and `# BUG-0029`. This sprint does not re-decide it.

## Scope

### In scope (execute)

1. T-anch baseline: BUG-0029 stays OPEN, AC-1..AC-5 stay unchecked, and the current no-`io` path still reports configured success without a secret.
2. T-001: masked TTY secret prompt on the local login path and on `run.ts` when it still reaches login (AC-1).
3. T-002: `--api-key-stdin` (one stdin line, not an argv value), argv rejection, `AUTH_LOGIN_TTY_REQUIRED`, help text, and both README `itsm` paragraphs (AC-2).
4. T-003: cancel, empty, invalid, and persist-failure tokens; no configured JSON on those paths (AC-3).
5. T-004: emit configured success only after `checkAuth` returns stored `api_key`; `auth list`, logout, and `migrate --from-pi` stay unchanged (AC-4).
6. T-005: `standalone/tests/contract/bug0029.contract.test.ts` on Windows and Linux (AC-5).

### Out of scope

- No work outside T-anch and T-001..T-005. BUG-0029 stays OPEN. AC-1..AC-5 stay unchecked.
- Do not add `--api-key <value>` or `--api-key=`.
- Do not add a PTY dependency or a new package.
- Do not call a live provider. `allowModelNetwork` stays false. Verification is `checkAuth`, not HTTP.
- Do not statically import `run.ts` from the process entry. Do not import `@its-magic/runtime-host` or the pi-kernel barrel from the masked helper.
- Do not invent a template copy of the BUG-0028 contract file. Add `bug0029.contract.test.ts` only.
- Do not author a DEC. Do not edit `docs/engineering/decisions.md`.
- Do not edit BUG-0026 or BUG-0028. Do not reopen US-0150, US-0151, US-0154, US-0155, or US-0156.
- Do not treat Pi migration or the Pi TUI as this login prompt.
- Do not tick AC-1..AC-5. Do not flip BUG-0029 to DONE. Closure owns that flip.
- Do not read `.env`. No git commit, push, npm publish, `/execute`, or `/plan-verify` from this phase.

## Acceptance coverage

| AC | Tasks |
|---|---|
| AC-1 | T-001 (masked TTY secret; no echo, no log, no argv) |
| AC-2 | T-002 (`--api-key-stdin`, argv rejection, non-TTY token, help and README) |
| AC-3 | T-003 (cancel, empty, invalid, persist failure; no configured JSON) |
| AC-4 | T-004 (`checkAuth` gate; list, logout, and migrate unchanged) |
| AC-5 | T-005 (`bug0029.contract.test.ts` on Windows and Linux) |

T-anch records the baseline for every AC and changes no product code. Every AC has a task. Tasks are the six architecture seeds. No split: 6 tasks, cap 12.

## Risks

- Leaving `run.ts` on the no-`io` path would keep the false success. Both entry points share the helper.
- Raw mode left on after cancel would break the terminal. `finally` restores the previous mode.
- A secret in `err.message`, argv, or the prompt echo would fail AC-1 and AC-5. Stderr prints the fixed token only.
- Emitting configured JSON because `login` returned, without `checkAuth`, is the bug. Success waits on stored `api_key`.
- Pulling the pi-kernel barrel or `runtime-host` into the local class widens the cold path. The helper imports neither.
- Tests that only mock `io.prompt` miss the raw-mode contract. The raw-mode test fails if the secret is written to stdout.
- Scope drift into BUG-0028 startup or BUG-0026 publish is out of this sprint.

## Plan-verify

Ultra-lean skips plan-verify (`ultra_lean_not_in_resolved_phase_plan`). `sprints/S0178/plan-verify.json` is a SKIPPED placeholder only. This phase does not spawn `/plan-verify`.

## Proof

- Consumed architecture proof `rp-auto-20261016-bug0029-architecture-techlead-20261015T230823Z-BUG-0029` / `25444d45c0a4a936ec05115f9f1de11e4a8a250439627728484ed3988d568922` MATCH and in TTL at planning (issued 2026-10-15T23:08:23Z, ttl 2026-10-16T00:08:23Z).
- `runtime_proof_id=rp-auto-20261016-bug0029-sprint-plan-techlead-20261015T231717Z-BUG-0029`
- `proof_hash=997bb6736da28baea5648907af521e4769973f6841cc32328f71c53c3e9a8099`
- `proof_issued_at=2026-10-15T23:17:17Z`; `proof_ttl=2026-10-16T00:17:17Z`
- Canonical tuple: `{"orchestrator_run_id":"auto-20261016-bug0029","phase_id":"sprint-plan","proof_issued_at":"2026-10-15T23:17:17Z","proof_ttl_seconds":3600,"role":"tech-lead","runtime_proof_id":"rp-auto-20261016-bug0029-sprint-plan-techlead-20261015T231717Z-BUG-0029"}`
- `hash_recompute_confirmation=true`
- `model_id=inherit`; `model_provenance=provenance=host=cursor;path=.cursor/scratchpad.local.md;step=MODEL_TIER_<PHASE>`
