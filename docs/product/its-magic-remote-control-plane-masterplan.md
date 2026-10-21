# its-magic Remote Control Plane — Masterplan

> **Working title:** `its-magic-remote` / **MagicLink**
>
> **Goal:** Build a separate repository that turns `its-magic` into a remotely controllable, persistent, multi-repository autonomous development system. Coding agents continue running independently of any chat/TUI/app connection. A Windows laptop, browser, Android device, and later a Wear OS smartwatch become clients of the same control plane.
>
> **Architecture principle:** The UI is disposable. The runtime is persistent. The repository remains the source of truth.

---

# 0. Executive decision

Build a **separate product/repository** for remote control:

```text
its-magic core/runtime repo
    = workflow
    + agents
    + artifact memory
    + policy
    + gates
    + autonomy
    + OMP/Pi/OpenCode AgentKernel

its-magic-remote repo
    = control plane
    + node/runner connectivity
    + remote API
    + event stream
    + command routing
    + notifications
    + web/desktop/mobile/watch clients
```

The relationship must remain:

```text
                        its-magic core
                              │
                     Runtime Control Port
                              │
                              ▼
                       its-magic-node
                              │
                    outbound secure link
                              │
                              ▼
                      its-magic Hub
                              │
             ┌────────────────┼─────────────────┐
             │                │                 │
             ▼                ▼                 ▼
          Web/PWA        Windows App        Android App
                                                   │
                                                   ▼
                                             Wear OS later
```

The remote product **must not become another orchestration engine**.

`its-magic` remains authoritative for:

- workflow phases;
- story/bug lifecycle;
- phase→role resolution;
- model routing;
- permissions;
- validators;
- decision gates;
- browser UAT;
- release/closure;
- Sovereign Loop;
- convergence;
- artifact memory;
- runtime proofs.

`its-magic-remote` owns:

- discovery of active runtimes;
- remote connectivity;
- dashboards;
- durable event ingestion;
- remote command submission;
- notifications;
- device authentication;
- remote user experience.

---

# 1. Product statement

## 1.1 One-sentence product

**its-magic Remote is a secure control plane for autonomous software-development agents: see every active repository, inspect progress, ask questions, enqueue work, steer running agents, resolve blockers and decisions, and receive notifications from any device without keeping the original chat open.**

## 1.2 Target user experience

From the phone:

```text
its-magic

Active Projects
────────────────────────────────────────────

● finance-analytics
  US-0214 · BUILD+VERIFY
  DEV · Codex
  Tests 112/112
  14m active
  No blockers

● forest-guardian
  BUG-0063 · QA
  QA · Claude
  ⚠ Decision required

○ assistant-core
  Idle
  3 OPEN stories
```

Tap a repository:

```text
forest-guardian / BUG-0063

Phase
  spec ✓
  plan ✓
  build ✓
  qa ●
  verify ○
  release ○
  closure ○

Agents
  QA-1        running       Claude
  Browser-UAT running       chromium

Current activity
  Testing reconnect after websocket timeout

Evidence
  Tests:   184/184
  Browser: 7/9
  Console: 0 errors

[ Ask ] [ Instruct ] [ Pause ] [ More ]
```

A blocker notification:

```text
its-magic · forest-guardian

Decision required
BUG-0063

Database migration changes an existing
production column.

Recommended:
Create additive column + backfill.

[Approve]
[Alternative]
[Open]
```

A completion notification:

```text
✓ finance-analytics
US-0214 completed

QA PASS
UAT 10/10
Release PASS
Closure PASS

Duration: 42m
Cost: €1.84
```

---

# 2. Non-negotiable architecture rules

## 2.1 Chat is not the runtime

Closing:

- terminal;
- TUI;
- browser;
- Android app;
- Windows client;
- SSH session;
- websocket connection;

must **not** terminate an autonomous run.

The execution owner is a daemon/service.

```text
Bad:

Phone/Web/TUI
     │
     owns process
     │
   Agent

Good:

Phone/Web/TUI
     │
     controls
     ▼
Control Plane
     │
     controls
     ▼
Node Daemon
     │
     owns
     ▼
Runtime + Agent processes
```

---

## 2.2 Repository is still canonical memory

Remote state is an operational projection.

Canonical project truth remains in:

```text
repo/
├── docs/product/
├── docs/engineering/
├── decisions/
├── handoffs/
├── sprints/
├── work/
└── source code
```

The Control Plane may cache/index:

- current story;
- current phase;
- run state;
- active agents;
- blockers;
- decisions;
- summaries;
- event history;

but must never silently replace repository artifacts as the workflow source of truth.

---

## 2.3 Runtime must survive Control Plane loss

If the central Hub becomes unavailable:

```text
Node
 ├─ keeps running workflow
 ├─ persists local events
 ├─ continues according to autonomy policy
 ├─ queues outbound notifications/events
 └─ resynchronizes after reconnect
```

This prevents:

```text
internet outage
      ↓
agent dies
```

The system should instead produce:

```text
internet outage
      ↓
remote visibility temporarily offline
      ↓
agent continues locally
      ↓
event backlog syncs after reconnect
```

---

## 2.4 Remote clients never talk directly to OMP/Pi/OpenCode

Do not expose:

```text
OMP RPC
Pi RPC
OpenCode :4096
```

to the public network.

Instead:

```text
Remote client
      ↓
its-magic Hub API
      ↓
MagicLink
      ↓
its-magic-node
      ↓
its-magic Runtime Control Port
      ↓
AgentKernel
      ├─ OMP
      ├─ Pi
      └─ OpenCode
```

This keeps:

- security;
- workflow semantics;
- permissions;
- compatibility;
- future kernels;

behind one stable abstraction.

---

# 3. Repository strategy

## 3.1 Separate repository

Recommended repository:

```text
its-magic-remote/
```

Alternative product names:

```text
its-magic-hub
its-magic-control
its-magic-remote
magiclink
```

Recommended internal naming:

```text
Product/repo     its-magic-remote
Control server   its-magic-hub
Machine daemon   its-magic-node
Protocol         MagicLink
Client SDK       magiclink-client
```

---

## 3.2 Core its-magic repo remains independent

The core repository should only expose one generic integration boundary:

```text
RuntimeControlPort
```

Example:

```ts
interface RuntimeControlPort {
  getRuntimeInfo(): Promise<RuntimeInfo>;
  listRepos(): Promise<RepoSummary[]>;
  getRepo(repoId: string): Promise<RepoState>;
  listRuns(repoId: string): Promise<RunSummary[]>;
  getRun(runId: string): Promise<RunState>;
  submitCommand(command: RuntimeCommand): Promise<CommandReceipt>;
  subscribe(handler: (event: RuntimeEvent) => void): Unsubscribe;
}
```

No Android/Web/FCM code belongs in the core repo.

---

# 4. Target architecture

```text
┌────────────────────────────────────────────────────────────────────┐
│                       Remote Clients                               │
│                                                                    │
│  Web/PWA        Windows App        Android App       Wear OS       │
│      │               │                  │               │          │
└──────┼───────────────┼──────────────────┼───────────────┼──────────┘
       │               │                  │               │
       └──────────── HTTPS / WebSocket / Push ────────────┘
                               │
                               ▼
┌────────────────────────────────────────────────────────────────────┐
│                       its-magic Hub                                │
│                                                                    │
│ API Gateway                                                        │
│ Auth / Devices                                                     │
│ Repo Registry                                                      │
│ Run Projection                                                     │
│ Command Router                                                     │
│ Event Store                                                        │
│ Notification Engine                                                │
│ Capability Registry                                                │
│ Audit Log                                                          │
│ Optional Voice Command Gateway                                     │
└──────────────────────────────┬─────────────────────────────────────┘
                               │
                        MagicLink WSS
                               │
                 outbound connection from nodes
                               │
             ┌─────────────────┼─────────────────┐
             ▼                 ▼                 ▼
       Windows Node       Linux Node        Future Node
             │                 │
      its-magic-node      its-magic-node
             │                 │
     ┌───────┴───────┐   ┌─────┴──────┐
     ▼               ▼   ▼            ▼
 Repo A            Repo B Repo C      Repo D
 Runtime           Runtime Runtime    Runtime
   │                 │      │           │
  OMP                Pi   OpenCode      OMP
```

---

# 5. Three-layer runtime model

## Layer A — Agent kernel

Examples:

```text
OMP
Pi
OpenCode
future kernels
```

Responsibilities:

- LLM provider;
- session;
- streaming;
- tools;
- agent loop.

---

## Layer B — its-magic runtime

Responsibilities:

- `/auto`;
- workflow;
- roles;
- permissions;
- context;
- artifact memory;
- quality gates;
- browser UAT;
- runtime proof;
- release;
- closure;
- Sovereign Loop.

This layer is authoritative.

---

## Layer C — Remote Control Plane

Responsibilities:

- visibility;
- remote instructions;
- notifications;
- multi-repo dashboard;
- devices;
- durable remote control.

It never directly decides whether a release gate passes.

---

# 6. its-magic-node

`its-magic-node` is the most important new component.

## 6.1 Purpose

One persistent daemon per development machine.

Example:

```text
Windows laptop
└── its-magic-node
    ├── repo registry
    ├── runtime supervisor
    ├── event journal
    ├── command inbox
    ├── MagicLink client
    └── runtime adapters
```

---

## 6.2 Responsibilities

The node must:

- discover configured repositories;
- start/stop runtime processes;
- own child process lifetimes;
- reconnect to agents;
- stream events;
- queue remote commands;
- persist state;
- survive UI disconnect;
- recover after process restart;
- report machine health;
- resynchronize after network loss.

---

## 6.3 Service installation

Target:

```bash
its-magic-node install
its-magic-node start
its-magic-node status
its-magic-node stop
its-magic-node uninstall
```

Platform mapping:

```text
Windows  → Windows Service or resilient user daemon
Linux    → systemd service
macOS    → launchd later
```

---

## 6.4 Node local state

```text
~/.its-magic-node/
├── node.yml
├── identity/
├── repos.json
├── journal/
├── commands/
├── cache/
└── logs/
```

Never copy repository secrets into the node metadata store.

---

# 7. True persistence

## 7.1 Runtime supervisor

A run has a supervisor independent from the UI.

```text
RunSupervisor
├── run id
├── repo id
├── runtime pid
├── active phase
├── active AgentKernel session
├── local command queue
├── current autonomy policy
├── heartbeat
└── recovery metadata
```

---

## 7.2 Process recovery

After daemon restart:

```text
node starts
   ↓
load local run ledger
   ↓
inspect child/runtime state
   ↓
reconcile with repo artifacts
   ↓
recover or mark interrupted
   ↓
continue via its-magic resume contract
```

Never pretend an agent remained alive if the OS killed the process.

Use explicit states:

```text
RUNNING
RECOVERING
PAUSED
WAITING_DECISION
BLOCKED
OFFLINE_CONTINUING
INTERRUPTED
COMPLETED
FAILED
```

---

## 7.3 Laptop sleep caveat

Remote software cannot execute code while the host is physically asleep/off.

Therefore support two execution models:

```text
Local Runner
  repo executes on laptop

Always-on Runner
  repo clone/worktree executes on server/workstation
```

Long-running autonomous work should eventually support:

```text
repo
  ↓
assigned runner
  ↓
Windows workstation | Linux server | cloud worker
```

---

# 8. MagicLink — its-magic Remote Protocol

Create a versioned protocol owned by `its-magic-remote`.

## 8.1 Design goals

- bidirectional;
- reconnectable;
- idempotent;
- resumable;
- ordered per run;
- capability-aware;
- forward compatible;
- streaming;
- transport independent.

Primary transport:

```text
WSS / WebSocket
```

Fallback:

```text
HTTPS polling
```

Future:

```text
QUIC / gRPC optional
```

---

## 8.2 Event envelope

```json
{
  "schema": "magiclink.event.v1",
  "event_id": "evt_01...",
  "node_id": "node_windows_01",
  "repo_id": "repo_finance",
  "run_id": "run_20261015_001",
  "seq": 1842,
  "timestamp": "2026-10-15T22:17:04Z",
  "type": "phase.changed",
  "payload": {}
}
```

---

## 8.3 Command envelope

```json
{
  "schema": "magiclink.command.v1",
  "command_id": "cmd_01...",
  "idempotency_key": "mobile-43df...",
  "repo_id": "repo_finance",
  "run_id": "run_20261015_001",
  "actor": {
    "user_id": "owner",
    "device_id": "android_phone"
  },
  "type": "run.steer",
  "payload": {
    "text": "Prüfe zusätzlich den Import bei leeren CSV-Feldern."
  }
}
```

---

## 8.4 Command receipt

```json
{
  "command_id": "cmd_01...",
  "status": "accepted",
  "runtime_action": "queued_follow_up",
  "effective_after": "current_tool_call",
  "audit_ref": "audit_..."
}
```

Possible states:

```text
accepted
queued
executing
completed
rejected
requires_confirmation
expired
superseded
```

---

# 9. Capability negotiation

This is mandatory for future compatibility.

## 9.1 Node capabilities

On connect:

```json
{
  "protocol_version": 1,
  "runtime_version": "2.4.0",
  "kernel": "omp",
  "capabilities": {
    "ask": true,
    "story_enqueue": true,
    "bug_enqueue": true,
    "steer": true,
    "follow_up": true,
    "pause": true,
    "resume": true,
    "abort": true,
    "decisions": true,
    "browser_uat": true,
    "runtime_logs": true,
    "sovereign_loop": true,
    "parallel_dev": true,
    "model_switch": false
  }
}
```

---

## 9.2 Dynamic action catalog

Future its-magic features must be usable before every client has a custom screen.

Runtime publishes:

```json
{
  "action_id": "sovereign.retry_blocker",
  "label": "Retry blocker",
  "description": "Run bounded automatic remediation again.",
  "danger_level": "medium",
  "requires_confirmation": false,
  "input_schema": {
    "type": "object",
    "properties": {
      "max_attempts": {
        "type": "integer",
        "minimum": 1,
        "maximum": 3
      }
    }
  }
}
```

Generic clients can automatically render:

```text
Retry blocker

Max attempts
[ 2 ]

[ Run ]
```

Later a purpose-built UI can replace the generic form.

This is the core forward-compatibility mechanism.

---

# 10. Event model

Minimum events:

```text
node.connected
node.disconnected
node.health

repo.registered
repo.updated
repo.removed

run.created
run.started
run.state_changed
run.paused
run.resumed
run.completed
run.failed

phase.started
phase.progress
phase.completed
phase.failed

agent.started
agent.status
agent.message
agent.tool_started
agent.tool_completed
agent.completed

story.created
story.updated
bug.created
bug.updated

decision.required
decision.resolved

blocker.created
blocker.updated
blocker.resolved

test.started
test.completed

uat.started
uat.step
uat.completed

runtime.started
runtime.health
runtime.crashed

release.started
release.completed
closure.completed

notification.requested

cost.updated
context.updated

artifact.changed
git.changed
```

---

# 11. Runtime event normalization

OMP, Pi and OpenCode differ.

Remote clients must never care.

Example normalized event:

```ts
type AgentEvent =
  | AgentTextDelta
  | AgentToolStarted
  | AgentToolCompleted
  | AgentThinkingState
  | AgentUsageUpdated
  | AgentSettled
  | AgentError;
```

Adapters:

```text
OmpRuntimeAdapter
PiRuntimeAdapter
OpenCodeRuntimeAdapter
```

convert kernel events into `its-magic` runtime events.

Then:

```text
its-magic runtime events
        ↓
MagicLink events
        ↓
all clients
```

---

# 12. OMP integration

OMP is currently the strongest primary candidate.

Use either:

```text
embedded SDK
```

or:

```text
omp --mode rpc
```

For remote/persistent workers, prefer RPC/process isolation where useful.

OMP RPC provides long-lived bidirectional NDJSON control and supports operations such as prompt, steering, follow-up, abort, state/session queries, model selection and events.

Target:

```text
its-magic runtime
    ↓
OmpKernelAdapter
    ↓
OMP RPC child
```

The node owns the child process.

Remote clients do not.

---

# 13. Pi integration

Pi also exposes a long-lived RPC/event model.

Target:

```text
its-magic runtime
    ↓
PiKernelAdapter
    ↓
Pi RPC / SDK
```

Normalize Pi session events to the same runtime event schema.

---

# 14. OpenCode integration

OpenCode already has a server/client architecture.

Its headless server exposes HTTP/OpenAPI and an event stream.

Compatibility adapter:

```text
OpenCodeKernelAdapter
      ↓
OpenCode local server
```

Again:

```text
OpenCode server
```

must normally remain bound to loopback/private host.

`its-magic-node` is the remote boundary.

---

# 15. Repo registry

The Hub maintains a projection of every connected repo.

Example:

```json
{
  "repo_id": "repo_forest_guardian",
  "name": "forest-guardian",
  "node_id": "node_windows_01",
  "state": "active",
  "branch": "feature/smoke-risk",
  "active_run": "run_...",
  "active_story": "US-0142",
  "phase": "qa",
  "agent_count": 2,
  "blockers": 0,
  "decisions": 1,
  "last_event_at": "..."
}
```

---

# 16. Global dashboard

Home screen:

```text
┌────────────────────────────────────────────────────────────┐
│ its-magic Hub                                      flow ●  │
├────────────────────────────────────────────────────────────┤
│ 4 active · 1 decision · 0 hard blockers · €4.81 today     │
├────────────────────────────────────────────────────────────┤
│ ● Forest Guardian                                          │
│   BUG-0063 · QA · 73%                                      │
│   ⚠ decision required                           2m         │
│                                                            │
│ ● Finance Analytics                                        │
│   US-0214 · BUILD+VERIFY · 64%                             │
│   DEV Codex · tests 112/112                     14m        │
│                                                            │
│ ● Assistant                                                │
│   US-0082 · ARCHITECTURE · 31%                             │
│   Tech Lead Claude                              4m         │
│                                                            │
│ ○ Homelab Dashboard                                        │
│   idle · 2 OPEN stories                                    │
└────────────────────────────────────────────────────────────┘
```

---

# 17. Repository detail screen

Tabs:

```text
Overview
Timeline
Agents
Work
Chat
Artifacts
Runtime
Git
UAT
Decisions
Logs
Settings
```

Mobile initially exposes a reduced subset.

---

# 18. Work timeline

Render its-magic phases, not model messages.

```text
US-0214
────────────────────────────────────────

09:12 Intake             ✓
09:15 Discovery          ✓
09:19 Research           ✓
09:27 Architecture       ✓
09:34 Sprint Plan        ✓
09:39 Plan Verify        ✓
09:42 Execute            ✓
10:08 QA                 ●
      Browser smoke      ●
      tests              ✓
      diagnostics        ✓

Verify Work              ○
Release                  ○
Closure                  ○
Refresh Context          ○
```

This is much more useful remotely than a raw agent chat.

---

# 19. Agent roster

```text
Agents

DEV-1
  role: dev
  model: openai-codex/...
  state: settled
  tokens: 91k
  cost: €0.88

QA-1
  role: qa
  model: anthropic/...
  state: running
  current: browser UAT

Critic-1
  role: critic
  model: gemini/...
  state: waiting
```

Optional:

```text
Open live transcript
Open tool activity
Send steer
Abort agent
```

subject to policy.

---

# 20. Input modes

A remote instruction must have explicit semantics.

## 20.1 Modes

```text
ASK
STORY
BUG
FOLLOW_UP
STEER
INTERRUPT
OVERRIDE
DECISION
CONTROL
```

---

## 20.2 Ask

Read-only question.

Example:

```text
"Warum hängt der Import noch?"
```

Target:

```text
its-magic /ask semantics
```

No workflow mutation.

---

## 20.3 Story

```text
"Baue Export nach CSV ein."
```

Becomes intake/work queue item.

---

## 20.4 Bug

```text
"Beim Speichern crasht die App wenn Name leer ist."
```

Becomes a bug intake item.

---

## 20.5 Follow-up

Adds an instruction after the current agent turn/phase-safe boundary.

```text
"Teste zusätzlich Firefox."
```

---

## 20.6 Steer

Changes the current reasoning/task direction without necessarily abandoning the current work item.

```text
"Verwende keine neue Dependency."
```

The runtime decides the nearest safe injection boundary.

---

## 20.7 Interrupt

Explicitly stops current agent execution.

```text
"Stoppe das gerade und prüfe zuerst die DB Migration."
```

Must be auditable.

---

## 20.8 Override

High-impact operator instruction.

Examples:

```text
"Überspringe den optionalen Research-Schritt."
"Nutze für DEV Modell X."
"Setze Story Y auf höhere Priorität."
```

Must go through normal its-magic policy and decision rules.

Remote must not create a hidden bypass.

---

# 21. Natural-language command classifier

The app can offer:

```text
[ Ask ]
[ New Story ]
[ Bug ]
[ Instruct Running Agent ]
```

If user just types naturally:

```text
"Schau dir zusätzlich den Fehler bei leeren Feldern an"
```

classifier proposes:

```text
Suggested intent:
FOLLOW_UP to US-0214

[Send]
[Make Bug]
[Ask only]
```

In high-autonomy mode the classification may be accepted automatically for low-risk cases.

Never auto-classify destructive control actions.

---

# 22. Work queue

Per repo:

```text
Incoming
Planned
Active
Blocked
Done
```

Remote user can:

- add story;
- add bug;
- reorder priority;
- pin next work;
- defer;
- attach note;
- start now;
- let Sovereign Loop choose.

Example:

```text
Incoming
────────────────────────────
1  BUG-0082 login crash
2  US-0194 CSV export
3  US-0197 dashboard filters
```

---

# 23. Autonomous queue drain

The Remote Control Plane should expose, not duplicate, core autonomy settings.

Example dashboard:

```text
Autonomy

Preset              FULL
Queue drain          ON
Auto repair          ON
Decision gates       ON
Security gates       HARD
Max stories/run      10
Parallel DEV         2
Sovereign mode       ON
```

Changes become runtime commands and are persisted through the core configuration contract.

---

# 24. Maximum autonomy model

The goal is:

```text
user defines goal
       ↓
its-magic decomposes
       ↓
researches
       ↓
architects
       ↓
implements
       ↓
tests
       ↓
runs browser UAT
       ↓
repairs
       ↓
releases
       ↓
deploys
       ↓
smoke tests
       ↓
closes
       ↓
selects next work
```

Operator interruption occurs mainly for:

```text
security-hard gate
irreversible action
ambiguous high-impact architecture
missing external credentials
business/product decision
budget/cap exhausted
explicit user policy
```

---

# 25. Decision Center

Central inbox across every repo.

```text
Decisions (3)

Forest Guardian
DEC-0144
Schema migration strategy
[Recommended A]
[Choose]

Finance
DEC-0312
Replace CSV parser dependency?
[Recommended No]
[Choose]

Assistant
Deployment target unavailable
[Retry]
[Defer]
[Open]
```

---

# 26. Decision payload

```json
{
  "decision_id": "DEC-0144",
  "repo_id": "...",
  "run_id": "...",
  "severity": "high",
  "title": "Schema migration strategy",
  "summary": "Existing column cannot be safely rewritten.",
  "options": [
    {
      "id": "a",
      "label": "Additive migration",
      "recommended": true,
      "impact": "safe"
    },
    {
      "id": "b",
      "label": "Rewrite existing column",
      "impact": "destructive"
    }
  ],
  "expires_at": null
}
```

---

# 27. Blocker Center

Blockers must be separate from decisions.

Examples:

```text
credential_missing
runtime_unreachable
validator_failed
test_failed
merge_conflict
browser_unavailable
provider_quota
model_auth_expired
decision_required
policy_denied
runner_offline
```

Each blocker has:

- reason code;
- summary;
- remediation;
- auto-repair attempts;
- evidence refs;
- allowed remote actions.

---

# 28. Notifications

## 28.1 Required notification classes

```text
decision_required
hard_blocker
soft_blocker
run_completed
run_failed
release_completed
deploy_failed
budget_threshold
node_offline
auth_expired
```

---

## 28.2 Channels

Adapter model:

```text
NotificationProvider
├── WebPushProvider
├── FcmProvider
├── NtfyProvider
├── EmailProvider
├── WebhookProvider
└── future APNsProvider
```

---

## 28.3 Notification policy

Example:

```yaml
notifications:
  decision_required:
    push: immediate
    watch: true

  hard_blocker:
    push: immediate
    watch: true

  soft_blocker:
    push: grouped_15m

  run_completed:
    push: true
    watch: true

  phase_changed:
    push: false
```

Avoid notification spam.

---

# 29. Actionable notifications

Android notification actions:

```text
Decision required

[Approve recommended]
[Open]
[Defer]
```

For destructive or security-sensitive actions:

```text
[Open]
```

only.

Require full app confirmation.

---

# 30. Watch-first notification contract

Every important event should optionally contain:

```json
{
  "short_title": "BUG-0063 blocked",
  "short_body": "DB migration needs a decision.",
  "watch_actions": [
    "open",
    "approve_recommended",
    "defer"
  ]
}
```

This avoids trying to summarize a 5,000-token agent result on a watch.

---

# 31. Android application

Primary mobile functions:

```text
Dashboard
Repo status
Run timeline
Agent status
Ask
Story/Bug entry
Steer/follow-up
Decision center
Blockers
Notifications
Voice command
Logs/evidence summary
```

Do not attempt full IDE/code editing in v1.

---

# 32. Windows client

Two modes:

## 32.1 Local mode

Connect directly to local node/HUB.

Useful while coding.

## 32.2 Remote mode

Same authenticated Hub API as Android.

Possible UI:

```text
system tray
dashboard
notification center
quick command palette
```

---

# 33. Web/PWA first

The fastest useful remote UI should be a responsive web app.

Reasons:

- desktop browser;
- Android immediately;
- installable PWA;
- same UI while native wrappers mature;
- easiest debug iteration;
- shared protocol tests.

Recommended progression:

```text
Web/PWA
   ↓
Tauri Windows wrapper
   ↓
Android wrapper/native integrations
   ↓
Wear OS thin client
```

---

# 34. Fancy UI design language

Aim for:

```text
dark
terminal-inspired
high-information
clean
animated but restrained
real-time
```

Core visual objects:

- repo cards;
- phase progress ring/bar;
- agent chips;
- status pulse;
- decision cards;
- event timeline;
- live cost;
- test/UAT counters;
- runtime health lights.

Avoid making the product look like a generic chat application.

---

# 35. Chat is only one view

The primary object is:

```text
Repository / Run
```

not:

```text
Chat conversation
```

The chat panel is one tool inside a run.

This is central to the product identity.

---

# 36. Voice control

## 36.1 Android

Flow:

```text
tap microphone
     ↓
speech-to-text
     ↓
show transcription
     ↓
intent classify
     ↓
confirm if needed
     ↓
MagicLink command
```

Example:

> "Beim Forest Guardian bitte nach dem aktuellen Sprint noch prüfen ob der Reconnect auch nach fünf Minuten Offline funktioniert."

Proposed:

```text
FOLLOW_UP
Repo: Forest Guardian
Target: current active work
Instruction:
"Reconnect nach 5 Minuten offline testen."

[Send]
```

---

## 36.2 Future always-listening mode

Optional later:

```text
wake word
  ↓
local STT
  ↓
command
```

This must be explicit opt-in.

---

# 37. Wear OS future

Watch is a thin client.

Primary functions:

```text
show active repos
show current phase
show short result
show decision/blocker
approve safe recommended option
defer
pause run
voice instruction
```

Not:

```text
browse entire source tree
inspect full test log
edit code
```

---

# 38. Watch voice UX

Example:

User:

> "Forest Guardian: nach dem Fix auch Offline-Reconnect testen."

Watch:

```text
Forest Guardian

Add as:
FOLLOW_UP to BUG-0063?

"Offline-Reconnect nach dem Fix testen."

[Send]
[Cancel]
```

---

# 39. Device independence

Every UI must use the same protocol.

```text
OMP TUI
Web
Windows
Android
Watch
VS Code integration
CLI
```

are all clients.

No workflow feature may exist only in one UI.

---

# 40. Local TUI integration

The beautiful OMP-based its-magic TUI remains the richest local client.

It should eventually consume the same runtime state model:

```text
RuntimeEvent
RuntimeCommand
RepoState
RunState
AgentState
Decision
Blocker
```

This provides UI parity:

```text
TUI action
   =
Web action
   =
Android action
```

subject to device policy.

---

# 41. REST API

Suggested v1 surface:

```text
GET  /v1/me
GET  /v1/devices

GET  /v1/nodes
GET  /v1/nodes/:nodeId

GET  /v1/repos
GET  /v1/repos/:repoId

GET  /v1/repos/:repoId/runs
POST /v1/repos/:repoId/runs

GET  /v1/runs/:runId
GET  /v1/runs/:runId/events
GET  /v1/runs/:runId/agents

POST /v1/repos/:repoId/commands
POST /v1/runs/:runId/commands

GET  /v1/decisions
POST /v1/decisions/:decisionId/resolve

GET  /v1/blockers
POST /v1/blockers/:blockerId/actions/:actionId

GET  /v1/notifications
POST /v1/devices/:deviceId/push-token

GET  /v1/capabilities
```

---

# 42. Real-time API

WebSocket:

```text
GET /v1/stream
```

Subscriptions:

```json
{
  "subscribe": [
    "repo:*",
    "run:run_123",
    "decisions",
    "notifications"
  ]
}
```

Server events:

```text
snapshot
event
command_status
presence
heartbeat
```

---

# 43. Node transport

Separate authenticated websocket:

```text
WSS /v1/node-link
```

Node initiates connection outbound.

This allows nodes behind:

- home routers;
- NAT;
- corporate networks;
- CGNAT;

without inbound firewall rules.

---

# 44. Offline journal

On node:

```text
event
 ↓
append local WAL/journal
 ↓
attempt send
 ↓
Hub ACK
 ↓
mark committed
```

On reconnect:

```text
last acknowledged seq
       ↓
replay seq+1...
```

---

# 45. Event ordering

Ordering guarantee:

```text
strict per run
```

Do not require a single global ordering across all repos.

Key:

```text
(run_id, seq)
```

---

# 46. Idempotency

All mutable client actions require:

```text
idempotency_key
```

Example:

Phone loses connection after pressing Approve.

Retry must not approve a decision twice.

---

# 47. Command conflicts

Example:

```text
phone: pause
desktop: resume
watch: pause
```

Commands are serialized by runtime command sequence.

Every receipt returns:

```text
accepted_at
effective_state_version
supersedes
```

---

# 48. Optimistic concurrency

State-changing commands can include:

```text
expected_run_version
```

Example:

```json
{
  "type": "decision.resolve",
  "expected_run_version": 184
}
```

Reject stale destructive action with:

```text
STATE_VERSION_CONFLICT
```

---

# 49. State projections

The Hub DB stores projections.

Example tables:

```text
users
devices
nodes
repos
runs
agents
events
commands
decisions
blockers
notifications
capabilities
audit_log
```

Do not mirror entire repositories into the Hub.

---

# 50. Database

Recommended:

```text
PostgreSQL
```

Reasons:

- durable;
- JSONB;
- event/outbox patterns;
- relational queries;
- easy self-hosting;
- scales beyond one user.

For local dev:

```text
SQLite adapter optional
```

---

# 51. Event architecture

V1:

```text
Postgres
+ transactional outbox
+ in-process websocket fanout
```

Do not introduce Kafka/NATS immediately.

Later abstraction:

```ts
interface EventBus {
  publish(event: Event): Promise<void>;
  subscribe(filter: Filter, fn: Handler): Unsubscribe;
}
```

Future provider:

```text
NATS
```

if multi-server scale requires it.

---

# 52. Authentication

User-facing auth:

```text
OIDC/OAuth2 capable
```

V1 self-hosted options:

```text
local account + passkey
OIDC provider
```

Prefer passkeys/device login over reusable passwords where practical.

---

# 53. Node identity

Nodes use separate machine credentials.

Enrollment:

```text
its-magic-node enroll
```

Hub shows:

```text
New node requests access

Windows-Desktop
Fingerprint: 31:92:...
Vienna

[Approve]
[Reject]
```

After enrollment:

```text
short-lived certificate/token
```

---

# 54. Device enrollment

Each client gets its own device identity.

```text
Android phone
Windows laptop
Browser Chrome
Wear OS watch
```

User can revoke one without revoking all.

---

# 55. Authorization

Roles initially:

```text
owner
operator
viewer
```

Permissions:

```text
repo.read
run.ask
run.steer
run.control
work.create
decision.resolve
config.edit
release.approve
admin.nodes
```

Even for a single-user product, design this correctly from the beginning.

---

# 56. Sensitive actions

Examples requiring elevated confirmation:

- delete repo;
- force push;
- production deploy;
- destructive DB migration;
- bypass hard gate;
- credential change;
- rotate node identity.

Remote voice/watch must not silently authorize these.

---

# 57. Secret boundary

The Hub should receive:

```text
secret_ref = "github_token"
```

not:

```text
secret_value = "ghp_..."
```

Node/runtime resolves secrets locally.

Remote UI only sees:

```text
GitHub credential: configured ✓
```

---

# 58. Transport security

Production:

```text
HTTPS/WSS
TLS
secure cookies or bearer tokens
CSRF protection where applicable
device binding
rate limiting
audit
```

Node connections should use:

```text
mTLS or device-bound short-lived credentials
```

---

# 59. Deployment modes

## Mode A — LAN only

```text
Hub on home server
Devices on LAN/VPN
```

## Mode B — VPN overlay

```text
Tailscale/WireGuard
```

Simple and strong for personal use.

## Mode C — public HTTPS

```text
reverse proxy
TLS
OIDC/passkeys
strict node auth
```

## Mode D — hosted SaaS later

Same architecture, multi-tenant hardening added.

---

# 60. Do not expose agent ports

Forbidden architecture:

```text
Internet
  ↓
OMP RPC port
```

or:

```text
Internet
  ↓
OpenCode server directly
```

Use:

```text
Internet
  ↓
Hub
  ↓
authenticated node tunnel
  ↓
local runtime
```

---

# 61. Runtime discovery

Node config:

```yaml
repos:
  - path: D:\work\finance
    enabled: true

  - path: D:\work\forest-guardian
    enabled: true
```

Later:

```text
auto-discover git repos
```

with explicit approval before registration.

---

# 62. Multiple machines

Dashboard:

```text
Nodes

Desktop-Windows
  online
  3 repos
  CPU 31%
  RAM 44%
  2 active agents

Debian-Agent
  online
  8 repos
  CPU 12%
  RAM 23%
  5 active agents
```

---

# 63. Runner selection

A repo can be bound to:

```text
preferred_node
```

Future:

```text
runner pool
```

Example:

```yaml
execution:
  preferred_runner: desktop-gpu
  fallback_runner: debian-server
```

Only safe if repo state can be synchronized correctly.

---

# 64. Remote repo execution

Future option:

```text
Git origin
    ↓
runner clone/worktree
    ↓
its-magic run
    ↓
branch/push/PR
```

This removes dependency on a laptop staying awake.

Treat as separate milestone because it changes Git/secret/runtime semantics.

---

# 65. Presence

Show whether someone is watching a run.

```text
Viewers
  Windows app
  Android phone
```

Presence must not influence agent behavior.

---

# 66. Cost and usage

Remote dashboard:

```text
Today
  input        2.4M
  output       182k
  cache read   7.1M
  estimated    €8.22

By repo
  Finance      €2.84
  Forest       €3.12
  Assistant    €2.26
```

Source is runtime usage events.

---

# 67. Budget policies

Allow:

```yaml
budget:
  per_run_eur: 10
  per_day_eur: 30
  warn_at_percent: 80
```

Budget exhaustion becomes a normal blocker.

---

# 68. Logs

Three levels:

```text
Summary
Runtime
Raw
```

Mobile defaults to Summary.

Desktop/TUI can inspect Raw.

Never push secrets into logs.

---

# 69. Evidence view

Remote QA should show:

```text
Tests
  184 passed

Browser UAT
  9/9
  screenshots 4
  console errors 0
  network errors 0

Runtime
  health green

QA
  PASS

Release
  pending
```

Evidence remains stored in repo.

Hub references it through normalized metadata.

---

# 70. Artifact access

V1 remote:

- metadata;
- selected Markdown rendering;
- diff snippets;
- evidence summaries.

Avoid blindly exposing arbitrary filesystem browsing.

Future:

```text
artifact read service
```

behind path policy.

---

# 71. Git view

Remote summary:

```text
Branch       feature/us-0214
Ahead        3
Behind       0
Dirty        yes
Changed      8 files
Last commit  8m ago
```

Actions later:

```text
show diff
commit
push
create PR
```

must remain policy gated.

---

# 72. Notification deep links

Push:

```text
itsmagic://repos/repo_x/runs/run_y/decisions/DEC-123
```

Web equivalent:

```text
/app/repos/.../decisions/...
```

---

# 73. Notification deduplication

Key:

```text
(repo_id, run_id, event_class, object_id)
```

A blocker updated 15 times should not create 15 alerts.

---

# 74. Notification escalation

Example:

```text
decision pending
  0m → push
 30m → reminder
  4h → reminder
```

Configurable.

No compulsive high-frequency alerts.

---

# 75. Command audit

Every control action records:

```text
who
device
timestamp
repo
run
command
prior state
result
reason
```

Important for autonomy debugging.

---

# 76. Autonomy audit

Dashboard:

```text
Why did the agent continue?

AUTO_SOVEREIGN=1
AUTONOMY_STOP_POLICY=auto_repair_then_skip
blocker=soft
repair attempts=2/3
decision gate=false

Result:
continued
```

This is critical for trust.

---

# 77. Explainable remote status

Avoid:

```text
"Working..."
```

Prefer:

```text
QA
Browser UAT
Step 7/9
Testing reconnect after offline timeout
Started 42s ago
```

---

# 78. Runtime command API

Canonical commands:

```ts
type RuntimeCommand =
  | AskCommand
  | CreateStoryCommand
  | CreateBugCommand
  | FollowUpCommand
  | SteerCommand
  | InterruptCommand
  | PauseCommand
  | ResumeCommand
  | AbortCommand
  | ResolveDecisionCommand
  | InvokeCapabilityActionCommand
  | SetPriorityCommand
  | RetryBlockerCommand;
```

---

# 79. Safe injection points

A remote instruction must declare/receive an effective boundary.

Examples:

```text
immediate
after_tool
after_turn
after_phase
next_story
```

Core runtime chooses what is legal.

Example receipt:

```text
requested: immediate
effective: after_turn
reason: SOURCE_WRITE_IN_PROGRESS
```

---

# 80. No hidden instruction mutation

Remote `STEER` must be stored as explicit evidence.

Example:

```text
handoffs/operator-instructions/
  run_123.jsonl
```

or equivalent runtime-owned ledger.

This avoids invisible chat-only direction changes.

---

# 81. Questions while agent runs

`ASK` should be able to run without disrupting current phase.

Options:

```text
read-only side session
```

preferred.

Example:

```text
Main DEV run
       │
       ├── continues
       │
       └── remote /ask session
             reads bounded repo context
             no writes
```

---

# 82. Parallel remote queries

One active coding run should support multiple read-only questions.

Do not reuse the producer agent session.

This preserves role/session isolation.

---

# 83. Notification on completion

Completion is not merely:

```text
agent stopped
```

Use workflow completion semantics.

Examples:

```text
phase completed
story completed
release completed
deployment completed
goal converged
```

Notifications should name which level completed.

---

# 84. Hub home summary

Daily summary optional:

```text
Overnight

3 stories completed
1 release
0 hard blockers
1 decision waiting

Forest Guardian
  US-142 DONE
Finance
  BUG-81 DONE
Assistant
  US-95 QA
```

---

# 85. Future proactive agent

Later the Hub may have its own read-only meta-agent for questions such as:

```text
"Was machen meine Agents gerade?"
"Welche Projekte sind blockiert?"
"Was wurde heute fertig?"
"Welches Repo verbraucht gerade viel?"
```

It reads Hub projections.

It must not become a second coding orchestrator.

---

# 86. Global voice assistant

Future:

> "Was machen meine Agents?"

Response:

```text
Drei Läufe sind aktiv.
Finance ist in QA.
Forest Guardian wartet auf deine Entscheidung.
Assistant implementiert US-95.
```

Then:

> "Genehmige bei Forest die empfohlene Option."

Requires decision identity resolution and confirmation policy.

---

# 87. Technology stack recommendation

## 87.1 Core language

```text
TypeScript
```

Reason:

- aligns with standalone its-magic/OMP work;
- shared protocol types;
- browser clients;
- WebSocket ecosystem;
- OpenAPI tooling.

Runtime:

```text
Bun or Node-compatible TypeScript
```

Do not make protocol correctness Bun-specific.

---

## 87.2 Hub backend

Recommended:

```text
TypeScript
Fastify or Hono
PostgreSQL
WebSocket
Zod/JSON Schema
OpenAPI
```

---

## 87.3 Web client

```text
React
TypeScript
Vite
PWA
```

Use a shared design system package.

---

## 87.4 Windows wrapper

Recommended:

```text
Tauri
```

Benefits:

- lightweight;
- native tray;
- notifications;
- same web UI;
- auto-updater later.

---

## 87.5 Android

Two viable routes:

### Route A — Tauri mobile / shared UI

Faster shared code.

### Route B — native Kotlin/Compose

Better long-term Android/Wear integration.

Recommended program strategy:

```text
v1 = PWA
v2 = Android wrapper/native shell
watch milestone = native Wear OS module
```

Keep all business logic in SDK/protocol packages so UI technology can change.

---

# 88. Monorepo layout

```text
its-magic-remote/
├── apps/
│   ├── hub/
│   ├── web/
│   ├── desktop/
│   ├── android/
│   └── watch/                 # future
│
├── packages/
│   ├── protocol/
│   ├── client-sdk/
│   ├── node/
│   ├── node-sdk/
│   ├── auth/
│   ├── database/
│   ├── event-store/
│   ├── notifications/
│   ├── voice/
│   ├── ui/
│   ├── config/
│   └── testkit/
│
├── adapters/
│   ├── its-magic-runtime/
│   ├── omp-compat/
│   ├── pi-compat/
│   └── opencode-compat/
│
├── schemas/
│   ├── events/
│   ├── commands/
│   ├── capabilities/
│   └── notifications/
│
├── deploy/
│   ├── docker/
│   ├── systemd/
│   ├── windows/
│   └── reverse-proxy/
│
├── docs/
└── tests/
```

---

# 89. Package dependency direction

```text
protocol
   ↑
client-sdk
   ↑
web/desktop/android

protocol
   ↑
node-sdk
   ↑
node

protocol
   ↑
hub
```

No UI package is imported by node/runtime packages.

---

# 90. Runtime integration package

`adapters/its-magic-runtime` speaks the canonical local Runtime Control Port.

Compatibility adapters are temporary migration aids.

Target end state:

```text
remote
  only knows
its-magic RuntimeControlPort
```

not:

```text
remote knows OMP internals
remote knows Pi internals
remote knows OpenCode internals
```

---

# 91. Local Runtime Control Port

Recommended transports:

Windows:

```text
Named Pipe
```

Linux/macOS:

```text
Unix Domain Socket
```

Dev fallback:

```text
127.0.0.1 HTTP/WebSocket
```

This interface should not listen publicly.

---

# 92. Core runtime contract

Minimum local calls:

```text
runtime.info
repo.list
repo.snapshot
run.list
run.snapshot
run.events
command.submit
command.status
artifact.summary
capabilities.list
```

---

# 93. Protocol versioning

Use:

```text
major.minor
```

Rules:

```text
major = breaking
minor = additive
```

Handshake:

```json
{
  "supported": ["1.0", "1.1", "1.2"],
  "preferred": "1.2"
}
```

---

# 94. Unknown events

A newer runtime may emit:

```text
security.scan.progress
```

to an older Hub.

Hub must:

- store raw event;
- preserve envelope;
- render generic event card;
- not crash;
- not drop stream.

---

# 95. Unknown actions

Dynamic action manifest allows older clients to render a generic form.

This is how new its-magic features remain remotely usable.

---

# 96. Feature-specific UI enhancement

Lifecycle:

```text
new core feature
    ↓
generic action appears automatically
    ↓
remote release later adds polished native screen
```

No cross-repo release lockstep required.

---

# 97. Schema registry

Store schemas under:

```text
schemas/
```

CI checks:

- backwards compatibility;
- generated TS types;
- OpenAPI consistency;
- sample fixtures;
- unknown-field behavior.

---

# 98. Observability

Hub metrics:

```text
connected nodes
active repos
active runs
active agents
event lag
command latency
reconnect count
notification delivery
DB health
```

Node metrics:

```text
runtime heartbeat
child process count
journal queue
CPU/RAM
disk free
network state
```

---

# 99. Health states

Node:

```text
healthy
degraded
offline
```

Repo runtime:

```text
idle
active
blocked
paused
recovering
failed
```

Hub should distinguish:

```text
node offline
```

from:

```text
run failed
```

---

# 100. Connection loss UX

Dashboard:

```text
Forest Guardian

⚠ Node connection lost 3m ago
Last runtime state:
QA / Browser UAT 7/9

Agent may still be continuing locally.
Waiting for node reconnect.
```

Never falsely claim the agent stopped.

---

# 101. Reconciliation after reconnect

Node sends:

```text
last local state
event range
active runtime IDs
repo artifact checkpoint
```

Hub reconciles projections.

If mismatch:

```text
REMOTE_STATE_RECONCILIATION_REQUIRED
```

Do not silently invent missing history.

---

# 102. Remote start

From Android:

```text
Repo idle
3 OPEN stories

[Start Auto]
```

Command:

```text
run.start
```

Core runtime chooses next work according to canonical queue/autonomy policy.

Remote does not pick a story unless explicitly asked.

---

# 103. Remote new project

Later:

```text
Register repo
Clone repo
Create workspace
Start intake
```

Keep out of v1.

---

# 104. Remote code view

Later milestone:

```text
search code
symbol view
diff
diagnostics
```

Use the core Code Intelligence Provider.

Do not build a second index in Remote.

---

# 105. Browser UAT remote view

Show:

```text
live screenshot
current URL
UAT step
console errors
network failures
```

Potential later live stream:

```text
low-FPS screenshot stream
```

not full video initially.

---

# 106. Remote browser intervention

Future:

```text
Take control
```

must pause agent browser interaction first.

Avoid human+agent simultaneous browser control.

---

# 107. Model view

Remote displays:

```text
role
provider
model
thinking level
tokens
cost
```

Changing model is policy gated.

---

# 108. Authentication expiry

Example:

```text
Codex OAuth expired
```

Notification:

```text
DEV blocked
OpenAI Codex login required

[Open Login]
```

Login should occur on a trusted device/node flow.

Do not transmit OAuth refresh tokens through generic event logs.

---

# 109. Multi-provider failures

If model provider fails:

```text
provider_error
```

Core fallback policy decides whether to switch.

Remote only displays outcome and optionally exposes allowed actions.

---

# 110. Remote decision priority

Critical decision should rise above normal agent messages.

UI hierarchy:

```text
SECURITY
DECISION
BLOCKER
FAILURE
COMPLETION
PROGRESS
CHAT
```

---

# 111. Command priority

Suggested:

```text
ABORT
INTERRUPT
PAUSE
DECISION
STEER
FOLLOW_UP
ASK
```

Runtime remains final authority for safe application.

---

# 112. Queue priorities

Work item priority:

```text
urgent
high
normal
low
```

Remote reorder writes through core backlog/intake APIs.

Never edit `backlog.md` directly from Hub.

---

# 113. Remote story creation

Flow:

```text
mobile instruction
      ↓
CreateStory command
      ↓
core /intake
      ↓
PO agent
      ↓
canonical story artifacts
      ↓
StoryCreated event
```

---

# 114. Remote bug creation

Same principle:

```text
CreateBug
  ↓
canonical bug intake
```

No shadow issue DB in the Hub.

---

# 115. Attachments

Future remote input may include:

```text
image
screenshot
log
file
voice note
```

Upload flow:

```text
client
  ↓ encrypted upload
Hub temporary object
  ↓
node fetch with scoped token
  ↓
core intake attachment
```

Define retention.

---

# 116. Camera input

Android later:

```text
take screenshot/photo
attach to bug
```

Useful for UI defects.

---

# 117. Voice result summaries

For voice/watch, runtime should provide structured summary:

```json
{
  "short": "US-214 completed. QA and UAT passed.",
  "medium": "US-214 completed after one retry...",
  "full_ref": "..."
}
```

Do not ask the watch to summarize raw logs.

---

# 118. Summary generation ownership

Prefer core runtime at meaningful lifecycle boundaries.

Hub may generate operational aggregation summaries but should not reinterpret canonical technical verdicts.

---

# 119. Push privacy

Push payload should be minimal.

Example:

```text
Forest Guardian needs a decision
```

Then app fetches details after authentication.

Avoid source code/secrets in OS notification previews.

---

# 120. Multi-user future

Even if v1 is personal:

Design resource ownership:

```text
user
workspace
node
repo
```

Future:

```text
teams
shared repos
approver roles
```

without protocol rewrite.

---

# 121. Test strategy

## Unit

- schema parsing;
- state reducer;
- capability negotiation;
- command validation;
- auth;
- notification routing.

## Integration

- node↔hub reconnect;
- out-of-order delivery;
- command retry/idempotency;
- runtime adapter;
- device enrollment.

## E2E

- browser PWA;
- Android;
- node running test repo;
- decision push and resolution;
- run continues after client disconnect.

---

# 122. Mandatory resilience tests

### Test R1 — close browser

```text
start autonomous run
close browser
wait
reopen
```

Expected:

```text
run continued
events reconciled
```

### Test R2 — kill mobile app

Same.

### Test R3 — Hub restart

Node keeps run alive.

After Hub restarts:

```text
node reconnects
events replay
projection restores
```

### Test R4 — node network outage

Run continues if policy allows.

### Test R5 — node daemon restart

Recover through local run ledger + core resume.

### Test R6 — duplicate command

No duplicate story/decision.

### Test R7 — stale decision

Reject stale version.

### Test R8 — future event

Older client does not crash.

---

# 123. Security proof tests

- raw OMP RPC unreachable remotely;
- raw Pi RPC unreachable remotely;
- OpenCode local server not publicly exposed;
- revoked device cannot reconnect;
- stolen expired token fails;
- watch cannot approve destructive action;
- viewer cannot steer;
- Hub cannot read secret values;
- logs sanitize tokens;
- command audit is immutable/append-only.

---

# 124. Kernel proof matrix

The Remote architecture must work with all supported kernels.

| Capability | OMP | Pi | OpenCode |
|---|---:|---:|---:|
| Persistent run | target | target | target |
| Stream events | yes via adapter | yes via adapter | yes via adapter |
| Ask | yes | yes | yes |
| Follow-up | strong | adapter | adapter |
| Steer active turn | strong | adapter-dependent | adapter-dependent |
| Abort | yes | yes | yes |
| Session stats | yes | yes | yes |
| Remote model info | yes | yes | yes |
| Core workflow semantics | its-magic | its-magic | its-magic |

Do not promise kernel-specific controls unless capability negotiation says they exist.

---

# 125. Phase 0 — protocol contract

Deliver:

- `protocol` package;
- event envelope;
- command envelope;
- capability schema;
- action catalog schema;
- version negotiation;
- fixtures;
- compatibility tests.

No fancy UI yet.

---

# 126. Phase 1 — local node proof

Deliver:

- `its-magic-node`;
- local runtime adapter;
- repository registration;
- runtime supervision;
- local journal;
- CLI status;
- OMP-first integration.

Proof:

```text
run survives terminal/TUI closure
```

---

# 127. Phase 2 — Hub MVP

Deliver:

- Hub API;
- Postgres;
- node enrollment;
- WebSocket node link;
- event ingestion;
- repo/run projection;
- commands;
- audit.

Proof:

```text
two nodes
three repos
live state
remote ask
remote pause/resume
```

---

# 128. Phase 3 — Web/PWA

Deliver:

- login;
- dashboard;
- repo detail;
- run timeline;
- agent roster;
- ask;
- new story;
- new bug;
- steer/follow-up;
- pause/resume;
- decision center.

At this point the product is already remotely useful.

---

# 129. Phase 4 — notifications

Deliver:

- Web Push;
- FCM;
- ntfy adapter;
- dedup;
- notification policies;
- completion alerts;
- decision alerts;
- blocker alerts.

---

# 130. Phase 5 — autonomy control

Deliver:

- remote autonomy profile display;
- safe setting changes;
- queue view;
- prioritization;
- start auto;
- stop/pause;
- blocker retry;
- Sovereign Loop visibility;
- convergence status.

---

# 131. Phase 6 — Windows app

Deliver:

- Tauri wrapper;
- tray;
- native notifications;
- quick command;
- auto-start;
- local-node discovery.

---

# 132. Phase 7 — Android app

Deliver:

- push;
- native share;
- voice input;
- deep links;
- biometric re-auth for critical actions;
- background notification handling.

---

# 133. Phase 8 — evidence and rich runtime views

Deliver:

- UAT;
- screenshots;
- console/network summary;
- test explorer summary;
- git summary;
- artifact viewer;
- runtime health.

---

# 134. Phase 9 — multi-runner execution

Deliver:

- runner assignment;
- always-on runners;
- remote Git workspace execution;
- worktree management;
- reconnect/recovery;
- resource scheduling.

This is what makes full autonomy independent from the laptop.

---

# 135. Phase 10 — Wear OS

Deliver:

- active repo list;
- short status;
- push notifications;
- decisions;
- safe quick actions;
- voice commands.

No heavy UI.

---

# 136. Phase 11 — global voice assistant

Deliver:

```text
"What are my agents doing?"
"Pause Finance."
"Add a bug to Forest Guardian."
"Approve the recommended option."
```

with ambiguity and safety handling.

---

# 137. Phase 12 — extensibility marketplace/API

Possible later:

```text
custom notification plugins
home automation integration
Slack/Teams
GitHub
Jira
Azure DevOps
Home Assistant
webhooks
voice assistants
```

via the same Hub API.

---

# 138. Suggested implementation stories

## Program A — Foundation

### MR-0001 — MagicLink protocol v1

Event + command + capability contracts.

### MR-0002 — its-magic RuntimeControlPort

Minimal generic control boundary in the core runtime.

### MR-0003 — node daemon skeleton

Persistent service and repo registry.

### MR-0004 — node runtime supervisor

Own run/agent process lifetimes.

### MR-0005 — durable local journal

Offline event persistence and replay.

### MR-0006 — OMP runtime bridge

Primary proof adapter.

---

## Program B — Hub

### MR-0010 — Hub auth + DB

### MR-0011 — node enrollment

### MR-0012 — node websocket

### MR-0013 — event reducer/projections

### MR-0014 — command router

### MR-0015 — audit log

### MR-0016 — capability registry

---

## Program C — Remote UX

### MR-0020 — PWA shell

### MR-0021 — project dashboard

### MR-0022 — run timeline

### MR-0023 — agent roster

### MR-0024 — remote ask

### MR-0025 — story/bug submission

### MR-0026 — follow-up/steer/control

### MR-0027 — decision center

### MR-0028 — blocker center

---

## Program D — Notifications

### MR-0030 — notification schema

### MR-0031 — Web Push

### MR-0032 — FCM

### MR-0033 — ntfy/webhook

### MR-0034 — notification policy/dedup

---

## Program E — Rich runtime

### MR-0040 — test evidence

### MR-0041 — UAT view

### MR-0042 — browser screenshots

### MR-0043 — runtime logs

### MR-0044 — Git summary

### MR-0045 — cost/context stats

---

## Program F — Native clients

### MR-0050 — Tauri Windows

### MR-0051 — tray/quick command

### MR-0052 — Android shell

### MR-0053 — Android voice

### MR-0054 — Android biometric critical confirmation

---

## Program G — Always-on autonomy

### MR-0060 — runner abstraction

### MR-0061 — runner scheduling

### MR-0062 — remote Git workspace

### MR-0063 — node failover contract

### MR-0064 — long-running autonomy metrics

---

## Program H — Watch

### MR-0070 — Wear OS companion

### MR-0071 — watch status cards

### MR-0072 — watch actionable notifications

### MR-0073 — watch voice commands

---

# 139. v1 Definition of Done

v1 is complete when:

- [ ] `its-magic-node` runs persistently on Windows and Linux.
- [ ] An autonomous run continues when TUI/browser/mobile disconnects.
- [ ] Hub can see multiple nodes and repos.
- [ ] Repo dashboard shows current work, phase, role and state.
- [ ] User can open a repo and see active run/agent status.
- [ ] `/ask`-style read-only remote question works.
- [ ] New story can be submitted remotely.
- [ ] New bug can be submitted remotely.
- [ ] Low-risk follow-up/steer can be submitted remotely.
- [ ] Pause/resume/abort obey core policy.
- [ ] Decision gates can be resolved remotely.
- [ ] Blockers expose reason codes and remediation.
- [ ] Completion/decision/blocker notifications work.
- [ ] Node reconnect replays missed events.
- [ ] Commands are idempotent.
- [ ] Protocol is versioned.
- [ ] Runtime advertises capabilities.
- [ ] Generic dynamic actions render from schemas.
- [ ] OMP works as primary kernel.
- [ ] Pi/OpenCode can be added without changing clients.
- [ ] Raw kernel endpoints are never exposed to remote clients.
- [ ] Audit captures every control action.
- [ ] Secrets never appear in Hub projection payloads.

---

# 140. v2 Definition of Done

- [ ] native Windows wrapper;
- [ ] polished Android app;
- [ ] FCM push;
- [ ] Android voice commands;
- [ ] richer UAT evidence;
- [ ] Git/diff views;
- [ ] multi-runner execution;
- [ ] always-on server runner;
- [ ] remote workspace execution;
- [ ] resource scheduling.

---

# 141. Watch Definition of Done

- [ ] active repo list;
- [ ] phase/status;
- [ ] short completion result;
- [ ] blocker notification;
- [ ] decision notification;
- [ ] safe approve/defer;
- [ ] voice follow-up;
- [ ] phone confirmation escalation for sensitive actions.

---

# 142. Hard product rule

A user should be able to:

```text
start work on desktop
close TUI
leave home
open Android
see the same run
ask what is happening
add a bug
approve a decision
lock phone
receive completion push
```

without restarting or reconstructing the coding agent session.

---

# 143. Hard autonomy rule

If no operator is connected:

```text
its-magic does not wait merely because no UI is open
```

It follows:

```text
autonomy policy
stop matrix
security gates
decision gates
budget
```

and only blocks for a real workflow reason.

---

# 144. Hard extensibility rule

No future its-magic feature should require a breaking Remote release merely to become controllable.

Every new feature should be able to expose:

```text
capability
status
events
actions
input schema
risk level
```

through the generic runtime contract.

---

# 145. Recommended first architecture spike

Build only this vertical slice:

```text
OMP standalone its-magic run
        │
        ▼
RuntimeControlPort
        │
        ▼
its-magic-node
        │
        ▼
MagicLink WebSocket
        │
        ▼
Hub
        │
        ▼
tiny browser UI
```

Prove:

1. Start a run.
2. Close the original TUI.
3. Run continues.
4. Browser shows phase changes.
5. Browser sends `/ask`.
6. Browser sends follow-up.
7. Disconnect Hub.
8. Run continues.
9. Reconnect Hub.
10. Missing events replay.
11. Trigger decision.
12. Browser resolves it.
13. Run reaches completion.
14. Completion notification appears.

If this works, the fundamental architecture is correct.

---

# 146. Architecture decision summary

## Choose

- separate Remote repo;
- persistent node daemon;
- central Hub;
- outbound node connections;
- versioned MagicLink protocol;
- core RuntimeControlPort;
- event-sourced projection;
- PWA first;
- Android next;
- watch later;
- OMP primary proof kernel;
- kernel-neutral client API;
- dynamic capability/action manifests.

## Avoid

- making chat own the agent;
- exposing OMP/Pi/OpenCode ports;
- making Hub the workflow authority;
- mirroring entire repos centrally;
- hidden remote overrides;
- mobile-specific workflow logic;
- release-lockstep between core and Remote;
- requiring native app before useful remote access.

---

# 147. Final target vision

```text
                           YOU
                            │
      ┌─────────────────────┼──────────────────────┐
      │                     │                      │
 Windows/TUI            Android                Watch
      │                     │                      │
      └─────────────────────┼──────────────────────┘
                            │
                     its-magic Hub
                            │
                  secure event/control mesh
                            │
       ┌────────────────────┼─────────────────────┐
       │                    │                     │
 Windows Runner        Debian Runner        Future Runner
       │                    │                     │
   Repo A/B/C            Repo D/E               Repo F
       │                    │                     │
       └──── its-magic autonomous runtimes ──────┘
                            │
                  OMP / Pi / OpenCode
                            │
             ┌──────────────┴──────────────┐
             │                             │
         autonomous                    observable
         development                   controllable
```

The long-term product is not a remote chat.

It is a **personal autonomous software-development control center**.

You can leave the terminal, leave the building, or switch devices while the development organization continues working.

---

# 148. External implementation references

Current references checked while preparing this plan:

- OMP RPC protocol:
  https://github.com/can1357/oh-my-pi/blob/main/docs/rpc.md
- OMP main entry points / SDK / RPC / ACP:
  https://github.com/can1357/oh-my-pi/blob/main/README.md
- OMP CLI modes:
  https://github.com/can1357/oh-my-pi/blob/main/docs/cli-reference.md
- OpenCode server:
  https://docs.opencode.ai/docs/server/
- OpenCode SDK:
  https://docs.opencode.ai/docs/sdk/
- Pi JSON/RPC event stream:
  https://pi.dev/docs/latest/json

---

# 149. Recommended next step

Create the new repository and make **MR-0001 through MR-0006** the first milestone.

Do not start with Android.

Start by proving the architectural invariant:

> **An its-magic run remains alive and controllable after every UI client disconnects.**

Once that invariant is real, Web/PWA, Windows, Android, notifications, voice and Watch are different clients of an already-correct system.
