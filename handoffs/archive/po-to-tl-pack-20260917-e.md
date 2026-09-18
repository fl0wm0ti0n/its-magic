# PO to TL archive pack (2026-09-17)

- Rollover trigger: `PO_TO_TL_HOT_MAX_LINES=650, PO_TO_TL_HOT_MAX_SECTIONS=60`
- Source: `handoffs/po_to_tl.md`
- Archived units (oldest first, contiguous prefix): 2
- Retained units in hot file: 12
- First archived heading: `## Intake handoff — BUG-0024 OpenCode CLI TUI listed `/auto` still toasts OPENCODE_AUTO_TUI_DISPATCH_UNSUPPORTED after BUG-0023 Axis A`
- Last archived heading: `## Discovery handoff — US-0143 Delivery routing and full-autonomy scheduler`
- Verification tuple (mandatory):
  - archived_body_lines=89
  - retained_body_lines=603

---

## Intake handoff — BUG-0024 OpenCode CLI TUI listed `/auto` still toasts OPENCODE_AUTO_TUI_DISPATCH_UNSUPPORTED after BUG-0023 Axis A

- **Phase completed**: intake (`/intake bug`). **Role**: po. **Bug**: BUG-0024. **Sprint**: (pending). **Verdict**: PASS (`decision_gate=false`).
- **Timestamp**: 2026-09-14T04:00:00Z. **Fresh marker**: `po-BUG0024-intake-20260914T040000Z-fresh`.
- **Writer**: `writer_id=po-cursor-20260913-BUG0024-intake`, `intake_run_id=cursor-20260913-BUG0024-intake`.
- **Routing**: argv `/intake bug` wins over scratchpad `INTAKE_WORK_ITEM_KIND=story`. `selected_pack=small-intake-pack`. `INTAKE_GUIDED_MODE=1`. `WORK_KIND_ROUTING=0` (classifier skipped). `EARLY_RESEARCH=1`. `INTAKE_SUBAGENT_FALLBACK=deny`. Next id confirmed `python scripts/bug_issue_validate.py --print-next-id` → **BUG-0024** before write.
- **Evidence**:
  - `handoffs/intake_evidence/BUG-0024-intake-20260914T035000Z.json` — `[INTAKE_EVIDENCE_VALIDATION_OK]` (pre-write)
  - `python scripts/bug_issue_validate.py --backlog docs/product/backlog.md --check-acceptance`
  - DEC-0069: prepend `## Latest orchestration pointer — post-bug-intake` at file top so upsert does not clobber historical US-0141/BUG-0023 pointers (first-match replace). Continue US-0142 with `/auto start-from=architecture`. Continue BUG-0022 with `/auto bug-target=BUG-0022`.
- **Research**: **R-0140** (`docs/engineering/research.md`) — intake-time live-fetch OpenCode v2 RPC (`Rpc.define` + public TUI call is CLI `Plugin.define({ setup })` `context.client.rpc`, not `{ id, tui }` `api.client`) + Context7 TUI `api.client` is OpencodeClient `.get`/`.post`. Axis A files present; live DISPATCH toast live-falsifies R-0137. Compose **R-0137** / **R-0136** / **R-0134** / **R-0124**. Do not wipe R-0120..R-0139.
- **Operator ask**: `/ask` “prüfe das repo is alles so wie nach dem letzten bug geplant vorhanden? was läuft nun wieder falsch?” Live: toast title `its-magic /auto`, body `OPENCODE_AUTO_TUI_DISPATCH_UNSUPPORTED`. `/intake bug siehe chat verlauf`. They want listed `/auto` to **start lifecycle**, not fail-closed toast. Axis A files **are present**. Not Cursor-only as done. Not `--auto`. Not LLM Auto mode.
- **Root cause (intake hypothesis, not proven)**: TUI `run()` only passes `{ api, client: api?.client }`. If OpenCode TUI plugin has no `api.client` (or no `client.rpc` / no `baseUrl` / `@opencode/client` unusable), toast fires immediately. Orchestrator register skipped when `ctx.rpc` absent. All RPC errors swallowed → same toast. CI mock-invoke cannot prove live `client.rpc(Defined)`.
- **Duplicate check**: Persist **NEW BUG-0024**. Do **not** reopen BUG-0023 DONE (S0148 Axis A slice). Do **not** reopen BUG-0021 DONE (listing). Do **not** restore STOP-only `auto.md`. Do **not** merge **BUG-0022 OPEN**. Do **not** reopen BUG-0020/0019/0018. Do not mutate US-0133..US-0148. Do not drain BUG-0022. Do not drain US-0142 from this intake.
- **Decomposition**: **single_bug** — operator already invoked `/intake bug` (treat as **accept**).
- **Alternatives**: (1) persist BUG-0024; listed `/auto` must reach `runAutoLifecycle` on live CLI; tests must catch this live miss — **recommended**; (2) reopen BUG-0023 — **reject**; (3) reopen BUG-0021 — **reject**; (4) merge BUG-0022 — **reject**; (5) restore `auto.md` — **reject**; (6) files-present as success — **reject**; (7) Cursor-only as done — **reject**.
- **Scope for `/discovery`**: lock host-true live `tui(api)` client wiring → `runAutoLifecycle`. Keep `editor.add`. Do not restore `auto.md`. Do not reopen BUG-0023/0021 ACs. Do not merge BUG-0022. Honest `test_bug0024_*` vs mock-only gap.
- **Risks**: R1 — `{ id, tui }` `api.client` missing (high); R2 — local `Rpc.define` fallback is not host-true `Defined` (medium); R3 — `ctx.rpc.register` skipped so method unregistered (medium); R4 — swallowed RPC errors hide the real miss (high); R5 — mock-only tests close live dispatch again (high).
- **Isolation**: `phase_id=intake`; `role=po`; `bug_id=BUG-0024`; `fresh_context_marker=po-BUG0024-intake-20260914T040000Z-fresh`; `timestamp=2026-09-14T04:00:00Z`; `model_id=cursor-grok-4.6-high`; `evidence_ref=docs/product/backlog.md ### BUG-0024, docs/product/acceptance.md BUG-0024 row, handoffs/intake_evidence/BUG-0024-intake-20260914T035000Z.json, docs/engineering/research.md ## R-0140, this handoff`.
- **Runtime proof**: `rp-cursor-20260913-BUG0024-intake-po-20260914T040000Z-BUG-0024` / `5169E39839C3BE335B9A63CBC76CEF6C0C78EA5157DE51ACFE07A46046B49E8D` (ttl `2026-09-14T05:00:00Z`).
- **Hot-surface note**: Appended (not prepended) so triad oldest-prefix rollover retains this newest section. Post-append `--rollover` → `docs/engineering/state-archive/state-pack-20260913-er.md` (`boundary=triad-rollover|state`, moved=2, retained_checkpoints=13, retained_body_lines=1137). po_to_tl not packed this pass. Architecture not rolled this intake. Final `--check` PASS.
- **Status**: OPEN per US-0045. **BUG-0023 remains DONE**. **BUG-0022 remains OPEN**. **BUG-0021 remains DONE**. **US-0142 remains OPEN** (not drained). **Next**: `/discovery` (fresh **po**) for **BUG-0024**, or `/auto bug-target=BUG-0024`. Do not run discovery/architecture/execute from this intake chat. STOP.

## Discovery handoff — US-0143 Delivery routing and full-autonomy scheduler

- **Phase completed**: discovery. **Role**: po. **Story**: US-0143 only. **Sprint**: (pending — expected S0151 at `/sprint-plan`). **Verdict**: PASS (`decision_gate=false`).
- **Timestamp (UTC)**: 2026-09-14T06:30:00Z. **Fresh marker**: `po-US0143-discovery-20260914T063000Z-fresh`.
- **Orchestrator**: `orchestrator_run_id=auto-20260913-us0143`, parent=`auto-20260913-us0142`, `delivery_mode=ultra_lean`, resolved_phase_plan=`[spec, plan, build+verify, ship]`, macro=`spec` (intake already DONE — not re-intaken; `handoffs/intake_evidence/US-0133-0148-intake-20260911.json` held, not mutated), `model_id=cursor-grok-4.6-high` (CROSS_MODEL_REVIEW=1), AUTO_QUIET=1, FRAMEWORK_KIT_REPO=1, drain story 9 of 10.
- **Sibling boundary**: **US-0141 DONE / US-0142 DONE** — compose only; do not reopen. **US-0133..US-0140 DONE** — compose only; do not reopen. **US-0144..US-0148 OPEN** — OUT OF SCOPE (do not mutate). **BUG-0021 DONE / BUG-0022 OPEN / BUG-0023 DONE / BUG-0024 OPEN** — do not mutate; do not drain bugs. Do not restore `.opencode/commands/auto.md`. Do not ship kit `cli.json` or plugin-local `its-magic-auto/tui.json`.
- **Gap confirmed (narrow-read)**: US-0140 CommandRouter `DEFERRED_COMMANDS=["/auto","/quick"]` returns `WORKFLOW_ROUTE_DEFERRED` (`implemented: false`). WorkflowEngine has bounded execute↔QA loop but **no** drain/compressed-route scheduler. GateEngine `RELEASE_GATE_ORDER` (tests→QA→UAT→docs) must stay unamended. `config-view` currently exposes only `lookupDeliveryMode`. Host Cursor/OpenCode remain scheduling-only.

### Discovery locks D1–D10

| ID | Lock |
|----|------|
| **D1** | Implement `/auto` and `/quick` **inside** `@its-magic/runtime-core` CommandRouter/WorkflowEngine (compose US-0140). **No** sibling auto-scheduler package. **No Pi**. Do **not** rewrite GateEngine tables. |
| **D2** | Independent axes: `DELIVERY_MODE`, `TOKEN_PROFILE`, CAVEMAN/voice, `AUTONOMY_PRESET`, `WORK_KIND`. Standard / ultra_lean / mega_quick preserve mandatory tests + acceptance. Consume US-0118, US-0119, US-0095, US-0096. |
| **D3** | `/auto` loop is typed runtime state (masterplan §14.4): target → kind/mode → phase plan → role/model/policy → fresh session → phase → evidence → critic hooks → bounded repair → advance or execute↔QA → release→closure→refresh → optional drain → deterministic stop. Not a prompt. |
| **D4** | Explicit `start-from` / `DELIVERY_MODE` / `AUTO_PHASE_*` beat work-kind recommendations (DEC-0118 L8). Conflict → `WORK_KIND_DELIVERY_MODE_CONFLICT` fail-closed. Mid-story `DELIVERY_MODE` switch forbidden (DEC-0082). |
| **D5** | Expand `AUTONOMY_PRESET` before execution (`autonomy_preset_lib.expand_autonomy_preset`). Stop matrix/reason codes from kernel/manifest (`scripts/data/autonomy_stop_matrix.yaml` + consume `stop-matrix/codes.ts` — do not fork; do not encode stops in prompts). Models never decide whether a hard stop is relaxable. |
| **D6** | Drain, bulk, retry/skip/repair, quiet, pause, and operator approvals obey configured caps. Operator authority preserved. |
| **D7** | Non-relaxable even under `AUTONOMY_PRESET=full`: security-hard gates, unresolved decisions, incompatible kernel, failed mandatory quality evidence, budget exhaustion, ambiguous resume. |
| **D8** | Audit/repair ledgers make phase selection, retries, skips, stop reasons, and resume choices reproducible. Tests `test_us0143_*` (expect 12): standard+compressed routes, mid-process resume, multi-item drain, work-kind conflicts, all terminals, autonomy disabled. Kit `files` omit `standalone/`. |
| **D9** | OUT: US-0144 critic/memory *content* (compose hooks only); restore `.opencode/commands/auto.md`; kit `cli.json`; plugin-local `its-magic-auto/tui.json`; npm-publish; git push; `.env`. |
| **D10** | Do not mutate US-0141/0142 DONE, US-0144+, BUG-0023/0024. Do not drain bugs. Do not reopen US-0133..US-0140. Research stub **R-0141** (PO does not author `## R-0141`; **R-0139**=US-0142; **R-0140**=BUG-0024 — do not reuse/wipe). Companion **DEC-0143** + `# US-0143` at `/architecture` only. |

### Research questions DQ1–DQ10 (for `/research` → expect **R-0141**; stub only here)

1. **DQ1**: Package — AutoScheduler nested in `@its-magic/runtime-core` `workflow/` vs CommandRouter expansion only vs sibling package. D-lock prefers compose-in-place; architecture confirms. No Pi.
2. **DQ2**: How to lift `WORKFLOW_ROUTE_DEFERRED` for `/auto`/`/quick` without rewriting GateEngine tables or the 7-step programmatic path. Fate of `DEFERRED_COMMANDS` / `implemented: false` after this story.
3. **DQ3**: Axis independence — extend `config-view` beyond `lookupDeliveryMode` for `TOKEN_PROFILE`, voice, `AUTONOMY_PRESET`, `WORK_KIND` without folding axes. Consume US-0138 RuntimeConfig vs adapter.
4. **DQ4**: Precedence implementation of DEC-0118 L8 (`start-from` > `DELIVERY_MODE` > `AUTO_PHASE_*` > work-kind > default). KernelBridge consume `work_kind_classify_lib.py` vs TS port.
5. **DQ5**: Autonomy preset expansion — KernelBridge consume `autonomy_preset_lib.py` vs TS port of `PRESET_DEFINITIONS`. Stop matrix: consume YAML via KernelBridge vs TS mirror (do not fork writer).
6. **DQ6**: Drain loop owner — WorkflowEngine `while run active` vs CommandRouter.route(`/auto`). Caps: `AUTO_LOOP_MAX_CYCLES`, drain remaining budget, bulk, retry/skip/repair, quiet, pause, approvals. `AUTO_BUG_QUEUE` vs story drain (this run `AUTO_BUG_QUEUE=0`).
7. **DQ7**: Map AC-6 non-relaxable set onto `autonomy_stop_matrix.yaml` `security_hard` plus new codes (incompatible kernel, failed quality evidence, budget, ambiguous resume). Do not weaken US-0119 `security_hard`.
8. **DQ8**: Audit/repair ledger schema — RunsStore tables vs repo artifacts vs JSONL. Reproducible phase selection, retries, skips, stop reasons, resume choices. Mid-process resume vs US-0140 `discardOrphans` + fresh role.
9. **DQ9**: `/quick` vs `mega_quick` vs `ultra_lean` compressed routes. Preserve tests+acceptance. How critic hooks spawn supplementary (content US-0144 OUT).
10. **DQ10**: Tests — 12 `test_us0143_*` Win+Linux fake-model covering AC-1..AC-8. Kit `files` omit `standalone/`. No `auto.md` restore. No kit `cli.json` / plugin-local `tui.json`. **R-id live-inventory**: allocate **R-0141**; do not wipe R-0139 (US-0142) or R-0140 (BUG-0024).

### Design refs

- `docs/product/standalone-its-magic-pi-masterplan.md` §§14.4 (`/auto` loop), 14.5 (stop matrix), 14.6 (autonomy presets), 15 (independent axes), 32 Phase 6, 38 (parity DoD)
- Compose: US-0140 / DEC-0140 / R-0135 (`WORKFLOW_ROUTE_DEFERRED`); US-0118 / DEC-0118 L8; US-0119 / DEC-0119; US-0095 / DEC-0078; US-0096 / DEC-0082; US-0070 / DEC-0052; BUG-0006 / DEC-0051 spawn-only
- Market: [Graph Harness scheduler-theoretic](https://arxiv.org/html/2604.11378v1) (deterministic policy, bounded recovery, immutable plans); [deterministic vs LLM orchestration](https://dreaming.press/posts/deterministic-vs-llm-orchestration-for-multi-agent-systems.html); [capability vs permission autonomy](https://arxiv.org/pdf/2607.23438)
- Intake (read-only): `handoffs/intake_evidence/US-0133-0148-intake-20260911.json` (`auto-autonomy` + `delivery-routing` → US-0143)

### Research stub (PO does not author `docs/engineering/research.md`)

- **Expected next R-id**: **R-0141** (`ID_NAMESPACE_BOOTSTRAP=0`; highest existing heading is **R-0140** BUG-0024).
- Do **not** author `## R-0141` this phase. Do **not** wipe R-0139 (US-0142) or R-0140 (BUG-0024). Do **not** reuse R-0139 / R-0140.
- Companion **DEC-0143** + `# US-0143` at `/architecture` only — PO does not author them.

### Runtime proof (DEC-0038)

- `runtime_proof_id=rp-auto-20260913-us0143-discovery-po-20260914T063000Z-US-0143`
- `proof_hash=F80760B9FF4DA073C0AF5DDE847206E021A7C47FFE74B9B8A6E477BB27739FD4`
- `proof_ttl=2026-09-14T07:30:00Z`
- Hash via `from scripts.token_cost_lib import compute_strict_proof_hash` (positional; compact sorted-key JSON).
- Canonical hashed payload: `{"orchestrator_run_id":"auto-20260913-us0143","phase_id":"discovery","proof_issued_at":"2026-09-14T06:30:00Z","proof_ttl_seconds":3600,"role":"po","runtime_proof_id":"rp-auto-20260913-us0143-discovery-po-20260914T063000Z-US-0143"}`
- Isolation extras (not hashed): `delivery_mode=ultra_lean`, `macro_phase=spec`, `model_id=cursor-grok-4.6-high`, `sprint_id=none`, `story_id=US-0143`, `skipped_phases=[intake]`, `native_chain_active=true`, `native_chain_continuing=true`
- `hash_recompute_confirmation=true` (compute_strict_proof_hash → f80760b9ff4da073c0af5dde847206e021a7c47ffe74b9b8a6e477bb27739fd4; independently MATCH; **64 hex** verified; stored uppercase)

### Isolation + stop

- `phase_id=discovery`, `role=po`, `story_id=US-0143`, `model_id=cursor-grok-4.6-high`, `fresh_context_marker=po-US0143-discovery-20260914T063000Z-fresh`
- `evidence_ref=docs/product/backlog.md ## US-0143 discovery_notes; docs/product/vision.md ## Discovery Notes — US-0143; this handoff; docs/engineering/state.md discovery checkpoint; handoffs/resume_brief.md; handoffs/intake_evidence/US-0133-0148-intake-20260911.json (read-only)`
- **Hot-surface note**: Appended (not prepended) so triad oldest-prefix rollover retains this newest section. Post-append `--rollover --json` `{"boundary":"triad-rollover|state","moved":1,"pack_ref":"docs/engineering/state-archive/state-pack-20260913-fb.md","retained_checkpoints":13,"retained_lines":1169}` + `{"boundary":"triad-rollover|po_to_tl","moved":1,"pack_ref":"handoffs/archive/po-to-tl-pack-20260913-z.md","retained_lines":637,"retained_sections":14}`. `arch_linkage_guard.py` not run (architecture.md not touched). Architecture not rolled this phase. final `--check` PASS. Discovery handoff retained at true end of `po_to_tl.md`.
- **Status**: US-0143 remains **OPEN**. AC-1..AC-8 remain unchecked. **Next**: orchestrator sovereign-critic of discovery, then `/research` in fresh **tech-lead** subagent. Do not spawn research or critic from this discovery chat. STOP.

