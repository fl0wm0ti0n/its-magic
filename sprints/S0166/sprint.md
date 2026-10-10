# Sprint S0166 — BUG-0032 AUTONOMY_FLAGS_DRIFT declared-mirror drift-detect + live-wins sync

## Metadata

| Field | Value |
|---|---|
| sprint_id | **S0166** (new and locked; next-free verified against `sprints/`: S0127..S0165 present + terminal) |
| bug_id | BUG-0032 — **OPEN**, P0; all seven acceptance criteria remain `[ ]` unchecked |
| status | PLANNED |
| current_phase | sprint-plan complete |
| delivery_mode | ultra_lean (plan-verify merged at /qa; no planning-phase QA spawn) |
| approach | A1 — semantic declared-mirror drift gate (drift-DETECT, not drift-FIX); live-wins resolver per US-0131/DEC-0131; 8 test markers; CI-always-run |
| research_anchor | **R-0156** (DQ1–DQ3 LOCKED — **consume, do not re-decide**) |
| architecture_anchor | `docs/engineering/architecture.md` `# BUG-0032` (8 seed tasks T-anch..T-007; 8 test markers PLANNED) |
| companion_DEC | **none** (R-0156 verdict "No companion DEC recommended"; next-free **DEC-0154 NOT allocated**) |
| task_count | 8 (T-anch + T-001..T-007; within `SPRINT_MAX_TASKS=12`) |
| plan-verify | SKIPPED — ultra_lean (`ultra_lean_not_in_resolved_phase_plan`); merged at /qa |
| fresh_context_marker | `tl-BUG0032-sprintplan-20261004T111542Z-fresh` |

## Goal and locked design

Add a **dedicated semantic** drift-detect scope to
`scripts/check_intake_template_parity.py` (NOT a byte-pair `SCOPES` entry) that
compares exactly two autonomy keys — `AUTONOMY_PRESET` then
`AUTONOMY_STOP_POLICY` — between the config baseline
(`.its-magic/config.json shared.<key>`, JSONC) and the live scratchpad
(`.cursor/scratchpad.md` `KEY=VALUE`). Both keys present exactly once and equal
→ **exit 0** + the exact banner `[INTAKE_TEMPLATE_PARITY_OK] scope=autonomy-flags`
(the AC-2 "exit 0 + reason-code-free banner" case). Value mismatch, missing key,
duplicate assignment, or unreadable/unparseable required input → **exit 1**, one
fixed-order line per affected key
`[AUTONOMY_FLAGS_DRIFT] scope=autonomy-flags key=<KEY> config=<value-or-<missing>> scratchpad=<value-or-<missing>>`
(AUTONOMY_PRESET first), **no success banner**. `--repo` redirects **both** inputs
for fixtures; `--scope=all` invokes the semantic scope **after** the byte-pair
checks and therefore intentionally fails until the operator remediates the current
drift. The scope is **drift-DETECT only, not drift-FIX** — remediation is the
**operator** live-wins sync documented in the runbook (T-005 is an operator action,
not a code task). This sprint does **not** mutate either file.

The `AUTONOMY_FLAGS_DRIFT` token is an **additive** diagnosis/remediation token in
the US-0126-owned documentation surface (reason_codes.md + runbook.md), **NOT** an
`autonomy_resolvable` auto-repair code in `scripts/data/autonomy_stop_matrix.yaml`
— that stop-matrix registration is owned by **BUG-0034** (acceptance L225). R-0156
DQ2 forbids altering stop-matrix logic or `security_hard` rows here.

## Scope

### In scope

1. `--scope=autonomy-flags` semantic drift-detect handler in
   `scripts/check_intake_template_parity.py` (T-001) + `template/` twin (byte-parity).
2. Additive `AUTONOMY_FLAGS_DRIFT` row in `docs/engineering/reason_codes.md` +
   remediation entry in `docs/engineering/runbook.md` (T-002) + `template/` twins.
3. Mirrored BUG-0032 CI block **immediately after US-0131** in **both**
   `tests/run-tests.ps1` and `tests/run-tests.sh` (T-003) — always-run, NOT
   changed-file filtered.
4. `tests/bug0032_autonomy_flags_drift_test.py` (+ `template/tests/` twin) with the
   **8** `test_bug0032_*` markers per the R-0156 DQ3 inventory +
   `tests/fixtures/bug0032_autonomy_flags/` (T-004); fixtures only, no real source edit.
5. Operator live-wins sync **documented** in the runbook (T-005); drift-DETECT only.
6. Compose / non-regression guard (T-006): US-0119 `none` byte-identity, 12 per-feature
   flags not re-touched, intake gates + security-hard unchanged, US-0119/US-0131
   regressions, validator pre+post.
7. QA / verify-work / release handoffs (T-007; downstream spawn, plan-verify deferred).

### Out of scope / standing guards

- **Do NOT** implement code in this phase (BUG-0006 / US-0048 spawn-only isolation).
- **Do NOT** author the 8 `test_bug0032_*` markers in this phase (T-004 at EXECUTE).
- **Do NOT** mutate `.its-magic/config.json` or `.cursor/scratchpad.md` (operator
  live-sync only, T-005; drift-DETECT, not drift-FIX).
- **Do NOT** mutate `scripts/check_intake_template_parity.py`,
  `scripts/data/autonomy_stop_matrix.yaml`, `docs/engineering/reason_codes.md`, or
  `docs/engineering/runbook.md` (all T-001/T-002/T-003/T-004/T-006 execute-phase work).
- **Do NOT** add `AUTONOMY_FLAGS_DRIFT` to the stop-matrix (BUG-0034 owns that
  registration; R-0156 DQ2 forbids it here).
- **Do NOT** flip BUG-0032 `Status: OPEN` → `DONE`, tick any AC, or author
  `sprints/S0166/closure-verification.md` (closure owns; honors BUG-0031's repaired
  3-allow curator flip-path, DEC-0152 DENY-FIRST).
- **Do NOT** author any `decisions/DEC-*` (none needed; DEC-0154 NOT allocated).
- **Do NOT** re-open US-0156 / US-0154 / US-0155 / US-0119 / US-0131 / DEC-0131 /
  BUG-0031 / BUG-0027 / BUG-0022 / BUG-0016 / BUG-0026 / BUG-0028 / BUG-0029.
- **Do NOT** restore TUI/RPC dispatch, JSON command template, or localhost endpoint;
  do NOT npm publish; do NOT git push; do NOT read `.env`; do NOT recurse `/auto`.

## Acceptance coverage

| Acceptance criterion | Planned task coverage |
|---|---|
| AC-1 config/scratchpad two-key identity OR operator decision recorded | T-002 (runbook live-wins sync entry, AC-6), T-005 (operator live-sync), T-006 (compose guards) |
| AC-2 `--scope=autonomy-flags` exit 0 parity / exit 1 `AUTONOMY_FLAGS_DRIFT` | T-001 (semantic scope), T-002 (token), T-004 (m2 equal-fixture banner + m3/m4 drift lines) |
| AC-3 CI harness both OS files, fail-closed on either-file PR | T-003 (after US-0131, both harnesses), T-004 (m5 fixed order), T-006 |
| AC-4 US-0119 `none` byte-identity + 12 flags + security-hard unchanged | T-006 (compose/non-regression), T-004 (m8 invariants) |
| AC-5 INTAKE_AUTONOMY_MODE=0 / INTAKE_SUBAGENT_FALLBACK=deny untouched | T-006 (compose/non-regression), T-004 (m8) |
| AC-6 runbook remediation entry titled `AUTONOMY_FLAGS_DRIFT` | T-002 (runbook entry, AC-6 verbatim), T-005 (operator action) |
| AC-7 `bug_issue_validate.py --check-acceptance` exit 0 pre+post | T-006 (validator gate) |
| DC baseline integrity (R-0156/# BUG-0032/no DEC/sibling HOLD) | T-anch |

All seven numbered criteria are covered; no `PLAN_AC_COVERAGE_GAP` exists.
T-007 is downstream QA/verify/release handoff (plan-verify deferred for ultra_lean).

## Task summaries and execution order

1. **T-anch** — Read-only verification of `# BUG-0032` A1 + R-0156 DQ1–DQ3 (LOCKED),
   no companion DEC, config/scratchpad drift evidence, security-gate invariants, scope
   handler shape, US-0119/US-0131 regression baseline, acceptance L223 unchecked, siblings HOLD.
2. **T-001** — Author `--scope=autonomy-flags` semantic handler + `template/` twin
   (byte-parity).
3. **T-002** — Register `AUTONOMY_FLAGS_DRIFT` in reason_codes.md + runbook.md
   (+ `template/` twins). **Not** the stop-matrix.
4. **T-003** — Wire `--scope=autonomy-flags` into both OS harnesses (after US-0131;
   always-run; assert 0 then run the 8-marker suite; fail-closed).
5. **T-004** — Author the 8-marker suite + fixtures (+ `template/` twin); fixtures only.
6. **T-005** — **Operator step (not a code task)**: live-sync remediation documented
   in the runbook (copy scratchpad → config); code is drift-DETECT only.
7. **T-006** — Compose / non-regression guard (US-0119 `none` byte-identical, 12 flags,
   intake gates + security-hard unchanged, US-0119/US-0131 regressions, validator pre+post).
8. **T-007** — QA / verify-work / release handoffs (downstream spawn; plan-verify deferred).

## Test contract

`tests/bug0032_autonomy_flags_drift_test.py` and its byte-identical `template/`
mirror must provide these **8** `test_bug0032_*` markers (fixtures/mocks only; no live
host probe — UAT_PROBE_FORBIDDEN held):

1. `test_bug0032_scope_registration_checker_byte_parity` — scope registered + active↔
   template checker byte parity.
2. `test_bug0032_equal_fixture_exit0_banner` — equal fixture → exit 0 + exact banner.
3. `test_bug0032_preset_only_drift_exit1` — AUTONOMY_PRESET-only drift → exit 1.
4. `test_bug0032_policy_only_drift_exit1` — AUTONOMY_STOP_POLICY-only drift → exit 1.
5. `test_bug0032_two_key_deterministic_fixed_order` — AUTONOMY_PRESET before
   AUTONOMY_STOP_POLICY.
6. `test_bug0032_malformed_missing_duplicate_fail_closed` → fail-closed exit 1.
7. `test_bug0032_repo_fixture_isolation_no_source_mutation` — `--repo` fixture
   isolation; no source mutation.
8. `test_bug0032_us0119_none_security_hard_invariants` — US-0119 `none` + 12 flags +
   security-hard `n/a`/cap=0 rows unchanged; intake gates unchanged.

## Completion gate

- [ ] `--scope=autonomy-flags` semantic scope exists in active + template (byte-identical);
      existing scope tables unchanged.
- [ ] Equal fixture → exit 0 + `[INTAKE_TEMPLATE_PARITY_OK] scope=autonomy-flags`;
      drift/missing/duplicate/malformed → exit 1 + fixed-order
      `[AUTONOMY_FLAGS_DRIFT]` line(s), no success banner.
- [ ] `AUTONOMY_FLAGS_DRIFT` additive row in reason_codes.md + runbook remediation entry
      (AC-6 verbatim); **not** in the stop-matrix; `template/` twins byte-identical.
- [ ] Mirrored BUG-0032 CI block after US-0131 in both `run-tests.ps1` and `run-tests.sh`;
      always-run.
- [ ] 8 `test_bug0032_*` markers pass in active + template; fixtures only, no real source edit.
- [ ] US-0119 `none` byte-identical; 12 flags, `INTAKE_AUTONOMY_MODE=0`,
      `INTAKE_SUBAGENT_FALLBACK=deny`, security-hard rows unchanged; US-0131 10/10;
      US-0119 2 pre-existing matrix-ref failures not weakened/repaired.
- [ ] `python scripts/bug_issue_validate.py --repo . --check-acceptance` exits 0 pre + post.
- [ ] BUG-0032 remains **OPEN**, AC-1..AC-7 remain `[ ]` unchecked — closure owns the flip
      (post-BUG-0031 curator 3-allow, DEC-0152 DENY-FIRST).

## Next phase

`/execute` in a fresh **dev** context. The sprint-plan phase does not implement, spawn,
run plan-verify, alter status/acceptance, or authorize continuation by itself. **STOP.**
