# Sprint S0157 — Sprint Plan (BUG-0025)

## Metadata

| Field | Value |
|---|---|
| story_id | (none — bug work item) |
| bug_id | **BUG-0025** |
| story_title | npm publish of its-magic@0.1.3 omits scripts/standalone_runtime_install_lib.py (upgrade FileNotFoundError) |
| sprint_id | **S0157** (locked — new folder; S0156 = US-0148 released; do not reuse) |
| delivery_mode | ultra_lean |
| macro_phase | plan (sprint-plan terminal for plan macro; plan-verify NOT in resolved_phase_plan — skipped; next = /execute dev → build+verify macro) |
| current_phase | sprint-plan |
| approach | A1 (A*) — one `package.json` `files` entry + isfile-before-exec → `STANDALONE_BOOTSTRAP_FAILED` + `tests/bug0025_packaging_contract_test.py` + optional guard allowlist assert + patch republish (e.g. 0.1.4); R-0149 DQ1–DQ10 LOCKED |
| companion_DEC | **none** (packaging bug; `# BUG-0025` sole architecture lock) |
| research_anchor | R-0149 (DQ1–DQ10 LOCKED) |
| architecture_anchor | docs/engineering/architecture.md # BUG-0025 |
| orchestrator_run_id | auto-20260918-bug0025 |
| parent_orchestrator_run_id | cursor-20260918-BUG0025-intake |
| fresh_context_marker | tl-BUG0025-sprintplan-20260918T170500Z-fresh |
| timestamp | 2026-09-18T17:05:00Z (UTC) |
| model_id | inherit (CROSS_MODEL_REVIEW=0) |
| verdict | PASS |
| decision_gate | false |
| SPRINT_MAX_TASKS | 12 |
| SPRINT_AUTO_SPLIT | 1 |
| task_count | 11 (T-anch + T-001..T-010; ≤12; no split; 1:1 from architecture seeds) |
| COMPONENT_SCOPE_MODE | 0 |
| USER_GUIDE_MODE | 0 |
| plan-verify | ultra_lean — NOT in resolved_phase_plan; skipped; no plan-verify.json blocking artifact; reason=`ultra_lean_skipped` |
| backlog_status | OPEN (US-0045 — not mutated; AC-1..AC-8 unchecked) |
| sprint_id_lock | **S0157** for BUG-0025. S0156 = US-0148 released. |
| segment_work_item_kind | bug |

## Scope summary

Close the **published-kit packaging omit** that leaves global `its-magic@0.1.3` without `scripts/standalone_runtime_install_lib.py`. Operator upgrade/missing crashes after `HOST_CONFIG_POSTINSTALL_OK` with raw `FileNotFoundError`. Deliver: (1) add exact `files` entry; (2) harden `_load_standalone_runtime_install_lib` isfile-before-exec → `STANDALONE_BOOTSTRAP_FAILED`; (3) wrap bootstrap / `run_standalone_postinstall` so missing lib exits 1 with token; (4) fail-closed supported-range residual without shipping `standalone/`; (5) `tests/bug0025_packaging_contract_test.py` markers; (6) optional `guard_installer_publish` allowlist assert; (7) patch bump + packaging twin sync + release notes + republish via existing release path.

Out of scope: reopen US-0147 ACs beyond shipping missing packaged file(s) + fail-closed loader + pack/guard; merge/drain BUG-0022 / BUG-0024; add `standalone/` to `files`; allowlist entire `scripts/`; inline/vendor lib into `installer.py`; same-line republish of immutable `0.1.3` (prefer patch bump); npm-publish from sprint-plan; git push; `.env` reads; marking BUG-0025 DONE; ticking AC.

## Acceptance criteria (8) — BUG-0025 (status OPEN, unchecked per US-0045)

Primary acceptance (`docs/product/acceptance.md` BUG-0025 row): npm publish omits `scripts/standalone_runtime_install_lib.py` (upgrade FileNotFoundError).

- **AC-1**: Packaged `its-magic` npm tarball includes `scripts/standalone_runtime_install_lib.py` (and any other scripts required by `installer.py` standalone hook). — T-001, T-005
- **AC-2**: Root `package.json` `files` allowlist lists that path (and peers) so publish cannot omit them. — T-001
- **AC-3**: `_load_standalone_runtime_install_lib` fails closed with `STANDALONE_BOOTSTRAP_FAILED` when the lib is missing (no raw `FileNotFoundError` traceback as the operator-visible outcome). — T-002, T-003
- **AC-4**: `its-magic --mode upgrade|missing` standalone bootstrap completes when the lib is present, or exits with `STANDALONE_BOOTSTRAP_FAILED` when absent. — T-002, T-003, T-004
- **AC-5**: Contract test proves `npm pack` / tarball contains `scripts/standalone_runtime_install_lib.py`; optional `guard_installer_publish` check. — T-005, T-006
- **AC-6**: Republish ships the packaging fix (operator global install no longer lacks the lib). — T-007, T-008, T-009
- **AC-7**: Do not reopen US-0147 ACs as new scope beyond shipping the missing packaged file(s) + fail-closed loader + pack contract. — T-010, T-anch
- **AC-8**: Distinct from BUG-0022 / BUG-0024; do not merge or drain those bugs as this fix. — T-anch

## Task summaries (11 — T-anch + T-001..T-010)

- **T-anch** (NO-OP / verification): Verify `# BUG-0025` H1 + R-0149 A1 DQ1–DQ10 + no companion DEC + US-0147 compose-only + BUG-0022/0024 not drained. Record to `sprints/S0157/t-anch-verification.md`. NO mutation to `architecture.md` / R-0149 in /execute.
- **T-001** (AC-1, AC-2): Add `scripts/standalone_runtime_install_lib.py` to root `package.json` `files` (exactly one new entry; do not add `scripts/` or `standalone/`).
- **T-002** (AC-3, AC-4): Harden `_load_standalone_runtime_install_lib` isfile-before-exec → `STANDALONE_BOOTSTRAP_FAILED` (mirror `_load_doc_profile_lib`).
- **T-003** (AC-3, AC-4): Wrap `bootstrap_standalone_runtime_installer_hook` / `run_standalone_postinstall` so missing lib exits 1 with token (no raw FileNotFoundError).
- **T-004** (AC-4): Fail-closed supported-range residual into `STANDALONE_BOOTSTRAP_FAILED` / `KERNEL_*` (no `standalone/` in `files`).
- **T-005** (AC-1, AC-5): Author `tests/bug0025_packaging_contract_test.py` markers 1–4 + 6 (and 5 if guard extended).
- **T-006** (AC-5): Optional: extend `guard_installer_publish.py` allowlist assert; keep omit-`standalone/` (US-0133).
- **T-007** (AC-6): Patch version bump (e.g. 0.1.3→0.1.4) + packaging twin sync as release path requires.
- **T-008** (AC-6): Release notes / runbook troubleshooting pointer for upgrade command + optional semver quirk note.
- **T-009** (AC-6): Republish via existing release-all / `RELEASE_PUBLISH_MODE` (operator confirm if confirm mode).
- **T-010** (AC-7): Confirm `test_us0147_*` + BUG-0001/0003 / US-0084 / US-0133 guards still green.

Execution order: T-anch → T-001 → T-002 → T-003 → T-004 → T-005 → T-006 → T-007 → T-008 → T-009 → T-010 (acyclic). 11 ≤ 12. Not `/quick`.

## AC → Task surjective coverage

| AC | Task(s) |
|---|---|
| AC-1 | T-001, T-005 |
| AC-2 | T-001 |
| AC-3 | T-002, T-003 |
| AC-4 | T-002, T-003, T-004 |
| AC-5 | T-005, T-006 |
| AC-6 | T-007, T-008, T-009 |
| AC-7 | T-010, T-anch |
| AC-8 | T-anch |
| DC / architecture baseline | T-anch |

**Surjectivity check**: 8/8 ACs covered + primary acceptance.md BUG-0025 row covered. No `PLAN_AC_COVERAGE_GAP`.

## Locked contract markers (architecture `# BUG-0025` / DQ10)

1. `test_bug0025_package_json_files_lists_standalone_runtime_install_lib` — AC-2
2. `test_bug0025_npm_pack_includes_standalone_runtime_install_lib` — AC-1 / AC-5
3. `test_bug0025_load_missing_lib_emits_standalone_bootstrap_failed` — AC-3
4. `test_bug0025_bootstrap_wrapper_no_raw_filenotfound_traceback` — AC-3 / AC-4
5. `test_bug0025_guard_installer_publish_requires_allowlist_entry` — AC-5 (optional if guard extended; else skip with note)
6. `test_bug0025_us0147_compose_hook_call_sites_unchanged` — AC-7 smoke

## Risks (architecture-owned — accepted)

| Risk | Severity | Mitigation |
|---|---|---|
| Published kit fails later on package-root `supported-kernel-range.json` | MEDIUM | Fail-closed residual (DQ2); do not add `standalone/` to `files` |
| Guard false-positive vs US-0133 omit check | MEDIUM | Guard asserts script allowlist presence only |
| Operator stays on `0.1.3` after bump | MEDIUM | AC-6 release notes + upgrade command |
| US-0147 test drift | HIGH | Keep `test_us0147_*` green; bug0025 tests additive only |
| Same-line `0.1.3` republish rejected by npm | MEDIUM | Prefer patch bump to `0.1.4` |

## Compose guards (UNCHANGED)

| Target | Result |
|---|---|
| US-0147 | DONE compose-only — packaging + fail-closed + pack/guard + patch republish only |
| US-0133 | omit-`standalone/` held — never require `standalone/` in `files` |
| BUG-0022 / BUG-0024 | OPEN — not merged, not drained |
| R-0148 / # US-0148 | not wiped / not mutated |
| US-0045 | Status stays OPEN; AC unchecked |
| US-0085 | `.env` deny |
| DEC-0038 tuple | UNAMENDED |

## Execute phase role (per DEC-0051 / US-0069)

| Phase | Role | Isolation |
|---|---|---|
| /execute | dev (fresh per BUG-0006) | {phase_id:execute, role:dev} |
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
| story_id | (none) |
| bug_id | BUG-0025 |
| sprint_id | S0157 |
| orchestrator_run_id | auto-20260918-bug0025 |
| parent_orchestrator_run_id | cursor-20260918-BUG0025-intake |
| delivery_mode | ultra_lean |
| macro_phase | plan |
| segment_work_item_kind | bug |
| bug_queue_position | 1 of 1 |
| bug_queue_remaining | 0 |
| fresh_context_marker | tl-BUG0025-sprintplan-20260918T170500Z-fresh |
| timestamp | 2026-09-18T17:05:00Z (UTC) |
| model_id | inherit (CROSS_MODEL_REVIEW=0) |
| evidence_ref | sprints/S0157/sprint.md, tasks.md, progress.md, uat.md, uat.json, handoffs/tl_to_dev.md, docs/engineering/state.md, handoffs/resume_brief.md, docs/product/backlog.md ### BUG-0025 |

Consumed architecture proof (independent `compute_strict_proof_hash` MATCH; not STALE at consume 2026-09-18T17:05:00Z):

- Architecture producer: `rp-auto-20260918-bug0025-architecture-techlead-20260918T170000Z-BUG-0025` / `DA89597E0B3BD3F37E33AE7A83BFAFF70B4CD04EEDB22BDAE0D7C283FF09B8BE` — RUNTIME_PROOF_VALID before TTL `2026-09-18T18:00:00Z`.

## Runtime proof (DEC-0038)

| Field | Value |
|---|---|
| runtime_proof_id | rp-auto-20260918-bug0025-sprint-plan-techlead-20260918T170500Z-BUG-0025 |
| phase_id | sprint-plan |
| role | tech-lead |
| bug_id | BUG-0025 |
| sprint_id | S0157 |
| orchestrator_run_id | auto-20260918-bug0025 |
| delivery_mode | ultra_lean |
| macro_phase | plan |
| model_id | inherit (CROSS_MODEL_REVIEW=0) |
| proof_issued_at | 2026-09-18T17:05:00Z |
| proof_ttl_seconds | 3600 |
| proof_ttl | 2026-09-18T18:05:00Z (UTC) |
| proof_hash | FD61C0131290781C96BA46C0D44980CC445C89174047DCFC2B5F4F714CCB3A22 |
| canonical_payload | `{"orchestrator_run_id":"auto-20260918-bug0025","phase_id":"sprint-plan","proof_issued_at":"2026-09-18T17:05:00Z","proof_ttl_seconds":3600,"role":"tech-lead","runtime_proof_id":"rp-auto-20260918-bug0025-sprint-plan-techlead-20260918T170500Z-BUG-0025"}` |

Hash via `scripts.token_cost_lib.compute_strict_proof_hash` (positional, compact sorted-key JSON). Isolation extras (not hashed): `delivery_mode=ultra_lean`, `macro_phase=plan`, `model_id=inherit`, `sprint_id=S0157`, `bug_id=BUG-0025`, `skipped_phases=[intake, plan-verify]`. hash_recompute_confirmation=true.

## Decision gate

| Field | Value |
|---|---|
| decision_gate | false |
| stop_conditions_met | yes |
| missing_acceptance_criteria | none (8/8 surjective + 5–6 contract markers) |
| task_count | 11 (≤ SPRINT_MAX_TASKS=12; no split; 1:1 seeds) |
| companion_DEC | none |
| plan-verify readiness | SKIPPED (`ultra_lean_skipped`; CROSS_MODEL_REVIEW=0 — no critic) |

## Definition of done (sprint-plan)

- [x] 11 tasks enumerated (T-anch + T-001..T-010) — ≤ SPRINT_MAX_TASKS=12
- [x] 8/8 ACs surjective + primary acceptance.md BUG-0025 covered
- [x] Architecture-owned `test_bug0025_*` markers named
- [x] Execute phase role matrix documented
- [x] Compose guards UNCHANGED
- [x] Isolation evidence + runtime proof emitted
- [x] Sprint-plan checkpoint appended to docs/engineering/state.md
- [x] Sprint-plan handoff prepended to handoffs/tl_to_dev.md
- [x] SPRINT_PLAN_PASS prepended to handoffs/resume_brief.md (→ /execute dev)
- [x] Traceability row added (Status=PLANNED; Evidence empty)
- [x] UAT placeholders created (uat.md + uat.json)
- [x] Backlog status OPEN; acceptance unchecked
- [x] plan-verify skipped per ultra_lean (no QA spawn)

## Next scheduled phase

| Field | Value |
|---|---|
| next_scheduled_phase | `/execute` (role=dev per US-0069 / DEC-0051, fresh dev subagent per BUG-0006; first canonical phase of build+verify macro; plan-verify NOT in resolved_phase_plan — skipped; CROSS_MODEL_REVIEW=0 — no sovereign-critic) |
| next_scheduled_role | dev |
| next_sprint_macro | build+verify |
| stop_condition | STOP after sprint-plan completes; hand off via artifacts only. Orchestrator MUST spawn `/execute` in fresh dev subagent per BUG-0006. Do not spawn /execute, /plan-verify, or critic from this subagent. |
