# State archive pack (2026-09-12)

- Rollover trigger: `STATE_HOT_MAX_LINES=1200, STATE_HOT_MAX_CHECKPOINTS=80`
- Source: `docs/engineering/state.md`
- Archived units (oldest first, contiguous prefix): 1
- Retained units in hot file: 17
- First archived heading: `## Research checkpoint — US-0133 / auto-20260912-us0133 (role=tech-lead)`
- Last archived heading: `## Research checkpoint — US-0133 / auto-20260912-us0133 (role=tech-lead)`
- Verification tuple (mandatory):
  - archived_body_lines=72
  - preamble_lines=11
  - retained_body_lines=1174

---

## Research checkpoint — US-0133 / auto-20260912-us0133 (role=tech-lead)

- phase_id=research
- role=tech-lead
- story_id=US-0133 (Status OPEN — not flipped DONE)
- bug_id=(none)
- sprint_id=none (pending /sprint-plan)
- orchestrator_run_id=auto-20260912-us0133
- parent_orchestrator_run_id=auto-20260912-bug0018
- delivery_mode=ultra_lean
- macro_phase=plan
- model_id=cursor-grok-4.6 (CROSS_MODEL_REVIEW=1 — required on isolation)
- fresh_context_marker=tl-US0133-research-20260912T110500Z-fresh
- timestamp=2026-09-12T11:05:00Z
- verdict=RESEARCH_PASS (DQ1–DQ10 LOCKED; decision_gate=false)
- research_anchor=docs/engineering/research.md ## R-0121 (do not wipe R-0120)
- winning_approach=A1 (in-tree standalone/ npm workspace + AgentKernel in packages/pi-kernel + IsolationResourceLoader + custom-tool-only)
- companion_dec=yes (DEC-0133 Required → Accepted in /architecture)
- backlog_status=OPEN (## US-0133 — research_notes appended; Status OPEN)
- acceptance_US-0133=unchecked (unchanged)
- sibling_boundary=US-0134..US-0148 OPEN out of scope; BUG-0018 DONE not reopened
- locked_dqs=DQ1–DQ10 (hosting standalone/; SDK createAgentSession/noTools/sessionId/abort; pin 0.85.1; minimal §30; empty DefaultResourceLoader overrides; audit event order; npm+Node22+Biome; no-network CI; import boundary; Phase 0 items 1/2/3/5 rubric)
- next_scheduled_phase=/architecture (fresh tech-lead)
- stop_condition=STOP after research PASS. Orchestrator spawns /architecture in fresh tech-lead subagent (BUG-0006). Do NOT spawn architecture from this research subagent. Do NOT mark US-0133 DONE. Do NOT tick acceptance.

### Isolation evidence (US-0048 / DEC-0029) — research US-0133

- phase_id=research
- role=tech-lead
- model_id=cursor-grok-4.6 (CROSS_MODEL_REVIEW=1 — required)
- fresh_context_marker=tl-US0133-research-20260912T110500Z-fresh (NEW per US-0048 / BUG-0006; not reused from po-US0133-discovery-20260912T105200Z-fresh or critic-US0133-discovery-20260912T110000Z-fresh)
- timestamp=2026-09-12T11:05:00Z (UTC)
- orchestrator_run_id=auto-20260912-us0133
- evidence_ref=docs/engineering/research.md ## R-0121; docs/product/backlog.md ## US-0133 research_notes; docs/product/acceptance.md US-0133 row; handoffs/po_to_tl.md Discovery+Research handoff US-0133; handoffs/resume_brief.md; docs/engineering/state.md (discovery+critic + this checkpoint)
- Fresh tech-lead subagent per BUG-0006 / US-0048 isolation; no prior chat history carried forward. Narrow-read only. No .env reads, no credentials, no intake JSON mutation, no /architecture spawn from this subagent, no Status DONE flip, no acceptance tick, no BUG-0018 reopen, no US-0134+ authoring.

### Strict runtime proof (DEC-0038) — research

- runtime_proof_id=rp-auto-20260912-us0133-research-techlead-20260912T110500Z-US-0133
- phase_id=research, role=tech-lead, story_id=US-0133, sprint_id=none
- proof_issued_at=2026-09-12T11:05:00Z
- proof_ttl_seconds=3600, proof_ttl=2026-09-12T12:05:00Z
- proof_hash=C2A48622B0322E60A0EBC335A60D0CF71911F97CDFC5C713C2CF2B6348B9AF3A
- Canonical payload (sorted-key compact JSON per DEC-0038, lowercase keys only): {"delivery_mode":"ultra_lean","macro_phase":"plan","model_id":"cursor-grok-4.6","orchestrator_run_id":"auto-20260912-us0133","phase_id":"research","proof_issued_at":"2026-09-12T11:05:00Z","proof_ttl_seconds":3600,"role":"tech-lead","runtime_proof_id":"rp-auto-20260912-us0133-research-techlead-20260912T110500Z-US-0133","sprint_id":"none","story_id":"US-0133"}
- hash_recompute_confirmation=true (Python hashlib SHA-256 of exact canonical payload → C2A48622B0322E60A0EBC335A60D0CF71911F97CDFC5C713C2CF2B6348B9AF3A)
- Producer discovery proof consumed: rp-auto-20260912-us0133-discovery-po-20260912T105500Z-US-0133 (436C5C331EFDD5FE94FA243CE94B38D5CED95E985367DCB29D72C544A532F334) — RUNTIME_PROOF_VALID at research issue (before ttl 2026-09-12T11:55:00Z)

### DQ1–DQ10 locks summary

| ID | Lock |
|----|------|
| DQ1 | In-tree `standalone/` npm workspace; not kit `its-magic` publish; KernelBridge locates kit as parent repo root |
| DQ2 | `createAgentSession` + `session.{prompt,steer,abort,dispose,sessionId,subscribe}`; `noTools`/`tools`/`customTools`; `resourceLoader` |
| DQ3 | Pin `@earendil-works/pi-coding-agent@0.85.1` + `@earendil-works/pi-ai@0.85.1`; Node `>=22.19.0` |
| DQ4 | apps/cli stub + real packages/pi-kernel + tests + CI/lint/types; no full §30 stub farm |
| DQ5 | Empty DefaultResourceLoader overrides + runtime-owned agentDir; `PI_COMPAT_RESOURCES=off` default |
| DQ6 | Audit min: agent_start → tool_execution_start/end → agent_end + abort idle |
| DQ7 | npm workspaces + Node 22 + TypeScript + Biome |
| DQ8 | No-network CI contract tests; optional PI_SPIKE_LIVE; Windows + Linux |
| DQ9 | noRestrictedImports + grep; Pi only inside packages/pi-kernel |
| DQ10 | Phase 0 items 1,2,3,5 rubric; no branding lock; no OS-sandbox claim |

### Triad hot-surface verification tuple (DEC-0054) — research US-0133

- surface=docs/engineering/state.md (isolation + research checkpoint append-bottom) + handoffs/po_to_tl.md (research handoff append-bottom)
- companion=docs/product/backlog.md ## US-0133 research_notes; handoffs/resume_brief.md (prepend); docs/engineering/research.md ## R-0121 (append; not a triad cap)
- pre_write: `--check` exit 0
- post_append: `--check` exit 1 STATE_ARCHIVE_REQUIRED (state 1250/1200 units=17/80; po_to_tl 685/650) → `arch_linkage_guard.py --pre` exit 0 → `enforce-triad-hot-surface.py --rollover` units=1,1 pack_state=`docs/engineering/state-archive/state-pack-20260912-v.md` (archived `## Sprint-plan checkpoint — BUG-0018`); pack_po=`handoffs/archive/po-to-tl-pack-20260912-c.md` (archived `## Discovery handoff — US-0131`) → `arch_linkage_guard.py --post` exit 0; final `--check` exit 0 (state retained_body_lines=1182; po_to_tl retained_body_lines=626)
- artifact_ordering: research.md append; backlog notes append; resume_brief.md prepend; state.md append-bottom (DEC-0040); po_to_tl.md append-bottom
- Active context surface preamble present
- pack_ref=docs/engineering/state-archive/state-pack-20260912-v.md; handoffs/archive/po-to-tl-pack-20260912-c.md

