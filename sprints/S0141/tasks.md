# Sprint S0141 - Task checklist (US-0135)

Total tasks: 10 (T-anch + T-001..T-009). SPRINT_MAX_TASKS=12; SPRINT_AUTO_SPLIT=1; no split. T-anch retained as NO-OP verification. Seeds 1:1 from `docs/engineering/architecture.md` `# US-0135`. Sprint id **S0141** (next free after S0140).

**Isolation**: `tl-US0135-sprintplan-20260913T043500Z-fresh` · `model_id=cursor-grok-4.6-high` · `orchestrator_run_id=auto-20260913-us0135`

## Task execution order

1. T-anch (NO-OP / verification)
2. T-001 (`auth-models` package + Pi import-boundary grep)
3. T-002 (owned auth path + InMemory + 0600-class)
4. T-003 (pi-kernel AuthRuntimeAdapter; do not amend isolation/`noTools`/KernelBridge)
5. T-004 (provider matrix + owned `models.json`)
6. T-005 (ModelRouter 6-step + provenance)
7. T-006 (thinkingLevel inject orthogonal to slug/`TOKEN_PROFILE`)
8. T-007 (critic pin + `CROSS_MODEL_DEGRADED_MODE`)
9. T-008 (`itsm auth` / `models list` / `models test`)
10. T-009 (10 `test_us0135_*` Win/Linux fake-model CI)
11. Integration verification

## Critic NB awareness (execute)

- **T-001/T-002/T-003/T-006/T-009** (`us0135arc-challenger-001` NB1): A1 `auth-models` + AuthRuntimeAdapter layering locked. Thinking clamp+provenance (not `MODEL_THINKING_UNSUPPORTED`). Windows v1 = `%APPDATA%` user profile. Persist via `login(..., "api_key")` not `setRuntimeApiKey`. OAuth refresh marker locked (m9).
- **T-anch..T-009** (`us0135arc-architect-002` NB2): keep 1:1 architecture seeds; sprint folder is **S0141**; execute owns `auth-models` + AuthRuntimeAdapter + 10 tests; architecture owns H1+DEC-0135; CLI → auth-models → pi-kernel adapter; DEC-0133/0134 compose held.
- **T-anch** (`us0135arc-subtractor-003` NB3): verification-only; do not rewrite `# US-0135` / DEC-0135 / R-0127; reject A2–A9; do not amend isolation/`noTools`/KernelBridge; do not mark DONE; do not reopen BUG-0020; do not design US-0136+; 10 markers required.

## Task checklist

- [x] **T-anch**: Verify `# US-0135` H1 in `docs/engineering/architecture.md`; DEC-0135 Accepted; approach A1 LOCKED; R-0127 DQ1–DQ10 LOCKED; 10-marker table locked; compose guards (US-0133 isolation/`noTools` unamended; KernelBridge unamended; kit `files` omit `standalone/`; US-0136+ out; BUG-0020 DONE; R-0120..R-0126 intact); verify `standalone/packages/auth-models` and `test_us0135_*` do NOT yet exist (or document baseline). Record to `sprints/S0141/t-anch-verification.md`. NO mutation to `architecture.md` / `decisions/DEC-0135.md` / `docs/engineering/research.md` R-0127 in /execute. (DC / architecture baseline; NO-OP)

- [x] **T-001**: Create `standalone/packages/auth-models`. `package.json`: name `@its-magic/auth-models`, `private: true`, `version: 0.0.0`, `type: module`, `engines.node >=22.19.0`, export `./src/index.ts`. Workspaces glob `packages/*` already includes it — do **not** add `standalone/` to kit `workspaces`. Owned types: AuthService / ModelRouter / provenance (DEC-0135 §2/§5). **No Pi imports.** `package.json` must not depend on `@earendil-works/pi-*` or `@its-magic/pi-kernel`. Existing Biome `noRestrictedImports` already denies Pi outside `pi-kernel`; extend the US-0133/US-0134 grep to also deny Pi inside `auth-models`. Do **not** add a Biome override for `auth-models`. Kit `files` continues to omit `standalone/`. Tests: marker 3. (AC-1)

- [x] **T-002**: Ship-path `ModelRuntime.create({ authPath, modelsPath, allowModelNetwork })` against a **standalone-owned OS config directory**. Never the project tree. Never `~/.pi/agent` as the stable store. Never `.env`. Linux: `${XDG_CONFIG_HOME:-$HOME/.config}/its-magic/`; Windows: `%APPDATA%\its-magic\`; macOS: `~/Library/Application Support/its-magic/`. Files: `auth.json`, `models.json`, `models-store.json`. Mode **0600-class** on `auth.json` (POSIX `chmod 0o600`; Windows v1: user-profile `%APPDATA%` inherent ACL — extra Windows ACL APIs out of this story). Overrides `--auth-path` / `ITSM_AUTH_PATH` must stay outside the project; project-relative paths fail-closed `AUTH_PATH_IN_PROJECT`. Tests: `InMemoryCredentialStore` via `ModelRuntime.create({ credentials })` — **no disk**. Spike-only: explicit `itsm auth migrate --from-pi` when dest is absent — **never auto-copy**. Auth path is independent of session `agentDir`. CI: `allowModelNetwork: false`. Tests: markers 1, 2. (AC-1)

- [x] **T-003**: Add pi-kernel-only `AuthRuntimeAdapter` wrapping pin `@earendil-works/pi-coding-agent@0.85.1` / `@earendil-works/pi-ai@0.85.1`. Surface: `createRuntime` / three-arg `login(providerId, type, interaction)` / `logout` / `checkAuth` / in-process `registerProvider` / `getModel` (DEC-0135 §4). Codex: `providerId = "openai-codex"`, `type = "oauth"`; CLI wraps browser (`notify auth_url` + `manual_code`) or device_code. **Never open a browser from CI.** `CredentialSynchronizationError` → fail-closed `AUTH_SYNC_FAILED` (do not retry blindly). `setRuntimeApiKey` is **one-run only** (not persisted); API-key persist via `login(..., "api_key", interaction)` / CredentialStore. `registerProvider` is in-process — **never** via `DefaultResourceLoader` project `.pi/extensions`. Additive session option: `KernelCreateSessionOptions.thinkingLevel?: ThinkingLevel` — map to `createAgentSession({ thinkingLevel })`. Do **not** amend AgentKernel isolation loader, `noTools: "builtin"`, pins, or KernelBridge. Tests: markers 1, 3, 10. (AC-1, AC-2)

- [x] **T-004**: Minimum AC-2 provider set **without** loading project `.pi/extensions`: Codex OAuth `openai-codex`; API-key `openai`, `anthropic`, `google`, `openrouter`; Chinese `deepseek`, `kimi-coding`, `zai` (+ `zai-coding-cn`), `minimax` (+ `minimax-cn`), `qwen-token-plan*`; local OpenAI-compatible operator `ollama` / `lmstudio` / `vllm` via owned `models.json` (`api: "openai-completions"`); custom corporate gateway via owned `models.json` (headers/`baseUrl`/`authHeader`) **or** adapter `registerProvider` for custom OAuth/SSO. Owned `models.json` lives in the OS config dir (not project `.its-magic/` credentials). Tests: marker 8. (AC-2)

- [x] **T-005**: Implement `ModelRouter.resolve` in `auth-models` (no Pi imports). Slug shape: actual Pi `provider/model`. Cursor aliases (`fast` / `inherit`) are **not** standalone runtime slugs. Precedence: CLI argv `--model provider/model` > phase-local catalog/config override > role catalog `roles[<phase→role>]` > critic overlay (critic resolve only) > tier/catalog `tiers[cheap|balanced|strong]` > runtime default (operator default slug, else first available; CI = fake-model). Provenance required: `source`, `slug`, `provider`, `model`, `thinkingLevel`, `criticPin`, `degradedMode`, `thinkingClamped`, optional `thinkingForced`. Unknown slug → fail-closed `MODEL_OVERRIDE_SLUG_UNKNOWN` / `MODEL_ROLE_SLUG_UNKNOWN`. Keep `AUTH_*` for credentials vs `MODEL_*` for routing. Do **not** invent `AUTH_CROSS_MODEL_*`. Thin standalone catalog: gitignored `.its-magic/model-catalog.local.json` (slugs/thinking only; **not** US-0138 `RuntimeConfig`; **not** Cursor catalog SOT). Schema: `schema_version` + `tiers` + `roles` + optional `phases` + `critic` + per-role `thinking`. Secret-shaped keys fail-closed. Missing catalog → fall through to runtime default (CI fake-model). Tests: marker 4. (AC-3)

- [x] **T-006**: Thinking is session-scoped via `createAgentSession({ thinkingLevel })`, not encoded in the slug, not `TOKEN_PROFILE`, not per-prompt as v1 SOT. Levels: `off|minimal|low|medium|high|xhigh|max`. **Clamp (not fail-closed)**: if requested level is `null` on `thinkingLevelMap`, clamp to nearest supported **lower** level and set `thinkingClamped=true` in provenance. Do **not** emit `MODEL_THINKING_UNSUPPORTED` as the v1 default. Always-thinking models (`off: null`): keep provider default + provenance `thinkingForced=true`. Tests: marker 5. (AC-4)

- [x] **T-007**: Critic pin: thin catalog `critic.model` (or CLI critic overlay) honored on critic resolve only (step 4). Same normalized `provider/model` as producer → `degraded_mode=true` / **`CROSS_MODEL_DEGRADED_MODE`**. Reuse that code. Not a hard stop. Not auto-next-slug. Never claim false cross-model independence. US-0144 owns critic **session spawn**. Tests: marker 6. (AC-5)

- [x] **T-008**: CLI in `apps/cli` imports **only** `auth-models` types/handlers — never Pi modules. Commands: `itsm auth list` (configured providers; no tokens); `itsm auth login <provider> [--type oauth|api_key]` (adapter `login`; print URL/device code; read paste); `itsm auth logout <provider>`; `itsm auth migrate --from-pi` (spike-only; dest absent; never auto); `itsm models list` (catalog + available slugs; no tokens); `itsm models test <provider/model>` (`checkAuth` + catalog presence; **no paid completion**); `itsm models test <provider/model> --live` (operator-opt-in paid completion; **never CI**). Diagnostics: `{ provider, model, auth: configured|missing, health: ok|fail }` — **no tokens**, no Authorization/Cookie, no `.env` reads. Tests: marker 7. (AC-1, AC-6)

- [x] **T-009**: Create contract tests covering **exactly 10** markers (DEC-0135 §9). Primary: `standalone/tests/contract` (`node:test`) Windows + Linux. Kit twin as needed for files-omit / no-Pi-in-auth-models. No paid/model calls. Fake-model CI default **held**. Two-role different-provider fixture uses two fake/in-memory providers.
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
  Marker 9 spies prompt + audit JSON for token-shaped strings after a stubbed refresh; redact `Authorization` / `Cookie` / `sk-` / `access` / `refresh`. Marker 10 asserts empty loader + fake-model CI default still hold. Existing standalone CI Windows+Linux job covers the suite — do not fold into kit `TEST_COMMAND`. Do **not** weaken `test_us0133_*` / `test_us0134_*`. (AC-7; coverage for AC-1..AC-6 via markers)

## Integration verification (post T-009)

- [x] Test gate: standalone `npm test` covers 10/10 `test_us0135_*`; kit twin (if present) PASS; compose `test_us0133_*` / `test_us0134_*` still green
- [x] Import-boundary gate: no Pi imports in `auth-models`; CLI imports only `auth-models`; kit `files` omit `standalone/`
- [x] Isolation gate: AgentKernel empty loader / `noTools: "builtin"` / KernelBridge unamended; fake-model CI default held
- [x] Scope gate: no project/`.env`/`~/.pi/agent` ship store; no project `.pi/extensions`; no Cursor aliases as runtime slugs; no live paid CI; no US-0136+ authoring
- [x] Status gate: US-0135 remains OPEN; AC-1..AC-7 unchecked; intake JSON not mutated; US-0133/US-0134/BUG-0020 remain DONE

## Files to touch (scope)

### New (create)

- `standalone/packages/auth-models/` (`package.json`, `src/index.ts`, AuthService / ModelRouter / catalog types / CLI handlers)
- pi-kernel `AuthRuntimeAdapter` module (inside `standalone/packages/pi-kernel`)
- `standalone/tests/contract` `test_us0135_*` (node:test)
- kit twin `tests/us0135_*` as needed (files-omit / no-Pi-in-auth-models)
- `sprints/S0141/t-anch-verification.md` (execute)

### Edit (scoped)

- `standalone/packages/pi-kernel` — AuthRuntimeAdapter + additive `KernelCreateSessionOptions.thinkingLevel` only
- `standalone/apps/cli` (or equivalent CLI entry) — `itsm auth` / `itsm models list` / `itsm models test` handlers importing **only** `auth-models`
- existing US-0133/US-0134 Pi-import grep — extend to deny Pi inside `auth-models`
- `.github/workflows/ci.yml` — extend existing standalone Windows+Linux job only if glob would miss new tests; do not fold into kit `TEST_COMMAND`
- `.gitignore` — confirm `.its-magic/model-catalog.local.json` remains gitignored (do not commit operator catalog)

### Verify read-only (no mutation)

- `docs/engineering/architecture.md # US-0135`
- `decisions/DEC-0135.md`
- `docs/engineering/research.md ## R-0127` (and R-0120..R-0126 intact)
- `docs/product/backlog.md ## US-0135` Status/ACs (US-0045)
- `docs/product/acceptance.md` US-0135 row
- `handoffs/intake_evidence/US-0133-0148-intake-20260911.json`
- `standalone/packages/pi-kernel` AgentKernel isolation loader / `noTools` / pins (DEC-0133)
- `standalone/packages/kernel-bridge` (DEC-0134 — unamended)
- BUG-0020 / S0140 artifacts (DONE — do not reopen)

### Compose-guard UNCHANGED (DO NOT TOUCH)

| File / surface | Reason |
|---|---|
| Backlog Status / AC checkboxes | US-0045 — closure only |
| `architecture.md` body beyond T-anch verify | locked in /architecture |
| `decisions/DEC-0135.md` body | locked in /architecture |
| R-0127 / R-0121 / R-0122 / R-0120..R-0126 | do not rewrite; do not wipe |
| `# US-0133` / DEC-0133 / AgentKernel isolation / `noTools` | compose inject seam + additive `thinkingLevel` only |
| `# US-0134` / DEC-0134 / KernelBridge | unamended |
| Kit `package.json` `workspaces` | kit is not a workspace root |
| Kit `files` whitelist expansion | omit `standalone/` |
| Project `.pi/extensions` / `DefaultResourceLoader` discovery | empty loader held |
| `~/.pi/agent` as ship store | rejected A2 |
| Project / `.env` credentials | rejected A3 |
| Cursor `.cursor/model-catalog.local.json` as runtime SOT | rejected A8 |
| Live paid CI / `--live` in CI | rejected A7 |
| US-0136..US-0148 bodies | OUT OF SCOPE |
| BUG-0020 / OpenCode `/auto` | DONE — do not reopen |
| US-0138 `RuntimeConfig` | catalog is not RuntimeConfig this story |
| US-0144 critic session spawn | pin/degraded only this story |

## AC → Task surjective coverage

| AC | Task(s) |
|---|---|
| AC-1 | T-001, T-002, T-003, T-008 (T-009 m1–m3) |
| AC-2 | T-003, T-004 (T-009 m8) |
| AC-3 | T-005 (T-009 m4) |
| AC-4 | T-006 (T-009 m5) |
| AC-5 | T-007 (T-009 m6) |
| AC-6 | T-008 (T-009 m7) |
| AC-7 | T-009 (m8, m9, m10) |
| DC / architecture | T-anch |

**Surjectivity check**: 7/7 ACs covered. No `PLAN_AC_COVERAGE_GAP`.
