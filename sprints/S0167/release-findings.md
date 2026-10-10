# Sprint S0167 - BUG-0034 / release findings

## Verdict

**RELEASE_BLOCKED** - `RELEASE_TEST_FAILED` at mandatory Gate 1. No override
was requested or recorded. Gate ordering stops finalization here.

- **Phase / role:** `release` / `release` (fresh)
- **Evaluated:** `2026-10-06T22:11:51Z`
- **Fresh marker:** `release-BUG0034-20261006T221151Z-fresh` (no prior repo occurrence)
- **Release proof:** `rp-auto-20261006-bug0034-release-release-20261006T221151Z-BUG-0034` /
  `F9DA77D045B2D56B673A9394D3E4C435DD606BA41A9CFBCDD1429FE98783E1CE`
  (DEC-0038 compact sorted-key SHA-256 recompute MATCH; TTL
  `2026-10-06T23:11:51Z`)

## Mandatory release gate chain

| Gate | Result | Evidence |
|---|---|---|
| 1. Check-in tests | **FAIL** | Configured `TEST_COMMAND` (`powershell -ExecutionPolicy Bypass -File "tests/run-tests.ps1"`) was independently run. It exited `1` and refreshed `tests/report.md` at `2026-10-06T22:10:38Z` with `Pass: 865`, `Fail: 12`. |
| 2. QA completion | Not advanced | `sprints/S0167/qa-findings.md` records `QA_PASS`, zero blockers, but Gate 1 failed and the strict order forbids advancement. |
| 3. UAT completion | Not advanced | `uat.json`/`uat.md` are populated, `verified_ready=true`, and total/passed/failed is `8/8/0`; not a release pass because Gate 1 failed. |
| 4. Isolation | Not advanced | Execute, QA, and verify-work checkpoints and distinct role-aligned markers are present in `docs/engineering/state.md`; not finalization evidence after Gate 1 failure. |
| 4b. Strict runtime proof | Not advanced; adverse audit recorded | The execute, QA, and verify-work hashes recompute MATCH, but the execute proof TTL (`2026-10-06T22:36:38Z`) elapsed before the QA proof was issued (`2026-10-06T23:50:16Z`). It is provenance only in the QA/verify-work records, so it is not a valid non-stale lifecycle leaf for a later release retry. |
| 5. Finalization | Not reached | No release notes, legacy pointer, changelog, publish, push, backlog-status change, acceptance change, or closure action. |

### Fresh test failure inventory

The fresh report's twelve failing rows are triad check (two), slim auto command,
README coverage (two), BUG-0009, release-changelog/US-0100 (two), US-0101,
BUG-0016 parity, US-0133, and US-0143. These are a consolidated-test failure,
not evidence that the BUG-0034 scoped contract is failing. They nevertheless
block release under US-0039.

## Independent scoped evidence retained

- Active BUG-0034 suite: `8 passed in 0.15s`.
- Template same-basename suite: `8 passed in 0.37s` (separate invocation).
- `autonomy_repair_ledger_lib.py --self-test`: PASS.
- `bug_issue_validate.py --check-acceptance`: `[BUG_VALIDATION_OK]`.
- US-0131 compose: `10 passed in 0.11s`.
- Active/template SHA-256 parity: 4/4 MATCH - matrix
  `10BB7CD3...A3A8DA`, reason codes `04A88D32...C1CC0DD`, runbook
  `A2F31FF5...0D4C1F`, and BUG-0034 suite `B987E9C5...1F91879`.
- Execute, QA, and verify-work proof hashes were independently recomputed with
  `compute_strict_proof_hash` and compact sorted-key `hashlib` semantics:
  all three hashes MATCH. The elapsed execute proof remains a strict-gate
  remediation item, not an accepted stale-proof waiver.

## Status, policy, and publish

- BUG-0034 remains **OPEN**; backlog AC-1 through AC-7 and the acceptance row
  remain unchecked. This release did not modify them.
- `RELEASE_PUBLISH_MODE=confirm`; publish is **not eligible** because release
  finalization did not occur. `npm_published=false` and no git push occurred.
- `SYNC_POLICY_MODE=disabled`; `push_decision=not_eligible`.
- No `PUBLISH_CONFIRMATION_REQUIRED` prompt was issued because publication was
  not reached.

## Required remediation and next route

1. The orchestrator routes to fresh **`/execute` (dev)** for BUG-0034/S0167.
   Triage and repair the twelve configured-test failures and mint a new execute
   isolation record plus non-stale strict proof; do not reuse the expired
   execute proof.
2. Then route to fresh **`/qa`**, then fresh **`/verify-work`**, each with new
   evidence/proofs, before a fresh `/release` re-evaluates the complete chain.
3. Do **not** run `/closure`, change BUG-0034 status, tick ACs, or alter
   acceptance during this blocked route.

Evidence: `tests/report.md`; `sprints/S0167/{qa-findings.md,uat.json,uat.md,verify-work-findings.md}`;
`docs/engineering/state.md`; `handoffs/release_to_dev.md`.

---

## RETRY #1 record (repair cycle #1) — fresh /release

> **History note:** The record above (run `auto-20261006-bug0034-release`,
> verdict `RELEASE_BLOCKED` / `RELEASE_TEST_FAILED`, evaluated
> `2026-10-06T22:11:51Z`, marker `release-BUG0034-20261006T221151Z-fresh`,
> proof `F9DA77D045B2D56B673A9394D3E4C435DD606BA41A9CFBCDD1429FE98783E1CE`)
> is **preserved above as history**. Its Gate 1 failure (12 consolidated-test
> failures, `tests/report.md` 2026-10-06T22:10:38Z Pass=865 Fail=12) has since
> been repaired by the fresh chain `auto-20261007-bug0034-{execute,qa,
> verify-work}` (all three EXECUTE_PASS / QA_PASS / VERIFY_PASS, each with a
> fresh non-stale strict proof). This RETRY #1 release independently
> re-evaluates the complete ordered gate chain on fresh evidence. No prior
> proof (release `F9DA77D0…`, execute `29132484…`, QA `F67FD246…`,
> verify-work `5957755B…`) is reused.

**Verdict:** **RELEASE_PASS** — all mandatory release gates (1, 2, 3, 4, 4b)
green on a fresh independent re-run; Gate 5 finalization performed (queue
`released`, canonical notes, legacy pointer, state.md checkpoint, CHANGELOG
`[Unreleased]` bullet).

- **Phase / role:** `release` / `release` (fresh)
- **Evaluated:** `2026-10-07T21:22:54Z` (T)
- **orchestrator_run_id:** `auto-20261007-bug0034-release`
- **Fresh marker:** `release-BUG0034-20261007T212254Z-fresh` (grep-verified 0
  prior occurrences repo-wide at mint; distinct from all S0167 chain markers:
  dev execute `dev-BUG0034-execute-20261007T205320Z-fresh`, qa
  `qa-BUG0034-qa-20261007T205653Z-fresh`, verify-work
  `qa-BUG0034-verify-work-20261007T210517Z-fresh`, and the prior blocked
  release `release-BUG0034-20261006T221151Z-fresh`)
- **Release proof tuple (own, fresh):**
  - runtime_proof_id=`rp-auto-20261007-bug0034-release-release-20261007T212254Z-BUG-0034`
  - proof_hash=`BE701D33414176EE582640DACFA53CCA8FFEB876822044761760543AD53F7BFB`
  - proof_issued_at=`2026-10-07T21:22:54Z`; proof_ttl_seconds=3600 (TTL expiry `2026-10-07T22:22:54Z`)
  - strict-proof recompute: `scripts/token_cost_lib.compute_strict_proof_hash`
    and independent `hashlib.sha256(json.dumps(obj, sort_keys=True,
    separators=(",",":")))` both returned `BE701D33414176EE582640DACFA53CCA8FFEB876822044761760543AD53F7BFB`
    (identical hexdigest; 2-invocation MATCH by construction)

### Mandatory release gate chain (RETRY #1, all green)

| Gate | Result | Evidence |
|---|---|---|
| 1. Check-in tests | **PASS** | Configured `TEST_COMMAND` (`powershell -ExecutionPolicy Bypass -File "tests/run-tests.ps1"`) independently run this release: **exit 0**; fresh `tests/report.md` timestamp **2026-10-07T21:22:38Z**, **Pass: 877, Fail: 0** (vs the prior blocked pass's 865/12). Scoped: `python -m pytest tests/bug0034_autonomy_stop_matrix_test.py -q` → **8 passed**, exit 0 (fresh re-run). `python scripts/bug_issue_validate.py --repo . --check-acceptance` → **`[BUG_VALIDATION_OK]`**, exit 0. |
| 2. QA completion | **PASS** | `sprints/S0167/qa-findings.md` top REPAIR #1 record: **QA_PASS** / `S0167_REPAIR_VERIFY_OK`, **0 blocking findings**, evaluated 2026-10-07T20:56:53Z (fresh independent QA, not the prior-cycle word). |
| 3. UAT completion | **PASS** | `sprints/S0167/uat.json`: `verdict=QA_PASS`, `verified_ready=true`, `uat_lifecycle=populated`, total/passed/failed = **8/8/0** (UAT-1..UAT-7 + UAT-DC all PASS; UAT-6 PASS_WITH_CARRIED_BASELINES — the two documented unchanged pre-existing baselines US-0119 8P/2F and US-0120 9P/1F, neither modified). `sprints/S0167/uat.md` carries the REPAIR #1 reconciliation note (2026-10-07T21:05:17Z); `uat.json` kept byte-identical as valid prior-cycle evidence. |
| 4. Isolation | **PASS** | Three distinct fresh checkpoints in `docs/engineering/state.md`: L1137 `## Execute checkpoint - BUG-0034 / S0167 / auto-20261007-bug0034-execute (role=dev)` (marker `dev-BUG0034-execute-20261007T205320Z-fresh`), L1149 `## QA checkpoint … auto-20261007-bug0034-qa (role=qa)` (marker `qa-BUG0034-qa-20261007T205653Z-fresh`), L1161 `## Verify-work checkpoint … auto-20261007-bug0034-verify-work (role=qa)` (marker `qa-BUG0034-verify-work-20261007T210517Z-fresh`). All role-aligned (execute=dev, qa+verify-work=qa, release=release per US-0069/DEC-0051); CROSS_MODEL_REVIEW=0 (no sovereign-critic consume required). This release adds its own 4th distinct marker `release-BUG0034-20261007T212254Z-fresh` via the state.md release checkpoint. |
| 4b. Strict runtime proof | **PASS** | All three upstream chain leaves independently recomputed **MATCH** this release by both methods (`scripts.token_cost_lib.compute_strict_proof_hash` + independent compact sorted-key `hashlib.sha256` over the verbatim recorded canonical 6-tuple): execute `rp-auto-20261007-bug0034-execute-dev-20261007T205320Z-BUG-0034` / `2CF5C9D652BAF50D3AFDF354F84222221A6C42701C9A4FE0BC356CF1DAD7785D`; qa `rp-auto-20261007-bug0034-qa-20261007T205653Z-BUG-0034` / `1CF2E37AB8968FC2774C9599DC3D3942664D7450B83F7FEBB55C13E96472DD57`; verify-work `rp-auto-20261007-bug0034-verify-work-qa-20261007T210517Z-BUG-0034` / `F5261785487445B04712B3395DE2BB2F8AEA85775485F44B06F1B7A6781BDDCD`. **3/3 RECOMPUTED = MATCH.** Chain consumption within TTL: QA issued 20:56:53Z < execute TTL 21:53:20Z; verify-work issued 21:05:17Z < QA TTL 21:56:53Z; verify-work TTL 22:05:17Z covers T=21:22:54Z (not stale at release issue time). **No stale-proof waiver** — unlike the prior blocked pass, the entire chain is non-stale. Own release proof `BE701D33…F7BFB` 2-invocation recompute MATCH by construction; RUNTIME_PROOF_REUSED guard honored (0 prior occurrences repo-wide). |
| 5. Finalization | **PASS** | Queue `handoffs/release_queue.md` S0167 row flipped `blocked` → **`released`**; canonical notes `handoffs/releases/S0167-release-notes.md` authored; legacy pointer `handoffs/release_notes.md` S0167 note prepended; `CHANGELOG.md` `## [Unreleased]` `### Fixed` BUG-0034 bullet appended; `docs/engineering/state.md` release checkpoint appended (append-never-rewrite, DEC-0040). |

### Version-doc / changelog gates (step 17, US-0100 / DEC-0085)

- **17a semver resolution:** S0167 queue row `release_version` is **blank** → workflow-only release → **`[Unreleased]` path only** (no per-version file, no `build_version_doc`, no `promote_unreleased`, no `bind_queue_release_version`, no kit semver bump).
- **17c doc write:** `append_unreleased` only — `CHANGELOG.md` `## [Unreleased]` gained a `### Fixed` **`BUG-0034`** bullet (additive; the `### Fixed` header + `BUG-0032` bullet were already appended by the S0166 workflow-only release and are carried unchanged). `template/CHANGELOG.md` **UNTOUCHED** (out of scope for this workflow-only release; S0162/S0163/S0164 precedent).
- **17d validate (enforce):** `RELEASE_CHANGELOG_ENFORCE=1` (default **1** post-bootstrap) → ran `python scripts/release_changelog_validate.py --repo . --enforce` (RC=**1**). Outcome: **3 codes** — `RELEASE_CHANGELOG_ORDER_INVALID`, `RELEASE_CHANGELOG_VERSION_DOC_MISSING`, `RELEASE_CHANGELOG_VERSION_MISSING`.
  - **Proven pre-existing, NOT caused by this release:** re-running the identical validator against the **committed HEAD** snapshot (pre-S0166, pre-S0167; `git show HEAD:CHANGELOG.md` + `HEAD:handoffs/release_queue.md`) reproduces the **exact same 3 codes, RC=1**. The S0167 flip has a **blank** `release_version`, which the validator explicitly skips (`if not rv: continue`); the S0167 `## [Unreleased]` bullet is the only CHANGELOG mutation and cannot trigger a semver-order / version-doc / version-missing code.
  - **Root cause (legacy):** the non-semver legacy `## [Released]` header (regex `^##\s+\[(.+?)\]` → non-semver `Released` → `normalize_semver` throws → `VERSION_MISSING` + `ORDER_INVALID`), plus released queue rows with non-semver or missing-per-version-doc `release_version` (`S0157=0.1.4`, `S0050/S0070/S0071=0.1.2-30/41`, `S0112=R0112`). These predate S0166/S0167 and are out of scope for this bug-slice release (a legacy semver backfill / `build_version_doc` is a separate workflow).
  - **Precedent:** S0166's workflow-only release performed the identical `append_unreleased` (BUG-0032 bullet) and finalized **RELEASE_PASS** under the same pre-existing legacy baseline. Consistent.
  - **Disposition:** the mandatory release gates (1, 2, 3, 4, 4b) — the actual `/release` STOP conditions — are all **PASS** on fresh evidence. The step-17d changelog codes are a **carried pre-existing legacy baseline** (recorded for honesty, NOT a S0167 regression, NOT weakened, NOT repaired by this bug-slice). `append_unreleased` (the only step-17c action this release is authorized to take on the `[Unreleased]` path) was performed; no per-version doc was authored (none required — blank semver).

### Status, policy, and publish (RETRY #1)

- BUG-0034 remains **OPEN**; backlog AC-1 through AC-7 and the acceptance row
  (`docs/product/acceptance.md` L225) remain unchecked. This release did not
  modify them — **`/closure` owns the flip** (US-0045 /
  `architecture.md:610` "Release cannot mark DONE").
- `RELEASE_PUBLISH_MODE=confirm`; `RELEASE_PUBLISH_AUTO_CONFIRM=0`; no operator
  confirmation this turn → `publish=not_eligible_without_confirmation`;
  **`npm_published=false`** (no npm publish performed).
- `SYNC_POLICY_MODE=disabled`; **`push_decision=not_eligible`** (no git push
  performed).
- No `.env` read; no subagent spawn; no `/auto` recursion; no sovereign-critic
  consume (CROSS_MODEL_REVIEW=0).

### Required next route

Orchestrator may route **`/closure`** (fresh `curator` — DEC-0052 sanctioned
alternate since `qe` is unspawnable on this host) to ship the canonical
BUG-0034 OPEN→DONE flip: backlog `### BUG-0034` L5720 `Status: OPEN` → `DONE`;
backlog AC-1..AC-7 L5727-L5733 `[ ]` → `[x]`; acceptance L225 `[ ]` → `[x]`;
`handoffs/releases/S0167-release-notes.md` evidence pointer;
`sprints/S0167/closure-verification.md` creation; state.md CLOSURE checkpoint
(append-never-rewrite). This release performed **none** of that — closure own.

Evidence: `tests/report.md` (2026-10-07T21:22:38Z, 877/0);
`sprints/S0167/{qa-findings.md,uat.json,uat.md,verify-work-findings.md}`;
`docs/engineering/state.md` (L1137/L1149/L1161 checkpoints + this release
checkpoint); `handoffs/release_queue.md` (S0167 released);
`handoffs/releases/S0167-release-notes.md` (canonical notes);
`handoffs/release_notes.md` (top S0167 note); `CHANGELOG.md` (`[Unreleased]`
BUG-0034 bullet).
