# Verify-Work Findings — S0154 / US-0147

**Phase**: verify-work  
**Role**: qa (fresh subagent)  
**Story**: US-0147 (Installation, update, and existing-project adoption)  
**Sprint**: S0154  
**Orchestrator run**: auto-20260917-us0146  
**Parent run**: auto-20260913-us0144  
**Verify-work timestamp**: 2026-09-17T21:20:00Z  
**Fresh context marker**: qa-US0147-verify-20260917T212000Z-fresh  
**model_id**: inherit (CROSS_MODEL_REVIEW=0)  
**delivery_mode**: ultra_lean  
**macro_phase**: build+verify (verify-work terminal of build+verify)  
**AUTO_QUIET**: 1  
**FRAMEWORK_KIT_REPO**: 1  
**Verdict**: VERIFY_PASS  

## Independent verify-work verification

Fresh QA subagent per US-0048 / BUG-0006. Marker is **new** (not reused `qa-US0147-qa-20260917T211000Z-fresh` or `dev-US0147-execute-20260917T205500Z-fresh`). Consumed qa proof from state (`qa-US0147-qa-20260917T211000Z-fresh`). Independent re-run of `python -m pytest tests/us0147_contract_test.py` (**10 passed** in 0.11s; **10/10** `test_us0147_*`). Standalone `npm test` 140/140 remains QA attestation (not re-run this pass). UAT populated (DEC-0009) UAT-1..UAT-8 + `convergence_smoke`. Probe class `contract_tests_primary`. Six live-runtime classes `UAT_PROBE_FORBIDDEN` including **live Chrome `browser_smoke`**. **No fake live-Chrome PASS.** `live_chrome_probed=false`. `fake_browser_pass_claimed=false`. `harness_fail_zero_claimed=false`. No `.env`. No intake mutation. No DONE flip. No acceptance.md tick. Backlog AC-1..AC-8 remain **unchecked** (closure/QE per US-0045). Consumed qa proof `rp-auto-20260917-us0146-qa-qa-20260917T211000Z-US-0147` / `7E4E7E06144D91A7AAF7575922B9BB89E764465E12DCEEFC002B781B9096272E` MATCH before TTL 2026-09-17T22:10:00Z (not STALE). CROSS_MODEL_REVIEW=0 — no critic-of-qa consume required. Execute proof MATCH before TTL 2026-09-17T21:55:00Z. plan-verify SKIPPED placeholder overwritten PASS at /qa; not spawned. Cursor MCP browser sequence **not run** (explicit browser setup gate only — fail-closed waiver).

## Test battery (live)

| Gate | Command / method | Result |
|------|------------------|--------|
| Scoped pytest contract | `python -m pytest tests/us0147_contract_test.py -q` | **10 passed** in 0.11s (**10/10** `test_us0147_*`) |
| Standalone contract + unit | `npm test` (cwd `standalone/`) | **140/140** qa attestation (2026-09-17T21:10:00Z); **not re-run this pass** |
| UAT probe lib | `python scripts/uat_probe_lib.py --self-test` | **[UAT_PROBE_LIB_SELF_TEST_OK]** |
| Metadata | `python scripts/check-user-visible-metadata.py --repo .` | **exit 0** |
| Triad pre-write | `python scripts/enforce-triad-hot-surface.py --check` | **PASS** (exit 0) |
| QA proof consume | `compute_strict_proof_hash` 6-field tuple | **MATCH** `7E4E7E06144D91A7AAF7575922B9BB89E764465E12DCEEFC002B781B9096272E`; ttl `2026-09-17T22:10:00Z`; consumed_at `2026-09-17T21:20:00Z` — **RUNTIME_PROOF_VALID** (not STALE) |
| Execute proof | `compute_strict_proof_hash` | **MATCH** `4130FD8893FD5035C4A1927F18B4BA0D0026C35CA31D22F08E183D7E9A10EB4A`; ttl `2026-09-17T21:55:00Z`; consumed_at `2026-09-17T21:20:00Z` — **RUNTIME_PROOF_VALID** |
| Acceptance row | `docs/product/acceptance.md` | `- [ ] US-0147` (not ticked) |
| Backlog | `## US-0147` Status | **OPEN**; AC-1..AC-8 **unchecked** |

## AC verification (architecture `# US-0147` A1)

| AC | Description | Result |
|----|-------------|--------|
| AC-1 | Install/update Win+Linux + rollback | **PASS** (UAT-1; markers m1,m6,m8) |
| AC-2 | Fresh init without backlog clone | **PASS** (UAT-2; marker m1) |
| AC-3 | Adopt existing repos | **PASS** (UAT-3; markers m3,m4) |
| AC-4 | Host coexistence | **PASS** (UAT-4; marker m5) |
| AC-5 | deny_overwrite preservation | **PASS** (UAT-5; markers m2,m9) |
| AC-6 | Kernel mismatch diagnostics | **PASS** (UAT-6; marker m7) |
| AC-7 | Operator runbook/docs | **PASS** (UAT-7; markers m8,m10) |
| AC-8 | Lifecycle test matrix | **PASS** (UAT-8; 10/10 this pass) |

## Runtime browser evidence (US-0093 / BUG-0006)

- **UAT_BROWSER_PROBE_MODE**: cursor (default).
- Explicit `itsm setup browser` gate only — not a live Chrome ownership story.
- Cursor MCP sequence **not run**.
- Live Chrome **not probed** — `browser_smoke` **`UAT_PROBE_FORBIDDEN`** (fail-closed waiver; no fake PASS).
- No screenshot under `sprints/S0154/evidence/browser/`.
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
| execute | `dev-US0147-execute-20260917T205500Z-fresh` | PASS |
| qa | `qa-US0147-qa-20260917T211000Z-fresh` | PASS |
| verify-work | `qa-US0147-verify-20260917T212000Z-fresh` | PASS (this phase) |

## Runtime proofs (full `rp-auto-…`)

| Phase | runtime_proof_id | proof_hash |
|-------|------------------|------------|
| execute | `rp-auto-20260917-us0146-execute-dev-20260917T205500Z-US-0147` | `4130FD8893FD5035C4A1927F18B4BA0D0026C35CA31D22F08E183D7E9A10EB4A` (MATCH; consumed 21:20:00 before ttl 21:55:00) |
| qa (consumed) | `rp-auto-20260917-us0146-qa-qa-20260917T211000Z-US-0147` | `7E4E7E06144D91A7AAF7575922B9BB89E764465E12DCEEFC002B781B9096272E` (MATCH; consumed 21:20:00 before ttl 22:10:00; **not STALE**) |
| plan-verify | `rp-auto-20260917-us0146-plan-verify-qa-20260917T211000Z-US-0147` | `A4A8AC207D43E2C72383A1F0DE96364E04DFE687D98EE590ED1A922BCBA7A8FC` (ultra_lean SKIPPED placeholder overwritten PASS; not spawned) |
| verify-work (issued) | `rp-auto-20260917-us0146-verify-work-qa-20260917T212000Z-US-0147` | `D53214A54301469C6CACC27988350CC3FD3739F1E99738DBCBFE9B6974E70310` |

Canonical hashed payload (this phase): `{"orchestrator_run_id":"auto-20260917-us0146","phase_id":"verify-work","proof_issued_at":"2026-09-17T21:20:00Z","proof_ttl_seconds":3600,"role":"qa","runtime_proof_id":"rp-auto-20260917-us0146-verify-work-qa-20260917T212000Z-US-0147"}`  
`hash_recompute_confirmation=true`

## Generated-test evidence (US-0066)

- `generated_test_stack_profile`: python+node
- `generated_test_command`: `python -m pytest tests/us0147_contract_test.py`
- `generated_test_result`: pass
- `generated_test_output_ref`: this file § Test battery (10 passed in 0.11s this pass)
- `generated_test_paths_ref`: `tests/us0147_contract_test.py`; `sprints/S0154/summary.md`
- `generated_test_reason_code`: none (pass)

## Status (US-0045)

- backlog Status: **OPEN** (not DONE)
- acceptance US-0147: **unchecked**
- AC-1..AC-8: **unchecked** (closure/QE; independently verified this pass)
- US-0140..US-0146: DONE preserved (compose-only)
- US-0145/US-0148: OPEN (not mutated)
- BUG-*: not mutated

## Next

`/release` (fresh **release** subagent). CROSS_MODEL_REVIEW=0 — no sovereign-critic. **STOP** — do not spawn `/release` from this subagent.
