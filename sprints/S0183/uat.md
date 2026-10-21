# UAT — Sprint S0183 / BUG-0038

## Verify-work revalidation — 2026-10-19T20:44:17Z — **VERIFY_PASS**

- **uat_lifecycle:** verify-work complete; release remains pending.
- **result:** **PASS, 5/5 ACs**. Independent verify-work evidence re-ran the focused permission contract and resolver regression; no live probe is claimed or required for this static permission-boundary slice.
- **incoming QA proof:** `rp-repair-20261018-bug0038-qa-canonical-qa-20261019T203710Z-BUG-0038` / `471b9738a6d8245cb8a1e1513c47faef78e58c2b7aa3f84a5e6aa11c145b2353` — exact key/locked tuple/strict hash MATCH.
- **verify-work proof:** `qa-BUG0038-verifywork-20261019T204417Z-fresh`; `rp-repair-20261018-bug0038-verify-work-qa-20261019T204417Z-BUG-0038` / `e9e1662dc4c24dd80d5a6954f6d1d1fa514b0b420e0e74ee5abc8c7d9803922c` (six-tuple recomputed twice, MATCH).
- **Commands:** `python -m pytest tests/bug0038_qa_resume_brief_permission_contract_test.py tests/us0156_contract_test.py -q` → **16 passed**; `python scripts/bug_issue_validate.py --backlog docs/product/backlog.md --check-acceptance` → **[BUG_VALIDATION_OK]**.
- **Status guard:** BUG-0038 remains **OPEN/P0**; AC-1..AC-5 and the acceptance row remain unchecked. **Next:** fresh `release` child only; this phase stops after VERIFY_PASS.

## QA revalidation — 2026-10-19T20:37:10Z — **QA_PASS**

- **uat_lifecycle:** QA complete; independent verify-work remains pending.
- **result:** **PASS, 5/5 ACs**. The previous blocked attempts are historical blocker evidence only; this fresh QA child completed the state-first pair and its lawful brief pointer.
- **fresh proof:** `qa-BUG0038-qa-canonical-20261019T203710Z-fresh`; `rp-repair-20261018-bug0038-qa-canonical-qa-20261019T203710Z-BUG-0038` / `471b9738a6d8245cb8a1e1513c47faef78e58c2b7aa3f84a5e6aa11c145b2353` (strict 6-tuple recomputed twice, MATCH).

| AC | Result | QA evidence |
|---|---|---|
| AC-1 | PASS | QA persisted its canonical DEC-0153 state-first pair and matching `handoffs/resume_brief.md` pointer; no permission denial occurred. Shared QA ownership covers both `qa` and `verify-work`. |
| AC-2 | PASS | Byte-identical active/template maps; deny-first; exactly one narrow brief allow; security-hard boundaries retained. |
| AC-3 | PASS | Parent/orchestrator remains an explicit negative permission surface. |
| AC-4 | PASS | Matrix-derived writer regression covers `curator, dev, po, qa, release, tech-lead` in both trees. |
| AC-5 | PASS | Unrepairable QA maps emit the deterministic operator-only result with no pair write, schedule, or auto-repair. |

**Commands:** `python -m pytest tests/bug0038_qa_resume_brief_permission_contract_test.py tests/us0156_contract_test.py -q` → **16 passed**; `python scripts/bug_issue_validate.py --backlog docs/product/backlog.md --check-acceptance` → **[BUG_VALIDATION_OK]**. The US-0156 resolver regression proves the newest valid pair wins over historical blocker records.

**Status guard:** BUG-0038 remains **OPEN/P0**; AC-1..AC-5 and the acceptance row remain unchecked. Closure owns any DONE flip. **Next:** fresh `verify-work` QA child only; this phase stops after QA_PASS.

---

- **uat_lifecycle**: completed
- **uat_revalidated_at**: 2026-10-18T19:18:42Z (single bounded US-0158 repair respawn of the qa phase)
- **bug status**: BUG-0038 remains **OPEN/P0**. AC-1..AC-5 remain unchecked in `docs/product/backlog.md`. Closure owns the DONE flip.
- **results**: UAT **BLOCKED** — AC-2..AC-5 PASS (re-verified this respawn); AC-1 BLOCKED (the qa-owned DEC-0153 state-first pair is incomplete: the `handoffs/resume_brief.md` latest-pointer write was **DENIED AGAIN** by this respawn's effective permission surface, which omits the narrow allow that is present in both on-disk maps; the on-disk maps are verified correct). Single bounded US-0158 respawn **exhausted**; the premature state-only half was reverted (no second state-only half written); NO next phase authorized.

## Target

BUG-0038 (OPEN/P0). Sprint S0183. The primary acceptance row in
`docs/product/acceptance.md` remains unchecked.

## Acceptance criteria and UAT steps

| AC | Criterion | UAT step | Result |
|---|---|---|---|
| AC-1 | The QA role (owner of both `qa` and `verify-work`) persists its DEC-0153 state-first continuation pair without `QA_RESUME_BRIEF_PERMISSION_DENIED`. | qa repair-respawn child attempted the `resume_brief.md` prepend after exact pair-key + tuple + strict-hash validation (MATCH, recomputed twice; execute-pair hash reproduced). | **BLOCKED (again)** — the brief write was denied by this respawn's effective surface (rule snapshot omits the narrow allow that is present in both on-disk maps). Pair incomplete; no bypass used; single bounded US-0158 respawn exhausted; premature state-only half reverted. |
| AC-2 | Active/template QA maps byte-identical, deny-first, all security-hard denials retained, exactly one narrow `handoffs/resume_brief.md` allow. | Byte-parity SHA-256 compare + entry-order audit (both trees). | **PASS** — SHA-256 `17226B8702CD49CCE177286C3CEE64947F9426C97C683C0F1FDC3E6B025A7744` identical; deny-first; exactly one narrow allow after deny-first; security-hard denials retained. |
| AC-3 | Orchestrator/parent (`auto.md`) remains a negative surface — no continuation-pair grant, no agent-map write grant. | `auto.md` active==template scan for forbidden grants. | **PASS** — `edit: deny`, `bash: deny`, seven-role task allowlist only; no brief/state/agent-map/matrix/Task-allowlist grant. |
| AC-4 | Regression covers the continuation-brief grant for every `PHASE_ROLE_MATRIX`-derived phase-writer role, in both trees. | Contract test `test_bug0038_every_phase_writer_has_brief_grant_in_both_trees` + independent matrix derivation. | **PASS** — deduped roles `curator, dev, po, qa, release, tech-lead` each carry the narrow brief grant in both the active and template trees. |
| AC-5 | `permission_matrix_repair_lib.py` deterministically reports `PERMISSION_MATRIX_REPAIR_REQUIRES_OPERATOR` on an unrepairable QA map (naming both QA map paths + the brief), with no pair write, no schedule, no auto-repair. | Non-parity classification + `assert_no_continuation_side_effects`. | **PASS** — reason code emitted; diagnostic names `.opencode/agents/qa.md`, `template/.opencode/agents/qa.md`, `handoffs/resume_brief.md`; no side effects; live pair `QA_MAP_PAIR_HEALTHY`. |

## UAT evidence

- Contract test: `python -m pytest tests/bug0038_qa_resume_brief_permission_contract_test.py -q` → **5 passed** (0 failed).
- QA-map byte-parity SHA-256: `17226B8702CD49CCE177286C3CEE64947F9426C97C683C0F1FDC3E6B025A7744` (both trees identical).
- Operator-only diagnostic paths: `.opencode/agents/qa.md`, `template/.opencode/agents/qa.md`, `handoffs/resume_brief.md`.
- Matrix-derived writer roles (deduped): `curator`, `dev`, `po`, `qa`, `release`, `tech-lead` — each carries the narrow brief grant in both trees.
- AC-1 blocker evidence (this respawn): enforced rule snapshot from the denial omits `"handoffs/resume_brief.md": allow`; the on-disk map contains it exactly once per tree (AC-2, re-verified). This respawn's `state.md` state-only append was **reverted** (no second state-only half); the durable `docs/engineering/state.md` QA_BLOCKED checkpoint (prior child) is the last state entry; brief member **not** written.

## Scope and stop

- BUG-0038 remains OPEN/P0; AC-1..AC-5 unchecked. No permission-map change; no
  product/config/DEC/backlog change; `RESUME_BRIEF_AUTO_REFRESH=0`,
  `CROSS_MODEL_REVIEW=0`. No `/auto`, no subagent spawn, no secret/.env read, no
  commit/push/publish.
- Inherited `test_bug0035_active_template_parity_and_runbook_remediation` failure:
  background only, neither fixed nor suppressed.
- **Recovery:** reconcile the session permission surface (it lags the fixed on-disk map),
  then a fresh `/qa` child re-mints and completes the state-first pair.
- **STOP:** `STOP_AFTER_QA_BLOCKED; do_not_write_resume_brief_or_spawn_verify_work`. No next phase/role authorized by this blocked child. `decision_gate=false`.

---

## Fresh QA retry — 2026-10-18T21:10:26Z

- **Result:** UAT remains **BLOCKED**. AC-2..AC-5 PASS; AC-1 BLOCKED by `QA_RESUME_BRIEF_PERMISSION_DENIED`.
- **Evidence:** fresh marker `qa-BUG0038-qa-recovery-20261018T211026Z-fresh`; proof `rp-repair-20261018-bug0038-qa-recovery-qa-20261018T211026Z-BUG-0038` / `b65a5a2041d5d047fdbed6bf7e7830d68ccef56cc31c37a17bc80742fb37dd56` (strict hash MATCH twice). The execute pair validated exactly; the state-first QA evidence then validated exactly before the brief write was attempted.
- **Blocker:** the current QA surface denied `handoffs/resume_brief.md`. No brief was written, so the pair is incomplete and no successor is authorized. No bypass or map edit occurred.
