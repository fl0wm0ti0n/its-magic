
# BUG-0020 — OpenCode still has no invokable auto mode after BUG-0019 TUI keymap

## Overview

**`BUG-0020`** closes the **operator-picker listing residual** left after BUG-0019 E*: sibling `.opencode/plugins/its-magic-auto/{index.ts,tui.ts}` TUI keymap `slash`/`slashName` `"auto"` is present, `orchestrator.ts` `editor.add({ name: "auto", execute })` → `runAutoLifecycle` is still registered, colliding `auto.md` is absent — but the **desktop/GUI Command.Info composer** that lists `/ask` still has **no `/auto`**. Distinct from **BUG-0015 DONE** (attach present), **BUG-0017 DONE** (peers exist), **BUG-0018 DONE** (markdown-wins STOP — do **not** restore `auto.md`), and **BUG-0019 DONE** (E* closed on static `test_bug0019_*`; listing surface live-falsified as CLI TUI keymap ≠ desktop Command.Info). Do **not** reopen S0139 ACs.

**This section supersedes `R-0124` E\* / `# BUG-0019` “TUI keymap lists `/auto` in the operator picker”.** That picker claim is **live-falsified**. Do **not** rewrite the historical `# BUG-0019` body, `# BUG-0018` body, **R-0124**, **DEC-0124**, or **DEC-0125** (D8). E* remains the CLI TUI keymap surface; it is **not** the desktop Command.Info listing fix.

**Research anchor**: **`R-0126`** (DQ1–DQ8 LOCKED; compose **R-0125** / **R-0124**; do not wipe). **Companion DEC**: **none**. **Out of scope**: Cursor `/auto`; US-0135+; reopen 0015/16/17/18/19 ACs; JSON `commands.auto`+`template`; STOP-only `auto.md`; host parser patch; live OpenCode desktop CI probe (default out of CI, same as 0018/0019).

**EARLY_RESEARCH confirm** (architecture 2026-09-12; **no new `R-xxxx` / no R-0127**): live OpenCode `packages/opencode/specs/tui-plugins.md` still matches R-0126 DQ8 — TUI plugin config lives in `tui.json`; **no directory auto-discovery**; `plugin` entries are string specs or `[spec, options]`; relative paths resolve from the config file. Public CLI directory-discovery remains the looser path. Desktop `prompt-input.tsx` custom `/` rows remain Command.Info only. No new DQ.

**Fresh context marker**: `tl-BUG0020-architecture-20260912T232500Z-fresh`
**Orchestrator run id**: `auto-20260913-bug0020`
**Timestamp**: 2026-09-12T23:25:00Z (UTC)
**Verdict**: PASS
**Next**: `/sprint-plan`

## Approach locked (E2 — from R-0126 Axis E2 / DQ1–DQ8)

**Approach E2** (locked): **Honest host-cannot-do-both on desktop Command.Info** — the host cannot list execute-only `/auto` without stealing execute (0018-class). **Must still deliver auto mode**:

1. Keep `orchestrator.ts` `editor.add` → `runAutoLifecycle` (BUG-0018 A* retained).
2. **C-limb working start**: CLI TUI `/auto` via shipping `.opencode/tui.json` (and template twin) listing `its-magic-auto` so the existing keymap actually loads. Keep `.opencode/plugins/its-magic-auto/tui.ts` keymap; do **not** restore `auto.md`.
3. **Desktop-visible** fail-closed **`OPENCODE_AUTO_DESKTOP_COMMAND_INFO_LISTING_UNSUPPORTED`** when the operator Command.Info picker cannot list execute-only `/auto` while execute is registered — **not** silent miss. Do **not** reuse `OPENCODE_AUTO_SLASH_LISTING_UNSUPPORTED` (TUI keymap API missing) or `OPENCODE_AUTO_MARKDOWN_COLLISION`.
4. Runbook: how to start auto on OpenCode CLI TUI vs what desktop shows (token + CLI recipe).
5. Eight `test_bug0020_*` **contract** tests tied to picker/`tui.json`/token/no-`auto.md` — **not** file-existence-only of slash strings that closed 0019 falsely. Keep `test_bug0018_*`. Do not weaken `test_bug0019_*` except compose-only.
6. Upgrade `--host opencode|both` copy-on-add `tui.json` + token wiring; still prune leftover `auto.md`.

| Option | Summary | Verdict |
|--------|---------|---------|
| **E2** | Reject E* as listing fix for Command.Info picker; keep `editor.add`; C-limb CLI TUI `/auto` via `tui.json`; desktop-visible listing token; 8 tests; cite R-0126 | **Preferred** — only path that delivers auto mode without 0018-class steal |
| E2-A / Axis A (rejected) | Ship `tui.json` **as the desktop composer listing fix** | **Rejected** — `tui.json` is CLI-TUI-only; desktop slash is Command.Info |
| E2-B / Axis B (rejected) | Documented desktop API that lists execute-only `/auto` without `template` | **Rejected** — Command.Info `template` required; no kit listing API |
| E2-C / Axis C sole (rejected) | Desktop-visible non-slash button/slot that calls `runAutoLifecycle` | **Rejected as sole winner** — no desktop plugin UI API. **Retained as C-limb** = documented CLI TUI `/auto` |
| E2-D / Axis D (rejected) | JSON/markdown Command.Info `template` named `auto` | **Rejected** — 0018-class; do **not** restore STOP-only `auto.md` |
| E2-F (rejected) | Companion DEC / rewrite DEC-0124/0125 / rewrite `# BUG-0019` | **Rejected** — DQ6 additive `# BUG-0020`; D8 bodies UNCHANGED |
| E2-G (rejected) | Token-only / runbook-only with no working start | **Rejected** — D1/D9 require delivering auto mode; C-limb is required |

### Deferred locks (R-0126 → this section)

| Deferred item | Architecture lock |
|---------------|-------------------|
| Exact token string | Keep **`OPENCODE_AUTO_DESKTOP_COMMAND_INFO_LISTING_UNSUPPORTED`** (no bikeshed). Do **not** reuse `OPENCODE_AUTO_SLASH_LISTING_UNSUPPORTED` or `OPENCODE_AUTO_MARKDOWN_COLLISION`. |
| `tui.json` plugin spec | **Ship** `.opencode/tui.json` + `template/.opencode/tui.json` (JSONC). Shape: `"$schema": "https://opencode.ai/tui.json"` + `"plugin": ["./plugins/its-magic-auto/tui.ts"]` (path relative to the config file → `.opencode/plugins/its-magic-auto/tui.ts`). Comment: CLI-TUI-only; does **not** feed desktop Command.Info. **Do not** list the package directory (would resolve `index.ts` server module). **Do not** ship theme/keybinds/attention (operator TUI prefs). **Do not** ship `.opencode/cli.json`. **Do not** ship plugin-local `its-magic-auto/tui.json` (BUG-0019 `FORBIDDEN_TUI_JSON` stays). |
| Desktop-visible emission | Server `orchestrator.ts` after `editor.add`: if Command.Info `list()` has no `name === "auto"` while execute is registered, call `emitDesktopCommandInfoListingUnsupported(ctx)`. Channels, first success: (1) desktop/session notification API if present (`session.alert` / `app.notify` / GUI toast that is **not** TUI `tui.toast`); (2) session-visible system/error notice in the current desktop session; (3) plugin `setup` session-error return so the GUI surfaces the token. **Must not** be CLI TUI toast-only. **Must not** add a Command.Info `auto` template row. **Must not** block `editor.add` or TUI keymap (non-blocking for execute + C-limb). |
| Future desktop execute-only listing API | **Out of this bug.** If OpenCode later adds one, a new bug/story may replace the C-limb. Do not invent an API here. |

## CF supersede — R-0124 E* operator-picker listing claim (LOCKED)

| Prior lock | New lock (this section) |
|------------|-------------------------|
| R-0124 E\* / `# BUG-0019`: TUI keymap `slash`/`slashName` `"auto"` lists `/auto` **in the operator picker** | **SUPERSEDED as the operator-picker listing fix.** Desktop Command.Info picker (`sync.data.command` / `GET /api/command`) does **not** consume TUI keymap, `tui.json`, or `editor.add`. E* remains valid **CLI TUI keymap**. `# BUG-0020` is the listing contract for the picker that shows `/ask`. |
| `# BUG-0019` “do not ship kit `tui.json`” | **SUPERSEDED for the CLI working-start limb only.** Ship project `.opencode/tui.json` listing the TUI module so keymap actually loads (internal spec DQ8). Historical `# BUG-0019` body remains as shipped evidence. |
| BUG-0018 A*: plugin-only execute; `auto.md` absent; prune leftover; `OPENCODE_AUTO_MARKDOWN_COLLISION` | **Unchanged compose.** Execute owner + prune + collision token stay. |
| BUG-0019 tokens `OPENCODE_AUTO_SLASH_LISTING_UNSUPPORTED` / `OPENCODE_AUTO_TUI_DISPATCH_UNSUPPORTED` | **Unchanged compose** for CLI TUI keymap-missing / dispatch-fail. **Not** the desktop Command.Info silent-miss token. |

Historical `# BUG-0019` / `# BUG-0018` bodies remain as shipped evidence. Readers must follow **this** section for the **operator Command.Info picker**. Execute ownership remains `# BUG-0018` A*. CLI TUI keymap remains `# BUG-0019` E* plus this section’s `tui.json` load.

## Critic NB closures (research sovereign-critic — LOCKED here)

| ID | Carry-forward | Architecture lock |
|----|---------------|-------------------|
| NB1 | Desktop fail-closed emission + exact `tui.json` shape (R-0126 R1/R2; `bug0020res-challenger-001`) | Token string + JSONC spec + emission helper locked above. C-limb is the D1 documented equivalent. |
| NB2 | Architecture owns `# BUG-0020` + 8 tests + token wiring (`bug0020res-architect-002`) | This section; 8 `test_bug0020_*`; no companion DEC |
| NB3 | No `/sprint-plan` spawn from architecture; no companion DEC; no DONE; no 0019 reopen; no `auto.md` restore (`bug0020res-subtractor-003`) | Held. E2-A..E2-G rejected. Status OPEN. This phase does **not** spawn `/sprint-plan`. |

## Components

### CLI TUI working-start load path (DQ2, DQ4, DQ8, D1, D10)

Ship (active **and** template):

```jsonc
{
  "$schema": "https://opencode.ai/tui.json",
  // BUG-0020 / R-0126: CLI TUI plugin load only. Does NOT list /auto in desktop Command.Info.
  "plugin": ["./plugins/its-magic-auto/tui.ts"]
}
```

Keep existing `its-magic-auto/tui.ts` keymap (`slash`/`slashName` `"auto"`; `run()` → `runAutoLifecycle`). Keep thin `index.ts` (no second `editor.add`). **Do not** convert `orchestrator.ts` into a package.

Keep all `.opencode/commands/*.md` peers. Keep `.opencode/agents/auto.md`. Keep `.cursor/commands/auto.md`. **Do not** restore `.opencode/commands/auto.md`. **Do not** add JSON `commands.auto` / `command.auto` with `template`.

### Plugin execute retained (compose BUG-0018 A* / BUG-0015)

Keep `.opencode/plugins/orchestrator.ts` `ctx.command.transform` → `editor.add({ name: "auto", execute })` → `runAutoLifecycle`. Leftover-`auto.md` fail-closed `OPENCODE_AUTO_MARKDOWN_COLLISION` unchanged. Secondary `command.executed` stays defense-only.

### Desktop-visible listing fail-closed (DQ5)

Silent missing `/auto` in the operator Command.Info picker is the defect. CLI TUI toast-only does **not** reach that UI.

**Locked helper** `emitDesktopCommandInfoListingUnsupported(ctx)` in `orchestrator.ts` (active + template), invoked after `editor.add` when Command.Info has no `auto` row:

1. Desktop/session notification API if the host exposes one that is **not** TUI `tui.toast`.
2. Session-visible system/error notice in the current desktop session.
3. Plugin `setup` session-error return so the GUI surfaces **`OPENCODE_AUTO_DESKTOP_COMMAND_INFO_LISTING_UNSUPPORTED`**.

Forbidden: Command.Info `/auto` template; TUI toast as the only emission; blocking `editor.add` or TUI keymap.

### Reason codes (DQ5)

| Code | When |
|------|------|
| `OPENCODE_PLUGIN_DISPATCH_ATTACH_UNSUPPORTED` | Missing `command.transform` / `editor.add` (unchanged BUG-0015) |
| `OPENCODE_AUTO_MARKDOWN_COLLISION` | Leftover `.opencode/commands/auto.md` (unchanged BUG-0018). **Not** for listing-miss. |
| `OPENCODE_AUTO_SLASH_LISTING_UNSUPPORTED` | CLI TUI keymap/slash API missing (unchanged BUG-0019). **Not** the desktop Command.Info silent-miss token. |
| `OPENCODE_AUTO_TUI_DISPATCH_UNSUPPORTED` | Listed CLI TUI `/auto` `run()` cannot reach `runAutoLifecycle` (unchanged BUG-0019) |
| **`OPENCODE_AUTO_DESKTOP_COMMAND_INFO_LISTING_UNSUPPORTED`** | Plugin execute is registered **but** the operator Command.Info picker cannot list/invoke execute-only `/auto`. **Must not** silent missing-command on desktop. |

US-0126 owns the full table; this bug ships **stub only** (plugin `REASON_CODES` + runbook).

### Contract tests (DQ6 — eight markers)

Preferred: `tests/bug0020_opencode_desktop_command_info_listing_test.py`. **No live OpenCode desktop probe** (default out of CI, same as 0018/0019). Do **not** weaken `test_bug0018_*`. Do **not** weaken `test_bug0019_*` except compose-only comments that E* is not the desktop picker fix and that project `.opencode/tui.json` is now the CLI load path (plugin-local `its-magic-auto/tui.json` remains forbidden).

| # | Marker | Asserts |
|---|--------|---------|
| 1 | `test_bug0020_desktop_command_info_picker_contract` | Encode the operator-picker merge: desktop custom slash = `sync.data.command` (`source` command\|mcp\|skill) + builtins; **not** TUI keymap, **not** `editor.add`, **not** `tui.json` plugin list. Fixture/quoted contract from `prompt-input.tsx` + Command.Service phases. **Fail if** kit docs/comments claim `tui.json` or keymap feeds that picker. |
| 2 | `test_bug0020_no_command_info_auto_template` | no OpenCode `auto.md` and no JSON/JSONC `commands.auto` / `command.auto` with `template` (compose 0018/0019; picker must not steal execute) |
| 3 | `test_bug0020_plugin_editor_add_auto_execute_retained` | `command.transform` + `editor.add({ name: "auto" })` + `execute` / `runAutoLifecycle` still present (active + template) |
| 4 | `test_bug0020_desktop_listing_fail_closed_token` | additive desktop Command.Info listing token present; **not** reused as markdown-collision or TUI-keymap-missing; emission helper is not “files exist” / not TUI-toast-only |
| 5 | `test_bug0020_cli_tui_working_start_load_path` | `tui.json` lists `./plugins/its-magic-auto/tui.ts` **and** comments/runbook/tests assert CLI-TUI-only (Command.Service does not read `tui.json`). Not “file exists” alone. |
| 6 | `test_bug0020_tui_run_still_dispatches_lifecycle` | compose 0019: TUI `run` → `runAutoLifecycle` / RPC; **not** SessionPrompt / Command.Info template |
| 7 | `test_bug0020_active_template_parity` | chosen surface (`tui.json`, token wiring, no-`auto.md`, no JSON template) byte-parity (D10) |
| 8 | `test_bug0020_upgrade_copies_surface_still_prunes_auto_md` | upgrade `--host opencode\|both` copies/merges `tui.json` + token wiring onto already-E* trees; still **prunes** leftover `auto.md`; no general sweeper; existing operator `tui.json` theme/keybinds preserved on merge |

### Consumer upgrade (DQ7)

Already-E* trees have `its-magic-auto/{index.ts,tui.ts}` and still **lack** `tui.json` / desktop fail-closed.

**Ship** `template/.opencode/tui.json`. Named installer-owned-paths row: `.opencode/tui.json` / `template/.opencode/tui.json` (directory include `.opencode/plugins` does **not** cover project `tui.json`).

`its-magic --mode upgrade --host opencode|both`:

- If consumer `.opencode/tui.json` is **absent** → **copy** the template.
- If it **exists** → **JSONC merge** of `"plugin"` entry `./plugins/its-magic-auto/tui.ts` into the existing array; **do not** wholesale overwrite theme/keybinds/attention.
- Still run `prune_retired_opencode_auto_md`. Do **not** restore `auto.md`. Do **not** prune `.cursor/commands/auto.md` or `.opencode/agents/auto.md`.

Extend `check_intake_template_parity.py` with additive `BUG0020_PAIRS` for `tui.json` (keep `BUG0019_PAIRS`).

Runbook recipe: (1) upgrade to the BUG-0020 release; (2) `its-magic --mode upgrade --host opencode|both`; (3) restart OpenCode (not `--pure`); (4) **desktop Command.Info still will not list execute-only `/auto`** — operator sees documented `OPENCODE_AUTO_DESKTOP_COMMAND_INFO_LISTING_UNSUPPORTED` (not silent) **and** starts auto from **CLI TUI** `/auto` (`opencode`, not `--pure`).

## Touch surfaces (execute)

| Surface | Change |
|---------|--------|
| `.opencode/tui.json` + `template/.opencode/tui.json` | **Add** CLI TUI plugin list |
| `.opencode/plugins/orchestrator.ts` + template | Keep attach; add desktop listing token + `emitDesktopCommandInfoListingUnsupported` |
| `.opencode/plugins/its-magic-auto/tui.ts` | **Keep** keymap (no restore `auto.md`) |
| `.opencode/commands/auto.md` + template | **Stay absent** |
| OpenCode JSON `commands.auto` | **Do not add** |
| `.opencode/cli.json` | **Do not add** |
| `installer.py` + `installer.sh` + `installer.ps1` | Copy-if-absent / JSONC merge `tui.json`; **keep** targeted `auto.md` prune |
| `docs/engineering/context/installer-owned-paths.manifest` | Named rows for `.opencode/tui.json` |
| `scripts/check_intake_template_parity.py` | Additive `BUG0020_PAIRS` |
| `tests/bug0020_*` | 8 markers |
| `tests/bug0018_*` | Unchanged compose (`auto.md` absent) |
| `tests/bug0019_*` | Compose-only comments; markers unchanged |
| `docs/engineering/runbook.md` (+ template) | CLI TUI vs desktop recipe + listing token stub |

## Non-goals

- Allocate a companion DEC / rewrite DEC-0124 / DEC-0125 bodies
- Rewrite historical `# BUG-0019` / `# BUG-0018` / R-0124 bodies
- Reopen BUG-0015 / BUG-0016 / BUG-0017 / BUG-0018 / BUG-0019
- Restore STOP-only / empty `auto.md`
- JSON `commands.auto` template
- Ship kit `cli.json` or plugin-local `its-magic-auto/tui.json`
- Invent a desktop execute-only Command.Info listing API
- Live OpenCode desktop CI probe
- Touch `.cursor/commands/auto.md` or `.opencode/agents/auto.md`
- Drain US-0135+ / mutate US-0133..US-0148
- Cursor `/auto` changes
- Overwrite operator `tui.json` theme/keybinds on upgrade

## Risks

| Risk | Severity | Mitigation |
|------|----------|------------|
| R1 Operator stays on desktop and never opens CLI TUI | HIGH | D1 documented equivalent; runbook explicit CLI recipe; do not fake Command.Info `/auto`; desktop-visible token (not silent) |
| R2 Desktop-visible fail-closed has no documented toast API from a server plugin | MEDIUM | Locked emission order (session notice / setup session-error); TUI toast-only forbidden; marker 4 |
| R3 Internal `tui.json` vs public directory-discovery disagreement | MEDIUM | Ship `tui.json` for CLI TUI load; marker 5 forbids claiming it feeds desktop |
| R4 Upgrade overwrites operator `tui.json` theme/keybinds | MEDIUM | Copy-if-absent + JSONC merge of plugin spec only; marker 8 |
| R5 Someone restores `auto.md` / JSON template to fill the picker | LOW | D4/D6 + marker 2 + keep `test_bug0018_*` |
| R6 Cursor `/auto` mistaken for this bug | LOW | Out of scope (D8); do not prune `.cursor/commands/auto.md` |
| R7 Reason-code stub drift vs US-0126 | LOW | Stub + cross-link only |

## AC coverage mapping (bug acceptance + R-0126)

| Expected slice | Architecture anchor | Seeds |
|----------------|---------------------|-------|
| Operator can start auto on OpenCode (documented equivalent) | E2 C-limb CLI TUI `/auto` after `tui.json` load | T-001, T-005 (m5, m6) |
| Invocation starts `runAutoLifecycle` or documented `OPENCODE_*` | Retain `editor.add`; TUI `run()`; tokens | T-002, T-003, T-005 (m3, m6) |
| Desktop picker is not a silent miss | `OPENCODE_AUTO_DESKTOP_COMMAND_INFO_LISTING_UNSUPPORTED` | T-003, T-004, T-005 (m1, m4), T-007 |
| Must not restore STOP-only `auto.md` | D4 / E2-D rejected | T-002, T-005 (m2) |
| Must not JSON-template `/auto` | E2-D rejected | T-002, T-005 (m2) |
| Plugin `editor.add` execute retained | Compose 0018 A* | T-002, T-005 (m3) |
| Consumer upgrade copies/merges `tui.json` + still prunes `auto.md` | DQ7 | T-006, T-005 (m8) |
| Active↔template parity | D10 | T-007, T-005 (m7) |
| Peers remain listed | Do not delete other `.md` commands | T-anch, T-002 |
| Tests are picker/token contracts, not slash-string existence | DQ6 eight markers | T-005 |

Acceptance checkbox: `docs/product/acceptance.md` BUG-0020 row remains unchecked until closure (US-0045).

## Atomic task seeds (for `/sprint-plan`)

| # | Seed | Surfaces |
|---|------|----------|
| T-anch | Verify `# BUG-0020` H1 + approach E2 + R-0126 DQ1–DQ8 + E* picker claim superseded + no companion DEC | architecture.md, R-0126 (read-only) |
| T-001 | Add `.opencode/tui.json` (active+template) listing `./plugins/its-magic-auto/tui.ts`; CLI-TUI-only comment; keep existing `tui.ts` keymap; do not restore `auto.md` | `.opencode/tui.json` + template twin |
| T-002 | Retain `orchestrator.ts` `editor.add({ name: "auto", execute })` → `runAutoLifecycle`; do **not** restore `auto.md`; do **not** add JSON `commands.auto` template; do **not** ship `cli.json` | `orchestrator.ts`; confirm `auto.md` absent |
| T-003 | Wire `emitDesktopCommandInfoListingUnsupported` + `OPENCODE_AUTO_DESKTOP_COMMAND_INFO_LISTING_UNSUPPORTED` (not TUI-toast-only; not Command.Info `auto` template) | `orchestrator.ts` (active + template) |
| T-004 | Add token to plugin `REASON_CODES` + runbook stub (US-0126 cross-link); document desktop vs CLI TUI | `orchestrator.ts` vocab + runbook |
| T-005 | Add 8 `test_bug0020_*` markers; no live OpenCode probe; do not weaken `test_bug0018_*`; compose-only `test_bug0019_*` comments | `tests/bug0020_*.py` |
| T-006 | Upgrade `--host opencode\|both` copy-if-absent / JSONC-merge `tui.json` + token wiring; still **prunes** leftover `auto.md`; installer-owned-paths named rows | installer.py/sh/ps1 + manifest |
| T-007 | Runbook CLI TUI `/auto` vs desktop token+CLI recipe + active↔template parity for `tui.json` / token / runbook / `BUG0020_PAIRS` | runbook + template + `check_intake_template_parity.py` |

**Task count**: 8 seeds (T-anch + T-001..T-007). `SPRINT_MAX_TASKS=12` — no auto-split. Not `/quick` (`tui.json` + desktop emission + three installers + 8 tests + runbook). 1:1 later for `/sprint-plan`.

## Decision linkage

- Decision: **none** (companion DEC not required — cite **R-0126**)
- Compose (do not amend bodies): **DEC-0124**, **DEC-0125**, **DEC-0120**, **DEC-0132** (preserve paths — `tui.json` is framework, merge-safe vs operator theme)
- Research: **R-0126** (composes **R-0125** / **R-0124**; do not wipe; **no R-0127**)
- Related: **US-0124**, **US-0125**, **US-0069**, **US-0126** (stub only); **BUG-0019** / **BUG-0018** / **BUG-0015** / **BUG-0017** / **BUG-0016** DONE — out of scope

## Isolation evidence (US-0048 / DEC-0029)

- `phase_id=architecture`, `role=tech-lead`, `bug_id=BUG-0020`, `sprint_id=none`, `orchestrator_run_id=auto-20260913-bug0020`
- `delivery_mode=ultra_lean`, `macro_phase=plan`, `model_id=cursor-grok-4.6` (CROSS_MODEL_REVIEW=1)
- `fresh_context_marker=tl-BUG0020-architecture-20260912T232500Z-fresh`, `timestamp=2026-09-12T23:25:00Z`
- Narrow-read: phase-context.md; R-0126; `# BUG-0019` (not rewritten); `# BUG-0018` (not rewritten); BUG-0020 backlog; critic NBs `bug0020res-*`
- No execute-surface mutation in this phase; no DONE flip; acceptance unchecked; no companion DEC; no DEC-0124/0125 body rewrite; `# BUG-0019` / `# BUG-0018` historical bodies not rewritten; no `/sprint-plan` spawn; no R-0127

## Strict runtime proof

- `runtime_proof_id=rp-auto-20260913-bug0020-architecture-techlead-20260912T232500Z-BUG-0020`
- Hash via `scripts.token_cost_lib.compute_strict_proof_hash` (compact sorted-key JSON).
- Canonical hashed payload: `{"orchestrator_run_id":"auto-20260913-bug0020","phase_id":"architecture","proof_issued_at":"2026-09-12T23:25:00Z","proof_ttl_seconds":3600,"role":"tech-lead","runtime_proof_id":"rp-auto-20260913-bug0020-architecture-techlead-20260912T232500Z-BUG-0020"}`
- Isolation extras (not hashed): `delivery_mode=ultra_lean`, `macro_phase=plan`, `model_id=cursor-grok-4.6`, `sprint_id=none`, `story_id=BUG-0020`
- `proof_hash=92D10D4743D65A2F7AF276A45749FB57DFA15593254213488026D10171C2EC87`
- `proof_ttl=2026-09-13T00:25:00Z`
- Consumed research proof: `rp-auto-20260913-bug0020-research-techlead-20260912T225800Z-BUG-0020` / `CD22980C635030A79DAC0705CFA0DEF87C64CF10A3279DEC46E97BCBE7C74CC8` — RUNTIME_PROOF_VALID MATCH before TTL `2026-09-12T23:58:00Z` (independent Python recompute byte-identical at 2026-09-12T23:25:00Z)

# BUG-0009: Downstream-safe template CI vs kit-internal active CI
Archived body in pack_ref: docs/engineering/architecture-archive/architecture-pack-20260913-j.md

# US-0091 — README ↔ backlog feature coverage backfill + blocking drift gate
Archived body in pack_ref: docs/engineering/architecture-archive/architecture-pack-20260913-i.md

# US-0093 — Cursor browser-integrated UAT self-test
Archived body in pack_ref: docs/engineering/architecture-archive/architecture-pack-20260913-i.md

# US-0109 — Self-Healing Deploy Loop (post-deploy smoke probe + bounded retry + DEPLOY_DEFERRED)
Archived body in pack_ref: docs/engineering/architecture-archive/architecture-pack-20260824.md

# BUG-0010 — Dual-level architecture story headings and diff-gated H1 enforcement
Archived body in pack_ref: docs/engineering/architecture-archive/architecture-pack-20260628.md

# BUG-0011 — Caveman voice-compression rules missing from caveman.mdc
Archived body in pack_ref: docs/engineering/architecture-archive/architecture-pack-20260628-a.md

# BUG-0012 — Native-chain orchestrator compliance regression (post-US-0095)
Archived body in pack_ref: docs/engineering/architecture-archive/architecture-pack-20260628-d.md

# US-0042 — Post-QA release findings workflow
Archived body in pack_ref: docs/engineering/architecture-archive/architecture-pack-20260612-a.md

# US-0089: Cursor Caveman mode (scratchpad-configurable terse responses)
Archived body in pack_ref: docs/engineering/architecture-archive/architecture-pack-20260913-i.md

# US-0090: Caveman input compression

**`US-0090`** adds an optional **input-side** Caveman file-scope compression layer,
orthogonal to the response-side voice owned by `# US-0089` (DEC-0072 §1 three-axis
non-substitution). Binding: **`DEC-0073`**; research **`R-0073`**. Composes on `# US-0089`,
**`US-0053`**, **`US-0085`** (See `# US-0085` for context fresh-context markers), and
**`US-0078`** / **`DEC-0060`** (compressed input must not bypass the intake evidence gate).
2 net-new keys: `CAVEMAN_COMPRESS_INPUT` / `CAVEMAN_FILE_SCOPE` + `CAVEMAN_COMPRESS_SCOPE_EMPTY`.

- Decision: **`DEC-0073`** — Amends: **`DEC-0072`** — Research: **`R-0073`** — Composed: `# US-0089`, **`US-0053`**, **`US-0085`**, **`US-0078`**, **`DEC-0060`**

# BUG-0021 — OpenCode CLI TUI still has no invokable `/auto` after BUG-0020 tui.json

## Overview

**`BUG-0021`** closes the **CLI TUI listing residual** left after BUG-0020 E2 C-limb: project `.opencode/tui.json` lists `./plugins/its-magic-auto/tui.ts`, sibling keymap strings `slash`/`slashName` `"auto"` exist, `orchestrator.ts` `editor.add({ name: "auto", execute })` → `runAutoLifecycle` is still registered, colliding `auto.md` is absent — but the operator **OpenCode CLI TUI** (`opencode`, not `--pure`) still has **no invokable `/auto`**. Typing `/auto ` (trailing space, not highlighted) sends chat; the model roleplays “Auto mode enabled. Describe the task you want handled.” That is **LLM prompt handling**, not lifecycle, and not OpenCode permission `--auto`.

Distinct from **BUG-0015 DONE** (attach present), **BUG-0017 DONE** (peers exist), **BUG-0018 DONE** (markdown-wins STOP — do **not** restore `auto.md`), **BUG-0019 DONE** (E* closed on static `test_bug0019_*`), and **BUG-0020 DONE** (C-limb closed on static `test_bug0020_*`; desktop Command.Info honest token remains). Do **not** reopen S0140 / BUG-0020 ACs.

**This section supersedes `R-0126` / `# BUG-0020` C-limb “CLI TUI `/auto` via shipping `tui.json` works”.** That listing claim is **live-falsified**. Do **not** rewrite the historical `# BUG-0020` body, `# BUG-0019` body, `# BUG-0018` body, **R-0126**, **R-0125**, **R-0124**, **DEC-0124**, or **DEC-0125**. C-limb remains the **load path** (`tui.json` listing). It is **not** proof that the TUI loader activated `/auto`.

**Research anchor**: **`R-0134`** (DQ1–DQ8 LOCKED; compose **R-0131** / **R-0126** / **R-0125** / **R-0124**; do not wipe). **Companion DEC**: **none** (same class as BUG-0019 / BUG-0020). **EARLY_RESEARCH**: consumed R-0134 live fetch; **no new `R-xxxx`**. **Out of scope**: Cursor `/auto`; `--pure`; BUG-0022; US-0139+ drain; US-0133..US-0148 mutation; reopen 0015/16/17/18/19/0020 ACs; JSON `commands.auto`+`template`; STOP-only `auto.md`; live OpenCode CLI TUI probe in default CI.

**Fresh context marker**: `tl-BUG0021-architecture-20260913T121000Z-fresh`
**Orchestrator run id**: `auto-20260913-bug0021`
**Timestamp**: 2026-09-13T12:10:00Z (UTC)
**Verdict**: PASS (`decision_gate=false`)
**Next**: `/sprint-plan`

## Approach locked (Axis A — from R-0134 DQ1–DQ8)

**Approach Axis A** (locked): reshape the already-listed TUI module so the CLI TUI loader can activate it, then register a real keymap slash command whose `run()` starts lifecycle.

1. Keep `.opencode/tui.json` (and template twin) listing `"./plugins/its-magic-auto/tui.ts"`. Listing is the **load path**, not the listing proof.
2. Reshape `.opencode/plugins/its-magic-auto/tui.ts` (and template twin) to live default export `{ id, tui }` with `tui: async (api, options, meta) => { ... }`. File-plugin `id` stays **`"its-magic.auto.tui"`**. **Not** `Plugin.define({ setup })` as the TUI default (that shape is skipped by `readV1Plugin(..., "tui")`).
3. Inside `tui()`, call `api.keymap.registerLayer` with command field **`name`** (not only `id`), `slashName: "auto"`, `namespace: "palette"`, and bindings **`{ key, cmd, desc }`**. Locked chord: **`ctrl+shift+a`** (`cmd: "its-magic.auto"`). Keep extra `slash: { name: "auto" }` so `test_bug0019_*` string contracts stay green.
4. `run()` dispatches via **`api.client.rpc(ITS_MAGIC_AUTO_RPC)`** → `runAutoLifecycle`. Keep HTTP RPC as fallback. Keep `dispatchRunAutoLifecycle`. **Not** SessionPrompt. **Not** Command.Info `template`. **Not** LLM chat.
5. Keep `.opencode/plugins/orchestrator.ts` `editor.add({ name: "auto", execute })` → `runAutoLifecycle` as execute owner. Keep RPC register. Thin `index.ts` stays server `Plugin.define` (do **not** add `tui` there — a module cannot export both `server` and `tui`).
6. Fail-closed: reuse `OPENCODE_AUTO_SLASH_LISTING_UNSUPPORTED` / `OPENCODE_AUTO_TUI_DISPATCH_UNSUPPORTED`; additive **`OPENCODE_AUTO_CLI_TUI_PLUGIN_LOAD_UNSUPPORTED`** for listed-but-skipped; **do not** reuse the desktop Command.Info token or markdown-collision.
7. Eight additive `test_bug0021_*` contract tests that are **not** `tui.json`-path-only. Keep `test_bug0020_*` / `test_bug0019_*` / `test_bug0018_*` compose.
8. Upgrade `--host opencode|both` **overwrites** reshaped `tui.ts` on already-C-limb trees; still **prunes** leftover `auto.md`. `tui.json` path can stay.

| Option | Summary | Verdict |
|--------|---------|---------|
| **Axis A** | `{ id, tui }` + `registerLayer` (`name` / `slashName: "auto"` / `namespace: "palette"` / `{ key: "ctrl+shift+a", cmd }`); keep `tui.json`; `run()` → `api.client.rpc` → `runAutoLifecycle`; keep `editor.add` | **Preferred** — simplest design that meets D1/D9 |
| Axis B (rejected) | `Plugin.define` / `keymap.layer` / `cli.json` / directory discovery | **Rejected** — already shipped; `tui.json` loader does not consume it |
| Axis C sole (rejected) | Host-true real command not chat as a separate stack | **Delivered by A** — not a second implementation |
| Axis D (rejected) | File-existence-only (`tui.json` lists `tui.ts`) | **Rejected** — live-falsified C-limb |
| Axis E (rejected) | Restore STOP-only `auto.md` / JSON `commands.auto`+`template` | **Rejected** — BUG-0018 class |
| Axis F (rejected) | Companion DEC / rewrite `# BUG-0020` | **Rejected** — DQ6 additive H1; historical bodies UNCHANGED |
| Axis G (rejected) | Token-only / runbook-only with no working `/auto` | **Rejected** — D1/D9 require listed command + lifecycle (or honest `OPENCODE_*`) |

### Deferred locks (R-0134 → this section)

| Deferred item | Architecture lock |
|---------------|-------------------|
| Default-export `id` | Keep **`"its-magic.auto.tui"`** (non-empty file-plugin id). |
| TypeScript types | Local `TuiPlugin` alias is enough. Optional type-only import from `@opencode-ai/plugin/tui` / `@opencode/plugin/tui`. **Do not** hard-require `Plugin.define` at runtime for the TUI default. Keep the `@opencode/plugin/tui` **string** in a comment so `test_bug0019_*` stays green. |
| Command `name` | **`"its-magic.auto"`** (matches RPC id / binding `cmd`). `slashName: "auto"`. Extra `slash: { name: "auto" }` retained for 0019. |
| Binding key | **`ctrl+shift+a`** locked. Avoid `ctrl+p`, `ctrl+x`, `ctrl+shift+p`, `ctrl+shift+m`. Slash listing does **not** depend on the chord. |
| Additive token string | Keep **`OPENCODE_AUTO_CLI_TUI_PLUGIN_LOAD_UNSUPPORTED`** (no bikeshed). |
| Load-skip visibility when `tui()` never runs | Kit TUI module **cannot toast if it never loads**. Always: token in orchestrator `REASON_CODES` + `tui.ts`/`tui.json` comments + runbook. Best-effort: if the host exposes TUI load skip for the listed spec, `emitCliTuiPluginLoadUnsupported(ctx)` via session-visible notice (**not** TUI-toast-only). After Axis A, this token is the **residual host-cannot-load** case (`#36505` class), not the expected happy path. **Do not** restore `auto.md` because of that residual. |

## CF supersede — R-0126 / `# BUG-0020` C-limb CLI TUI listing claim (LOCKED)

| Prior lock | New lock (this section) |
|------------|-------------------------|
| R-0126 E2 C-limb / `# BUG-0020`: CLI TUI `/auto` via shipping `tui.json` | **SUPERSEDED as the CLI TUI listing fix.** `tui.json` is the load **path**. Loader still requires default export `{ id, tui }` with `typeof tui === "function"`. Kit `Plugin.define({ setup })` is skipped → silent miss. `# BUG-0021` is the listing contract for operator CLI TUI `/auto`. |
| `# BUG-0020` desktop Command.Info honest token | **Unchanged compose.** Desktop picker remains Command.Info-only. This bug is CLI TUI keymap. |
| BUG-0018 A*: plugin-only execute; `auto.md` absent; prune leftover; `OPENCODE_AUTO_MARKDOWN_COLLISION` | **Unchanged compose.** Execute owner + prune + collision token stay. |
| BUG-0019 tokens `OPENCODE_AUTO_SLASH_LISTING_UNSUPPORTED` / `OPENCODE_AUTO_TUI_DISPATCH_UNSUPPORTED` | **Unchanged compose** for keymap-API-missing after `tui()` **ran** / dispatch-fail. **Not** the listed-but-skipped load token. |

Historical `# BUG-0020` / `# BUG-0019` / `# BUG-0018` bodies remain as shipped evidence. Readers must follow **this** section for **CLI TUI `/auto`**. Execute ownership remains `# BUG-0018` A*. Desktop listing remains `# BUG-0020`. CLI TUI keymap remains `# BUG-0019` E* plus this section’s `{ id, tui }` activation.

## Design challenge (assumptions / simpler / risks)

- **Alternative to reshape?** Leave `Plugin.define` and hope directory discovery lists `/auto`. Already failed (BUG-0019 + BUG-0020). **One viable loader shape** for `tui.json` file plugins: `{ id, tui }`.
- **Alternative to keymap slash?** Restore `auto.md` or JSON `template`. Smaller on paper; recreates BUG-0018 steal. **Rejected.**
- **Can this be simpler?** Dual-export `{ setup, tui }` / two defaults cannot satisfy `readV1Plugin`. Axis A (one default export in the already-listed file) is the simplest path that meets D1/D9.
- **Governance fork?** Live docs specify the TUI module shape. Implementing it is not a DEC-class fork. **`decision_gate=false`**. No companion DEC.
- **Binding bikeshed?** Research left the exact chord to architecture. Locked **`ctrl+shift+a`**. Collision is residual (operator `keybinds`); slash listing still works without the chord.
- **Honest residual:** operator OpenCode binary predating v2 external TUI plugin activation ([anomalyco/opencode#36505](https://github.com/anomalyco/opencode/issues/36505)). Cite as residual **not** a reason to restore `auto.md`. Fail-closed `OPENCODE_AUTO_CLI_TUI_PLUGIN_LOAD_UNSUPPORTED` + runbook.

## Critic NB closures (research sovereign-critic — LOCKED here)

| ID | Carry-forward | Architecture lock |
|----|---------------|-------------------|
| NB1 | Proof fail-closed; LOAD/LISTING/DISPATCH; silent skip when `tui()` never runs; `#36505` residual (`bug0021rsc-challenger-001`) | Token string + emission order + runbook residual locked above. Axis A still required. |
| NB2 | TUI keymap vs Command.Info; rpc dispatch; architecture owns `# BUG-0021` + 8 tests; no companion DEC (`bug0021rsc-architect-002`) | This section; 8 `test_bug0021_*`; no companion DEC |
| NB3 | No DONE; no STOP-only restore; no BUG-0020 reopen; no BUG-0022 mutate; no `/sprint-plan` spawn (`bug0021rsc-subtractor-003`) | Held. Status OPEN. This phase does **not** spawn `/sprint-plan`. |

## Components

### CLI TUI module shape (DQ1, DQ2, DQ8)

Ship (active **and** template) `.opencode/plugins/its-magic-auto/tui.ts`:

```ts
export default {
  id: "its-magic.auto.tui",
  tui: async (api, options, meta) => {
    // registerLayer + fail-closed LISTING if keymap API missing
  },
};
```

Locked `registerLayer` command:

- `name: "its-magic.auto"`
- `title: "/auto"`
- `category: "its-magic"`
- `namespace: "palette"`
- `slashName: "auto"`
- `slash: { name: "auto" }` (0019 compose; host may ignore)
- `run` → `dispatchRunAutoLifecycle` via `api.client.rpc(ITS_MAGIC_AUTO_RPC)`

Locked binding: `{ key: "ctrl+shift+a", cmd: "its-magic.auto", desc: AUTO_DESCRIPTION }`.

Primary API: `api.keymap.registerLayer`. Optional fallback: `api.keymap.layer` **inside** `tui()` (defense; 0019 accepts either). Default export **must not** be `Plugin.define({ setup })`.

Keep `.opencode/tui.json`:

```jsonc
{
  "$schema": "https://opencode.ai/tui.json",
  // BUG-0020 load path + BUG-0021: listing is not proof of /auto.
  // Loader requires default export { id, tui }. Cite R-0134 / # BUG-0021.
  "plugin": ["./plugins/its-magic-auto/tui.ts"]
}
```

Keep all `.opencode/commands/*.md` peers. Keep `.opencode/agents/auto.md`. Keep `.cursor/commands/auto.md`. **Do not** restore `.opencode/commands/auto.md`. **Do not** add JSON `commands.auto` / `command.auto` with `template`. **Do not** ship kit `cli.json`. **Do not** ship plugin-local `its-magic-auto/tui.json`.

### Plugin execute retained (compose BUG-0018 A* / BUG-0015)

Keep `.opencode/plugins/orchestrator.ts` `ctx.command.transform` → `editor.add({ name: "auto", execute })` → `runAutoLifecycle`. Keep `ctx.rpc.register(ITS_MAGIC_AUTO_RPC, { runAutoLifecycle })`. Leftover-`auto.md` fail-closed `OPENCODE_AUTO_MARKDOWN_COLLISION` unchanged. Secondary `command.executed` stays defense-only. Server `its-magic-auto/index.ts` stays thin `Plugin.define` (no second `editor.add`; no `tui` export).

### Fail-closed tokens (DQ5)

Silent missing `/auto` with `tui.json` present is the defect.

| Code | When |
|------|------|
| `OPENCODE_PLUGIN_DISPATCH_ATTACH_UNSUPPORTED` | Missing `command.transform` / `editor.add` (unchanged BUG-0015) |
| `OPENCODE_AUTO_MARKDOWN_COLLISION` | Leftover `.opencode/commands/auto.md` (unchanged BUG-0018). **Not** for listing-miss. |
| `OPENCODE_AUTO_SLASH_LISTING_UNSUPPORTED` | `tui()` **ran** but `api.keymap.registerLayer` (and documented keymap API) is missing. Toast from `tui()`. **Not** listed-but-skipped. |
| `OPENCODE_AUTO_TUI_DISPATCH_UNSUPPORTED` | Listed `/auto` `run()` cannot reach `runAutoLifecycle` / RPC (unchanged BUG-0019) |
| `OPENCODE_AUTO_DESKTOP_COMMAND_INFO_LISTING_UNSUPPORTED` | Desktop Command.Info silent-miss (compose BUG-0020). **Do not reuse** for CLI TUI. |
| **`OPENCODE_AUTO_CLI_TUI_PLUGIN_LOAD_UNSUPPORTED`** | `tui.json` **lists** the TUI module **but** the host skipped it (`readV1Plugin` / no `tui()` / init fail / `#36505`-class no external load). **Must not** silent-miss in kit docs. |

US-0126 owns the full table; this bug ships **stub only** (plugin `REASON_CODES` + runbook).

**Emission when `tui()` never runs:** comments + runbook always; orchestrator `emitCliTuiPluginLoadUnsupported(ctx)` only if the host exposes load failure for the listed spec; session-visible notice, **not** TUI toast as the only path; **must not** block `editor.add`.

### Contract tests (DQ6 — eight markers)

Preferred: `tests/bug0021_opencode_cli_tui_plugin_load_test.py`. **No live OpenCode CLI TUI probe** in default CI (same class as 0018/0019/0020). Optional live probe may exist **outside** default CI. Do **not** weaken `test_bug0018_*`. Do **not** weaken `test_bug0020_*` except compose-only comments that C-limb file-presence is not the CLI listing proof. Do **not** weaken `test_bug0019_*` except compose-only: keep `slashName: "auto"` / `slash: { name: "auto" }` / `registerLayer` or `keymap.layer`; `Plugin.define` remains on **index.ts**, not as the TUI default.

| # | Marker | Asserts |
|---|--------|---------|
| 1 | `test_bug0021_tui_default_export_id_tui_shape` | Default export is `{ id, tui }` with a `tui` function; **not** `Plugin.define({ setup })` as the TUI default. Quote/lock `readV1Plugin` contract (`must default export an object with tui()`). Active + template. |
| 2 | `test_bug0021_registerLayer_name_slashName_palette_key` | `registerLayer` command uses **`name`** (not only `id`), `slashName: "auto"`, `namespace: "palette"`, bindings `{ key, cmd }` with non-empty `key` **`ctrl+shift+a`**. Not keyless `bindings: ["its-magic.auto"]` as the only binding form. |
| 3 | `test_bug0021_run_rpc_to_runAutoLifecycle` | `tui` `run()` dispatches via `api.client.rpc` / `ITS_MAGIC_AUTO_RPC` → `runAutoLifecycle`; not SessionPrompt; not Command.Info `template`; not LLM chat. |
| 4 | `test_bug0021_no_auto_md_no_json_template` | Compose 0018/0019: no OpenCode `auto.md`; no JSON/JSONC `commands.auto`+`template`. |
| 5 | `test_bug0021_fail_closed_load_token` | Additive CLI-TUI load-skip token present and **not** aliased onto desktop / markdown-collision / keymap-API-missing tokens; runbook documents silent-skip when `tui()` never runs. |
| 6 | `test_bug0021_slash_list_is_keymap_not_command_info` | Contract: CLI TUI slash = keymap `slashName`; `GET /api/command` is Command.Info peers; `tui.json` does **not** feed Command.Info (compose 0020 picker contract; this marker is CLI-TUI listing, not desktop). |
| 7 | `test_bug0021_active_template_parity` | `tui.ts` / `tui.json` / token wiring / no-`auto.md` byte-parity (D10). |
| 8 | `test_bug0021_upgrade_copies_tui_shape_still_prunes_auto_md` | Upgrade `--host opencode\|both` **overwrites** reshaped TUI module onto already-C-limb (`Plugin.define`) trees; still **prunes** leftover `auto.md`; no general sweeper. Reuse `copy_opencode_auto_listing_surface` (already `copy2` overwrite). |

### Consumer upgrade (DQ7)

Already-C-limb trees have `.opencode/tui.json` listing `tui.ts` and a **wrong-shaped** `tui.ts`.

`its-magic --mode upgrade --host opencode|both`:

- **Overwrite** framework-owned `.opencode/plugins/its-magic-auto/tui.ts` (and keep template twin) via existing `copy_opencode_auto_listing_surface` (`shutil.copy2` even when dest exists). This is **not** copy-if-absent.
- `tui.json`: keep BUG-0020 copy-if-absent / JSONC merge of the plugin spec; **do not** wholesale overwrite operator theme/keybinds/attention. Optional comment cite for BUG-0021 (load path ≠ listing proof).
- Still run `prune_retired_opencode_auto_md`. Do **not** restore `auto.md`. Do **not** prune `.cursor/commands/auto.md` or `.opencode/agents/auto.md`.

Named installer-owned-paths already include `template/.opencode/plugins/its-magic-auto/tui.ts` and `.opencode/tui.json`. Extend `check_intake_template_parity.py` with additive `BUG0021_PAIRS` for the reshaped `tui.ts` (keep `BUG0020_PAIRS` / `BUG0019_PAIRS`).

Runbook recipe: (1) upgrade to the BUG-0021 release; (2) `its-magic --mode upgrade --host opencode|both`; (3) restart OpenCode CLI TUI (`opencode`, **not** `--pure`); (4) `/auto` is highlighted/listed and starts `runAutoLifecycle` — or documented `OPENCODE_*` (not LLM Auto mode). If still missing after that on a given binary: residual `#36505` → `OPENCODE_AUTO_CLI_TUI_PLUGIN_LOAD_UNSUPPORTED`; **do not** restore `auto.md`. `--pure` out of scope (host skips external TUI plugins).

## Touch surfaces (execute)

| Surface | Change |
|---------|--------|
| `.opencode/plugins/its-magic-auto/tui.ts` + template | **Reshape** default export `{ id, tui }`; `registerLayer` `name`/`slashName`/`palette`/`ctrl+shift+a`; `run()` → `api.client.rpc` |
| `.opencode/tui.json` + template | **Keep** listing; comment that listing ≠ proof |
| `.opencode/plugins/orchestrator.ts` + template | Keep `editor.add` + RPC; add LOAD token + optional `emitCliTuiPluginLoadUnsupported` |
| `.opencode/plugins/its-magic-auto/index.ts` | **Keep** server `Plugin.define`; no `tui` export |
| `.opencode/commands/auto.md` + template | **Stay absent** |
| OpenCode JSON `commands.auto` | **Do not add** |
| `.opencode/cli.json` | **Do not add** |
| `installer.py` + `installer.sh` + `installer.ps1` | Confirm overwrite of `tui.ts` on upgrade; **keep** targeted `auto.md` prune |
| `docs/engineering/context/installer-owned-paths.manifest` | Named `tui.ts` / `tui.json` rows already present — amend comments only if needed |
| `scripts/check_intake_template_parity.py` | Additive `BUG0021_PAIRS` |
| `tests/bug0021_*` | 8 markers |
| `tests/bug0020_*` | Compose-only comments; markers unchanged |
| `tests/bug0019_*` / `tests/bug0018_*` | Unchanged compose (`auto.md` absent; slashName retained) |
| `docs/engineering/runbook.md` (+ template) | CLI TUI recipe + LOAD token stub + `#36505` residual + `--pure` out |

## Non-goals

- Allocate a companion DEC / rewrite DEC-0124 / DEC-0125 / `# BUG-0020` bodies
- Reopen BUG-0015 / BUG-0016 / BUG-0017 / BUG-0018 / BUG-0019 / BUG-0020 ACs / S0140
- Restore STOP-only / empty `auto.md`
- JSON `commands.auto` template
- Ship kit `cli.json` or plugin-local `its-magic-auto/tui.json`
- Mutate BUG-0022 / US-0139+ / US-0133..US-0148
- Cursor `/auto` changes
- Claim `/auto` under `--pure`
- Live OpenCode CLI TUI probe in default CI
- Touch `.cursor/commands/auto.md` or `.opencode/agents/auto.md`
- Overwrite operator `tui.json` theme/keybinds on upgrade
- Treat `#36505` as a reason to restore markdown `/auto`

## Risks

| Risk | Severity | Mitigation |
|------|----------|------------|
| R1 Operator OpenCode binary predates v2 external TUI plugin activation (`#36505`) | MEDIUM | Axis A still required; residual → `OPENCODE_AUTO_CLI_TUI_PLUGIN_LOAD_UNSUPPORTED` + runbook; do **not** restore `auto.md` |
| R2 Binding `ctrl+shift+a` collides with builtin / operator `keybinds` | LOW | Slash listing does not depend on the chord; tests lock the string; operator can rebind |
| R3 `test_bug0019_*` string contracts break if extras are dropped | LOW | Keep `slash: { name: "auto" }` + `slashName` + `registerLayer` or `keymap.layer`; keep `@opencode/plugin/tui` comment; `dispatchRunAutoLifecycle` retained |
| R4 `api.client.rpc` vs `context.client.rpc` mismatch | LOW | DQ4 locks `api.client` for `{ id, tui }`; keep HTTP RPC fallback; DISPATCH token if both fail |
| R5 Operators treat desktop Command.Info `/auto` as in-scope | LOW | D8 / `# BUG-0020` compose; this bug is CLI TUI only |
| R6 Someone restores `auto.md` / JSON template to fill the slash list | LOW | D4 + marker 4 + keep `test_bug0018_*` |
| R7 Upgrade leaves C-limb `Plugin.define` `tui.ts` in place (copy-if-absent) | MEDIUM | Marker 8 asserts **overwrite**; reuse `copy_opencode_auto_listing_surface` `copy2` |
| R8 Reason-code stub drift vs US-0126 | LOW | Stub + cross-link only |

## AC coverage mapping (bug acceptance + R-0134)

| Expected slice | Architecture anchor | Seeds |
|----------------|---------------------|-------|
| Operator can invoke listed CLI TUI `/auto` | Axis A `{ id, tui }` + `slashName: "auto"` | T-001, T-002, T-005 (m1, m2, m6) |
| Invocation starts `runAutoLifecycle` or documented `OPENCODE_*` | `run()` → RPC; keep `editor.add`; tokens | T-003, T-004, T-005 (m3, m5) |
| Must not restore STOP-only `auto.md` | D4 / Axis E rejected | T-anch, T-005 (m4) |
| Must not JSON-template `/auto` | Axis E rejected | T-005 (m4) |
| Plugin `editor.add` execute retained | Compose 0018 A* | T-003 |
| Consumer upgrade overwrites `tui.ts` + still prunes `auto.md` | DQ7 | T-006, T-005 (m8) |
| Active↔template parity | D10 | T-007, T-005 (m7) |
| Peers remain listed | Do not delete other `.md` commands | T-anch |
| Tests are loader/keymap/rpc contracts, not `tui.json`-path-only | DQ6 eight markers | T-005 |
| `#36505` residual is documented, not a markdown restore | R1 | T-004, T-007 |

Acceptance checkbox: `docs/product/acceptance.md` BUG-0021 row remains unchecked until closure (US-0045). Status stays **OPEN**.

## Atomic task seeds (for `/sprint-plan`)

| # | Seed | Surfaces |
|---|------|----------|
| T-anch | Verify `# BUG-0021` H1 + Axis A + R-0134 DQ1–DQ8 + C-limb listing claim superseded + no companion DEC + do not rewrite `# BUG-0020` | architecture.md, R-0134 (read-only) |
| T-001 | Reshape `its-magic-auto/tui.ts` default export `{ id: "its-magic.auto.tui", tui }` (active+template); not `Plugin.define` as TUI default | `.opencode/plugins/its-magic-auto/tui.ts` + template twin |
| T-002 | `registerLayer` `name: "its-magic.auto"` + `slashName: "auto"` + `namespace: "palette"` + binding `{ key: "ctrl+shift+a", cmd: "its-magic.auto" }`; keep `slash: { name: "auto" }` | `tui.ts` (active + template) |
| T-003 | `run()` → `api.client.rpc(ITS_MAGIC_AUTO_RPC)` → `runAutoLifecycle`; keep `editor.add`; not SessionPrompt / Command.Info template / LLM chat | `tui.ts` + `orchestrator.ts` (keep attach) |
| T-004 | Wire `OPENCODE_AUTO_CLI_TUI_PLUGIN_LOAD_UNSUPPORTED` (reuse LISTING/DISPATCH; do not reuse desktop); runbook residual `#36505` when `tui()` never runs | `orchestrator.ts` vocab + runbook |
| T-005 | Add 8 `test_bug0021_*` markers; no live OpenCode probe in default CI; do not weaken `test_bug0018_*`/`test_bug0019_*`/`test_bug0020_*` except compose-only C-limb comments | `tests/bug0021_*.py` |
| T-006 | Upgrade `--host opencode\|both` **overwrites** reshaped `tui.ts` on C-limb trees; still **prunes** leftover `auto.md`; no general sweeper | installer.py/sh/ps1 |
| T-007 | Runbook CLI TUI `/auto` recipe + `--pure` out of scope + active↔template parity for reshaped `tui.ts` / token / `BUG0021_PAIRS` | runbook + template + `check_intake_template_parity.py` |

**Task count**: 8 seeds (T-anch + T-001..T-007). `SPRINT_MAX_TASKS=12` — no auto-split. Not `/quick` (TUI reshape + tokens + three installers + 8 tests + runbook). 1:1 later for `/sprint-plan`.

## Decision linkage

- Decision: **none** (companion DEC not required — cite **R-0134**)
- Compose (do not amend bodies): **DEC-0124**, **DEC-0125**, **DEC-0120**, **DEC-0132** (preserve paths — `tui.ts` is framework-owned overwrite; `tui.json` merge-safe vs operator theme)
- Research: **R-0134** (composes **R-0131** / **R-0126** / **R-0125** / **R-0124**; do not wipe; **no new R-id**)
- Related: **US-0124**, **US-0125**, **US-0069**, **US-0126** (stub only); **BUG-0020** / **BUG-0019** / **BUG-0018** / **BUG-0015** / **BUG-0017** / **BUG-0016** DONE — out of scope; **BUG-0022** OPEN — not mutated

## Isolation evidence (US-0048 / DEC-0029)

- `phase_id=architecture`, `role=tech-lead`, `bug_id=BUG-0021`, `sprint_id=none`, `orchestrator_run_id=auto-20260913-bug0021`
- `delivery_mode=ultra_lean`, `macro_phase=plan`, `model_id=cursor-grok-4.6-high` (CROSS_MODEL_REVIEW=1)
- `model_resolve_fallback=MODEL_RESOLVE_FALLBACK`, `requested_slug=gpt-5.6-sol-high`
- `fresh_context_marker=tl-BUG0021-architecture-20260913T121000Z-fresh`, `timestamp=2026-09-13T12:10:00Z`
- Narrow-read: phase-context.md; R-0134; `# BUG-0020` (not rewritten); BUG-0021 backlog; kit `tui.ts`/`tui.json`/`orchestrator.ts`; critic NBs `bug0021rsc-*`
- No execute-surface mutation in this phase; no DONE flip; acceptance unchecked; no companion DEC; `# BUG-0020` historical body not rewritten; no `/sprint-plan` spawn; no new R-id; no BUG-0022 mutation

## Strict runtime proof

- `runtime_proof_id=rp-auto-20260913-bug0021-architecture-techlead-20260913T121000Z-BUG-0021`
- Hash via `scripts.token_cost_lib.compute_strict_proof_hash` (positional; compact sorted-key JSON).
- Canonical hashed payload: `{"orchestrator_run_id":"auto-20260913-bug0021","phase_id":"architecture","proof_issued_at":"2026-09-13T12:10:00Z","proof_ttl_seconds":3600,"role":"tech-lead","runtime_proof_id":"rp-auto-20260913-bug0021-architecture-techlead-20260913T121000Z-BUG-0021"}`
- Isolation extras (not hashed): `delivery_mode=ultra_lean`, `macro_phase=plan`, `model_id=cursor-grok-4.6-high`, `model_resolve_fallback=MODEL_RESOLVE_FALLBACK`, `requested_slug=gpt-5.6-sol-high`, `sprint_id=none`, `story_id=BUG-0021`
- `proof_hash=7621D2D4FCE1EEB34FF8E41F8B26F6069E5D348833F8EEBEF8CD5210DE53A60B`
- `proof_ttl=2026-09-13T13:10:00Z`
- Consumed research proof: `rp-auto-20260913-bug0021-research-techlead-20260913T120000Z-BUG-0021` / `C72C0CBA2BCD33EF7926A7EEA08E2CC4D11154009C27F4ED95CAA482D7146440` — RUNTIME_PROOF_VALID MATCH before TTL `2026-09-13T13:00:00Z` (independent Python recompute byte-identical at 2026-09-13T12:10:00Z)
- Consumed critic proof: `rp-auto-20260913-bug0021-sovereign-critic-techlead-20260913T120500Z-BUG-0021` / `A255EEB384939436B4017DECD57DFAAD66F2EA66ED02312A0E2FFC6493045F45` — RUNTIME_PROOF_VALID MATCH before TTL `2026-09-13T13:05:00Z`

# US-0140 — Canonical lifecycle and gate orchestrator

## Overview

**US-0140** adds one owned workflow engine so operators can run intake through refresh with fresh specialist sessions and authoritative validators without Cursor or OpenCode as the only host. New package `@its-magic/runtime-core` never imports Pi. Nested `workflow/` (CommandRouter + WorkflowEngine + typed phase graph + nested GateEngine), `runs/` (`node:sqlite` operational store), `recovery/`, and `stop-matrix/` (consume kit reason codes — do not fork). Host Cursor/OpenCode orchestrators remain **scheduling-only** (BUG-0006 / DEC-0051). `/auto` and `/quick` are **US-0143 OUT** (fail-closed `WORKFLOW_ROUTE_DEFERRED` stub). Role-runtime / PolicyEngine / config / context-engine / KernelBridge stay **unamended**. DEC-0038 `compute_strict_proof_hash` tuple stays **UNAMENDED**. Execute owns package files.

**Research anchor**: **R-0135** (DQ1–DQ10 LOCKED). **Companion DEC**: **DEC-0140** (Accepted — THIS phase). **EARLY_RESEARCH**: consumed from R-0135 (Temporal durable-execution replay trap — analog, not adopted; LangGraph checkpoint analog for phase-boundary resume only; Node `node:sqlite` `DatabaseSync` analog winner vs better-sqlite3 native compile; GitHub required-status-checks analog for ordered fail-closed gates) — **no new R-id**. Do not wipe R-0120..R-0135.

**Fresh context marker**: `tl-US0140-architecture-20260913T205500Z-fresh`
**Orchestrator run id**: `auto-20260913-us0140`
**Timestamp**: 2026-09-13T20:55:00Z (UTC)
**Verdict**: PASS
**Next**: sovereign-critic (architecture), then `/sprint-plan` **S0147** (orchestrator hint S0146 ineligible — BUG-0021 occupies `sprints/S0146/`; orchestrator-owned). ultra_lean: plan-verify is **not** in `resolved_phase_plan`. Do **not** spawn sprint-plan or critic from this subagent (BUG-0006).

**baseline_h2_count (pre-mutate)**: `0`

## Approach locked (A1 — from R-0135)

| Option | Summary | Verdict |
|--------|---------|---------|
| **A1** | `@its-magic/runtime-core` nested workflow/runs/recovery/stop-matrix; nested GateEngine; typed TS graph; CommandRouter 7-step; KernelBridge consume; `/auto`/`/quick` `WORKFLOW_ROUTE_DEFERRED`; `node:sqlite` ops DB; checkpoint + fresh-role crash resume; 12 `test_us0140_*` | **Preferred / LOCKED** — AC-1..AC-8 |
| A2 | Sibling `standalone/packages/workflow` | **Rejected** — DQ1 / §30 |
| A3 | Fold into `role-runtime` | **Rejected** — US-0136 A2 |
| A4 | Temporal durable-execution engine | **Rejected** — LLM replay trap; D7 |
| A5 | LangGraph as the workflow engine | **Rejected** — not spawn-only |
| A6 | Copy Python validators into TypeScript | **Rejected** — R6 / DEC-0134 |
| A7 | SQLite as canonical lifecycle/DONE | **Rejected** — D6 / §27.1 |
| A8 | Implement `/auto`/`/quick` drain this story | **Rejected** — US-0143 / D2 |
| A9 | Merge release + closure | **Rejected** — D5 / §25.4 |
| A10 | Rewrite PolicyEngine / config / KernelBridge / `noTools` / context-engine | **Rejected** — D9 compose |
| A11 | Require better-sqlite3 native addon | **Rejected** for v1 |
| A12 | bun:sqlite or sql.js production SOT | **Rejected** — bun-only / WASM |
| A13 | Resume old Pi session on crash | **Rejected** — D7 / R3 |

**Can this be simpler?** Folding workflow into SessionSupervisor or a sibling `packages/workflow` looks smaller and fails §30 / US-0136 isolation. Temporal looks like a complete orchestrator and fails the LLM replay trap plus spawn-only. A1 is the simplest design that meets AC-1..AC-8.

### Locked surfaces (DEC-0140)

1. **Package**: `@its-magic/runtime-core` (`standalone/packages/runtime-core`). `private: true`, `version: 0.0.0`, `type: module`, `engines.node >=22.19.0`, export `./src/index.ts`. **No Pi dependency.** Type-only / public-API imports from `@its-magic/role-runtime`, `@its-magic/policy-engine`, `@its-magic/config`, `@its-magic/context-engine`, `@its-magic/kernel-bridge` allowed. Those packages **do not** import workflow internals. Extend US-0133..0139 Pi-import grep to this package. No Biome override. Kit `files` omit `standalone/`. **Execute owns package creation.** Nested: `src/workflow/`, `src/workflow/gates/`, `src/runs/`, `src/recovery/`, `src/stop-matrix/` (kit reason-code mirror — consume, do not fork).
2. **CommandRouter 7-step** (AC-1/AC-2): target/config → preconditions → role/model/tool/context → **fresh-session spawn** → KernelBridge validators → evidence → next-state intent. **No 200-line prompt is the engine.** Host Cursor/OpenCode orchestrators **scheduling-only**. Do not restore STOP-only `auto.md`.
3. **Programmatic commands (AC-1)**: `intake`, `discovery`, `research`, `architecture`, `sprint-plan`, `plan-verify`, `execute`, `qa`, `verify-work`, `release`, `closure`, `refresh-context`, `ask`, `memory-audit`, `map-codebase`, `security-review`. **`/auto` and `/quick`**: accept names then fail-closed **`WORKFLOW_ROUTE_DEFERRED`** (US-0143 OUT — do not implement drain/compressed routes; do not omit the names).
4. **Typed phase graph**: named nodes/edges + precondition table. Canonical: intake → discovery → research → architecture → sprint-plan → plan-verify → execute ↔ qa (bounded) → verify-work → release → closure → refresh-context. **`ultra_lean`**: consume US-0138 `DELIVERY_MODE`; skip `plan-verify` via explicit skip edge + skip evidence (do not delete the node). Manifest extract is §14.5 v1.x, not this story.
5. **Next-state intent v1**: `{ schema_version: 1, next_phase, next_role, stop_reason?: completed|decision_gate|missing_input|pause_request|loop_max|error|blocked, skip_reason?, gate_code? }`. Phase→role consume DEC-0051.
6. **KernelBridge consume-not-copy**: `runValidator` only. Do not copy validators. Do not amend `ALLOWED_VALIDATOR_NAMES`. Unknown name → `KERNEL_VALIDATOR_MISSING`. Closure uses existing `validate_closure_verification` + `status-reconcile`. UAT uses existing `uat-planner`.
7. **Bounded execute↔QA** (AC-3): WorkflowEngine owns the loop. Cap source consume-only — **no new RuntimeConfig domain**. `AUTO_IMPLEMENTATION_LOOP` lookup: `resolved.autonomy.flags` then `shared` then `compat` (default `"0"`). Cycle cap: `resolved.retryTest.AUTO_LOOP_MAX_CYCLES`. Exhaust → native **`WORKFLOW_LOOP_CAP`**; compose `FIX_FAILED` (implementation-loop source) and/or `BLOCK_RETRY_CAP_EXHAUSTED` (cycle-cap source); `stop_reason=loop_max`. Critics/security-review spawn supplementary fresh sessions via SessionSupervisor; they **do not** replace the producer. Critic content US-0144 OUT — hook slot only when `resolved.sovereign.CROSS_MODEL_REVIEW="1"`.
8. **Nested GateEngine** (AC-4): `src/workflow/gates/` methods. Ordered fail-closed: (1) check-in tests → (2) independent QA evidence → (3) UAT evidence → (4) documentation/release artifacts → (5) fail-closed reason. Codes: `RELEASE_TESTS_FAILED`, `RELEASE_QA_MISSING`, `RELEASE_UAT_FAILED`, `RELEASE_ARTIFACTS_MISSING`, `RELEASE_PREMATURE`. Publish/deploy targets US-0145 OUT.
9. **Release ≠ closure** (AC-5): Release cannot mark DONE (US-0045). Release-evidence v1: `{ release_run_id, tests_pass, qa_pass, uat_pass, artifact_refs[] }`. Closure requires valid envelope then KernelBridge `validate_closure_verification` + `status-reconcile`. Isolation/proof rows for closure are written by closure. Premature closure → `CLOSURE_RELEASE_EVIDENCE_MISSING`.
10. **SQLite operational only** (AC-6): `node:sqlite` `DatabaseSync` in `src/runs/` via thin `RunsStore`. Path gitignored `.its-magic/runtime/ops.sqlite`; execute adds `**/.its-magic/runtime/`. Tables v1: `runs`, `sessions`, `audit`, `process_handles`, `index_meta`. CI uses `:memory:`. If SQLite claims complete and repo disagrees → `RECOVERY_FALSE_COMPLETION`. Repo artifacts remain canonical. `process_handles` reserved (US-0141 OUT).
11. **Crash resume** (AC-7, compose US-0136): (1) READ resume_brief + state.md + active work (repo canonical) → (2) READ last SQLite run → (3) reject false completion → (4) `SessionSupervisor.discardOrphans()` → (5) reconstruct next phase from typed graph + DEC-0069 pairing → (6) spawn **fresh correct-role** session. Never restore parent transcripts. Stale brief → `RESUME_BRIEF_STALE`. Reject Temporal LLM replay.
12. **Spawn injection**: consume RoleCatalog + SessionSupervisor + policy allowlist/`policy_hash` + config flags + context pack/`context_pack_hash` + KernelBridge. Empty loader + `noTools: "builtin"` held.
13. **OUT**: US-0143 drain/compressed `/auto`/`/quick`; credentials/`.env`; US-0141 OS sandbox; US-0142 browser; US-0144 critic content; US-0145 deploy targets; US-0146 CLI/TUI; rewrite of US-0136..0139 packages; Temporal/LangGraph as engine.
14. **Tests**: 12 `test_us0140_*`; Win+Linux; fake-model CI; in-memory SQLite. Count stays 12.

### Critic NB closures (research us0140res-* — informational)

| NB | Closure |
|----|---------|
| NB1 fail-closed edges named; US-0143 drain OUT; credentials/.env OUT; R-0135 exists | LOCKED §3, §6–§11, §13; T-003, T-005, T-006, T-008, T-009 |
| NB2 `runtime-core` compose US-0136..0139 + KernelBridge consume-only; `/architecture` owns `# US-0140` + DEC-0140; US-0143/0144/0145/0146 OUT | LOCKED this H1 + DEC-0140; T-001, T-004 |
| NB3 no runtime-core code; no DONE; 11 tasks ≤ 12; no `/architecture` spawn from critic | Held — T-anch; Status OPEN; execute owns package; do not spawn `/sprint-plan` from this subagent |

## Components

### `runtime-core` package (AC-1..AC-8)

- Nested CommandRouter + WorkflowEngine + typed graph + GateEngine + RunsStore + recovery + stop-matrix mirror
- Grep denies `@earendil-works/pi-` inside the package

### CommandRouter + phase graph (AC-1, AC-2)

- Seven-step command path; `/auto`/`/quick` stub; ultra_lean skip-plan-verify evidence; next-state intent v1

### SessionSupervisor compose (AC-2, AC-3, AC-7)

- Inject spawn/end/discardOrphans; critics supplement not substitute; crash resume fresh correct-role

### Nested GateEngine + closure (AC-4, AC-5)

- Ordered `RELEASE_*` chain; release-evidence envelope; closure exclusive DONE

### RunsStore (AC-6)

- `node:sqlite` operational metadata only; gitignored path; never DONE authority

### Contract tests (AC-1..AC-8)

- Twelve markers (DEC-0140 §12). Kernel tests: `standalone/tests/contract`. Matrix Windows + Linux.

## Companion DEC = DEC-0140 (Required → Accepted)

Authored Accepted in THIS phase at `decisions/DEC-0140.md`. Locks A1, package nest, CommandRouter, graph, caps, GateEngine, closure, SQLite, crash resume, markers, seeds.

## Risks finalized (R1–R6 from R-0135)

- **R1 (MEDIUM)** `node:sqlite` Stability 1.1 API churn on Node 22 → thin `RunsStore`; tests use `:memory:`; optional better-sqlite3 later
- **R2 (MEDIUM)** Dual-SOT vs kit `/auto` Python if CommandRouter silently diverges → consume KernelBridge validators; `/auto` stubbed until US-0143; stop-matrix nested mirror not a second writer
- **R3 (LOW)** Operators treat SQLite run PASS as story DONE → DQ6/DQ7 tests; `RECOVERY_FALSE_COMPLETION`
- **R4 (MEDIUM)** Crash resume reuses a live Pi session → mandatory `discardOrphans` + fresh spawn test 9
- **R5 (LOW)** GateEngine grows into US-0145 deploy adapters → D4/D9; no `packages/release-runtime` this story
- **R6 (LOW)** `AUTO_IMPLEMENTATION_LOOP` key path bikeshed → this H1 pins flags→shared→compat lookup; consume-only; no new domain

## Compose, do not amend (verified)

| Story / DEC | Surface | Verification |
|-------------|---------|--------------|
| US-0139 / DEC-0139 / R-0132 | `code_context` pack + `context_pack_hash` | ✓ consume-only; ranking unamended |
| US-0138 / DEC-0138 / R-0130 | `DELIVERY_MODE` + `retryTest.AUTO_LOOP_MAX_CYCLES` + autonomy flags | ✓ consume-only; loaders unamended; no new domain |
| US-0137 / DEC-0137 / R-0129 | PolicyEngine / ToolBroker / `policy_hash` | ✓ consume allowlist + hash; tables unamended |
| US-0136 / DEC-0136 / R-0128 | SessionSupervisor `spawn`/`end`/`discardOrphans` / RoleCatalog | ✓ inject; internals unamended |
| US-0135 / DEC-0135 / R-0127 | auth-models / credentials | ✓ OUT; never read `.env` |
| US-0134 / DEC-0134 / R-0122 | KernelBridge `runValidator` | ✓ consume; allowlist unamended |
| US-0133 / DEC-0133 / R-0121 | AgentKernel, isolation loader, `noTools`, fake-model CI | ✓ unamended |
| US-0069 / DEC-0051 / BUG-0006 | phase→role + spawn-only | ✓ host scheduling-only |
| US-0045 | backlog Status authority | ✓ closure exclusive DONE |
| US-0039 | release gate chain | ✓ nested GateEngine consume semantics |
| US-0056 / DEC-0038 | `compute_strict_proof_hash` tuple | ✓ UNAMENDED |
| DEC-0069 | resume_brief + state pairing | ✓ crash resume step 1 + 5 |
| Kit npm `its-magic` / DEC-0120 | `files` whitelist | ✓ omit `standalone/` |
| US-0141..US-0148 | later capabilities | ✓ OUT OF SCOPE (US-0143 `/auto`/`/quick` drain) |
| BUG-0020 / R-0126 | OpenCode `/auto` | ✓ DONE; not reopened |
| BUG-0021 / R-0134 | OpenCode CLI TUI `/auto` | ✓ OPEN; not mutated (`sprints/S0146/` occupied) |
| BUG-0022 / R-0133 | (open bug) | ✓ OPEN; not mutated |
| R-0120..R-0135 | prior research | ✓ not wiped |

## Sprint seeds (11 tasks within SPRINT_MAX_TASKS=12 — for `/sprint-plan` expected S0147)

- **T-anch** (`# US-0140` H1 + DEC-0140 Accepted — RESOLVED in THIS phase; NO-OP / verification)
- **T-001** (AC-1 — `packages/runtime-core` + nested dirs + Pi-import grep)
- **T-002** (AC-2 — typed phase graph + next-state intent + ultra_lean plan-verify skip)
- **T-003** (AC-1/AC-2 — CommandRouter 7-step + `/auto`/`/quick` `WORKFLOW_ROUTE_DEFERRED`)
- **T-004** (AC-2 — SessionSupervisor spawn injection: catalog/policy/config/context/KernelBridge)
- **T-005** (AC-3 — bounded execute↔QA + critic/security hook slot)
- **T-006** (AC-4 — nested GateEngine order + `RELEASE_*` codes)
- **T-007** (AC-5 — closure exclusive DONE + release-evidence envelope)
- **T-008** (AC-6 — `node:sqlite` RunsStore + gitignored `.its-magic/runtime/`)
- **T-009** (AC-7 — crash reconcile + `discardOrphans` + fresh role)
- **T-010** (AC-1..AC-8 — 12 `test_us0140_*` Win/Linux fake-model)

AC surjection: AC-1→T-001,T-003 (T-010 m1); AC-2→T-002,T-003,T-004 (T-010 m2,m3); AC-3→T-005 (T-010 m4,m5); AC-4→T-006 (T-010 m6); AC-5→T-007 (T-010 m7); AC-6→T-008 (T-010 m8); AC-7→T-009 (T-010 m9); AC-8→T-010 m10–m12. Order: T-anch → T-001 → T-002 → T-003 → T-004 → T-005 → T-006 → T-007 → T-008 → T-009 → T-010. No split (11 ≤ 12). Not `/quick`. Orchestrator hint **S0146 ineligible** (BUG-0021). Expected **S0147**. Do **not** write `sprints/S0146/` or `sprints/S0147/` this phase.

## Isolation evidence (US-0048 / DEC-0029)

- `phase_id=architecture`, `role=tech-lead`, `story_id=US-0140`, `sprint_id=none` (pending — sprint-plan owns next unused id), `orchestrator_run_id=auto-20260913-us0140`
- `delivery_mode=ultra_lean`, `macro_phase=plan` (architecture — second canonical phase of `plan` macro)
- `model_id=cursor-grok-4.6-high` (CROSS_MODEL_REVIEW=1 — required on isolation)
- `fresh_context_marker=tl-US0140-architecture-20260913T205500Z-fresh`, `timestamp=2026-09-13T20:55:00Z` (UTC)
- `evidence_ref=docs/engineering/research.md ## R-0135; docs/product/backlog.md ## US-0140; docs/engineering/architecture.md (this # US-0140); decisions/DEC-0140.md; handoffs/resume_brief.md`
- Fresh tech-lead subagent per BUG-0006 / US-0048; no prior chat history. Narrow-read only. No `.env` reads. Status remains OPEN. US-0133/US-0134/US-0135/US-0136/US-0137/US-0138/US-0139 DONE compose-only not reopened. BUG-0020 DONE not reopened. BUG-0021/BUG-0022 OPEN not mutated. No US-0141+ authoring. No `/sprint-plan` spawn from this subagent. No `standalone/packages/runtime-core` this phase.
- Prior phase strict proof consumed: `rp-auto-20260913-us0140-research-techlead-20260913T203500Z-US-0140` / `4DA550E5B9F269C5AA621F5A682121A082B155FABDF4C54786BD5538604CEEE2` — RUNTIME_PROOF_VALID (independent `compute_strict_proof_hash` MATCH; consume-before-TTL `2026-09-13T20:55:00Z` < `2026-09-13T21:35:00Z`; immutable R-0135). Critic findings us0140res-* informational only (`rp-auto-20260913-us0140-sovereign-critic-techlead-20260913T204500Z-US-0140` / `FA4C3DD7DB5AC7F225D0EA4E18BAE85671C5D47AE79FE0C9476FFB21028D726A`; anti_slop=10; 0 blocking; degraded_mode=false; MATCH before TTL `2026-09-13T21:45:00Z`).

## Strict runtime proof (mirror)

- `runtime_proof_id=rp-auto-20260913-us0140-architecture-techlead-20260913T205500Z-US-0140`
- Canonical hashed payload (DEC-0038, `compute_strict_proof_hash` positional): `{"orchestrator_run_id":"auto-20260913-us0140","phase_id":"architecture","proof_issued_at":"2026-09-13T20:55:00Z","proof_ttl_seconds":3600,"role":"tech-lead","runtime_proof_id":"rp-auto-20260913-us0140-architecture-techlead-20260913T205500Z-US-0140"}`
- Isolation extras (not hashed): `delivery_mode=ultra_lean`, `macro_phase=plan`, `model_id=cursor-grok-4.6-high`, `sprint_id=none`, `story_id=US-0140`
- `proof_hash=006C9A41ABF30BCA3A313E8E3B0367CF7E17BA97759F3060BED8B60918DE50CC`
- `proof_ttl=2026-09-13T21:55:00Z`
- `hash_recompute_confirmation=true` (compute_strict_proof_hash → 006C9A41ABF30BCA3A313E8E3B0367CF7E17BA97759F3060BED8B60918DE50CC; **64 hex** verified)
- Consumed research proof: `rp-auto-20260913-us0140-research-techlead-20260913T203500Z-US-0140` / `4DA550E5B9F269C5AA621F5A682121A082B155FABDF4C54786BD5538604CEEE2` — RUNTIME_PROOF_VALID MATCH before TTL `2026-09-13T21:35:00Z`
- Consumed critic proof: `rp-auto-20260913-us0140-sovereign-critic-techlead-20260913T204500Z-US-0140` / `FA4C3DD7DB5AC7F225D0EA4E18BAE85671C5D47AE79FE0C9476FFB21028D726A` — RUNTIME_PROOF_VALID MATCH before TTL `2026-09-13T21:45:00Z`

# BUG-0023 — OpenCode CLI TUI listed `/auto` toasts OPENCODE_AUTO_TUI_DISPATCH_UNSUPPORTED (dispatch live-falsified)

## Overview

**`BUG-0023`** closes the **CLI TUI dispatch residual** left after BUG-0021 Axis A listing: operator OpenCode CLI TUI (`opencode`, not `--pure`) **sees and invokes listed `/auto`**, then toasts title `its-magic /auto` / body **`OPENCODE_AUTO_TUI_DISPATCH_UNSUPPORTED`**. Lifecycle does **not** start (`runAutoLifecycle` not reached). Kit `dispatchRunAutoLifecycle` else-path: no usable `client.rpc(plain JSON).runAutoLifecycle` and invented HTTP `POST /rpc/its-magic.auto/runAutoLifecycle` `{ input }` failed or `client` missing. Orchestrator still `editor.add({ name: "auto", execute })` and optional non-awaited `ctx.rpc.register(plain JSON)` that swallows errors.

Distinct from **BUG-0021 DONE** (listing limb still true — do **not** reopen ACs / S0146), **BUG-0020 DONE** (desktop Command.Info), **BUG-0019 DONE** (tokens defined; live dispatch fail-closed is a **new** falsification), **BUG-0018 DONE** (do **not** restore STOP-only `auto.md`), **BUG-0022 OPEN** (Cursor inherit — do **not** merge / drain).

**This section supersedes `# BUG-0021` / R-0134 DQ4 “listed `/auto` `run()` → `api.client.rpc(plain JSON)` starts lifecycle”.** Listing remains `# BUG-0021`. Dispatch is **this** section. Do **not** rewrite historical `# BUG-0021` / `# BUG-0019` / `# BUG-0018` bodies.

**Research anchor**: **`R-0137`** (DQ1–DQ8 LOCKED; compose **R-0136** / **R-0134** / **R-0124**; do not wipe; do not reuse **R-0135** US-0140 or **R-0138** US-0141). **Companion DEC**: **none** (same class as BUG-0019 / BUG-0020 / BUG-0021). **EARLY_RESEARCH**: confirmatory live-fetch 2026-09-14 `https://opencode.ai/v2/docs/build/plugins/rpc/` + Context7 `/anomalyco/opencode` — **consumed R-0137; no new `R-xxxx`**. **Out of scope**: Cursor `/auto`; `--pure`; BUG-0022; US-0140+ / US-0141 mutate; reopen 0015–0021 ACs; JSON `commands.auto`+`template`; STOP-only `auto.md`; live OpenCode CLI TUI probe in default CI.

**Fresh context marker**: `tl-BUG0023-architecture-20260914T000500Z-fresh`
**Orchestrator run id**: `auto-20260913-bug0023`
**Timestamp**: 2026-09-14T00:05:00Z (UTC)
**Verdict**: PASS (`decision_gate=false`)
**Next**: `/sprint-plan`
**baseline_h2_count (pre-mutate)**: `0`

## Approach locked (Axis A — from R-0137 DQ1–DQ8)

**Approach Axis A** (locked): share one branded `Rpc.define` contract (`its-magic.auto` / `runAutoLifecycle`); TUI `api.client.rpc(Defined)` with `OpenCode.make().rpc(Defined)` fallback; server **`await ctx.rpc.register(Defined, { runAutoLifecycle })`**. Keep `{ id, tui }` listing. Keep `editor.add`. Reject markdown/JSON template.

1. Shared `.opencode/plugins/its-magic-auto/rpc.ts` (and template twin) exports `ITS_MAGIC_AUTO_RPC = Rpc.define({ id: "its-magic.auto", methods: { runAutoLifecycle: { input, output } } })` using **JSON Schema** (docs allow; no Zod).
2. Import specifier **LOCKED**: `@opencode/plugin/rpc` (live v2 RPC 2026-09-14). HTTP client **LOCKED**: `@opencode/client` `OpenCode.make({ baseUrl })`.
3. Orchestrator **static**-imports `rpc.ts` and **`await ctx.rpc.register(ITS_MAGIC_AUTO_RPC, { runAutoLifecycle: runAutoLifecycleRpc })`** when `ctx.rpc.register` exists. Missing `ctx.rpc` remains attach-optional (BUG-0019). Keep `editor.add`.
4. TUI **dynamic**-imports `rpc.ts` **inside** `dispatchRunAutoLifecycle` (not top-level on the `{ id, tui }` module) so unresolved rpc cannot skip listing. Call `client.rpc(Defined).runAutoLifecycle(payload)` with payload `{ sessionID?, prompt?, delivery? }` — **not** `{ input: payload }`.
5. If `typeof api.client.rpc !== "function"`: `OpenCode.make({ baseUrl }).rpc(Defined)` where `baseUrl = client.baseUrl ?? client.config?.baseUrl ?? client.defaults?.baseUrl`. Missing both `.rpc` and `baseUrl` → DISPATCH toast. **Do not** silent-default `http://localhost:4096`.
6. Invented `POST /rpc/its-magic.auto/runAutoLifecycle` `{ input }` is **not** the happy path and **not** the documented fallback — remove from dispatch (leave unreachable/deleted).
7. DISPATCH toast **only** when client/RPC truly cannot dispatch. Do not reuse listing/load/desktop/markdown-collision tokens. Do not treat DISPATCH as success.
8. Eight additive `test_bug0023_*` (mock invoke, not listing-only / not token-exists-only). Keep `test_bug0021_*` / `test_bug0020_*` / `test_bug0019_*` / `test_bug0018_*` compose.
9. Upgrade `--host opencode|both` **overwrites** dispatch-path (`rpc.ts` + `tui.ts` + orchestrator register) on already-Axis-A trees; still **prunes** leftover `auto.md`.

| Option | Summary | Verdict |
|--------|---------|---------|
| **Axis A** | `Rpc.define` + `api.client.rpc(Defined)` / `OpenCode.make().rpc(Defined)` + `await ctx.rpc.register`; keep `{ id, tui }` + `editor.add` | **Preferred** — simplest design that meets D1/D9 |
| Axis B (rejected) | Other TUI→server invoke (`ctx.invoke`, Plugin.define TUI, keymap.dispatch as server) | **Rejected** — no documented custom path besides `client.rpc`; Plugin.define TUI re-breaks listing |
| Axis C sole (rejected) | Keep `editor.add` as a separate stack | **Delivered by A** — TUI `run()` dispatches; execute owner stays `editor.add` |
| Axis D (rejected) | Restore markdown / JSON `commands.auto`+`template` | **Rejected** — BUG-0018 class (D4) |
| Axis E (rejected) | Companion DEC / rewrite `# BUG-0021` | **Rejected** — DQ7 additive H1; historical bodies UNCHANGED |
| Axis F (rejected) | Keep plain JSON + invented POST; treat DISPATCH toast as working fail-closed | **Rejected** — live-falsified; operator wants lifecycle |

### Deferred locks (R-0137 DQ1 → this section)

| Deferred item | Architecture lock |
|---------------|-------------------|
| Import specifier | **`@opencode/plugin/rpc`**. Optional comment string `@opencode-ai/plugin/rpc` for alias-probe only — **do not** dual-import as the happy path. Unresolved specifier → DISPATCH, **not** `auto.md`. |
| TUI vs server import | Server/orchestrator: **static** import. TUI file-plugin: **dynamic** import inside `dispatchRunAutoLifecycle` so `{ id, tui }` listing cannot fail on unresolved rpc. |
| `baseUrl` when `.rpc` missing | `client.baseUrl ?? client.config?.baseUrl ?? client.defaults?.baseUrl`. No silent `localhost:4096`. |
| Schema | Keep **JSON Schema** in `input`/`output` (no Zod). |
| Shared module | `.opencode/plugins/its-magic-auto/rpc.ts` (+ template). Do not duplicate branded define objects. |
| Invented POST | **Not a dispatch path.** Delete or leave unreachable. |
| HTTP client module | `@opencode/client` `OpenCode.make` — dynamic in TUI, same as docs “Call / HTTP”. |

## CF supersede — `# BUG-0021` / R-0134 DQ4 dispatch claim (LOCKED)

| Prior lock | New lock (this section) |
|------------|-------------------------|
| R-0134 DQ4 / `# BUG-0021`: `run()` → `api.client.rpc(plain ITS_MAGIC_AUTO_RPC)` starts lifecycle | **SUPERSEDED as the CLI TUI dispatch fix.** Listing via `{ id, tui }` + `slashName: "auto"` remains `# BUG-0021`. Dispatch requires branded `Rpc.define` + await register + `client.rpc(Defined)` (or `OpenCode.make().rpc`). |
| `# BUG-0021` marker 3 `"api.client.rpc" in src` | **Compose-only.** Keep the string (R3). It is **not** BUG-0023 dispatch proof. |
| BUG-0019 DISPATCH token | **Unchanged compose** as honest fail-closed when client/RPC truly absent. **Not** the happy path. |
| BUG-0018 A*: plugin-only execute; `auto.md` absent | **Unchanged compose.** |

Historical `# BUG-0021` / `# BUG-0019` / `# BUG-0018` bodies remain as shipped evidence. Readers must follow **this** section for **CLI TUI `/auto` dispatch**.

## Design challenge (assumptions / simpler / risks)

- **Alternative to `Rpc.define`?** Keep plain JSON. Live operator DISPATCH toast + v2 docs require branded define. **Rejected.**
- **Alternative HTTP?** Invented per-method POST `{ input }`. Docs show `OpenCode.make().rpc(Defined).method(payload)`. **Rejected as happy path.**
- **Alternative listing reshape?** Switch TUI back to `Plugin.define` so `context.client.rpc` matches the RPC TUI example. Re-breaks BUG-0021 listing (`readV1Plugin` skips it). **Rejected.**
- **Can this be simpler?** Restoring `auto.md` looks smaller and recreates BUG-0018. Dual-export `{ setup, tui }` cannot satisfy `readV1Plugin`. Axis A (same `{ id, tui }` file; branded RPC + await register) is the simplest design that meets D1/D9.
- **Governance fork?** Live docs specify the RPC contract. Implementing it is not a DEC-class fork. **`decision_gate=false`**. No companion DEC.

## Critic NB closures (research sovereign-critic — LOCKED here)

| ID | Carry-forward | Architecture lock |
|----|---------------|-------------------|
| NB1 | Proof fail-closed; H1–H4 kit gap; DISPATCH is defect not success (`bug0023rsc-challenger-001`) | Axis A still required; DISPATCH only when client/RPC truly absent |
| NB2 | Shared `Rpc.define` + await register + `client.rpc`; architecture owns `# BUG-0023` + `test_bug0023_*` mock invoke; no companion DEC (`bug0023rsc-architect-002`) | This section; 8 markers; no companion DEC |
| NB3 | No dispatch-path code yet; no DONE; no `auto.md`; no `/sprint-plan` spawn (`bug0023rsc-subtractor-003`) | Held. Status OPEN. This phase does **not** spawn `/sprint-plan`. |

## Components

### Shared RPC contract (DQ2)

Ship (active **and** template) `.opencode/plugins/its-magic-auto/rpc.ts`:

```ts
import { Rpc } from "@opencode/plugin/rpc";

export const ITS_MAGIC_AUTO_RPC = Rpc.define({
  id: "its-magic.auto",
  methods: {
    runAutoLifecycle: { input: { /* JSON Schema as today */ }, output: { /* as today */ } },
  },
});
```

Keep method schemas byte-compatible with today’s plain JSON (sessionID/prompt/delivery in; ok/reasonCode/sessionID/phase_id/cycles out). File-plugin `id` for TUI module stays **`"its-magic.auto.tui"`** (BUG-0021). RPC id stays **`"its-magic.auto"`**.

### TUI dispatch (DQ1, DQ4)

Keep default export `{ id, tui }` + `registerLayer` `slashName: "auto"` / `ctrl+shift+a` (BUG-0021 compose — **do not reshape listing**).

`dispatchRunAutoLifecycle` order:

1. Dynamic-import `ITS_MAGIC_AUTO_RPC`.
2. `api.client.rpc(Defined).runAutoLifecycle(payload)` if `.rpc` is a function.
3. Else `OpenCode.make({ baseUrl }).rpc(Defined).runAutoLifecycle(payload)` when `baseUrl` resolvable.
4. Else toast `OPENCODE_AUTO_TUI_DISPATCH_UNSUPPORTED`.

Never SessionPrompt. Never Command.Info `template`. Never LLM chat. Never invented POST `{ input }`.

### Plugin execute retained (DQ3, DQ6 / compose BUG-0018 A*)

Keep `.opencode/plugins/orchestrator.ts` `editor.add({ name: "auto", execute })` → `runAutoLifecycle`. Replace optional swallowed register with:

`await ctx.rpc.register(ITS_MAGIC_AUTO_RPC, { runAutoLifecycle: runAutoLifecycleRpc })` when register exists.

Server `its-magic-auto/index.ts` stays thin `Plugin.define` (no `tui` export). Leftover-`auto.md` fail-closed `OPENCODE_AUTO_MARKDOWN_COLLISION` unchanged.

### Fail-closed tokens (compose DQ / D6)

| Code | When |
|------|------|
| `OPENCODE_AUTO_TUI_DISPATCH_UNSUPPORTED` | Listed `/auto` `run()` cannot reach `runAutoLifecycle` because client/RPC truly absent (both `.rpc` and `OpenCode.make` fallback failed). **Defect if this is the happy path.** |
| `OPENCODE_AUTO_SLASH_LISTING_UNSUPPORTED` | Unchanged BUG-0021 — `tui()` ran but keymap API missing |
| `OPENCODE_AUTO_CLI_TUI_PLUGIN_LOAD_UNSUPPORTED` | Unchanged BUG-0021 — listed-but-skipped load |
| `OPENCODE_AUTO_MARKDOWN_COLLISION` | Unchanged BUG-0018. **Not** for dispatch-miss. |
| `OPENCODE_AUTO_DESKTOP_COMMAND_INFO_LISTING_UNSUPPORTED` | Unchanged BUG-0020. **Do not reuse** for CLI TUI dispatch. |

No new token. Do not restore `auto.md` because DISPATCH fired.

### Contract tests (DQ7 — eight markers)

Preferred: `tests/bug0023_opencode_cli_tui_dispatch_rpc_test.py` plus a small node harness/fixture that **invokes** `dispatchRunAutoLifecycle` / `run()` against a fake client. **No live OpenCode CLI TUI probe** in default CI (`UAT_PROBE_FORBIDDEN`). Optional live probe may exist **outside** default CI. Do **not** weaken `test_bug0021_*` except compose-only comments that `"api.client.rpc" in src` is **not** dispatch proof. Keep `test_bug0020_*` / `test_bug0019_*` / `test_bug0018_*`.

| # | Marker | Asserts |
|---|--------|---------|
| 1 | `test_bug0023_rpc_define_shared_contract` | `ITS_MAGIC_AUTO_RPC` is `Rpc.define` (or documented equivalent) with `id: "its-magic.auto"` + `runAutoLifecycle` in **both** TUI dispatch path and orchestrator; **not** plain-JSON-only. |
| 2 | `test_bug0023_dispatch_mock_invokes_runAutoLifecycle` | Host-true **mock**: `dispatchRunAutoLifecycle` / `run()` with a client whose `.rpc(Defined).runAutoLifecycle` **is actually invoked** (not string-in-source only). Payload is the schema object, not `{ input }`. |
| 3 | `test_bug0023_http_fallback_is_client_rpc_not_invented_post` | Primary/fallback documented path is `client.rpc(Defined)` / `OpenCode.make(…).rpc`; invented `POST /rpc/…` + `{ input }` is not the happy path. |
| 4 | `test_bug0023_orchestrator_await_register_defined_rpc` | `await ctx.rpc.register(Defined, { runAutoLifecycle })` when register exists; keep `editor.add`. |
| 5 | `test_bug0023_keep_editor_add_no_auto_md` | Compose C/D: `editor.add` present; no OpenCode `auto.md`; no JSON `commands.auto`+`template`. |
| 6 | `test_bug0023_dispatch_token_only_when_rpc_absent` | DISPATCH toast **only** when client/RPC truly absent; not reused as listing/load/desktop/markdown-collision. |
| 7 | `test_bug0023_active_template_parity` | TUI dispatch-path + RPC define + no-`auto.md` byte-parity (D10). |
| 8 | `test_bug0023_upgrade_copies_dispatch_still_prunes_auto_md` | Upgrade `--host opencode\|both` copies the dispatch-path change onto already-Axis-A trees; still **prunes** leftover `auto.md`. |

Keep `test_bug0021_run_rpc_to_runAutoLifecycle` green (`"api.client.rpc"` string still present).

### Consumer upgrade (DQ8)

Already-Axis-A trees have `{ id, tui }` + `slashName: "auto"` + plain-JSON `dispatchRunAutoLifecycle`.

`its-magic --mode upgrade --host opencode|both`:

- **Overwrite** framework-owned `tui.ts`, new `rpc.ts`, and orchestrator register path via existing copy helpers (`copy2` even when dest exists).
- `tui.json`: keep BUG-0020 copy-if-absent / JSONC merge; **do not** wholesale overwrite operator theme/keybinds.
- Still run `prune_retired_opencode_auto_md`. Do **not** restore `auto.md`. Do **not** prune `.cursor/commands/auto.md` or `.opencode/agents/auto.md`.

Extend `check_intake_template_parity.py` with additive `BUG0023_PAIRS` for `rpc.ts` + dispatch-path `tui.ts` / orchestrator (keep `BUG0021_PAIRS` / `BUG0020_PAIRS` / `BUG0019_PAIRS`). Named installer-owned-paths: add `template/.opencode/plugins/its-magic-auto/rpc.ts`.

Runbook recipe: (1) upgrade to the BUG-0023 release; (2) `its-magic --mode upgrade --host opencode|both`; (3) restart OpenCode CLI TUI (`opencode`, **not** `--pure`); (4) listed `/auto` **starts** `runAutoLifecycle` — or honest DISPATCH only if client/RPC truly absent (not LLM Auto mode). `--pure` out of scope.

## Touch surfaces (execute)

| Surface | Change |
|---------|--------|
| `.opencode/plugins/its-magic-auto/rpc.ts` + template | **New** shared `Rpc.define` contract |
| `.opencode/plugins/its-magic-auto/tui.ts` + template | Dynamic-import Defined; `client.rpc(Defined)` + `OpenCode.make` fallback; remove invented POST happy path; **keep** `{ id, tui }` listing |
| `.opencode/plugins/orchestrator.ts` + template | `await ctx.rpc.register(Defined, { runAutoLifecycle })`; keep `editor.add`; drop plain-JSON register |
| `.opencode/plugins/its-magic-auto/index.ts` | **Keep** server `Plugin.define`; no `tui` export |
| `.opencode/commands/auto.md` + template | **Stay absent** |
| OpenCode JSON `commands.auto` | **Do not add** |
| `installer.py` + `installer.sh` + `installer.ps1` | Overwrite `rpc.ts`/`tui.ts`/orchestrator dispatch path; **keep** targeted `auto.md` prune |
| `docs/engineering/context/installer-owned-paths.manifest` | Add named `rpc.ts` row |
| `scripts/check_intake_template_parity.py` | Additive `BUG0023_PAIRS` |
| `tests/bug0023_*` | 8 markers (mock invoke) |
| `tests/bug0021_*` | Compose-only comments; markers unchanged |
| `tests/bug0020_*` / `tests/bug0019_*` / `tests/bug0018_*` | Unchanged compose |
| `docs/engineering/runbook.md` (+ template) | CLI TUI **dispatch** recipe + DISPATCH-is-defect + `--pure` out |

## Non-goals

- Allocate a companion DEC / rewrite `# BUG-0021` / `# BUG-0019` / `# BUG-0018`
- Reopen BUG-0015 / BUG-0016 / BUG-0017 / BUG-0018 / BUG-0019 / BUG-0020 / BUG-0021 ACs / S0146
- Restore STOP-only / empty `auto.md`
- JSON `commands.auto` template
- Mutate BUG-0022 / US-0140+ / US-0141
- Cursor `/auto` changes
- Claim `/auto` under `--pure`
- Live OpenCode CLI TUI probe in default CI
- Touch `.cursor/commands/auto.md` or `.opencode/agents/auto.md`
- Treat DISPATCH toast as success
- Top-level `import "@opencode/plugin/rpc"` from the TUI default-export module (listing regression risk)

## Risks

| Risk | Severity | Mitigation |
|------|----------|------------|
| R1 `{ id, tui }` `api.client` has no `.rpc` mixin | MEDIUM | DQ1 `OpenCode.make` fallback from connected `baseUrl`; DISPATCH only if both fail |
| R2 `@opencode/plugin/rpc` unresolved in file plugins | MEDIUM | Dynamic import at dispatch time; specifier pinned; DISPATCH if define cannot load — **not** `auto.md` |
| R3 `test_bug0021_*` `"api.client.rpc"` string contract breaks | LOW | Keep `api.client.rpc(Defined)` call site |
| R4 Operators treat DISPATCH toast as working fail-closed | LOW | D1/D9; runbook; mock-invoke tests |
| R5 US-0141 `/research` expected R-0137 | LOW | Heading is BUG-0023; US-0141 continues at **R-0138** |
| R6 Silent `localhost:4096` hits a different server | LOW | No silent default; require resolvable `baseUrl` |
| R7 Top-level rpc import skips `tui()` load | MEDIUM | Dynamic import inside dispatch only |
| R8 Upgrade leaves plain-JSON `tui.ts` (copy-if-absent) | MEDIUM | Marker 8 asserts **overwrite** |

## AC coverage mapping (bug acceptance + R-0137)

| Expected slice | Architecture anchor | Seeds |
|----------------|---------------------|-------|
| Listed CLI TUI `/auto` starts `runAutoLifecycle` | Axis A `client.rpc(Defined)` + await register | T-001, T-002, T-003, T-005 (m1, m2, m4) |
| Fail-closed `OPENCODE_*` only when host truly cannot dispatch | DISPATCH only if `.rpc` and `OpenCode.make` fail | T-004, T-005 (m6) |
| Must not restore STOP-only `auto.md` | D4 / Axis D rejected | T-anch, T-005 (m5) |
| Must not JSON-template `/auto` | Axis D rejected | T-005 (m5) |
| Plugin `editor.add` execute retained | Compose 0018 A* / Axis C | T-002, T-003 |
| Tests mock-invoke, not listing/token-only | DQ7 eight markers | T-005 |
| Consumer upgrade overwrites dispatch path + still prunes `auto.md` | DQ8 | T-006, T-005 (m8) |
| Active↔template parity | D10 | T-007, T-005 (m7) |
| Invented POST not happy path | DQ4 | T-003, T-005 (m3) |

Acceptance checkbox: `docs/product/acceptance.md` BUG-0023 row remains unchecked until closure (US-0045). Status stays **OPEN**.

## Atomic task seeds (for `/sprint-plan`)

| # | Seed | Surfaces |
|---|------|----------|
| T-anch | Verify `# BUG-0023` H1 + Axis A + R-0137 DQ1–DQ8 + `# BUG-0021` dispatch claim superseded + no companion DEC + do not rewrite `# BUG-0021` / `# BUG-0019` | architecture.md, R-0137 (read-only) |
| T-001 | Shared `Rpc.define` contract `rpc.ts` (active+template) `id: "its-magic.auto"` + `runAutoLifecycle`; JSON Schema; specifier `@opencode/plugin/rpc` | `.opencode/plugins/its-magic-auto/rpc.ts` + template twin |
| T-002 | `await ctx.rpc.register(Defined, { runAutoLifecycle })` when register exists; keep `editor.add`; drop plain-JSON / non-awaited swallow | `orchestrator.ts` (active + template) |
| T-003 | `dispatchRunAutoLifecycle` → dynamic-import Defined → `client.rpc(Defined).runAutoLifecycle(payload)` + `OpenCode.make` fallback; remove invented POST happy path; keep `{ id, tui }` listing | `tui.ts` (active + template) |
| T-004 | DISPATCH honest only when client/RPC truly absent; do not reuse listing/load/desktop/markdown tokens | `tui.ts` + runbook |
| T-005 | Add 8 `test_bug0023_*` markers (mock invoke, not string-in-source only); no live OpenCode probe in default CI; do not weaken 0021/0020/0019/0018 except compose-only | `tests/bug0023_*.py` |
| T-006 | Upgrade `--host opencode\|both` **overwrites** dispatch path (`rpc.ts`/`tui.ts`/orchestrator) on Axis-A trees; still **prunes** leftover `auto.md` | installer.py/sh/ps1 + owned-paths |
| T-007 | Runbook CLI TUI dispatch recipe + `--pure` out + active↔template parity + `BUG0023_PAIRS` | runbook + template + `check_intake_template_parity.py` |

**Task count**: 8 seeds (T-anch + T-001..T-007). `SPRINT_MAX_TASKS=12` — no auto-split. Not `/quick` (RPC contract + await register + dispatch rewrite + three installers + 8 tests + runbook). 1:1 later for `/sprint-plan`. Eight `test_bug0023_*` named above.

## Decision linkage

- Decision: **none** (companion DEC not required — cite **R-0137**)
- Compose (do not amend bodies): **DEC-0124**, **DEC-0125**, **DEC-0120**, **DEC-0132** (preserve paths — `tui.ts`/`rpc.ts` framework-owned overwrite; `tui.json` merge-safe vs operator theme)
- Research: **R-0137** (composes **R-0136** / **R-0134** / **R-0124**; do not wipe; **no new R-id**). US-0141 continues **R-0138**.
- Related: **US-0124**, **US-0125**, **US-0069**, **US-0126** (stub only); **BUG-0021** / **BUG-0020** / **BUG-0019** / **BUG-0018** / **BUG-0015** DONE — out of scope; **BUG-0022 OPEN** — not mutated; **US-0140+** — not mutated

## Isolation evidence (US-0048 / DEC-0029)

- `phase_id=architecture`, `role=tech-lead`, `bug_id=BUG-0023`, `sprint_id=none`, `orchestrator_run_id=auto-20260913-bug0023`
- `delivery_mode=ultra_lean`, `macro_phase=plan`, `model_id=cursor-grok-4.6-high` (CROSS_MODEL_REVIEW=1)
- `model_resolve_fallback=MODEL_RESOLVE_FALLBACK`, `requested_slug=gpt-5.6-sol-high`
- `fresh_context_marker=tl-BUG0023-architecture-20260914T000500Z-fresh`, `timestamp=2026-09-14T00:05:00Z`
- Narrow-read: phase-context.md; R-0137; `# BUG-0021` (not rewritten); BUG-0023 backlog; kit `tui.ts`/`orchestrator.ts`; live v2 RPC; critic NBs `bug0023rsc-*`
- No execute-surface mutation in this phase; no DONE flip; acceptance unchecked; no companion DEC; `# BUG-0021` / `# BUG-0019` historical bodies not rewritten; no `/sprint-plan` spawn; no new R-id; no BUG-0022 / US-0140+ mutation

## Strict runtime proof

- `runtime_proof_id=rp-auto-20260913-bug0023-architecture-techlead-20260914T000500Z-BUG-0023`
- Hash via `scripts.token_cost_lib.compute_strict_proof_hash` (positional; compact sorted-key JSON).
- Canonical hashed payload: `{"orchestrator_run_id":"auto-20260913-bug0023","phase_id":"architecture","proof_issued_at":"2026-09-14T00:05:00Z","proof_ttl_seconds":3600,"role":"tech-lead","runtime_proof_id":"rp-auto-20260913-bug0023-architecture-techlead-20260914T000500Z-BUG-0023"}`
- Isolation extras (not hashed): `delivery_mode=ultra_lean`, `macro_phase=plan`, `model_id=cursor-grok-4.6-high`, `model_resolve_fallback=MODEL_RESOLVE_FALLBACK`, `requested_slug=gpt-5.6-sol-high`, `sprint_id=none`, `story_id=BUG-0023`
- `proof_hash=A565DE258312BA535F8CF4E9B00E8A17913E8F44960AC83097EC3C093997EF95`
- `proof_ttl=2026-09-14T01:05:00Z`
- `hash_recompute_confirmation=true` (compute_strict_proof_hash → A565DE258312BA535F8CF4E9B00E8A17913E8F44960AC83097EC3C093997EF95; **64 hex** verified)
- Consumed research proof: `rp-auto-20260913-bug0023-research-techlead-20260913T235500Z-BUG-0023` / `A058F36ECE6A6FD173B1004D50597D3A075A0BD0312D720EB9CBE63F3B20AD7B` — RUNTIME_PROOF_VALID MATCH before TTL `2026-09-14T00:55:00Z` (independent Python recompute byte-identical at 2026-09-14T00:05:00Z)
- Consumed critic proof: `rp-auto-20260913-bug0023-sovereign-critic-techlead-20260914T000000Z-BUG-0023` / `37ADCFFEA3E4DB3347279BDE421DF6F60C7B16E96191C5BB6C94E547D7539EB9` — RUNTIME_PROOF_VALID MATCH before TTL `2026-09-14T01:00:00Z`; anti_slop=10; 0 blocking; degraded_mode=false

# US-0141 — Application runtime and pluggable execution backends

## Overview

**US-0141** adds one owned application runtime so operators can discover, start, observe, repair, and clean up real applications across local and Docker (core v1) plus typed WSL/SSH/remote-Docker adapters. New package `@its-magic/app-runtime` never imports Pi. Compose US-0140 `RunsStore.process_handles` **additively** (ProcessManager writes; workflow `reserveProcessHandle` remains a claim token). Do **not** nest AppRuntime inside CommandRouter/GateEngine. AppRuntime **owns** restart; Docker HEALTHCHECK is **status-only**. Browser UAT is **US-0142 OUT**. `/auto`/`/quick` drain is **US-0143 OUT**. OS micro-VM is future (`BACKEND_UNSUPPORTED`). Role-runtime / PolicyEngine / config / KernelBridge / isolation loader stay **unamended**. DEC-0038 `compute_strict_proof_hash` tuple stays **UNAMENDED**. Execute owns package files.

**Research anchor**: **R-0138** (DQ1–DQ10 LOCKED). **Companion DEC**: **DEC-0141** (Accepted — THIS phase). **EARLY_RESEARCH**: consumed from R-0138 (HEALTHCHECK status-only analog; dockerode later-swap only; WSL/`ssh`/`DOCKER_HOST`; Chump backend trait analog — reject unknown→local; `child_process.spawn` AbortSignal) — **no new R-id**. Do not wipe R-0120..R-0138. **R-0137 remains BUG-0023.**

**Fresh context marker**: `tl-US0141-architecture-20260914T003000Z-fresh`
**Orchestrator run id**: `auto-20260913-us0141`
**Timestamp**: 2026-09-14T00:30:00Z (UTC)
**Verdict**: PASS
**Next**: sovereign-critic (architecture), then `/sprint-plan` **S0149** (orchestrator hint S0148 ineligible — BUG-0023 occupies `sprints/S0148/`; S0146=BUG-0021; S0147=US-0140; orchestrator-owned). ultra_lean: plan-verify is **not** in `resolved_phase_plan`. Do **not** spawn sprint-plan or critic from this subagent (BUG-0006).

**baseline_h2_count (pre-mutate)**: `0`

## Approach locked (A1 — from R-0138)

| Option | Summary | Verdict |
|--------|---------|---------|
| **A1** | Sibling `@its-magic/app-runtime` (no Pi) composing `runtime-core` RunsStore; AppRuntime + ProcessManager + CLI-first Docker + WSL/SSH adapters; AppRuntime-owned restart; 12 `test_us0141_*` | **Preferred / LOCKED** — AC-1..AC-8 |
| A2 | Nested `runtime-core/src/runtime/` | **Rejected** — DQ1 / §30 sibling |
| A3 | Two packages `execution-runtime` + `dev-environment` | **Rejected** — YAGNI v1 |
| A4 | dockerode **is** AppRuntime | **Rejected** — adapter, not facade |
| A5 | Kit Python only as the runtime | **Rejected** — standalone TS owns execution |
| A6 | PM2 / forever / systemd as ProcessManager | **Rejected** — extra dep |
| A7 | Docker HEALTHCHECK / `--restart` as remediation owner | **Rejected** — status-only / exit-only |
| A8 | Implement browser UAT here | **Rejected** — US-0142 |
| A9 | Micro-VM / Firecracker v1 | **Rejected** — D9 future |
| A10 | Rewrite workflow / GateEngine / PolicyEngine / config / KernelBridge / `noTools` | **Rejected** — D2/D9 compose |
| A11 | Require live Docker/WSL/SSH in CI | **Rejected** — fake backends |
| A12 | Fold into `tool-broker` | **Rejected** — Layer A ≠ Layer B |
| A13 | Unknown backend → silent local | **Rejected** — AC-8 fail-closed |
| A14 | Second SQLite or better-sqlite3 for processes | **Rejected** — compose DEC-0140 `node:sqlite` |

**Can this be simpler?** Nested runtime-core looks smaller and couples process lifecycle to the workflow engine. Two §30 packages double npm/test surface. dockerode adds a socket client we can avoid by spawning `docker`. A1 is the simplest design that meets AC-1..AC-8.

### Locked surfaces (DEC-0141)

1. **Package**: `@its-magic/app-runtime` (`standalone/packages/app-runtime`). npm name **LOCKED** `app-runtime` (not `execution-runtime`). `private: true`, `version: 0.0.0`, `type: module`, `engines.node >=22.19.0`, export `./src/index.ts`. **No Pi dependency.** Type-only / public-API imports from `@its-magic/runtime-core`, `@its-magic/role-runtime`, `@its-magic/policy-engine`, `@its-magic/config` allowed. Those packages **do not** import app-runtime internals. Extend US-0133..0140 Pi-import grep to this package. No Biome override. Kit `files` omit `standalone/`. Do not add standalone to kit workspaces. **Execute owns package creation.**
2. **Compose, do not reimplement**: depend on `RunsStore` public API. Do **not** put AppRuntime inside `runtime-core/workflow/` or GateEngine. Do **not** rewrite CommandRouter, WorkflowEngine, GateEngine, or crash-resume DONE authority.
3. **`process_handles` additive** (AC-2): keep `id`, `run_id`, `reserved`. Add **LOCKED** columns: `phase_id`, `backend`, `identity_kind` (`process`\|`container`\|`service`), `identity`, `command`, `cwd`, `ports_json`, `url`, `readiness`, `started_at`, `crash_count`, `restart_count`, `log_ring_ref`. ProcessManager writes via `upsertProcessHandle` / `listProcessHandlesForRun`. Log files under `.its-magic/runtime/logs/` + in-memory ring **256** lines; SQLite stores refs.
4. **ExecutionBackend** (AC-3): `name()` / `execute()` / `health_check()`. Core v1: `local` + `docker` (`docker-local`) via `child_process.spawn` + CLI-first `docker`/`docker compose`. Thin `DockerClient` (dockerode later-swap, not required). Typed adapters: `wsl` (`wsl.exe -d <distro> [--cd <linuxCwd>] -- <cmd>` + `wslpath`) and `ssh`/`remote-docker` (`ssh -o BatchMode=yes -o ConnectTimeout=5` and/or `docker --context` / `DOCKER_HOST=ssh://`; key auth; password SSH unsupported). Micro-VM stub → `BACKEND_UNSUPPORTED`. `health_check` before execute. Missing binary/daemon/distro/SSH → fail-closed, not local fallback.
5. **Reason codes LOCKED**: `APP_RUNTIME_PROFILE_UNKNOWN`, `APP_RUNTIME_START_FAILED`, `APP_RUNTIME_HEALTH_FAILED`, `APP_RUNTIME_RESTART_CAP_EXHAUSTED`, `APP_RUNTIME_UNSUPPORTED_STACK`, `APP_RUNTIME_CLEANUP_FAILED`; `BACKEND_UNKNOWN`, `BACKEND_UNAVAILABLE`, `BACKEND_DOCKER_UNAVAILABLE`, `BACKEND_WSL_UNAVAILABLE`, `BACKEND_SSH_UNAVAILABLE`, `BACKEND_UNSUPPORTED`, `BACKEND_CONNECTIVITY_FAILED`, `BACKEND_TIMEOUT`; `PROCESS_CRASHED`, `PROCESS_ORPHAN_REAPED`. Do not overload `REMOTE_*` / `RELEASE_*` / `WORKFLOW_*` / `DEV_ENV_*` as the primary family.
6. **Stack profiles** (AC-4): port `detect_stack_profile` into TS (do not spawn Python). Order: `package.json`→`node`; `pyproject.toml`/`setup.py`→`python`; `go.mod`→`go`; `*.csproj`→`dotnet`; `pom.xml`→`java`. Unknown → `APP_RUNTIME_UNSUPPORTED_STACK` unless `DEV_SERVER_COMMAND` / `start_command` override.
7. **Bounded self-debug** (AC-5): capture → classify (`start_failed`\|`health_failed`\|`crash`\|`timeout`\|`connectivity`\|`unsupported_stack`\|`unsupported_backend`) → optional fresh DEV (`SessionSupervisor.spawn`) → rebuild/restart → cap. Cap **`APP_RUNTIME_RESTART_MAX` default 3** from resolved config/scratchpad if present. **No new RuntimeConfig domain.** Orthogonal to `AUTO_IMPLEMENTATION_LOOP`. HEALTHCHECK is status-only; AppRuntime owns restart.
8. **Evidence** (AC-6): `{ command, backend, exit_code, duration_ms, stdout_ref, stderr_ref, reason_code? }`. Summarize large logs (head/tail + error lines, **8 KiB** model budget).
9. **Connect + cleanup** (AC-7): expose `url`/`ports`/`health`/`health_path` using US-0098 names (`connect_endpoint`, `health_path`, `service_id`, `container_id`, `env_refs` names-only). US-0142 consumes; **no Playwright/CDP**. Never read `.env`. Redact Authorization/Cookie. `ProcessManager.stop` after success/failure/cancellation/runtime restart. AppRuntime reaps process/container orphans (`PROCESS_ORPHAN_REAPED`); workflow `discardOrphans` remains sessions-only. Health: TCP listen and/or HTTP GET `health_path`; process-alive is insufficient.
10. **Layer B profiles**: `trusted_local`→`local`, `isolated_dev`→`docker`. `untrusted_repo` sandbox → `BACKEND_UNSUPPORTED`. Optional ToolBroker `itsm_app_*` unstub is a **seed**.
11. **OUT**: US-0142 browser; US-0143 drain; micro-VM; restore `.opencode/commands/auto.md`; kit `cli.json`; plugin-local `its-magic-auto/tui.json`; npm-publish; git push; rewrite of US-0136..0140 packages.
12. **Tests**: 12 `test_us0141_*`; Win+Linux; fake-model CI; in-memory SQLite; fake backends. Count stays 12.

### Critic NB closures (research us0141res-* — informational)

| NB | Closure |
|----|---------|
| NB1 proof MATCH; R-0138 not R-0137; Status OPEN; R-0137 BUG-0023 not wiped (`us0141res-challenger-001`) | LOCKED this H1 + DEC-0141; Status OPEN; ACs unchecked |
| NB2 `/architecture` owns `# US-0141` + DEC-0141 Accepted; A1 compose `process_handles`; US-0142 browser OUT; US-0143 drain OUT (`us0141res-architect-002`) | LOCKED this H1 + DEC-0141; T-001..T-008 |
| NB3 no app-runtime code; no DONE; 11 tasks ≤ 12; no `/architecture` spawn from critic (`us0141res-subtractor-003`) | Held — T-anch; Status OPEN; execute owns package; do not spawn `/sprint-plan` from this subagent |

## Components

### `app-runtime` package (AC-1..AC-8)

- Facade `AppRuntime` + `ProcessManager` + `ExecutionBackend` adapters + stack profiles + bounded self-debug
- Grep denies `@earendil-works/pi-` inside the package

### ProcessManager + RunsStore compose (AC-2)

- Additive `process_handles`; claim token vs filled row; log ring refs

### ExecutionBackend (AC-3)

- local + docker CLI-first core; WSL + SSH/remote-Docker typed adapters; fail-closed `BACKEND_*`

### Stack profiles (AC-4)

- Node/Python/Go/Java/.NET; unknown fail/fallback

### Bounded remediation (AC-5)

- AppRuntime-owned restart; `APP_RUNTIME_RESTART_MAX` default 3; HEALTHCHECK status-only

### Evidence + Connect (AC-6, AC-7)

- Structured test/build JSON + 8 KiB summarize; Connect handoff names; no browser; orphan reap

### Contract tests (AC-1..AC-8)

- Twelve markers (DEC-0141 §12). Kernel tests: `standalone/tests/contract`. Matrix Windows + Linux.

## Companion DEC = DEC-0141 (Required → Accepted)

Authored Accepted in THIS phase at `decisions/DEC-0141.md`. Locks A1, package, schema, backends, reason codes, cap, markers, seeds.

## Risks finalized (R1–R6 from R-0138)

- **R1 (MEDIUM)** Live Docker/WSL/SSH absent on CI hosts → DQ8 fake backends; unavailable codes asserted, not skipped
- **R2 (MEDIUM)** Operators treat US-0098 JSON or HEALTHCHECK as the owner → D3/DQ5; runtime owns execution; tests 3/6
- **R3 (LOW)** Log files leak secrets → names-only env; redact compose US-0135/0137; never read `.env`
- **R4 (MEDIUM)** Orphan processes after runtime crash → DQ7 reap + test 9; compose `discardOrphans` for sessions only
- **R5 (LOW)** npm name bikeshed `app-runtime` vs `execution-runtime` → this H1 pins `app-runtime`
- **R6 (LOW)** ToolBroker `itsm_app_*` scope creep → optional seed; PolicyEngine tables unamended

## Compose, do not amend (verified)

| Story / DEC | Surface | Verification |
|-------------|---------|--------------|
| US-0140 / DEC-0140 / R-0135 | `RunsStore.process_handles` + workflow/GateEngine | ✓ additive schema; workflow not rewritten |
| US-0138 / DEC-0138 / R-0130 | resolved config/scratchpad | ✓ consume `APP_RUNTIME_RESTART_MAX`; no new domain |
| US-0137 / DEC-0137 / R-0129 | PolicyEngine Layer A | ✓ consume path/shell; Layer B profiles only |
| US-0136 / DEC-0136 / R-0128 | SessionSupervisor `spawn` | ✓ fresh DEV slot; internals unamended |
| US-0135 / DEC-0135 / R-0127 | `redact.ts` / credentials | ✓ never read `.env`; redact logs |
| US-0098 / R-0085 | Connect field names | ✓ input; AppRuntime owns execution |
| US-0086 / R-0068 / DEC-0070 | `remote.json` / `REMOTE_*` | ✓ input routing, not AppRuntime codes |
| US-0065 | `detect_stack_profile` | ✓ port semantics; Python lib unamended |
| US-0085 | `.env` deny | ✓ never read |
| US-0056 / DEC-0038 | `compute_strict_proof_hash` tuple | ✓ UNAMENDED |
| Kit npm `its-magic` / DEC-0120 | `files` whitelist | ✓ omit `standalone/` |
| US-0142..US-0148 | later capabilities | ✓ OUT OF SCOPE (US-0142 browser; US-0143 drain) |
| BUG-0021 / R-0134 | OpenCode CLI TUI `/auto` listing | ✓ DONE; not mutated (`sprints/S0146/`) |
| BUG-0022 / R-0133 | (open bug) | ✓ OPEN; not mutated |
| BUG-0023 / R-0137 | OpenCode CLI TUI dispatch | ✓ OPEN; not mutated (`sprints/S0148/` occupied) |
| R-0120..R-0138 | prior research | ✓ not wiped (R-0136/R-0137 intact) |

## Sprint seeds (11 tasks within SPRINT_MAX_TASKS=12 — for `/sprint-plan` expected S0149)

- **T-anch** (`# US-0141` H1 + DEC-0141 Accepted — RESOLVED in THIS phase; NO-OP / verification)
- **T-001** (AC-1 — `packages/app-runtime` + Pi-import grep + runtime-core compose)
- **T-002** (AC-2 — `process_handles` additive schema + ProcessManager)
- **T-003** (AC-3 — `ExecutionBackend` local+docker CLI-first + `health_check`)
- **T-004** (AC-3 — WSL + SSH/remote-docker adapters + connectivity diagnostics)
- **T-005** (AC-4 — stack profiles Node/Python/Go/Java/.NET + unknown fail/fallback)
- **T-006** (AC-5 — bounded self-debug + `APP_RUNTIME_RESTART_MAX` + fresh DEV slot)
- **T-007** (AC-6 — test/build evidence + log summarize)
- **T-008** (AC-7 — Connect handoff no browser + cleanup/orphan reap)
- **T-009** (AC-8 — chaos fixtures fake backends)
- **T-010** (AC-1..AC-8 — 12 `test_us0141_*` Win/Linux fake-model)

AC surjection: AC-1→T-001 (T-010 m1); AC-2→T-002 (T-010 m2); AC-3→T-003,T-004 (T-010 m3,m4); AC-4→T-005 (T-010 m5); AC-5→T-006 (T-010 m6); AC-6→T-007 (T-010 m7); AC-7→T-008 (T-010 m8,m9); AC-8→T-009,T-010 m10–m12. Order: T-anch → T-001 → T-002 → T-003 → T-004 → T-005 → T-006 → T-007 → T-008 → T-009 → T-010. No split (11 ≤ 12). Not `/quick`. Orchestrator hint **S0148 ineligible** (BUG-0023). S0146=BUG-0021, S0147=US-0140. Expected **S0149**. Do **not** write `sprints/S0148/` or `sprints/S0149/` this phase.

## Isolation evidence (US-0048 / DEC-0029)

- `phase_id=architecture`, `role=tech-lead`, `story_id=US-0141`, `sprint_id=none` (pending — sprint-plan owns next unused id), `orchestrator_run_id=auto-20260913-us0141`
- `delivery_mode=ultra_lean`, `macro_phase=plan` (architecture — second canonical phase of `plan` macro)
- `model_id=cursor-grok-4.6-high` (CROSS_MODEL_REVIEW=1 — required on isolation)
- `fresh_context_marker=tl-US0141-architecture-20260914T003000Z-fresh`, `timestamp=2026-09-14T00:30:00Z` (UTC)
- `evidence_ref=docs/engineering/research.md ## R-0138; docs/product/backlog.md ## US-0141; docs/engineering/architecture.md (this # US-0141); decisions/DEC-0141.md; handoffs/resume_brief.md`
- Fresh tech-lead subagent per BUG-0006 / US-0048; no prior chat history. Narrow-read only. No `.env` reads. Status remains OPEN. US-0133..US-0140 DONE compose-only not reopened. BUG-0021 DONE not mutated. BUG-0022/BUG-0023 OPEN not mutated. No US-0142+ authoring. No `/sprint-plan` spawn from this subagent. No `standalone/packages/app-runtime` this phase.
- Prior phase strict proof consumed: `rp-auto-20260913-us0141-research-techlead-20260914T001000Z-US-0141` / `A69F1FF95B60E566C03355AD24DDB7144B005BD78CD3701C1C8D2EBF2DAFAC45` — RUNTIME_PROOF_VALID (independent `compute_strict_proof_hash` MATCH; consume-before-TTL `2026-09-14T00:30:00Z` < `2026-09-14T01:10:00Z`; immutable R-0138). Critic findings us0141res-* informational only (`rp-auto-20260913-us0141-sovereign-critic-techlead-20260914T002000Z-US-0141` / `727DABC442D42CD32D3B216AF014C3797BE09F552688BECA429C2A215E6EF53E`; anti_slop=10; 0 blocking; degraded_mode=false; MATCH before TTL `2026-09-14T01:20:00Z`).
- Sovereign memory: `SOVEREIGN_MEMORY=1`; `build_injection_digest_block` returned `(no sovereign memory entries)` (read-only). No `mistakes.jsonl` write.

## Strict runtime proof (mirror)

- `runtime_proof_id=rp-auto-20260913-us0141-architecture-techlead-20260914T003000Z-US-0141`
- Canonical hashed payload (DEC-0038, `compute_strict_proof_hash` positional): `{"orchestrator_run_id":"auto-20260913-us0141","phase_id":"architecture","proof_issued_at":"2026-09-14T00:30:00Z","proof_ttl_seconds":3600,"role":"tech-lead","runtime_proof_id":"rp-auto-20260913-us0141-architecture-techlead-20260914T003000Z-US-0141"}`
- Isolation extras (not hashed): `delivery_mode=ultra_lean`, `macro_phase=plan`, `model_id=cursor-grok-4.6-high`, `sprint_id=none`, `story_id=US-0141`
- `proof_hash=4B5EBD9D8FF00C4C7CC5CF114B946AFBA684E11998C4C553C59AE5080326A3BF`
- `proof_ttl=2026-09-14T01:30:00Z`
- `hash_recompute_confirmation=true` (compute_strict_proof_hash → 4B5EBD9D8FF00C4C7CC5CF114B946AFBA684E11998C4C553C59AE5080326A3BF; **64 hex** verified)
- Consumed research proof: `rp-auto-20260913-us0141-research-techlead-20260914T001000Z-US-0141` / `A69F1FF95B60E566C03355AD24DDB7144B005BD78CD3701C1C8D2EBF2DAFAC45` — RUNTIME_PROOF_VALID MATCH before TTL `2026-09-14T01:10:00Z`
- Consumed critic proof: `rp-auto-20260913-us0141-sovereign-critic-techlead-20260914T002000Z-US-0141` / `727DABC442D42CD32D3B216AF014C3797BE09F552688BECA429C2A215E6EF53E` — RUNTIME_PROOF_VALID MATCH before TTL `2026-09-14T01:20:00Z`

# US-0142 — Owned browser UAT and evidence runtime

## Overview

**US-0142** adds one owned browser UAT and evidence runtime so QA can execute UI acceptance in isolated Playwright contexts and operator-authorized CDP sessions connected to US-0141 AppRuntime. New package `@its-magic/browser-uat` never imports Pi. Compose US-0141 `ConnectHandoff` / `connectHandoff` **only** (navigate `connect_endpoint`/`url`; probe `health_path`; record `app_runtime_ref`). Do **not** reimplement AppRuntime / ProcessManager / ExecutionBackend. Do **not** nest BrowserUAT inside CommandRouter/GateEngine. Playwright **owns** isolated launch; CDP **disconnects** (does not kill) the operator browser. Default Chrome User Data is **forbidden**. Pixel visual baseline is **OUT**. `/auto`/`/quick` drain is **US-0143 OUT**. Role-runtime / PolicyEngine path-shell tables / config / KernelBridge / isolation loader stay **unamended** except promoting `itsm_browser` from `STUB_TOOLS`. DEC-0038 `compute_strict_proof_hash` tuple stays **UNAMENDED**. Execute owns package files.

**Research anchor**: **R-0139** (DQ1–DQ10 LOCKED). **Companion DEC**: **DEC-0142** (Accepted — THIS phase). **EARLY_RESEARCH**: consumed from R-0139 (Playwright isolation vs CDP attach; Chrome 136+ default-profile CDP block; trace/HAR secret leakage; playwright vs playwright-core; fake driver analog) — **no new R-id**. Do not wipe R-0120..R-0139. **R-0138 remains US-0141. R-0136/R-0137 remain BUG-0023.**

**Fresh context marker**: `tl-US0142-architecture-20260914T035000Z-fresh`
**Orchestrator run id**: `auto-20260913-us0142`
**Timestamp**: 2026-09-14T03:50:00Z (UTC)
**Verdict**: PASS
**Next**: sovereign-critic (architecture), then `/sprint-plan` **S0150** (S0149=US-0141; S0148=BUG-0023; S0147=US-0140; S0146=BUG-0021; live-inventory S0150 unused; orchestrator-owned). ultra_lean: plan-verify is **not** in `resolved_phase_plan`. Do **not** spawn sprint-plan or critic from this subagent (BUG-0006).

**baseline_h2_count (pre-mutate)**: `0`

## Approach locked (A1 — from R-0139)

| Option | Summary | Verdict |
|--------|---------|---------|
| **A1** | Sibling `@its-magic/browser-uat` (no Pi) composing US-0141 `ConnectHandoff`; Playwright isolated core + typed CDP adapter; fail-closed `BROWSER_*` / `UAT_*`; 12 `test_us0142_*` | **Preferred / LOCKED** — AC-1..AC-8 |
| A2 | Nested under `app-runtime` | **Rejected** — DQ1 / §30 sibling |
| A3 | Fold into `tool-broker` | **Rejected** — Layer A ≠ Layer B |
| A4 | Cursor MCP remains v1 authority | **Rejected** — D3 REPLACE backend |
| A5 | Puppeteer as driver | **Rejected** — extra stack |
| A6 | Selenium / WebDriver | **Rejected** — heavier |
| A7 | `launchPersistentContext` on default Chrome User Data | **Rejected** — Chrome 136+ |
| A8 | Pixel visual baseline / `toHaveScreenshot` v1 | **Rejected** — D9 / §20.7 |
| A9 | Implement US-0143 `/auto` drain | **Rejected** — D9 |
| A10 | Rewrite GateEngine / workflow | **Rejected** — D1/DQ9 compose |
| A11 | Require live Chrome in CI | **Rejected** — fake driver |
| A12 | Replace kit `UAT_BROWSER_PROBE_MODE` default `cursor` | **Rejected** — KEEP; add `owned` |
| A13 | Silent / fake browser PASS | **Rejected** — US-0128 |
| A14 | Kit Python Playwright as standalone runtime | **Rejected** — standalone TS owns execution |
| A15 | `browser.close()` after CDP as default teardown | **Rejected** — kills operator session |

**Can this be simpler?** Nesting in app-runtime looks smaller and couples UAT to process lifecycle. Tool-broker fold mixes policy with Playwright. Cursor-MCP-only fails isolated CI and “without Cursor plugins.” A1 is the simplest design that meets AC-1..AC-8.

### Locked surfaces (DEC-0142)

1. **Package**: `@its-magic/browser-uat` (`standalone/packages/browser-uat`). npm name **LOCKED** `browser-uat`. `private: true`, `version: 0.0.0`, `type: module`, `engines.node >=22.19.0`, export `./src/index.ts`. **No Pi dependency.** Type-only / public-API imports from `@its-magic/app-runtime` (`ConnectHandoff`), `@its-magic/policy-engine`, `@its-magic/tool-broker`, `@its-magic/config` allowed. Those packages **do not** import browser-uat internals. Extend US-0133..0141 Pi-import grep to this package. No Biome override. Kit `files` omit `standalone/`. Do not add standalone to kit workspaces. **Execute owns package creation.**
2. **Compose, do not reimplement AppRuntime**: call `AppRuntime.connectHandoff(id)` (or injected port). Consume **LOCKED** Connect fields: `connect_endpoint`, `health_path`, `service_id`, `container_id`, `env_refs` (names-only), `url`, `ports`, `health`. Do **not** import ProcessManager/ExecutionBackend internals. Do **not** put BrowserUAT inside `app-runtime` or GateEngine. Do **not** rewrite CommandRouter, WorkflowEngine, GateEngine, or crash-resume DONE authority.
3. **Two-mode matrix** (AC-1): **isolated** = `chromium.launch({ headless })` + `browser.newContext()` (close OK). **authorized CDP** = dedicated `--user-data-dir` + `--remote-debugging-port` + `connectOverCDP` + **`disconnect()`** (browser stays alive). Default Chrome User Data → `BROWSER_CDP_DEFAULT_PROFILE_FORBIDDEN`. Missing approval/port/profile → `BROWSER_CDP_UNAUTHORIZED` (no silent isolated fallback). Optional `launchPersistentContext(dedicatedDir)` is helper-only, never default User Data.
4. **Typed tool** (AC-2): single `itsm_browser` `action` enum **LOCKED**: `open`, `navigate`, `snapshot`, `click`, `type`, `select`, `wait`, `screenshot`, `console`, `network`, `download`, `upload`, `accessibility`. Promote off PolicyEngine `STUB_TOOLS`. ToolBroker handler delegates to `BrowserUAT` (no Playwright import in broker). QA primary allowlist; CDP needs operator approval. Snapshot = a11y/DOM summary, **not** pixel.
5. **UAT planner** (AC-3): reuse `classify_step`. Additive **`UAT_BROWSER_PROBE_MODE=owned`**. Kit default **`cursor` held**. Kit-slice `UAT_PROBE_FORBIDDEN` **unweakened**. This story lifts `browser_smoke` for **its** fixtures only.
6. **Evidence** (AC-4/AC-7): compatible `uat.json` + `browser_evidence_refs`. Additive **LOCKED**: `snapshot_summary`, `trace_ref`, `duration_ms`, `browser_backend` (`isolated`\|`cdp`), `app_runtime_ref`. Redact Authorization/Cookie/Set-Cookie/tokens/form secrets via US-0135 before persist. HAR `content: "omit"`. Traces gitignored under `.its-magic/runtime/browser-evidence/`. Evidence-gap → `UAT_BROWSER_PROBE_FAILED` / `BROWSER_EVIDENCE_GAP`.
7. **Credentials** (AC-6): dedicated CDP profile, then opaque injected test account (names-only), then explicit operator ASK. **Never read `.env`**. Repo-file passwords → `UAT_PROBE_FORBIDDEN` / `BROWSER_CREDENTIAL_FORBIDDEN`. No live storageState in git.
8. **Reason codes LOCKED**: `BROWSER_UNAVAILABLE`, `BROWSER_CDP_UNAUTHORIZED`, `BROWSER_CDP_DEFAULT_PROFILE_FORBIDDEN`, `BROWSER_CRASHED`, `BROWSER_WAIT_TIMEOUT`, `BROWSER_ASSERTION_FAILED`, `BROWSER_CONSOLE_ERROR`, `BROWSER_NETWORK_FAILED`, `BROWSER_EVIDENCE_GAP`, `BROWSER_CREDENTIAL_FORBIDDEN`, `BROWSER_RETRY_CAP_EXHAUSTED`. Keep `UAT_PROBE_PASS`, `UAT_PROBE_FAILED`, `UAT_PROBE_TIMEOUT`, `UAT_PROBE_UNRESOLVED`, `UAT_PROBE_FORBIDDEN`, `UAT_BROWSER_UNAVAILABLE`, `UAT_BROWSER_PROBE_FAILED`, `UAT_BROWSER_PROBE_TIMEOUT`. Do not overload `APP_RUNTIME_*` / `BACKEND_*` / `REMOTE_*` / `WORKFLOW_*`.
9. **Retry** (AC-5): **`BROWSER_RETRY_MAX` default 2** from resolved config/scratchpad if present. Orthogonal to `APP_RUNTIME_RESTART_MAX`. Missing CDP auth is not retried into isolated. No fake browser PASS.
10. **OUT**: US-0143 drain; pixel visual baseline; micro-VM; restore `.opencode/commands/auto.md`; kit `cli.json`; plugin-local `its-magic-auto/tui.json`; npm-publish; git push; rewrite of US-0136..0141 packages.
11. **Tests**: 12 `test_us0142_*`; Win+Linux; fake-model CI; fake driver; in-process HTTP fixture. Count stays 12.

### Critic NB closures (research us0142rsc-* — informational)

| NB | Closure |
|----|---------|
| NB1 proof MATCH; Status OPEN; ACs unchecked; Chrome 136+ default profile forbidden; traces/HAR redact; CDP disconnect not close; `BROWSER_RETRY_MAX` orthogonal (`us0142rsc-challenger-001`) | LOCKED this H1 + DEC-0142; Status OPEN; ACs unchecked |
| NB2 sibling browser-uat composes `connectHandoff`; architecture owns DEC-0142 + `# US-0142`; ToolBroker→BrowserUAT; US-0143 drain OUT; pixel baseline OUT (`us0142rsc-architect-002`) | LOCKED this H1 + DEC-0142; T-001..T-009 |
| NB3 no browser-uat code; no DONE; 11 tasks ≤ 12; no `/architecture` spawn from critic (`us0142rsc-subtractor-003`) | Held — T-anch; Status OPEN; execute owns package; do not spawn `/sprint-plan` from this subagent |

## Components

### `browser-uat` package (AC-1..AC-8)

- Facade `BrowserUAT` + isolated Playwright driver + typed CDP adapter + evidence writer + UAT executor plug-in
- Grep denies `@earendil-works/pi-` inside the package

### AppRuntime Connect compose (AC-1, AC-4)

- Consume `connectHandoff`; do not start/stop processes here

### Isolated Playwright + CDP adapter (AC-1)

- `launch`+`newContext` default; `connectOverCDP`+`disconnect` authorized; dedicated profile only

### Typed `itsm_browser` (AC-2)

- Action enum; promote from STUB; QA primary; snapshot ≠ pixel

### UAT planner plug-in (AC-3)

- Reuse `classify_step`; additive `owned`; kit `cursor` + `UAT_PROBE_FORBIDDEN` held

### Evidence + redaction + credentials (AC-4, AC-6, AC-7)

- Compatible `uat.json`; redact before persist; never read `.env`

### Fail-closed retry (AC-5)

- Locked `BROWSER_*` / `UAT_*`; `BROWSER_RETRY_MAX` default 2

### Contract tests (AC-1..AC-8)

- Twelve markers (DEC-0142 §9). Kernel tests: `standalone/tests/contract`. Matrix Windows + Linux.

## Companion DEC = DEC-0142 (Required → Accepted)

Authored Accepted in THIS phase at `decisions/DEC-0142.md`. Locks A1, package, modes, tool enum, UAT mode, evidence, credentials, reason codes, cap, markers, seeds.

## Risks finalized (R1–R7 from R-0139)

- **R1 (HIGH)** Playwright traces/HAR leak cookies and Authorization → DQ5 omit+redact; gitignore traces; AC-7 tests
- **R2 (HIGH)** Operators CDP-attach the daily Chrome profile (Chrome 136+ ignores debug port) → dedicated `--user-data-dir`; `BROWSER_CDP_DEFAULT_PROFILE_FORBIDDEN`
- **R3 (MEDIUM)** Live Chromium absent on CI → DQ8 fake driver; `BROWSER_UNAVAILABLE` asserted, not skipped
- **R4 (MEDIUM)** `browser.close()` after CDP kills a logged-in session → DQ2 `disconnect()`
- **R5 (MEDIUM)** Weakening kit `UAT_PROBE_FORBIDDEN` to make US-0142 green → DQ4/DQ9; test 6
- **R6 (LOW)** Credential injection visible to the model → DQ6 names-only; PolicyEngine secret deny; never read `.env`
- **R7 (LOW)** npm name bikeshed vs §30 → this H1 pins `browser-uat`

## Compose, do not amend (verified)

| Story / DEC | Surface | Verification |
|-------------|---------|--------------|
| US-0141 / DEC-0141 / R-0138 | `ConnectHandoff` / `connectHandoff` | ✓ consume; AppRuntime not rewritten |
| US-0093 / R-0079 | `classify_step` / `uat.json` / `browser_evidence_refs` | ✓ KEEP contract; REPLACE backend; add `owned` |
| US-0065 | probe catalog kinds | ✓ unchanged |
| US-0128 / R-0111 | no fake browser PASS | ✓ kit waives stay `UAT_PROBE_FORBIDDEN` |
| US-0135 / DEC-0135 | `redact.ts` | ✓ headers/cookies/tokens before persist |
| US-0137 / DEC-0137 / R-0129 | PolicyEngine `itsm_browser` STUB | ✓ promote only; tables unamended |
| US-0140 / DEC-0140 / R-0135 | GateEngine / workflow | ✓ consume-not-rewrite |
| US-0085 | `.env` deny | ✓ never read |
| US-0056 / DEC-0038 | `compute_strict_proof_hash` tuple | ✓ UNAMENDED |
| Kit npm `its-magic` / DEC-0120 | `files` whitelist | ✓ omit `standalone/` |
| US-0143..US-0148 | later capabilities | ✓ OUT OF SCOPE (US-0143 drain) |
| BUG-0021 / R-0134 | OpenCode CLI TUI `/auto` listing | ✓ DONE; not mutated (`sprints/S0146/`) |
| BUG-0022 / R-0133 | (open bug) | ✓ OPEN; not mutated |
| BUG-0023 / R-0137 | OpenCode CLI TUI dispatch | ✓ DONE; not mutated (`sprints/S0148/`) |
| R-0120..R-0139 | prior research | ✓ not wiped (R-0138/R-0136/R-0137 intact) |

## Sprint seeds (11 tasks within SPRINT_MAX_TASKS=12 — for `/sprint-plan` expected S0150)

- **T-anch** (`# US-0142` H1 + DEC-0142 Accepted — RESOLVED in THIS phase; NO-OP / verification)
- **T-001** (AC-1 — `packages/browser-uat` + Pi-import grep + consume `connectHandoff`)
- **T-002** (AC-1 — isolated Playwright `launch`+`newContext`)
- **T-003** (AC-1 — CDP adapter `connectOverCDP`+`disconnect`+dedicated profile)
- **T-004** (AC-2 — promote `itsm_browser` typed actions)
- **T-005** (AC-3 — UAT planner plug-in + additive `owned` + kit `UAT_PROBE_FORBIDDEN` held)
- **T-006** (AC-4/AC-7 — evidence schema + redaction + gitignored traces)
- **T-007** (AC-6 — credential deny + opaque injection / operator approval)
- **T-008** (AC-5 — fail-closed `BROWSER_*`/`UAT_*` + `BROWSER_RETRY_MAX`)
- **T-009** (AC-8 — E2E happy+failure fixtures; no visual baseline)
- **T-010** (AC-1..AC-8 — 12 `test_us0142_*` Win/Linux fake-driver)

AC surjection: AC-1→T-001,T-002,T-003 (T-010 m1–m3); AC-2→T-004 (T-010 m4); AC-3→T-005 (T-010 m5,m6); AC-4→T-006 (T-010 m7); AC-5→T-008 (T-010 m3,m10); AC-6→T-007 (T-010 m9); AC-7→T-006 (T-010 m8); AC-8→T-009 (T-010 m11,m12). Order: T-anch → T-001 → T-002 → T-003 → T-004 → T-005 → T-006 → T-007 → T-008 → T-009 → T-010. No split (11 ≤ 12). Not `/quick`. Live-inventory S0146=BUG-0021, S0147=US-0140, S0148=BUG-0023, S0149=US-0141. Expected **S0150**. Do **not** write `sprints/S0150/` this phase.

## Isolation evidence (US-0048 / DEC-0029)

- `phase_id=architecture`, `role=tech-lead`, `story_id=US-0142`, `sprint_id=none` (pending — sprint-plan owns next unused id), `orchestrator_run_id=auto-20260913-us0142`
- `delivery_mode=ultra_lean`, `macro_phase=plan` (architecture — second canonical phase of `plan` macro)
- `model_id=cursor-grok-4.6-high` (CROSS_MODEL_REVIEW=1 — required on isolation)
- `fresh_context_marker=tl-US0142-architecture-20260914T035000Z-fresh`, `timestamp=2026-09-14T03:50:00Z` (UTC)
- `evidence_ref=docs/engineering/research.md ## R-0139; docs/product/backlog.md ## US-0142; docs/engineering/architecture.md (this # US-0142); decisions/DEC-0142.md; handoffs/resume_brief.md`
- Fresh tech-lead subagent per BUG-0006 / US-0048; no prior chat history. Narrow-read only. No `.env` reads. Status remains OPEN. US-0133..US-0141 DONE compose-only not reopened. BUG-0021 DONE not mutated. BUG-0022 OPEN not mutated. BUG-0023 DONE not mutated. No US-0143+ authoring. No `/sprint-plan` spawn from this subagent. No `standalone/packages/browser-uat` this phase.
- Prior phase strict proof consumed: `rp-auto-20260913-us0142-research-techlead-20260914T033000Z-US-0142` / `3C8C3226AB88276C2595CCE79742589FF464C3ED8444D6425CC99183D390655A` — RUNTIME_PROOF_VALID (independent `compute_strict_proof_hash` MATCH; consume-before-TTL `2026-09-14T03:50:00Z` < `2026-09-14T04:30:00Z`; immutable R-0139). Critic findings us0142rsc-* informational only (`rp-auto-20260913-us0142-sovereign-critic-techlead-20260914T034000Z-US-0142` / `18F5B1E72CDA4EFAB0F9A8F4588A151E4B84DD7391467BFD4A1D05EF81212621`; anti_slop=10; 0 blocking; degraded_mode=false; MATCH before TTL `2026-09-14T04:40:00Z`).
- Sovereign memory: `SOVEREIGN_MEMORY=1`; `build_injection_digest_block` returned `(no sovereign memory entries)` (read-only). No `mistakes.jsonl` write.

## Strict runtime proof (mirror)

- `runtime_proof_id=rp-auto-20260913-us0142-architecture-techlead-20260914T035000Z-US-0142`
- Canonical hashed payload (DEC-0038, `compute_strict_proof_hash` positional): `{"orchestrator_run_id":"auto-20260913-us0142","phase_id":"architecture","proof_issued_at":"2026-09-14T03:50:00Z","proof_ttl_seconds":3600,"role":"tech-lead","runtime_proof_id":"rp-auto-20260913-us0142-architecture-techlead-20260914T035000Z-US-0142"}`
- Isolation extras (not hashed): `delivery_mode=ultra_lean`, `macro_phase=plan`, `model_id=cursor-grok-4.6-high`, `sprint_id=none`, `story_id=US-0142`
- `proof_hash=52A720174CB9E0D35507ED9683ED70D22D72A5D9E757A5CF1170B2AC304B3175`
- `proof_ttl=2026-09-14T04:50:00Z`
- `hash_recompute_confirmation=true` (compute_strict_proof_hash → 52A720174CB9E0D35507ED9683ED70D22D72A5D9E757A5CF1170B2AC304B3175; **64 hex** verified)
- Consumed research proof: `rp-auto-20260913-us0142-research-techlead-20260914T033000Z-US-0142` / `3C8C3226AB88276C2595CCE79742589FF464C3ED8444D6425CC99183D390655A` — RUNTIME_PROOF_VALID MATCH before TTL `2026-09-14T04:30:00Z`
- Consumed critic proof: `rp-auto-20260913-us0142-sovereign-critic-techlead-20260914T034000Z-US-0142` / `18F5B1E72CDA4EFAB0F9A8F4588A151E4B84DD7391467BFD4A1D05EF81212621` — RUNTIME_PROOF_VALID MATCH before TTL `2026-09-14T04:40:00Z`

# US-0143 — Delivery routing and full-autonomy scheduler

## Overview

**US-0143** lifts deferred `/auto` and `/quick` so operators can run bounded standard, lean, quick, resume, and backlog-drain workflows in **runtime state**. Implementation lives **inside** existing `@its-magic/runtime-core`. Nested helper `workflow/delivery-router.ts`. CommandRouter returns implemented `RouteScheduled` (not 7-step for the scheduler command itself). WorkflowEngine owns the §14.4 `while run active` drain loop (`runAuto` / `runQuick`). GateEngine `RELEASE_GATE_ORDER` stays **unamended**. Host Cursor/OpenCode remain **scheduling-only**. **No Pi**. **No** sibling auto-scheduler. **No** prompt-only scheduler. **No** `.opencode/commands/auto.md` restore. Kit `files` omit `standalone/`. Five axes stay independent. AC-6 terminals stay non-relaxable even under `AUTONOMY_PRESET=full`. US-0144 critic *content* is OUT (hooks compose only). DEC-0038 `compute_strict_proof_hash` tuple stays **UNAMENDED**. Execute owns code files.

**Research anchor**: **R-0141** (DQ1–DQ10 LOCKED). **Companion DEC**: **DEC-0143** (Accepted — THIS phase). **EARLY_RESEARCH**: consumed from R-0141 (Graph Harness / SGH typed graph; Conductor-style zero-token router; control-plane vs data-plane; Bernstein no-LLM scheduler tests; AAL≠ACL; hard stops as circuit breakers) — **no new R-id**. Do not wipe R-0120..R-0141. **R-0139 remains US-0142. R-0138 remains US-0141. R-0140 remains BUG-0024.**

**Fresh context marker**: `tl-US0143-architecture-20260914T071000Z-fresh`
**Orchestrator run id**: `auto-20260913-us0143`
**Timestamp**: 2026-09-14T07:10:00Z (UTC)
**Verdict**: PASS
**Next**: sovereign-critic (architecture), then `/sprint-plan` **S0151** (S0150=US-0142; S0149=US-0141; S0148=BUG-0023; S0147=US-0140; S0146=BUG-0021; live-inventory S0151 unused; orchestrator-owned). ultra_lean: plan-verify is **not** in `resolved_phase_plan` (SKIPPED). Do **not** spawn sprint-plan or critic from this subagent (BUG-0006).

**baseline_h2_count (pre-mutate)**: `0`

## Approach locked (A1 — from R-0141)

| Option | Summary | Verdict |
|--------|---------|---------|
| **A1** | CommandRouter implements deferred `/auto`/`/quick` inside `@its-magic/runtime-core`; nested DeliveryRouter; WorkflowEngine owns drain; GateEngine unamended; YAML stop-matrix consume; TS L8 adapter; 12 `test_us0143_*` | **Preferred / LOCKED** — AC-1..AC-8 |
| A2 | Sibling `packages/auto-scheduler` | **Rejected** — D1 / §30 |
| A3 | Prompt-only scheduler / restore `auto.md` | **Rejected** — D3 / D9 |
| A4 | Rewrite GateEngine tables | **Rejected** — D1 |
| A5 | Fork stop-matrix YAML writer / prompt-encoded stops | **Rejected** — D5 |
| A6 | LangGraph / Temporal as `/auto` engine | **Rejected** — R-0135 / spawn-only |
| A7 | Fold scheduler into role-runtime | **Rejected** — US-0136 A2 |
| A8 | Amend KernelBridge allowlist for work-kind | **Rejected** — US-0140 compose |
| A9 | Implement US-0144 critic/memory content | **Rejected** — D9 |
| A10 | CLI/TUI ownership (US-0146) | **Rejected** — D9 |
| A11 | Silent mid-story `DELIVERY_MODE` switch | **Rejected** — DEC-0082 |
| A12 | Weaken `security_hard` under `full` preset | **Rejected** — AC-6 / AAL≠ACL |
| A13 | SQLite as stop/DONE SOT | **Rejected** — DEC-0140 |
| A14 | Keep `WORKFLOW_ROUTE_DEFERRED` as happy path | **Rejected** — AC-1 |
| A15 | LLM work-kind / stop-relaxability classifier | **Rejected** — D3 / D5 |

**Can this be simpler?** In-place `route` without DeliveryRouter mixes 7-step with drain. A sibling package fails D1. A prompt scheduler fails reproducibility. A1 is the simplest design that meets AC-1..AC-8.

### Locked surfaces (DEC-0143)

1. **Package**: existing `@its-magic/runtime-core`. Nested `src/workflow/delivery-router.ts`. **No Pi.** Type-only / public-API imports from `@its-magic/role-runtime`, `@its-magic/policy-engine`, `@its-magic/config`, `@its-magic/kernel-bridge` allowed. Those packages **do not** import delivery-router internals. No Biome override. Kit `files` omit `standalone/`. Do not add standalone to kit workspaces. **Execute owns code.**
2. **Lift deferred (AC-1)**: `SCHEDULER_COMMANDS = ["/auto","/quick"]`. `DEFERRED_COMMANDS` becomes empty (or removed). `CommandRouter.route("/auto"|"/quick")` → `RouteScheduled` (`ok: true`, `implemented: true`, `plan`, `axes`). Does **not** run 7-step for the scheduler command. Programmatic 16-command path **unamended**. Keep `WORKFLOW_ROUTE_DEFERRED` in `codes.ts` unused for these two names. Compose-amend `test_us0140_command_coverage` (US-0140 ACs stay DONE).
3. **Independent axes (AC-2)**: `DELIVERY_MODE`, `TOKEN_PROFILE`, CAVEMAN/voice, `AUTONOMY_PRESET`, `WORK_KIND`. Consume-only ConfigView lookups. **No new RuntimeConfig domain.** Compressed modes still require tests + acceptance. Axes must not fold.
4. **L8 adapter (AC-3)**: TS `resolveDeliveryRoute` ports `work_kind_routing_lib.py`. Precedence: `start-from` > explicit `DELIVERY_MODE` > `AUTO_PHASE_*` > work-kind > default standard. Conflict → `WORK_KIND_DELIVERY_MODE_CONFLICT`. Mid-story switch → `DELIVERY_MODE_SWITCH_MID_STORY`. `WORK_KIND_ROUTING=0` early-return `WORK_KIND_ROUTING_OFF`. KernelBridge allowlist **unamended**. Python remains kit SOT. Golden vectors vs Python fixtures.
5. **Compressed graphs (AC-2)**: `standard` = full `CANONICAL_PHASES`. `ultra_lean` = existing skip `plan-verify` held. `mega_quick` and **`/quick`** = **LOCKED** nodes `execute` → `qa` → `verify-work` → `release` → `closure` → `refresh-context`. Must not skip test evidence, UAT/acceptance, or GateEngine. Eligibility remains US-0096. `/quick` forces mega_quick shape (not a prompt).
6. **Drain owner (AC-5)**: `WorkflowEngine.runAuto` / `runQuick` own `while run active`. Caps from resolved config: `AUTO_LOOP_MAX_CYCLES`, `AUTO_BACKLOG_MAX_STORIES`, `AUTO_BACKLOG_ON_BLOCK`, `AUTO_EXECUTE_MAX_ITEMS`, `AUTO_BLOCK_RETRY_MAX`, `AUTO_PAUSE_REQUEST`, `AUTO_QUIET`, approvals. Exhaust → `WORKFLOW_LOOP_CAP` / `BLOCK_RETRY_CAP_EXHAUSTED` / `BUDGET_EXHAUSTED`. Bug-queue axis default-off (`AUTO_BUG_QUEUE=0` this run — do not drain BUG-0024). Operator pause/skip/approval/`AUTONOMY_PRESET=none` non-bypassable.
7. **Preset + stop matrix (AC-4/AC-6)**: `expandAutonomyPreset` before run. Consume `scripts/data/autonomy_stop_matrix.yaml` (file read). Do **not** weaken US-0119 `security_hard`. Additive `security_hard` codes **LOCKED**: `DECISION_UNRESOLVED`, `KERNEL_INCOMPATIBLE`, `QUALITY_EVIDENCE_FAILED`, `BUDGET_EXHAUSTED`, `RESUME_AMBIGUOUS`. AC-6 non-relaxable even under `full`. Models never decide relaxability. GateEngine order unamended.
8. **Ledger + resume (AC-7)**: dual-write `RunsStore.audit` + `handoffs/autonomy_repair_ledger/<orchestrator_run_id>.jsonl`. Repo artifacts remain canonical. SQLite is **not** stop/DONE SOT. Mid-resume: `discardOrphans` + fresh correct-role spawn. Never restore old specialist transcript. Never switch `DELIVERY_MODE` mid-story. Ledger fields: phase selection, retries, skips, stop reason, resume choice, repair kind, cap remaining, axis snapshot.
9. **Critic hooks**: existing `scheduleSupplementaryHooks` when `CROSS_MODEL_REVIEW=1`. US-0144 content OUT.
10. **OUT**: US-0144 content; US-0145 parallel/deploy; US-0146 CLI/TUI; restore `auto.md`; kit `cli.json`; plugin-local `tui.json`; npm-publish; git push; rewrite of US-0136..0142 packages; `.env` reads.
11. **Tests**: 12 `test_us0143_*`; Win+Linux; fake-model CI; in-memory SQLite. Count stays 12.

### Critic NB closures (research us0143rsc-* — informational)

| NB | Closure |
|----|---------|
| NB1 proof MATCH; Status OPEN; ACs unchecked; R-0141 authored; R-0139 US-0142 + R-0140 BUG-0024 held; AC-6 terminals named (`us0143rsc-challenger-001`) | LOCKED this H1 + DEC-0143; Status OPEN; ACs unchecked |
| NB2 A1 CommandRouter in runtime-core; WorkflowEngine drain; GateEngine unamended; architecture owns DEC-0143 + `# US-0143`; US-0144 content OUT (`us0143rsc-architect-002`) | LOCKED this H1 + DEC-0143; T-001..T-009 |
| NB3 no drain implementation; no DONE; 11 tasks ≤ 12; no `/sprint-plan` spawn from architecture (`us0143rsc-subtractor-003`) | Held — T-anch; Status OPEN; execute owns code; do not spawn `/sprint-plan` from this subagent |

## Components

### CommandRouter lift (AC-1)

- `SCHEDULER_COMMANDS`; empty `DEFERRED_COMMANDS`; `RouteScheduled`; 7-step reserved for canonical phases

### DeliveryRouter (AC-2, AC-3)

- Independent axes + L8 `resolveDeliveryRoute` + compressed plans

### ConfigView consume-only lookups (AC-2, AC-4)

- `lookupDeliveryMode` (exists) + `lookupTokenProfile` + `lookupVoice` + `lookupAutonomyPreset` + `lookupWorkKindRouting`; `expandAutonomyPreset` before run

### WorkflowEngine drain (AC-1, AC-5)

- `runAuto` / `runQuick`; reuse `runExecuteQaLoop` and unamended `evaluateRelease`

### Stop matrix consume (AC-4, AC-6)

- YAML file read; additive `security_hard`; `full` cannot relax AC-6

### Audit + repair ledger (AC-7)

- `RunsStore.audit` + JSONL; repo canonical; `discardOrphans` mid-resume

### Critic-hook slot (AC-1)

- `scheduleSupplementaryHooks` only; US-0144 content OUT

### Contract tests (AC-1..AC-8)

- Twelve markers (DEC-0143 §9). Kernel tests: `standalone/tests/contract`. Matrix Windows + Linux.

## Companion DEC = DEC-0143 (Required → Accepted)

Authored Accepted in THIS phase at `decisions/DEC-0143.md`. Locks A1, lift, axes, L8, compressed nodes, drain owner, AC-6 codes, ledger, markers, seeds.

## Risks finalized (R1–R6 from R-0141)

- **R1 (MEDIUM)** `test_us0140_command_coverage` breaks when deferred is lifted → DQ2 compose-amend in T-001; keep US-0140 ACs DONE
- **R2 (MEDIUM)** mega_quick node list bikeshed vs kit `["quick"]` macro → this H1 pins nodes; tests+acceptance+GateEngine non-skippable
- **R3 (LOW)** Dual-write ledger drift vs repo artifacts → DQ8 SQLite non-authority; `RECOVERY_FALSE_COMPLETION`
- **R4 (MEDIUM)** Operators treat `AUTONOMY_PRESET=full` as permission to skip hard stops → DQ7 YAML `security_hard`; test 10
- **R5 (LOW)** L8 TS adapter drifts from Python kit SOT → golden vectors; Python remains kit SOT
- **R6 (LOW)** Drain accidentally picks BUG-0024 → `AUTO_BUG_QUEUE=0`; sibling boundary tests; do not drain bugs this execute

## Compose, do not amend (verified)

| Story / DEC | Surface | Verification |
|-------------|---------|--------------|
| US-0140 / DEC-0140 / R-0135 | CommandRouter 7-step; GateEngine `RELEASE_GATE_ORDER`; `node:sqlite` | ✓ lift deferred only; gates unamended; compose-amend coverage test |
| US-0118 / DEC-0118 / R-0106 | L8 Python kit SOT | ✓ TS adapter + golden vectors; allowlist unamended |
| US-0119 / DEC-0119 / R-0107 | `expandAutonomyPreset`; YAML stop matrix | ✓ consume; do not fork writer; do not weaken `security_hard` |
| US-0095 / DEC-0078 / R-0081 | native chain | ✓ consume |
| US-0096 / DEC-0082 / R-0082 | ultra_lean / mega_quick | ✓ skip-plan-verify held; mega_quick nodes pinned |
| US-0070 / DEC-0052 | phase policy | ✓ consume |
| BUG-0006 / DEC-0051 | spawn-only | ✓ host scheduling-only; no in-process producer |
| US-0087 | bug-queue mutex | ✓ axis present; this run `AUTO_BUG_QUEUE=0` |
| US-0085 | `.env` deny | ✓ never read |
| US-0056 / DEC-0038 | `compute_strict_proof_hash` tuple | ✓ UNAMENDED |
| Kit npm `its-magic` / DEC-0120 | `files` whitelist | ✓ omit `standalone/` |
| US-0141 / US-0142 | DONE app-runtime / browser-uat | ✓ compose only; not reopened |
| US-0144..US-0148 | later capabilities | ✓ OUT OF SCOPE (US-0144 content) |
| BUG-0021 / R-0134 | OpenCode CLI TUI `/auto` listing | ✓ DONE; not mutated (`sprints/S0146/`) |
| BUG-0022 / R-0133 | (open bug) | ✓ OPEN; not mutated |
| BUG-0023 / R-0137 | OpenCode CLI TUI dispatch | ✓ DONE; not mutated (`sprints/S0148/`) |
| BUG-0024 / R-0140 | OpenCode TUI dispatch residual | ✓ OPEN; not mutated / not drained |
| R-0120..R-0141 | prior research | ✓ not wiped (R-0138/R-0139/R-0140 intact) |

## Sprint seeds (11 tasks within SPRINT_MAX_TASKS=12 — for `/sprint-plan` expected S0151)

- **T-anch** (`# US-0143` H1 + DEC-0143 Accepted — RESOLVED in THIS phase; NO-OP / verification)
- **T-001** (AC-1 — lift `DEFERRED_COMMANDS` + `RouteScheduled` + compose-amend `test_us0140_command_coverage`)
- **T-002** (AC-2 — ConfigView independent axis lookups + preset expand-before-run)
- **T-003** (AC-3 — TS L8 adapter + conflict code + golden vectors)
- **T-004** (AC-2 — compressed graphs: ultra_lean held; mega_quick/`/quick` tests+acceptance)
- **T-005** (AC-1/AC-5 — WorkflowEngine `runAuto`/`runQuick` §14.4 loop)
- **T-006** (AC-5 — drain/bulk/retry/skip/quiet/pause/approval caps)
- **T-007** (AC-4/AC-6 — YAML stop-matrix consume + AC-6 additive `security_hard`)
- **T-008** (AC-7 — audit + repair JSONL + mid-resume `discardOrphans`)
- **T-009** (AC-1 — critic-hook slot only; US-0144 content OUT)
- **T-010** (AC-1..AC-8 — 12 `test_us0143_*` Win/Linux fake-model)

AC surjection: AC-1→T-001,T-005,T-009 (T-010 m1–m2); AC-2→T-002,T-004 (T-010 m3–m5); AC-3→T-003 (T-010 m6–m7); AC-4→T-002,T-007 (T-010 m8); AC-5→T-005,T-006 (T-010 m9); AC-6→T-007 (T-010 m10); AC-7→T-008 (T-010 m11); AC-8→T-010 (m12). Order: T-anch → T-001 → T-002 → T-003 → T-004 → T-005 → T-006 → T-007 → T-008 → T-009 → T-010. No split (11 ≤ 12). Not `/quick`. Live-inventory S0146=BUG-0021, S0147=US-0140, S0148=BUG-0023, S0149=US-0141, S0150=US-0142. Expected **S0151**. Do **not** write `sprints/S0151/` this phase.

## Isolation evidence (US-0048 / DEC-0029)

- `phase_id=architecture`, `role=tech-lead`, `story_id=US-0143`, `sprint_id=none` (pending — sprint-plan owns next unused id), `orchestrator_run_id=auto-20260913-us0143`
- `delivery_mode=ultra_lean`, `macro_phase=plan` (architecture — second canonical phase of `plan` macro)
- `model_id=cursor-grok-4.6-high` (CROSS_MODEL_REVIEW=1 — required on isolation)
- `fresh_context_marker=tl-US0143-architecture-20260914T071000Z-fresh`, `timestamp=2026-09-14T07:10:00Z` (UTC)
- `evidence_ref=docs/engineering/research.md ## R-0141; docs/product/backlog.md ## US-0143; docs/engineering/architecture.md (this # US-0143); decisions/DEC-0143.md; handoffs/resume_brief.md`
- Fresh tech-lead subagent per BUG-0006 / US-0048; no prior chat history. Narrow-read only. No `.env` reads. Status remains OPEN. US-0133..US-0142 DONE compose-only not reopened. BUG-0021 DONE not mutated. BUG-0022 OPEN not mutated. BUG-0023 DONE not mutated. BUG-0024 OPEN not mutated/drained. No US-0144+ authoring. No `/sprint-plan` spawn from this subagent. No drain implementation code this phase.
- Prior phase strict proof consumed: `rp-auto-20260913-us0143-research-techlead-20260914T065000Z-US-0143` / `27986466F2DEE28D145CB9892C2A3AFBD4E41B2F9E9F88F133008BEB43F94042` — RUNTIME_PROOF_VALID (independent `compute_strict_proof_hash` MATCH; consume-before-TTL `2026-09-14T07:10:00Z` < `2026-09-14T07:50:00Z`; immutable R-0141). Critic findings us0143rsc-* informational only (`rp-auto-20260913-us0143-sovereign-critic-techlead-20260914T070000Z-US-0143` / `242D01E83A4DFE451C679C02C23593A16DD0F6313282F87A8DA846987E187D31`; anti_slop=10; 0 blocking; degraded_mode=false; MATCH before TTL `2026-09-14T08:00:00Z`).
- Sovereign memory: `SOVEREIGN_MEMORY=1`; `build_injection_digest_block` returned `(no sovereign memory entries)` (read-only). No `mistakes.jsonl` write.

## Strict runtime proof (mirror)

- `runtime_proof_id=rp-auto-20260913-us0143-architecture-techlead-20260914T071000Z-US-0143`
- Canonical hashed payload (DEC-0038, `compute_strict_proof_hash` positional): `{"orchestrator_run_id":"auto-20260913-us0143","phase_id":"architecture","proof_issued_at":"2026-09-14T07:10:00Z","proof_ttl_seconds":3600,"role":"tech-lead","runtime_proof_id":"rp-auto-20260913-us0143-architecture-techlead-20260914T071000Z-US-0143"}`
- Isolation extras (not hashed): `delivery_mode=ultra_lean`, `macro_phase=plan`, `model_id=cursor-grok-4.6-high`, `sprint_id=none`, `story_id=US-0143`
- `proof_hash=6FF1DB37B91284FDE90C5EC7058FF518605D49525BD8FACECB5AC570284F26E5`
- `proof_ttl=2026-09-14T08:10:00Z`
- `hash_recompute_confirmation=true` (compute_strict_proof_hash → 6FF1DB37B91284FDE90C5EC7058FF518605D49525BD8FACECB5AC570284F26E5; independently MATCH; **64 hex** verified)
- Consumed research proof: `rp-auto-20260913-us0143-research-techlead-20260914T065000Z-US-0143` / `27986466F2DEE28D145CB9892C2A3AFBD4E41B2F9E9F88F133008BEB43F94042` — RUNTIME_PROOF_VALID MATCH before TTL `2026-09-14T07:50:00Z`
- Consumed critic proof: `rp-auto-20260913-us0143-sovereign-critic-techlead-20260914T070000Z-US-0143` / `242D01E83A4DFE451C679C02C23593A16DD0F6313282F87A8DA846987E187D31` — RUNTIME_PROOF_VALID MATCH before TTL `2026-09-14T08:00:00Z`

# US-0144 — Sovereign runtime composition

## Overview

US-0144 implements the deferred sovereign critic, memory, review, decision, deferral, and convergence content as an opt-in composition inside `@its-magic/runtime-core`. `DEC-0144` and `R-0142` are authoritative. The default is `SOVEREIGN_RUNTIME=0`: it adds no content or writes while preserving US-0143's existing `CROSS_MODEL_REVIEW=1` scheduling-only critic session. No Pi, sibling package, arbitrary script execution, GateEngine change, US-0143 drain rewrite, CLI/TUI work, browser success claim, or `.env` access is permitted.

**Research anchor**: **R-0142** (DQ1–DQ10 LOCKED). **Companion DEC**: **DEC-0144** (Accepted — attested THIS phase; heading not duplicated). **EARLY_RESEARCH**: consumed from R-0142 (no new R-id). **R-0141 remains US-0143.** **baseline_h2_count (pre-mutate)**: `0`.
**Fresh context marker**: `tl-US0144-architecture-20260915T185104Z-fresh`
**Orchestrator run id**: `auto-20260913-us0144`
**Timestamp**: 2026-09-15T18:51:04Z (UTC)
**Verdict**: PASS
**Next**: sovereign-critic (architecture), then `/sprint-plan` **S0152** (exists PLANNED — sprint-plan owns body; this phase does not rewrite `sprints/S0152/`). Do **not** spawn critic or sprint-plan from this subagent (BUG-0006). Status remains OPEN. AC-1..AC-8 remain unchecked.

## R-0142 attestation lock (architecture 2026-09-15T18:51:04Z)

Existing `# US-0144` heading and prior locked-design/test/seed prose are retained. This subsection closes the only blocking gaps vs the R-0142 architecture-handoff attestation:

- **Closed KernelBridge set (9)**: `memory_digest`, `critic_model`, `role_review_plan`, `decision_session_append`, `deferral_append`, `deferral_list`, `drain_candidate_gate`, `convergence_evaluate`, `partial_delivery_write`. `deferral_append` / `deferral_list` are first-class ops (not implied by drain-gate).
- **`SOVEREIGN_RUNTIME=0` default-off**: no sovereign bridge call, memory read, sidecar write, sovereign review, convergence evaluation, or sovereign candidate gate.
- **US-0143 drain unamended**: `CommandRouter` routing, `runAuto`/`runQuick`, GateEngine `RELEASE_GATE_ORDER`, and legacy drain materialization stay byte-compatible while sovereign runtime is disabled. `gateDrainCandidate()` is exclusive only for US-0144 sovereign-generated candidates.
- **Twelve named tests**: `test_us0144_kernel_bridge_admission`; `test_us0144_bridge_json_timeout_fail_closed`; `test_us0144_pre_spawn_context_order`; `test_us0144_memory_bounds_default_off`; `test_us0144_model_collision_degraded`; `test_us0144_supplementary_manifest_reviews`; `test_us0144_ledger_schema_preserved`; `test_us0144_sidecar_idempotent_torn_write`; `test_us0144_drain_gate_preset_zero`; `test_us0144_per_candidate_operator_decision`; `test_us0144_blocking_only_convergence_smoke_truth`; `test_us0144_caps_progress_partial_delivery_boundaries`. Four `CROSS_MODEL_REVIEW` × `SOVEREIGN_RUNTIME` combinations live inside these twelve, not a thirteenth test.

### Critic NB closures (research us0144rsc-* — informational)

| NB | Closure |
|----|---------|
| NB1 proof MATCH; Status OPEN; ACs unchecked; R-0142 attested 9-op + 12 tests (`us0144rsc-challenger-001`) | LOCKED this H1 + DEC-0144 attestation; Status OPEN; ACs unchecked |
| NB2 nested runtime-core + typed KernelBridge; architecture owns DEC-0144 + `# US-0144`; S0152 sprint-plan-owned (`us0144rsc-architect-002`) | LOCKED this H1 + DEC-0144; T-anch..T-010 seeds; S0152 not rewritten this phase |
| NB3 no runtime implementation; no DONE; no `/sprint-plan` spawn from architecture (`us0144rsc-subtractor-003`) | Held — execute owns `sovereign_runtime_bridge.py`; Status OPEN; do not spawn critic or sprint-plan from this subagent |

## Locked design

- `KernelBridge.runSovereignOperation()` is a closed, manifest-admitted API using a fixed `scripts/sovereign_runtime_bridge.py` path, fixed working directory/environment allowlist, and versioned bounded request/response JSON. The only operations are the R-0142 closed set of nine: `memory_digest`, `critic_model`, `role_review_plan`, `decision_session_append`, `deferral_append`, `deferral_list`, `drain_candidate_gate`, `convergence_evaluate`, `partial_delivery_write`. Callers and manifests cannot select an executable, arguments, or schema. Only session sidecar, deferral, and partial-delivery operations may write.
- `CommandRouter` assembles an immutable pre-spawn bootstrap: phase context, bounded digest, role objective. `SpawnRequest` carries the bootstrap; `SessionSupervisor` attests its hash and confirms one delivery before producer work. A missing or mismatched acknowledgement fails with `SOVEREIGN_BOOTSTRAP_DELIVERY_FAILED`.
- `SovereignRuntime.afterProducerBoundary()` extends `scheduleSupplementaryHooks` without changing its scheduling semantics. It returns a discriminated `SovereignRuntimeResult` containing critic/degraded evidence, supplementary role reviews, convergence, progress, caps, and any partial-delivery reference.
- The canonical 12-field decision ledger is unchanged. A sidecar at `handoffs/sovereign_decision_sessions/<run>.jsonl` has deterministic event IDs, matching-ledger validation, idempotent duplicate handling, and no torn-write repair.
- `gateDrainCandidate()` is the sole materialization path for US-0144 sovereign-generated candidates. Explicit `SOVEREIGN_DRAIN_AUTO_ACCEPT=0` beats preset expansion and requires a per-candidate operator accept decision; legacy US-0143 drain remains untouched when the sovereign runtime is disabled.
- Only open blocking critic findings block convergence. Smoke surrogates remain non-browser evidence.

## Test contract

1. `test_us0144_kernel_bridge_admission` — Bridge manifest admission and rejected unknown operation.
2. `test_us0144_bridge_json_timeout_fail_closed` — Bridge malformed JSON, response cap, timeout, and subprocess failure.
3. `test_us0144_pre_spawn_context_order` — Pre-spawn context/digest/role ordering and acknowledged single delivery.
4. `test_us0144_memory_bounds_default_off` — Bounded memory and default-off zero-I/O.
5. `test_us0144_model_collision_degraded` — Fresh critic model collision and explicit degraded mode.
6. `test_us0144_supplementary_manifest_reviews` — Role-manifest reviews remain supplementary.
7. `test_us0144_ledger_schema_preserved` — Session sidecar preserves the 12-field ledger.
8. `test_us0144_sidecar_idempotent_torn_write` — Sidecar idempotency and torn-write failure are fail-closed.
9. `test_us0144_drain_gate_preset_zero` — Explicit drain-auto-accept zero overrides a full preset.
10. `test_us0144_per_candidate_operator_decision` — Every generated candidate requires an operator decision.
11. `test_us0144_blocking_only_convergence_smoke_truth` — Convergence honors blocking-only findings and smoke truthfulness.
12. `test_us0144_caps_progress_partial_delivery_boundaries` — Cap/progress/partial-delivery evidence preserves US-0143 and GateEngine boundaries.

## Sprint Seeds

- T-anch: DEC-0144 and this architecture section.
- T-001: kernel contract and typed sovereign bridge admission (9-op closed set).
- T-002: Python sovereign bridge dispatcher and closed operation schemas.
- T-003: pre-spawn bootstrap and supervisor acknowledgement.
- T-004: bounded memory and critic-model operations.
- T-005: supplementary role review and structured hook result.
- T-006: ledger session sidecar.
- T-007: candidate decision gate plus `deferral_append`/`deferral_list`.
- T-008: convergence, caps, and partial delivery.
- T-009: default-off configuration and exports (`SOVEREIGN_RUNTIME=0`).
- T-010: twelve hermetic contract tests (`test_us0144_*` IDs in Test contract).

AC coverage is surjective across T-001..T-010; the planned sprint is S0152 (sprint-plan owns materialization/reconcile). Status remains OPEN and acceptance remains unchecked until closure.

## Isolation evidence (US-0048 / DEC-0029)

- `phase_id=architecture`, `role=tech-lead`, `story_id=US-0144`, `sprint_id=none` (S0152 exists PLANNED — OUT of architecture body authorship)
- `delivery_mode=ultra_lean`, `macro_phase=plan`
- `model_id=cursor-grok-4.6-high`
- `fresh_context_marker=tl-US0144-architecture-20260915T185104Z-fresh`, `timestamp=2026-09-15T18:51:04Z` (UTC)
- `evidence_ref=docs/engineering/research.md ## R-0142; docs/product/backlog.md ## US-0144; docs/engineering/architecture.md (this # US-0144); decisions/DEC-0144.md; docs/engineering/decisions.md; handoffs/resume_brief.md`
- Fresh tech-lead subagent per BUG-0006 / US-0048; no prior chat history. Narrow-read only. No `.env` reads. Status remains OPEN. US-0143 DONE compose-only not reopened. US-0145+ and BUG-* not mutated. No `/sprint-plan` or critic spawn from this subagent. No S0152 rewrite beyond architecture refs.

## Strict runtime proof (mirror)

- `runtime_proof_id=rp-auto-20260913-us0144-architecture-techlead-20260915T185104Z-US-0144`
- Canonical hashed payload (DEC-0038, `compute_strict_proof_hash` positional): `{"orchestrator_run_id":"auto-20260913-us0144","phase_id":"architecture","proof_issued_at":"2026-09-15T18:51:04Z","proof_ttl_seconds":3600,"role":"tech-lead","runtime_proof_id":"rp-auto-20260913-us0144-architecture-techlead-20260915T185104Z-US-0144"}`
- Isolation extras (not hashed): `delivery_mode=ultra_lean`, `macro_phase=plan`, `model_id=cursor-grok-4.6-high`, `sprint_id=none`, `story_id=US-0144`
- `proof_hash=EA5C872E25AF1F03D79F10C7BF371E55993C7440A4A802BFD6E89505C8548BCD`
- `proof_ttl=2026-09-15T19:51:04Z`
- `hash_recompute_confirmation=true` (compute_strict_proof_hash → EA5C872E25AF1F03D79F10C7BF371E55993C7440A4A802BFD6E89505C8548BCD; independently MATCH; **64 hex** verified)
- Consumed research proof: `rp-auto-20260913-us0144-research-techlead-20260915T184300Z-US-0144` / `60382EB2AA2C27583B31E6BF2672660A6B52D2A0C78B40545CD1541239C0E71F` — RUNTIME_PROOF_VALID MATCH before TTL `2026-09-15T19:43:00Z` (consumed_at `2026-09-15T18:51:04Z`; not STALE)
- Consumed research critic proof: `rp-auto-20260913-us0144-sovereign-critic-techlead-20260915T194600Z-US-0144` / `339A5728D54AD589998FDC93D429963CE83FCFAAA1DE0ECF1E77CF723AF27F60` — independent MATCH (orchestrator MATCH; 64 hex verified)

# US-0146 — CLI, TUI, and operational observability

## Overview

US-0146 delivers sibling operator surfaces `@its-magic/cli` and new `@its-magic/tui` as thin clients of nested `runtime-core/src/operator/` facades. `DEC-0146` and `R-0143` are authoritative. **Approach A1 (A\*)** is locked. Compose US-0140 `CommandRouter` / `PROGRAMMATIC_COMMANDS`, US-0143 `/auto`/`/quick` `RouteScheduled`, US-0141 `AppRuntime` health, US-0142 browser evidence read APIs, US-0139 index, US-0080 token-cost evidence (read-only), and US-0144 sovereign DTO fields when enabled. No `WorkflowEngine`, `CommandRouter`, or `GateEngine` rewrite. No US-0148 daemon protocol, no kit `cli.json` / plugin `tui.json`, no `.opencode/commands/auto.md` restore, no `.env` access.

**Research anchor**: **R-0143** (DQ1–DQ10 LOCKED). **Companion DEC**: **DEC-0146** (Accepted — authored THIS phase). **baseline_h2_count (pre-mutate)**: `0`.
**Fresh context marker**: `tl-US0146-architecture-20260917T185000Z-fresh`
**Orchestrator run id**: `auto-20260917-us0146`
**Timestamp**: 2026-09-17T18:50:00Z (UTC)
**Verdict**: PASS
**Next**: `/sprint-plan` **S0153** (fresh **tech-lead**). CROSS_MODEL_REVIEW=0 — do **not** spawn sovereign-critic from this subagent. Status remains OPEN. AC-1..AC-8 remain unchecked.

## Locked design (A1)

| DQ | Lock |
|----|------|
| DQ1 | Sibling `standalone/apps/cli` + `standalone/apps/tui`; `runtime-core/src/operator/` facades; Pi only on `auth`/`models` |
| DQ2 | `OperatorCommandFacade` → `CommandRouter` / programmatic + scheduler paths; REPL argv parity |
| DQ3 | `OperatorObservabilityService.buildStatusSnapshot()` — read-only compose of runs, repo, app, index, browser, token-cost, sovereign |
| DQ4 | `buildRunTimeline()` — `RunsStore` audit + repo evidence; honest divergence labels |
| DQ5 | TUI client-only; **readline + ANSI** panels; typed DTO subscriptions |
| DQ6 | `buildMetricsSnapshot()` — US-0080 authoritative + derived counters; no `token_cost_runs` append from CLI/TUI |
| DQ7 | `OperatorPrompts` — Win/Linux width ≥40; `ITS_MAGIC_APPROVE` / pinned `--yes`/`--no`; else `OPERATOR_INPUT_REQUIRED` |
| DQ8 | Log/event cap **200 lines** / **32 KiB** visible + evidence footer; stream backpressure |
| DQ9 | In-process `OperatorSession` attach/reconnect/cancel; not US-0148 |
| DQ10 | Nine `test_us0146_*`; kit omits `standalone/`; **R-0143**; expected sprint **S0153** |

### Module pins

- `standalone/packages/runtime-core/src/operator/operator-command-facade.ts` — command + scheduler delegation
- `standalone/packages/runtime-core/src/operator/operator-observability-service.ts` — status, timeline, metrics
- `standalone/packages/runtime-core/src/operator/operator-prompts.ts` — shared approval UX
- `standalone/packages/runtime-core/src/operator/operator-session.ts` — in-process attach/reconnect/cancel handle
- `standalone/apps/cli` — complete stub; REPL + argv entry
- `standalone/apps/tui` — new package; panel layout + narrow-terminal collapse order: phase > status > timeline > tools

### Risks (architecture-owned)

| Risk | Mitigation |
|------|------------|
| Router table fork in CLI | Facade-only entry; contract parity test |
| TUI imports workflow internals | Package import ban in `test_us0146_tui_panels_client_only_boundaries` |
| Metrics ledger dual-write | Read-only observability service; US-0080 producers unchanged |
| OpenCode host confusion | BUG-0021/0023 DONE — standalone surface distinct; no plugin `tui.json` |
| US-0145/0147/0148 scope creep | Explicit OUT; compose boundaries in DEC-0146 |

## AC coverage

| AC | Architecture owner | Tests |
|----|-------------------|-------|
| AC-1 | DQ2 facade + auth delegate | `test_us0146_cli_command_parity_programmatic_and_scheduler`, `test_us0146_cli_auth_models_delegate_isolated` |
| AC-2 | DQ3 status snapshot | `test_us0146_status_snapshot_compose_read_only` |
| AC-3 | DQ4 timeline | `test_us0146_run_timeline_evidence_links` |
| AC-4 | DQ5 TUI client | `test_us0146_tui_panels_client_only_boundaries` |
| AC-5 | DQ6 metrics | `test_us0146_metrics_token_cost_compose_no_conflict` |
| AC-6 | DQ7 prompts | `test_us0146_approval_prompt_interactive_noninteractive` |
| AC-7 | DQ8 bounded logs | `test_us0146_bounded_log_summary_evidence_ref` |
| AC-8 | DQ9 session + DQ10 harness | `test_us0146_local_reconnect_cancel_narrow_terminal` |

## Test contract

1. `test_us0146_cli_command_parity_programmatic_and_scheduler` — AC-1 argv + slash mapping; `/auto`/`/quick` scheduled.
2. `test_us0146_cli_auth_models_delegate_isolated` — AC-1 `auth`/`models` use `dispatchItsmCommand` only; workflow stub removed.
3. `test_us0146_status_snapshot_compose_read_only` — AC-2 fields; no dual-write token ledger.
4. `test_us0146_run_timeline_evidence_links` — AC-3 ordering, rework, evidence refs.
5. `test_us0146_tui_panels_client_only_boundaries` — AC-4 no `CommandRouter` import in tui workflow path.
6. `test_us0146_metrics_token_cost_compose_no_conflict` — AC-5 US-0080 authority + derived counters.
7. `test_us0146_approval_prompt_interactive_noninteractive` — AC-6 Win/Linux width + non-interactive fail-closed.
8. `test_us0146_bounded_log_summary_evidence_ref` — AC-7 truncation + pointer.
9. `test_us0146_local_reconnect_cancel_narrow_terminal` — AC-8 attach/detach, cancel, cols≤40 layout.

## Sprint seeds

- T-anch: DEC-0146 and this `# US-0146` section.
- T-001: `operator/` module exports + facade skeleton.
- T-002: `OperatorCommandFacade` programmatic + scheduler parity.
- T-003: `auth`/`models` delegate isolation (US-0135).
- T-004: `buildStatusSnapshot` compose (US-0141/0142/0139/0080/0144).
- T-005: `buildRunTimeline` + evidence links.
- T-006: `buildMetricsSnapshot` + stale/missing flags.
- T-007: `OperatorPrompts` interactive/non-interactive.
- T-008: bounded logs + `OperatorSession` attach/cancel.
- T-009: `@its-magic/cli` REPL/argv completion.
- T-010: `@its-magic/tui` panels + narrow layout.
- T-011: nine contract tests (`test_us0146_*`).

AC coverage is surjective across T-001..T-011; sprint-plan owns **S0153** materialization (≤12 tasks; reconcile T-anch..T-011 to cap). ultra_lean: plan-verify skipped after sprint-plan.

## Template parity (FRAMEWORK_KIT_REPO=1)

- Kit `package.json` `files` continue to omit `standalone/`; do not add standalone to kit workspaces.
- No kit `cli.json`; no plugin-local `its-magic-auto/tui.json`; no `auto.md` restore.
- `template/` mirrors command/docs policy only when sprint/execute explicitly requires — not in this architecture phase.

## Isolation evidence (US-0048 / DEC-0029)

- `phase_id=architecture`, `role=tech-lead`, `story_id=US-0146`, `sprint_id=none` (S0153 expected at sprint-plan)
- `delivery_mode=ultra_lean`, `macro_phase=plan`
- `model_id=inherit` (CROSS_MODEL_REVIEW=0)
- `fresh_context_marker=tl-US0146-architecture-20260917T185000Z-fresh`, `timestamp=2026-09-17T18:50:00Z` (UTC)
- `evidence_ref=docs/engineering/research.md ## R-0143; docs/product/backlog.md ## US-0146; docs/engineering/architecture.md (this # US-0146); decisions/DEC-0146.md; docs/engineering/decisions.md; handoffs/resume_brief.md; handoffs/po_to_tl.md`
- Fresh tech-lead subagent per BUG-0006; narrow-read only. No `.env`. US-0140..US-0144 DONE compose-only not reopened. US-0145/US-0147/US-0148 OUT. BUG-* not mutated. No `/sprint-plan` spawn from this subagent.

## Strict runtime proof (mirror)

- `runtime_proof_id=rp-auto-20260917-us0146-architecture-techlead-20260917T185000Z-US-0146`
- Canonical hashed payload (DEC-0038, `compute_strict_proof_hash` positional): `{"orchestrator_run_id":"auto-20260917-us0146","phase_id":"architecture","proof_issued_at":"2026-09-17T18:50:00Z","proof_ttl_seconds":3600,"role":"tech-lead","runtime_proof_id":"rp-auto-20260917-us0146-architecture-techlead-20260917T185000Z-US-0146"}`
- Isolation extras (not hashed): `delivery_mode=ultra_lean`, `macro_phase=plan`, `model_id=inherit`, `sprint_id=none`, `story_id=US-0146`
- `proof_hash=5CD3C53F4B194541E3182C1DC53FE3D0C83FE3BEF986B10B509F922E5ED829F1`
- `proof_ttl=2026-09-17T19:50:00Z`
- `hash_recompute_confirmation=true` (compute_strict_proof_hash → 5CD3C53F4B194541E3182C1DC53FE3D0C83FE3BEF986B10B509F922E5ED829F1; independently MATCH; **64 hex** verified)
- Consumed research proof: `rp-auto-20260917-us0146-research-techlead-20260917T184200Z-US-0146` / `75561131E844072FCD975F9A74C3831DF311E87074406C21B014EA42A69ACEDA` — RUNTIME_PROOF_VALID MATCH before TTL `2026-09-17T19:42:00Z` (consumed_at `2026-09-17T18:50:00Z`; not STALE)

# US-0147 — Installation, update, and existing-project adoption

## Overview

US-0147 delivers triple-installer parity bootstrap for the standalone operator product: template-mirrored `.its-magic/standalone/` workspace, `itsm` shim, kernel-bridge preflight, `runtime-metadata.json`, adoption classifier, explicit browser setup, and uninstall/coexistence semantics. `DEC-0147` and `R-0144` are authoritative. **Approach A1 (A\*)** is locked. Compose US-0146 delivered CLI/TUI/operator facades (wire only — do not rewrite `runtime-core/src/operator/`), US-0134 kernel-bridge handshake, US-0008/US-0018 installers + manifest, US-0055 installer QA patterns, US-0142 browser-uat for `itsm setup browser`. No host `.cursor/` / `.opencode/` rewrite. No US-0148 daemon protocol. No kit `cli.json` / plugin `tui.json`. No `.env` access.

**Research anchor**: **R-0144** (DQ1–DQ10 LOCKED). **Companion DEC**: **DEC-0147** (Accepted — authored THIS phase). **baseline_h2_count (pre-mutate)**: `0`.
**Fresh context marker**: `tl-US0147-architecture-20260917T204000Z-fresh`
**Orchestrator run id**: `auto-20260917-us0146` (drain story **2 of 3**; `backlog_drain_stories_remaining_budget=1`)
**Timestamp**: 2026-09-17T20:40:00Z (UTC)
**Verdict**: PASS
**Next**: `/sprint-plan` **S0154** (fresh **tech-lead**). CROSS_MODEL_REVIEW=0 — do **not** spawn sovereign-critic from this subagent. Status remains OPEN. AC-1..AC-8 remain unchecked.

## Locked design (A1)

| DQ | Lock |
|----|------|
| DQ1 | Template mirror → `.its-magic/standalone/`; kit `files` omit root `standalone/`; FRAMEWORK_KIT_REPO in-tree pin for kit-dev |
| DQ2 | `bootstrap_standalone_runtime_installer_hook` in `installer.py`; PS1/sh parity; repair via `--standalone-bootstrap` |
| DQ3 | `classifyProjectAdoptionProfile` + US-0134 locate; `ADOPT_PARTIAL_MARKERS` fail-closed |
| DQ4 | Fresh init via `template/` skeleton; no US-0001..0132 backlog clone |
| DQ5 | `install_include_paths` vs `deny_overwrite`; staged rollback `INSTALL_INTERRUPTED_ROLLBACK_OK` |
| DQ6 | Kernel preflight before shim; `.its-magic/standalone/runtime-metadata.json` |
| DQ7 | Explicit `itsm setup browser`; `ITS_MAGIC_INSTALL_BROWSER=1` opt-in silent path |
| DQ8 | No `LegacyScratchpadAdapter` at install; `SCRATCHPAD_LEGACY_KEYS_PRESENT` WARN only |
| DQ9 | `uninstall-standalone` removes standalone tree/shims; preserves hosts + user layers |
| DQ10 | Ten `test_us0147_*`; **R-0144**; expected sprint **S0154** |

### Path and hook pins

- `docs/engineering/context/installer-owned-paths.manifest` (+ `template/` mirror) — additive standalone paths, `deny_overwrite`, staging dir
- `template/.its-magic/standalone/` — workspace mirror (apps/cli, apps/tui, packages/*, lockfile)
- `installer.py` — `bootstrap_standalone_runtime_installer_hook` (post host-config refresh, pre runbook bootstrap)
- `.its-magic/bin/itsm` — primary shim → standalone workspace `apps/cli` bin; optional `bin/itsm` opt-in only
- `.its-magic/standalone/runtime-metadata.json` — kernel/contract/browser_prereq summary
- `.its-magic/install-staging/<run_id>/` — interrupted update staging
- `classifyProjectAdoptionProfile` — installer module (Python); compose kernel-bridge locate
- `itsm setup browser` — delegates to US-0142 Playwright install scoped under standalone `node_modules`

### Reason codes (architecture-owned)

| Code | When |
|------|------|
| `STANDALONE_BOOTSTRAP_FAILED` | Hook/npm ci failure |
| `ADOPT_PARTIAL_MARKERS` | 1–2 of 3 kernel markers |
| `INSTALL_INTERRUPTED_ROLLBACK_OK` | Staging rollback success |
| `INSTALL_BROWSER_OFFLINE` | Airgap browser setup |
| `SCRATCHPAD_LEGACY_KEYS_PRESENT` | Advisory WARN |
| `KIT_VERSION_COEXISTENCE` | `.its-magic-version` mismatch advisory |
| `KERNEL_*` | Compose US-0134 (no duplicate validator) |

### Risks (architecture-owned)

| Risk | Mitigation |
|------|------------|
| Installer triple drift | Single Python hook entry; US-0055 parity tests |
| Overwrite user backlog on adopt | deny_overwrite + no historical backlog copy |
| Publish guard regression | No root `standalone/` in `files`; manifest parity test |
| Operator expects daemon reconnect | Document US-0146 in-process session; US-0148 OUT |
| US-0145 deploy scope creep | Explicit OUT in DEC-0147 |

## AC coverage

| AC | Architecture owner | Tests |
|----|-------------------|-------|
| AC-1 | DQ1+2+6+7 install/update/rollback/browser | `test_us0147_fresh_install_manifest_parity`, `test_us0147_interrupted_update_rollback`, `test_us0147_kernel_mismatch_fail_closed`, `test_us0147_browser_setup_explicit_gate` |
| AC-2 | DQ4 fresh skeleton | `test_us0147_fresh_install_manifest_parity` |
| AC-3 | DQ3 adopt | `test_us0147_adopt_cursor_only_repo`, `test_us0147_adopt_opencode_only_repo`, `test_us0147_adopt_both_hosts_repo` |
| AC-4 | DQ3 host coexistence | adopt matrix (no host tree mutation) |
| AC-5 | DQ5 preservation | `test_us0147_upgrade_preserves_user_layers` |
| AC-6 | DQ6 diagnostics | `test_us0147_kernel_mismatch_fail_closed` |
| AC-7 | DQ8+9+runbook | `test_us0147_runbook_sections_present`, `test_us0147_uninstall_preserves_hosts` |
| AC-8 | DQ10 lifecycle matrix | all ten `test_us0147_*` Win+Linux |

## Test contract

1. `test_us0147_fresh_install_manifest_parity` — AC-1/AC-2 triple-installer + template mirror.
2. `test_us0147_upgrade_preserves_user_layers` — AC-5 locals untouched.
3. `test_us0147_adopt_cursor_only_repo` — AC-3/AC-4 cursor-only profile.
4. `test_us0147_adopt_opencode_only_repo` — AC-3/AC-4 opencode-only profile.
5. `test_us0147_adopt_both_hosts_repo` — AC-3/AC-4 both-host profile.
6. `test_us0147_interrupted_update_rollback` — AC-1 staging rollback.
7. `test_us0147_kernel_mismatch_fail_closed` — AC-6 `KERNEL_*` / preflight.
8. `test_us0147_browser_setup_explicit_gate` — AC-1 explicit browser prereq.
9. `test_us0147_uninstall_preserves_hosts` — AC-7/AC-9 host preservation.
10. `test_us0147_runbook_sections_present` — AC-7 runbook + template parity sections.

## Sprint seeds

- T-anch: DEC-0147 and this `# US-0147` section.
- T-001: manifest + template `.its-magic/standalone/` mirror scaffolding.
- T-002: `bootstrap_standalone_runtime_installer_hook` + triple-installer wiring.
- T-003: `classifyProjectAdoptionProfile` + `ADOPT_PARTIAL_MARKERS`.
- T-004: fresh init + deny_overwrite preservation matrix.
- T-005: staging dir + interrupted rollback (`INSTALL_INTERRUPTED_ROLLBACK_OK`).
- T-006: kernel preflight + `runtime-metadata.json`.
- T-007: `itsm` shim + optional repo-root `bin/itsm` opt-in.
- T-008: `itsm setup browser` + metadata flags.
- T-009: `uninstall-standalone` + `KIT_VERSION_COEXISTENCE` advisory.
- T-010: runbook + template operator doc parity (AC-7).
- T-011: ten `test_us0147_*` pytest/installer fixtures.

AC coverage is surjective across T-001..T-011; sprint-plan owns **S0154** materialization (≤12 tasks; reconcile T-anch..T-011 to cap). ultra_lean: plan-verify skipped after sprint-plan.

## Template parity (FRAMEWORK_KIT_REPO=1)

- Kit `package.json` `files` continue to omit repo-root `standalone/`; standalone delivered via `template/.its-magic/standalone/` mirror + post-install `npm ci`.
- No kit `cli.json`; no plugin-local `its-magic-auto/tui.json`; no `auto.md` restore.
- `template/` manifest updates mirror active `installer-owned-paths.manifest` entries for standalone paths.

## Isolation evidence (US-0048 / DEC-0029)

- `phase_id=architecture`, `role=tech-lead`, `story_id=US-0147`, `sprint_id=none` (S0154 expected at sprint-plan)
- `delivery_mode=ultra_lean`, `macro_phase=plan`, `drain_story_index=2 of 3`
- `model_id=inherit` (CROSS_MODEL_REVIEW=0)
- `fresh_context_marker=tl-US0147-architecture-20260917T204000Z-fresh`, `timestamp=2026-09-17T20:40:00Z` (UTC)
- `evidence_ref=docs/engineering/research.md ## R-0144; docs/product/backlog.md ## US-0147 discovery_notes; docs/engineering/architecture.md (this # US-0147); decisions/DEC-0147.md; docs/engineering/decisions.md; handoffs/resume_brief.md; handoffs/po_to_tl.md`
- Fresh tech-lead subagent per BUG-0006; narrow-read only. No `.env`. US-0140..US-0146 DONE compose-only (US-0146 install wiring IN). US-0145/US-0148 OUT. BUG-0022 OPEN not drained. No `/sprint-plan` spawn from this subagent.

## Strict runtime proof (mirror)

- `runtime_proof_id=rp-auto-20260917-us0146-architecture-techlead-20260917T204000Z-US-0147`
- Canonical hashed payload (DEC-0038, `compute_strict_proof_hash` positional): `{"orchestrator_run_id":"auto-20260917-us0146","phase_id":"architecture","proof_issued_at":"2026-09-17T20:40:00Z","proof_ttl_seconds":3600,"role":"tech-lead","runtime_proof_id":"rp-auto-20260917-us0146-architecture-techlead-20260917T204000Z-US-0147"}`
- Isolation extras (not hashed): `delivery_mode=ultra_lean`, `macro_phase=plan`, `model_id=inherit`, `sprint_id=none`, `story_id=US-0147`, `drain_story_index=2 of 3`
- `proof_hash=90A68CD12FB24348890E4DCE47CDCE639736C67C6D91F3914542BFF282A366AD`
- `proof_ttl=2026-09-17T21:40:00Z`
- `hash_recompute_confirmation=true` (compute_strict_proof_hash → 90A68CD12FB24348890E4DCE47CDCE639736C67C6D91F3914542BFF282A366AD; independently MATCH; **64 hex** verified)
- Consumed research proof: `rp-auto-20260917-us0146-research-techlead-20260917T203000Z-US-0147` / `96C81771F5CE812898410E6F551A0C209475E9F31696EA13B07E7CDB1FC39237` — RUNTIME_PROOF_VALID MATCH before TTL `2026-09-17T21:30:00Z` (consumed_at `2026-09-17T20:40:00Z`; not STALE)

# US-0145 — Parallel development, release/deploy, self-healing, and closure

## Overview

US-0145 delivers optional parallel DEV arbitration and typed release/deploy with bounded post-deploy self-healing, composing existing US-0108/US-0109 Python libs through a delivery bridge without rewriting US-0143 drain or amending `RELEASE_GATE_ORDER`. `DEC-0145` and `R-0145` are authoritative. **Approach A1 (A\*)** is locked. Compose US-0140 closure/release ownership, US-0143 scheduling, US-0146 operator observe-only, US-0147 install paths (no deploy install coupling). No US-0148 daemon protocol. No live npm-publish/git-push in tests. No `.env` access.

**Research anchor**: **R-0145** (DQ1–DQ10 LOCKED). **Companion DEC**: **DEC-0145** (Accepted — authored THIS phase). **baseline_h2_count (pre-mutate)**: `0`.
**Fresh context marker**: `tl-US0145-architecture-20260917T223000Z-fresh`
**Orchestrator run id**: `auto-20260917-us0146` (drain story **3 of 3**; `backlog_drain_stories_remaining_budget=0`)
**Timestamp**: 2026-09-17T22:30:00Z (UTC)
**Verdict**: PASS
**Next**: `/sprint-plan` **S0155** (fresh **tech-lead**). CROSS_MODEL_REVIEW=0 — do **not** spawn sovereign-critic from this subagent. Status remains OPEN. AC-1..AC-9 remain unchecked.

## Locked design (A1)

| DQ | Lock |
|----|------|
| DQ1 | `ParallelDevCoordinator` in `workflow/delivery/`; WorkflowEngine post-execute hook; US-0143 drain unchanged |
| DQ2 | Bridge → `parallel_dev_arbiter.py`; `.its-magic/worktrees/<run_id>/`; PolicyEngine allowlist additive |
| DQ3 | Fresh `qa-arbiter` session; evidence packages; merge/reject/conflict paths |
| DQ4 | `DeliveryResourceGuard`; scratchpad + US-0080 + concurrency caps |
| DQ5 | `ReleaseTargetAdapter` registry (git_github, npm, ssh_command, docker, custom_command); deploy results ledger |
| DQ6 | Additive `ReleaseGateInput`; `RELEASE_GATE_ORDER` literal unamended |
| DQ7 | `ReleaseDeployPipeline.runPostDeployHealing()` → `self_healing_deploy_lib.py`; bounded DEV repair |
| DQ8 | `DEPLOY_DEFERRED`; no RELEASE_PASS on deploy fail; US-0146 `deploy_state=deferred` |
| DQ9 | `releaseCannotMarkDone` + `applyClosure` sole DONE authority |
| DQ10 | Twelve `test_us0145_*`; **R-0145**; expected sprint **S0155** |

### Path and module pins

- `standalone/packages/runtime-core/src/workflow/delivery/parallel-dev.ts` — `ParallelDevCoordinator`
- `standalone/packages/runtime-core/src/workflow/delivery/release-deploy.ts` — `ReleaseDeployPipeline`, `ReleaseTargetKind`, adapters
- `standalone/packages/runtime-core/src/workflow/delivery/resource-guard.ts` — `DeliveryResourceGuard`
- `standalone/packages/kernel-bridge/src/` — `runDeliveryOperation(op, payload)` closed surface
- `scripts/delivery_runtime_bridge.py` — dispatch to `parallel_dev_arbiter.py` / `self_healing_deploy_lib.py`
- `.its-magic/worktrees/<run_id>/` — parallel worktree root (gitignored)
- `handoffs/deploy_results/deploy_results.jsonl` — per-target `DeployTargetResult` ledger
- `handoffs/parallel_dev_pick.json` — v1 arbiter pick artifact (DEC-0108)
- `workflow-engine.ts` — hooks after execute PASS; after release artifact PASS before closure handoff

### Bridge operations (architecture-owned)

| Op | Purpose |
|----|---------|
| `parallel_dev_spawn` | Start N parallel DEV sessions against worktrees |
| `parallel_dev_create_worktrees` | Git worktree CRUD via US-0108 |
| `parallel_dev_list_active` | List active worktrees for run |
| `parallel_dev_cleanup_orphans` | End-of-run + resume orphan discard |
| `parallel_dev_merge_winner` | Controlled merge after QA arbiter |
| `deploy_smoke_probe` | Post-deploy health/smoke |
| `deploy_healing_retry` | Bounded repair loop via US-0109 |

### Feature flags (default-off)

- `SOVEREIGN_PARALLEL_DEV=0` — parallel coordinator no-op; byte-identical execute path
- `AUTO_SOVEREIGN_SELF_HEALING_DEPLOY=0` — deploy/healing pipeline no-op when disabled

### Reason codes (architecture-owned)

| Code | When |
|------|------|
| `PARALLEL_DEV_WORKTREE_CREATE_FAILED` | Git missing or worktree create error |
| `PARALLEL_DEV_SELECTION_NO_PASS` | QA arbiter rejects all candidates |
| `PARALLEL_DEV_MERGE_TIMEOUT` | Merge op exceeded timeout |
| `PARALLEL_DEV_RESOURCE_CAP_EXHAUSTED` | Parallel cap hit |
| `DELIVERY_WALL_CLOCK_EXCEEDED` | Delivery wall clock cap |
| `DELIVERY_TOKEN_BUDGET_EXHAUSTED` | US-0080 budget exceeded |
| `DELIVERY_CONCURRENT_TEST_CAP` | Test worker cap |
| `DEPLOY_DEFERRED` / `DEPLOY_HEALING_DEFERRED` | Exhausted healing (US-0107 deferral) |

### Risks (architecture-owned)

| Risk | Mitigation |
|------|------------|
| Git worktree flaky on Windows | Fake-git contract doubles; fail-closed create |
| Gate order regression | Golden test on `RELEASE_GATE_ORDER` literal |
| Release marks DONE | `test_us0145_release_cannot_mark_done` + `releaseCannotMarkDone` |
| US-0143 drain creep | Coordinator orthogonal; no CommandRouter edits |
| US-0148 scope creep | In-process delivery only; no daemon protocol |

## AC coverage

| AC | Architecture owner | Tests |
|----|-------------------|-------|
| AC-1 | DQ1+DQ2 isolation + default-off | `test_us0145_parallel_default_off_byte_identical`, `test_us0145_worktree_isolation_no_main_mutation` |
| AC-2 | DQ4 resource guards | `test_us0145_resource_guard_fail_closed` |
| AC-3 | DQ3 QA arbiter | `test_us0145_qa_arbiter_fresh_session_winner_merge`, `test_us0145_qa_arbiter_reject_all_evidence` |
| AC-4 | DQ5 target kinds | `test_us0145_release_target_matrix_dry_run` |
| AC-5 | DQ6 gates + targets | `test_us0145_release_gates_compose_order_unchanged`, `test_us0145_deploy_target_failure_no_release_pass` |
| AC-6 | DQ7 smoke repair | `test_us0145_smoke_repair_success_bounded`, `test_us0145_smoke_repair_exhausted_deferred` |
| AC-7 | DQ8 deferral truth | `test_us0145_smoke_repair_exhausted_deferred`, `test_us0145_deploy_target_failure_no_release_pass` |
| AC-8 | DQ9 closure boundary | `test_us0145_release_cannot_mark_done`, `test_us0145_closure_requires_valid_release_envelope` |
| AC-9 | DQ10 ownership matrix | all twelve `test_us0145_*` |

## Test contract

1. `test_us0145_parallel_default_off_byte_identical` — AC-1 default-off boundary.
2. `test_us0145_worktree_isolation_no_main_mutation` — AC-1 main tree read-only until merge.
3. `test_us0145_resource_guard_fail_closed` — AC-2 caps.
4. `test_us0145_qa_arbiter_fresh_session_winner_merge` — AC-3 winner path.
5. `test_us0145_qa_arbiter_reject_all_evidence` — AC-3 reject-all path.
6. `test_us0145_release_target_matrix_dry_run` — AC-4 kinds smoke.
7. `test_us0145_release_gates_compose_order_unchanged` — AC-5 gate order held.
8. `test_us0145_deploy_target_failure_no_release_pass` — AC-5/AC-7 no false PASS.
9. `test_us0145_smoke_repair_success_bounded` — AC-6 repair success.
10. `test_us0145_smoke_repair_exhausted_deferred` — AC-6/AC-7 deferral.
11. `test_us0145_release_cannot_mark_done` — AC-8/AC-9 release ownership.
12. `test_us0145_closure_requires_valid_release_envelope` — AC-8/AC-9 closure envelope.

## Sprint seeds

- T-anch: DEC-0145 and this `# US-0145` section.
- T-001: `delivery_runtime_bridge.py` + `runDeliveryOperation` kernel-bridge surface.
- T-002: `ParallelDevCoordinator` + WorkflowEngine post-execute hook (default-off).
- T-003: worktree bridge ops + PolicyEngine allowlist for `.its-magic/worktrees/`.
- T-004: QA arbiter session + evidence packages + merge/reject paths.
- T-005: `DeliveryResourceGuard` + reason codes.
- T-006: `ReleaseTargetAdapter` registry + dry-run/apply/verify + deploy results ledger.
- T-007: additive `ReleaseGateInput` conjuncts (order array frozen).
- T-008: `ReleaseDeployPipeline` + post-deploy healing bridge ops.
- T-009: deferral/truthfulness wiring (`DEPLOY_DEFERRED`, release evidence fail-closed).
- T-010: closure/release ownership guards compose US-0140.
- T-011: twelve `test_us0145_*` contract tests (fake git/target doubles).

AC coverage is surjective across T-001..T-011; sprint-plan owns **S0155** materialization (≤12 tasks; reconcile T-anch..T-011 to cap). ultra_lean: plan-verify skipped after sprint-plan.

## Template parity (FRAMEWORK_KIT_REPO=1)

- Kit `package.json` `files` continue to omit repo-root `standalone/`; delivery code lives under standalone workspace only.
- No kit `cli.json`; no plugin-local `its-magic-auto/tui.json`; no `auto.md` restore.
- Python bridge scripts remain at repo `scripts/` (compose US-0108/US-0109).

## Isolation evidence (US-0048 / DEC-0029)

- `phase_id=architecture`, `role=tech-lead`, `story_id=US-0145`, `sprint_id=none` (S0155 expected at sprint-plan)
- `delivery_mode=ultra_lean`, `macro_phase=plan`, `drain_story_index=3 of 3`
- `model_id=inherit` (CROSS_MODEL_REVIEW=0)
- `fresh_context_marker=tl-US0145-architecture-20260917T223000Z-fresh`, `timestamp=2026-09-17T22:30:00Z` (UTC)
- `evidence_ref=docs/engineering/research.md ## R-0145; docs/product/backlog.md ## US-0145 discovery_notes; docs/engineering/architecture.md (this # US-0145); decisions/DEC-0145.md; docs/engineering/decisions.md; handoffs/resume_brief.md; handoffs/po_to_tl.md`
- Fresh tech-lead subagent per BUG-0006; narrow-read only. No `.env`. US-0140..US-0147 DONE compose-only. US-0148 OUT. BUG-0022 OPEN not drained. No `/sprint-plan` spawn from this subagent.

## Strict runtime proof (mirror)

- `runtime_proof_id=rp-auto-20260917-us0146-architecture-techlead-20260917T223000Z-US-0145`
- Canonical hashed payload (DEC-0038, `compute_strict_proof_hash` positional): `{"orchestrator_run_id":"auto-20260917-us0146","phase_id":"architecture","proof_issued_at":"2026-09-17T22:30:00Z","proof_ttl_seconds":3600,"role":"tech-lead","runtime_proof_id":"rp-auto-20260917-us0146-architecture-techlead-20260917T223000Z-US-0145"}`
- Isolation extras (not hashed): `delivery_mode=ultra_lean`, `macro_phase=plan`, `model_id=inherit`, `sprint_id=none`, `story_id=US-0145`, `drain_story_index=3 of 3`
- `proof_hash=80F3C316829DD9A44996EE4BD61E4FF3AAC0FCF3DC276D02B7FC9585FDA5FBE9`
- `proof_ttl=2026-09-17T23:30:00Z`
- `hash_recompute_confirmation=true` (compute_strict_proof_hash → 80F3C316829DD9A44996EE4BD61E4FF3AAC0FCF3DC276D02B7FC9585FDA5FBE9; independently MATCH; **64 hex** verified)
- Consumed research proof: `rp-auto-20260917-us0146-research-techlead-20260917T220000Z-US-0145` / `CBBD28E0CA404A019F3919AA8870EA7FCC2699CC7AD4576F5F9CEA0323F222C6` — RUNTIME_PROOF_VALID MATCH before TTL `2026-09-17T23:00:00Z` (consumed_at `2026-09-17T22:30:00Z`; not STALE)

# US-0148 — Stable control protocol and recoverable daemon

## Overview

US-0148 delivers a versioned local control protocol and thin recoverable daemon so CLI/TUI attach cross-process to long-running workflow work with ordered events, reconnect replay, local security, and restart reconciliation — without moving workflow rules out of `runtime-core`. `DEC-0148` and `R-0148` are authoritative. **Approach A1 (A\*)** is locked. Compose US-0146 operator facades and command vocabulary (clients migrate to `DaemonTransport`); US-0136 fresh sessions on resume; US-0135 redaction; `runs/store` + `crashResume()`. No US-0145 delivery logic in daemon. No deferred rich clients v1. No kit `cli.json` / plugin `tui.json`. No `.env` access.

**Research anchor**: **R-0148** (DQ1–DQ10 LOCKED). **Companion DEC**: **DEC-0148** (Accepted — authored THIS phase). **baseline_h2_count (pre-mutate)**: `0`.
**Fresh context marker**: `tl-US0148-architecture-20260917T211400Z-fresh`
**Orchestrator run id**: `auto-20260917-us0148` (drain story **1 of 3**; `backlog_drain_stories_remaining_budget=2`)
**Timestamp**: 2026-09-17T21:14:00Z (UTC)
**Verdict**: PASS
**Next**: `/sprint-plan` **S0156** (fresh **tech-lead**). CROSS_MODEL_REVIEW=0 — do **not** spawn sovereign-critic from this subagent. Status remains OPEN. AC-1..AC-8 remain unchecked.

## Locked design (A1)

| DQ | Lock |
|----|------|
| DQ1 | JSON-RPC 2.0 on loopback HTTP (`127.0.0.1`/`::1`); WebSocket `/v1/events`; `.its-magic/daemon/listen.json` |
| DQ2 | `@its-magic/protocol` + `apps/daemon`; client in `runtime-core/src/daemon-client/` |
| DQ3 | Per-run SQLite `seq` log; `after_seq` replay; `DAEMON_EVENT_LAG_MAX` summary mode |
| DQ4 | `OperatorTransport` + `DaemonTransport` / `InProcessTransport`; US-0146 tests in-process only |
| DQ5 | `daemon.hello` capability negotiation; `PROTOCOL_VERSION_MISMATCH` fail-closed |
| DQ6 | Startup `crashResume` + `reconcileOperationalLedger`; fresh role sessions only |
| DQ7 | Bearer token file; controller vs observer; default-deny remote bind |
| DQ8 | `redactEventPayload()` on all wire paths |
| DQ9 | One controller + N observers; approval/cancel delegation |
| DQ10 | Twelve `test_us0148_*`; doc `docs/engineering/operator/daemon-protocol.md`; sprint **S0156** |

### Path and RPC pins

- `standalone/packages/protocol/` — schemas, types, `redactEventPayload`, protocol-client surface
- `standalone/apps/daemon/` — JSON-RPC + WebSocket listener; delegates to operator/workflow facades
- `runtime-core/src/daemon-client/` — `DaemonTransport` implementation for cli/tui
- `.its-magic/daemon/listen.json` — `host`, `port`, `protocol_version`
- `.its-magic/daemon/client.token` — ephemeral bearer (0600-class)
- Event persistence — SQLite table keyed by `run_id` + `seq` (daemon-owned DB path architecture-pinned under `.its-magic/daemon/`)

### JSON-RPC method pins

| Method | Purpose |
|--------|---------|
| `daemon.ping` | Liveness |
| `daemon.hello` | Version + capabilities + client identity |
| `run.start` | Begin run under daemon |
| `run.attach` | Attach with controller/observer role |
| `command.submit` | Delegate to `OperatorCommandFacade` |
| `approval.respond` | Approval path (controller only) |
| `run.cancel` | Stop-matrix / session cancel delegation |
| `status.snapshot` | Bounded status (compose observability caps) |

### Reason codes (architecture-owned)

| Code | When |
|------|------|
| `PROTOCOL_VERSION_MISMATCH` | Client outside supported range |
| `PROTOCOL_COMMAND_UNSUPPORTED` | Method not in server allowlist |
| `DAEMON_UNREACHABLE` | Client cannot connect (actionable start hint) |
| `DAEMON_CONTROLLER_BUSY` | Second controller attach |
| `EVENT_SEQ_GAP` | Replay gap detected |
| `APPROVAL_NO_CONTROLLER` | Approval with no controller attached |
| `RECONCILE_INCOMPLETE` | Post-restart ledger mismatch |
| `DAEMON_EVENT_LAG_MAX` | Client lag; summary mode engaged |

### Risks (architecture-owned)

| Risk | Mitigation |
|------|------------|
| US-0146 contract break | In-process transport for `test_us0146_*` |
| Unbounded event RAM | SQLite log + retention cap |
| Multi-user localhost | Bearer token required |
| Workflow duplication in daemon | Delegation-only; `test_us0148_daemon_delegates_no_duplicate_workflow` |
| US-0145 scope creep | No delivery/deploy in daemon |

## AC coverage

| AC | Architecture owner | Tests |
|----|-------------------|-------|
| AC-1 | DQ2+DQ5 schemas | `test_us0148_schema_command_event_roundtrip`, `test_us0148_protocol_version_mismatch_fail_closed` |
| AC-2 | DQ4 delegation | `test_us0148_daemon_delegates_no_duplicate_workflow` |
| AC-3 | DQ3+DQ4 attach/reconnect | `test_us0148_cli_attach_ordered_events`, `test_us0148_reconnect_replay_after_seq` |
| AC-4 | DQ1+DQ7+DQ8 security | `test_us0148_loopback_bind_default_deny_remote`, `test_us0148_wire_payload_secret_redaction` |
| AC-5 | DQ5 negotiation | `test_us0148_protocol_version_mismatch_fail_closed` |
| AC-6 | DQ6 restart | `test_us0148_crash_restart_reconcile_fresh_sessions` |
| AC-7 | DQ9+DQ10 concurrency | `test_us0148_event_backpressure_summary_mode`, `test_us0148_concurrent_observer_controller_roles`, `test_us0148_approval_routing_single_controller`, `test_us0148_cancel_propagates_to_runtime` |
| AC-8 | DQ10 docs | `docs/engineering/operator/daemon-protocol.md` + full `test_us0148_*` matrix |

## Test contract

1. `test_us0148_protocol_version_mismatch_fail_closed` — AC-5.
2. `test_us0148_schema_command_event_roundtrip` — AC-1.
3. `test_us0148_daemon_delegates_no_duplicate_workflow` — AC-2.
4. `test_us0148_cli_attach_ordered_events` — AC-3.
5. `test_us0148_reconnect_replay_after_seq` — AC-3 / AC-7.
6. `test_us0148_loopback_bind_default_deny_remote` — AC-4.
7. `test_us0148_wire_payload_secret_redaction` — AC-4.
8. `test_us0148_event_backpressure_summary_mode` — AC-7.
9. `test_us0148_concurrent_observer_controller_roles` — AC-7.
10. `test_us0148_approval_routing_single_controller` — AC-7.
11. `test_us0148_cancel_propagates_to_runtime` — AC-7.
12. `test_us0148_crash_restart_reconcile_fresh_sessions` — AC-6.

## Sprint seeds

- T-anch: DEC-0148 and this `# US-0148` section.
- T-001: `@its-magic/protocol` package (schemas, types, `redactEventPayload`).
- T-002: `apps/daemon` JSON-RPC loopback server + `listen.json` / `client.token`.
- T-003: per-run SQLite event log + workflow/observability hooks.
- T-004: WebSocket `/v1/events` subscribe + `after_seq` replay.
- T-005: `OperatorTransport` + `runtime-core/src/daemon-client/` `DaemonTransport`.
- T-006: CLI/TUI default daemon attach (preserve in-process doubles for US-0146).
- T-007: `daemon.hello` versioning + controller/observer attach roles.
- T-008: startup `crashResume` + `reconcileOperationalLedger` + orphan cleanup TTLs.
- T-009: approval routing + cancel delegation + concurrency audit fields.
- T-010: `docs/engineering/operator/daemon-protocol.md` (AC-8 deferred-client boundary).
- T-011: twelve `test_us0148_*` in `us0148.contract.test.ts` (port 0 fixture).

AC coverage is surjective across T-001..T-011; sprint-plan owns **S0156** materialization (≤12 tasks; reconcile T-anch..T-011 to cap). ultra_lean: plan-verify skipped after sprint-plan.

## Template parity (FRAMEWORK_KIT_REPO=1)

- Kit `package.json` `files` continue to omit repo-root `standalone/`; daemon/protocol live in standalone workspace only (compose US-0147 template mirror — no new mirror required for v1).
- No kit `cli.json`; no plugin-local `its-magic-auto/tui.json`; no `auto.md` restore.

## Isolation evidence (US-0048 / DEC-0029)

- `phase_id=architecture`, `role=tech-lead`, `story_id=US-0148`, `sprint_id=none` (S0156 expected at sprint-plan)
- `delivery_mode=ultra_lean`, `macro_phase=plan`, `drain_story_index=1 of 3`
- `model_id=inherit` (CROSS_MODEL_REVIEW=0)
- `fresh_context_marker=tl-US0148-architecture-20260917T211400Z-fresh`, `timestamp=2026-09-17T21:14:00Z` (UTC)
- `evidence_ref=docs/engineering/research.md ## R-0148; docs/product/backlog.md ## US-0148 discovery_notes; docs/engineering/architecture.md (this # US-0148); decisions/DEC-0148.md; docs/engineering/decisions.md; handoffs/resume_brief.md; handoffs/po_to_tl.md`
- Fresh tech-lead subagent per BUG-0006; narrow-read only. No `.env`. US-0133..US-0147 DONE compose-only (US-0146 client migration IN). BUG-0022 OPEN not drained. No `/sprint-plan` spawn from this subagent.

## Strict runtime proof (mirror)

- `runtime_proof_id=rp-auto-20260917-us0148-architecture-techlead-20260917T211400Z-US-0148`
- Canonical hashed payload (DEC-0038, `compute_strict_proof_hash` positional): `{"orchestrator_run_id":"auto-20260917-us0148","phase_id":"architecture","proof_issued_at":"2026-09-17T21:14:00Z","proof_ttl_seconds":3600,"role":"tech-lead","runtime_proof_id":"rp-auto-20260917-us0148-architecture-techlead-20260917T211400Z-US-0148"}`
- Isolation extras (not hashed): `delivery_mode=ultra_lean`, `macro_phase=plan`, `model_id=inherit`, `sprint_id=none`, `story_id=US-0148`, `drain_story_index=1 of 3`
- `proof_hash=AC546FD44FE347547D9DD92F79C906DC71B2212DD27969336F73F9475C48708D`
- `proof_ttl=2026-09-17T22:14:00Z`
- `hash_recompute_confirmation=true` (compute_strict_proof_hash → AC546FD44FE347547D9DD92F79C906DC71B2212DD27969336F73F9475C48708D; independently MATCH; **64 hex** verified)
- Consumed research proof: `rp-auto-20260917-us0148-research-techlead-20260917T211200Z-US-0148` / `5F986CEE216B57CFD2DB191C8C4CE1CD9539596DCA6A35AEB9E91CE4729B0A4C` — RUNTIME_PROOF_VALID MATCH before TTL `2026-09-17T22:12:00Z` (consumed_at `2026-09-17T21:14:00Z`; not STALE)

# BUG-0025 — npm publish of its-magic omits scripts/standalone_runtime_install_lib.py

## Overview

**`BUG-0025`** closes the **published-kit packaging omit** that leaves global `its-magic@0.1.3` without `scripts/standalone_runtime_install_lib.py`. Operator upgrade/missing then crashes after `HOST_CONFIG_POSTINSTALL_OK` with a raw `FileNotFoundError` from `_load_standalone_runtime_install_lib` → `exec_module`. Repo-local lib exists; root `package.json` `files` does not list it.

Distinct from **BUG-0022 OPEN** / **BUG-0024 OPEN** (do **not** merge or drain). Compose **US-0147 DONE** / **R-0144** / **DEC-0147** — packaging + fail-closed loader + pack/guard + patch republish only; do **not** reopen US-0147 ACs or rewrite hook/adoption/kernel semantics. Semver quirk `0.1.3-11`→`0.1.3` **OUT** of primary scope (optional release-notes note). Do **not** wipe **R-0148** or rewrite historical `# US-0147` / `# US-0148` bodies.

**Research anchor**: **`R-0149`** (DQ1–DQ10 LOCKED; winner **A1**). **Companion DEC**: **none** — this H1 is the sole architecture lock surface. **EARLY_RESEARCH=0**. Optional modes: `CROSS_REPO_OBSERVABILITY=0` / `COMPONENT_SCOPE_MODE=0` / `SPEC_PACK_MODE=0` / `USER_GUIDE_MODE=0` — skipped.

**Fresh context marker**: `tl-BUG0025-architecture-20260918T170000Z-fresh`
**Orchestrator run id**: `auto-20260918-bug0025`
**Parent**: `cursor-20260918-BUG0025-intake`
**Timestamp**: 2026-09-18T17:00:00Z (UTC)
**Verdict**: PASS (`decision_gate=false`)
**Next**: `/sprint-plan` (expected **S0157** — do **not** create this phase)
**baseline_h2_count (pre-mutate)**: `0`

## Approach locked (A1 — from R-0149 DQ1–DQ10)

**Approach A1 (A\*)** (locked):

1. Add **one** root `package.json` `files` entry: **`scripts/standalone_runtime_install_lib.py`**.
2. Harden `installer.py` `_load_standalone_runtime_install_lib`: **`os.path.isfile(lib_path)` before `spec_from_file_location` / `exec_module`** (mirror `_load_doc_profile_lib`); on miss raise/print **`[STANDALONE_BOOTSTRAP_FAILED]`** — **no** raw `FileNotFoundError` as operator-visible outcome. Wrap `bootstrap_standalone_runtime_installer_hook` / `run_standalone_postinstall` so upgrade/missing exits **1** with that token when the lib is absent.
3. Contract tests in **`tests/bug0025_packaging_contract_test.py`** (DQ10 markers below).
4. **Optional**: extend `scripts/guard_installer_publish.py` to assert the allowlist entry (and/or packed path) — keep US-0133 **omit-`standalone/`** intact; never require `standalone/` in `files`.
5. **Patch version bump republish** (e.g. `0.1.3` → `0.1.4`) via existing `RELEASE_PUBLISH_MODE` / release-all path so `npm install -g its-magic@0.1.4` (or `@latest`) includes the lib. Same-line republish of `0.1.3` is fragile (npm immutability) — prefer bump.
6. **Residual (DQ2)**: `load_supported_range(script_dir)` reads `standalone/packages/kernel-bridge/supported-kernel-range.json` under package root — absent on published kit. Fail-closed into **`STANDALONE_BOOTSTRAP_FAILED`** / existing **`KERNEL_*`**. Do **not** add `standalone/` to `files`. Do **not** add a tiny JSON peer to `files` unless execute proves otherwise (default: fail-closed without new entry).

| Option | Summary | Verdict |
|--------|---------|---------|
| **A1** | One `files` entry + isfile fail-closed loader + npm pack contract + optional guard + patch republish | **Preferred / LOCKED** |
| A2 | Allowlist only; leave raw FileNotFoundError | **Rejected** — AC-3 |
| A3 | Inline/vendor lib into `installer.py` | **Rejected** — US-0147 compose |
| A4 | Allowlist entire `scripts/` | **Rejected** — over-broad |
| A5 | Ship `standalone/` in npm `files` | **Rejected** — US-0133 |
| A6 | Reopen US-0147 / merge BUG-0022\|0024 | **Rejected** — DQ7/DQ8 |

### Locked pins (architecture-owned)

| Pin | Value |
|-----|-------|
| `files` entry string | `scripts/standalone_runtime_install_lib.py` (exactly one new entry) |
| Loader shape | isfile-before-exec; emit `STANDALONE_BOOTSTRAP_FAILED`; no raw FileNotFoundError |
| Test file | `tests/bug0025_packaging_contract_test.py` |
| Guard | Optional allowlist assert in `guard_installer_publish.py`; omit-`standalone/` held |
| Republish | Patch bump (current kit `0.1.3` → next patch, e.g. `0.1.4`) |
| Template parity | No `template/scripts/standalone_runtime_install_lib.py` mirror |
| Companion DEC | **none** |
| Expected sprint | **S0157** (materialize at `/sprint-plan` only) |

## Design challenge (assumptions / simpler / risks)

- **Alternative to allowlist?** Vendor/inline lib into `installer.py`. Smaller packaging surface; breaks US-0147 compose and dual-maintains logic. **Rejected.**
- **Alternative to fail-closed?** Document “reinstall same version” / leave FileNotFoundError. Fails AC-3/AC-4. **Rejected.**
- **Can this be simpler?** Allowlist-only without loader harden fails AC-3 when path still missing. Guard-only without named `test_bug0025_*` fails DQ5. A1 (one file + mirror doc_profile pattern + 5–6 tests) is the simplest design that meets AC-1..AC-8.
- **Governance fork?** Packaging completeness + fail-closed reason code — not a DEC-class product fork. **`decision_gate=false`**. No companion DEC.
- **Supported-range residual:** fail-closed without shipping `standalone/` (US-0133). Operator on published kit must not see raw `FileNotFoundError` for that JSON either.

## Components

### package.json `files` (DQ1, AC-1/AC-2)

Add exactly:

```json
"scripts/standalone_runtime_install_lib.py"
```

Do not add `scripts/`, do not add `standalone/`, do not remove existing intake/materialize/remote_config/guard/doc_profile peers.

### Installer loader (DQ3, AC-3/AC-4)

In `installer.py` `_load_standalone_runtime_install_lib`:

1. Resolve `lib_path` adjacent to `installer.py` (same as today).
2. If `not os.path.isfile(lib_path)` → raise `RuntimeError("[STANDALONE_BOOTSTRAP_FAILED] …")` (or return-path that prints the same token).
3. Else `spec_from_file_location` + `exec_module` as today.
4. Ensure `bootstrap_standalone_runtime_installer_hook` / `run_standalone_postinstall` catch and exit **1** with **`STANDALONE_BOOTSTRAP_FAILED`** printed — operator must not see an uncaught `FileNotFoundError` traceback as the primary outcome.

Keep `bootstrap_standalone_runtime_installer_hook` call sites and US-0147 reason-code family. Do not rewrite adoption classifier, template mirror layout, shim paths, kernel handshake, browser gate, or uninstall mode behavior.

### Pack / guard contract (DQ4, DQ5, AC-5)

Primary: pytest contract via `npm pack --dry-run --json` (or temp `.tgz` member list) asserting posix path `scripts/standalone_runtime_install_lib.py` (or `package/scripts/...`) **and** root `package.json` `files` contains the exact string.

Optional: `guard_installer_publish.py` fails closed when the allowlist entry is missing (and optionally when pack inventory omits it). Existing US-0133 omit-`standalone/` check stays authoritative.

### Republish (DQ6, AC-6)

Patch-bump version in kit `package.json` (and packaging twins as existing release path requires) then publish through release-all / `RELEASE_PUBLISH_MODE`. Release notes cite upgrade command for operators still on `0.1.3`. Semver quirk note optional only.

### Supported-range residual (DQ2)

When `supported-kernel-range.json` under package-root `standalone/` is absent, fail-closed into `STANDALONE_BOOTSTRAP_FAILED` / `KERNEL_*`. **Do not** add `standalone/` to `files`.

## Test contract (DQ10)

File: `tests/bug0025_packaging_contract_test.py` — **5–6** named tests:

1. `test_bug0025_package_json_files_lists_standalone_runtime_install_lib` — AC-2
2. `test_bug0025_npm_pack_includes_standalone_runtime_install_lib` — AC-1 / AC-5
3. `test_bug0025_load_missing_lib_emits_standalone_bootstrap_failed` — AC-3
4. `test_bug0025_bootstrap_wrapper_no_raw_filenotfound_traceback` — AC-3 / AC-4
5. `test_bug0025_guard_installer_publish_requires_allowlist_entry` — AC-5 (optional if guard extended; else skip with note in sprint task)
6. `test_bug0025_us0147_compose_hook_call_sites_unchanged` — AC-7 smoke (hook presence; no reopen)

Keep prior `test_bug0001_*` / `test_bug0003_*` / US-0084 / US-0133 / `test_us0147_*` green — additive only (DQ8).

## AC coverage

| AC | Architecture owner | Tests / evidence |
|----|-------------------|------------------|
| AC-1 | DQ1+DQ2+DQ4 pack membership | `test_bug0025_npm_pack_includes_standalone_runtime_install_lib` |
| AC-2 | DQ1 `files` string | `test_bug0025_package_json_files_lists_standalone_runtime_install_lib` |
| AC-3 | DQ3 loader fail-closed | `test_bug0025_load_missing_lib_emits_standalone_bootstrap_failed`, `test_bug0025_bootstrap_wrapper_no_raw_filenotfound_traceback` |
| AC-4 | DQ3 wrapper exit path | same + upgrade/missing bootstrap path |
| AC-5 | DQ4+DQ5 contract (+ optional guard) | pack test + optional guard test |
| AC-6 | DQ6 patch republish | release task / notes (execute+release) |
| AC-7 | DQ7 US-0147 compose-only | `test_bug0025_us0147_compose_hook_call_sites_unchanged` |
| AC-8 | Sibling BUG-0022/0024 boundary | sprint/backlog notes; no merge/drain |

Acceptance checkbox: `docs/product/acceptance.md` BUG-0025 row remains unchecked until closure (US-0045). Status stays **OPEN**.

## Risks (architecture-owned)

| Risk | Mitigation |
|------|------------|
| Published kit fails later on package-root `supported-kernel-range.json` | Fail-closed residual (DQ2); do not add `standalone/` to `files` |
| Guard false-positive vs US-0133 omit check | Guard asserts **script allowlist presence** only |
| Operator stays on `0.1.3` after bump | AC-6 release notes + upgrade command |
| US-0147 test drift | Keep `test_us0147_*` green; bug0025 tests additive only |
| Same-line `0.1.3` republish rejected by npm | Prefer patch bump to `0.1.4` |

## Atomic task seeds (for `/sprint-plan` → **S0157**)

| # | Seed | Surfaces |
|---|------|----------|
| T-anch | Verify `# BUG-0025` H1 + R-0149 A1 DQ1–DQ10 + no companion DEC + US-0147 compose-only + BUG-0022/0024 not drained | architecture.md, R-0149 (read-only) |
| T-001 | Add `scripts/standalone_runtime_install_lib.py` to root `package.json` `files` | `package.json` |
| T-002 | Harden `_load_standalone_runtime_install_lib` isfile-before-exec → `STANDALONE_BOOTSTRAP_FAILED` | `installer.py` (loader) |
| T-003 | Wrap bootstrap / `run_standalone_postinstall` so missing lib exits 1 with token (no raw FileNotFoundError) | `installer.py` (wrappers) |
| T-004 | Fail-closed supported-range residual into `STANDALONE_BOOTSTRAP_FAILED` / `KERNEL_*` (no `standalone/` in `files`) | `installer.py` / lib call path |
| T-005 | Author `tests/bug0025_packaging_contract_test.py` markers 1–4 + 6 (and 5 if guard extended) | `tests/bug0025_packaging_contract_test.py` |
| T-006 | Optional: extend `guard_installer_publish.py` allowlist assert; keep omit-`standalone/` | `scripts/guard_installer_publish.py` |
| T-007 | Patch version bump (e.g. 0.1.3→0.1.4) + packaging twin sync as release path requires | `package.json` + packaging twins |
| T-008 | Release notes / runbook troubleshooting pointer for upgrade command + optional semver quirk note | release notes / runbook |
| T-009 | Republish via existing release-all / `RELEASE_PUBLISH_MODE` (AC-6) | release path |
| T-010 | Confirm `test_us0147_*` + BUG-0001/0003 / US-0084 / US-0133 guards still green | CI / scoped pytest |

**Task count**: 11 seeds (T-anch + T-001..T-010) ≤ `SPRINT_MAX_TASKS=12`. Not `/quick`. Sprint-plan owns **S0157** materialization — **this phase does not create `sprints/S0157/`**.

## Decision linkage

- Decision: **none** (companion DEC not required — cite **R-0149** / this `# BUG-0025`)
- Compose (do not amend bodies): **DEC-0147** / **US-0147** / **US-0133** / **US-0084** / BUG-0001 / BUG-0003 packaging lineage
- Research: **R-0149** (do not wipe **R-0148**)
- Related: **BUG-0022 OPEN** / **BUG-0024 OPEN** — not mutated; **US-0148** — not mutated

## Isolation evidence (US-0048 / DEC-0029)

- `phase_id=architecture`, `role=tech-lead`, `bug_id=BUG-0025`, `sprint_id=none` (S0157 expected at sprint-plan)
- `delivery_mode=ultra_lean`, `macro_phase=plan`, `model_id=inherit` (CROSS_MODEL_REVIEW=0)
- `fresh_context_marker=tl-BUG0025-architecture-20260918T170000Z-fresh`, `timestamp=2026-09-18T17:00:00Z` (UTC)
- `evidence_ref=docs/engineering/research.md ## R-0149; docs/product/backlog.md ### BUG-0025; docs/engineering/architecture.md (this # BUG-0025); handoffs/resume_brief.md; handoffs/po_to_tl.md`
- Fresh tech-lead subagent per BUG-0006; narrow-read only. No `.env`. No companion DEC. No `sprints/S0157/`. No Status/AC mutation. No `/sprint-plan` spawn. No npm-publish. No git push. No sovereign-critic (CROSS_MODEL_REVIEW=0).

## Strict runtime proof (mirror)

- `runtime_proof_id=rp-auto-20260918-bug0025-architecture-techlead-20260918T170000Z-BUG-0025`
- Canonical hashed payload (DEC-0038, `compute_strict_proof_hash` positional): `{"orchestrator_run_id":"auto-20260918-bug0025","phase_id":"architecture","proof_issued_at":"2026-09-18T17:00:00Z","proof_ttl_seconds":3600,"role":"tech-lead","runtime_proof_id":"rp-auto-20260918-bug0025-architecture-techlead-20260918T170000Z-BUG-0025"}`
- Isolation extras (not hashed): `delivery_mode=ultra_lean`, `macro_phase=plan`, `model_id=inherit`, `sprint_id=none`, `bug_id=BUG-0025`, `skipped_phases=[intake]`, `CROSS_MODEL_REVIEW=0`, `native_chain_active=true`, `native_chain_continuing=true`, `segment_work_item_kind=bug`
- `proof_hash=DA89597E0B3BD3F37E33AE7A83BFAFF70B4CD04EEDB22BDAE0D7C283FF09B8BE`
- `proof_ttl=2026-09-18T18:00:00Z`
- `hash_recompute_confirmation=true` (compute_strict_proof_hash → DA89597E0B3BD3F37E33AE7A83BFAFF70B4CD04EEDB22BDAE0D7C283FF09B8BE; independently MATCH; **64 hex** verified)
- Consumed research proof: `rp-auto-20260918-bug0025-research-techlead-20260918T165500Z-BUG-0025` / `8E27420FCD21FE740C6015A45AB789057024E91BEA858636968488C1ACBFD249` — RUNTIME_PROOF_VALID MATCH before TTL `2026-09-18T17:55:00Z` (consumed_at `2026-09-18T17:00:00Z`; not STALE)

# US-0150 — Production standalone runtime composition

## Decision

Accept **A1** from `R-0150`: add `standalone/packages/runtime-host` as `@its-magic/runtime-host`, the sole production composition root for a project. It resolves configuration once and constructs/adopts the existing Pi kernel, kernel bridge, session supervisor, ToolBroker, code-intelligence/context services, operational store, and `CommandRouter`. CLI and daemon receive this host; they must not create throwing kernels, literal empty config, separate stores, or placeholder-capable brokers.

`runtime-host` is an outer layer. It may import delivered leaf packages and `runtime-core`; none of those packages may import it. TUI remains an `OperatorTransport` client under US-0151. This story does not execute lifecycle work, add AppRuntime/BrowserUAT, implement deployment, or alter CI ownership.

## Host Contract

```ts
type RuntimeHost = {
  projectRoot: string;
  config: ResolvedRuntimeConfig;
  commandRouter: CommandRouter;
  sessionSupervisor: SessionSupervisor;
  dispose(): Promise<void>;
};

type RuntimeHostOptions = {
  projectRoot: string;
  lifetime: "direct-cli" | "daemon";
  factories?: RuntimeHostTestFactories;
};

async function createRuntimeHost(options: RuntimeHostOptions): Promise<RuntimeHost>;
```

- `factories` is an explicit test seam. Production entrypoints do not pass it, and test-only factories cannot silently select fake tools, fake intelligence, or a throwing kernel.
- A daemon owns one host per project for its process lifetime. A direct CLI invocation creates one host for the command and always calls `dispose()` in `finally`.
- `dispose()` stops admitted sessions and watchers and closes operational resources in reverse construction order. It must be idempotent; repository artifacts are never deleted or reconciled as part of disposal.

## Boot And Failure Contract

1. Canonicalize the project root and resolve typed runtime configuration with non-secret provenance.
2. Open the operational store, locate and handshake the kernel bridge, and fail before scheduling when either admission fails.
3. Create the Pi kernel with custom tools only and deny-by-default project resources.
4. Create real policy-admitted tool implementations, active code intelligence/context services, and the `SessionSupervisor`.
5. Construct the existing `CommandRouter` from those admitted services and expose it through the host.

Host failures use the architecture-owned `RUNTIME_*` family: `RUNTIME_CONFIG_UNAVAILABLE`, `RUNTIME_BRIDGE_UNAVAILABLE`, `RUNTIME_KERNEL_ADMISSION_FAILED`, and `RUNTIME_SERVICE_UNAVAILABLE`. Exact payload schema is implementation-owned, but each result is typed, redacted, and fail-closed. `ok:<tool>`, fake browser/intelligence defaults, or synthetic success are forbidden outside explicit test factories.

## Security And State Ownership

- The host passes provider credentials only through the existing auth/model runtime; raw secrets are neither returned nor logged.
- Role/model/provider selection, policy hash, custom-tool-only enforcement, resource-loader default deny, and ToolBroker path/shell checks remain mandatory for every fresh session.
- Repository artifacts and kernel validators remain authoritative. SQLite stores only operational run/session/audit/index metadata.

## Test Contract

| AC | Primary architecture test |
|----|---------------------------|
| AC-1 | `test_us0150_runtime_host_resolves_one_config_and_builds_graph` |
| AC-2 | `test_us0150_cli_and_daemon_use_runtime_host_not_throwing_kernel` |
| AC-3 | `test_us0150_host_creates_fresh_attested_custom_tool_session` |
| AC-4 | `test_us0150_admitted_tool_executes_or_denies_without_placeholder_success` |
| AC-5 | `test_us0150_bridge_validator_and_operational_store_preserve_artifact_authority` |
| AC-6 | `test_us0150_production_composition_unavailable_services_and_disposal` |

The suite creates an actual Pi SDK session with a deterministic local test-model seam; it does not require paid credentials or external network access. Existing fake-package contracts stay as unit coverage but cannot satisfy these six operator-composition tests.

## Atomic Task Seeds

| # | Seed |
|---|------|
| T-anch | Verify `R-0150`, `DEC-0150`, package dependency direction, and story boundaries. |
| T-001 | Add the `runtime-host` package and typed public host/factory interfaces. |
| T-002 | Resolve config/project root/store/bridge admission with redacted `RUNTIME_*` failures. |
| T-003 | Compose Pi kernel, real ToolBroker implementations, intelligence/context, and `SessionSupervisor`. |
| T-004 | Construct the existing `CommandRouter`; add host lifetime and idempotent disposal. |
| T-005 | Replace CLI and daemon throwing-kernel/empty-config construction with the host. |
| T-006 | Add production-composition tests for Pi session, policy tool behavior, bridge/validator, failures, and disposal. |
| T-007 | Add package dependency and production-vs-test-factory regression checks. |

## Boundaries And Consequences

- Compose US-0133 through US-0140 without rewriting their public contracts. Do not reopen their status or acceptance rows in this implementation slice.
- US-0151 owns lifecycle execution, operator transport, and TUI state; US-0152 owns AppRuntime/BrowserUAT; US-0153 owns parallel/release execution; US-0154 owns installed-path CI proof.
- Out: US-0149, BUG-0026, phase-9 clients, root-kit publish work, `.env` reads, and git push.
- `/sprint-plan` owns sprint materialization. This architecture phase creates no application code and no sprint directory.

# BUG-0024 — OpenCode CLI TUI listed `/auto` still toasts OPENCODE_AUTO_TUI_DISPATCH_UNSUPPORTED after BUG-0023 Axis A (live dispatch)

## Overview

**`BUG-0024`** closes the **live CLI TUI dispatch residual** left after BUG-0023 Axis A shipped files: operator OpenCode CLI TUI (`opencode`, not `--pure`) **sees and invokes listed `/auto`**, then still toasts title `its-magic /auto` / body **`OPENCODE_AUTO_TUI_DISPATCH_UNSUPPORTED`**. Lifecycle does **not** start (`runAutoLifecycle` not reached). Axis A files present (`rpc.ts` Rpc.define + optional peer, `tui.ts` `{ id, tui }` + `dispatchRunAutoLifecycle`, orchestrator `await ctx.rpc.register` when present + `editor.add`, `tui.json` listing, `auto.md` absent) is **not** success.

Distinct from **BUG-0023 DONE** (Axis A mock+inspection — do **not** reopen ACs / S0148), **BUG-0021 DONE** (listing limb still true — toast title proves listed invoke; do **not** reopen), **BUG-0020 DONE** (desktop Command.Info), **BUG-0019 DONE** (tokens), **BUG-0018 DONE** (do **not** restore STOP-only `auto.md`), **BUG-0022 OPEN** (Cursor inherit — do **not** merge / drain), **BUG-0027 OPEN** (manual phase persistence — compose only; do **not** drain).

**This section supersedes `# BUG-0023` “DISPATCH only when client/RPC truly absent” as the live-operator happy-path claim.** Axis A compose (shared Defined + `client.rpc(Defined)` / `OpenCode.make` + await register + `{ id, tui }` + `editor.add`) remains `# BUG-0023`. Live residual diagnostics + peer-brand requirement for TUI success are **this** section. Do **not** rewrite historical `# BUG-0023` / `# BUG-0021` / `# BUG-0019` / `# BUG-0018` bodies.

**Research anchor**: **`R-0140`** (DQ1–DQ10 LOCKED; compose **R-0137** / **R-0136** / **R-0134** / **R-0124** — do not wipe). **Companion DEC**: **none** (same class as BUG-0019 / BUG-0020 / BUG-0021 / BUG-0023 / BUG-0025). **EARLY_RESEARCH=0** — no new `R-xxxx`. **Out of scope**: Cursor `/auto` as done definition (working path until fix only); `--pure`; BUG-0022; BUG-0027 mutate; reopen 0015–0023 ACs; JSON `commands.auto`+`template`; STOP-only `auto.md`; live OpenCode CLI TUI probe in default CI (`UAT_PROBE_FORBIDDEN` held).

**Fresh context marker**: `tl-BUG0024-architecture-20260921T194300Z-fresh`
**Orchestrator run id**: `auto-20260921-bug0024`
**Parent**: `cursor-20260913-BUG0024-intake`
**Timestamp**: 2026-09-21T19:43:00Z (UTC)
**Verdict**: PASS (`decision_gate=false`)
**Next**: `/sprint-plan` (expected **S0159** — do **not** create this phase)
**baseline_h2_count (pre-mutate)**: `0`

## Approach locked (A1 Hybrid residual live-dispatch — from R-0140 DQ1–DQ10)

**Approach A1 (A\*)** (locked): keep `{ id, tui }` listing + `editor.add` execute + Axis A `client.rpc(Defined).runAutoLifecycle` / `OpenCode.make({ baseUrl }).rpc(Defined)` happy path; require **peer-branded** `@opencode/plugin/rpc` `Rpc.define` for TUI dispatch success (local identity-`define` stays load-safe for orchestrator/`editor.add` but is **not** sufficient for live `client.rpc`); stop silent register-skip and catch-all→DISPATCH — emit **stage-distinct** `OPENCODE_*`; DISPATCH remains **umbrella** only when all limbs exhausted; never silent `localhost:4096`; never restore `auto.md`.

1. Keep default export `{ id, tui }` + `registerLayer` `slashName: "auto"` / `ctrl+shift+a` (BUG-0021 compose — **do not reshape listing**).
2. Keep `editor.add({ name: "auto", execute })` as execute owner (BUG-0018 A* compose).
3. Shared `./its-magic-auto/rpc.ts` continues to export `ITS_MAGIC_AUTO_RPC`. Specifier **LOCKED**: `@opencode/plugin/rpc`. Local identity-`define` remains allowed so orchestrator loads without the peer.
4. **TUI success gate (DQ3)**: `dispatchRunAutoLifecycle` treats Defined as TUI-happy **only** when peer `@opencode/plugin/rpc` branded the object (detect peer-resolve / branded mark architecture pins in execute). Identity-define Defined → **`OPENCODE_AUTO_TUI_DEFINED_UNBRANDED`**, not silent DISPATCH and not pretend success.
5. **Limb order (LOCKED)**:
   1. Resolve `client = context.client ?? context.api?.client` (host-true `api.client` per DQ1). Missing → **`OPENCODE_AUTO_TUI_MISSING_CLIENT`**.
   2. Dynamic-import `ITS_MAGIC_AUTO_RPC`. Peer-unbranded → Defined-unbranded code (step 4).
   3. If `typeof client.rpc === "function"` → `client.rpc(Defined).runAutoLifecycle(payload)` with payload `{ sessionID?, prompt?, delivery? }` — **not** `{ input }`. Rpc throw / no `runAutoLifecycle` → stage code (not catch-all DISPATCH alone) then fall through.
   4. Else / after rpc miss: if `.rpc` absent → may emit **`OPENCODE_AUTO_TUI_RPC_ABSENT`** before make limb (observable; may still try make).
   5. `OpenCode.make({ baseUrl }).rpc(Defined).runAutoLifecycle(payload)` only when `baseUrl = client.baseUrl ?? client.config?.baseUrl ?? client.defaults?.baseUrl` resolvable. Missing baseUrl / `@opencode/client` → **`OPENCODE_AUTO_TUI_MAKE_UNREACHABLE`**. **Never** silent `http://localhost:4096`.
   6. Orchestrator: keep `await ctx.rpc.register(ITS_MAGIC_AUTO_RPC, { runAutoLifecycle })` when `ctx.rpc.register` exists. When **absent**: emit honest **`OPENCODE_AUTO_TUI_REGISTER_SKIPPED`** (session-visible / test-observable — not silent skip-as-success). TUI may still try client/make limbs.
   7. **`OPENCODE_AUTO_TUI_DISPATCH_UNSUPPORTED`** only as **umbrella** when all limbs exhausted or host truly cannot dispatch (AC-1/AC-2).
6. Invented `POST /rpc/...` `{ input }` stays **not** a path (BUG-0023 compose).
7. Eight additive `test_bug0024_*` (below). Keep `test_bug0023_*` / `0021` / `0020` / `0019` / `0018` compose.
8. Upgrade `--host opencode|both` **overwrites** live dispatch path (`tui.ts` / `rpc.ts` / orchestrator register limb) on already-Axis-A trees; still **prunes** leftover `auto.md`.

| Option | Summary | Verdict |
|--------|---------|---------|
| **A1 Hybrid residual** | Peer-branded Defined for TUI success + stage codes + register-skip honesty + Axis A client/make path; `{ id, tui }` + `editor.add` held | **Preferred / LOCKED** |
| A2 Client pass-through only | Only expand `api?.client` wiring | **Rejected** — insufficient vs H2/H5/H3 |
| A3 Register timing only | Only force/await register | **Rejected** — residual may be branding/client |
| A4 Defined branding only | Only peer Rpc.define | **Rejected** — register-skip + diagnostics still required |
| A5 HTTP fallback only | Only OpenCode.make | **Rejected** — no silent localhost; primary remains client.rpc |
| A6 Restore auto.md / Plugin.define TUI / JSON template | — | **Rejected** — D3/D4 / BUG-0018 / BUG-0021 |

### Locked tokens (architecture-owned — DQ6)

| Code | When |
|------|------|
| `OPENCODE_AUTO_TUI_MISSING_CLIENT` | `run()`/`dispatch` with no usable `api.client` / `context.client` |
| `OPENCODE_AUTO_TUI_RPC_ABSENT` | Client present but `typeof client.rpc !== "function"` (before/alongside make limb) |
| `OPENCODE_AUTO_TUI_DEFINED_UNBRANDED` | `ITS_MAGIC_AUTO_RPC` resolved via local identity-`define` only — not peer-branded; **not** TUI happy path |
| `OPENCODE_AUTO_TUI_REGISTER_SKIPPED` | Orchestrator `ctx.rpc.register` absent — observable; not silent success |
| `OPENCODE_AUTO_TUI_MAKE_UNREACHABLE` | Make limb needed but no resolvable `baseUrl` and/or `@opencode/client` unusable; **never** invent localhost |
| `OPENCODE_AUTO_TUI_DISPATCH_UNSUPPORTED` | **Umbrella only** when all limbs exhausted / host truly cannot dispatch |
| `OPENCODE_AUTO_SLASH_LISTING_UNSUPPORTED` | Unchanged BUG-0021 — compose |
| `OPENCODE_AUTO_CLI_TUI_PLUGIN_LOAD_UNSUPPORTED` | Unchanged BUG-0021 — compose |
| `OPENCODE_AUTO_MARKDOWN_COLLISION` | Unchanged BUG-0018 — **not** for dispatch-miss |
| `OPENCODE_AUTO_DESKTOP_COMMAND_INFO_LISTING_UNSUPPORTED` | Unchanged BUG-0020 — **do not reuse** for CLI TUI dispatch |

Closed set: five stage codes + one umbrella. Do not proliferate further tokens without a new research lock.

### Supersede note — `# BUG-0023` live happy-path claim (LOCKED)

| Prior lock | New lock (this section) |
|------------|-------------------------|
| `# BUG-0023`: DISPATCH only when client/RPC truly absent; Axis A files + mock-invoke = dispatch proof | **SUPERSEDED for live CLI TUI operator outcome.** Axis A compose remains. Live residual requires peer brand + stage codes + register-skip honesty. |
| `# BUG-0023` local identity-define as load-safe fallback | **Compose for orchestrator load.** **Not** sufficient for TUI `client.rpc(Defined)` success. |
| Silent skip when `ctx.rpc.register` absent | **Rejected** — emit `OPENCODE_AUTO_TUI_REGISTER_SKIPPED` |
| Catch-all→DISPATCH as only diagnostic | **Rejected** — stage codes first; DISPATCH umbrella last |

Historical `# BUG-0023` / `# BUG-0021` bodies remain shipped evidence. Readers must follow **this** section for **live CLI TUI `/auto` dispatch after Axis A**.

## Design challenge (assumptions / simpler / risks)

- **Alternative to peer brand?** Keep identity-define as TUI happy path. Live-falsified (H2/H5). **Rejected.**
- **Alternative diagnostics?** Keep catch-all DISPATCH only. Fails AC-2 / AC-6 (mock gap). **Rejected.**
- **Alternative listing reshape?** Switch TUI to `Plugin.define` so docs `context.client.rpc` matches. Re-breaks BUG-0021 listing. **Rejected.**
- **Can this be simpler?** Restoring `auto.md` looks smaller and recreates BUG-0018. Client-pass-through-only (A2) misses branding/register. A1 is the simplest design that meets D1/D8/D9 and R-0140 A*.
- **Governance fork?** Live residual of already-accepted Axis A contract — not a DEC-class product fork. **`decision_gate=false`**. No companion DEC.

## Components

### Peer-branded Defined (DQ3)

`rpc.ts` (active + template):

- Prefer `import` / dynamic resolve of `@opencode/plugin/rpc` `Rpc.define`.
- Keep local identity-`define` so orchestrator/`editor.add` still loads when peer missing.
- Export a **detectable brand signal** (architecture pin for execute): e.g. module-level `ITS_MAGIC_AUTO_RPC_PEER_BRANDED: boolean` or branded Symbol/property on Defined — tests assert TUI happy path requires brand true.

### TUI dispatch (DQ1, DQ2, DQ5, DQ6)

Keep `{ id, tui }` + `run()` → `dispatchRunAutoLifecycle({ api, client: api?.client }, input)`.

Rewrite fail-closed branches to emit locked stage tokens per limb order above. Remove catch-all→DISPATCH as the sole body for missing client / unbranded / no baseUrl / rpc throw.

Never SessionPrompt. Never Command.Info `template`. Never LLM chat. Never invented POST `{ input }`. Never silent localhost.

### Orchestrator register honesty (DQ4)

Keep `await ctx.rpc.register(ITS_MAGIC_AUTO_RPC, { runAutoLifecycle })` when register exists; keep `editor.add`.

When `ctx.rpc.register` absent: emit **`OPENCODE_AUTO_TUI_REGISTER_SKIPPED`** (session-visible notice compatible with BUG-0020/0021 emit style — not TUI-toast-only required; must be test-observable). Do **not** treat skip as success.

### Consumer upgrade / parity (DQ9)

`its-magic --mode upgrade --host opencode|both`:

- **Overwrite** framework-owned `tui.ts`, `rpc.ts`, and orchestrator register/skip-honesty limb via existing copy helpers.
- `tui.json`: keep BUG-0020 copy-if-absent / JSONC merge; **do not** wholesale overwrite operator theme/keybinds.
- Still run `prune_retired_opencode_auto_md`. Do **not** restore `auto.md`. Do **not** prune `.cursor/commands/auto.md` or `.opencode/agents/auto.md`.

Extend `check_intake_template_parity.py` with additive `BUG0024_PAIRS` for touched dispatch surfaces (keep `BUG0023_PAIRS` / `BUG0021_PAIRS` / …).

Runbook recipe: (1) upgrade to the BUG-0024 release; (2) `its-magic --mode upgrade --host opencode|both`; (3) restart OpenCode CLI TUI (`opencode`, **not** `--pure`); (4) listed `/auto` **starts** `runAutoLifecycle` — or honest stage/umbrella code only when host truly cannot dispatch. Cursor IDE `/auto` remains working path until fix — **not** done. `--pure` out of scope.

## Test contract (DQ8 — eight markers)

Preferred file: `tests/bug0024_opencode_cli_tui_live_dispatch_residual_test.py` (+ small node harness/fixture that **invokes** `dispatchRunAutoLifecycle` / `run()` / register-skip path against fakes). **No live OpenCode CLI TUI probe** in default CI (`UAT_PROBE_FORBIDDEN`). Markers must **fail current tree** / BUG-0023 mock-only gap.

| # | Marker | Asserts |
|---|--------|---------|
| 1 | `test_bug0024_run_missing_api_client_distinct_code` | `{ api }` without `api.client` → `OPENCODE_AUTO_TUI_MISSING_CLIENT` (not silent umbrella-only) |
| 2 | `test_bug0024_local_unbranded_defined_not_happy_path` | Identity-define Defined does **not** count as TUI success; emits `OPENCODE_AUTO_TUI_DEFINED_UNBRANDED` |
| 3 | `test_bug0024_register_skipped_observable` | Absent `ctx.rpc.register` surfaces `OPENCODE_AUTO_TUI_REGISTER_SKIPPED` (not silent) |
| 4 | `test_bug0024_make_unreachable_without_baseurl` | Client without `.rpc` and without `baseUrl` → `OPENCODE_AUTO_TUI_MAKE_UNREACHABLE`; never invent localhost |
| 5 | `test_bug0024_swallowed_rpc_error_not_only_dispatch` | `client.rpc` throw maps to stage code before umbrella DISPATCH |
| 6 | `test_bug0024_keep_editor_add_no_auto_md` | Compose D3/D4: `editor.add` present; no OpenCode `auto.md`; no JSON `commands.auto`+`template` |
| 7 | `test_bug0024_active_template_parity` | AC-8 dispatch-path byte-parity |
| 8 | `test_bug0024_upgrade_copies_dispatch_still_prunes_auto_md` | AC-7 overwrite + prune |

Keep `test_bug0023_*` / `test_bug0021_*` / `test_bug0020_*` / `test_bug0019_*` / `test_bug0018_*` green — additive only.

## Touch surfaces (execute)

| Surface | Change |
|---------|--------|
| `.opencode/plugins/its-magic-auto/rpc.ts` + template | Peer-brand signal; keep local define for load-safe orchestrator |
| `.opencode/plugins/its-magic-auto/tui.ts` + template | Stage-distinct codes; limb order; keep `{ id, tui }` |
| `.opencode/plugins/orchestrator.ts` + template | Register-skipped honesty; keep `editor.add` + await register when present |
| `.opencode/plugins/its-magic-auto/index.ts` | **Keep** server `Plugin.define`; no `tui` export |
| `.opencode/commands/auto.md` + template | **Stay absent** |
| OpenCode JSON `commands.auto` | **Do not add** |
| `installer.py` + `installer.sh` + `installer.ps1` | Overwrite dispatch path; keep targeted `auto.md` prune |
| `scripts/check_intake_template_parity.py` | Additive `BUG0024_PAIRS` |
| `tests/bug0024_*` | 8 markers |
| `tests/bug0023_*` / `0021` / `0020` / `0019` / `0018` | Unchanged compose |
| `docs/engineering/runbook.md` (+ template) | Live-dispatch residual recipe + stage-code table + `--pure` out |

## Non-goals

- Allocate a companion DEC / rewrite `# BUG-0023` / `# BUG-0021` / `# BUG-0019` / `# BUG-0018` bodies
- Reopen BUG-0023 / BUG-0021 / BUG-0020 / BUG-0019 / BUG-0018 ACs / S0148
- Restore STOP-only / empty `auto.md`
- JSON `commands.auto` template
- Merge/drain BUG-0022; drain BUG-0027
- Mutate US-0133..US-0150 as new scope
- Cursor `/auto` as the product done definition
- Claim `/auto` under `--pure`
- Live OpenCode CLI TUI probe in default CI
- Touch `.cursor/commands/auto.md` or `.opencode/agents/auto.md`
- Treat DISPATCH toast as success
- Silent `localhost:4096`
- Top-level `import "@opencode/plugin/rpc"` from the TUI default-export module (listing regression risk — keep dynamic import inside dispatch)

## Risks

| Risk | Severity | Mitigation |
|------|----------|------------|
| R1 Stage-code proliferation vs AC-2 DISPATCH semantics | MEDIUM | Closed set of five stage + one umbrella; DISPATCH last |
| R2 Peer `@opencode/plugin/rpc` absent on consumer hosts | MEDIUM | Distinct Defined-unbranded; orchestrator still loads via local define; Cursor working path until fix |
| R3 Register-skipped confuses operators | LOW | Document as honest residual; runbook |
| R4 Tests overfit mock and miss live again | MEDIUM | Markers target BUG-0023 gap (missing client / unbranded / register-skip / no baseUrl / swallowed rpc); UAT_PROBE_FORBIDDEN held |
| R5 Upgrade leaves pre-BUG-0024 `tui.ts` (copy-if-absent) | MEDIUM | Marker 8 asserts **overwrite** |
| R6 Accidental reopen of BUG-0023/0021 | LOW | Sibling boundary + non-goals; compose-only tests |

## AC coverage mapping (bug acceptance + R-0140)

| AC | Architecture owner | Seeds / tests |
|----|-------------------|----------------|
| AC-1 | A1 limb order + peer brand + lifecycle start | T-001..T-004; markers 1–5 |
| AC-2 | DISPATCH umbrella-only | T-004; marker 5 |
| AC-3 | No `auto.md` restore | T-anch, T-005 m6 |
| AC-4 | No JSON template | T-005 m6 |
| AC-5 | `editor.add` retained | T-002, T-005 m6 |
| AC-6 | Eight `test_bug0024_*` catch live miss | T-005 |
| AC-7 | Upgrade overwrite + prune | T-006, T-005 m8 |
| AC-8 | Active↔template parity | T-007, T-005 m7 |

Acceptance checkbox: `docs/product/acceptance.md` BUG-0024 row remains unchecked until closure (US-0045). Status stays **OPEN**.

## Atomic task seeds (for `/sprint-plan` → **S0159**)

| # | Seed | Surfaces |
|---|------|----------|
| T-anch | Verify `# BUG-0024` H1 + A1 + R-0140 DQ1–DQ10 + `# BUG-0023` live claim superseded + no companion DEC + do not rewrite `# BUG-0023`/`# BUG-0021` + do not reopen 0023/0021 + do not merge 0022 + do not drain 0027 | architecture.md, R-0140 (read-only) |
| T-001 | Peer-brand signal on `ITS_MAGIC_AUTO_RPC`; keep local identity-define for orchestrator load; TUI happy path requires brand | `rpc.ts` (active + template) |
| T-002 | Orchestrator: keep await register + `editor.add`; emit `OPENCODE_AUTO_TUI_REGISTER_SKIPPED` when register absent | `orchestrator.ts` (active + template) |
| T-003 | `dispatchRunAutoLifecycle` limb order + stage tokens (missing-client / rpc-absent / Defined-unbranded / make-unreachable / swallowed-rpc); keep `{ id, tui }` | `tui.ts` (active + template) |
| T-004 | DISPATCH umbrella only when limbs exhausted; never silent localhost; do not reuse listing/load/desktop/markdown tokens | `tui.ts` + runbook |
| T-005 | Add 8 `test_bug0024_*` markers; no live OpenCode probe in default CI; do not weaken 0023/0021/0020/0019/0018 except compose-only | `tests/bug0024_*.py` (+ harness) |
| T-006 | Upgrade `--host opencode\|both` **overwrites** live dispatch path on Axis-A trees; still **prunes** leftover `auto.md` | installer.py/sh/ps1 + owned-paths |
| T-007 | Runbook live-dispatch residual recipe + stage-code table + `--pure` out + active↔template parity + `BUG0024_PAIRS` | runbook + template + `check_intake_template_parity.py` |

**Task count**: 8 seeds (T-anch + T-001..T-007). `SPRINT_MAX_TASKS=12` — no auto-split. Not `/quick`. Sprint-plan owns **S0159** materialization — **this phase does not create `sprints/S0159/`**. Eight `test_bug0024_*` named above.

## Decision linkage

- Decision: **none** (companion DEC not required — cite **R-0140** / this `# BUG-0024`)
- Compose (do not amend bodies): **DEC-0124**, **DEC-0125**, **DEC-0120**, **DEC-0132** (preserve paths — `tui.ts`/`rpc.ts` framework-owned overwrite; `tui.json` merge-safe)
- Research: **R-0140** (composes **R-0137** / **R-0136** / **R-0134** / **R-0124**; do not wipe; **no new R-id**)
- Related: **US-0124**, **US-0125**, **US-0069**; **BUG-0023** / **BUG-0021** / **BUG-0020** / **BUG-0019** / **BUG-0018** DONE — out of reopen scope; **BUG-0022 OPEN** / **BUG-0027 OPEN** — not mutated

## Isolation evidence (US-0048 / DEC-0029)

- `phase_id=architecture`, `role=tech-lead`, `bug_id=BUG-0024`, `sprint_id=none` (S0159 expected at sprint-plan)
- `delivery_mode=ultra_lean`, `macro_phase=plan`, `model_id=inherit` (CROSS_MODEL_REVIEW=0)
- `fresh_context_marker=tl-BUG0024-architecture-20260921T194300Z-fresh`, `timestamp=2026-09-21T19:43:00Z` (UTC)
- `orchestrator_run_id=auto-20260921-bug0024`, `parent_orchestrator_run_id=cursor-20260913-BUG0024-intake`
- `evidence_ref=docs/engineering/research.md ## R-0140; docs/product/backlog.md ### BUG-0024; docs/engineering/architecture.md (this # BUG-0024); handoffs/resume_brief.md; handoffs/po_to_tl.md`
- Fresh tech-lead subagent per BUG-0006; narrow-read only. No `.env`. No companion DEC. No `sprints/S0159/`. No Status/AC mutation. No `/sprint-plan` spawn. No npm-publish. No git push. No sovereign-critic (CROSS_MODEL_REVIEW=0). No auto.md restore. No BUG-0023/0021 reopen. No BUG-0022/0027 drain.

## Strict runtime proof

- `runtime_proof_id=rp-auto-20260921-bug0024-architecture-techlead-20260921T194300Z-BUG-0024`
- Hash via `scripts.token_cost_lib.compute_strict_proof_hash` (positional; compact sorted-key JSON).
- Canonical hashed payload: `{"orchestrator_run_id":"auto-20260921-bug0024","phase_id":"architecture","proof_issued_at":"2026-09-21T19:43:00Z","proof_ttl_seconds":3600,"role":"tech-lead","runtime_proof_id":"rp-auto-20260921-bug0024-architecture-techlead-20260921T194300Z-BUG-0024"}`
- Isolation extras (not hashed): `delivery_mode=ultra_lean`, `macro_phase=plan`, `model_id=inherit`, `sprint_id=none`, `bug_id=BUG-0024`, `skipped_phases=[intake]`, `CROSS_MODEL_REVIEW=0`, `native_chain_active=true`, `native_chain_continuing=true`, `segment_work_item_kind=bug`
- `proof_hash=5EEEC943224DB73B7A19D222A2178522BFCFF3F00FAC3A1316973A3F464A8915`
- `proof_ttl=2026-09-21T20:43:00Z`
- `hash_recompute_confirmation=true` (compute_strict_proof_hash → 5EEEC943224DB73B7A19D222A2178522BFCFF3F00FAC3A1316973A3F464A8915; independently MATCH; **64 hex** verified)
- Consumed research proof: `rp-auto-20260921-bug0024-research-techlead-20260921T193700Z-BUG-0024` / `57F066B720A65F5BEE9E380EFB68F7CF1ADBACC9CDDEEEE6395B808D5F91A826` — RUNTIME_PROOF_VALID MATCH before TTL `2026-09-21T20:37:00Z` (consumed_at `2026-09-21T19:43:00Z`; not STALE)

# BUG-0027 — OpenCode manual phase commands cannot persist canonical workflow evidence

## Overview

**`BUG-0027`** closes the **manual OpenCode phase persist residual**: direct slash commands (`/intake`, `/execute`, `/qa`, `/verify-work`) can run a role but cannot persist canonical sprint/handoff artifacts plus IsolationEvidence linked to the current story/bug and sprint. `runAutoLifecycleRpc` drops `storyId`/`sprintId`/`orchestratorRunId` and defaults `orchestratorSessionId` to `tui-auto`; `command.executed` only handles `name === "auto"`; the deny-last permission matrix (compose **BUG-0016 DONE**) omits execute `state.md`/`summary.md` and QA `state.md`; command packs invoke `intake_evidence_validate.py --repo . --enforce` (exit 2; live CLI is `--file`/`--stdin`/`--self-test`).

Distinct from **BUG-0024 DONE** / **R-0140** / **S0159** (CLI/TUI `/auto` live dispatch — compose only; do **not** reopen ACs; do **not** claim toast repair), **BUG-0016 DONE** (permission matrix — additive globs only), **BUG-0022 OPEN** / **BUG-0026 OPEN** (do not merge/drain), **US-0150 OPEN** (compose/link only). **R-0150** / **R-0140** held — do not wipe.

**This section does not supersede `# BUG-0024`.** Toast path / `OPENCODE_AUTO_TUI_DISPATCH_UNSUPPORTED` remains that section. This section owns **manual** phase persist + identity fields on IsolationEvidence (including `/auto` RPC forwarding IDs as AC-3 context-propagation, not toast repair).

**Research anchor**: **`R-0151`** (DQ1–DQ10 LOCKED). **Companion DEC**: **none** (same class as BUG-0019/0020/0021/0023/0024/0025). **EARLY_RESEARCH=0** — no new `R-xxxx`. **Out of scope**: reopen BUG-0024 / S0159; restore `auto.md`; route manual phases through `runAutoLifecycle`; add `--repo --enforce` to the Python intake CLI; second persist store; fabricate proofs; merge/drain BUG-0022/0026; mutate US-0150 as this bug's implementation; rewrite `.cursor/commands/`.

**Fresh context marker**: `tl-BUG0027-architecture-20260921T212200Z-fresh`
**Orchestrator run id**: `auto-20260921-bug0027`
**Parent**: `ir-20260921T190544Z-bug0027`
**Timestamp**: 2026-09-21T21:22:00Z (UTC)
**Verdict**: PASS (`decision_gate=false`)
**Next**: `/sprint-plan` (expected **S0160** — do **not** create this phase)
**baseline_h2_count (pre-mutate)**: `0`

## Approach locked (A1 Hybrid manual-phase persist — from R-0151 DQ1–DQ10)

**Approach A1 (A\*)** (locked): extend shared IsolationEvidence + `persistIsolationViaPython` with real story/sprint/run/bug IDs (one Python SOT `docs/engineering/state.md`); invoke that helper from a thin **`persistManualPhaseIsolation`** (not `runAutoLifecycle` drain); carry parent `sessionID` from `command.executed` / RPC (never default `tui-auto` for release evidence); targeted permission-matrix widen plus fail-closed-before-work; rewrite OpenCode command packs to supported validator CLI; no fabricated proofs.

1. **Identity fields (DQ2)**: extend `IsolationEvidence` with optional `storyId`, `sprintId`, `orchestratorRunId`, `bugId`. `spawnPhase` must **copy** those fields (today it drops them). `persistIsolationViaPython` + `scripts/opencode_auto_bridge.py --append-isolation` accept `--story-id` / `--sprint-id` / `--orchestrator-run-id` / `--bug-id`. Reject a second persist store (`ctx.storage`, sidecar JSON).
2. **Manual invoker (DQ1)**: `persistManualPhaseIsolation(ctx, event|args)` builds IsolationEvidence and calls the same Python helper. `/auto` keeps `runAutoLifecycle` → persist. Shared helper, distinct invokers. Do **not** route `/intake` `/execute` `/qa` `/verify-work` through `runAutoLifecycle`.
3. **Command names (LOCKED)**: persist limb fires when `command.executed` `name` is in `MANUAL_PHASE_COMMAND_NAMES` = `intake`, `discovery`, `research`, `architecture`, `sprint-plan`, `plan-verify`, `execute`, `qa`, `verify-work`, `release`, `refresh-context`, `closure`. `auto` stays on the lifecycle drain. AC-1 required set is `intake`/`execute`/`qa`/`verify-work`; the closed set above is the execute pin so discovery/research/etc. do not stay persist-blind.
4. **Context chain (DQ1)**: parent `sessionID` from `command.executed` / RPC / tool context. `storyId`/`sprintId`/`orchestratorRunId` from (1) event/RPC arguments when present, else (2) Python bridge reading `handoffs/resume_brief.md` / `docs/engineering/state.md` (same parser as `selectFirstPhaseViaPython` / `_parse_resume_brief`). Never default `orchestratorSessionId` to `tui-auto`.
5. **RPC forward (AC-3, not toast)**: `runAutoLifecycleRpc` forwards `storyId`/`sprintId`/`orchestratorRunId`; missing `sessionID` → `OPENCODE_MANUAL_PHASE_CONTEXT_MISSING` (do not substitute `tui-auto`). TUI dispatch toast path **unamended**.
6. **Reject placeholders (DQ6)**: `tui-auto` as **either** `parentID` **or** `orchestratorRunId` fail-closes with `OPENCODE_PLACEHOLDER_PARENT_REJECTED` and is **not** written to `state.md`. Missing real session/run context → `OPENCODE_MANUAL_PHASE_CONTEXT_MISSING`; do not invent IDs or proof tuples.
7. **Permissions (DQ3 hybrid)**: targeted glob widen, deny-last held (compose BUG-0016 — do not reopen; do not `edit: allow` all):
   - **dev**: add `docs/engineering/state.md` and `sprints/S*/summary.md`
   - **qa**: add `docs/engineering/state.md`
   - PO already allows `state.md`
8. **Fail-closed (DQ3)**: if a required write is still denied, STOP **before work** with `OPENCODE_MANUAL_PHASE_WRITE_DENIED`. After work, persist non-ok → `OPENCODE_MANUAL_PHASE_PERSIST_DENIED` and **no success claim**. If persist never ran by STOP (R-0119) → `OPENCODE_MANUAL_PHASE_PERSIST_NOT_INVOKED`. Plugin does **not** copy the permission array (DEC-0124 compose).
9. **Secondary trigger (optional defense)**: `tool.execute.after` / `session.idle` may invoke the **same** `persistManualPhaseIsolation` if `command.executed` did not fire; mutex so dual-fire does not double-append. Not a second persist store.
10. **Validator packs (DQ4/DQ5)**: rewrite OpenCode `intake.md` (active + template) to `--file`/`--stdin`/`--self-test`. Drop intake validator from `execute.md` and `discovery.md`. Keep `qa.md` / `verify-work.md` `bug_issue_validate.py --repo . --check-acceptance` (valid). Do **not** add `--repo --enforce` to `intake_evidence_validate.py`. Cursor `.cursor/commands/` **OUT**. Compose-amend US-0125 fixture named-CLI (ACs stay DONE).
11. Ten additive `test_bug0027_*` (below). Keep `test_bug0024_*` / `test_us0124_*` / `test_us0125_*` compose.
12. Upgrade `--host opencode|both` **overwrites** touched OpenCode pack/plugin/bridge paths.

| Option | Summary | Verdict |
|--------|---------|---------|
| **A1 Hybrid manual-phase persist** | Context-propagation + shared IsolationEvidence helper + targeted glob widen + fail-closed + supported validator packs | **Preferred / LOCKED** |
| A2 Persist-hook only | Only expand `command.executed` names | **Rejected** — IDs still dropped; permissions still deny; validator still invalid |
| A3 Permission widen only | Only add globs | **Rejected** — persist never invoked; context still `tui-auto` |
| A4 Fail-closed-only | Precise errors, no success path | **Rejected** — AC-1/AC-2 require a usable fallback |
| A5 Second persist store | `ctx.storage` / sidecar JSON | **Rejected** — state.md remains SOT |
| A6 Route manual phases through `runAutoLifecycle` | Treat `/execute` as auto drain | **Rejected** — `/auto` remains BUG-0024; would start the lifecycle loop |
| A7 Add `--repo --enforce` to Python CLI | Dual interface | **Rejected** — D5; Cursor packs already correct |

### Locked tokens (architecture-owned — DQ3/DQ6)

| Code | When |
|------|------|
| `OPENCODE_MANUAL_PHASE_WRITE_DENIED` | Required glob still denied — fail **before work** |
| `OPENCODE_MANUAL_PHASE_PERSIST_DENIED` | `persistIsolationViaPython` / bridge non-ok after work — no success claim |
| `OPENCODE_MANUAL_PHASE_PERSIST_NOT_INVOKED` | Persist never ran by STOP (R-0119 / missing `command.executed`) |
| `OPENCODE_PLACEHOLDER_PARENT_REJECTED` | `tui-auto` as `parentID` or `orchestratorRunId` — do not write evidence |
| `OPENCODE_MANUAL_PHASE_CONTEXT_MISSING` | Real session and/or story/sprint/run ids missing — do not invent |

Closed set: five tokens. Do not proliferate without a new research lock. Do **not** reuse BUG-0024 `OPENCODE_AUTO_TUI_*` tokens for this miss.

Existing compose tokens stay unchanged: `OPENCODE_AUTO_TUI_DISPATCH_UNSUPPORTED`, `OPENCODE_SUBTASK_IGNORED`, `OPENCODE_DRIVER_INVOKE_FAILED`, BUG-0016 deny-last.

### Helper + field pins (LOCKED)

| Name | Pin |
|------|-----|
| `persistManualPhaseIsolation` | Thin invoker for manual phase commands; builds IsolationEvidence; calls `persistIsolationViaPython` |
| `persistIsolationViaPython` | Shared durable write; extended argv for identity fields; still Python SOT |
| `IsolationEvidence` | Existing `parentID`, `sessionID`, `role`, `phase_id`, `timestamp`, `fresh_context_marker` **plus** `storyId?`, `sprintId?`, `orchestratorRunId?`, `bugId?` |
| `MANUAL_PHASE_COMMAND_NAMES` | Closed list above; `auto` excluded |
| Python `--append-isolation` | Add `--story-id`, `--sprint-id`, `--orchestrator-run-id`, `--bug-id` |

## Design challenge (assumptions / simpler / risks)

- **Alternative persist path?** Route `/execute` through `runAutoLifecycle`. Starts the auto drain loop and collides with BUG-0024. **Rejected.**
- **Alternative store?** `ctx.storage` or sidecar JSON looks smaller and forks the audit SOT. **Rejected.**
- **Alternative permissions?** Fail-closed-only without glob widen leaves AC-1/AC-2 success unusable. Widen-only leaves H1 persist miss. Hybrid is the simplest design that meets both.
- **Alternative validator?** Adding `--repo --enforce` to Python papers over the pack bug and forks Cursor-correct CLI. **Rejected.**
- **Can this be simpler?** Expanding only `command.executed` names is smaller and still drops IDs / denies writes / ships invalid CLI. A1 is the smallest design that meets D1–D8 and R-0151 A*.
- **Governance fork?** Residual of already-accepted IsolationEvidence / BUG-0016 matrix / US-0125 CLI — not a DEC-class product fork. **`decision_gate=false`**. No companion DEC.

## Components

### IsolationEvidence + Python bridge (DQ2)

`.opencode/plugins/orchestrator.ts` + template + `scripts/opencode_auto_bridge.py` (+ template):

- Add identity fields to the TypeScript interface and to `--append-isolation`.
- `spawnPhase` copies `storyId`/`sprintId`/`orchestratorRunId`/`bugId` onto evidence (stop dropping).
- `persistIsolationViaPython` rejects `tui-auto` before spawn; maps persist failure to `OPENCODE_MANUAL_PHASE_PERSIST_DENIED` (keep `OPENCODE_SUBTASK_IGNORED` for identical parent/session).
- Durable SOT remains `docs/engineering/state.md` (US-0048 / DEC-0029).

### Manual persist invoker (DQ1)

`persistManualPhaseIsolation`:

- Input: plugin ctx + `command.executed` payload (or RPC/tool `sessionID`).
- Resolve IDs via the context chain above.
- Fail closed with locked tokens; never invent proof tuples.
- `/auto` continues to persist via `runAutoLifecycle` using the **same** Python helper.

Optional secondary: `tool.execute.after` / `session.idle` → same function, mutex-guarded.

### Permission matrix (DQ3)

`.opencode/agents/dev.md` + `qa.md` + template mirrors: additive globs only; `"**": deny` last. Tests assert deny-default still holds for unrelated paths.

Fail-closed-before-work lives in command-pack prose + persist helper, **not** a duplicated permission array in the plugin (DEC-0124).

### Command packs (DQ4 / DQ5)

Stay ≤20 lines (US-0125 compose). Exact Validator-bridge rewrite:

- **intake.md** (active + template): `python scripts/intake_evidence_validate.py --file <bundle.json>` (or `--stdin` / `--self-test`). Remove `--repo . --enforce`. Persist sentence names `persistManualPhaseIsolation` (today's "plugin enforces persistence" is false until this bug ships).
- **execute.md** / **discovery.md**: drop `intake_evidence_validate` entirely. Optional isolation-persist sentence only.
- **qa.md** / **verify-work.md**: keep `bug_issue_validate.py --repo . --check-acceptance`.
- `.cursor/commands/` **OUT**.

### Consumer upgrade / parity (DQ9)

`its-magic --mode upgrade --host opencode|both` **overwrites** framework-owned OpenCode commands/agents/orchestrator/bridge paths via existing copy helpers. Do **not** overwrite Cursor command packs.

Extend `check_intake_template_parity.py` with additive `BUG0027_PAIRS` (keep `BUG0024_PAIRS`).

Runbook: one-line correction of the stale `intake_evidence_validate.py --repo . --enforce` stub (US-0125 compose; do not reopen US-0125 ACs). Recipe: (1) upgrade to the BUG-0027 release; (2) `its-magic --mode upgrade --host opencode|both`; (3) restart OpenCode; (4) direct `/execute` (or `/intake`) persists isolation with real IDs — or honest locked code. `/auto` toast remains BUG-0024.

US-0125 fixture + `test_us0125_validator_subprocess_fail_closed` named-CLI: compose-amend to supported invocation (contract evolution; ACs stay DONE).

## Test contract (DQ8 — ten markers)

Preferred file: `tests/bug0027_opencode_manual_phase_persist_test.py` (+ small node harness/fixture that mocks `command.executed` / RPC against fakes). **No live OpenCode CLI TUI probe** in default CI (`UAT_PROBE_FORBIDDEN`). Markers must **fail current tree**.

| # | Marker | Asserts |
|---|--------|---------|
| 1 | `test_bug0027_manual_phase_persists_isolation` | `/execute` (or `/intake`) mock `command.executed` with real `sessionID` + story/sprint/run → IsolationEvidence append includes those IDs (AC-1, AC-2, AC-3) |
| 2 | `test_bug0027_denied_persist_not_success` | Persist helper non-ok → phase result `ok: false` with `OPENCODE_MANUAL_PHASE_PERSIST_DENIED`; no success claim (AC-2) |
| 3 | `test_bug0027_rpc_forwards_story_sprint_run` | `runAutoLifecycleRpc` no longer drops IDs (AC-3) |
| 4 | `test_bug0027_tui_auto_rejected_as_release_evidence` | `tui-auto` as parentID or orchestratorRunId fail-closes `OPENCODE_PLACEHOLDER_PARENT_REJECTED`; not written as evidence (AC-3, DQ6) |
| 5 | `test_bug0027_no_fabricated_proof_when_orchestrator_unavailable` | Missing orchestrator/run context → `OPENCODE_MANUAL_PHASE_CONTEXT_MISSING`; no invented proof tuple (AC-4) |
| 6 | `test_bug0027_auto_tui_toast_not_claimed` | Dispatch toast / `OPENCODE_AUTO_TUI_DISPATCH_UNSUPPORTED` path **unchanged** (AC-4; compose BUG-0024) |
| 7 | `test_bug0027_validator_invocation_file_stdin_not_repo_enforce` | Active+template command packs contain no `intake_evidence_validate.py --repo . --enforce`; intake uses `--file`/`--stdin`/`--self-test` (AC-5) |
| 8 | `test_bug0027_non_intake_packs_drop_intake_validator` | execute.md / discovery.md do not require intake_evidence_validate (AC-5, DQ5) |
| 9 | `test_bug0027_active_template_parity` | Touched OpenCode commands/agents/plugin/bridge byte-parity (AC-6) |
| 10 | `test_bug0027_permission_matrix_phase_writes` | Dev allows `state.md` + `summary.md`; qa allows `state.md`; deny-last held (AC-1, DQ3) |

Keep `test_bug0024_*` / `test_us0124_*` / `test_us0125_*` green — additive only except the named US-0125 CLI compose-amend owned by marker 7.

## Touch surfaces (execute)

| Surface | Change |
|---------|--------|
| `.opencode/plugins/orchestrator.ts` + template | IsolationEvidence fields; `persistManualPhaseIsolation`; RPC forward; `command.executed` manual-phase limb; `spawnPhase` copy IDs; do **not** change TUI toast path |
| `scripts/opencode_auto_bridge.py` + template | `--append-isolation` identity fields |
| `.opencode/agents/{dev,qa}.md` + template | Targeted glob widen; deny-last held |
| `.opencode/commands/{intake,execute,discovery}.md` + template | Validator rewrite / drop; persist sentence truthful |
| `.opencode/commands/{qa,verify-work}.md` + template | Keep `bug_issue_validate.py --repo . --check-acceptance` |
| `.cursor/commands/` | **OUT** |
| `tests/us0125_contract_test.py` + `tests/us0125/fixtures/validator_artifact_mapping.json` | Compose-amend named CLI to supported invocation |
| `scripts/check_intake_template_parity.py` | Additive `BUG0027_PAIRS` |
| `tests/bug0027_*` | 10 markers |
| `tests/bug0024_*` / `us0124_*` / `us0125_*` | Unchanged compose (except US-0125 CLI amend) |
| `docs/engineering/runbook.md` (+ template) | One-line validator stub correction + manual-phase persist recipe |
| `installer.py` / `installer.sh` / `installer.ps1` | Overwrite touched OpenCode pack paths |

## Non-goals

- Allocate a companion DEC / rewrite `# BUG-0024` / `# BUG-0023` / R-0140 / R-0150
- Reopen BUG-0024 ACs / S0159; claim CLI/TUI `/auto` toast repair
- Restore STOP-only / empty `auto.md`; JSON `commands.auto` template
- Route manual phases through `runAutoLifecycle`
- Add `--repo --enforce` to `intake_evidence_validate.py`
- Second persist store (`ctx.storage`, sidecar JSON)
- Fabricate strict-proof tuples when orchestrator/run context is missing
- Merge/drain BUG-0022 / BUG-0026
- Mutate US-0150 as this bug's implementation
- Rewrite `.cursor/commands/`
- Reopen BUG-0016 / US-0125 ACs
- Live OpenCode CLI TUI probe in default CI
- Create `sprints/S0160/` this phase

## Risks

| Risk | Severity | Mitigation |
|------|----------|------------|
| R1 `command.executed` does not fire for markdown commands (R-0119) | MEDIUM | Fail-closed `OPENCODE_MANUAL_PHASE_PERSIST_NOT_INVOKED`; optional secondary `tool.execute.after` / `session.idle`; marker 2 |
| R2 Permission widen looks like reopening BUG-0016 | LOW | Additive globs only; deny-last held; marker 10 |
| R3 US-0125 fixture compose-amend looks like reopen | LOW | Additive `test_bug0027_*` own the new CLI; US-0125 ACs stay DONE; document as contract evolution |
| R4 RPC ID forward confused with BUG-0024 toast work | MEDIUM | Marker 6 asserts toast path unchanged; `/auto` drain loop unamended |
| R5 Fabricated proofs under unavailable orchestrator | HIGH | Marker 5; helper refuses `tui-auto` and missing run ids |
| R6 Dual-fire double-append isolation | LOW | Mutex on persist invoker; `/auto` remains distinct |

## AC coverage mapping (bug acceptance + R-0151)

| AC | Architecture owner | Seeds / tests |
|----|-------------------|----------------|
| AC-1 | Persist-eligible names + glob widen + fail-closed-before-work | T-002, T-004; markers 1, 10 |
| AC-2 | Persist-or-not-success | T-002, T-001; marker 2 |
| AC-3 | Real session/run IDs; reject `tui-auto` | T-001, T-003; markers 1, 3, 4 |
| AC-4 | `/auto` remains BUG-0024; no fabricated proofs | T-anch, T-003; markers 5, 6 |
| AC-5 | Supported validator CLI; drop from non-intake | T-005; markers 7, 8 |
| AC-6 | Contract tests + active/template parity | T-006, T-007; markers 1–10 |

Acceptance checkbox: `docs/product/acceptance.md` BUG-0027 row remains unchecked until closure (US-0045). Status stays **OPEN**.

## Atomic task seeds (for `/sprint-plan` → **S0160**)

| # | Seed | Surfaces |
|---|------|----------|
| T-anch | Verify `# BUG-0027` H1 + A1 + R-0151 DQ1–DQ10 + no companion DEC + do not rewrite `# BUG-0024` + do not reopen 0024 + do not claim toast repair + do not merge 0022/0026 + do not wipe R-0150/R-0140 | architecture.md, R-0151 (read-only) |
| T-001 | IsolationEvidence identity fields; `spawnPhase` copy; `persistIsolationViaPython` + `--append-isolation` `--story-id`/`--sprint-id`/`--orchestrator-run-id`/`--bug-id` | `orchestrator.ts` + `opencode_auto_bridge.py` (active + template) |
| T-002 | `persistManualPhaseIsolation` + `command.executed` limb for `MANUAL_PHASE_COMMAND_NAMES`; optional secondary event; **not** `runAutoLifecycle`; mutex vs double-append | `orchestrator.ts` (active + template) |
| T-003 | RPC/context forward; reject `tui-auto`; emit locked reason-code tokens; no fabricated proofs | `orchestrator.ts` `runAutoLifecycleRpc` + persist helper |
| T-004 | Permission glob widen (dev: `state.md` + `summary.md`; qa: `state.md`) + fail-closed-before-work; deny-last held | `.opencode/agents/{dev,qa}.md` + template |
| T-005 | Rewrite intake pack to `--file`/`--stdin`/`--self-test`; drop intake validator from execute.md/discovery.md; keep qa/verify-work `bug_issue_validate.py --repo . --check-acceptance` | `.opencode/commands/` + template |
| T-006 | Add 10 `test_bug0027_*` markers; no live OpenCode probe in default CI; do not weaken bug0024/us0124 except US-0125 CLI compose-amend | `tests/bug0027_*.py` (+ harness) |
| T-007 | US-0125 fixture named-CLI compose-amend + `BUG0027_PAIRS` + upgrade overwrite + runbook one-line validator stub correction | us0125 fixture + parity script + installer + runbook |

**Task count**: 8 seeds (T-anch + T-001..T-007). `SPRINT_MAX_TASKS=12` — no auto-split. Not `/quick`. Sprint-plan owns **S0160** materialization — **this phase does not create `sprints/S0160/`**. Ten `test_bug0027_*` named above.

## Decision linkage

- Decision: **none** (companion DEC not required — cite **R-0151** / this `# BUG-0027`)
- Compose (do not amend bodies): **DEC-0122** (permission matrix), **DEC-0124** / **DEC-0125** (plugin vs command.md), **DEC-0029** / **DEC-0038** (`compute_strict_proof_hash` tuple UNAMENDED)
- Research: **R-0151** (do not wipe **R-0150** / **R-0140**; **no new R-id**)
- Related: **US-0121**, **US-0122**, **US-0124**, **US-0125**, **US-0126**, **US-0150** compose/link; **BUG-0016 DONE** / **BUG-0024 DONE** — out of reopen scope; **BUG-0022 OPEN** / **BUG-0026 OPEN** — not mutated

## Isolation evidence (US-0048 / DEC-0029)

- `phase_id=architecture`, `role=tech-lead`, `bug_id=BUG-0027`, `sprint_id=none` (S0160 expected at sprint-plan)
- `delivery_mode=ultra_lean`, `macro_phase=plan`, `model_id=inherit` (CROSS_MODEL_REVIEW=0)
- `fresh_context_marker=tl-BUG0027-architecture-20260921T212200Z-fresh`, `timestamp=2026-09-21T21:22:00Z` (UTC)
- `orchestrator_run_id=auto-20260921-bug0027`, `parent_orchestrator_run_id=ir-20260921T190544Z-bug0027`
- `evidence_ref=docs/engineering/research.md ## R-0151; docs/product/backlog.md ### BUG-0027; docs/engineering/architecture.md (this # BUG-0027); handoffs/resume_brief.md; handoffs/po_to_tl.md`
- Fresh tech-lead subagent per BUG-0006; narrow-read only. No `.env`. No companion DEC. No `sprints/S0160/`. No Status/AC mutation. No `/sprint-plan` spawn. No npm-publish. No git push. No sovereign-critic (CROSS_MODEL_REVIEW=0). No BUG-0024 reopen. No toast-repair claim. No BUG-0022/0026 drain.

## Strict runtime proof

- `runtime_proof_id=rp-auto-20260921-bug0027-architecture-techlead-20260921T212200Z-BUG-0027`
- Hash via `scripts.token_cost_lib.compute_strict_proof_hash` (positional; compact sorted-key JSON).
- Canonical hashed payload: `{"orchestrator_run_id":"auto-20260921-bug0027","phase_id":"architecture","proof_issued_at":"2026-09-21T21:22:00Z","proof_ttl_seconds":3600,"role":"tech-lead","runtime_proof_id":"rp-auto-20260921-bug0027-architecture-techlead-20260921T212200Z-BUG-0027"}`
- Isolation extras (not hashed): `delivery_mode=ultra_lean`, `macro_phase=plan`, `model_id=inherit`, `sprint_id=none`, `bug_id=BUG-0027`, `skipped_phases=[intake]`, `CROSS_MODEL_REVIEW=0`, `native_chain_active=true`, `native_chain_continuing=true`, `segment_work_item_kind=bug`
- `proof_hash=766B032B5B6FEBFCC6524E30F4A94DEED4EFBCE14AB73F56D2DCBF893FEFE489`
- `proof_ttl=2026-09-21T22:22:00Z`
- `hash_recompute_confirmation=true` (compute_strict_proof_hash → 766B032B5B6FEBFCC6524E30F4A94DEED4EFBCE14AB73F56D2DCBF893FEFE489; independently MATCH; **64 hex** verified)
- Consumed research proof: `rp-auto-20260921-bug0027-research-techlead-20260921T211500Z-BUG-0027` / `F89D067B09A413B1AC41D5B7811EBAC8BC4CA4D6FCD7264BC2BFD7C3BFCD8782` — RUNTIME_PROOF_VALID MATCH before TTL `2026-09-21T22:15:00Z` (consumed_at `2026-09-21T21:22:00Z`; not STALE)

