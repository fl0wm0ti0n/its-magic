# UAT — Sprint S0185 / US-0164

## QA UAT — 2026-10-25T02:45:00Z — **PASS**

Decision-layer UAT of the US-0164 self-resolve gate cause-resolution + autonomy-continuity delivery (R-0175 approach A, DEC-0155): **9/9 ACs PASS**, 0 failed. No live host claim is required for this decision-layer slice — the driver `--self-test`, the 10 contract markers, and independent sandbox runs of the stop-matrix JSON paths constitute the executable UAT.

| AC | UAT result | Evidence |
|---|---|---|
| AC-1 | PASS | Additive `--selfresolve-gate` branch; continue payload byte-identical to the US-0158 continue branch; per-gate table covers `error,missing_input,decision_gate,security,publish`; `missing_input` transient/critical split reuses `_is_recoverable` (critical hard, no new critical code). Sandbox: gate enabled → `continue_same_phase`, `next_phase=execute`, same 8 keys. |
| AC-2 | PASS | `decision_gate` → propose-and-hold, `decision_gate=true`, hard_stop, never auto-continue; no `decision_gate=false` flip, no auto-flip; stays in `HARD_STOP_REASONS` + `TERMINAL_CONTINUE_TOKENS`. `pause_request` + gate-override-forbidden never self-resolved. |
| AC-3 | PASS | 5 new `AUTO_*` keys all default-off with correct SOT precedence; unknown gate id → `HOST_CONFIG_INVALID` fail-closed with key+value (no 5th code); `MODEL_*` ignored. Sandbox: unknown gate id → `HOST_CONFIG_INVALID` + `cfg_detail`. |
| AC-4 | PASS | Budget gates not self-resolved; opt-in provider fallback at most one switch via `model_tier_lib.resolve_model_for_phase`; `PROVIDER_SWITCH_APPLIED`; budget counter NOT reset (carry-over); cap → `PROVIDER_SWITCH_CAP_REACHED`; catalog failure → hard stop, no switch. Sandbox: `AUTO_BUDGET_PROVIDER_FALLBACK=1` + loop_max → `provider_switch`, `budget_carryover:true`, `switched_tier=strong`. |
| AC-5 | PASS | `SELFRESOLVE_DRAIN_HANDOFF` predicate extension reuses US-0095 7-step verbatim; fires on handoff + `completed`; `drain_advance_action=spawned`; drain disabled / no OPEN story → `hard_stop`. Silent handoff. |
| AC-6 | PASS | Segment-handoff notification non-suppressible under `AUTO_QUIET=1`; self-resolve + provider-switch events in per-phase log + block-retry ledger; no new UI surface. |
| AC-7 | PASS | Absent flag → 8-key `hard_stop`; gate present but not enabled → byte-identical; loop_max default-off == `AUTO_BUDGET_PROVIDER_FALLBACK=0` → byte-identical. All-default → byte-identical behavior. |
| AC-8 | PASS | Two stop-matrix rows present; four reason codes registered and reachable; `HOST_CONFIG_INVALID` reused for unknown gate id (no 5th code). |
| AC-9 | PASS | 10 `test_us0164_*` contract markers pass; `--self-test` → `[AUTO_OUTER_DRIVER_SELF_TEST_OK]`; active/template byte parity holds for all five deliverables. |

- Commands: `python -m pytest tests/us0164_selfresolve_stop_contract_test.py -q` → **10 passed**; `python -m pytest tests/us0158_opencode_recoverable_stop_contract_test_test.py tests/us0157_opencode_critic_pair_contract_test.py -q` → **10 passed**; `python scripts/auto_outer_driver.py --self-test` → **`[AUTO_OUTER_DRIVER_SELF_TEST_OK]`**.
- Status guard: US-0164 remains **OPEN/P1** with AC-1..AC-9 and its acceptance row unchecked. Verify-work remains an independent next phase.

## Verify-work UAT — 2026-10-25T13:39:39Z — **VERIFY_PASS**

Terminal verify-work UAT reconciliation (repair-only; run `repair-20261025-us0164-verifywork-uatreconcile`). This reconciles the existing green QA UAT evidence to the verify-work terminal state — **NOT a waiver**: all **9/9 ACs PASS**, **0 failed / 0 unresolved** (unchanged from the QA UAT above). The evidence was independently re-verified by the canonical verify-work child at **2026-10-25T12:56:00Z** (evidence: `sprints/S0185/verify-work-findings.md` — us0164 **10 passed**, us0158 **6 passed**, self-test OK, 5-pair active/template byte parity, 4 safety-floor spot-runs). This repair re-ran the following commands in-session and re-confirmed green:

- `python -m pytest tests/us0164_selfresolve_stop_contract_test.py -q` → **10 passed**
- `python -m pytest tests/us0158_opencode_recoverable_stop_contract_test.py -q` → **6 passed**
- `python scripts/auto_outer_driver.py --self-test` → **`[AUTO_OUTER_DRIVER_SELF_TEST_OK]`**

| Lifecycle field | QA (prior) | Verify-work (this reconciliation) |
|---|---|---|
| `phase_id` | `qa` | `verify-work` |
| `status` | `QA_PASS` | `VERIFY_PASS` |
| `uat_lifecycle` | `qa_complete_verify_work_pending` | `verify_work_complete_release_pending` |
| `next_scheduled_phase` | `verify-work` | `release` |
| `next_scheduled_role` | `qa` | `release` |
| `reason_code` | `QA_PASS` | `VERIFY_PASS` |

- AC results: **9/9 PASS** (AC-1..AC-9), 0 failed, 0 unresolved — byte-identical to the QA UAT table above; no re-derivation, no re-scoring, no step detail changed.
- Terminal lifecycle: `verify_work_complete_release_pending`; `next_scheduled_phase=release`, `next_scheduled_role=release`.
- Status guard (verified by reading, NOT edited): US-0164 **OPEN/P1**, AC-1..AC-9 **unchecked** — `docs/product/backlog.md` L6319+ (`## US-0164`: `Priority: P1`, `Status: OPEN`, AC-1..AC-9 all `- [ ]`) and `docs/product/acceptance.md` L195 (`- [ ] US-0164 ...`). Not ticked; not flipped. US-0164 stays OPEN/P1.
