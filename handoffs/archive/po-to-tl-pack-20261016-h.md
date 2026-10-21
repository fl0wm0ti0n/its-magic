# PO to TL archive pack (2026-10-16)

- Rollover trigger: `PO_TO_TL_HOT_MAX_LINES=650, PO_TO_TL_HOT_MAX_SECTIONS=60`
- Source: `handoffs/po_to_tl.md`
- Archived units (oldest first, contiguous prefix): 1
- Retained units in hot file: 26
- First archived heading: `## Intake handoff — US-0163 priority-band append`
- Last archived heading: `## Intake handoff — US-0163 priority-band append`
- Verification tuple (mandatory):
  - archived_body_lines=13
  - retained_body_lines=643

---

## Intake handoff — US-0163 priority-band append

- **Phase completed**: intake. **Role**: po. **Story**: US-0163 only. **Sprint**: (none — do not create). **Verdict**: INTAKE_PASS (`decision_gate=false`). **Timestamp (UTC)**: 2026-10-16T19:35:00Z. **Fresh marker**: `po-US0163-intake-20261016T193500Z-fresh`.
- **Run**: `writer_id=po-cursor-20261016-us0163`, `intake_run_id=ir-20261016T193500Z-us0163`, `INTAKE_GUIDED_MODE=0`, `INTAKE_WORK_ITEM_KIND=story`, `WORK_KIND_ROUTING=0`, `ID_NAMESPACE_BOOTSTRAP=0`, `EARLY_RESEARCH=0`. Evidence: `handoffs/intake_evidence/US-0163-intake-20261016T193500Z.json`. Validator: `[INTAKE_EVIDENCE_VALIDATION_OK]`. Bug-routing guard: `[INTAKE_BUG_ROUTING_OK] kind=story` exit 0.
- **Operator lock**: Answer `1. B` — priority still sorts, and append means the end of that priority band. Answer `2. both` — OPEN stories and OPEN bugs. Answer `3. just pick and ..` — intake picks an order and records the dependency. Answer `4. yes` — scale stays P0 / P1 / P2 / P3. Answer `5. ok` — done sentence confirmed.
- **Placement of this story**: P1, end of the P1 band (next id US-0163). No dependency pulls it ahead of P0 US-0162 or ahead of earlier P1 items.
- **Split**: single story. Low-touch. No `R-` entry.
- **Duplicate check**: new story. Policy overlap with DONE US-0044 AC-2 and DONE US-0156 AC-3. Do not reopen US-0044, US-0087, or US-0156. Do not rewrite US-0157 through US-0162.
- **Risks for discovery**: how Cursor `/auto` and OpenCode `/auto` merge the story selector with OPEN bugs inside one band; how a recorded dependency moves an item without an operator prompt; how missing Priority fails closed; US-0087 explicit bug target still wins.
- **Tests**: delegated contract coverage (same-band append, recorded dependency with no prompt, missing Priority fails closed). `delegation_confidence=medium`.
- **Non-goals**: no FIFO-only queue, no sprint, no architecture, no DEC, no research body, no `resume_brief` refresh, no rewrite of US-0162.
- **Status**: US-0163 is **OPEN**. AC-1..AC-6 are unchecked. **Next**: `/discovery` in a fresh context. This intake does not spawn it. STOP.

