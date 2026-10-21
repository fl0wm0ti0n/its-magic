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
   phase/segment. A recoverable blocker, an AI error, an aborted phase, and
   a permission dead-end continue in this same run through continue_same_phase.
   Decision requests, pause, missing evidence, release ownership, quality
   failure, UAT failure, security stops, and exhausted retry/loop/backlog/bug
   budgets still terminate the run. The parent stays read-only.
5. Preserve the bridge-owned, idempotent continuation tuple (source, effective
   plan, skipped phases, completed/next phase, cursor/budget, stop reason,
   child isolation reference). Exact repeats are no-ops; conflicting evidence
   or a reused child session fails closed.

BUG-0035 / DEC-0153 — paired continuation ownership: the completed, canonical
phase child alone authors its state-first paired continuation record (the
`docs/engineering/state.md` checkpoint first, then the `handoffs/resume_brief.md`
latest-pointer block after exact pair-key and tuple validation). This parent is
permanently read/validate/spawn-only: it never writes either artifact, never
applies a state fallback, never refreshes the brief, and never schedules the
next phase while the pair is invalid. `RESUME_BRIEF_AUTO_REFRESH=0` remains an
absolute prohibition.

When `CROSS_MODEL_REVIEW=1`, the critic hook spawns tech-lead for `/sovereign-critic`. `CROSS_MODEL_REVIEW=0` spawns nothing. The permission block stays the seven roles. On a repairable continuation predicate for the just-completed child, this parent calls `validate_resume_pair` only and spawns one fresh child of that `writer_role` for that same `completed_phase` with a repair-only charter. This parent does not write `docs/engineering/state.md` or `handoffs/resume_brief.md` and does not set `RESUME_BRIEF_AUTO_REFRESH`. The next scheduled phase is not spawned while the pair is invalid.

Retired and forbidden: do not recursively invoke `/auto`, do not restore the
TUI/RPC dispatch route, a JSON command template, or a localhost endpoint, and
do not let direct manual phase commands substitute for fresh child Task
evidence.

## Stop conditions

- Deterministic stop reasons (see rich `.cursor/commands/auto.md` Stop matrix): `completed`, `decision_gate`,
  `missing_input`, `pause_request`, `loop_max`, `error`, `blocked`.
- A recoverable blocker, an AI error, an aborted phase, and a permission dead-end continue in this same run. Quality, UAT, security, and budget stops still terminate the run. The parent stays read-only.

## Fail-safe reason codes

- Resume-resolution failures use the `[AUTO_RESUME_ERROR] <code>: <summary>` envelope: `INVALID_START_FROM`,
  `RESUME_BRIEF_MISSING`, `RESUME_BRIEF_STALE`, `RESUME_BRIEF_UNPARSEABLE`, `RESUME_STATE_CONFLICT`,
  `STATE_PHASE_AMBIGUOUS`, `STATE_PHASE_UNRECOVERABLE`, `AUTO_SCHEDULER_CONFLICT`, `AUTO_BUG_QUEUE_EMPTY`,
  `AUTO_BUG_TARGET_UNKNOWN`, `AUTO_BUG_TARGET_NOT_OPEN`. Full contract: the Cursor rich `auto.md`.
