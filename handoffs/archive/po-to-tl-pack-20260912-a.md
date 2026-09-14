# PO to TL archive pack (2026-09-12)

- Rollover trigger: `PO_TO_TL_HOT_MAX_LINES=650, PO_TO_TL_HOT_MAX_SECTIONS=60`
- Source: `handoffs/po_to_tl.md`
- Archived units (oldest first, contiguous prefix): 1
- Retained units in hot file: 15
- First archived heading: `## Discovery handoff — US-0133 Standalone repository and replaceable Pi kernel`
- Last archived heading: `## Discovery handoff — US-0133 Standalone repository and replaceable Pi kernel`
- Verification tuple (mandatory):
  - archived_body_lines=60
  - retained_body_lines=618

---

## Discovery handoff — US-0133 Standalone repository and replaceable Pi kernel

- **Phase completed**: discovery. **Role**: po. **Story**: US-0133 only. **Sprint**: (pending). **Verdict**: PASS (`decision_gate=false`).
- **Timestamp (UTC)**: 2026-09-12T10:55:00Z. **Fresh marker**: `po-US0133-discovery-20260912T105200Z-fresh`.
- **Orchestrator**: `orchestrator_run_id=auto-20260912-us0133`, parent=`auto-20260912-bug0018`, `delivery_mode=ultra_lean`, macro=`spec` (intake already DONE — not re-intaken).
- **Sibling boundary**: **US-0134..US-0148** OPEN — OUT OF SCOPE this segment. **BUG-0018** DONE — do not reopen.
- **Gap confirmed (narrow-read)**: kit npm package `its-magic` is installer/template, not a TS agent workspace. Masterplan requires Pi behind `AgentKernel` with custom-tool-only sessions and default Pi-resource isolation. Phase 0's ten-item go/no-go is **not** this story's full bar.

### Discovery locks D1–D10

| ID | Lock |
|----|------|
| **D1** | Standalone TypeScript workspace is a **separate tree** from the published kit npm package (`package.json` name `its-magic`, `files`=template/installer). Do not fold Pi packages into kit publish `files`. Hosting choice (new git repo vs committed in-tree path such as `standalone/`) → DQ1. |
| **D2** | Planned structure follows masterplan §30: at least `apps/cli` stub, real `packages/pi-kernel`, `tests/{unit,contract}`, plus CI, format, lint, and typecheck (AC-1). Other §30 packages may be stub `package.json` only — no workflow, auth, policy, or browser implementation. |
| **D3** | `AgentKernel` matches §7: `createSession`, `run`, `steer`, `abort`, `dispose`, `getRuntimeInfo`. **No Pi imports outside `packages/pi-kernel` (R1)**. Workflow code must not know `AgentSession`, `ModelRuntime`, Pi resource paths, or Pi events. |
| **D4** | Production sessions disable Pi built-ins (`noTools: "builtin"` or current SDK equivalent) and expose only owned custom tools (AC-3 / R2). Spike may register one placeholder `itsm_*` tool. Full ToolBroker/policy catalog = **US-0137**. |
| **D5** | Default resource isolation per §8: do not auto-load project `.pi/extensions`, arbitrary Pi packages, prompt templates, or treat project `AGENTS.md` as enforcement. `PI_COMPAT_RESOURCES=off` default; `trusted` is an explicit flag only. Even trusted: no third-party mutation tools outside an allowlist (enforcement engine still US-0137). |
| **D6** | Contract tests (AC-5) cover the §35 **Agent/kernel** subset only: fresh SDK session, stable session id for attestation, custom-tool-only execution, audit-required event ordering, abort, no project-local extension auto-execution. |
| **D7** | Phase 0 spike go/no-go for this story is the **kernel subset** of §32 Phase 0 items **1, 2, 3, 5** (bootstrap, pin Pi SDK, adapter + one fresh session, one custom tool with built-ins disabled). Items **4, 6–10** belong to later stories. Record exact `@earendil-works/pi-coding-agent` + `pi-ai` versions. Working names `its-magic-agent` / `itsm` are code names only — **do not lock public branding** (AC-6). |
| **D8** | Pi has **no built-in sandbox**. US-0133 must not claim OS isolation from in-process adapter checks. OS/container isolation is US-0141; semantic authorization is US-0137. |
| **D9** | Out of scope: US-0134 KernelBridge/validators; US-0135 Codex OAuth / providers / model routing; US-0136 SessionSupervisor / RoleCatalog / PO↔DEV isolation proof; US-0137 ToolBroker / PolicyEngine / path denial; US-0138 typed config; US-0140 lifecycle orchestration. Do not reopen BUG-0018. |
| **D10** | Research questions DQ1–DQ10 below → `/research` authors **R-0121** (next after R-0120; do not wipe). |

### Research questions DQ1–DQ10 (for `/research` → expect **R-0121**)

1. **DQ1**: Workspace hosting — new git repo vs in-tree path; how to avoid kit npm-publish collision; how US-0134 will locate this kit as kernel.
2. **DQ2**: Current Pi SDK surface (cite https://pi.dev/docs/latest/sdk and GitHub `earendil-works/pi`): `createAgentSession`, built-in disable, abort, session id, resource-load controls.
3. **DQ3**: Exact npm package names and versions to pin (`@earendil-works/pi-coding-agent`, `pi-ai`, transitive peers).
4. **DQ4**: Minimal vs full §30 stub inventory required to satisfy AC-1 without implementing later stories.
5. **DQ5**: Mechanism to disable project-local Pi resource auto-load (SDK flag vs cwd jail vs env).
6. **DQ6**: Minimal audit event-order contract for AC-5 (which event types, which sequence).
7. **DQ7**: Tooling: npm vs pnpm vs bun; Node version; formatter/linter (prettier/eslint/biome).
8. **DQ8**: Contract-test strategy — mock vs live SDK; Windows + Linux; no credentials in CI.
9. **DQ9**: Import-boundary enforcement (eslint `no-restricted-imports`, dependency-cruiser, or grep) so Pi stays inside `packages/pi-kernel`.
10. **DQ10**: Spike go/no-go rubric and evidence path for kernel-subset Phase 0 without locking product branding.

### Design refs

- `docs/product/standalone-its-magic-pi-masterplan.md` sections 4, 7, 8, 30, 32 Phase 0, 35
- https://pi.dev/docs/latest/sdk
- https://pi.dev/docs/latest/extensions
- https://pi.dev/docs/latest/security
- https://github.com/earendil-works/pi
- Intake (read-only): `handoffs/intake_evidence/US-0133-0148-intake-20260911.json`

### Runtime proof (DEC-0038)

- `runtime_proof_id=rp-auto-20260912-us0133-discovery-po-20260912T105500Z-US-0133`
- `proof_hash=436C5C331EFDD5FE94FA243CE94B38D5CED95E985367DCB29D72C544A532F334`
- `proof_ttl=2026-09-12T11:55:00Z`
- Canonical payload: `{"delivery_mode":"ultra_lean","macro_phase":"spec","model_id":"cursor-grok-4.6","orchestrator_run_id":"auto-20260912-us0133","phase_id":"discovery","proof_issued_at":"2026-09-12T10:55:00Z","proof_ttl_seconds":3600,"role":"po","runtime_proof_id":"rp-auto-20260912-us0133-discovery-po-20260912T105500Z-US-0133","sprint_id":"none","story_id":"US-0133"}`

### Isolation + stop

- `phase_id=discovery`, `role=po`, `story_id=US-0133`, `model_id=cursor-grok-4.6`, `fresh_context_marker=po-US0133-discovery-20260912T105200Z-fresh`
- `evidence_ref=docs/product/backlog.md ## US-0133 discovery_notes; docs/product/acceptance.md US-0133 row (unchecked); handoffs/intake_evidence/US-0133-0148-intake-20260911.json; docs/engineering/state.md discovery checkpoint; handoffs/resume_brief.md`
- **Status**: US-0133 remains **OPEN**. **Next**: `/research` in fresh **tech-lead** subagent. Do not spawn research from this discovery chat. STOP.

---

