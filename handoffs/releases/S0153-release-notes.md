# Release Notes — S0153 / US-0146

- **Sprint**: `S0153`
- **Story**: `US-0146` — CLI, TUI, and operational observability (`runtime-core/src/operator/` facades; `@its-magic/cli` + `@its-magic/tui` thin clients; nine `test_us0146_*`)
- **Release date**: `2026-09-17T20:00:00Z` (UTC)
- **orchestrator_run_id**: `auto-20260917-us0146`
- **delivery_mode**: `ultra_lean`
- **macro_phase**: `ship` (release → `/closure` per CROSS_MODEL_REVIEW=0 native chain)
- **policy_mode**: `confirm` (`RELEASE_PUBLISH_MODE=confirm`; operator confirm absent this turn → publish skipped)
- **trigger_source**: `auto`
- **branch**: `local` (no push; `SYNC_POLICY_MODE=disabled`)
- **fresh_context_marker**: `rel-US0146-release-20260917T200000Z-fresh`
- **model_id**: `inherit` (CROSS_MODEL_REVIEW=0)
- **runtime_proof_id**: `rp-auto-20260917-us0146-release-release-20260917T200000Z-US-0146`
- **proof_hash**: `075034FFB7D65AF24C336154875B110ACF7C97992652A1050D59E038113BF85B`
- **proof_ttl**: `2026-09-17T21:00:00Z` (UTC)
- **release_version**: (none — workflow-only release)

## Verdict

**RELEASE_PASS.** Mandatory release gates (1, 2, 3, 4, 4b) green with **scoped node:test 9/9** (`test_us0146_*`) + standalone npm **140/140** qa attestation. Queue row S0153 → `released`. No backlog mutation (closure owns OPEN→DONE). No npm / GitHub publish.

Gate-1: live scoped contract @ release + US-0071 metadata exit 0. **`harness_fail_zero_claimed=false`**.

## Summary

US-0146 ships operator surfaces for the standalone kit (A1 / R-0143 / DEC-0146):

- `OperatorCommandFacade`, `OperatorObservabilityService`, `OperatorPrompts`, `OperatorSession`, bounded log (200 lines / 32 KiB).
- CLI argv + lifecycle delegation; auth/models isolated to existing dispatch.
- TUI readline + ANSI panels; client-only (no workflow ownership).
- Exactly nine `test_us0146_*`; compose us0133..us0145 + us0146 green (140/140 npm attestation).

FRAMEWORK_KIT_REPO=1 — UAT `contract_tests_primary`; 6 live-runtime classes `UAT_PROBE_FORBIDDEN`. **No live Chrome.** `live_chrome_probed=false`.

## ACs satisfied (QA + verify-work, UAT 9/9)

**8/8 PASS** (live scoped node:test 9/9 @ release):

| AC | Status |
|----|--------|
| AC-1 | PASS — command parity + lifecycle |
| AC-2 | PASS — status snapshot compose read-only |
| AC-3 | PASS — run timeline + evidence links |
| AC-4 | PASS — TUI panels client-only |
| AC-5 | PASS — metrics/token-cost compose |
| AC-6 | PASS — approval prompts interactive/non-interactive |
| AC-7 | PASS — bounded log summary + evidence ref |
| AC-8 | PASS — nine markers + Pi boundary |

## Test results (release — live this pass)

- **Scoped standalone contract**: `cd standalone && node --experimental-strip-types --test tests/contract/us0146.contract.test.ts` → **10 passed** fail 0 duration_ms 268.6905 (9/9 `test_us0146_*`).
- **Standalone contract + unit**: `cd standalone && npm test` → **140/140** qa attestation (2026-09-17T19:30:00Z; not re-run this pass).
- **Metadata guard**: `python scripts/check-user-visible-metadata.py --repo .` → exit 0.
- **Canonical harness**: not re-run; `harness_fail_zero_claimed=false`.

## Gate summary

| Gate | Result |
|------|--------|
| check_in_tests | **PASS** (scoped node:test 9/9 + US-0071 metadata; npm 140/140 attestation) |
| qa | PASS (`sprints/S0153/qa-findings.md`; 0 blockers) |
| verify_work | PASS (`sprints/S0153/uat.json` 8/8 ACs; 9/9 UAT; verify-work scoped 9/9) |
| uat | PASS (9/9; `contract_tests_primary`; live Chrome `UAT_PROBE_FORBIDDEN`) |
| isolation_evidence | PASS (execute+qa+verify-work; distinct markers; CROSS_MODEL_REVIEW=0) |
| strict_runtime_proof | **PASS** (verify-work `rp-auto-20260917-us0146-verify-work-qa-20260917T194500Z-US-0146` / `A8E9B2BB6112D320D836847606CF3E8CA473196327C6DB8F929A404CC63F2C97` consumed @20:00:00Z before TTL 20:45:00Z; qa+execute MATCH) |
| readme_feature_coverage_3f | FAIL_nonblocking (gaps BUG-0021, BUG-0023, US-0135..US-0144 — precedent S0152) |
| project_readme_3g | skipped (`FRAMEWORK_KIT_REPO=1`) |
| publish | skipped (`RELEASE_PUBLISH_MODE=confirm`; no operator confirm) |
| sync | not_eligible (`SYNC_POLICY_MODE=disabled`) |
| finalization | **PASS** (queue S0153 = `released`) |

## Run

```powershell
cd standalone; node --experimental-strip-types --test tests/contract/us0146.contract.test.ts
# Expected: 10 passed (9/9 test_us0146_*)

cd standalone; npm test
# Expected: 140 passed (compose + 9/9 test_us0146_*)

python scripts/check-user-visible-metadata.py --repo .
# Expected: exit 0
```

- **start_command**: `cd standalone && node --experimental-strip-types --test tests/contract/us0146.contract.test.ts`
- **runtime_mode**: `local`
- **runtime_context_ref**: `docs/engineering/architecture.md` `# US-0146`; `decisions/DEC-0146.md`; `docs/engineering/runtime-connectivity.md`

## Connect

- **service_url**: `n/a` (unpublished operator kit; no HTTP service)
- **service_port**: `n/a`
- **health_endpoint**: `n/a`

## Verify

1. Run scoped node:test → 9/9 `test_us0146_*` PASS.
2. Run `cd standalone && npm test` → 140/140 (or re-attest qa timestamp).
3. Run metadata guard → exit 0.
4. Confirm CLI auth/models Pi boundary; TUI does not own workflow.
5. Confirm UAT honesty: `probe_kind=contract_tests_primary`; `live_chrome_probed=false`.

- **expected_health_signal**: node:test 9/9 markers passed; metadata script silent exit 0.

## Credentials

- No inline secrets. Kit denies `.env` reads (US-0085). No API tokens required for contract verification.
- Env-ref only if publish later enabled: see `docs/engineering/release-targets.json` (`*Env` fields).

## Known Issues

- README feature coverage gaps (3f) remain non-blocking for OPEN story release.
- Full `tests/run-tests.ps1` harness not claimed (`harness_fail_zero_claimed=false`).
- US-0146 backlog status remains **OPEN** until `/closure`.
- Publish pending operator confirm (`RELEASE_PUBLISH_MODE=confirm`).

## Evidence refs

- `sprints/S0153/release-findings.md`
- `sprints/S0153/qa-findings.md`
- `sprints/S0153/uat.json`
- `sprints/S0153/uat.md`
- `sprints/S0153/summary.md`
- `sprints/S0153/verify-work-verdict.json`
- `handoffs/release_queue.md`
- `docs/engineering/state.md`
