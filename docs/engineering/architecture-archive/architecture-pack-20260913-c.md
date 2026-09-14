# Architecture archive pack (2026-09-13)

- Rollover trigger: `ARCH_HOT_MAX_LINES=3000, ARCH_HOT_MAX_STORY_SECTIONS=120`
- Source: `docs/engineering/architecture.md`
- Archived units (oldest first, contiguous prefix): 1
- Retained units in hot file: 21
- First archived heading: `# US-0132 — Explicit Cursor/OpenCode model configuration contract`
- Last archived heading: `# US-0132 — Explicit Cursor/OpenCode model configuration contract`
- Verification tuple (mandatory):
  - archived_body_lines=152
  - preamble_lines=1
  - retained_body_lines=2958

---

# US-0132 — Explicit Cursor/OpenCode model configuration contract

## Overview

**US-0132** closes the model-file ownership gap: operators get one documented contract for the four supported surfaces (Cursor `.cursor/model-catalog.local.json` + `MODEL_*`, OpenCode kit `.opencode/model-catalog.local.json`, OpenCode host `opencode.json{,c}`). Generic `model.json` is rejected (`MODEL_CONFIG_PATH_UNKNOWN`). Cursor tier/phase/role schemas stay separate from OpenCode per-role `provider/slug`. Materialization, fail-closed validation, installer/clean protection, and docs name the exact inventory so no host receives a setting its runtime ignores.

**Research anchor**: **R-0117** (DQ1–DQ10 LOCKED). **Companion DEC**: **DEC-0132** (Accepted — THIS phase; **not** a DEC-0131 reuse). **EARLY_RESEARCH**: consumed from R-0117 + architecture-phase Context7 `/websites/opencode_ai_v2` confirm (official surfaces are `opencode.json{,c}` `model`/`providers` and agent `model:` frontmatter — **no** `model.json`; no new R-id).

**Fresh context marker**: `tl-US0132-architecture-20260908T210500Z-fresh`
**Orchestrator run id**: `auto-20260908-us0132`
**Timestamp**: 2026-09-08T21:05:00Z (UTC)
**Verdict**: PASS
**Next**: `/sprint-plan` (orchestrator-owned; CROSS_MODEL_REVIEW=1 critic of architecture is orchestrator-owned). Do **not** spawn sprint-plan from this subagent (BUG-0006).

## Approach locked (A1 — from R-0117)

| Option | Summary | Verdict |
|--------|---------|---------|
| **A1** | Four supported surfaces; reject `model.json`; separate Cursor/OpenCode schemas; `opencode.json{,c}` is host file not kit SOT; per-host precedence diagnostics; extend `model_tier_validate.py --scope model-config`; gitignore + exclude-from-clean locals | **Preferred / LOCKED** — AC-1..AC-8 |
| A2 | Alias `model.json` to catalog or `opencode.json` | **Rejected** — third SOT / both-host ambiguity |
| A3 | Union / generic kit `model.json` SOT | **Rejected** — schema mix |
| A4 | Dump kit catalog into `opencode.json` | **Rejected** — DEC-0131 + host schema |

### Locked surfaces (DEC-0132)

1. **Inventory**: four surfaces only. Unknown-path scan is **repo-scoped three locations**: `model.json{,c}` at repo root, `.cursor/`, `.opencode/`. Do not scan `~/.config/opencode/model.json`.
2. **Schemas**: Cursor DEC-0086/0087 unchanged; OpenCode DEC-0123 unchanged. Cross-offer → `MODEL_CONFIG_SCHEMA_MIX`. No union.
3. **Cursor precedence**: DEC-0087 5-step + US-0130 overlay **unchanged**; additive `provenance=` diagnostics. Absent catalog + `alias_only` is valid.
4. **OpenCode layers**: kit catalog → installed agent frontmatter (materializer); host `opencode.json{,c}` is independent. Optional names-only diagnostic read of host JSON (fail-open if absent; malformed present → `MODEL_CATALOG_INVALID` `scope=opencode-host`). Kit never writes `opencode.json{,c}`.
5. **Codes**: reuse existing `MODEL_*` / `OPENCODE_MODEL_SLUG_UNKNOWN` / scoped `MODEL_CATALOG_INVALID`; new `MODEL_CONFIG_PATH_UNKNOWN`, `MODEL_CONFIG_SCHEMA_MIX`, `MODEL_CONFIG_HOST_COLLISION` (distinct both-host row). No `HOST_CONFIG_*` reuse.
6. **Clean**: **exclude-from-clean** named locals (not copy-aside). Preserve `.opencode/model-catalog.local.json` and `.opencode/opencode.json{,c}` under `[opencode_clean_paths] .opencode`.
7. **Validator**: extend `model_tier_validate.py --scope model-config`; keep default Cursor + `--scope opencode-catalog`.
8. **Tests + docs**: 10 `test_us0132_*` markers (DQ9); runbook h2 `## Cursor/OpenCode model configuration contract (US-0132)`.

### Critic NB closures (research us0132rsc-* — informational)

| NB | Closure |
|----|---------|
| NB1 D6 gitignore / DQ1 `model.json` / DQ6 both-host | LOCKED §2/§5/§7 — reject unknown path; explicit OpenCode catalog gitignore; `--host both` never aliases |
| NB2 four layers + US-0131 kit SOT | LOCKED — `# US-0132` + DEC-0132; optional host-JSON read names-only; `HOST_COLLISION` distinct row |
| NB3 scope / YAGNI | Held — A2/A3/A4 rejected; US-0131 DONE compose-only; no third SOT; no DONE flip |

## Components

### Inventory + unknown-path gate (AC-1)

- Documented four-surface table (DEC-0132 §2)
- `--scope model-config` rejects repo-scoped `model.json{,c}`
- Migration recipe: copy slugs into the named Cursor or OpenCode surface; never keep `model.json`

### Schema separation (AC-2)

- Cursor resolver does not read OpenCode catalog
- OpenCode materializer does not read Cursor catalog or `MODEL_*`
- Schema-mix fixtures fail `MODEL_CONFIG_SCHEMA_MIX`

### Per-host diagnostics (AC-3)

- Cursor: `provenance=` winning step overlay (chain unmodified)
- OpenCode: per-layer result (absent no-op vs present inject vs host default)
- `--host both`: independent catalogs + per-host provenance

### Materializer (AC-4)

- `opencode_model_catalog_apply.py` invariants confirmed + tested (idempotent; never-write template / active local / Cursor / host JSON)

### Fail-closed + locals (AC-5, AC-6)

- Present-malformed ≠ absent-optional
- Exclude-from-clean + never-overwrite + explicit `.opencode/model-catalog.local.json` gitignore rows (root + template)

### Triple-surface + tests/docs (AC-7, AC-8)

- Python / PowerShell / shell installers + manifest agree on delivery/protection
- Ten markers (R-0117 DQ9):

1. `test_us0132_canonical_inventory_rejects_model_json`
2. `test_us0132_cursor_schema_not_interpreted_as_opencode`
3. `test_us0132_opencode_schema_not_interpreted_as_cursor`
4. `test_us0132_cursor_precedence_diagnostics_overlay`
5. `test_us0132_opencode_absent_catalog_noop_vs_present_fail_closed`
6. `test_us0132_materializer_idempotent_never_writes_template_or_host_json`
7. `test_us0132_installer_preserves_local_model_files_including_clean`
8. `test_us0132_both_host_independent_catalogs`
9. `test_us0132_gitignore_opencode_catalog_explicit_row`
10. `test_us0132_docs_migration_and_reason_codes`

## Companion DEC = DEC-0132 (Required → Accepted)

Authored Accepted in THIS phase at `decisions/DEC-0132.md`. Locks A1, four-surface inventory, unknown-path glob, schema split, per-host precedence diagnostics, `HOST_COLLISION` distinct row, exclude-from-clean, `--scope model-config`, tests/docs. **DEC-0131 is not reopened.**

## Risks finalized (R1–R6 from R-0117)

- **R1 (HIGH if A2)** `model.json` silent alias → mitigated by DQ1 reject + marker 1
- **R2 (MEDIUM)** clean deletes OpenCode locals → exclude-from-clean + marker 7
- **R3 (MEDIUM)** schema mix under `--host both` → `SCHEMA_MIX` + markers 2, 3, 8
- **R4 (LOW)** validator-scope sprawl → extend-in-place `--scope model-config`
- **R5 (MEDIUM)** US-0131 boundary leak → ignore kit keys in `opencode.json`; host-neutral resolver still ignores `MODEL_*`
- **R6 (LOW–MEDIUM)** docs drift vs three installers → AC-7 parity + marker 10

## Compose, do not amend (verified)

| Story / DEC | Surface | Verification |
|-------------|---------|--------------|
| US-0101 / DEC-0086 | Cursor catalog + tiers | ✓ unchanged; diagnostics overlay only |
| US-0102 / DEC-0087 | 5-step precedence + v2 roles | ✓ chain not rewritten |
| US-0130 | critic pin overlay | ✓ composed |
| US-0123 / DEC-0123 | OpenCode catalog + materializer | ✓ invariants confirmed; never write host JSON |
| US-0112 | example delivery | ✓ examples only; no active catalogs |
| DEC-0039 | local preservation | ✓ never overwrite + exclude-from-clean |
| US-0131 / DEC-0131 | host-neutral runtime SOT | ✓ DONE compose-only; not a second matrix |
| US-0126 | reason-code table | ✓ additive `MODEL_CONFIG_*` rows only |

## Sprint seeds (10 tasks within SPRINT_MAX_TASKS=12 — for `/sprint-plan` refinement)

- **T-anch** (`# US-0132` H1 + DEC-0132 Accepted — RESOLVED in THIS phase; NO-OP / verification)
- **T-001** (AC-1 — inventory + unknown-path `MODEL_CONFIG_PATH_UNKNOWN` at three repo locations)
- **T-002** (AC-2 — schema-mix `MODEL_CONFIG_SCHEMA_MIX`)
- **T-003** (AC-3 — Cursor `provenance=` diagnostics overlay; do not amend 5-step chain)
- **T-004** (AC-3 — OpenCode kit vs host layering + optional names-only host-JSON read)
- **T-005** (AC-6/AC-7 — gitignore row + exclude-from-clean + installer never-overwrite)
- **T-006** (AC-5 — `MODEL_CONFIG_*` codes + `HOST_COLLISION` distinct both-host row)
- **T-007** (AC-4 — materializer invariants)
- **T-008** (AC-1/AC-5/AC-8 — `model_tier_validate.py --scope model-config`)
- **T-009** (AC-8 — 10 `test_us0132_*` + runbook h2 + README pointer)

Execution order: T-anch → T-001 → T-002 → T-003 → T-004 → T-005 → T-006 → T-007 → T-008 → T-009 (acyclic; codes/inventory before validator scope; tests+docs last). No split (`SPRINT_AUTO_SPLIT` not triggered).

## Isolation evidence (US-0048 / DEC-0029)

- `phase_id=architecture`, `role=tech-lead`, `story_id=US-0132`, `sprint_id=S0134` (preview — sprint-plan owns folder), `orchestrator_run_id=auto-20260908-us0132`
- `delivery_mode=ultra_lean`, `macro_phase=plan` (architecture — second canonical phase of `plan` macro)
- `model_id=cursor-grok-4.6` (CROSS_MODEL_REVIEW=1 — required on isolation)
- `fresh_context_marker=tl-US0132-architecture-20260908T210500Z-fresh`, `timestamp=2026-09-08T21:05:00Z` (UTC)
- `evidence_ref=docs/engineering/phase-context.md; docs/product/backlog.md ## US-0132; docs/engineering/research.md ## R-0117; docs/product/vision.md ## Discovery Notes — US-0132; docs/engineering/architecture.md (this # US-0132); docs/engineering/decisions.md DEC-0131 compose-only; handoffs/resume_brief.md; handoffs/po_to_tl.md Research handoff US-0132; .cursor/commands/architecture.md; Context7 /websites/opencode_ai_v2`
- Fresh tech-lead subagent per BUG-0006 / US-0048; no prior chat history. Narrow-read only. No `.env` reads. Status remains OPEN. US-0131 DONE not reopened. No `/sprint-plan` spawn from this subagent.
- Prior phase strict proof consumed: `rp-auto-20260908-us0132-research-techlead-20260908T205500Z-US-0132` / `A67C61DF7B083A9AC9DC39326FACD9B4E897F43D6B47515EC301AF894E7B0FD5` — RUNTIME_PROOF_VALID (MATCH before TTL 2026-09-08T21:55:00Z). Critic findings us0132rsc-* informational only.

## Strict runtime proof (mirror)

- `runtime_proof_id=rp-auto-20260908-us0132-architecture-techlead-20260908T210500Z-US-0132`
- Canonical payload (sorted-key compact JSON per DEC-0038, lowercase keys): `{"delivery_mode":"ultra_lean","macro_phase":"plan","model_id":"cursor-grok-4.6","orchestrator_run_id":"auto-20260908-us0132","phase_id":"architecture","proof_issued_at":"2026-09-08T21:05:00Z","proof_ttl_seconds":3600,"role":"tech-lead","runtime_proof_id":"rp-auto-20260908-us0132-architecture-techlead-20260908T210500Z-US-0132","sprint_id":"S0134","story_id":"US-0132"}`
- `proof_hash=8255C22FCC78F2CFF74AD41A08D9FFF875AE09C205A82BEC78C4B4D03CD13013` (SHA-256)
- `proof_ttl_seconds=3600`, `proof_ttl=2026-09-08T22:05:00Z` (UTC)

## Decision gate + next scheduled phase

- `decision_gate=false` (no blocking unknown; DQ1–DQ10 LOCKED; DEC-0132 Accepted; approach A1 locked; deferred glob/read/collision/clean closed; critic NBs closed)
- `next_scheduled_phase=/sprint-plan` (role=tech-lead; third canonical phase of `plan` macro)
- `next_scheduled_role=tech-lead`
- `stop_condition=STOP after architecture completes; hand off via artifacts only to /sprint-plan in fresh tech-lead subagent (BUG-0006). Do NOT spawn /sprint-plan from this subagent. Do NOT mark US-0132 DONE. Do NOT reopen US-0131 / DEC-0131.`

