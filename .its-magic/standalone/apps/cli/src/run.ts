import { dispatchItsmCommand } from "@its-magic/auth-models";
import { createAuthRuntimeAdapter } from "@its-magic/pi-kernel";
import {
	createCommandRouter,
	createOperatorCommandFacade,
	createOperatorObservabilityService,
	createOperatorSession,
	createRunsStore,
	isRouteScheduled,
	resolveOperatorTransport,
	type RouteInput,
} from "@its-magic/runtime-core";
import type { SessionSupervisor } from "@its-magic/role-runtime";

export interface CliRunDeps {
	projectRoot: string;
	supervisor: SessionSupervisor;
	routeInput?: Partial<RouteInput>;
	env?: NodeJS.ProcessEnv;
}

export async function runCliArgv(argv: string[], deps: CliRunDeps): Promise<number> {
	const env = deps.env ?? process.env;
	const token = argv[0];
	if (token === "auth" || token === "models") {
		return dispatchItsmCommand(argv, {
			adapter: createAuthRuntimeAdapter(),
			projectRoot: deps.projectRoot,
			env,
		});
	}
	const store = createRunsStore(":memory:");
	const operatorSession = createOperatorSession();
	await resolveOperatorTransport({
		projectRoot: deps.projectRoot,
		session: operatorSession,
		preferDaemon: process.env.ITS_MAGIC_IN_PROCESS !== "1",
		requireDaemon: process.env.ITS_MAGIC_REQUIRE_DAEMON === "1",
		client_kind: "cli",
	});
	const router = createCommandRouter({
		supervisor: deps.supervisor,
		config: {},
		kernelRoot: deps.projectRoot,
		env,
	});
	const facade = createOperatorCommandFacade({ router, defaultRouteInput: deps.routeInput });
	const observability = createOperatorObservabilityService({
		projectRoot: deps.projectRoot,
		store,
		readOnlyTokenLedger: true,
	});
	if (!token) {
		return 0;
	}
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
		console.log(JSON.stringify({ scheduled: true, command: parsed.command, plan: parsed.plan }, null, 2));
		return 0;
	}
	if (parsed && typeof parsed === "object" && "ok" in parsed && parsed.ok) {
		console.log(JSON.stringify({ routed: true, phase_id: parsed.phase_id, role_id: parsed.role_id }, null, 2));
		return 0;
	}
	return 0;
}
