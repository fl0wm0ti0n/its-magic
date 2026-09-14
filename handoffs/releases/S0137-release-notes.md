# Release Notes — S0137 / US-0133

- **Sprint**: `S0137`
- **Story**: `US-0133` — Standalone repository and replaceable Pi kernel
- **Release date**: `2026-09-12T12:30:00Z` (UTC)
- **orchestrator_run_id**: `auto-20260912-us0133`
- **delivery_mode**: `ultra_lean`
- **macro_phase**: `ship` (release is phase 1 of 3: release → closure → refresh-context per DEC-0082)
- **policy_mode**: `confirm` (`RELEASE_PUBLISH_MODE=confirm`; `RELEASE_PUBLISH_AUTO_CONFIRM=0` → no publish execution)
- **trigger_source**: `auto`
- **branch**: `local` (no push; `SYNC_POLICY_MODE=disabled` per DEC-0018)
- **fresh_context_marker**: `rel-US0133-release-20260912T123000Z-fresh`
- **model_id**: `cursor-grok-4.6` (CROSS_MODEL_REVIEW=1 — required)
- **runtime_proof_id**: `rp-auto-20260912-us0133-release-release-20260912T123000Z-US-0133`
- **proof_hash**: `96546887FA44B924ABC8E16EAE912B84C17FB70811DB90D284F621481F45D0C8`
- **proof_ttl**: `2026-09-12T13:30:00Z` (UTC)
- **release_version**: (none — workflow-only release; no semver bump)

## Verdict

**RELEASE_PASS.** All mandatory release gates (1, 2, 3, 4, 4b) green with **canonical harness Fail:0** (`tests/report.md` @ `2026-09-12T12:16:03Z` Pass:859 / Fail:0, including US-0133 harness row 26AI). Queue row S0137 → `released`. No backlog mutation (closure owns OPEN→DONE + acceptance tick per US-0120 / DEC-0082). No npm / GitHub / Homebrew / Chocolatey publish.

Gate-1 remediation (pre-finalization): BUG-0009 five-job inventory tests now retain-required (`issubset`) so the additive unpublished `standalone` CI job is allowed; re-ran kit harness to Fail:0.

## Summary

US-0133 ships in-tree unpublished `standalone/` (approach A1 / DEC-0133 / R-0121):

- Private npm workspaces (`@its-magic/standalone`); kit `files` omit `standalone/`; fail-closed omit-guard (AC-1).
- Owned `AgentKernel` in `packages/pi-kernel` only; no Pi imports outside that package (AC-2).
- Production sessions `noTools: "builtin"` + custom `itsm_ping` only; abort → idle (AC-3).
- Empty DefaultResourceLoader even when trusted; planted `.pi/extensions`+`AGENTS.md` ignored (AC-4).
- Ten `test_us0133_*` markers (5 kit pytest + 5 standalone `node:test`) plus event-bridge unit (AC-5).
- Phase 0 spike GO for items 1/2/3/5; pin `@earendil-works/pi-coding-agent@0.85.1` + `@earendil-works/pi-ai@0.85.1`; no branding lock; no OS-sandbox claim (AC-6).
- Additive CI job `standalone` (Windows+Linux, Node 22); not folded into kit `TEST_COMMAND`.

FRAMEWORK_KIT_REPO=1 — UAT probe class `contract_tests_primary`; 6 live-runtime classes waived `UAT_PROBE_FORBIDDEN`. No fake browser PASS.

## ACs satisfied (QA + verify-work, UAT 7/7)

**6/6 PASS** (live kit pytest 5/5 + standalone npm test 6/6 = 10/10 markers):

| AC | Description | Status |
|----|-------------|--------|
| AC-1 | Standalone workspace + CI/lint/types + pinned Pi SDK | PASS (markers 1+3; typecheck/lint exit 0) |
| AC-2 | AgentKernel methods; no Pi imports outside `packages/pi-kernel` | PASS (markers 4+5) |
| AC-3 | Production sessions custom-tool-only + abort | PASS (markers 6+8) |
| AC-4 | Default resource isolation; trusted remains explicit | PASS (marker 7) |
| AC-5 | Contract tests: session id, custom-only, event order, abort, isolation | PASS (10/10) |
| AC-6 | Phase 0 spike versions + go/no-go without branding lock | PASS (marker 10) |

## Test results (release)

- **US-0133 kit pytest**: `python -m pytest tests/us0133_contract_test.py -v` → **5 passed** in 0.57s.
- **Standalone**: `npm test` (cwd `standalone/`) → **6 passed** in 2.68s (fail 0).
- **Combined markers**: **10/10** `test_us0133_*`.
- **Standalone typecheck/lint**: `npm run typecheck` / `npm run lint` → exit 0.
- **Kit omit-guard**: `python scripts/guard_installer_publish.py` → exit 0.
- **Metadata guard**: `python scripts/check-user-visible-metadata.py --repo .` → exit 0.
- **README feature coverage**: `python scripts/validate_readme_feature_coverage.py --repo . --enforce` → `[README_FEATURE_COVERAGE_VALIDATE_OK]`; `coverage_missing=[]` (US-0133 OPEN excluded).
- **Canonical harness** (`tests/report.md`): timestamp `2026-09-12T12:16:03Z`, **`Pass: 859 / Fail: 0`** — includes `[PASS] US-0133 kit contract tests pass`.

## Gate summary

| Gate | Result |
|------|--------|
| check_in_tests | **PASS** (`tests/report.md` Fail:0 + us0133 kit 5/5 + standalone npm 6/6 + US-0071 metadata; `harness_fail_zero_claimed=true`) |
| qa | PASS (`sprints/S0137/qa-findings.md`; 0 blockers; NB1..NB3 informational) |
| verify_work | PASS (`sprints/S0137/uat.json` verdict=PASS; 6/6 ACs; 7/7 UAT incl `convergence_smoke`; 10/10 contract live) |
| uat | PASS (7/7; populated; `contract_tests_primary`; 6 live-runtime classes `UAT_PROBE_FORBIDDEN`) |
| isolation_evidence | PASS (execute+qa+verify-work+sovereign-critic+release; distinct markers; `model_id` set) |
| strict_runtime_proof | **PASS** (verify-work `rp-auto-20260912-us0133-verify-work-qa-20260912T122000Z-US-0133` TTL `2026-09-12T13:20:00Z` consumed @ `12:30:00Z`; proof_hash recomputed MATCH `4CA5BD3BA33936863A0B8C4A9D089C64C140FA1E2FD51F6DF1E5C283D332BC57`) |
| readme_feature_coverage_3f | PASS (`coverage_missing=[]`; US-0133 OPEN excluded) |
| project_readme_3g | skipped (`FRAMEWORK_KIT_REPO=1`) |
| metadata_guard | PASS |
| triad_regression | PASS (`enforce-triad-hot-surface.py --check` exit 0) |
| backlog_reconciliation | not performed (closure owns per US-0120 / DEC-0082) |
| publish | skipped (`RELEASE_PUBLISH_MODE=confirm`; `RELEASE_PUBLISH_AUTO_CONFIRM=0`) |
| sync | not_eligible (`SYNC_POLICY_MODE=disabled`) |
| finalization | **PASS** (queue row S0137 = `released`) |

## Run

```powershell
# US-0133 kit contract (markers 1/2/3/5/10):
python -m pytest tests/us0133_contract_test.py -v
#   Expected: 5 passed

# Standalone contract + unit (markers 4/6/7/8/9 + event-bridge):
cd standalone
npm test
npm run typecheck
npm run lint
#   Expected: 6 passed / fail 0; typecheck/lint exit 0

python scripts/guard_installer_publish.py
#   Expected: exit 0 (kit files omit standalone/)

python scripts/check-user-visible-metadata.py --repo .
#   Expected: exit 0 (silent PASS)

python scripts/validate_readme_feature_coverage.py --repo . --enforce
#   Expected: [README_FEATURE_COVERAGE_VALIDATE_OK]

# Canonical harness (Fail:0 required for gate-1):
powershell -ExecutionPolicy Bypass -File "tests/run-tests.ps1"
#   Expected: tests/report.md Fail: 0 (26AI US-0133 kit row; standalone npm test is not in kit TEST_COMMAND)
```

Start command for the shipped pack (unpublished in-tree workspace — not a long-running HTTP service):

```bash
python -m pytest tests/us0133_contract_test.py -v
cd standalone && npm test
```

- **start_command**: `python -m pytest tests/us0133_contract_test.py -v` (kit); `npm test` in `standalone/` (kernel markers). No live provider required.
- **runtime_mode**: `local`
- **runtime_context_ref**: `docs/engineering/runbook.md` `### Unpublished standalone Pi kernel workspace (US-0133 / R-0121)`; `docs/engineering/runtime-connectivity.md` (local kit — no remote service)

## Connect

- **service_url**: `n/a` (unpublished `standalone/` Pi kernel / contract-test kit — no service endpoint)
- **service_port**: `n/a`
- **health_endpoint**: `n/a` (health = contract tests + Fail:0 harness, not HTTP)

## Verify

1. `python -m pytest tests/us0133_contract_test.py -v` → 5 passed
2. `cd standalone && npm test` → 6 passed (fail 0)
3. Combined: 10/10 `test_us0133_*`
4. `cd standalone && npm run typecheck && npm run lint` → exit 0
5. `python scripts/guard_installer_publish.py` → exit 0
6. `python scripts/check-user-visible-metadata.py --repo .` → exit 0
7. `python scripts/validate_readme_feature_coverage.py --repo . --enforce` → `[README_FEATURE_COVERAGE_VALIDATE_OK]`
8. `tests/report.md` header shows **Fail: 0** (incl. US-0133 26AI row)
9. Spot-check: kit `package.json` `files` omits `standalone/`; Pi imports only under `standalone/packages/pi-kernel/`

**expected_health_signal**: all 10 `test_us0133_*` markers PASS; kit omit-guard exit 0; metadata guard exit 0; README enforce OK; harness Fail:0; backlog US-0133 remains OPEN until `/closure`.

## Credentials

- **credential_source_refs**: `n/a` (no API keys required for contract-test verify; no live provider)
- **expected_value_source**: local kit checkout + Node 22 for `standalone/`; no inline secrets

## Known Issues

None blocking.

- **NB-1** (informational): R2 planted fixture + R3 fake Model + R6 omit-guard independently re-verified; trusted enablement remains US-0137.
- **NB-2** (informational): qa owned plan-verify + AC remap; KernelBridge/ToolBroker out of this slice.
- **NB-3** (informational): Do not mark US-0133 DONE at release; do not tick acceptance; do not reopen BUG-0018; Phase 0 items 1/2/3/5 only; R-0120 intact.

## Evidence refs

- `tests/report.md` (@ 2026-09-12T12:16:03Z — Fail:0)
- `sprints/S0137/qa-findings.md` (QA_PASS)
- `sprints/S0137/uat.json`, `sprints/S0137/uat.md` (verify-work PASS)
- `sprints/S0137/summary.md`
- `sprints/S0137/release-findings.md`
- `sprints/S0137/verify-work-verdict.json`
- `docs/engineering/state.md` (execute / qa / verify-work / sovereign-critic / release checkpoints)

## Next phase

`/closure` (fresh **qe** subagent, ship macro phase 2 of 3 per DEC-0082). Release does **not** spawn closure. Backlog US-0133 remains **OPEN**; acceptance US-0133 remains **unchecked** until closure.
