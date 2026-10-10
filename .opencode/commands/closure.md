---
description: "its-magic closure: story closure with role=qe."
agent: qa
---

# /closure

phase_id: closure
role: qe

## Artifacts
- sprints/Sxxxx/closure-verification.md
- docs/product/backlog.md (status flip)
- docs/product/acceptance.md (checkbox tick)

## Validator bridge
Before writing to `docs/product/backlog.md` bug rows or `docs/product/acceptance.md` bug rows, run `python scripts/bug_issue_validate.py --repo . --check-acceptance` and surface any non-zero exit reason code to the operator. The orchestrator plugin enforces persistence.

## Stop conditions

- Fail-closed stop tokens (diagnostics only; enforcement in the Python validator bridge):
  `CLOSURE_RELEASE_EVIDENCE_MISSING`, `CANONICAL_STATUS_CONFLICT`, `CLOSURE_AMBIGUOUS_TARGET`,
  `CLOSURE_TARGET_NOT_FOUND`, `CLOSURE_PERMISSION_FLIP_PATHS_DENIED`.

## Fail-safe reason codes

- Diagnostic vocabulary surfaced by the closure validator bridge — this file does not enforce them.
- Full condition + remediation table: `.cursor/commands/closure.md` `## Fail-safe reason codes and remediation guidance`.
STOP
