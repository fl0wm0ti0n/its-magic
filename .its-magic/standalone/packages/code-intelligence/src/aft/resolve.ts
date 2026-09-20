import { existsSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { AFT_BINARY_VERSION } from "./version.ts";

export type AftResolveSource = "cache" | "npm" | "path" | "explicit" | "fake";

export interface AftResolveResult {
	path?: string;
	source: AftResolveSource;
	version: string;
}

function binName(): string {
	return process.platform === "win32" ? "aft.exe" : "aft";
}

/**
 * Resolve ladder: explicit → cache → npm platform package matching pin → PATH.
 * CI never downloads (no cargo, no GitHub release, no network).
 */
export function resolveAftBinary(options: {
	binaryPath?: string;
	env?: NodeJS.ProcessEnv;
	pathLookup?: (name: string) => string | undefined;
}): AftResolveResult {
	const env = options.env ?? process.env;
	const version = AFT_BINARY_VERSION;
	if (options.binaryPath && existsSync(options.binaryPath)) {
		return { path: options.binaryPath, source: "explicit", version };
	}
	if ((env.ITSM_AFT_ADAPTER ?? "fake").toLowerCase() === "fake") {
		return { source: "fake", version };
	}
	if ((env.ITSM_AFT_FAKE ?? "1") !== "0") {
		return { source: "fake", version };
	}
	const cache = join(homedir(), ".cache", "its-magic", "aft", version, binName());
	if (existsSync(cache)) {
		return { path: cache, source: "cache", version };
	}
	const npmCandidates = [
		join(process.cwd(), "node_modules", "@cortexkit", "aft", "bin", binName()),
		join(process.cwd(), "node_modules", ".bin", binName()),
	];
	for (const cand of npmCandidates) {
		if (existsSync(cand)) {
			return { path: cand, source: "npm", version };
		}
	}
	const fromPath = options.pathLookup?.(binName()) ?? options.pathLookup?.("aft");
	if (fromPath && existsSync(fromPath)) {
		return { path: fromPath, source: "path", version };
	}
	return { source: "fake", version };
}
