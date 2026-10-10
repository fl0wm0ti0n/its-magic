# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Fixed
- **BUG-0032**: AUTONOMY_FLAGS_DRIFT drift-detect contract — dedicated semantic `--scope=autonomy-flags` handler in `scripts/check_intake_template_parity.py` (active + template byte-identical mirror) comparing `AUTONOMY_PRESET` + `AUTONOMY_STOP_POLICY` between the config baseline (`.its-magic/config.json shared.<KEY>`) and the live scratchpad (`.cursor/scratchpad.md KEY=VALUE`); exit 0 + exact banner on two-key identity, exit 1 with one fixed-order `AUTONOMY_FLAGS_DRIFT scope=autonomy-flags key=<KEY> config=<value-or-<missing>> scratchpad=<value-or-<missing>>` line per affected key (AUTONOMY_PRESET first) and no success banner on any mismatch, missing key, duplicate assignment, or unreadable/unparseable input (fail-closed); `--repo` fixture redirection for the 7-fixture battery (identity / preset-drift / policy-drift / two-key-drift / malformed-duplicate / malformed-missing / malformed-unparseable); additive `AUTONOMY_FLAGS_DRIFT` row in `docs/engineering/reason_codes.md` + operator live-wins sync (T-005) remediation entry `## AUTONOMY_FLAGS_DRIFT` in `docs/engineering/runbook.md` (both byte-identical active↔template); mirrored always-run fail-closed CI blocks in `tests/run-tests.ps1` + `tests/run-tests.sh` positioned immediately after US-0131 (identity fixture exit-0 assertion + 8-marker suite); 8 `test_bug0032_*` markers (active + byte-identical template mirror incl. US-0119 security-invariant compose: `none` byte-identity, 12 per-feature flags, `security_hard n/a`, `INTAKE_AUTONOMY_MODE=0` / `INTAKE_SUBAGENT_FALLBACK=deny` on the real config, and `AUTONOMY_FLAGS_DRIFT` ABSENT from the stop-matrix — BUG-0034 owns that registration per R-0156 DQ2). **Drift-DETECT only, NOT drift-FIX** — the live values in `.cursor/scratchpad.md` and the config baseline in `.its-magic/config.json` are unchanged by this slice; the operator live-wins sync (AC-1 second branch) is the operator's action at `/closure`. Sibling composes preserved (US-0119 8P + 2 pre-existing N-2 matrix-ref carried forward NOT_WEAKENED_NOT_REPAIRED; US-0131 10/10 unchanged; BUG-0033/0034 OPEN not drained; DEC-0154 NOT allocated). npm publish deferred (`RELEASE_PUBLISH_MODE=confirm`; `npm_published=false`; no kit semver bump — kit already at `0.1.10`). Sprint evidence: [`S0166`](handoffs/releases/S0166-release-notes.md).
- **BUG-0034**: Register `PO_CLOSURE_PRECONDITION_CONFLICT` in the autonomy stop-matrix surface — the ad-hoc PO closure precondition-conflict token emitted at runtime by the PO closure path was unregistered across matrix / reason codes / runbook / repair-ledger (grep 0 hits repo-wide); any occurrence produced a fail-closed stop with no documented auto-repair kind, no operator remediation text, and no ledger accounting. Exactly one adjacent YAML row added to `scripts/data/autonomy_stop_matrix.yaml`: `stop_class: autonomy_resolvable` / `auto_repair_kind: disambiguate_state` (research-locked; the `auto_refresh_brief` alternative is rejected by the negative marker) / `cap: 3` / locked non-empty rationale; additive `PO_CLOSURE_PRECONDITION_CONFLICT` row in `docs/engineering/reason_codes.md` (US-0119 cross-ref + repair-kind name; byte-identical active↔template `04A88D32…C1CC0DD`); `docs/engineering/runbook.md` no-refresh operator remediation entry `## PO_CLOSURE_PRECONDITION_CONFLICT` (retaining the `RESUME_BRIEF_UNPARSEABLE` / `RESUME_BRIEF_STALE` / `RESUME_BRIEF_AUTO_REFRESH=0` no-refresh guard; byte-identical active↔template `A2F31FF5…0D4C1F`); `autonomy_repair_ledger` integration (cap 3, `(orchestrator_run_id, reason_code)` accounting, cap-exhausted no-fourth-row, authorized positive-integer override, rejection of unauthorized/zero overrides, audit fields, success-only `autonomy_relaxed: PO_CLOSURE_PRECONDITION_CONFLICT -> disambiguate_state` breadcrumb — no breadcrumb on failure / invalid evidence / ambiguity / exhaustion); additive `# BUG-0034` H1 in `docs/engineering/architecture.md` (DEC-0054 triad); 8 `test_bug0034_*` markers (active `tests/bug0034_autonomy_stop_matrix_test.py` + byte-identical template mirror `B987E9C5…F91879`): row/class/kind/cap/rationale, disambiguate-state-only (no auto-refresh), cap 3 + rationale, operator-matrix / reason-code / runbook active↔template byte parity, ledger cap-override/audit/success-breadcrumb, negative pair codes (`RESUME_AMBIGUOUS` + `RESUME_BRIEF_STALE` remain security-hard) + compose invariants. **Registry / doc / ledger only, NOT a DONE flip** — BUG-0034 backlog/acceptance remain OPEN until `/closure` (US-0045). Sibling composes preserved (US-0119 8P + 2 pre-existing N-2 matrix-ref carried forward NOT_WEAKENED_NOT_REPAIRED; US-0120 9P + 1 pre-existing compose-guard carried forward NOT_WEAKENED_NOT_REPAIRED; US-0131 10/10 unchanged; BUG-0033 OPEN not drained). npm publish deferred (`RELEASE_PUBLISH_MODE=confirm`; `npm_published=false`; no kit semver bump). Sprint evidence: [`S0167`](handoffs/releases/S0167-release-notes.md).
- **BUG-0033**: Thin→rich command-pair parity — the five thin OpenCode command bodies (`.opencode/commands/{closure,ask,auto,refresh-context,execute}.md`, dispatch-only per US-0125) were missing the `## Fail-safe reason codes` + `## Stop conditions` sections that their rich `.cursor/commands/*` counterparts already documented, so an OpenCode-surface operator could not see the same deterministic fail-closed vocabulary; the fix adds both sections (Stop-first ordering, diagnostics-only, STOP sentinel final, frontmatter preserved) to all five thin files and restores active↔template byte parity (BUG-0031 837b precedent); hand-authored 10-marker `test_bug0033_*` parity suite (active `tests/bug0033_opencode_command_parity_test.py` + byte-identical `template/tests/` twin) wired into the harness + scoped `--scope=bug-0033` intake-template-parity handler (`[INTAKE_TEMPLATE_PARITY_OK]`). US-0125/US-0126 invariants preserved (no regression — the documented m9 5-failure baseline `command_inventory/clone_guard/missing_command_does_not_disable_plugin/auto_command_dispatch_only/default_host_reminder` reproduced unchanged, no newly-failing marker; `test_us0126_parity_scope_opencode_adapter` GREEN); `.opencode/tui.json` `"plugin": []` active==template (BUG-0030/DEC-0151 lock) unchanged; BUG-0006/US-0048 spawn-only unchanged. 10 `test_bug0033_*` markers: closure/ask/auto/refresh-context/execute both-headings (Stop-first), 5/5 command-pair byte parity + scoped parity banner, US-0125/US-0126 baseline + `tui.json` lock, 0 new reason codes; `bug_issue_validate.py --check-acceptance` → `[BUG_VALIDATION_OK]` exit 0. **Section-add + parity-test only, NOT a DONE flip** — BUG-0033 remains OPEN (backlog `### BUG-0033` `Status: OPEN` + AC-1..AC-8 `[ ]`; acceptance L224 `[ ]`; closure owns the flip per US-0045). Re-release (2026-10-10) records the US-0091 README feature-coverage row now shipped: **BUG-0033** in `its_magic/README.md` (byte-identical to `template/its_magic/README.md`) under `## Commands and workflow`, and in `docs/developer/README.md` under `## Quality gates` (affinity `release_gate`; has_root_coverage and has_dev_coverage true). While Status stays OPEN the coverage gate omits BUG-0033 from `coverage_present` until closure flips DONE. npm publish deferred (`RELEASE_PUBLISH_MODE=confirm`; `npm_published=false`; no kit semver bump). Sprint evidence: [`S0168`](handoffs/releases/S0168-release-notes.md).

## [0.1.10] - 2026-10-03

### Added
- **US-0156**: OpenCode `/auto` parity — native in-chat `/auto` command (spawn-only parent `auto` agent, continuous multi-phase loop with fresh isolated subagent contexts per phase), backlog-drain scheduler with bug-queue targeting, start-from/resume phase-plan precedence, 12-phase `PHASE_ROLE_MATRIX` with Stop-Matrix + budget-cap fail-closed boundaries; retired `its-magic-auto/{index,tui,rpc}.ts` TUI/RPC legacy route removed (active + template, all three installer upgrade paths); 10 ACs + 10 contract markers. Sprint evidence: [`S0162`](handoffs/releases/S0162-release-notes.md).

### Fixed
- **BUG-0031**: OpenCode `/closure` cannot complete — no spawnable closure role authorized to write the canonical DONE-flip paths. Curator 3-allow delta (active + template byte-identical, `docs/product/backlog.md`, `docs/product/acceptance.md`, `sprints/S*/closure-verification.md` — appended after `handoffs/archive/**`, before `bash: ask`; `"**": deny` DENY-FIRST preserved) + additive `CLOSURE_PERMISSION_FLIP_PATHS_DENIED` fail-closed token (rich closure pair + runbook + reason_codes) + DQ6 OpenCode-surface parity note (`qe` unspawnable → sanctioned alternate `curator`; never an operator hand-flip) + eight `test_bug0031_*` markers (active + byte-identical template mirror). **Unblocks** the `/closure` capability; does **not** perform a closure flip (US-0045 + closure own the DONE flip). Sibling suites (`test_bug0027_*` 10, `test_bug0016*` 7) unmodified; BUG-0016/0027 not reopened; DQ10 siblings untouched. `UAT_PROBE_FORBIDDEN` held (D5 mock-injection permission-map only — no live OpenCode `/closure` probe). Sprint evidence: [`S0164`](handoffs/releases/S0164-release-notes.md).
- **BUG-0022**: Cursor `/auto` Task-spawn model inheritance fix (A1 resolve-then-spawn). Pre-spawn `model_tier_lib.resolve_model_for_phase` call (step 3a) in `.cursor/commands/auto.md` (+ template twin) threads the catalog-resolved `slug`/`alias` into the Task `model:` payload; critic hook aligned to `roles.critic` (no hardcoded release slug); `{po,release}.mdc` (+ template) keyless (removed `model: inherit`); fail-closed `MODEL_ROLE_SLUG_UNKNOWN` on role→catalog gaps (7-token reason set unchanged, no schema v3); additive `model_id` + `model_provenance` isolation row; one-line spec-conformant `docs/engineering/runbook.md` § Role catalog enablement recipe addendum (byte-identical active↔template 263345b); 6+8 `test_bug0022_*` markers (m1–m8 incl. parity + no-sibling-mutation). Sibling regression (bug0021 8 skip, bug0023 8 skip, bug0030 4 pass / 2 skip) as-is; resolver libs (`scripts/model_tier_lib.py`, `scripts/sovereign_critic_lib.py` + template twins) **UNMUTATED**. `UAT_PROBE_FORBIDDEN` held (D5 mock-injection only — no live Cursor IDE probe). Sprint evidence: [`S0163`](handoffs/releases/S0163-release-notes.md).
- **BUG-0030**: Replace OpenCode private TUI/RPC `/auto` route with the documented `.opencode/commands/auto.md` command (active + template) that selects `agent: auto` and admits the canonical spawn-only prompt; retire the legacy private route from active/template configuration and from all three installer upgrade paths; six `test_bug0030_*` markers; `ITS_MAGIC_OPENCODE_SMOKE_MODEL` knob. Sprint evidence: [`S0161`](handoffs/releases/S0161-release-notes.md).
- **BUG-0027**: Hybrid manual-phase persist for OpenCode direct slash commands — IsolationEvidence identity fields, `persistManualPhaseIsolation`, reject `tui-auto`, targeted glob widen, supported validator CLI, ten `test_bug0027_*` markers. Sprint evidence: [`S0160`](handoffs/releases/S0160-release-notes.md).
- **BUG-0024**: Hybrid residual live-dispatch for OpenCode CLI TUI listed `/auto` — peer-branded Defined gate, stage-distinct `OPENCODE_*`, DISPATCH umbrella-only, eight `test_bug0024_*` markers. Sprint evidence: [`S0159`](handoffs/releases/S0159-release-notes.md).

## [0.1.5] - 2026-09-19

### Fixed
- **BUG-0026**: Ship an npm-safe standalone supported-kernel range fallback and required installer peers so `upgrade --host both` materializes `.its-magic/bin/itsm` instead of reporting a false `KERNEL_CONTRACT_MISMATCH` when the private root `standalone/` workspace is omitted.

## [0.1.4] - 2026-09-18

### Fixed
- **BUG-0025**: Include `scripts/standalone_runtime_install_lib.py` in npm pack allowlist; fail-closed standalone bootstrap loader (`STANDALONE_BOOTSTRAP_FAILED`); kit `0.1.4` packaging twins; six `test_bug0025_*` markers. npm publish deferred (`RELEASE_PUBLISH_MODE=confirm`). Sprint evidence: [`S0157`](handoffs/releases/S0157-release-notes.md).

## [Released]

### [S0111] - 2026-06-16

#### Added
- **US-0111**: Release trigger adapters - multi-source release trigger abstraction (`scripts/release_trigger_adapters.py`), supporting manual, git-push, github-release, npm-publish, and file-watch sources; TriggerContext dataclass for unified trigger context; `RELEASE_TRIGGER_SOURCES` configuration (default `manual`); 12/12 contract tests passing; 9 fail-closed reason codes (TRIGGER_SOURCE_UNKNOWN, TRIGGER_ENV_VALIDATION_FAILED, TRIGGER_FACTORY_RETURNED_NULL, TRIGGER_GITHUB_WEBHOOK_SECRET_MISMATCH, TRIGGER_NPM_PACKAGE_JSON_MISSING, TRIGGER_FILE_WATCH_POLLING_INTERVAL_INVALID, TRIGGER_GITHUB_API_RATE_LIMITED, TRIGGER_NPM_REGISTRY_UNAVAILABLE, TRIGGER_ADAPTER_FACTORY_EXCEPTION); compose guards preserved (US-0008, US-0040, US-0054, US-0100, US-0103, US-0107, US-0110); runbook documentation with operator recipes; template byte-identical mirrors.
- **DEC-0111**: Release trigger adapters architecture decision record.

#### Verification
- Contract tests: 12/12 passing (`pytest -k "us0111 or release_trigger" -v`)
- Parity scope: `release-trigger-adapters` (2 pairs validated)
- Reason codes: 9 documented with remediation paths

#### Known Issues
- None for this release unit.

### [S0109] - 2026-06-14

#### Added
- **US-0109**: Self-healing deploy with smoke probes - bounded retry loop with post-deploy smoke testing (`scripts/self_healing_deploy_lib.py`); `SMOKE_PROBE_ENABLED` flag (default `no`); max retry cap and delay bounds; 8/8 contract tests passing; 7 fail-closed reason codes; compose with US-0054 (publish guard preserved).
- **DEC-0109**: Self-healing deploy architecture decision record.

### [S0107] - 2026-06-13

#### Added
- **US-0107**: Sovereign loop orchestrator (`scripts/sovereign_loop_lib.py`) - `AUTO_SOVEREIGN` mode with deferral register (`handoffs/sovereign_deferrals.jsonl`), goal tracking in `resume_brief.md`, bounded convergence checks, notification dispatch hooks; 10/10 contract tests passing; 10 fail-closed reason codes; compose with US-0048 (phase isolation), US-0049 (sovereign state boundaries), US-0110 (goal tracking integration).
- **DEC-0107**: Sovereign loop orchestrator architecture decision record.

### [S0104] - 2026-06-12

#### Added
- **US-0104**: Sovereign memory substrate (`scripts/sovereign_memory_lib.py`) - bounded JSONL substrate with dedup (95% similarity threshold), bounded injection, curator retrospective, mistake tracking, plan drift register, decision logs; 10/10 contract tests passing; 7 fail-closed reason codes; compose guards preserved.
- **DEC-0104**: Sovereign memory substrate architecture decision record.

### [S0102] - 2026-06-10

#### Added
- **US-0102**: Per-phase model tier configuration - stable aliases (fast/balanced/strong) with model-tier-validate enforcement, optional local slug catalog, provider-mode runbook with tier resolution, `MODEL_TIER_<phase>` overrides; 10/10 contract tests passing; 7 fail-closed reason codes; compose with US-0069 (phase-role), US-0070 (phase-plan).
- **DEC-0102**: Per-phase model tier configuration architecture decision record.

### [S0101] - 2026-06-09

#### Added
- **US-0101**: Model tier catalog - three-tier structure (cheap/balanced/strong) with per-phase configuration, provider-mode catalog (cursor/codex/anthropic), local slug catalog for offline overrides; 10/10 contract tests passing; 7 fail-closed reason codes.
- **DEC-0101**: Model tier catalog architecture decision record.

### [S0100] - 2026-06-08

#### Added
- **US-0100**: Version-scoped release notes - deterministic per-version release notes generation (`scripts/release_changelog_lib.py`), `[Unreleased]` and `[X.Y.Z]` sections in CHANGELOG.md, work item derivation by version range, operator hints (Run/Connect/Verify), 10/10 contract tests passing.
- **DEC-0100**: Version-scoped release notes architecture decision record.

### [S0092] - 2026-05-25

#### Added
- **US-0092**: Token profiling with cost control - `TOKEN_PROFILE` modes (minimal/balanced/unbounded) with token_budget, max_tokens, rate_limit config; 10/10 contract tests passing.

### [S0091] - 2026-05-24

#### Added
- **US-0091**: Cross-model adversarial critics - `CROSS_MODEL_REVIEW=true` with critic model, review phases, critique findings output; 8/8 contract tests passing.

### [S0087] - 2026-05-21

#### Added
- **US-0087**: Bug issue workflow - `BUG-****` issue handling with bug-intake, bug-fix, bug-release lifecycle; bug_issue_lib.py for bug tracking; 8/8 contract tests passing.

### [S0040] - 2026-05-01

#### Added
- **US-0040**: Release notes per sprint (`handoffs/releases/S****-release-notes.md`) - sprint-structured release notes with gate summary, test results, and verification steps.

### [S0054] - 2026-05-07

#### Added
- **US-0054**: Publish confirmation guard (`scripts/release_promotion_guard.py`) - RELEASE_PROMOTION_GATE (always/never/on-version-bump) requiring explicit confirmation for publish operations.

### [S0008] - 2026-04-01

#### Added
- **US-0008**: Release orchestration (`scripts/release-all.sh`) - unified release script coordinating all release phases.

### [S0110] - 2026-06-15

#### Added
- **US-0110**: Goal convergence loops - `SOVEREIGN_GOAL_MODE={phase_driven,goal_convergence}` with goal_progress, goal_completion_gate, vision-driven goal authoring; 10/10 contract tests passing; 12 fail-closed reason codes; partial delivery report on SOVEREIGN_GOAL_TIMEOUT.
- **DEC-0110**: Goal convergence loops architecture decision record.
