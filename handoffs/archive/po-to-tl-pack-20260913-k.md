# PO to TL archive pack (2026-09-13)

- Rollover trigger: `PO_TO_TL_HOT_MAX_LINES=650, PO_TO_TL_HOT_MAX_SECTIONS=60`
- Source: `handoffs/po_to_tl.md`
- Archived units (oldest first, contiguous prefix): 1
- Retained units in hot file: 13
- First archived heading: `## Research handoff — US-0135 Standalone authentication and model routing`
- Last archived heading: `## Research handoff — US-0135 Standalone authentication and model routing`
- Verification tuple (mandatory):
  - archived_body_lines=49
  - retained_body_lines=615

---

## Research handoff — US-0135 Standalone authentication and model routing

- **Phase completed**: research. **Role**: tech-lead. **Story**: US-0135 only. **Sprint**: (pending). **Verdict**: PASS (`decision_gate=false`).
- **Timestamp (UTC)**: 2026-09-13T03:55:00Z. **Fresh marker**: `tl-US0135-research-20260913T035500Z-fresh`.
- **Orchestrator**: `orchestrator_run_id=auto-20260913-us0135`, parent=`auto-20260913-bug0020`, `delivery_mode=ultra_lean`, macro=`plan` (research = first of research+architecture+sprint-plan), `model_id=cursor-grok-4.6-high`, CROSS_MODEL_REVIEW=1, AUTO_QUIET=1, EARLY_RESEARCH=1.
- **Sibling boundary**: **US-0136..US-0148** OPEN — OUT OF SCOPE this segment. **US-0133** / **US-0134** DONE — compose only; do not reopen. **BUG-0020** DONE — do not reopen.
- **Research anchor**: `docs/engineering/research.md` **`## R-0127`** (DQ1–DQ10 LOCKED). Discovery D1–D10 not rewritten. Do not wipe R-0120..R-0126.
- **Approach**: **A1 (A\*)** recommended. Reject A2 (`~/.pi/agent` ship store), A3 (project/`.env`), A4 (workflow Pi imports), A5 (no `auth-models` package), A6 (project `.pi/extensions`), A7 (paid CI), A8 (Cursor catalog as runtime), A9 (auto-next-slug).
- **Companion DEC**: **DEC-0135** Required → Accepted in `/architecture`. Do **not** create `decisions/DEC-0135.md` this phase.

### Closed questions DQ1–DQ10

| DQ | Topic | Resolution | LOCK |
|----|-------|------------|------|
| DQ1 | Owned credential path | OS config dir (`XDG` / `%APPDATA%` / macOS Application Support) + `ModelRuntime.create({ authPath, modelsPath })`; 0600-class; `InMemoryCredentialStore` tests; Pi `~/.pi/agent` migrate-only | LOCKED |
| DQ2 | Codex OAuth | `login("openai-codex", "oauth", interaction)` with browser/device_code callbacks; `CredentialSynchronizationError` fail-closed; not TUI `/login` | LOCKED |
| DQ3 | Provider matrix | Built-in Codex + openai/anthropic/google/openrouter + Chinese (`deepseek`/`kimi-coding`/`zai`/`minimax`/`qwen-token-plan*`); local/custom via owned `models.json` | LOCKED |
| DQ4 | Custom vs empty loader | Owned `modelsPath` + runtime `registerProvider` for corporate OAuth; **no** project `.pi/extensions` | LOCKED |
| DQ5 | ModelRouter 6-step | CLI > phase-local > role catalog > critic overlay > tier/catalog > runtime default; Pi `provider/model`; Cursor aliases dropped; provenance required | LOCKED |
| DQ6 | Catalog | Thin standalone JSON (tiers/roles/critic/thinking); not US-0138 `RuntimeConfig`; not Cursor catalog SOT | LOCKED |
| DQ7 | Thinking | `createAgentSession({ thinkingLevel })` inject; orthogonal to slug/`TOKEN_PROFILE`; map holes clamp+provenance | LOCKED |
| DQ8 | Critic pin | Catalog `critic.model`; same slug → `CROSS_MODEL_DEGRADED_MODE`; not hard stop; not auto-next-slug | LOCKED |
| DQ9 | `models test` | `checkAuth` default; `--live` never CI; 10 `test_us0135_*` Win+Linux fake-model; two-role fixture unpaid | LOCKED |
| DQ10 | OAuth refresh | Tokens never in prompt/audit/logs/repo; redact Authorization/Cookie; fake-model CI; never `.env` | LOCKED |

### Architecture seeds

- Author `# US-0135` + **DEC-0135** (Accepted).
- Seeds T-anch + T-001..T-009 (10 ≤ SPRINT_MAX_TASKS=12).
- Do not expand US-0136+ ACs. Do not amend isolation loader / `noTools` / KernelBridge. Do not implement ToolBroker.

### Runtime proof (DEC-0038)

- `runtime_proof_id=rp-auto-20260913-us0135-research-techlead-20260913T035500Z-US-0135`
- `proof_hash=7100DE085C9DE36C44C9311B26E27B01492E7B3AD501A4EE4454D609811DE620`
- `proof_ttl=2026-09-13T04:55:00Z`
- Hash via `from scripts.token_cost_lib import compute_strict_proof_hash` (positional; compact sorted-key JSON).
- Canonical hashed payload: `{"orchestrator_run_id":"auto-20260913-us0135","phase_id":"research","proof_issued_at":"2026-09-13T03:55:00Z","proof_ttl_seconds":3600,"role":"tech-lead","runtime_proof_id":"rp-auto-20260913-us0135-research-techlead-20260913T035500Z-US-0135"}`
- Isolation extras (not hashed): `delivery_mode=ultra_lean`, `macro_phase=plan`, `model_id=cursor-grok-4.6-high`, `sprint_id=none`, `story_id=US-0135`
- `hash_recompute_confirmation=true` (compute_strict_proof_hash → 7100DE085C9DE36C44C9311B26E27B01492E7B3AD501A4EE4454D609811DE620)
- Consumed discovery proof: `rp-auto-20260913-us0135-discovery-po-20260913T033500Z-US-0135` / `AEA63BCA1D98E9DF0C7D28E4035C0B72C569147799059E2958120462D6FDB0E8` — RUNTIME_PROOF_VALID (MATCH before TTL `2026-09-13T04:35:00Z`; consumed_at `2026-09-13T03:55:00Z`; independent recompute MATCH)

### Isolation + stop

- `phase_id=research`, `role=tech-lead`, `story_id=US-0135`, `model_id=cursor-grok-4.6-high`, `fresh_context_marker=tl-US0135-research-20260913T035500Z-fresh`
- `evidence_ref=docs/engineering/research.md ## R-0127; docs/product/backlog.md ## US-0135 research_notes; docs/engineering/state.md research checkpoint; docs/engineering/decisions.md ## DEC-0135 Required stub; handoffs/resume_brief.md`
- **Hot-surface note**: Appended (not prepended) so triad oldest-prefix rollover retains this newest section. Post-append `--check` → STATE_ARCHIVE_REQUIRED `po_to_tl` 667/650 → `--rollover` `rollover_complete units=1` pack `handoffs/archive/po-to-tl-pack-20260913-a.md` (archived US-0133 discovery). Final `--check` PASS (`po_to_tl` 606/650; `state` 1200/1200).
- **Status**: US-0135 remains **OPEN**. **Next**: `/architecture` in fresh **tech-lead** subagent. Do not spawn architecture from this research chat. STOP.

