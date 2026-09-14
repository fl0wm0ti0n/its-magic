# Verify-Work Findings — S0141 / US-0135

**Phase**: verify-work  
**Role**: qa (fresh subagent)  
**Story**: US-0135 (Standalone authentication and model routing)  
**Sprint**: S0141  
**Orchestrator run**: auto-20260913-us0135  
**Parent run**: auto-20260913-bug0020  
**Verify-work timestamp**: 2026-09-13T05:35:00Z  
**Fresh context marker**: qa-US0135-verify-20260913T053500Z-fresh  
**model_id**: cursor-grok-4.6-high (CROSS_MODEL_REVIEW=1)  
**delivery_mode**: ultra_lean  
**macro_phase**: build+verify (verify-work terminal)  
**AUTO_QUIET**: 1  
**FRAMEWORK_KIT_REPO**: 1  
**Verdict**: VERIFY_WORK_PASS  

## Independent verify-work verification

Fresh QA subagent per US-0048 / BUG-0006. Marker is **new** (not reused `qa-US0135-qa-20260913T051500Z-fresh`, `dev-US0135-execute-20260913T045500Z-fresh`, or `critic-US0135-qa-20260913T052500Z-fresh`). Context limited to artifacts/handoffs (narrow-read). Independent re-run of standalone `npm test` (10/10 `test_us0135_*`) + kit pytest twins (us0135/us0134/us0133). UAT populated (DEC-0009) UAT-1..UAT-7 + `convergence_smoke`. Six live-runtime classes `UAT_PROBE_FORBIDDEN`. **No fake browser PASS.** No `.env`. No live paid provider. No DONE flip. Consumed qa proof `rp-auto-20260913-us0135-qa-qa-20260913T051500Z-US-0135` / `B69C281FBBA494558E704A45F1BDE842C49789A1F3A5259C39B848DF23401FF4` MATCH before TTL 06:15. Critic of QA PASS (0 blocking; anti_slop=10; `us0135qa-*`).

## Test battery (live)

| Gate | Command / method | Result |
|------|------------------|--------|
| Standalone contract + unit | `npm test` (cwd `standalone/`) | **26 passed** in 2.67s (fail 0); **10/10** `test_us0135_*` |
| Kit + compose contract tests | `python -m pytest tests/us0135_contract_test.py tests/us0134_contract_test.py tests/us0133_contract_test.py -v` | **7 passed** in 0.63s |
| Template byte pair | `filecmp` `tests/us0135_contract_test.py` ↔ `template/tests/us0135_contract_test.py` | **IDENTICAL** |
| UAT probe lib | `python scripts/uat_probe_lib.py --self-test` | **[UAT_PROBE_LIB_SELF_TEST_OK]** |
| Metadata | `python scripts/check-user-visible-metadata.py --repo .` | **exit 0** |
| Triad hot-surface (pre-write) | `python scripts/enforce-triad-hot-surface.py --check` | **PASS** (exit 0) |
| QA proof consume | `compute_strict_proof_hash` 6-field tuple | **MATCH** `B69C281FBBA494558E704A45F1BDE842C49789A1F3A5259C39B848DF23401FF4`; ttl `2026-09-13T06:15:00Z`; consumed_at `2026-09-13T05:35:00Z` — **RUNTIME_PROOF_VALID** |
| Critic of qa proof | `compute_strict_proof_hash` | **MATCH** `C614CE148830C9D0227B190525A8F936FB0887C84561A2998FAD7EACE58E7481`; blocking_count=0; anti_slop=10 |
| Execute proof consume | `compute_strict_proof_hash` | **MATCH** `B07A7BE059C98286441986C077D91726953F416F198548DDB89664E2BEAFFEB0`; ttl `2026-09-13T05:55:00Z`; consumed_at `2026-09-13T05:35:00Z` — **RUNTIME_PROOF_VALID** |
| Acceptance row | `docs/product/acceptance.md` | `- [ ] US-0135` (not ticked) |
| Backlog | `## US-0135` Status | **OPEN** |

## AC verification (architecture `# US-0135` A1)

| AC | Description | Result |
|----|-------------|--------|
| AC-1 | CLI auth listing/config (Codex OAuth + API-key); owned credential location outside project files | **PASS** (UAT-1; markers 1–3) |
| AC-2 | Provider matrix (built-in, Chinese, local OpenAI-compat, custom gateway) via Pi adapters | **PASS** (UAT-2; marker 8) |
| AC-3 | 6-step model resolution with observable provenance | **PASS** (UAT-3; marker 4) |
| AC-4 | Thinking independent of slug and token profile | **PASS** (UAT-4; marker 5) |
| AC-5 | Critic pin; same-slug `CROSS_MODEL_DEGRADED_MODE` | **PASS** (UAT-5; marker 6) |
| AC-6 | `itsm auth` / `models list` / `models test` diagnostics without tokens | **PASS** (UAT-6; marker 7) |
| AC-7 | Two roles different providers; OAuth refresh never exposes tokens | **PASS** (UAT-7; markers 8–10) |

## User-facing validation

- **Owned OS credential store**: PASS (surrogate) — markers 1–2; no project/`.env`/`~/.pi/agent` ship store. No live OAuth this phase.
- **Provider matrix + two-role fake**: PASS — marker 8; no live paid provider CI.
- **6-step router + thinking + critic degraded**: PASS — markers 4–6.
- **CLI diagnostics without tokens**: PASS — marker 7; `--live` CI forbidden.
- **Fake-model CI / empty loader held**: PASS — marker 10.
- **No fake browser PASS**: held (not `browser_smoke`).

## UAT summary

- **Total**: 8 (UAT-1..UAT-7 + `convergence_smoke`)
- **Passed**: 8
- **Failed**: 0
- **uat_lifecycle**: populated (DEC-0009; verify-work re-attest)
- **Probe class**: `contract_tests_primary`
- **Waived live probes**: 6 × `UAT_PROBE_FORBIDDEN` (no fake browser PASS)
- **convergence_smoke**: pass (`contract_test_failed=0`)

## Isolation compliance gate

| Phase | Marker | Result |
|-------|--------|--------|
| execute | `dev-US0135-execute-20260913T045500Z-fresh` | PASS |
| qa | `qa-US0135-qa-20260913T051500Z-fresh` | PASS |
| verify-work | `qa-US0135-verify-20260913T053500Z-fresh` | PASS (this phase) |

## Runtime proofs (full `rp-auto-…`)

| Phase | runtime_proof_id | proof_hash |
|-------|------------------|------------|
| execute | `rp-auto-20260913-us0135-execute-dev-20260913T045500Z-US-0135` | `B07A7BE059C98286441986C077D91726953F416F198548DDB89664E2BEAFFEB0` (MATCH; consumed 05:35 before ttl 05:55) |
| qa (consumed) | `rp-auto-20260913-us0135-qa-qa-20260913T051500Z-US-0135` | `B69C281FBBA494558E704A45F1BDE842C49789A1F3A5259C39B848DF23401FF4` (MATCH; consumed 05:35 before ttl 06:15) |
| plan-verify | `rp-auto-20260913-us0135-plan-verify-qa-20260913T051500Z-US-0135` | `2D0FFBA0968AA99908DF3FCBD1EE35655710FEBD75CDBAD480D7A1D282E48F37` |
| critic of qa | `rp-auto-20260913-us0135-sovereign-critic-techlead-20260913T052500Z-US-0135` | `C614CE148830C9D0227B190525A8F936FB0887C84561A2998FAD7EACE58E7481` (MATCH; 0 blocking; anti_slop=10) |
| verify-work (issued) | `rp-auto-20260913-us0135-verify-work-qa-20260913T053500Z-US-0135` | `F734761A3CB9137695BC648CD9B870979E83622A0094F29B579993E8F55CF32E` |

## Generated-test evidence (US-0066)

- `generated_test_stack_profile`: python + node
- `generated_test_command`: `python -m pytest tests/us0135_contract_test.py tests/us0134_contract_test.py tests/us0133_contract_test.py -v` + `npm test` (cwd `standalone/`)
- `generated_test_result`: pass
- `generated_test_output_ref`: this file § Test battery (pytest 7 passed in 0.63s; npm test 26 passed in 2.67s)
- `generated_test_paths_ref`: `tests/us0135_contract_test.py`; `template/tests/us0135_contract_test.py`; `standalone/tests/contract/us0135.contract.test.ts`; `sprints/S0141/summary.md` Test results
- `generated_test_reason_code`: none (pass)
- FRAMEWORK_KIT_REPO=1 kit + unpublished standalone workspace contract tests (not generated-app scaffolds); do not fail `TEST_SCAFFOLD_GENERATION_FAILED`

## Status (US-0045)

- backlog Status: **OPEN** (not DONE)
- acceptance US-0135: **unchecked**
- AC-1..AC-7: **unchecked**
- US-0133 / US-0134: DONE preserved (compose-only)
- BUG-0020: DONE preserved (not reopened)
- intake JSON: not mutated
- architecture.md / DEC-0135 / R-0127: not mutated this phase

## Blocking findings

None.

## Non-blocking (informational)

| ID | Note |
|----|------|
| NB1 / us0135qa-challenger-001 | qa + execute proofs MATCH+not-STALE; 10/10 + 7/7 independently re-verified; AUTH_PATH_IN_PROJECT / OAuth refresh / critic degraded / fake-model CI locked in tests |
| NB2 / us0135qa-architect-002 | auth-models no Pi; CLI → auth-models handlers; AuthRuntimeAdapter in pi-kernel; isolation/`noTools`/KernelBridge unamended; verify-work re-attested DEC-0009 |
| NB3 / us0135qa-subtractor-003 | no DONE / no US-0136+ / no live paid CI / no isolation loader amend / BUG-0020 not reopened |

## Next

`/release` (fresh **release** subagent). STOP — do not spawn `/release` from this subagent.
