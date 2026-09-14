# PO to TL archive pack (2026-09-13)

- Rollover trigger: `PO_TO_TL_HOT_MAX_LINES=650, PO_TO_TL_HOT_MAX_SECTIONS=60`
- Source: `handoffs/po_to_tl.md`
- Archived units (oldest first, contiguous prefix): 1
- Retained units in hot file: 14
- First archived heading: `## Discovery handoff — US-0138 Typed runtime configuration and legacy migration adapter`
- Last archived heading: `## Discovery handoff — US-0138 Typed runtime configuration and legacy migration adapter`
- Verification tuple (mandatory):
  - archived_body_lines=63
  - retained_body_lines=609

---

## Discovery handoff — US-0138 Typed runtime configuration and legacy migration adapter

- **Phase completed**: discovery. **Role**: po. **Story**: US-0138 only. **Sprint**: (pending). **Verdict**: PASS (`decision_gate=false`).
- **Timestamp (UTC)**: 2026-09-13T13:35:00Z. **Fresh marker**: `po-US0138-discovery-20260913T133500Z-fresh`.
- **Orchestrator**: `orchestrator_run_id=auto-20260913-us0138`, parent=`auto-20260913-us0137`, `delivery_mode=ultra_lean`, macro=`spec` (intake already DONE — not re-intaken), `model_id=cursor-grok-4.6-high`, CROSS_MODEL_REVIEW=1, AUTO_QUIET=1, EARLY_RESEARCH=1.
- **Sibling boundary**: **US-0139..US-0148** OPEN — OUT OF SCOPE this segment (do not mutate). **US-0140** lifecycle/WorkflowEngine OUT. **US-0133** / **US-0134** / **US-0135** / **US-0136** / **US-0137** DONE — compose only; do not reopen. **BUG-0020** DONE — do not reopen.
- **Gap confirmed (narrow-read)**: Standalone TypeScript runtime has no versioned `RuntimeConfig` resolver and no `LegacyScratchpadAdapter`. Kit Python `scripts/host_runtime_config_lib.py` (US-0131 / DEC-0131) remains Cursor/OpenCode host SOT — analog/compose only, not the standalone engine. PolicyEngine already has thin enums (`Autonomy`/`PermissionMode`/`SecurityClass`/`IsolationProfile`); this story must consume them, not rewrite policy. Auth-models owns credentials (OUT). R9 (code-parsed config) and R10 (`security_hard` unrelaxable) are still unenforced in standalone config.

### Discovery locks D1–D10

| ID | Lock |
|----|------|
| **D1** | Versioned typed `RuntimeConfig` covers delivery, token, work-kind, phase, model, autonomy, stop, retry/test, browser, dev-environment, remote, security/compliance, and sovereign settings (AC-1 / §13.1 / §15). Schema carries `schema_version`. Axes stay separate: `DELIVERY_MODE` ≠ `TOKEN_PROFILE` ≠ `AUTONOMY_PRESET` ≠ `WORK_KIND_ROUTING` (§15). |
| **D2** | Precedence is deterministic and documented (AC-2 / §13.3): **CLI one-run > local project (gitignored) > shared project > legacy scratchpad compatibility > framework defaults**, with provenance diagnostics per key. Research must map this 5-layer ladder onto (not silently replace) US-0131's kit/cursor interleave. |
| **D3** | `LegacyScratchpadAdapter` reads, validates, and maps existing scratchpad flags into `RuntimeConfig` without requiring immediate migration (AC-3 / §13.2). Absent legacy files are valid. Emits actionable migration diagnostics. Local operator files are preserved (DEC-0039). Do not rewrite `host_runtime_config_lib.py`. |
| **D4** | Secrets are rejected from shared config (AC-4 / §26.4). Configuration references secret **names** or execution-layer **handles** only. Provider OAuth/API credentials stay in US-0135 owned store — **this story does not own provider credentials**. Never read `.env`. Analog: `HOST_CONFIG_SECRET_REJECTED`. |
| **D5** | Invalid versions, types, enum values, conflicts, or unsafe relaxations fail closed (AC-5). `security_hard` conditions cannot be weakened by autonomy settings (R10; compose US-0119/DEC-0119 matrix + US-0137 `SecurityClass`). Models never decide whether a hard stop is relaxable (§14.6). |
| **D6** | Tests cover every precedence layer, absent legacy files, malformed config, local-file preservation, and unchanged behavior for supported existing repositories (AC-6). Fake-model CI. Windows + Linux `test_us0138_*`. |
| **D7** | Package boundary: new `standalone/packages/config` (masterplan §30). **No Pi imports** outside `packages/pi-kernel` (R1 / DEC-0133). Do not amend isolation loader / `noTools`, KernelBridge locate/handshake, auth-models credential store, RoleCatalog/SessionSupervisor internals, or PolicyEngine/ToolBroker decision tables — consume thin enums + typed flags only. |
| **D8** | Out of scope: provider credentials (US-0135), installer UX, workflow implementation / CommandRouter / phase graph (US-0140), context/intelligence backends (US-0139), OS sandbox (US-0141), browser runtime (US-0142), drain (US-0143). US-0133/US-0134/US-0135/US-0136/US-0137/BUG-0020 not reopened. US-0139+ not mutated. |
| **D9** | Compose PolicyEngine thin enums; do not rewrite policy. Compose ModelRouter catalog/thinking/`TOKEN_PROFILE` orthogonality (not credentials). Compose RoleCatalog. Port US-0119 `AUTONOMY_PRESET` expansion into the resolver. Kit US-0131 `.its-magic/` JSONC remains host analog. |
| **D10** | Research questions DQ1–DQ10 → `/research` authors **R-0130** (next after R-0129; compose R-0129/DEC-0137/US-0137 + R-0128/R-0127/R-0122/R-0121 + R-0116/DEC-0131 analog; do not wipe R-0120..R-0129). Companion **DEC-0138** + `# US-0138` at `/architecture` only — PO does not author them. |

### Research questions DQ1–DQ10 (for `/research` → expect **R-0130**)

1. **DQ1**: Package split — `standalone/packages/config` vs fold into `runtime-core`; TypeScript surfaces; no Pi imports; who injects resolved config into PolicyEngine / ModelRouter / SessionSupervisor without those packages importing config internals.
2. **DQ2**: Schema language — owned TS types + Zod vs TypeBox vs JSON Schema (ajv); `schema_version` evolution; JSONC vs YAML vs JSON; reject executable config (`.js`/`.ts` cosmiconfig loaders) for fail-closed safety.
3. **DQ3**: File layout — gitignored local vs shared project paths; relation to kit `.its-magic/config{,.local,.example}.json` (compose vs dual-SOT); standalone-owned filenames; CLI one-run flag/env names.
4. **DQ4**: Precedence exact mapping vs US-0131 7-layer kit/cursor interleave; per-key provenance diagnostics schema; conflict detection when layers disagree on security-hard keys.
5. **DQ5**: `LegacyScratchpadAdapter` — TS reimplementation vs spawn Python `parse_scratchpad_*`; flag inventory / unknown-key policy; migration diagnostic format; absent-file vs malformed-file reason codes; DEC-0039 local-file never-overwrite.
6. **DQ6**: Secret boundary — reject secret-shaped values in shared+local project files; allow names/handles only; compose US-0135 store (do not read credentials); never `.env`; reason-code family (`CONFIG_*` vs reuse `HOST_CONFIG_SECRET_REJECTED`).
7. **DQ7**: Autonomy/security-hard — consume US-0119 matrix + PolicyEngine `SecurityClass`; fail-closed unsafe relaxations; preset expansion before execution; models cannot relax R10 gates.
8. **DQ8**: Domain coverage for AC-1 groups (delivery/token/work-kind/phase/model/autonomy/stop/retry-test/browser/dev-env/remote/security/sovereign) — which fields are typed enums now vs opaque passthrough until US-0139/0140/0141/0142 consumers exist.
9. **DQ9**: Kernel compose — additive resolver only; empty loader + `noTools` held; KernelBridge unamended; auth-models unamended except consume catalog/thinking flags; PolicyEngine unamended except consume typed autonomy/security/profile flags.
10. **DQ10**: `test_us0138_*` Win+Linux inventory — every precedence layer wins; absent legacy OK; malformed fail-closed; local-file preservation; existing-repo behavioral identity; secret rejection; `security_hard` not weakened by autonomy; invalid version/enum/conflict.

### Design refs

- `docs/product/standalone-its-magic-pi-masterplan.md` sections 13, 15, 26.4, 30 (`packages/config`), 32 Phase 1, R9/R10, §14.6
- Kit analog (compose, do not rewrite): `scripts/host_runtime_config_lib.py`, `decisions/DEC-0131.md`, `docs/engineering/research.md` **R-0116**, `.its-magic/config{,.example}.json`
- EARLY_RESEARCH analogs (DQ seeds, not adopted): cosmiconfig first-found-wins (no layered merge — reject as SOT); Zod / TypeBox / JSON Schema ajv; dotenv-flow layered overlay
- Compose: `decisions/DEC-0137.md`, `decisions/DEC-0136.md`, `decisions/DEC-0135.md`, `decisions/DEC-0134.md`, `decisions/DEC-0133.md`, `decisions/DEC-0119.md`
- Compose: `docs/engineering/research.md` R-0129 / R-0128 / R-0127 / R-0122 / R-0121 (do not wipe R-0120..R-0129)
- Compose: `standalone/packages/policy-engine/src/types.ts` thin enums; `standalone/packages/auth-models/src/types.ts` (`TOKEN_PROFILE` orthogonality; credentials OUT); `standalone/packages/role-runtime/src/catalog.ts`
- Intake (read-only): `handoffs/intake_evidence/US-0133-0148-intake-20260911.json` (`typed-config-legacy-adapter` → US-0138)

### Runtime proof (DEC-0038)

- `runtime_proof_id=rp-auto-20260913-us0138-discovery-po-20260913T133500Z-US-0138`
- `proof_hash=CD875B00729490356361F201D267184DF371645349B7006C08A010EF798E7F81`
- `proof_ttl=2026-09-13T14:35:00Z`
- Hash via `from scripts.token_cost_lib import compute_strict_proof_hash` (positional; compact sorted-key JSON).
- Canonical hashed payload: `{"orchestrator_run_id":"auto-20260913-us0138","phase_id":"discovery","proof_issued_at":"2026-09-13T13:35:00Z","proof_ttl_seconds":3600,"role":"po","runtime_proof_id":"rp-auto-20260913-us0138-discovery-po-20260913T133500Z-US-0138"}`
- Isolation extras (not hashed): `delivery_mode=ultra_lean`, `macro_phase=spec`, `model_id=cursor-grok-4.6-high`, `sprint_id=none`, `story_id=US-0138`
- `hash_recompute_confirmation=true` (compute_strict_proof_hash → CD875B00729490356361F201D267184DF371645349B7006C08A010EF798E7F81)

### Isolation + stop

- `phase_id=discovery`, `role=po`, `story_id=US-0138`, `model_id=cursor-grok-4.6-high`, `fresh_context_marker=po-US0138-discovery-20260913T133500Z-fresh`
- `evidence_ref=docs/product/backlog.md ## US-0138 discovery_notes; docs/product/acceptance.md US-0138 row (unchecked); handoffs/intake_evidence/US-0133-0148-intake-20260911.json; docs/engineering/state.md discovery checkpoint; handoffs/resume_brief.md`
- **Hot-surface note**: Appended (not prepended) so triad oldest-prefix rollover retains this newest section. `arch_linkage_guard.py --pre` exit 0 → `--rollover` `rollover_complete units=2,2` pack_state=`docs/engineering/state-archive/state-pack-20260913-bl.md` (archived `## Sovereign-critic checkpoint — architecture US-0137` through `## Sprint-plan checkpoint — US-0137 / S0143`; archived_body_lines=162; preamble_lines=11; retained_body_lines=1163) pack_po=`handoffs/archive/po-to-tl-pack-20260913-g.md` (archived `## Research handoff — BUG-0019` + `## Architecture handoff — BUG-0019`; archived_body_lines=67; retained_body_lines=632) → `--post` exit 0; architecture not rolled; final `--check` PASS (`state` 1165/1200; `po_to_tl` 632/650).
- **Status**: US-0138 remains **OPEN**. **Next**: `/research` in fresh **tech-lead** subagent. Do not spawn research from this discovery chat. STOP.

