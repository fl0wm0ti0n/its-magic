# UAT — Sprint S0161 / BUG-0030 (verify-work populated)

- **uat_lifecycle**: populated (DEC-0009 — placeholder → populated at `/verify-work`; `verified_ready=true` for `/release`)
- **sprint_id**: S0161
- **bug_id**: BUG-0030
- **story_id**: (none)
- **orchestrator_run_id**: auto-20260927-bug0030
- **phase_id**: verify-work
- **role**: qa
- **fresh_context_marker**: qa-BUG0030-verify-20260927T095500Z-fresh
- **timestamp**: 2026-09-27T09:55:00Z (UTC)
- **story_status**: OPEN (US-0045 — acceptance/backlog ACs unchecked until closure)
- **probe_kind**: live_opencode_session_command (primary AC-1/AC-4) + contract_tests_primary
- **live_opencode_session_command_pass_claimed**: true (prompt admission only)
- **live_opencode_cli_tui_pass_claimed**: false
- **toast_repair_claimed**: false
- **fake_browser_pass_claimed**: false
- **provider_completion_claimed**: false
- **harness_fail_zero_claimed**: false
- **Machine-readable**: `sprints/S0161/uat.json`
- **Status**: **PASS** (verify-work; required AC-1/AC-4 real-host evidence + contract slice)
- **verified_ready**: true
- **convergence_smoke**: pass (`contract_test_failed=0`)
- **blocking_findings**: 0

## Target bug and acceptance criteria (from backlog `### BUG-0030`)

- **AC-1**: In the supported OpenCode 1.18.32 CLI TUI, invoking `/auto` selects the existing `auto` agent and admits the canonical spawn-only orchestration prompt instead of returning `OPENCODE_AUTO_TUI_DEFINED_UNBRANDED`. — **PASS**
- **AC-2**: `.opencode/commands/auto.md` is the framework-owned, documented command registration surface; its frontmatter selects `agent: auto` and its body is not STOP-only. — **PASS**
- **AC-3**: The `/auto` route contains no `@opencode/plugin/rpc`, `localRpcDefine`, `client.rpc`, `ctx.rpc.register`, or invented localhost endpoint. — **PASS**
- **AC-4**: Tests include a host-real integration contract or reproducible OpenCode smoke path that proves `/auto` selects `auto` and admits the command prompt; mock-only success is insufficient. — **PASS**
- **AC-5**: Upgrade installs the managed command, removes the managed legacy TUI/RPC route without overwriting unrelated user configuration, and preserves active/template parity. — **PASS**

Primary acceptance (`docs/product/acceptance.md` BUG-0030 row) remains **unchecked**. Backlog AC-1..AC-5 remain **unchecked** (closure ownership).

## Executed verification steps and results

| Step | AC | Description | Result |
|------|-----|-------------|--------|
| UAT-1 | AC-1 | Real host `/auto` selects `auto` and admits canonical prompt (no UNBRANDED abort) | **pass** (live session-command, model openai/gpt-5.6-terra, 5 passed/1 skipped) |
| UAT-2 | AC-2 | `auto.md` command surface: `agent: auto`, non-STOP body | **pass** |
| UAT-3 | AC-3 | No private RPC/TUI tokens on active `/auto` route | **pass** |
| UAT-4 | AC-4 | Host-real prompt-admission proof (mock-only insufficient) | **pass** (live `session.command("auto")`) |
| UAT-5 | AC-5 | Upgrade installs managed command, removes legacy TUI/RPC, preserves unrelated config | **pass** |
| UAT-6 | AC-5 | Active/template parity via canonical validator | **pass** (`--scope all` OK) |

## Waived live-runtime probe classes

`browser_smoke`, `api_health`, `process_health`, `manual_operator`: **`UAT_PROBE_FORBIDDEN`**. **No toast-repair claim. No full-lifecycle provider completion claim. No fake browser PASS.**

## Contract evidence (verify-work live)

- Command: `python -m pytest tests/bug0030_opencode_auto_command_test.py -q`
- Result: with `ITS_MAGIC_OPENCODE_SESSION_SMOKE=1` + `ITS_MAGIC_OPENCODE_SMOKE_MODEL=openai/gpt-5.6-terra` → **5 passed, 1 skipped** (the session-command smoke PASSED)
- Compose (no regressions):
  - `bug0027_opencode_manual_phase_persist_test.py` → **10 passed, 1 skipped**
  - `bug0015/0018/0019/0020/0021/0023/0024` → **superseded (skipped)** — retired private TUI/RPC route, expected
- Parity: `python scripts/check_intake_template_parity.py --repo . --scope all` → **[INTAKE_TEMPLATE_PARITY_OK]**
- Bug/acceptance validator: `python scripts/bug_issue_validate.py --repo . --check-acceptance` → **[BUG_VALIDATION_OK]**
- `auto.md` present (active + template, `agent: auto`); `.opencode/agents/auto.md` present
- Legacy `its-magic-auto/{index,tui,rpc}.ts` absent (active + template); `tui.json plugin[]` empty; orchestrator setup has no `ctx.rpc.register`

## Results summary (acceptance linkage)

| AC | UAT step(s) | Result |
|----|-------------|--------|
| AC-1 | UAT-1 | **PASS** (live session-command prompt admission) |
| AC-2 | UAT-2 | **PASS** |
| AC-3 | UAT-3 | **PASS** |
| AC-4 | UAT-4 | **PASS** (live, not mock) |
| AC-5 | UAT-5, UAT-6 | **PASS** |

**Coverage**: 5/5 AC mapped; 6/6 UAT steps pass; passed + failed = total (DEC-0009).

## Residual (non-blocking)

- **NB1 FULL_LIFECYCLE_PROVIDER_COMPLETION**: verify-work proves `/auto` prompt admission + agent selection. Full phase-spawn lifecycle completion (provider-driven) remains operator UAT after release — no provider completion claimed this pass.

## Next

`verified_ready=true` → `/release` (role release) may run after this; BUG-0030 acceptance remains unchecked until closure.
