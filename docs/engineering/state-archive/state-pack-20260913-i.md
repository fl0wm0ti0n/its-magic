# State archive pack (2026-09-13)

- Rollover trigger: `STATE_HOT_MAX_LINES=1200, STATE_HOT_MAX_CHECKPOINTS=80`
- Source: `docs/engineering/state.md`
- Archived units (oldest first, contiguous prefix): 1
- Retained units in hot file: 14
- First archived heading: `## QA checkpoint — BUG-0020 / S0140 / auto-20260913-bug0020 (role=qa, spawn 003000Z)`
- Last archived heading: `## QA checkpoint — BUG-0020 / S0140 / auto-20260913-bug0020 (role=qa, spawn 003000Z)`
- Verification tuple (mandatory):
  - archived_body_lines=74
  - preamble_lines=11
  - retained_body_lines=1192

---

## QA checkpoint — BUG-0020 / S0140 / auto-20260913-bug0020 (role=qa, spawn 003000Z)

- phase_id=qa
- role=qa
- bug_id=BUG-0020 (Status OPEN — not flipped DONE)
- story_id=BUG-0020
- sprint_id=S0140
- orchestrator_run_id=auto-20260913-bug0020
- delivery_mode=ultra_lean
- macro_phase=build+verify
- AUTO_QUIET=1
- AUTO_IMPLEMENTATION_LOOP=1
- model_id=cursor-grok-4.6 (CROSS_MODEL_REVIEW=1 — required on isolation)
- fresh_context_marker=qa-BUG0020-qa-20260913T003000Z-fresh
- timestamp=2026-09-13T00:30:00Z
- verdict=QA_PASS
- decision_gate=false
- blocking_count=0
- non_blocking_count=3 (bug0020ex-* informational; desktop operator uses CLI TUI; no live OpenCode probe)
- architecture_anchor=docs/engineering/architecture.md # BUG-0020 (read-only)
- research_anchor=R-0126 (DQ1–DQ8 LOCKED; cited; not rewritten)
- companion_dec=none (do not allocate DEC-0136)
- approach=E2
- task_count=8 (T-anch + T-001..T-007 all DONE; QA attested)
- ac_coverage=10/10 surjective (ultra_lean SKIPPED plan-verify.json overwritten PASS this spawn)
- tests=pytest tests/bug0020_opencode_desktop_command_info_listing_test.py tests/bug0019_opencode_auto_slash_listing_test.py tests/bug0018_opencode_auto_ownership_test.py -v → 21/21 PASS (bug0020 8/8; bug0019 7/7; bug0018 6/6; 0.26s)
- parity=check_intake_template_parity.py --scope=bug-0020 → INTAKE_TEMPLATE_PARITY_OK
- metadata=check-user-visible-metadata.py --repo . → exit 0
- uat=qa_seeded; convergence_smoke=pass; contract_test_failed=0; 6 waived_probes UAT_PROBE_FORBIDDEN; full DEC-0009 owned by verify-work; no fake browser PASS; no live OpenCode desktop probe
- backlog_status=OPEN (### BUG-0020 — qa_notes appended; Status OPEN)
- acceptance_BUG-0020=unchecked (unchanged)
- sibling_boundary=BUG-0019/BUG-0018/BUG-0017/BUG-0015/BUG-0016 DONE out of scope; US-0135+ not drained; Cursor `/auto` do-not-touch; no STOP-only auto.md restore
- fail_closed_codes=OPENCODE_AUTO_DESKTOP_COMMAND_INFO_LISTING_UNSUPPORTED (held); compose OPENCODE_AUTO_MARKDOWN_COLLISION / OPENCODE_AUTO_SLASH_LISTING_UNSUPPORTED / OPENCODE_AUTO_TUI_DISPATCH_UNSUPPORTED unchanged
- next_scheduled_phase=/verify-work (fresh qa; orchestrator may insert sovereign-critic of qa first)
- next_scheduled_role=qa
- stop_condition=STOP after qa PASS. Orchestrator spawns sovereign-critic then /verify-work in fresh qa subagent (BUG-0006). Do NOT spawn verify-work or execute from this qa. Do NOT mark BUG-0020 DONE. Do NOT tick acceptance. Do NOT reopen BUG-0019.
- isolation_note=Independent /qa spawn 003000Z. Sibling hot-surface spawn 015500Z + critic-of-qa 020500Z also present; markers not reused.

### Isolation evidence (US-0048 / DEC-0029 / US-0104 v2) — qa BUG-0020 spawn 003000Z

- phase_id=qa
- role=qa
- model_id=cursor-grok-4.6 (CROSS_MODEL_REVIEW=1 — required)
- fresh_context_marker=qa-BUG0020-qa-20260913T003000Z-fresh (NEW per US-0048 / BUG-0006; not reused from execute `dev-BUG0020-execute-20260913T013500Z-fresh`, `dev-BUG0020-execute-20260913T001000Z-fresh`, critic `critic-BUG0020-execute-20260913T002000Z-fresh`, sibling qa `qa-BUG0020-qa-20260913T015500Z-fresh`, or critic-of-qa `critic-BUG0020-qa-20260913T020500Z-fresh`)
- timestamp=2026-09-13T00:30:00Z (UTC)
- orchestrator_run_id=auto-20260913-bug0020
- evidence_ref=sprints/S0140/qa-findings.md; sprints/S0140/plan-verify.json; sprints/S0140/uat.json; sprints/S0140/uat.md; handoffs/qa_to_verify.md; docs/product/backlog.md ### BUG-0020 qa_notes; docs/engineering/state.md (this checkpoint)
- Fresh qa subagent per BUG-0006 / US-0048 isolation; no prior chat history carried forward. Narrow-read only. No .env reads, no credentials, no intake JSON mutation, no /verify-work spawn from this subagent, no Status DONE flip, no acceptance tick.

### Strict runtime proof (DEC-0038) — qa spawn 003000Z

- runtime_proof_id=rp-auto-20260913-bug0020-qa-qa-20260913T003000Z-BUG-0020
- phase_id=qa, role=qa, story_id=BUG-0020, sprint_id=S0140
- proof_issued_at=2026-09-13T00:30:00Z
- proof_ttl_seconds=3600, proof_ttl=2026-09-13T01:30:00Z
- proof_hash=C2FAA352843F023D9A850875CC2D23D10A47A238C6A9D0DA7D55F26B6E7207DB
- Hash via `from scripts.token_cost_lib import compute_strict_proof_hash` (positional; compact sorted-key JSON).
- Canonical hashed payload: {"orchestrator_run_id":"auto-20260913-bug0020","phase_id":"qa","proof_issued_at":"2026-09-13T00:30:00Z","proof_ttl_seconds":3600,"role":"qa","runtime_proof_id":"rp-auto-20260913-bug0020-qa-qa-20260913T003000Z-BUG-0020"}
- Isolation extras (not hashed): delivery_mode=ultra_lean; macro_phase=build+verify; model_id=cursor-grok-4.6; sprint_id=S0140; story_id=BUG-0020
- hash_recompute_confirmation=true (compute_strict_proof_hash → C2FAA352843F023D9A850875CC2D23D10A47A238C6A9D0DA7D55F26B6E7207DB)
- Consumed execute handoff 013500Z: rp-auto-20260913-bug0020-execute-dev-20260913T013500Z-BUG-0020 / 965A8687F38065B9655B99AD025622675A353809CC3632CC1FC597F19E0F75D7 — independent MATCH
- Consumed execute critic-tuple 001000Z: rp-auto-20260913-bug0020-execute-dev-20260913T001000Z-BUG-0020 / 47B2CADE2DCD851D930C584E1FBFDF96B33E521572202D75726698DCC35A6EDF — independent MATCH (hashes differ; critic consume-before-TTL 2026-09-13T00:20:00Z)
- plan_verify_runtime_proof_id=rp-auto-20260913-bug0020-plan-verify-qa-20260913T003000Z-BUG-0020 / E6E5741468363C3808E499B96F0CABD115A066997135E04A483B5A6831FED844

### Triad hot-surface verification tuple (DEC-0054) — qa BUG-0020 spawn 003000Z

- surface=docs/engineering/state.md (isolation + qa 003000Z checkpoint append-bottom)
- companion=handoffs/qa_to_verify.md (prepend spawn 003000Z); handoffs/resume_brief.md (003000Z block retained); docs/product/backlog.md qa_notes (append)
- pre_write: `--check` PASS (`state` 1112/1200 units=16/80 after critic-of-qa rollover pack `state-pack-20260912-bz.md`)
- post_append: `enforce-triad-hot-surface.py --check` PASS (`state` 1186/1200 units=17/80); rollover not required
- artifact_ordering: state.md append-bottom (DEC-0040); qa_to_verify.md prepend; backlog notes append
- Active context surface preamble present
- pack_ref=docs/engineering/state-archive/state-pack-20260912-bz.md

