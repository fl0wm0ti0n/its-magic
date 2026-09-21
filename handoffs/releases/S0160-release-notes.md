# Release Notes — S0160 / BUG-0027

- **Sprint**: `S0160`
- **Bug**: `BUG-0027` — OpenCode manual phase commands cannot persist canonical workflow evidence (A1 Hybrid)
- **Story**: (none)
- **Release date**: `2026-09-21T22:12:00Z` (UTC)
- **orchestrator_run_id**: `auto-20260921-bug0027`
- **parent_run**: `ir-20260921T190544Z-bug0027`
- **delivery_mode**: `ultra_lean`
- **macro_phase**: `ship` (release → `/closure` per CROSS_MODEL_REVIEW=0 native chain)
- **policy_mode**: `confirm` (`RELEASE_PUBLISH_MODE=confirm`; orchestrator default-off; operator confirm absent this turn → npm publish deferred)
- **trigger_source**: `auto`
- **branch**: `local` (no push; `SYNC_POLICY_MODE=disabled`)
- **fresh_context_marker**: `release-BUG0027-20260921T221200Z-fresh`
- **model_id**: `inherit` (CROSS_MODEL_REVIEW=0)
- **runtime_proof_id**: `rp-auto-20260921-bug0027-release-release-20260921T221200Z-BUG-0027`
- **proof_hash**: `4B3FAF496F33A53FB75DB67796C44B8F3B60536B3A3BAB8F8A2D1CC41FB67AFE`
- **proof_ttl**: `2026-09-21T23:12:00Z` (UTC)
- **release_version**: (none — workflow-only release; no kit semver bump; kit remains `0.1.6`)
- **npm_published**: `false`

## Verdict

**RELEASE_PASS.** Mandatory release gates (1, 2, 3, 4, 4b) green with **scoped pytest bug0027 10/10** + compose us0125..bug0019 **66/66** (76 total this pass) + US-0071 metadata exit 0 + parity `--scope bug-0027` OK. Queue row S0160 → `released`. Publish deferred (`PUBLISH_CONFIRMATION_REQUIRED`; `npm_published=false`) — not a release FAIL. No backlog mutation (closure owns OPEN→DONE). No npm / GitHub publish this turn. No git push.

Gate-1: live scoped contract @ release + US-0071 metadata exit 0. **`harness_fail_zero_claimed=false`**.

## Summary

BUG-0027 ships A1 Hybrid manual-phase persist (R-0151 / architecture `# BUG-0027`):

- IsolationEvidence identity fields (`storyId` / `sprintId` / `orchestratorRunId` / `bugId`); `persistIsolationViaPython` `--append-isolation` with those IDs.
- Thin `persistManualPhaseIsolation` (not `runAutoLifecycle`); `command.executed` limb for `MANUAL_PHASE_COMMAND_NAMES`; mutex vs double-append.
- RPC/context forward; reject `tui-auto` as release evidence (`OPENCODE_PLACEHOLDER_PARENT_REJECTED`); no fabricated proofs.
- Targeted glob widen (dev: `state.md` + `summary.md`; qa: `state.md`) + fail-closed-before-work; deny-last held.
- OpenCode intake packs `--file`/`--stdin`/`--self-test`; drop intake validator from execute/discovery.
- Ten locked `test_bug0027_*` markers; `BUG0027_PAIRS` + upgrade overwrite; US-0125 named-CLI compose-amend (ACs stay DONE).

FRAMEWORK_KIT_REPO=1 — UAT `contract_tests_primary`; 6 live-runtime classes `UAT_PROBE_FORBIDDEN` including live OpenCode CLI TUI `cli_smoke`. **No live OpenCode CLI TUI PASS. No fake live-Chrome PASS. No toast-repair claim.**

## What's new

- BUG-0027: Hybrid manual-phase persist for OpenCode direct slash commands — IsolationEvidence identity fields, `persistManualPhaseIsolation`, reject `tui-auto`, targeted glob widen, supported validator CLI, ten `test_bug0027_*`, active↔template parity.

## ACs satisfied (QA + verify-work, UAT 7/7)

**6/6 PASS** (slice; backlog ACs remain unchecked until `/closure`):

| AC | Status |
|----|--------|
| AC-1 | PASS (slice) — direct phase runs with required writes or fail-closed before work |
| AC-2 | PASS (slice) — persist-or-not-success; no success while persist denied |
| AC-3 | PASS — real session/run IDs; `tui-auto` rejected as release evidence |
| AC-4 | PASS — `/auto` toast unamended; no fabricated proofs |
| AC-5 | PASS — supported validator CLI; `--repo . --enforce` removed from OpenCode packs |
| AC-6 | PASS — ten `test_bug0027_*`; active↔template parity |

## Test results (release — live this pass)

- **Scoped contract**: `python -m pytest tests/bug0027_opencode_manual_phase_persist_test.py -v` → **10 passed** fail 0 duration **0.83s**.
- **Compose**: us0125+bug0016+bug0024+bug0015+us0124+us0122+bug0018+bug0019 → **66 passed** in **3.13s** (11+7+8+7+12+8+6+7).
- **Parity**: `python scripts/check_intake_template_parity.py --repo . --scope bug-0027` → `[INTAKE_TEMPLATE_PARITY_OK]`.
- **Metadata guard**: `python scripts/check-user-visible-metadata.py --repo .` → exit 0.
- **Canonical harness**: **not re-run**; `harness_fail_zero_claimed=false`.

## Gate summary

| Gate | Result |
|------|--------|
| check_in_tests | **PASS** (scoped pytest bug0027 10/10 + compose 66/66 + US-0071 metadata + parity; harness_fail_zero_claimed=false) |
| qa | PASS (`sprints/S0160/qa-findings.md`; 0 blockers; NB1 informational) |
| verify_work | PASS (`sprints/S0160/uat.json` 6/6 ACs; 7/7 UAT; verify-work pytest 10/10) |
| uat | PASS (7/7; `contract_tests_primary`; live OpenCode CLI TUI `UAT_PROBE_FORBIDDEN`) |
| isolation_evidence | PASS (execute+qa+verify-work+release; distinct fresh_context_marker; CROSS_MODEL_REVIEW=0) |
| strict_runtime_proof | **PASS** (verify-work `rp-auto-20260921-bug0027-verify-work-qa-20260921T220700Z-BUG-0027` / `98DE3A16D39BF5B73CC5A4929A3DB2D7094C8D4020255B10D36720CB22A79F73` consumed @22:12:00Z before TTL 23:07:00Z; qa+execute MATCH) |
| readme_feature_coverage_3f | FAIL_nonblocking (`README_FEATURE_COVERAGE_GAP:BUG-0024` sibling DONE; not this sprint) |
| project_readme_3g | skipped (`FRAMEWORK_KIT_REPO=1`; kit_repo_skipped=true) |
| publish | deferred (`RELEASE_PUBLISH_MODE=confirm`; orchestrator default-off; `PUBLISH_CONFIRMATION_REQUIRED`; npm_published=false) |
| sync | not_eligible (`SYNC_POLICY_MODE=disabled`) |
| version-doc (17) | skipped_no_release_version (workflow-only; `[Unreleased]` path) |
| finalization | **PASS** (queue S0160 = `released`; no kit semver bump) |

## Run

```powershell
python -m pytest tests/bug0027_opencode_manual_phase_persist_test.py -v
# Expected: 10 passed

python scripts/check_intake_template_parity.py --repo . --scope bug-0027
# Expected: [INTAKE_TEMPLATE_PARITY_OK]

python scripts/check-user-visible-metadata.py --repo .
# Expected: exit 0

# After operator confirms publish of a kit that includes BUG-0027 (not run this release):
# its-magic --target <repo> --mode upgrade --host opencode|both
# Restart OpenCode and re-probe listed /intake /execute /qa /verify-work for persist
```

- **start_command**: `python -m pytest tests/bug0027_opencode_manual_phase_persist_test.py -v`
- **runtime_mode**: `local`
- **runtime_context_ref**: `docs/engineering/runtime-connectivity.md`; `docs/engineering/architecture.md` `# BUG-0027`; `docs/engineering/runbook.md` (OpenCode manual-phase persist)

## Connect

- **service_url**: n/a (OpenCode plugin/contract slice; no long-running HTTP service)
- **service_port**: n/a
- **health_endpoint**: n/a — verify via pytest contract markers + parity scope bug-0027

## Verify

1. Run `python -m pytest tests/bug0027_opencode_manual_phase_persist_test.py -v` → 10/10 PASS.
2. Run compose us0125..bug0019 with bug0027 → 66/66 PASS (plus bug0027 10/10).
3. Run parity `--scope bug-0027` → `[INTAKE_TEMPLATE_PARITY_OK]`.
4. Confirm colliding `.opencode/commands/auto.md` absent; keep `.opencode/agents/auto.md` + `.cursor/commands/auto.md`.
5. Confirm UAT honesty: `probe_kind=contract_tests_primary`; `live_opencode_cli_tui_pass_claimed=false`; `toast_repair_claimed=false`; no fake live-Chrome / live-CLI PASS.
6. Optional operator post-ship: restart OpenCode and invoke listed `/intake`, `/execute`, `/qa`, or `/verify-work` — expect persist of canonical artifacts + IsolationEvidence, or honest `OPENCODE_MANUAL_PHASE_*` fail-closed (not success-while-denied).

- **expected_health_signal**: pytest bug0027 10/10 markers passed; parity + metadata silent exit 0.

## Credentials

- No inline secrets. Kit denies `.env` reads (US-0085).
- npm publish credentials: env-reference-only (`NPM_TOKEN` / operator shell profile / CI secret store) — **not** used this turn (`PUBLISH_CONFIRMATION_REQUIRED`).
- No API tokens required for contract verification.

## Known Issues

- **NB1 LIVE_OPENCODE_MANUAL_PHASE_RESIDUAL**: CI cannot prove live `command.executed` / `persistManualPhaseIsolation` against a running OpenCode CLI/TUI host (R-0119). Residual `OPENCODE_MANUAL_PHASE_PERSIST_NOT_INVOKED` possible until operator re-probes after ship. **No live OpenCode CLI TUI PASS. No toast-repair claim.**
- **3f README_FEATURE_COVERAGE_GAP:BUG-0024**: sibling DONE story not listed in root README catalog (OPEN BUG-0027 excluded from 3f). Non-blocking for this sprint.
- Full harness Fail count OOS pre-existing (`harness_fail_zero_claimed=false`).
- BUG-0027 backlog status remains **OPEN** until `/closure`.
- BUG-0022 / BUG-0026 remain OPEN (untouched).
- npm publish deferred under `RELEASE_PUBLISH_MODE=confirm` (no kit semver bump this release).

## Evidence refs

- `sprints/S0160/release-findings.md`
- `sprints/S0160/qa-findings.md`
- `sprints/S0160/verify-work-findings.md`
- `sprints/S0160/verify-work-verdict.json`
- `sprints/S0160/uat.json`
- `sprints/S0160/uat.md`
- `handoffs/release_queue.md` (S0160 row)
- `handoffs/verify_to_release.md` (top section BUG-0027)
