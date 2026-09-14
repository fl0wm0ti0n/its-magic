# PO to TL archive pack (2026-09-12)

- Rollover trigger: `PO_TO_TL_HOT_MAX_LINES=650, PO_TO_TL_HOT_MAX_SECTIONS=60`
- Source: `handoffs/po_to_tl.md`
- Archived units (oldest first, contiguous prefix): 2
- Retained units in hot file: 15
- First archived heading: `## Architecture handoff — BUG-0017 OpenCode Linux slash commands (CRLF YAML frontmatter)`
- Last archived heading: `## Intake handoff — US-0133..US-0148 standalone its-magic agent`
- Verification tuple (mandatory):
  - archived_body_lines=88
  - retained_body_lines=601

---

## Architecture handoff — BUG-0017 OpenCode Linux slash commands (CRLF YAML frontmatter)

- **Phase completed**: architecture. **Role**: tech-lead. **Bug**: BUG-0017 only. **Sprint**: (pending). **Verdict**: PASS (`decision_gate=false`).
- **Timestamp (UTC)**: 2026-09-11T19:20:00Z. **Fresh marker**: `tl-BUG0017-architecture-20260911T191500Z-fresh`.
- **Orchestrator**: `orchestrator_run_id=auto-20260911-bug0017`, `delivery_mode=ultra_lean`, macro=`plan`, `model_id=composer-2.5`, CROSS_MODEL_REVIEW=1.
- **Architecture anchor**: `docs/engineering/architecture.md` **`# BUG-0017`**
- **Research anchor**: `docs/engineering/research.md` **`## R-0118`** (DQ1–DQ6 LOCKED)
- **Companion DEC**: **none** (cite R-0118; compose BUG-0008 / US-0084 / DEC-0120)

### Approach A* LOCKED

Scoped `.gitattributes` LF for `.opencode/**` + `template/.opencode/**` `*.{md,ts,json}` + one-time scoped renormalize + extend `guard_installer_publish.py` OpenCode `\r` inventory + 6 `test_bug0017_*` + DQ6 runbook upgrade recipe. Reuse `npm run guard:installer` / `prepublishOnly`. No install EOL rewrite. No repo-wide `*.md eol=lf`. No host parser patch. Critic NBs closed: choco tag→guard before zip (T-007); dirty-tree scoped renormalize (T-002); consumer upgrade recipe (T-006). Seeds **T-anch + T-001..T-007** (8 ≤ SPRINT_MAX_TASKS=12).

### Runtime proof (DEC-0038)

- `runtime_proof_id=rp-auto-20260911-bug0017-architecture-techlead-20260911T192000Z-BUG-0017`
- `proof_hash=541A4773D0E994EE9FC1A0DD09E70DBE1D0B262170FB6D63540407CEBBD76B68`
- `proof_ttl=2026-09-11T20:20:00Z`
- Consumed research proof: `rp-auto-20260911-bug0017-research-techlead-20260911T191200Z-BUG-0017` / `DF94BA041DDCB51ADD0675C7B41DEAD6F14CADB1D1095489E3B5F0E8342B777A` — RUNTIME_PROOF_VALID

### Isolation + stop

- `phase_id=architecture`, `role=tech-lead`, `bug_id=BUG-0017`, `fresh_context_marker=tl-BUG0017-architecture-20260911T191500Z-fresh`, `model_id=composer-2.5`
- **Hot-surface note**: Appended (not prepended) so triad oldest-prefix rollover retains this newest section.
- **Status**: BUG-0017 remains **OPEN**. **Next**: `/sprint-plan` in fresh **tech-lead** subagent (orchestrator may insert sovereign-critic of architecture first). Do not spawn sprint-plan from this architecture chat. STOP.

## Intake handoff — US-0133..US-0148 standalone its-magic agent

- **Phase completed**: intake. **Role**: po. **Stories**: US-0133 through US-0148. **Verdict**: PASS (`decision_gate=false`).
- **Source**: `docs/product/standalone-its-magic-pi-masterplan.md` (complete read, sections 0-47).
- **Evidence**: `handoffs/intake_evidence/US-0133-0148-intake-20260911.json` (`first-intake-pack`, 26/26 plan areas mapped, `[INTAKE_EVIDENCE_VALIDATION_OK]`).
- **Operator outcome**: Create enough user stories to implement the complete standalone Pi masterplan.
- **Decomposition**: 16 vertical capability stories, matching the masterplan's recommended 12-16 range. Historical US-0001..US-0132 are consumed as contracts and are not cloned.
- **Priorities**: P0 core product US-0133..US-0142 plus operator/adoption US-0146/US-0147; P1 advanced parity US-0143..US-0145 and daemon US-0148.
- **Status**: all 16 stories OPEN. **Recommended next**: `/discovery` for US-0133 and US-0134 together as the Phase 0 viability slice, then `/research` on Pi SDK, kernel contracts, security/resource loading, AFT, and Playwright/CDP.

### Story map

| Story | Capability | Plan areas |
|---|---|---|
| US-0133 | Repository + Pi kernel adapter | repo-bootstrap, pi-kernel-adapter |
| US-0134 | Kernel bridge | kernel-consume-contract |
| US-0135 | Auth/model runtime | auth-model-runtime |
| US-0136 | Session/role isolation | session-isolation-attestation, role-runtime |
| US-0137 | Tools/policy/security | tool-policy-engine |
| US-0138 | Typed config/legacy adapter | typed-config-legacy-adapter |
| US-0139 | Code intelligence/context | code-intelligence-aft, context-engine |
| US-0140 | Standard lifecycle | workflow-standard |
| US-0141 | App/remote execution | dev-environment-runtime, remote-execution |
| US-0142 | Browser UAT | browser-uat |
| US-0143 | Delivery/autonomy | delivery-routing, auto-autonomy |
| US-0144 | Sovereign runtime | sovereign-runtime |
| US-0145 | Parallel DEV/release/deploy | parallel-dev-worktrees, release-deploy-closure |
| US-0146 | CLI/TUI/observability | cli-tui-observability |
| US-0147 | Installation/migration | cross-cutting Phase 8 adoption capability |
| US-0148 | Daemon/control API | daemon-control-api |

### Explicit deferrals and external paths

| Plan area | Disposition |
|---|---|
| own-rust-indexer | Deferred until the AFT benchmark demonstrates a concrete gap. |
| ide-client | Deferred graphical client; consume US-0148 protocol later. |
| mobile-watch-client | Deferred remote client; consume US-0148 protocol later. |
| opencode-adapter | Existing current-kit compatibility path; do not duplicate in standalone. |
| cursor-adapter | Existing current-kit compatibility path; do not duplicate in standalone. |

### Architecture gates carried forward

- Pi remains behind `AgentKernel`; no Pi imports outside `packages/pi-kernel`.
- Built-in Pi mutation tools and project resource auto-loading are default-off.
- Repository artifacts and existing Python validators remain authoritative.
- Every phase/rework/review uses a fresh attested session; orchestrator remains spawn/schedule-only.
- AFT is replaceable and read-oriented; all mutations pass through owned policy.
- Browser/app runtimes are owned; Playwright primary and authorized CDP secondary.
- Release and closure remain separate; security-hard gates are never relaxed.
- Phase 0's ten hard proofs are a go/no-go gate before broad implementation.

### Risks for discovery/research

- Pi SDK churn, resource loader behavior, session-ID stability, OAuth UX, and event ordering need version-specific proof.
- Python kernel public-contract boundaries and a machine-readable stop/role/ownership manifest need inventory.
- AFT Windows/LSP/worktree behavior and read-only integration need benchmark evidence.
- CDP authorization and browser evidence redaction need a security design.
- Default unattended OS isolation on Windows/Linux needs an explicit execution-profile decision.

---

