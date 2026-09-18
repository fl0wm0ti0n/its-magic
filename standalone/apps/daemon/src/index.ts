#!/usr/bin/env node
import { createSessionSupervisor } from "@its-magic/role-runtime";
import type { AgentKernel } from "@its-magic/role-runtime/src/kernel-port.ts";
import { startDaemonServer } from "./server.ts";

const kernel: AgentKernel = {
	async createSession() {
		throw new Error("DAEMON_NO_PI_SESSION");
	},
};

const projectRoot = process.cwd();
const supervisor = createSessionSupervisor({ kernel });
const daemon = await startDaemonServer({ projectRoot, supervisor });
console.log(JSON.stringify({ ok: true, ...daemon, token: "[redacted]" }));
