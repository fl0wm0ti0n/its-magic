# Sprint S0146 - Task checklist (BUG-0021)

Total tasks: 8 (T-anch + T-001..T-007). SPRINT_MAX_TASKS=12; SPRINT_AUTO_SPLIT=1; no split. T-anch retained as NO-OP verification. Seeds 1:1 from `docs/engineering/architecture.md` `# BUG-0021`. Sprint id S0146 (next free after S0145). Do not overwrite S0140–S0145. Do not reuse S0145.

**Isolation**: `tl-BUG0021-sprintplan-20260913T124000Z-fresh` · `model_id=cursor-grok-4.6-high` · `orchestrator_run_id=auto-20260913-bug0021`

## Task execution order

1. T-anch (NO-OP / verification)
2. T-001 (reshape `tui.ts` default export `{ id, tui }` — active + template)
3. T-002 (`registerLayer` `name` / `slashName: "auto"` / `namespace: "palette"` / `ctrl+shift+a`)
4. T-003 (`run()` → `api.client.rpc` → `runAutoLifecycle`; keep `editor.add`)
5. T-004 (wire `OPENCODE_AUTO_CLI_TUI_PLUGIN_LOAD_UNSUPPORTED` + runbook `#36505`)
6. T-005 (8 `test_bug0021_*` markers)
7. T-006 (upgrade overwrite reshaped `tui.ts` + keep `auto.md` prune)
8. T-007 (runbook CLI TUI recipe + `--pure` out + active↔template parity)
9. Integration verification

## Critic NB awareness (execute)

- **T-004/T-005/T-007** (`bug0021arc-challenger-001` NB1): LOAD/LISTING/DISPATCH fail-closed. Silent skip when `tui()` never runs. `#36505` residual. Upgrade overwrite R7. Do **not** restore `auto.md` because of residual host-cannot-load.
- **T-anch..T-007** (`bug0021arc-architect-002` NB2): keep 1:1 architecture seeds; sprint folder is S0146; execute owns reshape `{ id, tui }` + `registerLayer` + `api.client.rpc` + 8 tests + overwrite; architecture owns H1+Axis A; `index.ts` server-only; CLI slash = keymap; `GET /api/command` is Command.Info.
- **T-anch** (`bug0021arc-subtractor-003` NB3): verification-only; do not rewrite `# BUG-0021` / `# BUG-0020` / R-0134; reject Axis B/D/E + companion DEC; do not mark DONE; do not reopen BUG-0020/0019/0018; do not mutate BUG-0022 / US-0139.

## Task checklist

- [x] **T-anch**: Verify `# BUG-0021` H1 in `docs/engineering/architecture.md`; Axis A LOCKED; R-0134 DQ1–DQ8 LOCKED; R-0126 / `# BUG-0020` C-limb listing claim superseded (historical `# BUG-0020` body + R-0126 not rewritten); companion DEC=none; compose guards (DEC-0124/0125 bodies UNCHANGED; BUG-0015/0016/0017/0018/0019/0020 not reopened; BUG-0022 OPEN not mutated; US-0139 / S0145 not reused). Verify `tests/bug0021_*` does NOT yet exist (or document baseline). Record to `sprints/S0146/t-anch-verification.md`. NO mutation to `architecture.md` / `docs/engineering/research.md` R-0134 in /execute. (DC / architecture baseline; NO-OP; AC-3, AC-8)

- [x] **T-001**: Reshape `.opencode/plugins/its-magic-auto/tui.ts` **and** `template/.opencode/plugins/its-magic-auto/tui.ts` to live default export `{ id: "its-magic.auto.tui", tui: async (api, options, meta) => { ... } }`. **Not** `Plugin.define({ setup })` as the TUI default. Keep file-plugin `id` **`"its-magic.auto.tui"`**. Keep `.opencode/tui.json` listing `"./plugins/its-magic-auto/tui.ts"` (load path, not listing proof); optional comment that listing ≠ proof. Keep thin `index.ts` `Plugin.define` (no `tui` export — a module cannot export both `server` and `tui`). **Do not** restore `auto.md`. **Do not** ship `.opencode/cli.json`. **Do not** ship plugin-local `its-magic-auto/tui.json`. Tests: marker 1. (AC-1)

- [x] **T-002**: Inside `tui()`, call `api.keymap.registerLayer` with command field **`name: "its-magic.auto"`** (not only `id`), `title: "/auto"`, `category: "its-magic"`, `slashName: "auto"`, `namespace: "palette"`, and bindings `{ key: "ctrl+shift+a", cmd: "its-magic.auto", desc }`. Keep extra `slash: { name: "auto" }` so `test_bug0019_*` stays green. Optional fallback `api.keymap.layer` **inside** `tui()`. Not keyless `bindings: ["its-magic.auto"]` as the only binding form. Avoid `ctrl+p`, `ctrl+x`, `ctrl+shift+p`, `ctrl+shift+m`. Tests: markers 2, 6. (AC-1)

- [x] **T-003**: `run()` dispatches via **`api.client.rpc(ITS_MAGIC_AUTO_RPC)`** → `runAutoLifecycle`. Keep HTTP RPC as fallback. Keep `dispatchRunAutoLifecycle`. **Not** SessionPrompt. **Not** Command.Info `template`. **Not** LLM chat. Keep `.opencode/plugins/orchestrator.ts` `editor.add({ name: "auto", execute })` → `runAutoLifecycle` as execute owner. Keep RPC register. Do **not** add a second `editor.add` in `index.ts`. Tests: marker 3. (AC-2, AC-5)

- [x] **T-004**: Add `OPENCODE_AUTO_CLI_TUI_PLUGIN_LOAD_UNSUPPORTED` to plugin `REASON_CODES` (active + template). Reuse `OPENCODE_AUTO_SLASH_LISTING_UNSUPPORTED` / `OPENCODE_AUTO_TUI_DISPATCH_UNSUPPORTED`. **Do not** reuse `OPENCODE_AUTO_DESKTOP_COMMAND_INFO_LISTING_UNSUPPORTED` or `OPENCODE_AUTO_MARKDOWN_COLLISION` for listed-but-skipped. Best-effort `emitCliTuiPluginLoadUnsupported(ctx)` only if the host exposes TUI load skip for the listed spec (session-visible notice, **not** TUI-toast-only; **must not** block `editor.add`). Always: token in comments + runbook residual `#36505` when `tui()` never runs. Stub + US-0126 cross-link only. Tests: marker 5. (AC-2, AC-10)

- [x] **T-005**: Create `tests/bug0021_opencode_cli_tui_plugin_load_test.py` (+ template mirror if paired) with **exactly 8** markers:
  1. `test_bug0021_tui_default_export_id_tui_shape`
  2. `test_bug0021_registerLayer_name_slashName_palette_key`
  3. `test_bug0021_run_rpc_to_runAutoLifecycle`
  4. `test_bug0021_no_auto_md_no_json_template`
  5. `test_bug0021_fail_closed_load_token`
  6. `test_bug0021_slash_list_is_keymap_not_command_info`
  7. `test_bug0021_active_template_parity`
  8. `test_bug0021_upgrade_copies_tui_shape_still_prunes_auto_md`
  Static/fixture only — **no live OpenCode CLI TUI probe** in default CI. Do **not** weaken `test_bug0018_*`. Do **not** weaken `test_bug0020_*` except compose-only comments that C-limb file-presence is not the CLI listing proof. Do **not** weaken `test_bug0019_*` except compose-only: keep `slashName: "auto"` / `slash: { name: "auto" }` / `registerLayer` or `keymap.layer`; `Plugin.define` remains on **index.ts**, not as the TUI default. (AC-1..AC-10)

- [x] **T-006**: Upgrade `--host opencode|both` **overwrites** framework-owned `.opencode/plugins/its-magic-auto/tui.ts` (and keep template twin) via existing `copy_opencode_auto_listing_surface` (`shutil.copy2` even when dest exists). This is **not** copy-if-absent. `tui.json`: keep BUG-0020 copy-if-absent / JSONC merge of the plugin spec; **do not** wholesale overwrite operator theme/keybinds/attention. Still run `prune_retired_opencode_auto_md`. Do **not** restore `auto.md`. Do **not** prune `.cursor/commands/auto.md` or `.opencode/agents/auto.md`. Do **not** invent a general sweeper. Confirm `installer.py` + `installer.sh` + `installer.ps1`. Named installer-owned-paths already include `tui.ts` / `tui.json` — amend comments only if needed. Tests: marker 8. (AC-6)

- [x] **T-007**: Runbook section/recipe (active + template byte-identical): (1) upgrade its-magic to the BUG-0021 release; (2) `its-magic --mode upgrade --host opencode|both` (overwrite reshaped `tui.ts` + prune leftover `auto.md`); (3) restart OpenCode CLI TUI (`opencode`, **not** `--pure`); (4) `/auto` is highlighted/listed and starts `runAutoLifecycle` — or documented `OPENCODE_*` (not LLM Auto mode). If still missing after that on a given binary: residual `#36505` → `OPENCODE_AUTO_CLI_TUI_PLUGIN_LOAD_UNSUPPORTED`; **do not** restore `auto.md`. `--pure` out of scope. Extend `check_intake_template_parity.py` with additive `BUG0021_PAIRS` for reshaped `tui.ts` (keep `BUG0020_PAIRS` / `BUG0019_PAIRS`). Active↔template parity for `tui.ts` / token wiring / runbook stub. Tests: marker 7 + parity script. (AC-7, AC-10)

## Integration verification (post T-007)

- [x] Test gate: `python -m pytest tests/bug0021*.py tests/bug0020*.py tests/bug0019*.py tests/bug0018*.py -v` → 8/8 bug0021 PASS; bug0020 still green (compose-only comments allowed); bug0019 still green; bug0018 still green
- [x] Parity gate: active ↔ template reshaped `tui.ts` / `tui.json` listing kept / token wiring / runbook stub / installer overwrite + prune
- [x] Scope gate: no companion DEC; no DEC-0124/0125 body rewrite; no `# BUG-0020` rewrite; no Cursor `auto.md` / agents `auto.md` touch; no restored `auto.md`; no JSON `commands.auto`; no `cli.json`; no plugin-local `its-magic-auto/tui.json`; no live OpenCode CLI TUI probe; no BUG-0022 / US-0139 mutation
- [x] Status gate: BUG-0021 remains OPEN; acceptance unchecked; intake JSON not mutated; BUG-0020/0019/0018 remain DONE

## Files to touch (scope)

### New (create)

- `tests/bug0021_opencode_cli_tui_plugin_load_test.py` (+ template if paired)
- `sprints/S0146/t-anch-verification.md` (execute)

### Edit (scoped)

- `.opencode/plugins/its-magic-auto/tui.ts` + template — reshape `{ id, tui }` + `registerLayer` + `run()` rpc
- `.opencode/tui.json` + template — keep listing; comment listing ≠ proof
- `.opencode/plugins/orchestrator.ts` + template — LOAD token + optional `emitCliTuiPluginLoadUnsupported`; keep `editor.add` + RPC
- `installer.py` + `installer.sh` + `installer.ps1` — confirm overwrite of `tui.ts`; keep targeted `auto.md` prune
- `docs/engineering/context/installer-owned-paths.manifest` — comments only if needed
- `scripts/check_intake_template_parity.py` — additive `BUG0021_PAIRS`
- `docs/engineering/runbook.md` + template — CLI TUI recipe + LOAD token stub + `#36505` residual + `--pure` out
- `tests/bug0020_*` — compose-only comments only

### Verify read-only (no mutation)

- `docs/engineering/architecture.md # BUG-0021`
- `docs/engineering/architecture.md # BUG-0020` (do not rewrite)
- `docs/engineering/research.md ## R-0134`
- `docs/product/backlog.md ### BUG-0021` Status/acceptance (US-0045)
- `docs/product/acceptance.md` BUG-0021 row
- `handoffs/intake_evidence/BUG-0021-intake-20260913.json`
- `tests/bug0018_*` / `tests/bug0019_*` / `tests/bug0020_*` (do not weaken except compose-only)
- absent `.opencode/commands/auto.md` + template twin
- present `.opencode/plugins/its-magic-auto/index.ts` (server `Plugin.define`; no `tui` export)
- present `.opencode/tui.json` listing `./plugins/its-magic-auto/tui.ts`

### Compose-guard UNCHANGED (DO NOT TOUCH)

| File / surface | Reason |
|---|---|
| Backlog Status / acceptance checkbox | US-0045 — closure only |
| `architecture.md` body beyond T-anch verify | locked in /architecture |
| `# BUG-0020` historical body / R-0126 body | superseded as listing claim; do not rewrite |
| DEC-0124.md / DEC-0125.md bodies | compose — do not rewrite |
| `# BUG-0019` / `# BUG-0018` historical bodies | compose — do not rewrite |
| BUG-0015 / BUG-0016 / BUG-0017 / BUG-0018 / BUG-0019 / BUG-0020 artifacts | DONE — do not reopen |
| BUG-0022 / US-0139 / US-0133..US-0148 | out of scope |
| `.cursor/commands/auto.md` | Cursor host — out of scope |
| `.opencode/agents/auto.md` | independent agent surface |
| `.opencode/commands/auto.md` restore | forbidden (recreates BUG-0018) |
| JSON `commands.auto` template | forbidden (Axis E rejected) |
| kit `cli.json` / plugin-local `tui.json` | forbidden |
| DEC-0038 tuple | UNAMENDED |

## AC → Task surjective coverage

| AC | Task(s) |
|---|---|
| AC-1 | T-001, T-002, T-005 (m1, m2, m6) |
| AC-2 | T-003, T-004, T-005 (m3, m5) |
| AC-3 | T-anch, T-005 (m4) |
| AC-4 | T-005 (m4) |
| AC-5 | T-003, T-005 (m3) |
| AC-6 | T-006, T-005 (m8) |
| AC-7 | T-007, T-005 (m7) |
| AC-8 | T-anch |
| AC-9 | T-005 |
| AC-10 | T-004, T-007 |
| DC / architecture | T-anch |

**Surjectivity check**: 10/10 ACs covered. All 8 markers mapped (m7 on T-007, m8 on T-006; T-005 owns m1–m8 including m4 and m6). No PLAN_AC_COVERAGE_GAP.
