# Sprint S0136 — UAT (BUG-0018) — populated at /verify-work (DEC-0009)

- **uat_lifecycle**: populated (verify-work PASS; DEC-0009 qa_seeded → populated complete)
- **sprint_id**: S0136
- **bug_refs**: BUG-0018
- **phase**: verify-work (build+verify macro)
- **role**: qa (fresh per BUG-0006)
- **orchestrator_run_id**: auto-20260912-bug0018
- **delivery_mode**: ultra_lean
- **macro_phase**: build+verify
- **story_type**: code (OpenCode plugin-only `/auto` / contract-test slice; FRAMEWORK_KIT_REPO=1)
- **fresh_context_marker**: `qa-BUG0018-verifywork-20260912T104500Z-fresh`
- **timestamp**: 2026-09-12T10:45:00Z (UTC)
- **model_id**: cursor-grok-4.6 (CROSS_MODEL_REVIEW=1 — required)
- **producer_phase_id**: qa (role=qa; **QA_PASS**; `blocking_count=0`)
- **critic_phase_id**: sovereign-critic of qa (tech-lead, composer-2.5-fast; PASS; anti_slop=10; marker `critic-BUG0018-qa-20260912T104000Z-fresh`)
- **verdict**: **PASS** (verify-work) — UAT 8/8 pass, 0 fail (AC-1..AC-7 → UAT-1..UAT-7 + canonical `convergence_smoke`); live pytest compose suite **30 passed in 1.39s** (bug0018 **6/6**); colliding `auto.md` absent; plugin `editor.add` retained
- **total_steps**: 8 (UAT-1..UAT-7 + canonical `convergence_smoke`)
- **passed**: 8 | **failed**: 0
- **bug_status**: OPEN (do not mark BUG-0018 DONE — US-0045; acceptance BUG-0018 unchecked; intake JSON not mutated)
- **blocking_findings**: 0
- **non_blocking_findings**: 3 (NB1..NB3 critic carry-forwards — informational)
- **harness_fail_zero_claimed**: false (slice contract tests + compose are the required evidence)
- **browser_probe_used**: false (no fake browser PASS)

## Probe class — OpenCode plugin-only `/auto` ownership

BUG-0018 is a kit ownership / prune / contract-test slice. Applicable probe: `contract_tests_primary` (6 markers). User-facing validation: colliding `.opencode/commands/auto.md` removed so markdown cannot own `/auto`; plugin `editor.add({ name: "auto", execute })` → `runAutoLifecycle` remains sole owner; leftover fail-closed `OPENCODE_AUTO_MARKDOWN_COLLISION`. No web UI. Six live-runtime classes waived with **`UAT_PROBE_FORBIDDEN`**. **No silent browser PASS.** MCP browser sequence not run. No live OpenCode host probe. No `.env`.

Canonical surrogate step `id=convergence_smoke` kept `result=pass` because `contract_test_failed=0` (6/6 pytest).

## Target bug + acceptance criteria (architecture `# BUG-0018` A*)

- **BUG-0018** — OpenCode markdown `/auto` wins over plugin execute (STOP, no OPENCODE_* code)
  - **Primary** (`docs/product/acceptance.md`): `/auto` invokes plugin execute → `runAutoLifecycle` **or** documented `OPENCODE_*`; markdown must not be sole runtime owner when plugin execute is registered. — **PASS** (surrogate); checkbox **unchecked**
  - AC-1: PASS — plugin execute / `runAutoLifecycle` (UAT-1)
  - AC-2: PASS — markdown not sole owner (UAT-2)
  - AC-3: PASS — slash listing preserved (UAT-3)
  - AC-4: PASS — upgrade prunes leftover `auto.md` (UAT-4)
  - AC-5: PASS — no silent STOP / collision code (UAT-5)
  - AC-6: PASS — Active ↔ template parity (UAT-6)
  - AC-7: PASS — Compose BUG-0015 attach unchanged (UAT-7)

## UAT step results (verify-work)

| Step | AC | Result | Evidence |
|------|----|--------|----------|
| UAT-1 | AC-1 | pass | markers 1–2; plugin `editor.add` + `runAutoLifecycle` retained; `auto.md` absent |
| UAT-2 | AC-2 | pass | marker 1; active+template `.opencode/commands/auto.md` absent; agents/cursor keep |
| UAT-3 | AC-3 | pass | marker 2; plugin `name: "auto"` + spawn-only description |
| UAT-4 | AC-4 | pass | marker 4; installer prune fixture; runbook upgrade recipe |
| UAT-5 | AC-5 | pass | marker 6; `OPENCODE_AUTO_MARKDOWN_COLLISION`; leftover fn `unlink(`=0 `rmSync(`=0 |
| UAT-6 | AC-6 | pass | marker 3; 3/3 template pairs IDENTICAL |
| UAT-7 | AC-7 | pass | marker 5; us0125/bug0015/bug0017 compose 24/24 |
| convergence_smoke | surrogate | pass | `contract_test_failed=0`; 6 waived probes `UAT_PROBE_FORBIDDEN` |

## Contract test markers (6) — verify-work live re-run

`python -m pytest tests/bug0018_opencode_auto_ownership_test.py tests/us0125_contract_test.py tests/bug0015_contract_test.py tests/bug0017_opencode_eol_test.py -v` — **30 passed** in 1.39s (2026-09-12T10:45:00Z).

1. `test_bug0018_no_colliding_opencode_auto_md` — PASS
2. `test_bug0018_plugin_editor_add_auto_execute` — PASS
3. `test_bug0018_active_template_opencode_auto_ownership_parity` — PASS
4. `test_bug0018_upgrade_prunes_consumer_auto_md` — PASS
5. `test_bug0018_compose_bug0015_attach_api_unchanged` — PASS
6. `test_bug0018_markdown_collision_reason_code_stub` — PASS

## User-facing validation (this phase)

| Check | Result |
|-------|--------|
| Colliding markdown `/auto` removed (surrogate) | **PASS** — `.opencode/commands/auto.md` + template twin absent (`Test-Path` False); 14 remaining commands |
| Plugin remains sole `/auto` owner | **PASS** — `editor.add({ name: "auto", execute })` → `runAutoLifecycle` retained |
| Leftover collision fail-closed | **PASS** — `OPENCODE_AUTO_MARKDOWN_COLLISION` + leftover existsSync; plugin does not delete |

## Waived probes (honest live-runtime)

| Probe | reason_code |
|-------|-------------|
| browser_smoke | `UAT_PROBE_FORBIDDEN` (kit ownership slice; no web UI) |
| api_health | `UAT_PROBE_FORBIDDEN` (no runtime HTTP API) |
| process_health | `UAT_PROBE_FORBIDDEN` (no runtime app server) |
| cli_smoke | `UAT_PROBE_FORBIDDEN` (no live OpenCode CI probe) |
| build | `UAT_PROBE_FORBIDDEN` (no separate build step) |
| manual_operator | `UAT_PROBE_FORBIDDEN` (contract + file-absence surrogate; no live OpenCode host) |

## Isolation compliance gate (US-0048 / DEC-0029)

| Phase | Marker | Result |
|-------|--------|--------|
| execute | `dev-BUG0018-execute-20260912T102000Z-fresh` | PASS |
| qa | `qa-BUG0018-qa-20260912T103500Z-fresh` | PASS |
| verify-work | `qa-BUG0018-verifywork-20260912T104500Z-fresh` | PASS (this phase) |

## Runtime proofs (full `rp-auto-…` — not truncated `p-auto`)

| Phase | runtime_proof_id | proof_hash |
|-------|------------------|------------|
| execute | `rp-auto-20260912-bug0018-execute-dev-20260912T102000Z-BUG-0018` | `1BFC71170240A01546AB58966CDB431CA1802A96BBD6D91D559C1869535B6A82` |
| qa (consumed) | `rp-auto-20260912-bug0018-qa-qa-20260912T103500Z-BUG-0018` | `23372F67B489CE60161626AA2A9E0EEFC028DF7C58DAED1E27D6A8A2C4E43E5F` (MATCH; consumed 10:45 before ttl 11:35) |
| plan-verify | `rp-auto-20260912-bug0018-plan-verify-qa-20260912T103500Z-BUG-0018` | `6BCD9FD84F7F612467E00F8CB69F3BD6CCB9EB33DB5B514B7BA3A90A4B3A89CB` |
| verify-work (issued) | `rp-auto-20260912-bug0018-verify-work-qa-20260912T104500Z-BUG-0018` | `AFB58F6DEC7505290F0A796066820A3A12689EF9682B56B967F695C26837E5BE` |

## Results summary vs acceptance

| Bucket | Count |
|--------|-------|
| PASS | 8 |
| FAIL | 0 |
| Total steps | 8 |

All seven acceptance criteria (AC-1..AC-7) map to UAT-1..UAT-7 and **PASS**. Canonical `convergence_smoke` **PASS**. Backlog Status remains **OPEN** (US-0045); acceptance BUG-0018 unchecked. Machine-readable: `sprints/S0136/uat.json`.

## Next

- Sovereign-critic of verify-work (if CROSS_MODEL_REVIEW=1) → **`/release`** (fresh **release**) for **`S0136`** / **`BUG-0018`**
- STOP — do not spawn `/release` from this subagent. Do NOT mark BUG-0018 DONE. Do NOT tick acceptance.
