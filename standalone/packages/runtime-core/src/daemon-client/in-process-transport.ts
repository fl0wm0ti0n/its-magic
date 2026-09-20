import type { OperatorCommandFacade } from "../operator/operator-command-facade.ts";
import type { OperatorSession } from "../operator/operator-session.ts";
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
}

export function createInProcessTransport(deps: InProcessTransportDeps): OperatorTransport {
	return {
		kind: "in_process",
		async attachRun(input: AttachRunInput) {
			return { ok: true, run_id: input.run_id, role: input.role, transport: "in_process" };
		},
		async submitCommand(input: SubmitCommandInput) {
			if (deps.facade) {
				const outcome = await deps.facade.routeArgv(input.argv);
				deps.emitEvent?.(input.run_id, "command.routed", { outcome });
			}
			return { ok: true, run_id: input.run_id, argv: input.argv };
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
