# Sprint S0183 progress — BUG-0038

- status: **EXECUTE_PASS**
- verdict: implementation validation PASS; continuation PAIR WRITTEN (state-first); decision_gate=false; next_scheduled_phase=qa; next_scheduled_role=qa
- tasks: T-anch + T-001..T-005 complete (6)
- bug: BUG-0038 remains **OPEN**. AC-1..AC-5 remain unchecked. Closure owns the DONE flip.
- fresh_context_marker: `dev-BUG0038-execute-20261018T184310Z-fresh`
- runtime_proof_id: `rp-repair-20261018-bug0038-execute-dev-20261018T184310Z-BUG-0038`
- proof_hash: `3c21ef8613eddb0b842f213878d7cef12cc2eed1068a1f0c85efb2c6b6a851a3` (MATCH x2)
- validation: `python -m pytest tests/bug0038_qa_resume_brief_permission_contract_test.py -v` → **5 passed**; QA-map byte-parity SHA256 `17226B8702CD49CCE177286C3CEE64947F9426C97C683C0F1FDC3E6B025A7744` (both trees identical); exactly-one narrow allow per tree; no write_resume_pair/state-fallback/auto-repair in deliverables.

## Execute delivery

### T-anch — baseline verified (read-only)
- Both QA maps byte-identical (SHA256 match), exactly one narrow allow at deny-first position (L6→L7), count==1.
- PHASE_ROLE_MATRIX: `qa→qa` (L105), `verify-work→qa` (L106). All six deduped roles (po, tech-lead, qa, dev, release, curator) have brief grant in both trees.
- Parent/orchestrator (`auto.md`): `edit: deny`, no brief/state/QA-map/matrix/Task-allowlist write grant.
- Continuation-contract invariant: `RESUME_BRIEF_AUTO_REFRESH=0` (architecture-fixed; all prior BUG-0038 tuples carry 0).
- Note: live `.cursor/scratchpad.md` L647 and `.its-magic/config.json` L336 show `RESUME_BRIEF_AUTO_REFRESH=1` (operator `AUTONOMY_PRESET=full`). Out of scope; not modified.

### T-001 + T-002 — verified NO-OP
- Both QA maps already correct. No edits made. git diff confirms the single `+` line each is pre-existing (not from this session).

### T-003 — operator-only boundary classifier
- Delivered: `scripts/permission_matrix_repair_lib.py`
- Pure, deterministic `PERMISSION_MATRIX_REPAIR_REQUIRES_OPERATOR` classifier.
- Functions: `classify_qa_map_pair()`, `assert_no_continuation_side_effects()`, `is_healthy()`, `is_operator_required()`.
- Constants: `QA_MAP_PAIR_HEALTHY`, `PERMISSION_MATRIX_REPAIR_REQUIRES_OPERATOR`, `QA_MAP_ACTIVE`, `QA_MAP_TEMPLATE`, `RESUME_BRIEF_PATH`, `DIAGNOSTIC_PATHS`, `NARROW_ALLOW_ENTRY`, `DENY_FIRST_ENTRY`, fault labels.
- No writes, no scheduling, no auto-repair.

### T-004 — contract test
- Delivered: `tests/bug0038_qa_resume_brief_permission_contract_test.py` (exactly 5 markers)
- Markers:
  1. `test_bug0038_qa_owns_qa_and_verify_work`
  2. `test_bug0038_qa_narrow_allow_parity_and_deny_first`
  3. `test_bug0038_every_phase_writer_has_brief_grant_in_both_trees`
  4. `test_bug0038_parent_orchestrator_remain_negative_permission_surfaces`
  5. `test_bug0038_unrepairable_map_requires_operator_without_pair_or_schedule`
- Result: 5/5 PASS.

### T-005 — final invariant verification
- QA-map byte parity confirmed (SHA256 identical, both trees).
- Exactly-one allow confirmed (count==1 each tree).
- No write_resume_pair / state-fallback / auto-repair references in new lib+test.
- git status: only two new untracked files (`scripts/permission_matrix_repair_lib.py`, `tests/bug0038_qa_resume_brief_permission_contract_test.py`). No existing file modified.

## Background note (not acted upon)
- `test_bug0035_active_template_parity_and_runbook_remediation` (in `tests/bug0035_continuation_pair_test.py` L304) may fail in the full harness. Pre-existing; outside BUG-0038 scope. Not fixed, not suppressed.
