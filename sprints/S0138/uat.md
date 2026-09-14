# Sprint S0138 — UAT (US-0134) — populated at /verify-work (DEC-0009)

- **uat_lifecycle**: populated (verify-work PASS; DEC-0009 qa_seeded → populated complete)
- **sprint_id**: S0138
- **story_id**: US-0134
- **phase**: verify-work (build+verify macro)
- **role**: qa (fresh per BUG-0006)
- **orchestrator_run_id**: auto-20260912-us0134
- **delivery_mode**: ultra_lean
- **macro_phase**: build+verify
- **story_type**: code (unpublished standalone KernelBridge / contract-test slice; FRAMEWORK_KIT_REPO=1)
- **fresh_context_marker**: `qa-US0134-verifywork-20260912T133500Z-fresh`
- **timestamp**: 2026-09-12T13:35:00Z (UTC)
- **model_id**: cursor-grok-4.6 (CROSS_MODEL_REVIEW=1 — required)
- **producer_phase_id**: qa (role=qa; **QA_PASS**; `blocking_count=0`)
- **critic_phase_id**: sovereign-critic of qa (tech-lead, composer-2.5-fast; PASS; anti_slop=10; marker `critic-US0134-qa-20260912T133000Z-fresh`)
- **verdict**: **PASS** (verify-work) — UAT 7/7 pass, 0 fail (AC-1..AC-6 → UAT-1..UAT-6 + canonical `convergence_smoke`); live pytest **6 passed** in 0.61s + standalone `npm test` **16 passed** in 2.74s (**10/10** `test_us0134_*`); kernel-bridge present; kit omit-guard PASS
- **total_steps**: 7 (UAT-1..UAT-6 + canonical `convergence_smoke`)
- **passed**: 7 | **failed**: 0
- **story_status**: OPEN (do not mark US-0134 DONE — US-0045; acceptance US-0134 unchecked; intake JSON not mutated)
- **blocking_findings**: 0
- **non_blocking_findings**: 3 (NB1..NB3 critic carry-forwards — informational)
- **harness_fail_zero_claimed**: false (slice contract tests are the required evidence)
- **browser_probe_used**: false (no fake browser PASS)

## Probe class — unpublished standalone KernelBridge

US-0134 is a kit + unpublished `standalone/` workspace / contract-test slice. Applicable probe: `contract_tests_primary` (10 markers). User-facing validation: KernelBridge locates the kernel, checks an explicit range, fail-closes with four `KERNEL_*` codes, and spawns shipped Python validators. No web UI. Six live-runtime classes waived with **`UAT_PROBE_FORBIDDEN`**. **No silent browser PASS.** MCP browser sequence not run. No live provider. No `.env`.

Canonical surrogate step `id=convergence_smoke` kept `result=pass` because `contract_test_failed=0` (10/10).

## Target story + acceptance criteria (architecture `# US-0134` A1)

- **US-0134** — Existing kernel bridge and compatibility handshake
  - **Primary** (`docs/product/acceptance.md`): authoritative Python validators, artifact memory, version range, and fail-closed bridge (6 ACs). — **PASS** (verify-work); checkbox **unchecked**
  - AC-1: PASS — locate + artifacts + manifest + named validators (UAT-1)
  - AC-2: PASS — explicit supported range (UAT-2)
  - AC-3: PASS — four fail-closed `KERNEL_*` codes (UAT-3)
  - AC-4: PASS — Python SOT PASS/FAIL/crash (UAT-4)
  - AC-5: PASS — canonical artifact memory (UAT-5)
  - AC-6: PASS — 10 contract fixtures Win/Linux (UAT-6)

## UAT step results (verify-work)

| Step | AC | Result | Evidence |
|------|----|--------|----------|
| UAT-1 | AC-1 | pass | markers 1+6+7+8+10; KernelBridge locate + runValidator + uat/status wrappers; installer include-list; kernel-bridge present |
| UAT-2 | AC-2 | pass | markers 3+4; `includePrerelease`; `0.1.3-9` in-range; `0.1.2` unsupported; not filenames |
| UAT-3 | AC-3 | pass | markers 2+4+5+6; exactly four `KERNEL_*`; FAIL/timeout/crash = `ValidatorResult` |
| UAT-4 | AC-4 | pass | markers 7+8+9; real Python PASS/FAIL/timeout; resolved interpreter; no TS rewrite |
| UAT-5 | AC-5 | pass | marker 5; required ten vs optional `work_packs`/`sovereign`; missing backlog = mismatch |
| UAT-6 | AC-6 | pass | 10/10 `test_us0134_*`; CI Windows+Linux `working-directory: standalone` |
| convergence_smoke | surrogate | pass | `contract_test_failed=0`; 6 waived probes `UAT_PROBE_FORBIDDEN` |

## Contract test markers (10) — verify-work live re-run

`python -m pytest tests/us0134_contract_test.py tests/us0133_contract_test.py -v` — **6 passed** in 0.61s.

`npm test` (cwd `standalone/`) — **16 passed** in 2.74s (fail 0). Combined **10/10** `test_us0134_*` at 2026-09-12T13:35:00Z.

1. `test_us0134_locate_three_marker_and_kernel_root` — PASS
2. `test_us0134_kernel_not_found_empty_walk` — PASS
3. `test_us0134_supported_version_0_1_3_9_in_range` — PASS
4. `test_us0134_unsupported_version_0_1_2` — PASS
5. `test_us0134_contract_mismatch_bad_manifest_or_missing_backlog` — PASS
6. `test_us0134_validator_missing` — PASS
7. `test_us0134_validator_pass_advances` — PASS (real Python, 190ms)
8. `test_us0134_validator_fail_blocks_with_python_reason` — PASS (real Python, 174ms)
9. `test_us0134_validator_crash_or_timeout` — PASS (913ms)
10. `test_us0134_kit_files_omit_standalone_and_no_pi_in_kernel_bridge` — PASS

## User-facing validation (this phase)

| Check | Result |
|-------|--------|
| KernelBridge locates kit + consumer trees | **PASS** — `@its-magic/kernel-bridge` present; three-marker walk + `--kernel-root`; no Pi imports |
| Range is explicit, not inferred | **PASS** — `supported-kernel-range.json` + `semver@7.8.5` `includePrerelease` |
| Fail-closed handshake | **PASS** — four `KERNEL_*` only; missing manifest never silent-defaults |
| Python validators remain SOT | **PASS** — real spawn PASS/FAIL/timeout; thin wrappers only |
| Kit publish omit-guard | **PASS** — `files` omit `standalone/`; guard exit 0 |

## Waived probes (honest live-runtime)

| Probe | reason_code |
|-------|-------------|
| browser_smoke | `UAT_PROBE_FORBIDDEN` (kit/workspace slice; no web UI) |
| api_health | `UAT_PROBE_FORBIDDEN` (no runtime HTTP API) |
| process_health | `UAT_PROBE_FORBIDDEN` (no runtime app server) |
| cli_smoke | `UAT_PROBE_FORBIDDEN` (CLI stub; no live provider) |
| build | `UAT_PROBE_FORBIDDEN` (typecheck/lint recorded as independent checks) |
| manual_operator | `UAT_PROBE_FORBIDDEN` (operator ticks remain /closure; no live provider host) |

## Isolation compliance gate (US-0048 / DEC-0029)

| Phase | Marker | Result |
|-------|--------|--------|
| execute | `dev-US0134-execute-20260912T130500Z-fresh` | PASS |
| qa | `qa-US0134-qa-20260912T132500Z-fresh` | PASS |
| verify-work | `qa-US0134-verifywork-20260912T133500Z-fresh` | PASS (this phase; NEW — not reused qa marker) |

## Runtime proofs (full `rp-auto-…` — not truncated `p-auto`)

| Phase | runtime_proof_id | proof_hash |
|-------|------------------|------------|
| execute | `rp-auto-20260912-us0134-execute-dev-20260912T131500Z-US-0134` | `A75A4045100649512DB5032C31C6872A0E4984D17E6839830CDB09C22C8B80ED` (MATCH; ttl 14:15) |
| qa (consumed) | `rp-auto-20260912-us0134-qa-qa-20260912T132500Z-US-0134` | `92A021927CBDDC9D1EB57FBC06E31D3A185988C3B177FD609020FF14ADA47900` (MATCH; consumed 13:35 before ttl 14:25) |
| plan-verify | `rp-auto-20260912-us0134-plan-verify-qa-20260912T132500Z-US-0134` | `0DE8E6CC5461977A12B352AF2950C6EDAC287CEAA9A6B21BE7513C844256D3C4` |
| verify-work (issued) | `rp-auto-20260912-us0134-verify-work-qa-20260912T133500Z-US-0134` | `1AAC2D0CAE8BC51BC24BC258D536D23CBBCA1B49D4AEEB8D977BBE94534F009A` |

## Results summary vs acceptance

| Bucket | Count |
|--------|-------|
| PASS | 7 |
| FAIL | 0 |
| Total steps | 7 |

All six acceptance criteria (AC-1..AC-6) map to UAT-1..UAT-6 and **PASS**. Canonical `convergence_smoke` **PASS**. Backlog Status remains **OPEN** (US-0045); acceptance US-0134 unchecked. Machine-readable: `sprints/S0138/uat.json`.

## Next

- Sovereign-critic of verify-work (if CROSS_MODEL_REVIEW=1) → **`/release`** (fresh **release**) for **S0138** / **US-0134**
- STOP — do not spawn `/release` from this subagent. Do NOT mark US-0134 DONE. Do NOT tick acceptance. Do NOT drain-advance. Operator stops after S0138 ship.
