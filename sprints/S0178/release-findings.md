# Sprint S0178 — BUG-0029 / release findings

## Verdict

**RELEASE_FAIL**. Finalization did not run. `handoffs/release_queue.md` was not modified (queue writes are limited to RELEASE_PASS; S0178 has no row). BUG-0029 stays **OPEN**. AC-1..AC-5 stay unchecked. Closure was not spawned and is not scheduled.

- **Phase / role:** `release` / `release` (fresh)
- **Evaluated:** `2026-10-16T00:26:12Z` (UTC)
- **orchestrator_run_id:** `auto-20261016-bug0029`
- **Fresh marker:** `release-BUG0029-release-20261016T002612Z-fresh` (grep-verified 0 prior occurrences at mint)
- **model_id:** `inherit`
- **model_provenance:** `provenance=host=cursor;path=.cursor/scratchpad.local.md;step=MODEL_TIER_<PHASE>`
- **delivery_mode:** `ultra_lean`; **policy_mode:** `confirm`; **trigger_source:** `auto`; **branch:** `local`
- **decision_gate:** false
- **fail_closed_reason_codes:** `RELEASE_TEST_FAILED`; `README_FEATURE_COVERAGE_BLOCKED`; `README_FEATURE_COVERAGE_GAP:BUG-0028`
- **npm_published:** false
- **git_pushed:** false

### Release proof tuple (own, fresh)

- runtime_proof_id=`rp-auto-20261016-bug0029-release-release-20261016T002612Z-BUG-0029`
- proof_hash=`80e689ec75612e0634b1ca749bb06813bab409cc2d2bd8dcb431287c5d85365d`
- proof_issued_at=`2026-10-16T00:26:12Z`; proof_ttl_seconds=`3600` (TTL expiry `2026-10-16T01:26:12Z`)
- canonical payload (sorted keys as hashed):
  `{"orchestrator_run_id":"auto-20261016-bug0029","phase_id":"release","proof_issued_at":"2026-10-16T00:26:12Z","proof_ttl_seconds":3600,"role":"release","runtime_proof_id":"rp-auto-20261016-bug0029-release-release-20261016T002612Z-BUG-0029"}`
- `scripts.token_cost_lib.compute_strict_proof_hash` and independent `hashlib.sha256` returned the same hex digest. Second invocation MATCH. 0 prior occurrences of this `runtime_proof_id` at mint.

## Consumed verify-work pair

Recomputed MATCH and inside TTL at this write (issued `2026-10-16T00:05:15Z`, TTL until `2026-10-16T01:05:15Z`; clock at validation `2026-10-16T00:13:12Z`; still inside TTL at `2026-10-16T00:26:12Z`).

- record_key `auto-20261016-bug0029|bug|BUG-0029|verify-work|rp-auto-20261016-bug0029-verify-work-qa-20261016T000515Z-BUG-0029`
- proof_hash `9496d7411f84a933c31af8235ceec2e99fb7fc5c8fa9c1c8818f8234f9088e31`
- marker `qa-BUG0029-vw-20261016T000515Z-fresh`
- Not `RESUME_BRIEF_STALE`.

Execute `40fff8bc1786f7caba40f909fd2ffc21b38c8a83f9cf94c0ddc380863cb48abe` (TTL until `2026-10-16T00:37:22Z`) and QA `4da3c779d1a9ff50cf54df3cd589f99c7ca885b859b835a845eb9a008f51bc88` (TTL until `2026-10-16T00:55:00Z`) also recomputed MATCH and were inside TTL at this write.

## Mandatory release gate chain

| Gate | Result | Evidence |
|---|---|---|
| 1. Check-in tests | **FAIL** | This release ran `powershell -NoProfile -ExecutionPolicy Bypass -File tests/run-tests.ps1` (runbook `TEST_COMMAND`), exit 1, elapsed_ms 519628. Fresh `tests/report.md` is `2026-10-16T00:22:38Z`, **Pass 872 / Fail 8**. The prior `2026-10-15T09:24:56Z` report was not reused. US-0071 metadata guard L713–L722 all `[PASS]`. Triad L723–L726 `[PASS]`. Reason `RELEASE_TEST_FAILED`. `lint:skipped`, `typecheck:skipped` (commands blank). |
| 2. QA completion | **PASS** (not sufficient) | `sprints/S0178/qa-findings.md`: **QA_PASS**, blocking findings none. Generated-test fields present (`generated_test_result=pass`, `generated_test_reason_code=ok`). |
| 3. UAT completion | **PASS** (not sufficient) | `sprints/S0178/uat.json`: `status=VERIFY_PASS`, `uat_lifecycle=populated`, `placeholder_only=false`, passed 6 / failed 0 / total 6. `sprints/S0178/uat.md` matches. |
| 3f. README feature coverage | **FAIL** | `python scripts/validate_readme_feature_coverage.py --repo . --enforce` exit 1. `README_FEATURE_COVERAGE_BLOCKED`. `README_FEATURE_COVERAGE_GAP:BUG-0028`. `coverage_missing=["BUG-0028"]`, `coverage_total=52`, `root_h2=Features`, `dev_h2=Architecture notes`. BUG-0028 is DONE and `user_visible: true`. This phase did not add that coverage and did not edit the BUG-0028 backlog row. |
| 4. Isolation | **PASS** (not sufficient) | Distinct fresh checkpoints: execute `dev-BUG0029-execute-20261015T233722Z-fresh` (role=dev), qa `qa-BUG0029-qa-20261015T235500Z-fresh` (role=qa), verify-work `qa-BUG0029-vw-20261016T000515Z-fresh` (role=qa). This release adds `release-BUG0029-release-20261016T002612Z-fresh` (role=release, model_id=inherit). |
| 4b. Strict runtime proof | **PASS** (not sufficient) | Verify-work, QA, and execute hashes recomputed MATCH and were inside TTL at this write. Own release proof 2-invocation MATCH. |
| 5. Finalization | **NOT RUN** | Gates 1 and 3f failed. No `unreleased -> released` transition. No `handoffs/releases/S0178-release-notes.md`. No queue row. No changelog bullet. Legacy `handoffs/release_notes.md` pointer left unchanged. |

## Harness fail rows (`tests/report.md` at `2026-10-16T00:22:38Z`)

| Row | Name |
|---|---|
| L785 | slim auto command contract markers pass |
| L815 | validate_readme_feature_coverage repo --report passes |
| L816 | validate_readme_feature_coverage report idempotent |
| L843 | check_intake_template_parity --scope=dev-environment passes |
| L846 | check_intake_template_parity --scope=dev-environment passes (US-0099) |
| L850 | check_intake_template_parity --scope=model-tier passes (US-0101) |
| L853 | check_intake_template_parity --scope=model-tier-overrides passes (US-0102) |
| L855 | check_intake_template_parity --scope=arch-linkage passes (US-0129) |

These eight rows are outside the S0178 contract markers. This run's stdout showed `test_template_scratchpad_baseline_literal_parity_active` failing on active `AUTO_BACKLOG_DRAIN=0` versus template `AUTO_BACKLOG_DRAIN=1`, and `INTAKE_TEMPLATE_PARITY_ERROR` for `.cursor/scratchpad.md` (36334b) versus `template/.cursor/scratchpad.md` (36325b). This phase did not edit either scratchpad. The two README report rows match `README_FEATURE_COVERAGE_GAP:BUG-0028`.

## Sprint markers re-run this release

Command: `node --experimental-strip-types --test --test-name-pattern "test_bug0029_" tests/contract/bug0029.contract.test.ts` (cwd `standalone`).

Windows Node v24.19.0, **7 passed / 0 failed**, duration_ms 176.2635, exit 0. Linux was not re-run in this release. These markers do not clear gate 1. The harness Fail count is 8.

## Optional gates (3a–3g)

| Gate | Result | Evidence |
|---|---|---|
| 3a. Cross-repo observability | **skipped** | `CROSS_REPO_OBSERVABILITY=0` |
| 3b. Component scope | **skipped** | `COMPONENT_SCOPE_MODE=0` |
| 3c. Spec pack | **skipped** | `SPEC_PACK_MODE=0` |
| 3d. User guide | **skipped** | `USER_GUIDE_MODE=0` |
| 3e. Legacy drift | **no repair** | BUG-0029 is OPEN, so it is outside the DONE-drift rule. This phase did not edit `docs/product/backlog.md` or `docs/product/acceptance.md`. |
| 3f. README feature coverage | **FAIL** | See gate table. Sub-code `README_FEATURE_COVERAGE_GAP:BUG-0028`. |
| 3g. Project README | **PASS (kit skip)** | `python scripts/validate_project_readme_coverage.py --repo . --enforce` exit 0, `kit_repo_skipped=true`, `status=PASS`, `gaps=[]`. Does not clear gate 3f. |

## Version-doc / changelog (step 17)

Not run. Step 17 follows a successful `unreleased -> released` transition. `release_version` stays blank. `CHANGELOG.md` was not edited. `template/CHANGELOG.md` was not edited.

## Status, publish, and push

- BUG-0029 remains **OPEN**. Backlog AC-1..AC-5 stay `[ ]`. This release did not flip them. BUG-0026 and BUG-0028 were not edited. US-0150, US-0151, US-0154, US-0155, and US-0156 were not reopened.
- **Publish: NOT PERFORMED.** `RELEASE_PUBLISH_MODE=confirm`. Operator confirmation was absent. `npm_published=false`. No registry write. npm target `npm-public` in `docs/engineering/release-targets.json` is `enabled=false`. Publish execution was not reached because gates 1 and 3f failed first.
- **Push: NOT PERFORMED.** `python scripts/sync_push_gates.py policy --root . --branch local` returned `{"ok": false, "reason_code": "SYNC_DISABLED"}` exit 2. `push_decision=not_eligible`. No git commit. No git push. `git_pushed=false`.
- Sync evidence: `phase_boundary=release`; `policy_mode=confirm` for publish and `SYNC_POLICY_MODE=disabled` for push; `checks=test:fail`; `push_decision=not_eligible`; `reason_code=SYNC_DISABLED`; `evidence_refs=tests/report.md`, `sprints/S0178/release-findings.md`.
- Runbook: `DEPLOY_STAGING_COMMAND` and `DEPLOY_PROD_COMMAND` are already explicit echo lines. This blocked release did not add a runbook subsection.
- `docs/engineering/runtime-connectivity.md` was not rewritten.
- No `.env` read. No subagent spawn. No `/auto`. No `/closure`. `.cursor/scratchpad.md` not edited.
- Triad: hot `docs/engineering/state.md` is 1171 lines after appending this checkpoint. One oldest non-protected checkpoint (US-0154 refresh) archived to `docs/engineering/state-archive/state-pack-20261016-a.md`. `--rollover` was not run. Protected BUG-0033 refresh remains. `architecture.md` was not rolled.

## Remediation

1. Make `tests/run-tests.ps1` exit 0 and refresh `tests/report.md` to Fail 0, including the eight rows above. The scratchpad literal drift and the BUG-0028 README gap are outside S0178.
2. Add **BUG-0028** coverage under `## Features` in the root feature README and under `## Architecture notes` in `docs/developer/README.md` (affinity `docs/engineering/context/readme-section-affinity.json`), then re-run `python scripts/validate_readme_feature_coverage.py --repo . --enforce` until exit 0. This phase did not do that edit and did not edit the BUG-0028 backlog row.
3. Rerun `/release` for S0178 / BUG-0029. Do not tick AC-1..AC-5 and do not flip BUG-0029 to DONE in `/release`. Closure owns that flip after a later RELEASE_PASS.

## Next

`next_scheduled_phase=none`. `next_scheduled_role=none`. `native_chain_continuing=false`. `stop_reason=release_blocked_RELEASE_TEST_FAILED`. Fail codes: `RELEASE_TEST_FAILED`, `README_FEATURE_COVERAGE_BLOCKED`, `README_FEATURE_COVERAGE_GAP:BUG-0028`. `qe` is not a spawnable subagent; the DEC-0052 sanctioned closure alternate is `curator`, and that spawn waits on a future RELEASE_PASS. `stop_matrix_action=STOP_RELEASE_BLOCKED; do_not_spawn_closure`. This child does not spawn closure.

## Remediation pass — implementation_loop_index 1 — **RELEASE_PASS**

**RELEASE_PASS**. Mandatory gates 1, 2, 3, 4, and 4b are green on a fresh re-run. The `2026-10-16T00:26:12Z` RELEASE_FAIL above stays as history. Its proof id was not reused. Optional 3e is not a drift repair. 3f PASS (`coverage_missing=[]`, `coverage_total=52`). 3g PASS with `kit_repo_skipped=true`. 3a–3d skipped. Gate 5 finalization writes the queue row, notes, changelog `[Unreleased]` bullet, the runbook subsection, and the state checkpoint. BUG-0029 stays **OPEN**. Closure owns the DONE flip.

- **Phase / role:** `release` / `release` (fresh)
- **Evaluated:** `2026-10-16T14:54:00Z` (UTC)
- **orchestrator_run_id:** `auto-20261016-bug0029`
- **implementation_loop_index:** 1
- **Fresh marker:** `release-BUG0029-release-fix1-20261016T145400Z-fresh` (grep-verified 0 prior occurrences at mint)
- **model_id:** `inherit`
- **model_provenance:** `provenance=host=cursor;path=.cursor/scratchpad.local.md;step=MODEL_TIER_<PHASE>`
- **delivery_mode:** `ultra_lean`; **policy_mode:** `confirm` for publish, `disabled` for sync; **trigger_source:** `auto`; **branch:** `local`
- **decision_gate:** false
- **fail_closed_reason_codes:** none
- **npm_published:** false
- **git_pushed:** false

### Release proof tuple (own, fresh)

- runtime_proof_id=`rp-auto-20261016-bug0029-release-release-20261016T145400Z-BUG-0029-fix1`
- proof_hash=`40328d3ec669b480e982a18759cf1198c8acefc5e7308fba87d581e86db2f270`
- proof_issued_at=`2026-10-16T14:54:00Z`; proof_ttl_seconds=`3600` (TTL expiry `2026-10-16T15:54:00Z`)
- canonical payload (sorted keys as hashed):
  `{"orchestrator_run_id":"auto-20261016-bug0029","phase_id":"release","proof_issued_at":"2026-10-16T14:54:00Z","proof_ttl_seconds":3600,"role":"release","runtime_proof_id":"rp-auto-20261016-bug0029-release-release-20261016T145400Z-BUG-0029-fix1"}`
- `scripts.token_cost_lib.compute_strict_proof_hash` second invocation MATCH. 0 prior occurrences of this `runtime_proof_id` at mint.

### Consumed verify-work pair

Recomputed MATCH and inside TTL at this write (issued `2026-10-16T14:37:00Z`, TTL until `2026-10-16T15:37:00Z`; clock at validation `2026-10-16T14:54:00Z`).

- record_key `auto-20261016-bug0029|bug|BUG-0029|verify-work|rp-auto-20261016-bug0029-verify-work-qa-20261016T143700Z-BUG-0029-fix1`
- proof_hash `5a9dec6de9a82b7daaed0d286e5e7c0004f8ea6d9a9e4c6094a779687c86c449`
- marker `qa-BUG0029-vw-fix1-20261016T143700Z-fresh`
- Not `RESUME_BRIEF_STALE`.

Execute `a44e8f8aea09d4075f6555a1ccc381bb6de2ab0edb0514b124322f391ecb5cd3` (TTL until `2026-10-16T15:17:02Z`) and QA `21eddcac75b994e383ca73d7449c0c4ed4eba1211b605b1c762c160a9e087952` (TTL until `2026-10-16T15:26:04Z`) also recomputed MATCH and were inside TTL at this write.

### Mandatory release gate chain

| Gate | Result | Evidence |
|---|---|---|
| 1. Check-in tests | **PASS** | This release ran `powershell -NoProfile -ExecutionPolicy Bypass -File tests/run-tests.ps1` (runbook `TEST_COMMAND`), exit 0, elapsed_ms 620631. Fresh `tests/report.md` is `2026-10-16T14:52:23Z`, **Pass 880 / Fail 0** (880 `[PASS]`, 0 `[FAIL]`). The `2026-10-16T00:22:38Z` fail report and the `2026-10-16T14:15:41Z` remediation report were not reused as this gate. US-0071 metadata guard L713–L722 all `[PASS]` (positive, leak detection, idempotence). Triad L723–L726 `[PASS]`. `lint:skipped`, `typecheck:skipped` (commands blank). |
| 2. QA completion | **PASS** | `sprints/S0178/qa-findings.md`: **QA_PASS**, blocking findings 0. Generated-test fields present (`generated_test_result=pass`, `generated_test_reason_code=ok`). |
| 3. UAT completion | **PASS** | `sprints/S0178/uat.json`: `status=VERIFY_PASS`, `uat_lifecycle=populated`, `placeholder_only=false`, passed 6 / failed 0 / total 6. `sprints/S0178/uat.md` matches. |
| 3f. README feature coverage | **PASS** | `python scripts/validate_readme_feature_coverage.py --repo . --enforce` exit 0. `coverage_missing=[]`, `coverage_total=52`, `status=PASS`. `[README_FEATURE_COVERAGE_VALIDATE_OK]`. |
| 4. Isolation | **PASS** | Distinct fresh checkpoints on the hot surface: execute `dev-BUG0029-execute-fix1-20261016T141702Z-fresh` (role=dev), qa `qa-BUG0029-qa-fix1-20261016T142604Z-fresh` (role=qa), verify-work `qa-BUG0029-vw-fix1-20261016T143700Z-fresh` (role=qa). This release adds `release-BUG0029-release-fix1-20261016T145400Z-fresh` (role=release, model_id=inherit). |
| 4b. Strict runtime proof | **PASS** | Verify-work, QA, and execute hashes recomputed MATCH and were inside TTL at `2026-10-16T14:54:00Z`. Own release proof second invocation MATCH. Proof id is new. |
| 5. Finalization | **PASS** | Queue row S0178 created as `released` (no prior row; single finalization write). `handoffs/releases/S0178-release-notes.md` written. Legacy pointer updated. Changelog `[Unreleased]` Fixed bullet added. |

### Sprint markers re-run this release

Command: `node --experimental-strip-types --test --test-name-pattern "test_bug0029_" tests/contract/bug0029.contract.test.ts` (cwd `standalone`).

Windows Node, **7 passed / 0 failed**, duration_ms 156.2917, exit 0. Linux was not re-run in this release.

### Optional gates (3a–3g)

| Gate | Result | Evidence |
|---|---|---|
| 3a. Cross-repo observability | **skipped** | `CROSS_REPO_OBSERVABILITY=0` |
| 3b. Component scope | **skipped** | `COMPONENT_SCOPE_MODE=0` |
| 3c. Spec pack | **skipped** | `SPEC_PACK_MODE=0` |
| 3d. User guide | **skipped** | `USER_GUIDE_MODE=0` |
| 3e. Legacy drift | **no repair** | BUG-0029 is OPEN, so it is outside the DONE-drift rule. This phase did not edit `docs/product/backlog.md` or `docs/product/acceptance.md`. |
| 3f. README feature coverage | **PASS** | See gate table. `coverage_missing=[]`, `coverage_total=52`. |
| 3g. Project README | **PASS (kit skip)** | `python scripts/validate_project_readme_coverage.py --repo . --enforce` exit 0, `kit_repo_skipped=true`, `status=PASS`, `gaps=[]`. |

### Version-doc / changelog (step 17)

`release_version` is blank, so this is the `[Unreleased]` path only. No per-version file. One **BUG-0029** bullet was inserted under the existing `[Unreleased]` `### Fixed` heading in `CHANGELOG.md` (same placement as the prior workflow-only bullet). `template/CHANGELOG.md` was not edited. `python scripts/release_changelog_validate.py --repo . --enforce` exit 1 with exactly these three codes: `RELEASE_CHANGELOG_ORDER_INVALID`, `RELEASE_CHANGELOG_VERSION_DOC_MISSING`, `RELEASE_CHANGELOG_VERSION_MISSING`. Same carried legacy baseline as S0169–S0176. The S0178 row has a blank `release_version`, so this bullet does not add a new code.

### Status, publish, and push

- BUG-0029 remains **OPEN**. Backlog AC-1..AC-5 stay `[ ]`. This release did not flip them. BUG-0026 and the BUG-0028 backlog row were not edited. US-0150, US-0151, US-0154, US-0155, and US-0156 were not reopened.
- **Publish: NOT PERFORMED.** `RELEASE_PUBLISH_MODE=confirm`. Operator confirmation was absent (`PUBLISH_CONFIRMATION_REQUIRED`, not a hard decision-gate stop). `npm_published=false`. No registry write. npm target `npm-public` in `docs/engineering/release-targets.json` is `enabled=false`. `RELEASE_TARGETS_DEFAULT` is empty. No enabled target ran.
- **Push: NOT PERFORMED.** `python scripts/sync_push_gates.py policy --root . --branch local` returned `{"ok": false, "reason_code": "SYNC_DISABLED"}` exit 2. `push_decision=not_eligible`. No git commit. No git push. `git_pushed=false`.
- Sync evidence: `phase_boundary=release`; `policy_mode=disabled` (`SYNC_POLICY_MODE`); publish `policy_mode=confirm`; `checks=test:pass`; `push_decision=not_eligible`; `reason_code=SYNC_DISABLED`; `evidence_refs=tests/report.md`, `sprints/S0178/release-findings.md`.
- Runbook: `DEPLOY_STAGING_COMMAND` and `DEPLOY_PROD_COMMAND` stay explicit echo lines. This pass added `## API-key login (BUG-0029)` to `docs/engineering/runbook.md` and the template twin.
- `docs/engineering/runtime-connectivity.md` was not rewritten. Every target in `docs/engineering/release-targets.json` is `enabled=false`.
- No `.env` read. No subagent spawn. No `/auto`. No `/closure`. `.cursor/scratchpad.md` not edited.
- Triad: pre-append archive of 1 oldest non-protected checkpoint unit to `docs/engineering/state-archive/state-pack-20261016-e.md` (US-0155 QA checkpoint, including its pair-repair subsection). `--rollover` was not run. Protected BUG-0033 refresh remains. `architecture.md` was not rolled. Post-archive hot file 1133 lines; post-append hot file 1163 lines; retained checkpoints 34 then 35.

### Next

`next_scheduled_phase=closure`. `next_scheduled_role=curator`. `native_chain_continuing=true`. `qe` is not a spawnable subagent; DEC-0052 sanctioned alternate is **curator**. `stop_reason=release_complete_phase_boundary`. `stop_matrix_action=STOP_AFTER_RELEASE_PASS; validate_pair_then_parent_may_spawn_closure`. This child does not spawn closure.
