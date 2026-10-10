---
description: "its-magic research: risks, patterns, dependencies."
agent: tech-lead
---

# /research

phase_id: research
role: tech-lead

## Artifacts
- docs/engineering/research.md
- handoffs/tl_to_dev.md

## Validator bridge
Before writing to `docs/product/backlog.md` bug rows or `docs/product/acceptance.md` bug rows, run `python scripts/bug_issue_validate.py --repo . --check-acceptance` and surface any non-zero exit reason code to the operator. The orchestrator plugin enforces persistence.

## Continuation contract (BUG-0035 / DEC-0153)
Only this completed phase child may author its paired continuation record
(`handoffs/resume_brief.md` plus the `docs/engineering/state.md` checkpoint).
Commit order is state first, then the brief pointer, and only after the exact
pair key and locked tuple are validated. The spawn-only parent remains
validate-and-spawn-only: it never writes either artifact, never falls back to
state alone, never refreshes the brief automatically, and never schedules the
next phase on malformed or conflicting evidence.

STOP
