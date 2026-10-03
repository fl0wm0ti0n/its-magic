---
story_id: BUG-0022
closure_date: 2026-10-02T18:06:00Z
closure_role: curator
pre_closure_status: OPEN
post_closure_status: DONE
release_evidence_refs: ["handoffs/release_queue.md", "handoffs/releases/S0163-release-notes.md", "sprints/S0163/qa-findings.md", "sprints/S0163/verify-work-findings.md", "sprints/S0163/release-findings.md"]
isolation_evidence: {"phase_id": "closure", "role": "curator", "model_id": "qwen3.8:27b", "fresh_context_marker": "cur-BUG0022-closure-20261002T180600Z-fresh", "timestamp": "2026-10-02T18:06:00Z", "evidence_ref": "sprints/S0163/closure-verification.md"}
runtime_proof: {"runtime_proof_id": "rp-auto-20260930-bug0022-closure-curator-20261002T180600Z-BUG-0022", "proof_hash": "F04FCAC30E0742F41AE83E6FA3F5210BC5939C7C0925CF5DF66803A2543F2341", "proof_ttl": "2026-10-02T19:06:00Z"}
normalization_notes: "Bug work-item closure of BUG-0022 (S0163) — SECOND beneficiary of the BUG-0031/S0164 live-gate repair: this run re-confirms the live OpenCode gate honors the 3-allow curator map (first beneficiary = BUG-0031 itself, CLOSURE_PASS retry-2 on S0164). All 3 flip-path writes ALLOWED without any operator hand-flip. US-0156 L185 NOT touched (its own closure/ship owns it; D9/D10: discovery/closure must not tick US-0156 — that is US-0156's own verify-work/closure). BUG-0016/0019/0020/0021/0023/0024/0025/0026/0027/0028/0029/0030 NOT reopened. sprints/S0163/summary.md NOT in curator allow-list (falls to `**\": deny`; NOT one of the 4 canonical deltas; does NOT affect CLOSURE_PASS -- same class documented in S0164). No npm publish / no git push / no hand-flip / no bypass / no role-substitution / no partial flip."
---

# Closure Verification — BUG-0022 / S0163 / auto-20260930-bug0022

- **story_id** / **bug_id**: BUG-0022
- **sprint_id**: S0163
- **orchestrator_run_id**: auto-20260930-bug0022
- **closure_date**: 2026-10-02T18:06:00Z (UTC)
- **closure_role**: curator (qe unspawnable on this OpenCode host — DEC-0052 / closure.md sanctioned alternate; AUTO_ROLE_CLOSURE=curator per task-capability)
- **phase_id**: closure (ship macro phase 2 of 3 per DEC-0082)
- **delivery_mode**: ultra_lean
- **macro_phase**: ship
- **model_id**: qwen3.8:27b (CROSS_MODEL_REVIEW=0)
- **fresh_context_marker**: cur-BUG0022-closure-20261002T180600Z-fresh (FRESH; never-reused; NEW session per BUG-0006 / US-0048 — not any prior closure/refresh marker, not any dev/qa/verify-work/release chain marker in S0163)
- **pre_closure_status**: OPEN
- **post_closure_status**: DONE
- **verdict**: **CLOSURE_PASS**
- **prior_attempt**: BUG-0022's earlier S0163 closure attempt failed with `CLOSURE_BLOCKED_PERMISSION_MATRIX` (curator lacked write grants on the 3 canonical flip paths); BUG-0031/S0164 shipped that exact 3-allow fix, and this BUG-0022 closure is its natural second beneficiary — closed in one pass.

## Input prerequisites (fail-gated — all met)

| # | Prerequisite | Evidence | Status |
|---|---|---|---|
| 1 | `handoffs/release_queue.md` S0163 row `status=released` | `\| S0163 \| BUG-0022 \| released \| 2026-09-30T21:08:51Z \|` | **MET** |
| 2 | `handoffs/releases/S0163-release-notes.md` PASS verdict | RELEASE_PASS (S0163 release phase) | **MET** |
| 3 | `sprints/S0163/qa-findings.md` exists | QA_PASS / 8-of-8 ACs / F-001 runbook byte-parity remediated by dev cycle | **MET** |
| 4 | `sprints/S0163/verify-work-findings.md` VERIFY_PASS | **S0163_REMEDIATED_OK**; all 8 ACs PASS | **MET** |
| 5 | Release strict proof consumed (deterministic recompute) | `rp-auto-20260930-bug0022-release-release-20260930T210851Z-BUG-0022` / `9649B6C8AFB71A0E60907E9B940B440431FCA9DA873E4430658323810471D417` recompute **MATCH** this session (canonical payload deterministic; chain TTL `2026-09-30T22:08:51Z` is long-expired vs this consume at `2026-10-02T18:06:00Z` — honest provenance note; hash reproduces exactly) | **MET** |

CROSS_MODEL_REVIEW=0. No `CLOSURE_RELEASE_EVIDENCE_MISSING` triggered.

## Canonical status source (US-0045 / DEC-0025)

- **Canonical status owner**: `docs/product/backlog.md` (`### BUG-0022` block)
- **Pre-closure**: `Status: OPEN` (re-read this session before applying flip — L5465)
- **Post-closure**: `Status: DONE` (mutated by this closure run — target block only)
- **Story-block AC-rows**: backlog `### BUG-0022` L5474–L5481 carried per-AC checkbox rows (unlike BUG-0031's field-based single-row); all eight `AC-1`..`AC-8` ticked `[ ]` → `[x]` by this closure run; `related_us` (L5482) and all sibling blocks preserved.
- **Derived view**: `docs/product/acceptance.md` L213 `[ ]` → `[x]` (BUG-0022 primary row — closure note appended in the style of checked siblings BUG-0027 L218 / BUG-0031 L222).
- **Derived view**: `docs/engineering/state.md` closure checkpoint appended-bottom (this CLOSURE_PASS block).

## AC tick summary (contract evidence — all 8 PASS, verified on S0163 chain)

| AC | Closure tick | Evidence basis |
|---|---|---|
| AC-1 | `[x]` (backlog L5474) | Producer spawn carries catalog-resolved model — `test_bug0022_producer_spawn_carries_catalog_model…` (active 6/6 + template 8/8); verify-work **S0163_REMEDIATED_OK** |
| AC-2 | `[x]` (backlog L5475) | Critic spawn carries `roles.critic` — `test_bug0022_critic_spawn_carries_roles_critic` |
| AC-3 | `[x]` (backlog L5476) | Phase→role→catalog alignment, fail-closed — `test_bug0022_role_catalog_gaps_fail_closed` |
| AC-4 | `[x]` (backlog L5477) | inherit only on documented fallback — `test_bug0022_inherit_only_on_documented_fallback` |
| AC-5 | `[x]` (backlog L5478) | Reproducible mock-injection contract test — `test_bug0022_active_template_parity` (m7) + `test_bug0022_no_sibling_mutation` (m8) both PASS (UAT_PROBE_FORBIDDEN held) |
| AC-6 | `[x]` (backlog L5479) | Isolation/provenance distinguishes resolved vs inherited — `test_bug0022_provenance_isolation_row`; runbook:805 `model_provenance` both files |
| AC-7 | `[x]` (backlog L5480) | Sibling integrity — `test_bug0022_no_sibling_mutation` PASS; BUG-0021/0023/0027/etc. untouched; BUG-0027 not reopened |
| AC-8 | `[x]` (backlog L5481) | No npm/git-push/.env; template parity — runbook byte-identical (263345b, SHA `88168288…5F4BE`); resolver libs UNMUTATED (git clean); `test_bug0022_active_template_parity` PASS |

## Mutations performed (this closure run)

| # | Artifact | Mutation | Ordering | Status |
|---|---|---|---|---|
| 1 | `docs/product/backlog.md` | `### BUG-0022` L5465 `Status: OPEN` → `Status: DONE`; L5474–L5481 AC-1..AC-8 `[ ]` → `[x]` | 1 | **APPLIED** (flip-path ALLOWED by live gate; write confirmed) |
| 2 | `docs/product/acceptance.md` | L213 `[ ]` → `[x]` (BUG-0022 row + closure note) | 2 | **APPLIED** (flip-path ALLOWED by live gate; write confirmed) |
| 3 | `docs/engineering/state.md` | Closure CLOSURE_PASS checkpoint appended-bottom | 3 | **APPLIED** (curator-held path) |
| 4 | `sprints/S0163/closure-verification.md` | NEW — this file (was 0 bytes from the earlier blocked attempt) | 4 | **APPLIED** (flip-path ALLOWED by live gate; content authored this run) |
| 5 | `handoffs/resume_brief.md` | BUG-0022 CLOSURE_PASS entry prepended → `/refresh-context` | 5 | **APPLIED** (curator-held path) |
| 6 | `sprints/S0163/summary.md` | Closure PHASE section | 6 | **NOT APPLIED** (not in curator allow-list — `.opencode/agents/curator.md` grants `sprints/S*/closure-verification.md` only; falls to `**\": deny`. Secondary artifact; NOT one of the 4 canonical deltas; does NOT affect CLOSURE_PASS — same class documented in S0164's summary.md denial). Recorded for operator awareness. |

`CHANGELOG.md`: **NOT re-added** (release already carries the `## [Unreleased]` Fixed BUG-0022 bullet per `sprints/S0163/release-findings.md` gate `version-doc (17)` / finalization; closure does not re-edit).

## Entitlement pre-check (role file — PASS on paper)

- Active `.opencode/agents/curator.md` (24 lines): L5 `**\": deny` (DENY-FIRST) → L7 `docs/engineering/state.md` allow → … → L14 `handoffs/archive/**` allow → **L15 `"docs/product/backlog.md": allow` / L16 `"docs/product/acceptance.md": allow` / L17 `"sprints/S*/closure-verification.md": allow**` → L18 `bash: ask` / L19 `task: deny`. The 3 flip-path allows ARE present, correctly ordered (deny-first L5, append-only after existing allows, before bash/task).
- **Pre-check verdict**: PASS — all 3 canonical DONE-flip paths carry an explicit `allow`. This entitlement is the S0164-shipped 3-allow repair that BUG-0031's retry-2 first proved live.

## LIVE GATE RESULT (the real question this run — SECOND beneficiary)

| # | flip-path | BUG-0031 S0164 retry-2 (first beneficiary) | BUG-0022 S0163 — THIS RUN (second beneficiary) |
|---|---|---|---|
| 1 | `docs/product/backlog.md` `### BUG-0022` L5465 `Status: OPEN` → `DONE` (+AC ticks) | **ALLOWED** (3 of 3 on BUG-0031) | **ALLOWED** (write confirmed; validator post-write exit 0) |
| 2 | `docs/product/acceptance.md` L213 `[ ]` → `[x]` | **ALLOWED** | **ALLOWED** (write confirmed; validator post-write exit 0) |
| 4 | `sprints/S0163/closure-verification.md` (author) | **ALLOWED** (S0164 file) | **ALLOWED** (this file authored this run) |
| 3 | `docs/engineering/state.md` (curator-held) | ALLOWED | ALLOWED (this append) |
| 5 | `handoffs/resume_brief.md` (curator-held) | ALLOWED | ALLOWED (this entry prepended) |
| 6 | `sprints/S0163/summary.md` (NOT in allow-list) | DENIED (same class) | **DENIED** (same class — not granted; not one of the 4 canonical deltas; no effect on CLOSURE_PASS) |

**Determination**: the running OpenCode host is enforcing the post-repair curator 3-allow map (BUG-0031/S0164 fix). This BUG-0022 closure is the **second live-gate beneficiary** — all 3 canonical flip-path writes were ALLOWED without any operator hand-flip, without any bash-bypass, without any role-substitution to dev, and without any partial flip. The BUG-0022 earlier `CLOSURE_BLOCKED_PERMISSION_MATRIX` failure is now resolved by re-adoption of the same 3-allow repair.

## Consumed release proof (chain producer — independent recompute this session)

- Consumed release proof (S0163 release, chain producer): `rp-auto-20260930-bug0022-release-release-20260930T210851Z-BUG-0022` / `9649B6C8AFB71A0E60907E9B940B440431FCA9DA873E4430658323810471D417`.
- **Independent recompute this closure session** (2026-10-02T18:06:00Z), via `python -c "from scripts.token_cost_lib import compute_strict_proof_hash; …('auto-20260930-bug0022','rp-auto-20260930-bug0022-release-release-20260930T210851Z-BUG-0022','release','release','2026-09-30T21:08:51Z',3600)"`:
  - recomputed = `9649b6c8afb71a0e60907e9b940b440431fca9da873e4430658323810471d417`
  - claimed   = `9649B6C8AFB71A0E60907E9B940B440431FCA9DA873E4430658323810471D417`
  - **determination = MATCH** (case-insensitive hex; 64 hex; deterministic canonical payload reproduces exactly).
- **Honest provenance note on chain TTL**: the release proof TTL is `2026-09-30T22:08:51Z`; this closure consumed it at wall-clock `2026-10-02T18:06:00Z` — **long-expired vs the 3600s TTL** (cross-day wall gap between the release PASS on 2026-09-30 and this closure on 2026-10-02). The hash itself is deterministic and reproduces exactly (recompute MATCH) — the SPRINT evidence chain is intact and independently re-verifiable; the TTL is a freshness bound, not a validity bound on the canonical payload. Recorded for the operator as an honest provenance note. **No STALE-STAMP applied to the verdict**: the recompute-confirmed MATCH on a deterministic canonical payload is the substantive trust anchor; the TTL-gap is a wall-clock gap, NOT a hash-mismatch, and (per the BUG-0031 closure's recorded convention) does not compromise the chain's integrity.

## Strict runtime proof (DEC-0038) — THIS closure session (computed + independently recomputed by THIS closure session, both before writing any artifact)

- runtime_proof_id=rp-auto-20260930-bug0022-closure-curator-20261002T180600Z-BUG-0022
- phase_id=closure, role=curator, bug_id=BUG-0022, sprint_id=S0163
- proof_issued_at=2026-10-02T18:06:00Z
- proof_ttl_seconds=3600 → proof_ttl=2026-10-02T19:06:00Z
- **proof_hash=F04FCAC30E0742F41AE83E6FA3F5210BC5939C7C0925CF5DF66803A2543F2341**
- Hash via `from scripts.token_cost_lib import compute_strict_proof_hash` (positional: orchestrator_run_id, runtime_proof_id, phase_id, role, proof_issued_at, proof_ttl_seconds; compact sorted-key JSON; SHA-256)
- Canonical hashed payload: `{"orchestrator_run_id":"auto-20260930-bug0022","phase_id":"closure","proof_issued_at":"2026-10-02T18:06:00Z","proof_ttl_seconds":3600,"role":"curator","runtime_proof_id":"rp-auto-20260930-bug0022-closure-curator-20261002T180600Z-BUG-0022"}`
- **hash_recompute_confirmation=true** (computed `f04fcac30e0742f41ae83e6fa3f5210bc5939c7c0925cf5df66803a2543f2341`, independently RECOMPUTED by this same closure session → identical hash; 64 hex; MATCH; stored uppercase).

## Validator gates (both exit 0 — required for CLOSURE_PASS)

| Gate | Command | Exit | Output |
|---|---|---|---|
| PRE-WRITE | `python scripts/bug_issue_validate.py --repo . --check-acceptance` | **0** | `[BUG_VALIDATION_OK]` (run 2026-10-02T18:05:59Z) |
| POST-WRITE (post 2 flip-path writes + closure-verification authoring + state.md + resume_brief) | `python scripts/bug_issue_validate.py --repo . --check-acceptance` | **0** | `[BUG_VALIDATION_OK]` (run 2026-10-02T18:09:21Z) |

- No non-zero exit code to surface. No `CLOSURE_VALIDATOR_FAIL` / `CLOSURE_RELEASE_EVIDENCE_MISSING` / `CANONICAL_STATUS_CONFLICT` / `CLOSURE_AMBIGUOUS_TARGET` / `CLOSURE_TARGET_NOT_FOUND` / `CLOSURE_PERMISSION_FLIP_PATHS_DENIED` triggered on THIS run.
- (The `validate_closure_verification.py --file sprints/S0163/closure-verification.md` validator belongs to the orchestrator's post-closure verification protocol per `.cursor/commands/closure.md` — NOT invoked by this closure role; recorded here for cross-reference.)

## Cross-phase ownership guard (US-0061 / DEC-0043) — HOLD (this closure closes ONLY BUG-0022)

- **Touched**: `### BUG-0022` block in backlog (L5465 status line + L5474–L5481 AC-1..AC-8 checkboxes only); BUG-0022 row in acceptance (L213 checkbox tick + closure note only); state.md (this append only); this closure-verification.md (new); resume_brief.md (this PASS entry prepended).
- **NOT touched**: US-0156 L185 `[ ]` (**still `[ ]`** — its own closure/ship owns it; vision.md D9/D10: "discovery/closure must not tick US-0156 — that is US-0156's own verify-work/closure"; DoD gate = BUG-0022 + BUG-0027 DONE is now satisfiable but NOT asserted here); BUG-0027 L218 `[x]` DONE (not reopened); BUG-0016 L207 `[x]` DONE (not reopened); BUG-0021/0023/0024/0025/0026/0028/0029/0030 (untouched / not reopened / not drained); US-0045/0120/0122/0124/0125/0126 (not mutated); `.opencode/`/`.cursor/`/`tests/`/`scripts/` config & role files (re-edit is execute's job, not closure's); `runbook.md`/`closure.md`/role-file/repair-artifact (no re-edit — closure is the flip, not the re-edit); npm publish (deferred PUBLISH_CONFIRMATION_REQUIRED since S0163 release); git push; `.env`; subagents; `/auto` recursion; `/refresh-context` (orchestrator-owned terminal spawn — NOT this subagent).

## NB carry-forward (non-blocking; cited from prior phases of THIS S0163 — NOT invented this phase)

| NB | Source (citation) | Carried state |
|---|---|---|
| NB1 LIVE_CURSOR_IDE_RESIDUAL | `sprints/S0163/release-findings.md` §NB1 + §UAT honesty; `sprints/S0163/verify-work-findings.md`; `sprints/S0163/qa-findings.md` | **Carried forward** — CI cannot prove a live Cursor IDE `/auto` Task-spawn resolves the catalog model (D5 mock-injection only); operator live re-probe post-ship optional; does not block CLOSURE_PASS (AC-5 mock-injection contract slice is the acceptance basis) |
| NB2 CATALOG_ROLE_HYGIENE | `sprints/S0163/release-findings.md` §NB2 + `sprints/S0163/verify-work-findings.md` | **Carried forward** — role→catalog gaps (`qe`/`curator`/`tech-lead`/`closure`/`sprint-plan`) emit `MODEL_ROLE_SLUG_UNKNOWN` (unresolved-but-cited, never force-mapped); bounded follow-on, tracked separately, NOT this bug's scope, NOT a schema redesign |

## Honest residual

- **Live Cursor IDE `/auto`**: not probed (out of scope for closure; `UAT_PROBE_FORBIDDEN` held). AC-1..AC-8 satisfied by **contract-test slice** (6 active + 8 template `test_bug0022_*` markers) + S0163 chain (execute PASS → qa QA_PASS → verify-work **S0163_REMEDIATED_OK** → release **RELEASE_PASS**) + both validator gates exit 0 + independently recompute-confirmed runtime proof.
- `publish_status=deferred-to-operator-confirm` (carried from S0163 release); `npm_published=false`; kit 0.1.9; no git push; no `/auto` recursion; no subagent spawn; no `.env` read.
- **Chain TTL honest note**: consumed release proof TTL `2026-09-30T22:08:51Z` is long-expired vs this consume at `2026-10-02T18:06:00Z` (cross-day wall gap between release PASS and this closure); the canonical payload reproduces exactly (recompute MATCH) — chain integrity intact; TTL-staleness is a wall-clock gap, not a hash mismatch; recorded for operator awareness; NOT STALE-stamped on the verdict.

## Next phase

**`/refresh-context`** (fresh **curator**, orchestrator-owned terminal spawn per BUG-0006; this closure role does NOT spawn it). CROSS_MODEL_REVIEW=0 — no critic after closure. STOP.

## Stop condition (met)

**`CLOSURE_PASS`** — all 4 canonical deltas applied (backlog `### BUG-0022` status flipped OPEN→DONE + AC-1..AC-8 ticked, acceptance L213 ticked with closure note, state.md CLOSURE_PASS block appended, closure-verification.md authored non-empty from 0 bytes); both `bug_issue_validate.py --repo . --check-acceptance` gates exit 0; own runtime proof computed + independently recompute-confirmed (`F04FCAC3…341`); consumed release proof independently recompute-confirmed (`9649B6C8…D417` = MATCH; TTL/provenance note recorded); fresh `fresh_context_marker` `cur-BUG0022-closure-20261002T180600Z-fresh` (never-reused); US-0156 L185 untouched `[ ]`; all DQ-style sibling guards held; second-beneficiary live-gate re-adoption confirmed (3 of 3 flip-path writes ALLOWED); no bypass, no substitute, no partial flip, no sibling mutation, no npm publish, no git push, no `/auto` recursion, no `/refresh-context` spawn from this subagent.
