# Architecture archive pack (2026-09-13)

- Rollover trigger: `ARCH_HOT_MAX_LINES=3000, ARCH_HOT_MAX_STORY_SECTIONS=120`
- Source: `docs/engineering/architecture.md`
- Archived units (oldest first, contiguous prefix): 1
- Retained units in hot file: 21
- First archived heading: `# US-0131 — Cross-host Its-Magic runtime configuration and parity`
- Last archived heading: `# US-0131 — Cross-host Its-Magic runtime configuration and parity`
- Verification tuple (mandatory):
  - archived_body_lines=147
  - preamble_lines=1
  - retained_body_lines=2965

---

# US-0131 — Cross-host Its-Magic runtime configuration and parity

## Overview

**US-0131** closes the cross-host runtime-configuration gap: shared Its-Magic lifecycle and governance settings must resolve through a **host-neutral** contract so OpenCode-only installs do not require `.cursor/`, while Cursor keeps its scratchpad as a **compatibility adapter** (DEC-0055 Model B + DEC-0039 local preservation). Shared Python validators, outer-driver, triad, state/handoff scripts accept resolved config via injection — no silent `.cursor` hardcode for host-neutral behavior. Host-specific capabilities fail/skip with reason codes (no silent unsupported parity). Model catalogs / `MODEL_*` / materializers remain **US-0132 OUT OF SCOPE**.

**Research anchor**: **R-0116** (DQ1–DQ10 LOCKED). **Companion DEC**: **DEC-0131** (Accepted — THIS phase). **EARLY_RESEARCH**: consumed from R-0116 + architecture-phase Context7 `/websites/opencode_ai_v2` confirm (opencode.json paths are host model/providers surface — not kit governance; no new R-id).

**Fresh context marker**: `tl-US0131-architecture-20260907T193500Z-fresh`
**Orchestrator run id**: `auto-20260907-us0131`
**Timestamp**: 2026-09-07T19:35:00Z (UTC)
**Verdict**: PASS
**Next**: `/sprint-plan` (orchestrator-owned; CROSS_MODEL_REVIEW=1 critic of architecture is orchestrator-owned). Do **not** spawn sprint-plan from this subagent (BUG-0006).

## Approach locked (A1 — from R-0116)

| Option | Summary | Verdict |
|--------|---------|---------|
| **A1** | `.its-magic/config{,.local,.example}.json` SOT + Cursor LegacyScratchpadAdapter + `host_runtime_config_lib.resolve_runtime_config` migration of shared-kernel readers | **Preferred / LOCKED** — AC-1..AC-8; OpenCode-only without `.cursor/` |
| A2 | Scratchpad-only forever | **Rejected** — fails AC-3 |
| A3 | Kit keys inside `opencode.json{,c}` | **Rejected** — DQ4 / schema collision / US-0132 risk |

### Locked surfaces (DEC-0131)

1. **Paths**: `.its-magic/config.example.json` (catalog), `config.json` (baseline), `config.local.json` (gitignored local). Filename token = **`config`** (not `runtime`).
2. **Schema v1**: `schema_version` + `shared` KEY→string map (scratchpad-compatible names). `host_overlays.*` empty in v1. Call-site `required_keys` (no global required-set). `HOST_CONFIG_*` fail-closed family; `HOST_CONFIG_STRICT=0` default.
3. **Cursor adapter**: DEC-0055 Model B **pre-merge within Cursor layers**, then map into shared namespace, then apply both-host interleave (kit-local > cursor-local > kit-baseline > cursor-baseline > example > defaults). Kit wins on shadow; emit `HOST_CONFIG_KEY_SHADOWED`.
4. **OpenCode-only**: resolve from `.its-magic/` + defaults only; forbid kit dump into `opencode.json`.
5. **Injection**: `resolve_runtime_config(repo_root, *, host_mode=None, required_keys=None) -> ResolvedRuntimeConfig{values, provenance, diagnostics}`. Migrate R-0116 hardcode inventory (outer-driver, OpenCode bridge, triad, dev_environment_lib, caveman, parallel arbiter, uat probe, autonomy stop matrix; model_tier_validate path inject **without** MODEL_* validation).
6. **Installer**: kernel-deliver example for all `--host` modes; never overwrite locals; materialize missing baseline from example (Model B semantics).
7. **Tests**: 10 `test_us0131_*` static/fixture markers (DQ9); no live OpenCode probe.
8. **Docs**: runbook h2 `## Cross-host runtime configuration (US-0131)` + README + auto-orchestration-reference; US-0126 additive `HOST_CONFIG_*` rows only.

### Critic NB closures (research us0131rsc-* — informational)

| NB | Closure |
|----|---------|
| NB1 interleaved precedence vs Model B | LOCKED §3 — Model B pre-merge inside Cursor adapter, then DQ6 kit/cursor interleave |
| NB2 model_tier_validate migrate | LOCKED — path injection only; ignore/do not validate `MODEL_*` |
| NB3 deferred filename/allowlist/overlays | LOCKED — `config` token; call-site required_keys; empty host_overlays v1 |

## Components

### Kit config + lib (AC-1, AC-3, AC-4)

- NEW `.its-magic/config.example.json` (+ template/kernel delivery)
- NEW `scripts/host_runtime_config_lib.py` (+ `template/scripts/` byte-identical)
- Optional test override: `ITS_MAGIC_CONFIG_ROOT` / `--config-root` (not a second SOT)

### Cursor compatibility adapter (AC-2)

- LegacyScratchpadAdapter preserves DEC-0055 local > baseline > example within Cursor layers and DEC-0039 never-overwrite of `.cursor/scratchpad.local.md`
- Cursor scratchpad remains compatibility UX, not sole SOT after migration

### Capability matrix (AC-5)

| Class | Behavior when unavailable |
|-------|---------------------------|
| Shared / host-neutral | `HOST_CONFIG_*` fail-closed or defaults |
| Cursor-only | skip/fail with Cursor capability codes — no silent parity |
| OpenCode-only | existing `OPENCODE_*` (US-0124/0126) unchanged |
| US-0132-owned | out of scope; ignore |

### Both-host + installer (AC-6, AC-7)

- One deterministic precedence table (DEC-0131 §4 / R-0116 DQ6)
- No conflicting duplicate writes of locals
- `--host cursor|opencode|both` example delivery + local preservation

### Verification + docs (AC-8)

Ten markers (R-0116 DQ9):

1. `test_us0131_neutral_path_no_cursor_required`
2. `test_us0131_cursor_adapter_preserves_dec0055_precedence`
3. `test_us0131_opencode_only_resolves_shared_from_its_magic`
4. `test_us0131_both_host_precedence_table`
5. `test_us0131_rejects_opencode_json_governance_dump`
6. `test_us0131_schema_fail_closed_codes`
7. `test_us0131_installer_preserves_local_config`
8. `test_us0131_shared_kernel_uses_resolver_not_hardcode`
9. `test_us0131_model_keys_ignored_us0132_boundary`
10. `test_us0131_capability_matrix_reason_codes_documented`

## Companion DEC = DEC-0131 (Required → Accepted)

Authored Accepted in THIS phase at `decisions/DEC-0131.md`. Locks A1, paths, schema v1, Cursor adapter order, OpenCode-only rule, injection API, installer/test/docs contracts, US-0132 boundary.

## Risks finalized (R1–R5 from R-0116)

- **R1 (MEDIUM)** migration miss leaves hardcode → marker 8 + inventory checklist
- **R2 (LOW–MEDIUM)** both-host shadow confusion → `HOST_CONFIG_KEY_SHADOWED` + docs
- **R3 (LOW)** schema churn → `schema_version` gate + `HOST_CONFIG_SCHEMA_UNSUPPORTED`
- **R4 (MEDIUM)** installer overwrite regression → DEC-0039 compose + marker 7
- **R5 (MEDIUM)** US-0132 boundary leak → ignore `MODEL_*` + marker 9

## Compose, do not amend (verified)

| Story / DEC | Surface | Verification |
|-------------|---------|--------------|
| US-0073 / DEC-0055 | Cursor Model B merge | ✓ adapter preserves; kit becomes SOT |
| DEC-0039 | local preservation | ✓ never overwrite locals |
| US-0121 / DEC-0120 | `--host` kernel install | ✓ example is kernel path |
| US-0122..US-0126 | OpenCode pack / reason codes | ✓ compose; additive HOST_CONFIG_* only |
| US-0092 / US-0069 | autonomy / phase→role | ✓ unchanged |
| US-0132 | model contract | ✓ OUT OF SCOPE |
| BUG-0015 / BUG-0016 | OpenCode dispatch / permissions | ✓ DONE — do not reopen |

## Sprint seeds (10 tasks within SPRINT_MAX_TASKS=12 — for `/sprint-plan` refinement)

- **T-anch** (`# US-0131` H1 + DEC-0131 Accepted — RESOLVED in THIS phase; NO-OP / verification)
- **T-001** (AC-1 — schema + `.its-magic/config.example.json` + `host_runtime_config_lib.py` resolve API)
- **T-002** (AC-2 — LegacyScratchpadAdapter Model B pre-merge + shared-namespace map)
- **T-003** (AC-3 — OpenCode-only resolve path; `HOST_CONFIG_PATH_FORBIDDEN`)
- **T-004** (AC-4 — migrate shared-kernel hardcode callers to resolver)
- **T-005** (AC-5 + AC-6 — capability matrix + both-host precedence + shadow diagnostic)
- **T-006** (AC-7 — installer/manifest kernel delivery + never-overwrite locals)
- **T-007** (AC-8 — `tests/us0131_contract_test.py` 10 markers + template mirror)
- **T-008** (AC-8 — runbook h2 + README + auto-orchestration-reference + US-0126 additive rows)
- **T-009** (AC-8 / R5 — US-0132 boundary marker + MODEL_* ignore contract)

Execution order: T-anch → T-001 → T-002 → T-003 → T-004 → T-005 → T-006 → T-007 → T-008 → T-009 (acyclic; lib before callers; tests after migration core; docs last).

## Isolation evidence (US-0048 / DEC-0029)

- `phase_id=architecture`, `role=tech-lead`, `story_id=US-0131`, `sprint_id=(pending — created at sprint-plan)`, `orchestrator_run_id=auto-20260907-us0131`
- `delivery_mode=ultra_lean`, `macro_phase=plan` (architecture — second canonical phase of `plan` macro)
- `model_id=composer-2.5` (CROSS_MODEL_REVIEW=1 — required on isolation)
- `fresh_context_marker=tl-US0131-architecture-20260907T193500Z-fresh`, `timestamp=2026-09-07T19:35:00Z` (UTC)
- `evidence_ref=docs/engineering/phase-context.md; docs/product/backlog.md ## US-0131; docs/engineering/research.md ## R-0116; handoffs/po_to_tl.md Research handoff US-0131; handoffs/resume_brief.md; .cursor/commands/architecture.md; decisions template / DEC-0126 pattern; Context7 /websites/opencode_ai_v2`
- Tech-lead subagent spawned fresh per BUG-0006 / US-0048; no prior chat history. Narrow-read only. No `.env` reads. Status remains OPEN. US-0132 not expanded. No `/sprint-plan` spawn from this subagent.
- Prior phase strict proof consumed: `rp-auto-20260907-us0131-research-techlead-20260907T192500Z-US-0131` / `7DB90B2B345D7C4E84F0A7C78E99A662C7FF308271415ECC5F7DFEAB774BE2BE` — RUNTIME_PROOF_VALID (MATCH before TTL 2026-09-07T20:25:00Z). Critic findings us0131rsc-* informational only.

## Strict runtime proof (mirror)

- `runtime_proof_id=rp-auto-20260907-us0131-architecture-techlead-20260907T193500Z-US-0131`
- Canonical payload (sorted-key compact JSON per DEC-0038, lowercase keys): `{"delivery_mode":"ultra_lean","macro_phase":"plan","model_id":"composer-2.5","orchestrator_run_id":"auto-20260907-us0131","phase_id":"architecture","proof_issued_at":"2026-09-07T19:35:00Z","proof_ttl_seconds":3600,"role":"tech-lead","runtime_proof_id":"rp-auto-20260907-us0131-architecture-techlead-20260907T193500Z-US-0131","sprint_id":"none","story_id":"US-0131"}`
- `proof_hash=F31B058CC5CDEAF68EDD2F53F4EF790D1845CE842E2B16057247CF5FE4170C4C` (SHA-256)
- `proof_ttl_seconds=3600`, `proof_ttl=2026-09-07T20:35:00Z` (UTC)

## Decision gate + next scheduled phase

- `decision_gate=false` (no blocking unknown; DQ1–DQ10 LOCKED; DEC-0131 Accepted; approach A1 locked; deferred items closed; critic NBs closed)
- `next_scheduled_phase=/sprint-plan` (role=tech-lead; third canonical phase of `plan` macro)
- `next_scheduled_role=tech-lead`
- `stop_condition=STOP after architecture completes; hand off via artifacts only to /sprint-plan in fresh tech-lead subagent (BUG-0006). Do NOT spawn /sprint-plan from this subagent. Do NOT mark US-0131 DONE. Do NOT work US-0132.`

