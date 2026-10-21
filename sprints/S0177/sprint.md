# Sprint S0177 — BUG-0026 Linux published-global upgrade

## Metadata

| Field | Value |
|---|---|
| sprint_id | **S0177** (`sprints/S0176/` is occupied by BUG-0028; not reused) |
| bug_id | BUG-0026 — **OPEN**; AC-3 unchecked; AC-1, AC-2, AC-4..AC-8 checked |
| story_id | (none) |
| status | QA_PASS |
| current_phase | QA complete; verify-work not started |
| delivery_mode | ultra_lean; plan-verify is skipped (`ultra_lean_not_in_resolved_phase_plan`) |
| research_anchor | **R-0167** |
| architecture_anchor | `docs/engineering/architecture.md` `# BUG-0026` |
| companion_DEC | **none** |
| milestone | none owns BUG-0026; DEC-0009 activation does not apply |
| task_count | 2 (T-anch + T-001; merged `SPRINT_MAX_TASKS=12` from `.cursor/scratchpad.md`; `.cursor/scratchpad.local.md` has no override; `SPRINT_AUTO_SPLIT=1`; split not triggered; not `/quick`) |
| component_scope | `COMPONENT_SCOPE_MODE=0` (no required scope metadata) |
| user_guide | `USER_GUIDE_MODE=0` (no user-guide task) |
| fresh_context_marker | `tl-BUG0026-sprintplan-20261015T083138Z-fresh` |

## Goal

Record the Linux published-global half of AC-3 for `its-magic@0.1.5` or a later published package that still contains the 2026-09-19 allowlisted range file. Success is `STANDALONE_BOOTSTRAP_OK` plus a posix `.its-magic/bin/itsm` (mode 0755), or a precise `STANDALONE_SUPPORTED_RANGE_MISSING` when both range files are absent. That miss must stay distinct from a false `KERNEL_CONTRACT_MISMATCH`.

Windows parity is the already recorded 2026-09-19 global `its-magic@0.1.5` row. Cite it. Do not copy those tokens into the Linux row.

The design is locked by R-0167 and `# BUG-0026`. This sprint does not re-decide it.

## Scope

### In scope (execute)

1. T-anch baseline: BUG-0026 stays OPEN, AC-3 stays unchecked, no republish, Windows row cited and not copied.
2. T-001: one Linux published-global observation of `npm install -g its-magic@0.1.5` (or a later published package that still contains `scripts/standalone-supported-kernel-range.json`), then `its-magic --target . --mode upgrade --host both`, plus token classification.

### Out of scope

- This phase implements nothing.
- Do not re-implement `load_supported_range`.
- Do not republish, `npm publish`, or edit the allowlisted range file.
- Do not add a contract. The eight existing `test_bug0026_*` stay. The packed-tarball test is not the Linux half.
- Do not author a DEC. Do not edit `docs/engineering/decisions.md`.
- Do not require `itsm.cmd` on Linux. That file is Windows-only.
- Do not drift into US-0149 PATH registration. Do not reopen US-0149 or BUG-0025.
- Do not edit BUG-0028 or BUG-0029. Do not merge or drain them.
- Missing WSL/Docker is not a pass. `PYTHON_NOT_FOUND` does not close AC-3.
- Do not tick AC-3. Do not flip BUG-0026 to DONE. Closure owns that flip.
- Do not read `.env`. No git commit, push, `/execute`, or `/plan-verify` from this phase.

## Acceptance coverage

| AC | Tasks |
|---|---|
| AC-1 | T-anch (hold the published range artifact; do not re-pack) |
| AC-2 | T-anch (Windows parity already recorded; cite, do not copy into the Linux row) |
| AC-3 | T-001 (Linux published-global observation) |
| AC-4 | T-anch (existing pack allowlist tests stay; no new contract) |
| AC-5 | T-anch (do not reopen BUG-0025) |
| AC-6 | T-anch (do not reopen US-0149) |
| AC-7 | T-anch (do not edit BUG-0028 or BUG-0029) |
| AC-8 | T-001 (missing-range token is `STANDALONE_SUPPORTED_RANGE_MISSING`, not `KERNEL_CONTRACT_MISMATCH`) |

AC-3 is the open criterion. Every AC has a task. Tasks are the two architecture seeds. No split: 2 tasks, cap 12.

## Risks

- No Python 3 yields `PYTHON_NOT_FOUND` and does not close AC-3.
- A newer published tarball that drops both range files must show `STANDALONE_SUPPORTED_RANGE_MISSING`. Republish is a later release choice, not this sprint.
- Missing WSL or Docker is not a Linux pass.
- Requiring `itsm.cmd` on Linux would false-fail a posix shim.
- PATH registration belongs to US-0149 and is out of this sprint.

## Plan-verify

Ultra-lean skips plan-verify (`ultra_lean_not_in_resolved_phase_plan`). `sprints/S0177/plan-verify.json` is a SKIPPED placeholder only. This phase does not spawn `/plan-verify`.

## Proof

- Consumed architecture proof `rp-auto-20261015-bug0026-architecture-techlead-20261015T082711Z-BUG-0026` / `a9ce156cd99c0d6a115acbbe58f456abdbd2c1ea137f637b6442e6ef4bbf0796` MATCH and in TTL at planning (issued 2026-10-15T08:27:11Z, ttl 2026-10-15T09:27:11Z).
- `runtime_proof_id=rp-auto-20261015-bug0026-sprint-plan-techlead-20261015T083138Z-BUG-0026`
- `proof_hash=aae48cc19aa6606e3dbdf350e5607f6c3376fc059bbfaea0e6c1b6b47e9924c1`
- `proof_issued_at=2026-10-15T08:31:38Z`; `proof_ttl=2026-10-15T09:31:38Z`
- Canonical tuple: `{"orchestrator_run_id":"auto-20261015-bug0026","phase_id":"sprint-plan","proof_issued_at":"2026-10-15T08:31:38Z","proof_ttl_seconds":3600,"role":"tech-lead","runtime_proof_id":"rp-auto-20261015-bug0026-sprint-plan-techlead-20261015T083138Z-BUG-0026"}`
- `hash_recompute_confirmation=true`
- `model_id=inherit`; `model_provenance=provenance=host=cursor;path=.cursor/scratchpad.local.md;step=MODEL_TIER_<PHASE>`
