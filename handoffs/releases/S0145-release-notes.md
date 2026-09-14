# Release Notes — S0145 / US-0139

- **Sprint**: `S0145`
- **Story**: `US-0139` — Persistent code intelligence and bounded context engine (`@its-magic/code-intelligence` + `@its-magic/context-engine` no Pi; nested AFT read sidecar; `LIVE_INTEL_TOOLS` unstub; `code_context` + TOKEN_PROFILE caps; assembler exclusion; pack envelope hash ≠ DEC-0038; compose `materialize_codebase_map.py`; benchmark; partial-pack `INTEL_*`/`CONTEXT_*`; 12 `test_us0139_*`)
- **Release date**: `2026-09-13T19:15:00Z` (UTC)
- **orchestrator_run_id**: `auto-20260913-us0139`
- **delivery_mode**: `ultra_lean`
- **macro_phase**: `ship` (release is phase 1 of 3: release → sovereign-critic (release) → closure per native chain)
- **policy_mode**: `confirm` (`RELEASE_PUBLISH_MODE=confirm`; `RELEASE_PUBLISH_AUTO_CONFIRM=0` → no publish execution)
- **trigger_source**: `auto`
- **branch**: `local` (no push; `SYNC_POLICY_MODE=disabled` per DEC-0018)
- **fresh_context_marker**: `rel-US0139-release-20260913T191500Z-fresh`
- **model_id**: `composer-2.5-fast` (CROSS_MODEL_REVIEW=1 — required)
- **runtime_proof_id**: `rp-auto-20260913-us0139-release-release-20260913T191500Z-US-0139`
- **proof_hash**: `39F198D01A2C6E570B25DBE476ECCE6DF951F66D14209618B973079DB6BDF756`
- **proof_ttl**: `2026-09-13T20:15:00Z` (UTC)
- **release_version**: (none — workflow-only release; no semver bump)

## Verdict

**RELEASE_PASS.** All mandatory release gates (1, 2, 3, 4, 4b) green with **scoped standalone npm test 70/70** (12/12 `test_us0139_*`). Queue row S0145 → `released`. No backlog mutation (closure owns OPEN→DONE + acceptance tick per US-0120 / DEC-0082). No npm / GitHub / Homebrew / Chocolatey publish.

Gate-1 evidence: live scoped slice + US-0071 metadata. **`harness_fail_zero_claimed=false`** — full `tests/run-tests.ps1` was not re-run this pass.

## Summary

US-0139 ships standalone `@its-magic/code-intelligence` + `@its-magic/context-engine` (approach A1 / R-0132 / DEC-0139):

- Backend-neutral `CodeIntelligenceProvider` + nested AFT read sidecar (`AFT_BINARY_VERSION=0.55.1`); `INTEL_MUTATION_DENIED`.
- `LIVE_INTEL_TOOLS` unstub of six `itsm_*` names; ToolBroker injects provider.
- Deterministic `code_context` ranking + `TOKEN_PROFILE` caps + `CONTEXT_BUDGET`.
- Assembler exclusion; sovereign digest cap 1500; never reads `.env`.
- Pack envelope `content_hash` ≠ DEC-0038; snippet refs only.
- Compose `materialize_codebase_map.py`; operator maps preserved + `codebase-map.meta.json`.
- Benchmark 10 metrics; `crates/its-indexd` OUT.
- Partial-pack `INTEL_*`/`CONTEXT_*` + stale recovery.
- Exactly 12 `test_us0139_*`; compose us0133–us0138 green.

FRAMEWORK_KIT_REPO=1 — UAT probe class `contract_tests_primary`; 6 live-runtime classes waived `UAT_PROBE_FORBIDDEN`. No fake browser PASS. No live paid provider CI.

## ACs satisfied (QA + verify-work, UAT 9/9)

**8/8 PASS** (live npm 12/12):

| AC | Description | Status |
|----|-------------|--------|
| AC-1 | Backend-neutral `CodeIntelligenceProvider` (status, search, outline, symbol, references, callers/callees, impact, diagnostics, refresh) | PASS |
| AC-2 | v1 AFT read adapter persistent; mutations disabled | PASS |
| AC-3 | `code_context(task)` weighted rank + TOKEN_PROFILE caps | PASS |
| AC-4 | Per-phase exclusion; no transcripts/secrets/whole backlog/giant prompts/`.env` | PASS |
| AC-5 | Source refs + content hash; no secret/full source persist | PASS |
| AC-6 | Derived codebase-map compose + coverage/version metadata | PASS |
| AC-7 | Repeatable benchmark; its-indexd OUT | PASS |
| AC-8 | Incremental refresh + AFT/LSP/embeddings/index degradation | PASS |

## Test results (release — live this pass)

- **Standalone contract + unit**: `cd standalone && npm test` → **70 passed** in 2.904s (**12/12** `test_us0139_*` + us0133 + us0134 + us0135 + us0136 + us0137 + us0138 + unit).
- **Metadata guard**: `python scripts/check-user-visible-metadata.py --repo .` → exit 0.
- **Canonical harness**: **not re-run**; `harness_fail_zero_claimed=false`.

## Gate summary

| Gate | Result |
|------|--------|
| check_in_tests | **PASS** (scoped npm 70/70 + US-0071 metadata; `harness_fail_zero_claimed=false`) |
| qa | PASS (`sprints/S0145/qa-findings.md`; 0 blockers; NB1..NB3 informational) |
| verify_work | PASS (`sprints/S0145/uat.json` verdict=PASS; 8/8 ACs; 9/9 UAT incl `convergence_smoke`; live npm) |
| uat | PASS (9/9; populated; `contract_tests_primary`; 6 live-runtime classes `UAT_PROBE_FORBIDDEN`) |
| isolation_evidence | PASS (execute+qa+verify-work+sovereign-critic(verify-work)+release; distinct markers; `model_id` set) |
| strict_runtime_proof | **PASS** (verify-work `rp-auto-20260913-us0139-verify-work-qa-20260913T185500Z-US-0139` TTL `2026-09-13T19:55:00Z` consumed @ `19:15:00Z`; proof_hash recomputed MATCH `251DD21037AB0965502FCD3D3D4E4819FCB88CA1939BC1F222294EB2DA658D22`; critic of verify-work PASS `A71FA4C8A1171CF5C9DA4E5C94EDB13C2AA5B935CD654F6E87A90909641B8C2D`) |
| readme_feature_coverage_3f | FAIL non-blocking (`README_FEATURE_COVERAGE_GAP:US-0135` — pre-existing; US-0139 OPEN excluded) |
| project_readme_3g | skipped (`FRAMEWORK_KIT_REPO=1`) |
| metadata_guard | PASS |
| triad_regression | skipped (no state rollover required this pass) |
| backlog_reconciliation | not performed (closure owns per US-0120 / DEC-0082) |
| publish | skipped (`RELEASE_PUBLISH_MODE=confirm`; `RELEASE_PUBLISH_AUTO_CONFIRM=0`) |
| sync | not_eligible (`SYNC_POLICY_MODE=disabled`) |
| finalization | **PASS** (queue row S0145 = `released`) |

## Run

```powershell
# US-0139 contract (12/12) + US-0138/US-0137/US-0136/US-0135/US-0134/US-0133 compose:
cd standalone; npm test
#   Expected: 70 passed (12/12 test_us0139_* + us0133 + us0134 + us0135 + us0136 + us0137 + us0138 + unit)

python scripts/check-user-visible-metadata.py --repo .
#   Expected: exit 0 (silent PASS)
```

Start command for the shipped pack (code intelligence / context contract-test kit — not a long-running HTTP service):

```bash
cd standalone && npm test
```

- **start_command**: `cd standalone && npm test` (operator validation; contract-test kit)
- **runtime_mode**: `local`
- **runtime_context_ref**: `docs/engineering/architecture.md` `# US-0139`; `decisions/DEC-0139.md`; `docs/engineering/runtime-connectivity.md` (local kit — no remote service)

## Connect

- **service_url**: `n/a` (unpublished standalone `@its-magic/code-intelligence` + `@its-magic/context-engine` contract-test kit — no service endpoint)
- **service_port**: `n/a`
- **health_endpoint**: `n/a` (health = contract tests, not HTTP)

## Verify

1. `cd standalone && npm test` → 70 passed (12/12 `test_us0139_*`)
2. `python scripts/check-user-visible-metadata.py --repo .` → exit 0
3. Spot-check: `standalone/packages/{code-intelligence,context-engine}` have no Pi imports; kit `files` omit `standalone/`
4. Operators: six `itsm_*` live via ToolBroker; `INTEL_MUTATION_DENIED`; pack hash ≠ DEC-0038; `crates/its-indexd` absent

**expected_health_signal**: all 12 `test_us0139_*` markers PASS; us0133–us0138 compose green; metadata guard exit 0; backlog US-0139 remains OPEN until `/closure`.

## Credentials

- **credential_source_refs**: `n/a` (no API keys required for contract-test verify; fake-model CI default)
- **expected_value_source**: operator local kit checkout; no inline secrets

## Known Issues

None blocking.

- **NB-1** (informational): verify-work + qa proofs MATCH; 12/12 independently re-verified; INTEL_*/CONTEXT_* fail-closed; INTEL_MUTATION_DENIED; pack hash ≠ DEC-0038; its-indexd OUT.
- **NB-2** (informational): two packages + nested AFT read + ToolBroker inject; PolicyEngine/KernelBridge/auth-models/RoleCatalog held except six-name unstub.
- **NB-3** (informational): Do not mark US-0139 DONE at release; do not tick acceptance; do not reopen US-0138/US-0137/US-0136/US-0135/BUG-0020; no US-0140+; harness Fail:0 not claimed.
- **NB-4** (informational): `README_FEATURE_COVERAGE_GAP:US-0135` — pre-existing readme drift; remediation deferred (not US-0139 scope).

## Evidence refs

- `sprints/S0145/qa-findings.md` (QA_PASS)
- `sprints/S0145/uat.json`, `sprints/S0145/uat.md` (verify-work PASS)
- `sprints/S0145/summary.md`
- `sprints/S0145/verify-work-findings.md`
- `sprints/S0145/release-findings.md`
- `docs/engineering/state.md` (execute / qa / verify-work / sovereign-critic / release checkpoints)

## Next phase

**sovereign-critic (release)** then **`/closure`** (fresh **qe** subagent). Release does **not** spawn sovereign-critic or closure. Backlog US-0139 remains **OPEN**; acceptance US-0139 remains **unchecked** until closure.
