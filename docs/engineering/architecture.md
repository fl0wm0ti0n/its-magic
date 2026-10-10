
# BUG-0009: Downstream-safe template CI vs kit-internal active CI
Archived body in pack_ref: docs/engineering/architecture-archive/architecture-pack-20260913-j.md

# US-0091 — README ↔ backlog feature coverage backfill + blocking drift gate
Archived body in pack_ref: docs/engineering/architecture-archive/architecture-pack-20260913-i.md

# US-0093 — Cursor browser-integrated UAT self-test
Archived body in pack_ref: docs/engineering/architecture-archive/architecture-pack-20260913-i.md

# US-0109 — Self-Healing Deploy Loop (post-deploy smoke probe + bounded retry + DEPLOY_DEFERRED)
Archived body in pack_ref: docs/engineering/architecture-archive/architecture-pack-20260824.md

# BUG-0010 — Dual-level architecture story headings and diff-gated H1 enforcement
Archived body in pack_ref: docs/engineering/architecture-archive/architecture-pack-20260628.md

# BUG-0011 — Caveman voice-compression rules missing from caveman.mdc
Archived body in pack_ref: docs/engineering/architecture-archive/architecture-pack-20260628-a.md

# BUG-0012 — Native-chain orchestrator compliance regression (post-US-0095)
Archived body in pack_ref: docs/engineering/architecture-archive/architecture-pack-20260628-d.md

# US-0042 — Post-QA release findings workflow
Archived body in pack_ref: docs/engineering/architecture-archive/architecture-pack-20260612-a.md

# US-0089: Cursor Caveman mode (scratchpad-configurable terse responses)
Archived body in pack_ref: docs/engineering/architecture-archive/architecture-pack-20260913-i.md

# US-0090: Caveman input compression

**`US-0090`** adds an optional **input-side** Caveman file-scope compression layer,
orthogonal to the response-side voice owned by `# US-0089` (DEC-0072 §1 three-axis
non-substitution). Binding: **`DEC-0073`**; research **`R-0073`**. Composes on `# US-0089`,
**`US-0053`**, **`US-0085`** (See `# US-0085` for context fresh-context markers), and
**`US-0078`** / **`DEC-0060`** (compressed input must not bypass the intake evidence gate).
2 net-new keys: `CAVEMAN_COMPRESS_INPUT` / `CAVEMAN_FILE_SCOPE` + `CAVEMAN_COMPRESS_SCOPE_EMPTY`.

- Decision: **`DEC-0073`** — Amends: **`DEC-0072`** — Research: **`R-0073`** — Composed: `# US-0089`, **`US-0053`**, **`US-0085`**, **`US-0078`**, **`DEC-0060`**

# US-0141 — Application runtime and pluggable execution backends

## Overview

**US-0141** adds one owned application runtime so operators can discover, start, observe, repair, and clean up real applications across local and Docker (core v1) plus typed WSL/SSH/remote-Docker adapters. New package `@its-magic/app-runtime` never imports Pi. Compose US-0140 `RunsStore.process_handles` **additively** (ProcessManager writes; workflow `reserveProcessHandle` remains a claim token). Do **not** nest AppRuntime inside CommandRouter/GateEngine. AppRuntime **owns** restart; Docker HEALTHCHECK is **status-only**. Browser UAT is **US-0142 OUT**. `/auto`/`/quick` drain is **US-0143 OUT**. OS micro-VM is future (`BACKEND_UNSUPPORTED`). Role-runtime / PolicyEngine / config / KernelBridge / isolation loader stay **unamended**. DEC-0038 `compute_strict_proof_hash` tuple stays **UNAMENDED**. Execute owns package files.

**Research anchor**: **R-0138** (DQ1–DQ10 LOCKED). **Companion DEC**: **DEC-0141** (Accepted — THIS phase). **EARLY_RESEARCH**: consumed from R-0138 (HEALTHCHECK status-only analog; dockerode later-swap only; WSL/`ssh`/`DOCKER_HOST`; Chump backend trait analog — reject unknown→local; `child_process.spawn` AbortSignal) — **no new R-id**. Do not wipe R-0120..R-0138. **R-0137 remains BUG-0023.**

**Fresh context marker**: `tl-US0141-architecture-20260914T003000Z-fresh`
**Orchestrator run id**: `auto-20260913-us0141`
**Timestamp**: 2026-09-14T00:30:00Z (UTC)
**Verdict**: PASS
**Next**: sovereign-critic (architecture), then `/sprint-plan` **S0149** (orchestrator hint S0148 ineligible — BUG-0023 occupies `sprints/S0148/`; S0146=BUG-0021; S0147=US-0140; orchestrator-owned). ultra_lean: plan-verify is **not** in `resolved_phase_plan`. Do **not** spawn sprint-plan or critic from this subagent (BUG-0006).

**baseline_h2_count (pre-mutate)**: `0`

## Approach locked (A1 — from R-0138)

| Option | Summary | Verdict |
|--------|---------|---------|
| **A1** | Sibling `@its-magic/app-runtime` (no Pi) composing `runtime-core` RunsStore; AppRuntime + ProcessManager + CLI-first Docker + WSL/SSH adapters; AppRuntime-owned restart; 12 `test_us0141_*` | **Preferred / LOCKED** — AC-1..AC-8 |
| A2 | Nested `runtime-core/src/runtime/` | **Rejected** — DQ1 / §30 sibling |
| A3 | Two packages `execution-runtime` + `dev-environment` | **Rejected** — YAGNI v1 |
| A4 | dockerode **is** AppRuntime | **Rejected** — adapter, not facade |
| A5 | Kit Python only as the runtime | **Rejected** — standalone TS owns execution |
| A6 | PM2 / forever / systemd as ProcessManager | **Rejected** — extra dep |
| A7 | Docker HEALTHCHECK / `--restart` as remediation owner | **Rejected** — status-only / exit-only |
| A8 | Implement browser UAT here | **Rejected** — US-0142 |
| A9 | Micro-VM / Firecracker v1 | **Rejected** — D9 future |
| A10 | Rewrite workflow / GateEngine / PolicyEngine / config / KernelBridge / `noTools` | **Rejected** — D2/D9 compose |
| A11 | Require live Docker/WSL/SSH in CI | **Rejected** — fake backends |
| A12 | Fold into `tool-broker` | **Rejected** — Layer A ≠ Layer B |
| A13 | Unknown backend → silent local | **Rejected** — AC-8 fail-closed |
| A14 | Second SQLite or better-sqlite3 for processes | **Rejected** — compose DEC-0140 `node:sqlite` |

**Can this be simpler?** Nested runtime-core looks smaller and couples process lifecycle to the workflow engine. Two §30 packages double npm/test surface. dockerode adds a socket client we can avoid by spawning `docker`. A1 is the simplest design that meets AC-1..AC-8.

### Locked surfaces (DEC-0141)

1. **Package**: `@its-magic/app-runtime` (`standalone/packages/app-runtime`). npm name **LOCKED** `app-runtime` (not `execution-runtime`). `private: true`, `version: 0.0.0`, `type: module`, `engines.node >=22.19.0`, export `./src/index.ts`. **No Pi dependency.** Type-only / public-API imports from `@its-magic/runtime-core`, `@its-magic/role-runtime`, `@its-magic/policy-engine`, `@its-magic/config` allowed. Those packages **do not** import app-runtime internals. Extend US-0133..0140 Pi-import grep to this package. No Biome override. Kit `files` omit `standalone/`. Do not add standalone to kit workspaces. **Execute owns package creation.**
2. **Compose, do not reimplement**: depend on `RunsStore` public API. Do **not** put AppRuntime inside `runtime-core/workflow/` or GateEngine. Do **not** rewrite CommandRouter, WorkflowEngine, GateEngine, or crash-resume DONE authority.
3. **`process_handles` additive** (AC-2): keep `id`, `run_id`, `reserved`. Add **LOCKED** columns: `phase_id`, `backend`, `identity_kind` (`process`\|`container`\|`service`), `identity`, `command`, `cwd`, `ports_json`, `url`, `readiness`, `started_at`, `crash_count`, `restart_count`, `log_ring_ref`. ProcessManager writes via `upsertProcessHandle` / `listProcessHandlesForRun`. Log files under `.its-magic/runtime/logs/` + in-memory ring **256** lines; SQLite stores refs.
4. **ExecutionBackend** (AC-3): `name()` / `execute()` / `health_check()`. Core v1: `local` + `docker` (`docker-local`) via `child_process.spawn` + CLI-first `docker`/`docker compose`. Thin `DockerClient` (dockerode later-swap, not required). Typed adapters: `wsl` (`wsl.exe -d <distro> [--cd <linuxCwd>] -- <cmd>` + `wslpath`) and `ssh`/`remote-docker` (`ssh -o BatchMode=yes -o ConnectTimeout=5` and/or `docker --context` / `DOCKER_HOST=ssh://`; key auth; password SSH unsupported). Micro-VM stub → `BACKEND_UNSUPPORTED`. `health_check` before execute. Missing binary/daemon/distro/SSH → fail-closed, not local fallback.
5. **Reason codes LOCKED**: `APP_RUNTIME_PROFILE_UNKNOWN`, `APP_RUNTIME_START_FAILED`, `APP_RUNTIME_HEALTH_FAILED`, `APP_RUNTIME_RESTART_CAP_EXHAUSTED`, `APP_RUNTIME_UNSUPPORTED_STACK`, `APP_RUNTIME_CLEANUP_FAILED`; `BACKEND_UNKNOWN`, `BACKEND_UNAVAILABLE`, `BACKEND_DOCKER_UNAVAILABLE`, `BACKEND_WSL_UNAVAILABLE`, `BACKEND_SSH_UNAVAILABLE`, `BACKEND_UNSUPPORTED`, `BACKEND_CONNECTIVITY_FAILED`, `BACKEND_TIMEOUT`; `PROCESS_CRASHED`, `PROCESS_ORPHAN_REAPED`. Do not overload `REMOTE_*` / `RELEASE_*` / `WORKFLOW_*` / `DEV_ENV_*` as the primary family.
6. **Stack profiles** (AC-4): port `detect_stack_profile` into TS (do not spawn Python). Order: `package.json`→`node`; `pyproject.toml`/`setup.py`→`python`; `go.mod`→`go`; `*.csproj`→`dotnet`; `pom.xml`→`java`. Unknown → `APP_RUNTIME_UNSUPPORTED_STACK` unless `DEV_SERVER_COMMAND` / `start_command` override.
7. **Bounded self-debug** (AC-5): capture → classify (`start_failed`\|`health_failed`\|`crash`\|`timeout`\|`connectivity`\|`unsupported_stack`\|`unsupported_backend`) → optional fresh DEV (`SessionSupervisor.spawn`) → rebuild/restart → cap. Cap **`APP_RUNTIME_RESTART_MAX` default 3** from resolved config/scratchpad if present. **No new RuntimeConfig domain.** Orthogonal to `AUTO_IMPLEMENTATION_LOOP`. HEALTHCHECK is status-only; AppRuntime owns restart.
8. **Evidence** (AC-6): `{ command, backend, exit_code, duration_ms, stdout_ref, stderr_ref, reason_code? }`. Summarize large logs (head/tail + error lines, **8 KiB** model budget).
9. **Connect + cleanup** (AC-7): expose `url`/`ports`/`health`/`health_path` using US-0098 names (`connect_endpoint`, `health_path`, `service_id`, `container_id`, `env_refs` names-only). US-0142 consumes; **no Playwright/CDP**. Never read `.env`. Redact Authorization/Cookie. `ProcessManager.stop` after success/failure/cancellation/runtime restart. AppRuntime reaps process/container orphans (`PROCESS_ORPHAN_REAPED`); workflow `discardOrphans` remains sessions-only. Health: TCP listen and/or HTTP GET `health_path`; process-alive is insufficient.
10. **Layer B profiles**: `trusted_local`→`local`, `isolated_dev`→`docker`. `untrusted_repo` sandbox → `BACKEND_UNSUPPORTED`. Optional ToolBroker `itsm_app_*` unstub is a **seed**.
11. **OUT**: US-0142 browser; US-0143 drain; micro-VM; restore `.opencode/commands/auto.md`; kit `cli.json`; plugin-local `its-magic-auto/tui.json`; npm-publish; git push; rewrite of US-0136..0140 packages.
12. **Tests**: 12 `test_us0141_*`; Win+Linux; fake-model CI; in-memory SQLite; fake backends. Count stays 12.

### Critic NB closures (research us0141res-* — informational)

| NB | Closure |
|----|---------|
| NB1 proof MATCH; R-0138 not R-0137; Status OPEN; R-0137 BUG-0023 not wiped (`us0141res-challenger-001`) | LOCKED this H1 + DEC-0141; Status OPEN; ACs unchecked |
| NB2 `/architecture` owns `# US-0141` + DEC-0141 Accepted; A1 compose `process_handles`; US-0142 browser OUT; US-0143 drain OUT (`us0141res-architect-002`) | LOCKED this H1 + DEC-0141; T-001..T-008 |
| NB3 no app-runtime code; no DONE; 11 tasks ≤ 12; no `/architecture` spawn from critic (`us0141res-subtractor-003`) | Held — T-anch; Status OPEN; execute owns package; do not spawn `/sprint-plan` from this subagent |

## Components

### `app-runtime` package (AC-1..AC-8)

- Facade `AppRuntime` + `ProcessManager` + `ExecutionBackend` adapters + stack profiles + bounded self-debug
- Grep denies `@earendil-works/pi-` inside the package

### ProcessManager + RunsStore compose (AC-2)

- Additive `process_handles`; claim token vs filled row; log ring refs

### ExecutionBackend (AC-3)

- local + docker CLI-first core; WSL + SSH/remote-Docker typed adapters; fail-closed `BACKEND_*`

### Stack profiles (AC-4)

- Node/Python/Go/Java/.NET; unknown fail/fallback

### Bounded remediation (AC-5)

- AppRuntime-owned restart; `APP_RUNTIME_RESTART_MAX` default 3; HEALTHCHECK status-only

### Evidence + Connect (AC-6, AC-7)

- Structured test/build JSON + 8 KiB summarize; Connect handoff names; no browser; orphan reap

### Contract tests (AC-1..AC-8)

- Twelve markers (DEC-0141 §12). Kernel tests: `standalone/tests/contract`. Matrix Windows + Linux.

## Companion DEC = DEC-0141 (Required → Accepted)

Authored Accepted in THIS phase at `decisions/DEC-0141.md`. Locks A1, package, schema, backends, reason codes, cap, markers, seeds.

## Risks finalized (R1–R6 from R-0138)

- **R1 (MEDIUM)** Live Docker/WSL/SSH absent on CI hosts → DQ8 fake backends; unavailable codes asserted, not skipped
- **R2 (MEDIUM)** Operators treat US-0098 JSON or HEALTHCHECK as the owner → D3/DQ5; runtime owns execution; tests 3/6
- **R3 (LOW)** Log files leak secrets → names-only env; redact compose US-0135/0137; never read `.env`
- **R4 (MEDIUM)** Orphan processes after runtime crash → DQ7 reap + test 9; compose `discardOrphans` for sessions only
- **R5 (LOW)** npm name bikeshed `app-runtime` vs `execution-runtime` → this H1 pins `app-runtime`
- **R6 (LOW)** ToolBroker `itsm_app_*` scope creep → optional seed; PolicyEngine tables unamended

## Compose, do not amend (verified)

| Story / DEC | Surface | Verification |
|-------------|---------|--------------|
| US-0140 / DEC-0140 / R-0135 | `RunsStore.process_handles` + workflow/GateEngine | ✓ additive schema; workflow not rewritten |
| US-0138 / DEC-0138 / R-0130 | resolved config/scratchpad | ✓ consume `APP_RUNTIME_RESTART_MAX`; no new domain |
| US-0137 / DEC-0137 / R-0129 | PolicyEngine Layer A | ✓ consume path/shell; Layer B profiles only |
| US-0136 / DEC-0136 / R-0128 | SessionSupervisor `spawn` | ✓ fresh DEV slot; internals unamended |
| US-0135 / DEC-0135 / R-0127 | `redact.ts` / credentials | ✓ never read `.env`; redact logs |
| US-0098 / R-0085 | Connect field names | ✓ input; AppRuntime owns execution |
| US-0086 / R-0068 / DEC-0070 | `remote.json` / `REMOTE_*` | ✓ input routing, not AppRuntime codes |
| US-0065 | `detect_stack_profile` | ✓ port semantics; Python lib unamended |
| US-0085 | `.env` deny | ✓ never read |
| US-0056 / DEC-0038 | `compute_strict_proof_hash` tuple | ✓ UNAMENDED |
| Kit npm `its-magic` / DEC-0120 | `files` whitelist | ✓ omit `standalone/` |
| US-0142..US-0148 | later capabilities | ✓ OUT OF SCOPE (US-0142 browser; US-0143 drain) |
| BUG-0021 / R-0134 | OpenCode CLI TUI `/auto` listing | ✓ DONE; not mutated (`sprints/S0146/`) |
| BUG-0022 / R-0133 | (open bug) | ✓ OPEN; not mutated |
| BUG-0023 / R-0137 | OpenCode CLI TUI dispatch | ✓ OPEN; not mutated (`sprints/S0148/` occupied) |
| R-0120..R-0138 | prior research | ✓ not wiped (R-0136/R-0137 intact) |

## Sprint seeds (11 tasks within SPRINT_MAX_TASKS=12 — for `/sprint-plan` expected S0149)

- **T-anch** (`# US-0141` H1 + DEC-0141 Accepted — RESOLVED in THIS phase; NO-OP / verification)
- **T-001** (AC-1 — `packages/app-runtime` + Pi-import grep + runtime-core compose)
- **T-002** (AC-2 — `process_handles` additive schema + ProcessManager)
- **T-003** (AC-3 — `ExecutionBackend` local+docker CLI-first + `health_check`)
- **T-004** (AC-3 — WSL + SSH/remote-docker adapters + connectivity diagnostics)
- **T-005** (AC-4 — stack profiles Node/Python/Go/Java/.NET + unknown fail/fallback)
- **T-006** (AC-5 — bounded self-debug + `APP_RUNTIME_RESTART_MAX` + fresh DEV slot)
- **T-007** (AC-6 — test/build evidence + log summarize)
- **T-008** (AC-7 — Connect handoff no browser + cleanup/orphan reap)
- **T-009** (AC-8 — chaos fixtures fake backends)
- **T-010** (AC-1..AC-8 — 12 `test_us0141_*` Win/Linux fake-model)

AC surjection: AC-1→T-001 (T-010 m1); AC-2→T-002 (T-010 m2); AC-3→T-003,T-004 (T-010 m3,m4); AC-4→T-005 (T-010 m5); AC-5→T-006 (T-010 m6); AC-6→T-007 (T-010 m7); AC-7→T-008 (T-010 m8,m9); AC-8→T-009,T-010 m10–m12. Order: T-anch → T-001 → T-002 → T-003 → T-004 → T-005 → T-006 → T-007 → T-008 → T-009 → T-010. No split (11 ≤ 12). Not `/quick`. Orchestrator hint **S0148 ineligible** (BUG-0023). S0146=BUG-0021, S0147=US-0140. Expected **S0149**. Do **not** write `sprints/S0148/` or `sprints/S0149/` this phase.

## Isolation evidence (US-0048 / DEC-0029)

- `phase_id=architecture`, `role=tech-lead`, `story_id=US-0141`, `sprint_id=none` (pending — sprint-plan owns next unused id), `orchestrator_run_id=auto-20260913-us0141`
- `delivery_mode=ultra_lean`, `macro_phase=plan` (architecture — second canonical phase of `plan` macro)
- `model_id=cursor-grok-4.6-high` (CROSS_MODEL_REVIEW=1 — required on isolation)
- `fresh_context_marker=tl-US0141-architecture-20260914T003000Z-fresh`, `timestamp=2026-09-14T00:30:00Z` (UTC)
- `evidence_ref=docs/engineering/research.md ## R-0138; docs/product/backlog.md ## US-0141; docs/engineering/architecture.md (this # US-0141); decisions/DEC-0141.md; handoffs/resume_brief.md`
- Fresh tech-lead subagent per BUG-0006 / US-0048; no prior chat history. Narrow-read only. No `.env` reads. Status remains OPEN. US-0133..US-0140 DONE compose-only not reopened. BUG-0021 DONE not mutated. BUG-0022/BUG-0023 OPEN not mutated. No US-0142+ authoring. No `/sprint-plan` spawn from this subagent. No `standalone/packages/app-runtime` this phase.
- Prior phase strict proof consumed: `rp-auto-20260913-us0141-research-techlead-20260914T001000Z-US-0141` / `A69F1FF95B60E566C03355AD24DDB7144B005BD78CD3701C1C8D2EBF2DAFAC45` — RUNTIME_PROOF_VALID (independent `compute_strict_proof_hash` MATCH; consume-before-TTL `2026-09-14T00:30:00Z` < `2026-09-14T01:10:00Z`; immutable R-0138). Critic findings us0141res-* informational only (`rp-auto-20260913-us0141-sovereign-critic-techlead-20260914T002000Z-US-0141` / `727DABC442D42CD32D3B216AF014C3797BE09F552688BECA429C2A215E6EF53E`; anti_slop=10; 0 blocking; degraded_mode=false; MATCH before TTL `2026-09-14T01:20:00Z`).
- Sovereign memory: `SOVEREIGN_MEMORY=1`; `build_injection_digest_block` returned `(no sovereign memory entries)` (read-only). No `mistakes.jsonl` write.

## Strict runtime proof (mirror)

- `runtime_proof_id=rp-auto-20260913-us0141-architecture-techlead-20260914T003000Z-US-0141`
- Canonical hashed payload (DEC-0038, `compute_strict_proof_hash` positional): `{"orchestrator_run_id":"auto-20260913-us0141","phase_id":"architecture","proof_issued_at":"2026-09-14T00:30:00Z","proof_ttl_seconds":3600,"role":"tech-lead","runtime_proof_id":"rp-auto-20260913-us0141-architecture-techlead-20260914T003000Z-US-0141"}`
- Isolation extras (not hashed): `delivery_mode=ultra_lean`, `macro_phase=plan`, `model_id=cursor-grok-4.6-high`, `sprint_id=none`, `story_id=US-0141`
- `proof_hash=4B5EBD9D8FF00C4C7CC5CF114B946AFBA684E11998C4C553C59AE5080326A3BF`
- `proof_ttl=2026-09-14T01:30:00Z`
- `hash_recompute_confirmation=true` (compute_strict_proof_hash → 4B5EBD9D8FF00C4C7CC5CF114B946AFBA684E11998C4C553C59AE5080326A3BF; **64 hex** verified)
- Consumed research proof: `rp-auto-20260913-us0141-research-techlead-20260914T001000Z-US-0141` / `A69F1FF95B60E566C03355AD24DDB7144B005BD78CD3701C1C8D2EBF2DAFAC45` — RUNTIME_PROOF_VALID MATCH before TTL `2026-09-14T01:10:00Z`
- Consumed critic proof: `rp-auto-20260913-us0141-sovereign-critic-techlead-20260914T002000Z-US-0141` / `727DABC442D42CD32D3B216AF014C3797BE09F552688BECA429C2A215E6EF53E` — RUNTIME_PROOF_VALID MATCH before TTL `2026-09-14T01:20:00Z`

# US-0142 — Owned browser UAT and evidence runtime

## Overview

**US-0142** adds one owned browser UAT and evidence runtime so QA can execute UI acceptance in isolated Playwright contexts and operator-authorized CDP sessions connected to US-0141 AppRuntime. New package `@its-magic/browser-uat` never imports Pi. Compose US-0141 `ConnectHandoff` / `connectHandoff` **only** (navigate `connect_endpoint`/`url`; probe `health_path`; record `app_runtime_ref`). Do **not** reimplement AppRuntime / ProcessManager / ExecutionBackend. Do **not** nest BrowserUAT inside CommandRouter/GateEngine. Playwright **owns** isolated launch; CDP **disconnects** (does not kill) the operator browser. Default Chrome User Data is **forbidden**. Pixel visual baseline is **OUT**. `/auto`/`/quick` drain is **US-0143 OUT**. Role-runtime / PolicyEngine path-shell tables / config / KernelBridge / isolation loader stay **unamended** except promoting `itsm_browser` from `STUB_TOOLS`. DEC-0038 `compute_strict_proof_hash` tuple stays **UNAMENDED**. Execute owns package files.

**Research anchor**: **R-0139** (DQ1–DQ10 LOCKED). **Companion DEC**: **DEC-0142** (Accepted — THIS phase). **EARLY_RESEARCH**: consumed from R-0139 (Playwright isolation vs CDP attach; Chrome 136+ default-profile CDP block; trace/HAR secret leakage; playwright vs playwright-core; fake driver analog) — **no new R-id**. Do not wipe R-0120..R-0139. **R-0138 remains US-0141. R-0136/R-0137 remain BUG-0023.**

**Fresh context marker**: `tl-US0142-architecture-20260914T035000Z-fresh`
**Orchestrator run id**: `auto-20260913-us0142`
**Timestamp**: 2026-09-14T03:50:00Z (UTC)
**Verdict**: PASS
**Next**: sovereign-critic (architecture), then `/sprint-plan` **S0150** (S0149=US-0141; S0148=BUG-0023; S0147=US-0140; S0146=BUG-0021; live-inventory S0150 unused; orchestrator-owned). ultra_lean: plan-verify is **not** in `resolved_phase_plan`. Do **not** spawn sprint-plan or critic from this subagent (BUG-0006).

**baseline_h2_count (pre-mutate)**: `0`

## Approach locked (A1 — from R-0139)

| Option | Summary | Verdict |
|--------|---------|---------|
| **A1** | Sibling `@its-magic/browser-uat` (no Pi) composing US-0141 `ConnectHandoff`; Playwright isolated core + typed CDP adapter; fail-closed `BROWSER_*` / `UAT_*`; 12 `test_us0142_*` | **Preferred / LOCKED** — AC-1..AC-8 |
| A2 | Nested under `app-runtime` | **Rejected** — DQ1 / §30 sibling |
| A3 | Fold into `tool-broker` | **Rejected** — Layer A ≠ Layer B |
| A4 | Cursor MCP remains v1 authority | **Rejected** — D3 REPLACE backend |
| A5 | Puppeteer as driver | **Rejected** — extra stack |
| A6 | Selenium / WebDriver | **Rejected** — heavier |
| A7 | `launchPersistentContext` on default Chrome User Data | **Rejected** — Chrome 136+ |
| A8 | Pixel visual baseline / `toHaveScreenshot` v1 | **Rejected** — D9 / §20.7 |
| A9 | Implement US-0143 `/auto` drain | **Rejected** — D9 |
| A10 | Rewrite GateEngine / workflow | **Rejected** — D1/DQ9 compose |
| A11 | Require live Chrome in CI | **Rejected** — fake driver |
| A12 | Replace kit `UAT_BROWSER_PROBE_MODE` default `cursor` | **Rejected** — KEEP; add `owned` |
| A13 | Silent / fake browser PASS | **Rejected** — US-0128 |
| A14 | Kit Python Playwright as standalone runtime | **Rejected** — standalone TS owns execution |
| A15 | `browser.close()` after CDP as default teardown | **Rejected** — kills operator session |

**Can this be simpler?** Nesting in app-runtime looks smaller and couples UAT to process lifecycle. Tool-broker fold mixes policy with Playwright. Cursor-MCP-only fails isolated CI and “without Cursor plugins.” A1 is the simplest design that meets AC-1..AC-8.

### Locked surfaces (DEC-0142)

1. **Package**: `@its-magic/browser-uat` (`standalone/packages/browser-uat`). npm name **LOCKED** `browser-uat`. `private: true`, `version: 0.0.0`, `type: module`, `engines.node >=22.19.0`, export `./src/index.ts`. **No Pi dependency.** Type-only / public-API imports from `@its-magic/app-runtime` (`ConnectHandoff`), `@its-magic/policy-engine`, `@its-magic/tool-broker`, `@its-magic/config` allowed. Those packages **do not** import browser-uat internals. Extend US-0133..0141 Pi-import grep to this package. No Biome override. Kit `files` omit `standalone/`. Do not add standalone to kit workspaces. **Execute owns package creation.**
2. **Compose, do not reimplement AppRuntime**: call `AppRuntime.connectHandoff(id)` (or injected port). Consume **LOCKED** Connect fields: `connect_endpoint`, `health_path`, `service_id`, `container_id`, `env_refs` (names-only), `url`, `ports`, `health`. Do **not** import ProcessManager/ExecutionBackend internals. Do **not** put BrowserUAT inside `app-runtime` or GateEngine. Do **not** rewrite CommandRouter, WorkflowEngine, GateEngine, or crash-resume DONE authority.
3. **Two-mode matrix** (AC-1): **isolated** = `chromium.launch({ headless })` + `browser.newContext()` (close OK). **authorized CDP** = dedicated `--user-data-dir` + `--remote-debugging-port` + `connectOverCDP` + **`disconnect()`** (browser stays alive). Default Chrome User Data → `BROWSER_CDP_DEFAULT_PROFILE_FORBIDDEN`. Missing approval/port/profile → `BROWSER_CDP_UNAUTHORIZED` (no silent isolated fallback). Optional `launchPersistentContext(dedicatedDir)` is helper-only, never default User Data.
4. **Typed tool** (AC-2): single `itsm_browser` `action` enum **LOCKED**: `open`, `navigate`, `snapshot`, `click`, `type`, `select`, `wait`, `screenshot`, `console`, `network`, `download`, `upload`, `accessibility`. Promote off PolicyEngine `STUB_TOOLS`. ToolBroker handler delegates to `BrowserUAT` (no Playwright import in broker). QA primary allowlist; CDP needs operator approval. Snapshot = a11y/DOM summary, **not** pixel.
5. **UAT planner** (AC-3): reuse `classify_step`. Additive **`UAT_BROWSER_PROBE_MODE=owned`**. Kit default **`cursor` held**. Kit-slice `UAT_PROBE_FORBIDDEN` **unweakened**. This story lifts `browser_smoke` for **its** fixtures only.
6. **Evidence** (AC-4/AC-7): compatible `uat.json` + `browser_evidence_refs`. Additive **LOCKED**: `snapshot_summary`, `trace_ref`, `duration_ms`, `browser_backend` (`isolated`\|`cdp`), `app_runtime_ref`. Redact Authorization/Cookie/Set-Cookie/tokens/form secrets via US-0135 before persist. HAR `content: "omit"`. Traces gitignored under `.its-magic/runtime/browser-evidence/`. Evidence-gap → `UAT_BROWSER_PROBE_FAILED` / `BROWSER_EVIDENCE_GAP`.
7. **Credentials** (AC-6): dedicated CDP profile, then opaque injected test account (names-only), then explicit operator ASK. **Never read `.env`**. Repo-file passwords → `UAT_PROBE_FORBIDDEN` / `BROWSER_CREDENTIAL_FORBIDDEN`. No live storageState in git.
8. **Reason codes LOCKED**: `BROWSER_UNAVAILABLE`, `BROWSER_CDP_UNAUTHORIZED`, `BROWSER_CDP_DEFAULT_PROFILE_FORBIDDEN`, `BROWSER_CRASHED`, `BROWSER_WAIT_TIMEOUT`, `BROWSER_ASSERTION_FAILED`, `BROWSER_CONSOLE_ERROR`, `BROWSER_NETWORK_FAILED`, `BROWSER_EVIDENCE_GAP`, `BROWSER_CREDENTIAL_FORBIDDEN`, `BROWSER_RETRY_CAP_EXHAUSTED`. Keep `UAT_PROBE_PASS`, `UAT_PROBE_FAILED`, `UAT_PROBE_TIMEOUT`, `UAT_PROBE_UNRESOLVED`, `UAT_PROBE_FORBIDDEN`, `UAT_BROWSER_UNAVAILABLE`, `UAT_BROWSER_PROBE_FAILED`, `UAT_BROWSER_PROBE_TIMEOUT`. Do not overload `APP_RUNTIME_*` / `BACKEND_*` / `REMOTE_*` / `WORKFLOW_*`.
9. **Retry** (AC-5): **`BROWSER_RETRY_MAX` default 2** from resolved config/scratchpad if present. Orthogonal to `APP_RUNTIME_RESTART_MAX`. Missing CDP auth is not retried into isolated. No fake browser PASS.
10. **OUT**: US-0143 drain; pixel visual baseline; micro-VM; restore `.opencode/commands/auto.md`; kit `cli.json`; plugin-local `its-magic-auto/tui.json`; npm-publish; git push; rewrite of US-0136..0141 packages.
11. **Tests**: 12 `test_us0142_*`; Win+Linux; fake-model CI; fake driver; in-process HTTP fixture. Count stays 12.

### Critic NB closures (research us0142rsc-* — informational)

| NB | Closure |
|----|---------|
| NB1 proof MATCH; Status OPEN; ACs unchecked; Chrome 136+ default profile forbidden; traces/HAR redact; CDP disconnect not close; `BROWSER_RETRY_MAX` orthogonal (`us0142rsc-challenger-001`) | LOCKED this H1 + DEC-0142; Status OPEN; ACs unchecked |
| NB2 sibling browser-uat composes `connectHandoff`; architecture owns DEC-0142 + `# US-0142`; ToolBroker→BrowserUAT; US-0143 drain OUT; pixel baseline OUT (`us0142rsc-architect-002`) | LOCKED this H1 + DEC-0142; T-001..T-009 |
| NB3 no browser-uat code; no DONE; 11 tasks ≤ 12; no `/architecture` spawn from critic (`us0142rsc-subtractor-003`) | Held — T-anch; Status OPEN; execute owns package; do not spawn `/sprint-plan` from this subagent |

## Components

### `browser-uat` package (AC-1..AC-8)

- Facade `BrowserUAT` + isolated Playwright driver + typed CDP adapter + evidence writer + UAT executor plug-in
- Grep denies `@earendil-works/pi-` inside the package

### AppRuntime Connect compose (AC-1, AC-4)

- Consume `connectHandoff`; do not start/stop processes here

### Isolated Playwright + CDP adapter (AC-1)

- `launch`+`newContext` default; `connectOverCDP`+`disconnect` authorized; dedicated profile only

### Typed `itsm_browser` (AC-2)

- Action enum; promote from STUB; QA primary; snapshot ≠ pixel

### UAT planner plug-in (AC-3)

- Reuse `classify_step`; additive `owned`; kit `cursor` + `UAT_PROBE_FORBIDDEN` held

### Evidence + redaction + credentials (AC-4, AC-6, AC-7)

- Compatible `uat.json`; redact before persist; never read `.env`

### Fail-closed retry (AC-5)

- Locked `BROWSER_*` / `UAT_*`; `BROWSER_RETRY_MAX` default 2

### Contract tests (AC-1..AC-8)

- Twelve markers (DEC-0142 §9). Kernel tests: `standalone/tests/contract`. Matrix Windows + Linux.

## Companion DEC = DEC-0142 (Required → Accepted)

Authored Accepted in THIS phase at `decisions/DEC-0142.md`. Locks A1, package, modes, tool enum, UAT mode, evidence, credentials, reason codes, cap, markers, seeds.

## Risks finalized (R1–R7 from R-0139)

- **R1 (HIGH)** Playwright traces/HAR leak cookies and Authorization → DQ5 omit+redact; gitignore traces; AC-7 tests
- **R2 (HIGH)** Operators CDP-attach the daily Chrome profile (Chrome 136+ ignores debug port) → dedicated `--user-data-dir`; `BROWSER_CDP_DEFAULT_PROFILE_FORBIDDEN`
- **R3 (MEDIUM)** Live Chromium absent on CI → DQ8 fake driver; `BROWSER_UNAVAILABLE` asserted, not skipped
- **R4 (MEDIUM)** `browser.close()` after CDP kills a logged-in session → DQ2 `disconnect()`
- **R5 (MEDIUM)** Weakening kit `UAT_PROBE_FORBIDDEN` to make US-0142 green → DQ4/DQ9; test 6
- **R6 (LOW)** Credential injection visible to the model → DQ6 names-only; PolicyEngine secret deny; never read `.env`
- **R7 (LOW)** npm name bikeshed vs §30 → this H1 pins `browser-uat`

## Compose, do not amend (verified)

| Story / DEC | Surface | Verification |
|-------------|---------|--------------|
| US-0141 / DEC-0141 / R-0138 | `ConnectHandoff` / `connectHandoff` | ✓ consume; AppRuntime not rewritten |
| US-0093 / R-0079 | `classify_step` / `uat.json` / `browser_evidence_refs` | ✓ KEEP contract; REPLACE backend; add `owned` |
| US-0065 | probe catalog kinds | ✓ unchanged |
| US-0128 / R-0111 | no fake browser PASS | ✓ kit waives stay `UAT_PROBE_FORBIDDEN` |
| US-0135 / DEC-0135 | `redact.ts` | ✓ headers/cookies/tokens before persist |
| US-0137 / DEC-0137 / R-0129 | PolicyEngine `itsm_browser` STUB | ✓ promote only; tables unamended |
| US-0140 / DEC-0140 / R-0135 | GateEngine / workflow | ✓ consume-not-rewrite |
| US-0085 | `.env` deny | ✓ never read |
| US-0056 / DEC-0038 | `compute_strict_proof_hash` tuple | ✓ UNAMENDED |
| Kit npm `its-magic` / DEC-0120 | `files` whitelist | ✓ omit `standalone/` |
| US-0143..US-0148 | later capabilities | ✓ OUT OF SCOPE (US-0143 drain) |
| BUG-0021 / R-0134 | OpenCode CLI TUI `/auto` listing | ✓ DONE; not mutated (`sprints/S0146/`) |
| BUG-0022 / R-0133 | (open bug) | ✓ OPEN; not mutated |
| BUG-0023 / R-0137 | OpenCode CLI TUI dispatch | ✓ DONE; not mutated (`sprints/S0148/`) |
| R-0120..R-0139 | prior research | ✓ not wiped (R-0138/R-0136/R-0137 intact) |

## Sprint seeds (11 tasks within SPRINT_MAX_TASKS=12 — for `/sprint-plan` expected S0150)

- **T-anch** (`# US-0142` H1 + DEC-0142 Accepted — RESOLVED in THIS phase; NO-OP / verification)
- **T-001** (AC-1 — `packages/browser-uat` + Pi-import grep + consume `connectHandoff`)
- **T-002** (AC-1 — isolated Playwright `launch`+`newContext`)
- **T-003** (AC-1 — CDP adapter `connectOverCDP`+`disconnect`+dedicated profile)
- **T-004** (AC-2 — promote `itsm_browser` typed actions)
- **T-005** (AC-3 — UAT planner plug-in + additive `owned` + kit `UAT_PROBE_FORBIDDEN` held)
- **T-006** (AC-4/AC-7 — evidence schema + redaction + gitignored traces)
- **T-007** (AC-6 — credential deny + opaque injection / operator approval)
- **T-008** (AC-5 — fail-closed `BROWSER_*`/`UAT_*` + `BROWSER_RETRY_MAX`)
- **T-009** (AC-8 — E2E happy+failure fixtures; no visual baseline)
- **T-010** (AC-1..AC-8 — 12 `test_us0142_*` Win/Linux fake-driver)

AC surjection: AC-1→T-001,T-002,T-003 (T-010 m1–m3); AC-2→T-004 (T-010 m4); AC-3→T-005 (T-010 m5,m6); AC-4→T-006 (T-010 m7); AC-5→T-008 (T-010 m3,m10); AC-6→T-007 (T-010 m9); AC-7→T-006 (T-010 m8); AC-8→T-009 (T-010 m11,m12). Order: T-anch → T-001 → T-002 → T-003 → T-004 → T-005 → T-006 → T-007 → T-008 → T-009 → T-010. No split (11 ≤ 12). Not `/quick`. Live-inventory S0146=BUG-0021, S0147=US-0140, S0148=BUG-0023, S0149=US-0141. Expected **S0150**. Do **not** write `sprints/S0150/` this phase.

## Isolation evidence (US-0048 / DEC-0029)

- `phase_id=architecture`, `role=tech-lead`, `story_id=US-0142`, `sprint_id=none` (pending — sprint-plan owns next unused id), `orchestrator_run_id=auto-20260913-us0142`
- `delivery_mode=ultra_lean`, `macro_phase=plan` (architecture — second canonical phase of `plan` macro)
- `model_id=cursor-grok-4.6-high` (CROSS_MODEL_REVIEW=1 — required on isolation)
- `fresh_context_marker=tl-US0142-architecture-20260914T035000Z-fresh`, `timestamp=2026-09-14T03:50:00Z` (UTC)
- `evidence_ref=docs/engineering/research.md ## R-0139; docs/product/backlog.md ## US-0142; docs/engineering/architecture.md (this # US-0142); decisions/DEC-0142.md; handoffs/resume_brief.md`
- Fresh tech-lead subagent per BUG-0006 / US-0048; no prior chat history. Narrow-read only. No `.env` reads. Status remains OPEN. US-0133..US-0141 DONE compose-only not reopened. BUG-0021 DONE not mutated. BUG-0022 OPEN not mutated. BUG-0023 DONE not mutated. No US-0143+ authoring. No `/sprint-plan` spawn from this subagent. No `standalone/packages/browser-uat` this phase.
- Prior phase strict proof consumed: `rp-auto-20260913-us0142-research-techlead-20260914T033000Z-US-0142` / `3C8C3226AB88276C2595CCE79742589FF464C3ED8444D6425CC99183D390655A` — RUNTIME_PROOF_VALID (independent `compute_strict_proof_hash` MATCH; consume-before-TTL `2026-09-14T03:50:00Z` < `2026-09-14T04:30:00Z`; immutable R-0139). Critic findings us0142rsc-* informational only (`rp-auto-20260913-us0142-sovereign-critic-techlead-20260914T034000Z-US-0142` / `18F5B1E72CDA4EFAB0F9A8F4588A151E4B84DD7391467BFD4A1D05EF81212621`; anti_slop=10; 0 blocking; degraded_mode=false; MATCH before TTL `2026-09-14T04:40:00Z`).
- Sovereign memory: `SOVEREIGN_MEMORY=1`; `build_injection_digest_block` returned `(no sovereign memory entries)` (read-only). No `mistakes.jsonl` write.

## Strict runtime proof (mirror)

- `runtime_proof_id=rp-auto-20260913-us0142-architecture-techlead-20260914T035000Z-US-0142`
- Canonical hashed payload (DEC-0038, `compute_strict_proof_hash` positional): `{"orchestrator_run_id":"auto-20260913-us0142","phase_id":"architecture","proof_issued_at":"2026-09-14T03:50:00Z","proof_ttl_seconds":3600,"role":"tech-lead","runtime_proof_id":"rp-auto-20260913-us0142-architecture-techlead-20260914T035000Z-US-0142"}`
- Isolation extras (not hashed): `delivery_mode=ultra_lean`, `macro_phase=plan`, `model_id=cursor-grok-4.6-high`, `sprint_id=none`, `story_id=US-0142`
- `proof_hash=52A720174CB9E0D35507ED9683ED70D22D72A5D9E757A5CF1170B2AC304B3175`
- `proof_ttl=2026-09-14T04:50:00Z`
- `hash_recompute_confirmation=true` (compute_strict_proof_hash → 52A720174CB9E0D35507ED9683ED70D22D72A5D9E757A5CF1170B2AC304B3175; **64 hex** verified)
- Consumed research proof: `rp-auto-20260913-us0142-research-techlead-20260914T033000Z-US-0142` / `3C8C3226AB88276C2595CCE79742589FF464C3ED8444D6425CC99183D390655A` — RUNTIME_PROOF_VALID MATCH before TTL `2026-09-14T04:30:00Z`
- Consumed critic proof: `rp-auto-20260913-us0142-sovereign-critic-techlead-20260914T034000Z-US-0142` / `18F5B1E72CDA4EFAB0F9A8F4588A151E4B84DD7391467BFD4A1D05EF81212621` — RUNTIME_PROOF_VALID MATCH before TTL `2026-09-14T04:40:00Z`

# US-0143 — Delivery routing and full-autonomy scheduler

## Overview

**US-0143** lifts deferred `/auto` and `/quick` so operators can run bounded standard, lean, quick, resume, and backlog-drain workflows in **runtime state**. Implementation lives **inside** existing `@its-magic/runtime-core`. Nested helper `workflow/delivery-router.ts`. CommandRouter returns implemented `RouteScheduled` (not 7-step for the scheduler command itself). WorkflowEngine owns the §14.4 `while run active` drain loop (`runAuto` / `runQuick`). GateEngine `RELEASE_GATE_ORDER` stays **unamended**. Host Cursor/OpenCode remain **scheduling-only**. **No Pi**. **No** sibling auto-scheduler. **No** prompt-only scheduler. **No** `.opencode/commands/auto.md` restore. Kit `files` omit `standalone/`. Five axes stay independent. AC-6 terminals stay non-relaxable even under `AUTONOMY_PRESET=full`. US-0144 critic *content* is OUT (hooks compose only). DEC-0038 `compute_strict_proof_hash` tuple stays **UNAMENDED**. Execute owns code files.

**Research anchor**: **R-0141** (DQ1–DQ10 LOCKED). **Companion DEC**: **DEC-0143** (Accepted — THIS phase). **EARLY_RESEARCH**: consumed from R-0141 (Graph Harness / SGH typed graph; Conductor-style zero-token router; control-plane vs data-plane; Bernstein no-LLM scheduler tests; AAL≠ACL; hard stops as circuit breakers) — **no new R-id**. Do not wipe R-0120..R-0141. **R-0139 remains US-0142. R-0138 remains US-0141. R-0140 remains BUG-0024.**

**Fresh context marker**: `tl-US0143-architecture-20260914T071000Z-fresh`
**Orchestrator run id**: `auto-20260913-us0143`
**Timestamp**: 2026-09-14T07:10:00Z (UTC)
**Verdict**: PASS
**Next**: sovereign-critic (architecture), then `/sprint-plan` **S0151** (S0150=US-0142; S0149=US-0141; S0148=BUG-0023; S0147=US-0140; S0146=BUG-0021; live-inventory S0151 unused; orchestrator-owned). ultra_lean: plan-verify is **not** in `resolved_phase_plan` (SKIPPED). Do **not** spawn sprint-plan or critic from this subagent (BUG-0006).

**baseline_h2_count (pre-mutate)**: `0`

## Approach locked (A1 — from R-0141)

| Option | Summary | Verdict |
|--------|---------|---------|
| **A1** | CommandRouter implements deferred `/auto`/`/quick` inside `@its-magic/runtime-core`; nested DeliveryRouter; WorkflowEngine owns drain; GateEngine unamended; YAML stop-matrix consume; TS L8 adapter; 12 `test_us0143_*` | **Preferred / LOCKED** — AC-1..AC-8 |
| A2 | Sibling `packages/auto-scheduler` | **Rejected** — D1 / §30 |
| A3 | Prompt-only scheduler / restore `auto.md` | **Rejected** — D3 / D9 |
| A4 | Rewrite GateEngine tables | **Rejected** — D1 |
| A5 | Fork stop-matrix YAML writer / prompt-encoded stops | **Rejected** — D5 |
| A6 | LangGraph / Temporal as `/auto` engine | **Rejected** — R-0135 / spawn-only |
| A7 | Fold scheduler into role-runtime | **Rejected** — US-0136 A2 |
| A8 | Amend KernelBridge allowlist for work-kind | **Rejected** — US-0140 compose |
| A9 | Implement US-0144 critic/memory content | **Rejected** — D9 |
| A10 | CLI/TUI ownership (US-0146) | **Rejected** — D9 |
| A11 | Silent mid-story `DELIVERY_MODE` switch | **Rejected** — DEC-0082 |
| A12 | Weaken `security_hard` under `full` preset | **Rejected** — AC-6 / AAL≠ACL |
| A13 | SQLite as stop/DONE SOT | **Rejected** — DEC-0140 |
| A14 | Keep `WORKFLOW_ROUTE_DEFERRED` as happy path | **Rejected** — AC-1 |
| A15 | LLM work-kind / stop-relaxability classifier | **Rejected** — D3 / D5 |

**Can this be simpler?** In-place `route` without DeliveryRouter mixes 7-step with drain. A sibling package fails D1. A prompt scheduler fails reproducibility. A1 is the simplest design that meets AC-1..AC-8.

### Locked surfaces (DEC-0143)

1. **Package**: existing `@its-magic/runtime-core`. Nested `src/workflow/delivery-router.ts`. **No Pi.** Type-only / public-API imports from `@its-magic/role-runtime`, `@its-magic/policy-engine`, `@its-magic/config`, `@its-magic/kernel-bridge` allowed. Those packages **do not** import delivery-router internals. No Biome override. Kit `files` omit `standalone/`. Do not add standalone to kit workspaces. **Execute owns code.**
2. **Lift deferred (AC-1)**: `SCHEDULER_COMMANDS = ["/auto","/quick"]`. `DEFERRED_COMMANDS` becomes empty (or removed). `CommandRouter.route("/auto"|"/quick")` → `RouteScheduled` (`ok: true`, `implemented: true`, `plan`, `axes`). Does **not** run 7-step for the scheduler command. Programmatic 16-command path **unamended**. Keep `WORKFLOW_ROUTE_DEFERRED` in `codes.ts` unused for these two names. Compose-amend `test_us0140_command_coverage` (US-0140 ACs stay DONE).
3. **Independent axes (AC-2)**: `DELIVERY_MODE`, `TOKEN_PROFILE`, CAVEMAN/voice, `AUTONOMY_PRESET`, `WORK_KIND`. Consume-only ConfigView lookups. **No new RuntimeConfig domain.** Compressed modes still require tests + acceptance. Axes must not fold.
4. **L8 adapter (AC-3)**: TS `resolveDeliveryRoute` ports `work_kind_routing_lib.py`. Precedence: `start-from` > explicit `DELIVERY_MODE` > `AUTO_PHASE_*` > work-kind > default standard. Conflict → `WORK_KIND_DELIVERY_MODE_CONFLICT`. Mid-story switch → `DELIVERY_MODE_SWITCH_MID_STORY`. `WORK_KIND_ROUTING=0` early-return `WORK_KIND_ROUTING_OFF`. KernelBridge allowlist **unamended**. Python remains kit SOT. Golden vectors vs Python fixtures.
5. **Compressed graphs (AC-2)**: `standard` = full `CANONICAL_PHASES`. `ultra_lean` = existing skip `plan-verify` held. `mega_quick` and **`/quick`** = **LOCKED** nodes `execute` → `qa` → `verify-work` → `release` → `closure` → `refresh-context`. Must not skip test evidence, UAT/acceptance, or GateEngine. Eligibility remains US-0096. `/quick` forces mega_quick shape (not a prompt).
6. **Drain owner (AC-5)**: `WorkflowEngine.runAuto` / `runQuick` own `while run active`. Caps from resolved config: `AUTO_LOOP_MAX_CYCLES`, `AUTO_BACKLOG_MAX_STORIES`, `AUTO_BACKLOG_ON_BLOCK`, `AUTO_EXECUTE_MAX_ITEMS`, `AUTO_BLOCK_RETRY_MAX`, `AUTO_PAUSE_REQUEST`, `AUTO_QUIET`, approvals. Exhaust → `WORKFLOW_LOOP_CAP` / `BLOCK_RETRY_CAP_EXHAUSTED` / `BUDGET_EXHAUSTED`. Bug-queue axis default-off (`AUTO_BUG_QUEUE=0` this run — do not drain BUG-0024). Operator pause/skip/approval/`AUTONOMY_PRESET=none` non-bypassable.
7. **Preset + stop matrix (AC-4/AC-6)**: `expandAutonomyPreset` before run. Consume `scripts/data/autonomy_stop_matrix.yaml` (file read). Do **not** weaken US-0119 `security_hard`. Additive `security_hard` codes **LOCKED**: `DECISION_UNRESOLVED`, `KERNEL_INCOMPATIBLE`, `QUALITY_EVIDENCE_FAILED`, `BUDGET_EXHAUSTED`, `RESUME_AMBIGUOUS`. AC-6 non-relaxable even under `full`. Models never decide relaxability. GateEngine order unamended.
8. **Ledger + resume (AC-7)**: dual-write `RunsStore.audit` + `handoffs/autonomy_repair_ledger/<orchestrator_run_id>.jsonl`. Repo artifacts remain canonical. SQLite is **not** stop/DONE SOT. Mid-resume: `discardOrphans` + fresh correct-role spawn. Never restore old specialist transcript. Never switch `DELIVERY_MODE` mid-story. Ledger fields: phase selection, retries, skips, stop reason, resume choice, repair kind, cap remaining, axis snapshot.
9. **Critic hooks**: existing `scheduleSupplementaryHooks` when `CROSS_MODEL_REVIEW=1`. US-0144 content OUT.
10. **OUT**: US-0144 content; US-0145 parallel/deploy; US-0146 CLI/TUI; restore `auto.md`; kit `cli.json`; plugin-local `tui.json`; npm-publish; git push; rewrite of US-0136..0142 packages; `.env` reads.
11. **Tests**: 12 `test_us0143_*`; Win+Linux; fake-model CI; in-memory SQLite. Count stays 12.

### Critic NB closures (research us0143rsc-* — informational)

| NB | Closure |
|----|---------|
| NB1 proof MATCH; Status OPEN; ACs unchecked; R-0141 authored; R-0139 US-0142 + R-0140 BUG-0024 held; AC-6 terminals named (`us0143rsc-challenger-001`) | LOCKED this H1 + DEC-0143; Status OPEN; ACs unchecked |
| NB2 A1 CommandRouter in runtime-core; WorkflowEngine drain; GateEngine unamended; architecture owns DEC-0143 + `# US-0143`; US-0144 content OUT (`us0143rsc-architect-002`) | LOCKED this H1 + DEC-0143; T-001..T-009 |
| NB3 no drain implementation; no DONE; 11 tasks ≤ 12; no `/sprint-plan` spawn from architecture (`us0143rsc-subtractor-003`) | Held — T-anch; Status OPEN; execute owns code; do not spawn `/sprint-plan` from this subagent |

## Components

### CommandRouter lift (AC-1)

- `SCHEDULER_COMMANDS`; empty `DEFERRED_COMMANDS`; `RouteScheduled`; 7-step reserved for canonical phases

### DeliveryRouter (AC-2, AC-3)

- Independent axes + L8 `resolveDeliveryRoute` + compressed plans

### ConfigView consume-only lookups (AC-2, AC-4)

- `lookupDeliveryMode` (exists) + `lookupTokenProfile` + `lookupVoice` + `lookupAutonomyPreset` + `lookupWorkKindRouting`; `expandAutonomyPreset` before run

### WorkflowEngine drain (AC-1, AC-5)

- `runAuto` / `runQuick`; reuse `runExecuteQaLoop` and unamended `evaluateRelease`

### Stop matrix consume (AC-4, AC-6)

- YAML file read; additive `security_hard`; `full` cannot relax AC-6

### Audit + repair ledger (AC-7)

- `RunsStore.audit` + JSONL; repo canonical; `discardOrphans` mid-resume

### Critic-hook slot (AC-1)

- `scheduleSupplementaryHooks` only; US-0144 content OUT

### Contract tests (AC-1..AC-8)

- Twelve markers (DEC-0143 §9). Kernel tests: `standalone/tests/contract`. Matrix Windows + Linux.

## Companion DEC = DEC-0143 (Required → Accepted)

Authored Accepted in THIS phase at `decisions/DEC-0143.md`. Locks A1, lift, axes, L8, compressed nodes, drain owner, AC-6 codes, ledger, markers, seeds.

## Risks finalized (R1–R6 from R-0141)

- **R1 (MEDIUM)** `test_us0140_command_coverage` breaks when deferred is lifted → DQ2 compose-amend in T-001; keep US-0140 ACs DONE
- **R2 (MEDIUM)** mega_quick node list bikeshed vs kit `["quick"]` macro → this H1 pins nodes; tests+acceptance+GateEngine non-skippable
- **R3 (LOW)** Dual-write ledger drift vs repo artifacts → DQ8 SQLite non-authority; `RECOVERY_FALSE_COMPLETION`
- **R4 (MEDIUM)** Operators treat `AUTONOMY_PRESET=full` as permission to skip hard stops → DQ7 YAML `security_hard`; test 10
- **R5 (LOW)** L8 TS adapter drifts from Python kit SOT → golden vectors; Python remains kit SOT
- **R6 (LOW)** Drain accidentally picks BUG-0024 → `AUTO_BUG_QUEUE=0`; sibling boundary tests; do not drain bugs this execute

## Compose, do not amend (verified)

| Story / DEC | Surface | Verification |
|-------------|---------|--------------|
| US-0140 / DEC-0140 / R-0135 | CommandRouter 7-step; GateEngine `RELEASE_GATE_ORDER`; `node:sqlite` | ✓ lift deferred only; gates unamended; compose-amend coverage test |
| US-0118 / DEC-0118 / R-0106 | L8 Python kit SOT | ✓ TS adapter + golden vectors; allowlist unamended |
| US-0119 / DEC-0119 / R-0107 | `expandAutonomyPreset`; YAML stop matrix | ✓ consume; do not fork writer; do not weaken `security_hard` |
| US-0095 / DEC-0078 / R-0081 | native chain | ✓ consume |
| US-0096 / DEC-0082 / R-0082 | ultra_lean / mega_quick | ✓ skip-plan-verify held; mega_quick nodes pinned |
| US-0070 / DEC-0052 | phase policy | ✓ consume |
| BUG-0006 / DEC-0051 | spawn-only | ✓ host scheduling-only; no in-process producer |
| US-0087 | bug-queue mutex | ✓ axis present; this run `AUTO_BUG_QUEUE=0` |
| US-0085 | `.env` deny | ✓ never read |
| US-0056 / DEC-0038 | `compute_strict_proof_hash` tuple | ✓ UNAMENDED |
| Kit npm `its-magic` / DEC-0120 | `files` whitelist | ✓ omit `standalone/` |
| US-0141 / US-0142 | DONE app-runtime / browser-uat | ✓ compose only; not reopened |
| US-0144..US-0148 | later capabilities | ✓ OUT OF SCOPE (US-0144 content) |
| BUG-0021 / R-0134 | OpenCode CLI TUI `/auto` listing | ✓ DONE; not mutated (`sprints/S0146/`) |
| BUG-0022 / R-0133 | (open bug) | ✓ OPEN; not mutated |
| BUG-0023 / R-0137 | OpenCode CLI TUI dispatch | ✓ DONE; not mutated (`sprints/S0148/`) |
| BUG-0024 / R-0140 | OpenCode TUI dispatch residual | ✓ OPEN; not mutated / not drained |
| R-0120..R-0141 | prior research | ✓ not wiped (R-0138/R-0139/R-0140 intact) |

## Sprint seeds (11 tasks within SPRINT_MAX_TASKS=12 — for `/sprint-plan` expected S0151)

- **T-anch** (`# US-0143` H1 + DEC-0143 Accepted — RESOLVED in THIS phase; NO-OP / verification)
- **T-001** (AC-1 — lift `DEFERRED_COMMANDS` + `RouteScheduled` + compose-amend `test_us0140_command_coverage`)
- **T-002** (AC-2 — ConfigView independent axis lookups + preset expand-before-run)
- **T-003** (AC-3 — TS L8 adapter + conflict code + golden vectors)
- **T-004** (AC-2 — compressed graphs: ultra_lean held; mega_quick/`/quick` tests+acceptance)
- **T-005** (AC-1/AC-5 — WorkflowEngine `runAuto`/`runQuick` §14.4 loop)
- **T-006** (AC-5 — drain/bulk/retry/skip/quiet/pause/approval caps)
- **T-007** (AC-4/AC-6 — YAML stop-matrix consume + AC-6 additive `security_hard`)
- **T-008** (AC-7 — audit + repair JSONL + mid-resume `discardOrphans`)
- **T-009** (AC-1 — critic-hook slot only; US-0144 content OUT)
- **T-010** (AC-1..AC-8 — 12 `test_us0143_*` Win/Linux fake-model)

AC surjection: AC-1→T-001,T-005,T-009 (T-010 m1–m2); AC-2→T-002,T-004 (T-010 m3–m5); AC-3→T-003 (T-010 m6–m7); AC-4→T-002,T-007 (T-010 m8); AC-5→T-005,T-006 (T-010 m9); AC-6→T-007 (T-010 m10); AC-7→T-008 (T-010 m11); AC-8→T-010 (m12). Order: T-anch → T-001 → T-002 → T-003 → T-004 → T-005 → T-006 → T-007 → T-008 → T-009 → T-010. No split (11 ≤ 12). Not `/quick`. Live-inventory S0146=BUG-0021, S0147=US-0140, S0148=BUG-0023, S0149=US-0141, S0150=US-0142. Expected **S0151**. Do **not** write `sprints/S0151/` this phase.

## Isolation evidence (US-0048 / DEC-0029)

- `phase_id=architecture`, `role=tech-lead`, `story_id=US-0143`, `sprint_id=none` (pending — sprint-plan owns next unused id), `orchestrator_run_id=auto-20260913-us0143`
- `delivery_mode=ultra_lean`, `macro_phase=plan` (architecture — second canonical phase of `plan` macro)
- `model_id=cursor-grok-4.6-high` (CROSS_MODEL_REVIEW=1 — required on isolation)
- `fresh_context_marker=tl-US0143-architecture-20260914T071000Z-fresh`, `timestamp=2026-09-14T07:10:00Z` (UTC)
- `evidence_ref=docs/engineering/research.md ## R-0141; docs/product/backlog.md ## US-0143; docs/engineering/architecture.md (this # US-0143); decisions/DEC-0143.md; handoffs/resume_brief.md`
- Fresh tech-lead subagent per BUG-0006 / US-0048; no prior chat history. Narrow-read only. No `.env` reads. Status remains OPEN. US-0133..US-0142 DONE compose-only not reopened. BUG-0021 DONE not mutated. BUG-0022 OPEN not mutated. BUG-0023 DONE not mutated. BUG-0024 OPEN not mutated/drained. No US-0144+ authoring. No `/sprint-plan` spawn from this subagent. No drain implementation code this phase.
- Prior phase strict proof consumed: `rp-auto-20260913-us0143-research-techlead-20260914T065000Z-US-0143` / `27986466F2DEE28D145CB9892C2A3AFBD4E41B2F9E9F88F133008BEB43F94042` — RUNTIME_PROOF_VALID (independent `compute_strict_proof_hash` MATCH; consume-before-TTL `2026-09-14T07:10:00Z` < `2026-09-14T07:50:00Z`; immutable R-0141). Critic findings us0143rsc-* informational only (`rp-auto-20260913-us0143-sovereign-critic-techlead-20260914T070000Z-US-0143` / `242D01E83A4DFE451C679C02C23593A16DD0F6313282F87A8DA846987E187D31`; anti_slop=10; 0 blocking; degraded_mode=false; MATCH before TTL `2026-09-14T08:00:00Z`).
- Sovereign memory: `SOVEREIGN_MEMORY=1`; `build_injection_digest_block` returned `(no sovereign memory entries)` (read-only). No `mistakes.jsonl` write.

## Strict runtime proof (mirror)

- `runtime_proof_id=rp-auto-20260913-us0143-architecture-techlead-20260914T071000Z-US-0143`
- Canonical hashed payload (DEC-0038, `compute_strict_proof_hash` positional): `{"orchestrator_run_id":"auto-20260913-us0143","phase_id":"architecture","proof_issued_at":"2026-09-14T07:10:00Z","proof_ttl_seconds":3600,"role":"tech-lead","runtime_proof_id":"rp-auto-20260913-us0143-architecture-techlead-20260914T071000Z-US-0143"}`
- Isolation extras (not hashed): `delivery_mode=ultra_lean`, `macro_phase=plan`, `model_id=cursor-grok-4.6-high`, `sprint_id=none`, `story_id=US-0143`
- `proof_hash=6FF1DB37B91284FDE90C5EC7058FF518605D49525BD8FACECB5AC570284F26E5`
- `proof_ttl=2026-09-14T08:10:00Z`
- `hash_recompute_confirmation=true` (compute_strict_proof_hash → 6FF1DB37B91284FDE90C5EC7058FF518605D49525BD8FACECB5AC570284F26E5; independently MATCH; **64 hex** verified)
- Consumed research proof: `rp-auto-20260913-us0143-research-techlead-20260914T065000Z-US-0143` / `27986466F2DEE28D145CB9892C2A3AFBD4E41B2F9E9F88F133008BEB43F94042` — RUNTIME_PROOF_VALID MATCH before TTL `2026-09-14T07:50:00Z`
- Consumed critic proof: `rp-auto-20260913-us0143-sovereign-critic-techlead-20260914T070000Z-US-0143` / `242D01E83A4DFE451C679C02C23593A16DD0F6313282F87A8DA846987E187D31` — RUNTIME_PROOF_VALID MATCH before TTL `2026-09-14T08:00:00Z`

# US-0144 — Sovereign runtime composition

## Overview

US-0144 implements the deferred sovereign critic, memory, review, decision, deferral, and convergence content as an opt-in composition inside `@its-magic/runtime-core`. `DEC-0144` and `R-0142` are authoritative. The default is `SOVEREIGN_RUNTIME=0`: it adds no content or writes while preserving US-0143's existing `CROSS_MODEL_REVIEW=1` scheduling-only critic session. No Pi, sibling package, arbitrary script execution, GateEngine change, US-0143 drain rewrite, CLI/TUI work, browser success claim, or `.env` access is permitted.

**Research anchor**: **R-0142** (DQ1–DQ10 LOCKED). **Companion DEC**: **DEC-0144** (Accepted — attested THIS phase; heading not duplicated). **EARLY_RESEARCH**: consumed from R-0142 (no new R-id). **R-0141 remains US-0143.** **baseline_h2_count (pre-mutate)**: `0`.
**Fresh context marker**: `tl-US0144-architecture-20260915T185104Z-fresh`
**Orchestrator run id**: `auto-20260913-us0144`
**Timestamp**: 2026-09-15T18:51:04Z (UTC)
**Verdict**: PASS
**Next**: sovereign-critic (architecture), then `/sprint-plan` **S0152** (exists PLANNED — sprint-plan owns body; this phase does not rewrite `sprints/S0152/`). Do **not** spawn critic or sprint-plan from this subagent (BUG-0006). Status remains OPEN. AC-1..AC-8 remain unchecked.

## R-0142 attestation lock (architecture 2026-09-15T18:51:04Z)

Existing `# US-0144` heading and prior locked-design/test/seed prose are retained. This subsection closes the only blocking gaps vs the R-0142 architecture-handoff attestation:

- **Closed KernelBridge set (9)**: `memory_digest`, `critic_model`, `role_review_plan`, `decision_session_append`, `deferral_append`, `deferral_list`, `drain_candidate_gate`, `convergence_evaluate`, `partial_delivery_write`. `deferral_append` / `deferral_list` are first-class ops (not implied by drain-gate).
- **`SOVEREIGN_RUNTIME=0` default-off**: no sovereign bridge call, memory read, sidecar write, sovereign review, convergence evaluation, or sovereign candidate gate.
- **US-0143 drain unamended**: `CommandRouter` routing, `runAuto`/`runQuick`, GateEngine `RELEASE_GATE_ORDER`, and legacy drain materialization stay byte-compatible while sovereign runtime is disabled. `gateDrainCandidate()` is exclusive only for US-0144 sovereign-generated candidates.
- **Twelve named tests**: `test_us0144_kernel_bridge_admission`; `test_us0144_bridge_json_timeout_fail_closed`; `test_us0144_pre_spawn_context_order`; `test_us0144_memory_bounds_default_off`; `test_us0144_model_collision_degraded`; `test_us0144_supplementary_manifest_reviews`; `test_us0144_ledger_schema_preserved`; `test_us0144_sidecar_idempotent_torn_write`; `test_us0144_drain_gate_preset_zero`; `test_us0144_per_candidate_operator_decision`; `test_us0144_blocking_only_convergence_smoke_truth`; `test_us0144_caps_progress_partial_delivery_boundaries`. Four `CROSS_MODEL_REVIEW` × `SOVEREIGN_RUNTIME` combinations live inside these twelve, not a thirteenth test.

### Critic NB closures (research us0144rsc-* — informational)

| NB | Closure |
|----|---------|
| NB1 proof MATCH; Status OPEN; ACs unchecked; R-0142 attested 9-op + 12 tests (`us0144rsc-challenger-001`) | LOCKED this H1 + DEC-0144 attestation; Status OPEN; ACs unchecked |
| NB2 nested runtime-core + typed KernelBridge; architecture owns DEC-0144 + `# US-0144`; S0152 sprint-plan-owned (`us0144rsc-architect-002`) | LOCKED this H1 + DEC-0144; T-anch..T-010 seeds; S0152 not rewritten this phase |
| NB3 no runtime implementation; no DONE; no `/sprint-plan` spawn from architecture (`us0144rsc-subtractor-003`) | Held — execute owns `sovereign_runtime_bridge.py`; Status OPEN; do not spawn critic or sprint-plan from this subagent |

## Locked design

- `KernelBridge.runSovereignOperation()` is a closed, manifest-admitted API using a fixed `scripts/sovereign_runtime_bridge.py` path, fixed working directory/environment allowlist, and versioned bounded request/response JSON. The only operations are the R-0142 closed set of nine: `memory_digest`, `critic_model`, `role_review_plan`, `decision_session_append`, `deferral_append`, `deferral_list`, `drain_candidate_gate`, `convergence_evaluate`, `partial_delivery_write`. Callers and manifests cannot select an executable, arguments, or schema. Only session sidecar, deferral, and partial-delivery operations may write.
- `CommandRouter` assembles an immutable pre-spawn bootstrap: phase context, bounded digest, role objective. `SpawnRequest` carries the bootstrap; `SessionSupervisor` attests its hash and confirms one delivery before producer work. A missing or mismatched acknowledgement fails with `SOVEREIGN_BOOTSTRAP_DELIVERY_FAILED`.
- `SovereignRuntime.afterProducerBoundary()` extends `scheduleSupplementaryHooks` without changing its scheduling semantics. It returns a discriminated `SovereignRuntimeResult` containing critic/degraded evidence, supplementary role reviews, convergence, progress, caps, and any partial-delivery reference.
- The canonical 12-field decision ledger is unchanged. A sidecar at `handoffs/sovereign_decision_sessions/<run>.jsonl` has deterministic event IDs, matching-ledger validation, idempotent duplicate handling, and no torn-write repair.
- `gateDrainCandidate()` is the sole materialization path for US-0144 sovereign-generated candidates. Explicit `SOVEREIGN_DRAIN_AUTO_ACCEPT=0` beats preset expansion and requires a per-candidate operator accept decision; legacy US-0143 drain remains untouched when the sovereign runtime is disabled.
- Only open blocking critic findings block convergence. Smoke surrogates remain non-browser evidence.

## Test contract

1. `test_us0144_kernel_bridge_admission` — Bridge manifest admission and rejected unknown operation.
2. `test_us0144_bridge_json_timeout_fail_closed` — Bridge malformed JSON, response cap, timeout, and subprocess failure.
3. `test_us0144_pre_spawn_context_order` — Pre-spawn context/digest/role ordering and acknowledged single delivery.
4. `test_us0144_memory_bounds_default_off` — Bounded memory and default-off zero-I/O.
5. `test_us0144_model_collision_degraded` — Fresh critic model collision and explicit degraded mode.
6. `test_us0144_supplementary_manifest_reviews` — Role-manifest reviews remain supplementary.
7. `test_us0144_ledger_schema_preserved` — Session sidecar preserves the 12-field ledger.
8. `test_us0144_sidecar_idempotent_torn_write` — Sidecar idempotency and torn-write failure are fail-closed.
9. `test_us0144_drain_gate_preset_zero` — Explicit drain-auto-accept zero overrides a full preset.
10. `test_us0144_per_candidate_operator_decision` — Every generated candidate requires an operator decision.
11. `test_us0144_blocking_only_convergence_smoke_truth` — Convergence honors blocking-only findings and smoke truthfulness.
12. `test_us0144_caps_progress_partial_delivery_boundaries` — Cap/progress/partial-delivery evidence preserves US-0143 and GateEngine boundaries.

## Sprint Seeds

- T-anch: DEC-0144 and this architecture section.
- T-001: kernel contract and typed sovereign bridge admission (9-op closed set).
- T-002: Python sovereign bridge dispatcher and closed operation schemas.
- T-003: pre-spawn bootstrap and supervisor acknowledgement.
- T-004: bounded memory and critic-model operations.
- T-005: supplementary role review and structured hook result.
- T-006: ledger session sidecar.
- T-007: candidate decision gate plus `deferral_append`/`deferral_list`.
- T-008: convergence, caps, and partial delivery.
- T-009: default-off configuration and exports (`SOVEREIGN_RUNTIME=0`).
- T-010: twelve hermetic contract tests (`test_us0144_*` IDs in Test contract).

AC coverage is surjective across T-001..T-010; the planned sprint is S0152 (sprint-plan owns materialization/reconcile). Status remains OPEN and acceptance remains unchecked until closure.

## Isolation evidence (US-0048 / DEC-0029)

- `phase_id=architecture`, `role=tech-lead`, `story_id=US-0144`, `sprint_id=none` (S0152 exists PLANNED — OUT of architecture body authorship)
- `delivery_mode=ultra_lean`, `macro_phase=plan`
- `model_id=cursor-grok-4.6-high`
- `fresh_context_marker=tl-US0144-architecture-20260915T185104Z-fresh`, `timestamp=2026-09-15T18:51:04Z` (UTC)
- `evidence_ref=docs/engineering/research.md ## R-0142; docs/product/backlog.md ## US-0144; docs/engineering/architecture.md (this # US-0144); decisions/DEC-0144.md; docs/engineering/decisions.md; handoffs/resume_brief.md`
- Fresh tech-lead subagent per BUG-0006 / US-0048; no prior chat history. Narrow-read only. No `.env` reads. Status remains OPEN. US-0143 DONE compose-only not reopened. US-0145+ and BUG-* not mutated. No `/sprint-plan` or critic spawn from this subagent. No S0152 rewrite beyond architecture refs.

## Strict runtime proof (mirror)

- `runtime_proof_id=rp-auto-20260913-us0144-architecture-techlead-20260915T185104Z-US-0144`
- Canonical hashed payload (DEC-0038, `compute_strict_proof_hash` positional): `{"orchestrator_run_id":"auto-20260913-us0144","phase_id":"architecture","proof_issued_at":"2026-09-15T18:51:04Z","proof_ttl_seconds":3600,"role":"tech-lead","runtime_proof_id":"rp-auto-20260913-us0144-architecture-techlead-20260915T185104Z-US-0144"}`
- Isolation extras (not hashed): `delivery_mode=ultra_lean`, `macro_phase=plan`, `model_id=cursor-grok-4.6-high`, `sprint_id=none`, `story_id=US-0144`
- `proof_hash=EA5C872E25AF1F03D79F10C7BF371E55993C7440A4A802BFD6E89505C8548BCD`
- `proof_ttl=2026-09-15T19:51:04Z`
- `hash_recompute_confirmation=true` (compute_strict_proof_hash → EA5C872E25AF1F03D79F10C7BF371E55993C7440A4A802BFD6E89505C8548BCD; independently MATCH; **64 hex** verified)
- Consumed research proof: `rp-auto-20260913-us0144-research-techlead-20260915T184300Z-US-0144` / `60382EB2AA2C27583B31E6BF2672660A6B52D2A0C78B40545CD1541239C0E71F` — RUNTIME_PROOF_VALID MATCH before TTL `2026-09-15T19:43:00Z` (consumed_at `2026-09-15T18:51:04Z`; not STALE)
- Consumed research critic proof: `rp-auto-20260913-us0144-sovereign-critic-techlead-20260915T194600Z-US-0144` / `339A5728D54AD589998FDC93D429963CE83FCFAAA1DE0ECF1E77CF723AF27F60` — independent MATCH (orchestrator MATCH; 64 hex verified)

# US-0146 — CLI, TUI, and operational observability

## Overview

US-0146 delivers sibling operator surfaces `@its-magic/cli` and new `@its-magic/tui` as thin clients of nested `runtime-core/src/operator/` facades. `DEC-0146` and `R-0143` are authoritative. **Approach A1 (A\*)** is locked. Compose US-0140 `CommandRouter` / `PROGRAMMATIC_COMMANDS`, US-0143 `/auto`/`/quick` `RouteScheduled`, US-0141 `AppRuntime` health, US-0142 browser evidence read APIs, US-0139 index, US-0080 token-cost evidence (read-only), and US-0144 sovereign DTO fields when enabled. No `WorkflowEngine`, `CommandRouter`, or `GateEngine` rewrite. No US-0148 daemon protocol, no kit `cli.json` / plugin `tui.json`, no `.opencode/commands/auto.md` restore, no `.env` access.

**Research anchor**: **R-0143** (DQ1–DQ10 LOCKED). **Companion DEC**: **DEC-0146** (Accepted — authored THIS phase). **baseline_h2_count (pre-mutate)**: `0`.
**Fresh context marker**: `tl-US0146-architecture-20260917T185000Z-fresh`
**Orchestrator run id**: `auto-20260917-us0146`
**Timestamp**: 2026-09-17T18:50:00Z (UTC)
**Verdict**: PASS
**Next**: `/sprint-plan` **S0153** (fresh **tech-lead**). CROSS_MODEL_REVIEW=0 — do **not** spawn sovereign-critic from this subagent. Status remains OPEN. AC-1..AC-8 remain unchecked.

## Locked design (A1)

| DQ | Lock |
|----|------|
| DQ1 | Sibling `standalone/apps/cli` + `standalone/apps/tui`; `runtime-core/src/operator/` facades; Pi only on `auth`/`models` |
| DQ2 | `OperatorCommandFacade` → `CommandRouter` / programmatic + scheduler paths; REPL argv parity |
| DQ3 | `OperatorObservabilityService.buildStatusSnapshot()` — read-only compose of runs, repo, app, index, browser, token-cost, sovereign |
| DQ4 | `buildRunTimeline()` — `RunsStore` audit + repo evidence; honest divergence labels |
| DQ5 | TUI client-only; **readline + ANSI** panels; typed DTO subscriptions |
| DQ6 | `buildMetricsSnapshot()` — US-0080 authoritative + derived counters; no `token_cost_runs` append from CLI/TUI |
| DQ7 | `OperatorPrompts` — Win/Linux width ≥40; `ITS_MAGIC_APPROVE` / pinned `--yes`/`--no`; else `OPERATOR_INPUT_REQUIRED` |
| DQ8 | Log/event cap **200 lines** / **32 KiB** visible + evidence footer; stream backpressure |
| DQ9 | In-process `OperatorSession` attach/reconnect/cancel; not US-0148 |
| DQ10 | Nine `test_us0146_*`; kit omits `standalone/`; **R-0143**; expected sprint **S0153** |

### Module pins

- `standalone/packages/runtime-core/src/operator/operator-command-facade.ts` — command + scheduler delegation
- `standalone/packages/runtime-core/src/operator/operator-observability-service.ts` — status, timeline, metrics
- `standalone/packages/runtime-core/src/operator/operator-prompts.ts` — shared approval UX
- `standalone/packages/runtime-core/src/operator/operator-session.ts` — in-process attach/reconnect/cancel handle
- `standalone/apps/cli` — complete stub; REPL + argv entry
- `standalone/apps/tui` — new package; panel layout + narrow-terminal collapse order: phase > status > timeline > tools

### Risks (architecture-owned)

| Risk | Mitigation |
|------|------------|
| Router table fork in CLI | Facade-only entry; contract parity test |
| TUI imports workflow internals | Package import ban in `test_us0146_tui_panels_client_only_boundaries` |
| Metrics ledger dual-write | Read-only observability service; US-0080 producers unchanged |
| OpenCode host confusion | BUG-0021/0023 DONE — standalone surface distinct; no plugin `tui.json` |
| US-0145/0147/0148 scope creep | Explicit OUT; compose boundaries in DEC-0146 |

## AC coverage

| AC | Architecture owner | Tests |
|----|-------------------|-------|
| AC-1 | DQ2 facade + auth delegate | `test_us0146_cli_command_parity_programmatic_and_scheduler`, `test_us0146_cli_auth_models_delegate_isolated` |
| AC-2 | DQ3 status snapshot | `test_us0146_status_snapshot_compose_read_only` |
| AC-3 | DQ4 timeline | `test_us0146_run_timeline_evidence_links` |
| AC-4 | DQ5 TUI client | `test_us0146_tui_panels_client_only_boundaries` |
| AC-5 | DQ6 metrics | `test_us0146_metrics_token_cost_compose_no_conflict` |
| AC-6 | DQ7 prompts | `test_us0146_approval_prompt_interactive_noninteractive` |
| AC-7 | DQ8 bounded logs | `test_us0146_bounded_log_summary_evidence_ref` |
| AC-8 | DQ9 session + DQ10 harness | `test_us0146_local_reconnect_cancel_narrow_terminal` |

## Test contract

1. `test_us0146_cli_command_parity_programmatic_and_scheduler` — AC-1 argv + slash mapping; `/auto`/`/quick` scheduled.
2. `test_us0146_cli_auth_models_delegate_isolated` — AC-1 `auth`/`models` use `dispatchItsmCommand` only; workflow stub removed.
3. `test_us0146_status_snapshot_compose_read_only` — AC-2 fields; no dual-write token ledger.
4. `test_us0146_run_timeline_evidence_links` — AC-3 ordering, rework, evidence refs.
5. `test_us0146_tui_panels_client_only_boundaries` — AC-4 no `CommandRouter` import in tui workflow path.
6. `test_us0146_metrics_token_cost_compose_no_conflict` — AC-5 US-0080 authority + derived counters.
7. `test_us0146_approval_prompt_interactive_noninteractive` — AC-6 Win/Linux width + non-interactive fail-closed.
8. `test_us0146_bounded_log_summary_evidence_ref` — AC-7 truncation + pointer.
9. `test_us0146_local_reconnect_cancel_narrow_terminal` — AC-8 attach/detach, cancel, cols≤40 layout.

## Sprint seeds

- T-anch: DEC-0146 and this `# US-0146` section.
- T-001: `operator/` module exports + facade skeleton.
- T-002: `OperatorCommandFacade` programmatic + scheduler parity.
- T-003: `auth`/`models` delegate isolation (US-0135).
- T-004: `buildStatusSnapshot` compose (US-0141/0142/0139/0080/0144).
- T-005: `buildRunTimeline` + evidence links.
- T-006: `buildMetricsSnapshot` + stale/missing flags.
- T-007: `OperatorPrompts` interactive/non-interactive.
- T-008: bounded logs + `OperatorSession` attach/cancel.
- T-009: `@its-magic/cli` REPL/argv completion.
- T-010: `@its-magic/tui` panels + narrow layout.
- T-011: nine contract tests (`test_us0146_*`).

AC coverage is surjective across T-001..T-011; sprint-plan owns **S0153** materialization (≤12 tasks; reconcile T-anch..T-011 to cap). ultra_lean: plan-verify skipped after sprint-plan.

## Template parity (FRAMEWORK_KIT_REPO=1)

- Kit `package.json` `files` continue to omit `standalone/`; do not add standalone to kit workspaces.
- No kit `cli.json`; no plugin-local `its-magic-auto/tui.json`; no `auto.md` restore.
- `template/` mirrors command/docs policy only when sprint/execute explicitly requires — not in this architecture phase.

## Isolation evidence (US-0048 / DEC-0029)

- `phase_id=architecture`, `role=tech-lead`, `story_id=US-0146`, `sprint_id=none` (S0153 expected at sprint-plan)
- `delivery_mode=ultra_lean`, `macro_phase=plan`
- `model_id=inherit` (CROSS_MODEL_REVIEW=0)
- `fresh_context_marker=tl-US0146-architecture-20260917T185000Z-fresh`, `timestamp=2026-09-17T18:50:00Z` (UTC)
- `evidence_ref=docs/engineering/research.md ## R-0143; docs/product/backlog.md ## US-0146; docs/engineering/architecture.md (this # US-0146); decisions/DEC-0146.md; docs/engineering/decisions.md; handoffs/resume_brief.md; handoffs/po_to_tl.md`
- Fresh tech-lead subagent per BUG-0006; narrow-read only. No `.env`. US-0140..US-0144 DONE compose-only not reopened. US-0145/US-0147/US-0148 OUT. BUG-* not mutated. No `/sprint-plan` spawn from this subagent.

## Strict runtime proof (mirror)

- `runtime_proof_id=rp-auto-20260917-us0146-architecture-techlead-20260917T185000Z-US-0146`
- Canonical hashed payload (DEC-0038, `compute_strict_proof_hash` positional): `{"orchestrator_run_id":"auto-20260917-us0146","phase_id":"architecture","proof_issued_at":"2026-09-17T18:50:00Z","proof_ttl_seconds":3600,"role":"tech-lead","runtime_proof_id":"rp-auto-20260917-us0146-architecture-techlead-20260917T185000Z-US-0146"}`
- Isolation extras (not hashed): `delivery_mode=ultra_lean`, `macro_phase=plan`, `model_id=inherit`, `sprint_id=none`, `story_id=US-0146`
- `proof_hash=5CD3C53F4B194541E3182C1DC53FE3D0C83FE3BEF986B10B509F922E5ED829F1`
- `proof_ttl=2026-09-17T19:50:00Z`
- `hash_recompute_confirmation=true` (compute_strict_proof_hash → 5CD3C53F4B194541E3182C1DC53FE3D0C83FE3BEF986B10B509F922E5ED829F1; independently MATCH; **64 hex** verified)
- Consumed research proof: `rp-auto-20260917-us0146-research-techlead-20260917T184200Z-US-0146` / `75561131E844072FCD975F9A74C3831DF311E87074406C21B014EA42A69ACEDA` — RUNTIME_PROOF_VALID MATCH before TTL `2026-09-17T19:42:00Z` (consumed_at `2026-09-17T18:50:00Z`; not STALE)

# US-0147 — Installation, update, and existing-project adoption

## Overview

US-0147 delivers triple-installer parity bootstrap for the standalone operator product: template-mirrored `.its-magic/standalone/` workspace, `itsm` shim, kernel-bridge preflight, `runtime-metadata.json`, adoption classifier, explicit browser setup, and uninstall/coexistence semantics. `DEC-0147` and `R-0144` are authoritative. **Approach A1 (A\*)** is locked. Compose US-0146 delivered CLI/TUI/operator facades (wire only — do not rewrite `runtime-core/src/operator/`), US-0134 kernel-bridge handshake, US-0008/US-0018 installers + manifest, US-0055 installer QA patterns, US-0142 browser-uat for `itsm setup browser`. No host `.cursor/` / `.opencode/` rewrite. No US-0148 daemon protocol. No kit `cli.json` / plugin `tui.json`. No `.env` access.

**Research anchor**: **R-0144** (DQ1–DQ10 LOCKED). **Companion DEC**: **DEC-0147** (Accepted — authored THIS phase). **baseline_h2_count (pre-mutate)**: `0`.
**Fresh context marker**: `tl-US0147-architecture-20260917T204000Z-fresh`
**Orchestrator run id**: `auto-20260917-us0146` (drain story **2 of 3**; `backlog_drain_stories_remaining_budget=1`)
**Timestamp**: 2026-09-17T20:40:00Z (UTC)
**Verdict**: PASS
**Next**: `/sprint-plan` **S0154** (fresh **tech-lead**). CROSS_MODEL_REVIEW=0 — do **not** spawn sovereign-critic from this subagent. Status remains OPEN. AC-1..AC-8 remain unchecked.

## Locked design (A1)

| DQ | Lock |
|----|------|
| DQ1 | Template mirror → `.its-magic/standalone/`; kit `files` omit root `standalone/`; FRAMEWORK_KIT_REPO in-tree pin for kit-dev |
| DQ2 | `bootstrap_standalone_runtime_installer_hook` in `installer.py`; PS1/sh parity; repair via `--standalone-bootstrap` |
| DQ3 | `classifyProjectAdoptionProfile` + US-0134 locate; `ADOPT_PARTIAL_MARKERS` fail-closed |
| DQ4 | Fresh init via `template/` skeleton; no US-0001..0132 backlog clone |
| DQ5 | `install_include_paths` vs `deny_overwrite`; staged rollback `INSTALL_INTERRUPTED_ROLLBACK_OK` |
| DQ6 | Kernel preflight before shim; `.its-magic/standalone/runtime-metadata.json` |
| DQ7 | Explicit `itsm setup browser`; `ITS_MAGIC_INSTALL_BROWSER=1` opt-in silent path |
| DQ8 | No `LegacyScratchpadAdapter` at install; `SCRATCHPAD_LEGACY_KEYS_PRESENT` WARN only |
| DQ9 | `uninstall-standalone` removes standalone tree/shims; preserves hosts + user layers |
| DQ10 | Ten `test_us0147_*`; **R-0144**; expected sprint **S0154** |

### Path and hook pins

- `docs/engineering/context/installer-owned-paths.manifest` (+ `template/` mirror) — additive standalone paths, `deny_overwrite`, staging dir
- `template/.its-magic/standalone/` — workspace mirror (apps/cli, apps/tui, packages/*, lockfile)
- `installer.py` — `bootstrap_standalone_runtime_installer_hook` (post host-config refresh, pre runbook bootstrap)
- `.its-magic/bin/itsm` — primary shim → standalone workspace `apps/cli` bin; optional `bin/itsm` opt-in only
- `.its-magic/standalone/runtime-metadata.json` — kernel/contract/browser_prereq summary
- `.its-magic/install-staging/<run_id>/` — interrupted update staging
- `classifyProjectAdoptionProfile` — installer module (Python); compose kernel-bridge locate
- `itsm setup browser` — delegates to US-0142 Playwright install scoped under standalone `node_modules`

### Reason codes (architecture-owned)

| Code | When |
|------|------|
| `STANDALONE_BOOTSTRAP_FAILED` | Hook/npm ci failure |
| `ADOPT_PARTIAL_MARKERS` | 1–2 of 3 kernel markers |
| `INSTALL_INTERRUPTED_ROLLBACK_OK` | Staging rollback success |
| `INSTALL_BROWSER_OFFLINE` | Airgap browser setup |
| `SCRATCHPAD_LEGACY_KEYS_PRESENT` | Advisory WARN |
| `KIT_VERSION_COEXISTENCE` | `.its-magic-version` mismatch advisory |
| `KERNEL_*` | Compose US-0134 (no duplicate validator) |

### Risks (architecture-owned)

| Risk | Mitigation |
|------|------------|
| Installer triple drift | Single Python hook entry; US-0055 parity tests |
| Overwrite user backlog on adopt | deny_overwrite + no historical backlog copy |
| Publish guard regression | No root `standalone/` in `files`; manifest parity test |
| Operator expects daemon reconnect | Document US-0146 in-process session; US-0148 OUT |
| US-0145 deploy scope creep | Explicit OUT in DEC-0147 |

## AC coverage

| AC | Architecture owner | Tests |
|----|-------------------|-------|
| AC-1 | DQ1+2+6+7 install/update/rollback/browser | `test_us0147_fresh_install_manifest_parity`, `test_us0147_interrupted_update_rollback`, `test_us0147_kernel_mismatch_fail_closed`, `test_us0147_browser_setup_explicit_gate` |
| AC-2 | DQ4 fresh skeleton | `test_us0147_fresh_install_manifest_parity` |
| AC-3 | DQ3 adopt | `test_us0147_adopt_cursor_only_repo`, `test_us0147_adopt_opencode_only_repo`, `test_us0147_adopt_both_hosts_repo` |
| AC-4 | DQ3 host coexistence | adopt matrix (no host tree mutation) |
| AC-5 | DQ5 preservation | `test_us0147_upgrade_preserves_user_layers` |
| AC-6 | DQ6 diagnostics | `test_us0147_kernel_mismatch_fail_closed` |
| AC-7 | DQ8+9+runbook | `test_us0147_runbook_sections_present`, `test_us0147_uninstall_preserves_hosts` |
| AC-8 | DQ10 lifecycle matrix | all ten `test_us0147_*` Win+Linux |

## Test contract

1. `test_us0147_fresh_install_manifest_parity` — AC-1/AC-2 triple-installer + template mirror.
2. `test_us0147_upgrade_preserves_user_layers` — AC-5 locals untouched.
3. `test_us0147_adopt_cursor_only_repo` — AC-3/AC-4 cursor-only profile.
4. `test_us0147_adopt_opencode_only_repo` — AC-3/AC-4 opencode-only profile.
5. `test_us0147_adopt_both_hosts_repo` — AC-3/AC-4 both-host profile.
6. `test_us0147_interrupted_update_rollback` — AC-1 staging rollback.
7. `test_us0147_kernel_mismatch_fail_closed` — AC-6 `KERNEL_*` / preflight.
8. `test_us0147_browser_setup_explicit_gate` — AC-1 explicit browser prereq.
9. `test_us0147_uninstall_preserves_hosts` — AC-7/AC-9 host preservation.
10. `test_us0147_runbook_sections_present` — AC-7 runbook + template parity sections.

## Sprint seeds

- T-anch: DEC-0147 and this `# US-0147` section.
- T-001: manifest + template `.its-magic/standalone/` mirror scaffolding.
- T-002: `bootstrap_standalone_runtime_installer_hook` + triple-installer wiring.
- T-003: `classifyProjectAdoptionProfile` + `ADOPT_PARTIAL_MARKERS`.
- T-004: fresh init + deny_overwrite preservation matrix.
- T-005: staging dir + interrupted rollback (`INSTALL_INTERRUPTED_ROLLBACK_OK`).
- T-006: kernel preflight + `runtime-metadata.json`.
- T-007: `itsm` shim + optional repo-root `bin/itsm` opt-in.
- T-008: `itsm setup browser` + metadata flags.
- T-009: `uninstall-standalone` + `KIT_VERSION_COEXISTENCE` advisory.
- T-010: runbook + template operator doc parity (AC-7).
- T-011: ten `test_us0147_*` pytest/installer fixtures.

AC coverage is surjective across T-001..T-011; sprint-plan owns **S0154** materialization (≤12 tasks; reconcile T-anch..T-011 to cap). ultra_lean: plan-verify skipped after sprint-plan.

## Template parity (FRAMEWORK_KIT_REPO=1)

- Kit `package.json` `files` continue to omit repo-root `standalone/`; standalone delivered via `template/.its-magic/standalone/` mirror + post-install `npm ci`.
- No kit `cli.json`; no plugin-local `its-magic-auto/tui.json`; no `auto.md` restore.
- `template/` manifest updates mirror active `installer-owned-paths.manifest` entries for standalone paths.

## Isolation evidence (US-0048 / DEC-0029)

- `phase_id=architecture`, `role=tech-lead`, `story_id=US-0147`, `sprint_id=none` (S0154 expected at sprint-plan)
- `delivery_mode=ultra_lean`, `macro_phase=plan`, `drain_story_index=2 of 3`
- `model_id=inherit` (CROSS_MODEL_REVIEW=0)
- `fresh_context_marker=tl-US0147-architecture-20260917T204000Z-fresh`, `timestamp=2026-09-17T20:40:00Z` (UTC)
- `evidence_ref=docs/engineering/research.md ## R-0144; docs/product/backlog.md ## US-0147 discovery_notes; docs/engineering/architecture.md (this # US-0147); decisions/DEC-0147.md; docs/engineering/decisions.md; handoffs/resume_brief.md; handoffs/po_to_tl.md`
- Fresh tech-lead subagent per BUG-0006; narrow-read only. No `.env`. US-0140..US-0146 DONE compose-only (US-0146 install wiring IN). US-0145/US-0148 OUT. BUG-0022 OPEN not drained. No `/sprint-plan` spawn from this subagent.

## Strict runtime proof (mirror)

- `runtime_proof_id=rp-auto-20260917-us0146-architecture-techlead-20260917T204000Z-US-0147`
- Canonical hashed payload (DEC-0038, `compute_strict_proof_hash` positional): `{"orchestrator_run_id":"auto-20260917-us0146","phase_id":"architecture","proof_issued_at":"2026-09-17T20:40:00Z","proof_ttl_seconds":3600,"role":"tech-lead","runtime_proof_id":"rp-auto-20260917-us0146-architecture-techlead-20260917T204000Z-US-0147"}`
- Isolation extras (not hashed): `delivery_mode=ultra_lean`, `macro_phase=plan`, `model_id=inherit`, `sprint_id=none`, `story_id=US-0147`, `drain_story_index=2 of 3`
- `proof_hash=90A68CD12FB24348890E4DCE47CDCE639736C67C6D91F3914542BFF282A366AD`
- `proof_ttl=2026-09-17T21:40:00Z`
- `hash_recompute_confirmation=true` (compute_strict_proof_hash → 90A68CD12FB24348890E4DCE47CDCE639736C67C6D91F3914542BFF282A366AD; independently MATCH; **64 hex** verified)
- Consumed research proof: `rp-auto-20260917-us0146-research-techlead-20260917T203000Z-US-0147` / `96C81771F5CE812898410E6F551A0C209475E9F31696EA13B07E7CDB1FC39237` — RUNTIME_PROOF_VALID MATCH before TTL `2026-09-17T21:30:00Z` (consumed_at `2026-09-17T20:40:00Z`; not STALE)

# US-0145 — Parallel development, release/deploy, self-healing, and closure

## Overview

US-0145 delivers optional parallel DEV arbitration and typed release/deploy with bounded post-deploy self-healing, composing existing US-0108/US-0109 Python libs through a delivery bridge without rewriting US-0143 drain or amending `RELEASE_GATE_ORDER`. `DEC-0145` and `R-0145` are authoritative. **Approach A1 (A\*)** is locked. Compose US-0140 closure/release ownership, US-0143 scheduling, US-0146 operator observe-only, US-0147 install paths (no deploy install coupling). No US-0148 daemon protocol. No live npm-publish/git-push in tests. No `.env` access.

**Research anchor**: **R-0145** (DQ1–DQ10 LOCKED). **Companion DEC**: **DEC-0145** (Accepted — authored THIS phase). **baseline_h2_count (pre-mutate)**: `0`.
**Fresh context marker**: `tl-US0145-architecture-20260917T223000Z-fresh`
**Orchestrator run id**: `auto-20260917-us0146` (drain story **3 of 3**; `backlog_drain_stories_remaining_budget=0`)
**Timestamp**: 2026-09-17T22:30:00Z (UTC)
**Verdict**: PASS
**Next**: `/sprint-plan` **S0155** (fresh **tech-lead**). CROSS_MODEL_REVIEW=0 — do **not** spawn sovereign-critic from this subagent. Status remains OPEN. AC-1..AC-9 remain unchecked.

## Locked design (A1)

| DQ | Lock |
|----|------|
| DQ1 | `ParallelDevCoordinator` in `workflow/delivery/`; WorkflowEngine post-execute hook; US-0143 drain unchanged |
| DQ2 | Bridge → `parallel_dev_arbiter.py`; `.its-magic/worktrees/<run_id>/`; PolicyEngine allowlist additive |
| DQ3 | Fresh `qa-arbiter` session; evidence packages; merge/reject/conflict paths |
| DQ4 | `DeliveryResourceGuard`; scratchpad + US-0080 + concurrency caps |
| DQ5 | `ReleaseTargetAdapter` registry (git_github, npm, ssh_command, docker, custom_command); deploy results ledger |
| DQ6 | Additive `ReleaseGateInput`; `RELEASE_GATE_ORDER` literal unamended |
| DQ7 | `ReleaseDeployPipeline.runPostDeployHealing()` → `self_healing_deploy_lib.py`; bounded DEV repair |
| DQ8 | `DEPLOY_DEFERRED`; no RELEASE_PASS on deploy fail; US-0146 `deploy_state=deferred` |
| DQ9 | `releaseCannotMarkDone` + `applyClosure` sole DONE authority |
| DQ10 | Twelve `test_us0145_*`; **R-0145**; expected sprint **S0155** |

### Path and module pins

- `standalone/packages/runtime-core/src/workflow/delivery/parallel-dev.ts` — `ParallelDevCoordinator`
- `standalone/packages/runtime-core/src/workflow/delivery/release-deploy.ts` — `ReleaseDeployPipeline`, `ReleaseTargetKind`, adapters
- `standalone/packages/runtime-core/src/workflow/delivery/resource-guard.ts` — `DeliveryResourceGuard`
- `standalone/packages/kernel-bridge/src/` — `runDeliveryOperation(op, payload)` closed surface
- `scripts/delivery_runtime_bridge.py` — dispatch to `parallel_dev_arbiter.py` / `self_healing_deploy_lib.py`
- `.its-magic/worktrees/<run_id>/` — parallel worktree root (gitignored)
- `handoffs/deploy_results/deploy_results.jsonl` — per-target `DeployTargetResult` ledger
- `handoffs/parallel_dev_pick.json` — v1 arbiter pick artifact (DEC-0108)
- `workflow-engine.ts` — hooks after execute PASS; after release artifact PASS before closure handoff

### Bridge operations (architecture-owned)

| Op | Purpose |
|----|---------|
| `parallel_dev_spawn` | Start N parallel DEV sessions against worktrees |
| `parallel_dev_create_worktrees` | Git worktree CRUD via US-0108 |
| `parallel_dev_list_active` | List active worktrees for run |
| `parallel_dev_cleanup_orphans` | End-of-run + resume orphan discard |
| `parallel_dev_merge_winner` | Controlled merge after QA arbiter |
| `deploy_smoke_probe` | Post-deploy health/smoke |
| `deploy_healing_retry` | Bounded repair loop via US-0109 |

### Feature flags (default-off)

- `SOVEREIGN_PARALLEL_DEV=0` — parallel coordinator no-op; byte-identical execute path
- `AUTO_SOVEREIGN_SELF_HEALING_DEPLOY=0` — deploy/healing pipeline no-op when disabled

### Reason codes (architecture-owned)

| Code | When |
|------|------|
| `PARALLEL_DEV_WORKTREE_CREATE_FAILED` | Git missing or worktree create error |
| `PARALLEL_DEV_SELECTION_NO_PASS` | QA arbiter rejects all candidates |
| `PARALLEL_DEV_MERGE_TIMEOUT` | Merge op exceeded timeout |
| `PARALLEL_DEV_RESOURCE_CAP_EXHAUSTED` | Parallel cap hit |
| `DELIVERY_WALL_CLOCK_EXCEEDED` | Delivery wall clock cap |
| `DELIVERY_TOKEN_BUDGET_EXHAUSTED` | US-0080 budget exceeded |
| `DELIVERY_CONCURRENT_TEST_CAP` | Test worker cap |
| `DEPLOY_DEFERRED` / `DEPLOY_HEALING_DEFERRED` | Exhausted healing (US-0107 deferral) |

### Risks (architecture-owned)

| Risk | Mitigation |
|------|------------|
| Git worktree flaky on Windows | Fake-git contract doubles; fail-closed create |
| Gate order regression | Golden test on `RELEASE_GATE_ORDER` literal |
| Release marks DONE | `test_us0145_release_cannot_mark_done` + `releaseCannotMarkDone` |
| US-0143 drain creep | Coordinator orthogonal; no CommandRouter edits |
| US-0148 scope creep | In-process delivery only; no daemon protocol |

## AC coverage

| AC | Architecture owner | Tests |
|----|-------------------|-------|
| AC-1 | DQ1+DQ2 isolation + default-off | `test_us0145_parallel_default_off_byte_identical`, `test_us0145_worktree_isolation_no_main_mutation` |
| AC-2 | DQ4 resource guards | `test_us0145_resource_guard_fail_closed` |
| AC-3 | DQ3 QA arbiter | `test_us0145_qa_arbiter_fresh_session_winner_merge`, `test_us0145_qa_arbiter_reject_all_evidence` |
| AC-4 | DQ5 target kinds | `test_us0145_release_target_matrix_dry_run` |
| AC-5 | DQ6 gates + targets | `test_us0145_release_gates_compose_order_unchanged`, `test_us0145_deploy_target_failure_no_release_pass` |
| AC-6 | DQ7 smoke repair | `test_us0145_smoke_repair_success_bounded`, `test_us0145_smoke_repair_exhausted_deferred` |
| AC-7 | DQ8 deferral truth | `test_us0145_smoke_repair_exhausted_deferred`, `test_us0145_deploy_target_failure_no_release_pass` |
| AC-8 | DQ9 closure boundary | `test_us0145_release_cannot_mark_done`, `test_us0145_closure_requires_valid_release_envelope` |
| AC-9 | DQ10 ownership matrix | all twelve `test_us0145_*` |

## Test contract

1. `test_us0145_parallel_default_off_byte_identical` — AC-1 default-off boundary.
2. `test_us0145_worktree_isolation_no_main_mutation` — AC-1 main tree read-only until merge.
3. `test_us0145_resource_guard_fail_closed` — AC-2 caps.
4. `test_us0145_qa_arbiter_fresh_session_winner_merge` — AC-3 winner path.
5. `test_us0145_qa_arbiter_reject_all_evidence` — AC-3 reject-all path.
6. `test_us0145_release_target_matrix_dry_run` — AC-4 kinds smoke.
7. `test_us0145_release_gates_compose_order_unchanged` — AC-5 gate order held.
8. `test_us0145_deploy_target_failure_no_release_pass` — AC-5/AC-7 no false PASS.
9. `test_us0145_smoke_repair_success_bounded` — AC-6 repair success.
10. `test_us0145_smoke_repair_exhausted_deferred` — AC-6/AC-7 deferral.
11. `test_us0145_release_cannot_mark_done` — AC-8/AC-9 release ownership.
12. `test_us0145_closure_requires_valid_release_envelope` — AC-8/AC-9 closure envelope.

## Sprint seeds

- T-anch: DEC-0145 and this `# US-0145` section.
- T-001: `delivery_runtime_bridge.py` + `runDeliveryOperation` kernel-bridge surface.
- T-002: `ParallelDevCoordinator` + WorkflowEngine post-execute hook (default-off).
- T-003: worktree bridge ops + PolicyEngine allowlist for `.its-magic/worktrees/`.
- T-004: QA arbiter session + evidence packages + merge/reject paths.
- T-005: `DeliveryResourceGuard` + reason codes.
- T-006: `ReleaseTargetAdapter` registry + dry-run/apply/verify + deploy results ledger.
- T-007: additive `ReleaseGateInput` conjuncts (order array frozen).
- T-008: `ReleaseDeployPipeline` + post-deploy healing bridge ops.
- T-009: deferral/truthfulness wiring (`DEPLOY_DEFERRED`, release evidence fail-closed).
- T-010: closure/release ownership guards compose US-0140.
- T-011: twelve `test_us0145_*` contract tests (fake git/target doubles).

AC coverage is surjective across T-001..T-011; sprint-plan owns **S0155** materialization (≤12 tasks; reconcile T-anch..T-011 to cap). ultra_lean: plan-verify skipped after sprint-plan.

## Template parity (FRAMEWORK_KIT_REPO=1)

- Kit `package.json` `files` continue to omit repo-root `standalone/`; delivery code lives under standalone workspace only.
- No kit `cli.json`; no plugin-local `its-magic-auto/tui.json`; no `auto.md` restore.
- Python bridge scripts remain at repo `scripts/` (compose US-0108/US-0109).

## Isolation evidence (US-0048 / DEC-0029)

- `phase_id=architecture`, `role=tech-lead`, `story_id=US-0145`, `sprint_id=none` (S0155 expected at sprint-plan)
- `delivery_mode=ultra_lean`, `macro_phase=plan`, `drain_story_index=3 of 3`
- `model_id=inherit` (CROSS_MODEL_REVIEW=0)
- `fresh_context_marker=tl-US0145-architecture-20260917T223000Z-fresh`, `timestamp=2026-09-17T22:30:00Z` (UTC)
- `evidence_ref=docs/engineering/research.md ## R-0145; docs/product/backlog.md ## US-0145 discovery_notes; docs/engineering/architecture.md (this # US-0145); decisions/DEC-0145.md; docs/engineering/decisions.md; handoffs/resume_brief.md; handoffs/po_to_tl.md`
- Fresh tech-lead subagent per BUG-0006; narrow-read only. No `.env`. US-0140..US-0147 DONE compose-only. US-0148 OUT. BUG-0022 OPEN not drained. No `/sprint-plan` spawn from this subagent.

## Strict runtime proof (mirror)

- `runtime_proof_id=rp-auto-20260917-us0146-architecture-techlead-20260917T223000Z-US-0145`
- Canonical hashed payload (DEC-0038, `compute_strict_proof_hash` positional): `{"orchestrator_run_id":"auto-20260917-us0146","phase_id":"architecture","proof_issued_at":"2026-09-17T22:30:00Z","proof_ttl_seconds":3600,"role":"tech-lead","runtime_proof_id":"rp-auto-20260917-us0146-architecture-techlead-20260917T223000Z-US-0145"}`
- Isolation extras (not hashed): `delivery_mode=ultra_lean`, `macro_phase=plan`, `model_id=inherit`, `sprint_id=none`, `story_id=US-0145`, `drain_story_index=3 of 3`
- `proof_hash=80F3C316829DD9A44996EE4BD61E4FF3AAC0FCF3DC276D02B7FC9585FDA5FBE9`
- `proof_ttl=2026-09-17T23:30:00Z`
- `hash_recompute_confirmation=true` (compute_strict_proof_hash → 80F3C316829DD9A44996EE4BD61E4FF3AAC0FCF3DC276D02B7FC9585FDA5FBE9; independently MATCH; **64 hex** verified)
- Consumed research proof: `rp-auto-20260917-us0146-research-techlead-20260917T220000Z-US-0145` / `CBBD28E0CA404A019F3919AA8870EA7FCC2699CC7AD4576F5F9CEA0323F222C6` — RUNTIME_PROOF_VALID MATCH before TTL `2026-09-17T23:00:00Z` (consumed_at `2026-09-17T22:30:00Z`; not STALE)

# US-0148 — Stable control protocol and recoverable daemon

## Overview

US-0148 delivers a versioned local control protocol and thin recoverable daemon so CLI/TUI attach cross-process to long-running workflow work with ordered events, reconnect replay, local security, and restart reconciliation — without moving workflow rules out of `runtime-core`. `DEC-0148` and `R-0148` are authoritative. **Approach A1 (A\*)** is locked. Compose US-0146 operator facades and command vocabulary (clients migrate to `DaemonTransport`); US-0136 fresh sessions on resume; US-0135 redaction; `runs/store` + `crashResume()`. No US-0145 delivery logic in daemon. No deferred rich clients v1. No kit `cli.json` / plugin `tui.json`. No `.env` access.

**Research anchor**: **R-0148** (DQ1–DQ10 LOCKED). **Companion DEC**: **DEC-0148** (Accepted — authored THIS phase). **baseline_h2_count (pre-mutate)**: `0`.
**Fresh context marker**: `tl-US0148-architecture-20260917T211400Z-fresh`
**Orchestrator run id**: `auto-20260917-us0148` (drain story **1 of 3**; `backlog_drain_stories_remaining_budget=2`)
**Timestamp**: 2026-09-17T21:14:00Z (UTC)
**Verdict**: PASS
**Next**: `/sprint-plan` **S0156** (fresh **tech-lead**). CROSS_MODEL_REVIEW=0 — do **not** spawn sovereign-critic from this subagent. Status remains OPEN. AC-1..AC-8 remain unchecked.

## Locked design (A1)

| DQ | Lock |
|----|------|
| DQ1 | JSON-RPC 2.0 on loopback HTTP (`127.0.0.1`/`::1`); WebSocket `/v1/events`; `.its-magic/daemon/listen.json` |
| DQ2 | `@its-magic/protocol` + `apps/daemon`; client in `runtime-core/src/daemon-client/` |
| DQ3 | Per-run SQLite `seq` log; `after_seq` replay; `DAEMON_EVENT_LAG_MAX` summary mode |
| DQ4 | `OperatorTransport` + `DaemonTransport` / `InProcessTransport`; US-0146 tests in-process only |
| DQ5 | `daemon.hello` capability negotiation; `PROTOCOL_VERSION_MISMATCH` fail-closed |
| DQ6 | Startup `crashResume` + `reconcileOperationalLedger`; fresh role sessions only |
| DQ7 | Bearer token file; controller vs observer; default-deny remote bind |
| DQ8 | `redactEventPayload()` on all wire paths |
| DQ9 | One controller + N observers; approval/cancel delegation |
| DQ10 | Twelve `test_us0148_*`; doc `docs/engineering/operator/daemon-protocol.md`; sprint **S0156** |

### Path and RPC pins

- `standalone/packages/protocol/` — schemas, types, `redactEventPayload`, protocol-client surface
- `standalone/apps/daemon/` — JSON-RPC + WebSocket listener; delegates to operator/workflow facades
- `runtime-core/src/daemon-client/` — `DaemonTransport` implementation for cli/tui
- `.its-magic/daemon/listen.json` — `host`, `port`, `protocol_version`
- `.its-magic/daemon/client.token` — ephemeral bearer (0600-class)
- Event persistence — SQLite table keyed by `run_id` + `seq` (daemon-owned DB path architecture-pinned under `.its-magic/daemon/`)

### JSON-RPC method pins

| Method | Purpose |
|--------|---------|
| `daemon.ping` | Liveness |
| `daemon.hello` | Version + capabilities + client identity |
| `run.start` | Begin run under daemon |
| `run.attach` | Attach with controller/observer role |
| `command.submit` | Delegate to `OperatorCommandFacade` |
| `approval.respond` | Approval path (controller only) |
| `run.cancel` | Stop-matrix / session cancel delegation |
| `status.snapshot` | Bounded status (compose observability caps) |

### Reason codes (architecture-owned)

| Code | When |
|------|------|
| `PROTOCOL_VERSION_MISMATCH` | Client outside supported range |
| `PROTOCOL_COMMAND_UNSUPPORTED` | Method not in server allowlist |
| `DAEMON_UNREACHABLE` | Client cannot connect (actionable start hint) |
| `DAEMON_CONTROLLER_BUSY` | Second controller attach |
| `EVENT_SEQ_GAP` | Replay gap detected |
| `APPROVAL_NO_CONTROLLER` | Approval with no controller attached |
| `RECONCILE_INCOMPLETE` | Post-restart ledger mismatch |
| `DAEMON_EVENT_LAG_MAX` | Client lag; summary mode engaged |

### Risks (architecture-owned)

| Risk | Mitigation |
|------|------------|
| US-0146 contract break | In-process transport for `test_us0146_*` |
| Unbounded event RAM | SQLite log + retention cap |
| Multi-user localhost | Bearer token required |
| Workflow duplication in daemon | Delegation-only; `test_us0148_daemon_delegates_no_duplicate_workflow` |
| US-0145 scope creep | No delivery/deploy in daemon |

## AC coverage

| AC | Architecture owner | Tests |
|----|-------------------|-------|
| AC-1 | DQ2+DQ5 schemas | `test_us0148_schema_command_event_roundtrip`, `test_us0148_protocol_version_mismatch_fail_closed` |
| AC-2 | DQ4 delegation | `test_us0148_daemon_delegates_no_duplicate_workflow` |
| AC-3 | DQ3+DQ4 attach/reconnect | `test_us0148_cli_attach_ordered_events`, `test_us0148_reconnect_replay_after_seq` |
| AC-4 | DQ1+DQ7+DQ8 security | `test_us0148_loopback_bind_default_deny_remote`, `test_us0148_wire_payload_secret_redaction` |
| AC-5 | DQ5 negotiation | `test_us0148_protocol_version_mismatch_fail_closed` |
| AC-6 | DQ6 restart | `test_us0148_crash_restart_reconcile_fresh_sessions` |
| AC-7 | DQ9+DQ10 concurrency | `test_us0148_event_backpressure_summary_mode`, `test_us0148_concurrent_observer_controller_roles`, `test_us0148_approval_routing_single_controller`, `test_us0148_cancel_propagates_to_runtime` |
| AC-8 | DQ10 docs | `docs/engineering/operator/daemon-protocol.md` + full `test_us0148_*` matrix |

## Test contract

1. `test_us0148_protocol_version_mismatch_fail_closed` — AC-5.
2. `test_us0148_schema_command_event_roundtrip` — AC-1.
3. `test_us0148_daemon_delegates_no_duplicate_workflow` — AC-2.
4. `test_us0148_cli_attach_ordered_events` — AC-3.
5. `test_us0148_reconnect_replay_after_seq` — AC-3 / AC-7.
6. `test_us0148_loopback_bind_default_deny_remote` — AC-4.
7. `test_us0148_wire_payload_secret_redaction` — AC-4.
8. `test_us0148_event_backpressure_summary_mode` — AC-7.
9. `test_us0148_concurrent_observer_controller_roles` — AC-7.
10. `test_us0148_approval_routing_single_controller` — AC-7.
11. `test_us0148_cancel_propagates_to_runtime` — AC-7.
12. `test_us0148_crash_restart_reconcile_fresh_sessions` — AC-6.

## Sprint seeds

- T-anch: DEC-0148 and this `# US-0148` section.
- T-001: `@its-magic/protocol` package (schemas, types, `redactEventPayload`).
- T-002: `apps/daemon` JSON-RPC loopback server + `listen.json` / `client.token`.
- T-003: per-run SQLite event log + workflow/observability hooks.
- T-004: WebSocket `/v1/events` subscribe + `after_seq` replay.
- T-005: `OperatorTransport` + `runtime-core/src/daemon-client/` `DaemonTransport`.
- T-006: CLI/TUI default daemon attach (preserve in-process doubles for US-0146).
- T-007: `daemon.hello` versioning + controller/observer attach roles.
- T-008: startup `crashResume` + `reconcileOperationalLedger` + orphan cleanup TTLs.
- T-009: approval routing + cancel delegation + concurrency audit fields.
- T-010: `docs/engineering/operator/daemon-protocol.md` (AC-8 deferred-client boundary).
- T-011: twelve `test_us0148_*` in `us0148.contract.test.ts` (port 0 fixture).

AC coverage is surjective across T-001..T-011; sprint-plan owns **S0156** materialization (≤12 tasks; reconcile T-anch..T-011 to cap). ultra_lean: plan-verify skipped after sprint-plan.

## Template parity (FRAMEWORK_KIT_REPO=1)

- Kit `package.json` `files` continue to omit repo-root `standalone/`; daemon/protocol live in standalone workspace only (compose US-0147 template mirror — no new mirror required for v1).
- No kit `cli.json`; no plugin-local `its-magic-auto/tui.json`; no `auto.md` restore.

## Isolation evidence (US-0048 / DEC-0029)

- `phase_id=architecture`, `role=tech-lead`, `story_id=US-0148`, `sprint_id=none` (S0156 expected at sprint-plan)
- `delivery_mode=ultra_lean`, `macro_phase=plan`, `drain_story_index=1 of 3`
- `model_id=inherit` (CROSS_MODEL_REVIEW=0)
- `fresh_context_marker=tl-US0148-architecture-20260917T211400Z-fresh`, `timestamp=2026-09-17T21:14:00Z` (UTC)
- `evidence_ref=docs/engineering/research.md ## R-0148; docs/product/backlog.md ## US-0148 discovery_notes; docs/engineering/architecture.md (this # US-0148); decisions/DEC-0148.md; docs/engineering/decisions.md; handoffs/resume_brief.md; handoffs/po_to_tl.md`
- Fresh tech-lead subagent per BUG-0006; narrow-read only. No `.env`. US-0133..US-0147 DONE compose-only (US-0146 client migration IN). BUG-0022 OPEN not drained. No `/sprint-plan` spawn from this subagent.

## Strict runtime proof (mirror)

- `runtime_proof_id=rp-auto-20260917-us0148-architecture-techlead-20260917T211400Z-US-0148`
- Canonical hashed payload (DEC-0038, `compute_strict_proof_hash` positional): `{"orchestrator_run_id":"auto-20260917-us0148","phase_id":"architecture","proof_issued_at":"2026-09-17T21:14:00Z","proof_ttl_seconds":3600,"role":"tech-lead","runtime_proof_id":"rp-auto-20260917-us0148-architecture-techlead-20260917T211400Z-US-0148"}`
- Isolation extras (not hashed): `delivery_mode=ultra_lean`, `macro_phase=plan`, `model_id=inherit`, `sprint_id=none`, `story_id=US-0148`, `drain_story_index=1 of 3`
- `proof_hash=AC546FD44FE347547D9DD92F79C906DC71B2212DD27969336F73F9475C48708D`
- `proof_ttl=2026-09-17T22:14:00Z`
- `hash_recompute_confirmation=true` (compute_strict_proof_hash → AC546FD44FE347547D9DD92F79C906DC71B2212DD27969336F73F9475C48708D; independently MATCH; **64 hex** verified)
- Consumed research proof: `rp-auto-20260917-us0148-research-techlead-20260917T211200Z-US-0148` / `5F986CEE216B57CFD2DB191C8C4CE1CD9539596DCA6A35AEB9E91CE4729B0A4C` — RUNTIME_PROOF_VALID MATCH before TTL `2026-09-17T22:12:00Z` (consumed_at `2026-09-17T21:14:00Z`; not STALE)

# BUG-0025 — npm publish of its-magic omits scripts/standalone_runtime_install_lib.py

## Overview

**`BUG-0025`** closes the **published-kit packaging omit** that leaves global `its-magic@0.1.3` without `scripts/standalone_runtime_install_lib.py`. Operator upgrade/missing then crashes after `HOST_CONFIG_POSTINSTALL_OK` with a raw `FileNotFoundError` from `_load_standalone_runtime_install_lib` → `exec_module`. Repo-local lib exists; root `package.json` `files` does not list it.

Distinct from **BUG-0022 OPEN** / **BUG-0024 OPEN** (do **not** merge or drain). Compose **US-0147 DONE** / **R-0144** / **DEC-0147** — packaging + fail-closed loader + pack/guard + patch republish only; do **not** reopen US-0147 ACs or rewrite hook/adoption/kernel semantics. Semver quirk `0.1.3-11`→`0.1.3` **OUT** of primary scope (optional release-notes note). Do **not** wipe **R-0148** or rewrite historical `# US-0147` / `# US-0148` bodies.

**Research anchor**: **`R-0149`** (DQ1–DQ10 LOCKED; winner **A1**). **Companion DEC**: **none** — this H1 is the sole architecture lock surface. **EARLY_RESEARCH=0**. Optional modes: `CROSS_REPO_OBSERVABILITY=0` / `COMPONENT_SCOPE_MODE=0` / `SPEC_PACK_MODE=0` / `USER_GUIDE_MODE=0` — skipped.

**Fresh context marker**: `tl-BUG0025-architecture-20260918T170000Z-fresh`
**Orchestrator run id**: `auto-20260918-bug0025`
**Parent**: `cursor-20260918-BUG0025-intake`
**Timestamp**: 2026-09-18T17:00:00Z (UTC)
**Verdict**: PASS (`decision_gate=false`)
**Next**: `/sprint-plan` (expected **S0157** — do **not** create this phase)
**baseline_h2_count (pre-mutate)**: `0`

## Approach locked (A1 — from R-0149 DQ1–DQ10)

**Approach A1 (A\*)** (locked):

1. Add **one** root `package.json` `files` entry: **`scripts/standalone_runtime_install_lib.py`**.
2. Harden `installer.py` `_load_standalone_runtime_install_lib`: **`os.path.isfile(lib_path)` before `spec_from_file_location` / `exec_module`** (mirror `_load_doc_profile_lib`); on miss raise/print **`[STANDALONE_BOOTSTRAP_FAILED]`** — **no** raw `FileNotFoundError` as operator-visible outcome. Wrap `bootstrap_standalone_runtime_installer_hook` / `run_standalone_postinstall` so upgrade/missing exits **1** with that token when the lib is absent.
3. Contract tests in **`tests/bug0025_packaging_contract_test.py`** (DQ10 markers below).
4. **Optional**: extend `scripts/guard_installer_publish.py` to assert the allowlist entry (and/or packed path) — keep US-0133 **omit-`standalone/`** intact; never require `standalone/` in `files`.
5. **Patch version bump republish** (e.g. `0.1.3` → `0.1.4`) via existing `RELEASE_PUBLISH_MODE` / release-all path so `npm install -g its-magic@0.1.4` (or `@latest`) includes the lib. Same-line republish of `0.1.3` is fragile (npm immutability) — prefer bump.
6. **Residual (DQ2)**: `load_supported_range(script_dir)` reads `standalone/packages/kernel-bridge/supported-kernel-range.json` under package root — absent on published kit. Fail-closed into **`STANDALONE_BOOTSTRAP_FAILED`** / existing **`KERNEL_*`**. Do **not** add `standalone/` to `files`. Do **not** add a tiny JSON peer to `files` unless execute proves otherwise (default: fail-closed without new entry).

| Option | Summary | Verdict |
|--------|---------|---------|
| **A1** | One `files` entry + isfile fail-closed loader + npm pack contract + optional guard + patch republish | **Preferred / LOCKED** |
| A2 | Allowlist only; leave raw FileNotFoundError | **Rejected** — AC-3 |
| A3 | Inline/vendor lib into `installer.py` | **Rejected** — US-0147 compose |
| A4 | Allowlist entire `scripts/` | **Rejected** — over-broad |
| A5 | Ship `standalone/` in npm `files` | **Rejected** — US-0133 |
| A6 | Reopen US-0147 / merge BUG-0022\|0024 | **Rejected** — DQ7/DQ8 |

### Locked pins (architecture-owned)

| Pin | Value |
|-----|-------|
| `files` entry string | `scripts/standalone_runtime_install_lib.py` (exactly one new entry) |
| Loader shape | isfile-before-exec; emit `STANDALONE_BOOTSTRAP_FAILED`; no raw FileNotFoundError |
| Test file | `tests/bug0025_packaging_contract_test.py` |
| Guard | Optional allowlist assert in `guard_installer_publish.py`; omit-`standalone/` held |
| Republish | Patch bump (current kit `0.1.3` → next patch, e.g. `0.1.4`) |
| Template parity | No `template/scripts/standalone_runtime_install_lib.py` mirror |
| Companion DEC | **none** |
| Expected sprint | **S0157** (materialize at `/sprint-plan` only) |

## Design challenge (assumptions / simpler / risks)

- **Alternative to allowlist?** Vendor/inline lib into `installer.py`. Smaller packaging surface; breaks US-0147 compose and dual-maintains logic. **Rejected.**
- **Alternative to fail-closed?** Document “reinstall same version” / leave FileNotFoundError. Fails AC-3/AC-4. **Rejected.**
- **Can this be simpler?** Allowlist-only without loader harden fails AC-3 when path still missing. Guard-only without named `test_bug0025_*` fails DQ5. A1 (one file + mirror doc_profile pattern + 5–6 tests) is the simplest design that meets AC-1..AC-8.
- **Governance fork?** Packaging completeness + fail-closed reason code — not a DEC-class product fork. **`decision_gate=false`**. No companion DEC.
- **Supported-range residual:** fail-closed without shipping `standalone/` (US-0133). Operator on published kit must not see raw `FileNotFoundError` for that JSON either.

## Components

### package.json `files` (DQ1, AC-1/AC-2)

Add exactly:

```json
"scripts/standalone_runtime_install_lib.py"
```

Do not add `scripts/`, do not add `standalone/`, do not remove existing intake/materialize/remote_config/guard/doc_profile peers.

### Installer loader (DQ3, AC-3/AC-4)

In `installer.py` `_load_standalone_runtime_install_lib`:

1. Resolve `lib_path` adjacent to `installer.py` (same as today).
2. If `not os.path.isfile(lib_path)` → raise `RuntimeError("[STANDALONE_BOOTSTRAP_FAILED] …")` (or return-path that prints the same token).
3. Else `spec_from_file_location` + `exec_module` as today.
4. Ensure `bootstrap_standalone_runtime_installer_hook` / `run_standalone_postinstall` catch and exit **1** with **`STANDALONE_BOOTSTRAP_FAILED`** printed — operator must not see an uncaught `FileNotFoundError` traceback as the primary outcome.

Keep `bootstrap_standalone_runtime_installer_hook` call sites and US-0147 reason-code family. Do not rewrite adoption classifier, template mirror layout, shim paths, kernel handshake, browser gate, or uninstall mode behavior.

### Pack / guard contract (DQ4, DQ5, AC-5)

Primary: pytest contract via `npm pack --dry-run --json` (or temp `.tgz` member list) asserting posix path `scripts/standalone_runtime_install_lib.py` (or `package/scripts/...`) **and** root `package.json` `files` contains the exact string.

Optional: `guard_installer_publish.py` fails closed when the allowlist entry is missing (and optionally when pack inventory omits it). Existing US-0133 omit-`standalone/` check stays authoritative.

### Republish (DQ6, AC-6)

Patch-bump version in kit `package.json` (and packaging twins as existing release path requires) then publish through release-all / `RELEASE_PUBLISH_MODE`. Release notes cite upgrade command for operators still on `0.1.3`. Semver quirk note optional only.

### Supported-range residual (DQ2)

When `supported-kernel-range.json` under package-root `standalone/` is absent, fail-closed into `STANDALONE_BOOTSTRAP_FAILED` / `KERNEL_*`. **Do not** add `standalone/` to `files`.

## Test contract (DQ10)

File: `tests/bug0025_packaging_contract_test.py` — **5–6** named tests:

1. `test_bug0025_package_json_files_lists_standalone_runtime_install_lib` — AC-2
2. `test_bug0025_npm_pack_includes_standalone_runtime_install_lib` — AC-1 / AC-5
3. `test_bug0025_load_missing_lib_emits_standalone_bootstrap_failed` — AC-3
4. `test_bug0025_bootstrap_wrapper_no_raw_filenotfound_traceback` — AC-3 / AC-4
5. `test_bug0025_guard_installer_publish_requires_allowlist_entry` — AC-5 (optional if guard extended; else skip with note in sprint task)
6. `test_bug0025_us0147_compose_hook_call_sites_unchanged` — AC-7 smoke (hook presence; no reopen)

Keep prior `test_bug0001_*` / `test_bug0003_*` / US-0084 / US-0133 / `test_us0147_*` green — additive only (DQ8).

## AC coverage

| AC | Architecture owner | Tests / evidence |
|----|-------------------|------------------|
| AC-1 | DQ1+DQ2+DQ4 pack membership | `test_bug0025_npm_pack_includes_standalone_runtime_install_lib` |
| AC-2 | DQ1 `files` string | `test_bug0025_package_json_files_lists_standalone_runtime_install_lib` |
| AC-3 | DQ3 loader fail-closed | `test_bug0025_load_missing_lib_emits_standalone_bootstrap_failed`, `test_bug0025_bootstrap_wrapper_no_raw_filenotfound_traceback` |
| AC-4 | DQ3 wrapper exit path | same + upgrade/missing bootstrap path |
| AC-5 | DQ4+DQ5 contract (+ optional guard) | pack test + optional guard test |
| AC-6 | DQ6 patch republish | release task / notes (execute+release) |
| AC-7 | DQ7 US-0147 compose-only | `test_bug0025_us0147_compose_hook_call_sites_unchanged` |
| AC-8 | Sibling BUG-0022/0024 boundary | sprint/backlog notes; no merge/drain |

Acceptance checkbox: `docs/product/acceptance.md` BUG-0025 row remains unchecked until closure (US-0045). Status stays **OPEN**.

## Risks (architecture-owned)

| Risk | Mitigation |
|------|------------|
| Published kit fails later on package-root `supported-kernel-range.json` | Fail-closed residual (DQ2); do not add `standalone/` to `files` |
| Guard false-positive vs US-0133 omit check | Guard asserts **script allowlist presence** only |
| Operator stays on `0.1.3` after bump | AC-6 release notes + upgrade command |
| US-0147 test drift | Keep `test_us0147_*` green; bug0025 tests additive only |
| Same-line `0.1.3` republish rejected by npm | Prefer patch bump to `0.1.4` |

## Atomic task seeds (for `/sprint-plan` → **S0157**)

| # | Seed | Surfaces |
|---|------|----------|
| T-anch | Verify `# BUG-0025` H1 + R-0149 A1 DQ1–DQ10 + no companion DEC + US-0147 compose-only + BUG-0022/0024 not drained | architecture.md, R-0149 (read-only) |
| T-001 | Add `scripts/standalone_runtime_install_lib.py` to root `package.json` `files` | `package.json` |
| T-002 | Harden `_load_standalone_runtime_install_lib` isfile-before-exec → `STANDALONE_BOOTSTRAP_FAILED` | `installer.py` (loader) |
| T-003 | Wrap bootstrap / `run_standalone_postinstall` so missing lib exits 1 with token (no raw FileNotFoundError) | `installer.py` (wrappers) |
| T-004 | Fail-closed supported-range residual into `STANDALONE_BOOTSTRAP_FAILED` / `KERNEL_*` (no `standalone/` in `files`) | `installer.py` / lib call path |
| T-005 | Author `tests/bug0025_packaging_contract_test.py` markers 1–4 + 6 (and 5 if guard extended) | `tests/bug0025_packaging_contract_test.py` |
| T-006 | Optional: extend `guard_installer_publish.py` allowlist assert; keep omit-`standalone/` | `scripts/guard_installer_publish.py` |
| T-007 | Patch version bump (e.g. 0.1.3→0.1.4) + packaging twin sync as release path requires | `package.json` + packaging twins |
| T-008 | Release notes / runbook troubleshooting pointer for upgrade command + optional semver quirk note | release notes / runbook |
| T-009 | Republish via existing release-all / `RELEASE_PUBLISH_MODE` (AC-6) | release path |
| T-010 | Confirm `test_us0147_*` + BUG-0001/0003 / US-0084 / US-0133 guards still green | CI / scoped pytest |

**Task count**: 11 seeds (T-anch + T-001..T-010) ≤ `SPRINT_MAX_TASKS=12`. Not `/quick`. Sprint-plan owns **S0157** materialization — **this phase does not create `sprints/S0157/`**.

## Decision linkage

- Decision: **none** (companion DEC not required — cite **R-0149** / this `# BUG-0025`)
- Compose (do not amend bodies): **DEC-0147** / **US-0147** / **US-0133** / **US-0084** / BUG-0001 / BUG-0003 packaging lineage
- Research: **R-0149** (do not wipe **R-0148**)
- Related: **BUG-0022 OPEN** / **BUG-0024 OPEN** — not mutated; **US-0148** — not mutated

## Isolation evidence (US-0048 / DEC-0029)

- `phase_id=architecture`, `role=tech-lead`, `bug_id=BUG-0025`, `sprint_id=none` (S0157 expected at sprint-plan)
- `delivery_mode=ultra_lean`, `macro_phase=plan`, `model_id=inherit` (CROSS_MODEL_REVIEW=0)
- `fresh_context_marker=tl-BUG0025-architecture-20260918T170000Z-fresh`, `timestamp=2026-09-18T17:00:00Z` (UTC)
- `evidence_ref=docs/engineering/research.md ## R-0149; docs/product/backlog.md ### BUG-0025; docs/engineering/architecture.md (this # BUG-0025); handoffs/resume_brief.md; handoffs/po_to_tl.md`
- Fresh tech-lead subagent per BUG-0006; narrow-read only. No `.env`. No companion DEC. No `sprints/S0157/`. No Status/AC mutation. No `/sprint-plan` spawn. No npm-publish. No git push. No sovereign-critic (CROSS_MODEL_REVIEW=0).

## Strict runtime proof (mirror)

- `runtime_proof_id=rp-auto-20260918-bug0025-architecture-techlead-20260918T170000Z-BUG-0025`
- Canonical hashed payload (DEC-0038, `compute_strict_proof_hash` positional): `{"orchestrator_run_id":"auto-20260918-bug0025","phase_id":"architecture","proof_issued_at":"2026-09-18T17:00:00Z","proof_ttl_seconds":3600,"role":"tech-lead","runtime_proof_id":"rp-auto-20260918-bug0025-architecture-techlead-20260918T170000Z-BUG-0025"}`
- Isolation extras (not hashed): `delivery_mode=ultra_lean`, `macro_phase=plan`, `model_id=inherit`, `sprint_id=none`, `bug_id=BUG-0025`, `skipped_phases=[intake]`, `CROSS_MODEL_REVIEW=0`, `native_chain_active=true`, `native_chain_continuing=true`, `segment_work_item_kind=bug`
- `proof_hash=DA89597E0B3BD3F37E33AE7A83BFAFF70B4CD04EEDB22BDAE0D7C283FF09B8BE`
- `proof_ttl=2026-09-18T18:00:00Z`
- `hash_recompute_confirmation=true` (compute_strict_proof_hash → DA89597E0B3BD3F37E33AE7A83BFAFF70B4CD04EEDB22BDAE0D7C283FF09B8BE; independently MATCH; **64 hex** verified)
- Consumed research proof: `rp-auto-20260918-bug0025-research-techlead-20260918T165500Z-BUG-0025` / `8E27420FCD21FE740C6015A45AB789057024E91BEA858636968488C1ACBFD249` — RUNTIME_PROOF_VALID MATCH before TTL `2026-09-18T17:55:00Z` (consumed_at `2026-09-18T17:00:00Z`; not STALE)

# US-0150 — Production standalone runtime composition

## Decision

Accept **A1** from `R-0150`: add `standalone/packages/runtime-host` as `@its-magic/runtime-host`, the sole production composition root for a project. It resolves configuration once and constructs/adopts the existing Pi kernel, kernel bridge, session supervisor, ToolBroker, code-intelligence/context services, operational store, and `CommandRouter`. CLI and daemon receive this host; they must not create throwing kernels, literal empty config, separate stores, or placeholder-capable brokers.

`runtime-host` is an outer layer. It may import delivered leaf packages and `runtime-core`; none of those packages may import it. TUI remains an `OperatorTransport` client under US-0151. This story does not execute lifecycle work, add AppRuntime/BrowserUAT, implement deployment, or alter CI ownership.

## Host Contract

```ts
type RuntimeHost = {
  projectRoot: string;
  config: ResolvedRuntimeConfig;
  commandRouter: CommandRouter;
  sessionSupervisor: SessionSupervisor;
  dispose(): Promise<void>;
};

type RuntimeHostOptions = {
  projectRoot: string;
  lifetime: "direct-cli" | "daemon";
  factories?: RuntimeHostTestFactories;
};

async function createRuntimeHost(options: RuntimeHostOptions): Promise<RuntimeHost>;
```

- `factories` is an explicit test seam. Production entrypoints do not pass it, and test-only factories cannot silently select fake tools, fake intelligence, or a throwing kernel.
- A daemon owns one host per project for its process lifetime. A direct CLI invocation creates one host for the command and always calls `dispose()` in `finally`.
- `dispose()` stops admitted sessions and watchers and closes operational resources in reverse construction order. It must be idempotent; repository artifacts are never deleted or reconciled as part of disposal.

## Boot And Failure Contract

1. Canonicalize the project root and resolve typed runtime configuration with non-secret provenance.
2. Open the operational store, locate and handshake the kernel bridge, and fail before scheduling when either admission fails.
3. Create the Pi kernel with custom tools only and deny-by-default project resources.
4. Create real policy-admitted tool implementations, active code intelligence/context services, and the `SessionSupervisor`.
5. Construct the existing `CommandRouter` from those admitted services and expose it through the host.

Host failures use the architecture-owned `RUNTIME_*` family: `RUNTIME_CONFIG_UNAVAILABLE`, `RUNTIME_BRIDGE_UNAVAILABLE`, `RUNTIME_KERNEL_ADMISSION_FAILED`, and `RUNTIME_SERVICE_UNAVAILABLE`. Exact payload schema is implementation-owned, but each result is typed, redacted, and fail-closed. `ok:<tool>`, fake browser/intelligence defaults, or synthetic success are forbidden outside explicit test factories.

## Security And State Ownership

- The host passes provider credentials only through the existing auth/model runtime; raw secrets are neither returned nor logged.
- Role/model/provider selection, policy hash, custom-tool-only enforcement, resource-loader default deny, and ToolBroker path/shell checks remain mandatory for every fresh session.
- Repository artifacts and kernel validators remain authoritative. SQLite stores only operational run/session/audit/index metadata.

## Test Contract

| AC | Primary architecture test |
|----|---------------------------|
| AC-1 | `test_us0150_runtime_host_resolves_one_config_and_builds_graph` |
| AC-2 | `test_us0150_cli_and_daemon_use_runtime_host_not_throwing_kernel` |
| AC-3 | `test_us0150_host_creates_fresh_attested_custom_tool_session` |
| AC-4 | `test_us0150_admitted_tool_executes_or_denies_without_placeholder_success` |
| AC-5 | `test_us0150_bridge_validator_and_operational_store_preserve_artifact_authority` |
| AC-6 | `test_us0150_production_composition_unavailable_services_and_disposal` |

The suite creates an actual Pi SDK session with a deterministic local test-model seam; it does not require paid credentials or external network access. Existing fake-package contracts stay as unit coverage but cannot satisfy these six operator-composition tests.

## Atomic Task Seeds

| # | Seed |
|---|------|
| T-anch | Verify `R-0150`, `DEC-0150`, package dependency direction, and story boundaries. |
| T-001 | Add the `runtime-host` package and typed public host/factory interfaces. |
| T-002 | Resolve config/project root/store/bridge admission with redacted `RUNTIME_*` failures. |
| T-003 | Compose Pi kernel, real ToolBroker implementations, intelligence/context, and `SessionSupervisor`. |
| T-004 | Construct the existing `CommandRouter`; add host lifetime and idempotent disposal. |
| T-005 | Replace CLI and daemon throwing-kernel/empty-config construction with the host. |
| T-006 | Add production-composition tests for Pi session, policy tool behavior, bridge/validator, failures, and disposal. |
| T-007 | Add package dependency and production-vs-test-factory regression checks. |

## Boundaries And Consequences

- Compose US-0133 through US-0140 without rewriting their public contracts. Do not reopen their status or acceptance rows in this implementation slice.
- US-0151 owns lifecycle execution, operator transport, and TUI state; US-0152 owns AppRuntime/BrowserUAT; US-0153 owns parallel/release execution; US-0154 owns installed-path CI proof.
- Out: US-0149, BUG-0026, phase-9 clients, root-kit publish work, `.env` reads, and git push.
- `/sprint-plan` owns sprint materialization. This architecture phase creates no application code and no sprint directory.

# BUG-0024 — OpenCode CLI TUI listed `/auto` still toasts OPENCODE_AUTO_TUI_DISPATCH_UNSUPPORTED after BUG-0023 Axis A (live dispatch)

## Overview

**`BUG-0024`** closes the **live CLI TUI dispatch residual** left after BUG-0023 Axis A shipped files: operator OpenCode CLI TUI (`opencode`, not `--pure`) **sees and invokes listed `/auto`**, then still toasts title `its-magic /auto` / body **`OPENCODE_AUTO_TUI_DISPATCH_UNSUPPORTED`**. Lifecycle does **not** start (`runAutoLifecycle` not reached). Axis A files present (`rpc.ts` Rpc.define + optional peer, `tui.ts` `{ id, tui }` + `dispatchRunAutoLifecycle`, orchestrator `await ctx.rpc.register` when present + `editor.add`, `tui.json` listing, `auto.md` absent) is **not** success.

Distinct from **BUG-0023 DONE** (Axis A mock+inspection — do **not** reopen ACs / S0148), **BUG-0021 DONE** (listing limb still true — toast title proves listed invoke; do **not** reopen), **BUG-0020 DONE** (desktop Command.Info), **BUG-0019 DONE** (tokens), **BUG-0018 DONE** (do **not** restore STOP-only `auto.md`), **BUG-0022 OPEN** (Cursor inherit — do **not** merge / drain), **BUG-0027 OPEN** (manual phase persistence — compose only; do **not** drain).

**This section supersedes `# BUG-0023` “DISPATCH only when client/RPC truly absent” as the live-operator happy-path claim.** Axis A compose (shared Defined + `client.rpc(Defined)` / `OpenCode.make` + await register + `{ id, tui }` + `editor.add`) remains `# BUG-0023`. Live residual diagnostics + peer-brand requirement for TUI success are **this** section. Do **not** rewrite historical `# BUG-0023` / `# BUG-0021` / `# BUG-0019` / `# BUG-0018` bodies.

**Research anchor**: **`R-0140`** (DQ1–DQ10 LOCKED; compose **R-0137** / **R-0136** / **R-0134** / **R-0124** — do not wipe). **Companion DEC**: **none** (same class as BUG-0019 / BUG-0020 / BUG-0021 / BUG-0023 / BUG-0025). **EARLY_RESEARCH=0** — no new `R-xxxx`. **Out of scope**: Cursor `/auto` as done definition (working path until fix only); `--pure`; BUG-0022; BUG-0027 mutate; reopen 0015–0023 ACs; JSON `commands.auto`+`template`; STOP-only `auto.md`; live OpenCode CLI TUI probe in default CI (`UAT_PROBE_FORBIDDEN` held).

**Fresh context marker**: `tl-BUG0024-architecture-20260921T194300Z-fresh`
**Orchestrator run id**: `auto-20260921-bug0024`
**Parent**: `cursor-20260913-BUG0024-intake`
**Timestamp**: 2026-09-21T19:43:00Z (UTC)
**Verdict**: PASS (`decision_gate=false`)
**Next**: `/sprint-plan` (expected **S0159** — do **not** create this phase)
**baseline_h2_count (pre-mutate)**: `0`

## Approach locked (A1 Hybrid residual live-dispatch — from R-0140 DQ1–DQ10)

**Approach A1 (A\*)** (locked): keep `{ id, tui }` listing + `editor.add` execute + Axis A `client.rpc(Defined).runAutoLifecycle` / `OpenCode.make({ baseUrl }).rpc(Defined)` happy path; require **peer-branded** `@opencode/plugin/rpc` `Rpc.define` for TUI dispatch success (local identity-`define` stays load-safe for orchestrator/`editor.add` but is **not** sufficient for live `client.rpc`); stop silent register-skip and catch-all→DISPATCH — emit **stage-distinct** `OPENCODE_*`; DISPATCH remains **umbrella** only when all limbs exhausted; never silent `localhost:4096`; never restore `auto.md`.

1. Keep default export `{ id, tui }` + `registerLayer` `slashName: "auto"` / `ctrl+shift+a` (BUG-0021 compose — **do not reshape listing**).
2. Keep `editor.add({ name: "auto", execute })` as execute owner (BUG-0018 A* compose).
3. Shared `./its-magic-auto/rpc.ts` continues to export `ITS_MAGIC_AUTO_RPC`. Specifier **LOCKED**: `@opencode/plugin/rpc`. Local identity-`define` remains allowed so orchestrator loads without the peer.
4. **TUI success gate (DQ3)**: `dispatchRunAutoLifecycle` treats Defined as TUI-happy **only** when peer `@opencode/plugin/rpc` branded the object (detect peer-resolve / branded mark architecture pins in execute). Identity-define Defined → **`OPENCODE_AUTO_TUI_DEFINED_UNBRANDED`**, not silent DISPATCH and not pretend success.
5. **Limb order (LOCKED)**:
   1. Resolve `client = context.client ?? context.api?.client` (host-true `api.client` per DQ1). Missing → **`OPENCODE_AUTO_TUI_MISSING_CLIENT`**.
   2. Dynamic-import `ITS_MAGIC_AUTO_RPC`. Peer-unbranded → Defined-unbranded code (step 4).
   3. If `typeof client.rpc === "function"` → `client.rpc(Defined).runAutoLifecycle(payload)` with payload `{ sessionID?, prompt?, delivery? }` — **not** `{ input }`. Rpc throw / no `runAutoLifecycle` → stage code (not catch-all DISPATCH alone) then fall through.
   4. Else / after rpc miss: if `.rpc` absent → may emit **`OPENCODE_AUTO_TUI_RPC_ABSENT`** before make limb (observable; may still try make).
   5. `OpenCode.make({ baseUrl }).rpc(Defined).runAutoLifecycle(payload)` only when `baseUrl = client.baseUrl ?? client.config?.baseUrl ?? client.defaults?.baseUrl` resolvable. Missing baseUrl / `@opencode/client` → **`OPENCODE_AUTO_TUI_MAKE_UNREACHABLE`**. **Never** silent `http://localhost:4096`.
   6. Orchestrator: keep `await ctx.rpc.register(ITS_MAGIC_AUTO_RPC, { runAutoLifecycle })` when `ctx.rpc.register` exists. When **absent**: emit honest **`OPENCODE_AUTO_TUI_REGISTER_SKIPPED`** (session-visible / test-observable — not silent skip-as-success). TUI may still try client/make limbs.
   7. **`OPENCODE_AUTO_TUI_DISPATCH_UNSUPPORTED`** only as **umbrella** when all limbs exhausted or host truly cannot dispatch (AC-1/AC-2).
6. Invented `POST /rpc/...` `{ input }` stays **not** a path (BUG-0023 compose).
7. Eight additive `test_bug0024_*` (below). Keep `test_bug0023_*` / `0021` / `0020` / `0019` / `0018` compose.
8. Upgrade `--host opencode|both` **overwrites** live dispatch path (`tui.ts` / `rpc.ts` / orchestrator register limb) on already-Axis-A trees; still **prunes** leftover `auto.md`.

| Option | Summary | Verdict |
|--------|---------|---------|
| **A1 Hybrid residual** | Peer-branded Defined for TUI success + stage codes + register-skip honesty + Axis A client/make path; `{ id, tui }` + `editor.add` held | **Preferred / LOCKED** |
| A2 Client pass-through only | Only expand `api?.client` wiring | **Rejected** — insufficient vs H2/H5/H3 |
| A3 Register timing only | Only force/await register | **Rejected** — residual may be branding/client |
| A4 Defined branding only | Only peer Rpc.define | **Rejected** — register-skip + diagnostics still required |
| A5 HTTP fallback only | Only OpenCode.make | **Rejected** — no silent localhost; primary remains client.rpc |
| A6 Restore auto.md / Plugin.define TUI / JSON template | — | **Rejected** — D3/D4 / BUG-0018 / BUG-0021 |

### Locked tokens (architecture-owned — DQ6)

| Code | When |
|------|------|
| `OPENCODE_AUTO_TUI_MISSING_CLIENT` | `run()`/`dispatch` with no usable `api.client` / `context.client` |
| `OPENCODE_AUTO_TUI_RPC_ABSENT` | Client present but `typeof client.rpc !== "function"` (before/alongside make limb) |
| `OPENCODE_AUTO_TUI_DEFINED_UNBRANDED` | `ITS_MAGIC_AUTO_RPC` resolved via local identity-`define` only — not peer-branded; **not** TUI happy path |
| `OPENCODE_AUTO_TUI_REGISTER_SKIPPED` | Orchestrator `ctx.rpc.register` absent — observable; not silent success |
| `OPENCODE_AUTO_TUI_MAKE_UNREACHABLE` | Make limb needed but no resolvable `baseUrl` and/or `@opencode/client` unusable; **never** invent localhost |
| `OPENCODE_AUTO_TUI_DISPATCH_UNSUPPORTED` | **Umbrella only** when all limbs exhausted / host truly cannot dispatch |
| `OPENCODE_AUTO_SLASH_LISTING_UNSUPPORTED` | Unchanged BUG-0021 — compose |
| `OPENCODE_AUTO_CLI_TUI_PLUGIN_LOAD_UNSUPPORTED` | Unchanged BUG-0021 — compose |
| `OPENCODE_AUTO_MARKDOWN_COLLISION` | Unchanged BUG-0018 — **not** for dispatch-miss |
| `OPENCODE_AUTO_DESKTOP_COMMAND_INFO_LISTING_UNSUPPORTED` | Unchanged BUG-0020 — **do not reuse** for CLI TUI dispatch |

Closed set: five stage codes + one umbrella. Do not proliferate further tokens without a new research lock.

### Supersede note — `# BUG-0023` live happy-path claim (LOCKED)

| Prior lock | New lock (this section) |
|------------|-------------------------|
| `# BUG-0023`: DISPATCH only when client/RPC truly absent; Axis A files + mock-invoke = dispatch proof | **SUPERSEDED for live CLI TUI operator outcome.** Axis A compose remains. Live residual requires peer brand + stage codes + register-skip honesty. |
| `# BUG-0023` local identity-define as load-safe fallback | **Compose for orchestrator load.** **Not** sufficient for TUI `client.rpc(Defined)` success. |
| Silent skip when `ctx.rpc.register` absent | **Rejected** — emit `OPENCODE_AUTO_TUI_REGISTER_SKIPPED` |
| Catch-all→DISPATCH as only diagnostic | **Rejected** — stage codes first; DISPATCH umbrella last |

Historical `# BUG-0023` / `# BUG-0021` bodies remain shipped evidence. Readers must follow **this** section for **live CLI TUI `/auto` dispatch after Axis A**.

## Design challenge (assumptions / simpler / risks)

- **Alternative to peer brand?** Keep identity-define as TUI happy path. Live-falsified (H2/H5). **Rejected.**
- **Alternative diagnostics?** Keep catch-all DISPATCH only. Fails AC-2 / AC-6 (mock gap). **Rejected.**
- **Alternative listing reshape?** Switch TUI to `Plugin.define` so docs `context.client.rpc` matches. Re-breaks BUG-0021 listing. **Rejected.**
- **Can this be simpler?** Restoring `auto.md` looks smaller and recreates BUG-0018. Client-pass-through-only (A2) misses branding/register. A1 is the simplest design that meets D1/D8/D9 and R-0140 A*.
- **Governance fork?** Live residual of already-accepted Axis A contract — not a DEC-class product fork. **`decision_gate=false`**. No companion DEC.

## Components

### Peer-branded Defined (DQ3)

`rpc.ts` (active + template):

- Prefer `import` / dynamic resolve of `@opencode/plugin/rpc` `Rpc.define`.
- Keep local identity-`define` so orchestrator/`editor.add` still loads when peer missing.
- Export a **detectable brand signal** (architecture pin for execute): e.g. module-level `ITS_MAGIC_AUTO_RPC_PEER_BRANDED: boolean` or branded Symbol/property on Defined — tests assert TUI happy path requires brand true.

### TUI dispatch (DQ1, DQ2, DQ5, DQ6)

Keep `{ id, tui }` + `run()` → `dispatchRunAutoLifecycle({ api, client: api?.client }, input)`.

Rewrite fail-closed branches to emit locked stage tokens per limb order above. Remove catch-all→DISPATCH as the sole body for missing client / unbranded / no baseUrl / rpc throw.

Never SessionPrompt. Never Command.Info `template`. Never LLM chat. Never invented POST `{ input }`. Never silent localhost.

### Orchestrator register honesty (DQ4)

Keep `await ctx.rpc.register(ITS_MAGIC_AUTO_RPC, { runAutoLifecycle })` when register exists; keep `editor.add`.

When `ctx.rpc.register` absent: emit **`OPENCODE_AUTO_TUI_REGISTER_SKIPPED`** (session-visible notice compatible with BUG-0020/0021 emit style — not TUI-toast-only required; must be test-observable). Do **not** treat skip as success.

### Consumer upgrade / parity (DQ9)

`its-magic --mode upgrade --host opencode|both`:

- **Overwrite** framework-owned `tui.ts`, `rpc.ts`, and orchestrator register/skip-honesty limb via existing copy helpers.
- `tui.json`: keep BUG-0020 copy-if-absent / JSONC merge; **do not** wholesale overwrite operator theme/keybinds.
- Still run `prune_retired_opencode_auto_md`. Do **not** restore `auto.md`. Do **not** prune `.cursor/commands/auto.md` or `.opencode/agents/auto.md`.

Extend `check_intake_template_parity.py` with additive `BUG0024_PAIRS` for touched dispatch surfaces (keep `BUG0023_PAIRS` / `BUG0021_PAIRS` / …).

Runbook recipe: (1) upgrade to the BUG-0024 release; (2) `its-magic --mode upgrade --host opencode|both`; (3) restart OpenCode CLI TUI (`opencode`, **not** `--pure`); (4) listed `/auto` **starts** `runAutoLifecycle` — or honest stage/umbrella code only when host truly cannot dispatch. Cursor IDE `/auto` remains working path until fix — **not** done. `--pure` out of scope.

## Test contract (DQ8 — eight markers)

Preferred file: `tests/bug0024_opencode_cli_tui_live_dispatch_residual_test.py` (+ small node harness/fixture that **invokes** `dispatchRunAutoLifecycle` / `run()` / register-skip path against fakes). **No live OpenCode CLI TUI probe** in default CI (`UAT_PROBE_FORBIDDEN`). Markers must **fail current tree** / BUG-0023 mock-only gap.

| # | Marker | Asserts |
|---|--------|---------|
| 1 | `test_bug0024_run_missing_api_client_distinct_code` | `{ api }` without `api.client` → `OPENCODE_AUTO_TUI_MISSING_CLIENT` (not silent umbrella-only) |
| 2 | `test_bug0024_local_unbranded_defined_not_happy_path` | Identity-define Defined does **not** count as TUI success; emits `OPENCODE_AUTO_TUI_DEFINED_UNBRANDED` |
| 3 | `test_bug0024_register_skipped_observable` | Absent `ctx.rpc.register` surfaces `OPENCODE_AUTO_TUI_REGISTER_SKIPPED` (not silent) |
| 4 | `test_bug0024_make_unreachable_without_baseurl` | Client without `.rpc` and without `baseUrl` → `OPENCODE_AUTO_TUI_MAKE_UNREACHABLE`; never invent localhost |
| 5 | `test_bug0024_swallowed_rpc_error_not_only_dispatch` | `client.rpc` throw maps to stage code before umbrella DISPATCH |
| 6 | `test_bug0024_keep_editor_add_no_auto_md` | Compose D3/D4: `editor.add` present; no OpenCode `auto.md`; no JSON `commands.auto`+`template` |
| 7 | `test_bug0024_active_template_parity` | AC-8 dispatch-path byte-parity |
| 8 | `test_bug0024_upgrade_copies_dispatch_still_prunes_auto_md` | AC-7 overwrite + prune |

Keep `test_bug0023_*` / `test_bug0021_*` / `test_bug0020_*` / `test_bug0019_*` / `test_bug0018_*` green — additive only.

## Touch surfaces (execute)

| Surface | Change |
|---------|--------|
| `.opencode/plugins/its-magic-auto/rpc.ts` + template | Peer-brand signal; keep local define for load-safe orchestrator |
| `.opencode/plugins/its-magic-auto/tui.ts` + template | Stage-distinct codes; limb order; keep `{ id, tui }` |
| `.opencode/plugins/orchestrator.ts` + template | Register-skipped honesty; keep `editor.add` + await register when present |
| `.opencode/plugins/its-magic-auto/index.ts` | **Keep** server `Plugin.define`; no `tui` export |
| `.opencode/commands/auto.md` + template | **Stay absent** |
| OpenCode JSON `commands.auto` | **Do not add** |
| `installer.py` + `installer.sh` + `installer.ps1` | Overwrite dispatch path; keep targeted `auto.md` prune |
| `scripts/check_intake_template_parity.py` | Additive `BUG0024_PAIRS` |
| `tests/bug0024_*` | 8 markers |
| `tests/bug0023_*` / `0021` / `0020` / `0019` / `0018` | Unchanged compose |
| `docs/engineering/runbook.md` (+ template) | Live-dispatch residual recipe + stage-code table + `--pure` out |

## Non-goals

- Allocate a companion DEC / rewrite `# BUG-0023` / `# BUG-0021` / `# BUG-0019` / `# BUG-0018` bodies
- Reopen BUG-0023 / BUG-0021 / BUG-0020 / BUG-0019 / BUG-0018 ACs / S0148
- Restore STOP-only / empty `auto.md`
- JSON `commands.auto` template
- Merge/drain BUG-0022; drain BUG-0027
- Mutate US-0133..US-0150 as new scope
- Cursor `/auto` as the product done definition
- Claim `/auto` under `--pure`
- Live OpenCode CLI TUI probe in default CI
- Touch `.cursor/commands/auto.md` or `.opencode/agents/auto.md`
- Treat DISPATCH toast as success
- Silent `localhost:4096`
- Top-level `import "@opencode/plugin/rpc"` from the TUI default-export module (listing regression risk — keep dynamic import inside dispatch)

## Risks

| Risk | Severity | Mitigation |
|------|----------|------------|
| R1 Stage-code proliferation vs AC-2 DISPATCH semantics | MEDIUM | Closed set of five stage + one umbrella; DISPATCH last |
| R2 Peer `@opencode/plugin/rpc` absent on consumer hosts | MEDIUM | Distinct Defined-unbranded; orchestrator still loads via local define; Cursor working path until fix |
| R3 Register-skipped confuses operators | LOW | Document as honest residual; runbook |
| R4 Tests overfit mock and miss live again | MEDIUM | Markers target BUG-0023 gap (missing client / unbranded / register-skip / no baseUrl / swallowed rpc); UAT_PROBE_FORBIDDEN held |
| R5 Upgrade leaves pre-BUG-0024 `tui.ts` (copy-if-absent) | MEDIUM | Marker 8 asserts **overwrite** |
| R6 Accidental reopen of BUG-0023/0021 | LOW | Sibling boundary + non-goals; compose-only tests |

## AC coverage mapping (bug acceptance + R-0140)

| AC | Architecture owner | Seeds / tests |
|----|-------------------|----------------|
| AC-1 | A1 limb order + peer brand + lifecycle start | T-001..T-004; markers 1–5 |
| AC-2 | DISPATCH umbrella-only | T-004; marker 5 |
| AC-3 | No `auto.md` restore | T-anch, T-005 m6 |
| AC-4 | No JSON template | T-005 m6 |
| AC-5 | `editor.add` retained | T-002, T-005 m6 |
| AC-6 | Eight `test_bug0024_*` catch live miss | T-005 |
| AC-7 | Upgrade overwrite + prune | T-006, T-005 m8 |
| AC-8 | Active↔template parity | T-007, T-005 m7 |

Acceptance checkbox: `docs/product/acceptance.md` BUG-0024 row remains unchecked until closure (US-0045). Status stays **OPEN**.

## Atomic task seeds (for `/sprint-plan` → **S0159**)

| # | Seed | Surfaces |
|---|------|----------|
| T-anch | Verify `# BUG-0024` H1 + A1 + R-0140 DQ1–DQ10 + `# BUG-0023` live claim superseded + no companion DEC + do not rewrite `# BUG-0023`/`# BUG-0021` + do not reopen 0023/0021 + do not merge 0022 + do not drain 0027 | architecture.md, R-0140 (read-only) |
| T-001 | Peer-brand signal on `ITS_MAGIC_AUTO_RPC`; keep local identity-define for orchestrator load; TUI happy path requires brand | `rpc.ts` (active + template) |
| T-002 | Orchestrator: keep await register + `editor.add`; emit `OPENCODE_AUTO_TUI_REGISTER_SKIPPED` when register absent | `orchestrator.ts` (active + template) |
| T-003 | `dispatchRunAutoLifecycle` limb order + stage tokens (missing-client / rpc-absent / Defined-unbranded / make-unreachable / swallowed-rpc); keep `{ id, tui }` | `tui.ts` (active + template) |
| T-004 | DISPATCH umbrella only when limbs exhausted; never silent localhost; do not reuse listing/load/desktop/markdown tokens | `tui.ts` + runbook |
| T-005 | Add 8 `test_bug0024_*` markers; no live OpenCode probe in default CI; do not weaken 0023/0021/0020/0019/0018 except compose-only | `tests/bug0024_*.py` (+ harness) |
| T-006 | Upgrade `--host opencode\|both` **overwrites** live dispatch path on Axis-A trees; still **prunes** leftover `auto.md` | installer.py/sh/ps1 + owned-paths |
| T-007 | Runbook live-dispatch residual recipe + stage-code table + `--pure` out + active↔template parity + `BUG0024_PAIRS` | runbook + template + `check_intake_template_parity.py` |

**Task count**: 8 seeds (T-anch + T-001..T-007). `SPRINT_MAX_TASKS=12` — no auto-split. Not `/quick`. Sprint-plan owns **S0159** materialization — **this phase does not create `sprints/S0159/`**. Eight `test_bug0024_*` named above.

## Decision linkage

- Decision: **none** (companion DEC not required — cite **R-0140** / this `# BUG-0024`)
- Compose (do not amend bodies): **DEC-0124**, **DEC-0125**, **DEC-0120**, **DEC-0132** (preserve paths — `tui.ts`/`rpc.ts` framework-owned overwrite; `tui.json` merge-safe)
- Research: **R-0140** (composes **R-0137** / **R-0136** / **R-0134** / **R-0124**; do not wipe; **no new R-id**)
- Related: **US-0124**, **US-0125**, **US-0069**; **BUG-0023** / **BUG-0021** / **BUG-0020** / **BUG-0019** / **BUG-0018** DONE — out of reopen scope; **BUG-0022 OPEN** / **BUG-0027 OPEN** — not mutated

## Isolation evidence (US-0048 / DEC-0029)

- `phase_id=architecture`, `role=tech-lead`, `bug_id=BUG-0024`, `sprint_id=none` (S0159 expected at sprint-plan)
- `delivery_mode=ultra_lean`, `macro_phase=plan`, `model_id=inherit` (CROSS_MODEL_REVIEW=0)
- `fresh_context_marker=tl-BUG0024-architecture-20260921T194300Z-fresh`, `timestamp=2026-09-21T19:43:00Z` (UTC)
- `orchestrator_run_id=auto-20260921-bug0024`, `parent_orchestrator_run_id=cursor-20260913-BUG0024-intake`
- `evidence_ref=docs/engineering/research.md ## R-0140; docs/product/backlog.md ### BUG-0024; docs/engineering/architecture.md (this # BUG-0024); handoffs/resume_brief.md; handoffs/po_to_tl.md`
- Fresh tech-lead subagent per BUG-0006; narrow-read only. No `.env`. No companion DEC. No `sprints/S0159/`. No Status/AC mutation. No `/sprint-plan` spawn. No npm-publish. No git push. No sovereign-critic (CROSS_MODEL_REVIEW=0). No auto.md restore. No BUG-0023/0021 reopen. No BUG-0022/0027 drain.

## Strict runtime proof

- `runtime_proof_id=rp-auto-20260921-bug0024-architecture-techlead-20260921T194300Z-BUG-0024`
- Hash via `scripts.token_cost_lib.compute_strict_proof_hash` (positional; compact sorted-key JSON).
- Canonical hashed payload: `{"orchestrator_run_id":"auto-20260921-bug0024","phase_id":"architecture","proof_issued_at":"2026-09-21T19:43:00Z","proof_ttl_seconds":3600,"role":"tech-lead","runtime_proof_id":"rp-auto-20260921-bug0024-architecture-techlead-20260921T194300Z-BUG-0024"}`
- Isolation extras (not hashed): `delivery_mode=ultra_lean`, `macro_phase=plan`, `model_id=inherit`, `sprint_id=none`, `bug_id=BUG-0024`, `skipped_phases=[intake]`, `CROSS_MODEL_REVIEW=0`, `native_chain_active=true`, `native_chain_continuing=true`, `segment_work_item_kind=bug`
- `proof_hash=5EEEC943224DB73B7A19D222A2178522BFCFF3F00FAC3A1316973A3F464A8915`
- `proof_ttl=2026-09-21T20:43:00Z`
- `hash_recompute_confirmation=true` (compute_strict_proof_hash → 5EEEC943224DB73B7A19D222A2178522BFCFF3F00FAC3A1316973A3F464A8915; independently MATCH; **64 hex** verified)
- Consumed research proof: `rp-auto-20260921-bug0024-research-techlead-20260921T193700Z-BUG-0024` / `57F066B720A65F5BEE9E380EFB68F7CF1ADBACC9CDDEEEE6395B808D5F91A826` — RUNTIME_PROOF_VALID MATCH before TTL `2026-09-21T20:37:00Z` (consumed_at `2026-09-21T19:43:00Z`; not STALE)

# BUG-0030 — OpenCode `/auto` private RPC bridge aborts before lifecycle start

## Overview

**BUG-0030** replaces the undocumented TUI/RPC route that yields
`OPENCODE_AUTO_TUI_DEFINED_UNBRANDED` with the public OpenCode `1.18.32`
Markdown-command contract. `/auto` remains a spawn-only orchestration entry:
OpenCode selects the existing primary `auto` agent and submits its canonical
prompt in the invoking session. It does not directly perform phase work.

This supersedes only the live `/auto` route described by BUG-0023 and BUG-0024.
Their historical tests, release records, and acceptance items are not reopened.
BUG-0027 manual-phase persistence remains independent and must keep working.

**Research anchor**: `R-0152`. **Companion decision**: `DEC-0151` Accepted.
**Pinned host contract**: `opencode` `1.18.32` and documented
`.opencode/commands/*.md` command registration. **Verdict**: PASS
(`decision_gate=false`).

## Approach Locked

**A1 (locked)**: add one framework-owned `.opencode/commands/auto.md` command
with `agent: auto` YAML frontmatter. Its body tells the existing spawn-only
agent to begin the canonical its-magic lifecycle and follow repository workflow
artifacts. OpenCode owns invocation-session selection, prompt admission,
cancellation, and provider results; its-magic must not fabricate those states.

`runAutoLifecycle`, `runAutoLifecycleRpc`, `rpc.ts`, `tui.ts`,
`ITS_MAGIC_AUTO_RPC_PEER_BRANDED`, `client.rpc`, and `ctx.rpc.register` are not
part of the resulting `/auto` path. Remove the managed TUI plugin entry from
`.opencode/tui.json`; preserve all unrelated operator TUI settings.

| Option | Verdict |
|---|---|
| A1 Markdown command, exact version pin | **LOCKED** |
| Plugin command via `@opencode/plugin` | Rejected: package/API is not available for 1.18.32 |
| Private RPC/TUI bridge | Rejected: absent from the documented 1.18.32 API |
| HTTP localhost fallback | Rejected: no invented server address or session ownership |
| Unpinned compatibility shim | Rejected: user selected a version-pinned contract |

## Components And Migration

| Surface | Required change |
|---|---|
| `.opencode/commands/auto.md` and template twin | Standard command with `agent: auto` and canonical spawn-only prompt |
| `.opencode/plugins/orchestrator.ts` and template twin | Retain BUG-0027 manual-persist behavior only; do not add unverified v2 plugin APIs |
| `.opencode/plugins/its-magic-auto/{rpc,tui,index}.ts` and twins | Retire from the `/auto` route; no fallback shim or private RPC import remains |
| `.opencode/tui.json` and template twin | Remove only `./plugins/its-magic-auto/tui.ts`; retain user-owned keys and plugin entries |
| `installer.py`, `installer.sh`, `installer.ps1` | Upgrade copies the framework-owned orchestrator, removes managed legacy TUI artifacts/specification, and never restores a STOP-only `auto.md` |
| parity validator and tests | Keep active/template copies exact and test the upgrade migration |

`auto` remains defined by `.opencode/agents/auto.md`; the Markdown command is
the documented host-valid handoff into that agent. No JSON command template or
separate server/package installation is introduced.

## Verification Contract

1. Command contract: `auto.md` has `agent: auto`, a non-STOP canonical prompt,
   and no JSON command template.
2. Negative contract: the active route contains no `@opencode/plugin/rpc`,
   `localRpcDefine`, `client.rpc`, `ctx.rpc.register`, or legacy TUI plugin spec.
3. Migration contract: all three installers remove only managed legacy artifacts
   and preserve unrelated `tui.json` configuration.
4. Parity contract: active and template OpenCode surfaces are byte-identical.
5. Real-host integration: against an `opencode 1.18.32` process, create a session
   and invoke `session.command({ sessionID, command: "auto" })`; assert agent
   `auto` is selected and the canonical user prompt is durably admitted. This is
   the lifecycle-start proof, not a mocked RPC invocation and not a claim that a
   provider completed the lifecycle.

## Atomic Task Seeds

| Seed | Work |
|---|---|
| T-anch | Verify `R-0152`, `DEC-0151`, exact 1.18.32 package versions, and no reopening of BUG-0023/0024/0027 |
| T-001 | Add the documented `/auto` Markdown command selecting agent `auto` |
| T-002 | Retire legacy RPC/TUI route and preserve BUG-0027's independent documented behavior |
| T-003 | Update active/template TUI configuration and triple-installer upgrade migration |
| T-004 | Add unit, negative-route, migration, and parity tests |
| T-005 | Add opt-in real-host `session.command("auto")` lifecycle-start integration evidence and update runbook |

**Next**: sprint plan, then implementation in a fresh development context. BUG-0030
remains OPEN and its acceptance criteria remain unchecked.

# BUG-0027 — OpenCode manual phase commands cannot persist canonical workflow evidence

## Overview

**`BUG-0027`** closes the **manual OpenCode phase persist residual**: direct slash commands (`/intake`, `/execute`, `/qa`, `/verify-work`) can run a role but cannot persist canonical sprint/handoff artifacts plus IsolationEvidence linked to the current story/bug and sprint. `runAutoLifecycleRpc` drops `storyId`/`sprintId`/`orchestratorRunId` and defaults `orchestratorSessionId` to `tui-auto`; `command.executed` only handles `name === "auto"`; the deny-last permission matrix (compose **BUG-0016 DONE**) omits execute `state.md`/`summary.md` and QA `state.md`; command packs invoke `intake_evidence_validate.py --repo . --enforce` (exit 2; live CLI is `--file`/`--stdin`/`--self-test`).

Distinct from **BUG-0024 DONE** / **R-0140** / **S0159** (CLI/TUI `/auto` live dispatch — compose only; do **not** reopen ACs; do **not** claim toast repair), **BUG-0016 DONE** (permission matrix — additive globs only), **BUG-0022 OPEN** / **BUG-0026 OPEN** (do not merge/drain), **US-0150 OPEN** (compose/link only). **R-0150** / **R-0140** held — do not wipe.

**This section does not supersede `# BUG-0024`.** Toast path / `OPENCODE_AUTO_TUI_DISPATCH_UNSUPPORTED` remains that section. This section owns **manual** phase persist + identity fields on IsolationEvidence (including `/auto` RPC forwarding IDs as AC-3 context-propagation, not toast repair).

**Research anchor**: **`R-0151`** (DQ1–DQ10 LOCKED). **Companion DEC**: **none** (same class as BUG-0019/0020/0021/0023/0024/0025). **EARLY_RESEARCH=0** — no new `R-xxxx`. **Out of scope**: reopen BUG-0024 / S0159; restore `auto.md`; route manual phases through `runAutoLifecycle`; add `--repo --enforce` to the Python intake CLI; second persist store; fabricate proofs; merge/drain BUG-0022/0026; mutate US-0150 as this bug's implementation; rewrite `.cursor/commands/`.

**Fresh context marker**: `tl-BUG0027-architecture-20260921T212200Z-fresh`
**Orchestrator run id**: `auto-20260921-bug0027`
**Parent**: `ir-20260921T190544Z-bug0027`
**Timestamp**: 2026-09-21T21:22:00Z (UTC)
**Verdict**: PASS (`decision_gate=false`)
**Next**: `/sprint-plan` (expected **S0160** — do **not** create this phase)
**baseline_h2_count (pre-mutate)**: `0`

## Approach locked (A1 Hybrid manual-phase persist — from R-0151 DQ1–DQ10)

**Approach A1 (A\*)** (locked): extend shared IsolationEvidence + `persistIsolationViaPython` with real story/sprint/run/bug IDs (one Python SOT `docs/engineering/state.md`); invoke that helper from a thin **`persistManualPhaseIsolation`** (not `runAutoLifecycle` drain); carry parent `sessionID` from `command.executed` / RPC (never default `tui-auto` for release evidence); targeted permission-matrix widen plus fail-closed-before-work; rewrite OpenCode command packs to supported validator CLI; no fabricated proofs.

1. **Identity fields (DQ2)**: extend `IsolationEvidence` with optional `storyId`, `sprintId`, `orchestratorRunId`, `bugId`. `spawnPhase` must **copy** those fields (today it drops them). `persistIsolationViaPython` + `scripts/opencode_auto_bridge.py --append-isolation` accept `--story-id` / `--sprint-id` / `--orchestrator-run-id` / `--bug-id`. Reject a second persist store (`ctx.storage`, sidecar JSON).
2. **Manual invoker (DQ1)**: `persistManualPhaseIsolation(ctx, event|args)` builds IsolationEvidence and calls the same Python helper. `/auto` keeps `runAutoLifecycle` → persist. Shared helper, distinct invokers. Do **not** route `/intake` `/execute` `/qa` `/verify-work` through `runAutoLifecycle`.
3. **Command names (LOCKED)**: persist limb fires when `command.executed` `name` is in `MANUAL_PHASE_COMMAND_NAMES` = `intake`, `discovery`, `research`, `architecture`, `sprint-plan`, `plan-verify`, `execute`, `qa`, `verify-work`, `release`, `refresh-context`, `closure`. `auto` stays on the lifecycle drain. AC-1 required set is `intake`/`execute`/`qa`/`verify-work`; the closed set above is the execute pin so discovery/research/etc. do not stay persist-blind.
4. **Context chain (DQ1)**: parent `sessionID` from `command.executed` / RPC / tool context. `storyId`/`sprintId`/`orchestratorRunId` from (1) event/RPC arguments when present, else (2) Python bridge reading `handoffs/resume_brief.md` / `docs/engineering/state.md` (same parser as `selectFirstPhaseViaPython` / `_parse_resume_brief`). Never default `orchestratorSessionId` to `tui-auto`.
5. **RPC forward (AC-3, not toast)**: `runAutoLifecycleRpc` forwards `storyId`/`sprintId`/`orchestratorRunId`; missing `sessionID` → `OPENCODE_MANUAL_PHASE_CONTEXT_MISSING` (do not substitute `tui-auto`). TUI dispatch toast path **unamended**.
6. **Reject placeholders (DQ6)**: `tui-auto` as **either** `parentID` **or** `orchestratorRunId` fail-closes with `OPENCODE_PLACEHOLDER_PARENT_REJECTED` and is **not** written to `state.md`. Missing real session/run context → `OPENCODE_MANUAL_PHASE_CONTEXT_MISSING`; do not invent IDs or proof tuples.
7. **Permissions (DQ3 hybrid)**: targeted glob widen, deny-last held (compose BUG-0016 — do not reopen; do not `edit: allow` all):
   - **dev**: add `docs/engineering/state.md` and `sprints/S*/summary.md`
   - **qa**: add `docs/engineering/state.md`
   - PO already allows `state.md`
8. **Fail-closed (DQ3)**: if a required write is still denied, STOP **before work** with `OPENCODE_MANUAL_PHASE_WRITE_DENIED`. After work, persist non-ok → `OPENCODE_MANUAL_PHASE_PERSIST_DENIED` and **no success claim**. If persist never ran by STOP (R-0119) → `OPENCODE_MANUAL_PHASE_PERSIST_NOT_INVOKED`. Plugin does **not** copy the permission array (DEC-0124 compose).
9. **Secondary trigger (optional defense)**: `tool.execute.after` / `session.idle` may invoke the **same** `persistManualPhaseIsolation` if `command.executed` did not fire; mutex so dual-fire does not double-append. Not a second persist store.
10. **Validator packs (DQ4/DQ5)**: rewrite OpenCode `intake.md` (active + template) to `--file`/`--stdin`/`--self-test`. Drop intake validator from `execute.md` and `discovery.md`. Keep `qa.md` / `verify-work.md` `bug_issue_validate.py --repo . --check-acceptance` (valid). Do **not** add `--repo --enforce` to `intake_evidence_validate.py`. Cursor `.cursor/commands/` **OUT**. Compose-amend US-0125 fixture named-CLI (ACs stay DONE).
11. Ten additive `test_bug0027_*` (below). Keep `test_bug0024_*` / `test_us0124_*` / `test_us0125_*` compose.
12. Upgrade `--host opencode|both` **overwrites** touched OpenCode pack/plugin/bridge paths.

| Option | Summary | Verdict |
|--------|---------|---------|
| **A1 Hybrid manual-phase persist** | Context-propagation + shared IsolationEvidence helper + targeted glob widen + fail-closed + supported validator packs | **Preferred / LOCKED** |
| A2 Persist-hook only | Only expand `command.executed` names | **Rejected** — IDs still dropped; permissions still deny; validator still invalid |
| A3 Permission widen only | Only add globs | **Rejected** — persist never invoked; context still `tui-auto` |
| A4 Fail-closed-only | Precise errors, no success path | **Rejected** — AC-1/AC-2 require a usable fallback |
| A5 Second persist store | `ctx.storage` / sidecar JSON | **Rejected** — state.md remains SOT |
| A6 Route manual phases through `runAutoLifecycle` | Treat `/execute` as auto drain | **Rejected** — `/auto` remains BUG-0024; would start the lifecycle loop |
| A7 Add `--repo --enforce` to Python CLI | Dual interface | **Rejected** — D5; Cursor packs already correct |

### Locked tokens (architecture-owned — DQ3/DQ6)

| Code | When |
|------|------|
| `OPENCODE_MANUAL_PHASE_WRITE_DENIED` | Required glob still denied — fail **before work** |
| `OPENCODE_MANUAL_PHASE_PERSIST_DENIED` | `persistIsolationViaPython` / bridge non-ok after work — no success claim |
| `OPENCODE_MANUAL_PHASE_PERSIST_NOT_INVOKED` | Persist never ran by STOP (R-0119 / missing `command.executed`) |
| `OPENCODE_PLACEHOLDER_PARENT_REJECTED` | `tui-auto` as `parentID` or `orchestratorRunId` — do not write evidence |
| `OPENCODE_MANUAL_PHASE_CONTEXT_MISSING` | Real session and/or story/sprint/run ids missing — do not invent |

Closed set: five tokens. Do not proliferate without a new research lock. Do **not** reuse BUG-0024 `OPENCODE_AUTO_TUI_*` tokens for this miss.

Existing compose tokens stay unchanged: `OPENCODE_AUTO_TUI_DISPATCH_UNSUPPORTED`, `OPENCODE_SUBTASK_IGNORED`, `OPENCODE_DRIVER_INVOKE_FAILED`, BUG-0016 deny-last.

### Helper + field pins (LOCKED)

| Name | Pin |
|------|-----|
| `persistManualPhaseIsolation` | Thin invoker for manual phase commands; builds IsolationEvidence; calls `persistIsolationViaPython` |
| `persistIsolationViaPython` | Shared durable write; extended argv for identity fields; still Python SOT |
| `IsolationEvidence` | Existing `parentID`, `sessionID`, `role`, `phase_id`, `timestamp`, `fresh_context_marker` **plus** `storyId?`, `sprintId?`, `orchestratorRunId?`, `bugId?` |
| `MANUAL_PHASE_COMMAND_NAMES` | Closed list above; `auto` excluded |
| Python `--append-isolation` | Add `--story-id`, `--sprint-id`, `--orchestrator-run-id`, `--bug-id` |

## Design challenge (assumptions / simpler / risks)

- **Alternative persist path?** Route `/execute` through `runAutoLifecycle`. Starts the auto drain loop and collides with BUG-0024. **Rejected.**
- **Alternative store?** `ctx.storage` or sidecar JSON looks smaller and forks the audit SOT. **Rejected.**
- **Alternative permissions?** Fail-closed-only without glob widen leaves AC-1/AC-2 success unusable. Widen-only leaves H1 persist miss. Hybrid is the simplest design that meets both.
- **Alternative validator?** Adding `--repo --enforce` to Python papers over the pack bug and forks Cursor-correct CLI. **Rejected.**
- **Can this be simpler?** Expanding only `command.executed` names is smaller and still drops IDs / denies writes / ships invalid CLI. A1 is the smallest design that meets D1–D8 and R-0151 A*.
- **Governance fork?** Residual of already-accepted IsolationEvidence / BUG-0016 matrix / US-0125 CLI — not a DEC-class product fork. **`decision_gate=false`**. No companion DEC.

## Components

### IsolationEvidence + Python bridge (DQ2)

`.opencode/plugins/orchestrator.ts` + template + `scripts/opencode_auto_bridge.py` (+ template):

- Add identity fields to the TypeScript interface and to `--append-isolation`.
- `spawnPhase` copies `storyId`/`sprintId`/`orchestratorRunId`/`bugId` onto evidence (stop dropping).
- `persistIsolationViaPython` rejects `tui-auto` before spawn; maps persist failure to `OPENCODE_MANUAL_PHASE_PERSIST_DENIED` (keep `OPENCODE_SUBTASK_IGNORED` for identical parent/session).
- Durable SOT remains `docs/engineering/state.md` (US-0048 / DEC-0029).

### Manual persist invoker (DQ1)

`persistManualPhaseIsolation`:

- Input: plugin ctx + `command.executed` payload (or RPC/tool `sessionID`).
- Resolve IDs via the context chain above.
- Fail closed with locked tokens; never invent proof tuples.
- `/auto` continues to persist via `runAutoLifecycle` using the **same** Python helper.

Optional secondary: `tool.execute.after` / `session.idle` → same function, mutex-guarded.

### Permission matrix (DQ3)

`.opencode/agents/dev.md` + `qa.md` + template mirrors: additive globs only; `"**": deny` last. Tests assert deny-default still holds for unrelated paths.

Fail-closed-before-work lives in command-pack prose + persist helper, **not** a duplicated permission array in the plugin (DEC-0124).

### Command packs (DQ4 / DQ5)

Stay ≤20 lines (US-0125 compose). Exact Validator-bridge rewrite:

- **intake.md** (active + template): `python scripts/intake_evidence_validate.py --file <bundle.json>` (or `--stdin` / `--self-test`). Remove `--repo . --enforce`. Persist sentence names `persistManualPhaseIsolation` (today's "plugin enforces persistence" is false until this bug ships).
- **execute.md** / **discovery.md**: drop `intake_evidence_validate` entirely. Optional isolation-persist sentence only.
- **qa.md** / **verify-work.md**: keep `bug_issue_validate.py --repo . --check-acceptance`.
- `.cursor/commands/` **OUT**.

### Consumer upgrade / parity (DQ9)

`its-magic --mode upgrade --host opencode|both` **overwrites** framework-owned OpenCode commands/agents/orchestrator/bridge paths via existing copy helpers. Do **not** overwrite Cursor command packs.

Extend `check_intake_template_parity.py` with additive `BUG0027_PAIRS` (keep `BUG0024_PAIRS`).

Runbook: one-line correction of the stale `intake_evidence_validate.py --repo . --enforce` stub (US-0125 compose; do not reopen US-0125 ACs). Recipe: (1) upgrade to the BUG-0027 release; (2) `its-magic --mode upgrade --host opencode|both`; (3) restart OpenCode; (4) direct `/execute` (or `/intake`) persists isolation with real IDs — or honest locked code. `/auto` toast remains BUG-0024.

US-0125 fixture + `test_us0125_validator_subprocess_fail_closed` named-CLI: compose-amend to supported invocation (contract evolution; ACs stay DONE).

## Test contract (DQ8 — ten markers)

Preferred file: `tests/bug0027_opencode_manual_phase_persist_test.py` (+ small node harness/fixture that mocks `command.executed` / RPC against fakes). **No live OpenCode CLI TUI probe** in default CI (`UAT_PROBE_FORBIDDEN`). Markers must **fail current tree**.

| # | Marker | Asserts |
|---|--------|---------|
| 1 | `test_bug0027_manual_phase_persists_isolation` | `/execute` (or `/intake`) mock `command.executed` with real `sessionID` + story/sprint/run → IsolationEvidence append includes those IDs (AC-1, AC-2, AC-3) |
| 2 | `test_bug0027_denied_persist_not_success` | Persist helper non-ok → phase result `ok: false` with `OPENCODE_MANUAL_PHASE_PERSIST_DENIED`; no success claim (AC-2) |
| 3 | `test_bug0027_rpc_forwards_story_sprint_run` | `runAutoLifecycleRpc` no longer drops IDs (AC-3) |
| 4 | `test_bug0027_tui_auto_rejected_as_release_evidence` | `tui-auto` as parentID or orchestratorRunId fail-closes `OPENCODE_PLACEHOLDER_PARENT_REJECTED`; not written as evidence (AC-3, DQ6) |
| 5 | `test_bug0027_no_fabricated_proof_when_orchestrator_unavailable` | Missing orchestrator/run context → `OPENCODE_MANUAL_PHASE_CONTEXT_MISSING`; no invented proof tuple (AC-4) |
| 6 | `test_bug0027_auto_tui_toast_not_claimed` | Dispatch toast / `OPENCODE_AUTO_TUI_DISPATCH_UNSUPPORTED` path **unchanged** (AC-4; compose BUG-0024) |
| 7 | `test_bug0027_validator_invocation_file_stdin_not_repo_enforce` | Active+template command packs contain no `intake_evidence_validate.py --repo . --enforce`; intake uses `--file`/`--stdin`/`--self-test` (AC-5) |
| 8 | `test_bug0027_non_intake_packs_drop_intake_validator` | execute.md / discovery.md do not require intake_evidence_validate (AC-5, DQ5) |
| 9 | `test_bug0027_active_template_parity` | Touched OpenCode commands/agents/plugin/bridge byte-parity (AC-6) |
| 10 | `test_bug0027_permission_matrix_phase_writes` | Dev allows `state.md` + `summary.md`; qa allows `state.md`; deny-last held (AC-1, DQ3) |

Keep `test_bug0024_*` / `test_us0124_*` / `test_us0125_*` green — additive only except the named US-0125 CLI compose-amend owned by marker 7.

## Touch surfaces (execute)

| Surface | Change |
|---------|--------|
| `.opencode/plugins/orchestrator.ts` + template | IsolationEvidence fields; `persistManualPhaseIsolation`; RPC forward; `command.executed` manual-phase limb; `spawnPhase` copy IDs; do **not** change TUI toast path |
| `scripts/opencode_auto_bridge.py` + template | `--append-isolation` identity fields |
| `.opencode/agents/{dev,qa}.md` + template | Targeted glob widen; deny-last held |
| `.opencode/commands/{intake,execute,discovery}.md` + template | Validator rewrite / drop; persist sentence truthful |
| `.opencode/commands/{qa,verify-work}.md` + template | Keep `bug_issue_validate.py --repo . --check-acceptance` |
| `.cursor/commands/` | **OUT** |
| `tests/us0125_contract_test.py` + `tests/us0125/fixtures/validator_artifact_mapping.json` | Compose-amend named CLI to supported invocation |
| `scripts/check_intake_template_parity.py` | Additive `BUG0027_PAIRS` |
| `tests/bug0027_*` | 10 markers |
| `tests/bug0024_*` / `us0124_*` / `us0125_*` | Unchanged compose (except US-0125 CLI amend) |
| `docs/engineering/runbook.md` (+ template) | One-line validator stub correction + manual-phase persist recipe |
| `installer.py` / `installer.sh` / `installer.ps1` | Overwrite touched OpenCode pack paths |

## Non-goals

- Allocate a companion DEC / rewrite `# BUG-0024` / `# BUG-0023` / R-0140 / R-0150
- Reopen BUG-0024 ACs / S0159; claim CLI/TUI `/auto` toast repair
- Restore STOP-only / empty `auto.md`; JSON `commands.auto` template
- Route manual phases through `runAutoLifecycle`
- Add `--repo --enforce` to `intake_evidence_validate.py`
- Second persist store (`ctx.storage`, sidecar JSON)
- Fabricate strict-proof tuples when orchestrator/run context is missing
- Merge/drain BUG-0022 / BUG-0026
- Mutate US-0150 as this bug's implementation
- Rewrite `.cursor/commands/`
- Reopen BUG-0016 / US-0125 ACs
- Live OpenCode CLI TUI probe in default CI
- Create `sprints/S0160/` this phase

## Risks

| Risk | Severity | Mitigation |
|------|----------|------------|
| R1 `command.executed` does not fire for markdown commands (R-0119) | MEDIUM | Fail-closed `OPENCODE_MANUAL_PHASE_PERSIST_NOT_INVOKED`; optional secondary `tool.execute.after` / `session.idle`; marker 2 |
| R2 Permission widen looks like reopening BUG-0016 | LOW | Additive globs only; deny-last held; marker 10 |
| R3 US-0125 fixture compose-amend looks like reopen | LOW | Additive `test_bug0027_*` own the new CLI; US-0125 ACs stay DONE; document as contract evolution |
| R4 RPC ID forward confused with BUG-0024 toast work | MEDIUM | Marker 6 asserts toast path unchanged; `/auto` drain loop unamended |
| R5 Fabricated proofs under unavailable orchestrator | HIGH | Marker 5; helper refuses `tui-auto` and missing run ids |
| R6 Dual-fire double-append isolation | LOW | Mutex on persist invoker; `/auto` remains distinct |

## AC coverage mapping (bug acceptance + R-0151)

| AC | Architecture owner | Seeds / tests |
|----|-------------------|----------------|
| AC-1 | Persist-eligible names + glob widen + fail-closed-before-work | T-002, T-004; markers 1, 10 |
| AC-2 | Persist-or-not-success | T-002, T-001; marker 2 |
| AC-3 | Real session/run IDs; reject `tui-auto` | T-001, T-003; markers 1, 3, 4 |
| AC-4 | `/auto` remains BUG-0024; no fabricated proofs | T-anch, T-003; markers 5, 6 |
| AC-5 | Supported validator CLI; drop from non-intake | T-005; markers 7, 8 |
| AC-6 | Contract tests + active/template parity | T-006, T-007; markers 1–10 |

Acceptance checkbox: `docs/product/acceptance.md` BUG-0027 row remains unchecked until closure (US-0045). Status stays **OPEN**.

## Atomic task seeds (for `/sprint-plan` → **S0160**)

| # | Seed | Surfaces |
|---|------|----------|
| T-anch | Verify `# BUG-0027` H1 + A1 + R-0151 DQ1–DQ10 + no companion DEC + do not rewrite `# BUG-0024` + do not reopen 0024 + do not claim toast repair + do not merge 0022/0026 + do not wipe R-0150/R-0140 | architecture.md, R-0151 (read-only) |
| T-001 | IsolationEvidence identity fields; `spawnPhase` copy; `persistIsolationViaPython` + `--append-isolation` `--story-id`/`--sprint-id`/`--orchestrator-run-id`/`--bug-id` | `orchestrator.ts` + `opencode_auto_bridge.py` (active + template) |
| T-002 | `persistManualPhaseIsolation` + `command.executed` limb for `MANUAL_PHASE_COMMAND_NAMES`; optional secondary event; **not** `runAutoLifecycle`; mutex vs double-append | `orchestrator.ts` (active + template) |
| T-003 | RPC/context forward; reject `tui-auto`; emit locked reason-code tokens; no fabricated proofs | `orchestrator.ts` `runAutoLifecycleRpc` + persist helper |
| T-004 | Permission glob widen (dev: `state.md` + `summary.md`; qa: `state.md`) + fail-closed-before-work; deny-last held | `.opencode/agents/{dev,qa}.md` + template |
| T-005 | Rewrite intake pack to `--file`/`--stdin`/`--self-test`; drop intake validator from execute.md/discovery.md; keep qa/verify-work `bug_issue_validate.py --repo . --check-acceptance` | `.opencode/commands/` + template |
| T-006 | Add 10 `test_bug0027_*` markers; no live OpenCode probe in default CI; do not weaken bug0024/us0124 except US-0125 CLI compose-amend | `tests/bug0027_*.py` (+ harness) |
| T-007 | US-0125 fixture named-CLI compose-amend + `BUG0027_PAIRS` + upgrade overwrite + runbook one-line validator stub correction | us0125 fixture + parity script + installer + runbook |

**Task count**: 8 seeds (T-anch + T-001..T-007). `SPRINT_MAX_TASKS=12` — no auto-split. Not `/quick`. Sprint-plan owns **S0160** materialization — **this phase does not create `sprints/S0160/`**. Ten `test_bug0027_*` named above.

## Decision linkage

- Decision: **none** (companion DEC not required — cite **R-0151** / this `# BUG-0027`)
- Compose (do not amend bodies): **DEC-0122** (permission matrix), **DEC-0124** / **DEC-0125** (plugin vs command.md), **DEC-0029** / **DEC-0038** (`compute_strict_proof_hash` tuple UNAMENDED)
- Research: **R-0151** (do not wipe **R-0150** / **R-0140**; **no new R-id**)
- Related: **US-0121**, **US-0122**, **US-0124**, **US-0125**, **US-0126**, **US-0150** compose/link; **BUG-0016 DONE** / **BUG-0024 DONE** — out of reopen scope; **BUG-0022 OPEN** / **BUG-0026 OPEN** — not mutated

## Isolation evidence (US-0048 / DEC-0029)

- `phase_id=architecture`, `role=tech-lead`, `bug_id=BUG-0027`, `sprint_id=none` (S0160 expected at sprint-plan)
- `delivery_mode=ultra_lean`, `macro_phase=plan`, `model_id=inherit` (CROSS_MODEL_REVIEW=0)
- `fresh_context_marker=tl-BUG0027-architecture-20260921T212200Z-fresh`, `timestamp=2026-09-21T21:22:00Z` (UTC)
- `orchestrator_run_id=auto-20260921-bug0027`, `parent_orchestrator_run_id=ir-20260921T190544Z-bug0027`
- `evidence_ref=docs/engineering/research.md ## R-0151; docs/product/backlog.md ### BUG-0027; docs/engineering/architecture.md (this # BUG-0027); handoffs/resume_brief.md; handoffs/po_to_tl.md`
- Fresh tech-lead subagent per BUG-0006; narrow-read only. No `.env`. No companion DEC. No `sprints/S0160/`. No Status/AC mutation. No `/sprint-plan` spawn. No npm-publish. No git push. No sovereign-critic (CROSS_MODEL_REVIEW=0). No BUG-0024 reopen. No toast-repair claim. No BUG-0022/0026 drain.

## Strict runtime proof

- `runtime_proof_id=rp-auto-20260921-bug0027-architecture-techlead-20260921T212200Z-BUG-0027`
- Hash via `scripts.token_cost_lib.compute_strict_proof_hash` (positional; compact sorted-key JSON).
- Canonical hashed payload: `{"orchestrator_run_id":"auto-20260921-bug0027","phase_id":"architecture","proof_issued_at":"2026-09-21T21:22:00Z","proof_ttl_seconds":3600,"role":"tech-lead","runtime_proof_id":"rp-auto-20260921-bug0027-architecture-techlead-20260921T212200Z-BUG-0027"}`
- Isolation extras (not hashed): `delivery_mode=ultra_lean`, `macro_phase=plan`, `model_id=inherit`, `sprint_id=none`, `bug_id=BUG-0027`, `skipped_phases=[intake]`, `CROSS_MODEL_REVIEW=0`, `native_chain_active=true`, `native_chain_continuing=true`, `segment_work_item_kind=bug`
- `proof_hash=766B032B5B6FEBFCC6524E30F4A94DEED4EFBCE14AB73F56D2DCBF893FEFE489`
- `proof_ttl=2026-09-21T22:22:00Z`
- `hash_recompute_confirmation=true` (compute_strict_proof_hash → 766B032B5B6FEBFCC6524E30F4A94DEED4EFBCE14AB73F56D2DCBF893FEFE489; independently MATCH; **64 hex** verified)
- Consumed research proof: `rp-auto-20260921-bug0027-research-techlead-20260921T211500Z-BUG-0027` / `F89D067B09A413B1AC41D5B7811EBAC8BC4CA4D6FCD7264BC2BFD7C3BFCD8782` — RUNTIME_PROOF_VALID MATCH before TTL `2026-09-21T22:15:00Z` (consumed_at `2026-09-21T21:22:00Z`; not STALE)

# US-0156 - OpenCode `/auto` parity: continuous lifecycle, drain, resume, and phase selection

**Research anchor**: `R-0153`. **Companion decision**: `DEC-0152` Accepted.
**Approach**: A1 (A*) command-owned sequential Task lifecycle. **Expected sprint**:
`S0162`. **Status**: OPEN; acceptance remains unchanged.

## Problem and scope

BUG-0030 established the supported OpenCode command route:
`.opencode/commands/auto.md` selects the primary `auto` agent. It does not yet
provide a complete lifecycle scheduler. The retired TUI/RPC route is detached
from command dispatch, while the remaining bridge can silently choose `execute`
when resolution fails. That behavior cannot satisfy resume, phase-selection, or
continuous-drain safety.

US-0156 makes one command-owned parent session schedule fresh role Tasks across
the resolved lifecycle and eligible next segments. The parent is scheduling-only:
it neither performs phase artifact work nor claims a child phase succeeded
without durable evidence and an admitted Stop-Matrix action.

## Locked architecture

1. **Command and parent**: Keep the Markdown `auto.md` command with `agent:
   auto`. Extend the active/template command and auto-agent instruction contract
   with a finite sequential algorithm: resolve once, spawn one child, wait,
   inspect durable result, resolve the next boundary, then continue or stop. Do
   not recursively invoke `/auto` and do not restore TUI/RPC, a JSON command
   template, or localhost dispatch.
2. **Resolver**: Extend `scripts/opencode_auto_bridge.py` with a typed,
   read-only continuation resolution operation. Inputs are explicit start anchor,
   merged policy, and durable resume/state sources. Output is either one complete
   plan/item tuple or a reason-coded failure. Remove every `fallback_execute`
   return from both the TypeScript adapter and Python bridge.
3. **Precedence**: Apply `start-from` first. Without it, accept one validated
   `resume_brief` pointer; use `state.md` only as a validated fallback. Resolve
   exactly one effective phase plan, then intersect it with the anchor. Missing,
   stale, ambiguous, unknown, or empty-intersection values fail closed before a
   child Task starts.
4. **Scheduler**: Explicit `bug-target` selects the bug scheduler. Otherwise,
   `AUTO_BACKLOG_DRAIN=1` selects the next dependency-eligible OPEN story.
   Simultaneous story drain and bug queue without explicit-target precedence
   returns `AUTO_SCHEDULER_CONFLICT`. Unknown, DONE, blocked, and empty choices
   return distinct reason codes and spawn nothing.
5. **Boundary decision**: `scripts/auto_outer_driver.py` remains the canonical
   Stop-Matrix authority. The parent may advance only for an explicit continuation
   action and next phase/segment. Hard gates, decision requests, pause, missing
   evidence, quality/UAT failures, release ownership, security stops, and
   exhausted retry/loop/backlog/bug budgets terminate the run unchanged.
6. **Provenance**: Extend the bridge-owned resume/state protocol with an
   idempotent continuation tuple keyed by `orchestrator_run_id`, work-item kind,
   work-item ID, and phase ID. It records selected source, effective plan,
   skipped phases, completed/next phase, cursor/budget, stop reason, and child
   isolation reference. Exact repeats are no-ops; conflicting evidence or a
   reused child session fails closed.
7. **Manual phases**: `persistManualPhaseIsolation` remains the separate audit
   route for direct slash commands. It neither advances the parent lifecycle nor
   substitutes for fresh child Task evidence.
8. **Role permission repair**: Object-form permission maps use broad deny first
   and owned-path allows after it. OpenCode evaluates the last matching rule, so
   the former deny-last order prevented every owned-path edit and prevented the
   auto agent from spawning its explicitly allowed roles. Security remains
   read-only.

## Interfaces and reason codes

The bridge continuation result is a JSON object with either `ok=true` and
`{source, work_item_kind, story_id|bug_id, sprint_id, effective_phase_plan,
skipped_phases, phase_id, cursor, remaining_budget, continuation_key}`, or
`ok=false` and one reason code. Architecture-owned codes are:

| Code | Meaning |
|---|---|
| `OPENCODE_AUTO_RESOLUTION_FAILED` | Bridge/source parsing or validation failed. |
| `OPENCODE_AUTO_RESUME_AMBIGUOUS` | Resume and state provenance conflict. |
| `OPENCODE_AUTO_PHASE_PLAN_INVALID` | Unknown, conflicting, or empty plan/anchor intersection. |
| `OPENCODE_AUTO_CONTINUATION_CONFLICT` | Duplicate key has incompatible evidence or child session. |
| `OPENCODE_AUTO_DEPENDENCY_BLOCKED` | No dependency-eligible story can be selected. |

Existing `AUTO_SCHEDULER_CONFLICT`, bug-target, Stop-Matrix, proof, and cap
reason codes are reused rather than renamed.

## Test contract

| Marker | Contract |
|---|---|
| `test_us0156_auto_command_owns_spawn_only_parent` | `auto.md` selects `agent: auto`; no retired route or parent edit permission. |
| `test_us0156_sequential_fresh_phase_tasks` | Every admitted phase has a distinct child session, expected role, and evidence reference. |
| `test_us0156_resolver_never_falls_back_to_execute` | Bridge/parser/source failures fail closed; no `fallback_execute` remains. |
| `test_us0156_start_from_resume_phase_plan_precedence` | Anchor/source precedence and plan intersection are deterministic. |
| `test_us0156_story_bug_scheduler_mutex_and_order` | Explicit bug target, dependency order, OPEN-only filtering, and conflict/empty failures. |
| `test_us0156_stop_matrix_and_cap_boundaries` | Only explicit continuation advances; all hard stops and caps terminate. |
| `test_us0156_resume_idempotence_provenance` | Exact continuation repeat is a no-op; conflicts/reused sessions fail closed. |
| `test_us0156_dod_and_active_template_parity` | BUG-0022/0027 gate, BUG-0028/0029 non-closure, parity, and installer overwrite. |
| `test_opencode_agent_permission_specific_paths_override_broad_deny` | Broad deny first retains deny-by-default and makes owned paths/auto Tasks effective. |

No default CI test claims a live desktop, `--pure`, or provider-complete run.

## Touch surfaces and task seeds

| Task | Scope |
|---|---|
| T-anch | Verify R-0153, DEC-0152, BUG-0030 command ownership, all out-of-scope guards, and no status/AC mutation. |
| T-001 | Implement typed continuation resolution and remove `fallback_execute` in bridge/support code. |
| T-002 | Implement effective-plan intersection, resume validation, and reason-coded failures. |
| T-003 | Implement story/bug selection, dependency ordering, mutex, cursor, and cap accounting. |
| T-004 | Implement Stop-Matrix continuation action handling and idempotent continuation provenance. |
| T-005 | Expand active/template auto command and auto agent into the sequential fresh-Task contract. |
| T-006 | Keep manual persistence separate; integrate child isolation references without fabricated proof. |
| T-007 | Preserve broad-deny-first role policy and add regression coverage for path/task precedence. |
| T-008 | Add `test_us0156_*`, active/template parity, installer-overwrite, and runbook coverage. |
| T-009 | Run targeted regressions for BUG-0027, BUG-0030, permission policy, and US-0156. |

Ten tasks, including `T-anch`, fit `SPRINT_MAX_TASKS=12`; `/sprint-plan` owns
creation of `S0162`.

## Non-goals and closure gate

- Do not restore OpenCode TUI/RPC, add a JSON template or localhost endpoint,
  claim Desktop Command.Info or `opencode --pure`, change standalone `itsm`,
  read `.env`, publish, or push.
- Do not weaken Stop-Matrix, role isolation, quality/release gates, or manual
  persistence failure behavior.
- US-0156 remains OPEN until BUG-0022 and BUG-0027 are DONE and verify-work
  records both prerequisites. BUG-0028 and BUG-0029 remain independent OPEN
  slices unless closed by their own work.
- Next: `/sprint-plan` in a fresh tech-lead context. Do not implement from this
  architecture phase.

# BUG-0022 - `/auto` Task-spawns inherit parent chat model instead of role_catalog

**Research anchor**: **`R-0154`** (DQ1–DQ10 LOCKED; compose **R-0133** prior
spawn-model research, **US-0101 DONE / DEC-0086**, **US-0102 DONE / DEC-0087**,
**US-0104 / DEC-0104**, **US-0130** critic overlay — do not wipe, do not
rewrite, do not reopen their ACs). **Companion DEC**: **none** (same
defect-class pattern as BUG-0019 / BUG-0020 / BUG-0021 / BUG-0023 / BUG-0024 /
BUG-0025 / BUG-0027 / BUG-0030). **Approach**: **A1 (A\*) resolve-then-spawn
contract** from R-0154. **Expected sprint**: **S0163** (S0162 = US-0156
verify-work — do **not** create this phase). **DoD gate (D10)**: BUG-0022 is
the last OPEN DoD blocker for US-0156 (BUG-0027 DONE); closing BUG-0022
unblocks US-0156 closure — this phase does **not** tick or release US-0156.

**Fresh context marker**: `tl-cursor-20260929-BUG0022-architecture-fresh`
**Producer**: `tech-lead`, `/architecture`, `bug-target=BUG-0022`, fresh
subagent (BUG-0006). **Timestamp**: 2026-09-29 (UTC). **Verdict**: PASS
(`decision_gate=false`). **No runtime proof issued** (D5 mock-injection
contract proof belongs to execute/verify-work).

## Problem and scope (defect class)

With `MODEL_RESOLVE=role_catalog` and a valid `MODEL_CATALOG`, every `/auto`
producer **Task spawn** in the Cursor IDE still carries the parent chat model
(silent `inherit`), and the **critic spawn** still carries a hardcoded release
slug (`composer-2.5-fast`). The resolver libs are DONE and correct —
`scripts/model_tier_lib.resolve_model_for_phase` (5-step precedence, step-3 role
catalog, provenance string) and `scripts/sovereign_critic_lib.select_critic_model`
(`roles.critic` overlay) — the defect is **one hop downstream**: the spawn
contract (orchestrator command prose + agent frontmatter) never consumes the
resolvers. This is the **Cursor IDE Task-spawn class**, distinct from the
OpenCode Markdown-command dispatch class (BUG-0030 / US-0156) — do **not**
merge or drain.

## Locked architecture (A1 resolve-then-spawn)

1. **Pre-spawn model resolution (normative contract)** — in
   `.cursor/commands/auto.md` **before step 4** ("spawn a fresh subagent for
   that phase's canonical role"), and mirrored verbatim in
   `template/.cursor/commands/auto.md`, add this additive step:

   > **Pre-spawn model resolution (BUG-0022 / R-0154)**: before **any** Task
   > spawn, call `model_tier_lib.resolve_model_for_phase(phase_id, scratchpad,
   > catalog)` (DEC-0087 / US-0102). On success, emit the Task with
   > `model: <slug or alias>` and record `model_id=<slug-or-alias>` and
   > `model_provenance=<result.provenance>` on the per-spawn isolation row in
   > `docs/engineering/state.md`. On fail-closed, record the `ReasonCode` token
   > (`MODEL_TIER_INVALID`, `MODEL_CATALOG_INVALID`, `MODEL_SLUG_UNKNOWN`,
   > `MODEL_RESOLVE_FALLBACK`, `MODEL_OVERRIDE_SLUG_UNKNOWN`,
   > `MODEL_ROLE_SLUG_UNKNOWN`, `MODEL_CATALOG_SCHEMA_V2_INVALID`) on that row
   > and emit the Task with **no `model:` key** — except when steps 1–4 all
   > miss **and** a documented override (`MODEL_<PHASE>` / `MODEL_TIER_<PHASE>`
   > / `MODEL_TIER_DEFAULT`) is present in scratchpad, in which case `model:
   > inherit` with `MODEL_RESOLVE_FALLBACK` provenance is the **only**
   > legitimate inherit. **Never emit a Task that inherits silently.**

   The existing **Cross-model adversarial critic post-phase hook** (auto.md §
   hook, step 1) is aligned: resolve `producer_model_id` via
   `model_tier_lib.resolve_model_for_phase(...)` **and** use the resulting
   slug as the producer Task `model:`; step 2 threads
   `select_critic_model(producer_model_id, scratchpad, phase_id)` output
   `critic_model_id` into the **critic** Task `model:` (catalog `roles.critic`
   — never a hardcoded release slug); `degraded=true` (US-0130) behavior
   unchanged.

2. **Agent frontmatter alignment (active + template, 6 roles × 2 trees)** —
   `.cursor/agents/{po,release}.mdc`: **remove** the hardcoded `model: inherit`
   frontmatter key. `.cursor/agents/{dev,qa,security,tech-lead}.mdc`: already
   keyless — unchanged. `.cursor/agents/curator.mdc`: `model: fast` retained
   (explicit tier-alias intent, out of the inherit surface; not touched).
   Template twins `.cursor/agents/*.mdc` (under `template/`) mirrored
   byte-for-byte. The resolver is the SOT; frontmatter becomes a neutral
   default, not a silent-inher source. **No new key, no schema change.**

3. **Provenance / isolation row (D6)** — each `/auto` spawn isolation row in
   `docs/engineering/state.md` carries the existing `producer_model_id` /
   `critic_model_id` (DEC-0038 tuple, unchanged) **plus** additive
   `model_id` and `model_provenance` (format
   `provenance=host=cursor;path=<catalog-relative>;step=<step-1..5>`, or
   `unresolved-<REASON_CODE>`). Detectable rule: `model_id=inherit` **and** no
   `step=step-4|step-5` provenance and no documented override → silent-inherit
   defect (BUG-0022 class), reviewer-detectable.

4. **Fail-closed role gaps (D6/DQ6)** — role→catalog gaps `qe` / `curator` /
   `tech-lead` / `closure` / `sprint-plan` remain **unresolved-but-cited**:
   per-spawn `MODEL_ROLE_SLUG_UNKNOWN` on the isolation row, **never** a
   silent inherit alias, **never** a force-map. Catalog hygiene (missing keys,
   stale "Claude Opus 4.8" notes in the v2 examples) is a **bounded,
   tracked-alongside** follow-on for a future `US-xxxx` slot — **not** this
   bug, **not** a schema redesign; the catalog `schema` is unchanged.

5. **Parity and regression guards (compose-only, unchanged)** —
   `scripts/model_tier_lib.py` ↔ `template/scripts/model_tier_lib.py` parity
   (byte-identical; regression guard only, **no edit**);
   `.cursor/model-catalog.local.example.*.json` 8+ path example parity
   (`python scripts/check_intake_template_parity.py --scope
   model-tier-overrides` → `MODEL_CATALOG_EXAMPLE_PARITY_SCOPE_OK`); the
   compose-only suites `test_us0101_*` / `test_us0102_*` / `test_us0104_*` /
   `test_us0130_*` and `python scripts/model_tier_lib.py --self-test` →
   `[MODEL_TIER_SELF_TEST_OK]` stay green.

## Touch surfaces (active ↔ template byte-parity)

| Surface | Change |
|---|---|
| `.cursor/commands/auto.md` | Additive pre-spawn model-resolution step before step 4 + critic-hook step-1 alignment (prose). |
| `template/.cursor/commands/auto.md` | Byte-parity mirror of the above. |
| `.cursor/agents/{po,release}.mdc` | Remove `model: inherit` frontmatter (keyless). |
| `template/.cursor/agents/{po,release}.mdc` | Byte-parity mirror. |
| `tests/bug0022_cursor_task_spawn_model_test.py` | New mock-injection contract file (8 markers). |
| `template/tests/bug0022_cursor_task_spawn_model_test.py` | Parity mirror (asserted). |
| `docs/engineering/runbook.md` § *Role catalog enablement recipe* | One-line addendum: the `/auto` orchestrator MUST run `resolve_model_for_phase` per phase **before** Task spawn and record `model_provenance` on the isolation row (BUG-0022 / R-0154). |

**Out of scope (D8/D9/D10 — untouched)**: `scripts/model_tier_lib.py` /
`scripts/sovereign_critic_lib.py` / `template` resolver-lib twins (DONE
resolver-lib ACs — compose only); `.opencode/commands/auto.md` and all
`.opencode/agents/*.md` (OpenCode US-0156/BUG-0030 surface — distinct class);
`.cursor/scratchpad.local.md` / `model-catalog.local.json` (operator-local,
gitignored); catalog **schema** (`schema_version` 1/2 unchanged);
`scripts/auto_outer_driver.py` / `scripts/opencode_auto_bridge.py` /
`scripts/opencode_model_catalog_apply.py` (compose only);
`.cursor/agents/curator.mdc` `model: fast`; all historical `# BUG-*` /
`# US-*` architecture bodies.

## Test contract (DQ7 — mock-injection, no live Cursor probe)

`tests/bug0022_cursor_task_spawn_model_test.py` (+ `template/` mirror), 8
markers, all currently failing on the pre-fix contract prose:

1. `test_bug0022_producer_spawn_carries_catalog_model_when_role_catalog` — AC-1: `MODEL_RESOLVE=role_catalog` + balanced `MODEL_CATALOG` → every producer phase Task carries `model: <catalog-resolved>` (not `inherit`) for the resolvable role set (po, sa/tech-lead, dev, qa, security, release).
2. `test_bug0022_critic_spawn_carries_roles_critic` — AC-2: critic Task carries `model: gpt-5.6-luna-medium` (catalog `roles.critic`), **not** `composer-2.5-fast`.
3. `test_bug0022_role_catalog_gaps_fail_closed` — AC-3: `qe`/`curator`/`tech-lead`/`closure`/`sprint-plan` gaps → `MODEL_ROLE_SLUG_UNKNOWN` per spawn on the isolation row, **no silent `inherit` alias**.
4. `test_bug0022_inherit_only_on_documented_fallback` — AC-4: `inherit` only with chain-reached step 4/5 **and** documented scratchpad override (**`MODEL_RESOLVE_FALLBACK`** provenance); absent override → not silently inherit.
5. `test_bug0022_5_step_chain_unchanged` — AC-7: compose-only suites `test_us0101_*` / `test_us0102_*` / `test_us0104_*` / `test_us0130_*` + `python scripts/model_tier_lib.py --self-test` → `[MODEL_TIER_SELF_TEST_OK]` still green (sibling integrity).
6. `test_bug0022_provenance_isolation_row` — AC-6: every producer and critic spawn isolation row carries additive `model_id` + `model_provenance` distinguishable from `role` / `phase_id` / `fresh_context_marker`.
7. `test_bug0022_active_template_parity` — AC-8: byte-parity `.cursor/commands/auto.md` ↔ template twin, 6 `.cursor/agents/*.mdc` pair set, `scripts/model_tier_lib.py` ↔ template, test-file mirror, 8-path catalog-example parity (`MODEL_CATALOG_EXAMPLE_PARITY_SCOPE_OK`).
8. `test_bug0022_no_sibling_mutation` — AC-7 + D9: `test_bug0021_*` / `test_bug0023_*` / `test_bug0030_*` compose suites green as-is; BUG-0021/0023/0024/0026/0027/0028/0029/0030 ACs untouched; US-0156 OPEN/unchecked; `backlog ### BUG-0022` OPEN.

No default-CI marker claims a **live Cursor IDE** run (D5: mock-only; live
Cursor is operator UAT post-ship). Live-probe stays `UAT_PROBE_FORBIDDEN`.

## Task seeds (≤ `SPRINT_MAX_TASKS=12`)

| Task | Contract |
|------|----------|
| `T-anch` | Verify `# BUG-0022` + R-0154 DQ1–DQ10 + no companion DEC + surfaces (D9) + sibling/DoD guards, read-only anchors. |
| `T-001` | Additive pre-spawn step + critic step-1 alignment in `.cursor/commands/auto.md` (active) with exact wording above. |
| `T-002` | Template mirror `template/.cursor/commands/auto.md` byte-parity. |
| `T-003` | Frontmatter alignment: remove `model: inherit` from `.cursor/agents/{po,release}.mdc` + template twins; dev/qa/security/tech-lead keyless; curator `model: fast` untouched. |
| `T-004` | Isolation/provenance contract wording + state-row format lock (`model_id`, `model_provenance`) runbook + prose consistency. |
| `T-005` | `tests/bug0022_cursor_task_spawn_model_test.py` (active) 8 markers. |
| `T-006` | Template test mirror + `test_bug0022_active_template_parity` 8-path assertion incl. `MODEL_CATALOG_EXAMPLE_PARITY_SCOPE_OK`. |
| `T-007` | Regressions: `test_us0101/us0102/us0104/us0130` + `model_tier_lib --self-test` + `test_bug0021/0023/0030` suites green; runbook addendum + template parity sync. |

Seven tasks incl. `T-anch` — within cap; **`/sprint-plan`** owns **S0163**
creation. `ultra_lean`: plan-verify is a deferred/skipped placeholder — not a
QA spawn; do not claim QA PASS from planning.

## Non-goals and closure gate

- Do not merge/drain/reopen BUG-0021 / BUG-0023 / BUG-0024 / BUG-0026 /
  BUG-0027 / BUG-0028 / BUG-0029 / BUG-0030 (AC-7). Do not reopen US-0101 /
  US-0102 / US-0104 / US-0130 resolver-lib ACs.
- Do not mutate or tick US-0156 (this bug **is** its DoD gate); do not tick
  `docs/product/acceptance.md` or flip `### BUG-0022` status (verify-work /
  closure owns per US-0045) — BUG-0022 remains **OPEN**, AC-1..AC-8 **unchecked**.
- Do not restore STOP-only `.opencode/commands/auto.md`; do not add JSON
  `commands.auto` templates; do not touch the `.opencode` OpenCode surface
  (BUG-0030 / US-0156 class); do not change the catalog schema or
  resolver-lib sources; do not author a companion DEC; do not create
  `sprints/S0163/` this phase.
- No npm publish, no git push, no `.env` reads (AC-8).
- **Next**: `/sprint-plan` in a fresh tech-lead context (owner of **S0163**).
  STOP after architecture handoff; orchestrator MUST spawn `/sprint-plan` in
  a fresh tech-lead — **do not** implement from this phase (BUG-0006); do not
  spawn `/execute` from `/sprint-plan`.

# BUG-0031 — `/closure` cannot complete on OpenCode: no spawnable closure role is authorized to write the canonical DONE-flip paths

**Research anchor**: **`R-0155`** (DQ1–DQ10 LOCKED; compose **R-0154** / **R-0153** — do **not** wipe, do **not** rewrite, do **not** reopen their ACs). **Companion DEC**: **none** (R-0155 L16032: "Companion DEC: **none** from research"; same defect-class pattern as BUG-0019 / BUG-0020 / BUG-0021 / BUG-0022 / BUG-0023 / BUG-0024 / BUG-0025 / BUG-0027 / BUG-0030). **Approach**: **A1 (A\*) curator-only 3-allow additive parity repair** from R-0155 DQ1–DQ10. A* is:
1. **(a) Curator 3-allow delta** — add **exactly three** `edit:` `allow` rows to **both** `.opencode/agents/curator.md` (active) **and** `template/.opencode/agents/curator.md` (template — byte-parity US-0017 guard); `docs/product/backlog.md`, `docs/product/acceptance.md`, `sprints/S*/closure-verification.md` — appended **after** the existing allow set (after `handoffs/archive/**`) and **before** `bash: ask`, so DENY-FIRST (DEC-0152 L40-43 last-matching-wins) is preserved; the broad `"**": deny` row is **not reordered, widened, or rewritten**. `docs/engineering/state.md` is **already** `allow` (L7) — no 4th delta (DQ4).
2. **(b) Fail-closed diagnostic contract** — add a new stage-precise token **`CLOSURE_PERMISSION_FLIP_PATHS_DENIED`** (DQ8 / A1) to the **rich Closure-surface** pair (`.cursor/commands/closure.md` + `template/.cursor/commands/closure.md`) in BOTH the `## Fail-safe reason codes and remediation guidance` table (L161-171) AND the `## Stop conditions` bullet list (L56-74); register it in `docs/engineering/runbook.md` § Closure troubleshooting table (L4349-4357) and in `docs/engineering/reason_codes.md` (compose-additive — do **not** rewrite the existing `CLOSURE_*` family). The **thin OpenCode** `.opencode/commands/closure.md` pack (+ `template/.opencode/commands/closure.md`) is a **distinct 20-line surface** with **zero** `CLOSURE_*` tokens and is **not** touched this phase.
3. **(c) Short additive OpenCode-surface parity note** (DQ6 / A2) — a short prose note in the **rich Closure-surface** pair (`.cursor/commands/closure.md` + `template/.cursor/commands/closure.md`) immediately after the existing `override` bullet at L10, recording: on OpenCode `qe` is unspawnable so the sanctioned alternate is `curator`; `curator` must be authorized to write the three flip paths; if not, fail-closed with `CLOSURE_PERMISSION_FLIP_PATHS_DENIED` — **never** an operator hand-flip.
4. **(d) Additive test suite** — author `tests/bug0031_opencode_closure_flip_authz_test.py` (active) + `template/tests/bug0031_opencode_closure_flip_authz_test.py` (mirror — byte-parity), 8 markers `test_bug0031_*`, mock-injection style (no live OpenCode probe; `UAT_PROBE_FORBIDDEN`), composing with `test_bug0027_*` and `test_bug0016*` **unmodified**.

**Expected sprint**: **S0164** (S0163 = US-0156 verify-work — do **not** create this phase; next-free verified against `sprints/` live listing: S0001..S0092, S0103..S0163 → **S0164**).
**DoD gate**: BUG-0031 repair **unblocks** (does **not** perform) the S0163/BUG-0022 flip; US-0156 AC-7 remains **not** ticked this phase (US-0045 owns the canonical flip; closure owns).
**delivery_mode**: **`ultra_lean`** (plan-verify is a deferred/skipped placeholder — not a QA spawn; do not claim QA PASS from planning).

**Fresh context marker**: `tl-BUG0031-architecture-20261001T150000Z-fresh`
**Producer**: `tech-lead`, `/architecture`, `bug-target=BUG-0031`, fresh subagent (BUG-0006). **Timestamp**: 2026-10-01 (UTC). **Verdict**: PASS (`decision_gate=false`). **No runtime proof issued** (D9 mock-injection / permission-map proof belongs to execute/verify-work per R-0155 L15889).

## Problem and scope (defect class)

On the OpenCode host, the primary closure role `qe` is **not spawnable** (no `.opencode/agents/qe.md`; no `.cursor/agents/qe.mdc`; no TUI/RPC registration — `qe` is a Cursor-host subagent shape only). The sanctioned alternate **`curator`** (DEC-0051 §1 L41, §2 L53, §3 L70-72; DEC-0052 §4 L87-89) is **spawnable** (`mode: subagent` L3) but has **no write authorization** over exactly **three** of the four canonical DONE-flip paths — `docs/product/backlog.md` (status+AC), `docs/product/acceptance.md` (row), `sprints/S*\/closure-verification.md` (create) — while **`docs/engineering/state.md`** (the 4th, L7) is already held. Result: hard fail-closed `CLOSURE_BLOCKED_PERMISSION_MATRIX` and only an operator hand-flip workaround. Live-falsified in S0163/BUG-0022 (state.md L1612 `CLOSURE_VERIFY_PASS` + blocked flip). Distinct from **BUG-0027** (manual-phase *persistence* — a phase role writing **its own phase's** evidence) and **BUG-0016** (DONE — general bash/edit posture + `S*` globs for po/curator/dev/qa/release — additive-only under its own guard, **not reopened**). Compose **DEC-0152** (deny-by-default ordering) + **DEC-0051** (phase→role contract) + **DEC-0052** (phase plan + `AUTO_ROLE_CLOSURE`); do **not** rewrite any.

## Locked architecture (A1 curator-only 3-allow additive parity repair — from R-0155 DQ1–DQ10)

### 1. Curator 3-allow delta (DQ1 / DQ2 / DQ3 / DQ4 / DQ5) (LOCKED — exact normative before→after)

Both files (`active` `.opencode/agents/curator.md`, `template` `template/.opencode/agents/curator.md`) are byte-identical today (SHA-256 `9CC4CC11B07BE362B86A20B7C8405F2ABE30064C8E791A4653D99D6B24624595`), so the **same** delta lands in both (US-0017 parity). The change is **append-only** — the existing `edit:` block (L6–L14) and the `bash: ask` / `task: deny` lines (L15–L16) are **unchanged in content and order**.

**BEFORE** (active L6–L16 = template L6–L16):

```yaml
   edit:
     "**": deny
     "docs/engineering/state.md": allow
     "docs/engineering/state-archive/**": allow
     "docs/engineering/decisions.md": allow
     "docs/engineering/research.md": allow
     "handoffs/resume_brief.md": allow
     "handoffs/portfolio_state.md": allow
     "handoffs/continuation_hygiene.md": allow
     "handoffs/archive/**": allow
   bash: ask
   task: deny
```

**AFTER** (three `allow` rows appended after `handoffs/archive/**`, before `bash: ask`; **everything else byte-identical**):

```yaml
   edit:
     "**": deny
     "docs/engineering/state.md": allow
     "docs/engineering/state-archive/**": allow
     "docs/engineering/decisions.md": allow
     "docs/engineering/research.md": allow
     "handoffs/resume_brief.md": allow
     "handoffs/portfolio_state.md": allow
     "handoffs/continuation_hygiene.md": allow
     "handoffs/archive/**": allow
     "docs/product/backlog.md": allow
     "docs/product/acceptance.md": allow
     "sprints/S*/closure-verification.md": allow
   bash: ask
   task: deny
```

- **Appended rows (exactly three, this order)**: `"docs/product/backlog.md": allow`, `"docs/product/acceptance.md": allow`, `"sprints/S*/closure-verification.md": allow`.
- **DQ3 (compose, do not reorder)**: the broad `"**": deny` stays the **first** `edit:` row; last-matching-wins (DEC-0152 §Consequences L40-43) is preserved. This is **additive** to the curator allow set only — it does **not** reopen or mutate BUG-0016's DONE baseline.
- **DQ4 (no 4th delta)**: `docs/engineering/state.md` is already held (L7) — do **not** add a redundant allow.
- **DQ5 (`S*` wildcard)**: `sprints/S*/closure-verification.md` matches the existing per-role `S*` glob convention (dev L11-13, tech-lead L13-14, release L13, qa L7-11). A specific-sprint literal (e.g. `sprints/S0163/...`) is a US-0017 drift anti-pattern — **rejected**.

### 2. Fail-closed diagnostic contract (DQ8 / A1) — `CLOSURE_PERMISSION_FLIP_PATHS_DENIED`

**Token definition (new, additive to the `CLOSURE_*` family; compose — do **not** replace existing codes):**

```
CLOSURE_PERMISSION_FLIP_PATHS_DENIED
  condition:    a spawnable closure role (curator) is NOT authorized to write
                one or more of the closure-owned DONE-flip paths on this host
  spawnable_closure_role:   curator          (qe unspawnable on OpenCode — do not emit)
  denied_flip_paths:        docs/product/backlog.md, docs/product/acceptance.md,
                            sprints/S*/closure-verification.md (the subset missing)
  already_authorized:       docs/engineering/state.md (checkpoint — no flip delta)
  remediation:              grant the missing flip paths to curator in BOTH
                            .opencode/agents/curator.md and
                            template/.opencode/agents/curator.md (active↔template
                            parity, DEC-0152 L40-43 additive / last-matching-wins);
                            re-run /closure. Do NOT operator hand-flip.
```

**Surfaces to extend** (execute-phase; all **additive** — do **not** rewrite or rename any existing code):

| Surface | Additive location | Additive change |
|---|---|---|
| `.cursor/commands/closure.md` (rich Closure surface) | `## Fail-safe reason codes and remediation guidance` table (L161-171) | Append one new row: `CLOSURE_PERMISSION_FLIP_PATHS_DENIED` / condition: spawnable closure role (curator) lacks the flip-path allows on a deny-by-default host / remediation: grant the 3 flip paths to curator in active + template; re-run `/closure`; do NOT operator hand-flip. |
| `.cursor/commands/closure.md` (rich) | `## Stop conditions` bullet list (L56-74) | Append one new bullet: `Permission matrix denies a closure-owned flip path → CLOSURE_PERMISSION_FLIP_PATHS_DENIED`. |
| `template/.cursor/commands/closure.md` (rich — byte-parity twin) | same two locations | Byte-identical mirror of the two additions above (US-0017 parity). |
| `docs/engineering/runbook.md` | § Closure troubleshooting table (L4349-4357) | Append one new row: `CLOSURE_PERMISSION_FLIP_PATHS_DENIED` / curator not authorized on the 3 flip paths / grant to curator in active + template; re-run `/closure`. |
| `docs/engineering/reason_codes.md` | Reason-codes index (compose-additive) | Register `CLOSURE_PERMISSION_FLIP_PATHS_DENIED` (no `CLOSURE_*` code is registered here today; the family is owned by `.cursor/commands/closure.md`) — additive row only. |
| `.opencode/commands/closure.md` (thin 20-line OpenCode dispatch pack) + `template/.opencode/commands/closure.md` | — | **DO NOT touch** — distinct surface with no `CLOSURE_*` vocabulary; out of BUG-0031 scope (the fix is the **role/permission** repair + the **rich-surface** diagnostic contract, not the OpenCode dispatch pack). |

**Residual risk**: new `CLOSURE_*` family member; compose with the existing seven codes (`CLOSURE_RELEASE_EVIDENCE_MISSING`, `CLOSURE_VERIFICATION_FAILED`, `CANONICAL_STATUS_CONFLICT`, `BACKLOG_STATUS_DRIFT`, `PHASE_OWNERSHIP_VIOLATION`, `PHASE_OVERRIDE_EVIDENCE_MISSING`, `CLOSURE_LEGACY_DRIFT`) — do **not** replace or rename any of them. The orchestrator post-closure verification (`.cursor/commands/closure.md` L104-113) **must not** silently hand-flip when the flip writes are denied — it must surface `CLOSURE_PERMISSION_FLIP_PATHS_DENIED`.

### 3. OpenCode-surface parity note (DQ6 / A2) (LOCKED)

Placement: **rich Closure-surface pair only** (`.cursor/commands/closure.md` + `template/.cursor/commands/closure.md`), immediately after the existing `override` bullet at L10, before `## Phase responsibility`. Additive prose — least-disruptive, host-agnostic recording addition (R-0155 DQ6 placement L15962-15963). **Do not** add to `.opencode/commands/closure.md` (thin pack, no host-agnostic prose structure), do **not** add to `.cursor/agents/*.mdc` (role maps are a separate surface — see Guards G7).

**Recommended exact wording** (adopt R-0155 DQ6 L15961 verbatim; it composes with the existing L9-L11 host-agnostic phrasing):

> **OpenCode-surface parity note (BUG-0031 / R-0155)**: On an OpenCode host the default `qe` closure subagent is **not spawnable** (no `qe` subagent type). Resolve `/closure` to the sanctioned alternate **`curator`** (via `AUTO_ROLE_CLOSURE=curator`; DEC-0052 §2/§3). The spawning role must be **authorized to write** the three closure-owned flip paths it does **not** already hold — `docs/product/backlog.md` (status+AC), `docs/product/acceptance.md` (row), and `sprints/S*/closure-verification.md` (create). `docs/engineering/state.md` is already curator-held. If a spawnable closure role lacks these, `/closure` fails closed with **`CLOSURE_PERMISSION_FLIP_PATHS_DENIED`** (DQ8) — **never** an operator hand-flip.

### 4. `test_bug0031_*` additive suite (DQ9) — 8 markers (LOCKED)

File: `tests/bug0031_opencode_closure_flip_authz_test.py` (active) + `template/tests/bug0031_opencode_closure_flip_authz_test.py` (byte-parity twin — mirrors `test_bug0027_active_template_parity` pattern at L182-222). All markers **currently fail** against the pre-fix tree (the curator `edit:` set lacks the 3 new allow rows). Mock-injection style, **no live OpenCode probe** (`UAT_PROBE_FORBIDDEN`). Compose (do **not** modify) `test_bug0027_*` and `test_bug0016*`.

| # | Marker | Asserts (one line) | Covers |
|---|--------|--------------------|--------|
| 1 | `test_bug0031_curator_flip_paths_present_active` | active curator `edit:` allow set contains **all four** flip paths (3 new + `docs/engineering/state.md`) AND `"**": deny` precedes all allows (deny-first) AND `bash: ask` / `task: deny` unchanged | DQ2, DQ3, DQ5 |
| 2 | `test_bug0031_curator_flip_paths_present_template` | same asserts on `template/.opencode/agents/curator.md` | DQ2, DQ3, DQ5 |
| 3 | `test_bug0031_curator_active_template_byte_parity` | `active.read_bytes() == template.read_bytes()` (US-0017 parity; the same 3 rows in both) | DQ2, DQ7 (parity) |
| 4 | `test_bug0031_qa_flip_paths_denied` | **qa** active + template: **none** of the 3 flip paths is in qa's allow set (least-privilege; DQ7 **NO** qa fallback) | DQ7 (qa rejection) |
| 5 | `test_bug0031_deny_before_allow_index` | across **both** curator files: `"**": deny` index **<** each of the 3 new allow indexes (last-matching-wins, DEC-0152 L40-43), mirroring `test_bug0027_permission_matrix_phase_writes` L225-251 | DQ3 (additive-append) |
| 6 | `test_bug0031_sprint_wildcard_shape` | asserts the wildcard literal `"sprints/S*/closure-verification.md"` exactly; no specific-sprint literal (no `sprints/S0163/...` or `sprints/S0[0-9]+/closure-verification.md`) in the flip allow set | DQ5 (wildcard) |
| 7 | `test_bug0031_fail_closed_diagnostic_token_present` | mock-injection: `CLOSURE_PERMISSION_FLIP_PATHS_DENIED` is **additively present** in `.cursor/commands/closure.md` reason-code table AND Stop conditions AND `template/.cursor/commands/closure.md` byte-parity AND `runbook.md` troubleshooting table + `reason_codes.md`; names exactly the 3 denied paths + the spawnable role `curator` + remediation; **composes** with (does not replace) the existing 7 `CLOSURE_*` tokens | DQ8 (A1) |
| 8 | `test_bug0031_no_sibling_mutation` | `test_bug0027_*` (10 markers) + `test_bug0016*` compose suites still pass unmodified; BUG-0016 / BUG-0022 / BUG-0027 / US-0156 / US-0045 / US-0120 / US-0122 / BUG-0028 / BUG-0029 rows/statuses/ACs not mutated; US-0156 AC-7 remains **not** ticked; `.cursor/agents/curator.mdc` + `template/.cursor/agents/curator.mdc` (distinct host surface with **no `permission:` block**) byte-identical and **untouched** by this change | DQ10 + DQ7 guard + G7 guard |

**Compose contract**: markers 1, 2, 3, 5, 6, 8 are **pure** read/parse of the agent frontmatter (no host probe). Marker 4 is a **negative** read-only assertion (qa must NOT have the 3 paths). Marker 7 is the only `.cursor/commands/closure.md` / `runbook.md` / `reason_codes.md` surface assert (mock-injection style — no live OpenCode invocation). `test_bug0027_*` (10 markers) and `test_bug0016*` (8 markers) **must continue to pass unmodified** — they cover dev/qa (BUG-0027) and the BUG-0016 general baseline respectively; `test_bug0031_*` covers the **curator** flip authorizations **additively** (composes, does not replace).

## Touch surfaces (active ↔ template byte-parity)

| Surface | Change (execute-phase) |
|---|---|
| `.opencode/agents/curator.md` (active) | Append exactly three `allow` rows after `handoffs/archive/**`, before `bash: ask`; `"**": deny` + `bash: ask` / `task: deny` unchanged in content and order. |
| `template/.opencode/agents/curator.md` | Byte-parity mirror of the three-row append (US-0017); asserted by `test_bug0031_curator_active_template_byte_parity`. |
| `.cursor/commands/closure.md` (rich Closure surface) | Additive `CLOSURE_PERMISSION_FLIP_PATHS_DENIED` row (`## Fail-safe reason codes` table L161-171) + Stop-conditions bullet (L56-74); additive OpenCode-parity note after L10. Do **not** rewrite the existing 7 `CLOSURE_*` codes or the `qe\|curator` role set (L9/L28/L120). |
| `template/.cursor/commands/closure.md` | Byte-parity mirror of the two `.cursor/commands/closure.md` additions (both files are currently byte-identical, SHA-256 `F7DBA6F1085E0AA0C6ED48E662F83ECEE0BDE51ECB619027F08816EAC3CD6CD4`). |
| `docs/engineering/runbook.md` | Additive row in § Closure troubleshooting table (L4349-4357). |
| `docs/engineering/reason_codes.md` | Additive `CLOSURE_PERMISSION_FLIP_PATHS_DENIED` registration (family not present today). |
| `tests/bug0031_opencode_closure_flip_authz_test.py` | New file (active), 8 `test_bug0031_*` markers (mock-injection, no live probe). |
| `template/tests/bug0031_opencode_closure_flip_authz_test.py` | Byte-parity mirror (asserted). |
| `.opencode/commands/closure.md` + `template/.opencode/commands/closure.md` (thin OpenCode dispatch pack) | **DO NOT touch** — distinct surface, no `CLOSURE_*` vocabulary, out of scope. |
| `.cursor/agents/curator.mdc` + `template/.cursor/agents/curator.mdc` | **DO NOT touch** — distinct Cursor role surface with **no `permission:` frontmatter block** (only `description` + `model: fast`); the BUG-0031 gap is specifically the **OpenCode deny-by-default role map**, not the `.mdc` role map (BUG-0022 keeps `curator.mdc` `model: fast` untouched by the same reasoning). |
| `docs/product/backlog.md` `### BUG-0031` / `docs/product/acceptance.md` L222 | **DO NOT flip** status / tick AC this phase (US-0045 + closure own; BUG-0031 remains **OPEN**, ACs unchecked). |

## Task seeds (≤ `SPRINT_MAX_TASKS=12`)

| Task | Contract |
|------|----------|
| `T-anch` | Read-only verify: `# BUG-0031` A1 + R-0155 DQ1–DQ10 + **no companion DEC** (R-0155 L16032) + curator/qa role files (active + template) + 4 `closure.md` copies (rich pair + thin OpenCode pair) + DEC-0051/0152/0052 + `test_bug0027_*`/`test_bug0016*` patterns + US-0156 AC-7 & BUG-0022 remain un-ticked + `.cursor/agents/curator.mdc` has **no `permission:` block**. Anchors only; no mutation. |
| `T-001` | Apply the 3-allow delta to `.opencode/agents/curator.md` (active) — exact before→after above; append-only; do **not** reorder the broad deny. |
| `T-002` | Apply the same 3-allow delta to `template/.opencode/agents/curator.md` + assert active↔template byte-parity (US-0017). |
| `T-003` | Add `CLOSURE_PERMISSION_FLIP_PATHS_DENIED` (additive) to `.cursor/commands/closure.md` (reason-code table + Stop-conditions bullet) + `template/.cursor/commands/closure.md` (byte-parity) + `runbook.md` troubleshooting row + `reason_codes.md` registration; compose with the existing 7 `CLOSURE_*` codes. |
| `T-004` | Apply the DQ6 OpenCode-surface parity note (additive prose) to `.cursor/commands/closure.md` after L10 + `template/.cursor/commands/closure.md` (byte-parity); adopt R-0155 L15961 wording verbatim. |
| `T-005` | Author `tests/bug0031_opencode_closure_flip_authz_test.py` (active), 8 `test_bug0031_*` markers per the DQ9 table; mock-injection style; do **not** modify `test_bug0027_*` / `test_bug0016*`. |
| `T-006` | Author `template/tests/bug0031_opencode_closure_flip_authz_test.py` (byte-parity mirror) incl. `test_bug0031_curator_active_template_byte_parity`. |
| `T-007` | Run the full relevant suite and green it: `test_bug0031_*` (active + template), `test_bug0027_*` regression (compose, unmodified), `test_bug0016*` regression, `python scripts/bug_issue_validate.py --backlog docs/product/backlog.md --check-acceptance` (exit 0), and the curator/qa role-file active↔template byte-parity check; confirm **zero** sibling mutation. |

Eight seeds (`T-anch` + `T-001..T-007`) — within the 12 cap; **`/sprint-plan`** owns **S0164** creation. `ultra_lean`: plan-verify is a deferred/skipped placeholder — not a QA spawn; do not claim QA PASS from planning.

## AC coverage mapping (bug acceptance + R-0155)

Source of the 5 ACs: `docs/product/acceptance.md` L222 "(5 ACs)" + the discovery DoD candidate (`docs/product/vision.md` `## Discovery Notes — BUG-0031` L2885-2891) + intake `required_tests` (JSON L49); the backlog `### BUG-0031` block (L5661-5671) frames them via `expected` / `actual` (the AC enumeration is deferred to this architecture + `/sprint-plan`; not mutated here).

| AC | Canonical statement | Seeds / tests that cover it |
|----|---------------------|-----------------------------|
| AC-1 | A spawnable authorized closure role (`curator`) performs the four canonical DONE-flip writes (`backlog.md` status+AC, `acceptance.md` row, `closure-verification.md` create, `state.md` checkpoint) **per phase**, without `CLOSURE_BLOCKED_PERMISSION_MATRIX` and without operator hand-flip. | T-001, T-002; markers 1, 2, 3 |
| AC-2 | `python scripts/bug_issue_validate.py --backlog docs/product/backlog.md --check-acceptance` exits **0** on the fixed state (the 3-allow delta composes with the validator; `validate_closure_verification.py` still passes on the curator-authored artifact). | T-007 (runs both validators); T-anch (composes validator surface); marker 8 (compose, no rewrite) |
| AC-3 | `template/.opencode/agents/curator.md` and `.opencode/agents/curator.md` are **byte-identical** parity (US-0017), each now carrying the three additive `allow` rows. | T-002; marker 3 (`curator_active_template_byte_parity`) |
| AC-4 | **Sibling integrity**: BUG-0016 baseline **not** mutated; DEC-0152 deny-by-default ordering **not** weakened; **`qa` NOT** granted the 3 paths; US-0156 AC-7 **not** mutated; no sibling bug (BUG-0019/0020/0021/0022/0023/0024/0025/0026/0027/0028/0029/0030) drained or reopened. | T-anch, T-005 (marker 4), T-007 (regression suites); marker 4 (`qa_flip_paths_denied`), marker 8 (`no_sibling_mutation`) |
| AC-5 | `test_bug0031_*` contract suite **passes**; `test_bug0027_*` (10) + `test_bug0016*` (8) **continue to pass** (compose, not replace). | T-005, T-006, T-007; markers 1-8 (marker 8 asserts the compose suites stay green) |

Cross-cutting standing guard (DoD #6, embedded in Guards G9, not a numbered AC): no npm publish, no git push, no `.env` reads.

Acceptance checkbox: `docs/product/acceptance.md` BUG-0031 row (L222) remains **unchecked** until closure (US-0045). Status stays **OPEN**.

## Guards (execute-phase — mirror sibling guard style)

| # | Guard |
|---|-------|
| G1 | Do **not** reorder / move / widen the `"**": deny` line or any existing `edit:` allow row (DENY-FIRST, DEC-0152 L40-43 last-matching-wins — compose, do not rewrite). |
| G2 | Do **not** touch the `bash: ask` / `task: deny` lines; do **not** add a 4th flip-path `allow` (over-broad); `state.md` already held (DQ4 — no redundant allow). |
| G3 | Do **not** grant `qa` the 3 flip-path allows (DQ7 — `qa` is not in the `qe\|curator` closed closure set per DEC-0051 L41 / DEC-0052 §4); a 3rd alternate is a DEC-0051/0052 amendment, out of scope. Negative-asserted by marker 4. |
| G4 | Do **not** create a `qe` spawnable type (no `.opencode/agents/qe.md`, no `.cursor/agents/qe.mdc`) — scope invention, not the fix; do **not** hardcode a specific-sprint literal in place of the `S*` wildcard (DQ5 / US-0017 drift). |
| G5 | Do **not** reopen / mutate / drain any DQ10 sibling — BUG-0016, BUG-0022 (unblocked, not performed), BUG-0027, BUG-0023/0024/0025/0026/0028/0029/0030, US-0045, US-0120, US-0122, US-0047/0048/0049, US-0124/0125/0126, US-0148/0150/0151/0152/0153/0154, **US-0156 AC-7 (not ticked, not released)**. |
| G6 | Do **not** flip BUG-0031 status / tick its acceptance row / perform the S0163/BUG-0022 flip this phase (US-0045 + closure own; this bug **unblocks**, does **not** perform). This architecture phase itself must not flip it either. |
| G7 | Do **not** touch `.cursor/agents/*.mdc` (incl. `curator.mdc`) — distinct Cursor role surface with **no `permission:` block**; the BUG-0031 fix is the **OpenCode** `.opencode/agents/curator.md` deny-by-default map, not the `.mdc` role map. Do **not** touch the thin OpenCode dispatch pack `.opencode/commands/closure.md` + `template/.opencode/commands/closure.md` (distinct surface, no `CLOSURE_*` vocabulary). |
| G8 | Do **not** rewrite or rename any existing `CLOSURE_*` token (L161-171 family) — the new token is **additive** only; composes with the existing seven codes. |
| G9 | No npm publish, no git push, no `.env` reads, no `/auto` recursion (BUG-0006 spawn-only — orchestrator owns the next spawn). |
| G10 | Do **not** author a companion DEC (R-0155 L16032 "none"; next-free id would be **DEC-0153** but is **not** allocated); do **not** create `sprints/S0164/` this phase (that is `/sprint-plan`'s job); do **not** spawn `/sprint-plan` or `/execute` from this subagent. |

## Non-goals

- Do not merge/drain/reopen BUG-0016 / 0022 / 0023 / 0024 / 0025 / 0026 / 0027 / 0028 / 0029 / 0030 (AC-4, DQ10).
- Do not tick US-0156 AC-7 or release US-0156 (that is US-0156's own verify-work/closure); do not perform the S0163/BUG-0022 flip (BUG-0022's own post-fix closure — this bug only unblocks it).
- Do not grant `qa` the flip paths; do not create a `qe` spawnable type; do not widen the broad deny or grant a 4th path.
- Do not rewrite DEC-0152 / DEC-0051 / DEC-0052 (compose-only); do not author a companion DEC.
- Do not touch `.cursor/agents/*.mdc` or the thin `.opencode/commands/closure.md` dispatch pack; do not modify `test_bug0027_*` / `test_bug0016*` / BUG-0022 / BUG-0030 suites.
- Do not create `sprints/S0164/` this phase; no npm publish / git push / `.env` reads.

## Decision linkage

- **Companion DEC**: **none** (R-0155 L16032: "Companion DEC: **none** from research" — the 3-allow delta is a **permission-map row** for an already-sanctioned closure role, not a contract change; matches the BUG-0019/0020/0021/0022/0023/0024/0025/0027/0030 "companion DEC: none" siblings). Next-free id **DEC-0153** verified against `decisions/` (highest existing **DEC-0152**) — **not** allocated.
- **Compose (do not amend bodies)**: **DEC-0051** (phase→role; `qe|curator` closure set L41; `AUTO_ROLE_CLOSURE` §2 L53; preflight §3 L70-72), **DEC-0052** (phase plan + `AUTO_ROLE_CLOSURE` §4 L87-89), **DEC-0152** (deny-by-default broad-deny-before-path-allow, §Consequences L40-43), **BUG-0016** (DONE permission baseline — additive-only under its own guard).
- **Research**: **R-0155** (this bug; DQ1–DQ10 LOCKED; `decision_gate=false`). Compose **R-0154** (BUG-0022) / **R-0153** (US-0156) — do **not** wipe.
- **Related (compose/link, do not mutate)**: **US-0045** (canonical status owner), **US-0120** (`AUTO_ROLE_CLOSURE` contract), **US-0122**, **US-0047/0048/0049**, **US-0124/0125/0126**; **BUG-0022** (DoD consumer — unblocked, not performed), **US-0156** (AC-7 gate — not ticked); **BUG-0027** (done — persistence, distinct mechanism); **BUG-0030** (dispatch class — distinct).

## Isolation evidence (US-0048 / DEC-0029)

- `phase_id=architecture`, `role=tech-lead`, `bug_id=BUG-0031`, `sprint_id=none` (S0164 expected at sprint-plan)
- `delivery_mode=ultra_lean`, `macro_phase=plan`, `model_id=inherit` (CROSS_MODEL_REVIEW=0)
- `fresh_context_marker=tl-BUG0031-architecture-20261001T150000Z-fresh`, `timestamp=2026-10-01T15:00:00Z` (UTC)
- `evidence_ref=docs/engineering/research.md ## R-0155; docs/product/backlog.md ### BUG-0031; docs/product/acceptance.md L222; docs/engineering/architecture.md (this # BUG-0031); .opencode/agents/curator.md; template/.opencode/agents/curator.md; .opencode/agents/qa.md; .cursor/commands/closure.md; template/.cursor/commands/closure.md; .cursor/agents/curator.mdc; decisions/DEC-0051.md; decisions/DEC-0152.md; handoffs/po_to_tl.md`
- Fresh tech-lead subagent per BUG-0006; narrow-read only (read artifacts + role/command files read-only; **no shell execution of production changes**, **no subagent spawn** — verification greps/reads only). No `.env`. No companion DEC. No `sprints/S0164/`. No Status/AC mutation. No `/sprint-plan` spawn. No npm-publish. No git push. No sovereign-critic (CROSS_MODEL_REVIEW=0). No DQ10-sibling reopen. `.cursor/agents/curator.mdc` untouched. Thin OpenCode `closure.md` pack untouched. `test_bug0027_*` / `test_bug0016*` untouched.

## Strict runtime proof

- **No strict runtime proof issued this phase** — `decision_gate=false` (`EARLY_RESEARCH`-style architecture on a research-locked bug; the D9 runtime proof is the mock-injection / permission-map proof emitted at execute/verify-work, per R-0155 L15889 research persistence note and the BUG-0022 sibling's "No runtime proof issued" line L3089-3090). This phase persists the architecture H1 + companion-DEC verdict **only**.

## Next

**`/sprint-plan`** in a fresh tech-lead context (owner of **S0164** — next-free verified against `sprints/` live inventory: S0001..S0092, S0103..S0163 present, **S0164 free**). STOP after architecture handoff; orchestrator MUST spawn `/sprint-plan` in a fresh tech-lead — **do not** implement from this phase (BUG-0006); **do not** spawn `/execute` from `/sprint-plan`; **do not** create `sprints/S0164/` from this architecture subagent.

# BUG-0035 — Phase-child-owned paired continuation repair

## Decision and boundary

**Verdict: `ARCHITECTURE_PASS`; `decision_gate=false`.** R-0157 A1 is accepted
and is binding through **DEC-0153**. BUG-0035 stays **OPEN P0** and all seven
ACs remain unchecked. This section is additive; BUG-0005, BUG-0034, DEC-0069,
DEC-0038, and DEC-0152 are composed, not rewritten.

The repair is a minimum-authority writer correction. The completed canonical
phase child writes its own pair; the spawn-only parent never writes either
artifact and never treats child completion as authority to advance. For the
research→architecture boundary, the tech-lead child writes the state checkpoint
first and then the resume latest-pointer block only after exact pair validation.

## Locked permission and parity contract

The **only** permission delta is this exact row, in both active and template
tech-lead maps, after the existing broad deny and alongside existing owned paths:

```yaml
"handoffs/resume_brief.md": allow
```

No wildcard (`handoffs/**`, `*.md`, or role-wide) grant is permitted. The maps
must remain byte-identical. `.opencode/agents/auto.md` and its template twin
remain `edit: deny`; no other role map changes. Do not alter `bash`, `task`,
config/scratchpad, `.env`, command registration, JSON templates, TUI/RPC, or
localhost surfaces.

## Canonical pair and ordering

The record key is exactly:

```
orchestrator_run_id|work_item_kind|bug_id|completed_phase|runtime_proof_id
```

Both state and brief must carry canonically identical `writer_role`, resolution
source, effective plan, skipped and completed phases, next phase and role,
cursor, budget, stop reason, fresh marker, and strict-proof tuple
(`runtime_proof_id`, hash, issued-at, TTL, phase, role). The writer validates
the complete tuple before the brief write. The brief write itself is atomic
(temporary file plus replace/prepend); cross-file atomicity is deliberately not
claimed. State without a lawful matching brief is an incomplete pair and cannot
continue.

For this architecture child's continuation record, the locked values are:

| Field | Value |
|---|---|
| resolution source | `explicit start-from` |
| work item | `bug / BUG-0035` |
| effective plan | `[spec, plan, build+verify, ship]` |
| skipped / completed | `[discovery]` / `[intake,research,architecture]` |
| next | `sprint-plan / tech-lead` |
| cursor / budget | `plan/2-of-3` / `explicit BUG-0035 only; AUTO_BUG_QUEUE=0; no backlog drain; no sprint budget consumed` |
| stop reason | `architecture_complete_phase_boundary` |

The future implementation generalizes the same pair discipline to the
child-owned boundary; it must not backfill or fabricate this session's stale
resume brief.

## Validation, idempotence, and failure semantics

Exact same-key and canonical-field-equivalent replay is the sole no-op. A
changed field under the same key, duplicate proof ID, reused fresh marker or
child session, different next phase/role, invalid proof, missing side, conflict,
or permission-mismatched writer is a hard stop. Use
`RESUME_BRIEF_UNPARSEABLE` only for syntax; use `RESUME_BRIEF_STALE` for stale,
absent-required, conflicting, unauthorized, replay, or proof/isolation-invalid
continuation evidence while retaining the failed predicate. There is no state
fallback, parent repair, next spawn, reconciler, silent recovery, or
`RESUME_BRIEF_AUTO_REFRESH=0` bypass.

## Implementation and verification surfaces

| Surface | Required delivery boundary |
|---|---|
| Tech-lead permission maps, active + template | The one exact allow above; deny-first ordering and byte parity preserved. |
| Continuation writer/validator | State-first pair construction, atomic brief update, exact key/tuple comparison, authorization/proof/marker checks, and deterministic hard stops. |
| Existing command/reference pairs | Update only the existing paired continuation instructions in OpenCode/Cursor research, architecture, and auto command surfaces plus auto-orchestration reference; do not create a JSON command template. |
| Runbook, active + template | State the expected key and failed predicate; preserve evidence; never hand-edit, auto-refresh, fall back to state, or spawn; acquire a fresh authorized child and independently re-resolve. |
| Contract tests | Seven `test_bug0035_*` groups from R-0157: lawful pair; parent deny; fresh marker/proof; missing/malformed stop; tuple conflict; unauthorized/replay/idempotence; parity/runbook. Fixtures/mocks only; no live-host claim. |

The test suite must reuse US-0156 resolver/idempotence guards without changing
their semantics and retain BUG-0005/BUG-0034 as compose-only regressions.

## Rejected alternatives and non-goals

- Parent writes the brief; state-only fallback; accepting stale evidence.
- Broad handoff/all-role grants, a bridge writer, an autonomous reconciler, or
  `RESUME_BRIEF_AUTO_REFRESH=0` override.
- Status/acceptance/backlog mutation; sprint artifacts; implementation in this
  phase; TUI/RPC/JSON/localhost/config/scratchpad changes; `.env` read,
  publishing, pushing, `/auto`, or subagent spawn.

## Decision linkage and isolation evidence

- **Companion DEC required and authored**: **DEC-0153**. This is required
  because it changes the normative cross-phase writer/permission/continuation
  contract; it narrows, rather than weakens, DEC-0069's writer boundary.
- **Research**: R-0157. **Compose**: DEC-0069, DEC-0038, DEC-0152, US-0048,
  US-0156; BUG-0005 and BUG-0034 remain unchanged.
- `phase_id=architecture`; `role=tech-lead`; `bug_id=BUG-0035`; `sprint_id=none`;
  `orchestrator_run_id=auto-20261003-bug0035-architecture`;
  `fresh_context_marker=tl-BUG0035-architecture-20261003T224116Z-fresh`.
- Parent resolution was read-only: explicit `start-from=architecture` wins over
  the stale brief; explicit `bug-target=BUG-0035` wins over
  `AUTO_BACKLOG_DRAIN=1`; AUTO_PHASE selectors are unset and
  `AUTO_BUG_QUEUE=0`. No scheduler conflict, backlog drain, `/auto`, or child
  spawn occurred.

## Strict runtime proof and Stop-Matrix

- `runtime_proof_id=rp-auto-20261003-bug0035-architecture-techlead-20261003T224116Z-BUG-0035`
- Canonical payload: `{"orchestrator_run_id":"auto-20261003-bug0035-architecture","phase_id":"architecture","proof_issued_at":"2026-10-03T22:41:16Z","proof_ttl_seconds":3600,"role":"tech-lead","runtime_proof_id":"rp-auto-20261003-bug0035-architecture-techlead-20261003T224116Z-BUG-0035"}`
- `proof_hash=A8BA0F2C6D8C2E75AABB865AA20ECC774BBDE378404E41069B3F083A227843E2`; `proof_ttl=2026-10-03T23:41:16Z`; independently recomputed MATCH.
- **Stop-Matrix action**: `STOP_AFTER_ARCHITECTURE_PASS`. The parent must
  independently re-resolve the paired record and Stop-Matrix. Completion does
  not authorize advancement; only a valid explicit continuation may schedule a
  fresh `/sprint-plan` tech-lead child. This architecture child does not spawn it.

# BUG-0032 — AUTONOMY_FLAGS_DRIFT drift-detect + live-wins sync contract

**Research anchor**: **`R-0156`** (DQ1–DQ3 LOCKED; **consume, do not re-decide**). **Companion DEC**: **none** (R-0156 verdict L16032-class: "No companion DEC recommended") — the token / remediation are additive *documentation* + a *checker scope*, not a contract change; next-free id **DEC-0154** is **not** allocated. **Expected sprint**: **S0166** (S0127..S0165 all terminal per `sprints/*/closure-verification.md`; **S0166 free** — do **not** create this phase; `/sprint-plan` owns). **delivery_mode**: **`ultra_lean`** (plan-verify deferred/skipped; do **not** claim QA PASS from planning). **Verdict**: **`ARCHITECTURE_PASS`**; **`decision_gate=false`**.

**Producer**: `tech-lead`, `/architecture`, `bug-target=BUG-0032`, fresh subagent (BUG-0006). **Timestamp**: 2026-10-04T13:00:00Z (UTC). **Fresh marker**: `tl-BUG0032-architecture-20261004T130000Z-fresh` (grep-confirmed **0** prior occurrences in `docs/`, `handoffs/`, `sprints/`, `decisions/`, `tests/` before mint; **distinct** from the prior research marker `tl-BUG0032-research-20261003T160000Z-fresh` — not reused).

## Problem and scope (defect class)

A **declared-mirror drift** on exactly two autonomy keys: `.its-magic/config.json` declares `AUTONOMY_PRESET: full` (L318) + `AUTONOMY_STOP_POLICY: auto_repair_then_block` (L320) under the header claim "Values mirrored from .cursor/scratchpad.md" (L3), while `.cursor/scratchpad.md` declares `AUTONOMY_PRESET=none` (L639) + `AUTONOMY_STOP_POLICY=block` (L640). Both keys are live-divergent and no drift-detect contract exists (`check_intake_template_parity.py --scope=autonomy-flags` is absent). R-0156 F (L16044): "a two-key declared-mirror defect, **not** active↔template byte parity and **not** a US-0119 preset-expansion change." Distinct from **BUG-0034** (stop-matrix token registration — a **sibling addition**, not this bug's surface), **US-0119** (shipped autonomy-preset feature — compose, no reopen), and **US-0017** (byte-parity drift guard — the *pattern* precedented here; this is a **semantic** drift-detect, not a **byte-pair** SCOPES entry). Compose **US-0131 / DEC-0131** (cross-host config baseline / resolver this bug relies on), **US-0048 / BUG-0006** (spawn-only isolation), and honor the closure-role authorization BUG-0031 repaired (DENY-FIRST ordering, DEC-0152) when this bug's closure flips.

## Locked architecture (A1 semantic declared-mirror drift gate — from R-0156 DQ1–DQ3)

### 1. `--scope=autonomy-flags` semantic scope in `check_intake_template_parity.py` (DQ1 / T-001)

A **dedicated semantic** drift-detect scope, **not** a byte-pair `SCOPES` entry (R-0156 DQ1 L16048 explicitly "not a byte-pair `SCOPES` entry"). Fixed key order **`AUTONOMY_PRESET`** then **`AUTONOMY_STOP_POLICY`**; reads JSONC `config.json shared.<key>` and exact scratchpad `KEY=VALUE` assignments. **Both keys present exactly once and equal → exit 0** + the **exact** banner `[INTAKE_TEMPLATE_PARITY_OK] scope=autonomy-flags` (DQ1 L16049 — this *is* the AC-2 "exit 0 + reason-code-free banner" case). **Value mismatch, missing key, duplicate assignment, or unreadable/unparseable required input → exit 1**, one fixed-order line per affected key: `[AUTONOMY_FLAGS_DRIFT] scope=autonomy-flags key=<KEY> config=<value-or-<missing>> scratchpad=<value-or-<missing>>`, and **no success banner** (DQ1 L16050). Unevaluable input is treated as drift so CI fails closed. Existing scopes' return semantics are preserved; `--repo` redirects **both** inputs for fixtures; `--scope=all` invokes this semantic scope **after** the byte-pair checks and therefore **intentionally fails until the operator remediates the currently observed drift** (DQ1 L16051). Slots into `main()` before the existing `for rel_active, rel_tpl in pairs` loop (L962) — a short-circuit branch that returns the semantic verdict and skips the byte loop for this scope.

### 2. `AUTONOMY_FLAGS_DRIFT` reason-code token (AC-2 / AC-6 verbatim — T-002)

A new **additive** diagnostic/remediation token in the **US-0126-owned runbook / reason-code documentation surface** (R-0156 DQ2 L16055), **registered in exactly two doc surfaces**: `docs/engineering/reason_codes.md` (additive row, compose — do **not** rewrite the existing index) **and** `docs/engineering/runbook.md` (a remediation entry titled **`AUTONOMY_FLAGS_DRIFT`** explaining the operator-sync step — this is **AC-6 verbatim**). Remediation is **live-wins**: the operator selects the `.cursor/scratchpad.md` values and copies exactly those two values to `.its-magic/config.json shared`, then re-runs the scope (DQ2 L16056). **Sibling reconciliation (recorded, not re-decided — R-0156 DQ2 is the authority)**: this token is a **parity/CI drift-detect diagnostic emitted at `exit 1`**, **not** an `autonomy_resolvable` auto-repair code added to `scripts/data/autonomy_stop_matrix.yaml`. R-0156 DQ2 (L16056–16057) scopes it to documentation and **forbids altering "stop-matrix logic, or `security_hard` rows"**; acceptance **L225** (BUG-0034) reserves the stop-matrix registration for **that sibling** (and R-0156's own evidence note: "BUG-0034's token is a sibling addition"). `--scope=autonomy-flags` **does not** auto-repair (drift-DETECT only; T-005 documents the **operator** live-sync step). The drift is **not** a security-hard gate, so **`security_hard` rows and `auto_repair_kind=n/a` stay untouched**; the 12 per-feature flags and `AUTONOMY_PRESET=none` byte-identity (AC-4) and the intake gates `INTAKE_AUTONOMY_MODE=0` (config L324) / `INTAKE_SUBAGENT_FALLBACK=deny` (config L146) / `INTAKE_SUBAGENT_FALLBACK=deny` (DQ2c) remain **unchanged** (AC-5, DQ2 L16057).

### 3. Live-wins resolver direction (DQ2 L16056 / T-005)

Direction is unambiguous and already locked by R-0156: **live-wins per US-0131 / DEC-0131** — **config.json is the baseline surface (non-cursor hosts); `.cursor/scratchpad.md` is the live surface (cursor hosts); both MUST agree on the two keys**. The operator copies the scratchpad values to config `shared`. The **code contract is the drift-DETECT, not the drift-FIX** — T-005 is **operator action (not a code task)**; it is only **documented in the runbook entry**. This phase **does not mutate** `.its-magic/config.json` or `.cursor/scratchpad.md`.

### 4. CI wiring (DQ3 L16062 / T-003)

Add **mirrored BUG-0032 blocks immediately after US-0131** in **both** `tests/run-tests.ps1` **and** `tests/run-tests.sh`: run the new scope, **assert exit 0** (on an identity fixture), then run `pytest tests/bug0032_autonomy_flags_drift_test.py -q`. Rationale (DQ3 L16062): "**Always-run CI is stronger than changed-file filtering** and catches a PR touching either source" — **NOT changed-file filtered** (AC-3 "invoked by any PR that touches either file").

### 5. Test-surface scope + closure-ownership surface (DQ3 L16063 / closure path)

**8-marker `tests/bug0032_autonomy_flags_drift_test.py`** — **PLANNED**, authored at **sprint-plan / execute (T-004), NOT this phase** (R-0156 DQ3 L16063: "no real source file is edited by tests"; fixtures under `tests/fixtures/bug0032_autonomy_flags/`). The 8 markers (DQ3 L16063 inventory): (1) scope-registration + checker active↔template byte parity; (2) equal-fixture → exit 0 + banner; (3) preset-only drift → exit 1; (4) policy-only drift → exit 1; (5) two-key **deterministic fixed order** (AUTONOMY_PRESET before AUTONOMY_STOP_POLICY); (6) malformed/missing/duplicate → **fail-closed** exit 1; (7) `--repo` fixture isolation / **no source mutation**; (8) **US-0119 `none` + security-hard invariants** (the 12 flags and `n/a`/cap=0 rows unchanged). **Closure-ownership surface** (honor BUG-0031's repaired 3-allow curator flip-path, DEC-0152 DENY-FIRST): BUG-0032's own closure flips `### BUG-0032` `Status: OPEN` → `DONE` + AC-1..AC-7 `[ ]` → `[x]` + `sprints/S0166/closure-verification.md` — **per the post-BUG-0031 curator 3-allow** (backlog / acceptance / closure-verification.md), **not** the pre-BUG-0031 deny-by-default. **This architecture phase performs none of that.**

## Touch surfaces (execute-phase)

| Surface | Change (execute-phase) |
|---|---|
| `scripts/check_intake_template_parity.py` (+ `template/` twin) | Add the `--scope=autonomy-flags` semantic drift-detect handler (T-001); short-circuit in `main()` before the byte loop. Do **not** touch existing scope tables. |
| `template/scripts/check_intake_template_parity.py` | Byte-parity mirror (US-0017); asserted by marker 1's parity assert. |
| `tests/run-tests.ps1` + `tests/run-tests.sh` | Mirrored BUG-0032 block after US-0131: run scope (assert 0) + `pytest tests/bug0032_autonomy_flags_drift_test.py -q` (T-003; always-run). |
| `tests/bug0032_autonomy_flags_drift_test.py` (+ `template/tests/` twin) + `tests/fixtures/bug0032_autonomy_flags/` | New file, **8** `test_bug0032_*` markers (T-004); fixtures only, no real source edit. |
| `docs/engineering/reason_codes.md` + `template/` | Additive `AUTONOMY_FLAGS_DRIFT` row (compose; T-002). |
| `docs/engineering/runbook.md` + `template/` | Additive `AUTONOMY_FLAGS_DRIFT` remediation entry (live-wins operator-sync step = AC-6; T-002). |
| `scripts/data/autonomy_stop_matrix.yaml` | **DO NOT mutate** (BUG-0034 owns stop-matrix registration; R-0156 DQ2 forbids stop-matrix changes here; security-hard + `n/a` rows untouched). |
| `.its-magic/config.json` / `.cursor/scratchpad.md` | **DO NOT mutate** (operator live-sync only, T-005; drift-DETECT only). |
| `docs/product/backlog.md` `### BUG-0032` / `docs/product/acceptance.md` L223 | **DO NOT flip / tick** this phase (US-0045 + closure own; stays **OPEN**, ACs `[ ]`). |

## Task seeds (≤ `SPRINT_MAX_TASKS=12`) — 8 seeds (`T-anch` + `T-001..T-007`), `/sprint-plan` owns S0166

| Task | Contract |
|------|----------|
| `T-anch` | Read-only verify: `# BUG-0032` A1 + R-0156 DQ1–DQ3 (LOCKED) + **no companion DEC** + config/scratchpad drift evidence (L318/L320 vs L639/L640) + security-gate invariants (config L145-L146, L323-L324) + `check_intake_template_parity.py` scope-handler shape + US-0119/US-0131 regression baseline (10/10) + acceptance L223 unchecked + siblings HOLD. Anchors only; no mutation. |
| `T-001` | Author `scripts/check_intake_template_parity.py --scope=autonomy-flags` semantic handler (drift-detect; exit 0 on identity + exact banner; exit 1 + fixed-order `[AUTONOMY_FLAGS_DRIFT]` line(s) on divergence; `--repo` fixtures; `--scope=all` adds it after byte checks) + `template/` twin (byte-parity). |
| `T-002` | Register `AUTONOMY_FLAGS_DRIFT` in **`docs/engineering/reason_codes.md`** (compose-additive, US-0119 cross-ref + repair name) + **`docs/engineering/runbook.md`** remediation entry (live-wins operator-sync step = AC-6) + `template/` twins. **Not** the stop-matrix (BUG-0034 owns). |
| `T-003` | Wire `--scope=autonomy-flags` into `tests/run-tests.ps1` + `tests/run-tests.sh` (after US-0131; always-run; assert 0 then run the 8-marker suite; fail-closed). |
| `T-004` | Author `tests/bug0032_autonomy_flags_drift_test.py` (+ `template/` twin) with the **8** `test_bug0032_*` markers per the DQ3 inventory + `tests/fixtures/bug0032_autonomy_flags/`; fixtures only; US-0119 `none` + security-hard invariants held; no real source edit by tests. |
| `T-005` | **Operator step (not a code task)**: live-sync remediation documented in the runbook (copy scratchpad → config); the code is drift-DETECT only. Record as the operator action in the runbook entry + closure evidence path. |
| `T-006` | Compose / non-regression guard: US-0119 `AUTONOMY_PRESET=none` byte-identical + **12 per-feature flags not re-touched** + `INTAKE_AUTONOMY_MODE=0` / `INTAKE_SUBAGENT_FALLBACK=deny` unchanged + security-hard rows `n/a`/cap=0 unchanged + `pytest tests/us0119_autonomy_preset_test.py` regressions (2 pre-existing matrix-ref failures **not weakened, not repaired**) + `pytest tests/us0131_contract_test.py` 10/10 + `bug_issue_validate.py --check-acceptance` exit 0 **pre + post**. |
| `T-007` | QA / verify-work / release handoffs (downstream phase work; `/sprint-plan` assigns fresh-role spawns; plan-verify deferred for ultra_lean). |

Eight seeds — within the 12 cap. **`/sprint-plan` (fresh tech-lead) owns S0166 materialization + the `T-anch..T-007` sprint.md / tasks.md.**

## Sibling boundary (UNTOUCHED this architecture)

- **Bugs**: BUG-0033 **OPEN** NOT drained; BUG-0034 **OPEN** NOT drained (owns the stop-matrix registration); BUG-0031 **DONE** NOT reopened (its repaired 3-allow curator flip-path is the closure surface this bug later honors); BUG-0027 **DONE** NOT reopened; BUG-0016/0019/0020/0021/0022/0023/0024/0025 **DONE** UNTOUCHED; BUG-0026/0028/0029 **OPEN** UNTOUCHED.
- **Stories**: **US-0156** DONE NOT reopened (AC-7 already ticked); US-0154/0155 **OPEN** UNTOUCHED; US-0119 **shipped** (compose; no reopen; `none` byte-identical held); US-0131 **compose**; DEC-0131 **compose**.
- **Decisions**: DEC-0152 / DEC-0153 / DEC-0060 / DEC-0069 **UNTOUCHED** (compose/link only).
- **Sprints**: S0165/S0162/S0163/S0164 **terminal** UNTOUCHED; S0127..S0161 terminal; **S0166 is the next free (expected at sprint-plan, not created here)**.

## Non-claims (this phase)

- `BUG-0032_DONE_claimed=false` (architecture does not flip status — closure owns per US-0045 / BUG-0031 flip-path).
- `BUG-0032_AC_ticks_claimed=false` (AC-1..AC-7 remain `[ ]`; acceptance L223 unchecked).
- `live_ide_pass_claimed=false` (**UAT_PROBE_FORBIDDEN**; contract/mock primary; no live host probe).
- `drift_FIXED_claimed=false` (drift-DETECT only, **not** drift-fix — operator live-sync is the live-wins step, T-005 operator action).
- `no_sprint_materialized=false` — i.e. S0166 NOT created (sprint-plan owns).
- `no_test_bug0032_*_authored=false` — i.e. the 8 markers NOT authored (T-004 at sprint-plan/execute).
- `stop_matrix_mutated=false` (BUG-0034 owns; R-0156 DQ2 forbids here).
- `npm_published=false`; `git_pushed=false`; no `.env` read; no TUI/RPC/JSON/localhost surface touched.

## Compose (do not amend bodies)

**US-0119** (autonomy-preset surface; `none` = byte-identical pre-US-0119; 12 per-feature flags not re-touched — AC-4); **US-0131 / DEC-0131** (cross-host config baseline + the resolver this bug relies on — live-wins); **US-0017** (template-drift-guard precedent — the *semantic* parity pattern precedented, not a byte-pair SCOPES entry); **DEC-0060** (bug scope / intake evidence validation precedent); **DEC-0152** (DENY-FIRST last-matching-wins ordering — relevant to the closure-role authorization BUG-0031 repaired and that BUG-0032's closure must also honor); **US-0048 / BUG-0006** (spawn-only isolation — orchestrator owns the next spawn). **Research**: **R-0156** (this bug; DQ1–DQ3 LOCKED; `decision_gate=false`).

## Isolation evidence (US-0048 / DEC-0029) — architecture BUG-0032

- `phase_id=architecture`, `role=tech-lead`, `bug_id=BUG-0032`, `sprint_id=none` (S0166 expected at sprint-plan).
- `delivery_mode=ultra_lean`, `macro_phase=plan` (architecture = 2nd phase of the spec-macro + 1st phase of the plan macro), `model_id=inherit` / `qwen3.8:27b` (CROSS_MODEL_REVIEW=0).
- `fresh_context_marker=tl-BUG0032-architecture-20261004T130000Z-fresh` (FRESH; grep-verified 0 prior occurrences in `docs/`, `handoffs/`, `sprints/`, `decisions/`, `tests/` before mint; **NOT** a reuse of the prior research marker `tl-BUG0032-research-20261003T160000Z-fresh`).
- `explicit bug-target=BUG-0032` overrides `AUTO_BACKLOG_DRAIN=1`; AUTO_PHASE selectors unset; AUTO_BUG_QUEUE=0; no `/auto`, no subagent spawn (BUG-0006 / US-0048), no live probe, no `.env`, no status/AC mutation, no sibling mutation, no stop-matrix mutation, no config/scratchpad mutation.
- `evidence_ref`: `docs/product/backlog.md ### BUG-0032` (L5673, OPEN, AC-1..AC-7 `[ ]`); `docs/engineering/research.md ## R-0156` (DQ1–DQ3); `.its-magic/config.json` L1-L8 + L145-L146 + L317-L324; `.cursor/scratchpad.md` L639-L640; `scripts/check_intake_template_parity.py` (scope-handler shape L944-L980); `docs/engineering/reason_codes.md`; `docs/engineering/runbook.md`; `scripts/data/autonomy_stop_matrix.yaml` (L170-L231, 9 `auto_repair_kind` values — BUG-0034's token is the sibling addition, **not** touched here); `scripts/token_cost_lib.py:compute_strict_proof_hash`; `handoffs/po_to_tl.md` (BUG-0035 chain precedent); `handoffs/tl_to_dev.md` (top: BUG-0035, then BUG-0032 research continuation at L45+); `handoffs/resume_brief.md` (BUG-0035 CLOSURE_PASS top pointer + BUG-0032 research pointer); `docs/engineering/state.md` (L3645-L3670 research checkpoint); `docs/product/acceptance.md` L223 (BUG-0032 row, unchecked).

## Strict runtime proof (DEC-0038 / US-0056) — architecture BUG-0032

- `runtime_proof_id=rp-auto-20261004-bug0032-architecture-techlead-20261004T130000Z-BUG-0032` (FRESH; grep-confirmed **0** prior occurrences repo-wide; distinct from the research proof `rp-auto-20261003-bug0032-research-techlead-20261003T160000Z-BUG-0032`).
- `phase_id=architecture`, `role=tech-lead`, `bug_id=BUG-0032`, `sprint_id=none`; `proof_issued_at=2026-10-04T13:00:00Z`; `proof_ttl_seconds=3600`; `proof_ttl=2026-10-04T14:00:00Z`.
- **`proof_hash=2E9110423B60C79497B25B2A67CD77ED78334280CBB07893B69BB05EA627E08F`** (64-hex; stored uppercase).
- Canonical hashed payload: `{"orchestrator_run_id":"auto-20261004-bug0032","phase_id":"architecture","proof_issued_at":"2026-10-04T13:00:00Z","proof_ttl_seconds":3600,"role":"tech-lead","runtime_proof_id":"rp-auto-20261004-bug0032-architecture-techlead-20261004T130000Z-BUG-0032"}`.
- Via `from scripts.token_cost_lib import compute_strict_proof_hash` (positional 6-tuple: orchestrator_run_id, runtime_proof_id, phase_id, role, proof_issued_at, proof_ttl_seconds; compact sorted-key JSON; SHA-256). **`hash_recompute_confirmation=true`** — MINTED in one invocation → `2E9110423B60C79497B25B2A67CD77ED78334280CBB07893B69BB05EA627E08F`; then **INDEPENDENTLY RECOMPUTED in a second fresh invocation** (plain `hashlib.sha256` + `json.dumps(sort_keys=True, separators=(",",":"))`) → identical `2E9110423B60C79497B25B2A67CD77ED78334280CBB07893B69BB05EA627E08F`; 64 hex; **MATCH**.
- **Consumed previous-phase proof (durable reference, not re-verified this phase)**: `consumed_research_proof=rp-auto-20261003-bug0032-research-techlead-20261003T160000Z-BUG-0032` / `A3107ED0915759326A4C0450143CF4551D6AF81429C52498879C504FE9C910AC` (durable in state.md L3661-L3664). **TTL note (provenance honesty, per S0162/BUG-0031 + S0163/BUG-0022 closure precedents)**: the research TTL (2026-10-03T17:00:00Z) has lapsed at this mint (now 2026-10-04), but the **hash is a deterministic canonical-payload function and reproduces exactly under independent recompute**; the TTL is a freshness bound, not a validity bound on the canonical payload — **not STALE-stamped on the verdict**. The substantive trust anchors are the two **both-durable** artifacts — this `# BUG-0032` H1 + R-0156 (DQ1–DQ3 LOCKED) — which this phase reads verbatim.

## Phase boundary status (DEC-0069 AC-10) — architecture BUG-0032

- `phase_boundary=architecture` (research complete prior segment; architecture completed this phase; build+verify and ship not entered).
- `verdict=ARCHITECTURE_PASS`; `decision_gate=false`.
- `completed_phase=architecture`; `next_scheduled_phase=sprint-plan`; `next_scheduled_role=tech-lead`; `stop_reason=architecture_complete_phase_boundary`.
- `continuation_action=parent independently re-resolves the paired record and Stop-Matrix, then may spawn a fresh /sprint-plan tech-lead child for BUG-0032 only` (this architecture child does **not** spawn it — BUG-0006 / US-0048).
- `effective_plan=[spec, plan, build+verify, ship]`; `skipped_phases=[intake]` (intake was the prior PO-INTAKE_PASS segment); `phase_cursor=plan/2-of-3` (architecture is the 2nd of the plan macro: research→architecture→sprint-plan).
- `do_not_claim`: `live_ide_pass_claimed=false` (UAT_PROBE_FORBIDDEN); `BUG-0032_DONE_claimed=false`; `BUG-0032_AC_ticks_claimed=false`; `drift_FIXED_claimed=false` (drift-DETECT only); `sprint_materialized=false`; `npm_published=false`; `git_pushed=false`; no `.env`; no subagent spawn; no `/auto` recursion.
- **`stop_condition= STOP after ARCHITECTURE_PASS.** Orchestrator **MUST** spawn `/sprint-plan` in a fresh tech-lead. CROSS_MODEL_REVIEW=0 — do **NOT** spawn sovereign-critic. Do **NOT** mark BUG-0032 DONE. Do **NOT** tick AC. Do **NOT** create `sprints/S0166/` this phase (sprint-plan owns). Do **NOT** implement code. Do **NOT** author `test_bug0032_*` markers (sprint-plan/execute owns). Do **NOT** drain BUG-0033/BUG-0034. Do **NOT** mutate `.its-magic/config.json` or `.cursor/scratchpad.md` (drift-DETECT only, not drift-fix). Do **NOT** mutate `scripts/check_intake_template_parity.py` / `scripts/data/autonomy_stop_matrix.yaml` / `docs/engineering/reason_codes.md` / `docs/engineering/runbook.md` (T-001/T-002/T-003/T-004 execute-phase work). Do **NOT** npm publish. Do **NOT** git push. Do **NOT** spawn `/sprint-plan` from this architecture subagent.

## Next

**`/sprint-plan`** in a fresh tech-lead context (owner of **S0166** — next-free verified against `sprints/`: S0127..S0165 present + terminal, **S0166 free**). STOP after architecture handoff; orchestrator MUST spawn `/sprint-plan` in a fresh tech-lead — **do not** implement from this phase (BUG-0006); **do not** spawn `/execute` from `/sprint-plan`; **do not** create `sprints/S0166/` from this architecture subagent.

# BUG-0034 — PO closure-precondition registry and bounded state disambiguation

**Verdict: `ARCHITECTURE_PASS`; `decision_gate=false`.** This is the additive
implementation architecture for R-0158 A1. BUG-0034 remains **OPEN**; backlog
AC-1..AC-7 and its acceptance row remain unchecked. No companion DEC is
required: this registers one use of the accepted DEC-0119 taxonomy and does not
alter a cross-phase ownership contract.

## Binding repair boundary

Register exactly one machine row for `PO_CLOSURE_PRECONDITION_CONFLICT` in
`scripts/data/autonomy_stop_matrix.yaml`, immediately adjacent to
`STATE_PHASE_AMBIGUOUS` in the `autonomy_resolvable` group:

```yaml
code: PO_CLOSURE_PRECONDITION_CONFLICT
stop_class: autonomy_resolvable
auto_repair_kind: disambiguate_state
cap: 3
rationale: Closure preconditions can be selected only from one already-evidenced state; ambiguous or paired-brief evidence remains fail-closed.
```

`disambiguate_state` selects only a single, existing, validated
closure-precondition state. It must not manufacture a phase or prerequisite,
change backlog or acceptance state, alter a resume brief, or treat a state file
as fallback evidence. A non-unique candidate is `RESUME_AMBIGUOUS` and remains
`security_hard`. Pair syntax failure is only `RESUME_BRIEF_UNPARSEABLE`; a
missing, stale, conflicting, unauthorized, replayed, proof-invalid, or
isolation-invalid pair is `RESUME_BRIEF_STALE` with its predicate retained.
Those outcomes schedule no repair continuation or child.

`auto_refresh_brief` is rejected, not deferred. `RESUME_BRIEF_AUTO_REFRESH=0`
is absolute under BUG-0035 / DEC-0153: no brief refresh, state fallback,
reconciler, manual parent repair, hand edit, or next spawn may result from
invalid continuation evidence. Cap exhaustion remains the existing terminal
`AUTONOMY_REPAIR_CAP_EXHAUSTED`.

## Delivery surface and parity map

| Surface | Required change | Parity / boundary |
|---|---|---|
| `scripts/data/autonomy_stop_matrix.yaml` | Add the one locked row above; retain all existing rows and taxonomy values. | Active machine source only; there is no template YAML counterpart. |
| `docs/engineering/autonomy-stop-matrix.md` and `template/docs/engineering/autonomy-stop-matrix.md` | Add the same row in the operator-facing autonomy-resolvable table and update its count. | Byte-identical active/template pair. YAML remains the machine source of truth. |
| `docs/engineering/reason_codes.md` and template twin | Add the BUG-0034 / US-0119 row naming `disambiguate_state`, cap 3, and the fail-closed pair boundary. | Byte-identical pair; do not rewrite the existing index. |
| `docs/engineering/runbook.md` and template twin | Add `PO_CLOSURE_PRECONDITION_CONFLICT` remediation: preserve evidence; select only a unique evidenced state; rerun the closure precondition; obtain a fresh authorized child for pair failures; never hand-edit or refresh a brief. | Byte-identical pair; no manual parent repair instruction. |
| `scripts/autonomy_repair_ledger_lib.py` | Extend the existing generic ledger integration; do not introduce a PO-specific ledger. | Active-only script: no template counterpart exists. |
| `tests/bug0034_autonomy_stop_matrix_test.py` and `template/tests/bug0034_autonomy_stop_matrix_test.py` | Add the eight contract markers below. | Byte-identical test pair; fixture/mock only, no live probe. |

## Ledger and dispatch contract

The active API is `scripts/autonomy_repair_ledger_lib.py`:
`get_ledger_path(orchestrator_run_id)`, `read_ledger(orchestrator_run_id)`,
`get_attempt_count(orchestrator_run_id, reason_code)`, and
`attempt_repair(orchestrator_run_id, reason_code, auto_repair_kind, success,
evidence_path=None)`. It currently appends to
`handoffs/autonomy_repair_ledger/<orchestrator_run_id>.jsonl`, counts by
`(orchestrator_run_id, reason_code)`, and hard-codes `DEFAULT_CAP=3`.

The implementation extends that existing flow to resolve the target's matrix
row before attempting a repair. Its effective cap is the validated row cap
unless an authorized positive integer `AUTONOMY_REPAIR_CAP_OVERRIDE` is present;
malformed or unauthorized override evidence fails closed rather than silently
changing a cap. The ledger continues to append the normal audit fields for this
same token and `disambiguate_state`, counts only its own `(run, reason_code)`,
and emits `AUTONOMY_REPAIR_CAP_EXHAUSTED` after the effective cap's failed
attempt. A successful, uniquely evidenced repair alone may emit the unchanged
breadcrumb:

```
autonomy_relaxed: PO_CLOSURE_PRECONDITION_CONFLICT -> disambiguate_state
```

No success breadcrumb is emitted for an ambiguous selection, invalid pair,
failed attempt, or cap-exhausted attempt. The closure dispatch must read the
YAML classification and use this API; it must not add a second ledger, bypass
the cap, or create an untracked PO repair route.

## Verification contract

The planned eight `test_bug0034_*` markers map the acceptance criteria without
changing them:

1. Matrix row exists with `autonomy_resolvable` classification (AC-1).
2. The only chosen repair kind is `disambiguate_state`; `auto_refresh_brief` is
   absent for this token (AC-1, AC-7).
3. Matrix cap is 3 and rationale is non-empty and exact in intent (AC-1).
4. Active/template operator-matrix documentation is byte-identical and names
   the same row (AC-1, AC-5).
5. Active/template reason-code rows are byte-identical and cross-reference
   US-0119 with the locked repair kind (AC-2).
6. Active/template runbook remediation is byte-identical and forbids refresh,
   hand edit, fallback, reconciler, and invalid-evidence spawn (AC-3, AC-7).
7. Existing ledger API records this token/kind by `(run, reason_code)`, resolves
   matrix cap plus authorized override, caps failures, and writes the
   breadcrumb only after actual unique success (AC-4).
8. Negative fixtures retain `RESUME_AMBIGUOUS`,
   `RESUME_BRIEF_UNPARSEABLE`, and `RESUME_BRIEF_STALE` classifications;
   `RESUME_BRIEF_AUTO_REFRESH=0` never refreshes. Verify
   `bug_issue_validate.py --check-acceptance` and US-0119/US-0120 regressions;
   prove no security-hard, configuration, intake, or sibling mutation (AC-6,
   AC-7).

## Non-goals and compose guards

US-0119 and US-0120 are compose-only. Preserve all twelve autonomy flags,
`AUTONOMY_PRESET=none`, `INTAKE_AUTONOMY_MODE=0`, and
`INTAKE_SUBAGENT_FALLBACK=deny`; do not alter any `security_hard` row or its
`n/a`/cap-0 invariant. Do not mutate config or scratchpad, source or tests in
this phase, backlog/acceptance status, reason-code/runbook/matrix surfaces,
TUI/RPC/JSON command templates/localhost routes, or a `.env` file. No live-host
claim, publish, push, sprint, `/auto`, or subagent spawn is authorized.

## Phase boundary

- Research authority: `R-0158` (DQ1–DQ3 locked); companion DEC: none.
- `phase_id=architecture`; `role=tech-lead`; `bug_id=BUG-0034`;
  `orchestrator_run_id=auto-20261005-bug0034-architecture`;
  `fresh_context_marker=tl-BUG0034-architecture-20261005T110500Z-fresh`.
- `effective_plan=[spec, plan, build+verify, ship]`; `skipped_phases=[discovery]`;
  `completed_phases=[intake,research,architecture]`; `phase_cursor=plan/2-of-3`.
- **Stop-Matrix action:** `STOP_AFTER_ARCHITECTURE_PASS; validate_pair_then_parent_may_spawn_sprint-plan`.
  This child does not spawn. Only a parent that independently validates the
  paired record may later spawn a fresh `/sprint-plan` tech-lead child for
  BUG-0034; invalid evidence stops as the applicable resume reason code.

# BUG-0033 — Thin→rich command-pair parity: OpenCode closure/ask/auto/refresh-context/execute

**Verdict: `ARCHITECTURE_PASS`; `decision_gate=false`.** Additive implementation architecture for R-0159 (DQ1–DQ8 LOCKED). BUG-0033 remains **OPEN**; backlog AC-1..AC-8 + its acceptance row stay unchecked. A companion DEC **is** required — **DEC-0154** — because DQ6 Option A amends the US-0125 clone-guard line-cap (a cross-phase normative rule binding /execute + QA), unlike BUG-0034 (one use of an existing taxonomy). This phase appends only this H1 + DEC-0154 + the paired continuation record (architecture.md / decisions.md / state.md / resume_brief.md).

## Parity contract (DQ1/DQ2 LOCKED — adapted text, not verbatim)

Exactly five thin OpenCode bodies receive the two rich sections, applied identically to the active + `template/` mirror of each: `.opencode/commands/{closure,ask,auto,refresh-context,execute}.md`.

- **Text rule (0 invented tokens):** the thin surface is *diagnostics-only documentation*, not dispatch logic. For **closure** the `## Fail-safe reason codes` section points to the authoritative rich table (`.cursor/commands/closure.md` `## Fail-safe reason codes and remediation guidance`); for **ask/auto/refresh-context/execute** the rich source has **no** such heading, so the thin section is a terse derived vocabulary + pointer to the rich source. Every token is verbatim from the rich source or an already-registered code (R-0159 DQ1). Exact locked per-file text: **R-0159 L16192-16249** — consume, do not re-derive.
- **Ordering (LOCKED):** `## Stop conditions` first, then `## Fail-safe reason codes` (matches rich physical order closure.md L58→L164).
- **Insertion geometry (LOCKED):** insert immediately **before the final `STOP` sentinel** in closure/ask/refresh-context/execute (after the existing `## Validator bridge` / dispatch prose); **auto.md has no `STOP` sentinel** → append at EOF after one blank line.
- **Projected lines (active==template, both mirrors):** closure 19→29, ask 12→19, auto 49→61, refresh-context 18→27, execute 24→34. Clone-guard similarity vs rich stays ≤0.031 (cap 0.30); no US-0125 forbidden/policy/clone token introduced; frontmatter `agent:` preserved (closure `qa`, auto `auto`, refresh-context `curator`, execute `dev`, ask none).

## DQ6 Option A — MANDATORY US-0125 line-cap reconciliation (→ DEC-0154)

The one architectural input the fix depends on; it is **pre-existing, not caused by BUG-0033**. The US-0125 `test_us0125_clone_guard` (≤20 lines) + `test_us0125_auto_command_dispatch_only` (`auto.md` ≤20) caps are structurally in tension with AC-1..AC-5: after the DQ1 insert, closure (29) + refresh-context (27) **newly** cross the cap; auto (61) / execute (34) grow; only ask (19) fits. The suite is **already red** on 5 pre-existing failures (R-0159 DQ6.1), none caused by BUG-0033.

**LOCKED (adopt A; reject B, C):** apply an **additive** US-0125 line-cap reconciliation for the **five parity-target files only** (a `BUG0033_PARITY_TARGETS` exemption set or a per-file cap of ~35), **keeping the similarity ≤0.30 clone-guard, the clone strip-list, and the frontmatter-shape marker INTACT**. Rationale: the two added sections are diagnostics-only documentation (US-0125 "diagnostics only, enforcement in Python"), not dispatch logic; similarity — the real "no 200-line Cursor clone" signal — is unchanged. Additive and consistent with US-0125 being additive (backlog L5701) and the shipped US-0156 re-addition of `auto.md` (14→15 inventory, 49-line auto.md already a known deviation from the 14-file/≤20 shape).
- **Option B** (re-scope to `ask.md`) REJECTED: fails AC-1/AC-3/AC-4/AC-5; AC-8's "8+ markers over AC-1..AC-7" unsatisfiable.
- **Option C** (no cap change; accept new red) REJECTED: muddies "no regression", leaves an unexplained breach.
- **MANDATORY seed task (T-002)** + **DEC-0154** (amends a cross-phase contract). If /execute cannot satisfy the reconciliation it must raise an operator decision_gate (re-scope, Option B) — it may NOT silently accept Option C.

## Parity mechanism (DQ3 LOCKED — new `--scope=bug-0033` byte-pair table)

Add `--scope=bug-0033` to `scripts/check_intake_template_parity.py` (existing SCOPES dict + `--scope` choices; BUG-####-per-scope precedent), **not** an ad-hoc comparator. `BUG0033_PAIRS` (active, template):

```
(".opencode/commands/closure.md",         "template/.opencode/commands/closure.md"),
(".opencode/commands/ask.md",             "template/.opencode/commands/ask.md"),
(".opencode/commands/auto.md",            "template/.opencode/commands/auto.md"),
(".opencode/commands/refresh-context.md", "template/.opencode/commands/refresh-context.md"),
(".opencode/commands/execute.md",         "template/.opencode/commands/execute.md"),
("tests/bug0033_opencode_command_parity_test.py","template/tests/bug0033_opencode_command_parity_test.py"),
```

`--scope=all` already unions all byte-pair tables (L959) — no further wiring. Parity assertion (BUG-0031 "837b shipped delta" precedent): (a) `python scripts/check_intake_template_parity.py --scope=bug-0033` → exit 0 + `[INTAKE_TEMPLATE_PARITY_OK] scope=bug-0033`; (b) `active.read_bytes() == template.read_bytes()` per pair.

## Test marker contract (DQ4 LOCKED — 10 `test_bug0033_*` markers ≥ 8)

New `tests/bug0033_opencode_command_parity_test.py` (+ byte-identical `template/` twin). Markers: (1) closure both headings (AC-1); (2) ask both (AC-2); (3) auto both (AC-3); (4) refresh-context both (AC-4); (5) execute both (AC-5); (6) active==template byte parity for all 5 pairs (AC-6); (7) `--scope=bug-0033` green + banner (AC-6/AC-7); (8) thin dispatch-only preserved — no `spawn(` / `ctx.session.create` / `Session.create` / POLICY_TEXT_FRAGMENTS / `OPENCODE_VALIDATOR_FAILED` / `OPENCODE_DRIVER_INVOKE_FAILED` / `npm install` / `require(`, frontmatter `agent:` preserved (AC-7); (9) us0125+us0126 no regression — failing set ⊆ the pre-existing red baseline (DQ6) and `.opencode/tui.json` `"plugin": []` (BUG-0030/DEC-0151) intact (AC-7); (10) 0 new reason codes (DQ5). Full table: R-0159 DQ4 L16290-16301.

## Zero new reason codes (DQ5 LOCKED)

**0 new codes.** Every cited token is pre-existing (registry-registered in `reason_codes.md`/`runbook.md`, or surfaced in the rich source). No mutation of `reason_codes.md`, `runbook.md`, `scripts/data/autonomy_stop_matrix.yaml`, or the repair ledger — that is BUG-0034's surface.

## Task seeds for /sprint-plan (consumed, not executed, this phase)

| id | task | AC | surface |
|---|---|---|---|
| T-anch | Consume R-0159 DQ1–DQ8 + this H1; verify 0 new tokens | all | (none) |
| T-001 | Apply DQ1/DQ2 text to the 5 active+template mirrors (before `STOP` / EOF for auto) | AC-1..AC-6 | `.opencode/commands/*` + `template/.opencode/commands/*` |
| T-002 | DQ6 Option A: additive US-0125 line-cap reconciliation for the 5 targets; similarity cap + strip list + frontmarker INTACT | AC-7 | `tests/us0125_contract_test.py` (per DEC-0154) |
| T-003 | Add `--scope=bug-0033` BUG0033_PAIRS to the parity CLI | AC-6/AC-7 | `scripts/check_intake_template_parity.py` |
| T-004 | Author 10 `test_bug0033_*` markers + byte-identical template twin; wire to run-tests.ps1/.sh | AC-1..AC-8 | `tests/bug0033_opencode_command_parity_test.py` + `template/tests/*` + CI |

## Non-goals and compose guards (DQ7 LOCKED)

No `.cursor/commands/*` rich-file change (read-only). No US-0125/US-0126 edit beyond the DQ6 Option A line-cap reconciliation (similarity cap 0.30, strip list, frontmatter-shape marker, `--scope=opencode-adapter` table all untouched). No `.opencode/tui.json` change (`"plugin": []` BUG-0030/DEC-0151 lock). No reason-code / runbook / stop-matrix / repair-ledger mutation (BUG-0034). No BUG-0006/US-0048 spawn-only change; BUG-0035/DEC-0153 rules unchanged. No change to the other 10 thin files. No mutation of any DONE bug, any other OPEN item, production code, existing tests, template twins (except the 5 target mirrors + the new test twin), config, or scratchpad.

## Phase boundary

- Research authority: `R-0159` (DQ1–DQ8 LOCKED; **consume, do not re-decide**); companion DEC: **DEC-0154** (DQ6 Option A normative rule).
- `phase_id=architecture`; `role=tech-lead`; `bug_id=BUG-0033`; `orchestrator_run_id=auto-20261008-bug0033-architecture`; `fresh_context_marker=tl-BUG0033-architecture-20261008T212725Z-fresh`; `runtime_proof_id=rp-auto-20261008-bug0033-architecture-techlead-20261008T212725Z-BUG-0033`.
- `effective_plan=[spec, plan, build+verify, ship]`; `skipped_phases=[discovery]`; `completed_phases=[intake,research,architecture]`; `phase_cursor=plan/2-of-3`.
- **Stop-Matrix action:** `STOP_AFTER_ARCHITECTURE_PASS; validate_pair_then_parent_may_spawn_sprint-plan`. This child does not spawn. Only a parent that independently validates the paired record may later spawn a fresh `/sprint-plan` tech-lead child for BUG-0033; invalid evidence stops as the applicable resume reason code.
