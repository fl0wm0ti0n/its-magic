# Verify-Work Findings — S0148 / BUG-0023

**Phase**: verify-work
**Role**: qa (fresh subagent)
**Bug**: BUG-0023 (OpenCode CLI TUI listed `/auto` toasts OPENCODE_AUTO_TUI_DISPATCH_UNSUPPORTED)
**Sprint**: S0148
**Orchestrator run**: auto-20260913-bug0023
**Parent run**: cursor-20260913-BUG0023-intake
**Verify-work timestamp**: 2026-09-14T00:55:00Z
**Fresh context marker**: qa-BUG0023-verify-work-20260914T005500Z-fresh
**model_id**: cursor-grok-4.6-high (CROSS_MODEL_REVIEW=1; MODEL_RESOLVE_FALLBACK catalog `gpt-5.6-sol-high` → Task slug `cursor-grok-4.6-high`)
**producer_model_id**: cursor-grok-4.6-high
**delivery_mode**: ultra_lean
**macro_phase**: build+verify (verify-work terminal)
**AUTO_QUIET**: 1
**FRAMEWORK_KIT_REPO**: 1
**Verdict**: VERIFY_WORK_PASS / **VERIFY_PASS**

## Independent verify-work verification

Fresh QA subagent per US-0048 / BUG-0006. Marker is **new** (not reused `qa-BUG0023-qa-20260914T004500Z-fresh`, `dev-BUG0023-execute-20260914T003500Z-fresh`, or `tl-BUG0023-critic-qa-20260914T005000Z-fresh`). Context limited to artifacts/handoffs (narrow-read). Independent re-run of pytest bug0023 + four compose files (**37/37**) and parity `--scope bug-0023`. UAT populated (DEC-0009) UAT-1..UAT-9 + `convergence_smoke`. Six live-runtime classes `UAT_PROBE_FORBIDDEN`. **No fake browser PASS.** **No live OpenCode CLI TUI PASS.** No `.env`. No intake mutation. No DONE flip. No acceptance.md tick. No auto.md restore.

Confirmed: **QA_PASS** (sprints/S0148/qa-findings.md; state qa checkpoint). Confirmed: critic of QA **CRITIC_PASS** (anti_slop=10; blocking_count=0; degraded_mode=false; findings `bug0023qa-*`). AC-1..AC-9 ticks honest (slice; AC-1 mock+inspection; AC-6 mock-invoke). Status **OPEN**.

Consumed qa proof `rp-auto-20260913-bug0023-qa-qa-20260914T004500Z-BUG-0023` / `AC810B53913132F5B0A5F256DC3689AF80F95EFD065682A24443C4A8A180E850` MATCH before TTL 01:45. Critic of QA PASS `rp-auto-20260913-bug0023-sovereign-critic-techlead-20260914T005000Z-BUG-0023` / `CB3E4D8EB2E7C1B56919FCE7AAB69D3211701FD7284E636B4D47C02AAAFE4E8F`. Execute `rp-auto-20260913-bug0023-execute-dev-20260914T003500Z-BUG-0023` / `9D6731CDE1E53798FC7637915B93F0519DC23C5723C0E480713CFA259C680980` MATCH before TTL 01:35.

## Test battery (live this pass)

| Gate | Command / method | Result |
|------|------------------|--------|
| BUG-0023 + compose contract tests | `python -m pytest tests/bug0023_opencode_cli_tui_dispatch_rpc_test.py tests/bug0021_opencode_cli_tui_plugin_load_test.py tests/bug0020_opencode_desktop_command_info_listing_test.py tests/bug0019_opencode_auto_slash_listing_test.py tests/bug0018_opencode_auto_ownership_test.py -v` | **37 passed** in 0.77s (**8/8** `test_bug0023_*`; **8/8** `test_bug0021_*`; **8/8** `test_bug0020_*`; **7/7** `test_bug0019_*`; **6/6** `test_bug0018_*`) |
| Parity | `python scripts/check_intake_template_parity.py --repo . --scope bug-0023` | **[INTAKE_TEMPLATE_PARITY_OK]** |
| UAT probe lib | `python scripts/uat_probe_lib.py --self-test` | **[UAT_PROBE_LIB_SELF_TEST_OK]** |
| Metadata | `python scripts/check-user-visible-metadata.py --repo .` | **exit 0** |
| QA proof consume | `compute_strict_proof_hash` 6-field tuple | **MATCH** `AC810B53913132F5B0A5F256DC3689AF80F95EFD065682A24443C4A8A180E850`; ttl `2026-09-14T01:45:00Z`; consumed_at `2026-09-14T00:55:00Z` — **RUNTIME_PROOF_VALID** |
| Critic of qa proof | `compute_strict_proof_hash` | **MATCH** `CB3E4D8EB2E7C1B56919FCE7AAB69D3211701FD7284E636B4D47C02AAAFE4E8F`; blocking_count=0; anti_slop=10; degraded_mode=false |
| Execute proof consume | `compute_strict_proof_hash` | **MATCH** `9D6731CDE1E53798FC7637915B93F0519DC23C5723C0E480713CFA259C680980`; ttl `2026-09-14T01:35:00Z`; consumed_at `2026-09-14T00:55:00Z` — **RUNTIME_PROOF_VALID** |
| Colliding auto.md | path exists? | **absent** active + template; 14 peer `.md`; keep `.opencode/agents/auto.md` + `.cursor/commands/auto.md` |
| Invented POST | `tui.ts` `/rpc/its-magic.auto/runAutoLifecycle` | **absent** |
| Acceptance row | `docs/product/acceptance.md` | `- [ ] BUG-0023` (not ticked) |
| Backlog | `### BUG-0023` Status | **OPEN**; AC-1..AC-9 remain `[x]` from QA (honest slice) |

## AC verification (architecture `# BUG-0023` Axis A)

| AC | Description | Result |
|----|-------------|--------|
| AC-1 | Listed CLI TUI `/auto` starts `runAutoLifecycle` | **PASS** (slice; mock+inspection; UAT-1; markers 1+2+4). Live CLI TUI not probed. |
| AC-2 | Fail-closed `OPENCODE_*` only when host cannot dispatch | **PASS** (UAT-2; marker 6) |
| AC-3 | Must not restore STOP-only `auto.md` | **PASS** (UAT-3; marker 5) |
| AC-4 | Must not JSON-template `/auto` | **PASS** (UAT-4; marker 5) |
| AC-5 | Plugin `editor.add` execute retained | **PASS** (UAT-5; markers 4+5) |
| AC-6 | Tests mock-invoke, not listing/token-only | **PASS** (UAT-6; marker 2) |
| AC-7 | Upgrade overwrites dispatch path + prunes leftover `auto.md` | **PASS** (UAT-7; marker 8) |
| AC-8 | Active↔template parity | **PASS** (UAT-8; marker 7) |
| AC-9 | Invented POST `{ input }` is not the happy path | **PASS** (UAT-9; marker 3) |

**Overall AC gate**: **PASS** (slice) — Status remains OPEN; `docs/product/acceptance.md` BUG-0023 **unchecked**. **No live OpenCode CLI TUI PASS.**

## Runtime browser evidence

None. MCP browser sequence **not run**. No screenshot. No silent browser PASS. Six live classes `UAT_PROBE_FORBIDDEN`.

## Generated-test evidence (US-0066)

- `generated_test_stack_profile`: python
- `generated_test_command`: `python -m pytest tests/bug0023_opencode_cli_tui_dispatch_rpc_test.py tests/bug0021_opencode_cli_tui_plugin_load_test.py tests/bug0020_opencode_desktop_command_info_listing_test.py tests/bug0019_opencode_auto_slash_listing_test.py tests/bug0018_opencode_auto_ownership_test.py -v`
- `generated_test_result`: pass
- `generated_test_output_ref`: this file § Test battery (37 passed in 0.77s)
- `generated_test_paths_ref`: `tests/bug0023_opencode_cli_tui_dispatch_rpc_test.py`
- `generated_test_reason_code`: none (pass)
- `FRAMEWORK_KIT_REPO=1` / kit contract tests (not generated-app scaffolds) — do **not** fail `TEST_SCAFFOLD_GENERATION_FAILED`

## Isolation + proof (this phase)

- isolation: `phase_id=verify-work`; `role=qa`; `fresh_context_marker=qa-BUG0023-verify-work-20260914T005500Z-fresh`; `timestamp=2026-09-14T00:55:00Z`; `evidence_ref=sprints/S0148/uat.json; sprints/S0148/uat.md`
- runtime_proof_id=`rp-auto-20260913-bug0023-verify-work-qa-20260914T005500Z-BUG-0023`
- proof_hash=`A2735C5DFBC97091CAEFC2A29D4EA2E481F9E3C9F593BF0DC8FA8B93AA2B5580` (64 hex; `compute_strict_proof_hash` positional)
- proof_ttl=`2026-09-14T01:55:00Z`

## Sovereign-critic (verify-work)

- **verdict**: CRITIC_PASS
- **critic_model_id**: composer-2.5 (producer cursor-grok-4.6-high; degraded_mode=false)
- **anti_slop_aggregate**: 10
- **blocking_count**: 0
- **finding_ids**: bug0023vw-challenger-001, bug0023vw-architect-002, bug0023vw-subtractor-003
- **fresh_context_marker**: tl-BUG0023-critic-vw-20260914T010000Z-fresh
- **runtime_proof_id**: rp-auto-20260913-bug0023-sovereign-critic-techlead-20260914T010000Z-BUG-0023
- **proof_hash**: 25E0038A8239D6FC0F13261CB01137A2A251A202EDEE3DF547C4CB33188103E5
- **cross_reviewer_findings.open_blocking_count**: 0 (`handoffs/sovereign_critic_findings.jsonl`)

## Next

STOP after CRITIC_PASS. Orchestrator MUST spawn `/release` in a fresh **release** subagent (BUG-0006). Do NOT spawn `/release` from this critic. Do NOT mark BUG-0023 DONE. Do NOT tick acceptance.md. Do NOT restore auto.md. Do NOT claim live CLI TUI PASS.
