# Sprint S0177 — BUG-0026 / release findings

## Re-attestation (release2) — 2026-10-24T10:06:41Z (UTC)

**RELEASE_PASS**. Fresh independent release child of the re-release cycle `auto-20261023-bug0026-release`; all ordered gates green on fresh evidence; consumed verify-work pair IN-TTL at issue and integrity-verified. Queue status for S0177 transitions **blocked → released**. BUG-0026 stays **OPEN** (not a DONE flip). AC-3 stays unchecked (closure owns the AC-3 tick + DONE flip). `/closure` is NOT spawned by this child.

- **Phase / role:** `release` / `release` (fresh)
- **Evaluated:** `2026-10-24T10:06:41Z` (UTC)
- **orchestrator_run_id:** `auto-20261023-bug0026-release`
- **Fresh marker:** `release-BUG0026-release2-20261024T100641Z-fresh` (grep-verified 0 prior occurrences repo-wide at mint)
- **model_id:** `zelisko_llm/qwen3.8-27b`
- **model_provenance:** fresh canonical re-attest release phase child
- **delivery_mode:** `ultra_lean`; **policy_mode:** `confirm`; **trigger_source:** `auto`; **branch:** `local`
- **decision_gate:** false
- **fail_closed_reason_codes:** none
- **npm_published:** false

### Release proof tuple (own, fresh)

- runtime_proof_id=`rp-auto-20261023-bug0026-release-release-20261024T100641Z-BUG-0026`
- proof_hash=`8a92de7f66b2fbc08da87459e78840aab9e52de1d5ccadf6b7c271e9a757ca4c`
- proof_issued_at=`2026-10-24T10:06:41Z`; proof_ttl_seconds=`3600` (TTL expiry `2026-10-24T11:06:41Z`)
- canonical payload (sorted keys as hashed):
  `{"orchestrator_run_id":"auto-20261023-bug0026-release","phase_id":"release","proof_issued_at":"2026-10-24T10:06:41Z","proof_ttl_seconds":3600,"role":"release","runtime_proof_id":"rp-auto-20261023-bug0026-release-release-20261024T100641Z-BUG-0026"}`
- `scripts.token_cost_lib.compute_strict_proof_hash` and independent `hashlib.sha256(json.dumps(obj, sort_keys=True, separators=(",", ":")).encode())` returned the same hex digest. 0 prior occurrences of this `runtime_proof_id` at mint.

### Consumed verify-work pair

Recomputed MATCH and inside TTL at this write (issued `2026-10-24T09:38:56Z`, TTL until `2026-10-24T10:38:56Z`; clock at validation `2026-10-24T10:06:41Z`, ~3,175s remaining).

- record_key `auto-20261023-bug0026-verify-work|bug|BUG-0026|verify-work|rp-auto-20261023-bug0026-verify-work-qa-20261024T093856Z-BUG-0026`
- proof_hash `435104b2db05f4c26fec27e87005e7450c11eba4d5b37f17dc9709651ea303c8`
- marker `qa-BUG0026-verifywork-20261024T093856Z-fresh`
- state-bottom ↔ brief-top JSON byte-identical; all 20 `PAIR_LOCKED_FIELDS` equal; rebuilt key MATCH; `validate_resume_pair(writer_role=qa)` ok=true.
- Provenance chain (integrity-verified, NOT re-run): execute `auto-20261023-bug0026-execute` strict 6-tuple hash `30d2784461bdbc1a63d94da2448d2b6fb70735fe49a9bcc59e5433e00874a1f1`; qa `auto-20261023-bug0026-qa` strict 6-tuple hash `95cd78d9aa441ba17fbe9f9c22c000c9dbe7a73ca19a2e4a5664bad929ae0f4c` (both OUT-OF-TTL at release issue — consumed as integrity-verified provenance links only; no stale-proof waiver; all functional + harness evidence independently re-run fresh in THIS release context).

### Mandatory release gate chain

| Gate | Result | Evidence |
|---|---|---|
| 1. Check-in tests | **PASS** | `powershell -NoProfile -ExecutionPolicy Bypass -File tests/run-tests.ps1` (runbook `TEST_COMMAND`) exit 0. Fresh `tests/report.md` `2026-10-24T10:05:47Z`, **Pass 884 / Fail 0** (0 `[FAIL]` lines repo-wide). US-0071 metadata-guard L713–L722 all `[PASS]`. Triad rows L725–L726 `[PASS]`. Scoped `python -m pytest tests/bug0026_packaged_range_contract_test.py -q` → **8 passed in 4.46s**, exit 0 (fresh re-run this release). |
| 2. QA completion | **PASS** | `sprints/S0177/qa-findings.md` top RE-ATTEST record **QA_PASS / 0 blocking** (run `auto-20261023-bug0026-qa`; 8/8 scoped; harness 884/0 attested; UAT 9/9 reviewed; AC-8 token distinction `STANDALONE_SUPPORTED_RANGE_MISSING` vs `KERNEL_CONTRACT_MISMATCH` confirmed). Cited, not re-run. |
| 3. UAT completion | **PASS** | `sprints/S0177/uat.json`: `status=PASS`, `phase_id=verify-work`, `uat_lifecycle=populated`, `placeholder_only=false`, passed 9 / failed 0 / total 9. 5 live probe classes `UAT_PROBE_FORBIDDEN` (static file-level probes + read-only cli_smoke re-observation only). Cited, not re-run. |
| 3f. README feature coverage | **PASS** | `python scripts/validate_readme_feature_coverage.py --repo . --enforce` exit 0, `[README_FEATURE_COVERAGE_VALIDATE_OK]`, `coverage_missing=[]`, `gaps=[]`, `coverage_total=57` (57/57). Fresh this release — the Oct-15 `BUG-0028` gap is closed. |
| 3g. Project README | **PASS (kit skip)** | `python scripts/validate_project_readme_coverage.py --repo . --enforce` exit 0, `kit_repo_skipped=true`, `status=PASS`, `gaps=[]`. Fresh this release. |
| 4. Isolation | **PASS** | Distinct fresh checkpoints: execute `dev-BUG0026-execute-20261023T140947Z-fresh` (role=dev), qa `qa-BUG0026-qa-20261023T143037Z-fresh` (role=qa), verify-work `qa-BUG0026-verifywork-20261024T093856Z-fresh` (role=qa). This release adds the 4th distinct marker `release-BUG0026-release2-20261024T100641Z-fresh` (role=release). Role-aligned per US-0069/DEC-0051; CROSS_MODEL_REVIEW=0. |
| 4b. Strict runtime proof | **PASS** | Consumed verify-work strict 6-tuple recomputed MATCH (lib + independent compact sorted-key SHA-256) and IN-TTL at issue; execute/qa chain leaves integrity-verified provenance-only; own release proof 2-invocation MATCH; RUNTIME_PROOF_REUSED guard honored (0 prior occurrences). |
| Validator AC gate | **PASS** | `python scripts/bug_issue_validate.py --repo . --check-acceptance` → `[BUG_VALIDATION_OK]` exit 0 (mandated validator bridge GREEN before writing release queue / release notes). Fresh this release. |
| 5. Finalization | **RUN** | Gates all PASS. Queue row transitioned `blocked → released`. `CHANGELOG.md` `[Unreleased]`/`### Fixed` carries the BUG-0026 bullet. Legacy `handoffs/release_notes.md` finalized note prepended. `handoffs/releases/S0177-release-notes.md` re-attestation prepended. `template/CHANGELOG.md` untouched. |

### AC-3 evidence citation (read-only, NOT re-run)

Debian 13 WSL2, Node `v24.19.0`, CPython `3.12.15`, consumer `/home/flow/bug0026-consumer-s0177`, published global `its-magic@0.1.5`, upgrade `v0.1.4 → v0.1.5` exit `0`; tokens present `HOST_CONFIG_POSTINSTALL_OK` / `STANDALONE_BOOTSTRAP_OK` / `STANDALONE_POSTINSTALL_OK`; tokens absent `KERNEL_CONTRACT_MISMATCH` / `STANDALONE_SUPPORTED_RANGE_MISSING`; posix `.its-magic/bin/itsm` mode `0755`, shebang `#!/usr/bin/env sh`. Upgrade command NOT re-run; `.env` NOT read.

### Status, publish, and push

- BUG-0026 remains **OPEN**. AC-3 stays `[ ]`. AC-1/AC-2/AC-4/AC-5/AC-6/AC-7/AC-8 checked and held. This release did NOT tick AC-3 and did NOT flip BUG-0026 to DONE (closure owns both after this RELEASE_PASS).
- **Publish: NOT PERFORMED.** `RELEASE_PUBLISH_MODE=confirm` (operator confirm deferred for this workflow-only release). `npm_published=false`. No registry write. No kit semver bump. Version bump + actual publish is the later `scripts/release-all.ps1` packaging owned by parent.
- **Push: NOT PERFORMED.** `SYNC_POLICY_MODE=disabled`. `git_pushed=false`. No git commit. No git push. `reason_code=SYNC_DISABLED`.
- `release_version` = **none** (workflow-only release; no kit semver bump; feeds `[Unreleased]` / next kit version).
- `template/CHANGELOG.md` UNTOUCHED.
- Triad: post-append `--check` initially `STATE_ARCHIVE_REQUIRED` (1217/1200 lines); documented rollover `python scripts/enforce-triad-hot-surface.py --repo . --rollover --json` → `{"boundary":"triad-rollover|state","moved":1,"pack_ref":"...state-pack-20261024-a.md","retained_checkpoints":47,"retained_lines":1185}`; follow-up `--check` exit **0**. This release checkpoint retained on the hot tail; oldest checkpoint archived.
- No `.env` read. No subagent spawn. No `/auto`. No `/closure` spawn. `.cursor/scratchpad.md` not edited.

### Next

`next_scheduled_phase=closure`. `next_scheduled_role=curator`. `stop_reason=release_complete_phase_boundary`. `stop_matrix_action=STOP_AFTER_RELEASE_PASS; validate_pair_then_parent_may_spawn_closure`. Parent may validate the release pair and spawn a fresh `/closure` (curator; DEC-0052 sanctioned alternate since `qe` is not spawnable on this host) for **BUG-0026/S0177**; this release child does NOT spawn it.

---

## Verdict

**RELEASE_FAIL**. Finalization did not run. Queue status for S0177 is **blocked**. BUG-0026 stays **OPEN**. AC-3 stays unchecked. Closure was not spawned and is not scheduled. *(Superseded by the release2 re-attestation above.)*

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
