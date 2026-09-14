# Sprint S0149 - Task checklist (US-0141)

Total tasks: 11 (T-anch + T-001..T-010). SPRINT_MAX_TASKS=12; SPRINT_AUTO_SPLIT=1; no split. T-anch retained as NO-OP verification. Seeds 1:1 from `docs/engineering/architecture.md` `# US-0141`. Sprint id S0149 (next free after S0148 occupied by BUG-0023). Do not overwrite S0140–S0148. Do not reuse S0146 (BUG-0021), S0147 (US-0140), or S0148 (BUG-0023).

**Isolation**: `tl-US0141-sprintplan-20260914T005000Z-fresh` · `model_id=cursor-grok-4.6-high` · `orchestrator_run_id=auto-20260913-us0141`

## Task execution order

1. T-anch (NO-OP / verification)
2. T-001 (`packages/app-runtime` + Pi-import grep + runtime-core compose)
3. T-002 (`process_handles` additive schema + ProcessManager)
4. T-003 (`ExecutionBackend` local+docker CLI-first + `health_check`)
5. T-004 (WSL + SSH/remote-docker adapters + connectivity diagnostics)
6. T-005 (stack profiles Node/Python/Go/Java/.NET + unknown fail/fallback)
7. T-006 (bounded self-debug + `APP_RUNTIME_RESTART_MAX` + fresh DEV slot)
8. T-007 (test/build evidence + log summarize)
9. T-008 (Connect handoff no browser + cleanup/orphan reap)
10. T-009 (chaos fixtures fake backends)
11. T-010 (12 `test_us0141_*` Win/Linux fake-model)
12. Integration verification

## Critic NB awareness (execute)

- **T-003/T-004/T-006/T-009/T-010** (`us0141arc-challenger-001` NB1): fail-closed `BACKEND_*` / `APP_RUNTIME_*` / `PROCESS_*` locked DEC-0141. HEALTHCHECK status-only; AppRuntime owns restart. Unknown backend is **not** local fallback. Never read `.env`. US-0142 browser OUT. `compute_strict_proof_hash` tuple unamended.
- **T-anch..T-010** (`us0141arc-architect-002` NB2): keep 1:1 architecture seeds; sprint folder is S0149 (S0148 occupied by BUG-0023); execute owns `@its-magic/app-runtime` + additive `process_handles` + 12 tests; architecture owns H1+DEC-0141; compose US-0140 RunsStore; do not rewrite workflow/GateEngine; US-0142 browser OUT; US-0143 drain OUT.
- **T-anch** (`us0141arc-subtractor-003` NB3): verification-only; do not rewrite `# US-0141` / DEC-0141 / R-0138; reject A2–A14; do not amend isolation/`noTools`/KernelBridge/auth-models/PolicyEngine tables/RoleCatalog internals/config loaders; do not mark DONE; do not reopen US-0133..US-0140; do not design US-0142+; do not own credentials or read `.env`; do not mutate BUG-0021/0022/0023 or S0146/S0147/S0148; 12 markers required.

## Task checklist

- [x] **T-anch**: Verify `# US-0141` H1 in `docs/engineering/architecture.md`; DEC-0141 Accepted; approach A1 LOCKED; R-0138 DQ1–DQ10 LOCKED; 12-marker table locked; compose guards (US-0140 `process_handles` additive consume; US-0138 `APP_RUNTIME_RESTART_MAX` consume-only; US-0137 PolicyEngine tables unamended; US-0136 SessionSupervisor inject only; US-0135 credentials OUT; KernelBridge unamended; isolation/`noTools` unamended; kit `files` omit `standalone/`; US-0142+ out; US-0133..US-0140 DONE; BUG-0021 DONE not mutated; BUG-0022 OPEN not mutated; BUG-0023 OPEN not mutated; S0146/S0147/S0148 not reused; R-0120..R-0138 intact; R-0137 remains BUG-0023). Verify `standalone/packages/app-runtime` and `test_us0141_*` do NOT yet exist (or document baseline). Record to `sprints/S0149/t-anch-verification.md`. NO mutation to `architecture.md` / `decisions/DEC-0141.md` / `docs/engineering/research.md` R-0138 in /execute. (DC / architecture baseline; NO-OP)

- [x] **T-001**: Create `standalone/packages/app-runtime`. `package.json`: name `@its-magic/app-runtime`, `private: true`, `version: 0.0.0`, `type: module`, `engines.node >=22.19.0`, export `./src/index.ts`. Workspaces glob `packages/*` already includes it. Contains: `AppRuntime` facade (§19.2), `ProcessManager` (§19.3), `ExecutionBackend` interface + adapters (§19.4), stack profiles, bounded self-debug (§19.5). **No Pi imports.** `package.json` must not depend on `@earendil-works/pi-*`. Type-only / public-API imports from `@its-magic/runtime-core`, `@its-magic/role-runtime`, `@its-magic/policy-engine`, `@its-magic/config` are allowed. Those packages **do not** import app-runtime internals. Extend the US-0133..US-0140 grep to deny Pi inside `packages/app-runtime`. Do **not** nest AppRuntime inside `runtime-core/workflow/` or GateEngine. Do not add a Biome override. Kit `files` omit `standalone/`. Do not add standalone to kit workspaces. Do not create sibling `packages/execution-runtime` or `packages/dev-environment`. Tests: marker 1 (owned by T-010). (AC-1)

- [x] **T-002**: Additive schema extend of US-0140 `process_handles` (keep `id`, `run_id`, `reserved`). Add LOCKED columns: `phase_id`, `backend`, `identity_kind` (`process` \| `container` \| `service`), `identity`, `command`, `cwd`, `ports_json`, `url`, `readiness`, `started_at`, `crash_count`, `restart_count`, `log_ring_ref`. ProcessManager writes via new `RunsStore` public methods `upsertProcessHandle` / `listProcessHandlesForRun`. Workflow `reserveProcessHandle` remains a **claim token**; AppRuntime fills the row. Log files under gitignored `.its-magic/runtime/logs/` + in-memory ring default **256 lines**; SQLite stores **refs**, not megabyte BLOBs. Compose US-0140 gitignore analog `**/.its-magic/runtime/`. Reject a second SQLite file. Reject SQLite as DONE/backlog authority. Tests: marker 2. (AC-2)

- [x] **T-003**: `ExecutionBackend` interface LOCKED: `name()`, `execute()`, `health_check()`. Core v1: `local` + `docker` (`docker-local`) via Node `child_process.spawn` (local) + CLI-first `docker` / `docker compose` spawn (docker). Thin `DockerClient` so dockerode can swap later; **do not require dockerode** v1. Connectivity `health_check` before execute. Missing docker binary/daemon → fail-closed `BACKEND_DOCKER_UNAVAILABLE` / `BACKEND_UNAVAILABLE` — **not** silent local fallback. Do not overload `REMOTE_*` / `DEV_ENV_*` / `RELEASE_*` / `WORKFLOW_*` as the primary AppRuntime family. Tests: marker 3. (AC-3)

- [x] **T-004**: Typed adapters: `wsl` (`wsl.exe -d <distro> [--cd <linuxCwd>] -- <cmd>` + `wslpath`) and `ssh` / `remote-docker` (`ssh -o BatchMode=yes -o ConnectTimeout=5` and/or `docker --context` / `DOCKER_HOST=ssh://`; key auth, known_hosts; password SSH unsupported). Missing binary / distro / SSH → fail-closed `BACKEND_WSL_UNAVAILABLE` / `BACKEND_SSH_UNAVAILABLE` / `BACKEND_CONNECTIVITY_FAILED` / `BACKEND_TIMEOUT`. Unsupported backend (micro-VM stub) → `BACKEND_UNSUPPORTED`. Compose US-0086 `remote.json` / `REMOTE_*` as **input target selection** only. Tests: marker 4. (AC-3)

- [x] **T-005**: Port `uat_probe_lib.detect_stack_profile` semantics into TypeScript (do **not** spawn Python; do **not** rewrite the Python lib). Order LOCKED: `package.json` → `node`; `pyproject.toml`/`setup.py` → `python`; `go.mod` → `go`; `*.csproj` → `dotnet`; `pom.xml` → `java`. Unknown stack → fail-closed `APP_RUNTIME_UNSUPPORTED_STACK` **unless** operator override `DEV_SERVER_COMMAND` / profile `start_command` is present. `generated` README heuristic stays kit-side. Consume `.cursor/dev-environment.json` + Connect field names as **input**; AppRuntime **owns execution**. Tests: marker 5. (AC-4)

- [x] **T-006**: AppRuntime-owned remediation loop: capture logs → classify (`start_failed` \| `health_failed` \| `crash` \| `timeout` \| `connectivity` \| `unsupported_stack` \| `unsupported_backend`) → optional **fresh DEV** session (`SessionSupervisor.spawn`, compose US-0136; do not rewrite supervisor) → rebuild/restart → stop at cap with `APP_RUNTIME_RESTART_CAP_EXHAUSTED`. Cap source: default **3**; override `APP_RUNTIME_RESTART_MAX` from resolved config/scratchpad if present. **No new RuntimeConfig domain.** Orthogonal to execute↔QA `AUTO_IMPLEMENTATION_LOOP` (do not share the same counter). Docker HEALTHCHECK is a **health signal only**; AppRuntime **owns** restart. Daemon `--restart` is not the remediation owner. Reject unbounded restart; reject PM2/forever as ProcessManager. Tests: marker 6. (AC-5)

- [x] **T-007**: Every test/build/start command through `ExecutionBackend.execute` persists §21.2 JSON: `{ command, backend, exit_code, duration_ms, stdout_ref, stderr_ref }` plus `reason_code?`. Large logs: full files on disk; **summarize** (head/tail + error-line extract, default model budget **8 KiB**). In-memory ring default **256 lines**; file refs in `process_handles.log_ring_ref`. Tests: marker 7. (AC-6)

- [x] **T-008**: Expose `url` / `ports` / `health` / `health_path` using US-0098 Connect **field names** (`connect_endpoint`, `health_path`, `service_id`, `container_id`, `env_refs` names-only). **US-0142 consumes**; this story does **not** drive Playwright/CDP. Never read `.env` (US-0085); redact Authorization/Cookie in logs (compose US-0135 `redact.ts` / US-0137). `ProcessManager.stop` after success, failure, cancellation (`AbortSignal`), and **runtime restart**. Compose US-0140 `discardOrphans` for **sessions**; AppRuntime **reaps process/container orphans** (`PROCESS_ORPHAN_REAPED`) — workflow does not kill apps. Health probes: TCP listen and/or HTTP GET `health_path` with timeout; process-alive is insufficient. Tests: markers 8, 9. (AC-7)

- [x] **T-009**: Chaos fixtures with **fake** backends covering: local web app crash, timeout, restart; Docker stack (fake docker client); remote disconnect (fake). Assert fail-closed reason codes (`PROCESS_CRASHED`, `BACKEND_TIMEOUT`, `APP_RUNTIME_RESTART_CAP_EXHAUSTED`, `BACKEND_CONNECTIVITY_FAILED`, `BACKEND_DOCKER_UNAVAILABLE`). Do **not** require live Docker/WSL/SSH in default CI. Tests: markers 10, 11. (AC-8)

- [x] **T-010**: Create contract tests covering exactly 12 markers (DEC-0141 §12). Primary: `standalone/tests/contract` (`node:test`) Windows + Linux. Fake-model CI. In-memory SQLite. Fake `ExecutionBackend`. No paid model calls. No required live Docker daemon (unavailable codes asserted, not skipped). Count stays 12.
  1. `test_us0141_app_runtime_lifecycle`
  2. `test_us0141_process_manager_identity`
  3. `test_us0141_backend_local_docker_core`
  4. `test_us0141_backend_wsl_ssh_adapters`
  5. `test_us0141_stack_profiles`
  6. `test_us0141_self_debug_cap`
  7. `test_us0141_test_build_evidence`
  8. `test_us0141_connect_handoff_no_browser`
  9. `test_us0141_cleanup_success_fail_cancel`
  10. `test_us0141_chaos_crash_timeout_restart`
  11. `test_us0141_chaos_docker_remote_disconnect`
  12. `test_us0141_unsupported_backend` — fail-closed `BACKEND_UNSUPPORTED` (not local fallback)
  Do not weaken `test_us0133_*` / `test_us0134_*` / `test_us0135_*` / `test_us0136_*` / `test_us0137_*` / `test_us0138_*` / `test_us0139_*` / `test_us0140_*`. (AC-1..AC-8)

## Integration verification (post T-010)

- [x] Test gate: standalone npm test covers 12/12 `test_us0141_*` plus compose us0133..us0140 still green
- [x] Import-boundary gate: no Pi imports in `packages/app-runtime`; kit `files` omit `standalone/`
- [x] Isolation gate: AgentKernel empty loader / `noTools` builtin / KernelBridge / auth-models store / PolicyEngine tables / RoleCatalog internals / config loaders unamended; fake-model CI held; DEC-0038 tuple unamended
- [x] Scope gate: no credentials / `.env` reads; no Playwright/CDP; no `/auto`/`/quick` drain; no dockerode required; no US-0142+ authoring; no sibling `packages/execution-runtime`; no second SQLite
- [x] Status gate: US-0141 remains OPEN; AC-1..AC-8 unchecked; intake JSON not mutated; US-0133..US-0140 remain DONE; BUG-0021/BUG-0022/BUG-0023 not mutated; S0146/S0147/S0148 not mutated

## Files to touch (scope)

### New (create)

- `standalone/packages/app-runtime/` (`package.json`, `src/index.ts`, AppRuntime / ProcessManager / ExecutionBackend / stack profiles / self-debug)
- `standalone/tests/contract` `test_us0141_*` (`node:test`)
- `sprints/S0149/t-anch-verification.md` (execute)

### Edit (scoped)

- existing US-0133..US-0140 Pi-import grep — extend to `packages/app-runtime`
- `standalone/packages/runtime-core` `RunsStore` public methods `upsertProcessHandle` / `listProcessHandlesForRun` (additive columns; do **not** rewrite workflow/GateEngine)
- `.gitignore` analog `**/.its-magic/runtime/` (already present from US-0140 — confirm logs path)
- `.github/workflows/ci.yml` — extend existing standalone Windows+Linux job only if glob would miss new tests

### Compose-guard UNCHANGED (DO NOT TOUCH)

| File / surface | Reason |
|---|---|
| Backlog Status / AC checkboxes | US-0045 — closure only |
| `architecture.md` / `DEC-0141.md` | locked in /architecture |
| PolicyEngine decision tables | Layer B profiles only; tables unamended |
| KernelBridge / isolation / `noTools` | unamended |
| RoleCatalog internals | inject spawn only |
| config loaders | consume `APP_RUNTIME_RESTART_MAX` only |
| DEC-0038 tuple | UNAMENDED |
| Playwright / CDP / browser UAT | US-0142 OUT |
| `/auto` / `/quick` drain | US-0143 OUT |
| US-0142..US-0148 | OUT OF SCOPE |
| US-0133..US-0140 / S0147 | DONE — do not reopen |
| S0146 / BUG-0021 | DONE — do not mutate |
| S0148 / BUG-0023 | OPEN — do not mutate |
| BUG-0022 | OPEN — do not mutate |
| `.env` / credentials | never read |
| `.opencode/commands/auto.md` restore | forbidden |

## AC → Task surjective coverage

| AC | Task(s) |
|---|---|
| AC-1 | T-001 (T-010 m1) |
| AC-2 | T-002 (T-010 m2) |
| AC-3 | T-003, T-004 (T-010 m3, m4) |
| AC-4 | T-005 (T-010 m5) |
| AC-5 | T-006 (T-010 m6) |
| AC-6 | T-007 (T-010 m7) |
| AC-7 | T-008 (T-010 m8, m9) |
| AC-8 | T-009, T-010 m10–m12 |
| DC / architecture | T-anch |

**Surjectivity check**: 8/8 ACs covered. T-010 markers attest AC-1..AC-8. No `PLAN_AC_COVERAGE_GAP`.
