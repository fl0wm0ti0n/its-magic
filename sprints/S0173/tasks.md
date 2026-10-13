# Sprint S0173 — Task checklist (US-0153)

Six planned tasks: **T-anch + T-001..T-005**, within `SPRINT_MAX_TASKS=12`.
Execute only in this order. Every box stays open until a fresh `/execute` dev context finishes it.

## Checklist

- [x] **T-anch — locked baseline (all AC):** Read R-0163 and `# US-0153`. Confirm US-0153 is OPEN, AC-1..AC-5 are unchecked, and S0172 is historical. Confirm US-0145, US-0149, US-0150, US-0151, and US-0152 stay DONE. Confirm `runExecuteQaLoop` discards `afterExecutePass` with `void parallelHook` and never calls `runQaArbiter`, `stubAdapter` returns `artifact_sha: "fake-sha"`, `verify` returns success with no target evidence, and the release phase passes hardcoded `tests_pass: true` plus `artifact_refs: ["sprints/S0151/summary.md"]`. Do not mutate product code in this task.
  **Done-when:** the notes match those gaps and the story is still OPEN.

- [x] **T-001 — arbitrate after worktrees (AC-1):** In `runExecuteQaLoop`, when `SOVEREIGN_PARALLEL_DEV=1`, keep the `afterExecutePass` result. A skipped hook or a `reason_code` fails closed. Call `runQaArbiter` with the worktree candidates and write `handoffs/parallel_dev_pick.json` for `winner_selected` and `reject_all`. `reject_all` uses existing `PARALLEL_DEV_SELECTION_NO_PASS`. When the flag is off, keep the US-0145 `noopSnapshot` path. Mirror the template twin of `workflow-engine.ts` and `parallel-dev.ts`.
  **Done-when:** an enabled parallel run persists the selected or rejected pick, and a discarded hook does not continue as a pass.

- [x] **T-002 — configured adapters (AC-2):** Release apply and verify take configured targets (`kind`, `target_id`, `endpoint`) from resolved config. A missing target returns `ok: false` and `RELEASE_TARGET_UNCONFIGURED`, and the gate sets `deploy_targets_pass: false`. `artifact_sha: "fake-sha"` cannot set `deploy_targets_pass` true. Leave `getReleaseTargetAdapter` dry-run success in place for `test_us0145_release_target_matrix_dry_run`. Do not change `RELEASE_GATE_ORDER`. Do not read `.env`. Mirror template twins.
  **Done-when:** an unconfigured target fails closed, and a stub sha is not a release pass.

- [x] **T-003 — real smoke, verify, repair, and closure (AC-3):** Replace the hardcoded release-gate booleans and `sprints/S0151/summary.md` artifact ref with the current run, UAT evidence, and artifact refs. `verify` cites a real artifact ref. Smoke uses existing `deploy_smoke_probe`. Repair uses existing `deploy_healing_retry`. Disabled healing is not a deploy pass. Exhausted repair stays `DEPLOY_DEFERRED` or `DEPLOY_HEALING_DEFERRED`. Premature closure stays `RELEASE_PREMATURE` and `CLOSURE_RELEASE_EVIDENCE_MISSING`. `releaseCannotMarkDone` stays. Mirror template twins.
  **Done-when:** release and closure consume those evidence refs, and a missing or premature envelope fails closed.

- [x] **T-004 — limits before action (AC-4):** Call `DeliveryResourceGuard.check` and the existing path policy before worktree create, deploy, and repair. A denied path uses `POLICY_TRAVERSAL_DENIED` or `POLICY_DEFAULT_DENY`. Append one audit line per check to `handoffs/deploy_results/deploy_results.jsonl`. Do not add a cap key. Do not add distributed workers or remote Debian execution. Mirror template twins.
  **Done-when:** each of those three actions is refused when the guard or policy fails, and the audit line exists.

- [x] **T-005 — fixture tests (AC-5):** Add `standalone/tests/contract/us0153.contract.test.ts` with `test_us0153_arbitration_persists_selected_or_rejected`, `test_us0153_configured_adapter_or_fail_closed`, `test_us0153_smoke_verify_repair_closure_use_real_evidence`, `test_us0153_limits_audited_before_worktree_deploy_repair`, and `test_us0153_fixture_success_and_failure_matrix`. Cover configured fixture success plus unavailable target, rejected candidate, failed deploy verification, exhausted repair, and premature closure. Do not weaken the twelve `test_us0145_*` assertions. No paid model, no network claim, no `.env`.
  **Done-when:** all five markers pass under the standalone contract runner.

## Execute boundary

US-0153 stays OPEN. AC boxes stay unchecked. Closure owns the DONE flip.
