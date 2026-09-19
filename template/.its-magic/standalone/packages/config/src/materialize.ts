import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

/** DEC-0039: never overwrite config.local.json. Materialize shared from example when absent. */
export function materializeSharedFromExample(kitDir: string): { wrote: boolean; skipped: boolean } {
	const example = join(kitDir, "config.example.json");
	const baseline = join(kitDir, "config.json");
	const local = join(kitDir, "config.local.json");
	void local;
	if (!existsSync(example)) {
		return { wrote: false, skipped: true };
	}
	if (existsSync(baseline)) {
		return { wrote: false, skipped: true };
	}
	mkdirSync(kitDir, { recursive: true });
	copyFileSync(example, baseline);
	return { wrote: true, skipped: false };
}

export function writeJsoncIfAbsent(path: string, contents: string): boolean {
	if (existsSync(path)) {
		return false;
	}
	mkdirSync(dirname(path), { recursive: true });
	writeFileSync(path, contents, { encoding: "utf8", flag: "wx" });
	return true;
}

export function readUtf8(path: string): string {
	return readFileSync(path, "utf8");
}
