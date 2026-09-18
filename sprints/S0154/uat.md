# UAT — S0154 / US-0147 (verify-work)

- **uat_lifecycle**: populated (`verified_ready=true` for `/release`)
- **sprint_id**: S0154
- **story_id**: US-0147
- **orchestrator_run_id**: auto-20260917-us0146
- **phase_id**: verify-work
- **role**: qa
- **fresh_context_marker**: qa-US0147-verify-20260917T212000Z-fresh
- **timestamp**: 2026-09-17T21:20:00Z
- **story_status**: OPEN (US-0045 — acceptance/backlog ACs unchecked until closure)
- **probe_kind**: contract_tests_primary
- **live_chrome_probed**: false
- **fake_browser_pass_claimed**: false

## UAT steps

| Step | AC | Description | Result |
|------|-----|-------------|--------|
| UAT-1 | AC-1 | Supported Windows/Linux install/update flows with rollback guidance | **pass** |
| UAT-2 | AC-2 | Fresh init without historical backlog clone | **pass** |
| UAT-3 | AC-3 | Existing repo adoption without rewriting canonical artifacts | **pass** |
| UAT-4 | AC-4 | Cursor/OpenCode coexistence; standalone host-optional | **pass** |
| UAT-5 | AC-5 | Preservation of locals, credentials, profiles, user artifacts | **pass** |
| UAT-6 | AC-6 | Kernel/runtime mismatch diagnostics and safe rollback | **pass** |
| UAT-7 | AC-7 | Operator documentation (setup, adoption, update, uninstall) | **pass** |
| UAT-8 | AC-8 | Lifecycle test matrix (fresh, upgrade, adopt, interrupt, uninstall) | **pass** |
| convergence_smoke | — | Waived-probe slice surrogate (US-0128) | **pass** |

## Browser probe (UAT_BROWSER_PROBE_MODE=cursor)

- Explicit `itsm setup browser` gate only; live `browser_smoke` **`UAT_PROBE_FORBIDDEN`**.
- Cursor MCP `browser_navigate` / screenshots **not run** — no fake browser PASS.
- See `uat.json` `probe_results[]` step `browser_smoke` and `waived_probes[]`.

## Contract evidence (verify-work live)

- Command: `python -m pytest tests/us0147_contract_test.py`
- Result: **10 passed** in **0.11s** (**10/10** `test_us0147_*`)
- Compose regression: **140/140** `npm test` (qa attestation 2026-09-17T21:10:00Z; not re-run verify-work)

## Waived live-runtime probe classes

All six classes: **`UAT_PROBE_FORBIDDEN`** (`browser_smoke`, `api_health`, `process_health`, `cli_smoke`, `build`, `manual_operator`).

## Results summary

- **Total**: 9
- **Passed**: 9
- **Failed**: 0
- **Verdict**: VERIFY_WORK_PASS
- **Strict proof**: `rp-auto-20260917-us0146-verify-work-qa-20260917T212000Z-US-0147` / `D53214A54301469C6CACC27988350CC3FD3739F1E99738DBCBFE9B6974E70310`
- **Acceptance criteria**: AC-1..AC-8 independently satisfied at UAT layer; portfolio checkboxes remain unchecked per US-0045 until `/closure`.
- **Next**: `/release` (fresh release subagent; BUG-0006) — orchestrator spawn only; STOP before release in this subagent.
