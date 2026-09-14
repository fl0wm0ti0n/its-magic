# PO to TL archive pack (2026-09-12)

- Rollover trigger: `PO_TO_TL_HOT_MAX_LINES=650, PO_TO_TL_HOT_MAX_SECTIONS=60`
- Source: `handoffs/po_to_tl.md`
- Archived units (oldest first, contiguous prefix): 2
- Retained units in hot file: 15
- First archived heading: `## Architecture handoff — US-0132 Explicit Cursor/OpenCode model configuration contract`
- Last archived heading: `## Intake handoff — BUG-0017 OpenCode Linux slash commands (CRLF YAML frontmatter)`
- Verification tuple (mandatory):
  - archived_body_lines=55
  - retained_body_lines=631

---

## Architecture handoff — US-0132 Explicit Cursor/OpenCode model configuration contract

- **Phase completed**: architecture. **Role**: tech-lead. **Story**: US-0132 only. **Sprint**: S0134 (preview; sprint-plan owns folder). **Verdict**: PASS (`decision_gate=false`).
- **Timestamp (UTC)**: 2026-09-08T21:05:00Z. **Fresh marker**: `tl-US0132-architecture-20260908T210500Z-fresh`.
- **Orchestrator**: `orchestrator_run_id=auto-20260908-us0132`, `delivery_mode=ultra_lean`, macro=`plan` (architecture = second of research+architecture+sprint-plan).
- **Sibling boundary**: **US-0131 DONE** (DEC-0131) — OUT OF SCOPE; do not reopen as a second matrix.
- **Architecture anchor**: `docs/engineering/architecture.md` **`# US-0132`**
- **Companion DEC**: `decisions/DEC-0132.md` (**Accepted**)
- **Research anchor**: `docs/engineering/research.md` **`## R-0117`** (DQ1–DQ10 LOCKED)

### Approach A1 LOCKED

Four supported surfaces; reject generic `model.json` (`MODEL_CONFIG_PATH_UNKNOWN` at repo root / `.cursor/` / `.opencode/` only). Cursor vs OpenCode schemas stay separate. `opencode.json{,c}` is host file not kit SOT. Per-host `provenance=` diagnostics. `MODEL_CONFIG_HOST_COLLISION` distinct both-host row. Optional names-only host-JSON read (fail-open absent; malformed → `MODEL_CATALOG_INVALID` `scope=opencode-host`). Extend `model_tier_validate.py --scope model-config`. Exclude-from-clean locals including `.opencode/model-catalog.local.json`. 10 `test_us0132_*` markers. Sprint seeds T-anch + T-001..T-009 within SPRINT_MAX_TASKS=12.

### Runtime proof (DEC-0038)

- `runtime_proof_id=rp-auto-20260908-us0132-architecture-techlead-20260908T210500Z-US-0132`
- `proof_hash=8255C22FCC78F2CFF74AD41A08D9FFF875AE09C205A82BEC78C4B4D03CD13013`
- `proof_ttl=2026-09-08T22:05:00Z`
- Consumed research proof: `rp-auto-20260908-us0132-research-techlead-20260908T205500Z-US-0132` / `A67C61DF7B083A9AC9DC39326FACD9B4E897F43D6B47515EC301AF894E7B0FD5` — RUNTIME_PROOF_VALID

### Isolation + stop

- `phase_id=architecture`, `role=tech-lead`, `story_id=US-0132`, `model_id=cursor-grok-4.6`, `fresh_context_marker=tl-US0132-architecture-20260908T210500Z-fresh`
- **Status**: US-0132 remains **OPEN**. **Next**: `/sprint-plan` in fresh **tech-lead** subagent (orchestrator may insert sovereign-critic of architecture first). Do not spawn sprint-plan from this architecture chat. STOP.

---

## Intake handoff — BUG-0017 OpenCode Linux slash commands (CRLF YAML frontmatter)

- **Phase completed**: intake (/intake bug). **Role**: po. **Bug**: BUG-0017. **Sprint**: (pending). **Verdict**: PASS (decision_gate=false).
- **Timestamp**: 2026-09-11T18:51:00Z. **Fresh marker**: po-BUG0017-intake-20260911T185100Z-fresh.
- **Writer**: writer_id=po-cursor-20260911-BUG0017-intake, intake_run_id=cursor-20260911-BUG0017-intake.
- **Routing**: argv /intake bug wins over scratchpad INTAKE_WORK_ITEM_KIND=story. selected_pack=small-intake-pack. INTAKE_GUIDED_MODE=1. WORK_KIND_ROUTING=0 (classifier skipped). INTAKE_SUBAGENT_FALLBACK=deny.
- **Evidence**:
  - handoffs/intake_evidence/BUG-0017-intake-20260911.json — [INTAKE_EVIDENCE_VALIDATION_OK]
  - python scripts/bug_issue_validate.py --backlog docs/product/backlog.md --check-acceptance — [BUG_VALIDATION_OK]
  - python scripts/intake_bug_resume_brief_refresh.py ... --bug-id BUG-0017 — [INTAKE_BUG_RESUME_BRIEF_REFRESH_OK] / [INTAKE_RESUME_BRIEF_VALIDATE_OK]; intended_resume_phase=discovery
- **Operator ask**: Persist OPEN defect — OpenCode on Linux does not offer/recognize its-magic slash commands (/auto, /intake, …) though .opencode/commands/ files exist; proven CRLF (ile + od -c on 
oot@docker-dmz / strategy_trading_bot).
- **Root cause (intake)**: CRLF in OpenCode command markdown breaks YAML frontmatter parse (parseOption empty → skip). Same failure class as BUG-0008; .gitattributes LF only for *.sh / *.manifest, not .opencode/**/*.md.
- **Duplicate check**: Distinct from BUG-0015 DONE (plugin dispatch), BUG-0016 DONE (Layer-1 permissions), BUG-0008 DONE (installer manifest CRLF — different surface).
- **Decomposition**: single_bug — LF-normalize / gitattributes / publish-guard for OpenCode pack markdown (and related agents/plugin if same path).
- **Alternatives**: (1) .gitattributes + parity/publish guards — recommended; (2) host-side CR-strip — reject (cannot patch OpenCode); (3) operator dos2unix only — reject (not ship-fix).
- **Scope for /discovery**: confirm affected globs (commands vs agents vs plugins/TS); lock LF policy + regression tests; do not reopen BUG-0015/0016 ACs.
- **Risks**: R1 — Windows editors reintroduce CRLF without attributes/guards; R2 — npm tarball / install path still ships CRLF if only working tree fixed; R3 — over-broad *.md eol=lf may surprise unrelated docs (prefer .opencode/** scoped attributes); R4 — silent skip makes false "missing commands" diagnoses.
- **Isolation**: phase_id=intake; 
ole=po; ug_id=BUG-0017; resh_context_marker=po-BUG0017-intake-20260911T185100Z-fresh; 	imestamp=2026-09-11T18:51:00Z; evidence_ref=docs/product/backlog.md ### BUG-0017, docs/product/acceptance.md BUG-0017 row, handoffs/intake_evidence/BUG-0017-intake-20260911.json, this handoff.
- **Hot-surface note**: Appended (not prepended) so triad oldest-prefix rollover retains this newest section. Prior prepend copy archived in handoffs/archive/po-to-tl-pack-20260911.md.
- **Status**: OPEN per US-0045. **Next**: /discovery (fresh **po**) for **BUG-0017**, or /auto bug-target=BUG-0017. Do not run discovery/architecture/execute from this intake chat. STOP after intake.

---

