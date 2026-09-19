#!/usr/bin/env node
import type { KernelBridge } from "@its-magic/kernel-bridge";
import type { AgentKernel } from "@its-magic/pi-kernel";
import { createSessionSupervisor } from "@its-magic/role-runtime";
import { runCliArgv } from "./run.ts";

/**
 * Operator CLI (`itsm`) — thin client of runtime-core operator facades.
 * `auth`/`models` delegate to auth-models only; workflow commands use OperatorCommandFacade.
 */
export type CliKernel = AgentKernel;
export type CliBridge = KernelBridge;

const argv = process.argv.slice(2);
const kernel: AgentKernel = {
	async createSession() {
		throw new Error("CLI_OPERATOR_NO_PI_SESSION");
	},
};
const supervisor = createSessionSupervisor({ kernel });
process.exitCode = await runCliArgv(argv, {
	projectRoot: process.cwd(),
	supervisor,
});
