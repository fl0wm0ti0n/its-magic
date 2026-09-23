import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
	DAEMON_UNREACHABLE,
	EVENT_SEQ_GAP,
	jsonRpcCall,
	type RuntimeEvent,
} from "@its-magic/protocol";
import WebSocket from "ws";
import type {
	AttachRunInput,
	CancelRunInput,
	OperatorTransport,
	RespondApprovalInput,
	SubmitCommandInput,
	SubscribeEventsInput,
} from "./operator-transport.ts";

export interface DaemonTransportOptions {
	projectRoot: string;
	client_kind?: "cli" | "tui" | "test";
	client_id?: string;
	baseUrl?: string;
	token?: string;
}

function loadListen(projectRoot: string): { host: string; port: number; token: string } {
	const listenPath = join(projectRoot, ".its-magic", "daemon", "listen.json");
	const tokenPath = join(projectRoot, ".its-magic", "daemon", "client.token");
	const listen = JSON.parse(readFileSync(listenPath, "utf8")) as { host: string; port: number };
	const token = readFileSync(tokenPath, "utf8").trim();
	return { host: listen.host, port: listen.port, token };
}

export function createDaemonTransport(opts: DaemonTransportOptions): OperatorTransport {
	const clientKind = opts.client_kind ?? "cli";
	const clientId = opts.client_id ?? `${clientKind}-${crypto.randomUUID()}`;

	const resolveEndpoint = () => {
		if (opts.baseUrl && opts.token) {
			return { baseUrl: opts.baseUrl, token: opts.token };
		}
		try {
			const { host, port, token } = loadListen(opts.projectRoot);
			return { baseUrl: `http://${host}:${port}`, token };
		} catch {
			const err = new Error("Start the daemon: itsm daemon start (or npm run daemon)") as Error & {
				reason_code?: string;
			};
			err.reason_code = DAEMON_UNREACHABLE;
			throw err;
		}
	};

	return {
		kind: "daemon",
		async attachRun(input: AttachRunInput) {
			const { baseUrl, token } = resolveEndpoint();
			return jsonRpcCall(baseUrl, token, "run.attach", {
				run_id: input.run_id,
				role: input.role,
				client_id: input.client_id ?? clientId,
				client_kind: input.client_kind ?? clientKind,
			});
		},
		async submitCommand(input: SubmitCommandInput) {
			const { baseUrl, token } = resolveEndpoint();
			return jsonRpcCall(baseUrl, token, "command.submit", {
				run_id: input.run_id,
				argv: input.argv,
				client_id: input.client_id ?? clientId,
				client_kind: input.client_kind ?? clientKind,
			});
		},
		async cancel(input: CancelRunInput) {
			const { baseUrl, token } = resolveEndpoint();
			return jsonRpcCall(baseUrl, token, "run.cancel", {
				run_id: input.run_id,
				client_id: input.client_id ?? clientId,
				client_kind: input.client_kind ?? clientKind,
			});
		},
		async respondApproval(input: RespondApprovalInput) {
			const { baseUrl, token } = resolveEndpoint();
			return jsonRpcCall(baseUrl, token, "approval.respond", {
				run_id: input.run_id,
				approval_id: input.approval_id,
				choice: input.choice,
			});
		},
		async subscribeEvents(input: SubscribeEventsInput) {
			const { baseUrl, token } = resolveEndpoint();
			const wsUrl = `${baseUrl.replace(/^http/, "ws")}/v1/events?run_id=${encodeURIComponent(input.run_id)}&after_seq=${input.after_seq}`;
			const ws = new WebSocket(wsUrl, { headers: { authorization: `Bearer ${token}` } });
			let lastSeq = input.after_seq;
			const drain = (raw: Buffer) => {
				const data = JSON.parse(String(raw)) as RuntimeEvent & { reason_code?: string };
				if (data.reason_code === EVENT_SEQ_GAP) {
					input.onGap?.(lastSeq + 1, data.seq);
					return;
				}
				if (data.summary && data.evidence_ref) {
					input.onLagSummary?.(data.evidence_ref);
				}
				if (data.seq > lastSeq + 1) {
					input.onGap?.(lastSeq + 1, data.seq);
				}
				lastSeq = data.seq;
				input.onEvent(data);
			};
			ws.on("message", (raw) => drain(Buffer.from(raw as Buffer)));
			await new Promise<void>((resolve, reject) => {
				if (ws.readyState === WebSocket.OPEN) {
					resolve();
					return;
				}
				ws.once("open", () => resolve());
				ws.once("error", () => reject(new Error(DAEMON_UNREACHABLE)));
			});
			return {
				unsubscribe: () => {
					ws.close();
				},
			};
		},
	};
}

export async function isDaemonReachable(projectRoot: string): Promise<boolean> {
	try {
		const { baseUrl, token } = (() => {
			const { host, port, token } = loadListen(projectRoot);
			return { baseUrl: `http://${host}:${port}`, token };
		})();
		await jsonRpcCall(baseUrl, token, "daemon.ping", {});
		return true;
	} catch {
		return false;
	}
}
