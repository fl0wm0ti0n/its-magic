# Sprint S0166 — Task checklist (BUG-0032)

Eight tasks: T-anch + T-001..T-007. This is within `SPRINT_MAX_TASKS=12`; no split is
required. Execute in the listed order. All 8 task rows now `[x]` DONE (execute phase complete; BUG-0032 AC-1..AC-7 status flip is closure-owned per US-0045).

## Checklist

- [x] **T-anch — baseline / no-op (DC):** Read-only verify: `# BUG-0032` A1 + R-0156
  DQ1–DQ3 (LOCKED) + **no companion DEC** + config/scratchpad drift evidence (L318/L320
  vs L639/L640) + security-gate invariants (config L145-L146, L323-L324) +
  `check_intake_template_parity.py` scope-handler shape + US-0119/US-0131 regression
  baseline (10/10) + acceptance L223 unchecked + siblings HOLD. Anchors only; no
  mutation.
- [x] **T-001 — `--scope=autonomy-flags` semantic handler (AC-2, AC-3, AC-4, AC-5):**
  Author `scripts/check_intake_template_parity.py --scope=autonomy-flags` semantic
  handler (drift-detect; exit 0 on identity + exact banner; exit 1 + fixed-order
  `[AUTONOMY_FLAGS_DRIFT]` line(s) on divergence; `--repo` fixtures; `--scope=all` adds
  it after byte checks) + `template/` twin (byte-parity).
- [x] **T-002 — reason-code + runbook registration (AC-2, AC-6):** Register
  `AUTONOMY_FLAGS_DRIFT` in **`docs/engineering/reason_codes.md`** (compose-additive,
  US-0119 cross-ref + repair name) + **`docs/engineering/runbook.md`** remediation entry
  (live-wins operator-sync step = AC-6) + `template/` twins. **Not** the stop-matrix
  (BUG-0034 owns).
- [x] **T-003 — CI wiring (AC-3):** Wire `--scope=autonomy-flags` into
  `tests/run-tests.ps1` + `tests/run-tests.sh` (after US-0131; always-run; assert 0 then
  run the 8-marker suite; fail-closed).
- [x] **T-004 — 8-marker contract suite (AC-1..AC-7):** Author
  `tests/bug0032_autonomy_flags_drift_test.py` (+ `template/` twin) with the **8**
  `test_bug0032_*` markers per the DQ3 inventory + `tests/fixtures/bug0032_autonomy_flags/`;
  fixtures only; US-0119 `none` + security-hard invariants held; no real source edit by
  tests.
- [x] **T-005 — operator live-wins sync doc (AC-1, AC-6):** **Operator step (not a code
  task)**: live-sync remediation documented in the runbook (copy scratchpad → config); the
  code is drift-DETECT only. Record as the operator action in the runbook entry + closure
  evidence path.
- [x] **T-006 — compose / non-regression guard (AC-4, AC-5, AC-7):**
  US-0119 `AUTONOMY_PRESET=none` byte-identical + **12 per-feature flags not re-touched** +
  `INTAKE_AUTONOMY_MODE=0` / `INTAKE_SUBAGENT_FALLBACK=deny` unchanged + security-hard rows
  `n/a`/cap=0 unchanged + `pytest tests/us0119_autonomy_preset_test.py` regressions
  (2 pre-existing matrix-ref failures **not weakened, not repaired**) +
  `pytest tests/us0131_contract_test.py` 10/10 + `bug_issue_validate.py --check-acceptance`
  exit 0 **pre + post**.
- [x] **T-007 — QA / verify-work / release handoffs (downstream):** QA / verify-work /
  release handoffs (downstream phase work; `/sprint-plan` assigns fresh-role spawns;
  plan-verify deferred for ultra_lean).

## Completion evidence

- [x] `--scope=autonomy-flags` semantic scope in active + template byte-identical; existing
      scope tables unchanged.
- [x] Equal fixture → exit 0 + `[INTAKE_TEMPLATE_PARITY_OK] scope=autonomy-flags`;
      drift/missing/duplicate/malformed → exit 1 + fixed-order `[AUTONOMY_FLAGS_DRIFT]`
      line(s), no success banner.
- [x] `AUTONOMY_FLAGS_DRIFT` additive row in reason_codes.md + runbook remediation entry
      (AC-6 verbatim); **not** in the stop-matrix; `template/` twins byte-identical.
- [x] Mirrored BUG-0032 CI block after US-0131 in both `run-tests.ps1` + `run-tests.sh`;
      always-run.
- [x] 8 `test_bug0032_*` markers pass in active + template; fixtures only.
- [x] US-0119 `none` byte-identical; 12 flags, intake gates + security-hard unchanged;
      US-0131 10/10; US-0119 2 pre-existing failures not weakened/repaired.
- [x] `bug_issue_validate.py --repo . --check-acceptance` exit 0 pre + post.
- [x] BUG-0032 remains OPEN, AC-1..AC-7 `[ ]` unchecked — closure owns the flip.

## Execute evidence

_Pending — a fresh `/execute` dev context records commands and results. This planning
artifact makes no implementation, QA, live-host, release, or closure claim. T-004 authors
the 8 `test_bug0032_*` markers at execute; T-005 is an operator (not code) step._
