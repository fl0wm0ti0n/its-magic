# Architecture archive pack (2026-09-11)

- Rollover trigger: `ARCH_HOT_MAX_LINES=3000, ARCH_HOT_MAX_STORY_SECTIONS=120`
- Source: `docs/engineering/architecture.md`
- Archived units (oldest first, contiguous prefix): 1
- Retained units in hot file: 20
- First archived heading: `# US-0124 — OpenCode orchestrator plugin spawn-only `/auto``
- Last archived heading: `# US-0124 — OpenCode orchestrator plugin spawn-only `/auto``
- Verification tuple (mandatory):
  - archived_body_lines=204
  - preamble_lines=1
  - retained_body_lines=2876

---

# US-0124 — OpenCode orchestrator plugin spawn-only `/auto`

## Overview

**US-0124** is the fourth slice of the six-story OpenCode adapter epic (US-0121..US-0126). US-0121 shipped the empty-but-valid `template/.opencode/` pack + the `--host` installer switch. US-0122 populated the pack with eight markdown role agents and locked the Layer-1 permission matrix (with `model:` omitted from every template agent per AC-7). US-0123 locked the per-role `provider/slug` resolution chain (local-only catalog + materializer + validator extension). US-0124 owns the **orchestrator plugin** that makes `/auto` spawn-only on the OpenCode host: resolve `phase_id → role` via US-0069, spawn an isolated child session via v2 `ctx.session.create`, write isolation evidence, honor the US-0092 stop matrix via a Python subprocess, and refuse orchestrator (or any role) performing another role's artifact writes.

The plugin **is** the OpenCode native chain (do **not** port US-0095 Cursor Task-loop per AC-9). Success tests (a) and (d) live here: a model that ignores its prompt still cannot skip spawn isolation (same-session roleplay is rejected) and `/auto` cannot continue to the next phase without a fresh session for the next role.

This is an **additive plugin + mock-harness + stub-table** change: one new template plugin file (`template/.opencode/plugins/orchestrator.ts`), one new mock-ctx harness (`tests/us0124/mock_ctx.ts`), one new contract test file (`tests/us0124_contract_test.py` — 9 markers), one stub runbook h2 one-liner, one additive CLI extension on `scripts/auto_outer_driver.py` (T-004 — legacy behavior byte-identical when new flags absent), installer manifest rows for the plugin file, and the companion DEC-0124. Template agent files (`template/.opencode/agents/*.md`) are NOT edited by US-0124 — the plugin composes with the US-0122 `auto.md` agent (DQ8 — independent surfaces, defense in depth).

**Research anchor**: **R-0109** US-0124 deepened findings (DQ1..DQ8 LOCKED for `/architecture`; US-0121 Q1..Q12 + US-0122 DQ1..DQ8 + US-0123 DQ1..DQ10 locks PRESERVED, not wiped; 7 risks R1..R7 ACCEPTED; approach A1 locked; compose guards 9/9 verified; 3 spec critic NBs closed; 3 research critic NBs closed here: `ik_us0124_dq6_driver_fail_code_conflation` (distinct `OPENCODE_DRIVER_INVOKE_FAILED` vs `OPENCODE_HEADLESS_UNSUPPORTED`), `ik_us0124_dq6_argv_extension_gap` (T-004 additive argv extension), `ik_us0124_research_scope_yagni` (informational)). **Companion DEC**: **DEC-0124** (authored Accepted in THIS phase — captures the locked plugin entry-point + spawn API + stub-harness + reason-code namespace + detection matrix + stop-matrix integration + headless CLI + agent/plugin boundary so US-0125..US-0126 inherit without re-deriving).

**Fresh context marker**: `tl-US0124-architecture-20260824T183000Z-fresh`
**Orchestrator run id**: `auto-20260824-02`
**Timestamp**: 2026-08-24T18:30:00Z (UTC)
**Verdict**: PASS
**Next**: `/sprint-plan`

## Approach locked (A1 — from R-0109 DQ1..DQ8)

**Approach A1** (locked): Orchestrator plugin ships as a single TypeScript file at `template/.opencode/plugins/orchestrator.ts` with the canonical v2 module shape `export default Plugin.define({ id: "its-magic.orchestrator", setup })` (DQ1). Auto-discovery via `.opencode/plugins/` — no `plugins[]` entry in `opencode.json` required (US-0121 ships no `opencode.json` in template; Q6 US-0121 lock preserved). The plugin's `setup` registers: (a) `ctx.tool.hook("execute.before", ...)` write-guard that detects `AUTO_ORCHESTRATOR_PHASE_EXECUTION` (orchestrator or any role performing another role's artifact writes) and fails closed; (b) spawn entry point that resolves `phase_id → role` via US-0069 / DEC-0051 matrix, calls `ctx.session.create({ parentID: <orchestrator-session-id>, agent: <role>, prompt: <phase-prompt> })`, asserts `sessionID !== parentID` (DQ5 hard post-condition), `ctx.session.wait(sessionID)`, and persists isolation evidence (AC-3); (c) subprocess callout to `scripts/auto_outer_driver.py` for stop-matrix decisions (DQ6 — additive argv; Python SOT unchanged; forbidden TS reimpl). The stub-harness is mock `ctx` in a Node test runner (DQ3 — no live OpenCode probe in CI). Four new `OPENCODE_*` codes + three reused codes + stub runbook table (DQ4). Three-case subtask-ignored detection matrix with throw-discrimination rule (DQ5). Headless CLI = `opencode run --agent auto --format json --auto` + fail-closed `OPENCODE_HEADLESS_UNSUPPORTED` (DQ7). Agent vs plugin independent surfaces, defense in depth, no permission-array duplication (DQ8).

| Option | Summary | Verdict |
|--------|---------|---------|
| **A1** | **v2 `Plugin.define` + `ctx.session.create` spawn + mock-ctx harness + subprocess stop-matrix + four `OPENCODE_*` codes + three-case detection matrix + `opencode run` headless + agent/plugin defense in depth** | **Preferred** — additive only; composes with US-0069/US-0092/US-0095/US-0023/US-0048/US-0005/US-0122/US-0121/US-0125/US-0102; AC-4/AC-5/AC-8/AC-10 provable via mock-ctx; critic NBs closed. |
| A2 (rejected) | v1 `@opencode-ai/plugin` default-export shape with `subtask` command | **Rejected** — v1 `subtask` command is not present in v2 docs; v2 is the documented forward path (R-0109 Q1 LOCKED for /architecture as v2). |
| A3 (rejected) | Live `opencode serve` probe in CI | **Rejected** — adds OpenCode runtime dependency to CI (flaky, version-coupled, slow); forbidden by AC-10 / vision D10. |
| A4 (rejected) | Static AST/grep only (no runtime harness) | **Rejected** — too weak; cannot assert runtime behavior; DQ5 detection matrix needs the mock to return each case. |
| A5 (rejected) | Reimplement US-0092 state machine in TypeScript | **Rejected** — forbidden by AC-6 + DQ6; two SOTs would drift; Python validators (US-0125) and TS plugin would diverge on edge cases. |
| A6 (rejected) | Plugin copies agent's permission array | **Rejected** — violates DQ8 ownership boundary; erodes defense in depth to single layer; `test_us0124_agent_plugin_compose` asserts non-duplication. |
| A7 (rejected) | Port `.cursor/commands/auto.md` prose into plugin | **Rejected** — violates AC-9; plugin composes US-0069 + US-0092 semantics, not prose port; `test_us0124_no_cursor_auto_clone` enforces. |
| A8 (rejected) | Map Python driver subprocess failure to `OPENCODE_HEADLESS_UNSUPPORTED` | **Rejected** — critic NB `ik_us0124_dq6_driver_fail_code_conflation`; distinct `OPENCODE_DRIVER_INVOKE_FAILED` reserved for driver subprocess failure; `OPENCODE_HEADLESS_UNSUPPORTED` reserved for missing `opencode run` CLI surface only. |

## Components

### Plugin entry point (DQ1 LOCKED — AC-1, AC-2)

`template/.opencode/plugins/orchestrator.ts` — single TypeScript file, default export `Plugin.define({ id: "its-magic.orchestrator", setup })` from `@opencode-ai/plugin`. Auto-discovered by OpenCode via `.opencode/plugins/` scan. No `plugins[]` entry in `opencode.json` required. Plugin id `its-magic.orchestrator` is the disable/enable selector (`--pure` / `-its-magic.orchestrator`).

### Spawn API (DQ2 LOCKED — AC-1, AC-3, AC-4)

The plugin's spawn entry point calls `ctx.session.create({ parentID: <orchestrator-session-id>, agent: <role>, prompt: <phase-prompt> })` → asserts `sessionID !== parentID` → `ctx.session.wait(sessionID)` → reads result → persists isolation evidence (`parentID`, `sessionID`, `role`, `phase_id`, `timestamp`, `fresh_context_marker`). If `ctx.session.create` is unavailable, fail closed with `OPENCODE_PLUGIN_SPAWN_UNSUPPORTED`.

### Mock-ctx stub harness (DQ3 LOCKED — AC-3, AC-4, AC-10)

`tests/us0124/mock_ctx.ts` — `MockCtx` implements the v2 plugin context subset (`session.create`/`prompt`/`wait`, `tool.hook` no-op recorder, `options` readonly). `session.create` accepts scripted `nextSessionID` + `throwOnCreate` + `returnNull` flags. Default: fresh uuid ≠ `parentID`. Tests load `template/.opencode/plugins/orchestrator.ts` via dynamic import, call `setup(mockCtx)`, drive spawn entry point, assert call args + `sessionID !== parentID` + isolation evidence. **Runner: Node** (CI already has it via `tests/run-tests.ps1 Ensure-NodeOnPath`); Bun optional. No live OpenCode runtime probe in CI (AC-10).

### Reason-code namespace (DQ4 LOCKED — AC-8; critic NB `ik_us0124_dq6_driver_fail_code_conflation` closed)

Four new `OPENCODE_*` codes: `OPENCODE_PLUGIN_SPAWN_UNSUPPORTED` (spawn primitive missing), `OPENCODE_SUBTASK_IGNORED` (null/throw/identical-id — spawn ignored), `OPENCODE_HEADLESS_UNSUPPORTED` (missing `opencode run` CLI surface only — DQ7), `OPENCODE_DRIVER_INVOKE_FAILED` (Python driver subprocess failure — non-zero exit, malformed JSON, timeout — DQ6; distinct from `OPENCODE_HEADLESS_UNSUPPORTED`). Three reused codes: `AUTO_ORCHESTRATOR_PHASE_EXECUTION` (orchestrator performing another role's artifact writes), `PHASE_ROLE_MISMATCH` (wrong-role spawn per US-0069), `NATIVE_CHAIN_UNAVAILABLE` (headless fallback cross-host family). Stub reason-code table in runbook (US-0126 owns full text).

### Three-case detection matrix + throw-discrimination (DQ5 LOCKED — AC-8)

`test_us0124_subtask_ignored_fail_closed` runs three sub-tests: `_null_return` (mock returns null → `OPENCODE_SUBTASK_IGNORED`), `_throw` (mock throws generic error → `OPENCODE_SUBTASK_IGNORED`; missing-primitive throw → `OPENCODE_PLUGIN_SPAWN_UNSUPPORTED`), `_identical_id` (mock returns `{ sessionID: parentID }` → `OPENCODE_SUBTASK_IGNORED`). `sessionID !== parentID` is a hard post-condition.

### Subprocess stop-matrix integration (DQ6 LOCKED — AC-6; critic NBs `ik_us0124_dq6_argv_extension_gap` + `ik_us0124_dq6_driver_fail_code_conflation` closed)

`scripts/auto_outer_driver.py` is the single TS↔Python integration. Additive argv: `--phase <phase_id> --role <role> --story <story_id> --sprint <sprint_id> --orchestrator-run-id <run_id> --stop-reason <reason>` → JSON response `{ "action": "spawn_next"|"hard_stop"|"ledger_write"|"pause_boundary", "next_phase": "<phase_id>", "stop_reason": "<reason>", ... }`. When new flags absent, legacy behavior byte-identical (no regression to US-0092 / DEC-0078). Subprocess failure (non-zero exit, malformed JSON, timeout) → `OPENCODE_DRIVER_INVOKE_FAILED` (NOT `OPENCODE_HEADLESS_UNSUPPORTED`). Forbidden: TS reimpl of US-0092 state machine.

### Headless CLI (DQ7 LOCKED — AC-7)

`opencode run --agent auto --format json --auto "<phase-prompt>"` (primary) + optional `opencode serve` + `--attach` (optimization). Fail-closed `OPENCODE_HEADLESS_UNSUPPORTED` when `opencode run` not on PATH. `test_us0124_invoke_cmd_hook` asserts argv + JSON parsing OR fail-closed path — not a live OpenCode probe.

### Agent vs plugin ownership boundary (DQ8 LOCKED — AC-1, AC-9)

`template/.opencode/agents/auto.md` (US-0122 — agent = prompt + permission allow-list, unchanged) + `template/.opencode/plugins/orchestrator.ts` (US-0124 — plugin = enforcement). Independent surfaces, defense in depth. Plugin MUST NOT copy agent's permission array. `test_us0124_agent_plugin_compose` asserts: both files exist; plugin source has zero matches for 7 role names + `edit:`/`bash:` literals; `ctx.tool.hook("execute.before")` callback present and calls stop-matrix subprocess for `AUTO_ORCHESTRATOR_PHASE_EXECUTION` detection.

### AC-10 contract-test list (locked — 9 markers)

`tests/us0124_contract_test.py` — markers:

| # | Marker | AC |
|---|--------|-----|
| 1 | `test_us0124_spawn_isolation_static` (grep/AST on plugin source — `ctx.session.create` with `parentID` + `agent`; no same-session spawn) | AC-1, AC-3 |
| 2 | `test_us0124_spawn_isolation_runtime` (mock `ctx` — fresh uuid ≠ parentID; `sessionID !== parentID` asserted; isolation evidence persisted) | AC-3, AC-4, AC-10 |
| 3 | `test_us0124_subtask_ignored_null_return` (null → `OPENCODE_SUBTASK_IGNORED` + stop) | AC-8 |
| 4 | `test_us0124_subtask_ignored_throw` (generic throw → `OPENCODE_SUBTASK_IGNORED` + stop) | AC-8 |
| 5 | `test_us0124_subtask_ignored_identical_id` (identical-id → `OPENCODE_SUBTASK_IGNORED` + stop) | AC-8 |
| 6 | `test_us0124_no_cursor_auto_clone` (grep plugin source for unique-to-Cursor phrases — zero hits) | AC-9 |
| 7 | `test_us0124_agent_plugin_compose` (both files exist; plugin source has zero matches for 7 role names + `edit:`/`bash:` literals; `ctx.tool.hook` callback present) | AC-1, AC-9 |
| 8 | `test_us0124_invoke_cmd_hook` (argv `opencode run --agent auto --format json --auto` + JSON parsing OR fail-closed `OPENCODE_HEADLESS_UNSUPPORTED`; not a live probe) | AC-7 |
| 9 | `test_us0124_secrets_no_logging` (grep plugin source + harness for `api_key`/`apikey`/`sk-`/`auth.json`/`.env` — zero hits in log/print/error paths) | AC-11 |

Surjective AC coverage: AC-1 (markers 1, 7), AC-2 (marker 1 + plugin id), AC-3 (markers 1, 2), AC-4 (marker 2), AC-5 (marker 2 + marker 8), AC-6 (DQ6 + marker 8), AC-7 (marker 8), AC-8 (markers 3, 4, 5), AC-9 (markers 6, 7), AC-10 (marker 2 + DQ3 mock-ctx), AC-11 (marker 9). Every AC has ≥1 marker.

## Risks mitigated

All 7 risks from R-0109 US-0124 ACCEPTED, plus 3 research critic NBs closed:

| Risk | Severity | Mitigation |
|------|----------|------------|
| R1: v2 `ctx.session.create` unavailable at runtime | MEDIUM → LOW | DQ2 + DQ4 fail-closed `OPENCODE_PLUGIN_SPAWN_UNSUPPORTED`; `test_us0124_spawn_isolation_runtime` asserts fail-closed path via mock-ctx throw-on-missing-primitive. |
| R2: Subtask-ignored silent continue (null/throw/identical-id) | MEDIUM → LOW | DQ5 three-case detection matrix; `test_us0124_subtask_ignored_*` (three sub-tests) assert all three fail-closed `OPENCODE_SUBTASK_IGNORED`. |
| R3: TS↔Python stop-matrix drift | MEDIUM → LOW | DQ6 single subprocess integration + locked additive argv; `test_us0124_invoke_cmd_hook` asserts argv + JSON parsing; Python SOT unchanged; T-004 additive extension preserves byte-identical legacy behavior. |
| R4: Headless `opencode run` unavailable on operator host | LOW–MEDIUM → LOW | DQ7 fail-closed `OPENCODE_HEADLESS_UNSUPPORTED`; `test_us0124_invoke_cmd_hook` asserts fail-closed path (mock missing `opencode` on PATH). |
| R5: Plugin duplicates agent's permission array | LOW–MEDIUM → LOW | DQ8 ownership boundary; `test_us0124_agent_plugin_compose` asserts plugin source has zero matches for 7 role names + `edit:`/`bash:` literals. |
| R6: `.cursor/commands/auto.md` prose leaks into plugin source (AC-9 violation) | LOW → LOW | `test_us0124_no_cursor_auto_clone` greps for unique-to-Cursor phrases; T-001 composes US-0069 + US-0092 semantics, not prose port. |
| R7: Live OpenCode runtime probe accidentally added to CI (AC-10 violation) | LOW → LOW | DQ3 mock `ctx` harness; contract tests run pure Node/Bun; CI has no `opencode` dependency. |
| C1 (critic NB): `ik_us0124_dq6_driver_fail_code_conflation` | → closed | Distinct `OPENCODE_DRIVER_INVOKE_FAILED` (driver subprocess failure) vs `OPENCODE_HEADLESS_UNSUPPORTED` (missing `opencode run` CLI surface only). The two codes never overlap. |
| C2 (critic NB): `ik_us0124_dq6_argv_extension_gap` | → closed | T-004 is additive argv on `auto_outer_driver.py`; existing driver behavior byte-identical when new flags absent; no regression to US-0092 / DEC-0078. |
| C3 (critic NB): `ik_us0124_research_scope_yagni` | → closed | Informational; US-0124 ships minimum plugin + harness + stub table; US-0125/US-0126 own command-body and full-runbook surfaces. |

## Non-goals (this slice)

- **US-0125** (thin command bodies) — `template/.opencode/commands/` ships `.gitkeep` only (US-0121 pack).
- **US-0126** (full runbook) — T-003 stub reason-code table one-liner only.
- **Repo-root `opencode.json`** — not shipped (R-0109 Q6 US-0121 lock preserved).
- **Active kit `.opencode/agents/` mirror** — YAGNI (inherits US-0122 DQ8 / R-0109 Q9 US-0121).
- **Kit-operated proxy for Chinese APIs** — out of scope (plugin resolves role via US-0069; OpenCode host resolves role→slug via US-0123 catalog).
- **Cursor BYOK fixes** — out of scope (compose, not amend).
- **Embedding keys** — out of scope.
- **Live OpenCode runtime probe in CI** — out of scope (AC-10; DQ3 mock-ctx harness).
- **TS reimplementation of US-0092 state machine** — forbidden (DQ6; Python remains SOT).
- **New validator script** — default rejected (extend contract tests + `model_tier_validate.py --scope opencode-catalog` from US-0123).

## Compose guards (UNCHANGED — additive only)

| Compose target | Verification | Result |
|---|---|---|
| US-0069 / DEC-0051 (phase→role matrix) | plugin resolves `phase_id → role` via matrix; no matrix rewrite | ✅ untouched |
| US-0092 / DEC-0078 (outer driver + stop reasons + `--invoke-cmd`) | Python SOT unchanged; plugin calls subprocess (DQ6); `--invoke-cmd` maps to `opencode run` (DQ7) | ✅ untouched |
| US-0095 / DEC-0080 (Cursor native Task-loop) | NOT ported — plugin IS the OpenCode native chain; no `.cursor/commands/auto.md` clone (AC-9) | ✅ NOT ported |
| US-0023 / US-0048 / BUG-0006 (spawn-only isolation) | `ctx.session.create` + `parentID` + `sessionID !== parentID` assertion; fail-closed on no-op spawn | ✅ compose |
| US-0005 (Cursor hook JSON) | NOT ported — enforcement moves into plugin (`ctx.tool.hook`) + agent permissions | ✅ NOT ported |
| US-0122 / DEC-0122 (`auto.md` agent) | US-0124 does not edit `template/.opencode/agents/auto.md`; agent = prompt + permission allow-list; plugin = enforcement (DQ8) | ✅ untouched |
| US-0121 / DEC-0120 (host default cursor-only + reserved `template/.opencode/plugins/`) | plugin lives in reserved slot; no `opencode.json` in template | ✅ consumed |
| US-0125 (thin commands Layer 3 only) | plugin must not own command bodies | ✅ untouched |
| US-0102 / DEC-0087 (no vendor slugs in `template/`) | plugin source has no vendor model slugs | ✅ untouched |

Contract test `test_us0124_agent_plugin_compose` (marker 7) + `test_us0124_no_cursor_auto_clone` (marker 6) enforce at execute boundary.

## Sprint seeds preview (within SPRINT_MAX_TASKS=12)

| Seed | Description | AC |
|------|-------------|-----|
| **T-anch** | Verify `# US-0124` H1 anchor placed AFTER `# US-0123` and BEFORE `US-0089`; DEC-0124 Accepted; compose guards 9/9; 9-marker list locked; plugin entry-point + spawn API + stop-matrix argv + agent/plugin boundary locked in DEC-0124. | AC-9, AC-10 |
| **T-001** | NEW plugin file `template/.opencode/plugins/orchestrator.ts` with `Plugin.define({ id: "its-magic.orchestrator", setup })` + `ctx.tool.hook("execute.before")` write-guard + `ctx.session.create` spawn entry + stop-matrix subprocess callout. | AC-1, AC-2, AC-3 |
| **T-002** | NEW mock `ctx` harness `tests/us0124/mock_ctx.ts` — `MockCtx` with `session.create`/`prompt`/`wait` + scripted null/throw/identical-id + `tool.hook` recorder. | AC-3, AC-4, AC-10 |
| **T-003** | Stub reason-code table in `docs/engineering/runbook.md` h2 `## OpenCode orchestrator plugin reason codes (US-0124)` — four `OPENCODE_*` codes + three reused codes, one-line semantics each, cross-link to US-0126 for full table. | AC-8 |
| **T-004** | Subprocess argv contract — `scripts/auto_outer_driver.py` additive CLI extension exposing `--phase --role --story --sprint --orchestrator-run-id --stop-reason` → JSON response; Python SOT unchanged, additive CLI surface only; legacy behavior byte-identical when flags absent. | AC-6 |
| **T-005** | Contract tests `tests/us0124_contract_test.py` — 9 markers (see AC-10 table above). | AC-10 |
| **T-006** | Installer manifest rows for `template/.opencode/plugins/orchestrator.ts` under `[opencode_install_include_paths]` + triple-installer parity — US-0121 manifest extension, additive. | AC-1 |
| **T-007** | README + template parity — `check_intake_template_parity.py --scope=opencode-adapter` extension for plugin file + mock harness; `its_magic/README.md` cross-link. | AC-10 |
| **T-008** | Runbook stub cross-link from US-0124 section to US-0126 full reason-code table — placeholder h2 anchor only, US-0126 owns body. | AC-8 |
| **T-009** | Validator extension on `scripts/model_tier_validate.py` OR new `scripts/opencode_plugin_validate.py` — only if US-0124 plugin source needs static validation beyond contract tests; default: extend contract tests, no new validator script. | AC-10 |

**Total: 10 tasks (T-anch + T-001..T-009) — within `SPRINT_MAX_TASKS=12`.** `/sprint-plan` may merge or split within the 12-task budget.

**AC mapping (11 ACs → 10 tasks surjective)**: AC-1 → T-001+T-005+T-006; AC-2 → T-001; AC-3 → T-001+T-002+T-005; AC-4 → T-002+T-005; AC-5 → T-002+T-005; AC-6 → T-004+T-005; AC-7 → T-004+T-005; AC-8 → T-003+T-005; AC-9 → T-anch+T-005; AC-10 → T-002+T-005; AC-11 → T-005.

## DC check

`dc_check=clean`. No `# US-0124` or `## US-0124` existed in `architecture.md` prior to THIS write (verified by R-0109 US-0124 DC check). H1 anchor added per DEC-0076 / BUG-0010 heading policy. Deferral register clean.

## Stop conditions

- `decision_gate=false`
- `missing_acceptance_criteria=none` (11/11 ACs covered by 9 contract-test markers + compose guards + T-003 runbook stub)
- `compose_guards=9/9 UNCHANGED (additive only)`
- `dc_check=clean`
- DQ1..DQ8 LOCKED for US-0124; 7/7 R ACCEPTED; A1 locked; 3 research critic NBs closed; 3 spec critic NBs closed (carried from research)
- Triad baseline `baseline_h2_count=39` preserved (H1 used, not H2)
- Triad `--rollover` ran (state.md was at 1200/1200 lines; rollover archived 1 unit); `--check` PASS after rollover; heading policy check pending (see below)

## Sovereign memory note

`assemble_sovereign_memory_digest(...)` NOT called. No write to `mistakes.jsonl`.

## Consequences

- **Positive**: Operators can run `/auto` on the OpenCode host with spawn-only isolation before thin commands (US-0125) or the full runbook (US-0126) exist; success tests (a) and (d) are provable via mock-ctx harness + `sessionID !== parentID` assertion; AC-8 subtask-ignored fail-closed is provable via three-case detection matrix; epic US-0125..US-0126 inherits the locked plugin entry-point + spawn API + reason-code namespace + stop-matrix integration via DEC-0124 without re-deriving; US-0069/US-0092/US-0095/US-0023/US-0048/US-0005/US-0122/US-0121/US-0125/US-0102 compose unchanged.
- **Negative**: One new template file (orchestrator plugin); one new mock harness (tests/us0124/mock_ctx.ts); one new contract test file (9 markers); one stub runbook h2 one-liner; one additive CLI extension on `scripts/auto_outer_driver.py` (T-004); installer manifest rows for the plugin file (T-006).
- **Neutral**: US-0121 reserved `template/.opencode/plugins/` slot consumed (additive); US-0122 `auto.md` agent unchanged; US-0092 Python SOT unchanged; US-0102 volatile-ID rule respected; Cursor `MODEL_*` keys unchanged.

## Isolation evidence (US-0048 / DEC-0029)

- `phase_id=architecture`, `role=tech-lead`, `story_id=US-0124`, `sprint_id=(pending — created at sprint-plan)`
- `orchestrator_run_id=auto-20260824-02`
- `delivery_mode=ultra_lean`, `macro_phase=plan` (architecture — second canonical phase of `plan` macro per US-0096 / DEC-0082)
- `model_id=glm-5.2-high` (CROSS_MODEL_REVIEW=1 — required; this spawn's producer model)
- `fresh_context_marker=tl-US0124-architecture-20260824T183000Z-fresh`, `timestamp=2026-08-24T18:30:00Z` (UTC)
- `evidence_ref=docs/engineering/architecture.md # US-0124 (this section), decisions/DEC-0124.md (companion DEC), docs/engineering/research.md ## R-0109 (US-0124 deepened findings DQ1..DQ8 LOCKED), docs/product/backlog.md ## US-0124 (D1..D10 + 11 ACs + DQ1..DQ8, status OPEN untouched, AC checkboxes untouched), docs/product/acceptance.md US-0124 row (unchecked), docs/product/vision.md ## Intake Notes — US-0124 + ## Discovery Notes — US-0124, handoffs/po_to_tl.md US-0124 section, handoffs/sovereign_critic_findings.jsonl US-0124 research rows (3 non-blocking carry-forwards closed here), decisions/DEC-0051.md (read-only compose), decisions/DEC-0078.md (read-only compose), decisions/DEC-0080.md (read-only compose), decisions/DEC-0122.md (read-only compose), decisions/DEC-0120.md (read-only compose), template/.opencode/agents/auto.md (grep mode:/permission:/task: anchors — DQ8 boundary source), template/.opencode/plugins/README.md (US-0121 reserved slot — US-0124 owns directory body), docs/engineering/architecture.md # US-0123 (format template), docs/engineering/decisions.md ## DEC-0124 (stub flipped to Accepted), handoffs/resume_brief.md (US-0124 sovereign-critic PASS prepend)`
- Fresh tech-lead subagent per BUG-0006 / US-0048 isolation; no prior chat history carried forward. Context limited to narrow-read files (US-0053). No `.env` reads, no credentials access, no intake-evidence mutation, no backlog status/AC mutation.
- Prior proof consumed: `rp-auto-20260824-02-research-tech-lead-20260824T181500Z-US-0124` (`proof_hash=BDDA6BEA3F4F8B587FD52B33CF9E07DB3F03156F17742A641655BCE5E6E7AAC1`, ttl 2026-08-24T19:15:00Z — consumed before RUNTIME_PROOF_STALE).
- Triad baseline `baseline_h2_count=39` preserved via H1 anchor (no new H2 `## US-` headings added).

## Strict runtime proof (DEC-0038)

- `runtime_proof_id=rp-auto-20260824-02-architecture-tech-lead-20260824T183000Z-US-0124`
- Canonical payload (sorted-key JSON per DEC-0038): `{"delivery_mode":"ultra_lean","macro_phase":"plan","model_id":"glm-5.2-high","orchestrator_run_id":"auto-20260824-02","phase_id":"architecture","proof_issued_at":"2026-08-24T18:30:00Z","proof_ttl_seconds":3600,"role":"tech-lead","runtime_proof_id":"rp-auto-20260824-02-architecture-tech-lead-20260824T183000Z-US-0124","sprint_id":"(pending)","story_id":"US-0124"}`
- `proof_hash=9FFF0B5A30F1A2711A966539B6ED043ADE53B6842C86D64D6A391A2DDF9D2A0A` (SHA-256 of sorted-key JSON payload, UTF-8 bytes via python hashlib)
- `proof_ttl_seconds=3600`, `proof_ttl=2026-08-24T19:30:00Z` (UTC = issued_at + 3600s)

## Decision gate

- `decision_gate=false` (companion DEC-0124 authored Accepted in THIS phase; approach A1 locked; DQ1..DQ8 LOCKED for US-0124; 7/7 R ACCEPTED; 3 research critic NBs closed; 3 spec critic NBs closed; DC check clean; compose guards 9/9 UNCHANGED)
- `stop_conditions_met=yes`

## Next scheduled phase

- `next_scheduled_phase=/sprint-plan` (role=tech-lead per US-0069 / DEC-0051 phase→role matrix default; third canonical phase of `plan` macro per ultra_lean; research + architecture + sprint-plan merged into `plan` macro)
- `next_scheduled_role=tech-lead`
- `stop_condition=STOP after architecture completes; hand off via artifacts only to /sprint-plan in fresh tech-lead subagent (BUG-0006). Do not spawn /sprint-plan from this subagent.`

