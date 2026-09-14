# Release Notes — S0151 / US-0143

- **Sprint**: `S0151`
- **Story**: `US-0143` — Delivery routing and full-autonomy scheduler (`@its-magic/runtime-core` nested `workflow/delivery-router.ts`; CommandRouter `RouteScheduled` for `/auto`/`/quick`; WorkflowEngine `runAuto`/`runQuick`; GateEngine `RELEASE_GATE_ORDER` unamended; YAML stop-matrix consume; TS L8 adapter; five independent axes; AC-6 non-relaxable under `full`; audit + JSONL ledger; 12 `test_us0143_*`)
- **Release date**: `2026-09-14T08:50:00Z` (UTC)
- **orchestrator_run_id**: `auto-20260913-us0143`
- **delivery_mode**: `ultra_lean`
- **macro_phase**: `ship` (release → sovereign-critic (release) → closure per native chain)
- **policy_mode**: `confirm` (`RELEASE_PUBLISH_MODE=confirm`; operator confirm absent this turn → publish skipped)
- **trigger_source**: `auto`
- **branch**: `local` (no push; `SYNC_POLICY_MODE=disabled`)
- **fresh_context_marker**: `rel-US0143-release-20260914T085000Z-fresh`
- **model_id**: `composer-2.5-fast` (CROSS_MODEL_REVIEW=1)
- **runtime_proof_id**: `rp-auto-20260913-us0143-release-release-20260914T085000Z-US-0143`
- **proof_hash**: `0CBF9393607650A4B90A5BD0DB82EC22A72C8B8169F02D8D273087EB1C755C29`
- **proof_ttl**: `2026-09-14T09:50:00Z` (UTC)
- **release_version**: (none — workflow-only release)

## Verdict

**RELEASE_PASS.** Mandatory release gates (1, 2, 3, 4, 4b) green with **scoped pytest 12/12** (`test_us0143_*`) + standalone npm **118/118** qa attestation. Queue row S0151 → `released`. No backlog mutation (closure owns OPEN→DONE). No npm / GitHub publish.

Gate-1: live scoped pytest @ release + US-0071 metadata exit 0. **`harness_fail_zero_claimed=false`**.

## Summary

US-0143 ships in-place delivery routing inside `@its-magic/runtime-core` (A1 / R-0141 / DEC-0143):

- Lifted deferred `/auto`/`/quick` → `RouteScheduled` (not 7-step for scheduler commands).
- Nested `DeliveryRouter`; five independent axes; compressed `ultra_lean` / `mega_quick` graphs.
- `WorkflowEngine.runAuto` / `runQuick` own drain loop; stop-matrix YAML consume; AC-6 terminals non-relaxable.
- TS L8 `resolveDeliveryRoute` + golden vectors; dual-write audit + repair JSONL.
- Exactly 12 `test_us0143_*`; compose us0133..us0142 green (118/118 npm attestation).

FRAMEWORK_KIT_REPO=1 — UAT `contract_tests_primary`; 6 live-runtime classes `UAT_PROBE_FORBIDDEN`. **No live Chrome.** `live_chrome_probed=false`.

## ACs satisfied (QA + verify-work, UAT 9/9)

**8/8 PASS** (live pytest 12/12 @ release):

| AC | Status |
|----|--------|
| AC-1 | PASS — RouteScheduled `/auto`/`/quick` + drain |
| AC-2 | PASS — compressed graphs + axis independence |
| AC-3 | PASS — L8 precedence + conflict codes |
| AC-4 | PASS — preset expand + YAML stop matrix |
| AC-5 | PASS — drain caps + operator authority |
| AC-6 | PASS — non-relaxable terminals under `full` |
| AC-7 | PASS — audit + JSONL + mid-resume |
| AC-8 | PASS — 12 markers incl. autonomy disabled |

## Test results (release — live this pass)

- **Kit python contract**: `python -m pytest tests/us0143_contract_test.py -q` → **12 passed** in 0.07s.
- **Standalone contract + unit**: `cd standalone && npm test` → **118/118** qa attestation (2026-09-14T08:10:00Z; not re-run this pass).
- **Metadata guard**: `python scripts/check-user-visible-metadata.py --repo .` → exit 0.
- **Canonical harness**: not re-run; `harness_fail_zero_claimed=false`.

## Gate summary

| Gate | Result |
|------|--------|
| check_in_tests | **PASS** (scoped pytest 12/12 + US-0071 metadata; npm 118/118 attestation) |
| qa | PASS (`sprints/S0151/qa-findings.md`; 0 blockers) |
| verify_work | PASS (`sprints/S0151/uat.json` 8/8 ACs; 9/9 UAT; verify-work pytest live) |
| uat | PASS (9/9; `contract_tests_primary`; live Chrome `UAT_PROBE_FORBIDDEN`) |
| isolation_evidence | PASS (execute+qa+verify-work+sovereign-critic(verify-work); distinct markers) |
| strict_runtime_proof | **PASS** (verify-work `rp-auto-20260913-us0143-verify-work-qa-20260914T083000Z-US-0143` / `297208B8063764DDD9013F8F620EC3382773ED180B70D3D235DA843482CD0110` consumed @08:50:00Z before TTL 09:30:00Z; critic vw `0FEA31EDAE4B4F12E87EE937276B0A1958DBC3A8D12AC02240C793F2396C4269` MATCH) |
| readme_feature_coverage_3f | FAIL_nonblocking (gaps BUG-0021, BUG-0023, US-0135..US-0142 — precedent S0150) |
| project_readme_3g | skipped (`FRAMEWORK_KIT_REPO=1`) |
| publish | skipped (`RELEASE_PUBLISH_MODE=confirm`; no operator confirm) |
| sync | not_eligible (`SYNC_POLICY_MODE=disabled`) |
| finalization | **PASS** (queue S0151 = `released`) |

## Run

```powershell
python -m pytest tests/us0143_contract_test.py -q
# Expected: 12 passed (12/12 test_us0143_*)

cd standalone; npm test
# Expected: 118 passed (compose us0133..us0142 + 12/12 test_us0143_*)

python scripts/check-user-visible-metadata.py --repo .
# Expected: exit 0
```

- **start_command**: `python -m pytest tests/us0143_contract_test.py -q`
- **runtime_mode**: `local`
- **runtime_context_ref**: `docs/engineering/architecture.md` `# US-0143`; `decisions/DEC-0143.md`

## Connect

- **service_url**: `n/a` (unpublished runtime-core contract-test kit; no HTTP service)
- **service_port**: `n/a`
- **health_endpoint**: `n/a`

## Verify

1. Run scoped pytest → 12/12 `test_us0143_*` PASS.
2. Run `cd standalone && npm test` → 118/118 (or re-attest qa timestamp).
3. Run metadata guard → exit 0.
4. Confirm `DEFERRED_COMMANDS=[]`, `SCHEDULER_COMMANDS` includes `/auto` and `/quick` (contract tests).
5. Confirm UAT honesty: `probe_kind=contract_tests_primary`; `live_chrome_probed=false`.

- **expected_health_signal**: pytest 12 passed; metadata script silent exit 0.

## Credentials

- No inline secrets. Kit denies `.env` reads (US-0085). No API tokens required for contract verification.

## Known Issues

- README feature coverage gaps (3f) remain non-blocking for OPEN story release.
- Full `tests/run-tests.ps1` harness not claimed (`harness_fail_zero_claimed=false`).
- US-0143 backlog status remains **OPEN** until `/closure`.

## Evidence refs

- `sprints/S0151/release-findings.md`
- `sprints/S0151/qa-findings.md`
- `sprints/S0151/uat.json` / `uat.md`
- `sprints/S0151/summary.md`
- `handoffs/release_queue.md` (S0151 row)

## Next

Orchestrator **sovereign-critic of release** then **`/closure`** (fresh **qe**). Release STOP — do not spawn closure from this subagent.
