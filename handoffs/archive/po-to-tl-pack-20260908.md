# PO to TL archive pack (2026-09-08)

- Rollover trigger: `PO_TO_TL_HOT_MAX_LINES=650, PO_TO_TL_HOT_MAX_SECTIONS=60`
- Source: `handoffs/po_to_tl.md`
- Archived units (oldest first, contiguous prefix): 1
- Retained units in hot file: 10
- First archived heading: `## US-0118 Â— Work-kind classification (TL sprint-plan handoff)`
- Last archived heading: `## US-0118 Â— Work-kind classification (TL sprint-plan handoff)`
- Verification tuple (mandatory):
  - archived_body_lines=92
  - retained_body_lines=571

---

## US-0118 Â— Work-kind classification (TL sprint-plan handoff)

- **Story**: `docs/product/backlog.md` `## US-0118 ? Work-kind classification + tiered delivery routing per story` (L3983)
- **Acceptance**: `docs/product/acceptance.md` US-0118 row L145 (12 ACs, OPEN)
- **Intake evidence**: `handoffs/intake_evidence/US-0118-intake.json` (first-intake-pack, validator `[INTAKE_EVIDENCE_VALIDATION_OK]`, all 8 topics covered, coverage_complete=true, plan_area_id=`work-kind-classifier`)
- **Phase**: sprint-plan (plan macro Â— third canonical phase within ultra_lean; research + architecture + sprint-plan merged per US-0096 / DEC-0082)
- **Verdict**: PASS (no DECISION_GATE; Sprint S0118 materialized with 10 tasks T-anch + T-001..T-009 within SPRINT_MAX_TASKS=12; AC-1..AC-12 surjective coverage 12/12; companion DEC-0118 Accepted; approach A1 locked; risks R1..R8 finalized; DC check clean; compose-do-not-amend verified 6/6)
- `orchestrator_run_id=auto-20260704-01`, `delivery_mode=ultra_lean`, `macro_phase=plan` (sprint-plan Â— third canonical phase of `plan` macro per ultra_lean)
- `fresh_context_marker=tl-US0118-sprint-plan-20260704T232400Z-fresh`, `timestamp (UTC)=2026-07-04T23:24:00Z`
- **Sprint anchor**: `sprints/S0118/sprint.md` (NEW Â— ultra_lean sprint plan; 10 tasks; AC-1..AC-12 surjective + DC resolution verified; metadata + scope + AC table + AC?task surjective coverage + task count + tasks + test markers + files to touch + files NOT to touch + compose guards UNCHANGED (23) + 6th-story cumulative byte-stability surface note + plan-verify readiness ultra_lean merge note + decision gate + sovereign memory note + risks R1..R8 + definition of done + isolation evidence + strict runtime proof + next phase)
- **Tasks anchor**: `sprints/S0118/tasks.md` (NEW Â— 10-task checklist with T-anch as NO-OP / verification; per-task coverage/risk/dependencies/files/scope/verification step; T-anch verifies `## US-0118` anchor exists at L1713 with no execute-phase write; T-001..T-009 mirror ultra_lean pattern adapted for 12 ACs + classifier lib + `/auto` integration + contract tests)
- **Architecture anchor**: `docs/engineering/architecture.md` `## US-0118 Â— Work-kind classification + tiered delivery routing per story` (L1713)
- **Companion DEC**: `decisions/DEC-0118.md` (Required ? Accepted; authored in `/architecture` phase Â— locks: work-kind enumeration `doc`/`mini`/`code` 3-tier, L8 precedence chain, `dev_environment_lib.classify_touched_files` reuse boundary, zero-overhead-when-off default `WORK_KIND_ROUTING=0`)
- **Research anchor**: `docs/engineering/research.md` `## R-0106 - US-0118 Work-kind classification + tiered delivery routing research`
- **Status**: OPEN per US-0045. **Next**: `/execute` (fresh dev subagent Â— first canonical phase of `build+verify` macro per ultra_lean; plan-verify merged into qa per ultra_lean Â— qa creates `plan-verify.json` within `build+verify`).

### Summary

Per-story **work-kind classifier** `scripts/work_kind_classify_lib.py:classify_work_kind(story_prose, acceptance_criteria, touched_file_hints, component_scope) -> WorkKindClassification` returns `work_kind ? {doc, mini, code}` + `recommended_delivery_mode ? {standard, ultra_lean, mega_quick}` + `recommended_phase_plan` + `rationale` + `evidence_refs` (+ optional `rule_trace` via `--explain`). New default-off `WORK_KIND_ROUTING=0|1` scratchpad flag (zero overhead when off Â— early-return in `/auto` `resolve_delivery_mode` step 0 when `WORK_KIND_ROUTING != "1"`). Backlog rows gain optional `work_kind` + `recommended_delivery_mode` set at intake (operator accept/override; recorded in intake evidence bundle per US-0078 / DEC-0060). `/auto` `resolve_delivery_mode` step 0 consumes them when `DELIVERY_MODE`/`AUTO_PHASE_*` are unset (L8 precedence: explicit `DELIVERY_MODE` > explicit `AUTO_PHASE_*` > `WORK_KIND_ROUTING`-derived > current default; `start-from` always wins). `doc` ? `[intake, execute, release]`; `mini` ? `ultra_lean` or `mega_quick` (US-0096 eligibility); `code` ? `standard`. Reuses `scripts/dev_environment_lib.py:classify_touched_files()` tier A/B/C + `TIER_C_SKIP_PREFIXES` Â— import, do not reinvent (Q9 LOCKED). Deterministic pure-stdlib, no LLM, no network, no `.env` reads (Q3 LOCKED). Four `WORK_KIND_*` reason codes (Q2 LOCKED). 12 `test_us0118_*` contract test markers (Q4 LOCKED). New `### Work-kind routing keys (US-0118)` README sub-block (Q5 LOCKED Â— 6th sibling; README edits happen in `/execute`) + new `## Work-kind routing (US-0118)` runbook h2 (Q7 LOCKED). Triple-installer parity (Q10/installer manifest). US-0118 is the **first 6-cumulative-surface story** Â— prior 5 released blocks (US-0113 L2421 + US-0114 L2545 + US-0115 L2617 + US-0116 L2765 + US-0117 L2856) must remain byte-identical; US-0118 adds net-new-keys-only + cross-link pointers + reason-code-only entries to its own 6th sub-block, never edits prior released blocks.

### Sprint seeds (10 tasks within SPRINT_MAX_TASKS=12 Â— refined in `/sprint-plan`)

T-anch (architecture.md `## US-0118` anchor Â— RESOLVED in `/architecture` phase + compose-do-not-amend verification + import-contract lock; NO-OP / verification), T-001 (README umbrella `### Work-kind routing (US-0118) umbrella section` under `## Commands and workflow`), T-002 (per-feature `#### US-0118` operator subsection with route table + `## Work-kind routing (US-0118)` runbook h2 + `.cursor/commands/intake.md` step-5 hook + `.cursor/commands/auto.md` step-0 precedence clause), T-003 (`### Work-kind routing keys (US-0118)` 6th scratchpad ref sub-block under `### Full scratchpad reference (detailed)`), T-004 (`template/its_magic/README.md` one-way byte-sync), T-005 (validators Â— `validate_readme_feature_coverage.py --enforce` + `validate_doc_profile.py` + `check-user-visible-metadata.py` + `check_intake_template_parity.py`), T-006 (regression tests `pytest tests/scratchpad_example_parity_test.py -v` 4 passed; forbid edits to scratchpad + test), T-007 (NEW `scripts/work_kind_classify_lib.py` classifier lib per Q10 signature + Q9 import contract + Q3 determinism + `--explain` + `--self-test`), T-008 (`/auto` `resolve_delivery_mode` step-0 integration + `/intake` step-5 hook + `.cursor/scratchpad.md` `WORK_KIND_ROUTING=0` key + intake evidence schema extension), T-009 (NEW `tests/us0118_contract_test.py` 12 markers + `installer-owned-paths.manifest` + `WORK_KIND_ROUTING_PAIRS` parity validator). Execution order: T-anch ? T-007 ? T-008 ? T-009 ? T-001 ? T-002 ? T-003 ? T-004 ? T-005 ? T-006 (acyclic; T-007/T-008/T-009 first since they're the code/lib/tests Â— keeps README byte-stability surface clean for T-001..T-004; T-anch first since it's a NO-OP on architecture.md).

### AC mapping (12 ACs ? 10 tasks surjective Â— matches `sprints/S0118/sprint.md` + `sprints/S0118/tasks.md`)

| AC | Task(s) |
|----|---------|
| DC resolution (`## US-0118` anchor verification) | T-anch |
| AC-1 Classifier library | T-007 |
| AC-2 Classification rules | T-007 |
| AC-3 Scratchpad flag | T-001, T-002, T-003 |
| AC-4 Backlog row fields | T-008 |
| AC-5 Intake integration | T-008 |
| AC-6 `/auto` integration | T-008 |
| AC-7 Fail-closed reason codes | T-009 |
| AC-8 Compose, do not amend | T-anch, T-006 |
| AC-9 Contract tests + parity | T-009, T-006 |
| AC-10 Architecture notes | T-anch |
| AC-11 Runbook + command docs | T-002 |
| AC-12 Self-test + installer delivery | T-005, T-009 |

**Surjectivity check**: AC-1..AC-12 all covered (12/12) + DC resolution verified (T-anch). Multi-AC tasks: T-007 (AC-1+AC-2), T-008 (AC-4+AC-5+AC-6), T-009 (AC-7+AC-9+AC-12 partial), T-006 (AC-8+AC-9 indirect), T-anch (AC-8+AC-10). Every AC has =1 task. No `PLAN_AC_COVERAGE_GAP`.

### Companion DEC = DEC-0118 (Accepted)

`companion_dec=DEC-0118` (authored Accepted in `/architecture` phase at `decisions/DEC-0118.md`). US-0118 introduces a new routing primitive Â— DEC-0118 locks: (a) work-kind enumeration `doc`/`mini`/`code` 3-tier (alternatives: 2-tier doc/non-doc collapsed Â— rejected as too coarse; 4-tier doc/mini/standard/extended Â— rejected as over-engineered), (b) L8 precedence chain (explicit operator flags always win; classifier fills only the unset case), (c) `dev_environment_lib.classify_touched_files` reuse boundary (import, not rewrite Â— Q9 LOCKED), (d) zero-overhead-when-off contract (default `WORK_KIND_ROUTING=0`). Mirrors DEC-0082 (US-0096 delivery modes) / DEC-0052 (US-0070 phase selection) precedent.

### Compose guards UNCHANGED (23 Â— cumulative, same 23 as US-0117)

US-0118 is a code-bearing story but lives entirely **additive** to the compose surface Â— it adds a new flag, a new lib, new backlog row fields, a new precedence clause, a new README sub-block, and a new runbook h2. It does **not** amend any existing compose-surface feature. The 23 compose guards (cumulative Â— US-0118 adds no new family-internal guards because US-0118 is itself a single-feature story, not a family umbrella) remain UNCHANGED: US-0091, US-0097, US-0017, US-0040, US-0100, US-0101, US-0102, US-0103, US-0104, US-0105, US-0107, US-0108, US-0109, US-0110, US-0111, US-0112, US-0034, US-0084, US-0086, US-0093, US-0096, US-0041, US-0062. US-0118 itself does NOT become a NEW compose guard (it's a routing primitive, not a guard Â— rejected; US-0118's contract is enforced by its own 12 `test_us0118_*` markers + the `WORK_KIND_ROUTING=0` zero-overhead-when-off contract).

### 6th-story cumulative byte-stability surface note

US-0118 is the **first 6-cumulative-surface story** Â— the cumulative byte-stability surface now covers **5 prior released blocks** (US-0113's `### Sovereign-loop era keys` L2421 + US-0114's `### Release & distribution keys` L2545 + US-0115's `### Integration & observability keys` L2617 + US-0116's `### Delivery & lifecycle keys` L2765 + US-0117's `### Phase & role governance keys` L2856). The cross-story byte-stability contract now scales from a quint to a sextet. US-0118's net-new content (`WORK_KIND_ROUTING` key + reason-code-only entries + cross-link pointers) is added to its own 6th sub-block; it never edits prior released blocks. `PARITY_OK <size> <size>` is the authoritative end-to-end byte-stability proof. Pattern now established as a sextet (S0113/S0114/S0115/S0116/S0117 + US-0118); contract pattern scales from quint to sextet without regression.

### Plan-verify readiness (ultra_lean merge note)

In **ultra_lean** delivery mode, `/plan-verify` is **merged into the `build+verify` macro under QA** Â— the orchestrator routes; this sprint does **not** pre-create `sprints/S0118/plan-verify.json`. The sprint-plan output is plan-verify-ready (surjective AC coverage 12/12, atomic tasks, test markers aligned, T-anch NO-OP documented) so QA can verify in one spawn within `build+verify`. QA creates `plan-verify.json` within `build+verify`.

### Risks finalized (R1..R8 Â— 8 risks)

R1 (MEDIUM) classification ambiguity ? Q1 tie-break highest tier wins; R2 (MEDIUM) precedence conflicts ? L8 + `WORK_KIND_DELIVERY_MODE_CONFLICT`; R3 (LOWÂ–MEDIUM) mega_quick overlap ? L6 eligibility gating; R4 (MEDIUM) backward compat ? Q8 early-return + contract test `test_us0118_default_off_zero_overhead`; R5 (LOWÂ–MEDIUM) operator trust ? Q3 `--explain` + `rule_trace`; R6 (LOW) reuse boundary drift ? Q9 import contract + contract test `test_us0118_classify_touched_files_reuse`; R7 (LOW) installer parity drift ? T-009 manifest; R8 (MEDIUM, NEW) cross-story byte-stability surface 6th sub-block ? T-003 net-new-keys-only + `PARITY_OK` proof never edits US-0113..US-0117 released blocks.

### Isolation evidence (US-0048 / DEC-0029) Â— mirror

- `phase_id=sprint-plan`, `role=tech-lead`, `story_id=US-0118`, `sprint_id=S0118` (NOW materialized), `orchestrator_run_id=auto-20260704-01`
- `delivery_mode=ultra_lean`, `macro_phase=plan` (sprint-plan Â— third canonical phase of `plan` macro per US-0096 / DEC-0082)
- `fresh_context_marker=tl-US0118-sprint-plan-20260704T232400Z-fresh`, `timestamp=2026-07-04T23:24:00Z` (UTC)
- `evidence_ref=docs/engineering/state.md (architecture checkpoint L300Â–L372 narrow-read), docs/engineering/architecture.md (## US-0118 section L1713Â–L1923 full read Â— Overview + Companion DEC + Approach A1 + Files to touch + Files NOT to touch + Sprint seeds + Test markers + Compose guards + DC resolution + Compose-do-not-amend + Risks + Stop conditions met + Sovereign memory note + Consequences + Evidence references + Isolation evidence + Strict runtime proof + Decision gate + Next scheduled phase), handoffs/po_to_tl.md (US-0118 architecture handoff L97Â–L164 narrow-read), docs/product/backlog.md (## US-0118 block L3983Â–L4025 narrow-read Â— 12 ACs verbatim + boundaries + related_us + intake_notes), docs/product/acceptance.md (US-0118 row L145 narrow-read Â— 12 ACs OPEN), sprints/S0117/sprint.md (full read as ultra_lean template), sprints/S0117/tasks.md (first ~120 lines read as ultra_lean tasks template), handoffs/resume_brief.md (top ~30 lines narrow-read for drain-advance prose shape)`
- Tech-lead subagent spawned fresh per BUG-0006 / US-0048 isolation; no prior chat history carried forward. Context limited to the narrow-read files listed above (US-0053 / US-0096 Tranche A). No MCP / browser / shell side-effects beyond narrow-read grep + read tool calls + python SHA-256 computation for the strict runtime proof + powershell line-count computations + the artifact writes listed in this phase. No `.env` reads, no credentials access, no intake-evidence mutation.
- `assemble_sovereign_memory_digest(...)` NOT called (US-0118 documentation+code so far; existing digest context sufficient per R-0106 Â— S0113..S0117 retrospectives established reusable patterns; cross-link pointer pattern + angle-distinct narrative pattern + byte-stability contract now scale from quint to sextet).
- No write to `mistakes.jsonl` in sprint-plan phase (no fix_failed / revert_applied / plan_fidelity_violation / scope_creep event occurred).
- Prior phase strict proof consumed: `rp-auto-20260704-01-architecture-techlead-20260704T203000Z-US-0118` (from `docs/engineering/state.md` architecture checkpoint, unchanged).
- Current sprint-plan-phase strict proof recorded below.

### Strict runtime proof (mirror)

- `runtime_proof_id=rp-auto-20260704-01-sprint-plan-techlead-20260704T232400Z-US-0118`
- Canonical payload (sorted-key JSON per DEC-0038): `{"orchestrator_run_id":"auto-20260704-01","phase_id":"sprint-plan","proof_issued_at":"2026-07-04T23:24:00Z","proof_ttl_seconds":3600,"role":"tech-lead","runtime_proof_id":"rp-auto-20260704-01-sprint-plan-techlead-20260704T232400Z-US-0118","sprint_id":"S0118","story_id":"US-0118"}`
- `proof_hash=4a6b5b6125848f4cbb209ad5ea7623f715e3aea8572ce087850069e0a7da29e7` (SHA-256)
- `proof_ttl_seconds=3600`, `proof_ttl=2026-07-05T00:24:00Z` (UTC)

### Decision gate + next scheduled phase

- `decision_gate=false` (no DECISION_GATE; no hard stop; Sprint S0118 materialized with 10 tasks within SPRINT_MAX_TASKS=12; AC-1..AC-12 surjective coverage 12/12; companion DEC-0118 Accepted; approach A1 locked; risks R1..R8 finalized; DC check clean; compose-do-not-amend verified 6/6; 6th-story cumulative byte-stability surface LOCKED; classifier signature Q10 LOCKED; import contract Q9 LOCKED; reason codes Q2 LOCKED; 12 test markers Q4 LOCKED)
- `next_scheduled_phase=/execute` (role=dev per US-0069 / DEC-0051 phase?role matrix default; first canonical phase of `build+verify` macro per ultra_lean; plan-verify merged into qa per ultra_lean Â— qa creates `plan-verify.json` within `build+verify`)
- `next_scheduled_role=dev`
- `stop_condition=STOP after sprint-plan completes; hand off via artifacts only to /execute in fresh dev subagent (BUG-0006)`

---

