# Handoff: /verify-work -> /release -- BUG-0027 / S0160

- **Sprint**: S0160
- **Story**: (none)
- **Bug**: BUG-0027 (Status OPEN -- do NOT mark DONE)
- **Orchestrator Run**: auto-20260921-bug0027
- **Parent Run**: ir-20260921T190544Z-bug0027
- **Phase Transition**: /verify-work Complete -> /release
- **Timestamp**: 2026-09-21T22:07:00Z
- **Fresh context marker**: qa-BUG0027-verify-20260921T220700Z-fresh
- **Delivery mode**: ultra_lean
- **Macro phase**: build+verify -> ship
- **model_id**: inherit (CROSS_MODEL_REVIEW=0)
- **Consumed qa_to_verify**: sprints/S0160/qa-findings.md (qa PASS 215200Z; marker qa-BUG0027-qa-20260921T215200Z-fresh)

## Verify-Work Verdict

**PASS** -- UAT 7/7 (6 ACs + convergence_smoke); 0 failed; pytest bug0027 **10/10** (0.79s this pass); compose **66/66** (3.37s); parity bug-0027 OK; probe_kind=contract_tests_primary; 6 live classes UAT_PROBE_FORBIDDEN including live OpenCode CLI TUI; fake_browser_pass_claimed=false; live_opencode_cli_tui_pass_claimed=false; toast_repair_claimed=false; isolation execute+qa+verify-work PASS; backlog Status remains OPEN; AC-1..AC-6 unchecked; harness_fail_zero_claimed=false; no live npm publish/git push; NB1 live residual informational.

## Evidence Summary

| Gate | Result |
|------|--------|
| UAT steps | 7 passed / 0 failed |
| AC-1..AC-6 | 6/6 PASS (slice; backlog ACs unchecked) |
| convergence_smoke | pass |
| pytest bug0027 | 10/10 PASS (0.79s) |
| compose us0125..bug0019 | 66/66 PASS (3.37s) |
| Isolation compliance | PASS (execute + qa + verify-work) |
| Strict-proof triad | VALID MATCH not-STALE (execute + qa) + ISSUED verify-work |
| Live OpenCode CLI TUI PASS | false (UAT_PROBE_FORBIDDEN) |
| Toast repair claimed | false |
| Fake live-Chrome PASS | none |
| QA_PASS | confirmed (consumed MATCH) |

## Runtime proofs (full rp-auto-...)

- verify-work: `rp-auto-20260921-bug0027-verify-work-qa-20260921T220700Z-BUG-0027` / `98DE3A16D39BF5B73CC5A4929A3DB2D7094C8D4020255B10D36720CB22A79F73` / ttl 2026-09-21T23:07:00Z
- qa (consumed): `rp-auto-20260921-bug0027-qa-qa-20260921T215200Z-BUG-0027` / `4C93C4878501C9E8BF6966FE926733DB2B4DA7F67363E630FD2EEDE52482B6D5`
- execute: `rp-auto-20260921-bug0027-execute-dev-20260921T214400Z-BUG-0027` / `0A6D1399F910A2166D137FFCFA632C9D673FB381EA68E4D8A2056D7337590B33`
- plan-verify: `rp-auto-20260921-bug0027-plan-verify-qa-20260921T215200Z-BUG-0027` / `6E70023DA9FFB5E66AE08F2F0D9C6A42FB06470AFA5D7408155B8D4F8E73847A` (ultra_lean merged; not spawned)

## Artifact refs

- `sprints/S0160/verify-work-findings.md`
- `sprints/S0160/verify-work-verdict.json`
- `sprints/S0160/uat.json` / `sprints/S0160/uat.md`
- `docs/engineering/state.md` (verify-work checkpoint)

## Next Phase

- **Phase**: /release (orchestrator spawn)
- **Spawn Role**: release (fresh subagent per BUG-0006)
- **Do NOT**: mark BUG-0027 DONE; tick acceptance.md; tick backlog ACs; spawn /release from this qa subagent; claim live OpenCode PASS; claim toast repair; restore auto.md; mutate BUG-0022/0026; reopen BUG-0024.

## Stop Conditions

- stop_reason: (not terminal -- native_chain_continuing)
- stop_phase: verify-work
- intended_resume_phase: release
- native_chain_continuing: true

---
# Handoff: /verify-work ? /release — BUG-0024 / S0159

- **Sprint**: S0159
- **Story**: (none)
- **Bug**: BUG-0024 (Status OPEN — do NOT mark DONE)
- **Orchestrator Run**: auto-20260921-bug0024
- **Parent Run**: cursor-20260913-BUG0024-intake
- **Phase Transition**: /verify-work Complete ? /release
- **Timestamp**: 2026-09-21T20:07:00Z
- **Fresh context marker**: qa-BUG0024-verify-20260921T200700Z-fresh
- **Delivery mode**: ultra_lean
- **Macro phase**: build+verify ? ship
- **model_id**: inherit (CROSS_MODEL_REVIEW=0)
- **Consumed qa_to_verify**: sprints/S0159/qa-findings.md (qa PASS 200200Z; marker qa-BUG0024-qa-20260921T200200Z-fresh)

## Verify-Work Verdict

**PASS** — UAT 9/9 (8 ACs + convergence_smoke); 0 failed; pytest bug0024 **8/8** (0.52s this pass); compose **37/37** (0.71s); parity bug-0024 OK; probe_kind=contract_tests_primary; 6 live classes UAT_PROBE_FORBIDDEN including live OpenCode CLI TUI; fake_browser_pass_claimed=false; live_opencode_cli_tui_pass_claimed=false; isolation execute+qa+verify-work PASS; backlog Status remains OPEN; AC-1..AC-8 unchecked; harness_fail_zero_claimed=false; no live npm publish/git push; NB1 live residual informational.

## Evidence Summary

| Gate | Result |
|------|--------|
| UAT steps | 9 passed / 0 failed |
| AC-1..AC-8 | 8/8 PASS (slice; backlog ACs unchecked) |
| convergence_smoke | pass |
| pytest bug0024 | 8/8 PASS (0.52s) |
| compose bug0023..0018 | 37/37 PASS (0.71s) |
| Isolation compliance | PASS (execute + qa + verify-work) |
| Strict-proof triad | VALID MATCH not-STALE (execute + qa) + ISSUED verify-work |
| Live OpenCode CLI TUI PASS | false (UAT_PROBE_FORBIDDEN) |
| Fake live-Chrome PASS | none |
| QA_PASS | confirmed (consumed) |

## Runtime proofs (full rp-auto-…)

- verify-work: `rp-auto-20260921-bug0024-verify-work-qa-20260921T200700Z-BUG-0024` / `A38D5C2058233468E31687E0CE5352855D8D709904D764A33D9AFBF3E9178125` / ttl 2026-09-21T21:07:00Z
- qa (consumed): `rp-auto-20260921-bug0024-qa-qa-20260921T200200Z-BUG-0024` / `9582B1942C734F2FDAEE4582DC2F54B0CA80066C074170ABFDC3A4DC7D1E657E`
- execute: `rp-auto-20260921-bug0024-execute-dev-20260921T195500Z-BUG-0024` / `E653C7B8616F101FB996D413493BABE5A8D979ADE3548FB8F2A26A47265DA356`
- plan-verify: `rp-auto-20260921-bug0024-plan-verify-qa-20260921T200200Z-BUG-0024` / `2308F89EFBF95B0D32E94E77BD631CA1AFD29FFC6843599238A58170070A0155` (ultra_lean merged; not spawned)

## Artifact refs

- `sprints/S0159/verify-work-findings.md`
- `sprints/S0159/verify-work-verdict.json`
- `sprints/S0159/uat.json` / `sprints/S0159/uat.md`
- `docs/engineering/state.md` (verify-work checkpoint)

## Next Phase

- **Phase**: /release (orchestrator spawn)
- **Spawn Role**: release (fresh subagent per BUG-0006)
- **Do NOT**: mark BUG-0024 DONE; tick acceptance.md; tick backlog ACs; spawn /release from this qa subagent; claim live OpenCode CLI TUI PASS; restore auto.md; mutate BUG-0022/0027; reopen BUG-0023/0021.

## Stop Conditions

- stop_reason: (not terminal — native_chain_continuing)
- stop_phase: verify-work
- intended_resume_phase: release
- native_chain_continuing: true

---# Verify-work -> Release handoff â€” US-0123 / S0123 (loop 2; PASS; 10/10 ACs; 8/8 live contract re-run; parity OK; opencode-catalog OK; Fail:0 UPHELD fresh report; 0 blocking)

- sprint_id: S0123
- story_id: US-0123
- phase_id: verify-work
- role: qa (fresh per BUG-0006; loop 2 after execute harness-refresh)
- orchestrator_run_id: auto-20260824-01
- delivery_mode: ultra_lean
- macro_phase: build+verify
- AUTO_IMPLEMENTATION_LOOP: harness-refresh gate-1 unblock (loop 2)
- fresh_context_marker: qa-US0123-verify-work-20260824T152400Z-fresh (NEW; distinct from prior qa-US0123-verify-work-20260824T150100Z-fresh and qa-US0123-qa-20260824T145500Z-fresh)
- timestamp: 2026-08-24T15:24:00Z (UTC)
- model_id: glm-5.2-high (CROSS_MODEL_REVIEW=1 â€” required)
- producer_model_id: composer-2.5-fast (sovereign-critic qa-loop2 phase)
- producer_runtime_proof_id: rp-auto-20260824-01-qa-qa-20260824T151700Z-US-0123-loop2
- producer_proof_hash: 9CC32FD6A0EE8C0EDE3696E060BDBD8A8F19E914BFFBE51719E1A7B79704F107
- producer_proof_ttl: 2026-08-24T16:17:00Z (consumed before expiry)
- verdict: **PASS** (10/10 ACs pass; 8/8 contract-test markers PASSED live re-run in 0.20s exit 0; opencode-adapter parity OK; opencode-catalog validator OK; compose 6/6 UNCHANGED; byte-identical mirrors; 0 blocking findings; no fake browser PASS; **full-harness Fail:0 claim UPHELD â€” report fresh**)
- blocking_findings: 0
- non_blocking_findings: 1 (carried forward from qa; do not block release)
- tests_run: 8 live (python 3.12.10; pytest 9.1.1; 8/8 PASSED in 0.20s)
- next_scheduled_phase: /release
- next_scheduled_role: release
- stop_condition: STOP after verify-work loop-2; do not spawn /release from this QA subagent. Orchestrator reroutes.

## UAT summary

- **Total steps**: 10 | **Passed**: 10 | **Failed**: 0 (passed + failed = total â€” DEC-0009)
- **AC-1..AC-10**: all PASS (see `sprints/S0123/uat.md` for per-AC evidence).
- **Probe results**: 7 (all `UAT_PROBE_PASS` â€” contract gate, opencode-adapter parity, opencode-catalog validator, harness-report-fresh, harness-zero-fail-rows, compose guards, acceptance-row-unchecked).
- **Browser probe**: not used (pack/contract story â€” no web UI; static contract-test mapping justified per US-0092 / DEC-0078). No fake browser PASS.

## Live evidence (verify-work loop-2 re-run)

| Check | Command | Result |
|-------|---------|--------|
| Contract tests (8 markers) | `python -m pytest tests/us0123_contract_test.py -v` | **8/8 PASS** (0.20s, exit 0) |
| OpenCode adapter parity | `python scripts/check_intake_template_parity.py --repo . --scope=opencode-adapter` | **PASS** (`[INTAKE_TEMPLATE_PARITY_OK] scope=opencode-adapter`) |
| OpenCode catalog validator | `python scripts/model_tier_validate.py --scope opencode-catalog --repo .` | **PASS** (`[MODEL_TIER_VALIDATION_OK]`) |

## Full-harness claim â€” UPHELD (fresh report, loop 2)

`tests/report.md` header: `Timestamp: 2026-08-24T15:12:17Z` / `Pass: 845` / `Fail: 0`. The report timestamp **matches** the execute harness-refresh handoff timestamp (`2026-08-24T15:12:30Z`) within ~13s â€” report is FRESH. Grep `\[FAIL\]` over `tests/report.md` returned **0 matches** (zero `[FAIL]` rows). Per QA PASS-claim rule, the full-harness `Fail: 0` claim is **UPHELD** for US-0123 loop-2.

`release_harness_refresh_required` flag from loop-1 is now **satisfied** â€” release gate-1 may consume the fresh `tests/report.md` directly without another refresh.

## Compose guards (6/6 UNCHANGED)

| # | Guard | Evidence |
|---|-------|----------|
| 1 | `docs/product/backlog.md` US-0123 | `Status: OPEN` (not mutated) |
| 2 | `docs/product/acceptance.md` US-0123 | `- [ ] US-0123` (unchecked; not mutated) |
| 3 | `docs/engineering/architecture.md` US-0123 | `# US-0123` anchor present (not mutated) |
| 4 | `decisions/DEC-0123.md` | `Status: Accepted` (not mutated) |
| 5 | `template/.opencode/agents/*.md` | grep `^model:` -> 0 matches |
| 6 | Byte-identical mirrors | runbook + manifest + 3 paired scripts all SHA-256 equal |

## Isolation evidence (US-0048 / DEC-0029)

- `phase_id=verify-work`, `role=qa`, `model_id=glm-5.2-high` (CROSS_MODEL_REVIEW=1 â€” required)
- `fresh_context_marker=qa-US0123-verify-work-20260824T152400Z-fresh`, `timestamp=2026-08-24T15:24:00Z`
- `evidence_ref=sprints/S0123/verify-work-findings.md + sprints/S0123/uat.json + sprints/S0123/uat.md + handoffs/verify_to_release.md (this prepend) + docs/engineering/state.md (verify-work loop-2 checkpoint append-bottom)`

## Strict runtime proof (US-0056 / DEC-0038)

- `runtime_proof_id=rp-auto-20260824-01-verify-work-qa-20260824T152400Z-US-0123`
- `proof_hash=5DBDB6549E0E7841974CE7A8D8FE81889AB7ADD0ED79F8FA10AF4C4CD7CA3BE8`
- `proof_ttl_seconds=3600`, `proof_ttl=2026-08-24T16:24:00Z`
- Canonical payload: `{"delivery_mode":"ultra_lean","macro_phase":"build+verify","model_id":"glm-5.2-high","orchestrator_run_id":"auto-20260824-01","phase_id":"verify-work","proof_issued_at":"2026-08-24T15:24:00Z","proof_ttl_seconds":3600,"role":"qa","runtime_proof_id":"rp-auto-20260824-01-verify-work-qa-20260824T152400Z-US-0123","sprint_id":"S0123","story_id":"US-0123"}`

## Release gate-1 advisory (harness fresh â€” cleared)

`tests/report.md` is FRESH (`2026-08-24T15:12:17Z`) â€” matches execute harness-refresh handoff (`2026-08-24T15:12:30Z`) within ~13s. `/release` gate-1 (check-in test) may consume the fresh `tests/report.md` directly. Loop-1 `release_harness_refresh_required=true` flag is **satisfied**. No additional harness refresh required before `/release`.

---

# Verify-work -> Release handoff â€” US-0123 / S0123 (loop 1 archive; PASS; 10/10 ACs; 8/8 live contract re-run; parity OK; opencode-catalog OK; 0 blocking; NO full-harness claim â€” stale report)

- sprint_id: S0123
- story_id: US-0123
- phase_id: verify-work
- role: qa (fresh per BUG-0006)
- orchestrator_run_id: auto-20260824-01
- delivery_mode: ultra_lean
- macro_phase: build+verify
- fresh_context_marker: qa-US0123-verify-work-20260824T150100Z-fresh (NEW; distinct from prior qa-US0123-qa-20260824T145500Z-fresh)
- timestamp: 2026-08-24T15:01:00Z (UTC)
- model_id: glm-5.2-high (CROSS_MODEL_REVIEW=1 â€” required)
- producer_model_id: composer-2.5-fast (sovereign-critic phase)
- producer_runtime_proof_id: rp-auto-20260824-01-qa-qa-20260824T145500Z-US-0123
- producer_proof_hash: 6D35A32F5E471232B0750442E370047E536442C87F36692A67D811F87C08CDAD
- producer_proof_ttl: 2026-08-24T15:55:00Z (consumed before expiry)
- verdict: **PASS** (10/10 ACs pass; 8/8 contract-test markers PASSED live re-run in 0.22s exit 0; opencode-adapter parity OK; opencode-catalog validator OK; compose 6/6 UNCHANGED; byte-identical mirrors; 0 blocking findings; no fake browser PASS)
- blocking_findings: 0
- non_blocking_findings: 1 (carried forward from qa; do not block release)
- tests_run: 8 live (python 3.12.10; pytest 9.1.1; 8/8 PASSED in 0.22s)
- next_scheduled_phase: /release (orchestrator may insert execute harness-refresh first)
- next_scheduled_role: release
- stop_condition: STOP after verify-work; do not spawn /release from this QA subagent. Orchestrator reroutes.

## UAT summary

- **Total steps**: 10 | **Passed**: 10 | **Failed**: 0 (passed + failed = total â€” DEC-0009)
- **AC-1..AC-10**: all PASS (see `sprints/S0123/uat.md` for per-AC evidence).
- **Probe results**: 6 (all `UAT_PROBE_PASS` â€” contract gate, opencode-adapter parity, opencode-catalog validator, compose guards, acceptance-row-unchecked, stale-harness-flag).
- **Browser probe**: not used (pack/contract story â€” no web UI; static contract-test mapping justified per US-0092 / DEC-0078). No fake browser PASS.

## Live evidence (verify-work re-run)

| Check | Command | Result |
|-------|---------|--------|
| Contract tests (8 markers) | `python -m pytest tests/us0123_contract_test.py -v` | **8/8 PASS** (0.22s, exit 0) |
| OpenCode adapter parity | `python scripts/check_intake_template_parity.py --repo . --scope=opencode-adapter` | **PASS** (`[INTAKE_TEMPLATE_PARITY_OK] scope=opencode-adapter`) |
| OpenCode catalog validator | `python scripts/model_tier_validate.py --scope opencode-catalog --repo .` | **PASS** (`[MODEL_TIER_VALIDATION_OK]`) |

## Full-harness claim â€” NOT made (stale report; release must refresh)

`tests/report.md` header: `Timestamp: 2026-08-24T13:02:49Z` / `Pass: 845` / `Fail: 0`. The report timestamp **predates** the US-0123 execute timestamp (`2026-08-24T14:48:00Z`) by ~1h46m. Per QA PASS-claim rule, no full-harness `Fail: 0` claim is made for US-0123. The stale report is noted without claiming green.

**Release harness refresh required**: `/release` gate-1 (check-in test) must re-run `tests/run-tests.ps1` and refresh `tests/report.md` before any PASS claim. Orchestrator may insert an execute harness-refresh step before `/release`. Flagged in `sprints/S0123/uat.json` `release_harness_refresh_required=true`.

## Compose guards (6/6 UNCHANGED)

| # | Guard | Evidence |
|---|-------|----------|
| 1 | `docs/product/backlog.md` US-0123 | `Status: OPEN` (not mutated) |
| 2 | `docs/product/acceptance.md` US-0123 | `- [ ] US-0123` (unchecked; not mutated) |
| 3 | `docs/engineering/architecture.md` US-0123 | `# US-0123` anchor present (not mutated) |
| 4 | `decisions/DEC-0123.md` | `Status: Accepted` (not mutated) |
| 5 | `template/.opencode/agents/*.md` | grep `^model:` -> 0 matches |
| 6 | Byte-identical mirrors | runbook + manifest + 3 paired scripts all SHA-256 equal |

## Isolation evidence (US-0048 / DEC-0029)

- `phase_id=verify-work`, `role=qa`, `model_id=glm-5.2-high` (CROSS_MODEL_REVIEW=1 â€” required)
- `fresh_context_marker=qa-US0123-verify-work-20260824T150100Z-fresh`, `timestamp=2026-08-24T15:01:00Z`
- `evidence_ref=sprints/S0123/verify-work-findings.md + sprints/S0123/uat.json + sprints/S0123/uat.md + handoffs/verify_to_release.md (this prepend) + docs/engineering/state.md (verify-work checkpoint append-bottom)`

## Strict runtime proof (US-0056 / DEC-0038)

- `runtime_proof_id=rp-auto-20260824-01-verify-work-qa-20260824T150100Z-US-0123`
- `proof_hash=E062CD6EDAA55EB02C96EF6101C5E21A39E1816BF9537AB129C7F71A8374A5E7`
- `proof_ttl_seconds=3600`, `proof_ttl=2026-08-24T16:01:00Z`
- Canonical payload: `{"delivery_mode":"ultra_lean","macro_phase":"build+verify","model_id":"glm-5.2-high","orchestrator_run_id":"auto-20260824-01","phase_id":"verify-work","proof_issued_at":"2026-08-24T15:01:00Z","proof_ttl_seconds":3600,"role":"qa","runtime_proof_id":"rp-auto-20260824-01-verify-work-qa-20260824T150100Z-US-0123","sprint_id":"S0123","story_id":"US-0123"}`

## Release gate-1 advisory (harness refresh)

`tests/report.md` is STALE (`2026-08-24T13:02:49Z`) vs US-0123 execute (`2026-08-24T14:48:00Z`). `/release` gate-1 (check-in test) must NOT claim PASS on the stale report. Orchestrator may insert an execute harness-refresh step (re-run `tests/run-tests.ps1`) before `/release` to refresh `tests/report.md`. Until refreshed, gate-1 evidence is `RELEASE_TEST_STALE` per US-0039.

---

# Verify-work â†’ Release handoff â€” US-0122 / S0122 (loop 2; PASS; 8/8 live; parity OK; Fail:0 literal; 0 blocking)

- sprint_id: S0122
- story_id: US-0122
- phase_id: verify-work
- role: qa (fresh per BUG-0006, loop 2 after execute harness remediations)
- orchestrator_run_id: auto-20260824-01
- delivery_mode: ultra_lean
- macro_phase: build+verify
- fresh_context_marker: qa-US0122-verify-work-20260824T131600Z-fresh (NEW; not reused; distinct from prior `qa-US0122-verify-work-20260824T123500Z-fresh`)
- timestamp: 2026-08-24T13:16:00Z (UTC)
- model_id: glm-5.2-high (CROSS_MODEL_REVIEW=1 â€” required)
- producer_model_id: composer-2.5-fast (sovereign-critic phase)
- producer_runtime_proof_id: rp-auto-20260824-01-qa-qa-loop2-20260824T131000Z-US-0122
- producer_proof_hash: 94B1960081A51EF41401934B5D3A386DB8C90EFADCF0149C60695DAC7A33F143
- producer_proof_ttl: 2026-08-24T14:10:00Z (consumed before expiry)
- verdict: **PASS** (10/10 ACs pass; 8/8 contract-test markers PASSED live; parity OK; harness `Fail: 0` literal with zero `[FAIL]` rows; 0 blocking findings)
- blocking_findings: 0
- non_blocking_findings: 3 (carried forward from qa; do not block release)
- tests_run: 8 live (python 3.12.10; pytest 9.1.1; 8/8 PASSED in 0.03s)
- next_scheduled_phase: /release
- next_scheduled_role: release
- stop_condition: STOP after verify-work loop-2; do not spawn /release from this QA subagent. Orchestrator reroutes.

## UAT summary

- **Total steps**: 10 | **Passed**: 10 | **Failed**: 0 (passed + failed = total â€” DEC-0009)
- **AC-1..AC-10**: all PASS (see `sprints/S0122/uat.md` for per-AC evidence).
- **Probe results**: 7 (all `UAT_PROBE_PASS` â€” contract gate, parity, locked-matrix, runbook h2, compose guards, byte-identical mirrors, harness report Fail:0).
- **Browser probe**: not used (pack/contract story â€” no web UI; static contract-test mapping justified per US-0092 / DEC-0078). No fake browser PASS.

## Live re-verification evidence (this verify-work loop-2 run â€” no rubber-stamp)

- **Live pytest**: `python -m pytest tests/us0122_contract_test.py -v` â†’ **8/8 PASSED in 0.03s** (Python 3.12.10; pytest 9.1.1; collected 8 items; exit 0).
- **Parity**: `python scripts/check_intake_template_parity.py --repo . --scope=opencode-adapter` â†’ `[INTAKE_TEMPLATE_PARITY_OK] scope=opencode-adapter` (exit 0).
- **Full-harness report**: `tests/report.md` @ `2026-08-24T13:02:49Z` â†’ `Pass: 845` / `Fail: 0` literal at L5; Grep `\[FAIL\]` over `tests/report.md` returned 0 matches (zero `[FAIL]` rows). Read-only verification â€” no full-harness re-run performed (per orchestrator brief; report fresh and consistent).
- **Acceptance row**: `docs/product/acceptance.md` L150 US-0122 remains `- [ ]` (unchecked). US-0122 NOT marked DONE.
- **Backlog**: US-0122 row NOT mutated by verify-work (closure owns the flip per US-0120 / DEC-0082).
- **Prior qa loop-2 proof**: NOT reused (ttl `2026-08-24T14:10:00Z`; consumed at `2026-08-24T13:16:00Z` before expiry â€” OK). New verify-work loop-2 proof minted.

## Compose guards (5/5 UNCHANGED â€” verified read-only, verify-work loop-2)

| Compose target | Verification | Result |
|---|---|---|
| US-0003 (role identifiers) | `template/.opencode/agents/*.md` stems additive only | read-only |
| US-0023 / BUG-0006 (spawn-only) | `auto` Task 7-role allow + `*` deny last | read-only |
| US-0121 (pack path) | `template/.opencode/**`; no repo-root `opencode.json` | read-only |
| US-0102 / DEC-0087 (volatile-ID) | no vendor slugs in template agents | read-only |
| US-0002 / US-0004 (do-not-port) | markdown agents; no `.mdc` clone | read-only |

## AC status (this verify-work loop-2 run)

All 10 ACs PASS at live + static layer (8/8 contract-test markers PASSED live). No new AC breaks. 3 non-blocking carry-forwards from qa (deferred per scope discipline; not blocking). US-0122 NOT flipped to DONE; acceptance boxes NOT ticked (closure owns that at `/release` â†’ `/closure` per US-0120 / DEC-0082).

## Strict runtime proof (US-0056 / DEC-0038)

- runtime_proof_id=rp-auto-20260824-01-verify-work-qa-20260824T131600Z-US-0122 (NEW; not reused)
- proof_hash=47C37682F5F8861E4A2D6F2515390D3F4ADE0EE8D5C5DEA61A552B21A979A409
- proof_ttl=2026-08-24T14:16:00Z (UTC = issued_at + 3600s)
- proof_ttl_seconds=3600
- Canonical payload (sorted-key JSON per DEC-0038): `{"delivery_mode":"ultra_lean","macro_phase":"build+verify","model_id":"glm-5.2-high","orchestrator_run_id":"auto-20260824-01","phase_id":"verify-work","proof_issued_at":"2026-08-24T13:16:00Z","proof_ttl_seconds":3600,"role":"qa","runtime_proof_id":"rp-auto-20260824-01-verify-work-qa-20260824T131600Z-US-0122","sprint_id":"S0122","story_id":"US-0122"}`

## Stop condition

STOP after verify-work loop-2. Do not spawn `/release` from this QA subagent (BUG-0006). Hand off via artifacts only: `sprints/S0122/uat.json` + `sprints/S0122/uat.md` + `sprints/S0122/verify-work-findings.md` + `docs/engineering/state.md` (verify-work loop-2 checkpoint + isolation evidence + runtime proof tuple) + this handoff + `handoffs/resume_brief.md` (prepend). The orchestrator reroutes to `/release` in a fresh release subagent.

---

# Verify-work â†’ Release handoff â€” US-0122 / S0122 (PASS; 8/8 live; parity OK; 0 blocking)

- sprint_id: S0122
- story_id: US-0122
- phase_id: verify-work
- role: qa (fresh per BUG-0006)
- orchestrator_run_id: auto-20260824-01
- delivery_mode: ultra_lean
- macro_phase: build+verify
- fresh_context_marker: qa-US0122-verify-work-20260824T123500Z-fresh (new; not reused)
- timestamp: 2026-08-24T12:35:00Z (UTC)
- model_id: glm-5.2-high (CROSS_MODEL_REVIEW=1 â€” required)
- producer_model_id: glm-5.2-high (qa phase)
- producer_runtime_proof_id: rp-auto-20260824-01-qa-qa-20260824T123000Z-US-0122
- producer_proof_hash: 3A4C860B7CEBE1D0CC6204AF82A86E49AB61FDF59B2C257DAC15BE92527EEB8E
- producer_proof_ttl: 2026-08-24T13:30:00Z (consumed before expiry)
- verdict: **PASS** (10/10 ACs pass; 8/8 contract-test markers PASSED live; parity OK; 0 blocking findings)
- blocking_findings: 0
- non_blocking_findings: 3 (carried forward from qa; do not block release)
- tests_run: 8 live (python 3.12.10; pytest 9.1.1; 8/8 PASSED in 0.03s)
- next_scheduled_phase: /release
- next_scheduled_role: release
- stop_condition: STOP after verify-work; do not spawn /release from this QA subagent. Orchestrator reroutes.

## UAT summary

- **Total steps**: 10 | **Passed**: 10 | **Failed**: 0 (passed + failed = total â€” DEC-0009)
- **AC-1..AC-10**: all PASS (see `sprints/S0122/uat.md` for per-AC evidence).
- **Probe results**: 6 (all `UAT_PROBE_PASS` â€” contract gate, parity, locked-matrix, runbook h2, compose guards, byte-identical mirrors).
- **Browser probe**: not used (pack/contract story â€” no web UI; static contract-test mapping justified per US-0092 / DEC-0078).

## Live re-verification evidence (this verify-work run â€” no rubber-stamp)

- **Live pytest**: `python -m pytest tests/us0122_contract_test.py -v` â†’ **8/8 PASSED in 0.03s** (Python 3.12.10; pytest 9.1.1; collected 8 items).
- **Parity**: `python scripts/check_intake_template_parity.py --repo . --scope=opencode-adapter` â†’ `[INTAKE_TEMPLATE_PARITY_OK] scope=opencode-adapter` (exit 0).
- **Full-harness report**: NOT claimed. `tests/report.md` not re-read this run; no `Fail: 0` full-harness claim made.
- **Acceptance row**: `docs/product/acceptance.md` L150 US-0122 remains `- [ ]` (unchecked). US-0122 NOT marked DONE.
- **Backlog**: US-0122 row NOT mutated by verify-work (closure owns the flip per US-0120 / DEC-0082).
- **Prior qa proof**: NOT reused (ttl 2026-08-24T13:30:00Z; consumed at 12:35Z before expiry â€” OK). New verify-work proof minted.

## Compose guards (5/5 UNCHANGED â€” verified read-only, verify-work)

| Compose target | Verification | Result |
|---|---|---|
| US-0003 (role identifiers) | `template/.opencode/agents/*.md` stems additive only | read-only |
| US-0023 / BUG-0006 (spawn-only) | `auto` Task 7-role allow + `*` deny last | read-only |
| US-0121 (pack path) | `template/.opencode/**`; no repo-root `opencode.json` | read-only |
| US-0102 / DEC-0087 (volatile-ID) | no vendor slugs in template agents | read-only |
| US-0002 / US-0004 (do-not-port) | markdown agents; no `.mdc` clone | read-only |

## AC status (this verify-work run)

All 10 ACs PASS at live + static layer (8/8 contract-test markers PASSED live). No new AC breaks. 3 non-blocking carry-forwards from qa (deferred per scope discipline; not blocking). US-0122 NOT flipped to DONE; acceptance boxes NOT ticked (closure owns that at `/release` â†’ `/closure` per US-0120 / DEC-0082).

## Strict runtime proof (US-0056 / DEC-0038)

- runtime_proof_id=rp-auto-20260824-01-verify-work-qa-20260824T123500Z-US-0122 (NEW; not reused)
- proof_hash=FA63C2D8B63CD911A8EDFFB0A8F36CFC35FC5D16A796EEE6225483427E01FEA0
- proof_ttl=2026-08-24T13:35:00Z (UTC = issued_at + 3600s)
- Canonical payload (sorted-key JSON per DEC-0038): `{"delivery_mode":"ultra_lean","macro_phase":"build+verify","model_id":"glm-5.2-high","orchestrator_run_id":"auto-20260824-01","phase_id":"verify-work","proof_issued_at":"2026-08-24T12:35:00Z","proof_ttl_seconds":3600,"role":"qa","runtime_proof_id":"rp-auto-20260824-01-verify-work-qa-20260824T123500Z-US-0122","sprint_id":"S0122","story_id":"US-0122"}`

## Stop condition

STOP after verify-work. Do not spawn `/release` from this QA subagent (BUG-0006). Hand off via artifacts only: `sprints/S0122/uat.json` + `sprints/S0122/uat.md` + `sprints/S0122/verify-work-findings.md` + `docs/engineering/state.md` (verify-work checkpoint + isolation evidence + runtime proof tuple) + this handoff + `handoffs/resume_brief.md` (prepend). The orchestrator reroutes to `/release` in a fresh release subagent.

---

# Verify-work â†’ Release handoff â€” US-0121 / S0121 (PASS; LIVE 14/14; B-1 closed; 0 new defects)

- sprint_id: S0121
- story_id: US-0121
- phase_id: verify-work
- role: qa (fresh per BUG-0006)
- orchestrator_run_id: auto-20260824-01
- delivery_mode: ultra_lean
- macro_phase: build+verify
- fresh_context_marker: qa-US0121-verify-work-20260824T105200Z-fresh (new; not reused)
- timestamp: 2026-08-24T10:52:00Z (UTC)
- model_id: glm-5.2-high (CROSS_MODEL_REVIEW=1 â€” required)
- verdict: **PASS** (10/10 ACs pass; 14/14 contract-test markers PASSED live; B-1 closed; 0 blocking findings; 0 new product defects)
- blocking_findings: 0
- non_blocking_findings: 4 (NB-1 CLOSED for this env; NB-2..NB-4 carried forward; do not block release)
- tests_run: 14 live (python 3.12.10 on PATH; pytest 9.1.1; 14/14 PASSED in 3.43s)
- next_scheduled_phase: /release
- stop_condition: STOP after verify-work; do not spawn /release from this QA subagent. Orchestrator reroutes.

## UAT summary

- **Total steps**: 10 | **Passed**: 10 | **Failed**: 0
- **AC-1..AC-10**: all PASS (see sprints/S0121/uat.md for per-AC evidence).
- **Probe results**: 1 (cli_smoke pytest â€” **UAT_PROBE_PASS**, 14/14 live; NB-1 CLOSED for this env).
- **B-1 status**: CLOSED (independently re-verified this run: Grep `apiKey|api_key|sk-|MODEL=` on template/.opencode -> 0 hits; tightened regex L248; README L45 rephrased; live marker 12 PASSED).

## Live re-verification evidence (this verify-work run â€” no rubber-stamp)

- **Live pytest**: `python -m pytest tests/us0121_host_mode_test.py -v` â†’ **14/14 PASSED in 3.43s** (Python 3.12.10 on PATH; pytest 9.1.1; collected 14 items).
- **Canonical harness report**: `tests/report.md` @ 2026-08-24T10:45:36Z â†’ `Pass: 845` / `Fail: 0` (literal zero at L5); zero `[FAIL]` rows (Grep-verified this run).
- **Manifest byte-identity** (active â†” template) SHA-256 = `4AC96FF8A3B9EA2B025A93D787526B0E6343B662BA78BB0C8A72B186697082B5`.
- **Parity script byte-identity** (active â†” template) SHA-256 = `E479211A556543C91972D1E9417A4F31058791A0DA03A9EDE26A67507458B647`.
- **Test pair byte-identity** (active â†” template) SHA-256 = `F3A6075783B87851C6529B0AC8C788449E43E815AE2EEA0511157A55AD6AF83B`.
- **No-secrets re-check**: Grep `apiKey|api_key|sk-|MODEL=` on `template/.opencode` â†’ 0 hits (independently re-verified this run via Grep tool).
- **Prior verify-work proof**: STALE (ttl 2026-08-23T13:00:00Z) â€” NOT reused. New proof minted this run.

## Compose guards (5/5 UNCHANGED â€” verified read-only, verify-work)

| Compose target | Verification | Result |
|---|---|---|
| US-0008 (CLI installer) | additive --host only; missing/overwrite/clean/upgrade semantics unchanged | read-only |
| DEC-0045 (its_magic/ ownership) | unchanged | read-only |
| US-0102 (volatile-ID rule) | template ships no slugs; *.local.json{,c} gitignore mirrors kit convention | read-only |
| US-0001 (phase names) | placeholders only; no command body clone | read-only |
| US-0018 (packaging delivery) | installer delivery path unchanged except additive --host forward | read-only |

## AC status (this verify-work run)

All 10 ACs PASS at live + static layer (14/14 contract-test markers PASSED live). No new AC breaks. NB-1 CLOSED for this env (python 3.12.10 on PATH). NB-2/NB-3/NB-4 carried forward (deferred per scope discipline; not blocking). US-0121 not flipped to DONE; acceptance boxes not ticked (closure owns that at `/release` â†’ `/closure` per US-0120 / DEC-0082).

## Strict runtime proof (US-0056 / DEC-0038)

- runtime_proof_id=rp-auto-20260824-01-verify-work-qa-20260824T105200Z-US-0121 (NEW; not reused)
- proof_hash=5DF2AB193AA53A4163418A6808B111CED877195295326ADA326FA0759EA4127D
- proof_ttl=2026-08-24T11:52:00Z (UTC = issued_at + 3600s)
- Canonical payload (sorted-key JSON per DEC-0038): `{"delivery_mode":"ultra_lean","macro_phase":"build+verify","model_id":"glm-5.2-high","orchestrator_run_id":"auto-20260824-01","phase_id":"verify-work","proof_issued_at":"2026-08-24T10:52:00Z","proof_ttl_seconds":3600,"role":"qa","runtime_proof_id":"rp-auto-20260824-01-verify-work-qa-20260824T105200Z-US-0121","sprint_id":"S0121","story_id":"US-0121"}`

## Stop condition

STOP after verify-work. Do not spawn `/release` from this QA subagent (BUG-0006). Hand off via artifacts only: `sprints/S0121/uat.json` + `sprints/S0121/uat.md` + `docs/engineering/state.md` (verify-work checkpoint + traceability update) + this handoff + `handoffs/resume_brief.md` (prepend). The orchestrator reroutes to `/release` in a fresh subagent.
