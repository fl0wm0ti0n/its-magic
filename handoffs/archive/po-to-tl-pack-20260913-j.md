# PO to TL archive pack (2026-09-13)

- Rollover trigger: `PO_TO_TL_HOT_MAX_LINES=650, PO_TO_TL_HOT_MAX_SECTIONS=60`
- Source: `handoffs/po_to_tl.md`
- Archived units (oldest first, contiguous prefix): 2
- Retained units in hot file: 12
- First archived heading: `## Architecture handoff — BUG-0020 OpenCode still has no invokable auto mode after BUG-0019 TUI keymap`
- Last archived heading: `## Discovery handoff — US-0135 Standalone authentication and model routing`
- Verification tuple (mandatory):
  - archived_body_lines=91
  - retained_body_lines=592

---

## Architecture handoff — BUG-0020 OpenCode still has no invokable auto mode after BUG-0019 TUI keymap

- **Phase completed**: architecture. **Role**: tech-lead. **Bug**: BUG-0020 only. **Sprint**: (pending — materialize at `/sprint-plan`). **Verdict**: PASS (`decision_gate=false`).
- **Timestamp (UTC)**: 2026-09-12T23:25:00Z. **Fresh marker**: `tl-BUG0020-architecture-20260912T232500Z-fresh`.
- **Orchestrator**: `orchestrator_run_id=auto-20260913-bug0020`, parent=`cursor-20260913-BUG0020-intake`, `delivery_mode=ultra_lean`, macro=`plan` (architecture = second of research+architecture+sprint-plan), `model_id=cursor-grok-4.6`, CROSS_MODEL_REVIEW=1, AUTO_QUIET=1.
- **Architecture anchor**: `docs/engineering/architecture.md` **`# BUG-0020`**. Research **`R-0126`** (DQ1–DQ8 unchanged). Discovery D1–D10 unchanged. **No R-0127**.
- **Approach**: **E2** LOCKED — honest host-cannot-do-both on desktop Command.Info (cannot list execute-only `/auto` without stealing execute). Keep `editor.add` → `runAutoLifecycle` (0018 A*). **C-limb**: CLI TUI `/auto` via shipping `.opencode/tui.json` listing `./plugins/its-magic-auto/tui.ts` so existing `tui.ts` keymap loads (DQ8 internal spec). **Desktop-visible** `OPENCODE_AUTO_DESKTOP_COMMAND_INFO_LISTING_UNSUPPORTED` (not TUI-toast-only; not `OPENCODE_AUTO_SLASH_LISTING_UNSUPPORTED`; not `OPENCODE_AUTO_MARKDOWN_COLLISION`). 8 `test_bug0020_*` contract tests. Upgrade copy-if-absent / JSONC-merge `tui.json` + still prune leftover `auto.md`. Additive `# BUG-0020` supersedes R-0124 E* picker claim (historical `# BUG-0019` / `# BUG-0018` bodies UNCHANGED). **No companion DEC.**
- **Rejected**: Axis A (`tui.json` as desktop listing); Axis B (no execute-only desktop API); Axis C as sole winner; Axis D (JSON/md 0018-class); companion DEC; token-only with no working start.
- **Task seeds**: T-anch + T-001..T-007 (8; under `SPRINT_MAX_TASKS=12`) — refine 1:1 into next free sprint id at `/sprint-plan`.
- **Sibling boundary**: BUG-0019/0018/0017/0015/0016 DONE — out of scope; do not reopen. Do not mutate US-0133..US-0148; do not drain US-0135. Do not restore STOP-only `auto.md`. Do not prune/touch `.cursor/commands/auto.md` or `.opencode/agents/auto.md`. Do not rewrite DEC-0124/DEC-0125. Do not spawn `/sprint-plan` from this architecture chat.

### Runtime proof (DEC-0038)

- `runtime_proof_id=rp-auto-20260913-bug0020-architecture-techlead-20260912T232500Z-BUG-0020`
- `proof_hash=92D10D4743D65A2F7AF276A45749FB57DFA15593254213488026D10171C2EC87`
- `proof_ttl=2026-09-13T00:25:00Z`
- Hash via `scripts.token_cost_lib.compute_strict_proof_hash` (compact sorted-key JSON).
- Canonical hashed payload: `{"orchestrator_run_id":"auto-20260913-bug0020","phase_id":"architecture","proof_issued_at":"2026-09-12T23:25:00Z","proof_ttl_seconds":3600,"role":"tech-lead","runtime_proof_id":"rp-auto-20260913-bug0020-architecture-techlead-20260912T232500Z-BUG-0020"}`
- Isolation extras (not hashed): `delivery_mode=ultra_lean`, `macro_phase=plan`, `model_id=cursor-grok-4.6`, `sprint_id=none`, `story_id=BUG-0020`
- Consumed research proof: `rp-auto-20260913-bug0020-research-techlead-20260912T225800Z-BUG-0020` / `CD22980C635030A79DAC0705CFA0DEF87C64CF10A3279DEC46E97BCBE7C74CC8` — RUNTIME_PROOF_VALID (MATCH before TTL `2026-09-12T23:58:00Z`)

### Isolation + stop

- `phase_id=architecture`, `role=tech-lead`, `bug_id=BUG-0020`, `fresh_context_marker=tl-BUG0020-architecture-20260912T232500Z-fresh`, `model_id=cursor-grok-4.6`
- `evidence_ref=docs/engineering/architecture.md # BUG-0020; docs/product/backlog.md ### BUG-0020 architecture_notes; docs/engineering/decisions.md compact index (no companion DEC); docs/engineering/state.md architecture checkpoint; .opencode/plugins/orchestrator.ts attach; .opencode/plugins/its-magic-auto/{index.ts,tui.ts}; absent .opencode/commands/auto.md; tests/bug0018_* / tests/bug0019_*`
- **Hot-surface note**: Appended newest; `--rollover` units=1,1,2 packs `state-pack-20260912-br.md` / `po-to-tl-pack-20260912-l.md` / `architecture-pack-20260912-b.md`; heading policy PASS (`baseline_h2_count=0`); final `--check` PASS.
- **Status**: BUG-0020 remains **OPEN**. **Next**: `/sprint-plan` in fresh **tech-lead** subagent (orchestrator may insert sovereign-critic of architecture first). Do not spawn sprint-plan from this architecture chat. STOP.

## Discovery handoff — US-0135 Standalone authentication and model routing

- **Phase completed**: discovery. **Role**: po. **Story**: US-0135 only. **Sprint**: (pending). **Verdict**: PASS (`decision_gate=false`).
- **Timestamp (UTC)**: 2026-09-13T03:35:00Z. **Fresh marker**: `po-US0135-discovery-20260913T033500Z-fresh`.
- **Orchestrator**: `orchestrator_run_id=auto-20260913-us0135`, parent=`auto-20260913-bug0020`, `delivery_mode=ultra_lean`, macro=`spec` (intake already DONE — not re-intaken), `model_id=cursor-grok-4.6-high`, CROSS_MODEL_REVIEW=1, AUTO_QUIET=1, EARLY_RESEARCH=1.
- **Sibling boundary**: **US-0136..US-0148** OPEN — OUT OF SCOPE this segment. **US-0133** / **US-0134** DONE — compose only; do not reopen. **BUG-0020** DONE — do not reopen.
- **Gap confirmed (narrow-read)**: AgentKernel (DEC-0133) injects `model` / `modelRuntime` with a **fake-model CI default** and hardcodes `thinkingLevel: "off"`. KernelBridge (DEC-0134) locates kit validators only. No `standalone/packages/auth-models`, no owned credential store, no `itsm auth` / `itsm models` commands, no 6-step Pi slug resolver, no critic pin on standalone.

### Discovery locks D1–D10

| ID | Lock |
|----|------|
| **D1** | Stable-release credentials live in an **owned store outside project files** (AC-1). Spike may reuse Pi default `~/.pi/agent/auth.json` only as non-DONE scaffolding. Ship path: `ModelRuntime.create({ authPath })` (or equivalent CredentialStore) under a standalone-owned location, mode 0600-class. Never copy OAuth/API tokens into the repo, agent prompts, or `.env`. CLI: `itsm auth list`, `itsm auth login <provider>`, `itsm auth set <provider>`. |
| **D2** | Provider categories via Pi adapters behind owned `ModelRouter` (AC-2 / §12.1): ChatGPT Plus/Pro **Codex OAuth** (`openai-codex`); API-key providers (OpenAI, Anthropic, Google, OpenRouter, …); Chinese (DeepSeek, Moonshot/Kimi, Z.AI/GLM, MiniMax, DashScope/Qwen); local OpenAI-compatible (LM Studio / Ollama / vLLM); custom corporate gateways. Exact v1 built-in vs `models.json` vs `registerProvider` inventory → DQ2/DQ3. Selecting a preferred vendor or proxying all traffic is **out**. |
| **D3** | Model resolution precedence **CLI > phase-local > role catalog > critic override > tier/catalog > runtime default** with observable provenance (AC-3 / §12.3). Port US-0101/0102 / DEC-0087 kit 5-step semantics to **actual Pi `provider/model` slugs**. Cursor aliases (`fast`/`inherit`) are not standalone runtime. Compose US-0132 catalogs as mapping input only. |
| **D4** | Thinking level is an independent axis from slug and `TOKEN_PROFILE` (AC-4 / §12.4). Pi levels `off|minimal|low|medium|high|xhigh|max`. AgentKernel today hardcodes `"off"` — this story must inject per-role/phase thinking without coupling to token profile. |
| **D5** | Critic pin honored; producer/critic **same slug** → `degraded_mode=true` / **`CROSS_MODEL_DEGRADED_MODE`** (AC-5 / §12.5 / §22.4). Never claim false cross-model independence. Compose US-0130 / US-0104; do not reopen. Not a hard stop; not auto-next-slug. |
| **D6** | Operator UX (AC-6 / §12.2 / Phase 5): `itsm auth`, `itsm models list`, `itsm models test <provider/model>` emit actionable health diagnostics **without logging tokens**. Cost/usage dashboards stay US-0146 unless research proves a thin collector is required for `models test`. |
| **D7** | Secret safety (AC-7 / §26.4 / §35 Provider/auth): two roles can use different providers in one run; OAuth refresh never exposes a token to model context, repo artifacts, or audit payloads. Never read `.env`. Redact Authorization/Cookie. |
| **D8** | Package boundary: new `standalone/packages/auth-models` (masterplan §30). CLI/workflow import AuthService/ModelRouter only — **no Pi imports outside `packages/pi-kernel`** (R1 / DEC-0133). Kernel continues to accept injected `model`/`modelRuntime`; **fake-model remains CI default** (DEC-0133 §6). Do not amend isolation loader, `noTools`, or KernelBridge. |
| **D9** | Out of scope: US-0136 SessionSupervisor/attestation; US-0137 ToolBroker/PolicyEngine/`.env` deny; US-0138 full typed RuntimeConfig (thin catalog JSON allowed here); US-0140 lifecycle; US-0144 critic session spawn (this story owns routing/pin/degraded flag only); US-0146 TUI/observability polish; Cursor/OpenCode host routing (US-0123/US-0132 remain those hosts). US-0133/US-0134/BUG-0020 not reopened. |
| **D10** | Research questions DQ1–DQ10 → `/research` authors **R-0127** (next after R-0126; compose R-0121/R-0122/DEC-0133/DEC-0134; do not wipe R-0120..R-0126). Companion **DEC-0135** + `# US-0135` at `/architecture` only — PO does not author them. |

### Research questions DQ1–DQ10 (for `/research` → expect **R-0127**)

1. **DQ1**: Owned credential path — OS locations (XDG / `%APPDATA%` / `ModelRuntime.create({ authPath, modelsPath })`); 0600; migration from Pi default `~/.pi/agent/auth.json`; `InMemoryCredentialStore` for tests.
2. **DQ2**: Codex OAuth programmatic login on pin `@earendil-works/pi-coding-agent@0.85.1` — `modelRuntime.login("openai-codex")` vs interactive `/login`; device/browser CLI UX; `CredentialSynchronizationError` handling.
3. **DQ3**: Provider matrix at 0.85.1 — which §12.1 ids are built-in vs `models.json` (`openai-completions`) vs `registerProvider` extension. Minimum set that satisfies AC-2 without loading project Pi extensions (DEC-0133 empty loader).
4. **DQ4**: Custom/Chinese/local/corporate gateways — `models.json` vs extension; conflict with empty `DefaultResourceLoader`; how corporate OAuth/SSO registers without project `.pi/extensions`.
5. **DQ5**: ModelRouter TypeScript surface + provenance fields; map DEC-0087 5-step kit chain onto 6-step masterplan (where CLI argv and critic overlay sit); fail-closed unknown slug codes.
6. **DQ6**: Standalone catalog format vs migrate `.cursor/model-catalog.local.json`; US-0138 boundary so this story does not implement full `RuntimeConfig`.
7. **DQ7**: Thinking-level wiring — `createAgentSession({ thinkingLevel })` vs per-prompt; `thinkingLevelMap` holes; orthogonality to `TOKEN_PROFILE`.
8. **DQ8**: Critic pin analogue of `MODEL_SOVEREIGN-CRITIC` / `roles.critic` on standalone; reuse `CROSS_MODEL_DEGRADED_MODE` vs new `AUTH_*`/`MODEL_*` codes.
9. **DQ9**: `itsm models test` — `checkAuth` vs live paid completion; CI no credentials / fake-model; Windows+Linux `test_us0135_*` inventory; two-role different-provider fixture without paid calls.
10. **DQ10**: OAuth refresh isolation — prove tokens never enter session prompt, audit, logs, or repo; redaction; compose DEC-0133 fake-model so CI never needs live secrets.

### Design refs

- `docs/product/standalone-its-magic-pi-masterplan.md` sections 12, 22.1/22.4, 26.4, 32 Phase 5, 35 Provider/auth
- Pi: https://pi.dev/docs/latest/providers ; https://pi.dev/docs/latest/models ; https://pi.dev/docs/latest/sdk ; https://pi.dev/docs/latest/custom-provider ; https://github.com/earendil-works/pi
- Compose: `decisions/DEC-0133.md`, `decisions/DEC-0134.md`, `docs/engineering/research.md` R-0121 / R-0122 (do not wipe)
- Compose: US-0101/0102/DEC-0087; US-0130/US-0104 `CROSS_MODEL_DEGRADED_MODE`
- Intake (read-only): `handoffs/intake_evidence/US-0133-0148-intake-20260911.json` (`auth-model-runtime` → US-0135)

### Runtime proof (DEC-0038)

- `runtime_proof_id=rp-auto-20260913-us0135-discovery-po-20260913T033500Z-US-0135`
- `proof_hash=AEA63BCA1D98E9DF0C7D28E4035C0B72C569147799059E2958120462D6FDB0E8`
- `proof_ttl=2026-09-13T04:35:00Z`
- Hash via `from scripts.token_cost_lib import compute_strict_proof_hash` (positional; compact sorted-key JSON).
- Canonical hashed payload: `{"orchestrator_run_id":"auto-20260913-us0135","phase_id":"discovery","proof_issued_at":"2026-09-13T03:35:00Z","proof_ttl_seconds":3600,"role":"po","runtime_proof_id":"rp-auto-20260913-us0135-discovery-po-20260913T033500Z-US-0135"}`
- Isolation extras (not hashed): `delivery_mode=ultra_lean`, `macro_phase=spec`, `model_id=cursor-grok-4.6-high`, `sprint_id=none`, `story_id=US-0135`
- `hash_recompute_confirmation=true` (compute_strict_proof_hash → AEA63BCA1D98E9DF0C7D28E4035C0B72C569147799059E2958120462D6FDB0E8)

### Isolation + stop

- `phase_id=discovery`, `role=po`, `story_id=US-0135`, `model_id=cursor-grok-4.6-high`, `fresh_context_marker=po-US0135-discovery-20260913T033500Z-fresh`
- `evidence_ref=docs/product/backlog.md ## US-0135 discovery_notes; docs/product/acceptance.md US-0135 row (unchecked); docs/product/vision.md ## Discovery Notes — US-0135; handoffs/intake_evidence/US-0133-0148-intake-20260911.json; docs/engineering/state.md discovery checkpoint; handoffs/resume_brief.md`
- **Hot-surface note**: Appended (not prepended) so triad oldest-prefix rollover retains this newest section. Post-append `--check` → STATE_ARCHIVE_REQUIRED `state` 1216/1200 + `po_to_tl` 707/650 → `--rollover` `rollover_complete units=1,2` packs `docs/engineering/state-archive/state-pack-20260913-m.md` (archived verify-work critic BUG-0020) and `handoffs/archive/po-to-tl-pack-20260913.md` (archived BUG-0018 discovery+research). Final `--check` PASS.
- **Status**: US-0135 remains **OPEN**. **Next**: `/research` in fresh **tech-lead** subagent. Do not spawn research from this discovery chat. STOP.

---

