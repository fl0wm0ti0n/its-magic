# Sprint S0165 — BUG-0035 / QA findings (qa)

## QA verdict section — fresh `qa` context, phase_id=qa, role=qa

- **sprint_id**: S0165 (BUG-0035)
- **bug_id**: BUG-0035 (OPEN, P0; acceptance L226 `- [ ]` unchanged; AC-1..AC-7 all `- [ ]` unchanged — closure owns the flip per US-0045)
- **phase_id**: qa
- **role**: qa (fresh per BUG-0006 / US-0048 — brand-new context, NOT a continuation of the dev execute context)
- **timestamp**: 2026-10-04T03:20:00Z (UTC)
- **model_id**: qwen3.8:27b
- **orchestrator_run_id**: auto-20261004-bug0035-qa
- **fresh_context_marker**: `qa-BUG0035-qa-20261004T032000Z-fresh` (grep-verified 0 prior occurrences repo-wide in this session)
- **runtime_proof_id**: `rp-auto-20261004-bug0035-qa-qa-20261004T032000Z-BUG-0035`
- **proof_hash**: **E24B33023449AEADE2123FC32522713C887031C35371E2996CED21AD71DC2BC9** (independently recomputed twice in this session → identical; 64 hex; distinct from dev execute's `E30183175DBB5BCAE2A64759CE7535BDBC824041F583F14241755DCD7801BA7E`)
- **proof_issued_at**: 2026-10-04T03:20:00Z
- **proof_ttl_seconds**: 3600 (TTL until 2026-10-04T04:20:00Z)
- **consumed_execute_proof**: `rp-auto-20261004-bug0035-execute-dev-20261004T024333Z-BUG-0035` / `E30183175DBB5BCAE2A64759CE7535BDBC824041F583F14241755DCD7801BA7E` (independently recomputed in this session → **MATCH**; within TTL window 03:43:33Z; NOT STALE)
- **verdict**: **QA_PASS**
- **blocking_count**: 0
- **non_blocking**: 3 documented (N-1 us0119 pre-existing matrix-reference failures; N-2 auto_command_contract_test pre-existing inventory tokens; N-3 opencode-adapter scope pre-existing drift — all documented in dev's T-007 progress.md as pre-existing, none introduced by S0165 execute, none in scope for BUG-0035)
- **reason_code**: `S0165_UNBLOCK_OK` — 7/7 AC groups pass in both suites; 13/13 active↔template parity pairs MATCH; `bug_issue_validate.py --repo . --check-acceptance` exit 0 (exit 0 this session); compose regressions on BUG-0027, US-0156, BUG-0015/0016/0018/0019/0021/0023 / US-0121 all green; no flip; guard list intact; the /qa → /verify-work pass-through is authorized.

### Independently re-run this QA session (this session's own commands, not dev's numbers)

**Verification battery (this session's own runs)**:

1. `python -m pytest tests/bug0035_continuation_pair_test.py -q` → **7 passed in 0.04s, exit 0** (active)
2. `python -m pytest template/tests/bug0035_continuation_pair_test.py -q` → **7 passed in 0.04s, exit 0** (template)
3. `python -m pytest tests/bug0015_contract_test.py tests/bug0016_contract_test.py tests/bug0018_opencode_auto_ownership_test.py tests/bug0019_opencode_auto_slash_listing_test.py tests/bug0021_opencode_cli_tui_plugin_load_test.py tests/bug0023_opencode_cli_tui_dispatch_rpc_test.py -q` → **7 passed, 36 skipped, exit 0** (the same set the dev handoff cited; my count of **7 passed / 36 skipped** includes the BUG-0021/0023 TUI/RPC surface and the BUG-0015/0016/0018/0019 suite — all green, 0 regressions attributable to S0165)
4. `python -m pytest tests/bug0027_opencode_manual_phase_persist_test.py tests/us0156_contract_test.py tests/us0121_host_mode_test.py -q` → **34 passed in 225.34s, exit 0** (BUG-0027 10/10 + US-0156 10/10 + US-0121 14/14 = 34 total — identical to dev's claim; 0 regressions attributable to S0165; the slow US-0121 run reflects fixture materialization, not drift)
5. `python scripts/bug_issue_validate.py --repo . --check-acceptance` → **`[BUG_VALIDATION_OK]` exit 0** (this session, post-QA writes)
6. `python scripts/check_intake_template_parity.py --repo . --scope bug-0027` → **`[INTAKE_TEMPLATE_PARITY_OK] scope=bug-0027` exit 0** (fallback scope per T-007 instructions; no `bug-0035` scope in the current tool)

**Byte-parity recompute (SHA-256, this session, `Get-FileHash` on Windows, 13 pairs)**: **13/13 MATCH** — every pair in the dev T-007 parity summary is byte-identical in the working tree at QA time:

| # | Active | Template | SHA-256 | Parity |
|---|--------|----------|---------|--------|
| 1 | `.opencode/agents/tech-lead.md` | `template/…` | `A4CB1B…85E72AC6` | MATCH |
| 2 | `.opencode/agents/dev.md` | `template/…` | `D41F70…8804D404C8` | MATCH |
| 3 | `.opencode/agents/auto.md` | `template/…` | `1B4435…241A3F7` | MATCH |
| 4 | `scripts/opencode_auto_bridge.py` | `template/…` | `3FE777…A4039CB` | MATCH |
| 5 | `.opencode/commands/research.md` | `template/…` | `026D3C…3BE14639` | MATCH |
| 6 | `.opencode/commands/architecture.md` | `template/…` | `F6B7DA…53AC87` | MATCH |
| 7 | `.opencode/commands/auto.md` | `template/…` | `4C77D2…5C3F81AC` | MATCH |
| 8 | `docs/engineering/auto-orchestration-reference.md` | `template/…` | `D4694D…774B488387529C` | MATCH |
| 9 | `.cursor/commands/research.md` | `template/…` | `2DA832…DFF69C01` | MATCH |
| 10 | `.cursor/commands/architecture.md` | `template/…` | `31DD1B…08AD6705E5E` | MATCH |
| 11 | `.cursor/commands/auto.md` | `template/…` | `979D7A…452B42` | MATCH |
| 12 | `docs/engineering/runbook.md` | `template/…` | `0F483DE9…8835744AD44` | MATCH |
| 13 | `tests/bug0035_continuation_pair_test.py` | `template/…` | `671BAFD9…A39CD7` | MATCH |

**No drift, no regression.** The T-001 permission allow, T-002/T-003 bridge writer, T-004 command/reference pairs, T-005 runbook remediation, and T-006/T-007 test pairs are all intact in the working tree at QA time.

### Per-AC assessment (AC-1..AC-7 — assessment only, NO checkbox ticked)

- **AC-1 — authorized/auditable lawful pair**: **PASS** (covered by T-001 child permission allow + T-002 state-first validator + group 1 test `test_bug0035_lawful_child_pair_allows_architecture`). The tech-lead map holds exactly one `handoffs/resume_brief.md` allow, and group 2's map-level assertions confirm deny-first ordering + auto parent still `edit: deny`.
- **AC-2 — least-privilege child; parent non-authoring**: **PASS** (covered by T-001 + T-002 + T-006 group 2 `test_bug0035_parent_remains_edit_denied`). `auto/parent/orchestrator/empty/None` all → `RESUME_BRIEF_STALE / unauthorized_writer_role`; no `handoffs/**` or `*` broad grant; auto map still `edit: deny`.
- **AC-3 — deterministic pair consistency / reason-code failure**: **PASS** (covered by T-002 + T-003 + T-006 groups 3/4/5). `RESUME_BRIEF_UNPARSEABLE` is reserved for syntax; `absent_required_*`, `fresh_marker_reused_or_missing`, `strict_proof_phase_invalid`, `unauthorized_writer_role`, `writer_role_mismatch`, `pair_key_mismatch`, `tuple_conflict:*`, `replay_conflict` all map to `RESUME_BRIEF_STALE` with retained predicate; no silent reclassification.
- **AC-4 — lawful research→architecture continuation schedules architecture**: **PASS** (covered by T-002 + T-004 + T-006 group 1). Group 1 asserts `next_scheduled_phase="architecture"` for the canonical pair.
- **AC-5 — malformed/conflicting/unauthorized evidence remains fail-closed**: **PASS** (covered by T-002 + T-003 + T-006 groups 4/5/6). Empty brief → STALE (`absent-required`); non-dict state → UNPARSEABLE; dropped proof_hash → STALE; differing next_phase/role → `tuple_conflict:*`; differing proof_id → `pair_key_mismatch`; writer role `dev` on tech-lead pair → `writer_role_mismatch`; exact canonical replay → `idempotent_noop=true`; changed field under registered key → `replay_conflict`. No next-phase schedule in any fail branch.
- **AC-6 — success/deadlock/negative contract coverage**: **PASS** (covered by T-006 + T-007). 7 groups in both active and template suites, all fixture/mock-based (UAT_PROBE_FORBIDDEN held), no live-host assertions.
- **AC-7 — active/template alignment and operator remediation**: **PASS** (covered by T-001, T-004, T-005, T-007; this QA session's independent 13/13 parity recompute). Runbook remediation section contains `BUG-0035`, `RESUME_BRIEF_STALE`, `RESUME_BRIEF_AUTO_REFRESH`, "Do NOT hand-edit"; group 7 test enforces it and the bridge keeps the fail-closed vocabulary with no auto-refresh bypass.

### Status authority (this QA phase DID NOT change any status)

| Item | Status | Authority |
|------|--------|-----------|
| **BUG-0035** | **OPEN** (backlog `### BUG-0035` `Status: OPEN`; acceptance L226 `- [ ]`; AC-1..AC-7 all `- [ ]`) | Per US-0045, qa **assesses only**; it does NOT flip status or tick acceptance — that is the **closure phase's** act. This QA phase certifies the fix is **ready for verify-work → closure**. |
| **BUG-0035 AC-1..AC-7** | All **PASS** (this QA), still **unchecked** in acceptance L226 | QA assesses; closure ticks (US-0045) |
| **US-0156** | **OPEN** (untouched by this phase) | DoD gate — BUG-0035 is a prerequisite; closure owns the flip after verify-work certifies it |
| **US-0154 / US-0155** | **OPEN** (untouched by this phase, guard #3) | out-of-scope for BUG-0035 |
| **BUG-0005 / BUG-0016 / BUG-0022 / BUG-0027 / BUG-0031 / BUG-0032 / BUG-0033 / BUG-0034** | **all unmutated** (guard #3) | compose-only regression guards — my compose run on bug0027 + bug0015/0016/0018/0019 + bug0021/0023 + us0121 + us0156 is 34 passed / 36 skipped / 0 failed → no composition drift |
| **DEC-0152 / DEC-0153 / DEC-0069 / DEC-0038 / DEC-0124** | **unmutated** (guard #2 / #3) | not authored, amended, or deleted by this QA context |
| **Stop-matrix (`scripts/data/autonomy_stop_matrix.yaml`) and `scripts/validate_autonomy_stop_matrix.py`** | **unmutated** (guard #3) | The 2 pre-existing failures in `tests/us0119_autonomy_preset_test.py` (N-1) are documented in the BUG-0032 sprint-plan handoff ("do not weaken it") and are on the surfaces I did not touch — **not a regression introduced by S0165** |
| **`qe` spawnable type / role_catalog** | **NOT newly spawned** (BUG-0006 spawn-only rule held) | This QA context did NOT spawn `/verify-work`, `/release`, `/closure`, `/auto`, `/refresh-context`, or any subsequent phase |
| **TUI / RPC / JSON command template / localhost endpoint** | **NOT restored** (guard #5) | verified group-7 test assertions + compose bug0021/bug0023 surface intact |

### Guard re-verification (this session, read-only)

- Guard #1: `docs/product/backlog.md` `### BUG-0035` `Status: OPEN`; `docs/product/acceptance.md` L226 `- [ ] BUG-0035: ...` — **unchanged by this QA context** (no edit; the only mutations this QA context will perform are to `sprints/S0165/qa-findings.md` and `handoffs/qa_to_verify_work.md`, both on the qa-role allow list).
- Guard #2: no `decisions/DEC-*.md` authored or amended by this QA context.
- Guard #3: US-0156 / US-0154 / US-0155 / BUG-0005 / BUG-0016 / BUG-0022 / BUG-0027 / BUG-0031 / BUG-0032 / BUG-0033 / BUG-0034 / DEC-0152 / DEC-0153 / DEC-0069 / stop-matrix — all untouched (compose regression green).
- Guard #4: T-001..T-007 dev artifacts intact (13/13 parity recompute MATCH; 7+7 tests green in both suites).
- Guard #5: no TUI/RPC/JSON/localhost surface restored (verified via group 7 test assertions + compose bug0021/bug0023 pass).
- Guard #6: no `/auto` invocation, no subagent spawn, no phase work beyond `qa`.
- Guard #7: no `.env` read, no `npm publish`, no `git push`, no live OpenCode/Cursor IDE probe (my verification battery is `pytest` + `scripts/*.py` validators only).

### Non-blocking findings (N-1, N-2, N-3 — pre-existing, out of scope for BUG-0035)

- **N-1**: 2 pre-existing `tests/us0119_autonomy_preset_test.py` failures (`test_us0119_matrix_validator_passes`, `test_us0119_matrix_no_orphan_codes`) — documented in the BUG-0032 sprint-plan handoff (2026-09-29) "US-0119 has two unrelated pre-existing matrix-reference failures; do not weaken it." Stop-matrix surface untouched by S0165 (guard #3); this QA does not repair or weaken.
- **N-2**: 20 pre-existing `tests/auto_command_contract_test.py` failures (`test_bug0009_active_ci_five_job_inventory`, `test_runbook_and_handoff_document_remote_evidence_tuple`, `test_us0101_template_agent_model_aliases`) — on surfaces (CI job inventory, `handoffs/qa_to_verify_work.md` US-0086 routing-tuple tokens, `template/.cursor/agents/po.mdc`) I have not touched; outside BUG-0035 scope.
- **N-3**: `python scripts/check_intake_template_parity.py --repo . --scope opencode-adapter` → exit 2 due to pre-existing drift on `tests/bug0016_contract_test.py` (active 9897B vs template 9810B; SHA-256 `105BF4A8…A8138` ≠ `E75863D3…B3E96`) — **not created by this phase**; `--scope bug-0027` (fallback per T-007) exits 0; I am not repairing a pre-existing drift on a file I have not touched (guard #3).

None of N-1..N-3 is a regression caused by S0165 execute, and none is a blocking defect in the BUG-0035 implementation. They are carried forward as documented.

### What the orchestrator does next (NOT this QA phase)

Per US-0045 + the BUG-0006 spawn-only rule, the orchestrator (not this QA context) owns the next spawn. Two legitimate next steps (orchestrator's call):

- **Option A (recommended)** — **`/verify-work`** (fresh `qa` role context, fresh `fresh_context_marker`, fresh DEC-0038 6-tuple) to certify the QA_PASS on a second independent run, then `/closure` (fresh `curator`) to perform the canonical BUG-0035 DONE flip (backlog `### BUG-0035` → DONE, acceptance L226 → `[x]`, closure-verification.md creation, state.md checkpoint). The S0165/BUG-0035 segment ships there.
- **Option B (only if a defect is found on the verify-work re-run)** — **`/execute`** (fresh `dev`) to remediate.

This QA phase **did not** perform a BUG-0035 DONE flip. **Do NOT** proceed to `/release` or `/closure` from this context.

### Stop condition

**QA_PASS** emitted. This QA phase **STOPs** after this artifact + `handoffs/qa_to_verify_work.md` top section are written.

Artifacts written by this QA session:

- `sprints/S0165/qa-findings.md` — **THIS file** (fresh QA_PASS findings — complete)
- `handoffs/qa_to_verify_work.md` — top section **QA → verify-work handoff for BUG-0035 / S0165 (QA_PASS)** prepended above the prior S0164/BUG-0031 VERIFY_PASS section (which is **retained as a historical section on the same single-slot file**, per the S0164 precedent preserved at L1–L85).
- **`docs/engineering/state.md` — NOT touched by this QA session** (state.md checkpoint belongs to the verify-work / closure phase per US-0045 / DEC-0029 lineage; the qa role's allow-list includes `docs/engineering/state.md` for append-only checkpoints, but the canonical S0165 verify-work checkpoint is authored by the verify-work phase).

Do NOT proceed to `/verify-work`, `/release`, `/closure`, or `/refresh-context` from THIS QA context. Do NOT mutate any status, tick any acceptance row, claim live OpenCode PASS, claim operator hand-flip, restore any `.mdc` or `auto.md`, reopen any DQ10 sibling, npm publish, git push, or read `.env`. Orchestrator owns the next spawn per BUG-0006 / US-0045.

---

**Verdict**: **QA_PASS**
**ReasonCode**: S0165_UNBLOCK_OK
**Fresh context**: qa-BUG0035-qa-20261004T032000Z-fresh (brand-new; grep-verified 0 prior occurrences repo-wide in this session)
**Proof hash**: E24B33023449AEADE2123FC32522713C887031C35371E2996CED21AD71DC2BC9 (independently recomputed twice → identical; 64 hex; distinct from dev execute's E3018317…01BA7E)
**Consumed execute proof**: E30183175DBB5BCAE2A64759CE7535BDBC824041F583F14241755DCD7801BA7E (independent recompute = MATCH; not STALE)
**Model**: qwen3.8:27b (role=qa)
**Timestamp**: 2026-10-04T03:20:00Z
