# Sprint S0186 — BUG-0044 Recurring DEC-0153 continuation-pair omission at phase boundaries

## Metadata

| Field | Value |
|---|---|
| sprint_id | **S0186** (`sprints/S0186/` was free; S0185 is US-0164 (released/closed); S0184 is BUG-0037; S0183 is BUG-0038 (DONE/released); S0182 is US-0158; bug-style dirs `S-BUG0013`/`S-BUG0014` exist but are not the `S####` allocation track; highest existing `S####` is S0185 → **S0186**; repository scan found **0 prior `S0186` references** before allocation) |
| bug_id | BUG-0044 — **OPEN/P1**; AC-1..AC-5 unchecked |
| story_id | (none) |
| status | PLANNED (bug remains OPEN) |
| current_phase | sprint-plan planning is complete (SPRINT_PLAN_PASS); execute not started |
| delivery_mode | ultra_lean; effective plan `[spec, plan, build+verify, ship]`; plan-verify is **SKIPPED** (`ultra_lean` skip — recorded) |
| research_anchor | **R-0176** (F1–F7 RESOLVED/LOCKED, approach **A**) |
| architecture_anchor | `docs/engineering/architecture.md` `# BUG-0044` (Locks 1–5) |
| companion_DEC | **DEC-0156** (authored at `/architecture`; Accepted; consumed, not re-decided) |
| task_count | 6 (T-anch + T-001..T-005); 1:1 with the `# BUG-0044` task seeds; `SPRINT_MAX_TASKS=12`; under cap, no split; not `/quick` |
| fresh_context_marker | `tl-BUG0044-sprintplan-20261025T200009Z-fresh` |

## Goal

Make every remediation phase child (`discovery`, `execute`, `sprint-plan`, `qa`,
`verify-work`, `release`, `closure`) **codify** the DEC-0153 continuation-pair +
terminal-state-reconcile obligation in its own command contract, backed by a
read-only deterministic pre-STOP self-check on the existing pair SOT — so the
recurring omission (US-0164 `/sprint-plan` pair-missing; US-0164 `/verify-work`
leaving `uat.json` in the QA lifecycle state → `/release`
`RELEASE_UAT_INCOMPLETE`) is prevented at the source on the first pass, with no
repair-only re-mint and no separate repair child on a later run. R-0176 approach
A, `# BUG-0044` Locks 1–5, and **DEC-0156** are binding; this sprint does not
re-decide them.

## Scope

### In scope (execute)

1. T-anch records the BUG-0044 baseline (R-0176 F1–F7, DEC-0156, `# BUG-0044`
   Locks 1–5, the 7-command × 4-host remediation set, the pair SOT
   `scripts/opencode_auto_bridge.py`, `token_cost_lib.compute_strict_proof_hash`,
   no new reason code, no parent authority) without product change.
2. T-001 applies the Lock-1 "Continuation + terminal-state reconcile contract"
   section **verbatim** to the 7 OpenCode remediation commands
   (`discovery.md`, `execute.md`, `sprint-plan.md`, `qa.md`, `verify-work.md`,
   `release.md`, `closure.md`) as the last section before each file's final STOP
   line (AC-1, AC-3).
3. T-002 mirrors that section byte-for-byte into the `.cursor/commands/` and
   `template/.opencode/commands/` + `template/.cursor/commands/` twins, and
   verifies every active/template pair is byte-identical (Lock 2) (AC-1, AC-2).
4. T-003 adds the A2 read-only helper
   `phase_boundary_self_check(repo, *, writer_role, state_json, brief_json) -> dict`
   to `scripts/opencode_auto_bridge.py` (byte-identical template twin), composing
   on `validate_resume_pair` + `token_cost_lib.compute_strict_proof_hash`; no
   pair-logic re-implementation; no parent authority (Lock 4) (AC-1, AC-4).
5. T-004 documents the Lock-3 per-phase terminal-state-reconcile table in the
   remediation commands' contract section (the section already references it via
   the architecture anchor) and exercises the canonical verify-work UAT
   reconcile (`status=VERIFY_PASS` / `phase_id=verify-work` /
   `uat_lifecycle=verify_work_complete_release_pending`) in test fixtures
   (AC-2, AC-4).
6. T-005 authors the AC-4 contract test
   `tests/bug0044_phase_boundary_pair_contract_test.py` with the 6
   `test_bug0044_*` markers (Lock 5) + `reset_resume_pair_registry_for_tests`
   isolation (AC-1..AC-5).

### Out of scope

- No work outside T-anch and T-001..T-005. BUG-0044 remains **OPEN/P1**;
  AC-1..AC-5 and its acceptance row (`docs/product/acceptance.md` L245) remain
  unchecked.
- Do not re-author or amend **DEC-0156**, `# BUG-0044`, R-0176, or the
  `### BUG-0044` backlog block (all read-only; the tech-lead permission map
  denies `docs/product/backlog.md` and `docs/product/acceptance.md` — the
  sprint verdict is recorded in `state.md` only).
- Do not add a new reason code (reuse `RESUME_BRIEF_STALE` /
  `RESUME_BRIEF_UNPARSEABLE` + `RUNTIME_PROOF_*` + `RELEASE_UAT_INCOMPLETE`); do
  not add a `MODEL_*` / governance key; do not edit the parent `auto.md`
  contracts (they already carry the spawn-only + repair-path contract); do not
  pull `intake`/`plan-verify`/`refresh-context` into the remediation set (intake
  uses the distinct DEC-0069 script refresh).
- Do not reopen US-0163/US-0164 (citations only) or BUG-0015..BUG-0043.
- Do not grant parent proof-minting; `RESUME_BRIEF_AUTO_REFRESH=0` absolute;
  `CROSS_MODEL_REVIEW=0`.
- Do not read `.env`; no npm publish; no git commit/push; no AC tick; no
  `write_resume_pair` call; no `/auto`.

## Acceptance coverage

| AC | Tasks |
|---|---|
| AC-1 | T-001, T-002, T-003, T-005 (the Lock-1 contract section on all 7 remediation children makes the pre-STOP pair-write + validate obligation codified; the A2 helper is the deterministic check; test #2 asserts pair byte-identity + 20/20 `PAIR_LOCKED_FIELDS` + strict 6-tuple hash MATCH) |
| AC-2 | T-002, T-004, T-005 (Lock-3 terminal-state-reconcile table + the verify-work `uat.json`/`uat.md` canonical row; test #4 asserts the child leaves UAT terminal and a stale QA-state fixture still fails the release gate with `RELEASE_UAT_INCOMPLETE`) |
| AC-3 | T-001, T-003, T-005 (parent stays spawn-only: `phase_boundary_self_check` grants no parent authority and rejects `auto`/`parent`/`orchestrator` writers via the composed `validate_resume_pair`; test #5 asserts no parent proof-minting + `RESUME_BRIEF_AUTO_REFRESH=0` absolute) |
| AC-4 | T-003, T-004, T-005 (the 6-item contract-test surface `tests/bug0044_phase_boundary_pair_contract_test.py` covers the pair write, byte-identity, missing/conflicting-pair fail-closed stop, terminal-state reconcile, no-parent-proof-minting, replay/idempotence) |
| AC-5 | T-anch, T-001..T-005 (prevention at the source: the codified contract + deterministic self-check make the first pass write the pair and reconcile the artifact; no repair-only re-mint or separate repair child is required on a later run; US-0163/US-0164 are citations only, not reopened) |

Every AC maps to at least one task. T-anch records the baseline for every AC and
changes no product content. The five architecture task seeds are retained 1:1; no
split is required under the cap of 12.

## Risks and controls

- Verbatim-section drift across hosts: T-001 writes the OpenCode primary from
  Lock 1; T-002 copies byte-for-byte to every twin and re-hashes all 14 command
  files (7 × 2 active/template pairs) so any drift is caught before execute
  completes. Contract test #1 (T-005) re-asserts the presence + parity in CI.
- The A2 helper re-implementing pair logic: T-003 composes on
  `validate_resume_pair` (returns its result verbatim, predicate preserved) and
  `token_cost_lib.compute_strict_proof_hash`; it does NOT re-derive key/field
  logic. `token_cost_lib.py` is not edited.
- Misreading AC-2 as a new reason code: the obligation reuses
  `RELEASE_UAT_INCOMPLETE` at the release gate (the child prevents, the gate
  detects); T-004 asserts no new uppercase code is introduced.
- Parent gaining proof-minting: T-003's `writer_role` gate rejects
  `auto`/`parent`/`orchestrator` via the composed `validate_resume_pair`
  (`RESUME_BRIEF_STALE` / `unauthorized_writer_role`); test #5 locks this.
- Cross-file atomicity: deliberately NOT claimed (per
  `_write_resume_pointer_block`); the safety boundary is the validation rule
  (byte-identical + `validate_resume_pair` ok) re-run by the child pre-STOP and
  the parent post-spawn — no change needed.
- Intake pulled into the pair surface: excluded from the remediation set (Lock
  1 / R-0176 Risk 7); intake keeps its distinct DEC-0069 script refresh.
- Scope creep / new grants: content-only on the 7 command pairs + the
  `opencode_auto_bridge.py` pair + the new test file; no permission-map or
  agent-MAP edit; no `PHASE_ROLE_MATRIX` / `TASK_ALLOWLIST` edit.

## 4-artifact denial — HONORED-NOT-FORCED (dev/qa-owned), NOT blocked

`sprints/S0186/sprint.md` and `sprints/S0186/tasks.md` are the only tech-lead
allow-listed sprint-plan deliverables. The non-allow-listed sprint artifacts are
**dev/qa-owned** per the binding S0163/S0166/S0184 precedent, and their
isolation-guard denial is **honored, not forced** — it is **neither a
decision_gate nor a blocking condition**:

- `sprints/S0186/progress.md` — **dev-owned** (created at `/execute`); **NOT** a
  `/sprint-plan` deliverable.
- `sprints/S0186/uat.md` / `uat.json` — **qa-owned** (created at `/qa`,
  ultra_lean merged).
- `sprints/S0186/plan-verify.json` — **qa-owned** (absent; plan-verify is
  **SKIPPED** by ultra_lean and is not in the effective plan).

This child wrote none of them and does not treat their absence as a blocker. The
plan is within the task cap, so `SPRINT_PLAN_PASS` is lawful.

## Plan-verify

Plan-verify is **SKIPPED** (`ultra_lean`): it is not in the effective plan
`[spec, plan, build+verify, ship]` and is not spawned. This phase does not write
`plan-verify.json`.

## Proof

- Consumed architecture proof
  `rp-auto-20261025-bug0044-architecture-tl-20261025T194557Z-BUG-0044` /
  `2a4a13879d7007792866506c55db462204b2703a25c1b549a1c5d4691e7d3029` recomputed
  MATCH at this boundary; the architecture pair is **IN-TTL** (issued
  2026-10-25T19:45:57Z + 3600 → expiry 2026-10-25T20:45:57Z; boundary
  2026-10-25T20:00:09Z is ~45m before expiry) — consumed on the validated-pair
  basis; no stale-proof waiver required.
- `runtime_proof_id=rp-auto-20261025-bug0044-sprint-plan-tl-20261025T200009Z-BUG-0044`
- `proof_hash=18e1db1cbe969cf77d340359c25520d9df0aa8e25472b97bdd621b43df9e8789`
- `proof_issued_at=2026-10-25T20:00:09Z`; `proof_ttl=2026-10-25T21:00:09Z`
- Canonical tuple: `{"orchestrator_run_id":"auto-20261025-bug0044","phase_id":"sprint-plan","proof_issued_at":"2026-10-25T20:00:09Z","proof_ttl_seconds":3600,"role":"tech-lead","runtime_proof_id":"rp-auto-20261025-bug0044-sprint-plan-tl-20261025T200009Z-BUG-0044"}`
- `hash_recompute_confirmation=true` (minted via
  `token_cost_lib.compute_strict_proof_hash`, independently recomputed with a
  fresh compact sorted-key SHA-256 — MATCH, 64 hex)
- `model_id=zelisko_llm/qwen3.8-27b`; `model_provenance=fresh canonical phase
  child (tech-lead sprint-plan)`
