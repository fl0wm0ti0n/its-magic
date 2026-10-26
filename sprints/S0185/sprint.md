# Sprint S0185 — US-0164 Gate cause resolution and autonomy continuity

## Metadata

| Field | Value |
|---|---|
| sprint_id | **S0185** (`sprints/S0185/` was free; S0184 is BUG-0037; S0183 is BUG-0038 (DONE/released); S0182 is US-0158; no sprint reused) |
| story_id | US-0164 — **OPEN/P1**; AC-1..AC-9 unchecked |
| bug_id | (none) |
| status | PLANNED (story remains OPEN) |
| current_phase | sprint-plan planning is complete (SPRINT_PLAN_PASS); execute not started |
| delivery_mode | ultra_lean; effective plan `[spec, plan, build+verify, ship]`; plan-verify is a **PENDING** stub for the later QA phase (merged into build+verify) |
| research_anchor | **R-0175** approach **A** |
| architecture_anchor | `docs/engineering/architecture.md` `# US-0164` |
| companion_DEC | **DEC-0155** (Accepted, 2026-10-24) |
| task_count | 10 (T-anch + T-001..T-009; `SPRINT_MAX_TASKS=12`; under cap, no split; not `/quick`) |
| fresh_context_marker | `tl-US0164-sprint-plan-20261024T224208Z-fresh` |

## Goal

Make an `/auto` run that halts at an active gate resolve the **cause** of that
gate and continue the **same** run without an operator or auto re-invoke —
never bypassing, weakening, or disabling the gate. R-0175 approach **A**,
`# US-0164`, and DEC-0155 are binding; this sprint does not re-decide them.

The delivery is an additive, default-off `--selfresolve-gate` branch on the
existing Python stop-matrix JSON path, reusing the US-0158
`continue_same_phase` one-attempt-per-`(phaseId, gate)` machinery, the
US-0101/DEC-0086 provider catalog, and the US-0095 drain-advance algorithm.
Absent the flag (or all keys default-off) the behavior stays byte-identical to
today (US-0156 AC style).

## Scope

### In scope (execute)

1. T-anch records the US-0164 baseline (R-0175, `# US-0164`, DEC-0155, the four reason codes' 0 prior occurrences, all OUT guards, no status/AC mutation) without product change.
2. T-001 adds the `--selfresolve-gate` branch + self-resolve guard path in `run_stop_matrix_json` (absent flag keeps today's JSON; AC-1).
3. T-002 implements the per-gate cause-resolution table + `decision_gate` propose-and-hold terminal-continue exclusion (AC-1/AC-2).
4. T-003 reuses the `missing_input` transient/critical split via `_is_recoverable` (AC-1).
5. T-004 implements the budget-gate provider fallback + `AUTO_PROVIDER_SWITCH_MAX` accounting + budget carry-over + `PROVIDER_SWITCH_APPLIED` ledger row (AC-4).
6. T-005 extends the `SELFRESOLVE_DRAIN_HANDOFF` predicate to `_should_drain_advance` + hard-stop fallback (AC-5).
7. T-006 adds the 5-key config surface + `HOST_CONFIG_INVALID` fail-closed + unknown-gate-id detail (AC-3/AC-7).
8. T-007 makes the segment-handoff notification non-suppressible under `AUTO_QUIET=1` + per-phase log/ledger recording (AC-6).
9. T-008 adds the two stop-matrix rows + the four reason-code registrations (AC-8).
10. T-009 authors the 10 `test_us0164_*` contract tests + `--self-test` extensions + active/template parity (AC-9).

### Out of scope

- No work outside T-anch and T-001..T-009. US-0164 remains **OPEN/P1**; AC-1..AC-9 and its acceptance row remain unchecked.
- Do not reopen or rewrite US-0088, US-0092, US-0095, US-0101, or US-0156. Do not weaken the US-0092 AC-10 hard-stop class (`.env`, publish/push) or the US-0088 non-suppressible rules.
- Do not change the DEC-0153 orchestrator write lock or the US-0157/US-0158 continuation-pair repair. Parent/orchestrator stays read/validate/spawn-only.
- Do not add new provider vendors; the switch reuses the US-0101 local catalog via `model_tier_lib` (no hard vendor slug, no new `MODEL_*` governance key — `MODEL_*` stay ignored per US-0132).
- Do not reset the budget counter after a provider switch (PO decision — carry over, fail-closed).
- `pause_request` exclusion is hard and can never be self-resolved; `decision_gate` is propose-and-hold, never auto-continue.
- Do not read `.env`; no npm publish; no git commit/push; no AC ticks; no new screen or client (existing compact per-phase log).
- Do not call `write_resume_pair`, set `RESUME_BRIEF_AUTO_REFRESH` (stays `0`), or auto-repair a map. `CROSS_MODEL_REVIEW=0` (no critic).
- Do not edit `scripts/data/autonomy_stop_matrix.yaml` (DEC-0119 two-tier matrix unchanged); do not edit sibling sprint dirs or the `# US-0164` architecture section.

## Acceptance coverage

| AC | Tasks |
|---|---|
| AC-1 | T-001, T-002, T-003 (cause-resolution branch + per-gate table + `missing_input` split; same run continues; gate never bypassed/weakened/disabled) |
| AC-2 | T-002 (safety floor non-negotiable; `pause_request` + gate-override-forbidden stay in `HARD_STOP_REASONS`; `decision_gate` propose-and-hold, no `decision_gate=false` flip) |
| AC-3 | T-006 (per-gate comma list, default empty, default set when enabled; unknown gate id fails closed) |
| AC-4 | T-004 (budget-gate provider fallback; at most one switch/run; `PROVIDER_SWITCH_APPLIED`/`PROVIDER_SWITCH_CAP_REACHED`; budget counter NOT reset) |
| AC-5 | T-005 (`SELFRESOLVE_DRAIN_HANDOFF` extends the US-0095 drain-advance predicate; hard stop when drain disabled or no OPEN story) |
| AC-6 | T-007 (segment-handoff notification non-suppressible under `AUTO_QUIET=1`; events recorded in compact per-phase log + ledger; no new screen/client) |
| AC-7 | T-006 (5-key config surface, all default-off; absent flag / all-default → byte-identical) |
| AC-8 | T-008 (two stop-matrix rows; four reason-code registrations; `HOST_CONFIG_INVALID` reused) |
| AC-9 | T-009 (10 `test_us0164_*` contract tests + `--self-test` extensions + active/template parity) |

Every AC maps to at least one task. T-anch records the baseline for every AC and
changes no product content. The ten architecture task seeds are retained 1:1; no
split is required under the cap of 12 (`SPRINT_AUTO_SPLIT` not triggered).

## Risks and controls

- **Both flags match one stop_reason** (new `--selfresolve-gate` vs US-0158 `--recoverable-class`): flags are mutually exclusive by construction (gate id vs recoverable class); terminal-token guards disallow both; precedence locks `--recoverable-class` present → US-0158 wins unchanged, else self-resolve branch (T-001).
- **`decision_gate` becomes a continue**: it stays in `HARD_STOP_REASONS` + `TERMINAL_CONTINUE_TOKENS`; the self-resolve branch explicitly excludes it (emit `hard_stop` + `decision_gate=true` + proposal artifact, no auto-flip) (T-002).
- **Provider switch conflicts with US-0132**: it reads the catalog via `model_tier_lib`, NOT a `MODEL_*` key; `host_runtime_config_lib` unchanged; `MODEL_*` stay ignored (T-004).
- **Budget-counter reset regression** (provider cycling manufactures budget): PO decision — counter NOT reset, carry over (T-004).
- **Drain handoff firing when it should hard-stop**: `SELFRESOLVE_DRAIN_HANDOFF` emitted but `action=hard_stop` when `AUTO_BACKLOG_DRAIN=0` or no eligible OPEN story (T-005).
- **Unknown gate id silently ignored**: `HOST_CONFIG_INVALID` fail-closed with offending key+value (NOT a 5th new code) (T-006).
- **`AUTO_QUIET=1` suppressing the handoff notification**: the handoff notification is non-suppressible; only regular chatter is suppressed (T-007).
- **Active/template drift**: each active/template pair (driver, plugin, `auto.md` agent, `auto.md` command) stays byte-identical within the pair; T-009 re-verifies parity.
- **Task count exceeds 12**: the seed list is within the cap; a ninth-plus task would trigger `SPRINT_AUTO_SPLIT` — this plan stays at ten.

## 4-artifact denial — HONORED-NOT-FORCED (dev/qa-owned), NOT blocked

`sprints/S0185/sprint.md` and `sprints/S0185/tasks.md` are the only
tech-lead allow-listed sprint-plan deliverables (the tech-lead permission map
allows `sprints/S*/sprint.md` and `sprints/S*/tasks.md`). The plan-verify
**PENDING** stub and the later-phase stubs are **dev/qa-owned** per the binding
S0163/S0166/S0184 precedent, and their isolation-guard denial (where applied)
is **honored, not forced** — it is **neither a decision_gate nor a blocking
condition**:

- `sprints/S0185/plan-verify.json` — **qa-owned** (PENDING stub at plan time per the S0170/S0173 story precedent; QA overwrites it inside build+verify; ultra_lean merges plan-verify into build+verify).
- `sprints/S0185/progress.md` — **dev-owned** (created at `/execute`); **NOT** a `/sprint-plan` deliverable.
- `sprints/S0185/summary.md` — **dev/qa-owned** (post-execution summary; written at execute/qa).
- `sprints/S0185/uat.md`, `uat.json`, `qa-findings.md`, `release-findings.md` — **qa/release-owned** (created at `/qa`/`/release`).

This child writes the plan (sprint.md + tasks.md) and the plan-verify PENDING
stub; it does not treat the absence of the dev/qa-owned artifacts as a
blocker. The plan is within the task cap, so `SPRINT_PLAN_PASS` is lawful.

## Plan-verify

Plan-verify is **merged into build+verify** (`ultra_lean`): it is not spawned as
a separate phase. A **PENDING** stub is recorded at
`sprints/S0185/plan-verify.json` (`ULTRA_LEAN_PLAN_VERIFY_DEFERRED`); QA
overwrites it inside build+verify. The stub's `next_phase_after_plan_verify` is
`execute` (the first canonical phase of the `build+verify` macro).

## Proof

- Consumed architecture proof `rp-auto-20261024-us0164-architecture-20261024T185500Z-US-0164` / `7e47c93af12269955ae75f83334f83e583ad7d10e1e4d4dc4cd301f12044b085` **recompute MATCH** (integrity intact). **Out-of-TTL at this boundary** (issued 2026-10-24T18:55:00Z, ttl to 2026-10-24T19:55:00Z; boundary 2026-10-24T22:42:08Z; ~167 min past expiry) — recorded as a **freshness deviation, not an integrity failure**; DEC-0153 pair validation is the parent's duty.
- `runtime_proof_id=rp-auto-20261024-us0164-sprint-plan-20261024T224208Z-US-0164`
- `proof_hash=5cdac6cd6f379f39a735c9ea8c5150fbf0d7da13fd75b83061ff98c5bd478752`
- `proof_issued_at=2026-10-24T22:42:08Z`; `proof_ttl=2026-10-24T23:42:08Z`
- Canonical tuple: `{"orchestrator_run_id":"auto-20261024-us0164","phase_id":"sprint-plan","proof_issued_at":"2026-10-24T22:42:08Z","proof_ttl_seconds":3600,"role":"tech-lead","runtime_proof_id":"rp-auto-20261024-us0164-sprint-plan-20261024T224208Z-US-0164"}`
- `hash_recompute_confirmation=true` (minted via `token_cost_lib.compute_strict_proof_hash`, independently recomputed with a fresh compact sorted-key SHA-256 over the same tuple — **MATCH**, 64 hex)
- `model_id=zelisko_llm/qwen3.8-27b`; `model_provenance=fresh canonical phase child (tech-lead sprint-plan)`
