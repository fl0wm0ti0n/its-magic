# Architecture archive pack (2026-09-13)

- Rollover trigger: `ARCH_HOT_MAX_LINES=3000, ARCH_HOT_MAX_STORY_SECTIONS=120`
- Source: `docs/engineering/architecture.md`
- Archived units (oldest first, contiguous prefix): 2
- Retained units in hot file: 19
- First archived heading: `# US-0136 — Fresh role sessions and runtime attestation`
- Last archived heading: `# US-0137 — Owned tool broker, policy engine, and security boundary`
- Verification tuple (mandatory):
  - archived_body_lines=295
  - preamble_lines=1
  - retained_body_lines=2858

---

# US-0136 — Fresh role sessions and runtime attestation

## Overview

**US-0136** enforces genuinely fresh, correctly authorized Pi sessions per producer phase, review/critic phase, and every execute/QA rework iteration so role separation is a runtime fact (SessionSupervisor + RoleCatalog + spawn/start/end attestations), not prompt trust. Pi stays behind `packages/pi-kernel`. `role-runtime` never imports Pi. Fake-model CI default, empty resource loader, `noTools: "builtin"`, KernelBridge, and auth-models stay **unamended**. DEC-0038 `compute_strict_proof_hash` tuple stays **UNAMENDED**.

**Research anchor**: **R-0128** (DQ1–DQ10 LOCKED). **Companion DEC**: **DEC-0136** (Accepted — THIS phase). **EARLY_RESEARCH**: consumed from R-0128 + architecture-phase Context7 `/earendil-works/pi` + `/websites/pi_dev` confirm (`createAgentSession({ sessionManager })`; `SessionManager.inMemory|create|continueRecent|open|forkFrom`; `AgentSessionRuntime.newSession/fork/switchSession` replace the active session; `session.sessionId` / `dispose`) — **no new R-id**.

**Fresh context marker**: `tl-US0136-architecture-20260913T073500Z-fresh`
**Orchestrator run id**: `auto-20260913-us0136`
**Timestamp**: 2026-09-13T07:35:00Z (UTC)
**Verdict**: PASS
**Next**: `/sprint-plan` (orchestrator-owned; CROSS_MODEL_REVIEW=1 critic of architecture first). Do **not** spawn sprint-plan from this subagent (BUG-0006).

**baseline_h2_count (pre-mutate)**: `0`

## Approach locked (A1 — from R-0128)

| Option | Summary | Verdict |
|--------|---------|---------|
| **A1** | `standalone/packages/role-runtime` (RoleCatalog + SessionSupervisor + sidecar attestation; **no Pi imports**); Supervisor wraps injected `AgentKernel.createSession` only; `SessionManager.inMemory`; `continueRecent`/`fork` default-deny; same-phase `run`/`steer` only; RoleCatalog ports DEC-0051 / `AUTO_ROLE_*`; sidecar spawn/start/end; DEC-0038 envelope unamended; TS orchestrator scheduling-only; fail-closed `SESSION_*`/`ATTESTATION_*` + reused kit codes; fake-model CI / loader / `noTools` / KernelBridge / auth-models **held** | **Preferred / LOCKED** — AC-1..AC-7 |
| A2 | Fold into `runtime-core` | **Rejected** — §30 / US-0140 |
| A3 | Pi imports in `role-runtime` | **Rejected** — DEC-0133 |
| A4 | Persist jsonl + `continueRecent`/`fork` | **Rejected** — AC-1 / R3 / R5 |
| A5 | Orchestrator Pi session (`itsm_ping`) | **Rejected** — weaker R4 |
| A6 | Extend `compute_strict_proof_hash` | **Rejected** — AC-4 / DEC-0038 |
| A7 | SQLite this story | **Rejected** — §27.2 |
| A8 | Amend isolation / `noTools` / KernelBridge / auth-models | **Rejected** — D8 / D9 |
| A9 | Live paid CI | **Rejected** — fake-model held |

**Can this be simpler?** Reusing Pi `continueRecent` fails AC-1. Folding into `pi-kernel` leaks RoleCatalog next to SDK imports. A1 is the simplest split that meets the ACs.

### Locked surfaces (DEC-0136)

1. **Package**: `@its-magic/role-runtime` in `standalone/packages/role-runtime`. No Pi dependency. Type-only `@its-magic/pi-kernel` allowed. Kit `files` omit `standalone/`. No Biome override. No `runtime-core` this story.
2. **Supervisor**: wraps injected `AgentKernel.createSession` only. Production/CI `SessionManager.inMemory` + DEC-0133 `agentDir` held. Do not add `continueRecent`/`fork`/`newSession({ parentSession })` to `AgentKernel`.
3. **Continuation**: process-local `ContinuationContract` (`schema_version: 1`, `allowed_ops: ["run","steer"]`). Same-phase in-session follow-up only. execute#N / QA#N / critic / crash / `iteration_key` change = fresh. Missing/mismatched contract → `SESSION_CONTINUATION_DENIED`.
4. **RoleCatalog**: DEC-0051 matrix + `AUTO_ROLE_RESEARCH|PLAN_VERIFY|CLOSURE|REFRESH_CONTEXT`; extra rows `sovereign-critic`→`tech-lead`, `security-review`→`security`, `map-codebase`/`ask`→`scout` (`dev` allowed, mutability `none`). Isolation/proof role for critic remains `tech-lead`. Unset AUTO_ROLE → default; invalid → `SESSION_UNKNOWN_ROLE`. Bounded keys: `objective_function`, `review_focus` only.
5. **Sidecar**: spawn/start/end; `kernel_session_id`=`session.sessionId`; `kernel_process_instance`=`${bootUuid}:${pid}`; stub `context_pack_hash`/`policy_hash`; `attestation_hash` = SHA-256 canonical JSON without that field. **Do not** extend DEC-0038.
6. **Persist**: in-memory registry SOT + optional gitignored OS-config JSONL (`its-magic/runs/<run-id>/session-attestations.jsonl`). Additive `standalone_attestation` on kit evidence. Python ignores unknown keys. No SQLite.
7. **Codes**: reuse `PHASE_ROLE_MISMATCH` / `PHASE_ROLE_CAPABILITY_MISSING` / `RUNTIME_PROOF_*` / `PHASE_CONTEXT_ISOLATION_VIOLATION` / `AUTO_ORCHESTRATOR_PHASE_EXECUTION`; add frozen `SESSION_*` / `ATTESTATION_*` (DEC-0136 §7).
8. **Orchestrator**: spawn-time `assertOrchestratorSchedulingOnly` in `role-runtime`; no mutation/`itsm_*` tools; no orchestrator Pi session in v1.
9. **Critic/crash**: fresh critic session; `parent_phase_session_id` lineage only; orphan `abort`+`dispose`; US-0140 reconstructs next phase; US-0144 owns critic content.
10. **Tests**: 10 `test_us0136_*`; Win+Linux; fake-model CI held.

### Critic NB closures (research us0136rsc-* — informational)

| NB | Closure |
|----|---------|
| NB1 R-proof MATCH / DQ2 continuation / continueRecent-fork deny / crash orphan / SESSION_*/ATTESTATION_* / stub hashes | LOCKED §3 continuation; §7 codes; §5 stubs until US-0139/US-0137 |
| NB2 `# US-0136` + DEC-0136 Accepted; role-runtime vs pi-kernel; sidecar hash ≠ DEC-0038; compose DEC-0133/0134/0135; TS orchestrator scheduling-only | LOCKED this H1 + DEC-0136; T-001/T-007; isolation/`noTools`/KernelBridge/auth-models unamended |
| NB3 no sprint-plan spawn; no DONE; no US-0137+; no isolation loader amend; 11 tasks ≤ 12 | Held — T-anch; Status OPEN; do not spawn `/sprint-plan` from this subagent |

## Components

### `role-runtime` package (AC-1, AC-2)

- `standalone/packages/role-runtime` with locked RoleCatalog + SessionSupervisor (DEC-0136 §2–§4)
- Injected `AgentKernel` only; grep denies `@earendil-works/pi-` inside the package

### SessionSupervisor + continuation (AC-1)

- Fresh `createSession` per producer/review/rework; process-local `run`/`steer` allow-list
- Default-deny Pi resume/fork/transcript restore

### Sidecar attestations (AC-3, AC-4)

- spawn/start/end + `attestation_hash`; additive `standalone_attestation`; DEC-0038 unamended

### Orchestrator spawn gate (AC-6)

- Empty mutation-tool allowlist at spawn; `SESSION_ORCHESTRATOR_TOOLS_DENIED`

### Contract tests (AC-5, AC-7)

- Ten markers (DEC-0136 §10). Kernel tests: `standalone/tests/contract`. Matrix Windows + Linux.

## Companion DEC = DEC-0136 (Required → Accepted)

Authored Accepted in THIS phase at `decisions/DEC-0136.md`. Locks A1, supervisor/catalog/sidecar APIs, continuation, reason codes, orchestrator gate, markers. BUG-0020's "do not allocate DEC-0136" applied to that bug, not this story.

## Risks finalized (R1–R6 from R-0128)

- **R1 (MEDIUM)** Pi 0.85.1 `AgentSessionRuntime.fork` / `continueRecent` accidentally wired later → do not add those methods to `AgentKernel`; grep + DQ2 deny tests
- **R2 (MEDIUM)** `inMemory(..., entries)` restore used as “resume” → supervisor never passes entries; `SESSION_TRANSCRIPT_CARRYOVER` fixture
- **R3 (LOW)** stub `context_pack_hash` / `policy_hash` mistaken for US-0139/US-0137 completeness → document stubs; later stories replace hash *values* without renaming fields
- **R4 (LOW)** `kernel_process_instance` pid recycle → boot UUID + pid
- **R5 (LOW)** RoleCatalog confused with PolicyEngine → role = intent; US-0137 = permission
- **R6 (LOW)** amending DEC-0133 loader while adding supervisor options → D8; tests assert empty loader + fake-model default still hold

## Compose, do not amend (verified)

| Story / DEC | Surface | Verification |
|-------------|---------|--------------|
| US-0133 / DEC-0133 / R-0121 | AgentKernel, pins, isolation loader, `noTools`, fake-model CI, `# US-0133` | ✓ compose `createSession` inject only; H1 not reopened |
| US-0134 / DEC-0134 / R-0122 | KernelBridge | ✓ locate-only; unamended |
| US-0135 / DEC-0135 / R-0127 | auth-models / ModelRouter / thinking | ✓ `model_id` provenance only; unamended |
| US-0048 / DEC-0029 | isolation evidence required fields | ✓ additive `standalone_attestation` |
| US-0056 / DEC-0038 | `compute_strict_proof_hash` tuple | ✓ UNAMENDED |
| US-0069 / DEC-0051 | phase→role + `AUTO_ROLE_*` | ✓ ported into RoleCatalog |
| US-0106 | bounded sovereign manifest | ✓ `objective_function` / `review_focus` keys only |
| US-0104 | `CROSS_MODEL_DEGRADED_MODE` | ✓ compose; critic spawn mechanism here, lens content US-0144 |
| Kit npm `its-magic` / DEC-0120 | `files` whitelist | ✓ omit `standalone/` |
| US-0137..US-0148 | later capabilities | ✓ OUT OF SCOPE |
| BUG-0020 / R-0126 | OpenCode `/auto` | ✓ DONE; not reopened; DEC-0136 is this story's companion |
| R-0121 / R-0122 / R-0127 / R-0128 | prior research | ✓ not wiped |

## Sprint seeds (11 tasks within SPRINT_MAX_TASKS=12 — for `/sprint-plan` refinement)

- **T-anch** (`# US-0136` H1 + DEC-0136 Accepted — RESOLVED in THIS phase; NO-OP / verification)
- **T-001** (AC-1 — `packages/role-runtime` + Pi import-boundary grep)
- **T-002** (AC-2 — RoleCatalog + DEC-0051 / `AUTO_ROLE_*` + extra catalog rows)
- **T-003** (AC-1 — SessionSupervisor fresh `createSession`; inMemory; no Pi resume APIs)
- **T-004** (AC-1 — ContinuationContract same-phase `run`/`steer` only)
- **T-005** (AC-3/AC-4 — sidecar spawn/start/end + `attestation_hash` + `standalone_attestation`)
- **T-006** (AC-5 — fail-closed `SESSION_*`/`ATTESTATION_*` + reused kit codes)
- **T-007** (AC-6 — TS orchestrator spawn-time tool deny; no Pi import)
- **T-008** (AC-1/AC-7 — critic/review fresh sessions + `parent_phase_session_id`)
- **T-009** (AC-7 — crash orphan discard + dispose)
- **T-010** (AC-7 — 10 `test_us0136_*` Win/Linux fake-model CI)

Execution order: T-anch → T-001 → T-002 → T-003 → {T-004, T-005} → T-006 → T-007 → T-008 → T-009 → T-010 (acyclic). No split (`SPRINT_AUTO_SPLIT` not triggered; 11 ≤ 12). Not `/quick`.

## Isolation evidence (US-0048 / DEC-0029)

- `phase_id=architecture`, `role=tech-lead`, `story_id=US-0136`, `sprint_id=none` (pending — sprint-plan owns folder), `orchestrator_run_id=auto-20260913-us0136`
- `delivery_mode=ultra_lean`, `macro_phase=plan` (architecture — second canonical phase of `plan` macro)
- `model_id=cursor-grok-4.6-high` (CROSS_MODEL_REVIEW=1 — required on isolation)
- `fresh_context_marker=tl-US0136-architecture-20260913T073500Z-fresh`, `timestamp=2026-09-13T07:35:00Z` (UTC)
- `evidence_ref=docs/engineering/research.md ## R-0128; docs/product/backlog.md ## US-0136; docs/engineering/architecture.md (this # US-0136); decisions/DEC-0136.md; handoffs/resume_brief.md; handoffs/po_to_tl.md Research handoff US-0136; Context7 /earendil-works/pi + /websites/pi_dev`
- Fresh tech-lead subagent per BUG-0006 / US-0048; no prior chat history. Narrow-read only. No `.env` reads. Status remains OPEN. US-0133/US-0134/US-0135 DONE compose-only not reopened. BUG-0020 DONE not reopened. No US-0137+ authoring. No `/sprint-plan` spawn from this subagent.
- Prior phase strict proof consumed: `rp-auto-20260913-us0136-research-techlead-20260913T071500Z-US-0136` / `42D5C250BDF6562EE383668E2FE8080568D1164A184B48FB82BF11982E5D56F6` — RUNTIME_PROOF_VALID (independent `compute_strict_proof_hash` MATCH; critic consume-before-TTL `2026-09-13T07:25:00Z` < `2026-09-13T08:15:00Z`; immutable R-0128). Critic findings us0136rsc-* informational only (`rp-auto-20260913-us0136-sovereign-critic-techlead-20260913T072500Z-US-0136` / `ABAF8CDB7F8051AE6EA63711AD6BA5E3D39A6EB6E424579A25994EE7225D2248`; anti_slop=10; 0 blocking).

## Strict runtime proof (mirror)

- `runtime_proof_id=rp-auto-20260913-us0136-architecture-techlead-20260913T073500Z-US-0136`
- Canonical hashed payload (DEC-0038, `compute_strict_proof_hash` positional): `{"orchestrator_run_id":"auto-20260913-us0136","phase_id":"architecture","proof_issued_at":"2026-09-13T07:35:00Z","proof_ttl_seconds":3600,"role":"tech-lead","runtime_proof_id":"rp-auto-20260913-us0136-architecture-techlead-20260913T073500Z-US-0136"}`
- `proof_hash=3814A075FD13922FD3E8B344CDA11F02BC832845C35245F2D2B5A0B07587E3CD` (SHA-256; actual `compute_strict_proof_hash`)
- `proof_ttl_seconds=3600`, `proof_ttl=2026-09-13T08:35:00Z` (UTC)
- Isolation extras (not hashed): `delivery_mode=ultra_lean`, `macro_phase=plan`, `model_id=cursor-grok-4.6-high`, `sprint_id=none`, `story_id=US-0136`

## Decision gate + next scheduled phase

- `decision_gate=false` (no blocking unknown; DQ1–DQ10 LOCKED; DEC-0136 Accepted; approach A1 locked; critic NBs closed)
- `next_scheduled_phase=/sprint-plan` (role=tech-lead; third canonical phase of `plan` macro)
- `next_scheduled_role=tech-lead`
- `stop_condition=STOP after architecture completes; hand off via artifacts only to /sprint-plan in fresh tech-lead subagent (BUG-0006). Do NOT spawn /sprint-plan from this subagent. Do NOT mark US-0136 DONE. Do NOT tick acceptance. Do NOT reopen US-0135 or BUG-0020. Do NOT design US-0137+.`

# US-0137 — Owned tool broker, policy engine, and security boundary

## Overview

**US-0137** mediates every consequential file/shell/git/test/app/browser/remote/deploy action through owned `ToolBroker` + `PolicyEngine` so models cannot bypass phase ownership, secret controls, approvals, or execution-isolation **profiles**. Semantic authorization (Layer A) is mandatory and is **not** an OS sandbox (Layer B = US-0141 OUT). Pi stays behind `packages/pi-kernel`. `policy-engine` and `tool-broker` never import Pi. `defineTool` lives **only** in `pi-kernel`. Production sessions receive role/phase `itsm_*` only. Fake-model CI default, empty resource loader, `noTools: "builtin"`, KernelBridge, auth-models, and role-runtime stay **unamended** except spawn allowlist + real `policy_hash`. DEC-0038 `compute_strict_proof_hash` tuple stays **UNAMENDED**.

**Research anchor**: **R-0129** (DQ1–DQ10 LOCKED). **Companion DEC**: **DEC-0137** (Accepted — THIS phase). **EARLY_RESEARCH**: consumed from R-0129 + architecture-phase Context7 `/earendil-works/pi` + `/websites/pi_dev` confirm (`createAgentSession({ customTools, tools, excludeTools, noTools })`; `defineTool({ name, label, description, parameters, execute })` → `{ content, details }`; builtins `read`/`bash`/`edit`/`write`/`powershell`/`grep`/`find`/`ls`; `--no-builtin-tools` / `noTools: "builtin"` keep builtins off while custom tools remain; **no built-in sandbox**; project trust ≠ sandbox) — **no new R-id**. Do not wipe R-0120..R-0129.

**Fresh context marker**: `tl-US0137-architecture-20260913T105500Z-fresh`
**Orchestrator run id**: `auto-20260913-us0137`
**Timestamp**: 2026-09-13T10:55:00Z (UTC)
**Verdict**: PASS
**Next**: `/sprint-plan` (orchestrator-owned; CROSS_MODEL_REVIEW=1 critic of architecture first). Do **not** spawn sprint-plan from this subagent (BUG-0006).

**baseline_h2_count (pre-mutate)**: `0`

## Approach locked (A1 — from R-0129)

| Option | Summary | Verdict |
|--------|---------|---------|
| **A1** | `standalone/packages/policy-engine` + `standalone/packages/tool-broker` (**no Pi imports**); thin kernel tool-port (`defineTool` only in `pi-kernel`); production `itsm_*` via ToolBroker; `noTools: "builtin"` held; PolicyEngine ALLOW\|ASK\|DENY; path deny matrix; shell classify; secret deny + US-0135 `redact.ts` compose; Layer A ≠ Layer B; compact audit + real `policy_hash`; fake-model CI / empty loader / KernelBridge / auth-models / role-runtime **held** (compose spawn allowlist + hash) | **Preferred / LOCKED** — AC-1..AC-8 |
| A2 | Fold broker/engine into `pi-kernel` | **Rejected** — R1 / §30 |
| A3 | Fold into `role-runtime` | **Rejected** — intent vs permission; would amend US-0136 |
| A4 | Fold into `runtime-core` | **Rejected** — §30 / US-0140 |
| A5 | Pi raw tools / drop `noTools` | **Rejected** — AC-1 / R2 |
| A6 | Claim OS sandbox from in-process checks | **Rejected** — pi.dev/security; US-0141 |
| A7 | Cedar / OPA / Cerbos / AgentCore Policy runtime | **Rejected** — analog only |
| A8 | Extend `compute_strict_proof_hash` | **Rejected** — DEC-0038; sidecar `policy_hash` |
| A9 | Amend RoleCatalog as permission matrix | **Rejected** — D2 / DEC-0136 compose-only |
| A10 | SQLite operational store this story | **Rejected** — §27.2 |
| A11 | Live paid CI | **Rejected** — fake-model held |
| A12 | Amend isolation loader / KernelBridge / auth-models | **Rejected** — D9 |

**Can this be simpler?** Exposing Pi `read`/`bash`/`edit`/`write` plus a permission wrapper looks smaller and fails AC-1 (raw tools reach the session; pi.dev: those tools run as the user). Folding into `pi-kernel` parks policy next to SDK imports (R1). A1 (two named packages + kernel tool-port + `noTools` held) is the simplest design that meets AC-1..AC-8.

### Locked surfaces (DEC-0137)

1. **Packages**: `@its-magic/policy-engine` + `@its-magic/tool-broker` in `standalone/packages/{policy-engine,tool-broker}`. `private: true`, `version: 0.0.0`, `type: module`, `engines.node >=22.19.0`, export `./src/index.ts`. **No Pi dependency.** Type-only `@its-magic/pi-kernel` / `@its-magic/role-runtime` allowed. Extend US-0133..0136 grep to deny `@earendil-works/pi-` inside both packages. No Biome override. Kit `files` omit `standalone/`. No `runtime-core` this story.
2. **Thin kernel tool-port**: additive `KernelCreateSessionOptions.ownedTools` (JSON-schema parameters + `execute` → `{ content, details }`). **Only** `packages/pi-kernel` calls `defineTool` and passes `customTools`. Names must match `^itsm_[a-z0-9_]+$`. Builtin names (`read`/`bash`/`edit`/`write`/`powershell`/`grep`/`find`/`ls`) at the port → fail-closed `POLICY_RAW_PI_TOOL_DENIED`. Production: `noTools: "builtin"` **held** + `customTools` = wrapped owned tools + `tools` = those `itsm_*` names. `itsm_ping` remains the kernel-contract placeholder (US-0133 compose); production ToolBroker catalog **excludes** it.
3. **Production catalog (live this story)**: `itsm_read`, `itsm_edit`, `itsm_write`, `itsm_patch`, `itsm_shell`, `itsm_git`. **Fail-closed stubs** (visible only if the role map includes the name; execute → `POLICY_STUB_TOOL_DENIED`, no backend): `itsm_search`/`itsm_outline`/`itsm_symbol`/`itsm_references`/`itsm_callers`/`itsm_impact` (US-0139); `itsm_app_start`/`itsm_app_stop`/`itsm_app_logs`/`itsm_app_health`/`itsm_deploy` (US-0141); `itsm_browser` (US-0142); `itsm_test`/`itsm_validate` (stub unless in-process build/test via `itsm_shell`); `itsm_spawn_review` (stub; SessionSupervisor owns critic spawn).
4. **Role/phase maps (floor)**: orchestrator `[]` (DEC-0136 `SESSION_ORCHESTRATOR_TOOLS_DENIED` held). po / curator / release / qe-closure / qa: `itsm_read` + listed stubs; **no** production-source writes. scout / security / critic: read-oriented (`itsm_read` + search stubs as cataloged). tech-lead: owned-artifact writes via path matrix. dev: implementation writes via path matrix. SessionSupervisor spawn allowlist = ToolBroker name list for that role/phase.
5. **PolicyEngine**: owned TypeScript decision tables. Default-deny. Result **ALLOW | ASK | DENY**. Tuple = role, phase, work item, sprint, worktree/cwd, path(s), command, execution backend, autonomy (`supervised`\|`autonomous`), permission_mode (`default-deny`\|`ask-on-write`), security_class (`standard`\|`security_hard`), operator approvals, isolation_profile. `security_hard` cannot be relaxed by autonomy (R10). Thin enums here; US-0138 owns typed RuntimeConfig flags. ASK store: process-local + optional gitignored OS-config JSON; missing approval → **DENY**.
6. **Path ownership**: code, not prompt. Canonicalize `path.resolve` + `realpath` vs worktree root; compare `path.relative`; reject `..`, symlink-out, UNC `\\`, `/etc`, Windows `\\?\` / `\\.\` → `POLICY_TRAVERSAL_DENIED`. Deny matrix: PO production source → `POLICY_PO_PRODUCTION_WRITE`; QA silent production patch → `POLICY_QA_SILENT_FIX`; release DONE/closure writes → `POLICY_RELEASE_CLOSURE_WRITE`; closure release-artifact writes → `POLICY_CLOSURE_RELEASE_WRITE`; orchestrator phase writes → compose `AUTO_ORCHESTRATOR_PHASE_EXECUTION` / `SESSION_ORCHESTRATOR_TOOLS_DENIED`; curator product-intent (`docs/product/vision.md`, backlog ACs as intent) → `POLICY_CURATOR_INTENT_REWRITE`. Secret paths (`.env`, `.env.*`, `*.pem`, `credentials.json`, auth stores) → `POLICY_SECRET_PATH_DENIED` **before** bytes enter tool `content`.
7. **Shell classifier v1**: argv / PowerShell token split — **not** a full bash AST. Unparseable / command-substitution / nested shell → `POLICY_SHELL_UNPARSEABLE`. Classes: `safe-read` \| `build-test` \| `local-process` \| `package-install` \| `git-mutation` \| `destructive-fs` \| `network-deploy` \| `privileged`. Fail-safe denies: exfil (`curl`/`wget`/`Invoke-WebRequest` posting env; `printenv`/`Get-ChildItem env:`; `type .env`; `cat ~/.ssh`) → `POLICY_SHELL_EXFIL_DENIED`; privileged (`sudo`/`runas`/`Set-ExecutionPolicy Unrestricted`) → `POLICY_SHELL_PRIVILEGED_DENIED`; destructive (`rm -rf`/`Remove-Item -Recurse`/`format`/`mkfs`) → `POLICY_SHELL_DESTRUCTIVE_DENIED`; `npm publish` / `npm install -g` ASK or DENY by autonomy (`POLICY_PACKAGE_DENIED` when DENY); `push --force` / `reset --hard` → `POLICY_GIT_FORCE_DENIED`. Do **not** classify by asking the model.
8. **Secrets**: never inject `.env` into LLM context. Compose US-0135 `redactAudit` / `redactSecretShaped` / `containsTokenShape` for logs, audit `details`, evidence. Browser/header helper redacts `Authorization`/`Cookie` and token-shaped values in network-shaped payloads **without** implementing US-0142. Do not expand `redact.ts` into a second secret store. This story does not read `.env`.
9. **Layer A ≠ Layer B**: enum `trusted-local` \| `isolated-development` \| `untrusted-repository`. PolicyEngine records requested profile + backend handle. Missing Layer B backend → `ISOLATION_BACKEND_UNAVAILABLE` (no execution). Claiming a complete OS sandbox from in-process checks is **forbidden**.
10. **Audit + real `policy_hash`**: compact row `run_id`, `phase_id`, `kernel_session_id`, `tool`, normalized action, policy decision, duration, result, `evidence_ref` — `redactAudit` on persist. v1 store: in-memory + gitignored OS-config/temp JSONL (compose DEC-0136). SHA-256 of canonical sorted-key JSON `{ schema_version: 1, policy_snapshot, tool_allowlist, role_catalog_digest }`. Replace DEC-0136 `stubPolicyHash` **value source**; keep sidecar field name `policy_hash`. ToolBroker/PolicyEngine compute the hash; SessionSupervisor records the provided value on the production spawn path (`stubPolicyHash` must not run in production). **Do not extend** DEC-0038. Python validators ignore unknown keys.
11. **Extensions default-deny**: empty isolation loader **held**. `PI_COMPAT_RESOURCES` trusted enablement **default-off**. Even `isolationMode=trusted`, project `.pi/extensions` cannot register tools. Do not switch `cwd`/`agentDir` to the target project. Do not add `additionalExtensionPaths` / `extensionFactories` in production.
12. **Tests**: 10 `test_us0137_*`; Win+Linux; fake-model CI held. Markers: `test_us0137_no_raw_pi_tools_in_production_session`; `test_us0137_role_subset_itsm_tools`; `test_us0137_po_src_deny`; `test_us0137_qa_silent_fix_deny`; `test_us0137_env_read_deny`; `test_us0137_path_traversal_deny`; `test_us0137_shell_exfil_deny`; `test_us0137_browser_header_redaction`; `test_us0137_isolation_backend_unavailable`; `test_us0137_malicious_pi_extension_and_orchestrator_zero_tools`.

### Critic NB closures (research us0137rsc-* — informational)

| NB | Closure |
|----|---------|
| NB1 R-proof MATCH / fail-closed raw Pi tools / path / shell exfil / secret deny / Layer B unavailable / malicious extensions | LOCKED §2–§11; T-003..T-006 / T-008 / T-010 |
| NB2 `# US-0137` + DEC-0137 Accepted; policy-engine + tool-broker; ToolBroker→PolicyEngine ALLOW/ASK/DENY; RoleCatalog=intent vs PolicyEngine=permission; US-0141 Layer B deferred; `defineTool` only in pi-kernel | LOCKED this H1 + DEC-0137; T-001/T-002/T-008; isolation/`noTools`/KernelBridge/auth-models/role-runtime unamended except spawn allowlist + hash |
| NB3 no sprint-plan spawn; no DONE; no US-0141 sandbox; no policy-engine/tool-broker code this phase; 11 tasks ≤ 12 | Held — T-anch; Status OPEN; do not spawn `/sprint-plan` from this subagent |

## Components

### `policy-engine` package (AC-2, AC-3, AC-4, AC-6)

- `standalone/packages/policy-engine` with locked evaluate tuple, deny matrix, shell classifier, profiles, `computePolicyHash`
- Grep denies `@earendil-works/pi-` inside the package

### `tool-broker` package (AC-1, AC-5, AC-7)

- `standalone/packages/tool-broker` builds the owned-tool list, injects PolicyEngine into every execute, writes compact audit, supplies `policy_hash` + spawn allowlist
- Live `itsm_*` file/shell/git + fail-closed stubs; `itsm_ping` excluded from production catalog

### Kernel tool-port (AC-1)

- Additive `ownedTools` on `KernelCreateSessionOptions`; `defineTool` only inside `pi-kernel`; `noTools: "builtin"` held

### Contract tests (AC-8)

- Ten markers (DEC-0137 §12). Kernel tests: `standalone/tests/contract`. Matrix Windows + Linux.

## Companion DEC = DEC-0137 (Required → Accepted)

Authored Accepted in THIS phase at `decisions/DEC-0137.md`. Locks A1, packages, tool-port, catalog maps, PolicyEngine tuple, path/shell/secret/profile/audit/`policy_hash`, reason codes, markers.

## Risks finalized (R1–R6 from R-0129)

- **R1 (MEDIUM)** `ownedTools` accidentally includes a builtin name → broker prefix `itsm_` only; DQ10 no-raw-Pi test; `noTools: "builtin"` held; factory `POLICY_RAW_PI_TOOL_DENIED`
- **R2 (MEDIUM)** operators treat Layer A as a sandbox → DQ7 reason code + docs; US-0141 owns backends; `ISOLATION_BACKEND_UNAVAILABLE` test
- **R3 (LOW)** ASK store lost on crash → missing approval DENY; gitignored JSON optional; SQLite later
- **R4 (LOW)** `stubPolicyHash` callers still hash tools-only → replace value source; keep field name; contract test snapshot mismatch
- **R5 (LOW)** PowerShell vs bash classifier gaps → unparseable DENY; dual inventory; Win+Linux tests
- **R6 (LOW)** trusted-resource enablement silently loads project extensions → default-off; empty loader internals unamended; malicious-extension fixture

## Compose, do not amend (verified)

| Story / DEC | Surface | Verification |
|-------------|---------|--------------|
| US-0133 / DEC-0133 / R-0121 | AgentKernel, pins, isolation loader, `noTools`, fake-model CI, `# US-0133` | ✓ additive `ownedTools` only; loader internals unamended |
| US-0134 / DEC-0134 / R-0122 | KernelBridge | ✓ locate-only; unamended |
| US-0135 / DEC-0135 / R-0127 | auth-models / ModelRouter / `redact.ts` | ✓ compose redact; unamended store |
| US-0136 / DEC-0136 / R-0128 | role-runtime SessionSupervisor / RoleCatalog / stub `policy_hash` | ✓ DONE compose-only; spawn allowlist + hash value source only |
| US-0048 / DEC-0029 | isolation evidence required fields | ✓ additive sidecar `policy_hash` |
| US-0056 / DEC-0038 | `compute_strict_proof_hash` tuple | ✓ UNAMENDED |
| Kit npm `its-magic` / DEC-0120 | `files` whitelist | ✓ omit `standalone/` |
| US-0138..US-0148 | later capabilities | ✓ OUT OF SCOPE (US-0141 Layer B OUT) |
| BUG-0020 / R-0126 | OpenCode `/auto` | ✓ DONE; not reopened |
| R-0120..R-0129 | prior research | ✓ not wiped |

## Sprint seeds (11 tasks within SPRINT_MAX_TASKS=12 — for `/sprint-plan` refinement)

- **T-anch** (`# US-0137` H1 + DEC-0137 Accepted — RESOLVED in THIS phase; NO-OP / verification)
- **T-001** (AC-1 — `packages/policy-engine` + `packages/tool-broker` + Pi import-boundary grep)
- **T-002** (AC-2 — PolicyEngine tuple ALLOW/ASK/DENY + `security_hard`)
- **T-003** (AC-3 — path ownership deny matrix)
- **T-004** (AC-4 — shell parse/classify + traversal/exfil)
- **T-005** (AC-5 — secret path deny + compose `redact.ts`)
- **T-006** (AC-6 — Layer A profiles + `ISOLATION_BACKEND_UNAVAILABLE`)
- **T-007** (AC-7 — compact audit + real `policy_hash`)
- **T-008** (AC-1 — kernel tool-port + `noTools` / `itsm_*` injection)
- **T-009** (AC-1 — per-role catalog + fail-closed stubs)
- **T-010** (AC-8 — 10 `test_us0137_*` Win/Linux fake-model CI)

AC surjection: AC-1→T-001,T-008,T-009 (T-010 m1,m2,m10); AC-2→T-002; AC-3→T-003 (T-010 m3,m4); AC-4→T-004 (T-010 m6,m7); AC-5→T-005 (T-010 m5,m8); AC-6→T-006 (T-010 m9); AC-7→T-007; AC-8→T-010. Execution order: T-anch → T-001 → T-002 → {T-003, T-004, T-005} → T-006 → T-007 → T-008 → T-009 → T-010 (acyclic). No split (`SPRINT_AUTO_SPLIT` not triggered; 11 ≤ 12). Not `/quick`.

## Isolation evidence (US-0048 / DEC-0029)

- `phase_id=architecture`, `role=tech-lead`, `story_id=US-0137`, `sprint_id=none` (pending — sprint-plan owns folder), `orchestrator_run_id=auto-20260913-us0137`
- `delivery_mode=ultra_lean`, `macro_phase=plan` (architecture — second canonical phase of `plan` macro)
- `model_id=cursor-grok-4.6-high` (CROSS_MODEL_REVIEW=1 — required on isolation)
- `fresh_context_marker=tl-US0137-architecture-20260913T105500Z-fresh`, `timestamp=2026-09-13T10:55:00Z` (UTC)
- `evidence_ref=docs/engineering/research.md ## R-0129; docs/product/backlog.md ## US-0137; docs/engineering/architecture.md (this # US-0137); decisions/DEC-0137.md; handoffs/resume_brief.md; Context7 /earendil-works/pi + /websites/pi_dev`
- Fresh tech-lead subagent per BUG-0006 / US-0048; no prior chat history. Narrow-read only. No `.env` reads. Status remains OPEN. US-0133/US-0134/US-0135/US-0136 DONE compose-only not reopened. BUG-0020 DONE not reopened. No US-0138+ authoring. No `/sprint-plan` spawn from this subagent.
- Prior phase strict proof consumed: `rp-auto-20260913-us0137-research-techlead-20260913T103500Z-US-0137` / `4B7F9F93EBF2DD358F41ADD6D25DFF93C17DF531D365C385ACE8937F0673817E` — RUNTIME_PROOF_VALID (independent `compute_strict_proof_hash` MATCH; critic consume-before-TTL `2026-09-13T10:45:00Z` < `2026-09-13T11:35:00Z`; immutable R-0129). Critic findings us0137rsc-* informational only (`rp-auto-20260913-us0137-sovereign-critic-techlead-20260913T104500Z-US-0137` / `27E8B2F2BE1D3A8A0EC2BA21332F4871DEAD9026467D907D9C34B57EEB6945DC`; anti_slop=10; 0 blocking; degraded_mode=false).

## Strict runtime proof (mirror)

- `runtime_proof_id=rp-auto-20260913-us0137-architecture-techlead-20260913T105500Z-US-0137`
- Canonical hashed payload (DEC-0038, `compute_strict_proof_hash` positional): `{"orchestrator_run_id":"auto-20260913-us0137","phase_id":"architecture","proof_issued_at":"2026-09-13T10:55:00Z","proof_ttl_seconds":3600,"role":"tech-lead","runtime_proof_id":"rp-auto-20260913-us0137-architecture-techlead-20260913T105500Z-US-0137"}`
- `proof_hash=1BA2580EED66FC542D567EEF44EC4C6040854A0DFFCFABEE0087042E7657D97C` (SHA-256; actual `compute_strict_proof_hash`)
- `proof_ttl_seconds=3600`, `proof_ttl=2026-09-13T11:55:00Z` (UTC)
- Isolation extras (not hashed): `delivery_mode=ultra_lean`, `macro_phase=plan`, `model_id=cursor-grok-4.6-high`, `sprint_id=none`, `story_id=US-0137`

## Decision gate + next scheduled phase

- `decision_gate=false` (no blocking unknown; DQ1–DQ10 LOCKED; DEC-0137 Accepted; approach A1 locked; critic NBs closed)
- `next_scheduled_phase=/sprint-plan` (role=tech-lead; third canonical phase of `plan` macro)
- `next_scheduled_role=tech-lead`
- `stop_condition=STOP after architecture completes; hand off via artifacts only to /sprint-plan in fresh tech-lead subagent (BUG-0006). Do NOT spawn /sprint-plan from this subagent. Do NOT mark US-0137 DONE. Do NOT tick acceptance. Do NOT reopen US-0136, US-0135, or BUG-0020. Do NOT design US-0138+.`

