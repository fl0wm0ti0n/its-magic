import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { APP_RUNTIME_UNSUPPORTED_STACK, AppRuntimeError } from "./codes.ts";
import type { StackDiscovery, StackProfile } from "./types.ts";

const START_COMMANDS: Record<StackProfile, string> = {
	node: "npm start",
	python: "python -m uvicorn",
	go: "go run .",
	dotnet: "dotnet run",
	java: "mvn --quiet spring-boot:run",
};

const TEST_COMMANDS: Record<StackProfile, string> = {
	node: "npm test",
	python: "python -m pytest",
	go: "go test ./...",
	dotnet: "dotnet test",
	java: "mvn test",
};

const BUILD_COMMANDS: Record<StackProfile, string> = {
	node: "npm run build",
	python: "python -m build",
	go: "go build ./...",
	dotnet: "dotnet build",
	java: "mvn package",
};

/** Port of scripts/uat_probe_lib.detect_stack_profile. Do not spawn Python. */
export function detectStackProfile(repo: string): StackProfile | null {
	if (existsSync(join(repo, "package.json"))) {
		return "node";
	}
	if (existsSync(join(repo, "pyproject.toml")) || existsSync(join(repo, "setup.py"))) {
		return "python";
	}
	if (existsSync(join(repo, "go.mod"))) {
		return "go";
	}
	try {
		if (readdirSync(repo).some((name) => name.endsWith(".csproj"))) {
			return "dotnet";
		}
	} catch {
		/* missing dir */
	}
	if (existsSync(join(repo, "pom.xml"))) {
		return "java";
	}
	return null;
}

export function discoverStack(
	cwd: string,
	overrides?: { start_command?: string; DEV_SERVER_COMMAND?: string },
): StackDiscovery {
	const profile = detectStackProfile(cwd);
	const override = overrides?.DEV_SERVER_COMMAND || overrides?.start_command;
	if (!profile && !override) {
		throw new AppRuntimeError(
			APP_RUNTIME_UNSUPPORTED_STACK,
			"no stack profile and no start_command override",
		);
	}
	if (!profile && override) {
		return {
			profile: null,
			start_command: override,
			test_command: override,
			build_command: override,
		};
	}
	const resolved = profile as StackProfile;
	return {
		profile: resolved,
		start_command: override ?? START_COMMANDS[resolved],
		test_command: TEST_COMMANDS[resolved],
		build_command: BUILD_COMMANDS[resolved],
	};
}
