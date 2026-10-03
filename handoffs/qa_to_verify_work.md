# Handoff: QA Verify-Work → Orchestrator — BUG-0031 (VERIFY_PASS, /closure permission-matrix repair certified)

## Handoff Metadata

| Field | Value |
|-------|-------|
| from_phase | verify-work |
| to_phase | orchestrator (next step: `/release` or `/closure` per US-0045 ownership; this segment — S0164 / BUG-0031 — UNBLOCKS the `/closure` capability and does NOT perform a BUG-0022 DONE-flip) |
| sprint_id | S0164 |
| bug_id | BUG-0031 |
| timestamp | 2026-10-01T17:00:00Z |
| verdict | **VERIFY_PASS** |
| reason_code | `S0164_UNBLOCK_OK` (5/5 ACs verified PASS on fresh, independently-run evidence; 0 blocking; 2 non-blocking carried (NF-1 accepted convention, NF-2 pre-existing hygiene); no regression vs QA) |
| fresh_context_marker | qa-BUG0031-verify-20261001T170000Z-fresh (brand-new; NOT reused from QA `qa-BUG0031-qa-20261001T163000Z-fresh` or dev `dev-BUG0031-execute-20261001T160000Z-fresh`) |
| runtime_proof_id | rp-auto-20261001-bug0031-verify-work-qa-20261001T170000Z-BUG-0031 |
| proof_hash | **3E5349B50286A96261E6CF83078C7BA94F412E638841D96C57B3586E32445950** (independently recomputed twice → identical; 64 hex; distinct from QA proof hash) |
| canonical_payload | `{"orchestrator_run_id":"auto-20261001-bug0031","phase_id":"verify-work","proof_issued_at":"2026-10-01T17:00:00Z","proof_ttl_seconds":3600,"role":"qa","runtime_proof_id":"rp-auto-20261001-bug0031-verify-work-qa-20261001T170000Z-BUG-0031"}` |
| proof_ttl | 2026-10-01T18:00:00Z |
| consumed_qa_proof | rp-auto-20261001-bug0031-qa-qa-20261001T163000Z-BUG-0031 / FA1091BF040849C1E0B2B122895D3FF8AFFAFBA96D63797FFAAC4895ED76E892 (independent recompute = **MATCH**; not STALE) |
| consumed_execute_proof | rp-auto-20261001-bug0031-execute-dev-20261001T160000Z-BUG-0031 / 4A7B80246286CAC24FAC395334A5DA4A846F34D7F77597CC3816BE7F1629835D (independent recompute = **MATCH**; not STALE) |
| superseded | prior **S0163/BUG-0022** VERIFY_PASS handoff (2026-09-30T00:00:00Z) — **retained on record** in `sprints/S0163/verify-work-findings.md` + `docs/engineering/state.md` (verify-work BUG-0022 block) — this S0164/BUG-0031 handoff REPLACES this single-slot file for the new lifecycle segment |

## Summary

BUG-0031 verify-work **PASSES** on the fresh, independently-run evidence I produced this session (not copied from QA). I re-ran every gate myself, recomputed every hash myself, and re-read every guard status line myself:

Independently re-verified this session (my own runs, not QA's numbers):

- **Test suite** (fresh re-run):
  - `tests/bug0031_opencode_closure_flip_authz_test.py` → **8/8 PASSED in 1.49 s** (m1–m8; QA reported 8/8 in 1.47 s — **MATCH**, no regression; sub-20 ms diff).
  - `tests/bug0027_opencode_manual_phase_persist_test.py` → **10/10 PASSED** (batched).
  - `tests/bug0016_contract_test.py` → **7/7 PASSED** (batched in 0.87 s; QA: 17 in 0.87 s — **MATCH**).
  - **Totals (verify-work): 25 passed / 0 failed / 0 skipped** — matches QA's 25/0/0.
- **Validators / parity** (fresh re-run): `bug_issue_validate.py --backlog… --check-acceptance` → **`[BUG_VALIDATION_OK]` exit 0**; `check_intake_template_parity.py --scope={us-0120, model-tier, bug-0030}` → **`[INTAKE_TEMPLATE_PARITY_OK]` exit 0 ×3** (all match QA).
- **Byte-parity** (independent SHA-256 + size, this session): **all 8 pairs MATCH** (5 primary + 3 G7/G3 twins). Hashes byte-identical to QA's claims (curator.md 837b / closure-rich 10252b / bug0031-test 13248b / runbook 263729b / reason_codes 34163b / curator.mdc 1254b / thin closure.md 557b / qa.md 744b — each active == template). **No drift, no regression.**
- **Guard-status lines** (I re-read the actual `docs/product/backlog.md` L5663 + `docs/product/acceptance.md` L185/L207/L213/L218/L222 lines this session — not from QA's summary): BUG-0031 `Status: OPEN`; BUG-0031 row L222 `[ ]`; US-0156 L185 `[ ]`; BUG-0022 L213 `[ ]`; BUG-0027 L218 `[x]`; BUG-0016 L207 `[x]`. **All four guard lines UNCHANGED** (hard guard PASS — no flip has occurred between QA and verify-work).
- **Consumed proofs** (recomputed independently via `compute_strict_proof_hash`): execute `4A7B8024…29835D` **MATCH**; qa `FA1091BF…E892` **MATCH**. Both NOT STALE, legitimately citable.
- **My fresh verify-work proof**: **`3E5349B50286A96261E6CF83078C7BA94F412E638841D96C57B3586E32445950`** — recomputed twice → identical; 64 hex; distinctly different from QA's `FA1091BF…E892` (different phase_id + timestamp + proof_id → different canonical payload → different SHA-256). `hash_recompute_confirmation=true`.

**AC reconciliation: AC-1..AC-5 all PASS on fresh, independently-run evidence.** The /closure permission-matrix gap is repaired: curator holds the 3 additive `allow` rows (active↔template byte-parity), `CLOSURE_PERMISSION_FLIP_PATHS_DENIED` composes additively (rich pair + runbook + reason_codes, all 7 pre-existing `CLOSURE_*` intact), negative DQ7 guard holds (qa has none of the 3 flip paths), G1 (DENY-FIRST) held, G2 (`bash: ask`/`task: deny` unchanged) held, G3 (qa not granted) held, G7 (curator.mdc/thin-pack untouched) held, G8 (no `CLOSURE_*` rename) held, DQ10 (siblings unmutated) held.

**No live OpenCode `/closure` PASS claimed** (UAT_PROBE_FORBIDDEN held; mock-injection permission-map slice is the gate). No operator hand-flip claimed. No DONE flip performed this phase.

## Status authority (this phase DID NOT change any status)

| Item | Status | Authority |
|------|--------|-----------|
| **BUG-0031** | **OPEN** (backlog L5663 `Status: OPEN`; acceptance L222 `[ ]`; AC-1..AC-5 unchecked) | Per US-0045, verify-work **validates/certifies only**; it does **NOT** flip `### BUG-0031` status to DONE nor tick acceptance.md L222 — that is the **closure phase's** (fresh `curator`) act. This verify-work phase certifies the fix is **ready for closure to ship**. |
| **BUG-0031 AC-1..AC-5** | All **PASS** (independently verified), still **unchecked** in acceptance L222 `[ ]` | verify-work certifies; closure ticks (US-0045) |
| **US-0156** | **OPEN** (acceptance L185 `[ ]`) | DoD gate = BUG-0022 + BUG-0027 DONE; BUG-0027 DONE, BUG-0022 still OPEN (L213 `[ ]`); US-0156's own verify-work/closure owns; **not mutated this phase** |
| **BUG-0022** (S0163, DoD consumer) | **OPEN** (acceptance L213 `[ ]`) — **unblocked by this sprint, NOT performed** | This sprint (BUG-0031) *unblocks* the /closure capability. It does **NOT** trigger S0163/BUG-0022's own closure flip. BUG-0022's own verify-work/closure cycle owns its flip; closure owns per US-0045 |
| **BUG-0027 / BUG-0016** | **DONE** (L218 `[x]` / L207 `[x]`) | compose-only; not reopened |
| **DQ10 siblings** (BUG-0023/0024/0025/0026/0028/0029/0030) | **unmutated** | DQ10 / G5 / G10 composition held |
| **`qe` spawnable type** | **NOT created** (G4 scope-invention guard held) | The sanctioned alternate on OpenCode is the existing spawnable `curator`, not a new `qe` type |

## What the orchestrator does next (NOT this verify-work phase)

Per **US-0045** + the BUG-0006 spawn-only rule, the orchestrator (not this QA context) owns the next spawn. Two legitimate next steps (orchestrator's call, both already queued by prior phases):

- **Option A** — **`/release`** phase (fresh `release` subagent) to ship S0164 / BUG-0031 to DONE + record release notes (the "unblocking repair" segment ships here).
- **Option B** — **`/closure`** phase (fresh `curator` subagent) to perform the canonical `/closure` writes (backlog row → DONE, acceptance row tick, closure-verification.md creation, state.md checkpoint) now that the spawnable `curator` role is **authorized** on the flip paths (that is the exact capability BUG-0031 repaired).

The S0163/BUG-0022 DONE-flip is NOT part of this segment — it belongs to BUG-0022's own lifecycle.

## Stop condition

**VERIFY_PASS** emitted. This verify-work phase **STOPs** after the artifacts are written.

Artifacts written by this verify-work session:
- `sprints/S0164/verify-work-findings.md` (fresh VERIFY_PASS findings — complete)
- `handoffs/qa_to_verify_work.md` (THIS handoff — replaces the prior S0163/BUG-0022 handoff on this single-slot file; S0163/BUG-0022 VERIFY_PASS content remains fully preserved in `sprints/S0163/verify-work-findings.md` + `docs/engineering/state.md` verify-work block)
- `docs/engineering/state.md` (fresh **verify-work** isolation block appended at EOF — distinct from the prior **QA** block at the same EOF; distinct fresh_context_marker + distinct runtime_proof_id + distinct proof_hash)

Do **NOT** proceed to `/release`, `/closure`, or `/refresh-context` from THIS QA context. Do **NOT** mutate any status, tick any acceptance row, claim live OpenCode PASS, claim operator hand-flip, restore any `.mdc` or `auto.md`, reopen any DQ10 sibling, npm publish, git push, or read `.env`. Orchestrator owns the next spawn per BUG-0006 / US-0045.

---

**Verdict**: **VERIFY_PASS**
**ReasonCode**: S0164_UNBLOCK_OK
**Fresh context**: qa-BUG0031-verify-20261001T170000Z-fresh (brand-new; distinct from the QA chain marker)
**Proof hash**: 3E5349B50286A96261E6CF83078C7BA94F412E638841D96C57B3586E32445950 (independently recomputed twice → identical; 64 hex; distinct from QA's FA1091BF…E892)
**Consumed QA proof**: FA1091BF040849C1E0B2B122895D3FF8AFFAFBA96D63797FFAAC4895ED76E892 (independent recompute = MATCH)
**Consumed execute proof**: 4A7B80246286CAC24FAC395334A5DA4A846F34D7F77597CC3816BE7F1629835D (independent recompute = MATCH)
**Model**: qwen3.8:27b (role=qa)
**Timestamp**: 2026-10-01T17:00:00Z
