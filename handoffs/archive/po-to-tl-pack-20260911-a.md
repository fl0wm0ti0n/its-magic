# PO to TL archive pack (2026-09-11)

- Rollover trigger: `PO_TO_TL_HOT_MAX_LINES=650, PO_TO_TL_HOT_MAX_SECTIONS=60`
- Source: `handoffs/po_to_tl.md`
- Archived units (oldest first, contiguous prefix): 1
- Retained units in hot file: 12
- First archived heading: `## US-0118 Ã¢Â€Â” Work-kind classification (TL architecture handoff)`
- Last archived heading: `## US-0118 Ã¢Â€Â” Work-kind classification (TL architecture handoff)`
- Verification tuple (mandatory):
  - archived_body_lines=75
  - retained_body_lines=597

---

## US-0118 Ã¢Â€Â” Work-kind classification (TL architecture handoff)

- **Story**: `docs/product/backlog.md` `## US-0118 ? Work-kind classification + tiered delivery routing per story` (L3983)
- **Acceptance**: `docs/product/acceptance.md` US-0118 row L145 (12 ACs, OPEN)
- **Intake evidence**: `handoffs/intake_evidence/US-0118-intake.json` (first-intake-pack, validator `[INTAKE_EVIDENCE_VALIDATION_OK]`, all 8 topics covered, coverage_complete=true, plan_area_id=`work-kind-classifier`)
- **Phase**: architecture (plan macro Ã¢Â€Â” second canonical phase within ultra_lean; research + architecture + sprint-plan merged per US-0096 / DEC-0082)
- **Verdict**: PASS (no DECISION_GATE; companion DEC-0118 authored Accepted in THIS phase; approach A1 locked; sprint seeds T-anch + T-001..T-009 within SPRINT_MAX_TASKS=12; risks R1..R8 finalized; DC check clean)
- `orchestrator_run_id=auto-20260704-01`, `delivery_mode=ultra_lean`, `macro_phase=plan`
- `fresh_context_marker=tl-US0118-architecture-20260704T203000Z-fresh`, `timestamp (UTC)=2026-07-04T20:30:00Z`
- **Architecture anchor**: `docs/engineering/architecture.md` `## US-0118 Ã¢Â€Â” Work-kind classification + tiered delivery routing per story` (L1713)
- **Companion DEC**: `decisions/DEC-0118.md` (Required Ã¢Â†Â’ Accepted; authored in THIS phase)
- **Research anchor**: `docs/engineering/research.md` `## R-0106 - US-0118 Work-kind classification + tiered delivery routing research` (L8754)
- **Status**: OPEN per US-0045. **Next**: `/sprint-plan` (fresh tech-lead subagent Ã¢Â€Â” third canonical phase of `plan` macro per ultra_lean).

### Summary

Per-story **work-kind classifier** `scripts/work_kind_classify_lib.py:classify_work_kind(story_prose, acceptance_criteria, touched_file_hints, component_scope) -> WorkKindClassification` returns `work_kind Ã¢ÂˆÂˆ {doc, mini, code}` + `recommended_delivery_mode Ã¢ÂˆÂˆ {standard, ultra_lean, mega_quick}` + `recommended_phase_plan` + `rationale` + `evidence_refs` (+ optional `rule_trace` via `--explain`). New default-off `WORK_KIND_ROUTING=0|1` scratchpad flag (zero overhead when off Ã¢Â€Â” early-return in `/auto` `resolve_delivery_mode` step 0 when `WORK_KIND_ROUTING != "1"`). Backlog rows gain optional `work_kind` + `recommended_delivery_mode` set at intake (operator accept/override; recorded in intake evidence bundle per US-0078 / DEC-0060). `/auto` `resolve_delivery_mode` step 0 consumes them when `DELIVERY_MODE`/`AUTO_PHASE_*` are unset (L8 precedence: explicit `DELIVERY_MODE` > explicit `AUTO_PHASE_*` > `WORK_KIND_ROUTING`-derived > current default; `start-from` always wins). `doc` Ã¢Â†Â’ `[intake, execute, release]`; `mini` Ã¢Â†Â’ `ultra_lean` or `mega_quick` (US-0096 eligibility); `code` Ã¢Â†Â’ `standard`. Reuses `scripts/dev_environment_lib.py:classify_touched_files()` tier A/B/C + `TIER_C_SKIP_PREFIXES` Ã¢Â€Â” import, do not reinvent (Q9 LOCKED). Deterministic pure-stdlib, no LLM, no network, no `.env` reads (Q3 LOCKED). Four `WORK_KIND_*` reason codes (Q2 LOCKED). 12 `test_us0118_*` contract test markers (Q4 LOCKED). New `### Work-kind routing keys (US-0118)` README sub-block (Q5 LOCKED Ã¢Â€Â” 6th sibling; README edits happen in `/execute`, NOT here) + new `## Work-kind routing (US-0118)` runbook h2 (Q7 LOCKED). Triple-installer parity (Q10/installer manifest).

### Architecture anchor + approach A1 LOCKED

- **Architecture anchor**: `docs/engineering/architecture.md` `## US-0118 Ã¢Â€Â” Work-kind classification + tiered delivery routing per story` (L1713; appended after the existing `## US-0099` section at L1708).
- **Approach A1 LOCKED**: Single `### Work-kind routing (US-0118)` umbrella section + per-feature subsections + 6th scratchpad ref sub-block `### Work-kind routing keys (US-0118)` as a sibling to the US-0113..US-0117 sub-blocks (US-0113 L2421, US-0114 L2545, US-0115 L2617, US-0116 L2765, US-0117 L2856). US-0118 is the **6th-story cumulative byte-stability surface** Ã¢Â€Â” prior 5 released blocks must remain byte-identical; US-0118 adds net-new-keys-only + cross-link-pointers + reason-code-only entries to its own 6th sub-block, never edits prior released blocks. README edits happen in `/execute` (build+verify macro), NOT here Ã¢Â€Â” this phase only PROPOSES the sub-block name + cross-link targets in prose.

### Companion DEC = DEC-0118 (Required Ã¢Â†Â’ Accepted)

`companion_dec=DEC-0118` (authored Accepted in THIS phase at `decisions/DEC-0118.md`). US-0118 introduces a new routing primitive Ã¢Â€Â” DEC-0118 locks: (a) work-kind enumeration `doc`/`mini`/`code` 3-tier (alternatives: 2-tier doc/non-doc collapsed Ã¢Â€Â” rejected as too coarse; 4-tier doc/mini/standard/extended Ã¢Â€Â” rejected as over-engineered), (b) L8 precedence chain (explicit operator flags always win; classifier fills only the unset case), (c) `dev_environment_lib.classify_touched_files` reuse boundary (import, not rewrite Ã¢Â€Â” Q9 LOCKED), (d) zero-overhead-when-off contract (default `WORK_KIND_ROUTING=0`). Mirrors DEC-0082 (US-0096 delivery modes) / DEC-0052 (US-0070 phase selection) precedent.

### Sprint seeds preview (10 tasks within SPRINT_MAX_TASKS=12 Ã¢Â€Â” for `/sprint-plan` refinement)

T-anch (architecture.md `## US-0118` anchor Ã¢Â€Â” RESOLVED in THIS phase + compose-do-not-amend verification + import-contract lock), T-001 (classifier lib `scripts/work_kind_classify_lib.py` per Q10 signature), T-002 (scratchpad flag `WORK_KIND_ROUTING` + `.cursor/commands/auto.md` precedence clause), T-003 (intake integration `/intake` step 5), T-004 (`/auto` `resolve_delivery_mode` step-0 integration + early-return), T-005 (reason codes + fail-closed), T-006 (contract tests `tests/work_kind_classify_test.py` Ã¢Â€Â” 12 markers), T-007 (README + template parity `### Work-kind routing keys` sub-block Ã¢Â€Â” 6th sibling), T-008 (runbook cross-link `## Work-kind routing` h2), T-009 (regression + installer manifest + `WORK_KIND_ROUTING_PAIRS` parity validator). `/sprint-plan` may merge or split within the 12-task budget.

### DC resolution result

`dc_check=clean`. `grep "^## US-0118" docs/engineering/architecture.md` prior to this phase Ã¢Â†Â’ no matches. The `## US-0118` h1 anchor is **added in THIS `/architecture` phase** (per R-0105 Q-2 LOCKED pattern Ã¢Â€Â” T-anch is the resolution point). Cross-check against the full US-xxxx list in `docs/product/backlog.md`: no OTHER deferred `## US-xxxx` anchors remain unresolved. US-0117 was the **final deferred-candidate resolution point** (36 `## US-xxxx` h1 anchors added in US-0117's `/architecture` phase Ã¢Â€Â” 18 own + 18 deferred DC-1..DC-4); the deferral register is clean. US-0118 inherits no DC candidates from prior stories. No new DC candidates created by US-0118 (its own `## US-0118` anchor resolved HERE, not deferred). Deferral register remains clean Ã¢Â€Â” no carry-over to a successor story.

### Risks finalized (R1..R8 Ã¢Â€Â” 8 risks)

R1 (MEDIUM) classification ambiguity Ã¢Â†Â’ Q1 tie-break highest tier wins; R2 (MEDIUM) precedence conflicts Ã¢Â†Â’ L8 + `WORK_KIND_DELIVERY_MODE_CONFLICT`; R3 (LOWÃ¢Â€Â“MEDIUM) mega_quick overlap Ã¢Â†Â’ L6 eligibility gating; R4 (MEDIUM) backward compat Ã¢Â†Â’ Q8 early-return + contract test; R5 (LOWÃ¢Â€Â“MEDIUM) operator trust Ã¢Â†Â’ Q3 `--explain` + `rule_trace`; R6 (LOW) reuse boundary drift Ã¢Â†Â’ Q9 import contract + contract test; R7 (LOW) installer parity drift Ã¢Â†Â’ T-009 manifest; R8 (MEDIUM, NEW) cross-story byte-stability surface 6th sub-block Ã¢Â†Â’ T-007 net-new-keys-only + `PARITY_OK` proof never edits US-0113..US-0117 released blocks.

### Compose guards UNCHANGED (23 Ã¢Â€Â” cumulative, same 23 as US-0117)

US-0118 is a code-bearing story but lives entirely **additive** to the compose surface Ã¢Â€Â” it adds a new flag, a new lib, new backlog row fields, a new precedence clause, a new README sub-block, and a new runbook h2. It does **not** amend any existing compose-surface feature. The 23 compose guards (cumulative Ã¢Â€Â” US-0118 adds no new family-internal guards because US-0118 is itself a single-feature story, not a family umbrella) remain UNCHANGED: US-0091, US-0097, US-0017, US-0040, US-0100, US-0101, US-0102, US-0103, US-0104, US-0105, US-0107, US-0108, US-0109, US-0110, US-0111, US-0112, US-0034, US-0084, US-0086, US-0093, US-0096, US-0041, US-0062. US-0118 itself does NOT become a NEW compose guard (it's a routing primitive, not a guard Ã¢Â€Â” rejected; US-0118's contract is enforced by its own 12 `test_us0118_*` markers + the `WORK_KIND_ROUTING=0` zero-overhead-when-off contract).

### Isolation evidence (US-0048 / DEC-0029) Ã¢Â€Â” mirror

- `phase_id=architecture`, `role=tech-lead`, `story_id=US-0118`, `sprint_id=(pending Ã¢Â€Â” created at sprint-plan)`, `orchestrator_run_id=auto-20260704-01`
- `delivery_mode=ultra_lean`, `macro_phase=plan` (architecture Ã¢Â€Â” second canonical phase of `plan` macro per US-0096 / DEC-0082)
- `fresh_context_marker=tl-US0118-architecture-20260704T203000Z-fresh`, `timestamp=2026-07-04T20:30:00Z` (UTC)
- `evidence_ref=docs/product/backlog.md (## US-0118 block L3983Ã¢Â€Â“L4025), docs/product/acceptance.md (US-0118 row L145), handoffs/po_to_tl.md (US-0118 research + discovery + intake handoffs), docs/engineering/state.md (research + discovery checkpoints + drain-advance breadcrumb), docs/engineering/research.md (R-0106 full entry L8754Ã¢Â€Â“L8904), docs/engineering/architecture.md (grep ^## US- anchors + US-0117 section L1420Ã¢Â€Â“L1566 read as template + DC anchor verification L1568Ã¢Â€Â“L1710), scripts/dev_environment_lib.py (TIER_C_SKIP_PREFIXES L117Ã¢Â€Â“L125 + classify_touched_files L321Ã¢Â€Â“L339 narrow-read for Q9 import-contract lock), its_magic/README.md (grep ### .*keys anchors only Ã¢Â€Â” no full-read), decisions/DEC-0082.md (full read as DEC-0118 template), decisions/DEC-0052.md (full read as DEC-0118 template), docs/product/backlog.md (grep ^## US- anchors for DC cross-check), handoffs/resume_brief.md (top ~30 lines narrow-read for drain-advance prose shape)`
- Tech-lead subagent spawned fresh per BUG-0006 / US-0048 isolation; no prior chat history carried forward. Context limited to the narrow-read files listed above (US-0053 / US-0096 Tranche A). No MCP / browser / shell side-effects beyond narrow-read grep + read tool calls + python SHA-256 computation for the strict runtime proof + powershell line-count computations + the artifact writes listed in this phase. No `.env` reads, no credentials access, no intake-evidence mutation.
- `assemble_sovereign_memory_digest(...)` NOT called (US-0118 documentation-only so far Ã¢Â€Â” architecture phase writes prose + DEC only; existing digest context sufficient per R-0106).
- No write to `mistakes.jsonl` in architecture phase (no fix_failed / revert_applied / plan_fidelity_violation / scope_creep event occurred).
- Prior phase strict proof consumed: `rp-auto-20260704-01-research-techlead-20260704T200000Z-US-0118` (from `docs/engineering/state.md` research checkpoint, unchanged).
- Current architecture-phase strict proof recorded below.

### Strict runtime proof (mirror)

- `runtime_proof_id=rp-auto-20260704-01-architecture-techlead-20260704T203000Z-US-0118`
- Canonical payload (sorted-key JSON per DEC-0038): `{"orchestrator_run_id":"auto-20260704-01","phase_id":"architecture","proof_issued_at":"2026-07-04T20:30:00Z","proof_ttl_seconds":3600,"role":"tech-lead","runtime_proof_id":"rp-auto-20260704-01-architecture-techlead-20260704T203000Z-US-0118","sprint_id":"(pending)","story_id":"US-0118"}`
- `proof_hash=fd72d56bd8e8450cf830e3a4fa6164d5e3b98595c00fafa166ffd00669b1d3db` (SHA-256)
- `proof_ttl_seconds=3600`, `proof_ttl=2026-07-04T21:30:00Z` (UTC)

### Decision gate + next scheduled phase

- `decision_gate=false` (no DECISION_GATE; no hard stop; companion DEC-0118 authored Accepted in THIS phase; approach A1 locked; sprint seeds T-anch + T-001..T-009 within SPRINT_MAX_TASKS=12; risks R1..R8 finalized; DC check clean; compose-do-not-amend verified 6/6)
- `next_scheduled_phase=/sprint-plan` (role=tech-lead per US-0069 / DEC-0051 phaseÃ¢Â†Â’role matrix default; third canonical phase of `plan` macro per ultra_lean; research + architecture + sprint-plan merged into `plan` macro)
- `next_scheduled_role=tech-lead`
- `stop_condition=STOP after architecture completes; hand off via artifacts only to /sprint-plan in fresh tech-lead subagent (BUG-0006)`

---

# PO-to-TL handoffs

<!-- Archive pointer: US-0117 lifecycle handoffs (sprint-plan, architecture, research, spec) rolled over to `handoffs/archive/po-to-tl-pack-20260704-c.md` on 2026-07-04 by curator (US-0117 refresh-context terminal - final story in 5-story drain). US-0113/US-0114/US-0115 lifecycles in po-to-tl-pack-20260704-a/b.md; US-0116 lifecycle handoffs lost in git checkout HEAD recovery event (authoritative record in sprints/S0116/). Drain queue EMPTY - no next-story handoff to retain. -->

