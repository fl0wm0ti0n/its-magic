# PO to TL archive pack (2026-09-21)

- Rollover trigger: `PO_TO_TL_HOT_MAX_LINES=650, PO_TO_TL_HOT_MAX_SECTIONS=60`
- Source: `handoffs/po_to_tl.md`
- Archived units (oldest first, contiguous prefix): 1
- Retained units in hot file: 15
- First archived heading: `## Architecture handoff — BUG-0024 OpenCode CLI TUI live `/auto` dispatch after Axis A`
- Last archived heading: `## Architecture handoff — BUG-0024 OpenCode CLI TUI live `/auto` dispatch after Axis A`
- Verification tuple (mandatory):
  - archived_body_lines=31
  - retained_body_lines=649

---

## Architecture handoff — BUG-0024 OpenCode CLI TUI live `/auto` dispatch after Axis A

- **Phase completed**: architecture. **Role**: tech-lead. **Bug**: BUG-0024 only. **Sprint**: (pending — expected **S0159** at `/sprint-plan`; S0158 occupied; **not** created this phase). **Verdict**: PASS (`decision_gate=false`).
- **Timestamp (UTC)**: 2026-09-21T19:43:00Z. **Fresh marker**: `tl-BUG0024-architecture-20260921T194300Z-fresh`.
- **Orchestrator**: `orchestrator_run_id=auto-20260921-bug0024`, parent=`cursor-20260913-BUG0024-intake`, `delivery_mode=ultra_lean`, resolved_phase_plan=`[spec, plan, build+verify, ship]`, macro=`plan` (architecture = second of research+architecture+sprint-plan), `model_id=inherit` (CROSS_MODEL_REVIEW=0), AUTO_QUIET=1, AUTO_FLOW_MODE=full_autonomy, AUTO_SOVEREIGN=0, FRAMEWORK_KIT_REPO=1, segment_work_item_kind=`bug`, active_bug_id=`BUG-0024`, bug_queue_position=`1 of 1`.
- **Sibling boundary**: **BUG-0023 DONE** / **BUG-0021 DONE** — compose only (do not reopen ACs / S0148). **BUG-0022 OPEN** — do not merge/drain. **BUG-0027 OPEN** — compose only (do not drain). Do not restore `.opencode/commands/auto.md`. Do not JSON-template `/auto`.
- **Architecture anchor**: `docs/engineering/architecture.md` **`# BUG-0024`**. **Companion DEC**: **none**.
- **Research**: **R-0140** (DQ1–DQ10 unchanged; do not wipe).
- **Approach**: **A1 (A\*) Hybrid residual live-dispatch LOCKED** — peer-branded `@opencode/plugin/rpc` for TUI success; local identity-define load-safe only; stage-distinct `OPENCODE_AUTO_TUI_{MISSING_CLIENT,RPC_ABSENT,DEFINED_UNBRANDED,REGISTER_SKIPPED,MAKE_UNREACHABLE}`; DISPATCH umbrella last; Axis A `client.rpc(Defined)` / `OpenCode.make` held; `{ id, tui }` + `editor.add` held; never silent localhost.

### Locked design (A1)

- Limb order + five stage tokens + DISPATCH umbrella pinned in `# BUG-0024`.
- Eight `test_bug0024_*` contract markers; expected sprint **S0159** (≤12 tasks from T-anch..T-007 seeds).
- Upgrade overwrite live dispatch path + still prune `auto.md`; active↔template parity via `BUG0024_PAIRS`.

### Runtime proof (DEC-0038)

- `runtime_proof_id=rp-auto-20260921-bug0024-architecture-techlead-20260921T194300Z-BUG-0024`
- `proof_hash=5EEEC943224DB73B7A19D222A2178522BFCFF3F00FAC3A1316973A3F464A8915`
- `proof_ttl=2026-09-21T20:43:00Z`
- Canonical hashed payload: `{"orchestrator_run_id":"auto-20260921-bug0024","phase_id":"architecture","proof_issued_at":"2026-09-21T19:43:00Z","proof_ttl_seconds":3600,"role":"tech-lead","runtime_proof_id":"rp-auto-20260921-bug0024-architecture-techlead-20260921T194300Z-BUG-0024"}`
- `hash_recompute_confirmation=true` (compute_strict_proof_hash → 5EEEC943224DB73B7A19D222A2178522BFCFF3F00FAC3A1316973A3F464A8915; independently MATCH; **64 hex** verified; stored uppercase)
- Consumed research proof: `rp-auto-20260921-bug0024-research-techlead-20260921T193700Z-BUG-0024` / `57F066B720A65F5BEE9E380EFB68F7CF1ADBACC9CDDEEEE6395B808D5F91A826` — MATCH; not STALE at `2026-09-21T19:43:00Z` (ttl `2026-09-21T20:37:00Z`)

### Isolation + stop

- `phase_id=architecture`, `role=tech-lead`, `bug_id=BUG-0024`, `model_id=inherit`, `fresh_context_marker=tl-BUG0024-architecture-20260921T194300Z-fresh`
- `evidence_ref=docs/engineering/architecture.md # BUG-0024; docs/engineering/research.md ## R-0140; docs/product/backlog.md ### BUG-0024 architecture_notes; docs/engineering/state.md architecture checkpoint; handoffs/resume_brief.md`
- **Status**: BUG-0024 remains **OPEN**. AC-1..AC-8 remain unchecked. **Next**: `/sprint-plan` in fresh **tech-lead** subagent. CROSS_MODEL_REVIEW=0 — do not spawn sovereign-critic. Do not spawn sprint-plan from this architecture chat. STOP.

