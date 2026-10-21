import { stripClassificationFlags } from "./command-class.ts";

export function localSubcommandNeedsAuthRuntime(commandArgv: string[]): boolean {
	const [cmd, sub] = commandArgv;
	if (cmd === "auth" && (sub === "list" || sub === "login" || sub === "logout")) {
		return true;
	}
	return cmd === "models" && sub === "test";
}

function unusedAuthAdapter(): {
	createRuntime: () => Promise<void>;
	login: () => Promise<void>;
	logout: () => Promise<void>;
	checkAuth: () => Promise<null>;
	registerProvider: () => void;
	getModel: () => null;
} {
	const fail = (): never => {
		throw new Error("AUTH_RUNTIME_NOT_LOADED");
	};
	return {
		createRuntime: async () => {
			fail();
		},
		login: async () => {
			fail();
		},
		logout: async () => {
			fail();
		},
		checkAuth: async () => {
			fail();
		},
		registerProvider: () => {
			fail();
		},
		getModel: () => {
			fail();
		},
	};
}

export async function runLocalCommand(argv: string[], projectRoot: string): Promise<number> {
	const { dispatchItsmCommand, readMaskedTtySecret } = await import("@its-magic/auth-models");
	const commandArgv = stripClassificationFlags(argv);
	const adapter = localSubcommandNeedsAuthRuntime(commandArgv)
		? (await import("@its-magic/pi-kernel/auth-runtime")).createAuthRuntimeAdapter()
		: unusedAuthAdapter();
	return dispatchItsmCommand(commandArgv, {
		adapter,
		projectRoot,
		env: process.env,
		io: {
			stdout: (line) => console.log(line),
			stderr: (line) => console.error(line),
			prompt: (message) => readMaskedTtySecret(message),
		},
	});
}
