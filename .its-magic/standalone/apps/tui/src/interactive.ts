import readline from "node:readline";
import type { Readable, Writable } from "node:stream";
import { redactEventPayload } from "@its-magic/protocol";
import {
	createOperatorSession,
	OPERATOR_INPUT_REQUIRED,
	OPERATOR_RUN_ID,
	type OperatorStatusSnapshot,
	type OperatorTimelineEntry,
	type OperatorTransport,
	resolveOperatorTransport,
} from "@its-magic/runtime-core";
import { renderInteractiveLayout, type SurfaceEvent } from "./interactive-panels.ts";
import type { TuiPanelModel } from "./panels.ts";

export type InteractiveAction = "submit" | "approve" | "deny" | "cancel" | "pause" | "resume";

export interface KeyPress {
	name?: string;
	ctrl?: boolean;
	meta?: boolean;
	sequence?: string;
}

export function actionForKey(key: KeyPress): InteractiveAction | null {
	if (key.name === "return" || key.sequence === "\r" || key.sequence === "\n") {
		return "submit";
	}
	if (!key.ctrl) {
		return null;
	}
	switch (key.name) {
		case "y":
			return "approve";
		case "n":
			return "deny";
		case "x":
			return "cancel";
		case "p":
			return "pause";
		case "r":
			return "resume";
		default:
			return null;
	}
}

export interface InteractiveTuiOptions {
	projectRoot: string;
	env?: NodeJS.ProcessEnv;
	input?: Readable;
	output?: Writable;
	cols?: number;
	isTTY?: boolean;
}

export interface InteractiveTuiResult {
	exit_code: number;
	painted: string;
	reason_code?: string;
	last_seq: number;
	noninteractive: boolean;
	frames: number;
}

export interface InteractiveSession {
	ready: Promise<void>;
	painted(): string;
	frames(): string[];
	events(): SurfaceEvent[];
	reconnects(): Array<{ after_seq: number }>;
	submit(argv: string[]): Promise<Record<string, unknown>>;
	approve(approvalId?: string): Promise<Record<string, unknown>>;
	deny(approvalId?: string): Promise<Record<string, unknown>>;
	cancel(): Promise<Record<string, unknown>>;
	pause(): Promise<Record<string, unknown>>;
	resume(): Promise<Record<string, unknown>>;
	pressKey(key: KeyPress, str?: string): Promise<void>;
	resize(cols: number): void;
	close(): Promise<InteractiveTuiResult>;
}

const DAEMON_UNREACHABLE = "DAEMON_UNREACHABLE";

function fallbackStatus(): OperatorStatusSnapshot {
	return {
		schema_version: 1,
		orchestrator_run_id: null,
		story_id: null,
		sprint_id: null,
		phase_id: null,
		role_id: null,
		model_id: null,
		backend_id: null,
		app_health: { ok: false, reason_code: DAEMON_UNREACHABLE },
		index_health: { ok: false, stale: true, reason_code: DAEMON_UNREACHABLE },
		browser_summary: { probe_count: 0, evidence_refs: [] },
		token_cost: { metric_source: "us-0080", total_tokens: null, evidence_ref: null },
		sovereign: null,
		evidence_refs: [DAEMON_UNREACHABLE],
		read_only: true,
	};
}

function timelineFromEvent(event: SurfaceEvent): OperatorTimelineEntry {
	const payload = event.payload ?? {};
	const disposition = typeof payload.disposition === "string" ? payload.disposition : undefined;
	const command = typeof payload.command === "string" ? payload.command : undefined;
	return {
		ts: typeof payload.ts === "string" ? payload.ts : "",
		phase_id: command ?? event.kind,
		role: typeof payload.role_id === "string" ? payload.role_id : "daemon",
		outcome: disposition ?? event.kind,
		stop_reason: typeof payload.reason_code === "string" ? payload.reason_code : undefined,
		attempt: event.seq,
		evidence_refs: [`daemon-event:${event.kind}`],
	};
}

function reasonOf(err: unknown): string {
	if (
		err &&
		typeof err === "object" &&
		"reason_code" in err &&
		typeof err.reason_code === "string"
	) {
		return err.reason_code;
	}
	return err instanceof Error ? err.message : "execution_failure";
}

function streamIsTTY(input: Readable | undefined): boolean | undefined {
	if (!input || !("isTTY" in input)) {
		return undefined;
	}
	const tty = (input as Readable & { isTTY?: boolean }).isTTY;
	return tty === true;
}

function noninteractive(opts: InteractiveTuiOptions): boolean {
	const env = opts.env ?? process.env;
	if (env.ITS_MAGIC_TUI_NONINTERACTIVE === "1") {
		return true;
	}
	if (opts.isTTY === false) {
		return true;
	}
	if (opts.isTTY === true) {
		return false;
	}
	if (opts.input) {
		return streamIsTTY(opts.input) !== true;
	}
	return process.stdin.isTTY !== true;
}

async function openTransport(opts: InteractiveTuiOptions): Promise<OperatorTransport> {
	const env = opts.env ?? process.env;
	return resolveOperatorTransport({
		projectRoot: opts.projectRoot,
		session: createOperatorSession(),
		preferDaemon: env.ITS_MAGIC_IN_PROCESS !== "1",
		requireDaemon: env.ITS_MAGIC_REQUIRE_DAEMON === "1",
		client_kind: "tui",
	});
}

export async function runInteractiveTui(
	opts: InteractiveTuiOptions,
): Promise<InteractiveTuiResult> {
	if (noninteractive(opts)) {
		return paintOnce(opts);
	}
	const session = await openInteractiveTui(opts);
	if (opts.input) {
		await new Promise<void>((resolve) => {
			opts.input?.once("end", () => resolve());
			opts.input?.once("close", () => resolve());
		});
	}
	return session.close();
}

export async function openInteractiveTui(opts: InteractiveTuiOptions): Promise<InteractiveSession> {
	const transport = await openTransport(opts);
	return startSession(transport, opts, false);
}

async function paintOnce(opts: InteractiveTuiOptions): Promise<InteractiveTuiResult> {
	const transport = await openTransport(opts);
	if (transport.kind !== "daemon") {
		const painted = renderInteractiveLayout(modelFrom(fallbackStatus(), []), opts.cols ?? 80, []);
		opts.output?.write(`${painted}\n`);
		return {
			exit_code: 1,
			painted,
			reason_code: DAEMON_UNREACHABLE,
			last_seq: 0,
			noninteractive: true,
			frames: 1,
		};
	}
	const session = await startSession(transport, opts, true);
	await session.ready;
	await new Promise((resolve) => setTimeout(resolve, 200));
	return session.close();
}

function modelFrom(status: OperatorStatusSnapshot, events: SurfaceEvent[]): TuiPanelModel {
	return {
		phase: { phase_id: status.phase_id, role_id: status.role_id },
		status,
		timeline: events.map(timelineFromEvent),
		tools: { names: [] },
	};
}

function bindKeys(input: Readable, onKey: (key: KeyPress, str: string) => void): () => void {
	readline.emitKeypressEvents(input);
	const handler = (str: string, key: KeyPress) => {
		onKey(key ?? {}, str ?? "");
	};
	const emitter = input as NodeJS.EventEmitter;
	emitter.on("keypress", handler);
	return () => {
		emitter.off("keypress", handler);
	};
}

async function startSession(
	transport: OperatorTransport,
	opts: InteractiveTuiOptions,
	observer: boolean,
): Promise<InteractiveSession> {
	const output = opts.output;
	let cols = opts.cols ?? 80;
	let status = fallbackStatus();
	const events: SurfaceEvent[] = [];
	const seen = new Set<number>();
	const diagnostics: string[] = [];
	const reconnectLog: Array<{ after_seq: number }> = [];
	const reconnectCursors = new Set<number>();
	let lastSeq = 0;
	let pendingApproval: string | undefined;
	let lineBuffer = "";
	let latest = "";
	const frames: string[] = [];
	let subscription: { unsubscribe: () => void } | null = null;
	let reconnecting = false;
	let closed = false;
	let reasonCode: string | undefined;
	let readyResolve: () => void = () => undefined;
	const ready = new Promise<void>((resolve) => {
		readyResolve = resolve;
	});

	const paint = () => {
		latest = renderInteractiveLayout(modelFrom(status, events), cols, events, diagnostics);
		frames.push(latest);
		output?.write(`${latest}\n`);
	};

	const noteEvent = (event: SurfaceEvent) => {
		const payload = event.payload ? redactEventPayload(event.payload) : undefined;
		const safe: SurfaceEvent = { seq: event.seq, kind: event.kind, payload };
		if (safe.seq > 0) {
			if (seen.has(safe.seq)) {
				return;
			}
			seen.add(safe.seq);
			lastSeq = Math.max(lastSeq, safe.seq);
		}
		events.push(safe);
		if (safe.kind === "approval.requested") {
			pendingApproval = typeof payload?.approval_id === "string" ? payload.approval_id : "";
		}
		if (safe.kind === "approval.responded") {
			pendingApproval = undefined;
		}
		const disposition = typeof payload?.disposition === "string" ? payload.disposition : "";
		const reason = typeof payload?.reason_code === "string" ? payload.reason_code : "";
		const stop = typeof payload?.stop_reason === "string" ? payload.stop_reason : "";
		if (disposition === "execution_failure" || disposition === "gate_block") {
			diagnostics.push([disposition, reason, stop].filter(Boolean).join(" "));
		}
		paint();
	};

	const subscribe = async (afterSeq: number) => {
		subscription?.unsubscribe();
		subscription = await transport.subscribeEvents({
			run_id: OPERATOR_RUN_ID,
			after_seq: afterSeq,
			onEvent: (event) => {
				noteEvent(event);
			},
			onGap: () => {
				const cursor = lastSeq;
				void reconnect(cursor);
			},
		});
	};

	const reconnect = async (cursor: number) => {
		if (closed || reconnecting || reconnectCursors.has(cursor)) {
			return;
		}
		reconnecting = true;
		reconnectCursors.add(cursor);
		reconnectLog.push({ after_seq: cursor });
		try {
			await transport.attachRun({
				run_id: OPERATOR_RUN_ID,
				role: observer ? "observer" : "controller",
				client_kind: "tui",
			});
			await subscribe(cursor);
		} catch (err) {
			reasonCode = reasonOf(err);
			diagnostics.push(reasonCode);
			paint();
		} finally {
			reconnecting = false;
		}
	};

	const noteResult = (result: Record<string, unknown>) => {
		const safe = redactEventPayload(result);
		const disposition = typeof safe.disposition === "string" ? safe.disposition : "";
		const reason = typeof safe.reason_code === "string" ? safe.reason_code : "";
		const stop = typeof safe.stop_reason === "string" ? safe.stop_reason : "";
		if (disposition === "execution_failure" || disposition === "gate_block" || reason || stop) {
			diagnostics.push([disposition || "result", reason, stop].filter(Boolean).join(" "));
		}
		paint();
		return safe;
	};

	const submit = async (argv: string[]) => {
		if (observer) {
			reasonCode = OPERATOR_INPUT_REQUIRED;
			diagnostics.push(OPERATOR_INPUT_REQUIRED);
			paint();
			return { reason_code: OPERATOR_INPUT_REQUIRED };
		}
		try {
			const result = await transport.submitCommand({
				run_id: OPERATOR_RUN_ID,
				argv,
				client_kind: "tui",
			});
			status = await transport.statusSnapshot();
			return noteResult(result);
		} catch (err) {
			reasonCode = reasonOf(err);
			diagnostics.push(`execution_failure ${reasonCode}`);
			paint();
			return { disposition: "execution_failure", reason_code: reasonCode };
		}
	};

	const respond = async (choice: "approve" | "deny", approvalId?: string) => {
		if (observer) {
			reasonCode = OPERATOR_INPUT_REQUIRED;
			diagnostics.push(OPERATOR_INPUT_REQUIRED);
			paint();
			return { reason_code: OPERATOR_INPUT_REQUIRED };
		}
		const approval_id = approvalId ?? pendingApproval ?? "";
		try {
			const result = await transport.respondApproval({
				run_id: OPERATOR_RUN_ID,
				approval_id,
				choice,
			});
			return noteResult(result);
		} catch (err) {
			reasonCode = reasonOf(err);
			diagnostics.push(reasonCode);
			paint();
			return { reason_code: reasonCode };
		}
	};

	if (transport.kind === "daemon") {
		try {
			await transport.attachRun({
				run_id: OPERATOR_RUN_ID,
				role: observer ? "observer" : "controller",
				client_kind: "tui",
			});
			status = await transport.statusSnapshot();
			await subscribe(0);
		} catch (err) {
			reasonCode = reasonOf(err);
			diagnostics.push(reasonCode);
		}
	} else {
		reasonCode = DAEMON_UNREACHABLE;
		diagnostics.push(DAEMON_UNREACHABLE);
	}
	paint();
	readyResolve();

	const onResize = () => {
		cols = process.stdout.columns || cols;
		paint();
	};
	if (output === process.stdout) {
		process.stdout.on("resize", onResize);
	}

	let unbindKeys: () => void = () => undefined;

	const session: InteractiveSession = {
		ready,
		painted: () => latest,
		frames: () => [...frames],
		events: () => [...events],
		reconnects: () => [...reconnectLog],
		submit,
		approve: (approvalId?: string) => respond("approve", approvalId),
		deny: (approvalId?: string) => respond("deny", approvalId),
		cancel: async () => {
			if (observer) {
				reasonCode = OPERATOR_INPUT_REQUIRED;
				paint();
				return { reason_code: OPERATOR_INPUT_REQUIRED };
			}
			try {
				return noteResult(await transport.cancel({ run_id: OPERATOR_RUN_ID, client_kind: "tui" }));
			} catch (err) {
				reasonCode = reasonOf(err);
				diagnostics.push(reasonCode);
				paint();
				return { reason_code: reasonCode };
			}
		},
		pause: () => submit(["pause"]),
		resume: () => submit(["resume"]),
		pressKey: async (key: KeyPress, str = "") => {
			const action = actionForKey(key);
			if (action === "submit") {
				const argv = lineBuffer.trim().split(/\s+/).filter(Boolean);
				lineBuffer = "";
				if (argv.length > 0) {
					await submit(argv);
				}
				return;
			}
			if (action === "approve") {
				await respond("approve");
				return;
			}
			if (action === "deny") {
				await respond("deny");
				return;
			}
			if (action === "cancel") {
				await session.cancel();
				return;
			}
			if (action === "pause") {
				await submit(["pause"]);
				return;
			}
			if (action === "resume") {
				await submit(["resume"]);
				return;
			}
			if (key.name === "backspace") {
				lineBuffer = lineBuffer.slice(0, -1);
				return;
			}
			if (!key.ctrl && !key.meta && str.length === 1 && str >= " ") {
				lineBuffer += str;
			}
		},
		resize: (next: number) => {
			cols = next;
			paint();
		},
		close: async () => {
			closed = true;
			unbindKeys();
			subscription?.unsubscribe();
			if (output === process.stdout) {
				process.stdout.off("resize", onResize);
			}
			if (observer && pendingApproval !== undefined) {
				reasonCode = OPERATOR_INPUT_REQUIRED;
			}
			return {
				exit_code:
					reasonCode === OPERATOR_INPUT_REQUIRED || reasonCode === DAEMON_UNREACHABLE ? 1 : 0,
				painted: latest,
				reason_code: reasonCode,
				last_seq: lastSeq,
				noninteractive: observer,
				frames: frames.length,
			};
		},
	};
	if (!observer && opts.input) {
		unbindKeys = bindKeys(opts.input, (key, str) => {
			void session.pressKey(key, str);
		});
	}
	return session;
}
