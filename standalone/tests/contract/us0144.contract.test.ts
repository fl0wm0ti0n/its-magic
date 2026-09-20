import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import {
	existsSync,
	mkdirSync,
	mkdtempSync,
	readdirSync,
	readFileSync,
	rmSync,
	writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
	ALLOWED_VALIDATOR_NAMES,
	createKernelBridge,
	isKernelBridgeError,
	KERNEL_HANDSHAKE_CODES,
	SOVEREIGN_OPERATIONS,
	SOVEREIGN_REQUEST_MAX_BYTES,
	type SovereignOperationResult,
	type SpawnFn,
} from "../../packages/kernel-bridge/src/index.ts";
import {
	createSessionSupervisor,
	type SessionSupervisor,
} from "../../packages/role-runtime/src/index.ts";
import type {
	AgentKernel,
	KernelEvent,
	KernelSession,
} from "../../packages/role-runtime/src/kernel-port.ts";
import {
	type ConfigView,
	createCommandRouter,
	createSovereignRuntime,
	createWorkflowEngine,
	isWorkflowError,
	lookupSovereignRuntime,
	RELEASE_GATE_ORDER,
	SOVEREIGN_DRAIN_OPERATOR_DECISION_REQUIRED,
	type WorkflowError,
} from "../../packages/runtime-core/src/index.ts";

const HERE = dirname(fileURLToPath(import.meta.url));
const STANDALONE_ROOT = join(HERE, "..", "..");
const KIT_ROOT = join(STANDALONE_ROOT, "..");
const CORE_ROOT = join(STANDALONE_ROOT, "packages", "runtime-core");
const YAML_PATH = join(KIT_ROOT, "scripts", "data", "autonomy_stop_matrix.yaml");

const MARKERS = [
	"test_us0144_kernel_bridge_admission",
	"test_us0144_bridge_json_timeout_fail_closed",
	"test_us0144_pre_spawn_context_order",
	"test_us0144_memory_bounds_default_off",
	"test_us0144_model_collision_degraded",
	"test_us0144_supplementary_manifest_reviews",
	"test_us0144_ledger_schema_preserved",
	"test_us0144_sidecar_idempotent_torn_write",
	"test_us0144_drain_gate_preset_zero",
	"test_us0144_per_candidate_operator_decision",
	"test_us0144_blocking_only_convergence_smoke_truth",
	"test_us0144_caps_progress_partial_delivery_boundaries",
] as const;

const FORBIDDEN_IMPORTS = [
	"@earendil-works/pi-",
	"@cortexkit/aft-pi",
	"@cortexkit/aft-opencode",
	"@cortexkit/aft-bridge",
	"@temporalio/",
	"@langchain/",
	"langgraph",
];

function walkFiles(root: string): string[] {
	const out: string[] = [];
	const stack = [root];
	while (stack.length > 0) {
		const dir = stack.pop() as string;
		for (const name of readdirSync(dir, { withFileTypes: true })) {
			if (name.name === "node_modules") {
				continue;
			}
			const path = join(dir, name.name);
			if (name.isDirectory()) {
				stack.push(path);
			} else if (/\.(ts|js|mjs|cjs|json)$/.test(name.name)) {
				out.push(path);
			}
		}
	}
	return out;
}

function assertNoPi(root: string): void {
	const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8")) as {
		dependencies?: Record<string, string>;
		devDependencies?: Record<string, string>;
	};
	const deps = { ...(pkg.dependencies ?? {}), ...(pkg.devDependencies ?? {}) };
	for (const key of Object.keys(deps)) {
		assert.equal(key.startsWith("@earendil-works/pi-"), false, key);
		assert.equal(key.startsWith("@cortexkit/aft-"), false, key);
	}
	const hits: string[] = [];
	for (const path of walkFiles(root)) {
		const text = readFileSync(path, "utf8");
		for (const needle of FORBIDDEN_IMPORTS) {
			if (text.includes(needle)) {
				hits.push(`${path}:${needle}`);
			}
		}
	}
	assert.deepEqual(hits, []);
}

class FakeSession implements KernelSession {
	readonly sessionId: string;
	readonly prompts: string[] = [];
	disposed = false;

	constructor(sessionId: string) {
		this.sessionId = sessionId;
	}

	async run(text: string): Promise<void> {
		this.prompts.push(text);
	}
	async steer(): Promise<void> {}
	async abort(): Promise<void> {}
	dispose(): void {
		this.disposed = true;
	}
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

function fakeKernel(): { kernel: AgentKernel; sessions: FakeSession[] } {
	const sessions: FakeSession[] = [];
	const kernel: AgentKernel = {
		async createSession() {
			const session = new FakeSession(`sess-${randomUUID()}`);
			sessions.push(session);
			return session;
		},
	};
	return { kernel, sessions };
}

function supervisor(): { sv: SessionSupervisor; sessions: FakeSession[] } {
	const { kernel, sessions } = fakeKernel();
	return { sv: createSessionSupervisor({ kernel }), sessions };
}

function cfg(over: ConfigView = {}): ConfigView {
	return {
		delivery: over.delivery,
		token: over.token,
		workKind: over.workKind,
		autonomy: {
			AUTONOMY_PRESET: over.autonomy?.AUTONOMY_PRESET,
			flags: {
				AUTO_BUG_QUEUE: "0",
				AUTO_IMPLEMENTATION_LOOP: "1",
				AUTO_BACKLOG_MAX_STORIES: "10",
				AUTO_EXECUTE_MAX_ITEMS: "10",
				...(over.autonomy?.flags ?? {}),
			},
		},
		shared: { ...(over.shared ?? {}) },
		compat: { ...(over.compat ?? {}) },
		retryTest: {
			AUTO_LOOP_MAX_CYCLES: over.retryTest?.AUTO_LOOP_MAX_CYCLES ?? 32,
			AUTO_BLOCK_RETRY_MAX: over.retryTest?.AUTO_BLOCK_RETRY_MAX ?? 3,
		},
		sovereign: {
			CROSS_MODEL_REVIEW: over.sovereign?.CROSS_MODEL_REVIEW ?? "0",
			SOVEREIGN_RUNTIME: over.sovereign?.SOVEREIGN_RUNTIME ?? "0",
			SOVEREIGN_MEMORY: over.sovereign?.SOVEREIGN_MEMORY ?? "0",
			SOVEREIGN_DRAIN_AUTO_ACCEPT: over.sovereign?.SOVEREIGN_DRAIN_AUTO_ACCEPT,
		},
		phase: { ...(over.phase ?? {}) },
	};
}

function routeInput(extra: Record<string, unknown> = {}) {
	return {
		orchestrator_run_id: "auto-20260913-us0144",
		model_id: "openai/itsm-fake-ping",
		yamlPath: YAML_PATH,
		...extra,
	};
}

function envelope(
	operation: (typeof SOVEREIGN_OPERATIONS)[number],
	runId: string,
	payload: Record<string, unknown> = {},
) {
	return {
		schema_version: 1 as const,
		request_id: randomUUID(),
		operation,
		orchestrator_run_id: runId,
		payload,
	};
}

function okResult(
	operation: string,
	requestId: string,
	result: Record<string, unknown>,
): SovereignOperationResult {
	return { schema_version: 1, request_id: requestId, operation, ok: true, result };
}

function countingBridge(
	handler?: (op: string, payload: Record<string, unknown>) => Record<string, unknown>,
) {
	const calls: string[] = [];
	return {
		calls,
		async runValidator() {
			throw new Error("runValidator unused in US-0144 contract");
		},
		async runStatusReconcile() {
			throw new Error("runStatusReconcile unused in US-0144 contract");
		},
		async runSovereignOperation(input: {
			operation: string;
			request: { request_id: string; payload: Record<string, unknown> };
		}): Promise<SovereignOperationResult> {
			calls.push(input.operation);
			const result = handler
				? handler(input.operation, input.request.payload)
				: defaultFakeResult(input.operation);
			return okResult(input.operation, input.request.request_id, result);
		},
	};
}

function defaultFakeResult(operation: string): Record<string, unknown> {
	switch (operation) {
		case "memory_digest":
			return {
				block: "### sovereign_memory_digest\n\n```\n## Recent learnings\n- bounded\n```\n",
				entry_ids: ["e1"],
				char_count: 18,
			};
		case "critic_model":
			return { critic_model_id: "composer-2.5-fast", degraded: true };
		case "role_review_plan":
			return {
				objective: "review only",
				dispatches: [
					{
						obligation_id: "O1",
						reviewer_role: "tech-lead",
						spawn_only: true,
					},
				],
			};
		case "decision_session_append":
			return { event_id: "ABC", idempotent: false };
		case "deferral_append":
			return { deferral_id: "d1" };
		case "deferral_list":
			return { count: 0, deferral_ids: [] };
		case "drain_candidate_gate":
			return {
				candidate_id: "c1",
				decision_gate: true,
				operator_decision: "pending",
				materialize: false,
			};
		case "convergence_evaluate":
			return {
				converged: false,
				unmet_conditions: ["critic_open"],
				blocked_by: ["blocking_finding"],
				conjuncts: {},
				smoke_browser_claimed: false,
				blocking_only: true,
			};
		case "partial_delivery_write":
			return { path: "handoffs/sovereign_partial_delivery.md" };
		default:
			return {};
	}
}

function writeFile(path: string, body: string): void {
	mkdirSync(dirname(path), { recursive: true });
	writeFileSync(path, body, "utf8");
}

function plantSovereignKernel(root: string, ops = [...SOVEREIGN_OPERATIONS]): string {
	const version = "0.1.3-9";
	for (const rel of [
		"docs/product/backlog.md",
		"docs/product/vision.md",
		"docs/product/acceptance.md",
		"docs/engineering/architecture.md",
		"docs/engineering/decisions.md",
		"docs/engineering/research.md",
		"docs/engineering/state.md",
	]) {
		writeFile(join(root, rel), `# ${rel}\n`);
	}
	mkdirSync(join(root, "decisions"), { recursive: true });
	mkdirSync(join(root, "sprints"), { recursive: true });
	mkdirSync(join(root, "handoffs"), { recursive: true });
	mkdirSync(join(root, "docs", "engineering", "sovereign-memory"), { recursive: true });
	writeFile(join(root, "its_magic", ".its-magic-version"), `${version}\n`);
	writeFile(
		join(root, "its_magic", "kernel-contract.json"),
		JSON.stringify({
			schema_version: 1,
			kernel_version: version,
			validators: ["status-reconcile"],
			artifact_keys: [
				"vision",
				"backlog",
				"acceptance",
				"architecture",
				"decisions_index",
				"research",
				"state",
				"decisions_dir",
				"sprints",
				"handoffs",
				"sovereign",
			],
			sovereign_operations: ops,
		}),
	);
	writeFile(join(root, "scripts", "status_reconcile_validate.py"), "raise SystemExit(0)\n");
	writeFile(join(root, "scripts", "intake_evidence_validate.py"), "raise SystemExit(0)\n");
	writeFile(join(root, "scripts", "sovereign_runtime_bridge.py"), "print('{}')\n");
	return root;
}

const PY_PROBE = "import sys; raise SystemExit(0 if sys.version_info[0]==3 else 1)";
const PY_EXE = "import sys; print(sys.executable)";

function pythonAwareSpawn(inner: SpawnFn): SpawnFn {
	return async (command, args, opts) => {
		if (args.includes(PY_PROBE)) {
			return { stdout: "", stderr: "", exitCode: 0, signal: null, timedOut: false };
		}
		if (args.includes(PY_EXE)) {
			return {
				stdout: "/resolved/python.exe\n",
				stderr: "",
				exitCode: 0,
				signal: null,
				timedOut: false,
			};
		}
		return inner(command, args, opts);
	};
}

function ledgerEntry(runId: string, decisionId: string) {
	return {
		ts: "2026-09-15T19:00:00Z",
		orchestrator_run_id: runId,
		phase_id: "execute",
		role: "dev",
		decision_id: decisionId,
		decision_type: "LEDGER_DECISION",
		from_artifact: "(none)",
		to_artifact: "(none)",
		rationale: "US-0144 sidecar pairing",
		plan_fidelity: "strict",
		cross_model_reviewed: false,
		risk_tier: "medium",
	};
}

test("test_us0144_kernel_bridge_admission", async () => {
	assertNoPi(CORE_ROOT);
	assert.equal(existsSync(join(STANDALONE_ROOT, "packages", "sovereign-runtime")), false);
	const kitFiles = JSON.parse(readFileSync(join(KIT_ROOT, "package.json"), "utf8")) as {
		files?: string[];
	};
	assert.equal(
		(kitFiles.files ?? []).some(
			(f) => String(f) === "standalone" || String(f).startsWith("standalone/"),
		),
		false,
	);
	assert.equal(KERNEL_HANDSHAKE_CODES.length, 4);
	assert.deepEqual(
		[...SOVEREIGN_OPERATIONS],
		[
			"memory_digest",
			"critic_model",
			"role_review_plan",
			"decision_session_append",
			"deferral_append",
			"deferral_list",
			"drain_candidate_gate",
			"convergence_evaluate",
			"partial_delivery_write",
		],
	);
	assert.equal(
		(ALLOWED_VALIDATOR_NAMES as readonly string[]).includes("work_kind_classify"),
		false,
	);

	const root = mkdtempSync(join(tmpdir(), "us0144-admit-"));
	try {
		plantSovereignKernel(root);
		let spawned = 0;
		const spawnFn = pythonAwareSpawn(async (_c, args) => {
			spawned += 1;
			const op = args[args.indexOf("--operation") + 1];
			const req = JSON.parse(args[args.indexOf("--request-json") + 1]) as {
				request_id: string;
				operation: string;
			};
			assert.equal(args[0].endsWith("sovereign_runtime_bridge.py"), true);
			assert.equal(args.includes("--operation"), true);
			assert.equal(args.includes("--request-json"), true);
			return {
				stdout: `${JSON.stringify({
					schema_version: 1,
					request_id: req.request_id,
					operation: op,
					ok: true,
					result: { block: "", entry_ids: [], char_count: 0 },
				})}\n`,
				stderr: "",
				exitCode: 0,
				signal: null,
				timedOut: false,
			};
		});
		const bridge = createKernelBridge({ spawnFn });
		const admitted = await bridge.runSovereignOperation({
			operation: "memory_digest",
			kernelRoot: root,
			request: envelope("memory_digest", "run-admit"),
		});
		assert.equal(admitted.ok, true);
		assert.equal(spawned, 1);
		await assert.rejects(
			() =>
				bridge.runSovereignOperation({
					operation: "shell" as "memory_digest",
					kernelRoot: root,
					request: {
						schema_version: 1,
						request_id: randomUUID(),
						operation: "shell",
						orchestrator_run_id: "run-admit",
						payload: {},
					},
				}),
			(err: unknown) =>
				isKernelBridgeError(err) && err.code === "KERNEL_SOVEREIGN_OPERATION_MISSING",
		);
		assert.equal(spawned, 1);
	} finally {
		rmSync(root, { recursive: true, force: true });
	}
});

test("test_us0144_bridge_json_timeout_fail_closed", async () => {
	const root = mkdtempSync(join(tmpdir(), "us0144-fail-"));
	try {
		plantSovereignKernel(root);
		const malformed = createKernelBridge({
			spawnFn: pythonAwareSpawn(async () => ({
				stdout: "{not-json",
				stderr: "",
				exitCode: 0,
				signal: null,
				timedOut: false,
			})),
		});
		await assert.rejects(
			() =>
				malformed.runSovereignOperation({
					operation: "memory_digest",
					kernelRoot: root,
					request: envelope("memory_digest", "run-json"),
				}),
			(err: unknown) =>
				isKernelBridgeError(err) && err.code === "KERNEL_SOVEREIGN_RESPONSE_INVALID",
		);

		const timed = createKernelBridge({
			spawnFn: pythonAwareSpawn(async () => ({
				stdout: "",
				stderr: "",
				exitCode: null,
				signal: "SIGTERM",
				timedOut: true,
			})),
		});
		await assert.rejects(
			() =>
				timed.runSovereignOperation({
					operation: "memory_digest",
					kernelRoot: root,
					request: envelope("memory_digest", "run-to"),
				}),
			(err: unknown) => isKernelBridgeError(err) && err.code === "KERNEL_SOVEREIGN_TIMEOUT",
		);

		const crashed = createKernelBridge({
			spawnFn: pythonAwareSpawn(async () => ({
				stdout: "",
				stderr: "boom",
				exitCode: 1,
				signal: null,
				timedOut: false,
			})),
		});
		await assert.rejects(
			() =>
				crashed.runSovereignOperation({
					operation: "memory_digest",
					kernelRoot: root,
					request: envelope("memory_digest", "run-crash"),
				}),
			(err: unknown) => isKernelBridgeError(err) && err.code === "KERNEL_SOVEREIGN_FAILED",
		);

		const oversized = createKernelBridge({
			spawnFn: pythonAwareSpawn(async () => ({
				stdout: "x".repeat(64 * 1024 + 8),
				stderr: "",
				exitCode: 0,
				signal: null,
				timedOut: false,
			})),
		});
		await assert.rejects(
			() =>
				oversized.runSovereignOperation({
					operation: "memory_digest",
					kernelRoot: root,
					request: envelope("memory_digest", "run-cap"),
				}),
			(err: unknown) =>
				isKernelBridgeError(err) && err.code === "KERNEL_SOVEREIGN_RESPONSE_INVALID",
		);

		const huge = envelope("memory_digest", "run-req");
		huge.payload = { pad: "y".repeat(SOVEREIGN_REQUEST_MAX_BYTES) };
		await assert.rejects(
			() =>
				createKernelBridge({
					spawnFn: pythonAwareSpawn(async () => {
						assert.fail("must not spawn oversize request");
						return { stdout: "", stderr: "", exitCode: 0, signal: null, timedOut: false };
					}),
				}).runSovereignOperation({
					operation: "memory_digest",
					kernelRoot: root,
					request: huge,
				}),
			(err: unknown) => isKernelBridgeError(err) && err.code === "KERNEL_SOVEREIGN_REQUEST_INVALID",
		);
	} finally {
		rmSync(root, { recursive: true, force: true });
	}
});

test("test_us0144_pre_spawn_context_order", async () => {
	const { sv, sessions } = supervisor();
	const bridge = countingBridge();
	const router = createCommandRouter({
		supervisor: sv,
		config: cfg({
			sovereign: { CROSS_MODEL_REVIEW: "0", SOVEREIGN_RUNTIME: "1", SOVEREIGN_MEMORY: "1" },
		}),
		kernelBridge: bridge,
		env: {},
	});
	const boot = await router.assemblePreSpawnContext({
		phase_id: "execute",
		role_id: "dev",
		orchestrator_run_id: "auto-20260913-us0144",
		command: "execute",
	});
	assert.ok(boot);
	const phaseAt = boot.text.indexOf("## Phase context");
	const digestAt = boot.text.indexOf("sovereign_memory_digest");
	const roleAt = boot.text.indexOf("## Role objective");
	assert.equal(phaseAt >= 0 && digestAt > phaseAt && roleAt > digestAt, true);
	assert.equal(boot.role_objective_applied, true);
	assert.equal(boot.digest_entry_ids.length > 0, true);
	assert.equal(bridge.calls.includes("memory_digest"), true);

	const routed = await router.route("execute", routeInput());
	assert.equal("session" in routed && routed.ok, true);
	if ("session" in routed && routed.ok) {
		assert.equal(routed.session.bootstrap_ack?.bootstrap_delivered, true);
		assert.equal(routed.session.bootstrap_ack?.bootstrap_context_hash, boot.context_hash);
	}
	assert.equal(sessions[0]?.prompts.length, 1);

	const wf = createWorkflowEngine({
		supervisor: sv,
		config: cfg({
			sovereign: { CROSS_MODEL_REVIEW: "0", SOVEREIGN_RUNTIME: "1", SOVEREIGN_MEMORY: "1" },
		}),
		kernelBridge: bridge,
		env: {},
	});
	const auto = await wf.runAuto(routeInput());
	assert.equal(auto.critic_scheduled, false);
	assert.equal(auto.critic_content, false);
	assert.equal(auto.sovereign, undefined);
});

test("test_us0144_memory_bounds_default_off", async () => {
	const bridge = countingBridge();
	assert.equal(lookupSovereignRuntime(cfg()), false);
	const runtime = createSovereignRuntime({
		config: cfg({ sovereign: { CROSS_MODEL_REVIEW: "0", SOVEREIGN_RUNTIME: "0" } }),
		kernelBridge: bridge,
	});
	const after = await runtime.afterProducerBoundary({
		orchestrator_run_id: "auto-20260913-us0144",
		producer_model_id: "cursor-grok-4.6-high",
		phase_id: "execute",
		producer_role: "dev",
	});
	assert.equal(after, undefined);
	assert.deepEqual(bridge.calls, []);
	assert.deepEqual(runtime.calls, []);

	const { sv } = supervisor();
	const router = createCommandRouter({
		supervisor: sv,
		config: cfg({ sovereign: { CROSS_MODEL_REVIEW: "0", SOVEREIGN_RUNTIME: "0" } }),
		kernelBridge: bridge,
		env: {},
	});
	const boot = await router.assemblePreSpawnContext({
		phase_id: "execute",
		role_id: "dev",
		orchestrator_run_id: "auto-20260913-us0144",
	});
	assert.equal(boot, undefined);
	assert.deepEqual(bridge.calls, []);

	const wf = createWorkflowEngine({
		supervisor: sv,
		config: cfg({ sovereign: { CROSS_MODEL_REVIEW: "0", SOVEREIGN_RUNTIME: "0" } }),
		kernelBridge: bridge,
		env: {},
	});
	const ran = await wf.runAuto(routeInput());
	assert.equal(ran.critic_scheduled, false);
	assert.equal(ran.critic_content, false);
	assert.equal(ran.sovereign, undefined);
	assert.deepEqual(bridge.calls, []);
});

test("test_us0144_model_collision_degraded", async () => {
	const bridge = countingBridge((op) => {
		if (op === "critic_model") {
			return { critic_model_id: "cursor-grok-4.6-high", degraded: true };
		}
		if (op === "convergence_evaluate") {
			return {
				converged: true,
				unmet_conditions: [],
				blocked_by: [],
				conjuncts: {},
				smoke_browser_claimed: false,
				blocking_only: true,
			};
		}
		return defaultFakeResult(op);
	});
	const { sv } = supervisor();
	const wf = createWorkflowEngine({
		supervisor: sv,
		config: cfg({
			sovereign: { CROSS_MODEL_REVIEW: "1", SOVEREIGN_RUNTIME: "1" },
		}),
		kernelBridge: bridge,
		env: {},
	});
	const ran = await wf.runAuto(routeInput({ model_id: "cursor-grok-4.6-high" }));
	assert.equal(ran.critic_scheduled, true);
	assert.equal(ran.critic_content, true);
	assert.equal(ran.sovereign?.ok, true);
	if (ran.sovereign?.ok) {
		assert.equal(ran.sovereign.evidence.critic.degraded, true);
		assert.equal(ran.sovereign.evidence.critic.critic_model_id, "cursor-grok-4.6-high");
	}
	assert.equal(bridge.calls.includes("critic_model"), true);
});

test("test_us0144_supplementary_manifest_reviews", async () => {
	const bridge = countingBridge();
	const { sv } = supervisor();
	const wf = createWorkflowEngine({
		supervisor: sv,
		config: cfg({ sovereign: { CROSS_MODEL_REVIEW: "1", SOVEREIGN_RUNTIME: "1" } }),
		kernelBridge: bridge,
		env: {},
	});
	const ran = await wf.runAuto(routeInput());
	assert.equal(ran.passed, true);
	assert.equal(ran.critic_scheduled, true);
	assert.ok(ran.sovereign?.ok);
	if (ran.sovereign?.ok) {
		assert.equal(Array.isArray(ran.sovereign.evidence.role_reviews), true);
		for (const review of ran.sovereign.evidence.role_reviews) {
			assert.equal(review.spawn_only === true || review.reviewer_role !== "dev", true);
		}
	}
	const loop = await wf.runExecuteQaLoop(routeInput());
	assert.equal(loop.producer_role, "dev");
	assert.equal(loop.supplementary_roles.includes("tech-lead"), true);
	assert.notEqual(loop.producer_role, "tech-lead");
});

test("test_us0144_ledger_schema_preserved", async () => {
	const repo = mkdtempSync(join(tmpdir(), "us0144-ledger-"));
	const runId = "auto-20260913-us0144-ledger";
	const decisionId = randomUUID();
	try {
		const ledgerPath = join(repo, "handoffs", "sovereign_decisions", `${runId}.jsonl`);
		writeFile(ledgerPath, `${JSON.stringify(ledgerEntry(runId, decisionId))}\n`);
		const bridge = createKernelBridge();
		const result = await bridge.runSovereignOperation({
			operation: "decision_session_append",
			kernelRoot: KIT_ROOT,
			request: envelope("decision_session_append", runId, {
				orchestrator_run_id: runId,
				decision_id: decisionId,
				phase_session_id: "sess-ledger",
				phase_id: "execute",
				role: "dev",
				producer_model_id: "cursor-grok-4.6-high",
				critic_model_id: "composer-2.5-fast",
				critic_degraded: false,
				ledger_path: ledgerPath,
				repo_root: repo,
			}),
		});
		assert.equal(result.ok, true);
		if (result.ok) {
			assert.equal(typeof result.result.event_id, "string");
			assert.equal(result.result.idempotent, false);
		}
		const ledgerText = readFileSync(ledgerPath, "utf8");
		const ledgerRow = JSON.parse(ledgerText.trim()) as Record<string, unknown>;
		assert.deepEqual(Object.keys(ledgerRow), [
			"ts",
			"orchestrator_run_id",
			"phase_id",
			"role",
			"decision_id",
			"decision_type",
			"from_artifact",
			"to_artifact",
			"rationale",
			"plan_fidelity",
			"cross_model_reviewed",
			"risk_tier",
		]);
		assert.equal(ledgerRow.plan_fidelity, "strict");
		const sidecar = join(repo, "handoffs", "sovereign_decision_sessions", `${runId}.jsonl`);
		assert.equal(existsSync(sidecar), true);
		const side = JSON.parse(readFileSync(sidecar, "utf8").trim()) as Record<string, unknown>;
		assert.equal(side.decision_id, decisionId);
		assert.equal(side.schema_version, 1);
	} finally {
		rmSync(repo, { recursive: true, force: true });
	}
});

test("test_us0144_sidecar_idempotent_torn_write", async () => {
	const repo = mkdtempSync(join(tmpdir(), "us0144-side-"));
	const runId = "auto-20260913-us0144-side";
	const decisionId = randomUUID();
	try {
		const ledgerPath = join(repo, "handoffs", "sovereign_decisions", `${runId}.jsonl`);
		writeFile(ledgerPath, `${JSON.stringify(ledgerEntry(runId, decisionId))}\n`);
		const bridge = createKernelBridge();
		const first = await bridge.runSovereignOperation({
			operation: "decision_session_append",
			kernelRoot: KIT_ROOT,
			request: envelope("decision_session_append", runId, {
				orchestrator_run_id: runId,
				decision_id: decisionId,
				phase_session_id: "sess-idemp",
				ledger_path: ledgerPath,
				repo_root: repo,
			}),
		});
		assert.equal(first.ok, true);
		const second = await bridge.runSovereignOperation({
			operation: "decision_session_append",
			kernelRoot: KIT_ROOT,
			request: envelope("decision_session_append", runId, {
				orchestrator_run_id: runId,
				decision_id: decisionId,
				phase_session_id: "sess-idemp",
				ledger_path: ledgerPath,
				repo_root: repo,
			}),
		});
		assert.equal(second.ok, true);
		if (second.ok) {
			assert.equal(second.result.idempotent, true);
		}
		const sidecar = join(repo, "handoffs", "sovereign_decision_sessions", `${runId}.jsonl`);
		const before = readFileSync(sidecar, "utf8");
		assert.equal(before.trim().split("\n").length, 1);

		const tornRun = "auto-20260913-us0144-torn";
		const tornDecision = randomUUID();
		const tornLedger = join(repo, "handoffs", "sovereign_decisions", `${tornRun}.jsonl`);
		writeFile(tornLedger, `${JSON.stringify(ledgerEntry(tornRun, tornDecision))}\n`);
		const tornSidecar = join(repo, "handoffs", "sovereign_decision_sessions", `${tornRun}.jsonl`);
		writeFile(tornSidecar, '{"schema_version":1,"event_id":"PARTIAL"');
		const torn = await bridge.runSovereignOperation({
			operation: "decision_session_append",
			kernelRoot: KIT_ROOT,
			request: envelope("decision_session_append", tornRun, {
				orchestrator_run_id: tornRun,
				decision_id: tornDecision,
				phase_session_id: "sess-torn",
				ledger_path: tornLedger,
				repo_root: repo,
			}),
		});
		assert.equal(torn.ok, false);
		if (!torn.ok) {
			assert.equal(torn.reason_code, "SOVEREIGN_LEDGER_SIDECAR_PARTIAL_WRITE");
		}
		assert.equal(readFileSync(tornSidecar, "utf8").includes("PARTIAL"), true);
		assert.equal(readFileSync(tornSidecar, "utf8").includes("\n"), false);
	} finally {
		rmSync(repo, { recursive: true, force: true });
	}
});

test("test_us0144_drain_gate_preset_zero", async () => {
	const bridge = countingBridge((op, payload) => {
		if (op === "drain_candidate_gate") {
			const auto = String(payload.auto_accept ?? "0");
			const decision = String(payload.operator_decision ?? "pending");
			return {
				candidate_id: String(payload.candidate_id),
				decision_gate: true,
				operator_decision: decision,
				materialize: auto !== "0" ? false : decision === "accept",
			};
		}
		return defaultFakeResult(op);
	});
	const runtime = createSovereignRuntime({
		config: cfg({
			sovereign: {
				CROSS_MODEL_REVIEW: "1",
				SOVEREIGN_RUNTIME: "1",
				SOVEREIGN_DRAIN_AUTO_ACCEPT: "0",
			},
			autonomy: { AUTONOMY_PRESET: "full", flags: { SOVEREIGN_DRAIN_AUTO_ACCEPT: "1" } },
		}),
		kernelBridge: bridge,
	});
	const generated = runtime.advanceCandidates({
		candidates: [{ candidate_id: "gen-1", operator_decision: "pending" }],
	});
	assert.equal(generated.length, 1);
	await assert.rejects(
		() =>
			runtime.gateDrainCandidate({
				orchestrator_run_id: "auto-20260913-us0144",
				candidate: generated[0],
				auto_accept: "0",
				preset_auto_accept: "1",
			}),
		(err: unknown) =>
			isWorkflowError(err) &&
			(err as WorkflowError).code === SOVEREIGN_DRAIN_OPERATOR_DECISION_REQUIRED,
	);
	const accepted = await runtime.gateDrainCandidate({
		orchestrator_run_id: "auto-20260913-us0144",
		candidate: { candidate_id: "gen-1", operator_decision: "accept" },
		auto_accept: "0",
		preset_auto_accept: "1",
	});
	assert.equal(accepted.materialize, true);
	assert.equal(accepted.decision_gate, true);
});

test("test_us0144_per_candidate_operator_decision", async () => {
	const bridge = countingBridge((op, payload) => {
		if (op === "drain_candidate_gate") {
			const decision = String(payload.operator_decision ?? "pending");
			return {
				candidate_id: String(payload.candidate_id),
				decision_gate: true,
				operator_decision: decision,
				materialize: decision === "accept",
			};
		}
		return defaultFakeResult(op);
	});
	const runtime = createSovereignRuntime({
		config: cfg({ sovereign: { SOVEREIGN_RUNTIME: "1", CROSS_MODEL_REVIEW: "1" } }),
		kernelBridge: bridge,
	});
	for (const id of ["a", "b", "c"]) {
		await assert.rejects(
			() =>
				runtime.gateDrainCandidate({
					orchestrator_run_id: "auto-20260913-us0144",
					candidate: { candidate_id: id, operator_decision: "pending" },
				}),
			(err: unknown) =>
				isWorkflowError(err) &&
				(err as WorkflowError).code === SOVEREIGN_DRAIN_OPERATOR_DECISION_REQUIRED,
			id,
		);
	}
	await runtime.gateDrainCandidate({
		orchestrator_run_id: "auto-20260913-us0144",
		candidate: { candidate_id: "a", operator_decision: "accept" },
	});
	await assert.rejects(
		() =>
			runtime.gateDrainCandidate({
				orchestrator_run_id: "auto-20260913-us0144",
				candidate: { candidate_id: "b", operator_decision: "reject" },
			}),
		(err: unknown) =>
			isWorkflowError(err) &&
			(err as WorkflowError).code === SOVEREIGN_DRAIN_OPERATOR_DECISION_REQUIRED,
	);
});

test("test_us0144_blocking_only_convergence_smoke_truth", async () => {
	const bridge = countingBridge((op) => {
		if (op === "convergence_evaluate") {
			return {
				converged: false,
				unmet_conditions: ["open_blocking_critic"],
				blocked_by: ["blocking_finding"],
				nonblocking_open: ["nb-1"],
				conjuncts: { smoke_green: { status: "pass", skipped: false } },
				smoke_browser_claimed: false,
				blocking_only: true,
			};
		}
		return defaultFakeResult(op);
	});
	const runtime = createSovereignRuntime({
		config: cfg({ sovereign: { SOVEREIGN_RUNTIME: "1", CROSS_MODEL_REVIEW: "1" } }),
		kernelBridge: bridge,
	});
	const result = await runtime.afterProducerBoundary({
		orchestrator_run_id: "auto-20260913-us0144",
		producer_model_id: "cursor-grok-4.6-high",
		phase_id: "execute",
		producer_role: "dev",
	});
	assert.equal(result?.ok, true);
	if (result?.ok) {
		assert.equal(result.evidence.convergence.blocking_only, true);
		assert.equal(result.evidence.convergence.smoke_browser_claimed, false);
		assert.equal(JSON.stringify(result.evidence).includes('browser_pass":true'), false);
	}
});

test("test_us0144_caps_progress_partial_delivery_boundaries", async () => {
	assert.deepEqual(
		[...RELEASE_GATE_ORDER],
		["check_in_tests", "independent_qa", "uat_evidence", "release_artifacts", "fail_closed_reason"],
	);
	const { sv } = supervisor();
	const q10 = createWorkflowEngine({
		supervisor: sv,
		config: cfg({ sovereign: { CROSS_MODEL_REVIEW: "1", SOVEREIGN_RUNTIME: "0" } }),
		env: {},
	});
	const scheduledOnly = await q10.runAuto(routeInput());
	assert.equal(scheduledOnly.critic_scheduled, true);
	assert.equal(scheduledOnly.critic_content, false);
	assert.equal(scheduledOnly.sovereign, undefined);
	assert.equal(scheduledOnly.items_processed, 1);

	const bridge = countingBridge((op) => {
		if (op === "convergence_evaluate") {
			return {
				converged: false,
				unmet_conditions: ["caps"],
				blocked_by: ["SOVEREIGN_GOAL_TIMEOUT"],
				smoke_browser_claimed: false,
				blocking_only: true,
			};
		}
		return defaultFakeResult(op);
	});
	const runtime = createSovereignRuntime({
		config: cfg({ sovereign: { SOVEREIGN_RUNTIME: "1", CROSS_MODEL_REVIEW: "1" } }),
		kernelBridge: bridge,
	});
	const content = await runtime.afterProducerBoundary({
		orchestrator_run_id: "auto-20260913-us0144",
		producer_model_id: "cursor-grok-4.6-high",
		phase_id: "execute",
		producer_role: "dev",
		iteration: 3,
		token_budget_remaining: 12,
	});
	assert.equal(content?.ok, true);
	if (content?.ok) {
		assert.equal(content.evidence.caps.iteration, 3);
		assert.equal(content.evidence.caps.token_budget_remaining, 12);
		assert.equal(typeof content.evidence.partial_delivery_ref, "string");
		assert.equal(content.evidence.goal_progress.converged, false);
	}
	assert.equal(existsSync(join(KIT_ROOT, ".opencode", "commands", "auto.md")), false);
	assert.equal(MARKERS.length, 12);
	for (const marker of MARKERS) {
		assert.equal(marker.startsWith("test_us0144_"), true);
	}
});
