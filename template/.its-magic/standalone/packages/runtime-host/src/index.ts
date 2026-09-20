import { join } from "node:path";
import {
	type CodeIntelligenceProvider,
	createCodeIntelligenceProvider,
} from "@its-magic/code-intelligence";
import { type RuntimeConfig, resolveRuntimeConfig } from "@its-magic/config";
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
	config: RuntimeConfig;
	bridge: KernelBridge;
	kernel: AgentKernel;
	supervisor: SessionSupervisor;
	intel: CodeIntelligenceProvider;
	toolBroker: ToolBroker;
	store: RunsStore;
	router: CommandRouter;
	readonly disposed: boolean;
	dispose(): void;
}

export type RuntimeHostErrorCode =
	| "RUNTIME_CONFIG_UNAVAILABLE"
	| "RUNTIME_BRIDGE_UNAVAILABLE"
	| "RUNTIME_KERNEL_UNAVAILABLE"
	| "RUNTIME_STORE_UNAVAILABLE";

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

export interface CreateRuntimeHostOptions {
	projectRoot: string;
	env?: NodeJS.ProcessEnv;
	factories?: RuntimeHostFactories;
}

export async function createRuntimeHost(options: CreateRuntimeHostOptions): Promise<RuntimeHost> {
	const resolved = resolveRuntimeConfig(options.projectRoot, {
		configRoot: options.projectRoot,
		env: options.env,
		materializeMissingShared: false,
	});
	if (!resolved.ok) {
		throw new RuntimeHostError("RUNTIME_CONFIG_UNAVAILABLE");
	}

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
		throw new RuntimeHostError("RUNTIME_KERNEL_UNAVAILABLE");
	}
	const supervisor = createSessionSupervisor({ kernel });
	const intel =
		options.factories?.intel?.(options.projectRoot) ??
		createCodeIntelligenceProvider({ repoRoot: options.projectRoot, adapter: "aft" });
	const toolBroker = createToolBroker(intel);
	const storePath = join(options.projectRoot, ".its-magic", "runtime", "ops.sqlite");
	let store: RunsStore;
	try {
		store = options.factories?.store?.(storePath) ?? createRunsStore(storePath);
	} catch {
		throw new RuntimeHostError("RUNTIME_STORE_UNAVAILABLE");
	}
	const router = createCommandRouter({
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
	});

	let disposed = false;
	const dispose = () => {
		if (disposed) {
			return;
		}
		disposed = true;
		store.close();
	};
	return {
		projectRoot: options.projectRoot,
		config: resolved.config,
		bridge,
		kernel,
		supervisor,
		intel,
		toolBroker,
		store,
		router,
		get disposed() {
			return disposed;
		},
		dispose,
	};
}
