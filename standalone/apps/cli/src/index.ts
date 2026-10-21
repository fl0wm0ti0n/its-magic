#!/usr/bin/env node
import { classifyCommand, printCliHelp } from "./command-class.ts";

/**
 * Operator CLI (`itsm`). Help, local auth/models, and bare status run before
 * any static import of the workflow runner. Every other token admits the
 * production runtime host, then passes the original argv through.
 */
const argv = process.argv.slice(2);

async function main(): Promise<number> {
	const kind = classifyCommand(argv);
	if (kind === "help") {
		printCliHelp();
		return 0;
	}
	if (kind === "local") {
		const { runLocalCommand } = await import("./local-command.ts");
		return runLocalCommand(argv, process.cwd());
	}
	if (kind === "status") {
		const { printStatusSnapshot } = await import("./status-snapshot.ts");
		return printStatusSnapshot(process.cwd());
	}
	const { createRuntimeHost } = await import("@its-magic/runtime-host");
	const { runCliArgv } = await import("./run.ts");
	const host = await createRuntimeHost({ projectRoot: process.cwd(), lifetime: "direct-cli" });
	try {
		return await runCliArgv(argv, { projectRoot: host.projectRoot, host });
	} finally {
		await host.dispose();
	}
}

try {
	process.exitCode = await main();
} catch (error) {
	const code = error instanceof Error && error.message ? error.message : "RUNTIME_HOST_FAILED";
	console.error(code);
	process.exitCode = 1;
}
