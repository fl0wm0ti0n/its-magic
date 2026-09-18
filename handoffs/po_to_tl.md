## Architecture handoff — US-0146 CLI, TUI, and operational observability

- **Phase completed**: architecture. **Role**: tech-lead. **Story**: US-0146 only. **Sprint**: (pending — expected S0153 at `/sprint-plan`). **Verdict**: PASS (`decision_gate=false`).
- **Timestamp (UTC)**: 2026-09-17T18:50:00Z. **Fresh marker**: `tl-US0146-architecture-20260917T185000Z-fresh`.
- **Orchestrator**: `orchestrator_run_id=auto-20260917-us0146`, parent=`auto-20260913-us0144`, `delivery_mode=ultra_lean`, resolved_phase_plan=`[spec, plan, build+verify, ship]`, macro=`plan`, `model_id=inherit` (CROSS_MODEL_REVIEW=0), AUTO_QUIET=1, AUTO_FLOW_MODE=full_autonomy, AUTO_SOVEREIGN=0, FRAMEWORK_KIT_REPO=1, drain story 1 of 3 (`backlog_drain_stories_remaining_budget=2`).
- **Sibling boundary**: **US-0140..US-0144 DONE** — compose only. **US-0145 / US-0147 / US-0148 OPEN** — OUT OF SCOPE. **BUG-*** compose only; do not drain BUG-0022. Do not restore `.opencode/commands/auto.md`. No kit `cli.json` or plugin `its-magic-auto/tui.json`.
- **Research consumed**: `docs/engineering/research.md` **`## R-0143`** (A1; DQ1–DQ10 LOCKED). Producer proof `rp-auto-20260917-us0146-research-techlead-20260917T184200Z-US-0146` / `75561131E844072FCD975F9A74C3831DF311E87074406C21B014EA42A69ACEDA` — MATCH; not STALE at consume.
- **Approach**: **A1 (A\*)** Accepted in **`DEC-0146`** + H1 **`# US-0146`**. Sibling cli+tui; `runtime-core/src/operator/` facades; auth-only Pi; in-process `OperatorSession`; log cap 200 lines / 32 KiB; TUI **readline + ANSI**.
- **Tests (architecture-owned)**: nine `test_us0146_*` IDs in `DEC-0146` and `# US-0146` Test contract.
- **Next**: `/sprint-plan` materializes **S0153** (fresh tech-lead). Do **not** spawn sprint-plan from this architecture chat. CROSS_MODEL_REVIEW=0 — no sovereign-critic.

### Runtime proof (DEC-0038)

- `runtime_proof_id=rp-auto-20260917-us0146-architecture-techlead-20260917T185000Z-US-0146`
- `proof_hash=5CD3C53F4B194541E3182C1DC53FE3D0C83FE3BEF986B10B509F922E5ED829F1`
- `proof_ttl=2026-09-17T19:50:00Z`
- Canonical hashed payload: `{"orchestrator_run_id":"auto-20260917-us0146","phase_id":"architecture","proof_issued_at":"2026-09-17T18:50:00Z","proof_ttl_seconds":3600,"role":"tech-lead","runtime_proof_id":"rp-auto-20260917-us0146-architecture-techlead-20260917T185000Z-US-0146"}`
- Consumed research producer proof: `rp-auto-20260917-us0146-research-techlead-20260917T184200Z-US-0146` / `75561131E844072FCD975F9A74C3831DF311E87074406C21B014EA42A69ACEDA` — MATCH; not STALE at `2026-09-17T18:50:00Z`

### Isolation + stop

- `phase_id=architecture`, `role=tech-lead`, `story_id=US-0146`, `model_id=inherit`, `fresh_context_marker=tl-US0146-architecture-20260917T185000Z-fresh`
- `evidence_ref=docs/engineering/architecture.md # US-0146; decisions/DEC-0146.md; docs/engineering/research.md ## R-0143; docs/engineering/state.md architecture checkpoint; handoffs/resume_brief.md`
- **Hot-surface note**: Appended architecture handoff at true end. `arch_linkage_guard.py` --pre/--post around `# US-0146` append. `--rollover --json` archived `architecture-pack-20260917.md` (moved=1; retained_story_sections=21; `# US-0146` at hot end) + state `state-pack-20260917-b.md`. `--check-arch-heading-policy --baseline-h2-count 0` PASS. final `--check` PASS.
- **Status**: US-0146 remains **OPEN**. AC-1..AC-8 remain unchecked. **Next**: `/sprint-plan` in fresh **tech-lead** subagent. STOP.

## Discovery handoff — US-0147 Installation, update, and existing-project adoption

- **Phase completed**: discovery. **Role**: po. **Story**: US-0147 only. **Sprint**: (pending — expected S0154 at `/sprint-plan`). **Verdict**: PASS (`decision_gate=false`).
- **Timestamp (UTC)**: 2026-09-17T20:26:30Z. **Fresh marker**: `po-US0147-discovery-20260917T202630Z-fresh`.
- **Orchestrator**: `orchestrator_run_id=auto-20260917-us0146`, parent=`auto-20260913-us0144`, `delivery_mode=ultra_lean`, resolved_phase_plan=`[spec, plan, build+verify, ship]`, reinstatement_mode=`none`, memory_layer=`pack`, macro=`spec` (intake already DONE — not re-intaken; `handoffs/intake_evidence/US-0133-0148-intake-20260911.json` held, not mutated), `model_id=inherit` (MODEL_RESOLVE=alias_only; CROSS_MODEL_REVIEW=0), AUTO_QUIET=1, AUTO_FLOW_MODE=full_autonomy, AUTO_SOVEREIGN=0, FRAMEWORK_KIT_REPO=1, EARLY_RESEARCH=0, drain story **2 of 3** (`backlog_drain_stories_remaining_budget=1`; AUTO_BACKLOG_MAX_STORIES=3). Selection: US-0146 **DONE** / S0153 released → **US-0147** (OPEN P0). US-0145/US-0148 P1 OUT of this segment.
- **Sibling boundary**: **US-0140..US-0146 DONE** — compose only (US-0146 `itsm`/CLI/TUI wiring IN); do not reopen. **US-0145 / US-0148 OPEN** — OUT OF SCOPE (do not mutate bodies). **BUG-0022 OPEN** — do not drain. Do not build new Cursor/OpenCode adapters. Do not npm-publish, git push, or read `.env`.
- **Gap confirmed (narrow-read)**: Kit installers still template-focused; standalone operator surface exists in-repo (US-0146) but lacks unified product install/update/adoption path with pinned runtime deps, browser prerequisites, kernel-contract metadata, and non-destructive existing-repo detection.

### Discovery locks D1–D10

| ID | Lock |
|----|------|
| **D1** | Extend triple-installer parity + `installer-owned-paths.manifest` (compose US-0008/US-0018) to bootstrap/wire standalone **`itsm`** + runtime from `standalone/`. Installers remain copy/bootstrap orchestrators — **do not** rewrite `.cursor/` or `.opencode/` host trees. |
| **D2** | AC-1 Win/Linux install/update installs CLI/runtime, pinned standalone deps (kernel-contract + US-0134 compose), browser prerequisites (Playwright = architecture DQ), kernel compatibility metadata, rollback guidance. |
| **D3** | AC-2 fresh projects initialize required artifact structures via `template/` — **no** US-0001..US-0132 backlog clone (masterplan §33). |
| **D4** | AC-3 detect/adopt existing its-magic repos (`.its-magic-version`, canonical trees) without rewriting canonical artifacts; scratchpad migration **not** required at first adopt (§13.2 timing → architecture). |
| **D5** | AC-4 Cursor/OpenCode remain compatibility paths; standalone does not require either host; **no** new host adapter work (story boundary). |
| **D6** | AC-5 preservation — never overwrite/copy local config, credentials, browser profiles, project source, or user artifacts into tracked templates (compose US-0018 user-data vs framework split). |
| **D7** | AC-6 compatibility diagnostics: kernel/runtime mismatch, unavailable host capabilities, migration actions, safe rollback — reason codes architecture-locked (US-0134 handshake compose). |
| **D8** | AC-7 operator docs in `docs/engineering/runbook.md` + `template/` parity: fresh setup, auth (US-0135), adoption, coexistence (§3), update, uninstall, troubleshooting. |
| **D9** | AC-8 lifecycle tests `test_us0147_*`: fresh install, upgrade, Cursor-only/OpenCode-only/both adoption, interrupted update, preservation, uninstall on Win/Linux; installer parity tests compose US-0055. |
| **D10** | OUT: US-0145 parallel/deploy; US-0148 daemon/protocol; **new** Cursor/OpenCode adapters; npm-publish; git push; `.env`. Research stub **R-0144** (PO does not author `## R-0144`; **R-0143**=US-0146 — do not wipe). Companion **DEC-0147** + `# US-0147` at `/architecture` only. Expected sprint **S0154**. |

### Research questions DQ1–DQ10 (for `/research` → expect **R-0144**; stub only here)

1. **DQ1**: Standalone packaging — how `standalone/` workspace artifacts (`itsm` bin, pinned Pi/kernel-bridge) ship via kit `files` vs post-install build vs prebuilt bundle; FRAMEWORK_KIT_REPO constraints.
2. **DQ2**: Installer extension vs sibling script — what changes in `installer.ps1`/`installer.sh`/`installer.py` vs new `standalone` install entrypoint; triple parity bar.
3. **DQ3**: Adoption detector — signals for existing Cursor-only, OpenCode-only, both-host repos; fail-closed vs advisory modes.
4. **DQ4**: Fresh init template set — minimal artifact skeleton without historical backlog; relationship to `template/` and US-0133 bootstrap stories.
5. **DQ5**: Preservation matrix — authoritative framework-owned vs user-owned paths; upgrade mode interaction with US-0018; interrupted update recovery.
6. **DQ6**: Kernel/runtime compatibility — `kernel-contract.json` delivery, version handshake, mismatch diagnostics (compose US-0134).
7. **DQ7**: Browser prerequisites — Playwright install strategy Win/Linux; offline/airgap posture; rollback when browser setup fails.
8. **DQ8**: Scratchpad/config coexistence — §13.2 `LegacyScratchpadAdapter` scope for v1 install story vs defer; migration diagnostics without forced rewrite.
9. **DQ9**: Uninstall + rollback — what is removed vs preserved; coexistence with host-installed kit versions.
10. **DQ10**: Tests — `test_us0147_*` matrix covering AC-1..AC-8; CI harness for installer lifecycle. **R-id live-inventory**: allocate **R-0144**; do not wipe **R-0143** (US-0146).

### Design refs

- `docs/product/standalone-its-magic-pi-masterplan.md` §3, §13.2, §32 Phase 8, §37, §39, §43
- Compose: US-0146 **DONE** (`standalone/apps/cli`, `tui`, operator facades); US-0134 kernel-bridge handshake; US-0135 auth; US-0008/US-0018 installers; US-0055 installer QA patterns; `its_magic/kernel-contract.json`
- Intake (read-only): `handoffs/intake_evidence/US-0133-0148-intake-20260911.json` (`standalone-installation-migration` → US-0147)

### Research stub (PO does not author `docs/engineering/research.md`)

- **Expected next R-id**: **R-0144** (`ID_NAMESPACE_BOOTSTRAP=0`; highest existing heading is **R-0143** US-0146).
- Do **not** author `## R-0144` this phase. Do **not** wipe **R-0143**. Do **not** reuse R-0143 for US-0147 body.
- Companion **DEC-0147** + `# US-0147` at `/architecture` only — PO does not author them.
- Expected sprint **S0154** at `/sprint-plan` only (S0153 = US-0146 released — do not reuse).

### Runtime proof (DEC-0038)

- `runtime_proof_id=rp-auto-20260917-us0146-discovery-po-20260917T202630Z-US-0147`
- `proof_hash=E4BFB3F6E8C862AB6870B31EE226FE09254916918EE3638977AE05C0070BDA91`
- `proof_ttl=2026-09-17T21:26:30Z`
- Hash via `from scripts.token_cost_lib import compute_strict_proof_hash` (positional; compact sorted-key JSON).
- Canonical hashed payload: `{"orchestrator_run_id":"auto-20260917-us0146","phase_id":"discovery","proof_issued_at":"2026-09-17T20:26:30Z","proof_ttl_seconds":3600,"role":"po","runtime_proof_id":"rp-auto-20260917-us0146-discovery-po-20260917T202630Z-US-0147"}`
- Isolation extras (not hashed): `delivery_mode=ultra_lean`, `macro_phase=spec`, `model_id=inherit`, `sprint_id=none`, `story_id=US-0147`, `skipped_phases=[intake]`, `CROSS_MODEL_REVIEW=0`, `native_chain_active=true`, `native_chain_continuing=true`, `drain_story_index=2 of 3`
- `hash_recompute_confirmation=true` (compute_strict_proof_hash → e4bfb3f6e8c862ab6870b31ee226fe09254916918ee3638977ae05c0070bda91; independently MATCH; **64 hex** verified; stored uppercase)

### Isolation + stop

- `phase_id=discovery`, `role=po`, `story_id=US-0147`, `model_id=inherit`, `fresh_context_marker=po-US0147-discovery-20260917T202630Z-fresh`
- `evidence_ref=docs/product/backlog.md ## US-0147 discovery_notes; docs/product/vision.md ## Discovery Notes — US-0147; this handoff; docs/engineering/state.md discovery checkpoint; handoffs/resume_brief.md; handoffs/intake_evidence/US-0133-0148-intake-20260911.json (read-only)`
- **Hot-surface note**: Appended at true end. Post-append `--check` STATE_ARCHIVE_REQUIRED po_to_tl 706/650 → `--rollover --json` archived to `handoffs/archive/po-to-tl-pack-20260917-b.md` (moved=1; retained_lines=639). State pre-rollover `state-pack-20260917-j.md`. `arch_linkage_guard.py` not run. final `--check` PASS.
- **Status**: US-0147 remains **OPEN**. AC-1..AC-8 remain unchecked. Acceptance.md US-0147 row unchecked. **Next**: `/research` in fresh **tech-lead** subagent. CROSS_MODEL_REVIEW=0 — do not spawn sovereign-critic. Do not spawn research from this discovery chat. STOP.

## Research handoff — US-0147 Installation, update, and existing-project adoption

- **Phase completed**: research. **Role**: tech-lead. **Story**: US-0147 only. **Sprint**: (pending — expected S0154 at `/sprint-plan`). **Verdict**: PASS (`decision_gate=false`).
- **Timestamp (UTC)**: 2026-09-17T20:30:00Z. **Fresh marker**: `tl-US0147-research-20260917T203000Z-fresh`.
- **Orchestrator**: `orchestrator_run_id=auto-20260917-us0146`, parent=`auto-20260913-us0144`, `delivery_mode=ultra_lean`, resolved_phase_plan=`[spec, plan, build+verify, ship]`, macro=`plan` (research = first of research+architecture+sprint-plan), `model_id=inherit` (MODEL_RESOLVE=alias_only; CROSS_MODEL_REVIEW=0), AUTO_QUIET=1, AUTO_FLOW_MODE=full_autonomy, AUTO_SOVEREIGN=0, FRAMEWORK_KIT_REPO=1, EARLY_RESEARCH=0, drain story **2 of 3** (`backlog_drain_stories_remaining_budget=1`).
- **Sibling boundary**: **US-0140..US-0146 DONE** — compose only (US-0146 install wiring IN). **US-0145 / US-0148 OPEN** — OUT OF SCOPE. **BUG-0022 OPEN** — do not drain. Do not build new Cursor/OpenCode adapters. No npm-publish, git push, or `.env` reads.
- **Research anchor**: `docs/engineering/research.md` **`## R-0144`**. Do not wipe **R-0143** (US-0146 delivered). Discovery D1–D10 unchanged on backlog.
- **Approach**: **A1 (A\*)** — triple-installer + manifest extension; template-mirrored `.its-magic/standalone/` workspace; `bootstrap_standalone_runtime_installer_hook`; `itsm` shim; kernel-bridge preflight + `runtime-metadata.json`; explicit `itsm setup browser`; adoption classifier compose US-0134 locate; no host tree rewrite.
- **Companion DEC**: **DEC-0147** at `/architecture` only — do **not** author/mutate `decisions/DEC-0147.md` this phase. Do **not** author `# US-0147`.

### Closed questions DQ1–DQ10

| DQ | Topic | Resolution | LOCK |
|----|-------|------------|------|
| DQ1 | Standalone packaging | Template mirror + `.its-magic/standalone/`; kit `files` omit root standalone | LOCKED |
| DQ2 | Installer extension | `installer.py` hook + PS1/sh parity; repair via upgrade bootstrap | LOCKED |
| DQ3 | Adoption detector | Three-marker locate + host profiles; fail-closed partial markers | LOCKED |
| DQ4 | Fresh init | Template skeleton; no US-0001..0132 backlog clone | LOCKED |
| DQ5 | Preservation | Manifest refresh vs deny_overwrite; staged rollback | LOCKED |
| DQ6 | Kernel compatibility | Preflight handshake + metadata file | LOCKED |
| DQ7 | Browser prereq | Explicit `itsm setup browser`; no silent CI download | LOCKED |
| DQ8 | Scratchpad coexistence | No forced migration v1; WARN only | LOCKED |
| DQ9 | Uninstall | Remove standalone tree/shims; preserve hosts + user layers | LOCKED |
| DQ10 | Tests + kit | 10 `test_us0147_*`; **R-0144**; S0154 at sprint-plan | LOCKED |

### Architecture seeds (preview)

- `/architecture` authors `# US-0147` + **DEC-0147** Accepted; pins manifest paths, hook order, shim locations, reason codes.
- `/sprint-plan` materializes **S0154** (≤12 tasks from architecture seeds).
- Do not implement application code this phase.

### Runtime proof (DEC-0038)

- `runtime_proof_id=rp-auto-20260917-us0146-research-techlead-20260917T203000Z-US-0147`
- `proof_hash=96C81771F5CE812898410E6F551A0C209475E9F31696EA13B07E7CDB1FC39237`
- `proof_ttl=2026-09-17T21:30:00Z`
- Hash via `from scripts.token_cost_lib import compute_strict_proof_hash` (positional; compact sorted-key JSON).
- Canonical hashed payload: `{"orchestrator_run_id":"auto-20260917-us0146","phase_id":"research","proof_issued_at":"2026-09-17T20:30:00Z","proof_ttl_seconds":3600,"role":"tech-lead","runtime_proof_id":"rp-auto-20260917-us0146-research-techlead-20260917T203000Z-US-0147"}`
- Isolation extras (not hashed): `delivery_mode=ultra_lean`, `macro_phase=plan`, `model_id=inherit`, `sprint_id=none`, `story_id=US-0147`, `skipped_phases=[intake]`, `CROSS_MODEL_REVIEW=0`, `native_chain_active=true`, `native_chain_continuing=true`, `drain_story_index=2 of 3`
- `hash_recompute_confirmation=true` (compute_strict_proof_hash → 96c81771f5ce812898410e6f551a0c209475e9f31696ea13b07e7cdb1fc39237; independently MATCH; **64 hex** verified; stored uppercase)
- Consumed discovery producer proof: `rp-auto-20260917-us0146-discovery-po-20260917T202630Z-US-0147` / `E4BFB3F6E8C862AB6870B31EE226FE09254916918EE3638977AE05C0070BDA91` — MATCH; not STALE at `2026-09-17T20:30:00Z`

### Isolation + stop

- `phase_id=research`, `role=tech-lead`, `story_id=US-0147`, `model_id=inherit`, `fresh_context_marker=tl-US0147-research-20260917T203000Z-fresh`
- `evidence_ref=docs/engineering/research.md ## R-0144; docs/engineering/state.md research checkpoint; handoffs/resume_brief.md; docs/product/backlog.md ## US-0147 discovery_notes (D1–D10 read-only)`
- **Status**: US-0147 remains **OPEN**. AC-1..AC-8 remain unchecked. **Next**: `/architecture` in fresh **tech-lead** subagent. CROSS_MODEL_REVIEW=0 — do not spawn sovereign-critic. STOP before implementation.

## Architecture handoff — US-0147 Installation, update, and existing-project adoption

- **Phase completed**: architecture. **Role**: tech-lead. **Story**: US-0147 only. **Sprint**: (pending — expected S0154 at `/sprint-plan`). **Verdict**: PASS (`decision_gate=false`).
- **Timestamp (UTC)**: 2026-09-17T20:40:00Z. **Fresh marker**: `tl-US0147-architecture-20260917T204000Z-fresh`.
- **Orchestrator**: `orchestrator_run_id=auto-20260917-us0146`, parent=`auto-20260913-us0144`, `delivery_mode=ultra_lean`, resolved_phase_plan=`[spec, plan, build+verify, ship]`, macro=`plan` (architecture = second of research+architecture+sprint-plan), `model_id=inherit` (CROSS_MODEL_REVIEW=0), AUTO_QUIET=1, AUTO_FLOW_MODE=full_autonomy, AUTO_SOVEREIGN=0, FRAMEWORK_KIT_REPO=1, drain story **2 of 3** (`backlog_drain_stories_remaining_budget=1`).
- **Sibling boundary**: **US-0140..US-0146 DONE** — compose only (US-0146 `itsm`/CLI/TUI wiring IN). **US-0145 / US-0148 OPEN** — OUT OF SCOPE (do not mutate bodies). **BUG-0022 OPEN** — do not drain. Do not restore `.opencode/commands/auto.md`. No kit `cli.json` or plugin `its-magic-auto/tui.json`.
- **Architecture anchor**: `docs/engineering/architecture.md` **`# US-0147`**. **Companion DEC**: **DEC-0147** Accepted (`decisions/DEC-0147.md`).
- **Approach**: **A1 (A\*) LOCKED** per **R-0144** DQ1–DQ10. Template mirror `.its-magic/standalone/`; `bootstrap_standalone_runtime_installer_hook`; `itsm` shim; kernel preflight + `runtime-metadata.json`; `classifyProjectAdoptionProfile`; explicit `itsm setup browser`; `uninstall-standalone`.

### Locked design (A1)

- Triple-installer + `installer-owned-paths.manifest` extension; post-install hook order pinned (after host-config refresh, before runbook bootstrap).
- Ten `test_us0147_*` contract markers; expected sprint **S0154** (≤12 tasks from T-anch..T-011 seeds).
- Reason codes: `STANDALONE_BOOTSTRAP_FAILED`, `ADOPT_PARTIAL_MARKERS`, `INSTALL_INTERRUPTED_ROLLBACK_OK`, `INSTALL_BROWSER_OFFLINE`, `SCRATCHPAD_LEGACY_KEYS_PRESENT`, `KIT_VERSION_COEXISTENCE`; compose `KERNEL_*`.

### Runtime proof (DEC-0038)

- `runtime_proof_id=rp-auto-20260917-us0146-architecture-techlead-20260917T204000Z-US-0147`
- `proof_hash=90A68CD12FB24348890E4DCE47CDCE639736C67C6D91F3914542BFF282A366AD`
- `proof_ttl=2026-09-17T21:40:00Z`
- Canonical hashed payload: `{"orchestrator_run_id":"auto-20260917-us0146","phase_id":"architecture","proof_issued_at":"2026-09-17T20:40:00Z","proof_ttl_seconds":3600,"role":"tech-lead","runtime_proof_id":"rp-auto-20260917-us0146-architecture-techlead-20260917T204000Z-US-0147"}`
- `hash_recompute_confirmation=true` (compute_strict_proof_hash → 90A68CD12FB24348890E4DCE47CDCE639736C67C6D91F3914542BFF282A366AD; independently MATCH; **64 hex** verified; stored uppercase)
- Consumed research proof: `rp-auto-20260917-us0146-research-techlead-20260917T203000Z-US-0147` / `96C81771F5CE812898410E6F551A0C209475E9F31696EA13B07E7CDB1FC39237` — MATCH; not STALE at `2026-09-17T20:40:00Z`

### Isolation + stop

- `phase_id=architecture`, `role=tech-lead`, `story_id=US-0147`, `model_id=inherit`, `fresh_context_marker=tl-US0147-architecture-20260917T204000Z-fresh`
- `evidence_ref=docs/engineering/architecture.md # US-0147; decisions/DEC-0147.md; docs/engineering/research.md ## R-0144; docs/engineering/state.md architecture checkpoint; handoffs/resume_brief.md`
- **Hot-surface note**: Appended architecture handoff at true end. Post-append `--rollover --json` archived `architecture-pack-20260917-a.md` + `state-pack-20260917-k.md` + `po-to-tl-pack-20260917-c.md`. `--check-arch-heading-policy --baseline-h2-count 0` PASS. final `--check` PASS.
- **Status**: US-0147 remains **OPEN**. AC-1..AC-8 remain unchecked. **Next**: `/sprint-plan` in fresh **tech-lead** subagent. CROSS_MODEL_REVIEW=0 — do not spawn sovereign-critic. STOP before implementation.

## Sprint-plan handoff — US-0147 Installation, update, and existing-project adoption

- **Phase completed**: sprint-plan. **Role**: tech-lead. **Story**: US-0147 only. **Sprint**: **S0154** (materialized). **Verdict**: PASS (`SPRINT_PLAN_PASS`; `decision_gate=false`).
- **Timestamp (UTC)**: 2026-09-17T20:50:00Z. **Fresh marker**: `tl-US0147-sprintplan-20260917T205000Z-fresh`.
- **Orchestrator**: `orchestrator_run_id=auto-20260917-us0146`, parent=`auto-20260913-us0144`, `delivery_mode=ultra_lean`, resolved_phase_plan=`[spec, plan, build+verify, ship]`, macro=`plan` (sprint-plan terminal for plan macro), `model_id=inherit` (CROSS_MODEL_REVIEW=0), AUTO_QUIET=1, drain story **2 of 3** (`backlog_drain_stories_remaining_budget=1`).
- **Sibling boundary**: **US-0140..US-0146 DONE** — compose only. **US-0145 / US-0148 OPEN** — OUT OF SCOPE. **BUG-0022 OPEN** — not drained. No kit `cli.json` / plugin `tui.json`; no `auto.md` restore.
- **Artifacts**: `sprints/S0154/sprint.md`, `tasks.md` (12 tasks T-anch..T-011), `plan-verify.json` SKIPPED (`ultra_lean_skipped`), UAT placeholders, `handoffs/tl_to_dev.md` prepended.
- **Consumed architecture proof**: `rp-auto-20260917-us0146-architecture-techlead-20260917T204000Z-US-0147` / `90A68CD12FB24348890E4DCE47CDCE639736C67C6D91F3914542BFF282A366AD` — MATCH; not STALE at consume.

### Runtime proof (DEC-0038)

- `runtime_proof_id=rp-auto-20260917-us0146-sprint-plan-techlead-20260917T205000Z-US-0147`
- `proof_hash=71466A385CB3FFA1503D35BAA34BD51CD8A592C2038D8570762DCB32D3EBF9A5`
- `proof_ttl=2026-09-17T21:50:00Z`
- Canonical hashed payload: `{"orchestrator_run_id":"auto-20260917-us0146","phase_id":"sprint-plan","proof_issued_at":"2026-09-17T20:50:00Z","proof_ttl_seconds":3600,"role":"tech-lead","runtime_proof_id":"rp-auto-20260917-us0146-sprint-plan-techlead-20260917T205000Z-US-0147"}`
- `hash_recompute_confirmation=true` (compute_strict_proof_hash → 71466A385CB3FFA1503D35BAA34BD51CD8A592C2038D8570762DCB32D3EBF9A5; independently MATCH; **64 hex** verified)

### Isolation + stop

- **Status**: US-0147 remains **OPEN**. AC-1..AC-8 remain unchecked. **Next**: `/execute` in fresh **dev** subagent (BUG-0006). plan-verify SKIPPED (ultra_lean). CROSS_MODEL_REVIEW=0 — no sovereign-critic. STOP before implementation.

## Discovery handoff — US-0145 Parallel development, release/deploy, self-healing, and closure

- **Phase completed**: discovery. **Role**: po. **Story**: US-0145 only. **Sprint**: (pending — expected S0155 at `/sprint-plan`). **Verdict**: PASS (`decision_gate=false`).
- **Timestamp (UTC)**: 2026-09-17T20:00:00Z. **Fresh marker**: `po-US0145-discovery-20260917T200000Z-fresh`.
- **Orchestrator**: `orchestrator_run_id=auto-20260917-us0146`, parent=`auto-20260913-us0144`, `delivery_mode=ultra_lean`, resolved_phase_plan=`[spec, plan, build+verify, ship]`, reinstatement_mode=`none`, memory_layer=`pack`, macro=`spec` (intake already DONE — not re-intaken; `handoffs/intake_evidence/US-0133-0148-intake-20260911.json` held, not mutated), `model_id=inherit` (MODEL_RESOLVE=alias_only; CROSS_MODEL_REVIEW=0), AUTO_QUIET=1, AUTO_FLOW_MODE=full_autonomy, AUTO_SOVEREIGN=0, FRAMEWORK_KIT_REPO=1, EARLY_RESEARCH=0, drain story **3 of 3** (`backlog_drain_stories_remaining_budget=0`; AUTO_BACKLOG_MAX_STORIES=3). Selection: US-0146/US-0147 **DONE** → **US-0145** (OPEN P1 before US-0148). **US-0148** P1 OUT of this segment.
- **Sibling boundary**: **US-0140..US-0147 DONE** — compose only (US-0143 drain, US-0146 operator surfaces, US-0140 release→closure graph, US-0108/US-0109 Python libs); do not reopen. **US-0148 OPEN** — OUT OF SCOPE (do not mutate body). **BUG-0022 OPEN** — do not drain. Do not restore `.opencode/commands/auto.md`. Do not ship kit `cli.json` or plugin-local `its-magic-auto/tui.json`. No npm-publish, git push, or `.env` reads.
- **Gap confirmed (narrow-read)**: US-0108 `scripts/parallel_dev_arbiter.py` exists but is not orchestrated by standalone runtime; no typed `ReleaseTarget` adapters or deploy result ledger in TS; US-0109 `self_healing_deploy_lib.py` not composed into release path; `closure.ts` already separates release evidence from DONE flip.

### Discovery locks D1–D10

| ID | Lock |
|----|------|
| **D1** | Optional parallel DEV inside runtime workflow composes US-0108 worktree create/list/merge + arbiter evidence via KernelBridge (or thin TS facade). Isolated worktrees + distinct DEV sessions/models; independent tests; **no** main working-tree mutation before QA merge. Parallel mode optional after core lifecycle. **No Pi** on orchestration path. **Do not** rewrite US-0143 CommandRouter drain loop. |
| **D2** | Resource guards (AC-2) cap max instances, tokens/cost, CPU/RAM, worktree count, concurrent tests/browsers, wall-clock timeout — fail-closed with auditable reason codes. |
| **D3** | Fresh QA arbiter (AC-3) compares candidate evidence packages; select or reject winner; controlled merge with conflict/failure evidence; no producer self-arbitration. |
| **D4** | Typed `ReleaseTarget` adapters (AC-4): git/GitHub, npm, SSH command, Docker, custom command; compose existing release-trigger/changelog contracts where configured. |
| **D5** | Publish/deploy (AC-5) requires canonical test, QA, UAT, release-artifact, approval, and target-policy gates; emit auditable per-target results. **GateEngine `RELEASE_GATE_ORDER` unamended** — compose only. |
| **D6** | Post-deploy smoke (AC-6) captures runtime/browser evidence; bounded DEV repair → rebuild/release/redeploy loop (compose US-0109 `self_healing_deploy_lib.py`). |
| **D7** | Exhausted repair (AC-7) records canonical `DEPLOY_DEFERRED`/reason; **never** report failed deploy as released. |
| **D8** | Successful release (AC-8) transitions to **separate closure** only — compose `closure.ts` / US-0045; release phase must not mark DONE or tick acceptance. |
| **D9** | Tests `test_us0145_*` (expect 12 at architecture) cover AC-1..AC-9: isolation/arbitration, resource exhaustion, target failure, smoke repair success/exhaustion, release/closure ownership violations. Kit `files` omit `standalone/`. |
| **D10** | OUT: US-0148 daemon/protocol; US-0146 CLI/TUI polish (observe/trigger only); US-0144 critic *content*; rewrite GateEngine tables; restore `.opencode/commands/auto.md`; kit `cli.json`; plugin-local `its-magic-auto/tui.json`; npm-publish; git push; `.env`. Research stub **R-0145** (PO does not author `## R-0145`; **R-0144**=US-0147 — do not wipe). Companion **DEC-0145** + `# US-0145` at `/architecture` only. Expected sprint **S0155**. |

### Research questions DQ1–DQ10 (for `/research` → expect **R-0145**; stub only here)

1. **DQ1**: Parallel orchestration owner — WorkflowEngine phase hook vs nested `parallel-dev/` module in runtime-core vs KernelBridge-only US-0108 invoke; interaction with US-0143 drain (parallel **optional**, not required for every story).
2. **DQ2**: Worktree lifecycle — compose `parallel_dev_arbiter.py` vs TS port; git availability on Win/Linux; cleanup/orphans; PolicyEngine path rules for worktree roots.
3. **DQ3**: QA arbiter session — evidence package schema (tests, diffs, cost, model ids); merge strategy; reject-all path; fresh session isolation (US-0136 compose).
4. **DQ4**: Resource guard configuration — scratchpad keys vs RuntimeConfig; interaction with US-0080 token-cost and US-0144 caps; fail-closed codes.
5. **DQ5**: `ReleaseTarget` type system — adapter interface, config surface, secrets handling (no `.env` reads), dry-run vs apply, idempotency.
6. **DQ6**: Gate composition — map AC-5 gates onto existing GateEngine + release-trigger/changelog kit scripts; approval/target-policy extensions without reordering `RELEASE_GATE_ORDER`.
7. **DQ7**: Deploy smoke + repair loop — KernelBridge compose of `self_healing_deploy_lib.py`; cap semantics; fresh DEV spawn slot; interaction with US-0142 browser smoke evidence.
8. **DQ8**: Deferral + truthfulness — `DEPLOY_DEFERRED` tuple alignment with US-0107 deferral register; release queue / `release_notes.md` must not claim RELEASE_PASS on deploy fail.
9. **DQ9**: Closure boundary tests — enforce `releaseCannotMarkDone` + `applyClosure` ownership; forbidden paths where release flips DONE or closure runs without release evidence.
10. **DQ10**: Tests — `test_us0145_*` matrix; fake git/target doubles; kit `files` omit `standalone/`. **R-id live-inventory**: allocate **R-0145**; do not wipe **R-0144** (US-0147).

### Design refs

- `docs/product/standalone-its-magic-pi-masterplan.md` §§23, 25, 32 Phase 7, 38
- Compose: US-0108 `parallel_dev_arbiter.py`; US-0109 `self_healing_deploy_lib.py`; US-0140 `closure.ts` / phase graph; US-0143 scheduling; US-0146 operator observe; US-0045 status authority; BUG-0006 / DEC-0051 spawn-only
- Market: [deterministic vs LLM orchestration](https://dreaming.press/posts/deterministic-vs-llm-orchestration-for-multi-agent-systems.html) (policy-bounded recovery); git worktree isolation patterns (inspiration only)
- Intake (read-only): `handoffs/intake_evidence/US-0133-0148-intake-20260911.json` (`parallel-dev-worktrees`, `release-deploy-closure` → US-0145)

### Research stub (PO does not author `docs/engineering/research.md`)

- **Expected next R-id**: **R-0145** (`ID_NAMESPACE_BOOTSTRAP=0`; highest delivered heading is **R-0144** US-0147).
- Do **not** author `## R-0145` this phase. Do **not** wipe **R-0144**. Do **not** reuse R-0144 for US-0145 body.
- Companion **DEC-0145** + `# US-0145` at `/architecture` only — PO does not author them.
- Expected sprint **S0155** at `/sprint-plan` only (S0154 = US-0147 released — do not reuse).

### Runtime proof (DEC-0038)

- `runtime_proof_id=rp-auto-20260917-us0146-discovery-po-20260917T200000Z-US-0145`
- `proof_hash=D65648EBD8A325F98E69B718A2E81A9D04778B92C1C9F3CD690EE6160E21143C`
- `proof_ttl=2026-09-17T21:00:00Z`
- Hash via `from scripts.token_cost_lib import compute_strict_proof_hash` (positional; compact sorted-key JSON).
- Canonical hashed payload: `{"orchestrator_run_id":"auto-20260917-us0146","phase_id":"discovery","proof_issued_at":"2026-09-17T20:00:00Z","proof_ttl_seconds":3600,"role":"po","runtime_proof_id":"rp-auto-20260917-us0146-discovery-po-20260917T200000Z-US-0145"}`
- Isolation extras (not hashed): `delivery_mode=ultra_lean`, `macro_phase=spec`, `model_id=inherit`, `sprint_id=none`, `story_id=US-0145`, `skipped_phases=[intake]`, `CROSS_MODEL_REVIEW=0`, `native_chain_active=true`, `native_chain_continuing=true`, `drain_story_index=3 of 3`, `backlog_drain_stories_remaining_budget=0`
- `hash_recompute_confirmation=true` (compute_strict_proof_hash → d65648ebd8a325f98e69b718a2e81a9d04778b92c1c9f3cd690ee6160e21143c; independently MATCH; **64 hex** verified; stored uppercase)

### Isolation + stop

- `phase_id=discovery`, `role=po`, `story_id=US-0145`, `model_id=inherit`, `fresh_context_marker=po-US0145-discovery-20260917T200000Z-fresh`
- `evidence_ref=docs/product/backlog.md ## US-0145 discovery_notes; docs/product/vision.md ## Discovery Notes — US-0145; this handoff; docs/engineering/state.md discovery checkpoint; handoffs/resume_brief.md; handoffs/intake_evidence/US-0133-0148-intake-20260911.json (read-only)`
- **Hot-surface note**: Appended (not prepended). Post-append `--rollover --json` archived state `state-pack-20260917-o.md` + po_to_tl `po-to-tl-pack-20260917-e.md`. Discovery handoff US-0145 retained at true end. final `--check` PASS.
- **Status**: US-0145 remains **OPEN**. AC-1..AC-9 remain unchecked. Acceptance.md US-0145 row unchecked. **Next**: `/research` in fresh **tech-lead** subagent. CROSS_MODEL_REVIEW=0 — do not spawn sovereign-critic. Do not spawn research from this discovery chat. STOP.

## Research handoff — US-0145 Parallel development, release/deploy, self-healing, and closure

- **Phase completed**: research. **Role**: tech-lead. **Story**: US-0145 only. **Sprint**: (pending — expected S0155 at `/sprint-plan`). **Verdict**: PASS (`decision_gate=false`).
- **Timestamp (UTC)**: 2026-09-17T22:00:00Z. **Fresh marker**: `tl-US0145-research-20260917T220000Z-fresh`.
- **Orchestrator**: `orchestrator_run_id=auto-20260917-us0146`, parent=`auto-20260913-us0144`, `delivery_mode=ultra_lean`, resolved_phase_plan=`[spec, plan, build+verify, ship]`, macro=`plan` (research = first of research+architecture+sprint-plan), `model_id=inherit` (MODEL_RESOLVE=alias_only; CROSS_MODEL_REVIEW=0), AUTO_QUIET=1, AUTO_FLOW_MODE=full_autonomy, AUTO_SOVEREIGN=0, FRAMEWORK_KIT_REPO=1, EARLY_RESEARCH=0, drain story **3 of 3** (`backlog_drain_stories_remaining_budget=0`).
- **Sibling boundary**: **US-0140..US-0147 DONE** — compose only (US-0143 drain, US-0146 observe, US-0140 closure/release graph, US-0108/US-0109 Python libs); do not reopen. **US-0148 OPEN** — OUT OF SCOPE. **BUG-0022 OPEN** — do not drain. No npm-publish, git push, or `.env` reads.
- **Research anchor**: `docs/engineering/research.md` **`## R-0145`** (DQ1–DQ10 LOCKED). Do not wipe **R-0144** (US-0147). Discovery D1–D10 not rewritten.
- **Approach**: **A1 (A\*)** — nested `workflow/delivery/` (`ParallelDevCoordinator` + `ReleaseDeployPipeline`) + `KernelBridge.runDeliveryOperation()` → `scripts/delivery_runtime_bridge.py` composing US-0108/US-0109; WorkflowEngine phase hooks; `ReleaseTarget` registry; GateEngine compose-only (no `RELEASE_GATE_ORDER` amend); closure/release ownership preserved.
- **Companion DEC**: **DEC-0145** at `/architecture` only — do **not** author/mutate `decisions/DEC-0145.md` this phase. Do **not** author `# US-0145`.

### Closed questions DQ1–DQ10

| DQ | Topic | Resolution | LOCK |
|----|-------|------------|------|
| DQ1 | Parallel owner | `ParallelDevCoordinator` in runtime-core; WorkflowEngine post-execute hook; US-0143 drain unchanged | LOCKED |
| DQ2 | Worktrees | Bridge to `parallel_dev_arbiter.py`; `.its-magic/worktrees/`; no TS git port | LOCKED |
| DQ3 | QA arbiter | Fresh `qa-arbiter` session; evidence packages; merge/reject paths | LOCKED |
| DQ4 | Resource guards | `DeliveryResourceGuard`; scratchpad + US-0080 + concurrency caps | LOCKED |
| DQ5 | ReleaseTarget | Adapter registry (git_github, npm, ssh, docker, custom); secrets via config API | LOCKED |
| DQ6 | Gates | Additive `ReleaseGateInput`; order array unamended | LOCKED |
| DQ7 | Smoke/repair | Compose `self_healing_deploy_lib.py`; bounded DEV repair slot | LOCKED |
| DQ8 | Deferral/truth | `DEPLOY_DEFERRED`; no RELEASE_PASS on deploy fail | LOCKED |
| DQ9 | Closure | `releaseCannotMarkDone` + `applyClosure` sole DONE authority | LOCKED |
| DQ10 | Tests + R-id | 12 `test_us0145_*`; **R-0145**; S0155 at sprint-plan | LOCKED |

### Architecture seeds (preview)

- `/architecture` authors `# US-0145` + **DEC-0145** Accepted; pins bridge ops, target kinds, ledger paths, reason codes.
- `/sprint-plan` materializes **S0155** (≤12 tasks from architecture seeds).
- Do not implement application code this phase.

### Runtime proof (DEC-0038)

- `runtime_proof_id=rp-auto-20260917-us0146-research-techlead-20260917T220000Z-US-0145`
- `proof_hash=CBBD28E0CA404A019F3919AA8870EA7FCC2699CC7AD4576F5F9CEA0323F222C6`
- `proof_ttl=2026-09-17T23:00:00Z`
- Hash via `from scripts.token_cost_lib import compute_strict_proof_hash` (positional; compact sorted-key JSON).
- Canonical hashed payload: `{"orchestrator_run_id":"auto-20260917-us0146","phase_id":"research","proof_issued_at":"2026-09-17T22:00:00Z","proof_ttl_seconds":3600,"role":"tech-lead","runtime_proof_id":"rp-auto-20260917-us0146-research-techlead-20260917T220000Z-US-0145"}`
- Isolation extras (not hashed): `delivery_mode=ultra_lean`, `macro_phase=plan`, `model_id=inherit`, `sprint_id=none`, `story_id=US-0145`, `skipped_phases=[intake]`, `CROSS_MODEL_REVIEW=0`, `native_chain_active=true`, `native_chain_continuing=true`, `drain_story_index=3 of 3`
- `hash_recompute_confirmation=true` (compute_strict_proof_hash → CBBD28E0CA404A019F3919AA8870EA7FCC2699CC7AD4576F5F9CEA0323F222C6; independently MATCH; **64 hex** verified; stored uppercase)
- Consumed discovery producer proof: `rp-auto-20260917-us0146-discovery-po-20260917T200000Z-US-0145` / `D65648EBD8A325F98E69B718A2E81A9D04778B92C1C9F3CD690EE6160E21143C` — MATCH at `2026-09-17T22:00:00Z`

### Isolation + stop

- `phase_id=research`, `role=tech-lead`, `story_id=US-0145`, `model_id=inherit`, `fresh_context_marker=tl-US0145-research-20260917T220000Z-fresh`
- `evidence_ref=docs/engineering/research.md ## R-0145; docs/engineering/state.md research checkpoint; handoffs/resume_brief.md; docs/product/backlog.md ## US-0145 discovery_notes (D1–D10 read-only)`
- **Status**: US-0145 remains **OPEN**. AC-1..AC-9 remain unchecked. **Next**: `/architecture` in fresh **tech-lead** subagent. CROSS_MODEL_REVIEW=0 — do not spawn sovereign-critic. STOP before implementation.

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

