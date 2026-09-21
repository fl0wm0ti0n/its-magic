# PO to TL archive pack (2026-09-21)

- Rollover trigger: `PO_TO_TL_HOT_MAX_LINES=650, PO_TO_TL_HOT_MAX_SECTIONS=60`
- Source: `handoffs/po_to_tl.md`
- Archived units (oldest first, contiguous prefix): 3
- Retained units in hot file: 14
- First archived heading: `## Intake handoff — US-0149 Global `itsm` PATH + user-chosen location (cross-platform)`
- Last archived heading: `## Discovery handoff — US-0147 Installation, update, and existing-project adoption`
- Verification tuple (mandatory):
  - archived_body_lines=106
  - retained_body_lines=600

---

## Intake handoff — US-0149 Global `itsm` PATH + user-chosen location (cross-platform)

- **Phase completed**: intake. **Role**: po. **Story**: US-0149. **Verdict**: PASS (`decision_gate=false`).
- **Timestamp (UTC)**: 2026-09-19T09:51:21Z. **writer_id**: `po-intake-0f3aff2d`. **intake_run_id**: `ir-20260919T095121Z-92985b`.
- **Mode**: `INTAKE_GUIDED_MODE=0` (low-touch), `INTAKE_WORK_ITEM_KIND=story` (argv `/intake`, not `/intake bug`), `WORK_KIND_ROUTING=0`, `EARLY_RESEARCH=0`, `FRAMEWORK_KIT_REPO=1`.
- **Pack**: `small-intake-pack`. Evidence: `handoffs/intake_evidence/US-0149-intake-20260919T095121Z.json` — validated **PASS** before backlog/acceptance mutation.
- **Bug routing**: `intake_bug_routing_guard.py --kind story` → `[INTAKE_BUG_ROUTING_OK]` exit 0. Operator intent is product capability (PATH + configurable location + cross-platform + published-kit residual); prior KERNEL_CONTRACT_MISMATCH diagnosis is compose context only — **do not** reopen BUG-0025 ACs.
- **Duplicate/overlap**: Distinct from **US-0147 DONE** (repo-local shim / optional root `bin/itsm`), **US-0146 DONE** (CLI/TUI), **BUG-0025 DONE** (packaging lib + fail-closed loader). Do not drain **BUG-0022** / **BUG-0024**.
- **Decomposition**: **single_story**. Split (PATH vs published-kit residual) considered and **rejected** — PATH without materialize-`itsm` on published kits is not independently valuable for the stated outcome.
- **AC summary**: AC-1 materialize `itsm` on published-kit bootstrap residual; AC-2 opt-in user-chosen PATH location; AC-3 Win/Linux (+ macOS if in-scope); AC-4 PATH remove; AC-5 docs; AC-6 `test_us0149_*`.
- **Sibling boundary**: Compose US-0146/0147/DEC-0120/DEC-0147; do not reopen DONE ACs. Not US-0148.
- **Next**: `/discovery` in a **fresh PO** subagent/chat. **STOP** — intake does not run discovery.


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

