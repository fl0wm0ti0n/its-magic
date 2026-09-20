import {
	AUTO_ORCHESTRATOR_PHASE_EXECUTION,
	RoleRuntimeError,
	SESSION_ORCHESTRATOR_TOOLS_DENIED,
} from "./errors.ts";

export const ORCHESTRATOR_DENIED_TOOLS = ["write", "bash", "edit", "read"] as const;

export function isOrchestratorMutationTool(name: string): boolean {
	const n = name.trim();
	if (!n) {
		return false;
	}
	if ((ORCHESTRATOR_DENIED_TOOLS as readonly string[]).includes(n)) {
		return true;
	}
	return n.startsWith("itsm_");
}

export function assertOrchestratorSchedulingOnly(tools: string[] | undefined): void {
	const list = tools ?? [];
	for (const tool of list) {
		if (isOrchestratorMutationTool(tool)) {
			throw new RoleRuntimeError(
				SESSION_ORCHESTRATOR_TOOLS_DENIED,
				`Orchestrator cannot receive tool ${tool}`,
			);
		}
	}
}

export function assertNoOrchestratorPhaseWrite(): void {
	throw new RoleRuntimeError(AUTO_ORCHESTRATOR_PHASE_EXECUTION);
}
