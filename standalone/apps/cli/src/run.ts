import { dispatchItsmCommand, readMaskedTtySecret } from "@its-magic/auth-models";
import { createAuthRuntimeAdapter } from "@its-magic/pi-kernel";
import type { SessionSupervisor } from "@its-magic/role-runtime";
import {
	type ConfigView,
	createOperatorCommandFacade,
	createOperatorObservabilityService,
	createOperatorSession,
	OPERATOR_RUN_ID,
	type RouteInput,
	resolveOperatorTransport,
} from "@its-magic/runtime-core";
import { type RuntimeHost, readHostAppHealth } from "@its-magic/runtime-host";

export interface CliRunDeps {
	projectRoot: string;
	host?: RuntimeHost;
	/** Test-only dependency seam. Production callers inject RuntimeHost. */
	supervisor?: SessionSupervisor;
	routeInput?: Partial<RouteInput>;
	env?: NodeJS.ProcessEnv;
}

function splitOperatorArgv(argv: string[]): {
	commandArgv: string[];
	validatorName?: string;
	policyProbe: boolean;
} {
	const commandArgv: string[] = [];
	let validatorName: string | undefined;
	let policyProbe = false;
	for (const arg of argv) {
		if (arg.startsWith("--validator=")) {
			validatorName = arg.slice("--validator=".length);
			continue;
		}
		if (arg === "--policy-probe") {
			policyProbe = true;
			continue;
		}
		commandArgv.push(arg);
	}
	return { commandArgv, validatorName, policyProbe };
}

function publicConfig(config: RuntimeHost["config"]): Record<string, unknown> {
	return {
		schema_version: config.schema_version,
		delivery: config.delivery,
		token: config.token,
		security: {
			security_class: config.security.security_class,
			permission_mode: config.security.permission_mode,
			isolation_profile: config.security.isolation_profile,
		},
		model: {
			catalog_handle: config.model.catalog_handle,
			thinking_level: config.model.thinking_level,
		},
	};
}

async function probePolicy(
	host: RuntimeHost,
	projectRoot: string,
): Promise<{ allow: string; deny: boolean }> {
	const tools = host.toolBroker.ownedToolsFor({
		role_id: "scout",
		phase_id: "ask",
		worktree_root: projectRoot,
		cwd: projectRoot,
		run_id: "itsm-operator",
		kernel_session_id: "operator-probe",
	});
	const read = tools.find((tool) => tool.name === "itsm_read");
	if (!read) {
		return { allow: "", deny: false };
	}
	const allowed = await read.execute("allow-1", { path: "src/runtime-host.ts" });
	const denied = await read.execute("deny-1", { path: "../outside" });
	const allowDetails = (allowed.details ?? {}) as { policy?: string };
	const denyDetails = (denied.details ?? {}) as { denied?: boolean };
	return { allow: allowDetails.policy ?? "", deny: denyDetails.denied === true };
}

function printHelp(): void {
	console.log(`itsm - its-magic operator CLI

Usage:
  itsm status
  itsm resume
  itsm auth <list|login|logout|migrate>
  itsm auth login <provider> --type api_key --api-key-stdin
  itsm models <list|test>
  itsm <phase-or-command>

Run 'itsm status' to inspect the installed repository.`);
}

export async function runCliArgv(argv: string[], deps: CliRunDeps): Promise<number> {
	const split = splitOperatorArgv(argv);
	const commandArgv = split.commandArgv;
	const env = deps.env ?? process.env;
	const token = commandArgv[0];
	if (!token || token === "help" || token === "--help" || token === "-h") {
		printHelp();
		return 0;
	}
	if (token === "auth" || token === "models") {
		return dispatchItsmCommand(commandArgv, {
			adapter: createAuthRuntimeAdapter(),
			projectRoot: deps.projectRoot,
			env,
			io: {
				stdout: (line) => console.log(line),
				stderr: (line) => console.error(line),
				prompt: (message) => readMaskedTtySecret(message),
			},
		});
	}
	if (!deps.host?.store || !deps.host.supervisor) {
		throw new Error("RUNTIME_HOST_REQUIRED");
	}
	const host = deps.host;
	const operatorSession = createOperatorSession();
	const facade = createOperatorCommandFacade({
		router: host.router,
		defaultRouteInput: deps.routeInput,
	});
	const config = host.config as ConfigView;
	const observability = createOperatorObservabilityService({
		projectRoot: deps.projectRoot,
		store: host.store,
		config,
		readOnlyTokenLedger: true,
		ports: {
			readAppHealth: () => readHostAppHealth(host.app),
		},
	});
	let kernelRoot = deps.projectRoot;
	try {
		const located = await host.bridge.locateProjectKernel({ cwd: deps.projectRoot });
		kernelRoot = located.kernelRoot;
	} catch {
		kernelRoot = deps.projectRoot;
	}
	const routeInput = {
		...deps.routeInput,
		...(split.validatorName ? { validator_name: split.validatorName } : {}),
	};
	const transport = await resolveOperatorTransport({
		projectRoot: deps.projectRoot,
		session: operatorSession,
		preferDaemon: env.ITS_MAGIC_IN_PROCESS !== "1",
		requireDaemon: env.ITS_MAGIC_REQUIRE_DAEMON === "1",
		client_kind: "cli",
		facade,
		store: host.store,
		supervisor: host.supervisor,
		config,
		intel: host.intel,
		observability,
		kernelRoot,
		kernelBridge: host.bridge,
		routeInput,
		env,
		app: host.app,
		browser: host.browser,
	});
	const policy = split.policyProbe ? await probePolicy(host, deps.projectRoot) : undefined;
	const result = await transport.submitCommand({
		run_id: OPERATOR_RUN_ID,
		argv: commandArgv,
		client_kind: "cli",
	});
	console.log(
		JSON.stringify(
			{
				...result,
				store_path: host.store.path,
				config: publicConfig(host.config),
				transport: transport.kind,
				disposition: result.disposition ?? "routed",
				...(policy ? { policy } : {}),
			},
			null,
			2,
		),
	);
	if (result.disposition === "execution_failure") {
		return 1;
	}
	return 0;
}
