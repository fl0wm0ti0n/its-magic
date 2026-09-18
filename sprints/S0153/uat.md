# UAT — S0153 / US-0146 (verify-work)

- **uat_lifecycle**: populated (`verified_ready=true` for `/release`)
- **sprint_id**: S0153
- **story_id**: US-0146
- **orchestrator_run_id**: auto-20260917-us0146
- **phase_id**: verify-work
- **role**: qa
- **fresh_context_marker**: qa-US0146-verify-20260917T194500Z-fresh
- **timestamp**: 2026-09-17T19:45:00Z
- **story_status**: OPEN (US-0045 — acceptance/backlog ACs unchecked until closure)
- **probe_kind**: contract_tests_primary
- **live_chrome_probed**: false
- **fake_browser_pass_claimed**: false

## UAT steps

| Step | AC | Description | Result |
|------|-----|-------------|--------|
| UAT-1 | AC-1 | `itsm` interactive/direct commands + lifecycle slash equivalents | **pass** |
| UAT-2 | AC-2 | Status snapshot (project, phase, model, health, index, browser, token, cost) | **pass** |
| UAT-3 | AC-3 | Run timeline with evidence links | **pass** |
| UAT-4 | AC-4 | TUI client-only panels (no workflow ownership) | **pass** |
| UAT-5 | AC-5 | Metrics/token-cost compose without dual-write | **pass** |
| UAT-6 | AC-6 | Approval/failure prompts interactive + non-interactive | **pass** |
| UAT-7 | AC-7 | Bounded log summaries + evidence refs | **pass** |
| UAT-8 | AC-8 | Integration: parity, cancel, reconnect, narrow terminal | **pass** |
| convergence_smoke | — | Waived-probe slice surrogate (US-0128) | **pass** |

## Browser probe (UAT_BROWSER_PROBE_MODE=cursor)

- Story is **not** browser-owned; live `browser_smoke` **`UAT_PROBE_FORBIDDEN`**.
- Cursor MCP `browser_navigate` / screenshots **not run** — no fake browser PASS.
- See `uat.json` `probe_results[]` step `browser_smoke` and `waived_probes[]`.

## Contract evidence (verify-work live)

- Command: `node --experimental-strip-types --test tests/contract/us0146.contract.test.ts` (cwd `standalone/`)
- Result: **10 passed**, fail **0**, duration_ms **245.3431** (**9/9** `test_us0146_*`)
- Compose regression: **140/140** `npm test` (qa attestation 2026-09-17T19:30:00Z; not re-run verify-work)

## Waived live-runtime probe classes

All six classes: **`UAT_PROBE_FORBIDDEN`** (`browser_smoke`, `api_health`, `process_health`, `cli_smoke`, `build`, `manual_operator`).

## Results summary

- **Total**: 9
- **Passed**: 9
- **Failed**: 0
- **Verdict**: VERIFY_WORK_PASS
- **Strict proof**: `rp-auto-20260917-us0146-verify-work-qa-20260917T194500Z-US-0146` / `A8E9B2BB6112D320D836847606CF3E8CA473196327C6DB8F929A404CC63F2C97`
- **Acceptance criteria**: AC-1..AC-8 independently satisfied at UAT layer; portfolio checkboxes remain unchecked per US-0045 until `/closure`.
- **Next**: `/release` (fresh release subagent; BUG-0006)
