#!/usr/bin/env node
import { createRuntimeHost } from "@its-magic/runtime-host";
import { runCliArgv } from "./run.ts";

/**
 * Operator CLI (`itsm`) — thin client of runtime-core operator facades.
 * `auth`/`models` delegate to auth-models only; workflow commands use OperatorCommandFacade.
 */
const argv = process.argv.slice(2);
const host = await createRuntimeHost({ projectRoot: process.cwd() });
try {
	process.exitCode = await runCliArgv(argv, { projectRoot: host.projectRoot, host });
} finally {
	host.dispose();
}
