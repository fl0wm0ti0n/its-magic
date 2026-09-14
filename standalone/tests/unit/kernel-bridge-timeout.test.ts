import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { createKernelBridge, type SpawnFn } from "../../packages/kernel-bridge/src/index.ts";

function writeFile(path: string, body: string): void {
	mkdirSync(dirname(path), { recursive: true });
	writeFileSync(path, body, "utf8");
}

test("timeout abort from spawn maps to VALIDATOR_TIMEOUT", async () => {
	const root = mkdtempSync(join(tmpdir(), "us0134-unit-to-"));
	writeFile(join(root, "docs", "product", "backlog.md"), "# Backlog\n");
	writeFile(join(root, "docs", "product", "vision.md"), "# Vision\n");
	writeFile(join(root, "docs", "product", "acceptance.md"), "# Acceptance\n");
	writeFile(join(root, "docs", "engineering", "architecture.md"), "# Architecture\n");
	writeFile(join(root, "docs", "engineering", "decisions.md"), "# Decisions\n");
	writeFile(join(root, "docs", "engineering", "research.md"), "# Research\n");
	writeFile(join(root, "docs", "engineering", "state.md"), "# State\n");
	mkdirSync(join(root, "decisions"), { recursive: true });
	mkdirSync(join(root, "sprints"), { recursive: true });
	mkdirSync(join(root, "handoffs"), { recursive: true });
	writeFile(join(root, "scripts", "intake_evidence_validate.py"), "print(0)\n");
	writeFile(join(root, "scripts", "status_reconcile_validate.py"), "print(0)\n");
	writeFile(join(root, "its_magic", ".its-magic-version"), "0.1.3-9\n");
	writeFile(
		join(root, "its_magic", "kernel-contract.json"),
		JSON.stringify({
			schema_version: 1,
			kernel_version: "0.1.3-9",
			validators: ["status-reconcile"],
			artifact_keys: [
				"vision",
				"backlog",
				"acceptance",
				"architecture",
				"decisions_index",
				"research",
				"state",
				"decisions_dir",
				"sprints",
				"handoffs",
			],
		}),
	);

	const probe = "import sys; raise SystemExit(0 if sys.version_info[0]==3 else 1)";
	const exe = "import sys; print(sys.executable)";
	const spawnFn: SpawnFn = async (_command, args) => {
		if (args.includes(probe)) {
			return { stdout: "", stderr: "", exitCode: 0, signal: null, timedOut: false };
		}
		if (args.includes(exe)) {
			return {
				stdout: "/resolved/python.exe\n",
				stderr: "",
				exitCode: 0,
				signal: null,
				timedOut: false,
			};
		}
		const err = new Error("aborted") as NodeJS.ErrnoException;
		err.name = "AbortError";
		err.code = "ABORT_ERR";
		return {
			stdout: "",
			stderr: "",
			exitCode: null,
			signal: "SIGTERM",
			error: err,
			timedOut: true,
		};
	};

	const bridge = createKernelBridge({ spawnFn, timeoutMs: 50 });
	const result = await bridge.runStatusReconcile([], root);
	assert.equal(result.pass, false);
	assert.equal(result.evidence, "VALIDATOR_TIMEOUT");
});
