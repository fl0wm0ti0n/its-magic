# Sprint S0154 — Sprint Plan (US-0147)

## Metadata

| Field | Value |
|---|---|
| story_id | US-0147 |
| bug_id | BUG-0006 / US-0048 isolation (fresh tech-lead; not a bug-queue drain) |
| story_title | Installation, update, and existing-project adoption |
| sprint_id | **S0154** (locked — new folder; S0153 = US-0146 DONE; do not reuse) |
| delivery_mode | ultra_lean |
| macro_phase | plan (sprint-plan terminal for plan macro; plan-verify NOT in resolved_phase_plan — skipped; next = /execute dev) |
| current_phase | sprint-plan |
| approach | A1 (A*) — triple-installer parity + template `.its-magic/standalone/` mirror + `bootstrap_standalone_runtime_installer_hook` + adoption classifier + kernel preflight + explicit browser setup (R-0144 DQ1–DQ10 LOCKED; DEC-0147 Accepted) |
| companion_DEC | DEC-0147 (Accepted) |
| research_anchor | R-0144 (DQ1–DQ10 LOCKED) |
| architecture_anchor | docs/engineering/architecture.md # US-0147 |
| orchestrator_run_id | auto-20260917-us0146 |
| parent_orchestrator_run_id | auto-20260913-us0144 |
| fresh_context_marker | tl-US0147-sprintplan-20260917T205000Z-fresh |
| timestamp | 2026-09-17T20:50:00Z (UTC) |
| model_id | inherit (CROSS_MODEL_REVIEW=0) |
| verdict | PASS |
| decision_gate | false |
| SPRINT_MAX_TASKS | 12 |
| SPRINT_AUTO_SPLIT | 1 |
| task_count | 12 (T-anch + T-001..T-011; at cap; no split; 1:1 from architecture seeds) |
| COMPONENT_SCOPE_MODE | 0 |
| USER_GUIDE_MODE | 0 |
| plan-verify | ultra_lean — NOT in resolved_phase_plan; skipped; plan-verify.json SKIPPED placeholder only (not a QA phase); reason=`ultra_lean_skipped` |
| backlog_status | OPEN (US-0045 — not mutated; AC-1..AC-8 unchecked) |
| sprint_id_lock | **S0154** for US-0147. S0153 = US-0146 released. |

## Scope summary

Deliver standalone product install/update/adoption: template-mirrored `.its-magic/standalone/` workspace, `bootstrap_standalone_runtime_installer_hook` in triple installers, `classifyProjectAdoptionProfile` composing US-0134 locate, fresh-init skeleton without historical backlog clone, `deny_overwrite` preservation, staged rollback, kernel-bridge preflight + `runtime-metadata.json`, `itsm` shim (optional repo-root `bin/itsm` opt-in), explicit `itsm setup browser`, `uninstall-standalone`, runbook parity, ten hermetic `test_us0147_*`. Compose US-0146 CLI/TUI (wire only — do not rewrite `runtime-core/src/operator/`).

Out of scope: US-0148 daemon/protocol; US-0145 parallel/deploy bodies; new Cursor/OpenCode adapters; host tree rewrite; kit `cli.json` / plugin `tui.json`; `.opencode/commands/auto.md` restore; npm-publish; git push; `.env` reads; marking US-0147 DONE; ticking AC; reopening US-0140..US-0146 DONE.

## Acceptance criteria (8) — US-0147 (status OPEN, unchecked per US-0045)

Primary acceptance (`docs/product/acceptance.md` US-0147 row): Installation, update, and existing-project adoption — fresh setup, non-destructive migration, host coexistence, docs, preservation, and lifecycle tests.

- **AC-1**: Supported Windows/Linux install/update flows install CLI/runtime, pinned deps, browser prereqs, kernel metadata, rollback guidance. — T-001, T-002, T-005, T-006, T-008, T-011.
- **AC-2**: Fresh projects initialize required artifact structures without cloning US-0001..US-0132 backlog. — T-004, T-011.
- **AC-3**: Existing its-magic repos detected and adopted without rewriting canonical artifacts or forced scratchpad migration. — T-003, T-011.
- **AC-4**: Cursor/OpenCode files remain intact; standalone does not require either host. — T-003, T-011.
- **AC-5**: Local config, credentials, browser profiles, project source, user artifacts never overwritten during install/update. — T-004, T-005, T-011.
- **AC-6**: Diagnostics explain kernel/runtime mismatches, host capabilities, migration, safe rollback. — T-006, T-011.
- **AC-7**: Operator docs cover fresh setup, auth, adoption, coexistence, update, uninstall, troubleshooting. — T-010, T-011.
- **AC-8**: Lifecycle tests cover fresh install, upgrade, adoption matrix, interrupted update, preservation, uninstall (Win+Linux). — T-011.

## Task summaries (12 — T-anch + T-001..T-011)

- **T-anch** (NO-OP / verification): Verify `# US-0147` H1 + DEC-0147 Accepted + R-0144 DQ1–DQ10 + ten `test_us0147_*` IDs + path/hook pins. Record to `sprints/S0154/t-anch-verification.md`. NO mutation to `architecture.md` / `DEC-0147.md` / R-0144 in /execute.
- **T-001** (AC-1, AC-2 foundation): `installer-owned-paths.manifest` (+ template mirror) + `template/.its-magic/standalone/` mirror scaffolding.
- **T-002** (AC-1): `bootstrap_standalone_runtime_installer_hook` + PS1/sh parity + repair `--standalone-bootstrap`.
- **T-003** (AC-3, AC-4): `classifyProjectAdoptionProfile` + `ADOPT_PARTIAL_MARKERS` fail-closed; compose `locateProjectKernel`.
- **T-004** (AC-2, AC-5): Fresh init skeleton + `install_include_paths` vs `deny_overwrite` matrix.
- **T-005** (AC-1, AC-5): `.its-magic/install-staging/<run_id>/` + interrupted rollback (`INSTALL_INTERRUPTED_ROLLBACK_OK`).
- **T-006** (AC-1, AC-6): Kernel preflight before shim; `.its-magic/standalone/runtime-metadata.json`.
- **T-007** (AC-1): `.its-magic/bin/itsm` shim; optional repo-root `bin/itsm` opt-in only.
- **T-008** (AC-1, AC-7): `itsm setup browser` explicit gate; `ITS_MAGIC_INSTALL_BROWSER=1` opt-in; metadata `browser_prereq`.
- **T-009** (AC-7): `its-magic --mode uninstall-standalone` + `KIT_VERSION_COEXISTENCE` advisory.
- **T-010** (AC-7): Runbook + template operator doc parity sections.
- **T-011** (AC-1..AC-8): Ten `test_us0147_*` pytest/installer fixtures (Win+Linux).

Execution order: T-anch → T-001 → T-002 → T-003 → T-004 → T-005 → T-006 → T-007 → T-008 → T-009 → T-010 → T-011 (acyclic). At cap (12 ≤ 12). Not `/quick`.

## AC → Task surjective coverage

| AC | Task(s) |
|---|---|
| AC-1 | T-001, T-002, T-005, T-006, T-007, T-008 (T-011 m1,m6,m7,m8) |
| AC-2 | T-004 (T-011 m1) |
| AC-3 | T-003 (T-011 m3,m4,m5) |
| AC-4 | T-003 (T-011 m3,m4,m5) |
| AC-5 | T-004, T-005 (T-011 m2) |
| AC-6 | T-006 (T-011 m7) |
| AC-7 | T-008, T-009, T-010 (T-011 m9,m10) |
| AC-8 | T-011 (full matrix) |
| DC / architecture baseline | T-anch |

**Surjectivity check**: 8/8 ACs covered + primary acceptance.md US-0147 row covered. No `PLAN_AC_COVERAGE_GAP`.

## Locked 10-marker table (DEC-0147 / architecture `# US-0147`)

1. `test_us0147_fresh_install_manifest_parity`
2. `test_us0147_upgrade_preserves_user_layers`
3. `test_us0147_adopt_cursor_only_repo`
4. `test_us0147_adopt_opencode_only_repo`
5. `test_us0147_adopt_both_hosts_repo`
6. `test_us0147_interrupted_update_rollback`
7. `test_us0147_kernel_mismatch_fail_closed`
8. `test_us0147_browser_setup_explicit_gate`
9. `test_us0147_uninstall_preserves_hosts`
10. `test_us0147_runbook_sections_present`

Primary: hermetic pytest/installer fixtures Windows + Linux. Kit `files` omit repo-root `standalone/`.

## Risks (architecture-owned — accepted)

| Risk | Severity | Mitigation |
|---|---|---|
| Installer triple drift | HIGH | Single Python hook; US-0055 parity |
| Destructive adopt | HIGH | deny_overwrite + no backlog clone; adopt tests |
| Publish guard regression | MEDIUM | Template mirror only; manifest parity test |
| Silent Playwright in CI | MEDIUM | Explicit `itsm setup browser`; browser gate test |
| US-0148 scope creep | MEDIUM | In-process operator only; daemon OUT |

## Compose guards (UNCHANGED)

| Target | Result |
|---|---|
| US-0140..US-0146 | DONE compose-only (US-0146 install wiring IN) |
| US-0145 / US-0148 | OUT OF SCOPE |
| BUG-0022 | OPEN not drained |
| US-0045 | Status stays OPEN |
| US-0085 | `.env` deny |
| `.opencode/commands/auto.md` | do not restore |
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
| story_id | US-0147 |
| sprint_id | S0154 |
| orchestrator_run_id | auto-20260917-us0146 |
| parent_orchestrator_run_id | auto-20260913-us0144 |
| delivery_mode | ultra_lean |
| macro_phase | plan |
| drain_story_index | 2 of 3 |
| fresh_context_marker | tl-US0147-sprintplan-20260917T205000Z-fresh |
| timestamp | 2026-09-17T20:50:00Z (UTC) |
| model_id | inherit (CROSS_MODEL_REVIEW=0) |
| evidence_ref | sprints/S0154/sprint.md, tasks.md, progress.md, uat.json, uat.md, plan-verify.json (SKIPPED), summary.md, handoffs/tl_to_dev.md, docs/engineering/state.md, handoffs/resume_brief.md, docs/product/backlog.md ## US-0147 |

Consumed architecture proof (independent `compute_strict_proof_hash` MATCH; not STALE at consume 2026-09-17T20:50:00Z):

- Architecture producer: `rp-auto-20260917-us0146-architecture-techlead-20260917T204000Z-US-0147` / `90A68CD12FB24348890E4DCE47CDCE639736C67C6D91F3914542BFF282A366AD` — RUNTIME_PROOF_VALID before TTL `2026-09-17T21:40:00Z`.

## Runtime proof (DEC-0038)

| Field | Value |
|---|---|
| runtime_proof_id | rp-auto-20260917-us0146-sprint-plan-techlead-20260917T205000Z-US-0147 |
| phase_id | sprint-plan |
| role | tech-lead |
| story_id | US-0147 |
| sprint_id | S0154 |
| orchestrator_run_id | auto-20260917-us0146 |
| delivery_mode | ultra_lean |
| macro_phase | plan |
| model_id | inherit (CROSS_MODEL_REVIEW=0) |
| proof_issued_at | 2026-09-17T20:50:00Z |
| proof_ttl_seconds | 3600 |
| proof_ttl | 2026-09-17T21:50:00Z (UTC) |
| proof_hash | 71466A385CB3FFA1503D35BAA34BD51CD8A592C2038D8570762DCB32D3EBF9A5 |
| canonical_payload | `{"orchestrator_run_id":"auto-20260917-us0146","phase_id":"sprint-plan","proof_issued_at":"2026-09-17T20:50:00Z","proof_ttl_seconds":3600,"role":"tech-lead","runtime_proof_id":"rp-auto-20260917-us0146-sprint-plan-techlead-20260917T205000Z-US-0147"}` |

Hash via `scripts.token_cost_lib.compute_strict_proof_hash` (positional, compact sorted-key JSON). Isolation extras (not hashed): `delivery_mode=ultra_lean`, `macro_phase=plan`, `model_id=inherit`, `sprint_id=S0154`, `story_id=US-0147`, `drain_story_index=2 of 3`. hash_recompute_confirmation=true.

## Decision gate

| Field | Value |
|---|---|
| decision_gate | false |
| stop_conditions_met | yes |
| missing_acceptance_criteria | none (8/8 surjective + ten contract markers) |
| task_count | 12 (at SPRINT_MAX_TASKS=12; no split; 1:1 seeds) |
| companion_DEC | DEC-0147 Accepted |
| plan-verify readiness | SKIPPED placeholder (`ultra_lean_skipped`; CROSS_MODEL_REVIEW=0 — no critic) |

## Definition of done (sprint-plan)

- [x] 12 tasks enumerated (T-anch + T-001..T-011) — at SPRINT_MAX_TASKS=12 cap
- [x] 8/8 ACs surjective + primary acceptance.md US-0147 covered
- [x] All ten architecture-owned `test_us0147_*` named
- [x] Execute phase role matrix documented
- [x] Compose guards UNCHANGED
- [x] Isolation evidence + runtime proof emitted
- [x] Sprint-plan checkpoint appended to docs/engineering/state.md
- [x] Sprint-plan handoff prepended to handoffs/tl_to_dev.md
- [x] SPRINT_PLAN_PASS prepended to handoffs/resume_brief.md (→ /execute dev)
- [x] UAT placeholders written
- [x] Lifecycle stubs written
- [x] Traceability row added (Status=PLANNED)
- [x] Backlog status OPEN; acceptance unchecked
- [x] plan-verify.json SKIPPED placeholder

## Next scheduled phase

| Field | Value |
|---|---|
| next_scheduled_phase | `/execute` (role=dev per US-0069 / DEC-0051, fresh dev subagent per BUG-0006; first canonical phase of build+verify macro; plan-verify NOT in resolved_phase_plan — skipped; CROSS_MODEL_REVIEW=0 — no sovereign-critic) |
| next_scheduled_role | dev |
| next_sprint_macro | build+verify |
| stop_condition | STOP after sprint-plan completes; hand off via artifacts only. Orchestrator MUST spawn `/execute` in fresh dev subagent per BUG-0006. Do not spawn /execute, /plan-verify, or critic from this subagent. |
