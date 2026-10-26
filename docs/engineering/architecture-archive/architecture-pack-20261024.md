# Architecture archive pack (2026-10-24)

- Rollover trigger: `ARCH_HOT_MAX_LINES=3000, ARCH_HOT_MAX_STORY_SECTIONS=120`
- Source: `docs/engineering/architecture.md`
- Archived units (oldest first, contiguous prefix): 1
- Retained units in hot file: 41
- First archived heading: `# US-0147 — Installation, update, and existing-project adoption`
- Last archived heading: `# US-0147 — Installation, update, and existing-project adoption`
- Verification tuple (mandatory):
  - archived_body_lines=129
  - preamble_lines=1
  - retained_body_lines=2932

---

# US-0147 — Installation, update, and existing-project adoption

## Overview

US-0147 delivers triple-installer parity bootstrap for the standalone operator product: template-mirrored `.its-magic/standalone/` workspace, `itsm` shim, kernel-bridge preflight, `runtime-metadata.json`, adoption classifier, explicit browser setup, and uninstall/coexistence semantics. `DEC-0147` and `R-0144` are authoritative. **Approach A1 (A\*)** is locked. Compose US-0146 delivered CLI/TUI/operator facades (wire only — do not rewrite `runtime-core/src/operator/`), US-0134 kernel-bridge handshake, US-0008/US-0018 installers + manifest, US-0055 installer QA patterns, US-0142 browser-uat for `itsm setup browser`. No host `.cursor/` / `.opencode/` rewrite. No US-0148 daemon protocol. No kit `cli.json` / plugin `tui.json`. No `.env` access.

**Research anchor**: **R-0144** (DQ1–DQ10 LOCKED). **Companion DEC**: **DEC-0147** (Accepted — authored THIS phase). **baseline_h2_count (pre-mutate)**: `0`.
**Fresh context marker**: `tl-US0147-architecture-20260917T204000Z-fresh`
**Orchestrator run id**: `auto-20260917-us0146` (drain story **2 of 3**; `backlog_drain_stories_remaining_budget=1`)
**Timestamp**: 2026-09-17T20:40:00Z (UTC)
**Verdict**: PASS
**Next**: `/sprint-plan` **S0154** (fresh **tech-lead**). CROSS_MODEL_REVIEW=0 — do **not** spawn sovereign-critic from this subagent. Status remains OPEN. AC-1..AC-8 remain unchecked.

## Locked design (A1)

| DQ | Lock |
|----|------|
| DQ1 | Template mirror → `.its-magic/standalone/`; kit `files` omit root `standalone/`; FRAMEWORK_KIT_REPO in-tree pin for kit-dev |
| DQ2 | `bootstrap_standalone_runtime_installer_hook` in `installer.py`; PS1/sh parity; repair via `--standalone-bootstrap` |
| DQ3 | `classifyProjectAdoptionProfile` + US-0134 locate; `ADOPT_PARTIAL_MARKERS` fail-closed |
| DQ4 | Fresh init via `template/` skeleton; no US-0001..0132 backlog clone |
| DQ5 | `install_include_paths` vs `deny_overwrite`; staged rollback `INSTALL_INTERRUPTED_ROLLBACK_OK` |
| DQ6 | Kernel preflight before shim; `.its-magic/standalone/runtime-metadata.json` |
| DQ7 | Explicit `itsm setup browser`; `ITS_MAGIC_INSTALL_BROWSER=1` opt-in silent path |
| DQ8 | No `LegacyScratchpadAdapter` at install; `SCRATCHPAD_LEGACY_KEYS_PRESENT` WARN only |
| DQ9 | `uninstall-standalone` removes standalone tree/shims; preserves hosts + user layers |
| DQ10 | Ten `test_us0147_*`; **R-0144**; expected sprint **S0154** |

### Path and hook pins

- `docs/engineering/context/installer-owned-paths.manifest` (+ `template/` mirror) — additive standalone paths, `deny_overwrite`, staging dir
- `template/.its-magic/standalone/` — workspace mirror (apps/cli, apps/tui, packages/*, lockfile)
- `installer.py` — `bootstrap_standalone_runtime_installer_hook` (post host-config refresh, pre runbook bootstrap)
- `.its-magic/bin/itsm` — primary shim → standalone workspace `apps/cli` bin; optional `bin/itsm` opt-in only
- `.its-magic/standalone/runtime-metadata.json` — kernel/contract/browser_prereq summary
- `.its-magic/install-staging/<run_id>/` — interrupted update staging
- `classifyProjectAdoptionProfile` — installer module (Python); compose kernel-bridge locate
- `itsm setup browser` — delegates to US-0142 Playwright install scoped under standalone `node_modules`

### Reason codes (architecture-owned)

| Code | When |
|------|------|
| `STANDALONE_BOOTSTRAP_FAILED` | Hook/npm ci failure |
| `ADOPT_PARTIAL_MARKERS` | 1–2 of 3 kernel markers |
| `INSTALL_INTERRUPTED_ROLLBACK_OK` | Staging rollback success |
| `INSTALL_BROWSER_OFFLINE` | Airgap browser setup |
| `SCRATCHPAD_LEGACY_KEYS_PRESENT` | Advisory WARN |
| `KIT_VERSION_COEXISTENCE` | `.its-magic-version` mismatch advisory |
| `KERNEL_*` | Compose US-0134 (no duplicate validator) |

### Risks (architecture-owned)

| Risk | Mitigation |
|------|------------|
| Installer triple drift | Single Python hook entry; US-0055 parity tests |
| Overwrite user backlog on adopt | deny_overwrite + no historical backlog copy |
| Publish guard regression | No root `standalone/` in `files`; manifest parity test |
| Operator expects daemon reconnect | Document US-0146 in-process session; US-0148 OUT |
| US-0145 deploy scope creep | Explicit OUT in DEC-0147 |

## AC coverage

| AC | Architecture owner | Tests |
|----|-------------------|-------|
| AC-1 | DQ1+2+6+7 install/update/rollback/browser | `test_us0147_fresh_install_manifest_parity`, `test_us0147_interrupted_update_rollback`, `test_us0147_kernel_mismatch_fail_closed`, `test_us0147_browser_setup_explicit_gate` |
| AC-2 | DQ4 fresh skeleton | `test_us0147_fresh_install_manifest_parity` |
| AC-3 | DQ3 adopt | `test_us0147_adopt_cursor_only_repo`, `test_us0147_adopt_opencode_only_repo`, `test_us0147_adopt_both_hosts_repo` |
| AC-4 | DQ3 host coexistence | adopt matrix (no host tree mutation) |
| AC-5 | DQ5 preservation | `test_us0147_upgrade_preserves_user_layers` |
| AC-6 | DQ6 diagnostics | `test_us0147_kernel_mismatch_fail_closed` |
| AC-7 | DQ8+9+runbook | `test_us0147_runbook_sections_present`, `test_us0147_uninstall_preserves_hosts` |
| AC-8 | DQ10 lifecycle matrix | all ten `test_us0147_*` Win+Linux |

## Test contract

1. `test_us0147_fresh_install_manifest_parity` — AC-1/AC-2 triple-installer + template mirror.
2. `test_us0147_upgrade_preserves_user_layers` — AC-5 locals untouched.
3. `test_us0147_adopt_cursor_only_repo` — AC-3/AC-4 cursor-only profile.
4. `test_us0147_adopt_opencode_only_repo` — AC-3/AC-4 opencode-only profile.
5. `test_us0147_adopt_both_hosts_repo` — AC-3/AC-4 both-host profile.
6. `test_us0147_interrupted_update_rollback` — AC-1 staging rollback.
7. `test_us0147_kernel_mismatch_fail_closed` — AC-6 `KERNEL_*` / preflight.
8. `test_us0147_browser_setup_explicit_gate` — AC-1 explicit browser prereq.
9. `test_us0147_uninstall_preserves_hosts` — AC-7/AC-9 host preservation.
10. `test_us0147_runbook_sections_present` — AC-7 runbook + template parity sections.

## Sprint seeds

- T-anch: DEC-0147 and this `# US-0147` section.
- T-001: manifest + template `.its-magic/standalone/` mirror scaffolding.
- T-002: `bootstrap_standalone_runtime_installer_hook` + triple-installer wiring.
- T-003: `classifyProjectAdoptionProfile` + `ADOPT_PARTIAL_MARKERS`.
- T-004: fresh init + deny_overwrite preservation matrix.
- T-005: staging dir + interrupted rollback (`INSTALL_INTERRUPTED_ROLLBACK_OK`).
- T-006: kernel preflight + `runtime-metadata.json`.
- T-007: `itsm` shim + optional repo-root `bin/itsm` opt-in.
- T-008: `itsm setup browser` + metadata flags.
- T-009: `uninstall-standalone` + `KIT_VERSION_COEXISTENCE` advisory.
- T-010: runbook + template operator doc parity (AC-7).
- T-011: ten `test_us0147_*` pytest/installer fixtures.

AC coverage is surjective across T-001..T-011; sprint-plan owns **S0154** materialization (≤12 tasks; reconcile T-anch..T-011 to cap). ultra_lean: plan-verify skipped after sprint-plan.

## Template parity (FRAMEWORK_KIT_REPO=1)

- Kit `package.json` `files` continue to omit repo-root `standalone/`; standalone delivered via `template/.its-magic/standalone/` mirror + post-install `npm ci`.
- No kit `cli.json`; no plugin-local `its-magic-auto/tui.json`; no `auto.md` restore.
- `template/` manifest updates mirror active `installer-owned-paths.manifest` entries for standalone paths.

## Isolation evidence (US-0048 / DEC-0029)

- `phase_id=architecture`, `role=tech-lead`, `story_id=US-0147`, `sprint_id=none` (S0154 expected at sprint-plan)
- `delivery_mode=ultra_lean`, `macro_phase=plan`, `drain_story_index=2 of 3`
- `model_id=inherit` (CROSS_MODEL_REVIEW=0)
- `fresh_context_marker=tl-US0147-architecture-20260917T204000Z-fresh`, `timestamp=2026-09-17T20:40:00Z` (UTC)
- `evidence_ref=docs/engineering/research.md ## R-0144; docs/product/backlog.md ## US-0147 discovery_notes; docs/engineering/architecture.md (this # US-0147); decisions/DEC-0147.md; docs/engineering/decisions.md; handoffs/resume_brief.md; handoffs/po_to_tl.md`
- Fresh tech-lead subagent per BUG-0006; narrow-read only. No `.env`. US-0140..US-0146 DONE compose-only (US-0146 install wiring IN). US-0145/US-0148 OUT. BUG-0022 OPEN not drained. No `/sprint-plan` spawn from this subagent.

## Strict runtime proof (mirror)

- `runtime_proof_id=rp-auto-20260917-us0146-architecture-techlead-20260917T204000Z-US-0147`
- Canonical hashed payload (DEC-0038, `compute_strict_proof_hash` positional): `{"orchestrator_run_id":"auto-20260917-us0146","phase_id":"architecture","proof_issued_at":"2026-09-17T20:40:00Z","proof_ttl_seconds":3600,"role":"tech-lead","runtime_proof_id":"rp-auto-20260917-us0146-architecture-techlead-20260917T204000Z-US-0147"}`
- Isolation extras (not hashed): `delivery_mode=ultra_lean`, `macro_phase=plan`, `model_id=inherit`, `sprint_id=none`, `story_id=US-0147`, `drain_story_index=2 of 3`
- `proof_hash=90A68CD12FB24348890E4DCE47CDCE639736C67C6D91F3914542BFF282A366AD`
- `proof_ttl=2026-09-17T21:40:00Z`
- `hash_recompute_confirmation=true` (compute_strict_proof_hash → 90A68CD12FB24348890E4DCE47CDCE639736C67C6D91F3914542BFF282A366AD; independently MATCH; **64 hex** verified)
- Consumed research proof: `rp-auto-20260917-us0146-research-techlead-20260917T203000Z-US-0147` / `96C81771F5CE812898410E6F551A0C209475E9F31696EA13B07E7CDB1FC39237` — RUNTIME_PROOF_VALID MATCH before TTL `2026-09-17T21:30:00Z` (consumed_at `2026-09-17T20:40:00Z`; not STALE)

