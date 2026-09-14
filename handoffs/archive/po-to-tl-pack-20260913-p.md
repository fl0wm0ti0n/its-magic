# PO to TL archive pack (2026-09-13)

- Rollover trigger: `PO_TO_TL_HOT_MAX_LINES=650, PO_TO_TL_HOT_MAX_SECTIONS=60`
- Source: `handoffs/po_to_tl.md`
- Archived units (oldest first, contiguous prefix): 1
- Retained units in hot file: 14
- First archived heading: `## Research handoff — US-0137 Owned tool broker, policy engine, and security boundary`
- Last archived heading: `## Research handoff — US-0137 Owned tool broker, policy engine, and security boundary`
- Verification tuple (mandatory):
  - archived_body_lines=50
  - retained_body_lines=643

---

## Research handoff — US-0137 Owned tool broker, policy engine, and security boundary

- **Phase completed**: research. **Role**: tech-lead. **Story**: US-0137 only. **Sprint**: (pending). **Verdict**: PASS (`decision_gate=false`).
- **Timestamp (UTC)**: 2026-09-13T10:35:00Z. **Fresh marker**: `tl-US0137-research-20260913T103500Z-fresh`.
- **Orchestrator**: `orchestrator_run_id=auto-20260913-us0137`, parent=`auto-20260913-us0136`, `delivery_mode=ultra_lean`, macro=`plan` (research = first of research+architecture+sprint-plan), `model_id=cursor-grok-4.6-high`, CROSS_MODEL_REVIEW=1, AUTO_QUIET=1, EARLY_RESEARCH=1.
- **Sibling boundary**: **US-0138..US-0148** OPEN — OUT OF SCOPE this segment (do not mutate). **US-0141** OS sandbox OUT OF SCOPE — do not claim a complete sandbox from in-process checks. **US-0133** / **US-0134** / **US-0135** / **US-0136** DONE — compose only; do not reopen. **BUG-0020** DONE — do not reopen.
- **Research anchor**: `docs/engineering/research.md` **`## R-0129`** (DQ1–DQ10 LOCKED). Discovery D1–D10 not rewritten. Do not wipe R-0120..R-0128.
- **Approach**: **A1 (A\*)** recommended. Reject A2 (`pi-kernel` fold), A3 (`role-runtime` fold), A4 (`runtime-core` fold), A5 (Pi raw tools / drop `noTools`), A6 (in-process-as-sandbox), A7 (Cedar/OPA/Cerbos), A8 (extend `compute_strict_proof_hash`), A9 (amend US-0136 RoleCatalog as permission), A10 (SQLite), A11 (paid CI), A12 (amend isolation loader / KernelBridge / auth-models).
- **Companion DEC**: **DEC-0137** Required → Accepted in `/architecture`. Do **not** create `decisions/DEC-0137.md` this phase. Do **not** author `# US-0137`.

### Closed questions DQ1–DQ10

| DQ | Topic | Resolution | LOCK |
|----|-------|------------|------|
| DQ1 | Package + tool-port | `standalone/packages/policy-engine` + `tool-broker` (no Pi); thin `KernelCreateSessionOptions.ownedTools`; `defineTool` only inside `pi-kernel` | LOCKED |
| DQ2 | `itsm_*` catalog | Role/phase allowlist via ToolBroker; implement file/shell/git; stubs for US-0139/0141/0142; `itsm_ping` not production mutation; `noTools: "builtin"` held | LOCKED |
| DQ3 | Policy language | Owned TS decision tables; ALLOW/ASK/DENY; default-deny; ASK in-memory + gitignored JSON; `security_hard` not softened; reject Cedar/OPA/Cerbos | LOCKED |
| DQ4 | Path ownership | Canonicalize + RoleCatalog keys + deny matrix (PO/QA/release/closure/orchestrator/curator) | LOCKED |
| DQ5 | Shell classifier | argv/PowerShell tokens (not full AST); unparseable DENY; traversal/exfil/privileged inventory | LOCKED |
| DQ6 | Secrets | Deny `.env` before model sees content; compose US-0135 `redactAudit`; never log tokens | LOCKED |
| DQ7 | Profiles vs sandbox | Enum `trusted-local`/`isolated-development`/`untrusted-repository`; `ISOLATION_BACKEND_UNAVAILABLE`; Layer B = US-0141 | LOCKED |
| DQ8 | Audit + hash | Compact JSONL; real `policy_hash` replaces stub; DEC-0038 unamended | LOCKED |
| DQ9 | Kernel compose | Additive ownedTools; empty loader + `noTools` held; malicious `.pi/extensions` cannot register; `PI_COMPAT_RESOURCES` default-off | LOCKED |
| DQ10 | Tests | 10 `test_us0137_*` Win+Linux fake-model: no raw Pi tools, role subset, PO/QA deny, `.env`, traversal, exfil, redaction, backend unavailable, malicious extension + orchestrator zero tools | LOCKED |

### Architecture seeds

- Author `# US-0137` + **DEC-0137** (Accepted).
- Seeds T-anch + T-001..T-010 (11 ≤ SPRINT_MAX_TASKS=12).
- Do not expand US-0138+ ACs. Do not amend isolation loader internals / `noTools` / KernelBridge / auth-models. Do not implement application code this phase.

### Runtime proof (DEC-0038)

- `runtime_proof_id=rp-auto-20260913-us0137-research-techlead-20260913T103500Z-US-0137`
- `proof_hash=4B7F9F93EBF2DD358F41ADD6D25DFF93C17DF531D365C385ACE8937F0673817E`
- `proof_ttl=2026-09-13T11:35:00Z`
- Hash via `from scripts.token_cost_lib import compute_strict_proof_hash` (positional; compact sorted-key JSON).
- Canonical hashed payload: `{"orchestrator_run_id":"auto-20260913-us0137","phase_id":"research","proof_issued_at":"2026-09-13T10:35:00Z","proof_ttl_seconds":3600,"role":"tech-lead","runtime_proof_id":"rp-auto-20260913-us0137-research-techlead-20260913T103500Z-US-0137"}`
- Isolation extras (not hashed): `delivery_mode=ultra_lean`, `macro_phase=plan`, `model_id=cursor-grok-4.6-high`, `sprint_id=none`, `story_id=US-0137`
- `hash_recompute_confirmation=true` (compute_strict_proof_hash → 4B7F9F93EBF2DD358F41ADD6D25DFF93C17DF531D365C385ACE8937F0673817E)
- Consumed discovery proof: `rp-auto-20260913-us0137-discovery-po-20260913T101500Z-US-0137` / `4982C931EAF52F854E23C5D91C16D1C771256548A6DA94F9858785BB7CC639FB` — RUNTIME_PROOF_VALID (MATCH before TTL `2026-09-13T11:15:00Z`; consumed_at `2026-09-13T10:35:00Z`; independent recompute MATCH)
- Consumed critic proof: `rp-auto-20260913-us0137-sovereign-critic-techlead-20260913T102500Z-US-0137` / `0B1CD0DCEBDAC9FA3BF16B464E997D1912B621C67AB4F6F6B665A48741D60B80` — RUNTIME_PROOF_VALID (MATCH before TTL `2026-09-13T11:25:00Z`)

### Isolation + stop

- `phase_id=research`, `role=tech-lead`, `story_id=US-0137`, `model_id=cursor-grok-4.6-high`, `fresh_context_marker=tl-US0137-research-20260913T103500Z-fresh`
- `evidence_ref=docs/engineering/research.md ## R-0129; docs/product/backlog.md ## US-0137 research_notes; docs/engineering/state.md research checkpoint; docs/engineering/decisions.md ## DEC-0137 Required stub; handoffs/resume_brief.md`
- **Hot-surface note**: Appended (not prepended) so triad oldest-prefix rollover retains this newest section. Post-append `--check` → STATE_ARCHIVE_REQUIRED `state` 1340/1200 units=16/80 + `po_to_tl` 684/650 units=15/60 → `arch_linkage_guard.py --pre` exit 0 → `--rollover` `rollover_complete units=2,1` pack_state=`docs/engineering/state-archive/state-pack-20260913-ax.md` (archived `## Sovereign-critic checkpoint — sprint-plan US-0136` through `## Execute checkpoint — US-0136`; archived_body_lines=160; preamble_lines=11; retained_body_lines=1180) pack_po=`handoffs/archive/po-to-tl-pack-20260913-f.md` (archived `## Discovery handoff — BUG-0019`; archived_body_lines=48; retained_body_lines=636) → `--post` exit 0; architecture not rolled; final `--check` PASS.
- **Status**: US-0137 remains **OPEN**. **Next**: `/architecture` in fresh **tech-lead** subagent. Do not spawn architecture from this research chat. STOP.

