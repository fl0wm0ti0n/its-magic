# Release Notes — S0164 / BUG-0031

- **Sprint**: `S0164`
- **Bug**: `BUG-0031` — `/closure` cannot complete on OpenCode: no spawnable closure role is authorized to write the canonical DONE-flip paths (curator 3-allow parity repair; 5 ACs)
- **Story**: (none; BUG-0031 is an **unblocker** of the `/closure` capability — it does **not** perform a closure flip, and it is **not** a DoD gate release of US-0156; US-0156 not mutated this phase)
- **Release date**: `2026-10-01T22:46:28Z` (UTC)
- **orchestrator_run_id**: `auto-20261001-bug0031`
- **delivery_mode**: `ultra_lean`
- **macro_phase**: `ship` (release → `/closure` per CROSS_MODEL_REVIEW=0 native chain)
- **policy_mode**: `confirm` (`RELEASE_PUBLISH_MODE=confirm`; orchestrator default-off; operator confirm absent this turn → npm publish deferred)
- **trigger_source**: `auto`
- **branch**: `local` (no push; `SYNC_POLICY_MODE=disabled`)
- **fresh_context_marker**: `release-BUG0031-20261001T224628Z-fresh`
- **model_id**: `qwen3.8:27b` (CROSS_MODEL_REVIEW=0)
- **runtime_proof_id**: `rp-auto-20261001-bug0031-release-release-20261001T224628Z-BUG-0031`
- **proof_hash**: `F30CED5D29017DBB20184EDAD5940A7F4088E336D27AD788959C081C2F023326`
- **proof_issued_at**: `2026-10-01T22:46:28Z`; **proof_ttl**: `2026-10-01T23:46:28Z` (ttl_seconds=3600)
- **release_version**: (none — workflow-only release; no kit semver bump; kit remains `0.1.9`)
- **npm_published**: `false`

## Verdict

**RELEASE_PASS.** Mandatory release gates (1, 2, 3, 4a, 4b) green with a **fresh independent re-run** (this release session, not the QA/verify-work word): scoped `pytest tests/bug0031_opencode_closure_flip_authz_test.py` **8/8** + compose `pytest tests/bug0027_opencode_manual_phase_persist_test.py tests/bug0016_contract_test.py` **10/10 + 7/7 = 17** + `[BUG_VALIDATION_OK]` + 3 parity scopes `[INTAKE_TEMPLATE_PARITY_OK]` + 8/8 byte-parity pairs MATCH = **25 passed / 0 failed / 0 skipped (25 tests)**. Queue row S0164 → `released`. Publish deferred (`PUBLISH_CONFIRMATION_REQUIRED`; `npm_published=false`) — **not** a release FAIL. **No backlog mutation (closure owns OPEN→DONE per US-0045).** BUG-0031 row 222 `[ ]` unchecked, US-0156 row 185 `[ ]` not mutated, BUG-0022 row 213 `[ ]` not mutated. No npm / GitHub publish this turn. No git push. No live OpenCode `/closure` PASS claimed.

Gate-1: live scoped contract @ release. **`harness_fail_zero_claimed=false`.**

## Summary

BUG-0031 UNBLOCKS the OpenCode `/closure` completion capability (R-0155 / architecture `# BUG-0031`): the repair authorizes a spawnable closure role on the canonical DONE-flip paths it was being denied — **it does not perform the flip; `/closure` (or the operator, only as a pre-repair workaround) does.**

- **Curator 3-allow delta**: `.opencode/agents/curator.md` (active) + `template/.opencode/agents/curator.md` (byte-parity twin, **837 b both**, SHA `300364FC…32B4E`) gain exactly three additive `edit:` `allow` rows — `docs/product/backlog.md`, `docs/product/acceptance.md`, `sprints/S*/closure-verification.md` — appended after `handoffs/archive/**`, before `bash: ask`. The broad `"**": deny` row is **not reordered/widened/rewritten** (DENY-FIRST, DEC-0152 last-matching-wins); `bash: ask` / `task: deny` unchanged. `state.md` was already held (no 4th row).
- **Fail-closed diagnostic contract**: new stage-precise token `CLOSURE_PERMISSION_FLIP_PATHS_DENIED` (additive to the seven `CLOSURE_*` codes — none renamed/replaced) in the rich `closure.md` pair (`## Fail-safe reason codes` table + `## Stop conditions`), `docs/engineering/runbook.md` troubleshooting row, and `docs/engineering/reason_codes.md` registration.
- **OpenCode-surface parity note** (DQ6): on OpenCode `qe` is unspawnable → sanctioned alternate is `curator`; the spawning role must be authorized on the three flip paths; otherwise fail-closed with `CLOSURE_PERMISSION_FLIP_PATHS_DENIED` — **never** an operator hand-flip.
- **Contract suite**: `tests/bug0031_opencode_closure_flip_authz_test.py` (active) + `template/…` (byte-identical mirror, **13248 b both**, SHA `1729344A…C4D241F`) — 8 `test_bug0031_*` markers, mock-injection (no live OpenCode probe). Composes with `test_bug0027_*` (10) + `test_bug0016*` (7) **unmodified**.

**This sprint UNBLOCKS, it does NOT perform, the S0163/BUG-0022 closure** (that belongs to BUG-0022's own post-fix closure cycle). It does **not** flip BUG-0031 status and does **not** tick any acceptance row (US-0045 + closure own).

FRAMEWORK_KIT_REPO=1 — UAT `contract_tests_primary`; live-host classes `UAT_PROBE_FORBIDDEN`. **No live OpenCode `/closure` PASS claimed. No operator-hand-flip. No DONE flip.**

## What's new

- BUG-0031: OpenCode `/closure` flip-path authorization repair — curator 3-allow delta (active `837 b` + template twin, byte-identical `300364FC…32B4E`), new additive `CLOSURE_PERMISSION_FLIP_PATHS_DENIED` fail-closed token (rich closure pair + runbook + reason_codes), DQ6 OpenCode-surface parity note, 8 `test_bug0031_*` markers (active + byte-identical template mirror `1729344A…C4D241F`). **Unblocks** `/closure`; does not perform a flip. Sibling suites (`test_bug0027_*` 10, `test_bug0016*` 7) unmodified; BUG-0016/0027 not reopened; DQ10 siblings untouched.

## ACs satisfied (QA + verify-work + release re-run)

**5/5 PASS** (slice evidence; backlog ACs remain unchecked until `/closure`):

| AC | Status (slice evidence) |
|----|--------|
| AC-1 | PASS — curator 3-allow delta active + template (L15/L16/L17); `"**": deny` first (L6); `bash: ask`/`task: deny` unchanged; `CLOSURE_PERMISSION_FLIP_PATHS_DENIED` composed additively; markers m1/m2/m5/m6/m7 **PASSED** (capability proven by permission-map + fail-closed contract; **live host NOT probed** — NB1) |
| AC-2 | PASS — `python scripts/bug_issue_validate.py --backlog … --check-acceptance` → `[BUG_VALIDATION_OK]` exit 0 (re-ran this release); `check_intake_template_parity.py` → `us-0120` / `model-tier` / `bug-0030` all `[INTAKE_TEMPLATE_PARITY_OK]` exit 0 |
| AC-3 | PASS — active `.opencode/agents/curator.md` == template twin == **837 b**, SHA `300364FCA7…32B4E` → PARITY-OK; marker **m3 `test_bug0031_curator_active_template_byte_parity`** PASSED |
| AC-4 | PASS — sibling integrity: `test_bug0016*` 7/7 + `test_bug0027_*` 10/10 **unmodified**; `qa.md` allow set has **none** of the 3 flip paths (negative DQ7); DENY-FIRST held; backlog `### BUG-0031` `Status: OPEN` (L5663); US-0156 `[ ]` (L185); BUG-0022 `[ ]` (L213); BUG-0016 `[x]` (L207); BUG-0027 `[x]` (L218); marker **m8 `test_bug0031_no_sibling_mutation`** PASSED |
| AC-5 | PASS — `test_bug0031_*` contract suite **8/8** (this release re-run, 1.42s) + compose `test_bug0027_*` 10 + `test_bug0016*` 7 = **25 total, 0 failed, 0 skipped** |

## Test results (release — live this pass, independently re-run)

- **Scoped contract (active)**: `python -m pytest tests/bug0031_opencode_closure_flip_authz_test.py -v` → **8 passed** (1.42s) — m1–m8.
- **Compose (regression, unmodified)**: `python -m pytest tests/bug0027_opencode_manual_phase_persist_test.py tests/bug0016_contract_test.py` → **17 passed** (0.82s) — bug0027 **10/10** + bug0016 **7/7**.
- **Total**: **25 passed / 0 failed / 0 skipped (25 tests)**.
- **Bug/acceptance validator**: `python scripts/bug_issue_validate.py --backlog docs/product/backlog.md --acceptance docs/product/acceptance.md --check-acceptance` → `[BUG_VALIDATION_OK]` exit 0.
- **Parity**: `python scripts/check_intake_template_parity.py --scope={us-0120,model-tier,bug-0030}` → `[INTAKE_TEMPLATE_PARITY_OK]` (all 3, exit 0).
- **Byte-parity (8 pairs)**: curator 837b, closure(rich) 10252b, test 13248b, runbook 263729b, reason_codes 34163b, curator.mdc 1254b (no `permission:` block), thin closure 557b (zero `CLOSURE_*`), qa.md 744b (none of 3 flip paths) — **all active == template** (independent SHA-256 + size, this release).
- **Strict runtime proof**: 3 consumed proofs (execute `4A7B8024…29835D`, qa `FA1091BF…E892`, verify-work `3E5349B5…445950`) **all independently RECOMPUTED = MATCH** (not STALE); own release proof `F30CED5D…23326` **recompute-confirmed**.

## Gate summary

| Gate | Result |
|------|--------|
| check_in_tests | **PASS** (8/8 + 10/10 + 7/7 = 25 tests; validator `[BUG_VALIDATION_OK]`; 3 parity scopes OK; 8 byte-parity pairs MATCH; `harness_fail_zero_claimed=false`) |
| qa | PASS (`qa-findings.md` QA_PASS; 5/5 ACs; 0 blocking; NF-1 ACCEPT + NF-2 carried) |
| verify_work | PASS (`verify-work-findings.md` **VERIFY_PASS** `S0164_UNBLOCK_OK`; 5/5 ACs; 25/25 tests; 8 parity pairs; no regression) |
| uat | PASS (`contract_tests_primary`; `UAT_PROBE_FORBIDDEN`; `live_opencode_closure_pass_claimed=false`; `provider_completion_claimed=false`) |
| isolation | PASS (execute + qa + verify-work + release; **distinct** `fresh_context_marker`; CROSS_MODEL_REVIEW=0; all 4 markers present + distinct in `state.md`) |
| strict_runtime_proof | **PASS** (3 consumed proofs — execute/qa/verify-work — **all independently RECOMPUTED = MATCH**, not STALE; own release proof `F30CED5D…23326` recompute-confirmed) |
| readme_feature_coverage_3f | skipped_not_enforced (not enabled this run) |
| project_readme_3g | skipped (`FRAMEWORK_KIT_REPO=1`; kit_repo_skipped=true) |
| publish | deferred (`RELEASE_PUBLISH_MODE=confirm`; `PUBLISH_CONFIRMATION_REQUIRED`; `npm_published=false`) |
| sync | not_eligible (`SYNC_POLICY_MODE=disabled`) |
| version-doc (17) | skipped_no_release_version (workflow-only; `[Unreleased]` path) |
| finalization | **PASS** (queue S0164 = `released`; backlog reconciliation deferred to `/closure` per US-0045; no kit semver bump) |

## Run

```powershell
python -m pytest tests/bug0031_opencode_closure_flip_authz_test.py -v   # Expected: 8 passed (m1–m8)
python -m pytest tests/bug0027_opencode_manual_phase_persist_test.py tests/bug0016_contract_test.py  # Expected: 17 passed (10 + 7)

python scripts/bug_issue_validate.py --backlog docs/product/backlog.md --acceptance docs/product/acceptance.md --check-acceptance  # [BUG_VALIDATION_OK] exit 0

python scripts/check_intake_template_parity.py --scope=us-0120        # [INTAKE_TEMPLATE_PARITY_OK]
python scripts/check_intake_template_parity.py --scope=model-tier     # [INTAKE_TEMPLATE_PARITY_OK]
python scripts/check_intake_template_parity.py --scope=bug-0030       # [INTAKE_TEMPLATE_PARITY_OK]

# After operator confirms publish of a kit that includes BUG-0031 (not run this release):
# its-magic --target <repo> --mode upgrade --host opencode|both
# Restart OpenCode; on a `/closure` with all phases RELEASE_PASS, the sanctioned closure
# role (curator) is now authorized on the 3 flip paths and `/closure` completes CLOSURE_PASS
# instead of CLOSURE_BLOCKED_PERMISSION_MATRIX / operator hand-flip.
```

- **start_command**: `python -m pytest tests/bug0031_opencode_closure_flip_authz_test.py -v`
- **runtime_mode**: `local`
- **runtime_context_ref**: `docs/engineering/architecture.md` `# BUG-0031`; `docs/engineering/runbook.md` (Closure troubleshooting, `CLOSURE_PERMISSION_FLIP_PATHS_DENIED`)

## Connect

- **service_url**: n/a (OpenCode agent/command/permission slice; no long-running HTTP service)
- **service_port**: n/a
- **health_endpoint**: n/a — verify via pytest contract markers m1–m8 + 3 parity scopes + `[BUG_VALIDATION_OK]`

## Verify

1. `python -m pytest tests/bug0031_opencode_closure_flip_authz_test.py -v` → 8/8 PASS (m1–m8, incl. `test_bug0031_curator_active_template_byte_parity` + `test_bug0031_no_sibling_mutation`).
2. `python -m pytest tests/bug0027_opencode_manual_phase_persist_test.py tests/bug0016_contract_test.py` → 10/10 + 7/7 PASS (composes, unmodified).
3. `python scripts/bug_issue_validate.py --backlog docs/product/backlog.md --acceptance docs/product/acceptance.md --check-acceptance` → `[BUG_VALIDATION_OK]` exit 0.
4. Parity `--scope=us-0120|model-tier|bug-0030` → all `[INTAKE_TEMPLATE_PARITY_OK]`.
5. Confirm `.opencode/agents/curator.md` (active) == `template/.opencode/agents/curator.md` are **byte-identical (837 b, `300364FC…32B4E`)**, carrying the 3 additive `allow` rows after `handoffs/archive/**`, before `bash: ask`, with `"**": deny` still first.
6. Confirm `.opencode/agents/qa.md` allow set has **none** of the 3 flip paths (negative DQ7), and `.cursor/agents/curator.mdc` has **no `permission:` block** (unchanged, 1254 b).
7. UAT honesty: `probe_kind=contract_tests_primary`; `live_opencode_closure_pass_claimed=false`; `provider_completion_claimed=false`; no live OpenCode `/closure` spawn.
8. Optional operator post-ship: upgrade kit on an OpenCode host; restart; on a full `/auto` lifecycle to RELEASE_PASS, run `/closure` and observe it completes `CLOSURE_PASS` via the sanctioned closure role (curator) on the 3 flip paths — no `CLOSURE_BLOCKED_PERMISSION_MATRIX`, no operator hand-flip.

- **expected_health_signal**: pytest bug0031 active 8/8 + compose 10/10 + 7/7; validator + 3 parity scopes silent exit 0; 8 byte-parity pairs MATCH.

## Credentials

- No inline secrets. Kit denies `.env` reads (US-0085).
- npm publish credentials: env-reference-only (`NPM_TOKEN` / operator shell profile / CI secret store) — **not** used this turn (`PUBLISH_CONFIRMATION_REQUIRED`).
- No API tokens required for contract verification.

## Known Issues

- **NB1 LIVE_OPENCODE_CLOSURE_RESIDUAL**: CI cannot prove a **live** OpenCode `/closure` host run to `CLOSURE_PASS` (mock-injection permission-map only). The AC-1 *capability* is proven by the permission-map + fail-closed contract + compose guards; end-to-end live `/closure` completion is an **operator UAT residual** post-ship. **No live OpenCode `/closure` PASS claimed. No provider-completion claim (NB1).**
- **NF-1** (carried): template-mirror `tests/bug0031_*` standalone-fails from the same `REPO_ROOT=parents[1]` in-repo convention as the BUG-0027 sibling; active copy is authoritative-green (8/8) and the template mirror is byte-identical (13248b, `1729344A…C4D241F`). Accepted as convention.
- **NF-2** (carried): pre-existing `CLOSURE_*` fail-safe-table-vs-stop-conditions asymmetry in `closure.md` — hygiene only, not introduced/mutated by this sprint.
- **3f README_FEATURE_COVERAGE**: not enforced this run; no BUG-0031 gap. Non-blocking.
- BUG-0031 backlog/acceptance status remains **OPEN** until `/closure` (closure owns the DONE flip per US-0045 / `architecture.md:610` "Release cannot mark DONE" + `architecture.md:3236-3237` (US-0045 closure-ownership) + `release.md:334-338` (Step 10) + `closure.md:14-19` (Phase responsibility: closure owns 1. status flip, 2. acceptance tick)).
- **US-0156 remains OPEN** (DoD gate = BUG-0022 + BUG-0027 DONE; BUG-0027 DONE, BUG-0022 OPEN (L213 `[ ]`); US-0156's own closure owns its release — **not mutated** this phase).
- **BUG-0022 OPEN** (acceptance L213 `[ ]`; **unblocked** by this sprint's `/closure` repair, **NOT performed** — BUG-0022's own closure cycle owns the flip).
- BUG-0016 DONE (L207 `[x]`), BUG-0027 DONE (L218 `[x]`) — **not reopened**; BUG-0023/0024/0025/0026/0028/0029/0030 unmutated.
- npm publish deferred under `RELEASE_PUBLISH_MODE=confirm` (no kit semver bump this release; kit `0.1.9`).

## Evidence refs

- `sprints/S0164/release-findings.md`
- `sprints/S0164/qa-findings.md`
- `sprints/S0164/verify-work-findings.md`
- `sprints/S0164/progress.md` (execute), `sprints/S0164/sprint.md`, `sprints/S0164/tasks.md`
- `handoffs/qa_to_verify_work.md` (PASS handoff)
- `handoffs/release_queue.md` (S0164 row)
- `docs/engineering/state.md` (S0164 execute/qa/verify-work blocks + this release block)
- `docs/engineering/architecture.md` `# BUG-0031` (L3249-3465); `:3236-3237` (US-0045 closure-ownership); `:610` ("Release cannot mark DONE"); `closure.md:14-19` (Phase responsibility); `release.md:334-338` (Step 10)
- `.opencode/agents/curator.md` + `template/.opencode/agents/curator.md` (3-allow delta, 837b, `300364FC…32B4E`)
- `.cursor/commands/closure.md` + `template/.cursor/commands/closure.md` (`CLOSURE_PERMISSION_FLIP_PATHS_DENIED` composed additively)
- `docs/engineering/runbook.md` + `reason_codes.md` (+ template twins) (token registration, byte-parity)
- `tests/bug0031_opencode_closure_flip_authz_test.py` + `template/tests/bug0031_opencode_closure_flip_authz_test.py` (8 markers, byte-identical)
- `tests/bug0027_opencode_manual_phase_persist_test.py`, `tests/bug0016_contract_test.py` (compose, unmodified)
- `scripts/token_cost_lib.py` `compute_strict_proof_hash` (independent recompute MATCH for all 3 consumed + own release)
- `docs/product/backlog.md` `### BUG-0031` (L5663 `Status: OPEN`), `docs/product/acceptance.md` L185/L207/L213/L218/L222 (guard lines unchanged)
