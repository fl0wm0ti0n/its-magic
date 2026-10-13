# QA Findings — S0173 / US-0153

- **verdict**: **QA_PASS**
- **phase_id**: qa
- **role**: qa
- **story_id**: US-0153
- **sprint_id**: S0173
- **timestamp**: 2026-10-11T21:05:23Z
- **fresh_context_marker**: `qa-US0153-qa-20261011T210523Z-fresh`
- **CROSS_MODEL_REVIEW**: 0 (model_id omitted)
- **blocking findings**: none
- **status guard**: US-0153 remains **OPEN**. Backlog AC-1..AC-5 stay `[ ]`. Closure owns the DONE flip. This child did not write `handoffs/resume_brief.md` and did not edit `.cursor/scratchpad.md` or `docs/engineering/architecture.md`. US-0149 through US-0152 were not reopened. US-0154 was not started.

Consumed as provenance only: execute marker `dev-US0153-execute-20261011T205022Z-fresh`; execute-pair `record_key=auto-20261011-us0153-execute-pair|story|(none)|execute|rp-auto-20261011-us0153-execute-pair-curator-20261011T205243Z`; `proof_hash=0dc505d6af3b399132f7355a946133a2baf0ae6a2c51d07ec313c0d58b8219a8`. This context re-ran the five contract markers and the harness.

## Test plan

1. Read US-0153 AC-1..AC-5, S0173 tasks, and the top of `handoffs/dev_to_qa.md`.
2. Check that `SOVEREIGN_PARALLEL_DEV=1` keeps the worktree result and persists a selected or rejected pick; that a skipped hook does not continue as a pass; that an unconfigured target fails with `RELEASE_TARGET_UNCONFIGURED`; that `artifact_sha: "fake-sha"` cannot set `deploy_targets_pass`; that release and closure consume real evidence; and that guard and policy checks are audited before worktree, deploy, and repair.
3. Re-run the five `test_us0153_*` markers in `standalone/tests/contract/us0153.contract.test.ts`. Confirm the twelve `test_us0145_*` assertions stay in `us0145.contract.test.ts`. No paid credentials and no `.env`.
4. Re-run `powershell -NoProfile -ExecutionPolicy Bypass -File tests/run-tests.ps1` and record Pass/Fail plus the report timestamp.
5. Treat a live deploy to a real remote target as `UAT_PROBE_FORBIDDEN`. Cover behavior with the contract fixtures.
6. Leave US-0153 OPEN. Do not tick backlog acceptance boxes. Do not edit `.cursor/scratchpad.md` or `docs/engineering/architecture.md`. Do not write `handoffs/resume_brief.md`. Leave the eleven architecture linkage stubs untouched.

## Contract markers

Command: `node --experimental-strip-types --test --test-name-pattern "test_us0153_" tests/contract/us0153.contract.test.ts` (cwd `standalone`).

| Marker | Result |
|---|---|
| `test_us0153_arbitration_persists_selected_or_rejected` | PASS (42.3424 ms) |
| `test_us0153_configured_adapter_or_fail_closed` | PASS (8.1846 ms) |
| `test_us0153_smoke_verify_repair_closure_use_real_evidence` | PASS (14.7716 ms) |
| `test_us0153_limits_audited_before_worktree_deploy_repair` | PASS (5.6145 ms) |
| `test_us0153_fixture_success_and_failure_matrix` | PASS (13.3932 ms) |

**5 pass / 0 fail.** Duration 482.1815 ms. Exit code 0.

## AC checklist

| AC | Expectation | Evidence | Result |
|---|---|---|---|
| AC-1 | The workflow invokes candidate QA/arbitration after parallel DEV worktrees are created and persists the selected or rejected candidate evidence. | With `SOVEREIGN_PARALLEL_DEV=1`, a passing worktree writes `handoffs/parallel_dev_pick.json` with `outcome=winner_selected`. An empty candidate set writes `outcome=reject_all` and `PARALLEL_DEV_SELECTION_NO_PASS`. A skipped hook and a hook with `reason_code` both fail closed (`parallelHookFailsClosed`). The flag-off path passes without writing a pick file. | PASS |
| AC-2 | Release flow composes the existing release/deploy pipeline and configured target adapters; unconfigured targets fail closed rather than use synthetic success adapters. | A missing target returns `ok: false`, `RELEASE_TARGET_UNCONFIGURED`, and `deploy_targets_pass: false`. The gate then fails with `RELEASE_PREMATURE`. `getReleaseTargetAdapter` still dry-runs success. A stub `artifact_sha: "fake-sha"` makes `deployTargetsPass` false. A configured `npm` fixture target (`fixture://local`) sets `deploy_targets_pass` true with a sha other than `fake-sha`. `RELEASE_GATE_ORDER` is unchanged. | PASS |
| AC-3 | Deploy smoke, verify, rollback/repair caps, ownership, and closure prerequisites consume real run, UAT, and artifact evidence. | `workflow-engine.ts` no longer cites `sprints/S0151/summary.md` and calls `collectReleaseGateInput` and `readRunReleaseEvidence`. Verify cites a real artifact ref that contains the configured endpoint. Smoke calls `deploy_smoke_probe`. Repair calls `deploy_healing_retry`. Disabled healing is not a pass and does not smoke. Exhausted repair returns `DEPLOY_DEFERRED` or `DEPLOY_HEALING_DEFERRED`. Premature closure returns `RELEASE_PREMATURE` and `CLOSURE_RELEASE_EVIDENCE_MISSING`. `releaseCannotMarkDone().marked_done` is false. | PASS |
| AC-4 | Resource/concurrency limits and policy restrictions apply before worktree, deploy, or repair actions and are audited. | A traversal admit path refuses worktree create with `POLICY_TRAVERSAL_DENIED` before `parallel_dev_create_worktrees`. An empty admit path refuses deploy with `POLICY_DEFAULT_DENY` and `deploy_targets_pass: false`. A traversal repair path returns `POLICY_TRAVERSAL_DENIED` before `deploy_smoke_probe`. Audit lines with `audit=delivery_limit` exist for `worktree_create`, `deploy`, and `repair` in `handoffs/deploy_results/deploy_results.jsonl`. No `max_distributed_workers` key. | PASS |
| AC-5 | Tests prove a configured fixture target success and deterministic failures for unavailable target, rejected candidate, failed deploy verification, exhausted repair, and premature closure. | The matrix passes a configured fixture through `collectReleaseGateInput` with `deploy_targets_pass` true. Unavailable target is `RELEASE_TARGET_UNCONFIGURED`. Rejected candidate is `reject_all` / `PARALLEL_DEV_SELECTION_NO_PASS`. Stub verify does not pass `deployVerificationPass`. Exhausted repair is `DEPLOY_DEFERRED`. Premature evidence fails the gate with `RELEASE_PREMATURE` and closure with `CLOSURE_RELEASE_EVIDENCE_MISSING`. The same test asserts all twelve `test_us0145_*` names remain in `us0145.contract.test.ts`. | PASS |

## Harness

- Command: `powershell -NoProfile -ExecutionPolicy Bypass -File tests/run-tests.ps1`
- Exit code: **0**
- `tests/report.md` timestamp **2026-10-11T21:03:37Z**
- **Pass 880 / Fail 0**
- Architecture linkage row `check_intake_template_parity --scope=arch-linkage passes (US-0129)`: **PASS**. `US-0129 contract tests pass`: **PASS**. The eleven architecture linkage stubs at the bottom of `docs/engineering/architecture.md` were not edited.
- Triad rows `triad check passes on repo` and `triad check idempotent rerun passes`: **PASS** (this report is the pre-checkpoint repo)

## UAT

A live deploy to a real remote target is `UAT_PROBE_FORBIDDEN`. The contract fixtures cover configured success and the failure cases without a remote host, without paid credentials, and without reading `.env`. UAT result: **PASS** (`sprints/S0173/uat.md`, `sprints/S0173/uat.json`).

## Guards held

- US-0153 stays OPEN. AC boxes stay unchecked.
- US-0149, US-0150, US-0151, and US-0152 were not reopened. US-0154 was not started.
- No `.env` read, no commit, no push, no publish, no `/auto`, no subagent spawn.
- `.cursor/scratchpad.md` was not edited. `docs/engineering/architecture.md` was not edited. `handoffs/resume_brief.md` was not written.

## Next

Fresh `/verify-work` for US-0153 / S0173. This QA child does not spawn it.
