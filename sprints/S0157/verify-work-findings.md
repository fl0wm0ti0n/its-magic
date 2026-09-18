# Verify-Work Findings — S0157 / BUG-0025

**Phase**: verify-work  
**Role**: qa (fresh subagent)  
**Bug**: BUG-0025 (npm publish omits `scripts/standalone_runtime_install_lib.py`)  
**Sprint**: S0157  
**Orchestrator run**: auto-20260918-bug0025  
**Parent run**: cursor-20260918-BUG0025-intake  
**Verify-work timestamp**: 2026-09-18T17:32:00Z  
**Fresh context marker**: qa-BUG0025-verify-20260918T173200Z-fresh  
**model_id**: omit (CROSS_MODEL_REVIEW=0)  
**delivery_mode**: ultra_lean  
**macro_phase**: build+verify (verify-work terminal of build+verify)  
**AUTO_QUIET**: 1  
**FRAMEWORK_KIT_REPO**: 1  
**Verdict**: VERIFY_PASS  

## Independent verify-work verification

Fresh QA subagent per US-0048 / BUG-0006. Marker is **new** (not reused `qa-BUG0025-qa-20260918T172625Z-fresh` or `dev-BUG0025-execute-20260918T171834Z-fresh`). Consumed qa proof from state. Independent re-run of `python -m pytest tests/bug0025_packaging_contract_test.py -v` (**6 passed** fail 0 in **2.12s**). UAT populated (DEC-0009) UAT-1..UAT-8 + `convergence_smoke`; `verified_ready=true` for `/release` transition prep (verified at `/release`). Probe class `contract_tests_primary`. Six live-runtime classes `UAT_PROBE_FORBIDDEN` including **live Chrome `browser_smoke`**. **No fake live-Chrome PASS.** `live_chrome_probed=false`. `fake_browser_pass_claimed=false`. `harness_fail_zero_claimed=false`. No `.env`. No intake mutation. No DONE flip. No acceptance.md tick. Backlog AC-1..AC-8 remain **unchecked** (closure/QE per US-0045). Consumed qa proof `rp-auto-20260918-bug0025-qa-qa-20260918T172625Z-BUG-0025` / `E92C5B23F279866F63FB19BFFA9028578543BCABB7E359420DE93DD218F72D00` MATCH before TTL 2026-09-18T18:26:25Z (not STALE). CROSS_MODEL_REVIEW=0 — no critic-of-qa consume required. Execute proof MATCH before TTL 2026-09-18T18:18:34Z. plan-verify merged PASS at /qa; not spawned. Cursor MCP browser sequence **not run** (packaging/contract slice — fail-closed waiver). No live npm publish / git push / remote bind. T-009 republish remains **deferred** to `/release` confirm.

## Test battery (live)

| Gate | Command / method | Result |
|------|------------------|--------|
| Pytest bug0025 | `python -m pytest tests/bug0025_packaging_contract_test.py -v` | **6 passed** fail 0 in **2.12s** |
| UAT probe lib | `python scripts/uat_probe_lib.py --self-test` | **[UAT_PROBE_LIB_SELF_TEST_OK]** |
| Metadata | `python scripts/check-user-visible-metadata.py --repo .` | **exit 0** |
| Triad | `python scripts/enforce-triad-hot-surface.py --check` | **PASS** (exit 0; rollover if required post-append) |
| Guard | `python scripts/guard_installer_publish.py` | **exit 0** |
| QA proof consume | `compute_strict_proof_hash` 6-field tuple | **MATCH** `E92C5B23F279866F63FB19BFFA9028578543BCABB7E359420DE93DD218F72D00`; ttl `2026-09-18T18:26:25Z`; consumed_at `2026-09-18T17:32:00Z` — **RUNTIME_PROOF_VALID** (not STALE) |
| Execute proof | `compute_strict_proof_hash` | **MATCH** `3E2A70F4BCD3A7E352D6E5E9D6E4A949D12E3D6E95CB39C2B3F99ECFB6B9CE4D`; ttl `2026-09-18T18:18:34Z`; consumed_at `2026-09-18T17:32:00Z` — **RUNTIME_PROOF_VALID** |
| Acceptance row | `docs/product/acceptance.md` | `- [ ] BUG-0025` (not ticked) |
| Backlog | `### BUG-0025` Status | **OPEN**; AC-1..AC-8 **unchecked** |
| Compose guards | US-0147 DONE; US-0133 omit-`standalone/`; BUG-0022/0024 OPEN | **HELD** |

## AC verification (architecture `# BUG-0025` A1 / R-0149)

| AC | Description | Result |
|----|-------------|--------|
| AC-1 | Packaged npm tarball includes standalone_runtime_install_lib.py | **PASS** (UAT-1; npm_pack marker) |
| AC-2 | package.json files allowlist lists that path | **PASS** (UAT-2; package_json_files marker) |
| AC-3 | fail-closed loader → STANDALONE_BOOTSTRAP_FAILED | **PASS** (UAT-3; load_missing marker) |
| AC-4 | bootstrap present/absent without raw FileNotFoundError | **PASS** (UAT-4; wrapper marker) |
| AC-5 | pack + guard contract | **PASS** (UAT-5; guard marker) |
| AC-6 | Republish ships fix (kit 0.1.4 ready; npm publish deferred) | **PASS** (UAT-6; slice; T-009 → `/release` confirm) |
| AC-7 | US-0147 DONE compose-only | **PASS** (UAT-7; us0147 compose marker) |
| AC-8 | Distinct from BUG-0022 / BUG-0024 | **PASS** (UAT-8; backlog spot-check OPEN) |

## Runtime browser evidence (US-0093 / BUG-0006)

- **UAT_BROWSER_PROBE_MODE**: cursor (default).
- Packaging/contract slice — hermetic pytest only.
- Cursor MCP sequence **not run**.
- Live Chrome **not probed** — `browser_smoke` **`UAT_PROBE_FORBIDDEN`** (fail-closed waiver; no fake PASS).
- `cursor_mcp_browser_sequence_run=false`.

## UAT summary

- **Total**: 9 (UAT-1..UAT-8 + `convergence_smoke`)
- **Passed**: 9
- **Failed**: 0
- **uat_lifecycle**: populated + `verified_ready=true` for `/release`
- **Probe class**: `contract_tests_primary`
- **Waived live probes**: 6 × `UAT_PROBE_FORBIDDEN`

## Isolation compliance gate

| Phase | Marker | Result |
|-------|--------|--------|
| execute | `dev-BUG0025-execute-20260918T171834Z-fresh` | PASS |
| qa | `qa-BUG0025-qa-20260918T172625Z-fresh` | PASS |
| verify-work | `qa-BUG0025-verify-20260918T173200Z-fresh` | PASS (this phase) |

## Runtime proofs (full `rp-auto-…`)

| Phase | runtime_proof_id | proof_hash |
|-------|------------------|------------|
| execute | `rp-auto-20260918-bug0025-execute-dev-20260918T171834Z-BUG-0025` | `3E2A70F4BCD3A7E352D6E5E9D6E4A949D12E3D6E95CB39C2B3F99ECFB6B9CE4D` (MATCH; consumed 17:32:00 before ttl 18:18:34) |
| qa (consumed) | `rp-auto-20260918-bug0025-qa-qa-20260918T172625Z-BUG-0025` | `E92C5B23F279866F63FB19BFFA9028578543BCABB7E359420DE93DD218F72D00` (MATCH; consumed 17:32:00 before ttl 18:26:25; **not STALE**) |
| plan-verify | `rp-auto-20260918-bug0025-plan-verify-qa-20260918T172625Z-BUG-0025` | `81FFCBA2FF68A9C861F8A883E5EE0CA3E7247068F37DCEC9DC2F39F23CC003B7` (ultra_lean merged PASS; not spawned) |
| verify-work (issued) | `rp-auto-20260918-bug0025-verify-work-qa-20260918T173200Z-BUG-0025` | `5E2F0C655DEEE74EF60A3BB69553486D291466C1F9466D21A90E9BF91F95A75B` |

Canonical hashed payload (this phase): `{"orchestrator_run_id":"auto-20260918-bug0025","phase_id":"verify-work","proof_issued_at":"2026-09-18T17:32:00Z","proof_ttl_seconds":3600,"role":"qa","runtime_proof_id":"rp-auto-20260918-bug0025-verify-work-qa-20260918T173200Z-BUG-0025"}`  
`hash_recompute_confirmation=true`

## Generated-test evidence (US-0066)

- `generated_test_stack_profile`: python
- `generated_test_command`: `python -m pytest tests/bug0025_packaging_contract_test.py -v`
- `generated_test_result`: pass
- `generated_test_output_ref`: this file § Test battery (6 passed in 2.12s this pass)
- `generated_test_paths_ref`: `tests/bug0025_packaging_contract_test.py`; `sprints/S0157/qa-findings.md`
- `generated_test_reason_code`: none (pass)

## Status (US-0045)

- backlog Status: **OPEN** (not DONE)
- acceptance BUG-0025: **unchecked**
- AC-1..AC-8: **unchecked** (closure/QE; independently verified this pass)
- US-0147: DONE preserved (compose-only)
- US-0133 omit-`standalone/`: held
- BUG-0022 / BUG-0024: OPEN (not mutated)

## Deferred (not a verify-work blocker)

- **T-009**: npm republish of `its-magic@0.1.4` awaits `/release` operator confirm (`RELEASE_PUBLISH_MODE=confirm`).

## Blocking findings

None.

## Next

`/release` (fresh **release** subagent). CROSS_MODEL_REVIEW=0 — no sovereign-critic. **STOP** — do not spawn `/release` from this subagent. Do NOT mark BUG-0025 DONE. Do NOT tick ACs. Do NOT npm publish.
