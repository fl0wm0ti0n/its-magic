# PO to TL archive pack (2026-09-12)

- Rollover trigger: `PO_TO_TL_HOT_MAX_LINES=650, PO_TO_TL_HOT_MAX_SECTIONS=60`
- Source: `handoffs/po_to_tl.md`
- Archived units (oldest first, contiguous prefix): 1
- Retained units in hot file: 15
- First archived heading: `## Research handoff — US-0131 Cross-host Its-Magic runtime configuration and parity`
- Last archived heading: `## Research handoff — US-0131 Cross-host Its-Magic runtime configuration and parity`
- Verification tuple (mandatory):
  - archived_body_lines=45
  - retained_body_lines=611

---

## Research handoff — US-0131 Cross-host Its-Magic runtime configuration and parity

- **Phase completed**: research. **Role**: tech-lead. **Story**: US-0131 only. **Sprint**: (pending). **Verdict**: PASS (`decision_gate=false`).
- **Timestamp (UTC)**: 2026-09-07T19:25:00Z. **Fresh marker**: `tl-US0131-research-20260907T192500Z-fresh`.
- **Orchestrator**: `orchestrator_run_id=auto-20260907-us0131`, `delivery_mode=ultra_lean`, macro=`plan` (research = first of research+architecture+sprint-plan).
- **Sibling boundary**: **US-0132** OPEN — OUT OF SCOPE (model catalogs / `MODEL_*` / materializers). **BUG-0015/BUG-0016** DONE — do not reopen.
- **Research anchor**: `docs/engineering/research.md` **`## R-0116`** (DQ1–DQ10 LOCKED; do not renumber R-0115).

### DQ locks (summary for architecture)

| DQ | Lock |
|----|------|
| **DQ1** | Host-neutral path **`.its-magic/config{,.local,.example}.json`** — no `.cursor/` required on OpenCode-only |
| **DQ2** | JSON `schema_version` + `shared` KEY map; fail-closed `HOST_CONFIG_*` |
| **DQ3** | Cursor scratchpad DEC-0055/0039 = compatibility adapter into same `shared` namespace |
| **DQ4** | OpenCode-only reads `.its-magic/` only; **forbid** dumping kit keys into `opencode.json` |
| **DQ5** | `scripts/host_runtime_config_lib.py:resolve_runtime_config` migrates shared-kernel hardcodes |
| **DQ6** | Both-host precedence: kit-local > cursor-local > kit-baseline > cursor-baseline > example > defaults |
| **DQ7** | Shared / Cursor-only / OpenCode-only / US-0132 matrix + reason-code family |
| **DQ8** | Kernel deliver `.its-magic/config.example.json`; never overwrite locals |
| **DQ9** | 10 `test_us0131_*` static/fixture markers (no live OpenCode probe) |
| **DQ10** | Runbook h2 `## Cross-host runtime configuration (US-0131)` + README + auto-orch cross-link |

### Architecture seeds

- Approach **A1** recommended (`.its-magic/` + LegacyScratchpadAdapter + resolver migration). Reject A2 (scratchpad-only), A3 (`opencode.json` store).
- Companion **DEC-0131** Required → Accepted in `/architecture`.
- Author `# US-0131` architecture H1; do not expand US-0132 ACs.

### Runtime proof (DEC-0038)

- `runtime_proof_id=rp-auto-20260907-us0131-research-techlead-20260907T192500Z-US-0131`
- `proof_hash=7DB90B2B345D7C4E84F0A7C78E99A662C7FF308271415ECC5F7DFEAB774BE2BE`
- `proof_ttl=2026-09-07T20:25:00Z`
- Canonical payload: `{"delivery_mode":"ultra_lean","macro_phase":"plan","model_id":"composer-2.5","orchestrator_run_id":"auto-20260907-us0131","phase_id":"research","proof_issued_at":"2026-09-07T19:25:00Z","proof_ttl_seconds":3600,"role":"tech-lead","runtime_proof_id":"rp-auto-20260907-us0131-research-techlead-20260907T192500Z-US-0131","sprint_id":"none","story_id":"US-0131"}`
- Consumed discovery proof: `rp-auto-20260907-us0131-discovery-po-20260907T191500Z-US-0131` / `7BC1124AE3DE20960D42D6FE750B9A9F4412B42D20798245BA452C1573BE83AE` — RUNTIME_PROOF_VALID (MATCH before TTL)

### Isolation + stop

- `phase_id=research`, `role=tech-lead`, `story_id=US-0131`, `model_id=composer-2.5`, `fresh_context_marker=tl-US0131-research-20260907T192500Z-fresh`
- `evidence_ref=docs/engineering/research.md ## R-0116; docs/product/backlog.md ## US-0131 research_notes; handoffs/po_to_tl.md Discovery handoff US-0131; docs/engineering/state.md discovery+critic checkpoints; docs/product/vision.md ## Discovery Notes — US-0131`
- **Status**: US-0131 remains **OPEN**. **Next**: `/architecture` in fresh **tech-lead** subagent. Do not spawn architecture from this research chat. STOP.

---

