import { createDaemonTransport, isDaemonReachable } from "./daemon-transport.ts";
import { createInProcessTransport, type InProcessTransportDeps } from "./in-process-transport.ts";
import type { OperatorTransport } from "./operator-transport.ts";

export interface ResolveTransportInput extends InProcessTransportDeps {
	projectRoot: string;
	preferDaemon?: boolean;
	requireDaemon?: boolean;
	daemonBaseUrl?: string;
	daemonToken?: string;
	client_kind?: "cli" | "tui" | "test";
}

export async function resolveOperatorTransport(
	input: ResolveTransportInput,
): Promise<OperatorTransport> {
	const prefer = input.preferDaemon ?? true;
	if (prefer || input.requireDaemon) {
		const reachable =
			input.daemonBaseUrl !== undefined || (await isDaemonReachable(input.projectRoot));
		if (reachable || input.daemonBaseUrl) {
			return createDaemonTransport({
				projectRoot: input.projectRoot,
				baseUrl: input.daemonBaseUrl,
				token: input.daemonToken,
				client_kind: input.client_kind,
			});
		}
		if (input.requireDaemon) {
			return createDaemonTransport({
				projectRoot: input.projectRoot,
				client_kind: input.client_kind,
			});
		}
	}
	return createInProcessTransport(input);
}
