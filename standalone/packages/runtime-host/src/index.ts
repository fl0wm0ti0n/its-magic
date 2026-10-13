import { join } from "node:path";
import { type AppRuntime, createAppRuntime } from "@its-magic/app-runtime";
import {
	type BrowserUAT,
	createBrowserUat,
	PlaywrightIsolatedDriver,
} from "@its-magic/browser-uat";
import {
	type CodeIntelligenceProvider,
	createCodeIntelligenceProvider,
	INTEL_INDEX_UNAVAILABLE,
} from "@its-magic/code-intelligence";
import {
	looksLikeSecret,
	type Provenance,
	type RuntimeConfig,
	resolveRuntimeConfig,
} from "@its-magic/config";
import { assemblePhaseContext, type ContextPack, codeContext } from "@its-magic/context-engine";
import { createKernelBridge, type KernelBridge } from "@its-magic/kernel-bridge";
import { type AgentKernel, createAgentKernel } from "@its-magic/pi-kernel";
import { createSessionSupervisor, type SessionSupervisor } from "@its-magic/role-runtime";
import {
	type CommandRouter,
	createCommandRouter,
	createRunsStore,
	type RunsStore,
} from "@its-magic/runtime-core";
import { createToolBroker, type ToolBroker } from "@its-magic/tool-broker";

export interface RuntimeHost {
	projectRoot: string;
	lifetime: "direct-cli" | "daemon";
	config: RuntimeConfig;
	/** Non-secret config provenance. Values that look like secrets are omitted. */
	provenance: Record<string, Provenance>;
	/** One pack from existing `codeContext`. Not written to disk. */
	contextPack: ContextPack;
	bridge: KernelBridge;
	kernel: AgentKernel;
	supervisor: SessionSupervisor;
	intel: CodeIntelligenceProvider;
	toolBroker: ToolBroker;
	store: RunsStore;
	router: CommandRouter;
	app: AppRuntime;
	browser: BrowserUAT;
	readonly disposed: boolean;
	dispose(): Promise<void>;
}

/** Same id `itsm app` and `readAppHealth` use for the host-owned app service. */
export const OPERATOR_APP_ID = "operator-app";

export function readHostAppHealth(
	app: { snapshotHealth(id?: string): { ok: boolean; reason_code?: string } } | undefined,
): { ok: boolean; reason_code?: string } {
	if (!app) {
		return { ok: false, reason_code: "APP_HEALTH_UNAVAILABLE" };
	}
	return app.snapshotHealth(OPERATOR_APP_ID);
}

export type RuntimeHostErrorCode =
	| "RUNTIME_CONFIG_UNAVAILABLE"
	| "RUNTIME_BRIDGE_UNAVAILABLE"
	| "RUNTIME_KERNEL_ADMISSION_FAILED"
	| "RUNTIME_SERVICE_UNAVAILABLE";

export class RuntimeHostError extends Error {
	readonly code: RuntimeHostErrorCode;

	constructor(code: RuntimeHostErrorCode) {
		super(code);
		this.name = "RuntimeHostError";
		this.code = code;
	}
}

/** Explicit factories are a test seam; production callers use no factories. */
export interface RuntimeHostFactories {
	bridge?: () => KernelBridge;
	kernel?: () => AgentKernel;
	intel?: (projectRoot: string) => CodeIntelligenceProvider;
	store?: (path: string) => RunsStore;
}

export interface RuntimeHostOptions {
	projectRoot: string;
	lifetime: "direct-cli" | "daemon";
	env?: NodeJS.ProcessEnv;
	factories?: RuntimeHostFactories;
}

function nonSecretProvenance(provenance: Record<string, Provenance>): Record<string, Provenance> {
	const out: Record<string, Provenance> = {};
	for (const [key, entry] of Object.entries(provenance)) {
		const blob = `${key} ${entry.source_key} ${entry.label} ${entry.path ?? ""}`;
		if (looksLikeSecret(blob)) {
			continue;
		}
		out[key] = entry;
	}
	return out;
}

/**
 * Build one hashed pack from admitted intelligence hits.
 * Unavailable intelligence throws before `codeContext` and never persists a pack.
 */
function buildContextPack(intel: CodeIntelligenceProvider, config: RuntimeConfig): ContextPack {
	const status = intel.status();
	if (
		status.availability.index === "unavailable" ||
		status.reason_codes.includes(INTEL_INDEX_UNAVAILABLE)
	) {
		throw new Error("intelligence unavailable");
	}
	const searched = intel.search("runtime-host");
	const assembled = assemblePhaseContext({
		candidates: searched.hits,
		flags: {
			AUTO_PHASE_INCLUDE: config.phase.AUTO_PHASE_INCLUDE,
			AUTO_PHASE_EXCLUDE: config.phase.AUTO_PHASE_EXCLUDE,
			SOVEREIGN_MEMORY: config.sovereign.SOVEREIGN_MEMORY,
		},
	});
	return codeContext({
		task: "runtime-host",
		hits: assembled.hits,
		token_profile: config.token.TOKEN_PROFILE,
		exclude_set_hash: assembled.exclude_set_hash,
		reason_codes: [...new Set([...searched.reason_codes, ...assembled.reason_codes])],
	});
}

function bindContextPack(router: CommandRouter, contextPack: ContextPack): CommandRouter {
	const route = router.route.bind(router);
	router.route = ((command, input) =>
		route(command, {
			...input,
			context_pack_hash: input.context_pack_hash ?? contextPack.content_hash,
		})) as CommandRouter["route"];
	return router;
}

export async function createRuntimeHost(options: RuntimeHostOptions): Promise<RuntimeHost> {
	let resolved: ReturnType<typeof resolveRuntimeConfig>;
	try {
		resolved = resolveRuntimeConfig(options.projectRoot, {
			configRoot: options.projectRoot,
			env: options.env,
			materializeMissingShared: false,
		});
	} catch {
		throw new RuntimeHostError("RUNTIME_CONFIG_UNAVAILABLE");
	}
	if (!resolved.ok) {
		throw new RuntimeHostError("RUNTIME_CONFIG_UNAVAILABLE");
	}
	const provenance = nonSecretProvenance(resolved.provenance);

	let bridge: KernelBridge;
	let kernelRoot: string;
	try {
		bridge = options.factories?.bridge?.() ?? createKernelBridge();
		const located = await bridge.locateProjectKernel({ cwd: options.projectRoot });
		const version = await bridge.getKernelVersion(located.kernelRoot);
		const manifest = await bridge.readContractManifest(located.kernelRoot);
		if (!version || manifest.schema_version !== 1) {
			throw new Error("invalid contract");
		}
		kernelRoot = located.kernelRoot;
	} catch {
		throw new RuntimeHostError("RUNTIME_BRIDGE_UNAVAILABLE");
	}

	let kernel: AgentKernel;
	try {
		kernel = options.factories?.kernel?.() ?? createAgentKernel();
	} catch {
		throw new RuntimeHostError("RUNTIME_KERNEL_ADMISSION_FAILED");
	}
	let store: RunsStore | undefined;
	let hostServices:
		| {
				store: RunsStore;
				supervisor: SessionSupervisor;
				intel: CodeIntelligenceProvider;
				contextPack: ContextPack;
				toolBroker: ToolBroker;
				router: CommandRouter;
				app: AppRuntime;
				browser: BrowserUAT;
		  }
		| undefined;
	try {
		const supervisor = createSessionSupervisor({ kernel });
		const intel =
			options.factories?.intel?.(options.projectRoot) ??
			createCodeIntelligenceProvider({ repoRoot: options.projectRoot, adapter: "aft" });
		const contextPack = buildContextPack(intel, resolved.config);
		const toolBroker = createToolBroker(intel);
		const storePath = join(options.projectRoot, ".its-magic", "runtime", "ops.sqlite");
		store = options.factories?.store?.(storePath) ?? createRunsStore(storePath);
		const router = bindContextPack(
			createCommandRouter({
				supervisor,
				config: resolved.config,
				kernelBridge: bridge,
				kernelRoot,
				env: options.env,
				toolProvision: ({ role_id, phase_id, orchestrator_run_id }) => {
					const context = {
						role_id,
						phase_id,
						worktree_root: options.projectRoot,
						cwd: options.projectRoot,
						run_id: orchestrator_run_id,
						// Pi assigns the session ID after owned tools have been provisioned.
						kernel_session_id: `pending:${orchestrator_run_id}`,
						permission_mode: resolved.config.security.permission_mode,
						security_class: resolved.config.security.security_class,
						isolation_profile: resolved.config.security.isolation_profile,
					};
					return {
						tools: toolBroker.toolNamesForRole(role_id),
						ownedTools: toolBroker.ownedToolsFor(context),
						policy_hash: toolBroker.policyHash(role_id),
					};
				},
			}),
			contextPack,
		);
		if (!store) {
			throw new Error("store");
		}
		const app = createAppRuntime({
			store,
			config: resolved.config,
			env: options.env,
			logsDir: join(options.projectRoot, ".its-magic", "runtime", "logs"),
		});
		const browser = createBrowserUat({
			driver: new PlaywrightIsolatedDriver(),
			connect: app,
			evidenceDir: options.projectRoot,
			env: options.env,
		});
		hostServices = { store, supervisor, intel, contextPack, toolBroker, router, app, browser };
	} catch {
		store?.close();
		throw new RuntimeHostError("RUNTIME_SERVICE_UNAVAILABLE");
	}
	if (!hostServices) {
		throw new RuntimeHostError("RUNTIME_SERVICE_UNAVAILABLE");
	}
	const built = hostServices;

	let disposed = false;
	let disposePromise: Promise<void> | undefined;
	const dispose = () => {
		if (disposePromise) {
			return disposePromise;
		}
		disposed = true;
		disposePromise = (async () => {
			let cleanupError: unknown;
			try {
				await built.app.cleanup("runtime_restart");
			} catch (err) {
				cleanupError = err;
			}
			try {
				await built.browser.teardown();
			} catch (err) {
				cleanupError ??= err;
			}
			await built.supervisor.discardOrphans();
			built.store.close();
			if (cleanupError) {
				throw cleanupError;
			}
		})();
		return disposePromise;
	};
	return {
		projectRoot: options.projectRoot,
		lifetime: options.lifetime,
		config: resolved.config,
		provenance,
		contextPack: built.contextPack,
		bridge,
		kernel,
		supervisor: built.supervisor,
		intel: built.intel,
		toolBroker: built.toolBroker,
		store: built.store,
		router: built.router,
		app: built.app,
		browser: built.browser,
		get disposed() {
			return disposed;
		},
		dispose,
	};
}
