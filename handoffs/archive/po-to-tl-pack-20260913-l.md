# PO to TL archive pack (2026-09-13)

- Rollover trigger: `PO_TO_TL_HOT_MAX_LINES=650, PO_TO_TL_HOT_MAX_SECTIONS=60`
- Source: `handoffs/po_to_tl.md`
- Archived units (oldest first, contiguous prefix): 2
- Retained units in hot file: 13
- First archived heading: `## Architecture handoff — US-0135 Standalone authentication and model routing`
- Last archived heading: `## Discovery handoff — US-0136 Fresh role sessions and runtime attestation`
- Verification tuple (mandatory):
  - archived_body_lines=106
  - retained_body_lines=602

---

## Architecture handoff — US-0135 Standalone authentication and model routing

- **Phase completed**: architecture. **Role**: tech-lead. **Story**: US-0135 only. **Sprint**: (pending `/sprint-plan`). **Verdict**: PASS (`decision_gate=false`).
- **Timestamp (UTC)**: 2026-09-13T04:15:00Z. **Fresh marker**: `tl-US0135-architecture-20260913T041500Z-fresh`.
- **Orchestrator**: `orchestrator_run_id=auto-20260913-us0135`, parent=`auto-20260913-bug0020`, `delivery_mode=ultra_lean`, macro=`plan` (architecture = second of research+architecture+sprint-plan), `model_id=cursor-grok-4.6-high`, CROSS_MODEL_REVIEW=1, AUTO_QUIET=1, EARLY_RESEARCH=1 (Pi docs confirm; **no new R-id**).
- **Sibling boundary**: **US-0136..US-0148** OPEN — OUT OF SCOPE this segment. **US-0133** / **US-0134** DONE — compose only; do not reopen. **BUG-0020** DONE — do not reopen.
- **Architecture anchor**: `docs/engineering/architecture.md` **`# US-0135`**. Companion **`decisions/DEC-0135.md` Accepted**. Research **`## R-0127`** intact. DEC-0133/0134 bodies not rewritten.
- **Approach**: **A1 LOCKED**. Reject A2 (`~/.pi/agent` ship store), A3 (project/`.env`), A4 (workflow Pi imports), A5 (no `auth-models` package), A6 (project `.pi/extensions`), A7 (paid CI), A8 (Cursor catalog as runtime), A9 (auto-next-slug).
- **Locks**: owned OS credential dir (XDG / `%APPDATA%` / macOS Application Support `its-magic/`; 0600-class); `standalone/packages/auth-models` (no Pi) + pi-kernel AuthRuntimeAdapter; 6-step ModelRouter + provenance; thinking clamp+provenance (not fail-closed); critic pin + `CROSS_MODEL_DEGRADED_MODE`; `itsm auth` / `models list` / `models test` (`checkAuth` default; `--live` never CI); fake-model CI / empty loader / `noTools` / KernelBridge **held**. 10 `test_us0135_*`. Seeds T-anch + T-001..T-009 (10 ≤ SPRINT_MAX_TASKS=12).
- **baseline_h2_count (pre-mutate)**: `0`. Heading policy: H1 `# US-0135` (DEC-0076).

### Sprint-plan seeds

- T-anch (`# US-0135` + DEC-0135 — RESOLVED this phase)
- T-001 `packages/auth-models` + Pi import-boundary grep
- T-002 owned auth path + InMemory + 0600
- T-003 pi-kernel AuthRuntimeAdapter (`login`/`checkAuth`/`authPath`; do not amend isolation/`noTools`/KernelBridge)
- T-004 provider matrix + owned `models.json`
- T-005 ModelRouter 6-step + provenance
- T-006 thinkingLevel inject
- T-007 critic pin + `CROSS_MODEL_DEGRADED_MODE`
- T-008 `itsm auth` / `models list` / `models test`
- T-009 `test_us0135_*` Win+Linux fake-model CI

### Runtime proof (DEC-0038)

- `runtime_proof_id=rp-auto-20260913-us0135-architecture-techlead-20260913T041500Z-US-0135`
- `proof_hash=44CCE2BBAB0F863D610152D108DF62D1DACA1F722D2F12CF4DB98067DF1923D7`
- `proof_ttl=2026-09-13T05:15:00Z`
- Hash via `from scripts.token_cost_lib import compute_strict_proof_hash` (positional; compact sorted-key JSON).
- Canonical hashed payload: `{"orchestrator_run_id":"auto-20260913-us0135","phase_id":"architecture","proof_issued_at":"2026-09-13T04:15:00Z","proof_ttl_seconds":3600,"role":"tech-lead","runtime_proof_id":"rp-auto-20260913-us0135-architecture-techlead-20260913T041500Z-US-0135"}`
- Isolation extras (not hashed): `delivery_mode=ultra_lean`, `macro_phase=plan`, `model_id=cursor-grok-4.6-high`, `sprint_id=none`, `story_id=US-0135`
- `hash_recompute_confirmation=true` (compute_strict_proof_hash → 44CCE2BBAB0F863D610152D108DF62D1DACA1F722D2F12CF4DB98067DF1923D7)
- Consumed research proof: `rp-auto-20260913-us0135-research-techlead-20260913T035500Z-US-0135` / `7100DE085C9DE36C44C9311B26E27B01492E7B3AD501A4EE4454D609811DE620` — RUNTIME_PROOF_VALID (independent MATCH; critic consume-before-TTL `2026-09-13T04:05:00Z` < `2026-09-13T04:55:00Z`; immutable R-0127; consumed_at `2026-09-13T04:15:00Z`)
- Consumed critic of research: `rp-auto-20260913-us0135-sovereign-critic-techlead-20260913T040500Z-US-0135` / `11A3BE95EEF97C5FFDCF288FEB24CF58D5935B85F86E2628B152A68FE23A1B8D` — MATCH; 0 blocking; anti_slop=10; degraded_mode=false; findings `us0135rsc-*`

### Isolation + stop

- `phase_id=architecture`, `role=tech-lead`, `story_id=US-0135`, `model_id=cursor-grok-4.6-high`, `fresh_context_marker=tl-US0135-architecture-20260913T041500Z-fresh`
- `evidence_ref=docs/engineering/architecture.md # US-0135; decisions/DEC-0135.md; docs/engineering/research.md ## R-0127; docs/product/backlog.md ## US-0135 architecture_notes; docs/engineering/state.md architecture checkpoint; docs/engineering/decisions.md ## DEC-0135 Accepted; handoffs/resume_brief.md`
- **Status**: US-0135 remains **OPEN**. **Next**: `/sprint-plan` in fresh **tech-lead** subagent. Do not spawn sprint-plan from this architecture chat. STOP.

---

## Discovery handoff — US-0136 Fresh role sessions and runtime attestation

- **Phase completed**: discovery. **Role**: po. **Story**: US-0136 only. **Sprint**: (pending). **Verdict**: PASS (`decision_gate=false`).
- **Timestamp (UTC)**: 2026-09-13T06:55:00Z. **Fresh marker**: `po-US0136-discovery-20260913T065500Z-fresh`.
- **Orchestrator**: `orchestrator_run_id=auto-20260913-us0136`, parent=`auto-20260913-us0135`, `delivery_mode=ultra_lean`, macro=`spec` (intake already DONE — not re-intaken), `model_id=cursor-grok-4.6-high`, CROSS_MODEL_REVIEW=1, AUTO_QUIET=1, EARLY_RESEARCH=1.
- **Sibling boundary**: **US-0137..US-0148** OPEN — OUT OF SCOPE this segment. **US-0133** / **US-0134** / **US-0135** DONE — compose only; do not reopen. **BUG-0020** DONE — do not reopen.
- **Gap confirmed (narrow-read)**: AgentKernel (DEC-0133) can `createSession` with stable `sessionId`/`dispose` and fake-model CI. Auth-models (DEC-0135) resolve `model_id`/thinking. No `standalone/packages/role-runtime`, no SessionSupervisor, no typed RoleCatalog, no spawn/start/end sidecar attestation bound to Pi session IDs, no orchestrator mutation deny on standalone.

### Discovery locks D1–D10

| ID | Lock |
|----|------|
| **D1** | `SessionSupervisor` creates a fresh Pi session via owned `AgentKernel.createSession` for every producer phase, review/critic phase, and execute/QA rework iteration (AC-1 / R3 / §9.1). Exception: an **explicitly versioned same-phase continuation** contract only (in-session `steer`/`followUp`; inventory → DQ2). Crash recovery always fresh (§27.3). Pi `continueRecent`/`fork` default-deny across phase boundaries. |
| **D2** | Typed `RoleCatalog` enforces canonical phase→role mapping, permitted alternates, role objectives, artifact ownership, and bounded sovereign role-manifest injection (AC-2 / §10 / §14.2). Port **DEC-0051** / **US-0069** matrix + `AUTO_ROLE_*` single-valued resolution (no unrelated fallback). Compose **US-0003** role semantics and **US-0106** bounded `objective_function` / review-focus injection — not the full permission matrix (that is code / US-0137). Role prompts stay short (§10.2). |
| **D3** | Runtime (not the model) emits spawn/start/end attestations bound to `orchestrator_run_id`, `phase_id`, `role_id`, `kernel=pi`, `kernel_session_id`, `kernel_process_instance`, `model_id`, `context_pack_hash`, `policy_hash`, timestamps, `parent_phase_session_id`, and `fresh` (AC-3 / §9.2). Consume DEC-0135 ModelRouter provenance for `model_id`. |
| **D4** | US-0048 / US-0056 required fields remain populated exactly; standalone attestation is **sidecar** so legacy Python validators are not broken (AC-4). DEC-0038 envelope (`runtime_proof_id` / `proof_hash` / TTL) stays the kit gate; sidecar adds kernel session facts. |
| **D5** | Fail closed on reused session IDs across a phase boundary, role mismatch, prior-role transcript carry-over, missing/stale proof, hash mismatch, or orchestrator phase mutation (AC-5 / §9.3). Deterministic reason codes (inventory → DQ6). Compose `PHASE_ROLE_MISMATCH`, `RUNTIME_PROOF_*`, `PHASE_CONTEXT_ISOLATION_*`, `AUTO_ORCHESTRATOR_PHASE_EXECUTION`. |
| **D6** | Orchestrator has scheduling capabilities only: no project source-write, no unrestricted-shell (AC-6 / R4). Prefer a TypeScript scheduler (not an implementing Pi session). If an orchestrator-role Pi session exists, it must not receive mutation tools. Full PolicyEngine remains US-0137; this story still fail-closes orchestrator mutation capability at spawn. |
| **D7** | Isolation tests cover PO vs DEV distinct session IDs, each execute/QA cycle, critic sessions, crash recovery (orphan discard), and session disposal (AC-7 / §35 Isolation). Fake-model CI. Windows + Linux `test_us0136_*`. |
| **D8** | Package boundary: new `standalone/packages/role-runtime` (masterplan §30) hosts RoleCatalog + SessionSupervisor + attestation emitter. **No Pi imports** outside `packages/pi-kernel` (R1 / DEC-0133). Supervisor calls `AgentKernel.createSession` only. Do not amend isolation loader, `noTools`, KernelBridge, or auth-models. Fake-model remains CI default. |
| **D9** | Out of scope: US-0137 ToolBroker/PolicyEngine/`.env` deny; US-0138 full typed RuntimeConfig (thin RoleCatalog JSON allowed); US-0139 context engine; US-0140 lifecycle sequencing (later consumer of SessionSupervisor); US-0143 drain/autonomy; US-0144 critic lens/memory/convergence content (this story owns fresh critic *sessions*); US-0146 TUI; US-0141 OS/microVM sandbox; Cursor/OpenCode host isolation (US-0048 remains those hosts). US-0133/US-0134/US-0135/BUG-0020 not reopened. US-0137+ not mutated. |
| **D10** | Research questions DQ1–DQ10 → `/research` authors **R-0128** (next after R-0127; compose R-0127/DEC-0135/US-0135 + R-0121/R-0122/DEC-0133/DEC-0134; do not wipe R-0120..R-0127). Companion **DEC-0136** + `# US-0136` at `/architecture` only — PO does not author them. |

### Research questions DQ1–DQ10 (for `/research` → expect **R-0128**)

1. **DQ1**: SessionSupervisor TypeScript surface + `packages/role-runtime` vs fold into `runtime-core`; wrap `AgentKernel.createSession` without Pi imports; `SessionManager.inMemory` vs persisted files; compose DEC-0133 `agentDir` isolation.
2. **DQ2**: Versioned continuation allow-list — same-phase `steer`/`followUp` yes; execute#N / QA#N rework no; crash no; Pi `continueRecent`/`fork`/`newSession({ parentSession })` default-deny across phases; how the contract is versioned and fail-closed.
3. **DQ3**: RoleCatalog schema — port DEC-0051 matrix + `AUTO_ROLE_*`; §10.1 roles including orchestrator/critic/scout; artifact ownership; US-0106 bounded manifest injection; fail-closed unknown phase/role codes.
4. **DQ4**: Attestation spawn/start/end schema + hash — `kernel_session_id` from `session.sessionId`; `kernel_process_instance` for in-process Node; `context_pack_hash` stub before US-0139; `policy_hash` stub before US-0137 (RoleCatalog + tool-allowlist snapshot); compose vs extend `compute_strict_proof_hash`.
5. **DQ5**: Sidecar persistence — SQLite operational vs repo artifacts; keep US-0048 fields + DEC-0038 envelope byte-compatible; Python validators ignore unknown sidecar keys.
6. **DQ6**: Fail-closed reason-code inventory — reuse vs new `SESSION_*` / `ATTESTATION_*`; transcript carry-over detector (no prior-role messages in context pack); orchestrator mutation detect before ToolBroker.
7. **DQ7**: Orchestrator as pure TypeScript scheduler vs read-only Pi session; proving no source-write/unrestricted-shell at spawn without PolicyEngine; compose `itsm_ping`-only vs zero custom tools.
8. **DQ8**: Critic/review sessions — SessionSupervisor spawn for sovereign-critic and role-behavior reviews as fresh sessions; `parent_phase_session_id`; US-0144 content boundary; compose US-0104 isolation `model_id` v2 + DEC-0135 critic pin.
9. **DQ9**: Crash recovery + dispose — discard orphaned Pi sessions; detect claimed-complete vs crashed; no inherited old-role conversation; US-0140 owns next-phase reconstruction.
10. **DQ10**: `test_us0136_*` Win+Linux fake-model inventory — PO≠DEV session IDs; execute/QA cycle new IDs; critic distinct; crash discard; dispose; reused ID; role mismatch; transcript carry-over; missing/stale proof; hash mismatch; orchestrator mutation deny.

### Design refs

- `docs/product/standalone-its-magic-pi-masterplan.md` sections 9, 10, 14.2, 22.1/22.3, 27.3, 30 `role-runtime`, 32 Phase 1, 35 Isolation, R3/R4/R5, §41.4, §42 session-id Q
- Pi: https://pi.dev/docs/latest/sdk ; https://pi.dev/docs/latest/session-format ; https://github.com/earendil-works/pi/blob/main/packages/coding-agent/src/core/agent-session.ts
- EARLY_RESEARCH analogs (DQ seeds, not adopted): https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/runtime-sessions.html ; https://agentproto.sh/docs/aip-46 (spawn gate; role ≠ permission); https://h33.ai/use-cases/replayable-ai-execution/ ; https://cmcp.agentrust-io.com/spec/attestation/
- Compose: `decisions/DEC-0135.md`, `decisions/DEC-0133.md`, `decisions/DEC-0134.md`, `docs/engineering/research.md` R-0127 / R-0121 / R-0122 (do not wipe)
- Compose: US-0048/DEC-0029; US-0056/DEC-0038; US-0069/DEC-0051; US-0023; US-0003; US-0106; US-0104
- Intake (read-only): `handoffs/intake_evidence/US-0133-0148-intake-20260911.json` (`session-isolation-attestation` + `role-runtime` → US-0136)

### Runtime proof (DEC-0038)

- `runtime_proof_id=rp-auto-20260913-us0136-discovery-po-20260913T065500Z-US-0136`
- `proof_hash=335B7AFFF3EAEEBCE096684A91D7B1F273962BC1A6E1F0F4A1EA7DB47F7263DE`
- `proof_ttl=2026-09-13T07:55:00Z`
- Hash via `from scripts.token_cost_lib import compute_strict_proof_hash` (positional; compact sorted-key JSON).
- Canonical hashed payload: `{"orchestrator_run_id":"auto-20260913-us0136","phase_id":"discovery","proof_issued_at":"2026-09-13T06:55:00Z","proof_ttl_seconds":3600,"role":"po","runtime_proof_id":"rp-auto-20260913-us0136-discovery-po-20260913T065500Z-US-0136"}`
- Isolation extras (not hashed): `delivery_mode=ultra_lean`, `macro_phase=spec`, `model_id=cursor-grok-4.6-high`, `sprint_id=none`, `story_id=US-0136`
- `hash_recompute_confirmation=true` (compute_strict_proof_hash → 335B7AFFF3EAEEBCE096684A91D7B1F273962BC1A6E1F0F4A1EA7DB47F7263DE)

### Isolation + stop

- `phase_id=discovery`, `role=po`, `story_id=US-0136`, `model_id=cursor-grok-4.6-high`, `fresh_context_marker=po-US0136-discovery-20260913T065500Z-fresh`
- `evidence_ref=docs/product/backlog.md ## US-0136 discovery_notes; docs/product/acceptance.md US-0136 row (unchecked); docs/product/vision.md ## Discovery Notes — US-0136; handoffs/intake_evidence/US-0133-0148-intake-20260911.json; docs/engineering/state.md discovery checkpoint; handoffs/resume_brief.md`
- **Hot-surface note**: Appended (not prepended) so triad oldest-prefix rollover retains this newest section. Post-append `--check` → STATE_ARCHIVE_REQUIRED `state` 1273/1200 + `po_to_tl` 713/650 → `--rollover` `rollover_complete units=2,2` packs `docs/engineering/state-archive/state-pack-20260913-ae.md` (archived US-0135 sprint-plan + critic) and `handoffs/archive/po-to-tl-pack-20260913-b.md` (archived US-0133 research+architecture). Final `--check` PASS.
- **Status**: US-0136 remains **OPEN**. **Next**: `/research` in fresh **tech-lead** subagent. Do not spawn research from this discovery chat. STOP.

