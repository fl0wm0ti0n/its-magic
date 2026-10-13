import { DAEMON_UNREACHABLE } from "@its-magic/protocol";
import type { SessionSupervisor } from "@its-magic/role-runtime";
import type { OperatorCommandFacade } from "../operator/operator-command-facade.ts";
import {
	executeOperatorCommand,
	type OperatorExecutorDeps,
	type OperatorIntelPort,
} from "../operator/operator-executor.ts";
import type { OperatorObservabilityService } from "../operator/operator-observability-service.ts";
import type { OperatorSession } from "../operator/operator-session.ts";
import type { OperatorStatusSnapshot } from "../operator/types.ts";
import type { RunsStore } from "../runs/store.ts";
import type { RouteInput } from "../workflow/command-router.ts";
import type { ConfigView } from "../workflow/config-view.ts";
import {
	createWorkflowEngine,
	type WorkflowAppPort,
	type WorkflowBrowserPort,
	type WorkflowEngine,
	type WorkflowEngineDeps,
} from "../workflow/workflow-engine.ts";
import type {
	AttachRunInput,
	CancelRunInput,
	OperatorTransport,
	RespondApprovalInput,
	SubmitCommandInput,
	SubscribeEventsInput,
} from "./operator-transport.ts";

export interface InProcessTransportDeps {
	session: OperatorSession;
	facade?: OperatorCommandFacade;
	emitEvent?: (run_id: string, kind: string, payload?: Record<string, unknown>) => void;
	projectRoot?: string;
	store?: RunsStore;
	engine?: WorkflowEngine;
	observability?: OperatorObservabilityService;
	supervisor?: SessionSupervisor;
	config?: ConfigView;
	intel?: OperatorIntelPort;
	kernelRoot?: string;
	kernelBridge?: WorkflowEngineDeps["kernelBridge"];
	routeInput?: Partial<RouteInput>;
	env?: NodeJS.ProcessEnv;
	app?: WorkflowAppPort;
	browser?: WorkflowBrowserPort;
}

function unreachableSnapshot(): OperatorStatusSnapshot {
	return {
		schema_version: 1,
		orchestrator_run_id: null,
		story_id: null,
		sprint_id: null,
		phase_id: null,
		role_id: null,
		model_id: null,
		backend_id: null,
		app_health: { ok: false, reason_code: DAEMON_UNREACHABLE },
		index_health: { ok: false, reason_code: DAEMON_UNREACHABLE },
		browser_summary: { probe_count: 0, evidence_refs: [] },
		token_cost: { metric_source: "us-0080", total_tokens: null, evidence_ref: null },
		sovereign: null,
		evidence_refs: [DAEMON_UNREACHABLE],
		read_only: true,
	};
}

export function createInProcessTransport(deps: InProcessTransportDeps): OperatorTransport {
	const engine =
		deps.engine ??
		(deps.supervisor
			? createWorkflowEngine({
					supervisor: deps.supervisor,
					config: deps.config ?? {},
					kernelBridge: deps.kernelBridge,
					env: deps.env,
					kernelRoot: deps.kernelRoot ?? deps.projectRoot,
					app: deps.app,
					browser: deps.browser,
					evidenceRoot: deps.projectRoot,
				})
			: undefined);

	return {
		kind: "in_process",
		async attachRun(input: AttachRunInput) {
			return { ok: true, run_id: input.run_id, role: input.role, transport: "in_process" };
		},
		async submitCommand(input: SubmitCommandInput) {
			if (
				!engine ||
				!deps.store ||
				!deps.projectRoot ||
				!deps.observability ||
				!deps.facade ||
				!deps.supervisor
			) {
				throw new Error("RUNTIME_HOST_REQUIRED");
			}
			const executorDeps: OperatorExecutorDeps = {
				projectRoot: deps.projectRoot,
				store: deps.store,
				engine,
				observability: deps.observability,
				facade: deps.facade,
				supervisor: deps.supervisor,
				config: deps.config ?? {},
				intel: deps.intel,
				kernelRoot: deps.kernelRoot ?? deps.projectRoot,
				routeInput: deps.routeInput,
				persistEvent: (run_id, kind, payload) => {
					deps.emitEvent?.(run_id, kind, payload);
				},
				appService: deps.app,
				browserService: deps.browser,
			};
			const result = await executeOperatorCommand(input.argv, input.run_id, executorDeps);
			return { ...result };
		},
		async statusSnapshot() {
			if (!deps.observability) {
				return unreachableSnapshot();
			}
			return deps.observability.buildStatusSnapshot();
		},
		async subscribeEvents(input: SubscribeEventsInput) {
			const unsub = () => undefined;
			deps.emitEvent?.(input.run_id, "subscribe", { after_seq: input.after_seq });
			return { unsubscribe: unsub };
		},
		async cancel(input: CancelRunInput) {
			const result = deps.session.cancel();
			deps.emitEvent?.(input.run_id, "run.cancelled", result);
			return { ...result, run_id: input.run_id };
		},
		async respondApproval(input: RespondApprovalInput) {
			return { ok: true, approval_id: input.approval_id, choice: input.choice };
		},
	};
}
