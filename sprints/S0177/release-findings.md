# Sprint S0177 — BUG-0026 / release findings

## Verdict

**RELEASE_FAIL**. Finalization did not run. Queue status for S0177 is **blocked**. BUG-0026 stays **OPEN**. AC-3 stays unchecked. Closure was not spawned and is not scheduled.

- **Phase / role:** `release` / `release` (fresh)
- **Evaluated:** `2026-10-15T09:27:02Z` (UTC)
- **orchestrator_run_id:** `auto-20261015-bug0026`
- **Fresh marker:** `release-BUG0026-release-20261015T092702Z-fresh` (grep-verified 0 prior occurrences at mint)
- **model_id:** `inherit`
- **model_provenance:** `provenance=host=cursor;path=.cursor/scratchpad.local.md;step=MODEL_TIER_<PHASE>`
- **delivery_mode:** `ultra_lean`; **policy_mode:** `confirm`; **trigger_source:** `auto`; **branch:** `local`
- **decision_gate:** false
- **fail_closed_reason_codes:** `RELEASE_TEST_FAILED`; `README_FEATURE_COVERAGE_BLOCKED`; `README_FEATURE_COVERAGE_GAP:BUG-0028`
- **npm_published:** false

### Release proof tuple (own, fresh)

- runtime_proof_id=`rp-auto-20261015-bug0026-release-release-20261015T092702Z-BUG-0026`
- proof_hash=`07f2097c44fd2e36c5628d9980e70706d2f29e07a66866b36f95414ce8116e56`
- proof_issued_at=`2026-10-15T09:27:02Z`; proof_ttl_seconds=`3600` (TTL expiry `2026-10-15T10:27:02Z`)
- canonical payload (sorted keys as hashed):
  `{"orchestrator_run_id":"auto-20261015-bug0026","phase_id":"release","proof_issued_at":"2026-10-15T09:27:02Z","proof_ttl_seconds":3600,"role":"release","runtime_proof_id":"rp-auto-20261015-bug0026-release-release-20261015T092702Z-BUG-0026"}`
- `scripts.token_cost_lib.compute_strict_proof_hash` and independent `hashlib.sha256` returned the same hex digest. 0 prior occurrences of this `runtime_proof_id` at mint.

## Consumed verify-work pair

Recomputed MATCH and inside TTL at this write (issued `2026-10-15T09:07:04Z`, TTL until `2026-10-15T10:07:04Z`; clock at validation `2026-10-15T09:14:04Z`).

- record_key `auto-20261015-bug0026|bug|BUG-0026|verify-work|rp-auto-20261015-bug0026-verify-work-qa-20261015T090704Z-BUG-0026`
- proof_hash `771e72a9a551cfb98ff6809d8e711b66e24190eee7f71d0962b4d6acf7c49bdc`
- marker `qa-BUG0026-vw-20261015T090704Z-fresh`
- Not `RESUME_BRIEF_STALE`.

Execute `9fd4bf3e08dfc5a00422860c5858b8b1f241732ed388a269b7a8bb94b52f3486` and QA `8e764bb06d76659824e92774772bc0d26602874df30a367585b7579992901187` also recomputed MATCH and were inside TTL at this write.

## Mandatory release gate chain

| Gate | Result | Evidence |
|---|---|---|
| 1. Check-in tests | **FAIL** | This release ran `powershell -NoProfile -ExecutionPolicy Bypass -File tests/run-tests.ps1` (runbook `TEST_COMMAND`), exit 1. `tests/report.md` is `2026-10-15T09:24:56Z`, **Pass 872 / Fail 8**. US-0071 metadata guard L713–L722 all `[PASS]`. Triad L723–L726 `[PASS]`. Reason `RELEASE_TEST_FAILED`. `lint:skipped`, `typecheck:skipped` (commands blank). |
| 2. QA completion | **PASS** (not sufficient) | `sprints/S0177/qa-findings.md`: **QA_PASS**, blocking findings none. Generated-test fields present (`generated_test_result=pass`, `generated_test_reason_code=ok`). |
| 3. UAT completion | **PASS** (not sufficient) | `sprints/S0177/uat.json`: `status=PASS`, `uat_lifecycle=populated`, `placeholder_only=false`, passed 9 / failed 0 / total 9. `sprints/S0177/uat.md` matches. |
| 3f. README feature coverage | **FAIL** | `python scripts/validate_readme_feature_coverage.py --repo . --enforce` exit 1. `README_FEATURE_COVERAGE_BLOCKED`. `README_FEATURE_COVERAGE_GAP:BUG-0028`. `coverage_missing=["BUG-0028"]`, `coverage_total=52`, `root_h2=Features`, `dev_h2=Architecture notes`. BUG-0028 is DONE and `user_visible: true`. This phase did not add that coverage. |
| 4. Isolation | **PASS** (not sufficient) | Distinct fresh checkpoints: execute `dev-BUG0026-execute-20261015T084528Z-fresh` (role=dev), qa `qa-BUG0026-qa-20261015T085625Z-fresh` (role=qa), verify-work `qa-BUG0026-vw-20261015T090704Z-fresh` (role=qa). This release adds `release-BUG0026-release-20261015T092702Z-fresh` (role=release, model_id=inherit). |
| 4b. Strict runtime proof | **PASS** (not sufficient) | Verify-work, QA, and execute hashes recomputed MATCH and were inside TTL at this write. Own release proof 2-invocation MATCH. |
| 5. Finalization | **NOT RUN** | Gates 1 and 3f failed. Queue row stays `blocked`. No `unreleased -> released` transition. No changelog bullet. Legacy `handoffs/release_notes.md` pointer left on S0176. |

## Harness fail rows (`tests/report.md`)

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

The slim-auto row failed while comparing `.cursor/scratchpad.md` with `template/.cursor/scratchpad.md`. Active `AUTO_BACKLOG_DRAIN=0`. Template `AUTO_BACKLOG_DRAIN=1`. This phase did not edit either scratchpad.

## Sprint markers re-run this release

Command: `python -m pytest tests/bug0026_packaged_range_contract_test.py -q --tb=line`

**8 passed / 0 failed.** Duration 3.92s. Exit code 0. These markers do not clear gate 1. The harness Fail count is 8.

## Optional gates (3a–3g)

| Gate | Result | Evidence |
|---|---|---|
| 3a. Cross-repo observability | **skipped** | `CROSS_REPO_OBSERVABILITY=0` |
| 3b. Component scope | **skipped** | `COMPONENT_SCOPE_MODE=0` |
| 3c. Spec pack | **skipped** | `SPEC_PACK_MODE=0` |
| 3d. User guide | **skipped** | `USER_GUIDE_MODE=0` |
| 3e. Legacy drift | **no repair** | BUG-0026 is OPEN, so it is outside the DONE-drift rule. This phase did not edit `docs/product/backlog.md` or `docs/product/acceptance.md`. |
| 3f. README feature coverage | **FAIL** | See gate table. Sub-code `README_FEATURE_COVERAGE_GAP:BUG-0028`. |
| 3g. Project README | **PASS (kit skip)** | `python scripts/validate_project_readme_coverage.py --repo . --enforce` exit 0, `kit_repo_skipped=true`, `status=PASS`, `gaps=[]`. Does not clear gate 3f. |

## Version-doc / changelog (step 17)

Not run. Step 17 follows a successful `unreleased -> released` transition. `release_version` stays blank. `CHANGELOG.md` was not edited. `template/CHANGELOG.md` was not edited.

## Status, publish, and push

- BUG-0026 remains **OPEN**. Backlog AC-3 stays `[ ]`. This release did not flip them. BUG-0028, BUG-0029, BUG-0025, and US-0149 were not edited.
- **Publish: NOT PERFORMED.** `RELEASE_PUBLISH_MODE=confirm`. Operator confirmation was absent and this prompt denied publish. `npm_published=false`. No registry write. No kit semver bump. npm target `npm-public` in `docs/engineering/release-targets.json` is `enabled=false`.
- **Push: NOT PERFORMED.** `python scripts/sync_push_gates.py policy --root . --branch local` returned `{"ok": false, "reason_code": "SYNC_DISABLED"}` exit 2. `push_decision=not_eligible`. No git commit. No git push.
- Sync evidence: `phase_boundary=release`; `policy_mode=confirm` for publish and `SYNC_POLICY_MODE=disabled` for push; `checks=test:fail`; `push_decision=not_eligible`; `reason_code=SYNC_DISABLED`; `evidence_refs=tests/report.md`, `sprints/S0177/release-findings.md`.
- Runbook: `DEPLOY_STAGING_COMMAND` and `DEPLOY_PROD_COMMAND` are already explicit echo lines. This blocked release did not add a runbook subsection.
- `docs/engineering/runtime-connectivity.md` was not rewritten.
- No `.env` read. No subagent spawn. No `/auto`. No `/closure`. `.cursor/scratchpad.md` not edited.
- Triad: `python scripts/enforce-triad-hot-surface.py --check` exit 0. Hot `docs/engineering/state.md` is 1191 lines. One oldest non-protected checkpoint (US-0154 discovery) archived to `docs/engineering/state-archive/state-pack-20261015-f.md`. `--rollover` was not run. Protected BUG-0033 refresh remains. `architecture.md` was not rolled.

## Remediation

1. Make `tests/run-tests.ps1` exit 0 and refresh `tests/report.md` to Fail 0, including the eight rows above.
2. Add **BUG-0028** coverage under `## Features` in the root feature README and under `## Architecture notes` in `docs/developer/README.md` (affinity `docs/engineering/context/readme-section-affinity.json`), then re-run `python scripts/validate_readme_feature_coverage.py --repo . --enforce` until exit 0. This phase did not do that edit.
3. Rerun `/release` for S0177 / BUG-0026. Do not tick AC-3 and do not flip BUG-0026 to DONE in `/release`. Closure owns that flip after a later RELEASE_PASS.

## Next

`next_scheduled_phase=none`. `next_scheduled_role=none`. `native_chain_continuing=false`. `stop_reason=release_blocked_RELEASE_TEST_FAILED`. `qe` is not a spawnable subagent; the DEC-0052 sanctioned closure alternate is `curator`, and that spawn waits on a future RELEASE_PASS. This child does not spawn closure.
