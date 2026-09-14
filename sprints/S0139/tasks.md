# Sprint S0139 - Task checklist (BUG-0019)

Total tasks: 8 (T-anch + T-001..T-007). SPRINT_MAX_TASKS=12; SPRINT_AUTO_SPLIT=1; no split. T-anch retained as NO-OP verification. Seeds 1:1 from `docs/engineering/architecture.md` `# BUG-0019`.

**Isolation**: `tl-BUG0019-sprintplan-20260912T182500Z-fresh` · `model_id=cursor-grok-4.6` · `orchestrator_run_id=auto-20260912-bug0019`

## Task execution order

1. T-anch (NO-OP / verification)
2. T-001 (add sibling `its-magic-auto/{index.ts,tui.ts}` — active + template)
3. T-002 (retain plugin `editor.add` execute; do not restore `auto.md`; no JSON template)
4. T-003 (wire TUI `run()` → client/RPC → `runAutoLifecycle`)
5. T-004 (listing + dispatch reason-code stubs)
6. T-005 (7 `test_bug0019_*` markers)
7. T-006 (upgrade copy listing files + keep `auto.md` prune)
8. T-007 (runbook recipe + active↔template parity)
9. Integration verification

## Critic NB awareness (execute)

- **T-001/T-003/T-005** (`bug0019arc-challenger-001` NB1): execute owns `its-magic-auto/` + invoke wiring + tests. Restoring `auto.md` recreates 0018. JSON template is 0018-class. Silent missing-command without listing token is forbidden. `index.ts` must not second `editor.add`.
- **T-anch..T-007** (`bug0019arc-architect-002` NB2): keep 1:1 architecture seeds; sprint folder is S0139; do not invent extra tasks; execute owns surfaces (exact client invoke / optional orchestrator RPC).
- **T-anch** (`bug0019arc-subtractor-003` NB3): verification-only; do not rewrite `# BUG-0019` / R-0124; reject E2–E7 + companion DEC; do not mark DONE; do not reopen BUG-0018/0017/0015/0016.

## Task checklist

- [x] **T-anch**: Verify `# BUG-0019` H1 in `docs/engineering/architecture.md`; approach E1/E* LOCKED; R-0124 DQ1–DQ8 LOCKED; R-0120 DQ5 / `# BUG-0018` NB1 superseded (historical `# BUG-0018` body + R-0120 not rewritten); companion DEC=none (no DEC-0135); compose guards (DEC-0124/0125 bodies UNCHANGED; BUG-0015/0016/0017/0018 not reopened); verify `tests/bug0019_*` does NOT yet exist (or document baseline). Record to `sprints/S0139/t-anch-verification.md`. NO mutation to `architecture.md` / `docs/engineering/research.md` R-0124 in /execute. (DC / architecture baseline; NO-OP)

- [x] **T-001**: Add sibling `.opencode/plugins/its-magic-auto/{index.ts,tui.ts}` **and** `template/.opencode/plugins/its-magic-auto/{index.ts,tui.ts}`. `index.ts` is a thin `Plugin.define` server entry for discovery — **must not** `editor.add({ name: "auto" })`. `tui.ts` registers keymap layer with `slash: { name: "auto" }` **or** `slashName: "auto"` (whichever the loaded TUI API exposes). Description should match plugin `editor.add` description: `its-magic auto: orchestrator dispatch entry (spawn-only).` If neither `context.keymap.layer` nor `api.keymap.registerLayer` (or equivalent slash-capable keymap API) exists at TUI load: operator-visible `OPENCODE_AUTO_SLASH_LISTING_UNSUPPORTED`. Do **not** ship kit `cli.json` / `tui.json`. Tests: marker 4. (AC-1, AC-6)

- [x] **T-002**: Keep plugin `ctx.command.transform` → `editor.add({ name: "auto", description: "its-magic auto: orchestrator dispatch entry (spawn-only).", execute })` → `runAutoLifecycle` (active + template). Do **not** restore `.opencode/commands/auto.md` or template twin. Do **not** add OpenCode JSON/JSONC `commands.auto` / `command.auto` with `template`. Keep leftover-`auto.md` fail-closed `OPENCODE_AUTO_MARKDOWN_COLLISION` unchanged. Keep all other `.opencode/commands/*.md` (`intake.md`, peers, `/quick`, `/ask`). Keep `.opencode/agents/auto.md`. Keep `.cursor/commands/auto.md`. Tests: markers 1, 2, 3. (AC-3, AC-4, AC-5)

- [x] **T-003**: Wire `tui.ts` `run()` → `context.client` / `api.client` → `runAutoLifecycle` on `orchestrator.ts` **without** Command.Info template expansion. Prefer documented plugin-command execute path if it targets `CommandDefinition.execute`; otherwise additive plugin RPC on `orchestrator.ts` (thin wrapper around existing `runAutoLifecycle`). Surface lifecycle result / `OPENCODE_*` to the operator. If client or RPC/execute path is missing: operator-visible `OPENCODE_AUTO_TUI_DISPATCH_UNSUPPORTED`. **Forbidden**: `SessionPrompt.command()`, JSON/md `template`, STOP body. Tests: marker 5. (AC-2)

- [x] **T-004**: Add `OPENCODE_AUTO_SLASH_LISTING_UNSUPPORTED` and `OPENCODE_AUTO_TUI_DISPATCH_UNSUPPORTED` to plugin vocabulary / `REASON_CODES` stub (active + template). Do **not** reuse `OPENCODE_AUTO_MARKDOWN_COLLISION` for listing-miss. Stub + US-0126 cross-link only (US-0126 owns full table). Tests: markers 4, 5. (AC-2, AC-6)

- [x] **T-005**: Create `tests/bug0019_opencode_auto_slash_listing_test.py` (+ template mirror if paired) with **exactly 7** markers:
  1. `test_bug0019_no_restored_opencode_auto_md`
  2. `test_bug0019_plugin_editor_add_auto_execute_retained`
  3. `test_bug0019_no_json_commands_auto_template`
  4. `test_bug0019_tui_slash_auto_listing_surface`
  5. `test_bug0019_tui_run_dispatches_lifecycle_not_template`
  6. `test_bug0019_active_template_listing_parity`
  7. `test_bug0019_upgrade_copies_listing_surface`
  Static/fixture only — **no live OpenCode TUI probe**. Do **not** weaken `test_bug0018_*`. (AC-1..AC-7)

- [x] **T-006**: Upgrade `--host opencode|both` **copies** new TUI listing files (`template/.opencode/plugins/its-magic-auto/{index.ts,tui.ts}`) onto already-pruned consumer trees and still **prunes** leftover `auto.md` (`prune_retired_opencode_auto_md`). Add named installer-owned-paths rows for the new template plugin files if the specific-file list is required; keep `.opencode/plugins` directory include. Do **not** invent a general sweeper. Do **not** prune `.opencode/agents/auto.md` or `.cursor/commands/auto.md`. Tests: marker 7. (AC-7)

- [x] **T-007**: Runbook section/recipe (active + template byte-identical): (1) upgrade its-magic to the BUG-0019 release; (2) `its-magic --mode upgrade --host opencode|both` (copy listing files + prune leftover `auto.md`); (3) restart OpenCode (not `--pure`); (4) slash palette lists `/auto` and invocation starts lifecycle or `OPENCODE_*`. Extend `check_intake_template_parity.py` with an additive pair for `its-magic-auto/` (do not drop `BUG0015_PAIRS` orchestrator pair). Active↔template parity for listing package / runbook stub / installer paths. Tests: marker 6 + parity script. (AC-7)

## Integration verification (post T-007)

- [x] Test gate: `python -m pytest tests/bug0019*.py tests/bug0018*.py -v` → 7/7 bug0019 PASS; bug0018 still green
- [x] Parity gate: active ↔ template `its-magic-auto/` / orchestrator retain / runbook stub / installer copy+prune helpers
- [x] Scope gate: no companion DEC; no DEC-0124/0125 body rewrite; no Cursor `auto.md` / agents `auto.md` touch; no restored `auto.md`; no JSON `commands.auto`; no `cli.json`; no live OpenCode probe; `index.ts` does not `editor.add` auto
- [x] Status gate: BUG-0019 remains OPEN; acceptance unchecked; intake JSON not mutated; BUG-0018 remains DONE

## Files to touch (scope)

### New (create)

- `.opencode/plugins/its-magic-auto/index.ts` + `tui.ts` (+ template twins)
- `tests/bug0019_opencode_auto_slash_listing_test.py` (+ template if paired)
- `sprints/S0139/t-anch-verification.md` (execute)

### Edit (scoped)

- `.opencode/plugins/orchestrator.ts` + template — REASON_CODES + optional RPC wrapper for TUI `run()`
- `installer.py` + `installer.sh` + `installer.ps1` — copy new plugin files; keep targeted `auto.md` prune
- `docs/engineering/context/installer-owned-paths.manifest` — named rows if required
- `scripts/check_intake_template_parity.py` — additive `its-magic-auto/` pair
- `docs/engineering/runbook.md` + template — upgrade copy+prune recipe + listing/dispatch stubs

### Verify read-only (no mutation)

- `docs/engineering/architecture.md # BUG-0019`
- `docs/engineering/research.md ## R-0124`
- `docs/product/backlog.md ### BUG-0019` Status/acceptance (US-0045)
- `docs/product/acceptance.md` BUG-0019 row
- `handoffs/intake_evidence/BUG-0019-intake-20260912.json`
- `tests/bug0018_*` (do not weaken)
- absent `.opencode/commands/auto.md` + template twin

### Compose-guard UNCHANGED (DO NOT TOUCH)

| File / surface | Reason |
|---|---|
| Backlog Status / acceptance checkbox | US-0045 — closure only |
| `architecture.md` body beyond T-anch verify | locked in /architecture |
| DEC-0124.md / DEC-0125.md bodies | compose — do not rewrite |
| `# BUG-0018` historical body / R-0120 body | superseded by `# BUG-0019`; do not rewrite |
| BUG-0015 / BUG-0016 / BUG-0017 / BUG-0018 artifacts | DONE — do not reopen |
| `.cursor/commands/auto.md` | Cursor host — out of scope |
| `.opencode/agents/auto.md` | independent agent surface |
| `.opencode/commands/auto.md` restore | forbidden (recreates BUG-0018) |
| JSON `commands.auto` template | forbidden (E2 rejected) |
| Convert `orchestrator.ts` to package | forbidden (E6 rejected) |
| Kit `cli.json` / `tui.json` | forbidden by default |
| General template-absent sweeper | forbidden |
| Live OpenCode CI probe | forbidden |
| `tests/bug0018_*` weaken | forbidden |

## AC → Task surjective coverage

| AC | Task(s) |
|---|---|
| AC-1 | T-001, T-005 (m4) |
| AC-2 | T-003, T-004, T-005 (m5) |
| AC-3 | T-002, T-005 (m1), T-anch |
| AC-4 | T-002, T-005 (m3) |
| AC-5 | T-002, T-005 (m2) |
| AC-6 | T-001, T-004, T-005 (m4) |
| AC-7 | T-006, T-007, T-005 (m6, m7) |
| DC / architecture | T-anch |

**Surjectivity check**: 7/7 ACs covered. No `PLAN_AC_COVERAGE_GAP`.
