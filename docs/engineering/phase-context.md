# Phase context pointers

Use this file as the **first** narrow read for workflow orientation. Expand to
linked hot or archive paths only when a question stays unresolved after the
default set (see minimal-read table in `docs/engineering/runbook.md`).

| Kind | Path | Notes |
|------|------|-------|
| Engineering state (hot) | `docs/engineering/state.md` | Recent checkpoints; archive under `docs/engineering/state-archive/` |
| Decisions index | `docs/engineering/decisions.md` | Compact index; full records under `decisions/` |
| PO → TL handoff (hot) | `handoffs/po_to_tl.md` | Narrative handoff; archive under `handoffs/archive/` |
| Architecture (hot) | `docs/engineering/architecture.md` | Story-shaped sections; archive under `docs/engineering/architecture-archive/` |
| Triad enforcement | `scripts/enforce-triad-hot-surface.py` | `--check` before phase completion when mutating triad surfaces |

Escalation: open the **named archive pack** cited in the latest rollover
verification tuple for the surface you need, not the entire archive tree.

## Current hot snapshot (refresh-context 2026-10-19)

- **BUG-0038 DONE** / **S0183 released** / `orchestrator_run_id=repair-20261018-bug0038-anchor-repair`
- Latest curator pair: **refresh-context** **REFRESH_CONTEXT_PASS** @ `2026-10-19T21:00:00Z`; `fresh_context_marker=curator-BUG0038-refresh-20261019T210000Z-fresh`
- Research: **R-0173** **delivered** (approach **A1**; no companion DEC)
- Drain: `backlog_drain_active=false`; `drain_advance_action=not_applicable`
- Next phase from this pair: **none** — segment terminal; parent selects next work
