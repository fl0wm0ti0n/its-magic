# Release Notes — S0139 / BUG-0019

- **Sprint**: `S0139`
- **Bug / Story**: `BUG-0019` — OpenCode slash palette has no `/auto` after plugin-only ownership (BUG-0018 residual listing)
- **Release date**: `2026-09-12T19:40:00Z` (UTC)
- **orchestrator_run_id**: `auto-20260912-bug0019`
- **delivery_mode**: `ultra_lean`
- **macro_phase**: `ship` (release is phase 1 of 3: release → closure → refresh-context per DEC-0082)
- **policy_mode**: `confirm` (`RELEASE_PUBLISH_MODE=confirm`; `RELEASE_PUBLISH_AUTO_CONFIRM=0` → no publish execution)
- **trigger_source**: `auto`
- **branch**: `local` (no push; `SYNC_POLICY_MODE=disabled` per DEC-0018)
- **fresh_context_marker**: `rel-BUG0019-release-20260912T193500Z-fresh`
- **model_id**: `cursor-grok-4.6` (CROSS_MODEL_REVIEW=1 — required)
- **runtime_proof_id**: `rp-auto-20260912-bug0019-release-release-20260912T194000Z-BUG-0019`
- **proof_hash**: `1DDA131DA24FC672C364FF54CF1218AEE54712FA1F6053CEAF4D749C0E0EA0D7`
- **proof_ttl**: `2026-09-12T20:40:00Z` (UTC)
- **release_version**: (none — workflow-only release; no semver bump)

## Verdict

**RELEASE_PASS.** All mandatory release gates (1, 2, 3, 4, 4b) green with **scoped pytest 13/13** (bug0019 7/7 + bug0018 6/6). Queue row S0139 → `released`. No backlog mutation (closure owns OPEN→DONE + acceptance tick per US-0120 / DEC-0082). No npm / GitHub / Homebrew / Chocolatey publish.

Gate-1 evidence: live scoped slice + US-0071 metadata. **`harness_fail_zero_claimed=false`** — full `tests/run-tests.ps1` was not re-run this pass; stale `tests/report.md` @ `2026-09-12T13:47:25Z` (S0138) is not claimed as this sprint's Fail:0.

Gate-3f remediation (pre-finalization): US-0134 DONE README coverage backfilled (`coverage_missing=[]`).

## Summary

BUG-0019 ships OpenCode TUI slash listing for `/auto` without restoring STOP-only markdown (approach E1 / E* / R-0124):

- Sibling `.opencode/plugins/its-magic-auto/{index.ts,tui.ts}` keymap `slash`/`slashName` `"auto"` lists `/auto` (AC-1).
- TUI `run()` → `context.client` / plugin RPC `runAutoLifecycle`; fail-closed `OPENCODE_AUTO_TUI_DISPATCH_UNSUPPORTED` (AC-2).
- Colliding `.opencode/commands/auto.md` remains absent; peer markdown commands remain listed (AC-3).
- No JSON `commands.auto` + `template`; no kit `cli.json`/`tui.json` (AC-4).
- Plugin `editor.add({ name: "auto", execute })` → `runAutoLifecycle` retained; listing `index.ts` does not `editor.add` (AC-5).
- Fail-closed `OPENCODE_AUTO_SLASH_LISTING_UNSUPPORTED` (not a silent miss) (AC-6).
- Upgrade `--host opencode|both` copies listing files and still prunes leftover `auto.md`; leftover plugin check does **not** delete (AC-7).
- Seven additive `test_bug0019_*` markers; bug0018 compose 6/6 held.

FRAMEWORK_KIT_REPO=1 — UAT probe class `contract_tests_primary`; 6 live-runtime classes waived `UAT_PROBE_FORBIDDEN`. No fake browser PASS.

## ACs satisfied (QA + verify-work, UAT 8/8)

**7/7 PASS** (live pytest 7/7 + compose 6/6):

| AC | Description | Status |
|----|-------------|--------|
| AC-1 | Operator can select `/auto` in OpenCode list (TUI keymap slash) | PASS (marker 4) |
| AC-2 | Invocation starts `runAutoLifecycle` or documented `OPENCODE_*` | PASS (marker 5) |
| AC-3 | Must not restore STOP-only `auto.md`; peers remain listed | PASS (marker 1) |
| AC-4 | Must not JSON-template `/auto` | PASS (marker 3) |
| AC-5 | Plugin `editor.add` execute retained | PASS (marker 2) |
| AC-6 | Fail-closed listing token (not silent miss) | PASS (marker 4) |
| AC-7 | Upgrade copies listing + still prunes `auto.md`; parity | PASS (markers 6+7) |

## Test results (release)

- **BUG-0019 + BUG-0018 live pytest**: `python -m pytest tests/bug0019_opencode_auto_slash_listing_test.py tests/bug0018_opencode_auto_ownership_test.py -v` → **13 passed** in 0.13s (bug0019 **7/7**; bug0018 **6/6**).
- **Parity**: `python scripts/check_intake_template_parity.py --repo . --scope=bug-0019` → `[INTAKE_TEMPLATE_PARITY_OK]`.
- **Metadata guard**: `python scripts/check-user-visible-metadata.py --repo .` → exit 0.
- **README feature coverage**: `python scripts/validate_readme_feature_coverage.py --repo . --enforce` → `[README_FEATURE_COVERAGE_VALIDATE_OK]`; `coverage_missing=[]` (BUG-0019 OPEN excluded; US-0134 DONE covered after 3f remediation).
- **Canonical harness**: **not re-run**; `harness_fail_zero_claimed=false`. Stale `tests/report.md` @ `2026-09-12T13:47:25Z` belongs to S0138 and is not this sprint's Fail:0 evidence.

## Gate summary

| Gate | Result |
|------|--------|
| check_in_tests | **PASS** (scoped 13/13 + US-0071 metadata; `harness_fail_zero_claimed=false`) |
| qa | PASS (`sprints/S0139/qa-findings.md`; 0 blockers; NB1..NB3 informational) |
| verify_work | PASS (`sprints/S0139/uat.json` verdict=PASS; 7/7 ACs; 8/8 UAT incl `convergence_smoke`; 13/13 contract live) |
| uat | PASS (8/8; populated; `contract_tests_primary`; 6 live-runtime classes `UAT_PROBE_FORBIDDEN`) |
| isolation_evidence | PASS (execute+qa+verify-work+sovereign-critic+release; distinct markers; `model_id` set) |
| strict_runtime_proof | **PASS** (verify-work `rp-auto-20260912-bug0019-verify-work-qa-20260912T192500Z-BUG-0019` TTL `2026-09-12T20:25:00Z` consumed @ `19:40:00Z`; proof_hash recomputed MATCH `D2FB7454A7A6C5E456D4F2E7EAC5F010AA88D0BAE6B35919676DC003649C7735`) |
| readme_feature_coverage_3f | PASS (`coverage_missing=[]`; BUG-0019 OPEN excluded; US-0134 DONE covered) |
| project_readme_3g | skipped (`FRAMEWORK_KIT_REPO=1`) |
| metadata_guard | PASS |
| triad_regression | PASS (`enforce-triad-hot-surface.py --check` exit 0 pre-write; post-append `state-pack-20260912-bh.md`) |
| backlog_reconciliation | not performed (closure owns per US-0120 / DEC-0082) |
| publish | skipped (`RELEASE_PUBLISH_MODE=confirm`; `RELEASE_PUBLISH_AUTO_CONFIRM=0`) |
| sync | not_eligible (`SYNC_POLICY_MODE=disabled`) |
| finalization | **PASS** (queue row S0139 = `released`) |

## Run

```powershell
# BUG-0019 slash-listing contract (7/7) + BUG-0018 compose (6/6):
python -m pytest tests/bug0019_opencode_auto_slash_listing_test.py tests/bug0018_opencode_auto_ownership_test.py -v
#   Expected: 13 passed (bug0019 7/7; bug0018 6/6)

python scripts/check_intake_template_parity.py --repo . --scope=bug-0019
#   Expected: [INTAKE_TEMPLATE_PARITY_OK]

python scripts/check-user-visible-metadata.py --repo .
#   Expected: exit 0 (silent PASS)

python scripts/validate_readme_feature_coverage.py --repo . --enforce
#   Expected: [README_FEATURE_COVERAGE_VALIDATE_OK]
```

Start command for the shipped pack (OpenCode TUI listing / plugin-execute kit — not a long-running HTTP service):

```bash
python -m pytest tests/bug0019_opencode_auto_slash_listing_test.py tests/bug0018_opencode_auto_ownership_test.py -v
```

- **start_command**: `python -m pytest tests/bug0019_opencode_auto_slash_listing_test.py tests/bug0018_opencode_auto_ownership_test.py -v` (operator validation; live OpenCode TUI probe not required for this CI slice)
- **runtime_mode**: `local`
- **runtime_context_ref**: `docs/engineering/runbook.md` `### OpenCode `/auto` slash listing after plugin-only ownership (BUG-0019 / R-0124)`; `docs/engineering/runtime-connectivity.md` (local kit — no remote service)

## Connect

- **service_url**: `n/a` (OpenCode TUI slash-listing / plugin-execute / contract-test kit — no service endpoint)
- **service_port**: `n/a`
- **health_endpoint**: `n/a` (health = contract tests, not HTTP)

## Verify

1. `python -m pytest tests/bug0019_opencode_auto_slash_listing_test.py tests/bug0018_opencode_auto_ownership_test.py -v` → 13 passed (7+6)
2. `python scripts/check_intake_template_parity.py --repo . --scope=bug-0019` → `[INTAKE_TEMPLATE_PARITY_OK]`
3. `python scripts/check-user-visible-metadata.py --repo .` → exit 0
4. `python scripts/validate_readme_feature_coverage.py --repo . --enforce` → `[README_FEATURE_COVERAGE_VALIDATE_OK]`
5. Spot-check: `.opencode/commands/auto.md` absent (active + template); plugin `editor.add({ name: "auto", execute })` retained; `its-magic-auto/tui.ts` `slash`/`slashName` `"auto"`; keep `.opencode/agents/auto.md` and `.cursor/commands/auto.md`
6. Consumers: `its-magic --mode upgrade --host opencode|both` copies listing files and still prunes leftover `auto.md`

**expected_health_signal**: all 7 `test_bug0019_*` markers PASS; bug0018 compose 6/6; metadata guard exit 0; README enforce OK; colliding `auto.md` absent; TUI slash surface present; backlog BUG-0019 remains OPEN until `/closure`.

## Credentials

- **credential_source_refs**: `n/a` (no API keys required for contract-test verify; no live provider)
- **expected_value_source**: operator OpenCode host + local kit checkout; no inline secrets

## Known Issues

None blocking.

- **NB-1** (informational): leftover consumer `auto.md` / unlink-fail is owned by runbook DQ8 + `OPENCODE_AUTO_MARKDOWN_COLLISION` — operator delete then re-upgrade.
- **NB-2** (informational): qa owned plan-verify + AC remap; leftover check does not delete.
- **NB-3** (informational): Do not mark BUG-0019 DONE at release; do not tick acceptance; do not reopen BUG-0018/BUG-0017/BUG-0015/BUG-0016; no companion DEC; no live OpenCode TUI probe.

## Evidence refs

- `sprints/S0139/qa-findings.md` (QA_PASS)
- `sprints/S0139/uat.json`, `sprints/S0139/uat.md` (verify-work PASS)
- `sprints/S0139/summary.md`
- `sprints/S0139/release-findings.md`
- `sprints/S0139/verify-work-verdict.json`
- `docs/engineering/state.md` (execute / qa / verify-work / sovereign-critic / release checkpoints)

## Next phase

`/closure` (fresh **qe** subagent, ship macro phase 2 of 3 per DEC-0082). Release does **not** spawn closure. Backlog BUG-0019 remains **OPEN**; acceptance BUG-0019 remains **unchecked** until closure.
