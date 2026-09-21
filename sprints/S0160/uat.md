# UAT — Sprint S0160 / BUG-0027 (verify-work populated)

- **uat_lifecycle**: populated (DEC-0009 — placeholder → populated at `/verify-work`; `verified_ready=true` for `/release`)
- **sprint_id**: S0160
- **bug_id**: BUG-0027
- **story_id**: (none)
- **orchestrator_run_id**: auto-20260921-bug0027
- **phase_id**: verify-work
- **role**: qa
- **fresh_context_marker**: qa-BUG0027-verify-20260921T220700Z-fresh
- **timestamp**: 2026-09-21T22:07:00Z
- **story_status**: OPEN (US-0045 — acceptance/backlog ACs unchecked until closure)
- **probe_kind**: contract_tests_primary
- **live_opencode_cli_tui_pass_claimed**: false
- **toast_repair_claimed**: false
- **fake_browser_pass_claimed**: false
- **harness_fail_zero_claimed**: false
- **Machine-readable**: `sprints/S0160/uat.json`
- **Status**: **PASS** (verify-work; contract slice)
- **verified_ready**: true
- **convergence_smoke**: pass (`contract_test_failed=0`)
- **blocking_findings**: 0

## Target stories and acceptance criteria (from backlog `### BUG-0027`)

- **AC-1**: A direct OpenCode phase command (`/intake`, `/execute`, `/qa`, or `/verify-work`) runs its canonical role with the artifact write permissions required by that phase, or fails before work with a precise operator-visible reason code. — **PASS (slice)**
- **AC-2**: A successful manual phase run persists its canonical sprint/handoff artifacts and an isolation checkpoint linked to the current story or bug and sprint; it does not report success while persistence was denied. — **PASS (slice)**
- **AC-3**: The OpenCode lifecycle bridge carries a real parent session and run context (`storyId`, `sprintId`, `orchestratorRunId`) through plugin/RPC dispatch; placeholder identifiers such as `tui-auto` cannot satisfy release evidence. — **PASS (slice)**
- **AC-4**: `/auto` remains BUG-0024 scope. The manual-phase fix neither claims to repair its CLI/TUI dispatch toast nor fabricates strict-proof tuples when the orchestrator is unavailable. — **PASS (slice)**
- **AC-5**: OpenCode command templates use a supported intake-evidence validation invocation; the invalid `intake_evidence_validate.py --repo . --enforce` invocation is removed from active and template command packs. — **PASS (slice)**
- **AC-6**: Contract tests cover direct manual phase execution, denied-persistence failure, context propagation, validator invocation, and active/template parity. — **PASS (slice)**

Primary acceptance (`docs/product/acceptance.md` BUG-0027 row) remains **unchecked**. Backlog AC-1..AC-6 remain **unchecked** (closure ownership).

## Executed verification steps and results

| Step | AC | Description | Result |
|------|-----|-------------|--------|
| UAT-1 | AC-1 | Direct `/execute` (or `/intake`) persists with required writes or fail-closed before work | **pass** (slice; live OpenCode `UAT_PROBE_FORBIDDEN`) |
| UAT-2 | AC-2 | Persist-or-not-success; no success while persist denied | **pass** |
| UAT-3 | AC-3 | Real session/run IDs; `tui-auto` rejected as release evidence | **pass** |
| UAT-4 | AC-4 | `/auto` toast unamended; no fabricated proofs | **pass** |
| UAT-5 | AC-5 | Supported validator CLI; `--repo . --enforce` removed | **pass** |
| UAT-6 | AC-6 | Ten `test_bug0027_*`; active↔template parity | **pass** |
| convergence_smoke | — | Waived-probe slice with green contract-test harness | **pass** |

## Waived live-runtime probe classes

All six classes: **`UAT_PROBE_FORBIDDEN`** (`browser_smoke`, `api_health`, `process_health`, `cli_smoke`, `build`, `manual_operator`). **No live OpenCode PASS. No toast-repair claim. No fake browser PASS.**

## Contract evidence (verify-work live)

- Command: `python -m pytest tests/bug0027_opencode_manual_phase_persist_test.py -v`
- Result: **10 passed** in **0.79s**, fail **0**
- Compose: us0125+bug0016+bug0024+bug0015+us0124+us0122+bug0018+bug0019 **66 passed** in **3.37s**
- Parity: `python scripts/check_intake_template_parity.py --repo . --scope bug-0027` → **[INTAKE_TEMPLATE_PARITY_OK]**
- Metadata: exit **0**
- Bug/acceptance validator: **[BUG_VALIDATION_OK]**
- UAT probe lib: **[UAT_PROBE_LIB_SELF_TEST_OK]**
- Colliding `auto.md`: **absent** (active + template); 14 peer markdown commands
- Keep surfaces: `.opencode/agents/auto.md`, `.cursor/commands/auto.md` **present**

## Results summary (acceptance linkage)

| AC | UAT step(s) | Result |
|----|-------------|--------|
| AC-1 | UAT-1 | **PASS** (slice; live OpenCode residual NB1) |
| AC-2 | UAT-2 | **PASS** (slice) |
| AC-3 | UAT-3 | **PASS** (slice) |
| AC-4 | UAT-4 | **PASS** |
| AC-5 | UAT-5 | **PASS** |
| AC-6 | UAT-6 | **PASS** |

**Coverage**: 6/6 AC mapped; 7/7 UAT steps pass; passed + failed = total (DEC-0009).

## Residual (non-blocking)

- **NB1 LIVE_OPENCODE_MANUAL_PHASE_RESIDUAL**: CI cannot prove live `command.executed` / `persistManualPhaseIsolation` against OpenCode. Residual `OPENCODE_MANUAL_PHASE_PERSIST_NOT_INVOKED` possible until operator re-probe after ship.

## Next

- **`/release`** (fresh **release** subagent). Do not mark BUG-0027 DONE. Do not tick AC. Do not claim toast repair. Do not spawn `/release` from this qa subagent.
