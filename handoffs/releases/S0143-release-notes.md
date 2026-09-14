# Release Notes — S0143 / US-0137

- **Sprint**: `S0143`
- **Story**: `US-0137` — Owned tool broker, policy engine, and security boundary (`@its-magic/policy-engine` + `@its-magic/tool-broker` no Pi; thin kernel `ownedTools` port; production `itsm_*` via ToolBroker; `noTools: "builtin"` held; PolicyEngine ALLOW|ASK|DENY; path/shell/secret/profile/audit; real `policy_hash`; 10 `test_us0137_*`)
- **Release date**: `2026-09-13T12:35:00Z` (UTC)
- **orchestrator_run_id**: `auto-20260913-us0137`
- **delivery_mode**: `ultra_lean`
- **macro_phase**: `ship` (release is phase 1 of 3: release → closure → refresh-context per DEC-0082)
- **policy_mode**: `confirm` (`RELEASE_PUBLISH_MODE=confirm`; `RELEASE_PUBLISH_AUTO_CONFIRM=0` → no publish execution)
- **trigger_source**: `auto`
- **branch**: `local` (no push; `SYNC_POLICY_MODE=disabled` per DEC-0018)
- **fresh_context_marker**: `rel-US0137-release-20260913T123500Z-fresh`
- **model_id**: `composer-2.5-fast` (CROSS_MODEL_REVIEW=1 — required)
- **runtime_proof_id**: `rp-auto-20260913-us0137-release-release-20260913T123500Z-US-0137`
- **proof_hash**: `0E0CCB537C1BFCB89A784333A655F443789902EAAE0C62D51B23C868E6407C3A`
- **proof_ttl**: `2026-09-13T13:35:00Z` (UTC)
- **release_version**: (none — workflow-only release; no semver bump)

## Verdict

**RELEASE_PASS.** All mandatory release gates (1, 2, 3, 4, 4b) green with **scoped standalone npm test 46/46** (10/10 `test_us0137_*`) + **kit pytest 9/9**. Queue row S0143 → `released`. No backlog mutation (closure owns OPEN→DONE + acceptance tick per US-0120 / DEC-0082). No npm / GitHub / Homebrew / Chocolatey publish.

Gate-1 evidence: live scoped slice + US-0071 metadata. **`harness_fail_zero_claimed=false`** — full `tests/run-tests.ps1` was not re-run this pass.

## Summary

US-0137 ships standalone policy-engine + tool-broker (approach A1 / R-0129 / DEC-0137):

- `@its-magic/policy-engine` + `@its-magic/tool-broker` private 0.0.0; no Pi deps.
- PolicyEngine ALLOW|ASK|DENY; `security_hard` unrelaxable.
- Path deny matrix (PO src, QA silent fix, traversal).
- Shell classifier v1; exfil/privileged/destructive/package/git-force.
- Secret-path deny before content; compose `redact.ts`; browser header helper.
- Layer A profiles; missing Layer B → `ISOLATION_BACKEND_UNAVAILABLE`.
- Compact audit + real `policy_hash`; DEC-0038 unamended.
- `ownedTools` wrap `defineTool` only in pi-kernel; `noTools: "builtin"` held.
- Per-role `itsm_*` catalog; stubs fail-closed; orchestrator `[]`.
- Exactly 10 `test_us0137_*`; compose us0133/us0134/us0135/us0136 green.

FRAMEWORK_KIT_REPO=1 — UAT probe class `contract_tests_primary`; 6 live-runtime classes waived `UAT_PROBE_FORBIDDEN`. No fake browser PASS. No live paid provider CI.

## ACs satisfied (QA + verify-work, UAT 9/9)

**8/8 PASS** (live npm 10/10 + pytest 9/9):

| AC | Description | Status |
|----|-------------|--------|
| AC-1 | Pi sessions receive only role/phase-specific itsm_* tools backed by ToolBroker; no raw Pi mutation tool reaches a production session | PASS |
| AC-2 | PolicyEngine evaluates role, phase, work item, sprint, worktree, paths, command, backend, autonomy, permission, security class, and approvals to return ALLOW, ASK, or DENY | PASS |
| AC-3 | Path ownership prevents PO production edits, QA silent production fixes, release closure, closure release edits, orchestrator phase writes, and curator product-intent rewrites | PASS |
| AC-4 | Shell actions are parsed/classified; destructive, privileged, network, deploy, package, and git mutations follow explicit policy; traversal/exfiltration attempts fail safely | PASS |
| AC-5 | Secret files and values are never injected into LLM context; provider tokens and Authorization/Cookie data are redacted from logs and evidence | PASS |
| AC-6 | Semantic policy and OS execution isolation are separate layers with trusted-local, isolated-development, and untrusted-repository profiles | PASS |
| AC-7 | Every consequential action creates a compact audit record with run/session/tool identity, normalized action, policy decision, duration, result, and evidence reference but no secret payload | PASS |
| AC-8 | Security tests cover malicious project Pi resources, .env reads, path traversal, shell exfiltration, browser redaction, and unavailable isolation backends | PASS |

## Test results (release — live this pass)

- **Standalone contract + unit**: `cd standalone && npm test` → **46 passed** in 2.82s (**10/10** `test_us0137_*` + us0133 + us0134 + us0135 + us0136 + unit).
- **Kit + compose contract tests**: `python -m pytest tests/us0137_contract_test.py tests/us0136_contract_test.py tests/us0135_contract_test.py tests/us0134_contract_test.py tests/us0133_contract_test.py -v` → **9 passed** in 0.78s.
- **Metadata guard**: `python scripts/check-user-visible-metadata.py --repo .` → exit 0.
- **Canonical harness**: **not re-run**; `harness_fail_zero_claimed=false`.

## Gate summary

| Gate | Result |
|------|--------|
| check_in_tests | **PASS** (scoped npm 46/46 + pytest 9/9 + US-0071 metadata; `harness_fail_zero_claimed=false`) |
| qa | PASS (`sprints/S0143/qa-findings.md`; 0 blockers; NB1..NB3 informational) |
| verify_work | PASS (`sprints/S0143/uat.json` verdict=PASS; 8/8 ACs; 9/9 UAT incl `convergence_smoke`; live npm+pytest) |
| uat | PASS (9/9; populated; `contract_tests_primary`; 6 live-runtime classes `UAT_PROBE_FORBIDDEN`) |
| isolation_evidence | PASS (execute+qa+verify-work+sovereign-critic+release; distinct markers; `model_id` set) |
| strict_runtime_proof | **PASS** (verify-work `rp-auto-20260913-us0137-verify-work-qa-20260913T121500Z-US-0137` TTL `2026-09-13T13:15:00Z` consumed @ `12:35:00Z`; proof_hash recomputed MATCH `1935425E70F1379A9D9AEE780CC1A42A9F54D18F766D5F321DDED8145B8E99E1`; critic of verify-work PASS `510CF858C8B70BA9DAF18CDB2147E31F39B7B6D2C0A792B2FA0132C4A2CE9C39`) |
| readme_feature_coverage_3f | FAIL non-blocking (`README_FEATURE_COVERAGE_GAP:US-0135` — pre-existing; US-0137 OPEN excluded) |
| project_readme_3g | skipped (`FRAMEWORK_KIT_REPO=1`) |
| metadata_guard | PASS |
| triad_regression | PASS (pre-write `--check` PASS; post-append rollover in state.md) |
| backlog_reconciliation | not performed (closure owns per US-0120 / DEC-0082) |
| publish | skipped (`RELEASE_PUBLISH_MODE=confirm`; `RELEASE_PUBLISH_AUTO_CONFIRM=0`) |
| sync | not_eligible (`SYNC_POLICY_MODE=disabled`) |
| finalization | **PASS** (queue row S0143 = `released`) |

## Run

```powershell
# US-0137 contract (10/10) + US-0136/US-0135/US-0134/US-0133 compose:
cd standalone; npm test
#   Expected: 46 passed (10/10 test_us0137_* + us0133 + us0134 + us0135 + us0136 + unit)

python -m pytest tests/us0137_contract_test.py tests/us0136_contract_test.py tests/us0135_contract_test.py tests/us0134_contract_test.py tests/us0133_contract_test.py -v
#   Expected: 9 passed

python scripts/check-user-visible-metadata.py --repo .
#   Expected: exit 0 (silent PASS)
```

Start command for the shipped pack (policy-engine / tool-broker contract-test kit — not a long-running HTTP service):

```bash
cd standalone && npm test && python -m pytest tests/us0137_contract_test.py tests/us0136_contract_test.py tests/us0135_contract_test.py tests/us0134_contract_test.py tests/us0133_contract_test.py -v
```

- **start_command**: `cd standalone && npm test` (operator validation; contract-test kit)
- **runtime_mode**: `local`
- **runtime_context_ref**: `docs/engineering/runbook.md` `### Owned tool broker, policy engine, and security boundary (US-0137 / R-0129 / DEC-0137)`; `docs/engineering/runtime-connectivity.md` (local kit — no remote service)

## Connect

- **service_url**: `n/a` (unpublished standalone policy-engine / tool-broker contract-test kit — no service endpoint)
- **service_port**: `n/a`
- **health_endpoint**: `n/a` (health = contract tests, not HTTP)

## Verify

1. `cd standalone && npm test` → 46 passed (10/10 `test_us0137_*`)
2. `python -m pytest tests/us0137_contract_test.py tests/us0136_contract_test.py tests/us0135_contract_test.py tests/us0134_contract_test.py tests/us0133_contract_test.py -v` → 9 passed
3. `python scripts/check-user-visible-metadata.py --repo .` → exit 0
4. Spot-check: `standalone/packages/{policy-engine,tool-broker}` have no Pi imports; `defineTool` only in pi-kernel; production `itsm_*` via ToolBroker; kit `files` omit `standalone/`
5. Operators: PolicyEngine ALLOW|ASK|DENY fail-closed; Layer B missing → `ISOLATION_BACKEND_UNAVAILABLE`; orchestrator scheduling-only

**expected_health_signal**: all 10 `test_us0137_*` markers PASS; us0133/us0134/us0135/us0136 compose green; metadata guard exit 0; backlog US-0137 remains OPEN until `/closure`.

## Credentials

- **credential_source_refs**: `n/a` (no API keys required for contract-test verify; fake-model CI default)
- **expected_value_source**: operator local kit checkout; no inline secrets

## Known Issues

None blocking.

- **NB-1** (informational): qa+execute proofs MATCH; PolicyEngine path/shell/secret deny + Layer B unavailable + malicious extensions locked in tests.
- **NB-2** (informational): policy-engine + tool-broker no Pi; `defineTool` only in pi-kernel; DEC-0038 unamended; isolation/`noTools`/KernelBridge/auth-models/role-runtime unamended.
- **NB-3** (informational): Do not mark US-0137 DONE at release; do not tick acceptance; do not reopen US-0136/US-0135/BUG-0020; no US-0138+; harness Fail:0 not claimed.
- **NB-4** (informational): `README_FEATURE_COVERAGE_GAP:US-0135` — pre-existing readme drift; remediation deferred (not US-0137 scope).

## Evidence refs

- `sprints/S0143/qa-findings.md` (QA_PASS)
- `sprints/S0143/uat.json`, `sprints/S0143/uat.md` (verify-work PASS)
- `sprints/S0143/summary.md`
- `sprints/S0143/release-findings.md`
- `sprints/S0143/verify-work-findings.md`
- `docs/engineering/state.md` (execute / qa / verify-work / sovereign-critic / release checkpoints)

## Next phase

`/closure` (fresh **qe** subagent, ship macro phase 2 of 3 per DEC-0082). Release does **not** spawn closure. Backlog US-0137 remains **OPEN**; acceptance US-0137 remains **unchecked** until closure.
