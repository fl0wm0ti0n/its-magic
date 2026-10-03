## Architecture handoff — US-0145 Parallel development, release/deploy, self-healing, and closure

- **Phase completed**: architecture. **Role**: tech-lead. **Story**: US-0145 only. **Sprint**: (pending — expected S0155 at `/sprint-plan`). **Verdict**: PASS (`decision_gate=false`).
- **Timestamp (UTC)**: 2026-09-17T22:30:00Z. **Fresh marker**: `tl-US0145-architecture-20260917T223000Z-fresh`.
- **Orchestrator**: `orchestrator_run_id=auto-20260917-us0146`, parent=`auto-20260913-us0144`, `delivery_mode=ultra_lean`, resolved_phase_plan=`[spec, plan, build+verify, ship]`, macro=`plan` (architecture = second of research+architecture+sprint-plan), `model_id=inherit` (MODEL_RESOLVE=alias_only; CROSS_MODEL_REVIEW=0), AUTO_QUIET=1, AUTO_FLOW_MODE=full_autonomy, AUTO_SOVEREIGN=0, FRAMEWORK_KIT_REPO=1, EARLY_RESEARCH=0, drain story **3 of 3** (`backlog_drain_stories_remaining_budget=0`).
- **Sibling boundary**: **US-0140..US-0147 DONE** — compose only (US-0143 drain, US-0140 closure, US-0146 observe, US-0108/US-0109 Python libs); do not reopen. **US-0148 OPEN** — OUT OF SCOPE. **BUG-0022 OPEN** — do not drain. No npm-publish, git push, or `.env` reads.
- **Architecture anchor**: `docs/engineering/architecture.md` **`# US-0145`**. **Companion DEC**: **DEC-0145** Accepted (`decisions/DEC-0145.md`).
- **Approach**: **A1 (A\*) LOCKED** — nested `workflow/delivery/` (`ParallelDevCoordinator` + `ReleaseDeployPipeline`) + `KernelBridge.runDeliveryOperation()` → `scripts/delivery_runtime_bridge.py`; WorkflowEngine hooks; `ReleaseTarget` registry; GateEngine compose-only; closure/release ownership preserved.
- **Research consumed**: `rp-auto-20260917-us0146-research-techlead-20260917T220000Z-US-0145` / `CBBD28E0CA404A019F3919AA8870EA7FCC2699CC7AD4576F5F9CEA0323F222C6` — MATCH at `2026-09-17T22:30:00Z` before TTL `2026-09-17T23:00:00Z`.

### Locked design (A1)

- `ParallelDevCoordinator` post-execute hook; default-off `SOVEREIGN_PARALLEL_DEV=0`.
- Worktrees `.its-magic/worktrees/<run_id>/`; bridge to `parallel_dev_arbiter.py`.
- QA arbiter fresh `qa-arbiter` session; twelve `test_us0145_*`.
- Deploy ledger `handoffs/deploy_results/deploy_results.jsonl`; `RELEASE_GATE_ORDER` unamended.
- `releaseCannotMarkDone` + `applyClosure` sole DONE authority.

### Sprint seeds

- T-anch + T-001..T-011 (12 ≤ SPRINT_MAX_TASKS cap). Expected **S0155**. Do not implement delivery code this phase.

### Runtime proof (DEC-0038)

- `runtime_proof_id=rp-auto-20260917-us0146-architecture-techlead-20260917T223000Z-US-0145`
- `proof_hash=80F3C316829DD9A44996EE4BD61E4FF3AAC0FCF3DC276D02B7FC9585FDA5FBE9`
- `proof_ttl=2026-09-17T23:30:00Z`
- Canonical hashed payload: `{"orchestrator_run_id":"auto-20260917-us0146","phase_id":"architecture","proof_issued_at":"2026-09-17T22:30:00Z","proof_ttl_seconds":3600,"role":"tech-lead","runtime_proof_id":"rp-auto-20260917-us0146-architecture-techlead-20260917T223000Z-US-0145"}`
- `hash_recompute_confirmation=true` (compute_strict_proof_hash → 80F3C316829DD9A44996EE4BD61E4FF3AAC0FCF3DC276D02B7FC9585FDA5FBE9; independently MATCH; **64 hex** verified)
- Consumed research proof: `rp-auto-20260917-us0146-research-techlead-20260917T220000Z-US-0145` / `CBBD28E0CA404A019F3919AA8870EA7FCC2699CC7AD4576F5F9CEA0323F222C6` — MATCH

### Isolation + stop

- `phase_id=architecture`, `role=tech-lead`, `story_id=US-0145`, `model_id=inherit`, `fresh_context_marker=tl-US0145-architecture-20260917T223000Z-fresh`
- `evidence_ref=docs/engineering/architecture.md # US-0145; decisions/DEC-0145.md; docs/engineering/research.md ## R-0145; docs/engineering/state.md architecture checkpoint; handoffs/resume_brief.md`
- **Status**: US-0145 remains **OPEN**. AC-1..AC-9 remain unchecked. **Next**: `/sprint-plan` in fresh **tech-lead** subagent. CROSS_MODEL_REVIEW=0 — do not spawn sovereign-critic. Do not spawn sprint-plan from this architecture chat. STOP.

## Discovery handoff — US-0148 Stable control protocol and recoverable daemon

- **Phase completed**: discovery. **Role**: po. **Story**: US-0148 only. **Sprint**: (pending — expected S0156 at `/sprint-plan`). **Verdict**: PASS (`decision_gate=false`).
- **Timestamp (UTC)**: 2026-09-17T21:10:00Z. **Fresh marker**: `po-US0148-discovery-20260917T211000Z-fresh`.
- **Orchestrator**: `orchestrator_run_id=auto-20260917-us0148`, parent=`auto-20260917-us0146`, `delivery_mode=ultra_lean`, resolved_phase_plan=`[spec, plan, build+verify, ship]`, reinstatement_mode=`none`, memory_layer=`pack`, macro=`spec` (intake already DONE — not re-intaken; `handoffs/intake_evidence/US-0133-0148-intake-20260911.json` held, not mutated), `model_id=inherit` (MODEL_RESOLVE=alias_only; CROSS_MODEL_REVIEW=0), AUTO_QUIET=1, AUTO_FLOW_MODE=full_autonomy, AUTO_SOVEREIGN=0, FRAMEWORK_KIT_REPO=1, EARLY_RESEARCH=0, drain story **1 of 3** (`backlog_drain_stories_remaining_budget=2`; AUTO_BACKLOG_MAX_STORIES=3). Fresh `/auto` after prior segment `BACKLOG_MAX_STORIES_REACHED`; sole OPEN portfolio story **US-0148** (P1).
- **Sibling boundary**: **US-0133..US-0147 DONE** — compose only (especially US-0146 CLI/TUI + in-process `OperatorSession`, US-0140 commands, US-0143 scheduling, US-0136 session isolation, `runs/store` SQLite); do not reopen. **BUG-0022 OPEN** — do not drain. Do not build web/Android/watch/VS Code/distributed-worker clients v1. Do not npm-publish, git push, or read `.env`.
- **Gap confirmed (narrow-read)**: Masterplan §29.3 event/command inventory is specified but **no** `standalone/apps/daemon`, **no** versioned `packages/protocol`, **no** local transport; US-0146 delivered operator surfaces with **in-process** reconnect only (explicit deferral to this story); SQLite + repo reconciliation primitives exist but are not daemon-restart orchestrated.

### Discovery locks D1–D10

| ID | Lock |
|----|------|
| **D1** | Thin local daemon (`standalone/apps/daemon` per masterplan §30) + versioned protocol types (sibling `packages/protocol` vs nested = architecture DQ). Daemon owns **zero** workflow rules — delegates to runtime services (`OperatorCommandFacade`, `WorkflowEngine`, etc.). **No Pi** on protocol paths. **Do not** rewrite `CommandRouter` / `GateEngine` tables. |
| **D2** | AC-1 versioned schemas for runtime commands, agent text deltas, approvals, run-state, tool lifecycle, browser evidence, status, cancellation, errors (§29.3 inventory). |
| **D3** | AC-2 transport/session boundary only — no duplicate scheduling, stop-matrix, or sovereign logic in daemon. |
| **D4** | AC-3 CLI/TUI (US-0146) become daemon clients: start/attach, ordered event stream, approvals, cancel, disconnect/reconnect without losing canonical state — supersedes in-process-only reconnect semantics. |
| **D5** | AC-4 loopback transport permissions, client/origin identity, secret redaction on wire; remote exposure **disabled** unless explicitly configured (compose US-0135 redaction). |
| **D6** | AC-5 protocol version negotiation; unsupported commands fail closed with migration diagnostics. |
| **D7** | AC-6 daemon restart reconciles SQLite operational ledger with repository evidence; orphan cleanup per policy; resume only via **fresh** role sessions (compose `recovery/crash-resume`, US-0136). |
| **D8** | AC-7 contract tests `test_us0148_*`: ordering, backpressure, reconnect/replay boundary, concurrent clients, approvals, cancellation, crash/restart, version negotiation. |
| **D9** | AC-8 protocol/operator docs sufficient for deferred clients (web, Android/watch, VS Code, distributed-worker, remote Debian) without shipping them v1. |
| **D10** | OUT: rich remote **clients** v1; distributed workers; new Cursor/OpenCode adapters; restore `.opencode/commands/auto.md`; kit `cli.json`; plugin-local `its-magic-auto/tui.json`; npm-publish; git push; `.env`. Research stub **R-0148** (PO does not author `## R-0148`; **R-0145**=US-0145 — do not wipe). Companion **DEC-0148** + `# US-0148` at `/architecture` only. Expected sprint **S0156**. |

### Research questions DQ1–DQ10 (for `/research` → expect **R-0148**; stub only here)

1. **DQ1**: Local transport — Unix domain socket vs Windows named pipe vs loopback HTTP vs WebSocket; JSON-RPC alignment with masterplan Phase 8.
2. **DQ2**: Package layout — sibling `packages/protocol` vs nested under `runtime-core` vs generated schema-only module.
3. **DQ3**: Ordered event stream — sequencing ids, backpressure, subscriber fan-out, replay cursor after reconnect.
4. **DQ4**: CLI/TUI migration — refactor US-0146 clients off in-process `OperatorSession` without breaking delivered operator tests (compatibility window).
5. **DQ5**: Schema versioning — protocol semver, capability negotiation, deterministic mismatch errors (AC-5).
6. **DQ6**: Restart reconciliation — compose `runs/store` SQLite with repo evidence; orphan process/session cleanup policy; fresh role resume only.
7. **DQ7**: Local authn/z — peer credentials, capability tokens, multi-client ACL; default-deny remote bind.
8. **DQ8**: Secret redaction — event payload filtering compose `auth-models` / operator observability redaction rules.
9. **DQ9**: Concurrent clients — observer vs controller roles; approval routing when multiple TUI/CLI attached.
10. **DQ10**: Tests + kit — `test_us0148_*` matrix covering AC-1..AC-8; kit `files` omit `standalone/` unless architecture proves otherwise. **R-id live-inventory**: allocate **R-0148**; do not wipe **R-0145**.

### Design refs

- `docs/product/standalone-its-magic-pi-masterplan.md` §29.3, §30 (`apps/daemon`, `packages/protocol`), §32 Phase 8, §37, Story 15
- Compose: US-0146 **DONE** (`standalone/apps/cli`, `tui`, `runtime-core/src/operator/`); US-0140 `PROGRAMMATIC_COMMANDS`; US-0143 `/auto`/`/quick`; US-0136 session isolation; `runtime-core` `runs/store` + `recovery/crash-resume`
- Intake (read-only): `handoffs/intake_evidence/US-0133-0148-intake-20260911.json` (`daemon-control-api` → US-0148)

### Research stub (PO does not author `docs/engineering/research.md`)

- **Expected next R-id**: **R-0148** (`ID_NAMESPACE_BOOTSTRAP=0`; highest delivered heading is **R-0145** US-0145).
- Do **not** author `## R-0148` this phase. Do **not** wipe **R-0145**. Do **not** reuse R-0145 for US-0148 body.
- Companion **DEC-0148** + `# US-0148` at `/architecture` only — PO does not author them.
- Expected sprint **S0156** at `/sprint-plan` only (S0155 = US-0145 released — do not reuse).

### Runtime proof (DEC-0038)

- `runtime_proof_id=rp-auto-20260917-us0148-discovery-po-20260917T211000Z-US-0148`
- `proof_hash=F9FCC16A49352472DADA88CEA509768C50E3EDCD5CE614EE53AFE07462CCA4AC`
- `proof_ttl=2026-09-17T22:10:00Z`
- Hash via `from scripts.token_cost_lib import compute_strict_proof_hash` (positional; compact sorted-key JSON).
- Canonical hashed payload: `{"orchestrator_run_id":"auto-20260917-us0148","phase_id":"discovery","proof_issued_at":"2026-09-17T21:10:00Z","proof_ttl_seconds":3600,"role":"po","runtime_proof_id":"rp-auto-20260917-us0148-discovery-po-20260917T211000Z-US-0148"}`
- Isolation extras (not hashed): `delivery_mode=ultra_lean`, `macro_phase=spec`, `model_id=inherit`, `sprint_id=none`, `story_id=US-0148`, `skipped_phases=[intake]`, `CROSS_MODEL_REVIEW=0`, `native_chain_active=true`, `native_chain_continuing=true`, `drain_story_index=1 of 3`
- `hash_recompute_confirmation=true` (compute_strict_proof_hash → f9fcc16a49352472dafa88cea509768c50e3edcd5ce614ee53afe07462cca4ac; independently MATCH; **64 hex** verified; stored uppercase)

### Isolation + stop

- `phase_id=discovery`, `role=po`, `story_id=US-0148`, `model_id=inherit`, `fresh_context_marker=po-US0148-discovery-20260917T211000Z-fresh`
- `evidence_ref=docs/product/backlog.md ## US-0148 discovery_notes; docs/product/vision.md ## Discovery Notes — US-0148; this handoff; docs/engineering/state.md discovery checkpoint; handoffs/resume_brief.md; handoffs/intake_evidence/US-0133-0148-intake-20260911.json (read-only)`
- **Hot-surface note**: Appended at true end. Post-append `--check` STATE_ARCHIVE_REQUIRED po_to_tl 704/650 → `--rollover --json` archived to `handoffs/archive/po-to-tl-pack-20260917-g.md` (moved=2; retained_lines=572). final `--check` PASS.
- **Status**: US-0148 remains **OPEN**. AC-1..AC-8 remain unchecked. Acceptance.md US-0148 row unchecked. **Next**: `/research` in fresh **tech-lead** subagent. CROSS_MODEL_REVIEW=0 — do not spawn sovereign-critic. Do not spawn research from this discovery chat. STOP.

## Architecture handoff — US-0148 Stable control protocol and recoverable daemon

- **Phase completed**: architecture. **Role**: tech-lead. **Story**: US-0148 only. **Sprint**: (pending — expected **S0156** at `/sprint-plan`). **Verdict**: PASS (`decision_gate=false`).
- **Timestamp (UTC)**: 2026-09-17T21:14:00Z. **Fresh marker**: `tl-US0148-architecture-20260917T211400Z-fresh`.
- **Orchestrator**: `orchestrator_run_id=auto-20260917-us0148`, parent=`auto-20260917-us0146`, `delivery_mode=ultra_lean`, resolved_phase_plan=`[spec, plan, build+verify, ship]`, reinstatement_mode=`none`, memory_layer=`pack`, macro=`plan`, `model_id=inherit` (MODEL_RESOLVE=alias_only; CROSS_MODEL_REVIEW=0), AUTO_QUIET=1, AUTO_FLOW_MODE=full_autonomy, AUTO_SOVEREIGN=0, FRAMEWORK_KIT_REPO=1, drain story **1 of 3** (`backlog_drain_stories_remaining_budget=2`; AUTO_BACKLOG_MAX_STORIES=3).
- **Sibling boundary**: **US-0133..US-0147 DONE** — compose only (US-0146 CLI/TUI **migrate** to daemon clients; US-0143 scheduling; US-0140 commands; US-0136 sessions); do not reopen. **BUG-0022 OPEN** — do not drain. No web/Android/watch/VS Code/distributed-worker clients v1. No npm-publish, git push, or `.env` reads.
- **Approach**: **A1 (A\*)** locked — `@its-magic/protocol`, `apps/daemon` (loopback JSON-RPC + WebSocket `/v1/events`), `runtime-core/src/daemon-client/` `DaemonTransport`, SQLite per-run `seq` log, bearer token + controller/observer roles, startup `crashResume` + `reconcileOperationalLedger`, twelve **`test_us0148_*`**, doc **`docs/engineering/operator/daemon-protocol.md`**.

### Architecture locks (DQ1–DQ10 → implementation)

| DQ | Pin |
|----|-----|
| DQ1 | JSON-RPC on `127.0.0.1`/`::1`; `.its-magic/daemon/listen.json` |
| DQ2 | `packages/protocol` + `apps/daemon`; client in `daemon-client/` |
| DQ3 | SQLite event log; `after_seq` replay; lag summary mode |
| DQ4 | `OperatorTransport`; US-0146 tests stay in-process |
| DQ5 | `daemon.hello` + `PROTOCOL_VERSION_MISMATCH` |
| DQ6 | Restart reconcile; fresh role sessions only |
| DQ7 | `client.token` bearer; single controller |
| DQ8 | `redactEventPayload()` on wire |
| DQ9 | Observers + controller approval/cancel rules |
| DQ10 | `us0148.contract.test.ts` + operator protocol doc |

### Sprint seeds (for `/sprint-plan` only)

T-anch + T-001..T-011 per `# US-0148` in `docs/engineering/architecture.md` (≤12 tasks at cap). Expected **S0156**.

### Runtime proof (DEC-0038)

- `runtime_proof_id=rp-auto-20260917-us0148-architecture-techlead-20260917T211400Z-US-0148`
- `proof_hash=AC546FD44FE347547D9DD92F79C906DC71B2212DD27969336F73F9475C48708D`
- `proof_ttl=2026-09-17T22:14:00Z`
- Canonical hashed payload: `{"orchestrator_run_id":"auto-20260917-us0148","phase_id":"architecture","proof_issued_at":"2026-09-17T21:14:00Z","proof_ttl_seconds":3600,"role":"tech-lead","runtime_proof_id":"rp-auto-20260917-us0148-architecture-techlead-20260917T211400Z-US-0148"}`
- `hash_recompute_confirmation=true` (compute_strict_proof_hash → AC546FD44FE347547D9DD92F79C906DC71B2212DD27969336F73F9475C48708D; independently MATCH; **64 hex** verified)
- Consumed research proof: `rp-auto-20260917-us0148-research-techlead-20260917T211200Z-US-0148` / `5F986CEE216B57CFD2DB191C8C4CE1CD9539596DCA6A35AEB9E91CE4729B0A4C` — MATCH

### Isolation + stop

- `phase_id=architecture`, `role=tech-lead`, `story_id=US-0148`, `model_id=inherit`, `fresh_context_marker=tl-US0148-architecture-20260917T211400Z-fresh`
- `evidence_ref=docs/engineering/architecture.md # US-0148; decisions/DEC-0148.md; docs/engineering/research.md ## R-0148; docs/engineering/state.md architecture checkpoint; handoffs/resume_brief.md`
- **Status**: US-0148 remains **OPEN**. AC-1..AC-8 remain unchecked. **Next**: `/sprint-plan` in fresh **tech-lead** subagent. CROSS_MODEL_REVIEW=0 — do not spawn sovereign-critic. Do not spawn sprint-plan from this architecture chat. STOP.

## Intake handoff — BUG-0025 npm publish omits standalone_runtime_install_lib.py

- **Phase completed**: intake (`/intake bug`). **Role**: po. **Bug**: BUG-0025. **Sprint**: (pending). **Verdict**: PASS (`decision_gate=false`).
- **Timestamp**: 2026-09-18T15:48:00Z. **Fresh marker**: `po-BUG0025-intake-20260918T154800Z-fresh`.
- **Writer**: `writer_id=po-cursor-20260918-BUG0025-intake`, `intake_run_id=cursor-20260918-BUG0025-intake`.
- **Routing**: argv `/intake bug` wins over scratchpad `INTAKE_WORK_ITEM_KIND=story`. `selected_pack=small-intake-pack`. `INTAKE_GUIDED_MODE=0`. `WORK_KIND_ROUTING=0`. `EARLY_RESEARCH=0`. Next id confirmed `python scripts/bug_issue_validate.py --print-next-id` → **BUG-0025** before write.
- **Evidence**:
  - `handoffs/intake_evidence/BUG-0025-intake-20260918T154800Z.json` — `[INTAKE_EVIDENCE_VALIDATION_OK]` (pre-write)
  - `python scripts/bug_issue_validate.py --backlog docs/product/backlog.md --check-acceptance` — `[BUG_VALIDATION_OK]`
  - DEC-0069 resume brief: canonical pointer **prepended** (in-place `upsert_latest_orchestration_pointer` skipped — would clobber ~40 historical `## Latest orchestration pointer` headings). `python scripts/intake_bug_resume_brief_refresh.py --bug-id BUG-0025 --validate-file` → `[INTAKE_RESUME_BRIEF_VALIDATE_OK]`; `intended_resume_phase=discovery`; `resolved_start_phase=discovery`; `resolution_source=resume_brief`; `bug_id=BUG-0025`.
- **Research**: expected **R-0149** at `/research` (not authored this intake; EARLY_RESEARCH=0). Compose **R-0144** (US-0147). Do not wipe R-0140..R-0148.
- **Defect**: After `npm install -g its-magic@0.1.3`, `its-magic --target . --mode upgrade --host both` (from v0.1.3-11 → 0.1.3) passes `HOST_CONFIG_POSTINSTALL_OK` then crashes with `FileNotFoundError` for `scripts/standalone_runtime_install_lib.py`. Root cause: root `package.json` `files` omits that script (repo-local file exists; US-0147 hook loads it).
- **Duplicate check**: Persist **NEW BUG-0025**. Distinct from **BUG-0022 OPEN** / **BUG-0024 OPEN** (do not merge/drain). Compose **US-0147 DONE** — do not reopen ACs beyond shipping missing packaged file(s) + fail-closed loader + pack/guard contract. Optional note only: 0.1.3-11→0.1.3 semver quirk.
- **Decomposition**: **single_bug** — `/intake bug` accepted. Recommended: add lib to `files` + harden `_load_standalone_runtime_install_lib` → `STANDALONE_BOOTSTRAP_FAILED` + pack contract + republish.
- **Scope for `/discovery`**: lock packaging allowlist + loader fail-closed + contract test inventory; do not reopen US-0147 feature scope; do not merge BUG-0022/0024.
- **Isolation**: `phase_id=intake`; `role=po`; `bug_id=BUG-0025`; `fresh_context_marker=po-BUG0025-intake-20260918T154800Z-fresh`; `timestamp=2026-09-18T15:48:00Z`; `model_id=inherit`; `evidence_ref=docs/product/backlog.md ### BUG-0025, docs/product/acceptance.md BUG-0025 row, handoffs/intake_evidence/BUG-0025-intake-20260918T154800Z.json, docs/product/vision.md ## Intake Notes — BUG-0025, this handoff`.
- **Hot-surface note**: Appended (not prepended) so triad oldest-prefix rollover retains this newest section. Post-append `--check` → `STATE_ARCHIVE_REQUIRED` `state` 1220/1200 → `--rollover --json` `{"boundary":"triad-rollover|state","moved":2,"pack_ref":"docs/engineering/state-archive/state-pack-20260918.md","retained_checkpoints":11,"retained_lines":1140}`; final `--check` PASS. `po_to_tl` under cap (no pack). Architecture not touched. Intake did not append `docs/engineering/state.md`.
- **Status**: OPEN per US-0045. **Next**: `/discovery` (fresh **po**) for **BUG-0025**, or `/auto bug-target=BUG-0025`. Do not run discovery/research/execute from this intake chat. STOP.

## Discovery handoff — BUG-0025 npm publish omits standalone_runtime_install_lib.py

- **Phase completed**: discovery. **Role**: po. **Bug**: BUG-0025 only. **Sprint**: (pending — expected **S0157** at `/sprint-plan`). **Verdict**: PASS (`decision_gate=false`).
- **Timestamp (UTC)**: 2026-09-18T16:44:20Z. **Fresh marker**: `po-BUG0025-discovery-20260918T164420Z-fresh`.
- **Orchestrator**: `orchestrator_run_id=auto-20260918-bug0025`, parent=`cursor-20260918-BUG0025-intake`, `delivery_mode=ultra_lean`, resolved_phase_plan=`[spec, plan, build+verify, ship]`, reinstatement_mode=`none`, memory_layer=`pack`, macro=`spec` (intake already DONE — not re-intaken; `handoffs/intake_evidence/BUG-0025-intake-20260918T154800Z.json` held read-only), `model_id=inherit` (MODEL_RESOLVE=alias_only; CROSS_MODEL_REVIEW=0), AUTO_QUIET=1, AUTO_FLOW_MODE=full_autonomy, AUTO_SOVEREIGN=0, FRAMEWORK_KIT_REPO=1, EARLY_RESEARCH=0, segment_work_item_kind=`bug`, active_bug_id=`BUG-0025`, bug_queue_position=`1 of 1`.
- **Sibling boundary**: **US-0147 DONE** — compose only (standalone hook); do **not** reopen ACs beyond shipping missing packaged file(s) + fail-closed loader + pack/guard contract. **BUG-0022 OPEN** / **BUG-0024 OPEN** — do not merge; do not drain. Do not treat `0.1.3-11`→`0.1.3` semver quirk as primary scope. No OpenCode/Cursor host bugs. No npm-publish, git push, or `.env` reads this phase.
- **Gap confirmed (narrow-read)**: repo-local `scripts/standalone_runtime_install_lib.py` exists; root `package.json` `files` omits it; published `its-magic@0.1.3` upgrade crashes with `FileNotFoundError` after `HOST_CONFIG_POSTINSTALL_OK` via `_load_standalone_runtime_install_lib`.

### Discovery locks D1–D10

| ID | Lock |
|----|------|
| **D1** | Root cause = npm `files` allowlist omit of `scripts/standalone_runtime_install_lib.py` (+ peers the standalone hook needs). |
| **D2** | Add path(s) to root `package.json` `files` so publish/pack cannot omit them. |
| **D3** | Harden `_load_standalone_runtime_install_lib` → `STANDALONE_BOOTSTRAP_FAILED` when lib missing (no raw `FileNotFoundError` as operator-visible outcome). |
| **D4** | Contract test proves `npm pack` / tarball includes `scripts/standalone_runtime_install_lib.py`. |
| **D5** | Optional `guard_installer_publish` check covering the same path(s). |
| **D6** | Republish ships the packaging fix (operator global install includes the lib). |
| **D7** | Compose US-0147 DONE — do not reopen ACs beyond shipping missing packaged file(s) + fail-closed loader + pack/guard contract. |
| **D8** | Distinct from BUG-0022 / BUG-0024 — do not merge or drain. |
| **D9** | Semver quirk `0.1.3-11`→`0.1.3` OUT of primary scope (optional note only). |
| **D10** | OUT: OpenCode/Cursor host bugs; companion DEC (none expected — architecture may use `# BUG-0025` only). Research stub **R-0149** (PO does not author `## R-0149`; **R-0148**=US-0148 — do not wipe). Expected sprint **S0157**. |

### Research questions DQ1–DQ10 (for `/research` → expect **R-0149**; stub only here)

1. **DQ1**: Exact `package.json` `files` delta — `scripts/standalone_runtime_install_lib.py` alone vs transitive peer scripts the standalone hook imports.
2. **DQ2**: Inventory of all paths `installer.py` standalone postinstall loads via importlib/`get_data` that must be packaged.
3. **DQ3**: Fail-closed shape for `_load_standalone_runtime_install_lib` — where to catch missing path; reason-code `STANDALONE_BOOTSTRAP_FAILED` emission site and operator messaging.
4. **DQ4**: `npm pack` / tarball contract-test approach (Python unpack, `npm pack --dry-run`, or existing publish-guard patterns from BUG-0001/US-0084).
5. **DQ5**: Whether to extend `guard_installer_publish.py` (or sibling) vs new `test_bug0025_*` only.
6. **DQ6**: Republish / release-queue coupling — version bump vs same-line republish; interaction with `RELEASE_PUBLISH_MODE`.
7. **DQ7**: Compose boundary with US-0147 / R-0144 — what must stay untouched vs packaging-only deltas.
8. **DQ8**: Regression vs BUG-0001/0003 completeness lineage — avoid double-counting or weakening prior guards.
9. **DQ9**: Active↔template / kit-slice parity if any packaged script also mirrored under `template/scripts/`.
10. **DQ10**: Test matrix + architecture anchor — `test_bug0025_*` inventory; additive `# BUG-0025` only (no companion DEC); **R-id live-inventory**: allocate **R-0149**; do not wipe **R-0148**.

### Design refs

- Root `package.json` `files`; `scripts/standalone_runtime_install_lib.py`; `installer.py` `_load_standalone_runtime_install_lib` / `bootstrap_standalone_runtime_installer_hook` / `run_standalone_postinstall`
- Compose: US-0147 DONE / R-0144; BUG-0001 / BUG-0003 packaging completeness; optional `scripts/guard_installer_publish.py`
- Intake (read-only): `handoffs/intake_evidence/BUG-0025-intake-20260918T154800Z.json`

### Research stub (PO does not author `docs/engineering/research.md`)

- **Expected next R-id**: **R-0149** (`ID_NAMESPACE_BOOTSTRAP=0`; highest delivered heading is **R-0148** US-0148).
- Do **not** author `## R-0149` this phase. Do **not** wipe **R-0148**. Do **not** reuse R-0148 for BUG-0025 body.
- Companion DEC: **none expected** — `# BUG-0025` at `/architecture` only — PO does not author them.
- Expected sprint **S0157** at `/sprint-plan` only (do not create this phase).

### Runtime proof (DEC-0038)

- `runtime_proof_id=rp-auto-20260918-bug0025-discovery-po-20260918T164420Z-BUG-0025`
- `proof_hash=AE4DA26DCBBC10BF8E03C091E8DA8FAA56B6FEB3608F2226F4CD09644ED64E4C`
- `proof_ttl=2026-09-18T17:44:20Z`
- Hash via `from scripts.token_cost_lib import compute_strict_proof_hash` (positional; compact sorted-key JSON).
- Canonical hashed payload: `{"orchestrator_run_id":"auto-20260918-bug0025","phase_id":"discovery","proof_issued_at":"2026-09-18T16:44:20Z","proof_ttl_seconds":3600,"role":"po","runtime_proof_id":"rp-auto-20260918-bug0025-discovery-po-20260918T164420Z-BUG-0025"}`
- Isolation extras (not hashed): `delivery_mode=ultra_lean`, `macro_phase=spec`, `model_id=inherit`, `sprint_id=none`, `bug_id=BUG-0025`, `skipped_phases=[intake]`, `CROSS_MODEL_REVIEW=0`, `native_chain_active=true`, `native_chain_continuing=true`, `segment_work_item_kind=bug`
- `hash_recompute_confirmation=true` (compute_strict_proof_hash → AE4DA26DCBBC10BF8E03C091E8DA8FAA56B6FEB3608F2226F4CD09644ED64E4C MATCH; **64 hex** verified; stored uppercase)

### Isolation + stop

- `phase_id=discovery`, `role=po`, `bug_id=BUG-0025`, `model_id=inherit`, `fresh_context_marker=po-BUG0025-discovery-20260918T164420Z-fresh`
- `evidence_ref=docs/product/backlog.md ### BUG-0025 discovery_notes; docs/product/vision.md ## Discovery Notes — BUG-0025; this handoff; docs/engineering/state.md discovery checkpoint; handoffs/resume_brief.md; handoffs/intake_evidence/BUG-0025-intake-20260918T154800Z.json (read-only)`
- **Hot-surface note**: Appended (not prepended) so triad oldest-prefix rollover retains this newest section. Post-append `--rollover --json` → `{"boundary":"triad-rollover|state","moved":1,"pack_ref":"docs/engineering/state-archive/state-pack-20260918-a.md","retained_checkpoints":11,"retained_lines":1158}` + `{"boundary":"triad-rollover|po_to_tl","moved":1,"pack_ref":"handoffs/archive/po-to-tl-pack-20260918.md","retained_lines":650,"retained_sections":14}`; final `--check` PASS.
- **Status**: BUG-0025 remains **OPEN**. AC-1..AC-8 remain unchecked. Acceptance.md BUG-0025 row unchecked. **Next**: `/research` in fresh **tech-lead** subagent. CROSS_MODEL_REVIEW=0 — do not spawn sovereign-critic. Do not spawn research from this discovery chat. STOP.

## Research handoff — BUG-0025 npm publish omits standalone_runtime_install_lib.py

- **Phase completed**: research. **Role**: tech-lead. **Bug**: BUG-0025 only. **Sprint**: (pending — expected **S0157** at `/sprint-plan`). **Verdict**: PASS (`decision_gate=false`).
- **Timestamp (UTC)**: 2026-09-18T16:55:00Z. **Fresh marker**: `tl-BUG0025-research-20260918T165500Z-fresh`.
- **Orchestrator**: `orchestrator_run_id=auto-20260918-bug0025`, parent=`cursor-20260918-BUG0025-intake`, `delivery_mode=ultra_lean`, resolved_phase_plan=`[spec, plan, build+verify, ship]`, macro=`plan` (research = first of research+architecture+sprint-plan), `model_id=inherit` (MODEL_RESOLVE=alias_only; CROSS_MODEL_REVIEW=0), AUTO_QUIET=1, AUTO_FLOW_MODE=full_autonomy, AUTO_SOVEREIGN=0, FRAMEWORK_KIT_REPO=1, EARLY_RESEARCH=0, segment_work_item_kind=`bug`, active_bug_id=`BUG-0025`, bug_queue_position=`1 of 1`.
- **Sibling boundary**: **US-0147 DONE** — compose only; do **not** reopen ACs beyond shipping missing packaged file(s) + fail-closed loader + pack/guard contract. **BUG-0022 OPEN** / **BUG-0024 OPEN** — do not merge; do not drain. Semver quirk `0.1.3-11`→`0.1.3` OUT of primary scope. No OpenCode/Cursor host bugs. No npm-publish, git push, or `.env` reads this phase.
- **Research anchor**: `docs/engineering/research.md` **`## R-0149`**. Do not wipe **R-0148** (US-0148). Discovery D1–D10 unchanged on backlog.
- **Approach**: **A1 (A\*)** — add `scripts/standalone_runtime_install_lib.py` to root `package.json` `files`; harden `_load_standalone_runtime_install_lib` isfile-before-exec → `STANDALONE_BOOTSTRAP_FAILED`; `npm pack` contract + optional `guard_installer_publish` allowlist assert; patch republish. No companion DEC.
- **Companion DEC**: **none** — `# BUG-0025` at `/architecture` only — do **not** author `decisions/DEC-*` or `# BUG-0025` this phase.

### Closed questions DQ1–DQ10

| DQ | Topic | Resolution | LOCK |
|----|-------|------------|------|
| DQ1 | `files` delta | One entry: `scripts/standalone_runtime_install_lib.py` | LOCKED |
| DQ2 | Load inventory | Sole importlib peer; residual supported-range fail-closed (no `standalone/` in files) | LOCKED |
| DQ3 | Fail-closed loader | isfile-before-exec; `STANDALONE_BOOTSTRAP_FAILED`; no raw FileNotFoundError | LOCKED |
| DQ4 | Pack contract | `npm pack --dry-run` / tarball member + `files` string assert | LOCKED |
| DQ5 | Guard vs tests | `test_bug0025_*` primary; optional guard allowlist check | LOCKED |
| DQ6 | Republish | Patch bump (e.g. 0.1.4); same-line 0.1.3 fragile | LOCKED |
| DQ7 | US-0147 compose | Packaging + loader + pack/guard only; hook semantics untouched | LOCKED |
| DQ8 | BUG-0001/0003 | Additive tests; do not weaken prior guards | LOCKED |
| DQ9 | Template parity | No `template/scripts/` mirror of loader | LOCKED |
| DQ10 | Tests + R-id | 5–6 `test_bug0025_*`; **R-0149**; **S0157**; no companion DEC | LOCKED |

### Architecture seeds (preview)

- `/architecture` authors `# BUG-0025` only (no companion DEC); pins allowlist string, loader shape, test IDs, optional guard, patch republish, supported-range residual.
- `/sprint-plan` materializes **S0157** (≤12 tasks from architecture seeds).
- Do not implement application code this phase.

### Runtime proof (DEC-0038)

- `runtime_proof_id=rp-auto-20260918-bug0025-research-techlead-20260918T165500Z-BUG-0025`
- `proof_hash=8E27420FCD21FE740C6015A45AB789057024E91BEA858636968488C1ACBFD249`
- `proof_ttl=2026-09-18T17:55:00Z`
- Hash via `from scripts.token_cost_lib import compute_strict_proof_hash` (positional; compact sorted-key JSON).
- Canonical hashed payload: `{"orchestrator_run_id":"auto-20260918-bug0025","phase_id":"research","proof_issued_at":"2026-09-18T16:55:00Z","proof_ttl_seconds":3600,"role":"tech-lead","runtime_proof_id":"rp-auto-20260918-bug0025-research-techlead-20260918T165500Z-BUG-0025"}`
- Isolation extras (not hashed): `delivery_mode=ultra_lean`, `macro_phase=plan`, `model_id=inherit`, `sprint_id=none`, `bug_id=BUG-0025`, `skipped_phases=[intake]`, `CROSS_MODEL_REVIEW=0`, `native_chain_active=true`, `native_chain_continuing=true`, `segment_work_item_kind=bug`
- `hash_recompute_confirmation=true` (compute_strict_proof_hash → 8E27420FCD21FE740C6015A45AB789057024E91BEA858636968488C1ACBFD249 MATCH; **64 hex** verified; stored uppercase)
- Consumed discovery producer proof: `rp-auto-20260918-bug0025-discovery-po-20260918T164420Z-BUG-0025` / `AE4DA26DCBBC10BF8E03C091E8DA8FAA56B6FEB3608F2226F4CD09644ED64E4C` — MATCH; not STALE at `2026-09-18T16:55:00Z`

### Isolation + stop

- `phase_id=research`, `role=tech-lead`, `bug_id=BUG-0025`, `model_id=inherit`, `fresh_context_marker=tl-BUG0025-research-20260918T165500Z-fresh`
- `evidence_ref=docs/engineering/research.md ## R-0149; docs/product/backlog.md ### BUG-0025 discovery_notes; this handoff; docs/engineering/state.md research checkpoint; handoffs/resume_brief.md`
- **Hot-surface note**: Appended (not prepended) so triad oldest-prefix rollover retains this newest section. Post-append `--rollover --json` → `{"boundary":"triad-rollover|state","moved":1,"pack_ref":"docs/engineering/state-archive/state-pack-20260918-b.md","retained_checkpoints":11,"retained_lines":1159}` + `{"boundary":"triad-rollover|po_to_tl","moved":1,"pack_ref":"handoffs/archive/po-to-tl-pack-20260918-a.md","retained_lines":632,"retained_sections":14}`; final `--check` PASS.
- **Status**: BUG-0025 remains **OPEN**. AC-1..AC-8 remain unchecked. **Next**: `/architecture` in fresh **tech-lead** subagent. CROSS_MODEL_REVIEW=0 — do not spawn sovereign-critic. Do not spawn architecture from this research chat. STOP.

## Architecture handoff — BUG-0025 npm publish omits standalone_runtime_install_lib.py

- **Phase completed**: architecture. **Role**: tech-lead. **Bug**: BUG-0025 only. **Sprint**: (pending — expected **S0157** at `/sprint-plan`). **Verdict**: PASS (`decision_gate=false`).
- **Timestamp (UTC)**: 2026-09-18T17:00:00Z. **Fresh marker**: `tl-BUG0025-architecture-20260918T170000Z-fresh`.
- **Orchestrator**: `orchestrator_run_id=auto-20260918-bug0025`, parent=`cursor-20260918-BUG0025-intake`, `delivery_mode=ultra_lean`, resolved_phase_plan=`[spec, plan, build+verify, ship]`, macro=`plan` (architecture = middle of research+architecture+sprint-plan), `model_id=inherit` (MODEL_RESOLVE=alias_only; CROSS_MODEL_REVIEW=0), AUTO_QUIET=1, AUTO_FLOW_MODE=full_autonomy, AUTO_SOVEREIGN=0, FRAMEWORK_KIT_REPO=1, EARLY_RESEARCH=0, segment_work_item_kind=`bug`, active_bug_id=`BUG-0025`, bug_queue_position=`1 of 1`.
- **Sibling boundary**: **US-0147 DONE** — compose only; do **not** reopen ACs beyond packaging + fail-closed loader + pack/guard + patch republish. **BUG-0022 OPEN** / **BUG-0024 OPEN** — do not merge; do not drain. Semver quirk `0.1.3-11`→`0.1.3` OUT of primary scope. No OpenCode/Cursor host bugs. No npm-publish, git push, or `.env` reads this phase.
- **Research consumed**: `docs/engineering/research.md` **`## R-0149`** (A1; DQ1–DQ10 LOCKED). Producer proof `rp-auto-20260918-bug0025-research-techlead-20260918T165500Z-BUG-0025` / `8E27420FCD21FE740C6015A45AB789057024E91BEA858636968488C1ACBFD249` — MATCH; not STALE at consume.
- **Approach**: **A1 (A\*)** locked in additive H1 **`# BUG-0025`** only — one `files` entry `scripts/standalone_runtime_install_lib.py`; isfile-before-exec → `STANDALONE_BOOTSTRAP_FAILED`; `tests/bug0025_packaging_contract_test.py` (5–6 markers); optional `guard_installer_publish` allowlist assert (omit-`standalone/` held); patch republish (e.g. 0.1.4); supported-range residual fail-closed (no `standalone/` in `files`).
- **Companion DEC**: **none** — do **not** author `decisions/DEC-*`. `docs/engineering/decisions.md` left unchanged.
- **Tests (architecture-owned)**: DQ10 markers in `# BUG-0025` Test contract.
- **Sprint seeds**: T-anch + T-001..T-010 (11 ≤ 12) for **S0157** — do **not** create `sprints/S0157/` this phase.
- **Next**: `/sprint-plan` materializes **S0157** (fresh tech-lead). Do **not** spawn sprint-plan from this architecture chat. CROSS_MODEL_REVIEW=0 — no sovereign-critic.

### Runtime proof (DEC-0038)

- `runtime_proof_id=rp-auto-20260918-bug0025-architecture-techlead-20260918T170000Z-BUG-0025`
- `proof_hash=DA89597E0B3BD3F37E33AE7A83BFAFF70B4CD04EEDB22BDAE0D7C283FF09B8BE`
- `proof_ttl=2026-09-18T18:00:00Z`
- Hash via `from scripts.token_cost_lib import compute_strict_proof_hash` (positional; compact sorted-key JSON).
- Canonical hashed payload: `{"orchestrator_run_id":"auto-20260918-bug0025","phase_id":"architecture","proof_issued_at":"2026-09-18T17:00:00Z","proof_ttl_seconds":3600,"role":"tech-lead","runtime_proof_id":"rp-auto-20260918-bug0025-architecture-techlead-20260918T170000Z-BUG-0025"}`
- Isolation extras (not hashed): `delivery_mode=ultra_lean`, `macro_phase=plan`, `model_id=inherit`, `sprint_id=none`, `bug_id=BUG-0025`, `skipped_phases=[intake]`, `CROSS_MODEL_REVIEW=0`, `native_chain_active=true`, `native_chain_continuing=true`, `segment_work_item_kind=bug`
- `hash_recompute_confirmation=true` (compute_strict_proof_hash → DA89597E0B3BD3F37E33AE7A83BFAFF70B4CD04EEDB22BDAE0D7C283FF09B8BE MATCH; **64 hex** verified; stored uppercase)
- Consumed research producer proof: `rp-auto-20260918-bug0025-research-techlead-20260918T165500Z-BUG-0025` / `8E27420FCD21FE740C6015A45AB789057024E91BEA858636968488C1ACBFD249` — MATCH; not STALE at `2026-09-18T17:00:00Z`

### Isolation + stop

- `phase_id=architecture`, `role=tech-lead`, `bug_id=BUG-0025`, `model_id=inherit`, `fresh_context_marker=tl-BUG0025-architecture-20260918T170000Z-fresh`
- `evidence_ref=docs/engineering/architecture.md # BUG-0025; docs/engineering/research.md ## R-0149; this handoff; docs/engineering/state.md architecture checkpoint; handoffs/resume_brief.md`
- **Hot-surface note**: Appended (not prepended) so triad oldest-prefix rollover retains this newest section. Post-append `--rollover --json` → `{"boundary":"triad-rollover|state","moved":1,"pack_ref":"docs/engineering/state-archive/state-pack-20260918-c.md","retained_checkpoints":11,"retained_lines":1085}` + `{"boundary":"triad-rollover|po_to_tl","moved":1,"pack_ref":"handoffs/archive/po-to-tl-pack-20260918-b.md","retained_lines":617,"retained_sections":14}` + `{"boundary":"triad-rollover|architecture","moved":1,"pack_ref":"docs/engineering/architecture-archive/architecture-pack-20260918.md","retained_lines":2874,"retained_story_sections":24}`; `--check-arch-heading-policy --baseline-h2-count 0` PASS; `materialize_codebase_map.py --trigger architecture` → `[CODEBASE_MAP_OK] preserved_existing`; final `--check` PASS. `# BUG-0025` retained at hot end.
- **Status**: BUG-0025 remains **OPEN**. AC-1..AC-8 remain unchecked. **Next**: `/sprint-plan` in fresh **tech-lead** subagent. CROSS_MODEL_REVIEW=0 — do not spawn sovereign-critic. Do not spawn sprint-plan from this architecture chat. STOP.

## Discovery handoff — US-0150 Production standalone runtime composition

- **Phase completed**: discovery. **Role**: po. **Story**: US-0150. **Verdict**: PASS (`decision_gate=false`).
- **Evidence**: `handoffs/intake_evidence/US-0150-0154-standalone-integration-intake-20260919.json` validated PASS. Static audit found CLI/daemon throwing kernels, discarded transports, empty config, placeholder tool success, and fake/default service paths.
- **Locked scope**: One project-scoped production composition root resolves config once and admits `createAgentKernel`, `KernelBridge`, `SessionSupervisor`, `ToolBroker`, code intelligence/context, and persistent operational storage. CLI and daemon inject it; no separate workflow engine.
- **Required behavior**: Custom tools only; deny-by-default project resources; fresh role/model/provider sessions; bridge failure before work; real policy-admitted tool execution or deterministic denial; artifacts/validators authoritative over SQLite.
- **Sibling boundary**: US-0151 owns executable lifecycle and transport; US-0152 app/browser UAT; US-0153 parallel/release; US-0154 CI operator-path proof. Do not reopen US-0133..US-0140 package contracts, mutate US-0149/BUG-0026, or plan phase-9 deferrals.
- **Research**: Allocate `R-0150`; decide composition lifetime/cleanup, typed dependency graph, real Pi SDK test-session fixture, and unavailable-service reason-code matrix. **Next**: `/research` in a fresh tech-lead context. STOP.

## Discovery handoff — BUG-0024 OpenCode CLI TUI live `/auto` dispatch after Axis A

- **Phase completed**: discovery. **Role**: po. **Bug**: BUG-0024 only. **Sprint**: (pending — expected **S0159** at `/sprint-plan`; S0158 occupied). **Verdict**: PASS (`decision_gate=false`).
- **Timestamp (UTC)**: 2026-09-21T19:32:00Z. **Fresh marker**: `po-BUG0024-discovery-20260921T193200Z-fresh`.
- **Orchestrator**: `orchestrator_run_id=auto-20260921-bug0024`, parent=`cursor-20260913-BUG0024-intake`, `delivery_mode=ultra_lean`, resolved_phase_plan=`[spec, plan, build+verify, ship]`, reinstatement_mode=`none`, memory_layer=`pack`, macro=`spec` (intake already DONE — not re-intaken; `handoffs/intake_evidence/BUG-0024-intake-20260914T035000Z.json` held read-only), `model_id=inherit` (MODEL_RESOLVE=alias_only; CROSS_MODEL_REVIEW=0), AUTO_QUIET=1, AUTO_FLOW_MODE=full_autonomy, AUTO_SOVEREIGN=0, FRAMEWORK_KIT_REPO=1, EARLY_RESEARCH=0 (R-0140 intake stub held), segment_work_item_kind=`bug`, active_bug_id=`BUG-0024`, bug_queue_position=`1 of 1`, bug_queue_active=`true`, backlog_drain_active=`false`.
- **Sibling boundary**: **BUG-0023 DONE** / S0148 / Axis A — compose only; do **not** reopen ACs. **BUG-0021 DONE** — listing limb held; do not reopen. **BUG-0022 OPEN** — do not merge/drain. **BUG-0027 OPEN** — manual phase persistence distinct; compose only. Do **not** restore `.opencode/commands/auto.md`. Do **not** JSON-template `/auto`. Do **not** treat Cursor-only as done. Do **not** mutate US-0133..US-0150 as new scope. No npm-publish, git push, or `.env` reads this phase.
- **Gap confirmed (narrow-read)**: Axis A files present (`rpc.ts`, `tui.ts` `{ id, tui }` + `dispatchRunAutoLifecycle`, orchestrator `ctx.rpc.register` + `editor.add`, `tui.json`, `auto.md` absent). Live listed `/auto` still toasts `OPENCODE_AUTO_TUI_DISPATCH_UNSUPPORTED`; `run()` only passes `{ api, client: api?.client }`; register skipped when `ctx.rpc` absent; RPC errors swallowed → same toast. Exact H1–H5 winner = `/research`.

### Discovery locks D1–D10

| ID | Lock |
|----|------|
| **D1** | Live listed `/auto` must start `runAutoLifecycle` (DISPATCH toast is not the happy path). |
| **D2** | Root miss = live dispatch after Axis A files — not listing (BUG-0021 DONE); not “files present” alone (BUG-0023 DONE held). |
| **D3** | Keep `{ id, tui }` listing + `editor.add` execute; do **not** restore STOP-only `.opencode/commands/auto.md`. |
| **D4** | Do **not** JSON-template `/auto` (`commands.auto` + `template`). |
| **D5** | Do **not** reopen BUG-0023 ACs / S0148 / DONE; do **not** reopen BUG-0021. |
| **D6** | Do **not** merge/drain BUG-0022 OPEN; distinct from BUG-0027 (manual phase persistence). |
| **D7** | Cursor IDE `/auto` = working path until fix — **not** done; not OpenCode `--auto`; not LLM Auto mode. |
| **D8** | Additive `test_bug0024_*` must catch this live miss (not mock-only if that closed BUG-0023); CI `UAT_PROBE_FORBIDDEN` default unless architecture invents better non-live contract; keep bug0023/0021/0020/0019/0018 compose. |
| **D9** | Consumer upgrade overwrites live dispatch path + still prunes leftover `auto.md`; active↔template parity. |
| **D10** | OUT: mutate US-0133..US-0150 as new scope; companion DEC (none expected — `# BUG-0024` only). Research stub **R-0140** (PO does not author/wipe/renumber; TL locks DQ on R-0140). Expected sprint **S0159**. |

### Research questions DQ1–DQ10 (for `/research` → lock **R-0140**; stub only here)

1. **DQ1**: Live TUI `tui(api)` — does `api.client` exist on CLI TUI host? If not, what host-true client wiring replaces `{ api, client: api?.client }`?
2. **DQ2**: Does `api.client.rpc(Defined)` exist on the file-plugin shape, or only on `Plugin.define({ setup })` `context.client.rpc` (public docs mismatch)?
3. **DQ3**: Is local `Rpc.define` fallback host-true enough for `client.rpc(Defined)` to return `runAutoLifecycle`, or must peer `@opencode/plugin/rpc` brand?
4. **DQ4**: Does orchestrator `await ctx.rpc.register(ITS_MAGIC_AUTO_RPC, …)` actually run in CLI TUI host, or is `ctx.rpc` absent (skip path)?
5. **DQ5**: When is `OpenCode.make({ baseUrl })` reachable — `resolveClientBaseUrl` sources; never silent `localhost:4096`.
6. **DQ6**: Should swallowed RPC try/catch surface distinct `OPENCODE_*` vs reuse DISPATCH until live path works?
7. **DQ7**: Winning approach family — fix client pass-through vs register timing vs Defined branding vs HTTP fallback vs hybrid (architecture picks A*).
8. **DQ8**: Test contract — which `test_bug0024_*` would have failed BUG-0023 mock-only suite on this live miss; keep `UAT_PROBE_FORBIDDEN` default?
9. **DQ9**: Upgrade / consumer overwrite of live dispatch path + leftover `auto.md` prune; active↔template parity surfaces.
10. **DQ10**: Architecture anchor — additive `# BUG-0024` only (no companion DEC); **R-id**: lock **R-0140** in place (do not wipe R-0136/R-0137/R-0134/R-0124/R-0140+); expected sprint **S0159**.

### Design refs

- `.opencode/plugins/its-magic-auto/{rpc.ts,tui.ts}`; `.opencode/plugins/orchestrator.ts` register + `editor.add`; `.opencode/tui.json`
- Compose: R-0137 / R-0136 (BUG-0023 Axis A — do not wipe); R-0134 (BUG-0021); R-0124 (DISPATCH token); BUG-0018 A* (no `auto.md` restore)
- Intake (read-only): `handoffs/intake_evidence/BUG-0024-intake-20260914T035000Z.json`
- Live-fetch seeds (intake): OpenCode v2 RPC docs + Context7 TUI `api.client` / `context.client.rpc` mismatch

### Research stub (PO does not author `docs/engineering/research.md`)

- **Expected research lock**: **R-0140** (intake EARLY_RESEARCH stub already present).
- Do **not** author, wipe, or renumber `## R-0140` this phase. Do **not** wipe R-0136 / R-0137 / R-0134 / R-0124 / R-0140+.
- Companion DEC: **none expected** — `# BUG-0024` at `/architecture` only — PO does not author them.
- Expected sprint **S0159** at `/sprint-plan` only (do not create this phase; S0158 occupied).

### Runtime proof (DEC-0038)

- `runtime_proof_id=rp-auto-20260921-bug0024-discovery-po-20260921T193200Z-BUG-0024`
- `proof_hash=0772F0DA79960D0D5045CE994F7973E8F968B9DA95F2C030EE6979A5838A8BE4`
- `proof_ttl=2026-09-21T20:32:00Z`
- Hash via `from scripts.token_cost_lib import compute_strict_proof_hash` (positional; compact sorted-key JSON).
- Canonical hashed payload: `{"orchestrator_run_id":"auto-20260921-bug0024","phase_id":"discovery","proof_issued_at":"2026-09-21T19:32:00Z","proof_ttl_seconds":3600,"role":"po","runtime_proof_id":"rp-auto-20260921-bug0024-discovery-po-20260921T193200Z-BUG-0024"}`
- Isolation extras (not hashed): `delivery_mode=ultra_lean`, `macro_phase=spec`, `model_id=inherit`, `sprint_id=none`, `bug_id=BUG-0024`, `skipped_phases=[intake]`, `CROSS_MODEL_REVIEW=0`, `native_chain_active=true`, `native_chain_continuing=true`, `segment_work_item_kind=bug`
- `hash_recompute_confirmation=true` (compute_strict_proof_hash → 0772F0DA79960D0D5045CE994F7973E8F968B9DA95F2C030EE6979A5838A8BE4 MATCH; **64 hex** verified; stored uppercase)

### Isolation + stop

- `phase_id=discovery`, `role=po`, `bug_id=BUG-0024`, `model_id=inherit`, `fresh_context_marker=po-BUG0024-discovery-20260921T193200Z-fresh`
- `evidence_ref=docs/product/backlog.md ### BUG-0024 discovery_notes; docs/product/vision.md ## Discovery Notes — BUG-0024; this handoff; docs/engineering/state.md discovery checkpoint; handoffs/resume_brief.md; handoffs/intake_evidence/BUG-0024-intake-20260914T035000Z.json (read-only); docs/engineering/research.md ## R-0140 (read-only stub)`
- **Hot-surface note**: Pre-discovery `--check` flagged `po_to_tl` oversize → `--rollover --json` archived `handoffs/archive/po-to-tl-pack-20260921.md` (moved=1; retained_lines=639). Discovery handoff **appended** (newest at end) so oldest-prefix rollover retains it. Post-append triad `--check` required.
- **Status**: BUG-0024 remains **OPEN**. AC-1..AC-8 remain unchecked. Acceptance.md BUG-0024 row unchecked. **Next**: `/research` in fresh **tech-lead** subagent. CROSS_MODEL_REVIEW=0 — do not spawn sovereign-critic. Do not spawn research from this discovery chat. STOP.

## Research handoff — BUG-0024 OpenCode CLI TUI live `/auto` dispatch after Axis A

- **Phase completed**: research. **Role**: tech-lead. **Bug**: BUG-0024 only. **Sprint**: (pending — expected **S0159** at `/sprint-plan`; S0158 occupied). **Verdict**: PASS (`decision_gate=false`).
- **Timestamp (UTC)**: 2026-09-21T19:37:00Z. **Fresh marker**: `tl-BUG0024-research-20260921T193700Z-fresh`.
- **Orchestrator**: `orchestrator_run_id=auto-20260921-bug0024`, parent=`cursor-20260913-BUG0024-intake`, `delivery_mode=ultra_lean`, resolved_phase_plan=`[spec, plan, build+verify, ship]`, macro=`plan` (research = first of research+architecture+sprint-plan), `model_id=inherit` (MODEL_RESOLVE=alias_only; CROSS_MODEL_REVIEW=0), AUTO_QUIET=1, AUTO_FLOW_MODE=full_autonomy, AUTO_SOVEREIGN=0, FRAMEWORK_KIT_REPO=1, EARLY_RESEARCH=0, segment_work_item_kind=`bug`, active_bug_id=`BUG-0024`, bug_queue_position=`1 of 1`.
- **Sibling boundary**: **BUG-0023 DONE** / S0148 / Axis A — compose only; do **not** reopen ACs. **BUG-0021 DONE** — listing limb held. **BUG-0022 OPEN** — do not merge/drain. **BUG-0027 OPEN** — compose only. Do **not** restore `.opencode/commands/auto.md`. Do **not** JSON-template `/auto`. Do **not** treat Cursor-only as done. Do **not** mutate US-0133..US-0150 as new scope. No npm-publish, git push, or `.env` reads this phase.
- **Research anchor**: `docs/engineering/research.md` **`## R-0140`** (locked in place; do not wipe R-0136/R-0137/R-0134/R-0124). Discovery D1–D10 unchanged on backlog.
- **Approach**: **A1 (A\*) Hybrid residual live-dispatch** — keep `{ id, tui }` + `editor.add` + Axis A `client.rpc(Defined)` / `OpenCode.make({ baseUrl }).rpc(Defined)`; require peer-branded `@opencode/plugin/rpc` for TUI success (local identity-define load-safe only); stage-distinct `OPENCODE_*` (missing-client / rpc-absent / Defined-unbranded / register-skipped / make-unreachable); DISPATCH umbrella only when limbs exhausted; never silent `localhost:4096`. No companion DEC.
- **Companion DEC**: **none** — `# BUG-0024` at `/architecture` only — do **not** author `decisions/DEC-*` or `# BUG-0024` this phase.

### Closed questions DQ1–DQ10

| DQ | Topic | Resolution | LOCK |
|----|-------|------------|------|
| DQ1 | Live `tui(api)` client | Primary `api.client` (spec); missing-client distinct code | LOCKED |
| DQ2 | `api.client.rpc(Defined)` | Happy path when `.rpc` present; else OpenCode.make; no invented POST | LOCKED |
| DQ3 | Local vs peer Defined | Peer brand required for TUI success; local define load-safe only | LOCKED |
| DQ4 | `ctx.rpc.register` | Await when present; register-skipped observable when absent; keep editor.add | LOCKED |
| DQ5 | OpenCode.make baseUrl | resolveClientBaseUrl only; never silent localhost:4096 | LOCKED |
| DQ6 | Swallowed catch | Stage-distinct codes; DISPATCH umbrella only | LOCKED |
| DQ7 | Approach family | **A1 Hybrid residual** WINNER | LOCKED |
| DQ8 | Tests | 6–8 `test_bug0024_*`; UAT_PROBE_FORBIDDEN default; compose 0023..0018 | LOCKED |
| DQ9 | Upgrade / parity | Overwrite dispatch path + prune auto.md; active↔template | LOCKED |
| DQ10 | Arch / R-id / sprint | `# BUG-0024` only; **R-0140**; **S0159**; no companion DEC | LOCKED |

### Architecture seeds (preview)

- `/architecture` authors `# BUG-0024` only (no companion DEC); pins A1 limb order, reason-code tokens, test IDs, upgrade/parity, residual H1–H5 acceptance.
- `/sprint-plan` materializes **S0159** (≤12 tasks from architecture seeds).
- Do not implement application code this phase.

### Runtime proof (DEC-0038)

- `runtime_proof_id=rp-auto-20260921-bug0024-research-techlead-20260921T193700Z-BUG-0024`
- `proof_hash=57F066B720A65F5BEE9E380EFB68F7CF1ADBACC9CDDEEEE6395B808D5F91A826`
- `proof_ttl=2026-09-21T20:37:00Z`
- Hash via `from scripts.token_cost_lib import compute_strict_proof_hash` (positional; compact sorted-key JSON).
- Canonical hashed payload: `{"orchestrator_run_id":"auto-20260921-bug0024","phase_id":"research","proof_issued_at":"2026-09-21T19:37:00Z","proof_ttl_seconds":3600,"role":"tech-lead","runtime_proof_id":"rp-auto-20260921-bug0024-research-techlead-20260921T193700Z-BUG-0024"}`
- Isolation extras (not hashed): `delivery_mode=ultra_lean`, `macro_phase=plan`, `model_id=inherit`, `sprint_id=none`, `bug_id=BUG-0024`, `skipped_phases=[intake]`, `CROSS_MODEL_REVIEW=0`, `native_chain_active=true`, `native_chain_continuing=true`, `segment_work_item_kind=bug`
- `hash_recompute_confirmation=true` (compute_strict_proof_hash → 57F066B720A65F5BEE9E380EFB68F7CF1ADBACC9CDDEEEE6395B808D5F91A826 MATCH; **64 hex** verified; stored uppercase)
- Consumed discovery producer proof: `rp-auto-20260921-bug0024-discovery-po-20260921T193200Z-BUG-0024` / `0772F0DA79960D0D5045CE994F7973E8F968B9DA95F2C030EE6979A5838A8BE4` — MATCH; not STALE at `2026-09-21T19:37:00Z`

### Isolation + stop

- `phase_id=research`, `role=tech-lead`, `bug_id=BUG-0024`, `model_id=inherit`, `fresh_context_marker=tl-BUG0024-research-20260921T193700Z-fresh`
- `evidence_ref=docs/engineering/research.md ## R-0140; docs/product/backlog.md ### BUG-0024 research_notes; this handoff; docs/engineering/state.md research checkpoint; handoffs/resume_brief.md`
- **Hot-surface note**: Appended (not prepended) so triad oldest-prefix rollover retains this newest section. Post-append triad `--check` / `--rollover` as needed.
- **Status**: BUG-0024 remains **OPEN**. AC-1..AC-8 remain unchecked. **Next**: `/architecture` in fresh **tech-lead** subagent. CROSS_MODEL_REVIEW=0 — do not spawn sovereign-critic. Do not spawn architecture from this research chat. STOP.

## Discovery handoff — BUG-0027 OpenCode manual phase commands cannot persist canonical workflow evidence

- **Phase completed**: discovery. **Role**: po. **Bug**: BUG-0027 only. **Sprint**: (pending — expected **S0160** at `/sprint-plan`; S0159 occupied by BUG-0024 DONE). **Verdict**: PASS (`decision_gate=false`).
- **Timestamp (UTC)**: 2026-09-21T21:08:00Z. **Fresh marker**: `po-BUG0027-discovery-20260921T210800Z-fresh`.
- **Orchestrator**: `orchestrator_run_id=auto-20260921-bug0027`, parent=`ir-20260921T190544Z-bug0027`, `delivery_mode=ultra_lean`, resolved_phase_plan=`[spec, plan, build+verify, ship]`, reinstatement_mode=`none`, memory_layer=`pack`, macro=`spec` (intake already DONE — not re-intaken; `handoffs/intake_evidence/BUG-0027-intake-20260921T190544Z.json` held read-only), `model_id=inherit` (MODEL_RESOLVE=alias_only; CROSS_MODEL_REVIEW=0), AUTO_QUIET=1, AUTO_FLOW_MODE=full_autonomy, AUTO_SOVEREIGN=0, FRAMEWORK_KIT_REPO=1, EARLY_RESEARCH=0 (R-0151 stub only — PO does not author), segment_work_item_kind=`bug`, active_bug_id=`BUG-0027`, bug_queue_position=`1 of 1`, bug_queue_active=`true`, backlog_drain_active=`false`.
- **Sibling boundary**: **BUG-0024 DONE** / S0159 — compose only; do **not** reopen ACs; `/auto` CLI/TUI dispatch remains BUG-0024; this bug does **not** claim toast repair. **BUG-0022 OPEN** / **BUG-0026 OPEN** — do not merge/drain. **BUG-0016 DONE** — compose permission matrix only; do not reopen. **US-0150 OPEN** — compose/link only; do not mutate as this bug's implementation. No npm-publish, git push, or `.env` reads this phase.
- **Gap confirmed (narrow-read)**: `runAutoLifecycleRpc` drops `storyId`/`sprintId`/`orchestratorRunId` and defaults `orchestratorSessionId` to `tui-auto`; `IsolationEvidence` + `persistIsolationViaPython` omit those IDs; `command.executed` only handles `name === "auto"` (manual command.md never persists isolation); OpenCode agents deny required writes (dev: no `state.md` / `summary.md`; QA: no `state.md`); `.opencode/commands/{intake,execute,discovery}.md` + template mirrors invoke `intake_evidence_validate.py --repo . --enforce` (exit 2; script only `--file`/`--stdin`/`--self-test`); no S0158 execute checkpoint in `state.md`.

### Discovery locks D1–D10

| ID | Lock |
|----|------|
| **D1** | Direct `/intake` `/execute` `/qa` `/verify-work` persist canonical artifacts + linked isolation, or fail closed with a precise reason before claiming success. |
| **D2** | Root miss = missing run context + persist path not invoked for manual commands + `tui-auto` placeholder cannot satisfy release evidence. |
| **D3** | Permission matrix must grant phase-required writes or fail before work; compose BUG-0016 — do not reopen. |
| **D4** | `/auto` remains BUG-0024 DONE; do not reopen ACs/S0159; do not claim toast repair. |
| **D5** | Remove invalid `--repo . --enforce` from active and template command packs; use `--file`/`--stdin`/`--self-test`. |
| **D6** | Do not merge/drain BUG-0022 OPEN or BUG-0026 OPEN; US-0150 compose/link only. |
| **D7** | Do not fabricate strict-proof tuples when orchestrator is unavailable. |
| **D8** | Contract tests: direct manual phase, denied-persistence failure, context propagation, validator invocation, active/template parity. |
| **D9** | Compose US-0121/0122/0124/0125/0126; execute.md must not require intake validator for non-intake phases (research/architecture lock shape). |
| **D10** | OUT companion DEC (`# BUG-0027` only). Research stub **R-0151** (do not author/wipe/reuse R-0150). Expected sprint **S0160**. |

### Research questions DQ1–DQ10 (for `/research` → author **R-0151**; stub only here)

1. **DQ1**: How should manual phase commands obtain parent session + `storyId`/`sprintId`/`orchestratorRunId` without going through `/auto`?
2. **DQ2**: Extend `IsolationEvidence` + `persistIsolationViaPython`, or add a distinct manual-phase persist path?
3. **DQ3**: Permission-matrix widening vs fail-closed-before-work — which is A*?
4. **DQ4**: Validator CLI — add `--repo --enforce` vs rewrite command packs to supported `--file`/`--stdin`?
5. **DQ5**: `execute.md` (and discovery) incorrectly requiring intake_evidence_validate — drop vs phase-specific validator?
6. **DQ6**: Reject `tui-auto` as `parentID`, as `orchestratorRunId`, or both for release evidence?
7. **DQ7**: Winning approach family — context-propagation + persist hook vs permission widening vs hybrid (architecture picks A*).
8. **DQ8**: Test contract — which `test_bug0027_*` cover AC-1..AC-6 (manual phase, denied persist, context, validator, parity)?
9. **DQ9**: Active `.opencode/commands/` vs `template/.opencode/commands/` vs Cursor `.cursor/commands/` surfaces.
10. **DQ10**: Architecture anchor — additive `# BUG-0027` only (no companion DEC); **R-id**: author **R-0151** (do not wipe/reuse **R-0150**); expected sprint **S0160**.

### Design refs

- `.opencode/plugins/orchestrator.ts` `runAutoLifecycleRpc`, `persistIsolationViaPython`, `IsolationEvidence`, `command.executed`
- `.opencode/commands/{intake,execute,discovery}.md` + `template/.opencode/commands/` mirrors
- `.opencode/agents/{po,dev,qa}.md` (compose BUG-0016)
- `scripts/intake_evidence_validate.py` (`--file`/`--stdin`/`--self-test` only)
- Intake (read-only): `handoffs/intake_evidence/BUG-0027-intake-20260921T190544Z.json`

### Research stub (PO does not author `docs/engineering/research.md`)

- **Expected research lock**: **R-0151** (highest existing **R-0150** US-0150 — do not wipe/reuse).
- Do **not** author, wipe, or renumber `## R-0151` this phase. Do **not** wipe R-0150.
- Companion DEC: **none expected** — `# BUG-0027` at `/architecture` only — PO does not author them.
- Expected sprint **S0160** at `/sprint-plan` only (do not create this phase; S0159 occupied by BUG-0024 DONE).

### Runtime proof (DEC-0038)

- `runtime_proof_id=rp-auto-20260921-bug0027-discovery-po-20260921T210800Z-BUG-0027`
- `proof_hash=89A067227D7A3E3A1656FEA163F9F91FFB91231112EF23946096783B7763F9F7`
- `proof_ttl=2026-09-21T22:08:00Z`
- Hash via `from scripts.token_cost_lib import compute_strict_proof_hash` (positional; compact sorted-key JSON).
- Canonical hashed payload: `{"orchestrator_run_id":"auto-20260921-bug0027","phase_id":"discovery","proof_issued_at":"2026-09-21T21:08:00Z","proof_ttl_seconds":3600,"role":"po","runtime_proof_id":"rp-auto-20260921-bug0027-discovery-po-20260921T210800Z-BUG-0027"}`
- Isolation extras (not hashed): `delivery_mode=ultra_lean`, `macro_phase=spec`, `model_id=inherit`, `sprint_id=none`, `bug_id=BUG-0027`, `skipped_phases=[intake]`, `CROSS_MODEL_REVIEW=0`, `native_chain_active=true`, `native_chain_continuing=true`, `segment_work_item_kind=bug`
- `hash_recompute_confirmation=true` (compute_strict_proof_hash → 89A067227D7A3E3A1656FEA163F9F91FFB91231112EF23946096783B7763F9F7 MATCH; **64 hex** verified; stored uppercase)

### Isolation + stop

- `phase_id=discovery`, `role=po`, `bug_id=BUG-0027`, `model_id=inherit`, `fresh_context_marker=po-BUG0027-discovery-20260921T210800Z-fresh`
- `evidence_ref=docs/product/backlog.md ### BUG-0027 discovery_notes; docs/product/vision.md ## Discovery Notes — BUG-0027; this handoff; docs/engineering/state.md discovery checkpoint; handoffs/resume_brief.md; handoffs/intake_evidence/BUG-0027-intake-20260921T190544Z.json (read-only)`
- **Hot-surface note**: Discovery handoff **appended** (newest at end) so oldest-prefix rollover retains it (DEC-0054). Post-append `--check` STATE_ARCHIVE_REQUIRED (po_to_tl 717/650; state 1273/1200) → `--rollover --json` moved po_to_tl=2 pack_ref=`handoffs/archive/po-to-tl-pack-20260921-c.md` (retained_lines=638); state moved=2 pack_ref=`docs/engineering/state-archive/state-pack-20260921-i.md`; architecture not rolled; final `--check` PASS.
- **Status**: BUG-0027 remains **OPEN**. AC-1..AC-6 remain unchecked. Acceptance.md BUG-0027 row unchecked. **Next**: `/research` in fresh **tech-lead** subagent. CROSS_MODEL_REVIEW=0 — do not spawn sovereign-critic. Do not spawn research from this discovery chat. STOP.

## Research handoff — BUG-0027 OpenCode manual phase commands cannot persist canonical workflow evidence

- **Phase completed**: research. **Role**: tech-lead. **Bug**: BUG-0027 only. **Sprint**: (pending — expected **S0160** at `/sprint-plan`; S0159 occupied by BUG-0024 DONE). **Verdict**: PASS (`decision_gate=false`).
- **Timestamp (UTC)**: 2026-09-21T21:15:00Z. **Fresh marker**: `tl-BUG0027-research-20260921T211500Z-fresh`.
- **Orchestrator**: `orchestrator_run_id=auto-20260921-bug0027`, parent=`ir-20260921T190544Z-bug0027`, `delivery_mode=ultra_lean`, resolved_phase_plan=`[spec, plan, build+verify, ship]`, reinstatement_mode=`none`, memory_layer=`pack`, macro=`plan`, `model_id=inherit` (MODEL_RESOLVE=alias_only; CROSS_MODEL_REVIEW=0), AUTO_QUIET=1, AUTO_FLOW_MODE=full_autonomy, AUTO_SOVEREIGN=0, FRAMEWORK_KIT_REPO=1, EARLY_RESEARCH=0, segment_work_item_kind=`bug`, active_bug_id=`BUG-0027`, bug_queue_position=`1 of 1`, bug_queue_active=`true`, backlog_drain_active=`false`.
- **Sibling boundary**: **BUG-0024 DONE** / S0159 — compose only; do **not** reopen ACs; do **not** claim CLI/TUI `/auto` toast repair. **BUG-0022 OPEN** / **BUG-0026 OPEN** — do not merge/drain. **BUG-0016 DONE** — compose permission matrix only; do not reopen. **US-0150 OPEN** — compose/link only. **R-0150** / **R-0140** held — do not wipe. No npm-publish, git push, or `.env` reads this phase.
- **Winning approach**: **A1 (A*) Hybrid manual-phase persist** — extend IsolationEvidence + persistIsolationViaPython with real story/sprint/run IDs; thin manual-phase persist helper (not runAutoLifecycle drain); carry parent sessionID from command.executed/RPC; reject `tui-auto` for release evidence; targeted permission-matrix widen plus fail-closed-before-work; rewrite command packs to supported validator CLI; no fabricated proofs.

### DQ1–DQ10 LOCKED (from discovery D1–D10)

| ID | Lock |
|----|------|
| **DQ1** | Parent `sessionID` from `command.executed`/RPC; story/sprint/run from args or resume_brief bridge; never default `tui-auto`; do not route manual phases through `runAutoLifecycle` |
| **DQ2** | Extend IsolationEvidence + persistIsolationViaPython (one Python SOT); reject second persist store; thin `persistManualPhaseIsolation` invoker |
| **DQ3** | Hybrid: targeted glob widen (dev: state.md + summary.md; qa: state.md) **plus** fail-closed-before-work; compose BUG-0016 deny-last |
| **DQ4** | Rewrite packs to `--file`/`--stdin`/`--self-test`; do **not** add `--repo --enforce` to the Python CLI; compose-amend US-0125 fixture |
| **DQ5** | Drop intake validator from execute.md / discovery.md; keep it on intake.md only; qa/verify-work keep valid `bug_issue_validate.py --repo . --check-acceptance` |
| **DQ6** | Reject `tui-auto` as **both** parentID and orchestratorRunId for release evidence |
| **DQ7** | **A1 (A*) Hybrid manual-phase persist** WINNER |
| **DQ8** | 8–10 `test_bug0027_*` (manual persist, denied persist, RPC IDs, tui-auto reject, no fabricated proof, toast not claimed, validator CLI, non-intake drop, parity, permission globs) |
| **DQ9** | Active+template `.opencode/commands|agents|plugins` + `opencode_auto_bridge.py`; Cursor `.cursor/commands/` OUT of rewrite |
| **DQ10** | `# BUG-0027` only; **R-0151**; **S0160**; no companion DEC |

### Architecture seeds (preview)

- `/architecture` authors `# BUG-0027` only (no companion DEC); pins A1 helper names, IsolationEvidence fields, reason-code tokens, permission globs, command-pack prose, test IDs, US-0125 compose-amend, upgrade/parity.
- `/sprint-plan` materializes **S0160** (≤12 tasks from architecture seeds).
- Do not implement application code this phase.

### Runtime proof (DEC-0038)

- `runtime_proof_id=rp-auto-20260921-bug0027-research-techlead-20260921T211500Z-BUG-0027`
- `proof_hash=F89D067B09A413B1AC41D5B7811EBAC8BC4CA4D6FCD7264BC2BFD7C3BFCD8782`
- `proof_ttl=2026-09-21T22:15:00Z`
- Hash via `from scripts.token_cost_lib import compute_strict_proof_hash` (positional; compact sorted-key JSON).
- Canonical hashed payload: `{"orchestrator_run_id":"auto-20260921-bug0027","phase_id":"research","proof_issued_at":"2026-09-21T21:15:00Z","proof_ttl_seconds":3600,"role":"tech-lead","runtime_proof_id":"rp-auto-20260921-bug0027-research-techlead-20260921T211500Z-BUG-0027"}`
- Isolation extras (not hashed): `delivery_mode=ultra_lean`, `macro_phase=plan`, `model_id=inherit`, `sprint_id=none`, `bug_id=BUG-0027`, `skipped_phases=[intake]`, `CROSS_MODEL_REVIEW=0`, `native_chain_active=true`, `native_chain_continuing=true`, `segment_work_item_kind=bug`
- `hash_recompute_confirmation=true` (compute_strict_proof_hash → F89D067B09A413B1AC41D5B7811EBAC8BC4CA4D6FCD7264BC2BFD7C3BFCD8782 MATCH; **64 hex** verified; stored uppercase)
- Consumed discovery producer proof: `rp-auto-20260921-bug0027-discovery-po-20260921T210800Z-BUG-0027` / `89A067227D7A3E3A1656FEA163F9F91FFB91231112EF23946096783B7763F9F7` — MATCH; not STALE at `2026-09-21T21:15:00Z`

### Isolation + stop

- `phase_id=research`, `role=tech-lead`, `bug_id=BUG-0027`, `model_id=inherit`, `fresh_context_marker=tl-BUG0027-research-20260921T211500Z-fresh`
- `evidence_ref=docs/engineering/research.md ## R-0151; docs/product/backlog.md ### BUG-0027 research_notes; this handoff; docs/engineering/state.md research checkpoint; handoffs/resume_brief.md`
- **Hot-surface note**: Research handoff **appended** (newest at end) so oldest-prefix rollover retains it (DEC-0054). Post-append `--check` STATE_ARCHIVE_REQUIRED (state 1245/1200; po_to_tl 686/650) → `--rollover --json` moved state=1 pack_ref=`docs/engineering/state-archive/state-pack-20260921-j.md` (retained_lines=1179); po_to_tl moved=2 pack_ref=`handoffs/archive/po-to-tl-pack-20260921-d.md` (retained_lines=598); architecture not rolled; final `--check` PASS.
- **Status**: BUG-0027 remains **OPEN**. AC-1..AC-6 remain unchecked. **Next**: `/architecture` in fresh **tech-lead** subagent. CROSS_MODEL_REVIEW=0 — do not spawn sovereign-critic. Do not spawn architecture from this research chat. STOP.

## Architecture handoff — BUG-0027 OpenCode manual phase commands cannot persist canonical workflow evidence

- **Phase completed**: architecture. **Role**: tech-lead. **Bug**: BUG-0027 only. **Sprint**: (pending — expected **S0160** at `/sprint-plan`; S0159 occupied by BUG-0024 DONE). **Verdict**: PASS (`decision_gate=false`).
- **Timestamp (UTC)**: 2026-09-21T21:22:00Z. **Fresh marker**: `tl-BUG0027-architecture-20260921T212200Z-fresh`.
- **Orchestrator**: `orchestrator_run_id=auto-20260921-bug0027`, parent=`ir-20260921T190544Z-bug0027`, `delivery_mode=ultra_lean`, resolved_phase_plan=`[spec, plan, build+verify, ship]`, reinstatement_mode=`none`, memory_layer=`pack`, macro=`plan`, `model_id=inherit` (MODEL_RESOLVE=alias_only; CROSS_MODEL_REVIEW=0), AUTO_QUIET=1, AUTO_FLOW_MODE=full_autonomy, AUTO_SOVEREIGN=0, FRAMEWORK_KIT_REPO=1, EARLY_RESEARCH=0, segment_work_item_kind=`bug`, active_bug_id=`BUG-0027`, bug_queue_position=`1 of 1`, bug_queue_active=`true`, backlog_drain_active=`false`.
- **Sibling boundary**: **BUG-0024 DONE** / S0159 — compose only; do **not** reopen ACs; do **not** claim CLI/TUI `/auto` toast repair. **BUG-0022 OPEN** / **BUG-0026 OPEN** — do not merge/drain. **BUG-0016 DONE** — compose permission matrix only; do not reopen. **US-0150 OPEN** — compose/link only. **R-0150** / **R-0140** held — do not wipe. No npm-publish, git push, or `.env` reads this phase.
- **Winning approach**: **A1 (A*) Hybrid manual-phase persist** LOCKED in `# BUG-0027`. Companion DEC: **none**. `decisions.md` unchanged.

### A1 lock summary

- IsolationEvidence + `persistIsolationViaPython` + `--append-isolation` identity fields: `storyId` / `sprintId` / `orchestratorRunId` / `bugId`.
- Thin **`persistManualPhaseIsolation`** invoker (not `runAutoLifecycle` drain). `MANUAL_PHASE_COMMAND_NAMES` closed set.
- Parent `sessionID` from `command.executed` / RPC; reject `tui-auto` (`OPENCODE_PLACEHOLDER_PARENT_REJECTED`).
- Targeted glob widen: **dev** `docs/engineering/state.md` + `sprints/S*/summary.md`; **qa** `docs/engineering/state.md`; deny-last held.
- Fail-closed tokens: `OPENCODE_MANUAL_PHASE_WRITE_DENIED` / `PERSIST_DENIED` / `PERSIST_NOT_INVOKED` / `CONTEXT_MISSING`.
- Command packs: `--file` / `--stdin` / `--self-test`; drop intake validator from execute.md / discovery.md.
- Ten `test_bug0027_*`. Seeds **T-anch + T-001..T-007** (8) for **S0160**.

### Sprint-plan seeds (do not materialize this phase)

- `/sprint-plan` materializes **S0160** (8 tasks, ≤12). Do not implement application code this phase. Do not create `sprints/S0160/` from architecture.

### Runtime proof (DEC-0038)

- `runtime_proof_id=rp-auto-20260921-bug0027-architecture-techlead-20260921T212200Z-BUG-0027`
- `proof_hash=766B032B5B6FEBFCC6524E30F4A94DEED4EFBCE14AB73F56D2DCBF893FEFE489`
- `proof_ttl=2026-09-21T22:22:00Z`
- Hash via `from scripts.token_cost_lib import compute_strict_proof_hash` (positional; compact sorted-key JSON).
- Canonical hashed payload: `{"orchestrator_run_id":"auto-20260921-bug0027","phase_id":"architecture","proof_issued_at":"2026-09-21T21:22:00Z","proof_ttl_seconds":3600,"role":"tech-lead","runtime_proof_id":"rp-auto-20260921-bug0027-architecture-techlead-20260921T212200Z-BUG-0027"}`
- Isolation extras (not hashed): `delivery_mode=ultra_lean`, `macro_phase=plan`, `model_id=inherit`, `sprint_id=none`, `bug_id=BUG-0027`, `skipped_phases=[intake]`, `CROSS_MODEL_REVIEW=0`, `native_chain_active=true`, `native_chain_continuing=true`, `segment_work_item_kind=bug`
- `hash_recompute_confirmation=true` (compute_strict_proof_hash → 766B032B5B6FEBFCC6524E30F4A94DEED4EFBCE14AB73F56D2DCBF893FEFE489 MATCH; **64 hex** verified; stored uppercase)
- Consumed research producer proof: `rp-auto-20260921-bug0027-research-techlead-20260921T211500Z-BUG-0027` / `F89D067B09A413B1AC41D5B7811EBAC8BC4CA4D6FCD7264BC2BFD7C3BFCD8782` — MATCH; not STALE at `2026-09-21T21:22:00Z`

### Isolation + stop

- `phase_id=architecture`, `role=tech-lead`, `bug_id=BUG-0027`, `model_id=inherit`, `fresh_context_marker=tl-BUG0027-architecture-20260921T212200Z-fresh`
- `evidence_ref=docs/engineering/architecture.md # BUG-0027; docs/engineering/research.md ## R-0151; docs/product/backlog.md ### BUG-0027 architecture_notes; this handoff; docs/engineering/state.md architecture checkpoint; handoffs/resume_brief.md`
- **Hot-surface note**: Architecture handoff **appended** (newest at end) so oldest-prefix rollover retains it (DEC-0054). Post-append `--check` STATE_ARCHIVE_REQUIRED (state 1272/1200; architecture 3081/3000) → `--rollover --json` moved state=2 pack_ref=`docs/engineering/state-archive/state-pack-20260921-k.md` (retained_lines=1091); architecture moved=1 pack_ref=`docs/engineering/architecture-archive/architecture-pack-20260921-a.md` (retained_lines=2860); po_to_tl not rolled; heading policy PASS `baseline_h2_count=0`; `[CODEBASE_MAP_OK] preserved_existing`; final `--check` PASS.
- **Status**: BUG-0027 remains **OPEN**. AC-1..AC-6 remain unchecked. **Next**: `/sprint-plan` in fresh **tech-lead** subagent. CROSS_MODEL_REVIEW=0 — do not spawn sovereign-critic. Do not spawn sprint-plan from this architecture chat. STOP.

## Intake handoff — Standalone CLI UX, authentication, and interactive TUI

- **Phase completed**: intake. **Timestamp (UTC)**: 2026-09-23T21:30:43Z. **Evidence**: `handoffs/intake_evidence/standalone-cli-ux-intake-20260923T213043Z.json` validated with `intake_evidence_validate.py` before canonical writes.
- **New work items**: BUG-0028 (unnecessary full-runtime cold start), BUG-0029 (missing API-key input and false login success), and US-0155 (deferred Pi-style interactive TUI).
- **Priority and ordering**: Investigate BUG-0028 and BUG-0029 independently. US-0155 depends on US-0151 so it can use the shared daemon transport rather than duplicate runtime ownership.
- **Locked boundaries**: Keep workflow-command admission, policy, kernel-contract validation, and persistent execution intact while optimizing read-only paths. API keys must never appear in argv, terminal output, logs, or repository artifacts. US-0146 remains completed lightweight ANSI/client work; US-0155 is additive. Do not reopen US-0150, US-0151, or US-0146.
- **Discovery anchors**: `standalone/apps/cli/src/index.ts`; `packages/runtime-host/src/index.ts`; `packages/code-intelligence/src/provider.ts`; `packages/auth-models/src/cli.ts`; `packages/pi-kernel/src/auth-runtime.ts`; `apps/tui/src/{index,panels}.ts`; standalone Pi masterplan section 29.
- **Next**: `/discovery` in a fresh PO/tech-lead context, beginning with BUG-0028 or BUG-0029. Do not implement from intake.

## Intake handoff — BUG-0030 OpenCode `/auto` aborts with OPENCODE_AUTO_TUI_DEFINED_UNBRANDED

- **Phase completed**: intake (`/intake bug`). **Role**: po. **Bug**: BUG-0030. **Sprint**: (pending). **Verdict**: PASS (`decision_gate=false`).
- **Timestamp (UTC)**: 2026-09-25T23:50:05Z. **Writer**: `po-opencode-BUG0030-intake`. **Intake run**: `opencode-20260925-BUG0030-intake`.
- **Evidence**: `handoffs/intake_evidence/BUG-0030-intake-20260925T235005Z.json`, validated with `python scripts/intake_evidence_validate.py --file ...`.
- **Defect**: OpenCode CLI TUI lists `/auto`, but invoking it returns `OPENCODE_AUTO_TUI_DEFINED_UNBRANDED` before `runAutoLifecycle` starts. The current `rpc.ts` dynamic import of `@opencode/plugin/rpc` falls back to `localRpcDefine`; `tui.ts` intentionally rejects that unbranded definition.
- **Duplicate check**: Persist NEW BUG-0030. BUG-0024 is not reopened: it added stage diagnostics and mock contracts, but its unbranded mock case is expected and live CLI TUI validation was excluded. BUG-0030 owns making the advertised OpenCode `/auto` path operational.
- **Scope for `/discovery`**: identify the host-valid RPC/module-resolution and registration path, then specify a host-real integration test or reproducible smoke test that proves `/auto` reaches `runAutoLifecycle`. Preserve plugin-only ownership; do not restore `.opencode/commands/auto.md`, invent a localhost endpoint, or weaken existing fail-closed diagnostics.
- **Boundaries**: Do not merge BUG-0022 (role-model inheritance), BUG-0027 (manual phase persistence), BUG-0028, or BUG-0029. Do not claim OpenCode desktop Command.Info support. No npm publish, git push, or `.env` reads.
- **Status**: BUG-0030 remains **OPEN**. AC-1..AC-5 remain unchecked. **Next**: `/discovery` in a fresh PO context. STOP.

## Discovery handoff — BUG-0030 OpenCode `/auto` aborts with OPENCODE_AUTO_TUI_DEFINED_UNBRANDED

- **Phase completed**: discovery. **Role**: po. **Bug**: BUG-0030 only. **Sprint**: (pending). **Verdict**: PASS (`decision_gate=false`).
- **Execution note**: The delegated manual discovery command stopped with `OPENCODE_MANUAL_PHASE_WRITE_DENIED` before it could persist. This direct handoff records the discovery result; the denial is an execution-context constraint, not evidence that BUG-0030 is fixed.
- **Locked outcome**: On the normal OpenCode CLI TUI, listed `/auto` must start `runAutoLifecycle`. The current unbranded local-RPC fallback is the identified blocker, not an acceptable happy-path result.
- **Technical boundary for research**: Determine a host-valid shared RPC definition, module-resolution, and registration route for the project TUI and server plugins. Preserve plugin-only `/auto`, `{ id, tui }`, `editor.add`, explicit unsupported-host failures, installer overwrite, and template parity. Do not restore `auto.md`, add a JSON command template, invent localhost, or require an undocumented consumer-side dependency install.
- **Proof boundary**: Replace mock-only closure confidence with a reproducible host-real integration or smoke contract proving the listed command invokes `runAutoLifecycle`. Desktop Command.Info and `--pure` remain out of scope.
- **Sibling boundary**: Do not reopen BUG-0024; do not merge BUG-0022, BUG-0027, BUG-0028, or BUG-0029. No npm publish, git push, or `.env` reads.
- **Next**: `/research` in a fresh tech-lead context. Live-inventory the next free `R-####`; do not author architecture or implementation from this discovery phase. BUG-0030 remains **OPEN**. STOP.

### Research correction — BUG-0030 / R-0152

- The private-RPC discovery direction is superseded: `@opencode/plugin@1.18.32` returns E404 and its v2 plugin documentation does not bind the installed host.
- The documented target is `.opencode/commands/auto.md` with `agent: auto` and a non-STOP spawn-only command body. Retire the legacy TUI/RPC route only during implementation.

## Intake handoff — US-0156 OpenCode `/auto` parity: continuous multi-phase, drain, resume, phase-selection

- **Phase completed**: intake (`/intake`). **Role**: po. **Story**: US-0156. **Sprint**: (pending). **Verdict**: PASS (`decision_gate=false`).
- **Timestamp (UTC)**: 2026-09-27. **Writer**: `po-opencode-US0156-parity-intake`. **Intake run**: `opencode-20260927-US0156-parity-intake`.
- **Evidence**: `handoffs/intake_evidence/US-0156-intake-20260927T000000Z.json`, validated with `python scripts/intake_evidence_validate.py --file ...` (`[INTAKE_EVIDENCE_VALIDATION_OK]`, exit 0) before canonical writes.
- **Decision (operator, question tool)**: Close the full Cursor `/auto` parity gap (native in-chat chain, continuous multi-phase, backlog drain, bug-queue, start-from/resume, phase-selection) as **one Epic story with internal slices** (S1..S7). OpenCode `/auto` runs **DEFAULT continuous** (`AUTO_FLOW_MODE=full_autonomy`). Bug handling: BUG-0022 + BUG-0027 are **Definition-of-Done prerequisites** (must reach DONE); BUG-0028 + BUG-0029 are **triaged as prerequisite slices**, NOT merged/closed.
- **Duplicate check**: No existing US covers OpenCode continuous orchestration. US-0121..US-0126 (OpenCode adapter dispatch epic) are DONE and are the base, not the parity layer. BUG-0030 locked the dispatch route (`auto.md` + `agent: auto`, no plugin RPC); US-0156 builds **additively** on that route and does not reopen it. Cursor parity sources: US-0037, US-0044, US-0070, US-0080, US-0087, US-0088, US-0092, US-0095.
- **Scope for `/discovery`**: On the normal OpenCode CLI TUI, make `runAutoLifecycle` continue into subsequent admitted phases (S1/S2), drain the eligible backlog in dependency order with Stop-Matrix termination (S3), select story-vs-bug work from the OPEN queue (S4), support `start-from`/resume from persisted lifecycle evidence (S5), and apply the Cursor phase-selection policy with `persistManualPhaseIsolation` audit (S6). All within the BUG-0030-locked spawn-only contract (`agent: auto`, no TUI/RPC surface).
- **Locked boundaries**: Preserve `.opencode/tui.json` `"plugin": []` (BUG-0030 / DEC-0151). Do not restore `.opencode/commands/auto.md` beyond the BUG-0030-locked form; do not add a JSON command template or a localhost endpoint; do not claim OpenCode desktop Command.Info / `opencode --pure`. Desktop/IDE remain out of scope. US-0149..US-0155 (standalone runtime/TUI) stay separate.
- **DoD gate (AC-7)**: BUG-0022 + BUG-0027 must be DONE and cited in verify-work; BUG-0028 + BUG-0029 stay OPEN (prerequisite slices). No `itsm`-runtime work leaks into the OpenCode surface.
- **Safety**: No npm publish, no git push, no `.env` reads. `template/.opencode/**` parity with `.opencode/**` preserved. STOP-matrix fail-closed tokens in `orchestrator.ts` are not weakened.
- **Status**: US-0156 remains **OPEN**. AC-1..AC-10 remain unchecked. **Next**: `/discovery` in a fresh PO/tech-lead context (S1 first, then S2). Do not implement from intake. STOP.

## Discovery handoff — US-0156 OpenCode `/auto` parity: continuous multi-phase, drain, resume, phase-selection

- **Phase completed**: discovery. **Role**: po. **Story**: US-0156 only. **Verdict**: PASS (`decision_gate=false`).
- **Execution note**: The delegated manual discovery command returned `OPENCODE_MANUAL_PHASE_WRITE_DENIED` before it could persist phase isolation evidence. This direct continuation records the product discovery only; it does not claim manual-phase persistence or a live OpenCode execution proof.
- **Locked outcome**: On normal OpenCode CLI TUI, the BUG-0030 command-owned `/auto` route (`agent: auto`) defaults to `AUTO_FLOW_MODE=full_autonomy` and continues one spawn-only lifecycle across admitted phase and eligible segment boundaries. It must stop, rather than ask for a routine re-invocation, only at the inherited non-suppressible Stop-Matrix boundaries or bounded caps.
- **Scheduling and recovery**: Resolve a single effective phase plan before spawning; `start-from` overrides resume, then `resume_brief` precedes `state.md`. Invalid or ambiguous resolution fails closed, never falls back to `execute`. Story drain and bug queue are mutually exclusive; explicit `bug-target` wins, while ordinary drain selects dependency-eligible OPEN stories. Persist plan, skipped phases, item cursor/budget, stop reason, and fresh-isolation provenance at every continuation boundary.
- **Scope boundaries**: Preserve `.opencode/tui.json` `"plugin": []`, the BUG-0030 `.opencode/commands/auto.md` spawn-only route, and all Stop-Matrix, role, proof, QA, release, cap, and secret restrictions. Do not restore TUI/RPC, add JSON commands or localhost, claim Desktop Command.Info or `--pure`, alter standalone runtime work, read `.env`, publish, or push. `persistManualPhaseIsolation` remains an audit path for direct commands and cannot create lifecycle progress.
- **DoD boundary**: BUG-0022 and BUG-0027 must be DONE and cited during verify-work. BUG-0028 and BUG-0029 remain OPEN prerequisite slices unless their own work closes them; do not merge or close them here.
- **Research questions**:
  1. What host-valid continuation mechanism starts the next fresh phase without recursively reusing the `/auto` command session?
  2. Which Python bridge inputs/outputs define fail-closed first-phase, resume, effective-plan, next-item, and dependency resolution?
  3. What exact precedence and reason-code matrix covers `start-from`, phase policy, story drain, bug target, resume, and scheduler conflict?
  4. What durable tuple prevents duplicate phase/segment execution across an interruption and resume?
  5. Which existing Stop-Matrix reasons are terminal, retryable, or continuation-admitting on OpenCode without weakening the Cursor contract?
  6. How do loop, retry, backlog, and bug caps share deterministic accounting across a continuous OpenCode run?
  7. How are `effective_phase_plan`, `skipped_phases`, item cursor, queue budget, and isolation provenance validated at each boundary?
  8. Which active/template contract tests prove continuous phases, story drain, bug queue, resume/start-from, policy conflicts, hard stops, cap exhaustion, and DoD prerequisites without a live Desktop or `--pure` probe?
- **Evidence refs**: `handoffs/intake_evidence/US-0156-intake-20260927T000000Z.json`; `docs/product/vision.md` `## Discovery Notes — US-0156`; `docs/product/acceptance.md` US-0156 row; `.opencode/commands/auto.md`; `.opencode/plugins/orchestrator.ts` `runAutoLifecycle` / `selectFirstPhaseViaPython` / `persistManualPhaseIsolation`; US-0037, US-0044, US-0070, US-0087, US-0088, US-0092, and US-0095 contracts.
- **Status**: US-0156 remains **OPEN**. AC-1..AC-10 remain unchecked. **Next**: `/research` in a fresh **tech-lead** context. Live-inventory the next free `R-####`; do not author architecture or implementation from this discovery phase. STOP.

## Discovery handoff — BUG-0022 `/auto` Task-spawns inherit parent chat model instead of role_catalog

- **Phase completed**: discovery. **Role**: po. **Bug**: BUG-0022 only. **Sprint**: (pending; expected **S0163**, S0162 = US-0156 verify-work). **Verdict**: PASS (`decision_gate=false`).
- **Timestamp (UTC)**: 2026-09-28. **Writer**: `po-cursor-20260928-BUG0022-discovery`. **Run**: direct manual PO discovery (no `orchestrator_run_id`). **Fresh context**: this is the **first** discovery pass for BUG-0022 — intake (2026-09-13) exists and is validated; no prior D-locks, DQs, or ACs were on record.
- **Composer evidence**: `handoffs/intake_evidence/BUG-0022-intake-20260913.json` (`[INTAKE_EVIDENCE_VALIDATION_OK]`); scratchpad `MODEL_RESOLVE=role_catalog` / `MODEL_CATALOG=.cursor/model-catalog.local.example.role-based-balanced_cursor_only.json` / `MODEL_FALLBACK=inherit` / `CROSS_MODEL_REVIEW=1` / `SECURITY_REVIEW=0`; `.cursor/model-catalog.local.json` absent (glob 0); `scripts/model_tier_lib.py` + `template/scripts/model_tier_lib.py` **present** (operator's "file missing" claim disproven at intake — do not persist as root cause); `scripts/sovereign_critic_lib.py` **present**; `.cursor/agents/po.mdc` + `release.mdc` frontmatter `model: inherit`; catalog example roles po/sa/dev/qa/security/release/critic, tiers cheap/balanced/strong, **no** qe/curator/tech-lead keys.
- **Locked gap (decision gate)**: Every `/auto` Cursor Task **producer** spawn carries `model: inherit` (parent chat Grok) and the **critic** spawn is pinned to a hardcoded release slug (`composer-2.5-fast`) rather than catalog `roles.critic` (`gpt-5.6-luna-medium`), **even though** the resolver libs `model_tier_lib.resolve_model_for_phase` (US-0101/DEC-0086, US-0102/DEC-0087, DEC-0104/US-0104) and `sovereign_critic_lib.select_critic_model` (US-0130) are already **DONE** and implement the 5-step `MODEL_<PHASE>` > `MODEL_TIER_<PHASE>` > `role_catalog_lookup` > `MODEL_TIER_DEFAULT` > `cursor_alias` chain. **Root cause is the spawn path failing to consume the resolver**, not a missing lib, not the local-catalog file absence (copy-to-local is necessary, not sufficient), not a catalog schema redesign, and not the OpenCode CLI/TUI dispatch class (BUG-0024/0030).
- **Discovery-locked constraints (D1–D10)**: D1 producer Task-spawn `model:` = `resolve_model_for_phase` output, isolation `model_id` matches catalog (never silent inherit); D2 critic `model:` = `select_critic_model`/`roles.critic` (never `composer-2.5-fast`); D3 `tech-lead`→`sa` and `curator`→`dev` resolved via existing `LOGICAL_ROLE_TO_CATALOG_KEY` or fail closed with `MODEL_ROLE_SLUG_UNKNOWN`; D4 `MODEL_FALLBACK=inherit` honored only on full 5-step chain failure **and** a documented `MODEL_*`/`MODEL_TIER_*`/`MODEL_RESOLVE_FALLBACK` override; D5 reproducible pytest mock-injection contract test (mock-only acceptable; this is a spawn-path unit, not a live-Cursor-probe bug); D6 isolation/provenance per spawn distinguishes resolved-from-catalog vs parent-inherit; D7 do **not** reopen the DONE resolver-lib ACs (US-0101/0102/0104/0130, DEC-0086/0087/0104); D8 catalog hygiene (stale "Claude Opus 4.8" notes; missing qe/curator/tech-lead keys; `PHASE_LOGICAL_ROLE` lacking `closure`/`sprint-plan`) tracked alongside, **not** in this bug's scope, **not** a schema redesign; D9 no merge/drain or reopen of BUG-0021/0023/0024/0026/0027/0028/0029/0030; no npm publish, git push, `.env` reads; `template/scripts/model_tier_lib.py` parity; catalog schema unchanged; STOP-only `auto.md` not restored; D10 BUG-0022 is the last OPEN **DoD gate** for US-0156 (BUG-0027 DONE) — closing it unblocks US-0156, but **discovery must not tick or release US-0156** (that is US-0156's own verify-work/closure).
- **Research questions (DQ1–DQ10)** handed to `/research` (fresh tech-lead, expected **R-0154**): (1) where exactly in the Cursor `/auto` Task-spawn path is `model:` set and how is the parent-inherit default introduced; (2) the minimal, contract-correct point to call `resolve_model_for_phase` per phase and thread `model:` into the Task payload; (3) how the critic spawn obtains `select_critic_model`'s value in place of the hardcoded slug; (4) which scratchpad keys are authoritative and how `MODEL_FALLBACK=inherit` interacts with the 5-step chain; (5) the exact fail-closed set (`MODEL_ROLE_SLUG_UNKNOWN`, `MODEL_*` miss, `MODEL_RESOLVE_FALLBACK`) and the single legitimate inherit case; (6) which role→catalog gaps (`qe`, `curator`, `tech-lead`, `closure`, `sprint-plan`) stay unresolved-but-cited rather than force-mapped; (7) what the mock-injection contract test must assert to prove D5 without a live Cursor probe; (8) how to surface the resolved-vs-inherited distinction in isolation/provenance (D6); (9) which active/template files stay in parity and which are intentionally out of scope (D9); (10) how to assert D7/D9 sibling integrity so closing BUG-0022 provably does not mutate DONE resolver-lib ACs or any sibling bug.
- **Acceptance (8 ACs, all unchecked this phase)**: AC-1 producer Task-spawn `model:` = `resolve_model_for_phase` output across po/discovery, tech-lead/plan-verify, dev/execute, qa/qa, security (when `SECURITY_REVIEW=1`), release; isolation `model_id` matches catalog (not silent inherit). AC-2 critic `model:` = `select_critic_model` output / catalog `roles.critic`, never hardcoded `composer-2.5-fast`. AC-3 `tech-lead`→`sa`, `curator`→`dev` consumed from catalog via `LOGICAL_ROLE_TO_CATALOG_KEY` or cited fail-closed `MODEL_ROLE_SLUG_UNKNOWN`. AC-4 `MODEL_FALLBACK=inherit` honored only on full chain failure **and** a documented override; never the silent default for a resolvable role. AC-5 reproducible pytest mock-injection contract test proving producer and critic carry catalog-resolved `model:` under `MODEL_RESOLVE=role_catalog`, inherit only in the documented failed-chain case; mock-only acceptable (spawn-path unit, not live-Cursor). AC-6 isolation/provenance per spawn distinguishes resolved-from-catalog vs parent-inherit. AC-7 closing BUG-0022 does not merge/drain or reopen any sibling bug or any DONE resolver-lib AC; catalog hygiene tracked alongside, out of scope, not a schema redesign. AC-8 no npm publish / git push / `.env` reads; `template/scripts/model_tier_lib.py` parity preserved; catalog schema unchanged; STOP-only `auto.md` not restored.
- **Compose/link (no mutation)**: US-0101 DONE / DEC-0086 (role-catalog resolver contract); US-0102 DONE / DEC-0087 (resolver precedence); DEC-0104 / US-0104 (critic overlay); US-0130 (critic resolver selection); R-0133 (prior spawn-model research); BUG-0021 DONE (Cursor IDE `/auto` TUI listing — do not mutate); BUG-0023 DONE (OpenCode CLI TUI dispatch — do not merge); BUG-0024/0026/0028/0029/0030 (OpenCode dispatch/bootstrap/prerequisite slices — do not drain); US-0156 OPEN (BUG-0022 is its DoD gate — do not tick/release US-0156).
- **Runtime proof**: None this phase (product decision gate only). D5's unit-level mock-injection proof belongs to execute/verify-work, not discovery.
- **Isolation + STOP**: Discovery only. Do not proceed to `/research` in this session. Do not mutate US-0156, BUG-0027, US-0101/0102/0104/0130, or any sibling bug. `docs/product/acceptance.md` BUG-0022 row remains **unchecked**; backlog `### BUG-0022` `Status: OPEN`. **Next**: `/research` in a fresh **tech-lead** context — allocate **R-0154** and answer DQ1–DQ10; do not author architecture or implementation from this discovery phase. **STATUS**: BUG-0022 remains **OPEN**. STOP.

## Intake handoff — BUG-0031 `/closure` cannot complete on OpenCode: no spawnable closure role is authorized to write the canonical DONE-flip paths

- **Phase completed**: intake (`/intake bug`). **Role**: po. **Bug**: BUG-0031. **Sprint**: (pending — expected after BUG-0022 DoD / US-0156 sequence). **Verdict**: PASS (`decision_gate=false`).
- **Timestamp (UTC)**: 2026-10-01T12:00:00Z. **Writer**: `po-cursor-20261001-BUG0031-intake`. **Intake run**: `po-cursor-20261001-BUG0031-intake`.
- **Evidence**: `handoffs/intake_evidence/BUG-0031-intake-20261001T120000Z.json`, validated pre-write with `python scripts/intake_evidence_validate.py --file ...` → `[INTAKE_EVIDENCE_VALIDATION_OK]` (exit 0).
- **Defect**: On the OpenCode host, `/closure` cannot complete: the primary closure role `qe` is **not spawnable** (OpenCode subagent has no `qe` type), and the spawnable closure role (`curator`) plus `qa` have **no write authorization** over the four canonical DONE-flip paths — `docs/product/backlog.md` `Status: OPEN`→`DONE` (+ AC tick), `docs/product/acceptance.md` `[ ]`→`[x]`, `sprints/S0xxx/closure-verification.md` (create), and the state.md closure checkpoint. Live-falsified in **S0163 / BUG-0022**: the full lifecycle reached RELEASE_PASS, the closure-evidence half passed (`CLOSURE_VERIFY_PASS`), and the closure-flip half fail-closed (`CLOSURE_BLOCKED_PERMISSION_MATRIX`), leaving only an **operator hand-flip** workaround.
- **Duplicate check**: NEW BUG-0031. **Distinct from BUG-0027** (manual-phase evidence *persistence* — a phase role writing its own phase's evidence; that already works). **Distinct from BUG-0016** (DONE — general bash/edit posture + `S*` globs for po/tech-lead/curator/dev/qa/release; it never granted a *closure* role the canonical DONE-flip paths). **Distinct from BUG-0024 / BUG-0030** (OpenCode `/auto` dispatch class). BUG-0022 and US-0156 are *affected consumers* (DoD gate — BUG-0022 must be DONE for US-0156) and must **not** be mutated, drained, or hand-flipped as this bug's fix.
- **Locked boundaries**: Do **not** close this by an operator hand-flip — the defect is the missing role/authorization contract, not the one pending flip. Do **not** weaken DEC-0152 (deny-by-default, broad-deny-before-path-allow), US-0045 (release cannot mark DONE / closure owns the DONE flip), or BUG-0006 (spawn-only). Preserve `template/.opencode/**` parity with `.opencode/**`. No npm publish, no git push, no `.env` reads.
- **Scope for `/discovery`**: Determine which spawnable closure role (`curator`, or make `qe` spawnable) must own the canonical DONE-flip, and the minimal permission-map change so that role is authorized over the four closure-owned flip paths (backlog status+AC, acceptance row, closure-verification.md, state.md) — while keeping deny-by-default for all other paths and preserving `qe`-default / `curator`-alternate semantics (US-0120 / DEC-0051). Also specify the fail-closed diagnostic that must surface the exact denied paths when no spawnable closure role can flip (not a silent operator fallback).
- **Sibling boundary**: Do not reopen/mutate BUG-0016, BUG-0019/0020 (OpenCode TUI listing), BUG-0022, BUG-0023, BUG-0024, BUG-0026, BUG-0027, BUG-0028, BUG-0029, BUG-0030, US-0156, US-0045, US-0120, US-0122, US-0124/0125/0126.
- **Status**: BUG-0031 remains **OPEN**. `docs/product/acceptance.md` BUG-0031 row remains **unchecked**. **Next**: `/discovery` in a fresh **PO** context, beginning with the role/authorization/contract repair. Do not implement from intake. STOP.

## Discovery handoff — BUG-0031 `/closure` cannot complete on OpenCode: no spawnable closure role is authorized to write the canonical DONE-flip paths

> **Supersedes the intake handoff pointer above** (that intake record is preserved, not erased). Discovery ran in a fresh PO context; this discovery handoff is the operative pointer for the next phase.

- **Phase completed**: discovery (`/discovery bug`, fresh PO). **Role**: po. **Bug**: BUG-0031 only. **Sprint**: (pending — expected after BUG-0022 DoD / US-0156 sequence). **Verdict**: DISCOVERY_PASS (`decision_gate=false`).
- **Timestamp (UTC)**: 2026-10-01T12:40:00Z. **Writer / fresh marker**: `po-BUG0031-discovery-20261001T124000Z-fresh`. **Context**: direct manual PO discovery in a fresh OpenCode PO session (no `orchestrator_run_id`; intake 2026-10-01T12:00:00Z held read-only).
- **Intake held (read-only)**: `handoffs/intake_evidence/BUG-0031-intake-20261001T120000Z.json` (`[INTAKE_EVIDENCE_VALIDATION_OK]`, exit 0).
- **Locked role recommendation (question a — ONE role)**: **`curator`** owns the canonical DONE-flip on OpenCode.
  - **`qe` — REJECTED**: not spawnable on the OpenCode host. Proven: no `.opencode/agents/qe.md`, no `**/qe.mdc` (repo-wide glob = 0), no TUI/RPC registration for `qe`. `qe` is referenced only as the Cursor-host closure default + `AUTO_ROLE_CLOSURE` alternate (`.cursor/commands/closure.md` L4/L9/L25/L120; DEC-0051 §1 L41). On OpenCode the default `qe` is unspawnable, so the override path to a spawnable role **must** be `curator`.
  - **`curator` — SELECTED**: sanctioned closure alternate (DEC-0051 §1 L41 + §2 L53; `AUTO_ROLE_CLOSURE=curator`; closure.md L10 `qe|curator` override + L184 isolation `role=qe (or curator)`). **Empirically closure-capable in this kit** — the same kit closed S0146/S0159/S0160/S0161 on Cursor with `curator` when `qe` was unavailable (backlog BUG-0023 L5508 `AUTO_ROLE_CLOSURE=curator`, BUG-0024 L5535, BUG-0025 L5559, BUG-0027 L5604 closure_notes: **CLOSURE_PASS**). It already **has** the 4th flip path (`docs/engineering/state.md`: allow) and is the least-privileged role that can carry a DONE flip (curator = engineering-memory/ship role; it does not own QA verdicts — respects DEC-0051 L72 "curator must NOT write qa-owned surfaces"). Needs **3 additive allows** (below) to complete the set.
  - **`qa` — REJECTED as owner**: spawnable, and holds `state.md`, but (1) is **not** in the closure role list `qe|curator` (closure.md L25/L120; DEC-0051 §1 L41) and (2) is not an admitted `AUTO_ROLE_CLOSURE` value (DEC-0051 §2 L53 — only `qe|curator`); granting it would be scope-invention beyond the documented contract. (Flagged as Ambiguity A3/DQ7 for research — default: **no**.)
- **Minimal permission-map change (question b — exact deltas, additive, parity-paired)**:
  Add **exactly these three** `edit:` allows to the curator role map (deny-first ordering preserved — append after the existing allows):

  | Path (additive allow) | Active (`.opencode/agents/curator.md`) | Template (`template/.opencode/agents/curator.md`) |
  |---|---|---|
  | `"docs/product/backlog.md": allow` | add | add |
  | `"docs/product/acceptance.md": allow` | add | add |
  | `"sprints/S*/closure-verification.md": allow` | add | add |

  - **Already held — no change**: `docs/engineering/state.md` (active L7 / template L7).
  - **Parity**: the SAME three rows in BOTH active + template (US-0017 parity guard); `S*` wildcard (DQ8 recommendation) to match the existing per-role `S*` allow pattern.
  - **Out of scope**: `bash: ask` / `task: deny` stay; no `**.cursor/`** file touched in discovery (DQ6 — Cursor-surface closure.md parity note flagged for research, not decided).
- **Contract / fail-closed (question b/d)**: `/closure` must still complete **per phase** and its stop matrix must emit a **denied-flip-paths diagnostic** (name the 3 missing paths + the spawnable alternate) instead of a bare `CLOSURE_BLOCKED_PERMISSION_MATRIX` — so an operator can see exactly what to authorize. This is a **contract/observability** expectation on the `/research`+`/architecture` side; discovery does not implement it.
- **Second-order (question c — flagged, not decided)**: **Ambiguity A2** — `.cursor/commands/closure.md` (Cursor-surface) role list `qe|curator` (L4/L9/L25/L120) is host-agnostic prose; the **OpenCode** surface already uses the curator alternate (BUG-0023/0024/0025/0027 closure_notes). Research/DQ6 to weigh whether an explicit "OpenCode: qe unspawnable → `AUTO_ROLE_CLOSURE=curator`" note is worth adding to closure.md. **PO does not unilaterally change it.** (No `.cursor/` edit in discovery.)
- **Definition of Done candidate (question d)**: BUG-0031 DONE when, on an **OpenCode host**, a fresh **curator** closure session completes the **4 canonical flips** (`backlog.md` `Status: OPEN→DONE` + target-AC tick; `acceptance.md` target row `[ ]→[x]`; `sprints/S0xxx/closure-verification.md` created; `docs/engineering/state.md` closure-checkpoint appended) **without a permission-matrix denial** AND **without operator hand-flip**, for a representative sprint — with: (a) **active + template curator parity** held (both carry the 3 additive allows), (b) **BUG-0016 baseline untouched** (additive-only matrix), (c) **DEC-0152 deny-by-default preserved** (broad-deny-before-path-allow; no rule reordered/rewritten), (d) `bug_issue_validate.py --check-acceptance` **exit 0** and `validate_closure_verification.py` PASS, (e) no sibling mutation (BUG-0022/0027, US-0156, US-0045, US-0120, US-0122, BUG-0028/0029), (f) **additive** `test_bug0031_*` proving the flip is authorization-gated (not a hand-flip). No npm publish / git push / `.env`.
- **Out-of-scope (question e — must NOT touch)**: no reopen of BUG-0022 / BUG-0027 / BUG-0016; no re-land of S0163 as a new story (that flip belongs to BUG-0022's own post-fix closure); no redesign of DEC-0152 or DEC-0051; no **new `qe`** role/type creation; no authoring of `decisions/DEC-*` (new **or** amended — additive amendment, if any, is `/architecture`'s job); no `.opencode/` / `.cursor/` **config** edits in discovery (permission-map write is `/execute`'s job once research+architecture lock it); no `scripts/` **logic** authoring (parity/test/validator **expectations** are research inputs); no npm publish / git push / `.env` reads; do not drain BUG-0028/0029/0026.
- **Research question set (DQ1–DQ10) → `/research` to LOCK** (each maps to a concrete artifact/line):
  1. **DQ1 — Confirm curator is the ONE authorized spawnable closure role** on OpenCode: `.cursor/commands/closure.md` L4/L9/L25/L120 (`qe|curator`), DEC-0051 §1 L41 + §2 L53, `.opencode/agents/curator.md` (spawnable, `mode: subagent`) — prove `qa` and a "new qe" are NOT authorized.
  2. **DQ2 — Exact parity delta**: `.opencode/agents/curator.md` L5–14 vs `template/.opencode/agents/curator.md` L5–14 — enumerate the **complete** set of paths needed for the 4 flips (already-held `state.md` + the 3 missing) and confirm **byte-parity** (active↔template) after the additive rows.
  3. **DQ3 — Additive allow vs deny-reorder**: verify DEC-0152 L40–43 ("broad deny **before** path-specific allows", last-matching-wins) means the 3 rows can be **appended** (additive) without reordering, and that no existing `**` deny is broadened/narrowed (BUG-0016 additive-only guard).
  4. **DQ4 — State.md checkpoint surface**: `docs/engineering/state.md` is already curator-allowed (`.opencode/agents/curator.md` L7) — confirm the closure-checkpoint **append-bottom** (US-0058 / DEC-0040) needs **no** extra allow, and that the fail-closed `CLOSURE_BLOCKED_PERMISSION_MATRIX` is not re-triggered by state writes.
  5. **DQ5 — closure-verification.md path shape**: does the flip-artifact path `sprints/S0xxx/closure-verification.md` match an **`S*`** wildcard (as qa L7–11 use `sprints/S*/...`) or must it be the literal sprint id; choose the wildcard for parity (recommend `sprints/S*/closure-verification.md`) and confirm the validator reads it.
  6. **DQ6 — Cursor/OpenCode surface parity (second-order)**: `.cursor/commands/closure.md` (Cursor `qe|curator` prose L4/L9/L25/L120) vs `.opencode/agents/curator.md` (OpenCode) — does the Cursor-surface contract need an **additive** note that the OpenCode host resolves closure via `curator` (qe unspawnable)? Flag, do not force.
  7. **DQ7 — qa-role fallback (optional)**: should `qa` (`.opencode/agents/qa.md` L5–16, has `state.md` + QA surfaces) **also** be granted the 3 flip paths as a defensive alternate, or is curator-only the correct minimal contract (recommend curator-only to honor least-privilege + the documented `qe|curator` list)?
  8. **DQ8 — Fail-closed diagnostic contract**: define the exact stop-matrix diagnostic (name the 3 denied paths + spawnable role) so `/closure` on a deny-host reports *what to authorize* instead of a bare `CLOSURE_BLOCKED_PERMISSION_MATRIX` (closure.md stop-conditions L56–74 / reason-codes L161–171).
  9. **DQ9 — Additive test**: shape of `test_bug0031_*` that proves (a) curator is authorized over the 4 paths and (b) a non-authorized role still deny-closes (authorization-gated, not hand-flip) — and that it composes (does not break) `test_bug0027_*` / BUG-0016 permission tests.
  10. **DQ10 — Sibling-integrity assertion**: closing BUG-0031 must be verifiable as **not** mutating BUG-0022/0027, US-0156, US-0045/0120/0122, BUG-0028/0029/0026, BUG-0016 baseline, or DEC-0152 — plus the research anchor allocation (next free **R-0155**; do not wipe/reuse **R-0154**).
- **Research anchor (allocated, not authored)**: next free **R-0155**. **Highest existing** `## R-###` heading in `docs/engineering/research.md` is **`## R-0154 — BUG-0022`** (R-0153 = US-0156) → **R-0155** is free, **no collision**, **do not reuse** R-0154. PO does **not** author `## R-0155`; `/research` (fresh tech-lead) locks DQ1–DQ10 there.
- **Companion DEC**: **none expected from discovery** — an additive amendment to **DEC-0152** (or a new DEC) is **`/architecture`'s** job; PO does not author it. `# BUG-0031` at `docs/engineering/architecture.md` — `/architecture` only.
- **Expected sprint**: after BUG-0022 DoD / US-0156 sequence (S0163 is the blocked representative; do **not** create the sprint or the flip this phase).
- **Design / contract refs**: `.cursor/commands/closure.md` (role `qe|curator` L4/L9/L25/L120; 4 outputs L14–19; state checkpoint L18; closure-verification.md L19); DEC-0051 §1 L41 / §2 L53 (closure role + `AUTO_ROLE_CLOSURE`); DEC-0152 §Consequences L40–43 (deny-by-default last-matching); `.opencode/agents/curator.md` L5–14 + `template/.opencode/agents/curator.md` L5–14 (parity delta surface); `.opencode/agents/qa.md` L5–16 (rejected-alternate comparison); `docs/engineering/state.md` S0163 `CLOSURE_BLOCKED_PERMISSION_MATRIX`; BUG-0023/0024/0025/0027 `closure_notes` (curator CLOSURE_PASS precedent); US-0045 / US-0120 / US-0156 (composition).
- **Discovery guard list (this phase must NOT do)**: (1) no `/research` spawn from this chat; (2) no architecture authoring (no `# BUG-0031`); (3) **no BUG-0031 status flip** and **no** `acceptance.md` BUG-0031 tick; (4) **no sibling mutation** (BUG-0016/0022/0027, US-0156, US-0045/0120/0122, BUG-0028/0029/0026); (5) **no DEC authoring** (new or amended — DEC-0152/DEC-0051 compose-only this phase); (6) **no** `.opencode/` / `.cursor/` config/agent **edits** (permission-map write is `/execute`'s job); (7) **no shell** / no subagent spawn / no `.env` / no npm publish / no git push. Discovery is read-only on artifacts except the **PO-note** writes below.
- **PO-note writes this phase (only)**: `docs/product/vision.md` `## Discovery Notes — BUG-0031` (appended); this `handoffs/po_to_tl.md` discovery handoff (appended); `handoffs/resume_brief.md` top pointer (append-new-entry). `docs/product/backlog.md` / `docs/product/acceptance.md` — **NOT touched** (PO cannot flip status; acceptance remains unchecked).
- **Isolation + STOP**: `phase_id=discovery`, `role=po`, `bug_id=BUG-0031`, `fresh_context_marker=po-BUG0031-discovery-20261001T124000Z-fresh`, `timestamp=2026-10-01T12:40:00Z`, `evidence_ref=docs/product/backlog.md###BUG-0031 + docs/product/vision.md##Discovery Notes—BUG-0031 + this handoff + handoffs/resume_brief.md + handoffs/intake_evidence/BUG-0031-intake-20261001T120000Z.json (read-only)`. **Status**: BUG-0031 remains **OPEN**; `docs/product/acceptance.md` BUG-0031 row remains **unchecked**. **Next**: `/research` in a fresh **tech-lead** context — allocate **R-0155** and lock DQ1–DQ10; do **not** author architecture, DEC, or implementation from this discovery. Do not spawn research from this chat. STOP.
