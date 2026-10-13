# QA Findings — S0174 / US-0154

- **verdict**: **QA_PASS**
- **phase_id**: qa
- **role**: qa
- **story_id**: US-0154
- **sprint_id**: S0174
- **timestamp**: 2026-10-12T18:14:02Z
- **fresh_context_marker**: `qa-US0154-qa-20261012T181402Z-fresh`
- **CROSS_MODEL_REVIEW**: 0 (model_id omitted)
- **blocking findings**: none
- **status guard**: US-0154 remains **OPEN**. Backlog AC-1..AC-6 stay `[ ]`. Closure owns the DONE flip. This child did not write `handoffs/resume_brief.md` and did not edit `.cursor/scratchpad.md` or `docs/engineering/architecture.md`. US-0149 through US-0153 were not reopened. US-0155 was not started.

Consumed as provenance only: execute marker `dev-US0154-execute-20261012T175908Z-fresh`; execute-pair `record_key=auto-20261012-us0154-execute-pair|story|(none)|execute|rp-auto-20261012-us0154-execute-pair-curator-20261012T180237Z`; `proof_hash=6969c91457f1efc879847e91a9d8d266d6145faf0660ab91e2964805c22b16a2`. This context re-ran the five contract markers and the harness.

## Test plan

1. Read US-0154 AC-1..AC-6, S0174 tasks, and the top of `handoffs/dev_to_qa.md`.
2. Check that standalone CI typecheck, lint, and tests sit beside the kit checks; that a spawned public `itsm` bin reaches production composition; that operator-path E2E covers session, policy, validator, resume, replay, and CLI/TUI parity; that fake browser and synthetic release evidence cannot pass production acceptance; that seam reports fail closed; and that the acceptance note classifies US-0133..US-0148 as library slices and US-0150..US-0154 as the production follow-up.
3. Re-run the five `test_us0154_*` markers in `standalone/tests/contract/us0154.contract.test.ts`. Confirm the US-0149 launcher assertions stay intact. No paid credentials and no `.env`.
4. Re-run `powershell -NoProfile -ExecutionPolicy Bypass -File tests/run-tests.ps1` and record Pass/Fail plus the report timestamp.
5. Treat a live external deploy or paid model call as `UAT_PROBE_FORBIDDEN`. Cover behavior with the contract fixtures.
6. Leave US-0154 OPEN. Do not tick backlog acceptance boxes. Do not edit `.cursor/scratchpad.md` or `docs/engineering/architecture.md`. Do not write `handoffs/resume_brief.md`. Leave the eleven architecture linkage stubs untouched.

## Contract markers

Command: `node --experimental-strip-types --test --test-name-pattern "test_us0154_" tests/contract/us0154.contract.test.ts` (cwd `standalone`).

| Marker | Result |
|---|---|
| `test_us0154_public_itsm_reaches_production_composition` | PASS (2765.394 ms) |
| `test_us0154_operator_e2e_session_policy_validator_resume_replay_parity` | PASS (7540.1534 ms) |
| `test_us0154_production_rejects_fake_browser_and_synthetic_release` | PASS (1417.4405 ms) |
| `test_us0154_report_separates_seams_and_fails_closed` | PASS (510.8413 ms) |
| `test_us0154_acceptance_records_library_slices_and_production_followup` | PASS (0.7511 ms) |

**5 pass / 0 fail.** Duration 12338.3508 ms. Exit code 0.

## AC checklist

| AC | Expectation | Evidence | Result |
|---|---|---|---|
| AC-1 | CI runs standalone workspace typecheck, lint, and tests in addition to root-kit checks, with pinned install/bootstrap prerequisites documented and reproducible. | `.github/workflows/ci.yml` job `standalone-test` is a matrix of `windows-latest` and `ubuntu-latest`, pins Node `22.19.0`, runs `npm ci` in `standalone/`, then `npm run typecheck && npm run lint && npm test`. Root job `checks` still runs kit `TEST_COMMAND`. `LINT_COMMAND` and `TYPECHECK_COMMAND` stay blank in `docs/engineering/runbook.md` and `template/docs/engineering/runbook.md`. `template/.github/workflows/ci.yml` has no `standalone-test` job. | PASS |
| AC-2 | A packaged or installed `itsm` fixture invokes the public entrypoint and proves it reaches the production composition rather than a test-created facade. | The marker spawns `standalone/apps/cli/src/index.ts` with `node --experimental-strip-types` and no `RuntimeHostFactories`. The passing child prints store path ending `.its-magic/runtime/ops.sqlite`, a non-empty `config`, and a non-empty `transport` and `disposition`. The empty-config child exits non-zero with `RUNTIME_CONFIG_UNAVAILABLE` and does not print `{ok:true}`. | PASS |
| AC-3 | Operator-path E2E coverage includes fresh Pi session admission, policy-enforced tool behavior, validator gate failure, persistent run/restart-resume, daemon attach/replay, and CLI/TUI parity. | One spawned run shows `session_fresh=true` and `disposition=success`, policy `allow=ALLOW` and `deny=true`, validator failure `KERNEL_VALIDATOR_MISSING` before success, resume `next_phase=execute` from `.its-magic/runtime/ops.sqlite`, daemon transport with a fresh session, and a TUI timeline whose event count equals the daemon `run_events` row for `itsm-operator`. | PASS |
| AC-4 | Browser and release fixtures prove that fake drivers, placeholder screenshots, synthetic target success, and no-op command responses cannot satisfy production acceptance. | `operatorPathWouldPass` rejects `FakeBrowserDriver`, `screenshot-placeholder`, `artifact_sha: "fake-sha"`, a bare `{ok:true}`, and `{scheduled:true}` without execution. The spawned `browser` command does not print those fakes and is not `disposition=success`. `FakeBrowserDriver` and the US-0145 `fake-sha` dry-run string remain in the unit sources. | PASS |
| AC-5 | Test reports distinguish unit seams from operator-path evidence and fail when a claimed production entrypoint uses a throwing kernel, empty configuration, ephemeral store, or discarded transport. | The report object has `unit_seam` and `operator_path`. The four failure fixtures fail the operator-path bucket. Spawned `itsm`, `itsm-daemon`, and `itsm-tui` sources pass that bucket. Unit-seam rows for `FakeBrowserDriver` and the US-0145 dry-run stub stay separate and pass. | PASS |
| AC-6 | Acceptance documentation records US-0133 through US-0148 as completed library/contract slices and US-0150 through US-0154 as their required production-integration follow-up, without marking phase-9 deferrals as missing v1 work. | `docs/product/acceptance.md` contains that classification and the phase-9 deferral sentence. US-0148, US-0150, and US-0153 rows stay `[x]`. The US-0154 row stays `[ ]`. | PASS |

## Harness

- Command: `powershell -NoProfile -ExecutionPolicy Bypass -File tests/run-tests.ps1`
- Exit code: **0**
- `tests/report.md` timestamp **2026-10-12T18:13:21Z**
- **Pass 880 / Fail 0**
- `US-0149 global itsm launcher contract tests pass`: **PASS**. Launcher assertions in `tests/us0149_global_itsm_launcher_test.py` were not changed.
- Architecture linkage row `check_intake_template_parity --scope=arch-linkage passes (US-0129)`: **PASS**. `US-0129 contract tests pass`: **PASS**. The eleven architecture linkage stubs in `docs/engineering/architecture.md` were not edited.
- Triad rows `triad check passes on repo` and `triad check idempotent rerun passes`: **PASS** (this report is the pre-checkpoint repo)

## UAT

A live external deploy or paid model call is `UAT_PROBE_FORBIDDEN`. The contract fixtures cover production composition, operator-path E2E, fake-evidence rejection, fail-closed seam reports, and the acceptance classification. No paid credentials and no `.env`. UAT result: **PASS** (`sprints/S0174/uat.md`, `sprints/S0174/uat.json`).

## Guards held

- US-0154 stays OPEN. AC boxes stay unchecked.
- US-0149, US-0150, US-0151, US-0152, and US-0153 were not reopened. US-0155 was not started.
- No `.env` read, no commit, no push, no publish, no `/auto`, no subagent spawn.
- `.cursor/scratchpad.md` was not edited. `docs/engineering/architecture.md` was not edited. `handoffs/resume_brief.md` was not written.

## Next

Fresh `/verify-work` for US-0154 / S0174. This QA child does not spawn it.
