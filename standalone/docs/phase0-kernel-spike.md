# Phase 0 kernel spike — US-0133 (items 1, 2, 3, 5)

**workspace**: `standalone/` (unpublished code name `@its-magic/standalone`; bin `itsm`)  
**date**: 2026-09-12  
**story**: US-0133  
**approach**: A1 (DEC-0133 Accepted)  
**node**: `>=22.19.0`

## Exact installed versions

| Package | Declared pin | Installed |
|---|---|---|
| `@earendil-works/pi-coding-agent` | `0.85.1` | `0.85.1` |
| `@earendil-works/pi-ai` | `0.85.1` | `0.85.1` |

Recorded from `standalone/packages/pi-kernel/package.json` + `standalone/package-lock.json` after `npm install`.

## Fake-model seam

**Primary shipped**: inject a no-network `Model` plus duck-typed `ModelRuntime.streamSimple` into `createAgentSession`. Default CI uses this seam. No credentials. No live provider. Optional `PI_SPIKE_LIVE=1` is **not** required for GO.

Fallback (owned event-bridge unit tests in `standalone/tests/unit/event-bridge.test.ts`) remains as a second proof of AC-5 order (`agent_start` → `tool_execution_start` → `tool_execution_end` → `agent_end`).

## Go / no-go (kernel subset of §32 Phase 0)

| Item | Result | Evidence |
|---|---|---|
| 1 Bootstrap | **GO** | `standalone/` npm workspaces; `apps/cli` stub; `packages/pi-kernel`; `tests/{unit,contract}`; scripts typecheck/lint/format/test; kit `files` omit `standalone/` |
| 2 Pin | **GO** | exact `@earendil-works/pi-coding-agent@0.85.1` and `@earendil-works/pi-ai@0.85.1` |
| 3 Adapter + one fresh session | **GO** | `AgentKernel.createSession` returns stable `sessionId`; Pi imports only inside `packages/pi-kernel` |
| 5 Custom tool, built-ins off | **GO** | `noTools: "builtin"` + `customTools: [itsm_ping]` + `tools: ["itsm_ping"]`; abort → idle |

**Overall: GO** (all four items pass contract tests).

Items 4, 6–10 stay later stories (US-0134+). No KernelBridge. No ToolBroker catalog.

## Branding

Working names `@its-magic/standalone` / `itsm` are unpublished code names. **No branding lock.** Do not reuse npm name `its-magic`.

## Isolation / security

Production factory uses an empty `DefaultResourceLoader` (overrides yield empty; runtime-owned `agentDir`; `PI_COMPAT_RESOURCES=off` default). `trusted` is recorded but US-0133 still uses the empty loader.

**No OS-sandbox claim.** Pi has no built-in sandbox; see https://pi.dev/security.
