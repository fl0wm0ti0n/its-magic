# Release Findings — BUG-0018 / S0136

- sprint_id: S0136
- story_id: BUG-0018
- bug_id: BUG-0018
- phase_id: release
- role: release (fresh per BUG-0006)
- orchestrator_run_id: auto-20260912-bug0018
- delivery_mode: ultra_lean
- macro_phase: ship (release is phase 1 of 3: release → closure → refresh-context per DEC-0082)
- fresh_context_marker: rel-BUG0018-release-20260912T105500Z-fresh
- timestamp: 2026-09-12T10:55:00Z (UTC)
- model_id: cursor-grok-4.6 (CROSS_MODEL_REVIEW=1 — required on isolation)
- RELEASE_PUBLISH_MODE: confirm (no publish — RELEASE_PUBLISH_AUTO_CONFIRM=0)
- RELEASE_PUBLISH_AUTO_CONFIRM: 0
- SYNC_POLICY_MODE: disabled

## Verdict

**PASS** — all mandatory release gates (1, 2, 3, 4, 4b) green with **canonical harness Fail:0**. Queue row S0136 → `released`. No backlog mutation (closure owns OPEN→DONE + acceptance tick per US-0120 / DEC-0082). No publish (`RELEASE_PUBLISH_MODE=confirm` + `RELEASE_PUBLISH_AUTO_CONFIRM=0` → `PUBLISH_CONFIRMATION_REQUIRED` / deterministic no-op). Confirm is not a hard decision_gate stop.

## Gate table

| # | Gate | Result | Reason code(s) | Evidence |
|---|------|--------|----------------|----------|
| 1 | Check-in test | **PASS** | — | Live bug0018 6/6 + compose 30/30 + US-0071 metadata OK; **`tests/report.md` @ `2026-09-12T10:37:55Z` Pass:858 / Fail:0** (incl. BUG-0018 26AH); `harness_fail_zero_claimed=true` |
| 2 | QA completion | PASS | — | `sprints/S0136/qa-findings.md` verdict QA_PASS; `blocking_count=0`; NB1..NB3 informational |
| 3 | UAT completion | PASS | — | `sprints/S0136/uat.json` verify_work verdict=PASS, total=8, passed=8, failed=0 incl. `convergence_smoke`; `sprints/S0136/uat.md` populated 8/8 (DEC-0009) |
| 4 | Isolation compliance | PASS | — | execute + qa + verify-work + sovereign-critic (verify-work) + this release; distinct `fresh_context_marker`; `model_id` set per phase |
| 4b | Strict runtime proof | PASS | — | Verify-work proof `rp-auto-20260912-bug0018-verify-work-qa-20260912T104500Z-BUG-0018` (proof_hash=`AFB58F6DEC7505290F0A796066820A3A12689EF9682B56B967F695C26837E5BE`, proof_ttl=`2026-09-12T11:45:00Z`) consumed at release `10:55:00Z` before expiry; hash independently recomputed MATCH; NEW release proof minted (no proof_id reuse) |
| 5 | Release finalization | **PASS** | — | `handoffs/releases/S0136-release-notes.md` written PASS; queue row S0136 = `released` |

## Doc gates

| Gate | Result | Notes |
|------|--------|-------|
| readme_feature_coverage_3f | **PASS** | `python scripts/validate_readme_feature_coverage.py --repo . --enforce` exit 0; `coverage_missing=[]`; BUG-0018 OPEN excluded; BUG-0017 DONE covered (gate-3f remediation) |
| project_readme_3g | skipped | `FRAMEWORK_KIT_REPO=1` per S0114..S0135 precedent |
| metadata_guard (US-0071) | PASS | `python scripts/check-user-visible-metadata.py --repo .` exit 0 |
| version_doc_17 | skipped | workflow-only release; no semver bump; `RELEASE_CHANGELOG_ENFORCE` default 1 not applied (S0133/S0134/S0135 precedent) |
| triad_regression | PASS | `enforce-triad-hot-surface.py --check` exit 0 (pre-write) |
| cross_repo_3a | skipped | `CROSS_REPO_OBSERVABILITY=0` |
| component_scope_3b | skipped | `COMPONENT_SCOPE_MODE=0` |
| spec_pack_3c | skipped | `SPEC_PACK_MODE=0` |
| user_guide_3d | skipped | `USER_GUIDE_MODE=0` |
| lint | skipped | `LINT_COMMAND` blank |
| typecheck | skipped | `TYPECHECK_COMMAND` blank |

## Gate-1 / 3f remediation (pre-finalization)

| Issue | Fix | Result |
|-------|-----|--------|
| BUG-0018 not wired in harness | Added 26AH to `tests/run-tests.ps1` + `tests/run-tests.sh` | `[PASS] BUG-0018 OpenCode auto ownership contract tests pass` |
| README 3f `README_FEATURE_COVERAGE_GAP:BUG-0017` (DONE, user_visible) | Catalog + Features/Architecture-notes/Quality-gates coverage for BUG-0017; operator ### for BUG-0017/BUG-0018; template + `its_magic` README parity | `[README_FEATURE_COVERAGE_VALIDATE_OK]`; `coverage_missing=[]` |
| Homebrew stable still `0.1.3-8` vs npm `0.1.3-9` | Synced `packaging/homebrew/its-magic.rb` url+version | Homebrew stable checks PASS |
| Stale `tests/report.md` (2026-09-11) | Re-ran `tests/run-tests.ps1` | `2026-09-12T10:37:55Z` **Pass:858 / Fail:0** |

## Compose guards (UNCHANGED)

BUG-0015 attach API compose-only (extended, not weakened); us0125 inventory 14 / if-present dispatch-only; bug0017 plant `intake.md`; no companion DEC for BUG-0018; R-0120 DQ1–DQ8 LOCKED cited not rewritten; runbook prune recipe not rewritten this phase; BUG-0015/BUG-0016/BUG-0017 DONE not reopened; BUG-0018 remains OPEN; acceptance unchecked; intake JSON not mutated; no live OpenCode CI probe; no publish.

## Strict runtime proof (release)

- `runtime_proof_id=rp-auto-20260912-bug0018-release-release-20260912T105500Z-BUG-0018`
- `proof_hash=791DEF823E5A7B4985951D258DAC56B57CB7491A8ADA0B6914ACE4B52545ACD7`
- `proof_ttl=2026-09-12T11:55:00Z`
- Canonical payload: `{"delivery_mode":"ultra_lean","macro_phase":"ship","model_id":"cursor-grok-4.6","orchestrator_run_id":"auto-20260912-bug0018","phase_id":"release","proof_issued_at":"2026-09-12T10:55:00Z","proof_ttl_seconds":3600,"role":"release","runtime_proof_id":"rp-auto-20260912-bug0018-release-release-20260912T105500Z-BUG-0018","sprint_id":"S0136","story_id":"BUG-0018"}`
- Consumed verify-work proof: `rp-auto-20260912-bug0018-verify-work-qa-20260912T104500Z-BUG-0018` (hash `AFB58F6DEC7505290F0A796066820A3A12689EF9682B56B967F695C26837E5BE` — recomputed MATCH; ttl `2026-09-12T11:45:00Z` — consumed at `10:55:00Z` before RUNTIME_PROOF_STALE)

### Lifecycle proofs (present)

| Phase | runtime_proof_id | proof_hash |
|-------|------------------|------------|
| execute | `rp-auto-20260912-bug0018-execute-dev-20260912T102000Z-BUG-0018` | `1BFC71170240A01546AB58966CDB431CA1802A96BBD6D91D559C1869535B6A82` |
| qa | `rp-auto-20260912-bug0018-qa-qa-20260912T103500Z-BUG-0018` | `23372F67B489CE60161626AA2A9E0EEFC028DF7C58DAED1E27D6A8A2C4E43E5F` |
| plan-verify (ultra_lean QA) | `rp-auto-20260912-bug0018-plan-verify-qa-20260912T103500Z-BUG-0018` | `6BCD9FD84F7F612467E00F8CB69F3BD6CCB9EB33DB5B514B7BA3A90A4B3A89CB` |
| verify-work | `rp-auto-20260912-bug0018-verify-work-qa-20260912T104500Z-BUG-0018` | `AFB58F6DEC7505290F0A796066820A3A12689EF9682B56B967F695C26837E5BE` |
| release | `rp-auto-20260912-bug0018-release-release-20260912T105500Z-BUG-0018` | `791DEF823E5A7B4985951D258DAC56B57CB7491A8ADA0B6914ACE4B52545ACD7` |

## Publish / sync snapshot

- `publish_snapshot=skipped_pending_operator_confirm` (`RELEASE_PUBLISH_MODE=confirm`, `RELEASE_PUBLISH_AUTO_CONFIRM=0` → `PUBLISH_CONFIRMATION_REQUIRED`; not a hard decision_gate stop)
- `push_decision=not_eligible` (`SYNC_POLICY_MODE=disabled` → `reason_code=SYNC_DISABLED`)

## Evidence refs

- `handoffs/releases/S0136-release-notes.md`
- `handoffs/release_queue.md` (S0136 row)
- `handoffs/release_notes.md` (legacy pointer)
- `docs/engineering/state.md` (release checkpoint + isolation)
- `handoffs/resume_brief.md` (prepended /closure handoff)
- `sprints/S0136/qa-findings.md`
- `sprints/S0136/uat.json`, `sprints/S0136/uat.md`
- `sprints/S0136/summary.md`
- `sprints/S0136/verify-work-verdict.json`
- `tests/report.md` (@ 2026-09-12T10:37:55Z — Fail:0)

## Next phase

`/closure` (fresh **qe** subagent) — backlog OPEN→DONE, acceptance tick BUG-0018, `sprints/S0136/closure-verification.md`. Release does NOT spawn closure.
