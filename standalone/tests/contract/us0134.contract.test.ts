import assert from "node:assert/strict";
import {
	mkdirSync,
	mkdtempSync,
	readFileSync,
	realpathSync,
	rmSync,
	statSync,
	writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
	createKernelBridge,
	KERNEL_HANDSHAKE_CODES,
	KernelBridgeError,
	loadSupportedKernelRange,
	versionInSupportedRange,
} from "../../packages/kernel-bridge/src/index.ts";

const HERE = dirname(fileURLToPath(import.meta.url));
const STANDALONE_ROOT = join(HERE, "..", "..");
const KIT_ROOT = join(STANDALONE_ROOT, "..");

const CONTRACT = {
	schema_version: 1,
	kernel_version: "0.1.3-9",
	validators: [
		"intake_evidence_validate",
		"bug_issue_validate",
		"pack_json_validate",
		"validate_closure_verification",
		"ledger_validate",
		"model_tier_validate",
		"uat-planner",
		"status-reconcile",
	],
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
		"release_queue",
		"release_notes",
		"traceability",
		"work_packs",
		"sovereign",
	],
};

function heading(title: string): string {
	return `# ${title}\n`;
}

function writeFile(path: string, body: string): void {
	mkdirSync(dirname(path), { recursive: true });
	writeFileSync(path, body, "utf8");
}

function statusScript(): string {
	return readFileSync(join(KIT_ROOT, "scripts", "status_reconcile_validate.py"), "utf8");
}

function plantKernel(
	root: string,
	opts?: {
		version?: string;
		manifest?: unknown | null;
		vision?: boolean;
		standalone?: boolean;
		intakeScript?: string;
		statusScript?: string;
		resumeBrief?: boolean;
	},
): string {
	const version = opts?.version ?? "0.1.3-9";
	writeFile(join(root, "docs", "product", "backlog.md"), heading("Backlog"));
	if (opts?.vision !== false) {
		writeFile(join(root, "docs", "product", "vision.md"), heading("Vision"));
	}
	writeFile(join(root, "docs", "product", "acceptance.md"), heading("Acceptance"));
	writeFile(join(root, "docs", "engineering", "architecture.md"), heading("Architecture"));
	writeFile(join(root, "docs", "engineering", "decisions.md"), heading("Decisions"));
	writeFile(join(root, "docs", "engineering", "research.md"), heading("Research"));
	writeFile(join(root, "docs", "engineering", "state.md"), heading("State"));
	mkdirSync(join(root, "decisions"), { recursive: true });
	mkdirSync(join(root, "sprints"), { recursive: true });
	mkdirSync(join(root, "handoffs"), { recursive: true });
	if (opts?.resumeBrief !== false) {
		writeFile(join(root, "handoffs", "resume_brief.md"), heading("Resume"));
	}
	writeFile(
		join(root, "scripts", "intake_evidence_validate.py"),
		opts?.intakeScript ?? "#!/usr/bin/env python3\nraise SystemExit(0)\n",
	);
	writeFile(
		join(root, "scripts", "status_reconcile_validate.py"),
		opts?.statusScript ?? statusScript(),
	);
	writeFile(join(root, "its_magic", ".its-magic-version"), `${version}\n`);
	if (opts?.manifest !== null) {
		const manifest =
			opts?.manifest === undefined ? { ...CONTRACT, kernel_version: version } : opts.manifest;
		writeFile(
			join(root, "its_magic", "kernel-contract.json"),
			`${JSON.stringify(manifest, null, 2)}\n`,
		);
	}
	if (opts?.standalone) {
		writeFile(
			join(root, "standalone", "package.json"),
			'{"name":"@tmp/standalone","private":true}\n',
		);
	}
	return root;
}

function tmpKernel(prefix: string): string {
	return mkdtempSync(join(tmpdir(), prefix));
}

async function expectCode(fn: () => Promise<unknown>, code: string): Promise<KernelBridgeError> {
	try {
		await fn();
		assert.fail(`expected ${code}`);
	} catch (err) {
		assert.ok(err instanceof KernelBridgeError, `expected KernelBridgeError, got ${err}`);
		assert.equal(err.code, code);
		return err;
	}
}

test("test_us0134_locate_three_marker_and_kernel_root", async () => {
	const root = tmpKernel("us0134-locate-");
	plantKernel(root, { standalone: true });
	const nested = join(root, "standalone", "packages", "bridge");
	mkdirSync(nested, { recursive: true });
	const bridge = createKernelBridge();
	const fromNested = await bridge.locateProjectKernel({ cwd: nested });
	assert.equal(realpathSync(fromNested.kernelRoot), realpathSync(root));
	assert.equal(fromNested.locateMode, "kit-dev");
	const viaOverride = await bridge.locateProjectKernel({ kernelRoot: root });
	assert.equal(realpathSync(viaOverride.kernelRoot), realpathSync(root));
	const consumer = tmpKernel("us0134-cons-");
	plantKernel(consumer, { standalone: false });
	const cons = await bridge.locateProjectKernel({ kernelRoot: consumer });
	assert.equal(cons.locateMode, "consumer");
	await expectCode(
		() => bridge.locateProjectKernel({ kernelRoot: resolve(root, "missing-override") }),
		"KERNEL_NOT_FOUND",
	);
});

test("test_us0134_kernel_not_found_empty_walk", async () => {
	const empty = tmpKernel("us0134-empty-");
	const bridge = createKernelBridge();
	await expectCode(() => bridge.locateProjectKernel({ cwd: empty }), "KERNEL_NOT_FOUND");
});

test("test_us0134_supported_version_0_1_3_9_in_range", async () => {
	const range = loadSupportedKernelRange();
	assert.equal(range.minInclusive, "0.1.3-9");
	assert.equal(range.maxExclusive, "0.2.0");
	assert.equal(range.includePrerelease, true);
	assert.equal(versionInSupportedRange("0.1.3-9"), true);
	const root = tmpKernel("us0134-okver-");
	plantKernel(root, { version: "0.1.3-9" });
	const bridge = createKernelBridge();
	assert.equal(await bridge.getKernelVersion(root), "0.1.3-9");
	const manifest = await bridge.readContractManifest(root);
	assert.equal(manifest.schema_version, 1);
	assert.equal(manifest.kernel_version, "0.1.3-9");
	assert.ok(manifest.validators.includes("status-reconcile"));
});

test("test_us0134_unsupported_version_0_1_2", async () => {
	assert.equal(versionInSupportedRange("0.1.2"), false);
	const root = tmpKernel("us0134-oldver-");
	plantKernel(root, { version: "0.1.2" });
	const bridge = createKernelBridge();
	assert.equal(await bridge.getKernelVersion(root), "0.1.2");
	await expectCode(() => bridge.readContractManifest(root), "KERNEL_VERSION_UNSUPPORTED");
});

test("test_us0134_contract_mismatch_bad_manifest_or_missing_backlog", async () => {
	const bridge = createKernelBridge();
	const missingManifest = tmpKernel("us0134-noman-");
	plantKernel(missingManifest, { manifest: null });
	await expectCode(() => bridge.readContractManifest(missingManifest), "KERNEL_CONTRACT_MISMATCH");

	const badJson = tmpKernel("us0134-badjson-");
	plantKernel(badJson, { manifest: null });
	writeFile(join(badJson, "its_magic", "kernel-contract.json"), "{not-json");
	await expectCode(() => bridge.readContractManifest(badJson), "KERNEL_CONTRACT_MISMATCH");

	const verMismatch = tmpKernel("us0134-vermm-");
	plantKernel(verMismatch, {
		version: "0.1.3-9",
		manifest: { ...CONTRACT, kernel_version: "0.1.3-8" },
	});
	await expectCode(() => bridge.readContractManifest(verMismatch), "KERNEL_CONTRACT_MISMATCH");

	const missingVision = tmpKernel("us0134-novis-");
	plantKernel(missingVision, { vision: false });
	await expectCode(() => bridge.resolveArtifactPaths(missingVision), "KERNEL_CONTRACT_MISMATCH");

	const missingBacklog = tmpKernel("us0134-nobl-");
	plantKernel(missingBacklog);
	rmSync(join(missingBacklog, "docs", "product", "backlog.md"));
	await expectCode(
		() => bridge.locateProjectKernel({ kernelRoot: missingBacklog }),
		"KERNEL_NOT_FOUND",
	);
});

test("test_us0134_validator_missing", async () => {
	const root = tmpKernel("us0134-valmiss-");
	plantKernel(root);
	rmSync(join(root, "scripts", "status_reconcile_validate.py"));
	const bridge = createKernelBridge();
	await expectCode(
		() => bridge.runValidator("status-reconcile", [], root),
		"KERNEL_VALIDATOR_MISSING",
	);
	await expectCode(
		() => bridge.runValidator("not-a-validator", [], root),
		"KERNEL_VALIDATOR_MISSING",
	);
	assert.equal(KERNEL_HANDSHAKE_CODES.length, 4);
});

test("test_us0134_validator_pass_advances", { timeout: 60_000 }, async () => {
	const root = tmpKernel("us0134-pass-");
	plantKernel(root);
	const backlog = join(root, "docs", "product", "backlog.md");
	const before = statSync(backlog);
	const bridge = createKernelBridge();
	const result = await bridge.runStatusReconcile([], root);
	assert.equal(result.pass, true);
	assert.equal(result.exitCode, 0);
	assert.equal(result.evidence, null);
	assert.match(result.stdout, /\[STATUS_RECONCILE_VALIDATE_OK\]/);
	const after = statSync(backlog);
	assert.equal(after.mtimeMs, before.mtimeMs);
	assert.equal(readFileSync(backlog, "utf8"), heading("Backlog"));
	const paths = await bridge.resolveArtifactPaths(root);
	assert.ok(paths.backlog);
	assert.equal(paths.work_packs, null);
	assert.equal(paths.sovereign, null);
});

test("test_us0134_validator_fail_blocks_with_python_reason", { timeout: 60_000 }, async () => {
	const root = tmpKernel("us0134-fail-");
	plantKernel(root, { resumeBrief: false });
	const bridge = createKernelBridge();
	const result = await bridge.runStatusReconcile([], root);
	assert.equal(result.pass, false);
	assert.notEqual(result.exitCode, 0);
	assert.equal(result.evidence, null);
	assert.equal(result.reasonCode, "STATUS_RECONCILE_SURFACE_MISSING");
	assert.equal(result.reasonCode?.startsWith("OPENCODE_"), false);
});

test("test_us0134_validator_crash_or_timeout", { timeout: 30_000 }, async () => {
	const root = tmpKernel("us0134-to-");
	plantKernel(root, {
		statusScript: "import time\ntime.sleep(30)\n",
	});
	const bridge = createKernelBridge({ timeoutMs: 800 });
	const result = await bridge.runStatusReconcile([], root);
	assert.equal(result.pass, false);
	assert.ok(
		result.evidence === "VALIDATOR_TIMEOUT" || result.evidence === "VALIDATOR_CRASH",
		`expected timeout/crash evidence, got ${result.evidence}`,
	);
	assert.equal(KERNEL_HANDSHAKE_CODES.includes(result.evidence as never), false);
});
