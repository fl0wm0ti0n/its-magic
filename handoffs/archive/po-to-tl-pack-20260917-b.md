# PO to TL archive pack (2026-09-17)

- Rollover trigger: `PO_TO_TL_HOT_MAX_LINES=650, PO_TO_TL_HOT_MAX_SECTIONS=60`
- Source: `handoffs/po_to_tl.md`
- Archived units (oldest first, contiguous prefix): 1
- Retained units in hot file: 13
- First archived heading: `## Discovery handoff — US-0142 Owned browser UAT and evidence runtime`
- Last archived heading: `## Discovery handoff — US-0142 Owned browser UAT and evidence runtime`
- Verification tuple (mandatory):
  - archived_body_lines=67
  - retained_body_lines=639

---

## Discovery handoff — US-0142 Owned browser UAT and evidence runtime

- **Phase completed**: discovery. **Role**: po. **Story**: US-0142 only. **Sprint**: (pending — expected S0150 at `/sprint-plan`). **Verdict**: PASS (`decision_gate=false`).
- **Timestamp (UTC)**: 2026-09-14T03:10:00Z. **Fresh marker**: `po-US0142-discovery-20260914T031000Z-fresh`.
- **Orchestrator**: `orchestrator_run_id=auto-20260913-us0142`, parent=`auto-20260913-us0141`, `delivery_mode=ultra_lean`, resolved_phase_plan=`[spec, plan, build+verify, ship]`, macro=`spec` (intake already DONE — not re-intaken; `handoffs/intake_evidence/US-0133-0148-intake-20260911.json` held, not mutated), `model_id=cursor-grok-4.6-high` (CROSS_MODEL_REVIEW=1), AUTO_QUIET=1, FRAMEWORK_KIT_REPO=1, drain story 8 of 10.
- **Sibling boundary**: **US-0141 DONE** — compose Connect/health only; do not reopen. **US-0133..US-0140 DONE** — compose only; do not reopen. **US-0143..US-0148 OPEN** — OUT OF SCOPE (do not mutate). **BUG-0021 DONE / BUG-0022 OPEN / BUG-0023 DONE** — do not mutate; do not drain bugs. Do not restore `.opencode/commands/auto.md`. Do not ship kit `cli.json` or plugin-local `its-magic-auto/tui.json`.
- **Gap confirmed (narrow-read)**: PolicyEngine `itsm_browser` is **STUB**. No `standalone/packages/browser-uat`. US-0141 shipped `AppRuntime.connectHandoff` (`connect_endpoint`, `health_path`, `service_id`, `container_id`, `env_refs` names-only) with **no** Playwright/CDP. Kit `uat_probe_lib.py` classifies `browser_smoke` but Cursor MCP is host-only (`UAT_BROWSER_PROBE_MODE` default `cursor`); FRAMEWORK_KIT_REPO slices waive live browser with `UAT_PROBE_FORBIDDEN`. Masterplan §20 requires owned Playwright isolated + authorized CDP. Pixel visual baseline deferred.

### Discovery locks D1–D10

| ID | Lock |
|----|------|
| **D1** | Compose US-0141 AppRuntime Connect/health/ports. Consume `connectHandoff`. Do **not** reimplement AppRuntime, ProcessManager, or ExecutionBackend. |
| **D2** | Owned browser runtime in standalone. Package home is likely `standalone/packages/browser-uat` **or similar** — **architecture decides (DQ1)**. **No Pi** imports outside `packages/pi-kernel`. |
| **D3** | Playwright isolated/headless contexts **and** operator-authorized Chrome/Chromium CDP for logged-in sessions. Cursor browser MCP is host-only compatibility (US-0093 KEEP contract, REPLACE backend). This story owns kit/standalone runtime — Cursor MCP is **not** v1 authority. |
| **D4** | Typed `itsm_browser` tool: open, navigate, snapshot, click, type, select, wait, screenshot, console, network, download/upload, accessibility. Promote from PolicyEngine `STUB_TOOLS`. Prefer one structured tool with typed actions. |
| **D5** | Existing UAT planning/classification maps to process health, CLI smoke, browser smoke, API probes, or manual judgment; persist compatible `uat.json`. This story **owns lifting** `browser_smoke` for applicable US-0142 probes. Do **not** weaken `UAT_PROBE_FORBIDDEN` for other stories (`.env` / intake-evidence / secret-token deny + kit-slice waives remain). |
| **D6** | Each applicable probe records screenshot, snapshot summary, console errors, failed requests, final URL, trace, duration, backend, and app-runtime reference. Redact headers, cookies, tokens, and sensitive form data from evidence/logs (traces/HAR leak secrets unless scrubbed). |
| **D7** | Crashes, failed waits/assertions, console/network failures, missing authorization, and evidence gaps → fail-closed under bounded retry. Browser agents cannot read credentials from project files; authenticated flows use authorized profile, opaque injected test account, or explicit operator approval. Never read `.env`. |
| **D8** | E2E fixtures: app launch through browser action/evidence/UAT gate happy+failure; exploratory→regression without visual-diff v1 blocker. Tests `test_us0142_*` (expect 12 at execute). Kit `files` omit `standalone/`; do not add standalone to kit workspaces. |
| **D9** | OUT: pixel visual baseline; US-0143 `/auto` drain; restore `.opencode/commands/auto.md`; kit `cli.json`; plugin-local `its-magic-auto/tui.json`; OS micro-VM; npm-publish; git push. |
| **D10** | Do not mutate US-0141 DONE, US-0143+, BUG-0021/0022/0023. Do not drain bugs. Do not reopen US-0133..US-0140. Research stub **R-0139** (PO does not author `## R-0139`; do not wipe R-0138 / R-0136 / R-0137). Companion **DEC-0142** + `# US-0142` at `/architecture` only. |

### Research questions DQ1–DQ10 (for `/research` → expect **R-0139**; stub only here)

1. **DQ1**: Package split — sibling `standalone/packages/browser-uat` vs nested under `app-runtime` vs `tool-broker`. Who owns BrowserUAT vs Playwright driver vs CDP attach. No Pi. How QA/tool-broker consumes `connectHandoff` without importing app-runtime internals.
2. **DQ2**: Two-mode matrix — `chromium.launch` + `newContext` (isolated/headless) vs `connectOverCDP` vs `launchPersistentContext`. Chrome policy: default User Data dir is **not** automatable. Operator CDP authorization UX (debug port, dedicated profile). Disconnect vs close so the developer browser stays alive.
3. **DQ3**: Typed tool schema — single `itsm_browser` + action enum vs many tools. Promote `itsm_browser` from `STUB_TOOLS`. Role capability (QA vs others). Compose PolicyEngine path/shell/secret deny.
4. **DQ4**: UAT planner — reuse `uat_probe_lib.classify_step`; standalone executor plug-in; `UAT_BROWSER_PROBE_MODE` new owned value vs replacing `cursor` default; `FRAMEWORK_KIT_REPO=1` slices still waive `browser_smoke` with `UAT_PROBE_FORBIDDEN` (do not weaken for other stories).
5. **DQ5**: Evidence schema compatible with `uat.json` `probe_results[]` + US-0093 `browser_evidence_refs`. Trace zip / HAR redaction (Playwright traces serialize cookies/Authorization). Compose US-0135 `redact.ts`. App-runtime handle/ref field names.
6. **DQ6**: Credential paths — authorized CDP profile vs opaque externally injected test account vs explicit operator approval. Injection that the model cannot read. Never read `.env`.
7. **DQ7**: Fail-closed taxonomy + retry cap (new vs compose US-0141 `APP_RUNTIME_RESTART_MAX` / existing `UAT_BROWSER_PROBE_*`). Missing CDP authorization reason code. No silent PASS / no fake browser PASS (US-0128).
8. **DQ8**: `test_us0142_*` Win+Linux inventory covering AC-1..AC-8 (expect 12). Playwright install strategy; CI fake-model without live Chrome vs fixture app; happy+failure UAT gate; exploratory→regression without visual-diff.
9. **DQ9**: Compose vs replace: US-0093 Cursor MCP (KEEP contract, REPLACE backend); US-0065 probe catalog; US-0128 smoke surrogate; US-0141 Connect-only. Do not rewrite GateEngine/workflow.
10. **DQ10**: Kit boundary — `package.json` `files` omit `standalone/`; no kit `cli.json`; no plugin-local `tui.json`; no `auto.md` restore. FRAMEWORK_KIT_REPO=1. **R-id live-inventory**: allocate **R-0139**; do not wipe R-0138 (US-0141) or R-0136/R-0137 (BUG-0023).

### Design refs

- `docs/product/standalone-its-magic-pi-masterplan.md` sections 20 (two modes, typed API, UAT planner, evidence, credentials, exploratory→regression, visual QA later), 26.4 (secret handling / redact Authorization/Cookie), 32 Phase 4, 35, 36
- Playwright: [isolation / browser contexts](https://playwright.dev/docs/browser-contexts); [`connectOverCDP`](https://playwright.dev/docs/api/class-browsertype#browser-type-connect-over-cdp); [`launchPersistentContext`](https://playwright.dev/docs/api/class-browsertype) (Chrome default profile blocked); [tracing](https://playwright.dev/docs/api/class-tracing) + HAR `content: omit`
- Industry: [Playwright attach to live Chrome via CDP](https://remote-browser.dev/blog/playwright-use-existing-browser); [trace/HAR secret leakage](https://currents.dev/posts/playwright-avoid-data-leak)
- Compose: US-0141 / DEC-0141 / R-0138 (`connectHandoff`); US-0093 / R-0079 (KEEP contract REPLACE backend); US-0065; US-0128; US-0135 redact; US-0137 PolicyEngine `itsm_browser` stub; US-0085 `.env` deny
- Intake (read-only): `handoffs/intake_evidence/US-0133-0148-intake-20260911.json` (`browser-uat` → US-0142)

### Research stub (PO does not author `docs/engineering/research.md`)

- **Expected next R-id**: **R-0139** (`ID_NAMESPACE_BOOTSTRAP=0`; highest existing heading is **R-0138** US-0141).
- Do **not** author `## R-0139` this phase. Do **not** wipe R-0138 (US-0141) or R-0136/R-0137 (BUG-0023). Do **not** reuse R-0133 / R-0135.
- Companion **DEC-0142** + `# US-0142` at `/architecture` only — PO does not author them.

### Runtime proof (DEC-0038)

- `runtime_proof_id=rp-auto-20260913-us0142-discovery-po-20260914T031000Z-US-0142`
- `proof_hash=5FF73D3703330EABE49AA2A07FE6DBD56DAFE5972B489A85309D5CD1A83A1DCB`
- `proof_ttl=2026-09-14T04:10:00Z`
- Hash via `from scripts.token_cost_lib import compute_strict_proof_hash` (positional; compact sorted-key JSON).
- Canonical hashed payload: `{"orchestrator_run_id":"auto-20260913-us0142","phase_id":"discovery","proof_issued_at":"2026-09-14T03:10:00Z","proof_ttl_seconds":3600,"role":"po","runtime_proof_id":"rp-auto-20260913-us0142-discovery-po-20260914T031000Z-US-0142"}`
- Isolation extras (not hashed): `delivery_mode=ultra_lean`, `macro_phase=spec`, `model_id=cursor-grok-4.6-high`, `sprint_id=none`, `story_id=US-0142`, `skipped_phases=[intake]`, `native_chain_active=true`, `native_chain_continuing=true`
- `hash_recompute_confirmation=true` (compute_strict_proof_hash → 5ff73d3703330eabe49aa2a07fe6dbd56dafe5972b489a85309d5cd1a83a1dcb; independently MATCH; **64 hex** verified; stored uppercase)

### Isolation + stop

- `phase_id=discovery`, `role=po`, `story_id=US-0142`, `model_id=cursor-grok-4.6-high`, `fresh_context_marker=po-US0142-discovery-20260914T031000Z-fresh`
- `evidence_ref=docs/product/backlog.md ## US-0142 discovery_notes; docs/product/vision.md ## Discovery Notes — US-0142; this handoff; docs/engineering/state.md discovery checkpoint; handoffs/resume_brief.md; handoffs/intake_evidence/US-0133-0148-intake-20260911.json (read-only)`
- **Hot-surface note**: Appended (not prepended) so triad oldest-prefix rollover retains this newest section. Post-append `--rollover --json` `{"boundary":"triad-rollover|state","moved":1,"pack_ref":"docs/engineering/state-archive/state-pack-20260913-en.md","retained_checkpoints":12,"retained_lines":1119}` + `{"boundary":"triad-rollover|po_to_tl","moved":1,"pack_ref":"handoffs/archive/po-to-tl-pack-20260913-w.md","retained_lines":632,"retained_sections":13}`. `arch_linkage_guard.py` not run (architecture.md not touched). Architecture not rolled this phase. Discovery handoff retained at true end of `po_to_tl.md`.
- **Status**: US-0142 remains **OPEN**. AC-1..AC-8 remain unchecked. **Next**: orchestrator sovereign-critic of discovery, then `/research` in fresh **tech-lead** subagent. Do not spawn research or critic from this discovery chat. STOP.

