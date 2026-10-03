# QA Findings — Sprint S0164 / BUG-0031

## Phase Metadata

| Field | Value |
|-------|-------|
| sprint_id | S0164 |
| bug_id | BUG-0031 (OPEN — NOT marked DONE per US-0045) |
| phase_id | qa |
| role | qa |
| orchestrator_run_id | auto-20261001-bug0031 |
| delivery_mode | ultra_lean |
| macro_phase | build+verify (qa slice; /qa is orchestrator-spawned, not dev-spawned) |
| verdict | **QA_PASS** |
| plan_verify_verdict | ultra_lean merged at /qa — PASS (5/5 AC surjective in sprint-plan + architecture `# BUG-0031` / R-0155 DQ1–DQ10 + 8 `test_bug0031_*`) |
| blocking_count | 0 |
| non_blocking_count | 2 (NF-1 template-mirror standalone convention; NF-2 CLOSURE_* table-vs-stop-conditions nuance) |
| model_id | qwen3.8:27b (role=qa subagent) |
| executed_by | qa subagent (fresh context per BUG-0006 / US-0048) |
| fresh_context_marker | qa-BUG0031-qa-20261001T163000Z-fresh (NEW; not reused from dev `dev-BUG0031-execute-20261001T160000Z-fresh`) |
| timestamp | 2026-10-01T16:30:00Z |
| producer_phase_id | execute |
| producer_role | dev |
| producer_fresh_context_marker | dev-BUG0031-execute-20261001T160000Z-fresh |
| consumed_execute_proof | rp-auto-20261001-bug0031-execute-dev-20261001T160000Z-BUG-0031 / 4A7B80246286CAC24FAC395334A5DA4A846F34D7F77597CC3816BE7F1629835D — independent recompute **MATCH** (not STALE at consume) |
| architecture_anchor | docs/engineering/architecture.md `# BUG-0031` |
| research_anchor | docs/engineering/research.md `## R-0155` (DQ1–DQ10 LOCKED) |
| companion_dec | none (R-0155 L16032; not allocated this phase) |

---

## Verdict rationale

Fresh QA independently re-ran the entire required gate suite from scratch (no numbers copied from
progress.md), recomputed the dev's strict runtime proof hash, re-verified all 5 byte-parity pairs
with independent SHA-256/size tooling, ground-truthed the two dev-flagged items against the actual
bytes, and reconciled each of BUG-0031's 5 ACs against real evidence. Every gate green; the two
dev-flagged items both **resolved in favor of the dev** (no runbook content loss; template-mirror
standalone-fail is an established in-repo convention matching the BUG-0027 sibling).
**No blocking findings.**

- **bug0031 active suite**: `tests/bug0031_opencode_closure_flip_authz_test.py` → **8/8 PASSED** (m1–m8, 1.47s).
- **Compose suites unmodified**: `bug0027` → **10/10 PASSED**; `bug0016` → **7/7 PASSED** (17 collected, 17 passed, 0.87s).
- **Validators**: `bug_issue_validate.py --backlog… --check-acceptance` → `[BUG_VALIDATION_OK]` **exit 0**; `check_intake_template_parity.py` → `--scope=us-0120` / `--scope=model-tier` / `--scope=bug-0030` all **[INTAKE_TEMPLATE_PARITY_OK] exit 0**.
- **Execute proof recompute**: `compute_strict_proof_hash('auto-20261001-bug0031', 'rp-auto-20261001-bug0031-execute-dev-20261001T160000Z-BUG-0031', 'execute', 'dev', '2026-10-01T16:00:00Z', 3600)` → `4a7b80246286cac24fac395334a5da4a846f34d7f77597cc3816be7f1629835d` == claimed `4A7B8024…29835D` → **MATCH** (case-insensitive hex; 64 hex).
- **All 5 byte-parity pairs** independently confirmed (curator 837b / closure 10252b / test 13248b / runbook 263729b / reason_codes 34163b — active SHA-256 == template SHA-256).
- **Runbook content-spot-check (item 1)**: active `runbook.md` still carries the prior-sprint content — `Role catalog enablement recipe` (1) + `resolve_model_for_phase` (1) + `model_provenance` (1) [BUG-0022 addendum], `BUG-0030` (1) section — AND the new additive `CLOSURE_PERMISSION_FLIP_PATHS_DENIED` row (L4358). **No content loss.**
- **Additivity (item 2)**: new token present additively (closure.md active L12/L64/L175 + template twin L12/L64/L175; runbook active L4358; reason_codes active L468). The 7 pre-existing `CLOSURE_*` codes in the fail-safe table are all still present. **No rename/removal/duplication.**
- **Template-mirror standalone (item 3)**: `7 failed, 1 passed` standalone — **accepted as convention**: the BUG-0027 sibling mirror fails identically (`4 failed, 6 passed`) from the same `REPO_ROOT = parents[1]` root-cause; active copy is byte-identical + authoritative-green. See NF-1.
- **Unmutated / status authority**: BUG-0031 `Status: OPEN` (backlog L5663) / acceptance row 222 `[ ]`; US-0156 AC-7 row 185 `[ ]`; BUG-0022 row 213 `[ ]` (unblocked, not performed); BUG-0016 row 207 `[x]`; BUG-0027 row 218 `[x]`. `curator.mdc` + `template/curator.mdc` byte-identical (1254b), no `permission:` block; thin `.opencode/commands/closure.md` pair byte-identical (557b), zero `CLOSURE_*`; `qa.md` active+template byte-identical (744b), **none** of the 3 flip paths in qa's allow set (negative DQ7 guard).

**Honest live residual**: CI cannot prove a **live** OpenCode `/closure` host run to `CLOSURE_PASS`
(`UAT_PROBE_FORBIDDEN` held — the `test_bug0031_*` suite is mock-injection / permission-map
verification only, no live OpenCode spawn or flip). The AC-1 *capability* is proven by the
permission-map + fail-closed contract + compose guards; end-to-end live `RELEASE_PASS → /closure`
completion remains an operator UAT residual post-ship. **No live OpenCode PASS claimed. No
operator-hand-flip. No DONE flip.**

---

## Test plan (this QA pass)

| # | Check | Expected | Result |
|---|---|---|---|
| 1 | Independent AC-1..AC-5 remap vs A1 + tasks | Each AC ≥1 marker/evidence | **PASS** (table below) |
| 2 | Ultra_lean plan-verify merged at /qa | PASS if 5/5 surjective + 8 markers | **PASS** |
| 3 | `pytest tests/bug0031_opencode_closure_flip_authz_test.py -v` | 8/8 `test_bug0031_*` PASS | **8 PASSED (1.47s)** |
| 4 | Compose: `pytest tests/bug0027_opencode_manual_phase_persist_test.py tests/bug0016_contract_test.py` | green, unmodified | **17 PASSED (0.87s): 10 + 7** |
| 5 | `bug_issue_validate.py --backlog… --check-acceptance` | exit 0 | **`[BUG_VALIDATION_OK]` exit 0** |
| 6 | `check_intake_template_parity.py` (3 scopes) | INTAKE_TEMPLATE_PARITY_OK | **OK ×3, exit 0** |
| 7 | Execute proof recompute (`compute_strict_proof_hash`) | MATCH before TTL | **MATCH** `…29835D` |
| 8 | 5 byte-parity pairs (SHA-256 + size) | active == template | **5/5 PARITY-OK** |
| 9 | Runbook content-LOSS spot-check (item 1) | prior-sprint content present | **NO LOSS** (BUG-0022 addendum + BUG-0030 + new row) |
| 10 | New token additivity (item 2) | 7 codes intact + 1 new | **ADDITIVE** (no rename/dup) |
| 11 | Template-mirror standalone (item 3) | accepted vs BUG-0027 precedent | **ACCEPT (convention)** |
| 12 | Status OPEN; acceptance unchecked; siblings unmutated | unchanged | **Held** |
| 13 | UAT probes | live = `UAT_PROBE_FORBIDDEN` | **contract slice only** |
| 14 | Do NOT live-flop, do NOT tick, do NOT restore, no npm/push | held | **Held** |

---

## Independent checks (this QA subagent — re-ran, did not copy)

| Check | Command / method | Result |
|---|---|---|
| Execute proof SHA-256 | `compute_strict_proof_hash` 6-field tuple | **MATCH** `4A7B8024…29835D`; recomputed `4a7b8024…29835d`; ttl `2026-10-01T17:00:00Z`; consumed_at `2026-10-01T16:30:00Z` (before TTL) — **RUNTIME_PROOF_VALID (not STALE)** |
| Pytest bug0031 (active) | `python -m pytest tests/bug0031_opencode_closure_flip_authz_test.py -v` | **8 passed in 1.47s** (m1–m8) |
| Compose bug0027 + bug0016 | `python -m pytest tests/bug0027_opencode_manual_phase_persist_test.py tests/bug0016_contract_test.py -v` | **17 passed in 0.87s** (bug0027 10/10 + bug0016 7/7), unmodified |
| Bug/acceptance validator | `python scripts/bug_issue_validate.py --backlog docs/product/backlog.md --acceptance docs/product/acceptance.md --check-acceptance` | **`[BUG_VALIDATION_OK]` exit 0** |
| Parity (3 scopes) | `python scripts/check_intake_template_parity.py --scope=us-0120 / model-tier / bug-0030` | **`[INTAKE_TEMPLATE_PARITY_OK]` ×3, exit 0** |
| Byte-parity (5 pairs) | independent SHA-256 + size read | **5/5 active==template** (table below) |
| Runbook content-LOSS | token-count of active vs template + spot-read L4347-4371 | **No loss**: BUG-0022 addendum (recipe + `resolve_model_for_phase` + `model_provenance`), BUG-0030 section, + new `CLOSURE_PERMISSION_FLIP_PATHS_DENIED` L4358 |
| New-token additivity | grep active+template closure.md / runbook / reason_codes; 7-code presence | **Additive** — 7 existing + 1 new; `CLOSURE_AMBIGUOUS_TARGET`/`CLOSURE_TARGET_NOT_FOUND` pre-existing (stop-conditions only); no rename/dup |
| Template-mirror standalone (item 3) | `python -m pytest template/tests/bug0031_opencode_closure_flip_authz_test.py -q` | **7 failed, 1 passed** — same `REPO_ROOT=parents[1]` root-cause as BUG-0027 sibling (`template/tests/bug0027_opencode_manual_phase_persist_test.py` → **4 failed, 6 passed**) → **ACCEPT as convention** (NF-1) |
| Curator 3-allow delta (AC-1/3) | read `.opencode/agents/curator.md` L6-19 | `**": deny` (L6) → state.md (L7) → … → handoffs/archive/** (L14) → **backlog.md (L15) / acceptance.md (L16) / sprints/S*/closure-verification.md (L17)** → bash: ask (L18) task: deny (L19) — DENY-FIRST held, append-only, wildcard literal, 3 rows correct order |
| qa negative guard (AC-4) | read `.opencode/agents/qa.md` L5-16 | allow set = qa-findings/plan-verify/verify-work-findings/uat.md/uat.json/state.md/qa_to_{dev,verify,verify_work}.md — **NONE** of the 3 flip paths → **NEGATIVE-GUARD OK** (DQ7) |
| curator.mdc (G7) | read `.cursor/agents/curator.mdc` | `description` + `model: fast` only; **no `permission:` block**; active==template byte-identical (1254b) |
| thin closure.md (G7) | read `.opencode/commands/closure.md` | 19 lines; `agent: qa`; `role: qe`; **zero `CLOSURE_*`**; active==template byte-identical (557b) |
| Status authority spot-checks | backlog L5663; acceptance L185/213/222 | BUG-0031 `Status: OPEN`; BUG-0031 `[ ]`; US-0156 `[ ]`; BUG-0022 `[ ]` (acceptance L213) — all unchanged |
| No `.env` / no status flip | this pass | **held** |
| POLICY_QA_SILENT_FIX | no production source patch | **held** (QA touched only owned artifacts) |

### Byte-parity pairs (independent SHA-256 + size — not test-name inference)

| Pair | Active SHA-256 | Template SHA-256 | Size (both) | Result |
|---|---|---|---|---|
| `.opencode/agents/curator.md` ↔ template | `300364FCA79095B415CFBC0A06CA24E08322708D27A6D300E053EE6972832B4E` | `300364FCA79095B415CFBC0A06CA24E08322708D27A6D300E053EE6972832B4E` | 837 b | **PARITY-OK** |
| `.cursor/commands/closure.md` (rich) ↔ template | `73DF84093823D25C44B23D7CC00A9C56A78DB99EF2770D37F962DCE7C5659D45` | `73DF84093823D25C44B23D7CC00A9C56A78DB99EF2770D37F962DCE7C5659D45` | 10252 b | **PARITY-OK** |
| `tests/bug0031_*` ↔ template | `1729344A5A64721081EF7137240A7CEFB3164A35C53A0A0572F187AA1C4D241F` | `1729344A5A64721081EF7137240A7CEFB3164A35C53A0A0572F187AA1C4D241F` | 13248 b | **PARITY-OK** |
| `docs/engineering/runbook.md` ↔ template | `0F82B02B764DE117496C4279CD2A94DD29F20969D88B8897311F65397AD2FF08` | `0F82B02B764DE117496C4279CD2A94DD29F20969D88B8897311F65397AD2FF08` | 263729 b | **PARITY-OK** |
| `docs/engineering/reason_codes.md` ↔ template | `D05823ECE6CB523D1C43A39874C94DD1E7DCE3D1B3613755E0584B2C1A041E99` | `D05823ECE6CB523D1C43A39874C94DD1E7DCE3D1B3613755E0584B2C1A041E99` | 34163 b | **PARITY-OK** |

All hashes match the dev's claimed table exactly (independently recomputed by QA).

### Untouched / G7 / G3 twins (independent SHA-256 + size)

| Pair | Active SHA-256 | Template SHA-256 | Size (both) | Result |
|---|---|---|---|---|
| `.cursor/agents/curator.mdc` ↔ template | `1807B9B93C855E23D34BB9FD15B1DAE285B179744B957E8A2EB7EFA2FACC48CE` | `1807B9B93C855E23D34BB9FD15B1DAE285B179744B957E8A2EB7EFA2FACC48CE` | 1254 b | **PARITY-OK, no `permission:` block** |
| `.opencode/commands/closure.md` (thin) ↔ template | `6BFAD205B7D48A7F137D77F731CD0227E9E531FC6E441B374381C1AC7C69D6D9` | `6BFAD205B7D48A7F137D77F731CD0227E9E531FC6E441B374381C1AC7C69D6D9` | 557 b | **PARITY-OK, zero `CLOSURE_*`** |
| `.opencode/agents/qa.md` ↔ template | `880798C2862451FAE0C51BDFCEB088C1E1E2CB55E01917B7663A0CED2AE406A1` | `880798C2862451FAE0C51BDFCEB088C1E1E2CB55E01917B7663A0CED2AE406A1` | 744 b | **PARITY-OK, NONE of 3 flip paths in allow set** |

---

## Blocking findings

**None.** (Zero blocking findings — `blocking_count=0`.)

The two dev-flagged items were investigated independently and **resolved in favor of the dev**:

- **Item 1 (runbook content-loss / "restore-then-reapply")** — **NO CONTENT LOSS**. QA confirmed
  (token-count + spot-read) that `docs/engineering/runbook.md` (active, 263729b) still carries BOTH
  prior-sprint sections the dev named AND the new additive row:
  - BUG-0022 remediation addendum present: `Role catalog enablement recipe` (1), `resolve_model_for_phase` (1), `model_provenance` (1) — all at S0163-invariant content.
  - BUG-0030 section present: `BUG-0030` (1).
  - New `CLOSURE_PERMISSION_FLIP_PATHS_DENIED` row present: `CLOSURE_PERMISSION_FLIP_PATHS_DENIED` (1) at L4358; troubleshooting table L4349-4357 intact (7 original rows) + L4358 (new). `CLOSURE_RELEASE_EVIDENCE_MISSING` / `CLOSURE_VERIFICATION_FAILED` / `CLOSURE_LEGACY_DRIFT` all still present (not renamed/replaced).
  - Parity holds byte-for-byte (active == template == 263729b, SHA `0F82B02B…AD2FF08`).
  - **Determination**: the transient `git checkout HEAD` recovery + re-apply left the final state byte-identical to the template twin with all prior-sprint content intact → **not a defect; does not block.**

- **Item 2 (additivity of the 8th token)** — **ADDITIVELY correct**. The new
  `CLOSURE_PERMISSION_FLIP_PATHS_DENIED` is the 8th row in the rich-pair fail-safe table (L175,
  after `CLOSURE_LEGACY_DRIFT` L174), the 5th stop-condition bullet (L64, after `CLOSURE_TARGET_NOT_FOUND` L63), the 8th runbook troubleshooting row (L4358, after `CLOSURE_LEGACY_DRIFT` L4357), and a new reason_codes registration (L468). All 7 pre-existing `CLOSURE_*` codes in the fail-safe table (`CLOSURE_RELEASE_EVIDENCE_MISSING` / `CLOSURE_VERIFICATION_FAILED` / `CANONICAL_STATUS_CONFLICT` / `BACKLOG_STATUS_DRIFT` / `PHASE_OWNERSHIP_VIOLATION` / `PHASE_OVERRIDE_EVIDENCE_MISSING` / `CLOSURE_LEGACY_DRIFT`) are **still present and unmutated**. `CLOSURE_AMBIGUOUS_TARGET` + `CLOSURE_TARGET_NOT_FOUND` (stop-conditions-only, pre-existing) are also still present. **No rename, no removal, no duplication** in closure.md (active + template), runbook (active + template), or reason_codes (active + template). → **not a defect; does not block.**

---

## Non-blocking findings

| ID | Severity | Description | Determination |
|----|----------|-------------|---------------|
| NF-1 | **ACCEPT** | Template-mirror `tests/bug0031_*` fails **standalone** (`template/tests/bug0031_opencode_closure_flip_authz_test.py` → **7 failed, 1 passed**, exit 1). Root cause: `REPO_ROOT = Path(__file__).resolve().parents[1]` resolves to `template/` (not repo root) when the file is under `template/tests/`, so the "active" reads resolve to `template/…` (OK) while the "template" reads resolve to `template/template/…` → `FileNotFoundError`, and the m8 compose-suite subprocess (cwd = `REPO_ROOT` = `template/`) cannot find the sibling suites. | **ACCEPTWITH-RATIONALE — matches the established in-repo convention, not a real defect.** The **BUG-0027 sibling mirror is byte-identical in behavior**: `template/tests/bug0027_opencode_manual_phase_persist_test.py` standalone → **4 failed, 6 passed** (exit 1) from the **same root cause** (QA reproduced it: `FileNotFoundError: …template\template\.opencode\agents\dev.md`). The **active** `tests/bug0031_*` copy is the **authoritative-green gate** (8/8 PASS) and the **template mirror is byte-identical** (active==template, 13248b, SHA `1729344A…C4D241F`), so parity is enforced by `check_intake_template_parity.py` (3 scopes, `[INTAKE_TEMPLATE_PARITY_OK]`, exit 0) + marker 3 (`test_bug0031_curator_active_template_byte_parity`, PASSED in the active suite) rather than by a standalone template pytest. This is consistent with how the BUG-0027 mirror was shipped and accepted via QA_PASS. **Cite**: `template/tests/bug0027_opencode_manual_phase_persist_test.py` (4f/6p standalone) + `tests/bug0031_opencode_closure_flip_authz_test.py:21` (`REPO_ROOT = Path(__file__).resolve().parents[1]`, inherited verbatim by the mirror). **Does not block QA_PASS.** |
| NF-2 | **INFO** — pre-existing, **not** introduced or mutated by this sprint | The curated "7 `CLOSURE_*` codes" is correct for the **fail-safe reason-codes table** (which today has exactly 7 original rows: the new 8th = `CLOSURE_PERMISSION_FLIP_PATHS_DENIED`). The **`## Stop conditions` bullet list** additionally carries two more codes (`CLOSURE_AMBIGUOUS_TARGET`, `CLOSURE_TARGET_NOT_FOUND`) that are **not** in the table and **not** in runbook/reason_codes — a pre-existing table-vs-stop-conditions asymmetry in `closure.md` that the dev's "treat-actual-tables-as-truth" note correctly identified, and which the dev treated as out-of-scope (the new token was added to BOTH locations additively; no existing code renamed/replaced). | **Not a defect of this sprint; recorded for hygiene only.** The DQ10/DQ7/G7 scope discipline held; BUG-0031 does not require (and did not attempt) a refactor of the pre-existing stop-conditions list. QA confirms no rename/removal/duplication as a result of this sprint. **Does not block QA_PASS.** |

---

## AC reconciliation (independent — files + tests vs A1 / R-0155 DQ1–DQ10)

Authoritative 5-AC source: `docs/product/acceptance.md` L222 ("5 ACs") + architecture `# BUG-0031`
AC-coverage L3408-3414 + backlog `### BUG-0031` expected/actual L5661-5671.

| AC | Canonical statement (abridged) | Evidence (artifacts / lines / test) | Result |
|----|--------------------------------|--------------------------------------|--------|
| **AC-1** | A spawnable authorized closure role (`curator`) performs the 4 canonical DONE-flip writes (backlog status+AC, acceptance row, closure-verification.md create, state.md checkpoint) per phase, **without** `CLOSURE_BLOCKED_PERMISSION_MATRIX` and **without** operator hand-flip | `.opencode/agents/curator.md` L6-19: `**":deny`(L6) → state.md(L7) → … → handoffs/archive/** (L14) → **backlog.md(L15)** → **acceptance.md(L16)** → **sprints/S*/closure-verification.md(L17)** → bash:ask(L18)/task:deny(L19). Rich closure pair L12 (DQ6 note) + L64 (stop-cond) + L175 (fail-safe row) all carry `CLOSURE_PERMISSION_FLIP_PATHS_DENIED`; runbook L4358; reason_codes L468. Markers **m1, m2, m5, m6, m7** all **PASSED**. | **PASS** (capability proven by permission-map + fail-closed contract; live host NOT probed — NB residual) |
| **AC-2** | `python scripts/bug_issue_validate.py --backlog docs/product/backlog.md --check-acceptance` exits **0** on the fixed state (3-allow delta composes with the validator) | QA re-ran `bug_issue_validate.py --backlog docs/product/backlog.md --acceptance docs/product/acceptance.md --check-acceptance` → **`[BUG_VALIDATION_OK]` exit 0**; `check_intake_template_parity.py --scope={us-0120,model-tier,bug-0030}` → **`[INTAKE_TEMPLATE_PARITY_OK]` ×3, exit 0**. | **PASS** |
| **AC-3** | `.opencode/agents/curator.md` and `template/.opencode/agents/curator.md` are **byte-identical** parity (US-0017), each carrying the 3 additive `allow` rows | Independent SHA-256: active == template == `300364FCA7…2832B4E`, **837 b** both — **PARITY-OK**. Marker **m3 `test_bug0031_curator_active_template_byte_parity`** PASSED. | **PASS** |
| **AC-4** | **Sibling integrity**: BUG-0016 baseline not mutated; DEC-0152 deny-first ordering not weakened; **`qa` NOT** granted the 3 paths; US-0156 AC-7 not mutated; no sibling bug drained/reopened | `test_bug0016*` 7/7 PASSED unmodified; `test_bug0027_*` 10/10 PASSED unmodified; `.opencode/agents/qa.md` allow set = qa-findings/plan-verify/verify-work-findings/uat.md/uat.json/state.md/qa_to_* (no flip path); **NONE** of the 3 in qa (negative DQ7 guard CONFIRMED); DENY-FIRST held (`**":deny` L6 precedes all new allows); backlog `### BUG-0031` Status: **OPEN** (L5663); US-0156 `[ ]` (acceptance L185); BUG-0022 `[ ]` (acceptance L213) — unblocked, not performed; BUG-0016 `[x]` + BUG-0027 `[x]` baselines held; BUG-0026 `/0028/0029` OPEN held. Marker **m8 `test_bug0031_no_sibling_mutation`** PASSED. | **PASS** |
| **AC-5** | `test_bug0031_*` contract suite **passes**; `test_bug0027_*` (10) + `test_bug0016*` (8) **continue to pass** (compose, not replace) | `tests/bug0031_opencode_closure_flip_authz_test.py` → **8 passed (1.47s)**; `tests/bug0027_opencode_manual_phase_persist_test.py` → **10 passed**; `tests/bug0016_contract_test.py` → **7 passed** (combined 17 passed, 0.87s). | **PASS** |

**Overall AC gate: 5/5 PASS.** — Status remains **OPEN**; `docs/product/acceptance.md` BUG-0031 row
**`[ ]`**; AC-1..AC-5 **unchecked** (verify-work/closure ownership per US-0045). **No live OpenCode
`/closure` PASS claimed. No DONE flip. No operator-hand-flip. No BUG-0022 tick.**

---

## Compose / scope gates met

| Guard | Status |
|-------|--------|
| G1 — `**": deny` NOT reordered, stays first `edit:` row (DENY-FIRST, DEC-0152) | **HELD** (curator.md L6) |
| G2 — `bash: ask` / `task: deny` unchanged; no 4th flip-path allow; state.md already held (DQ4) | **HELD** (curator.md L18-19; state.md L7 already allow) |
| G3 — `qa` NOT granted the 3 flip paths (DQ7) | **HELD** (qa.md — no flip path; marker m4 negative PASSED) |
| G4 — No `qe.md` / `qe.mdc` created (G4 scope-invention guard) | **HELD** (no qe agent file on either surface) |
| G5 — DQ10 siblings not mutated (BUG-0016/0022/0027/0028/0029/0030; US-0156; US-0045/0120/0122 etc.) | **HELD** (status words + checkbox marks unchanged; bug0016 7/7 + bug0027 10/10 PASSED) |
| G6 — No BUG-0031 / BUG-0022 / US-0156-AC-7 flip or tick | **HELD** (backlog L5663 OPEN; acceptance L185/213/222 all `[ ]`) |
| G7 — `.cursor/agents/curator.mdc` + thin `.opencode/commands/closure.md` pair untouched | **HELD** (both byte-identical active↔template, no `permission:` / no `CLOSURE_*`) |
| G8 — No existing `CLOSURE_*` token renamed/rewritten | **HELD** (7 pre-existing codes intact in table + stop-cond + runbook) |
| G9 — No npm publish, no git push, no `.env`, no `/auto` recursion, no subagent spawn | **HELD** |
| G10 — No companion DEC; S0164/ exists (not re-created) | **HELD** |
| DQ6 OpenCode-surface parity note present (rich pair L12; template twin) | **HELD** |
| DQ7 negative: `qa` not in `qe\|curator` closed set | **HELD** |
| DQ9 8-marker contract all pass in active suite | **HELD** (8/8) |
| DQ10 sibling composition | **HELD** |
| `UAT_PROBE_FORBIDDEN` | **HELD** (no live OpenCode probe / no live Chrome) |
| `POLICY_QA_SILENT_FIX` | **HELD** (QA touched only owned artifacts) |

---

## Status authority (this phase DID NOT change any status)

| Item | Status | Authority |
|------|--------|-----------|
| **BUG-0031** | **OPEN** (backlog L5663 `Status: OPEN`; acceptance L222 `[ ]`) | This QA phase **validates only**; US-0045 + closure own the DONE flip. QA did NOT tick or flip. |
| **BUG-0031 AC-1..AC-5** | All **PASS** (verified), still **unchecked** in acceptance.md L222 `[ ]` | QA certifies; closure ticks (US-0045) |
| **US-0156** (DoD consumer) | **OPEN** (acceptance L185 `[ ]`; DoD AC-7 = BUG-0022+BUG-0027 DONE) | DoD gate NOT ticked this phase; US-0156's own verify-work/closure owns it. |
| **BUG-0022** (DoD consumer, S0163) | **OPEN** (acceptance L213 `[ ]`) — **unblocked by this sprint, NOT performed** | BUG-0022's own post-fix closure cycle owns the flip. QA did NOT flip. |
| **BUG-0016** (baseline) | **DONE** (acceptance L207 `[x]`); test_bug0016* 7/7 PASSED unmodified | compose-only; not reopened |
| **BUG-0027** (compose) | **DONE** (acceptance L218 `[x]`); test_bug0027_* 10/10 PASSED unmodified | compose-only; not reopened |

---

## Runtime QA evidence (US-0065)

- `runtime_startup_command`: contract test slice + validators (no live OpenCode)
- `runtime_stack_profile`: python (pytest + scripts/token_cost_lib + scripts/bug_issue_validate + scripts/check_intake_template_parity)
- `runtime_mode`: local
- `runtime_health_target`: n/a (mock-injection permission-map slice)
- `runtime_health_result`: not_applicable
- `runtime_log_summary`: 8 passed (bug0031) + 17 passed (bug0027+bug0016) + 3 parity scopes OK + validator OK + proof MATCH + 5/5 + 3/3 byte-parity (5 deliverables + 3 G7/G3 twins)
- `runtime_retry_count`: 0
- `runtime_final_verdict`: pass
- `runtime_reason_code`: `UAT_PROBE_FORBIDDEN` for live-host slices; contract + parity + validator are the health gate
- `runtime_evidence_refs`: sprints/S0164/qa-findings.md (this file) + state.md QA block (appended)

## Generated-test evidence (US-0066)

- `generated_test_stack_profile`: python
- `generated_test_command`: `python -m pytest tests/bug0031_opencode_closure_flip_authz_test.py -v` (+ compose batch + validators + parity)
- `generated_test_result`: pass
- `generated_test_paths_ref`: `tests/bug0031_opencode_closure_flip_authz_test.py` (8 markers, active) + `template/tests/bug0031_opencode_closure_flip_authz_test.py` (mirror)
- `generated_test_reason_code`: none (pass)

---

## Producer proof consumed (execute → qa)

- `producer_runtime_proof_id` = `rp-auto-20261001-bug0031-execute-dev-20261001T160000Z-BUG-0031`
- `producer_attested_proof_hash` = `4A7B80246286CAC24FAC395334A5DA4A846F34D7F77597CC3816BE7F1629835D`
- Independent `compute_strict_proof_hash('auto-20261001-bug0031', 'rp-auto-20261001-bug0031-execute-dev-20261001T160000Z-BUG-0031', 'execute', 'dev', '2026-10-01T16:00:00Z', 3600)` → `4a7b80246286cac24fac395334a5da4a846f34d7f77597cc3816be7f1629835d`
- **determination: MATCH** (case-insensitive hex; 64 hex) — NOT STALE at consume (ttl `2026-10-01T17:00:00Z`, consumed_at `2026-10-01T16:30:00Z`)
- `producer_ttl_stale=false`
- `producer_fresh_context_marker`=`dev-BUG0031-execute-20261001T160000Z-fresh`

## Strict runtime proof (DEC-0038) — qa (this subagent, independent)

- `orchestrator_run_id` = `auto-20261001-bug0031`
- `runtime_proof_id` = `rp-auto-20261001-bug0031-qa-qa-20261001T163000Z-BUG-0031`
- `phase_id=qa`, `role=qa`, `bug_id=BUG-0031`, `sprint_id=S0164`
- `proof_issued_at=2026-10-01T16:30:00Z`
- `proof_ttl_seconds=3600`, `proof_ttl=2026-10-01T17:30:00Z`
- `proof_hash=FA1091BF040849C1E0B2B122895D3FF8AFFAFBA96D63797FFAAC4895ED76E892`
- Hash via `from scripts.token_cost_lib import compute_strict_proof_hash` (positional; compact sorted-key JSON; SHA-256)
- Canonical hashed payload: `{"orchestrator_run_id":"auto-20261001-bug0031","phase_id":"qa","proof_issued_at":"2026-10-01T16:30:00Z","proof_ttl_seconds":3600,"role":"qa","runtime_proof_id":"rp-auto-20261001-bug0031-qa-qa-20261001T163000Z-BUG-0031"}`
- `hash_recompute_confirmation=true` (independent recompute → **MATCH**; 64 hex; stored uppercase)

## Isolation evidence (US-0048 / DEC-0029 / US-0104 v2)

- `phase_id=qa`, `role=qa`, `bug_id=BUG-0031`, `sprint_id=S0164`
- `model_id=qwen3.8:27b (role=qa subagent)`; CROSS_MODEL_REVIEW=0 (no sovereign-critic)
- `fresh_context_marker=qa-BUG0031-qa-20261001T163000Z-fresh` (NEW per US-0048 / BUG-0006; **not** reused from dev `dev-BUG0031-execute-20261001T160000Z-fresh`)
- `timestamp=2026-10-01T16:30:00Z` (UTC wall-clock)
- `evidence_ref=sprints/S0164/qa-findings.md; sprints/S0164/progress.md (claims-under-review); docs/engineering/architecture.md # BUG-0031; docs/engineering/research.md ## R-0155; .opencode/agents/curator.md; template/.opencode/agents/curator.md; .opencode/agents/qa.md; .cursor/commands/closure.md; template/.cursor/commands/closure.md; .cursor/agents/curator.mdc; template/.cursor/agents/curator.mdc; .opencode/commands/closure.md; template/.opencode/commands/closure.md; docs/engineering/runbook.md; template/docs/engineering/runbook.md; docs/engineering/reason_codes.md; template/docs/engineering/reason_codes.md; tests/bug0031_opencode_closure_flip_authz_test.py; template/tests/bug0031_opencode_closure_flip_authz_test.py; tests/bug0027_opencode_manual_phase_persist_test.py; tests/bug0016_contract_test.py`
- Fresh qa subagent per BUG-0006 / US-0048; narrow-read + own-artifact-write only. No `.env` read. No BUG-0031/0022/US-0156 status flip or acceptance tick. No sibling reopen/mutation. No `qe`/`qe.mdc` created. No `curator.mdc` / thin `closure.md` pack touch. No `test_bug0027_*` / `test_bug0016*` mutation. No companion DEC. No npm-publish. No git push. No `/verify-work` or `/execute` spawn from this subagent. No live OpenCode CLI TUI / Chrome probe (`UAT_PROBE_FORBIDDEN`).

## Next scheduled phase

- `next_scheduled_phase=/verify-work` (fresh qa subagent per BUG-0006) → then `/closure` (fresh curator) to flip BUG-0022→DONE + tick acceptance + release US-0156 (DoD-gate bugs both DONE) per US-0045.
- `next_scheduled_role=qa` (for /verify-work; closure owned by curator)
- `stop_condition=`STOP after QA_PASS.` Orchestrator owns the next spawn. Do NOT mark BUG-0031 DONE. Do NOT tick acceptance. Do NOT flip/tick BUG-0022 or US-0156 from this QA session. Do NOT perform the S0163/BUG-0022 closure flip (that is BUG-0022's own closure phase). Do NOT restore/modify auto.md. Do NOT reopen any DQ10 sibling. Do NOT npm-publish / git-push. Do NOT spawn /verify-work or /execute from THIS qa subagent.`

---

## Files modified by this QA phase

- `sprints/S0164/qa-findings.md` (NEW — this file)
- `docs/engineering/state.md` (APPENDED — `## QA checkpoint — BUG-0031 / S0164 (role=qa)` isolation block + strict runtime proof + traceability index + isolation evidence + phase boundary status at EOF)

No production source patch. No `docs/product/` write. No `.opencode/agents/`, `.cursor/`, `tests/`, or `handoffs/` (other than owned `qa_to_verify_work.md`) write. `POLICY_QA_SILENT_FIX` held.

---

## Status confirmation (US-0045)

- backlog `### BUG-0031` Status: **OPEN**
- acceptance BUG-0031: **unchecked** (`[ ]` L222)
- AC-1..AC-5: **unchecked** (verify-work/closure)
- US-0156 AC-7 (DoD gate): **unchecked** (`[ ]` L185; not released)
- BUG-0022: **OPEN** (acceptance L213 `[ ]`; unblocked by this sprint, not performed — belongs to its own closure)
- BUG-0016: **DONE** (not reopened)
- BUG-0027: **DONE** (not reopened)
- BUG-0026 / 0028 / 0029: **OPEN** (not mutated)
- BUG-0030: **DONE** (not reopened)
- intake evidence: **not mutated**

---

**Phase: QA**
**Role: qa**
**Timestamp: 2026-10-01T16:30:00Z**
**Model: qwen3.8:27b**
**Verdict: QA_PASS**
**blocking_count: 0; non_blocking_count: 2 (NF-1 accepted-convention; NF-2 pre-existing hygiene)**

**Status: STOP** — Next phase `/verify-work` MUST spawn a fresh QA context (BUG-0006 / US-0048). Orchestrator owns that spawn.
