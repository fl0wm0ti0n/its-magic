# Sprint S0150 - Task checklist (US-0142)

Total tasks: 11 (T-anch + T-001..T-010). SPRINT_MAX_TASKS=12; SPRINT_AUTO_SPLIT=1; no split. T-anch retained as NO-OP verification. Seeds 1:1 from `docs/engineering/architecture.md` `# US-0142`. Sprint id S0150 (next free after S0149 occupied by US-0141). Do not overwrite S0140–S0149. Do not reuse S0146 (BUG-0021), S0147 (US-0140), S0148 (BUG-0023), or S0149 (US-0141).

**Isolation**: `tl-US0142-sprintplan-20260914T041000Z-fresh` · `model_id=cursor-grok-4.6-high` · `orchestrator_run_id=auto-20260913-us0142`

## Task execution order

1. T-anch (NO-OP / verification)
2. T-001 (`packages/browser-uat` + Pi-import grep + consume `connectHandoff`)
3. T-002 (isolated Playwright `launch`+`newContext`)
4. T-003 (CDP adapter `connectOverCDP`+`disconnect`+dedicated profile)
5. T-004 (promote `itsm_browser` typed actions)
6. T-005 (UAT planner plug-in + additive `owned` + kit `UAT_PROBE_FORBIDDEN` held)
7. T-006 (evidence schema + redaction + gitignored traces)
8. T-007 (credential deny + opaque injection / operator approval)
9. T-008 (fail-closed `BROWSER_*`/`UAT_*` + `BROWSER_RETRY_MAX`)
10. T-009 (E2E happy+failure fixtures; no visual baseline)
11. T-010 (12 `test_us0142_*` Win/Linux fake-driver)
12. Integration verification

## Critic NB awareness (execute)

- **T-002/T-003/T-006/T-007/T-008/T-010** (`us0142arc-challenger-001` NB1): fail-closed `BROWSER_*` / `UAT_*` locked DEC-0142. Chrome 136+ default profile forbidden. Traces/HAR redact. CDP `disconnect()` not `close()`. `BROWSER_RETRY_MAX` orthogonal. Never read `.env`. Pixel baseline OUT. `compute_strict_proof_hash` tuple unamended.
- **T-anch..T-010** (`us0142arc-architect-002` NB2): keep 1:1 architecture seeds; sprint folder is S0150 (S0149 occupied by US-0141); execute owns `@its-magic/browser-uat` + compose `connectHandoff` + 12 tests; architecture owns H1+DEC-0142; ToolBroker→BrowserUAT; do not rewrite AppRuntime/workflow/GateEngine; US-0143 drain OUT; pixel baseline OUT.
- **T-anch** (`us0142arc-subtractor-003` NB3): verification-only; do not rewrite `# US-0142` / DEC-0142 / R-0139; reject A2–A15; do not amend isolation/`noTools`/KernelBridge/auth-models/PolicyEngine tables/RoleCatalog internals/config loaders; do not mark DONE; do not reopen US-0133..US-0141; do not design US-0143+; do not own credentials or read `.env`; do not mutate BUG-0021/0022/0023 or S0146/S0147/S0148/S0149; 12 markers required.

## Task checklist

- [x] **T-anch**: Verify `# US-0142` H1 in `docs/engineering/architecture.md`; DEC-0142 Accepted; approach A1 LOCKED; R-0139 DQ1–DQ10 LOCKED; 12-marker table locked; compose guards (US-0141 `connectHandoff` consume; US-0093 KEEP contract REPLACE backend; US-0128 no fake browser PASS; US-0135 redact; US-0137 PolicyEngine tables unamended except promote `itsm_browser`; US-0140 GateEngine consume-only; KernelBridge unamended; isolation/`noTools` unamended; kit `files` omit `standalone/`; US-0143+ out; US-0133..US-0141 DONE; BUG-0021 DONE not mutated; BUG-0022 OPEN not mutated; BUG-0023 DONE not mutated; S0146/S0147/S0148/S0149 not reused; R-0120..R-0139 intact; R-0138 remains US-0141; R-0136/R-0137 remain BUG-0023). Verify `standalone/packages/browser-uat` and `test_us0142_*` do NOT yet exist (or document baseline). Record to `sprints/S0150/t-anch-verification.md`. NO mutation to `architecture.md` / `decisions/DEC-0142.md` / `docs/engineering/research.md` R-0139 in /execute. (DC / architecture baseline; NO-OP)

- [x] **T-001**: Create `standalone/packages/browser-uat`. `package.json`: name `@its-magic/browser-uat`, `private: true`, `version: 0.0.0`, `type: module`, `engines.node >=22.19.0`, export `./src/index.ts`. Workspaces glob `packages/*` already includes it. Contains: `BrowserUAT` facade, isolated Playwright driver, typed CDP adapter, evidence writer, UAT executor plug-in. **No Pi imports.** `package.json` must not depend on `@earendil-works/pi-*`. Type-only / public-API imports from `@its-magic/app-runtime` (`ConnectHandoff`), `@its-magic/policy-engine`, `@its-magic/tool-broker`, `@its-magic/config` are allowed. Those packages **do not** import browser-uat internals. Call `AppRuntime.connectHandoff(id)` (or injected port). Consume LOCKED Connect fields: `connect_endpoint`, `health_path`, `service_id`, `container_id`, `env_refs` (names-only), `url`, `ports`, `health`. Do **not** import ProcessManager / ExecutionBackend internals. Extend the US-0133..US-0141 grep to deny Pi inside `packages/browser-uat`. Do **not** nest BrowserUAT inside `app-runtime` or `runtime-core/workflow/` or GateEngine. Do not add a Biome override. Kit `files` omit `standalone/`. Do not add standalone to kit workspaces. Tests: marker 1 (owned by T-010). (AC-1)

- [x] **T-002**: Isolated mode (default for CI/regression): `chromium.launch({ headless })` + `browser.newContext()`. Fresh cookies/storage. `context.close()` then `browser.close()` **OK** (Playwright-owned). Do not use `launchPersistentContext` against default Chrome User Data. Tests: marker 1. (AC-1)

- [x] **T-003**: Authorized CDP: operator Chrome/Chromium with `--remote-debugging-port` **and** dedicated `--user-data-dir`; runtime `chromium.connectOverCDP(endpoint)` + **`browser.disconnect()`** (developer browser stays alive). Default Chrome User Data → fail-closed `BROWSER_CDP_DEFAULT_PROFILE_FORBIDDEN`. Missing port/profile/approval → `BROWSER_CDP_UNAUTHORIZED` (not silent isolated fallback). Optional `launchPersistentContext(dedicatedDir)` is helper-only, never default User Data. Reject `browser.close()` after CDP as default teardown. Tests: markers 2, 3. (AC-1)

- [x] **T-004**: Single structured `itsm_browser` tool with typed `action` enum LOCKED: `open`, `navigate`, `snapshot`, `click`, `type`, `select`, `wait`, `screenshot`, `console`, `network`, `download`, `upload`, `accessibility`. Promote: remove `itsm_browser` from PolicyEngine `STUB_TOOLS`. Register a live handler in ToolBroker that delegates to `BrowserUAT`. Do **not** rewrite PolicyEngine path/shell/secret tables; compose `denySecretOrTraversal` unchanged. QA is the primary allowlisted caller. CDP attach additionally requires explicit operator approval. Snapshot = accessibility/ARIA (or DOM) summary — **not** pixel visual baseline. Tests: marker 4. (AC-2)

- [x] **T-005**: Reuse `uat_probe_lib.classify_step` kinds (`process_health` \| `cli_smoke` \| `browser_smoke` \| `api_health` / api probe \| `manual_operator`). Standalone `BrowserUAT` is the executor plug-in for `browser_smoke`. Do **not** fork a second classifier. Add additive mode **`UAT_BROWSER_PROBE_MODE=owned`**. Kit default **`cursor` held**. Unknown mode still collapses to `cursor` on the kit Python path. `FRAMEWORK_KIT_REPO=1`: kit-slice `browser_smoke` waives with `UAT_PROBE_FORBIDDEN` **remain**. This story must **not** weaken `UAT_PROBE_FORBIDDEN` for `.env` / intake-evidence / secret-token deny or for other stories’ waived probes. US-0142 contract tests **lift** `browser_smoke` for **this story’s** applicable fixtures only. Tests: markers 5, 6. (AC-3)

- [x] **T-006**: Persist compatible `uat.json` `probe_results[]` + US-0093 `browser_evidence_refs` (screenshot paths, console/network summaries, navigation URL). Additive fields LOCKED: `snapshot_summary`, `trace_ref`, `duration_ms`, `browser_backend` (`isolated`\|`cdp`), `app_runtime_ref`. Redact Authorization/Cookie/Set-Cookie/tokens/form secrets via US-0135 before persist. HAR `content: "omit"`. Traces gitignored under `.its-magic/runtime/browser-evidence/`. Evidence-gap (PASS without required refs) → `UAT_BROWSER_PROBE_FAILED` / `BROWSER_EVIDENCE_GAP`. Reject storing raw HAR/trace in SQLite or sprint markdown. Tests: markers 7, 8. (AC-4, AC-7)

- [x] **T-007**: Authenticated flows, in order: (1) authorized CDP dedicated profile; (2) opaque externally injected test account (names-only env refs; injection the model cannot `itsm_read`); (3) explicit operator ASK. Browser agents **cannot** read credentials from project files. **Never read `.env`**. Typing passwords from repo files → `UAT_PROBE_FORBIDDEN` / `BROWSER_CREDENTIAL_FORBIDDEN`. Reject storageState JSON checked into the repo with live cookies. Tests: marker 9. (AC-6)

- [x] **T-008**: Keep existing UAT families. Additive `BROWSER_*` family LOCKED: `BROWSER_UNAVAILABLE`, `BROWSER_CDP_UNAUTHORIZED`, `BROWSER_CDP_DEFAULT_PROFILE_FORBIDDEN`, `BROWSER_CRASHED`, `BROWSER_WAIT_TIMEOUT`, `BROWSER_ASSERTION_FAILED`, `BROWSER_CONSOLE_ERROR`, `BROWSER_NETWORK_FAILED`, `BROWSER_EVIDENCE_GAP`, `BROWSER_CREDENTIAL_FORBIDDEN`, `BROWSER_RETRY_CAP_EXHAUSTED`. Retry cap: **`BROWSER_RETRY_MAX` default 2**, from resolved config/scratchpad if present. Orthogonal to `APP_RUNTIME_RESTART_MAX`. Missing CDP authorization is **not** retried into isolated mode. No silent PASS / no fake browser PASS. Tests: markers 3, 10. (AC-5)

- [x] **T-009**: E2E fixtures with in-process HTTP server (not live Docker): app launch → browser action → evidence → UAT gate in both happy and failure paths. Exploratory flows can be promoted to regression specs **without** visual-diff blocker. `toHaveScreenshot` **not** in the inventory. Tests: markers 11, 12. (AC-8)

- [x] **T-010**: Create contract tests covering exactly 12 markers (DEC-0142 §9). Primary: `standalone/tests/contract` (`node:test`) Windows + Linux. Fake-model CI. Fake `BrowserDriver` / fake CDP endpoint. No paid model calls. No required live Chrome/Chromium (unavailable codes asserted, not skipped). Count stays 12.
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
  Do not weaken `test_us0133_*` / `test_us0134_*` / `test_us0135_*` / `test_us0136_*` / `test_us0137_*` / `test_us0138_*` / `test_us0139_*` / `test_us0140_*` / `test_us0141_*`. (AC-1..AC-8)

## Integration verification (post T-010)

- [x] Test gate: standalone npm test covers 12/12 `test_us0142_*` plus compose us0133..us0141 still green
- [x] Import-boundary gate: no Pi imports in `packages/browser-uat`; kit `files` omit `standalone/`
- [x] Isolation gate: AgentKernel empty loader / `noTools` builtin / KernelBridge / auth-models store / PolicyEngine tables (except `itsm_browser` promote) / RoleCatalog internals / config loaders unamended; fake-model CI held; DEC-0038 tuple unamended
- [x] Scope gate: no credentials / `.env` reads; no AppRuntime rewrite; no `/auto`/`/quick` drain; no pixel visual baseline; no US-0143+ authoring; no nesting inside app-runtime
- [x] Status gate: US-0142 remains OPEN; AC-1..AC-8 unchecked; intake JSON not mutated; US-0133..US-0141 remain DONE; BUG-0021/BUG-0022/BUG-0023 not mutated; S0146/S0147/S0148/S0149 not mutated

## Files to touch (scope)

### New (create)

- `standalone/packages/browser-uat/` (`package.json`, `src/index.ts`, BrowserUAT / isolated driver / CDP adapter / evidence writer / UAT plug-in)
- `standalone/tests/contract` `test_us0142_*` (`node:test`)
- `sprints/S0150/t-anch-verification.md` (execute)

### Edit (scoped)

- existing US-0133..US-0141 Pi-import grep — extend to `packages/browser-uat`
- PolicyEngine `STUB_TOOLS` — promote `itsm_browser` only (do **not** rewrite path/shell/secret tables)
- ToolBroker — register `itsm_browser` handler delegating to BrowserUAT (no Playwright import in broker)
- `.gitignore` analog `**/.its-magic/runtime/` — confirm `browser-evidence/` path
- `.github/workflows/ci.yml` — extend existing standalone Windows+Linux job only if glob would miss new tests

### Compose-guard UNCHANGED (DO NOT TOUCH)

| File / surface | Reason |
|---|---|
| Backlog Status / AC checkboxes | US-0045 — closure only |
| `architecture.md` / `DEC-0142.md` | locked in /architecture |
| PolicyEngine decision tables | promote `itsm_browser` only; tables unamended |
| KernelBridge / isolation / `noTools` | unamended |
| RoleCatalog internals | inject spawn only |
| config loaders | consume `BROWSER_RETRY_MAX` / `UAT_BROWSER_PROBE_MODE` only |
| DEC-0038 tuple | UNAMENDED |
| AppRuntime / ProcessManager / ExecutionBackend | US-0141 DONE — consume `connectHandoff` only |
| `/auto` / `/quick` drain | US-0143 OUT |
| Pixel visual baseline | OUT |
| US-0143..US-0148 | OUT OF SCOPE |
| US-0133..US-0141 / S0149 | DONE — do not reopen |
| S0146 / BUG-0021 | DONE — do not mutate |
| S0148 / BUG-0023 | DONE — do not mutate |
| BUG-0022 | OPEN — do not mutate |
| `.env` / credentials | never read |
| `.opencode/commands/auto.md` restore | forbidden |

## AC → Task surjective coverage

| AC | Task(s) |
|---|---|
| AC-1 | T-001, T-002, T-003 (T-010 m1–m3) |
| AC-2 | T-004 (T-010 m4) |
| AC-3 | T-005 (T-010 m5, m6) |
| AC-4 | T-006 (T-010 m7) |
| AC-5 | T-008 (T-010 m3, m10) |
| AC-6 | T-007 (T-010 m9) |
| AC-7 | T-006 (T-010 m8) |
| AC-8 | T-009 (T-010 m11, m12) |
| DC / architecture | T-anch |

**Surjectivity check**: 8/8 ACs covered. T-010 markers attest AC-1..AC-8. No `PLAN_AC_COVERAGE_GAP`.
