# Sprint S0134 — UAT (US-0132) — populated at /verify-work (DEC-0009)

- **uat_lifecycle**: populated (verify-work operator UAT; `/release` confirms verified)
- **sprint_id**: S0134
- **story_refs**: US-0132
- **phase**: verify-work (build+verify macro)
- **role**: qa (fresh per BUG-0006)
- **orchestrator_run_id**: auto-20260909-us0132
- **delivery_mode**: ultra_lean
- **macro_phase**: build+verify
- **story_type**: code (scripts/docs/examples/contract-test slice; FRAMEWORK_KIT_REPO=1)
- **fresh_context_marker**: `qa-US0132-verify-work-20260909T195316Z-fresh`
- **timestamp**: 2026-09-09T19:53:16Z (UTC)
- **model_id**: cursor-grok-4.6 (CROSS_MODEL_REVIEW=1 — required)
- **verdict**: PASS
- **total_steps**: 9 (UAT-1..UAT-8 + canonical `convergence_smoke`)
- **passed**: 9 | **failed**: 0
- **story_status**: OPEN (do not mark US-0132 DONE — US-0045; acceptance L160 unchecked; intake JSON not mutated)
- **blocking_count**: 0

## Probe class — scripts/docs/examples contract-test slice

US-0132 is a code+docs+parity+contract-test slice. Applicable probe: `contract_tests_primary` (10 markers). No `browser_smoke`. Six live-runtime classes waived with `UAT_PROBE_FORBIDDEN`. No fake browser PASS. Live-runtime probes were not attempted.

Canonical surrogate step `id=convergence_smoke` emitted because `contract_test_failed=0` (10/10 pytest). Operator-facing UAT this pass: live `--scope model-config --host both --repo .` inventory + `provenance=`; extra `--host opencode` fixture PATH_UNKNOWN-only.

Leftover `tests/report.md` `evidence_ref` from qa uat.json **cleaned** (file absent; surrogate is `contract_test_failed=0`).

## Target stories + acceptance criteria

- **US-0132** — Explicit Cursor/OpenCode model configuration contract (8 ACs; backlog checkboxes remain unchecked)
  - AC-1: PASS — Canonical ownership (four surfaces; reject generic `model.json`) (marker 1 + live CLI inventory)
  - AC-2: PASS — Separate schemas (markers 2, 3)
  - AC-3: PASS — Per-host precedence + diagnostics (markers 4, 5, 8 + live `provenance=`)
  - AC-4: PASS — Materialization correctness (marker 6)
  - AC-5: PASS — Fail-closed validation + HOST_COLLISION distinct (markers 1, 5, 8, 10; extra `--host opencode`)
  - AC-6: PASS — Local-file protection (marker 7)
  - AC-7: PASS — Triple-surface parity (markers 7, 9; 6/6 pairs)
  - AC-8: PASS — 10 contract tests + runbook/README (all 10)

## Contract test markers (10) — live verify-work re-run

`python -m pytest tests/us0132_contract_test.py -v` — **10 passed** in 0.87s.

## Operator-facing checks (this /verify-work)

| Check | Result |
|-------|--------|
| Live `model_tier_validate.py --scope model-config --host both --repo .` | **PASS** — four-surface inventory printed; host JSON absent fail-open; `provenance=host=cursor;path=.cursor/scratchpad.local.md;step=MODEL_TIER_<PHASE>`; `[MODEL_TIER_VALIDATION_OK]` |
| Extra `--host opencode` + `model.json` fixture | **PASS** — `MODEL_CONFIG_PATH_UNKNOWN` only; **no** `MODEL_CONFIG_HOST_COLLISION` |
| Runbook h2 inventory / migration / fail-closed codes | Present (`## Cursor/OpenCode model configuration contract (US-0132)`) |
| README pointer | Present (`### Cursor/OpenCode model configuration contract (US-0132)`) |
| Gitignore explicit OpenCode catalog | root L15 + `template/.gitignore` L8 |
| `[model_config_preserve_paths]` + installer.py/ps1/sh | Named locals preserved |
| Parity `--scope=us-0132` | `[INTAKE_TEMPLATE_PARITY_OK]`; 6/6 IDENTICAL |
| Metadata guard | exit 0 |
| Status / ACs / L160 | OPEN; 8/8 AC `- [ ]`; L160 `- [ ]`; US-0131 DONE held |

## UAT step results

| Step | AC | Result | Evidence |
|------|----|--------|----------|
| UAT-1 | AC-1 | pass | four-surface inventory live CLI + `MODEL_CONFIG_PATH_UNKNOWN`; marker 1 |
| UAT-2 | AC-2 | pass | `MODEL_CONFIG_SCHEMA_MIX`; markers 2, 3 |
| UAT-3 | AC-3 | pass | live `provenance=` + kit vs host; markers 4, 5, 8 |
| UAT-4 | AC-4 | pass | idempotent never-write; marker 6 |
| UAT-5 | AC-5 | pass | `MODEL_CONFIG_*` + HOST_COLLISION; extra `--host opencode` PATH_UNKNOWN-only |
| UAT-6 | AC-6 | pass | exclude-from-clean named locals; marker 7 |
| UAT-7 | AC-7 | pass | installer.py/ps1/sh + gitignore + 6/6 pairs; markers 7, 9 |
| UAT-8 | AC-8 | pass | 10/10 `test_us0132_*`; runbook h2 + README |
| convergence_smoke | surrogate | pass | `contract_test_failed=0`; 6 waived probes |

## Waived probes

| Probe | reason_code |
|-------|-------------|
| browser_smoke | `UAT_PROBE_FORBIDDEN` (scripts/docs/examples/contract-test slice; FRAMEWORK_KIT_REPO=1) |
| api_health | `UAT_PROBE_FORBIDDEN` (no runtime API) |
| process_health | `UAT_PROBE_FORBIDDEN` (no runtime process/app server) |
| cli_smoke | `UAT_PROBE_FORBIDDEN` (validator/installer verified via contract tests + live operator CLI) |
| build | `UAT_PROBE_FORBIDDEN` (no build step) |
| manual_operator | `UAT_PROBE_FORBIDDEN` (docs + live validator + contract tests; no extra live operator action) |

## Results summary

- **Total**: 9 steps
- **Passed**: 9
- **Failed**: 0
- **Verdict**: PASS
- **Blocking QA findings**: 0
- **Non-blocking**: critic NBs informational (marker 1 `--host opencode` extra check PASS this UAT; marker 6 tautological source-scan; `FORBIDDEN_WRITE_RELPATHS` unused as runtime guard; leftover `tests/report.md` evidence_ref cleaned)

## Producer proof consumed (qa)

- `runtime_proof_id=rp-auto-20260909-us0132-qa-qa-20260909T194000Z-US-0132`
- Independent SHA-256 MATCH `D3CBDC44FD3794BE97AD421AF703B65B06BBFD407462B7FCE8DB395B91907DD7`
- `proof_ttl=2026-09-09T20:40:00Z`; consumed_at `2026-09-09T19:53:16Z` (before RUNTIME_PROOF_STALE; ~2804s remaining)
- marker=`qa-US0132-qa-20260909T194000Z-fresh`; critic PASS `us0132qac-*`

## Runtime proof (DEC-0038) — verify-work

- `runtime_proof_id=rp-auto-20260909-us0132-verify-work-qa-20260909T195316Z-US-0132`
- `proof_hash=9DA355C4FD58FDFE56669C4CA9BF4FB26361276BD2DADB3D983ACB1172B75FB5`
- `proof_ttl=2026-09-09T20:53:16Z`

## Next

- **next_scheduled_phase**: `/release` (fresh release; orchestrator spawn; CROSS_MODEL_REVIEW=1 critic of verify-work first)
- Do **not** tick backlog ACs or acceptance L160. Do **not** mark US-0132 DONE. Do **not** reopen US-0131. Do **not** spawn critic or release from this subagent.
