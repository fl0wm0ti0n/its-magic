# Sprint S0168 — BUG-0033 Thin→rich command-pair parity on the OpenCode surface

## Metadata

| Field | Value |
|---|---|
| sprint_id | **S0168** (next available: `sprints/S0167/` is the max numeric dir; `sprints/S0168/` was absent) |
| bug_id | BUG-0033 — **OPEN**, P1; backlog AC-1..AC-8 (L5695-L5715) and acceptance row remain unchecked |
| status | PLANNED |
| current_phase | sprint-plan complete |
| delivery_mode | ultra_lean; plan-verify is a SKIPPED placeholder at plan time, merged at `/qa` |
| research_anchor | **R-0159** (DQ1-DQ8 LOCKED; `docs/engineering/research.md` L16158-L16344; consume, do not re-decide) |
| architecture_anchor | `docs/engineering/architecture.md` `# BUG-0033` (L2876-L2940) |
| companion_DEC | **DEC-0154** (Accepted; DQ6 Option A additive US-0125 line-cap reconciliation — MANDATORY normative rule for T-002) |
| task_count | 5 (T-anch + T-001..T-004; within `SPRINT_MAX_TASKS=12`, `SPRINT_AUTO_SPLIT=1` not triggered) |
| fresh_context_marker | `tl-BUG0033-sprintplan-20261008T214833Z-fresh` |
| consumed architecture proof | `rp-auto-20261008-bug0033-architecture-techlead-20261008T212725Z-BUG-0033` recomputed MATCH (both methods); consumed 2026-10-08T21:45:40Z < TTL 2026-10-08T22:27:25Z → NOT_STALE |

## Goal and locked design

Give exactly five thin OpenCode command bodies the two diagnostics-only sections the
rich `.cursor/commands/*` counterparts carry, preserving active↔template byte parity:
`.opencode/commands/{closure,ask,auto,refresh-context,execute}.md` (+ `template/` mirror).

The design is fully LOCKED by R-0159 + `# BUG-0033` + DEC-0154 and is **consumed, not
re-decided** here:

- **Text (DQ1, 0 invented tokens):** thin surface is diagnostics-only documentation, not
  dispatch logic. `closure.md` `## Fail-safe reason codes` points to the authoritative rich
  table (`.cursor/commands/closure.md` `## Fail-safe reason codes and remediation guidance`);
  `ask/auto/refresh-context/execute` get a terse derived vocabulary + pointer (the rich source
  has **no** `## Fail-safe reason codes` heading for those four). Exact locked per-file section
  text: **R-0159 L16192-16249** — copy verbatim, do not re-derive.
- **Ordering (LOCKED):** `## Stop conditions` first, then `## Fail-safe reason codes`.
- **Insertion geometry (DQ2, LOCKED):** insert immediately **before the final `STOP` sentinel**
  in closure/ask/refresh-context/execute; **auto.md has no `STOP` sentinel** → append at EOF after
  one blank line. Projected active==template lines: closure 19→29, ask 12→19, auto 49→61,
  refresh-context 18→27, execute 24→34. Clone-guard similarity vs rich stays ≤0.031 (cap 0.30);
  no US-0125 forbidden/policy/clone token; frontmatter `agent:` preserved
  (closure `qa`, auto `auto`, refresh-context `curator`, execute `dev`, ask none).
- **DQ6 Option A (MANDATORY per DEC-0154):** additive US-0125 line-cap reconciliation for the
  **five parity-target files only** (a `BUG0033_PARITY_TARGETS` exemption set / per-file cap ~35);
  the similarity ≤0.30 clone-guard, clone strip-list, and frontmatter-shape marker remain **INTACT
  for all files** (only the line *count* cap is exempted). Options B (re-scope to ask.md) and
  C (accept new red) are REJECTED.
- **Parity mechanism (DQ3, LOCKED):** new `--scope=bug-0033` byte-pair table `BUG0033_PAIRS`
  (5 command pairs + the test twin) in `scripts/check_intake_template_parity.py`; `--scope=all`
  (L959) already unions it. Assertion: CLI exit 0 + `[INTAKE_TEMPLATE_PARITY_OK] scope=bug-0033`
  **and** `active.read_bytes() == template.read_bytes()` per pair.
- **0 new reason codes (DQ5, LOCKED):** every cited token is pre-existing (registry or rich
  source); `reason_codes.md` / `runbook.md` / `scripts/data/autonomy_stop_matrix.yaml` /
  repair-ledger are NOT mutated (that surface belongs to BUG-0034).

## Scope

### In scope (execute tasks only)

1. The five thin `.opencode/commands/{closure,ask,auto,refresh-context,execute}.md` bodies
   receive the LOCKED DQ1/DQ2 section pair (active **and** `template/` mirror of each).
2. `tests/us0125_contract_test.py` — DQ6 Option A additive line-cap reconciliation for the five
   targets per DEC-0154 (similarity cap / strip list / frontmatter marker INTACT).
3. `scripts/check_intake_template_parity.py` — new `--scope=bug-0033` `BUG0033_PAIRS` table.
4. New `tests/bug0033_opencode_command_parity_test.py` (+ byte-identical `template/` twin) with
   10 `test_bug0033_*` markers (DQ4, ≥8 required), wired into `tests/run-tests.ps1`/`.sh`.

### Out of scope / standing guards

- This phase (sprint-plan) implements nothing; the FIX belongs to `/execute`.
- No `.cursor/commands/*` rich-file change (read-only reference).
- No US-0125/US-0126 edit beyond the DQ6 Option A line-cap reconciliation (similarity 0.30,
  strip list, frontmatter-shape marker, `--scope=opencode-adapter` table all untouched).
- No `.opencode/tui.json` change (`"plugin": []` BUG-0030/DEC-0151 lock, active==template 154b).
- No reason-code / runbook / stop-matrix / repair-ledger mutation (BUG-0034's surface).
- No BUG-0006/US-0048 spawn-only change; BUG-0035/DEC-0153 paired-continuation rules unchanged.
- No change to the other 10 thin command files; no mutation of any DONE bug, any other OPEN item,
  production code, existing tests, template twins (except the 5 target mirrors + the new test twin),
  config, or scratchpad.
- No AC tick / status flip (BUG-0033 stays OPEN, AC-1..AC-8 `[ ]`); closure owns the flip (US-0045).
- No DEC authored/amended (DEC-0154 already exists); no `.env`; no subagent spawn; no `/auto`
  recursion; no publish; no push; UAT_PROBE_FORBIDDEN (no live CLI/TUI probes).

## Acceptance coverage (T→AC, surjective over AC-1..AC-8)

| Acceptance criterion | Planned task coverage |
|---|---|
| AC-1 closure.md both headings | T-anch, T-001, T-004 (marker 1) |
| AC-2 ask.md both headings | T-anch, T-001, T-004 (marker 2) |
| AC-3 auto.md both headings | T-anch, T-001, T-004 (marker 3) |
| AC-4 refresh-context.md both headings | T-anch, T-001, T-004 (marker 4) |
| AC-5 execute.md both headings | T-anch, T-001, T-004 (marker 5) |
| AC-6 active↔template byte parity (5 pairs) | T-001 (write both mirrors), T-003 (scope), T-004 (markers 6,7) |
| AC-7 US-0125/US-0126 no regression; spawn-only + `tui.json` lock unchanged | T-002 (cap reconciliation), T-004 (markers 8,9) |
| AC-8 ≥8 `test_bug0033_*` markers over AC-1..AC-7 + `bug_issue_validate.py --check-acceptance` exit 0 | T-004 (10 markers + validator gate) |

All eight numbered criteria have planned coverage; no `PLAN_AC_COVERAGE_GAP`.

## Task summaries and execution order

1. **T-anch — locked baseline/no-op:** Read-only consume R-0159 DQ1-DQ8 + `# BUG-0033` H1 +
   DEC-0154; verify 0 new tokens in the locked text; confirm BUG-0033 OPEN/unchecked, the 5
   active+template pairs are byte-identical, the sentinel geometry (STOP at closure L19 / ask L12 /
   refresh-context L18 / execute L24; none in auto), and the us0125/us0126 pre-existing 5-failure
   baseline. No mutation.
2. **T-001 — apply LOCKED section text (AC-1..AC-6):** Insert the R-0159 L16192-16249 text into
   the 5 active `.opencode/commands/*.md` and their 5 `template/` mirrors (before `STOP`; EOF for
   auto). Verify projected line counts and per-file byte identity active==template.
3. **T-002 — US-0125 line-cap reconciliation (AC-7):** Per DEC-0154, amend
   `tests/us0125_contract_test.py` so `test_us0125_clone_guard` / `test_us0125_auto_command_dispatch_only`
   exempt the five parity-target files (line-count cap only); keep similarity ≤0.30, strip list, and
   frontmatter-shape marker INTACT.
4. **T-003 — parity scope (AC-6/AC-7):** Add `BUG0033_PAIRS` (6 pairs: 5 commands + test twin) and
   the `--scope=bug-0033` choice to `scripts/check_intake_template_parity.py`.
5. **T-004 — 10-marker contract suite + wire (AC-1..AC-8):** Author
   `tests/bug0033_opencode_command_parity_test.py` (+ byte-identical `template/` twin) with the 10
   `test_bug0033_*` markers (DQ4 table L16290-16301); wire into `tests/run-tests.ps1` + `tests/run-tests.sh`.

## Verification (per task; exact commands)

| Task | Exact verification command | Expected |
|---|---|---|
| T-001 | `python -c "import pathlib; [print(f, (pathlib.Path('.opencode/commands/'+f+'.md').read_bytes()==pathlib.Path('template/.opencode/commands/'+f+'.md').read_bytes())) for f in ['closure','ask','auto','refresh-context','execute']]"` | 5× `True` |
| T-001 | `python -c "import pathlib; [print(f, len(pathlib.Path('.opencode/commands/'+f+'.md').read_text().splitlines())) for f in ['closure','ask','auto','refresh-context','execute']]"` | 29 / 19 / 61 / 27 / 34 |
| T-002 | `python -m pytest tests/us0125_contract_test.py -q` | no NEWLY-failing marker vs the pre-existing 5-failure baseline; similarity/strip/frontmatter markers still pass |
| T-003 | `python scripts/check_intake_template_parity.py --scope=bug-0033` | exit 0 + `[INTAKE_TEMPLATE_PARITY_OK] scope=bug-0033` |
| T-003 | `python scripts/check_intake_template_parity.py --scope=all` | exit 0 (union covers the new pairs) |
| T-004 | `python -m pytest tests/bug0033_opencode_command_parity_test.py -q` | `10 passed` |
| T-004 | `python -m pytest template/tests/bug0033_opencode_command_parity_test.py -q` | `10 passed` |
| T-004 | `python scripts/bug_issue_validate.py --repo . --check-acceptance` | exit 0 + `[BUG_VALIDATION_OK]` |
| (gate) | `powershell tests/run-tests.ps1` | exit 0; Pass=N Fail=0 (harness green) |

## Exit criteria

- All of AC-1..AC-8 verified by the 10 `test_bug0033_*` markers + the commands above.
- Harness green: `powershell tests/run-tests.ps1` exit 0, Fail=0.
- Parity green: `--scope=bug-0033` exit 0 + banner; all 5 command pairs byte-identical active==template.
- **0 new reason codes** (DQ5); registries/stop-matrix/repair-ledger unchanged.
- No regression vs the **5-failure us0125/us0126 pre-existing baseline** (the failing marker set is a
  subset of that baseline; no NEWLY-failing marker).
- BUG-0033 remains OPEN with AC-1..AC-8 `[ ]` (closure owns the flip); `tui.json` `"plugin": []` unchanged.

## Test contract (10 `test_bug0033_*` markers — DQ4)

1. `test_bug0033_closure_has_both_headings` (AC-1)
2. `test_bug0033_ask_has_both_headings` (AC-2)
3. `test_bug0033_auto_has_both_headings` (AC-3)
4. `test_bug0033_refresh_context_has_both_headings` (AC-4)
5. `test_bug0033_execute_has_both_headings` (AC-5)
6. `test_bug0033_active_template_byte_parity` (AC-6)
7. `test_bug0033_parity_scope_bug0033_green` (AC-6/AC-7)
8. `test_bug0033_thin_dispatch_only_preserved` (AC-7)
9. `test_bug0033_us0125_us0126_no_regression` (AC-7)
10. `test_bug0033_zero_new_reason_codes` (DQ5)

## Next phase

`/execute` in a fresh **dev** context for BUG-0033/S0168 only. This sprint-plan phase neither
implements nor runs tests, changes status/acceptance, or spawns. **STOP.**
