# Sprint S0164 — Task checklist (BUG-0031)

Total tasks: 8 (T-anch + T-001..T-007). Within `SPRINT_MAX_TASKS=12`; no split is required.
The eight map 1:1 to the architecture `# BUG-0031` task seeds (L3393-3400); the 8 markers of the
architecture test contract (DQ9) are distributed across T-005 (m1–m6 + m7) and T-006 (m3 parity),
with m8 (`no_sibling_mutation`) asserted at T-005/T-007 regression and compose-guard.

## Execution order

1. T-anch — Verify planning constraints (anchors, surfaces, guards) read-only
2. T-001 — Apply the 3-allow delta to `.opencode/agents/curator.md` (active)
3. T-002 — Template mirror `template/.opencode/agents/curator.md` (byte-parity, US-0017)
4. T-003 — Add `CLOSURE_PERMISSION_FLIP_PATHS_DENIED` (rich pair + runbook + reason_codes; additive)
5. T-004 — DQ6 OpenCode-surface parity note (rich pair, additive prose after L10)
6. T-005 — Author `tests/bug0031_opencode_closure_flip_authz_test.py` (active), 8 `test_bug0031_*` markers
7. T-006 — Author `template/tests/bug0031_opencode_closure_flip_authz_test.py` (byte-parity mirror)
8. T-007 — Run full suite green (bug0031 + bug0027 + bug0016 + `bug_issue_validate.py --check-acceptance`)

## Checklist

- [ ] **T-anch**: Verify `# BUG-0031` A1 (A\*) + R-0155 DQ1–DQ10 LOCKED + **no companion DEC** (R-0155 L16032) + curator/qa role files (active + template, before state) + the four `closure.md` copies (rich pair `.cursor/commands/closure.md` + `template/.cursor/commands/closure.md`, thin pair `.opencode/commands/closure.md` + `template/.opencode/commands/closure.md`) + DEC-0051/0152/0052 compose + `test_bug0027_*`/`test_bug0016*` patterns + US-0156 AC-7 & BUG-0022 remain un-ticked + `.cursor/agents/curator.mdc` has **no `permission:` block**. Confirm the active curator `edit:` block still matches the architecture BEFORE (L7 `state.md` held; no `backlog.md`/`acceptance.md`/`sprints/S*/closure-verification.md` allows yet). Do **not** edit architecture, research, backlog status, or acceptance. (DC)
- [ ] **T-001**: In `.opencode/agents/curator.md` (active), append **exactly three** `edit:` `allow` rows **after** `handoffs/archive/**` and **before** `bash: ask`, in this order: `"docs/product/backlog.md": allow`, `"docs/product/acceptance.md": allow`, `"sprints/S*/closure-verification.md": allow`. Append-only. Do **not** reorder / move / widen the broad `"**": deny` row (keep it first); do **not** touch `bash: ask` / `task: deny`; do **not** add a 4th allow. (AC-1, AC-3)
- [ ] **T-002**: Mirror the T-001 three-row append byte-for-byte into `template/.opencode/agents/curator.md` (active↔template byte-parity, US-0017); assert `active.read_bytes() == template.read_bytes()`. (AC-1, AC-3)
- [ ] **T-003**: Add `CLOSURE_PERMISSION_FLIP_PATHS_DENIED` (additive) to `.cursor/commands/closure.md` `## Fail-safe reason codes and remediation guidance` table (L161-171) + `## Stop conditions` bullet list (L56-74), and mirror byte-parity into `template/.cursor/commands/closure.md`; append the row to `docs/engineering/runbook.md` § Closure troubleshooting table (L4349-4357) and register in `docs/engineering/reason_codes.md` (compose-additive). Do **not** rename/replace the existing 7 `CLOSURE_*` codes. (AC-1)
- [ ] **T-004**: Add the DQ6 OpenCode-surface parity note (additive prose) to `.cursor/commands/closure.md` immediately after the existing `override` bullet (L10), before `## Phase responsibility`, adopting the R-0155 DQ6 verbatim wording (qe unspawnable → curator sanctioned alternate; 3 flip paths; fail-closed `CLOSURE_PERMISSION_FLIP_PATHS_DENIED`; never operator hand-flip); mirror byte-parity into `template/.cursor/commands/closure.md`. Do **not** add to the thin `.opencode/commands/closure.md` pair. (AC-1, AC-4)
- [ ] **T-005**: Author `tests/bug0031_opencode_closure_flip_authz_test.py` (active) with the 8 markers `test_bug0031_*`: `curator_flip_paths_present_active`; `curator_flip_paths_present_template`; `curator_active_template_byte_parity`; `qa_flip_paths_denied`; `deny_before_allow_index`; `sprint_wildcard_shape`; `fail_closed_diagnostic_token_present`; `no_sibling_mutation`. Mock-injection style, no live OpenCode probe (`UAT_PROBE_FORBIDDEN`). Do **not** modify `test_bug0027_*` / `test_bug0016*`. (AC-1..AC-5)
- [ ] **T-006**: Author `template/tests/bug0031_opencode_closure_flip_authz_test.py` (byte-parity mirror), including `test_bug0031_curator_active_template_byte_parity`. (AC-3, AC-5)
- [ ] **T-007**: Run and record regressions: `test_bug0031_*` (active + template) → green; `test_bug0027_*` (10 markers) + `test_bug0016*` (8 markers) green **unmodified** (compose); `python scripts/bug_issue_validate.py --backlog docs/product/backlog.md --check-acceptance` → exit 0; curator/qa role-file active↔template byte-parity check (curator changed, qa unchanged). Confirm **zero** sibling mutation. No npm publish, no git push, no `.env` reads. (AC-2, AC-4, AC-5)

## Completion gate

- [ ] All 8 architecture-owned `test_bug0031_*` markers pass (T-005 + T-006 parity).
- [ ] `test_bug0027_*` (10 markers) + `test_bug0016*` (8 markers) suites green as-is (no sibling mutation, compose not replace).
- [ ] `python scripts/bug_issue_validate.py --backlog docs/product/backlog.md --check-acceptance` exits 0 on the fixed state.
- [ ] Active↔template byte-parity holds: `.opencode/agents/curator.md` ↔ template (now each carrying the 3 new allows), `.cursor/commands/closure.md` ↔ template, `runbook.md` row + `reason_codes.md` registration present; `qa.md` allow set **unchanged**.
- [ ] Broad `"**": deny` still the **first** `edit:` row (DENY-FIRST, DEC-0152 L40-43); `bash: ask` / `task: deny` unchanged; `S*` wildcard is the literal `"sprints/S*/closure-verification.md"` (no specific-sprint literal); no 4th flip-path allow; no `qe` spawnable type created.
- [ ] `CLOSURE_PERMISSION_FLIP_PATHS_DENIED` present additively in both rich-surface files + runbook + reason_codes; the existing 7 `CLOSURE_*` codes **not** renamed/replaced.
- [ ] Companion DEC **none**; DEC-0051/0152/0052 compose-only (not amended); `.cursor/agents/*.mdc` + thin `.opencode/commands/closure.md` pair **untouched**.
- [ ] BUG-0031 remains **OPEN** (AC-1..AC-5 unchecked) and US-0156 AC-7 remains **not ticked** — no backlog/acceptance mutation during plan/execute.

## Execute evidence (T-anch..T-007)

- _Pending — `/execute` (fresh dev) records commands/results here. Do not claim QA PASS or live
  OpenCode completion from planning. `UAT_PROBE_FORBIDDEN` held._
