# Sprint S0141 - Sprint Plan (US-0135)

## Metadata

| Field | Value |
|---|---|
| story_id | US-0135 |
| bug_id | (none) |
| story_title | Authenticate providers and resolve per-role models through an owned router |
| sprint_id | S0141 |
| delivery_mode | ultra_lean |
| macro_phase | plan (sprint-plan terminal; plan-verify NOT in resolved_phase_plan — skipped; next = execute) |
| current_phase | sprint-plan |
| approach | A1 locked (from R-0127 DQ1–DQ10; DEC-0135 Accepted; architecture critic NB1–NB3 CLOSED) |
| companion_DEC | DEC-0135 (Accepted) |
| research_anchor | R-0127 (DQ1–DQ10 LOCKED; compose R-0121 / R-0122; do not wipe R-0120..R-0126) |
| architecture_anchor | docs/engineering/architecture.md # US-0135 |
| orchestrator_run_id | auto-20260913-us0135 |
| parent_orchestrator_run_id | auto-20260913-bug0020 |
| fresh_context_marker | tl-US0135-sprintplan-20260913T043500Z-fresh |
| timestamp | 2026-09-13T04:35:00Z (UTC) |
| model_id | cursor-grok-4.6-high (CROSS_MODEL_REVIEW=1 — required on isolation) |
| verdict | PASS |
| decision_gate | false |
| SPRINT_MAX_TASKS | 12 |
| SPRINT_AUTO_SPLIT | 1 |
| task_count | 10 (T-anch + T-001..T-009; within 12; no split; 1:1 from architecture seeds) |
| COMPONENT_SCOPE_MODE | 0 |
| USER_GUIDE_MODE | 0 |
| plan-verify | ultra_lean — NOT in resolved_phase_plan; skipped; plan-verify.json written as deferred/skipped placeholder only (not a QA phase; QA may overwrite in build+verify) |
| backlog_status | OPEN (US-0045 — not mutated; AC-1..AC-7 unchecked) |
| sprint_id_lock | **S0141** is next free after S0140 (BUG-0020). Confirmed no S0141 folder existed before this spawn. |
| critic_carry_ins | 0 new blocking; 3 architecture critic NBs `us0135arc-*` status=resolved non-blocking — routed as awareness into /execute (below) |

## Scope summary

Add **owned standalone authentication and 6-step model routing** so operators can use Codex OAuth, API-key providers, Chinese/local/custom gateways, independent thinking levels, and critic pinning without exposing credentials to agents, repositories, or audit. Pi stays behind `packages/pi-kernel`. Workflow/CLI never import Pi. Fake-model CI default, empty resource loader, `noTools: "builtin"`, and KernelBridge stay **unamended**.

**Approach A1** (DEC-0135 Accepted): `standalone/packages/auth-models` (`@its-magic/auth-models`, private, **no Pi imports**) + pi-kernel **AuthRuntimeAdapter** wrapping `ModelRuntime.create({ authPath, modelsPath })` / three-arg `login` / `checkAuth` / in-process `registerProvider`; owned OS credential dir (XDG / `%APPDATA%` / macOS Application Support `its-magic/`, 0600-class); 6-step ModelRouter + provenance; thinking inject independent of slug/`TOKEN_PROFILE` (clamp+provenance); critic pin + `CROSS_MODEL_DEGRADED_MODE`; `itsm auth` / `models list` / `models test`; ten `test_us0135_*` on Windows + Linux; fake-model CI default **held**.

Out of scope: A2 `~/.pi/agent` as ship store; A3 project / `.env` credentials; A4 workflow/CLI Pi imports; A5 fold AuthService into `pi-kernel` only; A6 load project `.pi/extensions`; A7 live paid CI; A8 Cursor catalog as standalone runtime; A9 auto-next-slug on critic collision; amending isolation loader / `noTools` / KernelBridge; US-0136..US-0148; marking US-0135 DONE; ticking AC checkboxes; reopening US-0133, US-0134, or BUG-0020; wiping R-0120..R-0126.

## Execute awareness (architecture critic NBs — 0 blocking)

Sovereign-critic of architecture PASS (`critic-US0135-architecture-20260913T042500Z-fresh`; anti_slop=10; 0 blocking). Consumed architecture proof MATCH before TTL. Route these resolved NBs as execute awareness — do not re-open them as work:

| Finding | Issue key | Execute awareness |
|---|---|---|
| `us0135arc-challenger-001` | `ik_us0135_arc_proof_pass` | **T-001/T-002/T-003/T-006/T-009**: A1 `auth-models` + AuthRuntimeAdapter layering locked. Thinking **clamp+provenance** (not `MODEL_THINKING_UNSUPPORTED`). Windows v1 = `%APPDATA%` user profile (no extra ACL this story). Persist via `login(..., "api_key")` not `setRuntimeApiKey`. OAuth refresh contract test marker locked (T-009 m9). |
| `us0135arc-architect-002` | `ik_us0135_arc_layer_sprintplan_owns` | Keep **T-anch..T-009 1:1** from architecture seeds; sprint folder is **S0141**; architecture owns H1+DEC-0135; execute owns `auth-models` bootstrap + AuthRuntimeAdapter + 10 tests. CLI → auth-models → pi-kernel adapter dependency direction. DEC-0133/0134 compose guards held. |
| `us0135arc-subtractor-003` | `ik_us0135_arc_scope_yagni_pass` | T-anch ceremony overlap acceptable. Do not invent extra tasks. Do not amend isolation loader / `noTools` / KernelBridge. Do not design US-0136+. Do not mark US-0135 DONE. Do not reopen BUG-0020. 10 markers required. 10 tasks within SPRINT_MAX_TASKS=12. |

## Acceptance criteria (7) — US-0135 (status OPEN, unchecked per US-0045)

Primary acceptance (`docs/product/acceptance.md` US-0135 row): Standalone authentication and model routing — Codex OAuth, API/custom providers, role precedence, thinking levels, critic collision, and credential safety (7 ACs).

- **AC-1**: CLI auth supports listing and configuring credentials, including ChatGPT Plus/Pro Codex OAuth and at least one API-key provider; stable release uses an owned credential location outside project files. — T-001, T-002, T-003, T-008 (T-009 m1–m3).
- **AC-2**: Provider support covers the masterplan's built-in, Chinese, local OpenAI-compatible, and custom corporate gateway categories through Pi transport/auth adapters. — T-003, T-004 (T-009 m8).
- **AC-3**: Model resolution implements explicit CLI > phase-local > role catalog > critic override > tier/catalog > runtime default precedence with observable provenance. — T-005 (T-009 m4).
- **AC-4**: Thinking level is configured independently from provider/model slug and token profile. — T-006 (T-009 m5).
- **AC-5**: Critic model pinning is honored; producer/critic slug collision is reported as degraded multi-lens operation and never as false cross-model independence. — T-007 (T-009 m6).
- **AC-6**: `itsm auth`, `itsm models list`, and `itsm models test <provider/model>` provide actionable health diagnostics without logging tokens. — T-008 (T-009 m7).
- **AC-7**: Tests prove two roles can use different providers in one run and OAuth refresh never exposes a token to model context, repo artifacts, or audit payloads. — T-009 (m8, m9, m10).

## Task summaries (10 — T-anch + T-001..T-009)

- **T-anch** (NO-OP / verification): Verify `# US-0135` H1 + DEC-0135 Accepted + A1 + R-0127 DQ1–DQ10 + 10-marker list. Record to `sprints/S0141/t-anch-verification.md`. NO mutation to `architecture.md` / `DEC-0135.md` / R-0127 in /execute.
- **T-001** (AC-1): Create `standalone/packages/auth-models` (`@its-magic/auth-models`, `private: true`, `version: 0.0.0`, `type: module`, `engines.node >=22.19.0`, export `./src/index.ts`). **No Pi imports.** Extend US-0133/US-0134 grep to deny Pi inside `auth-models`. Do **not** add a Biome override for `auth-models`. Kit `files` omit `standalone/`.
- **T-002** (AC-1): Owned OS credential dir (Linux XDG / Windows `%APPDATA%` / macOS Application Support `its-magic/`); `auth.json` 0600-class (POSIX `chmod 0o600`; Windows v1 = user-profile ACL); `InMemoryCredentialStore` tests (no disk); `--auth-path` / `ITSM_AUTH_PATH` fail-closed `AUTH_PATH_IN_PROJECT` if project-relative. Never project / `.env` / `~/.pi/agent` as ship store.
- **T-003** (AC-1/AC-2): pi-kernel `AuthRuntimeAdapter` — `createRuntime` / three-arg `login` / `logout` / `checkAuth` / in-process `registerProvider`. Codex `openai-codex` + `oauth`. `AUTH_SYNC_FAILED` on `CredentialSynchronizationError`. `setRuntimeApiKey` is one-run only. Do **not** amend isolation loader / `noTools` / KernelBridge. Additive `KernelCreateSessionOptions.thinkingLevel` only.
- **T-004** (AC-2): Provider matrix + owned `models.json`: Codex OAuth; API-key `openai`/`anthropic`/`google`/`openrouter`; Chinese `deepseek`/`kimi-coding`/`zai`/`minimax`/`qwen-token-plan*`; local OpenAI-compatible via owned `models.json`; custom gateway via `models.json` or adapter `registerProvider`. Never load project `.pi/extensions`.
- **T-005** (AC-3): ModelRouter 6-step CLI > phase-local > role catalog > critic overlay > tier/catalog > runtime default; Pi `provider/model` slugs; provenance required; unknown slug fail-closed `MODEL_*`; Cursor aliases not SOT. Thin gitignored `.its-magic/model-catalog.local.json` (slugs/thinking only; secret-shaped keys fail-closed).
- **T-006** (AC-4): Inject `thinkingLevel` on `createAgentSession`; orthogonal to slug/`TOKEN_PROFILE`; clamp+provenance (`thinkingClamped`); always-thinking → `thinkingForced`. Do **not** emit `MODEL_THINKING_UNSUPPORTED` as v1 default.
- **T-007** (AC-5): Critic pin (`critic.model` / CLI overlay) on critic resolve only (step 4). Same normalized slug → `degraded_mode=true` / **`CROSS_MODEL_DEGRADED_MODE`** (reuse; not hard stop; not auto-next-slug). US-0144 owns critic session spawn.
- **T-008** (AC-1/AC-6): `itsm auth` list/login/logout/migrate; `itsm models list`; `itsm models test` (`checkAuth` default; `--live` never CI). Diagnostics `{ provider, model, auth, health }` — **no tokens**. `apps/cli` imports **only** `auth-models` — never Pi.
- **T-009** (AC-7): Ten `test_us0135_*` markers (DEC-0135 §9). Primary `standalone/tests/contract` (`node:test`) Windows + Linux. Kit twin as needed for files-omit / no-Pi-in-auth-models. Fake-model CI default **held**. No paid/model calls.

Execution order: T-anch → T-001 → T-002 → T-003 → T-004 → T-005 → T-006 → T-007 → T-008 → T-009 (acyclic). No split (`SPRINT_AUTO_SPLIT` not triggered). Not `/quick`.

## AC → Task surjective coverage

| AC | Task(s) |
|---|---|
| AC-1 (owned auth + Codex OAuth + API-key) | T-001, T-002, T-003, T-008 (T-009 m1–m3) |
| AC-2 (provider matrix) | T-003, T-004 (T-009 m8) |
| AC-3 (6-step router + provenance) | T-005 (T-009 m4) |
| AC-4 (thinking orthogonal) | T-006 (T-009 m5) |
| AC-5 (critic pin + degraded) | T-007 (T-009 m6) |
| AC-6 (CLI diagnostics, no tokens) | T-008 (T-009 m7) |
| AC-7 (two-role + OAuth refresh isolation) | T-009 (m8, m9, m10) |
| DC / architecture baseline | T-anch |

**Surjectivity check**: 7/7 ACs covered (each AC ≥1 task) + primary acceptance.md US-0135 row covered by AC-1..AC-7 aggregate. No `PLAN_AC_COVERAGE_GAP`. T-anch retained as verification-only.

## Locked 10-marker table (DEC-0135 §9 / architecture)

1. `test_us0135_owned_auth_path_outside_project`
2. `test_us0135_inmemory_credential_store_no_disk`
3. `test_us0135_no_pi_imports_in_auth_models`
4. `test_us0135_model_router_six_step_precedence`
5. `test_us0135_thinking_orthogonal_to_slug_and_token_profile`
6. `test_us0135_critic_same_slug_degraded_mode`
7. `test_us0135_models_test_checkauth_no_token_logs`
8. `test_us0135_two_roles_different_providers_fake`
9. `test_us0135_oauth_refresh_not_in_prompt_audit_or_repo`
10. `test_us0135_fake_model_ci_default_held`

Primary: `standalone/tests/contract` (`node:test`) Windows + Linux. Kit twin as needed. No paid/model calls. Fake-model CI default **held**. Two-role fixture uses two fake/in-memory providers.

## Risks (R1–R6 — accepted)

| Risk | Severity | Mitigation |
|---|---|---|
| R1 Pi 0.85.1 `login(providerId, type, interaction)` vs docs shorthand | MEDIUM | T-003 wrap three-arg SDK; T-009 fake `AuthInteraction` contract tests |
| R2 Windows ACL weaker than POSIX 0600 | MEDIUM | T-002 store under `%APPDATA%`; never project tree; extra ACL later |
| R3 `setRuntimeApiKey` looks like persist | MEDIUM | T-003 persist via `login(..., "api_key")` / CredentialStore; runtime key = one-run only |
| R4 `thinkingLevelMap` holes | LOW | T-006 clamp + provenance (`thinkingClamped`) |
| R5 accidental `.env` read | LOW | T-002/T-008 no dotenv; never project credentials; US-0137 owns tool deny |
| R6 AuthRuntimeAdapter mistaken for amending isolation | LOW | T-003 D8; T-009 m10 empty loader + fake-model default still hold |

## Compose guards (UNCHANGED)

| Target | Result |
|---|---|
| US-0133 / DEC-0133 / R-0121 | compose inject seam + additive `thinkingLevel` only; do not amend AgentKernel isolation / `noTools` / `# US-0133` |
| US-0134 / DEC-0134 / R-0122 | compose locate-only; KernelBridge **unamended** |
| Kit npm `its-magic` / DEC-0120 `files` | compose — omit `standalone/` |
| US-0101/0102 / DEC-0087 | compose — 6-step Pi slugs; Cursor alias dropped |
| US-0130 / US-0104 | compose — reuse `CROSS_MODEL_DEGRADED_MODE`; not `AUTH_CROSS_MODEL_*` |
| DEC-0062 | compose — thinking orthogonal to `TOKEN_PROFILE` |
| US-0132 / DEC-0132 | compose — Cursor catalog host mapping only; not standalone SOT |
| US-0136..US-0148 | OUT OF SCOPE |
| BUG-0020 / R-0126 | DONE — do not reopen; do not wipe R-0126 |
| R-0120..R-0127 | do not wipe |
| DEC-0135 / `# US-0135` / R-0127 | locked — T-anch verify only |
| US-0045 | Status stays OPEN |

## Execute phase role (per DEC-0051 / US-0069)

| Phase | Role | Isolation |
|---|---|---|
| /execute | dev (fresh per BUG-0006) | {phase_id:execute, role:dev} |
| /qa | qa (fresh) | {phase_id:qa, role:qa} — ultra_lean may create/overwrite plan-verify.json inside build+verify; this sprint-plan does **not** run /plan-verify |
| /verify-work | qa (fresh) | {phase_id:verify-work, role:qa} |
| /release | release (fresh) | {phase_id:release, role:release} |
| /closure | qe (fresh) | {phase_id:closure, role:qe} |
| /refresh-context | curator (fresh) | {phase_id:refresh-context, role:curator} |

## Isolation evidence (US-0048 / DEC-0029 / US-0104 v2)

| Field | Value |
|---|---|
| phase_id | sprint-plan |
| role | tech-lead |
| story_id | US-0135 |
| sprint_id | S0141 |
| orchestrator_run_id | auto-20260913-us0135 |
| delivery_mode | ultra_lean |
| macro_phase | plan |
| fresh_context_marker | tl-US0135-sprintplan-20260913T043500Z-fresh |
| timestamp | 2026-09-13T04:35:00Z (UTC) |
| model_id | cursor-grok-4.6-high (CROSS_MODEL_REVIEW=1 — required) |
| evidence_ref | sprints/S0141/sprint.md, sprints/S0141/tasks.md, sprints/S0141/progress.md, sprints/S0141/uat.json, sprints/S0141/uat.md, sprints/S0141/plan-verify.json (deferred/skipped placeholder), handoffs/tl_to_dev.md (US-0135 prepend), docs/engineering/state.md (sprint-plan checkpoint + traceability), docs/engineering/architecture.md # US-0135 (not mutated), decisions/DEC-0135.md (not mutated), handoffs/resume_brief.md |

Prior phase proof consumed: `rp-auto-20260913-us0135-architecture-techlead-20260913T041500Z-US-0135` / `44CCE2BBAB0F863D610152D108DF62D1DACA1F722D2F12CF4DB98067DF1923D7` — RUNTIME_PROOF_VALID (independent `compute_strict_proof_hash` MATCH; consumed 2026-09-13T04:35:00Z before TTL 2026-09-13T05:15:00Z). Sovereign-critic architecture PASS (`rp-auto-20260913-us0135-sovereign-critic-techlead-20260913T042500Z-US-0135` / `F68EFC5ACB6B63B6EB86D5B37589AE781B8CE8EA48539E496AC70AA32D50E68F`; `critic-US0135-architecture-20260913T042500Z-fresh`; anti_slop=10; 0 blocking; findings `us0135arc-*` informational — routed).

## Runtime proof (DEC-0038)

| Field | Value |
|---|---|
| runtime_proof_id | rp-auto-20260913-us0135-sprint-plan-techlead-20260913T043500Z-US-0135 |
| phase_id | sprint-plan |
| role | tech-lead |
| story_id | US-0135 |
| sprint_id | S0141 |
| orchestrator_run_id | auto-20260913-us0135 |
| delivery_mode | ultra_lean |
| macro_phase | plan |
| model_id | cursor-grok-4.6-high (CROSS_MODEL_REVIEW=1 — required) |
| proof_issued_at | 2026-09-13T04:35:00Z |
| proof_ttl_seconds | 3600 |
| proof_ttl | 2026-09-13T05:35:00Z (UTC) |
| proof_hash | 87447355F56BF42813F4499D6FAB84F1CFC19A8ADDDD82A3EB015D05425BB35B |
| canonical_payload | `{"orchestrator_run_id":"auto-20260913-us0135","phase_id":"sprint-plan","proof_issued_at":"2026-09-13T04:35:00Z","proof_ttl_seconds":3600,"role":"tech-lead","runtime_proof_id":"rp-auto-20260913-us0135-sprint-plan-techlead-20260913T043500Z-US-0135"}` |

Hash via `scripts.token_cost_lib.compute_strict_proof_hash` (positional; compact sorted-key JSON). Isolation extras (not hashed): `delivery_mode=ultra_lean`, `macro_phase=plan`, `model_id=cursor-grok-4.6-high`, `sprint_id=S0141`, `story_id=US-0135`. `hash_recompute_confirmation=true` (compute_strict_proof_hash → 87447355F56BF42813F4499D6FAB84F1CFC19A8ADDDD82A3EB015D05425BB35B).

## Decision gate

| Field | Value |
|---|---|
| decision_gate | false |
| stop_conditions_met | yes |
| missing_acceptance_criteria | none (7/7 slices + primary acceptance row covered; 10 contract-test markers) |
| compose_guards | US-0133/0134/DEC-0133/0134/kit files/US-0136..US-0148/BUG-0020/R-0120..R-0127/DEC-0135/US-0045 UNCHANGED |
| dc_check | clean (`# US-0135` H1 already added in /architecture; DEC-0135 Accepted) |
| task_count | 10 (within SPRINT_MAX_TASKS=12; SPRINT_AUTO_SPLIT=1 but no split needed; 1:1 seeds; not `/quick`; not `--bulk`) |
| risks_finalized | 6/6 ACCEPTED (R1..R6) |
| approach | A1 locked |
| companion_DEC | DEC-0135 Accepted |
| plan-verify readiness | ultra_lean — plan-verify NOT in resolved_phase_plan; skipped; plan-verify.json is a deferred/skipped placeholder (not a QA spawn) |
| sovereign_memory_note | `assemble_sovereign_memory_digest(...)` NOT called; no mistakes.jsonl write |

## Definition of done (sprint-plan)

- [x] 10 tasks enumerated (T-anch + T-001..T-009) — within SPRINT_MAX_TASKS=12; 1:1 from architecture seeds
- [x] 7/7 ACs surjective + primary acceptance.md US-0135 covered
- [x] Task dependency graph documented
- [x] Execute phase role matrix documented (ultra_lean — /plan-verify skipped; next = /execute)
- [x] Compose guards UNCHANGED
- [x] Critic carry-ins (3 non-blocking from architecture sovereign-critic) routed as execute awareness; sprint id locked **S0141**
- [x] Isolation evidence + runtime proof emitted (model_id=cursor-grok-4.6-high present)
- [x] Sprint-plan checkpoint appended to `docs/engineering/state.md`
- [x] Sprint-plan handoff prepended to `handoffs/tl_to_dev.md`
- [x] Sprint-plan PASS prepended to `handoffs/resume_brief.md` (-> /execute)
- [x] UAT placeholders written (`uat.json` empty steps, `uat.md` ACs no results)
- [x] Traceability row added (Story=US-0135 | Sprint=S0141 | Tasks=T-anch+T-001..T-009 | Status=PLANNED | Evidence empty)
- [x] Backlog status OPEN (US-0045 — not mutated); acceptance unchecked; sprint_plan_notes appended
- [x] plan-verify.json deferred/skipped placeholder (not a QA phase)

## Next scheduled phase

| Field | Value |
|---|---|
| next_scheduled_phase | `/execute` (role=dev per US-0069 / DEC-0051; fresh dev subagent per BUG-0006; first canonical phase of `build+verify` macro per ultra_lean; plan-verify NOT in resolved_phase_plan — skipped). Orchestrator may run sovereign-critic of sprint-plan first (CROSS_MODEL_REVIEW=1). Do not mandate outer driver. |
| next_scheduled_role | dev |
| next_sprint_macro | build+verify (ultra_lean — plan-verify skipped at this boundary) |
| stop_condition | STOP after sprint-plan completes; hand off via artifacts only. Orchestrator owns critic of sprint-plan (if CROSS_MODEL_REVIEW=1) then `/execute` in fresh dev subagent per BUG-0006. Do not spawn /execute or /plan-verify from this subagent. |
| artifacts_written | sprints/S0141/ (sprint.md, tasks.md, progress.md, uat.json, uat.md, plan-verify.json placeholder), docs/engineering/state.md (sprint-plan checkpoint + traceability), handoffs/tl_to_dev.md (US-0135 prepend), handoffs/resume_brief.md (sprint-plan PASS prepend -> /execute), docs/product/backlog.md (sprint_plan_notes append; Status OPEN) |
