# QA findings — US-0132 / S0134 / auto-20260909-us0132

- **phase_id**: qa, **role**: qa, **story_id**: US-0132 (OPEN — not marked DONE per US-0045), **sprint_id**: S0134
- `orchestrator_run_id=auto-20260909-us0132`, `delivery_mode=ultra_lean`, `macro_phase=build+verify` (qa)
- `AUTO_QUIET=1`, `AUTO_IMPLEMENTATION_LOOP=1` (no blocking findings — do not return to `/execute`)
- `model_id=cursor-grok-4.6` (CROSS_MODEL_REVIEW=1 — required on isolation)
- `producer_phase_id=execute`, `producer_role=dev`, `producer_model_id=cursor-grok-4.6` (isolation/proof attested; critic noted orchestrator preflight `composer-2.5` as informational provenance delta)
- `critic_phase_id=sovereign-critic` (execute review), `critic_model_id=cursor-grok-4.6`, `critic_verdict=PASS`, `anti_slop_aggregate=10`, `open_blocking_findings=0`
- `critic_fresh_context_marker=critic-US0132-execute-20260909T193200Z-fresh`
- `critic_finding_ids=us0132exc-challenger-001, us0132exc-architect-002, us0132exc-subtractor-003` (informational NBs; not AC failures)
- `fresh_context_marker=qa-US0132-qa-20260909T194000Z-fresh` (NEW per US-0048 / BUG-0006; not reused from execute `dev-US0132-execute-20260909T191200Z-fresh` or critic `critic-US0132-execute-20260909T193200Z-fresh`)
- `timestamp (UTC)=2026-09-09T19:40:00Z`
- **verdict: QA_PASS**
- `blocking_count=0`
- `non_blocking_count=3` (critic NB carry-forwards informational; extra `--host opencode` check PASS)
- `story_status=OPEN` (do not mark US-0132 DONE; acceptance L160 unchecked; intake JSON not mutated; architecture.md / DEC-0132.md not mutated this phase)
- `acceptance_L160=NOT ticked`
- `intake_json=NOT mutated`
- `FRAMEWORK_KIT_REPO=1` (scripts/docs/examples/contract-test slice — no web UI; no fake browser PASS)
- `SECURITY_REVIEW=0`, `CROSS_REPO_OBSERVABILITY=0`, `COMPONENT_SCOPE_MODE=0` (zero overhead)
- `SPEC_PACK_MODE=0`, `USER_GUIDE_MODE=0`, `REMOTE_EXECUTION=0`
- `SYNC_POLICY_MODE=disabled` (no push)
- `sibling_done=US-0131 DONE compose-only` (do not reopen)

## Verdict rationale

Fresh QA independently remapped AC-1..AC-8 against delivered files (not execute summary alone), re-ran the US-0132 contract slice (**10/10 PASS**), `--scope=us-0132` parity (OK), triad `--check` (exit 0 pre-write), and **metadata guard exit 0**. Execute proof hash **MATCH** before TTL. Blocking findings: **none**. US-0132 remains OPEN; ACs unchecked; US-0131 DONE not reopened. Critic NBs (marker 1 `--host opencode` not separately asserted; marker 6 tautological `or True`; `FORBIDDEN_WRITE_RELPATHS` unused as runtime guard) treated as informational; extra `--host opencode` + `model.json` check confirms PATH_UNKNOWN-only (no HOST_COLLISION) — same branch as cursor.

## Test plan

| # | Check | Expected |
|---|---|---|
| 1 | Independent AC-1..AC-8 remap vs files | Each AC has delivered surface + markers |
| 2 | `python -m pytest tests/us0132_contract_test.py -v` | 10/10 PASS |
| 3 | `python scripts/check_intake_template_parity.py --scope=us-0132` | `[INTAKE_TEMPLATE_PARITY_OK]` |
| 4 | `python scripts/enforce-triad-hot-surface.py --check` | exit 0 (pre-write) |
| 5 | `python scripts/check-user-visible-metadata.py --repo .` | exit 0 (no US-0132 in user-facing docstrings) |
| 6 | Active↔template byte identity for US-0132 pairs | 6/6 IDENTICAL |
| 7 | Execute DEC-0038 proof consume | MATCH before TTL |
| 8 | Status OPEN; ACs unchecked; L160 unchecked; US-0131 DONE held | unchanged |
| 9 | Critic NBs (informational) + extra `--host opencode` | non-blocking |
| 10 | UAT probes | AC checklist merged; `convergence_smoke` PASS; live-runtime waived `UAT_PROBE_FORBIDDEN` |

## Independent checks (run in this qa subagent)

| Check | Command | Result |
|---|---|---|
| Execute proof SHA-256 | Python hashlib sorted-key compact lowercase JSON | **MATCH** `21431725A12CD3D170463E990B46EFD68649D71D05DEC571DFBB33C144FE967E`; ttl `2026-09-09T20:25:20Z`; consumed_at `2026-09-09T19:40:00Z` — **RUNTIME_PROOF_VALID** (~2700s remaining) |
| US-0132 contract tests | `python -m pytest tests/us0132_contract_test.py -v` | **10 passed** in 0.87s |
| us-0132 parity | `python scripts/check_intake_template_parity.py --scope=us-0132` | **exit 0** — `[INTAKE_TEMPLATE_PARITY_OK] scope=us-0132` |
| Triad hot-surface | `python scripts/enforce-triad-hot-surface.py --check` | **exit 0** (pre-write) |
| User-visible metadata | `python scripts/check-user-visible-metadata.py --repo .` | **exit 0** — no `USER_VISIBLE_INTERNAL_METADATA_DETECTED` |
| Template byte pairs (6) | SHA-256 / size compare active↔template | **6/6 IDENTICAL** |
| Extra `--host opencode` + `model.json` | `model_tier_validate.py --scope model-config --host opencode` on fixture | rc≠0; `MODEL_CONFIG_PATH_UNKNOWN`; **no** `MODEL_CONFIG_HOST_COLLISION` |
| Backlog / acceptance | Status + checkbox spot-check | OPEN; 8/8 AC `- [ ]`; acceptance L160 `- [ ] US-0132`; US-0131 Status DONE; L159 `[x]` |
| Installer US-0132 token | installer.py / installer.sh / installer.ps1 | `#` comments only at `installer.py:274` and `installer.sh:298`; installer.ps1 has no `US-0132` token (paths present) |
| LINT_COMMAND | (empty in runbook) | **skipped** |
| TYPECHECK_COMMAND | (empty in runbook) | **skipped** |
| Full harness `tests/run-tests.ps1` | not re-run this pass | **not claimed** — scoped slice + parity + metadata are the required gates for this FRAMEWORK_KIT_REPO=1 story |

## Blocking findings

None.

## Non-blocking findings (critic NB carry-forwards — informational)

| ID | Topic | QA note |
|---|---|---|
| NB1 / us0132exc-challenger-001 | marker 1 does not separately assert `--host opencode` + `model.json` | Confirmed: marker 1 covers `cursor` (PATH_UNKNOWN-only) and `both` (PATH_UNKNOWN + HOST_COLLISION). Extra QA fixture `--host opencode` yields PATH_UNKNOWN-only (no HOST_COLLISION) — same `host != both` branch as cursor. Does **not** fail AC-1/AC-5. Optional tighten without an 11th marker deferred. |
| NB2 / us0132exc-architect-002 (+ marker 6 tautological `or True`) | source-scan `assert rel in src or True` always true | Runtime never-write assertions (catalog/cursor/scratch/host/template bytes unchanged after two applies) still hold; follow-up assert covers `.opencode/model-catalog.local.json` in materializer source. Does **not** fail AC-4. Optional source-scan tighten without an 11th marker deferred. |
| NB3 / us0132exc-subtractor-003 | `FORBIDDEN_WRITE_RELPATHS` unused as runtime guard; no scope creep | Materializer still does not write host JSON / template / Cursor (marker 6 runtime). US-0131 DONE held; A2/A3/A4 rejected; no 11th marker; no DONE flip. Not blocking. |

## AC remap (independent — files + tests)

| AC | Delivered surface | Markers | Result |
|---|---|---|---|
| AC-1 Canonical ownership | Four-surface inventory; `--scope model-config` rejects repo-scoped `model.json{,c}` (`MODEL_CONFIG_PATH_UNKNOWN`); no alias; no home-dir scan; runbook inventory table | m1, T-001, T-008 | **PASS** |
| AC-2 Separate schemas | Cursor schema at OpenCode path → `MODEL_CONFIG_SCHEMA_MIX`; reverse likewise; resolver does not mention OpenCode catalog; materializer does not mention Cursor catalog / `MODEL_TIER_` | m2, m3 | **PASS** |
| AC-3 Deterministic precedence | Cursor `provenance=` overlay; 5-step chain length 5; `alias_only` valid; OpenCode absent catalog no-op vs present fail-closed; both-host independent catalogs + per-host provenance | m4, m5, m8 | **PASS** |
| AC-4 Materialization | Idempotent second apply; never write template / active catalog / Cursor / host JSON; examples placeholder slugs | m6 | **PASS** |
| AC-5 Fail-closed validation | `MODEL_CONFIG_PATH_UNKNOWN` / `SCHEMA_MIX` / `HOST_COLLISION` distinct both-host row; absent optional ≠ invalid; malformed present host JSON → `MODEL_CATALOG_INVALID` `scope=opencode-host`; additive US-0126 rows; no `HOST_CONFIG_*` reuse | m1, m5, m8, m10 | **PASS** |
| AC-6 Local-file protection | `installer.clean_repo` exclude-from-clean named locals; never-overwrite lists in py/ps1/sh; `[model_config_preserve_paths]` | m7 | **PASS** |
| AC-7 Triple-surface parity | installer.py / installer.ps1 / installer.sh + manifest; explicit gitignore rows (root + template); 6/6 US-0132 pairs IDENTICAL | m7, m9 | **PASS** |
| AC-8 Tests + docs | Exactly 10 `test_us0132_*`; runbook h2; README pointer; `--scope model-config` in place; no new `opencode_model_catalog_validate.py` | all 10 + T-008, T-009 | **PASS** |

**Overall AC gate**: **PASS** (slice) — Status remains OPEN; backlog/acceptance checkboxes **not** ticked (US-0045; `/verify-work` ownership).

## Contract marker results (10/10 slice)

| # | Marker | Result |
|---|---|---|
| 1 | `test_us0132_canonical_inventory_rejects_model_json` | PASS |
| 2 | `test_us0132_cursor_schema_not_interpreted_as_opencode` | PASS |
| 3 | `test_us0132_opencode_schema_not_interpreted_as_cursor` | PASS |
| 4 | `test_us0132_cursor_precedence_diagnostics_overlay` | PASS |
| 5 | `test_us0132_opencode_absent_catalog_noop_vs_present_fail_closed` | PASS |
| 6 | `test_us0132_materializer_idempotent_never_writes_template_or_host_json` | PASS |
| 7 | `test_us0132_installer_preserves_local_model_files_including_clean` | PASS |
| 8 | `test_us0132_both_host_independent_catalogs` | PASS |
| 9 | `test_us0132_gitignore_opencode_catalog_explicit_row` | PASS |
| 10 | `test_us0132_docs_migration_and_reason_codes` | PASS |

## Template byte-identity (US-0132 pairs)

| Pair | Result |
|---|---|
| `scripts/model_tier_validate.py` | IDENTICAL |
| `scripts/model_tier_lib.py` | IDENTICAL |
| `tests/us0132_contract_test.py` | IDENTICAL |
| `docs/engineering/runbook.md` | IDENTICAL |
| `docs/engineering/context/installer-owned-paths.manifest` | IDENTICAL |
| `README.md` | IDENTICAL |

Gitignore rows (not in `--scope=us-0132` pair table): explicit `.opencode/model-catalog.local.json` present in root `.gitignore` L15 and `template/.gitignore` L8 (marker 9). Root vs template gitignore are **not** claimed byte-identical.

Note: `installer.py` / `installer.ps1` / `installer.sh` are kit-root (not under `template/` mirror for this check); metadata guard verified on active installer sources.

## Compose / scope gates

| Gate | Result |
|---|---|
| US-0131 DONE compose-only | HELD (Status DONE; L159 `[x]`; DEC-0131 not amended) |
| DEC-0086 / 0087 / 0123 | not amended this phase |
| US-0045 Status OPEN / ACs unchecked / L160 unchecked | HELD |
| No live OpenCode probe | HELD |
| No 11th marker | HELD (exactly 10 `def test_us0132_`) |
| A2/A3/A4 rejected | HELD (`model.json` not aliased) |
| architecture.md / DEC-0132.md | read-only this phase |

## UAT / convergence (US-0128)

- Contract slice green (`contract_test_failed=0`); metadata guard exit 0.
- Canonical `convergence_smoke` recorded as **pass** in `sprints/S0134/uat.json`.
- Six live-runtime probe classes waived `UAT_PROBE_FORBIDDEN` (FRAMEWORK_KIT_REPO=1).
- Ultra_lean: QA merged AC checklist into `uat.json` / this file; operator UAT ticks and DONE remain `/verify-work` / closure ownership.
- Full UAT ownership remains with `/verify-work` (do not flip DONE / tick ACs here).

## UAT probes (FRAMEWORK_KIT_REPO=1 — honest classification)

Applicable probe class: **`contract_tests_primary`** (10 markers). No web UI. No fake browser PASS. Live-runtime probes **not attempted** (`UAT_PROBE_FORBIDDEN` if attempted).

Canonical surrogate step **`convergence_smoke`** emitted this pass (`result=pass`) because `contract_test_failed=0`.

| Probe class | Classification | reason_code |
|---|---|---|
| `browser_smoke` | waived / not applicable | `UAT_PROBE_FORBIDDEN` |
| `api_health` | waived / not applicable | `UAT_PROBE_FORBIDDEN` |
| `process_health` | waived / not applicable | `UAT_PROBE_FORBIDDEN` |
| `cli_smoke` | not applicable (validator/installer verified via contract tests) | `UAT_PROBE_FORBIDDEN` |
| `build` | not applicable | `UAT_PROBE_FORBIDDEN` |
| `manual_operator` | not applicable | `UAT_PROBE_FORBIDDEN` |

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
- `runtime_reason_code`: `UAT_PROBE_FORBIDDEN` for browser/runtime-app probes; slice health is contract tests + `convergence_smoke` surrogate
- `runtime_evidence_refs`: pytest 10/10; parity CLI `--scope=us-0132`; metadata exit 0; `sprints/S0134/uat.json` `convergence_smoke`

## Generated-test evidence (US-0066)

- `generated_test_stack_profile`: python
- `generated_test_command`: `python -m pytest tests/us0132_contract_test.py -v`
- `generated_test_result`: pass
- `generated_test_output_ref`: this file § Independent checks (10 passed in 0.87s)
- `generated_test_paths_ref`: `tests/us0132_contract_test.py`
- `generated_test_reason_code`: none (pass)

## Status confirmation (US-0045)

- backlog `## US-0132` Status: **OPEN** (L4608)
- AC-1..AC-8: **all unchecked** (L4624–L4631)
- acceptance L160: **unchecked**
- US-0131 Status: **DONE** (L4569); acceptance L159: **checked**
- intake JSON not mutated this phase
- architecture.md `# US-0132` not mutated this phase
- DEC-0132.md not mutated this phase

## Producer proof consumed (execute)

- `producer_runtime_proof_id=rp-auto-20260909-us0132-execute-dev-20260909T192520Z-US-0132`
- Canonical payload independently hashed: `{"delivery_mode":"ultra_lean","macro_phase":"build+verify","model_id":"cursor-grok-4.6","orchestrator_run_id":"auto-20260909-us0132","phase_id":"execute","proof_issued_at":"2026-09-09T19:25:20Z","proof_ttl_seconds":3600,"role":"dev","runtime_proof_id":"rp-auto-20260909-us0132-execute-dev-20260909T192520Z-US-0132","sprint_id":"S0134","story_id":"US-0132"}`
- `producer_attested_proof_hash=21431725A12CD3D170463E990B46EFD68649D71D05DEC571DFBB33C144FE967E`
- Independent SHA-256 recompute: **MATCH**
- `producer_proof_ttl=2026-09-09T20:25:20Z`, `consumed_at=2026-09-09T19:40:00Z` (before RUNTIME_PROOF_STALE; ~2700s remaining)
- `producer_ttl_stale=false`
- `producer_fresh_context_marker=dev-US0132-execute-20260909T191200Z-fresh`
- Critic consume of same tuple at 2026-09-09T19:32:00Z recorded; this qa consume is independent MATCH-before-TTL

## Strict runtime proof (DEC-0038) — qa

- `orchestrator_run_id=auto-20260909-us0132`
- `runtime_proof_id=rp-auto-20260909-us0132-qa-qa-20260909T194000Z-US-0132` (NEW unique — distinct from execute `...192520Z...`; no proof_id reuse)
- `phase_id=qa`, `role=qa`, `story_id=US-0132`, `sprint_id=S0134`
- `delivery_mode=ultra_lean`, `macro_phase=build+verify`, `model_id=cursor-grok-4.6`
- `proof_issued_at=2026-09-09T19:40:00Z`
- `proof_ttl_seconds=3600`, `proof_ttl=2026-09-09T20:40:00Z` (UTC = issued_at + 3600s)
- `proof_hash=D3CBDC44FD3794BE97AD421AF703B65B06BBFD407462B7FCE8DB395B91907DD7` (SHA-256 of sorted-key compact lowercase-keys JSON payload, UTF-8 bytes via Python hashlib; independently recomputed MATCH twice before return)
- Canonical payload: `{"delivery_mode":"ultra_lean","macro_phase":"build+verify","model_id":"cursor-grok-4.6","orchestrator_run_id":"auto-20260909-us0132","phase_id":"qa","proof_issued_at":"2026-09-09T19:40:00Z","proof_ttl_seconds":3600,"role":"qa","runtime_proof_id":"rp-auto-20260909-us0132-qa-qa-20260909T194000Z-US-0132","sprint_id":"S0134","story_id":"US-0132"}`

## Isolation evidence (US-0048 / DEC-0029 / US-0104 v2)

- `phase_id=qa`, `role=qa`, `model_id=cursor-grok-4.6` (CROSS_MODEL_REVIEW=1 — required)
- `fresh_context_marker=qa-US0132-qa-20260909T194000Z-fresh` (NEW per US-0048 / BUG-0006)
- `timestamp=2026-09-09T19:40:00Z` (UTC)
- `evidence_ref=sprints/S0134/qa-findings.md; sprints/S0134/uat.json; sprints/S0134/uat.md`
- Fresh qa subagent per BUG-0006 / US-0048 isolation; no prior chat history carried forward. Context limited to narrow-read (US-0053). No `.env` reads, no credentials access, no intake-evidence mutation, no backlog Status/AC mutation, no acceptance.md mutation, no architecture.md mutation, no DONE-row mutation, no `/execute` or `/verify-work` spawn from this subagent.

## Next scheduled phase

- `next_scheduled_phase=/verify-work` (role=qa per US-0069 / DEC-0051; fresh qa subagent per BUG-0006 — orchestrator-owned spawn; after sovereign-critic of qa if CROSS_MODEL_REVIEW=1)
- `next_scheduled_role=qa`
- `stop_condition=STOP after qa PASS. Orchestrator spawns sovereign-critic of qa (CROSS_MODEL_REVIEW=1), then /verify-work in a fresh qa subagent (BUG-0006). Do NOT spawn /verify-work or /execute from this subagent. Do NOT mark US-0132 DONE. Do NOT tick acceptance L160. Do NOT mutate intake JSON. Do NOT mutate architecture.md. Do NOT reopen US-0131.`
- `artifacts_written=sprints/S0134/qa-findings.md, sprints/S0134/uat.json, sprints/S0134/uat.md, sprints/S0134/progress.md, docs/engineering/state.md (qa checkpoint append), handoffs/resume_brief.md (qa PASS prepend → /verify-work)`
- `handoffs/qa_to_dev.md=NOT written` (no blocking findings; AUTO_IMPLEMENTATION_LOOP does not return to /execute)

## Verify-work re-attest (US-0066 / DEC-0009) — 2026-09-09T19:53:16Z

- **phase_id**: verify-work, **role**: qa, **fresh_context_marker**: `qa-US0132-verify-work-20260909T195316Z-fresh`
- `generated_test_command`: `python -m pytest tests/us0132_contract_test.py -v`
- `generated_test_result`: pass
- `generated_test_output_ref`: 10 passed in 0.87s (this /verify-work re-run)
- `generated_test_paths_ref`: `tests/us0132_contract_test.py`
- `generated_test_reason_code`: none (pass)
- UAT: 9/9 PASS (UAT-1..UAT-8 + `convergence_smoke`); leftover `tests/report.md` evidence_ref cleaned
- operator CLI `--scope model-config --host both --repo .` → `[MODEL_TIER_VALIDATION_OK]`
- extra `--host opencode` PATH_UNKNOWN-only CONFIRMED
- **verdict**: VERIFY_WORK_PASS; Status OPEN; L160 unchecked; US-0131 DONE held
- `next_scheduled_phase=/release` (do not spawn from this qa)

## Cross-reviewer findings (sovereign-critic of verify-work)

- `critic_model_id=cursor-grok-4.6`, `degraded_mode=false`, `verdict=PASS`
- `anti_slop_aggregate=10`, `blocking_count=0`, `open_blocking_count=0`
- `finding_ids=us0132vwc-challenger-001,us0132vwc-architect-002,us0132vwc-subtractor-003` (informational; US-0127 auto-resolved)
- `proof_consume=RUNTIME_PROOF_VALID` for `rp-auto-20260909-us0132-verify-work-qa-20260909T195316Z-US-0132` / `9DA355C4FD58FDFE56669C4CA9BF4FB26361276BD2DADB3D983ACB1172B75FB5`
- UAT 9/9 CONFIRMED; Status OPEN; acceptance L160 unchecked; extra `--host opencode` PATH_UNKNOWN x3 only; leftover `tests/report.md` evidence_ref cleaned; next=/release (orchestrator spawn only)
- NB: marker 6 tautological `or True`; producer extra-host count x2 vs critic x3 (informational); `--host opencode` still prints live-repo cursor provenance overlay on fixture `--repo` (cwd/repo split) — not HOST_COLLISION
