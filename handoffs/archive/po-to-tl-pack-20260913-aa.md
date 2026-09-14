# PO to TL archive pack (2026-09-13)

- Rollover trigger: `PO_TO_TL_HOT_MAX_LINES=650, PO_TO_TL_HOT_MAX_SECTIONS=60`
- Source: `handoffs/po_to_tl.md`
- Archived units (oldest first, contiguous prefix): 2
- Retained units in hot file: 13
- First archived heading: `## Architecture handoff — US-0140 Canonical lifecycle and gate orchestrator`
- Last archived heading: `## Intake handoff — BUG-0023 OpenCode CLI TUI listed `/auto` toasts OPENCODE_AUTO_TUI_DISPATCH_UNSUPPORTED`
- Verification tuple (mandatory):
  - archived_body_lines=51
  - retained_body_lines=637

---

## Architecture handoff — US-0140 Canonical lifecycle and gate orchestrator

- **Phase completed**: architecture. **Role**: tech-lead. **Story**: US-0140 only. **Sprint**: (pending — materialize expected S0147 at `/sprint-plan`; hint S0146 ineligible — BUG-0021 occupies `sprints/S0146/`). **Verdict**: PASS (`decision_gate=false`).
- **Timestamp (UTC)**: 2026-09-13T20:55:00Z. **Fresh marker**: `tl-US0140-architecture-20260913T205500Z-fresh`.
- **Orchestrator**: `orchestrator_run_id=auto-20260913-us0140`, parent=`auto-20260913-us0139`, `delivery_mode=ultra_lean`, macro=`plan` (architecture = second of research+architecture+sprint-plan), `model_id=cursor-grok-4.6-high`, CROSS_MODEL_REVIEW=1, AUTO_QUIET=1, EARLY_RESEARCH=1.
- **Architecture anchor**: `docs/engineering/architecture.md` **`# US-0140`**. Research **`R-0135`** (DQ1–DQ10 unchanged). Discovery D1–D10 unchanged. **No R-0136**. Companion **DEC-0140 Accepted**.
- **Approach**: **A1 (A\*)** LOCKED — `@its-magic/runtime-core` (no Pi) nested workflow/runs/recovery/stop-matrix + nested GateEngine + typed TS graph + CommandRouter 7-step + KernelBridge consume-not-copy + `/auto`/`/quick` `WORKFLOW_ROUTE_DEFERRED` + `node:sqlite` ops DB + crash resume `discardOrphans` + fresh correct-role + 12 `test_us0140_*`. Seeds T-anch + T-001..T-010 (11 ≤ 12). **Execute owns `standalone/packages/runtime-core`.**
- **Rejected**: A2–A13 per R-0135 / DEC-0140.
- **Sibling boundary**: US-0141..US-0148 OPEN — OUT OF SCOPE (US-0143 `/auto`/`/quick` drain). US-0133/0134/0135/0136/0137/0138/0139 DONE — compose only; do not reopen. BUG-0020 DONE — do not reopen. BUG-0021/BUG-0022 OPEN — not mutated. Do not create `standalone/packages/runtime-core` or `sprints/S0146/` or `sprints/S0147/` this phase. Do not restore STOP-only `auto.md`. Do not spawn `/sprint-plan` from this architecture chat.

### Runtime proof (DEC-0038)

- `runtime_proof_id=rp-auto-20260913-us0140-architecture-techlead-20260913T205500Z-US-0140`
- `proof_hash=006C9A41ABF30BCA3A313E8E3B0367CF7E17BA97759F3060BED8B60918DE50CC`
- `proof_ttl=2026-09-13T21:55:00Z`
- Hash via `from scripts.token_cost_lib import compute_strict_proof_hash` (compact sorted-key JSON).
- Canonical hashed payload: `{"orchestrator_run_id":"auto-20260913-us0140","phase_id":"architecture","proof_issued_at":"2026-09-13T20:55:00Z","proof_ttl_seconds":3600,"role":"tech-lead","runtime_proof_id":"rp-auto-20260913-us0140-architecture-techlead-20260913T205500Z-US-0140"}`
- Isolation extras (not hashed): `delivery_mode=ultra_lean`, `macro_phase=plan`, `model_id=cursor-grok-4.6-high`, `sprint_id=none`, `story_id=US-0140`
- `hash_recompute_confirmation=true` (compute_strict_proof_hash → 006C9A41ABF30BCA3A313E8E3B0367CF7E17BA97759F3060BED8B60918DE50CC; **64 hex** verified)
- Consumed research proof: `rp-auto-20260913-us0140-research-techlead-20260913T203500Z-US-0140` / `4DA550E5B9F269C5AA621F5A682121A082B155FABDF4C54786BD5538604CEEE2` — RUNTIME_PROOF_VALID (MATCH before TTL `2026-09-13T21:35:00Z`)
- Consumed critic proof: `rp-auto-20260913-us0140-sovereign-critic-techlead-20260913T204500Z-US-0140` / `FA4C3DD7DB5AC7F225D0EA4E18BAE85671C5D47AE79FE0C9476FFB21028D726A` — MATCH; anti_slop=10; 0 blocking; degraded_mode=false

### Isolation + stop

- `phase_id=architecture`, `role=tech-lead`, `story_id=US-0140`, `fresh_context_marker=tl-US0140-architecture-20260913T205500Z-fresh`, `model_id=cursor-grok-4.6-high`
- `evidence_ref=docs/engineering/architecture.md # US-0140; decisions/DEC-0140.md; docs/engineering/research.md ## R-0135; docs/product/backlog.md ## US-0140; docs/engineering/state.md architecture checkpoint; handoffs/resume_brief.md`
- **Hot-surface note**: Appended newest H1 `# US-0140` (not `## US-`); `baseline_h2_count=0`; heading policy PASS (after=0). Post-append `--check` → oversize → `arch_linkage_guard.py --pre` exit 0 → `--rollover` `rollover_complete units=3,1,2` pack_state=`docs/engineering/state-archive/state-pack-20260913-cy.md` (archived `## Closure checkpoint — US-0139` through `## Sovereign-critic checkpoint — qa BUG-0021`; archived_body_lines=246; preamble_lines=11; retained_body_lines=1196) pack_po=`handoffs/archive/po-to-tl-pack-20260913-q.md` (archived `## Discovery handoff — US-0138`; archived_body_lines=63; retained_body_lines=609) pack_arch=`docs/engineering/architecture-archive/architecture-pack-20260913-f.md` (archived `# US-0136` through `# US-0137`; archived_body_lines=295; retained_body_lines=2858) → `--post` exit 0; final `--check` PASS (`state` 1196/1200; `architecture` 2858/3000; `po_to_tl` 609/650). `[CODEBASE_MAP_OK]` preserved_existing.
- **Status**: US-0140 remains **OPEN**. **Next**: sovereign-critic of architecture, then `/sprint-plan` expected S0147 in fresh **tech-lead** subagent. ultra_lean: plan-verify skipped after sprint-plan. Do not spawn sprint-plan from this architecture chat. STOP.

## Intake handoff — BUG-0023 OpenCode CLI TUI listed `/auto` toasts OPENCODE_AUTO_TUI_DISPATCH_UNSUPPORTED

- **Phase completed**: intake (`/intake bug`). **Role**: po. **Bug**: BUG-0023. **Sprint**: (pending). **Verdict**: PASS (`decision_gate=false`).
- **Timestamp**: 2026-09-13T23:35:00Z. **Fresh marker**: `po-BUG0023-intake-20260913T233500Z-fresh`.
- **Writer**: `writer_id=po-cursor-20260913-BUG0023-intake`, `intake_run_id=cursor-20260913-BUG0023-intake`.
- **Routing**: argv `/intake bug` wins over scratchpad `INTAKE_WORK_ITEM_KIND=story`. `selected_pack=small-intake-pack`. `INTAKE_GUIDED_MODE=1`. `WORK_KIND_ROUTING=0` (classifier skipped). `EARLY_RESEARCH=1`. `INTAKE_SUBAGENT_FALLBACK=deny`. Next id confirmed `python scripts/bug_issue_validate.py --print-next-id` → **BUG-0023** before write.
- **Evidence**:
  - `handoffs/intake_evidence/BUG-0023-intake-20260913.json` — `[INTAKE_EVIDENCE_VALIDATION_OK]` (pre-write)
  - `python scripts/bug_issue_validate.py --backlog docs/product/backlog.md --check-acceptance` — `[BUG_VALIDATION_OK]`
  - `python scripts/intake_bug_resume_brief_refresh.py --bug-id BUG-0023 --validate-file` — `[INTAKE_RESUME_BRIEF_VALIDATE_OK]`; `intended_resume_phase=discovery`; `resolved_start_phase=discovery`; `resolution_source=resume_brief`; `bug_id=BUG-0023`. In-place `--resume-brief` upsert skipped: historical `## Latest orchestration pointer*` headings would be clobbered; canonical DEC-0069 block prepended via `build_latest_pointer_markdown` (US-0140 / BUG-0022 / BUG-0021 history retained).
- **Research**: **R-0136** (`docs/engineering/research.md`) — intake-time live-fetch OpenCode v2 RPC (`Rpc.define` + `context.client.rpc` is CLI `Plugin.define({ setup })`, not `{ id, tui }` `api.client`) + Context7 TUI `api.client` is OpencodeClient `.get`/`.post`. Compose **R-0134** / **R-0124**. Listing limb succeeded; dispatch toast live-falsifies R-0134 DQ4. Do not wipe R-0120..R-0135.
- **Operator ask**: `/auto` must not fail. German: “mach es möglich, dass der /auto befehl nicht fehlschlägt”. Prior `/ask`: listed `/auto` then toast title `its-magic /auto` body `OPENCODE_AUTO_TUI_DISPATCH_UNSUPPORTED`. They want lifecycle start, not fail-closed toast. Not Cursor-only. Not `--auto`. Not LLM Auto mode.
- **Root cause (intake)**: `dispatchRunAutoLifecycle` else-path (no usable `client.rpc(...).runAutoLifecycle` + HTTP fallback failed or `client` missing). Hypotheses H1–H4 in R-0136 (client.rpc missing; Rpc.define required; server register skipped; HTTP shape). Not locked here.
- **Duplicate check**: Persist **NEW BUG-0023**. Do **not** reopen BUG-0021 DONE (listing). Do **not** restore STOP-only `auto.md`. Do **not** merge **BUG-0022 OPEN**. Do **not** reopen BUG-0020/0019/0018. Do not mutate US-0133..US-0148. Do not drain BUG-0022.
- **Decomposition**: **single_bug** — operator already invoked `/intake bug` (treat as **accept**).
- **Alternatives**: (1) persist BUG-0023; listed `/auto` must reach `runAutoLifecycle`; tests not string-in-source only — **recommended**; (2) restore `auto.md` — **reject**; (3) reopen BUG-0021 — **reject**; (4) merge BUG-0022 — **reject**; (5) Cursor-only — **reject**; (6) treat DISPATCH toast as success — **reject**.
- **Scope for `/discovery`**: lock host-true `run()` → `runAutoLifecycle` (api.client vs Rpc.define vs HTTP). Keep `editor.add`. Do not restore `auto.md`. Do not reopen BUG-0021 ACs. Do not merge BUG-0022.
- **Risks**: R1 — `{ id, tui }` `api.client` has no `.rpc` (high); R2 — plain JSON `ITS_MAGIC_AUTO_RPC` vs `Rpc.define` (high); R3 — `ctx.rpc.register` optional/skipped so method unregistered (medium); R4 — string-in-source tests close dispatch again without live/mocked round-trip (high).
- **Isolation**: `phase_id=intake`; `role=po`; `bug_id=BUG-0023`; `fresh_context_marker=po-BUG0023-intake-20260913T233500Z-fresh`; `timestamp=2026-09-13T23:35:00Z`; `model_id=cursor-grok-4.6-high`; `model_resolve_fallback=MODEL_RESOLVE_FALLBACK` (catalog po slug `gpt-5.6-sol-high` often quota-blocked; this spawn is grok-high); `evidence_ref=docs/product/backlog.md ### BUG-0023, docs/product/acceptance.md BUG-0023 row, handoffs/intake_evidence/BUG-0023-intake-20260913.json, docs/engineering/research.md ## R-0136, this handoff`.
- **Hot-surface note**: Appended (not prepended) so triad oldest-prefix rollover retains this newest section. Post-append `--check` → STATE_ARCHIVE_REQUIRED `state` 1245/1200 units=15/80 → `arch_linkage_guard.py --pre` exit 0 → `--rollover` `{"boundary":"triad-rollover|state","moved":1,"pack_ref":"docs/engineering/state-archive/state-pack-20260913-dk.md","retained_checkpoints":14,"retained_lines":1163}` (archived `## Execute checkpoint — US-0140 / S0147`; archived_body_lines=82; preamble_lines=11; retained_body_lines=1163) → `--post` exit 0; architecture not rolled; po_to_tl not rolled; final `--check` PASS (`state` 1163/1200). Intake checkpoint retained in hot `state.md`.
- **Status**: OPEN per US-0045. **BUG-0022 remains OPEN**. **BUG-0021 remains DONE**. **Next**: `/discovery` (fresh **po**) for **BUG-0023**, or `/auto bug-target=BUG-0023`. Do not run discovery/architecture/execute from this intake chat. STOP.

