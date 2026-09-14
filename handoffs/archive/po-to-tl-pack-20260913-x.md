# PO to TL archive pack (2026-09-13)

- Rollover trigger: `PO_TO_TL_HOT_MAX_LINES=650, PO_TO_TL_HOT_MAX_SECTIONS=60`
- Source: `handoffs/po_to_tl.md`
- Archived units (oldest first, contiguous prefix): 1
- Retained units in hot file: 13
- First archived heading: `## Architecture handoff — BUG-0021 OpenCode CLI TUI still has no invokable `/auto` after BUG-0020 tui.json`
- Last archived heading: `## Architecture handoff — BUG-0021 OpenCode CLI TUI still has no invokable `/auto` after BUG-0020 tui.json`
- Verification tuple (mandatory):
  - archived_body_lines=46
  - retained_body_lines=638

---

## Architecture handoff — BUG-0021 OpenCode CLI TUI still has no invokable `/auto` after BUG-0020 tui.json

- **Phase completed**: architecture. **Role**: tech-lead. **Bug**: BUG-0021 only. **Sprint**: (pending `/sprint-plan`). **Verdict**: PASS (`decision_gate=false`).
- **Timestamp (UTC)**: 2026-09-13T12:10:00Z (proof_issued_at). **State clock**: 2026-09-13T18:10:00Z (monotonic vs sibling US-0139 sprint-plan 17:55:00Z on shared `state.md`). **Fresh marker**: `tl-BUG0021-architecture-20260913T121000Z-fresh`.
- **Orchestrator**: `orchestrator_run_id=auto-20260913-bug0021`, `parent_orchestrator_run_id=cursor-20260913-BUG0021-intake`, `delivery_mode=ultra_lean`, macro=`plan` (architecture = second of research+architecture+sprint-plan; sprint-plan continues later via orchestrator spawn), `model_id=cursor-grok-4.6-high`, `model_resolve_fallback=MODEL_RESOLVE_FALLBACK` (requested_slug=`gpt-5.6-sol-high`; host Other Models usage limit), CROSS_MODEL_REVIEW=1, AUTO_QUIET=1, EARLY_RESEARCH=1 (consumed **R-0134**; **no new R-id**).
- **Sibling boundary**: BUG-0020/BUG-0019/BUG-0018/BUG-0017/BUG-0015/BUG-0016 DONE — out of scope; do not reopen ACs / S0140. **BUG-0022 OPEN** — do not mutate. Do not mutate US-0133..US-0148; do not drain US-0139+. Do not prune/touch `.cursor/commands/auto.md` or `.opencode/agents/auto.md`. Do **not** restore `.opencode/commands/auto.md`. Do **not** run `--pure`. Do **not** rewrite historical `# BUG-0020`.
- **Architecture anchor**: `docs/engineering/architecture.md` **`# BUG-0021`**. **Companion DEC**: **none**.
- **Approach**: **Axis A LOCKED**. Reject Axis B (`Plugin.define` / `cli.json` / directory discovery), Axis D (file-existence-only), Axis E (restore `auto.md` / JSON template). Axis C delivered by A.
- **Research consumed**: `rp-auto-20260913-bug0021-research-techlead-20260913T120000Z-BUG-0021` / `C72C0CBA2BCD33EF7926A7EEA08E2CC4D11154009C27F4ED95CAA482D7146440` — RUNTIME_PROOF_VALID MATCH at proof_issued_at `2026-09-13T12:10:00Z` before TTL `2026-09-13T13:00:00Z`; critic PASS `rp-auto-20260913-bug0021-sovereign-critic-techlead-20260913T120500Z-BUG-0021` / `A255EEB384939436B4017DECD57DFAAD66F2EA66ED02312A0E2FFC6493045F45`; anti_slop=10; 0 blocking; immutable R-0134.

### Locked design (Axis A)

- Reshape `.opencode/plugins/its-magic-auto/tui.ts` (active + template) to live default export `{ id: "its-magic.auto.tui", tui }` with `tui: async (api, options, meta) => { ... }`. **Not** `Plugin.define({ setup })` as the TUI default.
- `api.keymap.registerLayer` command uses **`name: "its-magic.auto"`** (not only `id`), `slashName: "auto"`, `namespace: "palette"`. Keep `slash: { name: "auto" }` for `test_bug0019_*`.
- Bindings `{ key: "ctrl+shift+a", cmd: "its-magic.auto", desc }`. Binding key **LOCKED**.
- `run()` → `api.client.rpc(ITS_MAGIC_AUTO_RPC)` → `runAutoLifecycle`. Keep HTTP RPC fallback. Keep `dispatchRunAutoLifecycle`.
- Keep `.opencode/tui.json` listing `./plugins/its-magic-auto/tui.ts` (load path, not listing proof).
- Keep `orchestrator.ts` `editor.add({ name: "auto", execute })`. Server `index.ts` stays `Plugin.define` (no `tui` export).
- Fail-closed: reuse LISTING/DISPATCH; additive `OPENCODE_AUTO_CLI_TUI_PLUGIN_LOAD_UNSUPPORTED` for listed-but-skipped; **not** the desktop Command.Info token.
- Residual: operator binary predating TUI plugin activation ([opencode#36505](https://github.com/anomalyco/opencode/issues/36505)) → LOAD token + runbook; **not** a reason to restore `auto.md`. `--pure` out of scope.
- Eight `test_bug0021_*` contract markers (not `tui.json`-path-only). Keep 0020/0019/0018 compose.
- Upgrade `--host opencode|both` **overwrites** reshaped `tui.ts` on C-limb trees; still prunes leftover `auto.md`.

### Sprint seeds

- T-anch + T-001..T-007 (8 ≤ SPRINT_MAX_TASKS=12). Do not restore `auto.md`. Do not reopen BUG-0020 ACs. Do not mutate BUG-0022 / US-0139+. Do not implement application code this phase.

### Runtime proof (DEC-0038)

- `runtime_proof_id=rp-auto-20260913-bug0021-architecture-techlead-20260913T121000Z-BUG-0021`
- `proof_hash=7621D2D4FCE1EEB34FF8E41F8B26F6069E5D348833F8EEBEF8CD5210DE53A60B`
- `proof_ttl=2026-09-13T13:10:00Z`
- Hash via `from scripts.token_cost_lib import compute_strict_proof_hash` (positional; compact sorted-key JSON).
- Canonical hashed payload: `{"orchestrator_run_id":"auto-20260913-bug0021","phase_id":"architecture","proof_issued_at":"2026-09-13T12:10:00Z","proof_ttl_seconds":3600,"role":"tech-lead","runtime_proof_id":"rp-auto-20260913-bug0021-architecture-techlead-20260913T121000Z-BUG-0021"}`
- Isolation extras (not hashed): `delivery_mode=ultra_lean`, `macro_phase=plan`, `model_id=cursor-grok-4.6-high`, `model_resolve_fallback=MODEL_RESOLVE_FALLBACK`, `requested_slug=gpt-5.6-sol-high`, `sprint_id=none`, `story_id=BUG-0021`
- `hash_recompute_confirmation=true` (compute_strict_proof_hash → 7621D2D4FCE1EEB34FF8E41F8B26F6069E5D348833F8EEBEF8CD5210DE53A60B)
- Consumed research proof: `rp-auto-20260913-bug0021-research-techlead-20260913T120000Z-BUG-0021` / `C72C0CBA2BCD33EF7926A7EEA08E2CC4D11154009C27F4ED95CAA482D7146440` — RUNTIME_PROOF_VALID (MATCH before TTL `2026-09-13T13:00:00Z`; consumed_at `2026-09-13T12:10:00Z`; independent recompute MATCH)
- Consumed critic proof: `rp-auto-20260913-bug0021-sovereign-critic-techlead-20260913T120500Z-BUG-0021` / `A255EEB384939436B4017DECD57DFAAD66F2EA66ED02312A0E2FFC6493045F45` — RUNTIME_PROOF_VALID (MATCH before TTL `2026-09-13T13:05:00Z`)

### Isolation + stop

- `phase_id=architecture`, `role=tech-lead`, `bug_id=BUG-0021`, `fresh_context_marker=tl-BUG0021-architecture-20260913T121000Z-fresh`, `model_id=cursor-grok-4.6-high`, `model_resolve_fallback=MODEL_RESOLVE_FALLBACK`
- `evidence_ref=docs/engineering/architecture.md # BUG-0021; docs/engineering/research.md ## R-0134; docs/product/backlog.md ### BUG-0021; this handoff; docs/engineering/state.md architecture checkpoint; handoffs/resume_brief.md`
- **Hot-surface note**: Appended (not prepended) so triad oldest-prefix rollover retains this newest section. Post-append `--check` → STATE_ARCHIVE_REQUIRED state/po_to_tl/architecture → `arch_linkage_guard.py --pre` exit 0 → `--rollover` pack_state=`docs/engineering/state-archive/state-pack-20260913-ch.md` (moved=2) pack_po=`handoffs/archive/po-to-tl-pack-20260913-m.md` (moved=1) pack_arch=`docs/engineering/architecture-archive/architecture-pack-20260913-e.md` (moved=2; archived `# US-0134`/`# US-0135`; `# BUG-0020`/`# BUG-0021` retained) → `--post` exit 0; heading-policy baseline_h2_count=0 PASS; final `--check` PASS; `[CODEBASE_MAP_OK] preserved_existing`.
- **Status**: BUG-0021 remains **OPEN**. Acceptance unchecked. **Next**: `/sprint-plan` in fresh **tech-lead** subagent. Do not spawn sprint-plan from this architecture chat. STOP.

