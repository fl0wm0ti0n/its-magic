# State archive pack (2026-09-12)

- Rollover trigger: `STATE_HOT_MAX_LINES=1200, STATE_HOT_MAX_CHECKPOINTS=80`
- Source: `docs/engineering/state.md`
- Archived units (oldest first, contiguous prefix): 1
- Retained units in hot file: 16
- First archived heading: `## Release checkpoint — BUG-0017 / S0135 / auto-20260911-bug0017 (role=release)`
- Last archived heading: `## Release checkpoint — BUG-0017 / S0135 / auto-20260911-bug0017 (role=release)`
- Verification tuple (mandatory):
  - archived_body_lines=82
  - preamble_lines=11
  - retained_body_lines=1155

---

## Release checkpoint — BUG-0017 / S0135 / auto-20260911-bug0017 (role=release)

- phase_id=release
- role=release
- bug_id=BUG-0017
- story_id=BUG-0017
- sprint_id=S0135
- orchestrator_run_id=auto-20260911-bug0017
- delivery_mode=ultra_lean
- macro_phase=ship
- model_id=composer-2.5 (CROSS_MODEL_REVIEW=1 — required on isolation)
- fresh_context_marker=rel-BUG0017-release-20260911T195400Z-fresh
- timestamp=2026-09-11T20:18:30Z
- verdict=RELEASE_PASS
- decision_gate=false
- blocking_count=0
- non_blocking_count=3 (NB1..NB3 informational)
- harness=tests/report.md @ 2026-09-11T20:18:29Z Pass:857 / Fail:0 (26AG BUG-0017 wired; harness_fail_zero_claimed=true)
- tests=pytest tests/bug0017_opencode_eol_test.py -v → 6/6 PASS
- guard=npm run guard:installer → PASS
- qa=PASS (sprints/S0135/qa-findings.md; 0 blockers)
- verify_work=PASS (uat 8/8; AC 7/7; convergence_smoke pass)
- uat_lifecycle=populated (DEC-0009)
- queue=S0135 → released (handoffs/release_queue.md)
- release_notes=handoffs/releases/S0135-release-notes.md + legacy pointer
- release_findings=sprints/S0135/release-findings.md PASS
- backlog_status=OPEN (### BUG-0017 — Status OPEN; acceptance unchecked — closure owns)
- acceptance_BUG-0017=unchecked (unchanged)
- sibling_boundary=BUG-0015/BUG-0016 DONE out of scope; BUG-0008/US-0084 compose-only extended not weakened
- publish=skipped (RELEASE_PUBLISH_MODE=confirm; RELEASE_PUBLISH_AUTO_CONFIRM=0 — not executed)
- sync=not_eligible (SYNC_POLICY_MODE=disabled)
- gate1_remediation=26AG harness wire + Homebrew 0.1.3-8 + restore active CI packaging jobs + model-catalog template parity
- architecture_anchor=docs/engineering/architecture.md # BUG-0017 (read-only)
- research_anchor=R-0118 (DQ1–DQ6 LOCKED; cited; not rewritten)
- companion_dec=none (compose BUG-0008 / US-0084 / DEC-0120)
- approach=A*
- next_scheduled_phase=/closure (fresh qe; after sovereign-critic of release)
- next_scheduled_role=qe
- stop_condition=STOP after release PASS. Orchestrator may critic then MUST Task-spawn /closure in fresh qe subagent (BUG-0006). Do NOT spawn /closure from this release. Do NOT mark BUG-0017 DONE. Do NOT tick acceptance. Do NOT reopen BUG-0015/BUG-0016. Do not npm-publish.

### Traceability index (DEC-0010) — release BUG-0017

| Story | Sprint | Tasks | Status | Evidence |
|-------|--------|-------|--------|----------|
| BUG-0017 | S0135 | T-anch + T-001..T-007 | RELEASE_PASS (OPEN until closure) | handoffs/releases/S0135-release-notes.md; sprints/S0135/release-findings.md; handoffs/release_queue.md; tests/report.md Fail:0 |

### Isolation evidence (US-0048 / DEC-0029 / US-0104 v2) — release BUG-0017

- phase_id=release
- role=release
- model_id=composer-2.5 (CROSS_MODEL_REVIEW=1 — required)
- fresh_context_marker=rel-BUG0017-release-20260911T195400Z-fresh (NEW per US-0048 / BUG-0006; not reused from qa-BUG0017-verify-work-20260911T195200Z-fresh or critic-BUG0017-verify-work-20260911T195300Z-fresh)
- timestamp=2026-09-11T20:18:30Z (UTC)
- orchestrator_run_id=auto-20260911-bug0017
- evidence_ref=handoffs/releases/S0135-release-notes.md; sprints/S0135/release-findings.md; handoffs/release_queue.md; handoffs/release_notes.md; handoffs/resume_brief.md; docs/engineering/runbook.md; docs/engineering/state.md (this checkpoint); tests/report.md; tests/run-tests.ps1; tests/bug0017_opencode_eol_test.py; packaging/homebrew/its-magic.rb; .github/workflows/ci.yml
- Fresh release subagent per BUG-0006 / US-0048 isolation; no prior chat history carried forward. Narrow-read only. No .env reads, no credentials, no intake JSON mutation, no Status DONE flip, no acceptance tick, no architecture.md / R-0118 body mutation, no companion DEC, no /closure spawn from this subagent, no npm publish.
- Isolation compliance: execute=PASS; qa=PASS; verify-work=PASS; sovereign-critic(verify-work)=PASS; release=PASS (this marker).

### Strict runtime proof (DEC-0038) — release

- runtime_proof_id=rp-auto-20260911-bug0017-release-release-20260911T201830Z-BUG-0017
- phase_id=release, role=release, story_id=BUG-0017, sprint_id=S0135
- proof_issued_at=2026-09-11T20:18:30Z
- proof_ttl_seconds=3600, proof_ttl=2026-09-11T21:18:30Z
- proof_hash=EFFA303CA150F1727598673F4B15ECC55C617A9E94EADD3D194DF5361D024CC9
- Canonical payload (sorted-key compact JSON per DEC-0038, lowercase keys only): {"delivery_mode":"ultra_lean","macro_phase":"ship","model_id":"composer-2.5","orchestrator_run_id":"auto-20260911-bug0017","phase_id":"release","proof_issued_at":"2026-09-11T20:18:30Z","proof_ttl_seconds":3600,"role":"release","runtime_proof_id":"rp-auto-20260911-bug0017-release-release-20260911T201830Z-BUG-0017","sprint_id":"S0135","story_id":"BUG-0017"}
- hash_recompute_confirmation=true (Python hashlib SHA-256 of exact canonical payload → EFFA303CA150F1727598673F4B15ECC55C617A9E94EADD3D194DF5361D024CC9)
- Producer verify-work proof consumed: rp-auto-20260911-bug0017-verify-work-qa-20260911T195200Z-BUG-0017 (EFC002B0895C4FC2AB4285FBAFED9E55BADC57F5B8EC43BBF676D5184E514C02) — RUNTIME_PROOF_VALID at release issue (before ttl 2026-09-11T20:52:00Z; consumed 2026-09-11T20:18:30Z).
- QA proof: rp-auto-20260911-bug0017-qa-qa-20260911T195000Z-BUG-0017 / 65A7F3ADFA440248BEA7A83A908680AB5AC270FF79DF7E2A2ECD0ECFDD30B441
- Plan-verify proof: rp-auto-20260911-bug0017-plan-verify-qa-20260911T195000Z-BUG-0017 / 58D69A19144D54A3854F133B77648F474A2A9E16F3E5EEA17235487AA4CB8C52
- Execute proof: rp-auto-20260911-bug0017-execute-dev-20260911T194500Z-BUG-0017 / 7B9319A03BA2399F67DD87F25334DEF7ECE7FD250DBEA8ABC5DC42ED22B01936

### Triad hot-surface verification tuple (DEC-0054) — release BUG-0017

- surface=docs/engineering/state.md (isolation + release checkpoint append-bottom)
- companion=handoffs/releases/S0135-release-notes.md; sprints/S0135/release-findings.md; handoffs/release_queue.md; handoffs/release_notes.md; handoffs/resume_brief.md; docs/engineering/runbook.md
- pre_write: enforce-triad-hot-surface.py --check exit 0
- post_append: `--check` exit 1 STATE_ARCHIVE_REQUIRED (state 1278/1200 units=19/80) → `arch_linkage_guard.py --pre` exit 0 → `enforce-triad-hot-surface.py --rollover` units=2 pack=`docs/engineering/state-archive/state-pack-20260911-l.md` → `arch_linkage_guard.py --post` exit 0; final `--check` exit 0
- artifact_ordering: state.md append-bottom (DEC-0040); resume_brief.md prepend-top; release_notes legacy prepend; queue in-place insert
- Active context surface preamble present
- pack_ref=docs/engineering/state-archive/state-pack-20260911-l.md

