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
