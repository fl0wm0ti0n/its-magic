# Architecture archive pack (2026-09-17)

- Rollover trigger: `ARCH_HOT_MAX_LINES=3000, ARCH_HOT_MAX_STORY_SECTIONS=120`
- Source: `docs/engineering/architecture.md`
- Archived units (oldest first, contiguous prefix): 1
- Retained units in hot file: 21
- First archived heading: `# BUG-0015 — OpenCode `/auto` plugin dispatch attach (compose US-0124/US-0125)`
- Last archived heading: `# BUG-0015 — OpenCode `/auto` plugin dispatch attach (compose US-0124/US-0125)`
- Verification tuple (mandatory):
  - archived_body_lines=161
  - preamble_lines=1
  - retained_body_lines=2845

---

# BUG-0015 — OpenCode `/auto` plugin dispatch attach (compose US-0124/US-0125)

## Overview

**`BUG-0015`** closes the **interactive `/auto` → plugin spawn linkage gap** on the OpenCode host. US-0124 shipped `spawnPhase` + write-guard + stop-matrix subprocess; US-0125 shipped dispatch-only `.opencode/commands/auto.md`. Runtime defect: `setup()` returns the API and registers only `ctx.tool.hook("execute.before")` — **no host-invoked entry** starts the spawn loop when the operator runs `/auto`, so the thin command stops at `STOP`.

**Research anchor**: **`R-0114`** (DQ1–DQ7 LOCKED). **Companion DEC**: **none** — Q7 / DQ7 additive; cite **R-0114** + compose **DEC-0124** / **DEC-0125** without amending Accepted bodies. **Out of scope**: BUG-0016 permissions; US-0131/US-0132; DEC-0122 matrix; Cursor Task port; TS stop-matrix rewrite; live OpenCode CI probe.

**Fresh context marker**: `tl-BUG0015-architecture-20260906T142000Z-fresh`
**Orchestrator run id**: `auto-20260906-bug0015`
**Timestamp**: 2026-09-06T14:20:00Z (UTC)
**Verdict**: PASS
**Next**: `/sprint-plan`

## Approach locked (A* — from R-0114 DQ1–DQ7)

**Approach A\*** (locked): In `setup(ctx)`, register v2 **`ctx.command.transform`** → **`editor.add({ name: "auto", execute })`** as the **primary** host-invoked entry. `execute` calls shared internal **`runAutoLifecycle`**, which owns the in-flight mutex, first-phase selection (kit selectors), `spawnPhase` + `dispatchStopMatrix` loop, and IsolationEvidence durable write. Defense: optional `ctx.event.subscribe` / `command.executed` for `name === "auto"` — secondary only, mutex-guarded. Missing attach surface → fail-closed **`OPENCODE_PLUGIN_DISPATCH_ATTACH_UNSUPPORTED`**. Missing `session.create` → existing **`OPENCODE_PLUGIN_SPAWN_UNSUPPORTED`**. Concurrent/re-entrant `/auto` → **`OPENCODE_AUTO_ALREADY_RUNNING`**. Thin `auto.md` stays STOP-only (DEC-0125 DQ5). Additive `test_bug0015_*` (7 markers); do not amend `test_us0124_*` / `test_us0125_*`.

| Option | Summary | Verdict |
|--------|---------|---------|
| **A\*** | **`command.transform` + `editor.add({ name: "auto", execute })` → `runAutoLifecycle` → `spawnPhase` loop; fail-closed attach/mutex codes; additive tests; cite R-0114** | **Preferred** — minimal compose gap fix; preserves DEC-0124/0125 |
| A2 (rejected) | Agent-prompt-only dispatch ("plugin owns spawn" prose as sole entry) | **Rejected** — success test (a) / BUG-0006; model can ignore prompt |
| A3 (rejected) | Rely on exported `spawnPhase` from `setup()` return alone | **Rejected** — current defect; host never invokes export |
| A4 (rejected) | Primary = `command.executed` event only | **Rejected** — R2 race after STOP; transform `execute` owns start |
| A5 (rejected) | Amend DEC-0124/DEC-0125 bodies | **Rejected** — DQ7 additive; Accepted DECs compose-only |
| A6 (rejected) | OpenCode-only first-phase resolver in TS | **Rejected** — DQ3; compose argv / resume_brief / scratchpad / US-0087 |

## Deferred closures (R-0114 + research critic CF1–CF7) — LOCKED here

| ID | Deferred item | Architecture lock |
|----|---------------|-------------------|
| CF1 / DQ1 | markdown `auto.md` vs `editor.add({ name: "auto" })` precedence | **Transform owns execute.** Thin `auto.md` remains STOP-only discoverability + `agent: auto` binding; it must **not** dual-fire spawn. If host also emits `command.executed`, secondary handler is mutex-gated (second entry → `OPENCODE_AUTO_ALREADY_RUNNING`). No spawn literals in `auto.md`. |
| CF2 / DQ5 | IsolationEvidence durable write helper | **Python subprocess bridge** appends IsolationEvidence tuple into `docs/engineering/state.md` (US-0048 / DEC-0029 SOT). Prefer thin helper or extend existing driver argv — **not** `ctx.storage` as durable SOT. Plugin returns evidence; Python persists. |
| CF3 / DQ3 | resume_brief / first-phase parse helper | **Python subprocess** (kit selectors via existing artifacts / driver) — **no** OpenCode-only TS resolver. Order: argv → resume_brief → scratchpad → US-0087 bug-queue (mutex `AUTO_SCHEDULER_CONFLICT` unchanged). |
| CF4 | Shared lifecycle entry name | **`runAutoLifecycle`** — single internal entry for interactive transform `execute` and headless `invokeHeadless` compose path. |
| CF5 / R3 | In-flight mutex TTL / clear-on-idle | Clear flag on loop exit (success or fail-closed). Safety TTL = **7200s** (2h) or earlier clear when `session.wait` completes / idle. Crash-left flag → TTL expiry allows re-entry. |
| CF6 / R2 | Primary vs secondary attach | **Primary = `command.transform` `execute`.** `command.executed` / subscribe = defense only. |
| CF7 / DQ7 | Companion DEC vs cite R-0114 | **No companion DEC.** Architecture `# BUG-0015` cites **R-0114**; DEC-0124/0125 bodies UNCHANGED. |

## Components

### Dispatch attach (DQ1 — AC-1, AC-2)

```ts
// inside setup(ctx) — additive alongside existing tool.hook write-guard
await ctx.command.transform((editor) => {
  editor.add({
    name: "auto",
    description: "its-magic auto: orchestrator dispatch entry (spawn-only).",
    execute: async ({ sessionID, prompt, delivery }) => {
      return runAutoLifecycle(ctx, { orchestratorSessionId: sessionID, prompt, delivery });
    },
  });
});
```

- If `ctx.command.transform` unavailable **and** no usable event subscribe attach → emit **`OPENCODE_PLUGIN_DISPATCH_ATTACH_UNSUPPORTED`**, stop `/auto`.
- Do **not** treat returning `{ spawnPhase }` from `setup()` as attach.

### Single-owner spawn + shared lifecycle (DQ2, DQ4)

- **Single owner = plugin** (`runAutoLifecycle` → `spawnPhase` → `dispatchStopMatrix`).
- Exported `spawnPhase` remains unit-testable + headless-callable; not host-auto-invoked alone.
- Write-guard `tool.hook("execute.before")` stays composed (DEC-0124 DQ8) — attach is additive.
- In-flight mutex: second interactive/headless overlap → **`OPENCODE_AUTO_ALREADY_RUNNING`** (distinct from `AUTO_SCHEDULER_CONFLICT`).

### First-phase selection (DQ3)

Compose kit selectors via Python bridge — do not invent OpenCode-only resolver (see CF3).

### Isolation evidence (DQ5)

Minimum fields: `parentID`, `sessionID`, `role`, `phase_id`, `timestamp`, `fresh_context_marker` with `sessionID !== parentID`. Null/throw/identical-id → **`OPENCODE_SUBTASK_IGNORED`**. Durable write per CF2.

### Reason codes (additive vocabulary — stub only; US-0126 owns full table)

| Code | When |
|------|------|
| `OPENCODE_PLUGIN_DISPATCH_ATTACH_UNSUPPORTED` | No usable `/auto` attach surface |
| `OPENCODE_AUTO_ALREADY_RUNNING` | Concurrent/re-entrant `/auto` while loop in-flight |
| `OPENCODE_PLUGIN_SPAWN_UNSUPPORTED` | `session.create` missing (unchanged DEC-0124) |
| `OPENCODE_SUBTASK_IGNORED` | null/throw/identical-id (unchanged) |

### Contract tests (DQ6 — additive; 7 markers)

Preferred: `tests/bug0015_contract_test.py` (+ optional mock-ctx extension). Do **not** amend `test_us0124_*` / `test_us0125_*`.

| # | Marker | Asserts |
|---|--------|---------|
| 1 | `test_bug0015_command_transform_registers_auto` | `setup` registers transform / `editor.add({ name: "auto" })` |
| 2 | `test_bug0015_auto_execute_invokes_spawn_phase` | mock execute → `session.create` with parentID/agent |
| 3 | `test_bug0015_missing_attach_fail_closed` | no attach → `OPENCODE_PLUGIN_DISPATCH_ATTACH_UNSUPPORTED` |
| 4 | `test_bug0015_missing_session_create_fail_closed` | attach ok, create missing → `OPENCODE_PLUGIN_SPAWN_UNSUPPORTED` |
| 5 | `test_bug0015_concurrent_reentry_fail_closed` | second `/auto` → `OPENCODE_AUTO_ALREADY_RUNNING` |
| 6 | `test_bug0015_auto_md_dispatch_only_static` | `auto.md` ≤20 lines; no spawn literals |
| 7 | `test_bug0015_compose_us0124_spawn_api_unchanged` | existing `spawnPhase` / reason-code exports present (read-only) |

## Touch surfaces (execute)

| Surface | Change |
|---------|--------|
| `.opencode/plugins/orchestrator.ts` + `template/.opencode/plugins/orchestrator.ts` | Attach + `runAutoLifecycle` + mutex + reason codes + isolation write bridge |
| `.opencode/commands/auto.md` (+ template) | Keep STOP-only; no spawn literals (static assert) |
| `tests/bug0015_contract_test.py` (+ template mirror / mock-ctx additive) | 7 markers |
| `docs/engineering/runbook.md` (+ template) | Optional BUG-0015 h3 stub for new reason codes (US-0126 full table unchanged ownership) |
| Python isolation / resume helper (thin) | Durable IsolationEvidence + first-phase selection bridge |

## Non-goals

- BUG-0016 Layer-1 permission matrix / DEC-0122 amend
- US-0131 / US-0132 config/model parity
- Amending DEC-0124 / DEC-0125 bodies
- Cursor Task-loop port / TS stop-matrix rewrite
- Live OpenCode runtime probe in CI

## Risks

| Risk | Severity | Mitigation |
|------|----------|------------|
| R1 markdown vs transform dual-fire | MEDIUM → LOW | CF1 lock + mutex + marker 5/6 |
| R2 `command.executed` after STOP race | MEDIUM → LOW | CF6 primary = transform execute |
| R3 mutex false-positive after crash | LOW | CF5 clear-on-exit + 7200s TTL |
| R4 reason-code stub drift vs US-0126 | LOW | stub + cross-link only |
| R5 BUG-0016 still blocks validators post-fix | LOW | expected; out of scope |

## AC coverage mapping (bug acceptance + R-0114)

| AC / expected slice | Architecture anchor | Seeds |
|---------------------|---------------------|-------|
| AC-1 `/auto` starts plugin spawn loop via host attach | § Dispatch attach; approach A* | T-001, T-002 |
| AC-2 Missing attach fail-closed `OPENCODE_PLUGIN_DISPATCH_ATTACH_UNSUPPORTED` | § Reason codes; marker 3 | T-001, T-005 |
| AC-3 Missing `session.create` → `OPENCODE_PLUGIN_SPAWN_UNSUPPORTED` (compose) | § Single-owner; marker 4 | T-002, T-005 |
| AC-4 IsolationEvidence + `OPENCODE_SUBTASK_IGNORED` + state.md SOT | § Isolation evidence; CF2 | T-003, T-005 |
| AC-5 Concurrent `/auto` → `OPENCODE_AUTO_ALREADY_RUNNING` | § Mutex CF5; marker 5 | T-002, T-005 |
| AC-6 `auto.md` remains dispatch-only (≤20 lines, no spawn) | § Non-goals / marker 6 | T-004, T-005 |
| AC-7 Compose US-0124 spawn API unchanged | § Approach A*; marker 7 | T-anch, T-005 |
| AC-8 Seven additive `test_bug0015_*` green (mock-ctx; no live probe) | § Contract tests | T-005 |

Acceptance checkbox: `docs/product/acceptance.md` BUG-0015 row remains unchecked until closure (US-0045).

## Atomic task seeds (for `/sprint-plan`)

| # | Seed | AC | Surfaces |
|---|------|----|----------|
| T-anch | Verify `# BUG-0015` H1 + approach A* + R-0114 DQ1–DQ7 + no DEC-0124/0125 body amend + CF1–CF7 closed | AC-7 | architecture.md (read-only), R-0114 |
| T-001 | Register `command.transform` / `editor.add({ name: "auto", execute })`; missing attach → `OPENCODE_PLUGIN_DISPATCH_ATTACH_UNSUPPORTED`; secondary event optional + mutex | AC-1, AC-2 | `orchestrator.ts` active + template |
| T-002 | Implement `runAutoLifecycle` + in-flight mutex (TTL 7200s / clear-on-exit) + call `spawnPhase` / `dispatchStopMatrix` loop; wire headless compose path | AC-1, AC-3, AC-5 | `orchestrator.ts` active + template |
| T-003 | IsolationEvidence durable write via Python bridge to state.md; first-phase selection via Python (argv → resume_brief → scratchpad → US-0087) | AC-4 | plugin + thin Python helper / driver argv |
| T-004 | Keep `auto.md` STOP-only (active + template); no spawn literals | AC-6 | `.opencode/commands/auto.md` + template |
| T-005 | Add 7 `test_bug0015_*` markers + mock-ctx harness extension; do not amend us0124/us0125 tests | AC-2..AC-8 | `tests/bug0015_contract_test.py` (+ template) |
| T-006 | Runbook h3 stub for two new reason codes; cross-link US-0126; optional parity scope `bug-0015` | AC-2, AC-5 | runbook.md + template |

**Task count**: 7 seeds (T-anch + T-001..T-006). `SPRINT_MAX_TASKS=12` — no auto-split. Suggest `/quick` only if execute reduces to attach-only one-liner (not expected).

## Decision linkage

- Decision: **none** (companion DEC not required — cite **R-0114**)
- Compose (do not amend): **DEC-0124**, **DEC-0125**, **DEC-0069**, **DEC-0051** / **US-0069**, **DEC-0078** / **US-0092**, **US-0048** / **BUG-0006**
- Research: **R-0114** (composes **R-0109**)
- Related: **US-0124**, **US-0125**, **BUG-0016** (out of scope), **US-0126** (full reason-code table)

