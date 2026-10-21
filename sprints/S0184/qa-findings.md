# QA Findings — S0184 / BUG-0037

## QA — 2026-10-21T15:48:10Z — **QA_PASS**

- **Verdict:** QA_PASS; 0 blocking findings; `decision_gate=false`.
- **Incoming authority:** execute pair `auto-20261020-bug0037|bug|BUG-0037|execute|rp-auto-20261020-bug0037-execute-dev-retry-20261021T154418Z-BUG-0037` was read-only validated at 2026-10-21T15:47:16.933301Z: state/brief records equal, rebuilt key and strict six-tuple hash `82bfe2a567fde22291c34d74fb35d638a79a12eb47b116e186c3e2ff10e11da2` MATCH, validator `ok=true`, `idempotent_noop=false`, and `next_scheduled_phase=qa`; it was IN-TTL (expiry 2026-10-21T16:44:18Z).
- **Fresh isolation:** `qa-BUG0037-qa-20261021T154810Z-fresh` (repository scan found 0 prior occurrences before mint).

| AC | Result | Evidence |
|---|---|---|
| AC-1 | PASS | `po.md` carries the canonical H2 structured template including mandatory `- Status:`; `/intake` requires that block. |
| AC-2 | PASS | Both active/template pairs are byte-identical: `po.md` SHA-256 `f0368cc19fa1e21d6059289b2a561d785a7ce54bb26817788506dc2bb49035ef`; `intake.md` SHA-256 `b26c809c2d0a5313462e2e7a0bd3e92d81996b5dddbc7bac0feee07984a86323`. Scope is OpenCode-only. |
| AC-3 | PASS | The agent is the single source of truth; the command references it, cites `US-0161`, is before `STOP`, and does not duplicate the field template. Both surfaces name the forbidden prose markers. |
| AC-4 | PASS | `python -m pytest tests/bug0037_story_shape_contract_test.py -v` → **5 passed**: positive fixture, prose negative fixture, live `US-0161`, four-file parity, and agent/command reference split. |
| AC-5 | PASS | `US-0161` reference-file SHA-256 is `f2d8f6582ec44ae0c022a32e90116bf9a372353e01feb034987b199594a62f25`, matching execute evidence; no `US-0001`..`US-0004` occurs in the OpenCode repair surfaces; no status/AC mutation was made. |

## Independent checks

- Focused static regression returned `BUG0037_FOCUSED_REGRESSION_OK`: one canonical H2 line and one Story block shape section; all required fields; Status mandatory; forbidden prose markers named; exactly one Story creation directive before `STOP`; reference split; no remote sample import; both byte-parity pairs hold.
- `python scripts/bug_issue_validate.py` → **[BUG_VALIDATION_OK]**.
- Dev maps remain active/template byte-identical and deny-first (`"**": deny`); the two narrowly granted active PO paths remain present. QA maps remain active/template byte-identical and deny-first. The only QA-map diff is the known BUG-0038 `handoffs/resume_brief.md` continuation-brief permission fix; BUG-0037 made no QA-map change.
- Delivery scope inspection found the expected four OpenCode content surfaces and sole BUG-0037 contract test. No production-code, backlog, acceptance, DEC, Cursor/Pi, or permission-map change was made by this QA phase.

## Status and stop

- BUG-0037 remains **OPEN/P1**; AC-1..AC-5 and the acceptance row remain unchecked. `RESUME_BRIEF_AUTO_REFRESH=0`; `CROSS_MODEL_REVIEW=0`; plan-verify remains skipped by ultra_lean.
- No `/auto`, child spawn, commit, push, publish, secret/.env read, or downstream phase was performed.
- **STOP:** `STOP_AFTER_QA_PASS; validate_pair_then_parent_may_spawn_verify_work`. The parent may validate the QA continuation pair and then spawn fresh `verify-work` as `qa`; this QA child does not.

---

## Verify-work independent recheck — 2026-10-21T15:54:48Z — **VERIFY_PASS**

- Revalidated the exact QA pair in TTL: state/brief records equal; exact key, locked tuple, and strict hash `246415f0a138aa31db53cb1ac4c16bd160165a2d05f73edaaf9ef71c523d1900` MATCH; `validate_resume_pair(writer_role=qa)` returned `ok=true`, `idempotent_noop=false`.
- Independent command results: BUG-0037 suite **5 passed**; focused four-surface/no-prose/no-remote-import regression **PASS**; bug validator **[BUG_VALIDATION_OK]**.
- Invariants PASS: both active/template pairs byte-identical; PO is the one structured-template source; intake is one pre-STOP reference directive without duplicated fields; US-0161 SHA-256 remains `f2d8f6582ec44ae0c022a32e90116bf9a372353e01feb034987b199594a62f25`; BUG-0037 remains OPEN/P1 and its ACs/acceptance remain unchecked.
- Full verify-work evidence: `sprints/S0184/verify-work-findings.md`; successor pair and release-only handoff: `handoffs/qa_to_verify_work.md`.
