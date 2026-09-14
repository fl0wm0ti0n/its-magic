# PO to TL archive pack (2026-09-11)

- Rollover trigger: `PO_TO_TL_HOT_MAX_LINES=650, PO_TO_TL_HOT_MAX_SECTIONS=60`
- Source: `handoffs/po_to_tl.md`
- Archived units (oldest first, contiguous prefix): 1
- Retained units in hot file: 13
- First archived heading: `## US-0118 Ã¢Â€Â” Work-kind classification (TL research handoff)`
- Last archived heading: `## US-0118 Ã¢Â€Â” Work-kind classification (TL research handoff)`
- Verification tuple (mandatory):
  - archived_body_lines=90
  - retained_body_lines=592

---

## US-0118 Ã¢Â€Â” Work-kind classification (TL research handoff)

- **Story**: `docs/product/backlog.md` `## US-0118 ? Work-kind classification + tiered delivery routing per story` (L3983)
- **Acceptance**: `docs/product/acceptance.md` US-0118 row L145 (12 ACs, OPEN)
- **Intake evidence**: `handoffs/intake_evidence/US-0118-intake.json` (first-intake-pack, validator `[INTAKE_EVIDENCE_VALIDATION_OK]`, all 8 topics covered, coverage_complete=true, plan_area_id=`work-kind-classifier`)
- **Phase**: research (plan macro Ã¢Â€Â” first canonical phase within ultra_lean; research + architecture + sprint-plan merged per US-0096 / DEC-0082)
- **Verdict**: PASS (no DECISION_GATE; 10/10 discovery open questions Q1..Q10 closed LOCKED; architecture seeds proposed for `/sprint-plan`; companion DEC-0118 to be authored in `/architecture`)
- `orchestrator_run_id=auto-20260704-01`, `delivery_mode=ultra_lean`, `macro_phase=plan`
- `fresh_context_marker=tl-US0118-research-20260704T200000Z-fresh`, `timestamp (UTC)=2026-07-04T20:00:00Z`
- **Research anchor**: `docs/engineering/research.md` `## R-0106 - US-0118 Work-kind classification + tiered delivery routing research`
- **Status**: OPEN per US-0045. **Next**: `/architecture` (fresh tech-lead subagent Ã¢Â€Â” second canonical phase of `plan` macro per ultra_lean; companion DEC-0118 to be authored there).

### Summary

Per-story **work-kind classifier** `scripts/work_kind_classify_lib.py:classify_work_kind(story_prose, acceptance_criteria, touched_file_hints, component_scope) -> WorkKindClassification` returns `work_kind Ã¢ÂˆÂˆ {doc, mini, code}` + `recommended_delivery_mode` + `recommended_phase_plan` + `rationale` + `evidence_refs` (+ optional `rule_trace` via `--explain`). New default-off `WORK_KIND_ROUTING=0|1` scratchpad flag (zero overhead when off Ã¢Â€Â” early-return in `/auto` `resolve_delivery_mode` step 0 when `WORK_KIND_ROUTING != "1"`). Backlog rows gain optional `work_kind` + `recommended_delivery_mode` set at intake (operator accept/override; recorded in intake evidence bundle). `/auto` `resolve_delivery_mode` step 0 consumes them when `DELIVERY_MODE`/`AUTO_PHASE_*` are unset (L8 precedence: explicit `DELIVERY_MODE` > explicit `AUTO_PHASE_*` > `WORK_KIND_ROUTING`-derived > current default). `doc` Ã¢Â†Â’ `[intake, execute, release]`; `mini` Ã¢Â†Â’ `ultra_lean` or `mega_quick` (US-0096 eligibility); `code` Ã¢Â†Â’ `standard`. Reuses `scripts/dev_environment_lib.py:classify_touched_files()` tier A/B/C + `TIER_C_SKIP_PREFIXES` Ã¢Â€Â” import, do not reinvent (Q9). Deterministic pure-stdlib, no LLM, no network, no `.env` reads (Q3). Four `WORK_KIND_*` reason codes (Q2). 12 `test_us0118_*` contract test markers (Q4). New `### Work-kind routing keys (US-0118)` README sub-block (Q5) + new `## Work-kind routing (US-0118)` runbook h2 (Q7). Triple-installer parity (Q10/installer manifest).

### Closed questions Q1..Q10 (10/10 Ã¢Â€Â” all LOCKED)

| Q | Topic | Resolution (summary) | LOCK |
|---|-------|-----------|------|
| Q1 | Tie-break (mixed `docs/`+`src/`) | Highest tier wins: `code` > `mini` > `doc` (mirrors `classify_touched_files` tier_rank A>B>C) | LOCKED |
| Q2 | Reason-code names + remediation | `WORK_KIND_CLASSIFY_FAILED`, `WORK_KIND_DELIVERY_MODE_CONFLICT`, `WORK_KIND_ROUTING_DISABLED` (info), `WORK_KIND_PLAN_COVERAGE_MISSING` Ã¢Â€Â” each with remediation prose | LOCKED |
| Q3 | Determinism (stdlib vs LLM) | Deterministic pure-stdlib; `--explain` emits `rule_trace`; no network/`.env`/model | LOCKED |
| Q4 | Contract test markers | 12 `test_us0118_*` markers enumerated in `tests/work_kind_classify_test.py` | LOCKED |
| Q5 | Scratchpad reference extension | New sibling sub-block `### Work-kind routing keys (US-0118)` (6th sibling; preserves US-0113..US-0117 byte-stability) | LOCKED |
| Q6 | Template parity pairs | 6 `WORK_KIND_*` parity pairs (script, scratchpad, commands, runbook, manifest) + `WORK_KIND_ROUTING_PAIRS` validator | LOCKED |
| Q7 | Runbook cross-link anchor | New h2 `## Work-kind routing (US-0118)` (sibling to existing h2 sections) | LOCKED |
| Q8 | Backward-compat proof (`WORK_KIND_ROUTING=0`) | Contract test `test_us0118_default_off_zero_overhead` + early-return in `/auto` step 0 | LOCKED |
| Q9 | Intake-time accept/override gate | 3 new evidence fields: `work_kind`, `recommended_delivery_mode`, `work_kind_operator_decision Ã¢ÂˆÂˆ {accept, override}` | LOCKED |
| Q10 | Classifier input schema | `classify_work_kind(story_prose, acceptance_criteria, touched_file_hints, component_scope) -> WorkKindClassification` dataclass | LOCKED |

### Architecture seeds preview (10 tasks within SPRINT_MAX_TASKS=12 Ã¢Â€Â” for `/sprint-plan` refinement)

T-anch (architecture.md `# US-0118` anchor + compose-do-not-amend verification + import-contract lock), T-001 (classifier lib `scripts/work_kind_classify_lib.py`), T-002 (scratchpad flag `WORK_KIND_ROUTING` + `.cursor/commands/auto.md` precedence clause), T-003 (intake integration `/intake` step 5), T-004 (`/auto` `resolve_delivery_mode` step-0 integration + early-return), T-005 (reason codes + fail-closed), T-006 (contract tests `tests/work_kind_classify_test.py` Ã¢Â€Â” 12 markers), T-007 (README + template parity `### Work-kind routing keys` sub-block), T-008 (runbook cross-link `## Work-kind routing` h2), T-009 (regression + installer manifest). `/sprint-plan` may merge or split within the 12-task budget.

### Companion DEC decision

**DEC-0118 required** (to be authored in `/architecture`, not here). US-0118 introduces a new routing primitive Ã¢Â€Â” companion DEC locks: (a) the work-kind enumeration decision (`doc`/`mini`/`code` 3-tier; alternatives rejected as over-/under-engineered), (b) the L8 precedence chain (explicit operator flags always win; classifier fills only the unset case), (c) the `dev_environment_lib.classify_touched_files` reuse boundary (import, not rewrite), (d) the zero-overhead-when-off contract (default `WORK_KIND_ROUTING=0`). Mirrors DEC-0082 / DEC-0052 precedent.

### Risks finalized (R1..R7 promoted + R8 added Ã¢Â€Â” 8 risks)

R1 (MEDIUM) classification ambiguity Ã¢Â†Â’ Q1 tie-break; R2 (MEDIUM) precedence conflicts Ã¢Â†Â’ L8 + `WORK_KIND_DELIVERY_MODE_CONFLICT`; R3 (LOWÃ¢Â€Â“MEDIUM) mega_quick overlap Ã¢Â†Â’ L6 eligibility gating; R4 (MEDIUM) backward compat Ã¢Â†Â’ Q8 early-return + contract test; R5 (LOWÃ¢Â€Â“MEDIUM) operator trust Ã¢Â†Â’ Q3 `--explain` + `rule_trace`; R6 (LOW) reuse boundary drift Ã¢Â†Â’ Q9 import contract + contract test; R7 (LOW) installer parity drift Ã¢Â†Â’ T-009 manifest; R8 (MEDIUM, NEW) cross-story byte-stability surface (6th sub-block) Ã¢Â†Â’ T-007 net-new-keys-only + `PARITY_OK` proof.

### Compose, do not amend (verified Ã¢Â€Â” 6/6)

| Story | README anchor | architecture.md anchor | Verification |
|-------|---------------|------------------------|--------------|
| US-0096 / DEC-0082 | L2617 + L2670 inline | `## US-0096` L1684 | Ã¢ÂœÂ“ exists Ã¢Â€Â” explicit `DELIVERY_MODE` still wins (L8) |
| US-0070 / DEC-0052 | L2856 | `## US-0070` L1572 | Ã¢ÂœÂ“ exists Ã¢Â€Â” `AUTO_PHASE_*` remains explicit override (L8) |
| US-0078 / DEC-0060 | L479 runbook | `## US-0078` L1596 | Ã¢ÂœÂ“ exists Ã¢Â€Â” evidence gate still runs before any write (L10) |
| US-0051 | L371 runbook | (no h1 anchor) | Ã¢ÂœÂ“ exists Ã¢Â€Â” classifier runs after decomposition evaluator (L10) |
| US-0069 / DEC-0051 | L2856 | `## US-0069` L1568 | Ã¢ÂœÂ“ exists Ã¢Â€Â” classifier only selects which phases run, not who |
| US-0103 | L2421 | `## US-0103` L1640 | Ã¢ÂœÂ“ exists Ã¢Â€Â” read-only consumer for audit trail |

All 6 compose targets verified present (read-only consumers of US-0118 Ã¢Â€Â” additive-only).

### DC (deferred-candidate) check

`grep "^## US-0118" docs/engineering/architecture.md` Ã¢Â†Â’ **no matches**. The `# US-0118` h1 anchor is **missing** from `architecture.md`. This is **expected** Ã¢Â€Â” the `# US-0118` anchor will be added in the `/architecture` phase (plan macro), NOT in `/research`. T-anch in the architecture seeds is the resolution point. Not appended to `handoffs/sovereign_deferrals.jsonl`.

### AC baselines (verified green)

- `python scripts/validate_readme_feature_coverage.py --repo .` Ã¢Â†Â’ `{"coverage_missing":[],"coverage_present":[],"coverage_total":0,"gaps":[],"status":"PASS"}` exit 0.
- `python -m pytest tests/scratchpad_example_parity_test.py -v` Ã¢Â†Â’ `4 passed in 0.08s` (BUG-0013 parity baseline green; do not weaken tests).

### Isolation evidence (US-0048 / DEC-0029) Ã¢Â€Â” mirror

- `phase_id=research`, `role=tech-lead`, `story_id=US-0118`, `sprint_id=(pending)`, `orchestrator_run_id=auto-20260704-01`
- `fresh_context_marker=tl-US0118-research-20260704T200000Z-fresh`, `timestamp=2026-07-04T20:00:00Z` (UTC)
- `evidence_ref=docs/product/backlog.md (## US-0118 block L3983Ã¢Â€Â“L4025), docs/product/acceptance.md (US-0118 row L145), handoffs/intake_evidence/US-0118-intake.json (full read), handoffs/po_to_tl.md (US-0118 discovery handoff L5Ã¢Â€Â“L103), docs/engineering/state.md (drain-advance breadcrumb + discovery checkpoint L84Ã¢Â€Â“L196), scripts/dev_environment_lib.py (TIER_C_SKIP_PREFIXES L117Ã¢Â€Â“L125 + TIER_A_PATTERNS L84Ã¢Â€Â“L102 + TIER_B_PATTERNS L104Ã¢Â€Â“L115 + classify_touched_files L321Ã¢Â€Â“L339), its_magic/README.md (grep anchors only Ã¢Â€Â” Delivery & lifecycle keys / Phase & role governance keys / Full scratchpad reference / Caveman mode), docs/engineering/architecture.md (grep ^## US-0096/^## US-0070/^## US-0069/^## US-0078/^## US-0103/^## US-0118 anchors only), docs/engineering/runbook.md (grep ^## h2 anchors only), .cursor/scratchpad.md (grep WORK_KIND_ROUTING/DELIVERY_MODE/AUTO_PHASE_PLAN/EARLY_RESEARCH/SPRINT_MAX_TASKS anchors only), .cursor/commands/auto.md (resolve_delivery_mode L284Ã¢Â€Â“L329 narrow-read), .cursor/commands/intake.md (grep decomposition/step 5/persistence anchors only), docs/engineering/research.md (R-0105 full read as template + R-0106 stub replacement)`
- Tech-lead subagent spawned fresh per BUG-0006 / US-0048 isolation; no prior chat history carried forward. Context limited to the narrow-read files listed above (US-0053 / US-0096 Tranche A). No MCP / browser / shell side-effects beyond narrow-read grep + read tool calls + python SHA-256 computation for the strict runtime proof + the artifact writes listed in this prompt (research.md R-0106 entry, state.md research checkpoint append, po_to_tl.md research handoff prepend, resume_brief.md drain-advance append). No `.env` reads, no credentials access, no intake-evidence mutation.
- `assemble_sovereign_memory_digest(...)` NOT called (US-0118 first story of a new drain Ã¢Â€Â” US-0113..US-0117 retrospectives established reusable patterns; classifier work is code, not documentation Ã¢Â€Â” existing digest context sufficient for research).
- No write to `mistakes.jsonl` in research phase.

### Strict runtime proof (mirror)

- `runtime_proof_id=rp-auto-20260704-01-research-techlead-20260704T200000Z-US-0118`
- Canonical payload (sorted-key JSON per DEC-0038): `{"orchestrator_run_id":"auto-20260704-01","phase_id":"research","proof_issued_at":"2026-07-04T20:00:00Z","proof_ttl_seconds":3600,"role":"tech-lead","runtime_proof_id":"rp-auto-20260704-01-research-techlead-20260704T200000Z-US-0118","sprint_id":"(pending)","story_id":"US-0118"}`
- `proof_hash=3582430b9c41b432bc8822b16bfc32c3597cf6788c528507d3dd0e21adb23e9e` (SHA-256)
- `proof_ttl_seconds=3600`, `proof_ttl=2026-07-04T21:00:00Z` (UTC)

### Decision gate + next scheduled phase

- `decision_gate=false` (no DECISION_GATE; no hard stop; 10/10 open questions closed LOCKED; architecture seeds proposed; companion DEC-0118 to be authored in `/architecture`)
- `next_scheduled_phase=/architecture` (role=tech-lead per US-0069 / DEC-0051 phaseÃ¢Â†Â’role matrix default; second canonical phase of `plan` macro per ultra_lean; research + architecture + sprint-plan merged into `plan` macro)
- `next_scheduled_role=tech-lead`
- `stop_condition=STOP after research completes; hand off via artifacts only to /architecture in fresh tech-lead subagent (BUG-0006)`

---

