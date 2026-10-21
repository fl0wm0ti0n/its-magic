# Sprint S0179 — US-0162 token optimization and host-neutral model routing v2

## Metadata

| Field | Value |
|---|---|
| sprint_id | **S0179** (`sprints/S0179/` was free; S0176 is BUG-0028; S0177 is BUG-0026; S0178 is BUG-0029; none reused) |
| story_id | US-0162 — **OPEN**; AC-1..AC-12 unchecked |
| bug_id | (none) |
| status | EXECUTE_FAIL |
| current_phase | execute finished; harness blocked outside S0179 |
| delivery_mode | ultra_lean; plan-verify is skipped (`ultra_lean_not_in_resolved_phase_plan`) |
| research_anchor | **R-0169** approach **A1** |
| architecture_anchor | `docs/engineering/architecture.md` `# US-0162` |
| companion_DEC | **none** |
| milestone | none owns US-0162; DEC-0009 activation does not apply |
| task_count | 12 (T-anch + T-001..T-011; `SPRINT_MAX_TASKS=12` from `.cursor/scratchpad.md`; `.cursor/scratchpad.local.md` has no override; `SPRINT_AUTO_SPLIT=1`; count equals the cap, so split is not triggered; not `/quick`) |
| component_scope | `COMPONENT_SCOPE_MODE=0` (no required scope metadata) |
| user_guide | `USER_GUIDE_MODE=0` (no user-guide task) |
| fresh_context_marker | `tl-US0162-sprintplan-20261016T163057Z-fresh` |

## Goal

A phase loads a budgeted context pack and resolves a provider plus model from `.its-magic/model-routing.json` when that file is present. An absent file keeps today's `resolve_model_for_phase` result. Proof bodies, the kernel, handoff deltas, the deterministic audit, and the dedup ledger follow R-0169 A1. Quality gates stay named.

The design is locked by R-0169 and `# US-0162`. This sprint does not re-decide it.

## Scope

### In scope (execute)

1. T-anch baseline: US-0162 stays OPEN, AC-1..AC-12 stay unchecked, and the absent routing file, pack builder, and audit helper are still the current gaps.
2. T-001: routing schema and inventory. An absent file keeps `resolve_model_for_phase` (AC-8, AC-10).
3. T-002: provider registry and `api_key_env` names only (AC-8).
4. T-003: six-step resolver and `MODEL_*` adapter (AC-8, AC-10).
5. T-004: complexity, capability fallback, escalation cap, compact routing log (AC-9).
6. T-005: pack builder and `TOKEN_PROFILE` presets inside the hard caps (AC-1, AC-10).
7. T-006: evidence refs, pack omits proof bodies, `pack_hash` separate from DEC-0038 (AC-3).
8. T-007: active architecture shard plus index stub; archiver unchanged (AC-2).
9. T-008: kernel and template twin; pointers replace pasted copies (AC-4, AC-11).
10. T-009: delta handoff fields (AC-5).
11. T-010: deterministic audit and dedup ledger (AC-6, AC-7).
12. T-011: contract tests and benchmark fields. Defaults flip last (AC-12).

### Out of scope

- No work outside T-anch and T-001..T-011. US-0162 stays OPEN. AC-1..AC-12 stay unchecked.
- Do not amend DEC-0086, DEC-0087, DEC-0054, DEC-0038, or DEC-0062. Do not author a companion DEC. Do not edit `docs/engineering/decisions.md`.
- Do not change the DEC-0087 5-step inside `scripts/model_tier_lib.py`. The new router is `scripts/model_routing_lib.py`.
- Do not delete existing `MODEL_*` keys.
- Do not add backlog or acceptance to the DEC-0054 triad. Do not change the archiver. Do not bulk-move historical architecture sections.
- Do not treat `pack_hash` as a runtime proof. Do not extend `compute_strict_proof_hash`.
- Do not call `@its-magic/context-engine`. US-0139 stays DONE.
- Do not read `.env`. Do not commit a secret. Do not invent a production KIE URL.
- Do not reopen US-0101, US-0102, US-0080, US-0089, US-0090, US-0096, or US-0139. Do not edit BUG-0026 or BUG-0029.
- Do not weaken US-0048, US-0056, US-0069, or US-0039.
- Do not tick AC-1..AC-12. Do not flip US-0162 to DONE. Closure owns that flip.
- No git commit, push, npm publish, `/execute`, or `/plan-verify` from this phase.

## Acceptance coverage

| AC | Tasks |
|---|---|
| AC-1 | T-005 (pack contents, read order, hard caps, lean preset, section pointer) |
| AC-2 | T-007 (active shard plus index stub; archiver unchanged; pack copies the active heading) |
| AC-3 | T-006 (refs only; proof JSON stays out of the pack; `pack_hash` is not DEC-0038) |
| AC-4 | T-008 (eight kernel lines; pointers replace pasted copies; gates stay named) |
| AC-5 | T-009 (delta fields; a typical handoff stays a few hundred tokens) |
| AC-6 | T-010 (deterministic audit order; clean fixture records `model_calls=0`) |
| AC-7 | T-010 (dedup ledger; same path, sha256, and section is not fully read twice) |
| AC-8 | T-001, T-002, T-003 (schema, providers, six-step order, separate provider and model) |
| AC-9 | T-004 (classifier, five fallback codes, escalation cap, compact JSONL) |
| AC-10 | T-001, T-003, T-005 (`TOKEN_PROFILE` stays separate; `MODEL_*` adapter; absent file unchanged) |
| AC-11 | T-008, T-011 (named gates stay; QA may use a different profile than execute) |
| AC-12 | T-011 (ten `test_us0162_*` markers and benchmark fields) |

T-anch records the baseline for every AC and changes no product code. Every AC has a task. Tasks are the twelve architecture seeds. No split: 12 tasks, cap 12.

## Risks

- An absent routing file must keep today's host resolution. T-001 proves that path before any example file is the source of truth.
- `full` uses the same hard caps as `balanced`. It does not load every memory file.
- Sharding moves only the active item and leaves the archiver unchanged.
- `pack_hash` is a separate SHA-256 of the pack JSON. It is not `compute_strict_proof_hash`.
- The kernel shrink leaves QA, UAT, and release named.
- A clean audit records `model_calls=0`.
- Fallback codes go to `.its-magic/metrics/routing.jsonl`. `state.md` may hold `routing_evidence_ref` only.
- The routing example contains env names only. This sprint does not read `.env`.
- A thirteenth task would be a second sprint. This plan stays at twelve.

## Plan-verify

Ultra-lean skips plan-verify (`ultra_lean_not_in_resolved_phase_plan`). The sprint-plan command creates `plan-verify.json` after `/plan-verify`. That phase is not in the resolved plan, so this phase does not write that file and does not spawn `/plan-verify`.

## Proof

- Consumed architecture proof `rp-auto-20261016-us0162-architecture-techlead-20261016T162338Z` / `9bfcd392f023a9f54b686db13b6a14dc27adaf09980e3675ab924f38f922093e` MATCH and in TTL at planning (issued 2026-10-16T16:23:38Z, ttl 2026-10-16T17:23:38Z; recomputed 2026-10-16T16:30:57Z).
- `runtime_proof_id=rp-auto-20261016-us0162-sprint-plan-techlead-20261016T163057Z`
- `proof_hash=1ba0b5240285b2b74940fc0558e8f6f237525da6c7aba7aa1a7a5a7b7b65bc21`
- `proof_issued_at=2026-10-16T16:30:57Z`; `proof_ttl=2026-10-16T17:30:57Z`
- Canonical tuple: `{"orchestrator_run_id":"auto-20261016-us0162","phase_id":"sprint-plan","proof_issued_at":"2026-10-16T16:30:57Z","proof_ttl_seconds":3600,"role":"tech-lead","runtime_proof_id":"rp-auto-20261016-us0162-sprint-plan-techlead-20261016T163057Z"}`
- `hash_recompute_confirmation=true`
- `model_id=inherit`; `model_provenance=provenance=host=cursor;path=.cursor/scratchpad.local.md;step=MODEL_TIER_<PHASE>`
