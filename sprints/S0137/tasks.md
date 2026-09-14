# Sprint S0137 - Task checklist (US-0133)

Total tasks: 10 (T-anch + T-001..T-009). SPRINT_MAX_TASKS=12; SPRINT_AUTO_SPLIT=1; no split. T-anch retained as NO-OP verification. Seeds 1:1 from `docs/engineering/architecture.md` `# US-0133`. Sprint id **S0137** (next free after S0136; critic NB2 `S0133` preview is stale).

**Isolation**: `tl-US0133-sprintplan-20260912T112500Z-fresh` · `model_id=cursor-grok-4.6` · `orchestrator_run_id=auto-20260912-us0133`

## Task execution order

1. T-anch (NO-OP / verification)
2. T-001 (`standalone/` workspace + kit `files` omit-guard)
3. T-002 (pin Pi SDK 0.85.1)
4. T-003 (AgentKernel mapping + owned types)
5. T-004 (isolation loader + `PI_COMPAT_RESOURCES=off`)
6. T-005 (custom-tool factory `itsm_ping` + `noTools: "builtin"`)
7. T-006 (import-boundary lint + grep)
8. T-007 (10 `test_us0133_*` incl. planted-extension fixture + fake-model event order)
9. T-008 (CI Windows/Linux `working-directory: standalone`)
10. T-009 (`standalone/docs/phase0-kernel-spike.md` go/no-go)
11. Integration verification

## Critic NB awareness (execute)

- **T-004 / T-005 / T-007** (`us0133asc-challenger-001` NB1): R2 planted `.pi/extensions`+`AGENTS.md` fixture; R3 fake `Model` inject (fallback in T-009); R6 kit `files` omit-guard. Trusted still uses empty loader (US-0137).
- **T-anch..T-009** (`us0133asc-architect-002` NB2): keep 1:1 architecture seeds; sprint folder is **S0137** not S0133; execute owns `standalone/` bootstrap + tests; KernelBridge/ToolBroker out.
- **T-anch** (`us0133asc-subtractor-003` NB3): verification-only; do not rewrite `# US-0133` / DEC-0133 / R-0121; Phase 0 items 1/2/3/5 only; reject A2–A5 + §30 stub farm; do not mark DONE; do not wipe R-0120; do not reopen BUG-0018.

## Task checklist

- [x] **T-anch**: Verify `# US-0133` H1 in `docs/engineering/architecture.md`; DEC-0133 Accepted; approach A1 LOCKED; R-0121 DQ1–DQ10 LOCKED; 10-marker table locked; compose guards (kit `files` omit; US-0134/0137 out; BUG-0018 DONE; R-0120 intact); verify `tests/us0133_*` and `standalone/` do NOT yet exist (or document baseline). Record to `sprints/S0137/t-anch-verification.md`. NO mutation to `architecture.md` / `decisions/DEC-0133.md` / `docs/engineering/research.md` R-0121 in /execute. (DC / architecture baseline; NO-OP)

- [x] **T-001**: Create in-tree `standalone/` independent npm workspaces root. `standalone/package.json`: `private: true`, unpublished code name (suggested `@its-magic/standalone` — **do not** reuse npm name `its-magic`; **do not** lock public branding), `engines.node >=22.19.0`, workspaces for `apps/*` + `packages/*`, scripts `typecheck` / `lint` / `format` / `test`. Biome + `tsc --noEmit`. Stub `standalone/apps/cli` (code-name bin `itsm`; no workflow / no ToolBroker). Skeleton `standalone/packages/pi-kernel`. Dirs `standalone/tests/{unit,contract}`. Do **not** add `standalone/` to kit root `package.json` `workspaces`. Kit `files` must omit `standalone/`. Extend `guard_installer_publish.py` fail-closed if `standalone` appears in kit `files` or published tarball inventory. Tests: markers 1, 2. (AC-1)

- [x] **T-002**: Pin exact `@earendil-works/pi-coding-agent@0.85.1` and `@earendil-works/pi-ai@0.85.1` in `standalone/` (workspace or `pi-kernel` package — Pi imports only inside `pi-kernel`). Node engine `>=22.19.0`. Tests: marker 3. (AC-1, AC-6)

- [x] **T-003**: Implement owned types in `packages/pi-kernel` per DEC-0133 §4: `AgentKernel.createSession`, `KernelSession.{run,steer,abort,dispose,getRuntimeInfo,subscribe,sessionId}`, `KernelRuntimeInfo`, `KernelEvent` (`agent_start` / `tool_execution_start` / `tool_execution_end` / `agent_end`). Map inside `pi-kernel` only: `createSession` → `createAgentSession`; `run` → `session.prompt`; `steer` → `session.steer`; extra Pi events may be ignored. `apps/cli` imports **only** these types — never Pi modules. Tests: marker 4. (AC-2)

- [x] **T-004**: Production isolation loader (DEC-0133 §5): inject `DefaultResourceLoader` with empty overrides (`agentsFilesOverride` / `skillsOverride` / `promptsOverride` yield empty; no `additionalExtensionPaths` / `extensionFactories`); loader `cwd`/`agentDir` = runtime-owned empty dir (not `~/.pi/agent`, not the target project). Product flag `PI_COMPAT_RESOURCES` default **`off`**. `trusted` is an explicit option recorded on `KernelRuntimeInfo.isolationMode`. **US-0133 production factory still uses the empty loader even when `trusted`**. Tests: marker 7. (AC-4)

- [x] **T-005**: Production factory: `noTools: "builtin"` + `customTools: [itsm_ping]` + `tools` allowlist includes `itsm_ping`. `SessionManager.inMemory()` for tests. Abort → idle; no further `tool_execution_start`. Placeholder spike tool **`itsm_ping` only**. Full ToolBroker = US-0137. Tests: markers 6, 8. (AC-3)

- [x] **T-006**: Import-boundary enforcement: Biome `noRestrictedImports` on every workspace package except `pi-kernel` **plus** fail-closed grep for `@earendil-works/pi-` outside `standalone/packages/pi-kernel/**`. Tests: marker 5. (AC-2)

- [x] **T-007**: Create contract tests covering **exactly 10** markers:
  1. `test_us0133_standalone_workspace_layout`
  2. `test_us0133_kit_npm_files_omit_standalone`
  3. `test_us0133_pi_packages_pinned_exact`
  4. `test_us0133_agentkernel_methods`
  5. `test_us0133_no_pi_imports_outside_pi_kernel`
  6. `test_us0133_production_session_custom_tools_only`
  7. `test_us0133_default_resource_loader_empty`
  8. `test_us0133_session_id_stable_and_abort`
  9. `test_us0133_audit_event_order_with_fake_model`
  10. `test_us0133_phase0_spike_gng_no_branding`
  Kernel/session tests live in `standalone/tests/contract` (`node:test` + TypeScript; reject vitest/jest). Kit pytest `tests/us0133_contract_test.py` (+ `template/tests/` twin) at least for files-omit + import-boundary grep. Plant fixture `.pi/extensions` + `AGENTS.md` under a temp project cwd; assert production factory still yields empty extensions/agentsFiles (R2). Primary fake-model: inject no-network `Model` into `createAgentSession` (marker 9). Fallback (only if 0.85.1 `Model` cannot be stubbed without I/O): owned event-bridge unit tests for AC-5 order; live SDK still proves sessionId / empty loader / custom-only registry / abort; optional `PI_SPIKE_LIVE=1` is **not** required for GO. Default CI: no credentials, no live provider. (AC-5)

- [x] **T-008**: Add GitHub Actions job matrix **Windows + Linux** for standalone `typecheck` / `lint` / `test` with `working-directory: standalone` and Node `>=22.19.0` (22.x). Do **not** fold standalone tests into kit `TEST_COMMAND` / runbook kit test line. Do not change kit `npm-test` Node 20 job except compose-safe ignore. Tests: marker 1 (CI file present). (AC-1)

- [x] **T-009**: Write `standalone/docs/phase0-kernel-spike.md`. Record exact installed `@earendil-works/pi-coding-agent` + `@earendil-works/pi-ai` versions. GO/NO-GO for Phase 0 items **1, 2, 3, 5** only (bootstrap, pin, adapter + one fresh session, one custom tool with built-ins disabled). Items 4, 6–10 stay later stories. No branding lock. No OS-sandbox claim (cite pi.dev/security). Record which fake-model seam shipped (primary inject vs fallback). Tests: marker 10. (AC-6)

## Integration verification (post T-009)

- [x] Test gate: standalone `node --test` contract suite + `python -m pytest tests/us0133*.py -v` → 10/10 markers PASS
- [x] Kit publish gate: `standalone/` absent from `package.json` `files` and tarball inventory; guard fail-closed
- [x] Import-boundary gate: no `@earendil-works/pi-` outside `standalone/packages/pi-kernel/**`
- [x] Scope gate: no KernelBridge; no ToolBroker catalog; no OS-sandbox claim; no branding lock; no §30 stub farm; no live provider CI; no vitest/pnpm/bun
- [x] Status gate: US-0133 remains OPEN; AC checkboxes unchecked; intake JSON not mutated; BUG-0018 not reopened; R-0120 not wiped

## Files to touch (scope)

### New (create)

- `standalone/package.json` + workspace config (Biome, tsconfig, lockfile as needed)
- `standalone/apps/cli` stub
- `standalone/packages/pi-kernel` AgentKernel
- `standalone/tests/{unit,contract}`
- `standalone/docs/phase0-kernel-spike.md`
- `tests/us0133_contract_test.py` + `template/tests/us0133_contract_test.py`
- CI job for standalone (`.github/workflows/ci.yml` additive job — do not fold into kit TEST_COMMAND)
- `sprints/S0137/t-anch-verification.md` (execute)

### Edit (scoped)

- `scripts/guard_installer_publish.py` (+ template if paired) — fail-closed omit `standalone/` from kit `files` / tarball
- Kit `package.json` — verify `files` omits `standalone/`; do **not** add workspaces
- `.github/workflows/ci.yml` — additive Windows+Linux standalone job (Node 22)

### Verify read-only (no mutation)

- `docs/engineering/architecture.md # US-0133`
- `decisions/DEC-0133.md`
- `docs/engineering/research.md ## R-0121` (and R-0120 intact)
- `docs/product/backlog.md ## US-0133` Status/ACs (US-0045)
- `docs/product/acceptance.md` US-0133 row
- `handoffs/intake_evidence/US-0133-0148-intake-20260911.json`
- Kit OpenCode/Cursor packs; BUG-0018 surfaces

### Compose-guard UNCHANGED (DO NOT TOUCH)

| File / surface | Reason |
|---|---|
| Backlog Status / AC checkboxes | US-0045 — closure only |
| `architecture.md` body beyond T-anch verify | locked in /architecture |
| `decisions/DEC-0133.md` body | locked in /architecture |
| R-0121 / R-0120 | do not rewrite; do not wipe R-0120 |
| Kit `package.json` `workspaces` | kit is not a workspace root |
| Kit `files` whitelist expansion | omit `standalone/` |
| US-0134 KernelBridge | later story |
| US-0137 ToolBroker / policy | later story |
| US-0135..US-0148 bodies | OUT OF SCOPE |
| BUG-0018 / OpenCode `/auto` | DONE — do not reopen |
| Live provider / `PI_SPIKE_LIVE` as AC-5 gate | forbidden |
| OS-sandbox claim / public branding lock | forbidden |

## AC → Task surjective coverage

| AC | Task(s) |
|---|---|
| AC-1 | T-001, T-002, T-008 |
| AC-2 | T-003, T-006 |
| AC-3 | T-005 |
| AC-4 | T-004 |
| AC-5 | T-007 |
| AC-6 | T-002, T-009 |
| DC / architecture | T-anch |

**Surjectivity check**: 6/6 ACs covered. No `PLAN_AC_COVERAGE_GAP`.
