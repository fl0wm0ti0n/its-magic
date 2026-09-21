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

STOP
