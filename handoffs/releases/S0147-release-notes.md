# Release Notes — S0147 / US-0140

- **Sprint**: `S0147`
- **Story**: `US-0140` — Canonical lifecycle and gate orchestrator (`@its-magic/runtime-core` no Pi; nested CommandRouter 7-step + typed phase graph + nested GateEngine `RELEASE_*`; closure-exclusive DONE; `node:sqlite` RunsStore; crash resume `discardOrphans` + fresh role; `/auto`/`/quick` `WORKFLOW_ROUTE_DEFERRED`; 12 `test_us0140_*`)
- **Release date**: `2026-09-13T22:35:00Z` (UTC)
- **orchestrator_run_id**: `auto-20260913-us0140`
- **delivery_mode**: `ultra_lean`
- **macro_phase**: `ship` (release is phase 1 of 3: release → sovereign-critic (release) → closure per native chain)
- **policy_mode**: `confirm` (`RELEASE_PUBLISH_MODE=confirm`; `RELEASE_PUBLISH_AUTO_CONFIRM=0` → no publish execution)
- **trigger_source**: `auto`
- **branch**: `local` (no push; `SYNC_POLICY_MODE=disabled` per DEC-0018)
- **fresh_context_marker**: `rel-US0140-release-20260913T223500Z-fresh`
- **model_id**: `composer-2.5-fast` (CROSS_MODEL_REVIEW=1 — required)
- **runtime_proof_id**: `rp-auto-20260913-us0140-release-release-20260913T223500Z-US-0140`
- **proof_hash**: `0ffe998df10ffdcb2a9ad0ee04a4450899b171f21b2fff171158cbb98a6fe703`
- **proof_ttl**: `2026-09-13T23:35:00Z` (UTC)
- **release_version**: (none — workflow-only release; no semver bump)

## Verdict

**RELEASE_PASS.** All mandatory release gates (1, 2, 3, 4, 4b) green with **scoped standalone npm test 82/82** (12/12 `test_us0140_*`). Queue row S0147 → `released`. No backlog mutation (closure owns OPEN→DONE + acceptance tick per US-0120 / DEC-0082 / AC-5). No npm / GitHub / Homebrew / Chocolatey publish.

Gate-1 evidence: live scoped slice + US-0071 metadata. **`harness_fail_zero_claimed=false`** — full `tests/run-tests.ps1` was not re-run this pass.

## Summary

US-0140 ships standalone `@its-magic/runtime-core` (approach A1 / R-0135 / DEC-0140):

- Nested `workflow/` CommandRouter 7-step + typed phase graph + ultra_lean plan-verify skip edge.
- `PROGRAMMATIC_COMMANDS` 16 names; `/auto`/`/quick` fail-closed `WORKFLOW_ROUTE_DEFERRED`.
- Bounded execute↔QA via `WORKFLOW_LOOP_CAP`; critics/security supplement, not substitute.
- Nested GateEngine ordered `RELEASE_*`; release-evidence envelope; closure exclusive DONE (`marked_done=false`).
- `node:sqlite` RunsStore; gitignored `**/.its-magic/runtime/`; `RECOVERY_FALSE_COMPLETION`.
- Crash resume `discardOrphans` + fresh role; `RESUME_BRIEF_STALE`.
- Exactly 12 `test_us0140_*`; compose us0133–us0139 green.

FRAMEWORK_KIT_REPO=1 — UAT probe class `contract_tests_primary`; 6 live-runtime classes waived `UAT_PROBE_FORBIDDEN`. No fake browser PASS. No live paid provider CI.

## ACs satisfied (QA + verify-work, UAT 9/9)

**8/8 PASS** (live npm 12/12):

| AC | Description | Status |
|----|-------------|--------|
| AC-1 | Programmatic commands + `/auto`/`/quick` deferred | PASS |
| AC-2 | Typed phase graph + 7-step router + spawn inject | PASS |
| AC-3 | Bounded execute↔QA; critics/security supplement | PASS |
| AC-4 | Release gate order `RELEASE_*` | PASS |
| AC-5 | Release ≠ closure; premature closure blocked | PASS |
| AC-6 | SQLite operational-only; repo canonical | PASS |
| AC-7 | Crash resume discardOrphans + fresh role | PASS |
| AC-8 | E2E lifecycle + validator/QA/UAT fail paths | PASS |

## Test results (release — live this pass)

- **Standalone contract + unit**: `cd standalone && npm test` → **82 passed** in 2.878s (**12/12** `test_us0140_*` + us0133 + us0134 + us0135 + us0136 + us0137 + us0138 + us0139 + unit).
- **Metadata guard**: `python scripts/check-user-visible-metadata.py --repo .` → exit 0.
- **Canonical harness**: **not re-run**; `harness_fail_zero_claimed=false`.

## Gate summary

| Gate | Result |
|------|--------|
| check_in_tests | **PASS** (scoped npm 82/82 + US-0071 metadata; `harness_fail_zero_claimed=false`) |
| qa | PASS (`sprints/S0147/qa-findings.md`; 0 blockers; NB1..NB3 informational) |
| verify_work | PASS (`sprints/S0147/uat.json` verdict=PASS; 8/8 ACs; 9/9 UAT incl `convergence_smoke`; live npm) |
| uat | PASS (9/9; populated; `contract_tests_primary`; 6 live-runtime classes `UAT_PROBE_FORBIDDEN`) |
| isolation_evidence | PASS (execute+qa+verify-work+sovereign-critic(verify-work)+release; distinct markers; `model_id` set) |
| strict_runtime_proof | **PASS** (verify-work `rp-auto-20260913-us0140-verify-work-qa-20260913T221500Z-US-0140` TTL `2026-09-13T23:15:00Z` consumed @ `22:35:00Z`; proof_hash recomputed MATCH `E5E018858C83EB378D9AA4360795D652D1ED240F39377A4CC064A1D574E2CE02`; critic of verify-work PASS `62624FA92075ABC868CB445487B8FCFE619A1DDB7EEC8D18A98C0AEA9C681E60`) |
| readme_feature_coverage_3f | skipped (`README_FEATURE_COVERAGE_ENFORCE=0`) |
| project_readme_3g | skipped (`FRAMEWORK_KIT_REPO=1`) |
| metadata_guard | PASS |
| triad_regression | skipped (no state rollover required this pass) |
| backlog_reconciliation | not performed (closure owns per US-0120 / DEC-0082) |
| publish | skipped (`RELEASE_PUBLISH_MODE=confirm`; `RELEASE_PUBLISH_AUTO_CONFIRM=0`) |
| sync | not_eligible (`SYNC_POLICY_MODE=disabled`) |
| finalization | **PASS** (queue row S0147 = `released`) |

## Run

```powershell
# US-0140 contract (12/12) + US-0139/US-0138/US-0137/US-0136/US-0135/US-0134/US-0133 compose:
cd standalone; npm test
#   Expected: 82 passed (12/12 test_us0140_* + us0133 + us0134 + us0135 + us0136 + us0137 + us0138 + us0139 + unit)

python scripts/check-user-visible-metadata.py --repo .
#   Expected: exit 0 (silent PASS)
```

Start command for the shipped pack (lifecycle/workflow-engine contract-test kit — not a long-running HTTP service):

```bash
cd standalone && npm test
```

- **start_command**: `cd standalone && npm test` (operator validation; contract-test kit)
- **runtime_mode**: `local`
- **runtime_context_ref**: `docs/engineering/architecture.md` `# US-0140`; `decisions/DEC-0140.md`; `docs/engineering/runtime-connectivity.md` (local kit — no remote service)

## Connect

- **service_url**: `n/a` (unpublished standalone `@its-magic/runtime-core` workflow-engine contract-test kit — no service endpoint)
- **service_port**: `n/a`
- **health_endpoint**: `n/a` (health = contract tests, not HTTP)

## Verify

1. `cd standalone && npm test` → 82 passed (12/12 `test_us0140_*`)
2. `python scripts/check-user-visible-metadata.py --repo .` → exit 0
3. Spot-check: `standalone/packages/runtime-core` has no Pi imports; kit `files` omit `standalone/`; `/auto`/`/quick` → `WORKFLOW_ROUTE_DEFERRED`; `**/.its-magic/runtime/` gitignored
4. Operators: nested GateEngine `RELEASE_*` order; `writeReleaseEvidence` `marked_done=false`; `CLOSURE_RELEASE_EVIDENCE_MISSING` on premature closure

**expected_health_signal**: all 12 `test_us0140_*` markers PASS; us0133–us0139 compose green; metadata guard exit 0; backlog US-0140 remains OPEN until `/closure`.

## Credentials

- **credential_source_refs**: `n/a` (no API keys required for contract-test verify; fake-model CI default)
- **expected_value_source**: operator local kit checkout; no inline secrets

## Known Issues

None blocking.

- **NB-1** (informational): verify-work + qa proofs MATCH; 12/12 independently re-verified; `WORKFLOW_ROUTE_DEFERRED`; spawn-only; release≠closure; SQLite non-authority; UAT_PROBE_FORBIDDEN honest; no fake browser PASS.
- **NB-2** (informational): nested runtime-core workflow/runs/recovery; KernelBridge consume-only; US-0143 `/auto` drain OUT; verify-work re-attested DEC-0009.
- **NB-3** (informational): Do not mark US-0140 DONE at release; do not tick acceptance; do not reopen US-0139/US-0138/US-0137/US-0136/US-0135/BUG-0020; no US-0141+; harness Fail:0 not claimed.

## Next

**sovereign-critic (release)** then **`/closure`** (fresh **qe** subagent). Release does **not** spawn sovereign-critic or closure.
