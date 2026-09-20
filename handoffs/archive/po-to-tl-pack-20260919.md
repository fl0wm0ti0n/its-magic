# PO to TL archive pack (2026-09-19)

- Rollover trigger: `PO_TO_TL_HOT_MAX_LINES=650, PO_TO_TL_HOT_MAX_SECTIONS=60`
- Source: `handoffs/po_to_tl.md`
- Archived units (oldest first, contiguous prefix): 1
- Retained units in hot file: 16
- First archived heading: `## Intake handoff — BUG-0026 Published-kit KERNEL_CONTRACT_MISMATCH (omit standalone/) Win+Linux`
- Last archived heading: `## Intake handoff — BUG-0026 Published-kit KERNEL_CONTRACT_MISMATCH (omit standalone/) Win+Linux`
- Verification tuple (mandatory):
  - archived_body_lines=14
  - retained_body_lines=639

---

## Intake handoff — BUG-0026 Published-kit KERNEL_CONTRACT_MISMATCH (omit standalone/) Win+Linux

- **Phase completed**: intake. **Role**: po. **Bug**: BUG-0026. **Verdict**: PASS (`decision_gate=false`).
- **Timestamp (UTC)**: 2026-09-19T10:02:04Z. **writer_id**: `po-f4770d9e1870`. **intake_run_id**: `ir-20260919T100204Z-9c322a`.
- **Mode**: `INTAKE_GUIDED_MODE=0` (low-touch), `INTAKE_WORK_ITEM_KIND=bug` (explicit argv `/intake bug` **wins** over scratchpad story — DEC-0061 / US-0079), `WORK_KIND_ROUTING=0`, `EARLY_RESEARCH=0`, `FRAMEWORK_KIT_REPO=1`.
- **Pack**: `small-intake-pack`. Evidence: `handoffs/intake_evidence/BUG-0026-intake-20260919T100204Z.json` — validated **PASS** before backlog/acceptance mutation.
- **Duplicate/overlap**: **NEW BUG-0026**. Distinct from **BUG-0025 DONE** (packaging lib + fail-closed loader — do **not** reopen ACs). Distinct from **US-0149 OPEN** (global PATH + user-chosen location — compose/link; US-0149 AC-1/Boundaries updated to compose this bug). Distinct from **BUG-0022** / **BUG-0024 OPEN** — do **not** merge/drain. No OPEN KERNEL_* bugs.
- **Symptom**: global `its-magic@0.1.4` `its-magic --target . --mode upgrade --host both` on **Windows and Linux** → `HOST_CONFIG_POSTINSTALL_OK` then `KERNEL_CONTRACT_MISMATCH` / `STANDALONE_BOOTSTRAP_FAILED`; `.its-magic/bin/itsm` never materializes. Residual: published kit omits package-root `standalone/` → `load_supported_range` → `None` (DEC-0120 / US-0133 / S0157 T-004).
- **AC summary**: AC-1 pack includes `standalone/` (or equivalent range source); AC-2 upgrade materializes `itsm` without false KERNEL_CONTRACT_MISMATCH; AC-3 Win+Linux parity; AC-4 npm pack contract; AC-5 no BUG-0025 reopen; AC-6 distinct from US-0149; AC-7 distinct from BUG-0022/0024; AC-8 honest fail-closed for true mismatches.
- **Resume brief**: `intake_bug_resume_brief_refresh.py` → `[INTAKE_BUG_RESUME_BRIEF_REFRESH_OK]`; `--validate-file` → `[INTAKE_RESUME_BRIEF_VALIDATE_OK]` (`intended_resume_phase`/`resolved_start_phase`=`discovery`, `resolution_source=resume_brief`, `bug_id=BUG-0026`).
- **Bug validate**: `bug_issue_validate.py --check-acceptance` → `[BUG_VALIDATION_OK]`.
- **Next**: `/discovery` in a **fresh PO** subagent/chat. **STOP** — intake does not run discovery.


