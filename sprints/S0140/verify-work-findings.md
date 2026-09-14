# Verify-Work Findings — S0140 / BUG-0020

**Phase**: verify-work  
**Role**: qa (fresh subagent)  
**Bug**: BUG-0020 (OpenCode still has no invokable auto mode after BUG-0019 TUI keymap — Command.Info picker live-falsifies E*)  
**Sprint**: S0140  
**Orchestrator run**: auto-20260913-bug0020  
**Verify-work timestamp**: 2026-09-13T02:15:00Z  
**Fresh context marker**: qa-BUG0020-verify-20260913T021500Z-fresh  
**model_id**: cursor-grok-4.6-high (CROSS_MODEL_REVIEW=1)  
**Verdict**: VERIFY_WORK_PASS  

## Independent verify-work verification

Fresh QA subagent per US-0048 / BUG-0006. Marker is **new** (not reused `qa-BUG0020-qa-20260913T003000Z-fresh` or sibling `qa-BUG0020-qa-20260913T015500Z-fresh`). Context limited to artifacts/handoffs (narrow-read). Independent re-run of contract + file-absence + CLI TUI load + plugin-attach + desktop-token gates. UAT populated from AC-1..AC-10. No browser fake PASS. **No live OpenCode desktop probe / no live OpenCode desktop PASS.** Desktop equivalent = CLI TUI `/auto` + documented desktop token. No DONE flip. Consumed full `rp-auto-…` QA proof `rp-auto-20260913-bug0020-qa-qa-20260913T003000Z-BUG-0020` / `C2FAA352843F023D9A850875CC2D23D10A47A238C6A9D0DA7D55F26B6E7207DB` MATCH before TTL 01:30. Critic of QA PASS (0 blocking; `bug0020qa-*`).

## Test battery (live)

| Gate | Command / method | Result |
|------|------------------|--------|
| BUG-0020 + BUG-0019 + BUG-0018 compose | `python -m pytest tests/bug0020_opencode_desktop_command_info_listing_test.py tests/bug0019_opencode_auto_slash_listing_test.py tests/bug0018_opencode_auto_ownership_test.py -v` | **21 passed** in 0.24s (bug0020 **8/8**; bug0019 **7/7**; bug0018 **6/6**) |
| Colliding auto.md | path exists? active + template `.opencode/commands/auto.md` | **absent** |
| Keep surfaces | `.opencode/agents/auto.md`, `.cursor/commands/auto.md` | **present** |
| Remaining markdown commands | `.opencode/commands/*.md` | **14** (no `auto.md`) |
| Plugin attach | `editor.add` + `name: "auto"` + `runAutoLifecycle` | **retained** |
| CLI TUI load path | `.opencode/tui.json` lists `./plugins/its-magic-auto/tui.ts` | **present** (active + template) |
| Plugin-local tui.json / kit cli.json | path exists? | **absent** |
| Listing index | `its-magic-auto/index.ts` `editor.add` | **absent** |
| TUI keymap | `its-magic-auto/tui.ts` `slash`/`slashName` `"auto"` | **present** |
| Desktop emit helper | `emitDesktopCommandInfoListingUnsupported` | **present** (not TUI-toast-only) |
| Desktop listing token | `OPENCODE_AUTO_DESKTOP_COMMAND_INFO_LISTING_UNSUPPORTED` | **present** |
| Leftover defense | `leftoverAutoMarkdownExists` `unlink(` / `rmSync(` | **0 / 0** (existsSync only) |
| Parity | `python scripts/check_intake_template_parity.py --repo . --scope=bug-0020` | **[INTAKE_TEMPLATE_PARITY_OK]** |
| UAT probe lib | `python scripts/uat_probe_lib.py --self-test` | **[UAT_PROBE_LIB_SELF_TEST_OK]** |
| Metadata | `python scripts/check-user-visible-metadata.py --repo .` | **exit 0** |
| QA proof consume | SHA-256 sorted-key compact JSON | **MATCH** `C2FAA352843F023D9A850875CC2D23D10A47A238C6A9D0DA7D55F26B6E7207DB` before TTL 01:30 |
| Acceptance row | `docs/product/acceptance.md` | `- [ ] BUG-0020` (not ticked) |
| Backlog | `### BUG-0020` Status | **OPEN** |

## AC verification (architecture `# BUG-0020`)

| AC | Description | Result |
|----|-------------|--------|
| AC-1 | Operator can start auto on OpenCode (C-limb CLI TUI `/auto` after `tui.json` load) | **PASS** (UAT-1) |
| AC-2 | Invocation starts `runAutoLifecycle` or documented `OPENCODE_*` | **PASS** (UAT-2) |
| AC-3 | Desktop picker is not a silent miss | **PASS** (UAT-3) |
| AC-4 | Must not restore STOP-only `auto.md` | **PASS** (UAT-4) |
| AC-5 | Must not JSON-template `/auto` | **PASS** (UAT-5) |
| AC-6 | Plugin `editor.add` execute retained | **PASS** (UAT-6) |
| AC-7 | Upgrade copies/merges `tui.json` + still prunes `auto.md` | **PASS** (UAT-7) |
| AC-8 | Active↔template parity | **PASS** (UAT-8) |
| AC-9 | Peers remain listed | **PASS** (UAT-9) |
| AC-10 | Tests are picker/token contracts, not slash-string existence | **PASS** (UAT-10) |

## User-facing validation

- **Documented desktop equivalent**: PASS (surrogate) — CLI TUI `/auto` after `.opencode/tui.json` load. **Not** a live OpenCode desktop PASS. Desktop Command.Info still will not list execute-only `/auto`; operator sees documented `OPENCODE_AUTO_DESKTOP_COMMAND_INFO_LISTING_UNSUPPORTED`.
- **Plugin remains `/auto` execute owner**: PASS — `editor.add({ name: "auto", execute })` → `runAutoLifecycle` retained; `index.ts` does not `editor.add`.
- **STOP-only `auto.md` not restored**: PASS — active + template `.opencode/commands/auto.md` absent; 14 peer commands remain.
- **No silent listing miss**: PASS — `emitDesktopCommandInfoListingUnsupported` + `OPENCODE_AUTO_DESKTOP_COMMAND_INFO_LISTING_UNSUPPORTED`; leftover check fail-closes; plugin does not delete.

## UAT summary

- **Total**: 11 (UAT-1..UAT-10 + `convergence_smoke`)
- **Passed**: 11
- **Failed**: 0
- **uat_lifecycle**: populated (DEC-0009)
- **Probe class**: `contract_tests_primary`
- **Waived live probes**: 6 × `UAT_PROBE_FORBIDDEN` (no fake browser PASS)
- **convergence_smoke**: pass (`contract_test_failed=0`)

## Isolation compliance gate

| Phase | Marker | Result |
|-------|--------|--------|
| execute | `dev-BUG0020-execute-20260913T013500Z-fresh` | PASS |
| qa | `qa-BUG0020-qa-20260913T003000Z-fresh` | PASS |
| verify-work | `qa-BUG0020-verifywork-20260913T005000Z-fresh` | PASS (this phase) |

## Runtime proofs (full `rp-auto-…`)

| Phase | runtime_proof_id | proof_hash |
|-------|------------------|------------|
| execute | `rp-auto-20260913-bug0020-execute-dev-20260913T013500Z-BUG-0020` | `965A8687F38065B9655B99AD025622675A353809CC3632CC1FC597F19E0F75D7` |
| qa (consumed) | `rp-auto-20260913-bug0020-qa-qa-20260913T003000Z-BUG-0020` | `C2FAA352843F023D9A850875CC2D23D10A47A238C6A9D0DA7D55F26B6E7207DB` (MATCH; consumed 00:50 before ttl 01:30) |
| plan-verify | `rp-auto-20260913-bug0020-plan-verify-qa-20260913T003000Z-BUG-0020` | `E6E5741468363C3808E499B96F0CABD115A066997135E04A483B5A6831FED844` |
| critic of qa | `rp-auto-20260913-bug0020-sovereign-critic-techlead-20260913T004000Z-BUG-0020` | `696E2756996639709581DAACED344DBC5B1FF59A8D8FED99D08D5B8F7111835D` |
| verify-work (issued) | `rp-auto-20260913-bug0020-verify-work-qa-20260913T005000Z-BUG-0020` | `45380038515C7B9905698BC1D89139AA9E202A8255810BA581DDEE6766EBE1B0` |

## Status (US-0045)

- backlog Status: **OPEN** (not DONE)
- acceptance BUG-0020: **unchecked**
- BUG-0015 / BUG-0016 / BUG-0017 / BUG-0018 / BUG-0019: DONE preserved (not reopened)
- intake JSON: not mutated

## Blocking findings

None.

## Non-blocking (informational)

| ID | Note |
|----|------|
| NB1 | proof MATCH+not-STALE; 8/8 + 7/7 + 6/6 independently re-verified; auto.md absent; tui.json lists tui.ts; emit helper + desktop token; desktop operator must use CLI TUI |
| NB2 | qa owned plan-verify + AC remap; this pass populated DEC-0009; leftover check does not delete |
| NB3 | no DONE/tick/reopen/companion DEC/live desktop probe |

## Next

`/release` (fresh release subagent). STOP — do not spawn `/release` from this subagent.
