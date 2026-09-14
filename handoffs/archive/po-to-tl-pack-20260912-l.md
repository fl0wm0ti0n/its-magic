# PO to TL archive pack (2026-09-12)

- Rollover trigger: `PO_TO_TL_HOT_MAX_LINES=650, PO_TO_TL_HOT_MAX_SECTIONS=60`
- Source: `handoffs/po_to_tl.md`
- Archived units (oldest first, contiguous prefix): 1
- Retained units in hot file: 16
- First archived heading: `## Intake handoff — BUG-0018 OpenCode markdown `/auto` wins over plugin execute`
- Last archived heading: `## Intake handoff — BUG-0018 OpenCode markdown `/auto` wins over plugin execute`
- Verification tuple (mandatory):
  - archived_body_lines=22
  - retained_body_lines=645

---

## Intake handoff — BUG-0018 OpenCode markdown `/auto` wins over plugin execute

- **Phase completed**: intake (`/intake bug`). **Role**: po. **Bug**: BUG-0018. **Sprint**: (pending). **Verdict**: PASS (`decision_gate=false`).
- **Timestamp**: 2026-09-11T22:25:00Z. **Fresh marker**: `po-BUG0018-intake-20260911T222500Z-fresh`.
- **Writer**: `writer_id=po-cursor-20260912-BUG0018-intake`, `intake_run_id=cursor-20260912-BUG0018-intake`.
- **Routing**: argv `/intake bug` wins over scratchpad `INTAKE_WORK_ITEM_KIND=story`. `selected_pack=small-intake-pack`. `INTAKE_GUIDED_MODE=1`. `WORK_KIND_ROUTING=0` (classifier skipped). `INTAKE_SUBAGENT_FALLBACK=deny`. Next id confirmed `python scripts/bug_issue_validate.py --print-next-id` → **BUG-0018** before write.
- **Evidence**:
  - `handoffs/intake_evidence/BUG-0018-intake-20260912.json` — `[INTAKE_EVIDENCE_VALIDATION_OK]`
  - `python scripts/bug_issue_validate.py --backlog docs/product/backlog.md --check-acceptance` — `[BUG_VALIDATION_OK]`
  - `python scripts/intake_bug_resume_brief_refresh.py --bug-id BUG-0018 --validate-file` — `[INTAKE_RESUME_BRIEF_VALIDATE_OK]`; `intended_resume_phase=discovery`; `resolved_start_phase=discovery`; `resolution_source=resume_brief`; `bug_id=BUG-0018`. In-place `--resume-brief handoffs/resume_brief.md` write skipped: upsert matches every `## Latest orchestration pointer*` heading and would clobber BUG-0017 historical pointers; canonical DEC-0069 block inserted at top via `build_latest_pointer_markdown`.
- **Research**: **R-0119** (`docs/engineering/research.md`) — intake-time web + Context7 on markdown vs `command.transform` / `editor.add`; compose **R-0114** deferred precedence now live-proven.
- **Operator ask**: `/intake bug` — auto mode fails on Windows and Linux (chat history). Two live symptoms; do not collapse if root causes differ.
- **Root cause (intake, Symptom A)**: OpenCode host runs dispatch-only `.opencode/commands/auto.md` STOP (US-0125/DEC-0125). Plugin BUG-0015 attach **is in source** (`runAutoLifecycle`, `command.transform`, `editor.add`) but **execute is never invoked**. No `OPENCODE_*` code. Live host contradicts architecture `# BUG-0015` CF1 (“transform owns execute”).
- **Duplicate check**: Distinct from BUG-0015 DONE (missing attach in source), BUG-0016 DONE (Layer-1 permissions), BUG-0017 DONE (CRLF — live `auto.md` is LF; commands **are** offered; `/auto` **can** be invoked).
- **Decomposition**: two symptoms, two root causes. **Persist only BUG-0018**. **Symptom B** (Windows Cursor Task unavailable / German `TASK_SPAWN_UNAVAILABLE`; canonical `NATIVE_CHAIN_UNAVAILABLE` US-0095/DEC-0080) is **out of scope / not a BUG** — operator-session limitation (BUG-0006 spawn-only when Task missing in that chat). Do not allocate BUG-0019.
- **Alternatives**: (1) persist only OpenCode markdown-wins — **recommended**; (2) two OPEN bugs like 0015/0016 — rejected; (3) reopen BUG-0015 — rejected; (4) fold into US-0125 — rejected.
- **Scope for `/discovery`**: lock `/auto` ownership so plugin `execute` runs (or documented `OPENCODE_*` fail-closed); confirm markdown vs plugin registry merge; do not reopen BUG-0015/0016/0017 ACs; do not persist Cursor Task-unavailable as a bug.
- **Risks**: R1 — OpenCode docs do not specify markdown-file vs plugin-execute same-name merge (R-0119 medium); R2 — `command.executed` may never fire for markdown-template commands (secondary attach dead); R3 — removing `auto.md` may drop slash discoverability unless plugin `editor.add` remains listed; R4 — architecture CF1 lock must be superseded, not silently ignored.
- **Isolation**: `phase_id=intake`; `role=po`; `bug_id=BUG-0018`; `fresh_context_marker=po-BUG0018-intake-20260911T222500Z-fresh`; `timestamp=2026-09-11T22:25:00Z`; `evidence_ref=docs/product/backlog.md ### BUG-0018, docs/product/acceptance.md BUG-0018 row, handoffs/intake_evidence/BUG-0018-intake-20260912.json, docs/engineering/research.md ## R-0119, this handoff`.
- **Hot-surface note**: Appended (not prepended) so triad oldest-prefix rollover retains this newest section (same policy as BUG-0017 intake). Post-append `--check` → `STATE_ARCHIVE_REQUIRED` `po_to_tl` 703/650 → `--rollover` `rollover_complete units=1` → `handoffs/archive/po-to-tl-pack-20260911-c.md`; final `--check` PASS.
- **Status**: OPEN per US-0045. **Next**: `/discovery` (fresh **po**) for **BUG-0018**, or `/auto bug-target=BUG-0018`. Do not run discovery/architecture/execute from this intake chat. STOP after intake.

