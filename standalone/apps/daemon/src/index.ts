#!/usr/bin/env node
import { createRuntimeHost } from "@its-magic/runtime-host";
import { startDaemonServer } from "./server.ts";

const projectRoot = process.cwd();
const runtime = await createRuntimeHost({ projectRoot });
try {
	const daemon = await startDaemonServer({ projectRoot, runtime });
	console.log(JSON.stringify({ ok: true, ...daemon, token: "[redacted]" }));
} catch (error) {
	runtime.dispose();
	throw error;
}
