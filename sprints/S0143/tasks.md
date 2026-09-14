# Sprint S0143 - Task checklist (US-0137)

Total tasks: 11 (T-anch + T-001..T-010). SPRINT_MAX_TASKS=12; SPRINT_AUTO_SPLIT=1; no split. T-anch retained as NO-OP verification. Seeds 1:1 from `docs/engineering/architecture.md` `# US-0137`. Sprint id **S0143** (next free after S0142).

**Isolation**: `tl-US0137-sprintplan-20260913T111500Z-fresh` · `model_id=cursor-grok-4.6-high` · `orchestrator_run_id=auto-20260913-us0137`

## Task execution order

1. T-anch (NO-OP / verification)
2. T-001 (`policy-engine` + `tool-broker` packages + Pi import-boundary grep)
3. T-002 (PolicyEngine tuple ALLOW/ASK/DENY + `security_hard`)
4. T-003 (path ownership deny matrix) — parallel with T-004 and T-005 after T-002
5. T-004 (shell parse/classify + traversal/exfil) — parallel with T-003 and T-005 after T-002
6. T-005 (secret path deny + compose `redact.ts`) — parallel with T-003 and T-004 after T-002
7. T-006 (Layer A profiles + `ISOLATION_BACKEND_UNAVAILABLE`)
8. T-007 (compact audit + real `policy_hash`)
9. T-008 (kernel tool-port + `noTools` / `itsm_*` injection)
10. T-009 (per-role catalog + fail-closed stubs)
11. T-010 (10 `test_us0137_*` Win/Linux fake-model CI)
12. Integration verification

## Critic NB awareness (execute)

- **T-003/T-004/T-005/T-006/T-008/T-010** (`us0137asc-challenger-001` NB1): fail-closed edges locked DEC-0137 §3–§11 — raw Pi tools, path ownership, shell exfil, secret deny, Layer B unavailable, malicious extensions; `compute_strict_proof_hash` tuple unamended.
- **T-anch..T-010** (`us0137asc-architect-002` NB2): keep 1:1 architecture seeds; sprint folder is **S0143**; execute owns `policy-engine` + `tool-broker` + kernel tool-port + catalog + 10 tests; architecture owns H1+DEC-0137; PolicyEngine vs RoleCatalog (intent vs permission); `defineTool` only in pi-kernel; US-0141 Layer B deferred; DEC-0133/0134/0135/0136 compose held.
- **T-anch** (`us0137asc-subtractor-003` NB3): verification-only; do not rewrite `# US-0137` / DEC-0137 / R-0129; reject A2–A12; do not amend isolation/`noTools`/KernelBridge/auth-models; do not mark DONE; do not reopen US-0136/US-0135 or BUG-0020; do not design US-0138+; do not claim OS sandbox; 10 markers required.

## Task checklist

- [x] **T-anch**: Verify `# US-0137` H1 in `docs/engineering/architecture.md`; DEC-0137 Accepted; approach A1 LOCKED; R-0129 DQ1–DQ10 LOCKED; 10-marker table locked; compose guards (US-0133 isolation/`noTools` unamended; KernelBridge unamended; auth-models unamended except compose `redact.ts`; role-runtime unamended except spawn allowlist + `policy_hash` value source; kit `files` omit `standalone/`; US-0138+ out; US-0136/US-0135/BUG-0020 DONE; R-0120..R-0128 intact); verify `standalone/packages/policy-engine`, `standalone/packages/tool-broker`, and `test_us0137_*` do NOT yet exist (or document baseline). Record to `sprints/S0143/t-anch-verification.md`. NO mutation to `architecture.md` / `decisions/DEC-0137.md` / `docs/engineering/research.md` R-0129 in /execute. (DC / architecture baseline; NO-OP)

- [x] **T-001**: Create `standalone/packages/policy-engine` and `standalone/packages/tool-broker`. `package.json`: names `@its-magic/policy-engine` and `@its-magic/tool-broker`, `private: true`, `version: 0.0.0`, `type: module`, `engines.node >=22.19.0`, export `./src/index.ts`. Workspaces glob `packages/*` already includes them — do **not** add `standalone/` to kit `workspaces`. **No Pi imports.** Neither `package.json` may depend on `@earendil-works/pi-*`. Type-only import from `@its-magic/pi-kernel` / `@its-magic/role-runtime` is allowed. Do **not** import Pi modules. Existing Biome `noRestrictedImports` already denies Pi outside `pi-kernel`; extend the US-0133..US-0136 grep to also deny Pi inside both packages. Do **not** add a Biome override. Kit `files` continues to omit `standalone/`. Do **not** stub `runtime-core` this story (US-0140). Tests: marker 1/10 (no-Pi portion). (AC-1)

- [x] **T-002**: Implement PolicyEngine owned TypeScript decision tables inside `policy-engine`. Default-deny. Result **ALLOW | ASK | DENY**. Tuple = role, phase, work item, sprint, worktree/cwd, path(s), command, execution backend, autonomy (`supervised`|`autonomous`), permission_mode (`default-deny`|`ask-on-write`), security_class (`standard`|`security_hard`), operator approvals, isolation_profile. `security_hard` cannot be relaxed by autonomy (R10). Thin enums here; US-0138 owns typed RuntimeConfig flags. ASK persistence: process-local in-memory + optional gitignored runtime JSON under the standalone OS config / temp run dir (compose DEC-0136). Missing approval → **DENY**. SQLite deferred. Do **not** turn RoleCatalog into a permission matrix. (AC-2)

- [x] **T-003**: Path ownership is **code**, not prompt. PolicyEngine consumes RoleCatalog `artifact_ownership[]` **plus** a deterministic deny matrix. Canonicalize with `path.resolve` + `realpath` against the worktree root; compare with `path.relative`; reject escape (`..`, symlink-out, UNC `\\`, `/etc`, Windows `\\?\` / `\\.\`) → `POLICY_TRAVERSAL_DENIED`. Deny matrix: PO production source (`src/**`, `standalone/packages/**` except docs) → `POLICY_PO_PRODUCTION_WRITE`; QA silent production patch → `POLICY_QA_SILENT_FIX`; release DONE/closure writes → `POLICY_RELEASE_CLOSURE_WRITE`; closure release-artifact writes → `POLICY_CLOSURE_RELEASE_WRITE`; orchestrator phase writes → compose `AUTO_ORCHESTRATOR_PHASE_EXECUTION` / `SESSION_ORCHESTRATOR_TOOLS_DENIED`; curator product-intent (`docs/product/vision.md`, backlog ACs as intent) → `POLICY_CURATOR_INTENT_REWRITE`. Secret-file paths handled in T-005. Tests: markers 3, 4, 6. (AC-3)

- [x] **T-004**: Shell classifier v1: argv / PowerShell token split — **not** a full bash AST. Unparseable / command-substitution / nested shell → `POLICY_SHELL_UNPARSEABLE`. Classes: `safe-read` | `build-test` | `local-process` | `package-install` | `git-mutation` | `destructive-fs` | `network-deploy` | `privileged`. Fail-safe inventory (do **not** classify by asking the model): exfil (`curl`/`wget`/`Invoke-WebRequest` posting env; `printenv`/`Get-ChildItem env:`; `type .env`; `cat ~/.ssh`) → `POLICY_SHELL_EXFIL_DENIED`; privileged (`sudo`, `runas`, `Set-ExecutionPolicy Unrestricted`) → `POLICY_SHELL_PRIVILEGED_DENIED`; destructive (`rm -rf`, `Remove-Item -Recurse`, `format`, `mkfs`) → `POLICY_SHELL_DESTRUCTIVE_DENIED`; package (`npm publish`, `npm install -g`) ASK or DENY by autonomy → `POLICY_PACKAGE_DENIED` when DENY; git mutation (`push --force`, `reset --hard`) → `POLICY_GIT_FORCE_DENIED`. Windows `powershell`/`cmd` wrappers classified the same as argv. Tests: markers 6, 7. (AC-4)

- [x] **T-005**: Deny secret-file reads **before** bytes enter tool `content`. Never inject `.env` into LLM context. Secret paths (`.env`, `.env.*`, `*.pem`, `credentials.json`, auth stores) → `POLICY_SECRET_PATH_DENIED`. Compose US-0135 `redactAudit` / `redactSecretShaped` / `containsTokenShape` for logs, audit `details`, and evidence. Browser/header helper: redact `Authorization`/`Cookie` and token-shaped values in any network-shaped payload **without** implementing US-0142 runtime. Config may reference secret **names** only (US-0138). This story does not read `.env`. Provider tokens never logged. **Reject** expanding `redact.ts` into a second secret store. Tests: markers 5, 8. (AC-5)

- [x] **T-006**: Typed enum: `trusted-local` | `isolated-development` | `untrusted-repository`. PolicyEngine records the requested profile + backend handle. Missing Layer B backend → `ISOLATION_BACKEND_UNAVAILABLE` (deterministic reason; no execution). **Layer A** = this story (semantic authorization). **Layer B** = US-0141 (local/Docker/WSL/SSH/micro-VM). Claiming a complete OS sandbox from in-process checks is **forbidden**. Tests: marker 9. (AC-6)

- [x] **T-007**: Every consequential action writes a compact row: `run_id`, `phase_id`, `kernel_session_id`, `tool`, normalized action, policy decision, duration, result, `evidence_ref` — **no secret payload** (`redactAudit` on persist). **v1 store**: in-memory + gitignored runtime JSON/JSONL under standalone OS config / temp run dir (compose DEC-0136). SQLite deferred. **Real `policy_hash`**: SHA-256 of canonical sorted-key JSON `{ schema_version: 1, policy_snapshot, tool_allowlist, role_catalog_digest }`. Replace DEC-0136 `stubPolicyHash` **value source**; keep sidecar field name `policy_hash`. ToolBroker/PolicyEngine compute the hash; SessionSupervisor records the provided value on the production spawn path (`stubPolicyHash` must not run in production). Python validators ignore unknown keys. **Do not extend** `compute_strict_proof_hash` / DEC-0038 tuple. (AC-7)

- [x] **T-008**: Additive owned-tool structs on `KernelCreateSessionOptions`. **Only** `packages/pi-kernel` calls `defineTool` and passes `customTools` into `createAgentSession`. Names must match `^itsm_[a-z0-9_]+$`. Builtin names (`read`/`bash`/`edit`/`write`/`powershell`/`grep`/`find`/`ls`) at the port → fail-closed `POLICY_RAW_PI_TOOL_DENIED`. Production: `noTools: "builtin"` **held** + `customTools` = defineTool-wrapped `ownedTools` + `tools` = those `itsm_*` names. Empty isolation loader **held**. `PI_COMPAT_RESOURCES` trusted enablement **default-off**; even `isolationMode=trusted`, project `.pi/extensions` cannot register tools. Do **not** switch `cwd`/`agentDir` to the target project. Do **not** add `additionalExtensionPaths` / `extensionFactories` in production. Do **not** amend AgentKernel isolation loader internals, pins, KernelBridge, or auth-models. `itsm_ping` remains the kernel-contract placeholder (US-0133 compose). Tests: markers 1, 10. (AC-1)

- [x] **T-009**: Production sessions receive **only** role/phase `itsm_*` names from ToolBroker. SessionSupervisor spawn allowlist = that name list (orchestrator remains `[]` per DEC-0136). **Live this story**: `itsm_read`, `itsm_edit`, `itsm_write`, `itsm_patch`, `itsm_shell`, `itsm_git`. **Fail-closed stubs** (name visible only if the role map includes it; execute → `POLICY_STUB_TOOL_DENIED`, no backend): `itsm_search` / `itsm_outline` / `itsm_symbol` / `itsm_references` / `itsm_callers` / `itsm_impact` (US-0139); `itsm_app_start` / `itsm_app_stop` / `itsm_app_logs` / `itsm_app_health` / `itsm_deploy` (US-0141); `itsm_browser` (US-0142); `itsm_test` / `itsm_validate` (stub unless classified as in-process build/test via `itsm_shell`); `itsm_spawn_review` (stub). Floor maps: orchestrator `[]`; po / curator / release / qe / qa: `itsm_read` + cataloged stubs, **no** production-source writes; scout / security / critic: `itsm_read` + search stubs as cataloged; tech-lead / dev: live set via path matrix. Production ToolBroker catalog **excludes** `itsm_ping`. Do **not** ship the full §11.1 list as live backends this story. Tests: marker 2. (AC-1)

- [x] **T-010**: Create contract tests covering **exactly 10** markers (DEC-0137 §11). Primary: `standalone/tests/contract` (`node:test`) Windows + Linux. Kit twin as needed for no-Pi-in-policy-engine/tool-broker / files-omit compose. No paid/model calls. Fake-model CI default **held**.
  1. `test_us0137_no_raw_pi_tools_in_production_session`
  2. `test_us0137_role_subset_itsm_tools`
  3. `test_us0137_po_src_deny`
  4. `test_us0137_qa_silent_fix_deny`
  5. `test_us0137_env_read_deny`
  6. `test_us0137_path_traversal_deny`
  7. `test_us0137_shell_exfil_deny`
  8. `test_us0137_browser_header_redaction`
  9. `test_us0137_isolation_backend_unavailable`
  10. `test_us0137_malicious_pi_extension_and_orchestrator_zero_tools`
  Marker 1 asserts production session tool list is `itsm_*` only (no Pi builtins). Marker 2 asserts role subset maps. Marker 8 redacts headers without implementing US-0142. Marker 9 missing Layer B → `ISOLATION_BACKEND_UNAVAILABLE`. Marker 10 malicious `.pi/extensions` + orchestrator zero tools + empty loader + fake-model CI default still hold. Existing standalone CI Windows+Linux job covers the suite — do not fold into kit `TEST_COMMAND`. Do **not** weaken `test_us0133_*` / `test_us0134_*` / `test_us0135_*` / `test_us0136_*`. (AC-8; coverage for AC-1..AC-7 via markers)

## Integration verification (post T-010)

- [x] Test gate: standalone `npm test` covers 10/10 `test_us0137_*`; kit twin (if present) PASS; compose `test_us0133_*` / `test_us0134_*` / `test_us0135_*` / `test_us0136_*` still green
- [x] Import-boundary gate: no Pi imports in `policy-engine` / `tool-broker`; kit `files` omit `standalone/`
- [x] Isolation gate: AgentKernel empty loader / `noTools: "builtin"` / KernelBridge / auth-models unamended; role-runtime unamended except spawn allowlist + hash value source; fake-model CI default held; DEC-0038 tuple unamended
- [x] Scope gate: no OS sandbox claim; no SQLite; no `runtime-core`; no live paid CI; no US-0138+ authoring; no `.env` reads
- [x] Status gate: US-0137 remains OPEN; AC-1..AC-8 unchecked; intake JSON not mutated; US-0133/US-0134/US-0135/US-0136/BUG-0020 remain DONE

## Files to touch (scope)

### New (create)

- `standalone/packages/policy-engine/` (`package.json`, `src/index.ts`, PolicyEngine / deny matrix / shell classifier / profiles / `computePolicyHash`)
- `standalone/packages/tool-broker/` (`package.json`, `src/index.ts`, catalog / execute injection / audit / spawn allowlist)
- additive `ownedTools` on `KernelCreateSessionOptions` inside `standalone/packages/pi-kernel` (defineTool wrap only)
- `standalone/tests/contract` `test_us0137_*` (node:test)
- kit twin `tests/us0137_*` as needed (files-omit / no-Pi-in-policy-engine/tool-broker)
- `sprints/S0143/t-anch-verification.md` (execute)

### Edit (scoped)

- existing US-0133..US-0136 Pi-import grep — extend to deny Pi inside `policy-engine` and `tool-broker`
- `standalone/packages/pi-kernel` — additive `ownedTools` + defineTool wrap only; isolation loader / `noTools` / pins unamended
- `standalone/packages/role-runtime` — spawn allowlist + `policy_hash` value source only (do not turn RoleCatalog into a permission matrix)
- `.github/workflows/ci.yml` — extend existing standalone Windows+Linux job only if glob would miss new tests; do not fold into kit `TEST_COMMAND`
- optional: gitignore confirm for OS-config JSONL (never commit policy/audit JSON)

### Verify read-only (no mutation)

- `docs/engineering/architecture.md # US-0137`
- `decisions/DEC-0137.md`
- `docs/engineering/research.md ## R-0129` (and R-0120..R-0128 intact)
- `docs/product/backlog.md ## US-0137` Status/ACs (US-0045)
- `docs/product/acceptance.md` US-0137 row
- `handoffs/intake_evidence/US-0133-0148-intake-20260911.json`
- `standalone/packages/pi-kernel` AgentKernel isolation loader / `noTools` / pins (DEC-0133)
- `standalone/packages/kernel-bridge` (DEC-0134 — unamended)
- `standalone/packages/auth-models` (DEC-0135 — compose redact; unamended store)
- `standalone/packages/role-runtime` (DEC-0136 — compose spawn allowlist + hash only)
- US-0136 / S0142 artifacts (DONE — do not reopen)
- US-0135 / S0141 artifacts (DONE — do not reopen)
- BUG-0020 / S0140 artifacts (DONE — do not reopen)

### Compose-guard UNCHANGED (DO NOT TOUCH)

| File / surface | Reason |
|---|---|
| Backlog Status / AC checkboxes | US-0045 — closure only |
| `architecture.md` body beyond T-anch verify | locked in /architecture |
| `decisions/DEC-0137.md` body | locked in /architecture |
| R-0129 / R-0128 / R-0127 / R-0121 / R-0122 / R-0120..R-0126 | do not rewrite; do not wipe |
| `# US-0133` / DEC-0133 / AgentKernel isolation / `noTools` | compose additive `ownedTools` only |
| `# US-0134` / DEC-0134 / KernelBridge | unamended |
| `# US-0135` / DEC-0135 / auth-models store | compose `redact.ts` only |
| `# US-0136` / DEC-0136 / RoleCatalog | spawn allowlist + hash value source only |
| Kit `package.json` `workspaces` | kit is not a workspace root |
| Kit `files` whitelist expansion | omit `standalone/` |
| DEC-0038 `compute_strict_proof_hash` tuple | UNAMENDED — sidecar `policy_hash` is separate |
| Project tree policy/audit JSON | never; OS-config / temp only |
| SQLite operational store | deferred §27.2 |
| `runtime-core` stub | US-0140 |
| Live paid CI | rejected A11 |
| US-0138..US-0148 bodies | OUT OF SCOPE |
| US-0136 / US-0135 / BUG-0020 | DONE — do not reopen |
| US-0138 `RuntimeConfig` | thin enums only this story |
| US-0141 OS sandbox | Layer B OUT; fail-closed missing backend |
| `.env` / credentials | never read |

## AC → Task surjective coverage

| AC | Task(s) |
|---|---|
| AC-1 | T-001, T-008, T-009 (T-010 m1, m2, m10) |
| AC-2 | T-002 |
| AC-3 | T-003 (T-010 m3, m4) |
| AC-4 | T-004 (T-010 m6, m7) |
| AC-5 | T-005 (T-010 m5, m8) |
| AC-6 | T-006 (T-010 m9) |
| AC-7 | T-007 |
| AC-8 | T-010 |
| DC / architecture | T-anch |

**Surjectivity check**: 8/8 ACs covered. No `PLAN_AC_COVERAGE_GAP`.
