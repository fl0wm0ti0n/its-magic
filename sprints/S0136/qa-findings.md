# QA findings — BUG-0018 / S0136 / auto-20260912-bug0018 (qa)

- **phase_id**: qa, **role**: qa, **bug_id**: BUG-0018 (OPEN — not marked DONE per US-0045), **sprint_id**: S0136
- `orchestrator_run_id=auto-20260912-bug0018`, `delivery_mode=ultra_lean`, `macro_phase=build+verify`
- `AUTO_IMPLEMENTATION_LOOP=1` (no blocking findings — do not return to `/execute`)
- `model_id=cursor-grok-4.6` (CROSS_MODEL_REVIEW=1 — required on isolation)
- `producer_phase_id=execute`, `producer_role=dev`, `producer_model_id=cursor-grok-4.6`
- `critic_phase_id=sovereign-critic` (execute review), `critic_model_id=composer-2.5-fast`, `critic_verdict=PASS`, `anti_slop_aggregate=10`, `open_blocking_findings=0`
- `critic_fresh_context_marker=critic-BUG0018-execute-20260912T103000Z-fresh`
- `critic_finding_ids=bug0018ex-challenger-001, bug0018ex-architect-002, bug0018ex-subtractor-003` (informational NBs; not AC failures)
- `cross_reviewer_findings.open_blocking_count=0` (`handoffs/sovereign_critic_findings.jsonl`)

- `fresh_context_marker=qa-BUG0018-qa-20260912T103500Z-fresh` (NEW per US-0048 / BUG-0006; not reused from execute `dev-BUG0018-execute-20260912T102000Z-fresh` or critic `critic-BUG0018-execute-20260912T103000Z-fresh`)
- `timestamp (UTC)=2026-09-12T10:35:00Z`
- **verdict: QA_PASS**
- `plan_verify_verdict=PASS` (ultra_lean deferred — `sprints/S0136/plan-verify.json`; AC surjective 7/7 + primary acceptance row)
- `blocking_count=0`
- `non_blocking_count=3` (execute-critic carry-forwards — informational; not new blockers)
- `story_status=OPEN` (do not mark BUG-0018 DONE; acceptance BUG-0018 unchecked; intake JSON not mutated)
- `acceptance_BUG-0018=NOT ticked`
- `intake_json=NOT mutated`
- `FRAMEWORK_KIT_REPO=1` / OpenCode plugin-only `/auto` / contract-test slice — no web UI; **no fake browser PASS**
- `SECURITY_REVIEW=0`, `CROSS_REPO_OBSERVABILITY=0`, `COMPONENT_SCOPE_MODE=0`, `USER_GUIDE_MODE=0`, `SPEC_PACK_MODE=0`
- `sibling_done=BUG-0015 DONE; BUG-0016 DONE; BUG-0017 DONE` (do not reopen)

## Verdict rationale

Fresh QA independently remapped AC-1..AC-7 against architecture `# BUG-0018` A* (plugin-only `/auto`) + `tasks.md`, created deferred `plan-verify.json` (PASS / surjective), re-ran `pytest tests/bug0018*.py tests/us0125_contract_test.py tests/bug0015_contract_test.py tests/bug0017_opencode_eol_test.py -v` (**30/30 PASS**; bug0018 **6/6**), confirmed colliding `auto.md` **absent** (active + template) while plugin `editor.add({ name: "auto", execute })` → `runAutoLifecycle` **retained**, and consumed execute proof hash **MATCH** before TTL. Blocking findings: **none**. BUG-0018 remains OPEN; acceptance unchecked; BUG-0015/0016/0017 DONE not reopened. Critic NBs (leftover unlink / plan-verify ownership / no DONE) treated as informational.

## Test plan

| # | Check | Expected |
|---|---|---|
| 1 | Independent AC-1..AC-7 remap vs A* + tasks | Each AC ≥1 task; primary acceptance covered |
| 2 | Create `sprints/S0136/plan-verify.json` (ultra_lean deferred) | PASS / surjective 7/7 |
| 3 | `python -m pytest tests/bug0018*.py -v` | 6/6 PASS |
| 4 | Compose: us0125 + bug0015 if-present + bug0017 plant `intake.md` | 24/24 additional PASS (30/30 suite) |
| 5 | Spot-check colliding `auto.md` deleted; keep surfaces present | absent / agents+cursor present |
| 6 | Plugin `editor.add` auto execute retained; leftover check does not delete | present / no unlink in leftover fn |
| 7 | Active↔template plugin / runbook / tests parity | byte-identical |
| 8 | Execute DEC-0038 proof consume | MATCH before TTL |
| 9 | Status OPEN; acceptance unchecked; siblings DONE held | unchanged |
| 10 | UAT probes | `contract_tests_primary` PASS; live classes waived |
| 11 | Emit `convergence_smoke` when `contract_test_failed=0` | present, `result=pass` |

## Independent checks (this qa subagent)

| Check | Command / method | Result |
|---|---|---|
| Execute proof SHA-256 | Python hashlib sorted-key compact JSON | **MATCH** `1BFC71170240A01546AB58966CDB431CA1802A96BBD6D91D559C1869535B6A82`; ttl `2026-09-12T11:20:00Z`; consumed_at `2026-09-12T10:35:00Z` — **RUNTIME_PROOF_VALID** |
| BUG-0018 contract tests | `python -m pytest tests/bug0018_opencode_auto_ownership_test.py -v` | **6 passed** (suite 30 passed in 1.42s) |
| Compose gates | us0125 11 + bug0015 7 + bug0017 6 | **24 passed** (inventory 14; if-present dispatch-only; plant `intake.md`) |
| Parity | `python scripts/check_intake_template_parity.py --repo . --scope=bug-0015` | **[INTAKE_TEMPLATE_PARITY_OK]** |
| Metadata | `python scripts/check-user-visible-metadata.py --repo .` | **exit 0** |
| UAT probe lib | `python scripts/uat_probe_lib.py --self-test` | **[UAT_PROBE_LIB_SELF_TEST_OK]** |
| Triad hot-surface | `python scripts/enforce-triad-hot-surface.py --check` | **exit 0** (pre-write) |
| Colliding auto.md | path exists? | **absent** active + template |
| Keep surfaces | `.opencode/agents/auto.md`, `.cursor/commands/auto.md` | **present** |
| Remaining markdown commands | `.opencode/commands/*.md` | **14** (12 lifecycle + `quick` + `ask`; no `auto.md`) |
| Plugin attach | `command.transform` + `editor.add` `name: "auto"` + `runAutoLifecycle` | **retained** |
| Leftover defense | `leftoverAutoMarkdownExists` + `OPENCODE_AUTO_MARKDOWN_COLLISION` | **present**; leftover fn has **no** `unlink`/`rmSync` |
| Template byte pairs | `filecmp` plugin / runbook / tests | **3/3 IDENTICAL** |
| Backlog / acceptance | Status + checkbox spot-check | OPEN; acceptance `- [ ] BUG-0018` |
| LINT_COMMAND / TYPECHECK_COMMAND | blank in runbook | **skipped** |
| Full harness `tests/run-tests.ps1` | not re-run this pass | **not claimed** — scoped slice + compose are the required gates |

## Blocking findings

None.

## Non-blocking findings (critic NB carry-forwards — informational)

| ID | Topic | QA note |
|---|---|---|
| NB1 / bug0018ex-challenger-001 | leftover consumer `auto.md` / unlink-fail | Runbook DQ8 + `OPENCODE_AUTO_MARKDOWN_COLLISION` cover operator delete then re-upgrade. Marker 4 prune fixture PASS. Does **not** fail AC-4/AC-5. |
| NB2 / bug0018ex-architect-002 | qa owns plan-verify + AC remap | This pass created `plan-verify.json` and remapped AC-1..AC-7. Execute compose/parity held. Not blocking. |
| NB3 / bug0018ex-subtractor-003 | no DONE / no companion DEC / no live OpenCode probe | Held this pass. Not blocking. |

## AC remap (independent — files + tests vs A*)

| AC | Delivered surface | Task(s) / markers | Result |
|---|---|---|---|
| AC-1 `/auto` invokes plugin execute → `runAutoLifecycle` (or documented `OPENCODE_*`) | colliding `auto.md` deleted; plugin `editor.add` retained | T-001, T-002, T-005 (m1, m2) | **PASS** |
| AC-2 Markdown not sole runtime owner | active+template `.opencode/commands/auto.md` absent; keep surfaces present | T-001, T-004, T-005 (m1) | **PASS** |
| AC-3 Slash listing preserved | plugin `name: "auto"` + spawn-only description | T-002, T-005 (m2) | **PASS** |
| AC-4 Consumer upgrade prunes leftover `auto.md` | `prune_retired_opencode_auto_md` / sh / ps1; fixture prune | T-003, T-005 (m4), T-006 | **PASS** |
| AC-5 No silent STOP | `OPENCODE_AUTO_MARKDOWN_COLLISION` plugin + runbook stub; leftover check does not delete | T-002, T-003, T-005 (m6), T-006 | **PASS** |
| AC-6 Active ↔ template parity | plugin / runbook / tests IDENTICAL; `--scope=bug-0015` OK | T-001, T-002, T-004, T-005 (m3), T-007 | **PASS** |
| AC-7 Compose BUG-0015 attach unchanged | marker 5 + us0125/bug0015/bug0017 compose green | T-002, T-004, T-005 (m5) | **PASS** |

**Overall AC gate**: **PASS** (slice) — Status remains OPEN; backlog/acceptance checkboxes **not** ticked (US-0045; `/verify-work` / closure ownership).

## Contract marker results (6/6 slice)

| # | Marker | Result |
|---|---|---|
| 1 | `test_bug0018_no_colliding_opencode_auto_md` | PASS |
| 2 | `test_bug0018_plugin_editor_add_auto_execute` | PASS |
| 3 | `test_bug0018_active_template_opencode_auto_ownership_parity` | PASS |
| 4 | `test_bug0018_upgrade_prunes_consumer_auto_md` | PASS |
| 5 | `test_bug0018_compose_bug0015_attach_api_unchanged` | PASS |
| 6 | `test_bug0018_markdown_collision_reason_code_stub` | PASS |

## Template byte-identity (BUG-0018 pairs)

| Pair | Result |
|---|---|
| `.opencode/plugins/orchestrator.ts` | IDENTICAL |
| `docs/engineering/runbook.md` | IDENTICAL |
| `tests/bug0018_opencode_auto_ownership_test.py` | IDENTICAL |

## Compose / scope gates

| Gate | Result |
|---|---|
| US-0125 inventory 14 (no markdown `auto`) + if-present dispatch-only | HELD |
| BUG-0015 if-present `auto.md` + attach API unchanged | HELD |
| BUG-0017 plant path `intake.md` (CR-reject AC unchanged) | HELD |
| DEC-0124 / DEC-0125 bodies UNCHANGED | HELD (not rewritten this phase) |
| `# BUG-0015` CF1 historical cell not rewritten | HELD |
| BUG-0015 / BUG-0016 / BUG-0017 DONE | HELD (not reopened) |
| US-0045 Status OPEN / acceptance unchecked | HELD |
| Cursor `.cursor/commands/auto.md` / `.opencode/agents/auto.md` untouched keep | HELD |
| No general template-absent sweeper | HELD |
| Plugin does not delete leftover `auto.md` | HELD |
| No companion DEC | HELD |
| No live OpenCode CI probe | HELD |
| Exactly 6 `test_bug0018_*` markers | HELD |
| No `.env` read / no intake JSON mutation | HELD |

## UAT / convergence (US-0128)

- Contract slice green (`contract_test_failed=0`); compose 30/30; colliding `auto.md` absent; plugin attach retained.
- Canonical `convergence_smoke` recorded as **pass** in `sprints/S0136/uat.json`.
- Six live-runtime probe classes waived `UAT_PROBE_FORBIDDEN` (FRAMEWORK_KIT_REPO=1; no live OpenCode probe; not `browser_smoke`).
- Ultra_lean: QA merged AC checklist into `uat.json` / this file; operator UAT ticks and DONE remain `/verify-work` / closure ownership.
- Full UAT ownership remains with `/verify-work` (do not flip DONE / tick ACs here).

## UAT probes (FRAMEWORK_KIT_REPO=1 — honest classification)

Applicable probe class: **`contract_tests_primary`** (6 markers + compose). No web UI. No fake browser PASS. Live-runtime / live OpenCode probes **not attempted** (`UAT_PROBE_FORBIDDEN` if attempted). Static/fixture only. No `.env`.

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
- `runtime_evidence_refs`: pytest 30/30 (bug0018 6/6); auto.md absent; plugin attach retained; `sprints/S0136/uat.json` `convergence_smoke`

## Generated-test evidence (US-0066)

- `generated_test_stack_profile`: python
- `generated_test_command`: `python -m pytest tests/bug0018_opencode_auto_ownership_test.py tests/us0125_contract_test.py tests/bug0015_contract_test.py tests/bug0017_opencode_eol_test.py -v`
- `generated_test_result`: pass
- `generated_test_output_ref`: this file § Independent checks (30 passed in 1.42s)
- `generated_test_paths_ref`: `tests/bug0018_opencode_auto_ownership_test.py`
- `generated_test_reason_code`: none (pass)

## Status confirmation (US-0045)

- backlog `### BUG-0018` Status: **OPEN**
- acceptance BUG-0018: **unchecked** (`- [ ] BUG-0018`)
- BUG-0015 / BUG-0016 / BUG-0017: **DONE** (not reopened)
- intake JSON not mutated this phase
- architecture.md `# BUG-0018` not mutated this phase
- R-0120 body not mutated this phase

## Producer proof consumed (execute)

- `producer_runtime_proof_id=rp-auto-20260912-bug0018-execute-dev-20260912T102000Z-BUG-0018`
- Canonical payload independently hashed: `{"delivery_mode":"ultra_lean","macro_phase":"build+verify","model_id":"cursor-grok-4.6","orchestrator_run_id":"auto-20260912-bug0018","phase_id":"execute","proof_issued_at":"2026-09-12T10:20:00Z","proof_ttl_seconds":3600,"role":"dev","runtime_proof_id":"rp-auto-20260912-bug0018-execute-dev-20260912T102000Z-BUG-0018","sprint_id":"S0136","story_id":"BUG-0018"}`
- `producer_attested_proof_hash=1BFC71170240A01546AB58966CDB431CA1802A96BBD6D91D559C1869535B6A82`
- Independent SHA-256 recompute: **MATCH**
- `producer_proof_ttl=2026-09-12T11:20:00Z`, `consumed_at=2026-09-12T10:35:00Z` (before RUNTIME_PROOF_STALE)
- `producer_ttl_stale=false`
- `producer_fresh_context_marker=dev-BUG0018-execute-20260912T102000Z-fresh`
- Critic consume of same tuple at 2026-09-12T10:30:00Z recorded; this qa consume is independent MATCH-before-TTL

## Strict runtime proof (DEC-0038) — qa

- `orchestrator_run_id=auto-20260912-bug0018`
- `runtime_proof_id=rp-auto-20260912-bug0018-qa-qa-20260912T103500Z-BUG-0018` (NEW unique — distinct from execute / sprint-plan)
- `phase_id=qa`, `role=qa`, `story_id=BUG-0018`, `sprint_id=S0136`
- `delivery_mode=ultra_lean`, `macro_phase=build+verify`, `model_id=cursor-grok-4.6`
- `proof_issued_at=2026-09-12T10:35:00Z`
- `proof_ttl_seconds=3600`, `proof_ttl=2026-09-12T11:35:00Z` (UTC = issued_at + 3600s)
- `proof_hash=23372F67B489CE60161626AA2A9E0EEFC028DF7C58DAED1E27D6A8A2C4E43E5F` (SHA-256 of sorted-key compact lowercase-keys JSON payload, UTF-8 bytes via Python hashlib)
- Canonical payload: `{"delivery_mode":"ultra_lean","macro_phase":"build+verify","model_id":"cursor-grok-4.6","orchestrator_run_id":"auto-20260912-bug0018","phase_id":"qa","proof_issued_at":"2026-09-12T10:35:00Z","proof_ttl_seconds":3600,"role":"qa","runtime_proof_id":"rp-auto-20260912-bug0018-qa-qa-20260912T103500Z-BUG-0018","sprint_id":"S0136","story_id":"BUG-0018"}`

## Strict runtime proof (DEC-0038) — plan-verify (ultra_lean merged)

- `runtime_proof_id=rp-auto-20260912-bug0018-plan-verify-qa-20260912T103500Z-BUG-0018`
- `phase_id=plan-verify`, `role=qa`
- `proof_issued_at=2026-09-12T10:35:00Z`, `proof_ttl=2026-09-12T11:35:00Z`
- `proof_hash=6BCD9FD84F7F612467E00F8CB69F3BD6CCB9EB33DB5B514B7BA3A90A4B3A89CB`
- Canonical payload: `{"delivery_mode":"ultra_lean","macro_phase":"build+verify","model_id":"cursor-grok-4.6","orchestrator_run_id":"auto-20260912-bug0018","phase_id":"plan-verify","proof_issued_at":"2026-09-12T10:35:00Z","proof_ttl_seconds":3600,"role":"qa","runtime_proof_id":"rp-auto-20260912-bug0018-plan-verify-qa-20260912T103500Z-BUG-0018","sprint_id":"S0136","story_id":"BUG-0018"}`

## Isolation evidence (US-0048 / DEC-0029 / US-0104 v2)

- `phase_id=qa`, `role=qa`, `model_id=cursor-grok-4.6` (CROSS_MODEL_REVIEW=1 — required)
- `fresh_context_marker=qa-BUG0018-qa-20260912T103500Z-fresh` (NEW per US-0048 / BUG-0006)
- `timestamp=2026-09-12T10:35:00Z` (UTC)
- `evidence_ref=sprints/S0136/qa-findings.md; sprints/S0136/plan-verify.json; sprints/S0136/uat.json; sprints/S0136/uat.md`
- Fresh qa subagent per BUG-0006 / US-0048 isolation; no prior chat history carried forward. Context limited to narrow-read (US-0053). No `.env` reads, no credentials access, no intake-evidence mutation, no backlog Status/AC mutation (qa_notes append only), no acceptance.md mutation, no architecture.md mutation, no DONE-row mutation, no `/execute` or `/verify-work` spawn from this subagent.

## Next scheduled phase

- `next_scheduled_phase=/verify-work` (role=qa per US-0069 / DEC-0051; fresh qa subagent per BUG-0006 — orchestrator-owned spawn; after sovereign-critic of qa if CROSS_MODEL_REVIEW=1)
- `next_scheduled_role=qa`
- `stop_condition=STOP after qa PASS. Orchestrator spawns sovereign-critic of qa (CROSS_MODEL_REVIEW=1), then /verify-work in a fresh qa subagent (BUG-0006). Do NOT spawn /verify-work or /execute from this subagent. Do NOT mark BUG-0018 DONE. Do NOT tick acceptance. Do NOT mutate intake JSON. Do NOT mutate architecture.md. Do NOT reopen BUG-0015/BUG-0016/BUG-0017.`
- `artifacts_written=sprints/S0136/qa-findings.md, sprints/S0136/plan-verify.json, sprints/S0136/uat.json, sprints/S0136/uat.md, sprints/S0136/progress.md, docs/engineering/state.md (qa checkpoint append), handoffs/qa_to_verify.md (prepend), handoffs/resume_brief.md (qa PASS prepend → /verify-work)`
- `handoffs/qa_to_dev.md=NOT written` (no blocking findings; AUTO_IMPLEMENTATION_LOOP does not return to /execute)
