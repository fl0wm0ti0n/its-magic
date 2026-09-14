# Release Findings — BUG-0021 / S0146

- sprint_id: S0146
- story_id: (none — bug segment)
- bug_id: BUG-0021
- phase_id: release
- role: release (fresh per BUG-0006)
- orchestrator_run_id: auto-20260913-bug0021
- parent_orchestrator_run_id: cursor-20260913-BUG0021-intake
- delivery_mode: ultra_lean
- macro_phase: ship (release is phase 1 of 3: release → sovereign-critic (release) → closure per native chain)
- fresh_context_marker: rel-BUG0021-release-20260913T141500Z-fresh
- timestamp: 2026-09-13T14:15:00Z (UTC)
- model_id: composer-2.5-fast (CROSS_MODEL_REVIEW=1 — required on isolation; catalog `roles.release` hit)
- RELEASE_PUBLISH_MODE: confirm (no publish — RELEASE_PUBLISH_AUTO_CONFIRM=0)
- RELEASE_PUBLISH_AUTO_CONFIRM: 0
- SYNC_POLICY_MODE: disabled

## Verdict

**RELEASE_PASS** — all mandatory release gates (1, 2, 3, 4, 4b) green with **scoped pytest 29/29** (bug0021 **8/8**; bug0020 **8/8**; bug0019 **7/7**; bug0018 **6/6**). Queue row S0146 → `released`. No backlog Status mutation (closure owns OPEN→DONE + acceptance tick per US-0120 / DEC-0082). No publish (`RELEASE_PUBLISH_MODE=confirm` + `RELEASE_PUBLISH_AUTO_CONFIRM=0` → `PUBLISH_CONFIRMATION_REQUIRED` / deterministic no-op). Status remains OPEN; acceptance BUG-0021 unchecked; BUG-0020/0019/0018 DONE not reopened; BUG-0022 / US-0139 / US-0140 not mutated; **no `auto.md` restore**.

## Gate table

| # | Gate | Result | Reason code(s) | Evidence |
|---|------|--------|----------------|----------|
| 1 | Check-in test | **PASS** | — | Live scoped `python -m pytest tests/bug0021_opencode_cli_tui_plugin_load_test.py tests/bug0020_opencode_desktop_command_info_listing_test.py tests/bug0019_opencode_auto_slash_listing_test.py tests/bug0018_opencode_auto_ownership_test.py -v` **29/29** in 0.37s + US-0071 metadata OK; full harness **not** re-run; `harness_fail_zero_claimed=false`; stale `tests/report.md` not claimed |
| 2 | QA completion | PASS | — | `sprints/S0146/qa-findings.md` verdict QA_PASS; `blocking_count=0`; NB1..NB3 informational |
| 3 | UAT completion | PASS | — | `sprints/S0146/uat.json` verify_work verdict=PASS, total=11, passed=11, failed=0 incl. `convergence_smoke`; `sprints/S0146/uat.md` populated 11/11 (DEC-0009) |
| 4 | Isolation compliance | PASS | — | execute (archived `docs/engineering/state-archive/state-pack-20260913-cu.md`; marker `dev-BUG0021-execute-20260913T125000Z-fresh`) + qa + verify-work + sovereign-critic (verify-work `tl-BUG0021-critic-verify-20260913T140400Z-fresh`) + this release; distinct `fresh_context_marker`; `model_id` set per phase |
| 4b | Strict runtime proof | PASS | — | Verify-work proof `rp-auto-20260913-bug0021-verify-work-qa-20260913T134500Z-BUG-0021` (proof_hash=`C03DC931A5515D85234596C86FF270E005D42EA57E91E7924EB62CE2822ACF07`, proof_ttl=`2026-09-13T14:45:00Z`) consumed at release `14:15:00Z` before expiry; hash independently recomputed MATCH; critic of verify-work PASS (`rp-auto-20260913-bug0021-sovereign-critic-techlead-20260913T141000Z-BUG-0021` / `2211F95E8EB5215630A015A9D811B9C130A5DF0FE8DB00D72B3FF4C214631695`); NEW release proof minted (no proof_id reuse) |
| 5 | Release finalization | **PASS** | — | `handoffs/releases/S0146-release-notes.md` written PASS; queue row S0146 = `released` |

## Doc gates

| Gate | Result | Notes |
|------|--------|-------|
| readme_feature_coverage_3f | skipped | `README_FEATURE_COVERAGE_ENFORCE=0` (grandfathering / migration pass) |
| project_readme_3g | skipped | `FRAMEWORK_KIT_REPO=1` per S0114..S0145 precedent |
| metadata_guard (US-0071) | PASS | `python scripts/check-user-visible-metadata.py --repo .` exit 0 |
| version_doc_17 | skipped | workflow-only release; no semver bump |
| triad_regression | skipped | no state rollover required this pass |
| cross_repo_3a | skipped | `CROSS_REPO_OBSERVABILITY=0` |
| component_scope_3b | skipped | `COMPONENT_SCOPE_MODE=0` |
| spec_pack_3c | skipped | `SPEC_PACK_MODE=0` |
| user_guide_3d | skipped | `USER_GUIDE_MODE=0` |
| lint | skipped | `LINT_COMMAND` blank (kit) |
| typecheck | skipped | `TYPECHECK_COMMAND` blank (kit) |

## Compose guards (UNCHANGED)

Axis A LOCKED (`{ id, tui }` default export + `registerLayer` `slashName: "auto"` + rpc → `runAutoLifecycle`; keep `editor.add`; LOAD token + `#36505` residual; no `auto.md` restore); BUG-0020 C-limb + desktop token held (8/8 compose); BUG-0019 E* held (7/7); BUG-0018 A* held (6/6); R-0134 / `# BUG-0021` not rewritten; BUG-0020/0019/0018/0017/0015/0016 DONE not reopened; BUG-0022 OPEN / US-0139 OPEN / US-0140 OPEN not mutated; US-0139 remains OPEN; acceptance unchecked; intake JSON not mutated; no publish; **no live OpenCode CLI TUI listing probe** (`UAT_PROBE_FORBIDDEN`).

## Strict runtime proof (release)

- `runtime_proof_id=rp-auto-20260913-bug0021-release-release-20260913T141500Z-BUG-0021`
- `proof_hash=A2ABBD7C9D50F937024ED4E829DD6323DEEE6D2D43B9B8C5DD4317FDBAF39EEB`
- `proof_ttl=2026-09-13T15:15:00Z`
- Canonical hashed payload: `{"orchestrator_run_id":"auto-20260913-bug0021","phase_id":"release","proof_issued_at":"2026-09-13T14:15:00Z","proof_ttl_seconds":3600,"role":"release","runtime_proof_id":"rp-auto-20260913-bug0021-release-release-20260913T141500Z-BUG-0021"}`
- Isolation extras (not hashed): delivery_mode=ultra_lean; macro_phase=ship; model_id=composer-2.5-fast; sprint_id=S0146; story_id=BUG-0021
- hash_recompute_confirmation=true (compute_strict_proof_hash → A2ABBD7C9D50F937024ED4E829DD6323DEEE6D2D43B9B8C5DD4317FDBAF39EEB; 64 hex; hashfix consumed; independent MATCH)

## Hashfix (RUNTIME_PROOF_INVALID) — release BUG-0021

- reason=63-hex transcription (dropped `E` in `deee6d2d` → `DEE6D2D`; false "64 hex verified")
- old_proof_hash=A2ABBD7C9D50F937024ED4E829DD6323DEE6D2D43B9B8C5DD4317FDBAF39EEB (63 hex)
- corrected_proof_hash=A2ABBD7C9D50F937024ED4E829DD6323DEEE6D2D43B9B8C5DD4317FDBAF39EEB (64 hex; hashfix consumed; independent MATCH)
- runtime_proof_id=rp-auto-20260913-bug0021-release-release-20260913T141500Z-BUG-0021 (UNCHANGED)
- proof_issued_at=2026-09-13T14:15:00Z (UNCHANGED)
- fresh_context_marker=rel-BUG0021-release-hashfix-20260913T142000Z-fresh
- timestamp=2026-09-13T14:20:00Z (UTC)
- Status remains OPEN; acceptance unchecked; no publish; no closure spawn from this correction.

## Test results (release — live this pass)

```
python -m pytest tests/bug0021_opencode_cli_tui_plugin_load_test.py tests/bug0020_opencode_desktop_command_info_listing_test.py tests/bug0019_opencode_auto_slash_listing_test.py tests/bug0018_opencode_auto_ownership_test.py -v → 29 passed in 0.37s (bug0021 8/8; bug0020 8/8; bug0019 7/7; bug0018 6/6)
python scripts/check-user-visible-metadata.py --repo . → exit 0
python scripts/check_intake_template_parity.py --repo . --scope=bug-0021 → [INTAKE_TEMPLATE_PARITY_OK]
```

## Evidence refs

- `sprints/S0146/qa-findings.md` (QA_PASS)
- `sprints/S0146/verify-work-findings.md` (VERIFY_WORK_PASS)
- `sprints/S0146/uat.json`, `sprints/S0146/uat.md` (verify-work PASS)
- `sprints/S0146/summary.md`
- `handoffs/releases/S0146-release-notes.md`
- `handoffs/release_queue.md` (S0146 row `released`)
- `docs/engineering/state.md` (release checkpoint append-bottom)

## Next

**sovereign-critic (release)** then **`/closure`** (fresh **qe** subagent). Release does **not** spawn sovereign-critic or closure. Backlog BUG-0021 remains **OPEN**; acceptance BUG-0021 remains **unchecked** until closure.
