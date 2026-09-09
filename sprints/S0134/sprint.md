# Sprint S0134 - Sprint Plan (US-0132)

## Metadata

| Field | Value |
|---|---|
| story_id | US-0132 |
| story_title | Explicit Cursor/OpenCode model configuration contract |
| sprint_id | S0134 |
| delivery_mode | ultra_lean |
| macro_phase | plan (plan-verify PASS; next=/execute) |
| current_phase | plan-verify |
| approach | A1 locked (from R-0117 DQ1–DQ10; DEC-0132 Accepted) |
| companion_DEC | DEC-0132 (Accepted) |
| research_anchor | R-0117 (DQ1–DQ10 LOCKED) |
| architecture_anchor | docs/engineering/architecture.md # US-0132 |
| orchestrator_run_id | auto-20260908-us0132 |
| fresh_context_marker | tl-US0132-sprint-plan-20260908T212407Z-fresh |
| timestamp | 2026-09-08T21:24:07Z (UTC) |
| model_id | cursor-grok-4.6 (CROSS_MODEL_REVIEW=1 — required on isolation) |
| verdict | PASS |
| decision_gate | false |
| SPRINT_MAX_TASKS | 12 |
| SPRINT_AUTO_SPLIT | 1 |
| task_count | 10 (T-anch + T-001..T-009; within 12; no split) |
| COMPONENT_SCOPE_MODE | 0 |
| USER_GUIDE_MODE | 0 |
| plan-verify | PASS — `sprints/S0134/plan-verify.json` (`plan_verified_at=2026-09-08T21:39:33Z`, qa) |
| backlog_status | OPEN (US-0045 — not mutated; AC-1..AC-8 unchecked) |
| sibling_out_of_scope | US-0131 DONE (DEC-0131 compose-only — do not reopen) |
| critic_carry_ins | 0 blocking; 3 architecture critic NBs `us0132arc-*` resolved non-blocking — routed below |

## Scope summary

Close the **Cursor/OpenCode model-file ownership gap**. Operators get one documented contract for four supported surfaces: Cursor `.cursor/model-catalog.local.json` + scratchpad `MODEL_*`; OpenCode kit `.opencode/model-catalog.local.json`; OpenCode host `opencode.json{,c}`. Generic `model.json{,c}` is rejected (`MODEL_CONFIG_PATH_UNKNOWN` at repo root / `.cursor/` / `.opencode/` only). Cursor vs OpenCode schemas stay separate. `opencode.json{,c}` is a host file, not kit SOT. Per-host `provenance=` diagnostics. `MODEL_CONFIG_HOST_COLLISION` is a distinct `--host both` row. Extend `model_tier_validate.py --scope model-config`. Exclude-from-clean locals including `.opencode/model-catalog.local.json`. Ten `test_us0132_*` markers. US-0131 runtime-config remains DONE compose-only.

**Approach A1** (DEC-0132 Accepted): explicit inventory + reject `model.json` + per-host diagnostics + `--scope model-config` + gitignore/clean exemption.

Out of scope: aliasing `model.json` (A2); union/generic kit SOT (A3); dumping catalog into `opencode.json` (A4); amending DEC-0086/0087/0123/0131; scanning `~/.config/opencode/model.json`; copy-aside clean; new validator script as default; `HOST_CONFIG_*` reuse; live OpenCode CI probe; marking US-0132 DONE; ticking AC checkboxes; reopening US-0131 / BUG-0015 / BUG-0016.

## Critic NB closures routed into tasks (architecture sovereign-critic)

| NB | Finding / issue | Sprint-plan lock |
|---|---|---|
| NB1 | gitignore/clean gaps remain execute; architecture_notes for US-0132 misplaced under ### BUG-0016 (form-feed in `fresh_context_marker`); S0134 preview id | **THIS phase**: relocate architecture_notes onto `## US-0132` (clean `fresh_context_marker`, no form-feed); do not reopen BUG-0016. **T-005**: explicit `.opencode/model-catalog.local.json` gitignore (root + template) + exclude-from-clean named locals (not copy-aside) including catalog + `.opencode/opencode.json{,c}`. Sprint folder **S0134** owned here. |
| NB2 | four surfaces + US-0131 kit SOT layering; provenance overlay; HOST_COLLISION distinct; optional host-JSON names-only; `--scope model-config` | **T-001..T-004, T-006, T-008**: inventory/unknown-path; schema-mix; Cursor `provenance=`; OpenCode kit vs host + optional names-only read (fail-open absent; malformed present → `MODEL_CATALOG_INVALID` `scope=opencode-host`); `HOST_COLLISION` distinct both-host row; extend-in-place `--scope model-config`. DEC-0132 companion, not DEC-0131 reuse. |
| NB3 | T-anch ceremony overlap; exclude-from-clean over copy-aside; no third SOT | **T-anch** kept as NO-OP verification (do not mutate `architecture.md` / `DEC-0132.md` in /execute). **T-005** exclude-from-clean. A2/A3/A4 rejected. US-0131 DONE compose-only. No DONE flip. |

## Acceptance criteria (8) — US-0132 (status OPEN, unchecked per US-0045)

- **AC-1**: Canonical ownership — four-surface inventory; undocumented generic `model.json` rejected (not aliased).
- **AC-2**: Separate schemas — Cursor tier/phase/role-catalog vs OpenCode per-role `provider/slug`; neither runtime interprets the other host's catalog.
- **AC-3**: Deterministic precedence — independent per host; observable diagnostics (`provenance=`); `--host both` never unions schemas.
- **AC-4**: Materialization correctness — OpenCode catalog materializes idempotently into installed agents only; Cursor resolution read-only; templates never receive operator slugs/credentials.
- **AC-5**: Fail-closed validation — present malformed/unknown → host-scoped reason code; absent optional ≠ invalid; `HOST_COLLISION` distinct under `--host both`.
- **AC-6**: Local-file protection — install/upgrade/missing/clean preserve active local catalogs, scratchpad overrides, and local OpenCode config.
- **AC-7**: Triple-surface parity — Python / PowerShell / shell installers, validators, manifest, template examples agree on delivery/protection for all `--host` modes.
- **AC-8**: Contract tests and operator docs — 10 `test_us0132_*` markers + runbook h2 + `model.json` migration recipe + additive `MODEL_CONFIG_*` rows.

## Task summaries (10 — T-anch + T-001..T-009)

- **T-anch** (NO-OP / verification): Verify `# US-0132` H1 + DEC-0132 Accepted + A1 + R-0117 + 10-marker list. Record `sprints/S0134/t-anch-verification.md`. No architecture.md / DEC-0132 mutation in execute.
- **T-001** (AC-1): Four-surface inventory + unknown-path scan of `model.json{,c}` at repo root / `.cursor/` / `.opencode/` → `MODEL_CONFIG_PATH_UNKNOWN`. No home-dir scan. No alias.
- **T-002** (AC-2): Schema-mix detection → `MODEL_CONFIG_SCHEMA_MIX`. Cursor resolver must not read OpenCode catalog; materializer must not read Cursor catalog or `MODEL_*`.
- **T-003** (AC-3): Cursor `provenance=` diagnostics overlay on DEC-0087 5-step + US-0130 critic overlay. Do not amend the chain. Absent catalog + `alias_only` remains valid.
- **T-004** (AC-3): OpenCode kit vs host layering + optional names-only read of `opencode.json{,c}` (fail-open absent; malformed present → `MODEL_CATALOG_INVALID` `scope=opencode-host`). Kit never writes host JSON.
- **T-005** (AC-6, AC-7): Explicit `.opencode/model-catalog.local.json` gitignore (root + template); exclude-from-clean named locals; never-overwrite on install/missing/upgrade; example delivery per `--host`; triple-installer + manifest parity.
- **T-006** (AC-5): `MODEL_CONFIG_*` family: `PATH_UNKNOWN`, `SCHEMA_MIX`, `HOST_COLLISION` (distinct both-host row alongside PATH_UNKNOWN). Do not reuse `HOST_CONFIG_*`. `--host cursor|opencode` + `model.json` → PATH_UNKNOWN only; `--host both` → PATH_UNKNOWN **and** HOST_COLLISION.
- **T-007** (AC-4): Materializer invariants (idempotent; never-write template / active local / Cursor / `opencode.json{,c}`; no credentials in examples; absent catalog no-op exit 0).
- **T-008** (AC-1, AC-5, AC-8): Extend `scripts/model_tier_validate.py --scope model-config` (inventory + unknown path + schema-mix + both-host coexistence + gitignore row). Keep default Cursor + `--scope opencode-catalog`.
- **T-009** (AC-8): `tests/us0132_contract_test.py` — all 10 locked markers + template mirror + runbook h2 `## Cursor/OpenCode model configuration contract (US-0132)` + README pointer + US-0126 additive `MODEL_CONFIG_*` rows only.

Execution order: T-anch → T-001 → T-002 → T-003 → T-004 → T-005 → T-006 → T-007 → T-008 → T-009 (acyclic; codes/inventory before validator scope; tests+docs last). No split (`SPRINT_AUTO_SPLIT` not triggered).

## AC → Task surjective coverage

| AC | Task(s) |
|---|---|
| AC-1 (canonical inventory / reject `model.json`) | T-001, T-008, T-009 (marker 1) |
| AC-2 (separate schemas) | T-002, T-009 (markers 2, 3) |
| AC-3 (per-host precedence diagnostics) | T-003, T-004, T-009 (markers 4, 5, 8) |
| AC-4 (materializer) | T-007, T-009 (marker 6) |
| AC-5 (fail-closed codes) | T-006, T-008, T-009 (markers 1, 5, 10) |
| AC-6 (local-file protection) | T-005, T-009 (marker 7) |
| AC-7 (triple-surface parity) | T-005, T-009 (markers 7, 9) |
| AC-8 (tests + docs) | T-008, T-009 (all 10 + runbook h2) |
| DC / DEC baseline | T-anch |

**Surjectivity check**: 8/8 ACs covered (each AC ≥1 task). No `PLAN_AC_COVERAGE_GAP`. T-anch retained as verification-only (NB3).

## Locked 10-marker table (R-0117 DQ9 / architecture)

1. `test_us0132_canonical_inventory_rejects_model_json`
2. `test_us0132_cursor_schema_not_interpreted_as_opencode`
3. `test_us0132_opencode_schema_not_interpreted_as_cursor`
4. `test_us0132_cursor_precedence_diagnostics_overlay`
5. `test_us0132_opencode_absent_catalog_noop_vs_present_fail_closed`
6. `test_us0132_materializer_idempotent_never_writes_template_or_host_json`
7. `test_us0132_installer_preserves_local_model_files_including_clean`
8. `test_us0132_both_host_independent_catalogs`
9. `test_us0132_gitignore_opencode_catalog_explicit_row`
10. `test_us0132_docs_migration_and_reason_codes`

Static/fixture only — **no live OpenCode CI probe**. Fixtures: temp repos for `cursor` / `opencode` / `both`, with/without catalogs, planted `model.json`, swapped schemas.

## Risks (R1–R6 — accepted)

| Risk | Severity | Mitigation |
|---|---|---|
| R1 `model.json` silent alias | HIGH if A2 | T-001 reject + marker 1; A2 rejected |
| R2 clean deletes OpenCode locals | MEDIUM | T-005 exclude-from-clean + marker 7 |
| R3 schema mix under `--host both` | MEDIUM | T-002 `SCHEMA_MIX` + markers 2, 3, 8 |
| R4 validator-scope sprawl | LOW | T-008 extend-in-place `--scope model-config` |
| R5 US-0131 boundary leak | MEDIUM | ignore kit keys in `opencode.json`; host-neutral resolver still ignores `MODEL_*`; US-0131 DONE compose-only |
| R6 docs drift vs three installers | LOW–MEDIUM | T-005/T-009 AC-7 parity + marker 10 |

## Compose guards (UNCHANGED)

| Target | Result |
|---|---|
| US-0101 / DEC-0086 | compose — Cursor catalog + tiers unchanged; diagnostics overlay only |
| US-0102 / DEC-0087 | compose — 5-step chain not rewritten |
| US-0130 | compose — critic pin overlay unchanged |
| US-0123 / DEC-0123 | compose — materializer invariants confirmed; never write host JSON |
| US-0112 | compose — examples only; no active catalogs |
| DEC-0039 | compose — never overwrite + exclude-from-clean |
| US-0131 / DEC-0131 | DONE compose-only — not a second matrix |
| US-0126 | compose — additive `MODEL_CONFIG_*` rows only |
| BUG-0015 / BUG-0016 | DONE — do not reopen (architecture_notes relocate only) |
| US-0045 | Status stays OPEN |

## Phase role matrix (after sprint-plan)

| Phase | Role | Isolation |
|---|---|---|
| /plan-verify | qa (fresh) | {phase_id:plan-verify, role:qa} — consume PENDING plan-verify.json |
| /execute | dev (fresh) | {phase_id:execute, role:dev} |
| /qa | qa (fresh) | {phase_id:qa, role:qa} |
| /verify-work | qa (fresh) | {phase_id:verify-work, role:qa} |
| /release | release (fresh) | {phase_id:release, role:release} |
| /closure | qe (fresh) | {phase_id:closure, role:qe} |
| /refresh-context | curator (fresh) | {phase_id:refresh-context, role:curator} |

## Isolation evidence (US-0048 / DEC-0029 / US-0104 v2)

| Field | Value |
|---|---|
| phase_id | sprint-plan |
| role | tech-lead |
| story_id | US-0132 |
| sprint_id | S0134 |
| orchestrator_run_id | auto-20260908-us0132 |
| delivery_mode | ultra_lean |
| macro_phase | plan |
| fresh_context_marker | tl-US0132-sprint-plan-20260908T212407Z-fresh |
| timestamp | 2026-09-08T21:24:07Z (UTC) |
| model_id | cursor-grok-4.6 (CROSS_MODEL_REVIEW=1 — required) |
| evidence_ref | sprints/S0134/sprint.md, tasks.md, progress.md, plan-verify.json (PENDING), uat.json, uat.md, handoffs/tl_to_dev.md, handoffs/qa_plan_verify.md, docs/engineering/state.md, docs/product/backlog.md sprint_plan_notes, handoffs/resume_brief.md |

Prior phase proof consumed: `rp-auto-20260908-us0132-architecture-techlead-20260908T210500Z-US-0132` / `8255C22FCC78F2CFF74AD41A08D9FFF875AE09C205A82BEC78C4B4D03CD13013` — RUNTIME_PROOF_VALID (MATCH before TTL 2026-09-08T22:05:00Z; consumed 2026-09-08T21:24:07Z). Sovereign-critic architecture PASS (`critic-US0132-architecture-20260908T211828Z-fresh`; anti_slop=10; 0 blocking; NBs routed).

## Runtime proof (DEC-0038)

| Field | Value |
|---|---|
| runtime_proof_id | rp-auto-20260908-us0132-sprint-plan-techlead-20260908T212407Z-US-0132 |
| proof_issued_at | 2026-09-08T21:24:07Z |
| proof_ttl_seconds | 3600 |
| proof_ttl | 2026-09-08T22:24:07Z (UTC) |
| proof_hash | 3DF869CD3FDFF4C0A76093193B1550F4DE9082EB8AFD37091AD37A4C98392E89 |
| canonical_payload | `{"delivery_mode":"ultra_lean","macro_phase":"plan","model_id":"cursor-grok-4.6","orchestrator_run_id":"auto-20260908-us0132","phase_id":"sprint-plan","proof_issued_at":"2026-09-08T21:24:07Z","proof_ttl_seconds":3600,"role":"tech-lead","runtime_proof_id":"rp-auto-20260908-us0132-sprint-plan-techlead-20260908T212407Z-US-0132","sprint_id":"S0134","story_id":"US-0132"}` |

## Decision gate

| Field | Value |
|---|---|
| decision_gate | false |
| missing_acceptance_criteria | none (8/8 ACs surjective) |
| task_count | 10 ≤ 12 |
| approach | A1 locked |
| companion_DEC | DEC-0132 Accepted |
| plan-verify | PENDING for qa |
| sovereign_memory_note | `assemble_sovereign_memory_digest(...)` NOT called; no mistakes.jsonl write |

## Definition of done (sprint-plan)

- [x] 10 tasks (T-anch + T-001..T-009) within SPRINT_MAX_TASKS=12; no split
- [x] 8/8 ACs surjective
- [x] Critic NB1–NB3 routed (architecture_notes relocated; T-005 clean/gitignore; T-anch NO-OP)
- [x] plan-verify.json PENDING
- [x] UAT placeholders
- [x] Traceability PLANNED
- [x] tl_to_dev + qa_plan_verify handoffs
- [x] Backlog Status OPEN + sprint_plan_notes
- [x] Isolation + DEC-0038 proof

## Next scheduled phase

| Field | Value |
|---|---|
| next_scheduled_phase | `/execute` |
| next_scheduled_role | dev |
| stop_condition | STOP after plan-verify PASS. Orchestrator MUST Task-spawn `/execute` in fresh dev subagent (BUG-0006). Do NOT spawn execute from this qa. Do NOT spawn critic. Do NOT mark US-0132 DONE. Do NOT reopen US-0131. |
