# Sprint S0183 — Task checklist (BUG-0038)

Six planned tasks: **T-anch + T-001..T-005**, 1:1 with `# BUG-0038` seeds and
within `SPRINT_MAX_TASKS=12`. Execute in order. Leave all boxes unchecked until
execute. BUG-0038 remains OPEN and AC-1..AC-5 remain unchecked.

## Checklist

- [ ] **T-anch — locked baseline and traceability (all ACs, no product change):** Read R-0173 A1 and `# BUG-0038`. Confirm BUG-0038 is OPEN/P0 with AC-1..AC-5 and acceptance row unchecked. Inventory active/template QA maps; establish byte parity, deny-first position, existing allows, all denials/security-hard boundaries, and exact `handoffs/resume_brief.md` count. Confirm the phase matrix maps both `qa` and `verify-work` to QA. Confirm parent/orchestrator has no brief, state, QA-map, matrix, or Task-allowlist write grant. Confirm `RESUME_BRIEF_AUTO_REFRESH=0` and `CROSS_MODEL_REVIEW=0`.
  **Done-when:** baseline identifies the sole A1 delta without changing status, ACs, permissions, or continuation artifacts.

- [ ] **T-001 — active QA narrow allow (AC-1, AC-2):** In `.opencode/agents/qa.md`, place exactly one `"handoffs/resume_brief.md": allow` immediately after `"**": deny`. Retain every existing allow and deny, including security-hard denials; retain deny-first ordering; add no wildcard or broad handoff grant. The shared QA writer serves both `qa` and `verify-work`. Do not grant parent/orchestrator paths.
  **Done-when:** the active map has the exact allow exactly once at the locked position and no other authority delta.

- [ ] **T-002 — template QA parity (AC-1, AC-2):** Apply the same sole delta to `template/.opencode/agents/qa.md`, then make active/template QA maps byte-identical. Do not modify another role map.
  **Done-when:** both QA-owned phases have the narrow brief permission through QA, with byte-identical, deny-first maps and retained security boundaries.

- [ ] **T-003 — operator-only unrepairable-map boundary (AC-5):** Implement deterministic `PERMISSION_MATRIX_REPAIR_REQUIRES_OPERATOR` for a missing, malformed, non-parity, or unlawfully repairable QA map pair. Its diagnostic names `.opencode/agents/qa.md`, `template/.opencode/agents/qa.md`, and `handoffs/resume_brief.md`; it writes neither `docs/engineering/state.md` nor `handoffs/resume_brief.md`, schedules no phase, and makes no automatic repair.
  **Done-when:** authorized operator action followed by validation is the only recovery, with no continuation-pair or scheduling side effect.

- [ ] **T-004 — phase-writer contract regression (AC-3, AC-4, AC-5):** Add only `tests/bug0038_qa_resume_brief_permission_contract_test.py` with exactly: `test_bug0038_qa_owns_qa_and_verify_work`; `test_bug0038_qa_narrow_allow_parity_and_deny_first`; `test_bug0038_every_phase_writer_has_brief_grant_in_both_trees`; `test_bug0038_parent_orchestrator_remain_negative_permission_surfaces`; and `test_bug0038_unrepairable_map_requires_operator_without_pair_or_schedule`. Derive writers from `PHASE_ROLE_MATRIX`, deduplicate role values, and check active/template trees; do not infer parent authority from the matrix. Tests do not read secrets, run a live host, or write continuation artifacts.
  **Done-when:** all five locked markers prove QA ownership, narrow parity/denials, matrix-wide coverage, negative parent authority, and operator-only behavior.

- [ ] **T-005 — invariant and parity verification (AC-2, AC-3):** Recheck QA-map byte parity and exact-one narrow allow; re-run the BUG-0038 contract file. Verify no parent/orchestrator grant, no matrix/Task-allowlist edit, no `write_resume_pair`, state fallback, or automatic map repair; preserve DEC-0153 ordering, `RESUME_BRIEF_AUTO_REFRESH=0`, `CROSS_MODEL_REVIEW=0`, and security-hard denials. Carry the inherited BUG-0035 runbook-token failure only as background; do not fix or suppress it.
  **Done-when:** contract evidence and byte comparison confirm all locked negative boundaries remain unchanged.

## Execute boundary

BUG-0038 stays OPEN; AC-1..AC-5 and its acceptance row stay unchecked. Closure
owns any DONE flip. Execute is authorized now: the 4 non-allow-listed sprint
artifacts (`progress.md`, `uat.md`, `uat.json`, `plan-verify.json`) are
dev/qa-owned per S0163/S0166, so their isolation-guard denial is
honored-not-forced and is **not** a blocker or decision_gate. This repair
records the successor DEC-0153 state-first continuation pair and authorizes
`/execute` in a fresh dev context.
