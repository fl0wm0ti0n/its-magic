# PO to TL archive pack (2026-10-16)

- Rollover trigger: `PO_TO_TL_HOT_MAX_LINES=650, PO_TO_TL_HOT_MAX_SECTIONS=60`
- Source: `handoffs/po_to_tl.md`
- Archived units (oldest first, contiguous prefix): 1
- Retained units in hot file: 26
- First archived heading: `## Discovery handoff — US-0155 interactive Pi-style standalone operator TUI`
- Last archived heading: `## Discovery handoff — US-0155 interactive Pi-style standalone operator TUI`
- Verification tuple (mandatory):
  - archived_body_lines=10
  - retained_body_lines=645

---

## Discovery handoff — US-0155 interactive Pi-style standalone operator TUI

- **Phase completed**: discovery. **Role**: po. **Story**: US-0155 only. **Sprint**: (none — do not create). **Verdict**: DISCOVERY_PASS (`decision_gate=false`). **Timestamp (UTC)**: 2026-10-12T18:59:27Z. **Fresh marker**: `po-US0155-discovery-20261012T185927Z-fresh`.
- **Orchestrator**: `orchestrator_run_id=auto-20261012-us0155-discovery`, `delivery_mode=ultra_lean`. Intake already persisted (`handoffs/intake_evidence/standalone-cli-ux-intake-20260923T213043Z.json`) — not re-intaken. Consumed refresh pair `auto-20261012-us0154-refresh|story|(none)|refresh-context|rp-auto-20261012-us0154-refresh-curator-20261012T185524Z` / `595814e6219fe5caffaf559feb2a41fe9aa17f56445f7950e558a76501bb5c19`.
- **Problem lock**: The interactive TUI is a client of the daemon/operator transport, not a second runtime. Commands, streaming events, diagnostics, and approve/cancel/pause/resume go through the admitted runtime. Panels are bounded. Keyboard, resize, redaction, reconnect, and non-interactive fallback are in scope. Confirmed gap: `standalone/apps/tui/src/index.ts` `buildTuiModel` attaches as an observer, waits 200ms, and prints once. `standalone/apps/tui/src/panels.ts` renders only phase, status, timeline, and tools.
- **Locks**: **D1** the TUI uses Pi TUI components or compatible interactive primitives while remaining a client of the daemon/operator transport, not a second runtime or workflow engine (AC-1). **D2** the operator can submit supported commands, see streaming agent and tool events, receive actionable failure diagnostics, and approve, cancel, pause, or resume work through the same admitted runtime as CLI clients (AC-2). **D3** panels cover conversation, active phase/role, timeline, tool activity, changed files, app/log health, browser evidence, and model/token/cost data with bounded rendering for large streams (AC-3). **D4** keyboard interaction, resize/collapse behavior, secret redaction, reconnect/replay, and non-interactive fallback work on Windows and Linux terminals (AC-4). **D5** integration tests exercise the real daemon protocol and prove event ordering, approval/cancel paths, reconnect, redaction, and responsive panel behavior without creating a Pi session outside runtime admission (AC-5).
- **Preserve**: US-0146 remains the completed lightweight ANSI/client slice and is not rewritten. US-0151 owns shared executable transport and stays DONE. Do not add web, mobile, IDE, or remote-worker clients. US-0149 through US-0154 remain DONE. US-0156 remains DONE. No sprint. No AC ticks. No `.env` read.
- **Research stub**: **R-0165** (tech-lead authors the heading). Highest existing is **R-0164**. **R-0155** is already used (BUG-0031 `/closure` spawn authorization) — do not reuse or wipe. Proof `rp-auto-20261012-us0155-discovery-po-20261012T185927Z` / `7ffe8db872538e51cdb0989a31683d4787da498203d95d757be91553e3fd276c`; issued 2026-10-12T18:59:27Z; `proof_ttl_seconds=3600`; ttl 2026-10-12T19:59:27Z.
- **Status**: US-0155 remains **OPEN**. AC-1..AC-5 remain unchecked. US-0154 remains **DONE**. **Next**: `/research` in a fresh **tech-lead** context. This PO child does not spawn it. STOP.

