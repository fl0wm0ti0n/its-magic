# its-magic Local Runtime — Remote-Ready Core Masterplan

> **Purpose:** Extend the existing local `its-magic` repository so that it can run as a persistent, headless, remotely controllable autonomous development runtime while preserving the current artifact-first workflow, hard gates, role isolation, quality contracts, and kernel independence.
>
> **Companion plans:**
>
> 1. `standalone-its-magic-omp-masterplan.md` — standalone agent host with OMP as primary AgentKernel and rich local TUI.
> 2. `its-magic-remote-control-plane-masterplan.md` — separate Remote/Hub/Android/Windows/Watch product.
> 3. This document — **changes required inside the local/core its-magic repository** so both plans can connect cleanly.

---

# 0. Executive decision

The current `its-magic` framework should evolve from:

```text
IDE/chat-driven workflow kit
        ↓
commands + prompts + artifacts + scripts
```

into:

```text
persistent autonomous development runtime
        ↓
artifact-first workflow
+ workflow state machine
+ kernel-neutral AgentKernel
+ persistent run supervisor
+ local Runtime Control Port
+ event stream
+ command inbox
+ capability/action manifest
+ local TUI client
+ Remote-node connector
```

The core rule is:

> **The local its-magic runtime owns development execution. UIs and remote services only observe and control it.**

Target:

```text
                           its-magic repo
                                │
                    ┌───────────┴───────────┐
                    │                       │
             Artifact Domain          Runtime Domain
                    │                       │
       docs / decisions /           RunSupervisor
       sprints / handoffs           WorkflowEngine
       backlog / acceptance         PolicyEngine
                    │               ContextEngine
                    │               AgentKernel
                    │               EventBus
                    │               CommandBus
                    │                       │
                    └───────────┬───────────┘
                                │
                      RuntimeControlPort
                                │
                ┌───────────────┼────────────────┐
                │               │                │
                ▼               ▼                ▼
            OMP TUI       its-magic-node        CLI
                             │
                             ▼
                       Remote Control Plane
```

The existing project repository remains the source of truth.

The runtime state is **operational state**, not a replacement for artifact memory.

---

# 1. Why the local/core repository must change

The Remote Control Plane cannot safely control the current framework merely by:

```text
SSH
  ↓
send slash command
```

or:

```text
Android app
  ↓
inject text into OMP/OpenCode
```

That would recreate the exact problems its-magic is intended to solve:

- UI/session owns execution;
- prompts become the control plane;
- no stable API;
- no exact command semantics;
- no durable run identity;
- weak reconnect behavior;
- kernel-specific remote clients;
- uncertain safe injection;
- chat history becomes hidden state;
- new remote features must understand internal prompt conventions.

Instead, local its-magic must expose **runtime semantics as code**.

---

# 2. Current framework strengths to preserve

The migration is not a rewrite of product semantics.

The following current concepts remain canonical and should move behind programmatic runtime APIs:

```text
artifact-first memory
backlog canonical status
acceptance traceability
decision records
pause/resume
fresh role context
strict phase-role mapping
runtime proof
isolation evidence
delivery modes
token profiles
work-kind routing
full autonomy
backlog drain
bug drain
browser UAT
runtime QA
dev environment auto-launch
release gates
closure phase
refresh-context
AI decision ledger
cross-model critic
sovereign memory
role behavior manifest
sovereign loop
parallel DEV
self-healing deploy
goal convergence
autonomy presets
stop-policy matrix
```

The new runtime must **execute these contracts**, not reinterpret or replace them.

---

# 3. Current gap analysis

## 3.1 Existing remote execution is not remote control

The current framework already supports remote execution/connectivity concepts for:

```text
WSL
SSH
Docker
remote QA
remote release
remote publish
```

That means:

> "Run this command/test/deploy on target X."

The new requirement is different:

> "Keep the entire autonomous development organization alive and controllable after the interactive client disconnects."

Therefore keep existing remote execution contracts, but add a new orthogonal axis:

```text
Execution Target
    local | docker | ssh | remote host

Control Origin
    local TUI | CLI | node | Hub | Android | Watch
```

Do not merge the two.

---

## 3.2 Existing `/auto` semantics are correct but host-bound

Current `/auto` behavior already defines:

- phase progression;
- role selection;
- fresh sessions;
- stop reasons;
- backlog drain;
- bounded retries;
- decision gates;
- full autonomy.

The missing abstraction is:

```text
WorkflowEngine
```

as a real long-lived runtime object.

Today the execution chain is still heavily represented through commands, host-specific spawning and artifact instructions.

Target:

```ts
interface WorkflowEngine {
  start(request: StartRunRequest): Promise<RunHandle>;
  pause(runId: RunId): Promise<void>;
  resume(runId: RunId): Promise<void>;
  interrupt(runId: RunId, reason: OperatorReason): Promise<void>;
  getState(runId: RunId): Promise<RunState>;
  step(runId: RunId): Promise<WorkflowTransition>;
}
```

---

# 4. Local product boundary

The core repository owns:

```text
workflow semantics
artifacts
roles
policies
permissions
context assembly
model routing policy
AgentKernel abstraction
validation
browser-UAT semantics
dev-runtime semantics
release/closure
autonomy
run persistence
Runtime Control Port
event/command model
local TUI integration contract
```

The core repository does **not** own:

```text
central user accounts
mobile push providers
Android UI
Wear OS UI
central multi-node dashboard
internet-facing API gateway
device enrollment
Hub database
Web/PWA product
```

Those belong to `its-magic-remote`.

---

# 5. Target local architecture

```text
┌──────────────────────────────────────────────────────────────────┐
│                       Project Repository                         │
│                                                                  │
│ docs/product                                                    │
│ docs/engineering                                                │
│ decisions                                                       │
│ handoffs                                                        │
│ sprints                                                         │
│ work                                                            │
│ source                                                          │
└───────────────────────────────┬──────────────────────────────────┘
                                │
                                │ canonical artifact state
                                ▼
┌──────────────────────────────────────────────────────────────────┐
│                    its-magic Runtime Core                        │
│                                                                  │
│ WorkflowEngine                                                   │
│ RoleResolver                                                     │
│ PolicyEngine                                                     │
│ ContextEngine                                                    │
│ ArtifactRepository                                               │
│ ValidatorRegistry                                                │
│ DecisionService                                                  │
│ BlockerService                                                   │
│ WorkQueueService                                                 │
│ BrowserUatService                                                │
│ AppRuntimeService                                                │
│ ReleaseService                                                   │
│ SovereignService                                                 │
│                                                                  │
│ RunSupervisor                                                    │
│ AgentRunSupervisor                                               │
│ EventBus                                                         │
│ CommandBus                                                       │
│ CapabilityRegistry                                               │
│ RunJournal                                                       │
│                                                                  │
│ AgentKernel                                                      │
│   ├── OmpKernelAdapter                                           │
│   ├── PiKernelAdapter                                            │
│   └── OpenCodeKernelAdapter                                      │
└──────────────────────────────┬───────────────────────────────────┘
                               │
                        RuntimeControlPort
                               │
             ┌─────────────────┼──────────────────┐
             │                 │                  │
             ▼                 ▼                  ▼
          Local CLI          TUI          its-magic-node
```

---

# 6. Architectural rule — one repo, one runtime authority

Each active repository has exactly one authoritative local runtime coordinator.

Do not allow:

```text
TUI orchestrator
+
Remote orchestrator
+
OpenCode orchestrator
```

simultaneously.

Correct:

```text
             RuntimeCoordinator
                    │
        ┌───────────┼───────────┐
        │           │           │
       TUI         Node        CLI
      client      client      client
```

Clients send commands.

They do not execute workflow transitions themselves.

---

# 7. `RuntimeCoordinator`

Create a central domain object:

```ts
interface RuntimeCoordinator {
  startRun(input: StartRunInput): Promise<RunSnapshot>;
  submitCommand(command: RuntimeCommand): Promise<CommandReceipt>;
  getSnapshot(): Promise<RuntimeSnapshot>;
  subscribe(listener: RuntimeEventListener): Unsubscribe;
  shutdown(mode: ShutdownMode): Promise<void>;
}
```

It owns:

```text
active RunSupervisor
WorkflowEngine
CommandBus
EventBus
CapabilityRegistry
RunJournal
```

---

# 8. `RunSupervisor`

Each autonomous run gets one durable supervisor.

```ts
interface RunSupervisor {
  readonly runId: RunId;
  readonly repoId: RepoId;

  start(): Promise<void>;
  pause(reason: PauseReason): Promise<void>;
  resume(): Promise<void>;
  interrupt(reason: InterruptReason): Promise<void>;
  abort(reason: AbortReason): Promise<void>;

  enqueue(command: RuntimeCommand): Promise<CommandReceipt>;

  snapshot(): Promise<RunSnapshot>;
}
```

Responsibilities:

- stable `run_id`;
- workflow phase progression;
- active role;
- active agent run;
- stop matrix;
- retry counters;
- current story/bug;
- delivery mode;
- autonomy mode;
- queue budget;
- recoverability state.

---

# 9. Run lifecycle

Canonical run states:

```text
CREATED
STARTING
RUNNING
WAITING_AGENT
WAITING_DECISION
BLOCKED
PAUSING
PAUSED
RECOVERING
COMPLETING
COMPLETED
FAILED
INTERRUPTED
ABORTED
```

Kernel/session state is separate:

```text
AGENT_STARTING
AGENT_RUNNING
AGENT_WAITING_TOOL
AGENT_SETTLED
AGENT_FAILED
AGENT_ABORTED
```

Do not collapse run and agent lifecycle into one enum.

---

# 10. Stable run identity

Every run:

```text
run_01J...
```

Every phase execution:

```text
phase_run_01J...
```

Every agent execution:

```text
agent_run_01J...
```

Every command:

```text
cmd_01J...
```

Every event:

```text
evt_01J...
```

Every blocker:

```text
blk_01J...
```

Every decision keeps existing canonical:

```text
DEC-xxxx
```

These IDs allow clients to reconnect without relying on chat/session IDs.

---

# 11. Separate canonical artifacts from operational runtime state

## 11.1 Canonical

Committed / artifact-first:

```text
docs/
decisions/
handoffs/
sprints/
work/
README
source
tests
```

## 11.2 Operational

Gitignored:

```text
.its-magic/
└── runtime/
    ├── runtime.json
    ├── active-run.json
    ├── runs/
    │   └── <run_id>/
    │       ├── snapshot.json
    │       ├── commands.jsonl
    │       ├── events.jsonl
    │       ├── kernel.json
    │       └── recovery.json
    ├── sockets/
    ├── locks/
    └── cache/
```

Architecture must lock the final path.

Do **not** place transient process state in:

```text
docs/engineering/state.md
```

`state.md` remains a human/audit artifact, not a process database.

---

# 12. Run journal

The runtime journal provides crash recovery.

Append-only:

```text
events.jsonl
commands.jsonl
```

Snapshot periodically:

```text
snapshot.json
```

Journal must be:

- atomic;
- fsync-safe enough for local use;
- bounded/rotated;
- schema versioned;
- recoverable;
- secret-sanitized.

---

# 13. Recovery algorithm

On runtime start:

```text
1 load runtime metadata
2 acquire repo runtime lock
3 read active-run pointer
4 load last snapshot
5 replay journal tail
6 inspect canonical artifacts
7 inspect AgentKernel recovery capability
8 compare runtime state with artifact checkpoint
9 select recovery path
10 emit recovery event
11 continue or block explicitly
```

Possible outcomes:

```text
RECOVERED_CONTINUE
RECOVERED_FROM_ARTIFACT_CHECKPOINT
RECOVERED_PHASE_RESTART
RECOVERY_DECISION_REQUIRED
RECOVERY_UNSAFE
NO_ACTIVE_RUN
```

---

# 14. Recovery principle

Never claim:

```text
"same agent continued"
```

unless the AgentKernel actually supports reconnecting to the same process/session.

If not:

```text
phase recovery
   ↓
new fresh agent session
   ↓
artifact checkpoint + bounded context
```

This is compatible with current fresh-context principles.

---

# 15. Repo runtime lock

Prevent two coordinators from modifying the same repo.

Use:

```text
.its-magic/runtime/locks/runtime.lock
```

Metadata:

```json
{
  "runtime_id": "runtime_...",
  "pid": 4201,
  "started_at": "...",
  "node_id": "optional",
  "heartbeat_at": "..."
}
```

Second instance:

```text
RUNTIME_ALREADY_OWNED
```

unless explicit stale-lock recovery succeeds.

---

# 16. Headless runtime command

Add first-class command:

```bash
its-magic serve
```

Meaning:

```text
start RuntimeCoordinator
open local RuntimeControlPort
do not require interactive TUI
continue until service stop
```

Possible:

```bash
its-magic serve --repo .
its-magic serve --socket auto
its-magic serve --recover
```

---

# 17. Local interactive attach

```bash
its-magic attach
```

Attaches TUI to already-running runtime.

Important:

```text
closing TUI
```

means:

```text
detach
```

not:

```text
abort run
```

---

# 18. Standalone run command

```bash
its-magic run --auto
```

Can:

- start runtime if missing;
- submit run command;
- optionally attach TUI.

Equivalent conceptual flow:

```text
CLI
 ↓
ensure runtime
 ↓
RuntimeControlPort
 ↓
run.start
```

---

# 19. Status command

```bash
its-magic status
```

Output:

```text
Repo       forest-guardian
Runtime    running
Run        run_01...
Work       BUG-0063
Phase      qa
Role       qa
Agent      running
Blockers   0
Decision   1 pending
Started    19m ago
```

No direct reading of OMP internals from CLI.

CLI uses RuntimeControlPort.

---

# 20. Runtime Control Port

This is the primary integration boundary between local core and remote node.

It must be:

- local-only;
- authenticated where needed;
- versioned;
- event capable;
- kernel neutral.

---

# 21. Local transport

Recommended:

Windows:

```text
Named Pipe
```

Linux/macOS:

```text
Unix Domain Socket
```

Development fallback:

```text
127.0.0.1
```

Never default bind:

```text
0.0.0.0
```

---

# 22. Control protocol

Protocol package should live in core:

```text
packages/runtime-protocol
```

It defines semantic local operations.

The Remote repository defines MagicLink for network transport.

Do not make MagicLink the internal core API.

Layering:

```text
Runtime Protocol
     ↓ mapped by
its-magic-node
     ↓
MagicLink
```

---

# 23. Runtime API methods

Minimum:

```text
runtime.info
runtime.health
runtime.shutdown

repo.snapshot

run.start
run.list
run.snapshot
run.pause
run.resume
run.abort

command.submit
command.status

agent.list
agent.snapshot

decision.list
decision.resolve

blocker.list
blocker.action

artifact.summary
artifact.read_safe

capabilities.list
actions.list

events.subscribe
events.replay
```

---

# 24. Runtime API envelope

```json
{
  "protocol": "its-magic-runtime.v1",
  "request_id": "req_...",
  "method": "run.snapshot",
  "params": {
    "run_id": "run_..."
  }
}
```

Response:

```json
{
  "request_id": "req_...",
  "ok": true,
  "result": {}
}
```

---

# 25. Runtime events

Example:

```json
{
  "schema": "its-magic-runtime-event.v1",
  "event_id": "evt_...",
  "run_id": "run_...",
  "seq": 211,
  "timestamp": "...",
  "type": "phase.started",
  "payload": {
    "phase": "qa",
    "role": "qa"
  }
}
```

---

# 26. Runtime event categories

```text
runtime.*
repo.*
run.*
workflow.*
phase.*
agent.*
tool.*
work.*
decision.*
blocker.*
test.*
uat.*
app_runtime.*
release.*
closure.*
sovereign.*
git.*
artifact.*
usage.*
security.*
```

---

# 27. Do not emit raw kernel events as public semantics

OMP event:

```text
message_update
```

Pi event:

```text
agent_message_delta
```

OpenCode event:

```text
session.updated
```

must normalize to:

```text
agent.message.delta
```

where meaningful.

Keep optional diagnostic field:

```json
{
  "kernel": "omp",
  "kernel_event": "message_update"
}
```

only in debug mode.

---

# 28. Event durability

Meaningful lifecycle events are journaled:

```text
phase.started
phase.completed
decision.required
blocker.created
run.completed
```

High-volume token deltas may be:

```text
ephemeral
```

or sampled.

Classification:

```text
durable
ephemeral
debug
```

---

# 29. Replay support

Client reconnect:

```text
events.subscribe after_seq=183
```

Runtime returns:

```text
184...
```

from local journal.

This is essential for `its-magic-node`.

---

# 30. Command Bus

Remote/local clients never call internal phase functions directly.

They submit:

```text
RuntimeCommand
```

to:

```text
CommandBus
```

---

# 31. Canonical command types

```ts
type RuntimeCommand =
  | StartRun
  | Ask
  | CreateStory
  | CreateBug
  | FollowUp
  | Steer
  | Interrupt
  | Pause
  | Resume
  | Abort
  | ResolveDecision
  | RetryBlocker
  | SetWorkPriority
  | InvokeAction;
```

---

# 32. Command receipt

```ts
interface CommandReceipt {
  commandId: string;
  status:
    | "accepted"
    | "queued"
    | "rejected"
    | "requires_confirmation";

  requestedBoundary?: InjectionBoundary;
  effectiveBoundary?: InjectionBoundary;
  reasonCode?: string;
}
```

---

# 33. Idempotency

Every state-changing command can provide:

```text
idempotency_key
```

The local runtime must implement this, not only the remote Hub.

Reason:

```text
Hub reconnect
node retry
local retry
```

must never duplicate:

```text
story creation
decision resolution
abort
priority change
```

---

# 34. Command authorization

Runtime receives actor context:

```json
{
  "actor": {
    "type": "local_user|node|remote_user|automation",
    "actor_id": "...",
    "device_id": "...",
    "authority": ["run.steer"]
  }
}
```

Local core remains final authority.

Do not trust the Hub simply because a request arrived through `its-magic-node`.

---

# 35. Safe instruction injection

This is one of the hardest local features.

Possible injection boundaries:

```text
IMMEDIATE
AFTER_TOOL
AFTER_TURN
AFTER_PHASE
NEXT_WORK_ITEM
```

Runtime chooses effective boundary.

---

# 36. Example

User sends during source write:

```text
STEER:
"Do not introduce Redis."
```

Runtime:

```text
requested = IMMEDIATE
```

Policy:

```text
source mutation in-flight
```

Receipt:

```text
accepted
effective = AFTER_TOOL
```

Then runtime injects into the appropriate active agent/session or phase context.

---

# 37. Kernel capability difference

OMP may support stronger active steering than another kernel.

Therefore define:

```ts
interface AgentKernelCapabilities {
  activeSteer: boolean;
  followUp: boolean;
  abort: boolean;
  reconnectSession: boolean;
  sessionEvents: boolean;
  toolEvents: boolean;
}
```

If unsupported:

```text
STEER
```

can degrade to:

```text
AFTER_TURN
```

if semantically safe.

Never pretend it was immediate.

---

# 38. `ASK` while a run is active

Remote/local read-only question must not hijack producer context.

Target:

```text
Main run
   │
   ├── DEV agent continues
   │
   └── AskService
         ↓
       fresh read-only session
```

This composes with fresh-context and role isolation.

---

# 39. AskService

```ts
interface AskService {
  ask(query: AskQuery): Promise<AskResult>;
}
```

Context:

- active story;
- active phase;
- artifact memory;
- code intelligence;
- optional run projection;
- no mutation tools.

---

# 40. Remote story creation

Never:

```text
Hub edits backlog.md
```

Correct:

```text
CreateStory command
      ↓
WorkIntakeService
      ↓
PO workflow
      ↓
canonical backlog + acceptance + evidence
```

---

# 41. Remote bug creation

Same:

```text
CreateBug
    ↓
canonical its-magic intake
```

---

# 42. WorkIntakeService

Extract current `/intake` semantics behind:

```ts
interface WorkIntakeService {
  createStory(input: StoryIntent, actor: Actor): Promise<WorkItemRef>;
  createBug(input: BugIntent, actor: Actor): Promise<WorkItemRef>;
}
```

Internally it still uses:

- PO role;
- duplicate evaluation;
- question/evidence policy;
- decomposition;
- backlog/acceptance writes.

---

# 43. Remote follow-up

A follow-up must be recorded.

Create operator instruction ledger:

```text
handoffs/operator-instructions/
```

or equivalent canonical/audit location.

Example:

```json
{
  "instruction_id": "ins_...",
  "run_id": "...",
  "work_item": "US-0214",
  "actor": "owner",
  "kind": "follow_up",
  "text": "Also test empty values.",
  "received_at": "...",
  "effective_at": "phase:qa"
}
```

Architecture should decide whether this is committed artifact or runtime journal + handoff citation.

---

# 44. No invisible remote steering

If remote input materially changes:

- scope;
- architecture;
- acceptance;
- implementation constraints;
- priority;

then it must leave an auditable artifact.

This is required to preserve artifact-first memory.

---

# 45. DecisionService

Extract decision gate semantics into code.

```ts
interface DecisionService {
  listOpen(): Promise<DecisionRequest[]>;
  resolve(id: DecisionId, resolution: DecisionResolution): Promise<void>;
}
```

Decision request includes:

```text
title
summary
severity
options
recommended option
impact
evidence refs
allowed actions
```

---

# 46. Remote-safe decisions

Every decision includes:

```text
remote_action_policy
```

Example:

```text
safe_quick_approve
full_confirmation_required
local_only
```

Core decides.

Watch/Android merely render it.

---

# 47. BlockerService

Normalize current stop/fail reason codes into structured blockers.

```ts
interface Blocker {
  blockerId: string;
  reasonCode: string;
  class:
    | "security"
    | "decision"
    | "runtime"
    | "test"
    | "provider"
    | "policy"
    | "budget"
    | "git";
  severity: "soft" | "hard";
  summary: string;
  remediation: BlockerAction[];
  evidenceRefs: string[];
}
```

---

# 48. Current reason codes remain authoritative

Do not replace existing:

```text
PHASE_ROLE_MISMATCH
UAT_BROWSER_UNAVAILABLE
RUNTIME_PROOF_...
...
```

with vague remote statuses.

BlockerService maps them into structured UI-friendly objects.

---

# 49. Notification semantics in core

Core does not send FCM/WebPush.

It emits semantic events such as:

```text
decision.required
blocker.hard
run.completed
release.completed
auth.required
```

`its-magic-node` / Remote Hub decide notification delivery.

---

# 50. Structured summaries

At meaningful boundaries, emit:

```ts
interface RunSummary {
  short: string;
  medium: string;
  evidenceRefs: string[];
  verdict?: "pass" | "fail" | "blocked";
}
```

Useful for:

- mobile;
- watch;
- voice;
- TUI;
- logs.

---

# 51. Summary ownership

Core generates technical truth.

Examples:

```text
"QA PASS — 184 tests passed, browser UAT 9/9."
```

Hub may aggregate:

```text
"Three projects completed today."
```

Hub must not rewrite a FAIL to PASS.

---

# 52. Capability Registry

Add:

```ts
interface CapabilityRegistry {
  snapshot(): CapabilityManifest;
  actions(): ActionDescriptor[];
}
```

This is mandatory for independent Remote release cycles.

---

# 53. Base capability manifest

Example:

```json
{
  "runtime_version": "3.0.0",
  "protocol_version": "1.2",
  "kernel": {
    "id": "omp",
    "version": "..."
  },
  "features": {
    "ask": true,
    "story_enqueue": true,
    "bug_enqueue": true,
    "steer": true,
    "pause": true,
    "resume": true,
    "browser_uat": true,
    "parallel_dev": true,
    "sovereign_loop": true
  }
}
```

---

# 54. Dynamic action descriptors

Every optional/new feature can register:

```ts
interface ActionDescriptor {
  id: string;
  label: string;
  description: string;
  inputSchema: JSONSchema;
  dangerLevel: "low" | "medium" | "high" | "critical";
  confirmation: "none" | "confirm" | "local_only";
  requiredCapabilities: string[];
}
```

---

# 55. Example sovereign action

```json
{
  "id": "sovereign.retry_blocker",
  "label": "Retry blocker",
  "dangerLevel": "medium",
  "confirmation": "none",
  "inputSchema": {
    "type": "object",
    "properties": {
      "attempts": {
        "type": "integer",
        "minimum": 1,
        "maximum": 3
      }
    }
  }
}
```

---

# 56. Action registration

Features register actions in core code:

```ts
actions.register({
  ...
});
```

Do not make Remote parse README/scratchpad text to discover capabilities.

---

# 57. Config introspection

Expose safe config metadata:

```text
AUTONOMY_PRESET
DELIVERY_MODE
TOKEN_PROFILE
AUTO_SOVEREIGN
CROSS_MODEL_REVIEW
...
```

with:

```text
current value
allowed values
description
risk
remote writable?
restart required?
```

---

# 58. Do not expose secrets

Config values classified:

```text
public
sensitive
secret_ref
secret_value
```

Runtime API never returns:

```text
secret_value
```

---

# 59. Policy for remote config mutation

Only keys explicitly marked:

```text
remoteMutable=true
```

may be changed through Runtime Control Port.

Example:

```text
AUTONOMY_PRESET       yes
TOKEN_PROFILE         yes
MODEL_DEV             maybe
SSH_PRIVATE_KEY       no
OPENAI_REFRESH_TOKEN  no
```

---

# 60. Configuration ownership migration

Current host-specific configuration is heavily under:

```text
.cursor/
```

Standalone core should gradually introduce host-neutral config.

Target:

```text
.its-magic/
├── config/
│   ├── runtime.yaml
│   ├── autonomy.yaml
│   ├── models.yaml
│   ├── permissions.yaml
│   ├── dev-environment.json
│   └── remote-execution.json
```

But migration must be backward compatible.

---

# 61. Host-neutral config principle

Do not immediately delete:

```text
.cursor/scratchpad...
.opencode/...
```

Instead:

```text
ConfigResolver
    ↓
argv
    ↓
host-neutral local config
    ↓
legacy scratchpad
    ↓
defaults
```

Architecture must lock precedence.

---

# 62. Config API

```ts
interface ConfigService {
  resolve(): Promise<ResolvedConfig>;
  describe(): ConfigDescriptor[];
  setRemoteMutable(key: string, value: unknown, actor: Actor): Promise<void>;
}
```

Every change emits:

```text
config.changed
```

and audit evidence.

---

# 63. AgentKernel abstraction

Core must never let remote support depend on OMP APIs.

```ts
interface AgentKernel {
  createSession(input: SessionInput): Promise<AgentSession>;
  restoreSession?(ref: KernelSessionRef): Promise<AgentSession>;
  capabilities(): AgentKernelCapabilities;
}
```

---

# 64. AgentSession interface

```ts
interface AgentSession {
  readonly id: string;

  prompt(input: PromptInput): Promise<PromptResult>;
  steer?(input: SteerInput): Promise<void>;
  followUp?(input: FollowUpInput): Promise<void>;
  abort(): Promise<void>;

  subscribe(listener: AgentEventListener): Unsubscribe;
  snapshot(): Promise<AgentSessionSnapshot>;
  close(): Promise<void>;
}
```

---

# 65. OMP primary adapter

Recommended v1:

```text
OmpKernelAdapter
```

Use OMP's strongest available integration mode while keeping process lifecycle owned by its-magic.

Possible:

```text
SDK embedded
```

or:

```text
OMP RPC child process
```

For robust persistence/process isolation, RPC child mode is especially attractive.

---

# 66. OMP process ownership

```text
RunSupervisor
     │
AgentRunSupervisor
     │
OmpKernelAdapter
     │
OMP child process
```

Closing TUI does not close OMP child.

Only:

```text
RunSupervisor
```

or OS/service shutdown controls it.

---

# 67. Pi adapter

Pi remains secondary replaceable backend.

Remote/core code uses:

```text
AgentKernel
```

only.

---

# 68. OpenCode adapter

Existing OpenCode host work can remain compatibility backend.

But in standalone architecture:

```text
OpenCode
```

must not remain the owner of workflow semantics.

It becomes:

```text
AgentKernel / compatibility host
```

behind core.

---

# 69. Kernel capability negotiation

Example:

```json
{
  "active_steer": true,
  "follow_up": true,
  "session_restore": false,
  "browser": true,
  "lsp": true,
  "debugger": true
}
```

Core combines:

```text
feature capability
+
policy capability
```

before exposing remote action.

---

# 70. Role sessions

Existing phase-role mapping stays.

Each phase execution creates:

```text
AgentRun
```

with:

```text
role
model
provider
tool policy
context pack
artifact ownership
worktree
kernel session
```

---

# 71. AgentRunSupervisor

```ts
interface AgentRunSupervisor {
  start(spec: AgentRunSpec): Promise<void>;
  steer(input: OperatorInstruction): Promise<SteerResult>;
  abort(reason: string): Promise<void>;
  snapshot(): AgentRunSnapshot;
}
```

It emits normalized events to Runtime EventBus.

---

# 72. Fresh-context proof becomes runtime-native

Current strict proof should become easier, not weaker.

At spawn:

```text
phase_run_id
agent_run_id
kernel_session_id
role
model_id
created_at
context_hash
tool_policy_hash
```

Runtime can generate attestation from real execution metadata instead of agent-authored prose.

---

# 73. Stronger runtime proof

Target proof:

```json
{
  "proof_kind": "runtime-native-v2",
  "run_id": "...",
  "phase_run_id": "...",
  "agent_run_id": "...",
  "kernel": "omp",
  "kernel_session_id_hash": "...",
  "role": "dev",
  "started_at": "...",
  "completed_at": "...",
  "context_hash": "...",
  "policy_hash": "...",
  "evidence_ref": "..."
}
```

This is more trustworthy than asking the LLM to claim isolation.

---

# 74. Runtime proof compatibility

Keep existing artifact fields and validators initially.

Migration:

```text
v1 current proof
   +
v2 runtime-native evidence
```

Then make v2 authoritative after compatibility period.

---

# 75. PolicyEngine becomes code authority

Remote control makes this mandatory.

Model prompts are not permission enforcement.

```ts
interface PolicyEngine {
  authorize(action: RuntimeAction, context: PolicyContext): PolicyDecision;
}
```

Possible:

```text
ALLOW
DENY
REQUIRE_CONFIRMATION
DEFER_TO_DECISION_GATE
```

---

# 76. Role policy

Examples:

```text
PO
  source write deny

DEV
  source write allow
  release deny

QA
  source write deny by default
  browser allow

Release
  release artifacts allow
  production deploy policy gated

Orchestrator
  production artifact mutation deny
  phase scheduling allow
```

---

# 77. Remote actor policy

Additional axis:

```text
Actor = owner remote phone
```

does not automatically bypass:

```text
role policy
release gate
security hard gate
```

---

# 78. Override semantics

A remote override is:

```text
RuntimeCommand
```

plus:

```text
policy evaluation
decision/audit record
```

not:

```text
"ignore previous instructions"
```

---

# 79. ToolBroker

All agent tools go through:

```text
ToolBroker
```

so runtime can observe and control them.

```ts
interface ToolBroker {
  execute(call: ToolCall, context: ToolContext): Promise<ToolResult>;
}
```

---

# 80. Tool events

Emit:

```text
tool.started
tool.completed
tool.failed
tool.denied
```

Remote may show summaries.

Do not expose secret arguments.

---

# 81. Long-running tool cancellation

Remote interrupt/abort may need:

```text
AbortSignal
```

for:

- tests;
- build;
- browser;
- shell;
- model call;
- deployment.

Implement cancellable tool contract.

---

# 82. Process manager

Existing app auto-launch should become a service:

```ts
interface AppRuntimeService {
  detect(): Promise<AppProfile>;
  start(target?: string): Promise<AppInstance>;
  stop(id: string): Promise<void>;
  restart(id: string): Promise<void>;
  rebuild(id: string): Promise<void>;
  health(id: string): Promise<HealthResult>;
  logs(id: string, cursor?: string): AsyncIterable<LogEvent>;
}
```

---

# 83. Persisted dev environment profile

Migrate current dev auto-launch profile behind this service.

Expose safe runtime fields:

```text
mode
service
url
health
status
pid/container
last restart
```

Remote client can inspect, not directly execute arbitrary shell.

---

# 84. BrowserUatService

```ts
interface BrowserUatService {
  run(plan: UatPlan): Promise<UatResult>;
  snapshot(): BrowserUatSnapshot;
}
```

Remote-facing data:

```text
step
url
screenshot ref
console error count
network error count
verdict
```

---

# 85. Browser session policy

Remote cannot arbitrarily take browser control in v1.

Future takeover flow:

```text
request takeover
      ↓
pause agent browser
      ↓
exclusive human session
      ↓
release takeover
      ↓
agent may continue
```

---

# 86. Code intelligence service

Expose summary/search through core:

```ts
interface CodeIntelligenceService {
  search(query: string): Promise<SearchHit[]>;
  symbol(ref: SymbolRef): Promise<SymbolInfo>;
  references(ref: SymbolRef): Promise<Reference[]>;
  context(task: string): Promise<CodeContextPack>;
}
```

Remote later consumes this API.

Do not let Remote build its own repo index.

---

# 87. ArtifactRepository

Wrap direct file mutations for workflow artifacts.

```ts
interface ArtifactRepository {
  read(ref: ArtifactRef): Promise<Artifact>;
  mutate(operation: ArtifactMutation, owner: ArtifactOwner): Promise<void>;
  snapshot(): Promise<ArtifactSnapshot>;
}
```

This makes remote/runtime auditing easier.

---

# 88. Artifact ownership guard

Current cross-phase write discipline should become runtime-enforced.

Example:

```text
phase=qa
attempt mutate architecture
  ↓
ArtifactRepository
  ↓
deny
```

unless explicit allowed contract.

---

# 89. File watcher

Runtime should detect external edits.

Watch:

```text
canonical artifact files
source files
config
```

Events:

```text
repo.external_change
artifact.external_change
```

This strengthens existing single-writer drift protection.

---

# 90. External editor coexistence

User may edit code in VS Code while autonomous run exists.

Policy modes:

```text
allow_nonoverlap
pause_on_overlap
deny_during_critical_phase
```

At minimum detect:

```text
file changed externally after agent read
```

and require revalidation before agent writes.

---

# 91. Worktree strategy

Parallel DEV already exists conceptually.

Formalize:

```text
WorkspaceService
```

```ts
interface WorkspaceService {
  create(run: AgentRunSpec): Promise<Workspace>;
  merge(workspaceId: string): Promise<MergeResult>;
  discard(workspaceId: string): Promise<void>;
}
```

---

# 92. Local runtime ownership of worktrees

Remote client only sees:

```text
DEV-A
worktree
branch
status
```

It does not manage Git directories directly.

---

# 93. GitService

```ts
interface GitService {
  status(): Promise<GitStatus>;
  diff(scope?: DiffScope): Promise<DiffSummary>;
  commit(input: CommitRequest): Promise<CommitRef>;
  push(input: PushRequest): Promise<PushResult>;
}
```

High-impact actions remain policy gated.

---

# 94. Workflow engine extraction

Refactor each phase into:

```ts
interface WorkflowPhase {
  id: PhaseId;
  resolveRole(ctx: WorkflowContext): RoleId;
  prepare(ctx: WorkflowContext): Promise<PhasePlan>;
  execute(ctx: PhaseExecutionContext): Promise<PhaseResult>;
  validate(ctx: PhaseExecutionContext): Promise<PhaseVerdict>;
  next(ctx: WorkflowContext, result: PhaseResult): WorkflowTransition;
}
```

---

# 95. Phase IDs

Canonical set should include current final lifecycle:

```text
intake
discovery
research
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

Plus macro/delivery modes mapped explicitly.

---

# 96. Delivery modes

Do not hardcode phase list in Remote API.

WorkflowEngine resolves:

```text
standard
ultra_lean
mega_quick
```

and emits:

```text
run.phase_plan_resolved
```

with:

```text
selected phases
skipped phases
reason
mode
```

---

# 97. Remote representation of macro phases

For ultra-lean:

```text
spec
plan
build+verify
ship
```

Remote may show macro phases.

Core still records exact underlying execution/evidence.

---

# 98. StopMatrixService

Extract existing stop policy into:

```ts
interface StopMatrixService {
  evaluate(ctx: StopContext): StopDecision;
}
```

Result:

```text
continue
retry
skip
pause
decision
hard_stop
complete
```

---

# 99. AutonomyService

```ts
interface AutonomyService {
  resolveProfile(config: ResolvedConfig): AutonomyProfile;
  canContinue(ctx: AutonomyContext): ContinueDecision;
}
```

Remote UI can display resolved profile.

It does not implement it.

---

# 100. SovereignService

Wrap current sovereign features behind service APIs.

```ts
interface SovereignService {
  status(): SovereignStatus;
  convergence(): ConvergenceStatus;
  deferrals(): Deferral[];
  retryBlocker(id: string): Promise<void>;
}
```

---

# 101. Critic visibility

Expose:

```text
producer model
critic model
blocking findings
non-blocking findings
rework cycle
```

Do not expose hidden reasoning.

---

# 102. Parallel DEV visibility

Expose:

```text
candidate id
model
workspace
status
tests
score
selected?
```

Remote/TUI can show competition without understanding worktree internals.

---

# 103. ReleaseService

```ts
interface ReleaseService {
  status(): ReleaseStatus;
  run(): Promise<ReleaseVerdict>;
}
```

Must keep existing release gate order.

---

# 104. ClosureService

Separate closure remains first-class.

```ts
interface ClosureService {
  canClose(): Promise<ClosureReadiness>;
  close(): Promise<ClosureVerdict>;
}
```

Remote completion should only mark story completed after canonical closure semantics.

---

# 105. Completion levels

Expose distinct statuses:

```text
agent_completed
phase_completed
story_verified
released
closed
goal_converged
```

This avoids misleading mobile notifications.

---

# 106. Runtime metrics

Core emits:

```text
tokens
cache reads
model calls
duration
tool calls
retries
cost estimate
context size
```

per:

```text
agent
phase
run
story
```

---

# 107. CostService

```ts
interface CostService {
  snapshot(): UsageSnapshot;
}
```

Model pricing config can remain best-effort.

Unknown price:

```text
cost = unknown
```

not zero.

---

# 108. BudgetService

Local core enforces:

```text
per-run cap
per-story cap
optional daily cap
```

Remote cannot circumvent it.

---

# 109. ModelRouter service

Move existing per-phase model selection behind:

```ts
interface ModelRouter {
  resolve(input: ModelResolutionInput): ModelSelection;
}
```

Remote may request model override only if policy permits.

---

# 110. Auth state

Kernel auth status exposed safely:

```text
provider
authenticated?
expires soon?
login required?
```

Never expose OAuth tokens.

---

# 111. Auth-required blocker

When Codex OAuth expires:

```text
PROVIDER_AUTH_REQUIRED
```

becomes structured blocker.

Remote can surface:

```text
Login required on node.
```

---

# 112. Local login action

Dynamic action:

```text
provider.login
```

may be:

```text
local_only
```

if OAuth requires trusted browser/node interaction.

---

# 113. Local TUI architecture

The OMP-based TUI must become a **client of RuntimeControlPort**, not the workflow owner.

This is important.

Target:

```text
OMP TUI shell
      │
its-magic TUI extension
      │
RuntimeClient
      │
RuntimeControlPort
      │
RuntimeCoordinator
```

---

# 114. TUI detach behavior

Key:

```text
Ctrl+Q / exit
```

should prompt:

```text
Detach from runtime?
Run will continue.

[Detach]
[Abort Run]
[Cancel]
```

Default safe action:

```text
Detach
```

---

# 115. TUI reattach

```bash
its-magic attach
```

shows:

```text
Found active runtime
run_...
US-0214
QA

[Attach]
```

No new agent session unless required.

---

# 116. TUI global repo dashboard

Local future:

```text
its-magic node
```

may show multiple repo runtimes, but keep aggregation in `its-magic-node`.

Core TUI inside one repo remains focused.

A separate node dashboard may list:

```text
all local repos
```

---

# 117. TUI views

Reuse prior OMP plan:

```text
Overview
Phase Timeline
Agents
Work
Runtime
Browser UAT
Evidence
Decisions
Blockers
Logs
Context
```

All backed by runtime snapshot/events.

---

# 118. No duplicate local state reducer

Create shared package:

```text
runtime-client
```

used by:

- TUI;
- CLI;
- node adapter tests.

It reduces runtime events into client state.

---

# 119. Runtime snapshots

On attach:

```text
client asks snapshot
```

then:

```text
subscribe from snapshot seq
```

Standard pattern:

```text
snapshot + event tail
```

---

# 120. Health endpoint

Local:

```text
runtime.health
```

returns:

```text
runtime pid
uptime
journal status
active run
kernel status
repo lock
disk writable
event seq
```

Node uses this.

---

# 121. Graceful shutdown

Modes:

```text
detach_client
pause_run_and_shutdown
shutdown_after_phase
force_abort_and_shutdown
```

OS service/node usually owns runtime process.

---

# 122. Shutdown after phase

Useful for laptop:

```text
Finish current QA phase then pause.
```

Runtime command:

```text
run.pause_after_boundary
```

possible future action.

---

# 123. Laptop suspend handling

Core detects:

```text
clock gap / resume
```

Event:

```text
runtime.host_resumed
```

Then:

- health check child processes;
- provider connection check;
- dev environment check;
- browser session check;
- reconcile run.

---

# 124. Host shutdown

Best effort:

```text
persist snapshot
flush journal
mark host_shutdown
```

Then recovery on boot.

---

# 125. Always-on runner compatibility

Core must not assume:

```text
interactive Windows desktop
```

It must run on:

```text
Windows
Linux server
Docker environment
future cloud runner
```

No mandatory GUI.

---

# 126. Headless browser

Browser UAT supports:

```text
headless
headed
existing Chrome/CDP
```

Runtime capability reports available modes.

---

# 127. Voice is not local-core specific

Core receives text command semantics.

Speech-to-text belongs to:

- Android;
- watch;
- TUI voice layer;
- future assistant.

This keeps core independent from microphones.

---

# 128. Core remote actor model

Define:

```ts
type ActorType =
  | "local_cli"
  | "local_tui"
  | "node"
  | "remote_user"
  | "automation"
  | "system";
```

Every mutation gets actor evidence.

---

# 129. AuditService

```ts
interface AuditService {
  append(entry: AuditEntry): Promise<void>;
}
```

Audit:

```text
commands
config changes
decisions
overrides
interrupts
aborts
remote actions
policy denials
```

---

# 130. Audit storage

Operational:

```text
.its-magic/runtime/audit.jsonl
```

Important workflow decisions may also create/update canonical artifacts.

Do not commit every heartbeat.

---

# 131. Remote-safe artifact read

Node/Hub may need selected Markdown.

Expose:

```ts
artifact.readSafe(ref)
```

Policy checks:

- allowlisted artifact roots;
- no `.env`;
- no credentials;
- size cap;
- content sanitization where required.

---

# 132. No generic filesystem API to Remote

Do not expose:

```text
read any path
write any path
shell any command
```

through Runtime Control Port.

Remote acts through semantic services.

---

# 133. Diagnostic admin API

For trusted local debugging only:

```text
runtime.debug.*
```

must be:

```text
local_only
disabled by default
```

Never forwarded by node unless explicit development mode.

---

# 134. Runtime schemas

Create:

```text
schemas/runtime/
├── event-v1.schema.json
├── command-v1.schema.json
├── snapshot-v1.schema.json
├── capabilities-v1.schema.json
├── actions-v1.schema.json
├── blocker-v1.schema.json
├── decision-v1.schema.json
└── audit-v1.schema.json
```

---

# 135. Schema compatibility CI

For every change:

```text
old client fixtures
new runtime
```

must continue for additive changes.

Breaking changes require protocol major bump.

---

# 136. SDK generation

Generate/shared TypeScript types from schemas or maintain schemas from typed source.

Avoid two handwritten sources of truth.

---

# 137. Error model

Every API error:

```json
{
  "code": "RUN_NOT_ACTIVE",
  "message": "...",
  "details": {},
  "retryable": false
}
```

Reason codes are machine-stable.

Human text can evolve.

---

# 138. Compatibility with current Python validators

Do not rewrite them in TypeScript immediately.

Use:

```text
ValidatorBridge
     ↓
Python subprocess
```

with structured result.

---

# 139. Validator interface

```ts
interface Validator {
  id: string;
  run(ctx: ValidationContext): Promise<ValidationResult>;
}
```

Result:

```text
PASS
FAIL
BLOCKED
```

plus reason/evidence.

---

# 140. Structured Python CLI output

Gradually add:

```text
--json
```

to critical validators.

Avoid parsing human console text long-term.

---

# 141. Validator event integration

Emit:

```text
validator.started
validator.completed
validator.failed
```

Remote can show:

```text
Acceptance parity PASS
Runtime proof PASS
UAT PASS
```

---

# 142. Existing test harness

Preserve existing contract tests.

Add runtime-specific test layers rather than replacing old ones immediately.

---

# 143. Migration strategy — strangler pattern

Do not rewrite all 130+ stories at once.

Introduce runtime services around existing scripts/commands.

```text
old command
  ↓
service wrapper
  ↓
same validator/artifact scripts
```

Then move semantics into code incrementally.

---

# 144. Migration tranche A — runtime shell

Deliver:

```text
RuntimeCoordinator
RunSupervisor
RuntimeControlPort
runtime journal
repo lock
snapshot/events
```

Use existing `/auto` invocation internally.

Goal:

```text
persistent host
```

before deep refactor.

---

# 145. Migration tranche B — command semantics

Add:

```text
Ask
Pause
Resume
Abort
CreateStory
CreateBug
Decision resolve
```

as typed RuntimeCommands.

Internally delegate to current mechanisms.

---

# 146. Migration tranche C — workflow extraction

Move `/auto` transition logic into WorkflowEngine.

Command docs become human/operator documentation, not primary executable state machine.

---

# 147. Migration tranche D — role/session runtime

Move:

```text
phase→role
fresh session
runtime proof
isolation evidence
model routing
```

into code-first supervisor.

---

# 148. Migration tranche E — tool/policy runtime

Move hard permissions into:

```text
PolicyEngine
ToolBroker
ArtifactRepository
```

Prompts remain behavior guidance only.

---

# 149. Migration tranche F — runtime services

Extract:

```text
AppRuntimeService
BrowserUatService
GitService
CodeIntelligenceService
ReleaseService
ClosureService
SovereignService
```

---

# 150. Migration tranche G — host-neutral config

Introduce `.its-magic/config`.

Legacy host packs become adapters.

---

# 151. Migration tranche H — TUI client conversion

Existing/new OMP TUI talks to RuntimeControlPort.

Prove:

```text
TUI close != run stop
```

---

# 152. Migration tranche I — node integration

Implement connector package consumed by `its-magic-node`.

No Hub code in core.

---

# 153. Current feature mapping

## Artifact-first memory

```text
KEEP
```

Add `ArtifactRepository`.

## `/auto`

```text
MIGRATE → WorkflowEngine
```

## full autonomy

```text
KEEP semantics
MIGRATE continuation to RunSupervisor
```

## fresh subagents

```text
KEEP
ENFORCE runtime-native
```

## strict role mapping

```text
KEEP
MOVE preflight into RoleResolver
```

## runtime proof

```text
KEEP
UPGRADE to native attestation
```

## browser UAT

```text
KEEP
WRAP BrowserUatService
```

## dev auto-launch

```text
KEEP
WRAP AppRuntimeService
```

## remote execution targets

```text
KEEP
SEPARATE from remote control
```

## model routing

```text
KEEP
WRAP ModelRouter
```

## Sovereign features

```text
KEEP
WRAP SovereignService
```

## OpenCode adapter

```text
KEEP compatibility
NORMALIZE behind AgentKernel
```

## OMP

```text
PRIMARY standalone kernel candidate
```

## Pi

```text
SECOND kernel adapter
```

---

# 154. New core modules

Recommended:

```text
packages/
├── runtime-core/
├── runtime-protocol/
├── runtime-client/
├── workflow/
├── policy/
├── context/
├── artifacts/
├── agent-kernel/
├── kernel-omp/
├── kernel-pi/
├── kernel-opencode/
├── tools/
├── validators/
├── code-intelligence/
├── app-runtime/
├── browser-uat/
├── git/
├── sovereign/
├── config/
├── audit/
└── observability/
```

---

# 155. Suggested standalone repository layout after evolution

If core moves into a dedicated standalone repo:

```text
its-magic/
├── apps/
│   ├── cli/
│   ├── runtime/
│   └── tui/
│
├── packages/
│   ├── runtime-core/
│   ├── runtime-protocol/
│   ├── runtime-client/
│   ├── workflow/
│   ├── policy/
│   ├── context/
│   ├── artifacts/
│   ├── agent-kernel/
│   ├── kernel-omp/
│   ├── kernel-pi/
│   ├── kernel-opencode/
│   ├── tools/
│   ├── validators/
│   ├── code-intelligence/
│   ├── browser-uat/
│   ├── app-runtime/
│   ├── git/
│   ├── sovereign/
│   └── config/
│
├── schemas/
├── scripts/              # legacy Python validators initially
├── tests/
└── docs/
```

The consumer project repository still gets its own its-magic project artifacts/config.

---

# 156. CLI surface

Target:

```bash
its-magic init
its-magic serve
its-magic attach
its-magic status
its-magic run
its-magic ask
its-magic story
its-magic bug
its-magic pause
its-magic resume
its-magic stop
its-magic decisions
its-magic blockers
its-magic doctor
```

All operational commands use RuntimeControlPort when runtime is running.

---

# 157. `its-magic doctor`

Checks:

```text
runtime protocol
kernel
provider auth
repo write
artifact integrity
validators
browser
dev runtime
git
node connector
socket permissions
journal
disk
```

---

# 158. Node connector

Core package:

```text
runtime-node-bridge
```

should be thin.

Responsibilities:

- expose local runtime discovery metadata;
- allow node to locate socket;
- authenticate node process;
- translate runtime protocol snapshots/events.

MagicLink remains in Remote repo.

---

# 159. Node discovery file

Optional local file:

```text
.its-magic/runtime/endpoint.json
```

contains:

```text
transport
socket name/path
runtime id
protocol version
pid
```

No secrets.

---

# 160. Local node authentication

Named pipe/UDS permissions may be enough for personal same-user v1.

Still design optional challenge token.

Node must not be able to attach merely because it guessed a TCP port.

---

# 161. Multiple clients

Allow simultaneous:

```text
TUI
CLI
node
```

subscriptions.

Only RuntimeCoordinator mutates state.

---

# 162. Client presence

Runtime may emit:

```text
client.attached
client.detached
```

for diagnostics.

Presence never changes autonomous behavior.

---

# 163. Run continuation without clients

Critical invariant:

```text
connected_clients == 0
```

must have no effect on:

```text
should_continue
```

unless explicit operator policy says otherwise.

---

# 164. Decision timeout policy

If user is away:

```text
decision
```

may:

```text
wait indefinitely
use pre-authorized recommended option
defer
stop current work and continue other independent work
```

according to autonomy config.

Core owns this policy.

---

# 165. Remote-away autonomy

Add optional policy:

```yaml
operator_absent:
  decision_policy: wait
  hard_blocker_policy: stop_item
  independent_work_policy: continue
```

Avoid coupling to app presence.

---

# 166. Independent work scheduling

Future:

If Story A awaits decision and Story B independent:

```text
Sovereign scheduler
  ↓
defer A
continue B
```

This increases autonomy.

Must preserve bounded queue semantics.

---

# 167. Scheduler service

Future:

```ts
interface WorkScheduler {
  next(queue: WorkQueue, context: SchedulerContext): WorkItem | null;
}
```

Current backlog drain logic becomes implementation basis.

---

# 168. Priority commands

Remote:

```text
SetPriority
PinNext
Defer
```

must mutate canonical work planning via service APIs.

---

# 169. Pause semantics

Differentiate:

```text
pause_agent
pause_after_phase
pause_run
pause_repo
```

V1 minimum:

```text
pause_run
```

Do not ambiguously overload `pause`.

---

# 170. Abort semantics

Differentiate:

```text
abort_active_agent
abort_run
```

Remote UI should not accidentally kill whole run if user wants a steer.

---

# 171. Interrupt semantics

`Interrupt`:

```text
abort active agent safely
preserve work
create operator instruction
restart/re-enter phase
```

if policy supports.

Not same as:

```text
AbortRun
```

---

# 172. Retry semantics

Blocker action:

```text
retry
```

uses current bounded retry contract.

Remote cannot reset retry counters unless explicit high-authority action exists.

---

# 173. Restart semantics

Runtime restart:

```text
process recovery
```

is not same as:

```text
restart phase
```

Use separate commands/reason codes.

---

# 174. Runtime snapshot model

```ts
interface RuntimeSnapshot {
  runtime: RuntimeInfo;
  repo: RepoSnapshot;
  activeRun?: RunSnapshot;
  capabilities: CapabilityManifest;
  seq: number;
}
```

---

# 175. Run snapshot model

Include:

```text
run id
state
work item
delivery mode
autonomy profile
phase plan
current phase
role
agent(s)
decisions
blockers
test summary
UAT summary
release state
usage
timestamps
```

---

# 176. Agent snapshot model

```text
agent_run_id
role
kernel
provider
model
state
workspace
started_at
usage
current_activity
```

No chain-of-thought.

---

# 177. Current activity

Derive from safe events:

```text
"Running pytest"
"Editing import_service.py"
"Browser UAT step 4/8"
"Waiting for model"
```

Do not expose hidden reasoning.

---

# 178. Progress model

Avoid fake percentage if unknowable.

Prefer structured counters:

```text
phase 7/12
task 4/8
UAT 6/9
tests 184/184
```

Optional percentage only where denominator is meaningful.

---

# 179. Runtime timeline

Events create timeline:

```text
09:12 phase intake completed
09:14 architecture started
...
```

Useful locally and remotely.

---

# 180. Event redaction

Before runtime event leaves core:

```text
EventRedactor
```

removes:

- token values;
- passwords;
- `.env` contents;
- auth headers;
- private keys;
- tool secret args.

---

# 181. Sensitive path policy

Mark:

```text
.env
*.pem
*.key
credential stores
OAuth token files
```

as:

```text
never_remote_content
```

Metadata may report:

```text
credential configured = true
```

---

# 182. Source code remote policy

V1:

```text
no full arbitrary source transport
```

Later:

```text
safe read snippets
diff summaries
```

through explicit API.

---

# 183. Local-only capabilities

Some actions:

```text
open browser OAuth login
edit raw config
debug runtime internals
```

can advertise:

```text
availability = local_only
```

Remote UI can say:

```text
Requires local action on Windows-Desktop.
```

---

# 184. Kernel crash recovery

If OMP child dies:

```text
kernel.process_exited
```

AgentRunSupervisor decides:

```text
restart session
restart phase
block
```

based on idempotency/safe checkpoint.

---

# 185. Tool idempotency

Important for phase restart.

Classify tools:

```text
read_only
idempotent_write
non_idempotent
destructive
```

Recovery policy uses classification.

---

# 186. Phase checkpointing

At safe boundaries write:

```text
runtime checkpoint
+
canonical artifact checkpoint
```

so restart does not replay destructive work blindly.

---

# 187. Checkpoint service

```ts
interface CheckpointService {
  create(kind: CheckpointKind): Promise<CheckpointRef>;
  latest(): Promise<CheckpointRef | null>;
}
```

---

# 188. Existing pause/resume artifacts

Keep current resume artifacts for semantic continuation.

Runtime snapshot adds process-level continuation.

The two must reconcile.

---

# 189. Reconciliation service

```ts
interface ReconciliationService {
  compare(runtime: RunSnapshot, artifacts: ArtifactSnapshot): ReconciliationResult;
}
```

Conflict:

```text
RUNTIME_ARTIFACT_STATE_CONFLICT
```

fail closed.

---

# 190. Canonical status precedence

Existing backlog authority remains.

Runtime cannot decide story is DONE merely because process reports completion.

Closure must update canonical artifacts successfully.

---

# 191. Runtime cache rebuildability

Operational state should be recoverable from:

```text
artifact state
+
journal
```

as far as possible.

Do not make runtime DB a permanent hidden source of business truth.

---

# 192. Telemetry privacy

Default:

```text
local only
```

Remote events only when node connected/configured.

No mandatory vendor telemetry.

---

# 193. Observability logging

Structured JSON logs:

```json
{
  "level": "info",
  "component": "workflow",
  "run_id": "...",
  "event": "phase_started"
}
```

---

# 194. Log correlation

Every log line can include:

```text
runtime_id
run_id
phase_run_id
agent_run_id
command_id
```

where applicable.

---

# 195. Runtime tracing

Optional OpenTelemetry later.

Do not require it for v1.

---

# 196. Local runtime UI diagnostics

TUI diagnostics overlay:

```text
Runtime PID
Socket
Journal
Last seq
Kernel PID
Event lag
Node attached
Hub status via node projection
```

---

# 197. Remote link status

Core only knows:

```text
node attached?
```

It need not directly know Hub state.

Node may expose optional presence metadata.

---

# 198. Separation from `its-magic-node`

Why keep node separate?

Because node owns:

```text
multi-repo
OS service
Hub link
network retry
node identity
```

Core owns:

```text
one repo runtime
workflow semantics
```

This separation prevents remote infrastructure from contaminating project runtime.

---

# 199. Local multi-repo aggregation

Do not add it to RuntimeCoordinator.

Use:

```text
its-magic-node
```

as aggregator.

---

# 200. Runtime version compatibility

Node handshake:

```text
core runtime protocol 1.2
node supports 1.0-1.3
```

choose compatible.

No need to update every repo immediately.

---

# 201. Auto-upgrade policy

Do not remotely auto-upgrade core in v1.

Expose:

```text
runtime.update_available
```

Later controlled upgrade action can be added.

---

# 202. Framework upgrades with active runs

Upgrade should be blocked or deferred while:

```text
active run
```

unless architecture defines safe rolling handoff.

V1:

```text
RUNTIME_UPGRADE_ACTIVE_RUN_BLOCKED
```

---

# 203. Installer changes

Existing installer should eventually deliver:

```text
host-neutral config examples
runtime metadata directory rules
gitignore additions
runtime protocol version marker
```

But standalone runtime binary/package should be separately installable.

---

# 204. Consumer repo footprint

Keep minimal:

```text
.its-magic/
  config files
  runtime gitignored state

docs/
decisions/
handoffs/
sprints/
work/
```

Do not install Remote web code into consumer repos.

---

# 205. Backward compatibility mode

Current Cursor kit users can continue.

Modes:

```text
host_mode=cursor_legacy
host_mode=opencode_adapter
host_mode=standalone
```

Remote capability is strongest in:

```text
standalone
```

---

# 206. Migration warning

Do not promise persistent background runs for legacy Cursor mode if Cursor owns the agent process.

Capability manifest must say:

```text
persistent_runtime=false
```

when not guaranteed.

---

# 207. OMP-first standalone mode

Recommended default future:

```text
host_mode=standalone
kernel=omp
```

with:

```text
persistent_runtime=true
active_steer=true
rich_tui=true
```

subject to proof spike.

---

# 208. Pi standalone mode

```text
host_mode=standalone
kernel=pi
```

same runtime APIs.

---

# 209. OpenCode standalone/adapter mode

Capability depends on adapter architecture.

Remote clients must not special-case it.

---

# 210. Security architecture

Trust boundaries:

```text
LLM
 ↓
ToolBroker
 ↓
PolicyEngine

Remote Actor
 ↓
RuntimeControlPort
 ↓
PolicyEngine

Node
 ↓
RuntimeControlPort
 ↓
PolicyEngine
```

No privileged bypass path.

---

# 211. Control port security

Named pipe/UDS permissions:

```text
current user only
```

Node service running different account may require explicit ACL/enrollment.

Architecture should support both.

---

# 212. Replay attack protection

State-changing command:

```text
command_id
idempotency_key
actor
timestamp
optional expiry
```

Runtime rejects old/replayed commands when appropriate.

---

# 213. Confirmation tokens

For high-impact actions:

```text
prepare
  ↓
confirmation challenge
  ↓
confirm
```

Example:

```text
production deploy
```

---

# 214. Local emergency stop

Always available:

```bash
its-magic stop --emergency
```

Should:

- signal active agent;
- stop tool processes where possible;
- preserve journal;
- mark ABORTED;
- not delete artifacts.

---

# 215. Remote emergency stop

Capability:

```text
run.abort
```

may require strong remote authorization.

---

# 216. Security-hard gates

Existing security hard gates remain impossible to bypass through:

```text
remote
TUI
CLI
kernel prompt
```

unless future explicit local-only break-glass policy exists.

---

# 217. Break-glass policy

If ever implemented:

```text
local_only
explicit typed confirmation
audit
decision record
disabled by default
```

Not required v1.

---

# 218. Runtime testkit

Create:

```text
packages/runtime-testkit
```

with fake:

```text
AgentKernel
ToolBroker
Clock
FileSystem
```

for deterministic workflow tests.

---

# 219. Fake kernel

Can script:

```text
agent response
tool call
failure
timeout
steer support
```

Use for runtime state machine tests without API cost.

---

# 220. Protocol fixtures

Fixtures for:

```text
run lifecycle
decision
blocker
steer
reconnect
recovery
future capability
```

shared with Remote repo via published package or copied versioned fixtures.

---

# 221. Cross-repo contract testing

Publish:

```text
@its-magic/runtime-protocol
```

or language-neutral JSON Schema artifact.

Remote CI tests against released protocol versions.

---

# 222. Contract release independence

Core release:

```text
3.2.0
```

Remote:

```text
1.8.0
```

They interoperate through protocol version.

No lockstep.

---

# 223. Local runtime package version

Expose:

```text
runtime_version
protocol_version
artifact_schema_version
```

separately.

---

# 224. Feature lifecycle

New core feature steps:

```text
1 implement feature
2 define events/status if remotely relevant
3 register capability
4 register generic action if controllable
5 add schemas
6 add test fixture
7 Remote generic UI works automatically
8 optional future polished Remote UI
```

---

# 225. Example new future feature

Core adds:

```text
dependency_upgrade_autopilot
```

Register:

```text
capability = dependency_upgrade_autopilot
```

Actions:

```text
dependency_upgrade.start
dependency_upgrade.pause
```

Older Remote client displays generic action.

No immediate Remote code release required.

---

# 226. API stability discipline

Never expose internal class names as wire contract.

Example bad:

```text
SovereignLoopStepResult
```

as raw serialized object.

Better:

```text
sovereign.status.v1
```

schema.

---

# 227. Domain DTO layer

Create explicit DTO mapping:

```text
internal domain
   ↓
Runtime DTO
   ↓
protocol
```

prevents refactors from breaking clients.

---

# 228. Runtime protocol documentation

Generate:

```text
docs/runtime-api.md
```

from schemas/types.

Include examples.

---

# 229. Local API playground

Dev command:

```bash
its-magic runtime call run.snapshot
```

Useful before Remote client exists.

---

# 230. Event debug command

```bash
its-magic events --follow
```

shows normalized events.

Proof of abstraction.

---

# 231. Capability debug

```bash
its-magic capabilities
```

shows:

```text
persistent_runtime   yes
steer                yes
browser_uat          yes
parallel_dev         yes
...
```

---

# 232. Action debug

```bash
its-magic actions
```

shows generic actions and schemas.

---

# 233. Local API should be semantic, not UI-shaped

Avoid:

```text
dashboard.card.update
```

Use:

```text
run.state_changed
```

Clients decide rendering.

---

# 234. Local API should be semantic, not kernel-shaped

Avoid:

```text
omp.session.steer
```

Use:

```text
run.steer
```

Kernel adapter implements.

---

# 235. Local API should be semantic, not file-shaped

Avoid:

```text
write backlog line 129
```

Use:

```text
work.create_story
```

---

# 236. Implementation milestone L0 — contracts

Deliver:

- runtime protocol package;
- IDs;
- DTOs;
- events;
- commands;
- snapshots;
- capabilities;
- actions;
- reason codes;
- fixtures.

No persistence yet.

---

# 237. Milestone L1 — persistent runtime shell

Deliver:

- RuntimeCoordinator;
- RunSupervisor;
- repo lock;
- journal;
- snapshots;
- headless `serve`;
- attach/status;
- fake kernel.

Proof:

```text
runtime survives TUI disconnect
```

---

# 238. Milestone L2 — OMP process integration

Deliver:

- OmpKernelAdapter;
- owned OMP child lifecycle;
- normalized events;
- steering;
- abort;
- usage;
- model info;
- kernel health.

Proof:

```text
OMP agent keeps running after TUI exits
```

---

# 239. Milestone L3 — WorkflowEngine

Move `/auto` progression into code-first state machine.

Deliver:

- phase plan;
- role resolver;
- stop matrix;
- transitions;
- pause/resume;
- delivery modes.

---

# 240. Milestone L4 — typed control commands

Deliver:

- Ask;
- FollowUp;
- Steer;
- Pause;
- Resume;
- Abort;
- CreateStory;
- CreateBug;
- ResolveDecision.

---

# 241. Milestone L5 — runtime-native evidence

Deliver:

- native phase-run IDs;
- agent-run IDs;
- runtime proof v2;
- isolation evidence v2;
- legacy validator compatibility.

---

# 242. Milestone L6 — policy/tool hardening

Deliver:

- PolicyEngine;
- ToolBroker;
- role policies;
- actor policies;
- artifact ownership;
- cancellable tools.

---

# 243. Milestone L7 — service extraction

Deliver:

- AppRuntimeService;
- BrowserUatService;
- GitService;
- ReleaseService;
- ClosureService;
- SovereignService;
- CodeIntelligenceService.

---

# 244. Milestone L8 — capability/action framework

Deliver:

- CapabilityRegistry;
- ActionRegistry;
- Config descriptors;
- remote-mutability policy;
- generic action invocation.

---

# 245. Milestone L9 — OMP TUI conversion

Deliver:

- TUI as runtime client;
- detach/reattach;
- live timeline;
- agents;
- decisions;
- blockers;
- runtime diagnostics.

---

# 246. Milestone L10 — node-ready connector

Deliver:

- local endpoint discovery;
- replay;
- multi-client;
- node actor auth;
- compatibility fixtures for Remote repo.

Proof:

```text
its-magic-node can control runtime without knowing OMP
```

---

# 247. Milestone L11 — Pi/OpenCode parity

Implement/adapt enough RuntimeControlPort behavior for:

```text
Pi
OpenCode
```

Capabilities may differ.

Clients still function.

---

# 248. Milestone L12 — host-neutral config migration

Deliver:

- `.its-magic/config`;
- ConfigResolver;
- legacy mappings;
- upgrade tooling;
- standalone defaults.

---

# 249. Suggested local implementation stories

## LM-0001 — Runtime protocol v1

Define all core DTOs and schemas.

## LM-0002 — RuntimeCoordinator

Single repo execution authority.

## LM-0003 — Run journal and snapshot

Crash/reconnect basis.

## LM-0004 — Runtime local transport

Named Pipe / UDS.

## LM-0005 — Headless serve + attach

Detach UI without stopping.

## LM-0006 — OMP kernel lifecycle

Persistent child process.

## LM-0007 — Normalized AgentKernel events

Kernel-neutral event stream.

## LM-0008 — WorkflowEngine extraction

Code-owned `/auto`.

## LM-0009 — RoleResolver + native phase isolation

Hard session boundaries.

## LM-0010 — Runtime proof v2

Execution-native attestation.

## LM-0011 — Runtime CommandBus

Typed commands + receipts.

## LM-0012 — Ask side sessions

Read-only concurrent questions.

## LM-0013 — Story/Bug command intake

Canonical work creation.

## LM-0014 — Follow-up/Steer

Safe injection points.

## LM-0015 — DecisionService

Remote-resolvable decision gates.

## LM-0016 — BlockerService

Structured blockers/actions.

## LM-0017 — Capability/Action Registry

Forward compatibility.

## LM-0018 — PolicyEngine hard enforcement

Models cannot bypass.

## LM-0019 — ToolBroker

Audited/cancellable tools.

## LM-0020 — ArtifactRepository

Ownership-safe mutations.

## LM-0021 — AppRuntimeService

Dev environment as service.

## LM-0022 — BrowserUatService

Remote-observable UAT.

## LM-0023 — Release/Closure services

Completion semantics.

## LM-0024 — SovereignService

Autonomy visibility/control.

## LM-0025 — Usage/Budget service

Remote metrics.

## LM-0026 — Runtime-client SDK

Used by TUI/CLI/node.

## LM-0027 — OMP TUI client migration

Detach/reattach.

## LM-0028 — Node connector contract

Ready for Remote repo.

## LM-0029 — Pi kernel adapter

Secondary backend.

## LM-0030 — OpenCode compatibility adapter

Existing host bridge normalized.

## LM-0031 — Host-neutral config

Standalone migration.

## LM-0032 — Recovery and reconcile

Crash-safe continuation.

---

# 250. Hard proof tests

## P1 — TUI disconnect

1. Start OMP-backed run.
2. Close TUI.
3. Wait for phase transition.
4. Attach again.

PASS:

```text
same run_id
run progressed
no duplicate phase
```

---

## P2 — clientless autonomy

Disconnect every client.

PASS:

```text
run continues
```

until real stop policy triggers.

---

## P3 — node attach

TUI + node connect simultaneously.

PASS:

```text
both receive same event sequence
single runtime authority
```

---

## P4 — remote Ask

Active DEV continues.

Submit `Ask`.

PASS:

```text
fresh read-only side session
DEV unaffected
no artifact mutation
```

---

## P5 — remote FollowUp

Submit:

```text
also test empty CSV fields
```

PASS:

```text
instruction ledger created
safe boundary chosen
instruction reaches correct phase/session
```

---

## P6 — remote Story

Submit story command.

PASS:

```text
PO/intake semantics
canonical backlog/acceptance/evidence
no Hub direct edit
```

---

## P7 — decision reconnect

Create decision.

Disconnect control client.

Reconnect and resolve.

PASS:

```text
same DEC
run continues
resolution audited
```

---

## P8 — Runtime restart

Kill runtime process.

Start again.

PASS:

```text
run recovery
no duplicate destructive action
explicit recovery event
```

---

## P9 — kernel crash

Kill OMP child only.

PASS:

```text
runtime survives
kernel failure structured
safe recovery or blocker
```

---

## P10 — stale command

Send same `idempotency_key` twice.

PASS:

```text
one effect
same receipt/result
```

---

## P11 — policy bypass attempt

Remote asks PO to edit source.

PASS:

```text
DENY
```

before mutation.

---

## P12 — future action

Register unknown new ActionDescriptor.

Old generic client invokes it.

PASS:

```text
schema rendered
action executes
```

---

## P13 — canonical conflict

Manually change backlog/status during run.

PASS:

```text
reconciliation detects conflict
fail closed
```

---

## P14 — sleep/resume

Suspend Windows.

Resume.

PASS:

```text
runtime emits resume
rechecks child/app/browser
reconciles state
```

---

## P15 — zero clients

Run with:

```text
connected_clients=0
```

PASS:

```text
no artificial pause
```

---

# 251. Security proof tests

- Node cannot invoke unadvertised action.
- Remote actor cannot bypass security-hard gate.
- Raw OMP tool endpoint is not exposed.
- `.env` is never returned through artifact API.
- OAuth tokens are never present in runtime events.
- Viewer actor cannot steer.
- Duplicate decision resolution is rejected/idempotent.
- High-risk action requires required confirmation.
- Runtime socket rejects unauthorized OS user where configured.
- Artifact ownership rules apply equally to local and remote actors.

---

# 252. Recovery proof tests

- crash during model response;
- crash during read-only tool;
- crash during source edit;
- crash during test;
- crash during release;
- crash during closure;
- crash after artifact write before event commit;
- journal truncated tail;
- stale runtime lock;
- artifact/runtime divergence.

Every case must have deterministic recovery classification.

---

# 253. Performance goals

Control API should add negligible overhead to model execution.

Targets:

```text
snapshot local       < 100 ms typical
command receipt      < 100 ms typical
event publish        < 10 ms local overhead
TUI update           responsive
journal append       bounded
```

Do not let UI/event logging dominate token/tool execution.

---

# 254. Token efficiency

Runtime migration must not expand every prompt with remote metadata.

Remote state belongs outside LLM context.

Only inject operator instruction when relevant.

---

# 255. Context rules

Do not inject:

```text
all connected devices
Hub state
notification history
```

into agents.

Agent receives only workflow-relevant context.

---

# 256. Operator instructions context

New instruction:

```text
bounded
targeted
auditable
```

Only relevant current/new phase receives it.

---

# 257. Versioning strategy

Core runtime:

```text
semver
```

Runtime protocol:

```text
independent major/minor
```

Artifact schemas:

```text
versioned individually
```

Kernel adapter versions internal.

---

# 258. Compatibility matrix

Document:

| Core | Runtime Protocol | OMP | Pi | OpenCode | Node |
|---|---|---|---|---|---|
| 3.x | 1.x | supported range | supported | supported | 1.x |

Do not silently accept unsupported combinations.

---

# 259. Reason-code families to add

```text
RUNTIME_*
RUN_*
COMMAND_*
KERNEL_*
RECOVERY_*
CONTROL_PORT_*
CAPABILITY_*
ACTION_*
REMOTE_ACTOR_*
JOURNAL_*
RECONCILIATION_*
```

Examples:

```text
RUNTIME_ALREADY_OWNED
RUN_NOT_ACTIVE
COMMAND_UNSUPPORTED
COMMAND_INJECTION_DEFERRED
KERNEL_STEER_UNSUPPORTED
RECOVERY_UNSAFE
CONTROL_PORT_UNAUTHORIZED
CAPABILITY_NOT_AVAILABLE
ACTION_CONFIRMATION_REQUIRED
RECONCILIATION_CONFLICT
```

---

# 260. Documentation to add

```text
docs/runtime/
├── architecture.md
├── protocol.md
├── persistence.md
├── recovery.md
├── commands.md
├── events.md
├── capabilities.md
├── security.md
├── node-integration.md
└── migration.md
```

---

# 261. Developer runbook

Must explain:

```text
start runtime
attach TUI
inspect events
submit commands
simulate reconnect
kill/recover kernel
run protocol fixtures
debug node connection
```

---

# 262. Operator runbook

Must explain:

```text
what continues after TUI close
what happens during PC sleep
how to pause
how to stop safely
how to recover
how to see active run
how Remote connects
```

---

# 263. Important laptop limitation

Document clearly:

> Detaching the TUI does not stop a run. Turning off/suspending the machine does stop CPU execution. For truly continuous autonomy, use an always-on runner.

Core must support both local and always-on runner deployment.

---

# 264. Local Windows target

Primary v1 local target:

```text
Windows 11
```

with:

- OMP;
- Named Pipe;
- background runtime process;
- `its-magic-node`;
- TUI attach;
- browser UAT.

---

# 265. Linux target

Primary always-on target:

```text
Debian/Ubuntu-like Linux
```

with:

- headless runtime;
- UDS;
- systemd-managed node;
- optional headless browser;
- Git worktrees.

---

# 266. Runtime process strategy

Two viable designs:

## A — node owns one runtime child per repo

Recommended for Remote.

```text
its-magic-node
   ├── runtime repo A
   └── runtime repo B
```

## B — independently started runtime

Node discovers/attaches.

Support both.

---

# 267. Recommended ownership policy

If node is installed:

```text
node preferred supervisor
```

If not:

```text
CLI/TUI can spawn detached runtime
```

Same RuntimeControlPort either way.

---

# 268. Detached process launch

Windows needs reliable detached process semantics.

Do not use fragile:

```text
shell background &
```

Implement platform-specific supervisor launch.

---

# 269. Runtime PID is not identity

Use:

```text
runtime_id
```

PID can change after recovery.

---

# 270. Repo identity

Generate stable:

```text
repo_id
```

stored in host-neutral metadata.

Do not derive only from filesystem path.

Paths change.

---

# 271. Repo ID file

Example:

```text
.its-magic/repo.json
```

```json
{
  "repo_id": "repo_01...",
  "created_at": "..."
}
```

No machine-specific path committed unless policy decides otherwise.

---

# 272. Clones and repo IDs

Need architecture decision:

Should a Git clone inherit same repo identity or generate node-local instance identity?

Recommended:

```text
project_id = stable logical project
workspace_id = local clone/worktree
```

Remote can distinguish.

---

# 273. Project vs workspace identity

```text
project_id
repo/workspace_id
node_id
```

Example:

```text
Forest Guardian
 ├── Windows workspace
 └── Debian autonomous workspace
```

Important for future runner migration.

---

# 274. Run portability

V1:

```text
run stays on same workspace/node
```

Future:

```text
pause → sync Git/artifacts → move to runner
```

out of scope for local v1.

---

# 275. Runtime API test client

Ship:

```bash
its-magic rpc
```

or similar interactive dev tool.

Allows manual:

```text
run.snapshot
events.subscribe
run.pause
```

---

# 276. OpenAPI?

Local RuntimeControlPort need not be HTTP.

Use JSON Schema/protocol docs.

Remote Hub uses OpenAPI separately.

---

# 277. Binary protocol?

Not needed v1.

JSON/NDJSON is sufficient and inspectable.

---

# 278. Event compression

High volume future:

- batch token deltas;
- coalesce progress;
- sample logs.

Lifecycle events never dropped.

---

# 279. Backpressure

Slow client must not stall agent execution.

Each subscriber gets bounded buffer.

On overflow:

```text
CLIENT_EVENT_GAP
```

client re-requests snapshot/replay.

---

# 280. Journal compaction

After completed run:

```text
snapshot final
archive durable summary
rotate event journal
```

Keep bounded retention.

---

# 281. Runtime retention config

```yaml
runtime:
  completed_run_retention_days: 30
  event_journal_max_mb: 100
```

Operational only.

Canonical artifacts remain according to project policy.

---

# 282. Privacy modes

Remote export level:

```text
minimal
standard
verbose
```

Minimal:

```text
status/phase/reason codes
```

Standard:

```text
summaries/evidence refs
```

Verbose:

```text
selected logs/tool summaries
```

---

# 283. Default remote export

Recommended:

```text
standard
```

but still secret-redacted.

---

# 284. Local-only project mode

User can set:

```text
REMOTE_CONTROL=off
```

Runtime remains fully functional locally.

Capabilities to node:

```text
remote_available=false
```

---

# 285. Per-repo remote permission

```yaml
remote:
  enabled: true
  allow:
    - ask
    - work.create
    - decision.resolve
    - run.steer
```

Optional fine-grained policy.

---

# 286. Remote view-only mode

```text
remote.mode = viewer
```

Node can observe only.

Useful for sensitive repositories.

---

# 287. Remote mutation audit

Every remote mutation records:

```text
actor
device
node
command
effective boundary
policy result
canonical changes
```

---

# 288. TUI and Remote parity

If an action exists remotely, local TUI should generally be able to invoke same RuntimeCommand.

This avoids two behavior implementations.

---

# 289. CLI parity

CLI:

```bash
its-magic pause
```

and Android Pause send same:

```text
PauseCommand
```

---

# 290. Future VS Code extension

A VS Code client can attach to RuntimeControlPort.

No new orchestration code required.

---

# 291. Future Home Assistant integration

Could consume Hub API, not core.

Core remains product-neutral.

---

# 292. Future watch

No local-core changes required beyond already-defined summaries/actions/capabilities.

That proves architecture quality.

---

# 293. v1 Definition of Done — local core

- [ ] RuntimeCoordinator is the single repo execution authority.
- [ ] Runtime can run headless.
- [ ] TUI can detach without stopping run.
- [ ] TUI can reattach to same run.
- [ ] Run has stable ID independent of chat/kernel session.
- [ ] Runtime has local durable journal.
- [ ] Runtime recovers deterministically after restart.
- [ ] RuntimeControlPort works on Windows and Linux.
- [ ] Runtime events are normalized and replayable.
- [ ] Runtime commands are typed and idempotent.
- [ ] Ask runs in isolated read-only session.
- [ ] Story creation routes through canonical intake.
- [ ] Bug creation routes through canonical intake.
- [ ] Follow-up is auditable.
- [ ] Steering uses explicit safe injection boundary.
- [ ] Decision gates are structured and remotely resolvable where policy allows.
- [ ] Blockers are structured with reason codes/actions.
- [ ] Capability manifest is published.
- [ ] Dynamic action catalog is published.
- [ ] OMP is supported as primary standalone kernel.
- [ ] OMP child lifecycle is owned by runtime, not TUI.
- [ ] Existing role isolation remains fail-closed.
- [ ] Runtime-native proof exists.
- [ ] PolicyEngine enforces tool/role/actor permissions.
- [ ] App runtime status is exposed semantically.
- [ ] Browser UAT status is exposed semantically.
- [ ] Release/closure completion semantics are preserved.
- [ ] Sovereign/autonomy status is inspectable.
- [ ] Secrets are redacted before event/API boundary.
- [ ] `its-magic-node` can attach without kernel-specific knowledge.
- [ ] All current canonical artifacts remain authoritative.

---

# 294. v2 Definition of Done — local core

- [ ] Pi adapter parity.
- [ ] OpenCode adapter parity.
- [ ] host-neutral `.its-magic/config`.
- [ ] runtime proof v2 fully authoritative.
- [ ] Python validator JSON APIs.
- [ ] richer runtime metrics.
- [ ] external edit conflict detection.
- [ ] worktree service.
- [ ] safe source/diff remote read APIs.
- [ ] headless browser runner maturity.
- [ ] Linux always-on runner hardening.

---

# 295. Non-goals for first local migration

Do not attempt simultaneously:

- Android app;
- Hub;
- push notifications;
- Wear OS;
- cloud runner migration;
- full Python-to-TypeScript rewrite;
- new semantic code index from scratch;
- multi-user RBAC server;
- SaaS billing;
- arbitrary remote shell;
- remote full IDE.

Those belong to later layers/plans.

---

# 296. Critical architectural decisions to lock

## D1 — Runtime state path

Recommend:

```text
.its-magic/runtime/
```

gitignored.

## D2 — local transport

Recommend:

```text
Named Pipe / UDS
```

with localhost fallback only for development.

## D3 — process owner

Recommend:

```text
node preferred
detached runtime fallback
```

## D4 — OMP integration mode

Benchmark:

```text
embedded SDK vs RPC child
```

For isolation/persistence, favor RPC child if feature parity is sufficient.

## D5 — operator instruction ledger

Decide canonical/audit storage.

## D6 — runtime proof migration

Define v1 + v2 compatibility period.

## D7 — host-neutral config precedence

Lock exact chain.

## D8 — remote action policy

Define fields and confirmation model.

## D9 — project/workspace identity

Lock clone/worktree semantics.

## D10 — recovery boundaries

Classify phases/actions safe for automatic phase restart.

---

# 297. Recommended first proof spike

Do **not** start by refactoring all current commands.

Implement the thinnest persistent vertical slice:

```text
existing its-magic workflow
       │
       ▼
RuntimeCoordinator
       │
       ▼
OmpKernelAdapter
       │
       ▼
OMP child
       │
       ▼
RuntimeControlPort
       │
       ├── tiny CLI client
       └── tiny TUI client
```

Test:

```text
1 start runtime
2 start one autonomous work item
3 detach TUI
4 agent continues
5 attach CLI status
6 attach TUI again
7 send read-only ask
8 send follow-up
9 trigger decision
10 resolve decision through control port
11 finish QA/release/closure
12 stop runtime gracefully
13 restart runtime and inspect completed run
```

If this works, then connect `its-magic-node`.

---

# 298. Recommended implementation order

```text
1 protocol
2 persistent runtime shell
3 OMP lifecycle
4 detach/reattach
5 workflow state machine extraction
6 typed commands
7 decisions/blockers
8 runtime-native isolation/proofs
9 policy/tool broker
10 capability/action registry
11 runtime services
12 node connector
13 Remote Hub
```

Do not build Remote UI before steps 1–6 are proven.

---

# 299. Final target vision

Local `its-magic` becomes:

```text
                    its-magic runtime
                           │
             ┌─────────────┼──────────────┐
             │             │              │
         Workflow        Policy        Memory
             │             │              │
             └─────── AgentKernel ────────┘
                           │
                     OMP / Pi / OpenCode
                           │
                    autonomous work
                           │
                    durable runtime
                           │
                     event/control API
                           │
             ┌─────────────┼──────────────┐
             │             │              │
            TUI           CLI      its-magic-node
                                        │
                                        ▼
                                Remote Control Plane
```

The decisive shift is:

```text
OLD
chat/session = execution container

NEW
runtime = execution container
chat/TUI/app = client
```

That change enables everything else:

- persistent agents;
- remote control;
- Android;
- Windows app;
- smartwatch;
- voice;
- notifications;
- multi-repo dashboard;
- always-on runners;
- maximum autonomy;

without sacrificing the current artifact-first and fail-closed design.

---

# 300. Final recommendation

Treat this local-runtime program as the **foundational migration for the next generation of its-magic**.

The OMP masterplan defines the best local agent experience.

The Remote masterplan defines the distributed control experience.

This plan defines the contract that makes both possible.

The correct dependency direction is:

```text
its-magic local runtime
        ↓ exposes
RuntimeControlPort
        ↓ consumed by
its-magic-node
        ↓ connects to
its-magic Remote
```

and simultaneously:

```text
its-magic local runtime
        ↓ consumed by
OMP-based local TUI
```

Therefore **Remote and TUI become two views of exactly the same autonomous runtime**, rather than two independent ways of driving an LLM.

That is the architecture to build toward.
