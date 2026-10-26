# Sprint S0185 summary — US-0164

## Context pack pointer (execute completion 2026-10-25)

- **EXECUTE_PASS** @ `2026-10-25T02:19:11Z`; `orchestrator_run_id=auto-20261025-us0164-execute`; writer=dev; next_scheduled_phase=**qa** (role qa); decision_gate=false.
- US-0164 gate cause-resolution + autonomy continuity (R-0175 approach A, DEC-0155) delivered at the decision layer. US-0164 remains **OPEN/P1**; AC-1..AC-9 **unchecked**; no DONE flip; no status change.
- Focused validation: **10/10** `tests/us0164_selfresolve_stop_contract_test.py`; **6/6** US-0158 regression; driver `--self-test` → `[AUTO_OUTER_DRIVER_SELF_TEST_OK]`; triad `--check` **exit 0 (PASS)** (post-rollover).
- Continuation pair WRITTEN (state-first, DEC-0153): `docs/engineering/state.md` bottom append + `handoffs/resume_brief.md` top prepend, byte-identical JSON, `validate_resume_pair(writer_role=dev)` → ok=true.

- sprint_id: S0185
- story_id: US-0164
- bug_id: (none)
- status: **EXECUTE_PASS / execute checkpoint complete**
- tasks: T-anch + T-001..T-009 (10; box-ticking outside Dev edit surface — recorded in `progress.md`)
- fresh_context_marker: `dev-US0164-execute-20261025T021911Z-fresh`
- runtime_proof_id: `rp-auto-20261025-us0164-execute-dev-20261025T021911Z-US-0164`
- proof_hash: `c9513bc6db7583eb02293d0ca552cd6121e53d9e659baa490a30d7f49f3abfd1` (two-method MATCH, 64 hex)
- No git commit, push, or npm publish. No `.env` read.

## What shipped

- **Gate cause-resolution stop-matrix branch** in `scripts/auto_outer_driver.py`: additive `--selfresolve-gate` flag; `_selfresolve_gate_branch` (returns `None` when not engaged → byte-identical legacy fall-through); per-gate `selfresolve_gate_decision` for `error,missing_input,decision_gate,security,publish`; `decision_gate` propose-and-hold (never auto-continue); `pause_request` safety-floor hard; `missing_input` transient/critical split reuse (critical hard, no new code); 5-key config surface (`validate_selfresolve_config`) + `HOST_CONFIG_INVALID` fail-closed for unknown gate id; non-suppressible segment-handoff notification.
- **Budget-gate provider fallback** (opt-in): `provider_switch_decision` (one-switch cap, `PROVIDER_SWITCH_APPLIED`/`PROVIDER_SWITCH_CAP_REACHED`) + `resolve_next_child_model_for_switch` (catalog via `model_tier_lib.resolve_model_for_phase`; no new vendors; no `MODEL_*` governance key); **budget counter NOT reset** (`budget_carryover=True`).
- **Drain handoff** (`_should_drain_advance` extension): fires on `SELFRESOLVE_ATTEMPT_EXHAUSTED` / `PROVIDER_SWITCH_CAP_REACHED` in addition to `completed`, fail-closed.
- **4 reason codes** registered: `SELFRESOLVE_ATTEMPT_EXHAUSTED`, `PROVIDER_SWITCH_APPLIED`, `PROVIDER_SWITCH_CAP_REACHED`, `SELFRESOLVE_DRAIN_HANDOFF`; `HOST_CONFIG_INVALID` reused (no 5th code).
- **Plugin** (`.opencode/plugins/orchestrator.ts`): `selfresolveGate` arg, `SELFRESOLVE_GATE_TOKENS`, `selfresolveGateForStop`, `continueSelfresolveGateSpawn` (one-attempt-per-`(phaseId,gate)` via `continueAttempts`, fail-closed); US-0158 path untouched; no `write_resume_pair`.
- **Docs** (`.opencode/agents/auto.md` + `.opencode/commands/auto.md`): US-0164 stop-condition bullet + paragraph.
- **Stop-matrix rows** in `docs/engineering/auto-orchestration-reference.md` (two US-0164 rows, US-0088/US-0092 tables).
- **Test** `tests/us0164_selfresolve_stop_contract_test.py` (+ `template/tests/` twin): exactly 10 `test_us0164_*` markers (decision-layer + subprocess byte-identity + plugin/auto.md source assertions + 4-pair parity via `_assert_pairs()`).

## Invariant held (gate NEVER bypassed)

- `pause_request` never self-resolved; `decision_gate` propose-and-hold, never auto-continue (no `decision_gate=false` flip); critical `missing_input` hard; no budget-counter reset; no `.env` read; no automatic npm publish; no automatic git push. Default-off → byte-identical to today (absent-flag == not-enabled JSON).

## Deferred (scoped follow-up)

- **`run_driver` stateful provider-switch cap-accounting + `PROVIDER_SWITCH_APPLIED` ledger row**: deferred (opt-in `AUTO_BUDGET_PROVIDER_FALLBACK=1`, default-off → byte-identical to today; the decision layer that T-004's done-when exercises is complete and fully tested; no contract/self/test exercises the stateful loop this pass). Documented in `sprints/S0185/progress.md`.

## Tests

- `python scripts/auto_outer_driver.py --self-test` → `[AUTO_OUTER_DRIVER_SELF_TEST_OK]`.
- `python -m pytest tests/us0164_selfresolve_stop_contract_test.py -q` → **10 passed**.
- `python -m pytest tests/us0158_opencode_recoverable_stop_contract_test.py -q` → **6 passed**.
- `python scripts/enforce-triad-hot-surface.py --repo . --check` → **exit 0 (PASS)** (post-rollover; pack `docs/engineering/state-archive/state-pack-20261025-a.md`).
- Active/template byte parity: TRUE across all five deliverables (`scripts/auto_outer_driver.py`, `.opencode/plugins/orchestrator.ts`, `.opencode/agents/auto.md`, `.opencode/commands/auto.md`, `tests/us0164_selfresolve_stop_contract_test.py`).
