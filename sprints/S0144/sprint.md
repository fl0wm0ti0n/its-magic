# Sprint S0144 - Sprint Plan (US-0138)

## Metadata

| Field | Value |
|---|---|
| story_id | US-0138 |
| bug_id | (none) |
| story_title | Typed runtime configuration and legacy migration adapter |
| sprint_id | S0144 |
| delivery_mode | ultra_lean |
| macro_phase | plan (sprint-plan terminal; plan-verify NOT in resolved_phase_plan — skipped; next = sovereign-critic of sprint-plan then execute) |
| current_phase | sprint-plan |
| approach | A1 locked (from R-0130 DQ1–DQ10; DEC-0138 Accepted; architecture critic NB1–NB3 CLOSED) |
| companion_DEC | DEC-0138 (Accepted) |
| research_anchor | R-0130 (DQ1–DQ10 LOCKED; compose R-0129 / R-0128 / R-0127 / R-0122 / R-0121 / R-0116; do not wipe R-0120..R-0130) |
| architecture_anchor | docs/engineering/architecture.md # US-0138 |
| orchestrator_run_id | auto-20260913-us0138 |
| parent_orchestrator_run_id | auto-20260913-us0137 |
| fresh_context_marker | tl-US0138-sprintplan-20260913T143500Z-fresh |
| timestamp | 2026-09-13T14:35:00Z (UTC) |
| model_id | cursor-grok-4.6-high (CROSS_MODEL_REVIEW=1 — required on isolation) |
| verdict | PASS |
| decision_gate | false |
| SPRINT_MAX_TASKS | 12 |
| SPRINT_AUTO_SPLIT | 1 |
| task_count | 11 (T-anch + T-001..T-010; within 12; no split; 1:1 from architecture seeds) |
| COMPONENT_SCOPE_MODE | 0 |
| USER_GUIDE_MODE | 0 |
| plan-verify | ultra_lean — NOT in resolved_phase_plan; skipped; plan-verify.json written as SKIPPED placeholder only (not a QA phase; QA may overwrite in build+verify) |
| backlog_status | OPEN (US-0045 — not mutated; AC-1..AC-6 unchecked) |
| sprint_id_lock | **S0144** is next free after S0143 (US-0137 DONE). Confirmed no S0144 folder existed before this spawn. |
| critic_carry_ins | 0 new blocking; 3 architecture critic NBs `us0138asc-*` status=resolved non-blocking — routed as awareness into /execute (below) |

## Scope summary

Add **owned standalone typed `RuntimeConfig`** so delivery, token, work-kind, phase, model, autonomy, stop, retry/test, browser, dev-environment, remote, security/compliance, and sovereign settings resolve deterministically from JSONC `.its-magic/` files plus a non-destructive TypeScript `LegacyScratchpadAdapter`. Existing repos keep identity without forced migration. Secrets never enter shared config (names/handles only). PolicyEngine / ModelRouter / RoleCatalog consume **injected flags only**. `@its-magic/config` never imports Pi. Fake-model CI default, empty resource loader, `noTools: "builtin"`, KernelBridge, auth-models store, RoleCatalog internals, and PolicyEngine decision tables stay **unamended**. DEC-0038 `compute_strict_proof_hash` tuple stays **UNAMENDED**. Credentials stay US-0135.

**Approach A1** (DEC-0138 Accepted): `standalone/packages/config` (`@its-magic/config`, private, **no Pi imports**) + Zod-typed versioned `RuntimeConfig` + JSONC `.its-magic/config{,.local,.example}.json` same files as US-0131 analog (do **not** rewrite `host_runtime_config_lib.py`) + TS `LegacyScratchpadAdapter` (absent OK; no Python spawn; no forced migration; DEC-0039 locals preserved) + public 5-layer ladder mapped onto kit 7-layer + per-key provenance + `CONFIG_*` fail-closed + secret names/handles only + US-0119 preset expansion with `security_hard` unrelaxable + inject PolicyEngine/ModelRouter/SessionSupervisor flags only + twelve `test_us0138_*` on Windows + Linux; fake-model CI default **held**.

Out of scope: A2 fold into `runtime-core`; A3 spawn Python `host_runtime_config_lib.py`; A4 cosmiconfig first-found-wins; A5 executable `.js`/`.ts` config; A6 TypeBox/ajv as SOT; A7 YAML SOT; A8 new standalone-only filenames; A9 rewrite PolicyEngine / auth-models / KernelBridge / RoleCatalog; A10 own credentials or read `.env`; A11 rewrite `host_runtime_config_lib.py`; A12 forced migration / overwrite locals; US-0139..US-0148; marking US-0138 DONE; ticking AC checkboxes; reopening US-0133, US-0134, US-0135, US-0136, US-0137, or BUG-0020; wiping R-0120..R-0130.

## Execute awareness (architecture critic NBs — 0 blocking)

Sovereign-critic of architecture PASS (`critic-US0138-architecture-20260913T142500Z-fresh`; anti_slop=10; 0 blocking; degraded_mode=false). Consumed architecture proof MATCH before TTL. Route these resolved NBs as execute awareness — do not re-open them as work:

| Finding | Issue key | Execute awareness |
|---|---|---|
| `us0138asc-challenger-001` | `ik_us0138arc_proof_failclosed_pass` | **T-003/T-004/T-005/T-006/T-007/T-010**: fail-closed edges locked DEC-0138 §4–§8 — 5-layer per-key precedence; argv/env `CONFIG_INVALID` conflict; absent legacy OK vs malformed `CONFIG_LEGACY_INVALID`; secret-shaped `CONFIG_SECRET_REJECTED`; `security_hard` `CONFIG_UNSAFE_RELAXATION`; `CONFIG_UNKNOWN_KEY` default-off. Credentials OUT per US-0135. `compute_strict_proof_hash` tuple unamended. |
| `us0138asc-architect-002` | `ik_us0138arc_layer_config_compose_ok` | Keep **T-anch..T-010 1:1** from architecture seeds; sprint folder is **S0144**; architecture owns H1+DEC-0138; execute owns `standalone/packages/config` bootstrap + Zod schema + adapter + 12 tests. Inject-only PolicyEngine/ModelRouter/SessionSupervisor; US-0131 kit analog compose-only (`host_runtime_config_lib.py` unamended); US-0139/0140 deferred; DEC-0133/0134/0135/0136/0137 compose held. |
| `us0138asc-subtractor-003` | `ik_us0138arc_scope_yagni_pass` | T-anch ceremony overlap acceptable. Do not invent extra tasks. Do not amend isolation loader / `noTools` / KernelBridge / auth-models / PolicyEngine tables. Do not design US-0139+. Do not own credentials or read `.env`. Do not mark US-0138 DONE. Do not reopen US-0137, US-0136, US-0135, or BUG-0020. 12 markers required. 11 tasks within SPRINT_MAX_TASKS=12. |

## Acceptance criteria (6) — US-0138 (status OPEN, unchecked per US-0045)

Primary acceptance (`docs/product/acceptance.md` US-0138 row): Typed runtime configuration and legacy migration adapter — complete typed schema, precedence, scratchpad compatibility, secret policy, and validation (6 ACs).

- **AC-1**: A versioned typed `RuntimeConfig` covers delivery, token, work-kind, phase, model, autonomy, stop, retry/test, browser, dev-environment, remote, security/compliance, and sovereign settings. — T-001, T-002, T-008.
- **AC-2**: Precedence is deterministic and documented as CLI one-run > local project > shared project > legacy scratchpad > framework defaults, with provenance diagnostics. — T-003 (T-010 m1–m4, m12).
- **AC-3**: `LegacyScratchpadAdapter` reads, validates, and maps existing flags without requiring immediate migration and emits actionable migration diagnostics. — T-004 (T-010 m5, m6).
- **AC-4**: Secrets are rejected from shared config; configuration references secret names or execution-layer handles only. — T-005 (T-010 m9).
- **AC-5**: Invalid versions, types, enum values, conflicts, or unsafe relaxations fail closed; security-hard conditions cannot be weakened by autonomy settings. — T-006, T-007 (T-010 m10, m11).
- **AC-6**: Tests cover every precedence layer, absent legacy files, malformed config, local-file preservation, and unchanged behavior for supported existing repositories. — T-009, T-010.

## Task summaries (11 — T-anch + T-001..T-010)

- **T-anch** (NO-OP / verification): Verify `# US-0138` H1 + DEC-0138 Accepted + A1 + R-0130 DQ1–DQ10 + 12-marker list. Record to `sprints/S0144/t-anch-verification.md`. NO mutation to `architecture.md` / `DEC-0138.md` / R-0130 in /execute.
- **T-001** (AC-1): Create `standalone/packages/config` (`@its-magic/config`, `private: true`, `version: 0.0.0`, `type: module`, `engines.node >=22.19.0`, export `./src/index.ts`). **No Pi imports.** Extend US-0133..0137 grep to deny Pi inside the package. Do **not** add a Biome override. Kit `files` omit `standalone/`.
- **T-002** (AC-1): Zod `RuntimeConfig` with required `schema_version` int v1; `z.parse` / mapped `safeParse` → `CONFIG_*`; JSON Schema derived (`draft-2020-12`); AC-1 groups present (browser/dev-env/remote are versioned **handles**).
- **T-003** (AC-2): Public 5-layer per-key resolve + provenance `{ layer, label, path?, source_key }`. Map onto kit 7-layer labels without replacing Python. CLI pins DEC-0138 §5. `CONFIG_KEY_SHADOWED` non-fatal unless strict.
- **T-004** (AC-3): TS `LegacyScratchpadAdapter` parse/validate/map. Absent → empty OK. Present-malformed → `CONFIG_LEGACY_INVALID`. `CONFIG_MIGRATION_HINT` non-blocking. Ignore `MODEL_*` / `MODEL_TIER_*`.
- **T-005** (AC-4): Reject secret-shaped values; names/handles only `^[A-Za-z][A-Za-z0-9_.-]*$`. Fatal `CONFIG_SECRET_REJECTED`. Never read `.env`. Compose US-0135 redact on diagnostics.
- **T-006** (AC-5): Fail-closed invalid version/type/enum/conflict → `CONFIG_*` (`CONFIG_SCHEMA_UNSUPPORTED`, `CONFIG_INVALID`, argv/env disagreement).
- **T-007** (AC-5): Expand `AUTONOMY_PRESET none|balanced|full` to DEC-0119's 12 flags (explicit > preset > defaults). Map to PolicyEngine thin enums. `security_hard` cannot be weakened → `CONFIG_UNSAFE_RELAXATION`.
- **T-008** (AC-1): Inject PolicyEngine (`autonomy` / `permission_mode` / `security_class` / `isolation_profile`), ModelRouter (`tokenProfile` + thinking orthogonality — not credentials), SessionSupervisor / RoleCatalog (`AUTO_ROLE_*`). Those packages do **not** import config loaders.
- **T-009** (AC-6): DEC-0039 local preservation (never overwrite `config.local.json` / `scratchpad.local.md`) + existing-repo identity (`CONFIG_UNKNOWN_KEY` default non-fatal).
- **T-010** (AC-6): Twelve `test_us0138_*` markers (DEC-0138 §12). Primary `standalone/tests/contract` (`node:test`) Windows + Linux. Kit twin as needed. Fake-model CI default **held**. No paid/model calls.

Execution order: T-anch → T-001 → T-002 → T-003 → T-004 → {T-005, T-006, T-007} → T-008 → T-009 → T-010 (acyclic). No split (`SPRINT_AUTO_SPLIT` not triggered; 11 ≤ 12). Not `/quick`.

## AC → Task surjective coverage

| AC | Task(s) |
|---|---|
| AC-1 (versioned typed RuntimeConfig + AC-1 groups) | T-001, T-002, T-008 |
| AC-2 (5-layer precedence + provenance) | T-003 (T-010 m1–m4, m12) |
| AC-3 (LegacyScratchpadAdapter + absent-OK + hints) | T-004 (T-010 m5, m6) |
| AC-4 (secret reject; names/handles only) | T-005 (T-010 m9) |
| AC-5 (fail-closed + security_hard unrelaxable) | T-006, T-007 (T-010 m10, m11) |
| AC-6 (layer/absent/malformed/local/identity tests) | T-009, T-010 |
| DC / architecture baseline | T-anch |

**Surjectivity check**: 6/6 ACs covered (each AC ≥1 task) + primary acceptance.md US-0138 row covered by AC-1..AC-6 aggregate. No `PLAN_AC_COVERAGE_GAP`. T-anch retained as verification-only.

## Locked 12-marker table (DEC-0138 §12 / architecture)

1. `test_us0138_cli_one_run_wins`
2. `test_us0138_local_wins_over_shared`
3. `test_us0138_shared_wins_over_legacy`
4. `test_us0138_legacy_wins_over_defaults`
5. `test_us0138_absent_legacy_ok`
6. `test_us0138_malformed_fail_closed`
7. `test_us0138_local_file_preservation`
8. `test_us0138_existing_repo_identity`
9. `test_us0138_secret_rejected_from_shared`
10. `test_us0138_security_hard_not_weakened_by_autonomy`
11. `test_us0138_invalid_version_enum_conflict`
12. `test_us0138_provenance_and_orthogonal_axes`

Primary: `standalone/tests/contract` (`node:test`) Windows + Linux. Kit twin as needed. No paid/model calls. Fake-model CI default **held**.

## Risks (R1–R6 — accepted)

| Risk | Severity | Mitigation |
|---|---|---|
| R1 TS vs Python kit resolver drift | MEDIUM | T-003/T-010: same paths + `schema_version` 1 string-compatible `shared` keys; contract tests; do not rewrite Python |
| R2 CLI flag/env bikeshed | MEDIUM | T-003: DEC-0138 §5 pins; tests lock winners; argv/env disagreement → `CONFIG_INVALID` |
| R3 unknown scratchpad keys fail existing repos | LOW | T-004/T-009: non-fatal `CONFIG_UNKNOWN_KEY` default; T-010 m8 identity |
| R4 secret-shaped false positives | MEDIUM | T-005: compose kit `_SECRET_PATTERNS`; allow handle regex; T-010 m9 |
| R5 operators treat IsolationProfile as OS sandbox | LOW | T-008: passthrough only; US-0141 owns backends |
| R6 autonomy mapping underspecified | LOW | T-007: DEC-0138 §8 pin + T-010 m10 |

## Compose guards (UNCHANGED)

| Target | Result |
|---|---|
| US-0131 / DEC-0131 / R-0116 | analog only; do **not** rewrite `host_runtime_config_lib.py` |
| US-0133 / DEC-0133 / R-0121 | AgentKernel isolation / `noTools: "builtin"` / empty loader **unamended** |
| US-0134 / DEC-0134 / R-0122 | KernelBridge **unamended** |
| US-0135 / DEC-0135 / R-0127 | credentials OUT; consume `tokenProfile` + `redact.ts`; store **unamended** |
| US-0136 / DEC-0136 / R-0128 | consume `AUTO_ROLE_*`; RoleCatalog internals **unamended** |
| US-0137 / DEC-0137 / R-0129 | consume thin enums; PolicyEngine tables **unamended** |
| US-0119 / DEC-0119 | expand preset; `security_hard` unrelaxable |
| Kit npm `its-magic` / DEC-0120 `files` | compose — omit `standalone/` |
| US-0056 / DEC-0038 | `compute_strict_proof_hash` tuple **UNAMENDED** |
| DEC-0039 | never overwrite locals |
| US-0139..US-0148 | OUT OF SCOPE (US-0139 context; US-0140 workflow; US-0141 OS sandbox; US-0142 browser runtime) |
| US-0133 / US-0134 / US-0135 / US-0136 / US-0137 | DONE — compose only; do not reopen |
| BUG-0020 / R-0126 | DONE — do not reopen; do not wipe R-0126 |
| R-0120..R-0130 | do not wipe |
| DEC-0138 / `# US-0138` / R-0130 | locked — T-anch verify only |
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
| story_id | US-0138 |
| sprint_id | S0144 |
| orchestrator_run_id | auto-20260913-us0138 |
| delivery_mode | ultra_lean |
| macro_phase | plan |
| fresh_context_marker | tl-US0138-sprintplan-20260913T143500Z-fresh |
| timestamp | 2026-09-13T14:35:00Z (UTC) |
| model_id | cursor-grok-4.6-high (CROSS_MODEL_REVIEW=1 — required) |
| evidence_ref | sprints/S0144/sprint.md, sprints/S0144/tasks.md, sprints/S0144/progress.md, sprints/S0144/uat.json, sprints/S0144/uat.md, sprints/S0144/plan-verify.json (SKIPPED placeholder), handoffs/tl_to_dev.md (US-0138 prepend), docs/engineering/state.md (sprint-plan checkpoint + traceability), docs/engineering/architecture.md # US-0138 (not mutated), decisions/DEC-0138.md (not mutated), handoffs/resume_brief.md |

Prior phase proof consumed: `rp-auto-20260913-us0138-architecture-techlead-20260913T141500Z-US-0138` / `7400FC661403FBA49902875B7A08FB930D156840A8B84EF9ED5D5B385DF6BEE4` — RUNTIME_PROOF_VALID (independent `compute_strict_proof_hash` MATCH; consumed 2026-09-13T14:35:00Z before TTL 2026-09-13T15:15:00Z). Sovereign-critic architecture PASS (`rp-auto-20260913-us0138-sovereign-critic-techlead-20260913T142500Z-US-0138` / `AB66B458010E29E861F3D866A4BDFDAF3CF09E09D3239E47D00E5E49F3721CD6`; `critic-US0138-architecture-20260913T142500Z-fresh`; anti_slop=10; 0 blocking; degraded_mode=false; findings `us0138asc-*` informational — routed).

## Runtime proof (DEC-0038)

| Field | Value |
|---|---|
| runtime_proof_id | rp-auto-20260913-us0138-sprint-plan-techlead-20260913T143500Z-US-0138 |
| phase_id | sprint-plan |
| role | tech-lead |
| story_id | US-0138 |
| sprint_id | S0144 |
| orchestrator_run_id | auto-20260913-us0138 |
| delivery_mode | ultra_lean |
| macro_phase | plan |
| model_id | cursor-grok-4.6-high (CROSS_MODEL_REVIEW=1 — required) |
| proof_issued_at | 2026-09-13T14:35:00Z |
| proof_ttl_seconds | 3600 |
| proof_ttl | 2026-09-13T15:35:00Z (UTC) |
| proof_hash | F6F06430D519000457A0F38ECB45BF90368CCDE7C8921EA4D349C798744FE5F0 |
| canonical_payload | `{"orchestrator_run_id":"auto-20260913-us0138","phase_id":"sprint-plan","proof_issued_at":"2026-09-13T14:35:00Z","proof_ttl_seconds":3600,"role":"tech-lead","runtime_proof_id":"rp-auto-20260913-us0138-sprint-plan-techlead-20260913T143500Z-US-0138"}` |

Hash via `scripts.token_cost_lib.compute_strict_proof_hash` (positional; compact sorted-key JSON). Isolation extras (not hashed): `delivery_mode=ultra_lean`, `macro_phase=plan`, `model_id=cursor-grok-4.6-high`, `sprint_id=S0144`, `story_id=US-0138`. `hash_recompute_confirmation=true` (compute_strict_proof_hash → F6F06430D519000457A0F38ECB45BF90368CCDE7C8921EA4D349C798744FE5F0).

## Decision gate

| Field | Value |
|---|---|
| decision_gate | false |
| stop_conditions_met | yes |
| missing_acceptance_criteria | none (6/6 slices + primary acceptance row covered; 12 contract-test markers) |
| compose_guards | US-0131/0133/0134/0135/0136/0137/DEC-0131/0133/0134/0135/0136/0137/kit files/US-0139..US-0148/BUG-0020/R-0120..R-0130/DEC-0138/US-0045 UNCHANGED |
| dc_check | clean (`# US-0138` H1 already added in /architecture; DEC-0138 Accepted) |
| task_count | 11 (within SPRINT_MAX_TASKS=12; SPRINT_AUTO_SPLIT=1 but no split needed; 1:1 seeds; not `/quick`; not `--bulk`) |
| risks_finalized | 6/6 ACCEPTED (R1..R6) |
| approach | A1 locked |
| companion_DEC | DEC-0138 Accepted |
| plan-verify readiness | ultra_lean — plan-verify NOT in resolved_phase_plan; skipped; plan-verify.json is a SKIPPED placeholder (not a QA spawn) |
| sovereign_memory_note | `assemble_sovereign_memory_digest(...)` NOT called; no mistakes.jsonl write |

## Definition of done (sprint-plan)

- [x] 11 tasks enumerated (T-anch + T-001..T-010) — within SPRINT_MAX_TASKS=12; 1:1 from architecture seeds
- [x] 6/6 ACs surjective + primary acceptance.md US-0138 covered
- [x] Task dependency graph documented
- [x] Execute phase role matrix documented (ultra_lean — /plan-verify skipped; next = sovereign-critic then /execute)
- [x] Compose guards UNCHANGED
- [x] Critic carry-ins (3 non-blocking from architecture sovereign-critic) routed as execute awareness; sprint id locked **S0144**
- [x] Isolation evidence + runtime proof emitted (model_id=cursor-grok-4.6-high present)
- [x] Sprint-plan checkpoint appended to `docs/engineering/state.md`
- [x] Sprint-plan handoff prepended to `handoffs/tl_to_dev.md`
- [x] Sprint-plan PASS prepended to `handoffs/resume_brief.md` (-> sovereign-critic then /execute)
- [x] UAT placeholders written (`uat.json` empty steps, `uat.md` ACs no results)
- [x] Traceability row added (Story=US-0138 | Sprint=S0144 | Tasks=T-anch+T-001..T-010 | Status=PLANNED | Evidence empty)
- [x] Backlog status OPEN (US-0045 — not mutated); acceptance unchecked; sprint_plan_notes appended
- [x] plan-verify.json SKIPPED placeholder (not a QA phase)

## Next scheduled phase

| Field | Value |
|---|---|
| next_scheduled_phase | sovereign-critic (sprint-plan; CROSS_MODEL_REVIEW=1) then `/execute` (role=dev per US-0069 / DEC-0051; fresh dev subagent per BUG-0006; first canonical phase of `build+verify` macro per ultra_lean; plan-verify NOT in resolved_phase_plan — skipped) |
| next_scheduled_role | tech-lead (critic of sprint-plan), then dev |
| next_sprint_macro | build+verify (ultra_lean — plan-verify skipped at this boundary) |
| stop_condition | STOP after sprint-plan completes; hand off via artifacts only. Orchestrator MUST spawn sovereign-critic of sprint-plan then `/execute` in fresh dev subagent per BUG-0006. Do not spawn /execute, /plan-verify, or critic from this subagent. |
| artifacts_written | sprints/S0144/ (sprint.md, tasks.md, progress.md, summary.md stub, uat.json, uat.md, plan-verify.json SKIPPED placeholder), docs/engineering/state.md (sprint-plan checkpoint + traceability), handoffs/tl_to_dev.md (US-0138 prepend), handoffs/resume_brief.md (sprint-plan PASS prepend -> sovereign-critic then /execute), docs/product/backlog.md (sprint_plan_notes append; Status OPEN), docs/engineering/decisions.md (current pack prepend) |
