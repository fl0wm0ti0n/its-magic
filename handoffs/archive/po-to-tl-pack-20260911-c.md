# PO to TL archive pack (2026-09-11)

- Rollover trigger: `PO_TO_TL_HOT_MAX_LINES=650, PO_TO_TL_HOT_MAX_SECTIONS=60`
- Source: `handoffs/po_to_tl.md`
- Archived units (oldest first, contiguous prefix): 1
- Retained units in hot file: 15
- First archived heading: `## US-0118 Ã¢Â€Â” Work-kind classification (PO -> TL, discovery handoff)`
- Last archived heading: `## US-0118 Ã¢Â€Â” Work-kind classification (PO -> TL, discovery handoff)`
- Verification tuple (mandatory):
  - archived_body_lines=101
  - retained_body_lines=602

---

## US-0118 Ã¢Â€Â” Work-kind classification (PO -> TL, discovery handoff)

- **Story**: `docs/product/backlog.md` `## US-0118 ? Work-kind classification + tiered delivery routing per story` (L3983)
- **Acceptance**: `docs/product/acceptance.md` US-0118 row L145 (12 ACs, OPEN)
- **Intake evidence**: `handoffs/intake_evidence/US-0118-intake.json` (first-intake-pack, validator `[INTAKE_EVIDENCE_VALIDATION_OK]`, all 8 topics covered, coverage_complete=true, plan_area_id=`work-kind-classifier`) Ã¢Â€Â” intake complete, read-only for discovery
- **Phase**: discovery (spec macro Ã¢Â€Â” second canonical phase within ultra_lean; intake + discovery merged per US-0096 / DEC-0082; intake already complete)
- **Verdict**: PASS (no DECISION_GATE; discovery locks L1..L10 captured; open questions Q1..Q10 delegated to `/research`)
- `orchestrator_run_id=auto-20260704-01`, `delivery_mode=ultra_lean`, `macro_phase=spec`
- `fresh_context_marker=po-US0118-discovery-20260704T194500Z-fresh`, `timestamp (UTC)=2026-07-04T19:45:00Z`
- **Status**: OPEN per US-0045. **Next**: `/research` (fresh tech-lead subagent Ã¢Â€Â” first canonical phase of `plan` macro per ultra_lean; `AUTO_ROLE_RESEARCH` empty Ã¢Â†Â’ default tech-lead).

### Summary

Per-story **work-kind classifier** `scripts/work_kind_classify_lib.py` returns `work_kind Ã¢ÂˆÂˆ {doc, mini, code}` + `recommended_delivery_mode` + `recommended_phase_plan`. New default-off `WORK_KIND_ROUTING=0|1` scratchpad flag (zero overhead when off). Backlog rows gain optional `work_kind` + `recommended_delivery_mode` set at intake (operator accept/override). `/auto` `resolve_delivery_mode` step 0 consumes them when `DELIVERY_MODE`/`AUTO_PHASE_*` are unset. `doc` Ã¢Â†Â’ `[intake, execute, release]`; `mini` Ã¢Â†Â’ `ultra_lean`/`mega_quick` per US-0096 eligibility; `code` Ã¢Â†Â’ `standard` (full lifecycle). Reuses `scripts/dev_environment_lib.py:classify_touched_files()` tier A/B/C + `TIER_C_SKIP_PREFIXES` precedent Ã¢Â€Â” extend, do not reinvent.

### Reuse anchor

`scripts/dev_environment_lib.py:classify_touched_files()` (L321) already classifies touched files into tier A/B/C with `TIER_C_SKIP_PREFIXES` (L117: `docs/`, `handoffs/`, `sprints/`, `decisions/`, `tests/`, `.cursor/commands/`, `template/docs/`). This is the natural seed for `doc` work-kind detection Ã¢Â€Â” extend/import, do not reinvent. Lock the import contract in `/architecture` (Q9).

### Discovery locks L1..L10 (verbatim from `docs/engineering/state.md` discovery checkpoint)

- **L1** (work_kind enumeration + recommended_delivery_mode field) Ã¢Â€Â” `work_kind Ã¢ÂˆÂˆ {"doc","mini","code"}` returned by `scripts/work_kind_classify_lib.py:classify_work_kind(...)`; each result also carries `recommended_delivery_mode Ã¢ÂˆÂˆ {"standard","ultra_lean","mega_quick"}`. Pure stdlib, no network, no `.env` reads.
- **L2** (WORK_KIND_ROUTING scratchpad flag default-off) Ã¢Â€Â” new `WORK_KIND_ROUTING=0|1` (default `0`). When `0`, zero overhead: `/auto` `resolve_delivery_mode` and intake persistence skip classifier entirely. Documented in `.cursor/scratchpad.md` + `template/.cursor/scratchpad.local.example.md` with merge-precedence note.
- **L3** (classifier inputs) Ã¢Â€Â” `classify_work_kind(story_prose, acceptance_criteria, touched_file_hints, component_scope)`; inputs are prose + AC set + touched-file hints (names-only, no content reads) + component_scope string.
- **L4** (classifier outputs) Ã¢Â€Â” returns `WorkKindResult{work_kind, recommended_delivery_mode, recommended_phase_plan, rationale, evidence_refs}`. `recommended_phase_plan` is a list of canonical phase ids. `rationale` is a human-readable rule trace; `evidence_refs` are names-only file references.
- **L5** (`doc` route) Ã¢Â€Â” all touched files match `dev_environment_lib.TIER_C_SKIP_PREFIXES` or `*.md`/`README*` under skip prefixes Ã¢Â†Â’ `recommended_phase_plan=[intake, execute, release]` (skip discovery/research/architecture/sprint-plan/plan-verify/qa/verify-work).
- **L6** (`mini` route) Ã¢Â€Â” single component, ACs Ã¢Â‰Â¤ 3, no companion DEC required Ã¢Â†Â’ `ultra_lean` or `mega_quick` (reuse US-0096 `mega_quick` eligibility: AC Ã¢Â‰Â¤ 3, no DEC, single component Ã¢Â€Â” when eligible recommend `mega_quick`, else fall back to `ultra_lean`).
- **L7** (`code` route) Ã¢Â€Â” otherwise Ã¢Â†Â’ `standard` (or honor current `DELIVERY_MODE` if explicitly set). Full canonical lifecycle retained.
- **L8** (precedence chain) Ã¢Â€Â” explicit `DELIVERY_MODE` (US-0096) > explicit `AUTO_PHASE_*` (US-0070) > `WORK_KIND_ROUTING`-derived `recommended_delivery_mode` (US-0118, only when `WORK_KIND_ROUTING=1` AND backlog row carries `work_kind` AND higher-precedence keys unset) > current default lifecycle. `start-from` always wins. Documented in `.cursor/commands/auto.md`.
- **L9** (reason-code family prefix) Ã¢Â€Â” `WORK_KIND_*` family: `WORK_KIND_CLASSIFY_FAILED`, `WORK_KIND_DELIVERY_MODE_CONFLICT`, `WORK_KIND_ROUTING_DISABLED` (info), `WORK_KIND_PLAN_COVERAGE_MISSING`. Each emits remediation guidance in `sprints/Sxxxx/qa-findings.md` / `release-findings.md`.
- **L10** (intake-time accept/override gate) Ã¢Â€Â” `/intake` step 5 (after ACs drafted, after US-0051 decomposition evaluator, before persistence): when `WORK_KIND_ROUTING=1`, run classifier, propose `work_kind` + `recommended_delivery_mode`, present to operator for accept/override. Persist choice in backlog row + intake evidence bundle (`work_kind`, `recommended_delivery_mode`, `work_kind_operator_decision Ã¢ÂˆÂˆ {accept, override}`) per US-0078 / DEC-0060. Evidence gate still runs before any backlog/acceptance write.

### Open questions Q1..Q10 for `/research`

- **Q1** (tie-break rule): when a story touches both `docs/` and `src/` (mixed tier), which work-kind wins? Candidate: highest tier wins (`code` > `mini` > `doc` per `classify_touched_files` tier_rank A>B>C precedent). Confirm deterministic rule.
- **Q2** (exact reason-code names + remediation prose): finalize the four `WORK_KIND_*` reason codes (AC-7) and their remediation guidance text emitted in `qa-findings.md` / `release-findings.md`.
- **Q3** (classifier determinism): confirm classifier is deterministic pure-stdlib (rule-based) Ã¢Â€Â” NO LLM-assisted classification. Lock the rule trace format (`--explain` flag emitting rule trace per R5).
- **Q4** (contract test surface): enumerate `test_us0118_*` markers needed in `tests/work_kind_classify_test.py` Ã¢Â€Â” each work-kind classification, each recommended phase plan, default-off zero-overhead, precedence vs `DELIVERY_MODE`/`AUTO_PHASE_*`, operator override path, each fail-closed reason code.
- **Q5** (scratchpad reference extension): what new keys are added to which README sub-block? `WORK_KIND_ROUTING` likely lands under a new `### Work-kind routing keys` sub-block (sibling to US-0113..US-0117 sub-blocks) OR under `### Delivery & lifecycle keys` (US-0116). Recommend new sub-block to keep cross-story byte-stability surface clean.
- **Q6** (template parity scope): what `WORK_KIND_*` pairs need byte-identical sync? `scripts/work_kind_classify_lib.py` Ã¢Â†Â” `template/scripts/work_kind_classify_lib.py`; `.cursor/scratchpad.md` `WORK_KIND_ROUTING` row Ã¢Â†Â” `template/.cursor/scratchpad.local.example.md`; `check_intake_template_parity.py --scope=work-kind-routing` with `WORK_KIND_ROUTING_PAIRS` manifest.
- **Q7** (runbook cross-link anchor): `docs/engineering/runbook.md` h-level + line number target for `WORK_KIND_ROUTING` flag + operator recipe (how to force full lifecycle on a `doc` story by setting `DELIVERY_MODE=standard`).
- **Q8** (backward-compat proof): prove `WORK_KIND_ROUTING=0` is byte-identical to pre-US-0118 behavior Ã¢Â€Â” existing backlog rows without `work_kind` continue to route via current `DELIVERY_MODE`/`AUTO_PHASE_*` (no forced reclassification). Test marker `test_us0118_default_off_zero_overhead`.
- **Q9** (classifier reuse boundary): confirm `scripts/dev_environment_lib.py:classify_touched_files()` is extended/imported, NOT rewritten. Lock the import contract Ã¢Â€Â” does `work_kind_classify_lib.py` import `TIER_C_SKIP_PREFIXES` + `classify_touched_files` directly, or duplicate the constants?
- **Q10** (installer manifest rows): `installer-owned-paths.manifest` `[install_include_paths]` rows for `scripts/work_kind_classify_lib.py` + `template/scripts/work_kind_classify_lib.py` Ã¢Â€Â” confirm triple-installer parity (PS1/Bash/Python) ships the new script.

### Risks promoted to `/architecture`

- **R1** (MEDIUM) Ã¢Â€Â” Classification ambiguity (a story that touches both `docs/` and `src/`) Ã¢Â†Â’ deterministic tie-break rule needed (Q1).
- **R2** (MEDIUM) Ã¢Â€Â” Precedence conflicts when both `WORK_KIND_ROUTING=1` and `DELIVERY_MODE` are set Ã¢Â†Â’ documented precedence chain (L8) + `WORK_KIND_DELIVERY_MODE_CONFLICT` reason code.
- **R3** (LOWÃ¢Â€Â“MEDIUM) Ã¢Â€Â” `mega_quick` eligibility overlap with `mini` Ã¢Â†Â’ classifier recommends `mega_quick` only when US-0096 eligibility passes, else falls back to `ultra_lean` (L6).
- **R4** (MEDIUM) Ã¢Â€Â” Backward compatibility Ã¢Â€Â” existing backlog rows without `work_kind` must continue to route via current `DELIVERY_MODE`/`AUTO_PHASE_*` (no forced reclassification). Q8 proof required.
- **R5** (LOWÃ¢Â€Â“MEDIUM) Ã¢Â€Â” Operator trust Ã¢Â€Â” classifier must be deterministic and inspectable (`--explain` flag emitting rule trace) so operators can override with confidence.
- **R6** (LOW) Ã¢Â€Â” Reuse boundary drift Ã¢Â€Â” `dev_environment_lib.classify_touched_files` extended/imported, not rewritten (Q9); lock import contract in `/architecture`.
- **R7** (LOW) Ã¢Â€Â” Installer parity drift Ã¢Â€Â” triple-installer must ship `work_kind_classify_lib.py` byte-identical (Q10); manifest-driven single source of truth.

### Compose, do not amend (verification)

| Story | README anchor | architecture.md anchor | Verification |
|-------|---------------|------------------------|--------------|
| US-0096 / DEC-0082 | L1410 umbrella + L2617 keys + L1569 `#### US-0096` | `## US-0096` L1684 | Ã¢ÂœÂ“ exists Ã¢Â€Â” explicit `DELIVERY_MODE` still wins (L8) |
| US-0070 / DEC-0052 | L2015 `#### US-0070` + L2890 keys | `## US-0070` L1572 | Ã¢ÂœÂ“ exists Ã¢Â€Â” `AUTO_PHASE_*` remains explicit override (L8) |
| US-0078 / DEC-0060 | L2131 `#### US-0078` + L432 runbook | `## US-0078` L1596 | Ã¢ÂœÂ“ exists Ã¢Â€Â” evidence gate still runs before any write (L10) |
| US-0051 | L382 `### Intake decomposition` | (no h1 anchor) | Ã¢ÂœÂ“ exists Ã¢Â€Â” classifier runs after decomposition evaluator (L10) |
| US-0069 / DEC-0051 | L1996 `#### US-0069` + L2876 keys | `## US-0069` L1568 | Ã¢ÂœÂ“ exists Ã¢Â€Â” classifier only selects which phases run, not who |
| US-0103 | L982 `#### US-0103` + L2421 keys | `## US-0103` L1640 | Ã¢ÂœÂ“ exists Ã¢Â€Â” read-only consumer for audit trail |

All 6 compose targets verified present (read-only consumers of US-0118 Ã¢Â€Â” their architectural surfaces are NOT edited by US-0118).

### DC (deferred-candidate) check

`grep "^## US-0118" docs/engineering/architecture.md` Ã¢Â†Â’ **no matches**. The `## US-0118` h1 anchor is **missing** from `architecture.md`. This is **expected** Ã¢Â€Â” the `## US-0118` anchor will be added in the `/architecture` phase (plan macro), NOT in `/discovery` (spec macro). No action required here. Not appended to `handoffs/sovereign_deferrals.jsonl`.

### Fail-closed reason codes (proposed, carried from intake handoff)

`WORK_KIND_CLASSIFY_FAILED`, `WORK_KIND_DELIVERY_MODE_CONFLICT`, `WORK_KIND_ROUTING_DISABLED` (info), `WORK_KIND_PLAN_COVERAGE_MISSING`. Finalize names + remediation prose in `/research` (Q2).

### Isolation evidence (US-0048 / DEC-0029) Ã¢Â€Â” mirror

- `phase_id=discovery`, `role=po`, `story_id=US-0118`, `sprint_id=(pending)`, `orchestrator_run_id=auto-20260704-01`
- `fresh_context_marker=po-US0118-discovery-20260704T194500Z-fresh`, `timestamp=2026-07-04T19:45:00Z` (UTC)
- `evidence_ref=docs/product/backlog.md (US-0118 block L3983Ã¢Â€Â“L4022 narrow-read), docs/product/acceptance.md (US-0118 row L145 narrow-read), handoffs/intake_evidence/US-0118-intake.json (full read), handoffs/po_to_tl.md (L1Ã¢Â€Â“L40 US-0118 intake handoff narrow-read), docs/engineering/state.md (drain-advance materialization breadcrumb L84Ã¢Â€Â“L101 narrow-read), .cursor/skills/its-magic/SKILL.md (full read), scripts/dev_environment_lib.py (TIER_C_SKIP_PREFIXES L117Ã¢Â€Â“L125 + classify_touched_files L321Ã¢Â€Â“L339 narrow-read), its_magic/README.md (grep US-0096/US-0070/US-0078/US-0051/US-0069/US-0103 anchors only), docs/engineering/architecture.md (grep ^## US-* anchors only), .cursor/commands/discovery.md (full read), docs/product/backlog.md (US-0108 discovery_notes L3856Ã¢Â€Â“L3888 narrow-read for L1..L10 pattern), docs/engineering/research.md (grep R-0106 anchor only), handoffs/resume_brief.md (L1Ã¢Â€Â“L40 narrow-read for drain-advance prose shape)`
- PO subagent spawned fresh per BUG-0006 / US-0048 isolation; no prior chat history carried forward. Context limited to the narrow-read files listed above (US-0053 / US-0096 Tranche A). No MCP / browser / shell side-effects beyond narrow-read grep + read tool calls + powershell SHA-256 computation for the strict runtime proof + the artifact writes listed in this prompt. No `.env` reads, no credentials access, no intake-evidence mutation.
- `assemble_sovereign_memory_digest(...)` NOT called (US-0118 first story of a new drain Ã¢Â€Â” US-0113..US-0117 retrospectives established reusable patterns; classifier work is code, not documentation Ã¢Â€Â” existing digest context sufficient for discovery).
- No write to `mistakes.jsonl` in discovery phase.

### Strict runtime proof (mirror)

- `runtime_proof_id=rp-auto-20260704-01-discovery-po-20260704T194500Z-US-0118`
- Canonical payload (sorted-key JSON per DEC-0038): `{"orchestrator_run_id":"auto-20260704-01","phase_id":"discovery","proof_issued_at":"2026-07-04T19:45:00Z","proof_ttl_seconds":"3600","role":"po","runtime_proof_id":"rp-auto-20260704-01-discovery-po-20260704T194500Z-US-0118","sprint_id":"(pending)","story_id":"US-0118"}`
- `proof_hash=17b2339eb039a4854a8ba347f49b649626cf224aa48cd308914bda82d49b6488` (SHA-256)
- `proof_ttl_seconds=3600`, `proof_ttl=2026-07-04T20:45:00Z` (UTC)

### Decision gate + next scheduled phase

- `decision_gate=false` (no DECISION_GATE; no hard stop; discovery locks captured; open questions delegated to `/research`)
- `next_scheduled_phase=/research` (role=tech-lead per US-0069 / DEC-0051 phaseÃ¢Â†Â’role matrix default Ã¢Â€Â” `AUTO_ROLE_RESEARCH` is empty so default tech-lead applies; first canonical phase of `plan` macro per ultra_lean; research + sprint-plan merged into `plan` macro)
- `next_scheduled_role=tech-lead`
- `stop_condition=STOP after discovery completes; hand off via artifacts only to /research in fresh tech-lead subagent (BUG-0006)`

---

