# PO to TL archive pack (2026-09-12)

- Rollover trigger: `PO_TO_TL_HOT_MAX_LINES=650, PO_TO_TL_HOT_MAX_SECTIONS=60`
- Source: `handoffs/po_to_tl.md`
- Archived units (oldest first, contiguous prefix): 1
- Retained units in hot file: 15
- First archived heading: `## Discovery handoff — US-0132 Explicit Cursor/OpenCode model configuration contract`
- Last archived heading: `## Discovery handoff — US-0132 Explicit Cursor/OpenCode model configuration contract`
- Verification tuple (mandatory):
  - archived_body_lines=58
  - retained_body_lines=631

---

## Discovery handoff — US-0132 Explicit Cursor/OpenCode model configuration contract

- **Phase completed**: discovery. **Role**: po. **Story**: US-0132 only. **Sprint**: (pending). **Verdict**: PASS (`decision_gate=false`).
- **Timestamp (UTC)**: 2026-09-08T20:50:00Z. **Fresh marker**: `po-US0132-discovery-20260908T205000Z-fresh`.
- **Orchestrator**: `orchestrator_run_id=auto-20260908-us0132`, `delivery_mode=ultra_lean`, macro=`spec` (intake already PASS — not re-intaken).
- **Sibling boundary**: **US-0131 DONE** (DEC-0131) — OUT OF SCOPE; do not reopen; do not expand into US-0131 runtime-config ACs.
- **Gap confirmed**: model-file ownership across Cursor catalog + `MODEL_*`, OpenCode catalog, and local `opencode.json{,c}` is not yet a single documented contract; generic `model.json` must not become an undocumented third SOT.

### Discovery locks D1–D10

| ID | Lock |
|----|------|
| **D1** | Canonical inventory: Cursor `.cursor/model-catalog.local.json` + `MODEL_*`; OpenCode `.opencode/model-catalog.local.json`; local-only `opencode.json{,c}` as host model/providers file. Undocumented `model.json` rejected unless `/research` maps it (DQ1). |
| **D2** | Separate schemas: Cursor tier/phase/role-catalog (DEC-0086/0087); OpenCode per-role `provider/slug` (DEC-0123). No cross-host catalog interpretation. |
| **D3** | Per-host precedence (independent; observable diagnostics). `--host both` never unions schemas. |
| **D4** | OpenCode catalog materializes idempotently into installed agents only; Cursor resolution read-only; templates never get operator slugs/credentials. |
| **D5** | Fail-closed: present malformed/unknown → host-scoped reason code; absent optional → documented default (never confused with invalid). |
| **D6** | Local-file protection on install/missing/upgrade/clean (DEC-0039 compose); gitignore/manifest gaps are DQ4. |
| **D7** | Triple-installer + validator + manifest + template example parity for `--host cursor\|opencode\|both`. |
| **D8** | Contract tests + operator recipes/migration docs (active + template). |
| **D9** | **US-0131 boundary** — DONE compose only; kit governance stays out of `opencode.json`. |
| **D10** | Compose DEC-0086/0087/0123/0131 + US-0101/0102/0112/0123/0130; no vendor pick, no proxy, no tracked credentials. |

### Research questions DQ1–DQ10 (for `/research` → expect **R-0117**)

1. **DQ1**: `model.json` mapping — reject vs alias; exact unknown-path reason code.
2. **DQ2**: Cursor precedence/diagnostics overlay without amending DEC-0087/0086/US-0130.
3. **DQ3**: OpenCode precedence among catalog materializer, agent frontmatter, `opencode.json{,c}`, session default.
4. **DQ4**: Gitignore + installer never-overwrite + example-delivery surfaces per `--host`.
5. **DQ5**: Reason-code family reuse vs new `MODEL_CONFIG_*` / host-scoped codes.
6. **DQ6**: `--host both` provenance + generic `model.json` collision diagnostics.
7. **DQ7**: Materializer idempotency + never-write-template / never-write-active-local.
8. **DQ8**: `model_tier_validate.py --scope` matrix (extend vs new script).
9. **DQ9**: Minimal `test_us0132_*` inventory + fixtures (no live OpenCode probe).
10. **DQ10**: Docs anchors for recipes, `model.json` migration, fail-closed codes.

### Config-surface / design refs

- OpenCode: https://opencode.ai/v2/docs/config/ ; https://opencode.ai/v2/docs/models — `opencode.json{,c}` (`model`, `providers`); agent `model:` frontmatter; **no official `model.json`**
- Cursor: DEC-0086 / DEC-0087; `.cursor/model-catalog.local.json`; scratchpad `MODEL_*`
- OpenCode kit: DEC-0123; `.opencode/model-catalog.local.json`; `scripts/opencode_model_catalog_apply.py`
- Sibling: DEC-0131 / US-0131 DONE — kit keys forbidden in `opencode.json`
- Vision: `docs/product/vision.md` `## Discovery Notes — US-0132`
- Intake (read-only): `handoffs/intake_evidence/US-0131-0132-intake-20260906.json`

### Runtime proof (DEC-0038)

- `runtime_proof_id=rp-auto-20260908-us0132-discovery-po-20260908T205000Z-US-0132`
- `proof_hash=411E974B49A6636F4F73515A31EB7D67D792A95420251A54F35B03CA547537F8`
- `proof_ttl=2026-09-08T21:50:00Z`
- Canonical payload: `{"delivery_mode":"ultra_lean","macro_phase":"spec","model_id":"cursor-grok-4.5","orchestrator_run_id":"auto-20260908-us0132","phase_id":"discovery","proof_issued_at":"2026-09-08T20:50:00Z","proof_ttl_seconds":3600,"role":"po","runtime_proof_id":"rp-auto-20260908-us0132-discovery-po-20260908T205000Z-US-0132","sprint_id":"none","story_id":"US-0132"}`

### Isolation + stop

- `phase_id=discovery`, `role=po`, `story_id=US-0132`, `model_id=cursor-grok-4.5`, `fresh_context_marker=po-US0132-discovery-20260908T205000Z-fresh`
- `evidence_ref=docs/product/vision.md ## Discovery Notes — US-0132; docs/product/backlog.md ## US-0132 discovery_notes; handoffs/intake_evidence/US-0131-0132-intake-20260906.json; docs/engineering/state.md discovery checkpoint; handoffs/resume_brief.md`
- **Status**: US-0132 remains **OPEN**. **Next**: `/research` in fresh **tech-lead** subagent. Do not spawn research from this discovery chat. STOP.

