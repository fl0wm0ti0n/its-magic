# Verify-Work Findings — S0137 / US-0133

**Phase**: verify-work  
**Role**: qa (fresh subagent)  
**Story**: US-0133 (Standalone repository and replaceable Pi kernel)  
**Sprint**: S0137  
**Orchestrator run**: auto-20260912-us0133  
**Verify-work timestamp**: 2026-09-12T12:20:00Z  
**Fresh context marker**: qa-US0133-verifywork-20260912T122000Z-fresh  
**Verdict**: VERIFY_WORK_PASS  

## Independent verify-work verification

Fresh QA subagent per US-0048 / BUG-0006. Marker is **new** (not reused `qa-US0133-qa-20260912T121000Z-fresh`). Context limited to artifacts/handoffs (narrow-read). Independent re-run of 10/10 markers, standalone layout, kit omit-guard. UAT populated from AC-1..AC-6 (DEC-0009). No live provider. No `.env`. No browser fake PASS. No DONE flip. Consumed full `rp-auto-…` proof ids from qa-findings/uat.json/state/resume_brief.

## Test battery (live)

| Gate | Command / method | Result |
|------|------------------|--------|
| Kit contract tests | `python -m pytest tests/us0133_contract_test.py -v` | **5 passed** in 0.59s (markers 1/2/3/5/10) |
| Standalone contract + unit | `npm test` in `standalone/` | **6 passed** in 2.70s (fail 0; markers 4/6/7/8/9 + event-bridge) |
| Combined markers | 10 `test_us0133_*` | **10/10 PASS** |
| Typecheck | `npm run typecheck` in `standalone/` | **exit 0** |
| Lint | `npm run lint` in `standalone/` | **14 files**, no fixes |
| Kit publish omit-guard | `python scripts/guard_installer_publish.py` | **exit 0** (Windows dash skip expected; Python standalone omit-check enforced) |
| Kit `files` | `package.json` files whitelist | **omits** `standalone/` |
| Standalone layout | `package.json` + `apps/cli` + `packages/pi-kernel` + tests + spike doc | **present**; unpublished `@its-magic/standalone`; engines `>=22.19.0` |
| CI job | `.github/workflows/ci.yml` | `working-directory: standalone`; matrix `ubuntu-latest` + `windows-latest`; Node 22 |
| Template byte pairs | `filecmp` us0133 tests + guard | **2/2 IDENTICAL** |
| UAT probe lib | `python scripts/uat_probe_lib.py --self-test` | **[UAT_PROBE_LIB_SELF_TEST_OK]** |
| QA proof consume | SHA-256 sorted-key compact JSON | **MATCH** `0A9912547B61709D18F21711B278D2A42B426F90743818E8EA9F119A2F3CBB61`; ttl `2026-09-12T13:10:00Z`; consumed_at `2026-09-12T12:20:00Z` — **RUNTIME_PROOF_VALID** |
| Execute proof recompute | independent hashlib | **MATCH** `7CCDCD239FCA9184792C4C63C9113F32EEE83AA639E0FAA1621190CF39B19EB0` (ttl 13:00 still valid at consume) |
| Acceptance row | `docs/product/acceptance.md` | `- [ ] US-0133` (not ticked) |
| Backlog | `## US-0133` Status | **OPEN** |
| BUG-0018 | `### BUG-0018` Status | **DONE** (not reopened) |

## AC verification (architecture `# US-0133` A1)

| AC | Description | Result |
|----|-------------|--------|
| AC-1 | Standalone workspace + CI/lint/types + pinned Pi SDK | **PASS** (UAT-1; markers 1+3) |
| AC-2 | AgentKernel methods; no Pi imports outside `packages/pi-kernel` | **PASS** (UAT-2; markers 4+5) |
| AC-3 | Production sessions custom-tool-only + abort | **PASS** (UAT-3; markers 6+8) |
| AC-4 | Default resource isolation; trusted remains explicit | **PASS** (UAT-4; marker 7) |
| AC-5 | Contract tests: session id, custom-only, event order, abort, isolation | **PASS** (UAT-5; 10/10) |
| AC-6 | Phase 0 spike versions + go/no-go without branding lock | **PASS** (UAT-6; marker 10) |

## User-facing validation

- **Standalone workspace unpublished (surrogate)**: PASS — `@its-magic/standalone` private; kit `files` omit `standalone/`; omit-guard exit 0.
- **Pi behind owned AgentKernel**: PASS — methods present; Pi imports only inside `packages/pi-kernel`.
- **Custom-tool-only + isolation**: PASS — `itsm_ping` only; empty loader even when trusted; planted `.pi/extensions`+`AGENTS.md` ignored.
- **Spike GO without branding lock**: PASS — items 1/2/3/5 GO; unpublished name; no OS-sandbox claim.

## UAT summary

- **Total**: 7 (UAT-1..UAT-6 + `convergence_smoke`)
- **Passed**: 7
- **Failed**: 0
- **uat_lifecycle**: populated (DEC-0009)
- **Probe class**: `contract_tests_primary`
- **Waived live probes**: 6 × `UAT_PROBE_FORBIDDEN` (no fake browser PASS)
- **convergence_smoke**: pass (`contract_test_failed=0`)

## Isolation compliance gate

| Phase | Marker | Result |
|-------|--------|--------|
| execute | `dev-US0133-execute-20260912T113500Z-fresh` | PASS |
| qa | `qa-US0133-qa-20260912T121000Z-fresh` | PASS |
| verify-work | `qa-US0133-verifywork-20260912T122000Z-fresh` | PASS (this phase) |

## Runtime proofs (full `rp-auto-…`)

| Phase | runtime_proof_id | proof_hash |
|-------|------------------|------------|
| execute | `rp-auto-20260912-us0133-execute-dev-20260912T120000Z-US-0133` | `7CCDCD239FCA9184792C4C63C9113F32EEE83AA639E0FAA1621190CF39B19EB0` (MATCH; ttl 13:00) |
| qa (consumed) | `rp-auto-20260912-us0133-qa-qa-20260912T121000Z-US-0133` | `0A9912547B61709D18F21711B278D2A42B426F90743818E8EA9F119A2F3CBB61` (MATCH; consumed 12:20 before ttl 13:10) |
| plan-verify | `rp-auto-20260912-us0133-plan-verify-qa-20260912T121000Z-US-0133` | `195D95BC3BC0BB9D8335D350E55AD1016BC61F73035AE50E34FAD66AD17F1517` |
| verify-work (issued) | `rp-auto-20260912-us0133-verify-work-qa-20260912T122000Z-US-0133` | `4CA5BD3BA33936863A0B8C4A9D089C64C140FA1E2FD51F6DF1E5C283D332BC57` |

## Status (US-0045)

- backlog Status: **OPEN** (not DONE)
- acceptance US-0133: **unchecked**
- BUG-0018: **DONE** preserved (not reopened)
- intake JSON: not mutated
- architecture.md / DEC-0133 / R-0121: not mutated; R-0120 intact

## Blocking findings

None.

## Non-blocking (informational)

| ID | Note |
|----|------|
| NB1 | R2 planted fixture + R3 fake Model + R6 omit-guard independently re-verified; trusted enablement remains US-0137 |
| NB2 | qa owned plan-verify + AC remap; this pass populated DEC-0009; KernelBridge/ToolBroker out |
| NB3 | no DONE/tick/reopen; Phase 0 items 1/2/3/5 only; R-0120 intact |

## Next

`/release` (fresh release subagent). STOP — do not spawn `/release` from this subagent.
