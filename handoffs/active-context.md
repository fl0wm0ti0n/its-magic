# Active context index (US-0096 / DEC-0082)

> **Hot memory tier** at **`handoffs/active-context.md`** — lean spawn read/write surface.
> **`active-context.md` is NOT a triad member** (**DEC-0054**);
> **`enforce-triad-hot-surface.py`** does **not** scan this file.

## Index row schema

| Field | Description |
|-------|-------------|
| `story_id` | Active story (e.g. `US-0096`) |
| `delivery_mode` | `standard` \| `ultra_lean` \| `mega_quick` |
| `read_before_code[]` | Paths / anchors agents must read before code edits |
| `last_delta_utc` | ISO UTC of last material update |
| `open_risks[]` | Max **3** short risk bullets |

## Line budget

- Target **30–80** lines; hard cap **`LEAN_STATE_INDEX_ROWS`** (default **80**).
- Oversize with **`LEAN_MEMORY_WRITE=1`** → **`ACTIVE_CONTEXT_OVERSIZE`** (fail closed).

## Rollover

Archive to **`handoffs/archive/active-context-<story_id>-<utc>.md`** when:

1. Segment **`refresh-context`** completes, or
2. Line count exceeds **`LEAN_STATE_INDEX_ROWS`**.

Rewrite this file with a fresh stub after rollover.

## Current index

```yaml
bug_id: BUG-0038
bug_status: DONE
story_id: (none)
delivery_mode: ultra_lean
phase: segment-complete
sprint_id: S0183
read_before_code:
  - sprints/S0183/summary.md
  - sprints/S0183/closure-verification.md
  - tests/bug0038_qa_resume_brief_permission_contract_test.py
last_delta_utc: 2026-10-19T21:00:00Z
open_risks:
  - segment terminal; parent selects next work (no auto drain from this pair)
  - BUG-0037 remains OPEN in backlog
archive_ref: handoffs/archive/active-context-BUG-0038-20261019T210000Z.md
```
