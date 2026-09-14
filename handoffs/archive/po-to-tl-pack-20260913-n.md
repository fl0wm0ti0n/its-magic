# PO to TL archive pack (2026-09-13)

- Rollover trigger: `PO_TO_TL_HOT_MAX_LINES=650, PO_TO_TL_HOT_MAX_SECTIONS=60`
- Source: `handoffs/po_to_tl.md`
- Archived units (oldest first, contiguous prefix): 1
- Retained units in hot file: 14
- First archived heading: `## Architecture handoff — US-0136 Fresh role sessions and runtime attestation`
- Last archived heading: `## Architecture handoff — US-0136 Fresh role sessions and runtime attestation`
- Verification tuple (mandatory):
  - archived_body_lines=42
  - retained_body_lines=637

---

## Architecture handoff — US-0136 Fresh role sessions and runtime attestation

- **Phase completed**: architecture. **Role**: tech-lead. **Story**: US-0136 only. **Sprint**: (pending `/sprint-plan`). **Verdict**: PASS (`decision_gate=false`).
- **Timestamp (UTC)**: 2026-09-13T07:35:00Z. **Fresh marker**: `tl-US0136-architecture-20260913T073500Z-fresh`.
- **Orchestrator**: `orchestrator_run_id=auto-20260913-us0136`, parent=`auto-20260913-us0135`, `delivery_mode=ultra_lean`, macro=`plan` (architecture = second of research+architecture+sprint-plan), `model_id=cursor-grok-4.6-high`, CROSS_MODEL_REVIEW=1, AUTO_QUIET=1, EARLY_RESEARCH=1 (Pi session docs confirmed; **no new R-id**).
- **Sibling boundary**: **US-0137..US-0148** OPEN — OUT OF SCOPE this segment. **US-0133** / **US-0134** / **US-0135** DONE — compose only; do not reopen. **BUG-0020** DONE — do not reopen.
- **Architecture anchor**: `docs/engineering/architecture.md` **`# US-0136`**. **Companion DEC**: **`decisions/DEC-0136.md` Accepted** (BUG-0020 “do not allocate DEC-0136” applied to that bug, not this story).
- **Approach**: **A1 (A\*) LOCKED**. Reject A2 (`runtime-core` fold), A3 (Pi imports in `role-runtime`), A4 (persist jsonl + `continueRecent`/`fork`), A5 (orchestrator Pi session), A6 (extend `compute_strict_proof_hash`), A7 (SQLite this story), A8 (amend isolation/`noTools`/KernelBridge/auth-models), A9 (paid CI).
- **Research consumed**: `rp-auto-20260913-us0136-research-techlead-20260913T071500Z-US-0136` / `42D5C250BDF6562EE383668E2FE8080568D1164A184B48FB82BF11982E5D56F6` — RUNTIME_PROOF_VALID MATCH; critic PASS `rp-auto-20260913-us0136-sovereign-critic-techlead-20260913T072500Z-US-0136` / `ABAF8CDB7F8051AE6EA63711AD6BA5E3D39A6EB6E424579A25994EE7225D2248`; anti_slop=10; 0 blocking; immutable R-0128.

### Locked design (A1)

- `standalone/packages/role-runtime` (`@its-magic/role-runtime`; no Pi imports) hosts RoleCatalog + SessionSupervisor + sidecar attestation.
- Supervisor wraps injected `AgentKernel.createSession` only; `SessionManager.inMemory`; `continueRecent`/`fork` default-deny across phases.
- Versioned continuation: process-local same-phase `run`/`steer` only; execute/QA rework and crash = fresh.
- RoleCatalog ports DEC-0051 / `AUTO_ROLE_*`; extra rows sovereign-critic→tech-lead, security-review→security, map-codebase/ask→scout; bounded `objective_function` / `review_focus`.
- Sidecar spawn/start/end; `kernel_process_instance`=`${bootUuid}:${pid}`; DEC-0038 envelope UNAMENDED; Python validators ignore unknown sidecar keys.
- Fail-closed `SESSION_*` / `ATTESTATION_*` plus compose existing isolation/proof/orchestrator codes.
- TypeScript orchestrator scheduling-only (spawn-time tool deny; no mutation tools).
- Fake-model CI / empty loader / `noTools` / KernelBridge / auth-models **unamended**.

### Sprint seeds

- T-anch + T-001..T-010 (11 ≤ SPRINT_MAX_TASKS=12). Do not expand US-0137+ ACs. Do not implement application code this phase.

### Runtime proof (DEC-0038)

- `runtime_proof_id=rp-auto-20260913-us0136-architecture-techlead-20260913T073500Z-US-0136`
- `proof_hash=3814A075FD13922FD3E8B344CDA11F02BC832845C35245F2D2B5A0B07587E3CD`
- `proof_ttl=2026-09-13T08:35:00Z`
- Hash via `from scripts.token_cost_lib import compute_strict_proof_hash` (positional; compact sorted-key JSON).
- Canonical hashed payload: `{"orchestrator_run_id":"auto-20260913-us0136","phase_id":"architecture","proof_issued_at":"2026-09-13T07:35:00Z","proof_ttl_seconds":3600,"role":"tech-lead","runtime_proof_id":"rp-auto-20260913-us0136-architecture-techlead-20260913T073500Z-US-0136"}`
- Isolation extras (not hashed): `delivery_mode=ultra_lean`, `macro_phase=plan`, `model_id=cursor-grok-4.6-high`, `sprint_id=none`, `story_id=US-0136`
- `hash_recompute_confirmation=true` (compute_strict_proof_hash → 3814A075FD13922FD3E8B344CDA11F02BC832845C35245F2D2B5A0B07587E3CD)

### Isolation + stop

- `phase_id=architecture`, `role=tech-lead`, `story_id=US-0136`, `model_id=cursor-grok-4.6-high`, `fresh_context_marker=tl-US0136-architecture-20260913T073500Z-fresh`
- `evidence_ref=docs/engineering/architecture.md # US-0136; decisions/DEC-0136.md; docs/engineering/research.md ## R-0128; docs/product/backlog.md ## US-0136 architecture_notes; docs/engineering/state.md architecture checkpoint; docs/engineering/decisions.md ## DEC-0136 Accepted; handoffs/resume_brief.md`
- **Hot-surface note**: Appended (not prepended) so triad oldest-prefix rollover retains this newest section. Post-append `--check` → STATE_ARCHIVE_REQUIRED `state` 1281/1200 units=15/80 + `po_to_tl` 671/650 units=16/60 + `architecture` 3121/3000 units=22/120 → `arch_linkage_guard.py --pre` exit 0 → `--rollover` `rollover_complete units=1,1,1` pack_state=`docs/engineering/state-archive/state-pack-20260913-ah.md` (archived `## QA checkpoint — US-0135`; archived_body_lines=87; preamble_lines=11; retained_body_lines=1194) pack_po=`handoffs/archive/po-to-tl-pack-20260913-d.md` (archived `## Research handoff — US-0134`; archived_body_lines=48; retained_body_lines=623) pack_arch=`docs/engineering/architecture-archive/architecture-pack-20260913-a.md` (archived `# US-0130`; archived_body_lines=156; preamble_lines=1; retained_body_lines=2965) → `--post` exit 0; heading policy `baseline_h2_count=0` PASS; `[CODEBASE_MAP_OK] preserved_existing`; final `--check` PASS.
- **Status**: US-0136 remains **OPEN**. **Next**: `/sprint-plan` in fresh **tech-lead** subagent. Do not spawn sprint-plan from this architecture chat. STOP.

