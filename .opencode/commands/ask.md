---
description: "its-magic ask: answer questions using project context, read-only."
---

# /ask

phase_id: ask
role: (current agent)

Read-only. Answer from artifacts. No writes.

## Stop conditions

- (none — answer the question and stop)

## Fail-safe reason codes

- None. `/ask` is strictly read-only (no writes, no validator bridge); it has no fail-closed vocabulary.
STOP
