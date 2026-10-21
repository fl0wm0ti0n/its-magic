# PO to TL archive pack (2026-10-16)

- Rollover trigger: `PO_TO_TL_HOT_MAX_LINES=650, PO_TO_TL_HOT_MAX_SECTIONS=60`
- Source: `handoffs/po_to_tl.md`
- Archived units (oldest first, contiguous prefix): 1
- Retained units in hot file: 27
- First archived heading: `## Intake handoff — BUG-0036 repairable `/auto` blockers`
- Last archived heading: `## Intake handoff — BUG-0036 repairable `/auto` blockers`
- Verification tuple (mandatory):
  - archived_body_lines=10
  - retained_body_lines=650

---

## Intake handoff — BUG-0036 repairable `/auto` blockers

- **Phase completed**: intake. **Role**: po. **Bug**: BUG-0036 only. **Verdict**: persisted. **Timestamp (UTC)**: 2026-10-16T18:48:15Z. **writer_id**: `po-cursor-20261016-autoblock`. **intake_run_id**: `ir-20261016T184815Z-autoblock`. **Mode**: `INTAKE_GUIDED_MODE=0`, `INTAKE_WORK_ITEM_KIND=bug`, `WORK_KIND_ROUTING=0`, `EARLY_RESEARCH=0`, `ID_NAMESPACE_BOOTSTRAP=0`, `selected_pack=small-intake-pack`, `missing_topics` none, `assumptions_confirmed=(none)`, `decision_gate=false`. Evidence: `[INTAKE_EVIDENCE_VALIDATION_OK]`. Bug validator: `[BUG_VALIDATION_OK]`. Resume brief: `[INTAKE_BUG_RESUME_BRIEF_REFRESH_OK]` and `[INTAKE_RESUME_BRIEF_VALIDATE_OK]`. No `R-` entry. No story split. Status OPEN.
- **Scope**: This class of blocker must not hard-stop `/auto` when repair is possible, and the hardness must be configurable. Operator "1. mehrere" puts all named surfaces in scope: foreign harness failures during `/execute`, `execute_harness_blocked_out_of_scope`, and `RESUME_BRIEF_STALE` after an expired proof. Operator "4. jede" means every later blocker of this same class, not only the two stops from US-0162 / S0179. Outcome: blockers like these must not happen again.
- **Tests**: Operator "3. ich habe keine meinung dazu". AC-4 requires contract tests whose concrete shape is locked in discovery. Do not treat an example test as a user promise.
- **Constraints**: The operator replaced the suggested absolute hardness. Do not lock "the orchestrator must not refresh `resume_brief`" or "BUG-0029 and the scratchpad drain flags stay out of scope" as operator-required hardness. This intake did not edit BUG-0029, US-0162 acceptance ticks, the scratchpad, the template scratchpad, or the README. BUG-0005, BUG-0012, BUG-0013, BUG-0032, and BUG-0035 stay DONE and are related, not reopened.
- **Discovery risk**: `.env` reads, npm publish, and git push are existing US-0092 boundaries the operator did not mention. `decision_gate=false`. Do not narrow the operator quote.
- **Evidence**: `handoffs/intake_evidence/BUG-0036-intake-20261016T184815Z.json`.
- **Next**: `/discovery` in a fresh context. This PO child does not spawn it. STOP.

