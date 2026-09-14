# Sprint S0140 - Task checklist (BUG-0020)

Total tasks: 8 (T-anch + T-001..T-007). SPRINT_MAX_TASKS=12; SPRINT_AUTO_SPLIT=1; no split. T-anch retained as NO-OP verification. Seeds 1:1 from `docs/engineering/architecture.md` `# BUG-0020`.

**Isolation**: `tl-BUG0020-sprintplan-20260912T234500Z-fresh` · `model_id=cursor-grok-4.6` · `orchestrator_run_id=auto-20260913-bug0020`

## Task execution order

1. T-anch (NO-OP / verification)
2. T-001 (add `.opencode/tui.json` listing `./plugins/its-magic-auto/tui.ts` — active + template)
3. T-002 (retain plugin `editor.add` execute; do not restore `auto.md`; no JSON template; no `cli.json`)
4. T-003 (wire `emitDesktopCommandInfoListingUnsupported` + desktop listing token)
5. T-004 (desktop listing reason-code stub + runbook desktop vs CLI TUI)
6. T-005 (8 `test_bug0020_*` markers)
7. T-006 (upgrade copy-if-absent / JSONC-merge `tui.json` + keep `auto.md` prune)
8. T-007 (runbook CLI TUI vs desktop recipe + active↔template parity)
9. Integration verification

## Critic NB awareness (execute)

- **T-001/T-003/T-004/T-005** (`bug0020arc-challenger-001` NB1): execute owns `tui.json` + emit helper + tests. Restoring `auto.md` recreates 0018. JSON template is 0018-class. TUI-toast-only emission is forbidden. Silent desktop miss is forbidden. Do not claim `tui.json` feeds Command.Info.
- **T-anch..T-007** (`bug0020arc-architect-002` NB2): keep 1:1 architecture seeds; sprint folder is S0140; do not invent extra tasks; execute owns surfaces (`tui.json`, emit helper, 8 tests, upgrade merge).
- **T-anch** (`bug0020arc-subtractor-003` NB3): verification-only; do not rewrite `# BUG-0020` / R-0126; reject E2-A..E2-G + companion DEC; do not mark DONE; do not reopen BUG-0019/0018/0017/0015/0016.

## Task checklist

- [x] **T-anch**: Verify `# BUG-0020` H1 in `docs/engineering/architecture.md`; approach E2 LOCKED; R-0126 DQ1–DQ8 LOCKED; R-0124 E* / `# BUG-0019` operator-picker listing claim superseded (historical `# BUG-0019` body + R-0124 not rewritten); companion DEC=none (no DEC-0136); compose guards (DEC-0124/0125 bodies UNCHANGED; BUG-0015/0016/0017/0018/0019 not reopened); verify `tests/bug0020_*` does NOT yet exist (or document baseline). Record to `sprints/S0140/t-anch-verification.md`. NO mutation to `architecture.md` / `docs/engineering/research.md` R-0126 in /execute. (DC / architecture baseline; NO-OP)

- [x] **T-001**: Add `.opencode/tui.json` **and** `template/.opencode/tui.json` (JSONC). Shape: `"$schema": "https://opencode.ai/tui.json"` + `"plugin": ["./plugins/its-magic-auto/tui.ts"]` (path relative to the config file). Comment: CLI-TUI-only; does **not** feed desktop Command.Info. Keep existing `its-magic-auto/tui.ts` keymap (`slash`/`slashName` `"auto"`; `run()` → `runAutoLifecycle`). Keep thin `index.ts` (no second `editor.add`). **Do not** list the package directory (would resolve `index.ts` server module). **Do not** ship theme/keybinds/attention. **Do not** ship `.opencode/cli.json`. **Do not** ship plugin-local `its-magic-auto/tui.json` (BUG-0019 `FORBIDDEN_TUI_JSON` stays). Do **not** restore `auto.md`. Tests: markers 5, 6. (AC-1)

- [x] **T-002**: Keep plugin `ctx.command.transform` → `editor.add({ name: "auto", description: "its-magic auto: orchestrator dispatch entry (spawn-only).", execute })` → `runAutoLifecycle` (active + template). Do **not** restore `.opencode/commands/auto.md` or template twin. Do **not** add OpenCode JSON/JSONC `commands.auto` / `command.auto` with `template`. Do **not** ship kit `cli.json`. Keep leftover-`auto.md` fail-closed `OPENCODE_AUTO_MARKDOWN_COLLISION` unchanged. Keep all other `.opencode/commands/*.md` (`ask.md`, peers, `/quick`). Keep `.opencode/agents/auto.md`. Keep `.cursor/commands/auto.md`. Tests: markers 2, 3. (AC-2, AC-4, AC-5, AC-6, AC-9)

- [x] **T-003**: Add `emitDesktopCommandInfoListingUnsupported(ctx)` in `orchestrator.ts` (active + template), invoked after `editor.add` when Command.Info `list()` has no `name === "auto"` while execute is registered. Channels, first success: (1) desktop/session notification API if present (`session.alert` / `app.notify` / GUI toast that is **not** TUI `tui.toast`); (2) session-visible system/error notice in the current desktop session; (3) plugin `setup` session-error return so the GUI surfaces `OPENCODE_AUTO_DESKTOP_COMMAND_INFO_LISTING_UNSUPPORTED`. **Must not** be CLI TUI toast-only. **Must not** add a Command.Info `auto` template row. **Must not** block `editor.add` or TUI keymap. Tests: markers 1, 4. (AC-2, AC-3)

- [x] **T-004**: Add `OPENCODE_AUTO_DESKTOP_COMMAND_INFO_LISTING_UNSUPPORTED` to plugin vocabulary / `REASON_CODES` stub (active + template). Do **not** reuse `OPENCODE_AUTO_MARKDOWN_COLLISION` or `OPENCODE_AUTO_SLASH_LISTING_UNSUPPORTED` for desktop Command.Info silent-miss. Stub + US-0126 cross-link only (US-0126 owns full table). Document desktop vs CLI TUI in runbook stub. Tests: markers 1, 4. (AC-3)

- [x] **T-005**: Create `tests/bug0020_opencode_desktop_command_info_listing_test.py` (+ template mirror if paired) with **exactly 8** markers:
  1. `test_bug0020_desktop_command_info_picker_contract`
  2. `test_bug0020_no_command_info_auto_template`
  3. `test_bug0020_plugin_editor_add_auto_execute_retained`
  4. `test_bug0020_desktop_listing_fail_closed_token`
  5. `test_bug0020_cli_tui_working_start_load_path`
  6. `test_bug0020_tui_run_still_dispatches_lifecycle`
  7. `test_bug0020_active_template_parity`
  8. `test_bug0020_upgrade_copies_surface_still_prunes_auto_md`
  Static/fixture only — **no live OpenCode desktop probe**. Do **not** weaken `test_bug0018_*`. Do **not** weaken `test_bug0019_*` except compose-only comments that E* is not the desktop picker fix and that project `.opencode/tui.json` is now the CLI load path (plugin-local `its-magic-auto/tui.json` remains forbidden). (AC-1..AC-10)

- [x] **T-006**: Upgrade `--host opencode|both`: if consumer `.opencode/tui.json` is **absent** → **copy** the template; if it **exists** → **JSONC merge** of `"plugin"` entry `./plugins/its-magic-auto/tui.ts` into the existing array; **do not** wholesale overwrite theme/keybinds/attention. Still **prunes** leftover `auto.md` (`prune_retired_opencode_auto_md`). Add named installer-owned-paths rows for `.opencode/tui.json` / `template/.opencode/tui.json` (directory include `.opencode/plugins` does **not** cover project `tui.json`). Do **not** invent a general sweeper. Do **not** prune `.opencode/agents/auto.md` or `.cursor/commands/auto.md`. Tests: marker 8. (AC-7)

- [x] **T-007**: Runbook section/recipe (active + template byte-identical): (1) upgrade its-magic to the BUG-0020 release; (2) `its-magic --mode upgrade --host opencode|both` (copy-if-absent / JSONC-merge `tui.json` + prune leftover `auto.md`); (3) restart OpenCode (not `--pure`); (4) **desktop Command.Info still will not list execute-only `/auto`** — operator sees documented `OPENCODE_AUTO_DESKTOP_COMMAND_INFO_LISTING_UNSUPPORTED` (not silent) **and** starts auto from **CLI TUI** `/auto` (`opencode`, not `--pure`). Extend `check_intake_template_parity.py` with additive `BUG0020_PAIRS` for `tui.json` (keep `BUG0019_PAIRS`). Active↔template parity for `tui.json` / token wiring / runbook stub / installer paths. Tests: marker 7 + parity script. (AC-3, AC-8)

## Integration verification (post T-007)

- [x] Test gate: `python -m pytest tests/bug0020*.py tests/bug0019*.py tests/bug0018*.py -v` → 8/8 bug0020 PASS; bug0019 still green (compose-only comments allowed); bug0018 still green
- [x] Parity gate: active ↔ template `tui.json` / orchestrator retain / runbook stub / installer copy-if-absent + JSONC-merge helpers
- [x] Scope gate: no companion DEC; no DEC-0124/0125 body rewrite; no Cursor `auto.md` / agents `auto.md` touch; no restored `auto.md`; no JSON `commands.auto`; no `cli.json`; no plugin-local `its-magic-auto/tui.json`; no live OpenCode desktop probe; `tui.json` comments/tests assert CLI-TUI-only
- [x] Status gate: BUG-0020 remains OPEN; acceptance unchecked; intake JSON not mutated; BUG-0019/0018 remain DONE

## Files to touch (scope)

### New (create)

- `.opencode/tui.json` + `template/.opencode/tui.json`
- `tests/bug0020_opencode_desktop_command_info_listing_test.py` (+ template if paired)
- `sprints/S0140/t-anch-verification.md` (execute)

### Edit (scoped)

- `.opencode/plugins/orchestrator.ts` + template — REASON_CODES + `emitDesktopCommandInfoListingUnsupported`
- `installer.py` + `installer.sh` + `installer.ps1` — copy-if-absent / JSONC-merge `tui.json`; keep targeted `auto.md` prune
- `docs/engineering/context/installer-owned-paths.manifest` — named rows for `.opencode/tui.json`
- `scripts/check_intake_template_parity.py` — additive `BUG0020_PAIRS`
- `docs/engineering/runbook.md` + template — CLI TUI vs desktop recipe + listing token stub

### Verify read-only (no mutation)

- `docs/engineering/architecture.md # BUG-0020`
- `docs/engineering/research.md ## R-0126`
- `docs/product/backlog.md ### BUG-0020` Status/acceptance (US-0045)
- `docs/product/acceptance.md` BUG-0020 row
- `handoffs/intake_evidence/BUG-0020-intake-20260913.json`
- `tests/bug0018_*` (do not weaken)
- `tests/bug0019_*` (compose-only comments allowed)
- absent `.opencode/commands/auto.md` + template twin
- present `.opencode/plugins/its-magic-auto/{index.ts,tui.ts}` (+ template twins)

### Compose-guard UNCHANGED (DO NOT TOUCH)

| File / surface | Reason |
|---|---|
| Backlog Status / acceptance checkbox | US-0045 — closure only |
| `architecture.md` body beyond T-anch verify | locked in /architecture |
| DEC-0124.md / DEC-0125.md bodies | compose — do not rewrite |
| `# BUG-0019` historical body / R-0124 body | superseded by `# BUG-0020`; do not rewrite |
| `# BUG-0018` historical body / R-0120 body | compose — do not rewrite |
| BUG-0015 / BUG-0016 / BUG-0017 / BUG-0018 / BUG-0019 artifacts | DONE — do not reopen |
| `.cursor/commands/auto.md` | Cursor host — out of scope |
| `.opencode/agents/auto.md` | independent agent surface |
| `.opencode/commands/auto.md` restore | forbidden (recreates BUG-0018) |
| JSON `commands.auto` template | forbidden (E2-D rejected) |
| Kit `cli.json` | forbidden |
| Plugin-local `its-magic-auto/tui.json` | forbidden (BUG-0019 FORBIDDEN_TUI_JSON) |
| General template-absent sweeper | forbidden |
| Live OpenCode desktop CI probe | forbidden |
| Invent desktop execute-only Command.Info listing API | forbidden |
| Wholesale overwrite operator `tui.json` theme/keybinds | forbidden |
| `tests/bug0018_*` weaken | forbidden |

## AC → Task surjective coverage

| AC | Task(s) |
|---|---|
| AC-1 | T-001, T-005 (m5, m6) |
| AC-2 | T-002, T-003, T-005 (m3, m6) |
| AC-3 | T-003, T-004, T-005 (m1, m4), T-007 |
| AC-4 | T-002, T-005 (m2) |
| AC-5 | T-002, T-005 (m2) |
| AC-6 | T-002, T-005 (m3) |
| AC-7 | T-006, T-005 (m8) |
| AC-8 | T-007, T-005 (m7) |
| AC-9 | T-anch, T-002 |
| AC-10 | T-005 |
| DC / architecture | T-anch |

**Surjectivity check**: 10/10 ACs covered. No `PLAN_AC_COVERAGE_GAP`.
