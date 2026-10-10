# Release Notes — S0167 / BUG-0034

- **Sprint**: `S0167`
- **Bug**: `BUG-0034` — **Register `PO_CLOSURE_PRECONDITION_CONFLICT`** — the ad-hoc PO closure precondition-conflict token emitted at runtime by the PO closure path was unregistered across matrix / reason codes / runbook / repair-ledger (grep 0 hits repo-wide); any occurrence produced a fail-closed stop with no documented auto-repair kind, no operator remediation text, and no ledger accounting. Registered as `stop_class: autonomy_resolvable`, `auto_repair_kind: disambiguate_state` (TL-picked in research; the `auto_refresh_brief` alternative rejected by the negative marker), `cap: 3`, non-empty rationale; additive `docs/engineering/reason_codes.md` row; byte-identical no-refresh runbook remediation entry; `autonomy_repair_ledger` integration (cap, `(orchestrator_run_id, reason_code)` accounting, authorized positive-integer override, audit, exhaustion no-fourth-row, success-only breadcrumb); `# BUG-0034` architecture H1 entry; 8 `test_bug0034_*` markers (active + byte-identical template mirror)
- **Story**: (none; BUG-0034 is a **registry / doc / ledger** slice — it registers the token and its remediation path; the DONE flip + acceptance tick is the **operator / curator action at closure**, not this phase)
- **Release date**: `2026-10-07T21:22:54Z` (UTC)
- **orchestrator_run_id**: `auto-20261007-bug0034` (parent) / `auto-20261007-bug0034-release` (this release)
- **delivery_mode**: `ultra_lean`
- **macro_phase**: `ship` (release → `/closure` (curator, DEC-0052 sanctioned alternate) → `/refresh-context` (optional))
- **policy_mode**: `confirm` (`RELEASE_PUBLISH_MODE=confirm`; orchestrator default-off; operator confirm absent this turn → npm publish deferred)
- **trigger_source**: `auto`
- **branch**: `local` (no push; `SYNC_POLICY_MODE=disabled`)
- **fresh_context_marker**: `release-BUG0034-20261007T212254Z-fresh` (FRESH; grep-verified 0 prior occurrences repo-wide at mint; distinct from all S0167 chain markers: dev execute `dev-BUG0034-execute-20261007T205320Z-fresh`, qa `qa-BUG0034-qa-20261007T205653Z-fresh`, verify-work `qa-BUG0034-verify-work-20261007T210517Z-fresh`, and the prior **blocked** release `release-BUG0034-20261006T221151Z-fresh`)
- **model_id**: `qwen3.8-27b` (CROSS_MODEL_REVIEW=0)
- **runtime_proof_id**: `rp-auto-20261007-bug0034-release-release-20261007T212254Z-BUG-0034`
- **proof_hash**: **`BE701D33414176EE582640DACFA53CCA8FFEB876822044761760543AD53F7BFB`** (64 hex uppercase; canonical 6-tuple SHA-256 per DEC-0038; **2-invocation recompute MATCH by construction** (invocation 1 = `scripts.token_cost_lib.compute_strict_proof_hash`; invocation 2 = plain `hashlib.sha256(json.dumps(obj, sort_keys=True, separators=(",",":")).encode())`); 64-hex; `hash_recompute_confirmation=true`)
- **proof_issued_at**: `2026-10-07T21:22:54Z`; **proof_ttl_seconds**: `3600`; **proof_ttl**: `2026-10-07T22:22:54Z`
- **release_version**: **(none — workflow-only release; no kit semver bump; this release feeds `[Unreleased]` / next kit version)**
- **npm_published**: `false`

## Verdict

**RELEASE_PASS** (RETRY #1 of repair cycle #1). Mandatory release gates (1, 2, 3, 4, 4b) green on a **fresh independent re-run** (this release session — not the QA / verify-work word). The prior release `auto-20261006-bug0034-release` was **RELEASE_BLOCKED** at Gate 1 (`RELEASE_TEST_FAILED`; harness 2026-10-06T22:10:38Z Pass=865/Fail=12); that failure has since been **repaired at its source** by the fresh chain `auto-20261007-bug0034-{execute,qa,verify-work}` (EXECUTE_PASS / QA_PASS / VERIFY_PASS, each with a fresh non-stale strict proof), and this release independently re-evaluated the complete ordered gate chain on fresh evidence.

- **Gate 1 (check-in tests)** — live configured harness @ release:
  - `powershell -ExecutionPolicy Bypass -File "tests/run-tests.ps1"` → **exit 0**; fresh `tests/report.md` timestamp **`2026-10-07T21:22:38Z`**, **Pass: 877, Fail: 0** (vs the prior blocked pass's 865/12 — the 12 consolidated failures are repaired)
  - Scoped BUG-0034: `python -m pytest tests/bug0034_autonomy_stop_matrix_test.py -q` → **8 passed**, exit 0 (fresh re-run this release)
  - `python scripts/bug_issue_validate.py --repo . --check-acceptance` → **`[BUG_VALIDATION_OK]`**, exit 0 (AC-7)
  - `harness_fail_zero_claimed=false`
- **Gate 2 (qa)** — `sprints/S0167/qa-findings.md` top **REPAIR #1** record: **QA_PASS** / `S0167_REPAIR_VERIFY_OK`; **0 blocking findings**; evaluated 2026-10-07T20:56:53Z (fresh independent QA; prior-cycle record `auto-20261006-bug0034-qa` `QA_PASS`/`S0167_UNBLOCK_OK` preserved below as history)
- **Gate 3 (uat)** — `sprints/S0167/uat.json`: `verdict=QA_PASS` / `verified_ready=true` / `uat_lifecycle=populated`; **total=8, passed=8, failed=0** (UAT-1..UAT-7 + UAT-DC all PASS; UAT-6 `PASS_WITH_CARRIED_BASELINES`); `live_opencode_cli_tui_pass_claimed=false`; `npm_published=false`; `git_pushed=false`. `sprints/S0167/uat.md` carries the REPAIR #1 reconciliation note (2026-10-07T21:05:17Z); `uat.json` kept byte-identical as valid prior-cycle evidence
- **Gate 4 (isolation)** — **3 distinct fresh-context checkpoints** in `docs/engineering/state.md` (L1137 execute / L1149 qa / L1161 verify-work) for `auto-20261007-bug0034-{execute,qa,verify-work}` with role-aligned, never-reused markers: `dev-BUG0034-execute-20261007T205320Z-fresh`, `qa-BUG0034-qa-20261007T205653Z-fresh`, `qa-BUG0034-verify-work-20261007T210517Z-fresh`. This release adds the **4th** distinct marker `release-BUG0034-20261007T212254Z-fresh` (via the state.md release checkpoint). All role-aligned (US-0069 / DEC-0051: execute=dev, qa+verify-work=qa, release=release); **CROSS_MODEL_REVIEW=0** (no sovereign-critic consume required)
- **Gate 4b (strict_runtime_proof)** — **all 3 upstream chain leaves independently RECOMPUTED MATCH this release** (via `scripts.token_cost_lib.compute_strict_proof_hash` + an independent plain `hashlib.sha256(json.dumps(obj, sort_keys=True, separators=(",",":")).encode())` over the verbatim recorded canonical 6-tuple for each leaf):
  - **execute (dev)** `rp-auto-20261007-bug0034-execute-dev-20261007T205320Z-BUG-0034` / `2CF5C9D6…D7785D` → **MATCH** (issued 2026-10-07T20:53:20Z, TTL→21:53:20Z)
  - **qa** `rp-auto-20261007-bug0034-qa-20261007T205653Z-BUG-0034` / `1CF2E37A…472DD57` → **MATCH** (issued 2026-10-07T20:56:53Z, TTL→21:56:53Z)
  - **verify-work (qa)** `rp-auto-20261007-bug0034-verify-work-qa-20261007T210517Z-BUG-0034` / `F5261785…781BDDCD` → **MATCH** (issued 2026-10-07T21:05:17Z, TTL→22:05:17Z)
  - **3/3 RECOMPUTED = MATCH.** **Chain consumption within TTL**: QA issued 20:56:53Z < execute TTL 21:53:20Z; verify-work issued 21:05:17Z < QA TTL 21:56:53Z; verify-work TTL 22:05:17Z **covers T=21:22:54Z** (not stale at release issue time). **No stale-proof waiver** — unlike the prior blocked pass (whose execute proof TTL had elapsed before QA), the entire chain is non-stale. Prior-cycle proofs (execute `29132484…`, QA `F67FD246…`, verify-work `5957755B…`) and the prior blocked release proof (`F9DA77D0…`) are **provenance only — NOT reused**.
  - **Own release proof**: `rp-auto-20261007-bug0034-release-release-20261007T212254Z-BUG-0034` / `BE701D33…F7BFB` — **2-invocation recompute MATCH by construction**; **0 prior occurrences** repo-wide (RUNTIME_PROOF_REUSED guard honored; fresh + distinct from all S0167 chain markers)

**Verdict: RELEASE_PASS** — queue S0167 → `released`; notes `handoffs/releases/S0167-release-notes.md`; backlog reconciliation **deferred to `/closure`** (US-0045 / `architecture.md:610` "Release cannot mark DONE" + post-BUG-0031 curator 3-allow flip-path, DEC-0152 DENY-FIRST); publish **deferred** (`PUBLISH_CONFIRMATION_REQUIRED; npm_published=false`); sync **not_eligible** (`SYNC_POLICY_MODE=disabled`). **No live OpenCode PASS. No fake browser PASS. No npm / git push this turn. No `.env` read. No subagent spawn. No `/auto` recursion. No sovereign-critic consume (CROSS_MODEL_REVIEW=0).**

## Summary — what BUG-0034 ships (this release)

BUG-0034 registers the previously **ad-hoc, unregistered** `PO_CLOSURE_PRECONDITION_CONFLICT` token across the autonomy stop-matrix surface (matrix + reason codes + runbook + repair-ledger + architecture + contract tests). It is a **registry / doc / ledger** slice — it does **not** perform any DONE flip or acceptance tick (that is the **closure** phase's action).

- **Stop-matrix row (AC-1)** — exactly one adjacent YAML row added to `scripts/data/autonomy_stop_matrix.yaml`: `PO_CLOSURE_PRECONDITION_CONFLICT` / `stop_class: autonomy_resolvable` / `auto_repair_kind: disambiguate_state` / `cap: 3` / locked non-empty rationale. The **`auto_refresh_brief` alternative is rejected** by the negative marker (research locked `disambiguate_state` — "pick last-known phase is safe when unambiguous", the US-0119 `STATE_PHASE_AMBIGUOUS` analogue).
- **Reason-code row (AC-2)** — additive `PO_CLOSURE_PRECONDITION_CONFLICT` row in `docs/engineering/reason_codes.md` with the US-0119 cross-ref and the repair-kind name (`disambiguate_state`), active↔template byte-identical (`04A88D32…C1CC0DD`).
- **Runbook remediation (AC-3)** — `docs/engineering/runbook.md` carries a **no-refresh** operator remediation entry for `PO_CLOSURE_PRECONDITION_CONFLICT` (how to resolve the PO closure precondition conflict — re-run discovery, re-attach the brief, or hand-flip with justification) while **retaining** the `RESUME_BRIEF_UNPARSEABLE` / `RESUME_BRIEF_STALE` / `RESUME_BRIEF_AUTO_REFRESH=0` no-refresh guard; active↔template byte-identical (`A2F31FF5…0D4C1F`).
- **Repair-ledger integration (AC-4)** — the autonomy repair ledger (`scripts/autonomy_repair_ledger_lib.py`) maps `PO_CLOSURE_PRECONDITION_CONFLICT` → `disambiguate_state`, counts it toward the `AUTONOMY_REPAIR_CAP_OVERRIDE` ledger (cap=3), supports the `(orchestrator_run_id, reason_code)` accounting, the cap-exhausted no-fourth-row path, the authorized positive-integer override (e.g. `4`), rejection of unauthorized/zero overrides, audit fields, and the **success-only** `autonomy_relaxed: PO_CLOSURE_PRECONDITION_CONFLICT -> disambiguate_state` breadcrumb. Failures, invalid evidence, ambiguity, and exhaustion return **no** breadcrumb.
- **Architecture H1 (AC-5)** — `docs/engineering/architecture.md` gains an additive-only `# BUG-0034` H1 entry (per DEC-0054 triad) describing the token, the repair-kind, the ledger integration point, and the compose to US-0119 / US-0120 without re-opening ACs.
- **Contract suite (AC-6)** — `tests/bug0034_autonomy_stop_matrix_test.py` (active) + `template/tests/bug0034_autonomy_stop_matrix_test.py` (byte-identical mirror, `B987E9C5…F91879`) — **8 `test_bug0034_*` markers**, mocks/fixtures only:
  - `test_bug0034_matrix_row_autonomy_resolvable` (AC-1 row / class / kind / cap / rationale)
  - `test_bug0034_disambiguate_state_only_no_auto_refresh` (the `auto_refresh_brief` alternative is rejected; no auto-refresh)
  - `test_bug0034_matrix_cap_three_and_rationale` (cap=3 + non-empty rationale)
  - `test_bug0034_operator_matrix_active_template_parity` (operator matrix `.md` active↔template byte parity)
  - `test_bug0034_reason_code_active_template_parity` (AC-2 active↔template byte parity)
  - `test_bug0034_runbook_no_refresh_active_template_parity` (AC-3 byte-identical no-refresh runbook)
  - `test_bug0034_ledger_matrix_cap_override_audit_and_success_breadcrumb` (AC-4 cap / override / audit / exhaustion / success-only breadcrumb)
  - `test_bug0034_negative_pair_codes_and_compose_invariants` (AC-7: `RESUME_AMBIGUOUS` + `RESUME_BRIEF_STALE` remain security-hard; no-refresh guard; compose invariants)

**Registry / doc / ledger only, NOT a DONE flip.** BUG-0034's backlog/acceptance status remains **OPEN** (`docs/product/backlog.md ### BUG-0034` L5720 `Status: OPEN` + AC-1..AC-7 L5727-L5733 `[ ]`; `docs/product/acceptance.md` L225 `- [ ]`) — **closure owns the flip** (US-0045 / `architecture.md:610` + post-BUG-0031 curator 3-allow). The DONE flip, the AC tick, the acceptance tick, and `sprints/S0167/closure-verification.md` creation are all **closure-phase** actions, not this release's.

**Sibling composes preserved** (guard audited this session — all UNTOUCHED / carried baselines NOT weakened, NOT repaired):

- **US-0119** (shipped; stop-matrix surface; 12 per-feature flags + `AUTONOMY_PRESET=none` default) — NOT reopened; carried baseline **8 passed, 2 failed** (the exact five pre-existing orphans `BUDGET_EXHAUSTED/DECISION_UNRESOLVED/KERNEL_INCOMPATIBLE/QUALITY_EVIDENCE_FAILED/RESUME_AMBIGUOUS`) — **not a regression**; NOT weakened, NOT repaired by BUG-0034
- **US-0120** (closure phase — the trigger surface for the PO closure precondition conflict) — NOT reopened; carried baseline **9 passed, 1 failed** (pre-existing missing `US-0043` architecture reference) — **not a regression**; NOT weakened, NOT repaired by BUG-0034
- **US-0131** (cross-host config baseline + resolver live-wins) — compose-only; **10/10** (unchanged)
- **US-0133 / US-0143** (compose) — **17 passed** (unchanged)
- **US-0069 / DEC-0051** (role isolation) — role-aligned, UNMUTATED
- **`INTAKE_AUTONOMY_MODE=0` / `INTAKE_SUBAGENT_FALLBACK=deny`** (config.json L145-L146, L323-L324) and **`AUTONOMY_PRESET=none`** default — **unchanged** (AC-7: this bug is a registry/doc/ledger fix, **not** a security-gate relaxation)
- **BUG-0005 / 0016 / 0022 / 0027 / 0031 / 0035** (all DONE) — NOT reopened
- **BUG-0026 / 0028 / 0029** (OPEN) — UNTOUCHED
- **BUG-0032 / 0033** (OPEN) — UNTOUCHED (BUG-0033 owns its own closure cycle)
- **US-0154 / 0155** (OPEN) — UNMUTATED
- **US-0156** (DONE) — NOT reopened
- **`RESUME_AMBIGUOUS` / `RESUME_BRIEF_STALE`** — remain **security-hard** (marker 8 confirms; no-refresh guard held)

## ACs satisfied (QA + verify-work + release re-run)

**7/7 PASS (functional slice) + DC baseline integrity PASS (this release, independent re-run)**. Backlog ACs remain `- [ ]` unchecked until `/closure` (per US-0045 / `architecture.md:610`).

| AC | Status (slice evidence, re-ran this release) |
|----|--------|
| **AC-1** — matrix row `PO_CLOSURE_PRECONDITION_CONFLICT` `autonomy_resolvable` / `disambiguate_state` OR `auto_refresh_brief` / cap 3 / rationale | **PASS** — markers 1–3 verify exactly one adjacent YAML row with `stop_class: autonomy_resolvable`, `auto_repair_kind: disambiguate_state` (research-locked; `auto_refresh_brief` rejected by the negative marker), `cap: 3`, and the locked non-empty rationale |
| **AC-2** — `reason_codes.md` row with US-0119 cross-ref + repair-kind name | **PASS** — marker 5 verifies the active↔template byte-parity (`04A88D32…C1CC0DD`) and the US-0119 / kind / cap content |
| **AC-3** — `runbook.md` no-refresh remediation entry | **PASS** — marker 6 verifies the byte-identical (`A2F31FF5…0D4C1F`) no-refresh operator remediation entry while retaining `RESUME_BRIEF_UNPARSEABLE` / `RESUME_BRIEF_STALE` / `RESUME_BRIEF_AUTO_REFRESH=0` |
| **AC-4** — repair-ledger maps token to repair kind, counts toward cap ledger | **PASS** — marker 7 + independent ledger self-test (`[AUTONOMY_REPAIR_LEDGER_SELF_TEST_OK]` exit 0) verify cap 3, `(orchestrator_run_id, reason_code)` accounting, cap-exhausted no-fourth-row, authorized positive-integer override, rejection of unauthorized/zero overrides, audit fields, and success-only breadcrumb |
| **AC-5** — `architecture.md` additive-only `# BUG-0034` H1 | **PASS** — the `# BUG-0034` H1 entry is present and additive (DEC-0054 triad); active/template matrix docs are parity-clean |
| **AC-6** — ≥8 `test_bug0034_*` markers + validator exit 0; no US-0119/US-0120 regression | **PASS** with carried baselines — **8/8 active + 8/8 template** markers pass (fresh re-run this release); `bug_issue_validate.py --check-acceptance` → `[BUG_VALIDATION_OK]` exit 0; US-0119 (8P/2F) and US-0120 (9P/1F) reproduce **exactly** their documented unrelated failures — **not a regression**, NOT weakened, NOT repaired |
| **AC-7** — `INTAKE_AUTONOMY_MODE=0` / `INTAKE_SUBAGENT_FALLBACK=deny` / `AUTONOMY_PRESET=none` unchanged; not a security-gate relaxation | **PASS** — marker 8 retains the security-hard classifications (`RESUME_AMBIGUOUS` + `RESUME_BRIEF_STALE` remain security-hard); the no-refresh guard and documented compose invariants hold; the config defaults are unchanged (registry/doc/ledger fix only) |
| **DC** — baseline / anchor / sibling integrity | **PASS** — `# BUG-0034` architecture anchor + the four enforced active↔template parity pairs intact; BUG-0034 remains **OPEN** with all ACs unchecked (closure owns the flip); siblings US-0119 / US-0120 / US-0131 / US-0133 / US-0143 / BUG-0032 / BUG-0033 / BUG-0035 / US-0154 / US-0155 / US-0156 / DEC-0051 / DEC-0054 **UNTOUCHED** |

## Test results (release — live this pass, independently re-run)

- **Configured harness (fresh)**: `powershell -ExecutionPolicy Bypass -File "tests/run-tests.ps1"` → **exit 0**; `tests/report.md` **`2026-10-07T21:22:38Z` Pass: 877, Fail: 0** (vs the prior blocked pass 2026-10-06T22:10:38Z Pass: 865, Fail: 12 — the 12 consolidated failures are repaired).
- **Scoped BUG-0034 (active 8-marker, fresh re-run)**: `python -m pytest tests/bug0034_autonomy_stop_matrix_test.py -q` → **8 passed**, exit 0 — markers: `matrix_row_autonomy_resolvable`, `disambiguate_state_only_no_auto_refresh`, `matrix_cap_three_and_rationale`, `operator_matrix_active_template_parity`, `reason_code_active_template_parity`, `runbook_no_refresh_active_template_parity`, `ledger_matrix_cap_override_audit_and_success_breadcrumb`, `negative_pair_codes_and_compose_invariants`.
- **Ledger self-test**: `python scripts/autonomy_repair_ledger_lib.py --self-test` → `[AUTONOMY_REPAIR_LEDGER_SELF_TEST_OK]` exit 0.
- **Bug/acceptance validator**: `python scripts/bug_issue_validate.py --repo . --check-acceptance` → `[BUG_VALIDATION_OK]` exit 0 (this release, independent run; AC-7).
- **Parity (4/4 enforced pairs, re-ran this release)**: `docs/engineering/autonomy-stop-matrix.md` `10BB7CD3…A3A8DA` (active==template); `docs/engineering/reason_codes.md` `04A88D32…C1CC0DD` (active==template); `docs/engineering/runbook.md` `A2F31FF5…0D4C1F` (active==template); `tests/bug0034_autonomy_stop_matrix_test.py` `B987E9C5…F91879` (active==template). **Net enforced active/template parity = 4/4 MATCH.** (The raw machine-YAML `scripts/data/autonomy_stop_matrix.yaml` has **no** template twin — `template/scripts/data/` does not exist and the path is not git-tracked — so a literal YAML-vs-template-YAML byte-pair is N/A; the enforced matrix parity surface is the `.md` document above.)
- **Carried baselines (NOT a regression; NOT weakened; NOT repaired)**: US-0119 **8 passed, 2 failed** (five pre-existing orphans `BUDGET_EXHAUSTED/DECISION_UNRESOLVED/KERNEL_INCOMPATIBLE/QUALITY_EVIDENCE_FAILED/RESUME_AMBIGUOUS`); US-0120 **9 passed, 1 failed** (pre-existing missing `US-0043` architecture reference).
- **Strict runtime proof (3/3 chain re-run)** — see the 4b gate table above. **3/3 RECOMPUTED = MATCH** (lib + independent `hashlib` per leaf, verbatim recorded canonical payload). **`hash_recompute_confirmation=true` by construction** for all 3 leaves + the own release proof.

## Gate summary (this release, all green on a fresh independent re-run)

| Gate | Result |
|------|--------|
| check_in_tests (1) | **PASS** — fresh configured harness exit 0; `tests/report.md` `2026-10-07T21:22:38Z` **Pass: 877 / Fail: 0**; scoped `bug0034` 8/8 (fresh re-run) + ledger self-test + `[BUG_VALIDATION_OK]` exit 0; `harness_fail_zero_claimed=false`; `lint:skipped`, `typecheck:skipped` (python project) |
| qa (2) | **PASS** — `sprints/S0167/qa-findings.md` **QA_PASS** / `S0167_REPAIR_VERIFY_OK` (top REPAIR #1 record); 7/7 AC + DC PASS; **0 blocking**; carried baselines (US-0119 8P/2F, US-0120 9P/1F) NOT_WEAKENED_NOT_REPAIRED; prior-cycle record preserved as history |
| uat (3) | **PASS** — `contract_tests_primary`; `verified_ready=true`; **8/8 total** PASS (UAT-1..UAT-7 + UAT-DC; UAT-6 `PASS_WITH_CARRIED_BASELINES`); `live_opencode_cli_tui_pass_claimed=false`; `npm_published=false`; `git_pushed=false`; all live-host/broker/TUI classes `UAT_PROBE_FORBIDDEN`; `uat.json` byte-identical prior-cycle evidence + `uat.md` REPAIR #1 reconciliation note |
| isolation (4) | **PASS** — **3 distinct fresh_context_markers** in `state.md` (execute, qa, verify-work) for `auto-20261007-bug0034-*` + this release's **4th** marker `release-BUG0034-20261007T212254Z-fresh`; role-aligned per US-0069/DEC-0051; **CROSS_MODEL_REVIEW=0** |
| strict_runtime_proof (4b) | **PASS** — **3/3 consumed leaves RECOMPUTED MATCH this release** (lib + independent `hashlib` per leaf) + own release proof **2-invocation recompute MATCH by construction**; chain consumption **within TTL** (QA<execute TTL; verify-work<qa TTL; verify-work TTL covers T); **no stale-proof waiver**; RUNTIME_PROOF_REUSED guard honored (0 prior occurrences of own rpid; prior-cycle proofs NOT reused) |
| readme_feature_coverage_3f | **PASS** — `validate_readme_feature_coverage.py --report` → `status=PASS` (coverage_total=42, coverage_missing=[], gaps=[]) |
| project_readme_3g | **skipped** (`FRAMEWORK_KIT_REPO=1`; kit_repo_skipped=true) |
| publish | **deferred** (`RELEASE_PUBLISH_MODE=confirm`; `RELEASE_PUBLISH_AUTO_CONFIRM=0`; `PUBLISH_CONFIRMATION_REQUIRED`; `npm_published=false`; no kit semver bump) |
| sync | **not_eligible** (`SYNC_POLICY_MODE=disabled`; no git push; `reason_code=SYNC_DISABLED`) |
| version-doc (17) | **workflow-only** — no release version this turn; `[Unreleased]` path (see CHANGELOG hygiene below) |
| CHANGELOG hygiene | **updated** — `## [Unreleased]` in `CHANGELOG.md` now carries a **`### Fixed`** BUG-0034 bullet (S0167 evidence pointer + npm publish deferred note + no kit semver bump); `template/CHANGELOG.md` **UNTOUCHED** (out of scope for this workflow-only release; S0162/S0163/S0164 precedent) |
| backlog_reconciliation | **deferred to `/closure`** per US-0045 — no DONE flip, no AC tick, no `sprints/S0167/closure-verification.md` creation from this release |
| finalization | **PASS** — queue S0167 → `released`; notes `handoffs/releases/S0167-release-notes.md`; no kit semver bump; publish deferred |

## Run (repro this release)

```powershell
# Gate 1 — configured harness (fresh):
powershell -ExecutionPolicy Bypass -File "tests/run-tests.ps1"     # exit 0; tests/report.md 2026-10-07T21:22:38Z Pass=877 Fail=0

# Scoped BUG-0034 (active 8-marker, fresh re-run):
python -m pytest tests/bug0034_autonomy_stop_matrix_test.py -v     # 8/8 PASS

# Ledger self-test (AC-4):
python scripts/autonomy_repair_ledger_lib.py --self-test           # [AUTONOMY_REPAIR_LEDGER_SELF_TEST_OK] exit 0

# Bug/acceptance validator (AC-7):
python scripts/bug_issue_validate.py --repo . --check-acceptance   # [BUG_VALIDATION_OK] exit 0

# 4/4 enforced byte-parity (active == template):
Get-FileHash docs/engineering/autonomy-stop-matrix.md              # 10BB7CD3...A3A8DA
Get-FileHash template/docs/engineering/autonomy-stop-matrix.md     # 10BB7CD3...A3A8DA (MATCH)
Get-FileHash docs/engineering/reason_codes.md                      # 04A88D32...C1CC0DD
Get-FileHash template/docs/engineering/reason_codes.md             # 04A88D32...C1CC0DD (MATCH)
Get-FileHash docs/engineering/runbook.md                           # A2F31FF5...0D4C1F
Get-FileHash template/docs/engineering/runbook.md                  # A2F31FF5...0D4C1F (MATCH)
Get-FileHash tests/bug0034_autonomy_stop_matrix_test.py            # B987E9C5...F91879
Get-FileHash template/tests/bug0034_autonomy_stop_matrix_test.py   # B987E9C5...F91879 (MATCH)
```

- **start_command**: `python -m pytest tests/bug0034_autonomy_stop_matrix_test.py -v`
- **runtime_mode**: `local`
- **runtime_context_ref**: `docs/engineering/architecture.md # BUG-0034`; `docs/engineering/reason_codes.md` (BUG-0034 row); `docs/engineering/runbook.md ## PO_CLOSURE_PRECONDITION_CONFLICT`; `scripts/data/autonomy_stop_matrix.yaml`; `sprints/S0167/qa-findings.md` + `sprints/S0167/verify-work-findings.md` (REPAIR #1)

## Connect

- **service_url**: n/a (registry / doc / ledger slice; no long-running HTTP service)
- **service_port**: n/a
- **health_endpoint**: n/a — verify via the 8-marker suite (active + template) + ledger self-test + 4/4 byte-parity + `[BUG_VALIDATION_OK]` bridge

## Verify (this release re-ran each check; do NOT trust the prior roles' word)

1. `powershell -ExecutionPolicy Bypass -File "tests/run-tests.ps1"` → **exit 0**; `tests/report.md` **2026-10-07T21:22:38Z Pass: 877, Fail: 0** (the 12 prior consolidated failures repaired)
2. `python -m pytest tests/bug0034_autonomy_stop_matrix_test.py -v` → **8/8 PASS** (active 8-marker, fresh re-run)
3. `python scripts/autonomy_repair_ledger_lib.py --self-test` → `[AUTONOMY_REPAIR_LEDGER_SELF_TEST_OK]` exit 0 (AC-4)
4. `python scripts/bug_issue_validate.py --repo . --check-acceptance` → `[BUG_VALIDATION_OK]` exit 0 (AC-7)
5. 4/4 enforced byte-parity SHA-256 (matrix `.md`, reason_codes, runbook, bug0034 test) — **active == template** (this release, independent re-run)
6. strict-proof chain (3 leaves) — **3/3 RECOMPUTED = MATCH** this release (lib + independent `hashlib` per leaf, verbatim recorded canonical payload); chain consumption **within TTL**; **no stale-proof waiver**
7. own release proof `BE701D33…F7BFB` — **2-invocation recompute MATCH by construction** (invocation 1 = `compute_strict_proof_hash`; invocation 2 = plain `hashlib.sha256(json.dumps(obj, sort_keys=True, separators=(",",":")).encode())`); **0 prior occurrences** of `rp-auto-20261007-bug0034-release-release-20261007T212254Z-BUG-0034` repo-wide (RUNTIME_PROOF_REUSED guard honored)
8. UAT honesty: `probe_kind=contract_tests_primary`; `verified_ready=true`; `8/8/0`; `live_opencode_cli_tui_pass_claimed=false`; `npm_published=false`; `git_pushed=false`; all live-host / broker / TUI classes `UAT_PROBE_FORBIDDEN`
9. carried baselines: US-0119 8P/2F + US-0120 9P/1F reproduced **unchanged** (NOT_WEAKENED_NOT_REPAIRED; not a regression)

## Credentials

- **No inline secrets.** Kit denies `.env` reads (US-0085). This release did not read `.env`.
- **npm publish credentials**: env-reference-only (`npm publish` is deferred pending operator confirm on a real kit release; no kit semver bump this turn)
- **No API tokens required** for the verification battery (pytest + script invocations, all local)

## Known Issues

- **N-1 (US-0119 2 pre-existing matrix-ref failures)** — `tests/us0119_autonomy_preset_test.py::test_us0119_matrix_validator_passes` + `test_us0119_matrix_no_orphan_codes` fail with the **5 pre-existing orphans** `BUDGET_EXHAUSTED/DECISION_UNRESOLVED/KERNEL_INCOMPATIBLE/QUALITY_EVIDENCE_FAILED/RESUME_AMBIGUOUS`. **NOT weakened, NOT repaired** by BUG-0034; **carried forward.** Not a S0167 regression. (Distinct from the `PO_CLOSURE_PRECONDITION_CONFLICT` registration — that token is now registered and does **not** appear in these orphan reports.)
- **N-2 (US-0120 1 pre-existing compose-guard failure)** — `tests/us0120_closure_phase_test.py::test_us0120_compose_guards_unchanged` fails on the **pre-existing missing `US-0043` architecture reference**. **NOT weakened, NOT repaired** by BUG-0034; **carried forward.** Not a S0167 regression.
- **3f README_FEATURE_COVERAGE**: PASS (`validate_readme_feature_coverage.py` status=PASS, 42/42, gaps=[]) — the prior blocked pass's README coverage gap was repaired in REPAIR #1 execute.
- **BUG-0034 backlog/acceptance status remains OPEN** — `docs/product/backlog.md ### BUG-0034` (L5717-L5736) `Status: OPEN` + AC-1..AC-7 `[ ]`; `docs/product/acceptance.md` L225 `- [ ]`; **closure owns the flip** per US-0045 / `architecture.md:610` "Release cannot mark DONE (US-0045)" + post-BUG-0031 curator 3-allow flip-path (DEC-0152 DENY-FIRST).
- **US-0119 / US-0120 / US-0131 / US-0133 / US-0143** carried baselines / compose **UNMUTATED**; **BUG-0032 / 0033 OPEN** (unmutated); **BUG-0005/0016/0022/0027/0031/0035 DONE** (not reopened); **US-0156 DONE** (not reopened); **US-0154/0155 OPEN** (unmutated); **DEC-0051 / DEC-0054 UNMUTATED** — all **UNTOUCHED** by this release (sibling status scan this session; no reopens, no drains).
- `npm publish deferred` under `RELEASE_PUBLISH_MODE=confirm` (no kit semver bump this turn).
- `push_decision=not_eligible` (`SYNC_POLICY_MODE=disabled` — no git push this turn).

## Evidence refs (durable on disk)

- **Sprint artifacts**
  - `sprints/S0167/sprint.md` + `sprints/S0167/tasks.md`
  - `sprints/S0167/summary.md` (EXECUTE_PASS + REPAIR #1 EXECUTE_PASS)
  - `sprints/S0167/progress.md` (per-task DONE + command / timestamp evidence)
  - `sprints/S0167/plan-verify.json` (ultra_lean; status=PASS)
  - `sprints/S0167/uat.json` + `sprints/S0167/uat.md` (8/8 PASS; `verified_ready=true`; `uat_lifecycle=populated`; REPAIR #1 reconciliation note)
  - `sprints/S0167/qa-findings.md` (REPAIR #1 QA_PASS `S0167_REPAIR_VERIFY_OK`; 7/7 AC + DC PASS; prior-cycle record preserved as history)
  - `sprints/S0167/verify-work-findings.md` (REPAIR #1 section; prior auto-20261006 record preserved as history)
  - **`sprints/S0167/release-findings.md` (this file's companion; RETRY #1 RELEASE_PASS appended; prior RELEASE_BLOCKED preserved as history)**
- **Handoffs**
  - `handoffs/dev_to_qa.md` (top: REPAIR #1 execute → qa handoff)
  - `handoffs/qa_to_verify_work.md` (top: REPAIR #1 qa → verify-work handoff)
  - `handoffs/verify_to_release.md` (top: REPAIR #1 verify-work → release handoff)
  - **`handoffs/release_queue.md` S0167 row → `released`** (this release, in-place update)
  - **`handoffs/release_notes.md` top entry** (this release, prepended; prior top pointer retained unaltered)
- **Anchors (durable; consumed verbatim by this release; NOT authored this phase)**
  - `docs/product/backlog.md ### BUG-0034` (L5717-L5736, `Status: OPEN`, AC-1..AC-7 `[ ]`)
  - `docs/product/acceptance.md L225` (BUG-0034 row, `- [ ]`)
  - `docs/engineering/architecture.md # BUG-0034` (additive-only H1; DEC-0054 triad)
  - `scripts/data/autonomy_stop_matrix.yaml` (the `PO_CLOSURE_PRECONDITION_CONFLICT` row — single active source; no template twin)
  - `docs/engineering/autonomy-stop-matrix.md` (`10BB7CD3…A3A8DA` active==template)
  - `docs/engineering/reason_codes.md` (BUG-0034 row; `04A88D32…C1CC0DD` active==template)
  - `docs/engineering/runbook.md` (`## PO_CLOSURE_PRECONDITION_CONFLICT` no-refresh remediation; `A2F31FF5…0D4C1F` active==template)
  - `scripts/autonomy_repair_ledger_lib.py` (ledger integration; self-test OK)
- **Source + test surface (this release, re-verified MATCH + GREEN)**
  - `tests/bug0034_autonomy_stop_matrix_test.py` (active) + `template/tests/bug0034_autonomy_stop_matrix_test.py` (byte-identical `B987E9C5…F91879`) — 8 `test_bug0034_*` markers (T-004)
- **Strict-proof chain (3 leaves, all RECOMPUTED MATCH this release)**
  - execute: `rp-auto-20261007-bug0034-execute-dev-20261007T205320Z-BUG-0034` / `2CF5C9D652BAF50D3AFDF354F84222221A6C42701C9A4FE0BC356CF1DAD7785D`
  - qa: `rp-auto-20261007-bug0034-qa-20261007T205653Z-BUG-0034` / `1CF2E37AB8968FC2774C9599DC3D3942664D7450B83F7FEBB55C13E96472DD57`
  - verify-work: `rp-auto-20261007-bug0034-verify-work-qa-20261007T210517Z-BUG-0034` / `F5261785487445B04712B3395DE2BB2F8AEA85775485F44B06F1B7A6781BDDCD`
  - **own release**: `rp-auto-20261007-bug0034-release-release-20261007T212254Z-BUG-0034` / **`BE701D33414176EE582640DACFA53CCA8FFEB876822044761760543AD53F7BFB`**
- **state.md (durable phase records, append-never-rewrite)**
  - `docs/engineering/state.md` — L1137 (execute/dev) / L1149 (qa/qa) / L1161 (verify-work/qa) REPAIR #1 checkpoints + **this release checkpoint (appended at bottom)**
- **Validator + parity + compose**
  - `python scripts/bug_issue_validate.py --repo . --check-acceptance` → `[BUG_VALIDATION_OK]` exit 0 (re-ran this release; PRE + POST this release)
  - `python scripts/autonomy_repair_ledger_lib.py --self-test` → `[AUTONOMY_REPAIR_LEDGER_SELF_TEST_OK]` exit 0
  - 4/4 enforced active↔template byte-parity (matrix `.md`, reason_codes, runbook, bug0034 test)
- **`scripts/token_cost_lib.py compute_strict_proof_hash`** (deterministic canonical-payload contract; 3/3 leaves + own release RECOMPUTED MATCH this release; 2-invocation per leaf)

## Next

**`/closure`** (fresh `curator` — DEC-0052 sanctioned alternate since `qe` is not spawnable on this host) to ship the canonical BUG-0034 DONE flip: backlog `### BUG-0034` L5720 `Status: OPEN` → `Status: DONE`; backlog AC-1..AC-7 L5727-L5733 `[ ]` → `[x]`; acceptance L225 `- [ ]` → `- [x]`; **`sprints/S0167/closure-verification.md` creation**; state.md CLOSURE checkpoint (bottom append, DEC-0040 append-never-rewrite). **This release did NOT perform any of that — closure own.**

**Do NOT (release role, this session):**
- Mark BUG-0034 DONE (backlog / acceptance) — **closure owns** (US-0045 / `architecture.md:610` "Release cannot mark DONE (US-0045)")
- Tick AC-1..AC-7 (backlog L5727-L5733; acceptance L225) — **closure owns**
- Author `sprints/S0167/closure-verification.md` — **closure owns** (post-BUG-0031 curator 3-allow, DEC-0152 DENY-FIRST)
- Reopen or drain any sibling (BUG-0032/0033 OPEN; BUG-0005/0016/0022/0027/0031/0035 DONE; US-0156 DONE; US-0154/0155 OPEN; US-0119/0120/0131/0133/0143 compose; DEC-0051/0054)
- Author or amend any `decisions/DEC-*.md`
- Restore TUI / RPC / JSON command template / localhost / plugin / orchestrator surface
- npm publish / git push / `.env` read / subagent spawn / `/auto` recursion / sovereign-critic consume (CROSS_MODEL_REVIEW=0)

**Stop condition**: STOP after RELEASE_PASS. Orchestrator owns the next spawn per BUG-0006 / US-0048. `/closure` is the next phase (fresh `curator`); `/refresh-context` is optional after `/closure` (fresh `curator`; S0163/S0164 precedent).
