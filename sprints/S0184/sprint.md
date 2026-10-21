# Sprint S0184 — BUG-0037 OpenCode story-creation canonical story-block contract

## Metadata

| Field | Value |
|---|---|
| sprint_id | **S0184** (`sprints/S0184/` was free; S0183 is BUG-0038 (DONE/released); S0182 is US-0158; no sprint reused) |
| bug_id | BUG-0037 — **OPEN/P1**; AC-1..AC-5 unchecked |
| story_id | (none) |
| status | PLANNED (bug remains OPEN) |
| current_phase | sprint-plan planning is complete (SPRINT_PLAN_PASS); execute not started |
| delivery_mode | ultra_lean; effective plan `[spec, plan, build+verify, ship]`; plan-verify is **SKIPPED** (`ultra_lean` skip — recorded) |
| research_anchor | **R-0174** approach **Option A** |
| architecture_anchor | `docs/engineering/architecture.md` `# BUG-0037` |
| companion_DEC | **none** (confirmed) |
| task_count | 6 (T-anch + T-001..T-006; `SPRINT_MAX_TASKS=12`; under cap, no split; not `/quick`) |
| fresh_context_marker | `tl-BUG0037-sprintplan-20261020T183221Z-fresh` |

## Goal

Restore the canonical structured story-block contract on the OpenCode PO
story-creation surface so that created stories again carry the important
canonical fields — including `Status` — in the usual structured block shape, not
the prose shape. R-0174 Option A and `# BUG-0037` are binding; this sprint does
not re-decide them.

## Scope

### In scope (execute)

1. T-anch records the BUG-0037 baseline (4-file OpenCode parity set, `US-0161` at L6144–6178, AC-4 lock) without product change.
2. T-001 appends the canonical `## Story block shape` field template (single source of truth) to `.opencode/agents/po.md` (AC-1, AC-3).
3. T-002 mirrors that template byte-for-byte in `template/.opencode/agents/po.md` (AC-2, AC-3).
4. T-003 inserts the `## Story creation` directive into `.opencode/commands/intake.md` (reference to `po.md`, cite canonical exemplar `US-0161`, forbid the prose shape) before the terminal "STOP" (AC-1, AC-3).
5. T-004 mirrors that directive byte-for-byte in `template/.opencode/commands/intake.md` (AC-2, AC-3).
6. T-005 implements the sole new AC-4 contract test `tests/bug0037_story_shape_contract_test.py` (positive `US-0161`-shaped fixture, prose negative fixture, 8-assertion lock, 4-file parity/split assertion) (AC-4).
7. T-006 verifies active/template byte parity, `US-0161` byte-for-byte unchanged, no new permission grant, and BUG-0036/BUG-0038/`US-0161` untouched (AC-2, AC-3, AC-5).

### Out of scope

- No work outside T-anch and T-001..T-006. BUG-0037 remains **OPEN/P1**; AC-1..AC-5 and its acceptance row remain unchecked.
- Do not author a companion DEC and do not edit `docs/engineering/decisions.md`. DEC-0153 remains accepted and unamended.
- Do not weaken or reopen `US-0161` (the live L6144–6178 block stays byte-for-byte). Do not edit `US-0158`/`US-0160`/`US-0162` or `docs/product/acceptance.md`.
- Do not import remote `US-0001`..`US-0004` (AC-5: the faulty samples are evidence, not importable).
- Do not add any new permission grant / agent-MAP edit. The change is content-only (no grants). No `PHASE_ROLE_MATRIX` / `TASK_ALLOWLIST` edit.
- Do not do triad rollover (`state.md` over-cap is a curator/refresh-context duty, out of scope here).
- Do not read `.env`; no commit, push, publish, `/auto`, `/plan-verify`, QA, release, or closure from sprint planning.
- Do not call `write_resume_pair` or set `RESUME_BRIEF_AUTO_REFRESH`; it stays `0`. `CROSS_MODEL_REVIEW=0` (no critic).

## Acceptance coverage

| AC | Tasks |
|---|---|
| AC-1 | T-001, T-003, T-005 (field template makes `Status` mandatory; `/intake` directive requires the canonical block; test asserts `Status` present) |
| AC-2 | T-002, T-004, T-006 (OpenCode-only via active/template twin byte parity + parity verification) |
| AC-3 | T-001, T-003, T-005, T-006 (canonical structured block, not the prose shape: template forbids the prose markers; directive forbids them; test discriminator; verification) |
| AC-4 | T-005 (the sole new contract test `tests/bug0037_story_shape_contract_test.py`, markers `test_bug0037_*`) |
| AC-5 | T-006 (`US-0161` byte-for-byte unchanged; no remote import of `US-0001`..`US-0004`; no new grant) |

Every AC maps to at least one task. T-anch records the baseline for every AC and
changes no product content. The six architecture task seeds are retained 1:1; no
split is required under the cap of 12.

## Risks and controls

- The template can be duplicated into `intake.md` (re-duplication risk): T-001 keeps the field template in exactly one file (the agent) as the single source of truth; T-003 only references it and cites `US-0161`.
- Active/template drift: T-002/T-004 mirror byte-for-byte; T-006 re-verifies both pairs byte-identical.
- Weakening the canonical block: T-006 asserts `US-0161` (L6144–6178) is byte-for-byte unchanged; the live block is the positive fixture, not a change target.
- Prose shape resurfacing: the 8-assertion lock + the prose-marker discriminator (T-005) assert the canonical shape and forbid `**Priority:**`/`**Release:**`/`**Acceptance criteria**`.
- Over-locking to intake provenance: the contract asserts canonical shape, not `intake_run_id`/`writer_id`/`topic_coverage` (R-0174 finding 5); T-005 does not over-lock.
- Scope creep / new grants: T-006 asserts no permission-map/agent-MAP edit and content-only change.
- A seventh task would not trigger `SPRINT_AUTO_SPLIT` (cap 12); this plan stays at six.

## 4-artifact denial — HONORED-NOT-FORCED (dev/qa-owned), NOT blocked

`sprints/S0184/sprint.md` and `sprints/S0184/tasks.md` are the only
tech-lead allow-listed sprint-plan deliverables. The 4 non-allow-listed sprint
artifacts are **dev/qa-owned** per the binding S0163/S0166 precedent
(`handoffs/tl_to_dev.md` S0166; `docs/engineering/state-archive/state-pack-20261010-d.md`), and
their isolation-guard denial is **honored, not forced** — it is **neither a
decision_gate nor a blocking condition**:

- `sprints/S0184/progress.md` — **dev-owned** (created at `/execute`); **NOT** a `/sprint-plan` deliverable.
- `sprints/S0184/uat.md` — **qa-owned** (created at `/qa`, ultra_lean merged).
- `sprints/S0184/uat.json` — **qa-owned** (created at `/qa`, ultra_lean merged).
- `sprints/S0184/plan-verify.json` — **qa-owned** (absent; plan-verify is **SKIPPED** by ultra_lean and is not in the effective plan).

This child wrote none of them and does not treat their absence as a blocker. The
plan is within the task cap, so `SPRINT_PLAN_PASS` is lawful.

## Plan-verify

Plan-verify is **SKIPPED** (`ultra_lean`): it is not in the effective plan
`[spec, plan, build+verify, ship]` and is not spawned. This phase does not write
`plan-verify.json`.

## Proof

- Consumed architecture proof `rp-auto-20261020-bug0037-architecture-techlead-20261020T174525Z-BUG-0037` / `bd788e693cd94177ff573bd07b922e04eae40cc41005eb6139fa24cafe0b471d` recomputed MATCH and IN-TTL at this boundary (issued 2026-10-20T17:45:25Z, ttl to 2026-10-20T18:45:25Z; boundary 2026-10-20T18:32:21Z is before expiry).
- `runtime_proof_id=rp-auto-20261020-bug0037-sprint-plan-techlead-20261020T183221Z-BUG-0037`
- `proof_hash=7cae5773eb19110acc0c509b264a93bb055ce4c6c524a1ab19d1ad1070958ae5`
- `proof_issued_at=2026-10-20T18:32:21Z`; `proof_ttl=2026-10-20T19:32:21Z`
- Canonical tuple: `{"orchestrator_run_id":"auto-20261020-bug0037","phase_id":"sprint-plan","proof_issued_at":"2026-10-20T18:32:21Z","proof_ttl_seconds":3600,"role":"tech-lead","runtime_proof_id":"rp-auto-20261020-bug0037-sprint-plan-techlead-20261020T183221Z-BUG-0037"}`
- `hash_recompute_confirmation=true` (minted in one invocation, independently recomputed in a second fresh invocation — MATCH)
- `model_id=zelisko_llm/qwen3.8-27b`; `model_provenance=fresh canonical phase child (tech-lead sprint-plan)`
