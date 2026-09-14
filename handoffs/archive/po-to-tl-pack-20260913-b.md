# PO to TL archive pack (2026-09-13)

- Rollover trigger: `PO_TO_TL_HOT_MAX_LINES=650, PO_TO_TL_HOT_MAX_SECTIONS=60`
- Source: `handoffs/po_to_tl.md`
- Archived units (oldest first, contiguous prefix): 2
- Retained units in hot file: 15
- First archived heading: `## Research handoff — US-0133 Standalone repository and replaceable Pi kernel`
- Last archived heading: `## Architecture handoff — US-0133 Standalone repository and replaceable Pi kernel`
- Verification tuple (mandatory):
  - archived_body_lines=78
  - retained_body_lines=635

---

## Research handoff — US-0133 Standalone repository and replaceable Pi kernel

- **Phase completed**: research. **Role**: tech-lead. **Story**: US-0133 only. **Sprint**: (pending). **Verdict**: PASS (`decision_gate=false`).
- **Timestamp (UTC)**: 2026-09-12T11:05:00Z. **Fresh marker**: `tl-US0133-research-20260912T110500Z-fresh`.
- **Orchestrator**: `orchestrator_run_id=auto-20260912-us0133`, parent=`auto-20260912-bug0018`, `delivery_mode=ultra_lean`, macro=`plan` (research = first of research+architecture+sprint-plan).
- **Sibling boundary**: **US-0134..US-0148** OPEN — OUT OF SCOPE. **BUG-0018** DONE — do not reopen.
- **Research anchor**: `docs/engineering/research.md` **`## R-0121`** (DQ1–DQ10 LOCKED). Discovery D1–D10 not rewritten. Do not wipe R-0120.
- **Approach**: **A1** recommended. Reject A2 (new git repo), A3 (fold into kit npm), A4 (project-trust only), A5 (`noTools: "builtin"` without empty resource loader).
- **Companion DEC**: **DEC-0133** Required → Accepted in `/architecture`.

### Closed questions DQ1–DQ10

| DQ | Topic | Resolution | LOCK |
|----|-------|------------|------|
| DQ1 | Hosting | In-tree `standalone/` npm workspace; not kit `its-magic` `files`; KernelBridge locates kit as parent repo root | LOCKED |
| DQ2 | Pi SDK | `createAgentSession`; `session.{prompt,steer,abort,dispose,sessionId,subscribe}`; `noTools`/`tools`/`customTools`; `resourceLoader` | LOCKED |
| DQ3 | Pins | `@earendil-works/pi-coding-agent@0.85.1` + `@earendil-works/pi-ai@0.85.1`; Node `>=22.19.0` | LOCKED |
| DQ4 | §30 inventory | apps/cli stub + real `packages/pi-kernel` + tests + CI/lint/types; no full stub farm | LOCKED |
| DQ5 | Resource isolation | Empty `DefaultResourceLoader` overrides + runtime-owned agentDir; `PI_COMPAT_RESOURCES=off` default | LOCKED |
| DQ6 | Audit events | `agent_start` → `tool_execution_start/end` → `agent_end` + abort idle | LOCKED |
| DQ7 | Tooling | npm workspaces + Node 22 + TypeScript + Biome | LOCKED |
| DQ8 | Tests | No-network CI contract tests; optional `PI_SPIKE_LIVE`; Windows + Linux | LOCKED |
| DQ9 | Import boundary | noRestrictedImports + grep; Pi only inside `packages/pi-kernel` | LOCKED |
| DQ10 | Spike rubric | Phase 0 items **1,2,3,5** only; no branding lock; no OS-sandbox claim | LOCKED |

### Architecture seeds

- Author `# US-0133` + **DEC-0133** (Accepted).
- Seeds T-anch + T-001..T-009 (10 ≤ SPRINT_MAX_TASKS=12).
- Do not expand US-0134+ ACs. Do not implement ToolBroker (US-0137).

### Runtime proof (DEC-0038)

- `runtime_proof_id=rp-auto-20260912-us0133-research-techlead-20260912T110500Z-US-0133`
- `proof_hash=C2A48622B0322E60A0EBC335A60D0CF71911F97CDFC5C713C2CF2B6348B9AF3A`
- `proof_ttl=2026-09-12T12:05:00Z`
- Canonical payload: `{"delivery_mode":"ultra_lean","macro_phase":"plan","model_id":"cursor-grok-4.6","orchestrator_run_id":"auto-20260912-us0133","phase_id":"research","proof_issued_at":"2026-09-12T11:05:00Z","proof_ttl_seconds":3600,"role":"tech-lead","runtime_proof_id":"rp-auto-20260912-us0133-research-techlead-20260912T110500Z-US-0133","sprint_id":"none","story_id":"US-0133"}`
- Consumed discovery proof: `rp-auto-20260912-us0133-discovery-po-20260912T105500Z-US-0133` / `436C5C331EFDD5FE94FA243CE94B38D5CED95E985367DCB29D72C544A532F334` — RUNTIME_PROOF_VALID (MATCH before TTL)

### Isolation + stop

- `phase_id=research`, `role=tech-lead`, `story_id=US-0133`, `model_id=cursor-grok-4.6`, `fresh_context_marker=tl-US0133-research-20260912T110500Z-fresh`
- `evidence_ref=docs/engineering/research.md ## R-0121; docs/product/backlog.md ## US-0133 research_notes; docs/engineering/state.md research checkpoint; handoffs/resume_brief.md`
- **Hot-surface note**: Appended (not prepended) so triad oldest-prefix rollover retains this newest section.
- **Status**: US-0133 remains **OPEN**. **Next**: `/architecture` in fresh **tech-lead** subagent. Do not spawn architecture from this research chat. STOP.

---

## Architecture handoff — US-0133 Standalone repository and replaceable Pi kernel

- **Phase completed**: architecture. **Role**: tech-lead. **Story**: US-0133 only. **Sprint**: (pending). **Verdict**: PASS (`decision_gate=false`).
- **Timestamp (UTC)**: 2026-09-12T11:15:00Z. **Fresh marker**: `tl-US0133-architecture-20260912T111500Z-fresh`.
- **Orchestrator**: `orchestrator_run_id=auto-20260912-us0133`, parent=`auto-20260912-bug0018`, `delivery_mode=ultra_lean`, macro=`plan` (architecture = second of research+architecture+sprint-plan).
- **Sibling boundary**: **US-0134..US-0148** OPEN — OUT OF SCOPE. **BUG-0018** DONE — do not reopen.
- **Architecture anchor**: `docs/engineering/architecture.md` **`# US-0133`**
- **Companion DEC**: `decisions/DEC-0133.md` (**Accepted**)
- **Research anchor**: `docs/engineering/research.md` **`## R-0121`** (DQ1–DQ10 LOCKED)

### Approach A1 LOCKED

In-tree `standalone/` npm workspaces (not kit `its-magic` publish). Real `packages/pi-kernel` AgentKernel. Empty DefaultResourceLoader overrides + `noTools: "builtin"` + owned `itsm_ping` allowlist. Pin `@earendil-works/pi-coding-agent@0.85.1` + `@earendil-works/pi-ai@0.85.1`. Phase 0 items **1, 2, 3, 5** only. No OS-sandbox claim. No branding lock. Fake-model seam = inject no-network `Model`. Seeds **T-anch + T-001..T-009** (10 ≤ SPRINT_MAX_TASKS=12).

### Runtime proof (DEC-0038)

- `runtime_proof_id=rp-auto-20260912-us0133-architecture-techlead-20260912T111500Z-US-0133`
- `proof_hash=825C6B9EDE5BDC0BFE3911BFA93B3A6AFE2E14BFE2523F4528B07B121897A5B7`
- `proof_ttl=2026-09-12T12:15:00Z`
- Canonical payload: `{"delivery_mode":"ultra_lean","macro_phase":"plan","model_id":"cursor-grok-4.6","orchestrator_run_id":"auto-20260912-us0133","phase_id":"architecture","proof_issued_at":"2026-09-12T11:15:00Z","proof_ttl_seconds":3600,"role":"tech-lead","runtime_proof_id":"rp-auto-20260912-us0133-architecture-techlead-20260912T111500Z-US-0133","sprint_id":"none","story_id":"US-0133"}`
- Consumed research proof: `rp-auto-20260912-us0133-research-techlead-20260912T110500Z-US-0133` / `C2A48622B0322E60A0EBC335A60D0CF71911F97CDFC5C713C2CF2B6348B9AF3A` — RUNTIME_PROOF_VALID (MATCH before TTL)

### Isolation + stop

- `phase_id=architecture`, `role=tech-lead`, `story_id=US-0133`, `model_id=cursor-grok-4.6`, `fresh_context_marker=tl-US0133-architecture-20260912T111500Z-fresh`
- **Hot-surface note**: Appended (not prepended) so triad oldest-prefix rollover retains this newest section.
- **Status**: US-0133 remains **OPEN**. **Next**: `/sprint-plan` in fresh **tech-lead** subagent (orchestrator may insert sovereign-critic of architecture first). Do not spawn sprint-plan from this architecture chat. STOP.

---

