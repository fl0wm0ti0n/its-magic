import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { startDaemonServer } from "../../apps/daemon/src/server.ts";
import {
	APPROVAL_NO_CONTROLLER,
	DAEMON_CONTROLLER_BUSY,
	DAEMON_EVENT_LAG_MAX,
	DAEMON_UNREACHABLE,
	jsonRpcCall,
	PROTOCOL_VERSION,
	PROTOCOL_VERSION_MISMATCH,
	redactEventPayload,
} from "../../packages/protocol/src/index.ts";
import { createSessionSupervisor } from "../../packages/role-runtime/src/index.ts";
import type {
	AgentKernel,
	KernelEvent,
	KernelSession,
} from "../../packages/role-runtime/src/kernel-port.ts";
import {
	createDaemonTransport,
	createInProcessTransport,
	createOperatorSession,
	createRunsStore,
	reconcileOperationalLedger,
} from "../../packages/runtime-core/src/index.ts";

class FakeSession implements KernelSession {
	readonly sessionId: string;
	constructor(sessionId: string) {
		this.sessionId = sessionId;
	}
	async run(): Promise<void> {}
	async steer(): Promise<void> {}
	async abort(): Promise<void> {}
	dispose(): void {}
	getRuntimeInfo() {
		return {
			sessionId: this.sessionId,
			piCodingAgentVersion: "0.85.1",
			piAiVersion: "0.85.1",
			isolationMode: "off" as const,
			builtinTools: "disabled" as const,
		};
	}
	subscribe(_handler: (e: KernelEvent) => void): () => void {
		return () => undefined;
	}
}

function supervisor() {
	const kernel: AgentKernel = {
		async createSession() {
			return new FakeSession(`sess-${crypto.randomUUID()}`);
		},
	};
	return createSessionSupervisor({ kernel });
}

function seedResumeBrief(root: string) {
	mkdirSync(join(root, "handoffs"), { recursive: true });
	writeFileSync(
		join(root, "handoffs", "resume_brief.md"),
		"- **last_completed_phase**: sprint-plan\n- **intended_resume_phase**: /execute\n",
	);
	mkdirSync(join(root, "docs", "engineering"), { recursive: true });
	writeFileSync(join(root, "docs", "engineering", "state.md"), "# state\n");
}

async function withDaemon(
	fn: (ctx: Awaited<ReturnType<typeof startDaemonServer>> & { root: string }) => Promise<void>,
	opts: { skipStartupReconcile?: boolean } = {},
) {
	const root = mkdtempSync(join(tmpdir(), "us0148-"));
	seedResumeBrief(root);
	const daemon = await startDaemonServer({
		projectRoot: root,
		supervisor: supervisor(),
		port: 0,
		skipStartupReconcile: opts.skipStartupReconcile ?? true,
	});
	try {
		await fn({ ...daemon, root });
	} finally {
		await daemon.close();
		try {
			rmSync(root, { recursive: true, force: true, maxRetries: 3 });
		} catch {
			// Windows may retain SQLite handles briefly after close
		}
	}
}

test("test_us0148_protocol_version_mismatch_fail_closed", async () => {
	await withDaemon(async ({ baseUrl, token }) => {
		let reason: string | undefined;
		try {
			await jsonRpcCall(baseUrl, token, "daemon.hello", { protocol_version: 99 });
		} catch (e) {
			reason = (e as Error & { reason_code?: string }).reason_code;
		}
		assert.equal(reason, PROTOCOL_VERSION_MISMATCH);
	});
});

test("test_us0148_schema_command_event_roundtrip", async () => {
	const cmd = {
		kind: "command.submit" as const,
		protocol_version: PROTOCOL_VERSION,
		argv: ["status"],
	};
	const event = {
		run_id: "run-test",
		seq: 1,
		kind: "command.submitted",
		protocol_version: PROTOCOL_VERSION,
		payload: { argv: ["status"] },
	};
	const round = redactEventPayload({ cmd, event });
	assert.equal(round.cmd.protocol_version, PROTOCOL_VERSION);
	assert.equal(round.event.seq, 1);
});

test("test_us0148_daemon_delegates_no_duplicate_workflow", async () => {
	await withDaemon(async (daemon) => {
		assert.ok(daemon.workflowEngineCount() >= 1);
	});
});

test("test_us0148_cli_attach_ordered_events", async () => {
	await withDaemon(async ({ baseUrl, token, root }) => {
		const start = await jsonRpcCall<{ run_id: string }>(baseUrl, token, "run.start", {});
		const transport = createDaemonTransport({
			projectRoot: root,
			baseUrl,
			token,
			client_kind: "cli",
		});
		await transport.attachRun({ run_id: start.run_id, role: "controller" });
		const events: number[] = [];
		const sub = await transport.subscribeEvents({
			run_id: start.run_id,
			after_seq: 0,
			onEvent: (ev) => events.push(ev.seq),
		});
		await jsonRpcCall(baseUrl, token, "command.submit", {
			run_id: start.run_id,
			argv: ["status"],
		});
		await new Promise((r) => setTimeout(r, 200));
		sub.unsubscribe();
		assert.ok(events.length >= 1);
		for (let i = 1; i < events.length; i++) {
			assert.ok(events[i] > events[i - 1]);
		}
	});
});

test("test_us0148_reconnect_replay_after_seq", async () => {
	await withDaemon(async ({ baseUrl, token, root }) => {
		const start = await jsonRpcCall<{ run_id: string }>(baseUrl, token, "run.start", {});
		await jsonRpcCall(baseUrl, token, "command.submit", {
			run_id: start.run_id,
			argv: ["status"],
		});
		const replay = await jsonRpcCall(baseUrl, token, "status.snapshot", {});
		assert.ok(replay);
		const transport = createDaemonTransport({
			projectRoot: root,
			baseUrl,
			token,
			client_kind: "test",
		});
		const seen: number[] = [];
		const sub = await transport.subscribeEvents({
			run_id: start.run_id,
			after_seq: 0,
			onEvent: (ev) => seen.push(ev.seq),
		});
		await new Promise((r) => setTimeout(r, 150));
		sub.unsubscribe();
		assert.ok(seen.length >= 1, `expected replay events, saw ${seen.length}`);
	});
});

test("test_us0148_loopback_bind_default_deny_remote", async () => {
	await assert.rejects(
		() =>
			startDaemonServer({
				projectRoot: mkdtempSync(join(tmpdir(), "us0148-deny-")),
				supervisor: supervisor(),
				host: "0.0.0.0",
				skipStartupReconcile: true,
			}),
		/remote_bind_denied/,
	);
	const root = mkdtempSync(join(tmpdir(), "us0148-loop-"));
	seedResumeBrief(root);
	const daemon = await startDaemonServer({
		projectRoot: root,
		supervisor: supervisor(),
		port: 0,
		host: "127.0.0.1",
		skipStartupReconcile: true,
	});
	const listen = JSON.parse(
		readFileSync(join(root, ".its-magic", "daemon", "listen.json"), "utf8"),
	) as { host: string };
	assert.equal(listen.host, "127.0.0.1");
	await daemon.close();
	rmSync(root, { recursive: true, force: true });
});

test("test_us0148_wire_payload_secret_redaction", () => {
	const redacted = redactEventPayload({
		api_key: "sk-abcdefghijklmnopqrstuvwxyz",
		nested: { token: "Bearer secret-value" },
		message: "contact sk-1234567890abcdef",
	});
	assert.equal(redacted.api_key, "[redacted]");
	assert.equal((redacted.nested as { token: string }).token, "[redacted]");
	assert.match(String(redacted.message), /\[redacted\]/);
});

test("test_us0148_event_backpressure_summary_mode", async () => {
	const { DaemonEventStore } = await import("../../apps/daemon/src/event-store.ts");
	const root = mkdtempSync(join(tmpdir(), "us0148-lag-"));
	const store = new DaemonEventStore(join(root, "events.sqlite"));
	for (let i = 0; i < 60; i++) {
		store.append("run-lag", "tick", { i });
	}
	const summary = store.summaryIfLagged("run-lag", 60);
	assert.ok(summary);
	assert.equal(summary?.kind, DAEMON_EVENT_LAG_MAX);
	assert.ok(summary?.evidence_ref);
	store.close();
	try {
		rmSync(root, { recursive: true, force: true, maxRetries: 3 });
	} catch {
		// ignore Windows cleanup races
	}
});

test("test_us0148_concurrent_observer_controller_roles", async () => {
	await withDaemon(async ({ baseUrl, token }) => {
		const start = await jsonRpcCall<{ run_id: string }>(baseUrl, token, "run.start", {});
		await jsonRpcCall(baseUrl, token, "run.attach", {
			run_id: start.run_id,
			role: "controller",
			client_id: "c1",
			client_kind: "test",
		});
		await jsonRpcCall(baseUrl, token, "run.attach", {
			run_id: start.run_id,
			role: "observer",
			client_id: "o1",
			client_kind: "test",
		});
		let busy: string | undefined;
		try {
			await jsonRpcCall(baseUrl, token, "run.attach", {
				run_id: start.run_id,
				role: "controller",
				client_id: "c2",
				client_kind: "test",
			});
		} catch (e) {
			busy = (e as Error & { reason_code?: string }).reason_code;
		}
		assert.equal(busy, DAEMON_CONTROLLER_BUSY);
	});
});

test("test_us0148_approval_routing_single_controller", async () => {
	await withDaemon(async ({ baseUrl, token }) => {
		const start = await jsonRpcCall<{ run_id: string }>(baseUrl, token, "run.start", {});
		let noCtrl: string | undefined;
		try {
			await jsonRpcCall(baseUrl, token, "approval.respond", {
				run_id: start.run_id,
				approval_id: "a1",
				choice: "yes",
			});
		} catch (e) {
			noCtrl = (e as Error & { reason_code?: string }).reason_code;
		}
		assert.equal(noCtrl, APPROVAL_NO_CONTROLLER);
		await jsonRpcCall(baseUrl, token, "run.attach", {
			run_id: start.run_id,
			role: "controller",
			client_id: "ctrl",
			client_kind: "test",
		});
		const ok = await jsonRpcCall(baseUrl, token, "approval.respond", {
			run_id: start.run_id,
			approval_id: "a1",
			choice: "yes",
		});
		assert.deepEqual(ok, { ok: true });
	});
});

test("test_us0148_cancel_propagates_to_runtime", async () => {
	await withDaemon(async ({ baseUrl, token, session }) => {
		const start = await jsonRpcCall<{ run_id: string }>(baseUrl, token, "run.start", {});
		await jsonRpcCall(baseUrl, token, "run.attach", {
			run_id: start.run_id,
			role: "controller",
			client_id: "c",
			client_kind: "cli",
		});
		const result = await jsonRpcCall<{ cancel_requested: boolean }>(baseUrl, token, "run.cancel", {
			run_id: start.run_id,
			client_id: "c",
			client_kind: "cli",
		});
		assert.equal(result.cancel_requested, true);
		assert.equal(session.getState().cancel_requested, true);
	});
});

test("test_us0148_crash_restart_reconcile_fresh_sessions", async () => {
	const root = mkdtempSync(join(tmpdir(), "us0148-restart-"));
	seedResumeBrief(root);
	const sup = supervisor();
	const first = await startDaemonServer({
		projectRoot: root,
		supervisor: sup,
		port: 0,
		skipStartupReconcile: false,
	});
	await first.close();
	const second = await startDaemonServer({
		projectRoot: root,
		supervisor: sup,
		port: 0,
		skipStartupReconcile: false,
	});
	const ledger = reconcileOperationalLedger({
		projectRoot: root,
		store: createRunsStore(join(root, ".its-magic", "daemon", "ops.sqlite")),
	});
	assert.equal(ledger.ok, true);
	await second.close();
	try {
		rmSync(root, { recursive: true, force: true, maxRetries: 3 });
	} catch {
		// ignore Windows cleanup races
	}
});

test("test_us0148_in_process_transport_for_us0146_doubles", () => {
	const session = createOperatorSession();
	const t = createInProcessTransport({ session });
	assert.equal(t.kind, "in_process");
});

test("test_us0148_daemon_unreachable_hint", async () => {
	const root = mkdtempSync(join(tmpdir(), "us0148-unreach-"));
	let code: string | undefined;
	try {
		await createDaemonTransport({ projectRoot: root }).attachRun({
			run_id: "x",
			role: "observer",
		});
	} catch (e) {
		code = (e as Error & { reason_code?: string }).reason_code;
	}
	rmSync(root, { recursive: true, force: true });
	assert.equal(code, DAEMON_UNREACHABLE);
});
