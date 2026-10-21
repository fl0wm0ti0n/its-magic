## Discovery handoff — US-0151 executable lifecycle and operator transport

- **Phase completed**: discovery. **Role**: po. **Story**: US-0151 only. **Sprint**: (none — do not create). **Verdict**: DISCOVERY_PASS (`decision_gate=false`). **Timestamp (UTC)**: 2026-10-11T16:18:51Z. **Fresh marker**: `po-US0151-discovery-20261011T161851Z-fresh`.
- **Orchestrator**: `orchestrator_run_id=auto-20261011-us0151-discovery`, `delivery_mode=ultra_lean`. Intake already persisted (`handoffs/intake_evidence/US-0150-0154-standalone-integration-intake-20260919.json`) — not re-intaken. Consumed refresh pair `auto-20261011-us0150-refresh|story|(none)|refresh-context|rp-auto-20261011-us0150-refresh-curator-20261011T160800Z` / `337c53787f722a0a1f6f26f3f9900992455da8f3e2dff7e0fe2671eb615b2d2b`.
- **Problem lock**: CLI, daemon, and TUI submit work to the same persistent runtime and return real run events. `itsm intake`, `auto`, `resume`, `ask`, and lifecycle commands execute admitted work. A rendered plan or `{ok:true}` is not success. Confirmed gap: CLI discards `resolveOperatorTransport` and prints `{ok:true}` / `{scheduled:true}`; daemon `command.submit` returns `{ok:true, outcome}` without execution; TUI status is built from `:memory:`.
- **Locks**: **D1** one resolved transport on the US-0150 composition; no discarded in-memory facade or store (AC-1). **D2** lifecycle commands persist events and return success, gate block, or execution failure (AC-2). **D3** auto, lean/quick, resume, and crash recovery use the existing workflow and stop policy, fresh role sessions, and cross-process state (AC-3). **D4** ask, index, app, and browser invoke an admitted service or fail closed; app/browser implementation stays US-0152 (AC-4). **D5** daemon attach and TUI timeline show daemon-owned replay; compose US-0146 and US-0148; do not redesign protocol or UI (AC-5). **D6** E2E on the executable CLI and daemon: execute, gate failure, restart/resume, replay, and CLI/TUI attach (AC-6).
- **Preserve**: US-0146 and US-0148 remain DONE compose-only. US-0149 and US-0150 remain DONE. Do not start US-0152. Do not implement PATH registration or reopen BUG-0026. No sprint. No AC ticks. No `.env` read.
- **Research stub**: **R-0161** (tech-lead authors the heading). Highest existing is **R-0160**. **R-0151** is already used (BUG-0027) — do not reuse or wipe. Proof `rp-auto-20261011-us0151-discovery-po-20261011T161851Z` / `f924ce9e87257634dfe68adb230813ceb3e4df6b7f7983df264a56ebefc6d2ec`; issued 2026-10-11T16:18:51Z; `proof_ttl_seconds=3600`; ttl 2026-10-11T17:18:51Z.
- **Status**: US-0151 remains **OPEN**. AC-1..AC-6 remain unchecked. US-0150 remains **DONE**. **Next**: `/research` in a fresh **tech-lead** context. This PO child does not spawn it. STOP.

## Discovery handoff — US-0150 production standalone runtime composition

- **Phase completed**: discovery. **Role**: po. **Story**: US-0150 only. **Sprint**: (none — do not create). **Verdict**: PASS (`decision_gate=false`). **Timestamp (UTC)**: 2026-10-11T14:36:33Z. **Fresh marker**: `po-US0150-discovery-20261011T143633Z-fresh`.
- **Orchestrator**: `orchestrator_run_id=auto-20261011-us0150-discovery`, `delivery_mode=ultra_lean`. Intake already persisted (`handoffs/intake_evidence/US-0150-0154-standalone-integration-intake-20260919.json`) — not re-intaken. Consumed refresh pair `auto-20261011-us0149-refresh|story|(none)|refresh-context|rp-auto-20261011-us0149-refresh-curator-20261011T143245Z` / `37a0565b1d7ffbc45aefac8d3feaae178c138b4de07b3abff302043eaa77d13f`.
- **Reconfirm**: 2026-09-19 DISCOVERY_PASS **D1..D10 still hold** against `## US-0150`; no lock change. D1 no throwing kernel or literal `{}` config; D2 config, model, role policy, and project root resolved once with provenance; D3 custom tools only and deny-by-default project resources; D4 bridge/validator incompatibility fails closed before work; D5 real ToolBroker operation or denial, no `ok:<tool>`; D6 SQLite operational only; D7 code intelligence/context admitted or deterministic unavailable; D8 CLI and daemon share lifetime, TUI transport is US-0151; D9 acceptance tests use a real Pi SDK session and persistent store; D10 lifecycle, browser/app, release, and CI gates remain US-0151 through US-0154.
- **Preserve**: US-0133 through US-0140 remain DONE package contracts. Do not reopen US-0149 (DONE, PATH). Do not start US-0151. Do not implement BUG-0026. Research stub **R-0150** is already headed and current — do not author, wipe, or renumber it. Proof `rp-auto-20261011-us0150-discovery-po-20261011T143633Z` / `0a5c194fad7318008d133aa3658fc739d762e029fab7c80dbd758e5586e71dff`; issued 2026-10-11T14:36:33Z; `proof_ttl_seconds=3600`; ttl 2026-10-11T15:36:33Z.
- **Status**: US-0150 remains **OPEN**. AC-1..AC-6 remain unchecked. US-0149 remains **DONE**. **Next**: `/research` in a fresh **tech-lead** context. This PO child does not spawn it. STOP.

## Discovery handoff — US-0149 global `itsm` PATH registration

- **Phase completed**: discovery. **Role**: po. **Story**: US-0149 only. **Sprint**: (none — do not create). **Verdict**: PASS (`decision_gate=false`).
- **Timestamp (UTC)**: 2026-10-11T12:47:40Z. **Fresh marker**: `po-US0149-discovery-20261011T124740Z-fresh`.
- **Orchestrator**: `orchestrator_run_id=auto-20261011-us0149-discovery`, `delivery_mode=ultra_lean`, intake already persisted (`handoffs/intake_evidence/US-0149-intake-20260919T095121Z.json`) — not re-intaken. Consumed drain pair `auto-20261011-drain-us0149|story|(none)|refresh-context|rp-auto-20261011-drain-us0149-curator-20261011T124328Z` / `4c50ca4bdb6a47849e5598dd1a181c9d91d620f158572750a3b126d1c6fcb04d`.
- **Research constraints** (tech-lead; do not implement in discovery):
  - Opt-in global PATH only, with a user-chosen install/link location and documented defaults/prompts.
  - Windows and Linux required; macOS in-scope unless architecture bounds it out with rationale.
  - Uninstall / PATH-remove reverses only the registration this story added; fail-closed when registration cannot complete.
  - Docs parity: active operator docs and `template/` runbook.
  - Contract tests `test_us0149_*`.
  - Compose **BUG-0026** (OPEN, `blocks_us: US-0149`) for the published-kit `KERNEL_CONTRACT_MISMATCH` / omitted-`standalone/` residual. Do not duplicate BUG-0026 ACs. Do not reopen BUG-0025, US-0146, US-0147, or BUG-0033. Not a daemon story. Never read `.env`.
- **Research stub**: **R-0160** (tech-lead authors the heading; highest existing is **R-0159** — do not wipe). No sprint this phase.
- **Status**: US-0149 remains **OPEN**. AC-1..AC-6 remain unchecked. **Next**: `/research` in a fresh **tech-lead** context. This PO child does not spawn it. STOP.

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

## Intake handoff — US-0162 token optimization and host-neutral model routing v2 (tail mirror)

- **Phase completed**: intake. **Role**: po. **Story**: US-0162 only. **Verdict**: persisted. **Timestamp (UTC)**: 2026-10-16T15:28:44Z. **writer_id**: `po-cursor-20261016-tokenopt`. **intake_run_id**: `ir-20261016T152844Z-us0162`. Status OPEN. `user_visible: true`. Priority P0. Evidence `[INTAKE_EVIDENCE_VALIDATION_OK]`. Routing `[INTAKE_BUG_ROUTING_OK] kind=story exit=0`.
- **Hot-surface**: The prepended latest-first section was the oldest prefix and moved. boundary=`triad-rollover|po_to_tl`; moved=1; retained_sections=26; retained_lines=641; pack_ref=`handoffs/archive/po-to-tl-pack-20261016.md`. Full handoff text is in that pack.
- **Scope**: Context packs, sharded memory, machine-evidence split, smaller always-on kernel, delta handoffs, deterministic memory audit, deduped reads, and its-magic-owned multi-provider routing. `TOKEN_PROFILE` stays separate. Quality gates stay. Do not reopen US-0053, US-0072, US-0080, US-0089, US-0090, US-0096, US-0123, US-0132, or US-0135. Do not weaken US-0048, US-0056, US-0069, or US-0039.
- **Next**: `/discovery` in a fresh PO context. This PO child does not spawn it. STOP.

## Discovery handoff — US-0162 token optimization and host-neutral model routing v2

- **Phase completed**: discovery. **Role**: po. **Story**: US-0162 only. **Sprint**: (none — do not create). **Verdict**: DISCOVERY_PASS (`decision_gate=false`). **Timestamp (UTC)**: 2026-10-16T16:00:43Z. **Fresh marker**: `po-US0162-discovery-20261016T160043Z-fresh`.
- **Orchestrator**: `orchestrator_run_id=auto-20261016-us0162`, `delivery_mode=ultra_lean`, `resolved_phase_plan=[spec, plan, build+verify, ship]`, `skipped_phases=[intake, plan-verify]`, `reinstatement_mode=none`, `memory_layer=pack`, `invocation_mode=auto`, `resolution_source=scratchpad`, `resolved_start_phase=discovery`. Intake already PASS (`handoffs/intake_evidence/US-0162-intake-20261016T152844Z.json`, read-only). Do not drain BUG-0026. Do not reopen BUG-0029.
- **Problem lock**: Typical runs re-read full memory surfaces in every fresh subagent, and model choice is still the Cursor host catalog. Quality gates stay. Confirmed gap: `scripts/build_phase_context.py`, `.its-magic/model-routing.json`, and `.its-magic/runtime/context-packs` are absent. `docs/engineering/phase-context.md` is a pointer table. `/memory-audit` still lists full-file memory reads. `scripts/model_tier_lib.py` is the US-0101 / US-0102 adapter, not the source of truth.
- **Locks**: **D1** pack first, then targeted read, then bounded expansion; budgets 6000 / 4000 / 2 / 3000 (AC-1). **D2** shard architecture, state, this handoff, backlog, and acceptance; active state only in the normal prompt (AC-2). **D3** machine evidence stays stored and leaves the prompt; refs remain; the safety guarantee stays (AC-3). **D4** one always-on kernel; phase or role detail; no full duplication across rule, command, agent, skill, and runbook (AC-4). **D5** delta handoffs (AC-5). **D6** deterministic-first audit; 0 model calls when clean (AC-6). **D7** dedupe unchanged reads; duplicate large reads under 10 percent (AC-7). **D8** host-neutral router; provider and model separate; env key refs only; no repo secrets (AC-8). **D9** deterministic complexity, capability fallback, escalation cap; fallback records stay out of large `state.md` logs (AC-9). **D10** `TOKEN_PROFILE` stays separate from the model profile; `MODEL_*` is a compatibility adapter; quality gates and contract tests stay (AC-10..AC-12). Do not reopen US-0101, US-0102, US-0080, US-0089, US-0090, US-0096, or US-0139. Do not weaken US-0048, US-0056, US-0069, or US-0039.
- **UX**: no new screen. Operator output stays the compact per-phase log and benchmark fields. `docs/product/vision.md` unchanged.
- **Research stub**: **R-0169** (tech-lead authors the body). Highest existing heading is **R-0168**. Do not wipe it. **DQ1** adapter shape for `model_tier_lib.py` without amending DEC-0086 or DEC-0087. **DQ2** pack-builder placement and budget enforcement. **DQ3** shard layout that still meets DEC-0054. **DQ4** evidence paths that keep the DEC-0038 guarantee. **DQ5** kernel versus duplicated rule text. **DQ6** 0-call audit proof. **DQ7** dedup record. **DQ8** provider registry and `api_key_env` only. **DQ9** complexity, fallback codes, escalation cap. **DQ10** contract tests and benchmarks; US-0139 is not this pack. Viable options: (1) evolutionary adapter — recommended; (2) delete `MODEL_*` now — rejected; (3) reuse the US-0139 context engine — rejected.
- **Non-goals**: no implementation, no sprint, no architecture, no DEC, no new `R-` body, no sovereign critic (`CROSS_MODEL_REVIEW=0`), no npm publish, no git commit, no git push, no `.env` read.
- **Hot-surface**: this section is **appended** (newest at end) so oldest-prefix rollover retains it.
- **Proof**: `rp-auto-20261016-us0162-discovery-po-20261016T160043Z` / `d5cd5e8af5afcef3c70dcb933ff2fbb29cef07ac1f513d7a8f1b0d5d626e0926`; issued 2026-10-16T16:00:43Z; `proof_ttl_seconds=3600`; ttl 2026-10-16T17:00:43Z; `hash_recompute_confirmation=true`.
- **Status**: US-0162 remains **OPEN**. AC-1..AC-12 remain `[ ]`. **Next**: `/research` in a fresh **tech-lead** context. This PO child does not spawn it. STOP.

## Intake handoff — BUG-0036 repairable `/auto` blockers

- **Phase completed**: intake. **Role**: po. **Bug**: BUG-0036 only. **Verdict**: persisted. **Timestamp (UTC)**: 2026-10-16T18:48:15Z. **writer_id**: `po-cursor-20261016-autoblock`. **intake_run_id**: `ir-20261016T184815Z-autoblock`. Status OPEN. `decision_gate=false`. Evidence `[INTAKE_EVIDENCE_VALIDATION_OK]`. Bug validator `[BUG_VALIDATION_OK]`. Resume brief refreshed and validated. No `R-` entry. No story split.
- **Hot-surface**: Prepend was the oldest prefix and moved (`boundary=triad-rollover|po_to_tl`, `moved=1`, `retained_sections=27`, `retained_lines=650`, `pack_ref=handoffs/archive/po-to-tl-pack-20261016-b.md`). Full text is in that pack. This tail copy is appended so rollover retains it. Second rollover archived the US-0161 prefix (`boundary=triad-rollover|po_to_tl`, `moved=1`, `retained_sections=27`, `retained_lines=647`, `pack_ref=handoffs/archive/po-to-tl-pack-20261016-c.md`). `--check` exit 0.
- **Scope**: Repairable `/auto` blockers must not hard-stop when repair is possible, and hardness must be configurable. Surfaces: foreign harness failures during execute, `execute_harness_blocked_out_of_scope`, and `RESUME_BRIEF_STALE` after an expired proof, plus every later blocker of this same class. Contract-test shape is locked in discovery. Do not lock the replaced absolute hardness. Do not edit BUG-0029, US-0162 ticks, scratchpad, template scratchpad, or README. Discovery risk: `.env` reads, npm publish, and git push are US-0092 boundaries the operator did not mention.
- **Next**: `/discovery` in a fresh context. This PO child does not spawn it. STOP.


## Discovery handoff — BUG-0036 repairable `/auto` blockers

- **Phase completed**: discovery. **Role**: po. **Bug**: BUG-0036 only. **Story**: (none). **Sprint**: (none — do not create). **Verdict**: DISCOVERY_PASS (`decision_gate=false`). **Timestamp (UTC)**: 2026-10-16T19:06:50Z. **Fresh marker**: `po-BUG0036-discovery-20261016T190650Z-fresh`.
- **Hot-surface**: Prepend was the oldest prefix and moved (`boundary=triad-rollover|po_to_tl`, `moved=1`, `retained_sections=27`, `retained_lines=647`, `pack_ref=handoffs/archive/po-to-tl-pack-20261016-d.md`). Tail append then `--rollover` moved 2 (`boundary=triad-rollover|po_to_tl`, `retained_sections=26`, `retained_lines=646`, `pack_ref=handoffs/archive/po-to-tl-pack-20261016-e.md`). `--check` exit 0. This tail stayed on the hot file.
- **Problem framing**: `/auto` hard-stops when repair is still possible. US-0162 / S0179 execute had story contract tests 10/10, then foreign harness failures outside that sprint (scratchpad `AUTO_BACKLOG_DRAIN` / `AUTO_BACKLOG_MAX_STORIES` byte mismatch, and `README_FEATURE_COVERAGE_GAP:BUG-0029`) stopped as `execute_harness_blocked_out_of_scope`. After the execute proof TTL (`2026-10-16T18:06:02Z`), a later `/auto` stopped `[AUTO_RESUME_ERROR] RESUME_BRIEF_STALE` for `rp-auto-20261016-us0162-execute-dev-20261016T170602Z` with no pair refresh and no spawn.
- **Gap**: `execute_harness_blocked_out_of_scope` ends the segment even though the failures are owned elsewhere. `RESUME_BRIEF_STALE` is `security_hard` while `RESUME_BRIEF_AUTO_REFRESH != 1`. The spawn-only parent does not author the pair (DEC-0153 / BUG-0035). Hardness for this class is not configurable.
- **Locks**: **D1** (AC-1) repair continues the flow. **D2** (AC-2) foreign harness failures during `/execute`, `execute_harness_blocked_out_of_scope`, and expired-proof `RESUME_BRIEF_STALE` are in scope together. **D3** (AC-3) hardness has repair and block settings; not absolute when repair is possible; no new scratchpad key named here. **D4** (AC-4) test shape is discovery-owned, not an operator promise (operator: "3. ich habe keine meinung dazu"). Assertions: foreign harness continues under repair and stops under block; expired proof gets a new state-first pair from an authorized child under repair and stays `RESUME_BRIEF_STALE` under block; missing, conflicting, or unauthorized evidence stays fail-closed at every hardness; a synthetic later class member uses the same rule; `.env` reads, npm publish, and git push are not performed. Recommended file `tests/bug0036_repairable_blocker_contract_test.py`, markers `test_bug0036_*`. **D5** (AC-5) the class predicate covers later members, not only the two session stops. **D6** do not edit BUG-0026, BUG-0029, or US-0162, and do not tick US-0162 acceptance. **D7** parent stays spawn-only and non-author. **D8** do not flip `RESUME_BRIEF_AUTO_REFRESH` and do not repeal DEC-0153. **D9** research stub **R-0170** only. **R-0169** untouched. No `R-` body. **D10** BUG-0036 stays OPEN. AC-1..AC-5 stay unchecked. No sprint, no DEC, no architecture. Plan-verify stays skipped.
- **Class predicate**: a stop is in this class when it blocks the next lawful `/auto` action and a bounded repair can restore scheduling without an operator re-invocation.
- **Discovery risk** (`decision_gate=false`, not a narrowing): `.env` reads, npm publish, and git push are existing US-0092 boundaries the operator did not mention.
- **Options**: (1) reuse `AUTONOMY_STOP_POLICY` plus the stop matrix — recommended; (2) a separate hardness key; (3) delete both stops — rejected.
- **Research**: tech-lead authors **R-0170** and answers **DQ1** hardness knob, **DQ2** foreign-harness repair without editing foreign owners, **DQ3** who writes the expired-proof pair, **DQ4** which stale predicates stay fail-closed, **DQ5** how a later code joins the class, **DQ6** US-0092 boundary classification, **DQ7** active/template surfaces, **DQ8** keep the D4 assertions, **DQ9** companion DEC none unless `# BUG-0036` cannot hold it, **DQ10** sprint id at sprint-plan; plan-verify skipped.
- **Proof**: `rp-auto-20261016-bug0036-discovery-po-20261016T190650Z-BUG-0036` / `9f571b3e32c13d12267c3dcbdfc09340f26f6d6b4a283e36021bf0be84b6885b`; issued 2026-10-16T19:06:50Z; `proof_ttl_seconds=3600`; ttl 2026-10-16T20:06:50Z; second invocation MATCH.
- **Status**: BUG-0036 remains **OPEN**. AC-1..AC-5 remain `[ ]`. **Next**: `/research` as **tech-lead**. This PO child does not spawn it. STOP.

## Intake handoff — BUG-0037 created stories omit canonical fields

- **Phase completed**: intake. **Role**: po. **Bug**: BUG-0037 only. **Verdict**: persisted. **Timestamp (UTC)**: 2026-10-16T19:27:29Z. **writer_id**: `po-cursor-20261016-storyfields`. **intake_run_id**: `ir-20261016T192729Z-storyfields`. Status OPEN. Priority P1. `decision_gate=false`. `selected_pack=small-intake-pack`.
- **Hot-surface**: Prepend moved (`boundary=triad-rollover|po_to_tl`, `moved=1`, `retained_sections=26`, `retained_lines=646`, `pack_ref=handoffs/archive/po-to-tl-pack-20261016-f.md`). Tail append then `--rollover` moved the US-0157 prefix (`boundary=triad-rollover|po_to_tl`, `moved=1`, `retained_sections=26`, `retained_lines=643`, `pack_ref=handoffs/archive/po-to-tl-pack-20261016-g.md`). `--check` exit 0. This tail stayed on the hot file.
- **Evidence**: `handoffs/intake_evidence/BUG-0037-intake-20261016T192729Z.json`. `[INTAKE_EVIDENCE_VALIDATION_OK]`. `[BUG_VALIDATION_OK]`. `[INTAKE_BUG_RESUME_BRIEF_REFRESH_OK]`. `[INTAKE_RESUME_BRIEF_VALIDATE_OK]`. `intended_resume_phase=discovery`. `resolved_start_phase=discovery`. `resolution_source=resume_brief`. No `R-` entry. No US id. `INTAKE_GUIDED_MODE=0`. `WORK_KIND_ROUTING=0`. `EARLY_RESEARCH=0`. `ID_NAMESPACE_BOOTSTRAP=0`.
- **Pack**: asked_topics = outcome_success_criteria, impacted_components, constraints_compatibility_risks, required_tests_acceptance_checks, done_definition. missing_topics = none. assumptions_confirmed = (none). Outcome, the OpenCode host sentence, and `Gewohntes Beispiel: @backlog.md (6098-6133)` are distinct `answer_ref` rows. Constraints and required tests are distinct `delegation_ref` rows.
- **Duplicate check**: no open duplicate. BUG-0036 stays OPEN (`/auto` hard-stop) and is not reopened. BUG-0027 stays DONE (OpenCode phase persistence) and is not this missing-field shape.
- **Scope**: Current its-magic story creation on OpenCode omits important canonical fields. Status is the operator's example. Expected shape is the usual structured block at `docs/product/backlog.md` `## US-0161` lines 6098-6133. Faulty shape is the prose backlog (`**Priority:**`, `**Release:**`, `**Acceptance criteria**`) shown by remote samples US-0001 through US-0004. Those rows are not imported. US-0161 is not edited. The remote masterplan is not edited. Cursor and Pi are not in-scope user outcomes. Discovery risk: a shared story writer might be the cause.
- **Acceptance**: AC-1 fields including Status; AC-2 OpenCode host; AC-3 usual structured block; AC-4 contract test, assertion list locked in discovery; AC-5 done is the usual fields without weakening the canonical block.
- **Next**: `/discovery` in a fresh context. This PO does not spawn it. STOP.

## Intake handoff — US-0163 priority-band append

- **Phase completed**: intake. **Role**: po. **Story**: US-0163 only. **Verdict**: INTAKE_PASS (`decision_gate=false`). **Timestamp (UTC)**: 2026-10-16T19:35:00Z. **writer_id**: `po-cursor-20261016-us0163`. **intake_run_id**: `ir-20261016T193500Z-us0163`. Status OPEN. Priority P1. `selected_pack=small-intake-pack`.
- **Hot-surface**: Prepend moved (`boundary=triad-rollover|po_to_tl`, `moved=1`, `retained_sections=26`, `retained_lines=643`, `pack_ref=handoffs/archive/po-to-tl-pack-20261016-h.md`). Tail append then `--rollover` moved the BUG-0026 prefix (`boundary=triad-rollover|po_to_tl`, `moved=1`, `retained_sections=26`, `retained_lines=640`, `pack_ref=handoffs/archive/po-to-tl-pack-20261016-i.md`). `--check` exit 0. This tail stayed on the hot file.
- **Operator lock**: `1. B` priority still sorts and append is the end of that band. `2. both` OPEN stories and OPEN bugs. `3. just pick and ..` intake picks an order and records the dependency. `4. yes` scale stays P0 / P1 / P2 / P3. `5. ok` done sentence confirmed. This story is P1 at the end of that band.
- **Evidence**: `handoffs/intake_evidence/US-0163-intake-20261016T193500Z.json`. `[INTAKE_EVIDENCE_VALIDATION_OK]`. `[INTAKE_BUG_ROUTING_OK] kind=story` exit 0. No `R-` entry. No `resume_brief` refresh. Single story. Do not reopen US-0044, US-0087, or US-0156. Do not rewrite US-0157 through US-0162.
- **Next**: `/discovery` in a fresh context. This intake does not spawn it. STOP.

## Discovery handoff — US-0157 OpenCode critic hook and faulty continuation pair

- **Phase completed**: discovery. **Role**: po. **Story**: US-0157 only. **Sprint**: (none — do not create). **Verdict**: DISCOVERY_PASS (`decision_gate=false`). **Timestamp (UTC)**: 2026-10-16T20:58:30Z. **Fresh marker**: `po-US0157-discovery-20261016T205830Z-fresh`.
- **Orchestrator**: `orchestrator_run_id=auto-20261016-us0157`, `delivery_mode=ultra_lean`, `resolved_phase_plan=[spec, plan, build+verify, ship]`, `skipped_phases=[intake, plan-verify]`, `reinstatement_mode=none`, `memory_layer=pack`, `invocation_mode=auto`, `resolution_source=scratchpad`, `resolved_start_phase=discovery`. Intake already PASS (`handoffs/intake_evidence/US-0157-intake-20261015T170245Z.json`, read-only). Skipped blocked: US-0162, BUG-0026. Do not edit US-0162, BUG-0026, BUG-0029, or BUG-0036.
- **Problem lock**: OpenCode `/auto` dead-ends on the critic hook and on a faulty continuation pair. Confirmed gap: `.opencode/agents/auto.md` and `template/.opencode/agents/auto.md` allow only po, tech-lead, dev, qa, release, curator, and security. No `.opencode/commands/sovereign-critic.md`. `.cursor/commands/sovereign-critic.md` already names tech-lead. `.cursor/commands/auto.md` requires a fresh `/sovereign-critic` Task when `CROSS_MODEL_REVIEW=1`. `scripts/opencode_auto_bridge.py` is read-only for the parent pair (`RESUME_BRIEF_STALE` / `RESUME_BRIEF_UNPARSEABLE`; no parent repair; `RESUME_BRIEF_AUTO_REFRESH=0`).
- **Locks**: **D1** (AC-1) spawn a fresh tech-lead for `/sovereign-critic`; do not emit `PHASE_ROLE_CAPABILITY_MISSING` for a missing critic Task role; do not add a critic role; the critic still runs. **D2** (AC-2) the owning phase child repairs only its own invalid pair, then the flow continues. **D3** (AC-3) the orchestrator still does not write `docs/engineering/state.md` or `handoffs/resume_brief.md`; DEC-0153 stays. **D4** (AC-4) hard security denies stay hard stops; `PHASE_ROLE_CAPABILITY_MISSING` stays security-hard for a real missing capability. **D5** (AC-5) contract tests cover AC-1, AC-2, and AC-3. **D6** leave US-0162, BUG-0026, BUG-0029, BUG-0035, and BUG-0036 untouched; leave OPEN US-0158, US-0160, US-0161, and US-0163 as written; do not change `AUTONOMY_STOP_POLICY`. **D7** research stub **R-0171** only. **R-0170** untouched. No `R-` body.

## Intake handoff — BUG-0038 QA continuation-brief permission dead-end

- **Phase completed**: intake (`/intake bug`). **Role**: po. **Bug**: BUG-0038. **Verdict**: PASS (`decision_gate=false`). **Timestamp (UTC)**: 2026-10-18T00:00:00Z. **Fresh marker**: `po-BUG0038-intake-20261018T000000Z-fresh`.
- **Evidence**: `handoffs/intake_evidence/BUG-0038-intake-20261018T000000Z.json`; pre-write `python scripts/intake_evidence_validate.py --stdin` → `[INTAKE_EVIDENCE_VALIDATION_OK]`. Canonical row: `docs/product/backlog.md` `### BUG-0038`; acceptance row added unchecked.
- **Defect lock**: QA owns `qa` and `verify-work`, which must persist the DEC-0153 continuation pair, but `.opencode/agents/qa.md` lacks an allow for `handoffs/resume_brief.md`. It therefore fails `QA_RESUME_BRIEF_PERMISSION_DENIED`. The active map and its template peer are both required for parity. The parent remains spawn-only; the normal repair path cannot lawfully change the active QA map.
- **Immediate operator action**: Add `"handoffs/resume_brief.md": allow` directly below the deny-first entry in both QA agent maps, preserving byte parity. This intake does not perform that edit.
- **Discovery locks**: Preserve deny-first ordering and all security-hard denials. Do not grant the orchestrator continuation-pair or agent-map writes. Add a matrix-wide regression rule for every phase-writer role that requires the continuation brief, not QA alone. Define the precise operator-action-required diagnostic for a future permission dead-end that no authorized role can repair. Compose BUG-0016 and BUG-0035; do not reopen their completed acceptance.
- **Status**: BUG-0038 remains **OPEN**. AC-1..AC-5 remain unchecked. **Next**: `/discovery` in a fresh **po** context. STOP.
- **UX**: no new screen. Operator-visible result is the same `/auto` run continuing.
- **Options**: (1) map the critic onto the existing tech-lead Task allow, owning child rewrites only its own pair — recommended; (2) add a critic Task role — rejected; (3) skip the critic — rejected.
- **Research**: tech-lead authors **R-0171** and answers **DQ1** OpenCode tech-lead mapping, **DQ2** whether an OpenCode command file is required, **DQ3** which pair predicates the owning child may repair, **DQ4** how the orchestrator stays read-only, **DQ5** how `PHASE_ROLE_CAPABILITY_MISSING` stays security-hard, **DQ6** contract test file and markers, **DQ7** compose with DONE BUG-0036 without reopening it, **DQ8** active and template parity, **DQ9** companion DEC none unless `# US-0157` cannot hold it, **DQ10** sprint id at sprint-plan; plan-verify skipped.
- **Hot-surface**: this section is **appended** (newest at end). `--rollover --json` moved 1 (`boundary=triad-rollover|po_to_tl`, `retained_sections=26`, `retained_lines=642`, `pack_ref=handoffs/archive/po-to-tl-pack-20261016-j.md`). `--check` exit 0. This tail stayed on the hot file. State and architecture were not rolled in that pass.
- **Proof**: `rp-auto-20261016-us0157-discovery-po-20261016T205830Z` / `640f55e666c50b3c15374e1f21538dbc90343f3f0a30a17c69803baec3b14f04`; issued 2026-10-16T20:58:30Z; `proof_ttl_seconds=3600`; ttl 2026-10-16T21:58:30Z; second invocation MATCH.
- **Status**: US-0157 remains **OPEN**. AC-1..AC-5 remain `[ ]`. **Next**: `/research` in a fresh **tech-lead** context. This PO child does not spawn it. STOP.

## Discovery handoff — US-0158 OpenCode recoverable stops

- **Phase completed**: discovery. **Role**: po. **Story**: US-0158 only. **Sprint**: (none — do not create). **Verdict**: DISCOVERY_PASS (`decision_gate=false`). **Timestamp (UTC)**: 2026-10-16T22:31:01Z. **Fresh marker**: `po-US0158-discovery-20261016T223101Z-fresh`.
- **Orchestrator**: `orchestrator_run_id=auto-20261016-us0158`, `delivery_mode=ultra_lean`, `resolved_phase_plan=[spec, plan, build+verify, ship]`, `skipped_phases=[intake, plan-verify]`, `reinstatement_mode=none`, `memory_layer=pack`, `invocation_mode=auto`, `resolution_source=scratchpad`, `resolved_start_phase=discovery`. Intake already PASS (`handoffs/intake_evidence/US-0158-intake-20261015T171800Z.json`, read-only). Skipped blocked: US-0162, BUG-0026. Do not edit US-0157, US-0162, BUG-0026, BUG-0029, or BUG-0036.
- **Problem lock**: OpenCode `/auto` still stops the operator on a recoverable blocker, an AI error, an aborted phase, or a permission dead-end. Confirmed gap: `.opencode/agents/auto.md` and `template/.opencode/agents/auto.md` terminate on every hard gate, missing evidence, quality/UAT failure, security stop, or exhausted budget. The Task allow stays the seven roles; the critic hook already spawns tech-lead. `.opencode/plugins/orchestrator.ts` `runAutoLifecycle` fail-closes when spawn or the stop-matrix call is not ok, and breaks when `action === "stop"`, `stop_reason === "completed"`, or there is no next phase. `QUALITY_EVIDENCE_FAILED` and `BUDGET_EXHAUSTED` stay `security_hard`. Drain skip is not this in-run continue.
- **Locks**: **D1** (AC-1) the four classes continue in the same run; the missing-critic example stays the US-0157 tech-lead spawn; no new critic role. **D2** (AC-2) no session restart for those classes. **D3** (AC-3) `.env` and secrets still stop. **D4** (AC-4) the orchestrator still does not write `docs/engineering/state.md` or `handoffs/resume_brief.md`; DEC-0153 stays; `RESUME_BRIEF_AUTO_REFRESH=0` stays absolute; the owning child repairs only its own pair. **D5** (AC-5) contract tests cover recoverable continue versus a security-hard stop, and the write lock. **D6** quality/UAT failure and exhausted budget stay terminating; do not reopen US-0088, US-0092, US-0119, or US-0156; leave US-0157, US-0162, BUG-0026, BUG-0029, and BUG-0036 untouched; leave OPEN US-0159, US-0160, US-0161, and US-0163 as written. **D7** research stub **R-0172** only. **R-0171** untouched. No `R-` body.
- **UX**: no new screen. Operator-visible result is the same `/auto` run continuing.
- **Options**: (1) continue the four classes inside the existing Stop-Matrix, parent stays read-only — recommended; (2) flip every `security_hard` row — rejected; (3) keep the session-restart prompt and only skip the story — rejected.
- **Research**: tech-lead authors **R-0172** and answers **DQ1** which existing stop codes map to the four AC-1 classes and which stay terminating, **DQ2** where the continue path lives without a parent write, **DQ3** how a permission dead-end continues without a new critic role while a real missing capability still stops, **DQ4** how an AI error and an aborted phase continue in the same run, **DQ5** how a blocker continues while quality/UAT and budget exhaustion stay terminating, **DQ6** how the orchestrator write lock is tested, **DQ7** contract test file and markers, **DQ8** active and template parity, **DQ9** companion DEC none unless `# US-0158` cannot hold it, **DQ10** sprint id at sprint-plan; plan-verify skipped, **DQ11** compose with DONE US-0157 and DEC-0153 without rewriting them or pulling in US-0160 or US-0161.
- **Hot-surface**: this section is **appended** (newest at end). `--rollover --json` moved 1 (`boundary=triad-rollover|po_to_tl`, `retained_sections=26`, `retained_lines=645`, `pack_ref=handoffs/archive/po-to-tl-pack-20261016-k.md`). `--check` exit 0. This tail stayed on the hot file. State and architecture were not rolled in that pass.
- **Proof**: `rp-auto-20261016-us0158-discovery-po-20261016T223101Z` / `5097d04aedf6ae81fbefdd374b2f2df2e9d3672ab4a5e7ae2d3215dba72e5bf4`; issued 2026-10-16T22:31:01Z; `proof_ttl_seconds=3600`; ttl 2026-10-16T23:31:01Z; second invocation MATCH.
- **Status**: US-0158 remains **OPEN**. AC-1..AC-5 remain `[ ]`. **Next**: `/research` in a fresh **tech-lead** context. This PO child does not spawn it. STOP.

## Discovery handoff — BUG-0038 QA continuation-brief permission dead-end

- **Phase completed**: discovery. **Role**: po. **Bug**: BUG-0038 only. **Verdict**: DISCOVERY_PASS (`decision_gate=false`). **Timestamp (UTC)**: 2026-10-18T13:17:16Z. **Fresh marker**: `po-BUG0038-discovery-20261018T131716Z-fresh`.
- **Lineage**: consumed and retained the validated intake record `repair-20261018-bug0038-anchor-repair|bug|BUG-0038|intake|rp-repair-20261018-bug0038-anchor-po-20261018T131307Z-BUG-0038`; `effective_plan=[spec, plan, build+verify, ship]`; `skipped_phases=[]`; completed phases become `[intake, discovery]`; budget remains `OPEN/P0 bug BUG-0038; discovery-only; no automatic phase spawn`. Canonical backlog anchor is `docs/product/backlog.md:6293`; BUG-0038 is OPEN/P0 with AC-1..AC-5 unchecked, and its acceptance row remains unchecked.
- **Root cause and matrix lock**: the QA role owns both `qa` and `verify-work` but lacks the DEC-0153 continuation-brief allow, so either lawful boundary can fail `QA_RESUME_BRIEF_PERMISSION_DENIED`. The only repair pair is `.opencode/agents/qa.md` and `template/.opencode/agents/qa.md`; they must stay byte-identical. Every phase-writer that needs the brief belongs in regression coverage. The parent/orchestrator remains negative: it receives neither the continuation-pair nor agent-map write grant.
- **Locked approach for research**: minimum-authority option A is one narrowly scoped continuation-brief allow in both QA maps at the same deny-first position, with all existing denials/order unchanged; matrix-wide positive coverage and a negative parent/orchestrator proof. The only permissible unrepairable-map outcome is `PERMISSION_MATRIX_REPAIR_REQUIRES_OPERATOR`: name the active/template pair and missing path, make no automatic repair or pair write, and stop for authorized operator action. Reject broad seven-role grants, parent/orchestrator repair authority, DEC-0153 relaxation, and any change to `RESUME_BRIEF_AUTO_REFRESH=0` or security-hard denials.
- **Scope**: compose BUG-0016 and DONE BUG-0035 without reopening either. Do not modify agent maps, commands/plugins, DEC-0153, state/brief records, AC states, or unrelated backlog rows in discovery. No sprint, no research body, no secret access, publish, commit, push, `/auto`, or spawn.
- **DEC-0153 authority gate**: this PO agent is restricted to product artifacts and `handoffs/po_to_tl.md`; it may not append `docs/engineering/state.md` or prepend `handoffs/resume_brief.md`. Therefore no new state checkpoint or latest-pointer pair was written, and no claim of pair validation is made. This is a genuine write-authority gate, not a product decision gate; the existing intake pair remains the current valid pointer until an authorized writer performs the state-first pair update.
- **Fresh proof**: `record_key=repair-20261018-bug0038-anchor-repair|bug|BUG-0038|discovery|rp-repair-20261018-bug0038-anchor-repair-discovery-po-20261018T131716Z-BUG-0038`; `runtime_proof_id=rp-repair-20261018-bug0038-anchor-repair-discovery-po-20261018T131716Z-BUG-0038`; `proof_hash=ef623ddfcb17bdcfcbc30878a8533ea011036986764355556eff7b149791de07`; canonical tuple `{"orchestrator_run_id":"repair-20261018-bug0038-anchor-repair","phase_id":"discovery","proof_issued_at":"2026-10-18T13:17:16Z","proof_ttl_seconds":3600,"role":"po","runtime_proof_id":"rp-repair-20261018-bug0038-anchor-repair-discovery-po-20261018T131716Z-BUG-0038"}`; TTL 3600 seconds; independently recomputed SHA-256 MATCH.
- **Next**: `/research` in a fresh **tech-lead** context once an authorized actor has written and exact-tuple/proof-validated the required DEC-0153 state-first pair. This PO child does not spawn it. **STOP.**

## Discovery handoff — BUG-0037 OpenCode PO story-writer missing canonical story fields (PO → TL)

- **Phase completed**: discovery. **Role**: po. **Bug**: BUG-0037 only. **Verdict**: DISCOVERY_PASS (`decision_gate=false`). **Timestamp (UTC)**: 2026-10-20T16:41:09Z. **Fresh marker**: `po-BUG0037-discovery-20261020T164109Z-fresh`.
- **Lineage**: consumed and retained the validated intake record `ir-20261016T192729Z-storyfields` (`handoffs/intake_evidence/BUG-0037-intake-20261016T192729Z.json`, `[INTAKE_EVIDENCE_VALIDATION_OK]`, `selected_pack=small-intake-pack`, `decision_gate=false`, `resolution_source=resume_brief`). `effective_plan=[spec, plan, build+verify, ship]` (`delivery_mode=ultra_lean`); `skipped_phases=[]`; completed phases become `[intake, discovery]`. This discovery child mints the first DEC-0153 phase proof for this run.
- **Root cause (CONFIRMED, concrete file/line)**: the OpenCode PO story-creation surface is a thin stub with no canonical structured story-block template. `.opencode/agents/po.md` (19 lines; no field template) and `.opencode/commands/intake.md` (19-line dispatch-only stub ending "STOP") carry no structured story-block contract, so the OpenCode PO emits prose (`### US-0001` H3, `**Priority:**`, `**Release:**`, `**Acceptance criteria**` bullets, no `Status`) instead of the canonical structured block. The canonical structured reference is `## US-0161` at `docs/product/backlog.md` lines 6143-6177 (intake cited 6098-6133; that citation has drifted — use the live lines). The Cursor surfaces (`.cursor/agents/po.mdc` 143 lines; `.cursor/commands/intake.md` 351 lines with the full US-0051 persistence contract) DO carry the template, which is why Cursor-created stories are structured and OpenCode-created ones are prose. The "shared story writer" is the PO LLM role; there is no separate Python story-writer script (greps `story.?writer|write_story|backlog_block|story_block|build_story` → none); one-off backfill scripts are not the live writer. Scope is OpenCode-only (AC-2: Cursor/Pi are not promised user outcomes).
- **AC-4 contract-test assertion list (LOCKED)** — the contract test must assert the created story carries the canonical structured block, positively: (1) canonical H2 heading `## US-#### — <Title>` (NOT H3 `###`, NOT `# User Story`); (2) `- user_visible:`; (3) `- Title:`; (4) `- Summary:`; (5) `- Priority: P<n>`; (6) `- Status:` (the operator's headline missing field — MUST be present); (7) `- Acceptance:` header with at least one structured `  - [ ] AC-n:` bullet. Plus the shape discriminator (8): the block must NOT use the prose markers `**Priority:**`, `**Release:**`, or `**Acceptance criteria**` (fields are `- <field>:` lines, not bold-label prose). Deliberately NOT over-locked to intake-specific fields (intake_run_id, writer_id, topic_coverage) so the contract stays about shape, not provenance.
- **Remediation direction (direction only; no code edit by PO)**: **Option A (recommended)** — restore the canonical structured story-block template on the OpenCode host story-creation surface (OpenCode PO command/agent surface), minimal + additive; do not weaken the existing canonical block (`US-0161`) and do not import remote `US-0001`..`US-0004`; pair the template restoration with the AC-4 contract test. **Option B (rejected here)** — defer to a cross-host template-parity track only if it later proves the canonical template is shared and the defect is a sync failure; current evidence indicates an OpenCode-specific stub, so A is the bounded remediation.
- **Scope locks**: OpenCode-only; discovery-only; no agent-map edit (`.opencode/agents/*`, `template/**` are do-not-edit for this phase); no production code; no remote import; no US-0161 weakening/reopen; no AC tick; no commit/push/publish; no `/auto` or child spawn. Compose with BUG-0036 (OPEN `/auto` hard-stop, not reopened) and BUG-0038 (DONE) without touching either.
- **DEC-0153 state-first pair (authored by this PO phase child)**: `docs/engineering/state.md` checkpoint appended BOTTOM first, then this `handoffs/resume_brief.md` latest-pointer block prepended, only after the exact pair key and strict six-tuple proof were constructed and validated. `record_key=auto-20261020-bug0037|bug|BUG-0037|discovery|rp-auto-20261020-bug0037-discovery-po-20261020T164109Z-BUG-0037`; `runtime_proof_id=rp-auto-20261020-bug0037-discovery-po-20261020T164109Z-BUG-0037`; `proof_hash=b57f5bff9c3e95f8abf9370cd5dbdeefef6d876ee698af4c0061d035a58d57f7` (mint == independent recompute, MATCH); `proof_issued_at=2026-10-20T16:41:09Z`; `proof_ttl_seconds=3600`. `next_scheduled_phase=research`; `next_scheduled_role=tech-lead` (ultra_lean `plan` macro = research + architecture + sprint-plan).
- **Next**: parent/orchestrator validates this exact discovery pair, then spawns fresh `/research` as **tech-lead** for BUG-0037. This PO child does not spawn it. **STOP.**
