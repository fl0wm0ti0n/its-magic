# PO to TL archive pack (2026-09-17)

- Rollover trigger: `PO_TO_TL_HOT_MAX_LINES=650, PO_TO_TL_HOT_MAX_SECTIONS=60`
- Source: `handoffs/po_to_tl.md`
- Archived units (oldest first, contiguous prefix): 1
- Retained units in hot file: 13
- First archived heading: `## Architecture handoff — US-0142 Owned browser UAT and evidence runtime`
- Last archived heading: `## Architecture handoff — US-0142 Owned browser UAT and evidence runtime`
- Verification tuple (mandatory):
  - archived_body_lines=43
  - retained_body_lines=626

---

## Architecture handoff — US-0142 Owned browser UAT and evidence runtime

- **Phase completed**: architecture. **Role**: tech-lead. **Story**: US-0142 only. **Sprint**: (pending `/sprint-plan` — expected S0150; S0149=US-0141; S0148=BUG-0023). **Verdict**: PASS (`decision_gate=false`).
- **Timestamp (UTC)**: 2026-09-14T03:50:00Z (proof_issued_at). **Fresh marker**: `tl-US0142-architecture-20260914T035000Z-fresh`.
- **Orchestrator**: `orchestrator_run_id=auto-20260913-us0142`, parent=`auto-20260913-us0141`, `delivery_mode=ultra_lean`, resolved_phase_plan=`[spec, plan, build+verify, ship]`, macro=`plan` (architecture = second of research+architecture+sprint-plan; sprint-plan continues later via orchestrator spawn), `model_id=cursor-grok-4.6-high` (CROSS_MODEL_REVIEW=1), AUTO_QUIET=1, EARLY_RESEARCH=1 (consumed **R-0139**; **no new R-id**), FRAMEWORK_KIT_REPO=1, drain story 8 of 10.
- **Sibling boundary**: **US-0143..US-0148 OPEN** — OUT OF SCOPE (US-0143 drain). **US-0133..US-0141 DONE** — compose only; do not reopen. **BUG-0021 DONE / BUG-0022 OPEN / BUG-0023 DONE** — do not mutate; do not drain bugs. Do not restore `.opencode/commands/auto.md`. Do not ship kit `cli.json` or plugin-local `its-magic-auto/tui.json`. Do not create `standalone/packages/browser-uat` or `sprints/S0150/` this phase. Do not spawn `/sprint-plan` from this architecture chat.
- **Architecture anchor**: `docs/engineering/architecture.md` **`# US-0142`**. **Companion DEC**: **DEC-0142** Accepted (`decisions/DEC-0142.md`).
- **Approach**: **A1 (A\*) LOCKED**. Reject A2–A15.
- **Research consumed**: `rp-auto-20260913-us0142-research-techlead-20260914T033000Z-US-0142` / `3C8C3226AB88276C2595CCE79742589FF464C3ED8444D6425CC99183D390655A` — RUNTIME_PROOF_VALID MATCH at proof_issued_at `2026-09-14T03:50:00Z` before TTL `2026-09-14T04:30:00Z`; critic PASS `rp-auto-20260913-us0142-sovereign-critic-techlead-20260914T034000Z-US-0142` / `18F5B1E72CDA4EFAB0F9A8F4588A151E4B84DD7391467BFD4A1D05EF81212621`; anti_slop=10; 0 blocking; immutable R-0139.

### Locked design (A1)

- Sibling `standalone/packages/browser-uat` (`@its-magic/browser-uat`, no Pi). Compose US-0141 `connectHandoff`; do not reimplement AppRuntime/ProcessManager.
- Isolated Playwright `launch`+`newContext` (headless) + typed CDP `connectOverCDP`+`disconnect` with dedicated `--user-data-dir`. Default Chrome User Data forbidden (`BROWSER_CDP_DEFAULT_PROFILE_FORBIDDEN`).
- Typed `itsm_browser` actions: open, navigate, snapshot, click, type, select, wait, screenshot, console, network, download, upload, accessibility. Promote from STUB. QA primary.
- Additive `UAT_BROWSER_PROBE_MODE=owned`; kit `cursor` default held; `UAT_PROBE_FORBIDDEN` unweakened. KEEP US-0093 contract; REPLACE Cursor-MCP backend as v1 authority.
- Evidence: compatible `uat.json` + `browser_evidence_refs` + additive snapshot/trace/duration/backend/`app_runtime_ref`. Redact secrets. Never read `.env`.
- Fail-closed `BROWSER_*` / `UAT_*` names locked in DEC-0142. `BROWSER_RETRY_MAX` default 2 (orthogonal to `APP_RUNTIME_RESTART_MAX`).
- 12 `test_us0142_*`. Kit `files` omit `standalone/`. Do not add standalone to kit workspaces.
- OUT: pixel visual baseline, US-0143 drain, restore `.opencode/commands/auto.md`, kit cli.json, plugin-local tui.json.

### Sprint seeds

- T-anch + T-001..T-010 (11 ≤ SPRINT_MAX_TASKS=12). Expected **S0150**. Do not restore `auto.md`. Do not mutate BUG-0021/0022/0023. Do not reopen US-0133..US-0141. Do not mutate US-0143+. Do not implement application code this phase.

### Runtime proof (DEC-0038)

- `runtime_proof_id=rp-auto-20260913-us0142-architecture-techlead-20260914T035000Z-US-0142`
- `proof_hash=52A720174CB9E0D35507ED9683ED70D22D72A5D9E757A5CF1170B2AC304B3175`
- `proof_ttl=2026-09-14T04:50:00Z`
- Hash via `from scripts.token_cost_lib import compute_strict_proof_hash` (positional; compact sorted-key JSON).
- Canonical hashed payload: `{"orchestrator_run_id":"auto-20260913-us0142","phase_id":"architecture","proof_issued_at":"2026-09-14T03:50:00Z","proof_ttl_seconds":3600,"role":"tech-lead","runtime_proof_id":"rp-auto-20260913-us0142-architecture-techlead-20260914T035000Z-US-0142"}`
- Isolation extras (not hashed): `delivery_mode=ultra_lean`, `macro_phase=plan`, `model_id=cursor-grok-4.6-high`, `sprint_id=none`, `story_id=US-0142`, `skipped_phases=[intake]`, `native_chain_active=true`, `native_chain_continuing=true`
- `hash_recompute_confirmation=true` (compute_strict_proof_hash → 52A720174CB9E0D35507ED9683ED70D22D72A5D9E757A5CF1170B2AC304B3175; independently MATCH; **64 hex** verified)
- Consumed research proof: `rp-auto-20260913-us0142-research-techlead-20260914T033000Z-US-0142` / `3C8C3226AB88276C2595CCE79742589FF464C3ED8444D6425CC99183D390655A` — RUNTIME_PROOF_VALID (MATCH before TTL `2026-09-14T04:30:00Z`; consumed_at `2026-09-14T03:50:00Z`; independent recompute MATCH)
- Consumed critic proof: `rp-auto-20260913-us0142-sovereign-critic-techlead-20260914T034000Z-US-0142` / `18F5B1E72CDA4EFAB0F9A8F4588A151E4B84DD7391467BFD4A1D05EF81212621` — RUNTIME_PROOF_VALID (MATCH before TTL `2026-09-14T04:40:00Z`)

### Isolation + stop

- `phase_id=architecture`, `role=tech-lead`, `story_id=US-0142`, `model_id=cursor-grok-4.6-high`, `fresh_context_marker=tl-US0142-architecture-20260914T035000Z-fresh`
- `evidence_ref=docs/engineering/architecture.md # US-0142; decisions/DEC-0142.md; docs/engineering/research.md ## R-0139; docs/product/backlog.md ## US-0142; docs/engineering/state.md architecture checkpoint; handoffs/resume_brief.md`
- **Status**: US-0142 remains **OPEN**. AC-1..AC-8 remain unchecked. **Next**: orchestrator sovereign-critic of architecture, then `/sprint-plan` expected **S0150** in fresh **tech-lead** subagent. Do not spawn sprint-plan or critic from this architecture chat. STOP.

