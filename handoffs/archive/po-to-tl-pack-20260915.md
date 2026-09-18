# PO to TL archive pack (2026-09-15)

- Rollover trigger: `PO_TO_TL_HOT_MAX_LINES=650, PO_TO_TL_HOT_MAX_SECTIONS=60`
- Source: `handoffs/po_to_tl.md`
- Archived units (oldest first, contiguous prefix): 1
- Retained units in hot file: 13
- First archived heading: `## Research handoff — BUG-0023 OpenCode CLI TUI listed `/auto` toasts OPENCODE_AUTO_TUI_DISPATCH_UNSUPPORTED`
- Last archived heading: `## Research handoff — BUG-0023 OpenCode CLI TUI listed `/auto` toasts OPENCODE_AUTO_TUI_DISPATCH_UNSUPPORTED`
- Verification tuple (mandatory):
  - archived_body_lines=48
  - retained_body_lines=637

---

## Research handoff — BUG-0023 OpenCode CLI TUI listed `/auto` toasts OPENCODE_AUTO_TUI_DISPATCH_UNSUPPORTED

- **Phase completed**: research. **Role**: tech-lead. **Bug**: BUG-0023 only. **Sprint**: (pending). **Verdict**: PASS (`decision_gate=false`).
- **Timestamp (UTC)**: 2026-09-13T23:55:00Z. **Fresh marker**: `tl-BUG0023-research-20260913T235500Z-fresh`.
- **Orchestrator**: `orchestrator_run_id=auto-20260913-bug0023`, `parent_orchestrator_run_id=cursor-20260913-BUG0023-intake`, `delivery_mode=ultra_lean`, macro=`plan` (research = first of research+architecture+sprint-plan), `model_id=cursor-grok-4.6-high`, `model_resolve_fallback=MODEL_RESOLVE_FALLBACK` (requested_slug=`gpt-5.6-sol-high`; catalog typically quota-blocked this host; Task.model=`cursor-grok-4.6-high` not inherit), CROSS_MODEL_REVIEW=1, AUTO_QUIET=1, EARLY_RESEARCH=1.
- **Sibling boundary**: BUG-0021 DONE — listing limb remains true; do **not** reopen ACs / S0146. BUG-0020/0019/0018/0017/0015/0016 DONE — compose only; do not reopen. **BUG-0022 OPEN** — do not mutate; do not drain. Do not mutate US-0133..US-0148; do not drain US-0140+ / US-0141 (US-0141 `/research` continues at **R-0138**). Do not prune/touch `.cursor/commands/auto.md` or `.opencode/agents/auto.md`. Cursor `/auto` out of scope. Do **not** restore `.opencode/commands/auto.md`. Do **not** run `--pure`. Do **not** rewrite historical `# BUG-0021`.
- **Research anchor**: `docs/engineering/research.md` **`## R-0137`** (DQ1–DQ8 LOCKED). Discovery D1–D10 not rewritten. Compose **R-0136** / **R-0134** / **R-0124** (do not wipe R-0120..R-0136). Do not reuse R-0133 (BUG-0022) or R-0135 (US-0140).
- **Approach**: **Axis A** recommended. Reject Axis B (other TUI→server invoke), Axis D (markdown/JSON template). Axis C (keep `editor.add`) held as constraint delivered by A.
- **Companion DEC**: **no**. Additive `# BUG-0023` at `/architecture` only — do **not** author it this phase.

### Closed questions DQ1–DQ8

| DQ | Topic | Resolution | LOCK |
|----|-------|------------|------|
| DQ1 | `api.client` vs `.rpc` | `{ id, tui }` `api.client` is generated OpencodeClient; host-true custom methods are `client.rpc(Rpc.define)`; OpenCode.make fallback if `.rpc` missing | LOCKED |
| DQ2 | `Rpc.define` vs plain JSON | **Yes** — `Rpc.define({ id: "its-magic.auto", methods })`; call `runAutoLifecycle(payload)` not `{ input }` | LOCKED |
| DQ3 | `ctx.rpc.register` | Optional today + swallow + plain JSON → unregistered (H3). **Fix**: `await ctx.rpc.register(Defined, impl)` when present | LOCKED |
| DQ4 | HTTP fallback | Host-true HTTP = `OpenCode.make().rpc(Defined)`; invented POST `/rpc/…` `{ input }` is not the happy path | LOCKED |
| DQ5 | Axis B | **Rejected as winner** — no other documented TUI→server custom invoke; Plugin.define TUI re-breaks listing | LOCKED |
| DQ6 | Axis C | Keep `editor.add` execute owner; TUI `run()` dispatches via RPC | LOCKED |
| DQ7 | Tests + DEC | 8 `test_bug0023_*` with mock invoke; **no companion DEC**; `# BUG-0023` supersedes 0021 dispatch claim | LOCKED |
| DQ8 | Upgrade; Axis D | Overwrite dispatch-path onto Axis-A trees; still prune `auto.md`; **reject** markdown template | LOCKED |

### Architecture seeds

- Author `# BUG-0023` (additive; do **not** rewrite `# BUG-0021`). **No new DEC.**
- Seeds T-anch + T-001..T-007 (8 ≤ SPRINT_MAX_TASKS=12).
- Do not restore `auto.md`. Do not reopen BUG-0021 ACs. Do not mutate BUG-0022 / US-0141. Do not implement application code this phase.

### Runtime proof (DEC-0038)

- `runtime_proof_id=rp-auto-20260913-bug0023-research-techlead-20260913T235500Z-BUG-0023`
- `proof_hash=A058F36ECE6A6FD173B1004D50597D3A075A0BD0312D720EB9CBE63F3B20AD7B`
- `proof_ttl=2026-09-14T00:55:00Z`
- Hash via `from scripts.token_cost_lib import compute_strict_proof_hash` (positional; compact sorted-key JSON).
- Canonical hashed payload: `{"orchestrator_run_id":"auto-20260913-bug0023","phase_id":"research","proof_issued_at":"2026-09-13T23:55:00Z","proof_ttl_seconds":3600,"role":"tech-lead","runtime_proof_id":"rp-auto-20260913-bug0023-research-techlead-20260913T235500Z-BUG-0023"}`
- Isolation extras (not hashed): `delivery_mode=ultra_lean`, `macro_phase=plan`, `model_id=cursor-grok-4.6-high`, `model_resolve_fallback=MODEL_RESOLVE_FALLBACK`, `requested_slug=gpt-5.6-sol-high`, `sprint_id=none`, `story_id=BUG-0023`
- `hash_recompute_confirmation=true` (compute_strict_proof_hash → A058F36ECE6A6FD173B1004D50597D3A075A0BD0312D720EB9CBE63F3B20AD7B)
- Consumed discovery proof: `rp-auto-20260913-bug0023-discovery-po-20260913T234500Z-BUG-0023` / `FF27FC4ABB23499336FC068B07F68960B3496FCBE24A79DF6D85FD0F649975AC` — RUNTIME_PROOF_VALID (MATCH before TTL `2026-09-14T00:45:00Z`; consumed_at `2026-09-13T23:55:00Z`; independent recompute MATCH)
- Consumed critic: discovery CRITIC_PASS (`composer-2.5`; anti_slop_aggregate=10; blocking_count=0; `bug0023dsc-*`; no critic `runtime_proof_id` in hot state)

### Isolation + stop

- `phase_id=research`, `role=tech-lead`, `bug_id=BUG-0023`, `fresh_context_marker=tl-BUG0023-research-20260913T235500Z-fresh`, `model_id=cursor-grok-4.6-high`, `model_resolve_fallback=MODEL_RESOLVE_FALLBACK`
- `evidence_ref=docs/engineering/research.md ## R-0137; docs/product/backlog.md ### BUG-0023 research_notes; this handoff; docs/engineering/state.md research checkpoint; handoffs/resume_brief.md; .opencode/plugins/its-magic-auto/tui.ts dispatchRunAutoLifecycle; .opencode/plugins/orchestrator.ts editor.add + ctx.rpc.register; absent .opencode/commands/auto.md`
- **Hot-surface note**: Appended (not prepended) so triad oldest-prefix rollover retains this newest section. Post-append `python scripts/enforce-triad-hot-surface.py --check` PASS (`state` 1199/1200; `po_to_tl` 640/650; `architecture` 2858/3000). No rollover required. Research handoff retained at true end of `po_to_tl.md`.
- **Status**: BUG-0023 remains **OPEN**. Acceptance unchecked. **Next**: `/architecture` in fresh **tech-lead** subagent. Do not spawn architecture from this research chat. STOP.

