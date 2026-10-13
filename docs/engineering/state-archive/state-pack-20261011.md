# State archive pack (2026-10-11)

- Rollover trigger: `STATE_HOT_MAX_LINES=1200, STATE_HOT_MAX_CHECKPOINTS=80`
- Source: `docs/engineering/state.md`
- Archived units (oldest first, contiguous prefix): 1
- Retained units in hot file: 36
- First archived heading: `## QA checkpoint — BUG-0032 / S0166 / auto-20261004-bug0032-qa (role=qa)`
- Last archived heading: `## QA checkpoint — BUG-0032 / S0166 / auto-20261004-bug0032-qa (role=qa)`
- Verification tuple (mandatory):
  - archived_body_lines=117
  - preamble_lines=11
  - retained_body_lines=1101

---

## QA checkpoint — BUG-0032 / S0166 / auto-20261004-bug0032-qa (role=qa)

- phase_id=qa
- role=qa
- story_id=(none)
- bug_id=BUG-0032 (Status **OPEN** — not flipped DONE; AC-1..AC-7 unchecked; acceptance L223 `- [ ]` unchanged)
- sprint_id=S0166
- orchestrator_run_id=auto-20261004-bug0032-qa
- parent_orchestrator_run_id=auto-20261004-bug0032
- delivery_mode=ultra_lean (no planning-phase QA spawn; plan-verify merged at /qa per `ultra_lean_not_in_resolved_phase_plan` S0160 house shape)
- macro_phase=build+verify (QA = first phase of the build+verify macro)
- skipped_phases=[intake, plan-verify]; plan_verify=PASS (ultra_lean merged at /qa this phase)
- verdict=**QA_PASS**
- decision_gate=false
- timestamp=2026-10-04T15:20:00Z (UTC wall-clock)
- model_id=qwen3.8:27b (CROSS_MODEL_REVIEW=0)
- fresh_context_marker=**qa-BUG0032-qa-20261004T152000Z-fresh** (FRESH — grep-confirmed 0 prior occurrences repo-wide in this session; distinct from the dev execute marker `dev-BUG0032-execute-20261004T144000Z-fresh`)
- AUTO_QUIET=1; CROSS_MODEL_REVIEW=0; SECURITY_REVIEW=0; FRAMEWORK_KIT_REPO=1; EARLY_RESEARCH=0
- native_chain_active=true; native_chain_continuing=true
- segment_work_item_kind=bug
- active_bug_id=BUG-0032
- bug_queue_position=1 of 1; bug_queue_remaining=0 (only target this segment)
- research_anchor=docs/engineering/research.md ## R-0156 (DQ1–DQ3 LOCKED; A1 semantic declared-mirror drift gate, live-wins)
- architecture_anchor=docs/engineering/architecture.md # BUG-0032 (L3590-L3702; ARCHITECTURE_PASS; 8 seed tasks T-anch..T-007; 8 test markers PLANNED)
- companion_dec=(none — cite R-0156 / # BUG-0032 only; DEC-0154 NOT allocated per R-0156 verdict "No companion DEC recommended")
- **consumed_execute_proof=rp-auto-20261004-bug0032-execute-dev-20261004T144000Z-BUG-0032 / 1FE73AADB75ABA11DEA63BECE0C825F82FD3862FADB775ED9ECFCF364E7DD0C2** (independently recomputed **2x** in this QA session via `from scripts.token_cost_lib import compute_strict_proof_hash` (64-hex; compact sorted-key JSON; SHA-256) → **MATCH**; within TTL 2026-10-04T15:40:00Z at QA intake 2026-10-04T15:20:00Z — **NOT STALE**)
- task_count=8 (T-anch + T-001..T-007; all DONE per `sprints/S0166/progress.md` + `sprints/S0166/tasks.md` all `[x]`)
- **tests (independently re-run THIS QA session)**:
  - `python -m pytest tests/bug0032_autonomy_flags_drift_test.py -v` → **8 passed in 0.87s** (active; 8/8 markers)
  - `python -m pytest template/tests/bug0032_autonomy_flags_drift_test.py -v` → **8 passed in 0.86s** (template twin; resolves active repo root; same 8 markers)
  - 7 fixtures direct checker runs (`python scripts/check_intake_template_parity.py --scope=autonomy-flags --repo <fixture>`): `identity` exit 0 + `[INTAKE_TEMPLATE_PARITY_OK]`; `preset-drift` exit 1 (PRESET); `policy-drift` exit 1 (POLICY); `two-key-drift` exit 1 (fixed order PRESET then POLICY); `malformed-duplicate` / `malformed-missing` / `malformed-unparseable` exit 1 fail-closed, no success banner
  - `python -m pytest tests/us0131_contract_test.py -q` → **10 passed** (US-0131 baseline unchanged)
  - `python -m pytest tests/us0119_autonomy_preset_test.py -q` → **8 passed, 2 failed** (N-2 pre-existing matrix-ref failures; NOT weakened, NOT repaired; R-0156 DQ2 forbids altering stop-matrix logic; BUG-0034 owns registration)
- **parity (SHA-256 recompute THIS QA session via `Get-FileHash`, 4 active/template pairs)**: **4/4 MATCH**
  - `scripts/check_intake_template_parity.py`: `EC5B24C5…58B3D5`
  - `docs/engineering/reason_codes.md`: `4C6F03D5…FF52BFB`
  - `docs/engineering/runbook.md`: `5D6D6780…CEAF7552`
  - `tests/bug0032_autonomy_flags_drift_test.py`: `BD7117E5…9009B29C`
- **mandated bridge**: `python scripts/bug_issue_validate.py --repo . --check-acceptance` → **`[BUG_VALIDATION_OK]` exit 0** (PRE before QA writes + POST after all QA writes; no backlog/acceptance row mutated by this QA context)
- **guards (re-verified read-only THIS QA session)**:
  - Guard #1 — backlog `### BUG-0032` `Status: OPEN` + AC-1..AC-7 `- [ ]` unchanged; acceptance L223 `- [ ]` unchanged; QA assesses, closure owns the flip
  - Guard #2 — no `decisions/DEC-*.md` authored or amended (DEC-0154 NOT allocated)
  - Guard #3 — US-0156 / US-0154 / US-0155 / BUG-0026/0028/0029/0033/0034 unchanged; `autonomy_stop_matrix.yaml` (8,374 B) unchanged; `AUTONOMY_FLAGS_DRIFT` NOT registered (BUG-0034 owns); `.its-magic/config.json` (20,237 B) unchanged; `.cursor/scratchpad.md` (36,325 B) unchanged — **drift-DETECT only, NOT drift-FIX**
  - Guard #4 — T-001..T-007 dev artifacts intact (4/4 PARITY MATCH; 8/8+8/8 PASS)
  - Guard #5 — no TUI / RPC / JSON command template / localhost surface restored
  - Guard #6 — no `/auto` invocation, no subagent spawn, no phase work beyond `qa`
  - Guard #7 — no `.env` read, no `npm publish`, no `git push`, no live IDE probe (UAT_PROBE_FORBIDDEN held)
  - Guard #8 — `INTAKE_AUTONOMY_MODE=0` / `INTAKE_SUBAGENT_FALLBACK=deny` / stop-matrix / security_hard all unchanged
  - Guard #9 — 8 `test_bug0032_*` markers present + passing in active + template
  - Guard #10 — CI harness (run-tests.ps1 L1686-L1693 + run-tests.sh L1554-L1564) uses identity fixture (exit-0) + 8-marker suite; always-run NOT changed-file filtered
- **non_blocking_count=2** (no BLOCKING):
  - **N-1 EXECUTE_CHECKPOINT_MISSING (state.md hygiene gap, NON-BLOCKING)**: `## Execute checkpoint — BUG-0032 / S0166` absent from this file. Durable execute evidence intact in `sprints/S0166/progress.md` + `sprints/S0166/summary.md` + `sprints/S0166/tasks.md` + `handoffs/dev_to_qa.md`. **Decisive precedent: BUG-0035 (S0165) also lacks a `## Execute checkpoint` in state.md and still reached CLOSURE_PASS.** Gap classified non-blocking hygiene; backfill deferred to orchestrator/refresh-context.
  - **N-2 US-0119 2 pre-existing matrix-ref failures (CARRIED, not weakened/repaired)**: `test_us0119_matrix_validator_passes` + `test_us0119_matrix_no_orphan_codes`. Out of BUG-0032 scope per R-0156 DQ2; NOT a S0166 regression; BUG-0034 owns the stop-matrix registration.
- **Status authority (US-0045 + BUG-0031 curator 3-allow, DEC-0152 DENY-FIRST)**: BUG-0032 remains **OPEN**; AC-1..AC-7 remain **unchecked**; acceptance L223 unchanged; backlog ACs unchanged. **QA assesses; closure owns the flip.**
- **next_scheduled_phase=verify-work** (fresh `qa` role; BUG-0006 / US-0048 spawn-only; orchestrator owns this spawn)
- **after verify-work → /release** (fresh release) → **/closure** (fresh curator; DEC-0052 sanctioned alternate) to perform canonical BUG-0032 DONE flip + AC ticks + closure-verification + state.md CLOSURE checkpoint per curator 3-allow flip-path (DEC-0152 DENY-FIRST).
- **stop_condition= STOP after QA_PASS.** Orchestrator **MUST** spawn `/verify-work` in fresh qa (BUG-0006 / US-0048). CROSS_MODEL_REVIEW=0 — do NOT spawn sovereign-critic. Do NOT mark BUG-0032 DONE. Do NOT tick AC. Do NOT auto-FIX the drift (operator action; AC-1 second branch closure-evidence path). Do NOT register `AUTONOMY_FLAGS_DRIFT` in stop-matrix (BUG-0034 owns). Do NOT author/amend any `decisions/DEC-*.md`. Do NOT drain BUG-0033/BUG-0034. Do NOT reopen BUG-0005/0016/0022/0027/0031/0035 or US-0156. Do NOT restore TUI/RPC/JSON/localhost. Do NOT npm-publish. Do NOT git push. Do NOT read `.env`. Do NOT spawn `/verify-work` / `/release` / `/closure` / `/refresh-context` / `/auto` from this QA subagent.

### Traceability index (DEC-0010) — qa BUG-0032

| Story | Sprint | Tasks | Status | Evidence |
|-------|--------|-------|--------|----------|
| BUG-0032 | S0166 | T-anch + T-001..T-007 (all DONE by dev; independently verified by qa) | **QA_PASS** (S0166_UNBLOCK_OK) | sprints/S0166/qa-findings.md; uat.md; uat.json; plan-verify.json; handoffs/qa_to_verify_work.md (top S0166 section) |

### Isolation evidence (US-0048 / DEC-0029 / US-0104 v2 / US-0056) — qa BUG-0032

- phase_id=qa; role=qa (fresh per BUG-0006 / US-0048)
- model_id=qwen3.8:27b (CROSS_MODEL_REVIEW=0)
- fresh_context_marker=**qa-BUG0032-qa-20261004T152000Z-fresh** (FRESH, grep-confirmed 0 prior occurrences repo-wide)
- timestamp=2026-10-04T15:20:00Z (UTC)
- orchestrator_run_id=auto-20261004-bug0032-qa; parent=auto-20261004-bug0032
- story_id=(none); bug_id=BUG-0032; sprint_id=S0166
- delivery_mode=ultra_lean; macro_phase=build+verify; skipped_phases=[intake, plan-verify]; plan_verify=PASS (merged at /qa)
- explicit `bug-target=BUG-0032` selected canonical OPEN P0; no `/auto`, subagent, live probe, `.env` read, or production/config mutation
- evidence_ref=sprints/S0166/{qa-findings.md, uat.md, uat.json, plan-verify.json}; handoffs/qa_to_verify_work.md (top S0166 section); handoffs/dev_to_qa.md (top S0166 section); sprints/S0166/{sprint.md, tasks.md, progress.md, summary.md}; scripts/check_intake_template_parity.py; tests/bug0032_autonomy_flags_drift_test.py; tests/fixtures/bug0032_autonomy_flags/ (7 fixtures); docs/engineering/reason_codes.md L469; docs/engineering/runbook.md L4283; tests/run-tests.{ps1,sh}; scripts/token_cost_lib.py; docs/product/backlog.md ### BUG-0032; docs/product/acceptance.md L223
- No .env reads. No BUG-0032 status flip. No acceptance tick. No BUG-0033 drain. No BUG-0034 stop-matrix mutation. No US-0156/US-0154/US-0155/BUG-0026/0028/0029/0035 mutation. No /verify-work, /release, /closure, /refresh-context, or critic spawn. No TUI/RPC/JSON/localhost restoration. No DEC authoring. No npm-publish. No git push.

### Strict runtime proof (DEC-0038 / US-0056) — qa BUG-0032

- runtime_proof_id=**rp-auto-20261004-bug0032-qa-20261004T152000Z-BUG-0032** (FRESH — grep-confirmed 0 prior occurrences repo-wide; distinct from dev execute `rp-auto-20261004-bug0032-execute-dev-20261004T144000Z-BUG-0032` and all prior BUG-0032 chain proofs)
- phase_id=qa, role=qa, bug_id=BUG-0032, sprint_id=S0166
- proof_issued_at=2026-10-04T15:20:00Z; proof_ttl_seconds=3600, proof_ttl=2026-10-04T16:20:00Z
- **proof_hash=936C72CB0ECE913EA5812BCC3DA143C2ECA5E5E5B72CBA194B3AB7300B0606C2** (64-hex; stored uppercase; **QA strict-proof re-attestation (post verify-work B-1 FAIL)** — recorded value corrected from `67A38EB74045C2AB91C875033802D9337AF3F0959F8370628CDB71525B816207` (non-reproducing, B-1) to `936C72CB…0606C2`, the recompute-confirmed deterministic SHA-256 of the verbatim canonical 6-tuple — 2-invocation recompute MATCH by construction; canonical payload unmodified)
- Hash via `compute_strict_proof_hash` (positional 6-tuple: orchestrator_run_id, runtime_proof_id, phase_id, role, proof_issued_at, proof_ttl_seconds; compact sorted-key JSON → SHA-256)
- **hash_recompute_confirmation=true** — **QA strict-proof re-attestation (post verify-work B-1 FAIL)**: the originally-recorded `hash_recompute_confirmation=true` (minted `67A38EB7…16207` + recompute → `67A38EB7…16207`) is **FALSIFIED on independent recompute** (that value does NOT reproduce from the canonical payload — the B-1 defect). **RE-ATTESTED by construction in the re-attestation segment** (2026-10-04T16:30:00Z): MINTED in one fresh invocation via `scripts.token_cost_lib.compute_strict_proof_hash` → `936c72cb0ece913ea5812bcc3da143c2eca5e5e5b72cba194b3ab7300b0606c2`; then **INDEPENDENTLY RECOMPUTED in a second fresh invocation** via plain `hashlib.sha256(json.dumps(obj, sort_keys=True, separators=(",",":")).encode()).hexdigest()` over the verbatim canonical 6-tuple → identical `936c72cb0ece913ea5812bcc3da143c2eca5e5e5b72cba194b3ab7300b0606c2`; 64 hex; **MATCH BY CONSTRUCTION**. Canonical 6-tuple preserved verbatim: `{"orchestrator_run_id":"auto-20261004-bug0032-qa","phase_id":"qa","proof_issued_at":"2026-10-04T15:20:00Z","proof_ttl_seconds":3600,"role":"qa","runtime_proof_id":"rp-auto-20261004-bug0032-qa-20261004T152000Z-BUG-0032"}`. Distinct from dev execute `1FE73AAD…7DD0C2` (consume-chain MATCH). Fresh re-attestation segment proof minted for this repair: `rp-auto-20261004-bug0032-qa-reattest-20261004T163000Z-BUG-0032` / `FF6F15906150F6E79E29B6A9E53CC27F3F622E09A4BACA2538F07B08D60100BA` (2-invocation recompute MATCH by construction; `RUNTIME_PROOF_REUSED` guard honored).

### Consumed execute proof (independently re-verified THIS QA session)

- **consumed_execute_proof=rp-auto-20261004-bug0032-execute-dev-20261004T144000Z-BUG-0032 / 1FE73AADB75ABA11DEA63BECE0C825F82FD3862FADB775ED9ECFCF364E7DD0C2**
- `compute_strict_proof_hash('auto-20261004-bug0032-execute', 'rp-auto-20261004-bug0032-execute-dev-20261004T144000Z-BUG-0032', 'execute', 'dev', '2026-10-04T14:40:00Z', 3600)` → **`1FE73AAD…7DD0C2`** (independently recomputed **twice**, both matching; 64 hex; **MATCH**)
- TTL = 2026-10-04T15:40:00Z; QA intake = 2026-10-04T15:20:00Z → **within TTL; NOT STALE**
- Durable execute evidence chain: `sprints/S0166/progress.md` (all 8 tasks DONE with per-task timestamps + command/exit-code evidence) + `sprints/S0166/summary.md` (EXECUTE_PASS; AC surjection; parity summary; test results) + `sprints/S0166/tasks.md` (all 8 `[x]`) + `handoffs/dev_to_qa.md` (top S0166 section: dec-0038 6-tuple, `LIB_MATCH=True`, 2 independent recompute agreement)

### Phase boundary status (DEC-0069 AC-10) — qa BUG-0032

- phase_boundary=qa (execute complete prior segment; qa = first phase of build+verify macro THIS phase; verify-work / release / closure not entered)
- verdict=**QA_PASS**; reason_code=S0166_UNBLOCK_OK
- bug_id=BUG-0032 OPEN; sprint_id=S0166
- **next_phase=verify-work** (fresh qa per BUG-0006); **next_role=qa**
- after verify-work → `/release` (release) → `/closure` (curator; DEC-0052 sanctioned alternate; `qe` unspawnable on this host)
- segment_work_item_kind=bug; story_id=(none); bug_id=BUG-0032 (OPEN); sprint_id=S0166; delivery_mode=ultra_lean; macro_phase=build+verify
- plan_verify=PASS (ultra_lean merged at /qa this phase; `sprints/S0166/plan-verify.json` schema v1; status=PASS; 7/7 AC surjective + DC; no `PLAN_AC_COVERAGE_GAP`)
- **BUG-0032_status=OPEN** (NOT flipped by this QA phase; closure owns per US-0045 / BUG-0031 flip-path, DEC-0152 DENY-FIRST)
- **AC_ticks=unchecked** (AC-1..AC-7 remain `[ ]` in backlog L5682-L5689 + acceptance L223)
- native_chain_active=true; native_chain_continuing=true; segment_closed=false
- drain_advance_action=not_performed (BUG-0032 is this segment's explicit `bug-target`, not a drain candidate)
- do_not_claim: live_ide_pass_claimed=false; BUG-0032_DONE_claimed=false; BUG-0032_AC_ticks_claimed=false; drift_FIXED_claimed=false (drift-DETECT only); stop_matrix_mutated=false; config/scratchpad_mutated=false; provider_completion_claimed=false; npm_published=false; git_pushed=false; no `.env` read; no subagent spawn; no `/auto` recursion
- **stop_condition= STOP after QA_PASS.** Orchestrator MUST spawn `/verify-work` in fresh qa. CROSS_MODEL_REVIEW=0. Do NOT mark BUG-0032 DONE. Do NOT tick AC. Do NOT auto-FIX the drift. Do NOT register in stop-matrix. Do NOT drain BUG-0033/BUG-0034. Do NOT reopen DONE siblings. Do NOT restore TUI/RPC/JSON/localhost. Do NOT spawn from this QA subagent. Do NOT npm-publish. Do NOT git push. Do NOT read `.env`.

### Triad hot-surface verification tuple (DEC-0054) — qa BUG-0032

- **Surface 1 — `sprints/S0166/qa-findings.md`** (primary authoring, allow-listed `.opencode/agents/qa.md`): QA_PASS findings; verdict + 10-item independent verification battery + guard #1–#10 + per-AC assessment + status authority + N-1/N-2 non-blocking. Durable on disk.
- **Surface 2 — `sprints/S0166/uat.md` + `sprints/S0166/uat.json`** (primary authoring, allow-listed): 8 UAT entries (AC-1..AC-7 + DC) + convergence_smoke; uat.json total=9, passed=9, failed=0; valid JSON confirmed. Durable on disk.
- **Surface 3 — `sprints/S0166/plan-verify.json`** (primary authoring, allow-listed): ultra_lean merged; status=PASS; 7/7 AC surjective + DC; no `PLAN_AC_COVERAGE_GAP`. Durable on disk.
- **Surface 4 — `handoffs/qa_to_verify_work.md`** (PREPENDED top, newest-first, allow-listed): this QA_PASS handoff prepended above prior S0165/BUG-0035 + S0164/BUG-0031 VERIFY_PASS sections (retained as history). Carries fresh marker + proof + consumed execute proof + stop condition. Durable on disk.
- **Surface 5 — `docs/engineering/state.md`** (this checkpoint, appended at bottom): this block is the durable QA phase record (append-oldest-prefix / retain-newest, DEC-0040); BUG-0032 remains OPEN, ACs unchecked, no flip performed. Durable on disk.

