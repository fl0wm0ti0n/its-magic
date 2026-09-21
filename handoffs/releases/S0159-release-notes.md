# Release Notes — S0159 / BUG-0024

- **Sprint**: `S0159`
- **Bug**: `BUG-0024` — OpenCode CLI TUI listed `/auto` still toasts `OPENCODE_AUTO_TUI_DISPATCH_UNSUPPORTED` after BUG-0023 Axis A (live-dispatch residual; A1 Hybrid)
- **Story**: (none)
- **Release date**: `2026-09-21T20:12:00Z` (UTC)
- **orchestrator_run_id**: `auto-20260921-bug0024`
- **parent_run**: `cursor-20260913-BUG0024-intake`
- **delivery_mode**: `ultra_lean`
- **macro_phase**: `ship` (release → `/closure` per CROSS_MODEL_REVIEW=0 native chain)
- **policy_mode**: `confirm` (`RELEASE_PUBLISH_MODE=confirm`; operator confirm absent this turn → npm publish deferred)
- **trigger_source**: `auto`
- **branch**: `local` (no push; `SYNC_POLICY_MODE=disabled`)
- **fresh_context_marker**: `release-BUG0024-20260921T201200Z-fresh`
- **model_id**: `inherit` (CROSS_MODEL_REVIEW=0)
- **runtime_proof_id**: `rp-auto-20260921-bug0024-release-release-20260921T201200Z-BUG-0024`
- **proof_hash**: `8789E1E0776761CC0A4EF1B33CCB472707946DC4CCCA3E9D231D0CC4A8BE9A6C`
- **proof_ttl**: `2026-09-21T21:12:00Z` (UTC)
- **release_version**: (none — workflow-only release; no kit semver bump; kit remains `0.1.6`)
- **npm_published**: `false`

## Verdict

**RELEASE_PASS.** Mandatory release gates (1, 2, 3, 4, 4b) green with **scoped pytest bug0024 8/8** + compose bug0023..0018 **37/37** (45 total) + US-0071 metadata exit 0 + parity `--scope bug-0024` OK. Queue row S0159 → `released`. Publish deferred (`PUBLISH_CONFIRMATION_REQUIRED`; `npm_published=false`) — not a release FAIL. No backlog mutation (closure owns OPEN→DONE). No npm / GitHub publish this turn. No git push.

Gate-1: live scoped contract @ release + US-0071 metadata exit 0. **`harness_fail_zero_claimed=false`**.

## Summary

BUG-0024 ships A1 Hybrid residual live-dispatch (R-0140 / architecture `# BUG-0024`):

- Peer-branded `@opencode/plugin/rpc` required for TUI success (`ITS_MAGIC_AUTO_RPC_PEER_BRANDED`); local identity-define remains load-safe only.
- Stage-distinct `OPENCODE_*` limbs: `MISSING_CLIENT` / `RPC_ABSENT` / `DEFINED_UNBRANDED` / `REGISTER_SKIPPED` / `MAKE_UNREACHABLE`; `OPENCODE_AUTO_TUI_DISPATCH_UNSUPPORTED` umbrella-only when limbs exhausted.
- Orchestrator `emitAutoTuiRegisterSkipped` honesty; keep `{ id, tui }` + `editor.add`; never restore `auto.md`; never silent `localhost:4096`.
- Eight locked `test_bug0024_*` markers; upgrade overwrite + prune; active↔template parity + `BUG0024_PAIRS`; runbook live-dispatch residual recipe.

FRAMEWORK_KIT_REPO=1 — UAT `contract_tests_primary`; 6 live-runtime classes `UAT_PROBE_FORBIDDEN` including live OpenCode CLI TUI `cli_smoke`. **No live OpenCode CLI TUI PASS. No fake live-Chrome PASS.**

## What's new

- BUG-0024: Hybrid residual live-dispatch for OpenCode CLI TUI listed `/auto` — peer-branded Defined gate, stage-distinct `OPENCODE_*`, DISPATCH umbrella-only, eight `test_bug0024_*`, upgrade overwrite + prune, active↔template parity.

## ACs satisfied (QA + verify-work, UAT 9/9)

**8/8 PASS** (slice; backlog ACs remain unchecked until `/closure`):

| AC | Status |
|----|--------|
| AC-1 | PASS (slice) — listed CLI TUI `/auto` starts lifecycle or honest stage `OPENCODE_*` |
| AC-2 | PASS (slice) — DISPATCH not happy path |
| AC-3 | PASS — must not restore STOP-only `auto.md` |
| AC-4 | PASS — must not JSON-template `/auto` |
| AC-5 | PASS — plugin `editor.add` retained |
| AC-6 | PASS — additive `test_bug0024_*`; live OpenCode `UAT_PROBE_FORBIDDEN` |
| AC-7 | PASS — upgrade overwrite + prune |
| AC-8 | PASS — active↔template parity |

## Test results (release — live this pass)

- **Scoped contract**: `python -m pytest tests/bug0024_opencode_cli_tui_live_dispatch_residual_test.py -v` → **8 passed** fail 0 duration **0.51s**.
- **Compose**: bug0024+0023+0021+0020+0019+0018 → **45 passed** in **1.21s** (8+8+8+8+7+6).
- **Parity**: `python scripts/check_intake_template_parity.py --repo . --scope bug-0024` → `[INTAKE_TEMPLATE_PARITY_OK]`.
- **Metadata guard**: `python scripts/check-user-visible-metadata.py --repo .` → exit 0.
- **Canonical harness**: **not re-run**; `harness_fail_zero_claimed=false`.

## Gate summary

| Gate | Result |
|------|--------|
| check_in_tests | **PASS** (scoped pytest bug0024 8/8 + compose 45/45 + US-0071 metadata + parity; harness_fail_zero_claimed=false) |
| qa | PASS (`sprints/S0159/qa-findings.md`; 0 blockers; NB1 informational) |
| verify_work | PASS (`sprints/S0159/uat.json` 8/8 ACs; 9/9 UAT; verify-work pytest 8/8) |
| uat | PASS (9/9; `contract_tests_primary`; live OpenCode CLI TUI `UAT_PROBE_FORBIDDEN`) |
| isolation_evidence | PASS (execute+qa+verify-work+release; distinct fresh_context_marker; CROSS_MODEL_REVIEW=0) |
| strict_runtime_proof | **PASS** (verify-work `rp-auto-20260921-bug0024-verify-work-qa-20260921T200700Z-BUG-0024` / `A38D5C2058233468E31687E0CE5352855D8D709904D764A33D9AFBF3E9178125` consumed @20:12:00Z before TTL 21:07:00Z; qa+execute MATCH) |
| readme_feature_coverage_3f | PASS (`README_FEATURE_COVERAGE_ENFORCE=1`; gaps=[]) |
| project_readme_3g | skipped (`FRAMEWORK_KIT_REPO=1`; kit_repo_skipped=true) |
| publish | deferred (`RELEASE_PUBLISH_MODE=confirm`; `PUBLISH_CONFIRMATION_REQUIRED`; npm_published=false) |
| sync | not_eligible (`SYNC_POLICY_MODE=disabled`) |
| version-doc (17) | skipped_no_release_version (workflow-only; `[Unreleased]` path) |
| finalization | **PASS** (queue S0159 = `released`; no kit semver bump) |

## Run

```powershell
python -m pytest tests/bug0024_opencode_cli_tui_live_dispatch_residual_test.py -v
# Expected: 8 passed

python scripts/check_intake_template_parity.py --repo . --scope bug-0024
# Expected: [INTAKE_TEMPLATE_PARITY_OK]

python scripts/check-user-visible-metadata.py --repo .
# Expected: exit 0

# After operator confirms publish of a kit that includes BUG-0024 (not run this release):
# its-magic --target <repo> --mode upgrade --host opencode|both
# Restart OpenCode CLI TUI (opencode, not --pure) and re-probe listed /auto
```

- **start_command**: `python -m pytest tests/bug0024_opencode_cli_tui_live_dispatch_residual_test.py -v`
- **runtime_mode**: `local`
- **runtime_context_ref**: `docs/engineering/runtime-connectivity.md`; `docs/engineering/architecture.md` `# BUG-0024`; `docs/engineering/runbook.md` (OpenCode CLI TUI `/auto` live-dispatch residual)

## Connect

- **service_url**: n/a (OpenCode CLI TUI plugin/contract slice; no long-running HTTP service)
- **service_port**: n/a
- **health_endpoint**: n/a — verify via pytest contract markers + parity scope bug-0024

## Verify

1. Run `python -m pytest tests/bug0024_opencode_cli_tui_live_dispatch_residual_test.py -v` → 8/8 PASS.
2. Run compose bug0023..0018 with bug0024 → 45/45 PASS.
3. Run parity `--scope bug-0024` → `[INTAKE_TEMPLATE_PARITY_OK]`.
4. Confirm colliding `.opencode/commands/auto.md` absent; keep `.opencode/agents/auto.md` + `.cursor/commands/auto.md`.
5. Confirm UAT honesty: `probe_kind=contract_tests_primary`; `live_opencode_cli_tui_pass_claimed=false`; no fake live-Chrome / live-CLI PASS.
6. Optional operator post-ship: restart OpenCode CLI TUI and invoke listed `/auto` — expect lifecycle start or honest stage `OPENCODE_*` (not DISPATCH happy path).

- **expected_health_signal**: pytest bug0024 8/8 markers passed; parity + metadata silent exit 0.

## Credentials

- No inline secrets. Kit denies `.env` reads (US-0085).
- npm publish credentials: env-reference-only (`NPM_TOKEN` / operator shell profile / CI secret store) — **not** used this turn (`PUBLISH_CONFIRMATION_REQUIRED`).
- No API tokens required for contract verification.

## Known Issues

- **NB1 LIVE_OPENCODE_CLI_TUI_RESIDUAL**: CI cannot prove live peer-branded `client.rpc(Defined)` against OpenCode CLI TUI. Residual DISPATCH / stage toasts possible until operator re-probes after ship. **No live OpenCode CLI TUI PASS.**
- Full harness Fail count OOS pre-existing (`harness_fail_zero_claimed=false`).
- BUG-0024 backlog status remains **OPEN** until `/closure`.
- BUG-0022 / BUG-0027 remain OPEN (untouched).
- npm publish deferred under `RELEASE_PUBLISH_MODE=confirm` (no kit semver bump this release).

## Evidence refs

- `sprints/S0159/release-findings.md`
- `sprints/S0159/qa-findings.md`
- `sprints/S0159/verify-work-findings.md`
- `sprints/S0159/verify-work-verdict.json`
- `sprints/S0159/uat.json`
- `sprints/S0159/uat.md`
- `handoffs/release_queue.md` (S0159 row)
- `handoffs/verify-work-to-release.md` (top section BUG-0024)
