import { existsSync, statSync } from "node:fs";
import { join } from "node:path";
import {
	ALL_ARTIFACT_KEYS,
	type ArtifactKey,
	KernelBridgeError,
	REQUIRED_ARTIFACT_KEYS,
} from "./types.ts";

const ARTIFACT_REL: Record<ArtifactKey, string> = {
	vision: join("docs", "product", "vision.md"),
	backlog: join("docs", "product", "backlog.md"),
	acceptance: join("docs", "product", "acceptance.md"),
	architecture: join("docs", "engineering", "architecture.md"),
	decisions_index: join("docs", "engineering", "decisions.md"),
	research: join("docs", "engineering", "research.md"),
	state: join("docs", "engineering", "state.md"),
	decisions_dir: "decisions",
	sprints: "sprints",
	handoffs: "handoffs",
	release_queue: join("handoffs", "release_queue.md"),
	release_notes: join("handoffs", "release_notes.md"),
	traceability: join("docs", "engineering", "state.md"),
	work_packs: "work",
	sovereign: join("docs", "engineering", "sovereign-memory"),
};

function existsFileOrDir(path: string): boolean {
	if (!existsSync(path)) {
		return false;
	}
	try {
		const st = statSync(path);
		return st.isFile() || st.isDirectory();
	} catch {
		return false;
	}
}

export function resolveArtifactPathsSync(kernelRoot: string): Record<ArtifactKey, string | null> {
	const out = {} as Record<ArtifactKey, string | null>;
	for (const key of ALL_ARTIFACT_KEYS) {
		const abs = join(kernelRoot, ARTIFACT_REL[key]);
		if (existsFileOrDir(abs)) {
			out[key] = abs;
		} else if ((REQUIRED_ARTIFACT_KEYS as readonly string[]).includes(key)) {
			throw new KernelBridgeError(
				"KERNEL_CONTRACT_MISMATCH",
				`required artifact missing: ${key} (${ARTIFACT_REL[key]})`,
				key,
			);
		} else {
			out[key] = null;
		}
	}
	return out;
}

export { ARTIFACT_REL };
