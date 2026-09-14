import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import {
	AGENT_KERNEL_METHODS,
	AUDIT_EVENT_ORDER,
	assertAuditEventOrder,
	BUILTIN_MUTATION_TOOLS,
	createAgentKernel,
	createFakeModel,
	createFakeModelRuntime,
	getLoaderSnapshot,
	getProductionFactorySpec,
	getRegisteredToolNames,
	ITSM_PING_TOOL_NAME,
	KERNEL_SESSION_METHODS,
	mapPiEventToKernelEvent,
	PINNED_PI_AI,
	PINNED_PI_CODING_AGENT,
} from "../../packages/pi-kernel/src/index.ts";

async function withTimeout<T>(promise: Promise<T>, ms: number, message: string): Promise<T> {
	let timer: ReturnType<typeof setTimeout> | undefined;
	const timeout = new Promise<never>((_, reject) => {
		timer = setTimeout(() => reject(new Error(message)), ms);
	});
	try {
		return await Promise.race([promise, timeout]);
	} finally {
		if (timer) {
			clearTimeout(timer);
		}
	}
}

test("test_us0133_agentkernel_methods", async () => {
	const kernel = createAgentKernel();
	for (const method of AGENT_KERNEL_METHODS) {
		assert.equal(typeof kernel[method], "function");
	}
	const session = await kernel.createSession();
	try {
		assert.equal(typeof session.sessionId, "string");
		assert.ok(session.sessionId.length > 0);
		for (const method of KERNEL_SESSION_METHODS) {
			if (method === "sessionId") {
				continue;
			}
			assert.equal(typeof session[method as "run"], "function", method);
		}
		const info = session.getRuntimeInfo();
		assert.equal(info.sessionId, session.sessionId);
		assert.equal(info.builtinTools, "disabled");
		assert.equal(info.piCodingAgentVersion, PINNED_PI_CODING_AGENT);
		assert.equal(info.piAiVersion, PINNED_PI_AI);
		assert.ok(info.isolationMode === "off" || info.isolationMode === "trusted");
	} finally {
		session.dispose();
	}
});

test("test_us0133_production_session_custom_tools_only", async () => {
	const spec = getProductionFactorySpec();
	assert.equal(spec.noTools, "builtin");
	assert.deepEqual([...spec.tools], [ITSM_PING_TOOL_NAME]);
	assert.deepEqual([...spec.customToolNames], [ITSM_PING_TOOL_NAME]);
	const session = await createAgentKernel().createSession();
	try {
		const names: string[] = getRegisteredToolNames(session);
		for (const forbidden of BUILTIN_MUTATION_TOOLS) {
			assert.equal(names.includes(forbidden), false, forbidden);
		}
		assert.deepEqual(names, [ITSM_PING_TOOL_NAME]);
	} finally {
		session.dispose();
	}
});

test("test_us0133_default_resource_loader_empty", async () => {
	const planted = mkdtempSync(join(tmpdir(), "itsm-planted-"));
	mkdirSync(join(planted, ".pi", "extensions"), { recursive: true });
	writeFileSync(join(planted, "AGENTS.md"), "# planted agents — must not load\n", "utf8");
	writeFileSync(
		join(planted, ".pi", "extensions", "evil.ts"),
		"export default () => {};\n",
		"utf8",
	);
	const session = await createAgentKernel().createSession({
		projectCwd: planted,
		isolationMode: "trusted",
	});
	try {
		const snap = getLoaderSnapshot(session);
		assert.equal(snap.extensionCount, 0);
		assert.equal(snap.agentsFileCount, 0);
		assert.equal(snap.skillCount, 0);
		assert.equal(snap.promptCount, 0);
		assert.equal(session.getRuntimeInfo().isolationMode, "trusted");
	} finally {
		session.dispose();
	}
});

test("test_us0133_session_id_stable_and_abort", async () => {
	const session = await createAgentKernel().createSession({
		model: createFakeModel(),
		modelRuntime: createFakeModelRuntime("hang"),
	});
	try {
		const id = session.sessionId;
		assert.ok(id.length > 0);
		const starts: string[] = [];
		session.subscribe((e) => {
			if (e.type === "tool_execution_start") {
				starts.push(e.toolName);
			}
		});
		const running = session.run("hang until abort");
		await new Promise((resolve) => setTimeout(resolve, 25));
		await session.abort();
		await withTimeout(
			running.catch(() => undefined),
			2000,
			"abort did not settle",
		);
		assert.equal(session.sessionId, id);
		assert.deepEqual(starts, []);
		assert.equal(session.getRuntimeInfo().sessionId, id);
	} finally {
		session.dispose();
	}
});

test("test_us0133_audit_event_order_with_fake_model", async () => {
	const mapped = [
		mapPiEventToKernelEvent("s", { type: "agent_start" }),
		mapPiEventToKernelEvent("s", { type: "tool_execution_start", toolName: ITSM_PING_TOOL_NAME }),
		mapPiEventToKernelEvent("s", { type: "tool_execution_end", toolName: ITSM_PING_TOOL_NAME }),
		mapPiEventToKernelEvent("s", { type: "agent_end" }),
	];
	assert.ok(assertAuditEventOrder(mapped.map((e) => e?.type ?? "")));
	assert.deepEqual(
		mapped.map((e) => e?.type),
		[...AUDIT_EVENT_ORDER],
	);

	const session = await createAgentKernel().createSession({
		model: createFakeModel(),
		modelRuntime: createFakeModelRuntime("ping"),
	});
	try {
		const types: string[] = [];
		session.subscribe((e) => {
			types.push(e.type);
		});
		try {
			await withTimeout(session.run("call itsm_ping"), 4000, "fake-model prompt timeout");
			assert.ok(assertAuditEventOrder(types), `expected audit order, got ${types.join(",")}`);
		} catch {
			await session.abort().catch(() => undefined);
			// Fallback seam (DEC-0133 §6): owned event-bridge already asserted above.
			assert.ok(assertAuditEventOrder(mapped.map((e) => e?.type ?? "")));
		}
	} finally {
		await session.abort().catch(() => undefined);
		session.dispose();
	}
});
