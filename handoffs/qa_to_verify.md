# QA → Verify-Work Handoff — S0162 / US-0156 (VERIFY_BLOCKED — hold; functional PASS on own scope)

- **sprint_id**: S0162
- **story_id**: US-0156 (Status OPEN — authority `docs/product/backlog.md`; acceptance row `[ ]`)
- **phase_id**: verify-work
- **role**: qa
- **delivery_mode**: ultra_lean
- **verdict**: **VERIFY_BLOCKED (hold)** — functional verification **PASS** on US-0156's own scope, but **NOT cleared for release** (AC-7 DoD gate unmet)
- **verified_ready**: false
- **evidence**:
  - `sprints/S0162/uat.json`, `sprints/S0162/uat.md`, `sprints/S0162/verify-work-findings.md`
  - `python -m pytest tests/us0156_contract_test.py -q` → **10 passed** (reproduced by qa)
  - compose `bug0027+bug0030+us0124+us0156` → **36 passed, 2 skipped**
  - **`python scripts/bug_issue_validate.py --repo . --check-acceptance` → `[BUG_VALIDATION_OK]` exit 0** (mandated bridge GREEN; B-1 acceptance-row corruption already remediated, no longer reproduces)
  - `python scripts/check_intake_template_parity.py --repo . --scope all` → **`[INTAKE_TEMPLATE_PARITY_ERROR]` exit 2** (2 RED pairs — NB2)
- **green gates (US-0156 own scope)**:
  - AC-1..AC-6, AC-8..AC-10 all PASS (9 of 10)
  - no `fallback_execute`; no active `client.rpc(`; no `localhost:NNNN`; retired `its-magic-auto/{index,tui,rpc}.ts` absent (not restored)
  - US-0156 own surfaces byte-identical (bridge, orchestrator, auto command/agent, 7 role agents, security read-only)
  - DoD partial: BUG-0027 DONE, BUG-0030 DONE, US-0124 held; BUG-0022/0026/0028/0029 NOT merged/dropped/flipped
- **blocking findings**: **1**
  - **B1 (BLOCKING — AC-7 DoD gate unmet)**: **BUG-0022 is still OPEN** (`docs/product/backlog.md` `### BUG-0022` → `Status: OPEN`). architecture `# US-0156`: *"US-0156 remains OPEN until BUG-0022 and BUG-0027 are DONE and verify-work records both prerequisites."* BUG-0027 = DONE (satisfied); **BUG-0022 = OPEN (NOT satisfied)**. US-0156 **must remain OPEN and must NOT advance to `/release`** until BUG-0022 is DONE. Not remediable by qa verify-work; requires BUG-0022's own lifecycle.
- **non_blocking findings**: **2**
  - **NB1 (carried platform issue)**: qa role fenced out of its own artifacts by opencode last-match-wins permission semantics (BUG-0016/0027 family). Do NOT reorder permission lists or loosen the kit permission-order contract; candidate for a future platform bug (operator/host action).
  - **NB2 (repo hygiene, pre-existing, NOT US-0156)**: `--scope all` parity RED on 2 pairs outside US-0156's surface — `CHANGELOG.md` (extra BUG-0030 Fixed row) and `tests/bug0016_contract_test.py` (extra docstring line), active ahead of template by 1 line each. Route to orchestrator/dev for template-mirror sync; would block a clean repo-wide `--scope all` release gate.
- **manual_phase_isolation**: `persistManualPhaseIsolation` (BUG-0027 DONE) preserved/untouched; no strict-release proof minted or claimed (do-not-fabricate discipline).
- **acceptance**: US-0156 remains **OPEN**; acceptance row remains **unchecked** (closure owner only). BUG-0022/0026/0028/0029 untouched.
- **next**: **STOP after VERIFY_BLOCKED.** Do NOT advance US-0156 to `/release`. Orchestrator: (1) keep US-0156 OPEN; (2) surface B1 → resolve via BUG-0022's own lifecycle; (3) surface NB2 → orchestrator/dev template-mirror sync; (4) surface NB1 → opencode/operator platform action (do NOT silently waive). When **BUG-0022 reaches DONE** AND `--scope all` is green, re-run `/verify-work` (fresh qa) to open a clean `VERIFY_PASS`.

---

# QA -> Verify handoff — BUG-0030 / S0161 (VERIFY_PASS)

- **sprint_id**: S0161
- **bug_id**: BUG-0030 (OPEN; acceptance unchecked until closure)
- **phase_id**: verify-work
- **role**: qa
- **verdict**: VERIFY_PASS — blocking_count=0
- **evidence**:
  - `sprints/S0161/uat.json` (VERIFY_PASS, verified_ready=true)
  - `sprints/S0161/uat.md`
  - Credentialed session-command smoke: `5 passed, 1 skipped` on opencode 1.18.32 with
    `ITS_MAGIC_OPENCODE_SESSION_SMOKE=1` + `ITS_MAGIC_OPENCODE_SMOKE_MODEL=openai/gpt-5.6-terra`
  - `python scripts/check_intake_template_parity.py --repo . --scope all` → **INTAKE_TEMPLATE_PARITY_OK**
  - `python scripts/bug_issue_validate.py --repo . --check-acceptance` → **BUG_VALIDATION_OK**
- **green gates**:
  - AC-1: live `/auto` selects `auto` agent, admits canonical spawn-only prompt (no UNBRANDED abort)
  - AC-2: `auto.md` command surface (`agent: auto`, non-STOP body)
  - AC-3: no private RPC/TUI tokens on active route
  - AC-4: host-real prompt-admission proof (not mock)
  - AC-5: upgrade migration + active/template parity
  - Compose: bug0027 10 passed (no regression)
- **non_blocking**: NB1 — full provider-driven lifecycle completion remains operator UAT after release
- **acceptance**: BUG-0030 AC-1..AC-5 remain **unchecked**; primary acceptance row remains unchecked (closure ownership)
- **next**: `/release` (role release) may proceed; do not mark BUG-0030 DONE or tick acceptance until closure

---

# QA → Verify-Work Handoff — S0177 / BUG-0026 (VERIFY_PASS)

- **sprint_id**: S0177
- **bug_id**: BUG-0026 (OPEN; AC-1/2/4/5/6/7/8 checked, **AC-3 unchecked** until closure)
- **orchestrator_run_id**: auto-20261023-bug0026-verify-work
- **phase_id**: verify-work
- **role**: qa
- **delivery_mode**: ultra_lean
- **verdict**: **VERIFY_PASS** — blocking_count=0
- **fresh_context_marker**: `qa-BUG0026-verifywork-20261024T093856Z-fresh`
- **timestamp**: 2026-10-24T09:38:56Z
- **re_release_cycle_note**: Re-attest at the verify-work phase boundary after the QA pair went out-of-TTL. Provenance link consumed as integrity-verified only (no stale-proof waiver; not blocking).
- **consumed provenance (qa pair, integrity-verified)**:
  - record_key `auto-20261023-bug0026-qa|bug|BUG-0026|qa|rp-auto-20261023-bug0026-qa-qa-20261023T143037Z-BUG-0026`
  - proof_hash `95cd78d9aa441ba17fbe9f9c22c000c9dbe7a73ca19a2e4a5664bad929ae0f4c`
  - issued `2026-10-23T14:30:37Z`, ttl 3600 — recomputed via `token_cost_lib.compute_strict_proof_hash` and independent sorted-key `hashlib.sha256(json.dumps(...))` → **MATCH** (six-tuple equal).
- **fresh verify-work proof**:
  - runtime_proof_id `rp-auto-20261023-bug0026-verify-work-qa-20261024T093856Z-BUG-0026`
  - proof_hash `435104b2db05f4c26fec27e87005e7450c11eba4d5b37f17dc9709651ea303c8` — lib + independent sorted-key SHA-256 **MATCH**
  - proof_issued_at `2026-10-24T09:38:56Z`, ttl 3600
- **evidence**:
  - `sprints/S0177/uat.json` (phase_id=verify-work, verdict=VERIFY_PASS, 9 pass / 0 fail, placeholder_only=false)
  - `sprints/S0177/uat.md` (9 pass / 0 fail)
  - `sprints/S0177/qa-findings.md` (fresh RE-ATTEST QA record; source of AC-3 Linux evidence)
  - `python -m pytest tests/bug0026_packaged_range_contract_test.py -q --tb=line` → **8 passed in 5.83s** (re-run)
  - **`python scripts/bug_issue_validate.py --repo . --check-acceptance` → `[BUG_VALIDATION_OK]` exit 0** (mandated bridge GREEN)
  - `python scripts/enforce-triad-hot-surface.py --check` → **exit 0** (pre-mint)
- **green gates (8/0)**:
  - AC-1: `test_bug0026_allowlist_ships_equivalent_range_without_private_workspace` PASS
  - AC-2: `test_bug0026_packaged_range_matches_kernel_bridge_source` (Windows row cited not copied) PASS
  - AC-3: Linux published-global `its-magic@0.1.5` upgrade materializes posix `.its-magic/bin/itsm` mode 0755, shebang `#!/usr/bin/env sh` — **re-attested read-only** (Debian 13 WSL2, `Linux BigOne 6.18.33.2-microsoft-standard-WSL2`; Node v24.19.0; CPython 3.12.15; consumer `/home/flow/bug0026-consumer-s0177`; global `its-magic@0.1.5`; `scripts/standalone-supported-kernel-range.json` 88 bytes; `its-magic --target . --mode upgrade --host both` → exit 0 0.1.4→0.1.5; tokens present `HOST_CONFIG_POSTINSTALL_OK`/`STANDALONE_BOOTSTRAP_OK`/`STANDALONE_POSTINSTALL_OK`; absent `KERNEL_CONTRACT_MISMATCH`/`STANDALONE_SUPPORTED_RANGE_MISSING`/`STANDALONE_BOOTSTRAP_FAILED`/`PYTHON_NOT_FOUND`). **Upgrade command NOT re-run; `.env` NOT read.**
  - AC-4: `test_bug0026_npm_pack_contains_range_fallback_and_omits_standalone_workspace` PASS
  - AC-5: `test_bug0026_published_layout_preflight_uses_packaged_range` / BUG-0025 not reopened PASS
  - AC-6: US-0149 not reopened PASS
  - AC-7: BUG-0028 / BUG-0029 not edited PASS
  - AC-8: `test_bug0026_missing_range_is_not_false_kernel_contract_mismatch` PASS
- **UAT**: 9/9 must remain; `cli_smoke` is read-only re-observation; `browser_smoke`/`api_health`/`process_health`/`build`/`manual_operator` stay `UAT_PROBE_FORBIDDEN`. 9 step definitions + 5 waived_probes preserved.
- **non_blocking**: none
- **acceptance**: BUG-0026 stays **OPEN**; AC-1/2/4/5/6/7/8 `[x]`; **AC-3 stays `[ ]`** (closure owns the AC-3 tick + DONE flip). Do NOT tick AC-3, do NOT flip DONE.
- **next**: **STOP after VERIFY_PASS.** Do NOT spawn `/release` or `/auto`. Parent may spawn `/release` (role release) after the state-first continuation pair is validated. No republish, no DEC, no commit/push.

---

# QA → Verify-Work Handoff — S0186 / BUG-0044 (VERIFY_PASS)

- **sprint_id**: S0186
- **bug_id**: BUG-0044 (OPEN/P1; AC-1..AC-5 unchecked until closure)
- **story_id**: (none)
- **orchestrator_run_id**: auto-20261025-bug0044
- **phase_id**: verify-work
- **role**: qa (writer_role=qa)
- **delivery_mode**: ultra_lean
- **verdict**: **VERIFY_PASS** — blocking_count=0; `decision_gate=false`
- **fresh_context_marker**: `qa-BUG0044-verifywork-20261025T212011Z-fresh` (grep-verified 0 prior occurrences before mint)
- **timestamp**: 2026-10-25T21:20:11Z
- **canonical duty honored (Lock-3)**: this verify-work child **authored** `sprints/S0186/uat.json` + `uat.md` to the verify-work terminal state (`status=VERIFY_PASS` / `phase_id=verify-work` / `uat_lifecycle=verify_work_complete_release_pending`) before STOP. There was **NO** stale QA-state `uat.json` to repair (ultra_lean QA merged UAT evidence into `sprints/S0186/qa-findings.md`); the terminal artifacts are authored fresh per the S0185 pattern, so `/release` will not fail-closed `RELEASE_UAT_INCOMPLETE`.
- **consumed provenance (QA pair, read-only verified)**:
  - record_key `auto-20261025-bug0044|bug|BUG-0044|qa|rp-auto-20261025-bug0044-qa-qa-20261025T211035Z-BUG-0044`
  - proof_hash `06bc9303d393540f72c75092918ff199da4a8e8ae867ba05d2d88acc81ef0653`
  - state-bottom == brief-top **byte-identical** (SHA-256 `ecbf12f4185f3a77aa1383a8e4fd8b2d19b6004f89f030b4c04386fa44ca080d`, 1664 bytes); strict 6-tuple recompute **MATCH**; **IN-TTL** at this write (issued 2026-10-25T21:10:35Z + 3600 → expiry 2026-10-25T22:10:35Z; clock 2026-10-25T21:20:11Z, ~50m remaining).
  - `phase_boundary_self_check(writer_role='qa')` → `ok=true`, `idempotent_noop=false`, `reasonCode=None`, `predicate=None`, `next_scheduled_phase=verify-work` (the A2 defense-in-depth path).
- **fresh verify-work proof**:
  - runtime_proof_id `rp-auto-20261025-bug0044-verify-work-qa-20261025T212011Z-BUG-0044` (grep-verified 0 prior occurrences at mint)
  - proof_hash `2b2bc23204e501e57a122f60e10d780754a9b9573ee202d927d847dc317637e4` — two-method MATCH (`token_cost_lib.compute_strict_proof_hash` == independent compact sorted-key `hashlib.sha256`)
  - proof_issued_at `2026-10-25T21:20:11Z`, ttl 3600, expiry `2026-10-25T22:20:11Z`
- **evidence**:
  - `sprints/S0186/uat.json` (terminal: `phase_id=verify-work`, `status=VERIFY_PASS`, `uat_lifecycle=verify_work_complete_release_pending`, AC-1..AC-5 steps PASS)
  - `sprints/S0186/uat.md` (5/5 ACs PASS, terminal lifecycle line)
  - `sprints/S0186/qa-findings.md` (merged QA+UAT evidence, QA_PASS 2026-10-25T21:10:35Z) — reconciled, not re-authored
  - `python -m pytest tests/bug0044_phase_boundary_pair_contract_test.py -q` → **6 passed** (re-run this phase)
  - regression (4 files) → **22 passed, 3 pre-existing failures** (bug0035 ×2 + bug0038 ×1; in-progress US-0164/DEC-0155 working-tree edit, NOT S0186) — **no S0186/bug0044 regression**
  - **`python scripts/bug_issue_validate.py --repo . --check-acceptance` → `[BUG_VALIDATION_OK]` exit 0** (mandated bridge GREEN)
  - Lock-1 header present exactly once in all 7 OpenCode primary command files (spot-verified); host-parity re-hash byte-identical on 3 active/template pairs
- **green gates (5/0)**:
  - AC-1: Lock-1 contract section on all 7 OpenCode primary commands (spot-verified) + this child wrote its own DEC-0153 state-first pair IN-TTL on the first pass
  - AC-2: terminal-state-reconcile canonical row — `uat.json`/`uat.md` authored to `VERIFY_PASS`/`verify-work`/`verify_work_complete_release_pending` before STOP
  - AC-3: parent spawn-only, no proof-minting, `RESUME_BRIEF_AUTO_REFRESH=0` absolute, no new reason code
  - AC-4: 6/6 `test_bug0044_*` contract markers PASS (pair write + terminal-state reconcile + fail-closed taxonomy)
  - AC-5: prevention at source — first-pass pair + reconcile; no repair-only re-mint or separate repair child; US-0163/US-0164 citations only
- **acceptance**: BUG-0044 stays **OPEN/P1**; AC-1..AC-5 remain **unchecked**; acceptance row (`docs/product/acceptance.md` L245) unchecked; `sprints/S0186/tasks.md` boxes remain `[ ]` — **closure owns the acceptance-row tick + Status flip + task-box ticks**. Do NOT tick ACs, do NOT flip Status, do NOT tick tasks.md.
- **next**: **STOP after VERIFY_PASS.** Do NOT spawn `/release` or `/auto`. Parent may validate the fresh verify-work continuation pair (state-bottom + byte-identical brief-top, `next_scheduled_phase=release`/`next_scheduled_role=release`) and then spawn fresh `/release` (role release) for BUG-0044/S0186. No republish, no DEC, no commit/push.
