# Architecture archive pack (2026-10-16)

- Rollover trigger: `ARCH_HOT_MAX_LINES=3000, ARCH_HOT_MAX_STORY_SECTIONS=120`
- Source: `docs/engineering/architecture.md`
- Archived units (oldest first, contiguous prefix): 1
- Retained units in hot file: 40
- First archived heading: `# US-0144 — Sovereign runtime composition`
- Last archived heading: `# US-0144 — Sovereign runtime composition`
- Verification tuple (mandatory):
  - archived_body_lines=90
  - preamble_lines=1
  - retained_body_lines=2944

---

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

