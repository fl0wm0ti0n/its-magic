import type { Model } from "@earendil-works/pi-ai";
import {
	type AgentSession,
	createAgentSession,
	type ResourceLoader,
	SessionManager,
	SettingsManager,
} from "@earendil-works/pi-coding-agent";
import { mapPiEventToKernelEvent } from "./events.ts";
import { createFakeModel, createFakeModelRuntime } from "./fake-model.ts";
import {
	createEmptyResourceLoader,
	createIsolationDirs,
	type IsolationDirs,
	type LoaderSnapshot,
	resolveIsolationMode,
	snapshotLoader,
} from "./isolation.ts";
import { itsmPingTool, wrapOwnedTools } from "./tools.ts";
import {
	type AgentKernel,
	type IsolationMode,
	ITSM_PING_TOOL_NAME,
	type KernelCreateSessionOptions,
	type KernelEvent,
	type KernelRuntimeInfo,
	type KernelSession,
} from "./types.ts";
import { readInstalledPiVersions } from "./versions.ts";

const PRODUCTION_NO_TOOLS = "builtin" as const;

export interface ProductionFactorySpec {
	noTools: typeof PRODUCTION_NO_TOOLS;
	tools: readonly string[];
	customToolNames: readonly string[];
}

export function getProductionFactorySpec(): ProductionFactorySpec {
	return {
		noTools: PRODUCTION_NO_TOOLS,
		tools: [ITSM_PING_TOOL_NAME],
		customToolNames: [ITSM_PING_TOOL_NAME],
	};
}

class PiKernelSession implements KernelSession {
	readonly sessionId: string;
	readonly isolationMode: IsolationMode;
	readonly loaderSnapshot: LoaderSnapshot;
	private readonly session: AgentSession;
	private readonly dirs: IsolationDirs;
	private readonly versions: ReturnType<typeof readInstalledPiVersions>;
	private readonly listeners = new Set<(e: KernelEvent) => void>();
	private unsubPi?: () => void;
	private aborted = false;

	constructor(
		session: AgentSession,
		dirs: IsolationDirs,
		isolationMode: IsolationMode,
		loader: ResourceLoader,
		versions: ReturnType<typeof readInstalledPiVersions>,
	) {
		this.session = session;
		this.sessionId = session.sessionId;
		this.dirs = dirs;
		this.isolationMode = isolationMode;
		this.loaderSnapshot = snapshotLoader(loader);
		this.versions = versions;
		this.unsubPi = session.subscribe((event) => {
			const mapped = mapPiEventToKernelEvent(this.sessionId, {
				type: event.type,
				toolName: "toolName" in event ? String(event.toolName ?? "") : undefined,
			});
			if (!mapped) {
				return;
			}
			if (this.aborted && mapped.type === "tool_execution_start") {
				return;
			}
			for (const handler of this.listeners) {
				handler(mapped);
			}
		});
	}

	async run(text: string): Promise<void> {
		await this.session.prompt(text);
	}

	async steer(text: string): Promise<void> {
		await this.session.steer(text);
	}

	async abort(): Promise<void> {
		this.aborted = true;
		await this.session.abort();
	}

	dispose(): void {
		this.unsubPi?.();
		this.listeners.clear();
		this.session.dispose();
	}

	getRuntimeInfo(): KernelRuntimeInfo {
		return {
			sessionId: this.sessionId,
			piCodingAgentVersion: this.versions.piCodingAgentVersion,
			piAiVersion: this.versions.piAiVersion,
			isolationMode: this.isolationMode,
			builtinTools: "disabled",
		};
	}

	subscribe(handler: (e: KernelEvent) => void): () => void {
		this.listeners.add(handler);
		return () => {
			this.listeners.delete(handler);
		};
	}

	getRegisteredToolNames(): string[] {
		return this.session.getActiveToolNames();
	}

	getIsolationDirs(): IsolationDirs {
		return this.dirs;
	}
}

export function getRegisteredToolNames(session: KernelSession): string[] {
	if (session instanceof PiKernelSession) {
		return session.getRegisteredToolNames();
	}
	throw new Error("session is not a production PiKernelSession");
}

export function getLoaderSnapshot(session: KernelSession): LoaderSnapshot {
	if (session instanceof PiKernelSession) {
		return session.loaderSnapshot;
	}
	throw new Error("session is not a production PiKernelSession");
}

async function openPiSession(options: KernelCreateSessionOptions = {}): Promise<PiKernelSession> {
	const isolationMode = resolveIsolationMode(options.isolationMode);
	const dirs = createIsolationDirs();
	const loader = createEmptyResourceLoader(dirs);
	await loader.reload();
	const versions = readInstalledPiVersions();
	const spec = getProductionFactorySpec();
	const settingsManager = SettingsManager.inMemory({
		compaction: { enabled: false },
		retry: { enabled: false },
	});
	const model = (options.model as Model<"openai-completions"> | undefined) ?? createFakeModel();
	const modelRuntime = options.modelRuntime ?? createFakeModelRuntime("ping");
	const owned = options.ownedTools;
	const customTools = owned !== undefined ? wrapOwnedTools(owned) : [itsmPingTool];
	const tools = owned !== undefined ? owned.map((t) => t.name) : [...spec.tools];

	const { session } = await createAgentSession({
		cwd: dirs.cwd,
		agentDir: dirs.agentDir,
		model,
		modelRuntime: modelRuntime as never,
		thinkingLevel: options.thinkingLevel ?? "off",
		noTools: spec.noTools,
		tools,
		customTools,
		resourceLoader: loader,
		sessionManager: SessionManager.inMemory(dirs.cwd),
		settingsManager,
	});

	return new PiKernelSession(session, dirs, isolationMode, loader, versions);
}

class PiAgentKernel implements AgentKernel {
	async createSession(options?: KernelCreateSessionOptions): Promise<KernelSession> {
		return openPiSession(options);
	}
}

export function createAgentKernel(): AgentKernel {
	return new PiAgentKernel();
}

export const AGENT_KERNEL_METHODS = ["createSession"] as const;

export const KERNEL_SESSION_METHODS = [
	"run",
	"steer",
	"abort",
	"dispose",
	"getRuntimeInfo",
	"subscribe",
	"sessionId",
] as const;
