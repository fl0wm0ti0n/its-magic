# Release Notes — S0162 / US-0156

- **Sprint**: `S0162`
- **Story**: `US-0156` — OpenCode `/auto` parity: complete the half-finished `/auto` concept to parity with Cursor `/auto` full-automation semantics (native in-chat auto-chain, continuous multi-phase, backlog drain, bug-queue targeting, start-from/resume, phase-selection policy; 10 ACs; `default full_autonomy`)
- **Release date**: `2026-10-03T08:26:24Z` (UTC) — **RETRY #3** (fresh release subagent session)
- **orchestrator_run_id**: `auto-20261002-us0156`
- **delivery_mode**: `ultra_lean`
- **macro_phase**: `ship` (release → `/closure` per US-0045 native chain)
- **research_anchor**: `R-0153` · **companion_DEC**: `DEC-0152` (Accepted)
- **policy_mode**: `confirm` (`RELEASE_PUBLISH_MODE=confirm`; `RELEASE_TARGETS_DEFAULT` empty → no auto-exec target; operator confirm absent this turn → npm publish deferred)
- **trigger_source**: `auto`
- **branch**: `local` (no push; `SYNC_POLICY_MODE=disabled`)
- **fresh_context_marker**: `release-US0156-S0162-20261003T082624Z-fresh` (FRESH, never-reused; distinct from RETRY-#1 `release-US0156-S0162-20261002T202354Z-fresh` and RETRY-#2 `release-US0156-S0162-20261003T000000Z-fresh`)
- **model_id**: `qwen3.8:27b` (CROSS_MODEL_REVIEW=0)
- **runtime_proof_id**: `rp-auto-20261002-us0156-release-release-20261003T082624Z-US-0156`
- **proof_hash**: `1CB6DF6E0EEE95A6261C644E8B01F75512DE92B30764ACC23AE71500A82956FD`
- **proof_issued_at**: `2026-10-03T08:26:24Z`; **proof_ttl**: `2026-10-03T09:26:24Z` (`ttl_seconds=3600`)
- **release_version**: (none — workflow-only release; no kit semver bump; kit remains `0.1.9`)
- **npm_published**: `false`

## Verdict

**RELEASE_PASS.** All mandatory release gates **1, 2, 3, 4 (isolation), 4b (strict runtime proof) green** on **fresh, independent re-run evidence** (this release session, 2026-10-03T08:26:24Z — not taken on trust from prior phases). Both prior RETRY blockers are **cleared at their source**:

- **RETRY #1 `RELEASE_UAT_FAILED` (Gate 3)** — CLEARED: `sprints/S0162/uat.json` + `uat.md` reconciled to **`VERIFY_PASS`** (verified-ready) by a fresh qa UAT-reconciliation (`qa-US0156-S0162-uat-reconcile-20261002T182000Z-fresh`), UAT-7/AC-7 `pass`, `failed=0`, B1 `resolved` (preserved as history). Re-verified this session. **Not a waiver** — the blocker was resolved at the source of the mandated UAT evidence.
- **RETRY #2 `RUNTIME_PROOF_MISSING` + `PHASE_CONTEXT_ISOLATION_MISSING` (Gate 4 / 4b)** — CLEARED: the missing **execute (dev)** and **initial-qa (qa)** isolation + strict-proof evidence was **re-established at its source** by two fresh, independent remediation spawns (dev `dev-US-0156-S0162-execute-remediation-20261003T080657Z-fresh`, qa `qa-US0156-S0162-initial-remediation-20261003T081647Z-fresh`), minting **fresh, valid, recompute-confirmed** proof tuples. This session **independently recomputed all three lifecycle-phase tuples = 3/3 MATCH** via `compute_strict_proof_hash`. **Not a waiver** — the 3-tuple chain was genuinely absent at RETRY #2 and is now genuinely present.

Queue row **S0162 → `released`** (single row, in-place, no duplicate). **No backlog/acceptance mutation** (US-0156 stays OPEN; `/closure` owns the OPEN→DONE flip + acceptance tick per **US-0045** / `architecture.md:610` "Release cannot mark DONE" / `release.md:334-338` Step 10 / `closure.md:14-19`). Publish **deferred to operator** (`PUBLISH_CONFIRMATION_REQUIRED`; `npm_published=false`; kit `0.1.9`, no semver bump). **No git push.** **No live OpenCode desktop/CLI/session PASS claimed** (UAT_PROBE_FORBIDDEN; `contract_tests_primary`).

Gate-1: live scoped contract @ release. **`harness_fail_zero_claimed=false`.**

## Summary

US-0156 brings OpenCode's `/auto` command to **parity with Cursor `/auto`** full-automation semantics: a spawn-only parent `auto` agent that drives continuous multi-phase `/auto` loops (intake → execute → qa → verify-work → release → closure → refresh-context) with **fresh isolated subagent contexts per phase** (BUG-0006 / US-0048), **backlog-drain** selection (bug-queue targeting, dependency-eligible OPEN-story precedence), **start-from/resume** phase-plan precedence, and **phase-selection policy** (Stop-Matrix + budget-cap boundaries fail-closed with reason codes) — replacing the retired TUI/RPC route. AC-7 **DoD gate** = BUG-0022 + BUG-0027 DONE (both satisfied: BUG-0022 DONE via its own S0163 closure; BUG-0027 DONE) with BUG-0028/BUG-0029 **triaged as prerequisite slices** (OPEN, not merged/closed).

FRAMEWORK_KIT_REPO=1 — UAT `contract_tests_primary`; live-host classes `UAT_PROBE_FORBIDDEN`. **No live OpenCode `/auto` completion claimed. No provider-completion claim. No DONE flip.**

**This is a STORY release (gate chain + finalization). It certifies the work is shippable; it does NOT flip US-0156 to DONE.** The OPEN→DONE flip + acceptance L185 tick + closure-verification belong to **`/closure`** (orchestrator's next spawn).

## ACs satisfied (release re-run, this session)

**10/10 PASS** (evidence: `tests/us0156_contract_test.py` 10/10 + compose 36p/2s + scoped parity OK + `[BUG_VALIDATION_OK]`; AC-7 DoD gate independently re-verified MET):

| AC | Status (slice evidence) |
|----|--------|
| AC-1 | PASS — `test_us0156_auto_command_owns_spawn_only_parent` green (auto.md selects agent auto; spawn-only parent; no retired TUI/RPC route) |
| AC-2 | PASS — `test_us0156_sequential_fresh_phase_tasks` green (continuous multi-phase loop; sequential fresh-phase Tasks; distinct session per phase; PHASE_ROLE_MATRIX covers all 12 phases) |
| AC-3 | PASS — `test_us0156_story_bug_scheduler_mutex_and_order` green (backlog drain; bug-target precedence; dependency-eligible OPEN-story selection; scheduler mutex) |
| AC-4 | PASS — `test_us0156_story_bug_scheduler_mutex_and_order` green (bug-queue targeting; explicit bug-target selects bug scheduler) |
| AC-5 | PASS — `test_us0156_start_from_resume_phase_plan_precedence` green (start-from → resume_brief → state.md precedence; OPENCODE_AUTO_RESUME_AMBIGUOUS on conflict) |
| AC-6 | PASS — `test_us0156_stop_matrix_and_cap_boundaries` green (phase-selection policy; Stop-Matrix + budget-cap boundaries fail closed, reason-coded) |
| AC-7 | **MET** — DoD gate: **BUG-0022 DONE** (backlog L5465 `Status: DONE`, AC-1..8 `[x]`, acceptance L218-region `[x]`, closed via S0163 CLOSURE_PASS) + **BUG-0027 DONE** (acceptance `[x]`); BUG-0028/0029 triaged as prerequisite slices (OPEN, not merged/closed). `test_us0156_dod_and_active_template_parity` green. |
| AC-8 | PASS — `test_us0156_no_retired_route_or_fallback` green (no fallback_execute; no active client.rpc(; no localhost endpoint; retired TUI/RPC absent) |
| AC-9 | PASS — 9 `test_us0156_*` markers green + installer overwrite coverage; no live-desktop/`--pure`/provider-complete claim |
| AC-10 | PASS — US-0156 touched surfaces byte-identical active==template (bridge/orchestrator/auto-command/auto-agent/7 role agents); scoped parity us-0120+bug-0027+bug-0030 `[INTAKE_TEMPLATE_PARITY_OK]` exit 0 |

## Test results (release — live this pass, independently re-run fresh)

- **US-0156 contract (active)**: `python -m pytest tests/us0156_contract_test.py -q` → **10 passed** (0.96s) — nine `test_us0156_*` + `test_opencode_agent_permission_specific_paths_override_broad_deny`.
- **Compose regression (unmodified siblings)**: `python -m pytest tests/bug0027_opencode_manual_phase_persist_test.py tests/bug0030_opencode_auto_command_test.py tests/us0124_contract_test.py tests/us0156_contract_test.py -q` → **36 passed, 2 skipped** (3.20s; 2 skips = BUG-0027/BUG-0030 live-desktop probes, `UAT_PROBE_FORBIDDEN`).
- **Mandated validator bridge**: `python scripts/bug_issue_validate.py --repo . --check-acceptance` → **`[BUG_VALIDATION_OK]` exit 0**.
- **Scoped parity (US-0156 own surfaces, S0163/S0164 norm)**: `python scripts/check_intake_template_parity.py --scope=us-0120` → `[INTAKE_TEMPLATE_PARITY_OK]` exit 0; `--scope=bug-0027` → exit 0; `--scope=bug-0030` → exit 0.
- **Strict runtime proof (Gate 4b)**: all 3 lifecycle tuples **independently RECOMPUTED = 3/3 MATCH** this session (see Gate summary); own release proof `1CB6DF6E…56FD` recompute-confirmed (2-invocation independent match).

## Gate summary (strict order; fresh this session)

| Gate | Result |
|------|--------|
| check_in_tests (1) | **PASS** — validator `[BUG_VALIDATION_OK]` exit 0 + us0156 contract 10/10 + compose 36p/2s + scoped parity us-0120/bug-0027/bug-0030 all OK exit 0; `harness_fail_zero_claimed=false` |
| qa_completion (2) | **PASS** — `qa-findings.md` B-1 REPAIRED (re-verified validator exit 0) + B-2 RESOLVED (non-blocking platform issue); **no unresolved blocking findings** |
| uat_completion (3) | **PASS (RETRY-#1 blocker cleared at source)** — `uat.json` `verdict=VERIFY_PASS / verified_ready=true / total=10 / passed=10 / failed=0 / passed+failed==total / UAT-7 (AC-7) result=pass / AC-7 status=MET / blocking_findings=0 (B1 RESOLVED, preserved as history) / gate_met=true / placeholder_only=false`; `uat.md` verdict `VERIFY_PASS` |
| isolation (4) | **PASS (RETRY-#2 blocker cleared at source)** — execute (dev) + initial-qa (qa) + verify-work (qa) isolation checkpoints all present in `state.md`; **distinct** `fresh_context_marker`s (never-reused); **role-aligned** (US-0069/DEC-0051); valid + not stale + not reused (US-0048/DEC-0029); each has phase-boundary status (DEC-0069 AC-10) |
| strict_runtime_proof (4b) | **PASS** — 3-tuple chain PRESENT + valid + not-reused + unambiguous + role-aligned (US-0056/DEC-0038 / US-0069): execute `90F5F592…A4AE` + initial-qa `DC42ACF2…CDC12` + verify-work `4C9C0520…C0A`; **all 3 independently RECOMPUTED = 3/3 MATCH** via `compute_strict_proof_hash` |
| readme_feature_coverage (3f) | **skipped** (scratchpad `README_FEATURE_COVERAGE_ENFORCE=1` but US-0156 is a scaffold/command/permission story; US-0156 has no new README feature-coverage gap; no blocking gap surfaced; non-blocking) |
| project_readme (3g) | **skipped** (`FRAMEWORK_KIT_REPO=1`; kit-repo self-reference; US-0156 is a kit-surface story, not a project README surface) |
| version-doc (17) | **skipped_no_release_version** (workflow-only; `release_version` blank → `[Unreleased]` path; no per-version file; no kit semver bump) |
| publish (14) | **deferred to operator confirm** (`RELEASE_PUBLISH_MODE=confirm`; `PUBLISH_CONFIRMATION_REQUIRED`; no target in `RELEASE_TARGETS_DEFAULT`; `npm_published=false`; no kit semver bump; kit `0.1.9`) |
| sync (2) | **not eligible** (`SYNC_POLICY_MODE=disabled` → `push_decision=not_eligible`, `reason_code=SYNC_DISABLED`) |
| backlog_reconciliation (10) | **deferred to `/closure`** (US-0045; US-0156 stays OPEN; L185 `[ ]` unchanged; no sibling flipped) |
| finalization (5) | **PASS** (queue S0162 `blocked → released` in-place, single row, no duplicate; canonical notes written; legacy pointer updated; findings appended; state checkpoint appended) |

## Run

```powershell
# US-0156 contract suite (active) — expected: 10 passed
python -m pytest tests/us0156_contract_test.py -q

# Compose regression (unmodified siblings BUG-0027/BUG-0030/US-0124/US-0156) — expected: 36 passed, 2 skipped
python -m pytest tests/bug0027_opencode_manual_phase_persist_test.py tests/bug0030_opencode_auto_command_test.py tests/us0124_contract_test.py tests/us0156_contract_test.py -q

# Mandated validator bridge — expected: [BUG_VALIDATION_OK] exit 0
python scripts/bug_issue_validate.py --repo . --check-acceptance

# Scoped parity (US-0156 own surfaces) — expected: [INTAKE_TEMPLATE_PARITY_OK] exit 0 each
python scripts/check_intake_template_parity.py --scope=us-0120
python scripts/check_intake_template_parity.py --scope=bug-0027
python scripts/check_intake_template_parity.py --scope=bug-0030

# Operator post-ship (not run this release): install/upgrade the kit that includes US-0156's
# active surfaces on an OpenCode host, restart, and drive a full /auto lifecycle to RELEASE_PASS.
```

- **start_command**: `python -m pytest tests/us0156_contract_test.py -q` (or the compose command above)
- **runtime_mode**: `local`
- **runtime_context_ref**: `docs/engineering/architecture.md` `# US-0156`; `docs/engineering/runbook.md` (OpenCode `/auto` parity section); `sprints/S0162/progress.md` (execute evidence) + `sprints/S0162/summary.md`

## Connect

- **service_url**: n/a (OpenCode agent / command / scaffold slice; no long-running service is spawned by the kit itself at release time)
- **service_port**: n/a
- **health_endpoint**: n/a — verify via pytest contract markers (10/10) + compose regression (36p/2s) + `[BUG_VALIDATION_OK]` validator + scoped parity `--scope=us-0120/bug-0027/bug-0030` all OK

## Verify

1. `python -m pytest tests/us0156_contract_test.py -q` → 10/10 PASS (9 `test_us0156_*` + `test_opencode_agent_permission_specific_paths_override_broad_deny`).
2. `python -m pytest tests/bug0027_opencode_manual_phase_persist_test.py tests/bug0030_opencode_auto_command_test.py tests/us0124_contract_test.py tests/us0156_contract_test.py -q` → 36 passed, 2 skipped (composed guard; BUG-0027/BUG-0030 live-desktop probes intentionally skipped per UAT_PROBE_FORBIDDEN).
3. `python scripts/bug_issue_validate.py --repo . --check-acceptance` → `[BUG_VALIDATION_OK]` exit 0.
4. `python scripts/check_intake_template_parity.py --scope=us-0120` (and `--scope=bug-0027`, `--scope=bug-0030`) → `[INTAKE_TEMPLATE_PARITY_OK]` each, exit 0.
5. Confirm AC-7 DoD gate: `docs/product/backlog.md` `### BUG-0022` `Status: DONE` + AC-1..8 `[x]` + `docs/product/acceptance.md` BUG-0022 row `[x]`; `### BUG-0027` `Status: DONE` + acceptance `[x]`; BUG-0028/BUG-0029 remain OPEN (prerequisite slices, not merged/closed).
6. Confirm US-0156's own touched surfaces are byte-identical active==template (`.opencode/agents/auto.md`, `bridge`, `orchestrator`, 7 role agents, `tests/us0156_contract_test.py` + template) + no retired TUI/RPC route is present (`.opencode/commands/auto.md` + `sprints/S0162/progress.md`).
7. Confirm strict proof chain (3 tuples) — execute `90F5F592…A4AE` + initial-qa `DC42ACF2…CDC12` + verify-work `4C9C0520…C0A` — **all 3 RECOMPUTE-MATCH** via `python -c "import sys; sys.path.insert(0,'.'); from scripts.token_cost_lib import compute_strict_proof_hash; print(compute_strict_proof_hash('auto-20261002-us0156','rp-auto-20261002-us0156-execute-dev-20261003T080657Z-US-0156','execute','dev','2026-10-03T08:06:57Z',3600).upper())"` (and equivalent for the other two). Expected hash per above; **MATCH = chain intact**.
8. Optional live OpenCode `/auto` full-lifecycle (operator post-ship): install kit that includes US-0156's active surfaces; restart OpenCode; drive a multi-phase `/auto` loop (intake → execute → qa → verify-work → release) and observe RELEASE_PASS. **NOT claimed this release** (`live_opencode_session_command_pass_claimed=false`, `provider_completion_claimed=false`, `live_opencode_desktop_pass_claimed=false`, `live_opencode_cli_tui_pass_claimed=false` — UAT_PROBE_FORBIDDEN).

- **expected_health_signal**: 10/10 contract PASS + 36p/2s compose PASS + `[BUG_VALIDATION_OK]` + scoped parity OK; DoD gate MET (BUG-0022 + BUG-0027 DONE, BUG-0028/0029 OPEN prerequisite slices held); strict proof chain 3/3 RECOMPUTE-MATCH.

## Credentials

- No inline secrets. Kit denies `.env` reads (US-0085 discipline).
- npm publish credentials (if the operator later confirms a target): env-reference-only (`NPM_TOKEN` / operator shell profile / CI secret store) — **not used this turn** (`PUBLISH_CONFIRMATION_REQUIRED` recorded; `RELEASE_TARGETS_DEFAULT` empty).
- No API tokens, model keys, or endpoints required for contract verification (contract/mock primary).

## Known Issues

- **NB1 (carried, non-blocking)**: **live OpenCode `/auto` full-lifecycle completion is an operator UAT residual** post-ship (UAT_PROBE_FORBIDDEN held this release; `live_opencode_desktop_pass_claimed=false`, `live_opencode_cli_tui_pass_claimed=false`, `live_opencode_session_command_pass_claimed=false`, `provider_completion_claimed=false`, `harness_fail_zero_claimed=false` — honest no-claim posture). AC slice evidence (contract + compose + parity + validator) is the release evidence, not a live-host claim.
- **NB2 (carried, non-blocking-for-this-sprint)**: repo-wide parity `--scope all` is **RED** (exit 2) on two **pre-existing pairs OUTSIDE US-0156's touched surface**: `CHANGELOG.md (10041b) != template/CHANGELOG.md (7174b)` + `tests/bug0016_contract_test.py (9897b) != template/tests/bug0016_contract_test.py (9810b)`. **US-0156's own surfaces are GREEN** (scoped us-0120/bug-0027/bug-0030 all OK). This is **pre-existing template-mirror drift** (active ahead of template; additive), NOT a US-0156 defect, and a **repo-wide hygiene item routed to dev/orchestrator for a template-mirror sync** (S0163/S0164 precedent). **Recorded honestly; not waived; not fixed here.** It does **not** block the scoped-scope gated release for US-0156 (scoped gate is GREEN).
- **US-0156 status**: **OPEN** — `docs/product/acceptance.md` L185 `[ ]` **unchanged** this phase. `/closure` owns the OPEN→DONE flip + acceptance tick (US-0045 / `architecture.md:610` "Release cannot mark DONE" / `release.md:334-338` Step 10 / `closure.md:14-19`).
- **BUG-0022** DONE (L5465 `Status: DONE`; acceptance `[x]`) — held, not re-flipped. **BUG-0027** DONE (acceptance `[x]`) — held, not reopened. **BUG-0028/BUG-0029** remain OPEN (prerequisite slices triaged by US-0156 AC-7; not merged/closed by this release).
- npm publish deferred (`RELEASE_PUBLISH_MODE=confirm`; `PUBLISH_CONFIRMATION_REQUIRED`; `npm_published=false`; no kit semver bump; kit `0.1.9`).
- Sync `SYNC_POLICY_MODE=disabled` (no git push).

## Provenance / prior retry history (preserved, not erased)

This RETRY #3 RELEASE_PASS record **supersedes** the prior two RETRYs on S0162 (preserved as history in `sprints/S0162/release-findings.md` + `docs/engineering/state.md`, not erased):

| Retry | Date | Verdict | Reason code | Status of blocker |
|-------|------|---------|-------------|-----------|
| #1 | 2026-10-02T20:23:54Z | RELEASE_BLOCKED | `RELEASE_UAT_FAILED` | UAT files `uat.json`/`uat.md` still prior-cycle `VERIFY_BLOCKED` (B-1 DoD gate unmet on BUG-0022 OPEN). **Cleared at source** by fresh qa UAT-reconciliation (2026-10-02T18:20:00Z, marker `qa-US0156-S0162-uat-reconcile-20261002T182000Z-fresh`) reconciling to **VERIFY_PASS**. |
| #2 | 2026-10-03T00:00:00Z | RELEASE_BLOCKED | `RUNTIME_PROOF_MISSING` + `PHASE_CONTEXT_ISOLATION_MISSING` | execute (dev) + initial-qa (qa) isolation/strict-proof evidence absent (strict-proof runtime not yet installed at original S0162 sessions). **Cleared at source** by fresh dev + qa remediation spawns (2026-10-03T08:06:57Z dev + 2026-10-03T08:16:47Z qa), minting fresh, valid, recompute-confirmed 3-tuple chain. |
| **#3 (this)** | **2026-10-03T08:26:24Z** | **RELEASE_PASS** | **n/a** (all gates green) | **Both prior blockers cleared at source; gate chain green on fresh evidence; gate-5 finalization performed.** |

No override, no waiver, no force-PASS. Fail-closed contract discipline upheld at every retry (prior RETRYs correctly blocked on their own evidence; cleared only at the source of the evidence).

## Evidence refs

- `sprints/S0162/release-findings.md` (RETRY #3 RELEASE_PASS appended; RETRY #1 + #2 preserved as history)
- `sprints/S0162/qa-findings.md` (QA_REMEDIATION_PASS; B-1 REPAIRED, B-2 RESOLVED; no unresolved blockers)
- `sprints/S0162/verify-work-findings.md` (VERIFY_PASS this qa re-run; 10/10 ACs)
- `sprints/S0162/uat.json` / `uat.md` (verdict **VERIFY_PASS**, verified_ready=true, UAT-7 pass, AC-7 MET)
- `sprints/S0162/progress.md` (execute evidence, T-anch..T-009 all `[x]` + REMEDIATION CYCLE addendum)
- `sprints/S0162/summary.md` (REMEDIATION CYCLE addendum; no code change this cycle)
- `sprints/S0162/tasks.md` (T-anch + T-001..T-009 all `[x]`; Completion-gate 5/5 `[x]`)
- `sprints/S0162/sprint.md`
- `handoffs/release_queue.md` (S0162 row `released` — single row, in-place, no duplicate)
- `handoffs/release_notes.md` (latest pointer updated to S0162; unreleased-visibility section refreshed)
- `docs/engineering/state.md` — S0162 US-0156 execute (L3166+) + initial-qa (L3239+) + verify-work (L2939+) isolation + strict-proof blocks + **this RETRY #3 RELEASE checkpoint appended to bottom**; RETRY #1 (L3031+) + #2 (L3070+) BLOCKED records preserved as history
- `docs/engineering/architecture.md` `# US-0156` (spec; AC-1..10 + AC-7 DoD gate)
- `docs/product/backlog.md` `### US-0156` (Status: OPEN — unchanged) + `### BUG-0022` (L5465 `Status: DONE`) + `### BUG-0027` (`Status: DONE`) + `### BUG-0028` (OPEN) + `### BUG-0029` (OPEN)
- `docs/product/acceptance.md` L185 (`[ ]` US-0156 — unchanged; closure owns the flip) + L213 (BUG-0022 `[x]`) + L218 (BUG-0027 `[x]`)
- `tests/us0156_contract_test.py` + `template/tests/us0156_contract_test.py` (10 markers, byte-identical)
- `tests/bug0027_opencode_manual_phase_persist_test.py` + `tests/bug0030_opencode_auto_command_test.py` + `tests/us0124_contract_test.py` (compose, unmodified)
- `scripts/token_cost_lib.py` `compute_strict_proof_hash` (3-tuple chain + own release proof — independently recompute-confirmed MATCH)
- `.opencode/agents/release.md` + `template/.opencode/agents/release.md` (role permission map; release-owned surfaces respected this phase)
- `docs/engineering/runbook.md` (OpenCode `/auto` parity; runbook byte-parity active==template)
- `RELEASE_PUBLISH_MODE=confirm` (scratchpad; publish deferred to operator confirm; `PUBLISH_CONFIRMATION_REQUIRED` this turn)

## What's new (US-0156)

- **Native in-chat `/auto` command** on OpenCode: `auto` agent (spawn-only parent) drives the full multi-phase lifecycle loop (intake → execute → qa → verify-work → release → closure → refresh-context) via sequential, isolated, fresh-phase subagents (BUG-0006 / US-0048).
- **Continuous multi-phase scheduling**: `PHASE_ROLE_MATRIX` (12 phases) drives phase-selection; Stop-Matrix + budget-cap boundaries fail-closed with reason-coded outputs (no silent drift, no over-run).
- **Backlog-drain scheduler**: bug-queue targeting (explicit bug-target selects bug scheduler); dependency-eligible OPEN-story selection; scheduler mutex (no parallel phase-spawn races on the same `orchestrator_run_id`).
- **Resume/start-from**: `resume_brief` + `state.md` phase-plan precedence; `OPENCODE_AUTO_RESUME_AMBIGUOUS` fail-closed on ambiguity.
- **Parity surface repair**: retired `its-magic-auto/{index,tui,rpc}.ts` removed (git status D); no active `client.rpc(`; no `localhost:NNNN` endpoint; no `fallback_execute`; permission-order contract `**": deny` first, specific owner-path allows last (broad-deny-first, DEC-0152 last-matching-wins).
- **10 ACs + 10 contract markers** in `tests/us0156_contract_test.py` (active + template byte-identical).
