# Architecture archive pack (2026-09-13)

- Rollover trigger: `ARCH_HOT_MAX_LINES=3000, ARCH_HOT_MAX_STORY_SECTIONS=120`
- Source: `docs/engineering/architecture.md`
- Archived units (oldest first, contiguous prefix): 1
- Retained units in hot file: 21
- First archived heading: `# US-0133 — Standalone repository and replaceable Pi kernel`
- Last archived heading: `# US-0133 — Standalone repository and replaceable Pi kernel`
- Verification tuple (mandatory):
  - archived_body_lines=132
  - preamble_lines=1
  - retained_body_lines=2997

---

# US-0133 — Standalone repository and replaceable Pi kernel

## Overview

**US-0133** bootstraps an in-tree TypeScript workspace and proves Pi sits behind an owned `AgentKernel`: custom-tool-only production sessions, default resource isolation, no Pi imports outside `packages/pi-kernel`. Kit npm `its-magic` stays installer/template. Phase 0 for this story is kernel items **1, 2, 3, 5** only. No OS-sandbox claim. No branding lock.

**Research anchor**: **R-0121** (DQ1–DQ10 LOCKED). **Companion DEC**: **DEC-0133** (Accepted — THIS phase). **EARLY_RESEARCH**: consumed from R-0121 + architecture-phase Context7 `/earendil-works/pi` confirm (`createAgentSession` accepts `model` / `modelRuntime` / `resourceLoader` / `noTools` / `customTools` — **no new R-id**).

**Fresh context marker**: `tl-US0133-architecture-20260912T111500Z-fresh`
**Orchestrator run id**: `auto-20260912-us0133`
**Timestamp**: 2026-09-12T11:15:00Z (UTC)
**Verdict**: PASS
**Next**: `/sprint-plan` (orchestrator-owned; CROSS_MODEL_REVIEW=1 critic of architecture first). Do **not** spawn sprint-plan from this subagent (BUG-0006).

## Approach locked (A1 — from R-0121)

| Option | Summary | Verdict |
|--------|---------|---------|
| **A1** | In-tree `standalone/` npm workspaces; real `packages/pi-kernel` AgentKernel; empty `DefaultResourceLoader` overrides; `noTools: "builtin"` + owned `tools` allowlist; pin 0.85.1; Node `>=22.19.0`; npm + Biome + tsc; no-network CI | **Preferred / LOCKED** — AC-1..AC-6 |
| A2 | New git repo now | **Rejected** — Phase 0 overhead; KernelBridge locate harder |
| A3 | Fold Pi into kit `its-magic` `files` | **Rejected** — D1 |
| A4 | DefaultResourceLoader + Pi project-trust only | **Rejected** — `AGENTS.md` still loads |
| A5 | `noTools: "builtin"` without empty loader | **Rejected** — extension tools remain |

### Locked surfaces (DEC-0133)

1. **Hosting**: `standalone/` independent npm workspaces root. Not kit `workspaces`. Kit `files` omits `standalone/` (guard + test). Unpublished `private: true` code name; do not reuse `its-magic`.
2. **Inventory**: `apps/cli` stub + real `packages/pi-kernel` + `tests/{unit,contract}` + CI/lint/types. No §30 stub farm.
3. **AgentKernel**: `createSession` / `run` / `steer` / `abort` / `dispose` / `getRuntimeInfo` + `subscribe`. Map to `createAgentSession` / `session.{prompt,steer,abort,dispose,sessionId,subscribe}` inside `pi-kernel` only.
4. **Isolation**: empty DefaultResourceLoader overrides + runtime-owned `agentDir`; `PI_COMPAT_RESOURCES=off` default; `trusted` flag recorded but US-0133 factory still uses empty loader (US-0137 owns trusted resource enablement).
5. **Tools**: `noTools: "builtin"` + `itsm_ping` only + `tools` allowlist includes that name. ToolBroker = US-0137.
6. **Fake-model**: inject no-network `Model` into `createAgentSession`. Fallback: event-bridge unit + registry/abort; `PI_SPIKE_LIVE` optional not required for GO.
7. **Pins**: `@earendil-works/pi-coding-agent@0.85.1` + `@earendil-works/pi-ai@0.85.1`. Node `>=22.19.0`.
8. **Tests + spike**: 10 `test_us0133_*`; evidence `standalone/docs/phase0-kernel-spike.md`; items 1/2/3/5 only.

### Critic NB closures (research us0133rsc-* — informational)

| NB | Closure |
|----|---------|
| NB1 R2 loader leak / R3 fake-model / builtin-only insufficient | LOCKED §5/§6 — empty loader required in production factory; plant `.pi/extensions`+`AGENTS.md` fixture (T-004/T-007); fake `model` seam (T-007 m9) |
| NB2 `# US-0133` + DEC-0133 + AgentKernel; execute owns bootstrap; US-0134/0137 out | LOCKED this H1 + DEC-0133; KernelBridge/ToolBroker not designed |
| NB3 no sprint-plan spawn; Phase 0 subset; no DONE; R-0120 intact | Held — T-anch; items 1/2/3/5 only; Status OPEN |

## Components

### Workspace + publish guard (AC-1)

- `standalone/package.json` workspaces, scripts, `engines.node >=22.19.0`, `private: true`
- Kit `package.json` `files` unchanged except fail-closed omit-guard
- `apps/cli` stub bin (code-name `itsm`) — no workflow

### AgentKernel (AC-2)

- Types in DEC-0133 §4
- Import boundary: Biome `noRestrictedImports` + grep

### Production factory (AC-3, AC-4)

- `noTools: "builtin"` + `customTools: [itsm_ping]` + `tools: ["itsm_ping"]`
- Isolation loader (DEC-0133 §5)
- Abort → idle; no further `tool_execution_start`

### Contract tests (AC-5)

Ten markers (DEC-0133 §8). Kernel tests: `standalone/tests/contract` (`node:test`). Kit pytest `tests/us0133_contract_test.py` at least for files-omit + import-boundary grep. No live provider. Matrix Windows + Linux.

### Spike evidence (AC-6)

`standalone/docs/phase0-kernel-spike.md` — exact versions + GO/NO-GO for items 1/2/3/5. No branding lock. No OS-sandbox claim.

## Companion DEC = DEC-0133 (Required → Accepted)

Authored Accepted in THIS phase at `decisions/DEC-0133.md`. Locks A1, hosting, AgentKernel interface, isolation defaults, fake-model seam, pins, markers, spike path.

## Risks finalized (R1–R6 from R-0121)

- **R1 (MEDIUM)** SDK churn 0.85→0.86 → exact pin + spike evidence
- **R2 (MEDIUM)** `AGENTS.md` / `~/.pi/agent` leak if loader omitted → production factory requires loader; planted-fixture test
- **R3 (MEDIUM)** fake-model seam missing → primary inject `model`; fallback documented
- **R4 (LOW)** OS-sandbox claim → D8; docs cite pi.dev/security
- **R5 (LOW)** branding lock → unpublished name; AC-6 evidence
- **R6 (LOW)** later `files` whitelist drift → T-001 guard

## Compose, do not amend (verified)

| Story / DEC | Surface | Verification |
|-------------|---------|--------------|
| Kit npm `its-magic` / DEC-0120 | `files` whitelist | ✓ omit `standalone/`; no Pi in tarball |
| US-0134 KernelBridge | locate path | ✓ documented parent walk only; not implemented |
| US-0137 ToolBroker | policy/tools | ✓ `itsm_ping` placeholder only |
| US-0135..US-0148 | later capabilities | ✓ OUT OF SCOPE |
| BUG-0018 / R-0120 | OpenCode `/auto` | ✓ DONE; not reopened; R-0120 not wiped |

## Sprint seeds (10 tasks within SPRINT_MAX_TASKS=12 — for `/sprint-plan` refinement)

- **T-anch** (`# US-0133` H1 + DEC-0133 Accepted — RESOLVED in THIS phase; NO-OP / verification)
- **T-001** (AC-1 — `standalone/` workspace + kit `files` omit-guard)
- **T-002** (AC-1/AC-6 — pin `@earendil-works/pi-coding-agent@0.85.1` + `@earendil-works/pi-ai@0.85.1`)
- **T-003** (AC-2 — AgentKernel mapping + owned types)
- **T-004** (AC-4 — isolation loader + `PI_COMPAT_RESOURCES=off`)
- **T-005** (AC-3 — custom-tool factory `itsm_ping` + `noTools: "builtin"`)
- **T-006** (AC-2 — import-boundary lint + grep)
- **T-007** (AC-5 — 10 `test_us0133_*` incl. planted-extension fixture + fake-model event order)
- **T-008** (AC-1 — CI Windows/Linux `working-directory: standalone`; do not fold into kit TEST_COMMAND)
- **T-009** (AC-6 — `standalone/docs/phase0-kernel-spike.md` go/no-go)

Execution order: T-anch → T-001 → T-002 → T-003 → T-004 → T-005 → T-006 → T-007 → T-008 → T-009 (acyclic). No split (`SPRINT_AUTO_SPLIT` not triggered). Not `/quick`.

## Isolation evidence (US-0048 / DEC-0029)

- `phase_id=architecture`, `role=tech-lead`, `story_id=US-0133`, `sprint_id=none` (pending — sprint-plan owns folder), `orchestrator_run_id=auto-20260912-us0133`
- `delivery_mode=ultra_lean`, `macro_phase=plan` (architecture — second canonical phase of `plan` macro)
- `model_id=cursor-grok-4.6` (CROSS_MODEL_REVIEW=1 — required on isolation)
- `fresh_context_marker=tl-US0133-architecture-20260912T111500Z-fresh`, `timestamp=2026-09-12T11:15:00Z` (UTC)
- `evidence_ref=docs/engineering/research.md ## R-0121; docs/product/backlog.md ## US-0133; docs/product/acceptance.md US-0133 row; docs/engineering/architecture.md (this # US-0133); decisions/DEC-0133.md; handoffs/resume_brief.md; handoffs/po_to_tl.md Research handoff US-0133; Context7 /earendil-works/pi`
- Fresh tech-lead subagent per BUG-0006 / US-0048; no prior chat history. Narrow-read only. No `.env` reads. Status remains OPEN. BUG-0018 DONE not reopened. No US-0134+ authoring. No `/sprint-plan` spawn from this subagent.
- Prior phase strict proof consumed: `rp-auto-20260912-us0133-research-techlead-20260912T110500Z-US-0133` / `C2A48622B0322E60A0EBC335A60D0CF71911F97CDFC5C713C2CF2B6348B9AF3A` — RUNTIME_PROOF_VALID (MATCH before TTL 2026-09-12T12:05:00Z). Critic findings us0133rsc-* informational only.

## Strict runtime proof (mirror)

- `runtime_proof_id=rp-auto-20260912-us0133-architecture-techlead-20260912T111500Z-US-0133`
- Canonical payload (sorted-key compact JSON per DEC-0038, lowercase keys): `{"delivery_mode":"ultra_lean","macro_phase":"plan","model_id":"cursor-grok-4.6","orchestrator_run_id":"auto-20260912-us0133","phase_id":"architecture","proof_issued_at":"2026-09-12T11:15:00Z","proof_ttl_seconds":3600,"role":"tech-lead","runtime_proof_id":"rp-auto-20260912-us0133-architecture-techlead-20260912T111500Z-US-0133","sprint_id":"none","story_id":"US-0133"}`
- `proof_hash=825C6B9EDE5BDC0BFE3911BFA93B3A6AFE2E14BFE2523F4528B07B121897A5B7` (SHA-256)
- `proof_ttl_seconds=3600`, `proof_ttl=2026-09-12T12:15:00Z` (UTC)

## Decision gate + next scheduled phase

- `decision_gate=false` (no blocking unknown; DQ1–DQ10 LOCKED; DEC-0133 Accepted; approach A1 locked; critic NBs closed)
- `next_scheduled_phase=/sprint-plan` (role=tech-lead; third canonical phase of `plan` macro)
- `next_scheduled_role=tech-lead`
- `stop_condition=STOP after architecture completes; hand off via artifacts only to /sprint-plan in fresh tech-lead subagent (BUG-0006). Do NOT spawn /sprint-plan from this subagent. Do NOT mark US-0133 DONE. Do NOT tick acceptance. Do NOT reopen BUG-0018. Do NOT design US-0134+.`

