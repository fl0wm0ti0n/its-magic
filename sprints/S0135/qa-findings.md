# QA findings — BUG-0017 / S0135 / auto-20260911-bug0017 (qa)

- **phase_id**: qa, **role**: qa, **bug_id**: BUG-0017 (OPEN — not marked DONE per US-0045), **sprint_id**: S0135
- `orchestrator_run_id=auto-20260911-bug0017`, `delivery_mode=ultra_lean`, `macro_phase=build+verify`
- `AUTO_IMPLEMENTATION_LOOP=1` (no blocking findings — do not return to `/execute`)
- `model_id=composer-2.5` (CROSS_MODEL_REVIEW=1 — required on isolation)
- `producer_phase_id=execute`, `producer_role=dev`, `producer_model_id=composer-2.5`
- `critic_phase_id=sovereign-critic` (execute review), `critic_model_id=gpt-5.6-luna-medium`, `critic_verdict=PASS`, `anti_slop_aggregate=10`, `open_blocking_findings=0`
- `critic_fresh_context_marker=critic-BUG0017-execute-20260911T194600Z-fresh`
- `critic_finding_ids=bug0017ex-challenger-001, bug0017ex-architect-002, bug0017ex-subtractor-003` (informational NBs; not AC failures)
- `qa_critic_phase_id=sovereign-critic` (qa review), `qa_critic_model_id=gpt-5.6-luna-medium`, `qa_critic_verdict=PASS`, `qa_anti_slop_aggregate=10`, `qa_open_blocking_findings=0`
- `qa_critic_fresh_context_marker=critic-BUG0017-qa-20260911T195100Z-fresh`
- `qa_critic_finding_ids=bug0017qa-challenger-001, bug0017qa-architect-002, bug0017qa-subtractor-003` (informational; handoff proof-id truncation NB)
- `cross_reviewer_findings.open_blocking_count=0` (`handoffs/sovereign_critic_findings.jsonl`)

- `fresh_context_marker=qa-BUG0017-qa-20260911T194700Z-fresh` (NEW per US-0048 / BUG-0006; not reused from execute `dev-BUG0017-execute-20260911T192500Z-fresh` or critic `critic-BUG0017-execute-20260911T194600Z-fresh`)
- `timestamp (UTC)=2026-09-11T19:50:00Z`
- **verdict: QA_PASS**
- `plan_verify_verdict=PASS` (ultra_lean deferred — `sprints/S0135/plan-verify.json`; AC surjective 7/7 + primary acceptance row)
- `blocking_count=0`
- `non_blocking_count=3` (execute-critic carry-forwards — informational; not new blockers)
- `story_status=OPEN` (do not mark BUG-0017 DONE; acceptance BUG-0017 unchecked; intake JSON not mutated)
- `acceptance_BUG-0017=NOT ticked`
- `intake_json=NOT mutated`
- `FRAMEWORK_KIT_REPO=1` / OpenCode pack EOL / gitattributes / publish-guard / contract-test slice — no web UI; **no fake browser PASS**
- `SECURITY_REVIEW=0`, `CROSS_REPO_OBSERVABILITY=0`, `COMPONENT_SCOPE_MODE=0`
- `sibling_done=BUG-0015 DONE; BUG-0016 DONE` (do not reopen)

## Verdict rationale

Fresh QA independently remapped AC-1..AC-7 against architecture `# BUG-0017` + `tasks.md`, created deferred `plan-verify.json` (PASS / surjective), re-ran `pytest tests/bug0017_opencode_eol_test.py -v` (**6/6 PASS**) and `npm run guard:installer` (**PASS**), and spot-checked `.opencode/commands/auto.md` as LF-only (no CR). Execute proof hash **MATCH** before TTL. Blocking findings: **none**. BUG-0017 remains OPEN; acceptance unchecked; BUG-0015/0016 DONE not reopened. Critic NBs (choco before-tag ownership; DQ6 upgrade for installed CRLF; node_modules out of inventory) treated as informational.

## Test plan

| # | Check | Expected |
|---|---|---|
| 1 | Independent AC-1..AC-7 remap vs architecture + tasks | Each AC ≥1 task; primary acceptance covered |
| 2 | Create `sprints/S0135/plan-verify.json` (ultra_lean deferred) | PASS / surjective 7/7 |
| 3 | `python -m pytest tests/bug0017_opencode_eol_test.py -v` | 6/6 PASS |
| 4 | `npm run guard:installer` | PASS (OpenCode CR inventory + BUG-0008/US-0084) |
| 5 | Spot-check LF on `.opencode/commands/auto.md` | no CR bytes |
| 6 | `.gitattributes` six scoped OpenCode LF rows; no repo-wide `*.md` | present / absent |
| 7 | Active↔template guard + test + runbook parity | byte-identical |
| 8 | Execute DEC-0038 proof consume | MATCH before TTL |
| 9 | Status OPEN; acceptance unchecked; BUG-0015/0016 DONE held | unchanged |
| 10 | UAT probes | `contract_tests_primary` PASS; live classes waived |
| 11 | Emit `convergence_smoke` when `contract_test_failed=0` | present, `result=pass` |

## Independent checks (this qa subagent)

| Check | Command / method | Result |
|---|---|---|
| Execute proof SHA-256 | Python hashlib sorted-key compact JSON | **MATCH** `7B9319A03BA2399F67DD87F25334DEF7ECE7FD250DBEA8ABC5DC42ED22B01936`; ttl `2026-09-11T20:45:00Z`; consumed_at `2026-09-11T19:50:00Z` — **RUNTIME_PROOF_VALID** |
| BUG-0017 contract tests | `python -m pytest tests/bug0017_opencode_eol_test.py -v` | **6 passed** in 0.23s |
| Guard installer | `npm run guard:installer` | **PASS** (dash skipped on Windows PATH; Python CRLF + token + OpenCode inventory enforced) |
| LF spot-check auto.md | binary read `.opencode/commands/auto.md` | **LF-only** (`has_CR=False`; size 211) |
| LF spot-check peers | `.opencode/commands/intake.md`, `template/.opencode/commands/auto.md` | **LF-only** |
| `.gitattributes` DQ1 | six scoped rows present; exact `*.md text eol=lf` line absent | **PASS** |
| Template byte pairs | `filecmp` guard / test / runbook | **3/3 IDENTICAL** |
| Triad hot-surface | `python scripts/enforce-triad-hot-surface.py --check` | **exit 0** (pre-write) |
| Backlog / acceptance | Status + checkbox spot-check | OPEN; acceptance `- [ ] BUG-0017` |
| Full harness `tests/run-tests.ps1` | not re-run this pass | **not claimed** — scoped slice + guard are the required gates |

## Blocking findings

None.

## Non-blocking findings (critic NB carry-forwards — informational)

| ID | Topic | QA note |
|---|---|---|
| NB1 / bug0017ex-challenger-001 | choco before-tag enforcement owned by QA/release | Comment present in `chocolateyInstall.ps1` + runbook before-tag note; release owns tag-time gate. Does **not** fail AC-4. |
| NB2 / bug0017ex-architect-002 | DQ6 upgrade for already-installed CRLF trees | Runbook documents `upgrade --host opencode\|both`; kit-only insufficient. Does **not** fail AC-6. |
| NB3 / bug0017ex-subtractor-003 | node_modules CR out of inventory; no scope creep | Expected (DQ5 inventory excludes). A2–A5 + companion DEC rejected held; no DONE flip. Not blocking. |

## AC remap (independent — files + tests)

| AC | Delivered surface | Task(s) / markers | Result |
|---|---|---|---|
| AC-1 Linux slash commands | DQ1 attrs + LF normalize + no-CR pack + guard | T-001, T-002, T-003, T-005 (m1–m4) | **PASS** |
| AC-2 Shipped pack no CRLF | Normalize + guard inventory + no-CR tests | T-002, T-003, T-005 (m2–m4) | **PASS** |
| AC-3 Scoped attrs only | Six `.gitattributes` OpenCode LF rows; no repo-wide `*.md` | T-001, T-005 (m1) | **PASS** |
| AC-4 Publish/CI fail-closed + before-tag | Guard OpenCode `\r` reject; marker 5 compose; runbook/choco before-tag | T-003, T-005 (m4–m5), T-007 | **PASS** |
| AC-5 Active↔template parity | Guard + test + runbook identical; marker 6 | T-004, T-005 (m6) | **PASS** |
| AC-6 Consumer upgrade recipe | Runbook DQ6 `upgrade --host opencode\|both` | T-006 | **PASS** |
| AC-7 Compose BUG-0008 / US-0084 | Marker 5 still enforces installer.sh + manifests | T-anch, T-005 (m5) | **PASS** |

**Overall AC gate**: **PASS** (slice) — Status remains OPEN; backlog/acceptance checkboxes **not** ticked (US-0045; `/verify-work` ownership).

## Contract marker results (6/6 slice)

| # | Marker | Result |
|---|---|---|
| 1 | `test_bug0017_gitattributes_scoped_opencode_eol_lf` | PASS |
| 2 | `test_bug0017_no_cr_in_active_opencode_pack_text` | PASS |
| 3 | `test_bug0017_no_cr_in_template_opencode_pack_text` | PASS |
| 4 | `test_bug0017_guard_installer_publish_rejects_opencode_cr` | PASS |
| 5 | `test_bug0017_guard_still_enforces_installer_sh_and_manifests` | PASS |
| 6 | `test_bug0017_active_template_opencode_tracked_text_parity` | PASS |

## Template byte-identity (BUG-0017 pairs)

| Pair | Result |
|---|---|
| `scripts/guard_installer_publish.py` | IDENTICAL |
| `tests/bug0017_opencode_eol_test.py` | IDENTICAL |
| `docs/engineering/runbook.md` | IDENTICAL |

## Compose / scope gates

| Gate | Result |
|---|---|
| BUG-0008 / US-0084 compose (extended, not weakened) | HELD |
| DEC-0120 compose (upgrade path documented; no DEC body amend) | HELD |
| BUG-0015 / BUG-0016 DONE | HELD (not reopened) |
| US-0045 Status OPEN / acceptance unchecked | HELD |
| No install EOL rewrite | HELD |
| No repo-wide `*.md eol=lf` | HELD |
| No companion DEC | HELD |
| No live OpenCode CI probe | HELD |
| Exactly 6 `test_bug0017_*` markers | HELD |

## UAT / convergence (US-0128)

- Contract slice green (`contract_test_failed=0`); `guard:installer` PASS; LF spot-check PASS.
- Canonical `convergence_smoke` recorded as **pass** in `sprints/S0135/uat.json`.
- Six live-runtime probe classes waived `UAT_PROBE_FORBIDDEN` (FRAMEWORK_KIT_REPO=1; no live OpenCode probe).
- Ultra_lean: QA merged AC checklist into `uat.json` / this file; operator UAT ticks and DONE remain `/verify-work` / closure ownership.
- Full UAT ownership remains with `/verify-work` (do not flip DONE / tick ACs here).

## UAT probes (FRAMEWORK_KIT_REPO=1 — honest classification)

Applicable probe class: **`contract_tests_primary`** (6 markers). No web UI. No fake browser PASS. Live-runtime / live OpenCode probes **not attempted** (`UAT_PROBE_FORBIDDEN` if attempted).

Canonical surrogate step **`convergence_smoke`** emitted this pass (`result=pass`) because `contract_test_failed=0`.

| Probe class | Classification | reason_code |
|---|---|---|
| `browser_smoke` | waived / not applicable | `UAT_PROBE_FORBIDDEN` |
| `api_health` | waived / not applicable | `UAT_PROBE_FORBIDDEN` |
| `process_health` | waived / not applicable | `UAT_PROBE_FORBIDDEN` |
| `cli_smoke` | not applicable (no live OpenCode CI probe) | `UAT_PROBE_FORBIDDEN` |
| `build` | not applicable | `UAT_PROBE_FORBIDDEN` |
| `manual_operator` | deferred to verify-work / operator Linux host | `UAT_PROBE_FORBIDDEN` |

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
- `runtime_reason_code`: `UAT_PROBE_FORBIDDEN` for browser/runtime-app probes; slice health is contract tests + guard + `convergence_smoke` surrogate
- `runtime_evidence_refs`: pytest 6/6; `npm run guard:installer` PASS; LF spot-check `.opencode/commands/auto.md`; `sprints/S0135/uat.json` `convergence_smoke`

## Generated-test evidence (US-0066)

- `generated_test_stack_profile`: python
- `generated_test_command`: `python -m pytest tests/bug0017_opencode_eol_test.py -v`
- `generated_test_result`: pass
- `generated_test_output_ref`: this file § Independent checks (6 passed in 0.23s)
- `generated_test_paths_ref`: `tests/bug0017_opencode_eol_test.py`
- `generated_test_reason_code`: none (pass)

## Status confirmation (US-0045)

- backlog `### BUG-0017` Status: **OPEN**
- acceptance BUG-0017: **unchecked** (`- [ ] BUG-0017`)
- BUG-0015 / BUG-0016: **DONE** (not reopened)
- intake JSON not mutated this phase
- architecture.md `# BUG-0017` not mutated this phase
- R-0118 body not mutated this phase

## Producer proof consumed (execute)

- `producer_runtime_proof_id=rp-auto-20260911-bug0017-execute-dev-20260911T194500Z-BUG-0017`
- Canonical payload independently hashed: `{"delivery_mode":"ultra_lean","macro_phase":"build+verify","model_id":"composer-2.5","orchestrator_run_id":"auto-20260911-bug0017","phase_id":"execute","proof_issued_at":"2026-09-11T19:45:00Z","proof_ttl_seconds":3600,"role":"dev","runtime_proof_id":"rp-auto-20260911-bug0017-execute-dev-20260911T194500Z-BUG-0017","sprint_id":"S0135","story_id":"BUG-0017"}`
- `producer_attested_proof_hash=7B9319A03BA2399F67DD87F25334DEF7ECE7FD250DBEA8ABC5DC42ED22B01936`
- Independent SHA-256 recompute: **MATCH**
- `producer_proof_ttl=2026-09-11T20:45:00Z`, `consumed_at=2026-09-11T19:50:00Z` (before RUNTIME_PROOF_STALE)
- `producer_ttl_stale=false`
- `producer_fresh_context_marker=dev-BUG0017-execute-20260911T192500Z-fresh`
- Critic consume of same tuple at 2026-09-11T19:46:00Z recorded; this qa consume is independent MATCH-before-TTL

## Strict runtime proof (DEC-0038) — qa

- `orchestrator_run_id=auto-20260911-bug0017`
- `runtime_proof_id=rp-auto-20260911-bug0017-qa-qa-20260911T195000Z-BUG-0017` (NEW unique — distinct from execute / plan-verify)
- `phase_id=qa`, `role=qa`, `story_id=BUG-0017`, `sprint_id=S0135`
- `delivery_mode=ultra_lean`, `macro_phase=build+verify`, `model_id=composer-2.5`
- `proof_issued_at=2026-09-11T19:50:00Z`
- `proof_ttl_seconds=3600`, `proof_ttl=2026-09-11T20:50:00Z` (UTC = issued_at + 3600s)
- `proof_hash=65A7F3ADFA440248BEA7A83A908680AB5AC270FF79DF7E2A2ECD0ECFDD30B441` (SHA-256 of sorted-key compact lowercase-keys JSON payload, UTF-8 bytes via Python hashlib)
- Canonical payload: `{"delivery_mode":"ultra_lean","macro_phase":"build+verify","model_id":"composer-2.5","orchestrator_run_id":"auto-20260911-bug0017","phase_id":"qa","proof_issued_at":"2026-09-11T19:50:00Z","proof_ttl_seconds":3600,"role":"qa","runtime_proof_id":"rp-auto-20260911-bug0017-qa-qa-20260911T195000Z-BUG-0017","sprint_id":"S0135","story_id":"BUG-0017"}`

## Strict runtime proof (DEC-0038) — plan-verify (ultra_lean merged)

- `runtime_proof_id=rp-auto-20260911-bug0017-plan-verify-qa-20260911T195000Z-BUG-0017`
- `phase_id=plan-verify`, `role=qa`
- `proof_issued_at=2026-09-11T19:50:00Z`, `proof_ttl=2026-09-11T20:50:00Z`
- `proof_hash=58D69A19144D54A3854F133B77648F474A2A9E16F3E5EEA17235487AA4CB8C52`
- Canonical payload: `{"delivery_mode":"ultra_lean","macro_phase":"build+verify","model_id":"composer-2.5","orchestrator_run_id":"auto-20260911-bug0017","phase_id":"plan-verify","proof_issued_at":"2026-09-11T19:50:00Z","proof_ttl_seconds":3600,"role":"qa","runtime_proof_id":"rp-auto-20260911-bug0017-plan-verify-qa-20260911T195000Z-BUG-0017","sprint_id":"S0135","story_id":"BUG-0017"}`

## Isolation evidence (US-0048 / DEC-0029 / US-0104 v2)

- `phase_id=qa`, `role=qa`, `model_id=composer-2.5` (CROSS_MODEL_REVIEW=1 — required)
- `fresh_context_marker=qa-BUG0017-qa-20260911T194700Z-fresh` (NEW per US-0048 / BUG-0006)
- `timestamp=2026-09-11T19:50:00Z` (UTC)
- `evidence_ref=sprints/S0135/qa-findings.md; sprints/S0135/plan-verify.json; sprints/S0135/uat.json; sprints/S0135/uat.md`
- Fresh qa subagent per BUG-0006 / US-0048 isolation; no prior chat history carried forward. Context limited to narrow-read (US-0053). No `.env` reads, no credentials access, no intake-evidence mutation, no backlog Status/AC mutation (qa_notes append only), no acceptance.md mutation, no architecture.md mutation, no DONE-row mutation, no `/execute` or `/verify-work` spawn from this subagent.

## Next scheduled phase

- `next_scheduled_phase=/verify-work` (role=qa per US-0069 / DEC-0051; fresh qa subagent per BUG-0006 — orchestrator-owned spawn; after sovereign-critic of qa if CROSS_MODEL_REVIEW=1)
- `next_scheduled_role=qa`
- `stop_condition=STOP after qa PASS. Orchestrator spawns sovereign-critic of qa (CROSS_MODEL_REVIEW=1), then /verify-work in a fresh qa subagent (BUG-0006). Do NOT spawn /verify-work or /execute from this subagent. Do NOT mark BUG-0017 DONE. Do NOT tick acceptance. Do NOT mutate intake JSON. Do NOT mutate architecture.md. Do NOT reopen BUG-0015/BUG-0016.`
- `artifacts_written=sprints/S0135/qa-findings.md, sprints/S0135/plan-verify.json, sprints/S0135/uat.json, sprints/S0135/uat.md, sprints/S0135/progress.md, docs/engineering/state.md (qa checkpoint append), handoffs/qa_to_verify.md (prepend), handoffs/resume_brief.md (qa PASS prepend → /verify-work)`
- `handoffs/qa_to_dev.md=NOT written` (no blocking findings; AUTO_IMPLEMENTATION_LOOP does not return to /execute)
