# Architecture archive pack (2026-09-21)

- Rollover trigger: `ARCH_HOT_MAX_LINES=3000, ARCH_HOT_MAX_STORY_SECTIONS=120`
- Source: `docs/engineering/architecture.md`
- Archived units (oldest first, contiguous prefix): 1
- Retained units in hot file: 26
- First archived heading: `# BUG-0019 — OpenCode slash palette has no `/auto` after plugin-only ownership`
- Last archived heading: `# BUG-0019 — OpenCode slash palette has no `/auto` after plugin-only ownership`
- Verification tuple (mandatory):
  - archived_body_lines=221
  - preamble_lines=1
  - retained_body_lines=2860

---

# BUG-0019 — OpenCode slash palette has no `/auto` after plugin-only ownership

## Overview

**`BUG-0019`** closes the **listing residual** left after BUG-0018 A*: colliding `.opencode/commands/auto.md` is gone and plugin `editor.add({ name: "auto", execute })` → `runAutoLifecycle` is still registered, but the OpenCode TUI slash palette does **not** list `/auto` (operator screenshot 2026-09-12; peers with markdown files still listed). Distinct from **BUG-0015 DONE** (missing attach), **BUG-0017 DONE** (CRLF hid all commands), and **BUG-0018 DONE** (markdown-wins STOP — collision/STOP fix remains correct; do **not** reopen).

**This section supersedes `R-0120` DQ5** (“plugin `name`+`description` lists `/auto`”) **and `# BUG-0018` NB1** (markdown-only listing residual). Those listing claims are **live-falsified**. Do **not** rewrite the historical `# BUG-0018` body, **R-0120** body, **DEC-0124**, or **DEC-0125** (D8). Do **not** reopen BUG-0018 ACs.

**Research anchor**: **`R-0124`** (DQ1–DQ8 LOCKED; compose **R-0123** / **R-0120**; do not wipe). **Companion DEC**: **none** (do **not** allocate `DEC-0135`). **Out of scope**: Cursor `/auto`; US-0135+; reopen 0015/16/17/18; Axis A/B/C/D; restore STOP-only `auto.md`; JSON `commands.auto` template; live OpenCode CI probe (default out of CI, same as 0018); convert flat `orchestrator.ts` into a package.

**EARLY_RESEARCH confirm** (architecture 2026-09-12; no new `R-xxxx`): public OpenCode v2 CLI plugin docs still match R-0124 E* — project `.opencode/plugins/<name>/index.ts` + `tui.ts` auto-discovery; `cli.json` **not** required for discovered project plugins; TUI `context.keymap.layer` + `slash: { name }` + `run()`; `context.client` reaches the connected server. Internal `tui-plugins.md` (`tui.json`, no directory auto-discovery) is a MEDIUM residual (R2) — do **not** ship `tui.json` unless execute proves discovery fails; then fail-closed listing token, not a silent miss.

**Fresh context marker**: `tl-BUG0019-architecture-20260912T181000Z-fresh`
**Orchestrator run id**: `auto-20260912-bug0019`
**Timestamp**: 2026-09-12T18:15:00Z (UTC)
**Verdict**: PASS
**Next**: `/sprint-plan`

## Approach locked (E1 / E* — from R-0124 Axis E* / DQ1–DQ8)

**Approach E1** (locked; named **E\***): **TUI keymap slash listing + retained plugin execute**. Listing = project-local TUI/CLI plugin keymap layer `slash.name` / `slashName` = `"auto"` whose `run()` is a function (not a Command.Info prompt template). Execute owner remains server plugin `command.transform` → `editor.add({ name: "auto", execute })` → `runAutoLifecycle` (BUG-0018 A* retained). Additive sibling package `.opencode/plugins/its-magic-auto/{index.ts,tui.ts}` (keep flat `orchestrator.ts`). Fail-closed **`OPENCODE_AUTO_SLASH_LISTING_UNSUPPORTED`** if keymap/slash API missing. Seven `test_bug0019_*`. Upgrade `--host opencode|both` **copies** new TUI listing files and still **prunes** leftover `auto.md`. No companion DEC.

| Option | Summary | Verdict |
|--------|---------|---------|
| **E1 / E\*** | TUI keymap `slash`/`slashName` `"auto"` lists `/auto`; `run()` → client invoke → `runAutoLifecycle`; keep `editor.add`; additive sibling `its-magic-auto/`; token `OPENCODE_AUTO_SLASH_LISTING_UNSUPPORTED`; 7 tests; cite R-0124 | **Preferred** — documented list-without-template; two registries; does not recreate 0018 |
| E2 / Axis A (rejected) | JSON `commands.auto` + `template` | **Rejected** — `template` required; same registry as markdown; JSON-win = 0018 class |
| E3 / Axis B (rejected) | Restore markdown listing (`auto.md` empty/STOP/no-STOP) | **Rejected** — body always owns execute (D4). **Do not restore STOP-only `auto.md`.** |
| E4 / Axis C (rejected) | `editor.add` / `command.list()` → TUI slash row | **Rejected** — `list()` / `GET /api/command` is Command.Info; live-falsified |
| E5 / Axis D (rejected) | Markdown/JSON listing-only file | **Rejected** — no listing-without-template field in that registry |
| E6 (rejected) | Convert `orchestrator.ts` into `.opencode/plugins/orchestrator/{index.ts,tui.ts}` | **Rejected** — YAGNI vs additive sibling (R2); keep working BUG-0015 attach path |
| E7 (rejected) | Companion DEC-0135 / rewrite DEC-0124/0125 / rewrite `# BUG-0018` | **Rejected** — DQ6 additive `# BUG-0019`; D8 bodies UNCHANGED |

### Deferred locks (R-0124 → this section)

| Deferred item | Architecture lock |
|---------------|-------------------|
| Plugin directory layout | **Additive sibling** `.opencode/plugins/its-magic-auto/index.ts` + `tui.ts` (active + template). **Keep** flat `.opencode/plugins/orchestrator.ts`. Do **not** convert orchestrator into a package. `index.ts` is a thin server entry so discovery loads the package — **must not** `editor.add({ name: "auto" })` (execute stays on orchestrator). |
| `cli.json` required? | **No.** Public CLI docs: discovered project plugins do not need `cli.json`. Do **not** ship kit `cli.json` / `tui.json` unless execute proves auto-discovery fails (then listing token, not silent miss). |
| TUI `run()` → server | **Client invoke, not Command.Info.** `run()` uses `context.client` / `api.client` to reach `runAutoLifecycle` on `orchestrator.ts`. Prefer (1) documented invoke of plugin `CommandDefinition.execute` if it is **not** SessionPrompt/Command.Info template expansion; else (2) additive plugin RPC on `orchestrator.ts` wrapping `runAutoLifecycle`. **Forbidden**: `SessionPrompt.command()`, JSON/md `template`, STOP body. If client/RPC unreachable → `OPENCODE_AUTO_TUI_DISPATCH_UNSUPPORTED`. If keymap/slash API missing at TUI load → `OPENCODE_AUTO_SLASH_LISTING_UNSUPPORTED`. |
| Reason-code token | Keep **`OPENCODE_AUTO_SLASH_LISTING_UNSUPPORTED`** (no bikeshed). Dispatch sibling **`OPENCODE_AUTO_TUI_DISPATCH_UNSUPPORTED`** (R1). Do **not** reuse `OPENCODE_AUTO_MARKDOWN_COLLISION` for listing-miss. |
| Parity / installer-owned-paths | Active ↔ template byte-parity for `its-magic-auto/` + orchestrator retain + runbook stub. Add named installer-owned-paths rows for the new template plugin files if the specific-file list is required; `.opencode/plugins` directory include already covers recursive copy. |

## CF supersede — R-0120 DQ5 and BUG-0018 NB1 (LOCKED)

| Prior lock | New lock (this section) |
|------------|-------------------------|
| R-0120 DQ5: plugin `name`+`description` lists `/auto` | **SUPERSEDED.** Plugin `editor.add` is **not** a TUI slash list source. TUI markdown/JSON rows are Command.Info (`template` required). Listing for `/auto` is TUI keymap `slash`/`slashName` `"auto"`. |
| `# BUG-0018` NB1: residual host that lists only markdown would hide `/auto` (MEDIUM; no live probe) | **SUPERSEDED as the live defect.** Operator screenshot is the live probe. Fix is Axis E* listing surface, **not** restoring `auto.md`. Historical `# BUG-0018` NB1 cell remains as shipped evidence. |
| BUG-0018 A*: plugin-only execute; `auto.md` absent; prune leftover; `OPENCODE_AUTO_MARKDOWN_COLLISION` | **Unchanged compose.** Execute owner + prune + collision token stay. This bug adds listing coexistence, not a collision reopen. |

Historical `# BUG-0018` body remains as shipped evidence. Readers must follow **this** section for `/auto` **listing**. Execute ownership remains `# BUG-0018` A* + this section’s retain lock.

## Critic NB closures (research sovereign-critic — LOCKED here)

| ID | Carry-forward | Architecture lock |
|----|---------------|-------------------|
| NB1 | TUI `run()` → server invoke + `tui.ts` layout (R-0124 R1/R2) | Sibling `its-magic-auto/{index.ts,tui.ts}`; `run()` → `context.client` / RPC → `runAutoLifecycle`; keep flat `orchestrator.ts`; no `cli.json` |
| NB2 | E1 ratification + exact client invoke + 7 tests + listing token | E1 locked; tokens `OPENCODE_AUTO_SLASH_LISTING_UNSUPPORTED` + dispatch sibling; 7 `test_bug0019_*` |
| NB3 | No `/architecture` spawn from critic; no companion DEC; no DONE; no 0018 reopen; no `auto.md` restore; axes A/B/C rejected | Held. E2–E7 rejected. Status OPEN. This phase does **not** spawn `/sprint-plan`. |

## Components

### TUI listing surface (DQ1, DQ4, DQ8, D1, D10)

Ship additive package (active **and** template):

- `.opencode/plugins/its-magic-auto/index.ts` — thin `Plugin.define` server entry for discovery. **No** second `editor.add({ name: "auto" })`.
- `.opencode/plugins/its-magic-auto/tui.ts` — import `@opencode-ai/plugin/tui` (or `@opencode/plugin/tui` as the host resolves). Register keymap layer with `slash: { name: "auto" }` **or** `slashName: "auto"` (whichever the loaded TUI API exposes). `namespace`/`palette` as required so the command appears in the slash palette the operator uses. Description should match current plugin `editor.add` description: `its-magic auto: orchestrator dispatch entry (spawn-only).`

If **neither** `context.keymap.layer` nor `api.keymap.registerLayer` (or equivalent slash-capable keymap API) exists at TUI load: operator-visible **`OPENCODE_AUTO_SLASH_LISTING_UNSUPPORTED`** (toast and/or printed token). Must **not** silent missing-command.

Keep all `.opencode/commands/*.md` peers. Keep `.opencode/agents/auto.md`. Keep `.cursor/commands/auto.md`. **Do not** restore `.opencode/commands/auto.md`.

### Plugin execute retained (compose BUG-0018 A* / BUG-0015)

Keep `.opencode/plugins/orchestrator.ts` `ctx.command.transform` → `editor.add({ name: "auto", execute })` → `runAutoLifecycle`. Leftover-`auto.md` fail-closed `OPENCODE_AUTO_MARKDOWN_COLLISION` unchanged. Secondary `command.executed` stays defense-only.

Do **not** add OpenCode JSON/JSONC `commands.auto` / `command.auto` with `template`.

### TUI `run()` → server `runAutoLifecycle` (R1)

`tui.ts` `run()` lives in the CLI process. `runAutoLifecycle` lives in the server plugin.

**Locked invoke order:**

1. Obtain `context.client` or `api.client` (`OpencodeClient`).
2. Invoke server `runAutoLifecycle` **without** Command.Info template expansion. Prefer a documented plugin-command execute path if it targets `CommandDefinition.execute`; otherwise additive plugin RPC on `orchestrator.ts` (thin wrapper around existing `runAutoLifecycle`).
3. Surface lifecycle result / `OPENCODE_*` to the operator (toast or equivalent). Do not swallow.

If client or RPC/execute path is missing: operator-visible **`OPENCODE_AUTO_TUI_DISPATCH_UNSUPPORTED`**. Do **not** paper over with markdown/JSON template.

### Reason codes (DQ5)

| Code | When |
|------|------|
| `OPENCODE_PLUGIN_DISPATCH_ATTACH_UNSUPPORTED` | Missing `command.transform` / `editor.add` (unchanged BUG-0015) |
| `OPENCODE_AUTO_MARKDOWN_COLLISION` | Leftover `.opencode/commands/auto.md` (unchanged BUG-0018). **Not** for listing-miss. |
| **`OPENCODE_AUTO_SLASH_LISTING_UNSUPPORTED`** | Plugin execute is registered **but** TUI keymap/slash listing cannot be registered (missing keymap API / slash field). **Must not** silent missing `/auto`. |
| **`OPENCODE_AUTO_TUI_DISPATCH_UNSUPPORTED`** | `/auto` is listed (or would be) but `run()` cannot reach `runAutoLifecycle`. |
| Other `OPENCODE_*` / mutex codes | Unchanged compose |

US-0126 owns the full table; this bug ships **stub only** (plugin `REASON_CODES` + runbook).

### Contract tests (DQ6 — seven markers)

Preferred: `tests/bug0019_opencode_auto_slash_listing_test.py`. **No live OpenCode TUI probe** (default out of CI, same as 0018). Do **not** weaken `test_bug0018_*` (`auto.md` remains absent).

| # | Marker | Asserts |
|---|--------|---------|
| 1 | `test_bug0019_no_restored_opencode_auto_md` | active + template `.opencode/commands/auto.md` **absent** (compose 0018; Cursor `.cursor/commands/auto.md` + `.opencode/agents/auto.md` remain) |
| 2 | `test_bug0019_plugin_editor_add_auto_execute_retained` | `command.transform` + `editor.add({ name: "auto" })` + `execute` / `runAutoLifecycle` (active + template) |
| 3 | `test_bug0019_no_json_commands_auto_template` | no OpenCode JSON/JSONC `commands.auto` / `command.auto` with `template` |
| 4 | `test_bug0019_tui_slash_auto_listing_surface` | TUI keymap `slash` / `slashName` `"auto"` in discovered TUI entry `its-magic-auto/tui.ts` (active + template) |
| 5 | `test_bug0019_tui_run_dispatches_lifecycle_not_template` | TUI `run` wires to `runAutoLifecycle` / client invoke of plugin execute; **not** a Command.Info prompt template / STOP body |
| 6 | `test_bug0019_active_template_listing_parity` | listing surface + no-`auto.md` + no JSON template byte-parity (D10) |
| 7 | `test_bug0019_upgrade_copies_listing_surface` | upgrade `--host opencode\|both` **copies** new TUI listing files onto already-pruned consumer trees; still **prunes** leftover `auto.md`; no general sweeper |

### Consumer upgrade (DQ7)

BUG-0018 already pruned consumer `auto.md`. Those trees **lack** a listing surface. Upgrade is **copy-only for files the template still ships** plus the targeted `auto.md` prune.

**Ship** `template/.opencode/plugins/its-magic-auto/{index.ts,tui.ts}`. `its-magic --mode upgrade --host opencode|both` **adds missing framework files** → already-pruned consumers receive the listing surface without restoring `auto.md`. Still run `prune_retired_opencode_auto_md`.

**Installer-owned-paths**: add named rows for the new template plugin files if the specific-file list is the copy SOT; keep `.opencode/plugins` directory include. Extend `check_intake_template_parity.py` with an additive pair for `its-magic-auto/` (do not drop `BUG0015_PAIRS` orchestrator pair).

Runbook recipe: (1) upgrade to the BUG-0019 release; (2) `its-magic --mode upgrade --host opencode|both` (copy listing files + prune leftover `auto.md`); (3) restart OpenCode (not `--pure`); (4) slash palette lists `/auto` and invocation starts lifecycle or `OPENCODE_*`.

## Touch surfaces (execute)

| Surface | Change |
|---------|--------|
| `.opencode/plugins/its-magic-auto/index.ts` + `tui.ts` + template twins | **Add** listing package |
| `.opencode/plugins/orchestrator.ts` + template | Keep attach; add listing/dispatch `REASON_CODES`; optional RPC wrapper for TUI `run()` |
| `.opencode/commands/auto.md` + template | **Stay absent** |
| OpenCode JSON `commands.auto` | **Do not add** |
| `installer.py` + `installer.sh` + `installer.ps1` | Copy new plugin files; **keep** targeted `auto.md` prune |
| `docs/engineering/context/installer-owned-paths.manifest` | Named rows for new plugin files if required |
| `scripts/check_intake_template_parity.py` | Additive `its-magic-auto/` pair |
| `tests/bug0019_*` | 7 markers |
| `tests/bug0018_*` | Unchanged compose (auto.md absent) |
| `docs/engineering/runbook.md` (+ template) | Upgrade copy+prune recipe + listing/dispatch reason-code stubs |

## Non-goals

- Allocate `DEC-0135` / rewrite DEC-0124 / DEC-0125 bodies
- Rewrite historical `# BUG-0018` body / R-0120 body
- Reopen BUG-0015 / BUG-0016 / BUG-0017 / BUG-0018
- Restore STOP-only / empty `auto.md`
- JSON `commands.auto` template
- Convert flat `orchestrator.ts` to package layout
- Ship kit `cli.json` / `tui.json` by default
- Live OpenCode CI probe
- Touch `.cursor/commands/auto.md` or `.opencode/agents/auto.md`
- Drain US-0135+ / mutate US-0133..US-0148
- Cursor `/auto` port

## Risks

| Risk | Severity | Mitigation |
|------|----------|------------|
| R1 TUI `run()` cannot reach server `runAutoLifecycle` | MEDIUM | Locked client/RPC invoke; `OPENCODE_AUTO_TUI_DISPATCH_UNSUPPORTED`; never markdown/JSON template |
| R2 Host TUI discovery wants package layout / `tui.json` | MEDIUM | Additive sibling `index.ts`+`tui.ts` (public CLI docs); no `cli.json`; listing token if keymap never registers; do not convert orchestrator.ts |
| R3 Keymap `slash.name=auto` collides with future Command.Info `/auto` | LOW | Keep `auto.md` absent; forbid JSON `commands.auto`; 0018 prune remains |
| R4 Already-pruned consumers miss new TUI files | LOW | DQ7 copy-on-upgrade + marker 7 |
| R5 Cursor `/auto` mistaken for this bug | LOW | Out of scope (D8); do not prune `.cursor/commands/auto.md` |
| R6 Reason-code stub drift vs US-0126 | LOW | Stub + cross-link only |

## AC coverage mapping (bug acceptance + R-0124)

| Expected slice | Architecture anchor | Seeds |
|----------------|---------------------|-------|
| Operator can select `/auto` in OpenCode list | E1 TUI keymap slash | T-001, T-005 (m4) |
| Invocation starts `runAutoLifecycle` or documented `OPENCODE_*` | `run()` client invoke; tokens | T-003, T-004, T-005 (m5) |
| Must not restore STOP-only `auto.md` | D4 / E3 rejected | T-002, T-005 (m1) |
| Must not JSON-template `/auto` | E2 rejected | T-002, T-005 (m3) |
| Plugin `editor.add` execute retained | Compose 0018 A* | T-002, T-005 (m2) |
| Fail-closed listing token (not silent miss) | `OPENCODE_AUTO_SLASH_LISTING_UNSUPPORTED` | T-001, T-004, T-005 (m4) |
| Consumer upgrade copies listing + still prunes `auto.md` | DQ7 | T-006, T-005 (m7) |
| Active↔template parity | D10 | T-007, T-005 (m6) |
| Peers remain listed | Do not delete other `.md` commands | T-anch, T-002 |

Acceptance checkbox: `docs/product/acceptance.md` BUG-0019 row remains unchecked until closure (US-0045).

## Atomic task seeds (for `/sprint-plan`)

| # | Seed | Surfaces |
|---|------|----------|
| T-anch | Verify `# BUG-0019` H1 + approach E1/E* + R-0124 DQ1–DQ8 + DQ5/NB1 superseded + no companion DEC | architecture.md, R-0124 (read-only) |
| T-001 | Add sibling `.opencode/plugins/its-magic-auto/{index.ts,tui.ts}` (active+template); keymap `slash`/`slashName` `"auto"`; fail-closed listing token if keymap API missing | `its-magic-auto/` active + template |
| T-002 | Retain `orchestrator.ts` `editor.add({ name: "auto", execute })` → `runAutoLifecycle`; do **not** restore `auto.md`; do **not** add JSON `commands.auto` template | `orchestrator.ts`; confirm `auto.md` absent |
| T-003 | Wire TUI `run()` → `context.client` / plugin RPC → `runAutoLifecycle` (not Command.Info template); dispatch fail-closed `OPENCODE_AUTO_TUI_DISPATCH_UNSUPPORTED` | `tui.ts` + orchestrator RPC/wrapper |
| T-004 | Add `OPENCODE_AUTO_SLASH_LISTING_UNSUPPORTED` (+ dispatch sibling) to plugin `REASON_CODES` + runbook stub (US-0126 cross-link) | `orchestrator.ts` vocab + runbook |
| T-005 | Add 7 `test_bug0019_*` markers; no live OpenCode probe; do not weaken `test_bug0018_*` | `tests/bug0019_*.py` |
| T-006 | Upgrade `--host opencode\|both` **copies** new TUI files and still **prunes** leftover `auto.md`; installer-owned-paths named rows if required | installer.py/sh/ps1 + manifest |
| T-007 | Runbook upgrade recipe + active↔template parity for listing package / runbook stub / installer paths / parity-script pair | runbook + template + `check_intake_template_parity.py` |

**Task count**: 8 seeds (T-anch + T-001..T-007). `SPRINT_MAX_TASKS=12` — no auto-split. Not `/quick` (new TUI package + invoke wiring + installers + 7 tests + runbook).

## Decision linkage

- Decision: **none** (companion DEC not required — cite **R-0124**; do **not** allocate **DEC-0135**)
- Compose (do not amend bodies): **DEC-0124**, **DEC-0125**, **DEC-0120**, **DEC-0132** (preserve paths — new plugin files are framework, not operator locals)
- Research: **R-0124** (composes **R-0123** / **R-0120**; do not wipe)
- Related: **US-0124**, **US-0125**, **US-0069**, **US-0126** (stub only); **BUG-0018** / **BUG-0015** / **BUG-0017** / **BUG-0016** DONE — out of scope

## Isolation evidence (US-0048 / DEC-0029)

- `phase_id=architecture`, `role=tech-lead`, `bug_id=BUG-0019`, `sprint_id=none`, `orchestrator_run_id=auto-20260912-bug0019`
- `delivery_mode=ultra_lean`, `macro_phase=plan`, `model_id=cursor-grok-4.6` (CROSS_MODEL_REVIEW=1)
- `fresh_context_marker=tl-BUG0019-architecture-20260912T181000Z-fresh`, `timestamp=2026-09-12T18:15:00Z`
- Narrow-read: R-0124; `# BUG-0018` NB1; BUG-0019 backlog; acceptance row; resume_brief; absent auto.md + plugin attach; installer copy+prune; critic NBs
- No execute-surface mutation in this phase; no DONE flip; acceptance unchecked; no companion DEC; no DEC-0124/0125 body rewrite; `# BUG-0018` historical body not rewritten; no `/sprint-plan` spawn

## Strict runtime proof

- `runtime_proof_id=rp-auto-20260912-bug0019-architecture-techlead-20260912T181500Z-BUG-0019`
- Canonical payload: `{"delivery_mode":"ultra_lean","macro_phase":"plan","model_id":"cursor-grok-4.6","orchestrator_run_id":"auto-20260912-bug0019","phase_id":"architecture","proof_issued_at":"2026-09-12T18:15:00Z","proof_ttl_seconds":3600,"role":"tech-lead","runtime_proof_id":"rp-auto-20260912-bug0019-architecture-techlead-20260912T181500Z-BUG-0019","sprint_id":"none","story_id":"BUG-0019"}`
- `proof_hash=467370D2B9622A20D2659B59116522D4E7D8F42B65253A936F40A0A72C729970`
- `proof_ttl=2026-09-12T19:15:00Z`
- Consumed research proof: `rp-auto-20260912-bug0019-research-techlead-20260912T175800Z-BUG-0019` / `D67B1BF49AF607EC472297AD62B949798D51ED92B5CE85B0068CAABB009F3854` — RUNTIME_PROOF_VALID MATCH before TTL `2026-09-12T18:58:00Z`

