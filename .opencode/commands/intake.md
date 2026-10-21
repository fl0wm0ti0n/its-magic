---
description: "its-magic intake: capture idea, backlog, acceptance."
agent: po
---

# /intake

phase_id: intake
role: po

## Artifacts
- docs/product/backlog.md
- docs/product/acceptance.md
- handoffs/po_to_tl.md

## Validator bridge
Before writing to `handoffs/intake_evidence/*.json`, run `python scripts/intake_evidence_validate.py --file <bundle.json>` (or `--stdin` / `--self-test`) and surface any non-zero exit. persistManualPhaseIsolation writes IsolationEvidence.

## Story creation

Every story created by /intake must use the canonical structured block
defined in `.opencode/agents/po.md` (see its `## Story block shape` section,
the single source of truth — reference, not re-duplication). Cite the
canonical exemplar `## US-0161` at `docs/product/backlog.md` L6144–6178.
The prose shape is forbidden: do not use an H3 `### US-####` heading,
`**Priority:**`, `**Release:**`, or `**Acceptance criteria**` bullets.

STOP
