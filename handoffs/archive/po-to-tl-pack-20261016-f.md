# PO to TL archive pack (2026-10-16)

- Rollover trigger: `PO_TO_TL_HOT_MAX_LINES=650, PO_TO_TL_HOT_MAX_SECTIONS=60`
- Source: `handoffs/po_to_tl.md`
- Archived units (oldest first, contiguous prefix): 1
- Retained units in hot file: 26
- First archived heading: `## Intake handoff — BUG-0037 created stories omit canonical fields`
- Last archived heading: `## Intake handoff — BUG-0037 created stories omit canonical fields`
- Verification tuple (mandatory):
  - archived_body_lines=10
  - retained_body_lines=646

---

## Intake handoff — BUG-0037 created stories omit canonical fields

- **Phase completed**: intake. **Role**: po. **Bug**: BUG-0037 only. **Verdict**: persisted. **Timestamp (UTC)**: 2026-10-16T19:27:29Z. **writer_id**: `po-cursor-20261016-storyfields`. **intake_run_id**: `ir-20261016T192729Z-storyfields`. Status OPEN. Priority P1. `decision_gate=false`. `selected_pack=small-intake-pack`.
- **Evidence**: `handoffs/intake_evidence/BUG-0037-intake-20261016T192729Z.json`. Gate before product writes: `[INTAKE_EVIDENCE_VALIDATION_OK]`. Bug validator `[BUG_VALIDATION_OK]`. Resume brief `[INTAKE_BUG_RESUME_BRIEF_REFRESH_OK]` and `[INTAKE_RESUME_BRIEF_VALIDATE_OK]`. `intended_resume_phase=discovery`. `resolved_start_phase=discovery`. `resolution_source=resume_brief`. No `R-` entry. No US id. `INTAKE_GUIDED_MODE=0`. `WORK_KIND_ROUTING=0`. `EARLY_RESEARCH=0`. `ID_NAMESPACE_BOOTSTRAP=0`.
- **Pack**: asked_topics = outcome_success_criteria, impacted_components, constraints_compatibility_risks, required_tests_acceptance_checks, done_definition. missing_topics = none. assumptions_confirmed = (none). Outcome, the OpenCode host sentence, and `Gewohntes Beispiel: @backlog.md (6098-6133)` are distinct `answer_ref` rows. Constraints and required tests are distinct `delegation_ref` rows.
- **Duplicate check**: no open duplicate. BUG-0036 stays OPEN (`/auto` hard-stop) and is not reopened. BUG-0027 stays DONE (OpenCode phase persistence) and is not this missing-field shape.
- **Scope**: Current its-magic story creation on OpenCode omits important canonical fields. Status is the operator's example. Expected shape is the usual structured block at `docs/product/backlog.md` `## US-0161` lines 6098-6133. Faulty shape is the prose backlog (`**Priority:**`, `**Release:**`, `**Acceptance criteria**`) shown by remote samples US-0001 through US-0004. Those rows are not imported. US-0161 is not edited. The remote masterplan is not edited. Cursor and Pi are not in-scope user outcomes. Discovery risk: a shared story writer might be the cause.
- **Acceptance**: AC-1 fields including Status; AC-2 OpenCode host; AC-3 usual structured block; AC-4 contract test, assertion list locked in discovery; AC-5 done is the usual fields without weakening the canonical block.
- **Next**: `/discovery` in a fresh context. This PO does not spawn it. STOP.

