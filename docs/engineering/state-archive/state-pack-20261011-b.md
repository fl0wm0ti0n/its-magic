# State archive pack (2026-10-11)

- Rollover trigger: `STATE_HOT_MAX_LINES=1200, STATE_HOT_MAX_CHECKPOINTS=80`
- Source: `docs/engineering/state.md`
- Archived units (oldest first, contiguous prefix): 1
- Retained units in hot file: 40
- First archived heading: `## QA re-attestation checkpoint — BUG-0032 / S0166 / auto-20261004-bug0032-qa-reattest (role=qa, RE-ATTESTED)`
- Last archived heading: `## QA re-attestation checkpoint — BUG-0032 / S0166 / auto-20261004-bug0032-qa-reattest (role=qa, RE-ATTESTED)`
- Verification tuple (mandatory):
  - archived_body_lines=101
  - preamble_lines=11
  - retained_body_lines=1108

---

## QA re-attestation checkpoint — BUG-0032 / S0166 / auto-20261004-bug0032-qa-reattest (role=qa, RE-ATTESTED)

- phase_id=qa (RE-ATTESTATION segment — attestation repair, NOT re-QA; NOT the re-run of the functional slice)
- role=qa
- story_id=(none)
- bug_id=BUG-0032 (Status **OPEN** — NOT flipped by this segment; AC-1..AC-7 unchecked; acceptance L223 `- [ ]` unchanged)
- sprint_id=S0166
- orchestrator_run_id=auto-20261004-bug0032-qa-reattest (FRESH; distinct from both prior S0166 markers)
- parent_orchestrator_run_id=auto-20261004-bug0032
- delivery_mode=ultra_lean (re-attestation within the existing build+verify macro)
- macro_phase=build+verify (re-attestation segment, repairing B-1 on the QA phase's strict-proof leaf)
- verdict=**QA_PASS (re-attested)**
- reason_code=**S0166_UNBLOCK_OK (re-attested)**
- decision_gate=false (defect is a strict-proof attestation failure, not a design choice; already isolated by verify-work as B-1)
- timestamp=**2026-10-04T16:30:00Z** (UTC wall-clock at this re-attestation segment mint)
- model_id=qwen3.8:27b (CROSS_MODEL_REVIEW=0)
- **fresh_context_marker=**`qa-BUG0032-qa-reattest-20261004T163000Z-fresh`** (FRESH — grep-confirmed 0 prior occurrences repo-wide at mint; distinct from dev `dev-BUG0032-execute-20261004T144000Z-fresh`, qa `qa-BUG0032-qa-20261004T152000Z-fresh`, and verify-work `qa-BUG0032-verify-work-20261004T160600Z-fresh`)
- **runtime_proof_id=**`rp-auto-20261004-bug0032-qa-reattest-20261004T163000Z-BUG-0032`** (FRESH; RUNTIME_PROOF_REUSED guard honored — distinct from all prior S0166/BUG-0032 chain proofs)
- phase_id=qa, role=qa, bug_id=BUG-0032, sprint_id=S0166
- proof_issued_at=2026-10-04T16:30:00Z; proof_ttl_seconds=3600; proof_ttl=2026-10-04T17:30:00Z
- **proof_hash=**`FF6F15906150F6E79E29B6A9E53CC27F3F622E09A4BACA2538F07B08D60100BA`** (64-hex; stored uppercase)
- canonical_proof_payload=`{"orchestrator_run_id":"auto-20261004-bug0032-qa-reattest","phase_id":"qa","proof_issued_at":"2026-10-04T16:30:00Z","proof_ttl_seconds":3600,"role":"qa","runtime_proof_id":"rp-auto-20261004-bug0032-qa-reattest-20261004T163000Z-BUG-0032"}`
- **hash_recompute_confirmation=true BY CONSTRUCTION** — MINTED in one fresh invocation via `scripts.token_cost_lib.compute_strict_proof_hash(orchestrator_run_id, runtime_proof_id, phase_id, role, proof_issued_at, proof_ttl_seconds)` → `ff6f15906150f6e79e29b6a9e53cc27f3f622e09a4baca2538f07b08d60100ba`; then **INDEPENDENTLY RECOMPUTED in a second fresh invocation** via plain `hashlib.sha256(json.dumps(obj, sort_keys=True, separators=(",",":")).encode()).hexdigest()` over the same 6-tuple → identical `ff6f15906150f6e79e29b6a9e53cc27f3f622e09a4baca2538f07b08d60100ba`; 64 hex; **MATCH BY CONSTRUCTION**. Distinct from dev `1FE73AAD…7DD0C2`, qa `936C72CB…0606C2` (re-attested), and verify-work `C7DF7744…B5DED`. RUNTIME_PROOF_REUSED guard honored.

### B-1 repair (the sole purpose of this segment)

**B-1 defect (isolated by verify-work at `sprints/S0166/verify-work-findings.md`, recorded in VERIFY_WORK_FAIL at `## Verify-Work checkpoint — BUG-0032 / S0166` above):** the S0166 QA phase's originally-recorded `proof_hash=67A38EB74045C2AB91C875033802D9337AF3F0959F8370628CDB71525B816207` did **NOT** reproduce from the recorded canonical 6-tuple. The QA phase's `hash_recompute_confirmation=true` claim was **FALSIFIED on independent recompute**.

**RE-ATTESTED in this segment (BY CONSTRUCTION, not by assertion):**

- **Re-attested QA-phase proof hash** (now the value recorded at all 6 QA-owned sites): `936C72CB0ECE913EA5812BCC3DA143C2ECA5E5E5B72CBA194B3AB7300B0606C2` (64-hex; stored uppercase).
- **Corrected from (non-reproducing, B-1):** `67A38EB74045C2AB91C875033802D9337AF3F0959F8370628CDB71525B816207` — independently confirmed by THIS segment: `SHA-256(canonical_json_dumps(canonical_6_tuple))` does **NOT** return `67A38EB7…16207`; the originally-recorded hash was the strict-proof defect.
- **Canonical 6-tuple (PRESERVED VERBATIM — unchanged by this repair):**
  `{"orchestrator_run_id":"auto-20261004-bug0032-qa","phase_id":"qa","proof_issued_at":"2026-10-04T15:20:00Z","proof_ttl_seconds":3600,"role":"qa","runtime_proof_id":"rp-auto-20261004-bug0032-qa-20261004T152000Z-BUG-0032"}`
- **2-invocation recompute evidence (this segment — `hash_recompute_confirmation=true` BY CONSTRUCTION):**
  - **Invocation 1 (library):** `scripts.token_cost_lib.compute_strict_proof_hash(orchestrator_run_id="auto-20261004-bug0032-qa", runtime_proof_id="rp-auto-20261004-bug0032-qa-20261004T152000Z-BUG-0032", phase_id="qa", role="qa", proof_issued_at="2026-10-04T15:20:00Z", proof_ttl_seconds=3600)` → **`936c72cb0ece913ea5812bcc3da143c2eca5e5e5b72cba194b3ab7300b0606c2`**
  - **Invocation 2 (independent):** `hashlib.sha256(json.dumps({"orchestrator_run_id":"auto-20261004-bug0032-qa","phase_id":"qa","proof_issued_at":"2026-10-04T15:20:00Z","proof_ttl_seconds":3600,"role":"qa","runtime_proof_id":"rp-auto-20261004-bug0032-qa-20261004T152000Z-BUG-0032"}, sort_keys=True, separators=(",",":")).encode()).hexdigest()` → **`936c72cb0ece913ea5812bcc3da143c2eca5e5e5b72cba194b3ab7300b0606c2`**
  - **Result:** Invocation 1 == Invocation 2 → **identical (MATCH)**. Case-insensitively identical to verify-work's recompute of record (`sprints/S0166/verify-work-findings.md` L35 / L119 / L222: `936C72CB0ECE913EA5812BCC3DA143C2ECA5E5E5B72CBA194B3AB7300B0606C2`). **`hash_recompute_confirmation=true` BY CONSTRUCTION.**
- **Recompute-MATCH consumed chain (this segment's re-verification of the execute proof — consumed-chain integrity preserved)**:
  - Execute: `rp-auto-20261004-bug0032-execute-dev-20261004T144000Z-BUG-0032` / `1FE73AADB75ABA11DEA63BECE0C825F82FD3862FADB775ED9ECFCF364E7DD0C2` — **recompute-MATCH** (independent of B-1; the B-1 defect was confined to the S0166 QA leaf)
  - Architecture: `rp-auto-20261004-bug0032-architecture-techlead-20261004T130000Z-BUG-0032` / `2E9110423B60C79497B25B2A67CD77ED78334280CBB07893B69BB05EA627E08F` — **recompute-MATCH** (verify-work's control; not re-run here; chain intact)
  - Research: `rp-auto-20261003-bug0032-research-techlead-20261003T160000Z-BUG-0032` / `A3107ED0915759326A4C0450143CF4551D6AF81429C52498879C504FE9C910AC` — **recompute-MATCH** (chain intact)
  - S0165 (BUG-0035, terminal) control chain — **recompute-MATCH** at verify-work (70EF7A3F…/E24B3302…/E3018317…); unchanged by this segment
  - **7/7 non-QA-S0166 chain proofs recompute-MATCH** (verify-work's independent control); the single previously-failing leaf (S0166 QA phase) is now **repaired by construction**.
- **6 QA-owned sites updated in this segment** (each now carries the recompute-confirmed hash `936C72CB…0606C2` + a transparent re-attestation note; the originally-corrected defective value `67A38EB7…16207` is referenced only as the prior recorded value in the re-attestation note, for audit transparency):
  1. `handoffs/qa_to_verify_work.md` — L16 (qa_phase `proof_hash`), L38 (summary "My fresh QA proof"), L89 (bottom "Own proof hash") + top-of-file re-attestation note
  2. `sprints/S0166/qa-findings.md` — L14 (`proof_hash` metadata) + L141 (bottom "Own proof hash") + this checkpoint block + top-of-file re-attestation note
  3. `sprints/S0166/uat.json` — L118 (`qa_phase.proof_hash`, nested) + L158 (top-level `proof_hash`); `proof_hash_reattestation_note` added to both sites (valid JSON confirmed)
  4. `sprints/S0166/plan-verify.json` — L66 (`qa_proof_hash`); `qa_proof_hash_reattestation_note` added (valid JSON confirmed)
  5. `docs/engineering/state.md` — L4086 (`proof_hash` in the S0166 QA checkpoint block) + L4088 (`hash_recompute_confirmation` note) replaced with the re-attested value + transparent note; this appended checkpoint (L4210+) is the durable re-attestation record
  6. *(This 6th "location" per the task's enumeration corresponds to the S0166 QA phase's recorded proof-hash pair as cited in the 5 files above — the 6th "site" refers to the L4088 `hash_recompute_confirmation` line, which is a separate QA-owned attestation line adjacent to L4086. All 6 sites (L16, L38, L89 in handoff; L14, L141 in qa-findings; L118 + L158 in uat.json; L66 in plan-verify.json; L4086 + L4088 in state.md) now carry the recompute-confirmed value with a re-attestation note.)*

### Scope boundaries honored (re-attestation segment)

- **REPAIRED** by construction: B-1 (S0166 QA-phase strict-proof: recorded `proof_hash` ≠ deterministic SHA-256 of recorded canonical payload). Across all 6 QA-owned sites above. **`hash_recompute_confirmation=true` restored by construction** (2-invocation recompute MATCH).
- **NOT TOUCHED / NOT RE-CLAIMED / NOT RE-RUN** (functional slice preserved — already-reproduced, durable, green):
  - 8/8 active + 8/8 template `test_bug0032_*` markers (already ran; not re-run)
  - 7-fixture battery (identity exit 0 + banner; drift/fail-closed per spec) (already ran; not re-run)
  - 4/4 active↔template byte-parity MATCH (already ran; not re-run)
  - US-0131 10/10 (already ran; not re-run)
  - US-0119 invariants + 2 pre-existing N-2 failures (carried, NOT weakened/repaired; not re-run)
  - `bug_issue_validate.py --repo . --check-acceptance` exit 0 (PRE+POST; not re-run)
  - plan-verify 7/7 AC surjection + DC (already re-mapped, intact)
  - N-1 (EXECUTE_CHECKPOINT_MISSING hygiene gap) — carried forward as non-blocking (NOT repaired in this segment — preserve S0165/BUG-0035 precedent)
  - N-2 (US-0119 2 pre-existing matrix-ref failures) — carried forward as non-blocking (NOT weakened/repaired — BUG-0034 owns the stop-matrix registration)
- **NOT PERFORMED** (fail-closed boundaries intact, re-affirmed in this segment):
  - **BUG-0032 Status remains OPEN** (backlog L5676 `Status: OPEN` unchanged; closure owns the flip per US-0045 / BUG-0031 curator 3-allow flip-path, DEC-0152 DENY-FIRST)
  - **AC-1..AC-7 unchecked** (backlog L5682-L5689 `- [ ]` + acceptance L223 `- [ ]` — closure owns the ticks)
  - **NO drift auto-FIX** (operator live-wins sync is T-005 at closure)
  - **NO stop-matrix registration** of `AUTONOMY_FLAGS_DRIFT` (BUG-0034 owns the stop-matrix; R-0156 DQ2 forbids altering stop-matrix logic in this slice)
  - **NO `decisions/DEC-*.md` authored or amended** (DEC-0154 NOT allocated)
  - **NO TUI / RPC / JSON-command / localhost surface restored**
  - **NO `.env` read · NO `npm publish` · NO `git push` · NO live OpenCode / Cursor IDE probe** (UAT_PROBE_FORBIDDEN held)
  - **NO `/auto` invocation · NO subagent spawn · NO phase work beyond this re-attestation segment**
  - **NO status flip · NO AC tick** (this is attestation repair, not re-QA)
- **NOT MUTATED** (verify-work-owned; re-attestation does not alter verify-work's record):
  - `sprints/S0166/verify-work-findings.md` (verify-work's own FAIL record; B-1 detector; unchanged)
  - `handoffs/qa_to_dev.md` (verify-work's routing pointer; unchanged; the orchestrator MAY re-route from `/qa` now, but this segment does NOT mutate that file)
  - `sprints/S0166/uat.md` (UAT is a `/qa`-owned narrative artifact; the machine-readable `uat.json` is the re-attested site; uat.md's UAT rows remain 9/9 as before — no functional change)
  - verify-work's own checkpoint at L4121+ of this state.md (unchanged)

### Next-phase handoff pointer (orchestrator-owned)

After this repair, the S0166/BUG-0032 strict-proof chain is now **internally coherent** (B-1 repaired BY CONSTRUCTION):

`execute (1FE73AAD…7DD0C2) → qa [re-attested 936C72CB…0606C2] → [verify-work must re-run] → release → closure (curator; DEC-0052 sanctioned alternate)`

- **next_phase**: **`/verify-work`** (fresh `qa`; fresh marker + fresh DEC-0038 6-tuple + strict proof) — to re-certify QA_PASS on the now-recompute-confirmed chain (B-1 should be non-blocking on re-run; 2-invocation recompute of the S0166 QA leaf will MATCH the recorded value by construction).
- **then** **`/release`** (fresh release) to pass the 5-gate chain on fresh evidence; then **`/closure`** (fresh `curator`; on this host `qe` unspawnable → **DEC-0052 sanctioned alternate `curator`**) to perform the canonical BUG-0032 DONE flip: backlog `### BUG-0032` L5676 `Status: OPEN`→`Status: DONE` + AC-1..AC-7 L5682-L5689 `- [ ]`→`- [x]` + acceptance L223 `- [ ]`→`- [x]` + `sprints/S0166/closure-verification.md` creation + state.md CLOSURE checkpoint + AC-1 operator live-wins sync decision (T-005) recorded in closure evidence — per the post-BUG-0031 curator 3-allow flip-path (DENY-FIRST, DEC-0152).
- **Do NOT** (from THIS QA re-attestation context): mark BUG-0032 DONE; tick AC-1..AC-7; auto-FIX the drift; register `AUTONOMY_FLAGS_DRIFT` in the stop-matrix; author/amend any `decisions/DEC-*.md`; restore any TUI/RPC/JSON/localhost surface; spawn `/verify-work` / `/release` / `/closure` / `/refresh-context` / `/auto`; npm publish; git push; read `.env`; spawn any subagent. **Orchestrator owns the next spawn per BUG-0006 / US-0048.**

### do_not_claim flags (this re-attestation segment)

`live_ide_pass_claimed=false` (UAT_PROBE_FORBIDDEN held; contract/mock primary — functional slice already-reproduced, NOT re-run); `BUG-0032_DONE_claimed=false`; `BUG-0032_AC_ticks_claimed=false`; `drift_FIXED_claimed=false` (drift-DETECT only); `stop_matrix_mutated=false`; `config/scratchpad_mutated=false`; `DEC_authored_or_amended=false`; `TUI_or_RPC_or_JSON_command_or_localhost_restored=false`; `npm_published=false`; `git_pushed=false`; `env_read=false`; `subagent_spawned=false`; `auto_recurse=false`; `functional_slice_rerun=false` (attestation repair only; functional slice already-reproduced and intact); `AC_reclaimed=false` (no AC re-claimed; existing 7/7 AC + DC PASS preserved from the original QA session); `N1_or_N2_repaired=**false**` (N-1 hygiene + N-2 matrix-ref carried forward as non-blocking; NOT aggravated, NOT repaired in this segment).

### stop_condition (this segment)

**STOP after QA_PASS (re-attested).** Orchestrator MAY re-route from `/qa` → `/verify-work` (fresh qa) on the now-repaired chain. CROSS_MODEL_REVIEW=0 — do NOT spawn sovereign-critic. Do NOT mark BUG-0032 DONE. Do NOT tick AC. Do NOT auto-FIX the drift. Do NOT register in stop-matrix. Do NOT drain BUG-0033/BUG-0034. Do NOT reopen DONE siblings. Do NOT restore TUI/RPC/JSON/localhost. Do NOT spawn `/verify-work` / `/release` / `/closure` / `/refresh-context` / `/auto` from this QA re-attestation subagent (BUG-0006 / US-0048). Do NOT npm-publish. Do NOT git push. Do NOT read `.env`.

---

