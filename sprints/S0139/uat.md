# Sprint S0139 — UAT (BUG-0019) — populated at /verify-work (DEC-0009)

- **uat_lifecycle**: populated (verify-work PASS; DEC-0009 qa_seeded → populated complete)
- **sprint_id**: S0139
- **bug_refs**: BUG-0019
- **phase**: verify-work (build+verify macro)
- **role**: qa (fresh per BUG-0006)
- **orchestrator_run_id**: auto-20260912-bug0019
- **delivery_mode**: ultra_lean
- **macro_phase**: build+verify
- **story_type**: code (OpenCode TUI slash-listing / contract-test slice; FRAMEWORK_KIT_REPO=1)
- **fresh_context_marker**: `qa-BUG0019-verifywork-20260912T192000Z-fresh`
- **timestamp**: 2026-09-12T19:25:00Z (UTC)
- **model_id**: cursor-grok-4.6 (CROSS_MODEL_REVIEW=1 — required)
- **producer_phase_id**: qa (role=qa; **QA_PASS**; `blocking_count=0`)
- **critic_phase_id**: sovereign-critic of qa (tech-lead, composer-2.5-fast; PASS; anti_slop=10; marker `critic-BUG0019-qa-20260912T191500Z-fresh`)
- **verdict**: **PASS** (verify-work) — UAT 8/8 pass, 0 fail (AC-1..AC-7 → UAT-1..UAT-7 + canonical `convergence_smoke`); live pytest compose suite **13 passed in 0.15s** (bug0019 **7/7**; bug0018 **6/6**); colliding `auto.md` absent; plugin `editor.add` retained; TUI slash surface present
- **total_steps**: 8 (UAT-1..UAT-7 + canonical `convergence_smoke`)
- **passed**: 8 | **failed**: 0
- **bug_status**: OPEN (do not mark BUG-0019 DONE — US-0045; acceptance BUG-0019 unchecked; intake JSON not mutated)
- **blocking_findings**: 0
- **non_blocking_findings**: 3 (NB1..NB3 critic carry-forwards — informational)
- **harness_fail_zero_claimed**: false (slice contract tests + compose are the required evidence)
- **browser_probe_used**: false (no fake browser PASS)

## Probe class — OpenCode TUI slash listing

BUG-0019 is a kit TUI listing / plugin-execute / contract-test slice. Applicable probe: `contract_tests_primary` (7 markers + BUG-0018 compose). User-facing validation: colliding `.opencode/commands/auto.md` remains absent so markdown cannot own `/auto`; sibling `its-magic-auto/tui.ts` keymap `slash`/`slashName` `"auto"` lists `/auto`; plugin `editor.add({ name: "auto", execute })` → `runAutoLifecycle` remains execute owner; leftover fail-closed `OPENCODE_AUTO_MARKDOWN_COLLISION` (plugin does not delete). No web UI. Six live-runtime classes waived with **`UAT_PROBE_FORBIDDEN`**. **No silent browser PASS.** MCP browser sequence not run. No live OpenCode TUI host probe. No `.env`.

Canonical surrogate step `id=convergence_smoke` kept `result=pass` because `contract_test_failed=0` (7/7 pytest + 6/6 compose).

## Target bug + acceptance criteria (architecture `# BUG-0019` E*)

- **BUG-0019** — OpenCode slash palette has no `/auto` after plugin-only ownership (BUG-0018 residual listing)
  - **Primary** (`docs/product/acceptance.md`): Operator can select/invoke `/auto` in OpenCode **and** invocation starts plugin execute → `runAutoLifecycle` **or** documented `OPENCODE_*`. Must not restore STOP-only `auto.md`. — **PASS** (surrogate); checkbox **unchecked**
  - AC-1: PASS — TUI keymap slash (UAT-1)
  - AC-2: PASS — `run()` → lifecycle or `OPENCODE_*` (UAT-2)
  - AC-3: PASS — no restore `auto.md`; peers listed (UAT-3)
  - AC-4: PASS — no JSON `commands.auto` template (UAT-4)
  - AC-5: PASS — plugin `editor.add` retained (UAT-5)
  - AC-6: PASS — listing fail-closed token (UAT-6)
  - AC-7: PASS — upgrade copy+prune + parity (UAT-7)

## UAT step results (verify-work)

| Step | AC | Result | Evidence |
|------|----|--------|----------|
| UAT-1 | AC-1 | pass | marker 4; `tui.ts` `slash`/`slashName` `"auto"`; 14 peer `.md` remain |
| UAT-2 | AC-2 | pass | marker 5; TUI `run()` client/RPC; dispatch token |
| UAT-3 | AC-3 | pass | marker 1; active+template `.opencode/commands/auto.md` absent; keep surfaces present |
| UAT-4 | AC-4 | pass | marker 3; no JSON `commands.auto` template; no `cli.json`/`tui.json` |
| UAT-5 | AC-5 | pass | marker 2; orchestrator `editor.add` retained; `index.ts` no `editor.add` |
| UAT-6 | AC-6 | pass | marker 4; `OPENCODE_AUTO_SLASH_LISTING_UNSUPPORTED` |
| UAT-7 | AC-7 | pass | markers 6+7; copy listing + still prune; leftover fn no unlink |
| convergence_smoke | surrogate | pass | `contract_test_failed=0`; 6 waived probes `UAT_PROBE_FORBIDDEN` |

## Contract test markers (7) — verify-work live re-run

`python -m pytest tests/bug0019_opencode_auto_slash_listing_test.py tests/bug0018_opencode_auto_ownership_test.py -v` — **13 passed** in 0.15s (**7/7** `test_bug0019_*`; **6/6** `test_bug0018_*`) (2026-09-12T19:25:00Z).

1. `test_bug0019_no_restored_opencode_auto_md` — PASS
2. `test_bug0019_plugin_editor_add_auto_execute_retained` — PASS
3. `test_bug0019_no_json_commands_auto_template` — PASS
4. `test_bug0019_tui_slash_auto_listing_surface` — PASS
5. `test_bug0019_tui_run_dispatches_lifecycle_not_template` — PASS
6. `test_bug0019_active_template_listing_parity` — PASS
7. `test_bug0019_upgrade_copies_listing_surface` — PASS

## User-facing validation (this phase)

| Check | Result |
|-------|--------|
| Colliding markdown `/auto` still absent (surrogate) | **PASS** — `.opencode/commands/auto.md` + template twin absent; 14 remaining commands |
| TUI slash listing surface present | **PASS** — `its-magic-auto/tui.ts` `slash`/`slashName` `"auto"` (active + template) |
| Plugin remains `/auto` execute owner | **PASS** — `editor.add({ name: "auto", execute })` → `runAutoLifecycle` retained; `index.ts` has no `editor.add` |
| Leftover collision fail-closed | **PASS** — `OPENCODE_AUTO_MARKDOWN_COLLISION` + leftover existsSync; plugin does not delete |

## Waived probes (honest live-runtime)

| Probe | reason_code |
|-------|-------------|
| browser_smoke | `UAT_PROBE_FORBIDDEN` (kit TUI listing slice; no web UI) |
| api_health | `UAT_PROBE_FORBIDDEN` (no runtime HTTP API) |
| process_health | `UAT_PROBE_FORBIDDEN` (no runtime app server) |
| cli_smoke | `UAT_PROBE_FORBIDDEN` (no live OpenCode TUI CI probe) |
| build | `UAT_PROBE_FORBIDDEN` (no separate build step) |
| manual_operator | `UAT_PROBE_FORBIDDEN` (contract + TUI surface surrogate; no live OpenCode host) |

## Isolation compliance gate (US-0048 / DEC-0029)

| Phase | Marker | Result |
|-------|--------|--------|
| execute | `dev-BUG0019-execute-20260912T184000Z-fresh` | PASS |
| qa | `qa-BUG0019-qa-20260912T190500Z-fresh` | PASS |
| verify-work | `qa-BUG0019-verifywork-20260912T192000Z-fresh` | PASS (this phase) |

## Runtime proofs (full `rp-auto-…` — not truncated `p-auto`)

| Phase | runtime_proof_id | proof_hash |
|-------|------------------|------------|
| execute | `rp-auto-20260912-bug0019-execute-dev-20260912T185500Z-BUG-0019` | `639497519CC0DD4539008DBDF6D0047AD112FDC43AAE99BA51FB0251BAA518C8` |
| qa (consumed) | `rp-auto-20260912-bug0019-qa-qa-20260912T191000Z-BUG-0019` | `13C82F7DAFBFC808CFF62D7AFF9669B29D7111B48834799DDB05E84D2E2A6AA7` (MATCH; consumed 19:25 before ttl 20:10) |
| plan-verify | `rp-auto-20260912-bug0019-plan-verify-qa-20260912T191000Z-BUG-0019` | `44773F439FD6A29D5BA0B9AE8D3DF87701720AA6D1241EB953645751D217DEEC` |
| verify-work (issued) | `rp-auto-20260912-bug0019-verify-work-qa-20260912T192500Z-BUG-0019` | `D2FB7454A7A6C5E456D4F2E7EAC5F010AA88D0BAE6B35919676DC003649C7735` |

## Results summary vs acceptance

| Bucket | Count |
|--------|-------|
| PASS | 8 |
| FAIL | 0 |
| Total steps | 8 |

All seven acceptance criteria (AC-1..AC-7) map to UAT-1..UAT-7 and **PASS**. Canonical `convergence_smoke` **PASS**. Backlog Status remains **OPEN** (US-0045); acceptance BUG-0019 unchecked. Machine-readable: `sprints/S0139/uat.json`.

## Next

- Sovereign-critic of verify-work (if CROSS_MODEL_REVIEW=1) → **`/release`** (fresh **release**) for **`S0139`** / **`BUG-0019`**
- STOP — do not spawn `/release` from this subagent. Do NOT mark BUG-0019 DONE. Do NOT tick acceptance.
