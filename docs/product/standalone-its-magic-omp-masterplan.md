# Standalone its-magic Agent on OMP — Master Plan

> Target: a standalone, sovereign `its-magic` coding agent that uses **OMP / Oh My Pi** as an embedded and replaceable coding-agent kernel, while `its-magic` owns workflow, policy, project memory, gates, orchestration, runtime evidence, UAT semantics, and product UX.
>
> Research baseline: verified against the current OMP documentation and repository on **2026-10-15**.

---

## 0. Executive decision

Build a dedicated standalone product:

```text
its-magic
  = workflow operating system
  + policy engine
  + artifact memory
  + deterministic lifecycle
  + runtime/UAT/deploy orchestration
  + sovereign loops
  + branded TUI

OMP
  = coding-agent kernel
  + model/provider transport
  + sessions
  + subagents
  + LSP
  + browser primitives
  + task/workspace isolation
  + terminal renderer / TUI primitives
  + SDK / RPC / ACP
```

The relationship must remain:

```text
its-magic
    ↓
AgentKernel + ToolBroker + PolicyEngine
    ↓
OMP
```

and never become:

```text
OMP
  ↓
a pile of its-magic prompts
```

### Primary recommendation

Use **OMP as the default v1 AgentKernel** for the standalone product because it already provides several expensive capabilities that the Pi plan would otherwise need to assemble separately:

- rich interactive TUI;
- custom TUI components and overlays;
- status line / themes / keybindings;
- Agent Hub for live subagents;
- SDK embedding;
- RPC process boundary;
- ACP editor integration;
- OAuth and multi-provider support;
- LSP integration;
- browser/CDP/Electron primitives;
- subagent/task orchestration;
- optional workspace isolation;
- background jobs;
- structured tool rendering.

However, **OMP must remain replaceable** behind an `AgentKernel` interface. Keep the existing Pi plan as the second adapter / fallback reference implementation.

### Recommended technology split

```text
Bun + TypeScript
├── its-magic runtime
├── OMP host adapter
├── TUI extension/package
├── policy/tool broker
├── workflow engine
├── context engine
├── provider/model policy
└── control protocol

Python
├── existing its-magic validators
├── migration bridge
└── existing framework scripts during transition

Rust (optional later)
├── its-indexd semantic/code graph daemon
└── performance-sensitive local services
```

---

## 1. Product statement

### One-sentence product

**its-magic Standalone is a terminal-first autonomous software-development team that owns the complete lifecycle from idea to verified release, while OMP supplies the replaceable low-level coding-agent machinery.**

### User experience target

The user should be able to run:

```bash
its-magic
```

and enter a full interactive TUI.

Then:

```text
> Build me an application that ...
```

or:

```text
/intake
/auto
/ask
/status
```

The system should then be able to:

```text
intake
  ↓
discovery
  ↓
research
  ↓
architecture
  ↓
sprint plan
  ↓
plan verification
  ↓
implementation
  ↓
runtime launch
  ↓
QA
  ↓
browser UAT
  ↓
verify-work
  ↓
release
  ↓
deploy / smoke
  ↓
closure
  ↓
refresh context
```

with:

- fresh agent contexts;
- explicit roles;
- model routing per phase;
- code-enforced permissions;
- deterministic evidence;
- pause/resume;
- persistent repo memory;
- browser/app self-testing;
- bounded recovery loops;
- user decision gates;
- remote/headless operation.

---

## 2. What the current its-magic framework already solved

The standalone project is **not a rewrite of the methodology**.

The current framework already contains the important product semantics. The standalone runtime should migrate and harden those semantics instead of redesigning them casually.

### 2.1 Artifact-first project memory

Canonical project truth remains in the repository:

```text
docs/product/
docs/engineering/
decisions/
handoffs/
sprints/
work/
its_magic/
```

Project lifecycle state must never depend on OMP conversation history.

Rule:

```text
repository artifacts = canonical project memory
OMP session history   = disposable execution context
```

### 2.2 Deterministic lifecycle

Preserve the existing lifecycle concepts:

- intake;
- discovery;
- research;
- architecture;
- sprint planning;
- plan verification;
- execute;
- QA;
- verify-work;
- release;
- closure;
- refresh-context;
- quick / mega-quick;
- ultra-lean;
- full autonomy;
- bounded backlog drain;
- bug targeting;
- pause/resume;
- decision gates.

### 2.3 Role enforcement

Preserve hard role boundaries:

```text
intake          → PO

discovery       → PO
research        → PO / Tech Lead according to policy
architecture    → Tech Lead
sprint-plan     → Tech Lead
plan-verify     → QA
execute         → DEV
qa              → QA
verify-work     → QA
release         → Release
closure         → QE / Curator policy fallback
refresh-context → Curator / PO policy fallback
```

The runtime must validate the role **before** a phase begins and reject mismatched evidence afterward.

### 2.4 Runtime proof and fresh-context guarantees

Retain:

- fresh context per phase;
- runtime proof IDs;
- proof hashes;
- TTL semantics where still useful;
- phase/role evidence;
- fail-closed continuation when proof is missing or ambiguous.

Standalone gives us the opportunity to make this proof stronger because the host itself creates each session/process.

### 2.5 Quality and release contracts

Preserve:

- check-in test gate;
- QA gate;
- UAT gate;
- release evidence;
- README/runbook integrity;
- traceability;
- release queue;
- changelog;
- closure reconciliation;
- no silent bypass.

### 2.6 Runtime QA and browser UAT

Existing concepts remain first-class:

- auto-detect app stack;
- start/rebuild/restart app;
- health/connectivity checks;
- inspect logs;
- bounded self-debug retry;
- browser smoke;
- CLI smoke;
- process health;
- network/console evidence;
- UAT evidence in repo artifacts.

### 2.7 Sovereign features

Preserve and migrate:

- AI Decision Ledger;
- plan fidelity;
- cross-model adversarial critic;
- role-behavior manifest;
- Sovereign Memory;
- deferral register;
- goal convergence;
- parallel DEV arbitrage;
- self-healing deploy;
- autonomy presets;
- stop-policy logic.

---

## 3. Why OMP is especially attractive for this product

OMP reduces the amount of infrastructure we need to implement ourselves while still giving us hooks and SDK surfaces needed for control.

### 3.1 Native interactive TUI

OMP already exposes:

- differential terminal rendering;
- focus management;
- overlays;
- custom components;
- editor replacement surfaces;
- widgets above/below editor;
- status messages;
- configurable status-line segments;
- custom themes;
- keybindings;
- custom tool renderers;
- mouse-capable Agent Hub;
- transcript switching;
- live subagent controls.

This is a major advantage over building our own terminal UI framework.

### 3.2 SDK embedding

OMP exposes a Bun/TypeScript SDK including core concepts such as:

```text
createAgentSession
SessionManager
ModelRegistry
AgentRegistry
AuthStorage
Settings
resource discovery
custom tools
extensions
```

This gives us direct in-process control when required.

### 3.3 RPC mode

OMP also provides NDJSON stdio RPC.

This gives us a clean process boundary for:

- high-isolation roles;
- remote execution;
- crash containment;
- alternative-language hosts;
- daemon architecture;
- testing.

### 3.4 ACP mode

ACP can later provide IDE/editor integration without making an IDE the source of truth.

Standalone remains primary; editor clients become views/controllers.

### 3.5 Provider/auth subsystem

OMP already supports a large provider catalog and OAuth-backed providers, including OpenAI Codex OAuth.

This fits our role-based model routing strategy.

### 3.6 LSP as a first-class capability

OMP already exposes LSP operations such as:

- diagnostics;
- definitions;
- references;
- hover;
- workspace symbols;
- rename;
- code actions;
- server capabilities.

This saves significant work compared with wiring LSP from scratch.

### 3.7 Subagent system and Agent Hub

OMP has:

- custom agent definitions;
- task spawning;
- batch spawning;
- async execution;
- persisted subagent artifacts;
- optional workspace isolation;
- steering;
- kill/revive controls;
- interactive Agent Hub.

That is a strong foundation for its-magic roles and parallel DEV.

### 3.8 Browser primitives

OMP can use:

- headless Chromium;
- spawned browser/Electron executables;
- attached CDP endpoints;
- relay to an existing Chrome tab.

We can therefore reuse its browser engine while keeping UAT semantics under our control.

---

## 4. Architectural caveat: OMP is more capable, therefore it needs stronger containment

OMP includes many subsystems that overlap with its-magic.

Examples:

```text
OMP memory
OMP agents
OMP task orchestration
OMP browser
OMP planning
OMP auto-research
OMP advisor/watchdog
OMP tool discovery
OMP checkpoints
```

We must not let parallel ownership emerge.

### Ownership rule

For every overlapping feature, define one of four dispositions:

```text
USE       → OMP capability used directly
WRAP      → OMP capability exposed only through its-magic policy
DISABLE   → capability disabled in canonical workflow
IGNORE    → capability may exist but cannot affect canonical project state
```

### Initial disposition table

| Capability | Disposition | Reason |
|---|---|---|
| TUI renderer | USE | high value, low semantic conflict |
| Themes/keybindings | USE | presentation concern |
| Agent Hub | USE/WRAP | useful observability, its-magic owns role graph |
| Provider/auth | USE/WRAP | OMP transport, its-magic model policy |
| LSP read actions | USE/WRAP | strong code intelligence |
| LSP mutating actions | WRAP | policy-controlled writes |
| Search/read | WRAP | enforce scope and audit |
| Bash | WRAP | enforce command policy |
| Edit/write | WRAP | artifact/path ownership |
| Browser | WRAP | UAT policy + credential safety |
| Task/subagent | WRAP | its-magic owns phase spawning |
| Workspace isolation | USE/WRAP | good primitive, its-magic chooses when |
| OMP memory | DISABLE/IGNORE | repository memory remains canonical |
| OMP auto-research | DISABLE by default | its-magic research phase owns this |
| OMP autonomous planning | DISABLE in canonical flow | its-magic lifecycle owns planning |
| OMP arbitrary tool discovery | restricted | avoid policy bypass |

---

## 5. North-star architecture

```text
┌─────────────────────────────────────────────────────────────┐
│                       its-magic                             │
│                                                             │
│   ┌─────────────────────────────────────────────────────┐   │
│   │                 Product / TUI Layer                 │   │
│   │  Dashboard · Chat · Phase Timeline · Decisions      │   │
│   │  Agent Hub integration · Logs · UAT · Evidence      │   │
│   └─────────────────────────────────────────────────────┘   │
│                             │                               │
│   ┌─────────────────────────┴───────────────────────────┐   │
│   │                Workflow Engine                     │   │
│   │ phase graph · roles · stop matrix · resume         │   │
│   │ delivery modes · autonomy · convergence            │   │
│   └─────────────────────────┬───────────────────────────┘   │
│                             │                               │
│   ┌───────────────┬─────────┴────────┬─────────────────┐   │
│   │ PolicyEngine  │ Context Engine   │ Evidence Engine │   │
│   └───────┬───────┴─────────┬────────┴────────┬────────┘   │
│           │                 │                 │            │
│   ┌───────▼─────────────────▼─────────────────▼────────┐   │
│   │                    ToolBroker                     │   │
│   │ filesystem · shell · git · LSP · index · browser │   │
│   │ process · tests · deploy · validators             │   │
│   └───────────────────────┬───────────────────────────┘   │
│                           │                               │
│   ┌───────────────────────▼───────────────────────────┐   │
│   │                   AgentKernel                     │   │
│   │            OmpKernelAdapter (default)             │   │
│   │              PiKernelAdapter (later)              │   │
│   └───────────────────────┬───────────────────────────┘   │
└───────────────────────────┼─────────────────────────────────┘
                            │
                   ┌────────▼────────┐
                   │      OMP        │
                   │ SDK/RPC/TUI/ACP │
                   └─────────────────┘
```

---

## 6. Non-negotiable architectural rules

### R1 — OMP is a kernel, not the product

No lifecycle rule may exist only in an OMP prompt.

### R2 — Workflow decisions live in code

Phase transitions, stop policies, role mapping, retries, and gates must be machine-evaluated.

### R3 — Canonical project memory stays in repo artifacts

OMP session/memory is never authoritative for project history.

### R4 — Every canonical phase gets fresh execution identity

At minimum:

```text
new phase_run_id
new OMP session
new runtime proof
```

Optional hard mode:

```text
new OMP process
new workspace/worktree
```

### R5 — Orchestrator cannot perform phase implementation

The orchestrator schedules, validates and transitions.

It does not do DEV work itself.

### R6 — All mutating tools are policy controlled

No raw uncontrolled edit/write/bash/deploy capability in canonical role sessions.

### R7 — Existing Python validators remain authoritative during migration

Do not rewrite mature validators merely for language purity.

### R8 — Browser primitives do not define UAT semantics

OMP drives the browser; its-magic defines what constitutes PASS/FAIL/evidence.

### R9 — Third-party/OMP memory cannot alter canonical lifecycle state

### R10 — Security-hard gates cannot be relaxed by autonomy presets

### R11 — TUI is a view/controller, not the state machine

Closing the TUI must not corrupt or erase lifecycle state.

### R12 — Headless and TUI paths use the same core engine

---

## 7. OMP integration strategy

There are three useful OMP integration modes.

### 7.1 Mode A — Interactive OMP-native TUI host

Recommended primary desktop/terminal experience.

```text
its-magic CLI wrapper
      ↓
OMP interactive runtime
      ↓
@its-magic/omp-extension
      ↓
its-magic core runtime
```

Benefits:

- native OMP rendering quality;
- Agent Hub;
- tool cards;
- theme engine;
- keybindings;
- overlays;
- low implementation cost.

### 7.2 Mode B — OMP SDK in-process

Use for:

- deterministic tests;
- daemon services;
- internal workers;
- tightly coupled control;
- advanced session construction.

### 7.3 Mode C — OMP RPC child process

Use for:

- hard phase isolation;
- crash containment;
- non-Bun controllers;
- remote worker protocol;
- high-risk execution profiles.

### Recommended v1 combination

```text
Interactive user session:
  OMP native TUI + its-magic extension

Canonical phase workers:
  OMP fresh sessions via SDK
  OR
  OMP RPC subprocess when isolation profile=process
```

Do not require every role to share the ambient TUI conversation.

---

## 8. `AgentKernel` boundary

The rest of its-magic should not know OMP-specific classes.

```ts
interface AgentKernel {
  createSession(input: CreateAgentSessionInput): Promise<AgentSessionHandle>;
  prompt(session: AgentSessionHandle, input: AgentPrompt): Promise<AgentResult>;
  steer(session: AgentSessionHandle, message: string): Promise<void>;
  abort(session: AgentSessionHandle): Promise<void>;
  close(session: AgentSessionHandle): Promise<void>;
  setModel(session: AgentSessionHandle, model: ModelRef): Promise<void>;
  getCapabilities(): Promise<KernelCapabilities>;
  subscribe(handler: AgentKernelEventHandler): Unsubscribe;
}
```

### OMP adapter responsibilities

```text
OmpKernelAdapter
├── createAgentSession mapping
├── OMP model selection
├── auth/model registry access
├── event translation
├── OMP tool authorization hooks
├── subagent lifecycle translation
├── usage/cost extraction
├── session close/abort
└── error normalization
```

### Kernel-neutral events

```text
session.created
session.closed
turn.started
turn.finished
tool.requested
tool.started
tool.updated
tool.finished
tool.blocked
agent.spawned
agent.finished
agent.failed
model.changed
usage.updated
```

---

# PART II — TUI PRODUCT

## 9. TUI strategy

### Decision

**Reuse the OMP TUI framework and make an its-magic branded extension/product layer.**

Do not create a new terminal renderer in v1.

OMP already supports the exact primitives we need:

- custom full-screen/component surfaces;
- overlays;
- widgets above and below the editor;
- status entries;
- themes;
- configurable status lines;
- tool renderers;
- hotkeys;
- selectors/dialogs/editors;
- Agent Hub.

### What not to rely on in v1

Current extension integration does not provide a fully custom persistent header/footer API in all paths.

Therefore do not architect the UX around custom `setHeader`/`setFooter` behavior.

Use:

- OMP status line;
- hook/extension status segments;
- widgets;
- custom overlays;
- full-screen custom views;
- normal transcript/tool cards.

---

## 10. its-magic TUI information architecture

### Normal working view

Keep OMP's conversation/transcript as the central surface.

Add compact lifecycle context around it.

Concept:

```text
┌──────────────────────────────────────────────────────────────────────┐
│ its-magic · US-0142 · S0142 · BUILD+VERIFY · DEV · Codex OAuth      │
├──────────────────────────────────────────────────────────────────────┤
│ ✓ spec  ✓ plan  ● build+verify  ○ ship  ○ closure                  │
│ blockers: 0   AC: 7/10   tests: 83/83   UAT: pending               │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  user / agent transcript                                             │
│                                                                      │
│  ┌ TOOL · itsm_code_context ──────────────────────────────────────┐  │
│  │ 16 symbols · 7 refs · 4 tests · 2 decisions                    │  │
│  └────────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  assistant ...                                                       │
│                                                                      │
├──────────────────────────────────────────────────────────────────────┤
│ >                                                                    │
├──────────────────────────────────────────────────────────────────────┤
│ AUTO ● │ dev │ gpt-x │ ctx 31% │ $1.24 │ index ✓ │ app :5173 ✓    │
└──────────────────────────────────────────────────────────────────────┘
```

The exact placement should respect OMP's renderer constraints; persistent information can be represented through status-line segments and compact widgets rather than a hard-coded custom header.

---

## 11. TUI surfaces

### 11.1 Lifecycle Dashboard

Hotkey proposal:

```text
Alt+M
```

or slash command:

```text
/magic
```

Full-screen custom component showing:

```text
Project
Current story / bug
Current sprint
Delivery mode
Autonomy mode
Phase timeline
Role/model map
Current blockers
Open decisions
Test status
UAT status
Release status
Runtime services
Recent evidence
Token/cost stats
```

### 11.2 Phase Timeline

```text
INTAKE       ✓  PO         Claude     01:31
DISCOVERY    ✓  PO         Claude     02:04
RESEARCH     ✓  TL         GLM        03:12
ARCHITECTURE ✓  TL         Codex      04:41
PLAN         ✓  TL         Codex      01:52
VERIFY       ✓  QA         Gemini     01:03
EXECUTE      ●  DEV        Codex      06:25
QA           ○
UAT          ○
RELEASE      ○
CLOSURE      ○
```

Selecting a phase opens:

- phase evidence;
- runtime proof;
- artifacts changed;
- model/provider;
- tool activity summary;
- token usage;
- subagent transcript.

### 11.3 Decision Gate overlay

When a hard decision is required:

```text
┌─ DECISION REQUIRED ─────────────────────────────────────┐
│ DEC-0148                                                │
│                                                        │
│ Database migration is destructive.                     │
│                                                        │
│  > A  create reversible shadow migration               │
│    B  migrate in place                                  │
│    C  stop and redesign                                 │
│                                                        │
│ impact: HIGH · security: normal · unblock: architecture │
│                                                        │
│ [Enter] choose   [E] edit rationale   [Esc] stop        │
└────────────────────────────────────────────────────────┘
```

Use OMP selector/editor/custom-overlay primitives.

### 11.4 UAT Dashboard

```text
UAT · US-0142

✓ start application
✓ health endpoint
✓ login screen
✓ create account
● edit profile
○ responsive smoke
○ console/network audit

Browser: Chromium isolated
URL: http://localhost:5173
Console errors: 0
Network failures: 0
Screenshots: 5
Trace: available
```

Hotkeys:

```text
Enter   open evidence
B       open browser details
R       rerun selected step
L       logs
Esc     back
```

### 11.5 Runtime / Services view

```text
SERVICE      STATE     PORT   HEALTH   LOGS
frontend     running   5173   green    0 err
api          running   8080   green    1 warn
postgres     running   5432   green    -
worker       stopped   -      -        -
```

Actions:

```text
S start
X stop
R restart
B rebuild
L logs
H health
```

All actions still pass PolicyEngine.

### 11.6 Evidence Inspector

View normalized evidence without manually navigating files:

```text
story
acceptance
plan
QA findings
UAT steps
release findings
runtime proof
isolation proof
decisions
critic findings
```

The inspector reads repo artifacts; it does not invent state.

### 11.7 Context Inspector

Critical for debugging agent quality.

Show exactly what will be sent to the next role:

```text
ROLE: dev
PHASE: execute
TOKEN BUDGET: 38k

Context sources
✓ work/US-0142/pack.json                    2.1k
✓ handoffs/active-context.md                0.8k
✓ architecture.md#US-0142                   4.2k
✓ DEC-0148                                  1.6k
✓ code-context                              8.3k
✓ sovereign-memory digest                   1.1k

Excluded
- old sprints
- unrelated decisions
- .env
- archived state packs
```

This makes context behavior transparent.

### 11.8 Tool Cards

Use OMP custom `renderCall` / `renderResult`.

Examples:

```text
╭ itsm_shell ─────────────────────────────────────╮
│ npm test                                       │
│ role=dev  cwd=frontend  policy=ALLOW           │
╰────────────────────────────────────────────────╯
✓ 83 passed · 12.4s
```

```text
╭ itsm_edit ──────────────────────────────────────╮
│ src/auth/session.ts                             │
│ +12 -4                                         │
│ owner=dev · path-policy=ALLOW                   │
╰────────────────────────────────────────────────╯
```

```text
╭ itsm_browser ───────────────────────────────────╮
│ click: Save Profile                             │
│ qa · isolated chromium                         │
╰─────────────────────────────────────────────────╯
✓ screenshot + console + network evidence
```

### 11.9 Agent Hub integration

OMP's Agent Hub should be retained.

its-magic adds metadata to each spawned role:

```text
DEV-1
phase=execute
story=US-0142
model=openai-codex/...
workspace=wt/US-0142-dev-a
policy=dev

QA-1
phase=qa
story=US-0142
model=google/...
workspace=read-main
policy=qa
```

The operator can:

- inspect transcript;
- steer allowed agents;
- kill/revive when policy allows;
- see resource usage;
- see ancestry.

Important: manual steering must be logged as runtime evidence because it changes the execution path.

---

## 12. TUI themes and branding

Ship an `its-magic` theme family.

Suggested presets:

```text
magic-dark
magic-warm
magic-light
magic-nerd
```

Theme should style:

- current phase;
- PASS/WARN/BLOCK;
- role identity;
- tool cards;
- diffs;
- decision gates;
- runtime status;
- UAT status.

Do not hard-code ANSI colors in business logic.

Use OMP theme tokens and symbol presets.

### Optional user's existing preference style

Allow a low-contrast warm dark preset as an additional theme rather than forcing it globally.

---

## 13. Keybindings

Ship an `its-magic` keybinding profile while respecting OMP reserved shortcuts.

Suggested semantic actions:

```text
magic.dashboard
magic.phase.timeline
magic.evidence
magic.context
magic.runtime
magic.uat
magic.decisions
magic.pause
magic.resume
magic.autonomy.toggle
```

Example default mapping:

```text
Alt+M   dashboard
Alt+P   phases
Alt+E   evidence
Alt+U   UAT
Alt+R   runtime
Alt+D   decisions
```

Let users remap through OMP's `keybindings.yml` mechanism.

---

## 14. Headless/RPC UI parity

The rich custom TUI exists only in interactive mode.

RPC cannot depend on arbitrary terminal custom components.

Therefore the core must expose structured events/data:

```text
workflow.snapshot
phase.started
phase.finished
decision.required
runtime.service.changed
uat.step.changed
evidence.written
agent.spawned
tool.policy_decision
```

Interactive OMP TUI renders these natively.

Future web/mobile clients render the same event stream themselves.

In RPC UI mode, use supported dialog/status frames where appropriate, but do not make workflow correctness depend on them.

---

# PART III — POLICY AND EXECUTION

## 15. ToolBroker architecture

### Goal

Every meaningful side effect must be attributable to:

```text
run
phase
role
session
model
tool
policy decision
```

### Tool classes

```text
read-only
├── read
├── search
├── code_search
├── LSP diagnostics/navigation
├── git status/diff
└── artifact queries

mutating
├── edit/write
├── shell
├── git mutation
├── LSP rename/code actions
├── browser interaction
├── process launch
├── deploy
└── release publication
```

---

## 16. OMP tool interception

OMP supports pre-execution tool interception through extension/hooks.

Use this as a host-level enforcement point.

Concept:

```ts
pi.on("tool_call", async (event, ctx) => {
  const decision = await policy.authorize({
    phase: current.phase,
    role: current.role,
    tool: event.toolName,
    input: event.input,
    cwd: ctx.cwd,
  });

  if (decision.kind === "deny") {
    return { block: true, reason: decision.reasonCode };
  }

  if (decision.kind === "ask") {
    // interactive approval or deterministic block in headless mode
  }

  return;
});
```

### Important browser caveat

OMP documentation explicitly notes that some Eval browser bridge calls are **not AgentTool calls** and therefore do not emit the normal `tool_call` hook.

This is critical.

Therefore canonical role sessions must **not receive unrestricted raw Eval browser access**.

Preferred design:

```text
Agent
  ↓
itsm_browser
  ↓
PolicyEngine
  ↓
BrowserProvider
  ↓
OMP browser facade / CDP / Chromium
```

Same principle applies to any future host bridge that bypasses AgentTool interception.

---

## 17. Role permission matrix

Example baseline:

| Tool class | Orchestrator | PO | TL | DEV | QA | Release | Closure | Curator |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| repo read | yes | yes | yes | yes | yes | yes | yes | yes |
| code search/LSP read | yes | yes | yes | yes | yes | yes | limited | limited |
| product docs write | no | yes | limited | no | limited | no | status-only | limited |
| architecture write | no | no | yes | no | no | no | no | limited |
| source edit | no | no | no | yes | no | no | no | no |
| tests edit | no | no | limited | yes | limited | no | no | no |
| shell | no/limited | no | limited | yes | test-only | release-only | no | maintenance-only |
| browser | no | research-only | research-only | debug-optional | yes | smoke-only | no | no |
| deploy | no | no | no | no | no | yes | no | no |
| git mutation | no | no | limited | yes | limited | release | no | maintenance |

This is policy data, not prose.

---

## 18. Path ownership

Define explicit ownership rules.

Example:

```yaml
roles:
  po:
    write:
      - docs/product/**
      - handoffs/intake_evidence/**

  tech-lead:
    write:
      - docs/engineering/architecture.md
      - docs/engineering/research.md
      - decisions/**
      - sprints/*/sprint.md
      - sprints/*/tasks.md

  dev:
    write:
      - src/**
      - tests/**
      - package*.json
      - project runtime files
      - handoffs/dev_to_qa.md

  qa:
    write:
      - sprints/*/qa-*
      - sprints/*/uat.*
      - handoffs/qa_*

  closure:
    write:
      - docs/product/backlog.md
      - docs/product/acceptance.md
      - docs/engineering/state.md
      - sprints/*/closure-verification.md
```

### Cross-phase destructive-write guard

Retain current rule:

A phase may not destroy content owned by another phase unless a specific override exists.

---

## 19. Shell policy

Do not rely solely on model judgment.

Classifier:

```text
ALLOW
ASK
DENY
```

Examples:

```text
npm test                        ALLOW dev/qa
pytest                          ALLOW dev/qa
git status                      ALLOW most roles
git diff                        ALLOW most roles
git push                        ASK/release policy
rm -rf repo                     DENY
curl ... | sh                   ASK/DENY depending profile
kubectl delete                  ASK/DENY
terraform destroy               DENY by default
```

Add command AST/parsing later where beneficial.

---

## 20. Approval behavior

### Interactive

`ASK` opens an OMP/its-magic confirmation overlay.

### Headless

Default:

```text
ASK => DENY
```

unless an explicit signed/declared automation policy allows it.

Do not auto-approve simply because `AUTO_SOVEREIGN=1`.

---

# PART IV — SESSIONS, ROLES, SUBAGENTS

## 21. Session isolation levels

Support three levels.

### Level 1 — fresh session

```text
new OMP session
same process
same workspace
```

Default for low-risk read-heavy phases.

### Level 2 — fresh session + isolated workspace

```text
new OMP session
workspace isolation/worktree
```

Recommended for DEV variants.

### Level 3 — fresh OMP process + isolated workspace

```text
new `omp --mode rpc` process
new workspace/worktree
explicit capability manifest
process killed after phase
```

Recommended optional hard mode for:

- release;
- untrusted models;
- experimental local models;
- high-autonomy sessions;
- security-sensitive repos.

---

## 22. Runtime-generated isolation proof

Because the host itself creates the session/process, proof should be generated from runtime facts rather than agent prose.

Example:

```json
{
  "phase_run_id": "pr-01J...",
  "workflow_run_id": "auto-01J...",
  "phase": "execute",
  "role": "dev",
  "kernel": "omp",
  "kernel_version": "...",
  "session_id": "...",
  "process_id": 38112,
  "workspace_id": "wt-US0142-a",
  "parent_session_id": "...",
  "fresh_context": true,
  "model": "openai-codex/...",
  "policy_profile": "dev-v1",
  "started_at": "...",
  "proof_hash": "..."
}
```

The model never authors this record.

---

## 23. Role definitions

Use typed role manifests in its-magic core.

```ts
interface RoleDefinition {
  id: RoleId;
  objective: string;
  modelPolicy: ModelPolicy;
  permissions: PermissionProfileId;
  contextProfile: ContextProfileId;
  outputContract: OutputContract;
  canSpawn: RoleId[];
  isolation: IsolationProfile;
}
```

OMP custom agent definitions can be generated from this source or used as an adapter surface.

**Do not maintain two manually divergent role definitions.**

---

## 24. OMP `task` and subagent usage

OMP task/subagents are useful primitives but its-magic owns dispatch.

### Good uses

- scouts;
- parallel research;
- adversarial critics;
- DEV candidates;
- targeted reviewers;
- security reviews.

### Canonical phase rule

The workflow engine creates phase workers deliberately.

Do not ask the ambient orchestrator model to "remember to spawn" the correct role.

### `before_subagent_spawn`

Use OMP lifecycle interception to enforce:

- allowed target agent type;
- allowed model list;
- max concurrent agents;
- parent role;
- workspace policy;
- no hidden role substitution.

---

## 25. Agent Hub mapping

Map OMP subagents to its-magic metadata.

```ts
interface MagicAgentMetadata {
  agentId: string;
  phaseRunId?: string;
  storyId?: string;
  sprintId?: string;
  role: RoleId;
  workerKind: "phase" | "critic" | "scout" | "dev-candidate";
  workspaceId?: string;
  policyProfile: string;
}
```

Present this metadata in:

- Agent Hub transcript messages/status;
- dashboard;
- runtime event log.

---

# PART V — MODEL AND PROVIDER ROUTING

## 26. Provider/auth architecture

OMP acts as provider/auth transport.

its-magic acts as policy/router.

```text
role/phase request
     ↓
its-magic ModelRouter
     ↓
provider + model + effort
     ↓
OMP ModelRegistry/AuthStorage
     ↓
provider
```

### Supported classes

Design for:

- OpenAI Codex OAuth;
- OpenAI API;
- Anthropic OAuth/API;
- Gemini;
- OpenRouter;
- DeepSeek;
- Moonshot/Kimi;
- Z.AI / GLM;
- MiniMax;
- Qwen;
- GitHub Copilot;
- local Ollama;
- LM Studio;
- llama.cpp;
- vLLM;
- custom OpenAI-compatible endpoints.

### Auth rule

its-magic config references credential/provider identity.

Never copy raw tokens into repo artifacts.

---

## 27. Model selection precedence

Recommended precedence:

```text
CLI one-run override
  ↓
story override
  ↓
phase direct override
  ↓
role override
  ↓
role catalog preset
  ↓
MODEL_TIER policy
  ↓
default role model
```

Record the resolved result in runtime evidence.

### No silent provider fallback for canonical roles

Fallback must follow an explicit chain and be visible.

If a DEV phase requested Codex and falls back to a local model, the evidence should show that transition.

---

## 28. Cross-model critic

Retain current rule:

producer model and critic model should differ when available.

Resolver must prevent accidental same-slug collision unless degraded mode is explicitly allowed.

---

# PART VI — CODE INTELLIGENCE

## 29. OMP code intelligence baseline

OMP already gives us a strong baseline:

```text
filesystem search
LSP navigation
LSP references
symbols
hover
diagnostics
rename/code actions
AST-oriented tooling where enabled
Git context
```

This likely removes the need for AFT as a mandatory v1 dependency.

---

## 30. `CodeIntelligenceProvider` remains an interface

```ts
interface CodeIntelligenceProvider {
  search(query: CodeQuery): Promise<SearchHit[]>;
  symbol(ref: SymbolRef): Promise<SymbolInfo>;
  references(ref: SymbolRef): Promise<Location[]>;
  callers(ref: SymbolRef): Promise<Location[]>;
  outline(path: string): Promise<Outline>;
  diagnostics(scope?: Scope): Promise<Diagnostic[]>;
  context(task: TaskContextRequest): Promise<CodeContextPack>;
}
```

### v1 provider

```text
OmpCodeIntelligenceProvider
```

Use:

- OMP search;
- LSP;
- AST capabilities where available;
- Git history/diff;
- its-magic artifact links.

### v2 optional provider

```text
ItsIndexdProvider
```

Persistent Rust index for stronger Cursor-like semantic retrieval.

---

## 31. Cursor-like semantic indexing requirement

OMP search/LSP is excellent but does not automatically mean we have Cursor-equivalent semantic repo retrieval.

Therefore keep a separate benchmark.

Required queries:

```text
"where is session restore implemented?"
"what calls this retry logic?"
"which tests cover reconnect after restart?"
"what code and decisions would be affected by changing auth refresh?"
```

The system should return:

```text
implementation
callers
references
tests
related decisions
related stories
exact ranges
confidence/reason
```

If OMP baseline is insufficient, implement `its-indexd`.

---

## 32. `code_context(task)` fusion

This is a core differentiator.

```text
user task
  ↓
lexical search
  +
LSP symbols/references
  +
AST structure
  +
Git history/diff
  +
tests
  +
its-magic decisions/backlog/architecture
  +
sovereign memory
  ↓
rank + dedupe + budget
  ↓
bounded context pack
```

Output contains provenance for every snippet.

---

# PART VII — CONTEXT AND MEMORY

## 33. Context Engine

Inputs:

```text
phase
role
story
sprint
delivery mode
token profile
current task
recent deltas
code intelligence
required artifacts
sovereign memory
```

Output:

```text
PhaseContextPack
```

### Rule

Do not dump full backlog/vision/history into every prompt.

Progressive context only.

---

## 34. Memory layers

Preserve current conceptual layers:

### Hot

```text
handoffs/active-context.md
work/US-xxxx/pack.json
current phase evidence
```

### Warm

```text
current sprint
relevant decisions
architecture section
recent state
```

### Cold

```text
archives
historical sprints
old research
old decision details
```

### Institutional

```text
sovereign-memory
patterns
mistakes
plan drift
retrospectives
```

---

## 35. OMP memory policy

OMP has its own memory/session features.

Canonical rule:

```text
OMP memory must not be needed to reconstruct project state.
```

Options:

```text
canonical-role sessions: OMP long-term memory disabled
interactive /ask shell: optional local convenience memory
```

Any optional OMP memory is treated as a cache/hint only.

---

# PART VIII — APPLICATION RUNTIME AND BROWSER UAT

## 36. Application Runtime Manager

Preserve and expand current dev-environment capability.

```ts
interface RuntimeService {
  id: string;
  cwd: string;
  start: CommandSpec;
  stop?: CommandSpec;
  restart?: CommandSpec;
  rebuild?: CommandSpec;
  health?: HealthSpec;
  logs?: LogSpec;
  backend: "local" | "docker" | "ssh" | "custom";
}
```

### State

```text
stopped
starting
healthy
degraded
crashed
stopping
```

### Tools

```text
itsm_runtime_start
itsm_runtime_stop
itsm_runtime_restart
itsm_runtime_rebuild
itsm_runtime_health
itsm_runtime_logs
```

---

## 37. Browser provider

Define:

```ts
interface BrowserProvider {
  open(profile: BrowserProfile): Promise<BrowserSession>;
  navigate(...): Promise<void>;
  observe(...): Promise<BrowserObservation>;
  click(...): Promise<void>;
  fill(...): Promise<void>;
  screenshot(...): Promise<EvidenceRef>;
  console(...): Promise<ConsoleEvent[]>;
  network(...): Promise<NetworkEvent[]>;
  close(...): Promise<void>;
}
```

### v1 backend

```text
OmpBrowserProvider
```

Uses OMP Chromium/CDP/Electron/relay primitives internally.

---

## 38. Browser modes

### Isolated automation

Default for autonomous UAT.

```text
OMP-owned/headless Chromium
fresh profile
repeatable
CI friendly
```

### Authorized developer browser

Explicit opt-in.

```text
existing Chrome via relay/CDP
existing login session
operator-visible
high-trust only
```

### Electron

Useful for desktop app testing where supported.

---

## 39. UAT Planner

Acceptance criteria → executable probes.

Probe types:

```text
unit
integration
api
cli_smoke
process_health
browser_smoke
browser_flow
network_assertion
console_assertion
manual_operator
visual_review
```

### Browser evidence

Store:

```text
screenshots
console summary
network failures
URL/path
selected DOM/observation evidence
trace/ref if available
step timestamps
```

### Fail closed

No browser backend available:

```text
UAT_BROWSER_UNAVAILABLE
```

not PASS.

---

## 40. Exploratory → regression test promotion

After a browser flow passes reliably:

```text
exploratory QA
  ↓
record stable actions/assertions
  ↓
generate persistent e2e test
  ↓
commit test
  ↓
future QA runs it directly
```

Prefer Playwright-format generated tests if we want backend independence, even if exploration used OMP's browser facade.

---

# PART IX — LSP, DEBUGGING AND EDITING

## 41. LSP integration policy

Read-only LSP actions are encouraged in most technical roles.

Mutating LSP actions require role/path policy.

Example:

```text
lsp.references      read
lsp.definition      read
lsp.diagnostics     read
lsp.rename          write
lsp.code_actions    write
```

All writes must be auditable.

---

## 42. Editing strategy

Preferred hierarchy:

```text
structural/symbol-aware edit when appropriate
  ↓
precise patch/edit
  ↓
full file write only when necessary
```

Every edit records:

```text
before fingerprint
after fingerprint
path
role
phase
tool
reason/task
```

Reject stale preconditions when possible.

---

## 43. Runtime debugging

Where OMP supplies debugger/DAP capabilities in the active release, expose them through a `DebugProvider` interface rather than hard-coding directly into workflow.

```ts
interface DebugProvider {
  launch(...): Promise<DebugSession>;
  attach(...): Promise<DebugSession>;
  setBreakpoint(...): Promise<void>;
  stack(...): Promise<StackFrame[]>;
  variables(...): Promise<Variable[]>;
  stop(...): Promise<void>;
}
```

Use in bounded self-debug loops only.

Do not let autonomous debugging run without caps.

---

# PART X — WORKFLOW ENGINE

## 44. Canonical lifecycle graph

```text
intake
  ↓
discovery
  ↓
research?
  ↓
architecture
  ↓
sprint-plan
  ↓
plan-verify
  ↓
execute ↔ qa
  ↓
verify-work
  ↓
release
  ↓
closure
  ↓
refresh-context
```

Question marks depend on delivery policy.

---

## 45. `/auto`

The runtime, not the model, executes the orchestration loop.

Pseudo-code:

```ts
while (!terminal) {
  const work = portfolio.resolveNext();
  const phase = workflow.resolveNextPhase(work);
  const role = roleResolver.resolve(phase, config);

  gate.preflight(work, phase, role);

  const model = modelRouter.resolve({ work, phase, role });
  const context = contextEngine.build({ work, phase, role });
  const policy = policyEngine.profile({ phase, role });

  const session = await kernel.createSession({
    role,
    model,
    context,
    policy,
    isolation: isolationResolver.resolve(phase, role),
  });

  const result = await phaseRunner.run(session, phase);

  evidence.persistRuntimeFacts(result);
  validators.runPostPhase(phase);
  workflow.transition(result);
}
```

---

## 46. Stop matrix

Categories:

```text
security_hard
user_decision
validator_hard
runtime_hard
recoverable
soft
completed
```

Autonomy presets may relax only explicitly allowed categories.

Security-hard remains immutable.

---

## 47. Delivery modes

### standard

Full lifecycle.

### ultra_lean

Macro phases preserve quality invariants with fewer sessions.

### mega_quick

Small bounded work with minimal artifacts and mandatory tests.

### work-kind routing

Retain current classifier/policy concepts.

---

## 48. Pause/resume

State must survive:

- TUI exit;
- OMP crash;
- host reboot;
- phase worker crash.

Resume is reconstructed from repo artifacts + operational DB, then revalidated.

Never resume simply from the last chat turn.

---

# PART XI — SOVEREIGN RUNTIME

## 49. Decision ledger

Keep append-only autonomous decision record.

Add kernel/runtime metadata where useful:

```text
model
provider
phase_run_id
policy profile
tool evidence refs
```

---

## 50. Cross-model critic

Flow:

```text
producer phase
  ↓
fresh critic session
  ↓
Challenger
Architect
Subtractor
  ↓
blocking findings?
  ├─ no → continue
  └─ yes → bounded rework / decision / deferral
```

Use OMP subagents or separate sessions under host control.

---

## 51. Sovereign role reviews

Keep directed review graph.

Do not merge role review and generic critic into one opaque prompt.

---

## 52. Sovereign Memory

Keep repo-based memory substrate.

Injection is bounded by:

```text
recency
impact
role relevance
phase relevance
character/token budget
```

---

## 53. Parallel DEV arbitrage

OMP task isolation makes this especially attractive.

Flow:

```text
DEV candidate A ─ workspace A ─ model A
DEV candidate B ─ workspace B ─ model B
DEV candidate C ─ workspace C ─ model C
            \          |          /
             \         |         /
                 QA Arbiter
                     ↓
               winning patch
                     ↓
             integration owner
```

### Guardrails

- resource cap;
- candidate cap;
- workspace cleanup;
- same acceptance inputs;
- no candidates sharing writable workspace;
- deterministic scoring evidence.

---

## 54. Goal convergence

Convergence evaluator remains outside the LLM.

Example predicates:

```text
portfolio empty / target done
no blocking critic findings
tests green
UAT green
release evidence complete
no required deferrals
smoke green or valid surrogate
```

---

# PART XII — RELEASE, DEPLOY AND CLOSURE

## 55. Release

Release role consumes verified evidence.

It does not re-implement QA.

### Mandatory chain

```text
check-in tests
QA evidence
UAT evidence
isolation proof
runtime proof
doc integrity
release notes
publish policy
```

---

## 56. Deploy

Use pluggable target adapters:

```text
local
SSH
Docker
custom command
GitHub release
other target plugins
```

Secrets remain operator/runtime references.

---

## 57. Self-healing deploy

```text
deploy
  ↓
smoke
  ↓
fail?
  ├─ no → complete
  └─ yes → bounded diagnose/repair/redeploy
               ↓
             cap?
          yes → DEPLOY_DEFERRED
```

---

## 58. Closure

Keep closure a distinct phase.

```text
release artifacts verified
  ↓
closure session
  ↓
backlog OPEN → DONE
acceptance unchecked → checked
state checkpoint
closure-verification artifact
runtime proof
```

The OMP kernel must not blur release and closure responsibilities.

---

# PART XIII — PERSISTENCE AND OBSERVABILITY

## 59. State ownership

### Repo

Canonical project lifecycle state.

### Runtime DB (SQLite recommended)

Operational state only:

```text
active run ids
session/process ids
worker heartbeats
runtime services
TUI preferences
non-secret caches
usage metrics
pending UI notifications
```

### OMP store

Treat as kernel runtime storage.

Never make it the sole source of lifecycle truth.

---

## 60. Crash recovery

On startup:

1. read project state;
2. read runtime DB;
3. inspect orphan OMP sessions/processes;
4. inspect workspaces/worktrees;
5. validate current phase evidence;
6. classify interrupted run;
7. offer deterministic resume/recover/abort choices.

---

## 61. Observability schema

Every phase should log:

```text
workflow_run_id
phase_run_id
story_id
sprint_id
phase
role
kernel
kernel_version
session_id
process_id
workspace_id
provider
model
thinking/effort
input tokens
output tokens
cache tokens
cost
duration
tools used
tools blocked
files read
files changed
index queries
validators
retries
stop reason
```

---

# PART XIV — CLI, TUI, RPC, ACP

## 62. CLI commands

Recommended top-level CLI:

```bash
its-magic
its-magic init
its-magic doctor
its-magic login
its-magic models
its-magic status
its-magic run /auto
its-magic run /qa
its-magic resume
its-magic daemon
its-magic worker
its-magic ui
```

Interactive `its-magic` starts branded OMP TUI host.

---

## 63. Slash commands

Keep user concepts stable:

```text
/intake
/ask
/auto
/quick
/research
/architecture
/sprint-plan
/plan-verify
/execute
/qa
/verify-work
/release
/closure
/pause
/resume
/refresh-context
/memory-audit
/security-review
```

In standalone, slash commands call runtime actions rather than being long prompt files.

---

## 64. ACP/editor clients

Later:

```text
VS Code/Cursor/other ACP-capable editor
        ↓
its-magic / OMP ACP adapter
        ↓
same workflow runtime
```

Editor is a client, not the orchestration engine.

---

## 65. Remote/mobile future

Use a daemon/control API:

```text
its-magic daemon
  ├── event stream
  ├── run control
  ├── approvals
  ├── agent roster
  ├── logs
  └── artifact queries
```

Then build:

- web client;
- Android client;
- notification bridge;
- smartwatch approvals/status.

This is easier if TUI is already only a client of the same core event model.

---

# PART XV — CONFIGURATION

## 66. Typed config

Move away from parsing operational policy from free-form Markdown scratchpad.

Proposed:

```text
.its-magic/
├── config.yml
├── roles.yml
├── models.yml
├── permissions.yml
├── runtime.yml
├── browsers.yml
└── local.yml          # gitignored
```

Legacy scratchpad remains supported through a migration/compatibility adapter.

---

## 67. Config precedence

```text
CLI override
  ↓
local config
  ↓
project config
  ↓
story/work-item override
  ↓
framework defaults
```

All resolved config should be inspectable in TUI.

---

## 68. Example model config

```yaml
models:
  roles:
    po:
      provider: anthropic
      model: claude-...
    tech-lead:
      provider: openai-codex
      model: ...
    dev:
      provider: openai-codex
      model: ...
    qa:
      provider: google
      model: ...
    critic:
      provider: zai
      model: ...

  fallback:
    dev: []
    qa:
      - provider: openrouter
        model: ...
```

No secrets in this file.

---

# PART XVI — REPOSITORY LAYOUT

## 69. Recommended standalone repo

```text
its-magic-agent/
│
├── apps/
│   ├── cli/
│   ├── daemon/
│   └── worker/
│
├── packages/
│   ├── core/
│   │   ├── workflow/
│   │   ├── roles/
│   │   ├── policy/
│   │   ├── evidence/
│   │   ├── context/
│   │   ├── config/
│   │   ├── portfolio/
│   │   └── observability/
│   │
│   ├── agent-kernel/
│   │   ├── interface/
│   │   └── contracts/
│   │
│   ├── omp-adapter/
│   │   ├── sessions/
│   │   ├── auth/
│   │   ├── models/
│   │   ├── events/
│   │   ├── tools/
│   │   └── rpc/
│   │
│   ├── omp-extension/
│   │   ├── extension.ts
│   │   ├── policy-hooks/
│   │   ├── commands/
│   │   ├── tool-renderers/
│   │   └── tui/
│   │       ├── dashboard/
│   │       ├── phases/
│   │       ├── decisions/
│   │       ├── runtime/
│   │       ├── uat/
│   │       ├── context/
│   │       └── evidence/
│   │
│   ├── tool-broker/
│   ├── code-intelligence/
│   │   ├── interface/
│   │   ├── omp-provider/
│   │   └── its-indexd-provider/
│   │
│   ├── browser/
│   │   ├── interface/
│   │   └── omp-provider/
│   │
│   ├── runtime-services/
│   ├── git-workspaces/
│   ├── validators-bridge/
│   ├── control-protocol/
│   └── migration/
│
├── python-kernel/
│   └── existing validated scripts during transition
│
├── config/
│   ├── defaults/
│   └── schemas/
│
├── tests/
│   ├── contracts/
│   ├── integration/
│   ├── e2e/
│   ├── security/
│   ├── tui/
│   └── fixtures/
│
└── docs/
    ├── architecture/
    ├── runbook/
    └── migration/
```

---

# PART XVII — MIGRATION OF CURRENT ITS-MAGIC FEATURES

## 70. Migration principle

Classify every existing capability as:

```text
KERNEL
RUNTIME
TUI
COMPATIBILITY
DEPRECATED-HOST-SPECIFIC
```

### KERNEL

Keep current Python/runtime logic initially:

- validators;
- reason-code definitions;
- evidence schemas;
- artifact parsers;
- reconciliation logic;
- convergence logic where stable.

### RUNTIME

Move into TypeScript core gradually:

- phase graph;
- role resolver;
- session lifecycle;
- model routing;
- ToolBroker;
- PolicyEngine;
- runtime services;
- browser orchestration.

### TUI

New OMP extension surfaces.

### COMPATIBILITY

- Cursor host pack;
- OpenCode host pack;
- scratchpad parser;
- existing installer support.

### DEPRECATED-HOST-SPECIFIC

Eventually remove from standalone core:

- Cursor-specific Task chain mechanics;
- Cursor-browser primary assumptions;
- host-specific permission syntax;
- template parity that exists solely because of duplicated host command files.

---

## 71. Existing feature mapping

| Existing feature | Standalone OMP implementation |
|---|---|
| `/auto` | WorkflowEngine loop |
| phase-role enforcement | RoleResolver + preflight gate |
| isolation proof | runtime-generated OMP session/process proof |
| model routing | ModelRouter → OMP ModelRegistry |
| browser UAT | UAT Engine → OmpBrowserProvider |
| dev env launch | RuntimeServiceManager |
| Cursor browser evidence | provider-neutral browser evidence |
| subagents | its-magic dispatch → OMP sessions/tasks |
| parallel DEV | OMP isolation/workspaces + Git integration |
| `/ask` | read-only ContextEngine session |
| sovereign critic | fresh critic OMP session |
| sovereign memory | repo artifacts + ContextEngine |
| decision ledger | unchanged schema initially |
| self-healing deploy | DeployEngine |
| closure | dedicated phase runner |
| status/reason codes | TUI + runtime events |
| token profiles | ContextEngine budgets |
| delivery modes | WorkflowPlanResolver |
| installer | new standalone bootstrap + compatibility packs |

---

# PART XVIII — IMPLEMENTATION ROADMAP

## 72. Phase 0 — OMP proof spike

Goal: prove OMP is a safe kernel before committing architecture.

Deliver:

```text
minimal repo
OmpKernelAdapter
one PO session
one DEV session
policy hook
Codex OAuth test
second provider test
basic TUI extension
Agent Hub test
LSP test
browser test
```

### Exit criteria

All hard proof tests in section 86 pass.

---

## 73. Phase 1 — Runtime skeleton + policy

Build:

- WorkflowEngine interfaces;
- RoleResolver;
- ConfigResolver;
- ToolBroker;
- PolicyEngine;
- OMP tool interception;
- audit log;
- Python validator bridge;
- runtime proof generator.

TUI:

- its-magic status line segment;
- current story/phase widget;
- `/magic` dashboard skeleton.

---

## 74. Phase 2 — Context + code intelligence

Build:

- artifact parser;
- hot/warm/cold context tiers;
- OMP LSP/search provider;
- `code_context`;
- context evidence;
- Context Inspector TUI.

Benchmark against Cursor.

Decision point: whether `its-indexd` is necessary.

---

## 75. Phase 3 — canonical lifecycle

Implement:

```text
intake
research/discovery
architecture
sprint-plan
plan-verify
execute
qa
verify-work
release
closure
refresh-context
```

Use real fresh sessions.

No full autonomy yet until individual transitions are proven.

---

## 76. Phase 4 — runtime app control + browser UAT

Implement:

- runtime profiles;
- service manager;
- health/logs;
- bounded retry;
- OMP browser backend;
- UAT planner;
- screenshots/console/network evidence;
- Runtime TUI view;
- UAT TUI view.

---

## 77. Phase 5 — provider/model productization

Implement:

- login UX;
- model browser;
- per-role model config;
- OAuth health/status;
- fallback policy;
- cost/usage display;
- TUI model selector.

---

## 78. Phase 6 — `/auto`, delivery modes and autonomy

Implement:

- standard `/auto`;
- stop matrix;
- decision gates;
- resume;
- backlog drain;
- bug targeting;
- delivery modes;
- autonomy presets;
- TUI phase timeline and blockers.

---

## 79. Phase 7 — sovereign parity

Implement:

- critic;
- role behavior manifest;
- Sovereign Memory injection;
- deferrals;
- convergence;
- decision ledger;
- plan fidelity.

---

## 80. Phase 8 — parallel DEV and self-healing

Implement:

- candidate spawning;
- isolated workspaces;
- arbiter;
- merge/integration owner;
- deploy smoke;
- bounded self-healing deploy.

Use Agent Hub heavily here.

---

## 81. Phase 9 — product-grade TUI

Polish:

- dashboard;
- theme family;
- keybinding profile;
- evidence inspector;
- decision overlays;
- context inspector;
- UAT view;
- runtime view;
- cost/usage;
- mouse support where useful;
- snapshot/golden TUI tests.

---

## 82. Phase 10 — daemon, remote and editor control

Implement:

- control protocol;
- daemon;
- OMP RPC workers;
- ACP/editor path;
- future web/mobile client API.

---

# PART XIX — IMPLEMENTATION STORIES

## 83. Suggested first backlog

### Story 1 — OMP kernel proof spike

Prove SDK/TUI/RPC/auth/event basics.

### Story 2 — its-magic OMP extension shell

Status line, commands, policy hook, custom tool renderer.

### Story 3 — AgentKernel abstraction + OmpKernelAdapter

No business code imports OMP directly outside adapter package.

### Story 4 — typed config + scratchpad compatibility

### Story 5 — RoleResolver and phase-session isolation

### Story 6 — ToolBroker + PolicyEngine

### Story 7 — runtime attestation + evidence bridge

### Story 8 — Python validator bridge

### Story 9 — OMP LSP/search CodeIntelligenceProvider

### Story 10 — ContextEngine + Context Inspector

### Story 11 — standard lifecycle engine

### Story 12 — runtime service manager

### Story 13 — browser/UAT provider and evidence

### Story 14 — model/auth router + Codex OAuth UX

### Story 15 — `/auto` + stop matrix + resume

### Story 16 — branded TUI dashboard + phase timeline

### Story 17 — delivery modes + work-kind routing

### Story 18 — sovereign critic + memory + convergence

### Story 19 — parallel DEV workspaces + QA arbiter

### Story 20 — self-healing deploy + closure

### Story 21 — daemon/RPC worker mode

### Story 22 — ACP/editor client integration

### Story 23 — optional semantic `its-indexd`

---

# PART XX — HARD PROOF TESTS

## 84. Why these are mandatory

Do not decide architecture from documentation alone.

The spike must prove the capabilities we actually require.

---

## 85. OMP/TUI proof tests

### T1 — branded extension loads in interactive TUI

Pass if:

- custom command appears;
- status segment renders;
- custom overlay opens/closes;
- no fork required.

### T2 — custom tool cards render correctly

### T3 — theme can be applied without patching OMP core

### T4 — lifecycle dashboard can render as custom component

### T5 — Agent Hub remains usable with its-magic subagents

### T6 — keyboard remapping works through supported mechanism

### T7 — TUI close/restart does not lose workflow state

---

## 86. Kernel hard proof tests

### K1 — fresh PO/DEV sessions

PO and DEV must have distinct session IDs and no accidental transcript inheritance.

### K2 — multi-provider same run

PO and DEV use different providers/models.

### K3 — Codex OAuth

DEV successfully runs through stored OpenAI Codex OAuth credentials.

### K4 — PO source write denied

Model attempts source edit; host blocks before mutation.

### K5 — orchestrator mutation denied

Orchestrator cannot write source code.

### K6 — policy hook fail-closed

Throw inside authorization handler; tool must be blocked.

### K7 — raw browser bypass neutralized

Canonical role cannot use an un-intercepted browser Eval path to bypass `itsm_browser` policy.

### K8 — LSP references/diagnostics

Feature-level query returns useful symbols/references and diagnostics.

### K9 — mutating LSP respects permission

QA cannot perform rename if policy forbids writes.

### K10 — browser UAT

Start app, open browser, interact, capture screenshot/console/network evidence.

### K11 — workspace isolation

Two DEV candidates cannot see or overwrite each other's unmerged edits.

### K12 — process isolation

RPC-mode phase process can be killed without corrupting workflow state.

### K13 — validator failure stops workflow

Force existing its-magic validator failure; no transition occurs.

### K14 — resume after host restart

Kill runtime mid-phase; restart and recover deterministic next action.

### K15 — Agent Hub observation

Subagent activity is visible and operator steering is audited.

---

# PART XXI — TESTING STRATEGY

## 87. Unit tests

Cover:

- role resolution;
- config precedence;
- policy decisions;
- path ownership;
- phase graph;
- stop matrix;
- context budgeting;
- model selection;
- evidence schemas.

---

## 88. Kernel contract tests

Run the same suite against every `AgentKernel` implementation.

Eventually:

```text
OmpKernelAdapter
PiKernelAdapter
MockKernel
```

---

## 89. OMP adapter contract tests

Pin exact expected behavior for:

- SDK construction;
- events;
- tool interception;
- model selection;
- abort/close;
- auth storage;
- TUI extension APIs used by us.

These tests are the upgrade shield.

---

## 90. TUI tests

Use component-level and snapshot/golden tests where practical.

Test terminal widths:

```text
80
100
120
160
```

Test:

- Unicode;
- ASCII fallback;
- Nerd symbols;
- no-color/limited-color behavior;
- long story/model names;
- narrow terminal;
- resize;
- overlay cancellation;
- keyboard navigation.

---

## 91. Integration fixtures

Maintain sample projects:

```text
node-web
python-api
dotnet-web
go-cli
rust-cli
monorepo
docker-compose
```

---

## 92. Browser E2E

Fixture app with deterministic flows.

Verify:

- start;
- browser attach;
- form interaction;
- console failure detection;
- network failure detection;
- screenshot evidence;
- UAT verdict.

---

## 93. Security tests

Include malicious-agent scenarios:

```text
ignore role prompt and edit src
read .env
run forbidden shell
spawn forbidden role
use raw browser path
publish release
push git
write outside workspace
```

Expected result: policy blocks regardless of model compliance.

---

# PART XXII — DEFINITION OF DONE

## 94. Standalone OMP v1 DoD

A release is v1-ready only when all are true:

- [ ] `its-magic` launches an interactive branded OMP-based TUI.
- [ ] OMP is isolated behind `AgentKernel` outside adapter/extension packages.
- [ ] Codex OAuth works.
- [ ] At least three distinct provider families work.
- [ ] per-role model routing works.
- [ ] fresh phase sessions are host-created and evidenced.
- [ ] orchestrator cannot edit production code.
- [ ] PO cannot edit production code.
- [ ] ToolBroker/PolicyEngine blocks mutations before execution.
- [ ] raw browser policy bypass is closed.
- [ ] existing Python validators can gate workflow.
- [ ] standard lifecycle works end-to-end.
- [ ] pause/resume works after process restart.
- [ ] code intelligence returns symbols/references/diagnostics.
- [ ] app runtime launches and health-checks a fixture.
- [ ] browser UAT runs autonomously with evidence.
- [ ] release gate consumes QA/UAT evidence.
- [ ] closure is separate and verified.
- [ ] dashboard, phase timeline, runtime and UAT views exist.
- [ ] Agent Hub shows its-magic subagents.
- [ ] TUI is not required for headless correctness.

---

## 95. Current-framework parity milestone DoD

Later parity milestone additionally requires:

- [ ] delivery modes;
- [ ] full autonomy;
- [ ] bug queue targeting;
- [ ] decision ledger;
- [ ] cross-model critic;
- [ ] sovereign memory;
- [ ] role manifest reviews;
- [ ] goal convergence;
- [ ] parallel DEV arbitrage;
- [ ] self-healing deploy;
- [ ] multi-target release;
- [ ] remote runtime targeting;
- [ ] work-kind routing;
- [ ] token/context profiles;
- [ ] README/release integrity;
- [ ] memory drift audit;
- [ ] compatibility pack for existing Cursor/OpenCode users.

---

# PART XXIII — RISKS

## 96. OMP upstream churn

Risk:

OMP evolves rapidly; public APIs may move.

Mitigation:

```text
pin exact version
adapter boundary
contract tests
upgrade branch
no OMP imports in core
```

---

## 97. OMP overlap with its-magic

Risk:

Duplicate planning/memory/agents create inconsistent state.

Mitigation:

Maintain the disposition table: USE / WRAP / DISABLE / IGNORE.

---

## 98. TUI coupling

Risk:

We build too deeply against OMP internals.

Mitigation:

Use public extension/TUI APIs first.

Only fork TUI if a clearly measured missing capability justifies it.

---

## 99. Browser policy bypass

Risk:

Some Eval bridge calls bypass normal AgentTool hook interception.

Mitigation:

Disable raw browser Eval access in canonical sessions and expose controlled `itsm_browser` only.

This is a mandatory spike test.

---

## 100. Hidden model/provider fallback

Risk:

The actual model differs from planned model.

Mitigation:

Explicit fallback chains and evidence recording; fail closed for roles configured as strict.

---

## 101. Agent Hub vs canonical lifecycle confusion

Risk:

Human manually steers/kills agents and workflow loses determinism.

Mitigation:

Every manual steering/control action emits audit evidence and causes required revalidation.

---

## 102. Too much UI too early

Risk:

Time spent polishing TUI before workflow core is reliable.

Mitigation:

Build TUI incrementally:

```text
status
→ dashboard
→ phase timeline
→ decision gate
→ runtime/UAT
→ polish
```

---

# PART XXIV — DECISIONS TO LOCK DURING ARCHITECTURE

## 103. Recommended decisions

### D1

OMP is default AgentKernel; Pi remains future/fallback adapter.

### D2

its-magic core owns workflow, memory, policy, evidence and gates.

### D3

OMP native TUI is the v1 rendering shell.

### D4

No OMP fork in v1 unless public TUI APIs fail a required proof test.

### D5

All canonical mutating operations must pass PolicyEngine.

### D6

Raw OMP browser Eval facade is not exposed to canonical agents.

### D7

OMP long-term memory is non-canonical/disabled for phase workers.

### D8

Phase isolation levels are configurable but fresh session is mandatory.

### D9

Existing Python validators remain authoritative during migration.

### D10

Code intelligence starts with OMP LSP/search; semantic index daemon is benchmark-triggered.

### D11

TUI and headless use the same workflow core/event model.

### D12

Manual TUI intervention is auditable workflow input.

---

# PART XXV — RESEARCH QUESTIONS BEFORE FINAL ARCHITECTURE LOCK

## 104. OMP SDK

Verify exact public APIs needed for:

- custom agent session construction;
- session isolation;
- disabling unwanted tools/features;
- model selection;
- event subscription;
- auth access;
- process cleanup.

## 105. TUI

Verify without fork:

- persistent compact widget;
- full-screen dashboard;
- overlays;
- custom tool cards;
- status-line custom segments/status entries;
- Agent Hub metadata decoration options;
- theme packaging;
- extension hotkeys.

## 106. Subagents

Verify:

- programmatic spawn outside model-issued `task`;
- exact fresh context semantics;
- workspace isolation behavior on Windows/Linux;
- worktree/patch merge semantics;
- subagent event metadata.

## 107. Browser

Verify:

- supported headless evidence APIs;
- screenshot path handling;
- console/network event extraction;
- Electron support for our needs;
- safe disabling of raw Eval browser access.

## 108. LSP

Benchmark:

- TypeScript;
- Python;
- C#;
- Go;
- Rust.

## 109. Windows/Bun

Because local development often happens on Windows, run explicit Windows proof fixtures for:

- Bun runtime;
- process spawning;
- terminal rendering;
- workspaces;
- paths;
- browser/CDP;
- OMP package upgrades.

---

# PART XXVI — TUI PRODUCT MILESTONES

## 110. TUI M0 — branded shell

```text
its-magic status
current phase
role
model
simple /magic dashboard
```

## 111. TUI M1 — workflow cockpit

```text
phase timeline
blockers
decisions
run controls
```

## 112. TUI M2 — engineering cockpit

```text
runtime services
logs
code context
QA/UAT
```

## 113. TUI M3 — sovereign cockpit

```text
Agent Hub integration
critic findings
parallel DEV candidates
convergence
usage/cost
```

## 114. TUI M4 — remote control parity

Structured control protocol allows a future web/mobile UI to offer the same core actions.

---

# PART XXVII — EXAMPLE END-TO-END EXPERIENCE

## 115. Start

```bash
cd my-project
its-magic
```

TUI:

```text
its-magic detected
project: my-project
framework state: healthy
OMP kernel: 2026.x
index: ready
runtime: stopped

> Add recurring billing with Stripe
```

### Intake

PO session starts using configured model.

Dashboard:

```text
● INTAKE · PO · Claude
questions 5/8
```

Decision dialog appears if needed.

### Architecture

Fresh TL session.

Context Inspector shows only relevant artifacts/code.

### Execute

Fresh DEV session with Codex OAuth.

Tool cards show edits/tests.

Runtime auto-relaunches.

### QA

Fresh QA session.

App starts.

Browser UAT drives the UI.

UAT dashboard turns green.

### Release

Release role checks deterministic evidence.

### Closure

Dedicated closure phase marks canonical product state.

### Finish

Dashboard:

```text
US-0142 DONE
release R0142
QA PASS
UAT 10/10
smoke PASS
cost €...
next: portfolio empty
```

---

# PART XXVIII — SOURCE REFERENCES

## 116. OMP documentation verified for this plan

Primary repository/docs:

- https://github.com/can1357/oh-my-pi
- https://github.com/can1357/oh-my-pi/blob/main/README.md
- https://github.com/can1357/oh-my-pi/blob/main/docs/sdk.md
- https://github.com/can1357/oh-my-pi/blob/main/docs/rpc.md
- https://github.com/can1357/oh-my-pi/blob/main/docs/tui.md
- https://github.com/can1357/oh-my-pi/blob/main/docs/theme.md
- https://github.com/can1357/oh-my-pi/blob/main/docs/keybindings.md
- https://github.com/can1357/oh-my-pi/blob/main/docs/extensions.md
- https://github.com/can1357/oh-my-pi/blob/main/docs/hooks.md
- https://github.com/can1357/oh-my-pi/blob/main/docs/agent-hub.md
- https://github.com/can1357/oh-my-pi/blob/main/docs/tools/task.md
- https://github.com/can1357/oh-my-pi/blob/main/docs/tools/lsp.md
- https://github.com/can1357/oh-my-pi/blob/main/docs/tools/browser.md
- https://github.com/can1357/oh-my-pi/blob/main/docs/providers.md

Current its-magic source basis for migration planning:

- `vision.md`
- `backlog.md`
- `acceptance.md`
- existing Pi standalone masterplan as architecture reference

---

# 117. Final recommendation

For the standalone product, OMP currently looks like the strongest default kernel candidate because it already supplies much of the infrastructure we want **without requiring us to surrender the actual its-magic operating model**.

The especially strong combination is:

```text
its-magic Core
├── deterministic workflow
├── role/permission policy
├── artifact memory
├── evidence/gates
├── context intelligence
├── UAT semantics
├── sovereign loops
└── control protocol

OMP
├── model/provider/auth
├── agent loop
├── sessions
├── subagents
├── LSP
├── browser primitives
├── workspace isolation
├── SDK/RPC/ACP
└── excellent TUI
```

The TUI should be treated as a competitive advantage of this version.

Recommended product position:

> **its-magic powered by OMP — autonomous AI software team with a transparent terminal cockpit, deterministic workflow and code-enforced control.**

The next implementation action should be the **Phase 0 OMP proof spike**, with the TUI, policy interception, Codex OAuth, LSP, browser, Agent Hub and isolation tests all treated as architecture gates rather than optional experiments.
