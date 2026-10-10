# Sprint S0168 — Task checklist (BUG-0033)

Five planned tasks: **T-anch + T-001..T-004**, within `SPRINT_MAX_TASKS=12`
(`SPRINT_AUTO_SPLIT=1` not triggered). Execute only in the listed order
(T-anch → T-001 → T-002 → T-003 → T-004). Every task is `[ ]` PENDING; this plan
claims no implementation, test execution, QA, release, or closure result. The FIX
belongs to `/execute` (fresh dev). This sprint-plan phase authors no source/test code.

## Checklist

- [ ] **T-anch — locked baseline / no-op (all AC):** Read-only consume R-0159
  DQ1-DQ8 (`docs/engineering/research.md` L16158-L16344) + `# BUG-0033`
  (`docs/engineering/architecture.md` L2876-L2940) + DEC-0154. Verify (a) 0 new
  tokens in the R-0159 L16192-16249 locked text (every token pre-existing in the
  rich source or `reason_codes.md`/`runbook.md`); (b) BUG-0033 OPEN and
  AC-1..AC-8 `[ ]` (backlog L5695-L5715); (c) the 5 active+template command pairs
  are byte-identical; (d) the sentinel geometry (final `STOP` at closure L19 /
  ask L12 / refresh-context L18 / execute L24; **auto.md has none**); (e) the
  us0125/us0126 pre-existing 5-failure baseline (none caused by BUG-0033).
  **Surface:** (none — read-only). **No mutation.**

- [ ] **T-001 — apply LOCKED section text to 5 active+template mirrors (AC-1..AC-6):**
  Insert the exact R-0159 L16192-16249 section pair (ordering `## Stop conditions`
  then `## Fail-safe reason codes`) into `.opencode/commands/{closure,ask,auto,
  refresh-context,execute}.md` **and** each `template/.opencode/commands/*.md`
  mirror. Insert immediately before the final `STOP` sentinel (closure/ask/
  refresh-context/execute); **auto.md: append at EOF after one blank line.**
  Apply verbatim (0 invented tokens).
  **Inputs:** R-0159 locked text; the 10 target files.
  **Outputs:** 10 modified thin files (5 active + 5 template), active==template per pair.
  **Verification:** per-file `read_bytes()` parity (5× `True`); projected line counts
  closure 29 / ask 19 / auto 61 / refresh-context 27 / execute 34; frontmatter `agent:`
  preserved (closure `qa`, auto `auto`, refresh-context `curator`, execute `dev`, ask none).
  **Done-when:** all 5 pairs byte-identical active==template AND both headings present in all 5.

- [ ] **T-002 — US-0125 line-cap reconciliation per DEC-0154 (AC-7):** Amend
  `tests/us0125_contract_test.py` so `test_us0125_clone_guard` and
  `test_us0125_auto_command_dispatch_only` raise the **line-count** cap for the five
  BUG-0033 parity-target files only (a `BUG0033_PARITY_TARGETS` exemption set or
  per-file cap ~35). The **similarity ≤0.30 clone-guard, clone strip-list, and
  frontmatter-shape marker stay INTACT for all files** (DEC-0154: only the line
  *count* cap is exempted, five named files only).
  **Inputs:** DEC-0154; R-0159 DQ6; the projected line counts.
  **Outputs:** one additive amendment to `tests/us0125_contract_test.py`.
  **Verification:** `python -m pytest tests/us0125_contract_test.py -q` → the failing
  marker set is a **subset** of the pre-existing 5-failure baseline (no NEWLY-failing
  marker); the similarity / strip-list / frontmatter-shape markers still pass.
  **Done-when:** no NEWLY-failing us0125 marker; guard intent (similarity ≤0.30) preserved.

- [ ] **T-003 — add `--scope=bug-0033` BUG0033_PAIRS to the parity CLI (AC-6/AC-7):**
  Add `BUG0033_PAIRS` to the SCOPES table in
  `scripts/check_intake_template_parity.py`: the 5 command pairs
  (`.opencode/commands/{closure,ask,auto,refresh-context,execute}.md` ↔
  `template/.opencode/commands/*.md`) **plus**
  `("tests/bug0033_opencode_command_parity_test.py",
  "template/tests/bug0033_opencode_command_parity_test.py")`, and register the
  `--scope=bug-0033` choice (BUG-####-per-scope precedent). `--scope=all` (L959)
  already unions it — no further wiring.
  **Inputs:** DQ3 locked pair table; existing SCOPES/`--scope` structure.
  **Outputs:** one new scope table + CLI choice in the parity CLI.
  **Verification:** `python scripts/check_intake_template_parity.py --scope=bug-0033`
  → exit 0 + `[INTAKE_TEMPLATE_PARITY_OK] scope=bug-0033`; `--scope=all` → exit 0.
  **Done-when:** the scoped run is green with the banner and the union run is green.

- [ ] **T-004 — author 10 `test_bug0033_*` markers + byte-identical twin + wire (AC-1..AC-8):**
  Create `tests/bug0033_opencode_command_parity_test.py` (+ byte-identical
  `template/tests/bug0033_opencode_command_parity_test.py`) with the 10 markers
  (DQ4 table, R-0159 L16290-16301): (1) closure both headings; (2) ask both;
  (3) auto both; (4) refresh-context both; (5) execute both; (6) active==template
  `read_bytes()` parity for all 5 pairs; (7) `--scope=bug-0033` green + banner;
  (8) thin dispatch-only preserved (no `spawn(` / `ctx.session.create` /
  `Session.create` / POLICY_TEXT_FRAGMENTS / `OPENCODE_VALIDATOR_FAILED` /
  `OPENCODE_DRIVER_INVOKE_FAILED` / `npm install` / `require(`; frontmatter
  `agent:` preserved); (9) us0125+us0126 no regression (failing set ⊆ pre-existing
  baseline) + `tui.json` `"plugin": []` intact; (10) 0 new reason codes. Wire the
  file into `tests/run-tests.ps1` + `tests/run-tests.sh`.
  **Inputs:** DQ4 marker table; BUG-0031 byte-parity precedent; the 5 target files.
  **Outputs:** new test file + twin + CI wiring.
  **Verification:** `python -m pytest tests/bug0033_opencode_command_parity_test.py -q`
  → `10 passed`; template twin → `10 passed`; `python scripts/bug_issue_validate.py
  --repo . --check-acceptance` → exit 0 `[BUG_VALIDATION_OK]`; `powershell tests/run-tests.ps1`
  → exit 0 Fail=0.
  **Done-when:** 10/10 markers pass active + template; validator exit 0; harness green.

## Planned evidence / guard checklist

- [ ] The 5 active+template command pairs are byte-identical and each carries both
      `## Stop conditions` and `## Fail-safe reason codes`.
- [ ] US-0125 line-cap reconciliation is additive (five files only); similarity
      ≤0.30, strip list, and frontmatter-shape marker remain INTACT.
- [ ] `--scope=bug-0033` is green with banner; `--scope=all` union is green.
- [ ] 10 `test_bug0033_*` markers pass active and template; validator exit 0.
- [ ] No NEWLY-failing us0125/us0126 marker vs the 5-failure pre-existing baseline;
      `.opencode/tui.json` `"plugin": []` (active + template) unchanged.
- [ ] 0 new reason codes; `reason_codes.md` / `runbook.md` /
      `scripts/data/autonomy_stop_matrix.yaml` / repair-ledger unchanged.
- [ ] No `.cursor/commands/*` change; no other thin file touched; no config/
      scratchpad/`.env` access; no status/acceptance flip (BUG-0033 OPEN, ACs `[ ]`).
- [ ] No publish, push, `/auto`, live CLI/TUI probe, or child spawn.

## Execute evidence

_Pending — a fresh `/execute` dev context owns the source/test/parity-scope work and
records commands/results. This planning artifact makes no execution claim._
