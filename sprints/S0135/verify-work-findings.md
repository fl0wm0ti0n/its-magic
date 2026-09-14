# Verify-Work Findings — S0135 / BUG-0017

**Phase**: verify-work  
**Role**: qa (fresh subagent)  
**Bug**: BUG-0017 (OpenCode on Linux ignores its-magic slash commands — CRLF breaks YAML frontmatter)  
**Sprint**: S0135  
**Orchestrator run**: auto-20260911-bug0017  
**Verify-work timestamp**: 2026-09-11T19:52:00Z  
**Fresh context marker**: qa-BUG0017-verify-work-20260911T195200Z-fresh  
**Verdict**: VERIFY_WORK_PASS  

## Independent verify-work verification

Fresh QA subagent per US-0048 / BUG-0006. Context limited to artifacts/handoffs (narrow-read). Independent re-run of contract + guard + LF + parity gates. UAT populated from AC-1..AC-7. No browser fake PASS. No DONE flip. Consumed full `rp-auto-…` proof ids from qa-findings/uat.json/state/resume_brief (not truncated `p-auto` in qa_to_verify.md).

## Test battery (live)

| Gate | Command / method | Result |
|------|------------------|--------|
| BUG-0017 contract | `python -m pytest tests/bug0017_opencode_eol_test.py -v` | **6 passed** in 0.23s |
| Guard installer | `npm run guard:installer` | **PASS** |
| LF spot-check | binary read `.opencode/commands/auto.md`, `intake.md`, template peer | **LF-only** (`has_CR=False`) |
| DQ1 attrs | `.gitattributes` six scoped OpenCode LF rows; no repo-wide `*.md` | **PASS** |
| Template byte pairs | guard / test / runbook `filecmp` | **3/3 IDENTICAL** |
| Triad | `python scripts/enforce-triad-hot-surface.py --check` | exit 0 (pre-write) |
| QA proof consume | SHA-256 sorted-key compact JSON | **MATCH** `65A7F3AD…` before TTL 20:50 |

## AC verification (architecture `# BUG-0017`)

| AC | Description | Result |
|----|-------------|--------|
| AC-1 | Linux OpenCode recognizes slash commands (LF pack) | **PASS** (UAT-1) |
| AC-2 | Shipped pack has no CRLF | **PASS** (UAT-2) |
| AC-3 | Scoped `.gitattributes` only | **PASS** (UAT-3) |
| AC-4 | Publish/CI fail-closed on CR + before-tag | **PASS** (UAT-4) |
| AC-5 | Active ↔ template parity | **PASS** (UAT-5) |
| AC-6 | Consumer upgrade DQ6 | **PASS** (UAT-6) |
| AC-7 | Compose BUG-0008 / US-0084 | **PASS** (UAT-7) |

## User-facing validation

- **LF / commands discoverable after fix**: PASS (surrogate) — command markdown LF-only so YAML frontmatter parses; Linux OpenCode omission class addressed.
- **Guard fails on CR**: PASS — `test_bug0017_guard_installer_publish_rejects_opencode_cr` + live `guard:installer` on clean tree.

## UAT summary

- **Total**: 8 (UAT-1..UAT-7 + `convergence_smoke`)
- **Passed**: 8
- **Failed**: 0
- **uat_lifecycle**: populated (DEC-0009)
- **Probe class**: `contract_tests_primary`
- **Waived live probes**: 6 × `UAT_PROBE_FORBIDDEN` (no fake browser PASS)
- **convergence_smoke**: pass (`contract_test_failed=0`)

## Isolation compliance gate

| Phase | Marker | Result |
|-------|--------|--------|
| execute | `dev-BUG0017-execute-20260911T192500Z-fresh` | PASS |
| qa | `qa-BUG0017-qa-20260911T194700Z-fresh` | PASS |
| verify-work | `qa-BUG0017-verify-work-20260911T195200Z-fresh` | PASS (this phase) |

## Runtime proofs (full `rp-auto-…`)

| Phase | runtime_proof_id | proof_hash |
|-------|------------------|------------|
| execute | `rp-auto-20260911-bug0017-execute-dev-20260911T194500Z-BUG-0017` | `7B9319A03BA2399F67DD87F25334DEF7ECE7FD250DBEA8ABC5DC42ED22B01936` |
| qa (consumed) | `rp-auto-20260911-bug0017-qa-qa-20260911T195000Z-BUG-0017` | `65A7F3ADFA440248BEA7A83A908680AB5AC270FF79DF7E2A2ECD0ECFDD30B441` (MATCH; consumed 19:52 before ttl 20:50) |
| plan-verify | `rp-auto-20260911-bug0017-plan-verify-qa-20260911T195000Z-BUG-0017` | `58D69A19144D54A3854F133B77648F474A2A9E16F3E5EEA17235487AA4CB8C52` |
| verify-work (issued) | `rp-auto-20260911-bug0017-verify-work-qa-20260911T195200Z-BUG-0017` | `EFC002B0895C4FC2AB4285FBAFED9E55BADC57F5B8EC43BBF676D5184E514C02` |

## Status (US-0045)

- backlog Status: **OPEN** (not DONE)
- acceptance BUG-0017: **unchecked**
- BUG-0015 / BUG-0016: DONE preserved (not reopened)
- intake JSON: not mutated

## Blocking findings

None.

## Non-blocking (informational)

| ID | Note |
|----|------|
| NB1 | choco before-tag owned by `/release` |
| NB2 | DQ6 upgrade for installed CRLF trees |
| NB3 | no DONE/tick/reopen/live probe |

## Next

`/release` (fresh release subagent). STOP — do not spawn `/release` from this subagent.
