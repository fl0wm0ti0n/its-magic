# Developer documentation

This shard holds contributor-facing material for the **its-magic** framework. End-user
setup stays in the root `README.md` (user channel).

## Prerequisites

- **Cursor** (or compatible editor) with the workflow files installed.
- **Python 3** on PATH for scratchpad merge validation and several repo scripts.
- **Node.js** if you use npm-packaged `its-magic` or npm-driven `TEST_COMMAND` defaults.

## Workflow

- Follow phased commands under `.cursor/commands/` (`intake`, `discovery`, `architecture`,
  `sprint-plan`, `execute`, `qa`, `release`, etc.).
- Keep handoffs and `docs/engineering/state.md` updated at phase boundaries.
- Use `.cursor/scratchpad.local.md` for personal overrides; never commit secrets.
- **US-0124** — OpenCode orchestrator plugin spawn-only `/auto`; traceability:
  runbook `## OpenCode orchestrator plugin reason codes (US-0124)`, architecture `# US-0124`, `decisions/DEC-0124.md`.
- **US-0131** — Cross-host Its-Magic runtime configuration (host-neutral `.its-magic/config*`); traceability:
  runbook `## Cross-host runtime configuration (US-0131)`, architecture `# US-0131`, `decisions/DEC-0131.md`.
- **US-0132** — Cursor/OpenCode model configuration contract (four surfaces; reject generic `model.json`); traceability:
  runbook `## Cursor/OpenCode model configuration contract (US-0132)`, architecture `# US-0132`, `decisions/DEC-0132.md`.
- **BUG-0018** — OpenCode plugin-only `/auto` (markdown not sole owner); traceability:
  runbook `### OpenCode markdown `/auto` vs plugin execute (BUG-0018 / R-0120)`, architecture `# BUG-0018`.
- **BUG-0019** — OpenCode TUI slash listing for `/auto` after plugin-only ownership; traceability:
  runbook `### OpenCode `/auto` slash listing after plugin-only ownership (BUG-0019 / R-0124)`, architecture `# BUG-0019`.
- **BUG-0020** — OpenCode desktop Command.Info cannot list execute-only `/auto`; CLI TUI via `tui.json`; traceability:
  runbook `### OpenCode desktop Command.Info `/auto` listing (BUG-0020 / R-0126)`, architecture `# BUG-0020`.
- **BUG-0021** — Standalone provider authentication, model routing, and health diagnostics; traceability: architecture `# BUG-0021`.
- **BUG-0023** — Fresh role sessions and runtime attestation; traceability: architecture `# BUG-0023`.
- **BUG-0025** — Owned tool broker, policy decisions, and security audit records; traceability: architecture `# BUG-0025`.
- **US-0139** — Persistent code intelligence and reproducible context packs; traceability: architecture `# US-0139`, `decisions/DEC-0139.md`.
- **US-0140** — Canonical lifecycle routing, gates, rework, resume, and E2E fixtures; traceability: architecture `# US-0140`, `decisions/DEC-0140.md`.
- **US-0141** — Application runtime execution and bounded cleanup; traceability: architecture `# US-0141`, `decisions/DEC-0141.md`.
- **US-0142** — Owned browser UAT actions and evidence recording; traceability: architecture `# US-0142`, `decisions/DEC-0142.md`.
- **US-0143** — Delivery routing and bounded full-autonomy execution; traceability: architecture `# US-0143`, `decisions/DEC-0143.md`.

## Quality gates

- Run `TEST_COMMAND` from `docs/engineering/runbook.md` before push; CI should mirror the same.
- Run `python scripts/validate_doc_profile.py` when changing documentation profile flags or
  README surfaces.
- Observe `US-0071` hygiene for user-visible script output (see runbook).
- **US-0121** — OpenCode template pack + installer `--host` flag; traceability:
  runbook `## OpenCode host mode (US-0121)`, architecture `# US-0121`.
- **US-0123** — OpenCode per-role/per-phase model slug routing (multi-provider, no vendor IDs in template); traceability:
  runbook `## OpenCode model slug routing (US-0123)`, architecture `# US-0123`, `decisions/DEC-0123.md`.
- **US-0124** — OpenCode orchestrator plugin spawn-only `/auto` (Task-spawns US-0069 roles, never executes phase work in-session); traceability:
  runbook `## OpenCode orchestrator plugin reason codes (US-0124)`, architecture `# US-0124`, `decisions/DEC-0124.md`.
- **BUG-0015** — OpenCode `/auto` dispatch attach (plugin owns interactive spawn); traceability:
  runbook `### OpenCode `/auto` dispatch attach reason codes (BUG-0015)`, architecture `# BUG-0015`.
- **BUG-0016** — OpenCode Layer-1 role permissions vs kit duties (bash ask; S* globs; release duty paths); traceability:
  architecture `# BUG-0016`, `decisions/DEC-0122.md` §2.
- **BUG-0017** — OpenCode pack LF / Linux slash commands (scoped `.gitattributes` + guard CR inventory); traceability:
  runbook `### OpenCode pack LF / Linux slash commands (BUG-0017 / R-0118)`, architecture `# BUG-0017`.
- **BUG-0018** — OpenCode plugin-only `/auto` (no colliding `auto.md`; leftover prune); traceability:
  runbook `### OpenCode markdown `/auto` vs plugin execute (BUG-0018 / R-0120)`, architecture `# BUG-0018`.
- **BUG-0019** — OpenCode TUI slash lists `/auto` via `its-magic-auto/tui.ts` keymap; traceability:
  runbook `### OpenCode `/auto` slash listing after plugin-only ownership (BUG-0019 / R-0124)`, architecture `# BUG-0019`.
- **BUG-0020** — OpenCode desktop Command.Info `/auto` listing unsupported; CLI TUI via `tui.json`; traceability:
  runbook `### OpenCode desktop Command.Info `/auto` listing (BUG-0020 / R-0126)`, architecture `# BUG-0020`.
- **US-0126** — OpenCode host operator runbook, cross-host reason-code catalog, and `--scope=opencode-adapter` parity; traceability:
  runbook `## OpenCode host operator runbook (US-0126)`, architecture `# US-0126`.
- **US-0130** — Operator-pinned sovereign-critic model (`MODEL_SOVEREIGN-CRITIC` + catalog `roles.critic`); traceability:
  runbook **Degraded fallback troubleshooting**, architecture `# US-0130`, `decisions/DEC-0130.md`.
- **US-0131** — Cross-host Its-Magic runtime configuration and parity; traceability:
  runbook `## Cross-host runtime configuration (US-0131)`, architecture `# US-0131`, `decisions/DEC-0131.md`.
- **US-0132** — Cursor/OpenCode model configuration contract; traceability:
  runbook `## Cursor/OpenCode model configuration contract (US-0132)`, architecture `# US-0132`, `decisions/DEC-0132.md`.
- **US-0134** — KernelBridge consume contract + four `KERNEL_*` handshake codes; traceability:
  runbook `### KernelBridge consume contract + upgrade (US-0134 / R-0122 / DEC-0134)`, architecture `# US-0134`, `decisions/DEC-0134.md`.

## Architecture notes

- **BUG-0017** — OpenCode pack LF / Linux slash commands; traceability:
  runbook `### OpenCode pack LF / Linux slash commands (BUG-0017 / R-0118)`, architecture `# BUG-0017`.
- **US-0122** — OpenCode role agents and Layer-1 permission table; traceability:
  architecture `# US-0122`, `decisions/DEC-0122.md`.
- **US-0125** — Thin OpenCode commands and Python validator bridge (dispatch-only `.opencode/commands/`; Python validators remain fail-closed SOT); traceability:
  architecture `# US-0125`, `decisions/DEC-0125.md`.
- **US-0133** — Unpublished standalone Pi kernel workspace (kit `files` omit `standalone/`; owned `AgentKernel`); traceability:
  runbook `### Unpublished standalone Pi kernel workspace (US-0133 / R-0121)`, architecture `# US-0133`, `decisions/DEC-0133.md`.
- **US-0135** — Standalone authentication, provider/model routing, and health diagnostics; traceability: architecture `# US-0135`, `decisions/DEC-0135.md`.
- **US-0136** — Fresh role session isolation and runtime attestation; traceability: architecture `# US-0136`, `decisions/DEC-0136.md`.
- **US-0137** — Owned tool broker, policy engine, and security boundary; traceability: architecture `# US-0137`, `decisions/DEC-0137.md`.
- **US-0138** — Typed runtime configuration and provenance diagnostics; traceability: architecture `# US-0138`, `decisions/DEC-0138.md`.
- **US-0144** — Sovereign critic sessions, reviews, and convergence; traceability: architecture `# US-0144`, `decisions/DEC-0144.md`.
- **US-0145** — Parallel delivery, release/deploy, and closure verification; traceability: architecture `# US-0145`, `decisions/DEC-0145.md`.
- **US-0146** — CLI/TUI operational observability; traceability: architecture `# US-0146`, `decisions/DEC-0146.md`.
- **US-0147** — Installation, update, and existing-project adoption; traceability: architecture `# US-0147`, `decisions/DEC-0147.md`.
- **US-0148** — Recoverable daemon control protocol and lifecycle; traceability: architecture `# US-0148`, `decisions/DEC-0148.md`.
- High-level contracts live in `docs/engineering/architecture.md` (search for story ids).
- Installer ownership is driven by `docs/engineering/context/installer-owned-paths.manifest`.
- Template parity: changes in repo root often require the same edit under `template/`.

## Contracts and interfaces

- Scratchpad merge precedence: local → materialized `.cursor/scratchpad.md` →
  `.cursor/scratchpad.local.example.md` (Model B / **DEC-0055**).
- Documentation profile keys: `DOC_AUDIENCE_PROFILE`, `DOC_DETAIL_LEVEL` (**DEC-0059**).
- Optional modes: `SPEC_PACK_MODE`, `USER_GUIDE_MODE` remain orthogonal; when `0`, validators
  must not require those artifacts.

## Engineering decisions

- Decision records: `decisions/DEC-xxxx.md` and the compact index in
  `docs/engineering/decisions.md`.
- Profile semantics for this shard: **DEC-0059** and `# US-0077` in `architecture.md`.
