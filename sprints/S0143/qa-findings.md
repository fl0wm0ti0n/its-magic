# QA findings — US-0137 / S0143 / auto-20260913-us0137 (qa)

- **phase_id**: qa, **role**: qa, **story_id**: US-0137 (OPEN — not marked DONE per US-0045), **sprint_id**: S0143
- `orchestrator_run_id=auto-20260913-us0137`, `parent_run=auto-20260913-us0136`, `delivery_mode=ultra_lean`, `macro_phase=build+verify`
- `AUTO_IMPLEMENTATION_LOOP=1` (no blocking findings — do not return to `/execute`)
- `AUTO_QUIET=1`
- `FRAMEWORK_KIT_REPO=1`
- `SECURITY_REVIEW=0`
- `model_id=cursor-grok-4.6-high` (CROSS_MODEL_REVIEW=1 — required on isolation)
- `producer_phase_id=execute`, `producer_role=dev`, `producer_model_id=cursor-grok-4.6-high`
- `critic_phase_id=sovereign-critic` (execute review), `critic_model_id=composer-2.5-fast`, `critic_verdict=PASS`, `anti_slop_aggregate=10`, `open_blocking_findings=0`
- `critic_fresh_context_marker=critic-US0137-execute-20260913T114500Z-fresh`
- `critic_finding_ids=us0137ex-challenger-001, us0137ex-architect-002, us0137ex-subtractor-003` (informational NBs; not AC failures)
- `cross_reviewer_findings.open_blocking_count=0` (`handoffs/sovereign_critic_findings.jsonl`)

- `fresh_context_marker=qa-US0137-qa-20260913T115500Z-fresh` (NEW per US-0048 / BUG-0006; not reused from execute `dev-US0137-execute-20260913T113500Z-fresh` or critic `critic-US0137-execute-20260913T114500Z-fresh`)
- `timestamp (UTC)=2026-09-13T11:55:00Z` (orchestrator-specified)
- **verdict: QA_PASS**
- `plan_verify_verdict=PASS` (ultra_lean deferred — `sprints/S0143/plan-verify.json` SKIPPED placeholder treated as PASS; 8/8 AC surjective in sprint-plan + this remap + primary acceptance row)
- `blocking_count=0`
- `non_blocking_count=3` (execute-critic carry-forwards — informational; not new blockers)
- `story_status=OPEN` (do not mark US-0137 DONE; acceptance US-0137 unchecked; intake JSON not mutated)
- `acceptance_US-0137=NOT ticked`
- `intake_json=NOT mutated`
- `FRAMEWORK_KIT_REPO=1` / unpublished in-tree `standalone/` policy-engine + tool-broker contract-test slice — no web UI; **no fake browser PASS**
- `SECURITY_REVIEW=0`, `CROSS_REPO_OBSERVABILITY=0`, `COMPONENT_SCOPE_MODE=0`, `USER_GUIDE_MODE=0`, `SPEC_PACK_MODE=0`
- `sibling_boundary=US-0138..US-0148 OPEN out of scope; US-0133/US-0134/US-0135/US-0136 DONE compose-only; BUG-0020 DONE not reopened; R-0120..R-0129 intact`

## Verdict rationale

Fresh QA independently remapped AC-1..AC-8 against architecture `# US-0137` A1 (`standalone/packages/policy-engine` + `standalone/packages/tool-broker` no Pi; thin kernel `ownedTools` port with `defineTool` only in pi-kernel; production `itsm_*` via ToolBroker; `noTools: "builtin"` held; PolicyEngine ALLOW|ASK|DENY; path/shell/secret/profile/audit; Layer A ≠ Layer B; real `policy_hash`; 10 `test_us0137_*`) + `tasks.md`, treated ultra_lean deferred `plan-verify.json` SKIPPED placeholder as **PASS** (8/8 AC surjective; this pass overwrote with QA PASS, mirror S0142), re-ran `cd standalone && npm test` (**46 passed**; **10/10** `test_us0137_*`; compose us0133/us0134/us0135/us0136 + unit) and `python -m pytest tests/us0137_contract_test.py tests/us0136_contract_test.py tests/us0135_contract_test.py tests/us0134_contract_test.py tests/us0133_contract_test.py -v` (**9 passed**), confirmed packages exist, kit `files` omit `standalone/`, no Pi in policy-engine/tool-broker, empty loader / `noTools: "builtin"` / KernelBridge / auth-models unamended, DEC-0038 tuple unamended, no OS-sandbox claim, and independently recomputed execute proof hash **MATCH** before TTL. Blocking findings: **none**. US-0137 remains OPEN; acceptance unchecked; US-0136 / US-0135 / BUG-0020 not reopened. Critic NBs treated as informational. POLICY_QA_SILENT_FIX held (no production silent patch this pass).

## Test plan

| # | Check | Expected |
|---|---|---|
| 1 | Independent AC-1..AC-8 remap vs A1 + tasks | Each AC ≥1 task; primary acceptance covered |
| 2 | Ultra_lean deferred `sprints/S0143/plan-verify.json` | SKIPPED placeholder → PASS if 8/8 surjective |
| 3 | `cd standalone && npm test` | 46/46 PASS (10/10 `test_us0137_*` + compose) |
| 4 | Kit pytest us0137 + us0136 + us0135 + us0134 + us0133 | 9/9 PASS (marker 1 + compose) |
| 5 | Standalone `npm run typecheck` / `npm run lint` | exit 0 |
| 6 | Packages exist; kit `files` omit `standalone/`; no Pi in policy-engine/tool-broker | PASS |
| 7 | Isolation / `noTools` / KernelBridge / auth-models unamended; fake-model CI held; DEC-0038 unamended; no OS-sandbox claim | held |
| 8 | Execute DEC-0038 proof consume | MATCH before TTL |
| 9 | Status OPEN; acceptance unchecked; US-0136/US-0135/BUG-0020 DONE held | unchanged |
| 10 | UAT probes | `contract_tests_primary` PASS; live classes waived |
| 11 | Emit `convergence_smoke` when `contract_test_failed=0` | present, `result=pass` |

## Independent checks (this qa subagent)

| Check | Command / method | Result |
|---|---|---|
| Execute proof SHA-256 | `compute_strict_proof_hash` 6-field tuple | **MATCH** `5C187C567072CD6F3809884EA3F220E399EEF4A3222F88A757917A08976B0A49`; ttl `2026-09-13T12:35:00Z`; consumed_at `2026-09-13T11:55:00Z` — **RUNTIME_PROOF_VALID** |
| Critic of execute proof | `compute_strict_proof_hash` | **MATCH** `E1A8C9677D97A8B179B41B5B74840765C4B03D22C022DC7EAC66535F9E060FE0`; blocking_count=0; anti_slop=10 |
| Standalone contract + unit | `npm test` in `standalone/` | **46 passed** in 2.78s (fail 0); **10/10** `test_us0137_*` |
| Kit + compose contract tests | `python -m pytest tests/us0137_contract_test.py tests/us0136_contract_test.py tests/us0135_contract_test.py tests/us0134_contract_test.py tests/us0133_contract_test.py -v` | **9 passed** in 0.74s |
| Typecheck | `npm run typecheck` in `standalone/` | **exit 0** |
| Lint | `npm run lint` in `standalone/` | **65 files**, no fixes |
| Metadata | `python scripts/check-user-visible-metadata.py --repo .` | **exit 0** |
| UAT probe lib | `python scripts/uat_probe_lib.py --self-test` | **[UAT_PROBE_LIB_SELF_TEST_OK]** |
| Triad hot-surface | `python scripts/enforce-triad-hot-surface.py --check` | pre-write **STATE_ARCHIVE_REQUIRED** 1228/1200 → rollover then append; final `--check` recorded in state.md |
| Template byte pair | `filecmp` `tests/us0137_contract_test.py` | **IDENTICAL** |
| Kit `files` | `package.json` files whitelist | **omits** `standalone/` |
| CI job | `.github/workflows/ci.yml` | `working-directory: standalone`; matrix `ubuntu-latest` + `windows-latest`; Node 22; `npm test` covers `us0137.contract.test.ts` |
| Packages | `standalone/packages/{policy-engine,tool-broker}/package.json` | `@its-magic/policy-engine` + `@its-magic/tool-broker`; `private: true`; `version: 0.0.0`; no `@earendil-works/pi-*` |
| Pi grep | policy-engine + tool-broker sources | **zero** `@earendil-works/pi-` hits; Biome override remains pi-kernel only |
| `noTools` | `PRODUCTION_NO_TOOLS = "builtin"`; `getProductionFactorySpec().noTools` | **held** |
| KernelBridge / auth-models | no US-0137 strings; store unamended | **held** |
| DEC-0038 tuple | `compute_strict_proof_hash` 6 positional fields | **UNAMENDED** |
| OS sandbox claim | policy-engine profiles.ts + architecture A6 rejected | **no claim**; Layer B missing → `ISOLATION_BACKEND_UNAVAILABLE` |
| `defineTool` | only `standalone/packages/pi-kernel/src/tools.ts` | **held** |
| Backlog / acceptance | Status + checkbox spot-check | OPEN; acceptance `- [ ] US-0137`; AC-1..AC-8 `[ ]` |
| LINT_COMMAND / TYPECHECK_COMMAND | blank in kit runbook | **skipped** (kit); standalone lint/typecheck **pass** (not folded into kit TEST_COMMAND) |
| Full harness `tests/run-tests.ps1` | not re-run this pass | **not claimed** — scoped pytest + standalone `npm test` are the required gates |
| No `.env` / no live provider / no `--live` CI | this pass | **held** |
| POLICY_QA_SILENT_FIX | no production source patch | **held** |

## Blocking findings

None.

## Non-blocking findings (critic NB carry-forwards — informational)

| ID | Topic | QA note |
|---|---|---|
| NB1 / us0137ex-challenger-001 | execute proof MATCH; 10/10 markers; fail-closed raw Pi tools / path / shell exfil / secret deny / Layer B unavailable / malicious extensions locked in tests | Independently re-verified this pass (46/46 npm test; 9/9 pytest; execute hash MATCH). Does **not** fail any AC. |
| NB2 / us0137ex-architect-002 | policy-engine + tool-broker no Pi; `defineTool` only in pi-kernel; PolicyEngine vs RoleCatalog (permission vs intent); US-0141 Layer B deferred; isolation/`noTools`/KernelBridge/auth-models unamended except spawn allowlist + hash | This pass overwrote SKIPPED placeholder with PASS `plan-verify.json` and remapped AC-1..AC-8. Execute layering / DEC-0137 held. Not blocking. |
| NB3 / us0137ex-subtractor-003 | no DONE / no US-0138+ / no live paid CI / no isolation loader amend / no OS-sandbox claim / US-0136/US-0135/BUG-0020 not reopened | Held this pass. A2–A12 rejected. Not blocking. |

## AC remap (independent — files + tests vs A1)

| AC | Delivered surface | Task(s) / markers | Result |
|---|---|---|---|
| AC-1 Pi sessions receive only role/phase `itsm_*` via ToolBroker; no raw Pi mutation tools | packages + `ownedTools` wrap `defineTool` only in pi-kernel; `noTools: "builtin"`; catalog excludes `itsm_ping`; orchestrator `[]` | T-001, T-008, T-009 (T-010 m1, m2, m10) | **PASS** |
| AC-2 PolicyEngine tuple → ALLOW \| ASK \| DENY | owned TypeScript decision tables; `security_hard` unrelaxable; missing approval → DENY | T-002 | **PASS** |
| AC-3 Path ownership deny matrix | PO src, QA silent fix, traversal/UNC/device/`/etc` | T-003 (T-010 m3, m4, m6) | **PASS** |
| AC-4 Shell parse/classify + fail-safe | exfil/privileged/destructive/package/git-force | T-004 (T-010 m6, m7) | **PASS** |
| AC-5 Secrets never in LLM context; header redaction | `.env` / `.pem` / `credentials.json` deny before content; `redactBrowserHeaders` | T-005 (T-010 m5, m8) | **PASS** |
| AC-6 Layer A ≠ Layer B profiles | `trusted-local` \| `isolated-development` \| `untrusted-repository`; missing backend → `ISOLATION_BACKEND_UNAVAILABLE`; no OS-sandbox claim | T-006 (T-010 m9) | **PASS** |
| AC-7 Compact audit + real `policy_hash` | ToolBroker `computePolicyHash`; DEC-0038 tuple unamended; `redactAudit` on persist | T-007 | **PASS** |
| AC-8 Security tests cover malicious Pi, `.env`, traversal, exfil, redaction, missing backend | exactly 10 `test_us0137_*`; compose us0133/us0134/us0135/us0136 green | T-010 (m1–m10) | **PASS** |

**Overall AC gate**: **PASS** (slice) — Status remains OPEN; backlog/acceptance checkboxes **not** ticked (US-0045; `/verify-work` / closure ownership).

## Contract marker results (10/10)

| # | Marker | Harness | Result |
|---|---|---|---|
| 1 | `test_us0137_no_raw_pi_tools_in_production_session` | node:test + kit pytest | PASS |
| 2 | `test_us0137_role_subset_itsm_tools` | node:test | PASS |
| 3 | `test_us0137_po_src_deny` | node:test | PASS |
| 4 | `test_us0137_qa_silent_fix_deny` | node:test | PASS |
| 5 | `test_us0137_env_read_deny` | node:test | PASS |
| 6 | `test_us0137_path_traversal_deny` | node:test | PASS |
| 7 | `test_us0137_shell_exfil_deny` | node:test | PASS |
| 8 | `test_us0137_browser_header_redaction` | node:test | PASS |
| 9 | `test_us0137_isolation_backend_unavailable` | node:test | PASS |
| 10 | `test_us0137_malicious_pi_extension_and_orchestrator_zero_tools` | node:test | PASS |

US-0133 compose (node:test + pytest), US-0134 compose, US-0135 compose, and US-0136 compose remain green. Timeout unit + event-bridge unit PASS.

## Template byte-identity (US-0137 pair)

| Pair | Result |
|---|---|
| `tests/us0137_contract_test.py` | IDENTICAL |

## Compose / scope gates

| Gate | Result |
|---|---|
| A1 LOCKED (not A2–A12) | HELD |
| Packages `@its-magic/policy-engine` + `@its-magic/tool-broker` exist | HELD |
| Kit `files` omit `standalone/`; kit is not a workspace root | HELD |
| No Pi / `@earendil-works/pi-*` inside policy-engine/tool-broker; no Biome override | HELD |
| AgentKernel empty loader / `noTools: "builtin"` / KernelBridge / auth-models unamended | HELD |
| `defineTool` only in pi-kernel | HELD |
| Fake-model CI default held; no live paid CI | HELD |
| DEC-0038 `compute_strict_proof_hash` tuple UNAMENDED (sidecar `policy_hash` separate) | HELD |
| No OS-sandbox claim; Layer B missing → `ISOLATION_BACKEND_UNAVAILABLE` | HELD |
| architecture.md / DEC-0137 / R-0129 not rewritten; R-0120..R-0128 intact | HELD |
| US-0133/US-0134/US-0135/US-0136 DONE compose-only; BUG-0020 DONE not reopened | HELD |
| US-0138+ OUT OF SCOPE | HELD |
| US-0045 Status OPEN / acceptance unchecked | HELD |
| Exactly 10 `test_us0137_*` markers; `test_us0133_*` / `test_us0134_*` / `test_us0135_*` / `test_us0136_*` not weakened | HELD |
| No `.env` read / no intake JSON mutation / no POLICY_QA_SILENT_FIX production patch | HELD |

## UAT / convergence (US-0128)

- Contract slice green (`contract_test_failed=0`); 10/10 markers; typecheck/lint green; kit omit held.
- Canonical `convergence_smoke` recorded as **pass** in `sprints/S0143/uat.json`.
- Six live-runtime probe classes waived `UAT_PROBE_FORBIDDEN` (FRAMEWORK_KIT_REPO=1; unpublished standalone workspace; policy/tool-broker contract-test slice; no live provider; not `browser_smoke`).
- Ultra_lean: QA merged AC checklist into `uat.json` / this file; operator UAT ticks and DONE remain `/verify-work` / closure ownership.
- Full UAT ownership remains with `/verify-work` (do not flip DONE / tick ACs here).
- Did **not** mutate `sprints/S0126/uat.json`.

## UAT probes (FRAMEWORK_KIT_REPO=1 — honest classification)

Applicable probe class: **`contract_tests_primary`** (10 markers + standalone `npm test`). No web UI. No fake browser PASS. Live-runtime / live provider probes **not attempted** (`UAT_PROBE_FORBIDDEN`). Static/fixture + fake-model only. No `.env`. No credentials filled.

Canonical surrogate step **`convergence_smoke`** emitted this pass (`result=pass`) because `contract_test_failed=0`.

| Probe class | Classification | reason_code |
|---|---|---|
| `browser_smoke` | waived / not applicable | `UAT_PROBE_FORBIDDEN` |
| `api_health` | waived / not applicable | `UAT_PROBE_FORBIDDEN` |
| `process_health` | waived / not applicable | `UAT_PROBE_FORBIDDEN` |
| `cli_smoke` | waived (policy/tool-broker contract tests; no live runtime session) | `UAT_PROBE_FORBIDDEN` |
| `build` | waived (standalone typecheck/lint recorded as independent checks, not live-runtime class) | `UAT_PROBE_FORBIDDEN` |
| `manual_operator` | deferred to verify-work / operator | `UAT_PROBE_FORBIDDEN` |

**Runtime browser evidence**: none. MCP browser sequence **not run**. No screenshot. No silent browser PASS.

## Runtime QA evidence (US-0065) — kit + unpublished workspace slice, not generated webapp

- `runtime_startup_command`: n/a (FRAMEWORK_KIT_REPO=1; policy-engine + tool-broker; no app server)
- `runtime_stack_profile`: python (kit) + node (standalone workspace)
- `runtime_mode`: local
- `runtime_health_target`: n/a — no process/endpoint
- `runtime_health_result`: not_applicable
- `runtime_log_summary`: n/a (no app logs)
- `runtime_retry_count`: 0
- `runtime_retry_ledger`: []
- `runtime_final_verdict`: pass
- `runtime_reason_code`: `UAT_PROBE_FORBIDDEN` for browser/runtime-app probes; slice health is contract tests + `convergence_smoke` surrogate
- `runtime_evidence_refs`: pytest 9/9; standalone npm test 46/46; typecheck/lint exit 0; `sprints/S0143/uat.json` `convergence_smoke`

## Generated-test evidence (US-0066)

- `generated_test_stack_profile`: python + node
- `generated_test_command`: `python -m pytest tests/us0137_contract_test.py tests/us0136_contract_test.py tests/us0135_contract_test.py tests/us0134_contract_test.py tests/us0133_contract_test.py -v` + `npm test` (cwd `standalone/`)
- `generated_test_result`: pass
- `generated_test_output_ref`: this file § Independent checks (pytest 9 passed in 0.74s; npm test 46 passed in 2.78s)
- `generated_test_paths_ref`: `tests/us0137_contract_test.py`; `template/tests/us0137_contract_test.py`; `standalone/tests/contract/us0137.contract.test.ts`
- `generated_test_reason_code`: none (pass)

## Status confirmation (US-0045)

- backlog `## US-0137` Status: **OPEN**
- acceptance US-0137: **unchecked** (`- [ ] US-0137`)
- AC-1..AC-8: **unchecked**
- US-0133: **DONE** (not reopened)
- US-0134: **DONE** (not reopened)
- US-0135: **DONE** (not reopened)
- US-0136: **DONE** (not reopened)
- BUG-0020: **DONE** (not reopened)
- US-0138: **OPEN** (not mutated)
- intake JSON not mutated this phase
- architecture.md `# US-0137` not mutated this phase
- R-0129 / R-0120..R-0128 bodies not mutated this phase

## Producer proof consumed (execute)

- `producer_runtime_proof_id=rp-auto-20260913-us0137-execute-dev-20260913T113500Z-US-0137`
- Canonical hashed payload: `{"orchestrator_run_id":"auto-20260913-us0137","phase_id":"execute","proof_issued_at":"2026-09-13T11:35:00Z","proof_ttl_seconds":3600,"role":"dev","runtime_proof_id":"rp-auto-20260913-us0137-execute-dev-20260913T113500Z-US-0137"}`
- `producer_attested_proof_hash=5C187C567072CD6F3809884EA3F220E399EEF4A3222F88A757917A08976B0A49`
- Independent `compute_strict_proof_hash` recompute: **MATCH**
- `producer_proof_ttl=2026-09-13T12:35:00Z`, `consumed_at=2026-09-13T11:55:00Z` (orchestrator stamp before RUNTIME_PROOF_STALE)
- Isolation extras (not hashed): `delivery_mode=ultra_lean`; `macro_phase=build+verify`; `model_id=cursor-grok-4.6-high`; `sprint_id=S0143`; `story_id=US-0137`
- `producer_ttl_stale=false`
- `producer_fresh_context_marker=dev-US0137-execute-20260913T113500Z-fresh`
- Critic consume of same tuple at 2026-09-13T11:45:00Z recorded; this qa consume is independent MATCH-before-TTL
- Critic of execute: `rp-auto-20260913-us0137-sovereign-critic-techlead-20260913T114500Z-US-0137` / `E1A8C9677D97A8B179B41B5B74840765C4B03D22C022DC7EAC66535F9E060FE0` — independent MATCH; 0 blocking; anti_slop=10; findings `us0137ex-*` informational

## Strict runtime proof (DEC-0038) — qa

- `orchestrator_run_id=auto-20260913-us0137`
- `runtime_proof_id=rp-auto-20260913-us0137-qa-qa-20260913T115500Z-US-0137` (NEW unique — distinct from execute / sprint-plan / critic)
- `phase_id=qa`, `role=qa`, `story_id=US-0137`, `sprint_id=S0143`
- `delivery_mode=ultra_lean`, `macro_phase=build+verify`, `model_id=cursor-grok-4.6-high`
- `proof_issued_at=2026-09-13T11:55:00Z`
- `proof_ttl_seconds=3600`, `proof_ttl=2026-09-13T12:55:00Z` (UTC = issued_at + 3600s)
- `proof_hash=8EBB63CA756128E72E0C938ABDAF7FAC368EC21F17CB853C89F2CCAB0C4A5C13` (`compute_strict_proof_hash` positional 6-field)
- Canonical payload: `{"orchestrator_run_id":"auto-20260913-us0137","phase_id":"qa","proof_issued_at":"2026-09-13T11:55:00Z","proof_ttl_seconds":3600,"role":"qa","runtime_proof_id":"rp-auto-20260913-us0137-qa-qa-20260913T115500Z-US-0137"}`
- `hash_recompute_confirmation=true` (compute_strict_proof_hash → 8EBB63CA756128E72E0C938ABDAF7FAC368EC21F17CB853C89F2CCAB0C4A5C13)

## Strict runtime proof (DEC-0038) — plan-verify (ultra_lean merged)

- `runtime_proof_id=rp-auto-20260913-us0137-plan-verify-qa-20260913T115500Z-US-0137`
- `phase_id=plan-verify`, `role=qa`
- `proof_issued_at=2026-09-13T11:55:00Z`, `proof_ttl=2026-09-13T12:55:00Z`
- `proof_hash=F66022E20112E7501BDB7D43B5364527E5474D0AB29E823B01EE411FCB90FBB7`
- Canonical payload: `{"orchestrator_run_id":"auto-20260913-us0137","phase_id":"plan-verify","proof_issued_at":"2026-09-13T11:55:00Z","proof_ttl_seconds":3600,"role":"qa","runtime_proof_id":"rp-auto-20260913-us0137-plan-verify-qa-20260913T115500Z-US-0137"}`
- `hash_recompute_confirmation=true` (compute_strict_proof_hash → F66022E20112E7501BDB7D43B5364527E5474D0AB29E823B01EE411FCB90FBB7)

## Isolation evidence (US-0048 / DEC-0029 / US-0104 v2)

- `phase_id=qa`, `role=qa`, `model_id=cursor-grok-4.6-high` (CROSS_MODEL_REVIEW=1 — required)
- `fresh_context_marker=qa-US0137-qa-20260913T115500Z-fresh` (NEW per US-0048 / BUG-0006)
- `timestamp=2026-09-13T11:55:00Z` (UTC)
- `evidence_ref=sprints/S0143/qa-findings.md; sprints/S0143/plan-verify.json; sprints/S0143/uat.json; sprints/S0143/uat.md`
- Fresh qa subagent per BUG-0006 / US-0048 isolation; no prior chat history carried forward. Context limited to narrow-read (US-0053). No `.env` reads, no credentials access, no intake-evidence mutation, no backlog Status/AC mutation, no acceptance.md mutation, no architecture.md mutation, no DONE-row mutation, no `/execute` or `/verify-work` spawn from this subagent.

## Next scheduled phase

- `next_scheduled_phase=/verify-work` (role=qa per US-0069 / DEC-0051; fresh qa subagent per BUG-0006 — orchestrator-owned spawn; after sovereign-critic of qa if CROSS_MODEL_REVIEW=1)
- `next_scheduled_role=qa`
- `stop_condition=STOP after qa PASS. Orchestrator spawns sovereign-critic of qa (CROSS_MODEL_REVIEW=1), then /verify-work in a fresh qa subagent (BUG-0006). Do NOT spawn /verify-work or /execute from this subagent. Do NOT mark US-0137 DONE. Do NOT tick acceptance. Do NOT mutate intake JSON. Do NOT mutate architecture.md. Do NOT reopen US-0136, US-0135, or BUG-0020. Do NOT mutate US-0138+.`
- `artifacts_written=sprints/S0143/qa-findings.md, sprints/S0143/plan-verify.json, sprints/S0143/uat.json, sprints/S0143/uat.md, sprints/S0143/progress.md, sprints/S0143/summary.md, docs/engineering/state.md (qa checkpoint append), handoffs/qa_to_verify.md (prepend), handoffs/resume_brief.md (qa PASS prepend → /verify-work)`
- `handoffs/qa_to_dev.md=NOT written` (no blocking findings; AUTO_IMPLEMENTATION_LOOP does not return to /execute)
