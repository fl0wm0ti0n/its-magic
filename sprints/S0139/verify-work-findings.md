# Verify-Work Findings — S0139 / BUG-0019

**Phase**: verify-work  
**Role**: qa (fresh subagent)  
**Bug**: BUG-0019 (OpenCode slash palette has no `/auto` after plugin-only ownership — BUG-0018 residual listing)  
**Sprint**: S0139  
**Orchestrator run**: auto-20260912-bug0019  
**Verify-work timestamp**: 2026-09-12T19:25:00Z  
**Fresh context marker**: qa-BUG0019-verifywork-20260912T192000Z-fresh  
**Verdict**: VERIFY_WORK_PASS  

## Independent verify-work verification

Fresh QA subagent per US-0048 / BUG-0006. Marker is **new** (not reused `qa-BUG0019-qa-20260912T190500Z-fresh`). Context limited to artifacts/handoffs (narrow-read). Independent re-run of contract + file-absence + TUI listing + plugin-attach gates. UAT populated from AC-1..AC-7. No browser fake PASS. No live OpenCode TUI probe. No DONE flip. Consumed full `rp-auto-…` proof ids from qa-findings/uat.json/state/resume_brief.

## Test battery (live)

| Gate | Command / method | Result |
|------|------------------|--------|
| BUG-0019 + BUG-0018 compose | `python -m pytest tests/bug0019_opencode_auto_slash_listing_test.py tests/bug0018_opencode_auto_ownership_test.py -v` | **13 passed** in 0.15s (bug0019 **7/7**; bug0018 **6/6**) |
| Colliding auto.md | path exists? active + template `.opencode/commands/auto.md` | **absent** |
| Keep surfaces | `.opencode/agents/auto.md`, `.cursor/commands/auto.md` | **present** |
| Remaining markdown commands | `.opencode/commands/*.md` | **14** (no `auto.md`) |
| Plugin attach | `editor.add` + `name: "auto"` + `runAutoLifecycle` | **retained** |
| TUI listing | `.opencode/plugins/its-magic-auto/tui.ts` `slash`/`slashName` `"auto"` | **present** (active + template) |
| Listing index | `its-magic-auto/index.ts` `editor.add` | **absent** |
| Leftover defense | `leftoverAutoMarkdownExists` `unlink(` / `rmSync(` | **0 / 0** (existsSync only); `OPENCODE_AUTO_MARKDOWN_COLLISION` present |
| Parity | `python scripts/check_intake_template_parity.py --repo . --scope=bug-0019` | **[INTAKE_TEMPLATE_PARITY_OK]** |
| UAT probe lib | `python scripts/uat_probe_lib.py --self-test` | **[UAT_PROBE_LIB_SELF_TEST_OK]** |
| QA proof consume | SHA-256 sorted-key compact JSON | **MATCH** `13C82F7DAFBFC808CFF62D7AFF9669B29D7111B48834799DDB05E84D2E2A6AA7` before TTL 20:10 |
| Acceptance row | `docs/product/acceptance.md` | `- [ ] BUG-0019` (not ticked) |
| Backlog | `### BUG-0019` Status | **OPEN** |

## AC verification (architecture `# BUG-0019`)

| AC | Description | Result |
|----|-------------|--------|
| AC-1 | Operator can select `/auto` in OpenCode list (TUI keymap slash) | **PASS** (UAT-1) |
| AC-2 | Invocation starts `runAutoLifecycle` or documented `OPENCODE_*` | **PASS** (UAT-2) |
| AC-3 | Must not restore STOP-only `auto.md`; peers remain listed | **PASS** (UAT-3) |
| AC-4 | Must not JSON-template `/auto` | **PASS** (UAT-4) |
| AC-5 | Plugin `editor.add` execute retained | **PASS** (UAT-5) |
| AC-6 | Fail-closed listing token (not silent miss) | **PASS** (UAT-6) |
| AC-7 | Upgrade copies listing + still prunes `auto.md`; parity | **PASS** (UAT-7) |

## User-facing validation

- **TUI slash listing surface**: PASS (surrogate) — `its-magic-auto/tui.ts` keymap `slash`/`slashName` `"auto"` present so `/auto` can be listed without restoring markdown.
- **Plugin remains `/auto` execute owner**: PASS — `editor.add({ name: "auto", execute })` → `runAutoLifecycle` retained; `index.ts` does not `editor.add`.
- **STOP-only `auto.md` not restored**: PASS — active + template `.opencode/commands/auto.md` absent; 14 peer commands remain.
- **No silent listing miss**: PASS — `OPENCODE_AUTO_SLASH_LISTING_UNSUPPORTED` present; leftover check fail-closes `OPENCODE_AUTO_MARKDOWN_COLLISION`; plugin does not delete.

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
| execute | `dev-BUG0019-execute-20260912T184000Z-fresh` | PASS |
| qa | `qa-BUG0019-qa-20260912T190500Z-fresh` | PASS |
| verify-work | `qa-BUG0019-verifywork-20260912T192000Z-fresh` | PASS (this phase) |

## Runtime proofs (full `rp-auto-…`)

| Phase | runtime_proof_id | proof_hash |
|-------|------------------|------------|
| execute | `rp-auto-20260912-bug0019-execute-dev-20260912T185500Z-BUG-0019` | `639497519CC0DD4539008DBDF6D0047AD112FDC43AAE99BA51FB0251BAA518C8` |
| qa (consumed) | `rp-auto-20260912-bug0019-qa-qa-20260912T191000Z-BUG-0019` | `13C82F7DAFBFC808CFF62D7AFF9669B29D7111B48834799DDB05E84D2E2A6AA7` (MATCH; consumed 19:25 before ttl 20:10) |
| plan-verify | `rp-auto-20260912-bug0019-plan-verify-qa-20260912T191000Z-BUG-0019` | `44773F439FD6A29D5BA0B9AE8D3DF87701720AA6D1241EB953645751D217DEEC` |
| verify-work (issued) | `rp-auto-20260912-bug0019-verify-work-qa-20260912T192500Z-BUG-0019` | `D2FB7454A7A6C5E456D4F2E7EAC5F010AA88D0BAE6B35919676DC003649C7735` |

## Status (US-0045)

- backlog Status: **OPEN** (not DONE)
- acceptance BUG-0019: **unchecked**
- BUG-0015 / BUG-0016 / BUG-0017 / BUG-0018: DONE preserved (not reopened)
- intake JSON: not mutated

## Blocking findings

None.

## Non-blocking (informational)

| ID | Note |
|----|------|
| NB1 | proof MATCH+not-STALE; 7/7 + 6/6 independently re-verified; auto.md absent; no JSON `commands.auto` |
| NB2 | qa owned plan-verify + AC remap; this pass populated DEC-0009; leftover check does not delete |
| NB3 | no DONE/tick/reopen/companion DEC/live TUI probe |

## Next

`/release` (fresh release subagent). STOP — do not spawn `/release` from this subagent.
