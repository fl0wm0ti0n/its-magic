import { dispatchItsmCommand } from "@its-magic/auth-models";
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

function printHelp(): void {
	console.log(`itsm - its-magic operator CLI

Usage:
  itsm status
  itsm resume
  itsm auth <list|login|logout|migrate>
  itsm models <list|test>
  itsm <phase-or-command>

Run 'itsm status' to inspect the installed repository.`);
}

export async function runCliArgv(argv: string[], deps: CliRunDeps): Promise<number> {
	const env = deps.env ?? process.env;
	const token = argv[0];
	if (!token || token === "help" || token === "--help" || token === "-h") {
		printHelp();
		return 0;
	}
	if (token === "auth" || token === "models") {
		return dispatchItsmCommand(argv, {
			adapter: createAuthRuntimeAdapter(),
			projectRoot: deps.projectRoot,
			env,
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
		routeInput: deps.routeInput,
		env,
		app: host.app,
		browser: host.browser,
	});
	const result = await transport.submitCommand({
		run_id: OPERATOR_RUN_ID,
		argv,
		client_kind: "cli",
	});
	console.log(JSON.stringify(result, null, 2));
	if (result.disposition === "execution_failure") {
		return 1;
	}
	return 0;
}
