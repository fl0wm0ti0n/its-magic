---
description: "its-magic execute: implement tasks."
agent: dev
---

# /execute

phase_id: execute
role: dev

## Artifacts
- sprints/Sxxxx/progress.md
- sprints/Sxxxx/summary.md
- handoffs/dev_to_qa.md

The artifact list is not an edit allowlist. Follow the resolved `dev` agent
permission matrix for planned implementation surfaces, including allowed
`docs/engineering/**` paths.

## Persist
Stop with `OPENCODE_MANUAL_PHASE_WRITE_DENIED` only after an actual edit-tool
denial for a required path. persistManualPhaseIsolation writes IsolationEvidence.

## Stop conditions

- Decision gate triggered
- Missing task definition or unclear scope

## Fail-safe reason codes

- Fail-closed tokens surfaced during execute (diagnostics only): `ISOLATION_EVIDENCE_MODEL_ID_MISSING`
  (isolation model id absent under `CROSS_MODEL_REVIEW=1`), `UAT_BROWSER_PROBE_FAILED`, `UAT_BROWSER_UNAVAILABLE`
  (browser UAT). Full contract: the Cursor rich `execute.md`.
STOP
