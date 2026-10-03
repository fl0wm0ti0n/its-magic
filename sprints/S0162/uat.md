# UAT / verify-work record — S0162 / US-0156 (OpenCode `/auto` parity)

- **sprint_id**: S0162
- **story_id**: US-0156 (Status **OPEN** — authority `docs/product/backlog.md`; acceptance row `[ ]`)
- **phase_id**: verify-work
- **role**: qa
- **delivery_mode**: ultra_lean
- **verdict**: **VERIFY_PASS** — functional verification **PASS** on US-0156's own scope **+ AC-7 DoD gate MET** (BUG-0022 now DONE via S0163 CLOSURE_PASS + BUG-0027 DONE; verified in the re-run VERIFY_PASS block, `S0162_DO_D_GATE_MET`)
- **verified_ready**: true
- **state**: US-0156 remains **OPEN / unchecked** — closure owns the DONE flip (US-0045); this record is a reconciliation of the prior VERIFY_BLOCKED record (BUG-0022 OPEN, 2026-09-28), which was correctly fail-closed and is preserved below as history, not erased.
- **reproduced_by_qa**: true (all evidence re-run by this qa verify-work subagent, not taken on trust from the qa handoff)

## Independently reproduced (this verification pass)

| Gate | Command | Result |
|------|---------|--------|
| US-0156 contract | `python -m pytest tests/us0156_contract_test.py -q` | **10 passed** (10/10) |
| Compose regression | `bug0027 + bug0030 + us0124 + us0156` | **36 passed, 2 skipped** (skips = live-desktop probes, `UAT_PROBE_FORBIDDEN`) |
| **Mandated bridge** | `python scripts/bug_issue_validate.py --repo . --check-acceptance` | **`[BUG_VALIDATION_OK]` exit 0** (GREEN) |
| Repo-wide parity | `python scripts/check_intake_template_parity.py --repo . --scope all` | **`[INTAKE_TEMPLATE_PARITY_ERROR]` exit 2** (2 RED pairs — see NB2) |

The qa-phase B-1 acceptance-row corruption (stray em-dash on the BUG-0001 line) is **already remediated** and no longer reproduces — the mandated bridge is now green.

## AC verdicts (10 ACs on the S0162 sprint plan)

| AC | Verdict | Primary evidence |
|----|---------|------------------|
| AC-1 | PASS | `test_us0156_auto_command_owns_spawn_only_parent` |
| AC-2 | PASS | `test_us0156_sequential_fresh_phase_tasks` |
| AC-3 | PASS | `test_us0156_story_bug_scheduler_mutex_and_order` |
| AC-4 | PASS | `test_us0156_story_bug_scheduler_mutex_and_order` (bug-target precedence) |
| AC-5 | PASS | `test_us0156_start_from_resume_phase_plan_precedence` |
| AC-6 | PASS | `test_us0156_stop_matrix_and_cap_boundaries` |
| **AC-7** | **MET** | DoD gate — BUG-0022 DONE (backlog L5465, AC-1..8 [x], acceptance L213 [x]) + BUG-0027 DONE (L218 [x]); verified in re-run verify-work-findings.md (`S0162_DO_D_GATE_MET`) — see B1 (now RESOLVED, historical) |
| AC-8 | PASS | `test_us0156_no_retired_route_or_fallback` |
| AC-9 | PASS | `test_us0156_dod_and_active_template_parity` (installer-overwrite; 9 markers present) |
| AC-10 | PASS | US-0156 own surfaces byte-identical (repo-wide `--scope all` red tracked as NB2 pre-existing drift) |

## Findings

### B1 — (historical, **RESOLVED**): US-0156 AC-7 DoD gate — was unmet (2026-09-28), now **MET**
- **Rule** (architecture `# US-0156`, "Non-goals and closure gate"): *US-0156 remains OPEN until **BUG-0022 and BUG-0027 are DONE** and verify-work records both prerequisites.*
- **Prior state at recording (superseded)**: BUG-0027 = **DONE** (satisfied) · BUG-0030 = **DONE** (compose guard) · BUG-0022 = **OPEN** (NOT satisfied at the time) → gate **UNMET** → the then-BLOCKED verdict was correctly fail-closed.
- **Current state (this reconciliation, 2026-10-02)**: **BUG-0022 = DONE** — `docs/product/backlog.md` L5465 `Status: DONE`, AC-1..8 `[x]` (L5474–L5481), `docs/product/acceptance.md` L213 `[x]`, closed via its own S0163 segment (CLOSURE_PASS). BUG-0027 = **DONE** (acceptance L218 `[x]`). → **gate MET.**
- **Disposition**: RESOLVED — BUG-0022 now DONE (S0163 CLOSURE_PASS); gate MET; verified in the re-run verify-work-findings.md **VERIFY_PASS** block (`S0162_DO_D_GATE_MET`). This BLOCKED entry is preserved as **history**, not erased.
- **Evidence (prior)**: `docs/product/backlog.md` `### BUG-0022` → `Status: OPEN` (as of 2026-09-28). **Evidence (current)**: `docs/product/backlog.md` L5465 → `Status: DONE`; `acceptance.md` L213 `[x]`; re-run `sprints/S0162/verify-work-findings.md` AC-7 evidence line.

### NB1 — NON-BLOCKING (carried platform issue): qa fenced out of its own artifacts
- Opencode **last-match-wins** permission semantics: the qa agent's trailing broad deny (`"**": deny`) resolves last in the merged rule list and overrides its own specific owned-path allows, so designated writes (`sprints/S*/qa-findings.md`, `handoffs/qa_to_dev.md`) can be denied despite explicit allow patterns in `.opencode/agents/qa.md`.
- Same failure family as **BUG-0016 / BUG-0027** (Layer-1 role permissions). Sanctioned path per S0161 precedent: role-owned artifact mutations via the **orchestrator-enforced persistence path**; the qa record is preserved verbatim here.
- **Disposition**: **Do NOT** file/merge in this run. **Do NOT** reorder agent permission lists or loosen the kit permission-order contracts (would break the kit's own `test_opencode_agent_permission_*` + bug0027 marker 10). Candidate for a future platform bug; requires operator/host-level action.
- **Reproduction caveat**: if any qa-artifact write in *this* invocation was denied, that is NB1 reproducing — it is surfaced here, not silently worked around in code.

### NB2 — NON-BLOCKING: repo-wide template parity RED (pre-existing drift, **not** US-0156)
- `check_intake_template_parity.py --repo . --scope all` → **exit 2** on two active-vs-template byte mismatches, **both outside US-0156's touch surface** (US-0156's own surfaces are byte-identical and green):
  - `CHANGELOG.md` (7690 b) ≠ `template/CHANGELOG.md` (7174 b) — active carries an extra `- **BUG-0030**:` Fixed row the template mirror lacks.
  - `tests/bug0016_contract_test.py` (9897 b) ≠ `template/tests/bug0016_contract_test.py` (9810 b) — active carries an extra docstring line on `test_bug0016_success_test_c_non_dev_no_production_allow`.
- **Disposition**: NOT a US-0156 defect. Route to orchestrator/dev for a separate template-mirror sync; this *would* block a clean repo-wide `--scope all` release gate. qa verify-work does not write templates or production code; **do not silently waive**.

## Validator bridge (mandatory for /verify-work)

- `python scripts/bug_issue_validate.py --repo . --check-acceptance` → **`[BUG_VALIDATION_OK]`** · **exit 0** · **non-zero exit surfaced: none**.
- qa verify-work did **not** mutate any backlog/acceptance bug rows (US-0156 row stays `[ ]` unchecked).

## Manual-phase isolation

- `persistManualPhaseIsolation` (BUG-0027 DONE) is **preserved / untouched** by this phase.
- No strict-release proof tuple is minted or claimed here (consistent with the do-not-fabricate-strict-proofs discipline from BUG-0027 D7 / S0161 lessons); proof minting is the orchestrator runtime's job, not qa verify-work's.

## Waived probes (UAT_PROBE_FORBIDDEN)

- browser_smoke · live_opencode_session_command (not required for US-0156 ACs; no provider-completion claim) · live_opencode_cli_tui (owned by BUG-0023/0024 DONE) · opencode_pure_desktop · manual_operator (full lifecycle completion = operator UAT post-ship).

## Honest-claim posture

No live desktop, `opencode --pure`, provider-complete, full-lifecycle-completion, toast-repair, fake-browser, or `harness_fail_zero` claims. US-0156 evidence = contract_tests_primary + DoD gate.

## Compose guards held

- BUG-0027 DONE (10/10 in compose) — NOT reopened
- BUG-0030 DONE (6/6 in compose) — NOT reopened
- US-0124 green in compose — not opened
- no `fallback_execute` / no active `client.rpc(` / no `localhost:NNNN`; retired `its-magic-auto/{index,tui,rpc}.ts` removed (NOT restored)
- permission-order contract intact (broad-deny-first, security read-only)
- BUG-0022 / 0026 / 0028 / 0029 — NOT merged, NOT drained, NOT flipped

## Guards (do NOT)

- Do NOT mark US-0156 DONE, tick its acceptance, or release it (stays OPEN; closure owner only).
- Do NOT merge/drain/flip BUG-0022/0026/0028/0029; do NOT reopen BUG-0016/0027/0030.
- Do NOT restore retired TUI/RPC, the non-BUG-0030 `auto.md` form, a JSON command template, or a localhost endpoint.
- Do NOT reorder permission lists or loosen the kit permission-order contract (NB1/NB1-precedent).
- Do NOT write templates, production code, or bug/AC rows (qa role boundary); do NOT npm-publish or git-push.

## Prior Next (superseded — kept as history)

**STOP after VERIFY_BLOCKED** (2026-09-28 cycle). US-0156 was functionally verified on its own scope but **not cleared for release** (AC-7 DoD gate unmet: BUG-0022 OPEN) and stayed OPEN/unchecked. That blocker is now resolved — see B1 (RESOLVED) and below.

## Next

**STOP after VERIFY_PASS (DoD gate MET).** US-0156 functional verification PASS + gate MET. `/release` is the orchestrator's next spawn. `/closure` owns the US-0156 DONE flip per US-0045 — **not performed here** (US-0156 stays OPEN / unchecked in backlog + acceptance).

Carried (non-blocking to this verdict, still honestly surfaced):
1. **NB2** (repo-wide `--scope all` template drift: `CHANGELOG.md` + bug0016 test) → orchestrator/dev for a separate template-mirror sync.
2. **NB1** (platform permission model, BUG-0016/0027 family) → opencode/operator action — do **not** silently waive.

- **timestamp**: 2026-10-02T18:20:00Z
- **fresh_context_marker**: qa-US0156-S0162-uat-reconcile-20261002T182000Z-fresh
