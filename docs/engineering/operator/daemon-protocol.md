# Daemon control protocol (US-0148)

Local-only operator control for CLI/TUI clients. Workflow rules remain in `@its-magic/runtime-core`; the daemon delegates to existing operator facades.

## Transport

- JSON-RPC 2.0 over HTTP on loopback (`127.0.0.1` / `::1` by default).
- Ordered events on WebSocket `GET /v1/events?run_id=&after_seq=`.
- Listen metadata: `.its-magic/daemon/listen.json` (`host`, `port`, `protocol_version`).
- Bearer token: `.its-magic/daemon/client.token` (0600-class).

Remote bind (`0.0.0.0`) requires `ITS_MAGIC_DAEMON_REMOTE=1`.

## RPC methods

| Method | Purpose |
|--------|---------|
| `daemon.ping` | Liveness |
| `daemon.hello` | Protocol negotiation |
| `run.start` | Start a run under daemon |
| `run.attach` | Attach as `controller` or `observer` |
| `command.submit` | Delegate argv to `OperatorCommandFacade` |
| `approval.respond` | Controller-only approval |
| `run.cancel` | Delegates to `OperatorSession.cancel` |
| `status.snapshot` | Bounded observability snapshot |

## Events

- Per-run SQLite append-only log (`run_id`, monotonic `seq`).
- Subscribe with `after_seq`; server replays then streams live.
- Gap → `EVENT_SEQ_GAP`.
- Client lag beyond `DAEMON_EVENT_LAG_MAX` → summary events with `evidence_ref`.

## Client transport

- `OperatorTransport` in `runtime-core/src/daemon-client/`.
- Production default: `DaemonTransport` when daemon is reachable.
- US-0146 contract doubles: `InProcessTransport` (`ITS_MAGIC_IN_PROCESS=1`).

## Deferred (out of v1)

- Rich remote clients, npm-published protocol packages, US-0145 delivery/deploy in daemon.
