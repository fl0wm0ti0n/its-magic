# QA findings — BUG-0021 / S0146 / auto-20260913-bug0021 (qa parity-reconfirm)

- **phase_id**: qa, **role**: qa, **bug_id**: BUG-0021 (OPEN — not marked DONE per US-0045), **sprint_id**: S0146
- `orchestrator_run_id=auto-20260913-bug0021`, `parent_orchestrator_run_id=cursor-20260913-BUG0021-intake`, `delivery_mode=ultra_lean`, `macro_phase=build+verify`
- `AUTO_IMPLEMENTATION_LOOP=1` (no blocking findings — do not return to `/execute`)
- `AUTO_QUIET=1`
- `FRAMEWORK_KIT_REPO=1`
- `SECURITY_REVIEW=0`
- `model_id=cursor-grok-4.6-high` (CROSS_MODEL_REVIEW=1 — required on isolation; catalog `roles.qa` hit)
- `producer_phase_id=execute` (parity rework), `producer_role=dev`, `producer_model_id=cursor-grok-4.6-high`
- `critic_phase_id=sovereign-critic` (execute parity rework review), `critic_model_id=composer-2.5`, `critic_verdict=PASS`, `anti_slop_aggregate=10`, `open_blocking_findings=0`, `degraded_mode=false`
- `critic_fresh_context_marker=tl-BUG0021-critic-execute-parity-20260913T143500Z-fresh`
- `critic_finding_ids=bug0021expr-challenger-001, bug0021expr-architect-002, bug0021expr-subtractor-003` (informational NBs; not AC failures)
- `cross_reviewer_findings.open_blocking_count=0` (`handoffs/sovereign_critic_findings.jsonl`)
- `rework_trigger`: orchestrator pytest after release critic was 25/29 (active↔template `runbook.md` inequality). Execute copied active → template. This QA reconfirms the four compose files after that rework.

- `fresh_context_marker=qa-BUG0021-qa-parity-20260913T144000Z-fresh` (NEW per US-0048 / BUG-0006; **not** reused from `qa-BUG0021-qa-20260913T131000Z-fresh`, execute `dev-BUG0021-execute-parity-20260913T143000Z-fresh`, or critic `tl-BUG0021-critic-execute-parity-20260913T143500Z-fresh`)
- `timestamp (UTC)=2026-09-13T14:40:00Z` (orchestrator-specified)
- **verdict: QA_PASS**
- `plan_verify_verdict=PASS` (prior ultra_lean overwrite held; 10/10 AC surjective; AC-1..AC-10 remain ticked; not re-ticked)
- `blocking_count=0`
- `non_blocking_count=3` (execute-parity-critic carry-forwards — informational) plus honest operator NB: no live OpenCode CLI TUI listing/invoke this pass
- `story_status=OPEN` (do not mark BUG-0021 DONE; intake JSON not mutated)
- `acceptance_BUG-0021=NOT ticked` (`docs/product/acceptance.md` row remains `- [ ] BUG-0021`)
- `backlog_ACs=remain ticked` (AC-1..AC-10; Status remains OPEN)
- `intake_json=NOT mutated`
- `FRAMEWORK_KIT_REPO=1` / OpenCode CLI TUI plugin-load / keymap / rpc contract-test slice — no web UI; **no fake browser PASS**; **no live OpenCode CLI TUI PASS**
- `SECURITY_REVIEW=0`, `CROSS_REPO_OBSERVABILITY=0`, `COMPONENT_SCOPE_MODE=0`, `USER_GUIDE_MODE=0`, `SPEC_PACK_MODE=0`
- `sibling_done=BUG-0015 DONE; BUG-0016 DONE; BUG-0017 DONE; BUG-0018 DONE; BUG-0019 DONE; BUG-0020 DONE` (do not reopen)
- `sibling_open_held=BUG-0022 OPEN not mutated; US-0139 / S0145 not mutated; US-0140 OPEN not mutated except shared runbook pair now byte-identical`
- `release_already=PASS` (hashfix 64-hex). **Do not re-release. Do not flip DONE.** Next after critic = `/closure`.

## Verdict rationale (parity-reconfirm)

Fresh QA independently re-ran the four compose files after execute runbook active→template copy. `python -m pytest tests/bug0021_opencode_cli_tui_plugin_load_test.py tests/bug0020_opencode_desktop_command_info_listing_test.py tests/bug0019_opencode_auto_slash_listing_test.py tests/bug0018_opencode_auto_ownership_test.py -v` → **29 passed** in 0.38s (bug0021 **8/8**; bug0020 **8/8**; bug0019 **7/7**; bug0018 **6/6**). `python scripts/check_intake_template_parity.py --repo . --scope bug-0021` → `[INTAKE_TEMPLATE_PARITY_OK]`. Active `docs/engineering/runbook.md` and `template/docs/engineering/runbook.md` are **byte-identical** (246049 bytes, Windows CRLF, SHA-256 `2AA78A83985B4FF2677F13EE4DDB623B1B5DF9276F9FF3509AAD2BB3F6E36C60`). Metadata checker exit 0. Execute parity proof + critic-of-execute-parity proof independently recomputed **MATCH** before TTL. Axis A `tui.ts` unchanged. Colliding `auto.md` absent. AC-1..AC-10 remain ticked. Status OPEN. acceptance.md unchecked. Blocking findings: **none**. **No live OpenCode CLI TUI listing/invoke claimed.** 13:10 QA proof **not reused**.

## Test plan (this cycle)

| # | Check | Expected |
|---|---|---|
| 1 | pytest bug0021 + bug0020 + bug0019 + bug0018 | 8+8+7+6 = 29 PASS |
| 2 | Active↔template `--scope bug-0021` | OK |
| 3 | Runbook twins byte-identical | 246049 bytes CRLF MATCH |
| 4 | Execute + critic DEC-0038 proof consume | MATCH before TTL; 13:10 qa proof not reused |
| 5 | Status OPEN; acceptance unchecked; AC-1..AC-10 remain ticked | unchanged |
| 6 | UAT probes | `contract_tests_primary` PASS; live classes waived `UAT_PROBE_FORBIDDEN`; `convergence_smoke` pass |
| 7 | Release already PASS | do not re-release; next `/closure` after critic |

## Independent checks (this qa subagent)

| Check | Command / method | Result |
|---|---|---|
| Execute parity proof SHA-256 | `compute_strict_proof_hash` 6-field tuple | **MATCH** `79BCBAF537CA73C6AA434732CF556C8FDFD777AB6964F034C27A72F9A164864F`; ttl `2026-09-13T15:30:00Z`; consumed_at `2026-09-13T14:40:00Z` — **RUNTIME_PROOF_VALID** |
| Critic of execute parity proof | `compute_strict_proof_hash` | **MATCH** `6E935DC37E3D30299F13D89DE1C910084F3C22AA9D69161E47FEC2010852B968`; ttl `2026-09-13T15:35:00Z`; blocking_count=0; anti_slop=10; degraded_mode=false |
| BUG-0021 + compose contract tests | `python -m pytest tests/bug0021_opencode_cli_tui_plugin_load_test.py tests/bug0020_opencode_desktop_command_info_listing_test.py tests/bug0019_opencode_auto_slash_listing_test.py tests/bug0018_opencode_auto_ownership_test.py -v` | **29 passed** in 0.38s (**8/8** `test_bug0021_*`; **8/8** `test_bug0020_*`; **7/7** `test_bug0019_*`; **6/6** `test_bug0018_*`) |
| Parity | `python scripts/check_intake_template_parity.py --repo . --scope bug-0021` | **[INTAKE_TEMPLATE_PARITY_OK]** |
| Runbook twins | byte compare active vs template | **byte-identical** 246049 bytes CRLF; SHA-256 `2AA78A83985B4FF2677F13EE4DDB623B1B5DF9276F9FF3509AAD2BB3F6E36C60` |
| Metadata | `python scripts/check-user-visible-metadata.py --repo .` | **exit 0** |
| UAT probe lib | `python scripts/uat_probe_lib.py --self-test` | **[UAT_PROBE_LIB_SELF_TEST_OK]** |
| Colliding auto.md | path exists? | **absent** active + template |
| Keep surfaces | `.opencode/agents/auto.md`, `.cursor/commands/auto.md` | **present** |
| Remaining markdown commands | `.opencode/commands/*.md` | **14** (no `auto.md`) |
| Kit `cli.json` / plugin-local tui.json | paths exist? | **absent** |
| Backlog / acceptance | Status + checkbox spot-check | OPEN; acceptance `- [ ] BUG-0021`; AC-1..AC-10 remain ticked |
| LINT_COMMAND / TYPECHECK_COMMAND | blank in runbook | **skipped** |
| Full harness `tests/run-tests.ps1` | not re-run this pass | **not claimed** — scoped slice + compose are the required gates (`harness_fail_zero_claimed=false`) |
| Live OpenCode CLI TUI probe | not attempted | **not claimed** (`UAT_PROBE_FORBIDDEN`) |
| No `.env` / no intake JSON mutation | this pass | **held** |
| POLICY_QA_SILENT_FIX | no production source patch | **held** |
| Prior 13:10 QA proof | not reused | **held** (`5919A09D…` superseded as cycle proof; historical record retained below) |

## Blocking findings

None.

## Non-blocking findings (critic NB carry-forwards — informational)

| ID | Topic | QA note |
|---|---|---|
| NB1 / bug0021expr-challenger-001 | execute parity proof MATCH+not-STALE; pytest 29/29; runbook twins byte-identical | Independently re-verified 8/8 + 8/8 + 7/7 + 6/6, runbook 246049 bytes identical, parity OK. Does **not** fail any AC. |
| NB2 / bug0021expr-architect-002 | Axis A tui.ts UNCHANGED; load path ≠ listing proof | Held. Not blocking. |
| NB3 / bug0021expr-subtractor-003 | no DONE / no companion DEC / no auto.md restore / no re-release / BUG-0022 / US-0139 untouched | Held this pass. Not blocking. |

Informational (QA-owned): no live OpenCode CLI TUI listing/invoke this pass; contract tests + fixture spot-checks are the gate. Live-runtime steps classified **`UAT_PROBE_FORBIDDEN`**. **No fake browser PASS.**

## AC remap (remain ticked — files + tests vs Axis A)

AC-1..AC-10 remain **PASS** (slice) from prior QA; this cycle re-attested via 29/29 + parity + runbook twins. Status remains OPEN; `docs/product/acceptance.md` BUG-0021 **unchecked**. **No live OpenCode CLI TUI PASS.**

## UAT / convergence (US-0128)

- Contract slice green (`contract_test_failed=0`); pytest 29/29; runbook twins identical; auto.md absent.
- Canonical `convergence_smoke` remains **pass** in `sprints/S0146/uat.json` (not rewritten; verify-work populated; this cycle re-attested).
- Six live-runtime probe classes waived `UAT_PROBE_FORBIDDEN`.
- Full UAT ownership remains with prior `/verify-work` (already PASS). Do not flip DONE / tick acceptance.md here. Do not re-run `/verify-work`.
- `harness_fail_zero_claimed=false`.

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
- `runtime_reason_code`: `UAT_PROBE_FORBIDDEN` for browser/runtime-app/live CLI TUI probes; slice health is contract tests + compose + `convergence_smoke` surrogate
- `runtime_evidence_refs`: pytest 29/29 (0.38s); runbook twins byte-identical 246049; parity `--scope bug-0021` OK; `sprints/S0146/uat.json` `convergence_smoke`

## Generated-test evidence (US-0066)

- `generated_test_stack_profile`: python
- `generated_test_command`: `python -m pytest tests/bug0021_opencode_cli_tui_plugin_load_test.py tests/bug0020_opencode_desktop_command_info_listing_test.py tests/bug0019_opencode_auto_slash_listing_test.py tests/bug0018_opencode_auto_ownership_test.py -v`
- `generated_test_result`: pass
- `generated_test_output_ref`: this file § Independent checks (29 passed in 0.38s)
- `generated_test_paths_ref`: `tests/bug0021_opencode_cli_tui_plugin_load_test.py`
- `generated_test_reason_code`: none (pass)
- `FRAMEWORK_KIT_REPO=1` / kit contract tests (not generated-app scaffolds) — do **not** fail `TEST_SCAFFOLD_GENERATION_FAILED`

## Status confirmation (US-0045)

- backlog `### BUG-0021` Status: **OPEN**
- backlog AC-1..AC-10: **remain ticked** (not flipped this cycle)
- acceptance BUG-0021: **unchecked** (`- [ ] BUG-0021`)
- BUG-0015 / BUG-0016 / BUG-0017 / BUG-0018 / BUG-0019 / BUG-0020: **DONE** (not reopened)
- BUG-0022 / US-0139 / US-0140: **OPEN** (not mutated except shared runbook pair now byte-identical)
- intake JSON not mutated this phase
- architecture.md `# BUG-0021` / `# BUG-0020` not mutated this phase
- R-0134 / R-0126 bodies not mutated this phase

## Producer proof consumed (execute parity rework)

- `producer_runtime_proof_id=rp-auto-20260913-bug0021-execute-dev-20260913T143000Z-BUG-0021`
- Canonical hashed payload: `{"orchestrator_run_id":"auto-20260913-bug0021","phase_id":"execute","proof_issued_at":"2026-09-13T14:30:00Z","proof_ttl_seconds":3600,"role":"dev","runtime_proof_id":"rp-auto-20260913-bug0021-execute-dev-20260913T143000Z-BUG-0021"}`
- `producer_attested_proof_hash=79BCBAF537CA73C6AA434732CF556C8FDFD777AB6964F034C27A72F9A164864F`
- Independent `compute_strict_proof_hash` recompute: **MATCH**
- `producer_proof_ttl=2026-09-13T15:30:00Z`, `consumed_at=2026-09-13T14:40:00Z` — **RUNTIME_PROOF_VALID** (not STALE)
- Isolation extras (not hashed): `delivery_mode=ultra_lean`; `macro_phase=build+verify`; `model_id=cursor-grok-4.6-high`; `sprint_id=S0146`; `story_id=BUG-0021`
- `producer_fresh_context_marker=dev-BUG0021-execute-parity-20260913T143000Z-fresh`
- Superseded execute (NOT consumed this cycle): `rp-auto-20260913-bug0021-execute-dev-20260913T125000Z-BUG-0021` / `8690BA08357FB4BDF15D818DE55350A64AC68D50DCC486EB680DA918EC2F4165`

## Critic of execute parity proof consumed

- `critic_runtime_proof_id=rp-auto-20260913-bug0021-sovereign-critic-techlead-20260913T143500Z-BUG-0021`
- Canonical hashed payload: `{"orchestrator_run_id":"auto-20260913-bug0021","phase_id":"sovereign-critic","proof_issued_at":"2026-09-13T14:35:00Z","proof_ttl_seconds":3600,"role":"tech-lead","runtime_proof_id":"rp-auto-20260913-bug0021-sovereign-critic-techlead-20260913T143500Z-BUG-0021"}`
- Attested hash `6E935DC37E3D30299F13D89DE1C910084F3C22AA9D69161E47FEC2010852B968` — independent recompute **MATCH**
- Critic consume at `2026-09-13T14:40:00Z` before TTL `2026-09-13T15:35:00Z` — **RUNTIME_PROOF_VALID**
- Critic of execute parity: PASS, blocking_count=0, anti_slop_aggregate=10, degraded_mode=false, finding_ids `bug0021expr-*`

## Strict runtime proof (DEC-0038) — qa (parity-reconfirm; NEW — do not reuse 13:10)

- `orchestrator_run_id=auto-20260913-bug0021`
- `runtime_proof_id=rp-auto-20260913-bug0021-qa-qa-20260913T144000Z-BUG-0021` (NEW unique — distinct from 13:10 qa / execute-parity / critic-parity)
- `phase_id=qa`, `role=qa`, `story_id=BUG-0021`, `sprint_id=S0146`
- `delivery_mode=ultra_lean`, `macro_phase=build+verify`, `model_id=cursor-grok-4.6-high`
- `proof_issued_at=2026-09-13T14:40:00Z`
- `proof_ttl_seconds=3600`, `proof_ttl=2026-09-13T15:40:00Z` (UTC = issued_at + 3600s)
- `proof_hash=1FDF8443981CD74DDBBA22BEF4569D3ECA017D86FFF6B3BE0C9160957EC1F924` (`compute_strict_proof_hash` positional 6-field)
- Canonical payload: `{"orchestrator_run_id":"auto-20260913-bug0021","phase_id":"qa","proof_issued_at":"2026-09-13T14:40:00Z","proof_ttl_seconds":3600,"role":"qa","runtime_proof_id":"rp-auto-20260913-bug0021-qa-qa-20260913T144000Z-BUG-0021"}`
- hash_recompute_confirmation=true (compute_strict_proof_hash → 1FDF8443981CD74DDBBA22BEF4569D3ECA017D86FFF6B3BE0C9160957EC1F924)
- Not reused: `rp-auto-20260913-bug0021-qa-qa-20260913T131000Z-BUG-0021` / `5919A09DDA19AF51A4651856A5AEF5977D72584FFBB85BD18B9E7B8F92BB5BF7`

## Isolation evidence (US-0048 / DEC-0029 / US-0104 v2)

- `phase_id=qa`, `role=qa`, `model_id=cursor-grok-4.6-high` (CROSS_MODEL_REVIEW=1 — required)
- `fresh_context_marker=qa-BUG0021-qa-parity-20260913T144000Z-fresh` (NEW per US-0048 / BUG-0006)
- `timestamp=2026-09-13T14:40:00Z` (UTC)
- `orchestrator_run_id=auto-20260913-bug0021`
- `sprint_id=S0146`
- `evidence_ref=sprints/S0146/qa-findings.md; sprints/S0146/uat.json; handoffs/resume_brief.md`
- Fresh qa subagent per BUG-0006 / US-0048 isolation; no prior chat history carried forward. Context limited to narrow-read (US-0053). No `.env` reads, no credentials access, no intake-evidence mutation, no DONE flip, no acceptance.md mutation, no architecture.md mutation, no `/execute` or `/closure` or `/release` spawn from this subagent.

## Next scheduled phase

- `next_scheduled_phase=sovereign-critic (qa parity-reconfirm) then /closure` (release already PASS; do not re-release; do not re-run `/verify-work`)
- `next_scheduled_role=tech-lead (critic), then qe`
- `stop_condition=STOP after qa PASS. Orchestrator spawns sovereign-critic of qa (CROSS_MODEL_REVIEW=1), then /closure in a fresh qe subagent (BUG-0006). Do NOT spawn /closure, /release, /execute, or /verify-work from this subagent. Do NOT mark BUG-0021 DONE. Do NOT tick acceptance.md. Do NOT mutate intake JSON. Do NOT mutate architecture.md. Do NOT reopen BUG-0020/BUG-0019/BUG-0018/BUG-0017/BUG-0015/BUG-0016. Do NOT mutate BUG-0022 / US-0139. Do NOT restore auto.md. Do NOT claim live CLI TUI PASS. Do NOT re-release.`
- `artifacts_written=sprints/S0146/qa-findings.md (this cycle prepend), sprints/S0146/{progress,summary}.md, docs/engineering/state.md (qa parity checkpoint append), handoffs/qa_to_verify.md (prepend → closure), handoffs/resume_brief.md (QA_PASS prepend → /closure), docs/product/backlog.md (qa_notes append)`
- `handoffs/qa_to_dev.md=NOT written` (no blocking findings; AUTO_IMPLEMENTATION_LOOP does not return to /execute)

---

# QA findings — BUG-0021 / S0146 / auto-20260913-bug0021 (qa)

- **phase_id**: qa, **role**: qa, **bug_id**: BUG-0021 (OPEN — not marked DONE per US-0045), **sprint_id**: S0146
- `orchestrator_run_id=auto-20260913-bug0021`, `parent_orchestrator_run_id=cursor-20260913-BUG0021-intake`, `delivery_mode=ultra_lean`, `macro_phase=build+verify`
- `AUTO_IMPLEMENTATION_LOOP=1` (no blocking findings — do not return to `/execute`)
- `AUTO_QUIET=1`
- `FRAMEWORK_KIT_REPO=1`
- `SECURITY_REVIEW=0`
- `model_id=cursor-grok-4.6-high` (CROSS_MODEL_REVIEW=1 — required on isolation; catalog `roles.qa` hit)
- `producer_phase_id=execute`, `producer_role=dev`, `producer_model_id=cursor-grok-4.6-high`
- `critic_phase_id=sovereign-critic` (execute review), `critic_model_id=composer-2.5`, `critic_verdict=PASS`, `anti_slop_aggregate=10`, `open_blocking_findings=0`, `degraded_mode=false`
- `critic_fresh_context_marker=tl-BUG0021-critic-execute-20260913T130500Z-fresh`
- `critic_finding_ids=bug0021ex-challenger-001, bug0021ex-architect-002, bug0021ex-subtractor-003` (informational NBs; not AC failures)
- `cross_reviewer_findings.open_blocking_count=0` (`handoffs/sovereign_critic_findings.jsonl`)

- `fresh_context_marker=qa-BUG0021-qa-20260913T131000Z-fresh` (NEW per US-0048 / BUG-0006; not reused from execute `dev-BUG0021-execute-20260913T125000Z-fresh` or critic `tl-BUG0021-critic-execute-20260913T130500Z-fresh`)
- `timestamp (UTC)=2026-09-13T13:10:00Z` (orchestrator-specified; adjust UTC)
- **verdict: QA_PASS**
- `plan_verify_verdict=PASS` (ultra_lean deferred — `sprints/S0146/plan-verify.json` SKIPPED placeholder treated as PASS; 10/10 AC surjective in sprint-plan + this remap + primary acceptance row)
- `blocking_count=0`
- `non_blocking_count=3` (execute-critic carry-forwards — informational; not new blockers) plus honest operator NB: no live OpenCode CLI TUI listing/invoke this pass
- `story_status=OPEN` (do not mark BUG-0021 DONE; intake JSON not mutated)
- `acceptance_BUG-0021=NOT ticked` (`docs/product/acceptance.md` row remains `- [ ] BUG-0021`)
- `backlog_ACs=ticked` (AC-1..AC-10 independently verified this pass; Status remains OPEN)
- `intake_json=NOT mutated`
- `FRAMEWORK_KIT_REPO=1` / OpenCode CLI TUI plugin-load / keymap / rpc contract-test slice — no web UI; **no fake browser PASS**; **no live OpenCode CLI TUI PASS**
- `SECURITY_REVIEW=0`, `CROSS_REPO_OBSERVABILITY=0`, `COMPONENT_SCOPE_MODE=0`, `USER_GUIDE_MODE=0`, `SPEC_PACK_MODE=0`
- `sibling_done=BUG-0015 DONE; BUG-0016 DONE; BUG-0017 DONE; BUG-0018 DONE; BUG-0019 DONE; BUG-0020 DONE` (do not reopen)
- `sibling_open_held=BUG-0022 OPEN not mutated; US-0139 / S0145 not mutated`

## Verdict rationale

Fresh QA independently remapped AC-1..AC-10 against architecture `# BUG-0021` Axis A (reshape listed TUI module to default export `{ id: "its-magic.auto.tui", tui }`; `registerLayer` `name` / `slashName: "auto"` / `namespace: "palette"` / `ctrl+shift+a`; `run()` → `api.client.rpc(ITS_MAGIC_AUTO_RPC)` → `runAutoLifecycle`; keep `tui.json` listing as load path ≠ listing proof; keep `editor.add`; additive `OPENCODE_AUTO_CLI_TUI_PLUGIN_LOAD_UNSUPPORTED`; no `auto.md` restore) + `sprints/S0146/sprint.md` / `tasks.md`, treated ultra_lean deferred `plan-verify.json` SKIPPED placeholder as **PASS** (10/10 AC surjective; this pass overwrote with QA PASS, analog S0140), re-ran `python -m pytest tests/bug0021_opencode_cli_tui_plugin_load_test.py tests/bug0020_opencode_desktop_command_info_listing_test.py tests/bug0019_opencode_auto_slash_listing_test.py tests/bug0018_opencode_auto_ownership_test.py -v` (**29 passed**; bug0021 **8/8**; bug0020 **8/8**; bug0019 **7/7**; bug0018 **6/6**), confirmed colliding `.opencode/commands/auto.md` **absent** (active + template), `.opencode/tui.json` lists `./plugins/its-magic-auto/tui.ts`, TUI default export is `{ id, tui }` **not** `Plugin.define` as TUI default, plugin `editor.add({ name: "auto", execute })` → `runAutoLifecycle` **retained**, `emitCliTuiPluginLoadUnsupported` present (not TUI-toast-only; after `editor.add`), token `OPENCODE_AUTO_CLI_TUI_PLUGIN_LOAD_UNSUPPORTED` present, `#36505` residual documented in runbook (not a markdown restore), and independently recomputed execute + critic proof hashes **MATCH** before TTL. Blocking findings: **none**. BUG-0021 remains OPEN; acceptance unchecked; BUG-0020/0019/0018/0017/0015/0016 DONE not reopened; BUG-0022 / US-0139 not mutated. Critic NBs treated as informational. **No live OpenCode CLI TUI listing/invoke claimed.**

## Test plan

| # | Check | Expected |
|---|---|---|
| 1 | Independent AC-1..AC-10 remap vs Axis A + tasks | Each AC ≥1 task; primary acceptance covered |
| 2 | Ultra_lean deferred `sprints/S0146/plan-verify.json` | SKIPPED placeholder → PASS if 10/10 surjective |
| 3 | pytest bug0021 + bug0020 + bug0019 + bug0018 | 8+8+7+6 = 29 PASS |
| 4 | `.opencode/commands/auto.md` + template twin absent | absent / keep surfaces present |
| 5 | TUI default export `{ id, tui }` + `slashName: "auto"` + `ctrl+shift+a` | present active + template; not `Plugin.define` as TUI default |
| 6 | Plugin `editor.add` + `emitCliTuiPluginLoadUnsupported` + LOAD token | retained / present / present |
| 7 | Active↔template `--scope=bug-0021` | OK |
| 8 | Execute + critic DEC-0038 proof consume | MATCH before TTL |
| 9 | Status OPEN; acceptance unchecked; siblings DONE held; BUG-0022 / US-0139 held | unchanged |
| 10 | UAT probes | `contract_tests_primary` PASS; live classes waived `UAT_PROBE_FORBIDDEN` |
| 11 | Emit `convergence_smoke` when `contract_test_failed=0` | present, `result=pass` |

## Independent checks (this qa subagent)

| Check | Command / method | Result |
|---|---|---|
| Execute proof SHA-256 | `compute_strict_proof_hash` 6-field tuple | **MATCH** `8690BA08357FB4BDF15D818DE55350A64AC68D50DCC486EB680DA918EC2F4165`; ttl `2026-09-13T13:50:00Z`; consumed_at `2026-09-13T13:10:00Z` — **RUNTIME_PROOF_VALID** |
| Critic of execute proof | `compute_strict_proof_hash` | **MATCH** `A56058FBCD5372E1BCAD6F42DDC0D8640CED3C06B544BAE6BCFB363F84315233`; ttl `2026-09-13T14:05:00Z`; blocking_count=0; anti_slop=10; degraded_mode=false |
| BUG-0021 + compose contract tests | `python -m pytest tests/bug0021_opencode_cli_tui_plugin_load_test.py tests/bug0020_opencode_desktop_command_info_listing_test.py tests/bug0019_opencode_auto_slash_listing_test.py tests/bug0018_opencode_auto_ownership_test.py -v` | **29 passed** in 0.37s (**8/8** `test_bug0021_*`; **8/8** `test_bug0020_*`; **7/7** `test_bug0019_*`; **6/6** `test_bug0018_*`) |
| Parity | `python scripts/check_intake_template_parity.py --repo . --scope=bug-0021` | **[INTAKE_TEMPLATE_PARITY_OK]** |
| Metadata | `python scripts/check-user-visible-metadata.py --repo .` | **exit 0** |
| UAT probe lib | `python scripts/uat_probe_lib.py --self-test` | **[UAT_PROBE_LIB_SELF_TEST_OK]** |
| Colliding auto.md | path exists? | **absent** active + template |
| Keep surfaces | `.opencode/agents/auto.md`, `.cursor/commands/auto.md` | **present** |
| Remaining markdown commands | `.opencode/commands/*.md` | **14** (no `auto.md`) |
| Plugin attach | `command.transform` + `editor.add` `name: "auto"` + `runAutoLifecycle` | **retained** |
| TUI default export | `.opencode/plugins/its-magic-auto/tui.ts` `export default { id: "its-magic.auto.tui", tui }` | **present**; **not** `Plugin.define` as TUI default |
| registerLayer | `name` / `slashName: "auto"` / `namespace: "palette"` / `ctrl+shift+a` | **present** (active + template) |
| run() dispatch | `dispatchRunAutoLifecycle` → `api.client.rpc` / `ITS_MAGIC_AUTO_RPC` → `runAutoLifecycle` | **present** |
| CLI TUI load path | `.opencode/tui.json` + template `"plugin": ["./plugins/its-magic-auto/tui.ts"]` | **present**; listing ≠ proof comment |
| Plugin-local tui.json | `.opencode/plugins/its-magic-auto/tui.json` | **absent** |
| Kit `cli.json` | `.opencode/cli.json` | **absent** (active + template) |
| LOAD emit helper | `emitCliTuiPluginLoadUnsupported` | **present**; channels desktop-notify → session-notice → setup-session-error; **no** `tui.toast`/`ui.toast` in emit helper; after `editor.add` |
| LOAD token | `OPENCODE_AUTO_CLI_TUI_PLUGIN_LOAD_UNSUPPORTED` | **present** (REASON_CODES + tui.ts + runbook `#36505`) |
| Listing index | `its-magic-auto/index.ts` stays `Plugin.define` server; no `editor.add`; no `tui` export | **held** |
| Leftover defense | leftover auto.md | **absent**; plugin does not restore |
| No JSON `commands.auto` template | repo `.opencode` JSON/JSONC search | **absent** |
| Runbook residual | `#36505` + `--pure` out of scope | **documented**; not a markdown restore |
| Backlog / acceptance | Status + checkbox spot-check | OPEN; acceptance `- [ ] BUG-0021`; AC-1..AC-10 ticked this QA pass |
| LINT_COMMAND / TYPECHECK_COMMAND | blank in runbook | **skipped** |
| Full harness `tests/run-tests.ps1` | not re-run this pass | **not claimed** — scoped slice + compose are the required gates (`harness_fail_zero_claimed=false`) |
| Live OpenCode CLI TUI probe | not attempted | **not claimed** (`UAT_PROBE_FORBIDDEN`) |
| No `.env` / no intake JSON mutation | this pass | **held** |
| POLICY_QA_SILENT_FIX | no production source patch | **held** |

## Blocking findings

None.

## Non-blocking findings (critic NB carry-forwards — informational)

| ID | Topic | QA note |
|---|---|---|
| NB1 / bug0021ex-challenger-001 | execute proof MATCH+not-STALE; 8/8 markers; `#36505` LOAD residual; registerLayer/layer fallback; HTTP RPC fallback; upgrade overwrite; no live CLI TUI probe | Independently re-verified 8/8 + 8/8 + 7/7 + 6/6, auto.md absent, `{ id, tui }` + registerLayer + rpc, LOAD token + emit helper. Does **not** fail any AC. Honest residual: operator OpenCode binary predating v2 external TUI plugin activation (`#36505`) → `OPENCODE_AUTO_CLI_TUI_PLUGIN_LOAD_UNSUPPORTED`; **do not** restore `auto.md`. |
| NB2 / bug0021ex-architect-002 | TUI keymap vs Command.Info; rpc dispatch; server emit after editor.add; compose BUG-0018/0019/0020 held | This pass overwrote SKIPPED placeholder with PASS `plan-verify.json` and remapped AC-1..AC-10. Execute Axis A surfaces held. Not blocking. |
| NB3 / bug0021ex-subtractor-003 | no DONE / no companion DEC / no auto.md restore / no cli.json / no live CLI TUI probe / BUG-0022 / US-0139 untouched | Held this pass. Not blocking. |

Informational (QA-owned, not a new critic finding): no live OpenCode CLI TUI listing/invoke this pass; contract tests + fixture spot-checks are the gate. Live-runtime steps classified **`UAT_PROBE_FORBIDDEN`**. **No fake browser PASS.**

## AC remap (independent — files + tests vs Axis A)

| AC | Delivered surface | Task(s) / markers | Result |
|---|---|---|---|
| AC-1 listed CLI TUI `/auto` via `{ id, tui }` + `slashName: "auto"` | `tui.ts` default export `{ id: "its-magic.auto.tui", tui }`; `registerLayer` `slashName: "auto"` | T-001, T-002, T-005 (m1, m2, m6) | **PASS** (contract; live listing `UAT_PROBE_FORBIDDEN`) |
| AC-2 invocation starts `runAutoLifecycle` or documented `OPENCODE_*` | `dispatchRunAutoLifecycle` → `api.client.rpc`; LOAD token + emit helper | T-003, T-004, T-005 (m3, m5) | **PASS** |
| AC-3 Must not restore STOP-only `auto.md` | active+template `.opencode/commands/auto.md` absent | T-anch, T-005 (m4) | **PASS** |
| AC-4 Must not JSON-template `/auto` | no OpenCode JSON `commands.auto` + `template`; no `cli.json` | T-005 (m4) | **PASS** |
| AC-5 Plugin `editor.add` execute retained | orchestrator `editor.add({ name: "auto", execute })` → `runAutoLifecycle`; `index.ts` does **not** `editor.add` | T-003, T-005 (m3) | **PASS** |
| AC-6 Consumer upgrade overwrites reshaped `tui.ts` + still prunes leftover `auto.md` | overwrite (`copy2` / `-Force`); still `prune_retired_opencode_auto_md`; marker 8 | T-006, T-005 (m8) | **PASS** |
| AC-7 Active↔template parity | `--scope=bug-0021` OK; marker 7 | T-007, T-005 (m7) | **PASS** |
| AC-8 Peers remain listed | 14 peer `.opencode/commands/*.md`; keep agents/cursor auto.md | T-anch | **PASS** |
| AC-9 Tests are loader/keymap/rpc contracts, not `tui.json`-path-only | 8 `test_bug0021_*` markers; not listing-path-only | T-005 | **PASS** |
| AC-10 `#36505` residual documented, not a markdown restore | runbook + LOAD token; auto.md still absent | T-004, T-007 | **PASS** |

**Overall AC gate**: **PASS** (slice) — Status remains OPEN; `docs/product/acceptance.md` BUG-0021 **unchecked** (closure ownership). Backlog AC-1..AC-10 **ticked** after independent verification. **No live OpenCode CLI TUI PASS.**

## Contract marker results (8/8 slice + 8/8 + 7/7 + 6/6 compose)

| # | Marker | Result |
|---|---|---|
| 1 | `test_bug0021_tui_default_export_id_tui_shape` | PASS |
| 2 | `test_bug0021_registerLayer_name_slashName_palette_key` | PASS |
| 3 | `test_bug0021_run_rpc_to_runAutoLifecycle` | PASS |
| 4 | `test_bug0021_no_auto_md_no_json_template` | PASS |
| 5 | `test_bug0021_fail_closed_load_token` | PASS |
| 6 | `test_bug0021_slash_list_is_keymap_not_command_info` | PASS |
| 7 | `test_bug0021_active_template_parity` | PASS |
| 8 | `test_bug0021_upgrade_copies_tui_shape_still_prunes_auto_md` | PASS |
| compose 1 | `test_bug0020_desktop_command_info_picker_contract` | PASS |
| compose 2 | `test_bug0020_no_command_info_auto_template` | PASS |
| compose 3 | `test_bug0020_plugin_editor_add_auto_execute_retained` | PASS |
| compose 4 | `test_bug0020_desktop_listing_fail_closed_token` | PASS |
| compose 5 | `test_bug0020_cli_tui_working_start_load_path` | PASS |
| compose 6 | `test_bug0020_tui_run_still_dispatches_lifecycle` | PASS |
| compose 7 | `test_bug0020_active_template_parity` | PASS |
| compose 8 | `test_bug0020_upgrade_copies_surface_still_prunes_auto_md` | PASS |
| compose 9 | `test_bug0019_no_restored_opencode_auto_md` | PASS |
| compose 10 | `test_bug0019_plugin_editor_add_auto_execute_retained` | PASS |
| compose 11 | `test_bug0019_no_json_commands_auto_template` | PASS |
| compose 12 | `test_bug0019_tui_slash_auto_listing_surface` | PASS |
| compose 13 | `test_bug0019_tui_run_dispatches_lifecycle_not_template` | PASS |
| compose 14 | `test_bug0019_active_template_listing_parity` | PASS |
| compose 15 | `test_bug0019_upgrade_copies_listing_surface` | PASS |
| compose 16 | `test_bug0018_no_colliding_opencode_auto_md` | PASS |
| compose 17 | `test_bug0018_plugin_editor_add_auto_execute` | PASS |
| compose 18 | `test_bug0018_active_template_opencode_auto_ownership_parity` | PASS |
| compose 19 | `test_bug0018_upgrade_prunes_consumer_auto_md` | PASS |
| compose 20 | `test_bug0018_compose_bug0015_attach_api_unchanged` | PASS |
| compose 21 | `test_bug0018_markdown_collision_reason_code_stub` | PASS |

## Compose / scope gates

| Gate | Result |
|---|---|
| BUG-0020 C-limb load path + desktop token (historical body UNCHANGED) | HELD (8/8 compose) |
| BUG-0019 E* CLI TUI keymap + `auto.md` absent | HELD (7/7 compose) |
| BUG-0018 A* plugin-only execute + `auto.md` absent | HELD (6/6 compose) |
| DEC-0124 / DEC-0125 bodies UNCHANGED | HELD (not rewritten this phase) |
| `# BUG-0020` / R-0126 historical bodies | HELD (not rewritten; C-limb listing claim superseded by `# BUG-0021`) |
| `# BUG-0021` / R-0134 not rewritten this phase | HELD |
| BUG-0015 / BUG-0016 / BUG-0017 / BUG-0018 / BUG-0019 / BUG-0020 DONE | HELD (not reopened) |
| BUG-0022 OPEN / US-0139 OPEN | HELD (not mutated) |
| US-0045 Status OPEN / acceptance.md unchecked | HELD |
| Cursor `.cursor/commands/auto.md` / `.opencode/agents/auto.md` untouched keep | HELD |
| No kit `cli.json`; no plugin-local `its-magic-auto/tui.json` | HELD |
| `index.ts` stays server `Plugin.define`; no `tui` export; no `editor.add` | HELD |
| No companion DEC | HELD |
| No live OpenCode CLI TUI CI probe | HELD |
| Exactly 8 `test_bug0021_*` markers; compose tests not weakened | HELD |
| DEC-0038 `compute_strict_proof_hash` tuple UNAMENDED | HELD |
| No `.env` read / no intake JSON mutation | HELD |

## UAT / convergence (US-0128)

- Contract slice green (`contract_test_failed=0`); pytest 29/29; auto.md absent; plugin attach retained; `{ id, tui }` + registerLayer + rpc; LOAD token + emit helper; `#36505` documented.
- Canonical `convergence_smoke` recorded as **pass** in `sprints/S0146/uat.json`.
- Six live-runtime probe classes waived `UAT_PROBE_FORBIDDEN` (FRAMEWORK_KIT_REPO=1; **no live OpenCode CLI TUI probe**; not `browser_smoke`).
- Ultra_lean: QA merged AC checklist into `uat.json` / this file; operator live TUI ticks and DONE remain `/verify-work` / closure ownership.
- Full UAT ownership remains with `/verify-work` (do not flip DONE / tick acceptance.md here).
- `harness_fail_zero_claimed=false`.

## UAT probes (FRAMEWORK_KIT_REPO=1 — honest classification)

Applicable probe class: **`contract_tests_primary`** (8 markers + bug0020/bug0019/bug0018 compose). No web UI. No fake browser PASS. Live OpenCode CLI TUI listing/invoke **not attempted** (`UAT_PROBE_FORBIDDEN`). Static/fixture only. No `.env`.

Canonical surrogate step **`convergence_smoke`** emitted this pass (`result=pass`) because `contract_test_failed=0`.

| Probe class | Classification | reason_code |
|---|---|---|
| `browser_smoke` | waived / not applicable | `UAT_PROBE_FORBIDDEN` |
| `api_health` | waived / not applicable | `UAT_PROBE_FORBIDDEN` |
| `process_health` | waived / not applicable | `UAT_PROBE_FORBIDDEN` |
| `cli_smoke` | live OpenCode CLI TUI listing/invoke out of default CI | `UAT_PROBE_FORBIDDEN` |
| `build` | not applicable | `UAT_PROBE_FORBIDDEN` |
| `manual_operator` | deferred to verify-work / operator OpenCode CLI TUI host | `UAT_PROBE_FORBIDDEN` |

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
- `runtime_reason_code`: `UAT_PROBE_FORBIDDEN` for browser/runtime-app/live CLI TUI probes; slice health is contract tests + compose + `convergence_smoke` surrogate
- `runtime_evidence_refs`: pytest 29/29 (bug0021 8/8; bug0020 8/8; bug0019 7/7; bug0018 6/6); auto.md absent; `{ id, tui }` + registerLayer + rpc; editor.add + emitCliTuiPluginLoadUnsupported + LOAD token; `sprints/S0146/uat.json` `convergence_smoke`

## Generated-test evidence (US-0066)

- `generated_test_stack_profile`: python
- `generated_test_command`: `python -m pytest tests/bug0021_opencode_cli_tui_plugin_load_test.py tests/bug0020_opencode_desktop_command_info_listing_test.py tests/bug0019_opencode_auto_slash_listing_test.py tests/bug0018_opencode_auto_ownership_test.py -v`
- `generated_test_result`: pass
- `generated_test_output_ref`: this file § Independent checks (29 passed in 0.37s)
- `generated_test_paths_ref`: `tests/bug0021_opencode_cli_tui_plugin_load_test.py`
- `generated_test_reason_code`: none (pass)
- `FRAMEWORK_KIT_REPO=1` / kit contract tests (not generated-app scaffolds) — do **not** fail `TEST_SCAFFOLD_GENERATION_FAILED`

## Status confirmation (US-0045)

- backlog `### BUG-0021` Status: **OPEN**
- backlog AC-1..AC-10: **ticked** this QA pass (US-0138 pattern)
- acceptance BUG-0021: **unchecked** (`- [ ] BUG-0021`)
- BUG-0015 / BUG-0016 / BUG-0017 / BUG-0018 / BUG-0019 / BUG-0020: **DONE** (not reopened)
- BUG-0022 / US-0139: **OPEN** (not mutated)
- intake JSON not mutated this phase
- architecture.md `# BUG-0021` / `# BUG-0020` not mutated this phase
- R-0134 / R-0126 bodies not mutated this phase

## Producer proof consumed (execute)

- `producer_runtime_proof_id=rp-auto-20260913-bug0021-execute-dev-20260913T125000Z-BUG-0021`
- Canonical hashed payload: `{"orchestrator_run_id":"auto-20260913-bug0021","phase_id":"execute","proof_issued_at":"2026-09-13T12:50:00Z","proof_ttl_seconds":3600,"role":"dev","runtime_proof_id":"rp-auto-20260913-bug0021-execute-dev-20260913T125000Z-BUG-0021"}`
- `producer_attested_proof_hash=8690BA08357FB4BDF15D818DE55350A64AC68D50DCC486EB680DA918EC2F4165`
- Independent `compute_strict_proof_hash` recompute: **MATCH**
- `producer_proof_ttl=2026-09-13T13:50:00Z`, `consumed_at=2026-09-13T13:10:00Z` — **RUNTIME_PROOF_VALID** (not STALE)
- Isolation extras (not hashed): `delivery_mode=ultra_lean`; `macro_phase=build+verify`; `model_id=cursor-grok-4.6-high`; `sprint_id=S0146`; `story_id=BUG-0021`
- `producer_fresh_context_marker=dev-BUG0021-execute-20260913T125000Z-fresh`

## Critic of execute proof consumed

- `critic_runtime_proof_id=rp-auto-20260913-bug0021-sovereign-critic-techlead-20260913T130500Z-BUG-0021`
- Canonical hashed payload: `{"orchestrator_run_id":"auto-20260913-bug0021","phase_id":"sovereign-critic","proof_issued_at":"2026-09-13T13:05:00Z","proof_ttl_seconds":3600,"role":"tech-lead","runtime_proof_id":"rp-auto-20260913-bug0021-sovereign-critic-techlead-20260913T130500Z-BUG-0021"}`
- Attested hash `A56058FBCD5372E1BCAD6F42DDC0D8640CED3C06B544BAE6BCFB363F84315233` — independent recompute **MATCH**
- Critic consume at `2026-09-13T13:10:00Z` before TTL `2026-09-13T14:05:00Z` — **RUNTIME_PROOF_VALID**
- Critic of execute: PASS, blocking_count=0, anti_slop_aggregate=10, degraded_mode=false, finding_ids `bug0021ex-*`

## Strict runtime proof (DEC-0038) — qa

- `orchestrator_run_id=auto-20260913-bug0021`
- `runtime_proof_id=rp-auto-20260913-bug0021-qa-qa-20260913T131000Z-BUG-0021` (NEW unique — distinct from execute / sprint-plan / critic)
- `phase_id=qa`, `role=qa`, `story_id=BUG-0021`, `sprint_id=S0146`
- `delivery_mode=ultra_lean`, `macro_phase=build+verify`, `model_id=cursor-grok-4.6-high`
- `proof_issued_at=2026-09-13T13:10:00Z`
- `proof_ttl_seconds=3600`, `proof_ttl=2026-09-13T14:10:00Z` (UTC = issued_at + 3600s)
- `proof_hash=5919A09DDA19AF51A4651856A5AEF5977D72584FFBB85BD18B9E7B8F92BB5BF7` (`compute_strict_proof_hash` positional 6-field)
- Canonical payload: `{"orchestrator_run_id":"auto-20260913-bug0021","phase_id":"qa","proof_issued_at":"2026-09-13T13:10:00Z","proof_ttl_seconds":3600,"role":"qa","runtime_proof_id":"rp-auto-20260913-bug0021-qa-qa-20260913T131000Z-BUG-0021"}`
- hash_recompute_confirmation=true (compute_strict_proof_hash → 5919A09DDA19AF51A4651856A5AEF5977D72584FFBB85BD18B9E7B8F92BB5BF7)

## Strict runtime proof (DEC-0038) — plan-verify (ultra_lean merged)

- `runtime_proof_id=rp-auto-20260913-bug0021-plan-verify-qa-20260913T131000Z-BUG-0021`
- `phase_id=plan-verify`, `role=qa`
- `proof_issued_at=2026-09-13T13:10:00Z`, `proof_ttl=2026-09-13T14:10:00Z`
- `proof_hash=A6595B6D869E88143709E744C753610F073AE5FC3FD87B6C315411649A7CE857`
- Canonical payload: `{"orchestrator_run_id":"auto-20260913-bug0021","phase_id":"plan-verify","proof_issued_at":"2026-09-13T13:10:00Z","proof_ttl_seconds":3600,"role":"qa","runtime_proof_id":"rp-auto-20260913-bug0021-plan-verify-qa-20260913T131000Z-BUG-0021"}`

## Isolation evidence (US-0048 / DEC-0029 / US-0104 v2)

- `phase_id=qa`, `role=qa`, `model_id=cursor-grok-4.6-high` (CROSS_MODEL_REVIEW=1 — required)
- `fresh_context_marker=qa-BUG0021-qa-20260913T131000Z-fresh` (NEW per US-0048 / BUG-0006)
- `timestamp=2026-09-13T13:10:00Z` (UTC)
- `orchestrator_run_id=auto-20260913-bug0021`
- `sprint_id=S0146`
- `evidence_ref=sprints/S0146/qa-findings.md; sprints/S0146/plan-verify.json; sprints/S0146/uat.json; sprints/S0146/uat.md`
- Fresh qa subagent per BUG-0006 / US-0048 isolation; no prior chat history carried forward. Context limited to narrow-read (US-0053). No `.env` reads, no credentials access, no intake-evidence mutation, no DONE flip, no acceptance.md mutation, no architecture.md mutation, no `/execute` or `/verify-work` spawn from this subagent.

## Next scheduled phase

- `next_scheduled_phase=/verify-work` (role=qa per US-0069 / DEC-0051; fresh qa subagent per BUG-0006 — orchestrator-owned spawn; after sovereign-critic of qa if CROSS_MODEL_REVIEW=1)
- `next_scheduled_role=qa`
- `stop_condition=STOP after qa PASS. Orchestrator spawns sovereign-critic of qa (CROSS_MODEL_REVIEW=1), then /verify-work in a fresh qa subagent (BUG-0006). Do NOT spawn /verify-work or /execute from this subagent. Do NOT mark BUG-0021 DONE. Do NOT tick acceptance.md. Do NOT mutate intake JSON. Do NOT mutate architecture.md. Do NOT reopen BUG-0020/BUG-0019/BUG-0018/BUG-0017/BUG-0015/BUG-0016. Do NOT mutate BUG-0022 / US-0139. Do NOT restore auto.md. Do NOT claim live CLI TUI PASS.`
- `artifacts_written=sprints/S0146/qa-findings.md, sprints/S0146/plan-verify.json, sprints/S0146/uat.json, sprints/S0146/uat.md, sprints/S0146/progress.md, docs/engineering/state.md (qa checkpoint append), handoffs/qa_to_verify.md (prepend), handoffs/resume_brief.md (qa PASS prepend → /verify-work), docs/product/backlog.md (qa_notes + AC-1..AC-10 ticked)`
- `handoffs/qa_to_dev.md=NOT written` (no blocking findings; AUTO_IMPLEMENTATION_LOOP does not return to /execute)
