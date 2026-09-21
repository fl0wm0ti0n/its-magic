# Architecture archive pack (2026-09-21)

- Rollover trigger: `ARCH_HOT_MAX_LINES=3000, ARCH_HOT_MAX_STORY_SECTIONS=120`
- Source: `docs/engineering/architecture.md`
- Archived units (oldest first, contiguous prefix): 2
- Retained units in hot file: 25
- First archived heading: `# BUG-0017 — OpenCode pack CRLF / LF normalization (Linux slash commands)`
- Last archived heading: `# BUG-0018 — OpenCode markdown `/auto` wins over plugin execute`
- Verification tuple (mandatory):
  - archived_body_lines=367
  - preamble_lines=1
  - retained_body_lines=2829

---

# BUG-0017 — OpenCode pack CRLF / LF normalization (Linux slash commands)

## Overview

**`BUG-0017`** restores Linux OpenCode recognition of its-magic slash commands (`/auto`, `/intake`, peers) by ensuring kit OpenCode pack text ships **LF-only**. Root cause: CRLF in `.opencode/commands/*.md` YAML frontmatter breaks OpenCode `parseOption` (empty → silent skip). Same failure class as **BUG-0008** (manifest CRLF), different surface (OpenCode pack markdown/TS/JSON).

**Research anchor**: **`R-0118`** (DQ1–DQ6 LOCKED). **Companion DEC**: **none** — compose **BUG-0008** / **US-0084** / **DEC-0120**; cite **R-0118**. **Out of scope**: OpenCode host parser CR-strip; repo-wide `*.md eol=lf`; installer EOL rewrite; BUG-0015/BUG-0016 reopen; command semantics.

**Fresh context marker**: `tl-BUG0017-architecture-20260911T191500Z-fresh`
**Orchestrator run id**: `auto-20260911-bug0017`
**Timestamp**: 2026-09-11T19:20:00Z (UTC)
**Verdict**: PASS
**Next**: `/sprint-plan`

## Approach locked (A* — from R-0118 A1 / DQ1–DQ6)

**Approach A\*** (locked): Scoped `.gitattributes` LF for `.opencode/**` + `template/.opencode/**` `*.{md,ts,json}` + one-time `git add --renormalize` on those trees + extend `scripts/guard_installer_publish.py` to fail-closed on `\r` in OpenCode pack inventory + six additive `test_bug0017_*` + runbook consumer upgrade recipe (DQ6). Reuse `npm run guard:installer` / `prepublishOnly`. No install-time EOL rewrite. No new DEC.

| Option | Summary | Verdict |
|--------|---------|---------|
| **A\*** | DQ1 attrs + D4 renormalize + extend guard + 6 tests + DQ6 runbook; compose BUG-0008/US-0084/DEC-0120 | **Preferred** — minimal ship-fix fix; matches R-0118 A1 |
| A2 (rejected) | Install-time EOL rewrite on OpenCode copy paths | **Rejected** — masks attr/guard failures; triples installer surface (DQ3) |
| A3 (rejected) | Repo-wide `*.md text eol=lf` | **Rejected** — D3/D8; surprises unrelated docs |
| A4 (rejected) | OpenCode host parser CR-strip | **Rejected** — kit cannot patch host (D8) |
| A5 (rejected) | New sibling `guard_opencode_eol.py` | **Rejected** — duplicates CI wiring (DQ2) |

## Critic NB closures (research sovereign-critic — LOCKED here)

| ID | Carry-forward | Architecture lock |
|----|---------------|-------------------|
| NB1 | Choco GitHub-zip lacks npm `prepublishOnly` | **Release/CI must run `guard:installer` (extended) before any tag** chocolatey downloads. No choco-specific EOL post-process (DQ4). Seed **T-007**. |
| NB2 | Dirty-tree renormalize | Execute **T-002**: scoped `git add --renormalize -- .opencode template/.opencode` only; if dirty unrelated files block commit, isolate/stash or commit attribute+normalize slice alone. Do not renormalize whole repo. |
| NB3 | DQ6 consumer upgrade recipe | Runbook documents `its-magic --mode upgrade --host opencode\|both` after kit fix; kit-only does **not** heal already-copied CRLF trees (DQ6). Seed **T-006**. |

## Components

### `.gitattributes` (DQ1 — D3)

Append (compose existing `*.sh` / `*.manifest`; **never** add repo-wide `*.md`):

```
.opencode/**/*.md text eol=lf
.opencode/**/*.ts text eol=lf
.opencode/**/*.json text eol=lf
template/.opencode/**/*.md text eol=lf
template/.opencode/**/*.ts text eol=lf
template/.opencode/**/*.json text eol=lf
```

### One-time renormalize (D4 / NB2)

After attributes land: `git add --renormalize -- .opencode template/.opencode` so index stores LF. Dirty-tree policy per NB2 table above.

### Publish guard extension (DQ2 / DQ5)

Extend `scripts/guard_installer_publish.py` (+ `template/scripts/` mirror) to reject `\r` in:

- `.opencode/commands/**/*.md`, `.opencode/agents/**/*.md`, `.opencode/plugins/**/*.{md,ts}`, `.opencode/README.md`
- `template/.opencode/` same + `template/.opencode/model-catalog.local.example.json`

Keep US-0084 / BUG-0008 checks unchanged. Hook: existing `npm run guard:installer` / `prepublishOnly`. Message names relative path + BUG-0017.

### Installer / packaging (DQ3 / DQ4)

- **No** install-time CR-strip (`shutil.copy2` stays byte-preserving).
- **Diagnostic install `\r` warning**: default **no** (R-0118 deferred; keep installers thin).
- npm: template inventory is hard gate via `prepublishOnly`.
- chocolatey: inherits git LF from tagged zip — **T-007** ensures guard ran before tag.

### Consumer upgrade (DQ6 / NB3)

Document in runbook: upgrade its-magic → `its-magic --mode upgrade --host opencode` or `--host both` (DEC-0120). Conflicted locals: resolve then re-upgrade; `dos2unix` last resort only.

### Contract tests (D7 — six markers)

Preferred: `tests/bug0017_opencode_eol_test.py` (or `tests/installer_opencode_eol_bug0017_test.py`). Do **not** weaken BUG-0008 / US-0084 tests.

| # | Marker | Asserts |
|---|--------|---------|
| 1 | `test_bug0017_gitattributes_scoped_opencode_eol_lf` | DQ1 rows present; no repo-wide `*.md text eol=lf` |
| 2 | `test_bug0017_no_cr_in_active_opencode_pack_text` | no `\r` in active inventory |
| 3 | `test_bug0017_no_cr_in_template_opencode_pack_text` | no `\r` in template inventory (+ example JSON) |
| 4 | `test_bug0017_guard_installer_publish_rejects_opencode_cr` | planted CR → guard exit ≠ 0 |
| 5 | `test_bug0017_guard_still_enforces_installer_sh_and_manifests` | US-0084 / BUG-0008 regression |
| 6 | `test_bug0017_active_template_opencode_tracked_text_parity` | tracked in-scope pairs parity after LF |

## Touch surfaces (execute)

| Surface | Change |
|---------|--------|
| `.gitattributes` | DQ1 six rows |
| `.opencode/**` + `template/.opencode/**` in-scope text | One-time LF normalize |
| `scripts/guard_installer_publish.py` + template mirror | OpenCode `\r` inventory scan |
| `tests/bug0017_*` (+ template if paired) | 6 markers |
| `docs/engineering/runbook.md` (+ template) | DQ6 upgrade recipe + release/tag guard note |
| CI / release checklist | Ensure `guard:installer` before GitHub tag (choco path) |

## Non-goals

- OpenCode host parser patch / CR-strip
- Repo-wide `*.md eol=lf`
- Installer EOL rewrite-on-copy
- New sibling EOL guard script
- Scanning operator-local `model-catalog.local.json`
- Reopening BUG-0015 / BUG-0016
- Changing slash-command semantics

## Risks

| Risk | Severity | Mitigation |
|------|----------|------------|
| R1 Windows editors reintroduce CRLF | MEDIUM | Attributes + guard (A*) |
| R2 npm ships template only — active drift | MEDIUM | D6 parity tests (marker 6) |
| R3 Consumers skip upgrade | MEDIUM | DQ6 runbook recipe (T-006) |
| R4 Choco tag without guard | MEDIUM | T-007 release/CI before-tag gate (NB1) |
| R5 Dirty-tree renormalize churn | LOW–MEDIUM | Scoped renormalize only (NB2 / T-002) |
| R6 Over-scope node_modules / locals | LOW | Inventory excludes; gitignored locals unscanned |

## AC coverage mapping (bug acceptance + R-0118)

| Expected slice | Architecture anchor | Seeds |
|----------------|---------------------|-------|
| Linux OpenCode recognizes `/auto`/`/intake`/peers | Approach A*; D1/D9 | T-001..T-003, T-005 |
| Shipped pack has no CRLF | Guard + normalize + tests | T-002, T-003, T-005 |
| Scoped attrs (not repo-wide `*.md`) | DQ1; marker 1 | T-001, T-005 |
| Publish/CI fail-closed on `\r` | DQ2/DQ5; markers 4–5 | T-003, T-005, T-007 |
| Active↔template parity | D6; marker 6 | T-004, T-005 |
| Consumer upgrade path | DQ6; NB3 | T-006 |
| Compose BUG-0008/US-0084 unchanged | Decision linkage; marker 5 | T-anch, T-005 |

Acceptance checkbox: `docs/product/acceptance.md` BUG-0017 row remains unchecked until closure (US-0045).

## Atomic task seeds (for `/sprint-plan`)

| # | Seed | Surfaces |
|---|------|----------|
| T-anch | Verify `# BUG-0017` H1 + approach A* + R-0118 DQ1–DQ6 + NB1–NB3 closed + no companion DEC | architecture.md, R-0118 (read-only) |
| T-001 | Add DQ1 `.gitattributes` rows for `.opencode/**` + `template/.opencode/**` `*.{md,ts,json}`; reject repo-wide `*.md` | `.gitattributes` |
| T-002 | One-time LF renormalize scoped trees; dirty-tree = scoped `git add --renormalize` only (NB2) | `.opencode/**`, `template/.opencode/**` |
| T-003 | Extend `guard_installer_publish.py` OpenCode inventory (DQ2/DQ5); keep BUG-0008/US-0084 checks | `scripts/guard_installer_publish.py` |
| T-004 | Template mirror of guard + active↔template OpenCode tracked-text parity gate | `template/scripts/guard_installer_publish.py` + parity |
| T-005 | Add 6 `test_bug0017_*` markers; do not weaken BUG-0008/US-0084 | `tests/bug0017_*.py` (+ template if paired) |
| T-006 | Runbook DQ6 upgrade recipe (`upgrade --host opencode\|both`) + cross-link BUG-0017 | `docs/engineering/runbook.md` + template |
| T-007 | Release/CI: `guard:installer` required before GitHub tag (choco zip path; NB1) | release notes / CI / runbook checklist |

**Task count**: 8 seeds (T-anch + T-001..T-007). `SPRINT_MAX_TASKS=12` — no auto-split. Not `/quick` (attrs + normalize + guard + tests + docs + release gate).

## Decision linkage

- Decision: **none** (companion DEC not required — cite **R-0118**)
- Compose (do not amend): **BUG-0008**, **US-0084**, **DEC-0120**, **DEC-0039** (local never-overwrite), **DEC-0132** (example JSON vs operator local)
- Research: **R-0118** (composes **R-0069** class; do not wipe)
- Related: **US-0121**, **US-0125**, **BUG-0015** / **BUG-0016** (DONE — out of scope)

## Isolation evidence (US-0048 / DEC-0029)

- `phase_id=architecture`, `role=tech-lead`, `bug_id=BUG-0017`, `sprint_id=none`, `orchestrator_run_id=auto-20260911-bug0017`
- `delivery_mode=ultra_lean`, `macro_phase=plan`, `model_id=composer-2.5` (CROSS_MODEL_REVIEW=1)
- `fresh_context_marker=tl-BUG0017-architecture-20260911T191500Z-fresh`, `timestamp=2026-09-11T19:20:00Z`
- Narrow-read: R-0118; BUG-0017 backlog research_notes; acceptance row; `.gitattributes`; `guard_installer_publish.py`; critic NBs; architecture heading policy
- No attribute/guard/normalize mutation in this phase (execute owns); no DONE flip; acceptance unchecked; no companion DEC authored

## Strict runtime proof

- `runtime_proof_id=rp-auto-20260911-bug0017-architecture-techlead-20260911T192000Z-BUG-0017`
- Canonical payload: `{"delivery_mode":"ultra_lean","macro_phase":"plan","model_id":"composer-2.5","orchestrator_run_id":"auto-20260911-bug0017","phase_id":"architecture","proof_issued_at":"2026-09-11T19:20:00Z","proof_ttl_seconds":3600,"role":"tech-lead","runtime_proof_id":"rp-auto-20260911-bug0017-architecture-techlead-20260911T192000Z-BUG-0017","sprint_id":"none","story_id":"BUG-0017"}`
- `proof_hash=541A4773D0E994EE9FC1A0DD09E70DBE1D0B262170FB6D63540407CEBBD76B68`
- `proof_ttl=2026-09-11T20:20:00Z`
- Consumed research proof: `rp-auto-20260911-bug0017-research-techlead-20260911T191200Z-BUG-0017` / `DF94BA041DDCB51ADD0675C7B41DEAD6F14CADB1D1095489E3B5F0E8342B777A` — RUNTIME_PROOF_VALID

# BUG-0018 — OpenCode markdown `/auto` wins over plugin execute

## Overview

**`BUG-0018`** closes the **same-name markdown vs plugin-execute collision** on OpenCode: `.opencode/commands/auto.md` (LF STOP-only) still owns `/auto` while plugin `editor.add({ name: "auto", execute })` → `runAutoLifecycle` is registered but never invoked. Live host submits the markdown STOP body with **no `OPENCODE_*`**. Distinct from **BUG-0015 DONE** (missing attach) and **BUG-0017 DONE** (CRLF so commands were not offered).

**This section supersedes `# BUG-0015` CF1** (“Transform owns execute; thin `auto.md` is discoverability-only”). CF1 is **live-falsified**. Do **not** rewrite the historical CF1 cell, **DEC-0124**, or **DEC-0125** bodies (D8). Do **not** reopen BUG-0015 ACs.

**Research anchor**: **`R-0120`** (DQ1–DQ8 LOCKED; compose **R-0119** / **R-0114**). **Companion DEC**: **none**. **Out of scope**: Symptom B Cursor Task-unavailable; BUG-0015/0016/0017 reopen; Axis B/C/D; general “delete files not in template” sweeper; live OpenCode CI probe; Cursor `.cursor/commands/auto.md`; `.opencode/agents/auto.md`.

**Fresh context marker**: `tl-BUG0018-architecture-20260912T100000Z-fresh`
**Orchestrator run id**: `auto-20260912-bug0018`
**Timestamp**: 2026-09-12T10:00:00Z (UTC)
**Verdict**: PASS
**Next**: `/sprint-plan`

## Approach locked (A* — from R-0120 Axis A / DQ1–DQ8)

**Approach A\*** (locked): **Plugin-only `/auto`**. Remove colliding `.opencode/commands/auto.md` (active **and** template). Keep plugin `command.transform` → `editor.add({ name: "auto", description, execute })` → `runAutoLifecycle` as the **sole** `/auto` owner (listing via plugin `description`, matching current markdown description string). Upgrade `--host opencode|both` **must prune** leftover consumer `auto.md` (copy-only upgrade is not enough). Additive `OPENCODE_AUTO_MARKDOWN_COLLISION` if leftover file remains. Six `test_bug0018_*`. Compose-only if-present relax of two named existence asserts; inventory counts that assumed 15 markdown commands including `auto.md` drop to 14. No companion DEC.

| Option | Summary | Verdict |
|--------|---------|---------|
| **A\*** | Remove colliding `auto.md` (kit + consumer prune); plugin `editor.add` remains sole `/auto`; `OPENCODE_AUTO_MARKDOWN_COLLISION`; 6 tests; cite R-0120 | **Preferred** — simplest fix matching host markdown-wins + add-only CommandDraft |
| A2 / Axis B (rejected) | Rename markdown to a non-colliding slash name | **Rejected** — extra slash; still must prune leftover `auto.md`; YAGNI vs A |
| A3 / Axis C (rejected) | Later `editor.add` / `command.reload()` | **Rejected** — add-only; live host already adds and markdown still wins |
| A4 / Axis D (rejected) | Documented host override | **Rejected** — none for markdown vs plugin command execute |
| A5 (rejected) | Empty/no-STOP `auto.md` body | **Rejected** — markdown still owns `/auto`; silent-or-empty is not a fix (D4 / DQ2) |
| A6 (rejected) | Primary = `command.executed` | **Rejected** — shipped secondary subscribe did not start lifecycle (DQ3) |
| A7 (rejected) | Companion DEC / rewrite DEC-0124/0125 | **Rejected** — DQ7 additive `# BUG-0018`; D8 bodies UNCHANGED |

## `# BUG-0015` CF1 supersede (LOCKED)

| Prior lock | New lock (this section) |
|------------|-------------------------|
| CF1: “Transform owns execute. Thin `auto.md` remains STOP-only discoverability.” | **SUPERSEDED.** When `.opencode/commands/auto.md` exists, **markdown owns `/auto`**. Plugin `execute` does **not** override. After collision removal, plugin `editor.add({ name: "auto", execute })` is the sole `/auto` registration. |
| CF6: primary = transform `execute`; `command.executed` = defense | **Unchanged compose.** Secondary subscribe stays mutex-gated **after** markdown collision is gone. Do not depend on it to unstick `/auto`. |

Historical `# BUG-0015` CF1 cell remains as shipped evidence. Readers must follow **this** section for `/auto` ownership.

## Critic NB closures (research sovereign-critic — LOCKED here)

| ID | Carry-forward | Architecture lock |
|----|---------------|-------------------|
| NB1 | R1 markdown-only listing; R2 leftover `auto.md` after naïve upgrade | Plugin `add` + D9 description; **DQ8 prune** (T-003) + marker 4. Residual listing risk MEDIUM — fail-closed attach-missing; no live probe. |
| NB2 | Exact reason-code token + runtime vs installer detect | Token **`OPENCODE_AUTO_MARKDOWN_COLLISION`** (no bikeshed). **Installer prune is primary.** Plugin `REASON_CODES` stub + `runAutoLifecycle` leftover-file fail-closed (defense when execute is reached). Slash leftover cannot be intercepted — prune or operator delete. |
| NB3 | Do not spawn sprint-plan from architecture; no companion DEC; no DONE; no Symptom B | Held. Axes B/C/D rejected. Status OPEN. |

## Components

### Remove colliding `auto.md` (DQ1, DQ5, D9, D10)

Delete:

- `.opencode/commands/auto.md`
- `template/.opencode/commands/auto.md`

Keep all other `.opencode/commands/*.md` (`intake.md`, peers, `/quick`, `/ask`). Keep `.opencode/agents/auto.md` (independent agent surface). Keep `.cursor/commands/auto.md` (Cursor host — out of scope).

Plugin listing: `editor.add` `name: "auto"` + `description: "its-magic auto: orchestrator dispatch entry (spawn-only)."` (match current markdown description). Residual risk: a host that lists **only** markdown files would hide `/auto` — mitigate with plugin `add` + attach-missing `OPENCODE_PLUGIN_DISPATCH_ATTACH_UNSUPPORTED`; no live CI probe.

### Plugin attach unchanged (compose BUG-0015)

Keep `ctx.command.transform` → `editor.add({ name: "auto", execute })` → `runAutoLifecycle`. Do not treat `setup()` return `{ spawnPhase }` as attach. Secondary `command.executed` subscribe remains defense-only (mutex-gated).

At start of `runAutoLifecycle`, if leftover `.opencode/commands/auto.md` exists (best-effort `cwd` / `ctx.directory`): return fail-closed **`OPENCODE_AUTO_MARKDOWN_COLLISION`** (does not unstick slash markdown-wins; covers headless/secondary when execute is reached). Plugin must **not** delete the file (installer owns prune).

### Reason codes (DQ6)

| Code | When |
|------|------|
| `OPENCODE_PLUGIN_DISPATCH_ATTACH_UNSUPPORTED` | Missing `command.transform` / `editor.add` (unchanged BUG-0015) |
| `OPENCODE_PLUGIN_SPAWN_UNSUPPORTED` / `OPENCODE_SUBTASK_IGNORED` / `OPENCODE_AUTO_ALREADY_RUNNING` | Unchanged compose |
| **`OPENCODE_AUTO_MARKDOWN_COLLISION`** | Leftover `.opencode/commands/auto.md` so markdown would own `/auto` — **must not** silent STOP. Installer prints this if prune unlink fails. Plugin vocabulary + lifecycle leftover check. US-0126 owns full table; this bug ships **stub only**. |

### Installer prune (DQ8)

`installer.py` upgrade iterates template file list: add missing + update differing framework bytes; **does not delete** target files the template no longer ships. Removing kit `auto.md` without prune **leaves consumer collision**.

**Ship**: targeted prune of consumer `.opencode/commands/auto.md` when the kit template no longer ships that path, invoked from upgrade `--host opencode|both` (and the same path in `installer.sh` / `installer.ps1`). **Always delete this one relative path** (retired colliding framework file — not operator data; not a DEC-0132 preserve path). Do **not** invent a general “delete all files not in template” sweeper. Do **not** prune `.opencode/agents/auto.md` or `.cursor/commands/auto.md`.

If unlink fails: print **`[OPENCODE_AUTO_MARKDOWN_COLLISION]`**, continue other upgrade work, runbook tells operator to delete the file then re-upgrade.

### Contract tests (DQ7 — six markers + compose-only)

Preferred: `tests/bug0018_opencode_auto_ownership_test.py`. **No live OpenCode probe.**

| # | Marker | Asserts |
|---|--------|---------|
| 1 | `test_bug0018_no_colliding_opencode_auto_md` | active + template `.opencode/commands/auto.md` **absent** |
| 2 | `test_bug0018_plugin_editor_add_auto_execute` | `command.transform` + `editor.add({ name: "auto" })` + `execute` / `runAutoLifecycle` (active + template) |
| 3 | `test_bug0018_active_template_opencode_auto_ownership_parity` | absence of `auto.md` + plugin attach byte-parity |
| 4 | `test_bug0018_upgrade_prunes_consumer_auto_md` | upgrade `--host opencode` (or targeted helper) removes leftover consumer `auto.md` |
| 5 | `test_bug0018_compose_bug0015_attach_api_unchanged` | `runAutoLifecycle` / attach reason codes still present (read-only compose) |
| 6 | `test_bug0018_markdown_collision_reason_code_stub` | `OPENCODE_AUTO_MARKDOWN_COLLISION` in plugin vocabulary / runbook stub |

**Compose-only (required once `auto.md` is gone; do not reopen US-0125/BUG-0015 ACs; DEC-0124/0125 bodies UNCHANGED):**

- `test_bug0015_auto_md_dispatch_only_static`: **if** `auto.md` exists → ≤20 / STOP / no spawn; **absence is OK**
- `test_us0125_auto_command_dispatch_only`: same if-present; no hard `auto.md missing` fail
- Drop `.opencode/commands/auto.md` pair from `BUG0015_PAIRS` (plugin pair stays)
- US-0125 `EXPECTED_COMMANDS`: drop `"auto"` → **14** markdown commands (12 lifecycle + `quick` + `ask`). Marker 7 remaining-after-delete `quick.md`: **13**. Remove dead `if name == "auto"` frontmatter branch.
- `test_bug0017_guard_installer_publish_rejects_opencode_cr` plant path: swap to another remaining command file (e.g. `intake.md`) — plant-path only; CR-reject AC unchanged
- Do **not** otherwise amend remaining `test_us0124_*` / `test_bug0015_*` / `test_us0125_*` / `test_bug0017_*`

### Consumer upgrade (DQ8 / NB1)

Runbook recipe: (1) upgrade its-magic to the BUG-0018 release; (2) `its-magic --mode upgrade --host opencode|both` (**must prune** `auto.md`); (3) if unlink blocked, operator deletes `.opencode/commands/auto.md` then re-upgrade.

## Touch surfaces (execute)

| Surface | Change |
|---------|--------|
| `.opencode/commands/auto.md` + `template/.opencode/commands/auto.md` | **Delete** |
| `.opencode/plugins/orchestrator.ts` + template | Keep attach; add `OPENCODE_AUTO_MARKDOWN_COLLISION`; leftover-file fail-closed in `runAutoLifecycle` |
| `installer.py` + `installer.sh` + `installer.ps1` | Targeted prune on upgrade `--host opencode\|both` |
| `scripts/check_intake_template_parity.py` `BUG0015_PAIRS` | Drop `auto.md` pair |
| `tests/us0125_contract_test.py` inventory | Drop `"auto"`; counts 15→14 / remaining 14→13; if-present dispatch-only |
| `tests/bug0015_contract_test.py` marker 6 | If-present |
| `tests/bug0017_opencode_eol_test.py` marker 4 | Plant path → `intake.md` (or peer) |
| `tests/bug0018_*` | 6 markers |
| `docs/engineering/runbook.md` (+ template) | Prune recipe + reason-code stub |

## Non-goals

- Rewrite DEC-0124 / DEC-0125 bodies
- Companion DEC
- Reopen BUG-0015 / BUG-0016 / BUG-0017
- Symptom B / `NATIVE_CHAIN_UNAVAILABLE` / Cursor Task port
- General template-absent file sweeper
- Empty/no-STOP leftover `auto.md`
- Live OpenCode CI probe
- Touch `.cursor/commands/auto.md` or `.opencode/agents/auto.md`
- Plugin deleting files

## Risks

| Risk | Severity | Mitigation |
|------|----------|------------|
| R1 Host lists only markdown files → `/auto` hidden | MEDIUM | Plugin `add` + D9; attach-missing fail-closed; no live probe |
| R2 Consumer leftover `auto.md` after kit-only fix | MEDIUM | DQ8 prune + marker 4 + runbook |
| R3 us0125/bug0015/bug0017 tests fail on absence | LOW | Compose-only if-present + inventory/plant-path (T-004/T-005) |
| R4 Symptom B mistaken for this bug | LOW | Out of scope (D8) |
| R5 Reason-code stub drift vs US-0126 | LOW | Stub + cross-link only |
| R6 Prune unlink fails (permissions) | LOW | Print `OPENCODE_AUTO_MARKDOWN_COLLISION`; operator delete |

## AC coverage mapping (bug acceptance + R-0120)

| Expected slice | Architecture anchor | Seeds |
|----------------|---------------------|-------|
| `/auto` invokes plugin execute → `runAutoLifecycle` (or documented `OPENCODE_*`) | A*; DQ1/DQ5 | T-001, T-002, T-005 |
| Markdown not sole runtime owner when plugin execute registered | Remove `auto.md`; CF1 supersede | T-001, T-005 (m1) |
| Slash listing preserved | Plugin `name`+`description` | T-002, T-005 (m2) |
| Consumer upgrade does not leave colliding `auto.md` | DQ8 prune | T-003, T-005 (m4), T-006 |
| No silent STOP | `OPENCODE_AUTO_MARKDOWN_COLLISION` | T-002, T-003, T-005 (m6), T-006 |
| Active↔template parity | D10 | T-001, T-002, T-005 (m3), T-007 |
| Compose BUG-0015 attach unchanged | Marker 5 | T-002, T-005 (m5) |

Acceptance checkbox: `docs/product/acceptance.md` BUG-0018 row remains unchecked until closure (US-0045).

## Atomic task seeds (for `/sprint-plan`)

| # | Seed | Surfaces |
|---|------|----------|
| T-anch | Verify `# BUG-0018` H1 + approach A* + R-0120 DQ1–DQ8 + CF1 superseded + no companion DEC | architecture.md, R-0120 (read-only) |
| T-001 | Delete colliding `.opencode/commands/auto.md` (active + template); keep other commands, agent `auto.md`, Cursor `auto.md` | `.opencode/commands/auto.md`, `template/.opencode/commands/auto.md` |
| T-002 | Keep plugin `editor.add({ name: "auto", execute })` → `runAutoLifecycle`; add `OPENCODE_AUTO_MARKDOWN_COLLISION`; leftover-file fail-closed | `orchestrator.ts` (active + template) |
| T-003 | Targeted prune of consumer `.opencode/commands/auto.md` on `upgrade --host opencode\|both`; print collision code if unlink fails | `installer.py`, `installer.sh`, `installer.ps1` |
| T-004 | Compose inventory/parity/plant-path: drop `auto` from US-0125 expected set; drop `BUG0015_PAIRS` auto.md pair; bug0017 plant → `intake.md`; if-present named tests | us0125 / bug0015 / bug0017 tests + parity script |
| T-005 | Add 6 `test_bug0018_*` markers; no live OpenCode probe | `tests/bug0018_*.py` |
| T-006 | Runbook: upgrade prune recipe + `OPENCODE_AUTO_MARKDOWN_COLLISION` stub (US-0126 cross-link) | `docs/engineering/runbook.md` + template |
| T-007 | Active↔template parity for plugin / runbook stub / installer prune helper paths touched | parity + template mirrors |

**Task count**: 8 seeds (T-anch + T-001..T-007). `SPRINT_MAX_TASKS=12` — no auto-split. Not `/quick` (delete + plugin + three installers + compose tests + runbook).

## Decision linkage

- Decision: **none** (companion DEC not required — cite **R-0120**)
- Compose (do not amend bodies): **DEC-0124**, **DEC-0125**, **DEC-0120**, **DEC-0132** (preserve paths — `auto.md` is not one)
- Research: **R-0120** (composes **R-0119** / **R-0114**; do not wipe)
- Related: **US-0124**, **US-0125**, **US-0069**, **US-0126** (stub only); **BUG-0015** / **BUG-0016** / **BUG-0017** DONE — out of scope

## Isolation evidence (US-0048 / DEC-0029)

- `phase_id=architecture`, `role=tech-lead`, `bug_id=BUG-0018`, `sprint_id=none`, `orchestrator_run_id=auto-20260912-bug0018`
- `delivery_mode=ultra_lean`, `macro_phase=plan`, `model_id=cursor-grok-4.6` (CROSS_MODEL_REVIEW=1)
- `fresh_context_marker=tl-BUG0018-architecture-20260912T100000Z-fresh`, `timestamp=2026-09-12T10:00:00Z`
- Narrow-read: R-0120; `# BUG-0015` CF1; BUG-0018 backlog; acceptance row; resume_brief; auto.md + plugin attach; installer upgrade copy-only; critic NBs
- No execute-surface mutation in this phase; no DONE flip; acceptance unchecked; no companion DEC; no DEC-0124/0125 body rewrite; CF1 historical cell not rewritten

## Strict runtime proof

- `runtime_proof_id=rp-auto-20260912-bug0018-architecture-techlead-20260912T100000Z-BUG-0018`
- Canonical payload: `{"delivery_mode":"ultra_lean","macro_phase":"plan","model_id":"cursor-grok-4.6","orchestrator_run_id":"auto-20260912-bug0018","phase_id":"architecture","proof_issued_at":"2026-09-12T10:00:00Z","proof_ttl_seconds":3600,"role":"tech-lead","runtime_proof_id":"rp-auto-20260912-bug0018-architecture-techlead-20260912T100000Z-BUG-0018","sprint_id":"none","story_id":"BUG-0018"}`
- `proof_hash=076F4C6E4744AB44B4751AF821572EB7082C8103EBD0091C9BC6EAB88351AA0B`
- `proof_ttl=2026-09-12T11:00:00Z`
- Consumed research proof: `rp-auto-20260912-bug0018-research-techlead-20260912T095000Z-BUG-0018` / `6E62DB20F5F4B898E086B6DD8385E3874A5A6DC43C896314F81F6C8D65E3AA0A` — RUNTIME_PROOF_VALID

