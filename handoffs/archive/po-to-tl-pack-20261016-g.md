# PO to TL archive pack (2026-10-16)

- Rollover trigger: `PO_TO_TL_HOT_MAX_LINES=650, PO_TO_TL_HOT_MAX_SECTIONS=60`
- Source: `handoffs/po_to_tl.md`
- Archived units (oldest first, contiguous prefix): 1
- Retained units in hot file: 26
- First archived heading: `## Intake handoff — US-0157 OpenCode `/auto` critic hook and continuation-pair repair`
- Last archived heading: `## Intake handoff — US-0157 OpenCode `/auto` critic hook and continuation-pair repair`
- Verification tuple (mandatory):
  - archived_body_lines=14
  - retained_body_lines=643

---

## Intake handoff — US-0157 OpenCode `/auto` critic hook and continuation-pair repair

- **Phase completed**: intake. **Role**: po. **Story**: US-0157 only. **Verdict**: persisted. **Timestamp (UTC)**: 2026-10-15T17:02:45Z. **writer_id**: `po-cursor-20261015-us0157`. **intake_run_id**: `ir-20261015T170245Z-us0157`.
- **Mode**: `INTAKE_GUIDED_MODE=0`, `INTAKE_WORK_ITEM_KIND=story`, `WORK_KIND_ROUTING=0`, `ID_NAMESPACE_BOOTSTRAP=0`, `EARLY_RESEARCH=0`, `FRAMEWORK_KIT_REPO=1`. `selected_pack=small-intake-pack`. Single story. Low-touch. No `R-` entry. No BUG allocated. Highest existing story before write: US-0156.
- **Evidence**: `handoffs/intake_evidence/US-0157-intake-20261015T170245Z.json`. Gate before product writes: `[INTAKE_EVIDENCE_VALIDATION_OK]`. Blocked sidecar `handoffs/intake_evidence/intake-blocked-20261015T164800Z.json` was not reused as the PASS bundle.
- **Pack evidence**: `asked_topics` = outcome_success_criteria, impacted_components, constraints_compatibility_risks, required_tests_acceptance_checks, done_definition. `missing_topics` = none. `assumptions_confirmed` = confirmed. Operator confirmation quoted once: `mach wies am besten ist` (`ie:ir-20261015T170245Z-us0157:3:eeb40af78672f940`). Three prior `answer_ref` rows stay unchanged and topic-distinct. The two remaining topics use `satisfied_by=assumption_confirmation_ref` with distinct assumption texts.
- **Locked assumptions**: A fresh phase child may repair only its own invalid continuation pair. The `/auto` orchestrator still must not write or repair `docs/engineering/state.md` or `handoffs/resume_brief.md` (DEC-0153 / BUG-0035). `RESUME_BRIEF_AUTO_REFRESH=0` stays absolute. Hard security denies (`.env`, secrets, credential theft) stay hard stops. Do not loosen every OpenCode edit glob. The critic dead-end is fixed by spawning `tech-lead` for `/sovereign-critic`, not by adding a critic Task role and not by skipping the critic when `CROSS_MODEL_REVIEW=1`. Tests: one contract proves that spawn and that `PHASE_ROLE_CAPABILITY_MISSING` is not emitted for a missing critic role; a second proves the phase child can repair its own invalid pair and continue; a third proves the orchestrator still cannot write that pair.
- **Split**: single story. Why not split: one operator outcome. Overlap: US-0104 DONE, US-0119 DONE, and US-0156 DONE do not cover this critic-role dead-end plus phase-child continuation repair. Do not reopen or edit BUG-0016, BUG-0026, BUG-0027, BUG-0029, or BUG-0035. Do not flip status. Do not tick existing ACs.
- **Acceptance**: AC-1 critic spawn without `PHASE_ROLE_CAPABILITY_MISSING`; AC-2 phase child repairs only its own invalid continuation pair and the flow continues; AC-3 orchestrator still does not write or repair `state.md` or `resume_brief.md`; AC-4 hard security denies stay hard stops; AC-5 contract tests cover AC-1, AC-2, and AC-3. Status OPEN. `user_visible: true`.
- **Boundaries**: not a repeal of DEC-0153; not a new critic agent; not a widening of every OpenCode edit glob; not BUG-0026 or BUG-0029. Story intake does not refresh `handoffs/resume_brief.md`.
- **Bug routing**: `[INTAKE_BUG_ROUTING_OK] kind=story exit=0` for both the defect prose and the policy prose. No BUG id allocated.
- **Triad**: manual tail archive of the oldest US-0156 discovery section to `handoffs/archive/po-to-tl-pack-20261015.md` (`boundary=triad-manual|po_to_tl`, `moved=1`). `--rollover` not run.
- **Next**: `/discovery` in a fresh subagent. This PO child does not spawn it. STOP.

