# QA Findings — S0183 / BUG-0038

## Verify-work revalidation — 2026-10-19T20:44:17Z — **VERIFY_PASS**

- Fresh verify-work QA independently re-ran the BUG-0038 contract plus US-0156 resolver regression: **16 passed**; canonical backlog/acceptance linkage validator: **[BUG_VALIDATION_OK]**.
- The QA continuation pair was read-only validated as `PAIR_KEY_TUPLE_HASH_VALIDATE_MATCH`; the distinct verify-work proof is `rp-repair-20261018-bug0038-verify-work-qa-20261019T204417Z-BUG-0038` / `e9e1662dc4c24dd80d5a6954f6d1d1fa514b0b420e0e74ee5abc8c7d9803922c`.
- AC-1..AC-5 remain PASS evidence only; BUG-0038 remains OPEN/P0 with all backlog and acceptance boxes unchecked. Release is the next scheduled boundary.

## Canonical QA completion — 2026-10-19T20:37:10Z — **QA_PASS**

- **Verdict:** **QA_PASS**; 0 blocking findings; `decision_gate=false`.
- **Fresh isolation:** `qa-BUG0038-qa-canonical-20261019T203710Z-fresh`.
- **Strict runtime proof:** `rp-repair-20261018-bug0038-qa-canonical-qa-20261019T203710Z-BUG-0038` / `471b9738a6d8245cb8a1e1513c47faef78e58c2b7aa3f84a5e6aa11c145b2353`; the canonical six-tuple was recomputed twice with `scripts.token_cost_lib.compute_strict_proof_hash`, MATCH both times.
- **Incoming authority:** the sole current canonical continuation pair is `repair-20261018-bug0038-anchor-repair|bug|BUG-0038|execute|rp-repair-20261018-bug0038-execute-dev-20261018T184310Z-BUG-0038`. Rebuilt key, locked tuple, and strict hash (`3c21ef8613eddb0b842f213878d7cef12cc2eed1068a1f0c85efb2c6b6a851a3`) validated read-only; it authorizes QA only. The two earlier QA attempts remain blocker evidence only and are not continuation pairs.

### Acceptance result

| AC | Result | Evidence |
|---|---|---|
| AC-1 | PASS | This QA child persisted the required state-first QA continuation pair and lawful brief pointer without `QA_RESUME_BRIEF_PERMISSION_DENIED`. The shared QA map is the matrix writer for both `qa` and `verify-work`. |
| AC-2 | PASS | Active/template QA maps are byte-identical, deny-first, retain security-hard boundaries, and contain exactly one narrow brief allow immediately after deny-first. |
| AC-3 | PASS | Active/template parent `auto.md` remains `edit: deny`/`bash: deny` with no brief, state, QA-map, matrix, or Task-allowlist grant. |
| AC-4 | PASS | The contract derives all phase writers from `PHASE_ROLE_MATRIX` and verifies the narrow brief grant in both trees. |
| AC-5 | PASS | The pure classifier returns `PERMISSION_MATRIX_REPAIR_REQUIRES_OPERATOR` for unhealthy pairs with all continuation/scheduling/auto-repair side effects false. |

### Focused evidence

- `python -m pytest tests/bug0038_qa_resume_brief_permission_contract_test.py tests/us0156_contract_test.py -q` → **16 passed**. This includes the new resolver regression selecting the newest valid state pair while ignoring historical blocker evidence.
- `python scripts/bug_issue_validate.py --backlog docs/product/backlog.md --check-acceptance` → **[BUG_VALIDATION_OK]**.
- Read-only incoming-pair validation returned `ok=True`, exact key, and `next_scheduled_phase=qa`.
- QA-map audit: active/template byte-identical; SHA-256 `17226b8702cd49cce177286c3cee64947f9426c97c683c0f1fdc3e6b025a7744`; one narrow allow in each map at the deny-first position.

### Scope / next boundary

- BUG-0038 remains **OPEN/P0**; all five backlog AC checkboxes and the acceptance row remain unchecked. Closure alone owns DONE flips.
- No production code, permission map, config, backlog/acceptance, or unrelated worktree change was made by QA. No secret/.env read, `/auto`, child spawn, commit, push, or publish.
- **STOP:** `STOP_AFTER_QA_PASS; validate_pair_then_parent_may_spawn_verify_work`. The sole next boundary is fresh `verify-work` as `qa`; this QA child does not run or spawn it.

---

- **Timestamp:** 2026-10-18T19:18:42Z (single bounded US-0158 repair respawn of the qa phase; supersedes the 2026-10-18T18:55:26Z QA_BLOCKED record below)
- **Verdict:** **QA_BLOCKED** (AC-1 state-first continuation pair incomplete; AC-2..AC-5 PASS)
- **Reason code:** `QA_RESUME_BRIEF_PERMISSION_DENIED` — session-surface variant: the
  `handoffs/resume_brief.md` latest-pointer write was denied by this session's effective
  permission surface even though the fixed on-disk QA maps carry the narrow allow.
- **Writer role:** qa (owns both `qa` and `verify-work` per `PHASE_ROLE_MATRIX`)
- **Fresh context marker (this respawn):** `qa-BUG0038-qa-repair-20261018T191842Z-fresh`
- **runtime_proof_id (this respawn):** `rp-repair-20261018-bug0038-qa-repair-qa-20261018T191842Z-BUG-0038`
- **proof_hash (this respawn):** `82af77298b7d5da621e65c1061d20432541d286262586e01378c343ec7c86207`
  (recomputed twice via `scripts.token_cost_lib.compute_strict_proof_hash`, MATCH both times;
  call-ordering sanity check reproduced the execute pair hash `3c21ef8613eddb0b842f213878d7cef12cc2eed1068a1f0c85efb2c6b6a851a3` exactly)
- **Single bounded US-0158 repair respawn — OUTCOME:** the `handoffs/resume_brief.md`
  latest-pointer prepend was **DENIED AGAIN** by this respawn's effective permission
  surface. The enforced rule snapshot enumerates the qa allows
  (`sprints/S*/{qa-findings.md,plan-verify.json,verify-work-findings.md,uat.md,uat.json}`,
  `docs/engineering/state.md`, `handoffs/qa_to_{dev,verify,verify_work}.md`) but **omits**
  `"handoffs/resume_brief.md": allow`, which is present exactly once in BOTH on-disk QA
  maps (re-verified this respawn; AC-2 PASS below). The on-disk fix is verified correct;
  the **session permission surface is stale**. This was the **single bounded US-0158
  respawn attempt** and it is now **exhausted**. The write was NOT forced and no bypass
  (bash, state fallback, auto-refresh, shortcut) was used. To avoid leaving a second
  state-only half that lacks its brief, the premature `docs/engineering/state.md`
  state-only append was **reverted**; `state.md` ends at the prior QA_BLOCKED record and
  the brief was not written. The DEC-0153 pair therefore **remains incomplete**
  (brief member missing) and **NO next phase is authorized**.

## AC-1 — Continuation-pair persistence (core behavioral proof)

**BLOCKED — state-first pair incomplete (single bounded US-0158 respawn exhausted).**
This qa child (repair respawn) attempted the `handoffs/resume_brief.md` latest-pointer
prepend **after** exact pair-key + locked-tuple + strict-hash validation
(`PAIR_KEY_TUPLE_HASH_VALIDATE_MATCH`, recomputed twice MATCH; incoming execute-pair hash
`3c21ef86...` reproduced exactly as a call-ordering sanity check). The prepend was
**DENIED** by this session's effective permission surface for the same session-surface
reason as the prior QA_BLOCKED child: the enforced rule snapshot omits
`"handoffs/resume_brief.md": allow` although it is present exactly once in BOTH on-disk
QA maps (verified below).

Classification: **session-surface / map discrepancy**, NOT a map defect. The map-level
BUG-0038 root cause (the missing narrow allow) is fixed and byte-verified; the live
session rule snapshot simply does not reflect the fixed on-disk map. The DEC-0153 pair is
therefore **incomplete (brief member missing)** and must not be treated as a valid resume
pointer. The write was **not** forced; no bypass was used. The reason code matches the
BUG-0038 root-cause code (`QA_RESUME_BRIEF_PERMISSION_DENIED`) because the denial fired
on the brief path — at the session-surface layer, not the map layer.

Recovery (operator action required): reconcile the session permission surface so a fresh
session's effective permission includes the verified narrow `"handoffs/resume_brief.md":
allow` (restart/reload the operator's permission-surface snapshot from the on-disk maps),
then a fresh `/qa` child may complete the state-first pair (state checkpoint durable; a
re-minted pair with a fresh proof must supersede it). Because this was the single bounded
US-0158 respawn, further respawns require an explicit operator re-authorization.

## AC-2 — QA maps byte-identical, deny-first, exactly-one narrow allow

**PASS (verify, no edit).**
- SHA-256 active `.opencode/agents/qa.md` = template `template/.opencode/agents/qa.md`
  = `17226B8702CD49CCE177286C3CEE64947F9426C97C683C0F1FDC3E6B025A7744` (identical;
  matches the execute child's record).
- Deny-first: the first `edit:` entry is `"**": deny` in both maps.
- Exactly one `"handoffs/resume_brief.md": allow` per map, positioned immediately after
  the deny-first entry.
- All security-hard boundaries and retained allows preserved (`mode: subagent`,
  `bash: ask`, `task: deny`; sprint QA artifacts, `docs/engineering/state.md`,
  QA handoffs). No wildcard / broad handoff grant (`"handoffs/**": allow` absent).

## AC-3 — Orchestrator/parent remains a negative surface

**PASS.** `.opencode/agents/auto.md` (active) is byte-equal to
`template/.opencode/agents/auto.md`. It carries `edit: deny`, `bash: deny`, and a task
allowlist of the seven role agents only. It contains **no** continuation-pair grant
(`handoffs/resume_brief.md`), no `state.md` grant, no agent-map write grant
(`.opencode/agents/qa.md` / `template/.opencode/agents/qa.md`), no
`PHASE_ROLE_MATRIX`, and no `TASK_ALLOWLIST`.

## AC-4 — Regression covers every matrix-derived phase-writer role, both trees

**PASS.** `tests/bug0038_qa_resume_brief_permission_contract_test.py`
(`test_bug0038_every_phase_writer_has_brief_grant_in_both_trees`) derives writer roles
from `PHASE_ROLE_MATRIX` (deduplicated role values) and asserts the narrow
`"handoffs/resume_brief.md": allow` in BOTH the active and template agent trees.
Independent derivation by this child confirmed the deduped writer roles
`[curator, dev, po, qa, release, tech-lead]`; each carries the brief grant in both trees.
`qa`→qa and `verify-work`→qa are both owned by the shared QA writer.

## AC-5 — Operator-only unrepairable-map boundary, no side effects

**PASS.** `scripts/permission_matrix_repair_lib.py` deterministically reports
`PERMISSION_MATRIX_REPAIR_REQUIRES_OPERATOR` on an unrepairable (non-parity) QA map. The
diagnostic names both QA map paths and the exact brief path: `.opencode/agents/qa.md`,
`template/.opencode/agents/qa.md`, `handoffs/resume_brief.md`.
`assert_no_continuation_side_effects` confirms **no** pair write, **no** schedule, and
**no** auto-repair. The live pair is classified `QA_MAP_PAIR_HEALTHY`.

## Contract-test evidence

`python -m pytest tests/bug0038_qa_resume_brief_permission_contract_test.py -q`
→ **5 passed** (0 failed). Markers: `test_bug0038_qa_owns_qa_and_verify_work`;
`test_bug0038_qa_narrow_allow_parity_and_deny_first`;
`test_bug0038_every_phase_writer_has_brief_grant_in_both_trees`;
`test_bug0038_parent_orchestrator_remain_negative_permission_surfaces`;
`test_bug0038_unrepairable_map_requires_operator_without_pair_or_schedule`.
The inherited out-of-scope
`test_bug0035_active_template_parity_and_runbook_remediation` failure
(`tests/bug0035_continuation_pair_test.py`) was **neither fixed nor suppressed**; only the
BUG-0038 contract file was run and the inheritance is noted.

## Scope and stop

- BUG-0038 remains **OPEN/P0**; AC-1..AC-5 and the acceptance row remain unchecked in
  `docs/product/backlog.md`. Closure owns the DONE flip.
- **No permission-map change** by this child (verify only). No edit to
  `.opencode/agents/*` or `template/.opencode/agents/*`.
- No product code, config/scratchpad, DEC, backlog/acceptance, or unrelated-item change.
  `RESUME_BRIEF_AUTO_REFRESH=0`; `CROSS_MODEL_REVIEW=0` (no critic).
- No `/auto`, no subagent spawn, no secret/.env read, no commit/push/publish.
- The state-first pair is **incomplete** (brief member denied); no `next_scheduled_phase`
  is authorized by this child.
- **STOP:** `STOP_AFTER_QA_BLOCKED; do_not_write_resume_brief_or_spawn_verify_work`.
  `decision_gate=false`. The latest valid resume pointer remains the execute pair.

---

## QA retry — 2026-10-18T21:10:26Z — **QA_BLOCKED**

- **Scope:** fresh, repair-only `continue_same_phase` QA retry for BUG-0038/S0183; no execute work was reimplemented.
- **Fresh isolation:** `qa-BUG0038-qa-recovery-20261018T211026Z-fresh`; `child_isolation_ref=docs/engineering/state.md#bug-0038-qa-recovery-20261018T211026Z`.
- **Proof:** `rp-repair-20261018-bug0038-qa-recovery-qa-20261018T211026Z-BUG-0038` / `b65a5a2041d5d047fdbed6bf7e7830d68ccef56cc31c37a17bc80742fb37dd56`; strict 6-tuple recomputed twice, MATCH.
- **Incoming boundary:** the execute state/brief pair key, locked tuple, and strict hash validated PASS and authorized QA only. The prior QA_BLOCKED state-only evidence remains incomplete and is not a resume fallback.
- **AC-1 BLOCKED:** state was written first and the new exact pair key/tuple/hash validated with `validate_resume_pair`. The lawful prepend to `handoffs/resume_brief.md` was then denied by this session's effective QA permission surface. The denial snapshot retains deny-first plus sprint QA artifacts, `docs/engineering/state.md`, and QA handoffs, but omits the narrow brief allow. The brief was not written; no bash/fallback/broad-grant/alternate-role bypass was used.
- **AC-2..AC-5 PASS:** `python -m pytest tests/bug0038_qa_resume_brief_permission_contract_test.py -q` → **5 passed**. The on-disk maps remain diagnostic-only evidence of parity/deny-first/exact-one narrow allow; no map was edited. `python scripts/bug_issue_validate.py --backlog docs/product/backlog.md --check-acceptance` → **[BUG_VALIDATION_OK]**.
- **Verdict / stop:** `QA_RESUME_BRIEF_PERMISSION_DENIED`; `STOP_AFTER_QA_BLOCKED; do_not_write_resume_brief_or_spawn_verify_work`. The new state-first evidence is deliberately not a canonical continuation pair, there is no next phase/role, and BUG-0038 stays OPEN/P0 with acceptance unchecked.
