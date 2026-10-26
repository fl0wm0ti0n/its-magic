# PO to TL archive pack (2026-10-25)

- Rollover trigger: `PO_TO_TL_HOT_MAX_LINES=650, PO_TO_TL_HOT_MAX_SECTIONS=60`
- Source: `handoffs/po_to_tl.md`
- Archived units (oldest first, contiguous prefix): 1
- Retained units in hot file: 26
- First archived heading: `## Bug-intake handoff — BUG-0044 (recurring DEC-0153 continuation-pair omission, `/intake bug`)`
- Last archived heading: `## Bug-intake handoff — BUG-0044 (recurring DEC-0153 continuation-pair omission, `/intake bug`)`
- Verification tuple (mandatory):
  - archived_body_lines=12
  - retained_body_lines=649

---

## Bug-intake handoff — BUG-0044 (recurring DEC-0153 continuation-pair omission, `/intake bug`)

- **Phase completed**: intake. **Role**: po. **Work item**: BUG-0044 (`INTAKE_WORK_ITEM_KIND=bug`). **Sprint**: (none — do not create). **Verdict**: PASS (`decision_gate=false`). **Timestamp (UTC)**: 2026-10-25T14:26:05Z. **Intake boundary**: `2026-10-25T14:26:05Z`.
- **Defect (single class)**: a spawned phase child on the OpenCode auto orchestrator (full_autonomy, `ultra_lean`) completes its phase (e.g. `/sprint-plan`, `/verify-work`) and STOPs without writing the mandatory DEC-0153 state-first continuation pair (state-bottom JSON + brief-top JSON, byte-identical, strict 6-tuple proof hash), so the parent cannot validate a continuation anchor and the auto chain stalls. Recurred on US-0164 `/sprint-plan` and US-0163; new same-run manifestation: a `/verify-work` child left `sprints/S0185/uat.json`/`uat.md` in the QA lifecycle state (status=QA_PASS, phase_id=qa, next=verify-work) instead of the verify-work terminal state, so `/release` fail-closed `RELEASE_UAT_INCOMPLETE` and required a separate repair. Class = "phase child does not complete its canonical handoff/reconcile obligations before STOP."
- **Intake evidence**: `handoffs/intake_evidence/BUG-0044-intake-20261025T142605Z.json` — `[INTAKE_EVIDENCE_VALIDATION_OK]` (exit 0, pre-write). `selected_pack=small-intake-pack`; 5 topics, per-topic `answer_ref` quotes distinct (BUG-0007 anti-echo); `required_tests_acceptance_checks` via `delegation_ref` (confidence high). `intake_run_id=ir-20261025T142605Z-bug0044-continuation-pair`, `writer_id=po-opencode-20261025-continuation-pair`.
- **Duplicate check**: BUG-0015..BUG-0043 reviewed. BUG-0016/BUG-0038 (permission dead-ends) and BUG-0035 (resume-brief ownership) are DONE and related but not this continuation-pair-omission class; BUG-0040..BUG-0043 (just filed) are distinct defect classes and are **NOT** reopened. US-0163/US-0164 are citations only, not edited.
- **Decomposition**: `single_bug`.
- **Constraints locked**: `RESUME_BRIEF_AUTO_REFRESH=0` absolute; DEC-0153 parent spawn-only (no parent proof-minting); no story/bug-intake resume-brief refresh (US-0164/BUG-0041 boundary); missing/conflicting-pair stays a deterministic fail-closed stop.
- **Persistence**: `### BUG-0044` block added to `docs/product/backlog.md` (after `### BUG-0043`, before `## US-0150`); unchecked row added to `docs/product/acceptance.md` (after the BUG-0043 row). `Status: OPEN`, AC-1..AC-5 unchecked.
- **Not touched**: `docs/engineering/state.md` and `handoffs/resume_brief.md` remain byte-untouched (story/bug intake on this host does not refresh the DEC-0153 pair — BUG-0041 boundary; the US-0164 closure pair at state-bottom/brief-top is preserved). No `R-` body, no AC ticks, no sprint, no implementation.
- **Status**: BUG-0044 remains **OPEN**. **Next**: `/discovery` in a fresh PO context. This PO child does not spawn discovery. STOP.

