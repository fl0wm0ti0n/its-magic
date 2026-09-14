# Sprint S0150 - Sprint Plan (US-0142)

## Metadata

| Field | Value |
|---|---|
| story_id | US-0142 |
| bug_id | (none) |
| story_title | Owned browser UAT and evidence runtime |
| sprint_id | S0150 |
| delivery_mode | ultra_lean |
| macro_phase | plan (sprint-plan terminal; plan-verify NOT in resolved_phase_plan — skipped; next = sovereign-critic of sprint-plan then execute) |
| current_phase | sprint-plan |
| approach | A1 locked (from R-0139 DQ1–DQ10; DEC-0142 Accepted; architecture critic NB1–NB3 CLOSED) |
| companion_DEC | DEC-0142 (Accepted) |
| research_anchor | R-0139 (DQ1–DQ10 LOCKED; compose R-0138 / R-0079 / R-0111 / R-0129 / R-0135; do not wipe R-0120..R-0139; R-0138 remains US-0141; R-0136/R-0137 remain BUG-0023) |
| architecture_anchor | docs/engineering/architecture.md # US-0142 |
| orchestrator_run_id | auto-20260913-us0142 |
| parent_orchestrator_run_id | auto-20260913-us0141 |
| fresh_context_marker | tl-US0142-sprintplan-20260914T041000Z-fresh |
| timestamp | 2026-09-14T04:10:00Z (UTC) |
| model_id | cursor-grok-4.6-high (CROSS_MODEL_REVIEW=1 — required on isolation) |
| verdict | PASS |
| decision_gate | false |
| SPRINT_MAX_TASKS | 12 |
| SPRINT_AUTO_SPLIT | 1 |
| task_count | 11 (T-anch + T-001..T-010, within 12, no split, 1:1 from architecture seeds) |
| COMPONENT_SCOPE_MODE | 0 |
| USER_GUIDE_MODE | 0 |
| plan-verify | ultra_lean — NOT in resolved_phase_plan; skipped; plan-verify.json written as SKIPPED placeholder only (not a QA phase); reason=`ultra_lean_not_in_resolved_phase_plan` |
| backlog_status | OPEN (US-0045 — not mutated; AC-1..AC-8 unchecked) |
| sprint_id_lock | **S0150** is next free after S0149 (US-0141). Confirmed no S0150 folder existed before this spawn. Do not reuse S0146 (BUG-0021), S0147 (US-0140), S0148 (BUG-0023), or S0149 (US-0141). |
| critic_carry_ins | 0 new blocking; 3 architecture critic NBs us0142arc-* status=resolved non-blocking — routed as awareness into /execute |

## Scope summary

Add one owned browser UAT and evidence runtime so QA can execute UI acceptance in isolated Playwright contexts and operator-authorized CDP sessions connected to US-0141 AppRuntime. New package `@its-magic/browser-uat` never imports Pi. Compose US-0141 `ConnectHandoff` / `connectHandoff` **only** (navigate `connect_endpoint`/`url`; probe `health_path`; record `app_runtime_ref`). Do **not** reimplement AppRuntime / ProcessManager / ExecutionBackend. Do **not** nest BrowserUAT inside CommandRouter/GateEngine. Playwright **owns** isolated launch; CDP **disconnects** (does not kill) the operator browser. Default Chrome User Data is **forbidden**. Pixel visual baseline is **OUT**. `/auto`/`/quick` drain is **US-0143 OUT**. Role-runtime / PolicyEngine path-shell tables / config / KernelBridge / isolation loader stay **unamended** except promoting `itsm_browser` from `STUB_TOOLS`. DEC-0038 `compute_strict_proof_hash` tuple stays **UNAMENDED**. Execute owns package files.

Approach A1 (DEC-0142 Accepted): `standalone/packages/browser-uat` (`@its-magic/browser-uat`, private, no Pi imports) + `BrowserUAT` facade + isolated Playwright driver (`launch`+`newContext`) + typed CDP adapter (`connectOverCDP`+`disconnect`, dedicated profile) + evidence writer + UAT executor plug-in + promote `itsm_browser` + additive `UAT_BROWSER_PROBE_MODE=owned` + fail-closed `BROWSER_*`/`UAT_*` + `BROWSER_RETRY_MAX` default 2 + 12 `test_us0142_*` on Windows + Linux, fake-model CI, fake driver, in-process HTTP fixture.

Out of scope: A2 nested under `app-runtime`, A3 fold into `tool-broker`, A4 Cursor MCP remains v1 authority, A5 Puppeteer, A6 Selenium, A7 `launchPersistentContext` on default Chrome User Data, A8 pixel visual baseline / `toHaveScreenshot` v1, A9 US-0143 `/auto` drain, A10 rewrite GateEngine/workflow, A11 require live Chrome in CI, A12 replace kit `UAT_BROWSER_PROBE_MODE` default `cursor`, A13 silent/fake browser PASS, A14 kit Python Playwright as standalone runtime, A15 `browser.close()` after CDP as default teardown, US-0143..US-0148, marking US-0142 DONE, ticking AC checkboxes, reopening US-0133..US-0141, mutating BUG-0021/BUG-0022/BUG-0023 or S0146/S0147/S0148/S0149, wiping R-0120..R-0139.

## Execute awareness (architecture critic NBs — 0 blocking)

Sovereign-critic of architecture PASS (`critic-US0142-architecture-20260914T040000Z-fresh`; anti_slop=10; 0 blocking; degraded_mode=false). Consumed architecture proof MATCH before TTL. Route these resolved NBs as execute awareness — do not re-open them as work:

| Finding | Issue key | Execute awareness |
|---|---|---|
| us0142arc-challenger-001 | ik_us0142arc_proof_failclosed_pass | T-002/T-003/T-006/T-007/T-008/T-010: fail-closed `BROWSER_*` / `UAT_*` locked DEC-0142. Chrome 136+ default profile forbidden. Traces/HAR redact before persist. CDP `disconnect()` not `close()`. `BROWSER_RETRY_MAX` orthogonal to `APP_RUNTIME_RESTART_MAX`. Never read `.env`. Pixel baseline OUT. `compute_strict_proof_hash` tuple unamended. Status OPEN; R-0139 not R-0138. |
| us0142arc-architect-002 | ik_us0142arc_layer_sprintplan_owns_next | Keep **T-anch..T-010 1:1** from architecture seeds; sprint folder is **S0150** (S0149=US-0141 occupied). Architecture owns H1+DEC-0142; execute owns `@its-magic/browser-uat` + compose `connectHandoff` + 12 tests. ToolBroker→BrowserUAT; do not rewrite AppRuntime/workflow/GateEngine. US-0143 drain OUT; pixel baseline OUT. |
| us0142arc-subtractor-003 | ik_us0142arc_scope_yagni_pass | T-anch ceremony overlap acceptable. Do not invent extra tasks. Do not amend isolation loader / `noTools` / KernelBridge / auth-models / PolicyEngine path/shell/secret tables / RoleCatalog internals / config loaders. Do not design US-0143+. Do not own credentials or read `.env`. Do not mark US-0142 DONE. Do not reopen US-0133..US-0141. Do not mutate BUG-0021/0022/0023 or S0146/S0147/S0148/S0149. 12 markers required. 11 tasks within SPRINT_MAX_TASKS=12. |

## Acceptance criteria (8) — US-0142 (status OPEN, unchecked per US-0045)

Primary acceptance (`docs/product/acceptance.md` US-0142 row): Owned browser UAT and evidence runtime — Playwright/CDP, typed actions, compatible UAT planning, complete evidence, credentials, and E2E tests (8 ACs).

- **AC-1**: Playwright provides reproducible isolated/headless contexts and an operator-authorized Chrome/Chromium CDP mode supports existing logged-in developer sessions. — T-001, T-002, T-003 (T-010 m1–m3).
- **AC-2**: QA receives a typed browser tool covering open, navigate, snapshot, click, type, select, wait, screenshot, console, network, download/upload, and accessibility actions. — T-004 (T-010 m4).
- **AC-3**: Existing UAT planning/classification maps acceptance steps to process health, CLI smoke, browser smoke, API probes, or manual judgment and persists compatible `uat.json` results. — T-005 (T-010 m5, m6).
- **AC-4**: Each applicable probe records screenshot, snapshot summary, console errors, failed requests, final URL, trace, duration, backend, and app-runtime reference. — T-006 (T-010 m7).
- **AC-5**: Browser crashes, failed waits/assertions, console/network failures, missing authorization, and evidence gaps return deterministic fail-closed outcomes under bounded retry policy. — T-008 (T-010 m3, m10).
- **AC-6**: Browser agents cannot read credentials from project files; authenticated flows use an authorized profile, opaque externally injected test account, or explicit operator approval. — T-007 (T-010 m9).
- **AC-7**: Headers, cookies, tokens, and sensitive form data are redacted from evidence and logs. — T-006 (T-010 m8).
- **AC-8**: E2E fixtures prove app launch through browser action/evidence/UAT gate in both happy and failure paths; exploratory flows can be promoted to regression specs without making visual diff a v1 blocker. — T-009 (T-010 m11, m12).

## Task summaries (11 — T-anch + T-001..T-010)

- **T-anch** (NO-OP / verification): Verify `# US-0142` H1 + DEC-0142 Accepted + A1 + R-0139 DQ1–DQ10 + 12-marker list. Record to `sprints/S0150/t-anch-verification.md`. NO mutation to `architecture.md` / `DEC-0142.md` / R-0139 in /execute.
- **T-001** (AC-1): Create `standalone/packages/browser-uat` (`@its-magic/browser-uat`). `private: true`, `version: 0.0.0`, `type: module`, `engines.node >=22.19.0`, export `./src/index.ts`. BrowserUAT facade. No Pi imports. Consume `connectHandoff`. Extend US-0133..0141 Pi-import grep. Do not nest inside `app-runtime` or GateEngine. Kit `files` omit `standalone/`.
- **T-002** (AC-1): Isolated Playwright `chromium.launch({ headless })` + `browser.newContext()`. Close OK (Playwright-owned).
- **T-003** (AC-1): CDP adapter `connectOverCDP` + `disconnect()` + dedicated `--user-data-dir`. Default Chrome User Data → `BROWSER_CDP_DEFAULT_PROFILE_FORBIDDEN`. Missing approval → `BROWSER_CDP_UNAUTHORIZED` (no silent isolated fallback).
- **T-004** (AC-2): Promote `itsm_browser` from PolicyEngine `STUB_TOOLS`. Typed action enum LOCKED. ToolBroker handler delegates to BrowserUAT (no Playwright import in broker). Snapshot ≠ pixel.
- **T-005** (AC-3): UAT planner plug-in; reuse `classify_step`. Additive `UAT_BROWSER_PROBE_MODE=owned`. Kit default `cursor` held. Kit-slice `UAT_PROBE_FORBIDDEN` unweakened.
- **T-006** (AC-4/AC-7): Evidence schema + redaction + gitignored traces under `.its-magic/runtime/browser-evidence/`. Compatible `uat.json` + `browser_evidence_refs`. HAR `content: "omit"`.
- **T-007** (AC-6): Credential deny + opaque injection / operator approval. Never read `.env`. Repo-file passwords → `UAT_PROBE_FORBIDDEN` / `BROWSER_CREDENTIAL_FORBIDDEN`.
- **T-008** (AC-5): Fail-closed `BROWSER_*`/`UAT_*` + `BROWSER_RETRY_MAX` default 2. Missing CDP auth is not retried into isolated. No fake browser PASS.
- **T-009** (AC-8): E2E happy+failure fixtures with in-process HTTP app. No visual baseline / `toHaveScreenshot`.
- **T-010** (AC-1..AC-8): Twelve `test_us0142_*` markers (DEC-0142 §9). Primary `standalone/tests/contract` (`node:test`) Windows + Linux. Fake-model CI. Fake driver. Count stays 12.

Execution order: T-anch → T-001 → T-002 → T-003 → T-004 → T-005 → T-006 → T-007 → T-008 → T-009 → T-010 (acyclic). No split (11 ≤ 12). Not `/quick`.

## AC → Task surjective coverage

| AC | Task(s) |
|---|---|
| AC-1 (isolated + CDP) | T-001, T-002, T-003 (T-010 m1–m3) |
| AC-2 (typed itsm_browser) | T-004 (T-010 m4) |
| AC-3 (UAT planner + owned) | T-005 (T-010 m5, m6) |
| AC-4 (evidence schema) | T-006 (T-010 m7) |
| AC-5 (fail-closed retry) | T-008 (T-010 m3, m10) |
| AC-6 (credentials) | T-007 (T-010 m9) |
| AC-7 (redaction) | T-006 (T-010 m8) |
| AC-8 (E2E happy+failure) | T-009 (T-010 m11, m12) |
| DC / architecture baseline | T-anch |

**Surjectivity check**: 8/8 ACs covered (each AC ≥1 task) + primary acceptance.md US-0142 row covered by AC-1..AC-8 aggregate. T-010 markers m1–m12 attest AC-1..AC-8. No `PLAN_AC_COVERAGE_GAP`. T-anch retained as verification-only.

## Locked 12-marker table (DEC-0142 / architecture)

1. `test_us0142_isolated_launch_context`
2. `test_us0142_cdp_connect_disconnect`
3. `test_us0142_cdp_unauthorized_and_default_profile`
4. `test_us0142_itsm_browser_typed_actions`
5. `test_us0142_uat_planner_browser_smoke`
6. `test_us0142_kit_forbidden_unweakened`
7. `test_us0142_evidence_schema_connect_ref`
8. `test_us0142_redact_headers_cookies_tokens`
9. `test_us0142_credential_deny_no_env`
10. `test_us0142_fail_closed_retry_cap`
11. `test_us0142_e2e_happy_uat_gate`
12. `test_us0142_e2e_failure_and_exploratory_spec`

Primary: `standalone/tests/contract` (`node:test`) Windows + Linux. Fake-model CI. Fake `BrowserDriver` / fake CDP endpoint. No paid model calls. No required live Chrome/Chromium. Count stays 12.

## Risks (R1–R7 — accepted)

| Risk | Severity | Mitigation |
|---|---|---|
| R1 Playwright traces/HAR leak cookies and Authorization | HIGH | T-006/T-010 m8: HAR omit + US-0135 redact; gitignore traces |
| R2 Operators CDP-attach the daily Chrome profile (Chrome 136+) | HIGH | T-003/T-010 m3: dedicated `--user-data-dir`; `BROWSER_CDP_DEFAULT_PROFILE_FORBIDDEN` |
| R3 Live Chromium absent on CI | MEDIUM | T-010: fake driver; `BROWSER_UNAVAILABLE` asserted, not skipped |
| R4 `browser.close()` after CDP kills a logged-in session | MEDIUM | T-003/T-010 m2: `disconnect()` |
| R5 Weakening kit `UAT_PROBE_FORBIDDEN` to make US-0142 green | MEDIUM | T-005/T-010 m6: kit-slice waives held |
| R6 Credential injection visible to the model | LOW | T-007/T-010 m9: names-only; never read `.env` |
| R7 npm name bikeshed vs §30 | LOW | T-001: H1/DEC-0142 pins `browser-uat` |

## Compose guards (UNCHANGED)

| Target | Result |
|---|---|
| US-0141 / DEC-0141 / R-0138 | `ConnectHandoff` / `connectHandoff` consume; AppRuntime not rewritten |
| US-0093 / R-0079 | `classify_step` / `uat.json` / `browser_evidence_refs` KEEP; REPLACE backend; add `owned` |
| US-0065 | probe catalog kinds unchanged |
| US-0128 / R-0111 | no fake browser PASS; kit waives stay `UAT_PROBE_FORBIDDEN` |
| US-0135 / DEC-0135 | `redact.ts` headers/cookies/tokens before persist |
| US-0137 / DEC-0137 / R-0129 | PolicyEngine `itsm_browser` STUB → promote only; tables unamended |
| US-0140 / DEC-0140 / R-0135 | GateEngine / workflow consume-not-rewrite |
| US-0085 | `.env` deny |
| US-0056 / DEC-0038 | `compute_strict_proof_hash` tuple UNAMENDED |
| Kit npm `its-magic` / DEC-0120 | `files` whitelist omit `standalone/` |
| US-0143..US-0148 | OUT OF SCOPE (US-0143 drain) |
| US-0133..US-0141 DONE | compose only, do not reopen |
| BUG-0021 DONE | not mutated (`sprints/S0146/`) |
| BUG-0022 OPEN | not mutated |
| BUG-0023 DONE | not mutated (`sprints/S0148/`) |
| R-0120..R-0139 | not wiped (R-0138/R-0136/R-0137 intact) |
| US-0045 | Status stays OPEN |

## Execute phase role (per DEC-0051 / US-0069)

| Phase | Role | Isolation |
|---|---|---|
| /execute | dev (fresh per BUG-0006) | {phase_id:execute, role:dev} |
| /qa | qa (fresh) | {phase_id:qa, role:qa} — ultra_lean may overwrite plan-verify.json inside build+verify |
| /verify-work | qa (fresh) | {phase_id:verify-work, role:qa} |
| /release | release (fresh) | {phase_id:release, role:release} |
| /closure | qe (fresh) | {phase_id:closure, role:qe} |
| /refresh-context | curator (fresh) | {phase_id:refresh-context, role:curator} |

## Isolation evidence (US-0048 / DEC-0029 / US-0104 v2)

| Field | Value |
|---|---|
| phase_id | sprint-plan |
| role | tech-lead |
| story_id | US-0142 |
| sprint_id | S0150 |
| orchestrator_run_id | auto-20260913-us0142 |
| parent_orchestrator_run_id | auto-20260913-us0141 |
| delivery_mode | ultra_lean |
| macro_phase | plan |
| fresh_context_marker | tl-US0142-sprintplan-20260914T041000Z-fresh |
| timestamp | 2026-09-14T04:10:00Z (UTC) |
| model_id | cursor-grok-4.6-high (CROSS_MODEL_REVIEW=1 — required) |
| evidence_ref | sprints/S0150/sprint.md, tasks.md, progress.md, uat.json, uat.md, plan-verify.json (SKIPPED), summary.md, qa-findings.md, release-findings.md, closure-verification.md, handoffs/tl_to_dev.md, docs/engineering/state.md, handoffs/resume_brief.md, docs/product/backlog.md ## US-0142 sprint_plan_notes |

Prior phase proof consumed: `rp-auto-20260913-us0142-architecture-techlead-20260914T035000Z-US-0142` / `52A720174CB9E0D35507ED9683ED70D22D72A5D9E757A5CF1170B2AC304B3175` — RUNTIME_PROOF_VALID (independent `compute_strict_proof_hash` MATCH, consumed 2026-09-14T04:10:00Z before TTL 2026-09-14T04:50:00Z). Sovereign-critic architecture PASS (`rp-auto-20260913-us0142-sovereign-critic-techlead-20260914T040000Z-US-0142` / `FD58C34EB6D949E85F1E7C5866AA9FA8EA19CB24FAD3D7D7ED2DF210E72B65E4`; `critic-US0142-architecture-20260914T040000Z-fresh`; anti_slop=10; 0 blocking; degraded_mode=false; findings us0142arc-* informational — routed). MATCH before TTL 2026-09-14T05:00:00Z.

Sovereign memory: `SOVEREIGN_MEMORY=1`; `build_injection_digest_block` returned `(no sovereign memory entries)` (read-only). No `mistakes.jsonl` write.

## Runtime proof (DEC-0038)

| Field | Value |
|---|---|
| runtime_proof_id | rp-auto-20260913-us0142-sprint-plan-techlead-20260914T041000Z-US-0142 |
| phase_id | sprint-plan |
| role | tech-lead |
| story_id | US-0142 |
| sprint_id | S0150 |
| orchestrator_run_id | auto-20260913-us0142 |
| delivery_mode | ultra_lean |
| macro_phase | plan |
| model_id | cursor-grok-4.6-high (CROSS_MODEL_REVIEW=1 — required) |
| proof_issued_at | 2026-09-14T04:10:00Z |
| proof_ttl_seconds | 3600 |
| proof_ttl | 2026-09-14T05:10:00Z (UTC) |
| proof_hash | 4F3D2D0DD9ADF5E18221DD2CF7169103F4DE4AD90CC2C88E38104E7A3C6182BA |
| canonical_payload | `{"orchestrator_run_id":"auto-20260913-us0142","phase_id":"sprint-plan","proof_issued_at":"2026-09-14T04:10:00Z","proof_ttl_seconds":3600,"role":"tech-lead","runtime_proof_id":"rp-auto-20260913-us0142-sprint-plan-techlead-20260914T041000Z-US-0142"}` |

Hash via `scripts.token_cost_lib.compute_strict_proof_hash` (positional, compact sorted-key JSON). Isolation extras (not hashed): `delivery_mode=ultra_lean`, `macro_phase=plan`, `model_id=cursor-grok-4.6-high`, `sprint_id=S0150`, `story_id=US-0142`. hash_recompute_confirmation=true (compute_strict_proof_hash → 4F3D2D0DD9ADF5E18221DD2CF7169103F4DE4AD90CC2C88E38104E7A3C6182BA).

## Decision gate

| Field | Value |
|---|---|
| decision_gate | false |
| stop_conditions_met | yes |
| missing_acceptance_criteria | none (8/8 slices + primary acceptance row covered, 12 contract-test markers) |
| task_count | 11 (within SPRINT_MAX_TASKS=12, SPRINT_AUTO_SPLIT=1 but no split needed, 1:1 seeds, not /quick, not --bulk) |
| risks_finalized | 7/7 ACCEPTED (R1..R7) |
| approach | A1 locked |
| companion_DEC | DEC-0142 Accepted |
| plan-verify readiness | ultra_lean — plan-verify NOT in resolved_phase_plan, skipped, plan-verify.json is a SKIPPED placeholder (`ultra_lean_not_in_resolved_phase_plan`) |
| sovereign_memory_note | `build_injection_digest_block` returned `(no sovereign memory entries)` (read-only). No `mistakes.jsonl` write. |

## Definition of done (sprint-plan)

- [x] 11 tasks enumerated (T-anch + T-001..T-010) — within SPRINT_MAX_TASKS=12, 1:1 from architecture seeds
- [x] 8/8 ACs surjective + primary acceptance.md US-0142 covered
- [x] All 12 `test_us0142_*` mapped
- [x] Task dependency graph documented
- [x] Execute phase role matrix documented (ultra_lean — /plan-verify skipped, next = sovereign-critic then /execute)
- [x] Compose guards UNCHANGED
- [x] Critic carry-ins (3 non-blocking from architecture sovereign-critic) routed as execute awareness, sprint id locked S0150
- [x] Isolation evidence + runtime proof emitted (model_id=cursor-grok-4.6-high present)
- [x] Sprint-plan checkpoint appended to docs/engineering/state.md
- [x] Sprint-plan handoff prepended to handoffs/tl_to_dev.md
- [x] Sprint-plan PASS prepended to handoffs/resume_brief.md (→ sovereign-critic then /execute, not plan-verify)
- [x] UAT placeholders written (uat.json empty steps, uat.md ACs no results)
- [x] Lifecycle stubs written (summary.md, qa-findings.md, release-findings.md, closure-verification.md)
- [x] Traceability row added (Story=US-0142, Sprint=S0150, Tasks=T-anch+T-001..T-010, Status=PLANNED, Evidence empty)
- [x] Backlog status OPEN (US-0045 — not mutated), acceptance unchecked, sprint_plan_notes appended
- [x] plan-verify.json SKIPPED placeholder (not a QA phase)

## Next scheduled phase

| Field | Value |
|---|---|
| next_scheduled_phase | sovereign-critic (sprint-plan, CROSS_MODEL_REVIEW=1) then /execute (role=dev per US-0069 / DEC-0051, fresh dev subagent per BUG-0006, first canonical phase of build+verify macro per ultra_lean, plan-verify NOT in resolved_phase_plan — skipped) |
| next_scheduled_role | tech-lead (critic of sprint-plan), then dev |
| next_sprint_macro | build+verify (ultra_lean — plan-verify skipped at this boundary) |
| stop_condition | STOP after sprint-plan completes, hand off via artifacts only. Orchestrator MUST spawn sovereign-critic of sprint-plan then /execute in fresh dev subagent per BUG-0006. Do not spawn /execute, /plan-verify, or critic from this subagent. |
