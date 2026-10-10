# Release Notes — S0166 / BUG-0032

- **Sprint**: `S0166`
- **Bug**: `BUG-0032` — **AUTONOMY_FLAGS_DRIFT** — drift-detect contract on `AUTONOMY_PRESET` + `AUTONOMY_STOP_POLICY` between the config baseline (`.its-magic/config.json shared.<KEY>`) and the live scratchpad (`.cursor/scratchpad.md KEY=VALUE`); runbook remediation entry; 8 `test_bug0032_*` markers; CI-always-run (both harnesses); **drift-DETECT only, not drift-FIX**
- **Story**: (none; BUG-0032 is a **contract / drift-detect** slice — it detects and fails-closed at `exit 1`; the operator live-wins sync (T-005) is an **operator action at closure** (AC-1 second branch), not this phase)
- **Release date**: `2026-10-04T23:30:00Z` (UTC)
- **orchestrator_run_id**: `auto-20261004-bug0032` (parent) / `auto-20261004-bug0032-release` (this release)
- **delivery_mode**: `ultra_lean`
- **macro_phase**: `ship` (release → `/closure` (curator, DEC-0052 sanctioned alternate) → `/refresh-context` (optional))
- **policy_mode**: `confirm` (`RELEASE_PUBLISH_MODE=confirm`; orchestrator default-off; operator confirm absent this turn → npm publish deferred)
- **trigger_source**: `auto`
- **branch**: `local` (no push; `SYNC_POLICY_MODE=disabled`)
- **fresh_context_marker**: `release-BUG0032-20261004T233000Z-fresh` (FRESH; grep-verified 0 prior occurrences repo-wide at mint; distinct from all S0166 chain markers: dev execute, qa, re-attest, verify-work 16:06Z, verify-rerun 22:52Z)
- **model_id**: `qwen3.8:27b` (CROSS_MODEL_REVIEW=0)
- **runtime_proof_id**: `rp-auto-20261004-bug0032-release-release-20261004T233000Z-BUG-0032`
- **proof_hash**: **`9FDCD4ADCFEDB7154320DD9F176DA26CCBCBCE382EA59AB75BE86E54D53FDF1E`** (64 hex uppercase; canonical 6-tuple SHA-256 per DEC-0038; **2-invocation recompute MATCH by construction** (invocation 1 = `scripts.token_cost_lib.compute_strict_proof_hash`; invocation 2 = plain `hashlib.sha256(json.dumps(obj, sort_keys=True, separators=(",",":")).encode())`); 64-hex; `hash_recompute_confirmation=true`)
- **proof_issued_at**: `2026-10-04T23:30:00Z`; **proof_ttl_seconds**: `3600`; **proof_ttl**: `2026-10-04T24:30:00Z`
- **release_version**: **(none — workflow-only release; no kit semver bump; kit already at `0.1.10` from the S0159–S0164 batch; this final feeds `[Unreleased]` / `0.1.11`)**
- **npm_published**: `false`

## Verdict

**RELEASE_PASS.** Mandatory release gates (1, 2, 3, 4a, 4b) green on a **fresh independent re-run** (this release session — not the QA / verify-work word):

- **Gate 1 (check-in tests)** — live scoped contract @ release:
  - Active 8-marker `test_bug0032_*`: **8/8 PASSED** (0.89s) — `scope_registration_parity`, `equal_fixture_exit0`, `preset_only_drift_exit1`, `policy_only_drift_exit1`, `two_key_deterministic_order`, `malformed_fail_closed`, `repo_fixture_isolation`, `us0119_security_invariants`
  - Template-twin 8-marker: **8/8 PASSED** (0.83s) — byte-identical mirror
  - 7-fixture `--scope=autonomy-flags --repo <fixture>` battery: **7/7 pass per R-0156 DQ1 spec** (identity → exit 0 + exact banner; preset-drift / policy-drift / two-key-drift → exit 1 + fixed-order `[AUTONOMY_FLAGS_DRIFT]` lines (AUTONOMY_PRESET first, then AUTONOMY_STOP_POLICY); malformed-duplicate / malformed-missing / malformed-unparseable → exit 1 fail-closed, **no success banner**) — AC-2 fully verified
  - US-0131 compose: `pytest tests/us0131_contract_test.py -q` **10/10 PASSED** (0.11s, unchanged)
  - US-0119 N-2 surface: `pytest tests/us0119_autonomy_preset_test.py -q` **8 passed, 2 failed** (non-blocking N-2 — the exact 5 pre-existing orphans carried forward; **not weakened, not repaired** — R-0156 DQ2/DQ3 forbid)
  - `bug_issue_validate.py --repo . --check-acceptance` → **`[BUG_VALIDATION_OK]` exit 0** (AC-7)
  - **4/4 active↔template byte-parity SHA-256 MATCH** (checker `EC5B24C5…58B3D5`; reason_codes `4C6F03D5…FF52BFB`; runbook `5D6D6780…CEAF7552`; bug0032 test `BD7117E5…9009B29C`)
  - Both-OS CI harness (read-verified): `run-tests.ps1` L1686-L1693 + `run-tests.sh` L1554-L1564 — **always-run, NOT changed-file filtered, fail-closed** (AC-3 verified)
  - `harness_fail_zero_claimed=false`
  - **Total active tests: 26 passed (8+8+10) + 8 passed / 2 pre-existing N-2 = 34 active passed / 2 carried NON-BLOCKING / 0 regressions**
- **Gate 2 (qa)** — `sprints/S0166/qa-findings.md` **QA_PASS** (re-attested at 16:30Z after the initial B-1 detector at 16:06Z); **7/7 AC + DC PASS**; **0 blocking**; 2 non-blocking (N-1 execute checkpoint hygiene + N-2 US-0119 pre-existing matrix-ref); canonical proof re-attested hash `936C72CB…0606C2`; **`hash_recompute_confirmation=true` by construction** (2 independent recomputations agree); **B-1 detector + repair segment both recompute-MATCH this session**
- **Gate 3 (uat)** — `sprints/S0166/uat.json` — `verdict=QA_PASS` / `verified_ready=true` / `uat_lifecycle=populated`; `total=9, passed=9, failed=0`; UAT-1..UAT-7 + convergence_smoke all PASS; **`live_opencode_cli_tui_pass_claimed=false`**; **`fake_browser_pass_claimed=false`**; **`drift_FIXED_claimed=false`**; **`npm_published=false`**; **`git_pushed=false`**; all live-host / browser / TUI classes waived `UAT_PROBE_FORBIDDEN` (BUG-0032 is a contract / drift-detect slice; no web UI, no TUI probe)
- **Gate 4 (isolation)** — **5 distinct fresh-context markers** in `docs/engineering/state.md`: dev `dev-BUG0032-execute-20261004T144000Z-fresh` (execute), qa `qa-BUG0032-qa-20261004T152000Z-fresh` (qa), re-attest `qa-BUG0032-qa-reattest-20261004T163000Z-fresh` (repair segment), verify-work `qa-BUG0032-verify-work-20261004T160600Z-fresh` (B-1 detector), verify-work re-run `qa-BUG0032-verify-work-rerun-20261004T225200Z-fresh` (VERIFY_PASS certifying B-1 repair). This release adds **6th** marker `release-BUG0032-20261004T233000Z-fresh`. All role-aligned (US-0069 / DEC-0051: execute=dev, qa+verify-work=qa, release=release, closure=curator); **CROSS_MODEL_REVIEW=0** (no sovereign-critic consume required)
- **Gate 4b (strict_runtime_proof)** — **all 7 chain leaves independently RECOMPUTED MATCH this release session** (via `scripts.token_cost_lib.compute_strict_proof_hash` + an independent plain `hashlib.sha256(json.dumps(obj, sort_keys=True, separators=(",",":")).encode())` over the verbatim recorded canonical 6-tuple for each leaf):
  - **research** `rp-auto-20261003-bug0032-research-techlead-20261003T160000Z-BUG-0032` / `A3107ED0…910AC` → **MATCH**
  - **architecture** `rp-auto-20261004-bug0032-architecture-techlead-20261004T130000Z-BUG-0032` / `2E911042…E08F` → **MATCH**
  - **execute (dev)** `rp-auto-20261004-bug0032-execute-dev-20261004T144000Z-BUG-0032` / `1FE73AAD…7DD0C2` → **MATCH**
  - **qa** `rp-auto-20261004-bug0032-qa-20261004T152000Z-BUG-0032` / **re-attested** `936C72CB…0606C2` → **MATCH** (B-1 detector isolated the earlier non-reproducing value `67A38EB7…16207`; the re-attestation segment at 16:30Z corrected the recorded hash by construction to the recompute-confirmed deterministic value; the canonical 6-tuple preserved verbatim)
  - **re-attest (repair segment)** `rp-auto-20261004-bug0032-qa-reattest-20261004T163000Z-BUG-0032` / `FF6F1590…100BA` → **MATCH**
  - **verify-work 16:06Z (B-1 detector)** `rp-auto-20261004-bug0032-verify-work-qa-20261004T160600Z-BUG-0032` / `C7DF7744…B5DED` → **MATCH** (detector's own proof intact — not mutated by the repair)
  - **verify-work re-run 22:52Z (VERIFY_PASS)** `rp-auto-20261004-bug0032-verify-work-rerun-qa-20261004T225200Z-BUG-0032` / `941A0B22…C2DBE0E` → **MATCH**
  - **7/7 RECOMPUTED = MATCH** — the strict-proof chain for S0166/BUG-0032 is **internally coherent**; the B-1 repair segment is **durable and independently reconfirmable**; the **TTL is a freshness bound, not a validity bound** on the canonical payload (per S0162/BUG-0031 + S0163/BUG-0022 closure precedence, the two substantive trust anchors — `# BUG-0032` H1 (architecture L3590-L3702) + `R-0156` (research L16040-L16070, DQ1-DQ3 LOCKED) — are **both durable and consumed verbatim** in subsequent phases)
  - **Own release proof**: `rp-auto-20261004-bug0032-release-release-20261004T233000Z-BUG-0032` / `9FDCD4AD…FDF1E` — **2-invocation recompute MATCH by construction**; **0 prior occurrences** repo-wide (RUNTIME_PROOF_REUSED guard honored; fresh + distinct from all S0166 chain markers)

**Verdict: RELEASE_PASS** — queue S0166 → `released`; notes `handoffs/releases/S0166-release-notes.md`; backlog reconciliation **deferred to `/closure`** (US-0045 / `architecture.md:610` "Release cannot mark DONE" + `architecture.md# BUG-0032` L3620 "This architecture phase performs none of that [the DONE flip]" + post-BUG-0031 curator 3-allow flip-path, DEC-0152 DENY-FIRST); publish **deferred** (`PUBLISH_CONFIRMATION_REQUIRED; npm_published=false`); sync **not_eligible** (`SYNC_POLICY_MODE=disabled`). **No live OpenCode PASS. No fake browser PASS. No toast-repair claim. No `drift_FIXED` claim (BUG-0032 is drift-DETECT only — the operator live-wins sync is T-005 at closure). No npm / GitHub / Chocolatey / Homebrew publish this turn. No git push. No `.env` read. No subagent spawn. No `/auto` recursion.**

## Summary — what BUG-0032 ships (this release)

BUG-0032 adds a **dedicated semantic drift-detect scope** to an existing checker plus its documentation / reason-code surface — **it does not perform any live-value sync** (that is the operator's action at closure).

- **New scope handler** — `scripts/check_intake_template_parity.py --scope=autonomy-flags` (active + template twin; byte-identical `EC5B24C5…58B3D5`). A **dedicated semantic** drift-gate (NOT a byte-pair `SCOPES` entry): compares exactly two autonomy keys — `AUTONOMY_PRESET` then `AUTONOMY_STOP_POLICY` — between the config baseline (`.its-magic/config.json shared.<KEY>`, JSONC) and the live scratchpad (`.cursor/scratchpad.md` `KEY=VALUE`). Both keys present exactly once and equal → **exit 0 + the exact banner `[INTAKE_TEMPLATE_PARITY_OK] scope=autonomy-flags`** (AC-2 success path). Value mismatch, missing key, duplicate assignment, or unreadable/unparseable required input → **exit 1**, one fixed-order line per affected key `AUTONOMY_FLAGS_DRIFT scope=autonomy-flags key=<KEY> config=<value-or-<missing>> scratchpad=<value-or-<missing>>` (AUTONOMY_PRESET first), **no success banner**. `--repo` redirects both inputs for fixtures; `--scope=all` invokes this semantic scope AFTER the byte-pair checks and therefore intentionally fails until the operator remediates the current live drift (**this is the shipped contract — the harness correctly asserts the success path via the identity fixture while the 8-marker suite covers drift / fail-closed**).
- **Reason-code + runbook entry (AC-6 verbatim)** — additive `AUTONOMY_FLAGS_DRIFT` row in `docs/engineering/reason_codes.md` L469 + remediation entry in `docs/engineering/runbook.md ## AUTONOMY_FLAGS_DRIFT` (L4283) documenting the **operator live-wins sync** procedure (T-005 is an **operator action at closure** — copy live scratchpad values to the config baseline, then re-run `--scope=autonomy-flags` and observe exit 0 + banner + close the BUG-0032 closure evidence). **NOT** an `autonomy_resolvable` auto-repair code in `scripts/data/autonomy_stop_matrix.yaml` — the stop-matrix registration of `AUTONOMY_FLAGS_DRIFT` is owned by **BUG-0034** (acceptance L225; R-0156 DQ2 forbids stop-matrix changes under BUG-0032). **`AUTONOMY_FLAGS_DRIFT` is ABSENT from the stop-matrix** (8,374 B unchanged — verified by me this session).
- **CI wiring (AC-3)** — mirrored BUG-0032 block **immediately after US-0131** in both `tests/run-tests.ps1` (L1686-L1693) and `tests/run-tests.sh` (L1554-L1564): run `--scope=autonomy-flags --repo <identity-fixture>` and **assert exit 0** (AC-2 success path), then `pytest tests/bug0032_autonomy_flags_drift_test.py -q` (**assert 8-marker suite passes**). **Always-run, NOT changed-file filtered** (R-0156 DQ3: "always-run CI is stronger than changed-file filtering and catches a PR touching either source").
- **Contract suite** — `tests/bug0032_autonomy_flags_drift_test.py` (active) + `template/tests/bug0032_autonomy_flags_drift_test.py` (byte-identical mirror, `BD7117E5…9009B29C`) — **8 `test_bug0032_*` markers**, mocks/fixtures only:
  - `test_bug0032_scope_registration_parity` (active↔template checker byte parity)
  - `test_bug0032_equal_fixture_exit0` (identity fixture → exit 0 + exact banner)
  - `test_bug0032_preset_only_drift_exit1` (PRESET-only drift → exit 1)
  - `test_bug0032_policy_only_drift_exit1` (POLICY-only drift → exit 1)
  - `test_bug0032_two_key_deterministic_order` (PRESET before POLICY — fixed order on a two-key drift)
  - `test_bug0032_malformed_fail_closed` (duplicate / missing / unparseable → exit 1, no success banner)
  - `test_bug0032_repo_fixture_isolation` (`--repo` fixture isolation; no source mutation)
  - `test_bug0032_us0119_security_invariants` (US-0119 `none` byte-identity + 12 per-feature flags + `security_hard n/a` + `AUTONOMY_FLAGS_DRIFT NOT in stop-matrix` + `INTAKE_AUTONOMY_MODE=0 / INTAKE_SUBAGENT_FALLBACK=deny` on the real config)
- **Fixtures** — `tests/fixtures/bug0032_autonomy_flags/{identity, preset-drift, policy-drift, two-key-drift, malformed-duplicate, malformed-missing, malformed-unparseable}` (7 fixtures; only these files carry the divergence state; no real source mutation)

**Drift-DETECT only, NOT drift-FIX.** The live values in `.cursor/scratchpad.md` (`AUTONOMY_PRESET=none`, `AUTONOMY_STOP_POLICY=block`) and the config baseline in `.its-magic/config.json` (`AUTONOMY_PRESET: full`, `AUTONOMY_STOP_POLICY: auto_repair_then_block`) are both **unchanged by this release session** (verified by me this session — 20,237 B + 36,325 B; last-write dates unchanged). The operator live-wins sync (T-005) is the operator's action at **closure** (AC-1 second branch) — recorded in `sprints/S0166/closure-verification.md` by the `/closure` phase, not by this release.

**Sibling composes preserved** (guard audited this session — all UNTOUCHED):

- **US-0119** (shipped; compose; `AUTONOMY_PRESET none=empty-expand, full=12-flags` + `security_hard n/a` + per-feature flags) — NOT reopened; marker 8 asserts the invariants green (re-ran this session: **10/10 + 8/2 pre-existing N-2** — **no regression**)
- **US-0131 / DEC-0131** (cross-host config baseline + resolver live-wins) — compose-only; 10/10 **re-ran this session unchanged**
- **US-0017** (template-drift-guard semantic-pattern precedent) — 4/4 active↔template byte-parity MATCH (re-ran this session)
- **BUG-0034** (stop-matrix registration of `PO_CLOSURE_PRECONDITION_CONFLICT`; owns the stop-matrix **sibling addition** — `AUTONOMY_FLAGS_DRIFT`'s registration is **BUG-0034's**, NOT BUG-0032's) — **UNTOUCHED**; `AUTONOMY_FLAGS_DRIFT` ABSENT from stop-matrix (8,374 B unchanged)
- **BUG-0031** (curator 3-allow flip-path; `/closure` enabled) — DONE (L222); NOT reopened; the flip-path that BUG-0032's closure will use to ship the DONE flip
- **BUG-0033** (thin/rich command-pair parity on OpenCode) — OPEN L5694; **NOT drained** (BUG-0033 owns its own closure cycle)
- **BUG-0005 / 0016 / 0022 / 0027 / 0031 / 0035** (all DONE) — NOT reopened
- **US-0156** (OpenCode `/auto` parity) — DONE (L185 `[x]`); NOT reopened
- **US-0154 / US-0155** (OpenCode `/refresh-context` parity) — OPEN; UNTOUCHED
- **Bug-0032-specific** — **DEC-0154 NOT allocated** (R-0156 verdict "no companion DEC recommended"; no `decisions/DEC-*.md` authored or amended this release); DEC-0150 / 0151 / 0152 / 0153 / 0060 / 0069 / 0038 / 0124 UNTOUCHED

## ACs satisfied (QA + verify-work + release re-run)

**7/7 PASS (functional slice) + DC baseline integrity PASS (this release, independent re-run)**. Backlog ACs remain `- [ ]` unchecked until `/closure` (per US-0045 / architecture.md:610 / `# BUG-0032` L3620).

| AC | Status (slice evidence, re-ran this release) |
|----|--------|
| **AC-1** — config / scratchpad two-key identity OR operator-decision recorded | **functional-PASS** — runbook `## AUTONOMY_FLAGS_DRIFT` (L4283) documents the operator live-wins sync (T-005); `.its-magic/config.json` (20,237 B) + `.cursor/scratchpad.md` (36,325 B) **unchanged** (drift-DETECT only, NOT drift-FIX); config L318 `AUTONOMY_PRESET=full` + L320 `AUTONOMY_STOP_POLICY=auto_repair_then_block` (baseline) vs scratchpad L639 `AUTONOMY_PRESET=none` + L640 `AUTONOMY_STOP_POLICY=block` (live) — the **operator live-wins sync decision** is the second branch (closure evidence); not the code's job. (closure will record which branch is satisfied) |
| **AC-2** — `--scope=autonomy-flags` exit 0 parity / exit 1 + reason code `AUTONOMY_FLAGS_DRIFT` | **PASS** — 7-fixture battery re-ran this release (**7/7 AC-2 spec**): identity **exit 0 + exact banner**; preset-drift **exit 1 + PRESET line**; policy-drift **exit 1 + POLICY line**; two-key-drift **exit 1 + PRESET line then POLICY line** (fixed order); malformed-duplicate **exit 1 PRESET line only, no banner**; malformed-missing **exit 1 both `<missing>`, no banner**; malformed-unparseable **exit 1 both fail-closed**. **8/8 active + 8/8 template markers PASS** (this release re-run). AC-2 fully verified. |
| **AC-3** — CI harness both OS files, fail-closed on either-file PR | **PASS** — `tests/run-tests.ps1` L1686-L1693 (identity fixture + 8-marker suite; `Assert-True` on both; **always-run NOT changed-file filtered**) + `tests/run-tests.sh` L1554-L1564 (mirrored `BUG0032_IDENTITY_PY` + `BUG0032_CONTRACT_PY`; `assert_true` × 2; **always-run**) both **read-verified this session**; positioned **immediately after US-0131** (ps1 L1680-L1684 / sh L1544-L1552) |
| **AC-4** — US-0119 `none` byte-identity + 12 flags + security-hard unchanged | **PASS** — `test_bug0032_us0119_security_invariants` (marker 8, green) + US-0119 regressions (10/10 active + 8/2 template, N-2 pre-existing, **not weakened not repaired**) + `scripts/data/autonomy_stop_matrix.yaml` **8,374 B unchanged** + `AUTONOMY_FLAGS_DRIFT ABSENT` from the stop-matrix (BUG-0034 owns; guard #3) |
| **AC-5** — `INTAKE_AUTONOMY_MODE=0` / `INTAKE_SUBAGENT_FALLBACK=deny` untouched | **PASS** — `INTAKE_AUTONOMY_MODE=0` + `INTAKE_SUBAGENT_FALLBACK=deny` both **green** in `test_bug0032_us0119_security_invariants` (marker 8) on the real `.its-magic/config.json` (L145-L146); **byte-size 20,237 B unchanged** (verified by me this release; config file last-write date 2026-09-12 — not mutated) |
| **AC-6** — runbook entry titled `AUTONOMY_FLAGS_DRIFT` (verbatim) | **PASS** — `docs/engineering/runbook.md` **`## AUTONOMY_FLAGS_DRIFT` at L4283** (read-verified this release; **byte-identical** to the template twin `5D6D6780…CEAF7552`); additive `AUTONOMY_FLAGS_DRIFT` row in `docs/engineering/reason_codes.md` L469 **byte-identical** to the template twin `4C6F03D5…FF52BFB`; **NOT in the stop-matrix** (guard #3; BUG-0034 owns) |
| **AC-7** — `bug_issue_validate.py --check-acceptance` exit 0 pre + post | **PASS** — `python scripts/bug_issue_validate.py --repo . --check-acceptance` → **`[BUG_VALIDATION_OK]` exit 0** (this release, independent run; the same command was exit 0 in execute + qa + verify-work phases too) |
| **DC** — baseline / anchor / companion / sibling integrity | **PASS** — `docs/engineering/architecture.md # BUG-0032` H1 (L3590-L3702) + `docs/engineering/research.md ## R-0156` (L16040-L16070, DQ1-DQ3 LOCKED) both present and intact; **no companion DEC** (DEC-0154 ABSENT / NOT allocated); **no `decisions/DEC-*.md` authored or amended** (guard #2) — verified by me this release; siblings `BUG-0033` (L5694 OPEN) / `BUG-0034` (L5716 OPEN) **NOT drained** (BUG-0033 owns its own closure, BUG-0034 owns the stop-matrix registration); `BUG-0005/0016/0022/0027/0031 DONE` + `BUG-0035 DONE` NOT reopened; `US-0156 DONE L185 [x]` NOT reopened; `US-0154/US-0155 OPEN L5833/L5852` UNTOUCHED; `BUG-0026/0028/0029 OPEN L5564/L5608/L5625` UNTOUCHED; `DEC-0150/0151/0152/0153 UNMUTATED`; **guard #1 (acceptance L223 `- [ ]` + backlog L5676 `Status: OPEN` + AC-1..AC-7 L5685-L5691 `- [ ]`) HOLD** |

## Test results (release — live this pass, independently re-run)

- **Scoped contract (active 8-marker)**: `python -m pytest tests/bug0032_autonomy_flags_drift_test.py -v` → **8/8 passed** (0.89s) — markers: `scope_registration_parity`, `equal_fixture_exit0`, `preset_only_drift_exit1`, `policy_only_drift_exit1`, `two_key_deterministic_order`, `malformed_fail_closed`, `repo_fixture_isolation`, `us0119_security_invariants`.
- **Scoped contract (template twin)**: `python -m pytest template/tests/bug0032_autonomy_flags_drift_test.py -v` → **8/8 passed** (0.83s) — byte-identical mirror; resolves to active repo root (`parents[1]`); same 8 markers.
- **7-fixture checker battery**: all 7 fixtures per R-0156 DQ1 spec (see AC-2 above).
- **Regression (US-0131)**: `python -m pytest tests/us0131_contract_test.py -q` → **10/10 passed** (0.11s) — unchanged baseline (compose / live-wins resolver).
- **Regression (US-0119 / N-2 surface)**: `python -m pytest tests/us0119_autonomy_preset_test.py -q` → **8 passed, 2 failed** (N-2 pre-existing — **not a regression**):
  - `test_us0119_matrix_validator_passes` — validator self-test fails with the **5 pre-existing orphans** `BUDGET_EXHAUSTED/DECISION_UNRESOLVED/KERNEL_INCOMPATIBLE/QUALITY_EVIDENCE_FAILED/RESUME_AMBIGUOUS` (exact same orphans as QA / verify-work runs)
  - `test_us0119_matrix_no_orphan_codes` — same 5 orphans
  - **NOT weakened, NOT repaired** (R-0156 DQ2/DQ3 forbid stop-matrix changes under BUG-0032; BUG-0034 owns the stop-matrix registration)
- **Total**: **34 active tests PASS (8+8+10+8) / 0 regressions / 2 pre-existing N-2 NON-BLOCKING carried** (US-0119 matrix-ref orphans, carried from QA — **not introduced by BUG-0032**).
- **Bug/acceptance validator**: `python scripts/bug_issue_validate.py --repo . --check-acceptance` → `[BUG_VALIDATION_OK]` exit 0 (this release, independent run). `--print-next-id` → **BUG-0036** (confirming BUG-0032 / 0033 / 0034 / 0035 registered in ascending order, BUG-0035 already closed this segment).
- **Parity (4 pairs, re-ran this release)**: `scripts/check_intake_template_parity.py` `EC5B24C5…58B3D5` (active==template); `docs/engineering/reason_codes.md` `4C6F03D5…FF52BFB` (active==template); `docs/engineering/runbook.md` `5D6D6780…CEAF7552` (active==template); `tests/bug0032_autonomy_flags_drift_test.py` `BD7117E5…9009B29C` (active==template).
- **Both-OS CI harness (read-verified this release)**:
  - `tests/run-tests.ps1` L1686-L1693 — `$bug0032Identity = Start-Process python … --scope=autonomy-flags --repo tests\fixtures\bug0032_autonomy_flags\identity` + `Assert-True "… (BUG-0032 / AC-2)" ($bug0032Identity.ExitCode -eq 0)`; `$bug0032Contract = Start-Process python … pytest tests\bug0032_autonomy_flags_drift_test.py -q` + `Assert-True "… (tests/bug0032_autonomy_flags_drift_test.py)" ($bug0032Contract.ExitCode -eq 0)`; **positioned after the US-0131 block (L1680-L1684); always-run (NOT changed-file filtered)**.
  - `tests/run-tests.sh` L1554-L1564 — mirror: `BUG0032_IDENTITY_PY` + `BUG0032_CONTRACT_PY` + `assert_true "… (BUG-0032 / AC-2)" "[ \"$BUG0032_IDENTITY_PY\" -eq 0 ]"` + `assert_true "… (tests/bug0032_autonomy_flags_drift_test.py)" "[ \"$BUG0032_CONTRACT_PY\" -eq 0 ]"`; **positioned after US-0131 (L1544-L1552); always-run (NOT changed-file filtered)**.
- **Strict runtime proof (7/7 chain re-run)** — see the 4b gate table above. **7/7 RECOMPUTED = MATCH** (lib + independent `hashlib` per leaf, verbatim recorded canonical payload). **`hash_recompute_confirmation=true` by construction** for all 7 leaves + the own release proof.

## Gate summary (this release, all green on a fresh independent re-run)

| Gate | Result |
|------|--------|
| check_in_tests (1) | **PASS** — 8/8 active + 8/8 template + US-0131 10/10 + US-0119 8/2 (N-2 pre-existing) + 7-fixture battery 7/7 AC-2 spec + `[BUG_VALIDATION_OK]` exit 0 + 4/4 byte-parity + both-OS CI wiring read-verified + `harness_fail_zero_claimed=false`; `lint:skipped`, `typecheck:skipped` (python project) |
| qa (2) | **PASS** — `sprints/S0166/qa-findings.md` **QA_PASS** (re-attested after B-1 repair at 16:30Z); 7/7 AC + DC PASS; 0 blocking; 2 non-blocking (N-1 execute checkpoint hygiene + N-2 US-0119 pre-existing matrix-ref) — **B-1 detector + repair segment BOTH recompute-MATCH this session**; `hash_recompute_confirmation=true` |
| uat (3) | **PASS** — `contract_tests_primary`; `verified_ready=true`; `9/9 total` PASS; `live_opencode_cli_tui_pass_claimed=false`; `fake_browser_pass_claimed=false`; `toast_repair_claimed=false`; `drift_FIXED_claimed=false`; `harness_fail_zero_claimed=false`; `npm_published=false`; `git_pushed=false`; all live-host/broker classes `UAT_PROBE_FORBIDDEN` |
| isolation (4) | **PASS** — **6 distinct fresh_context_markers** (dev execute, qa, qa-reattest, verify-work 16:06Z, verify-work rerun 22:52Z, release 23:30Z) in `state.md`; all role-aligned per US-0069/DEC-0051; **CROSS_MODEL_REVIEW=0** |
| strict_runtime_proof (4b) | **PASS** — **7/7 consumed leaves RECOMPUTED MATCH this release** (lib + independent `hashlib` per leaf) + own release proof **2-invocation recompute MATCH by construction**; RUNTIME_PROOF_REUSED guard honored (0 prior occurrences of my rpid) |
| readme_feature_coverage_3f | **skipped_not_enforced** (S0163/S0164 precedent: not enforced this run; non-blocking) |
| project_readme_3g | **skipped** (`FRAMEWORK_KIT_REPO=1`; kit_repo_skipped=true) |
| publish | **deferred** (`RELEASE_PUBLISH_MODE=confirm`; `RELEASE_PUBLISH_AUTO_CONFIRM=0`; `PUBLISH_CONFIRMATION_REQUIRED`; `npm_published=false`; no kit semver bump — kit already at `0.1.10`) |
| sync | **not_eligible** (`SYNC_POLICY_MODE=disabled`; no git push) |
| version-doc (17) | **workflow-only** — no release version this turn; `[Unreleased]` path (see CHANGELOG hygiene below) |
| CHANGELOG hygiene | **updated** — `## [Unreleased]` in `CHANGELOG.md` now carries a **`### Fixed`** heading + a **BUG-0032 bullet** (S0166 evidence pointer + npm publish deferred note + no kit semver bump); `template/CHANGELOG.md` **UNTOUCHED** (out of scope for this workflow-only release; S0162/S0163/S0164 precedent) |
| backlog_reconciliation | **deferred to `/closure`** per US-0045 — no DONE flip, no AC tick, no `sprints/S0166/closure-verification.md` creation from this release |
| finalization | **PASS** — queue S0166 → `released`; notes `handoffs/releases/S0166-release-notes.md`; no kit semver bump; publish deferred |

## Run (repro this release)

```powershell
python -m pytest tests/bug0032_autonomy_flags_drift_test.py -v          # 8/8 PASS (active 8-marker)
python -m pytest template/tests/bug0032_autonomy_flags_drift_test.py -v # 8/8 PASS (template twin, byte-identical mirror)
python -m pytest tests/us0131_contract_test.py -q                       # 10/10 PASS (compose / live-wins resolver)
python -m pytest tests/us0119_autonomy_preset_test.py -q                # 8 passed + 2 pre-existing N-2 (carried, not a regression)

# 7-fixture drift-detect battery (R-0156 DQ1):
python scripts/check_intake_template_parity.py --scope=autonomy-flags --repo tests/fixtures/bug0032_autonomy_flags/identity/            # exit 0 + [INTAKE_TEMPLATE_PARITY_OK] scope=autonomy-flags
python scripts/check_intake_template_parity.py --scope=autonomy-flags --repo tests/fixtures/bug0032_autonomy_flags/preset-drift/         # exit 1 + [AUTONOMY_FLAGS_DRIFT] … key=AUTONOMY_PRESET config=full scratchpad=none
python scripts/check_intake_template_parity.py --scope=autonomy-flags --repo tests/fixtures/bug0032_autonomy_flags/policy-drift/         # exit 1 + [AUTONOMY_FLAGS_DRIFT] … key=AUTONOMY_STOP_POLICY …
python scripts/check_intake_template_parity.py --scope=autonomy-flags --repo tests/fixtures/bug0032_autonomy_flags/two-key-drift/        # exit 1 + PRESET line → POLICY line (fixed order)
python scripts/check_intake_template_parity.py --scope=autonomy-flags --repo tests/fixtures/bug0032_autonomy_flags/malformed-duplicate/  # exit 1 + `scratchpad=<missing>` fail-closed, no banner
python scripts/check_intake_template_parity.py --scope=autonomy-flags --repo tests/fixtures/bug0032_autonomy_flags/malformed-missing/    # exit 1 + both `<missing>` fail-closed, no banner
python scripts/check_intake_template_parity.py --scope=autonomy-flags --repo tests/fixtures/bug0032_autonomy_flags/malformed-unparseable/# exit 1 + both fail-closed, no banner

python scripts/bug_issue_validate.py --repo . --check-acceptance       # [BUG_VALIDATION_OK] exit 0 (AC-7)

# 4/4 byte-parity (active == template):
Get-FileHash scripts/check_intake_template_parity.py   # EC5B24C5…58B3D5
Get-FileHash template/scripts/check_intake_template_parity.py   # EC5B24C5…58B3D5 (MATCH)
Get-FileHash docs/engineering/reason_codes.md           # 4C6F03D5…FF52BFB (MATCH)
Get-FileHash template/docs/engineering/reason_codes.md  # 4C6F03D5…FF52BFB (MATCH)
Get-FileHash docs/engineering/runbook.md                # 5D6D6780…CEAF7552 (MATCH)
Get-FileHash template/docs/engineering/runbook.md       # 5D6D6780…CEAF7552 (MATCH)
Get-FileHash tests/bug0032_autonomy_flags_drift_test.py # BD7117E5…9009B29C (MATCH)
Get-FileHash template/tests/bug0032_autonomy_flags_drift_test.py   # BD7117E5…9009B29C (MATCH)

# Both-OS CI harness (read-verified):
Get-Content tests/run-tests.ps1 | Select-Object -Skip 1685 -First 10  # L1686-L1693: $bug0032Identity + $bug0032Contract
Get-Content tests/run-tests.sh  | Select-Object -Skip 1553 -First 12  # L1554-L1564: BUG0032_IDENTITY_PY + BUG0032_CONTRACT_PY

# Operator post-ship (AT CLOSURE, not this release): live-wins sync (T-005)
#   1. Open .cursor/scratchpad.md (live — operator's canonical)
#   2. Copy the live AUTONOMY_PRESET + AUTONOMY_STOP_POLICY values into .its-magic/config.json shared.<KEY>
#   3. Re-run: python scripts/check_intake_template_parity.py --scope=autonomy-flags --repo .
#      → expect exit 0 + [INTAKE_TEMPLATE_PARITY_OK] scope=autonomy-flags
#   4. `/closure` (curator on this host, DEC-0052 sanctioned alternate) flips BUG-0032 → DONE + records the operator decision in sprints/S0166/closure-verification.md
```

- **start_command**: `python -m pytest tests/bug0032_autonomy_flags_drift_test.py -v`
- **runtime_mode**: `local`
- **runtime_context_ref**: `docs/engineering/architecture.md # BUG-0032` (L3590-L3702); `docs/engineering/runbook.md ## AUTONOMY_FLAGS_DRIFT` (L4283); `docs/engineering/reason_codes.md` L469 (BUG-0032); `sprints/S0166/qa-findings.md` + `sprints/S0166/verify-work-findings.md` (re-run section)

## Connect

- **service_url**: n/a (checker / drift-detect slice; no long-running HTTP service)
- **service_port**: n/a
- **health_endpoint**: n/a — verify via the 8-marker suite (active + template) + 7-fixture battery + both-OS CI harness (read-verified) + `[BUG_VALIDATION_OK]` bridge

## Verify (this release re-ran each check; do NOT trust the prior roles' word)

1. `python -m pytest tests/bug0032_autonomy_flags_drift_test.py -v` → **8/8 PASS** (active 8-marker)
2. `python -m pytest template/tests/bug0032_autonomy_flags_drift_test.py -v` → **8/8 PASS** (template twin; byte-identical mirror `BD7117E5…9009B29C`)
3. 7-fixture `--scope=autonomy-flags --repo <fixture>` battery → **7/7 AC-2 spec** (identity exit 0 + banner; preset / policy / two-key fixed-order; malformed-duplicate / missing / unparseable fail-closed no banner)
4. `python -m pytest tests/us0131_contract_test.py -q` → **10/10 PASS** (compose / live-wins; unchanged baseline)
5. `python -m pytest tests/us0119_autonomy_preset_test.py -q` → **8 passed + 2 pre-existing N-2** (not weakened, not repaired; BUG-0034 owns)
6. `python scripts/bug_issue_validate.py --repo . --check-acceptance` → `[BUG_VALIDATION_OK]` exit 0 (AC-7)
7. 4/4 byte-parity SHA-256 (checker, reason_codes, runbook, bug0032 test) — **active == template** (this release, independent re-run)
8. Both-OS CI harness (read-verified): `tests/run-tests.ps1` L1686-L1693 + `tests/run-tests.sh` L1554-L1564 — always-run, NOT changed-file filtered, fail-closed, **positioned immediately after US-0131**
9. strict-proof chain (7 leaves) — **7/7 RECOMPUTED = MATCH** this release (lib + independent `hashlib` per leaf, verbatim recorded canonical payload)
10. own release proof `9FDCD4AD…FDF1E` — **2-invocation recompute MATCH by construction** (invocation 1 = `compute_strict_proof_hash`; invocation 2 = plain `hashlib.sha256(json.dumps(obj, sort_keys=True, separators=(",",":")).encode())`); **0 prior occurrences** of `rp-auto-20261004-bug0032-release-release-20261004T233000Z-BUG-0032` repo-wide (RUNTIME_PROOF_REUSED guard honored)
11. UAT honesty: `probe_kind=contract_tests_primary`; `live_opencode_cli_tui_pass_claimed=false`; `fake_browser_pass_claimed=false`; `toast_repair_claimed=false`; `drift_FIXED_claimed=false`; `harness_fail_zero_claimed=false`; `npm_published=false`; `git_pushed=false`; all live-host / broker / TUI classes `UAT_PROBE_FORBIDDEN`

## Credentials

- **No inline secrets.** Kit denies `.env` reads (US-0085). This release did not read `.env`.
- **npm publish credentials**: env-reference-only (`npm publish` is deferred pending operator confirm on a real 0.1.11 kit release; no kit semver bump this turn)
- **No API tokens required** for the verification battery (pytest + script invocations, all local)

## Known Issues

- **N-1 (state.md EXECUTE_CHECKPOINT_MISSING, hygiene)** — `## Execute checkpoint — BUG-0032 / S0166` is absent from `docs/engineering/state.md`. Precedent-confirmed NON-BLOCKING by S0165/BUG-0035 + US-0156/S0162. Durable execute evidence intact in `sprints/S0166/{progress.md, summary.md, tasks.md}` + `handoffs/dev_to_qa.md` + recompute-MATCH execute proof `1FE73AAD…7DD0C2` (independently re-confirmed 2x by me this session). **Deferred to `/refresh-context` or the release queue record itself (this file).** Do NOT repair in this release role (qa/dev only surface). Non-blocking.
- **N-2 (US-0119 2 pre-existing matrix-ref failures)** — `tests/us0119_autonomy_preset_test.py::test_us0119_matrix_validator_passes` + `test_us0119_matrix_no_orphan_codes` fail with the **5 pre-existing orphans** `BUDGET_EXHAUSTED/DECISION_UNRESOLVED/KERNEL_INCOMPATIBLE/QUALITY_EVIDENCE_FAILED/RESUME_AMBIGUOUS`. **NOT weakened, NOT repaired** (R-0156 DQ2/DQ3 forbid stop-matrix changes under BUG-0032); **BUG-0034 owns** that registration. **Carried forward.** Not a S0166 regression.
- **N-3 (B-1 strict-proof attestation repair)** — the S0166 QA phase's original recorded `proof_hash=67A38EB7…16207` did NOT reproduce from its recorded canonical 6-tuple (isolated by the 16:06Z verify-work detector; detector's own proof `C7DF7744…B5DED` independently recompute-MATCH by me this session). **REPAIRED by the 16:30Z re-attestation segment** (recorded hash corrected to the recompute-confirmed deterministic value `936C72CB…0606C2`; the canonical 6-tuple preserved **verbatim**). **Independently re-confirmed** by the 22:52Z verify-work re-run and by me this release (7/7 chain recompute MATCH, including the repaired leaf). **No longer blocking; carried for audit transparency.**
- **3f README_FEATURE_COVERAGE**: not enforced this run (S0163/S0164 precedent); non-blocking.
- **BUG-0032 backlog/acceptance status remains OPEN** — `docs/product/backlog.md ### BUG-0032` (L5673-L5691) `Status: OPEN` + AC-1..AC-7 `[ ]`; `docs/product/acceptance.md L223` `- [ ]`; **closure owns the flip** per US-0045 / `architecture.md:610` "Release cannot mark DONE (US-0045)" / `# BUG-0032` L3620 "This architecture phase performs none of that [the DONE flip]" / post-BUG-0031 curator 3-allow flip-path (DEC-0152 DENY-FIRST).
- **US-0156 remains DONE** (L185 `[x]`), **US-0154 / US-0155 OPEN** (L5833/L5852 `[ ]`), **BUG-0005/0016/0022/0027/0031 DONE** (L207/L213/L218/L221/L222 `[x]`), **BUG-0026/0028/0029 OPEN** (L217/L219/L220 `[ ]`), **BUG-0033 OPEN** (L5694 `[ ]`), **BUG-0034 OPEN** (L5716 `[ ]`), **BUG-0035 DONE** (L5740) — all **UNTOUCHED** by this release (sibling status scan this session; no reopens, no drains).
- `npm publish deferred` under `RELEASE_PUBLISH_MODE=confirm` (no kit semver bump this turn; kit already at `0.1.10` from the S0159–S0164 batch).
- `push_decision=not_eligible` (`SYNC_POLICY_MODE=disabled` — no git push this turn).

## Evidence refs (durable on disk)

- **Sprint artifacts**
  - `sprints/S0166/sprint.md` + `sprints/S0166/tasks.md` (8 tasks, all `[x]` DONE)
  - `sprints/S0166/summary.md` (EXECUTE_PASS, L56; 8/8 markers + 8/8 regressions)
  - `sprints/S0166/progress.md` (per-task DONE + command / timestamp evidence)
  - `sprints/S0166/plan-verify.json` (ultra_lean merged at /qa; status=PASS; 7/7 AC surjective + DC)
  - `sprints/S0166/uat.json` + `sprints/S0166/uat.md` (9/9 PASS; `verified_ready=true`; `uat_lifecycle=populated`)
  - `sprints/S0166/qa-findings.md` (QA_PASS re-attested after B-1 repair; 7/7 AC + DC PASS; N-1 + N-2 carried)
  - `sprints/S0166/verify-work-findings.md` (B-1 detector record + re-run PASS section; 7-leaf chain recompute table; 22:52Z VERIFY_PASS)
  - **`sprints/S0166/release-findings.md` (this file; companion to these notes)**
- **Handoffs**
  - `handoffs/qa_to_verify_work.md` (top S0166 section: QA_PASS re-attested; + re-run PASS section appended)
  - `handoffs/qa_to_dev.md` (top: verify-work FAIL → dev remediation handoff; B-1 repair scope)
  - `handoffs/tl_to_dev.md` (BUG-0032 research → architecture → sprint-plan continuations)
  - `handoffs/po_to_tl.md` (BUG-0032 intake handoff)
  - `handoffs/resume_brief.md` (top pointer upserted per S0163/S0164 convention)
  - **`handoffs/release_queue.md` S0166 row → `released`** (this release, in-place update)
  - **`handoffs/release_notes.md` top entry** (this release, prepended; prior top pointer retained unaltered)
- **Anchors (durable; consumed verbatim by this release; NOT authored this phase)**
  - `docs/product/backlog.md ### BUG-0032` (L5673-L5691, `Status: OPEN`, AC-1..AC-7 `[ ]`)
  - `docs/product/acceptance.md L223` (BUG-0032 row, `- [ ]`)
  - `docs/engineering/architecture.md # BUG-0032` (L3590-L3702; A1 semantic declared-mirror drift gate; 8 seed tasks; 8 test markers; closure-ownership via post-BUG-0031 curator 3-allow)
  - `docs/engineering/research.md ## R-0156` (L16040-L16070; DQ1-DQ3 LOCKED; "No companion DEC recommended")
  - `docs/engineering/reason_codes.md L469` (additive BUG-0032 row: `AUTONOMY_FLAGS_DRIFT`)
  - `docs/engineering/runbook.md ## AUTONOMY_FLAGS_DRIFT` (L4283; AC-6 verbatim remediation entry)
  - `decisions/DEC-0150/0151/0152/0153` (compose/link; UNTOUCHED); **DEC-0154 ABSENT** (NOT allocated)
  - `scripts/data/autonomy_stop_matrix.yaml` (8,374 B unchanged; `AUTONOMY_FLAGS_DRIFT` **ABSENT** — BUG-0034 owns)
- **Source + test surface (this release, re-verified MATCH + GREEN)**
  - `scripts/check_intake_template_parity.py` (active) + `template/scripts/check_intake_template_parity.py` (byte-identical `EC5B24C5…58B3D5`) — `--scope=autonomy-flags` semantic handler (T-001)
  - `tests/bug0032_autonomy_flags_drift_test.py` (active) + `template/tests/bug0032_autonomy_flags_drift_test.py` (byte-identical `BD7117E5…9009B29C`) — 8 `test_bug0032_*` markers (T-004)
  - `tests/fixtures/bug0032_autonomy_flags/` (7 fixtures: identity / preset-drift / policy-drift / two-key-drift / malformed-duplicate / malformed-missing / malformed-unparseable)
  - `tests/run-tests.ps1 L1686-L1693` + `tests/run-tests.sh L1554-L1564` (BUG-0032 CI block after US-0131; always-run, fail-closed)
- **Strict-proof chain (7 leaves, all RECOMPUTED MATCH this release)**
  - research: `rp-auto-20261003-bug0032-research-techlead-20261003T160000Z-BUG-0032` / `A3107ED0…910AC`
  - architecture: `rp-auto-20261004-bug0032-architecture-techlead-20261004T130000Z-BUG-0032` / `2E911042…E08F`
  - execute: `rp-auto-20261004-bug0032-execute-dev-20261004T144000Z-BUG-0032` / `1FE73AAD…7DD0C2`
  - qa: `rp-auto-20261004-bug0032-qa-20261004T152000Z-BUG-0032` / `936C72CB…0606C2` (re-attested)
  - qa-reattest: `rp-auto-20261004-bug0032-qa-reattest-20261004T163000Z-BUG-0032` / `FF6F1590…100BA`
  - verify-work 16:06Z: `rp-auto-20261004-bug0032-verify-work-qa-20261004T160600Z-BUG-0032` / `C7DF7744…B5DED`
  - verify-work re-run 22:52Z: `rp-auto-20261004-bug0032-verify-work-rerun-qa-20261004T225200Z-BUG-0032` / `941A0B22…C2DBE0E`
  - **own release**: `rp-auto-20261004-bug0032-release-release-20261004T233000Z-BUG-0032` / **`9FDCD4ADCFEDB7154320DD9F176DA26CCBCBCE382EA59AB75BE86E54D53FDF1E`**
- **state.md (durable phase records, append-never-rewrite)**
  - `docs/engineering/state.md` — L3591 (research) / L3731 (architecture) / L3832 (sprint-plan) / L3880 (architecture re-run) / L4018 (qa) / L4121 (verify-work 16:06Z FAIL detector) / L4212 (QA re-attestation) / L4316 (verify-work re-run 22:52Z PASS) + **this release checkpoint (appended at bottom)**
- **Validator + parity + compose**
  - `python scripts/bug_issue_validate.py --repo . --check-acceptance` → `[BUG_VALIDATION_OK]` exit 0 (re-ran this release; PRE + POST this release)
  - `python scripts/check_intake_template_parity.py --scope=us-0131` (US-0131 baseline unchanged)
  - `python scripts/check_intake_template_parity.py --scope=autonomy-flags --repo <fixture>` (7 fixtures, all per R-0156 DQ1)
  - 4/4 active↔template byte-parity (checker, reason_codes, runbook, bug0032 test)
- **`scripts/token_cost_lib.py compute_strict_proof_hash`** (deterministic canonical-payload contract; 7/7 leaves + own release RECOMPUTED MATCH this release; 2-invocation per leaf where applicable)

## Next

**`/closure`** (fresh `curator` — DEC-0052 sanctioned alternate since `qe` is not spawnable on this host) to ship the canonical BUG-0032 DONE flip: backlog `### BUG-0032` L5676 `Status: OPEN` → `Status: DONE`; backlog AC-1..AC-7 L5685-L5691 `[ ]` → `[x]`; acceptance L223 `- [ ]` → `- [x]`; **`sprints/S0166/closure-verification.md` creation** (per AC-1: record which branch of the OR is satisfied — identity achieved **OR** operator live-wins sync decision, with the operator's explicit decision + the re-run of `--scope=autonomy-flags --repo .` returning exit 0 + banner); state.md CLOSURE checkpoint (bottom append, DEC-0040 append-never-rewrite). **This release did NOT perform any of that — closure own.**

**Do NOT (release role, this session):**
- Mark BUG-0032 DONE (backlog / acceptance) — **closure owns** (US-0045 / `architecture.md:610` "Release cannot mark DONE (US-0045)")
- Tick AC-1..AC-7 (backlog L5685-L5691; acceptance L223) — **closure owns**
- Author `sprints/S0166/closure-verification.md` — **closure owns** (post-BUG-0031 curator 3-allow, DEC-0152 DENY-FIRST)
- Register `AUTONOMY_FLAGS_DRIFT` in `scripts/data/autonomy_stop_matrix.yaml` — **BUG-0034 owns** (that token is the `PO_CLOSURE_PRECONDITION_CONFLICT` sibling registration; `AUTONOMY_FLAGS_DRIFT`'s registration is the **stop-matrix sibling-addition** owned by BUG-0034's scope under R-0156 DQ2)
- Auto-FIX the drift (config.json L317-L320; scratchpad.md L639-L640) — **operator owns** (T-005 is at closure, not this release; drift-DETECT only, NOT drift-FIX)
- Reopen any DQ10 sibling (BUG-0005/0016/0022/0027/0031/0035 DONE; US-0156 DONE; BUG-0033/0034 OPEN; US-0154/0155 OPEN; BUG-0026/0028/0029 OPEN)
- Drain BUG-0033 / BUG-0034 (each owns its own closure cycle)
- Author or amend any `decisions/DEC-*.md` (DEC-0154 NOT allocated; R-0156 "No companion DEC recommended")
- Restore TUI / RPC / JSON command template / localhost / plugin / orchestrator surface
- npm publish / git push / `.env` read / subagent spawn / `/auto` recursion / sovereign-critic consume (CROSS_MODEL_REVIEW=0)

**Stop condition**: STOP after RELEASE_PASS. Orchestrator owns the next spawn per BUG-0006 / US-0048. `/closure` is the next phase (fresh `curator`); `/refresh-context` is optional after `/closure` (fresh `curator`; S0163/S0164 precedent).
