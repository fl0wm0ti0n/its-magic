# Sprint S0164 — BUG-0031 `/closure` cannot complete on OpenCode: no spawnable closure role is authorized to write the canonical DONE-flip paths

## Metadata

| Field | Value |
|---|---|
| sprint_id | **S0164** (locked — new folder; S0163 = BUG-0022 occupied — do not reuse) |
| bug_id | BUG-0031 (Status **OPEN** — authority `docs/product/backlog.md` `### BUG-0031`) |
| status | PLANNED |
| current_phase | sprint-plan |
| delivery_mode | ultra_lean |
| approach | A1 (A\*) — **curator-only 3-allow additive parity repair** (role/permission delta + rich-surface diagnostic token + OpenCode-parity note + `test_bug0031_*` 8-marker suite; active↔template byte-parity held throughout) |
| research_anchor | R-0155 (DQ1–DQ10 LOCKED) |
| architecture_anchor | `docs/engineering/architecture.md` `# BUG-0031` |
| companion_DEC | **none** (R-0155 L16032 "Companion DEC: **none from research**"; next-free **DEC-0153** verified against `decisions/` — **NOT** allocated unless a genuine gap is found at execute; default none, same defect-class pattern as BUG-0019/0020/0021/0022/0023/0024/0025/0027/0030) |
| task_count | 8 (T-anch + T-001..T-007; ≤ SPRINT_MAX_TASKS=12; no split; 1:1 from architecture `# BUG-0031` seeds — architecture L3402 "Eight seeds") |
| plan-verify | skipped: ultra_lean; not in the resolved phase plan (no QA spawn from planning) |
| DoD gate | BUG-0031 repair **unblocks** (does **not** perform) the S0163/BUG-0022 closure. US-0156 AC-7 (BUG-0022 must be DONE) remains **not** ticked this phase — US-0045 + closure own the canonical flip. This sprint authorizes the flip paths; it does **not** tick or release BUG-0022 / US-0156. |
| fresh_context_marker | tl-BUG0031-sprintplan-20261001T150000Z-fresh |
| macro_phase | plan (sprint-plan terminal for plan macro; plan-verify NOT in resolved_phase_plan — skipped; next = /execute dev → build+verify macro) |
| orchestrator_spawn | BUG-0006 — orchestrator owns the /execute spawn; sprint-plan does **not** spawn /execute |

## Scope

Close the OpenCode `/closure` permission-matrix gap (A1\*). Root cause lives at the
**OpenCode deny-by-default role map** (`.opencode/agents/curator.md` `permission.edit`): the
sanctioned spawnable closure role **`curator`** (DEC-0051 `qe|curator` closed set) holds
`docs/engineering/state.md` already (L7) but is **denied** exactly three of the four canonical
DONE-flip paths — `docs/product/backlog.md` (status+AC), `docs/product/acceptance.md` (row), and
`sprints/S\*/closure-verification.md` (create). The primary closure role `qe` is **not a
spawnable subagent type** on this host (no `.opencode/agents/qe.md`, no `.cursor/agents/qe.mdc`),
so every `/closure` segment fails closed with `CLOSURE_BLOCKED_PERMISSION_MATRIX` and can only be
forced by an operator hand-flip (a workaround, not the documented contract).

This sprint delivers, all **additive** and **active↔template byte-parity held**:

1. **Curator 3-allow delta** — append exactly three `edit:` `allow` rows to **both**
   `.opencode/agents/curator.md` (active) and `template/.opencode/agents/curator.md`
   (byte-parity twin), **after** the existing allow set (after `handoffs/archive/**`) and
   **before** `bash: ask` — `"docs/product/backlog.md": allow`, `"docs/product/acceptance.md": allow`,
   `"sprints/S*/closure-verification.md": allow`. The broad `"**": deny` row is **not reordered,
   widened, or rewritten** (DENY-FIRST, DEC-0152 L40-43 last-matching-wins preserved); `bash: ask`
   / `task: deny` are **unchanged**. No 4th row (DQ4 — `state.md` already held).
2. **Fail-closed diagnostic contract** — new stage-precise token **`CLOSURE_PERMISSION_FLIP_PATHS_DENIED`**
   (additive to the existing seven `CLOSURE_*` codes — do **not** rename/replace) in BOTH the rich
   Closure-surface pair (`.cursor/commands/closure.md` + `template/.cursor/commands/closure.md`)
   `## Fail-safe reason codes` table **and** `## Stop conditions` bullet list; registered in
   `docs/engineering/runbook.md` § Closure troubleshooting table and `docs/engineering/reason_codes.md`
   (compose-additive). The **thin** OpenCode dispatch pack `.opencode/commands/closure.md`
   (+ template twin) is a distinct 20-line surface with zero `CLOSURE_*` vocabulary and is **not** touched.
3. **OpenCode-surface parity note** (DQ6/A2) — short additive prose in the **rich** Closure-surface
   pair after the existing `override` bullet (L10): on OpenCode `qe` is unspawnable → sanctioned
   alternate is `curator`; `curator` must be authorized on the three flip paths; otherwise fail-closed
   with `CLOSURE_PERMISSION_FLIP_PATHS_DENIED` — never an operator hand-flip.
4. **Test suite** — author `tests/bug0031_opencode_closure_flip_authz_test.py` (active) +
   `template/tests/bug0031_opencode_closure_flip_authz_test.py` (byte-parity mirror), 8 markers
   `test_bug0031_*`, mock-injection style (no live OpenCode probe, `UAT_PROBE_FORBIDDEN`), composing
   with `test_bug0027_*` and `test_bug0016*` **unmodified**.

Out of scope (explicitly NOT this sprint): flipping BUG-0022 status / ticking its acceptance;
performing the S0163/BUG-0022 closure flip (that belongs to BUG-0022's own post-fix closure cycle);
creating the actual S0163 `closure-verification.md`; creating `sprints/S0163/`'s closure artifact;
ticking BUG-0031 status / acceptance (US-0045 + closure own); creating a `qe` spawnable type;
granting `qa` the flip paths; reordering the broad deny; rewriting any DEC; a companion DEC; npm
publish; git push; `.env` reads; mutating `.cursor/agents/*.mdc` or the thin OpenCode `closure.md` pack.

## Acceptance coverage

Surjective map of BUG-0031 AC-1..AC-5 (authoritative source: architecture `# BUG-0031` AC coverage
mapping L3408-3414; the 5 AC canonical statements per `vision.md` Discovery Notes L2885-2891 +
`backlog.md ### BUG-0031` expected/actual framing L5661-5671 + acceptance L222 "5 ACs"). All five
acceptance criteria are covered by at least one task.

| Acceptance criterion | Task coverage |
|---|---|
| AC-1 A spawnable authorized closure role (`curator`) performs the four canonical DONE-flip writes (`backlog.md` status+AC, `acceptance.md` row, `closure-verification.md` create, `state.md` checkpoint) **per phase**, without `CLOSURE_BLOCKED_PERMISSION_MATRIX` and without operator hand-flip | T-001, T-002; markers 1, 2, 3 |
| AC-2 `python scripts/bug_issue_validate.py --backlog docs/product/backlog.md --check-acceptance` exits **0** on the fixed state (the 3-allow delta composes with the validator) | T-007 (runs the validator); T-anch (composes validator surface); marker 8 (compose, no rewrite) |
| AC-3 `template/.opencode/agents/curator.md` and `.opencode/agents/curator.md` are **byte-identical** parity (US-0017), each now carrying the three additive `allow` rows | T-002; marker 3 (`test_bug0031_curator_active_template_byte_parity`) |
| AC-4 **Sibling integrity**: BUG-0016 baseline **not** mutated; DEC-0152 deny-by-default ordering **not** weakened; **`qa` NOT** granted the 3 paths; US-0156 AC-7 **not** mutated; no sibling bug drained or reopened | T-anch, T-005 (marker 4), T-007 (regression suites); marker 4 (`test_bug0031_qa_flip_paths_denied`), marker 8 (`test_bug0031_no_sibling_mutation`) |
| AC-5 `test_bug0031_*` contract suite **passes**; `test_bug0027_*` (10) + `test_bug0016*` (8) **continue to pass** (compose, not replace) | T-005, T-006, T-007; markers 1-8 (marker 8 asserts the compose suites stay green) |
| DC / architecture baseline (cross-cutting guard, not a numbered AC — DoD #6) | T-anch |

**Surjectivity check**: 5/5 ACs covered + primary acceptance.md BUG-0031 row (L222) covered. No
`PLAN_AC_COVERAGE_GAP`.

**Cross-cutting standing guard** (DoD #6, embedded in Guards G9, not a numbered AC): no npm publish,
no git push, no `.env` reads.

Primary acceptance (`docs/product/acceptance.md`) BUG-0031 row and backlog `### BUG-0031` remain
**unchecked / OPEN** — they are cited to DONE only by verify-work/closure per US-0045.

## Task summaries

Eight tasks (T-anch + T-001..T-007), 1:1 with the architecture `# BUG-0031` seeds (L3393-3400), in
the same order, ≤ SPRINT_MAX_TASKS=12, no split.

1. **T-anch** (baseline, read-only) — Verify `# BUG-0031` A1 + R-0155 DQ1–DQ10 + **no companion DEC**
   (R-0155 L16032) + curator/qa role files (active + template) + the four `closure.md` copies (rich
   pair + thin OpenCode pair) + DEC-0051/0152/0052 + `test_bug0027_*`/`test_bug0016*` patterns +
   US-0156 AC-7 & BUG-0022 remain un-ticked + `.cursor/agents/curator.mdc` has **no `permission:`
   block**. Anchors only; **no mutation** of architecture, research, backlog status, or acceptance.
2. **T-001** — Apply the 3-allow delta to `.opencode/agents/curator.md` (active): append exactly
   three `allow` rows after `handoffs/archive/**`, before `bash: ask` (the exact before→after block);
   append-only; do **not** reorder the broad `"**": deny` row; keep `bash: ask` / `task: deny` unchanged.
   (AC-1, AC-3)
3. **T-002** — Apply the **same** 3-allow delta to `template/.opencode/agents/curator.md` and assert
   active↔template byte-parity (US-0017) — the delta must be byte-identical in both. (AC-1, AC-3)
4. **T-003** — Add `CLOSURE_PERMISSION_FLIP_PATHS_DENIED` (additive) to `.cursor/commands/closure.md`
   (reason-code table + Stop-conditions bullet) + `template/.cursor/commands/closure.md` (byte-parity)
   + `docs/engineering/runbook.md` troubleshooting row + `docs/engineering/reason_codes.md`
   registration; compose with (do not rewrite/replace) the existing 7 `CLOSURE_*` codes. (AC-1)
5. **T-004** — Apply the DQ6 OpenCode-surface parity note (additive prose) to
   `.cursor/commands/closure.md` after L10 + `template/.cursor/commands/closure.md` (byte-parity);
   adopt R-0155 DQ6 wording verbatim (the `qe` unspawnable → `curator` sanctioned-alternate + 3
   flip-paths + fail-closed + never-operator-hand-flip contract). (AC-1, AC-4)
6. **T-005** — Author `tests/bug0031_opencode_closure_flip_authz_test.py` (active) with the 8 markers
   `test_bug0031_*` per the DQ9 table (mock-injection style, no live OpenCode probe); do **not** modify
   `test_bug0027_*` / `test_bug0016*`. (AC-1..AC-5)
7. **T-006** — Author `template/tests/bug0031_opencode_closure_flip_authz_test.py` (byte-parity
   mirror), including `test_bug0031_curator_active_template_byte_parity` (mirrors the
   `test_bug0027_active_template_parity` pattern). (AC-3, AC-5)
8. **T-007** — Run the full relevant suite and green it: `test_bug0031_*` (active + template),
   `test_bug0027_*` regression (compose, unmodified), `test_bug0016*` regression, and
   `python scripts/bug_issue_validate.py --backlog docs/product/backlog.md --check-acceptance`
   (exit 0); confirm the curator/qa role-file active↔template byte-parity and **zero** sibling
   mutation. (AC-2, AC-4, AC-5)

## Locked reason codes and contracts

- **New fail-closed token (additive to the `CLOSURE_*` family; compose — do not rename/replace):**
  `CLOSURE_PERMISSION_FLIP_PATHS_DENIED`
  - `condition`: a spawnable closure role (`curator`) is NOT authorized to write one or more of the
    closure-owned DONE-flip paths on this host.
  - `spawnable_closure_role`: **`curator`** (`qe` unspawnable on OpenCode — do not emit).
  - `denied_flip_paths`: `docs/product/backlog.md`, `docs/product/acceptance.md`,
    `sprints/S*/closure-verification.md` (the subset missing).
  - `already_authorized`: `docs/engineering/state.md` (checkpoint — no flip delta, DQ4).
  - `remediation`: grant the missing flip paths to `curator` in **both**
    `.opencode/agents/curator.md` and `template/.opencode/agents/curator.md` (active↔template parity,
    DEC-0152 L40-43 additive / last-matching-wins); re-run `/closure`. **Do NOT operator hand-flip.**
- **Composes with the existing seven `CLOSURE_*` tokens** (do not replace or rename any):
  `CLOSURE_RELEASE_EVIDENCE_MISSING`, `CLOSURE_VERIFICATION_FAILED`, `CANONICAL_STATUS_CONFLICT`,
  `BACKLOG_STATUS_DRIFT`, `PHASE_OWNERSHIP_VIOLATION`, `PHASE_OVERRIDE_EVIDENCE_MISSING`,
  `CLOSURE_LEGACY_DRIFT`.
- **The 3-allow delta (exact frontmatter addition, both files byte-identical):** append, in this
  order, **after** `handoffs/archive/**` and **before** `bash: ask`:
  ```yaml
        "docs/product/backlog.md": allow
        "docs/product/acceptance.md": allow
        "sprints/S*/closure-verification.md": allow
  ```
  The broad `"**": deny` stays the **first** `edit:` row; `bash: ask` / `task: deny` unchanged in
  content and order (DQ3/DQ4).
- **The `S*` wildcard shape (DQ5):** exactly the literal `"sprints/S*/closure-verification.md"` —
  matches the existing per-role `S*` glob convention (dev/tech-lead/release/qa). A specific-sprint
  literal (e.g. `sprints/S0163/...`) is a US-0017 drift anti-pattern — **rejected**.
- **The `test_bug0031_*` 8-marker list (DQ9, all currently fail pre-fix; mock-injection, no live probe):**
  1. `test_bug0031_curator_flip_paths_present_active` — active curator `edit:` contains all four flip paths (3 new + `state.md`), `"**": deny` precedes all allows, `bash: ask`/`task: deny` unchanged (DQ2/DQ3/DQ5)
  2. `test_bug0031_curator_flip_paths_present_template` — same asserts on `template/.opencode/agents/curator.md` (DQ2/DQ3/DQ5)
  3. `test_bug0031_curator_active_template_byte_parity` — `active.read_bytes() == template.read_bytes()` (US-0017; DQ2/DQ7)
  4. `test_bug0031_qa_flip_paths_denied` — qa active + template: **none** of the 3 flip paths in qa's allow set (least-privilege; DQ7 **NO** qa fallback)
  5. `test_bug0031_deny_before_allow_index` — across both curator files: `"**": deny` index < each new allow index (last-matching-wins, DEC-0152 L40-43)
  6. `test_bug0031_sprint_wildcard_shape` — asserts the literal `"sprints/S*/closure-verification.md"` exactly; no specific-sprint literal
  7. `test_bug0031_fail_closed_diagnostic_token_present` — `CLOSURE_PERMISSION_FLIP_PATHS_DENIED` additively present in `.cursor/commands/closure.md` table + Stop conditions + template twin + `runbook.md` + `reason_codes.md`; names the 3 paths + `curator` + remediation; composes with (does not replace) the 7 `CLOSURE_*`
  8. `test_bug0031_no_sibling_mutation` — `test_bug0027_*` + `test_bug0016*` suites pass unmodified; siblings not mutated; US-0156 AC-7 not ticked; `.cursor/agents/curator.mdc` (+ template) byte-identical and untouched (DQ10 + DQ7 + G7)
- **Sibling-integrity list (verbatim, DQ10 + G5 compose-only — do NOT touch):**
  BUG-0016, BUG-0022 (unblocked, not performed), BUG-0027, BUG-0023/0024/0025/0026/0028/0029/0030,
  US-0045, US-0120, US-0122, US-0047/0048/0049, US-0124/0125/0126, US-0148/0150/0151/0152/0153/0154,
  **US-0156 AC-7 (not ticked, not released)** — plus the compose-only regression guard:
  `test_bug0027_*` (10 markers) and `test_bug0016*` (8 markers) **must continue to pass unmodified**.

## Guards

- **G1** — Do **not** reorder / move / widen the `"**": deny` line or any existing `edit:` allow row
  (DENY-FIRST, DEC-0152 L40-43 last-matching-wins — compose, do not rewrite).
- **G2** — Do **not** touch the `bash: ask` / `task: deny` lines; do **not** add a 4th flip-path
  `allow` (over-broad); `state.md` already held (DQ4 — no redundant allow).
- **G3** — Do **not** grant `qa` the 3 flip-path allows (DQ7 — `qa` is not in the `qe|curator` closed
  closure set per DEC-0051 L41 / DEC-0052 §4). Negative-asserted by marker 4.
- **G4** — Do **not** create a `qe` spawnable type (no `.opencode/agents/qe.md`, no
  `.cursor/agents/qe.mdc`) — scope invention, not the fix; do **not** hardcode a specific-sprint
  literal in place of the `S*` wildcard (DQ5 / US-0017 drift).
- **G5** — Do **not** reopen / mutate / drain any DQ10 sibling — BUG-0016, BUG-0022 (unblocked, not
  performed), BUG-0027, BUG-0023/0024/0025/0026/0028/0029/0030, US-0045, US-0120, US-0122,
  US-0047/0048/0049, US-0124/0125/0126, US-0148/0150/0151/0152/0153/0154, **US-0156 AC-7** (not
  ticked, not released).
- **G6** — Do **not** flip BUG-0031 status / tick its acceptance row / perform the S0163/BUG-0022 flip
  this phase (US-0045 + closure own; this bug **unblocks**, does **not** perform).
- **G7** — Do **not** touch `.cursor/agents/*.mdc` (incl. `curator.mdc`) — verified: `curator.mdc`
  has **no `permission:` block** (only `description` + `model: fast`; distinct Cursor role surface).
  Do **not** touch the thin OpenCode dispatch pack `.opencode/commands/closure.md` +
  `template/.opencode/commands/closure.md` (distinct surface, no `CLOSURE_*` vocabulary).
- **G8** — Do **not** rewrite or rename any existing `CLOSURE_*` token — the new token is
  **additive** only; composes with the existing seven codes.
- **G9** — No npm publish, no git push, no `.env` reads, no `/auto` recursion (BUG-0006 spawn-only —
  orchestrator owns the next spawn).
- **G10** — Do **not** author a companion DEC (R-0155 L16032 "none"; next-free id **DEC-0153**
  verified but **NOT** allocated); do **not** create `sprints/S0164/` from the architecture phase
  (that was `/sprint-plan`'s job — done); do **not** spawn `/execute` from this sprint-plan context.

## Execution order

T-anch → T-001 → T-002 → T-003 → T-004 → T-005 → T-006 → T-007 (acyclic, 8 ≤ 12, no split).

## Next phase

`/sprint-plan` **PASS** (verdict; `decision_gate=false`). Sprints `S0164/` created: `sprint.md` +
`tasks.md`. BUG-0031 remains **OPEN**; AC-1..AC-5 remain **unchecked** until the lifecycle closure
owner acts (verify-work / release / closure per US-0045). Orchestrator MUST spawn `/execute` in a
fresh **dev** context (BUG-0006). Do **not** spawn `/execute`, do **not** flip BUG-0031 status, and
do **not** spawn `/plan-verify` (ultra_lean) or a sovereign-critic from this planning context.
**STOP** before implementation.
