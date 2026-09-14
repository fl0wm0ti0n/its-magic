# Sprint S0148 - Task checklist (BUG-0023)

Total tasks: 8 (T-anch + T-001..T-007). SPRINT_MAX_TASKS=12; SPRINT_AUTO_SPLIT=1; no split. T-anch retained as NO-OP verification. Seeds 1:1 from `docs/engineering/architecture.md` `# BUG-0023`. Sprint id S0148 (next free after S0147). Do not overwrite S0140–S0147. Do not reuse S0146 (BUG-0021) or S0147 (US-0140). US-0141 expected S0148 is superseded.

**Isolation**: `tl-BUG0023-sprintplan-20260914T001500Z-fresh` · `model_id=cursor-grok-4.6-high` · `orchestrator_run_id=auto-20260913-bug0023`

## Task execution order

1. T-anch (NO-OP / verification)
2. T-001 (shared `Rpc.define` `rpc.ts` — active + template)
3. T-002 (`await ctx.rpc.register(Defined, { runAutoLifecycle })`; keep `editor.add`)
4. T-003 (`dispatchRunAutoLifecycle` → `client.rpc(Defined)` + `OpenCode.make` fallback; remove invented POST; keep `{ id, tui }`)
5. T-004 (DISPATCH honest only when client/RPC truly absent)
6. T-005 (8 `test_bug0023_*` markers)
7. T-006 (upgrade overwrite dispatch path + keep `auto.md` prune)
8. T-007 (runbook CLI TUI dispatch recipe + `--pure` out + active↔template parity)
9. Integration verification

## Critic NB awareness (execute)

- **T-004/T-005/T-007** (`bug0023arc-challenger-001` NB1): DISPATCH is the defect, not success. Honest token only when client/RPC truly absent. Do **not** restore `auto.md` because DISPATCH fired.
- **T-anch..T-007** (`bug0023arc-architect-002` NB2): keep 1:1 architecture seeds; sprint folder is S0148; execute owns shared `rpc.ts` + await register + `client.rpc(Defined)` / `OpenCode.make` + 8 mock-invoke tests + overwrite; architecture owns H1+Axis A; keep `{ id, tui }` listing; keep `editor.add`; no companion DEC.
- **T-anch** (`bug0023arc-subtractor-003` NB3): verification-only; do not rewrite `# BUG-0023` / `# BUG-0021` / `# BUG-0019` / R-0137; reject Axis B/D/E/F + companion DEC; do not mark DONE; do not reopen BUG-0021/0020/0019/0018; do not mutate BUG-0022 / US-0141.

## Task checklist

- [x] **T-anch**: Verify `# BUG-0023` H1 in `docs/engineering/architecture.md`; Axis A LOCKED; R-0137 DQ1–DQ8 LOCKED; R-0134 / `# BUG-0021` dispatch claim superseded (historical `# BUG-0021` body + R-0134 not rewritten); companion DEC=none; compose guards (DEC-0124/0125 bodies UNCHANGED; BUG-0015/0016/0017/0018/0019/0020/0021 not reopened; BUG-0022 OPEN not mutated; US-0140 / S0147 not reused; US-0141 not mutated). Verify `tests/bug0023_*` does NOT yet exist (or document baseline). Record to `sprints/S0148/t-anch-verification.md`. NO mutation to `architecture.md` / `docs/engineering/research.md` R-0137 in /execute. (DC / architecture baseline; NO-OP; AC-3)

- [x] **T-001**: Ship `.opencode/plugins/its-magic-auto/rpc.ts` **and** `template/.opencode/plugins/its-magic-auto/rpc.ts` exporting `ITS_MAGIC_AUTO_RPC = Rpc.define({ id: "its-magic.auto", methods: { runAutoLifecycle: { input, output } } })` using **JSON Schema** (no Zod). Import specifier **LOCKED**: `@opencode/plugin/rpc`. Keep method schemas byte-compatible with today’s plain JSON (sessionID/prompt/delivery in; ok/reasonCode/sessionID/phase_id/cycles out). File-plugin `id` for TUI module stays **`"its-magic.auto.tui"`** (BUG-0021). RPC id stays **`"its-magic.auto"`**. Do **not** duplicate branded define objects. Tests: marker 1. (AC-1)

- [x] **T-002**: Orchestrator **static**-imports `rpc.ts` and **`await ctx.rpc.register(ITS_MAGIC_AUTO_RPC, { runAutoLifecycle: runAutoLifecycleRpc })`** when `ctx.rpc.register` exists (active + template). Missing `ctx.rpc` remains attach-optional (BUG-0019). Keep `.opencode/plugins/orchestrator.ts` `editor.add({ name: "auto", execute })` → `runAutoLifecycle`. Drop plain-JSON register and non-awaited swallow. Do **not** add a second `editor.add` in `index.ts`. Server `its-magic-auto/index.ts` stays thin `Plugin.define` (no `tui` export). Tests: marker 4. (AC-1, AC-5)

- [x] **T-003**: `dispatchRunAutoLifecycle` **dynamic**-imports `rpc.ts` **inside** the function (not top-level on the `{ id, tui }` module). Call `client.rpc(Defined).runAutoLifecycle(payload)` with payload `{ sessionID?, prompt?, delivery? }` — **not** `{ input: payload }`. If `typeof api.client.rpc !== "function"`: `OpenCode.make({ baseUrl }).rpc(Defined)` where `baseUrl = client.baseUrl ?? client.config?.baseUrl ?? client.defaults?.baseUrl`. Missing both `.rpc` and `baseUrl` → DISPATCH toast. **Do not** silent-default `http://localhost:4096`. Invented `POST /rpc/its-magic.auto/runAutoLifecycle` `{ input }` is **not** the happy path — remove from dispatch (leave unreachable/deleted). Keep default export `{ id, tui }` + `registerLayer` `slashName: "auto"` / `ctrl+shift+a`. Never SessionPrompt. Never Command.Info `template`. Never LLM chat. Tests: markers 2, 3. (AC-1, AC-5, AC-9)

- [x] **T-004**: DISPATCH toast **only** when client/RPC truly cannot dispatch (both `.rpc` and `OpenCode.make` fallback failed, or Defined cannot load). Do **not** reuse `OPENCODE_AUTO_SLASH_LISTING_UNSUPPORTED` / `OPENCODE_AUTO_CLI_TUI_PLUGIN_LOAD_UNSUPPORTED` / `OPENCODE_AUTO_DESKTOP_COMMAND_INFO_LISTING_UNSUPPORTED` / `OPENCODE_AUTO_MARKDOWN_COLLISION` for this miss. No new token. Do not treat DISPATCH as success. Do not restore `auto.md` because DISPATCH fired. Runbook: DISPATCH-is-defect. Tests: marker 6. (AC-2)

- [x] **T-005**: Create `tests/bug0023_opencode_cli_tui_dispatch_rpc_test.py` (+ small node harness/fixture that **invokes** `dispatchRunAutoLifecycle` / `run()` against a fake client) with **exactly 8** markers:
  1. `test_bug0023_rpc_define_shared_contract`
  2. `test_bug0023_dispatch_mock_invokes_runAutoLifecycle`
  3. `test_bug0023_http_fallback_is_client_rpc_not_invented_post`
  4. `test_bug0023_orchestrator_await_register_defined_rpc`
  5. `test_bug0023_keep_editor_add_no_auto_md`
  6. `test_bug0023_dispatch_token_only_when_rpc_absent`
  7. `test_bug0023_active_template_parity`
  8. `test_bug0023_upgrade_copies_dispatch_still_prunes_auto_md`
  Mock invoke — **no live OpenCode CLI TUI probe** in default CI. Do **not** weaken `test_bug0021_*` except compose-only comments that `"api.client.rpc" in src` is **not** dispatch proof. Do **not** weaken `test_bug0020_*` / `test_bug0019_*` / `test_bug0018_*`. (AC-1..AC-9)

- [x] **T-006**: Upgrade `--host opencode|both` **overwrites** framework-owned `tui.ts`, new `rpc.ts`, and orchestrator register path via existing copy helpers (`copy2` even when dest exists). This is **not** copy-if-absent. `tui.json`: keep BUG-0020 copy-if-absent / JSONC merge; **do not** wholesale overwrite operator theme/keybinds. Still run `prune_retired_opencode_auto_md`. Do **not** restore `auto.md`. Do **not** prune `.cursor/commands/auto.md` or `.opencode/agents/auto.md`. Confirm `installer.py` + `installer.sh` + `installer.ps1`. Named installer-owned-paths: add `template/.opencode/plugins/its-magic-auto/rpc.ts`. Tests: marker 8. (AC-7)

- [x] **T-007**: Runbook section/recipe (active + template byte-identical): (1) upgrade its-magic to the BUG-0023 release; (2) `its-magic --mode upgrade --host opencode|both` (overwrite dispatch path + prune leftover `auto.md`); (3) restart OpenCode CLI TUI (`opencode`, **not** `--pure`); (4) listed `/auto` **starts** `runAutoLifecycle` — or honest DISPATCH only if client/RPC truly absent (not LLM Auto mode). `--pure` out of scope. Extend `check_intake_template_parity.py` with additive `BUG0023_PAIRS` for `rpc.ts` + dispatch-path `tui.ts` / orchestrator (keep `BUG0021_PAIRS` / `BUG0020_PAIRS` / `BUG0019_PAIRS`). Tests: marker 7 + parity script. (AC-8)

## Integration verification (post T-007)

- [x] Test gate: `python -m pytest tests/bug0023*.py tests/bug0021*.py tests/bug0020*.py tests/bug0019*.py tests/bug0018*.py -v` → 8/8 bug0023 PASS; bug0021 still green (compose-only comments allowed); bug0020 still green; bug0019 still green; bug0018 still green
- [x] Parity gate: active ↔ template `rpc.ts` / dispatch-path `tui.ts` / orchestrator register / no-`auto.md` / runbook stub / installer overwrite + prune
- [x] Scope gate: no companion DEC; no DEC-0124/0125 body rewrite; no `# BUG-0021` rewrite; no Cursor `auto.md` / agents `auto.md` touch; no restored `auto.md`; no JSON `commands.auto`; no invented POST happy path; no live OpenCode CLI TUI probe; no BUG-0022 / US-0141 mutation
- [x] Status gate: BUG-0023 remains OPEN; acceptance unchecked; intake JSON not mutated; BUG-0021/0020/0019/0018 remain DONE

## Files to touch (scope)

### New (create)

- `.opencode/plugins/its-magic-auto/rpc.ts` + template twin
- `tests/bug0023_opencode_cli_tui_dispatch_rpc_test.py` (+ node harness/fixture if needed)
- `sprints/S0148/t-anch-verification.md` (execute)

### Edit (scoped)

- `.opencode/plugins/its-magic-auto/tui.ts` + template — dynamic-import Defined; `client.rpc(Defined)` + `OpenCode.make` fallback; remove invented POST happy path; **keep** `{ id, tui }` listing
- `.opencode/plugins/orchestrator.ts` + template — `await ctx.rpc.register(Defined, { runAutoLifecycle })`; keep `editor.add`; drop plain-JSON register
- `installer.py` + `installer.sh` + `installer.ps1` — overwrite `rpc.ts`/`tui.ts`/orchestrator dispatch path; **keep** targeted `auto.md` prune
- `docs/engineering/context/installer-owned-paths.manifest` — add named `rpc.ts` row
- `scripts/check_intake_template_parity.py` — additive `BUG0023_PAIRS`
- `docs/engineering/runbook.md` + template — CLI TUI **dispatch** recipe + DISPATCH-is-defect + `--pure` out
- `tests/bug0021_*` — compose-only comments only

### Verify read-only (no mutation)

- `docs/engineering/architecture.md # BUG-0023`
- `docs/engineering/architecture.md # BUG-0021` (do not rewrite)
- `docs/engineering/architecture.md # BUG-0019` (do not rewrite)
- `docs/engineering/research.md ## R-0137`
- `docs/product/backlog.md ### BUG-0023` Status/acceptance (US-0045)
- `docs/product/acceptance.md` BUG-0023 row
- `handoffs/intake_evidence/BUG-0023-intake-20260913.json`
- `tests/bug0018_*` / `tests/bug0019_*` / `tests/bug0020_*` / `tests/bug0021_*` (do not weaken except compose-only)
- absent `.opencode/commands/auto.md` + template twin
- present `.opencode/plugins/its-magic-auto/index.ts` (server `Plugin.define`; no `tui` export)
- present `.opencode/plugins/its-magic-auto/tui.ts` default export `{ id, tui }`

### Compose-guard UNCHANGED (DO NOT TOUCH)

| File / surface | Reason |
|---|---|
| Backlog Status / acceptance checkbox | US-0045 — closure only |
| `architecture.md` body beyond T-anch verify | locked in /architecture |
| `# BUG-0021` historical body / R-0134 body | superseded as dispatch claim; listing remains; do not rewrite |
| `# BUG-0019` / `# BUG-0018` historical bodies | compose — do not rewrite |
| DEC-0124.md / DEC-0125.md bodies | compose — do not rewrite |
| BUG-0015 / BUG-0016 / BUG-0017 / BUG-0018 / BUG-0019 / BUG-0020 / BUG-0021 artifacts | DONE — do not reopen |
| BUG-0022 / US-0140 / US-0141 / US-0133..US-0148 | out of scope |
| `.cursor/commands/auto.md` | Cursor host — out of scope |
| `.opencode/agents/auto.md` | independent agent surface |
| `.opencode/commands/auto.md` restore | forbidden (recreates BUG-0018) |
| JSON `commands.auto` template | forbidden (Axis D rejected) |
| DEC-0038 tuple | UNAMENDED |

## AC → Task surjective coverage

| AC | Task(s) |
|---|---|
| AC-1 | T-001, T-002, T-003, T-005 (m1, m2, m4) |
| AC-2 | T-004, T-005 (m6) |
| AC-3 | T-anch, T-005 (m5) |
| AC-4 | T-005 (m5) |
| AC-5 | T-002, T-003, T-005 (m5) |
| AC-6 | T-005 |
| AC-7 | T-006, T-005 (m8) |
| AC-8 | T-007, T-005 (m7) |
| AC-9 | T-003, T-005 (m3) |
| DC / architecture | T-anch |

**Surjectivity check**: 9/9 ACs covered. All 8 markers mapped (m7 on T-007, m8 on T-006; T-005 owns m1–m8 including m5). No PLAN_AC_COVERAGE_GAP.
