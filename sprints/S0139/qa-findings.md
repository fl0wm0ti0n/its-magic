# QA findings — BUG-0019 / S0139 / auto-20260912-bug0019 (qa)

- **phase_id**: qa, **role**: qa, **bug_id**: BUG-0019 (OPEN — not marked DONE per US-0045), **sprint_id**: S0139
- `orchestrator_run_id=auto-20260912-bug0019`, `delivery_mode=ultra_lean`, `macro_phase=build+verify`
- `AUTO_IMPLEMENTATION_LOOP=1` (no blocking findings — do not return to `/execute`)
- `model_id=cursor-grok-4.6` (CROSS_MODEL_REVIEW=1 — required on isolation)
- `producer_phase_id=execute`, `producer_role=dev`, `producer_model_id=cursor-grok-4.6`
- `critic_phase_id=sovereign-critic` (execute review), `critic_model_id=composer-2.5-fast`, `critic_verdict=PASS`, `anti_slop_aggregate=10`, `open_blocking_findings=0`
- `critic_fresh_context_marker=critic-BUG0019-execute-20260912T190000Z-fresh`
- `critic_finding_ids=bug0019exe-challenger-001, bug0019exe-architect-002, bug0019exe-subtractor-003` (informational NBs; not AC failures)
- `cross_reviewer_findings.open_blocking_count=0` (`handoffs/sovereign_critic_findings.jsonl`)

- `fresh_context_marker=qa-BUG0019-qa-20260912T190500Z-fresh` (NEW per US-0048 / BUG-0006; not reused from execute `dev-BUG0019-execute-20260912T184000Z-fresh` or critic `critic-BUG0019-execute-20260912T190000Z-fresh`)
- `timestamp (UTC)=2026-09-12T19:10:00Z`
- **verdict: QA_PASS**
- `plan_verify_verdict=PASS` (ultra_lean deferred — `sprints/S0139/plan-verify.json` SKIPPED placeholder treated as PASS; 7/7 AC surjective in sprint-plan + this remap + primary acceptance row)
- `blocking_count=0`
- `non_blocking_count=3` (execute-critic carry-forwards — informational; not new blockers)
- `story_status=OPEN` (do not mark BUG-0019 DONE; acceptance BUG-0019 unchecked; intake JSON not mutated)
- `acceptance_BUG-0019=NOT ticked`
- `intake_json=NOT mutated`
- `FRAMEWORK_KIT_REPO=1` / OpenCode TUI slash-listing / contract-test slice — no web UI; **no fake browser PASS**
- `SECURITY_REVIEW=0`, `CROSS_REPO_OBSERVABILITY=0`, `COMPONENT_SCOPE_MODE=0`, `USER_GUIDE_MODE=0`, `SPEC_PACK_MODE=0`
- `sibling_done=BUG-0015 DONE; BUG-0016 DONE; BUG-0017 DONE; BUG-0018 DONE` (do not reopen)

## Verdict rationale

Fresh QA independently remapped AC-1..AC-7 against architecture `# BUG-0019` E1/E* (TUI keymap slash listing + retained plugin `editor.add` execute) + `sprints/S0139/sprint.md` / `tasks.md`, treated ultra_lean deferred `plan-verify.json` SKIPPED placeholder as **PASS** (7/7 AC surjective in sprint-plan; this pass overwrote with QA PASS / surjective, mirror S0136), re-ran `python -m pytest tests/bug0019_opencode_auto_slash_listing_test.py tests/bug0018_opencode_auto_ownership_test.py -v` (**13 passed**; bug0019 **7/7**; bug0018 **6/6** compose), confirmed colliding `.opencode/commands/auto.md` **absent** (active + template) while plugin `editor.add({ name: "auto", execute })` → `runAutoLifecycle` **retained**, sibling `its-magic-auto/tui.ts` slash/`slashName` `"auto"`, `index.ts` has **no** `editor.add`, leftover check does **not** delete `auto.md`, and consumed execute proof hash **MATCH** before TTL. Blocking findings: **none**. BUG-0019 remains OPEN; acceptance unchecked; BUG-0018/0017/0015/0016 DONE not reopened. Critic NBs treated as informational.

## Test plan

| # | Check | Expected |
|---|---|---|
| 1 | Independent AC-1..AC-7 remap vs E1/E* + tasks | Each AC ≥1 task; primary acceptance covered |
| 2 | Ultra_lean deferred `sprints/S0139/plan-verify.json` | SKIPPED placeholder → PASS if 7/7 surjective (mirror S0136) |
| 3 | `python -m pytest tests/bug0019_opencode_auto_slash_listing_test.py tests/bug0018_opencode_auto_ownership_test.py -v` | 7+6 PASS |
| 4 | `.opencode/commands/auto.md` + template twin absent | absent / keep surfaces present |
| 5 | Plugin `editor.add` retained; `its-magic-auto/tui.ts` slash auto; `index.ts` no `editor.add` | retained / present / absent |
| 6 | Leftover plugin check does not delete `auto.md` | `leftoverAutoMarkdownExists` existsSync only; no unlink/rmSync |
| 7 | Active↔template listing / orchestrator / tests parity | `--scope=bug-0019` OK; `--scope=bug-0015` OK |
| 8 | Execute DEC-0038 proof consume | MATCH before TTL |
| 9 | Status OPEN; acceptance unchecked; siblings DONE held | unchanged |
| 10 | UAT probes | `contract_tests_primary` PASS; live classes waived |
| 11 | Emit `convergence_smoke` when `contract_test_failed=0` | present, `result=pass` |

## Independent checks (this qa subagent)

| Check | Command / method | Result |
|---|---|---|
| Execute proof SHA-256 | Python hashlib sorted-key compact JSON | **MATCH** `639497519CC0DD4539008DBDF6D0047AD112FDC43AAE99BA51FB0251BAA518C8`; ttl `2026-09-12T19:55:00Z`; consumed_at `2026-09-12T19:10:00Z` — **RUNTIME_PROOF_VALID** |
| BUG-0019 + BUG-0018 contract tests | `python -m pytest tests/bug0019_opencode_auto_slash_listing_test.py tests/bug0018_opencode_auto_ownership_test.py -v` | **13 passed** in 0.15s (**7/7** `test_bug0019_*`; **6/6** `test_bug0018_*`) |
| Parity | `python scripts/check_intake_template_parity.py --repo . --scope=bug-0019` | **[INTAKE_TEMPLATE_PARITY_OK]** |
| Parity compose | `--scope=bug-0015` | **[INTAKE_TEMPLATE_PARITY_OK]** |
| Metadata | `python scripts/check-user-visible-metadata.py --repo .` | **exit 0** |
| UAT probe lib | `python scripts/uat_probe_lib.py --self-test` | **[UAT_PROBE_LIB_SELF_TEST_OK]** |
| Triad hot-surface | `python scripts/enforce-triad-hot-surface.py --check` | pre-write **STATE_ARCHIVE_REQUIRED** (1261/1200, units=17/80); rollover then append (see state.md tuple) |
| Colliding auto.md | path exists? | **absent** active + template |
| Keep surfaces | `.opencode/agents/auto.md`, `.cursor/commands/auto.md` | **present** |
| Remaining markdown commands | `.opencode/commands/*.md` | **14** (no `auto.md`) |
| Plugin attach | `command.transform` + `editor.add` `name: "auto"` + `runAutoLifecycle` | **retained** |
| TUI listing | `.opencode/plugins/its-magic-auto/tui.ts` `slash`/`slashName` `"auto"` | **present** (active + template) |
| Listing index | `its-magic-auto/index.ts` `editor.add` | **absent** |
| Leftover defense | `leftoverAutoMarkdownExists` + `OPENCODE_AUTO_MARKDOWN_COLLISION` | **present**; leftover fn has **no** `unlink`/`rmSync` (existsSync only) |
| Listing/dispatch tokens | `OPENCODE_AUTO_SLASH_LISTING_UNSUPPORTED` + `OPENCODE_AUTO_TUI_DISPATCH_UNSUPPORTED` | **present** (orchestrator REASON_CODES + tui.ts) |
| No `cli.json` | `.opencode/plugins/its-magic-auto/cli.json` | **absent** (active + template) |
| No JSON `commands.auto` template | repo JSON/JSONC search | **absent** |
| Backlog / acceptance | Status + checkbox spot-check | OPEN; acceptance `- [ ] BUG-0019` |
| LINT_COMMAND / TYPECHECK_COMMAND | blank in runbook | **skipped** |
| Full harness `tests/run-tests.ps1` | not re-run this pass | **not claimed** — scoped slice + compose are the required gates |

## Blocking findings

None.

## Non-blocking findings (critic NB carry-forwards — informational)

| ID | Topic | QA note |
|---|---|---|
| NB1 / bug0019exe-challenger-001 | proof MATCH + surfaces spot-check | Independently re-verified 7/7 + 6/6, auto.md absent, no JSON `commands.auto`. Does **not** fail any AC. |
| NB2 / bug0019exe-architect-002 | qa owns plan-verify + AC remap | This pass overwrote SKIPPED placeholder with PASS `plan-verify.json` and remapped AC-1..AC-7. Execute E1/E* surfaces held. Not blocking. |
| NB3 / bug0019exe-subtractor-003 | no DONE / no companion DEC / no auto.md restore / no live TUI probe | Held this pass. Not blocking. |

## AC remap (independent — files + tests vs E1/E*)

| AC | Delivered surface | Task(s) / markers | Result |
|---|---|---|---|
| AC-1 Operator can select `/auto` in OpenCode list | TUI keymap `slash`/`slashName` `"auto"` in `its-magic-auto/tui.ts` | T-001, T-005 (m4) | **PASS** |
| AC-2 Invocation starts `runAutoLifecycle` or documented `OPENCODE_*` | TUI `run()` → client/RPC; `OPENCODE_AUTO_TUI_DISPATCH_UNSUPPORTED` | T-003, T-004, T-005 (m5) | **PASS** |
| AC-3 Must not restore STOP-only `auto.md`; peers remain listed | active+template `.opencode/commands/auto.md` absent; 14 peer `.md` remain | T-002, T-005 (m1), T-anch | **PASS** |
| AC-4 Must not JSON-template `/auto` | no OpenCode JSON `commands.auto` + `template` | T-002, T-005 (m3) | **PASS** |
| AC-5 Plugin `editor.add` execute retained | orchestrator `editor.add({ name: "auto", execute })` → `runAutoLifecycle`; `index.ts` does **not** `editor.add` | T-002, T-005 (m2) | **PASS** |
| AC-6 Fail-closed listing token (not silent miss) | `OPENCODE_AUTO_SLASH_LISTING_UNSUPPORTED` in REASON_CODES + tui.ts | T-001, T-004, T-005 (m4) | **PASS** |
| AC-7 Upgrade copies listing + still prunes `auto.md`; active↔template parity | copy listing helper + targeted prune; `--scope=bug-0019` OK | T-006, T-007, T-005 (m6, m7) | **PASS** |

**Overall AC gate**: **PASS** (slice) — Status remains OPEN; backlog/acceptance checkboxes **not** ticked (US-0045; `/verify-work` / closure ownership).

## Contract marker results (7/7 slice + 6/6 compose)

| # | Marker | Result |
|---|---|---|
| 1 | `test_bug0019_no_restored_opencode_auto_md` | PASS |
| 2 | `test_bug0019_plugin_editor_add_auto_execute_retained` | PASS |
| 3 | `test_bug0019_no_json_commands_auto_template` | PASS |
| 4 | `test_bug0019_tui_slash_auto_listing_surface` | PASS |
| 5 | `test_bug0019_tui_run_dispatches_lifecycle_not_template` | PASS |
| 6 | `test_bug0019_active_template_listing_parity` | PASS |
| 7 | `test_bug0019_upgrade_copies_listing_surface` | PASS |
| compose 1 | `test_bug0018_no_colliding_opencode_auto_md` | PASS |
| compose 2 | `test_bug0018_plugin_editor_add_auto_execute` | PASS |
| compose 3 | `test_bug0018_active_template_opencode_auto_ownership_parity` | PASS |
| compose 4 | `test_bug0018_upgrade_prunes_consumer_auto_md` | PASS |
| compose 5 | `test_bug0018_compose_bug0015_attach_api_unchanged` | PASS |
| compose 6 | `test_bug0018_markdown_collision_reason_code_stub` | PASS |

## Compose / scope gates

| Gate | Result |
|---|---|
| BUG-0018 A* plugin-only execute + `auto.md` absent | HELD (6/6 compose) |
| DEC-0124 / DEC-0125 bodies UNCHANGED | HELD (not rewritten this phase) |
| `# BUG-0018` historical body / R-0120 body | HELD |
| `# BUG-0019` / R-0124 not rewritten this phase | HELD |
| BUG-0015 / BUG-0016 / BUG-0017 / BUG-0018 DONE | HELD (not reopened) |
| US-0045 Status OPEN / acceptance unchecked | HELD |
| Cursor `.cursor/commands/auto.md` / `.opencode/agents/auto.md` untouched keep | HELD |
| No `cli.json` / `tui.json` kit default | HELD |
| `index.ts` does not `editor.add` | HELD |
| Plugin leftover check does not delete leftover `auto.md` | HELD |
| No companion DEC-0135 | HELD |
| No live OpenCode TUI CI probe | HELD |
| Exactly 7 `test_bug0019_*` markers; `test_bug0018_*` not weakened | HELD |
| No `.env` read / no intake JSON mutation | HELD |

## UAT / convergence (US-0128)

- Contract slice green (`contract_test_failed=0`); pytest 13/13; `auto.md` absent; plugin attach retained; TUI slash listing present.
- Canonical `convergence_smoke` recorded as **pass** in `sprints/S0139/uat.json`.
- Six live-runtime probe classes waived `UAT_PROBE_FORBIDDEN` (FRAMEWORK_KIT_REPO=1; no live OpenCode TUI probe; not `browser_smoke`).
- Ultra_lean: QA merged AC checklist into `uat.json` / this file; operator UAT ticks and DONE remain `/verify-work` / closure ownership.
- Full UAT ownership remains with `/verify-work` (do not flip DONE / tick ACs here).

## UAT probes (FRAMEWORK_KIT_REPO=1 — honest classification)

Applicable probe class: **`contract_tests_primary`** (7 markers + bug0018 compose). No web UI. No fake browser PASS. Live-runtime / live OpenCode TUI probes **not attempted** (`UAT_PROBE_FORBIDDEN` if attempted). Static/fixture only. No `.env`.

Canonical surrogate step **`convergence_smoke`** emitted this pass (`result=pass`) because `contract_test_failed=0`.

| Probe class | Classification | reason_code |
|---|---|---|
| `browser_smoke` | waived / not applicable | `UAT_PROBE_FORBIDDEN` |
| `api_health` | waived / not applicable | `UAT_PROBE_FORBIDDEN` |
| `process_health` | waived / not applicable | `UAT_PROBE_FORBIDDEN` |
| `cli_smoke` | not applicable (no live OpenCode CI probe) | `UAT_PROBE_FORBIDDEN` |
| `build` | not applicable | `UAT_PROBE_FORBIDDEN` |
| `manual_operator` | deferred to verify-work / operator OpenCode host | `UAT_PROBE_FORBIDDEN` |

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
- `runtime_evidence_refs`: pytest 13/13 (bug0019 7/7; bug0018 6/6); auto.md absent; plugin attach retained; TUI slash auto; `sprints/S0139/uat.json` `convergence_smoke`

## Generated-test evidence (US-0066)

- `generated_test_stack_profile`: python
- `generated_test_command`: `python -m pytest tests/bug0019_opencode_auto_slash_listing_test.py tests/bug0018_opencode_auto_ownership_test.py -v`
- `generated_test_result`: pass
- `generated_test_output_ref`: this file § Independent checks (13 passed in 0.15s)
- `generated_test_paths_ref`: `tests/bug0019_opencode_auto_slash_listing_test.py`
- `generated_test_reason_code`: none (pass)

## Status confirmation (US-0045)

- backlog `### BUG-0019` Status: **OPEN**
- acceptance BUG-0019: **unchecked** (`- [ ] BUG-0019`)
- BUG-0015 / BUG-0016 / BUG-0017 / BUG-0018: **DONE** (not reopened)
- intake JSON not mutated this phase
- architecture.md `# BUG-0019` not mutated this phase
- R-0124 body not mutated this phase

## Producer proof consumed (execute)

- `producer_runtime_proof_id=rp-auto-20260912-bug0019-execute-dev-20260912T185500Z-BUG-0019`
- Canonical payload independently hashed: `{"delivery_mode":"ultra_lean","macro_phase":"build+verify","model_id":"cursor-grok-4.6","orchestrator_run_id":"auto-20260912-bug0019","phase_id":"execute","proof_issued_at":"2026-09-12T18:55:00Z","proof_ttl_seconds":3600,"role":"dev","runtime_proof_id":"rp-auto-20260912-bug0019-execute-dev-20260912T185500Z-BUG-0019","sprint_id":"S0139","story_id":"BUG-0019"}`
- `producer_attested_proof_hash=639497519CC0DD4539008DBDF6D0047AD112FDC43AAE99BA51FB0251BAA518C8`
- Independent SHA-256 recompute: **MATCH**
- `producer_proof_ttl=2026-09-12T19:55:00Z`, `consumed_at=2026-09-12T19:10:00Z` (before RUNTIME_PROOF_STALE)
- `producer_ttl_stale=false`
- `producer_fresh_context_marker=dev-BUG0019-execute-20260912T184000Z-fresh`
- Critic consume of same tuple at 2026-09-12T19:00:00Z recorded; this qa consume is independent MATCH-before-TTL

## Strict runtime proof (DEC-0038) — qa

- `orchestrator_run_id=auto-20260912-bug0019`
- `runtime_proof_id=rp-auto-20260912-bug0019-qa-qa-20260912T191000Z-BUG-0019` (NEW unique — distinct from execute / sprint-plan)
- `phase_id=qa`, `role=qa`, `story_id=BUG-0019`, `sprint_id=S0139`
- `delivery_mode=ultra_lean`, `macro_phase=build+verify`, `model_id=cursor-grok-4.6`
- `proof_issued_at=2026-09-12T19:10:00Z`
- `proof_ttl_seconds=3600`, `proof_ttl=2026-09-12T20:10:00Z` (UTC = issued_at + 3600s)
- `proof_hash=13C82F7DAFBFC808CFF62D7AFF9669B29D7111B48834799DDB05E84D2E2A6AA7` (SHA-256 of sorted-key compact lowercase-keys JSON payload, UTF-8 bytes via Python hashlib)
- Canonical payload: `{"delivery_mode":"ultra_lean","macro_phase":"build+verify","model_id":"cursor-grok-4.6","orchestrator_run_id":"auto-20260912-bug0019","phase_id":"qa","proof_issued_at":"2026-09-12T19:10:00Z","proof_ttl_seconds":3600,"role":"qa","runtime_proof_id":"rp-auto-20260912-bug0019-qa-qa-20260912T191000Z-BUG-0019","sprint_id":"S0139","story_id":"BUG-0019"}`

## Strict runtime proof (DEC-0038) — plan-verify (ultra_lean merged)

- `runtime_proof_id=rp-auto-20260912-bug0019-plan-verify-qa-20260912T191000Z-BUG-0019`
- `phase_id=plan-verify`, `role=qa`
- `proof_issued_at=2026-09-12T19:10:00Z`, `proof_ttl=2026-09-12T20:10:00Z`
- `proof_hash=44773F439FD6A29D5BA0B9AE8D3DF87701720AA6D1241EB953645751D217DEEC`
- Canonical payload: `{"delivery_mode":"ultra_lean","macro_phase":"build+verify","model_id":"cursor-grok-4.6","orchestrator_run_id":"auto-20260912-bug0019","phase_id":"plan-verify","proof_issued_at":"2026-09-12T19:10:00Z","proof_ttl_seconds":3600,"role":"qa","runtime_proof_id":"rp-auto-20260912-bug0019-plan-verify-qa-20260912T191000Z-BUG-0019","sprint_id":"S0139","story_id":"BUG-0019"}`

## Isolation evidence (US-0048 / DEC-0029 / US-0104 v2)

- `phase_id=qa`, `role=qa`, `model_id=cursor-grok-4.6` (CROSS_MODEL_REVIEW=1 — required)
- `fresh_context_marker=qa-BUG0019-qa-20260912T190500Z-fresh` (NEW per US-0048 / BUG-0006)
- `timestamp=2026-09-12T19:10:00Z` (UTC)
- `evidence_ref=sprints/S0139/qa-findings.md; sprints/S0139/plan-verify.json; sprints/S0139/uat.json; sprints/S0139/uat.md`
- Fresh qa subagent per BUG-0006 / US-0048 isolation; no prior chat history carried forward. Context limited to narrow-read (US-0053). No `.env` reads, no credentials access, no intake-evidence mutation, no backlog Status/AC mutation (qa_notes append only), no acceptance.md mutation, no architecture.md mutation, no DONE-row mutation, no `/execute` or `/verify-work` spawn from this subagent.

## Next scheduled phase

- `next_scheduled_phase=/verify-work` (role=qa per US-0069 / DEC-0051; fresh qa subagent per BUG-0006 — orchestrator-owned spawn; after sovereign-critic of qa if CROSS_MODEL_REVIEW=1)
- `next_scheduled_role=qa`
- `stop_condition=STOP after qa PASS. Orchestrator spawns sovereign-critic of qa (CROSS_MODEL_REVIEW=1), then /verify-work in a fresh qa subagent (BUG-0006). Do NOT spawn /verify-work or /execute from this subagent. Do NOT mark BUG-0019 DONE. Do NOT tick acceptance. Do NOT mutate intake JSON. Do NOT mutate architecture.md. Do NOT reopen BUG-0018/BUG-0017/BUG-0015/BUG-0016.`
- `artifacts_written=sprints/S0139/qa-findings.md, sprints/S0139/plan-verify.json, sprints/S0139/uat.json, sprints/S0139/uat.md, sprints/S0139/progress.md, docs/engineering/state.md (qa checkpoint append), handoffs/qa_to_verify.md (prepend), handoffs/resume_brief.md (qa PASS prepend → /verify-work)`
- `handoffs/qa_to_dev.md=NOT written` (no blocking findings; AUTO_IMPLEMENTATION_LOOP does not return to /execute)
