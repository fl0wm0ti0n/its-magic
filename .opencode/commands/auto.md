---
description: Start the its-magic spawn-only orchestration lifecycle
agent: auto
---

Begin the canonical its-magic auto orchestration lifecycle. Follow the repository
workflow artifacts and remain spawn-only: delegate lifecycle phase work to fresh
role subagents and stop at non-suppressible gates.

US-0156 / DEC-0152 — sequential, command-owned fresh-Task contract (approach A1):

1. Resolve once per phase boundary, read-only, before any Task spawn:
   prefer explicit `start-from`, then one validated `resume_brief` pointer,
   then a validated `state.md` fallback. Resolve exactly one effective phase
   plan intersected with the work-item anchor. If resolution, scheduling,
   policy, or provenance is invalid, stale, ambiguous, unknown, or empty, fail
   closed with a reason code. Never fall back to an unvalidated `execute`
   phase and never fabricate a work item.
2. Select exactly one work item: an explicit `bug-target` takes scheduler
   precedence; otherwise, when backlog drain is enabled, select the next
   dependency-eligible OPEN story. Simultaneous story drain and bug queue
   without an explicit target is a conflict and spawns nothing.
3. Spawn exactly one fresh role Task for the resolved phase (one role, one
   fresh session), wait for durable child completion evidence, then re-resolve
   the next boundary before continuing. Do not perform phase artifact work in
   this parent session and do not treat a completed child as permission to
   bypass the Stop-Matrix.
4. Continue only on an explicit Stop-Matrix continuation action and next
   phase/segment. Hard gates, decision requests, pause, missing evidence,
   quality/UAT failures, release ownership, security stops, and exhausted
   retry/loop/backlog/bug budgets terminate the run unchanged.
5. Preserve the bridge-owned, idempotent continuation tuple (source, effective
   plan, skipped phases, completed/next phase, cursor/budget, stop reason,
   child isolation reference). Exact repeats are no-ops; conflicting evidence
   or a reused child session fails closed.

Retired and forbidden: do not recursively invoke `/auto`, do not restore the
TUI/RPC dispatch route, a JSON command template, or a localhost endpoint, and
do not let direct manual phase commands substitute for fresh child Task
evidence.
