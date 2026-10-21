# QA handoff — BUG-0038 / S0183 (QA_PASS — no dev route)

- **Timestamp:** 2026-10-19T20:37:10Z; **verdict:** **QA_PASS**; `decision_gate=false`.
- **Resolution:** the canonical QA child lawfully persisted its complete DEC-0153 state-first pair and matching resume-brief pointer. The prior QA_BLOCKED records below remain historical blocker evidence only.
- **Evidence:** `sprints/S0183/qa-findings.md`, `uat.md`, `uat.json`, `plan-verify.json`, and `docs/engineering/state.md` QA checkpoint; focused BUG-0038 + US-0156 resolver tests **16 passed**; canonical bug linkage validator **[BUG_VALIDATION_OK]**.
- **Route:** no dev remediation and no QA-to-dev action. The only authorized successor is fresh `verify-work` as `qa` after validating `repair-20261018-bug0038-anchor-repair|bug|BUG-0038|qa|rp-repair-20261018-bug0038-qa-canonical-qa-20261019T203710Z-BUG-0038`.
- **Guard:** BUG-0038 remains OPEN/P0; AC-1..AC-5 and the acceptance row remain unchecked. No closure action.

---

# QA handoff — BUG-0038 / S0183 (QA_BLOCKED — DEC-0153 brief permission denied)

- **Timestamp:** 2026-10-18T21:10:26Z
- **Verdict:** `QA_BLOCKED`; reason code `QA_RESUME_BRIEF_PERMISSION_DENIED`.
- **Isolation:** `qa-BUG0038-qa-recovery-20261018T211026Z-fresh`; strict proof `rp-repair-20261018-bug0038-qa-recovery-qa-20261018T211026Z-BUG-0038` / `b65a5a2041d5d047fdbed6bf7e7830d68ccef56cc31c37a17bc80742fb37dd56` (MATCH twice).
- **Evidence:** `docs/engineering/state.md#bug-0038-qa-recovery-20261018T211026Z`, `sprints/S0183/qa-findings.md`, `sprints/S0183/uat.md`, and `sprints/S0183/plan-verify.json`.
- **Blocking fact:** incoming execute pair and QA candidate pair validation passed, then the current QA surface denied the required `handoffs/resume_brief.md` prepend. The brief was not written and there is no valid QA continuation pair.
- **Route:** no dev remediation, no next phase, and no spawn. This handoff is durable blocker evidence only; BUG-0038 remains OPEN/P0.

---

# QA handoff — US-0158 / S0182 (QA_BLOCKED — DEC-0153 prerequisite permission denied)

- **Timestamp:** 2026-10-17T11:19:49Z
- **Verdict:** **QA_BLOCKED**; reason code `QA_RESUME_BRIEF_PERMISSION_DENIED`.
- **Fresh continue_same_phase confirmation:** the next QA child retried the
  scoped `apply_patch` repair first; effective edit enforcement again denied
  both QA-map paths, so no configuration, QA/UAT evidence, state checkpoint,
  or resume-brief pair was written. Terminal stop remains unchanged.
- **Evidence:** `sprints/S0182/qa-findings.md`.
- **Blocking fact:** active and template `.opencode/agents/qa.md` are byte-identical
  (SHA-256 `880798c2862451fae0c51bdfceb088c1e1e2cb55e01917b7663a0ced2ae406a1`),
  but each has zero exact `"handoffs/resume_brief.md": allow` entries. The
  narrow user-authorized repair was rejected by the current QA permission map.
- **Required repair:** an authorized configuration writer must add only that
  exact QA allow to the active map and template mirror, preserving deny-first
  order, every existing allow, the seven-role Task policy, and byte parity.
- **No QA execution:** canonical QA tests/UAT and the DEC-0153 state/brief pair
  were not run or written; the permission gate fails closed before the phase.
- **STOP:** no next phase is named; no child was spawned.

---

# QA -> Dev handoff — BUG-0033 / S0168 (QA_FAIL — B-1: S0168 "harness green Fail=0" exit gate unmet; triad hot-surface over-size from stale harness evidence)

> **Routing note (qa → dev):** this is the **`/execute` rework handoff** for the S0168 / BUG-0033 segment. A fresh `qa` context (`qa-BUG0033-20261009T225321Z-fresh`) independently re-verified the dev's gate-lifted `EXECUTE_PASS` (gatefix3, `E24685BB…6935`) and found the **S0168 "harness green Fail=0" exit gate (sprint.md L134) NOT met in the current repo state**: the full harness is **red** (`Pass=877/Fail=2`) because `docs/engineering/state.md` is **1209 lines > the 1200-line triad cap**, which the dev's **own gatefix3 checkpoint append** introduced **after** its last green harness run (with no post-append re-run). The BUG-0033 functional core (AC-1..AC-8) and all 3 gate-lift fixes are **intact and independently GREEN** — this is a **gate/hygiene regression, not a BUG-0033-fix defect**. Do NOT re-verify the BUG-0033 slice; do the single remediation below and re-spawn `/qa`.

- **sprint_id**: S0168
- **bug_id**: BUG-0033 (OPEN — NOT flipped; closure owns the AC flip per US-0045)
- **phase_id**: qa (this handoff) → **target phase: `/execute`** (fresh `dev`)
- **role**: qa (BUG-0006 / US-0048 spawn-only)
- **timestamp**: 2026-10-09T23:15:00Z (UTC)
- **verdict**: **QA_FAIL (BLOCKING)**
- **reason_code**: `BUG0033_QA_HARNESS_GATE_UNMET`
- **DoD gate**: FAIL (11/12 battery checks PASS; C8 full-harness FAIL on B-1)
- **QA provenance**: marker `qa-BUG0033-20261009T225321Z-fresh`; proof `rp-auto-20261009-bug0033-qa-20261009T225321Z-BUG-0033`; hash `165D4C6C2101A75C8693C0819EEDBE0B222D8F8A044AB59A4997B1F4E28E76C3` (2-invocation recompute MATCH).
- **evidence**: `sprints/S0168/qa-findings.md` (full 12-check battery + B-1 + N-1/N-2 + guard audit); `docs/engineering/state.md` (QA checkpoint appended at end); `tests/report.md` (fresh 2026-10-09T23:02:49Z report from the QA harness run).

## B-1 (BLOCKING) — S0168 "harness green Fail=0" exit gate (sprint.md L134) UNMET; the dev's recorded `Pass=879/Fail=0` (2026-10-09T21:44:13Z) is STALE

- **Defect (precise):** Independent full-harness re-run (this QA context, start 2026-10-09T22:55:19Z → end 23:02:49Z) → **exit 1**, fresh `tests/report.md` **Timestamp 2026-10-09T23:02:49Z, Pass=877 / Fail=2**. The 2 `[FAIL]` lines:
  - `[FAIL] triad check passes on repo`
  - `[FAIL] triad check idempotent rerun passes`
- **Direct read-only reproduction** (`python scripts/enforce-triad-hot-surface.py --repo . --check` → exit 1):
  ```
  STATE_ARCHIVE_REQUIRED surface=state path=docs/engineering/state.md lines=1209/1200 units=30/80 reason=ARTIFACT_HOT_SURFACE_OVERSIZE
  ```
- **Mechanism (root cause):** `docs/engineering/state.md` is now **1209 lines** (> 1200 triad cap). The over-cap condition was introduced by the **dev's own gatefix3 checkpoint append** (`## Execute checkpoint … auto-20261009-bug0033-gatefix3`, `state.md` **L1182–L1209 = 28 lines**), which landed **after** the dev's last green harness run. Sequence (all from the dev's own records): harness **2026-10-09T21:44:13Z** (Pass=879/Fail=0, on a **1181-line** state.md that did NOT yet contain the gatefix3 checkpoint) → gatefix3 checkpoint appended (proof_issued_at **21:44:30Z**) → state.md 1181 → **1209** → **dev did NOT re-run the harness after appending the checkpoint**. The recorded `Pass=879/Fail=0` therefore reflects a state that **no longer exists**. QA re-run 877 = 879 − 2: exactly the 2 triad lines flipped PASS→FAIL; **every other assertion is green**, including all 6 previously-failing parity lines and both `validate_readme_feature_coverage` lines (all `[PASS]` in the fresh report).
- **Scope note (what is NOT the problem):** the BUG-0033 functional core (AC-1..AC-8) and the 3 gate-lift fixes (2 BUG-0034 row pairs + 1 agent-map parity line) are **fully intact and independently GREEN** (Batteries A + B of `qa-findings.md`): pytest 10/10; `--scope=bug-0033`/`--scope=readme-feature-coverage`/`--scope=opencode-adapter` exit 0; rfc validator `coverage_missing=[]`/`status=PASS` ×2 byte-identical; agent-map twins byte-identical `4B8B1589…E23`; BUG-0034 rows intact at `its_magic/README.md` L447 + twin and `docs/developer/README.md` L40-41. The BUG-0033 section copy is **NOT** policy-relevantly divergent from the rich source (manual spot-check of closure.md/execute.md: `## Stop conditions` before `## Fail-safe reason codes`, diagnostics-only, STOP sentinel final, no dispatch fragments). **Do NOT re-verify or re-attest the BUG-0033 slice or the 3 gate-lift fixes — they are green.**
- **Why BLOCKING:** the task verdict rule is "QA_PASS only if ALL of A+B+C+D pass"; C8 (full harness Fail=0) is red on an UNEXPECTED (not documented-baseline) reason. The S0168 exit gate the whole gate-lift chain was authorized to satisfy is therefore **not actually satisfied** in the repo state QA is verifying. QA does **not** fix it (record-only role).

## Remediation scope for the fresh `dev` child (single, non-destructive; then re-spawn `/qa`)

1. **Restore the triad hot-surface to in-cap** via the sanctioned non-destructive rollover (the documented Step-9 remediation pattern, cf. `state.md` L1114):
   ```
   python scripts/enforce-triad-hot-surface.py --repo . --rollover
   ```
   (archives the oldest terminal checkpoint from `state.md` to the triad archive; repeat only if still over cap.) Then confirm:
   ```
   python scripts/enforce-triad-hot-surface.py --repo . --check   # must exit 0 (state.md ≤ 1200 lines)
   ```
2. **Re-run the FULL harness to Fail=0:**
   ```
   powershell -ExecutionPolicy Bypass -File tests/run-tests.ps1   # must exit 0
   ```
   and record the **NEW** `tests/report.md` timestamp + Pass/Fail in the fresh dev checkpoint.
3. **Re-issue the top `handoffs/dev_to_qa.md` entry** (gate-lifted EXECUTE_PASS) citing that **fresh** `tests/report.md` (Pass=879/Fail=0, new timestamp) — the prior entry's 2026-10-09T21:44:13Z report is stale and must not be re-cited as the current-state evidence.
4. **Do NOT** re-run/re-claim the BUG-0033 ACs or re-attest the 3 gate-lift fixes (they are green — see above). **Do NOT** touch the BUG-0033 section copy. **Do NOT** mark BUG-0033 DONE or tick any AC (closure owns the flip). **Do NOT** author/amend any DEC. **Do NOT** npm publish, git push, read `.env`, spawn a subagent, or recurse `/auto`. **Do NOT** spawn `/qa` yourself (orchestrator owns the next spawn).
5. **Final repo state required before re-QA:** `state.md` ≤ 1200 lines **AND** a fresh full-harness `tests/report.md` with **Fail=0** (and the 2 triad lines `[PASS]`).

## Non-blocking / carried forward (NOT QA_FAIL triggers)

- **N-1 (carry-forward baseline):** the 5 standalone (non-harness) us0125/us0126 failures (`us0125_command_inventory`, `us0125_clone_guard`, `us0125_missing_command_does_not_disable_plugin`, `us0125_auto_command_dispatch_only`, `us0126_default_host_reminder`) = the documented m9 baseline; out-of-harness; `test_us0126_parity_scope_opencode_adapter` is GREEN. (Reproduced exactly in QA Battery C9.)
- **N-2 (carry-forward observation):** `docs/developer/README.md` ↔ `template/docs/developer/README.md` are structurally divergent (template lacks the active file's BUG-0024/BUG-0030 rows) — pre-existing, in NO rfc/parity pair; candidate follow-up for a future slice.
- **N-3 (observation, not a deviation):** untracked `decisions/DEC-0153.md`/`DEC-0154.md` are pre-existing companion DECs from earlier BUG-0033/S0165 phases (already indexed in `docs/engineering/decisions.md`), NOT authored by the 3 gate-lift attempts.

## Next (orchestrator-owned)

- **`/execute`** (fresh `dev`) — remediation scope above (triad rollover + harness re-run + fresh evidence; re-issue gate-lifted `dev_to_qa.md` citing the fresh report).
- **After the dev child lands** (repo state: state.md ≤ 1200 lines AND fresh Fail=0 harness report) — orchestrator re-enters **`/qa`** (fresh qa) → **`/verify-work`** (fresh qa) → **`/release`** (fresh release) → **`/closure`** (fresh `curator`; **DEC-0052 sanctioned alternate** since `qe` is not spawnable on this host) to ship the S0168 / BUG-0033 segment to DONE per the curator 3-allow flip-path (DENY-FIRST, DEC-0152).

---

# QA -> Dev handoff — BUG-0032 / S0166 (from verify-work: VERIFY_WORK_FAIL — B-1 strict-proof re-compute MISMATCH; Option B remediation)

> **Routing note (verify-work → dev):** this is the **`/execute` remediation handoff** for the S0166 / BUG-0032 segment, triggered by the **verify-work phase** (fresh `qa` context, role=qa, `qa-BUG0032-verify-work-20261004T160600Z-fresh`) which **did not certify the prior QA_PASS** and instead **routed to `/execute` (Option B)** per the S0166 QA handoff's own Option B path. The functional evidence chain is intact and independently reproduced green (see below); the **sole BLOCKING defect (B-1)** is a prior-phase **strict-proof integrity failure** — re-attestation only, **not** a re-QA of the functional slice.

- **sprint_id**: S0166
- **bug_id**: BUG-0032 (OPEN, P0 — NOT flipped; closure not eligible on current evidence)
- **phase_id**: verify-work (this handoff) → **target phase: `/execute`** (fresh `dev`)
- **role**: qa (verify-work owner; BUG-0006 / US-0048 spawn-only)
- **timestamp**: 2026-10-04T16:06:00Z (UTC)
- **verdict**: **VERIFY_WORK_FAIL (BLOCKING)**
- **reason_code**: `S0166_VERIFY_BLOCK_PROOF_HASH_RECOMPUTE_MISMATCH`
- **DoD gate**: FAIL (functional 7/7 AC + DC PASS reproduced; strict-proof chain FAIL on B-1)
- **evidence**: `sprints/S0166/verify-work-findings.md` (full battery + B-1 + N-1/N-2 + guard audit); `handoffs/qa_to_verify_work.md` (verify-work FAIL verdict appended); `docs/engineering/state.md` (Verify-Work checkpoint BUG-0032/S0166, append-bottom).

## B-1 (BLOCKING) — QA-phase strict-proof `hash_recompute_confirmation` FALSIFIED on independent recompute

- **Defect**: the QA phase's recorded `proof_hash=67A38EB74045C2AB91C875033802D9337AF3F0959F8370628CDB71525B816207` does **not** reproduce from its recorded canonical payload:
  `{"orchestrator_run_id":"auto-20261004-bug0032-qa","phase_id":"qa","proof_issued_at":"2026-10-04T15:20:00Z","proof_ttl_seconds":3600,"role":"qa","runtime_proof_id":"rp-auto-20261004-bug0032-qa-20261004T152000Z-BUG-0032"}`.
- **Deterministic recompute** (`scripts.token_cost_lib.compute_strict_proof_hash` == independent `SHA-256(canonical_json_dumps(...))`, both in fresh invocations) → **`936C72CB0ECE913EA5812BCC3DA143C2ECA5E5E5B72CBA194B3AB7300B06C2`** (≠ claimed `67A38EB7…`).
- The QA phase's `hash_recompute_confirmation=true` claim (QA handoff L16; `qa-findings.md` L14; `uat.json` L124; `state.md` L4086-L4088; `plan-verify.json` L69) is therefore **false**.
- **Isolation of the defect** (control recompute, all MATCH): S0166 execute `1FE73AAD…7DD0C2` ✅ · S0166 architecture `2E911042…E08F` ✅ · S0166 research `A3107ED0…910AC` ✅ · S0165/BUG-0035 verify-work `70EF7A3F…92AF3` ✅ · S0165 qa `E24B3302…DC2BC9` ✅ · S0165 execute `E3018317…01BA7E` ✅. **The single non-MATCH is the S0166 QA leaf.** This is a **prior-phase strict-proof integrity defect, NOT a functional/code regression and NOT a S0166 regression** (the full functional slice reproduced green in the verify-work session).
- **Why BLOCKING**: US-0056 / DEC-0038 make `hash_recompute_confirmation` a binary **fail-closed** gate; DEC-0038 fail-closed + US-0045 closure-precession semantics block verify-work from certifying `QA_PASS` over a non-reproducible proof attestation.

## Remediation scope for the fresh `dev` child (strict-proof re-attestation ONLY)

1. **Re-attest the S0166 QA strict-proof pair.** The recorded pair (canonical payload + hash) must satisfy `hash == SHA-256(canonical_json_dumps(payload))`. If the QA phase's **canonical payload** (L17 of `handoffs/qa_to_verify_work.md`, quoted verbatim in `state.md` L4083-L4086 / `uat.json` L117-L118 / `qa-findings.md` L14 / `plan-verify.json` L66) is the one intended, the **correct** hash is `936C72CB…06C2` — update the five recorded locations to that value, with an explicit **"QA proof re-attestation — canonical payload confirmed, hash corrected to recompute-confirmed value"** note for audit transparency.
2. **Alternatively** — if a *different* 6-tuple was silently intended (e.g., `orchestrator_run_id`, `phase_id`, `role`, or `runtime_proof_id` differs), record that intended tuple in the same five locations and compute the hash from it. **Either way**, the new `(payload, hash)` pair must satisfy `hash == SHA-256(canonical_json_dumps(payload))` by construction, and the second-invocation recompute must MATCH (the `hash_recompute_confirmation=true` claim must be TRUE by construction, not by assertion).
3. **Preserve the S0166 functional evidence chain** — the `tests` / `fixtures` / `parity` / `guards` / `AC` evidence already reproduced green by the verify-work session (8/8 active + 8/8 template; 7 fixtures per R-0156 DQ1; 4/4 byte-parity MATCH; `bug_issue_validate.py --check-acceptance` exit 0; US-0131 10/10; US-0119 8P/2F = N-2; guards #1-#10; AC-1..AC-7 + DC). Do **not** re-run or re-claim ACs. This is a strict-proof re-attestation, **not** a re-QA.
4. **Carry forward** N-1 (state.md EXECUTE_CHECKPOINT_MISSING — non-blocking hygiene, S0165/BUG-0035 + US-0156/S0162 precedent) and N-2 (US-0119 pre-existing matrix-ref failures — BUG-0034 owns the stop-matrix registration; not weakened, not repaired) as non-blocking.
5. **Re-emit the QA_PASS** (or the equivalent QA verdict) with the corrected / re-attested strict-proof pair + the recompute evidence, and hand back to the orchestrator so it can re-enter **`/qa`** (fresh qa) → **`/verify-work`** (fresh qa) → **`/release`** (fresh release) → **`/closure`** (fresh `curator`; `qe` unspawnable on this host → **DEC-0052 sanctioned alternate `curator`**) to perform the canonical BUG-0032 DONE flip (backlog L5676 `Status: OPEN`→`DONE` + L5682-L5689 AC-1..AC-7 `[ ]`→`[x]` + acceptance L223 `- [ ]`→`- [x]` + `sprints/S0166/closure-verification.md` + state.md CLOSURE checkpoint + AC-1 operator live-wins decision recorded) per the post-BUG-0031 curator 3-allow flip-path (DENY-FIRST, DEC-0152).

## Passing evidence (qa/verify-work reproduced, not taken on trust — see `sprints/S0166/verify-work-findings.md`)

- `tests/bug0032_autonomy_flags_drift_test.py` → **8/8 PASS** (active); `template/tests/…` → **8/8 PASS** (twin).
- 7-fixture direct checker: identity **exit 0 + `[INTAKE_TEMPLATE_PARITY_OK] scope=autonomy-flags`**; preset/policy/two-key → **exit 1** fixed-order `[AUTONOMY_FLAGS_DRIFT]`; malformed-duplicate/missing/unparseable → **exit 1** fail-closed (no success banner). **AC-2 verified.**
- 4/4 active↔template byte-parity **MATCH** (checker `EC5B24C5…58B3D5`, reason_codes `4C6F03D5…52BFB`, runbook `5D6D6780…F7552`, bug0032 test `BD7117E5…09B29C`).
- `bug_issue_validate.py --repo . --check-acceptance` → **`[BUG_VALIDATION_OK]` exit 0**.
- US-0131 **10/10**; US-0119 **8 pass / 2 pre-existing matrix-ref failures** (N-2; carried, not a S0166 regression; BUG-0034 owns).
- Guard #1 (acceptance L223 `- [ ]` + backlog L5676 `Status: OPEN`) HOLD; Guard #2 (DEC-0154 NOT allocated; no DEC authored/amended) HOLD; Guard #3 (US-0156 DONE / US-0154+0155 OPEN / BUG-0033+0034 OPEN / BUG-0031+0027+0022+0016 DONE / BUG-0035 DONE; stop-matrix 8,374 B + `AUTONOMY_FLAGS_DRIFT` ABSENT; config 20,237 B + scratchpad 36,325 B unchanged; INTAKE gates L146 `deny` / L324 `0` unchanged) HOLD.

## Guards / do NOT (this qa/verify-work context)

- Do NOT mark BUG-0032 DONE. Do NOT tick AC-1..AC-7 (acceptance L223 + backlog L5682-L5689 remain unchecked).
- Do NOT auto-FIX the drift (drift-DETECT only; operator live-wins sync is T-005 at closure).
- Do NOT register `AUTONOMY_FLAGS_DRIFT` in `scripts/data/autonomy_stop_matrix.yaml` (BUG-0034 owns).
- Do NOT author or amend any `decisions/DEC-*.md` (DEC-0154 NOT allocated).
- Do NOT reopen DONE siblings (BUG-0005/0016/0022/0027/0031/0035) or drain OPEN siblings (BUG-0026/0028/0029/0033/0034) or reopen US-0154/0155/0156.
- Do NOT restore any TUI / RPC / JSON command template / localhost surface.
- Do NOT npm publish, do NOT git push, do NOT read `.env`, do NOT spawn any subagent, do NOT recurse `/auto`.
- Do NOT spawn `/release` / `/closure` / `/refresh-context` from THIS context (orchestrator owns the next spawn per BUG-0006 / US-0045).

## Next (orchestrator-owned)

- **`/execute`** (fresh `dev`) — remediation scope above (strict-proof re-attestation only).
- **After the dev child lands** — orchestrator re-enters **`/qa`** (fresh qa) → **`/verify-work`** (fresh qa) → **`/release`** (fresh release) → **`/closure`** (fresh `curator`; **DEC-0052 sanctioned alternate** since `qe` is not spawnable on this host) to ship the S0166 / BUG-0032 segment to DONE per the post-BUG-0031 curator 3-allow flip-path (DENY-FIRST, DEC-0152).

---

# QA -> Dev handoff — US-0156 / S0162 (QA_FAIL — B-1 repaired, B-2 platform-level) [SUPERSEDED, retained below as history]

- **sprint_id**: S0162
- **story_id**: US-0156 (OPEN — not mutated; acceptance unchecked)
- **phase_id**: qa
- **role**: qa (fresh per BUG-0006)
- **timestamp**: 2026-09-27T20:53:48Z (UTC) — persisted by the orchestrator
  via the S0161 closure-record precedent (orchestrator-enforced persistence
  path), because the qa role's own write to its designated artifacts was
  denied by the effective permission rule set (B-2).
- **verdict**: **FAIL** — blocking_count=2 (B-1 subsequently CLOSED and
  re-verified; B-2 subsequently RESOLVED — see correction below; the
  blocking item remaining for US-0156 is the DoD gate, per verify-work:
  BUG-0022 still OPEN → US-0156 stays OPEN).
  - **B-1 CLOSED**: acceptance-row corruption repaired, re-verified green.
  - **B-2 RESOLVED (2026-09-27, orchestrator)**: was NOT platform-level.
    Root cause = rule-order semantics (opencode evaluates the LAST
    matching rule): committed HEAD placed `"**": deny` last → deny won
    over every allow; working tree (deny first, allows last) → specific
    allows on owned paths win. Verified by 3 successful qa-role writes
    to fresh owned paths. All six role agents active+template confirmed
    in the working order; kit contracts green.
- **evidence**: `sprints/S0162/qa-findings.md` (QA record, full detail).

## B-1 (CLOSED)

- `docs/product/acceptance.md` L192 carried a stray U+2014 em-dash prefix
  (`—- [x] BUG-0001: ...`) in the uncommitted working tree, introduced by the
  US-0150..US-0156 session. Committed HEAD (`e34a7c4`) has the clean row.
- Validator row regex dropped the row → `BUG_RECONCILE_ACCEPTANCE_MISSING_ROW:BUG-0001`;
  observed `bug_issue_validate.py --repo . --check-acceptance` exit 1.
- **Repair (one character, applied by orchestrator @ 2026-09-27T20:47Z)**:
  L192 `—- [x] BUG-0001:` → `- [x] BUG-0001:`. Checkbox state unchanged;
  validator regex not loosened; BUG-0001 not unchecked.
- **Post-repair re-verified**: `bug_issue_validate.py --repo .
  --check-acceptance` → `[BUG_VALIDATION_OK]` exit 0; compose
  `bug0027 + bug0030 + us0124 + us0156` → **36 passed, 2 skipped**.
- The dev handoff's `BUG_VALIDATION_OK` claim is now consistent with the
  working tree (it was stale against the corrupted row at QA time).

## B-2 (RESOLVED — correction of initial "PLATFORM" classification)

- qa role's own writes to `sprints/S0162/qa-findings.md` and
  `handoffs/qa_to_dev.md` were initially denied even though explicit allow
  patterns for exactly those paths exist in `.opencode/agents/qa.md`.
- **Initial (wrong) diagnosis**: "opencode resolves effective-deny over
  specific allow regardless of list order, so this is platform-level and
  needs orchestrator-enforced persistence".
- **Correct diagnosis** (opencode v1.18.33 embedded doc: *"Within an
  object, insertion order matters. opencode evaluates the LAST matching
  rule, so put broad rules first and narrow rules last"*):
  - Committed HEAD had the allows first and `"**": deny` **last** →
    last-match-wins → **deny won over every allow** → the observed
    refusals. This is exactly the "immer wieder Rechte-Probleme".
  - Working tree has `"**": deny` first and allows last → **specific
    allows on owned paths win** → qa writes to its own artifacts
    succeed.
- **Verified**: 3 fresh probes written successfully **by the qa role
  itself** (`sprints/S0198/qa-findings.md`, `sprints/S0199-x/qa-findings.md`,
  `sprints/S0201/plan-verify.json` — probes since cleaned up). All six role
  agents (dev, po, qa, release, tech-lead, curator) are deny-first in both
  active and template; `auto.md`/`security.md` use flat `edit: deny`
  (unaffected). Kit contracts green: us0156 10/10, bug0027 marker-10 suite
  pass, compose 36 passed / 2 skipped.
- **Do NOT do**: do not reorder the agents back to allows-first — that
  reintroduces the bug. Do not file this as a platform issue. Do not add
  "orchestrator-enforced persistence" workarounds for this — the S0161
  precedent was correctly applied there (qa genuinely could not write at
  that time because the active rule state was the HEAD ordering); here
  the qa role writes fine and the record was persisted by the qa spawn
  itself.

## Passing evidence (QA-reproduced, not taken on trust)

- `tests/us0156_contract_test.py` → **10/10 PASS** (pytest 9.1.1, 0.86s).
- Compose `bug0027 + bug0030 + us0124 + us0156` → **36 passed, 2 skipped**
  (matches dev handoff).
- Compose guards green: no `fallback_execute` (bridge + orchestrator,
  comments stripped); no active `client.rpc(`; no `localhost:<port>` in
  bridge; all five US-0156 reason codes present in both;
  `PHASE_ROLE_MATRIX` covers all 12 phases; fresh-Task guard +
  `fresh_context_marker` present.
- Permission-order contract green (broad `**` deny precedes specific allows
  in all six non-security roles; security read-only).
- Active/template byte-parity confirmed (bridge, orchestrator, command, all
  role agents; independent hash verification).
- `python scripts/check-user-visible-metadata.py --repo .` → exit 0.
- DoD composition held: backlog BUG-0027 DONE, BUG-0030 DONE; US-0156
  acceptance row correctly unchecked (closure-owner only).

## Guards / do NOT

- No live-desktop / `--pure` / provider-complete claim.
- Do NOT mark US-0156 DONE. Do NOT tick acceptance US-0156.
- Do NOT reopen BUG-0027/0030.
- Do NOT merge/drain BUG-0022/0026/0028/0029.
- Do NOT restore TUI/RPC or the retired `auto.md` route.
- Do NOT npm-publish or git push.
- Do NOT reorder role permission lists or loosen kit permission-order
  contracts "to fix" B-2 (the ordering is not a semantic knob on this host).

## Next

- **B-1**: closed; no further dev action.
- **B-2**: operator must decide how to treat the platform-level
  permission-resolution defect. It is not an in-repo execute defect and is
  not repairable by a dev sub-agent against the current kit contracts.
  Options are the operator's to choose (e.g., file a platform-level issue
  against opencode, or accept the documented limitation and proceed);
  **this handoff does not pre-empt that decision and does not direct a
  follow-on dev or verify-work phase**.

---

# QA -> Verify-work handoff — BUG-0030 / S0161 (QA_PASS)

- **sprint_id**: S0161
- **bug_id**: BUG-0030 (OPEN; acceptance unchanged)
- **phase_id**: qa
- **verdict**: PASS - blocking_count=0
- **evidence**: `sprints/S0161/qa-findings.md`
- **passing**: command registration host smoke, migration contracts, parity,
  BUG-0027 regression, and bug validator
- **credentialed evidence**: `ITS_MAGIC_OPENCODE_SESSION_SMOKE=1` with
  `ITS_MAGIC_OPENCODE_SMOKE_MODEL=openai/gpt-5.6-terra` returned
  `5 passed, 1 skipped`; the real session-command admission check passed
- **next**: fresh `/verify-work`; do not mark BUG-0030 DONE or tick acceptance
  before that phase

---

# QA -> Dev handoff — US-0150 / S0158 (QA_PASS)

- **sprint_id**: S0158
- **story_id**: US-0150 (OPEN - not marked DONE)
- **phase_id**: qa
- **verdict**: PASS - blocking_count=0
- **evidence**: `sprints/S0158/qa-findings.md`
- **green gates**: standalone lint, typecheck, 172 Node tests, 30 Python contracts, template mirror check
- **next**: fresh `/verify-work`; do not mark US-0150 DONE.

---

# Historical QA -> Dev handoff — US-0131 / S0133

- **sprint_id**: S0133
- **story_id**: US-0131 (OPEN — not marked DONE per US-0045)
- **phase_id**: qa (re-run after execute remediation)
- **role**: qa (fresh per BUG-0006)
- **orchestrator_run_id**: auto-20260907-us0131
- **delivery_mode**: ultra_lean
- **macro_phase**: build+verify
- **AUTO_IMPLEMENTATION_LOOP**: 1 (cycle complete — blockers closed)
- **fresh_context_marker**: qa-US0131-qa-20260907T203347Z-fresh
- **timestamp**: 2026-09-07T20:33:47Z (UTC)
- **model_id**: composer-2.5 (CROSS_MODEL_REVIEW=1 — required)
- **verdict**: **PASS** — blocking_count=0
- **story_status**: OPEN (US-0045 — not marked DONE; acceptance checkboxes unchecked)
- **intake_json**: NOT mutated
- **sibling_out_of_scope**: US-0132
- **producer_runtime_proof_id**: rp-auto-20260907-us0131-execute-remediation-dev-20260907T202531Z-US-0131
- **producer_proof_hash**: 7BB3B2E38B12A434B1039A1FEC7BC90727CD15823C36328B1A32BF5E12FEB95C (MATCH; consumed before TTL 2026-09-07T21:25:31Z)
- **qa_runtime_proof_id**: rp-auto-20260907-us0131-qa-qa-20260907T203347Z-US-0131
- **qa_proof_hash**: 84692196079278DF25EDF8781DCCE750282DC8F7DFCBA4A9039D7F5FBDCB87CC
- **qa_proof_ttl**: 2026-09-07T21:33:47Z

## Prior blocker status

- **B-1** `USER_VISIBLE_INTERNAL_METADATA_DETECTED` — **CLOSED**
  - Re-verify: `python scripts/check-user-visible-metadata.py --repo .` → exit 0
  - Docstrings at `materialize_kit_config_example` / `run_kit_config_postinstall` are neutral; ID only in allowlisted `#` comment L268

## Green gates

- pytest tests/us0131_contract_test.py -v → 10/10 PASS
- check_intake_template_parity.py --scope=us-0131 → OK
- check-user-visible-metadata.py --repo . → exit 0
- enforce-triad-hot-surface.py --check → exit 0 (pre-qa-write)
- 14/14 US-0131 template pairs byte-identical
- Critic NBs remain informational only

## Artifacts

- sprints/S0133/qa-findings.md (QA_PASS)
- sprints/S0133/uat.json / uat.md (verdict PASS)
- docs/engineering/state.md (qa re-run checkpoint)
- handoffs/resume_brief.md → verify-work

## Next

Orchestrator MUST Task-spawn fresh **qa** for `/verify-work` (BUG-0006). Do **not** spawn verify-work from this qa subagent. Do **not** route back to `/execute`. Do **not** mark US-0131 DONE. Do **not** work US-0132.

---

# SUPERSEDED — prior FAIL handoff (2026-09-07T20:16:47Z)

Prior content requested execute remediation for B-1. Remediation landed; this file now records CLOSED/PASS. Historical FAIL detail remains in `sprints/S0133/qa-findings.md` archive sections via git history / prior state packs.
