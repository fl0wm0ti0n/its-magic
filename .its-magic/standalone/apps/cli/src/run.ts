import { dispatchItsmCommand } from "@its-magic/auth-models";
import { createAuthRuntimeAdapter } from "@its-magic/pi-kernel";
import type { SessionSupervisor } from "@its-magic/role-runtime";
import {
	createCommandRouter,
	createOperatorCommandFacade,
	createOperatorObservabilityService,
	createOperatorSession,
	createRunsStore,
	isRouteScheduled,
	type RouteInput,
	resolveOperatorTransport,
} from "@its-magic/runtime-core";
import type { RuntimeHost } from "@its-magic/runtime-host";

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
	if (!deps.host && !deps.supervisor) {
		throw new Error("RUNTIME_HOST_REQUIRED");
	}
	const supervisor = deps.host?.supervisor ?? deps.supervisor;
	if (!supervisor) {
		throw new Error("RUNTIME_HOST_REQUIRED");
	}
	const store = deps.host?.store ?? createRunsStore(":memory:");
	const operatorSession = createOperatorSession();
	await resolveOperatorTransport({
		projectRoot: deps.projectRoot,
		session: operatorSession,
		preferDaemon: process.env.ITS_MAGIC_IN_PROCESS !== "1",
		requireDaemon: process.env.ITS_MAGIC_REQUIRE_DAEMON === "1",
		client_kind: "cli",
	});
	const router =
		deps.host?.router ??
		createCommandRouter({ supervisor, config: {}, kernelRoot: deps.projectRoot, env });
	const facade = createOperatorCommandFacade({ router, defaultRouteInput: deps.routeInput });
	const observability = createOperatorObservabilityService({
		projectRoot: deps.projectRoot,
		store,
		readOnlyTokenLedger: true,
	});
	const parsed = await facade.routeArgv(argv, deps.routeInput);
	if (typeof parsed === "object" && "kind" in parsed && parsed.kind === "dedicated") {
		switch (parsed.command) {
			case "status": {
				const snap = observability.buildStatusSnapshot(deps.routeInput?.orchestrator_run_id);
				console.log(JSON.stringify(snap, null, 2));
				return 0;
			}
			case "resume": {
				console.log(JSON.stringify(observability.readResumeBrief(), null, 2));
				return 0;
			}
			case "index":
			case "app":
			case "browser":
			case "ask":
				console.log(JSON.stringify({ command: parsed.command, ok: true }, null, 2));
				return 0;
			default:
				return 1;
		}
	}
	if (isRouteScheduled(parsed)) {
		console.log(
			JSON.stringify({ scheduled: true, command: parsed.command, plan: parsed.plan }, null, 2),
		);
		return 0;
	}
	if (parsed && typeof parsed === "object" && "ok" in parsed && parsed.ok) {
		console.log(
			JSON.stringify({ routed: true, phase_id: parsed.phase_id, role_id: parsed.role_id }, null, 2),
		);
		return 0;
	}
	return 0;
}
