import { randomBytes } from "node:crypto";
import { chmodSync, mkdirSync, writeFileSync } from "node:fs";
import { createServer, type IncomingMessage } from "node:http";
import { join } from "node:path";
import {
	APPROVAL_NO_CONTROLLER,
	DAEMON_CONTROLLER_BUSY,
	EVENT_SEQ_GAP,
	type JsonRpcResponse,
	PROTOCOL_COMMAND_UNSUPPORTED,
	PROTOCOL_VERSION,
	PROTOCOL_VERSION_MISMATCH,
	redactEventPayload,
	SUPPORTED_PROTOCOL_MAX,
	SUPPORTED_PROTOCOL_MIN,
} from "@its-magic/protocol";
import type { SessionSupervisor } from "@its-magic/role-runtime";
import {
	crashResume,
	createCommandRouter,
	createOperatorCommandFacade,
	createOperatorObservabilityService,
	createOperatorSession,
	createRunsStore,
	readRepoResume,
	reconcileOperationalLedger,
} from "@its-magic/runtime-core";
import type { RuntimeHost } from "@its-magic/runtime-host";
import { WebSocketServer } from "ws";
import { DaemonEventStore } from "./event-store.ts";

export interface DaemonServerDeps {
	projectRoot: string;
	runtime?: RuntimeHost;
	/** Test-only dependency seam. Production callers inject RuntimeHost. */
	supervisor?: SessionSupervisor;
	port?: number;
	host?: string;
	skipStartupReconcile?: boolean;
	forceCompat?: boolean;
}

export interface StartedDaemon {
	host: string;
	port: number;
	token: string;
	baseUrl: string;
	close: () => Promise<void>;
	workflowEngineCount: () => number;
	session: ReturnType<typeof createOperatorSession>;
}

let singletonWorkflowEngines = 0;

function writeListenFiles(projectRoot: string, host: string, port: number, token: string) {
	const dir = join(projectRoot, ".its-magic", "daemon");
	mkdirSync(dir, { recursive: true });
	const listenPath = join(dir, "listen.json");
	const tokenPath = join(dir, "client.token");
	writeFileSync(
		listenPath,
		JSON.stringify({ host, port, protocol_version: PROTOCOL_VERSION }, null, 2),
	);
	writeFileSync(tokenPath, token, { mode: 0o600 });
	try {
		chmodSync(tokenPath, 0o600);
	} catch {
		// Windows may ignore mode bits
	}
}

function parseBearer(req: IncomingMessage): string | null {
	const h = req.headers.authorization;
	if (!h?.startsWith("Bearer ")) {
		return null;
	}
	return h.slice("Bearer ".length).trim();
}

function jsonRpcError(
	id: string | number | null,
	code: number,
	message: string,
	reason_code?: string,
): JsonRpcResponse {
	return {
		jsonrpc: "2.0",
		id,
		error: { code, message, data: reason_code ? { reason_code } : undefined },
	};
}

export async function startDaemonServer(deps: DaemonServerDeps): Promise<StartedDaemon> {
	if (!deps.runtime && !deps.supervisor) {
		throw new Error("RUNTIME_HOST_REQUIRED");
	}
	const supervisor = deps.runtime?.supervisor ?? deps.supervisor;
	if (!supervisor) {
		throw new Error("RUNTIME_HOST_REQUIRED");
	}
	const host = deps.host ?? "127.0.0.1";
	if (host === "0.0.0.0" && process.env.ITS_MAGIC_DAEMON_REMOTE !== "1") {
		throw new Error("remote_bind_denied");
	}
	const token = randomBytes(24).toString("hex");
	const store =
		deps.runtime?.store ??
		createRunsStore(join(deps.projectRoot, ".its-magic", "daemon", "ops.sqlite"));
	const eventStore = new DaemonEventStore(
		join(deps.projectRoot, ".its-magic", "daemon", "events.sqlite"),
	);
	const router =
		deps.runtime?.router ??
		createCommandRouter({ supervisor, config: {}, kernelRoot: deps.projectRoot });
	const facade = createOperatorCommandFacade({ router });
	const observability = createOperatorObservabilityService({
		projectRoot: deps.projectRoot,
		store,
	});
	const session = createOperatorSession({
		onCancel: () => {
			eventStore.append(activeRunId, "run.cancelled", { source: "daemon" });
		},
	});
	singletonWorkflowEngines += 1;

	if (!deps.skipStartupReconcile) {
		try {
			const { brief, state_md } = readRepoResume(deps.projectRoot);
			await crashResume({
				supervisor,
				store,
				config: {},
				repo: { backlog_status: "OPEN", acceptance_done: false, sprint_done: false },
				brief,
				state_md,
				orchestrator_run_id: "daemon-startup",
				model_id: "inherit",
			});
			reconcileOperationalLedger({ projectRoot: deps.projectRoot, store });
		} catch {
			// Tests may use skipStartupReconcile or minimal fixtures
		}
	}

	let activeRunId = `run-${crypto.randomUUID()}`;
	let controllerClient: { client_id: string; client_kind: string } | null = null;
	const observers = new Set<string>();

	const wss = new WebSocketServer({ noServer: true });

	const httpServer = createServer(async (req, res) => {
		if (req.url === "/rpc" && req.method === "POST") {
			const bearer = parseBearer(req);
			if (bearer !== token) {
				res.writeHead(401);
				res.end();
				return;
			}
			const chunks: Buffer[] = [];
			for await (const chunk of req) {
				chunks.push(chunk as Buffer);
			}
			const body = JSON.parse(Buffer.concat(chunks).toString("utf8")) as {
				jsonrpc: string;
				id: string | number;
				method: string;
				params?: Record<string, unknown>;
			};
			const respond = (payload: JsonRpcResponse) => {
				res.writeHead(200, { "content-type": "application/json" });
				res.end(JSON.stringify(redactEventPayload(payload)));
			};
			const { id, method, params = {} } = body;

			if (method === "daemon.ping") {
				respond({ jsonrpc: "2.0", id, result: { ok: true } });
				return;
			}
			if (method === "daemon.hello") {
				const clientVersion = Number(params.protocol_version ?? PROTOCOL_VERSION);
				const forceCompat = deps.forceCompat || params.force_compat === 1;
				if (
					!forceCompat &&
					(clientVersion < SUPPORTED_PROTOCOL_MIN || clientVersion > SUPPORTED_PROTOCOL_MAX)
				) {
					respond(jsonRpcError(id, -32000, PROTOCOL_VERSION_MISMATCH, PROTOCOL_VERSION_MISMATCH));
					return;
				}
				respond({
					jsonrpc: "2.0",
					id,
					result: {
						protocol_version: PROTOCOL_VERSION,
						supported_protocol_range: {
							min: SUPPORTED_PROTOCOL_MIN,
							max: SUPPORTED_PROTOCOL_MAX,
						},
						capabilities: ["events", "controller", "observer"],
						server_id: "its-magic-daemon",
					},
				});
				return;
			}
			if (
				![
					"run.start",
					"run.attach",
					"command.submit",
					"approval.respond",
					"run.cancel",
					"status.snapshot",
				].includes(method)
			) {
				respond(
					jsonRpcError(id, -32601, PROTOCOL_COMMAND_UNSUPPORTED, PROTOCOL_COMMAND_UNSUPPORTED),
				);
				return;
			}
			if (method === "run.start") {
				activeRunId = `run-${crypto.randomUUID()}`;
				eventStore.append(activeRunId, "run.started", {
					orchestrator_run_id: params.orchestrator_run_id ?? "local",
				});
				respond({ jsonrpc: "2.0", id, result: { ok: true, run_id: activeRunId } });
				return;
			}
			if (method === "run.attach") {
				const role = String(params.role ?? "observer");
				const client_id = String(params.client_id ?? "anonymous");
				const client_kind = String(params.client_kind ?? "test");
				if (role === "controller") {
					if (controllerClient) {
						respond(jsonRpcError(id, -32000, DAEMON_CONTROLLER_BUSY, DAEMON_CONTROLLER_BUSY));
						return;
					}
					controllerClient = { client_id, client_kind };
				} else {
					observers.add(client_id);
				}
				eventStore.append(String(params.run_id ?? activeRunId), "run.attached", {
					role,
					client_id,
					client_kind,
				});
				respond({
					jsonrpc: "2.0",
					id,
					result: { ok: true, run_id: params.run_id ?? activeRunId, role },
				});
				return;
			}
			if (method === "command.submit") {
				const argv = (params.argv as string[]) ?? [];
				const outcome = await facade.routeArgv(argv);
				const run_id = String(params.run_id ?? activeRunId);
				eventStore.append(run_id, "command.submitted", { argv, outcome });
				respond({ jsonrpc: "2.0", id, result: redactEventPayload({ ok: true, outcome }) });
				return;
			}
			if (method === "approval.respond") {
				if (!controllerClient) {
					respond(jsonRpcError(id, -32000, APPROVAL_NO_CONTROLLER, APPROVAL_NO_CONTROLLER));
					return;
				}
				const approval_id = String(params.approval_id ?? "");
				eventStore.append(String(params.run_id ?? activeRunId), "approval.responded", {
					approval_id,
					choice: params.choice,
					client_id: controllerClient.client_id,
				});
				respond({ jsonrpc: "2.0", id, result: { ok: true } });
				return;
			}
			if (method === "run.cancel") {
				const result = session.cancel();
				eventStore.append(String(params.run_id ?? activeRunId), "run.cancelled", {
					...result,
					client_id: params.client_id,
					client_kind: params.client_kind,
				});
				respond({ jsonrpc: "2.0", id, result });
				return;
			}
			if (method === "status.snapshot") {
				const snap = observability.buildStatusSnapshot();
				respond({ jsonrpc: "2.0", id, result: redactEventPayload(snap) });
				return;
			}
			respond(jsonRpcError(id, -32601, PROTOCOL_COMMAND_UNSUPPORTED, PROTOCOL_COMMAND_UNSUPPORTED));
			return;
		}
		res.writeHead(404);
		res.end();
	});

	httpServer.on("upgrade", (req, socket, head) => {
		if (!req.url?.startsWith("/v1/events")) {
			socket.destroy();
			return;
		}
		const bearer = parseBearer(req);
		if (bearer !== token) {
			socket.destroy();
			return;
		}
		wss.handleUpgrade(req, socket, head, (ws) => {
			const url = new URL(req.url ?? "", "http://127.0.0.1");
			const run_id = url.searchParams.get("run_id") ?? activeRunId;
			let after = Number.parseInt(url.searchParams.get("after_seq") ?? "0", 10);
			const replay = eventStore.listAfter(run_id, after);
			let expected = after;
			for (const ev of replay) {
				if (ev.seq !== expected + 1 && expected > 0) {
					ws.send(JSON.stringify({ reason_code: EVENT_SEQ_GAP, seq: ev.seq }));
				}
				expected = ev.seq;
				ws.send(JSON.stringify(ev));
			}
			after = expected;
			const interval = setInterval(() => {
				const batch = eventStore.listAfter(run_id, after);
				for (const ev of batch) {
					if (ev.seq > after + 1) {
						ws.send(JSON.stringify({ reason_code: EVENT_SEQ_GAP, seq: ev.seq }));
					}
					after = ev.seq;
					const lag = batch.length;
					const summary = eventStore.summaryIfLagged(run_id, lag);
					if (summary) {
						ws.send(JSON.stringify(summary));
					} else {
						ws.send(JSON.stringify(ev));
					}
				}
			}, 50);
			ws.on("close", () => clearInterval(interval));
		});
	});

	await new Promise<void>((resolve) => {
		httpServer.listen(deps.port ?? 0, host, () => resolve());
	});
	const addr = httpServer.address();
	const port = typeof addr === "object" && addr ? addr.port : 0;
	writeListenFiles(deps.projectRoot, host, port, token);

	return {
		host,
		port,
		token,
		baseUrl: `http://${host}:${port}`,
		session,
		workflowEngineCount: () => singletonWorkflowEngines,
		close: async () => {
			for (const client of wss.clients) {
				client.close();
			}
			eventStore.close();
			if (deps.runtime) {
				deps.runtime.dispose();
			} else {
				store.close();
			}
			await new Promise<void>((resolve) => wss.close(() => resolve()));
			await new Promise<void>((resolve) => httpServer.close(() => resolve()));
		},
	};
}

export function requestApprovalOnDaemon(
	eventStore: DaemonEventStore,
	run_id: string,
	approval_id: string,
): void {
	eventStore.append(run_id, "approval.requested", { approval_id });
}
