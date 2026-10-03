# Release Notes — S0163 / BUG-0022

- **Sprint**: `S0163`
- **Bug**: `BUG-0022` — Cursor `/auto` Task-spawns inherit parent chat model instead of role_catalog (A1 resolve-then-spawn; 8 ACs)
- **Story**: (none; BUG-0022 is the DoD gate for US-0156 — US-0156 not released this phase)
- **Release date**: `2026-09-30T21:08:51Z` (UTC)
- **orchestrator_run_id**: `auto-20260930-bug0022`
- **delivery_mode**: `ultra_lean`
- **macro_phase**: `ship` (release → `/closure` per CROSS_MODEL_REVIEW=0 native chain)
- **policy_mode**: `confirm` (`RELEASE_PUBLISH_MODE=confirm`; orchestrator default-off; operator confirm absent this turn → npm publish deferred)
- **trigger_source**: `auto`
- **branch**: `local` (no push; `SYNC_POLICY_MODE=disabled`)
- **fresh_context_marker**: `release-BUG0022-20260930T210851Z-fresh`
- **model_id**: `qwen3.8:27b` (CROSS_MODEL_REVIEW=0)
- **runtime_proof_id**: `rp-auto-20260930-bug0022-release-release-20260930T210851Z-BUG-0022`
- **proof_hash**: `9649B6C8AFB71A0E60907E9B940B440431FCA9DA873E4430658323810471D417`
- **proof_ttl**: `2026-09-30T22:08:51Z` (UTC)
- **release_version**: (none — workflow-only release; no kit semver bump; kit remains `0.1.9`)
- **npm_published**: `false`

## Verdict

**RELEASE_PASS.** Mandatory release gates (1, 2, 3, 4, 4b) green with **independent re-run**: scoped `pytest tests/bug0022_cursor_task_spawn_model_test.py` **6/6** + `template/tests/bug0022_cursor_task_spawn_model_test.py` **8/8** + `tests/bug0030_opencode_auto_command_test.py` **4/2skip** + `tests/bug0021_*` **8skip** + `tests/bug0023_*` **8skip** + `tests/us0156_contract_test.py` **10/10** = **28 passed / 0 failed / 18 skipped (46 tests)** + 3 parity scopes `[INTAKE_TEMPLATE_PARITY_OK]` + `[MODEL_TIER_SELF_TEST_OK]` + runbook active↔template byte-identical 263345b + US-0071 metadata exit 0. Queue row S0163 → `released`. Publish deferred (`PUBLISH_CONFIRMATION_REQUIRED`; `npm_published=false`) — not a release FAIL. **No backlog mutation (closure owns OPEN→DONE per US-0045).** No npm / GitHub publish this turn. No git push.

Gate-1: live scoped contract @ release + US-0071 metadata exit 0. **`harness_fail_zero_claimed=false`**.

## Summary

BUG-0022 ships the **resolve-then-spawn** contract on the Cursor IDE `/auto` surface (R-0154 / architecture `# BUG-0022`):

- **Pre-spawn model resolution**: `.cursor/commands/auto.md` (+ template twin) inserts step 3a **before** any Task spawn — calls `model_tier_lib.resolve_model_for_phase(phase_id, scratchpad, catalog)` (UNCOUNTED; source unchanged) and threads the resolved `slug`/`alias` into the Task `model:` payload.
- **Critic hook alignment**: step 1 resolves `producer_model_id` via the same resolver (used as producer `model:`); step 2 threads `sovereign_critic_lib.select_critic_model(...)` output (`roles.critic`) into the critic `model:` — **never** a hardcoded release slug.
- **Agent frontmatter neutral**: `.cursor/agents/{po,release}.mdc` (+ template twins) lose `model: inherit` (keyless, like dev/qa/security/tech-lead); curator `model: fast` untouched.
- **Fail-closed role gaps**: role→catalog gaps emit `MODEL_ROLE_SLUG_UNKNOWN` (7-token reason set **unchanged**; no schema v3); no silent `model:` on a missed resolve.
- **Provenance**: each spawn isolation row carries additive `model_id` + `model_provenance`; one-line spec-conformant `docs/engineering/runbook.md` addendum (§ Role catalog enablement recipe, line 805) present **identically** in active + template (263345b byte-identical).
- **Mock-injection contract suite**: `tests/bug0022_cursor_task_spawn_model_test.py` (m1–m6) + `template/test` mirror (m7 parity + m8 no-sibling-mutation). **Not a live Cursor probe** (`UAT_PROBE_FORBIDDEN` held — D5).

Prior cycle's sole blocking defect (**F-001** runbook active↔template byte-parity) is **closed**: the dev remediation applied the spec one-line addendum to BOTH runbooks; this release re-verified parity **independently (MATCH)**.

FRAMEWORK_KIT_REPO=1 — UAT `contract_tests_primary`; 6 live-runtime classes `UAT_PROBE_FORBIDDEN` (incl. live Cursor `cli_smoke`). **No live Cursor IDE PASS claimed. No provider-completion claim (NB1).**

## What's new

- BUG-0022: resolve-then-spawn on Cursor `/auto` Task-spawn — pre-spawn `resolve_model_for_phase` (step 3a), critic `roles.critic` (no hardcoded slug), keyless `{po,release}.mdc` (+ template), fail-closed `MODEL_ROLE_SLUG_UNKNOWN`, additive `model_id`/`model_provenance` isolation row, one-line spec runbook addendum (active + template byte-identical), 6+8 `test_bug0022_*` markers (m1–m8 inc. parity + no-sibling).

## ACs satisfied (QA verify-work + release re-run)

**8/8 PASS** (slice; backlog ACs remain unchecked until `/closure`):

| AC | Status (slice evidence) |
|----|--------|
| AC-1 | PASS — producer spawn carries catalog-resolved `model:` (`test_bug0022_producer_spawn_carries_catalog_model_when_role_catalog`) |
| AC-2 | PASS — critic spawn carries `roles.critic` (`test_bug0022_critic_spawn_carries_roles_critic`) |
| AC-3 | PASS — phase→role→catalog alignment, fail-closed (`test_bug0022_role_catalog_gaps_fail_closed`) |
| AC-4 | PASS — `MODEL_FALLBACK=inherit` only on documented override (`test_bug0022_inherit_only_on_documented_fallback`) |
| AC-5 | PASS — reproducible mock-injection contract suite (6 active + 8 template; no live probe) |
| AC-6 | PASS — isolation/provenance distinguishes resolved vs inherited (`test_bug0022_provenance_isolation_row`; runbook:805 `model_provenance` line both files) |
| AC-7 | PASS — sibling integrity (`test_bug0022_no_sibling_mutation` **now PASS**; bug0021 8skip / bug0023 8skip / bug0030 4pass-2skip; BUG-0027 not reopened) |
| AC-8 | PASS — no npm/git-push/.env; template parity restored (runbook byte-identical, all 3 parity scopes OK); catalog + resolver libs UNMUTATED |

## Test results (release — live this pass, independently re-run)

- **Scoped contract (active)**: `python -m pytest tests/bug0022_cursor_task_spawn_model_test.py -v` → **6 passed** (0.13s).
- **Scoped contract (template)**: `python -m pytest template/tests/bug0022_cursor_task_spawn_model_test.py -v` → **8 passed** (1.34s), inc. `test_bug0022_active_template_parity` (m7) + `test_bug0022_no_sibling_mutation` (m8) **PASS**.
- **BUG-0030 regression**: `python -m pytest tests/bug0030_opencode_auto_command_test.py -v` → **4 passed, 2 skipped**, inc. `test_bug0030_active_template_parity` **PASS** (was FAIL = F-001).
- **Sibling guards (as-is)**: `pytest tests/bug0021_opencode_cli_tui_plugin_load_test.py` → **8 skipped**; `pytest tests/bug0023_opencode_cli_tui_dispatch_rpc_test.py` → **8 skipped** (no new failures).
- **US-0156 DoD gate**: `python -m pytest tests/us0156_contract_test.py -v` → **10 passed** (0.98s).
- **Parity**: `python scripts/check_intake_template_parity.py --scope model-tier|sovereign-critic|bug-0030` → `[INTAKE_TEMPLATE_PARITY_OK]` (all 3).
- **Self-test**: `python scripts/model_tier_lib.py --self-test` → `[MODEL_TIER_SELF_TEST_OK]`.
- **Runbook byte-parity**: active `263345 b` = template `263345 b`, SHA-256 `88168288261464514317AD5BB37CD3C13830293ECA427B222801436D5495F4BE` (MATCH).
- **Resolver libs**: `git status --porcelain scripts/{model_tier,sovereign_critic}_lib.py (+ template)` → empty (**UNMUTATED**).
- **Metadata guard**: `python scripts/check-user-visible-metadata.py --repo .` → exit 0 (US-0071).
- **Totals**: **28 passed / 0 failed / 18 skipped (46 tests)**; both previously-failing tests now PASS; `harness_fail_zero_claimed=false`.

## Gate summary

| Gate | Result |
|------|--------|
| check_in_tests | **PASS** (28p/0f/18s; 3 parity scopes OK; self-test OK; runbook byte-identical; US-0071 metadata exit 0; `harness_fail_zero_claimed=false`) |
| qa | PASS (`verify-work-findings.md` VERIFY_PASS S0163_REMEDIATED_OK; 8/8 ACs; F-001 closed) |
| verify_work | PASS (8/8 ACs verified; contract_tests_primary; live_cursor_pass_claimed=false) |
| uat | PASS (`contract_tests_primary`; `UAT_PROBE_FORBIDDEN` for live Cursor; `provider_completion_claimed=false`) |
| isolation_evidence | PASS (execute + remediation-dev + qa + release; distinct fresh_context_marker; CROSS_MODEL_REVIEW=0) |
| strict_runtime_proof | **PASS** (consumed dev remediation `D913260A…5E0CE` + qa verify-work `A07647CC…1CC6F` both independently RECOMPUTED MATCH via `compute_strict_proof_hash`) |
| readme_feature_coverage_3f | skipped_not_enforced (not enabled this run) |
| project_readme_3g | skipped (`FRAMEWORK_KIT_REPO=1`; kit_repo_skipped=true) |
| publish | deferred (`RELEASE_PUBLISH_MODE=confirm`; `PUBLISH_CONFIRMATION_REQUIRED`; `npm_published=false`) |
| sync | not_eligible (`SYNC_POLICY_MODE=disabled`) |
| version-doc (17) | skipped_no_release_version (workflow-only; `[Unreleased]` path) |
| finalization | **PASS** (queue S0163 = `released`; backlog reconciliation deferred to `/closure` per US-0045; no kit semver bump) |

## Run

```powershell
python -m pytest tests/bug0022_cursor_task_spawn_model_test.py -v        # Expected: 6 passed
python -m pytest template/tests/bug0022_cursor_task_spawn_model_test.py -v  # Expected: 8 passed (m7 parity, m8 no-sibling)
python -m pytest tests/us0156_contract_test.py -v                         # Expected: 10 passed (DoD gate)

python scripts/check_intake_template_parity.py --repo . --scope model-tier   # Expected: [INTAKE_TEMPLATE_PARITY_OK]
python scripts/model_tier_lib.py --self-test                               # Expected: [MODEL_TIER_SELF_TEST_OK]
python scripts/check-user-visible-metadata.py --repo .                     # Expected: exit 0

# After operator confirms publish of a kit that includes BUG-0022 (not run this release):
# its-magic --target <repo> --mode upgrade
# Restart Cursor; verify a /auto phase Task spawn carries the catalog-resolved model (model_provenance=resolvable),
# critic spawn carries roles.critic (not a hardcoded slug).
```

- **start_command**: `python -m pytest tests/bug0022_cursor_task_spawn_model_test.py -v`
- **runtime_mode**: `local`
- **runtime_context_ref**: `docs/engineering/runbook.md` § Role catalog enablement recipe (line 805); `docs/engineering/architecture.md` `# BUG-0022`

## Connect

- **service_url**: n/a (Cursor IDE agent/command slice; no long-running HTTP service)
- **service_port**: n/a
- **health_endpoint**: n/a — verify via pytest contract markers m1–m8 + 3 parity scopes + `[MODEL_TIER_SELF_TEST_OK]`

## Verify

1. `python -m pytest tests/bug0022_cursor_task_spawn_model_test.py -v` → 6/6 PASS.
2. `python -m pytest template/tests/bug0022_cursor_task_spawn_model_test.py -v` → 8/8 PASS (inc. `test_bug0022_active_template_parity`, `test_bug0022_no_sibling_mutation`).
3. `python -m pytest tests/us0156_contract_test.py -v` → 10/10 PASS (DoD gate green).
4. Parity `--scope model-tier|sovereign-critic|bug-0030` → all `[INTAKE_TEMPLATE_PARITY_OK]`.
5. Confirm `.cursor/agents/{po,release}.mdc` are **keyless** (no `model:` key) active + template; `.cursor/commands/auto.md` step 3a present active + template (byte-matched).
6. Confirm `docs/engineering/runbook.md` + `template/docs/engineering/runbook.md` carry the identical one-line addendum at line 805 (byte-identical, 263345b).
7. UAT honesty: `probe_kind=contract_tests_primary`; `live_cursor_ide_pass_claimed=false`; `provider_completion_claimed=false`; no live Cursor OpenCode IDE probe.
8. Optional operator post-ship: upgrade kit on a target repo; restart Cursor; invoke a `/auto` phase and observe the Task spawn carries the catalog-resolved model and the critic carries `roles.critic`.

- **expected_health_signal**: pytest bug0022 active 6/6 + template 8/8; us0156 10/10; parity + self-test + metadata silent exit 0.

## Credentials

- No inline secrets. Kit denies `.env` reads (US-0085).
- npm publish credentials: env-reference-only (`NPM_TOKEN` / operator shell profile / CI secret store) — **not** used this turn (`PUBLISH_CONFIRMATION_REQUIRED`).
- No API tokens required for contract verification.

## Known Issues

- **NB1 LIVE_CURSOR_IDE_RESIDUAL**: CI cannot prove a live Cursor IDE `/auto` Task-spawn resolves the catalog model (D5 mock-injection only). Residual live behavior requires operator re-probe after ship. **No live Cursor IDE PASS claimed. No provider-completion claim (NB1).**
- **NB2 CATALOG_ROLE_HYGIENE**: role→catalog gaps (`qe`/`curator`/`tech-lead`/`closure`/`sprint-plan`) emit `MODEL_ROLE_SLUG_UNKNOWN` (unresolved-but-cited, never force-mapped). Bounded follow-on; **not** this bug, **not** a schema redesign. Non-blocking.
- **3f README_FEATURE_COVERAGE**: not enforced this run; no BUG-0022 gap. Non-blocking.
- BUG-0022 backlog/acceptance status remains **OPEN** until `/closure` (closure owns the DONE flip per US-0045 / architecture.md:3236-3237; release.md step 10; closure.md:14-19; architecture.md:610 "Release cannot mark DONE").
- **US-0156 remains OPEN** (DoD gate = BUG-0022 + BUG-0027 DONE; BUG-0027 DONE, BUG-0022 now *eligible-not-flipped*; US-0156's own closure owns its release).
- BUG-0021 / BUG-0023 remain OPEN (untouched); BUG-0027 / BUG-0024 DONE (preserved, not reopened); BUG-0026/0028/0029/0030 not mutated.
- npm publish deferred under `RELEASE_PUBLISH_MODE=confirm` (no kit semver bump this release; kit `0.1.9`).

## Evidence refs

- `sprints/S0163/release-findings.md`
- `sprints/S0163/qa-findings.md`
- `sprints/S0163/verify-work-findings.md`
- `sprints/S0163/progress.md` (REMEDIATION CYCLE), `sprints/S0163/summary.md` (REMEDIATION CYCLE ADDENDUM)
- `handoffs/qa_to_verify_work.md` (PASS handoff)
- `handoffs/release_queue.md` (S0163 row)
- `docs/engineering/state.md` (S0163 isolation + strict-proof blocks)
- `docs/engineering/architecture.md` `# BUG-0022` (:3183 one-line addendum spec; :3236-3237 closure-ownership per US-0045)
- `docs/engineering/runbook.md:805` + `template/docs/engineering/runbook.md:805` (one-line addendum, 263345b byte-identical)
- `tests/bug0022_cursor_task_spawn_model_test.py`, `template/tests/bug0022_cursor_task_spawn_model_test.py`, `tests/us0156_contract_test.py`
- `scripts/token_cost_lib.py` `compute_strict_proof_hash` (independent recompute MATCH)
- `scripts/model_tier_lib.py` / `scripts/sovereign_critic_lib.py` (+ template twins) — **UNMUTATED**
