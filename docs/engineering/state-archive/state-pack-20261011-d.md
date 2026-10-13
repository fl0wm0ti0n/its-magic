# State archive pack (2026-10-11)

- Rollover trigger: `STATE_HOT_MAX_LINES=1200, STATE_HOT_MAX_CHECKPOINTS=80`
- Source: `docs/engineering/state.md`
- Archived units (oldest first, contiguous prefix): 1
- Retained units in hot file: 44
- First archived heading: `## Release checkpoint - BUG-0032 / S0166 (release phase - RELEASE_PASS)`
- Last archived heading: `## Release checkpoint - BUG-0032 / S0166 (release phase - RELEASE_PASS)`
- Verification tuple (mandatory):
  - archived_body_lines=28
  - preamble_lines=11
  - retained_body_lines=1186

---

## Release checkpoint - BUG-0032 / S0166 (release phase - RELEASE_PASS)

- **fresh_context_marker**: `release-BUG0032-20261004T233000Z-fresh` (FRESH; grep-verified 0 prior occurrences repo-wide at mint; distinct from all S0166 chain markers - execute `dev-BUG0032-execute-20261004T144000Z-fresh`, qa `qa-BUG0032-qa-20261004T152000Z-fresh`, qa-reattest `qa-BUG0032-qa-reattest-20261004T163000Z-fresh`, verify-work 16:06Z `qa-BUG0032-verify-work-20261004T160600Z-fresh`, verify-rerun 22:52Z `qa-BUG0032-verify-work-rerun-20261004T225200Z-fresh`).
- **model_id**: `qwen3.8:27b` (CROSS_MODEL_REVIEW=0 - no sovereign-critic consume).
- **runtime_proof_id**: `rp-auto-20261004-bug0032-release-release-20261004T233000Z-BUG-0032`
- **proof_hash**: `9FDCD4ADCFEDB7154320DD9F176DA26CCBCBCE382EA59AB75BE86E54D53FDF1E` (64 hex uppercase; canonical 6-tuple SHA-256 per DEC-0038; **2-invocation recompute MATCH by construction** - invocation 1 = `scripts.token_cost_lib.compute_strict_proof_hash`, invocation 2 = plain `hashlib.sha256(json.dumps(obj, sort_keys=True, separators=(",",":")).encode())`; `hash_recompute_confirmation=true`; 0 prior occurrences repo-wide - RUNTIME_PROOF_REUSED guard honored)
- **proof_issued_at**: `2026-10-04T23:30:00Z`; **proof_ttl_seconds**: 3600; **proof_ttl**: `2026-10-04T24:30:00Z`
- **verdict**: **RELEASE_PASS** (mandatory gates 1, 2, 3, 4a, 4b all green on a fresh independent re-run this release session - not the QA / verify-work word)
- **strict_proof chain (7/7 RECOMPUTED MATCH this release, both lib + independent hashlib over verbatim recorded canonical 6-tuple per leaf)**:
  - research `A3107ED0...910AC` MATCH; architecture `2E911042...E08F` MATCH; execute `1FE73AAD...7DD0C2` MATCH; qa re-attested `936C72CB...0606C2` MATCH; qa-reattest `FF6F1590...100BA` MATCH; verify-work 16:06Z detector `C7DF7744...B5DED` MATCH; verify-work re-run 22:52Z `941A0B22...E0E (941A0B22...C2DBE0E)` MATCH. B-1 repair verified independently by BOTH the 22:52Z re-run AND this release.
- **gate 1 (check-in tests, @release this session)**: active 8-marker 8/8 (0.89s) + template twin 8/8 (0.83s) + 7-fixture `--scope=autonomy-flags --repo <fixture>` battery 7/7 AC-2 spec (identity exit 0 + exact banner; preset-drift / policy-drift / two-key-drift exit 1 + fixed order AUTONOMY_PRESET-first; malformed-duplicate / malformed-missing / malformed-unparseable all exit 1 fail-closed no success banner) + US-0131 10/10 (0.11s, unchanged) + US-0119 8 passed / 2 failed (N-2 pre-existing 5 orphans BUDGET_EXHAUSTED/DECISION_UNRESOLVED/KERNEL_INCOMPATIBLE/QUALITY_EVIDENCE_FAILED/RESUME_AMBIGUOUS - NOT weakened, NOT repaired; BUG-0034 owns) + `[BUG_VALIDATION_OK]` exit 0 + 4/4 active==template byte-parity (checker `EC5B24C5...58B3D5`; reason_codes `4C6F03D5...FF52BFB`; runbook `5D6D6780...CEAF7552`; bug0032 test `BD7117E5...9009B29C`) + both-OS CI wiring read-verified (`tests/run-tests.ps1` L1686-L1693 + `tests/run-tests.sh` L1554-L1564, IMMEDIATELY AFTER US-0131, always-run, NOT changed-file filtered, fail-closed) + `harness_fail_zero_claimed=false`
- **gate 2 (qa)**: `sprints/S0166/qa-findings.md` QA_PASS (re-attested after B-1 repair @16:30Z); 7/7 ACs + DC PASS; 0 blocking; N-1 (state.md EXECUTE_CHECKPOINT_MISSING - S0165/BUG-0035 precedent NON-BLOCKING) + N-2 (US-0119 2 pre-existing matrix-ref, carried forward)
- **gate 3 (uat)**: `sprints/S0166/uat.json` - `verdict=QA_PASS` / `verified_ready=true` / `uat_lifecycle=populated`; 9/9 pass (UAT-1..UAT-7 + convergence_smoke); `live_opencode_cli_tui_pass_claimed=false`; `fake_browser_pass_claimed=false`; `toast_repair_claimed=false`; `drift_FIXED_claimed=false`; `npm_published=false`; `git_pushed=false`; all live host/broker/TUI classes UAT_PROBE_FORBIDDEN
- **gate 4 (isolation)**: 6 distinct fresh_context_markers recorded in state.md (this release is the 6th); role-aligned per US-0069 / DEC-0051 (execute=dev, qa+verify-work=qa, release=release, closure=curator); CROSS_MODEL_REVIEW=0
- **gate 4b (strict_runtime_proof)**: 7/7 consumed leaves RECOMPUTED MATCH this release + own release proof 2-invocation recompute MATCH by construction
- **artifacts authored this release**: `sprints/S0166/release-findings.md` (RELEASE_PASS); `handoffs/releases/S0166-release-notes.md` (canonical); `handoffs/release_queue.md` row S0166 = `released`; `handoffs/release_notes.md` latest-pointer prepended; `CHANGELOG.md` `## [Unreleased]` `### Fixed` BUG-0032 bullet (active only; `template/CHANGELOG.md` UNTOUCHED per S0162/S0163/S0164 precedent); this state.md checkpoint (DEC-0040 append-never-rewrite)
- **status (UNTOUCHED, closure owns)**: BUG-0032 **OPEN** (backlog L5676 `Status: OPEN`; AC-1..AC-7 L5685-L5691 `- [ ]`; acceptance L223 `- [ ]`) - closure owns the DONE flip + AC ticks + `sprints/S0166/closure-verification.md` + operator live-wins sync (T-005) evidence per US-0045 / `architecture.md:610` ("Release cannot mark DONE") / `# BUG-0032` L3620 / post-BUG-0031 curator 3-allow flip-path (DEC-0152 DENY-FIRST)
- **sibling status (UNTOUCHED)**: US-0119 DONE (8P/2F N-2 carried, not weakened / not repaired; BUG-0034 owns stop-matrix registration of `AUTONOMY_FLAGS_DRIFT` - ABSENT from `scripts/data/autonomy_stop_matrix.yaml` 8,374 B unchanged); US-0131 DONE (10/10, unchanged); BUG-0005/0016/0022/0027/0031 DONE (not reopened); BUG-0033 OPEN (not drained); BUG-0034 OPEN (owns stop-matrix); BUG-0035 DONE; US-0156 DONE (not reopened); US-0154/0155 OPEN (unmutated); BUG-0026/0028/0029 OPEN (unmutated); DEC-0150/0151/0152/0153 unmutated; **DEC-0154 ABSENT (NOT allocated** - R-0156 "No companion DEC recommended"; no `decisions/DEC-*.md` authored or amended this release)
- **live values UNTOUCHED (drift-DETECT only, NOT drift-FIX)**: `.its-magic/config.json` 20,237 B (L318 `AUTONOMY_PRESET=full`, L320 `AUTONOMY_STOP_POLICY=auto_repair_then_block`); `.cursor/scratchpad.md` 36,325 B (L639 `AUTONOMY_PRESET=none`, L640 `AUTONOMY_STOP_POLICY=block`); operator live-wins sync is T-005 at CLOSURE, not this release
- **publish**: DEFERRED (`RELEASE_PUBLISH_MODE=confirm`; `RELEASE_PUBLISH_AUTO_CONFIRM=0`; `PUBLISH_CONFIRMATION_REQUIRED`; `npm_published=false`; no kit semver bump - kit already at `0.1.10`)
- **sync**: NOT_ELIGIBLE (`SYNC_POLICY_MODE=disabled`; no git push; `reason_code=SYNC_DISABLED`)

### stop_condition (release)

**STOP after RELEASE_PASS.** Orchestrator spawns **`/closure`** (fresh `curator` on this host, DEC-0052 sanctioned alternate since `qe` is unspawnable) next per BUG-0006 / US-0048 to ship the canonical BUG-0032 DONE flip + AC tick + `sprints/S0166/closure-verification.md` + operator live-wins sync (T-005) evidence; then **`/refresh-context`** (optional, fresh curator, S0163/S0164 precedent).

---

