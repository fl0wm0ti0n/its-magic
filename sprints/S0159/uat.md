# UAT — Sprint S0159 / BUG-0024 (release verified)

- **uat_lifecycle**: verified (DEC-0009 — populated→verified at `/release` 2026-09-21T20:12:00Z)
- **sprint_id**: S0159
- **bug_id**: BUG-0024
- **story_id**: (none)
- **orchestrator_run_id**: auto-20260921-bug0024
- **phase_id**: release
- **role**: release
- **fresh_context_marker**: release-BUG0024-20260921T201200Z-fresh
- **timestamp**: 2026-09-21T20:12:00Z
- **story_status**: OPEN (US-0045 — acceptance/backlog ACs unchecked until closure)
- **probe_kind**: contract_tests_primary
- **live_opencode_cli_tui_pass_claimed**: false
- **fake_browser_pass_claimed**: false
- **harness_fail_zero_claimed**: false
- **Machine-readable**: `sprints/S0159/uat.json`
- **Status**: **PASS** (release; contract slice)
- **verified_ready**: true
- **verified_at**: 2026-09-21T20:12:00Z
- **convergence_smoke**: pass (`contract_test_failed=0`)
- **blocking_findings**: 0

## Target acceptance criteria (from backlog `### BUG-0024`)

- **AC-1**: Listed CLI TUI `/auto` starts `runAutoLifecycle` (or honest `OPENCODE_*` only when the host truly cannot dispatch) — **PASS (slice)**
- **AC-2**: `OPENCODE_AUTO_TUI_DISPATCH_UNSUPPORTED` toast is not the happy path — **PASS (slice)**
- **AC-3**: Must not restore STOP-only `.opencode/commands/auto.md` — **PASS**
- **AC-4**: Must not JSON-template `/auto` (`commands.auto` + `template`) — **PASS**
- **AC-5**: Plugin `editor.add` execute retained (compose BUG-0018 A*) — **PASS**
- **AC-6**: Additive tests would have caught this live miss; CI remains `UAT_PROBE_FORBIDDEN` for live OpenCode CLI — **PASS**
- **AC-7**: Consumer upgrade overwrites the live dispatch path + still prunes leftover `auto.md` — **PASS**
- **AC-8**: Active↔template parity — **PASS**

## Executed verification steps and results

| Step | AC | Description | Result |
|------|-----|-------------|--------|
| UAT-1 | AC-1 | Listed CLI TUI `/auto` starts lifecycle or honest stage `OPENCODE_*` | **pass** |
| UAT-2 | AC-2 | DISPATCH not happy path (umbrella-only) | **pass** |
| UAT-3 | AC-3 | Must not restore STOP-only `auto.md` | **pass** |
| UAT-4 | AC-4 | Must not JSON-template `/auto` | **pass** |
| UAT-5 | AC-5 | Plugin `editor.add` retained | **pass** |
| UAT-6 | AC-6 | Additive `test_bug0024_*`; live CLI `UAT_PROBE_FORBIDDEN` | **pass** |
| UAT-7 | AC-7 | Upgrade overwrite + prune | **pass** |
| UAT-8 | AC-8 | Active↔template parity | **pass** |
| convergence_smoke | — | Waived-probe slice surrogate (US-0128) | **pass** |

## Waived live-runtime probe classes

All six classes: **`UAT_PROBE_FORBIDDEN`** (`browser_smoke`, `api_health`, `process_health`, `cli_smoke`, `build`, `manual_operator`). **No live OpenCode CLI TUI PASS.**

## Contract evidence (verify-work live)

- Command: `python -m pytest tests/bug0024_opencode_cli_tui_live_dispatch_residual_test.py -v`
- Result: **8 passed** in **0.52s**, fail **0**
- Compose: bug0023+0021+0020+0019+0018 **37 passed** in **0.71s**
- Parity: `python scripts/check_intake_template_parity.py --repo . --scope bug-0024` → **[INTAKE_TEMPLATE_PARITY_OK]**
- Metadata: exit **0**
- Colliding `auto.md`: **absent** (active + template); 14 peer markdown commands

## Results summary (acceptance linkage)

| AC | UAT step(s) | Result |
|----|-------------|--------|
| AC-1 | UAT-1 | **PASS** (slice; live CLI residual NB1) |
| AC-2 | UAT-2 | **PASS** (slice) |
| AC-3 | UAT-3 | **PASS** |
| AC-4 | UAT-4 | **PASS** |
| AC-5 | UAT-5 | **PASS** |
| AC-6 | UAT-6 | **PASS** |
| AC-7 | UAT-7 | **PASS** |
| AC-8 | UAT-8 | **PASS** |

## Residual (non-blocking)

- **NB1 LIVE_OPENCODE_CLI_TUI_RESIDUAL**: CI cannot prove live peer-branded `client.rpc(Defined)` against OpenCode CLI TUI. Residual DISPATCH/stage toasts possible until operator re-probe after ship.

## Next

- **`/closure`** (fresh **qe** default; curator fallback if qe unavailable) for **S0159** / **BUG-0024** — do not mark DONE from release; do not claim live OpenCode CLI TUI PASS unless operator probe is in scope.
