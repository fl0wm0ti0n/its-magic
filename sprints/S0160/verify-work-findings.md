# Verify-Work Findings — S0160 / BUG-0027

**Phase**: verify-work  
**Role**: qa (fresh subagent)  
**Bug**: BUG-0027 (OpenCode manual phase commands cannot persist canonical workflow evidence)  
**Sprint**: S0160  
**Orchestrator run**: auto-20260921-bug0027  
**Parent run**: ir-20260921T190544Z-bug0027  
**Verify-work timestamp**: 2026-09-21T22:07:00Z  
**Fresh context marker**: qa-BUG0027-verify-20260921T220700Z-fresh  
**model_id**: inherit (CROSS_MODEL_REVIEW=0)  
**delivery_mode**: ultra_lean  
**macro_phase**: build+verify (verify-work terminal of build+verify)  
**AUTO_QUIET**: 1  
**FRAMEWORK_KIT_REPO**: 1  
**Verdict**: VERIFY_PASS  

## Independent verify-work verification

Fresh QA subagent per US-0048 / BUG-0006. Marker is **new** (not reused `qa-BUG0027-qa-20260921T215200Z-fresh` or `dev-BUG0027-execute-20260921T214400Z-fresh`). Prior `/verify-work` spawn was interrupted with no artifacts — this is a full independent re-run. Consumed qa proof from state. Independent re-run of `python -m pytest tests/bug0027_opencode_manual_phase_persist_test.py -v` (**10 passed** fail 0 in **0.79s**) + compose us0125+bug0016+bug0024+bug0015+us0124+us0122+bug0018+bug0019 (**66 passed** in **3.37s**). UAT populated (DEC-0009) UAT-1..UAT-6 + `convergence_smoke`; `verified_ready=true` for `/release`. Probe class `contract_tests_primary`. Six live-runtime classes `UAT_PROBE_FORBIDDEN` including **live OpenCode CLI TUI `cli_smoke`**. **No fake live-Chrome PASS. No live OpenCode PASS. No toast-repair claim.** `live_opencode_cli_tui_pass_claimed=false`. `toast_repair_claimed=false`. `fake_browser_pass_claimed=false`. `harness_fail_zero_claimed=false`. No `.env`. No intake mutation. No DONE flip. No acceptance.md tick. Backlog AC-1..AC-6 remain **unchecked** (closure/QE per US-0045). Consumed qa proof `rp-auto-20260921-bug0027-qa-qa-20260921T215200Z-BUG-0027` / `4C93C4878501C9E8BF6966FE926733DB2B4DA7F67363E630FD2EEDE52482B6D5` MATCH before TTL 2026-09-21T22:52:00Z (not STALE; wall_clock 2026-09-21T22:06:12Z; consumed_at 2026-09-21T22:07:00Z). CROSS_MODEL_REVIEW=0 — no critic-of-qa consume required. Execute proof MATCH before TTL 2026-09-21T22:44:00Z. plan-verify merged PASS at /qa; not spawned. Cursor MCP browser sequence **not run** (manual-phase persist contract slice — fail-closed waiver). No live npm publish / git push / remote bind. No auto.md restore. Do not reopen BUG-0024. Do not merge/drain BUG-0022/0026.

## Test battery (live)

| Gate | Command / method | Result |
|------|------------------|--------|
| Pytest bug0027 | `python -m pytest tests/bug0027_opencode_manual_phase_persist_test.py -v` | **10 passed** fail 0 in **0.79s** |
| Compose us0125..bug0019 | pytest us0125+bug0016+bug0024+bug0015+us0124+us0122+bug0018+bug0019 | **66 passed** in **3.37s** (11+7+8+7+12+8+6+7) |
| Parity | `python scripts/check_intake_template_parity.py --repo . --scope bug-0027` | **[INTAKE_TEMPLATE_PARITY_OK]** |
| UAT probe lib | `python scripts/uat_probe_lib.py --self-test` | **[UAT_PROBE_LIB_SELF_TEST_OK]** |
| Metadata | `python scripts/check-user-visible-metadata.py --repo .` | **exit 0** |
| Bug/acceptance validator | `python scripts/bug_issue_validate.py --repo . --check-acceptance` | **[BUG_VALIDATION_OK]** |
| Colliding auto.md | path exists? | **absent** active + template; 14 peer md |
| Keep surfaces | `.opencode/agents/auto.md`, `.cursor/commands/auto.md` | **present** |
| QA proof consume | `compute_strict_proof_hash` 6-field tuple | **MATCH** `4C93C4878501C9E8BF6966FE926733DB2B4DA7F67363E630FD2EEDE52482B6D5`; ttl `2026-09-21T22:52:00Z`; consumed_at `2026-09-21T22:07:00Z` — **RUNTIME_PROOF_VALID** (not STALE) |
| Execute proof | `compute_strict_proof_hash` | **MATCH** `0A6D1399F910A2166D137FFCFA632C9D673FB381EA68E4D8A2056D7337590B33`; ttl `2026-09-21T22:44:00Z`; consumed_at `2026-09-21T22:07:00Z` — **RUNTIME_PROOF_VALID** |
| Acceptance row | `docs/product/acceptance.md` | `- [ ] BUG-0027` (not ticked) |
| Backlog | `### BUG-0027` Status | **OPEN**; AC-1..AC-6 **unchecked** |
| Compose guards | BUG-0024/0016 DONE; US-0125 DONE; BUG-0022/0026 OPEN | **HELD** |

## AC verification (architecture `# BUG-0027` A1 / R-0151)

| AC | Description | Result |
|----|-------------|--------|
| AC-1 | Direct phase runs with required writes or fail-closed before work | **PASS** (slice; UAT-1; markers 1, 10) |
| AC-2 | Persist-or-not-success; no success while persist denied | **PASS** (UAT-2; marker 2) |
| AC-3 | Real session/run IDs; `tui-auto` rejected as release evidence | **PASS** (UAT-3; markers 1, 3, 4) |
| AC-4 | `/auto` toast unamended; no fabricated proofs | **PASS** (UAT-4; markers 5, 6) |
| AC-5 | Supported validator CLI; `--repo . --enforce` removed | **PASS** (UAT-5; markers 7, 8) |
| AC-6 | Ten `test_bug0027_*`; active↔template parity | **PASS** (UAT-6; ten markers) |

## Runtime browser / live CLI evidence (US-0093 / BUG-0006)

- **UAT_BROWSER_PROBE_MODE**: cursor (default).
- Manual-phase persist contract slice — hermetic pytest only.
- Cursor MCP sequence **not run**.
- Live OpenCode CLI TUI **not probed** — `cli_smoke` **`UAT_PROBE_FORBIDDEN`** (fail-closed waiver; no fake PASS).
- `cursor_mcp_browser_sequence_run=false`.
- `live_opencode_cli_tui_pass_claimed=false`.
- `toast_repair_claimed=false`.

## UAT summary

- **Total**: 7 (UAT-1..UAT-6 + `convergence_smoke`)
- **Passed**: 7
- **Failed**: 0
- **uat_lifecycle**: populated + `verified_ready=true` for `/release`
- **Probe class**: `contract_tests_primary`
- **Waived live probes**: 6 × `UAT_PROBE_FORBIDDEN`

## Isolation compliance gate

| Phase | Marker | Result |
|-------|--------|--------|
| execute | `dev-BUG0027-execute-20260921T214400Z-fresh` | PASS |
| qa | `qa-BUG0027-qa-20260921T215200Z-fresh` | PASS |
| verify-work | `qa-BUG0027-verify-20260921T220700Z-fresh` | PASS (this phase) |

## Runtime proofs (full `rp-auto-…`)

| Phase | runtime_proof_id | proof_hash |
|-------|------------------|------------|
| execute | `rp-auto-20260921-bug0027-execute-dev-20260921T214400Z-BUG-0027` | `0A6D1399F910A2166D137FFCFA632C9D673FB381EA68E4D8A2056D7337590B33` (MATCH; consumed 22:07:00 before ttl 22:44:00) |
| qa (consumed) | `rp-auto-20260921-bug0027-qa-qa-20260921T215200Z-BUG-0027` | `4C93C4878501C9E8BF6966FE926733DB2B4DA7F67363E630FD2EEDE52482B6D5` (MATCH; consumed 22:07:00 before ttl 22:52:00; **not STALE**) |
| plan-verify | `rp-auto-20260921-bug0027-plan-verify-qa-20260921T215200Z-BUG-0027` | `6E70023DA9FFB5E66AE08F2F0D9C6A42FB06470AFA5D7408155B8D4F8E73847A` (ultra_lean merged PASS; not spawned) |
| verify-work (issued) | `rp-auto-20260921-bug0027-verify-work-qa-20260921T220700Z-BUG-0027` | `98DE3A16D39BF5B73CC5A4929A3DB2D7094C8D4020255B10D36720CB22A79F73` |

Canonical hashed payload (this phase): `{"orchestrator_run_id":"auto-20260921-bug0027","phase_id":"verify-work","proof_issued_at":"2026-09-21T22:07:00Z","proof_ttl_seconds":3600,"role":"qa","runtime_proof_id":"rp-auto-20260921-bug0027-verify-work-qa-20260921T220700Z-BUG-0027"}`  
`hash_recompute_confirmation=true`

## Generated-test evidence (US-0066)

- `generated_test_stack_profile`: python
- `generated_test_command`: `python -m pytest tests/bug0027_opencode_manual_phase_persist_test.py -v`
- `generated_test_result`: pass
- `generated_test_output_ref`: this file § Test battery (10 passed in 0.79s this pass; compose 66/66)
- `generated_test_paths_ref`: `tests/bug0027_opencode_manual_phase_persist_test.py`; `sprints/S0160/qa-findings.md`
- `generated_test_reason_code`: none (pass)

## Status (US-0045)

- backlog Status: **OPEN** (not DONE)
- acceptance BUG-0027: **unchecked**
- AC-1..AC-6: **unchecked** (closure/QE; independently verified this pass)
- BUG-0024/0016: DONE preserved (compose-only)
- US-0125: DONE (ACs stay `[x]`; named-CLI compose-amend only)
- BUG-0022 / BUG-0026: OPEN (not mutated)

## Non-blocking findings

1. **LIVE_OPENCODE_MANUAL_PHASE_RESIDUAL** — CI cannot prove live `command.executed` / `persistManualPhaseIsolation` against a running OpenCode CLI/TUI host (R-0119). Residual `OPENCODE_MANUAL_PHASE_PERSIST_NOT_INVOKED` possible until operator re-probes after ship. AC-1..AC-3 **slice PASS** via ten `test_bug0027_*` markers + code-inspection. **No live OpenCode PASS. No toast-repair claim.** Does not block VERIFY_PASS for this contract slice.

## Blocking findings

None.

## Next

`/release` (fresh **release** subagent). CROSS_MODEL_REVIEW=0 — no sovereign-critic. **STOP** — do not spawn `/release` from this subagent. Do NOT mark BUG-0027 DONE. Do NOT tick ACs. Do NOT restore auto.md. Do NOT reopen BUG-0024. Do NOT claim toast repair. Do NOT merge/drain BUG-0022/0026. Do NOT claim live OpenCode PASS.
