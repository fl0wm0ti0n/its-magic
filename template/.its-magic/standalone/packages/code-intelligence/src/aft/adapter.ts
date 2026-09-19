import { type ChildProcessWithoutNullStreams, spawn } from "node:child_process";
import { INTEL_AFT_UNAVAILABLE, INTEL_MUTATION_DENIED, isAftMutationMethod } from "../codes.ts";
import type { IntelResult } from "../types.ts";
import { resolveAftBinary } from "./resolve.ts";
import { AFT_BINARY_VERSION } from "./version.ts";

const pools = new Map<string, ChildProcessWithoutNullStreams>();

export function denyMutation(_method: string): IntelResult {
	return {
		hits: [],
		reason_codes: [INTEL_MUTATION_DENIED],
		partial: true,
	};
}

export function shutdownAftPool(): void {
	for (const child of pools.values()) {
		child.kill();
	}
	pools.clear();
}

function sendJsonLine(
	child: ChildProcessWithoutNullStreams,
	payload: Record<string, unknown>,
): Promise<Record<string, unknown>> {
	return new Promise((resolve, reject) => {
		const onData = (buf: Buffer) => {
			const line = buf.toString("utf8").trim();
			if (!line) {
				return;
			}
			child.stdout.off("data", onData);
			try {
				resolve(JSON.parse(line) as Record<string, unknown>);
			} catch (err) {
				reject(err);
			}
		};
		child.stdout.on("data", onData);
		child.stdin.write(`${JSON.stringify(payload)}\n`);
	});
}

/**
 * Nested AFT read sidecar: JSON-over-stdio, one warm process per repo root.
 * Never registers or forwards mutation methods.
 */
export async function invokeAftSidecar(options: {
	repoRoot: string;
	method: string;
	params?: Record<string, unknown>;
	binaryPath?: string;
}): Promise<IntelResult> {
	if (isAftMutationMethod(options.method)) {
		return denyMutation(options.method);
	}
	const resolved = resolveAftBinary({ binaryPath: options.binaryPath });
	if (!resolved.path) {
		return { hits: [], reason_codes: [INTEL_AFT_UNAVAILABLE], partial: true };
	}
	let child = pools.get(options.repoRoot);
	if (!child || child.killed || child.exitCode != null) {
		child = spawn(resolved.path, ["--stdio", `--version=${AFT_BINARY_VERSION}`], {
			cwd: options.repoRoot,
			stdio: ["pipe", "pipe", "pipe"],
			windowsHide: true,
		});
		pools.set(options.repoRoot, child);
	}
	try {
		const reply = await sendJsonLine(child, {
			id: 1,
			method: options.method,
			params: options.params ?? {},
		});
		if (reply.error) {
			return {
				hits: [],
				reason_codes: [INTEL_AFT_UNAVAILABLE],
				partial: true,
			};
		}
		const hits = Array.isArray(reply.result) ? (reply.result as IntelResult["hits"]) : [];
		return { hits, reason_codes: [], partial: false };
	} catch {
		return { hits: [], reason_codes: [INTEL_AFT_UNAVAILABLE], partial: true };
	}
}
