# Sprint S0167 — BUG-0034 / QA findings

## REPAIR #1 QA record (fresh /qa, repair cycle #1)

**Verdict:** **QA_PASS** — `S0167_REPAIR_VERIFY_OK`; **0 blocking findings**.

> **History note:** This is the fresh REPAIR #1 QA record. The prior-cycle QA record
> below (run `auto-20261006-bug0034-qa`, verdict `QA_PASS` / `S0167_UNBLOCK_OK`,
> timestamp 2026-10-06T23:50:16Z, marker `qa-BUG0034-qa-20261006T235016Z-fresh`,
> proof `F67FD2461747028123247ECB38CD58A2DFED634E04BB7B30176EBDFB55A4D27A`) is
> **preserved below as history**. The prior release was RELEASE_BLOCKED at Gate 1
> (Pass 865 / Fail 12); that failure has since been repaired and this record re-verifies
> independently. No prior proof (execute `29132484...`, QA `F67FD246...`, verify-work
> `5957755B...`) is reused.

- **Phase / role:** `qa` / `qa` (fresh, independent of execute)
- **Timestamp:** 2026-10-07T20:56:53Z
- **Fresh marker:** `qa-BUG0034-qa-20261007T205653Z-fresh` (grep-confirmed zero prior occurrences repo-wide before mint)
- **QA proof tuple (fresh):**
  - orchestrator_run_id=`auto-20261007-bug0034-qa`
  - phase_id=`qa`; role=`qa`
  - runtime_proof_id=`rp-auto-20261007-bug0034-qa-20261007T205653Z-BUG-0034`
  - proof_hash=`1CF2E37AB8968FC2774C9599DC3D3942664D7450B83F7FEBB55C13E96472DD57`
  - proof_issued_at=`2026-10-07T20:56:53Z`; proof_ttl_seconds=3600 (TTL expiry 2026-10-07T21:56:53Z)
  - canonical payload: `{"orchestrator_run_id":"auto-20261007-bug0034-qa","phase_id":"qa","proof_issued_at":"2026-10-07T20:56:53Z","proof_ttl_seconds":3600,"role":"qa","runtime_proof_id":"rp-auto-20261007-bug0034-qa-20261007T205653Z-BUG-0034"}`
  - strict-proof recompute: `scripts/token_cost_lib.compute_strict_proof_hash` and independent `hashlib.sha256(json.dumps(..., sort_keys=True, separators=(",",":")))` both returned `1CF2E37AB8968FC2774C9599DC3D3942664D7450B83F7FEBB55C13E96472DD57` (identical hexdigest).
- **Consumed execute proof:** `rp-auto-20261007-bug0034-execute-dev-20261007T205320Z-BUG-0034` / `2CF5C9D652BAF50D3AFDF354F84222221A6C42701C9A4FE0BC356CF1DAD7785D`; independently recomputed by both methods → **MATCH** (identical hexdigest). **within-ttl=true** at this QA issue time (2026-10-07T20:56:53Z < TTL expiry 2026-10-07T21:53:20Z).

### Independent re-verification (freshly re-run, not trusted from the execute record)

| Check | Exact result |
|---|---|
| BUG-0034 eight-marker suite | `python -m pytest tests/bug0034_autonomy_stop_matrix_test.py -q` → **8 passed in 0.40s**, exit 0 |
| Auto-command contract | `python -m pytest tests/auto_command_contract_test.py -q` → **151 passed, 694 subtests passed in 1.23s**, exit 0 |
| US-0133 / US-0143 contract | `python -m pytest tests/us0133_contract_test.py tests/us0143_contract_test.py -q` → **17 passed in 0.80s**, exit 0 |
| Downstream CI guard | `python scripts/check_downstream_ci_guard.py --report` → **ok=true** (forbidden_hits=[], violations=[]) |
| README feature coverage | `python scripts/validate_readme_feature_coverage.py --report` → **status=PASS** (coverage_total=42, coverage_missing=[], gaps=[]) |
| Full harness report header | `tests/report.md` → Timestamp **2026-10-07T20:51:30Z**, **Pass: 877**, **Fail: 0** |

### Active/template SHA-256 parity (independent `Get-FileHash -Algorithm SHA256`)

| Pair | SHA-256 (both sides) | Result |
|---|---|---|
| `docs/engineering/reason_codes.md` | `04A88D32B4C67D6F43911AE05B3A456DC72C8A21152E0C767E91371DDC1CC0DD` | MATCH |
| `docs/engineering/runbook.md` | `A2F31FF568DAC32343ED5E4CFD1141AB982436C82B56B4118CA36C14D10D4C1F` | MATCH |
| `tests/bug0034_autonomy_stop_matrix_test.py` | `B987E9C5B5C15BA3DF8567AAB5E48E280D84A580B8A2E5C8CB48FE28D1F91879` | MATCH |
| `docs/engineering/autonomy-stop-matrix.md` | `10BB7CD3934D7303937FD9AB6BD38ED3E855763C55B47615126FEA2EA2A3A8DA` | MATCH |

**Net enforced active/template parity = 4/4 MATCH.**

> **Matrix YAML parity note (non-blocking, recorded for honesty):** the literal raw
> machine-YAML pair `scripts/data/autonomy_stop_matrix.yaml` vs
> `template/scripts/data/autonomy_stop_matrix.yaml` is **N/A** — `template/scripts/data/`
> does not exist and that path is not tracked in git (never committed), so there is no
> template twin to byte-compare. The matrix YAML is a **single active source**; the
> repo's enforced matrix parity surface is the `docs/engineering/autonomy-stop-matrix.md`
> document (MATCH above, `10BB7CD3...`), which is what the BUG-0034 test's
> `test_bug0034_operator_matrix_active_template_parity` asserts. This is consistent with
> the prior-cycle 4-pair record. It is recorded here so the "4/4" claim is exactly the
> four enforced pairs, not a fabricated fifth.

### Status and guard evidence

- `docs/product/backlog.md` BUG-0034 remains **OPEN**; AC-1..AC-7 all `[ ]`.
- `docs/product/acceptance.md` BUG-0034 remains `[ ]`.
- This QA context ticked **no** AC, mutated **no** backlog/acceptance/closure status, wrote **no** production code / test / script / template / runbook, spawned **no** child, ran **no** downstream phase, and performed **no** publish/push or `.env` read.
- **Blockers: 0.**

**Ready for an orchestrator-owned fresh `/verify-work`** (see `handoffs/qa_to_verify_work.md` top entry).

---

## HISTORY — prior-cycle QA record (auto-20261006-bug0034-qa), preserved

## Verdict

**QA_PASS** — `S0167_UNBLOCK_OK`; 0 blocking findings.

- **Phase / role:** `qa` / `qa` (fresh, independent of execute)
- **Timestamp:** 2026-10-06T23:50:16Z
- **Fresh marker:** `qa-BUG0034-qa-20261006T235016Z-fresh` (no prior occurrence found before mint)
- **QA proof:** `rp-auto-20261006-bug0034-qa-20261006T235016Z-BUG-0034` / `F67FD2461747028123247ECB38CD58A2DFED634E04BB7B30176EBDFB55A4D27A`
- **Canonical payload:** `{"orchestrator_run_id":"auto-20261006-bug0034-qa","phase_id":"qa","proof_issued_at":"2026-10-06T23:50:16Z","proof_ttl_seconds":3600,"role":"qa","runtime_proof_id":"rp-auto-20261006-bug0034-qa-20261006T235016Z-BUG-0034"}`
- **Strict-proof recompute:** library and independent `hashlib.sha256(json.dumps(..., sort_keys=True, separators=(",", ":")))` both returned `F67FD2461747028123247ECB38CD58A2DFED634E04BB7B30176EBDFB55A4D27A`.
- **Consumed execute proof:** `rp-auto-20261006-bug0034-execute-dev-20261006T213638Z-BUG-0034` / `29132484C81288C977D6A489F59DDE41FD35C39A3BDF1CCBCF7E65E9FC4A7214`; independently recomputed by the same two methods and matched. Its 3600-second TTL had elapsed before this QA mint; this is recorded provenance, not a functional failure, and all functional evidence below was independently re-run.

## Independent verification results

| Check | Exact result |
|---|---|
| Active eight-marker suite | `python -m pytest tests/bug0034_autonomy_stop_matrix_test.py -q` → **8 passed in 0.16s**, exit 0 |
| Template eight-marker suite (separate invocation despite basename) | `python -m pytest template/tests/bug0034_autonomy_stop_matrix_test.py -q` → **8 passed in 0.16s**, exit 0 |
| Ledger self-test | `python scripts/autonomy_repair_ledger_lib.py --self-test` → `[AUTONOMY_REPAIR_LEDGER_SELF_TEST_OK]`, exit 0 |
| Acceptance validator | `python scripts/bug_issue_validate.py --check-acceptance` → `[BUG_VALIDATION_OK]`, exit 0 |
| US-0131 compose regression | `python -m pytest tests/us0131_contract_test.py -q` → **10 passed in 0.10s**, exit 0 |
| US-0119 carried baseline | `python -m pytest tests/us0119_autonomy_preset_test.py -q` → **8 passed, 2 failed in 0.16s**, exit 1: the same two validator tests and the same five orphans (`BUDGET_EXHAUSTED`, `DECISION_UNRESOLVED`, `KERNEL_INCOMPATIBLE`, `QUALITY_EVIDENCE_FAILED`, `RESUME_AMBIGUOUS`) |
| US-0120 carried baseline | `python -m pytest tests/us0120_closure_phase_test.py -q` → **9 passed, 1 failed in 0.08s**, exit 1: `test_us0120_compose_guards_unchanged`, unchanged missing `US-0043` architecture reference |
| Matrix validator baseline | `python scripts/validate_autonomy_stop_matrix.py --self-test` → exit 1 with exactly the same five US-0119 orphan reports; no `PO_CLOSURE_PRECONDITION_CONFLICT` report |

The US-0119 and US-0120 failures were independently reproduced unchanged and are carried baselines only; neither was weakened, repaired, or attributed to BUG-0034.

## Required surface assessment

- **Matrix:** exactly one adjacent YAML row is present: `PO_CLOSURE_PRECONDITION_CONFLICT` / `autonomy_resolvable` / `disambiguate_state` / cap `3` with the locked non-empty rationale. The negative marker rejects `auto_refresh_brief`.
- **Documentation/template parity:** independent SHA-256 byte parity is **4/4 MATCH**: operator matrix `10BB7CD3934D7303937FD9AB6BD38ED3E855763C55B47615126FEA2EA2A3A8DA`; reason codes `04A88D32B4C67D6F43911AE05B3A456DC72C8A21152E0C767E91371DDC1CC0DD`; runbook `A2F31FF568DAC32343ED5E4CFD1141AB982436C82B56B4118CA36C14D10D4C1F`; eight-marker test `B987E9C5B5C15BA3DF8567AAB5E48E280D84A580B8A2E5C8CB48FE28D1F91879`.
- **Ledger behavior:** marker 7 and the ledger self-test independently cover matrix cap 3, `(orchestrator_run_id, reason_code)` accounting, the cap-exhausted no-fourth-row path, authorized positive-integer override (`4`), rejection of unauthorized/zero overrides, audit fields, and success-only `autonomy_relaxed: PO_CLOSURE_PRECONDITION_CONFLICT -> disambiguate_state`. Failures, invalid evidence, ambiguity, and exhaustion return no breadcrumb.
- **Pair/no-refresh boundary:** marker 8 confirms `RESUME_AMBIGUOUS` and `RESUME_BRIEF_STALE` remain security-hard; runbook text retains syntax=`RESUME_BRIEF_UNPARSEABLE`, all other listed invalid predicates=`RESUME_BRIEF_STALE`, and `RESUME_BRIEF_AUTO_REFRESH=0` forbids refresh, state fallback, reconciliation, hand edit, manual-parent repair, and invalid-evidence scheduling.

## AC assessment (assessment only; no checkbox mutation)

| AC | QA assessment | Evidence |
|---|---|---|
| AC-1 | PASS | Markers 1–3 verify row/class/kind/cap/rationale. |
| AC-2 | PASS | Marker 5 verifies active/template reason-code parity and US-0119/kind/cap content. |
| AC-3 | PASS | Marker 6 verifies byte-identical no-refresh operator remediation. |
| AC-4 | PASS | Marker 7 plus independent ledger self-test verify cap, authorized override, audit, exhaustion, and breadcrumb behavior. |
| AC-5 | PASS | `# BUG-0034` architecture entry exists; active/template matrix docs are additive and parity-clean. |
| AC-6 | PASS with carried baselines | Both eight-marker suites pass; acceptance validator passes; US-0119 and US-0120 reproduce exactly their documented unrelated failures. |
| AC-7 | PASS | Marker 8 retains security-hard classifications; no-refresh guard and documented compose invariants hold. |

## Status and guard evidence

- `docs/product/backlog.md` BUG-0034 is still **OPEN** (line 5720); AC-1 through AC-7 are all `[ ]` (lines 5727–5733).
- `docs/product/acceptance.md` BUG-0034 remains `[ ]` (line 225).
- QA did not tick backlog or acceptance ACs, change status, author production code, run a downstream phase, spawn a child, read `.env`, publish, push, or claim a live-host probe.

## Handoff readiness

Ready for an orchestrator-owned fresh **`/verify-work`** QA context. That context must independently rerun the two same-basename suites separately, parity hashes, ledger/validator checks, US-0119/US-0120 baseline classification, and status guard. BUG-0034 remains OPEN; release and closure are not authorized from this QA context.
