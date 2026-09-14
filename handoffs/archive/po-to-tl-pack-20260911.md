# PO to TL archive pack (2026-09-11)

- Rollover trigger: `PO_TO_TL_HOT_MAX_LINES=650, PO_TO_TL_HOT_MAX_SECTIONS=60`
- Source: `handoffs/po_to_tl.md`
- Archived units (oldest first, contiguous prefix): 1
- Retained units in hot file: 12
- First archived heading: `## Intake handoff — BUG-0017 OpenCode Linux slash commands (CRLF YAML frontmatter)`
- Last archived heading: `## Intake handoff — BUG-0017 OpenCode Linux slash commands (CRLF YAML frontmatter)`
- Verification tuple (mandatory):
  - archived_body_lines=22
  - retained_body_lines=645

---

## Intake handoff — BUG-0017 OpenCode Linux slash commands (CRLF YAML frontmatter)

- **Phase completed**: intake (`/intake bug`). **Role**: po. **Bug**: BUG-0017. **Sprint**: (pending). **Verdict**: PASS (`decision_gate=false`).
- **Timestamp**: 2026-09-11T18:51:00Z. **Fresh marker**: `po-BUG0017-intake-20260911T185100Z-fresh`.
- **Writer**: `writer_id=po-cursor-20260911-BUG0017-intake`, `intake_run_id=cursor-20260911-BUG0017-intake`.
- **Routing**: argv `/intake bug` wins over scratchpad `INTAKE_WORK_ITEM_KIND=story`. `selected_pack=small-intake-pack`. `INTAKE_GUIDED_MODE=1`. `WORK_KIND_ROUTING=0` (classifier skipped). `INTAKE_SUBAGENT_FALLBACK=deny`.
- **Evidence**:
  - `handoffs/intake_evidence/BUG-0017-intake-20260911.json` — `[INTAKE_EVIDENCE_VALIDATION_OK]`
  - `python scripts/bug_issue_validate.py --backlog docs/product/backlog.md --check-acceptance` — run after this handoff
  - `python scripts/intake_bug_resume_brief_refresh.py ... --bug-id BUG-0017` — DEC-0069 intended_resume_phase=`discovery`
- **Operator ask**: Persist OPEN defect — OpenCode on Linux does not offer/recognize its-magic slash commands (`/auto`, `/intake`, …) though `.opencode/commands/` files exist; proven CRLF (`file` + `od -c` on `root@docker-dmz` / `strategy_trading_bot`).
- **Root cause (intake)**: CRLF in OpenCode command markdown breaks YAML frontmatter parse (parseOption empty → skip). Same failure class as BUG-0008; `.gitattributes` LF only for `*.sh` / `*.manifest`, not `.opencode/**/*.md`.
- **Duplicate check**: Distinct from BUG-0015 DONE (plugin dispatch), BUG-0016 DONE (Layer-1 permissions), BUG-0008 DONE (installer manifest CRLF — different surface).
- **Decomposition**: single_bug — LF-normalize / gitattributes / publish-guard for OpenCode pack markdown (and related agents/plugin if same path).
- **Alternatives**: (1) `.gitattributes` + parity/publish guards — recommended; (2) host-side CR-strip — reject (cannot patch OpenCode); (3) operator `dos2unix` only — reject (not ship-fix).
- **Scope for `/discovery`**: confirm affected globs (commands vs agents vs plugins/TS); lock LF policy + regression tests; do not reopen BUG-0015/0016 ACs.
- **Risks**: R1 — Windows editors reintroduce CRLF without attributes/guards; R2 — npm tarball / install path still ships CRLF if only working tree fixed; R3 — over-broad `*.md` eol=lf may surprise unrelated docs (prefer `.opencode/**` scoped attributes); R4 — silent skip makes false “missing commands” diagnoses.
- **Isolation**: `phase_id=intake`; `role=po`; `bug_id=BUG-0017`; `fresh_context_marker=po-BUG0017-intake-20260911T185100Z-fresh`; `timestamp=2026-09-11T18:51:00Z`; `evidence_ref=docs/product/backlog.md ### BUG-0017, docs/product/acceptance.md BUG-0017 row, handoffs/intake_evidence/BUG-0017-intake-20260911.json, this handoff`.
- **Status**: OPEN per US-0045. **Next**: `/discovery` (fresh **po**) for **BUG-0017**, or `/auto bug-target=BUG-0017`. Do not run discovery/architecture/execute from this intake chat. STOP after intake.

---

