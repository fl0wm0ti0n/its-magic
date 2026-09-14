#!/usr/bin/env node
import { dispatchItsmCommand } from "@its-magic/auth-models";
import type { KernelBridge } from "@its-magic/kernel-bridge";
import { type AgentKernel, createAuthRuntimeAdapter } from "@its-magic/pi-kernel";

/**
 * Phase 0 CLI (code-name `itsm`).
 * Auth/models commands import handlers from auth-models only.
 * No workflow runner and no ToolBroker. Workflow code must import AgentKernel
 * and KernelBridge types only — never vendor SDK modules, never spawn Python.
 */
export type CliKernel = AgentKernel;
export type CliBridge = KernelBridge;

const argv = process.argv.slice(2);
if (argv[0] === "auth" || argv[0] === "models") {
	const code = await dispatchItsmCommand(argv, {
		adapter: createAuthRuntimeAdapter(),
		projectRoot: process.cwd(),
		env: process.env,
	});
	process.exitCode = code;
} else {
	console.log("itsm stub — kernel workspace only (no workflow)");
}
