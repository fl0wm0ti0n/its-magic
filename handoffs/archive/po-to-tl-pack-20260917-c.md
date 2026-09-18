# PO to TL archive pack (2026-09-17)

- Rollover trigger: `PO_TO_TL_HOT_MAX_LINES=650, PO_TO_TL_HOT_MAX_SECTIONS=60`
- Source: `handoffs/po_to_tl.md`
- Archived units (oldest first, contiguous prefix): 2
- Retained units in hot file: 13
- First archived heading: `## Research handoff — US-0142 Owned browser UAT and evidence runtime`
- Last archived heading: `## Intake handoff — BUG-0024 OpenCode CLI TUI listed `/auto` still toasts OPENCODE_AUTO_TUI_DISPATCH_UNSUPPORTED after BUG-0023 Axis A`
- Verification tuple (mandatory):
  - archived_body_lines=71
  - retained_body_lines=647

---

## Research handoff — US-0142 Owned browser UAT and evidence runtime

- **Phase completed**: research. **Role**: tech-lead. **Story**: US-0142 only. **Sprint**: (pending — expected S0150 at `/sprint-plan`). **Verdict**: PASS (`decision_gate=false`).
- **Timestamp (UTC)**: 2026-09-14T03:30:00Z. **Fresh marker**: `tl-US0142-research-20260914T033000Z-fresh`.
- **Orchestrator**: `orchestrator_run_id=auto-20260913-us0142`, parent=`auto-20260913-us0141`, `delivery_mode=ultra_lean`, resolved_phase_plan=`[spec, plan, build+verify, ship]`, macro=`plan` (research = first of research+architecture+sprint-plan), `model_id=cursor-grok-4.6-high` (CROSS_MODEL_REVIEW=1), AUTO_QUIET=1, EARLY_RESEARCH=1, FRAMEWORK_KIT_REPO=1, drain story 8 of 10.
- **Sibling boundary**: **US-0141 DONE** — compose Connect/health only; do not reopen. **US-0133..US-0140 DONE** — compose only; do not reopen. **US-0143..US-0148 OPEN** — OUT OF SCOPE (do not mutate). **BUG-0021 DONE / BUG-0022 OPEN / BUG-0023 DONE** — do not mutate; do not drain bugs. Do not restore `.opencode/commands/auto.md`. Do not ship kit `cli.json` or plugin-local `its-magic-auto/tui.json`.
- **Research anchor**: `docs/engineering/research.md` **`## R-0139`** (DQ1–DQ10 LOCKED). Discovery D1–D10 not rewritten. Do not wipe R-0138 (US-0141) or R-0136/R-0137 (BUG-0023).
- **Approach**: **A1 (A\*)** recommended. Reject A2 (nested app-runtime), A3 (tool-broker fold), A4 (Cursor MCP v1 authority), A5 (Puppeteer), A6 (Selenium), A7 (persistent default Chrome profile), A8 (pixel visual baseline), A9 (US-0143 drain), A10 (rewrite GateEngine), A11 (require live Chrome in CI), A12 (replace kit `cursor` default), A13 (fake browser PASS), A14 (kit Python as standalone runtime), A15 (`browser.close()` after CDP).
- **Companion DEC**: **DEC-0142** Required → Accepted in `/architecture`. Do **not** create `decisions/DEC-0142.md` this phase. Do **not** author `# US-0142`. Recommend architecture H1 **`# US-0142`** (not `## US-`).

### Closed questions DQ1–DQ10

| DQ | Topic | Resolution | LOCK |
|----|-------|------------|------|
| DQ1 | Package + inject | Sibling `@its-magic/browser-uat`; consume `connectHandoff`; no Pi; ToolBroker does not import Playwright internals | LOCKED |
| DQ2 | Two-mode matrix | Isolated `launch`+`newContext`; CDP `connectOverCDP`+`disconnect` + dedicated `--user-data-dir`; default profile forbidden | LOCKED |
| DQ3 | Typed tool | Single `itsm_browser` action enum; promote from `STUB_TOOLS`; QA primary | LOCKED |
| DQ4 | UAT planner | Reuse `classify_step`; additive `owned` mode; kit `cursor` default + `UAT_PROBE_FORBIDDEN` held | LOCKED |
| DQ5 | Evidence | Compatible `uat.json` + `browser_evidence_refs` + redact HAR/headers; gitignored traces | LOCKED |
| DQ6 | Credentials | CDP dedicated profile / opaque injection / operator approval; never read `.env` | LOCKED |
| DQ7 | Fail-closed + retry | `BROWSER_*` + existing `UAT_*`; `BROWSER_RETRY_MAX` default 2; no fake PASS | LOCKED |
| DQ8 | Tests | 12 `test_us0142_*` Win+Linux fake-driver covering AC-1..AC-8 | LOCKED |
| DQ9 | Compose | US-0093 KEEP contract REPLACE backend; US-0141 Connect-only; no GateEngine rewrite | LOCKED |
| DQ10 | Kit + R-id | `files` omit standalone/; R-0139 this story; R-0138/R-0136/R-0137 held | LOCKED |

### Architecture seeds

- Author `# US-0142` + **DEC-0142** (Accepted).
- Seeds T-anch + T-001..T-010 (11 ≤ SPRINT_MAX_TASKS=12). Expected **S0150**.
- Do not expand US-0143+ ACs. Do not implement `standalone/packages/browser-uat` this phase.

### Runtime proof (DEC-0038)

- `runtime_proof_id=rp-auto-20260913-us0142-research-techlead-20260914T033000Z-US-0142`
- `proof_hash=3C8C3226AB88276C2595CCE79742589FF464C3ED8444D6425CC99183D390655A`
- `proof_ttl=2026-09-14T04:30:00Z`
- Hash via `from scripts.token_cost_lib import compute_strict_proof_hash` (positional; compact sorted-key JSON).
- Canonical hashed payload: `{"orchestrator_run_id":"auto-20260913-us0142","phase_id":"research","proof_issued_at":"2026-09-14T03:30:00Z","proof_ttl_seconds":3600,"role":"tech-lead","runtime_proof_id":"rp-auto-20260913-us0142-research-techlead-20260914T033000Z-US-0142"}`
- Isolation extras (not hashed): `delivery_mode=ultra_lean`, `macro_phase=plan`, `model_id=cursor-grok-4.6-high`, `sprint_id=none`, `story_id=US-0142`, `skipped_phases=[intake]`, `native_chain_active=true`, `native_chain_continuing=true`
- `hash_recompute_confirmation=true` (compute_strict_proof_hash → 3c8c3226ab88276c2595cce79742589ff464c3ed8444d6425cc99183d390655a; independently MATCH; **64 hex** verified; stored uppercase)
- Consumed discovery proof: `rp-auto-20260913-us0142-discovery-po-20260914T031000Z-US-0142` / `5FF73D3703330EABE49AA2A07FE6DBD56DAFE5972B489A85309D5CD1A83A1DCB` — RUNTIME_PROOF_VALID (MATCH before TTL `2026-09-14T04:10:00Z`; consumed_at `2026-09-14T03:30:00Z`; independent recompute MATCH)
- Consumed critic proof: `rp-auto-20260913-us0142-sovereign-critic-techlead-20260914T032000Z-US-0142` / `38E19C9FCCEE8C5C0A52EEDE4EC8520C1E08A73E8B0A51720E9609D0F574A441` — RUNTIME_PROOF_VALID (MATCH before TTL `2026-09-14T04:20:00Z`)

### Isolation + stop

- `phase_id=research`, `role=tech-lead`, `story_id=US-0142`, `model_id=cursor-grok-4.6-high`, `fresh_context_marker=tl-US0142-research-20260914T033000Z-fresh`
- `evidence_ref=docs/engineering/research.md ## R-0139; docs/product/backlog.md ## US-0142 research_notes; docs/engineering/state.md research checkpoint; docs/engineering/decisions.md ## DEC-0142 Required stub; handoffs/resume_brief.md`
- **Hot-surface note**: Appended (not prepended) so triad oldest-prefix rollover retains this newest section. Post-append `--check` STATE_ARCHIVE_REQUIRED → `--rollover --json` `{"boundary":"triad-rollover|state","moved":2,"pack_ref":"docs/engineering/state-archive/state-pack-20260913-eo.md","retained_checkpoints":12,"retained_lines":1120}` + `{"boundary":"triad-rollover|po_to_tl","moved":1,"pack_ref":"handoffs/archive/po-to-tl-pack-20260913-x.md","retained_lines":638,"retained_sections":13}`. `arch_linkage_guard.py` not run (architecture.md not touched). Architecture not rolled this phase. final `--check` PASS. Research handoff retained at true end of `po_to_tl.md`.
- **Status**: US-0142 remains **OPEN**. AC-1..AC-8 remain unchecked. **Next**: orchestrator sovereign-critic of research, then `/architecture` in fresh **tech-lead** subagent. Do not spawn architecture or critic from this research chat. STOP.

## Intake handoff — BUG-0024 OpenCode CLI TUI listed `/auto` still toasts OPENCODE_AUTO_TUI_DISPATCH_UNSUPPORTED after BUG-0023 Axis A

- **Phase completed**: intake (`/intake bug`). **Role**: po. **Bug**: BUG-0024. **Sprint**: (pending). **Verdict**: PASS (`decision_gate=false`).
- **Timestamp**: 2026-09-14T03:50:00Z. **Fresh marker**: `po-BUG0024-intake-20260914T035000Z-fresh`.
- **Writer**: `writer_id=po-cursor-20260913-BUG0024-intake`, `intake_run_id=cursor-20260913-BUG0024-intake`.
- **Routing**: argv `/intake bug` wins over scratchpad `INTAKE_WORK_ITEM_KIND=story`. `selected_pack=small-intake-pack`. `INTAKE_GUIDED_MODE=1`. `WORK_KIND_ROUTING=0` (classifier skipped). `EARLY_RESEARCH=1`. `INTAKE_SUBAGENT_FALLBACK=deny`. Next id confirmed `python scripts/bug_issue_validate.py --print-next-id` → **BUG-0024** before write.
- **Evidence**:
  - `handoffs/intake_evidence/BUG-0024-intake-20260914T035000Z.json` — `[INTAKE_EVIDENCE_VALIDATION_OK]` (pre-write)
  - `python scripts/bug_issue_validate.py --backlog docs/product/backlog.md --check-acceptance` — pending this handoff; run after persistence
  - DEC-0069 resume_brief: prepend `## Latest orchestration pointer — post-bug-intake` so upsert does not clobber historical US-0141/BUG-0023 pointers (first-match replace)
- **Research**: **R-0140** (`docs/engineering/research.md`) — intake-time live-fetch OpenCode v2 RPC (`Rpc.define` + public TUI call is CLI `Plugin.define({ setup })` `context.client.rpc`, not `{ id, tui }` `api.client`) + Context7 TUI `api.client` is OpencodeClient `.get`/`.post`. Axis A files present; live DISPATCH toast live-falsifies R-0137. Compose **R-0137** / **R-0136** / **R-0134** / **R-0124**. Do not wipe R-0120..R-0139.
- **Operator ask**: `/ask` “prüfe das repo is alles so wie nach dem letzten bug geplant vorhanden? was läuft nun wieder falsch?” Live: toast title `its-magic /auto`, body `OPENCODE_AUTO_TUI_DISPATCH_UNSUPPORTED`. `/intake bug siehe chat verlauf`. They want listed `/auto` to **start lifecycle**, not fail-closed toast. Axis A files **are present**. Not Cursor-only as done. Not `--auto`. Not LLM Auto mode.
- **Root cause (intake hypothesis, not proven)**: TUI `run()` only passes `{ api, client: api?.client }`. If OpenCode TUI plugin has no `api.client` (or no `client.rpc` / no `baseUrl` / `@opencode/client` unusable), toast fires immediately. Orchestrator register skipped when `ctx.rpc` absent. All RPC errors swallowed → same toast. CI mock-invoke cannot prove live `client.rpc(Defined)`.
- **Duplicate check**: Persist **NEW BUG-0024**. Do **not** reopen BUG-0023 DONE (S0148 Axis A slice). Do **not** reopen BUG-0021 DONE (listing). Do **not** restore STOP-only `auto.md`. Do **not** merge **BUG-0022 OPEN**. Do **not** reopen BUG-0020/0019/0018. Do not mutate US-0133..US-0148. Do not drain BUG-0022. Do not drain US-0142 from this intake (continue with `/auto start-from=architecture`).
- **Decomposition**: **single_bug** — operator already invoked `/intake bug` (treat as **accept**).
- **Alternatives**: (1) persist BUG-0024; listed `/auto` must reach `runAutoLifecycle` on live CLI; tests must catch this live miss — **recommended**; (2) reopen BUG-0023 — **reject**; (3) reopen BUG-0021 — **reject**; (4) merge BUG-0022 — **reject**; (5) restore `auto.md` — **reject**; (6) files-present as success — **reject**; (7) Cursor-only as done — **reject**.
- **Scope for `/discovery`**: lock host-true live `tui(api)` client wiring → `runAutoLifecycle`. Keep `editor.add`. Do not restore `auto.md`. Do not reopen BUG-0023/0021 ACs. Do not merge BUG-0022. Honest `test_bug0024_*` vs mock-only gap.
- **Risks**: R1 — `{ id, tui }` `api.client` missing (high); R2 — local `Rpc.define` fallback is not host-true `Defined` (medium); R3 — `ctx.rpc.register` skipped so method unregistered (medium); R4 — swallowed RPC errors hide the real miss (high); R5 — mock-only tests close live dispatch again (high).
- **Isolation**: `phase_id=intake`; `role=po`; `bug_id=BUG-0024`; `fresh_context_marker=po-BUG0024-intake-20260914T035000Z-fresh`; `timestamp=2026-09-14T03:50:00Z`; `model_id=cursor-grok-4.6-high`; `evidence_ref=docs/product/backlog.md ### BUG-0024, docs/product/acceptance.md BUG-0024 row, handoffs/intake_evidence/BUG-0024-intake-20260914T035000Z.json, docs/engineering/research.md ## R-0140, this handoff`.
- **Status**: OPEN per US-0045. **BUG-0023 remains DONE**. **BUG-0022 remains OPEN**. **BUG-0021 remains DONE**. **US-0142 remains OPEN** (not drained). **Next**: `/discovery` (fresh **po**) for **BUG-0024**, or `/auto bug-target=BUG-0024`. Do not run discovery/architecture/execute from this intake chat. STOP.

