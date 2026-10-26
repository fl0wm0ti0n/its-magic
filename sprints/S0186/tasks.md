# Sprint S0186 — Task checklist (BUG-0044)

Six planned tasks: **T-anch + T-001..T-005**, 1:1 with the `# BUG-0044` task
seeds (R-0176 approach A, Locks 1–5) and within `SPRINT_MAX_TASKS=12`. Execute
in order. Leave all boxes unchecked until execute. BUG-0044 remains OPEN and
AC-1..AC-5 remain unchecked. Companion **DEC-0156** is consumed, not re-decided.

> No production code, command-file edits, test writes, or `scripts/` edits are
> authored in this phase — dev owns delivery in `/execute`. This plan only
> names the target files and locks the per-task acceptance checks.

## Checklist

- [ ] **T-anch — locked baseline and traceability (all ACs, no product change):** Read R-0176 (F1–F7 + risk register + rejected alternatives) and `docs/engineering/architecture.md` `# BUG-0044` (Locks 1–5 + task seeds). Confirm BUG-0044 is OPEN/P1 with AC-1..AC-5 and its acceptance row (`docs/product/acceptance.md` L245) unchecked. Inventory the 7-command × 4-host remediation set: `.opencode/commands/{discovery,execute,sprint-plan,qa,verify-work,release,closure}.md` (OpenCode primary) and their `.cursor/commands/` + `template/.opencode/commands/` + `template/.cursor/commands/` twins (all 28 files exist; each active/template pair currently byte-identical — record SHA-256 prefixes). Confirm the parent `auto.md` (both hosts) is OUT of the remediation set (already spawn-only). Confirm the pair SOT `scripts/opencode_auto_bridge.py` (`PAIR_LOCKED_FIELDS`, `build_resume_pair_key`, `validate_resume_pair`, `_write_resume_pointer_block`, `write_resume_pair`, `reset_resume_pair_registry_for_tests`) and `token_cost_lib.compute_strict_proof_hash` are the reusable, unedited SOTs. Confirm no new reason code (reuse `RESUME_BRIEF_STALE` / `RESUME_BRIEF_UNPARSEABLE` + `RUNTIME_PROOF_*` + `RELEASE_UAT_INCOMPLETE`) and no parent authority. Confirm `RESUME_BRIEF_AUTO_REFRESH=0` and `CROSS_MODEL_REVIEW=0`.
  **Done-when:** the baseline matches the 7-command set, the pair SOT, the 5 locks, and the no-new-code/no-parent-authority invariants, without changing status, ACs, content, or continuation artifacts.

- [ ] **T-001 — Lock-1 contract section on the 7 OpenCode remediation commands (AC-1, AC-3):** In each of `.opencode/commands/discovery.md`, `execute.md`, `sprint-plan.md`, `qa.md`, `verify-work.md`, `release.md`, `closure.md`, append the exact Lock-1 section "## Continuation + terminal-state reconcile contract (BUG-0044 / DEC-0156, composes on DEC-0153 / DEC-0038)" as the **last** section, immediately before the file's final `STOP` / hand-off line (after any "Validator bridge" or "Cross-phase ownership guard" section). The section must contain the 5 numbered pre-STOP steps (reconcile owned lifecycle artifacts per Lock 3 → append state-bottom → compute strict 6-tuple hash via `token_cost_lib.compute_strict_proof_hash` → prepend byte-identical brief-top via temp-file-plus-replace → re-read both + assert byte-identical + `validate_resume_pair(writer_role=<own role>)` ok before STOP) and the spawn-only / fail-closed / no-spawn clauses verbatim. Do not edit any other file, the parent `auto.md`, `intake`/`plan-verify`/`refresh-context`, or the permission map.
  **Done-when:** each of the 7 OpenCode command files carries the Lock-1 section exactly once, verbatim, as the last section before STOP, with no other content changed.

- [ ] **T-002 — Lock-2 host-parity twins byte-identical (AC-1, AC-2):** Apply the identical Lock-1 append to `.cursor/commands/<c>.md` and to `template/.opencode/commands/<c>.md` + `template/.cursor/commands/<c>.md` for each `c ∈ {discovery, execute, sprint-plan, qa, verify-work, release, closure}`, then verify every active/template pair is **byte-identical** (14 command-file pairs, 28 files total, SHA-256 per file). The `.cursor` twin content differs from the OpenCode twin only by host-specific framing — the appended contract section itself is byte-identical across all 4 hosts.
  **Done-when:** all 14 active/template command pairs are byte-identical and each carries the Lock-1 contract section exactly once.

- [ ] **T-003 — A2 read-only `phase_boundary_self_check` helper (AC-1, AC-4):** In `scripts/opencode_auto_bridge.py` (+ `template/scripts/opencode_auto_bridge.py` byte-identical), add `def phase_boundary_self_check(repo: Path, *, writer_role: str, state_json: str, brief_json: str) -> dict:`. It must be read-only and reason-coded: parse `state_json` / `brief_json` (syntax error → `RESUME_BRIEF_UNPARSEABLE`), assert byte-identity in normalized canonical form, recompute the strict 6-tuple hash via `token_cost_lib.compute_strict_proof_hash` (mismatch → `RESUME_BRIEF_STALE` predicate `proof_hash_mismatch`), and return the verbatim `validate_resume_pair(writer_role=writer_role, state_tuple=..., brief_tuple=...)` result so the retained predicate is preserved. A `writer_role` of `auto`/`parent`/`orchestrator` is rejected by the composed `validate_resume_pair` → `RESUME_BRIEF_STALE` / `unauthorized_writer_role`. It writes nothing and grants NO parent authority. Do NOT re-implement pair logic; reuse `reset_resume_pair_registry_for_tests` for test isolation; do NOT edit `token_cost_lib.py`.
  **Done-when:** the helper is present in both `opencode_auto_bridge.py` twins, composes on the existing SOT, is byte-identical across the pair, and rejects parent-role writers without any new pair-logic path.

- [ ] **T-004 — Lock-3 terminal-state-reconcile table + verify-work UAT fixture (AC-2, AC-4):** Ensure the Lock-3 per-phase terminal-state-reconcile table (discovery/research/architecture/sprint-plan/execute/qa/verify-work/release/closure rows) is referenced by the Lock-1 contract section added in T-001/T-002 (the section points to `docs/engineering/architecture.md` `# BUG-0044` Lock 3), and that the canonical verify-work row — `sprints/<S>/uat.json` + `uat.md` → `status=VERIFY_PASS` / `phase_id=verify-work` / `uat_lifecycle=verify_work_complete_release_pending` — is the documented example. Prepare the temp `uat.json` lifecycle fixtures (terminal verify-work state + the stale QA-state state `status=QA_PASS` / `phase_id=qa` / `uat_lifecycle=qa_complete_verify_work_pending`) that test #4 will consume. Do not edit `docs/engineering/architecture.md` (the table already lives there); this task only wires the reference + fixtures.
  **Done-when:** every remediation command's contract section references the Lock-3 table, and the two `uat.json` fixtures (terminal + stale) are available for the contract test.

- [ ] **T-005 — AC-4 contract test `tests/bug0044_phase_boundary_pair_contract_test.py` (AC-1..AC-5):** Author the 6-marker contract test (repo convention `bug####_*_test.py`; markers `test_bug0044_*`), using `reset_resume_pair_registry_for_tests` for isolation and temp-repo fixtures (no live `.env`, no network, no publish):
  1. `test_bug0044_command_contract_presence_and_parity` — every remediation command carries the Lock-1 section on OpenCode (primary) with `.cursor` + template byte-parity (static 7×4 file-set fixtures).
  2. `test_bug0044_pair_write_byte_identity` — a fixture child writes state-bottom + brief-top → byte-identical JSON; 20/20 `PAIR_LOCKED_FIELDS`; strict 6-tuple hash MATCH via `compute_strict_proof_hash` + independent compact sorted-key recompute.
  3. `test_bug0044_missing_conflicting_pair_fail_closed` — absent pair / `pair_key_mismatch` / `tuple_conflict` → deterministic `RESUME_BRIEF_STALE` with predicate retained (no silent continue, no state-alone fallback).
  4. `test_bug0044_terminal_state_reconcile_uat` — `uat.json` qa→verify-work fixture: child leaves it terminal; stale QA-state fixture still fails the release gate with `RELEASE_UAT_INCOMPLETE`.
  5. `test_bug0044_no_parent_proof_minting` — `writer_role ∈ {auto, parent, orchestrator}` → `RESUME_BRIEF_STALE`/`unauthorized_writer_role`; `RESUME_BRIEF_AUTO_REFRESH=0` absolute.
  6. `test_bug0044_replay_idempotence` — exact canonical replay → `idempotent_noop=true`; conflicting same-key replay → `RESUME_BRIEF_STALE`/`replay_conflict`.
  **Done-when:** all 6 `test_bug0044_*` markers pass; the fail-closed + parent-rejection cases assert the locked reason codes; no new reason code is introduced.

## AC traceability

| AC | Tasks | Backlog anchor | Research | Architecture | DEC |
|---|---|---|---|---|---|
| AC-1 | T-001, T-002, T-003, T-005 | `### BUG-0044` AC-1 | R-0176 (F2) | `# BUG-0044` Lock 1/2/4 | DEC-0156 §1/§2 |
| AC-2 | T-002, T-004, T-005 | `### BUG-0044` AC-2 | R-0176 (F3) | `# BUG-0044` Lock 3 | DEC-0156 §4 |
| AC-3 | T-001, T-003, T-005 | `### BUG-0044` AC-3 | R-0176 (F4) | `# BUG-0044` Lock 4 | DEC-0156 §5 |
| AC-4 | T-003, T-004, T-005 | `### BUG-0044` AC-4 | R-0176 (F5) | `# BUG-0044` Lock 5 | DEC-0156 §6 |
| AC-5 | T-anch, T-001..T-005 | `### BUG-0044` AC-5 | R-0176 (F6) | `# BUG-0044` (Risks) | DEC-0156 §5/Consequences |

T-anch links every task → AC → backlog row → research R-0176 → architecture
`# BUG-0044` → DEC-0156. Every AC is covered; no split.

## Execute boundary

BUG-0044 stays OPEN/P1; AC-1..AC-5 and its acceptance row stay unchecked.
Closure owns any DONE flip. Execute is authorized now: the non-allow-listed
sprint artifacts (`progress.md`, `uat.md`, `uat.json`, `plan-verify.json`) are
dev/qa-owned per S0163/S0166/S0184, so their isolation-guard denial is
honored-not-forced and is **not** a blocker or decision_gate (plan-verify is
additionally SKIPPED by ultra_lean). This repair records the successor DEC-0153
state-first continuation pair and authorizes `/execute` in a fresh dev context.
