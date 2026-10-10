# Sprint S0167 — BUG-0034 / UAT record

**UAT lifecycle:** populated at QA for the ultra-lean path. **Verdict:** QA_PASS. Fixture/mock evidence only; no live-host probe.

| UAT ID | Acceptance surface | Result | Evidence |
|---|---|---|---|
| UAT-1 | AC-1 matrix registration | PASS | Active marker 1–3 passed; locked row is autonomy-resolvable / disambiguate_state / cap 3 / locked rationale. |
| UAT-2 | AC-2 reason code | PASS | Marker 5 passed; active/template reason-code pair byte-identical and names US-0119/kind/cap. |
| UAT-3 | AC-3 operator remediation | PASS | Marker 6 passed; byte-identical runbook pair forbids refresh/fallback/reconciliation/hand edit. |
| UAT-4 | AC-4 ledger | PASS | Marker 7 plus ledger self-test passed: matrix cap, authorized override, audit, exhaustion, and success-only breadcrumb. |
| UAT-5 | AC-5 architecture/additive docs | PASS | `# BUG-0034` exists; operator matrix docs are byte-identical and additive. |
| UAT-6 | AC-6 contract and regressions | PASS with carried baselines | Active 8/8 and template 8/8 pass separately; validator passes. US-0119 remains 8P/2F and US-0120 9P/1F exactly as documented. |
| UAT-7 | AC-7 security/default invariants | PASS | Negative marker retains security-hard classifications and no-refresh semantics. |
| UAT-DC | Status/closure guard | PASS | BUG-0034 remains OPEN; backlog AC-1..AC-7 and acceptance row remain unchecked. |

**Totals:** 8 passed, 0 failed, 8 total. `verified_ready=true` for the next independent verify-work phase; this does not authorize release or closure.

---

## REPAIR #1 reconciliation note — verify-work (fresh /verify-work, repair cycle #1)

- **Appended:** 2026-10-07T21:05:17Z (UTC) by the fresh `/verify-work` context (repair cycle #1; fresh_context_marker `qa-BUG0034-verify-work-20261007T210517Z-fresh`; runtime_proof_id `rp-auto-20261007-bug0034-verify-work-qa-20261007T210517Z-BUG-0034`; proof_hash `F5261785487445B04712B3395DE2BB2F8AEA85775485F44B06F1B7A6781BDDCD`).
- **Context:** repair cycle #1 after the prior release `auto-20261006-bug0034-release` was RELEASE_BLOCKED at Gate 1 (`RELEASE_TEST_FAILED`; harness 2026-10-06T22:10:38Z Pass=865/Fail=12). The 12 failures were repaired by the fresh execute `auto-20261007-bug0034-execute` (EXECUTE_PASS) and independently re-verified by the fresh QA `auto-20261007-bug0034-qa` (QA_PASS / `S0167_REPAIR_VERIFY_OK`) and by this verify-work.
- **Prior-cycle UAT record preserved:** the UAT record above (uat.md + uat.json, timestamp 2026-10-06T23:50:16Z, marker `qa-BUG0034-qa-20261006T235016Z-fresh`, runtime_proof_id `rp-auto-20261006-bug0034-qa-20261006T235016Z-BUG-0034`, proof_hash `F67FD2461747028123247ECB38CD58A2DFED634E04BB7B30176EBDFB55A4D27A`, `verified_ready=true`, 8 passed / 0 failed / 8 total) is **preserved unchanged as valid prior-cycle QA-owned evidence**. It was not rewritten, re-run, or invalidated by this verify-work phase.
- **Reconciliation by this verify-work:** the functional surface the UAT record covers was independently re-run in this verify-work (not trusted from the QA record): active BUG-0034 eight-marker suite **8 passed in 0.26s**; auto-command contract suite **151 passed + 694 subtests in 1.80s**; US-0133/US-0143 contract **17 passed in 2.27s**; acceptance validator **`[BUG_VALIDATION_OK]` exit 0**; `tests/report.md` header **Timestamp 2026-10-07T20:51:30Z, Pass=877, Fail=0** (post-repair green harness). The prior UAT verdicts (UAT-1..UAT-7 + UAT-DC all PASS; AC-6 PASS_WITH_CARRIED_BASELINES) **remain verified**; the overall verdict remains **VERIFY_PASS**.
- **Fresh proof linkage:** this verify-work consumes the fresh QA proof `rp-auto-20261007-bug0034-qa-20261007T205653Z-BUG-0034` / `1CF2E37AB8968FC2774C9599DC3D3942664D7450B83F7FEBB55C13E96472DD57` (independently recomputed MATCH by both methods; within TTL at issue: 2026-10-07T21:05:17Z < 2026-10-07T21:56:53Z) and notes the fresh execute proof `rp-auto-20261007-bug0034-execute-dev-20261007T205320Z-BUG-0034` / `2CF5C9D652BAF50D3AFDF354F84222221A6C42701C9A4FE0BC356CF1DAD7785D` (independently recomputed MATCH; within TTL at issue: 2026-10-07T21:05:17Z < 2026-10-07T21:53:20Z). No prior-cycle proof is reused.
- **Machine-readable artifact:** `sprints/S0167/uat.json` is **kept byte-identical** (this reconciliation is noted in uat.md only; uat.json has no notes/repair field and its JSON was not corrupted).
- **Guards:** BUG-0034 remains OPEN; backlog AC-1..AC-7 and the acceptance row remain unchecked; no downstream phase was run or spawned; no publish/push; no `.env` read.
