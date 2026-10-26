# Sprint S0185 — Task checklist (US-0164)

Ten planned tasks: **T-anch + T-001..T-009**, 1:1 with the `# US-0164` task
seeds (R-0175 approach **A**, DEC-0155) and within `SPRINT_MAX_TASKS=12`.
Execute in order. Leave all boxes unchecked until execute. US-0164 remains
OPEN and AC-1..AC-9 remain unchecked.

## Checklist

- [ ] **T-anch — locked baseline and traceability (all ACs, no product change):** Read R-0175 (Q1–Q7 RESOLVED), `docs/engineering/architecture.md` `# US-0164`, and `decisions/DEC-0155.md`. Confirm US-0164 is OPEN/P1 with AC-1..AC-9 and its acceptance row unchecked. Inventory the delivery surfaces: `scripts/auto_outer_driver.py` (`run_stop_matrix_json` + the US-0158 `--recoverable-class` branch) and its template twin; `.opencode/plugins/orchestrator.ts` (+ twin); `.opencode/agents/auto.md` + `.opencode/commands/auto.md` (+ twins); `scripts/model_tier_lib.py` (`resolve_model_for_phase`); `handoffs/auto_block_retry/<run>.jsonl`; `scripts/data/autonomy_stop_matrix.yaml` (NOT edited). Confirm the four new reason codes (`SELFRESOLVE_ATTEMPT_EXHAUSTED`, `PROVIDER_SWITCH_APPLIED`, `PROVIDER_SWITCH_CAP_REACHED`, `SELFRESOLVE_DRAIN_HANDOFF`) have **0 prior occurrences** in production code. Confirm `pause_request` + gate-override-forbidden stay in `HARD_STOP_REASONS`; `decision_gate` stays in `HARD_STOP_REASONS` + `TERMINAL_CONTINUE_TOKENS`. Confirm `RESUME_BRIEF_AUTO_REFRESH=0` and `CROSS_MODEL_REVIEW=0`.
  **Done-when:** the baseline matches R-0175/`# US-0164`/DEC-0155 and the 0-prior-occurrence + guard invariants hold without changing status, ACs, content, or continuation artifacts.

- [ ] **T-001 — `--selfresolve-gate` branch + self-resolve guard path (AC-1):** In `scripts/auto_outer_driver.py run_stop_matrix_json`, add a **new optional** `--selfresolve-gate <gate_id>` flag, **additive to** (not replacing) the US-0158 `--recoverable-class` branch. Precedence: `--recoverable-class` present → US-0158 branch wins, unchanged; otherwise the self-resolve branch is evaluated. When `gate_id` is in the validated enabled set AND the safety-floor guards pass → `action=continue_same_phase` + `next_phase=<phase>` — **byte-identical to the US-0158 continue branch** — so the existing OpenCode plugin respawn-once machinery (one in-memory attempt per `(phaseId, gate)`, fresh marker) is reused unchanged. Absent the flag → today's JSON is byte-identical (default-off, US-0156 style). The driver never inspects, edits, or re-scores the gate; the SAME unchanged gate check re-runs; second hit → `SELFRESOLVE_ATTEMPT_EXHAUSTED`. Do not edit any other file.
  **Done-when:** the active `auto_outer_driver.py` carries the `--selfresolve-gate` branch exactly once; absent-flag output is byte-identical to today; the continue payload is byte-identical to the US-0158 branch.

- [ ] **T-002 — per-gate cause-resolution table + `decision_gate` propose-and-hold (AC-1, AC-2):** Implement the per-gate table for the default-enabled set `error, missing_input, decision_gate, security, publish`: `error`/`security`/`publish` → same-phase child repairs the cause, gate re-check re-runs unchanged, still failing → `SELFRESOLVE_ATTEMPT_EXHAUSTED`; `missing_input` → see T-003; `decision_gate` → **propose-and-hold, never auto-continue**: child writes a proposal artifact + a names-only `handoffs/auto_block_retry/<orchestrator_run_id>.jsonl` row; the gate re-check still fails; the run halts with `decision_gate=true` + a non-suppressible notification. Keep `decision_gate` in `HARD_STOP_REASONS` + `TERMINAL_CONTINUE_TOKENS` so no continue branch fires for it; no `decision_gate=false` flip, no auto-flip. `pause_request` + gate-override-forbidden are NEVER in the self-resolve set and stay hard in every configuration.
  **Done-when:** the table covers all five gates; `decision_gate` emits propose-and-hold + hard stop (no continue); `pause_request`/gate-override-forbidden remain hard stops under full self-resolve config.

- [ ] **T-003 — `missing_input` transient/critical split reuse (AC-1):** Reuse the existing `_is_recoverable` discriminant: `reason_code in ("critical","CRITICAL_MISSING_INPUT")` → **NOT** self-resolvable → hard stop (existing behavior, unchanged); transient → eligible for bounded obtain/derive in the same phase; still missing after one attempt → `SELFRESOLVE_ATTEMPT_EXHAUSTED`. Do not add a new critical-missing-input reason code.
  **Done-when:** critical `missing_input` hard-stops unchanged; transient `missing_input` is bounded and exhausts to `SELFRESOLVE_ATTEMPT_EXHAUSTED` after one attempt; no new critical code.

- [ ] **T-004 — budget-gate provider fallback + cap + carry-over + ledger row (AC-4):** Budget gates (`loop_max`, `BACKLOG_MAX_STORIES_REACHED`) are **NOT** in the self-resolve set. When a budget gate fires AND `AUTO_BUDGET_PROVIDER_FALLBACK=1` AND the one-switch-per-run cap is unused → at most ONE switch: the NEXT phase child's model is resolved via `scripts/model_tier_lib.py resolve_model_for_phase()` (US-0101/DEC-0086 catalog + US-0102/DEC-0087 role chain), selecting a **DIFFERENT** tier/alias than the one that hit the gate. No hard vendor slug, no new vendors, no new `MODEL_*` governance key (`MODEL_*` stay ignored per US-0132). Record a `reason_code=PROVIDER_SWITCH_APPLIED` row in the existing append-only, names-only `handoffs/auto_block_retry/<orchestrator_run_id>.jsonl`. Cap hit (second budget-gate hit, or `AUTO_PROVIDER_SWITCH_MAX` exceeded) → stop with `PROVIDER_SWITCH_CAP_REACHED`. **The budget counter is NOT reset — the remaining budget carries over (PO decision, fail-closed).** Scope: next-phase child model override only; the outer driver is model-less Python and the running parent model is unchanged. Catalog-resolution failure → no switch, the budget gate stays a hard stop.
  **Done-when:** at most one switch per run is applied and recorded; the counter is not reset; cap → `PROVIDER_SWITCH_CAP_REACHED`; catalog failure → hard stop with no switch.

- [ ] **T-005 — `SELFRESOLVE_DRAIN_HANDOFF` predicate extension + hard-stop fallback (AC-5):** Extend the US-0095 drain-advance predicate (`_should_drain_advance`) so the run also drain-advances when the stop is the self-resolve-exhausted / budget-cap handoff **in addition to** `stop_reason=completed`, AND drain is enabled (`AUTO_BACKLOG_DRAIN=1` or bug-queue per the US-0087 mutex) AND an eligible OPEN story exists AND budget remaining. Reuse the US-0095 7-step algorithm verbatim (READ boundary → ASSERT DEC-0069 pairing → SELECT per `AUTO_STORY_SELECTION=priority_then_backlog_order` → RELOAD/MATERIALIZE → PREPEND `resume_brief` → APPEND `state.md` breadcrumb → IMMEDIATELY spawn); `drain_advance_action=spawned`. `AUTO_BACKLOG_DRAIN=0` or no eligible OPEN story → `SELFRESOLVE_DRAIN_HANDOFF` is emitted but the action is `hard_stop` (fail-closed, unchanged). The handoff is silent (no operator re-invoke, no auto re-invoke).
  **Done-when:** the predicate fires on the handoff + `completed`; the 7-step runs and attests `spawned`; drain disabled / no OPEN story → `hard_stop`.

- [ ] **T-006 — 5-key config surface + `HOST_CONFIG_INVALID` fail-closed (AC-3, AC-7):** Add five new `AUTO_*`-namespaced governance keys, all default-off: `AUTO_SELFRESOLVE_GATES` (per-gate comma list, default empty; default set when enabled `error,missing_input,decision_gate,security,publish`); `AUTO_SELFRESOLVE_EXCLUDE=pause_request` (hard, cannot be removed, never self-resolved); `AUTO_BUDGET_PROVIDER_FALLBACK=0`; `AUTO_PROVIDER_SWITCH_MAX=1`; `AUTO_BUDGET_EXHAUSTED_DRAIN=0`. Precedence: US-0131/DEC-0131 SOT chain (`.its-magic/config.local.json` > `config.json` > `config.example.json`) with the DEC-0055 scratchpad adapter for the Cursor host (`.cursor/scratchpad.local.md` > `.cursor/scratchpad.md` > `.cursor/scratchpad.local.example.md`); read via `host_runtime_config_lib.resolve_runtime_config`. Unknown gate id in `AUTO_SELFRESOLVE_GATES` → **fail closed reusing `HOST_CONFIG_INVALID`** with the offending key+value in the detail (NOT a 5th new code, NOT silently ignored). `MODEL_*` keys stay ignored (US-0132). Default-off = byte-identical to today.
  **Done-when:** the five keys resolve with correct precedence; unknown gate id fails closed with `HOST_CONFIG_INVALID` + key+value; all-default → byte-identical behavior.

- [ ] **T-007 — non-suppressible segment-handoff notification + log/ledger (AC-6):** Under `AUTO_QUIET=1` the segment-handoff notification stays **non-suppressible** (US-0095 rule); only regular per-phase chatter is suppressed. Self-resolve and provider-switch events are recorded in the existing compact per-phase log and the block-retry ledger. No new screen or client.
  **Done-when:** the handoff notification is emitted under `AUTO_QUIET=1`; self-resolve + provider-switch events land in the per-phase log + ledger; no new UI surface.

- [ ] **T-008 — two stop-matrix rows + four reason-code registrations (AC-8):** Add exactly two rows to the US-0088/US-0092 stop matrix: (row 1) active gate in the validated `AUTO_SELFRESOLVE_GATES` set → one cause-resolution attempt per `(phaseId, gate)` via the same-phase child → `continue_same_phase` if the unchanged gate re-check passes, else `SELFRESOLVE_ATTEMPT_EXHAUSTED`; (row 2) `SELFRESOLVE_ATTEMPT_EXHAUSTED` or budget-gate after provider fallback (`PROVIDER_SWITCH_CAP_REACHED`) → silent drain handoff (`SELFRESOLVE_DRAIN_HANDOFF`) when drain is enabled + eligible OPEN story + budget remaining, else `hard_stop` (fail-closed, unchanged). Register the four new reason codes: `SELFRESOLVE_ATTEMPT_EXHAUSTED`, `PROVIDER_SWITCH_APPLIED`, `PROVIDER_SWITCH_CAP_REACHED`, `SELFRESOLVE_DRAIN_HANDOFF`. `HOST_CONFIG_INVALID` (existing, US-0131) is reused for unknown gate ids.
  **Done-when:** the two rows are present; all four codes are registered and reachable; `HOST_CONFIG_INVALID` is reused (no 5th code).

- [ ] **T-009 — 10 `test_us0164_*` contract tests + `--self-test` + parity (AC-9):** Author `tests/us0164_selfresolve_stop_contract_test.py` with exactly 10 `test_us0164_*` markers: `test_us0164_cause_resolution_same_run_continue` (error gate repaired → `continue_same_phase`, no re-invoke); `test_us0164_gate_never_bypassed` (no `decision_gate=false` flip, no threshold change, no removal — gate check re-runs unchanged); `test_us0164_pause_request_safety_floor_hard` (under full self-resolve config; no `.env` read, no auto npm publish, no auto git push); `test_us0164_per_gate_config_list_and_default` (empty default; default set when enabled; unknown gate id → `HOST_CONFIG_INVALID` fail-closed); `test_us0164_provider_fallback_one_switch_cap` (`PROVIDER_SWITCH_CAP_REACHED`); `test_us0164_budget_carryover_after_switch` (counter NOT reset); `test_us0164_silent_drain_handoff_trigger` (`SELFRESOLVE_DRAIN_HANDOFF` fires the US-0095 7-step); `test_us0164_hard_stop_drain_disabled_no_open_story`; `test_us0164_nonsuppressible_handoff_notify_under_quiet`; `test_us0164_default_off_byte_identity` (absent flag keeps today's JSON; all 5 keys default-off → byte-identical behavior). Extend `auto_outer_driver.py --self-test` and assert active/template byte parity for the driver, plugin, and `auto.md` agent/command pairs (US-0017 style).
  **Done-when:** the 10 `test_us0164_*` markers pass; `--self-test` passes; active/template parity is byte-identical within each pair.

## AC traceability

| AC | Tasks | Backlog anchor | Research | Architecture |
|---|---|---|---|---|
| AC-1 | T-001, T-002, T-003 | `docs/product/backlog.md` `## US-0164` AC-1 | R-0175 | `# US-0164` |
| AC-2 | T-002 | `## US-0164` AC-2 | R-0175 | `# US-0164` |
| AC-3 | T-006 | `## US-0164` AC-3 | R-0175 | `# US-0164` |
| AC-4 | T-004 | `## US-0164` AC-4 | R-0175 | `# US-0164` |
| AC-5 | T-005 | `## US-0164` AC-5 | R-0175 | `# US-0164` |
| AC-6 | T-007 | `## US-0164` AC-6 | R-0175 | `# US-0164` |
| AC-7 | T-006 | `## US-0164` AC-7 | R-0175 | `# US-0164` |
| AC-8 | T-008 | `## US-0164` AC-8 | R-0175 | `# US-0164` |
| AC-9 | T-009 | `## US-0164` AC-9 | R-0175 | `# US-0164` |

T-anch links every task → AC → backlog row → research R-0175 → architecture
`# US-0164` → DEC-0155. Every AC is covered; no split.

## Execute boundary

US-0164 stays OPEN/P1; AC-1..AC-9 and its acceptance row stay unchecked.
Closure owns any DONE flip. Execute is authorized now: the 4 non-allow-listed
sprint artifacts (`progress.md`, `summary.md`, `uat.md`, `uat.json`,
`qa-findings.md`, `release-findings.md`) are dev/qa-owned per S0163/S0166/S0184,
so their isolation-guard denial is honored-not-forced and is **not** a blocker
or decision_gate. The plan-verify PENDING stub is recorded (ultra_lean merges
plan-verify into build+verify). This plan records the successor DEC-0153
state-first continuation pair and authorizes `/execute` in a fresh dev context.
