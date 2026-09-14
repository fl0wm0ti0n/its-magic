# Sprint S0135 — UAT (BUG-0017) — populated at /verify-work (DEC-0009)

- **uat_lifecycle**: populated (verify-work PASS; DEC-0009 qa_seeded → populated complete)
- **sprint_id**: S0135
- **bug_refs**: BUG-0017
- **phase**: verify-work (build+verify macro)
- **role**: qa (fresh per BUG-0006)
- **orchestrator_run_id**: auto-20260911-bug0017
- **delivery_mode**: ultra_lean
- **macro_phase**: build+verify
- **story_type**: code (OpenCode pack EOL / gitattributes / publish-guard / contract-test slice; FRAMEWORK_KIT_REPO=1)
- **fresh_context_marker**: `qa-BUG0017-verify-work-20260911T195200Z-fresh`
- **timestamp**: 2026-09-11T19:52:00Z (UTC)
- **model_id**: composer-2.5 (CROSS_MODEL_REVIEW=1 — required)
- **producer_phase_id**: qa (role=qa; **QA_PASS**; `blocking_count=0`)
- **critic_phase_id**: sovereign-critic of qa (tech-lead, gpt-5.6-luna-medium; PASS; anti_slop=10; marker `critic-BUG0017-qa-20260911T195100Z-fresh`)
- **verdict**: **PASS** (verify-work) — UAT 8/8 pass, 0 fail (AC-1..AC-7 → UAT-1..UAT-7 + canonical `convergence_smoke`); live `pytest tests/bug0017_opencode_eol_test.py -v` → **6 passed in 0.23s**; `npm run guard:installer` **PASS**; LF spot-check commands **no CR**; isolation execute+qa+verify-work present
- **total_steps**: 8 (UAT-1..UAT-7 + canonical `convergence_smoke`)
- **passed**: 8 | **failed**: 0
- **bug_status**: OPEN (do not mark BUG-0017 DONE — US-0045; acceptance BUG-0017 unchecked; intake JSON not mutated)
- **blocking_findings**: 0
- **non_blocking_findings**: 3 (NB1..NB3 carry-forwards — informational)
- **harness_fail_zero_claimed**: false (slice contract tests + guard are the required evidence)
- **browser_probe_used**: false (no fake browser PASS)

## Probe class — OpenCode pack EOL / slash-command discoverability

BUG-0017 is a kit EOL / gitattributes / publish-guard contract-test slice. Applicable probe: `contract_tests_primary` (6 markers). User-facing validation: LF command markdown (no CR) so YAML frontmatter parses → Linux OpenCode can list/recognize `/auto`/`/intake` peers; guard fail-closed on CR. No web UI. Six live-runtime classes waived with **`UAT_PROBE_FORBIDDEN`**. **No silent browser PASS.** MCP browser sequence not run. No live OpenCode host probe.

Canonical surrogate step `id=convergence_smoke` kept `result=pass` because `contract_test_failed=0` (6/6 pytest).

## Target bug + acceptance criteria (architecture `# BUG-0017`)

- **BUG-0017** — OpenCode on Linux ignores its-magic slash commands (CRLF breaks YAML frontmatter)
  - **Primary** (`docs/product/acceptance.md`): Linux OpenCode lists/recognizes `/auto`/`/intake`/peers from LF command markdown; shipped pack has no CRLF (D9). — **PASS** (surrogate); checkbox **unchecked**
  - AC-1: PASS — Linux OpenCode recognizes slash commands (UAT-1; attrs + LF pack)
  - AC-2: PASS — Shipped pack has no CRLF (UAT-2)
  - AC-3: PASS — Scoped `.gitattributes` only (UAT-3)
  - AC-4: PASS — Publish/CI fail-closed on `\r` + before-tag (UAT-4)
  - AC-5: PASS — Active ↔ template parity (UAT-5)
  - AC-6: PASS — Consumer upgrade path DQ6 (UAT-6)
  - AC-7: PASS — Compose BUG-0008 / US-0084 (UAT-7)

## UAT step results (verify-work)

| Step | AC | Result | Evidence |
|------|----|--------|----------|
| UAT-1 | AC-1 | pass | markers 1–4; LF spot-check `auto.md` / `intake.md` |
| UAT-2 | AC-2 | pass | markers 2,3,4; `guard:installer` PASS |
| UAT-3 | AC-3 | pass | marker 1; six DQ1 rows; no repo-wide `*.md` |
| UAT-4 | AC-4 | pass | markers 4,5; runbook + choco before-tag |
| UAT-5 | AC-5 | pass | marker 6; 3/3 template pairs IDENTICAL |
| UAT-6 | AC-6 | pass | runbook `upgrade --host opencode\|both` |
| UAT-7 | AC-7 | pass | marker 5 compose held |
| convergence_smoke | surrogate | pass | `contract_test_failed=0`; 6 waived probes `UAT_PROBE_FORBIDDEN` |

## Contract test markers (6) — verify-work live re-run

`python -m pytest tests/bug0017_opencode_eol_test.py -v` — **6 passed** in 0.23s (2026-09-11T19:52:00Z).

1. `test_bug0017_gitattributes_scoped_opencode_eol_lf` — PASS
2. `test_bug0017_no_cr_in_active_opencode_pack_text` — PASS
3. `test_bug0017_no_cr_in_template_opencode_pack_text` — PASS
4. `test_bug0017_guard_installer_publish_rejects_opencode_cr` — PASS (guard fails on CR)
5. `test_bug0017_guard_still_enforces_installer_sh_and_manifests` — PASS
6. `test_bug0017_active_template_opencode_tracked_text_parity` — PASS

## User-facing validation (this phase)

| Check | Result |
|-------|--------|
| LF commands discoverable after fix (surrogate) | **PASS** — `.opencode/commands/auto.md` + `intake.md` LF-only (`has_CR=False`); template peer LF-only |
| Guard fails on CR | **PASS** — marker 4 + live `npm run guard:installer` PASS on clean LF tree |
| DQ1 scoped attrs | **PASS** — six OpenCode LF rows; no repo-wide `*.md text eol=lf` |

## Waived probes (honest live-runtime)

| Probe | reason_code |
|-------|-------------|
| browser_smoke | `UAT_PROBE_FORBIDDEN` (kit EOL slice; no web UI) |
| api_health | `UAT_PROBE_FORBIDDEN` (no runtime HTTP API) |
| process_health | `UAT_PROBE_FORBIDDEN` (no runtime app server) |
| cli_smoke | `UAT_PROBE_FORBIDDEN` (no live OpenCode CI probe) |
| build | `UAT_PROBE_FORBIDDEN` (no separate build step) |
| manual_operator | `UAT_PROBE_FORBIDDEN` (LF + contract surrogate; no live Linux OpenCode host) |

## Isolation compliance gate (US-0048 / DEC-0029)

| Phase | Marker | Result |
|-------|--------|--------|
| execute | `dev-BUG0017-execute-20260911T192500Z-fresh` | PASS |
| qa | `qa-BUG0017-qa-20260911T194700Z-fresh` | PASS |
| verify-work | `qa-BUG0017-verify-work-20260911T195200Z-fresh` | PASS (this phase) |

## Runtime proofs (full `rp-auto-…` — not truncated `p-auto`)

| Phase | runtime_proof_id | proof_hash |
|-------|------------------|------------|
| execute | `rp-auto-20260911-bug0017-execute-dev-20260911T194500Z-BUG-0017` | `7B9319A03BA2399F67DD87F25334DEF7ECE7FD250DBEA8ABC5DC42ED22B01936` |
| qa (consumed) | `rp-auto-20260911-bug0017-qa-qa-20260911T195000Z-BUG-0017` | `65A7F3ADFA440248BEA7A83A908680AB5AC270FF79DF7E2A2ECD0ECFDD30B441` (MATCH; consumed 19:52 before ttl 20:50) |
| plan-verify | `rp-auto-20260911-bug0017-plan-verify-qa-20260911T195000Z-BUG-0017` | `58D69A19144D54A3854F133B77648F474A2A9E16F3E5EEA17235487AA4CB8C52` |
| verify-work (issued) | `rp-auto-20260911-bug0017-verify-work-qa-20260911T195200Z-BUG-0017` | `EFC002B0895C4FC2AB4285FBAFED9E55BADC57F5B8EC43BBF676D5184E514C02` |

## Results summary vs acceptance

| Bucket | Count |
|--------|-------|
| PASS | 8 |
| FAIL | 0 |
| Total steps | 8 |

All seven acceptance criteria (AC-1..AC-7) map to UAT-1..UAT-7 and **PASS**. Canonical `convergence_smoke` **PASS**. Backlog Status remains **OPEN** (US-0045); acceptance BUG-0017 unchecked. Machine-readable: `sprints/S0135/uat.json`.

## Next

- Sovereign-critic of verify-work (if CROSS_MODEL_REVIEW=1) → **`/release`** (fresh **release**) for **`S0135`** / **`BUG-0017`**
- STOP — do not spawn `/release` from this subagent. Do NOT mark BUG-0017 DONE. Do NOT tick acceptance.
