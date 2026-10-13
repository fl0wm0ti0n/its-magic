#!/usr/bin/env node
import { createRuntimeHost } from "@its-magic/runtime-host";
import { startDaemonServer } from "./server.ts";

const projectRoot = process.cwd();
try {
	const runtime = await createRuntimeHost({ projectRoot, lifetime: "daemon" });
	try {
		const daemon = await startDaemonServer({ projectRoot, runtime });
		console.log(
			JSON.stringify({
				ok: true,
				host: daemon.host,
				port: daemon.port,
				baseUrl: daemon.baseUrl,
				token: "[redacted]",
			}),
		);
	} catch (error) {
		await runtime.dispose();
		throw error;
	}
} catch (error) {
	const code = error instanceof Error && error.message ? error.message : "RUNTIME_HOST_FAILED";
	console.error(code);
	process.exitCode = 1;
}
