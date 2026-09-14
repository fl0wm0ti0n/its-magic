# State archive pack (2026-09-12)

- Rollover trigger: `STATE_HOT_MAX_LINES=1200, STATE_HOT_MAX_CHECKPOINTS=80`
- Source: `docs/engineering/state.md`
- Archived units (oldest first, contiguous prefix): 1
- Retained units in hot file: 16
- First archived heading: `## Verify-work checkpoint — BUG-0017 / S0135 / auto-20260911-bug0017 (role=qa)`
- Last archived heading: `## Verify-work checkpoint — BUG-0017 / S0135 / auto-20260911-bug0017 (role=qa)`
- Verification tuple (mandatory):
  - archived_body_lines=78
  - preamble_lines=11
  - retained_body_lines=1159

---

## Verify-work checkpoint — BUG-0017 / S0135 / auto-20260911-bug0017 (role=qa)

- phase_id=verify-work
- role=qa
- bug_id=BUG-0017
- story_id=BUG-0017
- sprint_id=S0135
- orchestrator_run_id=auto-20260911-bug0017
- delivery_mode=ultra_lean
- macro_phase=build+verify
- model_id=composer-2.5 (CROSS_MODEL_REVIEW=1 — required on isolation)
- fresh_context_marker=qa-BUG0017-verify-work-20260911T195200Z-fresh
- timestamp=2026-09-11T19:52:00Z
- verdict=VERIFY_WORK_PASS
- decision_gate=false
- blocking_count=0
- non_blocking_count=3 (NB1..NB3 informational)
- uat_lifecycle=populated (DEC-0009)
- uat_total=8, uat_passed=8, uat_failed=0
- ac_satisfied=7/7 (AC-1..AC-7)
- convergence_smoke=pass (contract_test_failed=0)
- tests=pytest tests/bug0017_opencode_eol_test.py -v → 6/6 PASS (0.23s)
- guard=npm run guard:installer → PASS
- lf_spot_check=.opencode/commands/auto.md + intake.md LF-only (has_CR=False) — commands discoverable surrogate PASS
- guard_fails_on_cr=PASS (marker 4)
- parity=active↔template guard + test + runbook IDENTICAL
- architecture_anchor=docs/engineering/architecture.md # BUG-0017 (read-only)
- research_anchor=R-0118 (DQ1–DQ6 LOCKED; cited; not rewritten)
- companion_dec=none (compose BUG-0008 / US-0084 / DEC-0120)
- approach=A*
- backlog_status=OPEN (### BUG-0017 — Status OPEN; acceptance unchecked)
- acceptance_BUG-0017=unchecked (unchanged)
- sibling_boundary=BUG-0015/BUG-0016 DONE out of scope; BUG-0008/US-0084 compose-only extended not weakened
- next_scheduled_phase=/release (fresh release; after sovereign-critic of verify-work)
- next_scheduled_role=release
- stop_condition=STOP after verify-work PASS. Orchestrator may critic then MUST Task-spawn /release in fresh release subagent (BUG-0006). Do NOT spawn /release from this qa. Do NOT mark BUG-0017 DONE. Do NOT tick acceptance. Do NOT reopen BUG-0015/BUG-0016.

### Traceability index (DEC-0010) — verify-work BUG-0017

| Story | Sprint | Tasks | Status | Evidence |
|-------|--------|-------|--------|----------|
| BUG-0017 | S0135 | T-anch + T-001..T-007 | VERIFY_WORK_PASS | sprints/S0135/uat.json; uat.md; verify-work-findings.md; verify-work-verdict.json; pytest 6/6; guard:installer PASS; LF spot-check |

### Isolation evidence (US-0048 / DEC-0029 / US-0104 v2) — verify-work BUG-0017

- phase_id=verify-work
- role=qa
- model_id=composer-2.5 (CROSS_MODEL_REVIEW=1 — required)
- fresh_context_marker=qa-BUG0017-verify-work-20260911T195200Z-fresh (NEW per US-0048 / BUG-0006; not reused from qa-BUG0017-qa-20260911T194700Z-fresh or critic-BUG0017-qa-20260911T195100Z-fresh)
- timestamp=2026-09-11T19:52:00Z (UTC)
- orchestrator_run_id=auto-20260911-bug0017
- evidence_ref=sprints/S0135/uat.json; sprints/S0135/uat.md; sprints/S0135/verify-work-findings.md; sprints/S0135/verify-work-verdict.json; sprints/S0135/progress.md; handoffs/verify-work-to-release.md; handoffs/resume_brief.md; docs/engineering/state.md (this checkpoint); docs/product/backlog.md ### BUG-0017 verify_work_notes; .gitattributes; .opencode/commands/auto.md; scripts/guard_installer_publish.py; tests/bug0017_opencode_eol_test.py
- Fresh qa subagent per BUG-0006 / US-0048 isolation; no prior chat history carried forward. Narrow-read only. No .env reads, no credentials, no intake JSON mutation, no Status DONE flip, no acceptance tick, no architecture.md / R-0118 body mutation, no companion DEC, no /release spawn from this subagent, no live OpenCode probe.
- Isolation compliance: execute=PASS (dev-BUG0017-execute-20260911T192500Z-fresh); qa=PASS (qa-BUG0017-qa-20260911T194700Z-fresh); verify-work=PASS (this marker).

### Strict runtime proof (DEC-0038) — verify-work

- runtime_proof_id=rp-auto-20260911-bug0017-verify-work-qa-20260911T195200Z-BUG-0017
- phase_id=verify-work, role=qa, story_id=BUG-0017, sprint_id=S0135
- proof_issued_at=2026-09-11T19:52:00Z
- proof_ttl_seconds=3600, proof_ttl=2026-09-11T20:52:00Z
- proof_hash=EFC002B0895C4FC2AB4285FBAFED9E55BADC57F5B8EC43BBF676D5184E514C02
- Canonical payload (sorted-key compact JSON per DEC-0038, lowercase keys only): {"delivery_mode":"ultra_lean","macro_phase":"build+verify","model_id":"composer-2.5","orchestrator_run_id":"auto-20260911-bug0017","phase_id":"verify-work","proof_issued_at":"2026-09-11T19:52:00Z","proof_ttl_seconds":3600,"role":"qa","runtime_proof_id":"rp-auto-20260911-bug0017-verify-work-qa-20260911T195200Z-BUG-0017","sprint_id":"S0135","story_id":"BUG-0017"}
- hash_recompute_confirmation=true (Python hashlib SHA-256 of exact canonical payload → EFC002B0895C4FC2AB4285FBAFED9E55BADC57F5B8EC43BBF676D5184E514C02)
- Producer qa proof consumed: rp-auto-20260911-bug0017-qa-qa-20260911T195000Z-BUG-0017 (65A7F3ADFA440248BEA7A83A908680AB5AC270FF79DF7E2A2ECD0ECFDD30B441) — RUNTIME_PROOF_VALID at verify-work issue (before ttl 2026-09-11T20:50:00Z; consumed 2026-09-11T19:52:00Z). Note: qa_to_verify.md truncated ids to p-auto-…; full rp-auto-… taken from qa-findings/uat.json/state/resume_brief.
- Plan-verify proof: rp-auto-20260911-bug0017-plan-verify-qa-20260911T195000Z-BUG-0017 / 58D69A19144D54A3854F133B77648F474A2A9E16F3E5EEA17235487AA4CB8C52
- Execute proof: rp-auto-20260911-bug0017-execute-dev-20260911T194500Z-BUG-0017 / 7B9319A03BA2399F67DD87F25334DEF7ECE7FD250DBEA8ABC5DC42ED22B01936

### Triad hot-surface verification tuple (DEC-0054) — verify-work BUG-0017

- surface=docs/engineering/state.md (isolation + verify-work checkpoint append-bottom)
- companion=sprints/S0135/uat.json; sprints/S0135/uat.md; sprints/S0135/verify-work-findings.md; sprints/S0135/verify-work-verdict.json; handoffs/verify-work-to-release.md (prepend); handoffs/resume_brief.md (prepend)
- pre_write: enforce-triad-hot-surface.py --check exit 0
- post_append: `--check` exit 1 STATE_ARCHIVE_REQUIRED (state 1261/1200 units=19/80) → `arch_linkage_guard.py --pre` exit 0 → `enforce-triad-hot-surface.py --rollover` units=1 pack=`docs/engineering/state-archive/state-pack-20260911-j.md` → `arch_linkage_guard.py --post` exit 0; final `--check` exit 0
- artifact_ordering: state.md append-bottom (DEC-0040); resume_brief.md prepend-top; verify-work-to-release.md prepend
- Active context surface preamble present
- pack_ref=docs/engineering/state-archive/state-pack-20260911-j.md

