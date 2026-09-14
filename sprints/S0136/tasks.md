# Sprint S0136 - Task checklist (BUG-0018)

Total tasks: 8 (T-anch + T-001..T-007). SPRINT_MAX_TASKS=12; SPRINT_AUTO_SPLIT=1; no split. T-anch retained as NO-OP verification. Seeds 1:1 from `docs/engineering/architecture.md` `# BUG-0018`.

**Isolation**: `tl-BUG0018-sprintplan-20260912T101000Z-fresh` · `model_id=cursor-grok-4.6` · `orchestrator_run_id=auto-20260912-bug0018`

## Task execution order

1. T-anch (NO-OP / verification)
2. T-001 (delete colliding `auto.md` — active + template)
3. T-002 (plugin `editor.add` keep + `OPENCODE_AUTO_MARKDOWN_COLLISION` leftover defense)
4. T-003 (targeted installer prune on `upgrade --host opencode|both`)
5. T-004 (compose inventory/parity/plant-path)
6. T-005 (6 `test_bug0018_*` markers)
7. T-006 (runbook prune recipe + collision stub)
8. T-007 (active↔template parity for touched plugin / runbook / installer prune paths)
9. Integration verification

## Critic NB awareness (execute)

- **T-001/T-003/T-005** (`bug0018arc-challenger-001` NB1): execute owns delete + prune + tests. R1 listing residual → plugin `add` + attach-missing fail-closed (no live probe). R2 leftover → DQ8 prune + marker 4. R6 unlink fail → print `OPENCODE_AUTO_MARKDOWN_COLLISION`.
- **T-anch..T-007** (`bug0018arc-architect-002` NB2): keep 1:1 architecture seeds; do not invent extra tasks; execute owns surfaces.
- **T-anch** (`bug0018arc-subtractor-003` NB3): verification-only; do not rewrite `# BUG-0018` / R-0120; reject A2–A7 + companion DEC; do not mark DONE; do not reopen BUG-0015/0016/0017.

## Task checklist

- [x] **T-anch**: Verify `# BUG-0018` H1 in `docs/engineering/architecture.md`; approach A* LOCKED; R-0120 DQ1–DQ8 LOCKED; CF1 superseded (historical `# BUG-0015` CF1 cell not rewritten); companion DEC=none; compose guards (DEC-0124/0125 bodies UNCHANGED; BUG-0015/0016/0017 not reopened); verify `tests/bug0018_*` does NOT yet exist (or document baseline). Record to `sprints/S0136/t-anch-verification.md`. NO mutation to `architecture.md` / `docs/engineering/research.md` R-0120 in /execute. (DC / architecture baseline; NO-OP)

- [x] **T-001**: Delete colliding `.opencode/commands/auto.md` **and** `template/.opencode/commands/auto.md`. Keep all other `.opencode/commands/*.md` (`intake.md`, peers, `/quick`, `/ask`). Keep `.opencode/agents/auto.md`. Keep `.cursor/commands/auto.md`. Tests: marker 1. (AC-1, AC-2)

- [x] **T-002**: Keep plugin `ctx.command.transform` → `editor.add({ name: "auto", description: "its-magic auto: orchestrator dispatch entry (spawn-only).", execute })` → `runAutoLifecycle` (active + template). Add `OPENCODE_AUTO_MARKDOWN_COLLISION` to plugin vocabulary / `REASON_CODES` stub. At start of `runAutoLifecycle`, if leftover `.opencode/commands/auto.md` exists (best-effort `cwd` / `ctx.directory`): return fail-closed `OPENCODE_AUTO_MARKDOWN_COLLISION`. Plugin must **not** delete the file (installer owns prune). Secondary `command.executed` stays defense-only (mutex-gated). Tests: markers 2, 5, 6. (AC-1, AC-3, AC-5, AC-7)

- [x] **T-003**: Targeted prune of consumer `.opencode/commands/auto.md` when kit template no longer ships that path, invoked from upgrade `--host opencode|both` (`installer.py` + `installer.sh` + `installer.ps1`). Always delete this one relative path (retired colliding framework file — not operator data; not a DEC-0132 preserve path). Do **not** invent a general “delete all files not in template” sweeper. Do **not** prune `.opencode/agents/auto.md` or `.cursor/commands/auto.md`. If unlink fails: print `[OPENCODE_AUTO_MARKDOWN_COLLISION]`, continue other upgrade work. Tests: marker 4. (AC-4, AC-5)

- [x] **T-004**: Compose-only (do not reopen US-0125/BUG-0015 ACs; DEC-0124/0125 bodies UNCHANGED):
  - `test_bug0015_auto_md_dispatch_only_static`: **if** `auto.md` exists → ≤20 / STOP / no spawn; **absence is OK**
  - `test_us0125_auto_command_dispatch_only`: same if-present; no hard `auto.md missing` fail
  - Drop `.opencode/commands/auto.md` pair from `BUG0015_PAIRS` (plugin pair stays)
  - US-0125 `EXPECTED_COMMANDS`: drop `"auto"` → **14** markdown commands (12 lifecycle + `quick` + `ask`). Marker 7 remaining-after-delete `quick.md`: **13**. Remove dead `if name == "auto"` frontmatter branch.
  - `test_bug0017_guard_installer_publish_rejects_opencode_cr` plant path: swap to another remaining command file (e.g. `intake.md`) — plant-path only; CR-reject AC unchanged
  - Do **not** otherwise amend remaining `test_us0124_*` / `test_bug0015_*` / `test_us0125_*` / `test_bug0017_*`
  Tests: compose green after T-001. (AC-2, AC-6, AC-7)

- [x] **T-005**: Create `tests/bug0018_opencode_auto_ownership_test.py` (+ template mirror if paired) with **exactly 6** markers:
  1. `test_bug0018_no_colliding_opencode_auto_md`
  2. `test_bug0018_plugin_editor_add_auto_execute`
  3. `test_bug0018_active_template_opencode_auto_ownership_parity`
  4. `test_bug0018_upgrade_prunes_consumer_auto_md`
  5. `test_bug0018_compose_bug0015_attach_api_unchanged`
  6. `test_bug0018_markdown_collision_reason_code_stub`
  Static/fixture only — **no live OpenCode CI probe**. (AC-1..AC-7)

- [x] **T-006**: Add runbook section/recipe (active + template byte-identical) documenting consumer path: (1) upgrade its-magic to the BUG-0018 release; (2) `its-magic --mode upgrade --host opencode|both` (**must prune** `auto.md`); (3) if unlink blocked, operator deletes `.opencode/commands/auto.md` then re-upgrade. Stub `OPENCODE_AUTO_MARKDOWN_COLLISION` with US-0126 cross-link (US-0126 owns full table; this bug ships stub only). (AC-4, AC-5)

- [x] **T-007**: Active↔template parity for plugin / runbook stub / installer prune helper paths touched this sprint. Do not invent extra surfaces. Tests: marker 3 + parity script. (AC-6)

## Integration verification (post T-007)

- [x] Test gate: `python -m pytest tests/bug0018*.py -v` → 6/6 PASS
- [x] Compose gate: us0125 / bug0015 if-present + inventory 14 + bug0017 plant `intake.md` still green
- [x] Parity gate: active ↔ template plugin / runbook stub / installer prune helpers
- [x] Scope gate: no companion DEC; no DEC-0124/0125 body rewrite; no Cursor `auto.md` / agents `auto.md` touch; no general sweeper; no live OpenCode probe; plugin does not delete leftover file
- [x] Status gate: BUG-0018 remains OPEN; acceptance unchecked; intake JSON not mutated

## Files to touch (scope)

### New (create)

- `tests/bug0018_opencode_auto_ownership_test.py` (+ template if paired)
- `sprints/S0136/t-anch-verification.md` (execute)

### Edit (scoped)

- Delete `.opencode/commands/auto.md` + `template/.opencode/commands/auto.md`
- `.opencode/plugins/orchestrator.ts` + template — REASON_CODES + leftover check
- `installer.py` + `installer.sh` + `installer.ps1` — targeted prune
- `scripts/check_intake_template_parity.py` `BUG0015_PAIRS` — drop auto.md pair
- `tests/us0125_contract_test.py` / `tests/bug0015_contract_test.py` / `tests/bug0017_opencode_eol_test.py` — compose-only
- `docs/engineering/runbook.md` + template — prune recipe + collision stub

### Verify read-only (no mutation)

- `docs/engineering/architecture.md # BUG-0018`
- `docs/engineering/research.md ## R-0120`
- `docs/product/backlog.md ### BUG-0018` Status/acceptance (US-0045)
- `docs/product/acceptance.md` BUG-0018 row
- `handoffs/intake_evidence/BUG-0018-intake-20260912.json`

### Compose-guard UNCHANGED (DO NOT TOUCH)

| File / surface | Reason |
|---|---|
| Backlog Status / acceptance checkbox | US-0045 — closure only |
| `architecture.md` body beyond T-anch verify | locked in /architecture |
| DEC-0124.md / DEC-0125.md bodies | compose — do not rewrite |
| `# BUG-0015` CF1 historical cell | superseded by `# BUG-0018`; do not rewrite |
| BUG-0015 / BUG-0016 / BUG-0017 artifacts | DONE — do not reopen |
| `.cursor/commands/auto.md` | Cursor host — out of scope |
| `.opencode/agents/auto.md` | independent agent surface |
| General template-absent sweeper | forbidden (DQ8 targeted prune only) |
| Live OpenCode CI probe | forbidden |

## AC → Task surjective coverage

| AC | Task(s) |
|---|---|
| AC-1 | T-001, T-002, T-005 |
| AC-2 | T-001, T-004, T-005 (m1) |
| AC-3 | T-002, T-005 (m2) |
| AC-4 | T-003, T-005 (m4), T-006 |
| AC-5 | T-002, T-003, T-005 (m6), T-006 |
| AC-6 | T-001, T-002, T-004, T-005 (m3), T-007 |
| AC-7 | T-002, T-004, T-005 (m5) |
| DC / architecture | T-anch |

**Surjectivity check**: 7/7 ACs covered. No `PLAN_AC_COVERAGE_GAP`.
