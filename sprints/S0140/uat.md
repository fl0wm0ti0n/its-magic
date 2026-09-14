# Sprint S0140 — UAT (BUG-0020) — populated at /verify-work (DEC-0009)

- **uat_lifecycle**: populated (verify-work PASS; DEC-0009 qa_seeded → populated complete)
- **sprint_id**: S0140
- **bug_refs**: BUG-0020
- **phase**: verify-work (build+verify macro)
- **role**: qa (fresh per BUG-0006)
- **orchestrator_run_id**: auto-20260913-bug0020
- **delivery_mode**: ultra_lean
- **macro_phase**: build+verify
- **story_type**: code (OpenCode desktop Command.Info listing / CLI TUI working-start / contract-test slice; FRAMEWORK_KIT_REPO=1)
- **fresh_context_marker**: `qa-BUG0020-verify-20260913T021500Z-fresh`
- **timestamp**: 2026-09-13T02:15:00Z (UTC)
- **model_id**: cursor-grok-4.6-high (CROSS_MODEL_REVIEW=1 — required)
- **producer_phase_id**: qa (role=qa; **QA_PASS**; `blocking_count=0`)
- **critic_phase_id**: sovereign-critic of qa (tech-lead, composer-2.5-fast; PASS; anti_slop=10; marker `critic-BUG0020-qa-20260913T020500Z-fresh`)
- **verdict**: **PASS** (verify-work) — UAT 11/11 pass, 0 fail (AC-1..AC-10 → UAT-1..UAT-10 + canonical `convergence_smoke`); live pytest compose suite **21 passed in 0.25s** (bug0020 **8/8**; bug0019 **7/7**; bug0018 **6/6**); colliding `auto.md` absent; plugin `editor.add` retained; `.opencode/tui.json` lists `./plugins/its-magic-auto/tui.ts`; emit helper not TUI-toast-only. Current producer consume = qa `015500Z` / `C62E06AC…`. **No live OpenCode desktop PASS.**
- **total_steps**: 11 (UAT-1..UAT-10 + canonical `convergence_smoke`)
- **passed**: 11 | **failed**: 0
- **bug_status**: OPEN (do not mark BUG-0020 DONE — US-0045; acceptance BUG-0020 unchecked; intake JSON not mutated)
- **blocking_findings**: 0
- **non_blocking_findings**: 3 (NB1..NB3 critic carry-forwards — informational)
- **harness_fail_zero_claimed**: false (slice contract tests + compose are the required evidence)
- **browser_probe_used**: false (no fake browser PASS)

## Probe class — OpenCode desktop listing / CLI TUI

BUG-0020 is a kit desktop Command.Info listing / CLI TUI working-start / contract-test slice. Applicable probe: `contract_tests_primary` (8 markers + BUG-0019/BUG-0018 compose). User-facing validation: colliding `.opencode/commands/auto.md` remains absent; `.opencode/tui.json` lists `./plugins/its-magic-auto/tui.ts` so CLI TUI `/auto` can load; plugin `editor.add({ name: "auto", execute })` → `runAutoLifecycle` remains execute owner; desktop fail-closed `OPENCODE_AUTO_DESKTOP_COMMAND_INFO_LISTING_UNSUPPORTED` (not silent miss; not TUI-toast-only). No web UI. Six live-runtime classes waived with **`UAT_PROBE_FORBIDDEN`**. **No silent browser PASS.** MCP browser sequence not run. **No live OpenCode desktop host probe.** No `.env`.

Canonical surrogate step `id=convergence_smoke` kept `result=pass` because `contract_test_failed=0` (8/8 pytest + 7/7 + 6/6 compose).

## Target bug + acceptance criteria (architecture `# BUG-0020` E2)

- **BUG-0020** — OpenCode still has no invokable auto mode after BUG-0019 TUI keymap (Command.Info picker live-falsifies E*)
  - **Primary** (`docs/product/acceptance.md`): Operator can start its-magic auto on OpenCode (documented equivalent) **and** invocation starts plugin execute → `runAutoLifecycle` **or** documented `OPENCODE_*`. Must not silent missing. Must not restore STOP-only `auto.md`. — **PASS** (surrogate: CLI TUI `/auto` + desktop token); checkbox **unchecked**
  - AC-1: PASS — C-limb CLI TUI `/auto` after `tui.json` load (UAT-1)
  - AC-2: PASS — invocation → lifecycle or `OPENCODE_*` (UAT-2)
  - AC-3: PASS — desktop picker not silent miss (UAT-3)
  - AC-4: PASS — no restore `auto.md` (UAT-4)
  - AC-5: PASS — no JSON `commands.auto` template (UAT-5)
  - AC-6: PASS — plugin `editor.add` retained (UAT-6)
  - AC-7: PASS — upgrade copy/merge `tui.json` + prune (UAT-7)
  - AC-8: PASS — active↔template parity (UAT-8)
  - AC-9: PASS — peers remain listed (UAT-9)
  - AC-10: PASS — picker/token contracts (UAT-10)

## UAT step results (verify-work)

| Step | AC | Result | Evidence |
|------|----|--------|----------|
| UAT-1 | AC-1 | pass | marker 5; `.opencode/tui.json` lists `./plugins/its-magic-auto/tui.ts` (CLI-TUI-only; does not feed desktop Command.Info) |
| UAT-2 | AC-2 | pass | marker 6; TUI `run()` still dispatches; `editor.add` retained |
| UAT-3 | AC-3 | pass | markers 1+4; emit helper + desktop listing token (not TUI-toast-only) |
| UAT-4 | AC-4 | pass | marker 2; active+template `auto.md` absent |
| UAT-5 | AC-5 | pass | marker 2; no JSON `commands.auto` template; no `cli.json` |
| UAT-6 | AC-6 | pass | marker 3; orchestrator `editor.add` retained; `index.ts` no `editor.add` |
| UAT-7 | AC-7 | pass | marker 8; copy/merge + prune leftover `auto.md` |
| UAT-8 | AC-8 | pass | marker 7; `--scope=bug-0020` OK |
| UAT-9 | AC-9 | pass | 14 peer `.md`; keep surfaces present |
| UAT-10 | AC-10 | pass | 8 `test_bug0020_*` picker/token contracts |
| convergence_smoke | surrogate | pass | `contract_test_failed=0`; 6 waived probes `UAT_PROBE_FORBIDDEN` |

## Contract test markers (8) — verify-work live re-run

`python -m pytest tests/bug0020_opencode_desktop_command_info_listing_test.py tests/bug0019_opencode_auto_slash_listing_test.py tests/bug0018_opencode_auto_ownership_test.py -v` — **21 passed** in 0.24s (**8/8** `test_bug0020_*`; **7/7** `test_bug0019_*`; **6/6** `test_bug0018_*`) (2026-09-13T00:50:00Z).

1. `test_bug0020_desktop_command_info_picker_contract` — PASS
2. `test_bug0020_no_command_info_auto_template` — PASS
3. `test_bug0020_plugin_editor_add_auto_execute_retained` — PASS
4. `test_bug0020_desktop_listing_fail_closed_token` — PASS
5. `test_bug0020_cli_tui_working_start_load_path` — PASS
6. `test_bug0020_tui_run_still_dispatches_lifecycle` — PASS
7. `test_bug0020_active_template_parity` — PASS
8. `test_bug0020_upgrade_copies_surface_still_prunes_auto_md` — PASS

## User-facing validation (this phase)

| Check | Result |
|-------|--------|
| Documented desktop equivalent (CLI TUI `/auto` + desktop token) | **PASS** (surrogate) — **not** a live OpenCode desktop PASS. Operator starts auto from CLI TUI `/auto` after `tui.json` load; desktop Command.Info miss is fail-closed with `OPENCODE_AUTO_DESKTOP_COMMAND_INFO_LISTING_UNSUPPORTED` |
| Colliding markdown `/auto` still absent | **PASS** — `.opencode/commands/auto.md` + template twin absent; 14 remaining commands |
| CLI TUI load path present | **PASS** — `.opencode/tui.json` lists `./plugins/its-magic-auto/tui.ts` (active + template); plugin-local `tui.json` absent |
| Plugin remains `/auto` execute owner | **PASS** — `editor.add({ name: "auto", execute })` → `runAutoLifecycle` retained; `index.ts` has no `editor.add` |
| Desktop listing not silent miss | **PASS** — `emitDesktopCommandInfoListingUnsupported` + `OPENCODE_AUTO_DESKTOP_COMMAND_INFO_LISTING_UNSUPPORTED` (not TUI-toast-only) |
| Leftover collision fail-closed | **PASS** — leftover existsSync only; plugin does not delete |

## Waived probes (honest live-runtime)

| Probe | reason_code |
|-------|-------------|
| browser_smoke | `UAT_PROBE_FORBIDDEN` (kit desktop listing / CLI TUI slice; no web UI) |
| api_health | `UAT_PROBE_FORBIDDEN` (no runtime HTTP API) |
| process_health | `UAT_PROBE_FORBIDDEN` (no runtime app server) |
| cli_smoke | `UAT_PROBE_FORBIDDEN` (no live OpenCode desktop/CLI TUI CI probe) |
| build | `UAT_PROBE_FORBIDDEN` (no separate build step) |
| manual_operator | `UAT_PROBE_FORBIDDEN` (contract + CLI TUI / desktop-token surrogate; no live OpenCode host) |

## Isolation compliance gate (US-0048 / DEC-0029)

| Phase | Marker | Result |
|-------|--------|--------|
| execute | `dev-BUG0020-execute-20260913T013500Z-fresh` | PASS |
| qa | `qa-BUG0020-qa-20260913T003000Z-fresh` | PASS |
| verify-work | `qa-BUG0020-verifywork-20260913T005000Z-fresh` | PASS (this phase) |

## Runtime proofs (full `rp-auto-…` — not truncated `p-auto`)

| Phase | runtime_proof_id | proof_hash |
|-------|------------------|------------|
| execute | `rp-auto-20260913-bug0020-execute-dev-20260913T013500Z-BUG-0020` | `965A8687F38065B9655B99AD025622675A353809CC3632CC1FC597F19E0F75D7` |
| qa (consumed) | `rp-auto-20260913-bug0020-qa-qa-20260913T003000Z-BUG-0020` | `C2FAA352843F023D9A850875CC2D23D10A47A238C6A9D0DA7D55F26B6E7207DB` (MATCH; consumed 00:50 before ttl 01:30) |
| plan-verify | `rp-auto-20260913-bug0020-plan-verify-qa-20260913T003000Z-BUG-0020` | `E6E5741468363C3808E499B96F0CABD115A066997135E04A483B5A6831FED844` |
| critic of qa | `rp-auto-20260913-bug0020-sovereign-critic-techlead-20260913T004000Z-BUG-0020` | `696E2756996639709581DAACED344DBC5B1FF59A8D8FED99D08D5B8F7111835D` |
| verify-work (issued) | `rp-auto-20260913-bug0020-verify-work-qa-20260913T005000Z-BUG-0020` | `45380038515C7B9905698BC1D89139AA9E202A8255810BA581DDEE6766EBE1B0` |

## Results summary vs acceptance

| Bucket | Count |
|--------|-------|
| PASS | 11 |
| FAIL | 0 |
| Total steps | 11 |

All ten acceptance criteria (AC-1..AC-10) map to UAT-1..UAT-10 and **PASS**. Canonical `convergence_smoke` **PASS**. Backlog Status remains **OPEN** (US-0045); acceptance BUG-0020 unchecked. Machine-readable: `sprints/S0140/uat.json`.

## Next

- Sovereign-critic of verify-work (if CROSS_MODEL_REVIEW=1) → **`/release`** (fresh **release**) for **`S0140`** / **`BUG-0020`**
- STOP — do not spawn `/release` from this subagent. Do NOT mark BUG-0020 DONE. Do NOT tick acceptance.
