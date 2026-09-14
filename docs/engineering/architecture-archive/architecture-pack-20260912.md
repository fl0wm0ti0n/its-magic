# Architecture archive pack (2026-09-12)

- Rollover trigger: `ARCH_HOT_MAX_LINES=3000, ARCH_HOT_MAX_STORY_SECTIONS=120`
- Source: `docs/engineering/architecture.md`
- Archived units (oldest first, contiguous prefix): 1
- Retained units in hot file: 20
- First archived heading: `# US-0125 — Thin OpenCode commands and Python validator bridge`
- Last archived heading: `# US-0125 — Thin OpenCode commands and Python validator bridge`
- Verification tuple (mandatory):
  - archived_body_lines=266
  - preamble_lines=1
  - retained_body_lines=2807

---

# US-0125 — Thin OpenCode commands and Python validator bridge

## Overview

**US-0125** is the fifth slice of the six-story OpenCode adapter epic (US-0121..US-0126). US-0121 shipped the empty-but-valid `template/.opencode/` pack + the `--host` installer switch. US-0122 populated the pack with eight markdown role agents and locked the Layer-1 permission matrix. US-0123 locked the per-role `provider/slug` resolution chain. US-0124 shipped the orchestrator plugin that makes `/auto` spawn-only on the OpenCode host. US-0125 owns **Layer 3** — the named slash-command entry points (`/intake`, `/discovery`, `/research`, `/architecture`, `/sprint-plan`, `/plan-verify`, `/execute`, `/qa`, `/verify-work`, `/release`, `/closure`, `/refresh-context`, `/auto`, `/quick`, `/ask`) as **dispatch-only** markdown files at `template/.opencode/commands/<name>.md`, plus the **Python validator bridge contract** that keeps `scripts/*_validate.py` the single source of truth for persistence-blocking gates.

The commands **are** dispatch-only (do **not** clone Cursor 200-line command bodies per AC-1/AC-9). Success test (b) lives here: a model that ignores its prompt still cannot run `/release` (or any release persistence path) after a failing validator — the US-0124 plugin's `ctx.tool.hook("execute.before")` is the enforcement layer that a prompt-ignoring model cannot bypass (DQ4 defense in depth). The command prose is the *invitation* (diagnostics); the plugin is the *enforcement* (persistence).

This is an **additive commands + bridge-contract + stub-harness** change: 15 new template command files (`template/.opencode/commands/<name>.md`), one validator→artifact mapping table (US-0125-owned, US-0124-consumed), one mock-subprocess harness extension on the US-0124 `MockCtx`, one new contract test file (`tests/us0125_contract_test.py` — 11 markers), one stub runbook h2 one-liner, installer manifest rows for the 15 command files, and the companion DEC-0125. Template agent files (`template/.opencode/agents/*.md`) and the orchestrator plugin (`template/.opencode/plugins/orchestrator.ts`) are NOT edited by US-0125 — the commands compose with the US-0122 `auto.md` agent (DQ5/DQ8 — independent surfaces, defense in depth) and the US-0124 plugin (DQ4 — command = invitation, plugin = enforcement).

**Research anchor**: **R-0109** US-0125 deepened findings (DQ1..DQ8 LOCKED for `/architecture`; US-0121 Q1..Q12 + US-0122 DQ1..DQ8 + US-0123 DQ1..DQ10 + US-0124 DQ1..DQ8 locks PRESERVED, not wiped; 6 risks R1..R6 ACCEPTED; approach A1 locked; compose guards 7/7 verified; 3 research critic NBs closed here: `ik_us0125_dq5_auto_plugin_overlap` (dispatch-only `/auto`), `ik_us0125_dq3_validator_scope_boundary` (two named CLIs + generic bridge contract; US-0126 owns enumeration), `ik_us0125_spec_scope_minimal_pass` (informational)). **Companion DEC**: **DEC-0125** (authored Accepted in THIS phase — captures the locked command inventory + clone-guard metric + validator-bridge contract + defense-in-depth + `/auto` dispatch-only + frontmatter shape + reason-code boundary + stub-harness so US-0126 inherits without re-deriving).

**Fresh context marker**: `tl-US0125-architecture-20260824T203000Z-fresh`
**Orchestrator run id**: `auto-20260824-02`
**Timestamp**: 2026-08-24T20:30:00Z (UTC)
**Verdict**: PASS
**Next**: `/sprint-plan`

## Approach locked (A1 — from R-0109 US-0125 DQ1..DQ8)

**Approach A1** (locked): Ship a curated 15-file subset of thin OpenCode commands at `template/.opencode/commands/<name>.md` (12 lifecycle phases + `/auto` + `/quick` + `/ask`) (DQ1). Each file is dispatch-only: frontmatter (`description` + `agent: <role>` per DQ6; `/auto` adds `subtask: false`; `/ask` omits `agent`) + a short body (≤ 20 lines) that names the phase_id + artifact path list + STOP. No `model:` in any template command (US-0102 + US-0123). No 200-line Cursor command clones (AC-1, AC-9). Clone guard = per-file line cap ≤ 20 + normalized-text similarity ≤ 0.30 vs `.cursor/commands/<name>.md` via stdlib `difflib.SequenceMatcher` (DQ2 — no new test dependency). Python validators remain the single source of truth: US-0125 ships the subprocess bridge contract for the two named persistence-blocking gates (`scripts/intake_evidence_validate.py` + `scripts/bug_issue_validate.py`) plus a documented generic bridge contract any kit validator can invoke through; US-0126 owns the full validator enumeration in the runbook (DQ3). Defense in depth — command prose subprocesses the validator for *diagnostics*; the US-0124 plugin's `ctx.tool.hook("execute.before")` enforces *persistence* on non-zero exit (DQ4). `/auto` is a dispatch-only entry (`agent: auto` + `subtask: false` + no spawn logic); the US-0124 plugin remains the single spawn owner (DQ5). Reason codes: raw Python reason codes for validator non-zero exit; `OPENCODE_DRIVER_INVOKE_FAILED` (DEC-0124 DQ6) for subprocess invocation failure; no new `OPENCODE_*` wrapper (DQ7). Mock-ctx + mock-subprocess harness reuses the US-0124 `MockCtx`; no live OpenCode probe in CI (DQ8).

| Option | Summary | Verdict |
|--------|---------|---------|
| **A1** | **Curated 15-file subset + dispatch-only bodies + clone guard (line ≤ 20 + similarity ≤ 0.30 via difflib) + two named CLIs + generic bridge contract + defense-in-depth + `/auto` dispatch-only + raw Python reason codes + mock-ctx+mock-subprocess harness** | **Preferred** — additive only; composes with US-0001/US-0078/US-0121/US-0122/US-0124/US-0126/US-0102; AC-2/AC-4/AC-8/AC-10 provable via mock-ctx+mock-subprocess; critic NBs closed. |
| A2 (rejected) | Full 1:1 mirror (25 files) | **Rejected** — violates AC-1 (no 200-line clones) at the *intent* level; raises clone-guard surface unnecessarily; utility commands like `phase-context` are read pointers, not phases. |
| A3 (rejected) | Lifecycle-only (12 files) | **Rejected** — omits `/auto` (the orchestrator dispatch entry — required for OpenCode `/auto` to exist as a slash command per DQ5) and `/quick` (the `mega_quick` delivery-mode entry per US-0096 / DEC-0082). |
| A4 (rejected) | Enumerate every kit validator in US-0125 | **Rejected** — violates AC-3 (US-0125 owns the *bridge contract*, not the validator inventory); pre-empts US-0126 runbook territory. |
| A5 (rejected) | Command prose owns subprocess enforcement | **Rejected** — a prompt-ignoring model can skip the subprocess and write anyway; AC-4 success test (b) cannot be enforced at the command-prose layer. Enforcement must live in the plugin (DQ4). |
| A6 (rejected) | `/auto` command file with spawn logic | **Rejected** — violates US-0124 DQ8 (plugin owns spawn; command must not own spawn) + AC-1 (no 200-line clones); duplicates the plugin's spawn role. |
| A7 (rejected) | `OPENCODE_VALIDATOR_FAILED: <python_code>` wrapper | **Rejected** — duplicates the reason-code namespace (every Python code now has two surface forms); pre-empts US-0126's reason-code table. |
| A8 (rejected) | Live OpenCode probe in CI | **Rejected** — adds OpenCode runtime dependency to CI (flaky, version-coupled, slow); forbidden by AC-10 / vision D10 — same lock as US-0124 DQ3. |
| A9 (rejected) | Static AST/grep only (no runtime harness) | **Rejected** — too weak; cannot assert runtime behavior; AC-4 success test (b) needs the mock to return non-zero and assert the write is refused. |

## Components

### Command file inventory (DQ1 LOCKED — AC-1, AC-9)

`template/.opencode/commands/<name>.md` — 15 files (curated subset):

| # | File | Frontmatter `agent:` | Phase id | Notes |
|---|------|----------------------|----------|-------|
| 1 | `intake.md` | `po` | `intake` | lifecycle |
| 2 | `discovery.md` | `po` | `discovery` | lifecycle |
| 3 | `research.md` | `tech-lead` | `research` | lifecycle |
| 4 | `architecture.md` | `tech-lead` | `architecture` | lifecycle |
| 5 | `sprint-plan.md` | `tech-lead` | `sprint-plan` | lifecycle |
| 6 | `plan-verify.md` | `qa` | `plan-verify` | lifecycle |
| 7 | `execute.md` | `dev` | `execute` | lifecycle |
| 8 | `qa.md` | `qa` | `qa` | lifecycle |
| 9 | `verify-work.md` | `qa` | `verify-work` | lifecycle |
| 10 | `release.md` | `release` | `release` | lifecycle |
| 11 | `closure.md` | `qa` (prompt `role=qe`) | `closure` | lifecycle — **no `qe.md` agent in pack**; `/closure` binds `agent: qa` with prompt `role=qe` (same as Cursor Task type `qa` + `role=qe` per DEC-0051 / US-0120) |
| 12 | `refresh-context.md` | `curator` | `refresh-context` | lifecycle |
| 13 | `auto.md` | `auto` + `subtask: false` | (orchestrator) | dispatch-only — no spawn logic (DQ5) |
| 14 | `quick.md` | `tech-lead` | `quick` | `mega_quick` delivery-mode entry (US-0096 / DEC-0082) |
| 15 | `ask.md` | (omitted — defaults to current agent) | (read-only) | agent-agnostic |

The 10 omitted cursor commands (`pause`, `resume`, `status-reconcile`, `memory-audit`, `milestone-start`, `milestone-complete`, `phase-context`, `map-codebase`, `security-review`, `sovereign-critic`) are NOT shipped as OpenCode commands — their function is covered by the plugin (US-0124), the outer driver, or the built-in `@explore`/`@scout` subagents + `/ask`. `/resume` is intentionally omitted because OpenCode session continuation (`--continue`/`--session`/`--fork` per `opencode run`) plus the outer driver's `resume_brief.md` covers the same surface without a slash command.

### Frontmatter shape (DQ6 LOCKED — AC-1)

Per OpenCode command docs (`https://opencode.ai/docs/commands/`):

- `description` (string, shown in TUI command picker) — required in practice.
- `agent` (string, optional) — binds the command to a single role agent. Omitted for `/ask` (agent-agnostic).
- `model` (string, optional) — **MUST NOT** be set in any template command (US-0102 no-vendor-slugs + US-0123 owns model routing).
- `subtask` (boolean, optional) — `true` forces subagent invocation; `false` disables it. Lifecycle phase commands do NOT set `subtask` (the agent's own `mode: subagent` from US-0122 handles it); `/auto` sets `subtask: false` (the `auto` agent is `mode: primary` — `/auto` runs in the primary session, not as a subagent).
- Body: minimal dispatch prose (≤ ~12 lines) naming the phase_id + artifact path list + STOP. No `$ARGUMENTS` (phase commands take no args), no shell injection, no `@file` inclusion.

### Clone guard (DQ2 LOCKED — AC-2)

Two metrics, defense in depth:

- **Per-file line cap**: ≤ **20 lines** (including frontmatter + body). A dispatch-only command is roughly 12–15 lines; 20 gives a comfortable margin while staying far below the 200-line cursor bodies. Files > 20 lines fail the guard.
- **Normalized-text similarity threshold**: normalized token-set ratio vs `.cursor/commands/<name>.md` ≤ **0.30**. Normalization: strip frontmatter + lowercase + strip punctuation + strip the shared phase-name vocabulary. Use stdlib `difflib.SequenceMatcher` (no new test dependency). Files with similarity > 0.30 fail the guard.

`test_us0125_clone_guard` iterates over the 15 shipped `.opencode/commands/*.md` files; for each, asserts (i) line count ≤ 20, (ii) normalized similarity vs `.cursor/commands/<name>.md` ≤ 0.30. Fails on either violation.

### Validator bridge contract (DQ3, DQ4, DQ7 LOCKED — AC-3, AC-5)

**In-scope named persistence-blocking gates** (US-0125 ships explicit subprocess bridge + contract tests):

- `scripts/intake_evidence_validate.py` — `python scripts/intake_evidence_validate.py --repo . [--enforce]` → exit 0 = pass, exit non-zero = fail (raw Python reason code on stderr, e.g. `INTAKE_PERSISTENCE_BLOCKED`, `INTAKE_REQUIRED_TOPIC_MISSING`).
- `scripts/bug_issue_validate.py` — `python scripts/bug_issue_validate.py --repo . --check-acceptance` → exit 0 = pass, exit non-zero = fail (raw Python reason code on stderr, e.g. `BUG_ISSUE_VALIDATION_FAILED`).

**Generic bridge contract** (US-0125 documents; any kit validator can use it): `python scripts/<validator>.py --repo . [--enforce] [--scope <scope>]` → exit 0 = pass, exit non-zero = fail (raw Python reason code on stderr). The plugin/command subprocess invokes this and on non-zero exit emits the raw Python reason code (DQ7) and refuses the persistence path (DQ4).

**Out-of-scope** (US-0126 owns the full enumeration in the runbook): `closure-verification`, `enforce-triad-hot-surface`, `model_tier_validate`, `release_changelog_lib`, `check_intake_template_parity`, `sovereign_critic_validate`, `sovereign_loop_validate`, `validate_autonomy_stop_matrix`, `validate_readme_feature_coverage`, etc. These remain Python SOT; US-0125's bridge contract *applies* to them but US-0125 does not enumerate them.

### Defense-in-depth validator enforcement (DQ4 LOCKED — AC-3, AC-4)

Two layers, independent:

- **Command prose** (`.opencode/commands/<phase>.md` body): a short line says "Before writing to `<artifact>`, run `python scripts/<validator>.py --repo .` and surface any non-zero exit reason code to the operator. The orchestrator plugin enforces persistence." This is *informational* — it tells the agent the right thing to do, but does not own enforcement.
- **Plugin enforcement** (US-0124 `template/.opencode/plugins/orchestrator.ts` `ctx.tool.hook("execute.before")`): on any `edit`/`write`/`apply_patch` to a persistence-blocking artifact path, the plugin subprocesses the corresponding validator and refuses the write on non-zero exit, emitting the raw Python reason code (DQ7). This is the *enforcement* layer that AC-4 success test (b) asserts.

**Boundary with US-0124**: US-0124 owns the plugin `ctx.tool.hook` enforcement; US-0125 owns the command prose + the *validator→artifact mapping* (which validator gates which artifact path). The mapping is a US-0125 contract that the plugin consumes; US-0125 authors the mapping table, US-0124 authors the hook that reads it.

### Validator→artifact mapping table (DQ4 LOCKED — AC-3, AC-4; critic NB `ik_us0125_dq3_validator_scope_boundary` closed)

US-0125 authors and owns the validator→artifact mapping. The table lives in the US-0125 architecture section (here) and is consumed read-only by the US-0124 plugin `ctx.tool.hook("execute.before")`. The mapping is additive — US-0124 plugin hook reads it; US-0125 does not modify the plugin. (Critic NB `ik_us0125_dq4_plugin_mapping_coupling` closed: US-0125 owns the mapping table; US-0124 plugin hook remains enforcement — additive compose, no spawn-owner change.)

| Artifact path (persistence-blocking) | Validator CLI | Reason code surface |
|----------------------------------------|---------------|---------------------|
| `handoffs/intake_evidence/*.json` (intake evidence writes) | `scripts/intake_evidence_validate.py --repo . --enforce` | `INTAKE_PERSISTENCE_BLOCKED`, `INTAKE_REQUIRED_TOPIC_MISSING`, ... |
| `docs/product/backlog.md` bug rows + `docs/product/acceptance.md` bug rows | `scripts/bug_issue_validate.py --repo . --check-acceptance` | `BUG_ISSUE_VALIDATION_FAILED`, ... |
| (other persistence-blocking artifacts) | (generic bridge contract — US-0126 owns enumeration) | (raw Python reason code per validator) |

The plugin reads this mapping at hook-fire time. Adding a new persistence-blocking artifact = author a new row in US-0125 (or US-0126 runbook) + ensure the validator CLI exists; the plugin hook logic is unchanged (US-0124 owns the hook; US-0125 owns the data).

### `/auto` dispatch-only entry (DQ5 LOCKED — AC-1, AC-7; critic NB `ik_us0125_dq5_auto_plugin_overlap` closed)

`template/.opencode/commands/auto.md` is a **dispatch-only** entry point:

- Frontmatter: `description: "its-magic auto: orchestrator dispatch entry (spawn-only)."` + `agent: auto` + `subtask: false` (the `auto` agent is `mode: primary` — `/auto` runs in the primary session, not as a subagent).
- Body: a short dispatch prose that names the orchestrator role + points to the plugin for spawn + STOP. No spawn logic, no `ctx.session.create` call, no state-machine prose.
- The command binds to the `auto` agent (US-0122 `template/.opencode/agents/auto.md` — `mode: primary`, `edit: deny`, `bash: deny`, `task` 7-role allow-list). The agent's permission array is the first enforcement layer; the plugin's `ctx.tool.hook` + `ctx.session.create` is the second.
- `test_us0125_auto_command_dispatch_only` asserts (i) `auto.md` line count ≤ 20 (DQ2), (ii) `auto.md` has no `ctx.session.create` / `Session.create` / `spawn` logic literals, (iii) `auto.md` `agent: auto` frontmatter is present.
- **Missing `/auto` (AC-7)**: if `auto.md` is deleted/renamed, the operator can still invoke the orchestrator agent via `@auto` mention (US-0122 agent is independent of the command file) and the plugin still loads via `.opencode/plugins/` auto-discovery. `test_us0125_missing_command_does_not_disable_plugin` asserts this.

### Reason-code boundary (DQ7 LOCKED — AC-5)

- **Validator non-zero exit** (the validator ran and returned non-zero): surface the **raw Python reason code** from stderr. No `OPENCODE_*` wrapper. Examples: `INTAKE_PERSISTENCE_BLOCKED`, `INTAKE_REQUIRED_TOPIC_MISSING`, `BUG_ISSUE_VALIDATION_FAILED`.
- **Subprocess invocation failure** (the Python CLI could not be invoked — missing Python, missing script, subprocess timeout): emit `OPENCODE_DRIVER_INVOKE_FAILED` (already locked by DEC-0124 DQ6). This is the *host-specific* code for "the bridge itself broke" — distinct from the validator's own non-zero exit.
- **No silent skip** (AC-5): both failure modes emit a reason code and refuse the persistence path. The plugin's `ctx.tool.hook("execute.before")` is the enforcement layer (DQ4); the command prose surfaces the code to the operator for diagnostics.
- **Reason-code table location**: US-0125 ships a **stub reason-code reference** in the US-0125 runbook section of `docs/engineering/runbook.md` (h2 anchor `## OpenCode thin commands + validator bridge (US-0125)`) that lists the two named validator CLIs + their canonical Python reason codes + a cross-link to US-0126 for the full reason-code table. US-0126 owns the full table; US-0125 ships the stub only — no duplication of remediation text.

### Mock-ctx + mock-subprocess harness (DQ8 LOCKED — AC-4, AC-8, AC-10)

Extend the US-0124 `MockCtx` harness (`tests/us0124/mock_ctx.ts`) with a `mockSubprocess` field (or add a sibling `tests/us0125/mock_subprocess.ts` imported by the US-0125 test). The mock subprocess accepts a scripted `nextExitCode` (0 or non-zero) + `nextStderr` (the raw Python reason code) + `nextThrow` (for `OPENCODE_DRIVER_INVOKE_FAILED` simulation). The plugin's `ctx.tool.hook("execute.before")` calls the mock subprocess; tests assert the hook refuses the write on non-zero. No OpenCode runtime dependency — CI runs pure Node/Bun (same as US-0124). **Runner: Node** (consistent with US-0124 DQ3).

### AC-8 contract-test list (locked — 11 markers)

`tests/us0125_contract_test.py` — markers:

| # | Marker | AC |
|---|--------|-----|
| 1 | `test_us0125_command_inventory` (15 files present at `template/.opencode/commands/`; no extra; no `.gitkeep` after populate) | AC-1 |
| 2 | `test_us0125_clone_guard` (per-file line ≤ 20 + normalized-text similarity ≤ 0.30 via `difflib.SequenceMatcher` vs `.cursor/commands/<name>.md`) | AC-2 |
| 3 | `test_us0125_validator_subprocess_fail_closed` (bridge contract for the two named CLIs — stubbed non-zero → command/plugin does not proceed to persistence) | AC-3 |
| 4 | `test_us0125_release_blocked_after_failing_validator` (success test (b) — mock-ctx+mock-subprocess; validator non-zero → plugin `ctx.tool.hook("execute.before")` refuses write to release persistence path; raw Python reason code emitted) | AC-4 |
| 5 | `test_us0125_reason_code_raw_python` (grep command/plugin source for `OPENCODE_VALIDATOR_FAILED` wrapper — zero hits; raw Python codes surface as-is; `OPENCODE_DRIVER_INVOKE_FAILED` only for subprocess invocation failure) | AC-5 |
| 6 | `test_us0125_no_policy_in_commands` (grep 15 command files for policy text duplicating validator logic — zero hits) | AC-6 |
| 7 | `test_us0125_missing_command_does_not_disable_plugin` (delete a command file in a temp copy → plugin still loads via `.opencode/plugins/` auto-discovery; `@auto` agent still invocable) | AC-7 |
| 8 | `test_us0125_auto_command_dispatch_only` (`auto.md` ≤ 20 lines + no `ctx.session.create`/`Session.create`/`spawn` literals + `agent: auto` frontmatter present) | AC-1, AC-7 |
| 9 | `test_us0125_cursor_commands_unchanged` (git diff `.cursor/commands/*.md` — zero changes) | AC-9 |
| 10 | `test_us0125_no_new_npm_runtime` (grep `package.json` + consumer app code for new runtime deps — zero hits; validator bridge is kit scripts + plugin subprocess) | AC-10 |
| 11 | `test_us0125_command_frontmatter_shape` (15 files: `description` present; `agent` present for 14 (omitted for `/ask`); no `model:` in any; `subtask: false` only on `/auto`) | AC-1, AC-8 |

Surjective AC coverage: AC-1 (markers 1, 8, 11), AC-2 (marker 2), AC-3 (markers 3, 4), AC-4 (marker 4), AC-5 (marker 5), AC-6 (marker 6), AC-7 (markers 7, 8), AC-8 (marker 11), AC-9 (marker 9), AC-10 (marker 10). Every AC has ≥1 marker.

## Risks mitigated

All 6 risks from R-0109 US-0125 ACCEPTED, plus 3 research critic NBs closed:

| Risk | Severity | Mitigation |
|------|----------|------------|
| R1: Clone drift — `.opencode/commands/` accidentally copies `.cursor/commands/` bodies above threshold | MEDIUM → LOW | DQ2 clone guard (line cap ≤ 20 + similarity ≤ 0.30); T-002 + T-006 `test_us0125_clone_guard` asserts both metrics. |
| R2: Validator reimplementation temptation — a rule that should be a Python CLI check leaks into command prose | MEDIUM → LOW | DQ4 defense-in-depth (command prose = diagnostics; plugin = enforcement) + AC-6 grep test `test_us0125_no_policy_in_commands` asserts no policy text duplicating validator logic. |
| R3: `/auto` command duplicates plugin spawn logic | MEDIUM → LOW | DQ5 dispatch-only `/auto` (`agent: auto` + `subtask: false` + no `ctx.session.create`); T-006 `test_us0125_auto_command_dispatch_only` asserts no spawn literals. |
| R4: Reason-code namespace duplication (wrapper pre-empts US-0126 table) | LOW–MEDIUM → LOW | DQ7 raw Python codes + `OPENCODE_DRIVER_INVOKE_FAILED` (DEC-0124 DQ6) for subprocess failure; T-006 `test_us0125_reason_code_raw_python` asserts no `OPENCODE_VALIDATOR_FAILED` wrapper. |
| R5: Missing convenience command disables plugin spawn | LOW–MEDIUM → LOW | DQ5 + AC-7; T-006 `test_us0125_missing_command_does_not_disable_plugin` asserts deleting a command file does not break plugin auto-discovery or `@auto` agent invocation. |
| R6: Live OpenCode runtime probe accidentally added to CI (AC-10 violation) | LOW → LOW | DQ8 mock-ctx + mock-subprocess harness; T-005 + T-006 contract tests run pure Node/Bun; CI has no `opencode` dependency. |
| C1 (critic NB): `ik_us0125_dq5_auto_plugin_overlap` | → closed | DQ5 dispatch-only `/auto` (`agent: auto` + `subtask: false` + no spawn logic); plugin (US-0124) remains single spawn owner; defense in depth. |
| C2 (critic NB): `ik_us0125_dq3_validator_scope_boundary` | → closed | DQ3 two named CLIs + generic bridge contract; US-0126 owns full enumeration in runbook. |
| C3 (critic NB): `ik_us0125_spec_scope_minimal_pass` | → closed | Informational; spec did not over-scope; DQ1..DQ8 closed before marker enumeration. |

## Non-goals (this slice)

- **US-0126** (full runbook + reason-code table + `--scope=opencode-adapter` parity) — US-0125 ships stub reason-code reference only.
- **Enumerate every kit validator** — US-0125 ships the bridge contract; US-0126 owns the full enumeration.
- **Edit `template/.opencode/agents/*.md`** — US-0122 owns agent files; US-0125 commands bind via `agent:` frontmatter (compose, not amend).
- **Edit `template/.opencode/plugins/orchestrator.ts`** — US-0124 owns the plugin; US-0125 authors the validator→artifact mapping that the plugin consumes (additive data, not plugin code change).
- **Repo-root `opencode.json`** — not shipped (R-0109 Q6 US-0121 lock preserved).
- **New npm runtime in consumer app code** — out of scope (AC-10); validator bridge is kit scripts + plugin subprocess.
- **Port `.cursor/commands/*.md` 200-line bodies** — forbidden (AC-1, AC-9).
- **New validator script** — default rejected (extend contract tests; only add `scripts/opencode_command_validate.py` if US-0125 command files need static validation beyond contract tests).

## Compose guards (UNCHANGED — additive only)

| Compose target | Verification | Result |
|---|---|---|
| US-0001 (phase names + artifact outputs) | 15 command files use phase names + artifact paths; no 200-line clones (AC-9) | ✅ compose |
| US-0078 / DEC-0060 (`intake_evidence_validate.py` persistence gate) | validator remains Python SOT; thin commands subprocess, do not reimplement | ✅ compose |
| US-0121 / DEC-0120 (host default cursor-only + reserved `template/.opencode/commands/` slot) | commands live in reserved slot; `.gitkeep` replaced by 15 files | ✅ consumed |
| US-0122 / DEC-0122 (seven role agents) | commands bind via `agent: <role>`; agents unchanged | ✅ compose |
| US-0124 / DEC-0124 (plugin owns spawn + `ctx.tool.hook` enforcement) | `/auto` is dispatch-only; plugin owns spawn + `ctx.tool.hook` enforcement; no spawn logic in commands; missing command must not disable plugin (US-0124 AC-7 ↔ US-0125 AC-7) | ✅ compose |
| US-0126 (full runbook + reason-code table + `--scope=opencode-adapter` parity) | US-0125 ships stub reason-code reference only; US-0126 owns full text | ✅ boundary |
| US-0102 / DEC-0087 (no vendor slugs in `template/`) | no `model:` literals in any command frontmatter | ✅ untouched |

Contract test `test_us0125_cursor_commands_unchanged` (marker 9) + `test_us0125_no_new_npm_runtime` (marker 10) + `test_us0125_command_frontmatter_shape` (marker 11) enforce at execute boundary.

## Sprint seeds preview (within SPRINT_MAX_TASKS=12)

| Seed | Description | AC |
|------|-------------|-----|
| **T-anch** | Verify `# US-0125` H1 anchor placed AFTER `# US-0124` and BEFORE `US-0089`; DEC-0125 Accepted; compose guards 7/7; 11-marker list locked; command inventory + clone-guard + validator-bridge + defense-in-depth + `/auto` dispatch-only + frontmatter shape + reason-code boundary + stub-harness locked in DEC-0125. | AC-9, AC-10 |
| **T-001** | 15 thin command files at `template/.opencode/commands/<name>.md` — frontmatter `description` + `agent` (+ `subtask: false` for `/auto`; `/ask` omits `agent`); dispatch-only body naming phase_id + artifact path list + STOP; each ≤ 20 lines. | AC-1 |
| **T-002** | Clone-guard contract test `test_us0125_clone_guard` — per-file line cap ≤ 20 + normalized-text similarity ≤ 0.30 via `difflib.SequenceMatcher` vs `.cursor/commands/<name>.md`. | AC-2 |
| **T-003** | Validator→artifact mapping table — authored by US-0125, consumed by US-0124 plugin; documents which validator gates which persistence artifact path; lives in US-0125 architecture section (here). | AC-3, AC-4 |
| **T-004** | Validator subprocess bridge — command prose line shape for the 12 lifecycle phase commands + `/auto` + `/quick` + `/ask` that invites the agent to run the validator for diagnostics; plugin `ctx.tool.hook("execute.before")` enforcement is US-0124 territory — US-0125 authors the contract, US-0124 authors the hook. | AC-3, AC-5 |
| **T-005** | Mock-subprocess harness extension — extend `tests/us0124/mock_ctx.ts` with `mockSubprocess` OR add `tests/us0125/mock_subprocess.ts`; scripted `nextExitCode`/`nextStderr`/`nextThrow`. | AC-4, AC-8, AC-10 |
| **T-006** | Contract tests `tests/us0125_contract_test.py` — 11 markers (see AC-8 table above). | AC-8 |
| **T-007** | Installer manifest rows for `template/.opencode/commands/*.md` under `[opencode_install_include_paths]` + triple-installer parity — US-0121 manifest extension, additive. | AC-1 |
| **T-008** | README + template parity — `check_intake_template_parity.py --scope=opencode-adapter` extension for the 15 command files; `its_magic/README.md` cross-link; stub reason-code reference in `docs/engineering/runbook.md` h2 `## OpenCode thin commands + validator bridge (US-0125)`. | AC-8 |
| **T-009** | Validator extension on `scripts/model_tier_validate.py` OR new `scripts/opencode_command_validate.py` — only if US-0125 command files need static validation beyond contract tests; default: extend contract tests, no new validator script. | AC-8 |

**Total: 10 tasks (T-anch + T-001..T-009) — within `SPRINT_MAX_TASKS=12`.** `/sprint-plan` may merge or split within the 12-task budget.

**AC mapping (10 ACs → 10 tasks surjective)**: AC-1 → T-001+T-006+T-007; AC-2 → T-002+T-006; AC-3 → T-003+T-004+T-006; AC-4 → T-003+T-005+T-006; AC-5 → T-004+T-006; AC-6 → T-006; AC-7 → T-006; AC-8 → T-006+T-008; AC-9 → T-anch+T-006; AC-10 → T-005+T-006.

## DC check

`dc_check=clean`. No `# US-0125` or `## US-0125` existed in `architecture.md` prior to THIS write (verified by R-0109 US-0125 DC check). H1 anchor added per DEC-0076 / BUG-0010 heading policy. Deferral register clean.

## Stop conditions

- `decision_gate=false`
- `missing_acceptance_criteria=none` (10/10 ACs covered by 11 contract-test markers + compose guards + T-008 runbook stub)
- `compose_guards=7/7 UNCHANGED (additive only)`
- `dc_check=clean`
- DQ1..DQ8 LOCKED for US-0125; 6/6 R ACCEPTED; A1 locked; 3 research critic NBs closed; 3 spec critic NBs closed (carried from research)
- Triad baseline `baseline_h2_count=38` preserved (H1 used, not H2)
- Triad `--rollover` + `--check` + `--check-arch-heading-policy --baseline-h2-count 38` (run from repo root after this write)

## Sovereign memory note

`assemble_sovereign_memory_digest(...)` NOT called. No write to `mistakes.jsonl`.

## Consequences

- **Positive**: Operators on the OpenCode host get named slash-command entry points for the 12 lifecycle phases + `/auto` + `/quick` + `/ask` without 200-line Cursor clones; success test (b) is provable via mock-ctx+mock-subprocess harness + plugin `ctx.tool.hook("execute.before")` enforcement; Python validators remain the single source of truth (no TypeScript reimplementation); US-0126 inherits the locked command inventory + clone-guard + validator-bridge contract + defense-in-depth + `/auto` dispatch-only + frontmatter shape + reason-code boundary via DEC-0125 without re-deriving; US-0001/US-0078/US-0121/US-0122/US-0124/US-0102 compose unchanged.
- **Negative**: 15 new template command files; one mock-subprocess harness extension; one new contract test file (11 markers); one stub runbook h2 one-liner; installer manifest rows for 15 command files (T-007).
- **Neutral**: US-0121 reserved `template/.opencode/commands/` slot consumed (`.gitkeep` replaced); US-0122 agents unchanged; US-0124 plugin unchanged (US-0125 authors mapping data, not plugin code); US-0102 volatile-ID rule respected; Cursor `.cursor/commands/*.md` unchanged.

## Isolation evidence (US-0048 / DEC-0029)

- `phase_id=architecture`, `role=tech-lead`, `story_id=US-0125`, `sprint_id=(pending — created at sprint-plan)`
- `orchestrator_run_id=auto-20260824-02`
- `delivery_mode=ultra_lean`, `macro_phase=plan` (architecture — second canonical phase of `plan` macro per US-0096 / DEC-0082)
- `model_id=glm-5.2-high` (CROSS_MODEL_REVIEW=1 — required; this spawn's producer model)
- `fresh_context_marker=tl-US0125-architecture-20260824T203000Z-fresh`, `timestamp=2026-08-24T20:30:00Z` (UTC)
- `evidence_ref=docs/engineering/architecture.md # US-0125 (this section), decisions/DEC-0125.md (companion DEC), docs/engineering/research.md ## R-0109 (US-0125 deepened findings DQ1..DQ8 LOCKED), docs/product/backlog.md ## US-0125 (D1..D10 + 10 ACs + DQ1..DQ8, status OPEN untouched, AC checkboxes untouched), docs/product/acceptance.md US-0125 row (unchecked), docs/product/vision.md ## Intake Notes — US-0125 + ## Discovery Notes — US-0125, handoffs/po_to_tl.md US-0125 section, handoffs/sovereign_critic_findings.jsonl US-0125 research rows (3 non-blocking carry-forwards closed here), decisions/DEC-0124.md (read-only compose — DQ6 subprocess + DQ8 agent/plugin boundary), decisions/DEC-0122.md (read-only compose), decisions/DEC-0120.md (read-only compose), decisions/DEC-0060.md (read-only compose — intake_evidence_validate.py persistence gate), decisions/DEC-0051.md (read-only compose — phase→role matrix), template/.opencode/commands/.gitkeep (US-0121 reserved slot — US-0125 owns directory body), template/.opencode/agents/auto.md (grep mode:/permission:/task: anchors — DQ5/DQ8 boundary source), template/.opencode/plugins/README.md (US-0121 reserved slot — US-0124 owns directory body), .cursor/commands/*.md (25 files — read-only compose for clone-guard baseline), docs/engineering/architecture.md # US-0124 (format template), docs/engineering/decisions.md ## DEC-0125 (stub flipped to Accepted), handoffs/resume_brief.md (US-0125 architecture PASS prepend)`
- Fresh tech-lead subagent per BUG-0006 / US-0048 isolation; no prior chat history carried forward. Context limited to narrow-read files (US-0053). No `.env` reads, no credentials access, no intake-evidence mutation, no backlog status/AC mutation.
- Prior proof consumed: `rp-auto-20260824-02-research-tech-lead-20260824T201200Z-US-0125` (`proof_hash=0421404192BE970322D58636ADFF565FF1714C8B9EDB5C2A88DBFA70581A5271`, ttl 2026-08-24T21:12:00Z — consumed before RUNTIME_PROOF_STALE).
- Triad baseline `baseline_h2_count=38` preserved via H1 anchor (no new H2 `## US-` headings added).

## Strict runtime proof (DEC-0038)

- `runtime_proof_id=rp-auto-20260824-02-architecture-tech-lead-20260824T203000Z-US-0125`
- Canonical payload (sorted-key JSON per DEC-0038): `{"delivery_mode":"ultra_lean","macro_phase":"plan","model_id":"glm-5.2-high","orchestrator_run_id":"auto-20260824-02","phase_id":"architecture","proof_issued_at":"2026-08-24T20:30:00Z","proof_ttl_seconds":3600,"role":"tech-lead","runtime_proof_id":"rp-auto-20260824-02-architecture-tech-lead-20260824T203000Z-US-0125","sprint_id":"(pending)","story_id":"US-0125"}`
- `proof_hash` computed via SHA-256 of sorted-key JSON payload, UTF-8 bytes via `C:\Users\flow\AppData\Local\Programs\Python\Python312\python.exe` hashlib (see verification below).
- `proof_ttl_seconds=3600`, `proof_ttl=2026-08-24T21:30:00Z` (UTC = issued_at + 3600s)

## Decision gate

- `decision_gate=false` (companion DEC-0125 authored Accepted in THIS phase; approach A1 locked; DQ1..DQ8 LOCKED for US-0125; 6/6 R ACCEPTED; 3 research critic NBs closed; 3 spec critic NBs closed; DC check clean; compose guards 7/7 UNCHANGED)
- `stop_conditions_met=yes`

## Next scheduled phase

- `next_scheduled_phase=/sprint-plan` (role=tech-lead per US-0069 / DEC-0051 phase→role matrix default; third canonical phase of `plan` macro per ultra_lean; research + architecture + sprint-plan merged into `plan` macro)
- `next_scheduled_role=tech-lead`
- `stop_condition=STOP after architecture completes; hand off via artifacts only to /sprint-plan in fresh tech-lead subagent (BUG-0006). Do not spawn /sprint-plan from this subagent.`

