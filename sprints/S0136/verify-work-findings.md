# Verify-Work Findings — S0136 / BUG-0018

**Phase**: verify-work  
**Role**: qa (fresh subagent)  
**Bug**: BUG-0018 (OpenCode markdown `/auto` wins over plugin execute — STOP, no OPENCODE_* code)  
**Sprint**: S0136  
**Orchestrator run**: auto-20260912-bug0018  
**Verify-work timestamp**: 2026-09-12T10:45:00Z  
**Fresh context marker**: qa-BUG0018-verifywork-20260912T104500Z-fresh  
**Verdict**: VERIFY_WORK_PASS  

## Independent verify-work verification

Fresh QA subagent per US-0048 / BUG-0006. Marker is **new** (not reused `qa-BUG0018-qa-20260912T103500Z-fresh`). Context limited to artifacts/handoffs (narrow-read). Independent re-run of contract + file-absence + plugin-attach gates. UAT populated from AC-1..AC-7. No browser fake PASS. No DONE flip. Consumed full `rp-auto-…` proof ids from qa-findings/uat.json/state/resume_brief.

## Test battery (live)

| Gate | Command / method | Result |
|------|------------------|--------|
| BUG-0018 + compose | `python -m pytest tests/bug0018_opencode_auto_ownership_test.py tests/us0125_contract_test.py tests/bug0015_contract_test.py tests/bug0017_opencode_eol_test.py -v` | **30 passed** in 1.39s (bug0018 **6/6**) |
| Colliding auto.md | `Test-Path` active + template `.opencode/commands/auto.md` | **absent** |
| Keep surfaces | `.opencode/agents/auto.md`, `.cursor/commands/auto.md` | **present** |
| Remaining markdown commands | `.opencode/commands/*.md` | **14** (no `auto.md`) |
| Plugin attach | `editor.add` + `name: "auto"` + `runAutoLifecycle` | **retained** |
| Leftover defense | `leftoverAutoMarkdownExists` `unlink(` / `rmSync(` counts | **0 / 0**; `OPENCODE_AUTO_MARKDOWN_COLLISION` present |
| Template byte pairs | plugin / runbook / tests `filecmp` | **3/3 IDENTICAL** |
| QA proof consume | SHA-256 sorted-key compact JSON | **MATCH** `23372F67B489CE60161626AA2A9E0EEFC028DF7C58DAED1E27D6A8A2C4E43E5F` before TTL 11:35 |
| Acceptance row | `docs/product/acceptance.md` | `- [ ] BUG-0018` (not ticked) |
| Backlog | `### BUG-0018` Status | **OPEN** |

## AC verification (architecture `# BUG-0018`)

| AC | Description | Result |
|----|-------------|--------|
| AC-1 | `/auto` invokes plugin execute → `runAutoLifecycle` (or documented `OPENCODE_*`) | **PASS** (UAT-1) |
| AC-2 | Markdown not sole runtime owner | **PASS** (UAT-2) |
| AC-3 | Slash listing preserved | **PASS** (UAT-3) |
| AC-4 | Consumer upgrade prunes leftover `auto.md` | **PASS** (UAT-4) |
| AC-5 | No silent STOP / collision code | **PASS** (UAT-5) |
| AC-6 | Active ↔ template parity | **PASS** (UAT-6) |
| AC-7 | Compose BUG-0015 attach unchanged | **PASS** (UAT-7) |

## User-facing validation

- **Colliding markdown `/auto` removed**: PASS (surrogate) — active + template `.opencode/commands/auto.md` absent so markdown cannot own `/auto`.
- **Plugin remains sole `/auto` owner**: PASS — `editor.add({ name: "auto", execute })` → `runAutoLifecycle` retained.
- **No silent STOP**: PASS — leftover check fail-closes `OPENCODE_AUTO_MARKDOWN_COLLISION`; plugin does not delete.

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
| execute | `dev-BUG0018-execute-20260912T102000Z-fresh` | PASS |
| qa | `qa-BUG0018-qa-20260912T103500Z-fresh` | PASS |
| verify-work | `qa-BUG0018-verifywork-20260912T104500Z-fresh` | PASS (this phase) |

## Runtime proofs (full `rp-auto-…`)

| Phase | runtime_proof_id | proof_hash |
|-------|------------------|------------|
| execute | `rp-auto-20260912-bug0018-execute-dev-20260912T102000Z-BUG-0018` | `1BFC71170240A01546AB58966CDB431CA1802A96BBD6D91D559C1869535B6A82` |
| qa (consumed) | `rp-auto-20260912-bug0018-qa-qa-20260912T103500Z-BUG-0018` | `23372F67B489CE60161626AA2A9E0EEFC028DF7C58DAED1E27D6A8A2C4E43E5F` (MATCH; consumed 10:45 before ttl 11:35) |
| plan-verify | `rp-auto-20260912-bug0018-plan-verify-qa-20260912T103500Z-BUG-0018` | `6BCD9FD84F7F612467E00F8CB69F3BD6CCB9EB33DB5B514B7BA3A90A4B3A89CB` |
| verify-work (issued) | `rp-auto-20260912-bug0018-verify-work-qa-20260912T104500Z-BUG-0018` | `AFB58F6DEC7505290F0A796066820A3A12689EF9682B56B967F695C26837E5BE` |

## Status (US-0045)

- backlog Status: **OPEN** (not DONE)
- acceptance BUG-0018: **unchecked**
- BUG-0015 / BUG-0016 / BUG-0017: DONE preserved (not reopened)
- intake JSON: not mutated

## Blocking findings

None.

## Non-blocking (informational)

| ID | Note |
|----|------|
| NB1 | leftover consumer `auto.md` / unlink-fail owned by runbook DQ8 + `OPENCODE_AUTO_MARKDOWN_COLLISION` |
| NB2 | qa owned plan-verify + AC remap; this pass populated DEC-0009 |
| NB3 | no DONE/tick/reopen/companion DEC/live probe |

## Next

`/release` (fresh release subagent). STOP — do not spawn `/release` from this subagent.
