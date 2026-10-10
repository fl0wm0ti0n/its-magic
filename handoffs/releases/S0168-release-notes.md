# Release Notes — S0168 / BUG-0033

## Re-attestation (release2) — 2026-10-10T21:17:39Z

The first RELEASE_PASS below is retained. This re-attestation is **RELEASE_PASS**.

- **fresh_context_marker**: `release-BUG0033-20261010T211739Z-fresh`
- **orchestrator_run_id**: `auto-20261010-bug0033-release2`
- **runtime_proof_id**: `rp-auto-20261010-bug0033-release2-release-20261010T211739Z-BUG-0033`
- **proof_hash**: `8ba3e0d39bd3e8342bbe071d2488a15e4923c4aab92efd7e38e8a26715a5c132`
- **harness**: `tests/report.md` 2026-10-10T21:26:41Z Pass=879 Fail=0
- **README feature-coverage row**: shipped. BUG-0033 stays OPEN. Closure owns the DONE flip.
- **publish**: NOT PERFORMED (`npm_published=false`). **push**: NOT PERFORMED (`SYNC_POLICY_MODE=disabled`).

- **Sprint**: `S0168`
- **Bug**: `BUG-0033` — **Thin→rich command-pair parity** — the five thin OpenCode command bodies (`.opencode/commands/{closure,ask,auto,refresh-context,execute}.md`, dispatch-only per US-0125) were missing the `## Fail-safe reason codes` + `## Stop conditions` sections that their rich `.cursor/commands/*` counterparts document, so an OpenCode-surface operator could not see the same deterministic fail-closed vocabulary; the fix adds both sections to all five thin files (Stop conditions first, then Fail-safe reason codes), restores active↔template byte parity (BUG-0031 837b precedent), wires a **10-marker `test_bug0033_*`** hand-authored parity suite (active + byte-identical `template/tests/` twin) into the harness, and a scoped `--scope=bug-0033` intake-template-parity handler; **drift-DETECT + section-ADD only, NOT a DONE flip** (the OPEN→DONE flip + AC tick is the **closure** action per US-0045, not this phase)
- **Story**: (none; BUG-0033 is a **framework-kit command-parity** slice — it adds the two sections + parity test; the DONE flip + acceptance tick is the **operator / curator action at closure** per US-0045, not this phase)
- **Release date**: `2026-10-10T16:03:53Z` (UTC)
- **orchestrator_run_id**: `auto-20261010-bug0033` (parent) / `auto-20261010-bug0033-release` (this release)
- **delivery_mode**: `ultra_lean`
- **macro_phase**: `ship` (release → `/closure` (curator, DEC-0052 sanctioned alternate since `qe` unspawnable) → `/refresh-context` (optional))
- **policy_mode**: `confirm` (`RELEASE_PUBLISH_MODE=confirm`; orchestrator default-off; operator confirm absent this turn → npm publish deferred)
- **trigger_source**: `auto`
- **branch**: `local` (no push; `SYNC_POLICY_MODE=disabled`)
- **fresh_context_marker**: `release-BUG0033-20261010T160353Z-fresh` (FRESH; grep-verified 0 prior occurrences repo-wide at mint — full marker and `20261010T160353Z` time suffix; distinct from all S0168 chain markers: dev gatefix4 `dev-BUG0033-gatefix4-20261010T121507Z-fresh`, qa (re-QA) `qa-BUG0033-20261010T130901Z-fresh`, verify-work `qa-BUG0033-vw-20261010T141743Z-fresh`)
- **model_id**: `qwen3.8-27b` (CROSS_MODEL_REVIEW=0; sovereign-critic NOT consumed)
- **runtime_proof_id**: `rp-auto-20261010-bug0033-release-release-20261010T160353Z-BUG-0033`
- **proof_hash**: **`37193DDB62C9C7AB64ED86CC8EDBA2F05ECC18AEF0B25EF874A46F486848C01B`** (64 hex uppercase; canonical 6-tuple SHA-256 per DEC-0038; **2-invocation recompute MATCH by construction** (invocation 1 = `scripts.token_cost_lib.compute_strict_proof_hash`; invocation 2 = plain `hashlib.sha256(json.dumps(obj, sort_keys=True, separators=(",",":")).encode())`); 64-hex; `hash_recompute_confirmation=true`)
- **proof_issued_at**: `2026-10-10T16:03:53Z`; **proof_ttl_seconds**: `3600`; **proof_ttl**: `2026-10-10T17:03:53Z`
- **release_version**: **(none — workflow-only release; no kit semver bump; kit still `0.1.10`; this release feeds `[Unreleased]` / next kit version)**
- **npm_published**: `false`

## Verdict

**RELEASE_PASS** (first release pass for S0168 — the prior cycle's QA_FAIL B-1 gate/hygiene regression was repaired at its source by the fresh chain `auto-20261010-bug0033-{gatefix4-execute,qa2,verifywork}` (EXECUTE_PASS / QA_PASS / VERIFY_PASS, each with a fresh non-stale strict proof), and this release independently re-evaluated the complete ordered gate chain on fresh evidence). Mandatory release gates (1, 2, 3, 4, 4b) green on a **fresh independent re-run** (this release session — not the QA / verify-work word).

- **Gate 1 (check-in tests)** — live configured harness @ release:
  - `powershell -NoProfile -ExecutionPolicy Bypass -File tests/run-tests.ps1` → **exit 0**; fresh `tests/report.md` timestamp **`2026-10-10T16:12:20Z`**, **Pass: 879, Fail: 0** (0 `[FAIL]` lines repo-wide)
  - Triad hot-surface lines in-run: `[PASS] triad check passes on repo` (report L725) + `[PASS] triad check idempotent rerun passes` (report L726)
  - US-0071 metadata-guard: 10× `[PASS]` (report L713-L722)
  - Scoped BUG-0033: `python -m pytest tests/bug0033_opencode_command_parity_test.py -q` → **10 passed**, exit 0 (fresh re-run this release)
  - `python scripts/check_intake_template_parity.py --repo . --scope=bug-0033` → **`[INTAKE_TEMPLATE_PARITY_OK]`**, exit 0 (AC-6 scoped)
  - `python scripts/bug_issue_validate.py --backlog docs/product/backlog.md --check-acceptance` → **`[BUG_VALIDATION_OK]`**, exit 0 (AC-8)
  - `harness_fail_zero_claimed=false`
- **Gate 2 (qa)** — `sprints/S0168/qa-findings.md` bottom **RE-QA** record: **QA_PASS / 12 PASS / 0 FAIL** (the single previously-blocking check C8 / B-1 is now GREEN); evaluated 2026-10-10T13:45:18Z (fresh independent re-QA of the gatefix4 EXECUTE_PASS). Battery A GREEN: A1 10/10 markers, A2 6 active↔template pairs byte-identical, A3 manual spot-check of the 5 thin files (Stop-first ordering, diagnostics-only, STOP sentinel final, frontmatter preserved). D12 row confirms BUG-0033 OPEN + AC-1..AC-8 `[ ]` + acceptance L224 `[ ]` + BUG-0034 DONE `[x]` + guards held
- **Gate 3 (uat)** — `sprints/S0168/uat.md`: `uat_lifecycle=populated`, `verified_ready=true`; `sprints/S0168/uat.json`: **9/9** (UAT-1..UAT-8 = AC-1..AC-8 + US-0128 `convergence_smoke` surrogate tail, `probe_kind=contract_tests_primary`); all **6** live-runtime probe classes (`browser_smoke`, `api_health`, `process_health`, `cli_smoke`, `build`, `manual_operator`) `waived_probes[]` with `reason_code=UAT_PROBE_FORBIDDEN` — **static file-level probes only**; UAT_PROBE_FORBIDDEN held (no live CLI/TUI/browser/API/process/build/manual-operator probe)
- **Gate 4 (isolation)** — **3 distinct fresh-context checkpoints** in `docs/engineering/state.md` for `auto-20261010-bug0033-{gatefix4-execute,qa2,verifywork}` with role-aligned, never-reused markers: `dev-BUG0033-gatefix4-20261010T121507Z-fresh` (execute/dev), `qa-BUG0033-20261010T130901Z-fresh` (qa), `qa-BUG0033-vw-20261010T141743Z-fresh` (verify-work/qa). This release adds the **4th** distinct marker `release-BUG0033-20261010T160353Z-fresh` (via the state.md release checkpoint). All role-aligned (US-0069 / DEC-0051: execute=dev, qa+verify-work=qa, release=release); **CROSS_MODEL_REVIEW=0** (no sovereign-critic consume required)
- **Gate 4b (strict_runtime_proof)** — **all 3 upstream chain leaves independently RECOMPUTED MATCH this release** (via `scripts.token_cost_lib.compute_strict_proof_hash` + an independent plain `hashlib.sha256(json.dumps(obj, sort_keys=True, separators=(",",":")).encode())` over the verbatim recorded canonical 6-tuple for each leaf):
  - **execute (dev, gatefix4)** `rp-auto-20261010-bug0033-gatefix4-dev-20261010T121507Z-BUG-0033` / `3384831D55BC9F3F6609FA4BB2302C54FBB9FCCF7BCBB6A3274B6B0DAE1C5711` → **MATCH** (issued 2026-10-10T12:15:07Z, TTL→13:15:07Z)
  - **qa (qa2)** `rp-auto-20261010-bug0033-qa2-qa-20261010T130901Z-BUG-0033` / `71DBDB7D7AD60EA825D674203352AAE8DF17EA5E8AB14100A7A61D878E06F914` → **MATCH** (issued 2026-10-10T13:09:01Z, TTL→14:09:01Z)
  - **verify-work (qa)** `rp-auto-20261010-bug0033-verifywork-qa-20261010T141743Z-BUG-0033` / `86DD823ECB8EB6683BA072A883513F35CC023F812D421F124DA1ABAF22B62EB2` → **MATCH** (issued 2026-10-10T14:17:43Z, TTL→15:17:43Z)
  - **3/3 RECOMPUTED = MATCH.** **Chain consumption**: gatefix4 issued 12:15:07Z < qa2 13:09:01Z (in-TTL at qa2); qa2 TTL 14:09:01Z and gatefix4 TTL 13:15:07Z were **EXPIRED at this release's issue time 16:03:53Z** → both consumed as **integrity-verified provenance links only** (per S0166/S0167 precedent); **no stale-proof waiver** — ALL functional + harness evidence was independently re-run in THIS fresh release context (verdict rests on this context's own runs). Prior-cycle proofs (execute gatefix3, QA_FAIL `165D4C6C…76C3`, original execute) are **provenance only — NOT reused**.
  - **Own release proof**: `rp-auto-20261010-bug0033-release-release-20261010T160353Z-BUG-0033` / `37193DDB…C01B` — **2-invocation recompute MATCH by construction**; **0 prior occurrences** repo-wide (RUNTIME_PROOF_REUSED guard honored; fresh + distinct from all S0168 chain markers)

**Verdict: RELEASE_PASS** — queue S0168 → `released`; notes `handoffs/releases/S0168-release-notes.md`; backlog reconciliation **deferred to `/closure`** (US-0045 / `architecture.md:610` "Release cannot mark DONE" + post-BUG-0031 curator 3-allow flip-path, DEC-0152 DENY-FIRST); publish **deferred** (`PUBLISH_CONFIRMATION_REQUIRED; npm_published=false`); sync **not_eligible** (`SYNC_POLICY_MODE=disabled`). **No live OpenCode PASS. No fake browser PASS. No npm / git push this turn. No `.env` read. No subagent spawn. No `/auto` recursion. No sovereign-critic consume (CROSS_MODEL_REVIEW=0).**

## Summary — what BUG-0033 ships (this release)

BUG-0033 closes the **thin→rich command-pair parity** gap: the five thin OpenCode command bodies now carry the same `## Fail-safe reason codes` + `## Stop conditions` sections (Stop-first ordering) that their rich `.cursor/commands/*` counterparts already documented, so an OpenCode-surface operator sees the same deterministic fail-closed vocabulary. It is a **section-add + parity-test** slice — it does **not** perform any DONE flip or acceptance tick (that is the **closure** phase's action).

- **Section parity AC-1..AC-5 (Stop-first, diagnostics-only, STOP sentinel final, frontmatter preserved)** — the 5 thin files `.opencode/commands/{closure,ask,auto,refresh-context,execute}.md` each gain **both** headings, with `## Stop conditions` **before** `## Fail-safe reason codes` (matching the rich counterparts' ordering), diagnostics-only body text (no dispatch fragments re-introduced), the terminal STOP sentinel intact, and the existing YAML frontmatter preserved.
- **Active↔template byte parity (AC-6)** — all 5 active thin files are **byte-identical** to their `template/.opencode/commands/*` twins (BUG-0031 837b byte-parity precedent); the scoped `--scope=bug-0033` intake-template-parity check returns `[INTAKE_TEMPLATE_PARITY_OK]` exit 0; the 10-marker suite's parity markers confirm the byte pairs.
- **No US-0125/US-0126 regression (AC-7)** — US-0125 (thin dispatch-only contract) and US-0126 (reason codes / `--scope=opencode-adapter` parity) standalone suites reproduce **exactly** the documented m9 5-failure baseline (`command_inventory`, `clone_guard`, `missing_command_does_not_disable_plugin`, `auto_command_dispatch_only`, `default_host_reminder`; 5 failed / 18 passed) with **no newly-failing marker**; `test_us0126_parity_scope_opencode_adapter` GREEN; `.opencode/tui.json` `"plugin": []` active==template (BUG-0030/DEC-0151 lock, SHA prefix `c2fac9d6c3185b05`); BUG-0006/US-0048 spawn-only unchanged.
- **10-marker contract suite (AC-8)** — `tests/bug0033_opencode_command_parity_test.py` (active) + `template/tests/bug0033_opencode_command_parity_test.py` (byte-identical mirror) — **10 `test_bug0033_*` markers** (T-004 ≥8): m1..m5 confirm both `## Stop conditions` + `## Fail-safe reason codes` (Stop-first) in active + template for closure/ask/auto/refresh-context/execute (AC-1..AC-5); m6 + m7 confirm 5/5 command pairs byte-identical + the scoped parity banner (AC-6); m8 + m9 confirm the US-0125/US-0126 baseline + `tui.json` lock (AC-7); m10 confirms 0 new reason codes (AC-8 non-goal DQ5). `bug_issue_validate.py --check-acceptance` → `[BUG_VALIDATION_OK]` exit 0.

**Section-add + parity-test only, NOT a DONE flip.** BUG-0033's backlog/acceptance status remains **OPEN** (`docs/product/backlog.md ### BUG-0033` L5698 `Status: OPEN` + AC-1..AC-8 L5705-L5712 `[ ]`; `docs/product/acceptance.md` L224 `- [ ]`) — **closure owns the flip** (US-0045 / `architecture.md:610` + post-BUG-0031 curator 3-allow). The DONE flip, the AC tick, the acceptance tick, and `sprints/S0168/closure-verification.md` creation are all **closure-phase** actions, not this release's.

**Sibling composes preserved** (guard audited this session — all UNTOUCHED / carried baselines NOT weakened, NOT repaired):

- **US-0125 / US-0126** (thin dispatch-only + reason-code parity) — NOT reopened; carried baseline = the documented m9 5-failure set (5 failed / 18 passed), `test_us0126_parity_scope_opencode_adapter` GREEN — **not a regression**; NOT weakened, NOT repaired by BUG-0033
- **US-0120** (closure phase — the composition surface) — NOT reopened; compose unchanged
- **US-0156** (OpenCode `/auto` parity) — compose unchanged
- **BUG-0006 / US-0048** (spawn-only isolation) — UNMUTATED
- **BUG-0030 / DEC-0151** (`.opencode/tui.json` `"plugin": []` lock) — UNMUTATED (active==template `c2fac9d6c3185b05`)
- **BUG-0031** (byte-identical active+template precedent) — the 837b precedent it extends; NOT reopened
- **BUG-0027 / BUG-0016** (compose / inheritance) — UNTOUCHED
- **BUG-0034** (sibling, DONE) — NOT reopened; acceptance L225 `[x]` intact (3e drift=none)
- **BUG-0026 / 0028 / 0029** (OPEN) — UNTOUCHED
- **BUG-0005 / 0016 / 0022 / 0027 / 0031 / 0035** (all DONE) — NOT reopened
- **US-0154 / 0155** (OPEN) — UNMUTATED
- **US-0156** (DONE) — NOT reopened

## ACs satisfied (QA + verify-work + release re-run)

**8/8 PASS (functional slice) + DC baseline integrity PASS (this release, independent re-run)**. Backlog ACs remain `- [ ]` unchecked until `/closure` (per US-0045 / `architecture.md:610`).

| AC | Status (slice evidence, re-ran this release) |
|----|--------|
| **AC-1** — `.opencode/commands/closure.md` has `## Fail-safe reason codes` + `## Stop conditions` (closure-first) | **PASS** — marker 1 (active + template) confirms both headings, Stop-first ordering, diagnostics-only, STOP sentinel final, frontmatter preserved |
| **AC-2** — `.opencode/commands/ask.md` has both headings | **PASS** — marker 2 |
| **AC-3** — `.opencode/commands/auto.md` has both headings | **PASS** — marker 3 (note: `auto.md` is the orchestrator command; it has no *terminal* STOP sentinel by design matching its rich source + the DQ4 contract — see N-3) |
| **AC-4** — `.opencode/commands/refresh-context.md` has both headings | **PASS** — marker 4 |
| **AC-5** — `.opencode/commands/execute.md` has both headings | **PASS** — marker 5 |
| **AC-6** — active 5 thin files byte-identical to `template/.opencode/commands/*` | **PASS** — markers 6 + 7 confirm 5/5 byte pairs + `check_intake_template_parity.py --scope=bug-0033` → `[INTAKE_TEMPLATE_PARITY_OK]` exit 0 |
| **AC-7** — US-0125 / US-0126 no regression; BUG-0006/US-0048 spawn-only unchanged; `tui.json` `"plugin": []` unchanged | **PASS** — markers 8 + 9: US-0125/US-0126 standalone = exactly the documented m9 5-failure baseline (no newly-failing marker); `test_us0126_parity_scope_opencode_adapter` GREEN; `tui.json` active==template `c2fac9d6c3185b05` |
| **AC-8** — ≥8 `test_bug0033_*` markers + validator exit 0 | **PASS** — **10 markers** (active + template); `bug_issue_validate.py --check-acceptance` → `[BUG_VALIDATION_OK]` exit 0 |
| **DC** — baseline / anchor / sibling integrity | **PASS** — BUG-0033 remains **OPEN** with all ACs unchecked (closure owns the flip); siblings US-0120 / US-0125 / US-0126 / US-0156 / BUG-0006 / BUG-0030 / BUG-0031 / BUG-0034 / BUG-0026 / 0028 / 0029 / DEC-0151 **UNTOUCHED** |

## Test results (release — live this pass, independently re-run)

- **Configured harness (fresh)**: `powershell -NoProfile -ExecutionPolicy Bypass -File tests/run-tests.ps1` → **exit 0**; `tests/report.md` **`2026-10-10T16:12:20Z` Pass: 879, Fail: 0** (0 `[FAIL]` lines repo-wide; triad lines `[PASS]` report L725/L726; US-0071 metadata-guard 10× `[PASS]` report L713-L722).
- **Scoped BUG-0033 (active 10-marker, fresh re-run)**: `python -m pytest tests/bug0033_opencode_command_parity_test.py -q` → **10 passed**, exit 0 — markers: closure/ask/auto/refresh-context/execute both-headings (m1–m5), 5/5 byte-identical pairs + scoped parity banner (m6–m7), US-0125/US-0126 baseline + `tui.json` lock (m8–m9), 0 new reason codes (m10).
- **Scoped parity CLI**: `python scripts/check_intake_template_parity.py --repo . --scope=bug-0033` → **`[INTAKE_TEMPLATE_PARITY_OK]`**, exit 0.
- **Bug/acceptance validator**: `python scripts/bug_issue_validate.py --backlog docs/product/backlog.md --check-acceptance` → **`[BUG_VALIDATION_OK]`**, exit 0 (this release, independent run; AC-8).
- **Byte parity (5/5 enforced pairs, re-ran this release)**: `.opencode/commands/closure.md` == `template/.opencode/commands/closure.md`; `.opencode/commands/ask.md` == `template/.opencode/commands/ask.md`; `.opencode/commands/auto.md` == `template/.opencode/commands/auto.md`; `.opencode/commands/refresh-context.md` == `template/.opencode/commands/refresh-context.md`; `.opencode/commands/execute.md` == `template/.opencode/commands/execute.md`; `tests/bug0033_opencode_command_parity_test.py` == `template/tests/bug0033_opencode_command_parity_test.py`. **Net enforced active/template parity = 6/6 MATCH** (5 command bodies + 1 test twin).
- **Carried baselines (NOT a regression; NOT weakened; NOT repaired)**: US-0125/US-0126 standalone = exactly the documented m9 5-failure baseline (`command_inventory`, `clone_guard`, `missing_command_does_not_disable_plugin`, `auto_command_dispatch_only`, `default_host_reminder`; 5 failed / 18 passed), `test_us0126_parity_scope_opencode_adapter` GREEN.
- **Strict runtime proof (3/3 chain re-run)** — see the 4b gate table above. **3/3 RECOMPUTED = MATCH** (lib + independent `hashlib` per leaf, verbatim recorded canonical payload). **`hash_recompute_confirmation=true` by construction** for all 3 leaves + the own release proof. Consumed leaves were EXPIRED at this release's issue time → **provenance only** (no stale-proof waiver; all evidence re-run fresh here).

## Gate summary (this release, all green on a fresh independent re-run)

| Gate | Result |
|------|--------|
| check_in_tests (1) | **PASS** — fresh configured harness exit 0; `tests/report.md` `2026-10-10T16:12:20Z` **Pass: 879 / Fail: 0** (0 `[FAIL]` repo-wide; triad L725/L726 `[PASS]`; US-0071 metadata-guard 10× `[PASS]`); scoped `bug0033` 10/10 (fresh re-run) + `[INTAKE_TEMPLATE_PARITY_OK]` scoped + `[BUG_VALIDATION_OK]` exit 0; `harness_fail_zero_claimed=false`; `lint:skipped`, `typecheck:skipped` (python project) |
| qa (2) | **PASS** — `sprints/S0168/qa-findings.md` bottom RE-QA record **QA_PASS / 12 PASS / 0 FAIL** (C8 / B-1 now GREEN); 8/8 AC + DC PASS; **0 blocking**; carried US-0125/US-0126 m9 5-failure baseline NOT_WEAKENED_NOT_REPAIRED; prior-cycle QA_FAIL record preserved as history |
| uat (3) | **PASS** — `contract_tests_primary`; `verified_ready=true`; `uat_lifecycle=populated`; **9/9 total** PASS (UAT-1..UAT-8 + US-0128 `convergence_smoke` surrogate); all 6 live-runtime classes `UAT_PROBE_FORBIDDEN` (**static file-level probes only**); `live_opencode_cli_tui_pass_claimed=false`; `npm_published=false`; `git_pushed=false` |
| isolation (4) | **PASS** — **3 distinct fresh_context_markers** in `state.md` (gatefix4 execute, qa2, verify-work) for `auto-20261010-bug0033-*` + this release's **4th** marker `release-BUG0033-20261010T160353Z-fresh`; role-aligned per US-0069/DEC-0051; **CROSS_MODEL_REVIEW=0** |
| strict_runtime_proof (4b) | **PASS** — **3/3 consumed leaves RECOMPUTED MATCH this release** (lib + independent `hashlib` per leaf) + own release proof **2-invocation recompute MATCH by construction**; consumed leaves **EXPIRED at issue** (provenance only, **no stale-proof waiver**); RUNTIME_PROOF_REUSED guard honored (0 prior occurrences of own rpid; prior-cycle proofs NOT reused) |
| legacy_drift_3e | **PASS (drift=none)** — US-0049/DEC-0031 rule: backlog DONE AND (acceptance unchecked OR traceability/state entry missing OR release artifact missing). **BUG-0033 OPEN → excluded**; **BUG-0034 DONE** with acceptance L225 `[x]` + S0167 release artifact present + 3f 43/43 zero gaps → **consistent**; no `docs/engineering/legacy-drift-audit.md` entry required (no drift, no repair performed) |
| readme_feature_coverage_3f | **PASS** — `python scripts/validate_readme_feature_coverage.py --repo . --enforce` → **exit 0**, `[README_FEATURE_COVERAGE_VALIDATE_OK]`, `coverage_missing=[]`, `gaps=[]`, `coverage_total=43`, `status=PASS` (README_FEATURE_COVERAGE_ENFORCE=1 → enforced); BUG-0033 correctly **absent** from `coverage_present` while OPEN |
| project_readme_3g | **skipped** (`FRAMEWORK_KIT_REPO=1`; kit_repo_skipped=true) |
| optional_3a/3b/3c/3d | **skipped** (all scratchpad toggles `=0`: CROSS_REPO_OBSERVABILITY / COMPONENT_SCOPE_MODE / SPEC_PACK_MODE / USER_GUIDE_MODE) |
| publish | **deferred** (`RELEASE_PUBLISH_MODE=confirm`; `RELEASE_PUBLISH_AUTO_CONFIRM=0`; `PUBLISH_CONFIRMATION_REQUIRED`; `npm_published=false`; no kit semver bump) |
| sync | **not_eligible** (`SYNC_POLICY_MODE=disabled`; no git push; `reason_code=SYNC_DISABLED`) |
| version-doc (17) | **workflow-only** — no release version this turn; `[Unreleased]` path (see CHANGELOG hygiene below) |
| CHANGELOG hygiene (17d) | **updated** — `## [Unreleased]` in `CHANGELOG.md` now carries a **`### Fixed`** BUG-0033 bullet (S0168 evidence pointer + npm publish deferred note + no kit semver bump); `template/CHANGELOG.md` **UNTOUCHED** (out of scope for this workflow-only release; S0162/S0163/S0164/S0167 precedent); `python scripts/release_changelog_validate.py --repo . --enforce` disposition recorded in release-findings.md |
| backlog_reconciliation | **deferred to `/closure`** per US-0045 — no DONE flip, no AC tick, no `sprints/S0168/closure-verification.md` creation from this release |
| finalization | **PASS** — queue S0168 → `released`; notes `handoffs/releases/S0168-release-notes.md`; no kit semver bump; publish deferred |

## Run (repro this release)

```powershell
# Gate 1 — configured harness (fresh):
powershell -NoProfile -ExecutionPolicy Bypass -File tests/run-tests.ps1        # exit 0; tests/report.md 2026-10-10T16:12:20Z Pass=879 Fail=0

# Scoped BUG-0033 (active 10-marker, fresh re-run):
python -m pytest tests/bug0033_opencode_command_parity_test.py -q              # 10 passed, exit 0

# Scoped parity CLI (AC-6):
python scripts/check_intake_template_parity.py --repo . --scope=bug-0033       # [INTAKE_TEMPLATE_PARITY_OK] exit 0

# Bug/acceptance validator (AC-8):
python scripts/bug_issue_validate.py --backlog docs/product/backlog.md --check-acceptance   # [BUG_VALIDATION_OK] exit 0

# 3f — README feature coverage (enforced):
python scripts/validate_readme_feature_coverage.py --repo . --enforce          # exit 0; [README_FEATURE_COVERAGE_VALIDATE_OK] coverage_total=43 gaps=[]

# 17d — release changelog validate (step 17d; expect 3 carried legacy codes):
python scripts/release_changelog_validate.py --repo . --enforce
```

- **start_command**: `python -m pytest tests/bug0033_opencode_command_parity_test.py -q`
- **runtime_mode**: `local`
- **runtime_context_ref**: `docs/product/backlog.md ### BUG-0033` (L5695-L5715); `.opencode/commands/{closure,ask,auto,refresh-context,execute}.md` (+ `template/.opencode/commands/*` twins); `tests/bug0033_opencode_command_parity_test.py` (+ template twin); `sprints/S0168/qa-findings.md` + `sprints/S0168/verify-work-findings.md` (RE-QA / VERIFY_PASS); `sprints/S0168/uat.json` + `uat.md` (9/9 populated)

## Connect

- **service_url**: n/a (framework-kit command-parity slice; no long-running HTTP service)
- **service_port**: n/a
- **health_endpoint**: n/a — verify via the 10-marker suite (active + template) + scoped parity banner + `[BUG_VALIDATION_OK]` bridge + 6/6 byte-parity

## Verify (this release re-ran each check; do NOT trust the prior roles' word)

1. `powershell -NoProfile -ExecutionPolicy Bypass -File tests/run-tests.ps1` → **exit 0**; `tests/report.md` **2026-10-10T16:12:20Z Pass: 879, Fail: 0** (0 `[FAIL]` repo-wide; triad L725/L726 `[PASS]`; US-0071 metadata-guard 10× `[PASS]`)
2. `python -m pytest tests/bug0033_opencode_command_parity_test.py -q` → **10 passed**, exit 0 (active 10-marker, fresh re-run)
3. `python scripts/check_intake_template_parity.py --repo . --scope=bug-0033` → **`[INTAKE_TEMPLATE_PARITY_OK]`** exit 0 (AC-6)
4. `python scripts/bug_issue_validate.py --backlog docs/product/backlog.md --check-acceptance` → **`[BUG_VALIDATION_OK]`** exit 0 (AC-8)
5. 6/6 enforced byte-parity (5 command bodies + 1 test twin) — **active == template** (this release, independent re-run)
6. strict-proof chain (3 leaves) — **3/3 RECOMPUTED = MATCH** this release (lib + independent `hashlib` per leaf, verbatim recorded canonical payload); consumed leaves **EXPIRED at issue** → **provenance only**; **no stale-proof waiver** (all evidence re-run fresh here)
7. own release proof `37193DDB…C01B` — **2-invocation recompute MATCH by construction** (invocation 1 = `compute_strict_proof_hash`; invocation 2 = plain `hashlib.sha256(json.dumps(obj, sort_keys=True, separators=(",",":")).encode())`); **0 prior occurrences** of `rp-auto-20261010-bug0033-release-release-20261010T160353Z-BUG-0033` repo-wide (RUNTIME_PROOF_REUSED guard honored)
8. UAT honesty: `probe_kind=contract_tests_primary`; `verified_ready=true`; `9/9/0`; `live_opencode_cli_tui_pass_claimed=false`; `npm_published=false`; `git_pushed=false`; all 6 live-runtime classes `UAT_PROBE_FORBIDDEN` (**static file-level probes only**)
9. carried baselines: US-0125/US-0126 m9 5-failure set reproduced **unchanged** (NOT_WEAKENED_NOT_REPAIRED; not a regression); `test_us0126_parity_scope_opencode_adapter` GREEN
10. 3f README feature coverage: **PASS** (`coverage_total=43`, `gaps=[]`, `coverage_missing=[]`; BUG-0033 correctly absent while OPEN)

## Credentials

- **No inline secrets.** Kit denies `.env` reads (US-0085). This release did not read `.env`.
- **npm publish credentials**: env-reference-only (`npm publish` is deferred pending operator confirm on a real kit release; no kit semver bump this turn)
- **No API tokens required** for the verification battery (pytest + script invocations, all local)

## Known Issues

- **README feature-coverage row is shipped** (re-attestation 2026-10-10T21:17:39Z). `**BUG-0033**` is in `its_magic/README.md` (byte-identical to `template/its_magic/README.md`) under `## Commands and workflow`, and in `docs/developer/README.md` under `## Quality gates`. Affinity is `release_gate`. `has_root_coverage` and `has_dev_coverage` are true. The coverage gate omits BUG-0033 from `coverage_present` because Status is still OPEN. The DONE flip is still closure's job.
- **N-1 (US-0125/US-0126 5-failure baseline)** — the US-0125 (thin dispatch-only) / US-0126 (reason codes) standalone suites fail with the **documented m9 5-failure baseline** (`command_inventory`, `clone_guard`, `missing_command_does_not_disable_plugin`, `auto_command_dispatch_only`, `default_host_reminder`; 5 failed / 18 passed). **Out-of-harness** (not counted in the full-harness Fail=0), **unchanged**, **no newly-failing marker**; `test_us0126_parity_scope_opencode_adapter` GREEN. **NOT weakened, NOT repaired** by BUG-0033; **carried forward.** Not an S0168 regression.
- **N-2 (`docs/developer/README.md`↔`template/docs/developer/README.md` structural divergence)** — the active and template `docs/developer/README.md` are **structurally divergent** (the template lacks the active file's BUG-0024/BUG-0030 rows). **Pre-existing**, in **no** rfc/parity pair, a **candidate follow-up** for a future slice. NOT a S0168 regression; NOT weakened, NOT repaired by BUG-0033.
- **N-3 (`auto.md` no terminal STOP sentinel)** — `auto.md` (the **orchestrator** command) has **no terminal STOP sentinel** — this **matches its rich source** and the **DQ4 contract** (the orchestrator command is spawn-only by design; the 4 phase-role commands — closure/ask/refresh-context/execute — **do** carry the STOP sentinel). NOT a defect; **NOT a S0168 regression.**
- **N-4 (consumed strict proofs EXPIRED at issue)** — the two consumed upstream strict proofs (gatefix4 `3384831D…`, QA2 `71DBDB7D…`) were **EXPIRED** at this release's issue time (16:03:53Z) → consumed as **integrity-verified provenance links only** (per S0166/S0167 precedent); **all functional + harness evidence was independently re-run fresh** in this release context. **NOT a defect**; no stale-proof waiver.
- **3f README_FEATURE_COVERAGE**: PASS (re-attestation `validate_readme_feature_coverage.py --report` exit 0, `coverage_missing=[]`, `status=PASS`). The BUG-0033 row is shipped. It stays out of `coverage_present` while Status is OPEN. Closure owns the DONE flip.
- **BUG-0033 backlog/acceptance status remains OPEN** — `docs/product/backlog.md ### BUG-0033` (L5695-L5715) `Status: OPEN` + AC-1..AC-8 `[ ]`; `docs/product/acceptance.md` L224 `- [ ]`; **closure owns the flip** per US-0045 / `architecture.md:610` "Release cannot mark DONE (US-0045)" + post-BUG-0031 curator 3-allow flip-path (DEC-0152 DENY-FIRST).
- **US-0120 / US-0125 / US-0126 / US-0156** compose / carried baselines **UNMUTATED**; **BUG-0034 DONE** (not reopened, acceptance L225 `[x]` intact); **BUG-0032 / 0033 OPEN** (unmutated; 0033 = this bug); **BUG-0005/0016/0022/0027/0031/0035 DONE** (not reopened); **BUG-0026/0028/0029 OPEN** (unmutated); **US-0154/0155 OPEN** (unmutated); **US-0156 DONE** (not reopened); **BUG-0030 / DEC-0151** `tui.json` lock **UNMUTATED** — all **UNTOUCHED** by this release (sibling status scan this session; no reopens, no drains).
- `npm publish deferred` under `RELEASE_PUBLISH_MODE=confirm` (no kit semver bump this turn).
- `push_decision=not_eligible` (`SYNC_POLICY_MODE=disabled` — no git push this turn).

## Evidence refs (durable on disk)

- **Sprint artifacts**
  - `sprints/S0168/sprint.md` + `sprints/S0168/tasks.md`
  - `sprints/S0168/summary.md` (EXECUTE_PASS chain)
  - `sprints/S0168/progress.md` (per-task DONE + command / timestamp evidence; GATE LIFTED + gatefix4)
  - `sprints/S0168/plan-verify.json` (ultra_lean; status=PASS)
  - `sprints/S0168/uat.json` + `sprints/S0168/uat.md` (9/9 PASS; `verified_ready=true`; `uat_lifecycle=populated`; 6 `UAT_PROBE_FORBIDDEN` waived_probes + convergence_smoke surrogate)
  - `sprints/S0168/qa-findings.md` (bottom RE-QA QA_PASS 12/12; prior QA_FAIL B-1 preserved as history)
  - `sprints/S0168/verify-work-findings.md` (VERIFY_PASS `S0168_VERIFY_OK`; N-1..N-4 carried non-blockers)
  - **`sprints/S0168/release-findings.md` (this file's companion; RELEASE_PASS recorded)**
- **Handoffs**
  - `handoffs/dev_to_qa.md` (top: gatefix4 execute → qa handoff)
  - `handoffs/qa_to_verify_work.md` (top: qa2 QA_PASS → verify-work handoff)
  - `handoffs/verify_to_release.md` (top: verify-work → release handoff)
  - **`handoffs/release_queue.md` S0168 row → `released`** (this release, in-place update)
  - **`handoffs/release_notes.md` top entry** (this release, prepended; prior top pointer retained unaltered)
- **Anchors (durable; consumed verbatim by this release; NOT authored this phase)**
  - `docs/product/backlog.md ### BUG-0033` (L5695-L5715, `Status: OPEN`, AC-1..AC-8 `[ ]`)
  - `docs/product/acceptance.md` L224 (BUG-0033 row, `- [ ]`)
  - `.opencode/commands/{closure,ask,auto,refresh-context,execute}.md` (5 thin bodies, section-added) + `template/.opencode/commands/*` (byte-identical twins)
  - `tests/bug0033_opencode_command_parity_test.py` (active) + `template/tests/bug0033_opencode_command_parity_test.py` (byte-identical twin) — 10 `test_bug0033_*` markers
- **Strict-proof chain (3 leaves, all RECOMPUTED MATCH this release; consumed leaves EXPIRED → provenance only)**
  - execute (gatefix4): `rp-auto-20261010-bug0033-gatefix4-dev-20261010T121507Z-BUG-0033` / `3384831D55BC9F3F6609FA4BB2302C54FBB9FCCF7BCBB6A3274B6B0DAE1C5711`
  - qa (qa2): `rp-auto-20261010-bug0033-qa2-qa-20261010T130901Z-BUG-0033` / `71DBDB7D7AD60EA825D674203352AAE8DF17EA5E8AB14100A7A61D878E06F914`
  - verify-work: `rp-auto-20261010-bug0033-verifywork-qa-20261010T141743Z-BUG-0033` / `86DD823ECB8EB6683BA072A883513F35CC023F812D421F124DA1ABAF22B62EB2`
  - **own release**: `rp-auto-20261010-bug0033-release-release-20261010T160353Z-BUG-0033` / **`37193DDB62C9C7AB64ED86CC8EDBA2F05ECC18AEF0B25EF874A46F486848C01B`**
- **state.md (durable phase records, append-never-rewrite)**
  - `docs/engineering/state.md` — L1138 (gatefix4 execute/dev) / L1155 (qa2/qa) / L1167 (verify-work/qa) chain checkpoints + **this release checkpoint (appended at bottom)**
- **Validator + parity + compose**
  - `python scripts/bug_issue_validate.py --backlog docs/product/backlog.md --check-acceptance` → `[BUG_VALIDATION_OK]` exit 0 (re-ran this release)
  - `python scripts/check_intake_template_parity.py --repo . --scope=bug-0033` → `[INTAKE_TEMPLATE_PARITY_OK]` exit 0
  - `python scripts/validate_readme_feature_coverage.py --repo . --enforce` → exit 0, `coverage_total=43`, `gaps=[]` (3f)
  - 6/6 enforced active↔template byte-parity (5 command bodies + 1 test twin)
- **`scripts/token_cost_lib.py compute_strict_proof_hash`** (deterministic canonical-payload contract; 3/3 leaves + own release RECOMPUTED MATCH this release; 2-invocation per leaf)

## Next

**`/closure`** (fresh `curator` — DEC-0052 sanctioned alternate since `qe` is not spawnable on this host) to ship the canonical BUG-0033 DONE flip: backlog `### BUG-0033` L5698 `Status: OPEN` → `Status: DONE`; backlog AC-1..AC-8 L5705-L5712 `[ ]` → `[x]`; acceptance L224 `- [ ]` → `- [x]`; **`sprints/S0168/closure-verification.md` creation**; state.md CLOSURE checkpoint (bottom append, DEC-0040 append-never-rewrite). **This release did NOT perform any of that — closure own.**

**Do NOT (release role, this session):**
- Mark BUG-0033 DONE (backlog / acceptance) — **closure owns** (US-0045 / `architecture.md:610` "Release cannot mark DONE (US-0045)")
- Tick AC-1..AC-8 (backlog L5705-L5712; acceptance L224) — **closure owns**
- Author `sprints/S0168/closure-verification.md` — **closure owns** (post-BUG-0031 curator 3-allow, DEC-0152 DENY-FIRST)
- Reopen or drain any sibling (BUG-0032 OPEN; BUG-0034 DONE; BUG-0026/0028/0029 OPEN; BUG-0005/0016/0022/0027/0031/0035 DONE; US-0154/0155 OPEN; US-0156 DONE; US-0120/0125/0126/0156 compose; DEC-0151)
- Author or amend any `decisions/DEC-*.md`
- Restore TUI / RPC / JSON command template / localhost / plugin / orchestrator surface
- npm publish / git push / `.env` read / subagent spawn / `/auto` recursion / sovereign-critic consume (CROSS_MODEL_REVIEW=0)

**Stop condition**: STOP after RELEASE_PASS. Orchestrator owns the next spawn per BUG-0006 / US-0048. `/closure` is the next phase (fresh `curator`); `/refresh-context` is optional after `/closure` (fresh `curator`; S0163/S0164/S0167 precedent).
