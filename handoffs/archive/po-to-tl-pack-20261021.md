# PO to TL archive pack (2026-10-21)

- Rollover trigger: `PO_TO_TL_HOT_MAX_LINES=650, PO_TO_TL_HOT_MAX_SECTIONS=60`
- Source: `handoffs/po_to_tl.md`
- Archived units (oldest first, contiguous prefix): 1
- Retained units in hot file: 26
- First archived heading: `## Discovery handoff — US-0152 production application and browser UAT integration`
- Last archived heading: `## Discovery handoff — US-0152 production application and browser UAT integration`
- Verification tuple (mandatory):
  - archived_body_lines=10
  - retained_body_lines=646

---

## Discovery handoff — US-0152 production application and browser UAT integration

- **Phase completed**: discovery. **Role**: po. **Story**: US-0152 only. **Sprint**: (none — do not create). **Verdict**: DISCOVERY_PASS (`decision_gate=false`). **Timestamp (UTC)**: 2026-10-11T18:24:50Z. **Fresh marker**: `po-US0152-discovery-20261011T182450Z-fresh`.
- **Orchestrator**: `orchestrator_run_id=auto-20261011-us0152-discovery`, `delivery_mode=ultra_lean`. Intake already persisted (`handoffs/intake_evidence/US-0150-0154-standalone-integration-intake-20260919.json`) — not re-intaken. Consumed refresh pair `auto-20261011-us0151-refresh|story|(none)|refresh-context|rp-auto-20261011-us0151-refresh-curator-20261011T181953Z` / `9be8afdda50f2facb3b6427d39a987f4e2681b05f5e3dbd519a76b4eaf0065e4`.
- **Problem lock**: Execute, QA, and UAT launch a supported application and collect real browser evidence. Confirmed gap: `createRuntimeHost` does not own `AppRuntime` or `BrowserUAT`; `app` returns `APP_HEALTH_UNAVAILABLE` and `browser` returns `BROWSER_UNAVAILABLE`; `BrowserUAT` defaults to `FakeBrowserDriver` and `writeShot` writes `screenshot-placeholder`.
- **Locks**: **D1** composition owns `AppRuntime` and `BrowserUAT` for start, health, logs, cleanup, browser actions, and evidence (AC-1). **D2** production browser mode is isolated Playwright or `BROWSER_UNAVAILABLE`; fake driver and text screenshots are test-only (AC-2). **D3** app health, browser probes, and bounded debug retry join execute, QA, UAT, and release gates with repository evidence (AC-3). **D4** real screenshots, traces, console/network findings, final URL, and app-runtime refs are redacted and persisted; gaps block UAT (AC-4). **D5** `itsm app` and `itsm browser` call those services and return unavailable, authorization, and cleanup outcomes (AC-5). **D6** E2E covers launch-through-gate success plus crash, failed assertion, authorization refusal, and evidence-gap failures (AC-6).
- **Preserve**: US-0141 and US-0142 remain DONE compose-only. US-0149, US-0150, and US-0151 remain DONE. Do not start US-0153. Pixel baseline and micro-VM isolation stay deferred. No sprint. No AC ticks. No `.env` read.
- **Research stub**: **R-0162** (tech-lead authors the heading). Highest existing is **R-0161**. **R-0152** is already used (BUG-0030) — do not reuse or wipe. Proof `rp-auto-20261011-us0152-discovery-po-20261011T182450Z` / `2dc8118461fa20769e8b85ceb5c281fec2cfee6ed3dcb43507b1566ed03c64f9`; issued 2026-10-11T18:24:50Z; `proof_ttl_seconds=3600`; ttl 2026-10-11T19:24:50Z.
- **Status**: US-0152 remains **OPEN**. AC-1..AC-6 remain unchecked. US-0151 remains **DONE**. **Next**: `/research` in a fresh **tech-lead** context. This PO child does not spawn it. STOP.

