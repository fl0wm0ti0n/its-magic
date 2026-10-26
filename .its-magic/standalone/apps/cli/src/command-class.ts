/**
 * Argv class for `itsm`. Node builtins only.
 * Classification strips `--validator=` and `--policy-probe` for the class
 * decision. It does not run a policy probe and does not strip a leading slash.
 */

export type CommandClass = "help" | "local" | "status" | "workflow";

export function stripClassificationFlags(argv: string[]): string[] {
	const commandArgv: string[] = [];
	for (const arg of argv) {
		if (arg.startsWith("--validator=")) {
			continue;
		}
		if (arg === "--policy-probe") {
			continue;
		}
		commandArgv.push(arg);
	}
	return commandArgv;
}

export function classifyCommand(argv: string[]): CommandClass {
	const token = stripClassificationFlags(argv)[0];
	if (!token || token === "help" || token === "--help" || token === "-h") {
		return "help";
	}
	if (token === "auth" || token === "models") {
		return "local";
	}
	if (token === "status") {
		return "status";
	}
	return "workflow";
}

export function printCliHelp(): void {
	console.log(`itsm - its-magic operator CLI

Usage:
  itsm status
  itsm resume
  itsm auth <list|login|logout|migrate>
  itsm auth login <provider> --type api_key --api-key-stdin
  itsm models <list|test>
  itsm <phase-or-command>

Run 'itsm status' to inspect the installed repository.`);
}
