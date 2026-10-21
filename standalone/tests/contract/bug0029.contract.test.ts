import assert from "node:assert/strict";
import { EventEmitter } from "node:events";
import { mkdirSync, mkdtempSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import {
	type AuthRuntimePort,
	type AuthType,
	dispatchItsmCommand,
	KNOWN_PROVIDER_IDS,
	readMaskedTtySecret,
} from "../../packages/auth-models/src/index.ts";

const standaloneRoot = fileURLToPath(new URL("../..", import.meta.url));
const repoRoot = fileURLToPath(new URL("../../..", import.meta.url));
const SECRET = "masked-secret-bug0029";
const LOGIN_USAGE = "usage: itsm auth login <provider> [--type oauth|api_key] [--api-key-stdin]";
const CONFIGURED = JSON.stringify({ provider: "openai", auth: "configured" });

interface Capture {
	stdout: string[];
	stderr: string[];
	io: {
		stdout: (line: string) => void;
		stderr: (line: string) => void;
		prompt?: (message: string) => Promise<string | undefined>;
		readStdinLine?: () => Promise<string>;
		stdinIsTTY?: boolean;
	};
}

function capture(): Capture {
	const stdout: string[] = [];
	const stderr: string[] = [];
	return {
		stdout,
		stderr,
		io: {
			stdout: (line) => stdout.push(line),
			stderr: (line) => stderr.push(line),
		},
	};
}

function textOf(lines: string[]): string {
	return lines.join("\n");
}

function assertNoConfigured(stdout: string[]): void {
	assert.equal(textOf(stdout).includes('{"auth":"configured"}'), false, textOf(stdout));
	assert.equal(stdout.includes(CONFIGURED), false);
}

function assertNoSecret(lines: string[], secret = SECRET): void {
	assert.equal(textOf(lines).includes(secret), false, textOf(lines));
}

class ScriptedStdin extends EventEmitter {
	isTTY = true;
	isRaw = false;
	calls: boolean[] = [];
	private sent = false;
	private readonly chunks: string[];

	constructor(chunks: string[], startRaw = false) {
		super();
		this.chunks = chunks;
		this.isRaw = startRaw;
	}

	setRawMode(mode: boolean): void {
		this.isRaw = mode;
		this.calls.push(mode);
		if (mode && !this.sent) {
			this.sent = true;
			queueMicrotask(() => {
				for (const chunk of this.chunks) {
					this.emit("data", chunk);
				}
			});
		}
	}

	resume(): void {}

	setEncoding(): void {}
}

class CaptureStdout {
	isTTY = true;
	chunks: string[] = [];

	write(chunk: string): void {
		this.chunks.push(chunk);
	}
}

function staticSpecifiers(source: string): string[] {
	const specs: string[] = [];
	const re = /(?:^|\n)import\s[\s\S]*?\sfrom\s+["']([^"']+)["']/g;
	for (const match of source.matchAll(re)) {
		const spec = match[1];
		if (spec) {
			specs.push(spec);
		}
	}
	return specs;
}

function read(path: string): string {
	return readFileSync(path, "utf8");
}

interface Harness {
	adapter: AuthRuntimePort;
	stored: string[];
	loginCalls: number;
	authPath: string;
	allowModelNetwork: boolean | undefined;
}

function harness(opts?: {
	check?: () => { type: AuthType } | null;
	login?: AuthRuntimePort["login"];
}): Harness {
	const state: Harness = {
		adapter: undefined as unknown as AuthRuntimePort,
		stored: [],
		loginCalls: 0,
		authPath: "",
		allowModelNetwork: undefined,
	};
	state.adapter = {
		async createRuntime(runtimeOpts) {
			state.authPath = runtimeOpts.authPath;
			state.allowModelNetwork = runtimeOpts.allowModelNetwork;
		},
		async login(providerId, type, interaction) {
			state.loginCalls += 1;
			if (opts?.login) {
				await opts.login(providerId, type, interaction);
				return;
			}
			const secret = await interaction.prompt({
				type: "secret",
				message: "Enter OpenAI API key",
			});
			if (secret !== undefined) {
				state.stored.push(secret);
			}
		},
		async logout() {},
		async checkAuth() {
			if (opts?.check) {
				return opts.check();
			}
			return state.stored.length > 0 ? { type: "api_key" } : null;
		},
		registerProvider() {},
		getModel() {
			return null;
		},
	};
	return state;
}

function roots(): { project: string; auth: string } {
	const parent = mkdtempSync(join(tmpdir(), "bug0029-"));
	const project = join(parent, "project");
	const auth = join(parent, "auth");
	mkdirSync(project);
	mkdirSync(auth);
	return { project, auth };
}

function filesContaining(root: string, needle: string): string[] {
	const hits: string[] = [];
	const stack = [root];
	while (stack.length > 0) {
		const dir = stack.pop();
		if (!dir) {
			continue;
		}
		for (const name of readdirSync(dir, { withFileTypes: true })) {
			const path = join(dir, name.name);
			if (name.isDirectory()) {
				stack.push(path);
				continue;
			}
			if (read(path).includes(needle)) {
				hits.push(path);
			}
		}
	}
	return hits;
}

test("test_bug0029_masked_tty_does_not_echo_or_argv", async () => {
	const cli = read(join(standaloneRoot, "packages", "auth-models", "src", "cli.ts"));
	const local = read(join(standaloneRoot, "apps", "cli", "src", "local-command.ts"));
	const run = read(join(standaloneRoot, "apps", "cli", "src", "run.ts"));
	const index = read(join(standaloneRoot, "apps", "cli", "src", "index.ts"));
	assert.equal(cli.includes("@its-magic/runtime-host"), false);
	assert.equal(cli.includes("@its-magic/pi-kernel"), false);
	assert.equal(cli.includes("node-pty"), false);
	assert.match(local, /prompt: \(message\) => readMaskedTtySecret\(message\)/);
	assert.match(run, /prompt: \(message\) => readMaskedTtySecret\(message\)/);
	assert.match(local, /await import\("@its-magic\/pi-kernel\/auth-runtime"\)/);
	assert.deepEqual(staticSpecifiers(local), ["./command-class.ts"]);
	assert.equal(
		staticSpecifiers(index).some((spec) => spec.includes("run.ts")),
		false,
	);
	assert.equal(process.argv.join(" ").includes(SECRET), false);

	const stdin = new ScriptedStdin(["masked-", "secret-", "bug0029", "\r"]);
	const stdout = new CaptureStdout();
	const secret = await readMaskedTtySecret("Enter OpenAI API key", { stdin, stdout });
	assert.equal(secret, SECRET);
	assert.equal(stdout.chunks.join(""), "Enter OpenAI API key\n");
	assert.equal(stdout.chunks.join("").includes(SECRET), false);
	assert.deepEqual(stdin.calls, [true, false]);
	assert.equal(stdin.isRaw, false);

	const alreadyRaw = new ScriptedStdin(["\u0003"], true);
	const cancelled = await readMaskedTtySecret("Enter OpenAI API key", {
		stdin: alreadyRaw,
		stdout: new CaptureStdout(),
	});
	assert.equal(cancelled, undefined);
	assert.equal(alreadyRaw.calls[alreadyRaw.calls.length - 1], true);
	assert.equal(alreadyRaw.isRaw, true);

	const { project, auth } = roots();
	const box = harness();
	const cap = capture();
	const tty = new ScriptedStdin([`${SECRET}\n`]);
	const screen = new CaptureStdout();
	cap.io.stdinIsTTY = true;
	cap.io.prompt = (message) => readMaskedTtySecret(message, { stdin: tty, stdout: screen });
	const argv = ["auth", "login", "openai", "--type", "api_key"];
	const code = await dispatchItsmCommand(argv, {
		adapter: box.adapter,
		projectRoot: project,
		authDirOverride: auth,
		env: { HOME: project, USERPROFILE: project },
		io: cap.io,
	});
	assert.equal(code, 0, textOf(cap.stderr));
	assert.equal(argv.includes(SECRET), false);
	assert.equal(screen.chunks.join("").includes(SECRET), false);
	assertNoSecret(cap.stdout);
	assertNoSecret(cap.stderr);
	assert.deepEqual(box.stored, [SECRET]);
	assert.equal(box.allowModelNetwork, false);
});

test("test_bug0029_api_key_stdin_one_line", async () => {
	const { project, auth } = roots();
	const box = harness();
	const cap = capture();
	let prompted = false;
	cap.io.stdinIsTTY = true;
	cap.io.readStdinLine = async () => `${SECRET}\r\n`;
	cap.io.prompt = async () => {
		prompted = true;
		return "tty-secret";
	};
	const argv = ["auth", "login", "openai", "--type", "api_key", "--api-key-stdin"];
	const code = await dispatchItsmCommand(argv, {
		adapter: box.adapter,
		projectRoot: project,
		authDirOverride: auth,
		env: { HOME: project, USERPROFILE: project },
		io: cap.io,
	});
	assert.equal(code, 0, textOf(cap.stderr));
	assert.equal(prompted, false);
	assert.deepEqual(box.stored, [SECRET]);
	assert.equal(cap.stdout.includes(CONFIGURED), true);
	assertNoSecret(cap.stdout);
	assertNoSecret(cap.stderr);
	assert.equal(argv.includes(SECRET), false);

	const rejected = [SECRET, `--api-key=${SECRET}`, SECRET];
	const forms = [
		["auth", "login", "openai", "--api-key", SECRET],
		["auth", "login", "openai", `--api-key=${SECRET}`],
		["auth", "login", "openai", "--api-key-stdin", SECRET],
	];
	for (const form of forms) {
		const next = harness();
		const out = capture();
		out.io.stdinIsTTY = true;
		const status = await dispatchItsmCommand(form, {
			adapter: next.adapter,
			projectRoot: project,
			authDirOverride: auth,
			env: { HOME: project, USERPROFILE: project },
			io: out.io,
		});
		assert.equal(status, 1);
		assert.equal(next.loginCalls, 0);
		assert.deepEqual(out.stderr, [LOGIN_USAGE]);
		assertNoConfigured(out.stdout);
		for (const secret of rejected) {
			assertNoSecret(out.stdout, secret);
			assertNoSecret(out.stderr, secret);
		}
	}

	const help = read(join(standaloneRoot, "apps", "cli", "src", "command-class.ts"));
	const run = read(join(standaloneRoot, "apps", "cli", "src", "run.ts"));
	const active = read(join(repoRoot, "its_magic", "README.md"));
	const template = read(join(repoRoot, "template", "its_magic", "README.md"));
	const shape = "itsm auth login openai --type api_key --api-key-stdin";
	assert.match(help, /--api-key-stdin/);
	assert.match(run, /--api-key-stdin/);
	assert.match(active, new RegExp(shape.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
	assert.equal(active.includes(shape), true);
	assert.equal(template.includes(shape), true);
});

test("test_bug0029_non_tty_without_flag_is_nonzero", async () => {
	const { project, auth } = roots();
	const box = harness();
	const cap = capture();
	cap.io.stdinIsTTY = false;
	const code = await dispatchItsmCommand(["auth", "login", "openai", "--type", "api_key"], {
		adapter: box.adapter,
		projectRoot: project,
		authDirOverride: auth,
		env: { HOME: project, USERPROFILE: project },
		io: cap.io,
	});
	assert.equal(code, 1);
	assert.deepEqual(cap.stderr, ["AUTH_LOGIN_TTY_REQUIRED"]);
	assert.equal(box.loginCalls, 0);
	assertNoConfigured(cap.stdout);

	const oauthCi = harness();
	const ciCap = capture();
	ciCap.io.stdinIsTTY = false;
	const ciCode = await dispatchItsmCommand(["auth", "login", "openai", "--type", "oauth"], {
		adapter: oauthCi.adapter,
		projectRoot: project,
		authDirOverride: auth,
		env: { HOME: project, USERPROFILE: project },
		ci: true,
		io: ciCap.io,
	});
	assert.equal(ciCode, 1);
	assert.deepEqual(ciCap.stderr, ["oauth login is not available in CI"]);
	assert.equal(oauthCi.loginCalls, 0);
	assertNoConfigured(ciCap.stdout);

	const oauth = harness({
		check: () => ({ type: "oauth" }),
		login: async () => {},
	});
	const oauthCap = capture();
	oauthCap.io.stdinIsTTY = false;
	const oauthCode = await dispatchItsmCommand(["auth", "login", "openai", "--type", "oauth"], {
		adapter: oauth.adapter,
		projectRoot: project,
		authDirOverride: auth,
		env: { HOME: project, USERPROFILE: project },
		ci: false,
		io: oauthCap.io,
	});
	assert.equal(oauthCode, 0, textOf(oauthCap.stderr));
	assert.equal(oauth.loginCalls, 1);
	assert.equal(oauthCap.stderr.includes("AUTH_LOGIN_TTY_REQUIRED"), false);
});

test("test_bug0029_cancel_empty_invalid_persist_never_configured", async () => {
	const { project, auth } = roots();
	const cases: Array<{
		token: string;
		secret?: string;
		login?: AuthRuntimePort["login"];
		check?: () => { type: AuthType } | null;
		signal?: AbortSignal;
	}> = [
		{
			token: "AUTH_LOGIN_CANCELLED",
			login: async (_provider, _type, interaction) => {
				await interaction.prompt({ type: "secret", message: "Enter OpenAI API key" });
			},
		},
		{
			token: "AUTH_LOGIN_CANCELLED",
			login: async (_provider, _type, interaction) => {
				const value = await interaction.prompt({
					type: "secret",
					message: "Enter OpenAI API key",
					signal: AbortSignal.abort(),
				});
				assert.fail(`aborted secret prompt returned ${String(value)}`);
			},
		},
		{
			token: "AUTH_LOGIN_EMPTY",
			secret: "   \t",
		},
		{
			token: "AUTH_LOGIN_EMPTY",
			secret: "",
		},
		{
			token: "AUTH_LOGIN_INVALID",
			login: async () => {
				throw new Error(`provider rejected ${SECRET}`);
			},
		},
		{
			token: "AUTH_LOGIN_INVALID",
			check: () => null,
			secret: SECRET,
		},
		{
			token: "AUTH_LOGIN_INVALID",
			check: () => ({ type: "oauth" }),
			secret: SECRET,
		},
		{
			token: "AUTH_SYNC_FAILED",
			login: async () => {
				const err = new Error(`sync blew up ${SECRET}`);
				err.name = "CredentialSynchronizationError";
				throw err;
			},
		},
	];
	for (const item of cases) {
		const box = harness({
			check: item.check,
			login: item.login,
		});
		const cap = capture();
		cap.io.stdinIsTTY = true;
		cap.io.prompt = async (message) => {
			assert.equal(message.includes(SECRET), false);
			if (item.signal?.aborted) {
				return undefined;
			}
			return item.secret;
		};
		const code = await dispatchItsmCommand(["auth", "login", "openai", "--type", "api_key"], {
			adapter: box.adapter,
			projectRoot: project,
			authDirOverride: auth,
			env: { HOME: project, USERPROFILE: project },
			io: cap.io,
		});
		assert.equal(code, 1, item.token);
		assert.deepEqual(cap.stderr, [item.token], item.token);
		assertNoConfigured(cap.stdout);
		assertNoSecret(cap.stdout);
		assertNoSecret(cap.stderr);
		if (item.token === "AUTH_LOGIN_EMPTY" || item.token === "AUTH_LOGIN_CANCELLED") {
			assert.deepEqual(box.stored, []);
		}
	}

	const stdinEmpty = harness();
	const emptyCap = capture();
	emptyCap.io.readStdinLine = async () => " \r\n";
	const emptyCode = await dispatchItsmCommand(["auth", "login", "openai", "--api-key-stdin"], {
		adapter: stdinEmpty.adapter,
		projectRoot: project,
		authDirOverride: auth,
		env: { HOME: project, USERPROFILE: project },
		io: emptyCap.io,
	});
	assert.equal(emptyCode, 1);
	assert.deepEqual(emptyCap.stderr, ["AUTH_LOGIN_EMPTY"]);
	assert.equal(stdinEmpty.loginCalls, 0);
	assert.deepEqual(stdinEmpty.stored, []);
	assertNoConfigured(emptyCap.stdout);
});

test("test_bug0029_success_only_after_check_auth", async () => {
	const { project, auth } = roots();
	const blocked = harness({ check: () => null });
	const blockedCap = capture();
	blockedCap.io.stdinIsTTY = true;
	blockedCap.io.prompt = async () => SECRET;
	const blockedCode = await dispatchItsmCommand(["auth", "login", "openai"], {
		adapter: blocked.adapter,
		projectRoot: project,
		authDirOverride: auth,
		env: { HOME: project, USERPROFILE: project },
		io: blockedCap.io,
	});
	assert.equal(blockedCode, 1);
	assert.deepEqual(blockedCap.stderr, ["AUTH_LOGIN_INVALID"]);
	assertNoConfigured(blockedCap.stdout);
	assert.equal(blocked.loginCalls, 1);

	let sawConfiguredBeforeCheck = false;
	const cap = capture();
	const box = harness({
		check: () => {
			sawConfiguredBeforeCheck = cap.stdout.includes(CONFIGURED);
			return { type: "api_key" };
		},
	});
	cap.io.stdinIsTTY = true;
	cap.io.prompt = async () => SECRET;
	const code = await dispatchItsmCommand(["auth", "login", "openai", "--type", "api_key"], {
		adapter: box.adapter,
		projectRoot: project,
		authDirOverride: auth,
		env: { HOME: project, USERPROFILE: project },
		io: cap.io,
	});
	assert.equal(code, 0, textOf(cap.stderr));
	assert.equal(sawConfiguredBeforeCheck, false);
	assert.equal(cap.stdout.includes(CONFIGURED), true);
	assertNoSecret(cap.stdout);
	assertNoSecret(cap.stderr);
	assert.equal(box.allowModelNetwork, false);
});

test("test_bug0029_list_logout_migrate_unchanged", async () => {
	const { project, auth } = roots();
	const listed = harness({ check: () => ({ type: "api_key" }) });
	const listCap = capture();
	const listCode = await dispatchItsmCommand(["auth", "list"], {
		adapter: listed.adapter,
		projectRoot: project,
		authDirOverride: auth,
		env: { HOME: project, USERPROFILE: project },
		io: listCap.io,
	});
	assert.equal(listCode, 0, textOf(listCap.stderr));
	const parsed = JSON.parse(textOf(listCap.stdout)) as {
		providers: { providerId: string; type: string }[];
	};
	assert.equal(parsed.providers.length, KNOWN_PROVIDER_IDS.length);
	assert.equal(
		parsed.providers.some((row) => row.providerId === "openai" && row.type === "api_key"),
		true,
	);
	assertNoConfigured(listCap.stdout);

	const loggedOut = harness();
	const outCap = capture();
	const outCode = await dispatchItsmCommand(["auth", "logout", "openai"], {
		adapter: loggedOut.adapter,
		projectRoot: project,
		authDirOverride: auth,
		env: { HOME: project, USERPROFILE: project },
		io: outCap.io,
	});
	assert.equal(outCode, 0, textOf(outCap.stderr));
	assert.deepEqual(outCap.stdout, [JSON.stringify({ provider: "openai", auth: "missing" })]);

	const migrated = harness();
	const migrateCap = capture();
	const migrateCode = await dispatchItsmCommand(["auth", "migrate", "--from-pi"], {
		adapter: migrated.adapter,
		projectRoot: project,
		authDirOverride: auth,
		env: { HOME: project, USERPROFILE: project },
		io: migrateCap.io,
	});
	assert.equal(migrateCode, 0, textOf(migrateCap.stderr));
	assert.deepEqual(migrateCap.stdout, [
		JSON.stringify({ migrated: false, dest: "owned-auth-dir" }),
	]);
	assert.equal(migrated.loginCalls, 0);

	const models = harness({ check: () => ({ type: "api_key" }) });
	const modelsCap = capture();
	const modelsCode = await dispatchItsmCommand(["models", "list"], {
		adapter: models.adapter,
		projectRoot: project,
		authDirOverride: auth,
		env: { HOME: project, USERPROFILE: project },
		io: modelsCap.io,
	});
	assert.equal(modelsCode, 0, textOf(modelsCap.stderr));
	assert.equal(textOf(modelsCap.stdout).includes('"slugs"'), true);

	const tested = harness({ check: () => ({ type: "api_key" }) });
	const testCap = capture();
	const testCode = await dispatchItsmCommand(["models", "test", "openai/default"], {
		adapter: tested.adapter,
		projectRoot: project,
		authDirOverride: auth,
		env: { HOME: project, USERPROFILE: project },
		io: testCap.io,
	});
	assert.equal(testCode, 0, textOf(testCap.stderr));
	assert.deepEqual(testCap.stdout, [
		JSON.stringify({ provider: "openai", model: "default", auth: "configured", health: "ok" }),
	]);
});

test("test_bug0029_secret_absent_outside_owned_store", async () => {
	const { project, auth } = roots();
	writeFileSync(join(project, "notes.txt"), "no credential here");
	const decoy = join(project, "..", "decoy");
	mkdirSync(decoy);
	writeFileSync(join(decoy, "notes.txt"), "still no credential");
	const box = harness({
		login: async (_provider, _type, interaction) => {
			const secret = await interaction.prompt({
				type: "select",
				message: "pick a plan",
				options: [
					{ id: "choice-a", label: "A" },
					{ id: "choice-b", label: "B" },
				],
			});
			assert.equal(secret, "choice-a");
			const key = await interaction.prompt({ type: "secret", message: "Enter OpenAI API key" });
			assert.equal(key, SECRET);
			assert.notEqual(key, "choice-a");
			writeFileSync(box.authPath, JSON.stringify({ apiKey: key }));
			box.stored.push(key ?? "");
		},
	});
	const cap = capture();
	cap.io.readStdinLine = async () => `${SECRET}\n`;
	const argv = ["auth", "login", "openai", "--type", "api_key", "--api-key-stdin"];
	const code = await dispatchItsmCommand(argv, {
		adapter: box.adapter,
		projectRoot: project,
		authDirOverride: auth,
		env: { HOME: project, USERPROFILE: project },
		io: cap.io,
	});
	assert.equal(code, 0, textOf(cap.stderr));
	assert.equal(argv.join(" ").includes(SECRET), false);
	assertNoSecret(cap.stdout);
	assertNoSecret(cap.stderr);
	assert.equal(filesContaining(project, SECRET).length, 0);
	assert.equal(filesContaining(decoy, SECRET).length, 0);
	assert.equal(box.authPath.startsWith(auth), true);
	assert.equal(read(box.authPath).includes(SECRET), true);
	assert.equal(box.allowModelNetwork, false);
});
