# PO to TL archive pack (2026-09-12)

- Rollover trigger: `PO_TO_TL_HOT_MAX_LINES=650, PO_TO_TL_HOT_MAX_SECTIONS=60`
- Source: `handoffs/po_to_tl.md`
- Archived units (oldest first, contiguous prefix): 1
- Retained units in hot file: 15
- First archived heading: `## Research handoff — US-0132 Explicit Cursor/OpenCode model configuration contract`
- Last archived heading: `## Research handoff — US-0132 Explicit Cursor/OpenCode model configuration contract`
- Verification tuple (mandatory):
  - archived_body_lines=48
  - retained_body_lines=613

---

## Research handoff — US-0132 Explicit Cursor/OpenCode model configuration contract

- **Phase completed**: research. **Role**: tech-lead. **Story**: US-0132 only. **Sprint**: S0134. **Verdict**: PASS (`decision_gate=false`).
- **Timestamp (UTC)**: 2026-09-08T20:55:00Z. **Fresh marker**: `tl-US0132-research-20260908T205500Z-fresh`.
- **Orchestrator**: `orchestrator_run_id=auto-20260908-us0132`, `delivery_mode=ultra_lean`, macro=`plan` (research is first canonical phase of ultra_lean `plan`).
- **Sibling boundary**: **US-0131 DONE** (DEC-0131 / R-0116) — OUT OF SCOPE; not reopened; R-0116 not extended.
- **Research anchor**: `docs/engineering/research.md` `## R-0117 - US-0132 Explicit Cursor/OpenCode model configuration contract research`
- **Approach**: **A1** recommended. Reject A2 (`model.json` alias), A3 (union/generic kit SOT), A4 (dump catalog into `opencode.json`).
- **Companion DEC**: **DEC-0132** Required → Accepted in `/architecture` (do not amend DEC-0086 / 0087 / 0123 / 0131).

### Summary

Canonical inventory is four surfaces: Cursor `.cursor/model-catalog.local.json` + `MODEL_*`; OpenCode kit `.opencode/model-catalog.local.json`; OpenCode **host** local `opencode.json{,c}`. Generic `model.json` is **rejected** (`MODEL_CONFIG_PATH_UNKNOWN`) — not aliased. Schemas stay separate. Cursor 5-step chain + US-0130 critic overlay unchanged (diagnostics overlay only). OpenCode kit materializer vs host `opencode.json` stay independent layers. Gitignore/clean must protect OpenCode locals (`[opencode_clean_paths] .opencode` is an AC-6 gap). Extend `model_tier_validate.py --scope model-config`. Ten `test_us0132_*` markers. Runbook h2 `## Cursor/OpenCode model configuration contract (US-0132)`.

### Closed questions DQ1..DQ10 (10/10 — all LOCKED)

| Q | Topic | Resolution (summary) | LOCK |
|---|-------|-----------|------|
| DQ1 | `model.json` mapping | Reject-as-unknown; `MODEL_CONFIG_PATH_UNKNOWN`; no alias to catalog or `opencode.json` | LOCKED |
| DQ2 | Cursor precedence | DEC-0087 5-step + US-0130 overlay unchanged; additive `provenance=` diagnostics | LOCKED |
| DQ3 | OpenCode precedence | Kit catalog→installed agent frontmatter vs host `opencode.json` default vs session; absent catalog no-op | LOCKED |
| DQ4 | Gitignore + installer | Explicit `.opencode/model-catalog.local.json` gitignore row; never-overwrite locals; clean exemption for catalog + `opencode.json{,c}` | LOCKED |
| DQ5 | Reason codes | Reuse `MODEL_*` / `OPENCODE_MODEL_SLUG_UNKNOWN` / scoped `MODEL_CATALOG_INVALID`; new `MODEL_CONFIG_PATH_UNKNOWN` / `SCHEMA_MIX` / `HOST_COLLISION` | LOCKED |
| DQ6 | `--host both` | Independent catalogs; `model.json` stays unknown (not mapped); per-host provenance | LOCKED |
| DQ7 | Materializer | Idempotent; never-write template / active local / Cursor catalog / `opencode.json`; no credentials in examples | LOCKED |
| DQ8 | Validator `--scope` | Extend `model_tier_validate.py` with `--scope model-config`; keep default Cursor + `opencode-catalog` | LOCKED |
| DQ9 | Tests | 10 `test_us0132_*` markers; cursor/opencode/both fixtures; no live OpenCode probe | LOCKED |
| DQ10 | Docs + migration | New runbook h2; `model.json` migration recipe; architecture `# US-0132` + DEC-0132 | LOCKED |

### Architecture seeds preview (10 tasks within SPRINT_MAX_TASKS=12)

T-anch (`# US-0132` + DEC-0132), T-001 inventory/unknown-path, T-002 schema-mix, T-003 Cursor diagnostics overlay, T-004 OpenCode layering, T-005 gitignore/clean/installer, T-006 `MODEL_CONFIG_*` codes, T-007 materializer invariants, T-008 `--scope model-config`, T-009 tests+docs.

### Runtime proof (DEC-0038)

- `runtime_proof_id=rp-auto-20260908-us0132-research-techlead-20260908T205500Z-US-0132`
- `proof_hash=A67C61DF7B083A9AC9DC39326FACD9B4E897F43D6B47515EC301AF894E7B0FD5`
- `proof_ttl=2026-09-08T21:55:00Z`
- Canonical payload: `{"delivery_mode":"ultra_lean","macro_phase":"plan","model_id":"cursor-grok-4.6","orchestrator_run_id":"auto-20260908-us0132","phase_id":"research","proof_issued_at":"2026-09-08T20:55:00Z","proof_ttl_seconds":3600,"role":"tech-lead","runtime_proof_id":"rp-auto-20260908-us0132-research-techlead-20260908T205500Z-US-0132","sprint_id":"S0134","story_id":"US-0132"}`

### Isolation + stop

- `phase_id=research`, `role=tech-lead`, `story_id=US-0132`, `model_id=cursor-grok-4.6`, `fresh_context_marker=tl-US0132-research-20260908T205500Z-fresh`
- `evidence_ref=docs/engineering/research.md ## R-0117; docs/engineering/state.md research checkpoint; docs/product/backlog.md ## US-0132; handoffs/resume_brief.md`
- **Status**: US-0132 remains **OPEN**. **Next**: `/architecture` in fresh **tech-lead** subagent. Do not spawn architecture from this research chat. STOP.

---

