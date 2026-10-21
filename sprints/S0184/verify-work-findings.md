# Verify-work Findings — S0184 / BUG-0037

## 2026-10-21T15:54:48Z — **VERIFY_PASS**

- **Incoming pair:** `auto-20261020-bug0037|bug|BUG-0037|qa|rp-auto-20261020-bug0037-qa-qa-20261021T154810Z-BUG-0037` validated `ok=true`, `idempotent_noop=false`, with state/brief equality, exact key, all locked fields, and strict hash `246415f0a138aa31db53cb1ac4c16bd160165a2d05f73edaaf9ef71c523d1900` MATCH. Validation time `2026-10-21T15:53:42.336556Z` was before expiry `2026-10-21T16:48:10Z`.
- **Independent commands:**
  - `python -m pytest tests/bug0037_story_shape_contract_test.py -v` → **5 passed**.
  - Focused static regression → `BUG0037_FOCUSED_REGRESSION_OK` (two pair hashes: PO `f0368cc19fa1e21d6059289b2a561d785a7ce54bb26817788506dc2bb49035ef`; intake `b26c809c2d0a5313462e2e7a0bd3e92d81996b5dddbc7bac0feee07984a86323`).
  - `python scripts/bug_issue_validate.py --backlog docs/product/backlog.md --check-acceptance` → **[BUG_VALIDATION_OK]**.
- **Locks/invariants:** R-0174 Option A and architecture `# BUG-0037` confirmed; all four OpenCode PO/intake surfaces inspected; each pair is byte-identical. PO has exactly one Story block shape section and one structured template; intake has exactly one Story creation directive before `STOP`, references `po.md` and `US-0161`, and does not repeat template fields. No live H3/prose-shaped story block appears in delivery surfaces. No `US-0001`..`US-0004` text appears in the four repair surfaces or the BUG-0037 test. US-0161 whole-file SHA-256 is `f2d8f6582ec44ae0c022a32e90116bf9a372353e01feb034987b199594a62f25`.
- **Scope/status:** BUG-0037 remains **OPEN/P1**; AC-1..AC-5 and acceptance row remain unchecked. No map/backlog/acceptance/permission/agent-map/production-code/remote-import breach found in this verification scope. `CROSS_MODEL_REVIEW=0`; `RESUME_BRIEF_AUTO_REFRESH=0`; plan-verify remains skipped by ultra_lean.
- **Successor:** fresh marker `qa-BUG0037-verifywork-20261021T155448Z-fresh`; proof `rp-auto-20261020-bug0037-verify-work-qa-20261021T155448Z-BUG-0037` / `5be2ea888887ae5c0fd30ca6c0093c92f8a0e8ed0733a1f6dee355d5e8f0f79b`, TTL 3600. State-first pair then matching brief are recorded under DEC-0153. Next may only be a parent-validated fresh `release` role.
- **STOP:** `STOP_AFTER_VERIFY_PASS; validate_pair_then_parent_may_spawn_release`.
