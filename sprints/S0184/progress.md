# Sprint S0184 — Progress (BUG-0037, role=dev, /execute)

- phase_id=execute; writer_role=dev; orchestrator_run_id=auto-20261020-bug0037;
  bug_id=BUG-0037; sprint_id=S0184; story_id=(none);
  fresh_context_marker=dev-BUG0037-execute-20261020T190859Z-fresh
  (repository scan: 0 prior occurrences before mint);
  model_id=zelisko_llm/qwen3.8-27b; model_provenance=fresh canonical phase child
  (dev execute); timestamp=2026-10-20T19:08:59Z (UTC).
- Verdict: **EXECUTE_FAIL** (permission dead-end on the core deliverable;
  fail-closed). decision_gate=false. BUG-0037 remains **OPEN/P1**;
  AC-1..AC-5 remain unchecked.

## Consumed pair (validated at the execute boundary)

- record_key=`auto-20261020-bug0037|bug|BUG-0037|sprint-plan|rp-auto-20261020-bug0037-sprint-plan-techlead-20261020T183221Z-BUG-0037`
- proof `rp-auto-20261020-bug0037-sprint-plan-techlead-20261020T183221Z-BUG-0037` /
  `7cae5773eb19110acc0c509b264a93bb055ce4c6c524a1ab19d1ad1070958ae5`
  recomputed MATCH via `scripts/token_cost_lib.compute_strict_proof_hash`;
  IN-TTL at the execute boundary (issued 2026-10-20T18:32:21Z, ttl to
  2026-10-20T19:32:21Z; boundary 2026-10-20T19:02:09Z is before expiry).

## T-anch — baseline (completed, read-only)

- BUG-0037 OPEN/P1, AC-1..AC-5 unchecked. R-0174 Option A and
  `docs/engineering/architecture.md` `# BUG-0037` (L2952) confirmed binding.
- 4-file OpenCode active/template parity set inventoried and each pair confirmed
  byte-identical before any action: `.opencode/agents/po.md` ==
  `template/.opencode/agents/po.md` (SHA-256 `9A832EA9D905001B4FB794E4F084544FF2491AD5A7A92038DB2EC82A790A1100`,
  654 bytes, 19-line stub) and `.opencode/commands/intake.md` ==
  `template/.opencode/commands/intake.md` (SHA-256
  `42BFB16CB13D88DD7CFC3CD581AE47AE937D81572A02DA4430D8573CA6F00335`, 482 bytes,
  19-line dispatch stub ending "STOP").
- `## US-0161` at `docs/product/backlog.md` L6144–6178 confirmed intact
  (canonical structured block; CRLF; em-dash U+2014 heading); it is the
  positive reference fixture and is NOT a change target.
- `RESUME_BRIEF_AUTO_REFRESH=0`, `CROSS_MODEL_REVIEW=0` confirmed.

## T-001..T-004 — core 4-file parity fix — BLOCKED (permission dead-end)

- The dev deny-first edit map (`.opencode/agents/dev.md`) allows
  `template/**` but does NOT grant the active `.opencode/agents/po.md` or
  `.opencode/commands/intake.md` (only `.opencode/agents/tech-lead.md` + twin
  are explicitly granted). A live edit attempt on `.opencode/agents/po.md`
  was **denied** by the enforced write surface:

  > "The user has specified a rule which prevents you from using this specific
  > tool call." — active rules: `edit: ** deny`; allows:
  > `scripts/**`, `its_magic/**`, `template/**`, `tests/**`,
  > `sprints/S*/progress.md|summary.md|qa-findings.md`,
  > `docs/engineering/state.md`, `handoffs/dev_to_qa.md`,
  > `handoffs/resume_brief.md`, `.opencode/agents/tech-lead.md`,
  > `template/.opencode/agents/tech-lead.md`, `docs/engineering/**`,
  > `.github/workflows/ci.yml`, `README.md`, `CHANGELOG.md`,
  > `handoffs/po_to_tl.md`, `docs/developer/**`.
  > Neither `.opencode/agents/po.md` nor `.opencode/commands/intake.md`
  > appears in the allow list → deny-first `**` applies.

- **Intended content (recorded; to be applied by an authorized operator grant
  followed by a fresh /execute, byte-identical in both trees of each pair):**

  (a) APPEND to `.opencode/agents/po.md` (+ byte-identical
  `template/.opencode/agents/po.md`) after the two existing role sentences:

  ```
  ## Story block shape

  Created stories use the canonical structured block below. This section is the
  single source of truth for the story-block shape on this host.

  ## US-#### — <Title>
  - user_visible: <true|false>
  - Title: <one-line title>
  - Summary: <one-paragraph summary>
  - Priority: P<n>
  - Status: <OPEN|IN_PROGRESS|DONE>
  - Acceptance:
    - [ ] AC-1: <...>

  Field rules (normative, additive):
  - The heading is H2 `## US-#### — <Title>`; do not use an H3 `###` heading.
  - Every field is a structured `- <field>:` line.
  - `Status` is mandatory and must be present.
  - The prose markers `**Priority:**`, `**Release:**`, and `**Acceptance criteria**` are forbidden.
  - The contract asserts canonical shape, not intake provenance.
  ```

  (b) INSERT into `.opencode/commands/intake.md` (+ byte-identical
  `template/.opencode/commands/intake.md`) between the validator-bridge note
  and the terminal "STOP":

  ```
  ## Story creation

  Every story created by /intake must use the canonical structured block
  defined in `.opencode/agents/po.md` (see its `## Story block shape` section,
  the single source of truth — reference, not re-duplication). Cite the
  canonical exemplar `## US-0161` at `docs/product/backlog.md` L6144–6178.
  The prose shape is forbidden: do not use an H3 `### US-####` heading,
  `**Priority:**`, `**Release:**`, or `**Acceptance criteria**` bullets.
  ```

- **No partial edit performed.** Writing only the `template/**` twins would
  break the active==template byte-parity invariant (AC-2), so all four files
  were deliberately left as unmodified stubs; parity re-verified byte-identical
  after the denial (same SHA-256 hashes as T-anch). No permission-map or
  agent-MAP edit was made or is lawful here (the fix is content-only; the
  missing grant itself is the operator action, not part of this delivery).

## T-005 — AC-4 contract test (completed, in authority)

- `tests/bug0037_story_shape_contract_test.py` written; markers
  `test_bug0037_*` only; models `bug0036_`/`bug0038_`.
- Coverage: (1) positive US-0161-shaped fixture passes the full 8-assertion
  shape lock (H2; `user_visible`/`Title`/`Summary`/`Priority: P<n>`/`Status`
  mandatory/`Acceptance` + `  - [ ] AC-n:`; prose-marker discriminator);
  (2) observed prose negative fixture (H3, `**Priority:**`, `**Release:**`,
  `**Acceptance criteria**`, no Status) violates all 8 locked assertions;
  (3) live `## US-0161` exemplar block is intact and canonical (no-weakening /
  no-reopen guard; shape, not provenance); (4) 4-file active/template
  byte-parity per pair; (5) agent-vs-command split: template present in
  `po.md`, `intake.md` references `po.md` and cites `US-0161`.
- Read-only over the four surfaces + exemplar; no live host, no secrets, no
  continuation artifacts.

## T-006 — invariant verification (completed, in authority)

- Active/template byte parity: both pairs still byte-identical (see T-anch
  hashes; no file in the set was modified).
- `## US-0161` L6144–6178 byte-for-byte unchanged (read-only).
- No new permission grant / agent-MAP edit; no production code; no remote
  import of `US-0001`..`US-0004`; BUG-0036 (OPEN), BUG-0038 (DONE),
  `US-0158`/`US-0160`/`US-0161`/`US-0162` and `docs/product/acceptance.md`
  untouched; no DEC edit; no AC tick; no backlog edit.

## Test results

- `python -m pytest tests/bug0037_story_shape_contract_test.py -v`:
  **4 passed, 1 failed**.
  - PASSED: `test_bug0037_positive_fixture_is_canonical`,
    `test_bug0037_negative_prose_fixture_is_rejected`,
    `test_bug0037_us0161_exemplar_is_canonical`,
    `test_bug0037_four_file_active_template_byte_parity`.
  - FAILED: `test_bug0037_template_in_pomd_and_directive_in_intake` —
    `AssertionError: template missing in .opencode/agents/po.md`. Expected:
    the core 4-file fix is unapplied because of the permission dead-end. The
    marker is the exact gate that flips green once the operator grant is in
    place and a fresh `/execute` applies the intended content above.
- `python scripts/bug_issue_validate.py` → see state checkpoint
  (`[BUG_VALIDATION_OK]`).

## Blocker and stop

- Decisive blocker: `PO_STORY_SHAPE_SURFACE_WRITE_PERMISSION_DENIED` — the
  active OpenCode PO surface files `.opencode/agents/po.md` and
  `.opencode/commands/intake.md` are not in the dev edit allow list (same
  operator-gated permission-map class as the BUG-0038 finding). Repair
  requires an authorized operator grant (add the two active paths, or the
  `po` pair paths, to the dev map — or have an operator/authorized role apply
  the recorded content directly), followed by a fresh `/execute`.
- No successor DEC-0153 continuation pair is written (execute did not pass);
  the consumed sprint-plan pair remains the latest valid resume pointer.
  `handoffs/resume_brief.md` is intentionally untouched.
- STOP: `STOP_AFTER_EXECUTE_FAIL; do_not_write_resume_brief_or_spawn_qa;
  operator_grant_then_fresh_execute`. This child does not spawn QA or `/auto`.

---

## Fresh repair execution — 2026-10-21T15:28:27Z (role=dev) — BLOCKED

- Consumed only the repaired latest sprint-plan pair
  `auto-20261020-bug0037|bug|BUG-0037|sprint-plan|rp-auto-20261020-bug0037-sprint-plan-techlead-repair-20261021T152251Z-BUG-0037`.
  State/brief tuples were byte-identical; the strict six-tuple independently
  recomputed to
  `d28066d909fa7ef9022c7af9b1f663d2058ee18c59d40dcb07483f0a648a9ee2` in
  both records; `validate_resume_pair(writer_role=tech-lead)` returned
  `ok=true`, `idempotent_noop=false`, `reasonCode=null`, `predicate=null`.
  At validation `2026-10-21T15:27:34.843981Z`, the pair was IN-TTL (expiry
  `2026-10-21T16:22:51Z`).
- The on-disk active and template dev maps are byte-identical, retain the
  deny-first `"**": deny`, and show the exact active grants for
  `.opencode/agents/po.md` and `.opencode/commands/intake.md`; `template/**`
  covers both template twins. However, the enforced edit surface for this
  fresh child rejected the required four-file patch. Its active allow list did
  not include either active PO-story surface, so the deny-first rule applied.
  No bypass, permission-map change, or partial template-only edit was made.
- Consequently the authoritative verbatim content recorded above at L64–100
  was not applied. Both pairs remain byte-identical stubs: `po.md`
  SHA-256 `9a832ea9d905001b4fb794e4f084544ff2491ad5a7a92038db2ec82a790a1100`;
  `intake.md` SHA-256
  `42bfb16cb13d88dd7cfc3cd581ae47ae937d81572a02da4430d8573ca6f00335`.
- `python -m pytest tests/bug0037_story_shape_contract_test.py -v`:
  **4 passed, 1 failed**. The failure remains
  `test_bug0037_template_in_pomd_and_directive_in_intake` because
  `.opencode/agents/po.md` lacks `## Story block shape`.
  `python scripts/bug_issue_validate.py` returned `[BUG_VALIDATION_OK]`.
- Verdict: **EXECUTE_FAIL** — `PO_STORY_SHAPE_SURFACE_WRITE_PERMISSION_DENIED`
  remains a required-gate blocker. No successor DEC-0153 state/brief pair,
  QA spawn, `/auto`, commit, push, or publish was performed. BUG-0037 stays
  OPEN/P1 and AC-1..AC-5 remain unchecked.

---

## Fresh repair execution — 2026-10-21T15:44:18Z (role=dev) — PASS

- Consumed only the latest repaired sprint-plan pair
  `auto-20261020-bug0037|bug|BUG-0037|sprint-plan|rp-auto-20261020-bug0037-sprint-plan-techlead-repair-20261021T152251Z-BUG-0037`.
  The expected/rebuilt state and brief keys matched exactly, state and brief
  tuples were equal, `validate_resume_pair(writer_role=tech-lead)` returned
  `ok=true`, `idempotent_noop=false`, `reasonCode=null`, `predicate=null`, and
  the strict six-tuple recomputed to
  `d28066d909fa7ef9022c7af9b1f663d2058ee18c59d40dcb07483f0a648a9ee2`.
  At `2026-10-21T15:43:32.4118242Z`, it was IN-TTL; expiry is
  `2026-10-21T16:22:51Z`.
- Fresh-session effective grant confirmed: active and template `dev.md` maps
  are byte-identical; deny-first `"**": deny` remains first; exact active
  grants for `.opencode/agents/po.md` and `.opencode/commands/intake.md` are
  present. The authorized additive four-file patch succeeded, so this retry
  did not encounter the prior enforced denial. No permission-map edit was
  made.
- Applied verbatim the recorded contract at L65–85 to both `po.md` copies and
  the L92–99 story-creation directive before terminal `STOP` to both
  `intake.md` copies. Existing content was otherwise unchanged; no backlog,
  acceptance, AC, status, secret, or unrelated surface was edited.
- Pair hashes: `po.md` active/template SHA-256
  `f0368cc19fa1e21d6059289b2a561d785a7ce54bb26817788506dc2bb49035ef`;
  `intake.md` active/template SHA-256
  `b26c809c2d0a5313462e2e7a0bd3e92d81996b5dddbc7bac0feee07984a86323`.
  Both byte-parity comparisons are MATCH. The unchanged `US-0161` reference
  file SHA-256 is `f2d8f6582ec44ae0c022a32e90116bf9a372353e01feb034987b199594a62f25`.
- Required contract suite: `python -m pytest
  tests/bug0037_story_shape_contract_test.py -v` → **5 passed**. Focused
  regression (exactly one Story block shape, one Story creation before STOP,
  agent single-source text and command reference) →
  `BUG0037_FOCUSED_REGRESSION_OK`. `python scripts/bug_issue_validate.py` →
  `[BUG_VALIDATION_OK]`.
- Verdict: **EXECUTE_PASS**; decision_gate=false. BUG-0037 remains **OPEN/P1**;
  AC-1..AC-5 and the acceptance row remain unchecked. No QA or other role was
  spawned; no `/auto`, commit, push, or publish occurred.
