# QA Findings — S0168 / BUG-0033 (gate-lifted harness re-verification)

> **LATEST (qa3 RE-QA, 2026-10-10T19:39:01Z): QA_PASS 8/8.** See `## [RE-QA qa3]` at the bottom. Prior QA_FAIL (B-1) and QA_PASS (qa2, 12/12) sections are retained as history and are not erased.

> **PRIOR STATUS (qa2, superseded by the qa3 RE-QA at the bottom): QA_PASS (12/12).** The section that follows is the **first** QA context
> (`qa-BUG0033-20261009T225321Z-fresh`), which returned **QA_FAIL (B-1)** — retained as history.
> The **qa2** verdict is the **RE-QA** section that used to be the bottom of this file
> (context `qa-BUG0033-20261010T130901Z-fresh`, run `auto-20261010-bug0033-qa2`), which
> independently re-ran the full 12-check battery after the gatefix4 dev child remediated B-1
> (C8 full-harness Fail=0 + triad hot-surface restored in-cap). That re-QA returned **QA_PASS 12/12**;
> see the qa2 "Verdict line" (retained above the qa3 section). The header block below reflects the SUPERSEDED first-context result.

## [HISTORY] First QA context — QA_FAIL (B-1), superseded by the RE-QA QA_PASS at the bottom

- **phase_id**: qa; **role**: qa; **bug_id**: BUG-0033; **sprint_id**: S0168
- **verdict**: **QA_FAIL** (see B-1)
- **reason_code**: `BUG0033_QA_HARNESS_GATE_UNMET` (bug-segment diagnostic label; **no** registry mutation)
- **timestamp**: 2026-10-09T23:15:00Z (UTC; this QA context)
- **fresh_context_marker**: `qa-BUG0033-20261009T225321Z-fresh` (FRESH; grep-verified 0 prior occurrences repo-wide at mint)
- **orchestrator_run_id**: `auto-20261009-bug0033-qa`
- **runtime_proof_id**: `rp-auto-20261009-bug0033-qa-20261009T225321Z-BUG-0033`
- **proof_issued_at**: `2026-10-09T22:53:21Z`; **proof_ttl_seconds**: 3600; **proof_ttl_expiry**: `2026-10-09T23:53:21Z`
- **proof_hash**: `165D4C6C2101A75C8693C0819EEDBE0B222D8F8A044AB59A4997B1F4E28E76C3`
  - 2-invocation recompute MATCH (library `scripts/token_cost_lib.compute_strict_proof_hash` == independent `SHA-256(canonical_json_dumps(6-tuple, sort_keys, (",",":")))` → identical uppercase hexdigest).
- **canonical tuple (verbatim)**:
  `{"orchestrator_run_id":"auto-20261009-bug0033-qa","phase_id":"qa","proof_issued_at":"2026-10-09T22:53:21Z","proof_ttl_seconds":3600,"role":"qa","runtime_proof_id":"rp-auto-20261009-bug0033-qa-20261009T225321Z-BUG-0033"}`
- **consumed execute proof (provenance, NOT trusted for verdict)**: `rp-auto-20261009-bug0033-gatefix3-dev-20261009T213646Z-BUG-0033` / `E24685BB10B60821E1852B92F6123D6AB5B5E5DD9511A7D7C86691C8DFDF6935` (dev gatefix3 EXECUTE_PASS). **TTL note (honesty):** issued 2026-10-09T21:44:30Z + 3600s = expiry 2026-10-09T22:44:30Z, which is ~9 minutes BEFORE this QA issue time 2026-10-09T22:53:21Z. Per the established chain-leaf precedent (execute/QA/verify-work checkpoints), the per-consumption in-TTL gate applies to leaves consumed within TTL; here I consumed the execute proof as **integrity-verified provenance only** and **independently re-ran all functional + harness evidence in this fresh QA context** (no stale-proof waiver; no reuse of any prior-cycle proof as a credential). The QA verdict below rests entirely on THIS context's independent re-runs, not on the dev's recorded outputs.
- **superseded provenance chain (operator-authorized gate-lift, 3 attempts)**:
  - Original execute (gate BLOCKED): `dev-BUG0033-execute-20261009T113327Z-fresh` / `rp-auto-20261009-bug0033-execute-dev-20261009T113327Z-BUG-0033` / `D0D027A7EE968E35A237A669F1C6A1701E48679F88FFFC8297FA6717F40CB372`.
  - Gatefix #2: `dev-BUG0033-gatefix2-20261009T184150Z-fresh` / `rp-…gatefix2…` / `6C3875E01AB25985E4E99597227DA3E03EAA913F916FCBC093190505AB47DAA5`.
  - Gatefix #3 (the gate-lift under QA): `dev-BUG0033-gatefix3-20261009T213646Z-fresh` / `rp-auto-20261009-bug0033-gatefix3-dev-20261009T213646Z-BUG-0033` / `E24685BB10B60821E1852B92F6123D6AB5B5E5DD9511A7D7C86691C8DFDF6935`.

---

## Verdict

### QA_FAIL — the S0168 "harness green Fail=0" exit gate (sprint.md L134) is NOT met in the current repo state.

Independent re-run of the full harness `powershell -ExecutionPolicy Bypass -File tests/run-tests.ps1`
(start 2026-10-09T22:55:19Z, end 2026-10-09T23:02:49Z) → **exit 1**, `tests/report.md`
**Timestamp 2026-10-09T23:02:49Z, Pass=877 / Fail=2**. The 2 FAIL lines are:

- `[FAIL] triad check passes on repo`
- `[FAIL] triad check idempotent rerun passes`

Direct verbatim reproduction of the failing gate (`python scripts/enforce-triad-hot-surface.py --repo . --check` → exit 1):

```
STATE_ARCHIVE_REQUIRED surface=state path=docs/engineering/state.md lines=1209/1200 units=30/80 reason=ARTIFACT_HOT_SURFACE_OVERSIZE
```

**Root cause (deterministic, isolated, non-BUG-0033-fix):** `docs/engineering/state.md` is now **1209 lines**, over the
**1200-line triad hot-surface cap**. The over-cap condition was introduced by the **dev's own gatefix3 checkpoint append**
(`## Execute checkpoint … auto-20261009-bug0033-gatefix3`, `state.md` **L1182–L1209 = 28 lines**), which landed **after**
the dev's last green harness run. Sequence (all from the dev's own records): dev harness run `2026-10-09T21:44:13Z`
(Pass=879/Fail=0, on a **1181-line** state.md that did NOT yet contain the gatefix3 checkpoint) → dev then appended the
gatefix3 checkpoint (proof_issued_at `2026-10-09T21:44:30Z`) → state.md 1181 → **1209** → **dev did NOT re-run the harness
after appending the checkpoint**. The dev's recorded `Pass=879/Fail=0` therefore reflects a state that **no longer exists**.
My QA re-run (877 = 879 − 2) flips exactly the 2 triad lines PASS→FAIL; **every other assertion is green**, including all
6 previously-failing parity lines and both `validate_readme_feature_coverage` lines (see Battery C below). This is a
gate/hygiene regression, **not** a defect in the BUG-0033 section copy or in the 3 gate-lift fixes — those are fully
intact and independently green (Batteries A + B).

Per the task verdict rules ("QA_PASS only if ALL of A+B+C+D pass"; "QA_FAIL … if anything is red or unexplained") and the
hard rule ("If any command in the battery fails for an UNEXPECTED reason (not in the documented baseline), stop and report
verbatim; do NOT attempt to fix"), this is a **BLOCKING** red (B-1). QA does **not** fix it. Route to dev (`handoffs/qa_to_dev.md`)
with the remediation path in B-1.

---

## Battery result table (12 checks)

| # | Section | Command | Expected | Actual (this QA context) | P/F |
|---|---|---|---|---|---|
| A1 | BUG-0033 core | `python -m pytest tests/bug0033_opencode_command_parity_test.py -q` | 10/10 | **10 passed in 1.92s** (exit 0) | **PASS** |
| A2 | BUG-0033 core | `python scripts/check_intake_template_parity.py --scope=bug-0033` | exit 0 + banner | **exit 0** + `[INTAKE_TEMPLATE_PARITY_OK] scope=bug-0033` | **PASS** |
| A3 | BUG-0033 core | Spot-check 2 pairs by eye (closure + execute) | both headings, Stop→Fail-safe order, no dispatch fragments | confirmed (see below) | **PASS** |
| B4 | Gate-lift | `python scripts/validate_readme_feature_coverage.py --repo . --report` (×2) | exit 0, `coverage_missing=[]`, `status=PASS`; byte-identical | **exit 0** ×2; `coverage_missing=[]`; `status=PASS`; `coverage_total=43`; BUG-0034 in `coverage_present`; 2 runs SHA-256 **identical** (`7E652FD7…CBC`) | **PASS** |
| B5 | Gate-lift | `python scripts/check_intake_template_parity.py --scope=readme-feature-coverage` | exit 0 + banner | **exit 0** + `[INTAKE_TEMPLATE_PARITY_OK] scope=readme-feature-coverage` | **PASS** |
| B6 | Gate-lift | `python scripts/check_intake_template_parity.py --scope=opencode-adapter` + agent-map twin hash | exit 0 + banner; twins byte-identical | **exit 0** + `[INTAKE_TEMPLATE_PARITY_OK] scope=opencode-adapter`; `.opencode/agents/dev.md` == `template/…` SHA-256 **4B8B1589…E23** both | **PASS** |
| B7 | Gate-lift | Read BUG-0034 rows in place (its_magic L445-447; docs/developer L38-42) | text/format per dev_to_qa, correct sections | confirmed (see below) | **PASS** |
| C8 | Harness | `powershell -ExecutionPolicy Bypass -File tests/run-tests.ps1` | **Pass=879 / Fail=0**, report newer than run start, zero `[FAIL]` | **exit 1; Pass=877 / Fail=2**; report 23:02:49Z (newer than 22:55:19Z start) but **2 `[FAIL]` (triad lines)** | **FAIL** |
| C9 | Regression | `python -m pytest tests/us0125_contract_test.py tests/us0126_contract_test.py -q --tb=no` | failing set ⊆ 5 documented baseline; `test_us0126_parity_scope_opencode_adapter` GREEN | **5 failed, 18 passed**; failing set = **exactly** the 5 baseline markers; `test_us0126_parity_scope_opencode_adapter` **GREEN** | **PASS** (carry-forward) |
| C10 | Regression | `tui.json` `"plugin": []` (active+template) + US-0125 thin-dispatch contract files untouched by the 3 gate-lift fixes | `"plugin": []` present both; git diff = only the 4 gate-lift files + evidence docs | `tui.json` active==template SHA-256 **C2FAC9D6…7DE90** (identical), `"plugin": []` both; US-0125/0126 contract files NOT among the 3 gate-lift edits (see D) | **PASS** |
| D11 | Provenance | Grep the 3 fresh_context_markers | each occurs only in the evidence docs that reference it | all 3 markers present in the expected evidence docs only (see D.11) | **PASS** |
| D12 | Integrity | BUG-0033 OPEN + AC-1..AC-8 `[ ]`; acceptance L224 `[ ]`; BUG-0034 DONE + ACs `[x]`; no NEW gate-lift DEC; resume_brief top pointer unchanged; no publish/push/.env | all hold | all hold (see D.12) | **PASS** |

**Summary: 11 PASS / 1 FAIL (C8). The single FAIL is the BLOCKING B-1.**

---

## Battery A — BUG-0033 functional core (AC-1..AC-8): GREEN

### A1 — parity suite
```
$ python -m pytest tests/bug0033_opencode_command_parity_test.py -q
..........                                                               [100%]
10 passed in 1.92s        (exit 0)
```
10/10. Includes `test_us0126_parity_scope_opencode_adapter` (now GREEN — was the newly-failing m9 marker at gatefix #2).

### A2 — parity CLI scope
```
$ python scripts/check_intake_template_parity.py --scope=bug-0033
[INTAKE_TEMPLATE_PARITY_OK] scope=bug-0033        (exit 0)
```
6 pairs byte-identical active==template (5 commands + test twin).

### A3 — manual spot-check (guard against a self-fulfilling suite)
Read `.opencode/commands/closure.md` (29 lines) and `.opencode/commands/execute.md` (34 lines) directly:
- **closure.md**: `## Stop conditions` at **L19**, `## Fail-safe reason codes` at **L25** → **Stop BEFORE Fail-safe** (LOCKED order). `## Stop conditions` body = diagnostics-only fail-closed stop tokens (`CLOSURE_RELEASE_EVIDENCE_MISSING`, `CANONICAL_STATUS_CONFLICT`, `CLOSURE_AMBIGUOUS_TARGET`, `CLOSURE_TARGET_NOT_FOUND`, `CLOSURE_PERMISSION_FLIP_PATHS_DENIED`); `## Fail-safe reason codes` body = pointer to the rich table (`.cursor/commands/closure.md` `## Fail-safe reason codes and remediation guidance`). **No** dispatch/policy fragment; `STOP` sentinel final (L29); frontmatter `agent: qa` preserved. ✅
- **execute.md**: `## Stop conditions` at **L24**, `## Fail-safe reason codes` at **L29** → **Stop BEFORE Fail-safe**. Bodies are the terse derived diagnostics-only vocabulary + pointer to the rich `execute.md`; **no** dispatch logic; `STOP` sentinel final (L34); frontmatter `agent: dev` preserved. ✅
Both pairs match the LOCKED R-0159 DQ1/DQ2 design (diagnostics-only, 0 invented tokens, rich-source parity). The section copy is **NOT** policy-relevantly divergent — **no BUG-0033-scope defect found in the section text.** (The full 5-pair + test-twin byte parity is already asserted by A1/A2 and the harness line "BUG-0033 10-marker command parity suite" which is `[PASS]` in the fresh report.)

**A-VERDICT: PASS.** AC-1..AC-8 functionally green.

---

## Battery B — Gate-lift surfaces (BUG-0034 rows + agent-map parity): GREEN

### B4 — rfc feature-coverage validator (run twice)
```
$ python scripts/validate_readme_feature_coverage.py --repo . --report   # run 1
$ python scripts/validate_readme_feature_coverage.py --repo . --report   # run 2
```
- Both **exit 0**. Report (identical both runs, SHA-256 `7E652FD7A003E8CBC8D64707426BD2437D0E6093AB6A80E31838EDCC97166CBC` both):
  `{"coverage_missing":[],"coverage_present":[…,"BUG-0034",…],"coverage_total":43,"gaps":[],"repo_root":".","report_schema_version":1,"status":"PASS"}`
- **`coverage_missing=[]`**, **`status=PASS`**, **BUG-0034 in `coverage_present`** → the attempt #1/#2 rows are intact. Two-run byte-identical confirms idempotency (the original HOLD's 2 gate-blocking rfc failures are resolved).

### B5 — parity scope readme-feature-coverage
```
$ python scripts/check_intake_template_parity.py --scope=readme-feature-coverage
[INTAKE_TEMPLATE_PARITY_OK] scope=readme-feature-coverage        (exit 0)
```

### B6 — parity scope opencode-adapter + agent-map twin hash
```
$ python scripts/check_intake_template_parity.py --scope=opencode-adapter
[INTAKE_TEMPLATE_PARITY_OK] scope=opencode-adapter        (exit 0)
$ (Get-FileHash .opencode\agents\dev.md).Hash ; (Get-FileHash template\.opencode\agents\dev.md).Hash
4B8B1589CE33B09C2B90AE76425484F0963FDEFBA26E8A63B0C99F0765772E23
4B8B1589CE33B09C2B90AE76425484F0963FDEFBA26E8A63B0C99F0765772E23   (byte-identical)
```
- Active `.opencode/agents/dev.md` L26 carries `    "docs/developer/**": allow`; template mirror now byte-identical (the attempt #3 parity-restore is intact). **This is the fix that un-broke the 6 parity harness lines** — confirmed by B6 + C8 (those 6 lines now `[PASS]`).
- Also re-verified the attempt #1 its_magic twin: `its_magic/README.md` == `template/its_magic/README.md` SHA-256 **E46DFE04…68F4** both (byte-identical).

### B7 — BUG-0034 rows in place (read in situ)
- `its_magic/README.md` **L447**: `- **BUG-0034** — PO closure precondition conflict registered in the autonomy stop matrix with `disambiguate_state` repair (cap 3); never auto-refreshes the brief.` — sits in the root `## Commands and workflow` feature list (immediately after the `**BUG-0032**` row L446). ✅
- `docs/developer/README.md` **L40-41**: `- **BUG-0034** — PO closure precondition conflict registered in the autonomy stop matrix (`PO_CLOSURE_PRECONDITION_CONFLICT`, `disambiguate_state`, cap 3); traceability:` / `  runbook `## PO_CLOSURE_PRECONDITION_CONFLICT`, architecture `# BUG-0034`.` — bold `**BUG-0034**` + `traceability:` line, in the dev `## Workflow` section, immediately after the `**BUG-0030**` row L39 (before `## Quality gates` L43). ✅
Text/format match `handoffs/dev_to_qa.md` exactly and sit in the validator-expected sections.

**B-VERDICT: PASS.** All 3 gate-lift fixes (2 BUG-0034 row pairs + 1 agent-map parity line) are intact and independently green.

---

## Battery C — Full harness + regressions

### C8 — FULL HARNESS: **FAIL** (B-1)
```
$ powershell -ExecutionPolicy Bypass -File tests/run-tests.ps1
HARNESS_START_UTC=2026-10-09T22:55:19Z
HARNESS_EXIT=1
HARNESS_END_UTC=2026-10-09T23:02:49Z

$ tests\report.md (header)
# its-magic Test Report
Timestamp: 2026-10-09T23:02:49Z
Pass: 877
Fail: 2
```
- Report timestamp (23:02:49Z) **IS newer than** my run start (22:55:19Z) ✅.
- But **Fail: 2** (expected **Fail: 0**), exit 1 (expected 0).
- The 2 `[FAIL]` lines (verbatim from the fresh report):
  - `- [FAIL] triad check passes on repo`
  - `- [FAIL] triad check idempotent rerun passes`
- Direct reproduction of the failing gate (read-only `--check`, exit 1):
  ```
  STATE_ARCHIVE_REQUIRED surface=state path=docs/engineering/state.md lines=1209/1200 units=30/80 reason=ARTIFACT_HOT_SURFACE_OVERSIZE
  ```
- **NOT** the 6 previously-failing parity lines, **NOT** the 2 rfc lines — those are all `[PASS]` in the fresh report:
  ```
  - [PASS] validate_readme_feature_coverage repo --report passes
  - [PASS] validate_readme_feature_coverage report idempotent
  - [PASS] check_intake_template_parity --scope=bug-0016 passes (BUG-0016)
  - [PASS] BUG-0016 contract tests pass
  - [PASS] BUG-0017 OpenCode EOL contract tests pass
  - [PASS] check_intake_template_parity --scope=bug-0027 passes (BUG-0027)
  - [PASS] BUG-0027 OpenCode manual phase persist contract tests pass
  - [PASS] BUG-0033 10-marker command parity suite (tests/bug0033_opencode_command_parity_test.py)
  ```
- Arithmetic: dev recorded 879 Pass + 0 Fail = **879 total**; this QA run = 877 Pass + 2 Fail = **879 total** (same assertion count). Exactly the 2 triad lines flipped PASS→FAIL — because state.md crossed the triad cap **after** the dev's green run. **B-1 (BLOCKING).**

### C9 — us0125/us0126 standalone baseline (carry-forward)
```
$ python -m pytest tests/us0125_contract_test.py tests/us0126_contract_test.py -q --tb=no
FF....FF..........F....                                                  [100%]
FAILED tests/us0125_contract_test.py::test_us0125_command_inventory
FAILED tests/us0125_contract_test.py::test_us0125_clone_guard
FAILED tests/us0125_contract_test.py::test_us0125_missing_command_does_not_disable_plugin
FAILED tests/us0125_contract_test.py::test_us0125_auto_command_dispatch_only
FAILED tests/us0126_contract_test.py::test_us0126_default_host_reminder
5 failed, 18 passed in 0.67s        (exit 1)
```
- Failing set = **EXACTLY** the documented m9 5-failure baseline (a SUBSET of — in fact equal to — the allowed set). **No newly-failing marker.**
- `test_us0126_parity_scope_opencode_adapter` is **GREEN** (present in the 18 passed; it was the newly-failing m9 marker at gatefix #2, now resolved).
- These are OUT-OF-HARNESS standalone failures (the harness runs these scopes and they `[PASS]`); carried forward, **NOT** a regression, **NOT** a QA_FAIL trigger.

### C10 — sibling-composition spot-checks (read-only)
- `.opencode/tui.json` (active) and `template/.opencode/tui.json` both carry `"plugin": []` (BUG-0030/DEC-0151 lock); active==template SHA-256 **C2FAC9D6C3185B05C5FEE6B80F391348E73D2805B28AE70C40D2C73DF767DE90** (byte-identical). ✅
- The 3 gate-lift fixes touched ONLY the 4 documented files (`its_magic/README.md`, `template/its_magic/README.md`, `docs/developer/README.md`, `template/.opencode/agents/dev.md`) — see D.12. The US-0125 thin-dispatch contract files (`tests/us0125_contract_test.py`, `template/tests/us0125_contract_test.py`) and the US-0126 contract file were **NOT** among the gate-lift edits (they were mutated only by the earlier BUG-0033 T-002 line-cap reconciliation, which is part of the original execute, not the 3-attempt gate-lift). ✅

**C-VERDICT: FAIL** (C8 red → B-1; C9 + C10 green/carry-forward).

---

## Battery D — Provenance / integrity audit

### D11 — 3 fresh_context_markers (grep-verified)
Each marker occurs **only** in the evidence docs that reference it (freshness claim plausible):
- `dev-BUG0033-execute-20261009T113327Z-fresh` → `docs/engineering/state.md` (L1154, L1190), `handoffs/dev_to_qa.md` (L88, L136), `sprints/S0168/progress.md` (L13), `sprints/S0168/summary.md` (L8).
- `dev-BUG0033-gatefix2-20261009T184150Z-fresh` → `docs/engineering/state.md` (L1192), `handoffs/dev_to_qa.md` (L44, L82), `sprints/S0168/progress.md` (L202, L224).
- `dev-BUG0033-gatefix3-20261009T213646Z-fresh` → `docs/engineering/state.md` (L1186, L1193), `handoffs/dev_to_qa.md` (L5, L49), `sprints/S0168/progress.md` (L203, L227), `sprints/S0168/summary.md` (L94).
No stray/foreign occurrences. ✅

### D12 — forbidden side-effects (all clear)
- **BUG-0033 status/ACs**: `docs/product/backlog.md` `### BUG-0033` (L5695) `Status: OPEN` (L5698); AC-1..AC-8 (L5705–L5712) all **`- [ ]`** (unchecked). `docs/product/acceptance.md` L224 = `- [ ] BUG-0033` (unchecked). ✅ (BUG-0033 correctly NOT flipped; closure owns the flip per US-0045.)
- **BUG-0034 status/ACs**: `docs/product/backlog.md` `### BUG-0034` (L5717) `Status: DONE` (L5720); AC-1..AC-7 (L5727–L5733) all **`- [x]`**. `docs/product/acceptance.md` L225 = `- [x] BUG-0034`. ✅ (DONE sibling untouched by the gate-lift.)
- **DEC files**: the 3 gate-lift attempts authored **NO** new DEC. The two untracked `decisions/DEC-0153.md` / `decisions/DEC-0154.md` in `git status` are **pre-existing to the gate-lift** (DEC-0154 = BUG-0033 companion from the 2026-10-08 architecture phase; DEC-0153 = S0165/BUG-0035 companion from 2026-10-03), both already indexed in `docs/engineering/decisions.md` and both untracked only because this branch's work is uncommitted. **Not** a gate-lift side-effect. ✅ (observed, not a deviation.)
- **`handoffs/resume_brief.md` top pointer UNCHANGED**: still the `# Resume Brief — BUG-0033 SPRINT_PLAN_PASS continuation pair` (L1; `next_scheduled_phase: execute`, role dev, proof `46283b1c…9e9c17`). The dev has no write-allow on resume_brief and did not mutate it. ✅
- **No publish/push/.env artifacts**: no npm publish, no git push (SYNC_POLICY_MODE=disabled), no `.env` read, no subagent spawn, no `/auto`. This QA context likewise performed none. ✅

**D-VERDICT: PASS.** Provenance chain intact; no forbidden side-effects; BUG-0033 correctly still OPEN/unchecked.

---

## Findings

### B-1 (BLOCKING) — S0168 "harness green Fail=0" exit gate (sprint.md L134) UNMET in the current repo state; the dev's recorded `Pass=879/Fail=0` (2026-10-09T21:44:13Z) is STALE.
- **Defect (precise):** Independent full-harness re-run (this QA context, 2026-10-09T23:02:49Z) = **exit 1, Pass=877/Fail=2**. The 2 FAIL lines are `triad check passes on repo` + `triad check idempotent rerun passes`, both caused by `docs/engineering/state.md` being **1209 lines > the 1200-line triad cap** (`ARTIFACT_HOT_SURFACE_OVERSIZE`, reproduced verbatim by direct `--check`).
- **Mechanism (root cause):** the dev's own **gatefix3 checkpoint append** (`state.md` L1182–L1209, 28 lines) pushed state.md from **1181 → 1209** lines, and this append landed **after** the dev's last green harness run (harness 21:44:13Z, on the 1181-line file; checkpoint proof_issued_at 21:44:30Z). The dev **did not re-run the harness after appending its checkpoint**, so the recorded `Pass=879/Fail=0` no longer describes the repo. The over-cap is a deterministic, reproducible, in-harness red.
- **Scope note:** this is a **gate/hygiene regression, NOT a BUG-0033-fix defect.** The BUG-0033 functional core (AC-1..AC-8, Battery A) and the 3 gate-lift fixes (Battery B) are fully intact and independently green; all 6 previously-failing parity lines and both rfc lines are `[PASS]` in the fresh report. The BUG-0033 section copy is NOT policy-relevantly divergent from the rich source (no self-fulfilling-suite artifact).
- **Why it blocks QA_PASS:** the task verdict rule is "QA_PASS only if ALL of A+B+C+D pass"; C8 (full harness Fail=0) is red on an UNEXPECTED (not documented-baseline) reason. The S0168 exit gate the whole gate-lift chain was authorized to satisfy is therefore **not actually satisfied** in the repo state QA is verifying.

### Non-blocking / carried forward (NOT QA_FAIL triggers)
- **N-1 (carry-forward baseline):** the 5 standalone (non-harness) us0125/us0126 failures — `us0125_command_inventory`, `us0125_clone_guard`, `us0125_missing_command_does_not_disable_plugin`, `us0125_auto_command_dispatch_only`, `us0126_default_host_reminder` — are the documented m9 baseline; out-of-harness; unchanged; `test_us0126_parity_scope_opencode_adapter` is GREEN. (Reproduced exactly in C9.)
- **N-2 (carry-forward observation):** `docs/developer/README.md` ↔ `template/docs/developer/README.md` are structurally divergent (template lacks the active file's BUG-0024/BUG-0030 rows) — pre-existing, in NO rfc/parity pair, already recorded as dev observation #1; out of scope for BUG-0033.
- **N-3 (observation, not a deviation):** the untracked `decisions/DEC-0153.md`/`DEC-0154.md` are pre-existing companion DECs from earlier BUG-0033/S0165 phases (already indexed in `docs/engineering/decisions.md`), NOT authored by the 3 gate-lift attempts.

### Guard audit (this QA context)
Read-only verification only. **No** source/README/script/test edit; **no** backlog/acceptance/AC-tick mutation; **no** status flip (BUG-0033 stays OPEN, AC-1..AC-8 `[ ]`; BUG-0034 stays DONE); **no** DEC authored/amended; **no** state.md mutation beyond the mandated append-only checkpoint (below); **no** `.env` read; **no** subagent spawn; **no** `/auto`; **no** publish; **no** push; **UAT_PROBE_FORBIDDEN** held (no live OpenCode host probe — contract suites + validators only, per R-0159 / BUG-0033 QA design).

---

## Provenance for THIS QA context
- **fresh_context_marker**: `qa-BUG0033-20261009T225321Z-fresh` (grep-verified 0 prior occurrences repo-wide at mint).
- **orchestrator_run_id**: `auto-20261009-bug0033-qa`.
- **runtime_proof_id**: `rp-auto-20261009-bug0033-qa-20261009T225321Z-BUG-0033`.
- **proof_issued_at**: `2026-10-09T22:53:21Z`; **proof_ttl_seconds**: 3600; **proof_ttl_expiry**: `2026-10-09T23:53:21Z`.
- **proof_hash**: `165D4C6C2101A75C8693C0819EEDBE0B222D8F8A044AB59A4997B1F4E28E76C3` (2-invocation recompute MATCH: lib `compute_strict_proof_hash` + independent compact sorted-key `hashlib.sha256` over the verbatim DEC-0038 6-tuple → identical hexdigest).
- **canonical tuple (verbatim)**: `{"orchestrator_run_id":"auto-20261009-bug0033-qa","phase_id":"qa","proof_issued_at":"2026-10-09T22:53:21Z","proof_ttl_seconds":3600,"role":"qa","runtime_proof_id":"rp-auto-20261009-bug0033-qa-20261009T225321Z-BUG-0033"}`.

---

## Verdict line

**QA_FAIL** — reason: the S0168 "harness green Fail=0" exit gate (sprint.md L134) is NOT met in the current repo state (B-1, BLOCKING). Independent full-harness re-run = **exit 1, Pass=877/Fail=2** (report 2026-10-09T23:02:49Z), the 2 FAIL lines being `triad check passes on repo` + `triad check idempotent rerun passes`, both caused by `docs/engineering/state.md` = **1209/1200 lines** (`ARTIFACT_HOT_SURFACE_OVERSIZE`) — introduced by the dev's own gatefix3 checkpoint append **after** its last green harness run (21:44:13Z, 1181-line state.md), with no post-append harness re-run. The BUG-0033 functional core (AC-1..AC-8) and all 3 gate-lift fixes are intact and independently GREEN (Batteries A+B); the 6 parity lines + 2 rfc lines are `[PASS]`. Remediation: see `handoffs/qa_to_dev.md` (dev/orchestrator must restore the harness to Fail=0 — sanctioned non-destructive `--rollover` of `state.md` to ≤1200 lines, then re-run the full harness — and re-spawn `/qa`). **next=execute.**

---
---

# QA Findings — S0168 / BUG-0033 (RE-QA after gatefix4 B-1 remediation)

> **SUPERSEDES the QA_FAIL (B-1) section above (context `qa-BUG0033-20261009T225321Z-fresh`).** That section is retained as history. This is the **2nd QA context** for BUG-0033 / S0168.

- **phase_id**: qa; **role**: qa; **bug_id**: BUG-0033; **sprint_id**: S0168
- **verdict**: **QA_PASS** (12/12 battery; B-1 C8 now GREEN)
- **reason_code**: `BUG0033_QA_PASS` (bug-segment diagnostic label; **no** registry mutation)
- **timestamp**: 2026-10-10T13:45:18Z (UTC; this QA context)
- **fresh_context_marker**: `qa-BUG0033-20261010T130901Z-fresh` (FRESH; grep-verified 0 prior occurrences repo-wide at mint — both the exact marker and the `qa-BUG0033-20261010` prefix returned no matches; RUNTIME_PROOF_REUSED hygiene held)
- **orchestrator_run_id**: `auto-20261010-bug0033-qa2` (2nd QA context; distinct from the prior `auto-20261009-bug0033-qa`)
- **runtime_proof_id**: `rp-auto-20261010-bug0033-qa2-qa-20261010T130901Z-BUG-0033`
- **proof_issued_at**: `2026-10-10T13:09:01Z`; **proof_ttl_seconds**: 3600; **proof_ttl_expiry**: `2026-10-10T14:09:01Z`
- **proof_hash**: `71DBDB7D7AD60EA825D674203352AAE8DF17EA5E8AB14100A7A61D878E06F914`
  - 2-invocation recompute MATCH (library `scripts/token_cost_lib.compute_strict_proof_hash` == independent `SHA-256(json.dumps(tuple, sort_keys=True, separators=(",",":")))`) → `hash_recompute_confirmation=true`.
- **canonical tuple (verbatim)**:
  `{"orchestrator_run_id":"auto-20261010-bug0033-qa2","phase_id":"qa","proof_issued_at":"2026-10-10T13:09:01Z","proof_ttl_seconds":3600,"role":"qa","runtime_proof_id":"rp-auto-20261010-bug0033-qa2-qa-20261010T130901Z-BUG-0033"}`
- **consumed execute proof (provenance, NOT trusted for verdict)**: `rp-auto-20261010-bug0033-gatefix4-dev-20261010T121507Z-BUG-0033` / `3384831D55BC9F3F6609FA4BB2302C54FBB9FCCF7BCBB6A3274B6B0DAE1C5711` (dev gatefix4 EXECUTE_PASS). **TTL note (honesty):** issued 2026-10-10T12:15:07Z + 3600s = expiry **2026-10-10T13:15:07Z**, which is **in-TTL** at this QA issue time 2026-10-10T13:09:01Z (≈6 min before expiry). Recomputed 2-invocation (lib `compute_strict_proof_hash` == independent compact sorted-key `hashlib.sha256` == the recorded `3384831D…1C5711`) → **MATCH**. Consumed as an **integrity-verified provenance link only**; **all** functional + harness evidence was **independently re-run in THIS fresh QA context** (no stale-proof waiver, no reuse of the dev's or the prior QA's proof as a credential). The QA verdict below rests entirely on THIS context's independent re-runs.

---

## Verdict

### QA_PASS — the S0168 "harness green Fail=0" exit gate (sprint.md L134) IS now met in the current repo state. B-1 (C8) remediated and independently re-verified green.

Independent re-run of the full harness `powershell -ExecutionPolicy Bypass -File tests/run-tests.ps1`
(start **2026-10-10T13:27:45Z**, end **2026-10-10T13:35:21Z**, elapsed 455.8s) → **exit 0**, fresh
`tests/report.md` **Timestamp 2026-10-10T13:35:21Z, Pass=879 / Fail=0** (newer than my run start ✅).
**Both triad lines are `[PASS]`**: `- [PASS] triad check passes on repo` (report L725) and
`- [PASS] triad check idempotent rerun passes` (report L726). **0 `[FAIL]` lines repo-wide in the
regenerated report.** Direct read-only reproduction of the previously-failing gate
(`python scripts/enforce-triad-hot-surface.py --repo . --check`) → **exit 0** (state.md =
**1180 lines** / 30 checkpoints, in-cap — the prior `ARTIFACT_HOT_SURFACE_OVERSIZE` 1209/1200
condition is cleared). The BUG-0033 functional core (AC-1..AC-8) and all 3 gate-lift fixes are
independently GREEN (Batteries A+B); the gatefix4 remediation changed only the triad hot-surface
(append + sanctioned rollover) and the fresh harness evidence. Per the task verdict rule
("QA_PASS only if ALL of A+B+C+D pass"), **all 12 battery checks PASS → QA_PASS.**

**C8 delta vs the prior QA (why it now passes):** prior QA run 877 Pass + 2 Fail = 879 total
(report 2026-10-09T23:02:49Z), the 2 triad lines flipped PASS→FAIL because state.md crossed the
1200-line cap after the gatefix3 checkpoint append. This run 879 Pass + 0 Fail = **879 total**
(report 2026-10-10T13:35:21Z): exactly the 2 triad lines restored PASS→PASS, every other
assertion unchanged and green. The gatefix4 child restored the in-cap state (1180 lines) and
re-ran the harness post-remediation, so the recorded green now **describes the current repo**.

---

## Battery result table (12 checks)

| # | Section | Command | Expected | Actual (this re-QA context) | P/F |
|---|---|---|---|---|---|
| A1 | BUG-0033 core | `python -m pytest tests/bug0033_opencode_command_parity_test.py -q` | 10/10 | **10 passed in 1.10s** (exit 0) | **PASS** |
| A2 | BUG-0033 core | `python scripts/check_intake_template_parity.py --repo . --scope=bug-0033` | exit 0 + banner | **exit 0** + `[INTAKE_TEMPLATE_PARITY_OK] scope=bug-0033` | **PASS** |
| A3 | BUG-0033 core | Spot-check 5 thin-surface files for policy invariants | Stop→Fail-safe order; diagnostics-only; STOP sentinel; no dispatch fragments | confirmed (see A3 note below) | **PASS** |
| B4 | Gate-lift | `python scripts/validate_readme_feature_coverage.py --repo . --report` (×2) | exit 0, `coverage_missing=[]`, `status=PASS`; byte-identical | **exit 0** ×2; `coverage_missing=[]`; `status=PASS`; `coverage_total=43`; BUG-0034 in `coverage_present`; 2 runs byte-identical | **PASS** |
| B5 | Gate-lift | `python scripts/check_intake_template_parity.py --repo . --scope=readme-feature-coverage` | exit 0 + banner | **exit 0** + `[INTAKE_TEMPLATE_PARITY_OK] scope=readme-feature-coverage` | **PASS** |
| B6 | Gate-lift | `--scope=opencode-adapter` + agent-map twin hash | exit 0 + banner; twins byte-identical | **exit 0** + banner; `.opencode/agents/dev.md` == `template/…` SHA-256 **4B8B1589…E23** both | **PASS** |
| B7 | Gate-lift | Read BUG-0034 rows in place (its_magic L447; docs/developer L40-41) | text/format per dev_to_qa | confirmed (see B7); its_magic twin SHA-256 **E46DFE04…68F4** both | **PASS** |
| C8 | Harness | `powershell -ExecutionPolicy Bypass -File tests/run-tests.ps1` + `enforce-triad-hot-surface.py --check` | **Pass=879 / Fail=0**, 2 triad lines `[PASS]`, `--check` exit 0 | **exit 0** (start 13:27:45Z end 13:35:21Z); fresh report **2026-10-10T13:35:21Z Pass=879 / Fail=0**; triad L725/L726 both `[PASS]`; 0 `[FAIL]` repo-wide; `--check` **exit 0** (state.md 1180 lines in-cap) | **PASS** ← previously FAIL (B-1) |
| C9 | Regression | `python -m pytest tests/us0125_contract_test.py tests/us0126_contract_test.py -q --tb=no` | failing set ⊆ 5 documented baseline; `test_us0126_parity_scope_opencode_adapter` GREEN | **5 failed, 18 passed**; failing set = **exactly** the 5 baseline markers; `test_us0126_parity_scope_opencode_adapter` **GREEN** | **PASS** (carry-forward) |
| C10 | Regression | `tui.json` `"plugin": []` (active+template) + gatefix4 touched only documented surfaces | `"plugin": []` both; scope limited | `tui.json` active==template SHA-256 **C2FAC9D6…7DE90** (identical), `"plugin": []` both; sanctioned rollover target `state-archive/state-pack-20261010.md` (4988 b) present; BUG-0033 slice + 3 gate-lift fixes independently re-verified intact in A+B (not re-fixed) | **PASS** |
| D11 | Provenance | Grep the gatefix4 marker + runtime_proof_id | each occurs only in its legitimate evidence docs | all 5 occurrences of the marker + all 5 of the proof_id are in state.md / dev_to_qa.md / S0168 progress / S0168 summary only; **no stray/replayed** occurrences | **PASS** |
| D12 | Integrity | BUG-0033 OPEN + AC-1..AC-8 `[ ]`; acceptance L224 `[ ]`; BUG-0034 DONE + ACs `[x]`; no gate-lift DEC; no publish/push/.env/subagent/`/auto` in gatefix4 status_guard | all hold | all hold (see D.12) | **PASS** |

**Summary: 12 PASS / 0 FAIL. The single previously-blocking check (C8 / B-1) is now GREEN.**

---

## Battery A — BUG-0033 functional core (AC-1..AC-8): GREEN (intact, NOT re-fixed)

### A1 — parity suite
```
$ python -m pytest tests/bug0033_opencode_command_parity_test.py -q
..........                                                               [100%]
10 passed in 1.10s        (exit 0)
```
10/10. All 10 `test_bug0033_*` markers (m1–m10) green, incl. m8 (dispatch-only + frontmatter), m9 (us0125/us0126 no-regression + `tui.json` `"plugin": []` lock) and m10 (zero-new-reason-codes).

### A2 — parity CLI scope
```
$ python scripts/check_intake_template_parity.py --repo . --scope=bug-0033
[INTAKE_TEMPLATE_PARITY_OK] scope=bug-0033        (exit 0)
```
6 pairs byte-identical active==template (5 commands + test twin).

### A3 — manual spot-check (5 thin-surface files, guard against a self-fulfilling suite)
Read the 5 BUG-0033 thin command bodies in `.opencode/commands/` directly (the thin OpenCode surface; `.cursor/commands/*` is the rich source). All 5 satisfy **`## Stop conditions` BEFORE `## Fail-safe reason codes`** and are **diagnostics-only** (no dispatch/validator/policy logic; enforcement in the Python validator bridge), with **no forbidden dispatch fragments**:
- **closure.md** (29 lines): `## Stop conditions` L19 → `## Fail-safe reason codes` L25 (Stop FIRST); fail-safe body = pointer to the rich `.cursor/commands/closure.md` table; **`STOP` sentinel final (L29)**; frontmatter `agent: qa` preserved. ✅
- **ask.md** (19 lines): `## Stop conditions` L12 → `## Fail-safe reason codes` L16; "None" (read-only, no fail-closed vocabulary); **`STOP` sentinel final (L19)**; agent-agnostic (no `agent:`). ✅
- **auto.md** (61 lines): `## Stop conditions` L51 → `## Fail-safe reason codes` L56; diagnostics-only resume-resolution envelope tokens + pointer to the rich `auto.md`; **NO terminal `STOP` sentinel — see note below** (deliberate, matches the rich source; NOT a regression). ✅
- **refresh-context.md** (27 lines): `## Stop conditions` L18 → `## Fail-safe reason codes` L22; diagnostics-only artifact-ordering tokens + pointer; **`STOP` sentinel final (L27)**; frontmatter `agent: curator` preserved. ✅
- **execute.md** (34 lines): `## Stop conditions` L24 → `## Fail-safe reason codes` L29; diagnostics-only execute tokens + pointer; **`STOP` sentinel final (L34)**; frontmatter `agent: dev` preserved. ✅

**A3 note (honesty, not a regression):** the task bullet lists "a final `STOP` sentinel" as one of the invariants to spot-check. A repo-wide grep of `^STOP$` across `.opencode/commands/` confirms the **4 phase-role** commands (closure L29, ask L19, refresh-context L27, execute L34) each end with a terminal `STOP`. **`auto.md` does not** — but I verified the **rich source `.cursor/commands/auto.md` (711 lines) also does not end in `STOP`**. `auto.md` is the **orchestrator** command (US-0156 / DEC-0152 sequential drain-advance design: "The orchestrator does not stop after spawning one phase"); a terminal `STOP` sentinel would be semantically wrong for it, and its absence mirrors the rich source. The DQ4 test contract (sprint.md L141–149; markers m1–m10) asserts **both-headings + Stop-before-Fail-safe ordering, active↔template byte-parity, dispatch-only, no-regression, zero-new-codes** — it does **not** assert a per-file `STOP` sentinel. The prior QA's A3 (closure + execute) was green on the same ground. The gatefix4 dev child **did not touch any command file** (documented scope: triad hot-surface + harness evidence only), so the section copy is unchanged and **NOT** policy-relevantly divergent (no self-fulfilling-suite artifact). **A3 = PASS** with this observation carried as non-blocking.

**A-VERDICT: PASS.** AC-1..AC-8 functionally green; the BUG-0033 slice is intact and was NOT re-fixed by gatefix4.

---

## Battery B — Gate-lift surfaces (BUG-0034 rows + agent-map parity): GREEN (intact, NOT re-fixed)

### B4 — rfc feature-coverage validator (run twice)
```
$ python scripts/validate_readme_feature_coverage.py --repo . --report   # run 1
$ python scripts/validate_readme_feature_coverage.py --repo . --report   # run 2
```
- Both **exit 0**. Report (identical both runs):
  `{"coverage_missing":[],"coverage_present":[…,"BUG-0034",…],"coverage_total":43,"gaps":[],"status":"PASS"}`
- **`coverage_missing=[]`**, **`status=PASS`**, **BUG-0034 in `coverage_present`** → the gate-lift rows are intact. Two-run byte-identical confirms idempotency.

### B5 — parity scope readme-feature-coverage
```
$ python scripts/check_intake_template_parity.py --repo . --scope=readme-feature-coverage
[INTAKE_TEMPLATE_PARITY_OK] scope=readme-feature-coverage        (exit 0)
```

### B6 — parity scope opencode-adapter + agent-map twin hash
```
$ python scripts/check_intake_template_parity.py --repo . --scope=opencode-adapter
[INTAKE_TEMPLATE_PARITY_OK] scope=opencode-adapter        (exit 0)
$ (Get-FileHash .opencode\agents\dev.md).Hash ; (Get-FileHash template\.opencode\agents\dev.md).Hash
4B8B1589CE33B09C2B90AE76425484F0963FDEFBA26E8A63B0C99F0765772E23
4B8B1589CE33B09C2B90AE76425484F0963FDEFBA26E8A63B0C99F0765772E23   (byte-identical)
```
- Active `.opencode/agents/dev.md` and template mirror **byte-identical** (SHA-256 `4B8B1589…E23` both) — the gate-lift agent-map parity line is intact.
- Also re-verified the its_magic twin: `its_magic/README.md` == `template/its_magic/README.md` SHA-256 **E46DFE04…68F4** both (byte-identical).

### B7 — BUG-0034 rows in place (read in situ)
- `its_magic/README.md` **L447**: `- **BUG-0034** — PO closure precondition conflict registered in the autonomy stop matrix with `disambiguate_state` repair (cap 3); never auto-refreshes the brief.` (immediately after the `**BUG-0032**` row L446; template twin identical). ✅
- `docs/developer/README.md` **L40-41**: `- **BUG-0034** — PO closure precondition conflict registered in the autonomy stop matrix (`PO_CLOSURE_PRECONDITION_CONFLICT`, `disambiguate_state`, cap 3); traceability:` / `  runbook `## PO_CLOSURE_PRECONDITION_CONFLICT`, architecture `# BUG-0034`.` (after the `**BUG-0030**` row L39). ✅
Text/format match `handoffs/dev_to_qa.md`; sit in the validator-expected sections.

**B-VERDICT: PASS.** All 3 gate-lift fixes (2 BUG-0034 row pairs + 1 agent-map parity line) are intact and independently green; NOT re-fixed by gatefix4.

---

## Battery C — Full harness + regressions

### C8 — FULL HARNESS: **PASS** (previously FAIL / B-1 — now GREEN)
```
$ powershell -ExecutionPolicy Bypass -File tests/run-tests.ps1
HARNESS_START_UTC=2026-10-10T13:27:45Z
HARNESS_EXIT=0
HARNESS_END_UTC=2026-10-10T13:35:21Z
HARNESS_ELAPSED_SEC=455.8

$ tests\report.md (header)
# its-magic Test Report
Timestamp: 2026-10-10T13:35:21Z
Pass: 879
Fail: 0
```
- Report timestamp (13:35:21Z) **IS newer than** my run start (13:27:45Z) ✅.
- **Fail: 0**, exit 0. Both triad lines `[PASS]` (verbatim from the fresh report):
  - L725 `- [PASS] triad check passes on repo`
  - L726 `- [PASS] triad check idempotent rerun passes`
- **0 `[FAIL]` lines repo-wide in the regenerated report** (report = 879 `[PASS]` / 0 `[FAIL]`).
- Direct read-only reproduction of the previously-failing gate:
  `python scripts/enforce-triad-hot-surface.py --repo . --check` → **exit 0** (state.md = **1180 lines** / 30 checkpoints, in-cap). The prior `STATE_ARCHIVE_REQUIRED … lines=1209/1200 … ARTIFACT_HOT_SURFACE_OVERSIZE` condition is **cleared**.
- The BUG-0033 slice + the 3 gate-lift fixes are all `[PASS]` in the fresh report:
  ```
  - [PASS] validate_readme_feature_coverage repo --report passes
  - [PASS] validate_readme_feature_coverage report idempotent
  - [PASS] check_intake_template_parity --scope=bug-0033 passes (BUG-0033)   (report L886)
  - [PASS] BUG-0033 10-marker command parity suite (tests/bug0033_opencode_command_parity_test.py)  (report L887)
  ```
- Arithmetic: prior QA 877 Pass + 2 Fail = **879 total**; this run **879 Pass + 0 Fail = 879 total** (same assertion count). Exactly the 2 triad lines flipped FAIL→PASS — because the gatefix4 child restored the in-cap state (1180 lines) and re-ran the harness post-remediation. **B-1 remediated and independently re-verified. C8 = PASS.**

### C9 — us0125/us0126 standalone baseline (carry-forward)
```
$ python -m pytest tests/us0125_contract_test.py tests/us0126_contract_test.py -q --tb=no
FF....FF..........F....                                                  [100%]
FAILED tests/us0125_contract_test.py::test_us0125_command_inventory
FAILED tests/us0125_contract_test.py::test_us0125_clone_guard
FAILED tests/us0125_contract_test.py::test_us0125_missing_command_does_not_disable_plugin
FAILED tests/us0125_contract_test.py::test_us0125_auto_command_dispatch_only
FAILED tests/us0126_contract_test.py::test_us0126_default_host_reminder
5 failed, 18 passed in 0.61s        (exit 1)
```
- Failing set = **EXACTLY** the documented m9 5-failure baseline (a SUBSET of — in fact equal to — the allowed set). **No newly-failing marker.**
- `test_us0126_parity_scope_opencode_adapter` is **GREEN** (present in the 18 passed).
- OUT-OF-HARNESS standalone failures (the harness runs these scopes and they `[PASS]`); carried forward, **NOT** a regression, **NOT** a QA_FAIL trigger (not a Fail count in the report).

### C10 — sibling-composition spot-checks (read-only)
- `.opencode/tui.json` (active) and `template/.opencode/tui.json` both carry `"plugin": []` (BUG-0030/DEC-0151 lock); active==template SHA-256 **C2FAC9D6C3185B05C5FEE6B80F391348E73D2805B28AE70C40D2C73DF767DE90** (byte-identical). ✅
- gatefix4 scope (documented at state.md L1174/L1176 + L1173): this turn changed **only** the triad hot-surface (append + sanctioned non-destructive `--rollover` archiving the single oldest terminal checkpoint to `state-archive/state-pack-20261010.md`, 4988 b) and the fresh harness evidence — **NOT** production code, scripts, tests, README, `.cursor/commands/*`, agent maps, or any DEC/registry. The BUG-0033 slice (Battery A) and the 3 gate-lift fixes (Battery B) are independently re-verified intact and **not re-fixed** this turn. (Note: `git status` reflects the branch-wide uncommitted snapshot — the documented workflow, cf. prior QA N-3 — so it does not isolate a single turn; the scope confirmation above rests on the gatefix4 checkpoint's documented surface + this QA's independent A/B re-verification.) ✅

**C-VERDICT: PASS** (C8 now GREEN; C9 + C10 green/carry-forward).

---

## Battery D — Provenance / integrity audit

### D11 — gatefix4 marker + runtime_proof_id (grep-verified)
Each occurs **only** in its legitimate evidence docs (no stray/replayed occurrences):
- `dev-BUG0033-gatefix4-20261010T121507Z-fresh` → `docs/engineering/state.md` (L1169), `handoffs/dev_to_qa.md` (L6, L18), `sprints/S0168/progress.md` (L254), `sprints/S0168/summary.md` (L107). (5 occurrences.)
- `rp-auto-20261010-bug0033-gatefix4-dev-20261010T121507Z-BUG-0033` → `docs/engineering/state.md` (L1170, L1171), `handoffs/dev_to_qa.md` (L18), `sprints/S0168/progress.md` (L256), `sprints/S0168/summary.md` (L107). (5 occurrences.)
- gatefix4 execute proof hash **`3384831D55BC9F3F6609FA4BB2302C54FBB9FCCF7BCBB6A3274B6B0DAE1C5711`** recomputed 2-invocation (lib `compute_strict_proof_hash` == independent compact sorted-key `hashlib.sha256` over the verbatim DEC-0038 6-tuple) → **MATCH** (== recorded). ✅

### D12 — status guard (all clear)
- **BUG-0033 status/ACs**: `docs/product/backlog.md` `### BUG-0033` (L5695) `Status: OPEN` (L5698); AC-1..AC-8 (L5705–L5712) all **`- [ ]`** (unchecked). `docs/product/acceptance.md` L224 = `- [ ] BUG-0033` (unchecked). ✅ (BUG-0033 correctly NOT flipped; closure owns the flip per US-0045.)
- **BUG-0034 status/ACs**: `docs/product/backlog.md` `### BUG-0034` (L5717) `Status: DONE` (L5720); AC-1..AC-7 (L5727–L5733) all **`- [x]`**. `docs/product/acceptance.md` L225 = `- [x] BUG-0034`. ✅ (DONE sibling untouched.)
- **DEC files**: the gate-lift + gatefix4 authored **NO** new/amended DEC. The two untracked `decisions/DEC-0153.md` / `decisions/DEC-0154.md` are **pre-existing** companion DECs (already indexed in `docs/engineering/decisions.md`), NOT a gatefix4 side-effect. ✅
- **gatefix4 status_guard** (state.md L1178) contains **no** publish / push / `.env` / subagent / `/auto` (verbatim: "no .env read; no subagent spawn; no /auto recursion; no publish; no push (SYNC_POLICY_MODE=disabled)"). ✅
- **This QA context** likewise performed none: no publish/push/`.env`/subagent/`/auto`; `UAT_PROBE_FORBIDDEN` held (no live OpenCode host probe — contract suites + validators only). ✅

**D-VERDICT: PASS.** Provenance chain intact; no forbidden side-effects; BUG-0033 correctly still OPEN/unchecked.

---

## Findings

### B-1 (now REMEDIATED — was BLOCKING in the prior QA context)
- **Was:** full harness red (Pass=877/Fail=2) because state.md exceeded the 1200-line triad cap (1209) after the gatefix3 checkpoint append, with no post-append re-run.
- **Now:** independently re-verified GREEN in THIS context — full harness exit 0, fresh report **2026-10-10T13:35:21Z Pass=879/Fail=0**, both triad lines `[PASS]`, `--check` exit 0 (state.md 1180 lines in-cap). The gatefix4 child performed the sanctioned non-destructive remediation (triad hot-surface restore via rollover + fresh full-harness re-run). **No longer a QA_FAIL trigger.**

### Non-blocking / carried forward (NOT QA_FAIL triggers)
- **N-1 (carry-forward baseline):** the 5 standalone (non-harness) us0125/us0126 failures — `us0125_command_inventory`, `us0125_clone_guard`, `us0125_missing_command_does_not_disable_plugin`, `us0125_auto_command_dispatch_only`, `us0126_default_host_reminder` — are the documented m9 baseline; out-of-harness; unchanged; `test_us0126_parity_scope_opencode_adapter` is GREEN. (Reproduced exactly in C9.)
- **N-2 (carry-forward observation):** `docs/developer/README.md` ↔ `template/docs/developer/README.md` structurally divergent (template lacks the active file's BUG-0024/BUG-0030 rows) — pre-existing, in NO rfc/parity pair; candidate future-slice follow-up.
- **N-3 (observation, not a deviation):** `auto.md` (the orchestrator command) carries no terminal `STOP` sentinel — matches its rich source and the DQ4 contract; the 4 phase-role commands do. (See A3 note.) Not a BUG-0033 defect.

### Guard audit (this re-QA context)
Read-only verification only. **No** source/README/script/test edit; **no** backlog/acceptance/AC-tick mutation; **no** status flip (BUG-0033 stays OPEN, AC-1..AC-8 `[ ]`; BUG-0034 stays DONE); **no** DEC authored/amended; **no** state.md mutation beyond the mandated append-only checkpoint (kept in-cap: 1180 → 1193 lines, `--check` exit 0 re-confirmed post-append); **no** `.env` read; **no** subagent spawn; **no** `/auto`; **no** publish; **no** push; **UAT_PROBE_FORBIDDEN** held.

---

## Provenance for THIS re-QA context
- **fresh_context_marker**: `qa-BUG0033-20261010T130901Z-fresh` (grep-verified 0 prior occurrences repo-wide at mint).
- **orchestrator_run_id**: `auto-20261010-bug0033-qa2` (2nd QA context for BUG-0033/S0168).
- **runtime_proof_id**: `rp-auto-20261010-bug0033-qa2-qa-20261010T130901Z-BUG-0033`.
- **proof_issued_at**: `2026-10-10T13:09:01Z`; **proof_ttl_seconds**: 3600; **proof_ttl_expiry**: `2026-10-10T14:09:01Z`.
- **proof_hash**: `71DBDB7D7AD60EA825D674203352AAE8DF17EA5E8AB14100A7A61D878E06F914` (2-invocation recompute MATCH).
- **canonical tuple (verbatim)**: `{"orchestrator_run_id":"auto-20261010-bug0033-qa2","phase_id":"qa","proof_issued_at":"2026-10-10T13:09:01Z","proof_ttl_seconds":3600,"role":"qa","runtime_proof_id":"rp-auto-20261010-bug0033-qa2-qa-20261010T130901Z-BUG-0033"}`.
- **consumed_execute_proof**: `rp-auto-20261010-bug0033-gatefix4-dev-20261010T121507Z-BUG-0033` / `3384831D55BC9F3F6609FA4BB2302C54FBB9FCCF7BCBB6A3274B6B0DAE1C5711` (integrity-verified provenance; recompute MATCH; in-TTL at issue time).
- **model_id**: `qwen3.8-27b` (CROSS_MODEL_REVIEW=0; sovereign-critic NOT consumed).

---

## Verdict line

**QA_PASS** — reason: the S0168 "harness green Fail=0" exit gate (sprint.md L134) IS met in the current repo state. Independent full-harness re-run = **exit 0, Pass=879/Fail=0** (report 2026-10-10T13:35:21Z); both triad lines `[PASS]`; `enforce-triad-hot-surface.py --check` = **exit 0** (state.md 1180 lines in-cap); 0 `[FAIL]` repo-wide in the report. The prior BLOCKING B-1 (C8) is remediated and independently re-verified green. All 12 battery checks PASS (A 3/3, B 4/4, C 3/3, D 2/2). BUG-0033 remains **OPEN** (AC-1..AC-8 unchecked — closure owns the flip per US-0045); BUG-0034 stays DONE. **next=verify-work** (fresh orchestrator-owned `/verify-work` context; this qa child does NOT spawn it — spawn-only isolation).

---

## [RE-QA qa3] README feature-coverage row while OPEN — QA_PASS 8/8

- **phase_id**: qa; **role**: qa; **bug_id**: BUG-0033; **sprint_id**: S0168
- **verdict**: **QA_PASS**
- **reason_code**: `BUG0033_QA_PASS`
- **timestamp**: 2026-10-10T19:39:01Z (UTC; this QA context)
- **fresh_context_marker**: `qa-BUG0033-20261010T193901Z-fresh` (FRESH; grep-verified 0 prior occurrences repo-wide at mint)
- **orchestrator_run_id**: `auto-20261010-bug0033-qa3`
- **runtime_proof_id**: `rp-auto-20261010-bug0033-qa3-qa-20261010T193901Z-BUG-0033`
- **proof_issued_at**: `2026-10-10T19:39:01Z`; **proof_ttl_seconds**: 3600; **proof_ttl_expiry**: `2026-10-10T20:39:01Z`
- **proof_hash**: `04bc48adfe89b12944b375b6531bce0bad5dab4cb75d8fba8a4653691a4cdd36`
  - 2-invocation recompute MATCH (`scripts.token_cost_lib.compute_strict_proof_hash` == independent `hashlib.sha256` of compact sorted-key JSON).
- **canonical tuple (verbatim)**: `{"orchestrator_run_id":"auto-20261010-bug0033-qa3","phase_id":"qa","proof_issued_at":"2026-10-10T19:39:01Z","proof_ttl_seconds":3600,"role":"qa","runtime_proof_id":"rp-auto-20261010-bug0033-qa3-qa-20261010T193901Z-BUG-0033"}`
- **under test**: US-0091 README feature-coverage row shipped while BUG-0033 stays OPEN. Root bullet `**BUG-0033**` in `its_magic/README.md` and byte-identical `template/its_magic/README.md` under `## Commands and workflow`. Dev bullet under `docs/developer/README.md` `## Quality gates`.
- **consumed execute proof (provenance, not trusted for the verdict)**: `rp-auto-20261010-bug0033-readme-row-dev-20261010T184550Z-BUG-0033` / `427cb02ce8a446c30923fca1f9ab1848fbcf8f2271d18c3a44b542324348259d`. Recompute MATCH. Issued 2026-10-10T18:45:50Z, TTL expiry 2026-10-10T19:45:50Z, **IN-TTL at this QA issue** (19:39:01Z). Marker `dev-BUG0033-readme-row-20261010T184550Z-fresh`.
- **consumed pair proof (provenance)**: record_key `auto-20261010-bug0033-execute-pair|bug|BUG-0033|execute|rp-auto-20261010-bug0033-execute-pair-curator-20261010T192730Z-BUG-0033`; proof `401103e76dad8401c2ad7bb27d47d79674c388fb4b32e3114fa3384626ba28b8`; issued 2026-10-10T19:27:30Z; TTL expiry 2026-10-10T20:27:30Z; **IN-TTL**. Recompute MATCH. `next_scheduled_phase=qa`, `stop_reason=execute_complete_phase_boundary`.
- **scope of this re-run**: contract tests and file checks only. No live OpenCode CLI/TUI claim. BUG-0033 status was not flipped. Acceptance boxes were not ticked. README, production code, tests, and `handoffs/resume_brief.md` were not edited.

### Battery (8/8 PASS)

| # | Check | Result |
|---|---|---|
| 1 | `python -m pytest tests/bug0033_opencode_command_parity_test.py -q` and the template twin | **10 passed** and **10 passed** (exit 0 each) |
| 2 | `python scripts/check_intake_template_parity.py --repo . --scope=bug-0033` | exit 0, `[INTAKE_TEMPLATE_PARITY_OK] scope=bug-0033` |
| 3 | `## Stop conditions` before `## Fail-safe reason codes` on closure, ask, auto, refresh-context, execute (active and template) | order holds on all 10 files. `auto.md` has no terminal `STOP` sentinel (by design) in both trees. The other four end with `STOP`. |
| 4 | `readme_feature_coverage_lib` parse BUG-0033, `resolve_affinity`, matchers, in-memory DONE class | affinity `release_gate`; root_h2=`Commands and workflow`; dev_h2=`Quality gates`; `has_root_coverage=True`; `has_dev_coverage=True`; in-memory Status=DONE is `in_scope=True`, `predicate_source=explicit:true`. Backlog file left OPEN. Dev Workflow section does not contain BUG-0033. |
| 5 | `python scripts/validate_readme_feature_coverage.py --repo . --report` | exit 0; `coverage_missing=[]`; `status=PASS`; `coverage_total=43`. BUG-0033 is absent from `coverage_present` while OPEN. |
| 6 | SHA-256 `its_magic/README.md` vs `template/its_magic/README.md` | both `03f5589ef80a25e60719adcda52fc4cc00bc7a2d57c9281e180dc520a08a482e` |
| 7 | `python scripts/bug_issue_validate.py --backlog docs/product/backlog.md --check-acceptance` | exit 0, `[BUG_VALIDATION_OK]`. Backlog `Status: OPEN`. AC-1..AC-8 remain `[ ]`. Acceptance L224 remains `[ ]`. |
| 8 | Full harness plus triad | Post-append `tests/run-tests.ps1` exit 0. `tests/report.md` Timestamp **2026-10-10T19:48:23Z**, **Pass=879**, **Fail=0**. `enforce-triad-hot-surface.py --check` exit 0. `docs/engineering/state.md` **1147** lines (under the 1200 cap; no rollover). |

The pre-append harness (Timestamp 2026-10-10T19:37:47Z, Pass=879, Fail=0) is not the cited gate evidence. The cited report postdates the QA checkpoint append. The harness line in `state.md` was filled in place; the line count stayed 1147.

### Verdict line (qa3)

**QA_PASS** — 8/8. `stop_reason=qa_complete_phase_boundary`. `reason_code=BUG0033_QA_PASS`. `next_scheduled_phase=verify-work`. BUG-0033 remains **OPEN**. This qa child does not spawn `/verify-work`.
