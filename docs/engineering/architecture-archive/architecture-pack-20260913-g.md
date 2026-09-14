# Architecture archive pack (2026-09-13)

- Rollover trigger: `ARCH_HOT_MAX_LINES=3000, ARCH_HOT_MAX_STORY_SECTIONS=120`
- Source: `docs/engineering/architecture.md`
- Archived units (oldest first, contiguous prefix): 1
- Retained units in hot file: 19
- First archived heading: `# US-0138 — Typed runtime configuration and legacy migration adapter`
- Last archived heading: `# US-0138 — Typed runtime configuration and legacy migration adapter`
- Verification tuple (mandatory):
  - archived_body_lines=145
  - preamble_lines=1
  - retained_body_lines=2981

---

# US-0138 — Typed runtime configuration and legacy migration adapter

## Overview

**US-0138** resolves standalone delivery, token, work-kind, phase, model, autonomy, stop, retry/test, browser, dev-environment, remote, security/compliance, and sovereign settings from a versioned typed `RuntimeConfig` with a non-destructive TypeScript `LegacyScratchpadAdapter`. New package `@its-magic/config` never imports Pi. Same `.its-magic/` JSONC files as the US-0131 kit analog (do **not** rewrite `host_runtime_config_lib.py`). Credentials stay US-0135. PolicyEngine/ModelRouter/RoleCatalog consume injected flags only. Fake-model CI default, empty resource loader, `noTools: "builtin"`, KernelBridge, auth-models store, RoleCatalog internals, and PolicyEngine decision tables stay **unamended**. DEC-0038 `compute_strict_proof_hash` tuple stays **UNAMENDED**.

**Research anchor**: **R-0130** (DQ1–DQ10 LOCKED). **Companion DEC**: **DEC-0138** (Accepted — THIS phase). **EARLY_RESEARCH**: consumed from R-0130 (cosmiconfig first-found-wins rejected as SOT; Zod `z.parse` / `z.toJSONSchema` draft-2020-12; 12-factor; zod-config analog not adopted) — **no new R-id**. Do not wipe R-0120..R-0130.

**Fresh context marker**: `tl-US0138-architecture-20260913T141500Z-fresh`
**Orchestrator run id**: `auto-20260913-us0138`
**Timestamp**: 2026-09-13T14:15:00Z (UTC)
**Verdict**: PASS
**Next**: sovereign-critic (architecture), then `/sprint-plan` **S0144** (orchestrator-owned). ultra_lean: plan-verify is **not** in `resolved_phase_plan`. Do **not** spawn sprint-plan or critic from this subagent (BUG-0006).

**baseline_h2_count (pre-mutate)**: `0`

## Approach locked (A1 — from R-0130)

| Option | Summary | Verdict |
|--------|---------|---------|
| **A1** | `standalone/packages/config` (**no Pi imports**); Zod-typed versioned `RuntimeConfig`; JSONC `.its-magic/config{,.local,.example}.json` same files as US-0131; TS `LegacyScratchpadAdapter` (no Python spawn, no forced migration); 5-layer public ladder mapped onto kit 7-layer; per-key provenance; `CONFIG_*` fail-closed; inject flags only; credentials/OS sandbox/workflow/context OUT | **Preferred / LOCKED** — AC-1..AC-6 |
| A2 | Fold into `runtime-core` | **Rejected** — §30 / US-0140 |
| A3 | Spawn Python `host_runtime_config_lib.py` | **Rejected** — R9; D3 |
| A4 | cosmiconfig first-found-wins | **Rejected** — AC-2 |
| A5 | Executable `.js`/`.ts` config | **Rejected** — R9 |
| A6 | TypeBox/ajv as SOT | **Rejected** — Zod infers TS |
| A7 | YAML SOT | **Rejected** — kit analog JSONC |
| A8 | New standalone-only filenames | **Rejected** — dual-SOT |
| A9 | Rewrite PolicyEngine / auth-models / KernelBridge / RoleCatalog | **Rejected** — compose |
| A10 | Own credentials or read `.env` | **Rejected** — US-0135 |
| A11 | Rewrite `host_runtime_config_lib.py` | **Rejected** — D3 |
| A12 | Forced migration / overwrite locals | **Rejected** — DEC-0039 |

**Can this be simpler?** Wrapping Python fails R9. Cosmiconfig fails AC-2. A1 is the simplest design that meets AC-1..AC-6.

### Locked surfaces (DEC-0138)

1. **Package**: `@its-magic/config` in `standalone/packages/config`. `private: true`, `version: 0.0.0`, `type: module`, `engines.node >=22.19.0`, export `./src/index.ts`. **No Pi dependency.** Type-only `@its-magic/policy-engine` / `@its-magic/auth-models` / `@its-magic/role-runtime` allowed. Extend US-0133..0137 grep to deny `@earendil-works/pi-` inside the package. No Biome override. Kit `files` omit `standalone/`. **Execute owns package creation.**
2. **Zod `RuntimeConfig`**: `schema_version` int v1; `z.parse` / mapped `safeParse` → `CONFIG_*`. JSON Schema derived (`draft-2020-12`), not a second writer. JSONC only. Unknown top-level keys → `CONFIG_INVALID`. Nested `shared` unknown → `CONFIG_UNKNOWN_KEY` (non-fatal unless `CONFIG_STRICT=1`, default-off). AC-1 groups: delivery, token, work-kind, phase, model, autonomy, stop, retry/test, browser, dev-environment, remote, security/compliance, sovereign. Browser/dev-env/remote are versioned **handles** (runtimes OUT).
3. **Same `.its-magic/` files**: `config.json` / `config.local.json` (gitignored) / `config.example.json`. `ITS_MAGIC_CONFIG_ROOT` is a test override, not a sixth SOT. Materialize shared from example when absent; never overwrite local.
4. **Public 5-layer precedence** (per key): CLI one-run > local > shared > legacy scratchpad > defaults. Map onto kit 7-layer labels `cli` / `kit_local` / `kit_baseline` / `cursor_local`+`cursor_baseline` / `kit_example`+`code_defaults` without replacing Python. Provenance `{ layer, label, path?, source_key }`. `CONFIG_KEY_SHADOWED` non-fatal unless strict. Weaken-security disagreement → `CONFIG_UNSAFE_RELAXATION`.
5. **CLI pins**: `--delivery-mode` / `--token-profile` / `--autonomy-preset` / `--work-kind` / `--runtime-override KEY=VAL` / `--config-strict` with env peers `ITSM_RUNTIME_<KEY>`. Argv vs env disagreement for the same key → `CONFIG_INVALID`. Axes orthogonal: `DELIVERY_MODE` ≠ `TOKEN_PROFILE` ≠ `AUTONOMY_PRESET` ≠ `WORK_KIND_ROUTING`.
6. **`LegacyScratchpadAdapter`**: TS parse/validate/map; no Python spawn. Absent → empty OK. Present-malformed → `CONFIG_LEGACY_INVALID`. Unknown keys in `compat` + `CONFIG_UNKNOWN_KEY`. `CONFIG_MIGRATION_HINT` non-blocking. DEC-0039 locals never overwritten. Ignore `MODEL_*` / `MODEL_TIER_*` as host-catalog keys.
7. **Secrets**: reject secret-shaped values in shared/local/legacy (`looks_like_secret` analog). Names/handles only `^[A-Za-z][A-Za-z0-9_.-]*$`. Never read `.env`. Compose US-0135 redact on diagnostics. Fatal: `CONFIG_SECRET_REJECTED`.
8. **Fail-closed + R10**: invalid version/type/enum/conflict → `CONFIG_*`. `AUTONOMY_PRESET none|balanced|full` expands DEC-0119's 12 flags (explicit > preset > defaults). Map `none`→`Autonomy="supervised"`; `balanced`/`full`→`Autonomy="autonomous"`. `PERMISSION_MODE interactive`→`ask-on-write`; `auto`→`default-deny`. `security_hard` cannot be weakened → `CONFIG_UNSAFE_RELAXATION`. IsolationProfile passthrough; Layer B = US-0141 OUT.
9. **Inject only**: PolicyEngine thin enums; ModelRouter `tokenProfile` + thinking orthogonality (not credentials); RoleCatalog `AUTO_ROLE_*` names. Do not import config loaders from those packages.
10. **OUT**: credentials/installer UX/workflow (US-0140)/context (US-0139)/OS sandbox (US-0141)/browser runtime (US-0142).
11. **Tests**: 12 `test_us0138_*`; Win+Linux; fake-model CI held. Markers in DEC-0138 §12.

### Critic NB closures (research us0138rsc-* — informational)

| NB | Closure |
|----|---------|
| NB1 fail-closed edges named; precedence, secret reject, security_hard, legacy adapter | LOCKED §4–§8; T-003..T-007 / T-010 |
| NB2 `packages/config` boundary; inject PolicyEngine/ModelRouter/SessionSupervisor; US-0131 analog compose-only; US-0139/0140 deferred | LOCKED this H1 + DEC-0138; T-001/T-008; isolation/`noTools`/KernelBridge/auth-models/RoleCatalog/PolicyEngine tables unamended |
| NB3 no packages/config code; no DONE; 11 tasks ≤ 12 | Held — T-anch; Status OPEN; do not spawn `/sprint-plan` from this subagent; execute owns `standalone/packages/config` |

## Components

### `config` package (AC-1..AC-5)

- `standalone/packages/config` with Zod schema, 5-layer resolver, TS `LegacyScratchpadAdapter`, secret reject, US-0119 expansion
- Grep denies `@earendil-works/pi-` inside the package

### Injection ports (AC-1)

- PolicyEngine: `autonomy` / `permission_mode` / `security_class` / `isolation_profile`
- ModelRouter: `tokenProfile` + thinking orthogonality
- RoleCatalog / SessionSupervisor: `AUTO_ROLE_*` catalog keys

### Contract tests (AC-6)

- Twelve markers (DEC-0138 §12). Kernel tests: `standalone/tests/contract`. Matrix Windows + Linux.

## Companion DEC = DEC-0138 (Required → Accepted)

Authored Accepted in THIS phase at `decisions/DEC-0138.md`. Locks A1, package, schema, files, precedence, CLI pins, adapter, secrets, R10 mapping, reason codes, markers, seeds.

## Risks finalized (R1–R6 from R-0130)

- **R1 (MEDIUM)** TS vs Python kit resolver drift → same paths + schema_version 1 string-compatible `shared` keys; contract tests; do not rewrite Python
- **R2 (MEDIUM)** CLI flag/env bikeshed → §5 pins; tests lock winners
- **R3 (LOW)** unknown scratchpad keys fail existing repos → non-fatal `CONFIG_UNKNOWN_KEY` default
- **R4 (MEDIUM)** secret-shaped false positives → compose kit `_SECRET_PATTERNS`; allow handle regex; tests
- **R5 (LOW)** operators treat IsolationProfile as OS sandbox → DQ8 passthrough; US-0141 owns backends
- **R6 (LOW)** autonomy mapping underspecified → §8 pin + test 10

## Compose, do not amend (verified)

| Story / DEC | Surface | Verification |
|-------------|---------|--------------|
| US-0131 / DEC-0131 / R-0116 | kit `.its-magic/` + `host_runtime_config_lib.py` | ✓ analog only; Python unamended |
| US-0133 / DEC-0133 / R-0121 | AgentKernel, pins, isolation loader, `noTools`, fake-model CI | ✓ unamended |
| US-0134 / DEC-0134 / R-0122 | KernelBridge | ✓ unamended |
| US-0135 / DEC-0135 / R-0127 | auth-models / ModelRouter / `redact.ts` | ✓ consume `tokenProfile` + redact; store unamended |
| US-0136 / DEC-0136 / R-0128 | role-runtime SessionSupervisor / RoleCatalog | ✓ consume `AUTO_ROLE_*`; internals unamended |
| US-0137 / DEC-0137 / R-0129 | PolicyEngine / ToolBroker | ✓ consume thin enums; tables unamended |
| US-0119 / DEC-0119 | `AUTONOMY_PRESET` + stop matrix | ✓ expand; `security_hard` unrelaxable |
| US-0056 / DEC-0038 | `compute_strict_proof_hash` tuple | ✓ UNAMENDED |
| Kit npm `its-magic` / DEC-0120 | `files` whitelist | ✓ omit `standalone/` |
| US-0139..US-0148 | later capabilities | ✓ OUT OF SCOPE |
| BUG-0020 / R-0126 | OpenCode `/auto` | ✓ DONE; not reopened |
| R-0120..R-0130 | prior research | ✓ not wiped |

## Sprint seeds (11 tasks within SPRINT_MAX_TASKS=12 — for `/sprint-plan` S0144)

- **T-anch** (`# US-0138` H1 + DEC-0138 Accepted — RESOLVED in THIS phase; NO-OP / verification)
- **T-001** (AC-1 — `packages/config` + Pi import-boundary grep)
- **T-002** (AC-1 — Zod `RuntimeConfig` + `schema_version` + AC-1 groups)
- **T-003** (AC-2 — 5-layer resolve + provenance)
- **T-004** (AC-3 — `LegacyScratchpadAdapter` + absent-OK + migration hints)
- **T-005** (AC-4 — secret reject names/handles only)
- **T-006** (AC-5 — fail-closed version/type/enum/conflict + `CONFIG_*`)
- **T-007** (AC-5 — US-0119 preset expansion + `security_hard` unrelaxable)
- **T-008** (AC-1 — inject PolicyEngine/ModelRouter/SessionSupervisor flags)
- **T-009** (AC-6 — DEC-0039 local preservation + existing-repo identity)
- **T-010** (AC-6 — 12 `test_us0138_*` Win/Linux fake-model CI)

AC surjection: AC-1→T-001,T-002,T-008; AC-2→T-003 (T-010 m1–m4,m12); AC-3→T-004 (T-010 m5,m6); AC-4→T-005 (T-010 m9); AC-5→T-006,T-007 (T-010 m10,m11); AC-6→T-009,T-010. Order: T-anch → T-001 → T-002 → T-003 → T-004 → {T-005, T-006, T-007} → T-008 → T-009 → T-010. No split (11 ≤ 12). Not `/quick`. Do **not** write `sprints/S0144/` this phase.

## Isolation evidence (US-0048 / DEC-0029)

- `phase_id=architecture`, `role=tech-lead`, `story_id=US-0138`, `sprint_id=none` (pending — sprint-plan owns S0144), `orchestrator_run_id=auto-20260913-us0138`
- `delivery_mode=ultra_lean`, `macro_phase=plan` (architecture — second canonical phase of `plan` macro)
- `model_id=cursor-grok-4.6-high` (CROSS_MODEL_REVIEW=1 — required on isolation)
- `fresh_context_marker=tl-US0138-architecture-20260913T141500Z-fresh`, `timestamp=2026-09-13T14:15:00Z` (UTC)
- `evidence_ref=docs/engineering/research.md ## R-0130; docs/product/backlog.md ## US-0138; docs/engineering/architecture.md (this # US-0138); decisions/DEC-0138.md; handoffs/resume_brief.md`
- Fresh tech-lead subagent per BUG-0006 / US-0048; no prior chat history. Narrow-read only. No `.env` reads. Status remains OPEN. US-0133/US-0134/US-0135/US-0136/US-0137 DONE compose-only not reopened. BUG-0020 DONE not reopened. No US-0139+ authoring. No `/sprint-plan` spawn from this subagent. No `standalone/packages/config` this phase.
- Prior phase strict proof consumed: `rp-auto-20260913-us0138-research-techlead-20260913T135500Z-US-0138` / `68976ADDB5153E18222EC444D27B3962EB8155714E9F8711F2F9BA7016EF4D3A` — RUNTIME_PROOF_VALID (independent `compute_strict_proof_hash` MATCH; critic consume-before-TTL `2026-09-13T14:05:00Z` < `2026-09-13T14:55:00Z`; immutable R-0130). Critic findings us0138rsc-* informational only (`rp-auto-20260913-us0138-sovereign-critic-techlead-20260913T140500Z-US-0138` / `1C72EEDDCB0786F986E953E38CC99F98EE9FAF35E2230EE84EF04C726159287A`; anti_slop=10; 0 blocking; degraded_mode=false).

## Strict runtime proof (mirror)

- `runtime_proof_id=rp-auto-20260913-us0138-architecture-techlead-20260913T141500Z-US-0138`
- Canonical hashed payload (DEC-0038, `compute_strict_proof_hash` positional): `{"orchestrator_run_id":"auto-20260913-us0138","phase_id":"architecture","proof_issued_at":"2026-09-13T14:15:00Z","proof_ttl_seconds":3600,"role":"tech-lead","runtime_proof_id":"rp-auto-20260913-us0138-architecture-techlead-20260913T141500Z-US-0138"}`
- `proof_hash=7400FC661403FBA49902875B7A08FB930D156840A8B84EF9ED5D5B385DF6BEE4` (SHA-256; actual `compute_strict_proof_hash`)
- `proof_ttl_seconds=3600`, `proof_ttl=2026-09-13T15:15:00Z` (UTC)
- Isolation extras (not hashed): `delivery_mode=ultra_lean`, `macro_phase=plan`, `model_id=cursor-grok-4.6-high`, `sprint_id=none`, `story_id=US-0138`

## Decision gate + next scheduled phase

- `decision_gate=false` (no blocking unknown; DQ1–DQ10 LOCKED; DEC-0138 Accepted; approach A1 locked; critic NBs closed)
- `next_scheduled_phase=sovereign-critic` (architecture), then `/sprint-plan` (role=tech-lead; S0144; third canonical phase of `plan` macro). ultra_lean: after sprint-plan next is execute (orchestrator skips plan-verify).
- `next_scheduled_role=tech-lead` (critic, then sprint-plan)
- `stop_condition=STOP after architecture completes; hand off via artifacts only. Orchestrator MUST spawn sovereign-critic (architecture) then /sprint-plan in fresh tech-lead subagents (BUG-0006). Do NOT spawn /sprint-plan or critic from this subagent. Do NOT mark US-0138 DONE. Do NOT tick acceptance. Do NOT reopen US-0137, US-0136, US-0135, or BUG-0020. Do NOT design US-0139+. Do NOT create standalone/packages/config. Do NOT create sprints/S0144/.`

