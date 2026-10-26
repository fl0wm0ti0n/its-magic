# Sprint S0185 progress — US-0164

- status: **EXECUTE_PASS**
- verdict: implementation validation PASS; continuation PAIR WRITTEN (state-first, dev); decision_gate=false; next_scheduled_phase=qa; next_scheduled_role=qa
- tasks: T-anch + T-001..T-009 complete (10)
- story: US-0164 remains **OPEN**. AC-1..AC-9 remain unchecked. Closure owns the DONE flip.
- fresh_context_marker: `dev-US0164-execute-20261025T021911Z-fresh`
- runtime_proof_id: `rp-auto-20261025-us0164-execute-dev-20261025T021911Z-US-0164`
- proof_hash: `c9513bc6db7583eb02293d0ca552cd6121e53d9e659baa490a30d7f49f3abfd1` (two-method MATCH: `token_cost_lib.compute_strict_proof_hash` + independent compact sorted-key SHA-256, 64 hex)
- record_key: `auto-20261025-us0164-execute|story|US-0164|execute|rp-auto-20261025-us0164-execute-dev-20261025T021911Z-US-0164`
- validation: `python scripts/auto_outer_driver.py --self-test` → `[AUTO_OUTER_DRIVER_SELF_TEST_OK]`; `python -m pytest tests/us0164_selfresolve_stop_contract_test.py -q` → **10 passed**; US-0158 regression `python -m pytest tests/us0158_opencode_recoverable_stop_contract_test.py -q` → **6 passed**; `python scripts/enforce-triad-hot-surface.py --repo . --check` → **exit 0 (PASS)** (post-rollover).

## Execute delivery (R-0175 approach A, DEC-0155)

Delivered at the **decision layer** (the stateless stop-matrix JSON branch + the
pure decision functions it delegates to). The gate is NEVER bypassed/weakened/
removed: `pause_request` never self-resolved; `decision_gate` propose-and-hold
(never auto-continue, no `decision_gate=false` flip); critical `missing_input`
hard; no budget-counter reset; no `.env` read; no auto npm publish; no auto
git push.

### T-anch — locked baseline verified (read-only)
- Four new reason codes have **0 prior occurrences** in production code: `SELFRESOLVE_ATTEMPT_EXHAUSTED`, `PROVIDER_SWITCH_APPLIED`, `PROVIDER_SWITCH_CAP_REACHED`, `SELFRESOLVE_DRAIN_HANDOFF`. `HOST_CONFIG_INVALID` (existing, US-0131) reused for unknown gate id (NOT a 5th code).
- Guards held: `pause_request` + gate-override-forbidden in `HARD_STOP_REASONS`; `decision_gate` in `HARD_STOP_REASONS` + `TERMINAL_CONTINUE_TOKENS`. `RESUME_BRIEF_AUTO_REFRESH=0`; `CROSS_MODEL_REVIEW=0`. `scripts/data/autonomy_stop_matrix.yaml` NOT edited.

### T-001 — `--selfresolve-gate` branch + guard path
- Additive optional flag in `run_stop_matrix_json`; US-0158 `--recoverable-class` branch wins when present; else `_selfresolve_gate_branch` (returns `None` when not engaged → byte-identical legacy fall-through). Enabled gate + safety-floor pass → `continue_same_phase` 8-key continue payload (byte-identical to the US-0158 continue branch, so the plugin's one-attempt-per-`(phaseId,gate)` respawn machinery is reused unchanged). Absent flag → today's JSON byte-identical. Driver never inspects/edits/re-scores the gate.

### T-002 — per-gate table + `decision_gate` propose-and-hold
- `selfresolve_gate_decision` over `error,missing_input,decision_gate,security,publish`. `decision_gate` → `hard_stop` + `SELFRESOLVE_PROPOSE_AND_HOLD` + `decision_gate=true` (never continue). `pause_request` → `hard_stop` + `PAUSE_REQUEST_SAFETY_FLOOR_HARD` under full self-resolve config.

### T-003 — `missing_input` transient/critical split reuse
- Reuses the existing `("critical","CRITICAL_MISSING_INPUT")` discriminant: critical → `CRITICAL_MISSING_INPUT_HARD` hard stop; transient → `continue_same_phase` (bounded obtain/derive); no new critical code.

### T-004 — budget-gate provider fallback + cap + carry-over
- `provider_switch_decision` (pure) + `resolve_next_child_model_for_switch` (catalog via `model_tier_lib.resolve_model_for_phase`). Budget gates (`loop_max`, `BACKLOG_MAX_STORIES_REACHED`) NOT in the self-resolve set; opt-in `AUTO_BUDGET_PROVIDER_FALLBACK=1`; at most one switch (`AUTO_PROVIDER_SWITCH_MAX=1`) → `PROVIDER_SWITCH_APPLIED`; cap hit → `PROVIDER_SWITCH_CAP_REACHED`; catalog failure → `CATALOG_RESOLUTION_FAILED` (hard stop, no switch); **budget counter NOT reset** (`budget_carryover=True`).
- **FOLLOW-UP (scoped, not forced):** the stateful `run_driver` provider-switch cap-accounting + `PROVIDER_SWITCH_APPLIED` **ledger row** is deferred to a follow-up. The decision layer that T-004's done-when ("applied") exercises is COMPLETE and fully tested (the stateless `run_stop_matrix_json` budget-gate branch already emits `provider_switch` + `PROVIDER_SWITCH_APPLIED` + `switched_*` + `budget_carryover`). The stateful loop is OPT-IN (default-off → byte-identical to today) and no contract test / self-test / test file exercises `run_driver`'s stateful loop this pass, so it is NOT forced into the live spawn loop (no untested stateful change).

### T-005 — `SELFRESOLVE_DRAIN_HANDOFF` predicate extension
- `_should_drain_advance` fires on `SELFRESOLVE_ATTEMPT_EXHAUSTED` / `PROVIDER_SWITCH_CAP_REACHED` IN ADDITION TO `completed`, bounded by drain-enabled + budget-remaining; fail-closed (`hard_stop`) when drain disabled or budget exhausted. Silent (no operator/auto re-invoke).

### T-006 — 5-key config surface + `HOST_CONFIG_INVALID` fail-closed
- `validate_selfresolve_config` over `AUTO_SELFRESOLVE_GATES` (default empty; default set when enabled), `AUTO_SELFRESOLVE_EXCLUDE=pause_request`, `AUTO_BUDGET_PROVIDER_FALLBACK=0`, `AUTO_PROVIDER_SWITCH_MAX=1`, `AUTO_BUDGET_EXHAUSTED_DRAIN=0`. Unknown gate id → `HOST_CONFIG_INVALID` with offending `AUTO_SELFRESOLVE_GATES=<value>`. Precedence via `host_runtime_config_lib.resolve_runtime_config`. All-default → byte-identical to today.

### T-007 — non-suppressible segment-handoff notification
- `selfresolve_segment_handoff_notification` → `suppressible=False`, `non_suppressible_under_auto_quiet=True` (US-0095 rule). Every self-resolve decision's notify is non-suppressible.

### T-008 — two stop-matrix rows + four reason-code registrations
- Two US-0164 rows added to `docs/engineering/auto-orchestration-reference.md` (US-0088/US-0092 tables). Four reason codes registered in `SELFRESOLVE_REASON_CODES` and reachable; `HOST_CONFIG_INVALID` reused (no 5th code).

### T-009 — 10 `test_us0164_*` contract markers + `--self-test` + parity
- `tests/us0164_selfresolve_stop_contract_test.py` (+ `template/tests/` twin), exactly 10 markers, all PASS: `test_us0164_cause_resolution_same_run_continue`, `test_us0164_gate_never_bypassed`, `test_us0164_pause_request_safety_floor_hard`, `test_us0164_per_gate_config_list_and_default`, `test_us0164_provider_fallback_one_switch_cap`, `test_us0164_budget_carryover_after_switch`, `test_us0164_silent_drain_handoff_trigger`, `test_us0164_hard_stop_drain_disabled_no_open_story`, `test_us0164_nonsuppressible_handoff_notify_under_quiet`, `test_us0164_default_off_byte_identity`.
- `--self-test` extended (4-code registration, safety floors, config defaults, unknown-gate fail-closed, provider cap/carry-over, drain handoff, non-suppressible notify) → `[AUTO_OUTER_DRIVER_SELF_TEST_OK]`.
- Active/template byte parity asserted by `_assert_pairs()` inside the test.

## Byte-identity verified (subprocess)
- absent-flag `--stop-reason=error` → 8-key `hard_stop`; enabled gate → `continue_same_phase` 8-key (byte-identical to US-0158 continue); **gate NOT enabled (default-off) → byte-identical to the absent-flag JSON** (`absent==not-enabled: True`); budget gate default-off → 8-key `hard_stop` (no `provider_switch`/`reason_code` keys); `bogusgate` → `HOST_CONFIG_INVALID` + `cfg_detail`; fallback-on `loop_max` → `provider_switch` + `switched_tier=strong` + `budget_carryover=true`; fallback-off `loop_max` → byte-identical `hard_stop`.

## Active/template byte parity (all five deliverables)
| deliverable | active==template | SHA-256 (16) |
|---|---|---|
| `scripts/auto_outer_driver.py` | TRUE | `CEBC0D8F9F5170E4` |
| `.opencode/plugins/orchestrator.ts` | TRUE | `A16FEB46641F6A6F` |
| `.opencode/agents/auto.md` | TRUE | `3A1CE023F132F3AA` |
| `.opencode/commands/auto.md` | TRUE | `481D8EE161D34DBF` |
| `tests/us0164_selfresolve_stop_contract_test.py` | TRUE | `C8461CBAB7FDC124` |

## Triad
- pre-append `--check` → **exit 0 (PASS)**; post-append `--check` → `STATE_ARCHIVE_REQUIRED surface=state lines=1204/1200 units=48/80` exit 1 → mandated `--rollover` (`rollover_complete units=1`; archived the oldest contiguous prefix unit **US-0157 / S0181 CLOSURE_PASS** into `state-pack-20261025-a.md`, **0** US-0164/S0185 lines archived; the new US-0164 execute checkpoint retained) → post-rollover `--check` → **exit 0 (PASS)**.

## Tasks box-ticking (surface note)
- `sprints/S0185/tasks.md` box-ticking is **outside the Dev edit surface** (denied); completion is recorded here in `progress.md` (this file) and in the state checkpoint instead. No box was ticked. US-0164 stays OPEN; AC-1..AC-9 stay unchecked.

## Status guard
- US-0164 **OPEN/P1**, AC-1..AC-9 **unchecked** (verified `docs/product/backlog.md` + `docs/product/acceptance.md`; not ticked; not flipped); no sprint content changed; `RESUME_BRIEF_AUTO_REFRESH=0`; `CROSS_MODEL_REVIEW=0`; no npm publish; no git commit/push; no `.env` read; no AC tick; no status flip; this child did NOT spawn `/qa` or `/auto`.
