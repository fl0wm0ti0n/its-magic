# PO to TL archive pack (2026-10-07)

- Rollover trigger: `PO_TO_TL_HOT_MAX_LINES=650, PO_TO_TL_HOT_MAX_SECTIONS=60`
- Source: `handoffs/po_to_tl.md`
- Archived units (oldest first, contiguous prefix): 4
- Retained units in hot file: 19
- First archived heading: `## PO → TL handoff — BUG-0035 research-to-architecture resume-brief ownership deadlock`
- Last archived heading: `## Discovery handoff — US-0148 Stable control protocol and recoverable daemon`
- Verification tuple (mandatory):
  - archived_body_lines=171
  - retained_body_lines=625

---

## PO → TL handoff — BUG-0035 research-to-architecture resume-brief ownership deadlock

- **Phase completed**: intake (register-only). **Role**: product-owner. **Verdict**: **PO_INTAKE_PASS**. **Timestamp (UTC)**: 2026-10-03T16:00:00Z.
- **Registered**: **BUG-0035**, P0, OPEN; all seven acceptance criteria remain unchecked. Evidence: `handoffs/intake_evidence/BUG-0035-intake-20261003T160000Z.json` (`[INTAKE_EVIDENCE_VALIDATION_OK]`).
- **Observed failure**: A fresh tech-lead research child recorded `architecture` as next in `docs/engineering/state.md` and `handoffs/tl_to_dev.md`; `handoffs/resume_brief.md` retained `intake → research`. Continuation correctly stopped with `AUTO_RESUME_ERROR RESUME_BRIEF_STALE`; `RESUME_BRIEF_AUTO_REFRESH=0` prohibits automatic repair and no next spawn occurred.
- **Product finding**: This is a framework permission/ownership deadlock, not a request to weaken fail-closed resume behavior. The child may persist phase evidence but cannot update `resume_brief.md`; the spawn-only parent may spawn but cannot write phase artifacts. Therefore neither permitted actor can complete the mandated paired boundary record.
- **Duplicate boundary**: Distinct from **BUG-0005** (post-bug-intake brief refresh) and **BUG-0034** (PO closure reason-code registration). Compose **US-0023**, **US-0037**, **US-0048**, **US-0056**, **US-0119**, and **US-0124**; do not reopen them.
- **TL next action**: Run `/research` in a fresh tech-lead context. Lock a minimum-authority, auditable writer/reconciliation design for the completed-phase continuation tuple; it must preserve child/parent isolation and no-silent-fallback semantics. Then proceed through architecture and sprint planning only in their respective fresh contexts.
- **Hard guards**: Keep `RESUME_BRIEF_STALE` fail-closed for absent, malformed, contradictory, or unauthorized evidence. `RESUME_BRIEF_AUTO_REFRESH=0` remains meaningful. Do not grant broad phase-artifact access to the parent or broad handoff access to children. No status/AC is flipped by this intake.
- **STOP**: PO intake boundary complete. No research, architecture, sprint, implementation, or resume repair was executed in this context.

---

## PO → TL handoff — 3 new BUG-#### registered via intake (operator command 2026-10-03)

- **Phase completed**: intake (register-only). **Role**: product-owner (PO). **Sprint**: (none — intake does not materialize sprints). **Verdict**: **PO_INTAKE_PASS** (stop_reason=intake_pass). **decision_gate**: see §4 below (operator/TL to decide).
- **Timestamp (UTC)**: 2026-10-03T15:36:00Z. **Fresh marker**: `po-BUG0032-intake-20261003T153600Z-fresh` (grep-verified 0 prior occurrences repo-wide; BUG-0006 / US-0048 fresh-context contract).
- **Orchestrator**: `orchestrator_run_id=auto-20261003-po-intake`, explicit operator command "spawn an intake command process to register the Stories/Bugs" (not `/auto` continuation), `INTAKE_AUTONOMY_MODE=0`, `INTAKE_SUBAGENT_FALLBACK=deny` (config.json L145-L146, L323-L324) — **no subagent spawned; intake done inline**.
- **Sibling boundary**: **US-0156 DONE / US-0154-US-0155 OPEN / US-0045 / US-0119 / US-0120 / US-0122 / US-0124 / US-0125 / US-0126 / BUG-0016 / BUG-0022 / BUG-0026 / BUG-0027 / BUG-0028 / BUG-0029 / BUG-0030 / BUG-0031 all UNTOUCHED** (guard list `handoffs/resume_brief.md` L30-L33 preserved). **Do NOT drain, re-flip, or mutate any of them** — this intake is additive-only (3 new rows).

### Registered (next-sequence ID assignment per `bug_issue_lib.next_bug_id`; `--print-next-id` advanced BUG-0031→BUG-0035)

| ID | Priority | Title (one-line) | Backlog | Acceptance row |
| --- | --- | --- | --- | --- |
| **BUG-0032** | **P0** | Scratchpad/config-baseline drift on `AUTONOMY_PRESET` / `AUTONOMY_STOP_POLICY` + drift-detect contract test | `docs/product/backlog.md` L5673 (`### BUG-0032`, `Status: OPEN`, AC-1..AC-7 all `[ ]`) | `docs/product/acceptance.md` (new `- [ ]` row after BUG-0031) |
| **BUG-0033** | **P1** | Thin→rich command-pair parity on `.opencode/commands/{closure,ask,auto,refresh-context,execute}.md` (copy `## Fail-safe reason codes` + `## Stop conditions` from `.cursor/commands/*`) | `docs/product/backlog.md` L5694 (`### BUG-0033`, `Status: OPEN`, AC-1..AC-8 all `[ ]`) | `docs/product/acceptance.md` (new `- [ ]` row after BUG-0032) |
| **BUG-0034** | **P1** | Register un-registered token `PO_CLOSURE_PRECONDITION_CONFLICT` in `scripts/data/autonomy_stop_matrix.yaml` + reason_codes.md US-row + runbook remediation + repair-ledger integration | `docs/product/backlog.md` L5716 (`### BUG-0034`, `Status: OPEN`, AC-1..AC-7 all `[ ]`) | `docs/product/acceptance.md` (new `- [ ]` row after BUG-0033) |

### Provenance (operator-directed candidates, surfaced by a prior session `/ask` audit)

- **BUG-0032**: `.its-magic/config.json` L317-L320 (`AUTONOMY_PRESET: full`, `AUTONOMY_STOP_POLICY: auto_repair_then_block` — baseline) vs `.cursor/scratchpad.md` L639-L640 (`AUTONOMY_PRESET=none`, `AUTONOMY_STOP_POLICY=block` — live) diverge despite config.json L1-L6 "Values mirrored from .cursor/scratchpad.md" claim. Operator-intent trace: `.cursor/scratchpad copy.md` L640 (`auto_repair_then_block` used once). Compose US-0119 (shipped; no reopen), US-0131/DEC-0131 (cross-host config baseline), US-0017 (template drift guard precedent). **Live values are NOT mutated by this intake — that is operator action; BUG-0032 is drift-detect + remediation only.**
- **BUG-0033**: `.opencode/commands/closure.md` (557b, no `## Fail-safe reason codes` / `## Stop conditions`) vs `.cursor/commands/closure.md` (10252b, both sections present); same drift pattern confirmed for the ask/auto/refresh-context/execute pairs (186/2297/517/365b thin vs 2914/39231/5793/23328b rich). Compose US-0120 (closure phase), US-0125 (thin opencode commands + validator bridge), US-0126 (reason codes + `--scope=opencode-adapter` parity), US-0156 (OpenCode `/auto` parity), BUG-0031 (byte-identical active+template precedent).
- **BUG-0034**: Operator observation "Po Task — Finalize US-0108 product closure — Stopped fail-closed: **PO_CLOSURE_PRECONDITION_CONFLICT**". Grep across `*.md|*.yaml|*.json|*.py|*.jsonl` = **0 hits** (not in `scripts/data/autonomy_stop_matrix.yaml`, not in `docs/engineering/reason_codes.md`, not in `docs/engineering/runbook.md`). Compose US-0119 (autonomy stop matrix + 12 per-feature flags + bounded auto-repair ledger), US-0120 (closure phase — the trigger surface), BUG-0031 (closure-role permission — related, distinct), DEC-0119 (autonomy repair matrix).

### Intake evidence (3 durable artifacts, all `[INTAKE_EVIDENCE_VALIDATION_OK]` exit 0)

- `handoffs/intake_evidence/BUG-0032-intake-20261003T153600Z.json` (small-intake-pack; INTAKE_WORK_ITEM_KIND=bug; 5 topics covered distinct-quoted)
- `handoffs/intake_evidence/BUG-0033-intake-20261003T153600Z.json` (small-intake-pack; INTAKE_WORK_ITEM_KIND=bug; 5 topics covered distinct-quoted)
- `handoffs/intake_evidence/BUG-0034-intake-20261003T153600Z.json` (small-intake-pack; INTAKE_WORK_ITEM_KIND=bug; 5 topics covered distinct-quoted)

### TL action (next phases per bug, in priority order; do NOT auto-continue from intake)

**3 new BUG-#### registered via intake; TL must run `/research` then `/architecture` then `/sprint-plan` on each (or batch if priority-order allows); do NOT auto-continue from intake.** Per bug:

1. **BUG-0032 (P0)** — `/research`: pick `check_intake_template_parity.py --scope=autonomy-flags` shape; decide whether `AUTONOMY_FLAGS_DRIFT` is a new additive reason token (compose US-0126, not US-0119); pin the CI harness wiring point. Then `/architecture` for the additive `# BUG-0032` H1 (DEC-0054 triad). Then `/sprint-plan` to materialize S0xxx + 6 tasks + 8 `test_bug0032_*` markers.
2. **BUG-0033 (P1)** — `/research`: lock the exact section text to copy from each rich `.cursor/commands/*.md` counterpart (closure-first); define the active↔template byte-parity test shape (BUG-0031 precedent, 837b delta). Then `/architecture` for the additive `# BUG-0033` H1. Then `/sprint-plan` to materialize S0xxx + 8 tasks + 8 `test_bug0033_*` markers.
3. **BUG-0034 (P1)** — `/research`: **DECISION-GATE: pick `auto_repair_kind=disambiguate_state` OR `auto_refresh_brief`** (see §4); pin the ledger integration point (`scripts/autonomy_repair_lib.py` or active surface). Then `/architecture` for the additive `# BUG-0034` H1. Then `/sprint-plan` to materialize S0xxx + 8 tasks + 8 `test_bug0034_*` markers.

### Hard guards (this intake)

- **Validator**: `python scripts/bug_issue_validate.py --repo . --check-acceptance` **exit 0** pre-write **and** post-write; `--print-next-id` advanced **BUG-0031→BUG-0035** (confirming 3 rows in ascending order).
- **Intake evidence**: all 3 JSON files `[INTAKE_EVIDENCE_VALIDATION_OK]` exit 0.
- **Proof (DEC-0038 / US-0056)**: `runtime_proof_id=rp-auto-20261003-po-intake-poi-20261003T153600Z-POINTAKE`; `proof_hash=059DF906BE1B6467D4C2D562E3F1DDD421FF56CE11E04941ACE6C54B1AEAF458` (64-hex uppercase); `proof_ttl=3600s`; **independently recompute-confirmed (true)**; `compute_strict_proof_hash` from `scripts/token_cost_lib.py`.
- **Untouched**: US-0156 DONE (L185 `[x]`) / US-0154-US-0155 OPEN / US-0045-US-0126 / BUG-0016-BUG-0031 (all DONE rows, all OPEN rows, all sibling blocks); no live probe; no npm publish; no git push; no `.env` read; no subagent spawn (INTAKE_SUBAGENT_FALLBACK=deny); no spawner recursion (no `/auto`, no Task); no `decisions/DEC-*` authored; no `R-xxxx` allocated; no sprint materialized; no `# BUG-0032/0033/0034` H1 in architecture.md; no `test_bug0032_*/0033_*/0034_*` authored (that is sprint-plan/execute's job).
- **Files mutated (THIS INTAKE)**: `docs/product/backlog.md` (3 new blocks appended to `## Bug issues (canonical)`), `docs/product/acceptance.md` (3 new `- [ ]` rows appended to `## Bug acceptance (canonical)`), `handoffs/intake_evidence/BUG-0032-intake-20261003T153600Z.json` (NEW), `handoffs/intake_evidence/BUG-0033-intake-20261003T153600Z.json` (NEW), `handoffs/intake_evidence/BUG-0034-intake-20261003T153600Z.json` (NEW), `handoffs/po_to_tl.md` (this PO→TL handoff PREPENDED above prior "Architecture handoff — US-0145" entry, which is preserved below), `handoffs/resume_brief.md` (PO_INTAKE_PASS top pointer PREPENDED, prior US-0156 SEGMENT_TERMINAL entry preserved below), `docs/engineering/state.md` (one intake-checkpoint block APPENDED at the very bottom, append-never-rewrite).

### Decision gates (operator / TL — NOT decided by this intake)

1. **BUG-0034 repair-kind choice**: `auto_repair_kind=disambiguate_state` (US-0119 STATE_PHASE_AMBIGUOUS analogue; matrix L196-L200 "pick last-known phase is safe when unambiguous") **OR** `auto_repair_kind=auto_refresh_brief` (US-0119 RESUME_BRIEF_MISSING analogue; matrix L202-L206 "regenerate brief from state.md is safe when RESUME_BRIEF_AUTO_REFRESH=1") — **TL decides in `/research`**.
2. **Priority ordering**: as registered — **BUG-0032 (P0) → BUG-0033 (P1) → BUG-0034 (P1)**; operator may re-order or batch `/research` runs.
3. **BUG-0033 scope**: closure-first per operator direction; ask/auto/refresh-context/execute are the same bug (one vertical parity fix). The remaining thin/rich pairs (intake, qa, verify-work, discovery, sprint-plan, research, plan-verify, quick, release, architecture) — same story's `/research` audit or follow-up slice — **TL chooses**.

### Stop (PO_INTAKE_PASS)

**STOP after PO_INTAKE_PASS** — intake-boundary terminal per kit intake-boundary contract (BUG-0006 / US-0048 isolation). No downstream phase executed. Operator / orchestrator owns the next segment.

---

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

