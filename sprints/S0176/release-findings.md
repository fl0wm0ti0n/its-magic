# Sprint S0176 — BUG-0028 / release findings

## Verdict

**RELEASE_PASS**. Mandatory gates 1, 2, 3, 4, and 4b are green. Optional 3e is not a drift repair. 3f PASS (BUG-0028 stays out of `coverage_present` while OPEN). 3g PASS with `kit_repo_skipped=true`. 3a–3d skipped. Gate 5 finalization writes the queue row, notes, changelog `[Unreleased]` bullet, the runbook subsection, and the state checkpoint. BUG-0028 stays **OPEN**. Closure owns the DONE flip.

- **Phase / role:** `release` / `release` (fresh)
- **Evaluated:** `2026-10-14T21:07:42Z` (UTC)
- **orchestrator_run_id:** `auto-20261013-bug0028`
- **Fresh marker:** `release-BUG0028-release-20261014T210742Z-fresh` (grep-verified 0 prior occurrences at mint)
- **model_id:** `inherit` (CROSS_MODEL_REVIEW=1)
- **delivery_mode:** `ultra_lean`; **policy_mode:** `confirm`; **trigger_source:** `auto`; **branch:** `local`
- **decision_gate:** false

### Release proof tuple (own, fresh)

- runtime_proof_id=`rp-auto-20261013-bug0028-release-release-20261014T210742Z-BUG-0028`
- proof_hash=`5b6179bd2d740349350250637e17f292d1db0f55ecf55d93eeda7bf73392d77e`
- proof_issued_at=`2026-10-14T21:07:42Z`; proof_ttl_seconds=`3600` (TTL expiry `2026-10-14T22:07:42Z`)
- canonical payload (sorted keys as hashed):
  `{"orchestrator_run_id":"auto-20261013-bug0028","phase_id":"release","proof_issued_at":"2026-10-14T21:07:42Z","proof_ttl_seconds":3600,"role":"release","runtime_proof_id":"rp-auto-20261013-bug0028-release-release-20261014T210742Z-BUG-0028"}`
- `scripts.token_cost_lib.compute_strict_proof_hash` and independent `hashlib.sha256` returned the same hex digest. 0 prior occurrences of this `runtime_proof_id` at mint.

## Mandatory release gate chain

| Gate | Result | Evidence |
|---|---|---|
| 1. Check-in tests | **PASS** | This release ran `powershell -NoProfile -ExecutionPolicy Bypass -File tests/run-tests.ps1` (runbook `TEST_COMMAND`), exit 0. `tests/report.md` is `2026-10-14T21:06:12Z`, **Pass 880 / Fail 0**. US-0071 metadata guard L713–L722 all `[PASS]`. Triad L725–L726 `[PASS]`. This release also re-ran `node --experimental-strip-types --test --test-name-pattern "test_bug0028_" tests/contract/bug0028.contract.test.ts` (cwd `standalone`) → **5 passed / 0 failed**, duration_ms 5427.8777, exit 0. `lint:skipped`, `typecheck:skipped` (commands blank). |
| 2. QA completion | **PASS** | `sprints/S0176/qa-findings.md`: **QA_PASS**, blocking findings none. Generated-test fields present (`generated_test_result=pass`, `generated_test_reason_code=ok`). |
| 3. UAT completion | **PASS** | `sprints/S0176/uat.json`: `status=PASS`, `verdict=VERIFY_PASS`, `uat_lifecycle=populated`, `placeholder_only=false`, passed 6 / failed 0 / total 6. A live installed binary stays `UAT_PROBE_FORBIDDEN`. This release did not run one and did not use paid credentials. |
| 4. Isolation | **PASS** | Distinct fresh checkpoints in `docs/engineering/state.md`: execute `dev-BUG0028-execute-20261014T192900Z-fresh` (role=dev), qa `qa-BUG0028-qa-20261014T195855Z-fresh` (role=qa), verify-work `qa-BUG0028-vw-20261014T202655Z-fresh` (role=qa). This release adds `release-BUG0028-release-20261014T210742Z-fresh` (role=release, model_id=inherit). |
| 4b. Strict runtime proof | **PASS** | Three continuation-pair leaves recomputed MATCH (lib + independent hashlib). Verify-work `7ee977e3dfd461df2031fe6d4b1d3f89da83df5b7cf55ba02635635bf22d68f7` was inside TTL at this child's start `2026-10-14T20:53:26Z` and at issue `2026-10-14T21:07:42Z` (TTL until `2026-10-14T21:26:55Z`). QA `bf31b1146e19c04444715cd10374bbf825463836f9889e5cbda39e072c5b52d2` was inside TTL at start (until `2026-10-14T20:58:55Z`) and was consumed by verify-work at `2026-10-14T20:26:55Z`. Execute `a7e227b1d956da1dad52a8c6508de69b3213ba712646553eb579c5c7c90a0fad` was consumed by QA at `2026-10-14T19:58:55Z`, before its TTL `2026-10-14T20:29:00Z`. Execute's TTL had expired by release start; the hop that consumed it was inside TTL. Own release proof 2-invocation MATCH. |
| 5. Finalization | **PASS** | Queue row `S0176` = `released` (workflow-only, blank `release_version`). Notes `handoffs/releases/S0176-release-notes.md`. Legacy pointer prepended. `CHANGELOG.md` `[Unreleased]` `### Fixed` BUG-0028 bullet. State checkpoint appended after one oldest eligible checkpoint archive. Resume brief prepended after the checkpoint. |

## Markers re-run this release

Command: `node --experimental-strip-types --test --test-name-pattern "test_bug0028_" tests/contract/bug0028.contract.test.ts` (cwd `standalone`).

| Marker | Result |
|---|---|
| `test_bug0028_help_auth_models_skip_host_and_kernel_barrel` | PASS (1376.3222 ms) |
| `test_bug0028_status_bounded_snapshot_no_scan_session_or_ping` | PASS (247.2738 ms) |
| `test_bug0028_workflow_tokens_keep_production_host` | PASS (3418.0432 ms) |
| `test_bug0028_installed_entrypoint_windows_and_linux` | PASS (274.2637 ms) |
| `test_bug0028_operator_doc_lightweight_versus_full_runtime` | PASS (1.9645 ms) |

**5 pass / 0 fail.** Duration 5427.8777 ms. Exit code 0.

## Optional gates (3a–3g)

| Gate | Result | Evidence |
|---|---|---|
| 3a. Cross-repo observability | **skipped** | `CROSS_REPO_OBSERVABILITY=0` |
| 3b. Component scope | **skipped** | `COMPONENT_SCOPE_MODE=0` |
| 3c. Spec pack | **skipped** | `SPEC_PACK_MODE=0` |
| 3d. User guide | **skipped** | `USER_GUIDE_MODE=0` |
| 3e. Legacy drift | **no repair** | BUG-0028 is OPEN, so it is outside the DONE-drift rule. This phase did not edit `docs/product/backlog.md` or `docs/product/acceptance.md`. |
| 3f. README feature coverage | **PASS** | `python scripts/validate_readme_feature_coverage.py --repo . --enforce` exit 0, `[README_FEATURE_COVERAGE_VALIDATE_OK]`, `coverage_missing=[]`, `gaps=[]`, `coverage_total=51`, `status=PASS`. BUG-0028 is absent from `coverage_present` while OPEN. |
| 3g. Project README | **PASS (kit skip)** | `python scripts/validate_project_readme_coverage.py --repo . --enforce` exit 0, `kit_repo_skipped=true`, `status=PASS`, `gaps=[]`. |

## Version-doc / changelog (step 17)

- Queue `release_version` is blank. Workflow-only. Kit stays `0.1.10`. No `promote_unreleased`. No semver bump. No per-version file.
- `CHANGELOG.md` `## [Unreleased]` gained a `### Fixed` **BUG-0028** bullet. `template/CHANGELOG.md` was not edited.
- `python scripts/release_changelog_validate.py --repo . --enforce` exit 1 with exactly these three codes: `RELEASE_CHANGELOG_ORDER_INVALID`, `RELEASE_CHANGELOG_VERSION_DOC_MISSING`, `RELEASE_CHANGELOG_VERSION_MISSING`. Same carried legacy baseline as S0169–S0175. The S0176 row has a blank `release_version`, so this bullet does not add a new code.

## Status, publish, and push

- BUG-0028 remains **OPEN**. Backlog AC-1..AC-5 stay unchecked. This release did not flip them. BUG-0026, BUG-0029, US-0150, US-0151, US-0154, US-0155, and US-0156 were not mutated.
- **Publish: NOT PERFORMED.** `RELEASE_PUBLISH_MODE=confirm`. Operator confirmation was absent and this prompt denied publish. `npm_published=false`. No registry write. No kit semver bump. npm target in `docs/engineering/release-targets.json` is `enabled=false`.
- **Push: NOT PERFORMED.** `python scripts/sync_push_gates.py policy --root <repo> --branch local` returned `{"ok": false, "reason_code": "SYNC_DISABLED"}` exit 2. `push_decision=not_eligible`. No git commit. No git push.
- Sync evidence: `phase_boundary=release`; `policy_mode=confirm` for publish and `SYNC_POLICY_MODE=disabled` for push; `checks=test:pass`; `push_decision=not_eligible`; `reason_code=SYNC_DISABLED`; `evidence_refs=tests/report.md`, `sprints/S0176/release-findings.md`.
- Runbook: `DEPLOY_STAGING_COMMAND` and `DEPLOY_PROD_COMMAND` stay explicit echo lines. Added `## Lightweight itsm inspection (BUG-0028)` to `docs/engineering/runbook.md` and `template/docs/engineering/runbook.md`. `docs/engineering/runtime-connectivity.md` was not rewritten; this release is local fixtures only.
- No `.env` read. No subagent spawn. No `/auto`. No `/closure`. `.cursor/scratchpad.md` not edited.

## Next

`/closure` with role `curator`. `qe` is not a spawnable subagent on this Cursor host; S0175 used curator as the sanctioned closure alternate. `stop_reason=release_complete_phase_boundary`. This child does not spawn closure.
