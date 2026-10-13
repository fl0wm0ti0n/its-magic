# Sprint S0172 — US-0152 / release findings

## Verdict

**RELEASE_PASS**. Mandatory gates 1, 2, 3, 4, and 4b are green. Optional 3e is not a drift repair. 3f PASS (US-0152 stays out of `coverage_present` while OPEN). 3g PASS with `kit_repo_skipped=true`. 3a–3d skipped. Gate 5 finalization writes the queue row, notes, changelog `[Unreleased]` bullet, and the state checkpoint. US-0152 stays **OPEN**. Closure owns the DONE flip.

- **Phase / role:** `release` / `release` (fresh)
- **Evaluated:** `2026-10-11T19:48:08Z` (UTC)
- **orchestrator_run_id:** `auto-20261011-us0152-release`
- **Fresh marker:** `release-US0152-release-20261011T194808Z-fresh` (grep-verified 0 prior occurrences at mint)
- **CROSS_MODEL_REVIEW:** 0 (sovereign-critic not consumed)
- **delivery_mode:** `ultra_lean`; **policy_mode:** `confirm`; **trigger_source:** `auto`; **branch:** `local`

### Release proof tuple (own, fresh)

- runtime_proof_id=`rp-auto-20261011-us0152-release-release-20261011T194808Z`
- proof_hash=`d49f4d80ced498440b0155bddd22cc10260c1253c97e9c4ec1ffa999f5ac703f`
- proof_issued_at=`2026-10-11T19:48:08Z`; proof_ttl_seconds=`3600` (TTL expiry `2026-10-11T20:48:08Z`)
- canonical payload (sorted keys as hashed):
  `{"orchestrator_run_id":"auto-20261011-us0152-release","phase_id":"release","proof_issued_at":"2026-10-11T19:48:08Z","proof_ttl_seconds":3600,"role":"release","runtime_proof_id":"rp-auto-20261011-us0152-release-release-20261011T194808Z"}`
- `scripts.token_cost_lib.compute_strict_proof_hash` and independent `hashlib.sha256` returned the same hex digest. 0 prior occurrences of this `runtime_proof_id` at mint.

## Mandatory release gate chain

| Gate | Result | Evidence |
|---|---|---|
| 1. Check-in tests | **PASS** | Latest `tests/report.md` is `2026-10-11T19:38:28Z`, **Pass 880 / Fail 0** (verify-work of this story). US-0071 metadata guard L713–L722 all `[PASS]`. Triad L725–L726 `[PASS]`. This release re-ran `node --experimental-strip-types --test --test-name-pattern "test_us0152_" tests/contract/us0152.contract.test.ts` (cwd `standalone`) → **6 passed / 0 failed**, duration_ms 1686.1258, exit 0. Full harness not re-run: evidence is present, fresh, and passing, and this phase did not change product code. `harness_fail_zero_claimed=false`. `lint:skipped`, `typecheck:skipped` (commands blank). |
| 2. QA completion | **PASS** | `sprints/S0172/qa-findings.md`: **QA_PASS**, blocking findings none, AC-1..AC-6 PASS, evaluated `2026-10-11T19:26:09Z`. |
| 3. UAT completion | **PASS** | `sprints/S0172/uat.json`: `status=PASS`, `verdict=PASS`, `uat_lifecycle=populated`, `placeholder_only=false`, passed 7 / failed 0 / total 7. A live browser against an external site stays `UAT_PROBE_FORBIDDEN`. This release did not open an external site and did not use paid credentials. |
| 4. Isolation | **PASS** | Distinct fresh checkpoints in `docs/engineering/state.md`: execute `dev-US0152-execute-20261011T191205Z-fresh` (role=dev), qa `qa-US0152-qa-20261011T192609Z-fresh` (role=qa), verify-work `qa-US0152-vw-20261011T194200Z-fresh` (role=qa). This release adds `release-US0152-release-20261011T194808Z-fresh` (role=release). CROSS_MODEL_REVIEW=0. |
| 4b. Strict runtime proof | **PASS** | Three continuation-pair leaves recomputed MATCH (lib + independent hashlib) and are inside TTL at this issue time `2026-10-11T19:48:08Z`. execute-pair `82bb742649fefb5ae5ef3332a594dad1ec611aaa7f5724872be7d3ec3f414219` TTL until `2026-10-11T20:14:08Z`. qa-pair `f79c4b0bcd14eebe4efaf3de0c0213e03b77b4c26e8fa1d93527c3fd36bf86a5` TTL until `2026-10-11T20:27:56Z`. verify-pair `4321de0d6555e630bc8462402db6c8d85035466d7cd7d84433afee1566c35f86` TTL until `2026-10-11T20:44:05Z`. Parent consumed verify-work marker `qa-US0152-vw-20261011T194200Z-fresh`. Own release proof 2-invocation MATCH. |
| 5. Finalization | **PASS** | Queue row `S0172` = `released` (workflow-only, blank `release_version`). Notes `handoffs/releases/S0172-release-notes.md`. Legacy pointer prepended. `CHANGELOG.md` `[Unreleased]` `### Added` US-0152 bullet. State checkpoint appended after one oldest-checkpoint rollover. Resume brief prepended after the checkpoint. |

## Markers re-run this release

Command: `node --experimental-strip-types --test --test-name-pattern "test_us0152_" tests/contract/us0152.contract.test.ts` (cwd `standalone`).

| Marker | Result |
|---|---|
| `test_us0152_host_owns_app_runtime_and_browser_uat` | PASS (11.3832 ms) |
| `test_us0152_production_driver_is_isolated_or_unavailable` | PASS (13.1823 ms) |
| `test_us0152_gates_use_app_health_browser_probe_and_retry` | PASS (3.8895 ms) |
| `test_us0152_incomplete_evidence_blocks_uat` | PASS (11.4577 ms) |
| `test_us0152_app_and_browser_commands_share_services` | PASS (188.702 ms) |
| `test_us0152_e2e_launch_gate_and_failure_fixtures` | PASS (19.7662 ms) |

**6 pass / 0 fail.** Duration 1686.1258 ms. Exit code 0.

## Optional gates (3a–3g)

| Gate | Result | Evidence |
|---|---|---|
| 3a. Cross-repo observability | **skipped** | `CROSS_REPO_OBSERVABILITY=0` |
| 3b. Component scope | **skipped** | `COMPONENT_SCOPE_MODE=0` |
| 3c. Spec pack | **skipped** | `SPEC_PACK_MODE=0` |
| 3d. User guide | **skipped** | `USER_GUIDE_MODE=0` |
| 3e. Legacy drift | **no repair** | US-0152 is OPEN, so it is outside the DONE-drift rule. This phase did not edit `docs/product/backlog.md` or `docs/product/acceptance.md`. |
| 3f. README feature coverage | **PASS** | `python scripts/validate_readme_feature_coverage.py --repo . --enforce` exit 0, `[README_FEATURE_COVERAGE_VALIDATE_OK]`, `coverage_missing=[]`, `gaps=[]`, `coverage_total=47`, `status=PASS`. US-0152 is absent from `coverage_present` while OPEN. An absent DONE row is not a failure. |
| 3g. Project README | **PASS (kit skip)** | `python scripts/validate_project_readme_coverage.py --repo . --enforce` exit 0, `kit_repo_skipped=true`, `status=PASS`, `gaps=[]`. `FRAMEWORK_KIT_REPO=1`. |

## Version-doc / changelog (step 17)

- Queue `release_version` is blank. Workflow-only. Kit stays `0.1.10`. No `promote_unreleased`. No semver bump.
- `CHANGELOG.md` `## [Unreleased]` gained a `### Added` **US-0152** bullet. `template/CHANGELOG.md` was not edited.
- `python scripts/release_changelog_validate.py --repo . --enforce` exit 1 with exactly these three codes: `RELEASE_CHANGELOG_ORDER_INVALID`, `RELEASE_CHANGELOG_VERSION_DOC_MISSING`, `RELEASE_CHANGELOG_VERSION_MISSING`. Same carried legacy baseline as S0169 and S0171 (non-semver `## [Released]` header and older queue rows). The S0172 row has a blank `release_version`, so this bullet does not add a new code. Not a block.

## Status, publish, and push

- US-0152 remains **OPEN**. Backlog AC-1..AC-6 and `docs/product/acceptance.md` stay unchecked. This release did not flip them.
- **Publish: NOT PERFORMED.** `RELEASE_PUBLISH_MODE=confirm`, `RELEASE_PUBLISH_AUTO_CONFIRM=0`, `npm_published=false`, no registry write, no kit semver bump. Operator confirmation was absent, so no target ran.
- **Push: NOT PERFORMED.** `SYNC_POLICY_MODE=disabled`, `push_decision=not_eligible`, `reason_code=SYNC_DISABLED`. No git commit.
- Runbook deploy commands were already explicit: `DEPLOY_STAGING_COMMAND` and `DEPLOY_PROD_COMMAND` are echo statements that no staging or production target is configured. This phase did not edit `docs/engineering/runbook.md`.
- Triad: append reached 1216 lines, so one oldest checkpoint unit was archived to `docs/engineering/state-archive/state-pack-20261011-x.md`. Archived heading: `## Closure checkpoint - BUG-0033 / S0168 / auto-20261010-bug0033-closure (role=curator) -- **CLOSURE_BLOCKED**` (49 lines; the following pair-repair section sits inside that unit until the next checkpoint heading). Hot `docs/engineering/state.md` is **1167** lines. `python scripts/enforce-triad-hot-surface.py --repo . --check` exit **0**. This release checkpoint, the verify-work pair, the qa-pair, the execute-pair, the US-0152 plan checkpoint, the US-0152 discovery checkpoint, the US-0151 closure checkpoint, and the BUG-0033 refresh checkpoint were not archived. `docs/engineering/architecture.md` was not rolled.
- No `.env` read. No subagent spawn. No `/auto`. `.cursor/scratchpad.md` not edited. The eleven architecture linkage stubs were not moved.
- Not started: US-0153. US-0149, US-0150, and US-0151 were not reopened.

## Next

`/closure` with role `curator` (`qe` is unspawnable and `AUTO_ROLE_CLOSURE` is empty). `stop_reason=release_complete_phase_boundary`. This child does not spawn closure.
