# Release Findings — BUG-0023 / S0148

- sprint_id: S0148
- story_id: (none — bug segment)
- bug_id: BUG-0023
- phase_id: release
- role: release (fresh per BUG-0006)
- orchestrator_run_id: auto-20260913-bug0023
- parent_orchestrator_run_id: cursor-20260913-BUG0023-intake
- delivery_mode: ultra_lean
- macro_phase: ship (release is phase 1 of 3: release → sovereign-critic (release) → closure per native chain)
- fresh_context_marker: rel-BUG0023-release-20260914T010500Z-fresh
- timestamp: 2026-09-14T01:05:00Z (UTC)
- model_id: composer-2.5-fast (CROSS_MODEL_REVIEW=1 — required on isolation; catalog `roles.release` → Task slug `composer-2.5-fast`; MODEL_RESOLVE_FALLBACK)
- producer_model_id: composer-2.5-fast
- RELEASE_PUBLISH_MODE: confirm (no publish — RELEASE_PUBLISH_AUTO_CONFIRM=0)
- RELEASE_PUBLISH_AUTO_CONFIRM: 0
- SYNC_POLICY_MODE: disabled

## Verdict

**RELEASE_PASS** — all mandatory release gates (1, 2, 3, 4, 4b) green with **scoped pytest 37/37** (bug0023 **8/8**; bug0021 **8/8**; bug0020 **8/8**; bug0019 **7/7**; bug0018 **6/6**). Queue row S0148 → `released`. No backlog Status mutation (closure owns OPEN→DONE + acceptance tick per US-0120 / DEC-0082). No publish (`RELEASE_PUBLISH_MODE=confirm` + `RELEASE_PUBLISH_AUTO_CONFIRM=0` → `PUBLISH_CONFIRMATION_REQUIRED` / deterministic no-op). Status remains OPEN; acceptance BUG-0023 unchecked; BUG-0021..0020 DONE not reopened; BUG-0022 / US-0141 not mutated; **no `auto.md` restore**.

## Gate table

| # | Gate | Result | Reason code(s) | Evidence |
|---|------|--------|----------------|----------|
| 1 | Check-in test | **PASS** | — | Live scoped `python -m pytest tests/bug0023_opencode_cli_tui_dispatch_rpc_test.py tests/bug0021_opencode_cli_tui_plugin_load_test.py tests/bug0020_opencode_desktop_command_info_listing_test.py tests/bug0019_opencode_auto_slash_listing_test.py tests/bug0018_opencode_auto_ownership_test.py -v` **37/37** in 0.79s + US-0071 metadata OK; parity `--scope bug-0023` OK; full harness **not** re-run; `harness_fail_zero_claimed=false`; stale `tests/report.md` not claimed |
| 2 | QA completion | PASS | — | `sprints/S0148/qa-findings.md` verdict QA_PASS; `blocking_count=0`; NB1..NB4 informational |
| 3 | UAT completion | PASS | — | `sprints/S0148/uat.json` verify_work verdict=PASS, total=10, passed=10, failed=0 incl. `convergence_smoke`; `sprints/S0148/uat.md` populated 10/10 (DEC-0009) |
| 4 | Isolation compliance | PASS | — | execute + qa + verify-work + sovereign-critic (verify-work `tl-BUG0023-critic-vw-20260914T010000Z-fresh`) + this release; distinct `fresh_context_marker`; `model_id` set per phase |
| 4b | Strict runtime proof | PASS | — | Verify-work proof `rp-auto-20260913-bug0023-verify-work-qa-20260914T005500Z-BUG-0023` (proof_hash=`A2735C5DFBC97091CAEFC2A29D4EA2E481F9E3C9F593BF0DC8FA8B93AA2B5580`, proof_ttl=`2026-09-14T01:55:00Z`) consumed at release `01:05:00Z` before expiry; hash independently recomputed MATCH; critic of verify-work PASS (`rp-auto-20260913-bug0023-sovereign-critic-techlead-20260914T010000Z-BUG-0023` / `25E0038A8239D6FC0F13261CB01137A2A251A202EDEE3DF547C4CB33188103E5`); NEW release proof minted (no proof_id reuse) |
| 5 | Release finalization | **PASS** | — | `handoffs/releases/S0148-release-notes.md` written PASS; queue row S0148 = `released` |

## Doc gates

| Gate | Result | Notes |
|------|--------|-------|
| readme_feature_coverage_3f | FAIL_nonblocking | `README_FEATURE_COVERAGE_ENFORCE=1`; gaps BUG-0021, US-0135..US-0140 + README parity drift — not blocking target sprint (OPEN bug segment; precedent S0145) |
| project_readme_3g | skipped | `FRAMEWORK_KIT_REPO=1` per S0114..S0147 precedent |
| metadata_guard (US-0071) | PASS | `python scripts/check-user-visible-metadata.py --repo .` exit 0 |
| version_doc_17 | skipped | workflow-only release; no semver bump; `derive_work_items(['S0148'])` empty pre-queue (OPEN bug) |
| triad_regression | skipped | no state rollover required this pass |
| cross_repo_3a | skipped | `CROSS_REPO_OBSERVABILITY=0` |
| component_scope_3b | skipped | `COMPONENT_SCOPE_MODE=0` |
| spec_pack_3c | skipped | `SPEC_PACK_MODE=0` |
| user_guide_3d | skipped | `USER_GUIDE_MODE=0` |
| lint | skipped | `LINT_COMMAND` blank (kit) |
| typecheck | skipped | `TYPECHECK_COMMAND` blank (kit) |

## Compose guards (UNCHANGED)

Axis A LOCKED (`Rpc.define` shared `rpc.ts`; `await ctx.rpc.register`; TUI `client.rpc(Defined)` + `OpenCode.make` fallback; invented POST absent; DISPATCH only when client/RPC truly absent; keep `{ id, tui }` + `editor.add`; upgrade overwrites `rpc.ts`/`tui.ts`/orchestrator; prune leftover `auto.md`; no `auto.md` restore); BUG-0021/0020/0019/0018 compose held (8+8+8+7+6); R-0137 / `# BUG-0023` not rewritten; BUG-0021..0020 DONE not reopened; BUG-0022 OPEN / US-0141 OPEN not mutated; acceptance unchecked; intake JSON not mutated; no publish; **no live OpenCode CLI TUI probe** (`UAT_PROBE_FORBIDDEN`).

## Strict runtime proof (release)

- `runtime_proof_id=rp-auto-20260913-bug0023-release-release-20260914T010500Z-BUG-0023`
- `proof_hash=22EEF81C0AE735C983DDB4248FAD6A8D9ADDD12DD2A7D7AA2D7A9AFB6AB7E9F8`
- `proof_ttl=2026-09-14T02:05:00Z`
- Canonical hashed payload: `{"orchestrator_run_id":"auto-20260913-bug0023","phase_id":"release","proof_issued_at":"2026-09-14T01:05:00Z","proof_ttl_seconds":3600,"role":"release","runtime_proof_id":"rp-auto-20260913-bug0023-release-release-20260914T010500Z-BUG-0023"}`
- Isolation extras (not hashed): delivery_mode=ultra_lean; macro_phase=ship; model_id=composer-2.5-fast; producer_model_id=composer-2.5-fast; sprint_id=S0148; story_id=BUG-0023
- hash_recompute_confirmation=true (compute_strict_proof_hash positional → 22EEF81C0AE735C983DDB4248FAD6A8D9ADDD12DD2A7D7AA2D7A9AFB6AB7E9F8; 64 hex; independent MATCH)

## Test results (release — live this pass)

```
python -m pytest tests/bug0023_opencode_cli_tui_dispatch_rpc_test.py tests/bug0021_opencode_cli_tui_plugin_load_test.py tests/bug0020_opencode_desktop_command_info_listing_test.py tests/bug0019_opencode_auto_slash_listing_test.py tests/bug0018_opencode_auto_ownership_test.py -v → 37 passed in 0.79s (bug0023 8/8; bug0021 8/8; bug0020 8/8; bug0019 7/7; bug0018 6/6)
python scripts/check_intake_template_parity.py --repo . --scope bug-0023 → [INTAKE_TEMPLATE_PARITY_OK]
python scripts/check-user-visible-metadata.py --repo . → exit 0
```

## Evidence refs

- `sprints/S0148/qa-findings.md` (QA_PASS)
- `sprints/S0148/verify-work-findings.md` (VERIFY_PASS)
- `sprints/S0148/uat.json`, `sprints/S0148/uat.md` (verify-work PASS)
- `sprints/S0148/summary.md`
- `handoffs/releases/S0148-release-notes.md`
- `handoffs/release_queue.md` (S0148 row `released`)
- `docs/engineering/state.md` (release checkpoint append-bottom)
- `docs/engineering/runbook.md` `### OpenCode CLI TUI /auto dispatch after listing (BUG-0023 / R-0137)`

## Next

**sovereign-critic (release)** then **`/closure`** (fresh **curator** subagent — Task has no qe type). Release does **not** spawn sovereign-critic or closure. Backlog BUG-0023 remains **OPEN**; acceptance BUG-0023 remains **unchecked** until closure.
