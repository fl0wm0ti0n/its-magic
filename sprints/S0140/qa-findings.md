# Verify-work generated-test re-run — BUG-0020 / S0140 (2026-09-13T02:15:00Z)

- `phase_id=verify-work`, `role=qa`, `fresh_context_marker=qa-BUG0020-verify-20260913T021500Z-fresh`
- `FRAMEWORK_KIT_REPO=1` / kit contract tests (not generated-app scaffolds) — do **not** fail `TEST_SCAFFOLD_GENERATION_FAILED`
- `generated_test_command`: `python -m pytest tests/bug0020_opencode_desktop_command_info_listing_test.py tests/bug0019_opencode_auto_slash_listing_test.py tests/bug0018_opencode_auto_ownership_test.py -v`
- `generated_test_result`: pass
- `generated_test_output_ref`: `sprints/S0140/verify-work-findings.md` (21 passed in 0.25s; bug0020 8/8; bug0019 7/7; bug0018 6/6)
- `generated_test_paths_ref`: `tests/bug0020_opencode_desktop_command_info_listing_test.py`
- `generated_test_reason_code`: none (pass)
- Full UAT populate + isolation/proofs: `sprints/S0140/uat.json`, `sprints/S0140/uat.md`, `sprints/S0140/verify-work-findings.md`

---

# QA findings — BUG-0020 / S0140 / auto-20260913-bug0020 (qa)

- **phase_id**: qa, **role**: qa, **bug_id**: BUG-0020 (OPEN — not marked DONE per US-0045), **sprint_id**: S0140
- `orchestrator_run_id=auto-20260913-bug0020`, `delivery_mode=ultra_lean`, `macro_phase=build+verify`
- `AUTO_IMPLEMENTATION_LOOP=1` (no blocking findings — do not return to `/execute`)
- `AUTO_QUIET=1`
- `model_id=cursor-grok-4.6` (CROSS_MODEL_REVIEW=1 — required on isolation)
- `producer_phase_id=execute`, `producer_role=dev`, `producer_model_id=cursor-grok-4.6-high` (handoff 013500Z); sibling spawn `001000Z` used `cursor-grok-4.6`
- `critic_phase_id=sovereign-critic` (execute review), `critic_model_id=composer-2.5-fast`, `critic_verdict=PASS`, `anti_slop_aggregate=9`, `open_blocking_findings=0`
- `critic_fresh_context_marker=critic-BUG0020-execute-20260913T002000Z-fresh`
- `critic_finding_ids=bug0020ex-challenger-001, bug0020ex-architect-002, bug0020ex-subtractor-003` (informational NBs; not AC failures)
- `cross_reviewer_findings.open_blocking_count=0` (`handoffs/sovereign_critic_findings.jsonl`)

- `fresh_context_marker=qa-BUG0020-qa-20260913T003000Z-fresh` (NEW per US-0048 / BUG-0006; not reused from execute `dev-BUG0020-execute-20260913T013500Z-fresh`, `dev-BUG0020-execute-20260913T001000Z-fresh`, or critic `critic-BUG0020-execute-20260913T002000Z-fresh`)
- `timestamp (UTC)=2026-09-13T00:30:00Z` (orchestrator-specified; wall clock at spawn `2026-09-12T23:48:09Z` was not later)
- **verdict: QA_PASS**
- `plan_verify_verdict=PASS` (ultra_lean deferred — `sprints/S0140/plan-verify.json` SKIPPED placeholder treated as PASS; 10/10 AC surjective in sprint-plan + this remap + primary acceptance row)
- `blocking_count=0`
- `non_blocking_count=3` (execute-critic carry-forwards — informational; not new blockers) plus honest operator NB: desktop operator must use CLI TUI; no live OpenCode desktop probe
- `story_status=OPEN` (do not mark BUG-0020 DONE; acceptance BUG-0020 unchecked; intake JSON not mutated)
- `acceptance_BUG-0020=NOT ticked`
- `intake_json=NOT mutated`
- `FRAMEWORK_KIT_REPO=1` / OpenCode desktop Command.Info listing / CLI TUI working-start / contract-test slice — no web UI; **no fake browser PASS**
- `SECURITY_REVIEW=0`, `CROSS_REPO_OBSERVABILITY=0`, `COMPONENT_SCOPE_MODE=0`, `USER_GUIDE_MODE=0`, `SPEC_PACK_MODE=0`
- `sibling_done=BUG-0015 DONE; BUG-0016 DONE; BUG-0017 DONE; BUG-0018 DONE; BUG-0019 DONE` (do not reopen)

## Verdict rationale

Fresh QA independently remapped AC-1..AC-10 against architecture `# BUG-0020` E2 (honest host-cannot-do-both on desktop Command.Info; C-limb CLI TUI `/auto` via `.opencode/tui.json`; desktop-visible `OPENCODE_AUTO_DESKTOP_COMMAND_INFO_LISTING_UNSUPPORTED`; retained plugin `editor.add` execute) + `sprints/S0140/sprint.md` / `tasks.md`, treated ultra_lean deferred `plan-verify.json` SKIPPED placeholder as **PASS** (10/10 AC surjective in sprint-plan; this pass overwrote with QA PASS / surjective, mirror S0139), re-ran `python -m pytest tests/bug0020_opencode_desktop_command_info_listing_test.py tests/bug0019_opencode_auto_slash_listing_test.py tests/bug0018_opencode_auto_ownership_test.py -v` (**21 passed**; bug0020 **8/8**; bug0019 **7/7**; bug0018 **6/6** compose), confirmed colliding `.opencode/commands/auto.md` **absent** (active + template), `.opencode/tui.json` lists `./plugins/its-magic-auto/tui.ts`, plugin `editor.add({ name: "auto", execute })` → `runAutoLifecycle` **retained**, `emitDesktopCommandInfoListingUnsupported` present (not TUI-toast-only), token `OPENCODE_AUTO_DESKTOP_COMMAND_INFO_LISTING_UNSUPPORTED` present, and independently recomputed **both** execute proof tuples **MATCH**. Blocking findings: **none**. BUG-0020 remains OPEN; acceptance unchecked; BUG-0019/0018/0017/0015/0016 DONE not reopened. Critic NBs treated as informational.

## Test plan

| # | Check | Expected |
|---|---|---|
| 1 | Independent AC-1..AC-10 remap vs E2 + tasks | Each AC ≥1 task; primary acceptance covered |
| 2 | Ultra_lean deferred `sprints/S0140/plan-verify.json` | SKIPPED placeholder → PASS if 10/10 surjective (mirror S0139) |
| 3 | pytest bug0020 + bug0019 + bug0018 | 8+7+6 = 21 PASS |
| 4 | `.opencode/commands/auto.md` + template twin absent | absent / keep surfaces present |
| 5 | `.opencode/tui.json` lists `./plugins/its-magic-auto/tui.ts` | present active + template; CLI-TUI-only |
| 6 | Plugin `editor.add` + `emitDesktopCommandInfoListingUnsupported` + desktop token | retained / present / present |
| 7 | Active↔template `--scope=bug-0020` | OK |
| 8 | Execute DEC-0038 proof consume | MATCH (handoff 013500Z; also recompute critic 001000Z) |
| 9 | Status OPEN; acceptance unchecked; siblings DONE held | unchanged |
| 10 | UAT probes | `contract_tests_primary` PASS; live classes waived |
| 11 | Emit `convergence_smoke` when `contract_test_failed=0` | present, `result=pass` |

## Independent checks (this qa subagent)

| Check | Command / method | Result |
|---|---|---|
| Execute proof SHA-256 (handoff 013500Z) | `compute_strict_proof_hash` 6-field tuple | **MATCH** `965A8687F38065B9655B99AD025622675A353809CC3632CC1FC597F19E0F75D7`; ttl `2026-09-13T02:35:00Z`; consumed_at `2026-09-13T00:30:00Z` — **primary consume** (handoff `dev_to_qa.md`) |
| Execute proof SHA-256 (critic 001000Z) | same | **MATCH** `47B2CADE2DCD851D930C584E1FBFDF96B33E521572202D75726698DCC35A6EDF`; ttl `2026-09-13T01:10:00Z` — critic consumed at `2026-09-13T00:20:00Z` before TTL. **Hashes differ** (distinct `runtime_proof_id` + `proof_issued_at`); both independently MATCH their attested values |
| Critic of execute proof | `compute_strict_proof_hash` | **MATCH** `213042335E0BF1D8D051F8B84BB963BACDE8E45F0D648C0090D95014DF5267D7`; blocking_count=0 |
| BUG-0020 + BUG-0019 + BUG-0018 contract tests | `python -m pytest tests/bug0020_opencode_desktop_command_info_listing_test.py tests/bug0019_opencode_auto_slash_listing_test.py tests/bug0018_opencode_auto_ownership_test.py -v` | **21 passed** in 0.26s (**8/8** `test_bug0020_*`; **7/7** `test_bug0019_*`; **6/6** `test_bug0018_*`) |
| Parity | `python scripts/check_intake_template_parity.py --repo . --scope=bug-0020` | **[INTAKE_TEMPLATE_PARITY_OK]** |
| Metadata | `python scripts/check-user-visible-metadata.py --repo .` | **exit 0** |
| UAT probe lib | `python scripts/uat_probe_lib.py --self-test` | **[UAT_PROBE_LIB_SELF_TEST_OK]** |
| Triad hot-surface | `python scripts/enforce-triad-hot-surface.py --check` | pre-write **PASS** (1173/1200, units=17/80); post-append rollover recorded in state.md |
| Colliding auto.md | path exists? | **absent** active + template |
| Keep surfaces | `.opencode/agents/auto.md`, `.cursor/commands/auto.md` | **present** |
| Remaining markdown commands | `.opencode/commands/*.md` | **14** (no `auto.md`) |
| Plugin attach | `command.transform` + `editor.add` `name: "auto"` + `runAutoLifecycle` | **retained** |
| CLI TUI load path | `.opencode/tui.json` + template `"plugin": ["./plugins/its-magic-auto/tui.ts"]` | **present**; CLI-TUI-only comment |
| Plugin-local tui.json | `.opencode/plugins/its-magic-auto/tui.json` | **absent** (FORBIDDEN_TUI_JSON) |
| Kit `cli.json` | `.opencode/cli.json` | **absent** (active + template) |
| Desktop emit helper | `emitDesktopCommandInfoListingUnsupported` | **present**; channels desktop-notify → session-notice → setup-session-error; **no** `tui.toast`/`ui.toast` call |
| Desktop listing token | `OPENCODE_AUTO_DESKTOP_COMMAND_INFO_LISTING_UNSUPPORTED` | **present** (REASON_CODES + emit helper) |
| Listing index | `its-magic-auto/index.ts` `editor.add` | **absent** |
| TUI keymap | `its-magic-auto/tui.ts` `slash`/`slashName` `"auto"` | **present** (active + template) |
| Leftover defense | `leftoverAutoMarkdownExists` | **existsSync only**; no unlink/rmSync |
| No JSON `commands.auto` template | repo `.opencode` JSON/JSONC search | **absent** |
| Backlog / acceptance | Status + checkbox spot-check | OPEN; acceptance `- [ ] BUG-0020` |
| LINT_COMMAND / TYPECHECK_COMMAND | blank in runbook | **skipped** |
| Full harness `tests/run-tests.ps1` | not re-run this pass | **not claimed** — scoped slice + compose are the required gates |
| Live OpenCode desktop probe | not attempted | **not claimed** (informational NB) |

## Blocking findings

None.

## Non-blocking findings (critic NB carry-forwards — informational)

| ID | Topic | QA note |
|---|---|---|
| NB1 / bug0020ex-challenger-001 | proof MATCH + surfaces; R1 desktop operator must switch to CLI TUI | Independently re-verified 8/8 + 7/7 + 6/6, auto.md absent, tui.json lists tui.ts, emit helper + desktop token present. Does **not** fail any AC. Honest residual: desktop Command.Info still will not list execute-only `/auto`; operator uses CLI TUI. |
| NB2 / bug0020ex-architect-002 | layering: tui.json does not feed Command.Info; orchestrator owns execute + desktop token | This pass overwrote SKIPPED placeholder with PASS `plan-verify.json` and remapped AC-1..AC-10. Execute E2 surfaces held. Not blocking. |
| NB3 / bug0020ex-subtractor-003 | no DONE / no companion DEC / no auto.md restore / no live desktop probe | Held this pass. Not blocking. |

Informational (QA-owned, not a new critic finding): no live OpenCode desktop/CLI TUI probe this pass; contract tests + fixture spot-checks are the gate.

## AC remap (independent — files + tests vs E2)

| AC | Delivered surface | Task(s) / markers | Result |
|---|---|---|---|
| AC-1 Operator can start auto (C-limb CLI TUI `/auto` after `tui.json` load) | `.opencode/tui.json` lists `./plugins/its-magic-auto/tui.ts`; keymap still `slash`/`slashName` `"auto"` | T-001, T-005 (m5, m6) | **PASS** |
| AC-2 Invocation starts `runAutoLifecycle` or documented `OPENCODE_*` | orchestrator `editor.add` execute retained; TUI `run()` still dispatches; desktop token on Command.Info miss | T-002, T-003, T-005 (m3, m6) | **PASS** |
| AC-3 Desktop picker is not a silent miss | `emitDesktopCommandInfoListingUnsupported` + `OPENCODE_AUTO_DESKTOP_COMMAND_INFO_LISTING_UNSUPPORTED` (not TUI-toast-only) | T-003, T-004, T-005 (m1, m4), T-007 | **PASS** |
| AC-4 Must not restore STOP-only `auto.md` | active+template `.opencode/commands/auto.md` absent | T-002, T-005 (m2) | **PASS** |
| AC-5 Must not JSON-template `/auto` | no OpenCode JSON `commands.auto` + `template` | T-002, T-005 (m2) | **PASS** |
| AC-6 Plugin `editor.add` execute retained | orchestrator `editor.add({ name: "auto", execute })` → `runAutoLifecycle`; `index.ts` does **not** `editor.add` | T-002, T-005 (m3) | **PASS** |
| AC-7 Consumer upgrade copies/merges `tui.json` + still prunes `auto.md` | `copy_or_merge_opencode_tui_json` + `prune_retired_opencode_auto_md`; marker 8 | T-006, T-005 (m8) | **PASS** |
| AC-8 Active↔template parity | `--scope=bug-0020` OK; marker 7 | T-007, T-005 (m7) | **PASS** |
| AC-9 Peers remain listed | 14 peer `.opencode/commands/*.md`; keep agents/cursor auto.md | T-anch, T-002 | **PASS** |
| AC-10 Tests are picker/token contracts, not slash-string existence | 8 `test_bug0020_*` markers; no live OpenCode probe | T-005 | **PASS** |

**Overall AC gate**: **PASS** (slice) — Status remains OPEN; backlog/acceptance checkboxes **not** ticked (US-0045; `/verify-work` / closure ownership).

## Contract marker results (8/8 slice + 7/7 + 6/6 compose)

| # | Marker | Result |
|---|---|---|
| 1 | `test_bug0020_desktop_command_info_picker_contract` | PASS |
| 2 | `test_bug0020_no_command_info_auto_template` | PASS |
| 3 | `test_bug0020_plugin_editor_add_auto_execute_retained` | PASS |
| 4 | `test_bug0020_desktop_listing_fail_closed_token` | PASS |
| 5 | `test_bug0020_cli_tui_working_start_load_path` | PASS |
| 6 | `test_bug0020_tui_run_still_dispatches_lifecycle` | PASS |
| 7 | `test_bug0020_active_template_parity` | PASS |
| 8 | `test_bug0020_upgrade_copies_surface_still_prunes_auto_md` | PASS |
| compose 1 | `test_bug0019_no_restored_opencode_auto_md` | PASS |
| compose 2 | `test_bug0019_plugin_editor_add_auto_execute_retained` | PASS |
| compose 3 | `test_bug0019_no_json_commands_auto_template` | PASS |
| compose 4 | `test_bug0019_tui_slash_auto_listing_surface` | PASS |
| compose 5 | `test_bug0019_tui_run_dispatches_lifecycle_not_template` | PASS |
| compose 6 | `test_bug0019_active_template_listing_parity` | PASS |
| compose 7 | `test_bug0019_upgrade_copies_listing_surface` | PASS |
| compose 8 | `test_bug0018_no_colliding_opencode_auto_md` | PASS |
| compose 9 | `test_bug0018_plugin_editor_add_auto_execute` | PASS |
| compose 10 | `test_bug0018_active_template_opencode_auto_ownership_parity` | PASS |
| compose 11 | `test_bug0018_upgrade_prunes_consumer_auto_md` | PASS |
| compose 12 | `test_bug0018_compose_bug0015_attach_api_unchanged` | PASS |
| compose 13 | `test_bug0018_markdown_collision_reason_code_stub` | PASS |

## Compose / scope gates

| Gate | Result |
|---|---|
| BUG-0019 E* CLI TUI keymap + `auto.md` absent | HELD (7/7 compose) |
| BUG-0018 A* plugin-only execute + `auto.md` absent | HELD (6/6 compose) |
| DEC-0124 / DEC-0125 bodies UNCHANGED | HELD (not rewritten this phase) |
| `# BUG-0019` historical body / R-0124 body | HELD |
| `# BUG-0018` historical body / R-0120 body | HELD |
| `# BUG-0020` / R-0126 not rewritten this phase | HELD |
| BUG-0015 / BUG-0016 / BUG-0017 / BUG-0018 / BUG-0019 DONE | HELD (not reopened) |
| US-0045 Status OPEN / acceptance unchecked | HELD |
| Cursor `.cursor/commands/auto.md` / `.opencode/agents/auto.md` untouched keep | HELD |
| No kit `cli.json`; no plugin-local `its-magic-auto/tui.json` | HELD |
| `index.ts` does not `editor.add` | HELD |
| Plugin leftover check does not delete leftover `auto.md` | HELD |
| No companion DEC-0136 | HELD |
| No live OpenCode desktop CI probe | HELD |
| Exactly 8 `test_bug0020_*` markers; `test_bug0018_*` / `test_bug0019_*` not weakened | HELD |
| No `.env` read / no intake JSON mutation | HELD |

## UAT / convergence (US-0128)

- Contract slice green (`contract_test_failed=0`); pytest 21/21; auto.md absent; plugin attach retained; tui.json lists tui.ts; emit helper + desktop token present.
- Canonical `convergence_smoke` recorded as **pass** in `sprints/S0140/uat.json`.
- Six live-runtime probe classes waived `UAT_PROBE_FORBIDDEN` (FRAMEWORK_KIT_REPO=1; no live OpenCode desktop probe; not `browser_smoke`).
- Ultra_lean: QA merged AC checklist into `uat.json` / this file; operator UAT ticks and DONE remain `/verify-work` / closure ownership.
- Full UAT ownership remains with `/verify-work` (do not flip DONE / tick ACs here).

## UAT probes (FRAMEWORK_KIT_REPO=1 — honest classification)

Applicable probe class: **`contract_tests_primary`** (8 markers + bug0019/bug0018 compose). No web UI. No fake browser PASS. Live-runtime / live OpenCode desktop probes **not attempted** (`UAT_PROBE_FORBIDDEN` if attempted). Static/fixture only. No `.env`.

Canonical surrogate step **`convergence_smoke`** emitted this pass (`result=pass`) because `contract_test_failed=0`.

| Probe class | Classification | reason_code |
|---|---|---|
| `browser_smoke` | waived / not applicable | `UAT_PROBE_FORBIDDEN` |
| `api_health` | waived / not applicable | `UAT_PROBE_FORBIDDEN` |
| `process_health` | waived / not applicable | `UAT_PROBE_FORBIDDEN` |
| `cli_smoke` | not applicable (no live OpenCode CI probe) | `UAT_PROBE_FORBIDDEN` |
| `build` | not applicable | `UAT_PROBE_FORBIDDEN` |
| `manual_operator` | deferred to verify-work / operator OpenCode host (desktop operator uses CLI TUI) | `UAT_PROBE_FORBIDDEN` |

**Runtime browser evidence**: none. MCP browser sequence **not run**. No screenshot. No silent browser PASS.

## Runtime QA evidence (US-0065) — kit slice, not generated webapp

- `runtime_startup_command`: n/a (FRAMEWORK_KIT_REPO=1; no app server)
- `runtime_stack_profile`: python (scripts/docs/tests kit)
- `runtime_mode`: local
- `runtime_health_target`: n/a — no process/endpoint
- `runtime_health_result`: not_applicable
- `runtime_log_summary`: n/a (no app logs)
- `runtime_retry_count`: 0
- `runtime_retry_ledger`: []
- `runtime_final_verdict`: pass
- `runtime_reason_code`: `UAT_PROBE_FORBIDDEN` for browser/runtime-app probes; slice health is contract tests + compose + `convergence_smoke` surrogate
- `runtime_evidence_refs`: pytest 21/21 (bug0020 8/8; bug0019 7/7; bug0018 6/6); auto.md absent; tui.json lists tui.ts; editor.add + emitDesktopCommandInfoListingUnsupported + desktop token; `sprints/S0140/uat.json` `convergence_smoke`

## Generated-test evidence (US-0066)

- `generated_test_stack_profile`: python
- `generated_test_command`: `python -m pytest tests/bug0020_opencode_desktop_command_info_listing_test.py tests/bug0019_opencode_auto_slash_listing_test.py tests/bug0018_opencode_auto_ownership_test.py -v`
- `generated_test_result`: pass
- `generated_test_output_ref`: this file § Independent checks (21 passed in 0.26s)
- `generated_test_paths_ref`: `tests/bug0020_opencode_desktop_command_info_listing_test.py`
- `generated_test_reason_code`: none (pass)

## Status confirmation (US-0045)

- backlog `### BUG-0020` Status: **OPEN**
- acceptance BUG-0020: **unchecked** (`- [ ] BUG-0020`)
- BUG-0015 / BUG-0016 / BUG-0017 / BUG-0018 / BUG-0019: **DONE** (not reopened)
- intake JSON not mutated this phase
- architecture.md `# BUG-0020` not mutated this phase
- R-0126 body not mutated this phase

## Producer proof consumed (execute) — dual tuple

Handoff and critic used **different** execute proof ids. QA independently recomputed **both**.

### Primary consume (handoff `dev_to_qa.md`)

- `producer_runtime_proof_id=rp-auto-20260913-bug0020-execute-dev-20260913T013500Z-BUG-0020`
- Canonical hashed payload: `{"orchestrator_run_id":"auto-20260913-bug0020","phase_id":"execute","proof_issued_at":"2026-09-13T01:35:00Z","proof_ttl_seconds":3600,"role":"dev","runtime_proof_id":"rp-auto-20260913-bug0020-execute-dev-20260913T013500Z-BUG-0020"}`
- `producer_attested_proof_hash=965A8687F38065B9655B99AD025622675A353809CC3632CC1FC597F19E0F75D7`
- Independent `compute_strict_proof_hash` recompute: **MATCH**
- `producer_proof_ttl=2026-09-13T02:35:00Z`, `consumed_at=2026-09-13T00:30:00Z`
- Note: QA stamp `00:30:00Z` is before this tuple's `proof_issued_at` `01:35:00Z` on artifact clocks; hash MATCH; not past TTL. Isolation extras (not hashed): `delivery_mode=ultra_lean`; `macro_phase=build+verify`; `model_id=cursor-grok-4.6-high`; `sprint_id=S0140`; `story_id=BUG-0020`
- `producer_fresh_context_marker=dev-BUG0020-execute-20260913T013500Z-fresh`

### Critic consume (earlier 001000Z — hashes differ)

- `critic_consumed_runtime_proof_id=rp-auto-20260913-bug0020-execute-dev-20260913T001000Z-BUG-0020`
- Canonical hashed payload: `{"orchestrator_run_id":"auto-20260913-bug0020","phase_id":"execute","proof_issued_at":"2026-09-13T00:10:00Z","proof_ttl_seconds":3600,"role":"dev","runtime_proof_id":"rp-auto-20260913-bug0020-execute-dev-20260913T001000Z-BUG-0020"}`
- Attested hash `47B2CADE2DCD851D930C584E1FBFDF96B33E521572202D75726698DCC35A6EDF` — independent recompute **MATCH**
- Critic consume at `2026-09-13T00:20:00Z` before TTL `2026-09-13T01:10:00Z` — **RUNTIME_PROOF_VALID** for that critic pass
- Critic of execute: PASS, blocking_count=0, anti_slop_aggregate=9, finding_ids `bug0020ex-*`

## Strict runtime proof (DEC-0038) — qa

- `orchestrator_run_id=auto-20260913-bug0020`
- `runtime_proof_id=rp-auto-20260913-bug0020-qa-qa-20260913T003000Z-BUG-0020` (NEW unique — distinct from execute / sprint-plan / critic)
- `phase_id=qa`, `role=qa`, `story_id=BUG-0020`, `sprint_id=S0140`
- `delivery_mode=ultra_lean`, `macro_phase=build+verify`, `model_id=cursor-grok-4.6`
- `proof_issued_at=2026-09-13T00:30:00Z`
- `proof_ttl_seconds=3600`, `proof_ttl=2026-09-13T01:30:00Z` (UTC = issued_at + 3600s)
- `proof_hash=C2FAA352843F023D9A850875CC2D23D10A47A238C6A9D0DA7D55F26B6E7207DB` (`compute_strict_proof_hash` positional 6-field)
- Canonical payload: `{"orchestrator_run_id":"auto-20260913-bug0020","phase_id":"qa","proof_issued_at":"2026-09-13T00:30:00Z","proof_ttl_seconds":3600,"role":"qa","runtime_proof_id":"rp-auto-20260913-bug0020-qa-qa-20260913T003000Z-BUG-0020"}`

## Strict runtime proof (DEC-0038) — plan-verify (ultra_lean merged)

- `runtime_proof_id=rp-auto-20260913-bug0020-plan-verify-qa-20260913T003000Z-BUG-0020`
- `phase_id=plan-verify`, `role=qa`
- `proof_issued_at=2026-09-13T00:30:00Z`, `proof_ttl=2026-09-13T01:30:00Z`
- `proof_hash=E6E5741468363C3808E499B96F0CABD115A066997135E04A483B5A6831FED844`
- Canonical payload: `{"orchestrator_run_id":"auto-20260913-bug0020","phase_id":"plan-verify","proof_issued_at":"2026-09-13T00:30:00Z","proof_ttl_seconds":3600,"role":"qa","runtime_proof_id":"rp-auto-20260913-bug0020-plan-verify-qa-20260913T003000Z-BUG-0020"}`

## Isolation evidence (US-0048 / DEC-0029 / US-0104 v2)

- `phase_id=qa`, `role=qa`, `model_id=cursor-grok-4.6` (CROSS_MODEL_REVIEW=1 — required)
- `fresh_context_marker=qa-BUG0020-qa-20260913T003000Z-fresh` (NEW per US-0048 / BUG-0006)
- `timestamp=2026-09-13T00:30:00Z` (UTC)
- `evidence_ref=sprints/S0140/qa-findings.md; sprints/S0140/plan-verify.json; sprints/S0140/uat.json; sprints/S0140/uat.md`
- Fresh qa subagent per BUG-0006 / US-0048 isolation; no prior chat history carried forward. Context limited to narrow-read (US-0053). No `.env` reads, no credentials access, no intake-evidence mutation, no backlog Status/AC mutation (qa_notes append only), no acceptance.md mutation, no architecture.md mutation, no DONE-row mutation, no `/execute` or `/verify-work` spawn from this subagent.

## Next scheduled phase

- `next_scheduled_phase=/verify-work` (role=qa per US-0069 / DEC-0051; fresh qa subagent per BUG-0006 — orchestrator-owned spawn; after sovereign-critic of qa if CROSS_MODEL_REVIEW=1)
- `next_scheduled_role=qa`
- `stop_condition=STOP after qa PASS. Orchestrator spawns sovereign-critic of qa (CROSS_MODEL_REVIEW=1), then /verify-work in a fresh qa subagent (BUG-0006). Do NOT spawn /verify-work or /execute from this subagent. Do NOT mark BUG-0020 DONE. Do NOT tick acceptance. Do NOT mutate intake JSON. Do NOT mutate architecture.md. Do NOT reopen BUG-0019/BUG-0018/BUG-0017/BUG-0015/BUG-0016.`
- `artifacts_written=sprints/S0140/qa-findings.md, sprints/S0140/plan-verify.json, sprints/S0140/uat.json, sprints/S0140/uat.md, sprints/S0140/progress.md, docs/engineering/state.md (qa checkpoint append), handoffs/qa_to_verify.md (prepend), handoffs/resume_brief.md (qa PASS prepend → /verify-work)`
- `handoffs/qa_to_dev.md=NOT written` (no blocking findings; AUTO_IMPLEMENTATION_LOOP does not return to /execute)
