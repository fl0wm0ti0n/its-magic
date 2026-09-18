# Release Notes — S0156 / US-0148

- **Sprint**: `S0156`
- **Story**: `US-0148` — Stable control protocol and recoverable daemon (`@its-magic/protocol`; `apps/daemon`; `DaemonTransport`; twelve `test_us0148_*`)
- **Release date**: `2026-09-17T23:00:00Z` (UTC)
- **orchestrator_run_id**: `auto-20260917-us0148`
- **delivery_mode**: `ultra_lean`
- **macro_phase**: `ship` (release → `/closure` per CROSS_MODEL_REVIEW=0 native chain)
- **policy_mode**: `confirm` (`RELEASE_PUBLISH_MODE=confirm`; operator confirm absent this turn → publish skipped)
- **trigger_source**: `auto`
- **branch**: `local` (no push; `SYNC_POLICY_MODE=disabled`)
- **fresh_context_marker**: `rel-US0148-release-20260917T230000Z-fresh`
- **model_id**: `inherit` (CROSS_MODEL_REVIEW=0)
- **runtime_proof_id**: `rp-auto-20260917-us0148-release-release-20260917T230000Z-US-0148`
- **proof_hash**: `F64BAEC98392A3A814ABE2902FF6C85EE86DF7FCF8BD6FEA3450CC56FF5219E6`
- **proof_ttl**: `2026-09-18T00:00:00Z` (UTC)
- **release_version**: (none — workflow-only release)

## Verdict

**RELEASE_PASS.** Mandatory release gates (1, 2, 3, 4, 4b) green with **scoped node:test 14/14** (12/12 locked `test_us0148_*`) + standalone npm **167/167** qa attestation. Queue row S0156 → `released`. No backlog mutation (closure owns OPEN→DONE). No npm / GitHub publish.

Gate-1: live scoped contract @ release + US-0071 metadata exit 0. **`harness_fail_zero_claimed=false`**.

## Summary

US-0148 ships versioned local control protocol and a thin recoverable daemon (A1 / R-0148 / DEC-0148):

- `@its-magic/protocol` schema unions + redaction; loopback JSON-RPC/WebSocket with bearer + controller/observer roles.
- `apps/daemon` delegates to runtime-core; per-run SQLite event log with WS replay and backpressure summary mode.
- `DaemonTransport` + CLI/TUI default daemon attach; `InProcessTransport` retained for US-0146 doubles.
- Startup `crashResume` + `reconcileOperationalLedger`; operator doc `docs/engineering/operator/daemon-protocol.md`.
- Twelve locked `test_us0148_*`; compose US-0146 held (167/167 npm attestation).

FRAMEWORK_KIT_REPO=1 — UAT `contract_tests_primary`; 6 live-runtime classes `UAT_PROBE_FORBIDDEN`. **No live Chrome / no live publish.** `live_chrome_probed=false`.

## ACs satisfied (QA + verify-work, UAT 9/9)

**8/8 PASS** (live scoped node:test 14/14 @ release):

| AC | Status |
|----|--------|
| AC-1 | PASS — versioned schemas + redact |
| AC-2 | PASS — thin daemon delegates to runtime |
| AC-3 | PASS — attach/stream/reconnect + replay |
| AC-4 | PASS — loopback bind, bearer, roles |
| AC-5 | PASS — fail-closed negotiation |
| AC-6 | PASS — restart reconcile + fresh sessions |
| AC-7 | PASS — operator doc + daemon-protocol.md |
| AC-8 | PASS — twelve locked contract markers |

## Test results (release — live this pass)

- **Scoped standalone contract**: `cd standalone && node --experimental-strip-types --test tests/contract/us0148.contract.test.ts` → **14 passed** fail 0 duration_ms 1189.5198 (12/12 `test_us0148_*`).
- **Standalone contract + unit**: `cd standalone && npm test` → **167/167** qa attestation (2026-09-17T22:25:00Z; not re-run this pass).
- **Metadata guard**: `python scripts/check-user-visible-metadata.py --repo .` → exit 0.
- **Canonical harness**: not re-run; `harness_fail_zero_claimed=false`.

## Gate summary

| Gate | Result |
|------|--------|
| check_in_tests | **PASS** (scoped node:test 14/14 + US-0071 metadata; npm 167/167 attestation) |
| qa | PASS (`sprints/S0156/qa-findings.md`; 0 blockers) |
| verify_work | PASS (`sprints/S0156/uat.json` 8/8 ACs; 9/9 UAT; verify-work scoped 14/14) |
| uat | PASS (9/9; `contract_tests_primary`; live Chrome `UAT_PROBE_FORBIDDEN`) |
| isolation_evidence | PASS (execute+qa+verify-work+release; distinct markers; CROSS_MODEL_REVIEW=0) |
| strict_runtime_proof | **PASS** (verify-work `rp-auto-20260917-us0148-verify-work-qa-20260917T223000Z-US-0148` / `3CBE82E5A0ED983A1031BF24BC2FD4E0BB41E1C3B21C9D3EBB93C73E61C94A6D` consumed @23:00:00Z before TTL 23:30:00Z; qa+execute MATCH) |
| readme_feature_coverage_3f | FAIL_nonblocking (gaps BUG-0021, BUG-0023, US-0135..US-0147 — precedent S0155) |
| project_readme_3g | skipped (`FRAMEWORK_KIT_REPO=1`) |
| publish | skipped (`RELEASE_PUBLISH_MODE=confirm`; no operator confirm) |
| sync | not_eligible (`SYNC_POLICY_MODE=disabled`) |
| finalization | **PASS** (queue S0156 = `released`) |

## Run

```powershell
cd standalone; node --experimental-strip-types --test tests/contract/us0148.contract.test.ts
# Expected: 14 passed (12/12 test_us0148_*)

cd standalone; npm test
# Expected: 167 passed (compose + 12/12 test_us0148_*)

python scripts/check-user-visible-metadata.py --repo .
# Expected: exit 0
```

- **start_command**: `cd standalone && node --experimental-strip-types --test tests/contract/us0148.contract.test.ts`
- **runtime_mode**: `local`
- **runtime_context_ref**: `docs/engineering/architecture.md` `# US-0148`; `decisions/DEC-0148.md`; `docs/engineering/operator/daemon-protocol.md`

## Connect

- **service_url**: `http://127.0.0.1:<port>/v1` (loopback daemon; contract tests use ephemeral ports)
- **service_port**: ephemeral (tests); operator default documented in daemon-protocol.md
- **health_endpoint**: JSON-RPC health / attach per daemon-protocol.md

## Verify

1. Run scoped `us0148.contract.test.ts` → 14/14 (12/12 locked markers) PASS.
2. Run `cd standalone && npm test` → 167/167 (or re-attest qa timestamp).
3. Run metadata guard → exit 0.
4. Spot-check `standalone/apps/daemon` and `docs/engineering/operator/daemon-protocol.md`.
5. Confirm UAT honesty: `probe_kind=contract_tests_primary`; `live_chrome_probed=false`; no fake live daemon bind PASS.

- **expected_health_signal**: node:test 14/14 markers passed; metadata script silent exit 0.

## Credentials

- No inline secrets. Kit denies `.env` reads (US-0085). Bearer token is local daemon-scoped per operator doc.
- No API tokens required for contract verification.

## Known Issues

- README feature coverage gaps (3f) remain non-blocking for OPEN story release.
- Full `tests/run-tests.ps1` harness not claimed (`harness_fail_zero_claimed=false`).
- US-0148 backlog status remains **OPEN** until `/closure`.
- Publish pending operator confirm (`RELEASE_PUBLISH_MODE=confirm`).

## Evidence refs

- `sprints/S0156/release-findings.md`
- `sprints/S0156/qa-findings.md`
- `sprints/S0156/verify-work-verdict.json`
- `sprints/S0156/uat.json`
- `handoffs/release_queue.md` (S0156 row)
