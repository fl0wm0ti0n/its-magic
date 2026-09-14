# Release Findings — BUG-0017 / S0135

- sprint_id: S0135
- story_id: BUG-0017
- bug_id: BUG-0017
- phase_id: release
- role: release (fresh per BUG-0006)
- orchestrator_run_id: auto-20260911-bug0017
- delivery_mode: ultra_lean
- macro_phase: ship (release is phase 1 of 3: release → closure → refresh-context per DEC-0082)
- fresh_context_marker: rel-BUG0017-release-20260911T195400Z-fresh
- timestamp: 2026-09-11T20:18:30Z (UTC)
- model_id: composer-2.5 (CROSS_MODEL_REVIEW=1 — required on isolation)
- RELEASE_PUBLISH_MODE: confirm (no publish — RELEASE_PUBLISH_AUTO_CONFIRM=0)
- RELEASE_PUBLISH_AUTO_CONFIRM: 0
- SYNC_POLICY_MODE: disabled

## Verdict

**PASS** — all mandatory release gates (1, 2, 3, 4, 4b) green with **canonical harness Fail:0**. Queue row S0135 → `released`. No backlog mutation (closure owns OPEN→DONE + acceptance tick per US-0120 / DEC-0082). No publish (`RELEASE_PUBLISH_MODE=confirm` + `RELEASE_PUBLISH_AUTO_CONFIRM=0` → `PUBLISH_CONFIRMATION_REQUIRED` / deterministic no-op).

## Gate table

| # | Gate | Result | Reason code(s) | Evidence |
|---|------|--------|----------------|----------|
| 1 | Check-in test | **PASS** | — | Live bug0017 6/6 + `npm run guard:installer` PASS + US-0071 metadata OK; **`tests/report.md` @ `2026-09-11T20:18:29Z` Pass:857 / Fail:0** (incl. BUG-0017 26AG); `harness_fail_zero_claimed=true` |
| 2 | QA completion | PASS | — | `sprints/S0135/qa-findings.md` verdict QA_PASS; `blocking_count=0`; NB1..NB3 informational |
| 3 | UAT completion | PASS | — | `sprints/S0135/uat.json` verify_work verdict=PASS, total=8, passed=8, failed=0 incl. `convergence_smoke`; `sprints/S0135/uat.md` populated 8/8 (DEC-0009) |
| 4 | Isolation compliance | PASS | — | execute + qa + verify-work + sovereign-critic (verify-work) + this release; distinct `fresh_context_marker`; `model_id` set per phase |
| 4b | Strict runtime proof | PASS | — | Verify-work proof `rp-auto-20260911-bug0017-verify-work-qa-20260911T195200Z-BUG-0017` (proof_hash=`EFC002B0895C4FC2AB4285FBAFED9E55BADC57F5B8EC43BBF676D5184E514C02`, proof_ttl=`2026-09-11T20:52:00Z`) consumed at release `20:18:30Z` before expiry; hash independently recomputed MATCH; NEW release proof minted (no proof_id reuse) |
| 5 | Release finalization | **PASS** | — | `handoffs/releases/S0135-release-notes.md` written PASS; queue row S0135 = `released` |

## Doc gates

| Gate | Result | Notes |
|------|--------|-------|
| readme_feature_coverage_3f | **PASS** | `python scripts/validate_readme_feature_coverage.py --repo . --enforce` exit 0; `coverage_missing=[]`; BUG-0017 OPEN excluded |
| project_readme_3g | skipped | `FRAMEWORK_KIT_REPO=1` per S0114..S0134 precedent |
| metadata_guard (US-0071) | PASS | `python scripts/check-user-visible-metadata.py --repo .` exit 0 |
| version_doc_17 | skipped | workflow-only release; no semver bump; `RELEASE_CHANGELOG_ENFORCE` default 1 not applied (S0133/S0134 precedent) |
| triad_regression | PASS | `enforce-triad-hot-surface.py --check` exit 0 |
| cross_repo_3a | skipped | `CROSS_REPO_OBSERVABILITY=0` |
| component_scope_3b | skipped | `COMPONENT_SCOPE_MODE=0` |
| spec_pack_3c | skipped | `SPEC_PACK_MODE=0` |
| user_guide_3d | skipped | `USER_GUIDE_MODE=0` |
| lint | skipped | `LINT_COMMAND` blank |
| typecheck | skipped | `TYPECHECK_COMMAND` blank |

## Gate-1 remediation (pre-finalization)

| Issue | Fix | Result |
|-------|-----|--------|
| BUG-0017 not wired in harness | Added 26AG to `tests/run-tests.ps1` + `tests/run-tests.sh` | `[PASS] BUG-0017 OpenCode EOL contract tests pass` |
| Homebrew url/version still `0.1.3-6` vs npm `0.1.3-8` | Synced `packaging/homebrew/its-magic.rb` | Homebrew stable checks PASS |
| Active `ci.yml` missing packaging jobs (BUG-0009 drift after JSONC commit) | Restored `npm-test`/`brew-test`/`choco-test` on kit-active only; template remains slim | BUG-0009 + downstream CI guard PASS |
| model-tier-overrides parity drift (cursor-only catalog) | Synced template ← active example JSON | `[INTAKE_TEMPLATE_PARITY_OK] scope=model-tier-overrides` |
| Final harness | `2026-09-11T20:18:29Z` **Pass:857 / Fail: 0** | Gate-1 PASS |

## Compose guards (UNCHANGED)

BUG-0008 / US-0084 / DEC-0120 compose-only (extended, not weakened); no companion DEC for BUG-0017; R-0118 DQ1–DQ6 LOCKED cited not rewritten; BUG-0015/BUG-0016 DONE not reopened; BUG-0017 remains OPEN; acceptance unchecked; intake JSON not mutated; no live OpenCode CI probe; no publish.

## Strict runtime proof (release)

- `runtime_proof_id=rp-auto-20260911-bug0017-release-release-20260911T201830Z-BUG-0017`
- `proof_hash=EFFA303CA150F1727598673F4B15ECC55C617A9E94EADD3D194DF5361D024CC9`
- `proof_ttl=2026-09-11T21:18:30Z`
- Canonical payload: `{"delivery_mode":"ultra_lean","macro_phase":"ship","model_id":"composer-2.5","orchestrator_run_id":"auto-20260911-bug0017","phase_id":"release","proof_issued_at":"2026-09-11T20:18:30Z","proof_ttl_seconds":3600,"role":"release","runtime_proof_id":"rp-auto-20260911-bug0017-release-release-20260911T201830Z-BUG-0017","sprint_id":"S0135","story_id":"BUG-0017"}`
- Consumed verify-work proof: `rp-auto-20260911-bug0017-verify-work-qa-20260911T195200Z-BUG-0017` (hash `EFC002B0895C4FC2AB4285FBAFED9E55BADC57F5B8EC43BBF676D5184E514C02` — recomputed MATCH; ttl `2026-09-11T20:52:00Z` — consumed at `20:18:30Z` before RUNTIME_PROOF_STALE)

### Lifecycle proofs (present)

| Phase | runtime_proof_id | proof_hash |
|-------|------------------|------------|
| execute | `rp-auto-20260911-bug0017-execute-dev-20260911T194500Z-BUG-0017` | `7B9319A03BA2399F67DD87F25334DEF7ECE7FD250DBEA8ABC5DC42ED22B01936` |
| qa | `rp-auto-20260911-bug0017-qa-qa-20260911T195000Z-BUG-0017` | `65A7F3ADFA440248BEA7A83A908680AB5AC270FF79DF7E2A2ECD0ECFDD30B441` |
| plan-verify (ultra_lean QA) | `rp-auto-20260911-bug0017-plan-verify-qa-20260911T195000Z-BUG-0017` | `58D69A19144D54A3854F133B77648F474A2A9E16F3E5EEA17235487AA4CB8C52` |
| verify-work | `rp-auto-20260911-bug0017-verify-work-qa-20260911T195200Z-BUG-0017` | `EFC002B0895C4FC2AB4285FBAFED9E55BADC57F5B8EC43BBF676D5184E514C02` |
| release | `rp-auto-20260911-bug0017-release-release-20260911T201830Z-BUG-0017` | `EFFA303CA150F1727598673F4B15ECC55C617A9E94EADD3D194DF5361D024CC9` |

## Publish / sync snapshot

- `publish_snapshot=skipped_pending_operator_confirm` (`RELEASE_PUBLISH_MODE=confirm`, `RELEASE_PUBLISH_AUTO_CONFIRM=0` → `PUBLISH_CONFIRMATION_REQUIRED`)
- `push_decision=not_eligible` (`SYNC_POLICY_MODE=disabled` → `reason_code=SYNC_DISABLED`)

## Evidence refs

- `handoffs/releases/S0135-release-notes.md`
- `handoffs/release_queue.md` (S0135 row)
- `handoffs/release_notes.md` (legacy pointer)
- `docs/engineering/state.md` (release checkpoint + isolation)
- `handoffs/resume_brief.md` (prepended /closure handoff)
- `sprints/S0135/qa-findings.md`
- `sprints/S0135/uat.json`, `sprints/S0135/uat.md`
- `sprints/S0135/summary.md`
- `tests/report.md` (@ 2026-09-11T20:18:29Z — Fail:0)

## Next phase

`/closure` (fresh **qe** subagent) — backlog OPEN→DONE, acceptance tick BUG-0017, `sprints/S0135/closure-verification.md`. Release does NOT spawn closure.
