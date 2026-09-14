# PO to TL archive pack (2026-09-12)

- Rollover trigger: `PO_TO_TL_HOT_MAX_LINES=650, PO_TO_TL_HOT_MAX_SECTIONS=60`
- Source: `handoffs/po_to_tl.md`
- Archived units (oldest first, contiguous prefix): 1
- Retained units in hot file: 15
- First archived heading: `## Architecture handoff — US-0131 Cross-host Its-Magic runtime configuration and parity`
- Last archived heading: `## Architecture handoff — US-0131 Cross-host Its-Magic runtime configuration and parity`
- Verification tuple (mandatory):
  - archived_body_lines=28
  - retained_body_lines=642

---

## Architecture handoff — US-0131 Cross-host Its-Magic runtime configuration and parity

- **Phase completed**: architecture. **Role**: tech-lead. **Story**: US-0131 only. **Sprint**: (pending). **Verdict**: PASS (`decision_gate=false`).
- **Timestamp (UTC)**: 2026-09-07T19:35:00Z. **Fresh marker**: `tl-US0131-architecture-20260907T193500Z-fresh`.
- **Orchestrator**: `orchestrator_run_id=auto-20260907-us0131`, `delivery_mode=ultra_lean`, macro=`plan` (architecture = second of research+architecture+sprint-plan).
- **Sibling boundary**: **US-0132** OPEN — OUT OF SCOPE. **BUG-0015/BUG-0016** DONE — do not reopen.
- **Architecture anchor**: `docs/engineering/architecture.md` **`# US-0131`**
- **Companion DEC**: `decisions/DEC-0131.md` (**Accepted**)
- **Research anchor**: `docs/engineering/research.md` **`## R-0116`** (DQ1–DQ10 LOCKED)

### Approach A1 LOCKED

Host-neutral `.its-magic/config{,.local,.example}.json` SOT + Cursor DEC-0055/0039 LegacyScratchpadAdapter (Model B pre-merge then DQ6 interleave) + `host_runtime_config_lib.resolve_runtime_config` shared-kernel injection. OpenCode-only without `.cursor/`. Forbid kit keys in `opencode.json`. Schema v1 + `HOST_CONFIG_*` family. 10 `test_us0131_*` markers. Sprint seeds T-anch + T-001..T-009 within SPRINT_MAX_TASKS=12.

### Runtime proof (DEC-0038)

- `runtime_proof_id=rp-auto-20260907-us0131-architecture-techlead-20260907T193500Z-US-0131`
- `proof_hash=F31B058CC5CDEAF68EDD2F53F4EF790D1845CE842E2B16057247CF5FE4170C4C`
- `proof_ttl=2026-09-07T20:35:00Z`
- Consumed research proof: `rp-auto-20260907-us0131-research-techlead-20260907T192500Z-US-0131` / `7DB90B2B345D7C4E84F0A7C78E99A662C7FF308271415ECC5F7DFEAB774BE2BE` — RUNTIME_PROOF_VALID

### Isolation + stop

- `phase_id=architecture`, `role=tech-lead`, `story_id=US-0131`, `model_id=composer-2.5`, `fresh_context_marker=tl-US0131-architecture-20260907T193500Z-fresh`
- **Status**: US-0131 remains **OPEN**. **Next**: `/sprint-plan` in fresh **tech-lead** subagent (orchestrator may insert sovereign-critic of architecture first). Do not spawn sprint-plan from this architecture chat. STOP.

---

