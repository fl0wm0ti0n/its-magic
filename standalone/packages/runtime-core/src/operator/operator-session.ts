import type { WorkflowEngine } from "../workflow/workflow-engine.ts";
import type { OperatorSessionState } from "./types.ts";

export interface OperatorSessionDeps {
	engine?: WorkflowEngine;
	onCancel?: () => void;
}

export class OperatorSession {
	private engine: WorkflowEngine | undefined;
	private readonly onCancel: (() => void) | undefined;
	private state: OperatorSessionState = {
		attached: false,
		session_id: null,
		cancel_requested: false,
	};

	constructor(deps: OperatorSessionDeps = {}) {
		this.engine = deps.engine;
		this.onCancel = deps.onCancel;
	}

	attach(engine: WorkflowEngine, session_id?: string | null): void {
		this.engine = engine;
		this.state = {
			attached: true,
			session_id: session_id ?? null,
			cancel_requested: false,
		};
	}

	detach(): void {
		this.state.attached = false;
	}

	reconnect(): OperatorSessionState {
		return { ...this.state, attached: this.engine !== undefined };
	}

	getState(): OperatorSessionState {
		return { ...this.state };
	}

	cancel(): { ok: true; cancel_requested: true } {
		this.state.cancel_requested = true;
		this.onCancel?.();
		return { ok: true, cancel_requested: true };
	}

	getEngine(): WorkflowEngine | undefined {
		return this.engine;
	}
}

export function createOperatorSession(deps?: OperatorSessionDeps): OperatorSession {
	return new OperatorSession(deps);
}
