# PO to TL archive pack (2026-09-21)

- Rollover trigger: `PO_TO_TL_HOT_MAX_LINES=650, PO_TO_TL_HOT_MAX_SECTIONS=60`
- Source: `handoffs/po_to_tl.md`
- Archived units (oldest first, contiguous prefix): 2
- Retained units in hot file: 14
- First archived heading: `## Research handoff — US-0147 Installation, update, and existing-project adoption`
- Last archived heading: `## Architecture handoff — US-0147 Installation, update, and existing-project adoption`
- Verification tuple (mandatory):
  - archived_body_lines=79
  - retained_body_lines=638

---

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

