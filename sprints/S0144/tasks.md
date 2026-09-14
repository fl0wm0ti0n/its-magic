# Sprint S0144 - Task checklist (US-0138)

Total tasks: 11 (T-anch + T-001..T-010). SPRINT_MAX_TASKS=12; SPRINT_AUTO_SPLIT=1; no split. T-anch retained as NO-OP verification. Seeds 1:1 from `docs/engineering/architecture.md` `# US-0138`. Sprint id **S0144** (next free after S0143).

**Isolation**: `tl-US0138-sprintplan-20260913T143500Z-fresh` · `model_id=cursor-grok-4.6-high` · `orchestrator_run_id=auto-20260913-us0138`

## Task execution order

1. T-anch (NO-OP / verification)
2. T-001 (`packages/config` + Pi import-boundary grep)
3. T-002 (Zod `RuntimeConfig` + `schema_version` + AC-1 groups)
4. T-003 (5-layer resolve + provenance)
5. T-004 (`LegacyScratchpadAdapter` + absent-OK + migration hints)
6. T-005 (secret reject names/handles only) — parallel with T-006 and T-007 after T-004
7. T-006 (fail-closed version/type/enum/conflict + `CONFIG_*`) — parallel with T-005 and T-007 after T-004
8. T-007 (US-0119 preset expansion + `security_hard` unrelaxable) — parallel with T-005 and T-006 after T-004
9. T-008 (inject PolicyEngine/ModelRouter/SessionSupervisor flags)
10. T-009 (DEC-0039 local preservation + existing-repo identity)
11. T-010 (12 `test_us0138_*` Win/Linux fake-model CI)
12. Integration verification

## Critic NB awareness (execute)

- **T-003/T-004/T-005/T-006/T-007/T-010** (`us0138asc-challenger-001` NB1): fail-closed edges locked DEC-0138 §4–§8 — 5-layer per-key precedence; argv/env `CONFIG_INVALID` conflict; absent legacy OK vs malformed `CONFIG_LEGACY_INVALID`; secret-shaped `CONFIG_SECRET_REJECTED`; `security_hard` `CONFIG_UNSAFE_RELAXATION`; `CONFIG_UNKNOWN_KEY` default-off; credentials OUT; `compute_strict_proof_hash` tuple unamended.
- **T-anch..T-010** (`us0138asc-architect-002` NB2): keep 1:1 architecture seeds; sprint folder is **S0144**; execute owns `packages/config` + Zod schema + adapter + 12 tests; architecture owns H1+DEC-0138; inject-only PolicyEngine/ModelRouter/SessionSupervisor; US-0131 kit analog compose-only; US-0139/0140 deferred; DEC-0133/0134/0135/0136/0137 compose held.
- **T-anch** (`us0138asc-subtractor-003` NB3): verification-only; do not rewrite `# US-0138` / DEC-0138 / R-0130; reject A2–A12; do not amend isolation/`noTools`/KernelBridge/auth-models/PolicyEngine tables; do not mark DONE; do not reopen US-0137/US-0136/US-0135 or BUG-0020; do not design US-0139+; do not own credentials or read `.env`; 12 markers required.

## Task checklist

- [x] **T-anch**: Verify `# US-0138` H1 in `docs/engineering/architecture.md`; DEC-0138 Accepted; approach A1 LOCKED; R-0130 DQ1–DQ10 LOCKED; 12-marker table locked; compose guards (US-0131 Python analog unamended; US-0133 isolation/`noTools` unamended; KernelBridge unamended; auth-models unamended except consume `tokenProfile` + compose `redact.ts`; role-runtime unamended except consume `AUTO_ROLE_*`; PolicyEngine tables unamended except consume thin enums; kit `files` omit `standalone/`; US-0139+ out; US-0137/US-0136/US-0135/BUG-0020 DONE; R-0120..R-0130 intact); verify `standalone/packages/config` and `test_us0138_*` do NOT yet exist (or document baseline). Record to `sprints/S0144/t-anch-verification.md`. NO mutation to `architecture.md` / `decisions/DEC-0138.md` / `docs/engineering/research.md` R-0130 in /execute. (DC / architecture baseline; NO-OP)

- [x] **T-001**: Create `standalone/packages/config`. `package.json`: name `@its-magic/config`, `private: true`, `version: 0.0.0`, `type: module`, `engines.node >=22.19.0`, export `./src/index.ts`. Workspaces glob `packages/*` already includes it — do **not** add `standalone/` to kit `workspaces`. **No Pi imports.** `package.json` must not depend on `@earendil-works/pi-*`. Type-only import from `@its-magic/policy-engine` / `@its-magic/auth-models` / `@its-magic/role-runtime` is allowed. Do **not** import Pi modules. Extend the US-0133..US-0137 grep to also deny Pi inside `packages/config`. Do **not** add a Biome override. Kit `files` continues to omit `standalone/`. Do **not** stub `runtime-core` this story (US-0140). Surface: `resolveRuntimeConfig(repoRoot, options) -> { config: RuntimeConfig, provenance: Record<string, Provenance>, diagnostics: string[], ok, fatal_code? }` plus `LegacyScratchpadAdapter.parse/map`. (AC-1)

- [x] **T-002**: Implement Zod `RuntimeConfig` inside `packages/config`. `schema_version` required int; **v1 supported**. Unknown/unsupported version → `CONFIG_SCHEMA_UNSUPPORTED`. File format **JSONC** (`//` and `/* */`). Reject YAML SOT and executable `.js`/`.ts` loaders. Allowed top-level keys: `schema_version`, `shared`, `host_overlays`. Strict unknown **top-level** keys → `CONFIG_INVALID`. Nested `shared` unknown keys: `CONFIG_UNKNOWN_KEY` (non-fatal unless `CONFIG_STRICT=1`; **default-off**). JSON Schema is **derived** via `z.toJSONSchema(schema, { target: "draft-2020-12" })`, not a second writer. AC-1 groups typed now or as versioned handles per DEC-0138 §10: delivery, token, work-kind, phase, model, autonomy, stop, retry/test, browser, dev-environment, remote, security/compliance, sovereign. Browser/dev-env/remote are handles only (runtimes OUT). Same `.its-magic/` files as US-0131: `config.json` / `config.local.json` (gitignored) / `config.example.json`. `ITS_MAGIC_CONFIG_ROOT` is a test override, not a sixth SOT. Materialize shared from example when absent; never overwrite local. (AC-1)

- [x] **T-003**: Public 5-layer precedence **per key**: CLI one-run > local project > shared project > legacy scratchpad > framework defaults. Map onto kit 7-layer labels `cli` / `kit_local` / `kit_baseline` / `cursor_local`+`cursor_baseline` / `kit_example`+`code_defaults` **without replacing Python**. Provenance `{ layer, label, path?, source_key }`. `CONFIG_KEY_SHADOWED` non-fatal unless `CONFIG_STRICT=1`. Weaken-security disagreement → `CONFIG_UNSAFE_RELAXATION` (not a shadow diagnostic). CLI pins (DEC-0138 §5): `--delivery-mode` / `--token-profile` / `--autonomy-preset` / `--work-kind` / `--runtime-override KEY=VAL` / `--config-strict` with env peers `ITSM_RUNTIME_<KEY>`. Argv vs env disagreement for the same key → `CONFIG_INVALID`. Axes orthogonal: `DELIVERY_MODE` ≠ `TOKEN_PROFILE` ≠ `AUTONOMY_PRESET` ≠ `WORK_KIND_ROUTING`. Tests: markers 1–4, 12. (AC-2)

- [x] **T-004**: TypeScript `LegacyScratchpadAdapter` reimplements parse/validate/map (KEY=VAL comments; DEC-0055 local > baseline > example **inside** the adapter). **Do not spawn** Python `parse_scratchpad_*`. **Do not rewrite** `host_runtime_config_lib.py`. Absent legacy files → valid empty mapping. Malformed **present** file → `CONFIG_LEGACY_INVALID` fail-closed (not silent skip). Unknown scratchpad keys: keep in opaque `compat` bag + `CONFIG_UNKNOWN_KEY` diagnostic; default non-fatal unless `CONFIG_STRICT=1`. Migration diagnostics **actionable and non-blocking**: `CONFIG_MIGRATION_HINT` listing keys that would live in `.its-magic/config.json` if the operator migrates. **No forced write.** `MODEL_*` / `MODEL_TIER_*` in scratchpad: **ignore** as host-catalog keys. Tests: markers 5, 6. (AC-3)

- [x] **T-005**: Reject secret-**shaped values** in shared **and** local project files and in legacy mapped values. Port kit `_SECRET_PATTERNS`: `api_key`/`secret`/`password`/`token` assignments, `sk-`/`ghp_`/`xox` prefixes, PEM private keys, `Bearer …`. Allow **names/handles only**: `secret_name` / `credential_handle` matching `^[A-Za-z][A-Za-z0-9_.-]*$`. Resolve values inside US-0135 owned store / execution layer — **this package never reads credentials**. **Never** read `.env`. **Never** log provider tokens. Compose US-0135 `redactAudit` / `redactSecretShaped` on diagnostics if a reject fires (code + key name, not value). Fatal token: **`CONFIG_SECRET_REJECTED`**. Analog map `HOST_CONFIG_SECRET_REJECTED` → `CONFIG_SECRET_REJECTED`. Do **not** reuse kit Python codes as standalone fatal tokens. Tests: marker 9. (AC-4)

- [x] **T-006**: Fail-closed invalid version/type/enum/conflict. `CONFIG_SCHEMA_UNSUPPORTED` for unknown `schema_version`. `CONFIG_INVALID` for unknown top-level keys, type/enum mismatches, and argv/env disagreement for the same key. Do not silently coerce. Tests: marker 11. (AC-5)

- [x] **T-007**: Expand `AUTONOMY_PRESET=none|balanced|full` to the twelve per-feature flags **before** execution; explicit per-flag > preset > defaults (DEC-0119 R5). Flags: `INTAKE_AUTONOMY_MODE`, `INTAKE_MINIMAL_PACK`, `INTAKE_ASSUME_STACK_CONTEXT`, `WORK_KIND_AUTO_ACCEPT`, `CROSS_MODEL_REWORK_EXHAUSTED_POLICY`, `CROSS_MODEL_SKIP_PHASES`, `RESUME_BRIEF_AUTO_REFRESH`, `RUNTIME_PROOF_KIND`, `GOAL_CONVERGENCE_INTERVAL`, `SOVEREIGN_DRAIN_AUTO_ACCEPT`, `RELEASE_PUBLISH_AUTO_CONFIRM`, `AUTONOMY_STOP_POLICY`. Map `none`→`Autonomy="supervised"`; `balanced`/`full`→`Autonomy="autonomous"`. `PERMISSION_MODE interactive`→`ask-on-write`; `auto`→`default-deny`. `SecurityClass="security_hard"` and matrix rows classified `security_hard` **cannot** be marked `autonomy_resolvable` by any layer or by the preset → `CONFIG_UNSAFE_RELAXATION`. `AUTONOMY_STOP_POLICY` remains `block|auto_repair_then_block|auto_repair_then_skip` and cannot demote hard gates. IsolationProfile passthrough (`trusted-local` \| `isolated-development` \| `untrusted-repository`) is Layer A only; Layer B backends = US-0141 OUT. Tests: marker 10. (AC-5)

- [x] **T-008**: Injection only. CLI/workflow (US-0140 later) and current spawn sites pass typed flags into PolicyEngine (`autonomy` / `permission_mode` / `security_class` / `isolation_profile`), ModelRouter (`tokenProfile` name + thinking orthogonality — **not** credentials), SessionSupervisor / RoleCatalog (phase/role `AUTO_ROLE_*` keys). Those packages **do not** import config loaders. Do not amend isolation loader internals, `noTools: "builtin"`, KernelBridge, auth-models credential store, RoleCatalog internals, or PolicyEngine decision tables. Consumers receive the **resolved object**, not loader internals. (AC-1)

- [x] **T-009**: **DEC-0039**: never overwrite `.its-magic/config.local.json` or `.cursor/scratchpad.local.md`. Existing repos keep identity: nested unknown `shared` keys and unknown scratchpad keys stay non-fatal (`CONFIG_UNKNOWN_KEY`) unless `CONFIG_STRICT=1`. Materialize shared from example when absent; never overwrite local. Tests: markers 7, 8. (AC-6)

- [x] **T-010**: Create contract tests covering **exactly 12** markers (DEC-0138 §12). Primary: `standalone/tests/contract` (`node:test`) Windows + Linux. Kit twin as needed for no-Pi-in-config / files-omit compose / DEC-0039 local preservation. No paid/model calls. Fake-model CI default **held**.
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
  Existing standalone CI Windows+Linux job covers the suite — do not fold into kit `TEST_COMMAND`. Do **not** weaken `test_us0133_*` / `test_us0134_*` / `test_us0135_*` / `test_us0136_*` / `test_us0137_*`. (AC-6; coverage for AC-1..AC-5 via markers)

## Integration verification (post T-010)

- [x] Test gate: standalone `npm test` covers 12/12 `test_us0138_*`; kit twin (if present) PASS; compose `test_us0133_*` / `test_us0134_*` / `test_us0135_*` / `test_us0136_*` / `test_us0137_*` still green
- [x] Import-boundary gate: no Pi imports in `packages/config`; kit `files` omit `standalone/`
- [x] Isolation gate: AgentKernel empty loader / `noTools: "builtin"` / KernelBridge / auth-models store / PolicyEngine tables / RoleCatalog internals unamended; fake-model CI default held; DEC-0038 tuple unamended; Python kit resolver unamended
- [x] Scope gate: no credentials / `.env` reads; no `runtime-core`; no live paid CI; no US-0139+ authoring; no forced migration; no OS sandbox claim
- [x] Status gate: US-0138 remains OPEN; AC-1..AC-6 unchecked; intake JSON not mutated; US-0133/US-0134/US-0135/US-0136/US-0137/BUG-0020 remain DONE

## Files to touch (scope)

### New (create)

- `standalone/packages/config/` (`package.json`, `src/index.ts`, Zod `RuntimeConfig`, 5-layer resolver, `LegacyScratchpadAdapter`, secret reject, US-0119 expansion)
- `standalone/tests/contract` `test_us0138_*` (node:test)
- kit twin `tests/us0138_*` as needed (files-omit / no-Pi-in-config / DEC-0039)
- `sprints/S0144/t-anch-verification.md` (execute)

### Edit (scoped)

- existing US-0133..US-0137 Pi-import grep — extend to deny Pi inside `packages/config`
- `.github/workflows/ci.yml` — extend existing standalone Windows+Linux job only if glob would miss new tests; do not fold into kit `TEST_COMMAND`
- optional: confirm `.its-magic/config.local.json` remains gitignored (DEC-0039)

### Verify read-only (no mutation)

- `docs/engineering/architecture.md # US-0138`
- `decisions/DEC-0138.md`
- `docs/engineering/research.md ## R-0130` (and R-0120..R-0129 intact)
- `docs/product/backlog.md ## US-0138` Status/ACs (US-0045)
- `docs/product/acceptance.md` US-0138 row
- `handoffs/intake_evidence/US-0133-0148-intake-20260911.json`
- kit `host_runtime_config_lib.py` (DEC-0131 analog — unamended)
- `standalone/packages/pi-kernel` AgentKernel isolation loader / `noTools` / pins (DEC-0133)
- `standalone/packages/kernel-bridge` (DEC-0134 — unamended)
- `standalone/packages/auth-models` (DEC-0135 — consume tokenProfile + redact; unamended store)
- `standalone/packages/role-runtime` (DEC-0136 — consume AUTO_ROLE_*; internals unamended)
- `standalone/packages/policy-engine` / `tool-broker` (DEC-0137 — consume thin enums; tables unamended)
- US-0137 / S0143 artifacts (DONE — do not reopen)
- US-0136 / S0142 artifacts (DONE — do not reopen)
- US-0135 / S0141 artifacts (DONE — do not reopen)
- BUG-0020 / S0140 artifacts (DONE — do not reopen)

### Compose-guard UNCHANGED (DO NOT TOUCH)

| File / surface | Reason |
|---|---|
| Backlog Status / AC checkboxes | US-0045 — closure only |
| `architecture.md` body beyond T-anch verify | locked in /architecture |
| `decisions/DEC-0138.md` body | locked in /architecture |
| R-0130 / R-0129 / R-0128 / R-0127 / R-0122 / R-0121 / R-0116 / R-0120..R-0126 | do not rewrite; do not wipe |
| `# US-0133` / DEC-0133 / AgentKernel isolation / `noTools` | unamended |
| `# US-0134` / DEC-0134 / KernelBridge | unamended |
| `# US-0135` / DEC-0135 / auth-models store | credentials OUT; compose `redact.ts` only |
| `# US-0136` / DEC-0136 / RoleCatalog | consume `AUTO_ROLE_*` only |
| `# US-0137` / DEC-0137 / PolicyEngine tables | consume thin enums only |
| kit `host_runtime_config_lib.py` | analog only |
| Kit `package.json` `workspaces` | kit is not a workspace root |
| Kit `files` whitelist expansion | omit `standalone/` |
| DEC-0038 `compute_strict_proof_hash` tuple | UNAMENDED |
| DEC-0039 locals | never overwrite |
| `runtime-core` stub | US-0140 |
| Live paid CI | rejected |
| US-0139..US-0148 bodies | OUT OF SCOPE |
| US-0137 / US-0136 / US-0135 / BUG-0020 | DONE — do not reopen |
| `.env` / credentials | never read |

## AC → Task surjective coverage

| AC | Task(s) |
|---|---|
| AC-1 | T-001, T-002, T-008 |
| AC-2 | T-003 (T-010 m1–m4, m12) |
| AC-3 | T-004 (T-010 m5, m6) |
| AC-4 | T-005 (T-010 m9) |
| AC-5 | T-006, T-007 (T-010 m10, m11) |
| AC-6 | T-009, T-010 |
| DC / architecture | T-anch |

**Surjectivity check**: 6/6 ACs covered. No `PLAN_AC_COVERAGE_GAP`.
