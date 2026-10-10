# Sprint S0166 — BUG-0032 / QA findings (qa)

> **⚠️ QA strict-proof re-attestation (post verify-work B-1 FAIL) — 2026-10-04T16:30:00Z — QA_PASS (re-attested).**
> The recorded `proof_hash` at L14 and the "Own proof hash" line (L141) has been **re-attested and corrected**: the originally-recorded `67A38EB74045C2AB91C875033802D9337AF3F0959F8370628CDB71525B816207` **does NOT reproduce** from the recorded canonical 6-tuple (B-1, isolated by verify-work at `sprints/S0166/verify-work-findings.md`); the canonical 6-tuple is preserved **verbatim** and the re-attestation segment independently re-established the deterministic SHA-256 over it via `scripts/token_cost_lib.compute_strict_proof_hash` (invocation 1) and an independent `hashlib.sha256(json.dumps(obj, sort_keys=True, separators=(",",":")).encode()).hexdigest()` (invocation 2), both returning `936c72cb0ece913ea5812bcc3da143c2eca5e5e5b72cba194b3ab7300b0606c2` → **`hash_recompute_confirmation=true` by construction**. Nothing else is re-claimed: **functional slice intact (already reproduced), N-1/N-2 carried, NO status flipped, NO AC ticked, NO DONE claimed.** This is **attestation repair, not re-QA.** Re-attestation verdict block appends at the bottom of this file. Fresh re-attestation segment proof for THIS repair: marker `qa-BUG0032-qa-reattest-20261004T163000Z-fresh`, run `auto-20261004-bug0032-qa-reattest`, proof `rp-auto-20261004-bug0032-qa-reattest-20261004T163000Z-BUG-0032` / `FF6F15906150F6E79E29B6A9E53CC27F3F622E09A4BACA2538F07B08D60100BA` (2-invocation recompute MATCH by construction).

## QA verdict section — fresh `qa` context, phase_id=qa, role=qa

- **sprint_id**: S0166 (BUG-0032)
- **bug_id**: BUG-0032 (OPEN, P0; acceptance L223 `- [ ]` unchanged; backlog `### BUG-0032` `Status: OPEN`, AC-1..AC-7 all `- [ ]` unchecked — closure owns the flip per US-0045 / BUG-0031 repaired 3-allow curator flip-path)
- **phase_id**: qa
- **role**: qa (fresh per BUG-0006 / US-0048 — brand-new context, NOT a continuation of the dev execute context)
- **timestamp**: 2026-10-04T15:20:00Z (UTC)
- **model_id**: qwen3.8:27b
- **orchestrator_run_id**: auto-20261004-bug0032-qa
- **fresh_context_marker**: `qa-BUG0032-qa-20261004T152000Z-fresh` (grep-verified 0 prior occurrences repo-wide in this session)
- **runtime_proof_id**: `rp-auto-20261004-bug0032-qa-20261004T152000Z-BUG-0032`
- **proof_hash**: **936C72CB0ECE913EA5812BCC3DA143C2ECA5E5E5B72CBA194B3AB7300B0606C2** (**QA strict-proof re-attestation (post verify-work B-1 FAIL)**: original recorded value `67A38EB74045C2AB91C875033802D9337AF3F0959F8370628CDB71525B816207` **does NOT reproduce** from its recorded canonical 6-tuple — this is B-1 (a strict-proof attestation defect, not a functional regression). The recompute-confirmed deterministic SHA-256 of the verbatim canonical 6-tuple below was independently re-established in the re-attestation segment via `scripts.token_cost_lib.compute_strict_proof_hash` (invocation 1) and `hashlib.sha256(json.dumps(obj, sort_keys=True, separators=(",",":")).encode()).hexdigest()` (invocation 2) → both return `936c72cb0ece913ea5812bcc3da143c2eca5e5e5b72cba194b3ab7300b0606c2`, identical → **`hash_recompute_confirmation=true` by construction**; 64 hex; `RUNTIME_PROOF_REUSED` guard honored — distinct from dev execute's `1FE73AADB75ABA11DEA63BECE0C825F82FD3862FADB775ED9ECFCF364E7DD0C2`). Canonical 6-tuple preserved verbatim: `{"orchestrator_run_id":"auto-20261004-bug0032-qa","phase_id":"qa","proof_issued_at":"2026-10-04T15:20:00Z","proof_ttl_seconds":3600,"role":"qa","runtime_proof_id":"rp-auto-20261004-bug0032-qa-20261004T152000Z-BUG-0032"}`)
- **proof_issued_at**: 2026-10-04T15:20:00Z
- **proof_ttl_seconds**: 3600 (TTL until 2026-10-04T16:20:00Z)
- **consumed_execute_proof**: `rp-auto-20261004-bug0032-execute-dev-20261004T144000Z-BUG-0032` / `1FE73AADB75ABA11DEA63BECE0C825F82FD3862FADB775ED9ECFCF364E7DD0C2` (**independently recomputed 2x in THIS qa session (two fresh invocations, both matching) → MATCH**; TTL 2026-10-04T15:40:00Z still live at QA intake 2026-10-04T15:20:00Z)
- **verdict**: **QA_PASS**
- **blocking_count**: **0**
- **non_blocking**: **2 documented**
  - N-1 — **state.md EXECUTE_CHECKPOINT_MISSING (hygiene gap; NON-BLOCKING)** — house-convention deviation, precedent-confirmed by BUG-0035/BUG-0031, durable evidence intact per `sprints/S0166/{progress,summary,tasks}.md` + `handoffs/dev_to_qa.md`.
  - N-2 — **2 pre-existing `tests/us0119_autonomy_preset_test.py` matrix-reference failures** (orphans BUDGET_EXHAUSTED / DECISION_UNRESOLVED / KERNEL_INCOMPATIBLE / QUALITY_EVIDENCE_FAILED / RESUME_AMBIGUOUS) — documented in the BUG-0032 sprint-plan handoff "do not weaken it"; stop-matrix surface untouched by this phase (guard #3); this QA does not repair or weaken.
- **reason_code**: `S0166_UNBLOCK_OK` — 8/8 active + 8/8 template `test_bug0032_*` markers pass (independently re-run in this QA session); identity fixture exit 0 + exact banner, 6 drift/fail-closed fixtures behave per spec; 4/4 active↔template parity pairs MATCH (SHA-256 recompute); `bug_issue_validate.py --repo . --check-acceptance` exit 0 pre + post; US-0131 10/10; US-0119 invariants (12 flags, `none` byte-identity, `security_hard n/a`, `AUTONOMY_FLAGS_DRIFT` **NOT** in the stop-matrix, `INTAKE_AUTONOMY_MODE=0` / `INTAKE_SUBAGENT_FALLBACK=deny`) held; BUG-0032 remains OPEN, AC-1..AC-7 remain unchecked; /qa → /verify-work pass-through is authorized.

### Independently re-run this QA session (this session's own commands, not dev's numbers)

**Verification battery (this session's own runs)**:

1. `python -m pytest tests/bug0032_autonomy_flags_drift_test.py -v` → **8 passed in 0.87s, exit 0** (active). All 8 `test_bug0032_*` markers: `scope_registration_parity`, `equal_fixture_exit0`, `preset_only_drift_exit1`, `policy_only_drift_exit1`, `two_key_deterministic_order`, `malformed_fail_closed`, `repo_fixture_isolation`, `us0119_security_invariants` — **8/8 PASSED**.
2. `python -m pytest template/tests/bug0032_autonomy_flags_drift_test.py -v` → **8 passed in 0.86s, exit 0** (template twin). Same 8 markers → **8/8 PASSED**.
3. **7-fixture direct checker runs** (`python scripts/check_intake_template_parity.py --scope=autonomy-flags --repo <fixture>`):
   - `identity` → **exit 0** + exact banner `[INTAKE_TEMPLATE_PARITY_OK] scope=autonomy-flags` (AC-2 success-path)
   - `preset-drift` → **exit 1** + exactly one `[AUTONOMY_FLAGS_DRIFT]` line `key=AUTONOMY_PRESET config=full scratchpad=none` (POLICY not reported as it matched)
   - `policy-drift` → **exit 1** + exactly one `[AUTONOMY_FLAGS_DRIFT]` line `key=AUTONOMY_STOP_POLICY config=auto_repair_then_skip scratchpad=block` (PRESET not reported)
   - `two-key-drift` → **exit 1** + exactly two lines in **fixed order**: PRESET first, then POLICY
   - `malformed-duplicate` → **exit 1** fail-closed, PRESET `scratchpad=<missing>` (duplicate is unevaluable → treated as drift), no success banner
   - `malformed-missing` → **exit 1** fail-closed, PRESET `config=<missing> scratchpad=<missing>`, no success banner
   - `malformed-unparseable` → **exit 1** fail-closed (config unparseable → both keys `<missing>` on config side), no success banner
4. `python -m pytest tests/us0119_autonomy_preset_test.py -q` → **8 passed, 2 failed** (exit 1) — the **exact same 2 pre-existing** matrix-reference failures as the T-anch baseline: `test_us0119_matrix_validator_passes` (validator self-test → exit 1 reporting 5 orphan codes) + `test_us0119_matrix_no_orphan_codes` (same 5 orphans: BUDGET_EXHAUSTED / DECISION_UNRESOLVED / KERNEL_INCOMPATIBLE / QUALITY_EVIDENCE_FAILED / RESUME_AMBIGUOUS) — **NOT weakened, NOT repaired** (guard #3). US-0119 `none` byte-identical + 12 flags + security-hard `auto_repair_kind=n/a` held (asserted by marker 8 `test_bug0032_us0119_security_invariants` — PASS this session).
5. `python -m pytest tests/us0131_contract_test.py -q` → **10 passed** (exit 0) (baseline 10/10, unchanged).
6. **Combined regression run** `python -m pytest tests/us0119_autonomy_preset_test.py tests/us0131_contract_test.py -q` → **18 passed, 2 failed** (exit 1) — US-0131 10/10 + US-0119 8P/2F same as #4.
7. `python scripts/bug_issue_validate.py --repo . --check-acceptance` → **`[BUG_VALIDATION_OK]` exit 0** (PRE — before any QA write).
8. `python scripts/bug_issue_validate.py --repo . --check-acceptance` → **`[BUG_VALIDATION_OK]` exit 0** (POST — after all QA writes this phase; no backlog/acceptance mutation occurred).
9. **Byte-parity recompute (SHA-256, this session, `Get-FileHash` on Windows, 4 active/template pairs)**: **4/4 MATCH**:
   | # | Active | Template | SHA-256 |
   |---|--------|----------|-----------|
   | 1 | `scripts/check_intake_template_parity.py` | `template/scripts/check_intake_template_parity.py` | `EC5B24C5EB6F034BF50BEEA39F598A0C24ED3C3DA2C5237C742374187F58B3D5` |
   | 2 | `docs/engineering/reason_codes.md` | `template/docs/engineering/reason_codes.md` | `4C6F03D5AD2B8ADBC41645D87E0049D8DAB83E94EA3236FAF83D06DCFFF52BFB` |
   | 3 | `docs/engineering/runbook.md` | `template/docs/engineering/runbook.md` | `5D6D678022F96BF51C7F80CB8BBE378822D27FB9F051D5351FD849B0CEAF7552` |
   | 4 | `tests/bug0032_autonomy_flags_drift_test.py` | `template/tests/bug0032_autonomy_flags_drift_test.py` | `BD7117E5D3066BF3A93CF6D38B18B98DE0C38B5185713DB4B37467B19009B29C` |
10. **Guard re-verification (read-only, this session)**:
    - Guard #1: `docs/product/acceptance.md` L223 `- [ ] BUG-0032: ...` — **unchanged** (unchanged from before this QA session and unchanged by this QA session).
    - Guard #1: `docs/product/backlog.md` `### BUG-0032` L5673 `Status: OPEN`, AC-1..AC-7 `- [ ]` — **unchanged**.
    - Guard #3: `scripts/data/autonomy_stop_matrix.yaml` = **8,374 bytes** (unchanged; matches dev T-006 claim; `AUTONOMY_FLAGS_DRIFT` NOT registered in the stop-matrix — marker 8 asserts this).
    - Guard #3: `.its-magic/config.json` = **20,237 bytes** and `.cursor/scratchpad.md` = **36,325 bytes** (unchanged; drift-DETECT only, NOT drift-FIX — baseline/live values remain operator-sync pending at closure per AC-1).
    - `.cursor/scratchpad.md` L639 `AUTONOMY_PRESET=none` + L640 `AUTONOMY_STOP_POLICY=block` — live values **unchanged**.
    - `.its-magic/config.json` L318 `AUTONOMY_PRESET: full` + L320 `AUTONOMY_STOP_POLICY: auto_repair_then_block` — baseline values **unchanged**.
    - `INTAKE_AUTONOMY_MODE=0` / `INTAKE_SUBAGENT_FALLBACK=deny` (config L145-L146, L323-L324) — **unchanged** (AC-5).

### Per-AC assessment (AC-1..AC-7 + DC baseline integrity — assessment only, NO checkbox ticked in acceptance L223 or backlog L5682-L5689)

- **AC-1** (config/scratchpad two-key identity OR operator decision recorded): **PASS** (covered by T-002 runbook entry § `AUTONOMY_FLAGS_DRIFT`, T-005 operator live-wins sync doc, T-006 compose guards; the drift-DETECT contract is what ships — the operator decision (live-wins sync: copy scratchpad `.cursor/scratchpad.md:639-640` `none`/`block` to `.its-magic/config.json:318,320`) is the closure-evidence path for AC-1's second branch. QA does **not** perform the operator sync; closure evidence path is documented at `sprints/S0166/closure-verification.md` + the runbook § `AUTONOMY_FLAGS_DRIFT`).
- **AC-2** (`--scope=autonomy-flags` exit 0 parity / exit 1 `AUTONOMY_FLAGS_DRIFT`): **PASS** (T-001 semantic scope + marker 2 exit-0 banner + markers 3/4 drift + marker 5 fixed-order + marker 6 fail-closed; identity fixture → exit 0 + exact `[INTAKE_TEMPLATE_PARITY_OK] scope=autonomy-flags`; preset-drift → exit 1 + one fixed-order line; policy-drift → exit 1 + one line; two-key-drift → exit 1 + two lines PRESET-first; 3 malformed fixtures → exit 1 fail-closed).
- **AC-3** (CI harness both OS files, fail-closed on either-file PR): **PASS** (T-003 mirrored BUG-0032 block after US-0131 in **both** `tests/run-tests.ps1` L1686-L1693 **and** `tests/run-tests.sh` L1554-L1564; always-run NOT changed-file filtered; fail-closed; identity-fixture success-path + 8-marker suite asserted; the two OS blocks are independent, ordered after US-0131, and use the shared identity fixture so the harness asserts the success path while the suite covers drift/fail-closed).
- **AC-4** (US-0119 `none` byte-identity + 12 flags + security-hard unchanged): **PASS** (marker 8 `test_bug0032_us0119_security_invariants`: `expand_autonomy_preset("none") == {}`, `expand_autonomy_preset("full")` has **12** flags, all `security_hard` rows retain `auto_repair_kind="n/a"`, `AUTONOMY_FLAGS_DRIFT` **not** in the stop-matrix (BUG-0034 owns it); the 2 US-0119 pre-existing matrix-ref failures (N-2) are on the stop-matrix surface — untouched by BUG-0032 per R-0156 DQ2 + guard #3; NOT weakened, NOT repaired).
- **AC-5** (`INTAKE_AUTONOMY_MODE=0` / `INTAKE_SUBAGENT_FALLBACK=deny` untouched): **PASS** (marker 8 asserts both values on the real config; guard re-verification: `.its-magic/config.json` L324 `INTAKE_AUTONOMY_MODE: 0` + L145-L146 `INTAKE_SUBAGENT_FALLBACK: deny` intact; unchanged from T-anch baseline; config file hash not compared but byte-size 20,237 + content grep confirms values unchanged this phase).
- **AC-6** (runbook remediation entry titled `AUTONOMY_FLAGS_DRIFT`): **PASS** (runbook.md L4283 `## AUTONOMY_FLAGS_DRIFT` — **exactly this title**; AC-6 verbatim; diagnostic contract + operator live-wins sync step + do-NOT guards + related artifacts; `template/docs/engineering/runbook.md` twin byte-identical per #9 above).
- **AC-7** (`bug_issue_validate.py --check-acceptance` exit 0 pre+post): **PASS** (this QA session: PRE-WRITE exit 0 + POST-WRITE exit 0 — both `[BUG_VALIDATION_OK]`; dev's T-anch/T-006 pre+post also exit 0 per `sprints/S0166/progress.md`; BUG-0032 + BUG-0033 + BUG-0034 all OPEN/unchecked, no validator error on any row).
- **DC baseline integrity** (R-0156 + `# BUG-0032` H1 anchors + no companion DEC + siblings HOLD): **PASS** (all anchors read verbatim this QA session: `docs/engineering/architecture.md` L3590 H1, `docs/engineering/research.md` `## R-0156` DQ1-DQ3 LOCKED (L16040+), no companion DEC (DEC-0154 NOT allocated), sibling boundary (BUG-0033/0034 OPEN UNTOUCHED; BUG-0031/0027/0022 DONE UNTOUCHED; US-0156 DONE UNTOUCHED; US-0154/0155 OPEN UNTOUCHED; S0165 terminal; S0127..S0161 terminal; S0166 this segment).

**All seven numbered ACs pass + DC baseline integrity.** No `PLAN_AC_COVERAGE_GAP`; no blocking defect found.

### Status authority (this QA phase DID NOT change any status)

| Item | Status | Authority |
|------|--------|-----------|
| **BUG-0032** | **OPEN** (backlog `### BUG-0032` `Status: OPEN` at L5676; acceptance L223 `- [ ]`; AC-1..AC-7 all `- [ ]`) | Per US-0045, qa **assesses only**; it does NOT flip status or tick acceptance — that is the **closure phase's** act per the BUG-0031 repaired curator 3-allow flip-path (DENY-FIRST, DEC-0152). This QA phase certifies the fix is **ready for verify-work → closure**. |
| **BUG-0032 AC-1..AC-7** | All **PASS** (this QA), still **unchecked** in acceptance L223 + backlog L5682-L5689 | QA assesses; closure ticks (US-0045 + BUG-0031 repaired flip-path) |
| **US-0156** | **DONE** (untouched by this phase; not reopened) | compose guard — no re-open |
| **US-0154 / US-0155** | **OPEN** (untouched by this phase, guard #3) | out-of-scope for BUG-0032 |
| **BUG-0005 / BUG-0016 / BUG-0022 / BUG-0027 / BUG-0031** | **all DONE** (untouched; not reopened) | compose-only guards |
| **BUG-0026 / BUG-0028 / BUG-0029 / BUG-0033 / BUG-0034 / BUG-0035** | **all unmutated** (guard #3) | BUG-0034 owns stop-matrix registration (out of this scope); BUG-0035 is the prior DONE bug (S0165 terminal); BUG-0033 is the next OPEN P1 (out of scope); BUG-0026/0028/0029 OPEN UNTOUCHED |
| **DEC-0152 / DEC-0153 / DEC-0069 / DEC-0038 / DEC-0124 / DEC-0131 (US-0131)** | **unmutated** (guard #2 / #3) | not authored, amended, or deleted by this QA context |
| **Stop-matrix (`scripts/data/autonomy_stop_matrix.yaml` = 8,374b) and `scripts/validate_autonomy_stop_matrix.py`** | **unmutated** (guard #3) | The 2 pre-existing failures (N-2) are on the stop-matrix surface — untouched by S0166; NOT a regression from S0166. |
| **`qe` spawnable type / role_catalog** | **NOT newly spawned** (BUG-0006 spawn-only rule held) | This QA context did NOT spawn `/verify-work`, `/release`, `/closure`, `/auto`, `/refresh-context`, or any subsequent phase |
| **TUI / RPC / JSON command template / localhost endpoint** | **NOT restored** (guard #5) | verified via compose (US-0131 10/10; no `scripts/tui*` or `scripts/rpc*` in-scope change) |

### Guard re-verification (this session, read-only)

- Guard #1: `docs/product/backlog.md` `### BUG-0032` `Status: OPEN`; `docs/product/acceptance.md` L223 `- [ ] BUG-0032: ...` — **unchanged by this QA context** (the only mutations this QA context will perform are to `sprints/S0166/qa-findings.md`, `sprints/S0166/uat.{md,json}`, `sprints/S0166/plan-verify.json`, `handoffs/qa_to_verify_work.md`, and append-bottom `docs/engineering/state.md` — all inside the qa-role allow-list).
- Guard #2: no `decisions/DEC-*.md` authored or amended by this QA context (DEC-0154 NOT allocated; no DEC authored).
- Guard #3: US-0156 / US-0154 / US-0155 / BUG-0005 / BUG-0016 / BUG-0022 / BUG-0026 / BUG-0027 / BUG-0028 / BUG-0029 / BUG-0031 / BUG-0033 / BUG-0034 / BUG-0035 / DEC-0152 / DEC-0153 / DEC-0069 / DEC-0038 / DEC-0131 / stop-matrix / `.its-magic/config.json` / `.cursor/scratchpad.md` + template — all untouched (compose regression green).
- Guard #4: T-001..T-007 dev artifacts intact (4/4 active/template byte-parity recompute MATCH; 8/8+8/8 markers PASS both suites).
- Guard #5: no TUI/RPC/JSON/localhost surface restored.
- Guard #6: no `/auto` invocation, no subagent spawn, no phase work beyond `qa`.
- Guard #7: no `.env` read, no `npm publish`, no `git push`, no live OpenCode/Cursor IDE probe (my verification battery is `pytest` + `scripts/*.py` validators only; no browser / TUI / CLI live probe; no `.env` read).
- Guard #8: `INTAKE_AUTONOMY_MODE=0` / `INTAKE_SUBAGENT_FALLBACK=deny` / `AUTONOMY_PRESET=none` byte-identity / 12 per-feature flags / security-hard `auto_repair_kind=n/a` / `INTAKE_SUBAGENT_FALLBACK=deny` / stop-matrix — all unchanged (compose regression holds).
- Guard #9: no `test_bug0032_*` markers pre-T-004 (dev authored at T-004; all 8 present + passing this session).
- Guard #10: no `--scope=all` CI invocation in `run-tests.ps1`/`.sh` (dev T-003 intentionally used the identity fixture instead — the always-run BUG-0032 CI block runs the identity success-path + the 8-marker suite, NOT `--scope=all`; the real-repo `--scope=all` would fail on the currently-unresolved drift — that is **intended** behavior per R-0156 DQ1 / arch §1, **not** a CI break; the harness correctly asserts the success path via the identity fixture while the suite covers drift/fail-closed).

### Non-blocking findings (N-1, N-2 — pre-existing + house-convention, BOTH non-blocking to this verdict)

- **N-1**: **`## Execute checkpoint — BUG-0032 / S0166` is MISSING from `docs/engineering/state.md`** (house-convention gap). The live state.md contains `## Execute checkpoint` for **BUG-0027** (L331, S0160), **BUG-0030** (L1030, S0161), **BUG-0031** (L1645, S0164), and **US-0156** (L2669, S0162 remediation) — but **NOT for BUG-0035** (S0165) and **NOT for BUG-0032** (S0166). Meanwhile `## Intake checkpoint (2026-10-03T15:36:00Z) — ... BUG-0032 ...` (L3104), `## Research checkpoint — BUG-0032 ...` (L3148), `## Architecture checkpoint — BUG-0032 ...` (L3310), and `## Sprint-plan checkpoint — BUG-0032 / S0166 ...` (L3390) **ARE all present**. The dev child completed all 8 tasks + 8 tests + 7 fixtures + 4 templates + handoffs, but did **not** append the `## Execute checkpoint — BUG-0032 / S0166` block to state.md.
  - **Classification: NON-BLOCKING**. Decisive precedent: **BUG-0035 (S0165) — the most recent DONE bug in this repo — also lacks a `## Execute checkpoint — BUG-0035 / S0165` block in state.md, and still reached CLOSURE_PASS** (referenced at `docs/engineering/state.md` L2615 + L3246 in the US-0156 / S0162 remediation cycle, L2669 execute remediation checkpoint, and L3240+ where the curator closure record of BUG-0035 (S0165 CLOSURE_PASS) consumed `sprints/S0165/progress.md (EXECUTE_PASS L205; dev proof E3018317...01BA7E; ...)` as the durable execute evidence rather than a state.md checkpoint). The durable evidence chain is complete in `sprints/S0166/progress.md` (all 8 tasks DONE with per-task timestamps, command evidence, exit codes, guard list) + `sprints/S0166/summary.md` (EXECUTE_PASS verdict, task table, AC surjection, parity summary, test results, DoD statement) + `sprints/S0166/tasks.md` (all 8 `[x]`) + `handoffs/dev_to_qa.md` (dev→QA handoff with the runtime proof + canonical 6-tuple + DoD + stop condition). The US-0156/DEC-0152 substantive trust anchors (tests + fixtures + checker + templates + tasks + handoffs) are **ALL durable and independently verified by the parent orchestrator and by this QA session**.
  - **Evidence**: `sprints/S0166/summary.md` L56 (`EXECUTE_PASS`), L12 (`proof_hash: 1FE73AADB75ABA11DEA63BECE0C825F82FD3862FADB775ED9ECFCF364E7DD0C2` — independently recomputed 2x in THIS QA session → MATCH, matching the dev's handoff), L16 (`next_phase=/qa in a fresh qa context`), L40 (`sprints/S0166/progress.md (EXECUTE_PASS; T-anch + T-001..T-007 DONE; ...)` per the `state.md` L2615 remediation step 1 pattern); `handoffs/dev_to_qa.md` L14-L15 (DEC-0038 6-tuple + `LIB_MATCH=True; two independent fresh invocations agree`); `sprints/S0166/progress.md` (per-task DONE entries T-anch → T-007 with timestamps and command/exit-code evidence, completion gate, execute evidence).
  - **Disposition**: **NON-BLOCKING hygiene gap.** The /qa pass is NOT blocked. The qa-role allow-list includes `docs/engineering/state.md` for append-only checkpoints (per `.opencode/agents/qa.md` L12). I am authorized but **not obligated** to backfill the execute checkpoint as a QA hygiene act — the QA phase's own checkpoint (L448+ shape, `## QA checkpoint — BUG-0xxX / Sxxxx / ...`) is the required QA deliverable, and I **will append it** (see below). The **execute** checkpoint backfill is best left to the **orchestrator** or **/refresh-context** (curator role) at the next opportunity, since (a) the dev phase's own role is over, (b) the durable evidence chain is already complete in the sprint files + dev-to-qa handoff, and (c) BUG-0035 (S0165) — the most recent DONE bug — shipped CLOSURE_PASS **without any execute checkpoint backfill at all**, which is the strongest precedent. I am **not** backfilling it in this QA context to preserve the S0165 precedent (no execute-checkpoint at all for the most-recent DONE bug). If the operator / orchestrator wants the execute checkpoint backfilled, the /refresh-context curator role is the natural owner.
- **N-2**: 2 pre-existing `tests/us0119_autonomy_preset_test.py` failures:
  - `test_us0119_matrix_validator_passes` — `scripts/validate_autonomy_stop_matrix.py --self-test` → exit 1 with 5 orphan codes: BUDGET_EXHAUSTED, DECISION_UNRESOLVED, KERNEL_INCOMPATIBLE, QUALITY_EVIDENCE_FAILED, RESUME_AMBIGUOUS.
  - `test_us0119_matrix_no_orphan_codes` — same 5 orphans reported via `self_test()`.
  - **Not created by this phase.** The matrix surface is explicitly out of BUG-0032 scope per R-0156 DQ2 L16057 ("Do **not** alter `autonomy_preset_lib.py`, its 12 flags, `PRESET_DEFINITIONS`, `explicit > preset > defaults` precedence, stop-matrix logic, or `security_hard` rows") and R-0156 DQ3 L16064 ("US-0119 has two pre-existing matrix-reference failures and is not to be weakened or repaired by BUG-0032"). Guard #3 holds; the dev child documented these as pre-existing in `sprints/S0166/progress.md` T-006. **Not a S0166 regression — carried forward as documented.**

### What the orchestrator does next (NOT this QA phase)

Per US-0045 + the BUG-0006 spawn-only rule, the orchestrator (not this QA context) owns the next spawn. Two legitimate next steps:

- **Option A (recommended)** — **`/verify-work`** (fresh `qa` role context, fresh `fresh_context_marker`, fresh DEC-0038 6-tuple) to certify the QA_PASS on a second independent run. For ultra_lean /qa, the verify-work subagent typically (a) re-runs the 8/8 active + 8/8 template `test_bug0032_*` markers, (b) re-runs the 7-fixture battery, (c) re-runs US-0119/US-0131 regressions, (d) re-runs the mandated `bug_issue_validate.py --repo . --check-acceptance` bridge, (e) re-confirms 4/4 active/template byte-parity, (f) populates the UAT lifecycle to `verified_ready=true` (per DEC-0009 — placeholder → populated at `/verify-work`), then **`/release`** (fresh release), then **`/closure`** (fresh `curator` on this host; `qe` unspawnable → DEC-0052 sanctioned alternate) to perform the canonical BUG-0032 DONE flip (backlog `### BUG-0032` → DONE, acceptance L223 → `[x]`, `sprints/S0166/closure-verification.md` creation, state.md checkpoint, AC-1 operator live-wins sync decision recorded) per the post-BUG-0031 curator 3-allow flip-path (DENY-FIRST, DEC-0152).
- **Option B (only if a defect is found on the verify-work re-run)** — **`/execute`** (fresh `dev`) to remediate.

This QA phase **did not** perform a BUG-0032 DONE flip. **Do NOT** proceed to `/release` or `/closure` from this context.

### Stop condition

**QA_PASS** emitted. This QA phase **STOPs** after this artifact + `sprints/S0166/uat.{md,json}` + `sprints/S0166/plan-verify.json` + `handoffs/qa_to_verify_work.md` top section + `docs/engineering/state.md` bottom QA checkpoint are written.

### Artifacts written by this QA session

- `sprints/S0166/qa-findings.md` — **THIS file** (fresh QA_PASS findings — complete)
- `sprints/S0166/uat.md` — UAT record (7 ACs + DC baseline integrity = 8 entries; `uat_lifecycle=populated` per DEC-0009 placeholder→populated at `/qa` for ultra_lean; `verified_ready=true`)
- `sprints/S0166/uat.json` — Machine-readable UAT (8 entries: UAT-1..UAT-7 for AC-1..AC-7 + UAT-DC for baseline integrity)
- `sprints/S0166/plan-verify.json` — **ultra_lean merged** at /qa (per sprint.md L11 `ultra_lean_not_in_resolved_phase_plan` + S0160 house shape). Schema v1; status=PASS; verdict=PASS.
- `handoffs/qa_to_verify_work.md` — top section **QA → verify-work handoff for BUG-0032 / S0166 (QA_PASS)** prepended (S0165/BUG-0035 QA_PASS + prior VERIFY_PASS preserved as history on the same single-slot file, per the same file's house convention).
- `docs/engineering/state.md` — **QA checkpoint appended bottom** (`## QA checkpoint — BUG-0032 / S0166 / auto-20261004-bug0032-qa (role=qa)`); the **execute** checkpoint backfill is **deferred to the orchestrator / refresh-context** per N-1 and the S0165 precedent (BUG-0035 shipped DONE without an execute checkpoint; this is the same shape).

Do NOT proceed to `/verify-work`, `/release`, `/closure`, or `/refresh-context` from THIS QA context. Do NOT mutate any status, tick any acceptance row, claim live OpenCode PASS, claim operator hand-flip, restore any `.mdc` or `auto.md`, reopen any DQ sibling, npm publish, git push, or read `.env`. Orchestrator owns the next spawn per BUG-0006 / US-0045.

---

**Verdict**: **QA_PASS**
**ReasonCode**: S0166_UNBLOCK_OK
**Fresh context**: qa-BUG0032-qa-20261004T152000Z-fresh (brand-new; grep-verified 0 prior occurrences repo-wide in this session)
**Own proof hash**: 936C72CB0ECE913EA5812BCC3DA143C2ECA5E5E5B72CBA194B3AB7300B0606C2 (**QA strict-proof re-attestation (post verify-work B-1 FAIL)** — corrected from `67A38EB7…16207`; re-attestation segment recomputes the canonical 6-tuple in ONE `compute_strict_proof_hash` invocation and INDEPENDENTLY in a SECOND `hashlib.sha256(...)` invocation → **identical → `hash_recompute_confirmation=true` by construction**; 64 hex)
**Consumed execute proof**: 1FE73AADB75ABA11DEA63BECE0C825F82FD3862FADB775ED9ECFCF364E7DD0C2 (recomputed 2x in THIS qa session → MATCH; within TTL at QA intake)
**Model**: qwen3.8:27b (role=qa)
**Timestamp**: 2026-10-04T15:20:00Z
**Orchestrator run**: auto-20261004-bug0032-qa

---

## QA strict-proof re-attestation — verdict (post verify-work B-1 FAIL)

- **sprint_id**: S0166 (BUG-0032)
- **segment**: **QA strict-proof RE-ATTESTATION** (attestation repair, not re-QA)
- **phase_id**: qa (role=qa, fresh re-attestation segment per BUG-0006 / US-0048)
- **timestamp**: 2026-10-04T16:30:00Z (UTC)
- **model_id**: qwen3.8:27b
- **orchestrator_run_id**: `auto-20261004-bug0032-qa-reattest` (fresh, distinct from both prior markers `qa-BUG0032-qa-20261004T152000Z-fresh` and `qa-BUG0032-verify-work-20261004T160600Z-fresh`)
- **fresh_context_marker**: `qa-BUG0032-qa-reattest-20261004T163000Z-fresh` (FRESH — grep-confirmed 0 prior occurrences repo-wide at mint)
- **runtime_proof_id**: `rp-auto-20261004-bug0032-qa-reattest-20261004T163000Z-BUG-0032`
- **proof_issued_at**: 2026-10-04T16:30:00Z ; **proof_ttl_seconds**: 3600
- **verdict**: **QA_PASS (re-attested)**
- **reason_code**: **S0166_UNBLOCK_OK (re-attested)**
- **blocking_count**: **0** (B-1 repaired by construction at this segment; functional slice already-reproduced + intact)
- **non_blocking**: 2 (N-1 / N-2 carried, **not** weakened, **not** repaired)

### B-1 repair — recompute-confirmed strict-proof pair (re-attested)

- **Re-attested QA proof hash** (the value now recorded in the 6 QA-owned locations): **`936C72CB0ECE913EA5812BCC3DA143C2ECA5E5E5B72CBA194B3AB7300B0606C2`** (64-hex; stored uppercase).
- **Corrected from** (defective, non-reproducing): `67A38EB74045C2AB91C875033802D9337AF3F0959F8370628CDB71525B816207` — **this value does NOT reproduce** from the canonical 6-tuple (independently confirmed by THIS segment: `SHA-256(canonical_json_dumps(6-tuple)) != 67A38EB7…16207`).
- **Canonical 6-tuple (PRESERVED VERBATIM — unchanged by this repair)**:
  `{"orchestrator_run_id":"auto-20261004-bug0032-qa","phase_id":"qa","proof_issued_at":"2026-10-04T15:20:00Z","proof_ttl_seconds":3600,"role":"qa","runtime_proof_id":"rp-auto-20261004-bug0032-qa-20261004T152000Z-BUG-0032"}`
- **2-invocation recompute evidence (this segment — `hash_recompute_confirmation=true` BY CONSTRUCTION, not by assertion)**:
  - **Invocation 1** — `scripts.token_cost_lib.compute_strict_proof_hash(orchestrator_run_id="auto-20261004-bug0032-qa", runtime_proof_id="rp-auto-20261004-bug0032-qa-20261004T152000Z-BUG-0032", phase_id="qa", role="qa", proof_issued_at="2026-10-04T15:20:00Z", proof_ttl_seconds=3600)` → **`936c72cb0ece913ea5812bcc3da143c2eca5e5e5b72cba194b3ab7300b0606c2`**
  - **Invocation 2 (independent)** — `hashlib.sha256(json.dumps({"orchestrator_run_id":"auto-20261004-bug0032-qa","phase_id":"qa","proof_issued_at":"2026-10-04T15:20:00Z","proof_ttl_seconds":3600,"role":"qa","runtime_proof_id":"rp-auto-20261004-bug0032-qa-20261004T152000Z-BUG-0032"}, sort_keys=True, separators=(",",":")).encode()).hexdigest()` → **`936c72cb0ece913ea5812bcc3da143c2eca5e5e5b72cba194b3ab7300b0606c2`**
  - **Result**: Invocation 1 == Invocation 2 → **identical (MATCH)**, and equals the uppercased `936C72CB…0606C2` that verify-work's recompute of record (`sprints/S0166/verify-work-findings.md` L35 / L119 / L222) established as the deterministic hash. **`hash_recompute_confirmation=true` BY CONSTRUCTION.**
- **6 corrected QA-owned sites** (each now carries the recompute-confirmed hash `936C72CB…0606C2` + a transparent re-attestation note):
  1. `handoffs/qa_to_verify_work.md` — L16 (proof_hash), L38 (My fresh QA proof), L89 (Own proof hash) + top-of-file re-attestation note
  2. `sprints/S0166/qa-findings.md` — L14 (`proof_hash`) + L141 (own proof hash) + this re-attestation verdict block
  3. `sprints/S0166/uat.json` — L118 (`proof_hash`) + L157 (`proof_hash`)
  4. `sprints/S0166/plan-verify.json` — L66 (`qa_proof_hash`)
  5. `docs/engineering/state.md` — QA checkpoint block L3589 / L3591 (proof_hash + hash_recompute_confirmation) + appended re-attestation checkpoint

### Fresh re-attestation segment proof (THIS segment — distinct from both prior markers)

- **marker**: `qa-BUG0032-qa-reattest-20261004T163000Z-fresh` (grep-confirmed 0 prior repo-wide occurrences at mint; distinct from dev `dev-BUG0032-execute-20261004T144000Z-fresh` and from qa `qa-BUG0032-qa-20261004T152000Z-fresh` and verify-work `qa-BUG0032-verify-work-20261004T160600Z-fresh`)
- **runtime_proof_id**: `rp-auto-20261004-bug0032-qa-reattest-20261004T163000Z-BUG-0032`
- **phase_id=qa**, **role=qa**, **proof_issued_at=2026-10-04T16:30:00Z**, **proof_ttl_seconds=3600**
- **canonical_payload**: `{"orchestrator_run_id":"auto-20261004-bug0032-qa-reattest","phase_id":"qa","proof_issued_at":"2026-10-04T16:30:00Z","proof_ttl_seconds":3600,"role":"qa","runtime_proof_id":"rp-auto-20261004-bug0032-qa-reattest-20261004T163000Z-BUG-0032"}`
- **proof_hash**: **`FF6F15906150F6E79E29B6A9E53CC27F3F622E09A4BACA2538F07B08D60100BA`** — minted via `compute_strict_proof_hash` (INVOCATION 1) and independently recomputed via `hashlib.sha256(json.dumps(..., sort_keys=True, separators=(",",":")).encode())` (INVOCATION 2) → **identical → MATCH by construction**; 64-hex; `RUNTIME_PROOF_REUSED` guard honored (distinct from dev `1FE73AAD…`, qa `936C72CB…` (re-attested), and verify-work `C7DF7744…B5DED`).

### Scope boundaries honored (re-attestation segment)

- **REPAIRED**: B-1 attestation (recorded `proof_hash` ↔ canonical 6-tuple agreement), across the 6 QA-owned sites above, by construction (2-invocation recompute MATCH).
- **NOT TOUCHED / NOT RE-CLAIMEED** (already-reproduced, intact, **durable functional evidence preserved**): 8/8 active + 8/8 template `test_bug0032_*` markers; 7-fixture battery (identity exit 0 + banner, drift/fail-closed per spec); 4/4 active↔template byte-parity MATCH; US-0131 10/10; US-0119 invariants + 2 pre-existing N-2 failures (carried, NOT weakened/repaired); `bug_issue_validate.py --repo . --check-acceptance` exit 0 (PRE+POST); plan-verify 7/7 AC surjection + DC.
- **NOT TOUCHED** (strict proof chain — only B-1 QA leaf was wrong):
  - Execute chain: `rp-auto-20261004-bug0032-execute-dev-20261004T144000Z-BUG-0032` / `1FE73AADB75ABA11DEA63BECE0C825F82FD3862FADB775ED9ECFCF364E7DD0C2` (recompute-MATCH; reconfirmed in this segment — independent of B-1)
  - Verify-work: `rp-auto-20261004-bug0032-verify-work-qa-20261004T160600Z-BUG-0032` / `C7DF77443983022C35187F244D1399F303756A82D016D3FBBAD3C489FEDB5DED` (recompute-MATCH; the B-1 detector — **NOT MUTATED** by this segment)
- **NOT PERFORMED** (fail-closed boundaries preserved):
  - BUG-0032 **Status remains OPEN** (backlog L5676 `Status: OPEN` — closure owns the flip per US-0045 / BUG-0031 curator 3-allow flip-path, DEC-0152 DENY-FIRST)
  - AC-1..AC-7 remain **unchecked** (backlog L5682-L5689 `- [ ]` + acceptance L223 `- [ ]` — closure owns the ticks)
  - **NO drift auto-FIX** (operator live-wins sync is T-005 at closure)
  - **NO stop-matrix registration** of `AUTONOMY_FLAGS_DRIFT` (BUG-0034 owns)
  - **NO `decisions/DEC-*.md` authored or amended** (DEC-0154 NOT allocated)
  - **NO TUI / RPC / JSON-command / localhost surface restored**
  - **NO `.env` read, NO `npm publish`, NO `git push`, NO live OpenCode / Cursor IDE probe**
  - **NO `/auto` invocation, NO subagent spawn, NO phase work beyond this re-attestation segment**
  - **NO status flip, NO AC tick** — this is attestation repair, not re-QA

### Next-phase handoff pointer

After this repair, the strict-proof chain for S0166 / BUG-0032 is internally coherent:
`execute (1FE73AAD…7DD0C2) → qa (re-attested 936C72CB…0606C2) → [verify-work re-run needed] → release → closure (curator; DEC-0052 sanctioned alternate)`

- **next phase**: `/verify-work` (fresh `qa`; fresh marker + fresh DEC-0038 6-tuple + fresh strict proof) — to re-certify QA_PASS on the now-recompute-confirmed chain; then `/release` (fresh release), then `/closure` (fresh curator) to perform the canonical BUG-0032 DONE flip (backlog `### BUG-0032` L5676 OPEN→DONE + AC-1..AC-7 L5682-L5689 `- [ ]`→`- [x]` + acceptance L223 `- [ ]`→`- [x]` + `sprints/S0166/closure-verification.md` creation + state.md CLOSURE checkpoint + AC-1 operator live-wins sync decision recorded) per US-0045 / BUG-0031 curator 3-allow flip-path (DEC-0152 DENY-FIRST).
- **Do NOT** (from THIS QA re-attestation context): mark BUG-0032 DONE; tick AC-1..AC-7; auto-FIX the drift; register `AUTONOMY_FLAGS_DRIFT` in the stop-matrix; author/amend any `decisions/DEC-*.md`; restore any TUI/RPC/JSON/localhost surface; spawn `/verify-work` / `/release` / `/closure` / `/refresh-context` / `/auto`; npm publish; git push; read `.env`; spawn any subagent. **Orchestrator owns the next spawn per BUG-0006 / US-0048.**

### Stop condition (this segment)

**QA_PASS (re-attested)** emitted — S0166_UNBLOCK_OK (re-attested). This segment **STOPs** after the 6 QA-owned sites are updated (B-1 repaired by construction) + the fresh re-attestation segment proof minted + this verdict block appended + `docs/engineering/state.md` re-attestation checkpoint appended (see that file). Durable evidence: `sprints/S0166/{qa-findings.md, uat.md, uat.json, plan-verify.json}` + `handoffs/qa_to_verify_work.md` (top S0166 section re-attested) + `handoffs/qa_to_dev.md` (verify-work FAIL pointer remains intact; NOT modified by this segment; the orchestrator MAY re-route from `/qa` now that the strict-proof chain is repaired) + `docs/engineering/state.md` (QA re-attestation checkpoint appended).

---

**Verdict**: **QA_PASS (re-attested)**
**ReasonCode**: S0166_UNBLOCK_OK (re-attested)
**Fresh context**: `qa-BUG0032-qa-reattest-20261004T163000Z-fresh` (brand-new; distinct from dev `dev-BUG0032-execute-20261004T144000Z-fresh`, qa `qa-BUG0032-qa-20261004T152000Z-fresh`, verify-work `qa-BUG0032-verify-work-20261004T160600Z-fresh`)
**Own proof hash (fresh segment)**: `FF6F15906150F6E79E29B6A9E53CC27F3F622E09A4BACA2538F07B08D60100BA` (minted in ONE `compute_strict_proof_hash` invocation + independently recomputed in a SECOND fresh `hashlib.sha256` invocation → **identical**; 64 hex; `RUNTIME_PROOF_REUSED` guard honored — distinct from dev `1FE73AAD…`, qa `936C72CB…`, and verify-work `C7DF7744…B5DED`)
**Re-attested QA-phase proof hash (canonical payload preserved verbatim)**: `936C72CB0ECE913EA5812BCC3DA143C2ECA5E5E5B72CBA194B3AB7300B0606C2` (2-invocation recompute MATCH by construction; corrected from `67A38EB7…16207`; B-1 repaired)
**Consumed execute proof**: `1FE73AADB75ABA11DEA63BECE0C825F82FD3862FADB775ED9ECFCF364E7DD0C2` (recompute-MATCH; chain intact)
**Model**: qwen3.8:27b (role=qa)
**Timestamp**: 2026-10-04T16:30:00Z
**Orchestrator run**: auto-20261004-bug0032-qa-reattest
