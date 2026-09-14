# Verify-Work Findings — S0143 / US-0137

**Phase**: verify-work  
**Role**: qa (fresh subagent)  
**Story**: US-0137 (Owned tool broker, policy engine, and security boundary)  
**Sprint**: S0143  
**Orchestrator run**: auto-20260913-us0137  
**Parent run**: auto-20260913-us0136  
**Verify-work timestamp**: 2026-09-13T12:15:00Z  
**Fresh context marker**: qa-US0137-verify-20260913T121500Z-fresh  
**model_id**: cursor-grok-4.6-high (CROSS_MODEL_REVIEW=1)  
**delivery_mode**: ultra_lean  
**macro_phase**: build+verify (verify-work terminal)  
**AUTO_QUIET**: 1  
**FRAMEWORK_KIT_REPO**: 1  
**Verdict**: VERIFY_WORK_PASS  

## Independent verify-work verification

Fresh QA subagent per US-0048 / BUG-0006. Marker is **new** (not reused `qa-US0137-qa-20260913T115500Z-fresh`, `dev-US0137-execute-20260913T113500Z-fresh`, or `critic-US0137-qa-20260913T120500Z-fresh`). Context limited to artifacts/handoffs (narrow-read). Independent re-run of standalone `npm test` (10/10 `test_us0137_*`) + kit pytest twins (us0137/us0136/us0135/us0134/us0133). UAT populated (DEC-0009) UAT-1..UAT-8 + `convergence_smoke`. Six live-runtime classes `UAT_PROBE_FORBIDDEN`. **No fake browser PASS.** No `.env`. No live paid provider. No DONE flip. Consumed qa proof `rp-auto-20260913-us0137-qa-qa-20260913T115500Z-US-0137` / `8EBB63CA756128E72E0C938ABDAF7FAC368EC21F17CB853C89F2CCAB0C4A5C13` MATCH before TTL 12:55. Critic of QA PASS (0 blocking; anti_slop=10; `us0137qa-*`; degraded_mode=false). plan-verify SKIPPED (ultra_lean placeholder; not spawned).

## Test battery (live)

| Gate | Command / method | Result |
|------|------------------|--------|
| Standalone contract + unit | `npm test` (cwd `standalone/`) | **46 passed** in 2.91s (fail 0); **10/10** `test_us0137_*` |
| Kit + compose contract tests | `python -m pytest tests/us0137_contract_test.py tests/us0136_contract_test.py tests/us0135_contract_test.py tests/us0134_contract_test.py tests/us0133_contract_test.py -v` | **9 passed** in 0.76s |
| Template byte pair | `filecmp` `tests/us0137_contract_test.py` ↔ `template/tests/us0137_contract_test.py` | **IDENTICAL** |
| UAT probe lib | `python scripts/uat_probe_lib.py --self-test` | **[UAT_PROBE_LIB_SELF_TEST_OK]** |
| Metadata | `python scripts/check-user-visible-metadata.py --repo .` | **exit 0** |
| Triad hot-surface (pre-write) | `python scripts/enforce-triad-hot-surface.py --check` | **STATE_ARCHIVE_REQUIRED** 1224/1200 → rollover then append |
| QA proof consume | `compute_strict_proof_hash` 6-field tuple | **MATCH** `8EBB63CA756128E72E0C938ABDAF7FAC368EC21F17CB853C89F2CCAB0C4A5C13`; ttl `2026-09-13T12:55:00Z`; consumed_at `2026-09-13T12:15:00Z` — **RUNTIME_PROOF_VALID** |
| Critic of qa proof | `compute_strict_proof_hash` | **MATCH** `BEA2FEA4BC5B504025B5454EFF6AC08B4BF96D03733FEDAF66CC057AEBBE1CCB`; blocking_count=0; anti_slop=10; degraded_mode=false |
| Execute proof consume | `compute_strict_proof_hash` | **MATCH** `5C187C567072CD6F3809884EA3F220E399EEF4A3222F88A757917A08976B0A49`; ttl `2026-09-13T12:35:00Z`; consumed_at `2026-09-13T12:15:00Z` — **RUNTIME_PROOF_VALID** |
| Acceptance row | `docs/product/acceptance.md` | `- [ ] US-0137` (not ticked) |
| Backlog | `## US-0137` Status | **OPEN** |

## AC verification (architecture `# US-0137` A1)

| AC | Description | Result |
|----|-------------|--------|
| AC-1 | Pi sessions receive only role/phase `itsm_*` via ToolBroker; no raw Pi mutation tools | **PASS** (UAT-1; markers 1, 2, 10) |
| AC-2 | PolicyEngine tuple → ALLOW \| ASK \| DENY | **PASS** (UAT-2; T-002) |
| AC-3 | Path ownership deny matrix | **PASS** (UAT-3; markers 3, 4, 6) |
| AC-4 | Shell parse/classify + fail-safe | **PASS** (UAT-4; markers 6, 7) |
| AC-5 | Secrets never in LLM context; header redaction | **PASS** (UAT-5; markers 5, 8) |
| AC-6 | Layer A ≠ Layer B profiles | **PASS** (UAT-6; marker 9) |
| AC-7 | Compact audit + real `policy_hash` | **PASS** (UAT-7; T-007) |
| AC-8 | Security tests cover malicious Pi, `.env`, traversal, exfil, redaction, missing backend | **PASS** (UAT-8; markers 1–10) |

## User-facing validation

- **Owned `itsm_*` only**: PASS (surrogate) — markers 1, 2, 10; `noTools: "builtin"`; orchestrator `[]`.
- **PolicyEngine ALLOW\|ASK\|DENY**: PASS — owned TypeScript tables; `security_hard` unrelaxable.
- **Path / shell / secret deny**: PASS — markers 3–8; `.env` denied before content.
- **Layer A ≠ Layer B**: PASS — missing backend → `ISOLATION_BACKEND_UNAVAILABLE`; no OS-sandbox claim.
- **Audit + `policy_hash`**: PASS — ToolBroker `computePolicyHash`; DEC-0038 tuple unamended.
- **No fake browser PASS**: held (not `browser_smoke`).

## UAT summary

- **Total**: 9 (UAT-1..UAT-8 + `convergence_smoke`)
- **Passed**: 9
- **Failed**: 0
- **uat_lifecycle**: populated (DEC-0009; verify-work re-attest; verified-ready for `/release`)
- **Probe class**: `contract_tests_primary`
- **Waived live probes**: 6 × `UAT_PROBE_FORBIDDEN` (no fake browser PASS)
- **convergence_smoke**: pass (`contract_test_failed=0`)
- **harness_fail_zero_claimed**: false

## Isolation compliance gate

| Phase | Marker | Result |
|-------|--------|--------|
| execute | `dev-US0137-execute-20260913T113500Z-fresh` | PASS |
| qa | `qa-US0137-qa-20260913T115500Z-fresh` | PASS |
| verify-work | `qa-US0137-verify-20260913T121500Z-fresh` | PASS (this phase) |

## Runtime proofs (full `rp-auto-…`)

| Phase | runtime_proof_id | proof_hash |
|-------|------------------|------------|
| execute | `rp-auto-20260913-us0137-execute-dev-20260913T113500Z-US-0137` | `5C187C567072CD6F3809884EA3F220E399EEF4A3222F88A757917A08976B0A49` (MATCH; consumed 12:15 before ttl 12:35) |
| qa (consumed) | `rp-auto-20260913-us0137-qa-qa-20260913T115500Z-US-0137` | `8EBB63CA756128E72E0C938ABDAF7FAC368EC21F17CB853C89F2CCAB0C4A5C13` (MATCH; consumed 12:15 before ttl 12:55) |
| plan-verify | `rp-auto-20260913-us0137-plan-verify-qa-20260913T115500Z-US-0137` | `F66022E20112E7501BDB7D43B5364527E5474D0AB29E823B01EE411FCB90FBB7` (ultra_lean SKIPPED placeholder; not spawned) |
| critic of qa | `rp-auto-20260913-us0137-sovereign-critic-techlead-20260913T120500Z-US-0137` | `BEA2FEA4BC5B504025B5454EFF6AC08B4BF96D03733FEDAF66CC057AEBBE1CCB` (MATCH; 0 blocking; anti_slop=10) |
| verify-work (issued) | `rp-auto-20260913-us0137-verify-work-qa-20260913T121500Z-US-0137` | `1935425E70F1379A9D9AEE780CC1A42A9F54D18F766D5F321DDED8145B8E99E1` |

## Generated-test evidence (US-0066)

- `generated_test_stack_profile`: python + node
- `generated_test_command`: `python -m pytest tests/us0137_contract_test.py tests/us0136_contract_test.py tests/us0135_contract_test.py tests/us0134_contract_test.py tests/us0133_contract_test.py -v` + `npm test` (cwd `standalone/`)
- `generated_test_result`: pass
- `generated_test_output_ref`: this file § Test battery (pytest 9 passed in 0.76s; npm test 46 passed in 2.91s)
- `generated_test_paths_ref`: `tests/us0137_contract_test.py`; `template/tests/us0137_contract_test.py`; `standalone/tests/contract/us0137.contract.test.ts`; `sprints/S0143/summary.md` Test results
- `generated_test_reason_code`: none (pass)
- FRAMEWORK_KIT_REPO=1 kit + unpublished standalone workspace contract tests (not generated-app scaffolds); do not fail `TEST_SCAFFOLD_GENERATION_FAILED`

## Status (US-0045)

- backlog Status: **OPEN** (not DONE)
- acceptance US-0137: **unchecked**
- AC-1..AC-8: **unchecked**
- US-0133 / US-0134 / US-0135 / US-0136: DONE preserved (compose-only)
- BUG-0020: DONE preserved (not reopened)
- intake JSON: not mutated
- architecture.md / DEC-0137 / R-0129: not mutated this phase

## Blocking findings

None.

## Non-blocking (informational)

| ID | Note |
|----|------|
| NB1 / us0137qa-challenger-001 | qa + execute proofs MATCH+not-STALE; 10/10 + 9/9 independently re-verified; fail-closed raw Pi tools / path / shell exfil / secret deny / Layer B unavailable / malicious extensions locked in tests |
| NB2 / us0137qa-architect-002 | policy-engine + tool-broker no Pi; `defineTool` only in pi-kernel; PolicyEngine vs RoleCatalog; US-0141 Layer B deferred; isolation/`noTools`/KernelBridge/auth-models unamended; verify-work re-attested DEC-0009 |
| NB3 / us0137qa-subtractor-003 | no DONE / no US-0138+ / no live paid CI / no isolation loader amend / no OS-sandbox claim / US-0136/US-0135/BUG-0020 not reopened |

## Next

`/release` (fresh **release** subagent). STOP — do not spawn `/release` from this subagent.
