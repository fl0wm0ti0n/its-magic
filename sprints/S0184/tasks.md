# Sprint S0184 — Task checklist (BUG-0037)

Six planned tasks: **T-anch + T-001..T-006**, 1:1 with the `# BUG-0037` task
seeds (R-0174 Option A) and within `SPRINT_MAX_TASKS=12`. Execute in order.
Leave all boxes unchecked until execute. BUG-0037 remains OPEN and AC-1..AC-5
remain unchecked.

## Checklist

- [ ] **T-anch — locked baseline and traceability (all ACs, no product change):** Read R-0174 and `docs/engineering/architecture.md` `# BUG-0037`. Confirm BUG-0037 is OPEN/P1 with AC-1..AC-5 and acceptance row unchecked. Inventory the 4-file OpenCode active/template parity set: `.opencode/agents/po.md` (19-line stub; no field template) and `.opencode/commands/intake.md` (19-line dispatch stub ending "STOP"), plus their template twins `template/.opencode/agents/po.md` and `template/.opencode/commands/intake.md`. Confirm each pair is currently byte-identical (research SHA-256 prefixes `9a832ea9d905001b…` / `42bfb16cb13d88dd…`). Confirm the canonical exemplar `## US-0161` at `docs/product/backlog.md` L6144–6178 is intact and is the positive reference fixture. Confirm the AC-4 8-assertion lock (H2; user_visible/Title/Summary/Priority/Status/Acceptance + `[ ] AC-n`; prose-marker discriminator) and the shape-not-provenance rule. Confirm `RESUME_BRIEF_AUTO_REFRESH=0` and `CROSS_MODEL_REVIEW=0`.
  **Done-when:** the baseline matches the 4-file stubs, the `US-0161` exemplar, and the AC-4 lock without changing status, ACs, content, or continuation artifacts.

- [ ] **T-001 — active PO agent field template (AC-1, AC-3):** In `.opencode/agents/po.md`, preserve the existing front matter / permission map / two role sentences and **append** the normative `## Story block shape` section as the **single source of truth** for the canonical structured story block: H2 `## US-#### — <Title>` + `- user_visible:` / `- Title:` / `- Summary:` / `- Priority: P<n>` / `- Status:` / `- Acceptance:` with nested `  - [ ] AC-n:` bullets. State that `Status` is mandatory, that the prose markers `**Priority:**` / `**Release:**` / `**Acceptance criteria**` are forbidden, and that the contract asserts shape, not intake provenance. Do not change the permission map (no new grant); do not edit any other file.
  **Done-when:** the active `po.md` carries the field template exactly once as the single source of truth, with no permission-map change.

- [ ] **T-002 — template PO agent parity (AC-2, AC-3):** Apply the identical append to `template/.opencode/agents/po.md`, then verify active/template `po.md` pairs are **byte-identical**. Do not modify another role file or the `.cursor/` host surfaces.
  **Done-when:** both `po.md` copies are byte-identical and each carries the template exactly once.

- [ ] **T-003 — active `/intake` story-creation directive (AC-1, AC-3):** In `.opencode/commands/intake.md`, preserve front matter / artifacts list / validator-bridge note / terminal "STOP" and **insert** a `## Story creation` directive **before** the terminal "STOP": require that every created story uses the canonical structured block defined in `.opencode/agents/po.md` (reference, not re-duplication), cite the canonical exemplar `## US-0161` at `docs/product/backlog.md` L6144–6178, and forbid the prose shape (`### US-####` H3, `**Priority:**`, `**Release:**`, `**Acceptance criteria**`).
  **Done-when:** the active `intake.md` carries the directive exactly once, before "STOP", referencing `po.md` and citing `US-0161`, with no duplication of the field template.

- [ ] **T-004 — template `/intake` command parity (AC-2, AC-3):** Apply the identical insertion to `template/.opencode/commands/intake.md`, then verify active/template `intake.md` pairs are **byte-identical**.
  **Done-when:** both `intake.md` copies are byte-identical and each carries the directive exactly once before "STOP".

- [ ] **T-005 — AC-4 shape contract test (AC-4):** Add the sole new test `tests/bug0037_story_shape_contract_test.py` (repo convention `bug####_*_test.py`; models `bug0036_`/`bug0038_`), markers `test_bug0037_*` only. **Positive fixture** = the live `US-0161`-shaped canonical block; **negative fixture** = the observed prose shape (H3 `### US-####`, `**Priority:**`, `**Release:**`, `**Acceptance criteria**`, no `Status`). Assertion set (discovery lock, not expanded): (1) canonical H2 heading `## US-#### — <Title>` (not H3, not `# User Story`); (2) `- user_visible:`; (3) `- Title:`; (4) `- Summary:`; (5) `- Priority: P<n>`; (6) `- Status:` (MUST be present); (7) `- Acceptance:` with at least one `  - [ ] AC-n:` bullet; (8) shape discriminator — no prose markers `**Priority:**`/`**Release:**`/`**Acceptance criteria**`. Plus the 4-file active/template **byte-parity + split** assertion: each active/template pair byte-identical; the template is present in `po.md`; `intake.md` references it and cites `US-0161`. The test reads the four surfaces + the exemplar; it does not run a live host, read secrets, or write continuation artifacts.
  **Done-when:** the `test_bug0037_*` markers pass for the positive fixture, fail the prose negative fixture on the locked assertions, and pass the parity/split assertion.

- [ ] **T-006 — invariant and parity verification (AC-2, AC-3, AC-5):** Re-verify active/template byte parity for both pairs; verify `## US-0161` at L6144–6178 is byte-for-byte unchanged (no weakening, no reopen); verify no new permission grant / agent-MAP edit (content-only change); verify BUG-0036 (OPEN), BUG-0038 (DONE), and `US-0158`/`US-0160`/`US-0162` are untouched and `docs/product/acceptance.md` is unchanged; verify no remote import of `US-0001`..`US-0004`; re-run `tests/bug0037_story_shape_contract_test.py`. Preserve `RESUME_BRIEF_AUTO_REFRESH=0`, `CROSS_MODEL_REVIEW=0`, and DEC-0153 state-first ordering.
  **Done-when:** parity and byte comparison confirm every locked invariant holds and the contract test passes.

## AC traceability

| AC | Tasks | Backlog anchor | Research | Architecture |
|---|---|---|---|---|
| AC-1 | T-001, T-003, T-005 | `docs/product/backlog.md` `### BUG-0037` AC-1 | R-0174 | `# BUG-0037` |
| AC-2 | T-002, T-004, T-006 | `### BUG-0037` AC-2 | R-0174 | `# BUG-0037` |
| AC-3 | T-001, T-003, T-005, T-006 | `### BUG-0037` AC-3 | R-0174 | `# BUG-0037` |
| AC-4 | T-005 | `### BUG-0037` AC-4 | R-0174 | `# BUG-0037` |
| AC-5 | T-006 | `### BUG-0037` AC-5 | R-0174 | `# BUG-0037` |

T-anch links every task → AC → backlog row → research R-0174 → architecture
`# BUG-0037`. Every AC is covered; no split.

## Execute boundary

BUG-0037 stays OPEN/P1; AC-1..AC-5 and its acceptance row stay unchecked.
Closure owns any DONE flip. Execute is authorized now: the 4 non-allow-listed
sprint artifacts (`progress.md`, `uat.md`, `uat.json`, `plan-verify.json`) are
dev/qa-owned per S0163/S0166, so their isolation-guard denial is
honored-not-forced and is **not** a blocker or decision_gate (plan-verify is
additionally SKIPPED by ultra_lean). This repair records the successor DEC-0153
state-first continuation pair and authorizes `/execute` in a fresh dev context.
