# Sprint S0165 — BUG-0035 / execute progress (dev)

## T-anch — baseline / no-op verification (DC) — DONE

- **Timestamp**: 2026-10-04T02:36:00Z (UTC wall-clock at start of execute context)
- **Read-only observations** (no writes):
  - `docs/engineering/research.md` L16072 `## R-0157 — BUG-0035 research→architecture paired-continuation ownership` — DQ1-DQ5 LOCKED; A1 phase-child-owned paired continuation update is A*.
  - `docs/engineering/architecture.md` L3467 `# BUG-0035 — Phase-child-owned paired continuation repair`; verdict **ARCHITECTURE_PASS**; **decision_gate=false**; binding through **DEC-0153** (Accepted); BUG-0035 stays **OPEN P0**; all seven ACs unchecked.
  - `decisions/DEC-0153.md` L4 `Status: Accepted`; pair key `orchestrator_run_id|work_item_kind|bug_id|completed_phase|runtime_proof_id`; syntax → `RESUME_BRIEF_UNPARSEABLE`; stale/absent/conflict/auth/replay/proof-invalid → `RESUME_BRIEF_STALE` (predicate retained); no state fallback, no reconciler, no `RESUME_BRIEF_AUTO_REFRESH=0` bypass.
  - `docs/product/backlog.md` `### BUG-0035` `Status: OPEN`, AC-1..AC-7 all `- [ ]` **unchecked**; acceptance L226 `- [ ] BUG-0035: ... (7 ACs; P0)` **unchecked** (guards #1: NOT flipped this phase).
  - `sprints/S0165/tasks.md`: **8 tasks** present — T-anch, T-001..T-007 (within `SPRINT_MAX_TASKS=12`); 7 completion-evidence gates; execution order T-anch → T-001 → T-002 → T-003 → T-004 → T-005 → T-006 → T-007 (matches locked plan).
  - `.opencode/agents/tech-lead.md` + template twin: **byte-identical** (SHA-256 `15AF9E…3630`), `**": deny` first, no `handoffs/resume_brief.md` allow yet; `bash: ask`; `task: deny`.
  - `.opencode/agents/auto.md` + template twin: **byte-identical** (`1B4435…A3F7`); `edit: deny`; `bash: deny`; `task: *": deny` with po/tech-lead/dev/qa/release/curator/security allows (parent unchanged).
  - `.opencode/agents/dev.md` + template twin: **byte-identical** (`D41F70…4C8`); operator bootstrap grant ALREADY APPLIED on the two tech-lead map writes (bootstrap grant from the S0165 execute bootstrap).
  - `scripts/opencode_auto_bridge.py` + `template/` twin: byte-identical (`E088A1…F034`); no BUG-0035 writer/validator yet.
  - `.opencode/commands/{research,architecture,auto}.md` + templates: all byte-identical; no BUG-0035/DEC-0153 continuation section yet.
  - `.cursor/commands/{research,architecture,auto}.md` + templates: all byte-identical (FBFF2B…/83CF4F…/1684D0…); no BUG-0035/DEC-0153 section yet.
  - `docs/engineering/auto-orchestration-reference.md` + template: byte-identical (`0DCD21…08749F`); no BUG-0035 section yet.
  - `docs/engineering/runbook.md` + template: byte-identical (`0F82B0…FF08`); no BUG-0035 remediation section yet.
  - `tests/`: no `bug0035_continuation_pair_test.py` yet (neither active nor template).
  - `sprints/S0165/`: `sprint.md` + `tasks.md` present; `progress.md` + `summary.md` **not yet created**.
  - `handoffs/dev_to_qa.md`: pre-existing sections present; BUG-0035 execute section to be prepended this phase (F section in sprint.md handoff contract).
  - **Pre-write validator**: `python scripts/bug_issue_validate.py --repo . --check-acceptance` → `[BUG_VALIDATION_OK]` **exit 0** (BEFORE any write in this phase).
- **Guards (non-negotiable) verified intact**:
  - #1 backlog/acceptance BUG-0035 row unchanged (OPEN, unchecked).
  - #2 no `decisions/DEC-*.md` authored or amended by this phase.
  - #3 US-0156 / US-0154 / US-0155 / BUG-0005 / BUG-0016 / BUG-0022 / BUG-0027 / BUG-0031..0034 / DEC-0152 / DEC-0069 / DEC-0038 / DEC-0124 / stop-matrix all untouched.
  - #4 no TUI / RPC / JSON command template / localhost surface restored.
  - #5 no `/auto`, no subagent spawn, no phase work outside `/execute`.
  - #6 no `.env` read, no `npm publish`, no `git push`, no live OpenCode/Cursor IDE probes.
  - #7 `RESUME_BRIEF_AUTO_REFRESH=0` remains an absolute prohibition (no state fallback, no reconciler, no next-spawn on invalid pair).
  - #8 operator bootstrap grant on `.opencode/agents/dev.md` + `template/.opencode/agents/dev.md` preserved.
  - #10 `.opencode/agents/auto.md` + template twin remain `edit: deny` (parent unchanged).

## T-001 — least-privilege permission pair (AC-1, AC-2, AC-7) — DONE

- **Timestamp**: 2026-10-04T02:37:30Z
- **Files modified (this task)**:
  - `.opencode/agents/tech-lead.md` — added `"handoffs/resume_brief.md": allow` **immediately after** the `"**": deny` line and before any other allow (deny-first ordering preserved).
  - `template/.opencode/agents/tech-lead.md` — byte-identical mirror (applied to template first — granted; then copied to active — the operator bootstrap grant on the dev map already grants the two tech-lead paths; see T-anch guard #8).
- **Guard #9 verifications** (post-edit, re-read active file):
  - `**": deny` remains the **first** entry in `edit:` (line 6).
  - `"handoffs/resume_brief.md": allow` is the **next** entry (line 7).
  - `"handoffs/resume_brief.md": allow` appears **exactly once** in the file.
  - `bash: ask` unchanged (line 16); `task: deny` unchanged (line 17).
  - **No** new fields added, **no** broad grant, **no** `handoffs/**`, **no** wildcard.
- **Byte parity (SHA-256)**:
  - `.opencode/agents/tech-lead.md` = `A4CB1B6C6EDD6F009E82C53BE6C3ACA78E441E1F946BB25B44D055FC85E72AC6`
  - `template/.opencode/agents/tech-lead.md` = `A4CB1B6C6EDD6F009E82C53BE6C3ACA78E441E1F946BB25B44D055FC85E72AC6`
  - **MATCH**.
- **Guard #10 verifications** (post-edit, re-read both auto maps):
  - `.opencode/agents/auto.md` and `template/.opencode/agents/auto.md` remain `edit: deny` (parent unchanged); byte-identical `1B4435…A3F7`.

## T-002 — active state-first pair writer/validator (AC-1..AC-5, AC-6) — DONE

- **Timestamp**: 2026-10-04T02:41:00Z
- **Files modified (this task)**:
  - `scripts/opencode_auto_bridge.py` — added canonical BUG-0035 / DEC-0153 module:
    - `PAIR_LOCKED_FIELDS` (22 canonical fields the state and brief sides must agree on).
    - `resume_pair_registry` (module-level idempotence + replay registry, resettable via `reset_resume_pair_registry_for_tests()`).
    - `build_resume_pair_key(record) → str` — constructs the exact `orchestrator_run_id|work_item_kind|bug_id|completed_phase|runtime_proof_id` key.
    - `_validate_pair_tuple(record) → {"ok": bool, "reasonCode"?, "predicate"?, "record"?}` — syntax-level; `record_not_object` → `RESUME_BRIEF_UNPARSEABLE`; malformed key/ttl/hash → `RESUME_BRIEF_UNPARSEABLE`; absent-required field, malformed marker, invalid proof phase → `RESUME_BRIEF_STALE` (predicate retained).
    - `validate_resume_pair(repo, *, writer_role, state_tuple, brief_tuple)` — parent / read/validate-only entry point. Authorization check first (`auto`/`parent`/`orchestrator`/empty/unknown → `RESUME_BRIEF_STALE`, `predicate=unauthorized_writer_role`); then state and brief tuple syntax; then `record_key` equality; then field-by-field `PAIR_LOCKED_FIELDS` consistency (`tuple_conflict:<field>`); then replay/idempotence (exact canonical replay → `idempotent_noop=true`; changed field → `replay_conflict` = `RESUME_BRIEF_STALE`).
    - `write_resume_pair(repo, *, writer_role, state_checkpoint_text, state_path=None, state_tuple=None, brief_tuple=None)` — DEC-0153 §2 **state-first → validate → atomic brief**: state checkpoint block written first (append/prepend, preserving prior bytes), then `validate_resume_pair(...)`; on `idempotent_noop=true`, **no** brief write (exact-replay no-op); on fresh pair success, `_write_resume_pointer_block(...)` atomically prepends the resume latest-pointer block using temp-file + `Path.replace(...)` (cross-file atomicity deliberately not claimed, per DEC-0153 §2 / architecture).
    - `_write_resume_pointer_block(repo, ...)` — the atomic prepend implementation; header includes `record_key`, `writer_role`, `completed_phase`, `next_scheduled_phase`, `next_scheduled_role`, `fresh_context_marker`.
    - Constants `RESUME_BRIEF_STALE`, `RESUME_BRIEF_UNPARSEABLE`.
    - CLI: `--write-resume-pair` + `--resume-pair-json '{state:{...}, brief:{...}}'` + `--role <child_role>` wiring in `main()` (returns exit 0 / 1 on ok / not-ok).
- **Self-test matrix** (fresh process, `_reset()` between cases):
  - m1 lawful pair: `ok=True, idempotent_noop=False, next_scheduled_phase=architecture` ✓
  - m2 parent deny: `role=auto` → `RESUME_BRIEF_STALE`, `predicate=unauthorized_writer_role` ✓
  - m3 marker mismatch: `tuple_conflict:fresh_context_marker` → `RESUME_BRIEF_STALE` ✓
  - m4 absent-required (proof_hash dropped): `absent_required_field:proof_hash` → `RESUME_BRIEF_STALE` ✓
  - m4 malformed (state=`"corrupt-bytes"`): `pair_record_not_object` → `RESUME_BRIEF_UNPARSEABLE` ✓
  - m5 tuple conflict (next_phase=qa): `tuple_conflict:next_scheduled_phase` → `RESUME_BRIEF_STALE`, no next ✓
  - m5 proof-id mismatch (state key ≠ brief key): `pair_key_mismatch` → `RESUME_BRIEF_STALE` ✓
  - m6 unauthorized role (`writer_role=dev` on tech-lead pair): `writer_role_mismatch` → `RESUME_BRIEF_STALE` ✓
  - m6 exact canonical replay: `idempotent_noop=True, predicate=exact_canonical_replay, ok=True` ✓
  - m6 changed replay (budget_scope altered): `replay_conflict` → `RESUME_BRIEF_STALE` ✓
- **Guards**:
  - NO state fallback / NO reconciler / NO next-spawn invoked by `write_resume_pair` or `validate_resume_pair` — the pair contract is fail-closed; a parent never writes either artifact.
  - NO `RESUME_BRIEF_AUTO_REFRESH=0` bypass (no env-var check, no auto-refresh branch — the writer only runs on **explicit, authorized** child invocation with a valid tuple).
  - NO TUI/RPC/JSON/localhost introduced — the change is pure Python at the canonical auto-bridge delivery surface (`scripts/opencode_auto_bridge.py`), composed additively with the existing `resolve_continuation` / `append_isolation` functions (US-0156 / DEC-0152 semantics untouched).

## T-003 — template writer parity + reason-code semantics (AC-3, AC-5, AC-7) — DONE

- **Timestamp**: 2026-10-04T02:42:00Z
- **Files modified (this task)**: `template/scripts/opencode_auto_bridge.py` — byte-identical mirror of the active file (copied; no content diff).
- **Byte parity (SHA-256)**:
  - `scripts/opencode_auto_bridge.py` = `3FE7779CEA9E3F0173DA2329CD04354B1386FAB5D431CB668EF118982A4039CB`
  - `template/scripts/opencode_auto_bridge.py` = `3FE7779CEA9E3F0173DA2329CD04354B1386FAB5D431CB668EF118982A4039CB`
  - **MATCH**.
- **Negative-semantics proof (per T-002 matrix)**:
  - `pair_record_not_object` (non-dict state) → `RESUME_BRIEF_UNPARSEABLE` (syntax) ✓
  - `malformed_record_key`, `malformed_field:*`, `strict_proof_ttl_invalid`, `strict_proof_hash_invalid` → `RESUME_BRIEF_UNPARSEABLE` (syntax) ✓
  - `absent_required_*`, `fresh_marker_reused_or_missing`, `strict_proof_phase_invalid`, `strict_proof_id_missing`, `unauthorized_writer_role`, `writer_role_mismatch`, `pair_key_mismatch`, `tuple_conflict:*`, `replay_conflict`, `proof_issued_at_missing` → `RESUME_BRIEF_STALE` (predicate retained) ✓
  - No `RESUME_BRIEF_STALE` case is silently downgraded to `RESUME_BRIEF_UNPARSEABLE`, and no syntax case is silently reclassified as STALE.

## T-004 — paired command / reference contract (AC-1, AC-4, AC-7) — DONE

- **Timestamp**: 2026-10-04T02:48:00Z
- **Files modified (this task)**, both active + template (byte-identical per pair; written to template side first, then copied to active):
  - `.opencode/commands/research.md` + `template/.opencode/commands/research.md` — added a `## Continuation contract (BUG-0035 / DEC-0153)` section: child-owned state-first pair, exact pair key + tuple, parent stays validate-and-spawn-only, no state fallback, no auto-refresh, no next-phase on malformed/conflicting evidence.
  - `.opencode/commands/architecture.md` + `template/.opencode/commands/architecture.md` — identical `## Continuation contract (BUG-0035 / DEC-0153)` section.
  - `.opencode/commands/auto.md` + `template/.opencode/commands/auto.md` — added a `BUG-0035 / DEC-0153 — paired continuation ownership` paragraph: parent is permanently read/validate/spawn-only; `RESUME_BRIEF_STALE` / `RESUME_BRIEF_UNPARSEABLE` fail closed; **no** TUI/RPC/JSON/localhost restoration; existing US-0156 / DEC-0152 step list preserved verbatim.
  - `docs/engineering/auto-orchestration-reference.md` + `template/docs/engineering/auto-orchestration-reference.md` — added a new `## Paired continuation ownership (BUG-0035 / DEC-0153)` section between the fail-fast error-code contract and `## Continuous multi-phase execution (US-0088)`: owner-of-pair, parent-boundary, reason-code vocabulary, exact-replay no-op rule, and `RESUME_BRIEF_AUTO_REFRESH=0` absolute prohibition.
  - `.cursor/commands/research.md` + `template/.cursor/commands/research.md` — added `## Continuation contract (BUG-0035 / DEC-0153)` section at end of file.
  - `.cursor/commands/architecture.md` + `template/.cursor/commands/architecture.md` — added `## Continuation contract (BUG-0035 / DEC-0153)` section immediately after `## Execution model`.
  - `.cursor/commands/auto.md` + `template/.cursor/commands/auto.md` — added `## Paired continuation ownership (BUG-0035 / DEC-0153)` section immediately before `## Fail-fast error code contract`; points to the reference + runbook sections.
- **Byte parity (SHA-256)**, active vs template:
  - `.opencode/commands/research.md` `026D3C…9D3772` ↔ `template/.opencode/commands/research.md` `026D3C…9D3772` **MATCH**
  - `.opencode/commands/architecture.md` `F6B7DA…53AC87` ↔ `template/.opencode/commands/architecture.md` `F6B7DA…53AC87` **MATCH**
  - `.opencode/commands/auto.md` `4C77D2…5C3F81AC` ↔ `template/.opencode/commands/auto.md` `4C77D2…5C3F81AC` **MATCH**
  - `docs/engineering/auto-orchestration-reference.md` `D4694D…774B488387529C` ↔ `template/docs/engineering/auto-orchestration-reference.md` `D4694D…774B488387529C` **MATCH**
  - `.cursor/commands/research.md` `2DA832…63965FE301` ↔ `template/.cursor/commands/research.md` `2DA832…63965FE301` **MATCH**
  - `.cursor/commands/architecture.md` `31DD1B…402CB08AD6705E5E` ↔ `template/.cursor/commands/architecture.md` `31DD1B…402CB08AD6705E5E` **MATCH**
  - `.cursor/commands/auto.md` `979D7A…9FE452B42` ↔ `template/.cursor/commands/auto.md` `979D7A…9FE452B42` **MATCH**
- **Guard #4 verifications**: no TUI/RPC/JSON template/localhost surface restored. All three `.opencode/commands/auto.md` surfaces keep the explicit "Retired and forbidden" paragraph.
- **Guard #5 verifications**: no `/auto` invocation, no subagent spawn, no phase work outside `/execute`. All changes are **additive** (append / insert only); no deletion of existing US-0156/DEC-0152 content.

## T-005 — paired runbook remediation (AC-5, AC-7) — DONE

- **Timestamp**: 2026-10-04T02:52:00Z
- **Files modified (this task)**:
  - `template/docs/engineering/runbook.md` — inserted a new `## BUG-0035 — RESUME_BRIEF_STALE / paired-continuation remediation (DEC-0153)` section immediately after the "Stop-condition preservation" block of the existing `## Auto continuation resume contract` section, and before `## Per-phase subagent isolation evidence (US-0048 / DEC-0029)`. Section content:
    - Explicit "Stop and report" step — required to record the **failed predicate**, the **expected record key** `orchestrator_run_id|work_item_kind|bug_id|completed_phase|runtime_proof_id`, the bug ID, completed/next phase/role, and fresh marker.
    - **Do NOT hand-edit** the resume brief or state checkpoint.
    - **Preserve evidence** — retain both halves of the pair with exact bytes.
    - **Obtain a fresh authorized child** — one role, one fresh session, new `fresh_context_marker`, new strict-proof tuple, for the completed phase (child writes state first, validates, then brief).
    - **Independently re-resolve** — parent re-runs `validate_resume_pair(...)`; only a valid pair authorizes the next-phase spawn.
    - Reason-code → action table (`RESUME_BRIEF_UNPARSEABLE`, `RESUME_BRIEF_STALE`, `RESUME_BRIEF_MISSING`, `pair_key_mismatch`, `replay_conflict`).
    - **Forbidden remediation (non-negotiable)**: hand-edit, auto-refresh, state-only fallback, reconciler, next-spawn on invalid evidence, treating a completed child's prior evidence as permission.
    - **Provenance note (DEC-0153 §4)**: the child is the sole authorized writer; the parent is read/validate/spawn-only; DEC-0069 / DEC-0038 / DEC-0153 compose (not amended).
  - `docs/engineering/runbook.md` — byte-identical mirror (copied from template side).
- **Byte parity (SHA-256)**:
  - `docs/engineering/runbook.md` `0F483DE94EB1422063B1CCD6044A1023FBBF28531357F534A19CA8835744AD44` ↔ `template/docs/engineering/runbook.md` `0F483DE94EB1422063B1CCD6044A1023FBBF28531357F534A19CA8835744AD44` **MATCH**
- **Guard #7 verifications**: section explicitly states "RESUME_BRIEF_AUTO_REFRESH=0 remains an absolute prohibition" and forbids state-only fallback, reconciler, and next-spawn on invalid evidence.
- **Guard #3 verifications**: US-0119 / autonomy stop-matrix section (which has its own independent `validate_autonomy_stop_matrix.py` self-test) is untouched.

## T-006 — active contract fixtures (AC-1..AC-6) — DONE

- **Timestamp**: 2026-10-04T02:58:00Z
- **Files created (this task)**:
  - `tests/bug0035_continuation_pair_test.py` — 7 named `test_bug0035_*` groups, matching the locked names in `sprints/S0165/sprint.md` "Test contract":
    1. `test_bug0035_lawful_child_pair_allows_architecture` — state-first lawful research pair yields the sole schedulable architecture continuation; `next_scheduled_phase=architecture`; no parent edit.
    2. `test_bug0035_parent_remains_edit_denied` — `auto`/`parent`/`orchestrator`/empty role all → `RESUME_BRIEF_STALE`, `unauthorized_writer_role`; active + template tech-lead maps contain **exactly one** `handoffs/resume_brief.md` allow, deny-first preserved, no `handoffs/**` / `*` broad grant; auto maps remain `edit: deny`.
    3. `test_bug0035_fresh_marker_and_strict_proof_required` — missing/malformed fresh marker → `RESUME_BRIEF_STALE`; malformed proof_hash → `RESUME_BRIEF_UNPARSEABLE`; non-positive TTL → `RESUME_BRIEF_UNPARSEABLE`.
    4. `test_bug0035_missing_or_malformed_pair_stops` — empty brief → `RESUME_BRIEF_STALE` (absent-required); non-dict state → `RESUME_BRIEF_UNPARSEABLE` (syntax); dropped proof_hash → `RESUME_BRIEF_STALE`; `next_scheduled_phase=None` in all three.
    5. `test_bug0035_tuple_conflict_stops` — differing next_phase → `tuple_conflict:next_scheduled_phase`; differing next_role → `tuple_conflict:next_scheduled_role`; differing proof_id → `pair_key_mismatch`; all `RESUME_BRIEF_STALE`, no spawn.
    6. `test_bug0035_unauthorized_replay_and_idempotence` — `writer_role=dev` on tech-lead pair → `writer_role_mismatch`; exact canonical replay → `idempotent_noop=true, predicate=exact_canonical_replay`; changed budget_scope under same key → `replay_conflict`.
    7. `test_bug0035_active_template_parity_and_runbook_remediation` — byte-parity assertion across 9 file-pairs (tech-lead / dev / auto agent maps, 3 opencode commands, bridge, reference, runbook) + test-file mirror + runbook remediation text contains `BUG-0035`, `RESUME_BRIEF_STALE`, `RESUME_BRIEF_AUTO_REFRESH`, "Do NOT hand-edit".
  - All 7 tests **fixture/mock-based** (use `bridge.validate_resume_pair(...)` against in-memory dicts + real on-disk agent/map files read for byte assertions); no live OpenCode host claim (UAT_PROBE_FORBIDDEN held).
- **Tests run**: `python -m pytest tests/bug0035_continuation_pair_test.py -v` → **7 passed** in 0.05 s, **exit 0**.

## T-007 — template test mirror + full verification (AC-6, AC-7) — DONE

- **Timestamp**: 2026-10-04T03:01:00Z
- **Files created (this task)**:
  - `template/tests/bug0035_continuation_pair_test.py` — byte-identical mirror of the active test file (copied from active; template-side test resolves `SELF.name == "template"` → `TEMPLATE_ROOT = SELF`, `ACTIVE_ROOT = SELF.parent`, so the mirror reads the active repo's tech-lead map, command files, bridge, reference, runbook, and test mirror — exactly the same assertions as the active file, but driven from the template path).
- **Byte parity (SHA-256)**:
  - `tests/bug0035_continuation_pair_test.py` `671BAFD9F772D1B38FAB5E9FD352817BC9BFEDB263FF405BE6FB7D72AF639CD7` ↔ `template/tests/bug0035_continuation_pair_test.py` `671BAFD9F772D1B38FAB5E9FD352817BC9BFEDB263FF405BE6FB7D72AF639CD7` **MATCH**
- **Test runs (post-all-writes)**:
  - `python -m pytest tests/bug0035_continuation_pair_test.py -v` → **7 passed in 0.05 s — exit 0** (active).
  - `python -m pytest template/tests/bug0035_continuation_pair_test.py -q` → **7 passed in 0.07 s — exit 0** (template).
  - `python -m pytest tests/bug0027_opencode_manual_phase_persist_test.py -q` → **10 passed in 0.84 s — exit 0** (compose regression; BUG-0027 persistence intact; the operator-bootstrap grant on the dev map is untouched).
  - `python -m pytest tests/us0156_contract_test.py -q -rf` → **10 passed in 0.89 s — exit 0** (compose regression).
  - `python -m pytest tests/bug0015_contract_test.py tests/bug0016_contract_test.py tests/bug0018_opencode_auto_ownership_test.py tests/bug0019_opencode_auto_slash_listing_test.py -q -rf` → **7 passed, 20 skipped — exit 0**.
  - `python -m pytest tests/bug0021_opencode_cli_tui_plugin_load_test.py tests/bug0023_opencode_cli_tui_dispatch_rpc_test.py tests/intake_bug_resume_brief_bug0005_test.py -q -rf` → **6 passed, 16 skipped — exit 0** (BUG-0005 lineage + BUG-0021/0023 TUI/RPC composition intact).
  - `python -m pytest tests/us0121_host_mode_test.py -q -rf` → **14 passed in 226 s — exit 0** (host-mode regression intact; slow due to fixture materialization).
  - `python -m pytest tests/us0119_autonomy_preset_test.py -q -rf` → **8 passed, 2 failed — exit 1**. The 2 failures (`test_us0119_matrix_validator_passes`, `test_us0119_matrix_no_orphan_codes`) are the **pre-existing matrix-reference failures** documented in the BUG-0032 sprint-plan handoff (2026-09-29): "US-0119 has two unrelated pre-existing matrix-reference failures; do not weaken it." They concern `scripts/validate_autonomy_stop_matrix.py` and the stop-matrix YAML — surfaces I did not touch (guard #3), and the BUG-0032 handoff explicitly forbids weakening them. The 20 pre-existing failures on `tests/auto_command_contract_test.py` (`test_bug0009_active_ci_five_job_inventory`, `test_runbook_and_handoff_document_remote_evidence_tuple`, `test_us0101_template_agent_model_aliases`) are likewise pre-existing and on files I did not touch (`handoffs/qa_to_verify_work.md`, `template/.cursor/agents/po.mdc`, CI job inventory) — guard #3 lists the stop-matrix / sibling surfaces as forbidden, so I do not repair them.
  - `python scripts/check_intake_template_parity.py --repo . --scope bug-0027` → `[INTAKE_TEMPLATE_PARITY_OK] scope=bug-0027` **exit 0** (fallback parity scope per T-007 instructions; there is no `--scope bug-0035` in the current tool).
  - `python scripts/check_intake_template_parity.py --repo . --scope opencode-adapter` → **exit 2** — pre-existing drift on `tests/bug0016_contract_test.py` (active 9897B vs template 9810B; SHA-256 `105BF4A8…A8138` ≠ `E75863D3…B3E96`), **not created by this phase** (I did not touch that file; the drift predates this run — see `git status`).
  - **Post-write validator (final gate)**: `python scripts/bug_issue_validate.py --repo . --check-acceptance` → `[BUG_VALIDATION_OK]` **exit 0** AFTER all writes.
  - **Post-write validator (T-007 gate)**: `python scripts/bug_issue_validate.py --repo . --check-acceptance` → `[BUG_VALIDATION_OK]` **exit 0**.

## Post-write parity summary (SHA-256, active = template for every pair this phase touched or mirrored)

| Active | Template | Hash | Parity |
|---|---|---|---|
| `.opencode/agents/tech-lead.md` | `template/.opencode/agents/tech-lead.md` | `A4CB1B6C…85E72AC6` | **MATCH** (T-001) |
| `.opencode/agents/dev.md` | `template/.opencode/agents/dev.md` | `D41F7084…8804D404C8` | **MATCH** (bootstrap grant unchanged) |
| `.opencode/agents/auto.md` | `template/.opencode/agents/auto.md` | `1B443572…F37A748096` | **MATCH** (parent unchanged) |
| `scripts/opencode_auto_bridge.py` | `template/scripts/opencode_auto_bridge.py` | `3FE7779C…A4039CB` | **MATCH** (T-002/T-003) |
| `.opencode/commands/research.md` | `template/.opencode/commands/research.md` | `026D3C5D…E9D3772` | **MATCH** (T-004) |
| `.opencode/commands/architecture.md` | `template/.opencode/commands/architecture.md` | `F6B7DAB8…AC53AC87` | **MATCH** (T-004) |
| `.opencode/commands/auto.md` | `template/.opencode/commands/auto.md` | `4C77D295…D5C3F81AC` | **MATCH** (T-004) |
| `docs/engineering/auto-orchestration-reference.md` | `template/docs/engineering/auto-orchestration-reference.md` | `D4694D53…74B488387529C` | **MATCH** (T-004) |
| `.cursor/commands/research.md` | `template/.cursor/commands/research.md` | `2DA8328D…4D0FF69C01` | **MATCH** (T-004) |
| `.cursor/commands/architecture.md` | `template/.cursor/commands/architecture.md` | `31DD1B46…08AD6705E5E` | **MATCH** (T-004) |
| `.cursor/commands/auto.md` | `template/.cursor/commands/auto.md` | `979D7AA7…9FE452B42` | **MATCH** (T-004) |
| `docs/engineering/runbook.md` | `template/docs/engineering/runbook.md` | `0F483DE9…8835744AD44` | **MATCH** (T-005) |
| `tests/bug0035_continuation_pair_test.py` | `template/tests/bug0035_continuation_pair_test.py` | `671BAFD9…A39CD7` | **MATCH** (T-006 / T-007) |

## Completion evidence gates (from tasks.md) — status

- [x] Seven `test_bug0035_*` groups pass in active and template suites. (active 7/7, template 7/7)
- [x] Parent remains edit-denied; only the one child permission allow was added. (guard #10 + T-001 matrix)
- [x] Every invalid pair path is fail-closed and does not schedule architecture. (T-002 self-test matrix + group 2/4/5/6 tests)
- [x] Exact canonical replay alone is an idempotent no-op. (group 6 test — `idempotent_noop=true, predicate=exact_canonical_replay`)
- [x] Active/template parity holds across maps, bridge, commands/reference, runbook, and test file. (parity table above)
- [x] `bug_issue_validate.py --repo . --check-acceptance` exits 0. (pre-write exit 0 + post-write exit 0)
- [x] BUG-0035 status and acceptance remain unchanged by execute; closure owns the flip. (guards #1; not flipped this phase)

## Execute evidence (required by tasks.md)

- Verdict: **EXECUTE_PASS**
- All 8 tasks (T-anch + T-001..T-007) DONE, in the locked order.
- Pre-write validator exit 0; post-write validator exit 0.
- Active 7/7 + template 7/7 + bug0027 10/10 + us0156 10/10 + bug0015+0016+0018+0019 7/7 + bug0021+0023+intake_bug0005 6/6 + us0121 14/14; us0119 8/10 (2 pre-existing unrelated failures documented in the BUG-0032 sprint-plan handoff); the 20 pre-existing `auto_command_contract_test` failures are on surfaces I did not touch (guard #3).
- All active/template pairs byte-identical (13 pairs MATCH).
- BUG-0035 remains **OPEN**, P0, all 7 ACs **unchecked**; acceptance L226 `- [ ]`; backlog `### BUG-0035` `Status: OPEN`. Closure owns the flip per US-0045.
- Next phase: **`/qa` in a fresh qa context** (per handoff contract; do NOT run `/qa` from this dev context).

---

**Stop condition (this phase)**: STOP after dev_to_qa.md handoff is authored. Per `.opencode/agents/dev.md` bootstrap grant and BUG-0006 spawn-only rule, do NOT spawn `/qa`, `/verify-work`, `/release`, `/closure`, `/auto`, `/refresh-context`, or any subsequent phase from this dev context. The orchestrator (not this dev context) owns the next spawn.
