# Architecture archive pack (2026-10-07)

- Rollover trigger: `ARCH_HOT_MAX_LINES=3000, ARCH_HOT_MAX_STORY_SECTIONS=120`
- Source: `docs/engineering/architecture.md`
- Archived units (oldest first, contiguous prefix): 14
- Retained units in hot file: 19
- First archived heading: `# BUG-0020 — OpenCode still has no invokable auto mode after BUG-0019 TUI keymap`
- Last archived heading: `# BUG-0023 — OpenCode CLI TUI listed `/auto` toasts OPENCODE_AUTO_TUI_DISPATCH_UNSUPPORTED (dispatch live-falsified)`
- Verification tuple (mandatory):
  - archived_body_lines=991
  - preamble_lines=1
  - retained_body_lines=2836

---

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

