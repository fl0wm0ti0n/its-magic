# PO to TL archive pack (2026-09-13)

- Rollover trigger: `PO_TO_TL_HOT_MAX_LINES=650, PO_TO_TL_HOT_MAX_SECTIONS=60`
- Source: `handoffs/po_to_tl.md`
- Archived units (oldest first, contiguous prefix): 1
- Retained units in hot file: 14
- First archived heading: `## Research handoff — US-0140 Canonical lifecycle and gate orchestrator`
- Last archived heading: `## Research handoff — US-0140 Canonical lifecycle and gate orchestrator`
- Verification tuple (mandatory):
  - archived_body_lines=50
  - retained_body_lines=637

---

## Research handoff — US-0140 Canonical lifecycle and gate orchestrator

- **Phase completed**: research. **Role**: tech-lead. **Story**: US-0140 only. **Sprint**: (pending). **Verdict**: PASS (`decision_gate=false`).
- **Timestamp (UTC)**: 2026-09-13T20:35:00Z. **Fresh marker**: `tl-US0140-research-20260913T203500Z-fresh`.
- **Orchestrator**: `orchestrator_run_id=auto-20260913-us0140`, parent=`auto-20260913-us0139`, `delivery_mode=ultra_lean`, macro=`plan` (research = first of research+architecture+sprint-plan), `model_id=cursor-grok-4.6-high`, CROSS_MODEL_REVIEW=1, AUTO_QUIET=1, EARLY_RESEARCH=1, FRAMEWORK_KIT_REPO=1, drain story 6 of 10.
- **Sibling boundary**: **US-0141..US-0148** OPEN — OUT OF SCOPE this segment (do not mutate). **US-0143** drain/compressed routes OUT. **BUG-0021** OPEN / **BUG-0022** OPEN — do not mutate. **US-0133** / **US-0134** / **US-0135** / **US-0136** / **US-0137** / **US-0138** / **US-0139** DONE — compose only; do not reopen. **BUG-0020** DONE — do not reopen.
- **Research anchor**: `docs/engineering/research.md` **`## R-0135`** (DQ1–DQ10 LOCKED). Discovery D1–D10 not rewritten. Do not wipe R-0120..R-0134. Do not reuse R-0130 (US-0138), R-0131 (BUG-0021 intake), R-0132 (US-0139), R-0133 (BUG-0022), or R-0134 (BUG-0021 research).
- **Approach**: **A1 (A\*)** recommended. Reject A2 (sibling `packages/workflow`), A3 (`role-runtime` fold), A4 (Temporal durable execution), A5 (LangGraph as engine), A6 (copy Python validators), A7 (SQLite as DONE authority), A8 (implement `/auto`/`/quick` drain), A9 (merge release+closure), A10 (rewrite PolicyEngine/config/KernelBridge/`noTools`/context-engine), A11 (require better-sqlite3), A12 (bun:sqlite/sql.js SOT), A13 (resume old Pi session).
- **Companion DEC**: **DEC-0140** Required → Accepted in `/architecture`. Do **not** create `decisions/DEC-0140.md` this phase. Do **not** author `# US-0140`. Recommend architecture H1 **`# US-0140`** (not `## US-`).

### Closed questions DQ1–DQ10

| DQ | Topic | Resolution | LOCK |
|----|-------|------------|------|
| DQ1 | Package + inject | `@its-magic/runtime-core` nested workflow/runs/recovery; nested GateEngine; no Pi; consumers do not import workflow internals | LOCKED |
| DQ2 | CommandRouter | 7-step + KernelBridge consume; `/auto`/`/quick` `WORKFLOW_ROUTE_DEFERRED`; hosts scheduling-only | LOCKED |
| DQ3 | Phase graph | Typed TS graph; ultra_lean skips plan-verify with evidence; manifest extract is v1.x | LOCKED |
| DQ4 | Bounded execute/QA | Consume US-0138 loop keys; critics/security spawn supplementary (content US-0144 OUT) | LOCKED |
| DQ5 | GateEngine | Nested methods; tests→QA→UAT→docs fail-closed; deploy targets US-0145 OUT | LOCKED |
| DQ6 | Closure DONE | Release cannot mark DONE; closure requires release-evidence then KernelBridge reconcile | LOCKED |
| DQ7 | SQLite | `node:sqlite` DatabaseSync; gitignored `.its-magic/runtime/ops.sqlite`; never DONE authority | LOCKED |
| DQ8 | Crash resume | resume_brief + artifacts + ops DB; discardOrphans; fresh correct-role; no Temporal LLM replay | LOCKED |
| DQ9 | Kernel compose | Inject RoleCatalog/policy/config/context/KernelBridge; empty loader + `noTools` held | LOCKED |
| DQ10 | Tests | 12 `test_us0140_*` Win+Linux fake-model covering AC-1..AC-8 | LOCKED |

### Architecture seeds

- Author `# US-0140` + **DEC-0140** (Accepted).
- Seeds T-anch + T-001..T-010 (11 ≤ SPRINT_MAX_TASKS=12).
- Do not expand US-0141+ ACs. Do not amend isolation loader internals / `noTools` / KernelBridge / auth-models / PolicyEngine tables / config loaders / context-engine ranking. Do not implement `standalone/packages/runtime-core` this phase.

### Runtime proof (DEC-0038)

- `runtime_proof_id=rp-auto-20260913-us0140-research-techlead-20260913T203500Z-US-0140`
- `proof_hash=4DA550E5B9F269C5AA621F5A682121A082B155FABDF4C54786BD5538604CEEE2`
- `proof_ttl=2026-09-13T21:35:00Z`
- Hash via `from scripts.token_cost_lib import compute_strict_proof_hash` (positional; compact sorted-key JSON).
- Canonical hashed payload: `{"orchestrator_run_id":"auto-20260913-us0140","phase_id":"research","proof_issued_at":"2026-09-13T20:35:00Z","proof_ttl_seconds":3600,"role":"tech-lead","runtime_proof_id":"rp-auto-20260913-us0140-research-techlead-20260913T203500Z-US-0140"}`
- Isolation extras (not hashed): `delivery_mode=ultra_lean`, `macro_phase=plan`, `model_id=cursor-grok-4.6-high`, `sprint_id=none`, `story_id=US-0140`
- `hash_recompute_confirmation=true` (compute_strict_proof_hash → 4DA550E5B9F269C5AA621F5A682121A082B155FABDF4C54786BD5538604CEEE2)
- Consumed discovery proof: `rp-auto-20260913-us0140-discovery-po-20260913T201500Z-US-0140` / `297A65DF1274B4DC7BD10782CDF794F5E8A0882DFCF0CB8BAD472348F1E9F3EB` — RUNTIME_PROOF_VALID (MATCH before TTL `2026-09-13T21:15:00Z`; consumed_at `2026-09-13T20:35:00Z`; independent recompute MATCH)
- Consumed critic proof: `rp-auto-20260913-us0140-sovereign-critic-techlead-20260913T202500Z-US-0140` / `209EE4747DD662653ED169C674726073197B25A4768F5C83EAB18F96BA9D7994` — RUNTIME_PROOF_VALID (MATCH before TTL `2026-09-13T21:25:00Z`)

### Isolation + stop

- `phase_id=research`, `role=tech-lead`, `story_id=US-0140`, `model_id=cursor-grok-4.6-high`, `fresh_context_marker=tl-US0140-research-20260913T203500Z-fresh`
- `evidence_ref=docs/engineering/research.md ## R-0135; docs/product/backlog.md ## US-0140 research_notes; docs/engineering/state.md research checkpoint; docs/engineering/decisions.md ## DEC-0140 Required stub; handoffs/resume_brief.md`
- **Hot-surface note**: Appended (not prepended) so triad oldest-prefix rollover retains this newest section. Post-append `--check` → STATE_ARCHIVE_REQUIRED `state` 1556/1200 + `po_to_tl` 693/650 → `arch_linkage_guard.py --pre` exit 0 → `--rollover` `rollover_complete units=4,1` pack_state=`docs/engineering/state-archive/state-pack-20260913-cw.md` (archived `## Sovereign-critic checkpoint — qa US-0139` through `## Sovereign-critic checkpoint — verify-work US-0139`; archived_body_lines=361; preamble_lines=11; retained_body_lines=1195) pack_po=`handoffs/archive/po-to-tl-pack-20260913-p.md` (archived `## Research handoff — US-0137`; archived_body_lines=50; retained_body_lines=643) → `--post` exit 0; architecture not rolled; final `--check` PASS.
- **Status**: US-0140 remains **OPEN**. **Next**: sovereign-critic of research, then `/architecture` in fresh **tech-lead** subagent. Do not spawn architecture or critic from this research chat. STOP.

