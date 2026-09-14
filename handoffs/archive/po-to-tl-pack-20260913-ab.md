# PO to TL archive pack (2026-09-13)

- Rollover trigger: `PO_TO_TL_HOT_MAX_LINES=650, PO_TO_TL_HOT_MAX_SECTIONS=60`
- Source: `handoffs/po_to_tl.md`
- Archived units (oldest first, contiguous prefix): 1
- Retained units in hot file: 13
- First archived heading: `## Discovery handoff — BUG-0023 OpenCode CLI TUI listed `/auto` toasts OPENCODE_AUTO_TUI_DISPATCH_UNSUPPORTED`
- Last archived heading: `## Discovery handoff — BUG-0023 OpenCode CLI TUI listed `/auto` toasts OPENCODE_AUTO_TUI_DISPATCH_UNSUPPORTED`
- Verification tuple (mandatory):
  - archived_body_lines=64
  - retained_body_lines=618

---

## Discovery handoff — BUG-0023 OpenCode CLI TUI listed `/auto` toasts OPENCODE_AUTO_TUI_DISPATCH_UNSUPPORTED

- **Phase completed**: discovery. **Role**: po. **Bug**: BUG-0023 only. **Sprint**: (pending). **Verdict**: PASS (`decision_gate=false`).
- **Timestamp (UTC)**: 2026-09-13T23:45:00Z. **Fresh marker**: `po-BUG0023-discovery-20260913T234500Z-fresh`.
- **Orchestrator**: `orchestrator_run_id=auto-20260913-bug0023`, `parent_orchestrator_run_id=cursor-20260913-BUG0023-intake`, `argv=bug-target=BUG-0023`, `delivery_mode=ultra_lean`, resolved_phase_plan=`[spec, plan, build+verify, ship]`, macro=`spec` (intake already DONE — not re-intaken), `model_id=cursor-grok-4.6-high`, `model_resolve_fallback=MODEL_RESOLVE_FALLBACK` (requested_slug=`gpt-5.6-sol-high`; catalog po typically quota-blocked this host; Task.model=`cursor-grok-4.6-high` not inherit), CROSS_MODEL_REVIEW=1, AUTO_QUIET=1, EARLY_RESEARCH=1.
- **Sibling boundary**: BUG-0021 DONE — listing limb remains true; do **not** reopen ACs / S0146. BUG-0020/0019/0018/0017/0015/0016 DONE — compose only; do not reopen. **BUG-0022 OPEN** — do not mutate; do not drain. Do not mutate US-0133..US-0148; do not drain US-0140+. Do not prune/touch `.cursor/commands/auto.md` or `.opencode/agents/auto.md`. Cursor `/auto` out of scope. Do **not** restore `.opencode/commands/auto.md`. Do **not** run `--pure`.
- **Gap confirmed**: Operator on OpenCode **CLI TUI** (`opencode`, not `--pure`) invokes **listed** `/auto` (BUG-0021 `{ id, tui }` + `registerLayer` `slashName: "auto"`). Toast title `its-magic /auto`, body `OPENCODE_AUTO_TUI_DISPATCH_UNSUPPORTED`. Lifecycle does **not** start. Kit `dispatchRunAutoLifecycle` else-path (no usable `client.rpc(ITS_MAGIC_AUTO_RPC).runAutoLifecycle` + HTTP POST `/rpc/its-magic.auto/runAutoLifecycle` failed or `client` missing). Orchestrator still `editor.add` + optional `ctx.rpc.register`. **Absent**: `.opencode/commands/auto.md`. **R-0134 DQ4 / `# BUG-0021` AC-2** “listed `/auto` starts lifecycle” **live-falsified**. Compose **R-0136**. Do not wipe R-0124, R-0131, R-0134, R-0135.

### Discovery locks D1–D10

| ID | Lock |
|----|------|
| **D1** | Outcome: listed OpenCode CLI TUI `/auto` **starts** `runAutoLifecycle` (phase chain begins). Fail-closed `OPENCODE_*` only when the host **truly** cannot dispatch — not as the happy path. Not LLM “Auto mode enabled”. Not markdown STOP. |
| **D2** | Gap class: BUG-0021 dispatch limb **live-falsified**. Distinct from 0021 listing DONE, 0020 desktop, 0019 tokens, 0018 markdown, 0022 inherit. |
| **D3** | Additive `# BUG-0023` later supersedes “listed `/auto` starts lifecycle” claims. Do **not** rewrite historical `# BUG-0021` / `# BUG-0019`. Do **not** reopen BUG-0021 ACs / S0146. |
| **D4** | **Forbidden**: restore STOP-only `.opencode/commands/auto.md`; JSON `commands.auto`+`template`; treat DISPATCH toast as success. |
| **D5** | Fix axes (research picks winner; **must live-fetch OpenCode RPC/TUI client docs**): (A) host-true TUI `api.client.rpc` / HTTP RPC shape so `dispatchRunAutoLifecycle` hits orchestrator `ctx.rpc.register`; (B) other documented TUI→server invoke (not SessionPrompt); (C) keep `editor.add` as execute owner; (D) reject markdown template as fix. |
| **D6** | DISPATCH token remains honest fail-closed **only** when host-true unlistable-dispatch. Do not reuse listing/load/desktop/markdown-collision tokens for this miss. JSON `template` vs plugin `execute` remains 0018-class. |
| **D7** | Additive `test_bug0023_*` must **not** be listing-only or “token string exists”. Prefer host-true mock that `run()` invokes `runAutoLifecycle` (or honest `OPENCODE_*` only when client/RPC truly absent). Keep `test_bug0021_*` / `test_bug0020_*` / `test_bug0019_*` / `test_bug0018_*` compose. |
| **D8** | Out of scope: Cursor `/auto`; BUG-0022; US-0135+; reopen 0015–0021 ACs; `--pure`; restore `auto.md`. |
| **D9** | Done = listed `/auto` **starts lifecycle** (or honest host-true `OPENCODE_*` only if proven unlistable-dispatch). Not DISPATCH toast as happy path. Not LLM Auto mode. |
| **D10** | Active `.opencode/` ↔ `template/.opencode/` parity for TUI dispatch-path change; upgrade `--host opencode\|both` must deliver the chosen surface; leftover `auto.md` still prune. |

### Research questions DQ1–DQ8 (for `/research` → **R-0137**)

1. **DQ1**: Does `{ id, tui }` `tui(api)` `api.client` expose `.rpc(Rpc)` matching public `context.client.rpc(Rpc.define)`, or is it OpencodeClient `.get`/`.post` only? Cite live OpenCode v2 RPC + TUI plugin docs.
2. **DQ2**: Must `ITS_MAGIC_AUTO_RPC` be `Rpc.define({ id, methods })` from `@opencode/plugin/rpc` (not plain JSON) for `client.rpc(...)` to return `runAutoLifecycle`?
3. **DQ3**: Does the CLI TUI host run orchestrator `ctx.rpc.register(ITS_MAGIC_AUTO_RPC, { runAutoLifecycle })`? Optional/skipped → method unregistered even if `client.rpc` exists.
4. **DQ4**: HTTP fallback POST `/rpc/its-magic.auto/runAutoLifecycle` body `{ input }` vs host-true HTTP RPC shape (`OpenCode.make` + `client.rpc`). What shape actually hits `ctx.rpc.register`?
5. **DQ5**: Axis B — other documented TUI→server invoke (not SessionPrompt, not Command.Info template, not LLM chat) if Axis A `client.rpc`/HTTP cannot reach register.
6. **DQ6**: Axis C — keep `editor.add` execute owner; confirm TUI `run()` must reach that execute/`runAutoLifecycle` without becoming the execute owner itself.
7. **DQ7**: `test_bug0023_*` inventory — host-true mock that `run()` invokes `runAutoLifecycle` (or honest `OPENCODE_*` only when client/RPC truly absent). Not listing-only. Not `"OPENCODE_AUTO_TUI_DISPATCH_UNSUPPORTED" in src`. Keep 0021/0020/0019/0018 compose. `UAT_PROBE_FORBIDDEN` remains default unless architecture opts in.
8. **DQ8**: Consumer upgrade for already-Axis-A trees (listing shipped); still prune leftover `auto.md`; active↔template; `--host opencode|both`. Reject Axis D markdown/JSON template.

### Design refs

- Live (intake R-0136; research must re-fetch): `https://opencode.ai/v2/docs/build/plugins/rpc/` (`Rpc.define` + `ctx.rpc.register` + `client.rpc`); Context7 `/anomalyco/opencode` `packages/opencode/specs/tui-plugins.md` (`api.client` is OpencodeClient `.get`/`.post`, not documented `api.client.rpc(Rpc)`)
- Kit: `.opencode/plugins/its-magic-auto/tui.ts` `dispatchRunAutoLifecycle`; `.opencode/plugins/orchestrator.ts` `editor.add` + optional `ctx.rpc.register`; absent `.opencode/commands/auto.md`
- Compose: `docs/engineering/research.md` **R-0136** / **R-0134** / **R-0124** (do not wipe R-0124, R-0131, R-0134, **R-0135** US-0140)
- Intake: `handoffs/intake_evidence/BUG-0023-intake-20260913.json`

### Research stub (PO does not author `docs/engineering/research.md`)

- **Expected next R-id**: **R-0137** (deterministic continuation; `ID_NAMESPACE_BOOTSTRAP=0`; highest existing heading is **R-0136** BUG-0023 intake).
- **Do not** author `## R-0136` (already taken). **Do not** author `## R-0137` this phase — tech-lead owns allocation at `/research`. Do not wipe R-0124, R-0131, R-0134, R-0135, R-0136. Do not reuse R-0133 (BUG-0022) or R-0135 (US-0140).

### Runtime proof (DEC-0038)

- `runtime_proof_id=rp-auto-20260913-bug0023-discovery-po-20260913T234500Z-BUG-0023`
- `proof_hash=FF27FC4ABB23499336FC068B07F68960B3496FCBE24A79DF6D85FD0F649975AC`
- `proof_ttl=2026-09-14T00:45:00Z`
- Hash via `from scripts.token_cost_lib import compute_strict_proof_hash` (positional; compact sorted-key JSON).
- Canonical hashed payload: `{"orchestrator_run_id":"auto-20260913-bug0023","phase_id":"discovery","proof_issued_at":"2026-09-13T23:45:00Z","proof_ttl_seconds":3600,"role":"po","runtime_proof_id":"rp-auto-20260913-bug0023-discovery-po-20260913T234500Z-BUG-0023"}`
- Isolation extras (not hashed): `delivery_mode=ultra_lean`, `macro_phase=spec`, `model_id=cursor-grok-4.6-high`, `model_resolve_fallback=MODEL_RESOLVE_FALLBACK`, `requested_slug=gpt-5.6-sol-high`, `sprint_id=none`, `story_id=BUG-0023`
- `hash_recompute_confirmation=true` (compute_strict_proof_hash → FF27FC4ABB23499336FC068B07F68960B3496FCBE24A79DF6D85FD0F649975AC; 64 hex verified)
- Consumed intake proof: `rp-cursor-20260913-BUG0023-intake-po-20260913T233500Z-BUG-0023` / `9A0E6BBF974752C945BDCBF0AB18FFE7BFB99F57F4C90EA94D796F14F452A297` — RUNTIME_PROOF_VALID (MATCH before TTL `2026-09-14T00:35:00Z`; consumed_at `2026-09-13T23:45:00Z`)

### Isolation + stop

- `phase_id=discovery`, `role=po`, `bug_id=BUG-0023`, `fresh_context_marker=po-BUG0023-discovery-20260913T234500Z-fresh`, `model_id=cursor-grok-4.6-high`, `model_resolve_fallback=MODEL_RESOLVE_FALLBACK`
- `evidence_ref=docs/product/backlog.md ### BUG-0023 discovery_notes; docs/product/vision.md ## Discovery Notes — BUG-0023; this handoff; docs/engineering/research.md ## R-0136; .opencode/plugins/its-magic-auto/tui.ts dispatchRunAutoLifecycle; .opencode/plugins/orchestrator.ts editor.add + ctx.rpc.register; absent .opencode/commands/auto.md; docs/engineering/state.md discovery checkpoint`
- **Hot-surface note**: Appended (not prepended) so triad oldest-prefix rollover retains this newest section. Post-append `--check` → STATE_ARCHIVE_REQUIRED `state` 1233/1200 units=15/80 + `po_to_tl` 695/650 units=16/60 → `arch_linkage_guard.py --pre` exit 0 → `--rollover --json` `{"boundary":"triad-rollover|state","moved":1,"pack_ref":"docs/engineering/state-archive/state-pack-20260913-dl.md","retained_checkpoints":14,"retained_lines":1130}` (archived `## Refresh-context checkpoint — BUG-0021 / S0146`; archived_body_lines=103; preamble_lines=11; retained_body_lines=1130) + `{"boundary":"triad-rollover|po_to_tl","moved":1,"pack_ref":"handoffs/archive/po-to-tl-pack-20260913-r.md","retained_lines":645,"retained_sections":15}` (archived `## Research handoff — US-0138`; archived_body_lines=50; retained_body_lines=645) → `--post` exit 0; architecture not rolled; final `--check` PASS (`state` 1172/1200; `po_to_tl` 645/650). Discovery checkpoint retained in hot `state.md`. Discovery handoff retained at true end of `po_to_tl.md`.
- **Status**: BUG-0023 remains **OPEN**. Acceptance unchecked. **Next**: `/research` in fresh **tech-lead** subagent (orchestrator may insert sovereign-critic of discovery first: CROSS_MODEL_REVIEW=1). Do not spawn research from this discovery chat. STOP.

