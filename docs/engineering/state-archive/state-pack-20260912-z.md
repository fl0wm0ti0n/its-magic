# State archive pack (2026-09-12)

- Rollover trigger: `STATE_HOT_MAX_LINES=1200, STATE_HOT_MAX_CHECKPOINTS=80`
- Source: `docs/engineering/state.md`
- Archived units (oldest first, contiguous prefix): 1
- Retained units in hot file: 16
- First archived heading: `## QA checkpoint — BUG-0018 / S0136 / auto-20260912-bug0018 (role=qa)`
- Last archived heading: `## QA checkpoint — BUG-0018 / S0136 / auto-20260912-bug0018 (role=qa)`
- Verification tuple (mandatory):
  - archived_body_lines=80
  - preamble_lines=11
  - retained_body_lines=1163

---

## QA checkpoint — BUG-0018 / S0136 / auto-20260912-bug0018 (role=qa)

- phase_id=qa
- role=qa
- bug_id=BUG-0018 (Status OPEN — not flipped DONE)
- story_id=BUG-0018
- sprint_id=S0136
- orchestrator_run_id=auto-20260912-bug0018
- delivery_mode=ultra_lean
- macro_phase=build+verify
- AUTO_IMPLEMENTATION_LOOP=1 (blocking_count=0 — do not return to /execute)
- model_id=cursor-grok-4.6 (CROSS_MODEL_REVIEW=1 — required on isolation)
- fresh_context_marker=qa-BUG0018-qa-20260912T103500Z-fresh
- timestamp=2026-09-12T10:35:00Z
- verdict=QA_PASS
- decision_gate=false
- blocking_count=0
- non_blocking_count=3 (execute-critic NB1..NB3 informational)
- plan_verify_verdict=PASS (ultra_lean deferred; sprints/S0136/plan-verify.json; 7/7 AC surjective)
- tests=pytest tests/bug0018*.py + us0125 + bug0015 + bug0017 → 30/30 PASS (bug0018 6/6; 1.42s)
- parity=check_intake_template_parity.py --scope=bug-0015 → [INTAKE_TEMPLATE_PARITY_OK]
- metadata=check-user-visible-metadata.py --repo . → exit 0
- uat_lifecycle=qa_seeded (8/8; UAT-1..UAT-7 + convergence_smoke; 6 live classes UAT_PROBE_FORBIDDEN)
- auto_md=absent (active+template .opencode/commands/auto.md)
- plugin_attach=retained (editor.add name auto execute → runAutoLifecycle)
- leftover_delete=false (leftoverAutoMarkdownExists has no unlink/rmSync)
- backlog_status=OPEN (### BUG-0018 — Status OPEN; acceptance unchecked)
- sibling_boundary=BUG-0015/BUG-0016/BUG-0017 DONE out of scope
- next_scheduled_phase=verify-work
- next_scheduled_role=qa
- stop_condition=STOP after qa PASS. Orchestrator MUST Task-spawn sovereign-critic of qa then /verify-work in fresh qa (BUG-0006). Do NOT spawn /verify-work or /execute from this qa. Do NOT mark BUG-0018 DONE. Do NOT tick acceptance.

### Isolation evidence (US-0048 / DEC-0029 / US-0104 v2) — qa BUG-0018

- phase_id=qa
- role=qa
- model_id=cursor-grok-4.6 (CROSS_MODEL_REVIEW=1 — required)
- fresh_context_marker=qa-BUG0018-qa-20260912T103500Z-fresh (NEW per US-0048 / BUG-0006; not reused from dev-BUG0018-execute-20260912T102000Z-fresh or critic-BUG0018-execute-20260912T103000Z-fresh)
- timestamp=2026-09-12T10:35:00Z (UTC)
- orchestrator_run_id=auto-20260912-bug0018
- evidence_ref=sprints/S0136/qa-findings.md; sprints/S0136/plan-verify.json; sprints/S0136/uat.json; sprints/S0136/uat.md
- Fresh qa subagent per BUG-0006 / US-0048 isolation; no prior chat history carried forward. Narrow-read only. No .env reads, no credentials, no intake JSON mutation, no Status DONE flip, no acceptance tick, no architecture.md / R-0120 body mutation, no companion DEC, no /verify-work or /execute spawn from this subagent, no live OpenCode probe.
- Producer proof consumed: rp-auto-20260912-bug0018-execute-dev-20260912T102000Z-BUG-0018 (1BFC71170240A01546AB58966CDB431CA1802A96BBD6D91D559C1869535B6A82) — RUNTIME_PROOF_VALID; consumed at 2026-09-12T10:35:00Z before ttl 2026-09-12T11:20:00Z.

### Strict runtime proof (DEC-0038) — qa

- runtime_proof_id=rp-auto-20260912-bug0018-qa-qa-20260912T103500Z-BUG-0018
- phase_id=qa, role=qa, story_id=BUG-0018, sprint_id=S0136
- proof_issued_at=2026-09-12T10:35:00Z
- proof_ttl_seconds=3600, proof_ttl=2026-09-12T11:35:00Z
- proof_hash=23372F67B489CE60161626AA2A9E0EEFC028DF7C58DAED1E27D6A8A2C4E43E5F
- Canonical payload (sorted-key compact JSON per DEC-0038, lowercase keys only): {"delivery_mode":"ultra_lean","macro_phase":"build+verify","model_id":"cursor-grok-4.6","orchestrator_run_id":"auto-20260912-bug0018","phase_id":"qa","proof_issued_at":"2026-09-12T10:35:00Z","proof_ttl_seconds":3600,"role":"qa","runtime_proof_id":"rp-auto-20260912-bug0018-qa-qa-20260912T103500Z-BUG-0018","sprint_id":"S0136","story_id":"BUG-0018"}
- hash_recompute_confirmation=true (Python hashlib SHA-256 of exact canonical payload → 23372F67B489CE60161626AA2A9E0EEFC028DF7C58DAED1E27D6A8A2C4E43E5F)
- Producer execute proof consumed: rp-auto-20260912-bug0018-execute-dev-20260912T102000Z-BUG-0018 (1BFC71170240A01546AB58966CDB431CA1802A96BBD6D91D559C1869535B6A82) — RUNTIME_PROOF_VALID at qa issue (before ttl 2026-09-12T11:20:00Z)

### Strict runtime proof (DEC-0038) — plan-verify (ultra_lean merged)

- runtime_proof_id=rp-auto-20260912-bug0018-plan-verify-qa-20260912T103500Z-BUG-0018
- phase_id=plan-verify, role=qa, story_id=BUG-0018, sprint_id=S0136
- proof_issued_at=2026-09-12T10:35:00Z
- proof_ttl_seconds=3600, proof_ttl=2026-09-12T11:35:00Z
- proof_hash=6BCD9FD84F7F612467E00F8CB69F3BD6CCB9EB33DB5B514B7BA3A90A4B3A89CB
- Canonical payload: {"delivery_mode":"ultra_lean","macro_phase":"build+verify","model_id":"cursor-grok-4.6","orchestrator_run_id":"auto-20260912-bug0018","phase_id":"plan-verify","proof_issued_at":"2026-09-12T10:35:00Z","proof_ttl_seconds":3600,"role":"qa","runtime_proof_id":"rp-auto-20260912-bug0018-plan-verify-qa-20260912T103500Z-BUG-0018","sprint_id":"S0136","story_id":"BUG-0018"}

### Non-blocking carry-forwards (informational)

- NB1 (challenger / bug0018ex-challenger-001): leftover consumer auto.md/unlink-fail owned by runbook DQ8 + OPENCODE_AUTO_MARKDOWN_COLLISION; marker 4 prune PASS.
- NB2 (architect / bug0018ex-architect-002): qa created plan-verify.json + independent AC remap this pass; execute compose/parity held.
- NB3 (subtractor / bug0018ex-subtractor-003): Do not spawn /verify-work from qa (BUG-0006); no DONE flip; no companion DEC; no live OpenCode probe.

### Triad hot-surface verification tuple (DEC-0054) — qa BUG-0018

- surface=docs/engineering/state.md (isolation + qa checkpoint append-bottom)
- companion=sprints/S0136/qa-findings.md; sprints/S0136/plan-verify.json; sprints/S0136/uat.json; sprints/S0136/uat.md; sprints/S0136/progress.md; handoffs/qa_to_verify.md (prepend); handoffs/resume_brief.md (prepend)
- pre_write: `--check` exit 0
- post_append: `--check` exit 1 STATE_ARCHIVE_REQUIRED (state 1237/1200 units=17/80) → `arch_linkage_guard.py --pre` exit 0 → `enforce-triad-hot-surface.py --rollover` units=1 pack=`docs/engineering/state-archive/state-pack-20260912-j.md` (archived `## Release checkpoint — BUG-0017`) → `arch_linkage_guard.py --post` exit 0; final `--check` exit 0 (retained_body_lines=1155)
- artifact_ordering: state.md append-bottom (DEC-0040); resume_brief.md prepend-top; qa_to_verify.md prepend
- Active context surface preamble present
- pack_ref=docs/engineering/state-archive/state-pack-20260912-j.md

