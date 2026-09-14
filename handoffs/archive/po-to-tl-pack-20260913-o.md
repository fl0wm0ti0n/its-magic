# PO to TL archive pack (2026-09-13)

- Rollover trigger: `PO_TO_TL_HOT_MAX_LINES=650, PO_TO_TL_HOT_MAX_SECTIONS=60`
- Source: `handoffs/po_to_tl.md`
- Archived units (oldest first, contiguous prefix): 1
- Retained units in hot file: 14
- First archived heading: `## Discovery handoff — US-0137 Owned tool broker, policy engine, and security boundary`
- Last archived heading: `## Discovery handoff — US-0137 Owned tool broker, policy engine, and security boundary`
- Verification tuple (mandatory):
  - archived_body_lines=62
  - retained_body_lines=642

---

## Discovery handoff — US-0137 Owned tool broker, policy engine, and security boundary

- **Phase completed**: discovery. **Role**: po. **Story**: US-0137 only. **Sprint**: (pending). **Verdict**: PASS (`decision_gate=false`).
- **Timestamp (UTC)**: 2026-09-13T10:15:00Z. **Fresh marker**: `po-US0137-discovery-20260913T101500Z-fresh`.
- **Orchestrator**: `orchestrator_run_id=auto-20260913-us0137`, parent=`auto-20260913-us0136`, `delivery_mode=ultra_lean`, macro=`spec` (intake already DONE — not re-intaken), `model_id=cursor-grok-4.6-high`, CROSS_MODEL_REVIEW=1, AUTO_QUIET=1, EARLY_RESEARCH=1.
- **Sibling boundary**: **US-0138..US-0148** OPEN — OUT OF SCOPE this segment (do not mutate). **US-0141** OS sandbox OUT OF SCOPE — do not claim a complete sandbox from in-process checks. **US-0133** / **US-0134** / **US-0135** / **US-0136** DONE — compose only; do not reopen. **BUG-0020** DONE — do not reopen.
- **Gap confirmed (narrow-read)**: AgentKernel production factory still hardcodes `itsm_ping` + `noTools: "builtin"` + empty loader (DEC-0133). SessionSupervisor spawn-time orchestrator deny exists (DEC-0136) but there is no ToolBroker, no PolicyEngine, no role/phase `itsm_*` catalog, no path/shell/secret enforcement, no audit rows, no execution-profile enum, and `policy_hash` remains a RoleCatalog stub.

### Discovery locks D1–D10

| ID | Lock |
|----|------|
| **D1** | Production Pi sessions receive **only** role/phase-specific `itsm_*` tools backed by `ToolBroker` (AC-1 / R2 / §11.1). `noTools: "builtin"` **held**. Raw Pi tools (`read`/`bash`/`edit`/`write`/`powershell`/`grep`/`find`/`ls` and any extension-registered non-`itsm_*`) never reach a production session. `itsm_ping` remains a kernel-contract placeholder, not a production mutation path. Empty isolation loader **held**; US-0137 owns trusted-resource enablement (default-deny project Pi extensions — §26.5 / AC-8). |
| **D2** | `PolicyEngine` evaluates the §11.2 tuple — role, phase, work item, sprint, worktree/cwd, path(s), command, execution backend, autonomy, permission mode, security class, operator approvals — and returns **ALLOW**, **ASK**, or **DENY** (AC-2). RoleCatalog = intent (DEC-0136); PolicyEngine = permission. `security_hard` cannot be relaxed by autonomy (R10). |
| **D3** | Path ownership is code, not prompt (AC-3 / §11.3): PO cannot write production source; QA cannot silently patch production during independent QA; release cannot mark DONE; closure cannot modify release artifacts; orchestrator cannot do phase-owned writes (compose DEC-0136 spawn deny + `AUTO_ORCHESTRATOR_PHASE_EXECUTION`); curator cannot rewrite product intent. |
| **D4** | Shell actions are parsed and classified (AC-4 / §11.4): safe read-only, build/test, local process control, package install, git mutation, destructive filesystem, network/deploy, privileged. Destructive/privileged/network/deploy/package/git mutations follow explicit policy. Path traversal and exfiltration fail safely. Secret-file paths (including `.env`) explicit deny. |
| **D5** | Secret files/values are never injected into LLM context (AC-5 / §26.4). Provider tokens and `Authorization`/`Cookie` are redacted from logs and evidence. Compose US-0135 `redact.ts`; do not read `.env` in this or later agent phases. Config may reference secret **names** only (US-0138 owns typed config). |
| **D6** | Layer A (semantic policy) and Layer B (OS execution isolation) are **separate** (AC-6 / §26.1–26.3). Profiles: `trusted-local`, `isolated-development`, `untrusted-repository`. This story represents profiles and fail-closes unavailable isolation backends. **US-0141** owns OS/container/VM/micro-VM backends. Claiming a complete OS sandbox from in-process checks is **forbidden**. Cite pi.dev/security. |
| **D7** | Every consequential action writes a compact audit row (AC-7 / §11.5): run/phase/session/tool identity, normalized action, policy decision, duration, result, evidence ref — **no secret payload**. Replace DEC-0136 stub `policy_hash` with a hash of the policy snapshot + tool allowlist (do not extend `compute_strict_proof_hash`). |
| **D8** | Security tests (AC-8 / §35 Permissions / §36): malicious project Pi resources cannot register tools; `.env` reads denied; path traversal denied; shell exfiltration denied; browser/network evidence redacted; unavailable isolation backends fail closed with a deterministic reason. Fake-model CI. Windows + Linux `test_us0137_*`. |
| **D9** | Package boundary: new `standalone/packages/policy-engine` + `standalone/packages/tool-broker` (masterplan §30). **No Pi imports** outside `packages/pi-kernel` (R1 / DEC-0133). Broker/engine called via injected `AgentKernel` tool-port (research DQ1). Do not amend isolation loader internals, KernelBridge locate/handshake, auth-models, or RoleCatalog/SessionSupervisor except consume spawn allowlist + real `policy_hash`. Out of scope: US-0138 RuntimeConfig, US-0139 context/intelligence backends, US-0140 lifecycle sequencing, US-0141 OS sandbox, US-0142 browser runtime, US-0143 drain. US-0133/US-0134/US-0135/US-0136/BUG-0020 not reopened. US-0138+ not mutated. |
| **D10** | Research questions DQ1–DQ10 → `/research` authors **R-0129** (next after R-0128; compose R-0128/DEC-0136/US-0136 + R-0121/R-0122/R-0127/DEC-0133/DEC-0134/DEC-0135; do not wipe R-0120..R-0128). Companion **DEC-0137** + `# US-0137` at `/architecture` only — PO does not author them. |

### Research questions DQ1–DQ10 (for `/research` → expect **R-0129**)

1. **DQ1**: Package split — `packages/tool-broker` + `packages/policy-engine` vs fold into `runtime-core` or `role-runtime`; TypeScript surfaces; inject tools into `AgentKernel.createSession` without Pi imports in broker/engine (thin kernel tool-port vs wrapping `defineTool` only inside `pi-kernel`).
2. **DQ2**: Per-role/phase `itsm_*` catalog vs §11.1 full list this story — which names are implemented (file/shell/git) vs registered fail-closed stubs until US-0139/US-0141/US-0142 backends; how SessionSupervisor consumes the allowlist at spawn; fate of production `itsm_ping`.
3. **DQ3**: Policy language for v1 — owned TypeScript decision tables vs Cedar vs OPA/Rego vs Cerbos (analogs are names-only seeds, not adopted). Default-deny; ASK persistence (in-memory vs gitignored JSON; SQLite deferred per DEC-0136). R10 `security_hard` not softened by autonomy (US-0138 later owns typed autonomy flags — thin enum allowed here).
4. **DQ4**: Path ownership encoding — glob/ownership tables vs RoleCatalog artifact-ownership keys; worktree/cwd canonicalization; Windows vs POSIX; PO/QA/release/closure/orchestrator/curator deny matrix as deterministic reason codes.
5. **DQ5**: Shell classifier — argv vs shell AST; bash vs PowerShell; git mutation / package / network / deploy / privileged detection; traversal (`..`, symlink, `/etc`, UNC) and exfil (curl/env dump) fail-closed inventory.
6. **DQ6**: Secret boundary — deny `.env` and secret-shaped files before model sees content; compose US-0135 `redactAudit` for logs/evidence; browser redaction helper without implementing US-0142 runtime; never log provider tokens.
7. **DQ7**: Execution profiles as typed enum + backend handle; fail-closed reasons when Layer B backend is missing (`ISOLATION_BACKEND_UNAVAILABLE`); no in-process “sandbox” claim; US-0141 implements Docker/WSL/SSH/micro-VM.
8. **DQ8**: Audit store — gitignored runtime JSON vs in-memory (SQLite deferred); schema for identity/action/decision/duration/result/evidence_ref; real `policy_hash`; DEC-0038 envelope unamended; Python validators ignore unknown sidecar keys.
9. **DQ9**: Kernel compose — bounded `KernelCreateSessionOptions` tool injection (`customTools`/`tools` names) vs replacing hardcoded `itsmPingTool`; keep empty loader + `noTools: "builtin"`; prove malicious project `.pi/extensions` cannot register tools; `PI_COMPAT_RESOURCES` trusted enablement owned here remains default-off.
10. **DQ10**: `test_us0137_*` Win+Linux fake-model inventory — no raw Pi tools in production session; role-subset `itsm_*`; PO `src/**` deny; QA silent-fix deny; `.env` deny; traversal deny; shell exfil deny; browser/header redaction; unavailable backend fail-closed; orchestrator still zero mutation tools.

### Design refs

- `docs/product/standalone-its-magic-pi-masterplan.md` sections 11, 26, 30 (`policy-engine`, `tool-broker`), 32 Phase 1, 35 Permissions, 36, R2/R4/R10; US-0005 hooks → PolicyEngine/ToolBroker
- Pi: https://pi.dev/docs/latest/sdk ; https://pi.dev/docs/latest/security ; https://github.com/earendil-works/pi/blob/main/packages/coding-agent/docs/sdk.md
- EARLY_RESEARCH analogs (DQ seeds, not adopted): Cedar-for-Agents / MCP schema generator; OPA/Rego; Cerbos; ToolHive MCP gateway; AWS Bedrock AgentCore Policy
- Compose: `decisions/DEC-0136.md`, `decisions/DEC-0135.md`, `decisions/DEC-0133.md`, `decisions/DEC-0134.md`, `docs/engineering/research.md` R-0128 / R-0127 / R-0121 / R-0122 (do not wipe R-0120..R-0128)
- Compose: `standalone/packages/pi-kernel/src/{tools,kernel,isolation,types}.ts`; `standalone/packages/role-runtime/src/orchestrator-gate.ts`; `standalone/packages/auth-models/src/redact.ts`
- Intake (read-only): `handoffs/intake_evidence/US-0133-0148-intake-20260911.json` (`tool-policy-engine` → US-0137)

### Runtime proof (DEC-0038)

- `runtime_proof_id=rp-auto-20260913-us0137-discovery-po-20260913T101500Z-US-0137`
- `proof_hash=4982C931EAF52F854E23C5D91C16D1C771256548A6DA94F9858785BB7CC639FB`
- `proof_ttl=2026-09-13T11:15:00Z`
- Hash via `from scripts.token_cost_lib import compute_strict_proof_hash` (positional; compact sorted-key JSON).
- Canonical hashed payload: `{"orchestrator_run_id":"auto-20260913-us0137","phase_id":"discovery","proof_issued_at":"2026-09-13T10:15:00Z","proof_ttl_seconds":3600,"role":"po","runtime_proof_id":"rp-auto-20260913-us0137-discovery-po-20260913T101500Z-US-0137"}`
- Isolation extras (not hashed): `delivery_mode=ultra_lean`, `macro_phase=spec`, `model_id=cursor-grok-4.6-high`, `sprint_id=none`, `story_id=US-0137`
- `hash_recompute_confirmation=true` (compute_strict_proof_hash → 4982C931EAF52F854E23C5D91C16D1C771256548A6DA94F9858785BB7CC639FB)

### Isolation + stop

- `phase_id=discovery`, `role=po`, `story_id=US-0137`, `model_id=cursor-grok-4.6-high`, `fresh_context_marker=po-US0137-discovery-20260913T101500Z-fresh`
- `evidence_ref=docs/product/backlog.md ## US-0137 discovery_notes; docs/product/acceptance.md US-0137 row (unchecked); handoffs/intake_evidence/US-0133-0148-intake-20260911.json; docs/engineering/state.md discovery checkpoint; handoffs/resume_brief.md`
- **Hot-surface note**: Appended (not prepended) so triad oldest-prefix rollover retains this newest section. `arch_linkage_guard.py --pre` exit 0 → `--rollover` `rollover_complete units=1,2` pack_state=`docs/engineering/state-archive/state-pack-20260913-aw.md` (archived `## Sprint-plan checkpoint — US-0136 / S0142 / auto-20260913-us0136 (role=tech-lead)`; archived_body_lines=78; preamble_lines=11; retained_body_lines=1185) pack_po=`handoffs/archive/po-to-tl-pack-20260913-e.md` (archived `## Architecture handoff — US-0134 Existing kernel bridge and compatibility handshake` + `## Intake handoff — BUG-0019 OpenCode `/auto` missing from slash list after plugin-only ownership`; archived_body_lines=52; retained_body_lines=634) → `--post` exit 0; architecture not rolled; final `--check` PASS.
- **Status**: US-0137 remains **OPEN**. **Next**: `/research` in fresh **tech-lead** subagent. Do not spawn research from this discovery chat. STOP.

