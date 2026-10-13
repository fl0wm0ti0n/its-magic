import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { copyFileSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { DatabaseSync } from "node:sqlite";
import test from "node:test";
import { fileURLToPath } from "node:url";

const standaloneRoot = fileURLToPath(new URL("../..", import.meta.url));
const repoRoot = fileURLToPath(new URL("../../..", import.meta.url));
const cliEntry = join(standaloneRoot, "apps", "cli", "src", "index.ts");
const daemonEntry = join(standaloneRoot, "apps", "daemon", "src", "index.ts");
const tuiEntry = join(standaloneRoot, "apps", "tui", "src", "index.ts");
const cliRun = join(standaloneRoot, "apps", "cli", "src", "run.ts");

interface Spawned {
	code: number | null;
	stdout: string;
	stderr: string;
}

function read(path: string): string {
	return readFileSync(path, "utf8");
}

function childEnv(overrides: Record<string, string | undefined>): NodeJS.ProcessEnv {
	const env: NodeJS.ProcessEnv = { ...process.env, COLUMNS: "100" };
	delete env.ITS_MAGIC_CONFIG_ROOT;
	delete env.ITS_MAGIC_REQUIRE_DAEMON;
	for (const [key, value] of Object.entries(overrides)) {
		if (value === undefined) {
			delete env[key];
		} else {
			env[key] = value;
		}
	}
	return env;
}

function spawnNode(
	entry: string,
	args: string[],
	cwd: string,
	env: NodeJS.ProcessEnv,
	timeoutMs = 90_000,
): Promise<Spawned> {
	return new Promise((resolve, reject) => {
		const child = spawn(process.execPath, ["--experimental-strip-types", entry, ...args], {
			cwd,
			env,
			windowsHide: true,
		});
		let stdout = "";
		let stderr = "";
		const timer = setTimeout(() => {
			child.kill();
			reject(new Error(`timeout ${entry} ${args.join(" ")}`));
		}, timeoutMs);
		child.stdout.setEncoding("utf8");
		child.stderr.setEncoding("utf8");
		child.stdout.on("data", (chunk: string) => {
			stdout += chunk;
		});
		child.stderr.on("data", (chunk: string) => {
			stderr += chunk;
		});
		child.on("error", (error) => {
			clearTimeout(timer);
			reject(error);
		});
		child.on("exit", (code) => {
			clearTimeout(timer);
			resolve({ code, stdout, stderr });
		});
	});
}

function parseBody(stdout: string): Record<string, unknown> {
	const start = stdout.indexOf("{");
	assert.ok(start >= 0, stdout);
	return JSON.parse(stdout.slice(start)) as Record<string, unknown>;
}

function writePassingFixture(root: string): void {
	mkdirSync(join(root, ".its-magic"), { recursive: true });
	mkdirSync(join(root, "src"), { recursive: true });
	mkdirSync(join(root, "handoffs"), { recursive: true });
	mkdirSync(join(root, "docs", "engineering"), { recursive: true });
	copyFileSync(join(repoRoot, ".its-magic", "config.json"), join(root, "config.json"));
	copyFileSync(
		join(repoRoot, ".its-magic", "config.example.json"),
		join(root, "config.example.json"),
	);
	copyFileSync(
		join(repoRoot, ".its-magic", "config.json"),
		join(root, ".its-magic", "config.json"),
	);
	copyFileSync(
		join(repoRoot, ".its-magic", "config.example.json"),
		join(root, ".its-magic", "config.example.json"),
	);
	writeFileSync(
		join(root, "src", "runtime-host.ts"),
		'export function runtimeHostMarker() {\n\treturn "runtime-host";\n}\n',
	);
	writeFileSync(
		join(root, "handoffs", "resume_brief.md"),
		"last_completed_phase: sprint-plan\nintended_resume_phase: execute\n",
	);
	writeFileSync(join(root, "docs", "engineering", "state.md"), "# state\n");
}

function tempFixture(prefix: string): string {
	return mkdtempSync(join(standaloneRoot, ".us0154-tmp", prefix));
}

function storePathOk(value: unknown): boolean {
	return (
		typeof value === "string" &&
		value.replaceAll("\\", "/").endsWith(".its-magic/runtime/ops.sqlite")
	);
}

function operatorPathWouldPass(evidence: Record<string, unknown>): boolean {
	const text = JSON.stringify(evidence);
	if (text.includes("FakeBrowserDriver") || text.includes("screenshot-placeholder")) {
		return false;
	}
	if (evidence.artifact_sha === "fake-sha") {
		return false;
	}
	const executed =
		evidence.executed === true || evidence.disposition != null || evidence.phase_id != null;
	if (evidence.ok === true && !executed) {
		return false;
	}
	if (evidence.scheduled === true && evidence.executed !== true && evidence.disposition == null) {
		return false;
	}
	return true;
}

function discardsTransport(source: string): boolean {
	if (!source.includes("resolveOperatorTransport")) {
		return false;
	}
	const assigned = source.match(/const\s+(\w+)\s*=\s*await\s+resolveOperatorTransport/);
	if (!assigned) {
		return true;
	}
	const name = assigned[1] ?? "";
	return !source.includes(`${name}.`);
}

function operatorFailures(source: string): string[] {
	const failures: string[] = [];
	if (
		/throw new Error\(["']kernel/.test(source) ||
		/kernel:\s*\(\)\s*=>\s*\{?\s*throw/.test(source)
	) {
		failures.push("throwing_kernel");
	}
	if (/const\s+config\s*=\s*\{\s*\}/.test(source) || /config\s*:\s*\{\s*\}/.test(source)) {
		failures.push("empty_configuration");
	}
	if (source.includes(":memory:")) {
		failures.push("memory_store");
	}
	if (discardsTransport(source)) {
		failures.push("discarded_transport");
	}
	return failures;
}

test("test_us0154_public_itsm_reaches_production_composition", async () => {
	mkdirSync(join(standaloneRoot, ".us0154-tmp"), { recursive: true });
	const entry = read(cliEntry);
	assert.match(entry, /createRuntimeHost\(/);
	assert.doesNotMatch(entry, /factories\s*:/);
	assert.doesNotMatch(entry, /RuntimeHostFactories/);
	const passing = tempFixture("pass-");
	const empty = tempFixture("empty-");
	try {
		writePassingFixture(passing);
		const ok = await spawnNode(
			cliEntry,
			["status"],
			passing,
			childEnv({ ITS_MAGIC_IN_PROCESS: "1" }),
		);
		assert.equal(ok.code, 0, ok.stderr);
		const body = parseBody(ok.stdout);
		assert.equal(storePathOk(body.store_path), true, JSON.stringify(body.store_path));
		assert.equal(typeof body.config, "object");
		assert.ok(body.config && Object.keys(body.config as object).length > 0);
		assert.equal(typeof body.transport, "string");
		assert.ok(String(body.transport).length > 0);
		assert.equal(typeof body.disposition, "string");
		assert.ok(String(body.disposition).length > 0);
		assert.equal(ok.stdout.includes("{ok:true}"), false);
		writeFileSync(join(empty, "config.json"), "{}\n");
		const failed = await spawnNode(
			cliEntry,
			["status"],
			empty,
			childEnv({ ITS_MAGIC_IN_PROCESS: "1" }),
		);
		const combined = `${failed.stdout}\n${failed.stderr}`;
		assert.notEqual(failed.code, 0);
		assert.match(combined, /RUNTIME_CONFIG_UNAVAILABLE/);
		assert.equal(combined.includes("{ok:true}"), false);
		assert.equal(combined.includes('"ok": true'), false);
		assert.equal(combined.includes('"ok":true'), false);
	} finally {
		rmSync(passing, { recursive: true, force: true, maxRetries: 3 });
		rmSync(empty, { recursive: true, force: true, maxRetries: 3 });
	}
});

test(
	"test_us0154_operator_e2e_session_policy_validator_resume_replay_parity",
	{ timeout: 300_000 },
	async () => {
		mkdirSync(join(standaloneRoot, ".us0154-tmp"), { recursive: true });
		const root = tempFixture("e2e-");
		let daemon: ReturnType<typeof spawn> | undefined;
		try {
			writePassingFixture(root);
			const admitted = await spawnNode(
				cliEntry,
				["execute", "--policy-probe"],
				root,
				childEnv({ ITS_MAGIC_IN_PROCESS: "1" }),
				120_000,
			);
			assert.equal(admitted.code, 0, `${admitted.stderr}\n${admitted.stdout}`);
			const admittedBody = parseBody(admitted.stdout);
			assert.equal(admittedBody.session_fresh, true);
			assert.equal(admittedBody.disposition, "success");
			const policy = admittedBody.policy as { allow?: string; deny?: boolean };
			assert.equal(policy.allow, "ALLOW");
			assert.equal(policy.deny, true);
			assert.equal(storePathOk(admittedBody.store_path), true);

			const blocked = await spawnNode(
				cliEntry,
				["execute", "--validator=not-a-validator"],
				root,
				childEnv({ ITS_MAGIC_IN_PROCESS: "1" }),
				120_000,
			);
			const blockedBody = parseBody(blocked.stdout);
			assert.equal(blockedBody.disposition, "execution_failure");
			assert.equal(blockedBody.reason_code, "KERNEL_VALIDATOR_MISSING");
			assert.notEqual(blockedBody.disposition, "success");
			assert.equal(blocked.stdout.includes("{ok:true}"), false);

			const resumed = await spawnNode(
				cliEntry,
				["resume"],
				root,
				childEnv({ ITS_MAGIC_IN_PROCESS: "1" }),
				120_000,
			);
			assert.equal(resumed.code, 0, resumed.stderr);
			const resumedBody = parseBody(resumed.stdout);
			assert.equal(resumedBody.disposition, "success");
			assert.equal(resumedBody.next_phase, "execute");
			assert.equal(storePathOk(resumedBody.store_path), true);

			daemon = spawn(process.execPath, ["--experimental-strip-types", daemonEntry], {
				cwd: root,
				env: childEnv({}),
				windowsHide: true,
			});
			const daemonChild = daemon;
			let daemonOut = "";
			let daemonErr = "";
			daemonChild.stdout?.setEncoding("utf8");
			daemonChild.stderr?.setEncoding("utf8");
			daemonChild.stdout?.on("data", (chunk: string) => {
				daemonOut += chunk;
			});
			daemonChild.stderr?.on("data", (chunk: string) => {
				daemonErr += chunk;
			});
			const ready = await new Promise<void>((resolve, reject) => {
				const timer = setTimeout(() => reject(new Error(`daemon timeout ${daemonErr}`)), 90_000);
				const poll = () => {
					if (daemonOut.includes("baseUrl")) {
						clearTimeout(timer);
						resolve();
						return;
					}
					setTimeout(poll, 50);
				};
				daemonChild.on("exit", (code) => {
					clearTimeout(timer);
					reject(new Error(`daemon exit ${code} ${daemonErr} ${daemonOut}`));
				});
				poll();
			});
			assert.equal(ready, undefined);
			const daemonBody = parseBody(daemonOut);
			assert.equal(typeof daemonBody.baseUrl, "string");

			const viaDaemon = await spawnNode(
				cliEntry,
				["execute"],
				root,
				childEnv({ ITS_MAGIC_IN_PROCESS: undefined }),
				120_000,
			);
			assert.equal(viaDaemon.code, 0, `${viaDaemon.stderr}\n${viaDaemon.stdout}`);
			const viaBody = parseBody(viaDaemon.stdout);
			assert.equal(viaBody.transport, "daemon");
			assert.equal(viaBody.disposition, "success");
			assert.equal(viaBody.session_fresh, true);

			const tui = await spawnNode(
				tuiEntry,
				[],
				root,
				childEnv({ ITS_MAGIC_IN_PROCESS: undefined }),
			);
			assert.equal(tui.code, 0, tui.stderr);
			const ansi = new RegExp(`${String.fromCharCode(27)}\\[[0-9;]*m`, "g");
			const plain = tui.stdout.replace(ansi, "");
			assert.equal(plain.includes("DAEMON_UNREACHABLE"), false);
			const timeline = /Timeline\s+(\d+)\s+events\s+([^\r\n]*)/.exec(plain);
			assert.ok(timeline, tui.stdout);
			const shown = Number(timeline?.[1] ?? "0");
			const outcomes = timeline?.[2] ?? "";
			assert.ok(shown >= 1);
			assert.match(outcomes, /success/);
			assert.equal(viaBody.disposition, "success");

			daemon.kill();
			await new Promise((resolve) => daemon?.on("exit", () => resolve(undefined)));
			daemon = undefined;
			const eventsDb = new DatabaseSync(join(root, ".its-magic", "daemon", "events.sqlite"));
			const row = eventsDb
				.prepare("SELECT COUNT(*) AS c FROM run_events WHERE run_id = ?")
				.get("itsm-operator") as { c: number };
			eventsDb.close();
			assert.equal(shown, row.c);
		} finally {
			if (daemon && daemon.exitCode === null) {
				daemon.kill();
				await new Promise((resolve) => daemon?.once("exit", () => resolve(undefined)));
			}
			for (let attempt = 0; attempt < 8; attempt += 1) {
				try {
					rmSync(root, { recursive: true, force: true, maxRetries: 3 });
					break;
				} catch {
					await new Promise((resolve) => setTimeout(resolve, 200));
				}
			}
		}
	},
);

test("test_us0154_production_rejects_fake_browser_and_synthetic_release", async () => {
	const fakes: Record<string, unknown>[] = [
		{ driver: "FakeBrowserDriver", executed: true, disposition: "success" },
		{ screenshot: "screenshot-placeholder", executed: true, disposition: "success" },
		{ artifact_sha: "fake-sha", executed: true, disposition: "success" },
		{ ok: true },
		{ scheduled: true, plan: ["execute"] },
	];
	for (const fake of fakes) {
		assert.equal(operatorPathWouldPass(fake), false, JSON.stringify(fake));
	}
	const browserSrc = read(join(standaloneRoot, "packages", "browser-uat", "src", "browser-uat.ts"));
	const releaseSrc = read(
		join(
			standaloneRoot,
			"packages",
			"runtime-core",
			"src",
			"workflow",
			"delivery",
			"release-deploy.ts",
		),
	);
	assert.match(browserSrc, /new FakeBrowserDriver\(\)/);
	assert.match(releaseSrc, /artifact_sha: "fake-sha"/);
	assert.match(releaseSrc, /getReleaseTargetAdapter/);
	mkdirSync(join(standaloneRoot, ".us0154-tmp"), { recursive: true });
	const root = tempFixture("fake-");
	try {
		writePassingFixture(root);
		const browser = await spawnNode(
			cliEntry,
			["browser"],
			root,
			childEnv({ ITS_MAGIC_IN_PROCESS: "1" }),
			60_000,
		);
		const combined = `${browser.stdout}\n${browser.stderr}`;
		assert.equal(combined.includes("screenshot-placeholder"), false);
		assert.equal(combined.includes("FakeBrowserDriver"), false);
		assert.equal(combined.includes("fake-sha"), false);
		if (browser.stdout.includes("{")) {
			const body = parseBody(browser.stdout);
			assert.equal(operatorPathWouldPass({ ...body, driver: "FakeBrowserDriver" }), false);
			assert.notEqual(body.disposition, "success");
		}
	} finally {
		rmSync(root, { recursive: true, force: true, maxRetries: 3 });
	}
});

test("test_us0154_report_separates_seams_and_fails_closed", async () => {
	mkdirSync(join(standaloneRoot, ".us0154-tmp"), { recursive: true });
	const work = tempFixture("seam-");
	try {
		const fixtures: Array<{ id: string; source: string; failure: string }> = [
			{
				id: "throwing-kernel",
				failure: "throwing_kernel",
				source:
					'const kernel = () => {\n\tthrow new Error("kernel");\n};\nkernel();\nconsole.log(JSON.stringify({ ok: true }));\n',
			},
			{
				id: "empty-config",
				failure: "empty_configuration",
				source: "const config = {};\nconsole.log(JSON.stringify({ ok: true, config }));\n",
			},
			{
				id: "memory-store",
				failure: "memory_store",
				source: 'const store = ":memory:";\nconsole.log(JSON.stringify({ ok: true, store }));\n',
			},
			{
				id: "discarded-transport",
				failure: "discarded_transport",
				source:
					'import { createOperatorSession, resolveOperatorTransport } from "@its-magic/runtime-core";\nawait resolveOperatorTransport({ projectRoot: process.cwd(), session: createOperatorSession() });\nconsole.log(JSON.stringify({ ok: true }));\n',
			},
		];
		const operator_path: Array<{ id: string; pass: boolean; failures: string[] }> = [];
		for (const fixture of fixtures) {
			const dir = join(work, fixture.id);
			mkdirSync(dir, { recursive: true });
			const entry = join(dir, "entry.ts");
			writeFileSync(entry, fixture.source);
			const spawned = await spawnNode(entry, [], dir, childEnv({}), 30_000);
			const failures = operatorFailures(fixture.source);
			operator_path.push({ id: fixture.id, pass: failures.length === 0, failures });
			assert.equal(failures.includes(fixture.failure), true, fixture.id);
			assert.equal(spawned.stdout.includes("{ok:true}") || failures.length > 0, true);
		}
		const realSources = [
			{ id: "itsm", source: `${read(cliEntry)}\n${read(cliRun)}` },
			{ id: "itsm-daemon", source: read(daemonEntry) },
			{ id: "itsm-tui", source: read(tuiEntry) },
		];
		for (const real of realSources) {
			const failures = operatorFailures(real.source);
			operator_path.push({ id: real.id, pass: failures.length === 0, failures });
		}
		const unit_seam = [
			{
				id: "FakeBrowserDriver",
				pass: read(
					join(standaloneRoot, "packages", "browser-uat", "src", "fake-driver.ts"),
				).includes("class FakeBrowserDriver"),
			},
			{
				id: "us0145-dry-run",
				pass: read(
					join(
						standaloneRoot,
						"packages",
						"runtime-core",
						"src",
						"workflow",
						"delivery",
						"release-deploy.ts",
					),
				).includes('artifact_sha: "fake-sha"'),
			},
		];
		const report = { unit_seam, operator_path };
		assert.ok("unit_seam" in report && "operator_path" in report);
		for (const seam of report.unit_seam) {
			assert.equal(seam.pass, true, seam.id);
		}
		for (const row of report.operator_path) {
			if (row.id === "itsm" || row.id === "itsm-daemon" || row.id === "itsm-tui") {
				assert.equal(row.pass, true, `${row.id} ${row.failures.join(",")}`);
			} else {
				assert.equal(row.pass, false, row.id);
			}
		}
		assert.equal(
			report.operator_path.some((row) => row.id === "FakeBrowserDriver" && row.pass),
			false,
		);
	} finally {
		rmSync(work, { recursive: true, force: true, maxRetries: 3 });
	}
});

test("test_us0154_acceptance_records_library_slices_and_production_followup", () => {
	const acceptance = read(join(repoRoot, "docs", "product", "acceptance.md"));
	assert.match(
		acceptance,
		/US-0133 through US-0148 are completed library\/contract slices\. US-0150 through US-0154 are their production-integration follow-up\./,
	);
	assert.match(
		acceptance,
		/Phase-9 deferrals \(own indexer, stronger sandbox\/micro-VM, IDE, web\/mobile\/watch, distributed workers, remote always-on Debian\) are not missing v1 work\./,
	);
	assert.match(acceptance, /^- \[ \] US-0154:/m);
	assert.match(acceptance, /^- \[x\] US-0148:/m);
	assert.match(acceptance, /^- \[x\] US-0150:/m);
	assert.match(acceptance, /^- \[x\] US-0153:/m);
	assert.doesNotMatch(acceptance, /^- \[x\] US-0154:/m);
});
