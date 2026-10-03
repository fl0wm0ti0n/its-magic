# Sprint S0164 — Execute Phase Progress (BUG-0031)

## Phase Metadata

| Field | Value |
|---|---|
| sprint_id | S0164 |
| bug_id | BUG-0031 |
| phase_id | execute |
| role | dev |
| timestamp | 2026-10-01T16:00:00Z |
| model_id | qwen3.8:27b |
| delivered by | dev subagent (fresh context per BUG-0006 / US-0048) |
| fresh_context_marker | dev-BUG0031-execute-20261001T160000Z-fresh |
| runtime_proof_id | rp-auto-20261001-bug0031-execute-dev-20261001T160000Z-BUG-0031 |
| proof_hash | 4A7B80246286CAC24FAC395334A5DA4A846F34D7F77597CC3816BE7F1629835D |

## T-anch verification note

Read the full planning chain in order (backlog ### BUG-0031 → acceptance L222 →
research.md ## R-0155 → architecture.md # BUG-0031 → sprint.md + tasks.md) and
cross-verified every anchor against the actual bytes at HEAD (SHA-256, not
test-name inference):

- Curator active + template byte-identical at the architecture `# BUG-0031` L3272
  "BEFORE" SHA (`9CC4CC11B07BE362B86A20B7C8405F2ABE30064C8E791A4653D99D6B24624595`,
  712 bytes both sides). No drift — `handoffs/archive/**` last allow, `bash: ask` /
  `task: deny` present, broad `"**": deny` first, `state.md` L7 already held.
- Rich closure pair active + template byte-identical at the architecture
  L3380 "BEFORE" SHA (`F7DBA6F1085E0AA0C6ED48E662F83ECEE0BDE51ECB619027F08816EAC3CD6CD4`).
  `## Stop conditions` L56-61 (4 bullets); `## Fail-safe reason codes` L161-171 (7 rows).
- runbook.md troubleshooting table (active and template at S0163-verified SHA
  `88168288...`, 263345 b both sides) exists at L4347-4357 with the seven `CLOSURE_*`
  rows (BUG-0022 remediation addendum + BUG-0030 section intact).
- reason_codes.md active and template byte-identical (`7038DE73...`, 34061 b —
  no `CLOSURE_*` family registered today, as expected by architecture L3343).
- Thin OpenCode `.opencode/commands/closure.md` pair: 19 lines each; **zero**
  `CLOSURE_*` vocabulary — G7-out-of-scope, **NOT touched**.
- `.cursor/agents/curator.mdc` (active + template, SHA `1807B9B9...`) has **no
  `permission:` block** (only description + `model: fast`) — G7-out-of-scope,
  **NOT touched**.
- BUG-0031 backlog status **OPEN**; acceptance row 222 = `[ ]` (not ticked).
- US-0156 AC-7 DoD row (acceptance 185) = `[ ]` (not ticked).
- BUG-0022 (DoD consumer, S0163) status OPEN, acceptance row 213 = `[ ]`
  (not flipped — this sprint **unblocks** BUG-0022 closure, does **not**
  perform it).
- Pre-change baseline (T-anch): `python scripts/bug_issue_validate.py
  --backlog docs/product/backlog.md --check-acceptance` → `[BUG_VALIDATION_OK]`
  exit 0 — **green before any change** (the 3-allow delta composes with the
  validator on the already-valid tree).
- `.opencode/agents/qa.md` (active + template, SHA `880798C2...`) — **none** of
  the 3 flip paths are in qa's allow set (least-privilege, DQ7) — **NOT granted**.
- `qe.md` / `qe.mdc` do **not** exist on either host surface — `qe` is
  unspawnable on OpenCode (G4: no `qe` spawnable type is created).

No drift found — all the architecture-locked anchors and BEFORE SHAs match at HEAD.

**Nuance to be aware of (curator `edit:` order, for `git diff HEAD` readers):**
`git diff HEAD` on the curator files will show `"**": deny` as if it *moved* from
bottom to top. This is **NOT a reordering performed by this phase**. The committed
HEAD blob (`1cce81d`) is a **stale deny-LAST** state (`state.md` allow first, `**":
deny` last). The **working-tree baseline I started from** (SHA `9CC4CC11B07BE362B86A20B7C8405F2ABE30064C8E791A4653D99D6B24624595`,
verified at T-anch and matching the architecture `# BUG-0031` **normative BEFORE**
at L3274-3289) is **deny-FIRST** (`"**": deny` as the first `edit:` row). I
**preserved** that deny-first ordering and only *appended* the 3 new `allow` rows
after `handoffs/archive/**` and before `bash: ask`. Verified byte-offset order
(active + template, identical): `**":deny`(120) < `state.md`(135) <
`handoffs/archive/**`(431) < `backlog.md`(464) < `acceptance.md`(501) <
`sprints/S*/closure-verification.md`(541) < `bash: ask`(587) — **deny-first held
(G1), append-only held**. This matches the architecture normative AFTER block
(L3293-3308) exactly. The deny line appearing to shift in `git diff HEAD` is the
pre-existing working-tree-vs-stale-HEAD discrepancy (same as the untouched
`qa.md`/`backlog.md`/`acceptance.md` working-tree drift I did not write).

## Task Status

| Task | Status | Notes |
|---|---|---|
| T-anch | ✅ DONE | Verified planning chain anchors at HEAD SHAs (no drift); curator/closure pair BEFORE SHAs match architecture exactly; thin OpenCode pair + curator.mdc + qa flip-path denies all clean; pre-change validator green |
| T-001 | ✅ DONE | 3 additive `edit:` allow rows appended to `.opencode/agents/curator.md` (active) after `handoffs/archive/**`, before `bash: ask` (append-only, no reorder) |
| T-002 | ✅ DONE | Same 3-allow delta applied to `template/.opencode/agents/curator.md`; active↔template byte-parity verified (837b both sides, SHA `300364FCA79095B415CFBC0A06CA24E08322708D27A6D300E053EE6972832B4E`) |
| T-003 | ✅ DONE | `CLOSURE_PERMISSION_FLIP_PATHS_DENIED` additively registered in BOTH rich closure pair (`## Fail-safe reason codes` table + `## Stop conditions` bullet, byte-parity at 10252 b both sides → `73DF8409...`), runbook (troubleshooting-table row, byte-parity at 263729 b both sides → `0F82B02B...`), reason_codes.md (Other-stories bullet, byte-parity at 34163 b both sides → `D05823EC...`); existing 7 `CLOSURE_*` codes **not renamed/replaced** |
| T-004 | ✅ DONE | DQ6 OpenCode-surface parity note (architecture L3354 verbatim, with § + em-dashes) added after the `override` bullet, before `## Phase responsibility` — byte-parity in rich closure pair |
| T-005 | ✅ DONE | `tests/bug0031_opencode_closure_flip_authz_test.py` authored (active), 8 markers `test_bug0031_*` (mock-injection style, no live OpenCode probe). **8/8 pass** |
| T-006 | ✅ DONE | `template/tests/bug0031_opencode_closure_flip_authz_test.py` byte-identical mirror (13248 b both sides, SHA `1729344A5A64721081EF7137240A7CEFB3164A35C53A0A0572F187AA1C4D241F`) — matches BUG-0027 sibling convention |
| T-007 | ✅ DONE | Full suite green — see "Test Results" + "Guard Checks" below |

## Byte-parity verification (independent, this session — not test-name inference)

| Pair | Active SHA-256 | Template SHA-256 | Size (both) |
|---|---|---|---|
| `.opencode/agents/curator.md` ↔ template | `300364FCA79095B415CFBC0A06CA24E08322708D27A6D300E053EE6972832B4E` | `300364FCA79095B415CFBC0A06CA24E08322708D27A6D300E053EE6972832B4E` | 837 b |
| `.cursor/commands/closure.md` ↔ template (rich) | `73DF84093823D25C44B23D7CC00A9C56A78DB99EF2770D37F962DCE7C5659D45` | `73DF84093823D25C44B23D7CC00A9C56A78DB99EF2770D37F962DCE7C5659D45` | 10252 b |
| `tests/bug0031_*` ↔ template | `1729344A5A64721081EF7137240A7CEFB3164A35C53A0A0572F187AA1C4D241F` | `1729344A5A64721081EF7137240A7CEFB3164A35C53A0A0572F187AA1C4D241F` | 13248 b |
| `docs/engineering/runbook.md` ↔ template | `0F82B02B764DE117496C4279CD2A94DD29F20969D88B8897311F65397AD2FF08` | `0F82B02B764DE117496C4279CD2A94DD29F20969D88B8897311F65397AD2FF08` | 263729 b |
| `docs/engineering/reason_codes.md` ↔ template | `D05823ECE6CB523D1C43A39874C94DD1E7DCE3D1B3613755E0584B2C1A041E99` | `D05823ECE6CB523D1C43A39874C94DD1E7DCE3D1B3613755E0584B2C1A041E99` | 34163 b |

All five byte-parity invariants **OK** (direct byte comparison, not test-name
inference).

## Test Results (real output, this session)

```
tests/bug0031_opencode_closure_flip_authz_test.py:                 8/8 PASSED (m1-m8, all markers)
  - test_bug0031_curator_flip_paths_present_active     PASSED
  - test_bug0031_curator_flip_paths_present_template   PASSED
  - test_bug0031_curator_active_template_byte_parity   PASSED
  - test_bug0031_qa_flip_paths_denied                  PASSED
  - test_bug0031_deny_before_allow_index               PASSED
  - test_bug0031_sprint_wildcard_shape                 PASSED
  - test_bug0031_fail_closed_diagnostic_token_present  PASSED
  - test_bug0031_no_sibling_mutation                   PASSED

tests/bug0027_opencode_manual_phase_persist_test.py (compose regression): 10/10 PASSED (unmodified)
tests/bug0016_contract_test.py                            (compose regression):  7/7 PASSED (unmodified)
python scripts/bug_issue_validate.py --backlog docs/product/backlog.md --check-acceptance: [BUG_VALIDATION_OK] exit 0
  (green at T-anch baseline AND post-change — the 3-allow delta composes with the validator)
python scripts/check_intake_template_parity.py --scope=us-0120:   [INTAKE_TEMPLATE_PARITY_OK] exit 0
python scripts/check_intake_template_parity.py --scope=model-tier:[INTAKE_TEMPLATE_PARITY_OK] exit 0
python scripts/check_intake_template_parity.py --scope=bug-0030:  [INTAKE_TEMPLATE_PARITY_OK] exit 0
  (runbook.md + reason_codes.md hard byte-parity pairs: active == template for all three scopes)
```

## Guard Checks

- G1 — `"**": deny` NOT reordered; still the first `edit:` row in both curator files (marker 5 asserts).
- G2 — `bash: ask` / `task: deny` NOT touched; no 4th flip-path allow added.
- G3 — `qa` NOT granted the 3 flip paths; marker 4 negates (qa active + template allow sets contain **none** of the 3).
- G4 — No `qe.md` / `qe.mdc` created (verified absent).
- G5 — DQ10 siblings not mutated: BUG-0016 baseline (test_bug0016* 7/7 pass unmodified); BUG-0027 baseline (test_bug0027_* 10/10 pass unmodified); US-0156 AC-7 row 185 `[ ]` (not ticked).
- G6 — BUG-0031 status NOT flipped (backlog `### BUG-0031` still `Status: OPEN`); BUG-0022 (DoD consumer) NOT flipped (unblocked, not performed — belongs to its own post-fix closure cycle per US-0045).
- G7 — `.cursor/agents/curator.mdc` (active + template, byte-identical at `1807B9B9...`) **NOT touched**; thin `.opencode/commands/closure.md` pair **NOT touched**.
- G8 — Existing seven `CLOSURE_*` codes **not renamed/replaced** (marker 7 asserts: all 7 still present in the rich pair + runbook).
- G9 — No npm publish, no git push, no `.env` read, no `/auto` recursion, no subagent spawn.
- G10 — No companion DEC authored; S0164/ already exists from sprint-plan (NOT re-created).

## Files modified this session (exactly 10, active + template pairs)

1. `.opencode/agents/curator.md` (active) — **T-001** +3 `edit:` `allow` rows (after `handoffs/archive/**`, before `bash: ask`); no other change.
2. `template/.opencode/agents/curator.md` — **T-002** byte-identical mirror (+3 rows).
3. `.cursor/commands/closure.md` (active) — **T-003** +1 `## Stop conditions` bullet + 1 `## Fail-safe reason codes` table row + **T-004** +1 DQ6 note line (after `override` bullet, before `## Phase responsibility`). All 3 additions additive, no rewrite of existing 7 `CLOSURE_*` codes.
4. `template/.cursor/commands/closure.md` — byte-identical mirror (3 additions).
5. `docs/engineering/runbook.md` (active) — **T-003** +1 troubleshooting-table row (after `CLOSURE_LEGACY_DRIFT` row, before blank+heading); byte-parity pair preserved.
6. `template/docs/engineering/runbook.md` — byte-identical mirror (+1 row).
7. `docs/engineering/reason_codes.md` (active) — **T-003** +1 Other-stories bullet (after `US-0096` bullet, before blank+`See docs/engineering/architecture.md ...`).
8. `template/docs/engineering/reason_codes.md` — byte-identical mirror (+1 bullet).
9. `tests/bug0031_opencode_closure_flip_authz_test.py` (NEW, active) — **T-005**, 8 markers `test_bug0031_*`.
10. `template/tests/bug0031_opencode_closure_flip_authz_test.py` (NEW, template) — **T-006**, byte-identical mirror of #9 (matches BUG-0027 sibling convention of byte-identical active↔template test files).

Plus one **documentation** deliverable (sibling convention):

11. `docs/engineering/state.md` — **appended** (not in-scope-mutation) a new `## Execute checkpoint — BUG-0031 / S0164 (role=dev)` + `## Strict runtime proof (DEC-0038) — S0164 / BUG-0031` block at EOF, with the 12-field isolation block + 7-field proof block matching the sibling BUG-0030/S0161 execute-block style (L1030-1099).
12. `sprints/S0164/progress.md` (this file, NEW) — the execute-phase record.

## Untouched (verified by `git status --porcelain` + SHA at both sides)

- `.opencode/agents/qa.md` — byte-identical active↔template at SHA `880798C2...`; **none** of the 3 flip paths in qa allow set (marker 4).
- `template/.opencode/agents/qa.md` — same SHA, same content.
- `.cursor/agents/curator.mdc` — SHA `1807B9B9...`; **no `permission:` block**; G7.
- `template/.cursor/agents/curator.mdc` — same SHA; G7.
- `.opencode/commands/closure.md` (thin OpenCode) — 19 lines, zero `CLOSURE_*`; G7.
- `template/.opencode/commands/closure.md` — same, zero `CLOSURE_*`; G7.
- `docs/product/backlog.md` — BUG-0031 block still `Status: OPEN` (my T-anch read only; **I did not write** to it).
- `docs/product/acceptance.md` — BUG-0031 row 222 still `[ ]` (my T-anch read only; **I did not write** to it); US-0156 AC-7 DoD row 185 still `[ ]`.
- No `qe.md` / `qe.mdc` created (G4).
- No `companion DEC` authored (architecture L3251: "Companion DEC: **none**").

## Stop Condition

STOP. Execute phase complete for deliverables under allowed edit policies
(T-anch → T-007 all DONE; 8/8 markers pass; compose suites 10/10 + 7/7 green;
validator `[BUG_VALIDATION_OK]`; `check_intake_template_parity.py` green for
us-0120 / model-tier / bug-0030 scopes; 10 files modified, all byte-parity
preserved).

**Next Phase**: Orchestrator MUST spawn `/qa` in fresh QA context per BUG-0006.

**DoD Notes**:
- BUG-0031 remains **OPEN** — this sprint **unblocks** the /closure
  capability; it does **not** perform a closure flip (that belongs to each
  bug's own `/closure` phase per US-0045; e.g. S0163/BUG-0022's closure is
  still pending and is **not** this sprint's job).
- US-0156 AC-7 DoD gate NOT ticked (row 185 `[ ]`).
- BUG-0022 NOT flipped (DoD consumer, unblocked by this sprint; its own
  post-fix closure cycle owns the flip).
- No npm publish; no git push; no `.env` read; no `/auto` recursion; no
  subagent spawn.

**QA Action Required**: Review execute phase (10 files modified), validate
byte-parity (SHA list above), confirm no sibling mutation, decide on `/qa`
spatial next step.

---

Generated by execute dev subagent (fresh, BUG-0006/US-0048)
Timestamp: 2026-10-01T16:00:00Z
fresh_context_marker: dev-BUG0031-execute-20261001T160000Z-fresh
runtime_proof_id: rp-auto-20261001-bug0031-execute-dev-20261001T160000Z-BUG-0031
proof_hash: 4A7B80246286CAC24FAC395334A5DA4A846F34D7F77597CC3816BE7F1629835D
Session: S0164/execute/BUG-0031
