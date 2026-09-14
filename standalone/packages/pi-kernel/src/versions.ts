import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { PINNED_PI_AI, PINNED_PI_CODING_AGENT } from "./types.ts";

function readWorkspacePackageVersion(packageName: string): string {
	let dir = dirname(fileURLToPath(import.meta.url));
	while (true) {
		const candidate = join(dir, "node_modules", packageName, "package.json");
		if (existsSync(candidate)) {
			const pkg = JSON.parse(readFileSync(candidate, "utf8")) as {
				name?: string;
				version?: string;
			};
			if (pkg.name === packageName && pkg.version) {
				return pkg.version;
			}
		}
		const parent = dirname(dir);
		if (parent === dir) {
			break;
		}
		dir = parent;
	}
	throw new Error(`cannot read installed version for ${packageName}`);
}

export function readInstalledPiVersions(): {
	piCodingAgentVersion: string;
	piAiVersion: string;
} {
	return {
		piCodingAgentVersion: readWorkspacePackageVersion("@earendil-works/pi-coding-agent"),
		piAiVersion: readWorkspacePackageVersion("@earendil-works/pi-ai"),
	};
}

export function assertPinnedPiVersions(versions = readInstalledPiVersions()): void {
	if (versions.piCodingAgentVersion !== PINNED_PI_CODING_AGENT) {
		throw new Error(
			`pi-coding-agent pin drift: expected ${PINNED_PI_CODING_AGENT}, got ${versions.piCodingAgentVersion}`,
		);
	}
	if (versions.piAiVersion !== PINNED_PI_AI) {
		throw new Error(`pi-ai pin drift: expected ${PINNED_PI_AI}, got ${versions.piAiVersion}`);
	}
}
