---
story_id: BUG-0027
closure_date: 2026-09-21T22:20:00Z
closure_role: curator
pre_closure_status: OPEN
post_closure_status: DONE
release_evidence_refs: ["handoffs/release_queue.md", "handoffs/releases/S0160-release-notes.md", "sprints/S0160/qa-findings.md"]
isolation_evidence: {"phase_id": "closure", "role": "curator", "model_id": "inherit", "fresh_context_marker": "cur-BUG0027-closure-20260921T222000Z-fresh", "timestamp": "2026-09-21T22:20:00Z", "evidence_ref": "sprints/S0160/closure-verification.md"}
runtime_proof: {"runtime_proof_id": "rp-auto-20260921-bug0027-closure-curator-20260921T222000Z-BUG-0027", "proof_hash": "E8F995C57598E8602ECE0BFD3D73D13D4D95F95E23A939C01BCC2F679610183D", "proof_ttl": "2026-09-21T23:20:00Z"}
normalization_notes: "Bug work-item closure: story_id=BUG-0027. qe unavailable → curator alternate per US-0120 / DEC-0051. CROSS_MODEL_REVIEW=0 — no sovereign-critic consume. NB1: live OpenCode CLI/TUI manual-phase UAT_PROBE_FORBIDDEN; contract-test slice PASS only (ten test_bug0027_*). publish deferred. BUG-0022/0026 not drained. BUG-0024 not reopened. No toast-repair claim. No npm publish. No git push."
---

# Closure Verification — BUG-0027 / S0160 / auto-20260921-bug0027

- **story_id** / **bug_id**: BUG-0027
- **sprint_id**: S0160
- **orchestrator_run_id**: auto-20260921-bug0027
- **parent_run**: ir-20260921T190544Z-bug0027
- **closure_date**: 2026-09-21T22:20:00Z (UTC)
- **closure_role**: curator
- **phase_id**: closure (ship macro phase 2 of 3 per DEC-0082)
- **delivery_mode**: ultra_lean
- **macro_phase**: ship
- **model_id**: inherit (CROSS_MODEL_REVIEW=0)
- **fresh_context_marker**: cur-BUG0027-closure-20260921T222000Z-fresh
- **pre_closure_status**: OPEN
- **post_closure_status**: DONE
- **verdict**: **CLOSURE_PASS**

## Input prerequisites (fail-gated — all met)

| # | Prerequisite | Evidence | Status |
|---|---|---|---|
| 1 | `handoffs/release_queue.md` S0160 row `status=released` | S0160 / BUG-0027 / released | **MET** |
| 2 | `handoffs/releases/S0160-release-notes.md` PASS verdict | RELEASE_PASS; bug0027 10/10 | **MET** |
| 3 | `sprints/S0160/qa-findings.md` exists | QA_PASS; blocking_count=0 | **MET** |
| 4 | Release strict proof consumed (not STALE) | `rp-auto-20260921-bug0027-release-release-20260921T221200Z-BUG-0027` / `4B3FAF496F33A53FB75DB67796C44B8F3B60536B3A3BAB8F8A2D1CC41FB67AFE`; ttl `2026-09-21T23:12:00Z`; consumed @22:20:00Z | **MET** |

CROSS_MODEL_REVIEW=0 — sovereign-critic of release not required. No `CLOSURE_RELEASE_EVIDENCE_MISSING` stop condition triggered.

## Canonical status source (US-0045 / DEC-0025)

- **Canonical status owner**: `docs/product/backlog.md` (### BUG-0027 block)
- **Pre-closure**: `Status: OPEN`
- **Post-closure**: `Status: DONE` (mutated by this closure run — target block only)
- **Derived view**: `docs/product/acceptance.md` BUG-0027 primary row `- [ ]` → `- [x]` (NB1 live residual noted inline)
- **Story-block ACs**: backlog AC-1..AC-6 `- [ ]` → `- [x]` (slice contract evidence; NB1 documented)
- **Derived view**: `docs/engineering/state.md` closure checkpoint append-bottom (US-0058 / DEC-0040)

## AC tick summary (contract evidence)

| AC | Closure tick | Evidence basis |
|---|---|---|
| AC-1 | `[x]` | Phase permissions + fail-closed tokens; `test_bug0027_*` slice (no live CLI probe) |
| AC-2 | `[x]` | persistManualPhaseIsolation + denied-persistence tests; no success while persist denied |
| AC-3 | `[x]` | Identity fields + reject `tui-auto`; context propagation markers |
| AC-4 | `[x]` | BUG-0024 scope held; no toast repair; no fabricated proofs |
| AC-5 | `[x]` | `--file`/`--stdin`/`--self-test`; `--repo . --enforce` removed from packs |
| AC-6 | `[x]` | Ten `test_bug0027_*`; parity `--scope bug-0027`; CI UAT_PROBE_FORBIDDEN held |

## Mutations performed (exclusive writes per US-0120 / DEC-0082)

| # | Artifact | Mutation | Ordering |
|---|---|---|---|
| 1 | `docs/product/backlog.md` | ### BUG-0027: `Status: DONE`; AC-1..AC-6 `[x]`; `closure_notes` | 1 |
| 2 | `docs/product/acceptance.md` | BUG-0027 primary row: `- [ ]` → `- [x]` | 2 |
| 3 | `docs/engineering/state.md` | Closure checkpoint append-bottom | 3 |
| 4 | `sprints/S0160/closure-verification.md` | CLOSURE_PASS record (this file) | 4 |
| 5 | `sprints/S0160/summary.md` | Closure lifecycle update | 5 |
| 6 | `handoffs/resume_brief.md` | Closure PASS prepend → `/refresh-context` | 6 |

## Cross-phase ownership guard (US-0061 / DEC-0043)

**Touched**: backlog ### BUG-0027 only; acceptance BUG-0027 row; state closure append; this file; summary; resume_brief prepend.

**NOT touched**: release/QA/UAT artifacts (read-only); BUG-0024 DONE not reopened; BUG-0022/0026 OPEN not drained; npm publish; git push; `/refresh-context` spawn; `.env`; qa-owned surfaces beyond closure reconciliation.

## Release evidence refs

- `handoffs/release_queue.md` (S0160 status=released)
- `handoffs/releases/S0160-release-notes.md` (RELEASE_PASS)
- `sprints/S0160/qa-findings.md` (QA_PASS)
- `sprints/S0160/uat.json` / `uat.md` (7/7; contract_tests_primary)
- `sprints/S0160/release-findings.md`
- `docs/engineering/state.md` (release + this closure checkpoint)

## Isolation evidence (US-0048 / DEC-0029 / US-0104 v2)

- `phase_id=closure`
- `role=curator`
- `bug_id=BUG-0027`
- `sprint_id=S0160`
- `model_id=inherit` (CROSS_MODEL_REVIEW=0)
- `fresh_context_marker=cur-BUG0027-closure-20260921T222000Z-fresh` (NEW per BUG-0006; not reused from release marker release-BUG0027-20260921T221200Z-fresh)
- `timestamp=2026-09-21T22:20:00Z` (UTC)
- `next_scheduled_phase=/refresh-context`
- Fresh curator subagent per BUG-0006 / US-0120 (qe unavailable → curator alternate). Narrow-read only.

## Runtime proof (US-0056 / DEC-0038)

- `orchestrator_run_id=auto-20260921-bug0027`
- `runtime_proof_id=rp-auto-20260921-bug0027-closure-curator-20260921T222000Z-BUG-0027`
- `phase_id=closure`, `role=curator`, `bug_id=BUG-0027`, `sprint_id=S0160`
- `proof_issued_at=2026-09-21T22:20:00Z`
- `proof_ttl_seconds=3600`
- `proof_ttl=2026-09-21T23:20:00Z`
- `proof_hash=E8F995C57598E8602ECE0BFD3D73D13D4D95F95E23A939C01BCC2F679610183D`
- Canonical hashed payload: `{"orchestrator_run_id":"auto-20260921-bug0027","phase_id":"closure","proof_issued_at":"2026-09-21T22:20:00Z","proof_ttl_seconds":3600,"role":"curator","runtime_proof_id":"rp-auto-20260921-bug0027-closure-curator-20260921T222000Z-BUG-0027"}`
- `hash_recompute_confirmation=true` (`compute_strict_proof_hash` → MATCH; 64 hex uppercase)
- Producer release proof consumed: `rp-auto-20260921-bug0027-release-release-20260921T221200Z-BUG-0027` / `4B3FAF496F33A53FB75DB67796C44B8F3B60536B3A3BAB8F8A2D1CC41FB67AFE` (MATCH before TTL)

## Honest residual (NB1)

- **Live OpenCode CLI/TUI manual phase**: not probed at closure (`UAT_PROBE_FORBIDDEN`). AC-1..AC-3 satisfied by **contract-test slice** (ten `test_bug0027_*`) + code-inspection — not a live `command.executed` / persist attestation on a running OpenCode host.
- Residual `OPENCODE_MANUAL_PHASE_PERSIST_NOT_INVOKED` (or related tokens) may still occur on hosts that never fire manual-phase hooks until operator-owned live re-probe after ship.
- `publish_status=deferred-to-operator-confirm`; `npm_published=false`; no git push.
- BUG-0022 / BUG-0026 remain OPEN (not drained). BUG-0024 DONE not reopened; no toast-repair claim.

## Next phase

**`/refresh-context`** (fresh **curator**). Closure does NOT spawn refresh-context. CROSS_MODEL_REVIEW=0 — no critic after closure.
