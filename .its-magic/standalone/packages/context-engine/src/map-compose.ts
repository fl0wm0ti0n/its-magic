import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { AFT_BINARY_VERSION } from "@its-magic/code-intelligence";

export const CODEBASE_MAP_BOOTSTRAP_SENTINEL = "<!-- its-magic:codebase-map-bootstrap v1 -->";

export interface MapComposeResult {
	status: "created" | "refreshed_bootstrap" | "preserved_existing" | "blocked" | "missing_script";
	map_path: string;
	meta_path: string;
	meta_written: boolean;
	stdout: string;
}

function materializerPathFrom(repoRoot: string): string {
	const local = join(repoRoot, "scripts", "materialize_codebase_map.py");
	if (existsSync(local)) {
		return local;
	}
	const here = dirname(fileURLToPath(import.meta.url));
	return join(here, "..", "..", "..", "..", "scripts", "materialize_codebase_map.py");
}

export function composeDerivedCodebaseMap(options: {
	repoRoot: string;
	coverage?: { files_indexed: number; hits: number };
	python?: string;
}): MapComposeResult {
	const mapPath = join(options.repoRoot, "docs", "engineering", "codebase-map.md");
	const metaPath = join(options.repoRoot, "docs", "engineering", "codebase-map.meta.json");
	const script = materializerPathFrom(options.repoRoot);
	if (!existsSync(script)) {
		return {
			status: "missing_script",
			map_path: mapPath,
			meta_path: metaPath,
			meta_written: false,
			stdout: "",
		};
	}

	const existing = existsSync(mapPath) ? readFileSync(mapPath, "utf8") : "";
	const isOperator = existing.length > 0 && !existing.includes(CODEBASE_MAP_BOOTSTRAP_SENTINEL);

	if (isOperator) {
		writeMeta(metaPath, options.coverage);
		return {
			status: "preserved_existing",
			map_path: mapPath,
			meta_path: metaPath,
			meta_written: true,
			stdout: "",
		};
	}

	const pyCandidates = options.python ? [options.python] : ["python", "python3", "py"];
	let stdout = "";
	let status: number | null = 1;
	for (const py of pyCandidates) {
		const spawned = spawnSync(
			py,
			[script, "--repo", options.repoRoot, "--trigger", "map-codebase"],
			{
				encoding: "utf8",
				windowsHide: true,
			},
		);
		if (spawned.error) {
			continue;
		}
		stdout = `${spawned.stdout ?? ""}${spawned.stderr ?? ""}`;
		status = spawned.status;
		break;
	}
	if (status !== 0) {
		return {
			status: "blocked",
			map_path: mapPath,
			meta_path: metaPath,
			meta_written: false,
			stdout,
		};
	}
	writeMeta(metaPath, options.coverage);
	const created = existing.length === 0;
	return {
		status: created ? "created" : "refreshed_bootstrap",
		map_path: mapPath,
		meta_path: metaPath,
		meta_written: true,
		stdout,
	};
}

function writeMeta(metaPath: string, coverage?: { files_indexed: number; hits: number }): void {
	mkdirSync(dirname(metaPath), { recursive: true });
	writeFileSync(
		metaPath,
		`${JSON.stringify(
			{
				derived: true,
				index_database: false,
				coverage: coverage ?? { files_indexed: 0, hits: 0 },
				version: {
					provider: "@its-magic/code-intelligence",
					aft_binary_version: AFT_BINARY_VERSION,
				},
			},
			null,
			"\t",
		)}\n`,
		"utf8",
	);
}
