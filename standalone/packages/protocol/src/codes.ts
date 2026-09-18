export const PROTOCOL_VERSION = 1;
export const SUPPORTED_PROTOCOL_MIN = 1;
export const SUPPORTED_PROTOCOL_MAX = 1;

export const PROTOCOL_VERSION_MISMATCH = "PROTOCOL_VERSION_MISMATCH";
export const PROTOCOL_COMMAND_UNSUPPORTED = "PROTOCOL_COMMAND_UNSUPPORTED";
export const DAEMON_UNREACHABLE = "DAEMON_UNREACHABLE";
export const DAEMON_CONTROLLER_BUSY = "DAEMON_CONTROLLER_BUSY";
export const EVENT_SEQ_GAP = "EVENT_SEQ_GAP";
export const APPROVAL_NO_CONTROLLER = "APPROVAL_NO_CONTROLLER";
export const RECONCILE_INCOMPLETE = "RECONCILE_INCOMPLETE";
export const DAEMON_EVENT_LAG_MAX = "DAEMON_EVENT_LAG_MAX";

export const DAEMON_RPC_METHODS = [
	"daemon.ping",
	"daemon.hello",
	"run.start",
	"run.attach",
	"command.submit",
	"approval.respond",
	"run.cancel",
	"status.snapshot",
] as const;

export type DaemonRpcMethod = (typeof DAEMON_RPC_METHODS)[number];
