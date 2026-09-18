## Sprint-plan handoff — BUG-0025 / S0157 — /execute (fresh dev, ultra_lean)

- sprint_id: S0157
- story_id: (none — bug work item)
- bug_id: BUG-0025 (Status OPEN — authority docs/product/backlog.md)
- companion_dec: none (packaging bug; docs/engineering/architecture.md # BUG-0025 only)
- research_anchor: R-0149 (DQ1–DQ10 LOCKED)
- architecture_anchor: docs/engineering/architecture.md # BUG-0025
- approach: A1 (A*) — one package.json files entry scripts/standalone_runtime_install_lib.py + isfile-before-exec → STANDALONE_BOOTSTRAP_FAILED + tests/bug0025_packaging_contract_test.py + optional guard allowlist assert + patch republish (e.g. 0.1.4); compose US-0147 DONE (do not reopen ACs); US-0133 omit-standalone/ held; BUG-0022/0024 OPEN not drained
- orchestrator_run_id: auto-20260918-bug0025
- parent_orchestrator_run_id: cursor-20260918-BUG0025-intake
- fresh_context_marker: tl-BUG0025-sprintplan-20260918T170500Z-fresh
- timestamp: 2026-09-18T17:05:00Z (UTC)
- model_id: inherit (CROSS_MODEL_REVIEW=0)
- segment_work_item_kind: bug
- active_bug_id: BUG-0025
- bug_queue_position: 1 of 1
- bug_queue_remaining: 0
- backlog_drain_active: false
- bug_queue_active: true
- sprint_plan_verdict: PASS (SPRINT_PLAN_PASS)
- decision_gate: false
- sprint_status: PLANNED (backlog OPEN per US-0045 — not mutated, AC-1..AC-8 unchecked)
- task_count: 11 (T-anch + T-001..T-010, ≤ SPRINT_MAX_TASKS=12, no split, 1:1 architecture seeds)
- ac_surjective_map: AC-1→T-001,T-005; AC-2→T-001; AC-3→T-002,T-003; AC-4→T-002,T-003,T-004; AC-5→T-005,T-006; AC-6→T-007,T-008,T-009; AC-7→T-010,T-anch; AC-8→T-anch; DC→T-anch
- task_order: T-anch → T-001 → T-002 → T-003 → T-004 → T-005 → T-006 → T-007 → T-008 → T-009 → T-010
- plan-verify: ultra_lean — NOT in resolved_phase_plan; skipped; no plan-verify QA spawn (ultra_lean_skipped; not a QA phase)
- compose_guards (non-negotiable): DO NOT reopen US-0147 ACs beyond packaging + fail-closed loader + pack/guard + patch republish; DO NOT add standalone/ to files; DO NOT allowlist entire scripts/; DO NOT inline/vendor lib into installer.py; DO NOT merge/drain BUG-0022 or BUG-0024; DO NOT wipe R-0148 / mutate # US-0148; DO NOT read .env; DO NOT mark BUG-0025 DONE; DO NOT tick AC; DO NOT npm-publish from execute without RELEASE_PUBLISH_MODE path; DO NOT git push; DEC-0038 tuple unamended
- first_execute_task: T-anch (NO-OP / verification)
- key_locked_artifacts: package.json files entry; installer.py loader+wrappers; tests/bug0025_packaging_contract_test.py; optional scripts/guard_installer_publish.py; packaging twins; release notes
- sprint_id_lock: S0157 (S0156=US-0148 released). Do not invent a new id.
- runtime_proof_id: rp-auto-20260918-bug0025-sprint-plan-techlead-20260918T170500Z-BUG-0025
- proof_hash: FD61C0131290781C96BA46C0D44980CC445C89174047DCFC2B5F4F714CCB3A22
- proof_ttl: 2026-09-18T18:05:00Z
- consumed_architecture_proof: rp-auto-20260918-bug0025-architecture-techlead-20260918T170000Z-BUG-0025 / DA89597E0B3BD3F37E33AE7A83BFAFF70B4CD04EEDB22BDAE0D7C283FF09B8BE — RUNTIME_PROOF_VALID (MATCH before TTL 2026-09-18T18:00:00Z)
- next_scheduled_phase: /execute (role=dev)
- next_scheduled_role: dev
- next_sprint_macro: build+verify
- stop_condition: STOP after sprint-plan. Orchestrator MUST spawn /execute in fresh dev (BUG-0006). CROSS_MODEL_REVIEW=0 — do NOT spawn sovereign-critic or plan-verify from this tech-lead. Do NOT mark BUG-0025 DONE. Do NOT tick acceptance. Do NOT implement packages in sprint-plan phase.

---

## Sprint-plan handoff — US-0148 / S0156 — /execute (fresh dev, ultra_lean)

- sprint_id: S0156
- story_id: US-0148 (Status OPEN — authority docs/product/backlog.md)
- bug_id: (none)
- companion_dec: DEC-0148 Accepted (decisions/DEC-0148.md)
- research_anchor: R-0148 (DQ1–DQ10 LOCKED)
- architecture_anchor: docs/engineering/architecture.md # US-0148
- approach: A1 (A*) — `@its-magic/protocol` + `apps/daemon` loopback JSON-RPC/WebSocket + `OperatorTransport`/`DaemonTransport` + per-run SQLite event log + restart reconcile + twelve `test_us0148_*`; compose US-0146 operator facades (in-process doubles for `test_us0146_*`); US-0145 delivery OUT of daemon
- orchestrator_run_id: auto-20260917-us0148
- parent_orchestrator_run_id: auto-20260917-us0146
- fresh_context_marker: tl-US0148-sprintplan-20260917T213000Z-fresh
- timestamp: 2026-09-17T21:30:00Z (UTC)
- model_id: inherit (CROSS_MODEL_REVIEW=0)
- drain_story_index: 1 of 3
- backlog_drain_stories_remaining_budget: 2
- sprint_plan_verdict: PASS (SPRINT_PLAN_PASS)
- decision_gate: false
- sprint_status: PLANNED (backlog OPEN per US-0045 — not mutated, AC-1..AC-8 unchecked)
- task_count: 12 (T-anch + T-001..T-011, at SPRINT_MAX_TASKS=12 cap, no split, 1:1 architecture seeds)
- ac_surjective_map: AC-1→T-001; AC-2→T-002; AC-3→T-003,T-004,T-005,T-006; AC-4→T-002,T-005,T-007; AC-5→T-001,T-007; AC-6→T-008; AC-7→T-003,T-004,T-009; AC-8→T-010,T-011; DC→T-anch
- task_order: T-anch → T-001 → T-002 → T-003 → T-004 → T-005 → T-006 → T-007 → T-008 → T-009 → T-010 → T-011
- plan-verify: ultra_lean — NOT in resolved_phase_plan; skipped; no plan-verify QA spawn (`ultra_lean_skipped`; not a QA phase)
- compose_guards (non-negotiable): DO NOT duplicate workflow rules in daemon; DO NOT implement US-0145 delivery/deploy; DO NOT break US-0146 `test_us0146_*` (in-process transport); DO NOT rewrite CommandRouter/GateEngine; DO NOT restore auto.md; DO NOT add kit cli.json or plugin tui.json; DO NOT read .env; DO NOT reopen US-0133..US-0147 DONE; DO NOT mark US-0148 DONE; DO NOT tick AC; DO NOT npm-publish; DO NOT git push; DEC-0038 tuple unamended
- first_execute_task: T-anch (NO-OP / verification)
- key_locked_artifacts: standalone/packages/protocol; standalone/apps/daemon; runtime-core/src/daemon-client/; .its-magic/daemon/listen.json + client.token; docs/engineering/operator/daemon-protocol.md; twelve test_us0148_* contract tests
- sprint_id_lock: S0156 (S0155=US-0145 released). Do not invent a new id.
- runtime_proof_id: rp-auto-20260917-us0148-sprint-plan-techlead-20260917T213000Z-US-0148
- proof_hash: E9CED6541917EAFB8C9727E95E46AC57941165FC2C61017A0F9431E6E1A22A62
- proof_ttl: 2026-09-17T22:30:00Z
- consumed_architecture_proof: rp-auto-20260917-us0148-architecture-techlead-20260917T211400Z-US-0148 / AC546FD44FE347547D9DD92F79C906DC71B2212DD27969336F73F9475C48708D — RUNTIME_PROOF_VALID (MATCH before TTL 2026-09-17T22:14:00Z)
- next_scheduled_phase: /execute (role=dev)
- next_scheduled_role: dev
- next_sprint_macro: build+verify
- stop_condition: STOP after sprint-plan. Orchestrator MUST spawn /execute in fresh dev (BUG-0006). CROSS_MODEL_REVIEW=0 — do NOT spawn sovereign-critic or plan-verify from this tech-lead. Do NOT mark US-0148 DONE. Do NOT tick acceptance. Do NOT implement packages in sprint-plan phase.

---

## Sprint-plan handoff — US-0145 / S0155 — /execute (fresh dev, ultra_lean)

- sprint_id: S0155
- story_id: US-0145 (Status OPEN — authority docs/product/backlog.md)
- bug_id: (none)
- companion_dec: DEC-0145 Accepted (decisions/DEC-0145.md)
- research_anchor: R-0145 (DQ1–DQ10 LOCKED)
- architecture_anchor: docs/engineering/architecture.md # US-0145
- approach: A1 (A*) — nested `workflow/delivery/` + `runDeliveryOperation` + `delivery_runtime_bridge.py` + default-off parallel/healing flags + QA arbiter + ReleaseTargetAdapter registry + additive gates + bounded post-deploy healing; twelve `test_us0145_*`; compose US-0140 closure, US-0143 drain unchanged, US-0146 observe-only, US-0147 install paths
- orchestrator_run_id: auto-20260917-us0146
- parent_orchestrator_run_id: auto-20260913-us0144
- fresh_context_marker: tl-US0145-sprintplan-20260917T224500Z-fresh
- timestamp: 2026-09-17T22:45:00Z (UTC)
- model_id: inherit (CROSS_MODEL_REVIEW=0)
- drain_story_index: 3 of 3
- sprint_plan_verdict: PASS (SPRINT_PLAN_PASS)
- decision_gate: false
- sprint_status: PLANNED (backlog OPEN per US-0045 — not mutated, AC-1..AC-9 unchecked)
- task_count: 12 (T-anch + T-001..T-011, at SPRINT_MAX_TASKS=12 cap, no split, 1:1 architecture seeds)
- ac_surjective_map: AC-1→T-002,T-003; AC-2→T-005; AC-3→T-004; AC-4→T-006; AC-5→T-006,T-007,T-009; AC-6→T-008; AC-7→T-008,T-009; AC-8→T-010; AC-9→T-011; DC→T-anch
- task_order: T-anch → T-001 → T-002 → T-003 → T-004 → T-005 → T-006 → T-007 → T-008 → T-009 → T-010 → T-011
- plan-verify: ultra_lean — NOT in resolved_phase_plan; skipped; no plan-verify QA spawn (`ultra_lean_skipped`; not a QA phase)
- compose_guards (non-negotiable): DO NOT rewrite US-0143 CommandRouter/drain; DO NOT amend `RELEASE_GATE_ORDER` literal; DO NOT implement US-0148 daemon; DO NOT restore auto.md; DO NOT add kit cli.json or plugin tui.json; DO NOT read .env; DO NOT reopen US-0140..US-0147 DONE; DO NOT mutate US-0148 body; DO NOT mark US-0145 DONE; DO NOT tick AC; DO NOT npm-publish; DO NOT git push; DEC-0038 tuple unamended
- first_execute_task: T-anch (NO-OP / verification)
- key_locked_artifacts: runtime-core/src/workflow/delivery/*; kernel-bridge runDeliveryOperation; scripts/delivery_runtime_bridge.py; handoffs/deploy_results/deploy_results.jsonl; twelve test_us0145_* contract tests
- sprint_id_lock: S0155 (S0154=US-0147 released). Do not invent a new id.
- runtime_proof_id: rp-auto-20260917-us0146-sprint-plan-techlead-20260917T224500Z-US-0145
- proof_hash: 1D245D8D23B03B11DC8AF39FB6A6E5FCC59562510A2F4AA365D708E9ADF947BC
- proof_ttl: 2026-09-17T23:45:00Z
- consumed_architecture_proof: rp-auto-20260917-us0146-architecture-techlead-20260917T223000Z-US-0145 / 80F3C316829DD9A44996EE4BD61E4FF3AAC0FCF3DC276D02B7FC9585FDA5FBE9 — RUNTIME_PROOF_VALID (MATCH before TTL 2026-09-17T23:30:00Z)
- next_scheduled_phase: /execute (role=dev)
- next_scheduled_role: dev
- next_sprint_macro: build+verify
- stop_condition: STOP after sprint-plan. Orchestrator MUST spawn /execute in fresh dev (BUG-0006). CROSS_MODEL_REVIEW=0 — do NOT spawn sovereign-critic or plan-verify from this tech-lead. Do NOT mark US-0145 DONE. Do NOT tick acceptance. Do NOT implement packages in sprint-plan phase.

---

## Sprint-plan handoff — US-0147 / S0154 — /execute (fresh dev, ultra_lean)

- sprint_id: S0154
- story_id: US-0147 (Status OPEN — authority docs/product/backlog.md)
- bug_id: (none)
- companion_dec: DEC-0147 Accepted (decisions/DEC-0147.md)
- research_anchor: R-0144 (DQ1–DQ10 LOCKED)
- architecture_anchor: docs/engineering/architecture.md # US-0147
- approach: A1 (A*) — triple-installer parity + template `.its-magic/standalone/` mirror + `bootstrap_standalone_runtime_installer_hook` + adoption classifier + kernel preflight + `runtime-metadata.json` + explicit `itsm setup browser`; ten `test_us0147_*`; compose US-0146 CLI/TUI (wire only)
- orchestrator_run_id: auto-20260917-us0146
- parent_orchestrator_run_id: auto-20260913-us0144
- fresh_context_marker: tl-US0147-sprintplan-20260917T205000Z-fresh
- timestamp: 2026-09-17T20:50:00Z (UTC)
- model_id: inherit (CROSS_MODEL_REVIEW=0)
- drain_story_index: 2 of 3
- sprint_plan_verdict: PASS (SPRINT_PLAN_PASS)
- decision_gate: false
- sprint_status: PLANNED (backlog OPEN per US-0045 — not mutated, AC-1..AC-8 unchecked)
- task_count: 12 (T-anch + T-001..T-011, at SPRINT_MAX_TASKS=12 cap, no split, 1:1 architecture seeds)
- ac_surjective_map: AC-1→T-001,T-002,T-005,T-006,T-007,T-008; AC-2→T-004; AC-3→T-003; AC-4→T-003; AC-5→T-004,T-005; AC-6→T-006; AC-7→T-008,T-009,T-010; AC-8→T-011; DC→T-anch
- task_order: T-anch → T-001 → T-002 → T-003 → T-004 → T-005 → T-006 → T-007 → T-008 → T-009 → T-010 → T-011
- plan-verify: ultra_lean — NOT in resolved_phase_plan; skipped; plan-verify.json SKIPPED placeholder (`ultra_lean_skipped`; not a QA phase)
- compose_guards (non-negotiable): DO NOT rewrite `runtime-core/src/operator/`; DO NOT install US-0148 daemon; DO NOT rewrite host `.cursor/` / `.opencode/`; DO NOT restore auto.md; DO NOT add kit cli.json or plugin tui.json; DO NOT read .env; DO NOT reopen US-0140..US-0146 DONE; DO NOT mutate US-0145/0148 bodies; DO NOT mark US-0147 DONE; DO NOT tick AC; DO NOT npm-publish; DO NOT git push; DEC-0038 tuple unamended
- first_execute_task: T-anch (NO-OP / verification)
- key_locked_artifacts: installer.py/ps1/sh; installer-owned-paths.manifest; template/.its-magic/standalone/; ten test_us0147_* fixtures
- sprint_id_lock: S0154 (S0153=US-0146 released). Do not invent a new id.
- runtime_proof_id: rp-auto-20260917-us0146-sprint-plan-techlead-20260917T205000Z-US-0147
- proof_hash: 71466A385CB3FFA1503D35BAA34BD51CD8A592C2038D8570762DCB32D3EBF9A5
- proof_ttl: 2026-09-17T21:50:00Z
- consumed_architecture_proof: rp-auto-20260917-us0146-architecture-techlead-20260917T204000Z-US-0147 / 90A68CD12FB24348890E4DCE47CDCE639736C67C6D91F3914542BFF282A366AD — RUNTIME_PROOF_VALID (MATCH before TTL 2026-09-17T21:40:00Z)
- next_scheduled_phase: /execute (role=dev)
- next_scheduled_role: dev
- stop_condition: STOP after sprint-plan. Orchestrator MUST spawn /execute in fresh dev (BUG-0006). CROSS_MODEL_REVIEW=0 — do NOT spawn sovereign-critic or plan-verify from this tech-lead. Do NOT mark US-0147 DONE. Do NOT tick acceptance. Do NOT implement packages in sprint-plan phase.

---

## Sprint-plan handoff — US-0146 / S0153 — /execute (fresh dev, ultra_lean)

- sprint_id: S0153
- story_id: US-0146 (Status OPEN — authority docs/product/backlog.md)
- bug_id: (none)
- companion_dec: DEC-0146 Accepted (decisions/DEC-0146.md)
- research_anchor: R-0143 (DQ1–DQ10 LOCKED)
- architecture_anchor: docs/engineering/architecture.md # US-0146
- approach: A1 (A*) — sibling `@its-magic/cli` + `@its-magic/tui` thin clients of `runtime-core/src/operator/` facades; nine `test_us0146_*`; Pi only on auth/models; in-process OperatorSession; log cap 200/32KiB; TUI readline+ANSI
- orchestrator_run_id: auto-20260917-us0146
- parent_orchestrator_run_id: auto-20260913-us0144
- fresh_context_marker: tl-US0146-sprintplan-20260917T190000Z-fresh
- timestamp: 2026-09-17T19:00:00Z (UTC)
- model_id: inherit (CROSS_MODEL_REVIEW=0)
- sprint_plan_verdict: PASS (SPRINT_PLAN_PASS)
- decision_gate: false
- sprint_status: PLANNED (backlog OPEN per US-0045 — not mutated, AC-1..AC-8 unchecked)
- task_count: 12 (T-anch + T-001..T-011, at SPRINT_MAX_TASKS=12 cap, no split, 1:1 architecture seeds)
- ac_surjective_map: AC-1→T-002,T-003,T-009; AC-2→T-004; AC-3→T-005; AC-4→T-010; AC-5→T-006; AC-6→T-007; AC-7→T-008; AC-8→T-008,T-009,T-010,T-011; DC→T-anch
- task_order: T-anch → T-001 → T-002 → T-003 → T-004 → T-005 → T-006 → T-007 → T-008 → T-009 → T-010 → T-011
- plan-verify: ultra_lean — NOT in resolved_phase_plan; skipped; plan-verify.json SKIPPED placeholder (`ultra_lean_skipped`; not a QA phase)
- compose_guards (non-negotiable): DO NOT rewrite WorkflowEngine/CommandRouter/GateEngine; DO NOT import Pi on workflow/TUI/observability paths (auth/models only); DO NOT restore auto.md; DO NOT add kit cli.json or plugin tui.json; DO NOT read .env; DO NOT reopen US-0140..US-0144 DONE; DO NOT mutate US-0145/0147/0148 bodies; DO NOT mark US-0146 DONE; DO NOT tick AC; DO NOT npm-publish; DO NOT git push; DEC-0038 tuple unamended
- first_execute_task: T-anch (NO-OP / verification)
- key_locked_artifacts: runtime-core/src/operator/*; standalone/apps/cli; standalone/apps/tui (new); nine test_us0146_* contract tests
- sprint_id_lock: S0153 (S0146=BUG-0021). Do not invent a new id.
- runtime_proof_id: rp-auto-20260917-us0146-sprint-plan-techlead-20260917T190000Z-US-0146
- proof_hash: EBCD4602E5B769D72298C7305EB819963A9DD9EC55A075634E35B1F055118524
- proof_ttl: 2026-09-17T20:00:00Z
- consumed_architecture_proof: rp-auto-20260917-us0146-architecture-techlead-20260917T185000Z-US-0146 / 5CD3C53F4B194541E3182C1DC53FE3D0C83FE3BEF986B10B509F922E5ED829F1 — RUNTIME_PROOF_VALID (MATCH before TTL 2026-09-17T19:50:00Z)
- next_scheduled_phase: /execute (role=dev)
- next_scheduled_role: dev
- stop_condition: STOP after sprint-plan. Orchestrator MUST spawn /execute in fresh dev (BUG-0006). CROSS_MODEL_REVIEW=0 — do NOT spawn sovereign-critic or plan-verify from this tech-lead. Do NOT mark US-0146 DONE. Do NOT tick acceptance. Do NOT implement packages in sprint-plan phase.

---

## Sprint-plan handoff - US-0144 / S0152 - sovereign-critic (sprint-plan) then /execute (fresh dev, ultra_lean)

- sprint_id: S0152
- story_id: US-0144 (Status OPEN - authority docs/product/backlog.md)
- bug_id: (none)
- companion_dec: DEC-0144 Accepted (decisions/DEC-0144.md)
- research_anchor: R-0142 (DQ1-DQ10 LOCKED, do not wipe R-0141; R-0141 remains US-0143)
- architecture_anchor: docs/engineering/architecture.md # US-0144
- approach: Nested SovereignRuntime in @its-magic/runtime-core; closed 9-op KernelBridge.runSovereignOperation including deferral_append/deferral_list; SOVEREIGN_RUNTIME=0 default-off; US-0143 drain/GateEngine unamended at SR=0; 12 architecture-owned test_us0144_*; four CROSS_MODEL_REVIEW x SOVEREIGN_RUNTIME quadrants bound inside the twelve
- orchestrator_run_id: auto-20260913-us0144
- parent_orchestrator_run_id: auto-20260913-us0143
- fresh_context_marker: tl-US0144-sprintplan-20260915T190058Z-fresh
- timestamp: 2026-09-15T19:00:58Z (UTC)
- model_id: cursor-grok-4.6-high (CROSS_MODEL_REVIEW=1 - required on isolation)
- sprint_plan_verdict: PASS
- decision_gate: false
- sprint_status: PLANNED (backlog OPEN per US-0045 - not mutated, AC-1..AC-8 unchecked)
- task_count: 11 (T-anch + T-001..T-010, within SPRINT_MAX_TASKS=12, no split, 1:1 architecture seeds)
- ac_surjective_map: AC-1->T-001,T-002,T-006 (T-010 m1,m2,m7,m8); AC-2->T-003,T-004 (T-010 m3,m4); AC-3->T-005 (T-010 m6); AC-4->T-004 (T-010 m5); AC-5->T-007 (T-010 m9,m10); AC-6->T-008 (T-010 m11); AC-7->T-008 (T-010 m12); AC-8->T-009,T-010 (m1-m12 + Q00/Q10/Q01/Q11); DC->T-anch
- flag_quadrants: Q00=test_us0144_memory_bounds_default_off; Q10=test_us0144_caps_progress_partial_delivery_boundaries; Q01=test_us0144_pre_spawn_context_order; Q11=test_us0144_model_collision_degraded
- task_order: T-anch -> T-001 -> T-002 -> T-003 -> T-004 -> T-005 -> T-006 -> T-007 -> T-008 -> T-009 -> T-010
- plan-verify: ultra_lean - NOT in resolved_phase_plan, skipped, plan-verify.json is a SKIPPED placeholder (reason=ultra_lean_skipped; not a QA phase)
- compose_guards (non-negotiable): DO NOT amend AgentKernel isolation loader / noTools / KernelBridge validator allowlist / auth-models store / PolicyEngine tables / RoleCatalog internals / config loaders except additive runSovereignOperation, DO NOT import Pi, DO NOT add sibling sovereign package, DO NOT restore auto.md, DO NOT rewrite GateEngine RELEASE_GATE_ORDER, DO NOT extend compute_strict_proof_hash, DO NOT rewrite US-0143 drain, DO NOT own credentials or read .env, DO NOT wipe R-0141/R-0142, DO NOT reopen US-0133..US-0143, DO NOT mutate US-0145+ or BUG-* or S0146..S0151, DO NOT mark US-0144 DONE, DO NOT tick AC-1..AC-8, DO NOT mutate intake JSON, DO NOT npm-publish, DO NOT git push
- critic_nb_execute_awareness:
  - T-010: assert Q00/Q10/Q01/Q11 on named primary markers; nine-op set; default-off; gateDrainCandidate exclusive for sovereign-generated candidates; credentials OUT (NB1 closed this phase)
  - T-anch..T-010: keep 1:1 architecture seeds, sprint folder is S0152, execute owns bridge + runtime-core lift + 12 tests (NB2)
  - T-anch: NO-OP verification, do not add 13th test, do not add sibling package, do not restore auto.md, do not mark DONE, do not design US-0145+ (NB3)
- first_execute_task: T-anch (NO-OP / verification)
- key_locked_artifacts:
  - nested SovereignRuntime in existing @its-magic/runtime-core (no sibling package, no Pi)
  - KernelBridge.runSovereignOperation 9-op closed set
  - scripts/sovereign_runtime_bridge.py
  - sidecar handoffs/sovereign_decision_sessions/<run>.jsonl
  - gateDrainCandidate exclusive for US-0144 sovereign-generated candidates
  - 12 test_us0144_* (architecture-owned IDs)
- sprint_id_lock: S0152 (S0146=BUG-0021, S0147=US-0140, S0148=BUG-0023, S0149=US-0141, S0150=US-0142, S0151=US-0143). Do not reuse. Do not invent a new id.
- runtime_proof_id: rp-auto-20260913-us0144-sprint-plan-techlead-20260915T190058Z-US-0144
- proof_hash: 066EE36FB0930C2329F33590FD2508B233596EC59437D35EEA4BF4EE64C5E60D
- proof_ttl: 2026-09-15T20:00:58Z
- consumed_architecture_proof: rp-auto-20260913-us0144-architecture-techlead-20260915T185104Z-US-0144 / EA5C872E25AF1F03D79F10C7BF371E55993C7440A4A802BFD6E89505C8548BCD - RUNTIME_PROOF_VALID (MATCH before TTL 2026-09-15T19:51:04Z)
- consumed_critic_proof: rp-auto-20260913-us0144-sovereign-critic-techlead-20260915T185540Z-US-0144 / 46611DA8682735C7EEBF308F513C065B08A10AD28BD26E32359FCA8B24E4B476 - MATCH, anti_slop=10, 0 blocking, degraded_mode=false, findings us0144arc-* informational; NB1 flag-quadrant binding closed this phase
- next_scheduled_phase: sovereign-critic (sprint-plan) then /execute (role=dev)
- next_scheduled_role: tech-lead (critic), then dev
- stop_condition: STOP after sprint-plan. Orchestrator MUST spawn sovereign-critic of sprint-plan (CROSS_MODEL_REVIEW=1) then MUST spawn /execute in fresh dev (BUG-0006). Do NOT spawn execute, plan-verify, or critic from this tech-lead. Do NOT mark US-0144 DONE. Do NOT tick acceptance. Do NOT reopen US-0133..US-0143. Do NOT mutate US-0145+ or S0146..S0151. Do NOT implement packages this phase.

---

## Sprint-plan handoff - US-0143 / S0151 - sovereign-critic (sprint-plan) then /execute (fresh dev, ultra_lean)

- sprint_id: S0151
- story_id: US-0143 (Status OPEN - authority docs/product/backlog.md)
- bug_id: (none)
- companion_dec: DEC-0143 Accepted (decisions/DEC-0143.md)
- research_anchor: R-0141 (DQ1-DQ10 LOCKED, do not wipe R-0120..R-0141; R-0139 remains US-0142; R-0138 remains US-0141; R-0140 remains BUG-0024)
- architecture_anchor: docs/engineering/architecture.md # US-0143
- approach: A1 LOCKED - CommandRouter implements deferred /auto /quick inside @its-magic/runtime-core (no Pi); nested DeliveryRouter; WorkflowEngine owns drain; GateEngine unamended; YAML stop-matrix consume; TS L8 adapter; five independent axes; AC-6 non-relaxable under full; 12 test_us0143_*; reject A2-A15
- orchestrator_run_id: auto-20260913-us0143
- parent_orchestrator_run_id: auto-20260913-us0142
- fresh_context_marker: tl-US0143-sprintplan-20260914T073000Z-fresh
- timestamp: 2026-09-14T07:30:00Z (UTC)
- model_id: cursor-grok-4.6-high (CROSS_MODEL_REVIEW=1 - required on isolation)
- sprint_plan_verdict: PASS
- decision_gate: false
- sprint_status: PLANNED (backlog OPEN per US-0045 - not mutated, AC-1..AC-8 unchecked)
- task_count: 11 (T-anch + T-001..T-010, within SPRINT_MAX_TASKS=12, no split, 1:1 architecture seeds)
- ac_surjective_map: AC-1->T-001,T-005,T-009 (T-010 m1-m2); AC-2->T-002,T-004 (T-010 m3-m5); AC-3->T-003 (T-010 m6-m7); AC-4->T-002,T-007 (T-010 m8); AC-5->T-005,T-006 (T-010 m9); AC-6->T-007 (T-010 m10); AC-7->T-008 (T-010 m11); AC-8->T-010 (m12); DC->T-anch
- task_order: T-anch -> T-001 -> T-002 -> T-003 -> T-004 -> T-005 -> T-006 -> T-007 -> T-008 -> T-009 -> T-010
- plan-verify: ultra_lean - NOT in resolved_phase_plan, skipped, plan-verify.json is a SKIPPED placeholder (reason=ultra_lean_not_in_resolved_phase_plan; not a QA phase)
- compose_guards (non-negotiable): DO NOT amend AgentKernel isolation loader / noTools / KernelBridge / auth-models store / PolicyEngine tables / RoleCatalog internals / config loaders, DO NOT import Pi, DO NOT add sibling auto-scheduler, DO NOT restore auto.md, DO NOT rewrite GateEngine RELEASE_GATE_ORDER, DO NOT extend compute_strict_proof_hash, DO NOT implement US-0144 critic content, DO NOT drain BUG-0024, DO NOT own credentials or read .env, DO NOT rewrite DEC-0133..0142 bodies, DO NOT wipe R-0120..R-0141, DO NOT reopen US-0133..US-0142, DO NOT mutate US-0144+ or BUG-0021/S0146 or BUG-0022 or BUG-0023/S0148 or S0149 or S0150, DO NOT mark US-0143 DONE, DO NOT tick AC-1..AC-8, DO NOT mutate intake JSON, DO NOT run live paid CI, DO NOT npm-publish, DO NOT git push
- critic_nb_execute_awareness:
  - T-001/T-003/T-007/T-010: AC-6 terminals locked, compose-amend test_us0140_command_coverage, L8 golden vs Python, RouteScheduled vs 7-step, full cannot relax AC-6, credentials OUT (NB1)
  - T-anch..T-010: keep 1:1 architecture seeds, sprint folder is S0151 (S0150 occupied by US-0142), execute owns runtime-core lift + 12 tests, US-0144 content deferred (NB2)
  - T-anch: NO-OP verification, reject A2-A15, do not amend isolation/noTools/KernelBridge/PolicyEngine tables, do not mark DONE, do not design US-0144+, do not drain BUG-0024, do not own credentials (NB3)
- first_execute_task: T-anch (NO-OP / verification)
- key_locked_artifacts:
  - existing @its-magic/runtime-core (no sibling package, no Pi)
  - nested workflow/delivery-router.ts
  - CommandRouter RouteScheduled for /auto /quick
  - WorkflowEngine runAuto / runQuick
  - GateEngine RELEASE_GATE_ORDER unamended
  - YAML stop-matrix consume + AC-6 additive security_hard
  - TS L8 adapter + golden vectors
  - 12 test_us0143_*
- sprint_id_lock: S0151 (S0146=BUG-0021, S0147=US-0140, S0148=BUG-0023, S0149=US-0141, S0150=US-0142). Do not reuse.
- runtime_proof_id: rp-auto-20260913-us0143-sprint-plan-techlead-20260914T073000Z-US-0143
- proof_hash: 63708536512D56BA8B5497D2C082299E4376DD495B12388125500454CACF46BE
- proof_ttl: 2026-09-14T08:30:00Z
- consumed_architecture_proof: rp-auto-20260913-us0143-architecture-techlead-20260914T071000Z-US-0143 / 6FF1DB37B91284FDE90C5EC7058FF518605D49525BD8FACECB5AC570284F26E5 - RUNTIME_PROOF_VALID (MATCH before TTL 2026-09-14T08:10:00Z)
- consumed_critic_proof: rp-auto-20260913-us0143-sovereign-critic-techlead-20260914T072000Z-US-0143 / D82C4ED7A5FFA6B6E63139AE250850C13B1945A6FDC20BB64394B76DA2E7E65F - MATCH, anti_slop=10, 0 blocking, degraded_mode=false, findings us0143arc-* informational
- next_scheduled_phase: sovereign-critic (sprint-plan) then /execute (role=dev)
- next_scheduled_role: tech-lead (critic), then dev
- stop_condition: STOP after sprint-plan. Orchestrator MUST spawn sovereign-critic of sprint-plan (CROSS_MODEL_REVIEW=1) then MUST spawn /execute in fresh dev (BUG-0006). Do NOT spawn execute, plan-verify, or critic from this tech-lead. Do NOT mark US-0143 DONE. Do NOT tick acceptance. Do NOT reopen US-0133..US-0142. Do NOT mutate US-0144+ or S0146/S0147/S0148/S0149/S0150. Do NOT implement packages this phase.

---

## Sprint-plan handoff - US-0142 / S0150 - sovereign-critic (sprint-plan) then /execute (fresh dev, ultra_lean)

- sprint_id: S0150
- story_id: US-0142 (Status OPEN - authority docs/product/backlog.md)
- bug_id: (none)
- companion_dec: DEC-0142 Accepted (decisions/DEC-0142.md)
- research_anchor: R-0139 (DQ1-DQ10 LOCKED, do not wipe R-0120..R-0139; R-0138 remains US-0141; R-0136/R-0137 remain BUG-0023)
- architecture_anchor: docs/engineering/architecture.md # US-0142
- approach: A1 LOCKED - sibling @its-magic/browser-uat (no Pi) composing US-0141 connectHandoff; Playwright isolated launch+newContext + typed CDP connectOverCDP/disconnect (dedicated profile; default Chrome forbidden); promote itsm_browser; additive UAT_BROWSER_PROBE_MODE=owned; fail-closed BROWSER_*/UAT_*; BROWSER_RETRY_MAX default 2; 12 test_us0142_*; reject A2-A15
- orchestrator_run_id: auto-20260913-us0142
- parent_orchestrator_run_id: auto-20260913-us0141
- fresh_context_marker: tl-US0142-sprintplan-20260914T041000Z-fresh
- timestamp: 2026-09-14T04:10:00Z (UTC)
- model_id: cursor-grok-4.6-high (CROSS_MODEL_REVIEW=1 - required on isolation)
- sprint_plan_verdict: PASS
- decision_gate: false
- sprint_status: PLANNED (backlog OPEN per US-0045 - not mutated, AC-1..AC-8 unchecked)
- task_count: 11 (T-anch + T-001..T-010, within SPRINT_MAX_TASKS=12, no split, 1:1 architecture seeds)
- ac_surjective_map: AC-1->T-001,T-002,T-003 (T-010 m1-m3); AC-2->T-004 (T-010 m4); AC-3->T-005 (T-010 m5,m6); AC-4->T-006 (T-010 m7); AC-5->T-008 (T-010 m3,m10); AC-6->T-007 (T-010 m9); AC-7->T-006 (T-010 m8); AC-8->T-009 (T-010 m11,m12); DC->T-anch
- task_order: T-anch -> T-001 -> T-002 -> T-003 -> T-004 -> T-005 -> T-006 -> T-007 -> T-008 -> T-009 -> T-010
- plan-verify: ultra_lean - NOT in resolved_phase_plan, skipped, plan-verify.json is a SKIPPED placeholder (reason=ultra_lean_not_in_resolved_phase_plan; not a QA phase)
- compose_guards (non-negotiable): DO NOT amend AgentKernel isolation loader / noTools / KernelBridge / auth-models store / PolicyEngine path/shell/secret tables (promote itsm_browser only) / RoleCatalog internals / config loaders, DO NOT import Pi in browser-uat, DO NOT extend compute_strict_proof_hash, DO NOT reimplement AppRuntime/ProcessManager/ExecutionBackend, DO NOT implement /auto /quick drain (US-0143), DO NOT ship pixel visual baseline, DO NOT own credentials or read .env, DO NOT attach default Chrome User Data, DO NOT browser.close() after CDP as default teardown, DO NOT weaken kit UAT_PROBE_FORBIDDEN, DO NOT rewrite DEC-0133..0141 bodies, DO NOT wipe R-0120..R-0139, DO NOT reopen US-0133..US-0141, DO NOT mutate US-0143+ or BUG-0021/S0146 or BUG-0022 or BUG-0023/S0148 or S0149, DO NOT mark US-0142 DONE, DO NOT tick AC-1..AC-8, DO NOT mutate intake JSON, DO NOT run live paid CI, DO NOT restore auto.md
- critic_nb_execute_awareness:
  - T-002/T-003/T-006/T-007/T-008/T-010: BROWSER_* / UAT_* fail-closed, Chrome 136+ default profile forbidden, traces/HAR redact, CDP disconnect not close, BROWSER_RETRY_MAX orthogonal, credentials OUT, pixel OUT (NB1)
  - T-anch..T-010: keep 1:1 architecture seeds, sprint folder is S0150 (S0149 occupied by US-0141), execute owns browser-uat + 12 tests, compose US-0141 connectHandoff, US-0143/pixel deferred (NB2)
  - T-anch: NO-OP verification, reject A2-A15, do not amend isolation/noTools/KernelBridge/PolicyEngine tables, do not mark DONE, do not design US-0143+, do not own credentials (NB3)
- first_execute_task: T-anch (NO-OP / verification)
- key_locked_artifacts:
  - standalone/packages/browser-uat (@its-magic/browser-uat, no Pi)
  - BrowserUAT facade + isolated Playwright driver + typed CDP adapter
  - consume connectHandoff; AppRuntime not rewritten
  - promote itsm_browser typed actions; ToolBroker delegates to BrowserUAT
  - additive UAT_BROWSER_PROBE_MODE=owned; kit cursor default held
  - evidence schema + redaction + gitignored traces
  - BROWSER_RETRY_MAX default 2
  - 12 test_us0142_*
- sprint_id_lock: S0150 (S0146=BUG-0021, S0147=US-0140, S0148=BUG-0023, S0149=US-0141). Do not reuse.
- runtime_proof_id: rp-auto-20260913-us0142-sprint-plan-techlead-20260914T041000Z-US-0142
- proof_hash: 4F3D2D0DD9ADF5E18221DD2CF7169103F4DE4AD90CC2C88E38104E7A3C6182BA
- proof_ttl: 2026-09-14T05:10:00Z
- consumed_architecture_proof: rp-auto-20260913-us0142-architecture-techlead-20260914T035000Z-US-0142 / 52A720174CB9E0D35507ED9683ED70D22D72A5D9E757A5CF1170B2AC304B3175 - RUNTIME_PROOF_VALID (MATCH before TTL 2026-09-14T04:50:00Z)
- consumed_critic_proof: rp-auto-20260913-us0142-sovereign-critic-techlead-20260914T040000Z-US-0142 / FD58C34EB6D949E85F1E7C5866AA9FA8EA19CB24FAD3D7D7ED2DF210E72B65E4 - MATCH, anti_slop=10, 0 blocking, degraded_mode=false, findings us0142arc-* informational
- next_scheduled_phase: sovereign-critic (sprint-plan) then /execute (role=dev)
- next_scheduled_role: tech-lead (critic), then dev
- stop_condition: STOP after sprint-plan. Orchestrator MUST spawn sovereign-critic of sprint-plan (CROSS_MODEL_REVIEW=1) then MUST spawn /execute in fresh dev (BUG-0006). Do NOT spawn execute, plan-verify, or critic from this tech-lead. Do NOT mark US-0142 DONE. Do NOT tick acceptance. Do NOT reopen US-0133..US-0141. Do NOT mutate US-0143+ or S0146/S0147/S0148/S0149. Do NOT implement packages this phase.

---

## Sovereign-critic handoff — BUG-0023 / S0148 qa CRITIC_PASS → `/verify-work` (fresh qa, ultra_lean)

- sprint_id: S0148
- story_id: (none — bug segment)
- bug_id: BUG-0023 (Status OPEN — authority docs/product/backlog.md)
- companion_dec: none (cite R-0137; compose DEC-0124 / DEC-0125 / DEC-0120 / DEC-0132)
- research_anchor: R-0137 (DQ1–DQ8 LOCKED; do not wipe)
- architecture_anchor: docs/engineering/architecture.md # BUG-0023 (UNCHANGED)
- approach: Axis A LOCKED held — shared Rpc.define rpc.ts; await ctx.rpc.register(Defined, { runAutoLifecycle }); dispatchRunAutoLifecycle dynamic-import → client.rpc(Defined) / OpenCode.make fallback; invented POST removed; DISPATCH only when client/RPC truly absent; keep { id, tui } + editor.add; auto.md not restored
- orchestrator_run_id: auto-20260913-bug0023
- parent_orchestrator_run_id: cursor-20260913-BUG0023-intake
- reviewed_phase_id: qa
- producer_role: qa
- critic_role: tech-lead
- fresh_context_marker: tl-BUG0023-critic-qa-20260914T005000Z-fresh
- timestamp: 2026-09-14T00:50:00Z (UTC)
- producer_model_id: cursor-grok-4.6-high
- critic_model_id: composer-2.5
- degraded_mode: false
- critic_verdict: CRITIC_PASS
- decision_gate: false
- anti_slop_aggregate: 10
- blocking_count: 0
- rework_generation: 0
- finding_ids: bug0023qa-challenger-001, bug0023qa-architect-002, bug0023qa-subtractor-003
- independent_pytest: 37 passed in 0.77s (bug0023 8/8; bug0021 8/8; bug0020 8/8; bug0019 7/7; bug0018 6/6)
- parity: [INTAKE_TEMPLATE_PARITY_OK] --scope bug-0023
- sovereign_critic_validate: [SOVEREIGN_CRITIC_VALIDATION_OK]
- consumed_qa_proof: rp-auto-20260913-bug0023-qa-qa-20260914T004500Z-BUG-0023 / AC810B53913132F5B0A5F256DC3689AF80F95EFD065682A24443C4A8A180E850 — MATCH; TTL 2026-09-14T01:45:00Z
- runtime_proof_id: rp-auto-20260913-bug0023-sovereign-critic-techlead-20260914T005000Z-BUG-0023
- proof_hash: CB3E4D8EB2E7C1B56919FCE7AAB69D3211701FD7284E636B4D47C02AAAFE4E8F
- proof_ttl: 2026-09-14T01:50:00Z
- backlog_status: OPEN
- acceptance_BUG-0023: unchecked
- backlog_acs: AC-1..AC-9 ticked (slice; AC-1 mock+inspection; live CLI TUI not probed)
- live_opencode_cli_tui_pass_claimed: false
- sibling_boundary: BUG-0021 DONE not reopened; BUG-0020/0019/0018 DONE compose-only; BUG-0022 OPEN not mutated; US-0141 not mutated
- next_scheduled_phase: /verify-work (role=qa)
- next_scheduled_role: qa
- stop_condition: STOP after CRITIC_PASS. Orchestrator MUST spawn /verify-work in fresh qa (BUG-0006). Do NOT spawn verify-work from this critic. Do NOT rework qa. Do NOT mark BUG-0023 DONE. Do NOT tick acceptance. Do NOT reopen BUG-0021. Do NOT mutate BUG-0022 / US-0141. Do NOT restore auto.md. Do NOT claim live CLI TUI PASS.

### critic_evidence

```json
{
  "producer_model_id": "cursor-grok-4.6-high",
  "critic_model_id": "composer-2.5",
  "anti_slop_aggregate": 10,
  "rework_generation": 0,
  "blocking_count": 0,
  "degraded_mode": false,
  "finding_ids": ["bug0023qa-challenger-001", "bug0023qa-architect-002", "bug0023qa-subtractor-003"],
  "independent_checks": [
    "qa proof SHA-256 MATCH+not-STALE",
    "pytest 37/37 critic re-run",
    "parity bug-0023 OK",
    "acceptance BUG-0023 unchecked",
    "backlog AC-1..AC-9 slice ticks honest",
    "BUG-0021 DONE not reopened",
    "live_opencode_cli_tui_pass_claimed=false",
    "sovereign_critic_validate.py --enforce PASS"
  ]
}
```

---

## Sovereign-critic handoff — BUG-0023 / S0148 execute CRITIC_PASS → `/qa` (fresh qa, ultra_lean)

- sprint_id: S0148
- story_id: (none — bug segment)
- bug_id: BUG-0023 (Status OPEN — authority docs/product/backlog.md)
- companion_dec: none (cite R-0137; compose DEC-0124 / DEC-0125 / DEC-0120 / DEC-0132)
- research_anchor: R-0137 (DQ1–DQ8 LOCKED; do not wipe)
- architecture_anchor: docs/engineering/architecture.md # BUG-0023 (UNCHANGED)
- approach: Axis A LOCKED held — shared Rpc.define rpc.ts; await ctx.rpc.register(Defined, { runAutoLifecycle }); dispatchRunAutoLifecycle dynamic-import → client.rpc(Defined) / OpenCode.make fallback; invented POST removed; DISPATCH only when client/RPC truly absent; keep { id, tui } + editor.add; auto.md not restored
- orchestrator_run_id: auto-20260913-bug0023
- parent_orchestrator_run_id: cursor-20260913-BUG0023-intake
- reviewed_phase_id: execute
- producer_role: dev
- critic_role: tech-lead
- fresh_context_marker: tl-BUG0023-critic-execute-20260914T004000Z-fresh
- timestamp: 2026-09-14T00:40:00Z (UTC)
- producer_model_id: cursor-grok-4.6-high
- critic_model_id: composer-2.5
- degraded_mode: false
- critic_verdict: CRITIC_PASS
- decision_gate: false
- anti_slop_aggregate: 10
- blocking_count: 0
- rework_generation: 0
- finding_ids: bug0023ex-challenger-001, bug0023ex-architect-002, bug0023ex-subtractor-003
- independent_pytest: 37 passed in 0.76s (bug0023 8/8; bug0021 8/8; bug0020 8/8; bug0019 7/7; bug0018 6/6)
- parity: [INTAKE_TEMPLATE_PARITY_OK] --scope bug-0023
- metadata: exit 0
- sovereign_critic_validate: [SOVEREIGN_CRITIC_VALIDATION_OK]
- consumed_execute_proof: rp-auto-20260913-bug0023-execute-dev-20260914T003500Z-BUG-0023 / 9D6731CDE1E53798FC7637915B93F0519DC23C5723C0E480713CFA259C680980 — MATCH; TTL 2026-09-14T01:35:00Z
- runtime_proof_id: rp-auto-20260913-bug0023-sovereign-critic-techlead-20260914T004000Z-BUG-0023
- proof_hash: C9E2EBDB463F6A90F819DCCD8D89F5F30665DC9FB22CD1D0826B7CD169554ACB
- proof_ttl: 2026-09-14T01:40:00Z
- next_scheduled_phase: /qa (role=qa)
- next_scheduled_role: qa
- stop_condition: STOP after CRITIC_PASS. Orchestrator MUST spawn /qa in fresh qa (BUG-0006). Do NOT spawn qa from this critic. Do NOT rework execute. Do NOT mark BUG-0023 DONE. Do NOT tick acceptance. Do NOT reopen BUG-0021. Do NOT mutate BUG-0022 / US-0141. Do NOT restore auto.md.

### critic_evidence

```json
{
  "producer_model_id": "cursor-grok-4.6-high",
  "critic_model_id": "composer-2.5",
  "anti_slop_aggregate": 10,
  "rework_generation": 0,
  "degraded_mode": false,
  "findings_path": "handoffs/sovereign_critic_findings.jsonl",
  "finding_ids": ["bug0023ex-challenger-001", "bug0023ex-architect-002", "bug0023ex-subtractor-003"],
  "verdict": "PASS",
  "blocking_count": 0,
  "reviewed_phase_id": "execute"
}
```

---
## Sprint-plan handoff - US-0141 / S0149 - sovereign-critic (sprint-plan) then /execute (fresh dev, ultra_lean)

- sprint_id: S0149
- story_id: US-0141 (Status OPEN - authority docs/product/backlog.md)
- bug_id: (none)
- companion_dec: DEC-0141 Accepted (decisions/DEC-0141.md)
- research_anchor: R-0138 (DQ1-DQ10 LOCKED, do not wipe R-0120..R-0138; R-0137 remains BUG-0023)
- architecture_anchor: docs/engineering/architecture.md # US-0141
- approach: A1 LOCKED - sibling @its-magic/app-runtime (no Pi) composing runtime-core RunsStore; AppRuntime + ProcessManager + CLI-first local+docker + WSL/SSH adapters; AppRuntime-owned restart (HEALTHCHECK status-only); stack profiles; Connect handoff no browser; 12 test_us0141_*; reject A2-A14
- orchestrator_run_id: auto-20260913-us0141
- parent_orchestrator_run_id: auto-20260913-us0140
- fresh_context_marker: tl-US0141-sprintplan-20260914T005000Z-fresh
- timestamp: 2026-09-14T00:50:00Z (UTC)
- model_id: cursor-grok-4.6-high (CROSS_MODEL_REVIEW=1 - required on isolation)
- sprint_plan_verdict: PASS
- decision_gate: false
- sprint_status: PLANNED (backlog OPEN per US-0045 - not mutated, AC-1..AC-8 unchecked)
- task_count: 11 (T-anch + T-001..T-010, within SPRINT_MAX_TASKS=12, no split, 1:1 architecture seeds)
- ac_surjective_map: AC-1->T-001 (T-010 m1); AC-2->T-002 (T-010 m2); AC-3->T-003,T-004 (T-010 m3,m4); AC-4->T-005 (T-010 m5); AC-5->T-006 (T-010 m6); AC-6->T-007 (T-010 m7); AC-7->T-008 (T-010 m8,m9); AC-8->T-009,T-010 m10-m12; DC->T-anch
- task_order: T-anch -> T-001 -> T-002 -> T-003 -> T-004 -> T-005 -> T-006 -> T-007 -> T-008 -> T-009 -> T-010
- plan-verify: ultra_lean - NOT in resolved_phase_plan, skipped, plan-verify.json is a SKIPPED placeholder (reason=ultra_lean_not_in_resolved_phase_plan; not a QA phase)
- compose_guards (non-negotiable): DO NOT amend AgentKernel isolation loader / noTools / KernelBridge / auth-models store / PolicyEngine tables / RoleCatalog internals / config loaders, DO NOT import Pi in app-runtime, DO NOT extend compute_strict_proof_hash, DO NOT implement browser UAT (US-0142), DO NOT implement /auto /quick drain (US-0143), DO NOT own credentials or read .env, DO NOT treat HEALTHCHECK as restart owner, DO NOT fall back unknown backends to local, DO NOT rewrite DEC-0133..0140 bodies, DO NOT wipe R-0120..R-0138, DO NOT reopen US-0133..US-0140, DO NOT mutate US-0142+ or BUG-0021/S0146 or BUG-0022 or BUG-0023/S0148 or S0147, DO NOT mark US-0141 DONE, DO NOT tick AC-1..AC-8, DO NOT mutate intake JSON, DO NOT run live paid CI, DO NOT restore auto.md
- critic_nb_execute_awareness:
  - T-003/T-004/T-006/T-009/T-010: BACKEND_* / APP_RUNTIME_* / PROCESS_* fail-closed, HEALTHCHECK status-only, unknown backend not local, credentials OUT, US-0142 OUT (NB1)
  - T-anch..T-010: keep 1:1 architecture seeds, sprint folder is S0149 (S0148 occupied by BUG-0023), execute owns app-runtime + 12 tests, compose US-0140 RunsStore, US-0142/US-0143 deferred (NB2)
  - T-anch: NO-OP verification, reject A2-A14, do not amend isolation/noTools/KernelBridge/PolicyEngine tables, do not mark DONE, do not design US-0142+, do not own credentials (NB3)
- first_execute_task: T-anch (NO-OP / verification)
- key_locked_artifacts:
  - standalone/packages/app-runtime (@its-magic/app-runtime, no Pi)
  - AppRuntime facade + ProcessManager + ExecutionBackend adapters
  - process_handles additive columns; ProcessManager writes; workflow reserveProcessHandle remains claim token
  - local + docker CLI-first core + WSL/SSH typed adapters
  - stack profiles Node/Python/Go/Java/.NET
  - APP_RUNTIME_RESTART_MAX default 3; HEALTHCHECK status-only
  - Connect handoff names; no Playwright/CDP
  - 12 test_us0141_*
- sprint_id_lock: S0149 (S0146=BUG-0021, S0147=US-0140, S0148=BUG-0023). Do not reuse.
- runtime_proof_id: rp-auto-20260913-us0141-sprint-plan-techlead-20260914T005000Z-US-0141
- proof_hash: 04696BE6D2E51F966804C58784F8239000011299CECE0ECB13BED846B113555E
- proof_ttl: 2026-09-14T01:50:00Z
- consumed_architecture_proof: rp-auto-20260913-us0141-architecture-techlead-20260914T003000Z-US-0141 / 4B5EBD9D8FF00C4C7CC5CF114B946AFBA684E11998C4C553C59AE5080326A3BF - RUNTIME_PROOF_VALID (MATCH before TTL 2026-09-14T01:30:00Z)
- consumed_critic_proof: rp-auto-20260913-us0141-sovereign-critic-techlead-20260914T004000Z-US-0141 / 581985E343F2274BE2B09E16F505C1E472F5955FCA350F4BD571AD3532428118 - MATCH, anti_slop=10, 0 blocking, degraded_mode=false, findings us0141arc-* informational
- next_scheduled_phase: sovereign-critic (sprint-plan) then /execute (role=dev)
- next_scheduled_role: tech-lead (critic), then dev
- stop_condition: STOP after sprint-plan. Orchestrator MUST spawn sovereign-critic of sprint-plan (CROSS_MODEL_REVIEW=1) then MUST spawn /execute in fresh dev (BUG-0006). Do NOT spawn execute, plan-verify, or critic from this tech-lead. Do NOT mark US-0141 DONE. Do NOT tick acceptance. Do NOT reopen US-0133..US-0140. Do NOT mutate US-0142+ or S0146/S0147/S0148. Do NOT implement packages this phase.

---
## Sprint-plan handoff - BUG-0023 / S0148 - sovereign-critic (sprint-plan) then /execute (fresh dev, ultra_lean)

- sprint_id: S0148
- story_id: (none — bug segment)
- bug_id: BUG-0023 (Status OPEN - authority docs/product/backlog.md)
- companion_dec: none (cite R-0137; compose DEC-0124 / DEC-0125 / DEC-0120 / DEC-0132)
- research_anchor: R-0137 (DQ1-DQ8 LOCKED, do not wipe R-0120..R-0137; do not reuse R-0135 / R-0138)
- architecture_anchor: docs/engineering/architecture.md # BUG-0023
- approach: Axis A LOCKED - shared Rpc.define (@opencode/plugin/rpc) + TUI api.client.rpc(Defined) / OpenCode.make().rpc + await ctx.rpc.register; keep { id, tui } listing + editor.add; remove invented POST happy path; DISPATCH only when client/RPC truly absent; 8 test_bug0023_* mock-invoke; upgrade overwrite dispatch path + prune leftover auto.md; no companion DEC; do not rewrite # BUG-0021 / # BUG-0019
- orchestrator_run_id: auto-20260913-bug0023
- parent_orchestrator_run_id: cursor-20260913-BUG0023-intake
- fresh_context_marker: tl-BUG0023-sprintplan-20260914T001500Z-fresh
- timestamp: 2026-09-14T00:15:00Z (UTC)
- model_id: cursor-grok-4.6-high (CROSS_MODEL_REVIEW=1 - required on isolation)
- model_resolve_fallback: MODEL_RESOLVE_FALLBACK (requested_slug=gpt-5.6-sol-high)
- sprint_plan_verdict: PASS
- decision_gate: false
- sprint_status: PLANNED (backlog OPEN per US-0045 - not mutated, acceptance unchecked)
- task_count: 8 (T-anch + T-001..T-007, within SPRINT_MAX_TASKS=12, no split, 1:1 architecture seeds)
- ac_surjective_map: AC-1->T-001,T-002,T-003,T-005(m1,m2,m4); AC-2->T-004,T-005(m6); AC-3->T-anch,T-005(m5); AC-4->T-005(m5); AC-5->T-002,T-003,T-005(m5); AC-6->T-005; AC-7->T-006,T-005(m8); AC-8->T-007,T-005(m7); AC-9->T-003,T-005(m3); DC->T-anch
- test_surjection: m1 T-001+T-005; m2 T-003+T-005; m3 T-003+T-005; m4 T-002+T-005; m5 T-anch+T-005; m6 T-004+T-005; m7 T-007+T-005; m8 T-006+T-005 (neither m7 nor m8 dropped)
- task_order: T-anch -> T-001 -> T-002 -> T-003 -> T-004 -> T-005 -> T-006 -> T-007
- plan-verify: ultra_lean - NOT in resolved_phase_plan, skipped, plan-verify.json is a SKIPPED placeholder (not a QA phase)
- compose_guards (non-negotiable): DO NOT restore auto.md, DO NOT add JSON commands.auto template, DO NOT rewrite # BUG-0021 / # BUG-0019 / DEC-0124 / DEC-0125, DO NOT reopen BUG-0021/0020/0019/0018/0017/0015/0016, DO NOT mutate BUG-0022 or US-0140 / S0147 or US-0141, DO NOT mutate US-0133..US-0148, DO NOT mark BUG-0023 DONE, DO NOT tick acceptance, DO NOT live-probe OpenCode CLI TUI in default CI, DO NOT extend compute_strict_proof_hash, DO NOT silent-default localhost:4096, DO NOT top-level import rpc from the TUI default-export module
- critic_nb_execute_awareness:
  - T-004/T-005/T-007: DISPATCH is defect not success; honest token only when client/RPC truly absent; do not restore auto.md (NB1)
  - T-anch..T-007: keep 1:1 architecture seeds, sprint folder is S0148, execute owns rpc.ts + await register + client.rpc(Defined) / OpenCode.make + 8 mock-invoke tests + overwrite, keep { id, tui } + editor.add (NB2)
  - T-anch: NO-OP verification, reject Axis B/D/E/F, do not rewrite # BUG-0021, do not mark DONE, do not mutate BUG-0022 / US-0141 (NB3)
- first_execute_task: T-anch (NO-OP / verification)
- key_locked_artifacts:
  - shared .opencode/plugins/its-magic-auto/rpc.ts Rpc.define id its-magic.auto
  - await ctx.rpc.register(Defined, { runAutoLifecycle }); keep editor.add
  - dispatchRunAutoLifecycle dynamic-import Defined → client.rpc(Defined) + OpenCode.make fallback
  - remove invented POST happy path; keep { id, tui } listing
  - DISPATCH only when client/RPC truly absent
  - upgrade overwrite rpc.ts/tui.ts/orchestrator + prune leftover auto.md
  - 8 test_bug0023_*
- sprint_id_lock: S0148 (S0146=BUG-0021, S0147=US-0140). US-0141 research expected S0148 is superseded — US-0141 increments at its own /sprint-plan.
- runtime_proof_id: rp-auto-20260913-bug0023-sprint-plan-techlead-20260914T001500Z-BUG-0023
- proof_hash: 4ADB13DBEB1B57EF96301023AF423D4F71528AAFC0B005028F4E5231D8D80FF1
- proof_ttl: 2026-09-14T01:15:00Z
- consumed_architecture_proof: rp-auto-20260913-bug0023-architecture-techlead-20260914T000500Z-BUG-0023 / A565DE258312BA535F8CF4E9B00E8A17913E8F44960AC83097EC3C093997EF95 - RUNTIME_PROOF_VALID (MATCH before TTL 2026-09-14T01:05:00Z)
- consumed_critic_proof: rp-auto-20260913-bug0023-sovereign-critic-techlead-20260914T001000Z-BUG-0023 / B6E305BCC4C02E091033550DC53E0446E6F908228819A59BB25AAC35F5906D53 - MATCH, anti_slop=10, 0 blocking, degraded_mode=false, findings bug0023arc-* informational
- next_scheduled_phase: sovereign-critic (sprint-plan) then /execute (role=dev)
- next_scheduled_role: tech-lead (critic), then dev
- stop_condition: STOP after sprint-plan. Orchestrator MUST spawn sovereign-critic of sprint-plan (CROSS_MODEL_REVIEW=1) then MUST spawn /execute in fresh dev (BUG-0006). Do NOT spawn execute, plan-verify, or critic from this tech-lead. Do NOT mark BUG-0023 DONE. Do NOT tick acceptance. Do NOT reopen BUG-0021. Do NOT mutate BUG-0022 / US-0141. Do NOT restore auto.md. Do NOT implement dispatch-path code this phase.

---
## Sprint-plan handoff - US-0140 / S0147 - sovereign-critic (sprint-plan) then /execute (fresh dev, ultra_lean)

- sprint_id: S0147
- story_id: US-0140 (Status OPEN - authority docs/product/backlog.md)
- bug_id: (none)
- companion_dec: DEC-0140 Accepted (decisions/DEC-0140.md)
- research_anchor: R-0135 (DQ1-DQ10 LOCKED, do not wipe R-0120..R-0135)
- architecture_anchor: docs/engineering/architecture.md # US-0140
- approach: A1 LOCKED - runtime-core nested workflow/runs/recovery/stop-matrix (no Pi), nested GateEngine, typed TS graph, CommandRouter 7-step, KernelBridge consume, /auto /quick WORKFLOW_ROUTE_DEFERRED, node:sqlite ops DB, crash resume discardOrphans + fresh role, reject A2-A13
- orchestrator_run_id: auto-20260913-us0140
- parent_orchestrator_run_id: auto-20260913-us0139
- fresh_context_marker: tl-US0140-sprintplan-20260913T211500Z-fresh
- timestamp: 2026-09-13T21:15:00Z (UTC)
- model_id: cursor-grok-4.6-high (CROSS_MODEL_REVIEW=1 - required on isolation)
- sprint_plan_verdict: PASS
- decision_gate: false
- sprint_status: PLANNED (backlog OPEN per US-0045 - not mutated, AC-1..AC-8 unchecked)
- task_count: 11 (T-anch + T-001..T-010, within SPRINT_MAX_TASKS=12, no split, 1:1 architecture seeds)
- ac_surjective_map: AC-1->T-001,T-003 (T-010 m1), AC-2->T-002,T-003,T-004 (T-010 m2,m3), AC-3->T-005 (T-010 m4,m5), AC-4->T-006 (T-010 m6), AC-5->T-007 (T-010 m7), AC-6->T-008 (T-010 m8), AC-7->T-009 (T-010 m9), AC-8->T-010 m10-m12, DC->T-anch
- task_order: T-anch -> T-001 -> T-002 -> T-003 -> T-004 -> T-005 -> T-006 -> T-007 -> T-008 -> T-009 -> T-010
- plan-verify: ultra_lean - NOT in resolved_phase_plan, skipped, plan-verify.json is a SKIPPED placeholder (not a QA phase)
- compose_guards (non-negotiable): DO NOT amend AgentKernel isolation loader / noTools / KernelBridge / auth-models store / PolicyEngine tables / RoleCatalog internals / context-engine ranking, DO NOT import Pi in runtime-core, DO NOT extend compute_strict_proof_hash, DO NOT implement /auto /quick drain (US-0143), DO NOT own credentials or read .env, DO NOT rewrite DEC-0133..0139 bodies, DO NOT wipe R-0120..R-0135, DO NOT reopen US-0133..US-0139/BUG-0020, DO NOT mutate US-0141+ or BUG-0021/S0146 or S0145, DO NOT mark US-0140 DONE, DO NOT tick AC-1..AC-8, DO NOT mutate intake JSON, DO NOT run live paid CI
- critic_nb_execute_awareness:
  - T-003/T-005/T-006/T-008/T-009/T-010: WORKFLOW_ROUTE_DEFERRED / WORKFLOW_LOOP_CAP / RELEASE_* / CLOSURE_RELEASE_EVIDENCE_MISSING / RECOVERY_FALSE_COMPLETION fail-closed, US-0143 OUT, credentials OUT (NB1)
  - T-anch..T-010: keep 1:1 architecture seeds, sprint folder is S0147 (S0146 occupied by BUG-0021), execute owns runtime-core + 12 tests, PolicyEngine/config/KernelBridge compose-only, US-0143 deferred (NB2)
  - T-anch: NO-OP verification, reject A2-A13, do not amend isolation/noTools/KernelBridge/PolicyEngine tables, do not mark DONE, do not design US-0141+, do not own credentials (NB3)
- first_execute_task: T-anch (NO-OP / verification)
- key_locked_artifacts:
  - standalone/packages/runtime-core (@its-magic/runtime-core, no Pi)
  - nested src/workflow/ + src/workflow/gates/ + src/runs/ + src/recovery/ + src/stop-matrix/
  - CommandRouter 7-step + /auto /quick WORKFLOW_ROUTE_DEFERRED
  - typed phase graph + ultra_lean plan-verify skip edge
  - nested GateEngine RELEASE_*
  - closure exclusive DONE + release-evidence envelope
  - node:sqlite RunsStore gitignored .its-magic/runtime/
  - crash resume discardOrphans + fresh role
  - 12 test_us0140_*
- runtime_proof_id: rp-auto-20260913-us0140-sprint-plan-techlead-20260913T211500Z-US-0140
- proof_hash: 8DF26AFE6649AB65A7B3F5CF3F350743B88384CFA36B7172E5D0C74198D62E6D
- proof_ttl: 2026-09-13T22:15:00Z
- consumed_architecture_proof: rp-auto-20260913-us0140-architecture-techlead-20260913T205500Z-US-0140 / 006C9A41ABF30BCA3A313E8E3B0367CF7E17BA97759F3060BED8B60918DE50CC - RUNTIME_PROOF_VALID (MATCH before TTL 2026-09-13T21:55:00Z)
- consumed_critic_proof: rp-auto-20260913-us0140-sovereign-critic-techlead-20260913T210500Z-US-0140 / C8B88DCD0B57CE0D3A4FD66C282E51F1510D6FC3E53DC2DD48FCCCDE8C3439F6 - MATCH, anti_slop=10, 0 blocking, degraded_mode=false, findings us0140arch-* informational
- next_scheduled_phase: sovereign-critic (sprint-plan) then /execute (role=dev)
- next_scheduled_role: tech-lead (critic), then dev
- stop_condition: STOP after sprint-plan. Orchestrator MUST spawn sovereign-critic of sprint-plan (CROSS_MODEL_REVIEW=1) then MUST spawn /execute in fresh dev (BUG-0006). Do NOT spawn execute, plan-verify, or critic from this tech-lead. Do NOT mark US-0140 DONE. Do NOT tick acceptance. Do NOT reopen US-0139 or BUG-0020. Do NOT mutate US-0141+ or S0145/S0146. Do NOT implement packages this phase.

---
## Sprint-plan handoff - BUG-0021 / S0146 - sovereign-critic (sprint-plan) then /execute (fresh dev, ultra_lean)

- sprint_id: S0146
- story_id: (none — bug segment)
- bug_id: BUG-0021 (Status OPEN - authority docs/product/backlog.md)
- companion_dec: none (cite R-0134; compose DEC-0124 / DEC-0125 / DEC-0120 / DEC-0132)
- research_anchor: R-0134 (DQ1-DQ8 LOCKED, do not wipe R-0120..R-0133)
- architecture_anchor: docs/engineering/architecture.md # BUG-0021
- approach: Axis A LOCKED - reshape tui.ts default export { id, tui }; registerLayer name/slashName: auto/namespace: palette; binding ctrl+shift+a; run() → api.client.rpc → runAutoLifecycle; keep tui.json + editor.add; OPENCODE_AUTO_CLI_TUI_PLUGIN_LOAD_UNSUPPORTED; no auto.md restore; no JSON template; no companion DEC; do not rewrite # BUG-0020
- orchestrator_run_id: auto-20260913-bug0021
- parent_orchestrator_run_id: cursor-20260913-BUG0021-intake
- fresh_context_marker: tl-BUG0021-sprintplan-20260913T124000Z-fresh
- timestamp: 2026-09-13T12:40:00Z (UTC)
- model_id: cursor-grok-4.6-high (CROSS_MODEL_REVIEW=1 - required on isolation)
- model_resolve_fallback: MODEL_RESOLVE_FALLBACK (requested_slug=gpt-5.6-sol-high)
- sprint_plan_verdict: PASS
- decision_gate: false
- sprint_status: PLANNED (backlog OPEN per US-0045 - not mutated, acceptance unchecked)
- task_count: 8 (T-anch + T-001..T-007, within SPRINT_MAX_TASKS=12, no split, 1:1 architecture seeds)
- ac_surjective_map: AC-1->T-001,T-002,T-005(m1,m2,m6); AC-2->T-003,T-004,T-005(m3,m5); AC-3->T-anch,T-005(m4); AC-4->T-005(m4); AC-5->T-003,T-005(m3); AC-6->T-006,T-005(m8); AC-7->T-007,T-005(m7); AC-8->T-anch; AC-9->T-005; AC-10->T-004,T-007; DC->T-anch
- test_surjection: m1 T-001+T-005; m2 T-002+T-005; m3 T-003+T-005; m4 T-anch+T-005; m5 T-004+T-005; m6 T-001+T-002+T-005; m7 T-007+T-005; m8 T-006+T-005 (neither m7 nor m8 dropped; architecture split, not both on T-007)
- task_order: T-anch -> T-001 -> T-002 -> T-003 -> T-004 -> T-005 -> T-006 -> T-007
- plan-verify: ultra_lean - NOT in resolved_phase_plan, skipped, plan-verify.json is a SKIPPED placeholder (not a QA phase)
- compose_guards (non-negotiable): DO NOT restore auto.md, DO NOT add JSON commands.auto template, DO NOT ship cli.json or plugin-local tui.json, DO NOT rewrite # BUG-0020 / DEC-0124 / DEC-0125, DO NOT reopen BUG-0020/0019/0018/0017/0015/0016, DO NOT mutate BUG-0022 or US-0139 / S0145, DO NOT mutate US-0133..US-0148, DO NOT mark BUG-0021 DONE, DO NOT tick acceptance, DO NOT live-probe OpenCode CLI TUI in default CI, DO NOT extend compute_strict_proof_hash
- critic_nb_execute_awareness:
  - T-004/T-005/T-007: LOAD/LISTING/DISPATCH fail-closed, #36505 residual, upgrade overwrite R7, do not restore auto.md (NB1)
  - T-anch..T-007: keep 1:1 architecture seeds, sprint folder is S0146, execute owns reshape + registerLayer + rpc + 8 tests + overwrite, index.ts server-only (NB2)
  - T-anch: NO-OP verification, reject Axis B/D/E, do not rewrite # BUG-0020, do not mark DONE, do not mutate BUG-0022 / US-0139 (NB3)
- first_execute_task: T-anch (NO-OP / verification)
- key_locked_artifacts:
  - reshape .opencode/plugins/its-magic-auto/tui.ts { id: "its-magic.auto.tui", tui }
  - registerLayer name/slashName: auto/namespace: palette/ctrl+shift+a
  - run() api.client.rpc(ITS_MAGIC_AUTO_RPC) → runAutoLifecycle
  - keep tui.json listing + editor.add
  - OPENCODE_AUTO_CLI_TUI_PLUGIN_LOAD_UNSUPPORTED
  - upgrade overwrite tui.ts + prune leftover auto.md
  - 8 test_bug0021_*
- runtime_proof_id: rp-auto-20260913-bug0021-sprint-plan-techlead-20260913T124000Z-BUG-0021
- proof_hash: 11A440144E6A2350DADBE1C2709BE6A2769E15D1074964211AD11CD7897423DD
- proof_ttl: 2026-09-13T13:40:00Z
- consumed_architecture_proof: rp-auto-20260913-bug0021-architecture-techlead-20260913T121000Z-BUG-0021 / 7621D2D4FCE1EEB34FF8E41F8B26F6069E5D348833F8EEBEF8CD5210DE53A60B - RUNTIME_PROOF_VALID (MATCH before TTL 2026-09-13T13:10:00Z)
- consumed_critic_proof: rp-auto-20260913-bug0021-sovereign-critic-techlead-20260913T123600Z-BUG-0021 / 83E7EEBC715167A882F8A5301DC8FBCB63610CAEEBFB1748A28EC830D127E2BE - MATCH, anti_slop=10, 0 blocking, degraded_mode=false, findings bug0021arc-* informational
- next_scheduled_phase: sovereign-critic (sprint-plan) then /execute (role=dev)
- next_scheduled_role: tech-lead (critic), then dev
- stop_condition: STOP after sprint-plan. Orchestrator MUST spawn sovereign-critic of sprint-plan (CROSS_MODEL_REVIEW=1) then MUST spawn /execute in fresh dev (BUG-0006). Do NOT spawn execute, plan-verify, or critic from this tech-lead. Do NOT mark BUG-0021 DONE. Do NOT tick acceptance. Do NOT reopen BUG-0020. Do NOT mutate BUG-0022 / US-0139. Do NOT restore auto.md. Do NOT reshape tui.ts this phase.

---
## Sprint-plan handoff - US-0139 / S0145 - sovereign-critic (sprint-plan) then /execute (fresh dev, ultra_lean)

- sprint_id: S0145
- story_id: US-0139 (Status OPEN - authority docs/product/backlog.md)
- bug_id: (none)
- companion_dec: DEC-0139 Accepted (decisions/DEC-0139.md)
- research_anchor: R-0132 (DQ1-DQ10 LOCKED, do not wipe R-0120..R-0133)
- architecture_anchor: docs/engineering/architecture.md # US-0139
- approach: A1 LOCKED - code-intelligence + context-engine (no Pi), nested AFT read adapter, unstub itsm_*, TOKEN_PROFILE caps, assembler exclusion, pack hash not DEC-0038, compose materialize_codebase_map, benchmark, its-indexd OUT, reject A2-A13
- orchestrator_run_id: auto-20260913-us0139
- parent_orchestrator_run_id: auto-20260913-us0138
- fresh_context_marker: tl-US0139-sprintplan-20260913T175500Z-fresh
- timestamp: 2026-09-13T17:55:00Z (UTC)
- model_id: cursor-grok-4.6-high (CROSS_MODEL_REVIEW=1 - required on isolation)
- sprint_plan_verdict: PASS
- decision_gate: false
- sprint_status: PLANNED (backlog OPEN per US-0045 - not mutated, AC-1..AC-8 unchecked)
- task_count: 11 (T-anch + T-001..T-010, within SPRINT_MAX_TASKS=12, no split, 1:1 architecture seeds)
- ac_surjective_map: AC-1->T-001,T-002 (T-010 m1), AC-2->T-002,T-003 (T-010 m2), AC-3->T-004 (T-010 m3), AC-4->T-005 (T-010 m4), AC-5->T-006 (T-010 m5), AC-6->T-007 (T-010 m6), AC-7->T-008 (T-010 m7), AC-8->T-009 (T-010 m8-m12), DC->T-anch
- task_order: T-anch -> T-001 -> T-002 -> T-003 -> {T-004, T-005} -> T-006 -> T-007 -> T-008 -> T-009 -> T-010
- plan-verify: ultra_lean - NOT in resolved_phase_plan, skipped, plan-verify.json is a SKIPPED placeholder (not a QA phase)
- compose_guards (non-negotiable): DO NOT amend AgentKernel isolation loader / noTools / KernelBridge / auth-models store / PolicyEngine tables / RoleCatalog internals, DO NOT import Pi in code-intelligence/context-engine, DO NOT extend compute_strict_proof_hash, DO NOT add its-indexd or runtime-core, DO NOT own credentials or read .env, DO NOT rewrite DEC-0133..0138 bodies, DO NOT wipe R-0120..R-0133, DO NOT reopen US-0133..US-0138/BUG-0020, DO NOT mutate US-0140+ or BUG-0021, DO NOT mark US-0139 DONE, DO NOT tick AC-1..AC-8, DO NOT mutate intake JSON, DO NOT run live paid CI
- critic_nb_execute_awareness:
  - T-002/T-005/T-006/T-008/T-009/T-010: INTEL_*/CONTEXT_* fail-closed edges, pack hash not DEC-0038, its-indexd OUT, credentials OUT (NB1)
  - T-anch..T-010: keep 1:1 architecture seeds, sprint folder is S0145, execute owns packages + 12 tests, PolicyEngine/config compose-only, US-0140 deferred (NB2)
  - T-anch: NO-OP verification, reject A2-A13, do not amend isolation/noTools/KernelBridge/PolicyEngine tables, do not mark DONE, do not design US-0140+, do not own credentials (NB3)
- first_execute_task: T-anch (NO-OP / verification)
- key_locked_artifacts:
  - standalone/packages/code-intelligence (@its-magic/code-intelligence, no Pi)
  - standalone/packages/context-engine (@its-magic/context-engine, no Pi)
  - nested AFT read sidecar AFT_BINARY_VERSION=0.55.1 + fake adapter
  - LIVE_INTEL_TOOLS unstub six itsm_* names
  - code_context ranking + TOKEN_PROFILE caps
  - assembler exclusion + pack envelope hash
  - derived codebase-map compose
  - benchmark harness, its-indexd OUT
  - 12 test_us0139_*
- runtime_proof_id: rp-auto-20260913-us0139-sprint-plan-techlead-20260913T175500Z-US-0139
- proof_hash: E7EF29705559E89CF0DF2B47132D00CBCCC4E376C5CCCF5862BB305C597DAF17
- proof_ttl: 2026-09-13T18:55:00Z
- consumed_architecture_proof: rp-auto-20260913-us0139-architecture-techlead-20260913T173500Z-US-0139 / 93664305B6847E244901E87027891EA2EC9FA4E23F9A66B5CC5BC00293C0F51C - RUNTIME_PROOF_VALID (MATCH before TTL 2026-09-13T18:35:00Z)
- consumed_critic_proof: rp-auto-20260913-us0139-sovereign-critic-techlead-20260913T174500Z-US-0139 / F4FA5F3517694EBEB416B9AB43F3885B14CBD81821A870BC31D96EE8A8731E12 - MATCH, anti_slop=10, 0 blocking, degraded_mode=false, findings us0139arc-* informational
- next_scheduled_phase: sovereign-critic (sprint-plan) then /execute (role=dev)
- next_scheduled_role: tech-lead (critic), then dev
- stop_condition: STOP after sprint-plan. Orchestrator MUST spawn sovereign-critic of sprint-plan (CROSS_MODEL_REVIEW=1) then MUST spawn /execute in fresh dev (BUG-0006). Do NOT spawn execute, plan-verify, or critic from this tech-lead. Do NOT mark US-0139 DONE. Do NOT tick acceptance. Do NOT reopen US-0138 or BUG-0020. Do NOT mutate US-0140+. Do NOT implement packages this phase.

---
## Sprint-plan handoff — US-0138 / S0144 — sovereign-critic (sprint-plan) then `/execute` (fresh dev; ultra_lean)

- sprint_id: S0144
- story_id: US-0138 (Status OPEN — authority docs/product/backlog.md)
- bug_id: (none)
- companion_dec: DEC-0138 Accepted (`decisions/DEC-0138.md`)
- research_anchor: R-0130 (DQ1–DQ10 LOCKED; compose R-0129 / R-0128 / R-0127 / R-0122 / R-0121 / R-0116; do not wipe R-0120..R-0130)
- architecture_anchor: docs/engineering/architecture.md # US-0138
- approach: A1 LOCKED — `standalone/packages/config` (`@its-magic/config`, no Pi imports); Zod-typed versioned `RuntimeConfig`; JSONC `.its-magic/config{,.local,.example}.json` same files as US-0131 analog (do not rewrite `host_runtime_config_lib.py`); TS `LegacyScratchpadAdapter` (absent OK; no Python spawn; no forced migration; DEC-0039 locals preserved); 5-layer public precedence mapped onto kit 7-layer; per-key provenance; `CONFIG_*` fail-closed; secret names/handles only (credentials OUT US-0135); US-0119 preset expansion with `security_hard` unrelaxable; inject PolicyEngine/ModelRouter/SessionSupervisor flags only; fake-model CI / empty loader / `noTools` / KernelBridge / auth-models / PolicyEngine tables / RoleCatalog held; reject A2–A12
- orchestrator_run_id: auto-20260913-us0138
- parent_orchestrator_run_id: auto-20260913-us0137
- fresh_context_marker: tl-US0138-sprintplan-20260913T143500Z-fresh
- timestamp: 2026-09-13T14:35:00Z (UTC)
- model_id: cursor-grok-4.6-high (CROSS_MODEL_REVIEW=1 — required on isolation)
- sprint_plan_verdict: PASS
- decision_gate: false
- sprint_status: PLANNED (backlog OPEN per US-0045 — not mutated; AC-1..AC-6 unchecked)
- task_count: 11 (T-anch + T-001..T-010; within SPRINT_MAX_TASKS=12; no split; 1:1 architecture seeds)
- ac_surjective_map: AC-1->T-001,T-002,T-008; AC-2->T-003(T-010 m1-m4,m12); AC-3->T-004(T-010 m5,m6); AC-4->T-005(T-010 m9); AC-5->T-006,T-007(T-010 m10,m11); AC-6->T-009,T-010; DC->T-anch
- task_order: T-anch -> T-001 -> T-002 -> T-003 -> T-004 -> {T-005, T-006, T-007} -> T-008 -> T-009 -> T-010
- plan-verify: ultra_lean — NOT in resolved_phase_plan; skipped; plan-verify.json is a SKIPPED placeholder (not a QA phase)
- compose_guards (non-negotiable): DO NOT amend AgentKernel isolation loader / noTools / KernelBridge / auth-models store / PolicyEngine tables / RoleCatalog internals; DO NOT import Pi in packages/config; DO NOT rewrite host_runtime_config_lib.py; DO NOT extend compute_strict_proof_hash; DO NOT add runtime-core; DO NOT own credentials or read .env; DO NOT force migration or overwrite DEC-0039 locals; DO NOT rewrite DEC-0133/0134/0135/0136/0137 bodies; DO NOT wipe R-0120..R-0130; DO NOT reopen US-0133/US-0134/US-0135/US-0136/US-0137/BUG-0020; DO NOT mutate US-0139+; DO NOT mark US-0138 DONE; DO NOT tick AC-1..AC-6; DO NOT mutate intake JSON; DO NOT run live paid CI
- critic_nb_execute_awareness:
  - T-003/T-004/T-005/T-006/T-007/T-010: fail-closed edges locked DEC-0138 §4–§8 — 5-layer precedence, secret reject, security_hard, legacy adapter; compute_strict_proof_hash tuple unamended; credentials OUT (NB1)
  - T-anch..T-010: keep 1:1 architecture seeds; sprint folder is S0144; execute owns packages/config + Zod schema + adapter + 12 tests; inject-only PolicyEngine/ModelRouter/SessionSupervisor; US-0131 analog compose-only; US-0139/0140 deferred; DEC-0133/0134/0135/0136/0137 compose held (NB2)
  - T-anch: NO-OP verification; reject A2–A12; do not amend isolation/noTools/KernelBridge/auth-models/PolicyEngine tables; do not mark DONE; do not reopen US-0137/US-0136/US-0135 or BUG-0020; do not design US-0139+; do not own credentials (NB3)
- first_execute_task: T-anch (NO-OP / verification)
- key_locked_artifacts:
  - standalone/packages/config (@its-magic/config; no Pi)
  - Zod RuntimeConfig + schema_version v1 + AC-1 groups
  - JSONC .its-magic/config{,.local,.example}.json (US-0131 analog)
  - 5-layer resolve + provenance
  - TS LegacyScratchpadAdapter (absent OK; migration hints)
  - secret reject names/handles only
  - CONFIG_* fail-closed + security_hard unrelaxable
  - inject PolicyEngine/ModelRouter/SessionSupervisor flags
  - DEC-0039 local preservation + existing-repo identity
  - 12 test_us0138_*
- runtime_proof_id: rp-auto-20260913-us0138-sprint-plan-techlead-20260913T143500Z-US-0138
- proof_hash: F6F06430D519000457A0F38ECB45BF90368CCDE7C8921EA4D349C798744FE5F0
- proof_ttl: 2026-09-13T15:35:00Z
- consumed_architecture_proof: rp-auto-20260913-us0138-architecture-techlead-20260913T141500Z-US-0138 / 7400FC661403FBA49902875B7A08FB930D156840A8B84EF9ED5D5B385DF6BEE4 — RUNTIME_PROOF_VALID (MATCH before TTL 2026-09-13T15:15:00Z)
- consumed_critic_proof: rp-auto-20260913-us0138-sovereign-critic-techlead-20260913T142500Z-US-0138 / AB66B458010E29E861F3D866A4BDFDAF3CF09E09D3239E47D00E5E49F3721CD6 — MATCH; anti_slop=10; 0 blocking; degraded_mode=false; findings us0138asc-* informational
- next_scheduled_phase: sovereign-critic (sprint-plan) then /execute (role=dev)
- next_scheduled_role: tech-lead (critic), then dev
- stop_condition: STOP after sprint-plan. Orchestrator MUST spawn sovereign-critic of sprint-plan (CROSS_MODEL_REVIEW=1) then MUST spawn /execute in fresh dev (BUG-0006). Do NOT spawn execute, plan-verify, or critic from this tech-lead. Do NOT mark US-0138 DONE. Do NOT tick acceptance. Do NOT reopen US-0137, US-0136, US-0135, or BUG-0020. Do NOT mutate US-0139+. Do NOT implement standalone/packages/config this phase.

---

## Sprint-plan handoff — US-0137 / S0143 — `/execute` next (fresh dev; ultra_lean)

- sprint_id: S0143
- story_id: US-0137 (Status OPEN — authority docs/product/backlog.md)
- bug_id: (none)
- companion_dec: DEC-0137 Accepted (`decisions/DEC-0137.md`)
- research_anchor: R-0129 (DQ1–DQ10 LOCKED; compose R-0121 / R-0122 / R-0127 / R-0128; do not wipe R-0120..R-0128)
- architecture_anchor: docs/engineering/architecture.md # US-0137
- approach: A1 LOCKED — `standalone/packages/policy-engine` + `standalone/packages/tool-broker` (no Pi imports); thin kernel tool-port (`defineTool` only in pi-kernel); production `itsm_*` via ToolBroker; `noTools: "builtin"` held; PolicyEngine ALLOW|ASK|DENY; path deny matrix; shell classify; secret deny + US-0135 `redact.ts` compose; Layer A ≠ Layer B (US-0141 OUT); compact audit + real `policy_hash`; fake-model CI / empty loader / KernelBridge / auth-models / role-runtime held (compose spawn allowlist + hash); reject A2–A12
- orchestrator_run_id: auto-20260913-us0137
- parent_orchestrator_run_id: auto-20260913-us0136
- fresh_context_marker: tl-US0137-sprintplan-20260913T111500Z-fresh
- timestamp: 2026-09-13T11:15:00Z (UTC)
- model_id: cursor-grok-4.6-high (CROSS_MODEL_REVIEW=1 — required on isolation)
- sprint_plan_verdict: PASS
- decision_gate: false
- sprint_status: PLANNED (backlog OPEN per US-0045 — not mutated; AC-1..AC-8 unchecked)
- task_count: 11 (T-anch + T-001..T-010; within SPRINT_MAX_TASKS=12; no split; 1:1 architecture seeds)
- ac_surjective_map: AC-1->T-001,T-008,T-009(T-010 m1,m2,m10); AC-2->T-002; AC-3->T-003(T-010 m3,m4); AC-4->T-004(T-010 m6,m7); AC-5->T-005(T-010 m5,m8); AC-6->T-006(T-010 m9); AC-7->T-007; AC-8->T-010; DC->T-anch
- task_order: T-anch -> T-001 -> T-002 -> {T-003, T-004, T-005} -> T-006 -> T-007 -> T-008 -> T-009 -> T-010
- plan-verify: ultra_lean — NOT in resolved_phase_plan; skipped; plan-verify.json is a SKIPPED placeholder (not a QA phase)
- compose_guards (non-negotiable): DO NOT amend AgentKernel isolation loader / noTools / KernelBridge / auth-models store; DO NOT import Pi in policy-engine/tool-broker; DO NOT extend compute_strict_proof_hash; DO NOT add SQLite or runtime-core; DO NOT claim OS sandbox; DO NOT rewrite DEC-0133/0134/0135/0136 bodies; DO NOT wipe R-0120..R-0129; DO NOT reopen US-0133/US-0134/US-0135/US-0136/BUG-0020; DO NOT mutate US-0138+; DO NOT mark US-0137 DONE; DO NOT tick AC-1..AC-8; DO NOT mutate intake JSON; DO NOT run live paid CI; DO NOT read .env
- critic_nb_execute_awareness:
  - T-003/T-004/T-005/T-006/T-008/T-010: fail-closed edges locked DEC-0137 §3–§11 — raw Pi tools, path ownership, shell exfil, secret deny, Layer B unavailable, malicious extensions; compute_strict_proof_hash tuple unamended (NB1)
  - T-anch..T-010: keep 1:1 architecture seeds; sprint folder is S0143; execute owns policy-engine + tool-broker + kernel tool-port + catalog + 10 tests; PolicyEngine vs RoleCatalog (intent vs permission); defineTool only in pi-kernel; US-0141 Layer B deferred; DEC-0133/0134/0135/0136 compose held (NB2)
  - T-anch: NO-OP verification; reject A2–A12; do not amend isolation/noTools/KernelBridge/auth-models; do not mark DONE; do not reopen US-0136/US-0135 or BUG-0020; do not design US-0138+; do not claim OS sandbox (NB3)
- first_execute_task: T-anch (NO-OP / verification)
- key_locked_artifacts:
  - standalone/packages/policy-engine (@its-magic/policy-engine; no Pi)
  - standalone/packages/tool-broker (@its-magic/tool-broker; no Pi)
  - PolicyEngine ALLOW|ASK|DENY + security_hard
  - path ownership deny matrix
  - shell classifier v1 + fail-safe inventory
  - secret path deny + redact.ts compose
  - Layer A profiles + ISOLATION_BACKEND_UNAVAILABLE
  - compact audit + real policy_hash
  - kernel tool-port ownedTools + defineTool only in pi-kernel
  - per-role itsm_* catalog + fail-closed stubs
  - 10 test_us0137_*
- runtime_proof_id: rp-auto-20260913-us0137-sprint-plan-techlead-20260913T111500Z-US-0137
- proof_hash: 90403EE6908313220976FDAFC69EA3E96BCB44EABC525574ED2499E6ABB89CE3
- proof_ttl: 2026-09-13T12:15:00Z
- consumed_architecture_proof: rp-auto-20260913-us0137-architecture-techlead-20260913T105500Z-US-0137 / 1BA2580EED66FC542D567EEF44EC4C6040854A0DFFCFABEE0087042E7657D97C — RUNTIME_PROOF_VALID (MATCH before TTL 2026-09-13T11:55:00Z)
- consumed_critic_proof: rp-auto-20260913-us0137-sovereign-critic-techlead-20260913T110500Z-US-0137 / EA78042C178EB8C42093D6E92389CE2E3CB114540E5369707BBC56A1F182F1CE — MATCH; anti_slop=10; 0 blocking; degraded_mode=false; findings us0137asc-* informational
- next_scheduled_phase: /execute (role=dev)
- next_scheduled_role: dev
- stop_condition: STOP after sprint-plan. Orchestrator MAY spawn sovereign-critic of sprint-plan (CROSS_MODEL_REVIEW=1) then MUST spawn /execute in fresh dev (BUG-0006). Do NOT spawn execute or plan-verify from this tech-lead. Do NOT mark US-0137 DONE. Do NOT tick acceptance. Do NOT reopen US-0136, US-0135, or BUG-0020. Do NOT mutate US-0138+.

---

## Sprint-plan handoff — US-0136 / S0142 — `/execute` next (fresh dev; ultra_lean)

- sprint_id: S0142
- story_id: US-0136 (Status OPEN — authority docs/product/backlog.md)
- bug_id: (none)
- companion_dec: DEC-0136 Accepted (`decisions/DEC-0136.md`)
- research_anchor: R-0128 (DQ1–DQ10 LOCKED; compose R-0121 / R-0122 / R-0127; do not wipe R-0120..R-0127)
- architecture_anchor: docs/engineering/architecture.md # US-0136
- approach: A1 LOCKED — `standalone/packages/role-runtime` (RoleCatalog + SessionSupervisor + sidecar attestation; no Pi imports); Supervisor wraps injected AgentKernel.createSession only; SessionManager.inMemory; continueRecent/fork default-deny; ContinuationContract same-phase run/steer only; RoleCatalog ports DEC-0051 / AUTO_ROLE_* + extra catalog rows; sidecar spawn/start/end + attestation_hash; additive standalone_attestation; DEC-0038 envelope unamended; TS orchestrator spawn-time tool deny; fail-closed SESSION_*/ATTESTATION_*; 10 test_us0136_*; fake-model CI / empty loader / noTools / KernelBridge / auth-models held; reject A2–A9
- orchestrator_run_id: auto-20260913-us0136
- parent_orchestrator_run_id: auto-20260913-us0135
- fresh_context_marker: tl-US0136-sprintplan-20260913T075500Z-fresh
- timestamp: 2026-09-13T07:55:00Z (UTC)
- model_id: cursor-grok-4.6-high (CROSS_MODEL_REVIEW=1 — required on isolation)
- sprint_plan_verdict: PASS
- decision_gate: false
- sprint_status: PLANNED (backlog OPEN per US-0045 — not mutated; AC-1..AC-7 unchecked)
- task_count: 11 (T-anch + T-001..T-010; within SPRINT_MAX_TASKS=12; no split; 1:1 architecture seeds)
- ac_surjective_map: AC-1->T-001,T-003,T-004,T-008(T-010 m1-m4,m6,m8); AC-2->T-002(T-010 m7); AC-3->T-005(T-010 m9); AC-4->T-005; AC-5->T-006,T-007(T-010 m6-m10); AC-6->T-007(T-010 m10); AC-7->T-008,T-009,T-010(m1-m5); DC->T-anch
- task_order: T-anch -> T-001 -> T-002 -> T-003 -> {T-004, T-005} -> T-006 -> T-007 -> T-008 -> T-009 -> T-010
- plan-verify: ultra_lean — NOT in resolved_phase_plan; skipped; plan-verify.json is a deferred/skipped placeholder (not a QA phase)
- compose_guards (non-negotiable): DO NOT amend AgentKernel isolation loader / noTools / KernelBridge / auth-models; DO NOT import Pi in role-runtime; DO NOT add continueRecent/fork/newSession({ parentSession }) to AgentKernel; DO NOT extend compute_strict_proof_hash; DO NOT add SQLite or runtime-core; DO NOT rewrite DEC-0133/0134/0135 bodies; DO NOT wipe R-0120..R-0127; DO NOT reopen US-0133/US-0134/US-0135/BUG-0020; DO NOT mutate US-0137+; DO NOT mark US-0136 DONE; DO NOT tick AC-1..AC-7; DO NOT mutate intake JSON; DO NOT run live paid CI
- critic_nb_execute_awareness:
  - T-003/T-004/T-006/T-009: DQ2 continuation allow-list; Pi continueRecent/fork default-deny; crash orphan discard; SESSION_*/ATTESTATION_* fail-closed; stub context_pack_hash/policy_hash until US-0139/US-0137 (NB1)
  - T-anch..T-010: keep 1:1 architecture seeds; sprint folder is S0142; execute owns role-runtime + SessionSupervisor + RoleCatalog + sidecar + 10 tests; role-runtime vs pi-kernel; sidecar attestation_hash ≠ DEC-0038; DEC-0133/0134/0135 compose held; TS orchestrator scheduling-only (NB2)
  - T-anch: NO-OP verification; reject A2–A9; do not amend isolation/noTools/KernelBridge/auth-models; do not mark DONE; do not reopen US-0135 or BUG-0020; do not design US-0137+ (NB3)
- first_execute_task: T-anch (NO-OP / verification)
- key_locked_artifacts:
  - standalone/packages/role-runtime (@its-magic/role-runtime; no Pi)
  - RoleCatalog DEC-0051 + AUTO_ROLE_* + extra catalog rows
  - SessionSupervisor wrap createSession + inMemory
  - ContinuationContract same-phase run/steer
  - sidecar spawn/start/end + attestation_hash + standalone_attestation
  - fail-closed SESSION_* / ATTESTATION_*
  - assertOrchestratorSchedulingOnly
  - critic/review fresh sessions + parent_phase_session_id
  - crash orphan discard + dispose
  - 10 test_us0136_*
- runtime_proof_id: rp-auto-20260913-us0136-sprint-plan-techlead-20260913T075500Z-US-0136
- proof_hash: ADE16B3E4FC3F643CE7B79049DDB1C829A55B0D4F89F0D1E0CD9BA655FAF0A10
- proof_ttl: 2026-09-13T08:55:00Z
- consumed_architecture_proof: rp-auto-20260913-us0136-architecture-techlead-20260913T073500Z-US-0136 / 3814A075FD13922FD3E8B344CDA11F02BC832845C35245F2D2B5A0B07587E3CD — RUNTIME_PROOF_VALID (MATCH before TTL 2026-09-13T08:35:00Z)
- consumed_critic_proof: rp-auto-20260913-us0136-sovereign-critic-techlead-20260913T074500Z-US-0136 / B312C8FAFAA551E913692A427FE468DFA9C7E7C4EB3DE5CB1A3406B7F4D151EB — MATCH; anti_slop=10; 0 blocking; findings us0136arc-* informational
- next_scheduled_phase: /execute (role=dev)
- next_scheduled_role: dev
- stop_condition: STOP after sprint-plan. Orchestrator MAY spawn sovereign-critic of sprint-plan (CROSS_MODEL_REVIEW=1) then MUST spawn /execute in fresh dev (BUG-0006). Do NOT spawn execute or plan-verify from this tech-lead. Do NOT mark US-0136 DONE. Do NOT tick acceptance. Do NOT reopen US-0135 or BUG-0020. Do NOT mutate US-0137+.

---

## Sprint-plan handoff — US-0135 / S0141 — `/execute` next (fresh dev; ultra_lean)

- sprint_id: S0141
- story_id: US-0135 (Status OPEN — authority docs/product/backlog.md)
- bug_id: (none)
- companion_dec: DEC-0135 Accepted (`decisions/DEC-0135.md`)
- research_anchor: R-0127 (DQ1–DQ10 LOCKED; compose R-0121 / R-0122; do not wipe R-0120..R-0126)
- architecture_anchor: docs/engineering/architecture.md # US-0135
- approach: A1 LOCKED — `standalone/packages/auth-models` (AuthService + ModelRouter + thin catalog + CLI handlers; no Pi imports); pi-kernel AuthRuntimeAdapter wrapping ModelRuntime.create({ authPath, modelsPath }) / three-arg login / checkAuth / in-process registerProvider; owned OS credential dir (XDG / %APPDATA% / macOS Application Support its-magic/, 0600-class); 6-step ModelRouter + provenance; thinking inject independent of slug/TOKEN_PROFILE (clamp+provenance); critic pin + CROSS_MODEL_DEGRADED_MODE; itsm auth / models list / models test; 10 test_us0135_*; fake-model CI default held; empty loader / noTools / KernelBridge unamended; reject A2–A9
- orchestrator_run_id: auto-20260913-us0135
- parent_orchestrator_run_id: auto-20260913-bug0020
- fresh_context_marker: tl-US0135-sprintplan-20260913T043500Z-fresh
- timestamp: 2026-09-13T04:35:00Z (UTC)
- model_id: cursor-grok-4.6-high (CROSS_MODEL_REVIEW=1 — required on isolation)
- sprint_plan_verdict: PASS
- decision_gate: false
- sprint_status: PLANNED (backlog OPEN per US-0045 — not mutated; AC-1..AC-7 unchecked)
- task_count: 10 (T-anch + T-001..T-009; within SPRINT_MAX_TASKS=12; no split; 1:1 architecture seeds)
- ac_surjective_map: AC-1->T-001,T-002,T-003,T-008(T-009 m1-m3); AC-2->T-003,T-004(T-009 m8); AC-3->T-005(T-009 m4); AC-4->T-006(T-009 m5); AC-5->T-007(T-009 m6); AC-6->T-008(T-009 m7); AC-7->T-009(m8,m9,m10); DC->T-anch
- task_order: T-anch -> T-001 -> T-002 -> T-003 -> T-004 -> T-005 -> T-006 -> T-007 -> T-008 -> T-009
- plan-verify: ultra_lean — NOT in resolved_phase_plan; skipped; plan-verify.json is a deferred/skipped placeholder (not a QA phase)
- compose_guards (non-negotiable): DO NOT amend AgentKernel isolation loader / noTools / KernelBridge; DO NOT import Pi outside pi-kernel; DO NOT use ~/.pi/agent as ship store; DO NOT store credentials in project or .env; DO NOT load project .pi/extensions; DO NOT treat Cursor aliases as runtime slugs; DO NOT run live paid CI; DO NOT auto-next-slug on critic collision; DO NOT rewrite DEC-0133/0134 bodies; DO NOT wipe R-0120..R-0126; DO NOT reopen US-0133/US-0134/BUG-0020; DO NOT mutate US-0136+; DO NOT mark US-0135 DONE; DO NOT tick AC-1..AC-7; DO NOT mutate intake JSON
- critic_nb_execute_awareness:
  - T-001/T-002/T-003/T-006/T-009: A1 auth-models + AuthRuntimeAdapter layering locked; thinking clamp+provenance (not MODEL_THINKING_UNSUPPORTED); Windows v1 = %APPDATA% user profile; persist via login api_key not setRuntimeApiKey; OAuth refresh marker locked (NB1)
  - T-anch..T-009: keep 1:1 architecture seeds; sprint folder is S0141; execute owns auth-models + AuthRuntimeAdapter + 10 tests; CLI → auth-models → pi-kernel adapter; DEC-0133/0134 compose held (NB2)
  - T-anch: NO-OP verification; reject A2–A9; do not amend isolation/noTools/KernelBridge; do not mark DONE; do not reopen BUG-0020; do not design US-0136+ (NB3)
- first_execute_task: T-anch (NO-OP / verification)
- key_locked_artifacts:
  - standalone/packages/auth-models (@its-magic/auth-models; no Pi)
  - owned OS credential dir + 0600-class auth.json + InMemoryCredentialStore tests
  - pi-kernel AuthRuntimeAdapter (three-arg login / checkAuth / in-process registerProvider)
  - owned models.json provider matrix
  - ModelRouter 6-step + provenance
  - KernelCreateSessionOptions.thinkingLevel inject (clamp+provenance)
  - critic pin + CROSS_MODEL_DEGRADED_MODE
  - itsm auth / models list / models test
  - 10 test_us0135_*
- runtime_proof_id: rp-auto-20260913-us0135-sprint-plan-techlead-20260913T043500Z-US-0135
- proof_hash: 87447355F56BF42813F4499D6FAB84F1CFC19A8ADDDD82A3EB015D05425BB35B
- proof_ttl: 2026-09-13T05:35:00Z
- consumed_architecture_proof: rp-auto-20260913-us0135-architecture-techlead-20260913T041500Z-US-0135 / 44CCE2BBAB0F863D610152D108DF62D1DACA1F722D2F12CF4DB98067DF1923D7 — RUNTIME_PROOF_VALID (MATCH before TTL 2026-09-13T05:15:00Z)
- consumed_critic_proof: rp-auto-20260913-us0135-sovereign-critic-techlead-20260913T042500Z-US-0135 / F68EFC5ACB6B63B6EB86D5B37589AE781B8CE8EA48539E496AC70AA32D50E68F — MATCH; anti_slop=10; 0 blocking; findings us0135arc-* informational
- next_scheduled_phase: /execute (role=dev)
- next_scheduled_role: dev
- stop_condition: STOP after sprint-plan. Orchestrator MAY spawn sovereign-critic of sprint-plan (CROSS_MODEL_REVIEW=1) then MUST spawn /execute in fresh dev (BUG-0006). Do NOT spawn execute or plan-verify from this tech-lead. Do NOT mark US-0135 DONE. Do NOT tick acceptance. Do NOT reopen BUG-0020. Do NOT mutate US-0136+.

---

## Sprint-plan handoff — BUG-0020 / S0140 — `/execute` next (fresh dev; ultra_lean)

- sprint_id: S0140
- bug_id: BUG-0020 (Status OPEN — authority docs/product/backlog.md)
- story_id: (none — bug segment)
- companion_dec: none (cite R-0126; do not allocate DEC-0136; compose DEC-0124 / DEC-0125 / DEC-0120 / DEC-0132 / BUG-0018 A* / BUG-0019 E* CLI TUI)
- research_anchor: R-0126 (DQ1–DQ8 LOCKED; compose R-0125 / R-0124)
- architecture_anchor: docs/engineering/architecture.md # BUG-0020
- approach: E2 LOCKED — honest host-cannot-do-both on desktop Command.Info; keep editor.add → runAutoLifecycle; C-limb CLI TUI /auto via shipping .opencode/tui.json listing ./plugins/its-magic-auto/tui.ts; keep existing tui.ts keymap; desktop-visible OPENCODE_AUTO_DESKTOP_COMMAND_INFO_LISTING_UNSUPPORTED (not TUI-toast-only); 8 test_bug0020_*; upgrade copy-if-absent / JSONC-merge tui.json + still prune leftover auto.md; supersede R-0124 E* picker claim; reject E2-A..E2-G
- orchestrator_run_id: auto-20260913-bug0020
- fresh_context_marker: tl-BUG0020-sprintplan-20260912T234500Z-fresh
- timestamp: 2026-09-12T23:45:00Z (UTC)
- model_id: cursor-grok-4.6 (CROSS_MODEL_REVIEW=1 — required on isolation)
- sprint_plan_verdict: PASS
- decision_gate: false
- sprint_status: PLANNED (backlog OPEN per US-0045 — not mutated; acceptance BUG-0020 unchecked)
- task_count: 8 (T-anch + T-001..T-007; within SPRINT_MAX_TASKS=12; no split; 1:1 architecture seeds)
- ac_surjective_map: AC-1->T-001,T-005(m5,m6); AC-2->T-002,T-003,T-005(m3,m6); AC-3->T-003,T-004,T-005(m1,m4),T-007; AC-4->T-002,T-005(m2); AC-5->T-002,T-005(m2); AC-6->T-002,T-005(m3); AC-7->T-006,T-005(m8); AC-8->T-007,T-005(m7); AC-9->T-anch,T-002; AC-10->T-005; DC->T-anch
- task_order: T-anch -> T-001 -> T-002 -> T-003 -> T-004 -> T-005 -> T-006 -> T-007
- plan-verify: ultra_lean — NOT in resolved_phase_plan; skipped; plan-verify.json is a deferred/skipped placeholder (not a QA phase)
- compose_guards (non-negotiable): DO NOT author DEC-0136; DO NOT rewrite DEC-0124/0125 bodies; DO NOT rewrite historical # BUG-0019 / # BUG-0018 / R-0124 / R-0120 bodies; DO NOT reopen BUG-0015/0016/0017/0018/0019; DO NOT restore STOP-only auto.md; DO NOT add JSON commands.auto template; DO NOT ship kit cli.json or plugin-local its-magic-auto/tui.json; DO NOT live OpenCode desktop probe; DO NOT invent desktop execute-only Command.Info listing API; DO NOT wholesale overwrite operator tui.json theme/keybinds; DO NOT touch .cursor/commands/auto.md or .opencode/agents/auto.md; DO NOT weaken test_bug0018_*; DO NOT weaken test_bug0019_* except compose-only comments; DO NOT drain US-0135+; DO NOT mark BUG-0020 DONE; DO NOT tick acceptance BUG-0020 row; DO NOT mutate intake JSON
- critic_nb_execute_awareness:
  - T-001/T-003/T-004/T-005: execute owns tui.json + emit helper + tests; restoring auto.md recreates 0018; JSON template is 0018-class; TUI-toast-only emission forbidden; silent desktop miss forbidden; do not claim tui.json feeds Command.Info (NB1)
  - T-anch..T-007: keep 1:1 architecture seeds; sprint folder is S0140; execute owns surfaces including exact desktop notification channel within locked helper (NB2)
  - T-anch: NO-OP verification; reject E2-A..E2-G; no companion DEC; do not mark DONE; do not reopen BUG-0019 (NB3)
- first_execute_task: T-anch (NO-OP / verification)
- key_locked_artifacts:
  - .opencode/tui.json (+ template twin) listing ./plugins/its-magic-auto/tui.ts
  - retain its-magic-auto/tui.ts keymap slash/slashName "auto"
  - retain orchestrator.ts editor.add auto execute
  - emitDesktopCommandInfoListingUnsupported (not TUI-toast-only)
  - OPENCODE_AUTO_DESKTOP_COMMAND_INFO_LISTING_UNSUPPORTED
  - 8 test_bug0020_*
  - upgrade copy-if-absent / JSONC-merge tui.json + keep auto.md prune
  - installer-owned-paths named rows for .opencode/tui.json
  - check_intake_template_parity.py additive BUG0020_PAIRS
- runtime_proof_id: rp-auto-20260913-bug0020-sprint-plan-techlead-20260912T234500Z-BUG-0020
- proof_hash: 48453D60EC7A0FF0E77A2DB134534920099CDB90875EABB07CD2653880427193
- proof_ttl: 2026-09-13T00:45:00Z
- consumed_architecture_proof: rp-auto-20260913-bug0020-architecture-techlead-20260912T232500Z-BUG-0020 / 92D10D4743D65A2F7AF276A45749FB57DFA15593254213488026D10171C2EC87 — RUNTIME_PROOF_VALID (MATCH before TTL 2026-09-13T00:25:00Z)
- next_scheduled_phase: /execute (role=dev)
- next_scheduled_role: dev
- stop_condition: STOP after sprint-plan. Orchestrator MAY spawn sovereign-critic of sprint-plan (CROSS_MODEL_REVIEW=1) then MUST spawn /execute in fresh dev (BUG-0006). Do NOT spawn execute or plan-verify from this tech-lead. Do NOT mark BUG-0020 DONE. Do NOT tick acceptance. Do NOT reopen BUG-0019.

---

## Sprint-plan handoff — BUG-0019 / S0139 — `/execute` next (fresh dev; ultra_lean)

- sprint_id: S0139
- bug_id: BUG-0019 (Status OPEN — authority docs/product/backlog.md)
- story_id: (none — bug segment)
- companion_dec: none (cite R-0124; do not allocate DEC-0135; compose DEC-0124 / DEC-0125 / DEC-0120 / DEC-0132 / BUG-0018 A*)
- research_anchor: R-0124 (DQ1–DQ8 LOCKED; compose R-0123 / R-0120)
- architecture_anchor: docs/engineering/architecture.md # BUG-0019
- approach: E1 / E* LOCKED — TUI keymap slash/slashName "auto" lists /auto; run() → context.client / plugin RPC → runAutoLifecycle; keep editor.add; additive sibling .opencode/plugins/its-magic-auto/{index.ts,tui.ts} (keep flat orchestrator.ts); no cli.json; OPENCODE_AUTO_SLASH_LISTING_UNSUPPORTED + OPENCODE_AUTO_TUI_DISPATCH_UNSUPPORTED; 7 test_bug0019_*; upgrade copy listing files + still prune leftover auto.md; supersede R-0120 DQ5 / # BUG-0018 NB1; reject E2–E7
- orchestrator_run_id: auto-20260912-bug0019
- fresh_context_marker: tl-BUG0019-sprintplan-20260912T182500Z-fresh
- timestamp: 2026-09-12T18:30:00Z (UTC)
- model_id: cursor-grok-4.6 (CROSS_MODEL_REVIEW=1 — required on isolation)
- sprint_plan_verdict: PASS
- decision_gate: false
- sprint_status: PLANNED (backlog OPEN per US-0045 — not mutated; acceptance BUG-0019 unchecked)
- task_count: 8 (T-anch + T-001..T-007; within SPRINT_MAX_TASKS=12; no split; 1:1 architecture seeds)
- ac_surjective_map: AC-1->T-001,T-005(m4); AC-2->T-003,T-004,T-005(m5); AC-3->T-002,T-005(m1),T-anch; AC-4->T-002,T-005(m3); AC-5->T-002,T-005(m2); AC-6->T-001,T-004,T-005(m4); AC-7->T-006,T-007,T-005(m6,m7); DC->T-anch
- task_order: T-anch -> T-001 -> T-002 -> T-003 -> T-004 -> T-005 -> T-006 -> T-007
- plan-verify: ultra_lean — NOT in resolved_phase_plan; skipped; plan-verify.json is a deferred/skipped placeholder (not a QA phase)
- compose_guards (non-negotiable): DO NOT author DEC-0135; DO NOT rewrite DEC-0124/0125 bodies; DO NOT rewrite historical # BUG-0018 body / R-0120 body; DO NOT reopen BUG-0015/0016/0017/0018; DO NOT restore STOP-only auto.md; DO NOT add JSON commands.auto template; DO NOT convert orchestrator.ts to package; DO NOT ship kit cli.json/tui.json; DO NOT live OpenCode probe; DO NOT touch .cursor/commands/auto.md or .opencode/agents/auto.md; DO NOT weaken test_bug0018_*; DO NOT drain US-0135+; DO NOT mark BUG-0019 DONE; DO NOT tick acceptance BUG-0019 row; DO NOT mutate intake JSON; index.ts must NOT editor.add({ name: "auto" })
- critic_nb_execute_awareness:
  - T-001/T-003/T-005: execute owns its-magic-auto + invoke wiring + tests; restoring auto.md recreates 0018; JSON template is 0018-class; silent missing-command without listing token forbidden; index.ts must not second editor.add (NB1)
  - T-anch..T-007: keep 1:1 architecture seeds; sprint folder is S0139; execute owns surfaces including exact client invoke / optional orchestrator RPC (NB2)
  - T-anch: NO-OP verification; reject E2–E7; no companion DEC; do not mark DONE; do not reopen BUG-0018 (NB3)
- first_execute_task: T-anch (NO-OP / verification)
- key_locked_artifacts:
  - .opencode/plugins/its-magic-auto/{index.ts,tui.ts} (+ template twins)
  - TUI keymap slash/slashName "auto"
  - run() → context.client / plugin RPC → runAutoLifecycle
  - retain orchestrator.ts editor.add auto execute
  - OPENCODE_AUTO_SLASH_LISTING_UNSUPPORTED + OPENCODE_AUTO_TUI_DISPATCH_UNSUPPORTED
  - 7 test_bug0019_*
  - upgrade copy listing files + keep auto.md prune
  - installer-owned-paths named rows if required
  - check_intake_template_parity.py additive its-magic-auto/ pair
- runtime_proof_id: rp-auto-20260912-bug0019-sprint-plan-techlead-20260912T183000Z-BUG-0019
- proof_hash: CE7CBD5F51EA25108B6C877ED94B2A9189CD1D9DADA761B70A1A4ACAF200A6D0
- proof_ttl: 2026-09-12T19:30:00Z
- consumed_architecture_proof: rp-auto-20260912-bug0019-architecture-techlead-20260912T181500Z-BUG-0019 / 467370D2B9622A20D2659B59116522D4E7D8F42B65253A936F40A0A72C729970 — RUNTIME_PROOF_VALID (MATCH before TTL 2026-09-12T19:15:00Z)
- next_scheduled_phase: /execute (role=dev)
- next_scheduled_role: dev
- stop_condition: STOP after sprint-plan. Orchestrator MAY spawn sovereign-critic of sprint-plan (CROSS_MODEL_REVIEW=1) then MUST spawn /execute in fresh dev (BUG-0006). Do NOT spawn execute or plan-verify from this tech-lead. Do NOT mark BUG-0019 DONE. Do NOT tick acceptance. Do NOT reopen BUG-0018.

---

## Architecture handoff — BUG-0019 — `/sprint-plan` next (fresh tech-lead; ultra_lean plan macro)

- bug_id: BUG-0019 (Status OPEN — authority docs/product/backlog.md)
- story_id: (none — bug segment)
- sprint_id: (pending — materialize at /sprint-plan)
- dec_id: none (companion DEC not required; cite R-0124; do not allocate DEC-0135; compose DEC-0124 / DEC-0125 / DEC-0120 / DEC-0132 / BUG-0018 A*)
- research_anchor: R-0124 (DQ1–DQ8 LOCKED)
- architecture_anchor: docs/engineering/architecture.md # BUG-0019
- approach: E1 / E* LOCKED — TUI keymap slash/slashName "auto" lists /auto; run() → context.client / plugin RPC → runAutoLifecycle; keep editor.add; additive sibling .opencode/plugins/its-magic-auto/{index.ts,tui.ts} (keep flat orchestrator.ts); no cli.json; OPENCODE_AUTO_SLASH_LISTING_UNSUPPORTED + OPENCODE_AUTO_TUI_DISPATCH_UNSUPPORTED; 7 test_bug0019_*; upgrade copy listing files + still prune leftover auto.md; supersede R-0120 DQ5 / # BUG-0018 NB1; reject E2–E7
- orchestrator_run_id: auto-20260912-bug0019
- fresh_context_marker: tl-BUG0019-architecture-20260912T181000Z-fresh
- timestamp: 2026-09-12T18:15:00Z (UTC)
- model_id: cursor-grok-4.6 (CROSS_MODEL_REVIEW=1)
- architecture_verdict: PASS
- decision_gate: false
- critic_nb_closures: NB1 sibling its-magic-auto + client invoke (T-001/T-003); NB2 E1 + 7 tests + listing token (T-004/T-005); NB3 no companion DEC / no DONE / no auto.md restore (T-anch)
- task_seeds: T-anch + T-001..T-007 (8; under SPRINT_MAX_TASKS=12) — refine into next free sprint id at /sprint-plan
- compose_guards (non-negotiable): DO NOT author DEC-0135; DO NOT rewrite DEC-0124/0125 bodies; DO NOT rewrite historical # BUG-0018 body; DO NOT reopen BUG-0015/0016/0017/0018; DO NOT restore STOP-only auto.md; DO NOT add JSON commands.auto template; DO NOT convert orchestrator.ts to package; DO NOT live OpenCode probe; DO NOT touch .cursor/commands/auto.md or .opencode/agents/auto.md; DO NOT drain US-0135+; DO NOT mark BUG-0019 DONE; DO NOT tick acceptance BUG-0019 row
- files_to_touch (execute foreshadow): add .opencode/plugins/its-magic-auto/{index.ts,tui.ts} + template twins; orchestrator.ts REASON_CODES + optional RPC wrapper; installer.py/sh/ps1 copy+existing prune; installer-owned-paths named rows; check_intake_template_parity.py additive pair; tests/bug0019_*; runbook stub + upgrade recipe
- files_NOT_to_touch: DEC-0124.md / DEC-0125.md bodies; # BUG-0018 historical body; R-0120 body; Cursor auto.md; OpenCode agents/auto.md; intake JSON; acceptance tick; US-0135+ bodies
- next_phase: `/sprint-plan` (fresh tech-lead per US-0069 / DEC-0051; third canonical phase of `plan` macro per ultra_lean). Orchestrator runs sovereign-critic of architecture first (CROSS_MODEL_REVIEW=1) then spawns sprint-plan. Do not mandate outer driver.
- runtime_proof_id: rp-auto-20260912-bug0019-architecture-techlead-20260912T181500Z-BUG-0019
- proof_hash: 467370D2B9622A20D2659B59116522D4E7D8F42B65253A936F40A0A72C729970
- proof_ttl: 2026-09-12T19:15:00Z (UTC)
- prior_phase_proof_consumed: rp-auto-20260912-bug0019-research-techlead-20260912T175800Z-BUG-0019 (proof_hash=D67B1BF49AF607EC472297AD62B949798D51ED92B5CE85B0068CAABB009F3854, ttl=2026-09-12T18:58:00Z)
- stop_condition: STOP after architecture PASS. Orchestrator owns critic of architecture then /sprint-plan in fresh tech-lead subagent per BUG-0006. Do not spawn /sprint-plan or /execute from this subagent. Do not mark BUG-0019 DONE. Do not execute implementation.

---

## Sprint-plan handoff — US-0134 / S0138 — /execute next (fresh dev; ultra_lean)


- sprint_id: S0138
- story_id: US-0134 (Status OPEN — authority docs/product/backlog.md)
- bug_id: (none)
- companion_dec: DEC-0134 (Accepted)
- research_anchor: R-0122 (DQ1–DQ10 LOCKED; do not wipe R-0120 / R-0121)
- architecture_anchor: docs/engineering/architecture.md # US-0134
- approach: A1 LOCKED — standalone/packages/kernel-bridge; three-marker parent walk + --kernel-root; DEC-0045 version + its_magic/kernel-contract.json; supported-kernel-range.json + semver@7.8.5 includePrerelease (kit 0.1.3-9 in-range); spawn real Python (probe then resolved interpreter); four KERNEL_* codes; thin uat/status wrappers; 10 test_us0134_*; reject A2–A5
- orchestrator_run_id: auto-20260912-us0134
- parent_orchestrator_run_id: auto-20260912-us0133
- fresh_context_marker: tl-US0134-sprintplan-20260912T125500Z-fresh
- timestamp: 2026-09-12T12:55:00Z (UTC)
- model_id: cursor-grok-4.6 (CROSS_MODEL_REVIEW=1 — required on isolation)
- sprint_plan_verdict: PASS
- decision_gate: false
- sprint_status: PLANNED (backlog OPEN per US-0045 — not mutated; acceptance US-0134 unchecked)
- task_count: 10 (T-anch + T-001..T-009; within SPRINT_MAX_TASKS=12; no split; 1:1 architecture seeds)
- ac_surjective_map: AC-1->T-001,T-005,T-007,T-009; AC-2->T-002,T-009; AC-3->T-003; AC-4->T-004,T-005,T-007; AC-5->T-006; AC-6->T-008; DC->T-anch
- task_order: T-anch -> T-001 -> T-002 -> T-003 -> T-004 -> T-005 -> T-006 -> T-007 -> T-008 -> T-009
- plan-verify: ultra_lean — NOT in resolved_phase_plan; skipped; plan-verify.json NOT written here
- compose_guards (non-negotiable): DO NOT extract its-magic-kernel/; DO NOT rewrite validators in TypeScript; DO NOT reuse OpenCode US-0125 plugin as the standalone bridge; DO NOT emit OPENCODE_* on standalone path; DO NOT amend AgentKernel / # US-0133 / DEC-0133; DO NOT reopen BUG-0018; DO NOT wipe R-0120/R-0121; DO NOT rewrite architecture.md / DEC-0134 / R-0122; DO NOT mark US-0134 DONE; DO NOT tick acceptance US-0134 row; DO NOT mutate intake JSON; DO NOT design US-0135+; DO NOT put range in RuntimeConfig (US-0138); DO NOT wrap all kit scripts
- critic_nb_execute_awareness:
  - T-002/T-004/T-008/T-009: R1 includePrerelease + 0.1.3-9/0.1.2 fixtures; R2 probe then resolved interpreter; R3 fail-closed missing manifest (NB1)
  - T-anch..T-009: keep 1:1 architecture seeds; sprint folder is S0138; execute owns kernel-bridge + tests + installer include-list (NB2)
  - T-anch: NO-OP verification; reject A2–A5; no extract; no TS rewrite; do not mark DONE (NB3)
- first_execute_task: T-anch (NO-OP / verification)
- key_locked_artifacts:
  - standalone/packages/kernel-bridge (@its-magic/kernel-bridge, no Pi)
  - three-marker locate + --kernel-root
  - its_magic/kernel-contract.json + supported-kernel-range.json + semver@7.8.5
  - four KERNEL_* handshake codes
  - Python spawn (resolved interpreter; 60s; raw Python reason codes)
  - runValidator allowlist + thin runUatPlanner / runStatusReconcile
  - status_reconcile_validate.py (read-only)
  - 10 test_us0134_* (standalone node:test + kit pytest twin; temp fixtures)
  - installer include-list + runbook upgrade recipe
- runtime_proof_id: rp-auto-20260912-us0134-sprint-plan-techlead-20260912T125500Z-US-0134
- proof_hash: FEFE3644C154CB5BFF798CE4E0FAFE0032E7DCC1E60045C5EFECE17ED7A0E1B5
- proof_ttl: 2026-09-12T13:55:00Z
- consumed_architecture_proof: rp-auto-20260912-us0134-architecture-techlead-20260912T124500Z-US-0134 / D7686414BA2C17E2053CD7DA5279B56F6B56F9D814CCD46D021A12A870CE2704 — RUNTIME_PROOF_VALID
- next_scheduled_phase: /execute (role=dev)
- next_scheduled_role: dev
- stop_condition: STOP after sprint-plan. Orchestrator MAY spawn sovereign-critic of sprint-plan (CROSS_MODEL_REVIEW=1) then MUST spawn /execute in fresh dev (BUG-0006). Do NOT spawn execute or plan-verify from this tech-lead. Do NOT mark US-0134 DONE. Do NOT reopen US-0133 or BUG-0018. Do NOT design US-0135+.

---

## Architecture handoff — US-0134 — `/sprint-plan` next (fresh tech-lead; ultra_lean plan macro)

- story_id: US-0134 (Status OPEN — authority docs/product/backlog.md)
- bug_id: (none)
- sprint_id: (pending — materialize at /sprint-plan)
- dec_id: DEC-0134 (Accepted)
- research_anchor: R-0122 (DQ1–DQ10 LOCKED)
- architecture_anchor: docs/engineering/architecture.md # US-0134
- approach: A1 LOCKED — standalone/packages/kernel-bridge; three-marker parent walk + --kernel-root; DEC-0045 version + its_magic/kernel-contract.json; supported-kernel-range.json + semver@7.8.5 includePrerelease (kit 0.1.3-9 in-range); spawn real Python; four KERNEL_* codes; thin uat/status wrappers; 10 test_us0134_*; reject A2–A5
- orchestrator_run_id: auto-20260912-us0134
- fresh_context_marker: tl-US0134-architecture-20260912T124500Z-fresh
- timestamp: 2026-09-12T12:45:00Z (UTC)
- model_id: cursor-grok-4.6 (CROSS_MODEL_REVIEW=1)
- architecture_verdict: PASS
- decision_gate: false
- critic_nb_closures: NB1 includePrerelease + resolved interpreter + fail-closed mismatch (T-002/T-004/T-008/T-009); NB2 H1+DEC-0134+API+semver pin+status schema (this phase); NB3 no sprint-plan spawn / no extract / no DONE (T-anch)
- task_seeds: T-anch + T-001..T-009 (10; under SPRINT_MAX_TASKS=12) — refine into next free sprint id at /sprint-plan
- compose_guards (non-negotiable): DO NOT extract its-magic-kernel/; DO NOT rewrite validators in TypeScript; DO NOT reuse OpenCode US-0125 plugin as the standalone bridge; DO NOT emit OPENCODE_* on standalone path; DO NOT amend AgentKernel / # US-0133 / DEC-0133; DO NOT reopen BUG-0018; DO NOT wipe R-0120/R-0121; DO NOT mark US-0134 DONE; DO NOT tick acceptance US-0134 row; DO NOT design US-0135+
- files_to_touch (execute foreshadow): standalone/packages/kernel-bridge; its_magic/kernel-contract.json + template twin; supported-kernel-range.json; scripts/status_reconcile_validate.py; installer-owned-paths allowlist scripts; 10 test_us0134_*; kit tests/us0134_contract_test.py; CI standalone job extend
- files_NOT_to_touch: packages/pi-kernel AgentKernel; .opencode/ plugin execute; DEC-0124/0125 bodies; BUG-0018 surfaces; US-0135+ bodies; intake JSON; acceptance tick; # US-0133
- next_phase: `/sprint-plan` (fresh tech-lead per US-0069 / DEC-0051; third canonical phase of `plan` macro per ultra_lean). Orchestrator runs sovereign-critic of architecture first (CROSS_MODEL_REVIEW=1) then spawns sprint-plan. Do not mandate outer driver.
- runtime_proof_id: rp-auto-20260912-us0134-architecture-techlead-20260912T124500Z-US-0134
- proof_hash: D7686414BA2C17E2053CD7DA5279B56F6B56F9D814CCD46D021A12A870CE2704
- proof_ttl: 2026-09-12T13:45:00Z (UTC)
- prior_phase_proof_consumed: rp-auto-20260912-us0134-research-techlead-20260912T123500Z-US-0134 (proof_hash=5C25F84CEC351C1C21FB84DB65A8CAC8071F5598DDDFBF774226935C9FD30927, ttl=2026-09-12T13:35:00Z)
- stop_condition: STOP after architecture PASS. Orchestrator owns critic of architecture then /sprint-plan in fresh tech-lead subagent per BUG-0006. Do not spawn /sprint-plan or /execute from this subagent. Do not mark US-0134 DONE. Do not execute implementation.

---

## Sprint-plan handoff — US-0133 / S0137 — /execute next (fresh dev; ultra_lean)

- sprint_id: S0137
- story_id: US-0133 (Status OPEN — authority docs/product/backlog.md)
- bug_id: (none)
- companion_dec: DEC-0133 (Accepted)
- research_anchor: R-0121 (DQ1–DQ10 LOCKED; do not wipe R-0120)
- architecture_anchor: docs/engineering/architecture.md # US-0133
- approach: A1 LOCKED — in-tree standalone/ npm workspaces; real packages/pi-kernel AgentKernel; empty DefaultResourceLoader overrides + noTools builtin + itsm_ping allowlist; pin 0.85.1; Phase 0 items 1/2/3/5 only; no OS-sandbox; no branding lock; reject A2–A5
- orchestrator_run_id: auto-20260912-us0133
- parent_orchestrator_run_id: auto-20260912-bug0018
- fresh_context_marker: tl-US0133-sprintplan-20260912T112500Z-fresh
- timestamp: 2026-09-12T11:25:00Z (UTC)
- model_id: cursor-grok-4.6 (CROSS_MODEL_REVIEW=1 — required on isolation)
- sprint_plan_verdict: PASS
- decision_gate: false
- sprint_status: PLANNED (backlog OPEN per US-0045 — not mutated; acceptance US-0133 unchecked)
- task_count: 10 (T-anch + T-001..T-009; within SPRINT_MAX_TASKS=12; no split; 1:1 architecture seeds)
- ac_surjective_map: AC-1->T-001,T-002,T-008; AC-2->T-003,T-006; AC-3->T-005; AC-4->T-004; AC-5->T-007; AC-6->T-002,T-009; DC->T-anch
- task_order: T-anch -> T-001 -> T-002 -> T-003 -> T-004 -> T-005 -> T-006 -> T-007 -> T-008 -> T-009
- plan-verify: ultra_lean — NOT in resolved_phase_plan; skipped; plan-verify.json NOT written here
- compose_guards (non-negotiable): DO NOT fold standalone/ into kit its-magic files or workspaces; DO NOT implement KernelBridge (US-0134); DO NOT implement ToolBroker (US-0137); DO NOT claim OS sandbox; DO NOT lock public branding; DO NOT reopen BUG-0018; DO NOT wipe R-0120; DO NOT rewrite architecture.md / DEC-0133 / R-0121; DO NOT mark US-0133 DONE; DO NOT tick acceptance US-0133 row; DO NOT mutate intake JSON; DO NOT live-provider CI as AC-5 gate
- critic_nb_execute_awareness:
  - T-004/T-005/T-007: R2 planted-extension fixture; R3 fake Model inject; R6 files omit-guard; trusted still empty loader (NB1)
  - T-anch..T-009: keep 1:1 architecture seeds; sprint folder is S0137 not S0133 (NB2)
  - T-anch: NO-OP verification; Phase 0 items 1/2/3/5 only; reject A2–A5 + §30 stub farm; do not mark DONE (NB3)
- first_execute_task: T-anch (NO-OP / verification)
- key_locked_artifacts:
  - standalone/ npm workspaces + apps/cli stub + packages/pi-kernel AgentKernel
  - kit files omit-guard + guard_installer_publish fail-closed
  - isolation loader + PI_COMPAT_RESOURCES=off + itsm_ping factory
  - import-boundary Biome + grep
  - 10 test_us0133_* (standalone node:test + kit pytest twin)
  - CI Windows/Linux working-directory standalone (not kit TEST_COMMAND)
  - standalone/docs/phase0-kernel-spike.md
- runtime_proof_id: rp-auto-20260912-us0133-sprint-plan-techlead-20260912T112500Z-US-0133
- proof_hash: A702E976CD3B489CF0CE3F0CD02482BF19088CB5F02DA183606CD811C322A0C3
- proof_ttl: 2026-09-12T12:25:00Z
- consumed_architecture_proof: rp-auto-20260912-us0133-architecture-techlead-20260912T111500Z-US-0133 / 825C6B9EDE5BDC0BFE3911BFA93B3A6AFE2E14BFE2523F4528B07B121897A5B7 — RUNTIME_PROOF_VALID
- next_scheduled_phase: /execute (role=dev)
- next_scheduled_role: dev
- stop_condition: STOP after sprint-plan. Orchestrator MAY spawn sovereign-critic of sprint-plan (CROSS_MODEL_REVIEW=1) then MUST spawn /execute in fresh dev (BUG-0006). Do NOT spawn execute or plan-verify from this tech-lead. Do NOT mark US-0133 DONE. Do NOT reopen BUG-0018. Do NOT design US-0134+.

---

## Architecture handoff — US-0133 — `/sprint-plan` next (fresh tech-lead; ultra_lean plan macro)

- story_id: US-0133 (Status OPEN — authority docs/product/backlog.md)
- bug_id: (none)
- sprint_id: (pending — materialize at /sprint-plan)
- dec_id: DEC-0133 (Accepted)
- research_anchor: R-0121 (DQ1–DQ10 LOCKED)
- architecture_anchor: docs/engineering/architecture.md # US-0133
- approach: A1 LOCKED — in-tree standalone/ npm workspaces; real packages/pi-kernel AgentKernel; empty DefaultResourceLoader overrides + noTools builtin + itsm_ping allowlist; pin 0.85.1; Phase 0 items 1/2/3/5 only; no OS-sandbox; no branding lock; reject A2–A5
- orchestrator_run_id: auto-20260912-us0133
- fresh_context_marker: tl-US0133-architecture-20260912T111500Z-fresh
- timestamp: 2026-09-12T11:15:00Z (UTC)
- model_id: cursor-grok-4.6 (CROSS_MODEL_REVIEW=1)
- architecture_verdict: PASS
- decision_gate: false
- critic_nb_closures: NB1 empty loader + fake Model (T-004/T-007); NB2 H1+DEC-0133 authored; KernelBridge/ToolBroker out (T-anch); NB3 no sprint-plan spawn / no DONE / Phase 0 subset (T-anch)
- task_seeds: T-anch + T-001..T-009 (10; under SPRINT_MAX_TASKS=12) — refine into next free sprint id at /sprint-plan
- compose_guards (non-negotiable): DO NOT fold standalone/ into kit its-magic files; DO NOT implement KernelBridge (US-0134); DO NOT implement ToolBroker (US-0137); DO NOT claim OS sandbox; DO NOT lock public branding; DO NOT reopen BUG-0018; DO NOT wipe R-0120; DO NOT mark US-0133 DONE; DO NOT tick acceptance US-0133 row
- files_to_touch (execute foreshadow): standalone/ workspace; packages/pi-kernel; apps/cli stub; kit files guard; 10 test_us0133_*; CI windows/linux standalone job; standalone/docs/phase0-kernel-spike.md
- files_NOT_to_touch: kit template OpenCode/Cursor packs; DEC-0124/0125; BUG-0018 surfaces; US-0134+ bodies; intake JSON; acceptance tick
- next_phase: `/sprint-plan` (fresh tech-lead per US-0069 / DEC-0051; third canonical phase of `plan` macro per ultra_lean). Orchestrator runs sovereign-critic of architecture first (CROSS_MODEL_REVIEW=1) then spawns sprint-plan. Do not mandate outer driver.
- runtime_proof_id: rp-auto-20260912-us0133-architecture-techlead-20260912T111500Z-US-0133
- proof_hash: 825C6B9EDE5BDC0BFE3911BFA93B3A6AFE2E14BFE2523F4528B07B121897A5B7
- proof_ttl: 2026-09-12T12:15:00Z (UTC)
- prior_phase_proof_consumed: rp-auto-20260912-us0133-research-techlead-20260912T110500Z-US-0133 (proof_hash=C2A48622B0322E60A0EBC335A60D0CF71911F97CDFC5C713C2CF2B6348B9AF3A, ttl=2026-09-12T12:05:00Z)
- stop_condition: STOP after architecture PASS. Orchestrator owns critic of architecture then /sprint-plan in fresh tech-lead subagent per BUG-0006. Do not spawn /sprint-plan or /execute from this subagent. Do not mark US-0133 DONE. Do not execute implementation.

---

## Sprint-plan handoff — BUG-0018 / S0136 — /execute next (fresh dev; ultra_lean)

- sprint_id: S0136
- bug_id: BUG-0018 (Status OPEN — authority docs/product/backlog.md)
- story_id: (none — bug segment)
- companion_dec: none (cite R-0120; compose DEC-0124 / DEC-0125 / DEC-0120 / DEC-0132)
- research_anchor: R-0120 (DQ1–DQ8 LOCKED)
- architecture_anchor: docs/engineering/architecture.md # BUG-0018
- approach: A* LOCKED — plugin-only `/auto`; remove colliding auto.md (active+template); keep editor.add execute → runAutoLifecycle; targeted upgrade prune; OPENCODE_AUTO_MARKDOWN_COLLISION; 6 test_bug0018_*; compose-only inventory/if-present/plant-path; reject A2–A7
- orchestrator_run_id: auto-20260912-bug0018
- fresh_context_marker: tl-BUG0018-sprintplan-20260912T101000Z-fresh
- timestamp: 2026-09-12T10:10:00Z (UTC)
- model_id: cursor-grok-4.6 (CROSS_MODEL_REVIEW=1 — required on isolation)
- sprint_plan_verdict: PASS
- decision_gate: false
- sprint_status: PLANNED (backlog OPEN per US-0045 — not mutated; acceptance BUG-0018 unchecked)
- task_count: 8 (T-anch + T-001..T-007; within SPRINT_MAX_TASKS=12; no split; 1:1 architecture seeds)
- ac_surjective_map: AC-1->T-001,T-002,T-005; AC-2->T-001,T-004,T-005(m1); AC-3->T-002,T-005(m2); AC-4->T-003,T-005(m4),T-006; AC-5->T-002,T-003,T-005(m6),T-006; AC-6->T-001,T-002,T-004,T-005(m3),T-007; AC-7->T-002,T-004,T-005(m5); DC->T-anch
- task_order: T-anch -> T-001 -> T-002 -> T-003 -> T-004 -> T-005 -> T-006 -> T-007
- plan-verify: ultra_lean — NOT in resolved_phase_plan; skipped; plan-verify.json NOT written here
- compose_guards (non-negotiable): DO NOT author companion DEC; DO NOT rewrite DEC-0124/0125 bodies; DO NOT rewrite historical # BUG-0015 CF1 cell; DO NOT reopen BUG-0015/0016/0017; DO NOT general template-absent sweeper; DO NOT touch .cursor/commands/auto.md or .opencode/agents/auto.md; DO NOT live OpenCode probe; DO NOT plugin-delete leftover auto.md; DO NOT mark BUG-0018 DONE; DO NOT tick acceptance BUG-0018 row; DO NOT mutate intake JSON; DO NOT rewrite architecture.md / R-0120
- critic_nb_execute_awareness:
  - T-001/T-003/T-005: execute owns delete + prune + tests (NB1); R1 listing residual via plugin add; R2 leftover prune; R6 unlink print OPENCODE_AUTO_MARKDOWN_COLLISION
  - T-anch..T-007: keep 1:1 architecture seeds (NB2)
  - T-anch: NO-OP verification; reject A2–A7 + companion DEC; do not mark DONE (NB3)
- first_execute_task: T-anch (NO-OP / verification)
- key_locked_artifacts:
  - delete .opencode/commands/auto.md + template twin
  - orchestrator.ts REASON_CODES + leftover fail-closed (plugin does not delete)
  - installer.py/sh/ps1 targeted prune on upgrade --host opencode|both
  - compose us0125 15→14 / BUG0015_PAIRS drop auto.md / bug0017 plant intake.md / if-present named tests
  - 6 test_bug0018_* markers
  - runbook prune recipe + OPENCODE_AUTO_MARKDOWN_COLLISION stub (US-0126 cross-link)
- runtime_proof_id: rp-auto-20260912-bug0018-sprint-plan-techlead-20260912T101000Z-BUG-0018
- proof_hash: 56DAA01EAC3125E806C6A10A1EBBD140CFAF20782B68776F56A71D1B9351CC28
- proof_ttl: 2026-09-12T11:10:00Z
- consumed_architecture_proof: rp-auto-20260912-bug0018-architecture-techlead-20260912T100000Z-BUG-0018 / 076F4C6E4744AB44B4751AF821572EB7082C8103EBD0091C9BC6EAB88351AA0B — RUNTIME_PROOF_VALID
- next_scheduled_phase: /execute (role=dev)
- next_scheduled_role: dev
- stop_condition: STOP after sprint-plan. Orchestrator MAY spawn sovereign-critic of sprint-plan (CROSS_MODEL_REVIEW=1) then MUST spawn /execute in fresh dev (BUG-0006). Do NOT spawn execute or plan-verify from this tech-lead. Do NOT mark BUG-0018 DONE. Do NOT reopen BUG-0015/BUG-0016/BUG-0017.

---

## Architecture handoff — BUG-0018 — `/sprint-plan` next (fresh tech-lead; ultra_lean plan macro)

- bug_id: BUG-0018 (Status OPEN — authority docs/product/backlog.md)
- story_id: (none — bug segment)
- sprint_id: (pending — materialize at /sprint-plan)
- dec_id: none (companion DEC not required; cite R-0120; compose DEC-0124 / DEC-0125 / DEC-0120)
- research_anchor: R-0120 (DQ1–DQ8 LOCKED)
- architecture_anchor: docs/engineering/architecture.md # BUG-0018
- approach: A* LOCKED — plugin-only `/auto`; remove colliding auto.md (active+template); keep editor.add execute → runAutoLifecycle; targeted upgrade prune; OPENCODE_AUTO_MARKDOWN_COLLISION; 6 test_bug0018_*; supersede # BUG-0015 CF1; reject A2–A7
- orchestrator_run_id: auto-20260912-bug0018
- fresh_context_marker: tl-BUG0018-architecture-20260912T100000Z-fresh
- timestamp: 2026-09-12T10:00:00Z (UTC)
- model_id: cursor-grok-4.6 (CROSS_MODEL_REVIEW=1)
- architecture_verdict: PASS
- decision_gate: false
- critic_nb_closures: NB1 prune+listing (T-003/T-002); NB2 token OPENCODE_AUTO_MARKDOWN_COLLISION + installer-primary / plugin leftover defense (T-002/T-003/T-006); NB3 no companion DEC / no DONE / no Symptom B (T-anch)
- task_seeds: T-anch + T-001..T-007 (8; under SPRINT_MAX_TASKS=12) — refine into next free sprint id at /sprint-plan
- compose_guards (non-negotiable): DO NOT author companion DEC; DO NOT rewrite DEC-0124/0125 bodies; DO NOT rewrite historical # BUG-0015 CF1 cell; DO NOT reopen BUG-0015/0016/0017; DO NOT general template-absent sweeper; DO NOT touch .cursor/commands/auto.md or .opencode/agents/auto.md; DO NOT live OpenCode probe; DO NOT mark BUG-0018 DONE; DO NOT tick acceptance BUG-0018 row
- files_to_touch (execute foreshadow): delete .opencode/commands/auto.md + template twin; orchestrator.ts REASON_CODES + leftover check; installer.py/sh/ps1 prune; BUG0015_PAIRS drop auto.md; us0125 inventory 15→14; bug0015/us0125 if-present; bug0017 plant intake.md; tests/bug0018_*; runbook stub + prune recipe
- files_NOT_to_touch: DEC-0124.md / DEC-0125.md bodies; BUG-0015 CF1 historical cell; Cursor auto.md; OpenCode agents/auto.md; intake JSON; acceptance tick
- next_phase: `/sprint-plan` (fresh tech-lead per US-0069 / DEC-0051; third canonical phase of `plan` macro per ultra_lean). Orchestrator runs sovereign-critic of architecture first (CROSS_MODEL_REVIEW=1) then spawns sprint-plan. Do not mandate outer driver.
- runtime_proof_id: rp-auto-20260912-bug0018-architecture-techlead-20260912T100000Z-BUG-0018
- proof_hash: 076F4C6E4744AB44B4751AF821572EB7082C8103EBD0091C9BC6EAB88351AA0B
- proof_ttl: 2026-09-12T11:00:00Z (UTC)
- prior_phase_proof_consumed: rp-auto-20260912-bug0018-research-techlead-20260912T095000Z-BUG-0018 (proof_hash=6E62DB20F5F4B898E086B6DD8385E3874A5A6DC43C896314F81F6C8D65E3AA0A, ttl=2026-09-12T10:50:00Z)
- stop_condition: STOP after architecture PASS. Orchestrator owns critic of architecture then /sprint-plan in fresh tech-lead subagent per BUG-0006. Do not spawn /sprint-plan or /execute from this subagent. Do not mark BUG-0018 DONE. Do not execute implementation.

---

## Sprint-plan handoff — BUG-0017 / S0135 — /execute next (fresh dev; ultra_lean)

- sprint_id: S0135
- bug_id: BUG-0017 (Status OPEN — authority docs/product/backlog.md)
- story_id: (none — bug segment)
- companion_dec: none (cite R-0118; compose BUG-0008 / US-0084 / DEC-0120)
- research_anchor: R-0118 (DQ1–DQ6 LOCKED)
- architecture_anchor: docs/engineering/architecture.md # BUG-0017
- approach: A* LOCKED — DQ1 attrs + D4 renormalize + extend guard_installer_publish.py + 6 test_bug0017_* + DQ6 runbook + T-007 before-tag gate; reject A2/A3/A4/A5
- orchestrator_run_id: auto-20260911-bug0017
- fresh_context_marker: tl-BUG0017-sprint-plan-20260911T192300Z-fresh
- timestamp: 2026-09-11T19:23:00Z (UTC)
- model_id: composer-2.5 (CROSS_MODEL_REVIEW=1 — required on isolation)
- sprint_plan_verdict: PASS
- decision_gate: false
- sprint_status: PLANNED (backlog OPEN per US-0045 — not mutated; acceptance BUG-0017 unchecked)
- task_count: 8 (T-anch + T-001..T-007; within SPRINT_MAX_TASKS=12; no split; 1:1 architecture seeds)
- ac_surjective_map: AC-1->T-001,T-002,T-003,T-005; AC-2->T-002,T-003,T-005; AC-3->T-001,T-005(m1); AC-4->T-003,T-005(m4,m5),T-007; AC-5->T-004,T-005(m6); AC-6->T-006; AC-7->T-anch,T-005(m5); DC->T-anch
- task_order: T-anch -> T-001 -> T-002 -> T-003 -> T-004 -> T-005 -> T-006 -> T-007
- plan-verify: ultra_lean — deferred/merged into build+verify under QA; plan-verify.json NOT written here
- compose_guards (non-negotiable): DO NOT author companion DEC; DO NOT weaken BUG-0008/US-0084; DO NOT install-time EOL rewrite; DO NOT repo-wide *.md eol=lf; DO NOT host parser patch; DO NOT reopen BUG-0015/BUG-0016; DO NOT mark BUG-0017 DONE; DO NOT tick acceptance BUG-0017 row; DO NOT mutate intake JSON; DO NOT rewrite architecture.md / R-0118
- critic_nb_execute_awareness:
  - T-007: guard:installer before GitHub tag (choco path; NB1)
  - T-002: scoped renormalize only (NB2)
  - T-006: DQ6 upgrade --host opencode|both (NB3)
  - T-anch: NO-OP verification; do not mutate architecture.md / R-0118
- first_execute_task: T-anch (NO-OP / verification)
- key_locked_artifacts:
  - .gitattributes DQ1 six rows (.opencode/** + template/.opencode/** *.{md,ts,json})
  - one-time scoped git add --renormalize
  - extend scripts/guard_installer_publish.py (+ template mirror)
  - 6 test_bug0017_* markers
  - runbook DQ6 upgrade recipe + before-tag checklist
- runtime_proof_id: rp-auto-20260911-bug0017-sprint-plan-techlead-20260911T192300Z-BUG-0017
- proof_hash: 86620B9B243BE83D493E59BAF042EB1AFBFB02F84B996AA041CDDA34BB64CB6B
- proof_ttl: 2026-09-11T20:23:00Z
- consumed_architecture_proof: rp-auto-20260911-bug0017-architecture-techlead-20260911T192000Z-BUG-0017 / 541A4773D0E994EE9FC1A0DD09E70DBE1D0B262170FB6D63540407CEBBD76B68 — RUNTIME_PROOF_VALID
- next_scheduled_phase: /execute (role=dev)
- next_scheduled_role: dev
- stop_condition: STOP after sprint-plan. Orchestrator MUST spawn sovereign-critic of sprint-plan then /execute in fresh dev (BUG-0006). Do NOT spawn execute or plan-verify from this tech-lead. Do NOT mark BUG-0017 DONE. Do NOT reopen BUG-0015/BUG-0016.

---

## Architecture handoff — BUG-0017 — `/sprint-plan` next (fresh tech-lead; ultra_lean plan macro)

- bug_id: BUG-0017 (Status OPEN — authority docs/product/backlog.md)
- story_id: (none — bug segment)
- sprint_id: (pending — materialize at /sprint-plan)
- dec_id: none (companion DEC not required; cite R-0118; compose BUG-0008 / US-0084 / DEC-0120)
- research_anchor: R-0118 (DQ1–DQ6 LOCKED)
- architecture_anchor: docs/engineering/architecture.md # BUG-0017
- approach: A* LOCKED — DQ1 attrs + D4 renormalize + extend guard_installer_publish.py + 6 test_bug0017_* + DQ6 runbook; reject A2/A3/A4/A5
- orchestrator_run_id: auto-20260911-bug0017
- fresh_context_marker: tl-BUG0017-architecture-20260911T191500Z-fresh
- timestamp: 2026-09-11T19:20:00Z (UTC)
- model_id: composer-2.5 (CROSS_MODEL_REVIEW=1)
- architecture_verdict: PASS
- critic_nb_closures: NB1 choco tag→guard:installer before zip (T-007); NB2 dirty-tree scoped renormalize (T-002); NB3 DQ6 upgrade recipe (T-006)
- task_seeds: T-anch + T-001..T-007 (8; under SPRINT_MAX_TASKS=12) — refine into next free sprint id at /sprint-plan
- compose_guards (non-negotiable): DO NOT author companion DEC; DO NOT weaken BUG-0008/US-0084 tests; DO NOT install-time EOL rewrite; DO NOT repo-wide *.md eol=lf; DO NOT host parser patch; DO NOT reopen BUG-0015/BUG-0016; DO NOT mark BUG-0017 DONE; DO NOT tick acceptance BUG-0017 row
- files_to_touch (execute foreshadow): .gitattributes; .opencode/** + template/.opencode/** (renormalize); scripts/guard_installer_publish.py + template mirror; tests/bug0017_*; docs/engineering/runbook.md + template; release/CI checklist for guard before tag
- files_NOT_to_touch: BUG-0015/0016 ACs; installer EOL rewrite paths; operator-local model-catalog.local.json; DEC-0120 body (compose only)
- next_phase: `/sprint-plan` (fresh tech-lead per US-0069 / DEC-0051; third canonical phase of `plan` macro per ultra_lean). Orchestrator runs sovereign-critic of architecture first (CROSS_MODEL_REVIEW=1) then spawns sprint-plan. Do not mandate outer driver.
- runtime_proof_id: rp-auto-20260911-bug0017-architecture-techlead-20260911T192000Z-BUG-0017
- proof_hash: 541A4773D0E994EE9FC1A0DD09E70DBE1D0B262170FB6D63540407CEBBD76B68
- proof_ttl: 2026-09-11T20:20:00Z (UTC)
- prior_phase_proof_consumed: rp-auto-20260911-bug0017-research-techlead-20260911T191200Z-BUG-0017 (proof_hash=DF94BA041DDCB51ADD0675C7B41DEAD6F14CADB1D1095489E3B5F0E8342B777A, ttl=2026-09-11T20:12:00Z)
- stop_condition: STOP after architecture PASS. Orchestrator owns critic of architecture then /sprint-plan in fresh tech-lead subagent per BUG-0006. Do not spawn /sprint-plan or /execute from this subagent. Do not mark BUG-0017 DONE. Do not execute implementation.

---

## Plan-verify RE-ATTEST PASS handoff — US-0132 / S0134 — sovereign-critic then `/execute` (fresh)

- sprint_id: S0134
- story_id: US-0132 (Status OPEN — authority docs/product/backlog.md)
- companion_dec: DEC-0132 Accepted
- research_anchor: R-0117 (DQ1–DQ10 LOCKED)
- architecture_anchor: docs/engineering/architecture.md # US-0132
- approach: A1 LOCKED
- orchestrator_run_id: auto-20260909-us0132
- plan_verify_fresh_context_marker: qa-US0132-plan-verify-reattest-20260909T185821Z-fresh
- plan_verify_timestamp: 2026-09-09T18:58:21Z (UTC)
- model_id: cursor-grok-4.6 (CROSS_MODEL_REVIEW=1 — required on isolation)
- plan_verify_verdict: RE_ATTEST_PASS / PLAN_VERIFY_PASS
- reattest_kind: RE-ATTEST_ONLY
- reattest_reason: RUNTIME_PROOF_STALE
- decision_gate: false
- task_count: 10 (T-anch + T-001..T-009; within SPRINT_MAX_TASKS=12; no split)
- ac_surjective_map: AC-1->T-001,T-008,T-009(m1); AC-2->T-002,T-009(m2,m3); AC-3->T-003,T-004,T-009(m4,m5,m8); AC-4->T-007,T-009(m6); AC-5->T-006,T-008,T-009(m1,m5,m10); AC-6->T-005,T-009(m7); AC-7->T-005,T-009(m7,m9); AC-8->T-008,T-009(all10); DC->T-anch
- sprint_task_content_rewritten: false
- plan-verify.json: PASS / RE-ATTEST at sprints/S0134/plan-verify.json
- critic_nb_execute_awareness:
  - T-005: explicit `.opencode/model-catalog.local.json` gitignore (root + template) + exclude-from-clean named locals (not copy-aside)
  - T-004/T-009: host-JSON malformed present → `MODEL_CATALOG_INVALID` `scope=opencode-host` stays inside T-004/T-009; marker 5 remains catalog-centric; do not add an 11th marker
  - T-005: touch installer.py / installer.ps1 / installer.sh + manifest (files-to-touch listed Installer generically)
  - T-anch: NO-OP verification; do not mutate architecture.md / DEC-0132 in execute
- runtime_proof_id: rp-auto-20260909-us0132-plan-verify-qa-20260909T185821Z-US-0132-reattest
- proof_hash: 90D9E2E7D70999806756EC900A9A67E00A4112D8303EC8DD8BCA0F63E8162034
- proof_ttl: 2026-09-09T19:58:21Z
- prior_stale_plan_verify_proof: rp-auto-20260908-us0132-plan-verify-qa-20260908T213933Z-US-0132 / D1CCD3C93B3B6C8F7ED71E5095E4F6A3946D14CD500809686139DC56205E1167 — RUNTIME_PROOF_STALE; not forged; not live-consumed
- prior_sprint_plan_proof: rp-auto-20260908-us0132-sprint-plan-techlead-20260908T212407Z-US-0132 recorded superseded/expired — not live-consumed
- next_scheduled_phase: sovereign-critic of this RE-ATTEST then /execute (role=tech-lead critic then dev)
- stop_condition: STOP after plan-verify RE-ATTEST. Orchestrator MUST spawn sovereign-critic then /execute in fresh subagents (BUG-0006). Do NOT spawn critic or execute from plan-verify qa. Do NOT mark US-0132 DONE. Do NOT reopen US-0131.

## Plan-verify PASS handoff — US-0132 / S0134 — `/execute` next (fresh dev)

- sprint_id: S0134
- story_id: US-0132 (Status OPEN — authority docs/product/backlog.md)
- bug_id: (none)
- companion_dec: DEC-0132 Accepted
- research_anchor: R-0117 (DQ1–DQ10 LOCKED)
- architecture_anchor: docs/engineering/architecture.md # US-0132
- approach: A1 LOCKED — four surfaces; reject generic `model.json`; Cursor vs OpenCode schemas stay separate; `opencode.json{,c}` is host file not kit SOT; per-host `provenance=` diagnostics; `HOST_COLLISION` distinct both-host row; extend `model_tier_validate.py --scope model-config`; exclude-from-clean locals including `.opencode/model-catalog.local.json`
- orchestrator_run_id: auto-20260908-us0132
- plan_verify_fresh_context_marker: qa-US0132-plan-verify-20260908T213933Z-fresh
- plan_verify_timestamp: 2026-09-08T21:39:33Z (UTC)
- model_id: cursor-grok-4.6 (CROSS_MODEL_REVIEW=1 — required on isolation)
- plan_verify_verdict: PASS
- decision_gate: false
- sprint_status: PLANNED → execute-ready (backlog OPEN per US-0045 — not mutated; AC-1..AC-8 unchecked)
- task_count: 10 (T-anch + T-001..T-009; within SPRINT_MAX_TASKS=12; no split)
- ac_surjective_map: AC-1->T-001,T-008,T-009(m1); AC-2->T-002,T-009(m2,m3); AC-3->T-003,T-004,T-009(m4,m5,m8); AC-4->T-007,T-009(m6); AC-5->T-006,T-008,T-009(m1,m5,m10); AC-6->T-005,T-009(m7); AC-7->T-005,T-009(m7,m9); AC-8->T-008,T-009(all10); DC->T-anch
- task_order: T-anch -> T-001 -> T-002 -> T-003 -> T-004 -> T-005 -> T-006 -> T-007 -> T-008 -> T-009
- plan-verify.json: PASS at sprints/S0134/plan-verify.json
- compose_guards (non-negotiable): DO NOT reopen US-0131 / DEC-0131; DO NOT alias `model.json`; DO NOT dump kit keys into opencode.json; DO NOT amend DEC-0086/0087/0123; DO NOT reopen BUG-0015/0016; DO NOT scan home-dir model.json; DO NOT add live OpenCode CI probe; DO NOT mark US-0132 DONE; DO NOT tick ACs; DO NOT mutate intake JSON; DO NOT rewrite architecture.md / DEC-0132
- critic_nb_execute_awareness:
  - T-005: explicit `.opencode/model-catalog.local.json` gitignore (root + template) + exclude-from-clean named locals (not copy-aside)
  - T-004/T-009: host-JSON malformed present → `MODEL_CATALOG_INVALID` `scope=opencode-host` stays inside T-004/T-009; marker 5 remains catalog-centric; do not add an 11th marker
  - T-005: touch installer.py / installer.ps1 / installer.sh + manifest (files-to-touch listed Installer generically)
  - T-anch: NO-OP verification; do not mutate architecture.md / DEC-0132 in execute
- first_execute_task: T-anch (NO-OP / verification)
- key_locked_artifacts:
  - four surfaces: `.cursor/model-catalog.local.json` + `MODEL_*`; `.opencode/model-catalog.local.json`; host `opencode.json{,c}`
  - reject `model.json{,c}` at repo root / `.cursor/` / `.opencode/` only
  - `--scope model-config` on `scripts/model_tier_validate.py`
  - 10 `test_us0132_*` markers (static/fixture; no live OpenCode probe)
  - US-0131 boundary: kit governance stays out of `opencode.json`; host-neutral resolver still ignores `MODEL_*`
- runtime_proof_id: rp-auto-20260908-us0132-plan-verify-qa-20260908T213933Z-US-0132
- proof_hash: D1CCD3C93B3B6C8F7ED71E5095E4F6A3946D14CD500809686139DC56205E1167
- proof_ttl: 2026-09-08T22:39:33Z
- consumed_sprint_plan_proof: rp-auto-20260908-us0132-sprint-plan-techlead-20260908T212407Z-US-0132 / 3DF869CD3FDFF4C0A76093193B1550F4DE9082EB8AFD37091AD37A4C98392E89 — RUNTIME_PROOF_VALID
- next_scheduled_phase: /execute (role=dev)
- next_scheduled_role: dev
- stop_condition: STOP after plan-verify. Orchestrator may critic plan-verify then spawn /execute in fresh dev (BUG-0006). Do NOT spawn execute from plan-verify qa. Do NOT mark US-0132 DONE. Do NOT reopen US-0131.

---

## Sprint-plan handoff — US-0132 / S0134 — `/plan-verify` next (fresh qa)

- sprint_id: S0134
- story_id: US-0132 (Status OPEN — authority docs/product/backlog.md)
- bug_id: (none)
- companion_dec: DEC-0132 Accepted
- research_anchor: R-0117 (DQ1–DQ10 LOCKED)
- architecture_anchor: docs/engineering/architecture.md # US-0132
- approach: A1 LOCKED — four surfaces; reject generic `model.json`; Cursor vs OpenCode schemas stay separate; `opencode.json{,c}` is host file not kit SOT; per-host `provenance=` diagnostics; `HOST_COLLISION` distinct both-host row; extend `model_tier_validate.py --scope model-config`; exclude-from-clean locals including `.opencode/model-catalog.local.json`
- orchestrator_run_id: auto-20260908-us0132
- fresh_context_marker: tl-US0132-sprint-plan-20260908T212407Z-fresh
- timestamp: 2026-09-08T21:24:07Z (UTC)
- model_id: cursor-grok-4.6 (CROSS_MODEL_REVIEW=1 — required on isolation)
- sprint_plan_verdict: PASS
- decision_gate: false
- sprint_status: PLANNED (backlog OPEN per US-0045 — not mutated; AC-1..AC-8 unchecked)
- task_count: 10 (T-anch + T-001..T-009; within SPRINT_MAX_TASKS=12; no split)
- ac_surjective_map: AC-1->T-001,T-008,T-009(m1); AC-2->T-002,T-009(m2,m3); AC-3->T-003,T-004,T-009(m4,m5,m8); AC-4->T-007,T-009(m6); AC-5->T-006,T-008,T-009(m1,m5,m10); AC-6->T-005,T-009(m7); AC-7->T-005,T-009(m7,m9); AC-8->T-008,T-009(all10); DC->T-anch
- task_order: T-anch -> T-001 -> T-002 -> T-003 -> T-004 -> T-005 -> T-006 -> T-007 -> T-008 -> T-009
- plan-verify.json: PENDING at sprints/S0134/plan-verify.json (`AWAITING_QA_PLAN_VERIFY`)
- compose_guards (non-negotiable): DO NOT reopen US-0131 / DEC-0131; DO NOT alias `model.json`; DO NOT dump kit keys into opencode.json; DO NOT amend DEC-0086/0087/0123; DO NOT reopen BUG-0015/0016; DO NOT scan home-dir model.json; DO NOT add live OpenCode CI probe; DO NOT mark US-0132 DONE; DO NOT tick ACs; DO NOT mutate intake JSON; DO NOT rewrite architecture.md / DEC-0132
- critic_nb_execute_awareness:
  - architecture_notes relocated from ### BUG-0016 onto ## US-0132 (form-feed removed); BUG-0016 not reopened
  - T-005: explicit `.opencode/model-catalog.local.json` gitignore + exclude-from-clean (not copy-aside)
  - T-006: `--host both` + model.json → PATH_UNKNOWN **and** HOST_COLLISION (never pick a host)
  - T-anch: NO-OP verification; do not mutate architecture.md / DEC-0132 in execute
- architecture_pointers: docs/engineering/architecture.md # US-0132 (approach A1, 10-marker table, seeds T-anch + T-001..T-009). Do not rewrite.
- first_execute_task: T-anch (NO-OP / verification) — after plan-verify PASS
- key_locked_artifacts:
  - four surfaces: `.cursor/model-catalog.local.json` + `MODEL_*`; `.opencode/model-catalog.local.json`; host `opencode.json{,c}`
  - reject `model.json{,c}` at repo root / `.cursor/` / `.opencode/` only
  - `--scope model-config` on `scripts/model_tier_validate.py`
  - 10 `test_us0132_*` markers (static/fixture; no live OpenCode probe)
  - US-0131 boundary: kit governance stays out of `opencode.json`; host-neutral resolver still ignores `MODEL_*`
- runtime_proof_id: rp-auto-20260908-us0132-sprint-plan-techlead-20260908T212407Z-US-0132
- proof_hash: 3DF869CD3FDFF4C0A76093193B1550F4DE9082EB8AFD37091AD37A4C98392E89
- proof_ttl: 2026-09-08T22:24:07Z
- consumed_architecture_proof: rp-auto-20260908-us0132-architecture-techlead-20260908T210500Z-US-0132 / 8255C22FCC78F2CFF74AD41A08D9FFF875AE09C205A82BEC78C4B4D03CD13013 — RUNTIME_PROOF_VALID
- next_scheduled_phase: /plan-verify (role=qa)
- next_scheduled_role: qa
- stop_condition: STOP after sprint-plan. Orchestrator MUST spawn /plan-verify in fresh qa (BUG-0006). Do NOT spawn plan-verify from this tech-lead. Do NOT spawn critic. Do NOT mark US-0132 DONE. Do NOT reopen US-0131.

---

## Plan-verify PASS handoff — US-0131 / S0133 — `/execute` next (fresh dev)

- sprint_id: S0133
- story_id: US-0131 (Status OPEN — authority docs/product/backlog.md)
- bug_id: (none)
- companion_dec: DEC-0131 Accepted
- research_anchor: R-0116 (DQ1–DQ10 LOCKED)
- architecture_anchor: docs/engineering/architecture.md # US-0131
- approach: A1 LOCKED — `.its-magic/config{,.local,.example}.json` SOT + LegacyScratchpadAdapter + `resolve_runtime_config` migration
- orchestrator_run_id: auto-20260907-us0131
- plan_verify_fresh_context_marker: qa-US0131-plan-verify-20260907T195200Z-fresh
- plan_verify_timestamp: 2026-09-07T19:52:00Z (UTC)
- model_id: composer-2.5 (CROSS_MODEL_REVIEW=1 — required on isolation)
- plan_verify_verdict: PASS
- decision_gate: false
- sprint_status: PLANNED → execute-ready (backlog OPEN per US-0045 — not mutated; AC-1..AC-8 unchecked)
- task_count: 9 (T-anch + T-001..T-008; T-009 folded into T-007; within SPRINT_MAX_TASKS=12)
- ac_surjective_map: AC-1->T-001,T-007(m1,m6); AC-2->T-002,T-007(m2); AC-3->T-003,T-007(m3; m5 DQ4 primary); AC-4->T-004,T-007(m8); AC-5->T-005,T-007(m10); AC-6->T-005,T-007(m4 primary; m5 nuance=AC-3/DQ4); AC-7->T-006,T-007(m7); AC-8->T-007(all10 incl m9),T-008; DC->T-anch
- task_order: T-anch -> T-001 -> T-002 -> T-003 -> T-004 -> T-005 -> T-006 -> T-007 -> T-008
- plan-verify.json: PASS at sprints/S0133/plan-verify.json
- compose_guards (non-negotiable): DO NOT expand US-0132; DO NOT dump kit keys into opencode.json; DO NOT reopen BUG-0015/0016; DO NOT amend DEC-0086/0087/0123; DO NOT mark US-0131 DONE; DO NOT tick ACs; DO NOT mutate intake JSON; DO NOT rewrite architecture.md / DEC-0131
- critic_nb_execute_awareness:
  - host_mode=None = auto-detect (T-001/T-003); HOST_CONFIG_PATH_FORBIDDEN only OpenCode-only + forbidden cursor-sole request
  - T-004 exhaustive 9-module inventory; do not expand to Cursor-only parity scripts
  - Do not re-split T-009; marker 9 mandatory in T-007 10-marker set
- first_execute_task: T-anch
- key_locked_artifacts:
  - paths: `.its-magic/config.example.json` / `config.json` / `config.local.json` (token=`config`)
  - API: `resolve_runtime_config(repo_root, *, host_mode=None, required_keys=None)`
  - 10 `test_us0131_*` markers (static/fixture; no live OpenCode probe)
  - US-0132 boundary: ignore MODEL_* (marker 9)
- runtime_proof_id: rp-auto-20260907-us0131-plan-verify-qa-20260907T195200Z-US-0131
- proof_hash: 5F198A1862986704CC24AE0EA2D41C87D343C3AACF842997CB5C76D2995C29F1
- proof_ttl: 2026-09-07T20:52:00Z
- consumed_sprint_plan_proof: rp-auto-20260907-us0131-sprint-plan-techlead-20260907T194500Z-US-0131 / 96221EF4BC1FB83F9A0C288287672F1A18ACC023C80185029EA3A6DDABD84E66 — RUNTIME_PROOF_VALID
- next_scheduled_phase: /execute (role=dev)
- next_scheduled_role: dev
- stop_condition: STOP after plan-verify. Orchestrator may critic plan-verify then spawn /execute in fresh dev (BUG-0006). Do NOT spawn execute from plan-verify qa. Do NOT work US-0132.

---

## Prior — Sprint-plan handoff — US-0131 / S0133 — `/plan-verify` (superseded by PASS)

- sprint_id: S0133
- story_id: US-0131
- plan-verify.json: was PENDING — now PASS (see above)
- fresh_context_marker: tl-US0131-sprint-plan-20260907T194500Z-fresh
- timestamp: 2026-09-07T19:45:00Z (UTC)
- runtime_proof_id: rp-auto-20260907-us0131-sprint-plan-techlead-20260907T194500Z-US-0131
- proof_hash: 96221EF4BC1FB83F9A0C288287672F1A18ACC023C80185029EA3A6DDABD84E66

---

## Sprint-plan handoff — BUG-0016 / S0132 — `/execute` next (fresh dev; ultra_lean skips standalone /plan-verify)

- sprint_id: S0132
- bug_id: BUG-0016 (Status OPEN — authority docs/product/backlog.md)
- story_id: (none — bug segment)
- dec_id: none companion (DEC-0130 rejected; DEC-0122 §2 amended sole SOT in /architecture — execute ships frontmatter parity)
- research_anchor: R-0115 (DQ1–DQ8 LOCKED)
- architecture_anchor: docs/engineering/architecture.md # BUG-0016
- approach: A* LOCKED — amend DEC-0122 §2 sole SOT + agent frontmatter (active+template); bash ask po/tl/curator; PO +intake_evidence/** +resume_brief +state.md; sprints/S*/ globs; release duty paths; 7 test_bug0016_*; success test (c) preserved
- orchestrator_run_id: auto-20260906-bug0016
- fresh_context_marker: tl-BUG0016-sprint-plan-20260906T185500Z-fresh
- timestamp: 2026-09-06T18:55:00Z (UTC)
- model_id: composer-2.5 (CROSS_MODEL_REVIEW=1 — required on isolation)
- sprint_plan_verdict: PASS
- sprint_status: PLANNED (backlog OPEN per US-0045 — not mutated; acceptance BUG-0016 unchecked)
- task_count: 8 (T-anch + T-001..T-007; within SPRINT_MAX_TASKS=12; 1:1 architecture seeds)
- ac_surjective_map: AC-1->T-001,T-002,T-006(m1); AC-2->T-001,T-006(m2); AC-3->T-002,T-003,T-006(m3); AC-4->T-004,T-006(m4); AC-5->T-anch,T-005,T-006(m5); AC-6->T-anch,T-006(m6); AC-7->T-001..T-004,T-006(m7); AC-8->T-anch,T-005; DQ8->T-007
- task_order: T-anch -> T-001 (po.md) -> T-002 (tech-lead+curator) -> T-003 (dev+qa S*) -> T-004 (release duty paths) -> T-005 (us0122 realign) -> T-006 (7 bug0016 markers) -> T-007 (write-guard verify) -> integration verification
- compose_guards (non-negotiable): DO NOT invent DEC-0130 / second matrix; DO NOT use bash:allow; DO NOT reopen US-0131/US-0132; DO NOT reopen BUG-0015; DO NOT amend DEC-0124/0125 unless T-007 proves double-deny; DO NOT add live OpenCode CI probe; DO NOT mark BUG-0016 DONE; DO NOT tick acceptance BUG-0016; DO NOT mutate intake JSON; DO NOT rewrite architecture.md; DO NOT transfer US-0126 runbook prose ownership via Layer-1 allow
- critic_carry_ins: 0 new blocking. 3 architecture critic NBs `b0016ar-*` status=resolved non-blocking — routed as awareness into /execute:
  - b0016ar-challenger-001 (`ik_bug0016_arch_edge_and_proof`): T-007 Layer-1∩write-guard verify; keep S* not S[0-9]*; active↔template parity + intentional us0122 realign
  - b0016ar-architect-002 (`ik_bug0016_arch_layer_coupling`): keep T-anch..T-007 1:1; DEC-0122 §2 sole SOT; CF2 runbook allow ≠ US-0126 ownership
  - b0016ar-subtractor-003 (`ik_bug0016_arch_scope_minimal`): T-anch read-only; no DEC-0130 / bash:allow / live probe; do not mark DONE; 7 markers required
- architecture_pointers: docs/engineering/architecture.md # BUG-0016 (approach A*, 7-marker table, CF1–CF5 CLOSED, seeds T-anch + T-001..T-007). Do not rewrite.
- first_execute_task: T-anch (NO-OP / verification) — verify # BUG-0016 H1 + DEC-0122 §2 amended + approach A* + R-0115 DQ1–DQ8 + CF1–CF5 + compose guards + 7-marker list + pre-execute agent gap still present
- key_locked_artifacts:
  - bash (DQ1): po/tech-lead/curator → ask; reject allow; object-form YAGNI
  - PO paths (DQ2): +intake_evidence/** +resume_brief.md +state.md; ** deny last
  - globs (DQ3): sprints/S*/… not Sxxxx; no char classes
  - release (DQ5/CF2): +release-findings +verify-work-to-release +state +resume_brief +runbook; keep verify_to_release
  - tests (DQ6/DQ7): amend us0122_* + 7 test_bug0016_*; no live probe
  - DQ8: T-007 write-guard verify; amend DEC-0124/0125 only if proven
- files_to_touch: .opencode/agents/{po,tech-lead,curator,dev,qa,release}.md + template peers; tests/us0122_contract_test.py; tests/bug0016_contract_test.py (+ template); optional parity scope bug-0016
- files_NOT_to_touch: docs/engineering/architecture.md (do not rewrite), DEC-0122 body beyond already-amended §2, DEC-0124/0125 (unless T-007 proves), security.md/auto.md (verify unchanged), backlog BUG-0016 Status/ACs, handoffs/intake_evidence/BUG-0016-intake-20260906.json, US-0131/US-0132 rows
- next_phase: `/execute` (fresh dev per US-0069 / DEC-0051; first canonical phase of `build+verify` macro per ultra_lean; /plan-verify merged into qa per ultra_lean — qa creates plan-verify.json within build+verify). Orchestrator runs sovereign-critic of sprint-plan first (CROSS_MODEL_REVIEW=1). Do not mandate outer driver.
- sprint_artifacts: sprints/S0132/ (sprint.md, tasks.md, progress.md, uat.json, uat.md)
- runtime_proof_id: rp-auto-20260906-bug0016-sprint-plan-techlead-20260906T185500Z-BUG-0016
- proof_hash: F6892B96789FF471D7A97B40F80BBE59E725FB5A5DD573515D0ABC663B0A997F
- proof_ttl: 2026-09-06T19:55:00Z (UTC)
- prior_phase_proof_consumed: rp-auto-20260906-bug0016-architecture-techlead-20260906T184500Z-BUG-0016 (proof_hash=7AC851CDF1953594365AFF11B015BFD850E737F75A327FA2A02B1CCB544D5A31, ttl=2026-09-06T19:45:00Z — critic MATCH; consumed at 2026-09-06T18:55:00Z before RUNTIME_PROOF_STALE; sovereign-critic architecture PASS at 2026-09-06T18:50:00Z anti_slop_aggregate=10 0 blocking findings)
- stop_condition: STOP after sprint-plan completes; hand off via artifacts only. Orchestrator owns critic of sprint-plan then /execute in fresh dev subagent per BUG-0006. Do not spawn /execute or /plan-verify from this subagent. Do not mark BUG-0016 DONE. Do not tick acceptance BUG-0016. Do not mutate intake JSON. Do not invent DEC-0130. Do not use bash:allow. Do not reopen US-0131/US-0132. Do not reopen BUG-0015.

---

## Sprint-plan handoff â BUG-0015 / S0131 â `/execute` next (fresh dev; ultra_lean skips standalone /plan-verify)

- sprint_id: S0131
- bug_id: BUG-0015 (Status OPEN â authority docs/product/backlog.md)
- story_id: (none â bug segment)
- dec_id: none (companion DEC not required; cite R-0114; compose DEC-0124 / DEC-0125 without amend)
- research_anchor: R-0114 (DQ1âDQ7 LOCKED)
- architecture_anchor: docs/engineering/architecture.md # BUG-0015
- approach: A* LOCKED â ctx.command.transform + editor.add({ name: "auto", execute }) â runAutoLifecycle â spawnPhase / dispatchStopMatrix; fail-closed OPENCODE_PLUGIN_DISPATCH_ATTACH_UNSUPPORTED + OPENCODE_AUTO_ALREADY_RUNNING
- orchestrator_run_id: auto-20260906-bug0015
- fresh_context_marker: tl-BUG0015-sprint-plan-20260906T143000Z-fresh
- timestamp: 2026-09-06T14:30:00Z (UTC)
- model_id: composer-2.5 (CROSS_MODEL_REVIEW=1 â required on isolation)
- sprint_plan_verdict: PASS
- sprint_status: PLANNED (backlog OPEN per US-0045 â not mutated; acceptance BUG-0015 unchecked)
- task_count: 7 (T-anch + T-001..T-006; within SPRINT_MAX_TASKS=12)
- ac_surjective_map: AC-1->T-001,T-002,T-005(m1,m2); AC-2->T-001,T-005(m3),T-006; AC-3->T-002,T-005(m4); AC-4->T-003,T-005; AC-5->T-002,T-005(m5),T-006; AC-6->T-004,T-005(m6); AC-7->T-anch,T-005(m7); AC-8->T-005(all 7 markers)
- task_order: T-anch -> T-001 (command.transform / editor.add auto attach) -> T-002 (runAutoLifecycle + mutex + spawn loop) -> T-003 (Python IsolationEvidence + first-phase bridge) -> T-004 (auto.md STOP-only assert) -> T-005 (7 bug0015 markers) -> T-006 (runbook h3 stub) -> integration verification
- compose_guards (non-negotiable): DO NOT amend DEC-0124 / DEC-0125 bodies; DO NOT amend test_us0124_* / test_us0125_*; DO NOT solve BUG-0016 / DEC-0122 matrix; DO NOT reopen US-0131/US-0132; DO NOT port Cursor Task-loop; DO NOT reimplement stop-matrix in TS; DO NOT add live OpenCode CI probe; DO NOT mark BUG-0015 DONE; DO NOT tick acceptance BUG-0015; DO NOT mutate intake JSON; DO NOT rewrite architecture.md
- critic_carry_ins: 0 new blocking. 3 architecture critic NBs `b0015ar-*` status=resolved non-blocking â routed as awareness into /execute:
  - b0015ar-challenger-001 (`ik_bug0015_arch_edge_and_proof`): T-002/T-005 prove mutex gate on dual-fire / secondary command.executed after STOP; document mutex TTL clock source + clear-on-fail-closed paths
  - b0015ar-architect-002 (`ik_bug0015_arch_layer_coupling`): T-003 Python IsolationEvidence + first-phase only; T-006 runbook h3 stub only (US-0126 owns full table); active+template parity
  - b0015ar-subtractor-003 (`ik_bug0015_arch_scope_minimal`): T-anch read-only; do not mark DONE; 7 markers required; no BUG-0016 / live probe / DEC amend
- architecture_pointers: docs/engineering/architecture.md # BUG-0015 (approach A*, 7-marker table, CF1âCF7 CLOSED, seeds T-anch + T-001..T-006). Do not rewrite.
- first_execute_task: T-anch (NO-OP / verification) â verify # BUG-0015 H1 + approach A* + R-0114 DQ1âDQ7 + CF1âCF7 + compose guards + 7-marker list + attach gap still present pre-T-001
- key_locked_artifacts:
  - attach (DQ1): `command.transform` / `editor.add({ name: "auto", execute })`; missing â OPENCODE_PLUGIN_DISPATCH_ATTACH_UNSUPPORTED
  - lifecycle (DQ2/DQ4): `runAutoLifecycle` + mutex TTL 7200s / clear-on-exit; OPENCODE_AUTO_ALREADY_RUNNING
  - bridges (DQ3/DQ5): Python IsolationEvidenceâstate.md; first-phase argvâresume_briefâscratchpadâUS-0087
  - static (DQ5/DQ6): auto.md STOP-only; 7 test_bug0015_* mock-ctx; no live probe
  - docs: runbook h3 stub for two new reason codes; US-0126 cross-link
- files_to_touch: .opencode/plugins/orchestrator.ts + template, .opencode/commands/auto.md + template, tests/bug0015_contract_test.py + template, thin Python isolation/resume helper, docs/engineering/runbook.md + template, optional parity scope bug-0015
- files_NOT_to_touch: docs/engineering/architecture.md (do not rewrite), decisions/DEC-0124.md, decisions/DEC-0125.md, DEC-0122 matrix / .opencode/agents/*.md (BUG-0016), backlog BUG-0015 Status/ACs, handoffs/intake_evidence/BUG-0015-intake-20260906.json, us0124/us0125 contract test bodies, US-0131/US-0132 rows
- next_phase: `/execute` (fresh dev per US-0069 / DEC-0051; first canonical phase of `build+verify` macro per ultra_lean; /plan-verify merged into qa per ultra_lean â qa creates plan-verify.json within build+verify). Orchestrator runs sovereign-critic of sprint-plan first (CROSS_MODEL_REVIEW=1). Do not mandate outer driver.
- sprint_artifacts: sprints/S0131/ (sprint.md, tasks.md, progress.md, uat.json, uat.md)
- runtime_proof_id: rp-auto-20260906-bug0015-sprint-plan-techlead-20260906T143000Z-BUG-0015
- proof_hash: 628D489A395FD783DE7E84A5D8AAC82823AA35843A4FE498638DEB0A5175E43E
- proof_ttl: 2026-09-06T15:30:00Z (UTC)
- prior_phase_proof_consumed: rp-auto-20260906-bug0015-architecture-techlead-20260906T142000Z-BUG-0015 (proof_hash=DBEB0F5D44E6801D5E1DEEA686A95CB32090B75A1FA1DCCF5621C1E1FD017440, ttl=2026-09-06T15:20:00Z â critic MATCH; consumed at 2026-09-06T14:30:00Z before RUNTIME_PROOF_STALE; sovereign-critic architecture PASS at 2026-09-06T14:25:00Z anti_slop_aggregate=8 0 blocking findings)
- stop_condition: STOP after sprint-plan completes; hand off via artifacts only. Orchestrator owns critic of sprint-plan then /execute in fresh dev subagent per BUG-0006. Do not spawn /execute or /plan-verify from this subagent. Do not mark BUG-0015 DONE. Do not tick acceptance BUG-0015. Do not mutate intake JSON. Do not amend DEC-0124/0125. Do not solve BUG-0016. Do not reopen US-0131/US-0132.

---

## Architecture handoff â BUG-0015 â `/sprint-plan` next (fresh tech-lead; ultra_lean plan macro)

- bug_id: BUG-0015 (Status OPEN â authority docs/product/backlog.md)
- story_id: (none â bug segment)
- sprint_id: (pending â materialize at /sprint-plan)
- dec_id: none (companion DEC not required; cite R-0114; compose DEC-0124 / DEC-0125 without amend)
- research_anchor: R-0114 (DQ1âDQ7 LOCKED)
- architecture_anchor: docs/engineering/architecture.md # BUG-0015
- approach: A* LOCKED â ctx.command.transform + editor.add({ name: "auto", execute }) â runAutoLifecycle â spawnPhase / dispatchStopMatrix; fail-closed OPENCODE_PLUGIN_DISPATCH_ATTACH_UNSUPPORTED + OPENCODE_AUTO_ALREADY_RUNNING
- orchestrator_run_id: auto-20260906-bug0015
- fresh_context_marker: tl-BUG0015-architecture-20260906T142000Z-fresh
- timestamp: 2026-09-06T14:20:00Z (UTC)
- model_id: composer-2.5
- architecture_verdict: PASS
- deferred_closures: CF1âCF7 CLOSED (transform owns execute; Python IsolationEvidenceâstate.md; Python first-phase selectors; runAutoLifecycle; mutex 7200s TTL; transform primary; no companion DEC)
- task_seeds: T-anch + T-001..T-006 (7; under SPRINT_MAX_TASKS=12) â refine into sprints/S-BUG0015 or next free sprint id at /sprint-plan
- ac_coverage: AC-1..AC-8 mapped in architecture Â§ AC coverage mapping
- compose_guards (non-negotiable): DO NOT amend DEC-0124 / DEC-0125 bodies; DO NOT amend test_us0124_* / test_us0125_*; DO NOT solve BUG-0016; DO NOT reopen US-0131/US-0132; DO NOT port Cursor Task-loop; DO NOT reimplement stop-matrix in TS; DO NOT add live OpenCode CI probe; DO NOT mark BUG-0015 DONE; DO NOT tick acceptance BUG-0015 row
- critic_carry_ins_closed: research CF1âCF7 closed in architecture (ik_bug0015_research_* NBs were non-blocking; no new DEC)
- files_to_touch (execute foreshadow): .opencode/plugins/orchestrator.ts + template peer; .opencode/commands/auto.md + template (STOP-only assert); tests/bug0015_contract_test.py (+ template); thin Python isolation/resume bridge; optional runbook h3 stub
- files_NOT_to_touch: decisions/DEC-0124.md, decisions/DEC-0125.md, DEC-0122 matrix, BUG-0016 backlog body (except mention), us0124/us0125 contract test bodies
- next_phase: `/sprint-plan` (fresh tech-lead per US-0069 / DEC-0051; third canonical phase of `plan` macro per ultra_lean). Orchestrator runs sovereign-critic of architecture first (CROSS_MODEL_REVIEW=1) then spawns sprint-plan. Do not mandate outer driver.
- runtime_proof_id: rp-auto-20260906-bug0015-architecture-techlead-20260906T142000Z-BUG-0015
- proof_hash: DBEB0F5D44E6801D5E1DEEA686A95CB32090B75A1FA1DCCF5621C1E1FD017440
- proof_ttl: 2026-09-06T15:20:00Z (UTC)
- prior_phase_proof_consumed: rp-auto-20260906-bug0015-research-techlead-20260906T141000Z-BUG-0015 (proof_hash=3D9E02EBBECA8C02D3051638B0782F575ABD03FEDCD369A255144D36CC01F3A1, ttl=2026-09-06T15:10:00Z)
- stop_condition: STOP after architecture PASS. Orchestrator owns critic of architecture then /sprint-plan in fresh tech-lead subagent per BUG-0006. Do not spawn /sprint-plan or /execute from this subagent. Do not mark BUG-0015 DONE. Do not solve BUG-0016. Do not execute implementation.

---

## Sprint-plan handoff â US-0129 / S0129 â `/execute` next (fresh dev; ultra_lean skips standalone /plan-verify)

- sprint_id: S0129
- story_id: US-0129
- dec_id: DEC-0129 (Accepted â `decisions/DEC-0129.md`; story-aligned companion; compose DEC-0054 / DEC-0073 / DEC-0076 / US-0049 / US-0126 B-1 / DEC-0119)
- research_anchor: R-0113 (DQ1âDQ8 LOCKED; R-0112 not extended)
- orchestrator_run_id: auto-20260827-01
- fresh_context_marker: tl-US0129-sprint-plan-20260827T073646Z-fresh
- timestamp: 2026-08-27T07:36:46Z (UTC)
- model_id: cursor-grok-4.6-high (CROSS_MODEL_REVIEW=1 â required on isolation)
- sprint_plan_verdict: PASS
- sprint_status: PLANNED (backlog OPEN per US-0045 â not mutated; acceptance L157 unchecked)
- task_count: 8 (T-anch + T-001..T-007; within SPRINT_MAX_TASKS=12)
- ac_surjective_map: AC-1->T-001,T-005(m1,m2,m6); AC-2->T-001,T-002,T-005(m2,m3); AC-3->T-003,T-005(m4,m5); AC-4->T-004,T-006,T-005(m6,m7); AC-5->T-005(all 8 markers); AC-6->T-anch
- task_order: T-anch -> T-001 (arch_linkage_guard.py helper + pre-guard no-partial-write) -> T-002 (reason_codes ## US-0129 + security_hard matrix row) -> T-003 (ARCH_LINKAGE_AUTO_REPAIR=0 comment + DQ8 stub restore) -> T-004 (refresh-context pre â rollover â post â check) -> T-005 (8 contract markers + harness 26AB) -> T-006 (runbook h3 + ARCH_LINKAGE_PAIRS) -> T-007 (installer-owned-paths.manifest) -> integration verification
- compose_guards (non-negotiable): DO NOT amend DEC-0054 (rollover_architecture split / pack format / ARCH_HOT_MAX_* â marker 2), DEC-0073 (H1 vs H2 anchor policy â stub is H1 with title separator), DEC-0076/US-0089 (only # US-0090 after # US-0089 â stub insertion before that tail; marker 5), US-0049 (state archive contract â audit row append-bottom), US-0126 (B-1 fixture only â do not reopen; L154 stays checked), US-0127/US-0128/US-0130 (DONE â do not reopen; L155âL156 / L158 stay checked), DEC-0119 (9 auto_repair_kind + 12 preset flags â no 10th kind; flag not in AUTONOMY_PRESET), R-0112 (US-0130 overlay not extended), US-0045 (no backlog Status/ACs mutation), US-0048/BUG-0006 (fresh-context isolation), US-0056 (runtime proof lowercase keys only). Do not rewrite docs/engineering/architecture.md. Do not rewrite decisions/DEC-0129.md. Do not tick L157. Do not mutate intake JSON.
- critic_carry_ins: 0 new blocking. 3 architecture critic NBs `a0129ar-*` status=resolved non-blocking â routed as awareness into /execute:
  - a0129ar-challenger-001 (`ik_us0129_arch_proof_and_linkage_gaps`): T-001 discovery must exclude .tmp* and non-architecture.md reads (R1). T-003 v1 heading-only (R3). Do not pre-seed unrelated stubs (R6) â remediate via AC-2 repair flag or manual H1.
  - a0129ar-architect-002 (`ik_us0129_arch_layer_coupling`): T-001 helper+pre-guard; T-002 reason_codes+matrix; T-003 flag+stub; T-004 refresh-context wiring; T-005 8 markers+26AB; T-006 runbook+ARCH_LINKAGE_PAIRS; T-007 installer manifest. Import split_arch_stories + while-pop â do not copy-fork archiver. Do not add ARCH_LINKAGE_AUTO_REPAIR to AUTONOMY_PRESET.
  - a0129ar-subtractor-003 (`ik_us0129_arch_scope_discipline`): do not mark US-0129 DONE; do not tick L157; 8 markers required (not YAGNI); T-anch read-only â no architecture.md mutation; do not reopen US-0126/US-0127/US-0128/US-0130.
- architecture_pointers: docs/engineering/architecture.md # US-0129 (L1527 â approach A1, 8-marker table, helper DQ2, fail-closed DQ4/DQ5, stub DQ8, refresh-context DQ3, contract tests DQ6/DQ7, runbook/parity D8, compose-do-not-amend 8/8, risks R1âR6; sprint seeds T-anch + T-001..T-007). Do not rewrite.
- first_execute_task: T-anch (NO-OP / verification) â verify # US-0129 H1 anchor + DEC-0129 Accepted + approach A1 + R-0113 DQ1âDQ8 + compose guards 8/8 + 8-marker list locked + absent surfaces (arch_linkage_guard.py + template, us0129 contract test + template, reason_codes ## US-0129, matrix row, scratchpad live=1, refresh-context pre/post, harness 26AB, ARCH_LINKAGE_PAIRS, installer manifest row)
- key_locked_artifacts:
  - linkage guard (DQ2+DQ3): `scripts/arch_linkage_guard.py` discover_required_arch_headings stdlib scan; pre-guard no-partial-write; import split_arch_stories + while-pop; post-guard verifies active linkage
  - fail-closed (DQ4+DQ5): `ARCH_LINKAGE_ROLLOVER_BLOCKED` security_hard never skip; new ## US-0129 family in reason_codes.md; matrix auto_repair_kind=n/a cap=0
  - optional repair (DQ1+DQ8): ARCH_LINKAGE_AUTO_REPAIR=0 default-off not in AUTONOMY_PRESET; H1 stub + pack_ref before US-0089/US-0090 tail; idempotent; state.md audit row
  - wiring (DQ3): `.cursor/commands/refresh-context.md` pre-guard â --rollover â post-guard â --check
  - contract tests (Q1): `tests/us0129_contract_test.py` â 8 markers; harness 26AB after 26AA; synthetic fixtures not pack-20260825 replay
  - docs + parity (D8): runbook h3 under triad; ARCH_LINKAGE_PAIRS + --scope=arch-linkage; installer-owned-paths.manifest for arch_linkage_guard.py
- files_to_touch: scripts/arch_linkage_guard.py NEW + template mirror, docs/engineering/reason_codes.md + template, scripts/data/autonomy_stop_matrix.yaml, docs/engineering/autonomy-stop-matrix.md + template, .cursor/scratchpad.md + template (comment only), .cursor/commands/refresh-context.md + template, tests/us0129_contract_test.py NEW + template, tests/run-tests.ps1 + run-tests.sh (26AB), docs/engineering/runbook.md + template, scripts/check_intake_template_parity.py (ARCH_LINKAGE_PAIRS) + template, docs/engineering/context/installer-owned-paths.manifest + template
- files_NOT_to_touch: docs/engineering/architecture.md (do not rewrite), decisions/DEC-0129.md (already Accepted), backlog US-0129 Status/ACs, handoffs/intake_evidence/US-0129-intake-20260825.json, scripts/enforce-triad-hot-surface.py rollover_architecture split/pack/ARCH_HOT_MAX_*, AUTONOMY_PRESET expansion, US-0126/US-0127/US-0128/US-0130 DONE rows, docs/engineering/research.md ## R-0112
- next_phase: `/execute` (fresh dev per US-0069 / DEC-0051; first canonical phase of `build+verify` macro per ultra_lean; /plan-verify merged into qa per ultra_lean â qa creates plan-verify.json within build+verify). Orchestrator runs sovereign-critic of sprint-plan first (CROSS_MODEL_REVIEW=1). Do not mandate outer driver.
- sprint_artifacts: sprints/S0129/ (sprint.md, tasks.md, progress.md, uat.json, uat.md)
- runtime_proof_id: rp-auto-20260827-01-sprint-plan-tech-lead-20260827T073646Z-US-0129
- proof_hash: 8960A93B97E39E84B107001316228F5CBE69472DDF8835752862ECF4EC3B4B00
- proof_ttl: 2026-08-27T08:36:46Z (UTC)
- prior_phase_proof_consumed: rp-auto-20260827-01-architecture-tech-lead-20260827T073000Z-US-0129 (proof_hash=DDDA46794ED39186D77F268EE47364E3070997916777582095FF9198FEEF6196, ttl=2026-08-27T08:30:00Z â independent SHA-256 MATCH; consumed at 2026-08-27T07:36:46Z before RUNTIME_PROOF_STALE; sovereign-critic architecture PASS at 2026-08-27T07:35:00Z anti_slop_aggregate=8 0 blocking findings)
- stop_condition: STOP after sprint-plan completes; hand off via artifacts only. Orchestrator owns critic of sprint-plan then /execute in fresh dev subagent per BUG-0006. Do not spawn /execute or /plan-verify from this subagent. Do not mark US-0129 DONE. Do not tick acceptance L157. Do not mutate intake JSON. Do not amend DEC-0054/DEC-0073/DEC-0119 surfaces. Do not reopen US-0126/US-0127/US-0128/US-0130. Do not change archiver heading semantics. Do not add ARCH_LINKAGE_AUTO_REPAIR to AUTONOMY_PRESET.

---

## Sprint-plan handoff â US-0130 / S0130 â `/execute` next (fresh dev; ultra_lean skips standalone /plan-verify)

- sprint_id: S0130
- story_id: US-0130
- dec_id: none (companion DEC not required per R-0112; compose DEC-0104 Â§5 / DEC-0087 / DEC-0086; A6 rejected DEC-0130)
- research_anchor: R-0112 (DQ1âDQ8 LOCKED)
- orchestrator_run_id: auto-20260826-01
- fresh_context_marker: tl-US0130-sprint-plan-20260826T215200Z-fresh
- timestamp: 2026-08-26T21:52:00Z (UTC)
- model_id: cursor-grok-4.6-high (CROSS_MODEL_REVIEW=1 â required on isolation)
- sprint_plan_verdict: PASS
- sprint_status: PLANNED (backlog OPEN per US-0045 â not mutated; acceptance L158 unchecked)
- task_count: 8 (T-anch + T-001..T-007; within SPRINT_MAX_TASKS=12)
- ac_surjective_map: AC-1->T-001,T-004,T-005(m1,m6); AC-2->T-002,T-005(m2,m7,m8); AC-3->T-001,T-005(m1,m2,m3,m6); AC-4->T-001,T-005(m4); AC-5->T-001,T-004,T-006; AC-6->T-005(all 10 markers); AC-7->T-anch,T-005(m5); AC-8->T-003,T-005(m9,m10); AC-9->T-004,T-006,T-007
- task_order: T-anch -> T-001 (select_critic_model overlay) -> T-002 (CATALOG_OPTIONAL_ROLE_KEYS + validator) -> T-003 (v2 examples + ship cursor_only as 9th) -> T-004 (scratchpad DQ8 comments, no live pin) -> T-005 (10 contract markers) -> T-006 (runbook pin-precedence) -> T-007 (SOVEREIGN_CRITIC_PAIRS + MODEL_TIER_OVERRIDES_PAIRS) -> integration verification
- compose_guards (non-negotiable): DO NOT amend US-0104 (findings JSONL / three lenses / CROSS_MODEL_* enable keys / anti-slop / opposition table / degraded_keep â marker 5), US-0102 (5-step chain / CATALOG_ROLE_KEYS required-set / PHASE_LOGICAL_ROLE â critic not in required-set; synthetic phase not registered), US-0101 (DEFAULT_PHASE_TIER_MATRIX / v1 catalogs unchanged), US-0112 (compose examples+installer; never write model-catalog.local.json), US-0127/US-0128 (DONE â do not reopen), US-0129 (OPEN â do not mutate), US-0123 (OpenCode out of scope), R-0088 (document-only), US-0045 (no backlog Status/ACs mutation), US-0048/BUG-0006 (fresh-context isolation), US-0056 (runtime proof lowercase keys only). Do not rewrite docs/engineering/architecture.md. Do not author DEC-0130. Do not write model-catalog.local.json.
- critic_carry_ins: 0 new blocking. 3 architecture critic NBs `a0130ar-*` status=resolved non-blocking â routed as awareness into /execute:
  - a0130ar-challenger-001 (`ik_us0130_arch_proof_and_overlay_gaps`): T-001 overlay must consume MODEL_SOVEREIGN-CRITIC via phase_to_model_key (hyphen exact). Do not consume underscore alias. Pin then optional roles.critic when role_catalog then opposition UNCHANGED. Do not pass a newly loaded catalog into _resolve_slug_for_tier. Same-slug keeps degraded=True.
  - a0130ar-architect-002 (`ik_us0130_arch_layer_coupling`): T-001 overlay; T-002 optional role keys; T-003 examples/installer; T-004 scratchpad comments; T-005 10 markers; T-006 runbook; T-007 parity. Do not add critic to CATALOG_ROLE_KEYS. Do not register synthetic phase.
  - a0130ar-subtractor-003 (`ik_us0130_arch_scope_discipline`): do not mark US-0130 DONE; do not tick L158; 10 markers required (not YAGNI); T-anch read-only â no architecture.md mutation; do not author DEC-0130; do not write model-catalog.local.json.
- architecture_pointers: docs/engineering/architecture.md # US-0130 (L1815 â approach A1, 10-marker table, overlay DQ2/DQ3/DQ7, optional role DQ1/DQ6, examples/installer DQ4/DQ5, scratchpad DQ8, contract tests, runbook, parity, compose-do-not-amend 9/9, risks R1âR5; sprint seeds T-anch + T-001..T-007). Do not rewrite.
- first_execute_task: T-anch (NO-OP / verification) â verify # US-0130 H1 anchor + approach A1 + R-0112 DQ1âDQ8 + compose guards 9/9 + 10-marker list locked + absent surfaces (us0130 contract test + template mirror, overlay, CATALOG_OPTIONAL_ROLE_KEYS, cursor_only 9th ship, scratchpad comments, runbook note, SOVEREIGN_CRITIC_PAIRS sovereign_critic_lib.py pair, MODEL_TIER_OVERRIDES_PAIRS cursor_only pair)
- key_locked_artifacts:
  - overlay (DQ2+DQ3+DQ7): `scripts/sovereign_critic_lib.py` `select_critic_model` prepend pin > roles.critic when role_catalog > opposition UNCHANGED; hyphen exact MODEL_SOVEREIGN-CRITIC via phase_to_model_key; SelectCriticResult shape UNCHANGED; same-slug degraded_keep UNCHANGED
  - optional catalog role (DQ1+DQ6): `CATALOG_OPTIONAL_ROLE_KEYS={"critic"}`; extra-key subtract; empty-present-critic reuses MODEL_CATALOG_SCHEMA_V2_INVALID (message names critic); missing critic not an error
  - examples + installer (DQ4+DQ5): v2 role examples get critic placeholder; cursor_only critic=composer-2.5-fast shipped as 9th; manifest + installer.ps1/py FRAMEWORK_EXACT; never write model-catalog.local.json
  - contract tests (Q1): `tests/us0130_contract_test.py` â 10 markers; mirror to template byte-identical; all static/fixture-based, no live critic spawn
  - docs (DQ8): scratchpad MODEL_* + CROSS_MODEL_* comment sites (no live pin); runbook #### Degraded fallback troubleshooting pin-precedence
  - template parity: SOVEREIGN_CRITIC_PAIRS add sovereign_critic_lib.py; MODEL_TIER_OVERRIDES_PAIRS add cursor_only json pair
- files_to_touch: scripts/sovereign_critic_lib.py + template mirror, scripts/model_tier_lib.py + template mirror, scripts/model_tier_validate.py + template mirror, v2 role example catalogs + cursor_only + template copy, installer-owned-paths.manifest, installer.ps1, installer.py, scratchpad.md + scratchpad.local.example.md + template mirrors, docs/engineering/runbook.md + template mirror, tests/us0130_contract_test.py NEW + template mirror, scripts/check_intake_template_parity.py (SOVEREIGN_CRITIC_PAIRS + MODEL_TIER_OVERRIDES_PAIRS) + template mirror
- files_NOT_to_touch: docs/engineering/architecture.md (do not rewrite), decisions/ (no DEC-0130), backlog US-0130 Status/ACs, handoffs/intake_evidence/US-0130-intake-20260826.json, .cursor/model-catalog.local.json, US-0104/US-0102/US-0101 surfaces (compose read-only), US-0127/US-0128 DONE rows, US-0129 OPEN row, v1 example catalogs
- next_phase: `/execute` (fresh dev per US-0069 / DEC-0051; first canonical phase of `build+verify` macro per ultra_lean; /plan-verify merged into qa per ultra_lean â qa creates plan-verify.json within build+verify). Orchestrator runs sovereign-critic of sprint-plan first (CROSS_MODEL_REVIEW=1). Do not mandate outer driver.
- sprint_artifacts: sprints/S0130/ (sprint.md, tasks.md, progress.md, uat.json, uat.md)
- runtime_proof_id: rp-auto-20260826-01-sprint-plan-tech-lead-20260826T215200Z-US-0130
- proof_hash: 5D0ADA062FE675333EF06E56DBC4649D22A2045C08D71456C7963893178CFED1
- proof_ttl: 2026-08-26T22:52:00Z (UTC)
- prior_phase_proof_consumed: rp-auto-20260826-01-architecture-tech-lead-20260826T214500Z-US-0130 (proof_hash=B071AE0659D99E2513304490BD3D191550631E7564398EEEC4485BD556FD8B4D, ttl=2026-08-26T22:45:00Z â independent SHA-256 MATCH; consumed at 2026-08-26T21:52:00Z before RUNTIME_PROOF_STALE; sovereign-critic architecture PASS at 2026-08-26T21:50:00Z anti_slop_aggregate=8 0 blocking findings)
- stop_condition: STOP after sprint-plan completes; hand off via artifacts only. Orchestrator owns critic of sprint-plan then /execute in fresh dev subagent per BUG-0006. Do not spawn /execute or /plan-verify from this subagent. Do not mark US-0130 DONE. Do not tick acceptance L158. Do not mutate intake JSON. Do not amend US-0104/US-0102/US-0101 surfaces. Do not reopen US-0127/US-0128. Do not mutate US-0129. Do not author DEC-0130. Do not write model-catalog.local.json.

---

## Sprint-plan handoff â US-0128 / S0128 â `/execute` next (fresh dev; ultra_lean skips standalone /plan-verify)

- sprint_id: S0128
- story_id: US-0128
- dec_id: none (companion DEC not required per R-0111 recommendation; align with DEC-0110 Â§10 smoke-green + DEC-0078 UAT probe contract)
- research_anchor: R-0111 (DQ1âDQ8 LOCKED)
- orchestrator_run_id: auto-20260826-01
- fresh_context_marker: tl-US0128-sprint-plan-2026-08-26T201100Z-fresh
- timestamp: 2026-08-26T20:11:00Z (UTC)
- model_id: cursor-grok-4.6-high (CROSS_MODEL_REVIEW=1 â required on isolation; glm-5.2-high unavailable this spawn)
- sprint_plan_verdict: PASS
- sprint_status: PLANNED (backlog OPEN per US-0045 â not mutated; acceptance L156 unchecked)
- task_count: 8 (T-anch + T-001..T-007; within SPRINT_MAX_TASKS=12)
- ac_surjective_map: AC-1->T-001,T-004(markers 1,2,3,4,5,6,8,9),T-007(markers 4,5); AC-2->T-002,T-004(markers 5,7,8); AC-3->T-003,T-004(markers 2,3,4,6); AC-4->T-002,T-004(markers 5,7,8); AC-5->T-004(all 11 markers),T-007(markers 4,5,7); AC-6->T-005(runbook subsection),T-006(SOVEREIGN_CONVERGENCE_PAIRS + 2 command rows)
- task_order: T-anch -> T-001 (surrogate eval branch in _eval_smoke_green, legacy-first) -> T-002 (qa.md + verify-work.md additive subsections) -> T-003 (reason_codes.md ## US-0128 section) -> T-004 (contract test file shell + 11 markers, with T-007 markers 4,5,7 authored within) -> T-005 (runbook subsection) -> T-006 (SOVEREIGN_CONVERGENCE_PAIRS + 2 command rows) -> integration verification
- compose_guards (non-negotiable): DO NOT amend US-0109 (deploy smoke post-publish path / DEPLOY_SMOKE_* reason codes â marker 7 regression guard), US-0126 (sprints/S0126/uat.json waived-probe fixture / S0126 release artifacts â marker 11 regression guard; reference fixture for waived_probes[] shape only; US-0126 DONE product scope NOT reopened), US-0127 (_eval_critic_resolved / read_open_blocking / hygiene CLI / SOVEREIGN_CRITIC_PAIRS â marker 10 regression guard; US-0128 touches smoke_green only, not critic_resolved; SOVEREIGN_CRITIC_PAIRS unchanged), US-0110 (five-conjunct structure / degrade matrix / CONVERGENCE_SMOKE_PROBE_FAIL reason code â marker 9 regression guard; surrogate branch is an additional PASS path inside smoke_green; conjunct name/order/shape unchanged; CONVERGENCE_SMOKE_SURROGATE_MISSING is additive), US-0104 (critic findings JSONL / read_open_blocking / resolve_finding â US-0128 does not touch critic surfaces), US-0045 (no backlog Status/ACs mutation), US-0048/BUG-0006 (fresh-context isolation), US-0056 (runtime proof lowercase keys only). Do not rewrite docs/engineering/architecture.md.
- critic_carry_ins: 0 new blocking. 3 architecture critic NBs `a0128arch-*` status=resolved non-blocking â routed as awareness into /execute:
  - a0128arch-challenger-001 (`ik_us0128_arch_proof_and_boundary_gaps`): T-001 preserve legacy-first (`_uat_smoke_passes` before surrogate). R6 `id=convergence_smoke` also matches `_step_is_smoke` â do not invert. T-002 emit explicit `convergence_smoke` (S0126 steps lack probe_kind â R7; marker 11 reference only). Fail-closed SURROGATE_MISSING when neither top-level contract_test_failed nor derived passed==total. T-007 marker 4: partial waivers must not false-pass.
  - a0128arch-architect-002 (`ik_us0128_arch_layer_compose_boundaries`): T-001 lib only; T-002 commands; T-003 reason_codes; T-004 tests; T-005/T-006 runbook+parity. No lib-side uat.json synthesis (A4 rejected). Do not touch `_eval_critic_resolved` / SOVEREIGN_CRITIC_PAIRS.
  - a0128arch-subtractor-003 (`ik_us0128_arch_scope_discipline`): do not mark US-0128 DONE; do not tick L156; 11 markers required (not YAGNI); T-anch read-only â no architecture.md mutation.
- architecture_pointers: docs/engineering/architecture.md # US-0128 (L1671 â approach A1, 11-marker AC-5 table, surrogate eval branch DQ1+DQ3+DQ4, canonical uat step DQ2+DQ5, fail-closed reason code DQ3+DQ4, contract tests DQ6, operator docs DQ7, template parity DQ8, compose-do-not-amend 8/8, risks R1âR7; sprint seeds T-anch + T-001..T-007). Do not rewrite.
- first_execute_task: T-anch (NO-OP / verification) â verify # US-0128 H1 anchor + approach A1 + R-0111 DQ1âDQ8 + compose guards 8/8 + 11-marker list locked + absent surfaces (us0128 contract test + template mirror, qa.md/verify-work.md subsections, runbook subsection, reason_codes.md section, SOVEREIGN_CONVERGENCE_PAIRS qa/verify-work rows)
- key_locked_artifacts:
  - surrogate eval branch (DQ1+DQ3+DQ4): `scripts/sovereign_convergence_lib.py` `_eval_smoke_green` legacy path first via `_uat_smoke_passes`; if legacy FAIL, surrogate prerequisites: 6 canonical waived_probes UAT_PROBE_FORBIDDEN + `contract_test_failed=0` (top-level authoritative, derived fallback) + surrogate step (`id=convergence_smoke` preferred OR tail `probe_kind=contract_tests_primary` `result=pass`); `ConjunctResult(name="smoke_green", â¦)` shape unchanged; `CONVERGENCE_SMOKE_PROBE_FAIL` retained for real smoke step / US-0109 deploy smoke; new `CONVERGENCE_SMOKE_SURROGATE_MISSING` for surrogate prerequisites unmet (DQ4 cases 4â8); partial waivers fail closed (case 6); US-0109 deploy smoke precedence orthogonal (case 9)
  - canonical uat step (DQ2+DQ5): `.cursor/commands/qa.md` + `.cursor/commands/verify-work.md` (+ template mirrors) additive `### Convergence smoke surrogate (US-0128)` subsection under `## Self-verify UAT probes (US-0092 / DEC-0078)` after `### Browser UAT self-test (US-0093)` before `## Steps`; emission rule for `convergence_smoke` step with `probe_kind=contract_tests_primary`, `result=pass` (when `contract_test_failed=0`)
  - fail-closed reason code (DQ3+DQ4): `docs/engineering/reason_codes.md` (+ template mirror) new `## US-0128: Convergence smoke surrogate (DEC-0110 Â§10 smoke-green)` section with `CONVERGENCE_SMOKE_SURROGATE_MISSING` + clarifying note on US-0110 `CONVERGENCE_SMOKE_PROBE_FAIL` row (description only, not schema change)
  - contract tests (DQ6+R-0111 Q1): `tests/us0128_contract_test.py` â 11 markers (8 from DQ6 + 3 compose regression guards: marker 9 US-0110, marker 10 US-0127, marker 11 US-0126); mirror to `template/tests/us0128_contract_test.py` byte-identical; all static/fixture-based, no live critic spawn
  - operator docs (DQ7): runbook `### Smoke surrogate for waived-probe UAT slices (US-0128)` after `### Blocking-only conjunct-3 semantics (US-0127)` (L2811) before `### Interpret \`goal_progress\` block` (L2829); active + template byte-identical
  - template parity (DQ8): `SOVEREIGN_CONVERGENCE_PAIRS` additive rows for `qa.md` <-> `template/.cursor/commands/qa.md` and `verify-work.md` <-> `template/.cursor/commands/verify-work.md`; `--scope=sovereign-convergence` extended automatically via tuple union; `SOVEREIGN_CRITIC_PAIRS` unchanged
- files_to_touch: scripts/sovereign_convergence_lib.py + template mirror, .cursor/commands/qa.md + template mirror, .cursor/commands/verify-work.md + template mirror, docs/engineering/reason_codes.md + template mirror, tests/us0128_contract_test.py NEW + template mirror, docs/engineering/runbook.md + template mirror, scripts/check_intake_template_parity.py (2 new rows in SOVEREIGN_CONVERGENCE_PAIRS) + template mirror
- files_NOT_to_touch: docs/engineering/architecture.md (do not rewrite), decisions/ (no new DEC), backlog US-0128 Status/ACs, handoffs/intake_evidence/US-0128-intake-20260825.json, sprints/S0126/uat.json (read-only reference fixture â marker 11 guards non-mutation), US-0109/US-0126/US-0127/US-0110/US-0104 surfaces (compose read-only), US-0121..US-0127 DONE rows, US-0129/US-0130 OPEN rows
- next_phase: `/execute` (fresh dev per US-0069 / DEC-0051; first canonical phase of `build+verify` macro per ultra_lean; /plan-verify merged into qa per ultra_lean â qa creates plan-verify.json within build+verify)
- sprint_artifacts: sprints/S0128/ (sprint.md, tasks.md, progress.md, uat.json, uat.md)
- runtime_proof_id: rp-auto-20260826-01-sprint-plan-tech-lead-2026-08-26T201100Z-US-0128
- proof_hash: C911D7C5CAA2939EC6F65ED07C717E9CBB00E80B551DCBFECA097D39F26878F4
- proof_ttl: 2026-08-26T21:11:00Z (UTC)
- prior_phase_proof_consumed: rp-auto-20260826-01-architecture-tech-lead-2026-08-26T195500Z-US-0128 (proof_hash=FF499010B78C4FB7855E9D6F4482227AD7B258230671D67E4E2B42571A68A969, ttl=2026-08-26T20:55:00Z â independent SHA-256 MATCH; consumed at 2026-08-26T20:11:00Z before RUNTIME_PROOF_STALE; sovereign-critic architecture PASS at 2026-08-26T19:59:00Z anti_slop_aggregate=8 0 blocking findings)
- stop_condition: STOP after sprint-plan completes; hand off via artifacts only to /execute in fresh dev subagent per BUG-0006. Do not spawn /execute from this subagent. Do not mark US-0128 DONE. Do not tick acceptance L156. Do not mutate intake JSON. Do not amend US-0104/US-0110/US-0109/US-0126/US-0127 surfaces. Do not mutate US-0129/US-0130.

---

## Sprint-plan handoff â US-0127 / S0127 â `/plan-verify` next (fresh qa)

- sprint_id: S0127
- story_id: US-0127
- dec_id: none (companion DEC not required per R-0110 recommendation; align with DEC-0110 Â§10 / DEC-0104 Â§11)
- research_anchor: R-0110 (DQ1âDQ8 LOCKED)
- orchestrator_run_id: auto-20260825-01
- fresh_context_marker: tl-US0127-sprint-plan-20260825T185100Z-fresh
- timestamp: 2026-08-25T18:51:00Z (UTC)
- model_id: glm-5.2-high (CROSS_MODEL_REVIEW=1 â required)
- sprint_plan_verdict: PASS
- sprint_status: PLANNED (backlog OPEN per US-0045 â not mutated)
- task_count: 8 (T-anch + T-001..T-007; within SPRINT_MAX_TASKS=12)
- ac_surjective_map: AC-1->T-001,T-004(markers 1,2,11,12,13),T-007(marker 13); AC-2->T-002,T-004(markers 3,4,5); AC-3->T-003,T-004(markers 6,7,8,9,10); AC-4->T-004(all 13 markers),T-007(marker 13); AC-5->T-005(runbook subsections + reason_codes.md section); AC-6->T-006(SOVEREIGN_CRITIC_PAIRS + --scope=sovereign-critic)
- task_order: T-anch -> T-001 (convergence lib fix + DQ6 dispatch) -> T-002 (auto-resolve hook + helper) -> T-003 (hygiene CLI + 6 reason codes) -> T-004 (contract test file shell + 13 markers, with T-007 marker 13 authored within) -> T-005 (runbook subsections + reason_codes.md section) -> T-006 (SOVEREIGN_CRITIC_PAIRS + parity CLI extension) -> integration verification
- compose_guards (non-negotiable): DO NOT amend US-0104 (sovereign_critic_lib.read_open_blocking / resolve_finding / findings JSONL schema / build_qa_cross_reviewer_block / sovereign_critic_validate.py â DQ7), US-0110 (five-conjunct structure / degrade matrix / CONVERGENCE_CROSS_REVIEWER_OPEN reason code â DQ8), US-0107 (deferral register / drain-generate / sovereign loop stop matrix â DQ8), US-0045 (no backlog Status/ACs mutation), US-0048/BUG-0006 (fresh-context isolation), US-0053/DEC-0035 (narrow-read phase context), US-0103/DEC-0103 (no ledger entries from sprint-plan), US-0056 (runtime proof lowercase keys only)
- critic_carry_ins: 0 new (3 architecture critic NBs noted in sovereign-critic of architecture â all non-blocking: ik_us0127_arch_proof_and_boundary_gaps, ik_us0127_arch_layer_compose_boundaries, ik_us0127_arch_scope_discipline â routed as awareness into /execute via this sprint plan)
- architecture_pointers: docs/engineering/architecture.md # US-0127 (L1852 â approach A1, 13-marker AC-4 table, convergence lib fix DQ1+DQ6, auto-resolve hook DQ1, hygiene CLI DQ2+DQ5, contract tests DQ3, operator docs DQ4, template parity DQ5, compose-do-not-amend 8/8, risks R1âR6; sprint seeds T-anch + T-001..T-007)
- first_execute_task: T-anch (NO-OP / verification) â verify # US-0127 H1 anchor + approach A1 + R-0110 DQ1âDQ8 + compose guards 8/8 + 13-marker list locked + absent surfaces (hygiene CLI, contract test, SOVEREIGN_CRITIC_PAIRS, runbook subsections, reason_codes.md section)
- key_locked_artifacts:
  - convergence lib fix (DQ1+DQ6): `scripts/sovereign_convergence_lib.py` `_critic_jsonl_has_open` -> delegate to `read_open_blocking`; `_eval_critic_resolved` JSONL-authoritative when present, QA-markdown fallback when JSONL absent, skip when neither deployed
  - auto-resolve hook (DQ1): `.cursor/commands/sovereign-critic.md` conditional call at end of command after reconcile+JSONL+isolation, before `## Stop conditions`; `auto_resolve_nonblocking_for_run` helper in `sovereign_critic_lib.py` (additive; scope key `(orchestrator_run_id, phase_id)`; idempotent via `resolve_finding`; `SOVEREIGN_CRITIC_AUTORESOLVE_FAILED` non-blocking info)
  - hygiene CLI (DQ2+DQ5): NEW `scripts/sovereign_critic_hygiene.py` + template mirror; inventory `--report`/`--resolve-nonblocking-for-run`/`--dry-run`/`--confirm`/`--self-test`/`--all-phases`/`--phase-id`; 6 reason codes (`HYGIENE_RESOLVE_CONFIRM_REQUIRED`, `HYGIENE_RESOLVE_NO_CANDIDATES`, `HYGIENE_RESOLVE_PARTIAL`, `HYGIENE_RESOLVE_FAILED`, `HYGIENE_REPORT_EMPTY`, `HYGIENE_RESOLVE_PHASE_SCOPE_REQUIRED`); operator-only-when-quiet contract (no advisory lock â Q3 accepted)
  - contract tests (DQ3+R2): `tests/us0127_contract_test.py` â 13 markers (10 from DQ3 + 2 compose regression guards + marker 13 R2 validator guard); mirror to `template/tests/us0127_contract_test.py` byte-identical; all static/fixture-based, no live critic spawn
  - operator docs (DQ4): runbook `### Blocking-only conjunct-3 semantics (US-0127)` after `### Evaluate convergence` (L2792) before `### Interpret goal_progress block` (L2811); runbook `### Hygiene CLI (US-0127)` after `#### Parity enforcement` (L2915) before `#### Related artifacts` (L2923); `reason_codes.md` `## US-0127` section after US-0110 section (L77âL107); active + template byte-identical
  - template parity (DQ5): `SOVEREIGN_CRITIC_PAIRS` additive row (hygiene script pair); `--scope=sovereign-critic` parity CLI extension; `SOVEREIGN_CONVERGENCE_PAIRS` existing rows confirmed (no new row â convergence lib mirror already present)
- files_to_touch: scripts/sovereign_convergence_lib.py + template mirror, scripts/sovereign_critic_lib.py + template mirror (additive auto_resolve_nonblocking_for_run helper), .cursor/commands/sovereign-critic.md + template mirror, scripts/sovereign_critic_hygiene.py NEW + template mirror, tests/us0127_contract_test.py NEW + template mirror, docs/engineering/runbook.md + template mirror, docs/engineering/reason_codes.md + template mirror, scripts/check_intake_template_parity.py (--scope=sovereign-critic extension) + template mirror
- files_NOT_to_touch: decisions/ (no new DEC), backlog US-0127 Status/ACs, handoffs/intake_evidence/US-0127-intake-20260825.json, US-0104/US-0110/US-0107 surfaces (compose read-only), US-0121..US-0126 DONE rows, scripts/sovereign_critic_validate.py (read-only â marker 13 asserts its behavior; do not amend)
- next_phase: `/plan-verify` (fresh qa per orchestrator brief) for S0127 / US-0127
- sprint_artifacts: sprints/S0127/ (sprint.md, tasks.md, progress.md, uat.json, uat.md)
- runtime_proof_id: rp-auto-20260825-01-sprint-plan-tech-lead-20260825T185100Z-US-0127
- proof_hash: DE343C909809932C3EA4B83A0D8B5F23FF8535954F05512C5D33A3EB3DE65723
- proof_ttl: 2026-08-25T19:51:00Z (UTC)
- stop_condition: STOP after sprint-plan completes; hand off via artifacts only to /plan-verify in fresh qa subagent per BUG-0006. Do not spawn /plan-verify from this subagent. Do not mark US-0127 DONE. Do not tick acceptance L155. Do not mutate intake JSON. Do not amend US-0104/US-0110/US-0107 surfaces.

## Architecture handoff â US-0127 â /sprint-plan next (fresh tech-lead)

- story_id: US-0127
- sprint_id: (pending â created at sprint-plan)
- dec_id: none (companion DEC not required per R-0110 recommendation; align with DEC-0110 Â§10 / DEC-0104 Â§11)
- research_anchor: R-0110 (DQ1-DQ8 LOCKED)
- orchestrator_run_id: auto-20260825-01
- delivery_mode: ultra_lean
- macro_phase: plan
- fresh_context_marker: tl-US0127-architecture-20260825T184100Z-fresh
- timestamp: 2026-08-25T18:41:00Z (UTC)
- model_id: glm-5.2-high (CROSS_MODEL_REVIEW=1 â required)
- architecture_verdict: PASS (no DECISION_GATE; approach A1 locked; sprint seeds T-anch + T-001..T-007 within SPRINT_MAX_TASKS=12; risks R1-R6 finalized; compose-do-not-amend verified 8/8)
- architecture_anchor: docs/engineering/architecture.md # US-0127 (L1852; inserted after # US-0126 section and before # US-0091 per DEC-0073 Â§11 heading policy)
- root_cause: scripts/sovereign_convergence_lib.py _critic_jsonl_has_open (L318-331) treats every status=open row as unmet and defaults blocking=True when key absent â ~280 informational status=open,blocking=false rows block CONVERGENCE_CROSS_REVIEWER_OPEN despite US-0110 L3 requiring "no open blocking cross-reviewer findings"
- approach_A1: narrow _critic_jsonl_has_open to delegate to sovereign_critic_lib.read_open_blocking(repo); change _eval_critic_resolved dispatch (DQ6 â JSONL authoritative when present, QA-markdown fallback when JSONL absent, informational skip when neither deployed); auto-resolve hook at /sovereign-critic PASS (DQ1 â scope key (orchestrator_run_id, phase_id), idempotent via resolve_finding, SOVEREIGN_CRITIC_AUTORESOLVE_FAILED non-blocking info); new scripts/sovereign_critic_hygiene.py + template mirror (DQ2 â --report/--resolve-nonblocking-for-run/--dry-run/--confirm/--self-test/--all-phases/--phase-id + 6 reason codes); 13 test_us0127_* markers (DQ3 + R2 marker 13); runbook subsections + reason_codes.md section (DQ4); SOVEREIGN_CRITIC_PAIRS additive row + --scope=sovereign-critic parity CLI extension (DQ5)
- open_questions_accepted: Q1=13 markers (R2 validator guard); Q2=yes --all-phases + HYGIENE_RESOLVE_PHASE_SCOPE_REQUIRED; Q3=no advisory lock (document operator-only-when-quiet contract)
- sprint_seeds: T-anch (anchor verification NO-OP) + T-001 (AC-1 convergence lib fix + DQ6 dispatch) + T-002 (AC-2 auto-resolve hook + helper) + T-003 (AC-3 hygiene CLI + template mirror + 6 reason codes) + T-004 (AC-4 13 contract markers + template mirror) + T-005 (AC-5 runbook subsections + reason_codes.md section + template mirror) + T-006 (AC-6 SOVEREIGN_CRITIC_PAIRS + parity CLI extension) + T-007 (R2 validator regression guard marker 13)
- compose_guards (non-negotiable): DO NOT amend US-0104 (sovereign_critic_lib.read_open_blocking / resolve_finding / findings JSONL schema / build_qa_cross_reviewer_block / sovereign_critic_validate.py â DQ7), US-0110 (five-conjunct structure / degrade matrix / CONVERGENCE_CROSS_REVIEWER_OPEN reason code â DQ8), US-0107 (deferral register / drain-generate / sovereign loop stop matrix â DQ8), US-0045 (no backlog Status/ACs mutation), US-0048/BUG-0006 (fresh-context isolation), US-0053/DEC-0035 (narrow-read phase context), US-0103/DEC-0103 (no ledger entries from architecture), US-0056 (runtime proof lowercase keys only)
- files_to_touch: scripts/sovereign_convergence_lib.py + template mirror, .cursor/commands/sovereign-critic.md + template mirror, scripts/sovereign_critic_lib.py + template mirror (additive auto_resolve_nonblocking_for_run helper), scripts/sovereign_critic_hygiene.py NEW + template mirror, tests/us0127_contract_test.py NEW + template mirror, docs/engineering/runbook.md + template mirror, docs/engineering/reason_codes.md + template mirror, scripts/check_intake_template_parity.py (--scope=sovereign-critic extension)
- files_NOT_to_touch: decisions/ (no new DEC), backlog US-0127 Status/ACs, handoffs/intake_evidence/US-0127-intake-20260825.json, US-0104/US-0110/US-0107 surfaces (compose read-only), US-0121..US-0126 DONE rows
- triad_rollover: architecture moved=1 pack=docs/engineering/architecture-archive/architecture-pack-20260825-a.md (legacy ## US-0119 H2 section archived, 200 lines); state moved=1 pack=docs/engineering/state-archive/state-pack-20260825-ab.md; enforce-triad-hot-surface.py --check exit 0; --check-arch-heading-policy --baseline-h2-count 1 exit 0
- codebase_map: [CODEBASE_MAP_OK] preserved_existing trigger=architecture
- runtime_proof_id: rp-auto-20260825-01-architecture-tech-lead-20260825T184100Z-US-0127
- proof_hash: DF773DDFBA1021C5DBD44F0470469BD76A909C1373FC528BAEA65070CB9A179C
- proof_ttl: 2026-08-25T19:41:00Z (UTC)
- next_scheduled_phase: /sprint-plan (role=tech-lead per US-0069 / DEC-0051; third canonical phase of plan macro per ultra_lean; after sovereign-critic of architecture)
- stop_condition: STOP after architecture completes; hand off via artifacts only to sovereign-critic of architecture, then /sprint-plan in fresh tech-lead subagent (BUG-0006). Do not spawn /sprint-plan from this subagent. Do not mark US-0127 DONE. Do not tick acceptance. Do not mutate intake JSON. Do not amend US-0104/US-0110/US-0107 surfaces.

ï»¿## Sprint-plan handoff â **US-0126** / **S0126** â `/plan-verify` next (fresh qa)

- sprint_id: S0126
- story_id: US-0126
- dec_id: DEC-0126 (Accepted, decisions/DEC-0126.md)
- research_anchor: R-0109 (DQ1..DQ8 LOCKED for US-0126; US-0121 Q1..Q12 + US-0122 DQ1..DQ8 + US-0123 DQ1..DQ10 + US-0124 DQ1..DQ8 + US-0125 DQ1..DQ8 locks preserved)
- orchestrator_run_id: auto-20260825-01
- fresh_context_marker: tl-US0126-sprint-plan-20260825T161520Z-fresh
- sprint_plan_verdict: PASS
- sprint_status: PLANNED (backlog OPEN per US-0045 â not mutated)
- task_count: 11 (T-anch + T-001..T-010; within SPRINT_MAX_TASKS=12)
- ac_surjective_map: AC-1->T-001,T-004(marker 1); AC-2->T-001,T-005,T-004(marker 2); AC-3->T-003,T-004(marker 3),T-009(marker 3); AC-4->T-004(all 12 markers),T-010(markers 4,12); AC-5->T-002,T-006(markers 5,6); AC-6->T-001,T-007(marker 7); AC-7->T-001,T-002,T-008(marker 8); AC-8->T-001,T-002,T-008(marker 9); AC-9->T-003,T-009(marker 10); AC-10->T-009(marker 11)
- task_order: T-anch -> T-001 (runbook h2 body with T-005 consolidated table inline) -> {T-002, T-003 parallel (README blurb, OPENCODE_ADAPTER_PAIRS extension)} -> T-004 (contract test file shell + 12 markers) -> {T-006, T-007, T-008, T-009, T-010 parallel (markers 5,6 / 7 / 8,9 / 3,10,11 / 4,12)} -> integration verification
- compose_guards (non-negotiable): DO NOT amend US-0071 (operator-sentence sanitization â no DEC ids in operator prose; cross-references to runbook h2 / Boundaries subsection only), US-0113..US-0117 (operator docs â add OpenCode host section; do not rewrite Cursor command catalogs), US-0121/DEC-0120 (installer `--host` flag docs hook â `## OpenCode host mode (US-0121)` h2 untouched; US-0126 cross-links), US-0122/DEC-0122 (seven role agents â referenced, not redefined), US-0123 (per-role slug routing â referenced, not re-listed), US-0124/DEC-0124 (orchestrator plugin + stub reason-code h2 untouched â US-0126 owns consolidated table; cross-links to US-0124 stub h2; does not reimplement plugin logic), US-0125/DEC-0125 (thin commands + validator-bridge stub h2 untouched â US-0126 owns consolidated table; **DEC-0125 DQ7 raw Python reason codes upheld â `OPENCODE_VALIDATOR_FAILED` wrapper NOT resurrected**), US-0102/DEC-0087 (no vendor slugs in `template/` â no vendor slugs in runbook/README operator prose)
- critic_carry_ins: 0 new (3 research critic NBs closed in architecture phase: ik_us0126_dq3_parity_grep_false_pass [DQ3 explicit layer split â parity CLI byte-only vs contract-test grep], ik_us0126_layering_runbook_dec_tests [DQ1+DQ8 runbook whole-file byte-identical pair coupling documented], ik_us0126_research_scope_yagni_markers [DQ4 12 markers locked + AC-10 deterministic static check vs current-kit-inventory, not frozen git snapshot])
- architecture_pointers: docs/engineering/architecture.md # US-0126 (L1747 â approach A1, 12-marker table, runbook section DQ1, reason-code table DQ2, parity scope DQ3, contract tests DQ4, program DoD DQ5, default-host reminder DQ6, out-of-scope DQ7, template parity manifest DQ8, non-goals; sprint seeds T-anch + T-001..T-010 at L1981)
- dec_pointers: decisions/DEC-0126.md (Â§1 runbook section, Â§2 locked operator sentences, Â§3 consolidated reason-code table, Â§4 parity scope + layer split, Â§5 12-marker contract-test list, Â§6 template parity manifest unchanged, Â§7 compose-do-not-amend, Â§8 isolation + runtime proof)
- first_execute_task: T-anch (NO-OP / verification) â verify # US-0126 H1 anchor + DEC-0126 Accepted + compose guards 8/8 + 12-marker list locked + runbook/reason-code/parity/DoD/reminder/out-of-scope/manifest contracts + absent surfaces
- key_locked_artifacts:
  - runbook section (DQ1): new sibling h2 `## OpenCode host operator runbook (US-0126)` in `docs/engineering/runbook.md` + `template/docs/engineering/runbook.md` byte-identical; placed immediately after `## OpenCode thin commands + validator bridge (US-0125)` section; US-0121/US-0124/US-0125 h2 sections untouched (compose, do not amend)
  - locked operator sentences (DQ5, DQ6, DQ7): program DoD sentence (verbatim), default-host reminder sentence (verbatim, no DEC ids per US-0071), out-of-scope list (verbatim operator prose, no DEC ids); Boundaries subsection (runbook only; cross-references to DEC ids allowed here â `docs/product/standalone-runtime-masterplan.md`, `DEC-0055`, `US-0093`)
  - consolidated reason-code table (DQ2): 4 `OPENCODE_*` US-0124 + 5 installer `OPENCODE_*`/`CURSOR_*` US-0121 + 3 reused cross-host + raw Python validator codes (no `OPENCODE_VALIDATOR_FAILED` wrapper per DEC-0125 DQ7); each with one-line semantics + fail-closed action + cross-link to owning slice
  - parity scope (DQ3): additive `OPENCODE_ADAPTER_PAIRS` extension (2 new pairs: `tests/us0126_contract_test.py` â template + `docs/engineering/runbook.md` â template); parity CLI stays byte-only (DQ3 layer split â critic NB `ik_us0126_dq3_parity_grep_false_pass` closed); reason-code table presence + `test_us0126_*` markers = contract-test grep, NOT parity-CLI predicates
  - contract tests (DQ4): `tests/us0126_contract_test.py` â 12 markers (see architecture AC-4 table); mirror to `template/tests/us0126_contract_test.py` byte-identical; all static/grep, no live OpenCode probe (vision D10)
  - AC-10 baseline (DQ4): deterministic static check vs current-kit-inventory (sorted file-name list of `.cursor/commands/*.md` + `.cursor/agents/*.md` checked into the repo at execute time); NOT a frozen pre-US-0126 git snapshot (fragile); NOT a hash manifest of the entire `.cursor/` directory (over-broad)
  - manifest (DQ8): `installer-owned-paths.manifest` UNCHANGED (runbook already covered by `docs` in `[install_include_paths]`; `tests/us0126_contract_test.py` NOT installer-shipped per US-0121..US-0125 pattern)
- next_phase: `/plan-verify` (fresh qa per orchestrator brief) for S0126 / US-0126
- sprint_artifacts: sprints/S0126/ (sprint.md, tasks.md, progress.md, uat.json, uat.md)
- timestamp: 2026-08-25T16:15:20Z
- role: tech-lead
- model_id: glm-5.2-high (CROSS_MODEL_REVIEW=1 â required)
- runtime_proof_id: rp-auto-20260825-01-sprint-plan-tech-lead-20260825T161520Z-US-0126
- proof_hash: 10E2CAC09DA36BF61FAAC0A3A258C49E2095875703018CAD4102E921704FC2A9

### Isolation evidence (US-0048 / DEC-0029 / US-0104 v2)

- `phase_id=sprint-plan`
- `role=tech-lead`
- `fresh_context_marker=tl-US0126-sprint-plan-20260825T161520Z-fresh`
- `timestamp=2026-08-25T16:15:20Z`
- `model_id=glm-5.2-high` (CROSS_MODEL_REVIEW=1 â required)
- `evidence_ref=sprints/S0126/sprint.md, sprints/S0126/tasks.md, sprints/S0126/progress.md, sprints/S0126/uat.json, sprints/S0126/uat.md, docs/engineering/state.md (sprint-plan checkpoint append-bottom + traceability row), docs/engineering/architecture.md # US-0126, decisions/DEC-0126.md, handoffs/resume_brief.md`

### Strict runtime proof (US-0056 / DEC-0038)

- `orchestrator_run_id=auto-20260825-01`
- `runtime_proof_id=rp-auto-20260825-01-sprint-plan-tech-lead-20260825T161520Z-US-0126`
- `phase_id=sprint-plan`, `role=tech-lead`, `story_id=US-0126`, `sprint_id=S0126`
- `proof_issued_at=2026-08-25T16:15:20Z`
- `proof_ttl_seconds=3600`, `proof_ttl=2026-08-25T17:15:20Z`
- Canonical payload: `{"delivery_mode":"ultra_lean","macro_phase":"plan","model_id":"glm-5.2-high","orchestrator_run_id":"auto-20260825-01","phase_id":"sprint-plan","proof_issued_at":"2026-08-25T16:15:20Z","proof_ttl_seconds":3600,"role":"tech-lead","runtime_proof_id":"rp-auto-20260825-01-sprint-plan-tech-lead-20260825T161520Z-US-0126","sprint_id":"S0126","story_id":"US-0126"}`

---

## Sprint-plan handoff â **US-0125** / **S0125** â `/plan-verify` next (fresh qa)

- sprint_id: S0125
- story_id: US-0125
- dec_id: DEC-0125 (Accepted, decisions/DEC-0125.md)
- research_anchor: R-0109 (DQ1..DQ8 LOCKED for US-0125; US-0121 Q1..Q12 + US-0122 DQ1..DQ8 + US-0123 DQ1..DQ10 + US-0124 DQ1..DQ8 locks preserved)
- orchestrator_run_id: auto-20260824-02
- fresh_context_marker: tl-US0125-sprint-plan-20260824T204500Z-fresh
- sprint_plan_verdict: PASS
- sprint_status: PLANNED (backlog OPEN per US-0045 â not mutated)
- task_count: 10 (T-anch + T-001..T-009; within SPRINT_MAX_TASKS=12)
- ac_surjective_map: AC-1->T-001,T-006(markers 1,8,11),T-007; AC-2->T-002,T-006(marker 2); AC-3->T-003,T-004,T-006(markers 3,4); AC-4->T-003,T-005,T-006(marker 4); AC-5->T-004,T-006(marker 5); AC-6->T-006(marker 6); AC-7->T-006(markers 7,8); AC-8->T-006(all 11 markers),T-008(parity+runbook stub); AC-9->T-anch(baseline),T-006(marker 9); AC-10->T-005,T-006(marker 10)
- task_order: T-anch -> T-001 (15 command files) -> {T-002, T-003, T-004, T-007 parallel (clone-guard marker, mapping fixture, bridge prose, manifest rows)} -> T-008 (README + parity + runbook stub) -> T-005 (mock-subprocess harness) -> T-006 (contract tests last) -> T-009 (validator decision) -> integration verification
- compose_guards (non-negotiable): DO NOT amend US-0001 (phase names + artifact outputs; no 200-line clones per AC-9), US-0078/DEC-0060 (`intake_evidence_validate.py` remains persistence-blocking gate; thin commands subprocess, do not reimplement), US-0121/DEC-0120 (host default cursor-only; commands live in reserved `template/.opencode/commands/` slot; `.gitkeep` replaced by 15 files), US-0122/DEC-0122 (`template/.opencode/agents/*.md` unchanged â commands bind via `agent: <role>` frontmatter per DQ5/DQ8), US-0124/DEC-0124 (`template/.opencode/plugins/orchestrator.ts` unchanged â plugin owns spawn + `ctx.tool.hook` enforcement; US-0125 authors validatorâartifact mapping that the plugin consumes â additive data, not plugin code change; `/auto` is dispatch-only; missing command must not disable plugin per US-0124 AC-7 â US-0125 AC-7), US-0126 (owns full runbook + reason-code table + `--scope=opencode-adapter` parity text; US-0125 ships stub reason-code reference only), US-0102/DEC-0087 (no vendor slugs in `template/` â no `model:` literals in any command frontmatter)
- critic_carry_ins (1 non-blocking â closed in /execute T-002, not silently dropped):
  - `ik_us0125_dq2_normalization_strip_list_open` -> T-002 note: lock the token-strip manifest as a documented Python constant `US0125_CLONE_GUARD_STRIP_TOKENS` in `test_us0125_clone_guard` so the normalization strip list is explicit, version-controlled, and inherited by US-0126 without re-derivation. Strip list: frontmatter fence block + lowercase + punctuation + canonical phase id token + shared vocabulary words (its-magic, command, phase, artifact, STOP, run, validator, plugin, script, python, scripts, repo, the, a, an, to, of, and, or, before, after, above, below, path, list, id).
- architecture_pointers: docs/engineering/architecture.md # US-0125 (L1836 â approach A1, 11-marker table, command inventory DQ1, clone guard DQ2, validator-bridge DQ3, defense-in-depth DQ4, `/auto` dispatch-only DQ5, frontmatter shape DQ6, reason-code boundary DQ7, mock-ctx+mock-subprocess harness DQ8, non-goals; validatorâartifact mapping table at L1939-L1945)
- dec_pointers: decisions/DEC-0125.md (Â§1 command file inventory, Â§2 clone guard, Â§3 validator bridge contract, Â§4 defense-in-depth, Â§5 `/auto` dispatch-only, Â§6 frontmatter shape, Â§7 reason-code boundary, Â§8 mock-ctx+mock-subprocess harness)
- first_execute_task: T-anch (NO-OP / verification) â verify # US-0125 H1 anchor + DEC-0125 Accepted + compose guards 7/7 + 11-marker list locked + command/clone-guard/validator-bridge/dispatch-only/frontmatter/reason-code/harness contracts + absent surfaces
- key_locked_artifacts:
  - command file inventory (DQ1): 15 dispatch-only markdown files at `template/.opencode/commands/<name>.md` â 12 lifecycle phases (`intake.md`â`po`, `discovery.md`â`po`, `research.md`â`tech-lead`, `architecture.md`â`tech-lead`, `sprint-plan.md`â`tech-lead`, `plan-verify.md`â`qa`, `execute.md`â`dev`, `qa.md`â`qa`, `verify-work.md`â`qa`, `release.md`â`release`, `closure.md`â`qa` with prompt `role=qe` per DEC-0051 / US-0120, `refresh-context.md`â`curator`) + `auto.md` (`agent: auto` + `subtask: false` â dispatch-only per DQ5) + `quick.md` (`agent: tech-lead` â mega_quick entry per US-0096 / DEC-0082) + `ask.md` (omits `agent:` â agent-agnostic, read-only); each â¤ 20 lines (DQ2 line cap)
  - clone guard (DQ2): per-file line cap â¤ 20 + normalized-text similarity â¤ 0.30 via `difflib.SequenceMatcher` vs `.cursor/commands/<name>.md`; strip list constant `US0125_CLONE_GUARD_STRIP_TOKENS` locked in T-002 (closes `ik_us0125_dq2_normalization_strip_list_open`)
  - validator bridge contract (DQ3, DQ4, DQ7): two named CLIs (`scripts/intake_evidence_validate.py --repo . --enforce`; `scripts/bug_issue_validate.py --repo . --check-acceptance`) + generic bridge contract (`python scripts/<validator>.py --repo . [--enforce] [--scope <scope>]`); US-0126 owns full enumeration; command prose = diagnostics, plugin `ctx.tool.hook("execute.before")` = enforcement (DQ4); raw Python reason codes for validator non-zero exit; `OPENCODE_DRIVER_INVOKE_FAILED` (DEC-0124 DQ6) for subprocess invocation failure; no `OPENCODE_VALIDATOR_FAILED` wrapper (DQ7)
  - validatorâartifact mapping (DQ4): authored in architecture.md L1939-L1945 (US-0125-owned, US-0124-consumed); T-003 extracts to test fixture `tests/us0125/fixtures/validator_artifact_mapping.json` â NO architecture.md mutation in /execute
  - `/auto` dispatch-only (DQ5): `template/.opencode/commands/auto.md` â `agent: auto` + `subtask: false` + body names orchestrator role + points to plugin for spawn + STOP; no `ctx.session.create`/`Session.create`/`spawn` literals; plugin (US-0124) remains single spawn owner
  - frontmatter shape (DQ6): `description` + `agent: <role>` for 14 files; `/auto` adds `subtask: false`; `/ask` omits `agent`; no `model:` in any template command (US-0102 + US-0123)
  - reason-code boundary (DQ7): raw Python reason codes (`INTAKE_PERSISTENCE_BLOCKED`, `INTAKE_REQUIRED_TOPIC_MISSING`, `BUG_ISSUE_VALIDATION_FAILED`, ...) for validator non-zero exit; `OPENCODE_DRIVER_INVOKE_FAILED` (DEC-0124 DQ6) for subprocess invocation failure; no `OPENCODE_*` wrapper; stub reason-code reference in `docs/engineering/runbook.md` h2 `## OpenCode thin commands + validator bridge (US-0125)` â US-0126 owns full table
  - mock-ctx + mock-subprocess harness (DQ8): extend US-0124 `MockCtx` with `mockSubprocess` field OR add `tests/us0125/mock_subprocess.ts`; scripted `nextExitCode`/`nextStderr`/`nextThrow`; runner = Node (consistent with US-0124 DQ3); no live OpenCode runtime probe in CI (AC-10)
  - contract tests (AC-8): `tests/us0125_contract_test.py` â 11 markers (see architecture AC-8 table); mirror to `template/tests/us0125_contract_test.py` byte-identical
  - runbook stub (T-008): `## OpenCode thin commands + validator bridge (US-0125)` h2 one-liner per code in `docs/engineering/runbook.md` + byte-identical `template/docs/engineering/runbook.md` mirror; US-0126 owns full text
  - manifest rows (T-007): `template/.opencode/commands/**` under `[opencode_install_include_paths]` (active + template byte-identical)
- next_phase: `/plan-verify` (fresh qa per orchestrator brief) for S0125 / US-0125
- sprint_artifacts: sprints/S0125/ (sprint.md, tasks.md, progress.md, uat.json, uat.md, t-anch-verification.md placeholder)
- timestamp: 2026-08-24T20:45:00Z
- role: tech-lead
- model_id: glm-5.2-high (CROSS_MODEL_REVIEW=1 â required)
- runtime_proof_id: rp-auto-20260824-02-sprint-plan-tech-lead-20260824T204500Z-US-0125
- proof_hash: 2FF3A63387C7337D5EC02802253D251CC2636831A6369B7A121F6135AC51E234

### Isolation evidence (US-0048 / DEC-0029 / US-0104 v2)

- `phase_id=sprint-plan`
- `role=tech-lead`
- `fresh_context_marker=tl-US0125-sprint-plan-20260824T204500Z-fresh`
- `timestamp=2026-08-24T20:45:00Z`
- `model_id=glm-5.2-high` (CROSS_MODEL_REVIEW=1 â required)
- `evidence_ref=sprints/S0125/sprint.md, sprints/S0125/tasks.md, sprints/S0125/progress.md, sprints/S0125/uat.json, sprints/S0125/uat.md, sprints/S0125/t-anch-verification.md, docs/engineering/state.md (sprint-plan checkpoint append-bottom), docs/engineering/architecture.md # US-0125, decisions/DEC-0125.md, handoffs/resume_brief.md`

### Strict runtime proof (US-0056 / DEC-0038)

- `orchestrator_run_id=auto-20260824-02`
- `runtime_proof_id=rp-auto-20260824-02-sprint-plan-tech-lead-20260824T204500Z-US-0125`
- `phase_id=sprint-plan`, `role=tech-lead`, `story_id=US-0125`, `sprint_id=S0125`
- `proof_issued_at=2026-08-24T20:45:00Z`
- `proof_ttl_seconds=3600`, `proof_ttl=2026-08-24T21:45:00Z`
- `proof_hash=2FF3A63387C7337D5EC02802253D251CC2636831A6369B7A121F6135AC51E234`
- Canonical payload: `{"delivery_mode":"ultra_lean","macro_phase":"plan","model_id":"glm-5.2-high","orchestrator_run_id":"auto-20260824-02","phase_id":"sprint-plan","proof_issued_at":"2026-08-24T20:45:00Z","proof_ttl_seconds":3600,"role":"tech-lead","runtime_proof_id":"rp-auto-20260824-02-sprint-plan-tech-lead-20260824T204500Z-US-0125","sprint_id":"S0125","story_id":"US-0125"}`

---
## Sprint-plan handoff â **US-0124** / **S0124** â `/plan-verify` next (fresh qa)

- sprint_id: S0124
- story_id: US-0124
- dec_id: DEC-0124 (Accepted, decisions/DEC-0124.md)
- research_anchor: R-0109 (DQ1..DQ8 LOCKED for US-0124; US-0121 Q1..Q12 + US-0122 DQ1..DQ8 + US-0123 DQ1..DQ10 locks preserved)
- orchestrator_run_id: auto-20260824-02
- fresh_context_marker: tl-US0124-sprint-plan-20260824T190000Z-fresh
- sprint_plan_verdict: PASS
- sprint_status: PLANNED (backlog OPEN per US-0045 â not mutated)
- task_count: 10 (T-anch + T-001..T-009; within SPRINT_MAX_TASKS=12)
- ac_surjective_map: AC-1->T-001,T-005(markers 1,7),T-006; AC-2->T-001,T-005(marker 1); AC-3->T-001,T-002,T-005(markers 1,2); AC-4->T-002,T-005(marker 2); AC-5->T-002,T-005(marker 2 + marker 8); AC-6->T-004,T-005(marker 8); AC-7->T-004,T-005(marker 8); AC-8->T-003,T-005(markers 3,4,5); AC-9->T-anch(baseline),T-005(markers 6,7); AC-10->T-002,T-005(all 9 markers),T-007(parity); AC-11->T-005(marker 9)
- task_order: T-anch -> T-001 (plugin file) -> T-002 (mock-ctx harness) -> T-004 (additive argv on auto_outer_driver.py) -> {T-006, T-007 parallel (manifest + README/parity)} -> T-003 (runbook stub h2) -> T-008 (runbook cross-link) -> T-005 (contract tests last) -> T-009 (validator decision) -> integration verification
- compose_guards (non-negotiable): DO NOT amend US-0069/DEC-0051 (phaseârole matrix), US-0092/DEC-0078 (outer driver + stop reasons + `--invoke-cmd`; Python remains SOT), US-0095/DEC-0080 (do NOT port Cursor Task-loop; no `.cursor/commands/auto.md` clone per AC-9), US-0023/US-0048/BUG-0006 (spawn-only isolation; `ctx.session.create` + `parentID` + `sessionID !== parentID`), US-0005 (hook-equivalent enforcement moves into plugin `ctx.tool.hook` + agent permissions; do not port Cursor hook JSON), US-0122/DEC-0122 (`template/.opencode/agents/auto.md` unchanged â agent = prompt + permission allow-list; plugin = enforcement per DQ8), US-0121/DEC-0120 (host default cursor-only; plugin lives in reserved `template/.opencode/plugins/` slot), US-0125 (thin commands are Layer 3 dispatch only; plugin must not own command bodies), US-0102/DEC-0087 (no vendor slugs in `template/` â plugin source has no vendor model slugs)
- critic_carry_ins (3 non-blocking â closed in architecture phase, routed to task notes, not silently dropped):
  - `ik_us0124_dq6_driver_fail_code_conflation` -> T-004 note: distinct `OPENCODE_DRIVER_INVOKE_FAILED` (driver subprocess failure: non-zero exit, malformed JSON, timeout) vs `OPENCODE_HEADLESS_UNSUPPORTED` (missing `opencode run` CLI surface only). The two codes never overlap.
  - `ik_us0124_dq6_argv_extension_gap` -> T-004 note: additive argv extension on `scripts/auto_outer_driver.py`; existing behavior byte-identical when new flags absent (no regression to US-0092 / DEC-0078).
  - `ik_us0124_research_scope_yagni` -> closed informational; US-0124 ships minimum plugin + harness + stub table; US-0125/US-0126 own command-body and full-runbook surfaces.
- architecture_pointers: docs/engineering/architecture.md # US-0124 (approach A1, 9-marker table, plugin entry-point DQ1, spawn API DQ2, mock-ctx harness DQ3, reason-code namespace DQ4, three-case detection matrix DQ5, subprocess stop-matrix DQ6, headless CLI DQ7, agent vs plugin boundary DQ8, non-goals)
- dec_pointers: decisions/DEC-0124.md (Â§1 plugin entry point, Â§2 spawn API, Â§3 mock-ctx harness, Â§4 reason-code namespace, Â§5 three-case detection matrix, Â§6 subprocess stop-matrix, Â§7 headless CLI, Â§8 agent vs plugin boundary, Â§9 contract tests, Â§10 non-goals)
- first_execute_task: T-anch (NO-OP / verification) â verify # US-0124 H1 anchor + DEC-0124 Accepted + compose guards 9/9 + 9-marker list locked + plugin/spawn/argv/boundary contracts + absent surfaces
- key_locked_artifacts:
  - plugin entry point (DQ1): `template/.opencode/plugins/orchestrator.ts` â single TypeScript file, default export `Plugin.define({ id: "its-magic.orchestrator", setup })` from `@opencode-ai/plugin`; auto-discovered via `.opencode/plugins/` scan; no `plugins[]` entry in `opencode.json` required (US-0121 ships no `opencode.json` in template); plugin id `its-magic.orchestrator` is the disable/enable selector (`--pure` / `-its-magic.orchestrator`)
  - spawn API (DQ2): `ctx.session.create({ parentID: <orchestrator-session-id>, agent: <role>, prompt: <phase-prompt> })` â assert `sessionID !== parentID` (DQ5 hard post-condition) â `ctx.session.wait(sessionID)` â read result â persist isolation evidence (`parentID`, `sessionID`, `role`, `phase_id`, `timestamp`, `fresh_context_marker`); if `ctx.session.create` unavailable â fail closed `OPENCODE_PLUGIN_SPAWN_UNSUPPORTED`
  - mock-ctx harness (DQ3): `tests/us0124/mock_ctx.ts` â `MockCtx` implements v2 plugin context subset (`session.create`/`prompt`/`wait`, `tool.hook` no-op recorder, `options` readonly); `session.create` accepts scripted `nextSessionID` + `throwOnCreate` + `returnNull` + `identicalID` flags; default fresh uuid â  `parentID`; runner = Node (CI has it via `tests/run-tests.ps1 Ensure-NodeOnPath`); no live OpenCode runtime probe in CI (AC-10)
  - reason-code namespace (DQ4): four new `OPENCODE_*` codes (`OPENCODE_PLUGIN_SPAWN_UNSUPPORTED`, `OPENCODE_SUBTASK_IGNORED`, `OPENCODE_HEADLESS_UNSUPPORTED`, `OPENCODE_DRIVER_INVOKE_FAILED`) + three reused codes (`AUTO_ORCHESTRATOR_PHASE_EXECUTION`, `PHASE_ROLE_MISMATCH`, `NATIVE_CHAIN_UNAVAILABLE`); `OPENCODE_DRIVER_INVOKE_FAILED` (driver subprocess failure) distinct from `OPENCODE_HEADLESS_UNSUPPORTED` (missing `opencode run` CLI surface only)
  - three-case detection matrix (DQ5): null return â `OPENCODE_SUBTASK_IGNORED`; throw (generic) â `OPENCODE_SUBTASK_IGNORED`; throw (missing-primitive) â `OPENCODE_PLUGIN_SPAWN_UNSUPPORTED`; identical-id return â `OPENCODE_SUBTASK_IGNORED`; `sessionID !== parentID` is hard post-condition
  - subprocess stop-matrix (DQ6): `scripts/auto_outer_driver.py` is single TSâPython integration; additive argv `--phase/--role/--story/--sprint/--orchestrator-run-id/--stop-reason` â JSON response `{ action, next_phase, stop_reason, ... }`; legacy behavior byte-identical when flags absent; forbidden: TS reimpl of US-0092 state machine; subprocess failure (non-zero exit, malformed JSON, timeout) â `OPENCODE_DRIVER_INVOKE_FAILED` (NOT `OPENCODE_HEADLESS_UNSUPPORTED`)
  - headless CLI (DQ7): `opencode run --agent auto --format json --auto "<phase-prompt>"` (primary) + optional `opencode serve` + `--attach`; fail-closed `OPENCODE_HEADLESS_UNSUPPORTED` when `opencode run` not on PATH
  - agent vs plugin boundary (DQ8): `template/.opencode/agents/auto.md` (US-0122 â agent = prompt + permission allow-list, unchanged) + `template/.opencode/plugins/orchestrator.ts` (US-0124 â plugin = enforcement); independent surfaces, defense in depth; plugin MUST NOT copy agent's permission array; `ctx.tool.hook("execute.before")` enforces `AUTO_ORCHESTRATOR_PHASE_EXECUTION` (path-based, not permission-array-based)
  - contract tests (AC-10): `tests/us0124_contract_test.py` â 9 markers (see architecture AC-10 table); mirror to `template/tests/us0124_contract_test.py` byte-identical
  - runbook stub (DQ4): `## OpenCode orchestrator plugin reason codes (US-0124)` h2 one-liner per code in `docs/engineering/runbook.md` + byte-identical `template/docs/engineering/runbook.md` mirror; US-0126 owns full text
  - manifest rows (T-006): `template/.opencode/plugins/orchestrator.ts` under `[opencode_install_include_paths]` (active + template byte-identical)
- next_phase: `/plan-verify` (fresh qa per orchestrator brief) for S0124 / US-0124
- sprint_artifacts: sprints/S0124/ (sprint.md, tasks.md, progress.md, uat.json, uat.md, t-anch-verification.md placeholder)
- timestamp: 2026-08-24T19:00:00Z
- role: tech-lead
- model_id: glm-5.2-high (CROSS_MODEL_REVIEW=1 â required)
- runtime_proof_id: rp-auto-20260824-02-sprint-plan-tech-lead-20260824T190000Z-US-0124
- proof_hash: 377679F3F6292DCC9DBBDA0D971867529FAE67CD41C20FA9B8A5BE49121C73DE

### Isolation evidence (US-0048 / DEC-0029 / US-0104 v2)

- `phase_id=sprint-plan`
- `role=tech-lead`
- `fresh_context_marker=tl-US0124-sprint-plan-20260824T190000Z-fresh`
- `timestamp=2026-08-24T19:00:00Z`
- `model_id=glm-5.2-high` (CROSS_MODEL_REVIEW=1 â required)
- `evidence_ref=sprints/S0124/sprint.md, sprints/S0124/tasks.md, sprints/S0124/progress.md, sprints/S0124/uat.json, sprints/S0124/uat.md, sprints/S0124/t-anch-verification.md, docs/engineering/state.md (sprint-plan checkpoint append-bottom), docs/engineering/architecture.md # US-0124, decisions/DEC-0124.md, handoffs/resume_brief.md`

### Strict runtime proof (US-0056 / DEC-0038)

- `orchestrator_run_id=auto-20260824-02`
- `runtime_proof_id=rp-auto-20260824-02-sprint-plan-tech-lead-20260824T190000Z-US-0124`
- `phase_id=sprint-plan`, `role=tech-lead`, `story_id=US-0124`, `sprint_id=S0124`
- `proof_issued_at=2026-08-24T19:00:00Z`
- `proof_ttl_seconds=3600`, `proof_ttl=2026-08-24T20:00:00Z`
- `proof_hash=377679F3F6292DCC9DBBDA0D971867529FAE67CD41C20FA9B8A5BE49121C73DE`
- Canonical payload: `{"delivery_mode":"ultra_lean","macro_phase":"plan","model_id":"glm-5.2-high","orchestrator_run_id":"auto-20260824-02","phase_id":"sprint-plan","proof_issued_at":"2026-08-24T19:00:00Z","proof_ttl_seconds":3600,"role":"tech-lead","runtime_proof_id":"rp-auto-20260824-02-sprint-plan-tech-lead-20260824T190000Z-US-0124","sprint_id":"S0124","story_id":"US-0124"}`

---

## Architecture handoff pointer â **US-0124** â `/sprint-plan` next (fresh tech-lead)

- story_id: US-0124 (OPEN â do not mark DONE)
- orchestrator_run_id: auto-20260824-02
- phase_id: architecture, role: tech-lead, model_id: glm-5.2-high (CROSS_MODEL_REVIEW=1)
- verdict: PASS (companion DEC-0124 Accepted; approach A1 locked; DQ1..DQ8 LOCKED; 7/7 R ACCEPTED; 3 research critic NBs closed; 3 spec critic NBs closed; compose guards 9/9 UNCHANGED; 10 tasks T-anch + T-001..T-009 within SPRINT_MAX_TASKS=12; 11/11 AC surjective; 9-marker contract-test list locked)
- architecture_anchor: docs/engineering/architecture.md # US-0124 (L1816 â H1 anchor AFTER # US-0123 BEFORE # US-0089 per DEC-0073 Â§11)
- companion_dec: decisions/DEC-0124.md (Accepted)
- research_anchor: docs/engineering/research.md ## R-0109 ### Deepened findings â US-0124 (DQ1..DQ8 LOCKED)
- next_scheduled_phase: /sprint-plan (role=tech-lead; fresh subagent per BUG-0006)
- dev_handoff_note: tl_to_dev.md will be authored at /sprint-plan (after task refinement); dev handoff is NOT authored in /architecture. This pointer is a placeholder so dev knows the architecture contract is locked.
- stop_condition: STOP after architecture; orchestrator spawns /sprint-plan in fresh tech-lead subagent. Do NOT spawn /sprint-plan from this subagent. Do NOT mark US-0124 DONE.

---

## Sprint-plan handoff â **US-0123** / **S0123** â `/plan-verify` next (fresh qa)

- sprint_id: S0123
- story_id: US-0123
- dec_id: DEC-0123 (Accepted, decisions/DEC-0123.md)
- research_anchor: R-0109 (DQ1..DQ10 LOCKED for US-0123; US-0121 Q1..Q12 + US-0122 DQ1..DQ8 locks preserved)
- orchestrator_run_id: auto-20260824-01
- fresh_context_marker: tl-US0123-sprint-plan-20260824T163000Z-fresh
- sprint_plan_verdict: PASS
- sprint_status: PLANNED (backlog OPEN per US-0045 â not mutated)
- task_count: 10 (T-anch + T-001..T-009; within SPRINT_MAX_TASKS=12)
- ac_surjective_map: AC-1->T-001,T-002,T-003,T-004,T-009; AC-2->T-001; AC-3->T-004,T-005(markers 1,2,3); AC-4->T-002,T-005(markers 5,6); AC-5->T-002,T-003,T-006,T-005(marker 7); AC-6->T-anch(baseline),T-005(marker 8); AC-7->T-001,T-005(marker 4); AC-8->T-005(all 8 markers),T-008(parity); AC-9->T-001,T-anch(baseline),T-005(marker 4); AC-10->T-007
- task_order: T-anch -> T-001 (example catalog) -> T-002 (materializer) -> T-003 (installer hook) -> {T-004, T-006, T-009 parallel (validator + gitignore + manifest)} -> T-008 (README + parity) -> T-007 (runbook one-liner) -> T-005 (contract tests last) -> integration verification
- compose_guards (non-negotiable): DO NOT amend US-0101/DEC-0086 (Cursor tierâalias runtime + `.cursor/model-catalog.local.json`), US-0102/DEC-0087 (Cursor direct-slug + role catalog; volatile-ID rule extended to `template/.opencode/`), US-0003 (agents gain `model:` on OpenCode at install time, not in template), US-0122/DEC-0122 (template agents unchanged â `model:` omitted; materializer writes to installed agents only), US-0121 (`.opencode/` pack path + `.gitignore` Q10 â `*.local.json` reused), US-0080 (`TOKEN_PROFILE` orthogonal â slug routing â  token-cost profile)
- critic_carry_ins (3 non-blocking â route to task notes, do not silently drop):
  - `ik_us0123_placeholder_slug_copy_paste_boundary` -> T-002 note: materializer MUST treat `<your-*-slug>` angle-bracket placeholder strings as unknown slugs (emit `OPENCODE_MODEL_SLUG_UNKNOWN`, fail-closed); operators who copy-paste the example catalog without filling in real slugs must NOT silently get placeholder `model:` values injected into installed agents; placeholder detection: slug matches `^<.*>$` or contains `<your-` substring -> unknown; T-005 marker 5 asserts the placeholder case
  - `ik_us0123_validator_extension_coupling_fallback` -> T-004 note: document when to extend `model_tier_validate.py` vs new script; default = extend in place (DQ9 lock); fall back to new `scripts/opencode_model_catalog_validate.py` ONLY if schema divergence forces a separate validator class (trigger: `validate_opencode_catalog` cannot reuse >50% of existing `validate_cursor_catalog` helpers, OR scope-tag plumbing requires touching >3 unrelated `--scope` modes); if fallback triggers, raise DEC-0124-class follow-up; do NOT silently split
  - `ik_us0123_sprint_tanch_ceremony_overlap` -> T-anch note: T-anch is NO-OP / verification only â NO mutation to `docs/engineering/architecture.md` or `decisions/DEC-0123.md` in /execute; T-anch records baseline observations only (mirrors US-0122 T-anch ceremony); architecture heading order (# US-0122 -> # US-0123 -> # US-0089) and DEC-0123 Accepted state are read-only verified, not mutated
- architecture_pointers: docs/engineering/architecture.md # US-0123 (approach A1, 8-marker table, SOT=local-only `.opencode/model-catalog.local.json`, template agents omit `model:`, single `OPENCODE_MODEL_SLUG_UNKNOWN` fail-closed, per-role schema, additive integration, always `api` mode, validator extension DQ9, runbook stub DQ10, non-goals)
- dec_pointers: decisions/DEC-0123.md (Â§1 SOT, Â§2 template agents omit model, Â§3 single fail-closed code, Â§4 catalog path, Â§5 per-role schema, Â§6 example placeholders, Â§7 additive integration + materializer + installer hook contract, Â§8 always api mode, Â§9 validator extension, Â§10 runbook stub, Â§11 contract tests, Â§12 non-goals)
- first_execute_task: T-anch (NO-OP / verification) â verify # US-0123 H1 anchor + DEC-0123 Accepted + compose guards 6/6 + 8-marker list locked + materializer/installer hook contract + absent surfaces
- key_locked_artifacts:
  - SOT: `.opencode/model-catalog.local.json` (gitignored, operator-filled) + `template/.opencode/model-catalog.local.example.json` (committed, placeholders only); forbidden surfaces for real OpenCode slugs: `template/.opencode/agents/*.md` `model:` frontmatter, `template/.opencode/opencode.json{,c}`, `.cursor/model-catalog.local.json`, `.cursor/scratchpad.local.md` `MODEL_*` keys
  - catalog schema (DQ5 per-role, 8 role keys): `{schema_version, providers, roles}` where `roles` maps each of 8 role names to `provider/slug` string; providers block covers DeepSeek, Moonshot, Z.AI, Anthropic, OpenAI, DashScope/Qwen (`@ai-sdk/openai-compatible` + `options.baseURL`); US-0069 phase->role matrix bridges phase->role on orchestrator (unchanged); catalog bridges role->provider/slug on OpenCode (new)
  - example catalog placeholders (DQ6): role values are `<your-deepseek-slug>`, `<your-kimi-slug>`, `<your-glm-slug>`, `<your-claude-slug>`, `<your-gpt-slug>` â NO real model-id slugs in `template/`; â¥2 roles have different providers (AC-7); D3 grep scope excludes `*.example.json` / `*.local.json`
  - materializer contract (DQ7): `scripts/opencode_model_catalog_apply.py` â input `.opencode/model-catalog.local.json` + installed `.opencode/agents/<role>.md`; absent catalog = no-op (no fail-closed); present + unknown/empty/placeholder slug = `OPENCODE_MODEL_SLUG_UNKNOWN` fail-closed; malformed JSON = `MODEL_CATALOG_INVALID` scope-tagged `opencode-catalog`; injects `model: <provider/slug>` into installed agent YAML frontmatter only (insert if absent; overwrite if present); NEVER writes to `template/`; NEVER reads/writes `.cursor/model-catalog.local.json`; NEVER reads auth credentials
  - installer hook (T-003 triple-installer parity): trigger = `--host opencode|both` AND `.opencode/model-catalog.local.json` exists at install target; absent = skip (no-op; no fail-closed); fail = surface reason code + exit non-zero; installer does NOT generate the catalog for the operator
  - fail-closed reason-code family (DQ3): NEW `OPENCODE_MODEL_SLUG_UNKNOWN` (single namespaced code); REUSED `MODEL_CATALOG_INVALID` (scope-tagged `opencode-catalog`); existing Cursor-side codes remain Cursor-side only
  - validator extension (DQ9): `scripts/model_tier_validate.py --scope opencode-catalog` â `check_template_opencode_agents` (D3 grep scoped, excludes `*.example.json`/`*.local.json`), `validate_opencode_catalog`, `check_opencode_example_catalog` (â¥2 roles different providers); reuse `check_forbidden_slugs_in_file` helper; extend-not-duplicate (new script only if too coupled â see T-004 critic NB)
  - contract tests (AC-8): `tests/us0123_contract_test.py` â 8 markers (see architecture AC-8 table); mirror to `template/tests/us0123_contract_test.py` byte-identical
  - runbook stub (DQ10): `## OpenCode model slug routing (US-0123)` h2 one-liner in `docs/engineering/runbook.md`; US-0126 owns full text
  - gitignore (T-006): `.opencode/.gitignore` (US-0121 Q10) `*.local.json` glob covers `model-catalog.local.json`; add explicit entry only if glob is narrower
  - manifest rows (T-009): `template/.opencode/model-catalog.local.example.json` + `scripts/opencode_model_catalog_apply.py` under `[opencode_install_include_paths]` (active + template byte-identical)
- next_phase: `/plan-verify` (fresh qa per orchestrator brief) for S0123 / US-0123
- sprint_artifacts: sprints/S0123/ (sprint.md, tasks.md, progress.md, summary.md, uat.json, uat.md)
- timestamp: 2026-08-24T16:30:00Z
- role: tech-lead
- model_id: glm-5.2-high (CROSS_MODEL_REVIEW=1 â required)
- runtime_proof_id: rp-auto-20260824-01-sprint-plan-tech-lead-20260824T163000Z-US-0123
- proof_hash: CD814AD66F07A9F9A5C649EF6B0283A4A92179D7502238514B211863C401FEA6

### Isolation evidence (US-0048 / DEC-0029 / US-0104 v2)

- `phase_id=sprint-plan`
- `role=tech-lead`
- `fresh_context_marker=tl-US0123-sprint-plan-20260824T163000Z-fresh`
- `timestamp=2026-08-24T16:30:00Z`
- `model_id=glm-5.2-high` (CROSS_MODEL_REVIEW=1 â required)
- `evidence_ref=sprints/S0123/sprint.md, sprints/S0123/tasks.md, sprints/S0123/progress.md, sprints/S0123/summary.md, sprints/S0123/uat.json, sprints/S0123/uat.md, docs/engineering/state.md (sprint-plan checkpoint append-bottom), docs/engineering/architecture.md # US-0123, decisions/DEC-0123.md, handoffs/resume_brief.md`

### Strict runtime proof (US-0056 / DEC-0038)

- `orchestrator_run_id=auto-20260824-01`
- `runtime_proof_id=rp-auto-20260824-01-sprint-plan-tech-lead-20260824T163000Z-US-0123`
- `phase_id=sprint-plan`, `role=tech-lead`, `story_id=US-0123`, `sprint_id=S0123`
- `proof_issued_at=2026-08-24T16:30:00Z`
- `proof_ttl_seconds=3600`, `proof_ttl=2026-08-24T17:30:00Z`
- `proof_hash=CD814AD66F07A9F9A5C649EF6B0283A4A92179D7502238514B211863C401FEA6`
- Canonical payload: `{"delivery_mode":"ultra_lean","macro_phase":"plan","model_id":"glm-5.2-high","orchestrator_run_id":"auto-20260824-01","phase_id":"sprint-plan","proof_issued_at":"2026-08-24T16:30:00Z","proof_ttl_seconds":3600,"role":"tech-lead","runtime_proof_id":"rp-auto-20260824-01-sprint-plan-tech-lead-20260824T163000Z-US-0123","sprint_id":"S0123","story_id":"US-0123"}`

---

## Sprint-plan handoff â **US-0122** / **S0122** â `/plan-verify` next (fresh qa)

- sprint_id: S0122
- story_id: US-0122
- dec_id: DEC-0122 (Accepted, decisions/DEC-0122.md)
- research_anchor: R-0109 (DQ1..DQ8 LOCKED for US-0122; US-0121 Q1..Q12 locks preserved)
- orchestrator_run_id: auto-20260824-01
- fresh_context_marker: tl-US0122-sprint-plan-20260824T120000Z-fresh
- sprint_plan_verdict: PASS
- sprint_status: PLANNED (backlog OPEN per US-0045 â not mutated)
- task_count: 10 (T-anch + T-001..T-009; within SPRINT_MAX_TASKS=12)
- ac_surjective_map: AC-1->T-001,T-007,T-009; AC-2->T-002,T-003,T-005; AC-3->T-002,T-006(marker 3); AC-4->T-001,T-006(marker 7); AC-5->T-004,T-006(markers 1,5,8); AC-6->T-008; AC-7->T-001,T-006(marker 6),T-009; AC-8->T-006(all 8 markers); AC-9->T-anch(baseline),T-006(marker 8),T-009(parity); AC-10->T-005(locked matrix),T-006(marker 3)
- task_order: T-anch -> T-001 (8 agent files) -> {T-002, T-003, T-004, T-005 parallel (per-agent permission matrices)} -> T-007 (manifest rows) -> T-009 (README + parity) -> T-008 (runbook one-liner) -> T-006 (contract tests last) -> integration verification
- compose_guards (non-negotiable): DO NOT amend US-0003 (role set), US-0023/BUG-0006 (spawn-only isolation), US-0121 (pack path consumed; no repo-root opencode.json added), US-0102/DEC-0087 (volatile-ID rule â no vendor slugs in template/.opencode/agents/*.md), US-0002/US-0004 (do-not-port Cursor rules/skills â markdown agents, no .mdc clone)
- critic_carry_ins (3 non-blocking â route to task notes, do not silently drop):
  - `ik_us0122_dev_template_allow_mutates_agents` -> T-005 note: `dev` `template/**` allow could mutate `.opencode/agents/*.md`; mitigation via T-006 marker 1 + T-009 parity extension (byte-identical assertion); no narrow deny glob (would fragment locked matrix)
  - `ik_us0122_compose_guards_marker_surjection` -> T-006 note: do NOT add 9th `test_us0122_compose_guards_unchanged` marker; AC-9 surjection via T-anch baseline + DEC-0122 Â§compose surface + marker 8 (`test_us0122_role_id_parity`); 8-marker budget locked
  - `ik_us0122_stale_compose_count_6_vs_5` -> T-anch note: architecture overview 6/6 wording is stale drift; T-anch verifies 5/5; non-blocking; reconcile at /plan-verify or future doc-parity slice
- architecture_pointers: docs/engineering/architecture.md # US-0122 (approach A1, 8-marker table, locked Layer-1 permission matrix, static success-test-(c) harness, Layer-2 short prompts + clone guard, manual invoke one-liner, no vendor slugs, non-goals)
- dec_pointers: decisions/DEC-0122.md (Â§1 markdown agents, Â§2 locked eight-agent matrix, Â§3 static success-test-(c) harness, Â§4 Layer-2 short prompts + clone guard, Â§5 manual invoke one-liner, Â§6 no vendor slugs, Â§7 contract tests + parity, Â§8 non-goals)
- first_execute_task: T-anch (NO-OP / verification) â verify # US-0122 H1 anchor + DEC-0122 Accepted + compose guards 5/5 + 8-marker list locked + locked matrix in DEC-0122 Â§2 + absent surfaces
- key_locked_artifacts:
  - agent file layout: `template/.opencode/agents/{po,tech-lead,dev,qa,release,curator,security,auto}.md` (8 markdown files; YAML frontmatter: description, mode, permission, short prompt body)
  - locked Layer-1 permission matrix (DEC-0122 Â§2): `auto` (primary; edit deny; task object 7-role allow + `*` deny last); `po` (subagent; edit object docs/product/** + handoffs/po_to_tl.md allow + `**` deny last; bash deny; task deny); `tech-lead` (subagent; edit object architecture/decisions/state/research + decisions/DEC-*.md + handoffs/tl_to_dev.md + sprints/Sxxxx/sprint.md + sprints/Sxxxx/tasks.md + `**` deny last; bash deny; task deny); `dev` (subagent; edit object scripts/** + its_magic/** + template/** + tests/** + sprints/Sxxxx/progress.md + sprints/Sxxxx/qa-findings.md + handoffs/dev_to_qa.md + `**` deny last; bash ask; task deny); `qa` (subagent; edit object qa-findings + plan-verify + verify-work-findings + uat.md/json + qa handoffs + `**` deny last; bash ask; task deny); `release` (subagent; edit object release_queue/notes/releases + release/verify handoffs + CHANGELOG + `**` deny last; bash ask; task deny); `curator` (subagent; edit object state + state-archive + decisions.md + research.md + resume_brief/portfolio_state/continuation_hygiene/archive + `**` deny last; bash deny; task deny); `security` (subagent; edit deny; bash ask; task deny)
  - ordering contract (DQ3): broad `**` -> `deny` MUST be last key in every object-form `permission.edit`; `*` -> `deny` MUST be last key in `auto` `permission.task`; tests assert key order, not just set membership
  - Task subagent ID contract (DQ4): `auto` `permission.task` 7 role allow + `*` deny last denies all non-kit subagents including OpenCode built-ins + future US-0124 plugin-internal helpers; US-0124 may add helpers as `allow` keys above `*` deny, never remove `*` deny last
  - static success-test-(c) harness (DQ7): parse po.md frontmatter -> assert edit is object -> assert docs/product/** + handoffs/po_to_tl.md allow -> assert `**` deny last -> assert no production allow (scripts/**, its_magic/**, **/*.py, installer.*, template/scripts/**, template/its_magic/**); runtime permission-check deferred to US-0124
  - Layer-2 short prompts + clone guard (AC-4): each agent file â¤ 2 KiB total; no forbidden clone markers (/auto, /intake, /discovery, /research, /architecture, /sprint-plan, /execute, /qa, /release, /closure, /refresh-context command-body prose; .cursor/commands/ path literals; --- MDC frontmatter delimiters)
  - no vendor slugs (AC-7): template/.opencode/agents/*.md frontmatter MUST NOT contain `model:` with real vendor slug; test greps deepseek|moonshot|kimi|glm|claude|gpt|sonnet|opus|haiku|o1|o3|sk- -> zero hits
  - manifest rows: `template/.opencode/agents/**` source rows under `[opencode_install_include_paths]` (active + template byte-identical); existing rows unchanged
  - parity extension: `--scope=opencode-adapter` `OPENCODE_ADAPTER_PAIRS` extended for agent inventory (8 markdown files byte-identical active â template; no active kit mirror â DQ8 YAGNI)
  - runbook one-liner: `## OpenCode role agents and permissions (US-0122)` h2 in docs/engineering/runbook.md (full runbook US-0126)
- next_phase: `/plan-verify` (fresh qa per orchestrator brief) for S0122 / US-0122
- sprint_artifacts: sprints/S0122/ (sprint.md, tasks.md, progress.md, summary.md, uat.json, uat.md)
- timestamp: 2026-08-24T12:00:00Z
- role: tech-lead
- model_id: glm-5.2-high (CROSS_MODEL_REVIEW=1 â required)
- runtime_proof_id: rp-auto-20260824-01-sprint-plan-tech-lead-20260824T120000Z-US-0122
- proof_hash: 49D4165515F54421094D13675422D8A6CDBDDCBE9A82C6C5A3F3E5248FD1857D

### Isolation evidence (US-0048 / DEC-0029 / US-0104 v2)

- `phase_id=sprint-plan`
- `role=tech-lead`
- `fresh_context_marker=tl-US0122-sprint-plan-20260824T120000Z-fresh`
- `timestamp=2026-08-24T12:00:00Z`
- `model_id=glm-5.2-high` (CROSS_MODEL_REVIEW=1 â required)
- `evidence_ref=sprints/S0122/sprint.md, sprints/S0122/tasks.md, sprints/S0122/progress.md, sprints/S0122/summary.md, sprints/S0122/uat.json, sprints/S0122/uat.md, docs/engineering/state.md (sprint-plan checkpoint append-bottom), docs/engineering/architecture.md # US-0122, decisions/DEC-0122.md, handoffs/resume_brief.md`

### Strict runtime proof (US-0056 / DEC-0038)

- `orchestrator_run_id=auto-20260824-01`
- `runtime_proof_id=rp-auto-20260824-01-sprint-plan-tech-lead-20260824T120000Z-US-0122`
- `phase_id=sprint-plan`, `role=tech-lead`, `story_id=US-0122`, `sprint_id=S0122`
- `proof_issued_at=2026-08-24T12:00:00Z`
- `proof_ttl_seconds=3600`, `proof_ttl=2026-08-24T13:00:00Z`
- `proof_hash=49D4165515F54421094D13675422D8A6CDBDDCBE9A82C6C5A3F3E5248FD1857D`
- Canonical payload: `{"delivery_mode":"ultra_lean","macro_phase":"plan","model_id":"glm-5.2-high","orchestrator_run_id":"auto-20260824-01","phase_id":"sprint-plan","proof_issued_at":"2026-08-24T12:00:00Z","proof_ttl_seconds":3600,"role":"tech-lead","runtime_proof_id":"rp-auto-20260824-01-sprint-plan-tech-lead-20260824T120000Z-US-0122","sprint_id":"S0122","story_id":"US-0122"}`

---

## Sprint-plan handoff - **US-0121** / **S0121** - `/execute` next (fresh dev)

- sprint_id: S0121
- story_id: US-0121
- dec_id: DEC-0120 (Accepted, decisions/DEC-0120.md)
- research_anchor: R-0109 (Q6-Q12 LOCKED for US-0121 execute; Q1-Q5 LOCKED for architecture only, deferred to US-0122..US-0126)
- orchestrator_run_id: auto-20260823-01
- fresh_context_marker: tl-US0121-sprint-plan-20260823T112200Z-fresh
- sprint_plan_verdict: PASS
- sprint_status: PLANNED (backlog OPEN per US-0045 - not mutated)
- task_count: 10 (T-anch + T-001..T-009; within SPRINT_MAX_TASKS=12)
- ac_surjective_map: AC-1->T-001; AC-2->T-003,T-004,T-005,T-006; AC-3->T-004,T-005,T-006; AC-4->T-007(markers 2-4); AC-5->T-002,T-004,T-005,T-006,T-007(markers 10,11,14); AC-6->T-008,T-007(marker 13); AC-7->T-007; AC-8->T-anch(baseline),all gated; AC-9->T-003(--help),T-009(runbook h2); AC-10->T-001,T-007(marker 12)
- task_order: T-anch -> {T-001, T-002, T-003 parallel} -> {T-004, T-005, T-006 parallel} -> T-008 -> T-009 -> T-007 (tests last) -> integration verification
- compose_guards (non-negotiable): DO NOT amend US-0008 (additive --host only), DEC-0045 (its_magic/ ownership), US-0102 (volatile-ID rule - no slugs), US-0001 (phase names as placeholders only), US-0018 (packaging delivery path)
- critic_carry_ins (3 non-blocking - route to task notes, do not silently drop):
  - `ik_us0121_missing_overwrite_host_gap` -> T-006 note: YAGNI - `missing` after `both` no-ops on `.opencode/` via predicate (copy-if-missing is host-scoped); no new diagnostic; overwrite US-0008 unchanged
  - `ik_us0121_parity_active_mirror_contradiction` -> T-008 note: parity pairs `template/.opencode` with consumed `.opencode/` (when host includes opencode); no kit-repo active mirror (Q9 YAGNI)
  - `ik_us0121_ac9_help_test_yagni` -> T-007 note: `--help` grep is marker 9 in locked 14-marker set; do not add 15th marker without dropping YAGNI elsewhere
- architecture_pointers: docs/engineering/architecture.md # US-0121 (approach A1, 14-marker table, host-scoped missing/upgrade/clean matrix, kernel-vs-host filter, mixed-section predicate)
- dec_pointers: decisions/DEC-0120.md (ÃÂ§1 host switch, ÃÂ§2 parallel manifest sections, ÃÂ§3 kernel-vs-host, ÃÂ§4 mixed-section predicate, ÃÂ§5 host-scoped missing/upgrade/clean, ÃÂ§6 pack layout, ÃÂ§7 gitignore, ÃÂ§8 cursor coexistence, ÃÂ§9 contract tests + parity, ÃÂ§10 non-goals)
- first_execute_task: T-anch (NO-OP / verification) - verify `# US-0121` H1 anchor + DEC-0120 Accepted + compose guards 5/5 + 14-marker list locked + absent surfaces
- key_locked_artifacts:
  - manifest sections: `[opencode_install_include_paths]` + `[opencode_clean_paths]` (active + template byte-identical)
  - host predicate: `host_gates_cursor_row(rel, host)` shared across PS/Bash/Python
  - diagnostics: `INSTALL_HOST_INVALID`, `OPENCODE_ORPHANED_BY_CLEAN_CURSOR`, `OPENCODE_STALE_BY_UPGRADE_CURSOR`, `CURSOR_ORPHANED_BY_CLEAN_OPENCODE`, `CURSOR_STALE_BY_UPGRADE_OPENCODE`
  - pack layout: `template/.opencode/{agents/.gitkeep, commands/.gitkeep, plugins/README.md, .gitignore, README.md}` (no repo-root opencode.json; no active mirror)
  - gitignore Q10 four groups: `.opencode/opencode.json{,c}`, `.env`/`.env.*`, `*.local.json{,c}`, `auth.json`
- next_phase: `/execute` (fresh dev) for S0121 / US-0121
- sprint_artifacts: sprints/S0121/ (sprint.md, tasks.md, progress.md, uat.json, uat.md, plan-verify.json)
- timestamp: 2026-08-23T11:22:00Z
- role: tech-lead
- model_id: glm-5.2-high (CROSS_MODEL_REVIEW=1 - required)
- runtime_proof_id: rp-auto-20260823-01-sprint-plan-tech-lead-20260823T112200Z-US-0121
- proof_hash: 2a7f31fca177451c935b9aedebb4781d57a7b13d8ef87a9e913fcaf10bec6336

### Isolation evidence (US-0048 / DEC-0029 / US-0104 v2)

- `phase_id=sprint-plan`
- `role=tech-lead`
- `fresh_context_marker=tl-US0121-sprint-plan-20260823T112200Z-fresh`
- `timestamp=2026-08-23T11:22:00Z`
- `model_id=glm-5.2-high` (CROSS_MODEL_REVIEW=1 - required)
- `evidence_ref=sprints/S0121/sprint.md, sprints/S0121/tasks.md, sprints/S0121/progress.md, sprints/S0121/uat.json, sprints/S0121/uat.md, sprints/S0121/plan-verify.json, docs/engineering/state.md, docs/engineering/architecture.md # US-0121, decisions/DEC-0120.md, handoffs/resume_brief.md`

### Strict runtime proof (US-0056 / DEC-0038)

- `orchestrator_run_id=auto-20260823-01`
- `runtime_proof_id=rp-auto-20260823-01-sprint-plan-tech-lead-20260823T112200Z-US-0121`
- `phase_id=sprint-plan`, `role=tech-lead`, `story_id=US-0121`, `sprint_id=S0121`
- `proof_issued_at=2026-08-23T11:22:00Z`
- `proof_ttl_seconds=3600`, `proof_ttl=2026-08-23T12:22:00Z`
- `proof_hash=2a7f31fca177451c935b9aedebb4781d57a7b13d8ef87a9e913fcaf10bec6336`
- Canonical payload: `{"delivery_mode":"ultra_lean","macro_phase":"plan","orchestrator_run_id":"auto-20260823-01","phase_id":"sprint-plan","proof_issued_at":"2026-08-23T11:22:00Z","proof_ttl_seconds":3600,"role":"tech-lead","runtime_proof_id":"rp-auto-20260823-01-sprint-plan-tech-lead-20260823T112200Z-US-0121","sprint_id":"S0121","story_id":"US-0121"}`

---

## Sprint-plan handoff â **US-0108** / **S0108** â `/plan-verify` next (fresh qa)

- sprint_id: S0108
- story_id: US-0108
- dec_id: DEC-0108 (locked, decisions/DEC-0108.md)
- research_anchor: R-0096 (Q1âQ10 CLOSED, status=delivered)
- orchestrator_run_id: auto-20260628-04
- fresh_context_marker: tl-US0108-sprint-plan-20260629T210000Z-fresh
- sprint_plan_verdict: PASS
- sprint_status: OPEN
- task_count: 11 (within SPRINT_MAX_TASKS=12)
- ac_surjective_map: AC-1âT-001; AC-2âT-002,T-003; AC-3âT-004,T-005; AC-4âT-006; AC-5âT-007; AC-6âT-008; AC-7âT-009,T-010; AC-8âT-011
- tranche_order: A keys+reason codes â B worktree lib â C selection+anti-slop â D merge+resource+execute â E tests+parity+runbook
- compose_guards (non-negotiable): DO NOT amend US-0047, US-0092, US-0103, US-0104, US-0107
- topology: parallel dev in isolated git worktrees; QA cross-review; deterministic winner selection; resource guard cap=6
- next_phase: `/plan-verify` (fresh qa) for S0108 / US-0108
- sprint_artifacts: sprints/S0108/ (sprint.md, tasks.md, progress.md, sprint.json, plan-verify.json)
- timestamp: 2026-06-29T21:32:00Z
- role: tech-lead
- backlog_drain_active: true
- backlog_drain_stories_remaining_budget: 3
- portfolio_open_stories: 4 (US-0108, US-0109, US-0111, US-0112)
- runtime_proof_id: rp-auto-20260628-04-sprint-plan-tech-lead-20260629T213200Z-US0108
- proof_hash: b3e7f1a2c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2

### Isolation evidence (US-0048 / DEC-0029)

- `phase_id=sprint-plan`
- `role=tech-lead`
- `fresh_context_marker=tl-US0108-sprint-plan-20260629T210000Z-fresh`
- `timestamp=2026-06-29T21:32:00Z`
- `evidence_ref=sprints/S0108/sprint.md,sprints/S0108/tasks.md,sprints/S0108/progress.md,sprints/S0108/sprint.json,sprints/S0108/plan-verify.json,docs/engineering/state.md,handoffs/tl_to_dev.md,handoffs/resume_brief.md`

### Strict runtime proof (US-0056 / DEC-0038)

- `orchestrator_run_id=auto-20260628-04`
- `runtime_proof_id=rp-auto-20260628-04-sprint-plan-tech-lead-20260629T213200Z-US0108`
- `phase_id=sprint-plan`
- `role=tech-lead`
- `proof_issued_at=2026-06-29T21:32:00Z`
- `proof_ttl_seconds=3600`
- `proof_hash=b3e7f1a2c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2`

Canonical payload: `{"orchestrator_run_id":"auto-20260628-04","phase_id":"sprint-plan","proof_issued_at":"2026-06-29T21:32:00Z","proof_ttl_seconds":3600,"role":"tech-lead","runtime_proof_id":"rp-auto-20260628-04-sprint-plan-tech-lead-20260629T213200Z-US0108"}`.

---

## Architecture handoff â **US-0108** â `/sprint-plan` next (fresh tech-lead)

- story_id: US-0108
- sprint_id: (none â sprint-plan to create S0108)
- dec_id: DEC-0108 (locked, decisions/DEC-0108.md)
- research_anchor: R-0096 (Q1âQ10 CLOSED, status=delivered)
- orchestrator_run_id: auto-20260628-04
- fresh_context_marker: tl-US0108-architecture-20260629T204500Z-fresh
- architecture_verdict: PASS
- task_count: 11 (within SPRINT_MAX_TASKS=12)
- ac_surjective_map: AC-1âT-001; AC-2âT-002,T-003; AC-3âT-004,T-005; AC-4âT-006; AC-5âT-007; AC-6âT-008; AC-7âT-009,T-010; AC-8âT-011
- tranche_order: A keys+reason codes â B worktree lib â C validator+selection â D merge+resource guard+execute steps â E tests+parity+runbook
- compose_guards (non-negotiable): DO NOT amend US-0047, US-0092, US-0103, US-0104, US-0107
- topology: parallel dev in isolated git worktrees; QA cross-review; deterministic winner selection; resource guard cap=6
- next_phase: `/sprint-plan` (fresh tech-lead) for US-0108 â materialize S0108 sprint
- timestamp: 2026-06-29T20:45:00Z
- role: tech-lead
- backlog_drain_active: true
- backlog_drain_stories_remaining_budget: 3
- portfolio_open_stories: 4 (US-0108, US-0109, US-0111, US-0112)

---

## Execute handoff â **US-0106** / **S0106** â `/execute` next (fresh dev)

- sprint_id: S0106
- story_id: US-0106
- dec_id: DEC-0106
- orchestrator_run_id: auto-20260628-04
- task_count: 11 (within SPRINT_MAX_TASKS=12)
- ac_surjective_map: AC-1âT-001; AC-2âT-002,T-003; AC-3âT-003; AC-4âT-004; AC-5âT-005; AC-6âT-006; AC-7âT-007,T-011; AC-8âT-008,T-009,T-010
- sprint_status: OPEN
- next_phase: `/execute` (fresh dev) for S0106 / US-0106
- compose_guards (non-negotiable): DO NOT amend US-0069, US-0003, US-0023, US-0103, US-0104, US-0105, US-0107
- timestamp: 2026-06-29T00:40:00Z
- role: qa
- verdict: PASS (plan-verify)

---

## Sprint-plan handoff â **US-0106** / **S0106** â sprint S0106 created (11 tasks T-001..T-011) â `/plan-verify` next (fresh qa)

- sprint_id: S0106
- story_id: US-0106
- dec_id: DEC-0106
- orchestrator_run_id: auto-20260628-04
- task_count: 11 (within SPRINT_MAX_TASKS=12)
- ac_surjective_map: AC-1âT-001; AC-2âT-002,T-003; AC-3âT-003; AC-4âT-004; AC-5âT-005; AC-6âT-006; AC-7âT-007,T-011; AC-8âT-008,T-009,T-010
- tranche_order: A keys+reason codes (T-001) â B lib+dispatch (T-004,T-005) â C validator+command (T-002,T-003) â D review isolation+compose (T-006,T-008,T-009) â E tests+parity+runbook (T-007,T-010,T-011)
- sprint_status: OPEN
- next_phase: `/plan-verify` (fresh qa) for S0106 / US-0106
- compose_guards (non-negotiable): DO NOT amend US-0069, US-0003, US-0023, US-0103, US-0104, US-0105, US-0107
- timestamp: 2026-06-29T00:35:00Z
- role: tech-lead
- verdict: PASS

---

## Plan-verify handoff â **US-0107** / **S0107** â post-**`/plan-verify`** â **`/execute`** (**qa**)


