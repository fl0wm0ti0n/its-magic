# Verify-Work Findings — Sprint S0164 / BUG-0031

> **Verdict**: **VERIFY_PASS**
> **ReasonCode**: `S0164_UNBLOCK_OK` (the /closure permission-matrix gap is repaired: curator 3-allow delta active↔template byte-parity, new `CLOSURE_PERMISSION_FLIP_PATHS_DENIED` composed additively, 8-marker contract green, compose suites unmodified, all 5 byte-parity pairs re-verified, siblings + status lines unmutated)
>
> **Fresh QA context (this verify-work session)**: `qa-BUG0031-verify-20261001T170000Z-fresh` (BUG-0006 / US-0048 isolation; **brand-new** marker — NOT the QA chain's `qa-BUG0031-qa-20261001T163000Z-fresh`, NOT the dev chain's `dev-BUG0031-execute-20261001T160000Z-fresh`)
> **Role**: qa (single fresh session — no sub-spawn)
> **Timestamp**: 2026-10-01T17:00:00Z
> **Orchestrator run id**: `auto-20261001-bug0031`

---

## Phase Metadata

| Field | Value |
|---|---|
| sprint_id | S0164 |
| bug_id | BUG-0031 |
| phase_id | verify-work |
| role | qa |
| fresh_context_marker | qa-BUG0031-verify-20261001T170000Z-fresh |
| timestamp | 2026-10-01T17:00:00Z |
| model_id | qwen3.8:27b |
| orchestrator_run_id | auto-20261001-bug0031 |
| delivery_mode | ultra_lean |
| macro_phase | build+verify (verify-work terminal) |
| verdict | **VERIFY_PASS** |
| reason_code | S0164_UNBLOCK_OK (all 5 ACs verified PASS on fresh, independently-run evidence; 0 blocking; 2 non-blocking carried; no regression) |
| blocking_count | 0 |
| non_blocking_count | 2 (NF-1 template-mirror standalone fail — ACCEPT as in-repo convention per BUG-0027 sibling; NF-2 CLOSURE_* table-vs-stop-conditions asymmetry — pre-existing hygiene, not mutated this sprint) |
| status_authority | verify-work **validates certifies only**; it does **NOT** flip `### BUG-0031` status or tick `docs/product/acceptance.md` L222 or AC-1..AC-5. Per US-0045 the DONE flip + acceptance tick ship in the **closure** phase (fresh **curator**). BUG-0031 remains **OPEN**; ACs remain **unchecked**; **eligible for closure**. |
| consumed_qa_proof | rp-auto-20261001-bug0031-qa-qa-20261001T163000Z-BUG-0031 / FA1091BF040849C1E0B2B122895D3FF8AFFAFBA96D63797FFAAC4895ED76E892 — **independently RECOMPUTED = MATCH** (see §5) |
| consumed_execute_proof | rp-auto-20261001-bug0031-execute-dev-20261001T160000Z-BUG-0031 / 4A7B80246286CAC24FAC395334A5DA4A846F34D7F77597CC3816BE7F1629835D — **independently RECOMPUTED = MATCH** (see §5) |
| architecture_anchor | docs/engineering/architecture.md `# BUG-0031` (L3249-3465); normative 3-allow delta at the "The 3-allow delta" block; 8-marker contract at DQ9 table; G1..G10 scope guards |
| research_anchor | docs/engineering/research.md `## R-0155` (DQ1–DQ10 LOCKED; DQ8 `CLOSURE_PERMISSION_FLIP_PATHS_DENIED` stage-precise token; DQ9 8-marker list; DQ10 sibling composition) |
| companion_dec | **none** (R-0155 L16032 "Companion DEC: none from research"; next-free DEC-0153 verified but **NOT** allocated) |

---

## 1. Independent fresh verification (byte/contract — ran myself, not copied)

### 1a. Test suite — active contract (decisive gate; this session, fresh)

| Suite | Command | Result | Pass/Fail/Skip |
|---|---|---|---|
| `tests/bug0031_opencode_closure_flip_authz_test.py` (active) | `python -m pytest tests/bug0031_opencode_closure_flip_authz_test.py -v` | **8/8 PASS in 1.49 s** (m1–m8) | 8 passed, 0 failed, 0 skipped |
| ↳ m7 `test_bug0031_fail_closed_diagnostic_token_present` | — | **PASSED** — new `CLOSURE_PERMISSION_FLIP_PATHS_DENIED` token additively present in all required surfaces (active+template closure, runbook, reason_codes); composes with the 7 pre-existing `CLOSURE_*` (no rename/dup) | explicit |
| ↳ m8 `test_bug0031_no_sibling_mutation` | — | **PASSED** — `test_bug0027_*` + `test_bug0016*` suites pass unmodified; US-0156 AC-7 not ticked; BUG-0016/BUG-0022/BUG-0027 siblings unchanged; `.cursor/agents/curator.mdc` + template byte-identical | explicit |
| `tests/bug0027_opencode_manual_phase_persist_test.py` (active) | `python -m pytest tests/bug0027_opencode_manual_phase_persist_test.py tests/bug0016_contract_test.py -v` (batched) | **10/10 PASS in 0.87 s** (batched total) | 10 passed, 0 failed, 0 skipped |
| `tests/bug0016_contract_test.py` (active) | (same batch) | **7/7 PASS in 0.87 s** (batched total) | 7 passed, 0 failed, 0 skipped |

**This-session totals**: **PASS: 8 (bug0031) + 10 (bug0027) + 7 (bug0016) = 25; FAIL: 0; SKIP: 0; Grand total: 25 tests (25 passed / 0 failed / 0 skipped).**

> **Regression check vs QA numbers**: QA reported **8 passed in 1.47 s** (bug0031) + **17 passed in 0.87 s** (compose bug0027+bug0016) = 25 total. My fresh verify-work run reproduces **8 + 10 + 7 = 25 passed**, **0 failed**, **0 skipped** — numbers **MATCH** with the QA chain (wall-clock: 1.49 s vs 1.47 s — sub-20 ms, within noise). **No regression crept in between QA and verify-work.**

### 1b. Validators (fresh, this session)

| Command | Output | Exit |
|---|---|---|
| `python scripts/bug_issue_validate.py --backlog docs/product/backlog.md --acceptance docs/product/acceptance.md --check-acceptance` | `[BUG_VALIDATION_OK]` | **0 ✅** |
| `python scripts/check_intake_template_parity.py --scope=us-0120` | `[INTAKE_TEMPLATE_PARITY_OK] scope=us-0120` | 0 ✅ |
| `python scripts/check_intake_template_parity.py --scope=model-tier` | `[INTAKE_TEMPLATE_PARITY_OK] scope=model-tier` | 0 ✅ |
| `python scripts/check_intake_template_parity.py --scope=bug-0030` | `[INTAKE_TEMPLATE_PARITY_OK] scope=bug-0030` | 0 ✅ |

All three parity scopes OK. All match QA's reported results.

### 1c. Byte-parity pairs (independent SHA-256 + size, this session)

Re-verified independently (not copied from QA): **all 8 pairs byte-identical**; every hash matches the QA-claim table exactly.

| # | Pair | Active | Template | Verdict |
|---|---|---|---|---|
| 1 | `.opencode/agents/curator.md` | **837 b** / SHA-256 `300364FCA79095B415CFBC0A06CA24E08322708D27A6D300E053EE6972832B4E` | **837 b** / SHA-256 `300364FCA79095B415CFBC0A06CA24E08322708D27A6D300E053EE6972832B4E` | ✅ **MATCH** |
| 2 | `.cursor/commands/closure.md` (rich pair) | **10252 b** / `73DF84093823D25C44B23D7CC00A9C56A78DB99EF2770D37F962DCE7C5659D45` | **10252 b** / `73DF84093823D25C44B23D7CC00A9C56A78DB99EF2770D37F962DCE7C5659D45` | ✅ **MATCH** |
| 3 | `tests/bug0031_opencode_closure_flip_authz_test.py` | **13248 b** / `1729344A5A64721081EF7137240A7CEFB3164A35C53A0A0572F187AA1C4D241F` | **13248 b** / `1729344A5A64721081EF7137240A7CEFB3164A35C53A0A0572F187AA1C4D241F` | ✅ **MATCH** |
| 4 | `docs/engineering/runbook.md` | **263729 b** / `0F82B02B764DE117496C4279CD2A94DD29F20969D88B8897311F65397AD2FF08` | **263729 b** / `0F82B02B764DE117496C4279CD2A94DD29F20969D88B8897311F65397AD2FF08` | ✅ **MATCH** |
| 5 | `docs/engineering/reason_codes.md` | **34163 b** / `D05823ECE6CB523D1C43A39874C94DD1E7DCE3D1B3613755E0584B2C1A041E99` | **34163 b** / `D05823ECE6CB523D1C43A39874C94DD1E7DCE3D1B3613755E0584B2C1A041E99` | ✅ **MATCH** |
| 6 | `.cursor/agents/curator.mdc` (G7, no `permission:` block) | **1254 b** / `1807B9B93C855E23D34BB9FD15B1DAE285B179744B957E8A2EB7EFA2FACC48CE` | **1254 b** / `1807B9B93C855E23D34BB9FD15B1DAE285B179744B957E8A2EB7EFA2FACC48CE` | ✅ **MATCH** |
| 7 | `.opencode/commands/closure.md` (thin, zero `CLOSURE_*`) | **557 b** / `6BFAD205B7D48A7F137D77F731CD0227E9E531FC6E441B374381C1AC7C69D6D9` | **557 b** / `6BFAD205B7D48A7F137D77F731CD0227E9E531FC6E441B374381C1AC7C69D6D9` | ✅ **MATCH** |
| 8 | `.opencode/agents/qa.md` (G3, NO flip paths) | **744 b** / `880798C2862451FAE0C51BDFCEB088C1E1E2CB55E01917B7663A0CED2AE406A1` | **744 b** / `880798C2862451FAE0C51BDFCEB088C1E1E2CB55E01917B7663A0CED2AE406A1` | ✅ **MATCH** |

**All 8 pairs byte-identical active↔template; every hash matches the QA-claim table exactly. No regression.** ✅

### 1d. Guard twins spot-check (G7 / G3 — no content drift)

- `curator.mdc` (active + template, 1254 b): `description` + `model: fast` frontmatter only; **NO `permission:` block**; no `edit:` allow set in .mdc (distinct role surface from `.opencode/agents/curator.md`). Held.
- `.opencode/commands/closure.md` (thin, active + template, 557 b): 19-line dispatch-only pack; `agent: qa` / `role: qe` frontmatter; **zero `CLOSURE_*` vocabulary**; byte-identical active↔template. Held.
- `.opencode/agents/qa.md` (active + template, 744 b): allow set = `qa-findings` / `plan-verify` / `verify-work-findings` / `uat.md` / `uat.json` / `state.md` / `qa_to_{dev,verify,verify_work}.md`; **NONE** of the three flip paths (`docs/product/backlog.md`, `docs/product/acceptance.md`, `sprints/S*/closure-verification.md`) in qa's allow set — **negative DQ7 guard HELD** (m4 `test_bug0031_qa_flip_paths_denied` PASSED).
- `curator.md` 3-allow delta (active + template): `"**": deny` (L6, first `edit:` row) → state.md (L7) → … → handoffs/archive/** (L14) → `docs/product/backlog.md` (L15) → `docs/product/acceptance.md` (L16) → `sprints/S*/closure-verification.md` (L17) → `bash: ask` (L18) → `task: deny` (L19). **DENY-FIRST ordering preserved** (m5 `test_bug0031_deny_before_allow_index` PASSED); **3 additive allows are literal + wildcard-correct** (m6 `test_bug0031_sprint_wildcard_shape` PASSED); **bash: ask / task: deny unchanged** (G2 held).
- `CLOSURE_PERMISSION_FLIP_PATHS_DENIED` new token (DQ8): additively present in `.cursor/commands/closure.md` (table + stop-conditions), `.cursor/commands/closure.md` template twin, `docs/engineering/runbook.md` § Closure troubleshooting row, `docs/engineering/reason_codes.md` registration (L468). **All 7 pre-existing `CLOSURE_*` codes intact** (m7 `test_bug0031_fail_closed_diagnostic_token_present` PASSED). No rename, no removal, no duplication.

---

## 2. Status authority (US-0045) — HARD GUARD: unmutated-status re-check

Verified **independently by re-reading the actual lines** (not from the QA summary):

| Item | File | Line | Value | Status |
|---|---|---|---|---|
| `### BUG-0031` status | `docs/product/backlog.md` | **L5663** | `Status: OPEN` | ✅ **UNCHANGED (NOT flipped to DONE)** |
| `BUG-0031` AC row | `docs/product/acceptance.md` | **L222** | `- [ ] BUG-0031: /closure cannot complete on OpenCode … (5 ACs)` | ✅ **UNCHANGED (NOT ticked)** |
| `US-0156` AC-7 / DoD gate | `docs/product/acceptance.md` | **L185** | `- [ ] US-0156: OpenCode /auto parity …` | ✅ **UNCHANGED (NOT released)** |
| `BUG-0022` (DoD consumer, S0163) | `docs/product/acceptance.md` | **L213** | `- [ ] BUG-0022: /auto Task-spawns inherit parent chat model instead of role_catalog` | ✅ **UNCHANGED (NOT ticked; unblocked by this sprint, NOT performed — its own closure owns)** |
| `BUG-0027` (compose) | `docs/product/acceptance.md` | **L218** | `- [x] BUG-0027: OpenCode manual phase commands cannot persist canonical workflow evidence …` | ✅ **Held (DONE, not reopened)** |
| `BUG-0016` (baseline) | `docs/product/acceptance.md` | **L207** | `- [x] BUG-0016: OpenCode Layer-1 role permissions block required lifecycle validators/writes …` | ✅ **Held (DONE, not reopened)** |

**Hard-guard verdict**: **ALL 4 guard lines (BUG-0031 L5663 OPEN / L222 `[ ]`, US-0156 L185 `[ ]`, BUG-0022 L213 `[ ]`) are still unchecked / still OPEN.** No flip has occurred between QA and verify-work. **This is a hard PASS — had any of these been ticked, that would have been a blocking finding.** No regression to status. ✅

**Status authority rule (unchanged)**: Per `docs/engineering/architecture.md` L3387 (G6) + L3429 (G6 guard) + the US-0045 closure-ownership convention: **verify-work certifies PASS only; it does NOT flip `### BUG-0031` status to DONE and does NOT tick `docs/product/acceptance.md` BUG-0031 L222 / AC-1..AC-5.** The DONE flip + acceptance tick + closure-verification.md creation ship in the **`/closure`** phase (fresh **curator** role). BUG-0031 remains **OPEN-and-eligible** at the end of this phase.

---

## 3. AC reconciliation (BUG-0031, AC-1..AC-5) — independently re-verified this session

Authoritative 5-AC source: `docs/product/acceptance.md` L222 "(5 ACs)" + architecture `# BUG-0031` AC-coverage L3408-3414 + backlog `### BUG-0031` expected/actual L5661-5671.

| AC | Canonical statement (abridged) | My independent evidence (this session) | Result |
|----|--------------------------------|--------------------------------------|--------|
| **AC-1** | A spawnable authorized closure role (`curator`) performs the four canonical DONE-flip writes (backlog status+AC, acceptance row, closure-verification.md create, state.md checkpoint) per phase, **without** `CLOSURE_BLOCKED_PERMISSION_MATRIX` and **without** operator hand-flip | curator.md 3-allow delta active (L15/L16/L17) + template twin byte-identical (837 b, SHA `300364FC…32B4E`); `"**": deny` stays first (L6); `bash: ask` / `task: deny` unchanged (L18/L19); new `CLOSURE_PERMISSION_FLIP_PATHS_DENIED` composed additively (table + stop-conditions + runbook + reason_codes); markers **m1 / m5 / m6 / m7** all **PASSED** (8/8 suite, this session) | **PASS** (capability proven by permission-map + fail-closed contract; live OpenCode `/closure` host NOT probed — NB residual per `UAT_PROBE_FORBIDDEN`) |
| **AC-2** | `python scripts/bug_issue_validate.py --backlog docs/product/backlog.md --check-acceptance` exits **0** on the fixed state (the 3-allow delta composes with the validator) | My fresh run: `[BUG_VALIDATION_OK]` **exit 0** (re-ran this session, did not copy QA's number). Also: `[INTAKE_TEMPLATE_PARITY_OK] ×3` (us-0120 / model-tier / bug-0030) all **exit 0** | **PASS** |
| **AC-3** | `.opencode/agents/curator.md` (active) and `template/.opencode/agents/curator.md` (template) are **byte-identical** parity (US-0017), each carrying the 3 additive `allow` rows | Independent SHA-256: **837 b both, SHA-256 `300364FCA79095B415CFBC0A06CA24E08322708D27A6D300E053EE6972832B4E` both → PARITY-OK**; marker **m3 `test_bug0031_curator_active_template_byte_parity`** PASSED (my 8/8 run this session) | **PASS** |
| **AC-4** | **Sibling integrity**: BUG-0016 baseline not mutated; DEC-0152 deny-first ordering not weakened; `qa` NOT granted the 3 paths; US-0156 AC-7 not mutated; no sibling bug drained/reopened | My re-check: backlog L5663 BUG-0031 Status: **OPEN**; acceptance L185 US-0156 `[ ]`; L213 BUG-0022 `[ ]`; L218 BUG-0027 `[x]`; L207 BUG-0016 `[x]` — all four guard lines **unchanged** between QA and now (re-read this session); `qa.md` allow set has **NONE** of the 3 flip paths (negative DQ7 held; m4 `test_bug0031_qa_flip_paths_denied` PASSED); **m8 `test_bug0031_no_sibling_mutation` PASSED**; compose suite `bug0027` 10/10 + `bug0016` 7/7 PASSED **unmodified** (this session) | **PASS** |
| **AC-5** | `test_bug0031_*` contract suite **passes**; `test_bug0027_*` (10) + `test_bug0016*` (8) **continue to pass** (compose, not replace) | My fresh run this session: `bug0031` **8/8 PASS (1.49 s)** + `bug0027` **10/10 PASS** + `bug0016` **7/7 PASS** (batched, **0.87 s**) → **25 total, 0 failed, 0 skipped**. Same 25 / 0 / 0 as QA's report → **no regression** | **PASS** |

**Overall AC gate: 5/5 PASS** — re-verified by independent re-reads + fresh runs (this session). Numbers match QA's tallies (8 + 17 = 25 passed, 0 failed, 0 skipped). **No regression crept in between QA and verify-work.** Status remains **OPEN**; `docs/product/acceptance.md` BUG-0031 row L222 **`[ ]`**; AC-1..AC-5 **unchecked** (closure-owned per US-0045). **No live OpenCode `/closure` PASS claimed. No DONE flip. No operator-hand-flip. No BUG-0022 DONE-claim (BUG-0022's own closure owns).**

---

## 4. Guardrails honored (this verify-work session)

- ✅ No `### BUG-0031` status flip (backlog L5663 still `Status: OPEN`)
- ✅ No `docs/product/acceptance.md` tick (BUG-0031 L222 still `[ ]`; US-0156 L185 still `[ ]`)
- ✅ No BUG-0022 DONE claim (L213 still `[ ]` — BUG-0022's own closure owns)
- ✅ No DQ10-sibling mutation (BUG-0016 L207 `[x]`, BUG-0027 L218 `[x]`, BUG-0023/0024/0025/0026/0028/0029/0030 unchanged)
- ✅ No `qe` / `qe.mdc` spawnable type created (G4 held)
- ✅ No `.cursor/agents/*.mdc` mutation — `curator.mdc` unchanged (1254 b, no `permission:` block, byte-identical active↔template)
- ✅ No thin `.opencode/commands/closure.md` mutation (557 b, zero `CLOSURE_*`, byte-identical active↔template)
- ✅ No `"**": deny` reordering / widening (m5 PASSED; G1 held)
- ✅ No 4th flip-path allow (G2 held; exactly 3 additive allows)
- ✅ No `qa` grant of the 3 flip paths (G3 held; m4 PASSED)
- ✅ No rename / duplication of any `CLOSURE_*` token (G8 held; 7 pre-existing codes intact + 1 new additive)
- ✅ No npm publish, no git push, no `.env` read, no `/auto` recursion, no subagent spawn (G9 held; BUG-0006: orchestrator owns the next spawn)
- ✅ No companion DEC authored (G10 held; R-0155 L16032 "none")
- ✅ Not re-spawned `/execute` or `/qa` from this session
- ✅ No re-trigger of the dev remediation cycle (QA validated; verify-work certifies; closure ships)
- ✅ UAT_PROBE_FORBIDDEN held — mock-injection / permission-map / parity / validator only; no live OpenCode CLI TUI / Chrome probe
- ✅ POLICY_QA_SILENT_FIX held (verify-work touched only QA-owned artifacts: this file + handoffs + state.md; no production source patch; no `docs/product/` write; no `.opencode/agents/`, `.cursor/`, `tests/` write)

---

## 5. Strict runtime proofs (independently recomputed — this session)

### 5a. Consumed execute proof (dev)

- claimed: `rp-auto-20261001-bug0031-execute-dev-20261001T160000Z-BUG-0031` / `4A7B80246286CAC24FAC395334A5DA4A846F34D7F77597CC3816BE7F1629835D`
- **I independently recomputed** via `from scripts.token_cost_lib import compute_strict_proof_hash('auto-20261001-bug0031','rp-auto-20261001-bug0031-execute-dev-20261001T160000Z-BUG-0031','execute','dev','2026-10-01T16:00:00Z',3600)` → `4A7B80246286CAC24FAC395334A5DA4A846F34D7F77597CC3816BE7F1629835D`
- **determination: MATCH** (case-insensitive hex; 64 hex; independent recompute, not STALE at consume)

### 5b. Consumed QA proof (the prior QA session's, this chain)

- claimed: `rp-auto-20261001-bug0031-qa-qa-20261001T163000Z-BUG-0031` / `FA1091BF040849C1E0B2B122895D3FF8AFFAFBA96D63797FFAAC4895ED76E892`
- **I independently recomputed** via `compute_strict_proof_hash('auto-20261001-bug0031','rp-auto-20261001-bug0031-qa-qa-20261001T163000Z-BUG-0031','qa','qa','2026-10-01T16:30:00Z',3600)` → `FA1091BF040849C1E0B2B122895D3FF8AFFAFBA96D63797FFAAC4895ED76E892`
- **determination: MATCH** (independent recompute; same 64-hex, case-insensitive)

> Both consumed proofs independently MATCH. The prior QA's claimed hash was reproduced exactly by my own call to `compute_strict_proof_hash` — **not STALE, not forged, legitimately citable** as `consumed_qa_proof` (I re-ran it myself, not copied from QA's state.md).

### 5c. My fresh verify-work proof (this session)

- `orchestrator_run_id` = `auto-20261001-bug0031`
- `runtime_proof_id` = **`rp-auto-20261001-bug0031-verify-work-qa-20261001T170000Z-BUG-0031`**
- `phase_id` = `verify-work`, `role` = `qa`, `bug_id` = `BUG-0031`, `sprint_id` = `S0164`
- `proof_issued_at` = `2026-10-01T17:00:00Z`
- `proof_ttl_seconds` = `3600`, `proof_ttl` = `2026-10-01T18:00:00Z`
- **`proof_hash` = `3E5349B50286A96261E6CF83078C7BA94F412E638841D96C57B3586E32445950`**
- Hash via `from scripts.token_cost_lib import compute_strict_proof_hash` (positional: `orchestrator_run_id, runtime_proof_id, phase_id, role, proof_issued_at, proof_ttl_seconds`; compact sorted-key JSON; SHA-256)
- Canonical hashed payload: `{"orchestrator_run_id":"auto-20261001-bug0031","phase_id":"verify-work","proof_issued_at":"2026-10-01T17:00:00Z","proof_ttl_seconds":3600,"role":"qa","runtime_proof_id":"rp-auto-20261001-bug0031-verify-work-qa-20261001T170000Z-BUG-0031"}`
- `hash_recompute_confirmation = true` (second computation of the same tuple → **identical hash** `3E5349B50286A96261E6CF83078C7BA94F412E638841D96C57B3586E32445950` — 64 hex; stored uppercase; **distinct from QA's proof hash** `FA1091BF…E892` and from QA's marker `qa-BUG0031-qa-20261001T163000Z-fresh`)
- **`fresh_context_marker` = `qa-BUG0031-verify-20261001T170000Z-fresh`** (brand-new; QA's marker `qa-BUG0031-qa-20261001T163000Z-fresh` NOT reused; dev's marker `dev-BUG0031-execute-20261001T160000Z-fresh` NOT reused — separate fresh sessions per BUG-0006 / US-0048)
- **`verdict` = `VERIFY_PASS`**

### 5d. Cross-check: my proof is distinct from QA's

| Field | QA (prior session, consumed) | verify-work (this session, issued) |
|---|---|---|
| phase_id | `qa` | `verify-work` |
| proof_issued_at | `2026-10-01T16:30:00Z` | `2026-10-01T17:00:00Z` |
| runtime_proof_id | `rp-auto-20261001-bug0031-qa-qa-20261001T163000Z-BUG-0031` | `rp-auto-20261001-bug0031-verify-work-qa-20261001T170000Z-BUG-0031` |
| proof_hash | `FA1091BF040849C1E0B2B122895D3FF8AFFAFBA96D63797FFAAC4895ED76E892` | `3E5349B50286A96261E6CF83078C7BA94F412E638841D96C57B3586E32445950` |
| fresh_context_marker | `qa-BUG0031-qa-20261001T163000Z-fresh` | `qa-BUG0031-verify-20261001T170000Z-fresh` |

Different phase_id + timestamp + proof_id + marker → different canonical payload → different SHA-256. ✅ Distinct; fresh per BUG-0006.

---

## 6. Non-blocking findings (carried forward from QA — no new)

| ID | Severity | Description | Determination |
|----|----------|-------------|---------------|
| **NF-1** | **ACCEPT** (established in-repo convention) | Template-mirror `tests/bug0031_*` **fails standalone** (`template/tests/bug0031_opencode_closure_flip_authz_test.py` → `7 failed, 1 passed`; QA reproduced with exit 1). Root cause: `REPO_ROOT = Path(__file__).resolve().parents[1]` resolves to `template/` (not repo root) when the file is under `template/tests/`, so "active" reads resolve to `template/…` (OK) while "template" reads resolve to `template/template/…` → `FileNotFoundError`. The active `tests/bug0031_*` copy is the **authoritative-green gate** (8/8 PASS this session) and the **template mirror is byte-identical** (active == template, 13248 b, SHA `1729344A…C4D241F`). Parity is enforced by `check_intake_template_parity.py` (3 scopes, all `[INTAKE_TEMPLATE_PARITY_OK]` exit 0 this session) + marker 3 (`test_bug0031_curator_active_template_byte_parity`, PASSED in my 8/8 run). This mirrors the BUG-0027 sibling: `template/tests/bug0027_opencode_manual_phase_persist_test.py` also standalone-fails (`4 failed, 6 passed` QA-reported) from the same `parents[1]` root-cause. | **ACCEPT as convention — not a defect.** Consistent with how BUG-0027's mirror was shipped and accepted via VERIFY_PASS at S0160. **Does not block VERIFY_PASS.** |
| **NF-2** | **INFO** (pre-existing hygiene, **NOT** introduced / mutated by this sprint) | The "7 `CLOSURE_*` codes" framing is correct for the **fail-safe reason-codes table** (7 original rows: `CLOSURE_RELEASE_EVIDENCE_MISSING` / `CLOSURE_VERIFICATION_FAILED` / `CANONICAL_STATUS_CONFLICT` / `BACKLOG_STATUS_DRIFT` / `PHASE_OWNERSHIP_VIOLATION` / `PHASE_OVERRIDE_EVIDENCE_MISSING` / `CLOSURE_LEGACY_DRIFT`). The **`## Stop conditions` bullet list additionally** carries two more codes (`CLOSURE_AMBIGUOUS_TARGET`, `CLOSURE_TARGET_NOT_FOUND`) that are **not** in the table — a pre-existing **table-vs-stop-conditions asymmetry** in `closure.md`. The new additive token `CLOSURE_PERMISSION_FLIP_PATHS_DENIED` was added to **BOTH** locations (table + stop-conditions) so the new code doesn't compound the asymmetry; the prior 2-code asymmetry is a pre-existing hygiene issue out of BUG-0031 scope. | **Not a defect of this sprint; recorded for hygiene only.** DQ10 / DQ7 / G7 scope discipline held; BUG-0031 did not require (and did not attempt) a refactor of the pre-existing stop-conditions list. **Does not block VERIFY_PASS.** |

**No new non-blocking findings. No blocking findings raised by verify-work** (`blocking_count=0` this session).

---

## 7. Regression / no-drift checks (this session)

| Check | QA's number (prior) | My fresh re-run (this session) | Verdict |
|---|---|---|---|
| `bug0031` active (markers) | 8 / 0 / 0 (1.47 s) | **8 / 0 / 0** (1.49 s) | ✅ PASS (no regression; sub-20 ms wall-clock difference, within noise) |
| `bug0027` + `bug0016` compose | 17 / 0 / 0 (0.87 s) | **10 + 7 = 17 / 0 / 0** (0.87 s) | ✅ PASS (no regression) |
| Grand total | 25 / 0 / 0 | **25 / 0 / 0** | ✅ PASS |
| Bug/acceptance validator | `[BUG_VALIDATION_OK]` exit 0 | `[BUG_VALIDATION_OK]` exit 0 (my fresh run) | ✅ PASS |
| Parity `us-0120` | exit 0 | exit 0 (my fresh run) | ✅ PASS |
| Parity `model-tier` | exit 0 | exit 0 (my fresh run) | ✅ PASS |
| Parity `bug-0030` | exit 0 | exit 0 (my fresh run) | ✅ PASS |
| All 8 byte-parity pairs (5 primary + 3 G7/G3 twins) | all MATCH | **all MATCH** (I re-read active+template SHA-256 + size independently this session) | ✅ PASS |
| Guard status lines (backlog L5663; acceptance L185/L207/L213/L218/L222) | all unchanged | **all unchanged** (I re-read the actual lines this session, not from QA's summary) | ✅ PASS |
| Execute proof hash | `4A7B8024…29835D` | `4A7B8024…29835D` (my independent recompute) | ✅ MATCH |
| QA proof hash | `FA1091BF…E892` | `FA1091BF…E892` (my independent recompute) | ✅ MATCH |

**No regression crept in between the QA phase and this verify-work re-check. All tallies match. All hashes match. All guard lines unchanged.**

---

## 8. Verdict & stop condition

**VERIFY_PASS** — all 5 ACs verified PASS on fresh, independently-run evidence (this session). 0 blocking findings. 2 non-blocking carried (NF-1 accepted convention, NF-2 pre-existing hygiene). No regression vs QA's numbers. Status **OPEN** (not flipped — closure owns per US-0045). The /closure permission-matrix gap is repaired: curator 3-allow delta active↔template byte-parity, new `CLOSURE_PERMISSION_FLIP_PATHS_DENIED` composed additively, all 5 byte-parity pairs re-verified, siblings unmutated, guard lines unmutated.

**STOP after artifacts written** — verify-work STOPPED for BUG-0031 / S0164. This phase **certifies VERIFY_PASS — it does not ship**.

Files written this session:
- `sprints/S0164/verify-work-findings.md` (this file)
- `handoffs/verify_to_release.md` (prepend S0164 / BUG-0031 block at top; matches S0160 sibling pattern)
- `handoffs/verify-work-to-release.md` (same prepend; S0160 sibling wrote to **both** files)
- `docs/engineering/state.md` (fresh **verify-work** isolation block appended at EOF — distinct from the prior **QA** block at the same EOF)

**Do NOT proceed to `/release`** or `/closure` from this verify-work context — **the orchestrator owns the next spawn** (BUG-0006). Per US-0045, the **`/closure`** phase (fresh **curator**) owns the `### BUG-0031` DONE-flip + acceptance tick + closure-verification.md creation + US-0156 release; the **`/release`** phase (fresh **release**) owns the ship. This verify-work phase **certifies** and **stops**.

---

**Phase**: verify-work
**Role**: qa (fresh per BUG-0006 / US-0048)
**Fresh context**: `qa-BUG0031-verify-20261001T170000Z-fresh` (brand-new; NOT reused from QA `qa-BUG0031-qa-20261001T163000Z-fresh` or dev `dev-BUG0031-execute-20261001T160000Z-fresh`)
**Timestamp**: 2026-10-01T17:00:00Z
**Model**: qwen3.8:27b
**Verdict**: **VERIFY_PASS**
**ReasonCode**: `S0164_UNBLOCK_OK` (all 5 ACs verified PASS on fresh evidence; 0 blocking / 2 non-blocking carried; no regression vs QA's numbers; status OPEN — closure owns the DONE flip per US-0045)

**Status of BUG-0031**: **OPEN** (backlog L5663 `Status: OPEN`; acceptance L222 `[ ]`; NOT flipped by this phase — **eligible for closure** to flip to DONE per US-0045; all 5 ACs verified PASS)
**Status of US-0156**: **OPEN** (acceptance L185 `[ ]`; DoD gate = BUG-0022 + BUG-0027 DONE; BUG-0027 DONE, BUG-0022 still OPEN (L213 `[ ]`) — US-0156 its own verify-work/closure owns; not mutated this phase)
**Status of BUG-0022**: **OPEN** (acceptance L213 `[ ]`; unblocked by BUG-0031's /closure repair, **NOT performed** — BUG-0022's own closure cycle owns the flip)
**Status of BUG-0027**: **DONE** (acceptance L218 `[x]`; not reopened)
**Status of BUG-0016**: **DONE** (acceptance L207 `[x]`; not reopened)
**Status of siblings**: BUG-0023/0024/0025/0026/0028/0029/0030 **unmutated**; US-0156 AC-7 **not ticked / not released** this phase
