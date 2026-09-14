# PO to TL archive pack (2026-09-12)

- Rollover trigger: `PO_TO_TL_HOT_MAX_LINES=650, PO_TO_TL_HOT_MAX_SECTIONS=60`
- Source: `handoffs/po_to_tl.md`
- Archived units (oldest first, contiguous prefix): 2
- Retained units in hot file: 15
- First archived heading: `## US-0118 Ã¢Â€Â” Work-kind classification + tiered delivery routing per story (PO -> TL)`
- Last archived heading: `## Intake handoff — BUG-0015 and BUG-0016 OpenCode /auto dispatch + Layer-1 permission matrix`
- Verification tuple (mandatory):
  - archived_body_lines=73
  - retained_body_lines=618

---

## US-0118 Ã¢Â€Â” Work-kind classification + tiered delivery routing per story (PO -> TL)

- **Story**: `docs/product/backlog.md` `## US-0118 ? Work-kind classification + tiered delivery routing per story`
- **Acceptance**: `docs/product/acceptance.md` US-0118 (12 ACs, OPEN)
- **Intake evidence**: `handoffs/intake_evidence/US-0118-intake.json` (first-intake-pack, validator `[INTAKE_EVIDENCE_VALIDATION_OK]`, all 8 topics covered, coverage_complete=true, plan_area_id=`work-kind-classifier`)
- **Status**: OPEN per US-0045. **Next**: `/discovery` (fresh PO) for US-0118.
- **Operator pain (verbatim)**: "wir mÃƒÂ¼ssen beim erstellen von userstories bzw abarbeiten erkennen ob es coding betrifft oder doku / text schreiben oder mini implementierungen welche keine komplette phasen durchlÃƒÂ¤ufe benÃƒÂ¶tigen. wie zb Architecture, qa, etc... aktuell laufen wir zb den ganzen overhead durch nur um ein readme zu aktualisieren."

### Scope summary
Per-story **work-kind classifier** `scripts/work_kind_classify_lib.py` returns `work_kind Ã¢ÂˆÂˆ {doc, mini, code}` + `recommended_delivery_mode` + `recommended_phase_plan`. New default-off `WORK_KIND_ROUTING=0|1` scratchpad flag (zero overhead when off). Backlog rows gain optional `work_kind` + `recommended_delivery_mode` set at intake (operator accept/override). `/auto` `resolve_delivery_mode` step 0 consumes them when `DELIVERY_MODE`/`AUTO_PHASE_*` are unset. `doc` -> `[intake, execute, release]`; `mini` -> `ultra_lean`/`mega_quick`; `code` -> `standard`.

### Reuse anchor
`scripts/dev_environment_lib.py:classify_touched_files()` already classifies touched files into tier A/B/C with `TIER_C_SKIP_PREFIXES` (`docs/`, `handoffs/`, `sprints/`, `decisions/`, `tests/`, `.cursor/commands/`, `template/docs/`). This is the natural seed for `doc` work-kind detection Ã¢Â€Â” extend, do not reinvent.

### Compose, do not amend
- **US-0096 / DEC-0082** (delivery modes): US-0118 makes routing per-story + derived; explicit `DELIVERY_MODE` still wins.
- **US-0070 / DEC-0052** (phase selection): `AUTO_PHASE_*` keys remain the explicit override; classifier only fills the unset case.
- **US-0078 / DEC-0060** (intake evidence): classifier proposal + operator decision recorded in the evidence bundle; gate still runs before any write.
- **US-0051** (decomposition): classifier runs after the decomposition evaluator.
- **US-0069 / DEC-0051** (phase->role matrix): unchanged; classifier only selects which phases run, not who runs them.
- **US-0103** (AI decision ledger): read-only consumer for audit trail.

### Risks to carry to /discovery and /architecture
- **R1**: Classification ambiguity (a story that touches both `docs/` and `src/`) -> deterministic tie-break rule needed (highest tier wins? `code` wins?).
- **R2**: Precedence conflicts when both `WORK_KIND_ROUTING=1` and `DELIVERY_MODE` are set -> documented precedence chain + `WORK_KIND_DELIVERY_MODE_CONFLICT` reason code.
- **R3**: `mega_quick` eligibility overlap with `mini` -> classifier should recommend `mega_quick` only when US-0096 eligibility passes, else fall back to `ultra_lean`.
- **R4**: Backward compatibility Ã¢Â€Â” existing backlog rows without `work_kind` must continue to route via current `DELIVERY_MODE`/`AUTO_PHASE_*` (no forced reclassification).
- **R5**: Operator trust Ã¢Â€Â” classifier must be deterministic and inspectable (`--explain` flag emitting rule trace) so operators can override with confidence.

### Fail-closed reason codes (proposed)
`WORK_KIND_CLASSIFY_FAILED`, `WORK_KIND_DELIVERY_MODE_CONFLICT`, `WORK_KIND_ROUTING_DISABLED` (info), `WORK_KIND_PLAN_COVERAGE_MISSING`.

### Handoff
- TL: take this handoff into `/discovery` (fresh PO) then `/architecture`. Lock the classifier contract, precedence chain, and the `dev_environment_lib` reuse boundary before `/sprint-plan`.
- Research stub: `R-0106` in `docs/engineering/research.md`.

## Intake handoff — BUG-0015 and BUG-0016 OpenCode /auto dispatch + Layer-1 permission matrix

- **Phase completed**: intake (`/intake bug`). **Role**: po. **Bugs**: BUG-0015 (primary), BUG-0016 (also OPEN). **Sprint**: (pending). **Verdict**: PASS (`decision_gate=false`).
- **Timestamp**: 2026-09-06T13:35:00Z. **Fresh marker**: `po-BUG0015-BUG0016-intake-20260906T133500Z-fresh`.
- **Writer**: `writer_id=po-cursor-20260906-opencode-bugs`, `intake_run_id=cursor-20260906-BUG0015-0016-intake`.
- **Routing**: argv `/intake bug` wins over scratchpad `INTAKE_WORK_ITEM_KIND=story`. `selected_pack=small-intake-pack`. `INTAKE_GUIDED_MODE=1`.
- **Evidence**:
  - `handoffs/intake_evidence/BUG-0015-intake-20260906.json` — `[INTAKE_EVIDENCE_VALIDATION_OK]`
  - `handoffs/intake_evidence/BUG-0016-intake-20260906.json` — `[INTAKE_EVIDENCE_VALIDATION_OK]`
  - `python scripts/bug_issue_validate.py --backlog docs/product/backlog.md --check-acceptance` — `[BUG_VALIDATION_OK]`
  - `python scripts/intake_bug_resume_brief_refresh.py ... --bug-id BUG-0015` — `[INTAKE_BUG_RESUME_BRIEF_REFRESH_OK]` (primary continuation; BUG-0016 also OPEN)
- **Operator ask**: Persist two OPEN defects — (1) OpenCode `/auto` never starts orchestrator plugin dispatch (STOP); (2) OpenCode Layer-1 role permissions block legitimate lifecycle duties (audit all roles).
- **Decomposition (recommended)**: two independently valuable bugs — dispatch wiring vs permission matrix/duty mismatch. Do not fold into US-0131/US-0132.
- **Alternatives considered**:
  1. **Two OPEN bugs** (recommended) — separate dispatch vs permissions; independently testable.
  2. **Fold into US-0131** — rejected (wrong scope: config/model parity, not runtime dispatch/permissions).
  3. **Amend DEC-0122 only without bugs** — rejected (no OPEN work item / no acceptance row).
- **BUG-0015 (primary fix target)**: `.opencode/commands/auto.md` is STOP-only; `.opencode/plugins/orchestrator.ts` exports `spawnPhase` from `setup()` return API and hooks `execute.before` write-guard only — no command/event hook invokes spawn loop on `/auto`. Compose US-0124/US-0125 ships surfaces but runtime linkage gap remains.
- **BUG-0016 (permission audit — all roles)**:

| Role | Issue |
|------|--------|
| `po` | `bash: deny` blocks mandatory validators / resume-brief refresh; edit misses `handoffs/intake_evidence/**` and bug-intake `handoffs/resume_brief.md` (DEC-0069). |
| `tech-lead` | `bash: deny` blocks research/architecture validators; literal `sprints/Sxxxx/` likely fails real ids. |
| `dev` | `bash: ask` OK-ish; same `Sxxxx` glob risk; confirm owned paths vs execute ownership. |
| `qa` | `bash: ask` OK-ish; literal `Sxxxx` glob risk. |
| `release` | `bash: ask` OK-ish; may miss `sprints/*/release-findings.md` (scope carefully). |
| `curator` | `bash: deny` blocks `enforce-triad-hot-surface.py` / materialize scripts for `/refresh-context`. |
| `security` | `edit: deny` + `bash: ask` matches DEC-0122 v1 — in-contract unless contradiction found. |
| `auto` | spawn-only OK for Task path; OpenCode still broken by BUG-0015. |

- **Duplicate check**: Distinct from BUG-0006, BUG-0012, US-0122 DONE, US-0131/US-0132 OPEN (do not expand those stories).
- **Risks**: R1 — OpenCode host plugin API may lack a clean `/auto` hook (fail closed with `OPENCODE_*`); R2 — widening bash/edit for non-dev roles must preserve success test (c) production/code deny; R3 — DEC-0122 amendment + `test_us0122_*` / template parity churn; R4 — fixing permissions without BUG-0015 still leaves `/auto` dead.
- **Isolation**: `phase_id=intake`; `role=po`; `fresh_context_marker=po-BUG0015-BUG0016-intake-20260906T133500Z-fresh`; `timestamp=2026-09-06T13:35:00Z`; `evidence_ref=docs/product/backlog.md ## Bug issues BUG-0015 + BUG-0016, docs/product/acceptance.md bug rows, handoffs/resume_brief.md, this handoff`.
- **Hot-surface note**: Full narrative also in `handoffs/archive/po-to-tl-pack-20260906.md`. Appended (not prepended) so triad oldest-prefix rollover retains the newest section under `PO_TO_TL_HOT_MAX_LINES`.
- **Status**: both OPEN per US-0045. **Next**: `/discovery` (fresh **po**) for **BUG-0015**, or `/auto bug-target=BUG-0015`. Do not run architecture/execute from this intake chat. STOP after intake.

