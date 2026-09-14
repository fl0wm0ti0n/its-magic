# PO to TL archive pack (2026-09-13)

- Rollover trigger: `PO_TO_TL_HOT_MAX_LINES=650, PO_TO_TL_HOT_MAX_SECTIONS=60`
- Source: `handoffs/po_to_tl.md`
- Archived units (oldest first, contiguous prefix): 1
- Retained units in hot file: 14
- First archived heading: `## Research handoff — US-0136 Fresh role sessions and runtime attestation`
- Last archived heading: `## Research handoff — US-0136 Fresh role sessions and runtime attestation`
- Verification tuple (mandatory):
  - archived_body_lines=50
  - retained_body_lines=641

---

## Research handoff — US-0136 Fresh role sessions and runtime attestation

- **Phase completed**: research. **Role**: tech-lead. **Story**: US-0136 only. **Sprint**: (pending). **Verdict**: PASS (`decision_gate=false`).
- **Timestamp (UTC)**: 2026-09-13T07:15:00Z. **Fresh marker**: `tl-US0136-research-20260913T071500Z-fresh`.
- **Orchestrator**: `orchestrator_run_id=auto-20260913-us0136`, parent=`auto-20260913-us0135`, `delivery_mode=ultra_lean`, macro=`plan` (research = first of research+architecture+sprint-plan), `model_id=cursor-grok-4.6-high`, CROSS_MODEL_REVIEW=1, AUTO_QUIET=1, EARLY_RESEARCH=1.
- **Sibling boundary**: **US-0137..US-0148** OPEN — OUT OF SCOPE this segment. **US-0133** / **US-0134** / **US-0135** DONE — compose only; do not reopen. **BUG-0020** DONE — do not reopen.
- **Research anchor**: `docs/engineering/research.md` **`## R-0128`** (DQ1–DQ10 LOCKED). Discovery D1–D10 not rewritten. Do not wipe R-0120..R-0127.
- **Approach**: **A1 (A\*)** recommended. Reject A2 (`runtime-core` fold), A3 (Pi imports in `role-runtime`), A4 (persist jsonl + `continueRecent`/`fork`), A5 (orchestrator Pi session), A6 (extend `compute_strict_proof_hash`), A7 (SQLite this story), A8 (amend isolation/`noTools`/KernelBridge/auth-models), A9 (paid CI).
- **Companion DEC**: **DEC-0136** Required → Accepted in `/architecture`. Do **not** create `decisions/DEC-0136.md` this phase.

### Closed questions DQ1–DQ10

| DQ | Topic | Resolution | LOCK |
|----|-------|------------|------|
| DQ1 | Supervisor + package | `standalone/packages/role-runtime` (no Pi); inject `AgentKernel.createSession`; inMemory + DEC-0133 `agentDir`; not `runtime-core` | LOCKED |
| DQ2 | Continuation | Same-phase `run`/`steer` only (versioned contract); execute#N/QA#N/crash/fork/`continueRecent`/`newSession({ parentSession })` deny → `SESSION_CONTINUATION_DENIED` | LOCKED |
| DQ3 | RoleCatalog | DEC-0051 matrix + `AUTO_ROLE_*`; §10.1 roles; bounded US-0106 keys; unknown phase/role fail-closed | LOCKED |
| DQ4 | Attestation hash | spawn/start/end sidecar; `kernel_session_id`=`session.sessionId`; process UUID+pid; stub context/policy hashes; **do not** extend `compute_strict_proof_hash` | LOCKED |
| DQ5 | Sidecar persist | In-memory + gitignored runtime JSON; repo lifecycle unamended; Python ignores unknown keys; SQLite deferred | LOCKED |
| DQ6 | Reason codes | Reuse `PHASE_ROLE_MISMATCH` / `RUNTIME_PROOF_*` / `PHASE_CONTEXT_ISOLATION_VIOLATION` / `AUTO_ORCHESTRATOR_PHASE_EXECUTION`; add `SESSION_*` / `ATTESTATION_*` | LOCKED |
| DQ7 | Orchestrator | Pure TypeScript scheduler; no mutation tools at spawn; reject orchestrator Pi+`itsm_ping` | LOCKED |
| DQ8 | Critic sessions | Fresh SessionSupervisor spawn; `parent_phase_session_id`; US-0144 content out; DEC-0135 critic pin / `CROSS_MODEL_DEGRADED_MODE` | LOCKED |
| DQ9 | Crash + dispose | Discard orphans (`abort`+`dispose`); no transcript restore; US-0140 owns next-phase reconstruct | LOCKED |
| DQ10 | Tests | 10 `test_us0136_*` Win+Linux fake-model: PO≠DEV, execute/QA, critic, crash, dispose, reuse, mismatch, carry-over, attestation, orchestrator deny+no-Pi | LOCKED |

### Architecture seeds

- Author `# US-0136` + **DEC-0136** (Accepted).
- Seeds T-anch + T-001..T-010 (11 ≤ SPRINT_MAX_TASKS=12).
- Do not expand US-0137+ ACs. Do not amend isolation loader / `noTools` / KernelBridge / auth-models. Do not implement ToolBroker.

### Runtime proof (DEC-0038)

- `runtime_proof_id=rp-auto-20260913-us0136-research-techlead-20260913T071500Z-US-0136`
- `proof_hash=42D5C250BDF6562EE383668E2FE8080568D1164A184B48FB82BF11982E5D56F6`
- `proof_ttl=2026-09-13T08:15:00Z`
- Hash via `from scripts.token_cost_lib import compute_strict_proof_hash` (positional; compact sorted-key JSON).
- Canonical hashed payload: `{"orchestrator_run_id":"auto-20260913-us0136","phase_id":"research","proof_issued_at":"2026-09-13T07:15:00Z","proof_ttl_seconds":3600,"role":"tech-lead","runtime_proof_id":"rp-auto-20260913-us0136-research-techlead-20260913T071500Z-US-0136"}`
- Isolation extras (not hashed): `delivery_mode=ultra_lean`, `macro_phase=plan`, `model_id=cursor-grok-4.6-high`, `sprint_id=none`, `story_id=US-0136`
- `hash_recompute_confirmation=true` (compute_strict_proof_hash → 42D5C250BDF6562EE383668E2FE8080568D1164A184B48FB82BF11982E5D56F6)
- Consumed discovery proof: `rp-auto-20260913-us0136-discovery-po-20260913T065500Z-US-0136` / `335B7AFFF3EAEEBCE096684A91D7B1F273962BC1A6E1F0F4A1EA7DB47F7263DE` — RUNTIME_PROOF_VALID (MATCH before TTL `2026-09-13T07:55:00Z`; consumed_at `2026-09-13T07:15:00Z`; independent recompute MATCH)
- Consumed critic proof: `rp-auto-20260913-us0136-sovereign-critic-techlead-20260913T070500Z-US-0136` / `D9C65F4503D923737D009DF4EEB5383C8A57374A55EA8D01413ECB3C36087C1A` — RUNTIME_PROOF_VALID (MATCH before TTL `2026-09-13T08:05:00Z`)

### Isolation + stop

- `phase_id=research`, `role=tech-lead`, `story_id=US-0136`, `model_id=cursor-grok-4.6-high`, `fresh_context_marker=tl-US0136-research-20260913T071500Z-fresh`
- `evidence_ref=docs/engineering/research.md ## R-0128; docs/product/backlog.md ## US-0136 research_notes; docs/engineering/state.md research checkpoint; docs/engineering/decisions.md ## DEC-0136 Required stub; handoffs/resume_brief.md`
- **Hot-surface note**: Appended (not prepended) so triad oldest-prefix rollover retains this newest section. Post-append `--check` → STATE_ARCHIVE_REQUIRED `state` 1267/1200 units=15/80 + `po_to_tl` 686/650 units=16/60 → `arch_linkage_guard.py --pre` exit 0 → `--rollover` `rollover_complete units=1,1` pack_state=`docs/engineering/state-archive/state-pack-20260913-af.md` (archived `## Execute checkpoint — US-0135`; archived_body_lines=72; preamble_lines=11; retained_body_lines=1195) pack_po=`handoffs/archive/po-to-tl-pack-20260913-c.md` (archived `## Discovery handoff — US-0134`; archived_body_lines=57; retained_body_lines=629) → `--post` exit 0; final `--check` PASS.
- **Status**: US-0136 remains **OPEN**. **Next**: `/architecture` in fresh **tech-lead** subagent. Do not spawn architecture from this research chat. STOP.

