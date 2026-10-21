# UAT — Sprint S0184 / BUG-0037

## QA UAT — 2026-10-21T15:48:10Z — **PASS**

Static OpenCode story-surface verification: **5/5 ACs PASS**, 0 failed. No live OpenCode host claim is required for this content-and-contract slice.

| AC | UAT result | Evidence |
|---|---|---|
| AC-1 | PASS | Canonical `po.md` block includes user_visible, Title, Summary, Priority, mandatory Status, and Acceptance. |
| AC-2 | PASS | OpenCode active/template parity holds for both required pairs; Cursor/Pi are not included. |
| AC-3 | PASS | Agent is single source; intake references it and prohibits the legacy prose shape before terminal `STOP`. |
| AC-4 | PASS | Five `test_bug0037_*` contract tests passed, including positive, negative, live exemplar, parity, and split coverage. |
| AC-5 | PASS | `US-0161` SHA-256 matches execute evidence; no remote sample import, grant change, status flip, or acceptance tick occurred. |

- Commands: `python -m pytest tests/bug0037_story_shape_contract_test.py -v` → **5 passed**; focused static regression → `BUG0037_FOCUSED_REGRESSION_OK`; `python scripts/bug_issue_validate.py` → **[BUG_VALIDATION_OK]**.
- Status guard: BUG-0037 remains OPEN/P1 with all ACs and its acceptance row unchecked. Verify-work remains an independent next phase.

---

## Verify-work UAT — 2026-10-21T15:54:48Z — **PASS**

| AC | Independent result |
|---|---|
| AC-1 | PASS — canonical H2 structured template with mandatory Status and pre-STOP intake directive verified. |
| AC-2 | PASS — both OpenCode active/template pairs byte-identical. |
| AC-3 | PASS — PO-only template source; intake references it, cites US-0161, and only forbids prose form. |
| AC-4 | PASS — five `test_bug0037_*` markers passed. |
| AC-5 | PASS — US-0161 hash stable; no remote `US-0001`..`US-0004` content in repair surfaces; no scope/status flip. |

- Freshly run: `python -m pytest tests/bug0037_story_shape_contract_test.py -v` → **5 passed**; focused regression → `BUG0037_FOCUSED_REGRESSION_OK`; `python scripts/bug_issue_validate.py --backlog docs/product/backlog.md --check-acceptance` → **[BUG_VALIDATION_OK]**.
- Static-only UAT remains appropriate; no live host claim. BUG-0037 remains **OPEN/P1** with backlog ACs and acceptance unchecked.
