# PO to TL archive pack (2026-09-21)

- Rollover trigger: `PO_TO_TL_HOT_MAX_LINES=650, PO_TO_TL_HOT_MAX_SECTIONS=60`
- Source: `handoffs/po_to_tl.md`
- Archived units (oldest first, contiguous prefix): 1
- Retained units in hot file: 16
- First archived heading: `## Intake handoff - BUG-0027 OpenCode manual phase persistence`
- Last archived heading: `## Intake handoff - BUG-0027 OpenCode manual phase persistence`
- Verification tuple (mandatory):
  - archived_body_lines=12
  - retained_body_lines=639

---

## Intake handoff - BUG-0027 OpenCode manual phase persistence

- Phase completed: intake. Role: po. Bug: BUG-0027. Verdict: PASS (`decision_gate=false`).
- Timestamp (UTC): 2026-09-21T19:05:44Z. `intake_run_id=ir-20260921T190544Z-bug0027`.
- Evidence: `handoffs/intake_evidence/BUG-0027-intake-20260921T190544Z.json` validated via the supported `python scripts/intake_evidence_validate.py --stdin` interface.
- Validator defect observed: the command-pack-required `python scripts/intake_evidence_validate.py --repo . --enforce` exits 2 because those arguments are unsupported. This is in scope for BUG-0027.
- Scope: Make direct OpenCode phase commands a truthful fallback when BUG-0024 prevents `/auto`: propagate run context, persist canonical artifacts/isolation evidence, and fail closed on denied persistence. Do not fabricate strict proofs.
- Boundary: BUG-0024 remains open and owns `/auto` CLI/TUI dispatch. BUG-0016 is compose-only. US-0150 remains OPEN; do not set status or acceptance without a genuine release/closure chain.
- Next: `/discovery` in a fresh PO context. STOP.

---

