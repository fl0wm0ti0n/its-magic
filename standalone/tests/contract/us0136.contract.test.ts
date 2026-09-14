import assert from "node:assert/strict";
import { mkdtempSync, readdirSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
	AGENT_KERNEL_METHODS,
	createAgentKernel,
	getLoaderSnapshot,
	getProductionFactorySpec,
} from "../../packages/pi-kernel/src/index.ts";
import {
	ATTESTATION_HASH_MISMATCH,
	ATTESTATION_KERNEL_SESSION_MISMATCH,
	ATTESTATION_MISSING,
	AUTO_ORCHESTRATOR_PHASE_EXECUTION,
	assertKitProof,
	assertNoOrchestratorPhaseWrite,
	assertOrchestratorSchedulingOnly,
	assertSidecarPresent,
	attachStandaloneAttestation,
	BOUNDED_MANIFEST_KEYS,
	computeAttestationHash,
	createDefaultRoleCatalog,
	createSessionSupervisor,
	PHASE_ROLE_CAPABILITY_MISSING,
	PHASE_ROLE_MISMATCH,
	RoleRuntimeError,
	RUNTIME_PROOF_STALE,
	resolvePhaseRole,
	SESSION_CONTINUATION_DENIED,
	SESSION_ORCHESTRATOR_TOOLS_DENIED,
	SESSION_REUSED_ACROSS_PHASE,
	SESSION_TRANSCRIPT_CARRYOVER,
	SESSION_UNKNOWN_PHASE,
	SESSION_UNKNOWN_ROLE,
	type SessionSupervisor,
	verifyAttestationHash,
} from "../../packages/role-runtime/src/index.ts";
import type {
	AgentKernel,
	KernelEvent,
	KernelSession,
} from "../../packages/role-runtime/src/kernel-port.ts";

const HERE = dirname(fileURLToPath(import.meta.url));
const STANDALONE_ROOT = join(HERE, "..", "..");
const ROLE_RUNTIME_ROOT = join(STANDALONE_ROOT, "packages", "role-runtime");
const PI_KERNEL_SRC = join(STANDALONE_ROOT, "packages", "pi-kernel", "src");
const KERNEL_TS = join(PI_KERNEL_SRC, "kernel.ts");
const ISOLATION_TS = join(PI_KERNEL_SRC, "isolation.ts");

function walkTs(root: string): string[] {
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

class FakeSession implements KernelSession {
	readonly sessionId: string;
	disposed = false;
	aborted = false;
	private readonly listeners = new Set<(e: KernelEvent) => void>();

	constructor(sessionId: string) {
		this.sessionId = sessionId;
	}

	async run(): Promise<void> {}
	async steer(): Promise<void> {}
	async abort(): Promise<void> {
		this.aborted = true;
	}
	dispose(): void {
		this.disposed = true;
		this.listeners.clear();
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
	subscribe(handler: (e: KernelEvent) => void): () => void {
		this.listeners.add(handler);
		return () => this.listeners.delete(handler);
	}
}

function fakeKernel(ids?: string[]): { kernel: AgentKernel; sessions: FakeSession[] } {
	const sessions: FakeSession[] = [];
	let n = 0;
	const kernel: AgentKernel = {
		async createSession() {
			const id = ids && n < ids.length ? ids[n] : `sess-${crypto.randomUUID()}`;
			n += 1;
			const session = new FakeSession(id as string);
			sessions.push(session);
			return session;
		},
	};
	return { kernel, sessions };
}

function supervisor(kernel: AgentKernel, env?: NodeJS.ProcessEnv): SessionSupervisor {
	return createSessionSupervisor({ kernel, env });
}

function spawnBase(
	overrides: Partial<{
		phase_id: string;
		role_id: string;
		iteration_key: string;
		parent_phase_session_id: string | null;
		tools: string[];
		model_id: string;
	}> = {},
) {
	return {
		orchestrator_run_id: "auto-20260913-us0136",
		model_id: overrides.model_id ?? "openai/itsm-fake-ping",
		phase_id: overrides.phase_id ?? "execute",
		role_id: overrides.role_id,
		iteration_key: overrides.iteration_key,
		parent_phase_session_id: overrides.parent_phase_session_id,
		tools: overrides.tools,
	};
}

function isCode(err: unknown, code: string): boolean {
	return err instanceof RoleRuntimeError && err.code === code;
}

test("test_us0136_po_dev_distinct_session_ids", async () => {
	const { kernel } = fakeKernel();
	const sup = supervisor(kernel);
	const po = await sup.spawn(spawnBase({ phase_id: "discovery", role_id: "po" }));
	const dev = await sup.spawn(spawnBase({ phase_id: "execute", role_id: "dev" }));
	try {
		assert.notEqual(po.kernel_session_id, dev.kernel_session_id);
		assert.equal(po.fresh, true);
		assert.equal(dev.fresh, true);
		assert.equal(po.role_id, "po");
		assert.equal(dev.role_id, "dev");
	} finally {
		await sup.end(po.kernel_session_id);
		await sup.end(dev.kernel_session_id);
	}
});

test("test_us0136_execute_qa_cycle_new_ids", async () => {
	const { kernel } = fakeKernel();
	const sup = supervisor(kernel);
	const ex1 = await sup.spawn(spawnBase({ phase_id: "execute", iteration_key: "1" }));
	const qa1 = await sup.spawn(spawnBase({ phase_id: "qa", role_id: "qa", iteration_key: "1" }));
	await sup.end(ex1.kernel_session_id);
	await sup.end(qa1.kernel_session_id);
	const ex2 = await sup.spawn(spawnBase({ phase_id: "execute", iteration_key: "2" }));
	const qa2 = await sup.spawn(spawnBase({ phase_id: "qa", role_id: "qa", iteration_key: "2" }));
	try {
		const ids = [ex1, qa1, ex2, qa2].map((s) => s.kernel_session_id);
		assert.equal(new Set(ids).size, 4);
		const cont = await sup.spawn({
			...spawnBase({ phase_id: "qa", role_id: "qa", iteration_key: "2" }),
			continuation: qa2.contract,
		});
		assert.equal(cont.kernel_session_id, qa2.kernel_session_id);
		assert.equal(cont.fresh, false);
		await assert.rejects(
			() =>
				sup.spawn({
					...spawnBase({ phase_id: "qa", role_id: "qa", iteration_key: "3" }),
					continuation: qa2.contract,
				}),
			(err: unknown) => isCode(err, SESSION_CONTINUATION_DENIED),
		);
	} finally {
		await sup.end(ex2.kernel_session_id);
		await sup.end(qa2.kernel_session_id);
	}
});

test("test_us0136_critic_distinct_session", async () => {
	const { kernel } = fakeKernel();
	const sup = supervisor(kernel);
	const producer = await sup.spawn(spawnBase({ phase_id: "architecture", role_id: "tech-lead" }));
	const critic = await sup.spawn(
		spawnBase({
			phase_id: "sovereign-critic",
			role_id: "tech-lead",
			parent_phase_session_id: producer.kernel_session_id,
			model_id: "anthropic/critic",
		}),
	);
	try {
		assert.notEqual(critic.kernel_session_id, producer.kernel_session_id);
		assert.equal(critic.fresh, true);
		assert.equal(critic.role_id, "tech-lead");
		const rows = sup.assertAttestations(critic.kernel_session_id);
		assert.ok(rows.every((r) => r.parent_phase_session_id === producer.kernel_session_id));
		assert.ok(rows.every((r) => r.fresh === true));
		await assert.rejects(
			() =>
				sup.spawn({
					...spawnBase({
						phase_id: "sovereign-critic",
						role_id: "tech-lead",
						parent_phase_session_id: producer.kernel_session_id,
					}),
					continuation: {
						schema_version: 1,
						phase_id: "sovereign-critic",
						role_id: "tech-lead",
						kernel_session_id: producer.kernel_session_id,
						allowed_ops: ["run", "steer"],
					},
				}),
			(err: unknown) => isCode(err, SESSION_CONTINUATION_DENIED),
		);
	} finally {
		await sup.end(critic.kernel_session_id);
		await sup.end(producer.kernel_session_id);
	}
});

test("test_us0136_crash_orphan_discard", async () => {
	const { kernel, sessions } = fakeKernel();
	const sup = supervisor(kernel);
	const orphan = await sup.spawn(spawnBase({ phase_id: "execute" }));
	assert.equal(sup.attestations.hasEvent(orphan.kernel_session_id, "end"), false);
	await sup.discardOrphans();
	assert.equal(sessions[0]?.disposed, true);
	assert.equal(sessions[0]?.aborted, true);
	assert.equal(sup.getLive(orphan.kernel_session_id), undefined);
	const next = await sup.spawn(spawnBase({ phase_id: "execute", iteration_key: "after-crash" }));
	try {
		assert.notEqual(next.kernel_session_id, orphan.kernel_session_id);
		assert.equal(next.fresh, true);
	} finally {
		await sup.end(next.kernel_session_id);
	}
});

test("test_us0136_session_dispose", async () => {
	const { kernel, sessions } = fakeKernel(["keep-id", "keep-id"]);
	const sup = supervisor(kernel);
	const first = await sup.spawn(spawnBase({ phase_id: "execute" }));
	await sup.end(first.kernel_session_id);
	assert.equal(sessions[0]?.disposed, true);
	await assert.rejects(
		() => sup.spawn(spawnBase({ phase_id: "qa", role_id: "qa" })),
		(err: unknown) => isCode(err, SESSION_REUSED_ACROSS_PHASE),
	);
	assert.equal(sessions[1]?.disposed, true);
});

test("test_us0136_reused_id_fail_closed", async () => {
	const { kernel } = fakeKernel(["same-id", "same-id"]);
	const sup = supervisor(kernel);
	const first = await sup.spawn(spawnBase({ phase_id: "intake", role_id: "po" }));
	try {
		await assert.rejects(
			() => sup.spawn(spawnBase({ phase_id: "execute", role_id: "dev" })),
			(err: unknown) => isCode(err, SESSION_REUSED_ACROSS_PHASE),
		);
		const other = createSessionSupervisor({ kernel: fakeKernel().kernel });
		await assert.rejects(
			() =>
				other.spawn({
					...spawnBase({ phase_id: "execute" }),
					continuation: first.contract,
				}),
			(err: unknown) => isCode(err, SESSION_CONTINUATION_DENIED),
		);
	} finally {
		await sup.end(first.kernel_session_id);
	}
});

test("test_us0136_role_mismatch_fail_closed", () => {
	assert.throws(
		() => resolvePhaseRole({ phase_id: "execute", role_id: "qa" }),
		(err: unknown) => isCode(err, PHASE_ROLE_MISMATCH),
	);
	assert.throws(
		() => resolvePhaseRole({ phase_id: "not-a-phase" }),
		(err: unknown) => isCode(err, SESSION_UNKNOWN_PHASE),
	);
	assert.throws(
		() =>
			resolvePhaseRole({
				phase_id: "research",
				env: { AUTO_ROLE_RESEARCH: "ghost" },
			}),
		(err: unknown) => isCode(err, SESSION_UNKNOWN_ROLE),
	);
	const unset = resolvePhaseRole({ phase_id: "research", env: {} });
	assert.equal(unset.role_id, "tech-lead");
	const catalog = createDefaultRoleCatalog();
	assert.equal(catalog.schema_version, 1);
	assert.equal(catalog.phases["sovereign-critic"]?.canonical_role, "tech-lead");
	assert.equal(catalog.roles.scout?.mutability, "none");
	assert.deepEqual([...BOUNDED_MANIFEST_KEYS], ["objective_function", "review_focus"]);
});

test("test_us0136_transcript_carryover_fail_closed", async () => {
	const { kernel } = fakeKernel();
	const sup = supervisor(kernel);
	await assert.rejects(
		() => sup.spawn({ ...spawnBase({ phase_id: "execute" }), entries: [{ role: "po" }] }),
		(err: unknown) => isCode(err, SESSION_TRANSCRIPT_CARRYOVER),
	);
	await assert.rejects(
		() => sup.spawn({ ...spawnBase({ phase_id: "execute" }), parentSession: "parent-1" }),
		(err: unknown) => isCode(err, SESSION_TRANSCRIPT_CARRYOVER),
	);
	const live = await sup.spawn(spawnBase({ phase_id: "execute" }));
	try {
		await assert.rejects(
			() =>
				sup.spawn({
					...spawnBase({ phase_id: "execute" }),
					continuation: {
						schema_version: 1,
						phase_id: "execute",
						role_id: "dev",
						kernel_session_id: live.kernel_session_id,
						allowed_ops: ["run", "fork" as "run"],
					},
				}),
			(err: unknown) => isCode(err, SESSION_CONTINUATION_DENIED),
		);
		const kernelSrc = readFileSync(KERNEL_TS, "utf8");
		assert.equal(kernelSrc.includes("continueRecent"), false);
		assert.equal(kernelSrc.includes("forkFrom"), false);
		assert.equal(kernelSrc.includes("parentSession"), false);
		assert.deepEqual([...AGENT_KERNEL_METHODS], ["createSession"]);
	} finally {
		await sup.end(live.kernel_session_id);
	}
});

test("test_us0136_missing_stale_hash_attestation", async () => {
	const persistDir = mkdtempSync(join(tmpdir(), "us0136-attest-"));
	const { kernel } = fakeKernel();
	const sup = createSessionSupervisor({ kernel, persistDir });
	const session = await sup.spawn(spawnBase({ phase_id: "execute" }));
	try {
		const rows = sup.assertAttestations(session.kernel_session_id);
		assert.equal(
			rows.some((r) => r.attestation_event === "spawn"),
			true,
		);
		assert.equal(
			rows.some((r) => r.attestation_event === "start"),
			true,
		);
		for (const row of rows) {
			verifyAttestationHash(row);
			assert.equal(row.kernel, "pi");
			assert.equal(row.kernel_session_id, session.kernel_session_id);
			assert.match(row.kernel_process_instance, /:/);
			assert.ok(row.context_pack_hash);
			assert.ok(row.policy_hash);
		}
		const first = rows[0];
		assert.ok(first);
		const { attestation_hash, ...rest } = first;
		assert.equal(computeAttestationHash(rest), attestation_hash);
		const evidence = attachStandaloneAttestation({ phase_id: "execute", role: "dev" }, first);
		assert.equal(evidence.standalone_attestation.kernel_session_id, session.kernel_session_id);
		assert.throws(
			() => sup.assertAttestations("missing-id"),
			(err: unknown) => isCode(err, ATTESTATION_MISSING),
		);
		const tampered = { ...first, attestation_hash: "0".repeat(64) };
		assert.throws(
			() => verifyAttestationHash(tampered),
			(err: unknown) => isCode(err, ATTESTATION_HASH_MISMATCH),
		);
		assert.throws(
			() => assertSidecarPresent(sup.attestations, session.kernel_session_id, "other-live-id"),
			(err: unknown) => isCode(err, ATTESTATION_KERNEL_SESSION_MISMATCH),
		);
		assert.throws(
			() =>
				assertKitProof({
					proof_hash: "A".repeat(64),
					proof_issued_at: "2020-01-01T00:00:00Z",
					proof_ttl_seconds: 1,
				}),
			(err: unknown) => isCode(err, RUNTIME_PROOF_STALE),
		);
		await assert.rejects(
			() =>
				sup.spawn({
					...spawnBase({ phase_id: "qa", role_id: "qa" }),
					kitProof: {
						proof_hash: "B".repeat(64),
						proof_ttl: "2000-01-01T00:00:00Z",
					},
				}),
			(err: unknown) => isCode(err, RUNTIME_PROOF_STALE),
		);
	} finally {
		await sup.end(session.kernel_session_id);
	}
});

test("test_us0136_orchestrator_mutation_deny_and_no_pi_imports", async () => {
	assert.throws(
		() => assertOrchestratorSchedulingOnly(["write"]),
		(err: unknown) => isCode(err, SESSION_ORCHESTRATOR_TOOLS_DENIED),
	);
	assert.throws(
		() => assertOrchestratorSchedulingOnly(["itsm_ping"]),
		(err: unknown) => isCode(err, SESSION_ORCHESTRATOR_TOOLS_DENIED),
	);
	assert.throws(
		() => assertOrchestratorSchedulingOnly(["bash"]),
		(err: unknown) => isCode(err, SESSION_ORCHESTRATOR_TOOLS_DENIED),
	);
	assert.doesNotThrow(() => assertOrchestratorSchedulingOnly([]));
	assert.throws(
		() => assertNoOrchestratorPhaseWrite(),
		(err: unknown) => isCode(err, AUTO_ORCHESTRATOR_PHASE_EXECUTION),
	);
	const { kernel } = fakeKernel();
	const sup = supervisor(kernel);
	await assert.rejects(
		() =>
			sup.spawn({
				orchestrator_run_id: "auto-20260913-us0136",
				model_id: "openai/itsm-fake-ping",
				phase_id: "map-codebase",
				role_id: "scout",
				tools: ["write"],
			}),
		(err: unknown) => isCode(err, PHASE_ROLE_CAPABILITY_MISSING),
	);

	const pkg = JSON.parse(readFileSync(join(ROLE_RUNTIME_ROOT, "package.json"), "utf8")) as {
		name: string;
		private: boolean;
		version: string;
		dependencies?: Record<string, string>;
		devDependencies?: Record<string, string>;
	};
	assert.equal(pkg.name, "@its-magic/role-runtime");
	assert.equal(pkg.private, true);
	assert.equal(pkg.version, "0.0.0");
	const deps = { ...(pkg.dependencies ?? {}), ...(pkg.devDependencies ?? {}) };
	for (const key of Object.keys(deps)) {
		assert.equal(key.startsWith("@earendil-works/pi-"), false, key);
	}
	const hits: string[] = [];
	for (const path of walkTs(ROLE_RUNTIME_ROOT)) {
		const text = readFileSync(path, "utf8");
		if (text.includes("@earendil-works/pi-")) {
			hits.push(path);
		}
	}
	assert.deepEqual(hits, []);
	const biome = readFileSync(join(STANDALONE_ROOT, "biome.json"), "utf8");
	assert.equal(biome.includes("packages/role-runtime"), false);
	const spec = getProductionFactorySpec();
	assert.equal(spec.noTools, "builtin");
	const kernelSrc = readFileSync(KERNEL_TS, "utf8");
	assert.equal(kernelSrc.includes("noTools: spec.noTools"), true);
	assert.equal(kernelSrc.includes("createFakeModel"), true);
	assert.equal(/continueRecent|forkFrom|parentSession/.test(kernelSrc), false);
	const isolation = readFileSync(ISOLATION_TS, "utf8");
	assert.equal(isolation.includes("extensions: []"), true);
	assert.equal(/additionalExtensionPaths\s*:/.test(isolation), false);
	const session = await createAgentKernel().createSession();
	try {
		const snap = getLoaderSnapshot(session);
		assert.equal(snap.extensionCount, 0);
		assert.equal(session.getRuntimeInfo().builtinTools, "disabled");
	} finally {
		session.dispose();
	}
});
