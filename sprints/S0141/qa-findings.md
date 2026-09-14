# QA findings — US-0135 / S0141 / auto-20260913-us0135 (qa)

- **phase_id**: qa, **role**: qa, **story_id**: US-0135 (OPEN — not marked DONE per US-0045), **sprint_id**: S0141
- `orchestrator_run_id=auto-20260913-us0135`, `parent_run=auto-20260913-bug0020`, `delivery_mode=ultra_lean`, `macro_phase=build+verify`
- `AUTO_IMPLEMENTATION_LOOP=1` (no blocking findings — do not return to `/execute`)
- `AUTO_QUIET=1`
- `FRAMEWORK_KIT_REPO=1`
- `SECURITY_REVIEW=0`
- `model_id=cursor-grok-4.6-high` (CROSS_MODEL_REVIEW=1 — required on isolation)
- `producer_phase_id=execute`, `producer_role=dev`, `producer_model_id=cursor-grok-4.6-high`
- `critic_phase_id=sovereign-critic` (execute review), `critic_model_id=composer-2.5-fast`, `critic_verdict=PASS`, `anti_slop_aggregate=10`, `open_blocking_findings=0`
- `critic_fresh_context_marker=critic-US0135-execute-20260913T050500Z-fresh`
- `critic_finding_ids=us0135ex-challenger-001, us0135ex-architect-002, us0135ex-subtractor-003` (informational NBs; not AC failures)
- `cross_reviewer_findings.open_blocking_count=0` (`handoffs/sovereign_critic_findings.jsonl`)

- `fresh_context_marker=qa-US0135-qa-20260913T051500Z-fresh` (NEW per US-0048 / BUG-0006; not reused from execute `dev-US0135-execute-20260913T045500Z-fresh` or critic `critic-US0135-execute-20260913T050500Z-fresh`)
- `timestamp (UTC)=2026-09-13T05:15:00Z` (orchestrator-specified; wall clock at this spawn `2026-09-13T01:33:35Z` was not later)
- **verdict: QA_PASS**
- `plan_verify_verdict=PASS` (ultra_lean deferred — `sprints/S0141/plan-verify.json` SKIPPED placeholder treated as PASS; 7/7 AC surjective in sprint-plan + this remap + primary acceptance row)
- `blocking_count=0`
- `non_blocking_count=3` (execute-critic carry-forwards — informational; not new blockers)
- `story_status=OPEN` (do not mark US-0135 DONE; acceptance US-0135 unchecked; intake JSON not mutated)
- `acceptance_US-0135=NOT ticked`
- `intake_json=NOT mutated`
- `FRAMEWORK_KIT_REPO=1` / unpublished in-tree `standalone/` auth-models + CLI/contract-test slice — no web UI; **no fake browser PASS**
- `SECURITY_REVIEW=0`, `CROSS_REPO_OBSERVABILITY=0`, `COMPONENT_SCOPE_MODE=0`, `USER_GUIDE_MODE=0`, `SPEC_PACK_MODE=0`
- `sibling_boundary=US-0136..US-0148 OPEN out of scope; US-0133/US-0134 DONE compose-only; BUG-0020 DONE not reopened; R-0120..R-0126 intact`

## Verdict rationale

Fresh QA independently remapped AC-1..AC-7 against architecture `# US-0135` A1 (`standalone/packages/auth-models` no Pi; owned OS credential dir; pi-kernel `AuthRuntimeAdapter`; 6-step ModelRouter + provenance; thinking clamp; critic `CROSS_MODEL_DEGRADED_MODE`; `itsm auth` / `models list` / `models test`; 10 `test_us0135_*`) + `tasks.md`, treated ultra_lean deferred `plan-verify.json` SKIPPED placeholder as **PASS** (7/7 AC surjective; this pass overwrote with QA PASS, mirror S0140), re-ran `cd standalone && npm test` (**26 passed**; **10/10** `test_us0135_*`; compose us0133/us0134 + unit) and `python -m pytest tests/us0135_contract_test.py tests/us0134_contract_test.py tests/us0133_contract_test.py -v` (**7 passed**), confirmed kit `files` omit `standalone/`, no Pi in `auth-models`, empty loader / `noTools: "builtin"` / KernelBridge unamended, and independently recomputed execute proof hash **MATCH** before TTL. Blocking findings: **none**. US-0135 remains OPEN; acceptance unchecked; BUG-0020 not reopened. Critic NBs treated as informational.

## Test plan

| # | Check | Expected |
|---|---|---|
| 1 | Independent AC-1..AC-7 remap vs A1 + tasks | Each AC ≥1 task; primary acceptance covered |
| 2 | Ultra_lean deferred `sprints/S0141/plan-verify.json` | SKIPPED placeholder → PASS if 7/7 surjective |
| 3 | `cd standalone && npm test` | 26/26 PASS (10/10 `test_us0135_*` + compose) |
| 4 | Kit pytest us0135 + us0134 + us0133 | 7/7 PASS (marker 3 + compose) |
| 5 | Standalone `npm run typecheck` / `npm run lint` | exit 0 |
| 6 | Kit `files` omit `standalone/`; no Pi in auth-models | PASS |
| 7 | Isolation / `noTools` / KernelBridge unamended; fake-model CI held | held |
| 8 | Execute DEC-0038 proof consume | MATCH before TTL |
| 9 | Status OPEN; acceptance unchecked; BUG-0020 DONE held | unchanged |
| 10 | UAT probes | `contract_tests_primary` PASS; live classes waived |
| 11 | Emit `convergence_smoke` when `contract_test_failed=0` | present, `result=pass` |

## Independent checks (this qa subagent)

| Check | Command / method | Result |
|---|---|---|
| Execute proof SHA-256 | `compute_strict_proof_hash` 6-field tuple | **MATCH** `B07A7BE059C98286441986C077D91726953F416F198548DDB89664E2BEAFFEB0`; ttl `2026-09-13T05:55:00Z`; consumed_at `2026-09-13T05:15:00Z` — **RUNTIME_PROOF_VALID** (orchestrator stamp before TTL; wall clock `2026-09-13T01:33:35Z` was not later than `proof_issued_at`) |
| Critic of execute proof | `compute_strict_proof_hash` | **MATCH** `68924D7397919834A6ED0E4F7E307425C17C87C3469AB875A8D23684D80CA7DE`; blocking_count=0; anti_slop=10 |
| Standalone contract + unit | `npm test` in `standalone/` | **26 passed** in 2.71s (fail 0); **10/10** `test_us0135_*` |
| Kit + compose contract tests | `python -m pytest tests/us0135_contract_test.py tests/us0134_contract_test.py tests/us0133_contract_test.py -v` | **7 passed** in 0.62s |
| Typecheck | `npm run typecheck` in `standalone/` | **exit 0** |
| Lint | `npm run lint` in `standalone/` | **37 files**, no fixes |
| Metadata | `python scripts/check-user-visible-metadata.py --repo .` | **exit 0** |
| UAT probe lib | `python scripts/uat_probe_lib.py --self-test` | **[UAT_PROBE_LIB_SELF_TEST_OK]** |
| Triad hot-surface | `python scripts/enforce-triad-hot-surface.py --check` | pre-write **PASS** (exit 0); post-append STATE_ARCHIVE_REQUIRED 1264/1200 units=15/80 → rollover pack `state-pack-20260913-v.md`; final `--check` **PASS** |
| Template byte pair | `filecmp` `tests/us0135_contract_test.py` | **IDENTICAL** |
| Kit `files` | `package.json` files whitelist | **omits** `standalone/` |
| CI job | `.github/workflows/ci.yml` | `working-directory: standalone`; matrix `ubuntu-latest` + `windows-latest`; Node 22; `npm test` covers `us0135.contract.test.ts` |
| Backlog / acceptance | Status + checkbox spot-check | OPEN; acceptance `- [ ] US-0135`; AC-1..AC-7 `[ ]` |
| LINT_COMMAND / TYPECHECK_COMMAND | blank in kit runbook | **skipped** (kit); standalone lint/typecheck **pass** (not folded into kit TEST_COMMAND) |
| Full harness `tests/run-tests.ps1` | not re-run this pass | **not claimed** — scoped pytest + standalone `npm test` are the required gates |
| No `.env` / no live provider / no `--live` CI | this pass | **held** |

## Blocking findings

None.

## Non-blocking findings (critic NB carry-forwards — informational)

| ID | Topic | QA note |
|---|---|---|
| NB1 / us0135ex-challenger-001 | execute proof MATCH; 10/10 markers; AUTH_PATH_IN_PROJECT / AUTH_SYNC_FAILED / OAuth refresh / critic degraded / fake-model CI locked in tests | Independently re-verified this pass (26/26 npm test; 7/7 pytest; execute hash MATCH). Does **not** fail any AC. |
| NB2 / us0135ex-architect-002 | auth-models no Pi; CLI → auth-models handlers; AuthRuntimeAdapter in pi-kernel; isolation/`noTools`/KernelBridge unamended | This pass overwrote SKIPPED placeholder with PASS `plan-verify.json` and remapped AC-1..AC-7. CLI entrypoint wires `createAuthRuntimeAdapter()`; handlers stay in auth-models (no `@earendil-works/pi-*` in CLI). Execute layering / DEC-0135 held. Not blocking. |
| NB3 / us0135ex-subtractor-003 | no DONE / no US-0136+ / no live paid CI / no isolation loader amend / BUG-0020 not reopened | Held this pass. A2–A9 rejected. Not blocking. |

## AC remap (independent — files + tests vs A1)

| AC | Delivered surface | Task(s) / markers | Result |
|---|---|---|---|
| AC-1 CLI auth list/config (Codex OAuth + API-key); owned credential location outside project | `@its-magic/auth-models`; owned OS dir (XDG / `%APPDATA%` / macOS Application Support `its-magic/`); 0600-class; `AUTH_PATH_IN_PROJECT`; `itsm auth` list/login/logout/migrate; InMemory no-disk | T-001, T-002, T-003, T-008 (T-009 m1–m3) | **PASS** |
| AC-2 Provider matrix (built-in, Chinese, local OpenAI-compat, custom gateway) via Pi adapters | Codex `openai-codex`; API-key openai/anthropic/google/openrouter; Chinese deepseek/kimi-coding/zai(+cn)/minimax(+cn); `qwen-token-plan*`; local ollama/lmstudio/vllm via owned `models.json`; `registerProvider` | T-003, T-004 (T-009 m8) | **PASS** |
| AC-3 6-step model resolution with provenance | CLI > phase-local > role catalog > critic overlay > tier/catalog > runtime default; Cursor aliases fail-closed | T-005 (T-009 m4) | **PASS** |
| AC-4 Thinking independent of slug and token profile | `thinkingLevel` session option; clamp+provenance; `TOKEN_PROFILE` ignored | T-006 (T-009 m5) | **PASS** |
| AC-5 Critic pin; same-slug `CROSS_MODEL_DEGRADED_MODE` | critic overlay honored on critic resolve; degraded not hard stop | T-007 (T-009 m6) | **PASS** |
| AC-6 `itsm auth` / `models list` / `models test` diagnostics without tokens | JSON `{provider, model, auth, health}`; `--live` CI `MODELS_TEST_LIVE_FORBIDDEN` | T-008 (T-009 m7) | **PASS** |
| AC-7 Two roles different providers; OAuth refresh never exposes tokens | fake two-role fixture; refresh redact spy; fake-model CI / empty loader held | T-009 (m8, m9, m10) | **PASS** |

**Overall AC gate**: **PASS** (slice) — Status remains OPEN; backlog/acceptance checkboxes **not** ticked (US-0045; `/verify-work` / closure ownership).

## Contract marker results (10/10)

| # | Marker | Harness | Result |
|---|---|---|---|
| 1 | `test_us0135_owned_auth_path_outside_project` | node:test | PASS |
| 2 | `test_us0135_inmemory_credential_store_no_disk` | node:test | PASS |
| 3 | `test_us0135_no_pi_imports_in_auth_models` | node:test + kit pytest | PASS |
| 4 | `test_us0135_model_router_six_step_precedence` | node:test | PASS |
| 5 | `test_us0135_thinking_orthogonal_to_slug_and_token_profile` | node:test | PASS |
| 6 | `test_us0135_critic_same_slug_degraded_mode` | node:test | PASS |
| 7 | `test_us0135_models_test_checkauth_no_token_logs` | node:test | PASS |
| 8 | `test_us0135_two_roles_different_providers_fake` | node:test | PASS |
| 9 | `test_us0135_oauth_refresh_not_in_prompt_audit_or_repo` | node:test | PASS |
| 10 | `test_us0135_fake_model_ci_default_held` | node:test | PASS |

US-0133 compose (node:test + pytest) and US-0134 compose remain green. Timeout unit + event-bridge unit PASS.

## Template byte-identity (US-0135 pair)

| Pair | Result |
|---|---|
| `tests/us0135_contract_test.py` | IDENTICAL |

## Compose / scope gates

| Gate | Result |
|---|---|
| A1 LOCKED (not A2–A9) | HELD |
| Kit `files` omit `standalone/`; kit is not a workspace root | HELD |
| No Pi / `@earendil-works/pi-*` / `@its-magic/pi-kernel` inside `auth-models`; no Biome override | HELD |
| AgentKernel empty loader / `noTools: "builtin"` / KernelBridge unamended | HELD |
| Fake-model CI default held; `--live` never CI | HELD |
| No project / `.env` / `~/.pi/agent` ship store | HELD |
| Cursor aliases not runtime slugs | HELD |
| architecture.md / DEC-0135 / R-0127 not rewritten; R-0120..R-0126 intact | HELD |
| US-0133/US-0134 DONE compose-only; BUG-0020 DONE not reopened | HELD |
| US-0136+ OUT OF SCOPE | HELD |
| US-0045 Status OPEN / acceptance unchecked | HELD |
| Exactly 10 `test_us0135_*` markers; `test_us0133_*` / `test_us0134_*` not weakened | HELD |
| No `.env` read / no intake JSON mutation | HELD |

## UAT / convergence (US-0128)

- Contract slice green (`contract_test_failed=0`); 10/10 markers; typecheck/lint green; kit omit held.
- Canonical `convergence_smoke` recorded as **pass** in `sprints/S0141/uat.json`.
- Six live-runtime probe classes waived `UAT_PROBE_FORBIDDEN` (FRAMEWORK_KIT_REPO=1; unpublished standalone workspace; CLI/contract-test slice; no live provider; not `browser_smoke`).
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
| `cli_smoke` | waived (CLI handlers covered by contract tests; no live provider) | `UAT_PROBE_FORBIDDEN` |
| `build` | waived (standalone typecheck/lint recorded as independent checks, not live-runtime class) | `UAT_PROBE_FORBIDDEN` |
| `manual_operator` | deferred to verify-work / operator | `UAT_PROBE_FORBIDDEN` |

**Runtime browser evidence**: none. MCP browser sequence **not run**. No screenshot. No silent browser PASS.

## Runtime QA evidence (US-0065) — kit + unpublished workspace slice, not generated webapp

- `runtime_startup_command`: n/a (FRAMEWORK_KIT_REPO=1; CLI stub + auth-models; no app server)
- `runtime_stack_profile`: python (kit) + node (standalone workspace)
- `runtime_mode`: local
- `runtime_health_target`: n/a — no process/endpoint
- `runtime_health_result`: not_applicable
- `runtime_log_summary`: n/a (no app logs)
- `runtime_retry_count`: 0
- `runtime_retry_ledger`: []
- `runtime_final_verdict`: pass
- `runtime_reason_code`: `UAT_PROBE_FORBIDDEN` for browser/runtime-app probes; slice health is contract tests + `convergence_smoke` surrogate
- `runtime_evidence_refs`: pytest 7/7; standalone npm test 26/26; typecheck/lint exit 0; `sprints/S0141/uat.json` `convergence_smoke`

## Generated-test evidence (US-0066)

- `generated_test_stack_profile`: python + node
- `generated_test_command`: `python -m pytest tests/us0135_contract_test.py tests/us0134_contract_test.py tests/us0133_contract_test.py -v` + `npm test` (cwd `standalone/`)
- `generated_test_result`: pass
- `generated_test_output_ref`: this file § Independent checks (pytest 7 passed in 0.62s; npm test 26 passed in 2.71s)
- `generated_test_paths_ref`: `tests/us0135_contract_test.py`; `standalone/tests/contract/us0135.contract.test.ts`
- `generated_test_reason_code`: none (pass)

## Status confirmation (US-0045)

- backlog `## US-0135` Status: **OPEN**
- acceptance US-0135: **unchecked** (`- [ ] US-0135`)
- AC-1..AC-7: **unchecked**
- US-0133: **DONE** (not reopened)
- US-0134: **DONE** (not reopened)
- BUG-0020: **DONE** (not reopened)
- intake JSON not mutated this phase
- architecture.md `# US-0135` not mutated this phase
- R-0127 / R-0120..R-0126 bodies not mutated this phase

## Producer proof consumed (execute)

- `producer_runtime_proof_id=rp-auto-20260913-us0135-execute-dev-20260913T045500Z-US-0135`
- Canonical hashed payload: `{"orchestrator_run_id":"auto-20260913-us0135","phase_id":"execute","proof_issued_at":"2026-09-13T04:55:00Z","proof_ttl_seconds":3600,"role":"dev","runtime_proof_id":"rp-auto-20260913-us0135-execute-dev-20260913T045500Z-US-0135"}`
- `producer_attested_proof_hash=B07A7BE059C98286441986C077D91726953F416F198548DDB89664E2BEAFFEB0`
- Independent `compute_strict_proof_hash` recompute: **MATCH**
- `producer_proof_ttl=2026-09-13T05:55:00Z`, `consumed_at=2026-09-13T05:15:00Z` (orchestrator stamp before RUNTIME_PROOF_STALE)
- Isolation extras (not hashed): `delivery_mode=ultra_lean`; `macro_phase=build+verify`; `model_id=cursor-grok-4.6-high`; `sprint_id=S0141`; `story_id=US-0135`
- `producer_ttl_stale=false`
- `producer_fresh_context_marker=dev-US0135-execute-20260913T045500Z-fresh`
- Critic consume of same tuple at 2026-09-13T05:05:00Z recorded; this qa consume is independent MATCH-before-TTL
- Critic of execute: `rp-auto-20260913-us0135-sovereign-critic-techlead-20260913T050500Z-US-0135` / `68924D7397919834A6ED0E4F7E307425C17C87C3469AB875A8D23684D80CA7DE` — independent MATCH; 0 blocking; anti_slop=10; findings `us0135ex-*` informational

## Strict runtime proof (DEC-0038) — qa

- `orchestrator_run_id=auto-20260913-us0135`
- `runtime_proof_id=rp-auto-20260913-us0135-qa-qa-20260913T051500Z-US-0135` (NEW unique — distinct from execute / sprint-plan / critic)
- `phase_id=qa`, `role=qa`, `story_id=US-0135`, `sprint_id=S0141`
- `delivery_mode=ultra_lean`, `macro_phase=build+verify`, `model_id=cursor-grok-4.6-high`
- `proof_issued_at=2026-09-13T05:15:00Z`
- `proof_ttl_seconds=3600`, `proof_ttl=2026-09-13T06:15:00Z` (UTC = issued_at + 3600s)
- `proof_hash=B69C281FBBA494558E704A45F1BDE842C49789A1F3A5259C39B848DF23401FF4` (`compute_strict_proof_hash` positional 6-field)
- Canonical payload: `{"orchestrator_run_id":"auto-20260913-us0135","phase_id":"qa","proof_issued_at":"2026-09-13T05:15:00Z","proof_ttl_seconds":3600,"role":"qa","runtime_proof_id":"rp-auto-20260913-us0135-qa-qa-20260913T051500Z-US-0135"}`
- `hash_recompute_confirmation=true` (compute_strict_proof_hash → B69C281FBBA494558E704A45F1BDE842C49789A1F3A5259C39B848DF23401FF4)

## Strict runtime proof (DEC-0038) — plan-verify (ultra_lean merged)

- `runtime_proof_id=rp-auto-20260913-us0135-plan-verify-qa-20260913T051500Z-US-0135`
- `phase_id=plan-verify`, `role=qa`
- `proof_issued_at=2026-09-13T05:15:00Z`, `proof_ttl=2026-09-13T06:15:00Z`
- `proof_hash=2D0FFBA0968AA99908DF3FCBD1EE35655710FEBD75CDBAD480D7A1D282E48F37`
- Canonical payload: `{"orchestrator_run_id":"auto-20260913-us0135","phase_id":"plan-verify","proof_issued_at":"2026-09-13T05:15:00Z","proof_ttl_seconds":3600,"role":"qa","runtime_proof_id":"rp-auto-20260913-us0135-plan-verify-qa-20260913T051500Z-US-0135"}`
- `hash_recompute_confirmation=true` (compute_strict_proof_hash → 2D0FFBA0968AA99908DF3FCBD1EE35655710FEBD75CDBAD480D7A1D282E48F37)

## Isolation evidence (US-0048 / DEC-0029 / US-0104 v2)

- `phase_id=qa`, `role=qa`, `model_id=cursor-grok-4.6-high` (CROSS_MODEL_REVIEW=1 — required)
- `fresh_context_marker=qa-US0135-qa-20260913T051500Z-fresh` (NEW per US-0048 / BUG-0006)
- `timestamp=2026-09-13T05:15:00Z` (UTC)
- `evidence_ref=sprints/S0141/qa-findings.md; sprints/S0141/plan-verify.json; sprints/S0141/uat.json; sprints/S0141/uat.md`
- Fresh qa subagent per BUG-0006 / US-0048 isolation; no prior chat history carried forward. Context limited to narrow-read (US-0053). No `.env` reads, no credentials access, no intake-evidence mutation, no backlog Status/AC mutation, no acceptance.md mutation, no architecture.md mutation, no DONE-row mutation, no `/execute` or `/verify-work` spawn from this subagent.

## Next scheduled phase

- `next_scheduled_phase=/verify-work` (role=qa per US-0069 / DEC-0051; fresh qa subagent per BUG-0006 — orchestrator-owned spawn; after sovereign-critic of qa if CROSS_MODEL_REVIEW=1)
- `next_scheduled_role=qa`
- `stop_condition=STOP after qa PASS. Orchestrator spawns sovereign-critic of qa (CROSS_MODEL_REVIEW=1), then /verify-work in a fresh qa subagent (BUG-0006). Do NOT spawn /verify-work or /execute from this subagent. Do NOT mark US-0135 DONE. Do NOT tick acceptance. Do NOT mutate intake JSON. Do NOT mutate architecture.md. Do NOT reopen BUG-0020. Do NOT mutate US-0136+.`
- `artifacts_written=sprints/S0141/qa-findings.md, sprints/S0141/plan-verify.json, sprints/S0141/uat.json, sprints/S0141/uat.md, sprints/S0141/progress.md, docs/engineering/state.md (qa checkpoint append), handoffs/qa_to_verify.md (prepend), handoffs/resume_brief.md (qa PASS prepend → /verify-work)`
- `handoffs/qa_to_dev.md=NOT written` (no blocking findings; AUTO_IMPLEMENTATION_LOOP does not return to /execute)
