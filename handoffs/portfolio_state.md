# Portfolio State

Last refreshed: 2026-09-27T15:10:00Z by curator (refresh-context for S0161 / BUG-0030 terminal phase closure — **BUG-0030 DONE** released, 4 OPEN bugs remaining: BUG-0022, BUG-0026, BUG-0028, BUG-0029 — not drained; BUG-0023/0024/0027 held DONE).

## Active stories

| story_id | title | status | priority | sprint_id | notes |
|----------|-------|--------|----------|-----------|-------|
| (none genuine) | — | — | — | — | **Drain queue EMPTY of genuine OPEN stories** — US-0119 shipped (1/10 this cycle). US-0108 row remains OPEN in `docs/product/backlog.md` L3568 but is **status-drift** (shipped via `sprints/S0108/release-verdict.json` verdict=PASS, next_phase=BACKLOG_DRAIN_ADVANCE 2026-06-29T22:45:00Z) — NOT a genuine OPEN story to advance to. Operator should reconcile US-0108 separately (flip OPEN→DONE + `[ ]`→`[x]`) OR open a `BUG-####`. |

## Recently closed stories

| story_id | title | status | sprint_id | closed_at |
|----------|-------|--------|-----------|-----------|
| US-0119 | Autonomous-autonomy presets and configurable hard-stop relaxation | DONE | S0119 | 2026-07-06T21:03:00Z |
| US-0118 | Work-kind classification + tiered delivery routing per story | DONE | S0118 | 2026-07-05T00:20:00Z |
| US-0117 | Phase & role governance operator documentation in framework README | DONE | S0117 | 2026-07-04T20:24:00Z |
| US-0116 | Delivery & lifecycle operator documentation in framework README | DONE | S0116 | 2026-07-04T18:10:00Z |
| US-0115 | Integration & observability operator documentation in framework README | DONE | S0115 | 2026-07-04T08:54:00Z |
| US-0114 | Release & distribution operator documentation in framework README | DONE | S0114 | 2026-07-04T07:20:00Z |
| US-0113 | Sovereign-loop operator documentation in framework README | DONE | S0113 | 2026-07-04T03:15:00Z |
| US-0112 | Ship model-catalog example presets on install/upgrade | DONE | S0112 | 2026-06-30T23:50:00Z |
| US-0111 | Release-trigger-driven version changelog derivation | DONE | S0111 | 2026-06-30T20:00:00Z |
| US-0110 | Goal-based convergence loops | DONE | S0110 | 2026-06-28T21:00:00Z |
| US-0109 | Self-healing deploy loop | DONE | S0109 | 2026-06-30T03:00:00Z |
| US-0108 | Parallel instance arbitrage | DONE (status-drift — shipped via S0108 release but backlog row never flipped) | S0108 | 2026-06-29T23:00:00Z |
| US-0107 | Sovereign loop mode orchestration | DONE | S0107 | 2026-06-29T00:23:00Z |
| US-0106 | Sovereign role-behavior manifest | DONE | S0106 | 2026-06-29T01:35:00Z |
| US-0105 | Sovereign memory substrate | DONE | S0105 | 2026-06-29T00:13:00Z |
| US-0104 | Cross-model adversarial critic | DONE | S0104 | 2026-06-29T00:03:00Z |
| US-0103 | AI decision ledger | DONE | S0103 | 2026-06-28T15:00:00Z |

## Bug issues

| bug_id | title | status | sprint_id | notes |
|--------|-------|--------|-----------|-------|
| BUG-0022 | `/auto` Task-spawns inherit parent chat model instead of role_catalog | OPEN | (none) | not drained |
| BUG-0026 | Published its-magic@0.1.4 upgrade fail-closes KERNEL_CONTRACT_MISMATCH | OPEN | (none) | not drained |
| BUG-0028 | `itsm` read-only commands cold-start full runtime excessively | OPEN | (none) | not drained |
| BUG-0029 | `itsm auth login` cannot accept API-key input; false success | OPEN | (none) | not drained |

## Recently closed bugs

| bug_id | title | status | sprint_id | closed_at |
|--------|-------|--------|-----------|-----------|
| BUG-0030 | OpenCode `/auto` aborts with OPENCODE_AUTO_TUI_DEFINED_UNBRANDED | DONE | S0161 | 2026-09-27T15:05:00Z |
| BUG-0027 | OpenCode manual phase commands persist canonical workflow evidence | DONE | S0160 | 2026-09-21T22:20:00Z |
| BUG-0024 | OpenCode CLI TUI live-dispatch residual after BUG-0023 Axis A | DONE | S0159 | 2026-09-21T20:20:00Z |
| BUG-0023 | OpenCode CLI TUI listed `/auto` toasts DISPATCH on invoke | DONE | S0148 | 2026-09-14T01:30:00Z |
| BUG-0021 | OpenCode CLI TUI no invokable `/auto` after BUG-0020 tui.json | DONE | S0146 | 2026-09-13T15:05:00Z |
| BUG-0020 | OpenCode no invokable auto mode after BUG-0019 TUI keymap | DONE | S0140 | 2026-09-13T03:20:00Z |
| BUG-0019 | OpenCode slash palette no `/auto` after plugin-only ownership | DONE | S0139 | 2026-09-12T22:30:00Z |
| BUG-0018 | OpenCode markdown `/auto` wins over plugin execute (STOP) | DONE | S0138 | 2026-09-12T18:00:00Z |
| BUG-0017 | OpenCode on Linux ignores its-magic slash commands (CRLF) | DONE | S0137 | 2026-09-12T15:00:00Z |
| BUG-0016 | OpenCode Layer-1 role permissions block lifecycle writes | DONE | S0136 | 2026-09-12T12:00:00Z |
| BUG-0015 | OpenCode `/auto` never triggers orchestrator plugin dispatch | DONE | S0131 | 2026-09-06T16:00:00Z |

## Drain state

- **backlog_drain_active**: true (drain active — 1/10 stories shipped this cycle; drain budget remaining = 9; no genuine OPEN stories remaining in drain queue)
- **drain_terminated**: false (drain active — drain budget remaining = 9 of AUTO_BACKLOG_MAX_STORIES=10; US-0108 status-drift does NOT count as a genuine OPEN story to advance to; if no genuine OPEN stories exist, orchestrator emits drain-complete terminal)
- **portfolio_open_story_count**: 0 (genuine); 1 status-drift item (US-0108) flagged for operator awareness
- **portfolio_open_bug_count**: 0
- **backlog_drain_stories_remaining_budget**: 9 (drain budget remaining = AUTO_BACKLOG_MAX_STORIES=10 minus 1 shipped = 9)
- **drain_stories_shipped**: 1/10 this drain cycle (US-0119)
- **next_candidate**: (none — drain queue EMPTY of genuine OPEN items; US-0108 status-drift is NOT a genuine candidate)
- **us0108_status_drift_flagged**: true (non-blocking finding for operator awareness — US-0108 shipped via `sprints/S0108/release-verdict.json` but its `docs/product/backlog.md` L3568 row was never flipped OPEN→DONE per US-0045; closure is `/release`'s responsibility; operator should manually reconcile OR open a `BUG-####`)
- **next_action**: drain-advance to next OPEN story OR drain-complete terminal (no genuine OPEN stories to advance to — orchestrator runs sovereign-loop advance hook then emits drain-complete terminal if no more genuine OPEN stories; operator may enqueue new work via `/intake` or `/auto`)
- **prior_segment**: US-0118 DONE (S0118 RELEASED, refresh-context terminal 2026-07-05T00:30:00Z — prior drain complete 6/6)
- **current_segment**: US-0119 DONE (S0119 RELEASED, refresh-context terminal 2026-07-06T21:02:00Z — new drain cycle 1/10)

## Segment closure note (US-0119)

US-0119 (Autonomous-autonomy presets and configurable hard-stop relaxation) closed end-to-end in a single `/auto` orchestrator session. First code+docs vertical-slice story with AUTONOMY_PRESET expansion mechanism + AUTONOMY_STOP_POLICY dispatch + repair ledger audit trail. 12/12 ACs RELEASED. 10/10 tests PASS. 6/6 compose guards UNCHANGED. PARITY_OK 20083 20083. DEC-0119 Accepted.

US-0119 established four reusable patterns: (a) **AUTONOMY_PRESET expansion mechanism** (preset={none|balanced|full} → deterministic expansion → 12 per-feature flags → audit via ledger → breadcrumb in state.md), (b) **AUTONOMY_STOP_POLICY dispatch** (policy={block|auto_repair_then_block|auto_repair_then_skip} classifies every fail-closed reason code), (c) **repair ledger audit trail** (bounded auto-repair ledger with cap per run+reason_code), (d) **backward-compatible default** (AUTONOMY_PRESET=none = byte-identical pre-US-0119).

US-0108 status-drift flagged as non-blocking finding for operator awareness (US-0108 shipped but backlog row never flipped OPEN→DONE per US-0045 — closure is `/release`'s responsibility). Operator should manually reconcile OR open a `BUG-####`.
