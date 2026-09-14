import { existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { KernelBridgeError, type LocateResult } from "./types.ts";

const WALK_CAP = 16;

const MARKER_REL = [
	join("docs", "product", "backlog.md"),
	join("scripts", "intake_evidence_validate.py"),
	join("its_magic", ".its-magic-version"),
] as const;

export function hasThreeMarkers(root: string): boolean {
	return MARKER_REL.every((rel) => existsSync(join(root, rel)));
}

export function locateModeFor(root: string): LocateResult["locateMode"] {
	return existsSync(join(root, "standalone", "package.json")) ? "kit-dev" : "consumer";
}

function walkUp(start: string, cap: number): string | null {
	let dir = resolve(start);
	for (let hops = 0; hops <= cap; hops++) {
		if (hasThreeMarkers(dir)) {
			return dir;
		}
		if (hops === cap) {
			break;
		}
		const parent = dirname(dir);
		if (parent === dir) {
			break;
		}
		dir = parent;
	}
	return null;
}

function findStandaloneDir(cwd: string): string | null {
	let dir = resolve(cwd);
	for (let hops = 0; hops <= WALK_CAP; hops++) {
		const base =
			dir
				.replace(/[\\/]+$/, "")
				.split(/[\\/]/)
				.pop() ?? "";
		if (base === "standalone" && existsSync(join(dir, "package.json"))) {
			return dir;
		}
		const parent = dirname(dir);
		if (parent === dir) {
			break;
		}
		dir = parent;
	}
	return null;
}

export function kernelRootFromArgv(argv: readonly string[] = process.argv): string | undefined {
	for (let i = 0; i < argv.length; i++) {
		const tok = argv[i];
		if (tok === "--kernel-root" && argv[i + 1]) {
			return argv[i + 1];
		}
		if (tok?.startsWith("--kernel-root=")) {
			const value = tok.slice("--kernel-root=".length);
			if (value.length > 0) {
				return value;
			}
		}
	}
	return undefined;
}

export function locateProjectKernelSync(opts?: {
	cwd?: string;
	kernelRoot?: string;
}): LocateResult {
	const override = opts?.kernelRoot ?? kernelRootFromArgv();
	if (override !== undefined && override !== "") {
		const abs = resolve(override);
		if (!hasThreeMarkers(abs)) {
			throw new KernelBridgeError(
				"KERNEL_NOT_FOUND",
				`kernel-root override failed three-marker check: ${abs}`,
				abs,
			);
		}
		return { kernelRoot: abs, locateMode: locateModeFor(abs) };
	}

	const cwd = resolve(opts?.cwd ?? process.cwd());
	const starts = [cwd];
	const standaloneDir = findStandaloneDir(cwd);
	if (standaloneDir !== null && standaloneDir !== cwd) {
		starts.push(standaloneDir);
	}

	for (const start of starts) {
		const found = walkUp(start, WALK_CAP);
		if (found !== null) {
			return { kernelRoot: found, locateMode: locateModeFor(found) };
		}
	}

	throw new KernelBridgeError(
		"KERNEL_NOT_FOUND",
		`three-marker kernel root not found from ${cwd} (cap ${WALK_CAP})`,
		cwd,
	);
}
