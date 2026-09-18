# Release Notes — S0152 / US-0144

- **Sprint**: `S0152`
- **Story**: `US-0144` — Sovereign memory, reviews, and convergence (`@its-magic/runtime-core` nested `SovereignRuntime`; closed 9-op `KernelBridge.runSovereignOperation`; `scripts/sovereign_runtime_bridge.py`; `SOVEREIGN_RUNTIME=0` default-off; US-0143 GateEngine compose-only; 12 `test_us0144_*`)
- **Release date**: `2026-09-15T21:23:19Z` (UTC)
- **orchestrator_run_id**: `auto-20260913-us0144`
- **delivery_mode**: `ultra_lean`
- **macro_phase**: `ship` (release → `/closure` per CROSS_MODEL_REVIEW=0 native chain)
- **policy_mode**: `confirm` (`RELEASE_PUBLISH_MODE=confirm`; operator confirm absent this turn → publish skipped)
- **trigger_source**: `auto`
- **branch**: `local` (no push; `SYNC_POLICY_MODE=disabled`)
- **fresh_context_marker**: `rel-US0144-release-20260915T212319Z-fresh`
- **model_id**: `inherit` (CROSS_MODEL_REVIEW=0)
- **runtime_proof_id**: `rp-auto-20260913-us0144-release-release-20260915T212319Z-US-0144`
- **proof_hash**: `98C39A3FD6D9B17794CC76D5D079E4FEA63C3235E29C0BEEFD37C3849D83E6B5`
- **proof_ttl**: `2026-09-15T22:23:19Z` (UTC)
- **release_version**: (none — workflow-only release)

## Verdict

**RELEASE_PASS.** Mandatory release gates (1, 2, 3, 4, 4b) green with **scoped node:test 12/12** (`test_us0144_*`) + standalone npm **130/130** qa attestation. Queue row S0152 → `released`. No backlog mutation (closure owns OPEN→DONE). No npm / GitHub publish.

Gate-1: live scoped contract @ release + US-0071 metadata exit 0. **`harness_fail_zero_claimed=false`**.

## Summary

US-0144 ships in-place sovereign runtime inside `@its-magic/runtime-core` (A1 / R-0142 / DEC-0144):

- Nested `SovereignRuntime` with closed 9-op KernelBridge admission + Python bridge dispatcher.
- Repository-owned bounded memory digest; supplementary Challenger/Architect/Subtractor reviews.
- Critic model pin + degraded same-model semantics; deferral drain preserves operator gates.
- Evidence-based convergence (blocking-only); smoke never claims fake browser PASS; caps/progress visible.
- Exactly 12 `test_us0144_*`; compose us0133..us0143 green (130/130 npm attestation).
- `SOVEREIGN_RUNTIME=0` default-off; kit `files` omit `standalone/`.

FRAMEWORK_KIT_REPO=1 — UAT `contract_tests_primary`; 6 live-runtime classes `UAT_PROBE_FORBIDDEN`. **No live Chrome.** `live_chrome_probed=false`.

## ACs satisfied (QA + verify-work, UAT 9/9)

**8/8 PASS** (live scoped node:test 12/12 @ release):

| AC | Status |
|----|--------|
| AC-1 | PASS — decision ledger + plan fidelity |
| AC-2 | PASS — bounded memory digest / Q00 |
| AC-3 | PASS — supplementary role reviews |
| AC-4 | PASS — critic pin + degraded / Q11 |
| AC-5 | PASS — deferral + drain operator gates |
| AC-6 | PASS — blocking-only convergence + smoke truth |
| AC-7 | PASS — caps/progress/partial + US-0143 boundaries |
| AC-8 | PASS — 12 markers + default-off |

## Test results (release — live this pass)

- **Scoped standalone contract**: `cd standalone && node --experimental-strip-types --test tests/contract/us0144.contract.test.ts` → **12 passed** fail 0 duration_ms 1015.7239.
- **Standalone contract + unit**: `cd standalone && npm test` → **130/130** qa attestation (2026-09-15T21:00:53Z; not re-run this pass).
- **Metadata guard**: `python scripts/check-user-visible-metadata.py --repo .` → exit 0.
- **Canonical harness**: not re-run; `harness_fail_zero_claimed=false`.

## Gate summary

| Gate | Result |
|------|--------|
| check_in_tests | **PASS** (scoped node:test 12/12 + US-0071 metadata; npm 130/130 attestation) |
| qa | PASS (`sprints/S0152/qa-findings.md`; 0 blockers) |
| verify_work | PASS (`sprints/S0152/uat.json` 8/8 ACs; 9/9 UAT; verify-work scoped 12/12) |
| uat | PASS (9/9; `contract_tests_primary`; live Chrome `UAT_PROBE_FORBIDDEN`) |
| isolation_evidence | PASS (execute+qa+verify-work; distinct markers; CROSS_MODEL_REVIEW=0) |
| strict_runtime_proof | **PASS** (verify-work `rp-auto-20260913-us0144-verify-work-qa-20260915T210715Z-US-0144` / `61E4026FF127F64499AED99769B88B0F855DE4FB6B7ED5E100319F0D70E49B8C` consumed @21:23:19Z before TTL 22:07:15Z; qa+execute MATCH) |
| readme_feature_coverage_3f | FAIL_nonblocking (gaps BUG-0021, BUG-0023, US-0135..US-0143 — precedent S0151) |
| project_readme_3g | skipped (`FRAMEWORK_KIT_REPO=1`) |
| publish | skipped (`RELEASE_PUBLISH_MODE=confirm`; no operator confirm) |
| sync | not_eligible (`SYNC_POLICY_MODE=disabled`) |
| finalization | **PASS** (queue S0152 = `released`) |

## Run

```powershell
cd standalone; node --experimental-strip-types --test tests/contract/us0144.contract.test.ts
# Expected: 12 passed (12/12 test_us0144_*)

cd standalone; npm test
# Expected: 130 passed (compose us0133..us0143 + 12/12 test_us0144_*)

python scripts/check-user-visible-metadata.py --repo .
# Expected: exit 0
```

- **start_command**: `cd standalone && node --experimental-strip-types --test tests/contract/us0144.contract.test.ts`
- **runtime_mode**: `local`
- **runtime_context_ref**: `docs/engineering/architecture.md` `# US-0144`; `decisions/DEC-0144.md`; `docs/engineering/runtime-connectivity.md`

## Connect

- **service_url**: `n/a` (unpublished runtime-core contract-test kit; no HTTP service)
- **service_port**: `n/a`
- **health_endpoint**: `n/a`

## Verify

1. Run scoped node:test → 12/12 `test_us0144_*` PASS.
2. Run `cd standalone && npm test` → 130/130 (or re-attest qa timestamp).
3. Run metadata guard → exit 0.
4. Confirm `lookupSovereignRuntime` defaults `"0"`; GateEngine `RELEASE_GATE_ORDER` unamended.
5. Confirm UAT honesty: `probe_kind=contract_tests_primary`; `live_chrome_probed=false`.

- **expected_health_signal**: node:test 12 passed; metadata script silent exit 0.

## Credentials

- No inline secrets. Kit denies `.env` reads (US-0085). No API tokens required for contract verification.
- Env-ref only if publish later enabled: see `docs/engineering/release-targets.json` (`*Env` fields).

## Known Issues

- README feature coverage gaps (3f) remain non-blocking for OPEN story release.
- Full `tests/run-tests.ps1` harness not claimed (`harness_fail_zero_claimed=false`).
- US-0144 backlog status remains **OPEN** until `/closure`.
- Publish pending operator confirm (`RELEASE_PUBLISH_MODE=confirm`).

## Evidence refs

- `sprints/S0152/release-findings.md`
- `sprints/S0152/qa-findings.md`
- `sprints/S0152/uat.json`
- `sprints/S0152/uat.md`
- `sprints/S0152/summary.md`
- `sprints/S0152/verify-work-verdict.json`
- `handoffs/release_queue.md`
- `docs/engineering/state.md`
