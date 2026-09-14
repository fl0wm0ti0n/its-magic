import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { AuthModelsError, CATALOG_INVALID, CATALOG_SECRET_KEY } from "./errors.ts";
import type { StandaloneCatalog } from "./types.ts";

const SECRET_KEY_RE =
	/^(api[_-]?key|access[_-]?token|refresh[_-]?token|authorization|password|secret|cookie|token)$/i;

const CATALOG_REL = join(".its-magic", "model-catalog.local.json");

export function catalogPath(projectRoot: string): string {
	return join(projectRoot, CATALOG_REL);
}

export function loadStandaloneCatalog(projectRoot: string): StandaloneCatalog {
	const path = catalogPath(projectRoot);
	if (!existsSync(path)) {
		return { schema_version: 1 };
	}
	let parsed: unknown;
	try {
		parsed = JSON.parse(readFileSync(path, "utf8"));
	} catch {
		throw new AuthModelsError(CATALOG_INVALID, "Standalone catalog is not valid JSON");
	}
	assertNoSecretKeys(parsed);
	if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
		throw new AuthModelsError(CATALOG_INVALID, "Standalone catalog must be an object");
	}
	const rec = parsed as Record<string, unknown>;
	const schemaVersion = rec.schema_version;
	if (typeof schemaVersion !== "number") {
		throw new AuthModelsError(CATALOG_INVALID, "schema_version required");
	}
	return rec as unknown as StandaloneCatalog;
}

export function assertNoSecretKeys(value: unknown, trail = ""): void {
	if (!value || typeof value !== "object") {
		return;
	}
	if (Array.isArray(value)) {
		for (const item of value) {
			assertNoSecretKeys(item, trail);
		}
		return;
	}
	for (const [key, child] of Object.entries(value)) {
		if (SECRET_KEY_RE.test(key)) {
			throw new AuthModelsError(CATALOG_SECRET_KEY, `Secret-shaped catalog key ${trail}${key}`);
		}
		assertNoSecretKeys(child, `${trail}${key}.`);
	}
}

export function emptyCatalog(): StandaloneCatalog {
	return { schema_version: 1 };
}
